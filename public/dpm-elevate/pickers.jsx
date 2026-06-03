/* global React, ReactDOM, Icons, cn, useState, useEffect, useRef */

/* ============================================================
   PICKERS — Google-Agenda style date & time selectors.
   • TimeSelect : champ → liste déroulante d'heures (pas de 15 min),
     défile jusqu'à la valeur courante, libellés 12 h am/pm.
   • DateField  : champ → mini-calendrier (mois, navigation, sélection).
   Les dropdowns sont rendus en PORTAL sur document.body (position absolue
   calculée depuis le trigger) → jamais rognés par un conteneur overflow
   (corps de modal, grille scrollable…). Bascule vers le haut près du bas.
   Valeurs internes : heures "HH:MM" (24 h), dates ISO "YYYY-MM-DD".
============================================================ */

const PK_TODAY_ISO = "2026-05-30";
const PK_MONTHS = ["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"];
const PK_WD_FULL = ["dimanche","lundi","mardi","mercredi","jeudi","vendredi","samedi"];
const PK_WD_MINI = ["L","M","M","J","V","S","D"];

const pk_pad = (n) => String(n).padStart(2, "0");
function pk_fmt12(hhmm) {
  if (!hhmm) return "";
  const [h, m] = hhmm.split(":").map(Number);
  const ap = h < 12 ? "am" : "pm";
  let hh = h % 12; if (hh === 0) hh = 12;
  return hh + ":" + pk_pad(m) + ap;
}
const pk_iso = (y, m, d) => y + "-" + pk_pad(m + 1) + "-" + pk_pad(d);
function pk_parseISO(s) {
  if (!s || !/^\d{4}-\d{2}-\d{2}$/.test(s)) { const t = new Date(); return { y: t.getFullYear(), m: t.getMonth(), d: t.getDate() }; }
  const [y, m, d] = s.split("-").map(Number); return { y, m: m - 1, d };
}
function pk_labelFR(iso) {
  const { y, m, d } = pk_parseISO(iso);
  const wd = new Date(y, m, d).getDay();
  return PK_WD_FULL[wd].charAt(0).toUpperCase() + PK_WD_FULL[wd].slice(1) + " " + d + " " + PK_MONTHS[m];
}
/* Position (document coords) of a dropdown anchored to a trigger, flipping up
   when there isn't room below in the viewport. */
function pk_coords(btn, h, w) {
  const r = btn.getBoundingClientRect();
  const flipUp = r.bottom + h + 12 > window.innerHeight;
  let left = r.left + window.scrollX;
  const maxLeft = window.scrollX + window.innerWidth - w - 8;
  if (left > maxLeft) left = Math.max(8 + window.scrollX, maxLeft);
  const top = (flipUp ? r.top - h - 4 : r.bottom + 4) + window.scrollY;
  return { left, top };
}

/* ---------------- TimeSelect ---------------- */
function TimeSelect({ value, onChange, disabled, step = 15 }) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState(null);
  const btnRef = useRef(null);
  const listRef = useRef(null);

  const times = [];
  for (let m = 0; m < 1440; m += step) times.push(pk_pad(Math.floor(m / 60)) + ":" + pk_pad(m % 60));

  const toggle = () => {
    if (disabled) return;
    if (open) { setOpen(false); return; }
    setCoords(pk_coords(btnRef.current, 244, 150));
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (btnRef.current && btnRef.current.contains(e.target)) return;
      if (listRef.current && listRef.current.contains(e.target)) return;
      setOpen(false);
    };
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    const st = setTimeout(() => {
      if (!listRef.current) return;
      const idx = times.indexOf(value);
      const target = listRef.current.children[idx];
      if (target) listRef.current.scrollTop = Math.max(0, target.offsetTop - 96);
    }, 200);
    return () => { document.removeEventListener("mousedown", onDown); document.removeEventListener("keydown", onKey); clearTimeout(st); };
  }, [open]);

  const dropdown = open && coords && ReactDOM.createPortal(
    <div
      ref={(el) => { listRef.current = el; if (el) { const idx = times.indexOf(value); if (idx >= 0) el.scrollTop = Math.max(0, idx * 36 - 96); } }}
      onMouseDown={(e) => e.stopPropagation()}
      style={{ position: "absolute", left: coords.left, top: coords.top, width: 150, maxHeight: 244, overflowY: "auto" }}
      className="z-[2000] rounded-[10px] border border-[hsl(var(--border))] bg-[hsl(var(--popover))] shadow-2xl py-1 anim-fade-in"
    >
      {times.map((t) => {
        const active = t === value;
        return (
          <button
            key={t}
            type="button"
            data-sel={active ? "1" : "0"}
            onClick={() => { onChange(t); setOpen(false); }}
            style={{ height: 36 }}
            className={cn(
              "w-full text-left px-3.5 flex items-center text-[13px] tabular-nums transition-colors",
              active ? "bg-[hsl(var(--accent))] font-semibold text-[hsl(var(--foreground))]" : "text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent)/0.6)]"
            )}
          >
            {pk_fmt12(t)}
          </button>
        );
      })}
    </div>,
    document.body
  );

  return (
    <React.Fragment>
      <button
        ref={btnRef}
        type="button"
        disabled={disabled}
        onClick={toggle}
        className={cn(
          "h-9 px-3 rounded-[8px] text-[13px] font-medium tabular-nums transition-colors",
          disabled && "opacity-40 pointer-events-none",
          open
            ? "bg-[hsl(var(--primary)/0.12)] text-[hsl(var(--primary))] ring-2 ring-[hsl(var(--primary)/0.4)]"
            : "bg-[hsl(var(--muted)/0.6)] hover:bg-[hsl(var(--accent))] text-[hsl(var(--foreground))]"
        )}
      >
        {pk_fmt12(value)}
      </button>
      {dropdown}
    </React.Fragment>
  );
}

