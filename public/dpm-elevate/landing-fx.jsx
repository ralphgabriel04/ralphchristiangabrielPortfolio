/* global React, useState, useEffect, useRef, cn, Icons, window */
/* ============================================================
   LANDING — FX & atoms
   Shared building blocks for the marketing page: scroll-reveal,
   mono "eyebrow" labels, browser chrome, the interactive "stage"
   shell, a count-up hook, and the completion celebration helper.
   Namespaced lp-; nothing here touches product UI.
============================================================ */

/* One shared IntersectionObserver for all reveals (cheap + consistent).
   RE-ARMING: reveals play when an element scrolls ~15% into view, and reset
   once it has fully left the viewport — so they replay on the next entry
   (scroll down → animate, scroll up & back → animate again). The wide
   hysteresis band (enter at 0.15, reset only at ratio 0) prevents any
   flicker at the boundary. Reduced-motion users get instant, static reveals
   via the global CSS rule, so the toggling is invisible to them. */
const __lpRevealObs = (() => {
  if (typeof window === "undefined" || !("IntersectionObserver" in window)) return null;
  if (window.__lpRevealObs) return window.__lpRevealObs;
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && e.intersectionRatio >= 0.15) {
          e.target.classList.add("is-visible");
        } else if (e.intersectionRatio <= 0.001) {
          e.target.classList.remove("is-visible");
        }
      });
    },
    { threshold: [0, 0.15], rootMargin: "0px 0px -7% 0px" }
  );
  window.__lpRevealObs = obs;
  return obs;
})();

/* Reveal — lifts + fades children in on first scroll into view. */
function Reveal({ children, delay = 0, scale = false, className = "", as: Tag = "div", ...rest }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!__lpRevealObs) { el.classList.add("is-visible"); return; }
    __lpRevealObs.observe(el);
    return () => __lpRevealObs.unobserve(el);
  }, []);
  return (
    <Tag
      ref={ref}
      style={{ "--lp-delay": delay + "ms" }}
      className={cn("lp-reveal", scale && "lp-reveal-scale", className)}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/* Eyebrow — mono small-caps section label, optional index + rule. */
function Eyebrow({ n, children, className = "" }) {
  return (
    <div className={cn("flex items-center gap-2.5 text-[11px] font-mono uppercase tracking-[0.16em]", className)}>
      {n && <span className="tabular-nums text-[hsl(var(--primary))]">{n}</span>}
      {n && <span className="w-7 h-px bg-[hsl(var(--primary)/0.5)]" />}
      <span className="text-[hsl(var(--muted-foreground))]">{children}</span>
    </div>
  );
}

/* SectionHead — centered eyebrow + display title + optional sub. */
function SectionHead({ label, title, sub, n, className = "" }) {
  return (
    <div className={cn("max-w-2xl mx-auto text-center", className)}>
      <Reveal className="flex justify-center"><Eyebrow n={n}>{label}</Eyebrow></Reveal>
      <Reveal delay={70}>
        <h2 className="mt-5 text-[clamp(30px,4.4vw,46px)] font-bold tracking-tight leading-[1.08]" style={{ textWrap: "balance" }}>
          {title}
        </h2>
      </Reveal>
      {sub && (
        <Reveal delay={130}>
          <p className="mt-4 text-[15.5px] text-[hsl(var(--muted-foreground))] leading-relaxed" style={{ textWrap: "pretty" }}>{sub}</p>
        </Reveal>
      )}
    </div>
  );
}

/* BrowserChrome — macOS-style window frame for product mockups. */
function BrowserChrome({ url, children, className = "" }) {
  return (
    <div className={cn("rounded-[14px] border border-[hsl(var(--border))] bg-[hsl(var(--card))] overflow-hidden shadow-2xl", className)}>
      <div className="h-9 flex items-center px-4 gap-1.5 border-b border-[hsl(var(--border))] bg-[hsl(var(--muted)/0.4)]">
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#ef4444" }} />
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#f59e0b" }} />
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#22c55e" }} />
        {url && <span className="text-[11px] text-[hsl(var(--muted-foreground))] ml-3 font-mono truncate">{url}</span>}
      </div>
      {children}
    </div>
  );
}

/* DemoShell — the interactive "stage": tinted panel, dotgrid, live hint. */
function DemoShell({ hint, children, className = "", innerRef }) {
  return (
    <div ref={innerRef} className={cn("lp-ring rounded-[18px] lp-stage p-4 sm:p-5 relative overflow-hidden", className)}>
      <div className="lp-dotgrid absolute inset-0 opacity-60 pointer-events-none" />
      <div className="relative">{children}</div>
      {hint && (
        <div className="relative mt-3.5 flex items-center gap-2 text-[11px] font-mono text-[hsl(var(--muted-foreground))]">
          <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--primary))] lp-pulse" />
          {hint}
        </div>
      )}
    </div>
  );
}

