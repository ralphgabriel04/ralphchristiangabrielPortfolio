/* global React, ReactDOM, Icons, cn, useState, useEffect, useRef,
          TOUR_MODULES, TOUR_OVERVIEW_ORDER, getTourModule, getTourKeyFeatures */

/* ============================================================
   GUIDED TOUR ENGINE (P19)

   Lives in its own state on window.__dpmTour, mirroring the existing
   store pattern (useHabits / useGoals…). Public events:
     dpm-tour-start | dpm-tour-next | dpm-tour-prev |
     dpm-tour-skip  | dpm-tour-end  | dpm-tour-change
   Hook: useTour() → live state snapshot.

   Two flows:
     • "overview" — spotlights each of the 11 nav destinations in order;
        every step offers "Explorer ce module →".
     • "module"   — navigates to a module's page then spotlights its 2–3
        KEY features. Step counter reads "Calendrier · 2/3".

   Robustness (P11.7 + P15):
     • Targets resolved by [data-tour="…"] at step time. A hidden/absent
       target is silently skipped (works with widget reorder + hide).
     • The spotlight cutout never sits under the FAB / × / widget controls
       because the bubble is positioned away from the target.
   Persistence: localStorage["dpm-tour-completed"] = { overview:true, … }.
============================================================ */

const TOUR_KEY_COMPLETED = "dpm-tour-completed";
const TOUR_KEY_SEEN = "dpm-tour-overview-seen";

function tourReadCompleted() {
  try { return JSON.parse(localStorage.getItem(TOUR_KEY_COMPLETED) || "{}") || {}; }
  catch { return {}; }
}
function tourWriteCompleted(obj) {
  try { localStorage.setItem(TOUR_KEY_COMPLETED, JSON.stringify(obj)); } catch {}
  window.dispatchEvent(new CustomEvent("dpm-tour-completed-change", { detail: obj }));
}
function tourMarkCompleted(id) {
  const c = tourReadCompleted();
  c[id] = true;
  tourWriteCompleted(c);
}
function tourResetCompleted() {
  try {
    localStorage.removeItem(TOUR_KEY_COMPLETED);
    localStorage.removeItem(TOUR_KEY_SEEN);
    localStorage.removeItem("dpm-welcome-dismissed");
  } catch {}
  tourWriteCompleted({});
}

/* Route bridge — app registers window.__dpmNavigate(route). */
function tourNavigate(route) {
  if (typeof window.__dpmNavigate === "function") window.__dpmNavigate(route);
}
/* Deep-link bridge — resources page registers window.__dpmOpenResources(moduleId?). */
function tourOpenResources(moduleId) {
  if (typeof window.__dpmOpenResources === "function") window.__dpmOpenResources(moduleId);
  else { tourNavigate("resources"); setTimeout(() => window.__dpmOpenResources?.(moduleId), 250); }
}