/* ---------------- PkMiniCalendar ---------------- */
function PkMiniCalendar({ value, onPick }) {
  const sel = pk_parseISO(value);
  const [view, setView] = useState({ y: sel.y, m: sel.m });
  const today = pk_parseISO(PK_TODAY_ISO);

  const first = new Date(view.y, view.m, 1);
  const startOffset = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7) cells.push(null);

  const prev = () => setView((v) => { const m = v.m - 1; return m < 0 ? { y: v.y - 1, m: 11 } : { y: v.y, m }; });
  const next = () => setView((v) => { const m = v.m + 1; return m > 11 ? { y: v.y + 1, m: 0 } : { y: v.y, m }; });

  return (
    <div className="w-[256px] p-3">
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-[13.5px] font-bold tracking-tight">{PK_MONTHS[view.m].charAt(0).toUpperCase() + PK_MONTHS[view.m].slice(1)} {view.y}</span>
        <div className="flex items-center gap-0.5">
          <button type="button" onClick={prev} className="w-7 h-7 rounded-md hover:bg-[hsl(var(--accent))] flex items-center justify-center text-[hsl(var(--muted-foreground))]"><Icons.ChevronLeft size={14} /></button>
          <button type="button" onClick={next} className="w-7 h-7 rounded-md hover:bg-[hsl(var(--accent))] flex items-center justify-center text-[hsl(var(--muted-foreground))]"><Icons.ChevronRight size={14} /></button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-0.5 mb-1">
        {PK_WD_MINI.map((w, i) => <div key={i} className="h-6 flex items-center justify-center text-[10.5px] font-semibold text-[hsl(var(--muted-foreground))]">{w}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((d, i) => {
          if (!d) return <div key={i} className="h-8" />;
          const isToday = today.y === view.y && today.m === view.m && today.d === d;
          const isSel = sel.y === view.y && sel.m === view.m && sel.d === d;
          return (
            <button
              key={i}
              type="button"
              onClick={() => onPick(pk_iso(view.y, view.m, d))}
              className={cn(
                "h-8 rounded-full text-[12.5px] tabular-nums transition-colors flex items-center justify-center",
                isToday && "bg-[hsl(var(--primary))] text-white font-bold",
                !isToday && isSel && "bg-[hsl(var(--primary)/0.18)] text-[hsl(var(--primary))] font-semibold",
                !isToday && !isSel && "text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))]"
              )}
            >
              {d}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------- DateField ---------------- */
function DateField({ value, onChange, disabled }) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState(null);
  const btnRef = useRef(null);
  const popRef = useRef(null);

  const toggle = () => {
    if (disabled) return;
    if (open) { setOpen(false); return; }
    setCoords(pk_coords(btnRef.current, 322, 282));
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (btnRef.current && btnRef.current.contains(e.target)) return;
      if (popRef.current && popRef.current.contains(e.target)) return;
      setOpen(false);
    };
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDown); document.removeEventListener("keydown", onKey); };
  }, [open]);

  const popover = open && coords && ReactDOM.createPortal(
    <div ref={popRef} onMouseDown={(e) => e.stopPropagation()} style={{ position: "absolute", left: coords.left, top: coords.top }}
      className="z-[2000] rounded-[12px] border border-[hsl(var(--border))] bg-[hsl(var(--popover))] shadow-2xl anim-fade-in">
      <PkMiniCalendar value={value} onPick={(iso) => { onChange(iso); setOpen(false); }} />
    </div>,
    document.body
  );

  return (
    <React.Fragment>
      <button
        ref={btnRef}
        type="button"
        disabled={disabled}
        onClick={toggle}
        className={cn(
          "h-9 px-3 rounded-[8px] text-[13px] font-medium transition-colors whitespace-nowrap",
          disabled && "opacity-40 pointer-events-none",
          open
            ? "bg-[hsl(var(--primary)/0.12)] text-[hsl(var(--primary))] ring-2 ring-[hsl(var(--primary)/0.4)]"
            : "bg-[hsl(var(--muted)/0.6)] hover:bg-[hsl(var(--accent))] text-[hsl(var(--foreground))]"
        )}
      >
        {pk_labelFR(value)}
      </button>
      {popover}
    </React.Fragment>
  );
}

/* ---------------- FreqSelect (récurrence, options à la Google) ---------------- */
const PK_NTH = ["premier", "deuxième", "troisième", "quatrième", "cinquième"];
function pk_freqOptions(iso) {
  const { y, m, d } = pk_parseISO(iso);
  const wd = new Date(y, m, d).getDay();
  const wdName = PK_WD_FULL[wd];
  const nth = Math.ceil(d / 7);
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const isLast = d + 7 > daysInMonth;
  const opts = [
    { v: "une", label: "Une seule fois" },
    { v: "daily", label: "Tous les jours" },
    { v: "weekly", label: "Toutes les semaines le " + wdName },
    { v: "monthly-nth", label: "Tous les mois le " + (PK_NTH[nth - 1] || nth + "e") + " " + wdName },
  ];
  if (isLast) opts.push({ v: "monthly-last", label: "Tous les mois le dernier " + wdName });
  opts.push({ v: "yearly", label: "Tous les ans le " + d + " " + PK_MONTHS[m] });
  opts.push({ v: "weekdays", label: "Tous les jours de la semaine (du lundi au vendredi)" });
  opts.push({ v: "custom", label: "Personnaliser…" });
  return opts;
}
function pk_freqLabel(iso, value) {
  const o = pk_freqOptions(iso).find((x) => x.v === value);
  return o ? o.label : "Une seule fois";
}

function FreqSelect({ dateISO, value, onChange }) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState(null);
  const btnRef = useRef(null);
  const popRef = useRef(null);
  const opts = pk_freqOptions(dateISO);

  const toggle = () => {
    if (open) { setOpen(false); return; }
    setCoords(pk_coords(btnRef.current, 320, 300));
    setOpen(true);
  };
  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (btnRef.current && btnRef.current.contains(e.target)) return;
      if (popRef.current && popRef.current.contains(e.target)) return;
      setOpen(false);
    };
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDown); document.removeEventListener("keydown", onKey); };
  }, [open]);

  const menu = open && coords && ReactDOM.createPortal(
    <div ref={popRef} onMouseDown={(e) => e.stopPropagation()} style={{ position: "absolute", left: coords.left, top: coords.top, minWidth: 300, maxWidth: 420 }}
      className="z-[2000] rounded-[10px] border border-[hsl(var(--border))] bg-[hsl(var(--popover))] shadow-2xl py-1.5 anim-fade-in">
      {opts.map((o) => {
        const active = o.v === value;
        return (
          <button key={o.v} type="button" onClick={() => { onChange(o.v); setOpen(false); }}
            className={cn("w-full text-left px-4 py-2 text-[13px] transition-colors whitespace-nowrap",
              active ? "bg-[hsl(var(--accent))] font-semibold text-[hsl(var(--foreground))]" : "text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent)/0.6)]")}>
            {o.label}
          </button>
        );
      })}
    </div>,
    document.body
  );

  return (
    <React.Fragment>
      <button ref={btnRef} type="button" onClick={toggle}
        className={cn("h-9 px-3 rounded-[8px] text-[13px] font-medium transition-colors inline-flex items-center gap-1.5 whitespace-nowrap max-w-full",
          open ? "bg-[hsl(var(--primary)/0.12)] text-[hsl(var(--primary))] ring-2 ring-[hsl(var(--primary)/0.4)]" : "bg-[hsl(var(--muted)/0.6)] hover:bg-[hsl(var(--accent))] text-[hsl(var(--foreground))]")}>
        <span className="truncate">{pk_freqLabel(dateISO, value)}</span>
        <Icons.ChevronDown size={13} className="flex-shrink-0" />
      </button>
      {menu}
    </React.Fragment>
  );
}

if (typeof window !== "undefined") {
  Object.assign(window, { TimeSelect, DateField, PkMiniCalendar, FreqSelect, pkFmt12: pk_fmt12, pkLabelFR: pk_labelFR, pkISO: pk_iso, pkParseISO: pk_parseISO, pkFreqLabel: pk_freqLabel });
}