/* FeatureRow — alternating text ↔ live demo layout. */
function FeatureRow({ tag, n, title, desc, bullets = [], reverse = false, children }) {
  return (
    <div data-trail-row data-trail-reverse={reverse ? "1" : "0"} className="grid lg:grid-cols-2 gap-9 lg:gap-14 items-center">
      <Reveal className={cn("min-w-0", reverse ? "lg:order-2" : "")}>
        <Eyebrow n={n}>{tag}</Eyebrow>
        <h3 data-trail-title data-trail-reverse={reverse ? "1" : "0"}
          className="mt-5 text-[clamp(24px,3vw,34px)] font-bold tracking-tight leading-[1.12]" style={{ textWrap: "balance" }}>{title}</h3>
        <p className="mt-4 text-[15px] text-[hsl(var(--muted-foreground))] leading-relaxed" style={{ textWrap: "pretty" }}>{desc}</p>
        <ul className="mt-6 space-y-2.5">
          {bullets.map((b, i) => (
            <li key={i} className="flex items-start gap-3 text-[14px]">
              <span className="mt-0.5 w-5 h-5 rounded-full bg-[hsl(var(--primary)/0.14)] flex items-center justify-center flex-shrink-0">
                <Icons.Check size={12} stroke={3} className="text-[hsl(var(--primary))]" />
              </span>
              <span className="text-[hsl(var(--foreground)/0.9)]">{b}</span>
            </li>
          ))}
        </ul>
      </Reveal>
      <Reveal scale delay={120} className={cn("min-w-0", reverse ? "lg:order-1" : "")}>
        {children}
      </Reveal>
    </div>
  );
}

/* useCountUp — eases 0→target while `active` is true; RESETS to 0 when
   `active` becomes false, so the number replays from 0 on every re-entry
   into view (paired with the re-arming useInView hook below). A single rAF
   loop is cancelled on cleanup so a number never keeps ticking off-screen
   or runs two loops at once. */
function useCountUp(target, active, dur = 1300) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) { setVal(0); return; }            // left view → reset for replay
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVal(target); return;
    }
    let raf, start;
    const tick = (ts) => {
      if (!start) start = ts;
      const p = Math.min(1, (ts - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(target * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target, dur]);
  return val;
}

/* useInView — true WHILE the element is in view, false once it fully leaves.
   Re-arming (not one-shot): drives count-ups and chart bars so they reset on
   exit and replay on re-entry. `useInViewOnce` is kept as an alias.

   Robustness: an IntersectionObserver handles the normal re-arm cheaply, and a
   DIRECT rect measure (no requestAnimationFrame gate — rAF can be throttled in
   background tabs, stranding count-ups/bars at their 0 reset state while on
   screen) runs on mount, on two settle timers, and on scroll/resize (scroll
   captured at the window so it catches any descendant scroll container). Wide
   hysteresis (enter ≥ threshold, reset only when fully out of view) prevents
   flicker and double-fires. */
function useInView(threshold = 0.3) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight || 800;
      if (!r.height) return;
      const visiblePx = Math.min(r.bottom, vh) - Math.max(r.top, 0);
      const ratio = visiblePx / Math.min(r.height, vh);
      if (ratio >= threshold) setInView(true);
      else if (r.bottom <= 0 || r.top >= vh) setInView(false);  // fully out → reset for replay
    };
    let obs;
    if ("IntersectionObserver" in window) {
      obs = new IntersectionObserver((entries) => {
        const e = entries[0];
        if (e.isIntersecting && e.intersectionRatio >= threshold) setInView(true);
        else if (e.intersectionRatio <= 0.001) setInView(false);
      }, { threshold: [0, threshold] });
      obs.observe(el);
    }
    measure();
    const t1 = setTimeout(measure, 300);
    const t2 = setTimeout(measure, 1200);
    window.addEventListener("scroll", measure, { passive: true, capture: true });
    window.addEventListener("resize", measure, { passive: true });
    return () => {
      if (obs) obs.disconnect();
      clearTimeout(t1); clearTimeout(t2);
      window.removeEventListener("scroll", measure, { capture: true });
      window.removeEventListener("resize", measure);
    };
  }, [threshold]);
  return [ref, inView];
}
const useInViewOnce = useInView;

