/* global React, useState, useEffect, useRef, cn, Icons, window */
/* ============================================================
   LANDING — deep demos #4: Calendar pro, Spaces, Rules
============================================================ */

const LP_CAL_KIND = { event: "217 91% 60%", task: "263 70% 60%", focus: "142 70% 50%" };

/* Find a non-overlapping top (%) in a column near `desired`, pushing below any
   block it would collide with. Keeps placed events from stacking on top of each other. */
function freeTop(col, h, blocks, desired) {
  const inCol = blocks.filter((b) => b.col === col).sort((a, b) => a.top - b.top);
  let top = Math.max(0, Math.min(100 - h, desired));
  let moved = true, guard = 0;
  while (moved && guard < 24) {
    moved = false; guard++;
    for (const b of inCol) {
      if (top < b.top + b.h && top + h > b.top) { top = b.top + b.h + 1; moved = true; }
    }
    if (top + h > 100) { top = Math.max(0, 100 - h); break; }
  }
  return Math.round(top);
}

/* ---------- Calendar pro: drag-from-inbox · slot suggestion · share ---------- */
function CalendarProDemo({ t }) {
  const c = t.calendarPro;
  const [blocks, setBlocks] = useState([
    { id: 1, col: 0, top: 8, h: 12, kind: "event", label: "Stand-up" },
    { id: 2, col: 1, top: 30, h: 22, kind: "focus", label: "Deep work" },
    { id: 3, col: 3, top: 16, h: 14, kind: "event", label: "1:1 Léa" },
  ]);
  const [inbox, setInbox] = useState(c.tasks.map((label, i) => ({ id: "t" + i, label })));
  const [drag, setDrag] = useState(null); // {id,label,x,y}
  const [toast, setToast] = useState(null);
  const gridRef = useRef(null);
  const nextId = useRef(10);

  // keep inbox labels synced to language
  useEffect(() => { setInbox((cur) => cur.map((it, i) => (c.tasks[i] ? { ...it, label: c.tasks[i] } : it)).filter((_, i) => i < c.tasks.length)); }, [t]);

  const startDrag = (e, item) => {
    setDrag({ id: item.id, label: item.label, x: e.clientX, y: e.clientY });
    const move = (ev) => setDrag((d) => (d ? { ...d, x: ev.clientX, y: ev.clientY } : d));
    const up = (ev) => {
      const grid = gridRef.current;
      if (grid) {
        const r = grid.getBoundingClientRect();
        if (ev.clientX >= r.left && ev.clientX <= r.right && ev.clientY >= r.top && ev.clientY <= r.bottom) {
          const col = Math.max(0, Math.min(4, Math.floor(((ev.clientX - r.left) / r.width) * 5)));
          const desired = ((ev.clientY - r.top) / r.height) * 100 - 8;
          setBlocks((bs) => [...bs, { id: nextId.current++, col, top: freeTop(col, 16, bs, desired), h: 16, kind: "task", label: item.label.split(" · ")[0] }]);
          setInbox((cur) => cur.filter((x) => x.id !== item.id));
        }
      }
      setDrag(null);
      window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move); window.addEventListener("pointerup", up);
    e.preventDefault();
  };

  const placeSuggested = () => {
    if (!inbox.length) return;
    const item = inbox[0];
    setBlocks((bs) => [...bs, { id: nextId.current++, col: 2, top: freeTop(2, 18, bs, 12), h: 18, kind: "focus", label: item.label.split(" · ")[0] }]);
    setInbox((cur) => cur.filter((x) => x.id !== item.id));
    flash(c.suggest + " → 09:00 ✓");
  };
  const flash = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2200); };
  const planTomorrow = () => {
    setBlocks((bs) => {
      const t1 = freeTop(4, 14, bs, 20);
      const b1 = { id: nextId.current++, col: 4, top: t1, h: 14, kind: "task", label: "Review" };
      const t2 = freeTop(4, 18, [...bs, b1], t1 + 16);
      const b2 = { id: nextId.current++, col: 4, top: t2, h: 18, kind: "focus", label: "Deep work" };
      return [...bs, b1, b2];
    });
    flash(c.planTomorrow + " ✓");
  };
  // suggested free slot (Wed) recomputed live so it never sits under a placed block
  const suggTop = freeTop(2, 18, blocks, 12);

  return (
    <div className="relative rounded-[12px] border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-3.5">
      {/* legend + actions */}
      <div className="flex items-center justify-between gap-2 mb-2.5 flex-wrap">
        <div className="flex items-center gap-2.5">
          {Object.keys(c.legend).map((kk) => (
            <span key={kk} className="flex items-center gap-1 text-[10px] text-[hsl(var(--muted-foreground))]"><span className="w-2 h-2 rounded-sm" style={{ background: `hsl(${LP_CAL_KIND[kk]})` }} />{c.legend[kk]}</span>
          ))}
        </div>
        <button onClick={planTomorrow} className="text-[10.5px] font-medium px-2 py-1 rounded-[6px] border border-[hsl(var(--border))] hover:border-[hsl(var(--primary)/0.4)] flex items-center gap-1 transition-colors">
          <Icons.Sunrise size={12} className="text-[hsl(var(--primary))]" /> {c.planTomorrow}
        </button>
      </div>

      <div className="grid grid-cols-[1fr_120px] gap-2.5">
        {/* grid */}
        <div>
          <div className="grid grid-cols-5 gap-1 mb-1 text-center">
            {c.days.map((d, i) => <div key={i} className={cn("text-[9.5px] font-medium", i === 2 ? "text-[hsl(var(--primary))]" : "text-[hsl(var(--muted-foreground))]")}>{d}</div>)}
          </div>
          <div ref={gridRef} data-cal-grid className="relative h-[188px] rounded-[8px] dotted-grid border border-[hsl(var(--border))] overflow-hidden">
            {[0,1,2,3,4].map((col) => <div key={col} className="absolute top-0 bottom-0 border-r border-[hsl(var(--border)/0.4)]" style={{ left: `${(col + 1) * 20}%` }} />)}
            {blocks.map((b) => (
              <div key={b.id} className="lp-evt absolute rounded-[5px] p-1 text-white overflow-hidden" style={{ left: `calc(${b.col * 20}% + 2px)`, width: "calc(20% - 4px)", top: `${b.top}%`, height: `${b.h}%`, background: `hsl(${LP_CAL_KIND[b.kind]} / 0.9)` }}>
                <div className="text-[8px] font-medium leading-tight truncate">{b.label}</div>
              </div>
            ))}
            {/* suggested free slot — only while there is something to place */}
            {inbox.length > 0 && (
              <div className="absolute rounded-[5px] border-2 border-dashed border-[hsl(var(--primary)/0.6)] bg-[hsl(var(--primary)/0.06)] flex items-center justify-center" style={{ left: "calc(40% + 2px)", width: "calc(20% - 4px)", top: `${suggTop}%`, height: "18%" }}>
                <Icons.Sparkles size={12} className="text-[hsl(var(--primary))] lp-pulse" />
              </div>
            )}
          </div>
        </div>

        {/* inbox + suggestion */}
        <div className="flex flex-col gap-2">
          <div className="text-[9.5px] uppercase tracking-wide font-mono text-[hsl(var(--muted-foreground))] flex items-center gap-1"><Icons.Inbox size={11} /> {c.inbox}</div>
          <div className="flex flex-col gap-1.5">
            {inbox.map((it) => (
              <button key={it.id} onPointerDown={(e) => startDrag(e, it)}
                className="lp-draggable text-left rounded-[7px] border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-2 py-1.5 text-[10px] font-medium flex items-center gap-1.5 hover:border-[hsl(var(--primary)/0.4)]">
                <Icons.Drag size={10} className="text-[hsl(var(--muted-foreground))] flex-shrink-0" /><span className="truncate">{it.label}</span>
              </button>
            ))}
            {inbox.length === 0 && <div className="text-[10px] text-[hsl(var(--muted-foreground))] italic px-1">— all scheduled —</div>}
          </div>
          {inbox.length > 0 ? (
            <div className="rounded-[8px] border border-[hsl(var(--primary)/0.3)] bg-[hsl(var(--primary)/0.06)] p-2 mt-auto">
              <div className="flex items-center gap-1 text-[9.5px] font-semibold text-[hsl(var(--primary))]"><Icons.Sparkles size={10} /> {c.suggest}</div>
              <div className="text-[10px] mt-0.5">Wed 09:00 · <span className="text-[hsl(var(--muted-foreground))]">{c.suggestSub}</span></div>
              <div className="flex gap-1 mt-1.5">
                <button onClick={placeSuggested} className="flex-1 h-6 rounded-[6px] bg-[hsl(var(--primary))] text-white text-[9.5px] font-medium">{c.place}</button>
                <button onClick={() => flash(c.shared)} title={c.share} className="w-6 h-6 rounded-[6px] border border-[hsl(var(--border))] flex items-center justify-center"><Icons.Share size={11} /></button>
              </div>
            </div>
          ) : (
            <div className="rounded-[8px] border border-[hsl(142_70%_50%/0.3)] bg-[hsl(142_70%_50%/0.07)] p-2 mt-auto flex items-center gap-1.5 text-[10px] text-[hsl(142_70%_55%)] font-medium">
              <Icons.Check size={11} stroke={3} /> {c.shared.split(" — ")[0] || "Done"}
            </div>
          )}
        </div>
      </div>

      {toast && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-[hsl(var(--foreground))] text-[hsl(var(--background))] text-[10.5px] font-medium px-3 py-1.5 shadow-lg whitespace-nowrap anim-scale-in">{toast}</div>
      )}
    </div>
  );
}

