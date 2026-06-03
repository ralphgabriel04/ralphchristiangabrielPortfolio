/* global React, useState, useEffect, useRef, cn, Icons, lpCelebrate, window */
/* ============================================================
   LANDING — deep demos #3: Tasks/Kanban, Focus deep-work, Music
============================================================ */

/* One-shot column arrival FX via Web Animations API (no extra CSS). */
function fireColumnFx(host, type, cx, cy, color) {
  if (!host) return;
  const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (type === "confetti") {
    const b = document.createElement("div");
    b.style.cssText = `position:absolute;left:${cx}px;top:${cy}px;`;
    host.appendChild(b); lpCelebrate(b, [color, "263 70% 62%", "142 70% 52%", "38 92% 56%"]);
    setTimeout(() => b.remove(), 1100); return;
  }
  if (reduce) return;
  const el = document.createElement("div");
  el.style.cssText = `position:absolute;left:${cx}px;top:${cy}px;transform:translate(-50%,-50%);pointer-events:none;z-index:6;display:flex;align-items:center;justify-content:center;`;
  if (type === "glow") {
    el.style.width = "92px"; el.style.height = "92px"; el.style.borderRadius = "50%";
    el.style.background = `radial-gradient(circle, hsl(${color} / 0.6), transparent 70%)`;
    host.appendChild(el);
    el.animate([{ opacity: 0, transform: "translate(-50%,-50%) scale(0.5)" }, { opacity: 1, offset: 0.4 }, { opacity: 0, transform: "translate(-50%,-50%) scale(1.4)" }], { duration: 750, easing: "cubic-bezier(.33,1,.68,1)" }).onfinish = () => el.remove();
    return;
  }
  el.style.fontSize = "30px"; el.style.fontWeight = "900"; el.style.color = `hsl(${color})`;
  el.textContent = type === "bounce" ? "↑" : "✓";
  host.appendChild(el);
  const kf = type === "bounce"
    ? [{ opacity: 0, transform: "translate(-50%,10px)" }, { opacity: 1, transform: "translate(-50%,-16px)", offset: 0.4 }, { opacity: 1, transform: "translate(-50%,2px)", offset: 0.7 }, { opacity: 0, transform: "translate(-50%,-6px)" }]
    : [{ opacity: 0, transform: "translate(-50%,-50%) scale(0.3)" }, { opacity: 1, transform: "translate(-50%,-50%) scale(1.2)", offset: 0.5 }, { opacity: 0, transform: "translate(-50%,-50%) scale(1)" }];
  el.animate(kf, { duration: 820, easing: "cubic-bezier(.33,1,.68,1)" }).onfinish = () => el.remove();
}

const LP_PRIO = { high: "0 84% 60%", med: "38 92% 55%", low: "142 70% 50%" };