/* lpCelebrate — confetti burst from the center of `host` (task/habit done). */
function lpCelebrate(host, colors) {
  if (!host) return;
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const palette = colors || ["263 70% 62%", "330 80% 64%", "38 92% 56%", "142 70% 52%", "217 91% 62%"];
  const N = 18;
  for (let i = 0; i < N; i++) {
    const piece = document.createElement("span");
    piece.className = "lp-confetti-piece";
    const ang = (Math.PI * 2 * i) / N + (Math.random() - 0.5) * 0.6;
    const dist = 34 + Math.random() * 52;
    piece.style.setProperty("--dx", Math.cos(ang) * dist + "px");
    piece.style.setProperty("--dy", Math.sin(ang) * dist - 12 + "px");
    piece.style.setProperty("--dr", Math.random() * 560 - 280 + "deg");
    piece.style.background = `hsl(${palette[i % palette.length]})`;
    piece.style.animationDelay = Math.random() * 70 + "ms";
    if (Math.random() > 0.5) piece.style.borderRadius = "50%";
    host.appendChild(piece);
    setTimeout(() => piece.remove(), 1100);
  }
}

/* ============================================================
   FeatureTrail — a single decorative SVG line that links the
   alternating feature rows in a zig-zag: it starts under each
   title, traverses the row to the opposite side, then descends
   to the next title — same pattern for every row, last included.

   • Drawn on scroll-down, retracted on scroll-up (stroke-dashoffset).
   • Glowing head dot rides the tip via getPointAtLength().
   • prefers-reduced-motion → full static path, no scroll wiring.
   • Performance → geometry is measured ONCE per layout (ResizeObserver);
     scroll only flips a rAF flag + reads one rect (60fps), gated by an
     IntersectionObserver so it idles when off-screen.
   • Purely decorative → aria-hidden + pointer-events:none.
   • Mobile (<1024px, single column) → a single vertical thread.
============================================================ */
function FeatureTrail({ containerRef }) {
  const pathRef = useRef(null);
  const headRef = useRef(null);
  const lenRef = useRef(0);
  const [geom, setGeom] = useState({ d: "", w: 0, h: 0 });
  const reduced = typeof window !== "undefined" && window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---- build the path geometry from the live feature titles ----
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // layout position within the container (ignores reveal transforms)
    const offsetWithin = (el, anc) => {
      let x = 0, y = 0, n = el;
      while (n && n !== anc) { x += n.offsetLeft; y += n.offsetTop; n = n.offsetParent; }
      return { x, y, w: el.offsetWidth, h: el.offsetHeight };
    };
    // polyline → path with rounded corners
    const rounded = (pts, r) => {
      if (pts.length < 2) return "";
      const f = (v) => v.toFixed(1);
      let d = `M ${f(pts[0][0])} ${f(pts[0][1])}`;
      for (let i = 1; i < pts.length - 1; i++) {
        const [x0, y0] = pts[i - 1], [x1, y1] = pts[i], [x2, y2] = pts[i + 1];
        const v1x = x0 - x1, v1y = y0 - y1, v2x = x2 - x1, v2y = y2 - y1;
        const l1 = Math.hypot(v1x, v1y) || 1, l2 = Math.hypot(v2x, v2y) || 1;
        const rr = Math.min(r, l1 / 2, l2 / 2);
        const ax = x1 + (v1x / l1) * rr, ay = y1 + (v1y / l1) * rr;
        const bx = x1 + (v2x / l2) * rr, by = y1 + (v2y / l2) * rr;
        d += ` L ${f(ax)} ${f(ay)} Q ${f(x1)} ${f(y1)} ${f(bx)} ${f(by)}`;
      }
      const last = pts[pts.length - 1];
      d += ` L ${f(last[0])} ${f(last[1])}`;
      return d;
    };

    const build = () => {
      const rows = Array.from(container.querySelectorAll("[data-trail-row]"));
      if (!rows.length) return;
      const W = container.clientWidth;
      const H = container.offsetHeight;
      const desktop = window.innerWidth >= 1024 && !container.closest(".dpm-mobile");
      const pts = [];
      if (desktop) {
        // Orthogonal "Manhattan" route: a vertical segment hugs each row
        // inside its own side gutter (the text side), and a horizontal
        // segment crosses ONLY in the empty band between two rows. No
        // diagonals, never over a card or title. Sides alternate with the
        // layout, so the verticals zig-zag left↔right.
        // Breathing room: push the verticals OUT past the content edge —
        // partly into the page margin where there's free space — so the line
        // never crowds a title. (overflow:visible lets it draw outside.)
        const cr = container.getBoundingClientRect();
        const outL = Math.max(0, Math.min(cr.left - 8, 14));
        const outR = Math.max(0, Math.min(window.innerWidth - cr.right - 8, 14));
        const leftX = -outL;            // negative → into the left page margin
        const rightX = W + outR;        // past the right edge
        const boxes = rows.map((el) => {
          const b = offsetWithin(el, container);
          const rev = el.getAttribute("data-trail-reverse") === "1";
          return { top: b.y, bottom: b.y + b.h, x: rev ? rightX : leftX };
        });
        pts.push([boxes[0].x, boxes[0].top + 10]);         // start: top of row 0, its side
        // rows 0..n-2 : vertical alongside the row, then horizontal across the
        // EMPTY gap below it to the next row's side.
        for (let i = 0; i < boxes.length - 1; i++) {
          const cur = boxes[i];
          const gap = boxes[i + 1].top - cur.bottom;
          const gapY = Math.min(cur.bottom + Math.min(Math.max(gap * 0.5, 24), 46), H - 34);
          pts.push([cur.x, gapY]);                          // ↓ vertical alongside this row
          pts.push([boxes[i + 1].x, gapY]);                 // → horizontal across the empty gap
        }
        // last row : NO horizontal through its body — drop the vertical past the
        // content into the bottom padding, then a short inward nub to finish.
        const last = boxes[boxes.length - 1];
        const endY = Math.min(last.bottom + 30, H - 10);
        pts.push([last.x, endY]);                           // ↓ vertical, ending below the content
        pts.push([last.x === leftX ? last.x + 150 : last.x - 150, endY]); // → short closing nub
      } else {
        const x = 22;                                       // single vertical thread (mobile)
        const titles = Array.from(container.querySelectorAll("[data-trail-title]"));
        const list = titles.length ? titles : rows;
        list.forEach((el) => {
          const b = offsetWithin(el, container);
          pts.push([x, b.y + b.h / 2]);
        });
        const lp = pts[pts.length - 1];
        pts.push([x, Math.min(lp[1] + 130, H - 6)]);
      }
      setGeom({ d: rounded(pts, desktop ? 12 : 14), w: W, h: H });
    };

    build();
    let ro;
    if ("ResizeObserver" in window) { ro = new ResizeObserver(build); ro.observe(container); }
    window.addEventListener("resize", build);
    // demos can settle/grow after mount — rebuild a couple of times
    const t1 = setTimeout(build, 450);
    const t2 = setTimeout(build, 1300);
    return () => {
      if (ro) ro.disconnect();
      window.removeEventListener("resize", build);
      clearTimeout(t1); clearTimeout(t2);
    };
  }, [containerRef]);

  // ---- length + initial dash (full static path for reduced motion) ----
  useEffect(() => {
    const path = pathRef.current;
    if (!path || !geom.d) return;
    const len = path.getTotalLength();
    lenRef.current = len;
    path.style.strokeDasharray = `${len}`;
    if (reduced) {
      path.style.strokeDashoffset = "0";
      if (headRef.current) headRef.current.style.opacity = "0";
    } else if (!path.style.strokeDashoffset) {
      path.style.strokeDashoffset = `${len}`;
    }
  }, [geom.d, reduced]);

  // ---- scroll-driven draw / retract (IO gate + passive scroll + rAF) ----
  useEffect(() => {
    if (reduced || !geom.d) return;
    const container = containerRef.current;
    const path = pathRef.current;
    const head = headRef.current;
    if (!container || !path) return;

    // the landing is wrapped in an overflow-y-auto shell — find it
    let node = container, scroller = null;
    while (node && node !== document.body) {
      const oy = getComputedStyle(node).overflowY;
      if ((oy === "auto" || oy === "scroll") && node.scrollHeight > node.clientHeight + 4) { scroller = node; break; }
      node = node.parentElement;
    }
    const target = scroller || window;

    let raf = 0, active = true;
    const update = () => {
      raf = 0;
      const len = lenRef.current || path.getTotalLength();
      const r = container.getBoundingClientRect();
      const vh = window.innerHeight || 800;
      const lead = vh * 0.62;                         // the "reading line"
      let p = (lead - r.top) / Math.max(1, r.height);
      p = Math.max(0, Math.min(1, p));
      path.style.strokeDashoffset = `${len * (1 - p)}`;
      if (head) {
        if (p <= 0.001 || p >= 0.999) { head.style.opacity = "0"; }
        else {
          const pt = path.getPointAtLength(len * p);
          head.setAttribute("transform", `translate(${pt.x} ${pt.y})`);
          head.style.opacity = "1";
        }
      }
    };
    const onScroll = () => { if (!raf && active) raf = requestAnimationFrame(update); };

    let io;
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver(([e]) => { active = e.isIntersecting; if (active) onScroll(); },
        { rootMargin: "240px 0px 240px 0px" });
      io.observe(container);
    }
    target.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    update();
    return () => {
      target.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (io) io.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [geom.d, reduced, containerRef]);

  return (
    <svg className="lp-trail-svg" width={geom.w} height={geom.h}
      viewBox={`0 0 ${geom.w || 1} ${geom.h || 1}`} aria-hidden="true" focusable="false">
      <path className="lp-trail-base" d={geom.d} />
      <path ref={pathRef} className="lp-trail-path" d={geom.d} />
      <g ref={headRef} className="lp-trail-head-g" style={{ opacity: 0 }}>
        <circle className="lp-trail-halo" r="12" />
        <circle className="lp-trail-head" r="4.5" />
      </g>
    </svg>
  );
}