/* ---------- Spaces: switch context → whole page re-tints + sharing ---------- */
function SpacesDemo({ t, onAccent }) {
  const sp = t.spaces;
  const [active, setActive] = useState("pro");
  const space = sp.list.find((s) => s.id === active) || sp.list[0];
  useEffect(() => () => onAccent && onAccent(null), []); // restore on unmount
  const pick = (s) => { setActive(s.id); onAccent && onAccent(s.id === "all" ? null : s.c); };
  const counts = { all: 24, pro: 9, perso: 11, etudes: 5 };
  // editable sharing: per person, an access level per module (0 none · 1 view · 2 edit)
  const [perms, setPerms] = useState(() => sp.people.map((p, i) => (i === 0 ? null : i === 1 ? [2, 1, 0, 1, 0] : [1, 1, 0, 0, 0])));
  const [sel, setSel] = useState(1);
  const setLevel = (mi, li) => setPerms((ps) => ps.map((row, ri) => (ri === sel && row ? row.map((x, k) => (k === mi ? li : x)) : row)));
  const roleOf = (i) => { if (i === 0) return null; const row = perms[i] || []; if (row.some((v) => v === 2)) return sp.levels[2]; if (row.some((v) => v === 1)) return sp.levels[1]; return sp.levels[0]; };

  return (
    <div className="rounded-[12px] border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-3.5">
      <div className="flex flex-wrap gap-1.5 mb-3.5">
        {sp.list.map((s) => {
          const Ic = Icons[s.icon] || Icons.Layers; const on = active === s.id;
          return (
            <button key={s.id} onClick={() => pick(s)}
              className={cn("h-9 pl-1.5 pr-2.5 rounded-full flex items-center gap-1.5 border transition-all text-[12px] font-semibold")}
              style={on ? { background: `hsl(${s.c} / 0.16)`, borderColor: `hsl(${s.c} / 0.5)`, color: `hsl(${s.c})` } : { borderColor: "hsl(var(--border))", color: "hsl(var(--muted-foreground))" }}>
              <span className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: on ? `hsl(${s.c} / 0.22)` : "hsl(var(--muted)/0.5)" }}><Ic size={13} /></span>
              {s.n}{s.id === "all" && <span className="text-[8px] uppercase font-semibold opacity-70">{sp.union}</span>}
            </button>
          );
        })}
      </div>

      {/* scoped preview, tinted by space */}
      <div className="rounded-[10px] border p-3" style={{ borderColor: `hsl(${space.c} / 0.3)`, background: `hsl(${space.c} / 0.05)` }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-[9px] flex items-center justify-center" style={{ background: `hsl(${space.c} / 0.18)`, color: `hsl(${space.c})` }}>
              {React.createElement(Icons[space.icon] || Icons.Layers, { size: 16 })}
            </span>
            <div>
              <div className="text-[13px] font-bold" style={{ color: `hsl(${space.c})` }}>{space.n}</div>
              <div className="text-[10px] text-[hsl(var(--muted-foreground))]">{space.hours}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[18px] font-bold tabular-nums leading-none">{counts[space.id]}</div>
            <div className="text-[9px] text-[hsl(var(--muted-foreground))]">{sp.scoped}</div>
          </div>
        </div>

        {/* sharing — editable per-member, per-module access (like the app) */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-[9.5px] uppercase tracking-wide font-mono text-[hsl(var(--muted-foreground))]">{sp.members}</span>
          <span className="text-[9.5px] font-semibold flex items-center gap-1 cursor-pointer" style={{ color: `hsl(${space.c})` }}><Icons.Plus size={10} /> {sp.invite}</span>
        </div>
        <div className="flex flex-col gap-1.5">
          {sp.people.map((p, i) => {
            const owner = i === 0; const selected = i === sel;
            return (
              <button key={i} onClick={() => !owner && setSel(i)} disabled={owner}
                className={cn("flex items-center gap-2 rounded-[7px] border px-2 py-1.5 text-left transition-colors",
                  selected && !owner ? "" : "border-[hsl(var(--border))] bg-[hsl(var(--card))]", !owner && "hover:border-[hsl(var(--primary)/0.4)] cursor-pointer")}
                style={selected && !owner ? { borderColor: `hsl(${space.c} / 0.6)`, background: `hsl(${space.c} / 0.07)` } : {}}>
                <span className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0" style={{ background: `hsl(${p.c})` }}>{p.i}</span>
                <span className="text-[11.5px] font-medium flex-1 truncate">{p.n}</span>
                <span className={cn("text-[8.5px] font-semibold px-1.5 py-0.5 rounded-full", owner ? "bg-[hsl(var(--primary)/0.14)] text-[hsl(var(--primary))]" : "bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]")}>{owner ? p.r : roleOf(i)}</span>
              </button>
            );
          })}
        </div>
        {/* per-module access editor for the selected sharee */}
        <div className="mt-2.5 rounded-[8px] border border-[hsl(var(--border))] bg-[hsl(var(--card)/0.5)] p-2.5">
          <div className="text-[9px] uppercase tracking-wide font-mono text-[hsl(var(--muted-foreground))] mb-2">{sp.permsFor} {sp.people[sel].n.split(" ")[0]}</div>
          <div className="flex flex-col gap-1.5">
            {sp.modules.map((mod, mi) => {
              const v = (perms[sel] || [])[mi] || 0;
              return (
                <div key={mi} className="flex items-center gap-2">
                  <span className="text-[10px] flex-1 truncate">{mod}</span>
                  <div className="inline-flex rounded-[6px] border border-[hsl(var(--border))] overflow-hidden flex-shrink-0">
                    {sp.levels.map((lvl, li) => (
                      <button key={li} onClick={() => setLevel(mi, li)}
                        className={cn("px-1.5 h-5 text-[8.5px] font-medium transition-colors", v === li ? (li === 0 ? "bg-[hsl(var(--muted))] text-[hsl(var(--foreground))]" : "text-white") : "text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent)/0.5)]")}
                        style={v === li && li > 0 ? { background: `hsl(${space.c})` } : {}}>{lvl}</button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="text-[9px] text-[hsl(var(--muted-foreground))] mt-2 flex items-center gap-1"><Icons.Lock size={9} /> {sp.tapHint}</div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Rules: If… Then… toggles + run counter + templates ---------- */
function RulesDemo({ t }) {
  const r = t.rules;
  const [rules, setRules] = useState(r.items.map((it, i) => ({ ...it, id: i })));
  useEffect(() => { setRules((cur) => cur.map((x, i) => ({ ...x, n: r.items[i].n, d: r.items[i].d }))); }, [t]);
  const toggle = (id) => setRules((rs) => rs.map((x) => (x.id === id ? { ...x, on: !x.on, runs: !x.on ? x.runs + 1 : x.runs } : x)));

  return (
    <div className="rounded-[12px] border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-3.5">
      <div className="flex flex-col gap-2">
        {rules.map((rule) => {
          const Ic = Icons[rule.icon] || Icons.Shield;
          return (
            <div key={rule.id} className={cn("rounded-[9px] border p-2.5 flex items-center gap-2.5 transition-colors", rule.on ? "border-[hsl(var(--border))] bg-[hsl(var(--card))]" : "border-[hsl(var(--border)/0.6)] bg-[hsl(var(--muted)/0.2)] opacity-70")}>
              <span className="w-8 h-8 rounded-[8px] flex items-center justify-center flex-shrink-0" style={{ background: `hsl(${rule.c} / 0.16)`, color: `hsl(${rule.c})` }}><Ic size={15} /></span>
              <div className="flex-1 min-w-0">
                <div className="text-[12px] font-semibold leading-tight">{rule.n}</div>
                <div className="text-[10px] text-[hsl(var(--muted-foreground))] truncate">{rule.d}</div>
              </div>
              <div className="text-[9px] font-mono text-[hsl(var(--muted-foreground))] tabular-nums whitespace-nowrap flex-shrink-0">{rule.runs} {r.runs}</div>
              <button onClick={() => toggle(rule.id)} className={cn("w-9 h-5 rounded-full p-0.5 transition-colors flex flex-shrink-0", rule.on ? "bg-[hsl(var(--primary))]" : "bg-[hsl(var(--muted))]")}>
                <span className={cn("w-4 h-4 rounded-full bg-white transition-transform", rule.on && "translate-x-4")} />
              </button>
            </div>
          );
        })}
      </div>
      <div className="mt-3 pt-3 border-t border-[hsl(var(--border))]">
        <div className="text-[9.5px] uppercase tracking-wide font-mono text-[hsl(var(--muted-foreground))] mb-2">{r.templates}</div>
        <div className="flex flex-wrap gap-1.5">
          {["Focus Time", "Lunch break", "Meeting buffers"].map((tpl) => (
            <span key={tpl} className="text-[10px] px-2 py-1 rounded-full border border-dashed border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] flex items-center gap-1 hover:border-[hsl(var(--primary)/0.5)] hover:text-[hsl(var(--foreground))] cursor-pointer transition-colors">
              <Icons.Plus size={10} /> {tpl}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { CalendarProDemo, SpacesDemo, RulesDemo });
