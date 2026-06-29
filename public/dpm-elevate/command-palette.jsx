/* global React, useState, useEffect, useRef, useMemo, cn, Icons, Badge, Button */

/* ============================================================
   COMMAND PALETTE / QUICK CAPTURE  (⌘K / Ctrl+K)
   Akiflow / Raycast / Fantastical-style global overlay.

   Two faces in one surface:
     • Quick capture — type natural language ("Réviser LOG430 demain
       14h-16h") and watch it parse into a typed, schedulable item with
       confidence, conflict detection and a best-slot suggestion.
     • Command runner — navigate, create, or trigger app actions.

   This is FRONT-END ONLY: parsing is a local heuristic, the calendar it
   checks for conflicts is a small mock. Every back-end touchpoint (create,
   schedule, sync) has a clear visual representation but no real network.
   Open from anywhere: ⌘K, the sidebar trigger, or window.__dpmCmdK().
============================================================ */

/* ---- Mock busy calendar used for conflict detection (minutes from 0h) ---- */
const CMDK_BUSY = [
  { label: "Daily stand-up", start: 9 * 60, end: 9 * 60 + 30, cal: "Work" },
  { label: "Design review", start: 14 * 60, end: 15 * 60, cal: "Work" },
  { label: "1:1 — Sarah", start: 16 * 60, end: 16 * 60 + 30, cal: "Work" },
];
const CMDK_CALENDARS = ["Work", "Personal", "School"];