/* ScrollControls — top scroll-progress bar + back-to-top FAB.
   Finds the real scroll container (the app shell wraps the landing in an
   overflow-y-auto div) by walking up from .lp-page, falling back to window. */
function ScrollControls() {
  const [progress, setProgress] = useState(0);
  const [show, setShow] = useState(false);
  const scrollerRef = useRef(null);
  useEffect(() => {
    let node = document.querySelector(".lp-page");
    let found = null;
    while (node && node !== document.body) {
      const oy = getComputedStyle(node).overflowY;
      if ((oy === "auto" || oy === "scroll") && node.scrollHeight > node.clientHeight + 4) { found = node; break; }
      node = node.parentElement;
    }
    scrollerRef.current = found;
    const target = found || window;
    const read = () => {
      const top = found ? found.scrollTop : window.scrollY;
      const max = found ? found.scrollHeight - found.clientHeight : document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, top / max) : 0);
      setShow(top > 480);
    };
    target.addEventListener("scroll", read, { passive: true });
    read();
    return () => target.removeEventListener("scroll", read);
  }, []);
  const toTop = () => {
    const s = scrollerRef.current;
    if (s) s.scrollTo({ top: 0, behavior: "smooth" });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <React.Fragment>
      <div className="fixed top-0 left-0 right-0 h-[3px] z-[45] pointer-events-none">
        <div className="h-full origin-left transition-transform duration-150" style={{ transform: `scaleX(${progress})`, background: "linear-gradient(90deg, hsl(263 70% 62%), hsl(330 80% 64%))" }} />
      </div>
      <button onClick={toTop} aria-label="Back to top"
        className={cn("fixed bottom-6 right-6 z-[45] w-11 h-11 rounded-full bg-[hsl(var(--primary))] text-white shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:-translate-y-0.5",
          show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none")}>
        <Icons.ChevronUp size={20} />
      </button>
    </React.Fragment>
  );
}

Object.assign(window, {
  Reveal, Eyebrow, SectionHead, BrowserChrome, DemoShell, FeatureRow, FeatureTrail,
  useCountUp, useInView, useInViewOnce, lpCelebrate, ScrollControls,
});