/* ============================================================
   CONTROLLER
============================================================ */
const Tour = {
  state: { active: false, flow: null, moduleId: null, stepIndex: 0, steps: [], paused: false },

  _commit(evt) {
    window.dispatchEvent(new CustomEvent("dpm-tour-" + evt, { detail: this.state }));
    if (evt !== "change") window.dispatchEvent(new CustomEvent("dpm-tour-change", { detail: this.state }));
  },
  _set(patch) { this.state = { ...this.state, ...patch }; },

  buildOverviewSteps() {
    return TOUR_OVERVIEW_ORDER.map(id => {
      const m = getTourModule(id);
      return {
        kind: "overview", moduleId: id, route: m.route, navId: m.navId,
        sel: "nav-" + m.route, icon: m.icon,
        groupLabel: "Guided tour", title: m.label, body: m.blurb, learnMore: id,
      };
    });
  },
  buildModuleSteps(id) {
    const m = getTourModule(id);
    return getTourKeyFeatures(id).map(f => ({
      kind: "module", moduleId: id, route: m.route, sel: f.sel, icon: m.icon,
      groupLabel: m.label, title: f.title, body: f.body, featureLabel: f.label, learnMore: id,
    }));
  },

  startOverview() {
    const steps = this.buildOverviewSteps();
    tourNavigate("home");
    this._set({ active: true, flow: "overview", moduleId: null, stepIndex: 0, steps, paused: false });
    try { localStorage.setItem(TOUR_KEY_SEEN, "1"); } catch {}
    this._commit("start");
  },
  startModule(id) {
    const steps = this.buildModuleSteps(id);
    if (!steps.length) { tourOpenResources(id); return; }
    const m = getTourModule(id);
    tourNavigate(m.route);
    this._set({ active: true, flow: "module", moduleId: id, stepIndex: 0, steps, paused: false });
    this._commit("start");
  },
  /* "Explorer ce module →" from an overview step. */
  explore() {
    const cur = this.state.steps[this.state.stepIndex];
    if (cur) this.startModule(cur.moduleId);
  },
  next() {
    if (this.state.stepIndex < this.state.steps.length - 1) {
      this._set({ stepIndex: this.state.stepIndex + 1 });
      this._commit("next");
    } else {
      this.finish();
    }
  },
  prev() {
    if (this.state.stepIndex > 0) {
      this._set({ stepIndex: this.state.stepIndex - 1 });
      this._commit("prev");
    }
  },
  goTo(i) {
    if (i >= 0 && i < this.state.steps.length) {
      this._set({ stepIndex: i });
      this._commit("change");
    }
  },
  /* Auto-skip a step whose target can't be found (hidden widget etc.). */
  skipMissing() {
    if (this.state.stepIndex < this.state.steps.length - 1) {
      this._set({ stepIndex: this.state.stepIndex + 1 });
      this._commit("change");
    } else {
      this.finish();
    }
  },
  skip() {
    if (this.state.flow === "overview") { try { localStorage.setItem(TOUR_KEY_SEEN, "1"); } catch {} }
    this._set({ active: false });
    this._commit("skip");
    this._commit("end");
  },
  finish() {
    if (this.state.flow === "overview") {
      tourMarkCompleted("overview");
      try { localStorage.setItem(TOUR_KEY_SEEN, "1"); } catch {}
    } else if (this.state.moduleId) {
      tourMarkCompleted(this.state.moduleId);
    }
    this._set({ active: false });
    this._commit("end");
  },
  openResources(moduleId) { tourOpenResources(moduleId); },
};

if (typeof window !== "undefined") window.__dpmTour = Tour;

/* Hook — re-renders on any tour change. */
function useTour() {
  const [state, setState] = useState(Tour.state);
  useEffect(() => {
    const h = (e) => setState({ ...e.detail });
    window.addEventListener("dpm-tour-change", h);
    return () => window.removeEventListener("dpm-tour-change", h);
  }, []);
  return state;
}

/* Completion map hook (for nav ✓ + replay menu). */
function useTourCompleted() {
  const [c, setC] = useState(tourReadCompleted);
  useEffect(() => {
    const h = (e) => setC({ ...(e.detail || {}) });
    window.addEventListener("dpm-tour-completed-change", h);
    return () => window.removeEventListener("dpm-tour-completed-change", h);
  }, []);
  return c;
}

/* ============================================================
   TARGET ACQUISITION — find [data-tour="sel"], scroll into view
   (without scrollIntoView), and keep its rect in sync.
   Returns: null (searching) | "missing" | {top,left,width,height}
============================================================ */
function scrollableAncestor(el) {
  let p = el.parentElement;
  while (p) {
    const s = getComputedStyle(p);
    if (/(auto|scroll)/.test(s.overflowY) && p.scrollHeight > p.clientHeight) return p;
    p = p.parentElement;
  }
  return null;
}
function ensureVisible(el) {
  const sc = scrollableAncestor(el);
  if (!sc) return;
  const er = el.getBoundingClientRect();
  const cr = sc.getBoundingClientRect();
  const pad = 24;
  if (er.top < cr.top + pad) sc.scrollTop -= (cr.top + pad - er.top);
  else if (er.bottom > cr.bottom - pad) sc.scrollTop += (er.bottom - cr.bottom + pad);
}