const WEEKDAYS = {
  lundi: 1, mardi: 2, mercredi: 3, jeudi: 4, vendredi: 5, samedi: 6, dimanche: 0,
  monday: 1, tuesday: 2, wednesday: 3, thursday: 4, friday: 5, saturday: 6, sunday: 0,
};
const WD_LABEL = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function fmtMin(m) {
  const h = Math.floor(m / 60), mm = m % 60;
  return `${String(h).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

/* ---- The heuristic parser (FR + EN). Returns a structured capture. ---- */
function parseCapture(raw) {
  const text = (raw || "").trim();
  if (!text) return null;
  const low = " " + text.toLowerCase() + " ";
  let confidence = 0;
  const found = {};

  // --- type ---
  let type = "task";
  if (/\b(focus|deep work|bloc focus|focus block|concentration)\b/.test(low)) { type = "focus"; confidence += 0.15; }
  else if (/\b(meeting|réunion|reunion|call|1:1|1-1|sync|standup|stand-up|rendez-?vous|rdv|entretien|interview)\b/.test(low)) { type = "event"; confidence += 0.2; }
  found.typeExplicit = type !== "task";

  // --- priority ---
  let priority = null;
  if (/(^|\s)!(\s|$)|\b(urgent|p1|important|asap|prioritaire)\b/.test(low)) { priority = "high"; confidence += 0.05; }

  // --- tags (#tag) ---
  const tags = (text.match(/#[\p{L}\w-]+/gu) || []).map(t => t.slice(1));
  if (tags.length) confidence += 0.05;

  // --- calendar (@name) ---
  let calendar = null;
  const calMatch = text.match(/@([\p{L}\w-]+)/u);
  if (calMatch) {
    const want = calMatch[1].toLowerCase();
    calendar = CMDK_CALENDARS.find(c => c.toLowerCase().startsWith(want)) || (calMatch[1][0].toUpperCase() + calMatch[1].slice(1));
    confidence += 0.05;
  }

  // --- date ---
  let dateLabel = null, dateConfident = false;
  const now = new Date();
  if (/\b(aujourd'?hui|today|ce soir|tonight)\b/.test(low)) { dateLabel = "Today"; dateConfident = true; }
  else if (/\b(demain|tomorrow)\b/.test(low)) { dateLabel = "Tomorrow"; dateConfident = true; }
  else if (/\b(après-demain|apres-demain|day after tomorrow)\b/.test(low)) { dateLabel = "In 2 days"; dateConfident = true; }
  else {
    for (const [w, idx] of Object.entries(WEEKDAYS)) {
      if (new RegExp("\\b" + w + "\\b").test(low)) {
        let delta = (idx - now.getDay() + 7) % 7; if (delta === 0) delta = 7;
        dateLabel = WD_LABEL[idx]; dateConfident = true; break;
      }
    }
  }
  if (dateConfident) confidence += 0.25;

  // --- time + range ---
  let startMin = null, endMin = null;
  const toMin = (h, m, ap) => {
    h = +h; m = m ? +m : 0;
    if (ap) { const p = ap.toLowerCase(); if (p === "pm" && h < 12) h += 12; if (p === "am" && h === 12) h = 0; }
    return h * 60 + m;
  };
  // range "14h-16h", "14:00 à 16:00", "from 2pm to 4pm", "de 14h à 16h"
  const range = text.match(/(\d{1,2})\s*[h:]\s*(\d{2})?\s*(am|pm)?\s*(?:-|–|à|a|to|jusqu['’]à|until)\s*(\d{1,2})\s*[h:]\s*(\d{2})?\s*(am|pm)?/i);
  if (range) {
    startMin = toMin(range[1], range[2], range[3]);
    endMin = toMin(range[4], range[5], range[6]);
    confidence += 0.3;
  } else {
    const single = text.match(/(?:^|\s)(?:à |a |at |vers )?(\d{1,2})\s*[h:](\d{2})?\s*(am|pm)?/i);
    if (single) { startMin = toMin(single[1], single[2], single[3]); confidence += 0.2; }
  }

  // --- explicit duration ("30 min", "1h", "2h") ---
  let durMin = null;
  const dur = text.match(/(\d+)\s*(min|minutes?|m)\b/i) || text.match(/(\d+)\s*(h|heures?|hours?)\b/i);
  if (dur && startMin != null && endMin == null) {
    durMin = /h|heure|hour/i.test(dur[2]) ? +dur[1] * 60 : +dur[1];
  }
  if (startMin != null && endMin == null) {
    if (durMin == null) durMin = type === "focus" ? 90 : (type === "event" ? 60 : 30);
    endMin = startMin + durMin;
  }
  if (startMin != null && endMin != null) durMin = endMin - startMin;

  // If we have a time but no explicit type, a timed thing is usually an event.
  if (!found.typeExplicit && startMin != null) type = type === "task" ? "event" : type;

  // --- title: strip recognised tokens ---
  let title = text
    .replace(range ? range[0] : "", "")
    .replace(/(?:^|\s)(?:à |a |at |vers )?\d{1,2}\s*[h:]\d{2}?\s*(am|pm)?/gi, " ")
    .replace(/#[\p{L}\w-]+/gu, " ")
    .replace(/@[\p{L}\w-]+/gu, " ")
    .replace(/\b(aujourd'?hui|today|demain|tomorrow|après-demain|apres-demain|ce soir|tonight|lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche|monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/gi, " ")
    .replace(/\b(urgent|p1|asap|prioritaire)\b/gi, " ")
    .replace(/\b(de|from|à|a|to)\b/gi, " ")
    .replace(/\s*!\s*/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
  if (!title) title = text;
  title = title.charAt(0).toUpperCase() + title.slice(1);

  // --- conflict detection ---
  let conflict = null;
  if (startMin != null && endMin != null && (dateLabel === "Today" || dateLabel === "Tomorrow" || dateConfident)) {
    conflict = CMDK_BUSY.find(b => startMin < b.end && endMin > b.start) || null;
  }
  // --- best-slot suggestion if conflicting ---
  let suggestion = null;
  if (conflict) {
    let probe = conflict.end;
    const length = endMin - startMin;
    // step to next free window
    for (let i = 0; i < 6; i++) {
      const clash = CMDK_BUSY.find(b => probe < b.end && probe + length > b.start);
      if (!clash) break;
      probe = clash.end;
    }
    suggestion = { start: probe, end: probe + length };
  }

  confidence = Math.min(1, confidence);
  const level = confidence >= 0.6 ? "high" : confidence >= 0.3 ? "medium" : "low";

  return {
    raw: text, type, title, priority, tags, calendar: calendar || "Work",
    dateLabel: dateLabel || "No date", dateConfident,
    startMin, endMin, durMin,
    conflict, suggestion,
    confidence, level,
    ambiguous: level === "low" || (!found.typeExplicit && startMin == null && dateLabel == null),
  };
}

const TYPE_META = {
  task:  { label: "Task",  icon: Icons.CheckSquare, hsl: "263 70% 62%" },
  event: { label: "Event", icon: Icons.Calendar,    hsl: "217 91% 60%" },
  focus: { label: "Focus", icon: Icons.Zap,         hsl: "142 70% 45%" },
};

/* ---- Static command catalog (navigation + actions) ---- */
function buildCommands(nav) {
  return [
    { id: "go-home", group: "Go to", label: "Home", icon: Icons.Home, kw: "home accueil", run: () => nav("home") },
    { id: "go-cal", group: "Go to", label: "Calendar", icon: Icons.Calendar, kw: "calendar calendrier agenda", run: () => nav("calendar") },
    { id: "go-tasks", group: "Go to", label: "Tasks", icon: Icons.CheckSquare, kw: "tasks tâches todo", run: () => nav("tasks") },
    { id: "go-planning", group: "Go to", label: "Daily planning", icon: Icons.Sunrise, kw: "planning journée plan", run: () => nav("daily-planning") },
    { id: "go-habits", group: "Go to", label: "Habits", icon: Icons.Flame, kw: "habits habitudes", run: () => nav("habits") },
    { id: "go-goals", group: "Go to", label: "Goals", icon: Icons.Target, kw: "goals objectifs", run: () => nav("goals") },
    { id: "go-stats", group: "Go to", label: "Analytics", icon: Icons.BarChart, kw: "analytics stats dashboard", run: () => nav("dashboard") },
    { id: "go-rules", group: "Go to", label: "Automations", icon: Icons.Shield, kw: "rules automations règles", run: () => nav("automations") },
    { id: "go-sync", group: "Go to", label: "Sync Center", icon: Icons.Refresh, kw: "sync synchronisation calendrier connect", run: () => nav("sync") },
    { id: "go-ai", group: "Go to", label: "AI Planning", icon: Icons.Sparkles, kw: "ai planning plan assistant", run: () => nav("ai-planning") },
    { id: "go-collab", group: "Go to", label: "Collaboration", icon: Icons.Users, kw: "collaboration share team poll", run: () => nav("collaboration") },
    { id: "go-notifs", group: "Go to", label: "Notifications", icon: Icons.Bell, kw: "notifications alerts", run: () => nav("notifications") },
    { id: "go-billing", group: "Go to", label: "Plan & Billing", icon: Icons.Briefcase, kw: "billing plan upgrade invoice", run: () => nav("billing") },
    { id: "go-privacy", group: "Go to", label: "Data & Privacy", icon: Icons.Lock, kw: "privacy data gdpr export delete", run: () => nav("privacy") },
    { id: "go-settings", group: "Go to", label: "Settings", icon: Icons.Settings, kw: "settings réglages paramètres", run: () => nav("settings") },
    { id: "act-create", group: "Action", label: "New event… (advanced)", icon: Icons.Plus, kw: "new event create composer", run: () => { window.__dpmCmdKClose?.(); window.__dpmQuickCreate?.({ type: "event" }); } },
    { id: "act-plan", group: "Action", label: "Plan my day", icon: Icons.Sparkles, kw: "plan day ai", run: () => { window.__dpmAIIntent = "day"; nav("ai-planning"); } },
    { id: "act-sync", group: "Action", label: "Sync all calendars now", icon: Icons.Refresh, kw: "sync now refresh", run: () => { nav("sync"); window.__dpmToast?.("Syncing all calendars…"); } },
    { id: "act-theme", group: "Action", label: "Toggle dark / light", icon: Icons.Moon, kw: "theme dark light thème", run: () => window.__dpmToggleTheme?.() },
  ];
}

function ConfidenceDot({ level }) {
  const map = { high: "142 70% 50%", medium: "38 92% 55%", low: "0 84% 60%" };
  const txt = { high: "High confidence", medium: "Needs a check", low: "Ambiguous" };
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-medium" style={{ color: `hsl(${map[level]})` }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: `hsl(${map[level]})` }} />
      {txt[level]}
    </span>
  );
}

function Kbd({ children }) {
  return <kbd className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-[4px] border border-[hsl(var(--border))] bg-[hsl(var(--muted)/0.5)] text-[10px] font-mono text-[hsl(var(--muted-foreground))]">{children}</kbd>;
}

function CapturePreview({ p, typeOverride, onType, busy }) {
  const eff = typeOverride || p.type;
  const meta = TYPE_META[eff];
  const Icon = meta.icon;
  const timed = p.startMin != null;
  return (
    <div className="rounded-[10px] border border-[hsl(var(--border))] bg-[hsl(var(--muted)/0.25)] overflow-hidden">
      {/* head */}
      <div className="flex items-start gap-3 p-3">
        <div className="w-9 h-9 rounded-[8px] flex items-center justify-center flex-shrink-0" style={{ background: `hsl(${meta.hsl} / 0.16)`, color: `hsl(${meta.hsl})` }}>
          <Icon size={17} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[14px] font-semibold truncate">{p.title}</span>
            <ConfidenceDot level={p.level} />
          </div>
          <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
            <Chip icon={Icons.Calendar}>{p.dateLabel}</Chip>
            {timed && <Chip icon={Icons.Clock}>{fmtMin(p.startMin)}{p.endMin != null && `–${fmtMin(p.endMin)}`}</Chip>}
            {timed && p.durMin != null && <Chip>{p.durMin} min</Chip>}
            <Chip icon={Icons.Layers}>@{p.calendar}</Chip>
            {p.priority === "high" && <Chip tone="danger">Urgent</Chip>}
            {p.tags.map(t => <Chip key={t} tone="primary">#{t}</Chip>)}
          </div>
        </div>
      </div>

      {/* type chooser — shown when ambiguous or always as a tab row */}
      <div className="flex items-center gap-1 px-3 pb-3">
        <span className="text-[11px] text-[hsl(var(--muted-foreground))] mr-1">Create as</span>
        {Object.entries(TYPE_META).map(([k, m]) => {
          const on = eff === k;
          return (
            <button key={k} onClick={() => onType(k)}
              className={cn("h-7 px-2.5 rounded-[6px] text-[12px] font-medium inline-flex items-center gap-1.5 transition-colors",
                on ? "text-white" : "text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))]")}
              style={on ? { background: `hsl(${m.hsl})` } : undefined}>
              <m.icon size={12} /> {m.label}
            </button>
          );
        })}
        <span className="ml-auto text-[10px] text-[hsl(var(--muted-foreground))] inline-flex items-center gap-1"><Kbd>⇥</Kbd> cycle</span>
      </div>

      {/* conflict + suggestion */}
      {p.conflict && (
        <div className="px-3 pb-3 pt-0">
          <div className="rounded-[8px] border border-[hsl(38_92%_55%/0.35)] bg-[hsl(38_92%_55%/0.06)] p-2.5">
            <div className="flex items-start gap-2">
              <Icons.AlertTriangle size={15} className="text-[hsl(38_92%_60%)] flex-shrink-0 mt-0.5" />
              <div className="flex-1 text-[12px]">
                <span className="font-semibold text-[hsl(38_92%_65%)]">Overlaps “{p.conflict.label}”</span>
                <span className="text-[hsl(var(--muted-foreground))]"> · {fmtMin(p.conflict.start)}–{fmtMin(p.conflict.end)}</span>
                {p.suggestion && (
                  <div className="mt-1.5 text-[hsl(var(--muted-foreground))]">
                    Next free slot: <span className="font-semibold text-[hsl(var(--foreground))]">{fmtMin(p.suggestion.start)}–{fmtMin(p.suggestion.end)}</span>
                  </div>
                )}
              </div>
              {p.suggestion && (
                <button onClick={() => busy.apply(p.suggestion)} className="h-7 px-2.5 rounded-[6px] bg-[hsl(var(--primary))] text-white text-[12px] font-medium hover:bg-[hsl(var(--primary)/0.9)] whitespace-nowrap">
                  Use slot
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Chip({ children, icon: Icon, tone }) {
  const tones = {
    primary: "bg-[hsl(var(--primary)/0.14)] text-[hsl(263_70%_75%)]",
    danger: "bg-[hsl(0_84%_60%/0.14)] text-[hsl(0_84%_72%)]",
    default: "bg-[hsl(var(--muted)/0.6)] text-[hsl(var(--muted-foreground))]",
  };
  return (
    <span className={cn("inline-flex items-center gap-1 h-6 px-2 rounded-[6px] text-[11.5px] font-medium", tones[tone || "default"])}>
      {Icon && <Icon size={11} />}{children}
    </span>
  );
}

function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [typeOverride, setTypeOverride] = useState(null);
  const [slotOverride, setSlotOverride] = useState(null); // applied best-slot
  const [created, setCreated] = useState(null); // success state {label}
  const [activeCmd, setActiveCmd] = useState(0);
  const inputRef = useRef(null);

  const nav = (r) => { window.__dpmNavigate?.(r); close(); };
  const commands = useMemo(() => buildCommands(nav), []); // eslint-disable-line

  const close = () => { setOpen(false); };
  const reset = () => { setQ(""); setTypeOverride(null); setSlotOverride(null); setCreated(null); setActiveCmd(0); };

  // open/close wiring
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setOpen(o => !o); }
      if (e.key === "Escape" && open) { setOpen(false); }
    };
    window.addEventListener("keydown", onKey);
    window.__dpmCmdK = () => setOpen(true);
    window.__dpmCmdKClose = () => setOpen(false);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (open) { reset(); requestAnimationFrame(() => inputRef.current?.focus()); }
  }, [open]);

  // re-parse on query; clear slot override when query changes
  const parsed = useMemo(() => parseCapture(q), [q]);
  useEffect(() => { setSlotOverride(null); setTypeOverride(null); setActiveCmd(0); }, [q]);

  if (!open) return null;

  // effective parse with applied slot
  let p = parsed;
  if (p && slotOverride) p = { ...p, startMin: slotOverride.start, endMin: slotOverride.end, durMin: slotOverride.end - slotOverride.start, conflict: null, suggestion: null, level: "high" };

  const filteredCmds = q.trim()
    ? commands.filter(c => (c.label + " " + c.kw).toLowerCase().includes(q.trim().toLowerCase()))
    : commands;

  const doCreate = () => {
    const eff = typeOverride || p.type;
    const ref = window.__dpmCreate?.({
      type: eff, title: p.title, priority: p.priority, tags: p.tags,
      mins: p.durMin, calendar: p.calendar,
      start: p.startMin != null ? fmtMin(p.startMin) : undefined,
      end: p.endMin != null ? fmtMin(p.endMin) : undefined,
    });
    setCreated({ label: p.title, type: eff, ref });
    window.__dpmToast?.(`${TYPE_META[eff].label} created · ${p.title}`);
  };

  const onSubmit = () => {
    if (created) { close(); return; }
    // if a command is highlighted and there's no meaningful capture text, run it
    if (q.trim() && filteredCmds[activeCmd] && (!p || p.title.length < 3)) { filteredCmds[activeCmd].run(); return; }
    if (p) doCreate();
    else if (filteredCmds[activeCmd]) filteredCmds[activeCmd].run();
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") { e.preventDefault(); onSubmit(); }
    else if (e.key === "Tab" && p) { e.preventDefault(); const order = ["task", "event", "focus"]; const cur = typeOverride || p.type; setTypeOverride(order[(order.indexOf(cur) + 1) % 3]); }
    else if (e.key === "ArrowDown") { e.preventDefault(); setActiveCmd(i => Math.min(filteredCmds.length - 1, i + 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActiveCmd(i => Math.max(0, i - 1)); }
  };

  const grouped = {};
  filteredCmds.forEach(c => { (grouped[c.group] = grouped[c.group] || []).push(c); });

  return (
    <div className="fixed inset-0 z-[120] flex items-start justify-center px-4 pt-[12vh] anim-fade-in"
         style={{ backdropFilter: "blur(6px)", background: "rgba(0,0,0,0.5)" }}
         onMouseDown={(e) => { if (e.target === e.currentTarget) close(); }}>
      <div className="w-full max-w-[640px] rounded-[14px] border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-2xl anim-scale-in overflow-hidden flex flex-col max-h-[76vh]">
        {/* input row */}
        <div className="flex items-center gap-2.5 px-3.5 h-[52px] border-b border-[hsl(var(--border))]">
          <Icons.Sparkles size={17} className="text-[hsl(var(--primary))] flex-shrink-0" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Capture or command…  e.g. “Réviser LOG430 demain 14h–16h”"
            className="flex-1 bg-transparent text-[15px] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none"
          />
          <Kbd>esc</Kbd>
        </div>

        <div className="overflow-y-auto p-2.5 space-y-2.5">
          {/* SUCCESS state */}
          {created ? (
            <div className="p-3">
              <div className="flex items-start gap-3 rounded-[10px] border border-[hsl(142_70%_45%/0.3)] bg-[hsl(142_70%_45%/0.06)] p-3">
                <div className="w-9 h-9 rounded-full bg-[hsl(142_70%_45%/0.18)] flex items-center justify-center flex-shrink-0">
                  <Icons.Check size={18} stroke={3} className="text-[hsl(142_70%_55%)]" />
                </div>
                <div className="flex-1">
                  <div className="text-[14px] font-semibold">{TYPE_META[created.type].label} created</div>
                  <div className="text-[12.5px] text-[hsl(var(--muted-foreground))] mt-0.5">{created.label}</div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button onClick={() => { window.__dpmRemove?.(created.ref); setCreated(null); window.__dpmToast?.("Creation undone"); }} className="h-8 px-3 rounded-[7px] border border-[hsl(var(--border))] text-[12.5px] font-medium hover:bg-[hsl(var(--accent))] inline-flex items-center gap-1.5">
                    <Icons.Refresh size={13} /> Undo
                  </button>
                  <button onClick={() => { reset(); inputRef.current?.focus(); }} className="h-8 px-3 rounded-[7px] bg-[hsl(var(--primary))] text-white text-[12.5px] font-medium hover:bg-[hsl(var(--primary)/0.9)]">New</button>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* CAPTURE preview (when there's parseable text) */}
              {p && p.title.length >= 2 && (
                <div>
                  <div className="px-1.5 pb-1.5 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[hsl(var(--muted-foreground))]">Quick capture</div>
                  <CapturePreview p={p} typeOverride={typeOverride} onType={setTypeOverride} busy={{ apply: (s) => setSlotOverride(s) }} />
                  <button onClick={doCreate}
                    className="mt-2 w-full h-10 rounded-[9px] bg-[hsl(var(--primary))] text-white text-[13.5px] font-semibold hover:bg-[hsl(var(--primary)/0.9)] inline-flex items-center justify-center gap-2">
                    Create {TYPE_META[typeOverride || p.type].label.toLowerCase()}
                    <span className="opacity-80 inline-flex items-center gap-1"><Kbd>↵</Kbd></span>
                  </button>
                </div>
              )}

              {/* COMMANDS */}
              {Object.entries(grouped).map(([group, items]) => (
                <div key={group}>
                  <div className="px-1.5 pb-1 pt-1 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[hsl(var(--muted-foreground))]">{group}</div>
                  <div className="space-y-0.5">
                    {items.map((c) => {
                      const idx = filteredCmds.indexOf(c);
                      const on = idx === activeCmd && (!p || p.title.length < 3);
                      return (
                        <button key={c.id} onMouseEnter={() => setActiveCmd(idx)} onClick={c.run}
                          className={cn("w-full flex items-center gap-2.5 px-2.5 h-9 rounded-[8px] text-[13px] text-left transition-colors",
                            on ? "bg-[hsl(var(--accent))]" : "hover:bg-[hsl(var(--accent))]")}>
                          <c.icon size={15} className="text-[hsl(var(--muted-foreground))] flex-shrink-0" />
                          <span className="flex-1 truncate">{c.label}</span>
                          {on && <Icons.CornerDown size={13} className="text-[hsl(var(--muted-foreground))]" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              {filteredCmds.length === 0 && (!p || p.title.length < 2) && (
                <div className="py-8 text-center text-[13px] text-[hsl(var(--muted-foreground))]">No matching command. Keep typing to capture an item.</div>
              )}
            </>
          )}
        </div>

        {/* footer hints */}
        <div className="px-3.5 h-9 border-t border-[hsl(var(--border))] flex items-center gap-4 text-[11px] text-[hsl(var(--muted-foreground))] bg-[hsl(var(--background)/0.4)]">
          <span className="inline-flex items-center gap-1"><Kbd>↵</Kbd> create / run</span>
          <span className="inline-flex items-center gap-1"><Kbd>⇥</Kbd> change type</span>
          <span className="inline-flex items-center gap-1"><Kbd>↑</Kbd><Kbd>↓</Kbd> navigate</span>
          <span className="ml-auto inline-flex items-center gap-1.5"><Icons.Sparkles size={11} /> Natural-language capture</span>
        </div>
      </div>
    </div>
  );
}

/* ---- Sidebar / header trigger ---- */
function CommandTrigger({ variant = "bar" }) {
  if (variant === "icon") {
    return (
      <button onClick={() => window.__dpmCmdK?.()} title="Quick capture  ⌘K"
        className="w-9 h-9 rounded-md hover:bg-[hsl(var(--accent))] flex items-center justify-center text-[hsl(var(--muted-foreground))]">
        <Icons.Sparkles size={16} />
      </button>
    );
  }
  if (variant === "rail") {
    return (
      <button onClick={() => window.__dpmCmdK?.()} title="Quick capture  ⌘K"
        className="w-10 h-10 rounded-[8px] flex items-center justify-center text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--foreground))]">
        <Icons.Sparkles size={17} />
      </button>
    );
  }
  return (
    <button onClick={() => window.__dpmCmdK?.()}
      className="w-full h-9 px-2.5 rounded-[8px] border border-[hsl(var(--border))] bg-[hsl(var(--muted)/0.4)] hover:bg-[hsl(var(--accent))] flex items-center gap-2 text-[12.5px] text-[hsl(var(--muted-foreground))] transition-colors">
      <Icons.Sparkles size={14} className="text-[hsl(var(--primary))]" />
      <span className="flex-1 text-left">Quick capture</span>
      <span className="inline-flex items-center gap-0.5">
        <kbd className="text-[10px] font-mono px-1 rounded-[4px] border border-[hsl(var(--border))] bg-[hsl(var(--card))]">⌘K</kbd>
      </span>
    </button>
  );
}

/* ---- Minimal global toast host (used by palette + sync center) ---- */
function ToastHost() {
  const [toasts, setToasts] = useState([]);
  useEffect(() => {
    window.__dpmToast = (msg, opts = {}) => {
      const id = Math.random().toString(36).slice(2);
      setToasts(t => [...t, { id, msg, tone: opts.tone || "default" }]);
      setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), opts.duration || 3200);
    };
    return () => { delete window.__dpmToast; };
  }, []);
  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[130] flex flex-col items-center gap-2 pointer-events-none">
      {toasts.map(t => (
        <div key={t.id} className="anim-fade-in pointer-events-auto flex items-center gap-2.5 h-10 pl-3 pr-4 rounded-[10px] border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-xl text-[13px]">
          <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: t.tone === "danger" ? "hsl(0 84% 60% / 0.15)" : "hsl(142 70% 45% / 0.15)" }}>
            {t.tone === "danger" ? <Icons.AlertTriangle size={12} className="text-[hsl(0_84%_70%)]" /> : <Icons.Check size={12} stroke={3} className="text-[hsl(142_70%_55%)]" />}
          </span>
          <span className="font-medium">{t.msg}</span>
        </div>
      ))}
    </div>
  );
}

Object.assign(window, { CommandPalette, CommandTrigger, ToastHost, parseCapture });