/* ---------- Tasks: 5 views + interactive Kanban ---------- */
function KanbanDemo({ t }) {
  const k = t.tasksPro;
  const [view, setView] = useState("Board");
  const viewKey = (label, i) => ["List", "Board", "Timeline", "Calendar", "Stats"][i];
  const [cards, setCards] = useState([
    { id: 1, idx: 0, col: 0 }, { id: 2, idx: 1, col: 1 }, { id: 3, idx: 2, col: 1 }, { id: 4, idx: 3, col: 2 },
  ]);
  const [fx, setFx] = useState("confetti");
  const [drag, setDrag] = useState(null);
  const [hotCol, setHotCol] = useState(null);
  const hostRef = useRef(null);
  const FX_KEYS = ["confetti", "glow", "check", "bounce"];

  const startDrag = (e, id) => {
    setDrag({ id, x: e.clientX, y: e.clientY });
    const move = (ev) => {
      setDrag((d) => (d ? { ...d, x: ev.clientX, y: ev.clientY } : d));
      const el = document.elementFromPoint(ev.clientX, ev.clientY);
      const zone = el && el.closest("[data-col]");
      setHotCol(zone ? Number(zone.getAttribute("data-col")) : null);
    };
    const up = (ev) => {
      const el = document.elementFromPoint(ev.clientX, ev.clientY);
      const zone = el && el.closest("[data-col]");
      if (zone) {
        const col = Number(zone.getAttribute("data-col"));
        setCards((cs) => cs.map((c) => (c.id === id ? { ...c, col } : c)));
        if (col === 2) {
          const host = hostRef.current; const hb = host.getBoundingClientRect();
          const card = cards.find((c) => c.id === id);
          fireColumnFx(host, fx, ev.clientX - hb.left, ev.clientY - hb.top, card ? k.cards[card.idx].c : "263 70% 60%");
        }
      }
      setDrag(null); setHotCol(null);
      window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move); window.addEventListener("pointerup", up);
    e.preventDefault();
  };

  const dragCard = drag && cards.find((c) => c.id === drag.id);
  const Avatar = ({ who, c }) => (
    <span className="w-5 h-5 rounded-full flex items-center justify-center text-[8.5px] font-bold text-white flex-shrink-0" style={{ background: `hsl(${c})` }}>{who}</span>
  );

  return (
    <div ref={hostRef} className="relative rounded-[12px] border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-3.5">
      {/* view switcher */}
      <div className="flex items-center gap-0.5 mb-3 overflow-x-auto rounded-[8px] border border-[hsl(var(--border))] bg-[hsl(var(--muted)/0.4)] p-0.5">
        {k.views.map((label, i) => {
          const vk = viewKey(label, i);
          return (
            <button key={i} onClick={() => setView(vk)}
              className={cn("px-2.5 h-7 text-[11px] font-medium rounded-[6px] whitespace-nowrap transition-all",
                view === vk ? "bg-[hsl(var(--card))] text-[hsl(var(--foreground))] shadow-sm" : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]")}>
              {label}
            </button>
          );
        })}
      </div>

      {view === "Board" && (
        <>
          <div className="grid grid-cols-3 gap-2">
            {k.columns.map((colName, ci) => {
              const colCards = cards.filter((c) => c.col === ci && !(drag && drag.id === c.id));
              const wip = ci === 1;
              const over = wip && colCards.length > 3;
              return (
                <div key={ci} data-col={ci}
                  className={cn("lp-dropzone rounded-[10px] border border-[hsl(var(--border))] bg-[hsl(var(--card)/0.5)] p-2 min-h-[150px]", hotCol === ci && "lp-drop-hot")}>
                  <div className="flex items-center justify-between mb-2 px-0.5">
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-[hsl(var(--muted-foreground))]">{colName}</span>
                    {wip
                      ? <span className={cn("text-[8.5px] font-mono px-1 py-0.5 rounded", over ? "bg-[hsl(0_84%_60%/0.18)] text-[hsl(0_84%_68%)]" : "bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]")}>{k.wip} {colCards.length}/3</span>
                      : <span className="text-[8.5px] font-mono text-[hsl(var(--muted-foreground))]">{colCards.length}</span>}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {colCards.map((c) => {
                      const card = k.cards[c.idx];
                      return (
                        <button key={c.id} onPointerDown={(e) => startDrag(e, c.id)}
                          className="lp-draggable text-left rounded-[8px] border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-2 hover:border-[hsl(var(--primary)/0.4)]">
                          <div className="flex items-start gap-1.5">
                            <span className="w-1 self-stretch rounded-full flex-shrink-0" style={{ background: `hsl(${card.c})` }} />
                            <span className="text-[11px] font-medium leading-snug flex-1">{card.t}</span>
                          </div>
                          <div className="flex items-center justify-between mt-1.5 pl-2.5">
                            <span className="w-1.5 h-1.5 rounded-full" style={{ background: `hsl(${LP_PRIO[card.p]})` }} />
                            <Avatar who={card.who} c={card.c} />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
          {/* per-column arrival FX selector */}
          <div className="mt-3 flex items-center gap-2 flex-wrap">
            <span className="text-[10px] uppercase tracking-wide font-mono text-[hsl(var(--muted-foreground))]">{k.fxLabel} · Done</span>
            <div className="inline-flex items-center gap-0.5 rounded-[7px] border border-[hsl(var(--border))] bg-[hsl(var(--muted)/0.4)] p-0.5">
              {FX_KEYS.map((key, i) => (
                <button key={key} onClick={() => setFx(key)}
                  className={cn("px-2 h-6 text-[10px] font-medium rounded-[5px] transition-all", fx === key ? "bg-[hsl(var(--card))] text-[hsl(var(--foreground))] shadow-sm" : "text-[hsl(var(--muted-foreground))]")}>
                  {k.fxOptions[i]}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {view === "List" && (
        <div className="flex flex-col divide-y divide-[hsl(var(--border)/0.6)]">
          {k.cards.map((card, i) => (
            <div key={i} className="flex items-center gap-2.5 py-2.5">
              <span className="w-4 h-4 rounded-full border-2 flex items-center justify-center" style={{ borderColor: `hsl(${card.c})` }} />
              <span className="text-[12.5px] font-medium flex-1">{card.t}</span>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: `hsl(${LP_PRIO[card.p]})` }} />
              <Avatar who={card.who} c={card.c} />
            </div>
          ))}
        </div>
      )}

      {view === "Timeline" && (
        <div className="space-y-2.5 py-1">
          {k.cards.map((card, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-[10px] w-16 truncate text-[hsl(var(--muted-foreground))]">{card.t}</span>
              <div className="flex-1 h-4 rounded-[4px] bg-[hsl(var(--muted)/0.4)] relative">
                <div className="absolute h-full rounded-[4px]" style={{ left: `${i * 12}%`, width: `${30 + i * 8}%`, background: `hsl(${card.c} / 0.8)` }} />
              </div>
            </div>
          ))}
          <div className="flex justify-between text-[8.5px] font-mono text-[hsl(var(--muted-foreground))] pt-1"><span>Mon</span><span>Wed</span><span>Fri</span></div>
        </div>
      )}

      {view === "Calendar" && (
        <div className="grid grid-cols-5 gap-1 h-[150px]">
          {[0,1,2,3,4].map((d) => (
            <div key={d} className="rounded-[6px] border border-[hsl(var(--border)/0.6)] dotted-grid p-1 relative">
              <span className="text-[8px] font-mono text-[hsl(var(--muted-foreground))]">{["M","T","W","T","F"][d]}</span>
              {k.cards[d % k.cards.length] && d < 4 && (
                <div className="absolute left-1 right-1 rounded-[3px] p-1 text-[7.5px] text-white" style={{ top: `${20 + d * 12}%`, background: `hsl(${k.cards[d % k.cards.length].c} / 0.9)` }}>{k.cards[d % k.cards.length].t.slice(0, 9)}</div>
              )}
            </div>
          ))}
        </div>
      )}

      {view === "Stats" && (
        <div className="flex items-center gap-4 py-3">
          <div className="relative w-[96px] h-[96px] rounded-full" style={{ background: "conic-gradient(hsl(142 70% 50%) 0deg 200deg, hsl(38 92% 55%) 200deg 290deg, hsl(var(--muted)) 290deg 360deg)" }}>
            <div className="absolute inset-[14px] rounded-full bg-[hsl(var(--background))] flex flex-col items-center justify-center">
              <span className="text-[18px] font-bold tabular-nums">72%</span>
              <span className="text-[8px] text-[hsl(var(--muted-foreground))]">done</span>
            </div>
          </div>
          <div className="space-y-2 flex-1">
            {[["Completed", 18, "142 70% 50%"], ["In progress", 5, "38 92% 55%"], ["Backlog", 2, "215 16% 55%"]].map(([l, v, c], i) => (
              <div key={i} className="flex items-center gap-2 text-[11px]"><span className="w-2 h-2 rounded-full" style={{ background: `hsl(${c})` }} /><span className="flex-1">{l}</span><span className="font-mono tabular-nums text-[hsl(var(--muted-foreground))]">{v}</span></div>
            ))}
          </div>
        </div>
      )}

      {dragCard && (
        <div className="lp-dragging fixed z-[60] pointer-events-none rounded-[8px] border border-[hsl(var(--primary)/0.5)] bg-[hsl(var(--card))] p-2 w-[150px]" style={{ left: drag.x, top: drag.y, transform: "translate(-30%,-50%) rotate(-2deg)" }}>
          <div className="flex items-start gap-1.5">
            <span className="w-1 self-stretch rounded-full" style={{ background: `hsl(${k.cards[dragCard.idx].c})` }} />
            <span className="text-[11px] font-medium leading-snug">{k.cards[dragCard.idx].t}</span>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- Music widget (used inside Focus) ---------- */
function MusicWidget({ t, isBreak = false }) {
  const m = t.music;
  const [connected, setConnected] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [plIdx, setPlIdx] = useState(0);
  const [muteBreak, setMuteBreak] = useState(true);
  const pl = m.playlists[plIdx];
  const muted = muteBreak && isBreak;     // actually silenced right now
  const audible = playing && !muted;      // equalizer only moves when truly audible

  if (!connected) {
    return (
      <div className="rounded-[10px] border border-[hsl(var(--border))] bg-[hsl(var(--card)/0.6)] p-3">
        <div className="flex items-center gap-2 mb-2.5">
          <Icons.Music size={14} className="text-[hsl(var(--primary))]" />
          <span className="text-[12px] font-semibold">{m.label}</span>
        </div>
        <div className="flex gap-1.5">
          {m.services.map((s, i) => (
            <button key={i} onClick={() => setConnected(true)}
              className="flex-1 h-8 rounded-[7px] border border-[hsl(var(--border))] text-[10.5px] font-medium hover:border-[hsl(var(--primary)/0.5)] hover:bg-[hsl(var(--accent)/0.5)] transition-colors flex items-center justify-center gap-1">
              <span className="w-2 h-2 rounded-full" style={{ background: ["#1db954", "#fc3c44", "#ff0000"][i] }} /> {s}
            </button>
          ))}
        </div>
        <div className="text-[10px] text-[hsl(var(--muted-foreground))] mt-2 text-center">{m.connect} → {m.friendly} ✦</div>
      </div>
    );
  }

  return (
    <div className={cn("rounded-[10px] border bg-[hsl(var(--card)/0.6)] p-3 transition-colors", muted ? "border-[hsl(142_70%_50%/0.4)]" : "border-[hsl(var(--border))]")}>
      <div className="flex items-center gap-2.5">
        <div className="w-10 h-10 rounded-[8px] flex items-center justify-center flex-shrink-0 relative overflow-hidden" style={{ background: `linear-gradient(135deg, hsl(${pl.ha} 70% 55%), hsl(${pl.hb} 70% 50%))` }}>
          {audible ? (
            <div className="flex items-end gap-0.5 h-4">
              {[0,1,2,3].map((i) => <span key={i} className="music-eq-bar w-0.5 bg-white/90 h-4" style={{ animationDelay: `${i * 0.12}s` }} />)}
            </div>
          ) : (
            <Icons.VolumeX size={16} className="text-white/90" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-[12px] font-semibold truncate">{pl.n}</span>
            {pl.score >= 70 && <span className="text-[8.5px] font-semibold px-1 py-0.5 rounded bg-[hsl(142_70%_45%/0.16)] text-[hsl(142_70%_55%)] flex items-center gap-0.5"><Icons.Sparkles size={8} />{pl.score}</span>}
          </div>
          <div className="text-[10px] text-[hsl(var(--muted-foreground))] truncate">
            {muted ? <span className="text-[hsl(142_70%_55%)] font-medium">{m.mutedNow}</span> : `${m.track} · ${pl.c} ${m.nowPlaying.toLowerCase()}`}
          </div>
        </div>
        <button onClick={() => setPlaying((p) => !p)} disabled={muted}
          className={cn("w-7 h-7 rounded-full text-white flex items-center justify-center flex-shrink-0", muted ? "bg-[hsl(var(--muted))] cursor-not-allowed" : "bg-[hsl(var(--primary))]")}>
          {playing ? <Icons.Pause size={12} /> : <Icons.Play size={12} className="ml-0.5" />}
        </button>
      </div>
      <div className="flex gap-1 mt-2.5 overflow-x-auto">
        {m.playlists.map((p, i) => (
          <button key={i} onClick={() => setPlIdx(i)}
            className={cn("text-[9.5px] px-1.5 py-1 rounded-[6px] whitespace-nowrap border transition-colors", i === plIdx ? "border-[hsl(var(--primary)/0.5)] bg-[hsl(var(--primary)/0.08)]" : "border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))]")}>
            {p.n}
          </button>
        ))}
      </div>
      <button onClick={() => setMuteBreak((v) => !v)} className="flex items-center gap-1.5 mt-2.5 text-[10px] text-[hsl(var(--muted-foreground))]">
        <span className={cn("w-7 h-4 rounded-full p-0.5 transition-colors flex", muteBreak ? "bg-[hsl(var(--primary))]" : "bg-[hsl(var(--muted))]")}>
          <span className={cn("w-3 h-3 rounded-full bg-white transition-transform", muteBreak && "translate-x-3")} />
        </span>
        {m.muteBreak}
        {muted && <span className="ml-1 text-[hsl(142_70%_55%)] font-semibold">· {m.activeNow}</span>}
      </button>
    </div>
  );
}

/* Inline double-click-to-edit minutes value. */
function EditMin({ value, onCommit, lo, hi, disabled, accent, t }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(value));
  useEffect(() => { setDraft(String(value)); }, [value]);
  const commit = () => {
    const n = parseInt(draft, 10);
    onCommit(isNaN(n) ? value : Math.max(lo, Math.min(hi, n)));
    setEditing(false);
  };
  if (editing && !disabled) {
    return (
      <input autoFocus type="number" value={draft} min={lo} max={hi}
        onChange={(e) => setDraft(e.target.value)} onBlur={commit}
        onKeyDown={(e) => { if (e.key === "Enter") commit(); if (e.key === "Escape") { setDraft(String(value)); setEditing(false); } }}
        className="w-11 text-center text-[12px] font-bold tabular-nums rounded-[6px] border border-[hsl(var(--primary)/0.6)] bg-[hsl(var(--background))] px-1 py-0.5 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]" />
    );
  }
  return (
    <button onDoubleClick={() => !disabled && setEditing(true)} title={t.editHint}
      className={cn("text-[12px] font-bold tabular-nums px-1.5 py-0.5 rounded-[6px] border border-dashed transition-colors", disabled ? "border-transparent" : "border-[hsl(var(--border))] hover:border-[hsl(var(--primary)/0.6)] hover:bg-[hsl(var(--primary)/0.06)] cursor-text")}
      style={{ color: `hsl(${accent})` }}>{value}</button>
  );
}

/* ---------- Focus deep-work: lock-in while running + break phase + music ---------- */
function FocusProDemo({ t }) {
  const f = t.focusPro;
  const [focusMin, setFocusMin] = useState(25);
  const [breakMin, setBreakMin] = useState(5);
  const FOCUS = focusMin * 60, BREAK = breakMin * 60;
  const [phase, setPhase] = useState("focus"); // focus | break
  const [left, setLeft] = useState(FOCUS);
  const [running, setRunning] = useState(false);
  const [session, setSession] = useState(1);
  const [breaks, setBreaks] = useState(0);
  const [lockIdx, setLockIdx] = useState(0);
  const [hyper, setHyper] = useState(false);
  const [ringEdit, setRingEdit] = useState(false);
  const [ringDraft, setRingDraft] = useState("");
  const [toast, setToast] = useState(null);

  const isBreak = phase === "break";
  const total = isBreak ? BREAK : FOCUS;

  const toastRef = useRef();
  const flashToast = (label, color) => {
    setToast({ label, color });
    clearTimeout(toastRef.current);
    toastRef.current = setTimeout(() => setToast(null), 1600);
  };

  // Smooth DEMO clock — each phase fast-forwards over a few fixed seconds.
  // setInterval (not rAF, which pauses in hidden frames) + a real-time delta so
  // the countdown GLIDES (no jumpy steps) and focus → break → focus (plus
  // "mute on break") is visible in seconds.
  useEffect(() => {
    if (!running) return;
    const phaseTotal = isBreak ? BREAK : FOCUS;
    const demoMs = isBreak ? 5000 : 7000;     // wall-clock length of this phase in the demo
    const rate = phaseTotal / demoMs;          // clock-seconds consumed per real millisecond
    let last = performance.now();
    const id = setInterval(() => {
      const now = performance.now();
      const dt = now - last; last = now;
      setLeft((l) => Math.max(0, l - rate * dt));
    }, 60);
    return () => clearInterval(id);
  }, [running, phase, focusMin, breakMin]); // eslint-disable-line

  // phase transition when the clock reaches zero
  useEffect(() => {
    if (!running || left > 0) return;
    if (phase === "focus") {
      setBreaks((b) => b + 1); setPhase("break"); setLeft(BREAK);
      flashToast(f.breakToast, "142 70% 50%");
    } else {
      setSession((s) => (s % 4) + 1); setPhase("focus"); setLeft(FOCUS);
      flashToast(f.focusToast, "var(--primary)");
    }
  }, [left, running, phase]); // eslint-disable-line

  // keep idle display synced to the chosen durations
  useEffect(() => { if (!running) setLeft(phase === "break" ? BREAK : FOCUS); }, [focusMin, breakMin]); // eslint-disable-line

  const pct = total ? Math.max(0, Math.min(1, 1 - left / total)) : 0;
  const secs = Math.ceil(left);
  const mm = String(Math.floor(secs / 60)).padStart(2, "0");
  const ss = String(secs % 60).padStart(2, "0");
  const ringHsl = isBreak ? "142 70% 50%" : "var(--primary)";
  const locked = running; // while running, the rest of the panel is locked
  const reset = () => { setRunning(false); setPhase("focus"); setLeft(FOCUS); setToast(null); };
  const skipBreak = () => { setSession((s) => (s % 4) + 1); setPhase("focus"); setLeft(FOCUS); flashToast(f.focusToast, "var(--primary)"); };
  const PRESETS = [[25, 5], [50, 10], [90, 15]];

  // big-ring double-click → edit current phase's minutes inline
  const openRingEdit = () => { if (locked) return; setRingDraft(String(isBreak ? breakMin : focusMin)); setRingEdit(true); };
  const commitRingEdit = () => {
    const n = parseInt(ringDraft, 10);
    if (!isNaN(n)) { if (isBreak) setBreakMin(Math.max(1, Math.min(30, n))); else setFocusMin(Math.max(5, Math.min(90, n))); }
    setRingEdit(false);
  };

  return (
    <div className="rounded-[12px] border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-4">
      <div className="grid sm:grid-cols-2 gap-4">
        {/* ring */}
        <div className="relative flex flex-col items-center justify-center">
          {/* phase-change toast */}
          {toast && (
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 z-10 rounded-full px-3 py-1 text-[11px] font-semibold text-white shadow-lg whitespace-nowrap anim-scale-in" style={{ background: `hsl(${toast.color})` }}>{toast.label}</div>
          )}
          <div className="relative w-[136px] h-[136px] rounded-full" style={{ background: `conic-gradient(hsl(${ringHsl}) ${pct * 360}deg, hsl(var(--muted) / 0.5) 0deg)` }}>
            <div className="absolute inset-[9px] rounded-full bg-[hsl(var(--background))] border border-[hsl(var(--border))] flex flex-col items-center justify-center">
              {ringEdit ? (
                <div className="flex items-center gap-1">
                  <input autoFocus type="number" value={ringDraft} onChange={(e) => setRingDraft(e.target.value)} onBlur={commitRingEdit}
                    onKeyDown={(e) => { if (e.key === "Enter") commitRingEdit(); if (e.key === "Escape") setRingEdit(false); }}
                    className="w-14 text-center text-[26px] font-bold tabular-nums bg-transparent border-b-2 border-[hsl(var(--primary))] focus:outline-none" />
                  <span className="text-[11px] text-[hsl(var(--muted-foreground))]">{f.min}</span>
                </div>
              ) : (
                <button onDoubleClick={openRingEdit} title={f.editHint} className={cn("flex flex-col items-center", !locked && "cursor-text")}>
                  <div className="text-[30px] font-bold tabular-nums leading-none">{mm}:{ss}</div>
                  <div className="text-[9px] uppercase tracking-[0.16em] mt-1 font-mono" style={{ color: isBreak ? "hsl(142 70% 55%)" : "hsl(var(--muted-foreground))" }}>
                    {isBreak ? f.breakLabel : t.focus.label}
                  </div>
                </button>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3 mt-3 text-[10.5px] font-mono text-[hsl(var(--muted-foreground))]">
            <span>{t.focus.session} {session}/4</span>
            <span className="flex items-center gap-1"><Icons.Coffee size={11} /> {breaks} {f.breaks}</span>
            <span className="flex items-center gap-1 text-[hsl(var(--primary))]" title={f.demoBadge}><Icons.Zap size={10} /> {f.demoBadge}</span>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <button onClick={() => setRunning((r) => !r)} className="h-9 px-4 rounded-[8px] bg-[hsl(var(--primary))] text-white text-[13px] font-medium flex items-center gap-1.5 active:scale-95 transition-transform">
              {running ? <Icons.Pause size={14} /> : <Icons.Play size={14} />}{running ? t.focus.pause : t.focus.start}
            </button>
            {isBreak
              ? <button onClick={skipBreak} className="h-9 px-3 rounded-[8px] border border-[hsl(142_70%_50%/0.5)] text-[hsl(142_70%_55%)] text-[12px] font-medium flex items-center gap-1.5 active:scale-95 transition-transform"><Icons.SkipForward size={13} /> {f.skip}</button>
              : <button onClick={() => !locked && setHyper((h) => !h)} disabled={locked} title={f.hyperfocus}
                  className={cn("h-9 px-3 rounded-[8px] border text-[12px] font-medium flex items-center gap-1.5 transition-colors", locked && "opacity-40 cursor-not-allowed", hyper ? "border-[hsl(var(--primary))] bg-[hsl(var(--primary)/0.12)] text-[hsl(var(--primary))]" : "border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))]")}>
                  <Icons.Zap size={13} /> {f.hyperfocus}
                </button>}
            <button onClick={reset} title={t.focus.reset} className="h-9 w-9 rounded-[8px] border border-[hsl(var(--border))] flex items-center justify-center text-[hsl(var(--muted-foreground))] active:scale-95 transition-transform"><Icons.Refresh size={13} /></button>
          </div>
        </div>

        {/* queue + music — locked while the timer runs */}
        <div className="relative flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wide font-mono text-[hsl(var(--muted-foreground))]">{f.queue}</span>
            {locked && <span className="text-[9px] font-semibold flex items-center gap-1 text-[hsl(var(--primary))]"><Icons.Lock size={10} /> {f.locked}</span>}
          </div>
          <div className={cn("flex flex-col gap-1.5 transition-opacity", locked && "opacity-50 pointer-events-none")}>
            {f.tasks.map((task, i) => (
              <button key={i} onClick={() => setLockIdx(i)}
                className={cn("text-left rounded-[8px] border px-2.5 py-2 flex items-center gap-2 transition-colors",
                  i === lockIdx ? "border-[hsl(var(--primary)/0.5)] bg-[hsl(var(--primary)/0.07)]" : "border-[hsl(var(--border))] bg-[hsl(var(--card))] hover:border-[hsl(var(--primary)/0.3)]")}>
                {i === lockIdx
                  ? <Icons.Lock size={12} className="text-[hsl(var(--primary))] flex-shrink-0" />
                  : <span className="w-3 h-3 rounded-full border border-[hsl(var(--muted-foreground)/0.4)] flex-shrink-0" />}
                <span className="text-[12px] font-medium flex-1 truncate">{task}</span>
                {i === lockIdx && <span className="text-[8.5px] font-semibold uppercase tracking-wide text-[hsl(var(--primary))]">{f.locked.split(" ")[0]}</span>}
              </button>
            ))}
          </div>
          {/* music stays live during break so "mute on break" is visible; only locked from edits */}
          <div className={cn("transition-opacity", locked && !isBreak && "opacity-50 pointer-events-none")}>
            <MusicWidget t={t} isBreak={isBreak && running} />
          </div>
          {locked && !isBreak && (
            <div className="absolute inset-x-0 bottom-0 -mb-1 text-center text-[9px] text-[hsl(var(--muted-foreground))] flex items-center justify-center gap-1">
              <Icons.Lock size={9} /> {f.lockedNote}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { KanbanDemo, MusicWidget, FocusProDemo, fireColumnFx });
