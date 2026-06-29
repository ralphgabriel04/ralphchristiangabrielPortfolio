/* global React, useState, useEffect, useRef, cn, Icons, Ring, lpCelebrate, window */
/* ============================================================
   LANDING — interactive demos (core, playable)
   Live, pointer-driven previews of the real product modules:
   calendar (view switch + drag), Eisenhower matrix (drag & drop),
   task completion (confetti), habit streaks, Pomodoro timer.
   Labels are read from copy `t` by index so FR/EN flips live.
============================================================ */

const LP_KIND = {
  event: "217 91% 60%", focus: "142 70% 50%", task: "263 70% 60%", personal: "38 92% 55%",
};

/* ---------- Live calendar: view switch + drag-to-reschedule ---------- */
function LiveCalendarDemo({ t }) {
  const c = t.calendar;
  const [view, setView] = useState("week");
  const [blocks, setBlocks] = useState([
    { id: 1, col: 0, top: 6, h: 13, kind: "event", ev: 0, time: "09:00" },
    { id: 2, col: 1, top: 22, h: 30, kind: "focus", ev: 1, time: "10:30" },
    { id: 3, col: 2, top: 12, h: 20, kind: "task", ev: 2, time: "09:30" },
    { id: 4, col: 3, top: 50, h: 12, kind: "personal", ev: 3, time: "12:30" },
    { id: 5, col: 4, top: 30, h: 24, kind: "event", ev: 4, time: "11:00" },
  ]);
  const [dragId, setDragId] = useState(null);
  const gridRef = useRef(null);

  const startDrag = (e, id) => {
    const grid = gridRef.current; if (!grid) return;
    const rect = grid.getBoundingClientRect();
    const b = blocks.find((x) => x.id === id);
    const move = (ev) => {
      const relX = (ev.clientX - rect.left) / rect.width;
      const relY = (ev.clientY - rect.top) / rect.height;
      const col = Math.max(0, Math.min(4, Math.floor(relX * 5)));
      let top = relY * 100 - b.h / 2;
      top = Math.max(0, Math.min(100 - b.h, top));
      setBlocks((bs) => bs.map((x) => (x.id === id ? { ...x, col, top } : x)));
    };
    const up = () => {
      setBlocks((bs) => bs.map((x) => (x.id === id ? { ...x, top: Math.round(x.top / 4) * 4 } : x)));
      setDragId(null);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    setDragId(id);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    e.preventDefault();
  };

  const views = [
    { value: "day", label: c.views.day },
    { value: "week", label: c.views.week },
    { value: "month", label: c.views.month },
  ];

  return (
    <div className="rounded-[12px] border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-3.5">
      <div className="flex items-center justify-between mb-3">
        <div className="text-[14px] font-semibold tracking-tight">{window.DPMDate ? window.DPMDate.monthYear(undefined, window.__dpmLang === "fr" ? "fr" : "en") : c.month_label}</div>
        <div className="inline-flex items-center gap-0.5 rounded-[8px] border border-[hsl(var(--border))] bg-[hsl(var(--muted)/0.4)] p-0.5">
          {views.map((v) => (
            <button key={v.value} onClick={() => setView(v.value)}
              className={cn("px-2.5 h-7 text-[11.5px] font-medium rounded-[6px] transition-all",
                view === v.value ? "bg-[hsl(var(--card))] text-[hsl(var(--foreground))] shadow-sm" : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]")}>
              {v.label}
            </button>
          ))}
        </div>
      </div>

      {view === "week" && (
        <>
          <div className="grid grid-cols-5 gap-1 mb-1.5 text-center">
            {c.days.map((d, i) => (
              <div key={i} className={cn("text-[10.5px] font-medium py-0.5 rounded", i === 2 ? "text-[hsl(var(--primary))] bg-[hsl(var(--primary)/0.1)]" : "text-[hsl(var(--muted-foreground))]")}>{d}</div>
            ))}
          </div>
          <div ref={gridRef} className="relative h-[208px] rounded-[8px] dotted-grid border border-[hsl(var(--border))] overflow-hidden">
            {[0, 1, 2, 3, 4].map((col) => (
              <div key={col} className="absolute top-0 bottom-0 border-r border-[hsl(var(--border)/0.5)]" style={{ left: `${(col + 1) * 20}%`, width: 0 }} />
            ))}
            {blocks.map((b) => (
              <button key={b.id} onPointerDown={(e) => startDrag(e, b.id)}
                className={cn("lp-evt lp-draggable absolute rounded-[6px] p-1.5 text-left text-white overflow-hidden", dragId === b.id && "lp-dragging")}
                style={{
                  left: `calc(${b.col * 20}% + 3px)`, width: `calc(20% - 6px)`,
                  top: `${b.top}%`, height: `${b.h}%`,
                  background: `hsl(${LP_KIND[b.kind]} / 0.9)`,
                }}>
                <div className="text-[8.5px] font-mono opacity-80 leading-none">{b.time}</div>
                <div className="text-[9.5px] font-medium leading-tight mt-0.5 truncate">{c.events[b.ev]}</div>
              </button>
            ))}
          </div>
        </>
      )}

      {view === "day" && (
        <div className="h-[238px] overflow-hidden rounded-[8px] border border-[hsl(var(--border))] divide-y divide-[hsl(var(--border)/0.6)]">
          {blocks.slice().sort((a, b) => a.time.localeCompare(b.time)).map((b) => (
            <div key={b.id} className="flex items-stretch gap-2.5 p-2.5">
              <div className="text-[10px] font-mono text-[hsl(var(--muted-foreground))] w-10 pt-0.5">{b.time}</div>
              <div className="w-1 rounded-full flex-shrink-0" style={{ background: `hsl(${LP_KIND[b.kind]})` }} />
              <div className="text-[12px] font-medium py-0.5">{c.events[b.ev]}</div>
            </div>
          ))}
        </div>
      )}

      {view === "month" && (
        <div className="grid grid-cols-7 gap-1 h-[238px]">
          {Array.from({ length: 35 }).map((_, i) => {
            const day = i - 2;
            const evs = [3, 8, 9, 14, 17, 22, 23, 28].includes(i);
            const isToday = i === 16;
            return (
              <div key={i} className={cn("rounded-[5px] border p-1 text-[9px] relative",
                day > 0 && day <= 31 ? "border-[hsl(var(--border)/0.6)]" : "border-transparent text-[hsl(var(--muted-foreground)/0.3)]",
                isToday && "bg-[hsl(var(--primary)/0.1)] border-[hsl(var(--primary)/0.4)]")}>
                <span className={cn("font-mono", isToday && "text-[hsl(var(--primary))] font-semibold")}>{day > 0 && day <= 31 ? day : ""}</span>
                {evs && day > 0 && day <= 31 && (
                  <div className="flex gap-0.5 mt-1">
                    <span className="w-1 h-1 rounded-full" style={{ background: "hsl(217 91% 60%)" }} />
                    <span className="w-1 h-1 rounded-full" style={{ background: "hsl(263 70% 60%)" }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ---------- Eisenhower matrix: drag tasks between quadrants ---------- */
function MatrixDnD({ t }) {
  const m = t.matrix;
  const QUAD = [
    { id: 0, key: "do", color: "0 84% 60%" },
    { id: 1, key: "plan", color: "263 70% 60%" },
    { id: 2, key: "delegate", color: "217 91% 60%" },
    { id: 3, key: "drop", color: "215 16% 55%" },
  ];
  const [tasks, setTasks] = useState([
    { id: 1, idx: 0, q: 0 }, { id: 2, idx: 1, q: 1 }, { id: 3, idx: 2, q: 2 }, { id: 4, idx: 3, q: 3 },
  ]);
  const [drag, setDrag] = useState(null); // {id, x, y}
  const [hotQ, setHotQ] = useState(null);
  const hostRef = useRef(null);

  const startDrag = (e, id) => {
    setDrag({ id, x: e.clientX, y: e.clientY });
    const move = (ev) => {
      setDrag((d) => (d ? { ...d, x: ev.clientX, y: ev.clientY } : d));
      const el = document.elementFromPoint(ev.clientX, ev.clientY);
      const zone = el && el.closest("[data-q]");
      setHotQ(zone ? Number(zone.getAttribute("data-q")) : null);
    };
    const up = (ev) => {
      const el = document.elementFromPoint(ev.clientX, ev.clientY);
      const zone = el && el.closest("[data-q]");
      if (zone) {
        const q = Number(zone.getAttribute("data-q"));
        setTasks((ts) => ts.map((x) => (x.id === id ? { ...x, q } : x)));
      }
      setDrag(null); setHotQ(null);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    e.preventDefault();
  };

  const dragTask = drag && tasks.find((x) => x.id === drag.id);

  return (
    <div ref={hostRef} className="relative">
      <div className="grid grid-cols-2 gap-2.5">
        {QUAD.map((q) => (
          <div key={q.id} data-q={q.id}
            className={cn("lp-dropzone rounded-[10px] border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-2.5 min-h-[112px] flex flex-col",
              hotQ === q.id && "lp-drop-hot")}>
            <div className="flex items-center gap-1.5 mb-2">
              <span className="w-2 h-2 rounded-full" style={{ background: `hsl(${q.color})` }} />
              <span className="text-[10.5px] font-semibold uppercase tracking-wide" style={{ color: `hsl(${q.color})` }}>{m.quadrants[q.key]}</span>
            </div>
            <div className="flex flex-col gap-1.5">
              {tasks.filter((x) => x.q === q.id && !(drag && drag.id === x.id)).map((x) => (
                <button key={x.id} onPointerDown={(e) => startDrag(e, x.id)}
                  className="lp-draggable text-left rounded-[7px] border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-2.5 py-1.5 text-[11.5px] font-medium flex items-center gap-1.5 hover:border-[hsl(var(--primary)/0.4)]">
                  <Icons.Drag size={11} className="text-[hsl(var(--muted-foreground))] flex-shrink-0" />
                  <span className="truncate">{m.tasks[x.idx]}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      {dragTask && (
        <div className="lp-dragging fixed z-[60] pointer-events-none rounded-[7px] border border-[hsl(var(--primary)/0.5)] bg-[hsl(var(--card))] px-2.5 py-1.5 text-[11.5px] font-medium flex items-center gap-1.5"
          style={{ left: drag.x, top: drag.y, transform: "translate(-30%, -50%) rotate(-2deg)" }}>
          <Icons.Drag size={11} className="text-[hsl(var(--primary))]" />
          {m.tasks[dragTask.idx]}
        </div>
      )}
    </div>
  );
}

/* ---------- Task completion: tick → confetti + strike ---------- */
function TaskCompleteDemo({ t }) {
  const tk = t.tasks;
  const [done, setDone] = useState([false, false, false, false]);
  const hostRef = useRef(null);
  const count = done.filter(Boolean).length;

  const toggle = (i, e) => {
    const next = !done[i];
    setDone((d) => d.map((v, k) => (k === i ? next : v)));
    if (next) {
      const host = hostRef.current;
      const box = e.currentTarget.getBoundingClientRect();
      const hostBox = host.getBoundingClientRect();
      const burst = document.createElement("div");
      burst.style.cssText = `position:absolute;left:${box.left - hostBox.left + box.width / 2}px;top:${box.top - hostBox.top + box.height / 2}px;width:0;height:0;`;
      host.appendChild(burst);
      lpCelebrate(burst);
      setTimeout(() => burst.remove(), 1200);
    }
  };

  return (
    <div ref={hostRef} className="relative rounded-[12px] border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-3.5">
      <div className="flex items-center justify-between mb-3">
        <div className="text-[13px] font-semibold tracking-tight flex items-center gap-2">
          <Icons.CheckSquare size={15} className="text-[hsl(var(--primary))]" /> Today
        </div>
        <div className="text-[11px] font-mono text-[hsl(var(--muted-foreground))] tabular-nums">{count}/4 {tk.done}</div>
      </div>
      <div className="flex flex-col gap-1.5">
        {tk.items.map((label, i) => (
          <div key={i} className={cn("flex items-center gap-2.5 rounded-[8px] border px-3 py-2.5 transition-colors",
            done[i] ? "border-[hsl(var(--border)/0.5)] bg-[hsl(var(--muted)/0.25)]" : "border-[hsl(var(--border))] bg-[hsl(var(--card))]")}>
            <button onClick={(e) => toggle(i, e)}
              className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all",
                done[i] ? "bg-[hsl(var(--primary))] border-[hsl(var(--primary))] lp-check-pop" : "border-[hsl(var(--muted-foreground)/0.4)] hover:border-[hsl(var(--primary))]")}>
              {done[i] && <Icons.Check size={12} stroke={3} className="text-white" />}
            </button>
            <span className={cn("text-[13px] font-medium transition-colors", done[i] ? "lp-strike text-[hsl(var(--muted-foreground))]" : "text-[hsl(var(--foreground))]")}>{label}</span>
            {i === 0 && !done[i] && <span className="ml-auto text-[9px] font-semibold uppercase px-1.5 py-0.5 rounded bg-[hsl(0_84%_60%/0.14)] text-[hsl(0_84%_70%)]">!</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Habit tracker: tap days → streak + flame ---------- */
function HabitTrackerDemo({ t }) {
  const h = t.habits;
  const [days, setDays] = useState([true, true, true, true, false, false, false]);
  const hostRef = useRef(null);
  // streak = longest run of consecutive checked days (so 7 checks → 7)
  const streak = (() => { let best = 0, run = 0; for (let i = 0; i < days.length; i++) { run = days[i] ? run + 1 : 0; if (run > best) best = run; } return best; })();

  const toggle = (i, e) => {
    const next = !days[i];
    setDays((d) => d.map((v, k) => (k === i ? next : v)));
    if (next) {
      const host = hostRef.current;
      const box = e.currentTarget.getBoundingClientRect();
      const hb = host.getBoundingClientRect();
      const b = document.createElement("div");
      b.style.cssText = `position:absolute;left:${box.left - hb.left + box.width / 2}px;top:${box.top - hb.top + box.height / 2}px;`;
      host.appendChild(b);
      lpCelebrate(b, ["38 92% 56%", "20 90% 58%", "0 84% 62%"]);
      setTimeout(() => b.remove(), 1200);
    }
  };

  return (
    <div ref={hostRef} className="relative rounded-[12px] border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-[13px] font-semibold tracking-tight">{h.habit}</div>
          <div className="text-[11px] text-[hsl(var(--muted-foreground))] mt-0.5">{h.bullets[0]}</div>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-[hsl(38_92%_55%/0.14)] px-2.5 py-1">
          <Icons.Flame size={15} className="text-[hsl(38_92%_55%)]" />
          <span className="text-[14px] font-bold tabular-nums text-[hsl(38_92%_58%)]">{streak}</span>
          <span className="text-[10px] text-[hsl(var(--muted-foreground))]">{h.streak}</span>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {h.week.map((d, i) => (
          <button key={i} onClick={(e) => toggle(i, e)}
            className={cn("aspect-square rounded-[9px] flex flex-col items-center justify-center gap-1 border-2 transition-all",
              days[i] ? "bg-[hsl(var(--primary))] border-[hsl(var(--primary))] text-white lp-check-pop" : "border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--muted-foreground))] hover:border-[hsl(var(--primary)/0.5)]")}>
            <span className="text-[10px] font-semibold">{d}</span>
            {days[i] ? <Icons.Check size={12} stroke={3} /> : <span className="w-1 h-1 rounded-full bg-[hsl(var(--muted-foreground)/0.4)]" />}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------- Pomodoro: ticking conic ring timer ---------- */
function PomodoroDemo({ t }) {
  const f = t.focus;
  const TOTAL = 25 * 60;
  const [left, setLeft] = useState(TOTAL);
  const [running, setRunning] = useState(false);
  const [session, setSession] = useState(1);
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setLeft((l) => {
        if (l <= 1) { setRunning(false); setSession((s) => (s % 4) + 1); return TOTAL; }
        return l - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running]);
  const pct = 1 - left / TOTAL;
  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");

  return (
    <div className="rounded-[12px] border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-5 flex flex-col items-center">
      <div className="relative w-[150px] h-[150px] rounded-full lp-conic" style={{ "--lp-pct": pct }}>
        <div className="absolute inset-[10px] rounded-full bg-[hsl(var(--background))] border border-[hsl(var(--border))] flex flex-col items-center justify-center">
          <div className="text-[34px] font-bold tabular-nums tracking-tight leading-none">{mm}:{ss}</div>
          <div className="text-[10px] uppercase tracking-[0.18em] text-[hsl(var(--muted-foreground))] mt-1.5 font-mono">{f.label}</div>
        </div>
      </div>
      <div className="text-[11px] text-[hsl(var(--muted-foreground))] mt-4 font-mono">{f.session} {session} {f.of} 4</div>
      <div className="flex items-center gap-2 mt-3">
        <button onClick={() => setRunning((r) => !r)}
          className="h-9 px-4 rounded-[8px] bg-[hsl(var(--primary))] text-white text-[13px] font-medium flex items-center gap-1.5 hover:bg-[hsl(var(--primary)/0.9)] transition-colors">
          {running ? <Icons.Pause size={14} /> : <Icons.Play size={14} />}
          {running ? f.pause : f.start}
        </button>
        <button onClick={() => { setRunning(false); setLeft(TOTAL); }}
          className="h-9 w-9 rounded-[8px] border border-[hsl(var(--border))] flex items-center justify-center text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))] transition-colors">
          <Icons.Refresh size={14} />
        </button>
      </div>
    </div>
  );
}

Object.assign(window, { LiveCalendarDemo, MatrixDnD, TaskCompleteDemo, HabitTrackerDemo, PomodoroDemo });