function useTargetRect(sel, active, stepKey) {
  const [rect, setRect] = useState(null);
  useEffect(() => {
    if (!active || !sel) { setRect(null); return; }
    let cancelled = false, timer = null, tries = 0;
    const find = () => document.querySelector(`[data-tour="${sel}"]`);
    const measure = (el) => {
      const r = el.getBoundingClientRect();
      if (!cancelled) setRect({ top: r.top, left: r.left, width: r.width, height: r.height });
    };
    const attempt = () => {
      if (cancelled) return;
      const el = find();
      if (el && el.getBoundingClientRect().width > 0) {
        ensureVisible(el);
        requestAnimationFrame(() => { if (!cancelled) { const e2 = find(); if (e2) measure(e2); } });
      } else if (tries < 40) {
        tries++; timer = setTimeout(attempt, 50);
      } else {
        if (!cancelled) setRect("missing");
      }
    };
    setRect(null);
    attempt();
    const sync = () => { const el = find(); if (el) measure(el); };
    window.addEventListener("resize", sync);
    window.addEventListener("scroll", sync, true);
    const poll = setInterval(sync, 400);
    return () => {
      cancelled = true; clearTimeout(timer); clearInterval(poll);
      window.removeEventListener("resize", sync);
      window.removeEventListener("scroll", sync, true);
    };
  }, [sel, active, stepKey]);
  return rect;
}

/* ============================================================
   BUBBLE POSITIONING — choose the side with the most room.
============================================================ */
function computeBubble(rect, bw, bh, vw, vh) {
  const gap = 16, pad = 16;
  const room = {
    right: vw - (rect.left + rect.width),
    left: rect.left,
    bottom: vh - (rect.top + rect.height),
    top: rect.top,
  };
  let side = "right";
  if (room.right >= bw + gap) side = "right";
  else if (room.left >= bw + gap) side = "left";
  else if (room.bottom >= bh + gap) side = "bottom";
  else if (room.top >= bh + gap) side = "top";
  else side = room.bottom >= room.top ? "bottom" : "top";

  let top, left;
  if (side === "right") { left = rect.left + rect.width + gap; top = rect.top + rect.height / 2 - bh / 2; }
  else if (side === "left") { left = rect.left - gap - bw; top = rect.top + rect.height / 2 - bh / 2; }
  else if (side === "bottom") { top = rect.top + rect.height + gap; left = rect.left + rect.width / 2 - bw / 2; }
  else { top = rect.top - gap - bh; left = rect.left + rect.width / 2 - bw / 2; }

  left = Math.max(pad, Math.min(left, vw - bw - pad));
  top = Math.max(pad, Math.min(top, vh - bh - pad));
  return { side, top, left };
}

/* ============================================================
   TOUR LAYER — the full-screen overlay. Mounted once by the app.
============================================================ */
function TourLayer({ mobile }) {
  const st = useTour();
  const step = st.active ? st.steps[st.stepIndex] : null;
  const rect = useTargetRect(step?.sel, st.active, st.stepIndex + ":" + (step?.sel || ""));
  const bubbleRef = useRef(null);
  const [pos, setPos] = useState(null);
  const [bubbleSize, setBubbleSize] = useState({ w: 340, h: 220 });

  // Auto-skip missing targets (hidden widgets etc.)
  useEffect(() => {
    if (st.active && rect === "missing") {
      const t = setTimeout(() => Tour.skipMissing(), 50);
      return () => clearTimeout(t);
    }
  }, [rect, st.active, st.stepIndex]);

  // Measure bubble then position it (desktop only — mobile is a fixed sheet).
  useEffect(() => {
    if (mobile || !rect || rect === "missing") { setPos(null); return; }
    const el = bubbleRef.current;
    const w = el?.offsetWidth || bubbleSize.w;
    const h = el?.offsetHeight || bubbleSize.h;
    setPos(computeBubble(rect, w, h, window.innerWidth, window.innerHeight));
  }, [rect, mobile, st.stepIndex, bubbleSize.w, bubbleSize.h]);

  useEffect(() => {
    if (!bubbleRef.current) return;
    const r = bubbleRef.current.getBoundingClientRect();
    if (Math.abs(r.width - bubbleSize.w) > 2 || Math.abs(r.height - bubbleSize.h) > 2) {
      setBubbleSize({ w: r.width, h: r.height });
    }
  });

  // Esc closes; arrows navigate.
  useEffect(() => {
    if (!st.active) return;
    const onKey = (e) => {
      if (e.key === "Escape") { e.preventDefault(); Tour.skip(); }
      else if (e.key === "ArrowRight") { e.preventDefault(); Tour.next(); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); Tour.prev(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [st.active, st.stepIndex]);

  if (!st.active || !step) return null;
  const hasRect = rect && rect !== "missing";
  const PADDING = 8;
  const isLast = st.stepIndex === st.steps.length - 1;
  const module = getTourModule(step.moduleId);
  const IconC = Icons[step.icon] || Icons.Sparkles;

  // Spotlight hole geometry
  const hole = hasRect ? {
    top: rect.top - PADDING, left: rect.left - PADDING,
    width: rect.width + PADDING * 2, height: rect.height + PADDING * 2,
  } : null;

  const counter = (
    <span className="text-[11px] font-semibold tracking-wide text-[hsl(263_70%_80%)]">
      {step.groupLabel}{step.kind === "module" ? <> · <span className="tabular-nums">{st.stepIndex + 1}/{st.steps.length}</span></> : <> · <span className="tabular-nums">{st.stepIndex + 1}/{st.steps.length}</span></>}
    </span>
  );

  const dots = (
    <div className="flex items-center gap-1.5 flex-wrap">
      {st.steps.map((s, i) => (
        <button
          key={i}
          onClick={() => Tour.goTo(i)}
          aria-label={`Step ${i + 1}`}
          className={cn(
            "rounded-full transition-all duration-200",
            i === st.stepIndex ? "w-5 h-1.5 bg-[hsl(var(--primary))]"
              : i < st.stepIndex ? "w-1.5 h-1.5 bg-[hsl(263_70%_70%/0.7)]"
                : "w-1.5 h-1.5 bg-[hsl(var(--muted-foreground)/0.4)] hover:bg-[hsl(var(--muted-foreground)/0.7)]"
          )}
        />
      ))}
    </div>
  );

  const bubbleInner = (
    <>
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-6 h-6 rounded-[7px] gradient-violet flex items-center justify-center text-white flex-shrink-0">
            <IconC size={13} />
          </span>
          {counter}
        </div>
        <button
          onClick={() => Tour.skip()}
          title="Close the tour"
          aria-label="Close the tour"
          className="w-7 h-7 -mr-1 -mt-1 rounded-md text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--foreground))] flex items-center justify-center flex-shrink-0"
        >
          <Icons.X size={14} />
        </button>
      </div>

      <h3 className="text-[16px] font-bold tracking-tight leading-snug mb-1.5 text-[hsl(var(--foreground))]">{step.title}</h3>
      <p className="text-[13px] leading-relaxed text-[hsl(var(--muted-foreground))]">{step.body}</p>

      <button
        onClick={() => { Tour.openResources(step.learnMore); }}
        className="mt-2.5 inline-flex items-center gap-1 text-[12.5px] font-medium text-[hsl(263_70%_78%)] hover:text-[hsl(263_70%_88%)] transition-colors"
      >
        Learn more <Icons.ArrowRight size={12} />
      </button>

      {step.kind === "overview" && (
        <button
          onClick={() => Tour.explore()}
          className="mt-3 w-full h-9 rounded-[8px] border border-[hsl(var(--primary)/0.4)] bg-[hsl(var(--primary)/0.08)] hover:bg-[hsl(var(--primary)/0.15)] text-[hsl(263_70%_85%)] flex items-center justify-center gap-1.5 text-[12.5px] font-semibold transition-colors"
        >
          <IconC size={13} /> Explore this module
        </button>
      )}

      <div className="flex items-center justify-between gap-2 mt-3.5 pt-3 border-t border-[hsl(var(--border))]">
        {dots}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={() => Tour.skip()}
            className="h-8 px-2.5 rounded-[7px] text-[12px] font-medium text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))] transition-colors"
          >Skip</button>
          {st.stepIndex > 0 && (
            <button
              onClick={() => Tour.prev()}
              className="h-8 px-2.5 rounded-[7px] text-[12px] font-medium border border-[hsl(var(--border))] hover:bg-[hsl(var(--accent))] transition-colors"
            >Previous</button>
          )}
          <button
            onClick={() => Tour.next()}
            className="h-8 px-3.5 rounded-[7px] text-[12px] font-semibold bg-[hsl(var(--primary))] text-white hover:bg-[hsl(var(--primary)/0.9)] shadow-sm shadow-[hsl(var(--primary)/0.3)] transition-colors flex items-center gap-1"
          >
            {isLast ? "Finish" : "Next"}
            {!isLast && <Icons.ChevronRight size={13} />}
          </button>
        </div>
      </div>
    </>
  );

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[90]" style={{ pointerEvents: "none" }} aria-live="polite">
      {/* Dim layer + spotlight cutout (single box-shadow hole). */}
      {hole ? (
        <div
          className="absolute rounded-[12px]"
          style={{
            top: hole.top, left: hole.left, width: hole.width, height: hole.height,
            boxShadow: "0 0 0 9999px rgba(2, 8, 23, 0.74)",
            outline: "2px solid hsl(263 70% 65%)",
            outlineOffset: "0px",
            transition: "top .28s cubic-bezier(.33,1,.68,1), left .28s cubic-bezier(.33,1,.68,1), width .28s cubic-bezier(.33,1,.68,1), height .28s cubic-bezier(.33,1,.68,1)",
            pointerEvents: "none",
          }}
        >
          <div className="absolute inset-0 rounded-[12px] animate-[tourHalo_2s_ease-in-out_infinite]"
               style={{ boxShadow: "0 0 0 4px hsl(263 70% 60% / 0.25)" }} />
        </div>
      ) : (
        // No target yet: plain dim so the user is never on a half-state.
        <div className="absolute inset-0" style={{ background: "rgba(2,8,23,0.74)" }} />
      )}

      {/* Interaction blocker — keeps focus on the tour. Dismiss via ×, Passer, or Esc. */}
      <div
        className="absolute inset-0"
        style={{ pointerEvents: "auto" }}
        aria-hidden="true"
      />

      {/* Bubble — desktop popover */}
      {!mobile && (
        <div
          ref={bubbleRef}
          className="absolute w-[340px] max-w-[calc(100vw-32px)] rounded-[14px] border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-2xl p-4 anim-scale-in"
          style={{
            top: pos ? pos.top : "50%", left: pos ? pos.left : "50%",
            transform: pos ? "none" : "translate(-50%,-50%)",
            opacity: pos || !hasRect ? 1 : 0,
            pointerEvents: "auto",
            transition: "top .2s ease-out, left .2s ease-out",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {bubbleInner}
        </div>
      )}

      {/* Bubble — mobile bottom-sheet */}
      {mobile && (
        <div
          ref={bubbleRef}
          className="absolute left-0 right-0 bottom-0 rounded-t-[20px] border-t border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-2xl px-5 pt-3 pb-5"
          style={{ pointerEvents: "auto", animation: "tourSheetUp .28s cubic-bezier(.33,1,.68,1)" }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-10 h-1 rounded-full bg-[hsl(var(--muted-foreground)/0.3)] mx-auto mb-3" />
          {bubbleInner}
        </div>
      )}

      <style>{`
        @keyframes tourHalo { 0%,100%{ box-shadow: 0 0 0 4px hsl(263 70% 60% / 0.28);} 50%{ box-shadow: 0 0 0 9px hsl(263 70% 60% / 0.08);} }
        @keyframes tourSheetUp { from{ transform: translateY(100%);} to{ transform: translateY(0);} }
      `}</style>
    </div>,
    document.body
  );
}

/* ============================================================
   WELCOME BANNER — first visit on Home. Invites to launch the tour.
============================================================ */
function TourWelcomeBanner() {
  const completed = useTourCompleted();
  const st = useTour();
  const [dismissed, setDismissed] = useState(() => {
    try { return localStorage.getItem("dpm-welcome-dismissed") === "1"; } catch { return false; }
  });
  useEffect(() => {
    const h = () => { try { setDismissed(localStorage.getItem("dpm-welcome-dismissed") === "1"); } catch {} };
    window.addEventListener("dpm-tour-completed-change", h);
    return () => window.removeEventListener("dpm-tour-completed-change", h);
  }, []);
  if (completed.overview || dismissed || st.active) return null;

  const later = () => { try { localStorage.setItem("dpm-welcome-dismissed", "1"); } catch {} setDismissed(true); };

  return (
    <div className="welcome-banner relative overflow-hidden rounded-[14px] border border-[hsl(var(--primary)/0.35)] p-4 mb-1 anim-fade-in">
      <div className="absolute -right-8 -top-10 w-40 h-40 rounded-full gradient-violet opacity-20 blur-2xl pointer-events-none" />
      <div className="flex items-start gap-3.5 relative">
        <div className="w-11 h-11 rounded-[12px] gradient-violet flex items-center justify-center text-white flex-shrink-0 shadow-lg shadow-[hsl(var(--primary)/0.4)]">
          <Icons.Sparkles size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="welcome-banner__title text-[15px] font-bold tracking-tight">Welcome to DPM Elevate 👋</h3>
          <p className="text-[12.5px] text-[hsl(var(--muted-foreground))] mt-0.5 leading-relaxed max-w-xl">
            Eleven modules, one app. In under 2 minutes, the guided tour shows you where to start — and you can dive into any module whenever you want.
          </p>
          <div className="flex items-center gap-2 mt-3">
            <button
              onClick={() => Tour.startOverview()}
              className="h-9 px-4 rounded-[8px] bg-[hsl(var(--primary))] text-white text-[12.5px] font-semibold hover:bg-[hsl(var(--primary)/0.9)] shadow-sm shadow-[hsl(var(--primary)/0.3)] flex items-center gap-1.5 transition-colors"
            >
              <Icons.Play size={13} /> Start the tour
            </button>
            <button
              onClick={later}
              className="h-9 px-3 rounded-[8px] text-[12.5px] font-medium text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))] transition-colors"
            >
              Later
            </button>
          </div>
        </div>
        <button
          onClick={later}
          aria-label="Later"
          className="w-7 h-7 rounded-md text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--foreground))] flex items-center justify-center flex-shrink-0 -mt-1 -mr-1"
        >
          <Icons.X size={14} />
        </button>
      </div>
    </div>
  );
}

/* ============================================================
   HELP "?" FAB — persistent, opposite corner from the new-task FAB.
   Menu: full tour · per-module grid (11) · open resource center.
============================================================ */
function TourHelpButton({ mobile, onOpenResources, anchor }) {
  const [open, setOpen] = useState(false);
  const completed = useTourCompleted();
  const st = useTour();
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const k = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", h);
    document.addEventListener("keydown", k);
    return () => { document.removeEventListener("mousedown", h); document.removeEventListener("keydown", k); };
  }, [open]);

  if (st.active) return null; // never overlaps the running tour

  // anchor variants:
  //   "content"   → floating, absolute in content column (legacy/desktop fallback)
  //   "dock-bar"  → inline full-width row, docked in the expanded right sidebar
  //   "dock-rail" → inline icon, docked in the collapsed right sidebar
  //   (mobile)    → viewport-fixed FAB
  const docked = anchor === "dock-bar" || anchor === "dock-rail";
  const positionClass = docked ? "relative" : (anchor === "content" ? "absolute z-[60]" : "fixed z-[70]");
  const positionStyle = docked ? {} : (anchor === "content"
    ? { left: 20, bottom: 20 }
    : (mobile ? { right: 16, bottom: 84 } : { left: 20, bottom: 20 }));
  const alignRight = anchor === "dock-bar" || anchor === "dock-rail" || positionStyle.right !== undefined;
  // Menu opens upward; for docked variants anchor it to the right edge so it
  // floats over the content area, never clipped by the sidebar.
  const menuPosClass = anchor === "dock-rail"
    ? "bottom-0 right-[44px]"
    : anchor === "dock-bar"
      ? "bottom-[48px] right-0"
      : cn("bottom-[52px]", alignRight ? "right-0" : "left-0");

  return (
    <div
      ref={ref}
      className={positionClass}
      style={positionStyle}
    >
      {open && (
        <div className={cn("absolute w-[300px] max-w-[calc(100vw-32px)] rounded-[14px] border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-2xl overflow-hidden anim-scale-in z-[60]", menuPosClass)}>
          <div className="px-4 pt-3.5 pb-2">
            <div className="text-[10px] uppercase tracking-[0.12em] font-semibold text-[hsl(var(--muted-foreground))]">Help & guided tour</div>
          </div>
          <div className="px-3 pb-1">
            <button
              onClick={() => { setOpen(false); Tour.startOverview(); }}
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-[8px] hover:bg-[hsl(var(--accent))] text-left transition-colors"
            >
              <span className="w-7 h-7 rounded-[7px] gradient-violet flex items-center justify-center text-white flex-shrink-0"><Icons.Play size={13} /></span>
              <div className="min-w-0">
                <div className="text-[13px] font-semibold leading-tight">Full guided tour</div>
                <div className="text-[11px] text-[hsl(var(--muted-foreground))]">Overview of 11 modules · ~2 min</div>
              </div>
              {completed.overview && <Icons.Check size={14} className="ml-auto text-[hsl(142_70%_55%)] flex-shrink-0" />}
            </button>
          </div>

          <div className="px-4 pt-2 pb-1.5">
            <div className="text-[10px] uppercase tracking-[0.12em] font-semibold text-[hsl(var(--muted-foreground))]">Tours by module</div>
          </div>
          <div className="px-3 pb-2 grid grid-cols-2 gap-1">
            {TOUR_MODULES.map(m => {
              const IconC = Icons[m.icon] || Icons.Sparkles;
              const done = completed[m.id];
              return (
                <button
                  key={m.id}
                  onClick={() => { setOpen(false); Tour.startModule(m.id); }}
                  className="flex items-center gap-1.5 px-2 py-1.5 rounded-[7px] hover:bg-[hsl(var(--accent))] text-left transition-colors min-w-0"
                  title={`Replay: ${m.label}`}
                >
                  <IconC size={13} className="text-[hsl(263_70%_75%)] flex-shrink-0" />
                  <span className="text-[11.5px] font-medium truncate flex-1">{m.label}</span>
                  {done && <Icons.Check size={11} className="text-[hsl(142_70%_55%)] flex-shrink-0" />}
                </button>
              );
            })}
          </div>

          <div className="border-t border-[hsl(var(--border))] p-3">
            <button
              onClick={() => { setOpen(false); (onOpenResources || (() => tourOpenResources()))(); }}
              className="w-full flex items-center gap-2 px-2.5 py-2 rounded-[8px] hover:bg-[hsl(var(--accent))] text-left transition-colors"
            >
              <Icons.Book size={14} className="text-[hsl(var(--muted-foreground))]" />
              <span className="text-[12.5px] font-medium">Open the Resource center</span>
              <Icons.ArrowRight size={12} className="ml-auto text-[hsl(var(--muted-foreground))]" />
            </button>
          </div>
        </div>
      )}

      {anchor === "dock-bar" ? (
        <button
          onClick={() => setOpen(o => !o)}
          aria-label="Help and guided tour"
          className={cn(
            "w-full h-9 rounded-[8px] flex items-center gap-2 px-2.5 text-[12.5px] font-medium transition-colors",
            open
              ? "bg-[hsl(var(--accent))] text-[hsl(var(--foreground))]"
              : "text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--foreground))]"
          )}
        >
          <Icons.HelpCircle size={15} className="flex-shrink-0 text-[hsl(263_70%_78%)]" />
          <span className="flex-1 text-left">Help & guided tour</span>
          {completed.overview && <Icons.Check size={13} className="text-[hsl(142_70%_55%)] flex-shrink-0" />}
          <Icons.ChevronRight size={13} className={cn("flex-shrink-0 text-[hsl(var(--muted-foreground))] transition-transform", open && "-rotate-90")} />
        </button>
      ) : anchor === "dock-rail" ? (
        <button
          onClick={() => setOpen(o => !o)}
          aria-label="Help and guided tour"
          title="Help & guided tour"
          className={cn(
            "w-9 h-9 rounded-[8px] flex items-center justify-center transition-colors",
            open
              ? "bg-[hsl(var(--accent))] text-[hsl(263_70%_82%)]"
              : "text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))] hover:text-[hsl(263_70%_80%)]"
          )}
        >
          <Icons.HelpCircle size={17} />
        </button>
      ) : (
        <button
          onClick={() => setOpen(o => !o)}
          aria-label="Help and guided tour"
          title="Help & guided tour"
          className={cn(
            "w-11 h-11 rounded-full border flex items-center justify-center shadow-lg transition-all active:scale-95",
            open
              ? "bg-[hsl(var(--primary))] text-white border-transparent shadow-[hsl(var(--primary)/0.4)]"
              : "bg-[hsl(var(--card))] text-[hsl(var(--foreground))] border-[hsl(var(--border))] hover:border-[hsl(var(--primary)/0.5)] hover:text-[hsl(263_70%_80%)]"
          )}
        >
          {open ? <Icons.X size={18} /> : <Icons.HelpCircle size={20} />}
        </button>
      )}
    </div>
  );
}

if (typeof window !== "undefined") {
  Object.assign(window, {
    useTour, useTourCompleted, TourLayer, TourWelcomeBanner, TourHelpButton,
    tourResetCompleted, tourReadCompleted,
    ModuleTutorialButton, allModulesSeen,
  });
}

/* True once every overview module has had its mini-tour completed. Used to
   retire the nav ✓ marks (transitory progress indicator) — status stays in
   localStorage, but the UI goes clean again once discovery is complete. */
function allModulesSeen(completed) {
  const c = completed || tourReadCompleted();
  return TOUR_OVERVIEW_ORDER.every(id => c[id]);
}

/* Contextual "Revoir le tutoriel" — relaunches THIS module's mini-tour straight
   from its page header. Labelled on desktop; icon-only (≥44px) on mobile. */
function ModuleTutorialButton({ module, className }) {
  const m = getTourModule(module);
  if (!m || !getTourKeyFeatures(module).length) return null;
  return (
    <button
      onClick={() => Tour.startModule(module)}
      title="Replay this module's tutorial"
      aria-label="Replay this module's tutorial"
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-[8px] flex-shrink-0 transition-colors",
        "h-11 w-11 sm:h-9 sm:w-auto sm:px-2.5",
        "text-[12.5px] font-medium text-[hsl(var(--muted-foreground))] hover:text-[hsl(263_70%_82%)] hover:bg-[hsl(var(--accent))]",
        className
      )}
    >
      <Icons.HelpCircle size={16} />
      <span className="hidden sm:inline">Replay tutorial</span>
    </button>
  );
}
