/* global React, Icons, Button, Card, SectionTitle, Badge, Input, Checkbox, Avatar, Logo, cn,
          useState, useEffect, useRef, useMemo, ViewToggle, ProgressBar, EmptyState, Switch,
          useT, useEvents, useTasks, useKanbanFx, EventModal, EditableTitle, SwatchPicker */

/* ============================================================
   DRAG-TO-SCHEDULE — shared plumbing
   An unscheduled task can be dragged out of the right-panel inbox and
   dropped onto ANY calendar view. We use native HTML5 drag-and-drop so the
   gesture works across sibling component trees (the inbox lives in the right
   panel, the grids in the centre). The live payload is kept on window so a
   drop target in any view can read it; a custom event lets every view light
   up its drop zones while a drag is in flight.
============================================================ */
// Priority/badge variant → calendar HSL color.
const TASK_PRIO_COLOR = {
  danger:  "0 84% 60%",
  orange:  "20 90% 55%",
  warning: "38 92% 55%",
  primary: "263 70% 60%",
  success: "142 70% 50%",
  info:    "217 91% 60%",
  muted:   "215 15% 55%",
};
function taskColor(task) { return TASK_PRIO_COLOR[task?.p] || TASK_PRIO_COLOR.primary; }
// Parse a duration label ("3h", "1h30", "45min", "20min") → minutes.
function taskMins(task) {
  if (task && Number.isFinite(task.mins)) return task.mins;
  const s = String(task?.d || "").toLowerCase().trim();
  let m = 0;
  const hm = s.match(/(\d+)\s*h\s*(\d+)/);
  const h  = s.match(/(\d+)\s*h/);
  const mn = s.match(/(\d+)\s*min/);
  if (hm) m = parseInt(hm[1], 10) * 60 + parseInt(hm[2], 10);
  else if (h) m = parseInt(h[1], 10) * 60;
  else if (mn) m = parseInt(mn[1], 10);
  return m || 30;
}
const DRAG_EVT = "dpm-task-drag";
function beginTaskDrag(task, e) {
  const payload = { id: task.id, title: task.t, mins: taskMins(task), color: taskColor(task), p: task.p, e: task.e };
  window.__dpmDragTask = payload;
  try {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", task.t);
  } catch (x) {}
  window.dispatchEvent(new CustomEvent(DRAG_EVT, { detail: payload }));
}
function endTaskDrag() {
  window.__dpmDragTask = null;
  window.dispatchEvent(new CustomEvent(DRAG_EVT, { detail: null }));
}
// True while a task is being dragged — used to reveal drop zones.
function useTaskDragging() {
  const [active, setActive] = useState(() => !!window.__dpmDragTask);
  useEffect(() => {
    const h = (e) => setActive(!!e.detail);
    window.addEventListener(DRAG_EVT, h);
    return () => window.removeEventListener(DRAG_EVT, h);
  }, []);
  return active;
}
const DUR_LABEL = (mins) => mins >= 60
  ? (mins % 60 === 0 ? `${mins / 60}h` : `${Math.floor(mins / 60)}h${mins % 60}`)
  : `${mins}min`;

/* ============================================================
   PAGE 5 — CALENDAR (/calendar) — Week view (default)
============================================================ */
/* P13 — Contextual calendar view.
   Two independent levers, optionally composed via named presets:
   1) Which CALENDARS are visible (context: who).
   2) Which HOUR RANGE is in focus (time-band: when).
   Golden rule: a real event NEVER fades. Calendar OFF = explicitly hidden by
   the user (clearly indicated). Hours outside range = compacted into top/
   bottom bands with a counter (e.g. "▼ 3 événements après 18h").

   The "Work"/"Personal"/"Family"/"All" presets compose both levers in one
   click while remaining transparent (the active context indicator shows the
   composition + Reset). */
/* ============================================================
   P14 — Calendar tree (2-level max: group → subgroup → calendar).
   Strict depth cap. Subgroups CANNOT contain subgroups.
   Each node has: id, name, color (HSL string like "263 70% 60%"),
   enabled (per-leaf). Groups/subgroups compute their state from kids.
   Calendars can also live "loose" at the tree root.
============================================================ */
const INITIAL_CAL_TREE = [
  { type: "group", id: "g-pro", name: "Pro", color: "263 70% 60%", children: [
    { type: "cal", id: "c-travail",  name: "Work",   color: "263 70% 60%", enabled: true },
    { type: "cal", id: "c-meetings", name: "Meetings",   color: "217 91% 60%", enabled: true },
    { type: "cal", id: "c-projets",  name: "Projects",   color: "180 65% 50%", enabled: false },
  ]},
  { type: "group", id: "g-famille", name: "Family", color: "330 80% 60%", children: [
    { type: "subgroup", id: "sg-enfants", name: "Kids", color: "330 80% 60%", children: [
      { type: "cal", id: "c-lea", name: "Léa", color: "330 80% 60%", enabled: true },
      { type: "cal", id: "c-tom", name: "Tom", color: "330 80% 70%", enabled: true },
    ]},
    { type: "cal", id: "c-maman", name: "Mom", color: "20 90% 55%", enabled: true },
  ]},
  { type: "group", id: "g-voyage", name: "Japan trip", color: "0 70% 60%", children: [
    { type: "cal", id: "c-vols",  name: "Flights",       color: "0 70% 60%", enabled: false },
    { type: "cal", id: "c-hotels",name: "Hotels",      color: "20 90% 55%", enabled: false },
    { type: "cal", id: "c-act",   name: "Activities", color: "50 90% 55%", enabled: false },
  ]},
  // Loose calendars (no group)
  { type: "cal", id: "c-sport",     name: "Sport",     color: "142 70% 50%", enabled: true },
  { type: "cal", id: "c-personnel", name: "Personal", color: "38 92% 55%",  enabled: true },
];

/* 12-color calibrated palette tuned for dark mode — bright but not garish. */
const CAL_COLOR_PALETTE = [
  { hsl: "263 70% 60%", name: "Violet" },
  { hsl: "217 91% 60%", name: "Bleu" },
  { hsl: "180 65% 50%", name: "Cyan" },
  { hsl: "142 70% 50%", name: "Vert" },
  { hsl: "50 90% 55%",  name: "Jaune" },
  { hsl: "38 92% 55%",  name: "Orange" },
  { hsl: "20 90% 55%",  name: "Red-orange" },
  { hsl: "0 84% 60%",   name: "Rouge" },
  { hsl: "330 80% 60%", name: "Rose" },
  { hsl: "280 60% 65%", name: "Lavande" },
  { hsl: "120 25% 55%", name: "Olive" },
  { hsl: "215 15% 55%", name: "Gris" },
];

/* Walk the tree to collect all leaf calendars (depth ≤ 2). */
function flattenCalendars(tree) {
  const out = [];
  for (const node of tree) {
    if (node.type === "cal") { out.push(node); continue; }
    for (const child of node.children) {
      if (child.type === "cal") { out.push(child); continue; }
      // child is subgroup — only one extra level allowed
      for (const leaf of child.children) {
        if (leaf.type === "cal") out.push(leaf);
      }
    }
  }
  return out;
}
/* Aggregate the on/off state of a group/subgroup node from its leaves. */
function aggregateState(node) {
  const leaves = flattenCalendars([node]);
  const total = leaves.length;
  const on = leaves.filter(l => l.enabled).length;
  if (on === 0) return "off";
  if (on === total) return "on";
  return "partial";
}

const CONTEXT_PRESETS = [
  { id: "all",     name: "All",       icon: Icons.Eye,     color: "263 70% 60%", calendars: ["Work","Personal","Sport","Family"], hours: null },
  { id: "office",  name: "Work",     icon: Icons.Target,  color: "217 91% 60%", calendars: ["Work"],                                  hours: { start: "09:00", end: "18:00" } },
  { id: "perso",   name: "Personal",      icon: Icons.Heart,   color: "330 80% 60%", calendars: ["Personal","Sport","Family"],              hours: { start: "18:00", end: "23:00" } },
  { id: "family",  name: "Family",    icon: Icons.Users,   color: "330 80% 60%", calendars: ["Family","Personal"],                      hours: null },
];
const ALL_CAL_NAMES = ["Work","Personal","Sport","Family"];

/* ============================================================
   P21 — Calendar visual comfort. Zoom drives BOTH the hour-row
   height AND the event font size (accessibility, not just empty
   space), and persists in localStorage. Extended mode collapses
   the app chrome via a window event (see app.jsx).
============================================================ */
const CAL_ZOOM_MIN = 40, CAL_ZOOM_MAX = 104, CAL_ZOOM_STEP = 16, CAL_ZOOM_DEFAULT = 56;
const CAL_ZOOM_KEY = "dpm-cal-zoom";
const CAL_ZOOM_EVT = "dpm-cal-zoom-change";
const clampZoom = (v) => Math.max(CAL_ZOOM_MIN, Math.min(CAL_ZOOM_MAX, Math.round(v)));
function readCalZoom() {
  try { const v = parseInt(localStorage.getItem(CAL_ZOOM_KEY), 10); return Number.isFinite(v) ? clampZoom(v) : CAL_ZOOM_DEFAULT; }
  catch { return CAL_ZOOM_DEFAULT; }
}
function useCalZoom() {
  const [zoom, setZoomState] = useState(readCalZoom);
  useEffect(() => {
    const h = (e) => setZoomState(e.detail);
    window.addEventListener(CAL_ZOOM_EVT, h);
    return () => window.removeEventListener(CAL_ZOOM_EVT, h);
  }, []);
  const setZoom = (v) => {
    const next = clampZoom(typeof v === "function" ? v(readCalZoom()) : v);
    try { localStorage.setItem(CAL_ZOOM_KEY, String(next)); } catch {}
    window.dispatchEvent(new CustomEvent(CAL_ZOOM_EVT, { detail: next }));
  };
  return [zoom, setZoom];
}
const zoomLabel = (px) => px <= 44 ? "Compact" : px <= 64 ? "Normal" : px <= 88 ? "Comfort" : "Large";
// Event font size derived from the hour height — bigger rows ⇒ bigger text.
const zoomFont = (hourPx, base, min, max) => Math.round(Math.max(min, Math.min(max, base * (hourPx / CAL_ZOOM_DEFAULT))));

function CalendarPage({ setRoute, emptyState }) {
  const isMobile = window.useIsMobile ? window.useIsMobile() : false;
  const calLang = (typeof useLang === "function") ? useLang() : (window.__dpmLang || "en");
  const weekRangeLabel = window.DPMDate ? window.DPMDate.weekRangeLabel(undefined, calLang) : "May 18 – 24, 2026";
  const weekNo = window.DPMDate ? window.DPMDate.isoWeek() : 21;
  const [view, setView] = useState(isMobile ? "agenda" : "week");
  const [zoom] = useCalZoom(); // read-only; the control now lives in Settings
  const [expanded, setExpanded] = useState(false);
  const [presetId, setPresetId] = useState("all");
  const [contextPopoverOpen, setContextPopoverOpen] = useState(false);
  const contextPopoverRef = useRef(null);
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [events, eventOps] = useEvents();

  // P21 — Extended mode: tell the shell to collapse its sidebars, allow Esc to
  // exit, and always restore the chrome when leaving the Calendar.
  useEffect(() => {
    window.dispatchEvent(new CustomEvent("dpm-cal-fullscreen", { detail: expanded }));
    try {
      if (expanded) document.documentElement.requestFullscreen?.().catch(() => {});
      else if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
    } catch {}
  }, [expanded]);
  useEffect(() => {
    if (!expanded) return;
    const onKey = (e) => { if (e.key === "Escape") setExpanded(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [expanded]);
  useEffect(() => () => {
    window.dispatchEvent(new CustomEvent("dpm-cal-fullscreen", { detail: false }));
  }, []);

  // P14 — Source of truth for calendars is the tree. visibleCalendars (a Set
  // of NAMES) is derived for downstream consumers (WeekView, ModeIndicator).
  const [calTree, setCalTree] = useState(INITIAL_CAL_TREE);
  const allLeaves = useMemo(() => flattenCalendars(calTree), [calTree]);
  const visibleCalendars = useMemo(
    () => new Set(allLeaves.filter(l => l.enabled).map(l => l.name)),
    [allLeaves]
  );
  const allCalNames = useMemo(() => allLeaves.map(l => l.name), [allLeaves]);
  const [hourRange, setHourRange] = useState(null); // null = 24h ; or { start, end }

  // P20 — the active Espace further scopes which calendars are shown. "Tous"
  // = no extra restriction; the Calendar preset is absorbed into the Espace.
  const [calSpaceId] = useSpace();
  const spaceScopedVisible = useMemo(() => {
    if (calSpaceId === "all" || !window.__dpmCalendarInSpace) return visibleCalendars;
    return new Set([...visibleCalendars].filter(name => window.__dpmCalendarInSpace(name, calSpaceId)));
  }, [visibleCalendars, calSpaceId]);

  useEffect(() => {
    if (!contextPopoverOpen) return;
    const onClick = (e) => {
      if (contextPopoverRef.current && !contextPopoverRef.current.contains(e.target)) setContextPopoverOpen(false);
    };
    const onKey = (e) => { if (e.key === "Escape") setContextPopoverOpen(false); };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [contextPopoverOpen]);

  // Read shared schedules from Settings — exposed alongside the presets so the
  // user can pin "their" schedules (e.g. Soirée perso) as quick hour ranges.
  const [schedules] = (window.useWorkSchedules ? window.useWorkSchedules() : [[]]);

  const activePreset = CONTEXT_PRESETS.find(p => p.id === presetId);
  // A preset is "live" only when current state still matches its composition;
  // if the user tweaks either lever manually, we flip to "Personnalisé".
  const presetMatchesState =
    activePreset &&
    setEq(new Set(activePreset.calendars), visibleCalendars) &&
    sameHourRange(activePreset.hours, hourRange);
  const modeLabel = presetMatchesState ? activePreset.name : "Custom";
  const modeColor = presetMatchesState ? activePreset.color : "263 70% 60%";
  const calendarsCount = visibleCalendars.size;
  const hoursLabel = hourRange ? `${hourRange.start}–${hourRange.end}` : "24h";

  // Mutate the tree by leaf NAME (events reference cal by name).
  const setLeafEnabled = (leafName, enabled) => {
    const walk = (nodes) => nodes.map(n => {
      if (n.type === "cal") return n.name === leafName ? { ...n, enabled } : n;
      return { ...n, children: walk(n.children) };
    });
    setCalTree(t => walk(t));
  };
  // Toggle all leaves under a group/subgroup node. New state = if anything is
  // currently off, turn ALL on; if everything is on, turn ALL off.
  const setBranchEnabled = (nodeId, enabled) => {
    const walk = (nodes) => nodes.map(n => {
      if (n.id === nodeId) {
        if (n.type === "cal") return { ...n, enabled };
        return { ...n, children: walkSet(n.children, enabled) };
      }
      if (n.type === "cal") return n;
      return { ...n, children: walk(n.children) };
    });
    const walkSet = (nodes, val) => nodes.map(n => {
      if (n.type === "cal") return { ...n, enabled: val };
      return { ...n, children: walkSet(n.children, val) };
    });
    setCalTree(t => walk(t));
  };

  const applyPreset = (p) => {
    setPresetId(p.id);
    // Toggle leaves on/off based on whether their NAME is in the preset list.
    const set = new Set(p.calendars);
    const walkSet = (nodes) => nodes.map(n => {
      if (n.type === "cal") return { ...n, enabled: set.has(n.name) };
      return { ...n, children: walkSet(n.children) };
    });
    setCalTree(t => walkSet(t));
    setHourRange(p.hours);
    setContextPopoverOpen(false);
  };
  const resetView = () => applyPreset(CONTEXT_PRESETS[0]); // "All"
  const toggleCalendar = (name) => {
    const leaf = allLeaves.find(l => l.name === name);
    setLeafEnabled(name, leaf ? !leaf.enabled : true);
  };

  return (
    <div className="h-full flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="iconSm"><Icons.ChevronLeft size={14}/></Button>
          <Button variant="outline" size="sm">Today</Button>
          <Button variant="ghost" size="iconSm"><Icons.ChevronRight size={14}/></Button>
        </div>
        <div>
          <h1 className="text-[20px] font-bold tracking-tight leading-tight">{weekRangeLabel}</h1>
          <p className="text-[11px] text-[hsl(var(--muted-foreground))] tabular-nums">
            {(calLang === "fr" ? "Semaine " : "Week ") + weekNo} · {calendarsCount}/{allCalNames.length} active calendars
          </p>
        </div>
        <div className="flex-1" />
        <span data-tour="feat-calendar-views">
        <ViewToggle
          value={view} onChange={setView}
          options={[
            { value: "day",     label: "Day" },
            { value: "week",    label: "Week" },
            { value: "month",   label: "Month" },
            { value: "agenda",  label: "Agenda" },
            { value: "timeline",label: "Timeline" },
            { value: "load",    label: "Load" },
          ]}
        />
        </span>

        {/* Context popover trigger (P13 — composes calendar filter + hour range) */}
        <div className="relative" ref={contextPopoverRef} data-tour="feat-calendar-context">
          <Button
            variant="outline"
            size="sm"
            icon={activePreset?.icon || Icons.Eye}
            onClick={() => setContextPopoverOpen(o => !o)}
            aria-haspopup="menu"
            aria-expanded={contextPopoverOpen}
          >
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ background: `hsl(${modeColor})` }} />
              {modeLabel}
              <Icons.ChevronDown size={10} className={cn("transition-transform", contextPopoverOpen && "rotate-180")} />
            </span>
          </Button>
          {contextPopoverOpen && (
            <ContextPopover
              presets={CONTEXT_PRESETS}
              activePresetId={presetMatchesState ? activePreset.id : null}
              visibleCalendars={visibleCalendars}
              hourRange={hourRange}
              schedules={schedules}
              onApplyPreset={applyPreset}
              onToggleCalendar={toggleCalendar}
              onSetHourRange={setHourRange}
              onReset={resetView}
              onOpenSettings={() => { setContextPopoverOpen(false); setRoute?.("settings"); }}
            />
          )}
        </div>

        <ModuleTutorialButton module="calendar" />

        {/* P21 — Visual comfort: full-view toggle. The zoom/comfort control
            now lives in Settings → Visual comfort (calendar density). */}
        <Button
          variant={expanded ? "primary" : "outline"}
          size="iconSm"
          onClick={() => setExpanded(x => !x)}
          title={expanded ? "Exit full view (Esc)" : "Full view — hide sidebars"}
          aria-label={expanded ? "Exit full view" : "Enter full view"}
          aria-pressed={expanded}
        >
          {expanded ? <Icons.Minimize size={15} /> : <Icons.Maximize size={15} />}
        </Button>
        <Button size="sm" icon={Icons.Plus} onClick={() => setEventModalOpen(true)}>Event</Button>
      </div>

      <EventModal
        open={eventModalOpen}
        onClose={() => setEventModalOpen(false)}
        onSave={(payload) => eventOps.add(payload)}
      />

      {/* P13 — Permanent mode indicator. Always visible so the user knows
         they're looking at a RESTRICTED view (never "vide", always "filtré"). */}
      <ModeIndicator
        modeLabel={modeLabel}
        modeColor={modeColor}
        calendarsActive={calendarsCount}
        calendarsTotal={allCalNames.length}
        hoursLabel={hoursLabel}
        hiddenCalendars={allCalNames.filter(c => !visibleCalendars.has(c))}
        onReset={resetView}
        isDefault={presetMatchesState && activePreset?.id === "all"}
      />

      {/* 3 panels (extended mode → single full-width grid) */}
      <div className={cn(
        "flex-1 min-h-0 grid gap-0 border border-[hsl(var(--border))] rounded-[12px] overflow-hidden bg-[hsl(var(--card))]",
        (expanded || isMobile) ? "grid-cols-[1fr]" : "grid-cols-[200px_1fr_240px]"
      )}>
        {!expanded && !isMobile && (
          <CalendarLeftPanel
            tree={calTree}
            onSetLeafEnabled={setLeafEnabled}
            onSetBranchEnabled={setBranchEnabled}
            onUpdateTree={setCalTree}
          />
        )}
        <div className={cn("overflow-hidden flex flex-col", !expanded && !isMobile && "border-x border-[hsl(var(--border))]")}>
          {view === "week" && (
            <WeekView
              emptyState={emptyState}
              visibleCalendars={spaceScopedVisible}
              hourRange={hourRange}
              zoomPx={zoom}
            />
          )}
          {view === "day" && <DayView zoomPx={zoom} />}
          {view === "month" && <MonthView />}
          {view === "agenda" && <AgendaView />}
          {view === "timeline" && <TimelineView />}
          {view === "load" && <LoadView />}
        </div>
        {!expanded && !isMobile && <CalendarRightPanel />}
      </div>
    </div>
  );
}

/* P13 — Permanent mode indicator. Sits between the toolbar and the grid.
   Tells the user exactly what they're looking at:
   - Active preset name + colored dot
   - How many calendars are visible
   - Hour range (or "24h")
   - Names of explicitly hidden calendars (so a missing event reads as
     "Famille est éteint" not "où est mon dîner du dimanche ??")
   - 1-click "Tout voir" reset when the view is restricted. */
function ModeIndicator({ modeLabel, modeColor, calendarsActive, calendarsTotal, hoursLabel, hiddenCalendars, onReset, isDefault }) {
  const restricted = !isDefault;
  return (
    <div className={cn(
      "rounded-[10px] border px-3 py-2 flex items-center gap-3 text-[12px] transition-colors",
      restricted
        ? "border-[hsl(var(--primary)/0.35)] bg-[hsl(var(--primary)/0.05)]"
        : "border-[hsl(var(--border))] bg-[hsl(var(--card)/0.4)]"
    )}>
      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: `hsl(${modeColor})` }} />
      <span className="font-semibold whitespace-nowrap">View: {modeLabel}</span>
      <span className="text-[hsl(var(--muted-foreground))]">·</span>
      <span className="text-[hsl(var(--muted-foreground))] tabular-nums whitespace-nowrap">
        {calendarsActive}/{calendarsTotal} calendar{calendarsActive > 1 ? "s" : ""}
      </span>
      <span className="text-[hsl(var(--muted-foreground))]">·</span>
      <span className="text-[hsl(var(--muted-foreground))] font-mono tabular-nums whitespace-nowrap">{hoursLabel}</span>
      {hiddenCalendars.length > 0 && (
        <>
          <span className="text-[hsl(var(--muted-foreground))]">·</span>
          <span className="text-[hsl(38_92%_70%)] text-[11.5px] truncate flex items-center gap-1" title={`Calendars off: ${hiddenCalendars.join(", ")}`}>
            <Icons.Eye size={11} className="opacity-60 flex-shrink-0" />
            <span className="truncate">Hidden: {hiddenCalendars.join(", ")}</span>
          </span>
        </>
      )}
      <div className="flex-1" />
      {restricted && (
        <button
          onClick={onReset}
          className="text-[11.5px] text-[hsl(263_70%_80%)] hover:text-[hsl(263_70%_90%)] px-2 py-1 rounded hover:bg-[hsl(263_70%_30%/0.2)] flex items-center gap-1 whitespace-nowrap flex-shrink-0 font-medium"
        >
          <Icons.Refresh size={11} /> Show all
        </button>
      )}
    </div>
  );
}

/* P13 Context popover — composes the two levers (calendars + hour range)
   in a single dialog. Lists named presets at the top (Tout / Bureau / Perso /
   Famille), then editable sub-controls so a power user can tweak either
   lever independently — turning the active preset into "Personnalisé". */
function ContextPopover({ presets, activePresetId, visibleCalendars, hourRange, schedules, onApplyPreset, onToggleCalendar, onSetHourRange, onReset, onOpenSettings }) {
  const enabledSchedules = (schedules || []).filter(s => s.enabled);
  const calendarsMeta = [
    { name: "Work",   color: "263 70% 60%" },
    { name: "Personal", color: "38 92% 55%" },
    { name: "Sport",     color: "142 70% 50%" },
    { name: "Family",   color: "330 80% 60%" },
  ];
  return (
    <div
      role="menu"
      className="absolute right-0 top-full mt-1.5 w-[360px] rounded-[12px] border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-2xl z-30 anim-fade-in overflow-hidden"
    >
      {/* Presets */}
      <div className="px-3 pt-3 pb-2">
        <div className="text-[10px] uppercase tracking-[0.12em] font-semibold text-[hsl(var(--muted-foreground))] px-1 mb-2">
          Ready-to-use views
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {presets.map(p => {
            const active = activePresetId === p.id;
            return (
              <button
                key={p.id}
                onClick={() => onApplyPreset(p)}
                className={cn(
                  "text-left rounded-[8px] border px-2.5 py-2 transition-all",
                  active
                    ? "border-[hsl(var(--primary)/0.6)] bg-[hsl(var(--primary)/0.08)]"
                    : "border-[hsl(var(--border))] hover:border-[hsl(var(--primary)/0.4)] hover:bg-[hsl(var(--accent)/0.4)]"
                )}
              >
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ background: `hsl(${p.color})` }} />
                  <span className="text-[12.5px] font-semibold">{p.name}</span>
                  {active && <Icons.Check size={10} className="text-[hsl(var(--primary))] ml-auto" />}
                </div>
                <div className="text-[10px] text-[hsl(var(--muted-foreground))] mt-1 leading-snug truncate">
                  {p.calendars.length === 4 ? "All calendars" : p.calendars.join(" + ")}
                  {p.hours && ` · ${p.hours.start}–${p.hours.end}`}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Calendars filter */}
      <div className="px-3 py-2 border-t border-[hsl(var(--border))]">
        <div className="text-[10px] uppercase tracking-[0.12em] font-semibold text-[hsl(var(--muted-foreground))] px-1 mb-1.5">
          Visible calendars · {visibleCalendars.size}/{calendarsMeta.length}
        </div>
        <div className="space-y-0.5">
          {calendarsMeta.map(c => {
            const on = visibleCalendars.has(c.name);
            return (
              <button
                key={c.name}
                onClick={() => onToggleCalendar(c.name)}
                className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-[6px] hover:bg-[hsl(var(--accent)/0.5)] transition-colors"
              >
                <span
                  className={cn(
                    "w-4 h-4 rounded-[4px] border flex items-center justify-center flex-shrink-0 transition-all",
                    on ? "border-transparent" : "border-[hsl(var(--muted-foreground)/0.5)] bg-transparent"
                  )}
                  style={on ? { background: `hsl(${c.color})` } : {}}
                >
                  {on && <Icons.Check size={9} stroke={3} className="text-white" />}
                </span>
                <span className="flex-1 text-left text-[12.5px] font-medium">{c.name}</span>
                {!on && (
                  <span className="text-[10px] uppercase tracking-wider text-[hsl(38_92%_60%)] font-semibold flex items-center gap-1">
                    <Icons.Eye size={9} className="opacity-70" /> Off
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <div className="mt-2 px-1 text-[10px] text-[hsl(var(--muted-foreground))] leading-snug flex items-start gap-1">
          <Icons.AlertTriangle size={10} className="mt-0.5 flex-shrink-0 text-[hsl(38_92%_60%)]" />
          <span>Turning off a calendar hides its events <em className="not-italic font-semibold">and shows it in the mode indicator</em>. No event disappears without a signal.</span>
        </div>
      </div>

      {/* Hour range */}
      <div className="px-3 py-2 border-t border-[hsl(var(--border))]">
        <div className="text-[10px] uppercase tracking-[0.12em] font-semibold text-[hsl(var(--muted-foreground))] px-1 mb-1.5">
          Displayed time range
        </div>
        <div className="space-y-0.5">
          <HourRangeRow
            label="24 h (00:00–23:00)"
            sub="All hours visible"
            active={!hourRange}
            onClick={() => onSetHourRange(null)}
          />
          {enabledSchedules.map(s => {
            const isActive = hourRange && hourRange.start === s.start && hourRange.end === s.end;
            return (
              <HourRangeRow
                key={s.id}
                label={`${s.name}`}
                sub={`${s.start} → ${s.end}`}
                dot={`hsl(${s.color})`}
                active={isActive}
                onClick={() => onSetHourRange({ start: s.start, end: s.end })}
              />
            );
          })}
        </div>
        <div className="mt-2 px-1 text-[10px] text-[hsl(var(--muted-foreground))] leading-snug flex items-start gap-1">
          <Icons.AlertTriangle size={10} className="mt-0.5 flex-shrink-0 text-[hsl(38_92%_60%)]" />
          <span>The time range <em className="not-italic font-semibold">never removes</em> events: those outside the range are compacted into a collapsible band with a counter.</span>
        </div>
      </div>

      {/* Footer */}
      <div className="px-3 py-2.5 border-t border-[hsl(var(--border))] flex items-center justify-between gap-2 bg-[hsl(var(--background)/0.4)]">
        <button onClick={onReset} className="text-[11.5px] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] flex items-center gap-1">
          <Icons.Refresh size={11} /> Show all
        </button>
        <button onClick={onOpenSettings} className="text-[11.5px] text-[hsl(263_70%_80%)] hover:text-[hsl(263_70%_90%)] flex items-center gap-1 font-medium">
          Manage my ranges <Icons.ArrowRight size={11} />
        </button>
      </div>
    </div>
  );
}

function HourRangeRow({ label, sub, dot, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-2.5 px-2 py-1.5 rounded-[6px] transition-colors",
        active ? "bg-[hsl(var(--primary)/0.1)]" : "hover:bg-[hsl(var(--accent)/0.5)]"
      )}
    >
      {dot
        ? <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: dot }} />
        : <span className="w-2 h-2 rounded-full flex-shrink-0 bg-[hsl(var(--muted-foreground)/0.5)]" />}
      <span className={cn("flex-1 text-left text-[12.5px]", active ? "font-semibold text-[hsl(263_70%_85%)]" : "")}>
        {label}
      </span>
      <span className="text-[10.5px] font-mono tabular-nums text-[hsl(var(--muted-foreground))]">{sub}</span>
      {active && <Icons.Check size={11} className="text-[hsl(var(--primary))] flex-shrink-0" />}
    </button>
  );
}

function CalendarLeftPanel({ tree, onSetLeafEnabled, onSetBranchEnabled, onUpdateTree }) {
  const [collapsed, setCollapsed] = useState(new Set());            // node ids that are collapsed
  const [openMenu, setOpenMenu] = useState(null);                  // { nodeId } whose ... menu is open
  const [colorPickerFor, setColorPickerFor] = useState(null);      // node id whose color picker is open
  const [dragNode, setDragNode] = useState(null);                  // node being dragged
  const [dropTarget, setDropTarget] = useState(null);              // { parentId|null, depth, valid } target
  const menuRef = useRef(null);

  useEffect(() => {
    if (!openMenu) return;
    const h = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [openMenu]);

  const toggleCollapsed = (id) => setCollapsed(prev => {
    const next = new Set(prev);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  });

  const updateNodeColor = (nodeId, newColor) => {
    const walk = (nodes) => nodes.map(n => {
      if (n.id === nodeId) return { ...n, color: newColor };
      if (n.type === "cal") return n;
      return { ...n, children: walk(n.children) };
    });
    onUpdateTree(walk(tree));
  };
  const renameNode = (nodeId, newName) => {
    const walk = (nodes) => nodes.map(n => {
      if (n.id === nodeId) return { ...n, name: newName };
      if (n.type === "cal") return n;
      return { ...n, children: walk(n.children) };
    });
    onUpdateTree(walk(tree));
  };
  const deleteNode = (nodeId) => {
    const walk = (nodes) => nodes.filter(n => n.id !== nodeId).map(n => {
      if (n.type === "cal") return n;
      return { ...n, children: walk(n.children) };
    });
    onUpdateTree(walk(tree));
  };

  return (
    <div className="overflow-y-auto p-3 space-y-5" data-tour="feat-calendar-tree">
      {/* Mini cal */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[12px] font-semibold">{window.DPMDate ? window.DPMDate.monthYear() : "May 2026"}</span>
          <div className="flex items-center gap-0.5">
            <button className="w-6 h-6 rounded hover:bg-[hsl(var(--accent))] flex items-center justify-center text-[hsl(var(--muted-foreground))]">
              <Icons.ChevronLeft size={11} />
            </button>
            <button className="w-6 h-6 rounded hover:bg-[hsl(var(--accent))] flex items-center justify-center text-[hsl(var(--muted-foreground))]">
              <Icons.ChevronRight size={11} />
            </button>
          </div>
        </div>
        <MiniCal />
      </div>

      {/* Calendar tree */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[hsl(var(--muted-foreground))]">My calendars</span>
          <AddCalendarButton onAdd={(kind) => {
            // Stub: append a new node to the root
            const id = kind + "-" + Date.now();
            const fresh = kind === "cal"
              ? { type: "cal", id, name: "New calendar", color: "263 70% 60%", enabled: true }
              : { type: "group", id, name: "New group", color: "180 65% 50%", children: [] };
            onUpdateTree([...tree, fresh]);
            // Auto-expand the freshly created group
            if (kind === "group") setCollapsed(prev => { const next = new Set(prev); next.delete(id); return next; });
          }} />
        </div>
        <div className="space-y-0.5" ref={menuRef}>
          {tree.map(node => (
            <CalNode
              key={node.id}
              node={node}
              depth={0}
              collapsed={collapsed}
              onToggleCollapsed={toggleCollapsed}
              onSetLeafEnabled={onSetLeafEnabled}
              onSetBranchEnabled={onSetBranchEnabled}
              openMenuId={openMenu}
              onOpenMenu={setOpenMenu}
              colorPickerFor={colorPickerFor}
              onOpenColorPicker={setColorPickerFor}
              onUpdateColor={updateNodeColor}
              onRename={renameNode}
              onDelete={deleteNode}
              dragNode={dragNode}
              onDragStart={setDragNode}
              onDragEnd={() => { setDragNode(null); setDropTarget(null); }}
              dropTarget={dropTarget}
              onDropTarget={setDropTarget}
              onDrop={(targetParentId, targetDepth) => {
                if (!dragNode) return;
                // Depth check: subgroups can only live at depth 1; calendars
                // can live at depth 0 or 1 or 2.
                if (dragNode.type === "subgroup" && targetDepth >= 1) return;
                // Move logic — remove from tree then insert at target
                const remove = (nodes, id) => {
                  const out = [];
                  let removed = null;
                  for (const n of nodes) {
                    if (n.id === id) { removed = n; continue; }
                    if (n.type === "cal") { out.push(n); continue; }
                    const { kept, found } = (() => {
                      const r = remove(n.children, id);
                      return { kept: r.kept, found: r.removed };
                    })();
                    if (found) removed = found;
                    out.push({ ...n, children: kept });
                  }
                  return { kept: out, removed };
                };
                const insert = (nodes, parentId, item) => {
                  if (!parentId) return [...nodes, item];
                  return nodes.map(n => {
                    if (n.type === "cal") return n;
                    if (n.id === parentId) return { ...n, children: [...n.children, item] };
                    return { ...n, children: insert(n.children, parentId, item) };
                  });
                };
                const { kept, removed } = remove(tree, dragNode.id);
                if (!removed) return;
                onUpdateTree(insert(kept, targetParentId, removed));
                setDragNode(null);
                setDropTarget(null);
              }}
            />
          ))}
        </div>
      </div>

      {/* Shared calendars (legacy zone) */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[hsl(var(--muted-foreground))]">Shared</span>
          <button className="w-5 h-5 rounded hover:bg-[hsl(var(--accent))] flex items-center justify-center text-[hsl(var(--muted-foreground))]">
            <Icons.Plus size={11} />
          </button>
        </div>
        <div className="space-y-0.5">
          {[
            { name: "Design Team", color: "217 91% 60%" },
            { name: "Holidays FR", color: "0 70% 60%" },
          ].map(c => (
            <label key={c.name} className="flex items-center gap-2 py-1.5 px-1.5 rounded hover:bg-[hsl(var(--accent)/0.3)] cursor-pointer text-[12.5px]">
              <span className="w-3 h-3 rounded-[3px] flex-shrink-0" style={{ background: `hsl(${c.color})` }} />
              <span>{c.name}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

/* Single node renderer — used at depth 0 (groups & loose cals), 1 (cals &
   subgroups inside a group), and 2 (cals inside a subgroup).
   The depth prop is used both for indentation AND to enforce the 2-level cap. */
function CalNode({ node, depth, collapsed, onToggleCollapsed, onSetLeafEnabled, onSetBranchEnabled, openMenuId, onOpenMenu, colorPickerFor, onOpenColorPicker, onUpdateColor, onRename, onDelete, dragNode, onDragStart, onDragEnd, dropTarget, onDropTarget, onDrop }) {
  const indent = depth * 14;
  const isCollapsed = collapsed.has(node.id);
  const state = node.type === "cal"
    ? (node.enabled ? "on" : "off")
    : aggregateState(node);
  const menuOpen = openMenuId === node.id;
  const colorOpen = colorPickerFor === node.id;
  const isBeingDragged = dragNode?.id === node.id;
  const moreBtnRef = useRef(null);

  // Can this node accept a drop? Groups at depth 0 accept calendars and
  // subgroups (depth 1 children). Subgroups at depth 1 accept only calendars
  // (depth 2 children) — never subgroups (depth cap). Calendars accept nothing.
  const acceptsDrop = (() => {
    if (!dragNode || dragNode.id === node.id) return false;
    if (node.type === "cal") return false;
    if (node.type === "group") return true;
    // subgroup
    return dragNode.type === "cal";
  })();
  const isHover = dropTarget?.parentId === node.id;

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.stopPropagation();
        onDragStart(node);
        try { e.dataTransfer.setData("text/plain", node.id); } catch {}
        e.dataTransfer.effectAllowed = "move";
      }}
      onDragEnd={onDragEnd}
      onDragOver={(e) => {
        if (!dragNode || dragNode.id === node.id) return;
        e.preventDefault();
        e.stopPropagation();
        if (acceptsDrop) {
          onDropTarget({ parentId: node.id, depth: depth + 1, valid: true });
        } else if (node.type === "subgroup" && dragNode.type === "subgroup") {
          // Refused — subgroups can't nest
          onDropTarget({ parentId: node.id, depth: depth + 1, valid: false });
        }
      }}
      onDrop={(e) => {
        if (!dragNode || dragNode.id === node.id) return;
        e.preventDefault();
        e.stopPropagation();
        if (acceptsDrop) onDrop(node.id, depth + 1);
      }}
    >
      {/* The row */}
      <div
        className={cn(
          "group/row flex items-center gap-1.5 py-1.5 rounded-[6px] hover:bg-[hsl(var(--accent)/0.3)] relative",
          isBeingDragged && "opacity-40",
          isHover && (dropTarget?.valid ? "ring-1 ring-[hsl(var(--primary)/0.7)] bg-[hsl(var(--primary)/0.06)]" : "ring-1 ring-[hsl(0_84%_60%/0.7)] bg-[hsl(0_84%_60%/0.06)]"),
        )}
        style={{ paddingLeft: 6 + indent, paddingRight: 6 }}
      >
        {/* Chevron for groups/subgroups */}
        {node.type !== "cal" ? (
          <button
            onClick={() => onToggleCollapsed(node.id)}
            aria-label={isCollapsed ? "Expand" : "Collapse"}
            className="w-4 h-4 flex items-center justify-center text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
          >
            <Icons.ChevronRight size={10} className={cn("transition-transform", !isCollapsed && "rotate-90")} />
          </button>
        ) : (
          <span className="w-4 h-4 flex-shrink-0" />
        )}

        {/* Color pastille / state checkbox */}
        <ColorSwatch
          color={node.color}
          state={state}
          onClick={() => {
            if (node.type === "cal") onSetLeafEnabled(node.name, !node.enabled);
            else {
              // Group / subgroup: cycle on/off based on current state
              onSetBranchEnabled(node.id, state !== "on");
            }
          }}
        />

        {/* Label + count */}
        <div className="flex-1 min-w-0 flex items-center gap-1.5">
          <span title={node.name} className={cn(
            "text-[12.5px] truncate",
            node.type !== "cal" && "font-semibold",
            state === "off" && "text-[hsl(var(--muted-foreground))]"
          )}>{node.name}</span>
          {node.type !== "cal" && (
            <span className="text-[10px] font-mono tabular-nums text-[hsl(var(--muted-foreground))]">
              {flattenCalendars([node]).length}
            </span>
          )}
        </div>

        {/* ... menu */}
        <button
          ref={moreBtnRef}
          onClick={(e) => { e.stopPropagation(); onOpenMenu(menuOpen ? null : node.id); }}
          aria-label="Options"
          title="Options"
          className="w-6 h-6 rounded-md flex items-center justify-center text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))] opacity-0 group-hover/row:opacity-100 focus:opacity-100"
        >
          <Icons.More size={11} />
        </button>

        {menuOpen && (
          <NodeMenu
            node={node}
            onOpenColor={() => { onOpenMenu(null); onOpenColorPicker(node.id); }}
            onRename={() => {
              const next = window.prompt("New name:", node.name);
              if (next && next.trim()) onRename(node.id, next.trim());
              onOpenMenu(null);
            }}
            onDelete={() => { onDelete(node.id); onOpenMenu(null); }}
            onClose={() => onOpenMenu(null)}
          />
        )}
        {colorOpen && (
          <ColorPickerPopover
            anchor={moreBtnRef.current}
            current={node.color}
            onPick={(c) => { onUpdateColor(node.id, c); onOpenColorPicker(null); }}
            onClose={() => onOpenColorPicker(null)}
          />
        )}
      </div>

      {/* Children (if expanded) */}
      {node.type !== "cal" && !isCollapsed && node.children.length > 0 && (
        <div className="mt-0.5">
          {node.children.map(child => (
            <CalNode
              key={child.id}
              node={child}
              depth={depth + 1}
              collapsed={collapsed}
              onToggleCollapsed={onToggleCollapsed}
              onSetLeafEnabled={onSetLeafEnabled}
              onSetBranchEnabled={onSetBranchEnabled}
              openMenuId={openMenuId}
              onOpenMenu={onOpenMenu}
              colorPickerFor={colorPickerFor}
              onOpenColorPicker={onOpenColorPicker}
              onUpdateColor={onUpdateColor}
              onRename={onRename}
              onDelete={onDelete}
              dragNode={dragNode}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              dropTarget={dropTarget}
              onDropTarget={onDropTarget}
              onDrop={onDrop}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* Pastille = color swatch + 3-state checkbox.
   - "on"      : filled with the color + check icon
   - "off"     : outlined only (no fill)
   - "partial" : filled with the color + minus (used on group/subgroup parents
                 when only some leaves are on). */
function ColorSwatch({ color, state, onClick }) {
  return (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); onClick?.(); }}
      title={state === "on" ? "Show all (click to hide)" : state === "off" ? "Hide all (click to show)" : "Partially shown — click to show all"}
      className={cn(
        "w-4 h-4 rounded-[3px] flex items-center justify-center flex-shrink-0 transition-all border-2",
        state === "off" ? "bg-transparent" : "",
      )}
      style={{
        borderColor: `hsl(${color})`,
        background: state === "off" ? "transparent" : `hsl(${color})`,
      }}
    >
      {state === "on" && <Icons.Check size={9} stroke={4} className="text-white" />}
      {state === "partial" && <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="5" strokeLinecap="round"><path d="M6 12h12"/></svg>}
    </button>
  );
}

function NodeMenu({ node, onOpenColor, onRename, onDelete, onClose }) {
  return (
    <div
      role="menu"
      onClick={(e) => e.stopPropagation()}
      className="absolute right-0 top-full mt-1 w-44 rounded-[10px] border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-xl z-40 anim-fade-in py-1"
    >
      <MenuItem icon={Icons.Edit} onClick={onRename}>Rename</MenuItem>
      <MenuItem icon={Icons.Sparkles} onClick={onOpenColor}>Couleur…</MenuItem>
      <div className="my-1 border-t border-[hsl(var(--border))]" />
      <MenuItem icon={Icons.Trash} danger onClick={onDelete}>Delete</MenuItem>
    </div>
  );
}

function MenuItem({ icon: Icon, children, danger, onClick }) {
  return (
    <button
      role="menuitem"
      onClick={onClick}
      className={cn(
        "w-full text-left px-3 py-1.5 text-[12.5px] flex items-center gap-2 hover:bg-[hsl(var(--accent))]",
        danger ? "text-[hsl(0_84%_70%)]" : "text-[hsl(var(--foreground))]"
      )}
    >
      <Icon size={12} className={cn(!danger && "text-[hsl(var(--muted-foreground))]")} />
      {children}
    </button>
  );
}

/* Color picker — calibrated palette + custom hex. Validates contrast in
   dark mode with a soft warning when the picked color is too dark.
   Rendered via PORTAL to escape parent overflow / stacking contexts (P17 fix).
   Anchored to a trigger element, with auto-flip and shift to stay in viewport. */
function ColorPickerPopover({ anchor, current, onPick, onClose }) {
  const [showCustom, setShowCustom] = useState(false);
  const [hex, setHex] = useState("#8b5cf6");
  const popRef = useRef(null);
  const [pos, setPos] = useState({ top: -9999, left: -9999, ready: false });

  // Reposition on open, scroll, resize. Anti-collision: flip side if not enough
  // room; shift along the cross-axis to stay within viewport with a 12px pad.
  useEffect(() => {
    if (!anchor) return;
    const PAD = 12;
    const GAP = 8;
    const compute = () => {
      const a = anchor.getBoundingClientRect();
      const pop = popRef.current;
      const w = pop ? pop.offsetWidth : 256;
      const h = pop ? pop.offsetHeight : 320;
      const vw = window.innerWidth, vh = window.innerHeight;

      // Preferred side: right of trigger. Flip to left if not enough room.
      let left = a.right + GAP;
      if (left + w + PAD > vw) {
        // Try left side
        const leftSide = a.left - GAP - w;
        if (leftSide >= PAD) left = leftSide;
        // Otherwise: clamp inside viewport on the right edge
        else left = Math.max(PAD, vw - w - PAD);
      }

      // Preferred align: top of trigger. Shift up if it would overflow bottom.
      let top = a.top;
      if (top + h + PAD > vh) top = Math.max(PAD, vh - h - PAD);
      if (top < PAD) top = PAD;

      setPos({ top, left, ready: true });
    };
    compute();
    // Recompute after layout settles (custom panel opening changes height)
    const raf = requestAnimationFrame(compute);
    window.addEventListener("scroll", compute, true);
    window.addEventListener("resize", compute);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", compute, true);
      window.removeEventListener("resize", compute);
    };
  }, [anchor, showCustom]);

  // Click-outside / Escape close. Stops at trigger so the open toggle still works.
  useEffect(() => {
    const onDown = (e) => {
      if (popRef.current && popRef.current.contains(e.target)) return;
      if (anchor && anchor.contains(e.target)) return;
      onClose?.();
    };
    const onKey = (e) => { if (e.key === "Escape") onClose?.(); };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [anchor, onClose]);

  // Soft contrast warning: convert hex to luminance and warn if < 30%
  const customWarn = (() => {
    const c = hex.replace("#","");
    if (c.length !== 6) return false;
    const r = parseInt(c.slice(0,2), 16);
    const g = parseInt(c.slice(2,4), 16);
    const b = parseInt(c.slice(4,6), 16);
    const lum = (0.299*r + 0.587*g + 0.114*b) / 255;
    return lum < 0.3;
  })();

  const content = (
    <div
      ref={popRef}
      role="dialog"
      onClick={(e) => e.stopPropagation()}
      style={{ position: "fixed", top: pos.top, left: pos.left, opacity: pos.ready ? 1 : 0 }}
      className="w-[256px] rounded-[12px] border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-2xl z-[60] anim-fade-in p-3"
    >
      <div className="text-[10px] uppercase tracking-[0.12em] font-semibold text-[hsl(var(--muted-foreground))] mb-2">Calibrated color</div>
      <div className="grid grid-cols-6 gap-1.5">
        {CAL_COLOR_PALETTE.map(c => (
          <button
            key={c.hsl}
            onClick={() => onPick(c.hsl)}
            title={c.name}
            aria-label={c.name}
            className={cn(
              "w-9 h-9 rounded-[8px] flex items-center justify-center transition-all hover:scale-110",
              current === c.hsl && "ring-2 ring-offset-2 ring-offset-[hsl(var(--card))] ring-[hsl(var(--primary))]"
            )}
            style={{ background: `hsl(${c.hsl})` }}
          >
            {current === c.hsl && <Icons.Check size={14} className="text-white" stroke={3} />}
          </button>
        ))}
      </div>
      <button
        onClick={() => setShowCustom(s => !s)}
        className="mt-3 w-full text-left text-[11.5px] text-[hsl(263_70%_80%)] hover:text-[hsl(263_70%_90%)] flex items-center gap-1.5"
      >
        <Icons.Plus size={11} /> Custom {showCustom ? "—" : "+"}
      </button>
      {showCustom && (
        <div className="mt-2 space-y-2">
          {/* Big, obvious color preview tile that opens the native picker.
             The native <input type="color"> is hidden underneath but covers
             the whole tile, so the entire surface is the click target. */}
          <label
            className="relative block w-full h-12 rounded-[8px] cursor-pointer overflow-hidden border border-[hsl(var(--border))] hover:brightness-110 transition-all"
            style={{ background: hex }}
            title="Click to pick a shade"
          >
            <input
              type="color"
              value={hex}
              onChange={(e) => setHex(e.target.value)}
              aria-label="Pick a color"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="absolute inset-0 flex items-center justify-between px-3 pointer-events-none">
              <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: customWarn ? "#fff" : "#000", textShadow: customWarn ? "0 1px 2px rgba(0,0,0,0.4)" : "0 1px 2px rgba(255,255,255,0.3)", mixBlendMode: "normal" }}>
                Pick a shade
              </span>
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-[hsl(var(--card))]/85 backdrop-blur border border-[hsl(var(--border))] text-[hsl(var(--foreground))]">
                <Icons.Sparkles size={13} />
              </span>
            </div>
          </label>

          {/* Hex input row */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-[hsl(var(--muted-foreground))] w-8">Hex</span>
            <input
              type="text"
              value={hex}
              onChange={(e) => setHex(e.target.value)}
              className="flex-1 h-10 px-3 rounded-[8px] border border-[hsl(var(--input))] bg-[hsl(var(--background))] text-[13px] font-mono tabular-nums focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
            />
            <button
              onClick={() => {
                // Approximate hex→HSL (use as-is via inline-style; the rest of
                // the codebase expects "H S% L%" tokens — we keep simple).
                const c = hex.replace("#","");
                const r = parseInt(c.slice(0,2),16)/255;
                const g = parseInt(c.slice(2,4),16)/255;
                const b = parseInt(c.slice(4,6),16)/255;
                const max = Math.max(r,g,b), min = Math.min(r,g,b);
                let h = 0, s = 0, l = (max+min)/2;
                if (max !== min) {
                  const d = max - min;
                  s = l > 0.5 ? d/(2-max-min) : d/(max+min);
                  switch(max) {
                    case r: h = ((g-b)/d + (g<b?6:0)) * 60; break;
                    case g: h = ((b-r)/d + 2) * 60; break;
                    case b: h = ((r-g)/d + 4) * 60; break;
                  }
                }
                onPick(`${Math.round(h)} ${Math.round(s*100)}% ${Math.round(l*100)}%`);
              }}
              className="h-10 px-3 rounded-[8px] bg-[hsl(var(--primary))] text-white text-[12px] font-semibold hover:brightness-110"
            >
              OK
            </button>
          </div>
          {customWarn && (
            <div className="flex items-start gap-1.5 px-2 py-1.5 rounded-[6px] bg-[hsl(38_92%_55%/0.1)] border border-[hsl(38_92%_55%/0.3)]">
              <Icons.AlertTriangle size={11} className="text-[hsl(38_92%_60%)] mt-0.5 flex-shrink-0" />
              <span className="text-[10.5px] text-[hsl(38_92%_75%)] leading-snug">
                This color may be hard to read in dark mode. The event stays clickable but contrast is low.
              </span>
            </div>
          )}
          {/* Live preview */}
          <div className="rounded-[6px] border border-[hsl(var(--border))] p-2 flex items-center gap-2">
            <span className="text-[10px] text-[hsl(var(--muted-foreground))]">Preview:</span>
            <div className="flex-1 rounded-[4px] px-2 py-1 text-[11px]" style={{ background: hex + "30", borderLeft: `2px solid ${hex}`, color: hex }}>
              Team meeting
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Render to body so we escape any overflow:hidden / stacking-context cage.
  if (typeof document === "undefined") return null;
  return ReactDOM.createPortal(content, document.body);
}

/* Quick "add" button in the calendar tree header — opens a small menu. */
function AddCalendarButton({ onAdd }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);
  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(o => !o)} className="w-5 h-5 rounded hover:bg-[hsl(var(--accent))] flex items-center justify-center text-[hsl(var(--muted-foreground))]" aria-label="Add">
        <Icons.Plus size={11} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 w-44 rounded-[10px] border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-xl z-40 anim-fade-in py-1">
          <MenuItem icon={Icons.Calendar} onClick={() => { onAdd("cal"); setOpen(false); }}>New calendar</MenuItem>
          <MenuItem icon={Icons.Layout} onClick={() => { onAdd("group"); setOpen(false); }}>New group</MenuItem>
        </div>
      )}
    </div>
  );
}

function MiniCal() {
  const L = (typeof window !== "undefined" && window.__dpmLang === "fr") ? "fr" : "en";
  const D = window.DPMDate;
  const days = L === "fr" ? ["L","M","M","J","V","S","D"] : ["M","T","W","T","F","S","S"];
  const ref = D ? D.now() : new Date();
  const year = ref.getFullYear(), month = ref.getMonth();
  const first = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDay = (first.getDay() + 6) % 7; // 0 = Monday
  const todayN = (D ? D.sameDay(ref, D.today()) : true) ? ref.getDate() : -1;
  // Current week range (day-of-month numbers that fall in THIS month).
  const ws = D ? D.weekStart(ref) : null;
  const weekNums = ws ? Array.from({ length: 7 }, (_, i) => {
    const dd = D.addDays(ws, i);
    return dd.getMonth() === month ? dd.getDate() : null;
  }).filter(n => n != null) : [];
  const inRange = (n) => weekNums.includes(n);
  const cells = [];
  for (let i = 0; i < startDay; i++) cells.push(null);
  for (let i = 1; i <= daysInMonth; i++) cells.push(i);
  while (cells.length % 7) cells.push(null);
  return (
    <>
      <div className="grid grid-cols-7 gap-0.5 text-center mb-1">
        {days.map((d, i) => <div key={i} className="text-[10px] text-[hsl(var(--muted-foreground))]">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-0.5 text-center">
        {cells.map((c, i) => (
          <button key={i} disabled={!c} className={cn(
            "h-6 text-[10.5px] rounded transition-colors tabular-nums",
            !c && "invisible",
            c === todayN ? "bg-[hsl(var(--primary))] text-white font-semibold" :
            inRange(c) ? "bg-[hsl(var(--primary)/0.12)] text-[hsl(var(--foreground))]" :
            "text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))]"
          )}>{c}</button>
        ))}
      </div>
    </>
  );
}

function CalendarRightPanel() {
  // Unscheduled tasks now live in a shared store so they can be dragged out
  // into any calendar view and removed once scheduled.
  const [tasks, taskOps] = useTasks();
  const [addingTask, setAddingTask] = useState(false);
  const [taskDraft, setTaskDraft] = useState("");
  const [draggingId, setDraggingId] = useState(null);
  const addTask = () => {
    const v = taskDraft.trim();
    if (!v) return;
    taskOps.add({ t: v, d: "30min", mins: 30, p: "primary" });
    setTaskDraft(""); setAddingTask(false);
  };
  const removeTask = (id) => taskOps.remove(id);
  const renameTask = (id, next) => taskOps.rename(id, next);

  // Notes attached to the day summary
  const [notes, setNotes] = useState([]);
  const [addingNote, setAddingNote] = useState(false);
  const [noteDraft, setNoteDraft] = useState("");
  const addNote = () => {
    const v = noteDraft.trim();
    if (!v) return;
    setNotes(arr => [...arr, { id: "n" + Date.now(), t: v }]);
    setNoteDraft(""); setAddingNote(false);
  };

  // Suggestion controls
  const [sugDuration, setSugDuration] = useState("1h");
  const [sugType, setSugType] = useState("task");
  const [sugPrio, setSugPrio] = useState("MEDIUM");
  // P26 — selected slot reveals Créer / Partager actions
  const [selSlot, setSelSlot] = useState(null);

  return (
    <div className="overflow-y-auto bg-[hsl(var(--background))]">
      {/* Unscheduled */}
      <CalSection title="Unscheduled" icon={Icons.Inbox} count={tasks.length} defaultOpen>
        <div className="space-y-1.5">
          <p className="px-0.5 pb-0.5 text-[10.5px] text-[hsl(var(--muted-foreground))] flex items-center gap-1">
            <Icons.Drag size={10} /> Drag any item onto the calendar to schedule it
          </p>
          {tasks.map(task => (
            <div
              key={task.id}
              draggable
              onDragStart={(e) => { beginTaskDrag(task, e); setDraggingId(task.id); }}
              onDragEnd={() => { endTaskDrag(); setDraggingId(null); }}
              title="Drag onto the calendar to schedule it"
              className={cn(
                "rounded-[8px] border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-2.5 cursor-grab active:cursor-grabbing hover:border-[hsl(var(--primary)/0.4)] transition-all group/utask relative",
                draggingId === task.id && "opacity-40 ring-1 ring-[hsl(var(--primary)/0.5)]"
              )}
            >
              <div className="flex items-start gap-2">
                <Icons.Drag size={12} className="text-[hsl(var(--muted-foreground))] mt-1 flex-shrink-0 group-hover/utask:text-[hsl(var(--primary))]" />
                <div className="flex-1 min-w-0">
                  <div className="text-[12.5px] font-medium leading-snug">
                    <EditableTitle value={task.t} onCommit={(next) => renameTask(task.id, next)} />
                  </div>
                  <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                    <Badge variant={task.p} dot className="text-[10px]">{task.d}</Badge>
                    {task.e && <Badge variant="muted" className="text-[10px]">⚡ {task.e}</Badge>}
                  </div>
                </div>
              </div>
              <button
                onClick={() => removeTask(task.id)}
                title="Delete"
                className="absolute top-1.5 right-1.5 w-5 h-5 rounded text-[hsl(var(--muted-foreground))] hover:bg-[hsl(0_84%_60%/0.1)] hover:text-[hsl(0_84%_70%)] flex items-center justify-center opacity-0 group-hover/utask:opacity-100 transition-opacity">
                <Icons.X size={10} />
              </button>
            </div>
          ))}
          {addingTask ? (
            <div className="rounded-[8px] border border-[hsl(var(--primary)/0.4)] bg-[hsl(var(--card))] p-2 anim-fade-in">
              <input
                autoFocus
                value={taskDraft}
                onChange={e => setTaskDraft(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter") { e.preventDefault(); addTask(); }
                  if (e.key === "Escape") { setAddingTask(false); setTaskDraft(""); }
                }}
                placeholder="Task name…"
                className="w-full h-8 px-2 text-[12.5px] bg-transparent border-b border-[hsl(var(--primary)/0.4)] focus:outline-none mb-2"
              />
              <div className="flex items-center justify-end gap-1">
                <button onClick={() => { setAddingTask(false); setTaskDraft(""); }} className="text-[10.5px] px-2 py-1 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]">Cancel</button>
                <button onClick={addTask} disabled={!taskDraft.trim()}
                  className="text-[10.5px] px-2.5 py-1 rounded bg-[hsl(var(--primary))] text-white disabled:opacity-50">Add</button>
              </div>
            </div>
          ) : (
            <button onClick={() => setAddingTask(true)}
              className="w-full rounded-[8px] border border-dashed border-[hsl(var(--border))] p-2.5 text-[11.5px] text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent)/0.3)] hover:border-[hsl(var(--primary)/0.4)] flex items-center justify-center gap-1.5 transition-colors">
              <Icons.Plus size={12} /> Add a task
            </button>
          )}
        </div>
      </CalSection>

      <CalSection title={(function(){
        const D = window.DPMDate;
        const L = (typeof window !== "undefined" && window.__dpmLang === "fr") ? "fr" : "en";
        if (!D) return "Summary of May 24";
        const dayMonth = D.fmt(D.today(), { day: "numeric", month: "long" }, L);
        return L === "fr" ? `Résumé du ${dayMonth}` : `Summary of ${dayMonth}`;
      })()} icon={Icons.BarChart} defaultOpen>
        <div className="grid grid-cols-2 gap-2 mb-2">
          {[
            { l: "Events",      v: "3",   icon: Icons.Calendar,    c: "263 70% 60%" },
            { l: "Tasks done",  v: "2",   icon: Icons.CheckSquare, c: "142 70% 50%" },
            { l: "Pending",     v: String(tasks.length), icon: Icons.Clock, c: "38 92% 55%" },
            { l: "Habits",      v: "33%", icon: Icons.Flame,       c: "20 90% 55%" },
          ].map(s => (
            <div key={s.l} className="rounded-[8px] border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-2.5">
              <div className="flex items-center gap-1.5 text-[10px] text-[hsl(var(--muted-foreground))] mb-1">
                <s.icon size={10} style={{ color: `hsl(${s.c})` }} />
                <span>{s.l}</span>
              </div>
              <div className="text-[17px] font-bold tabular-nums leading-none">{s.v}</div>
            </div>
          ))}
        </div>

        {/* Notes list */}
        {notes.length > 0 && (
          <div className="space-y-1 mb-2">
            {notes.map(n => (
              <div key={n.id} className="group/note relative rounded-[8px] border border-dashed border-[hsl(var(--border))] bg-[hsl(var(--card)/0.5)] p-2 text-[11.5px] text-[hsl(var(--muted-foreground))]">
                {n.t}
                <button onClick={() => setNotes(arr => arr.filter(x => x.id !== n.id))}
                  className="absolute top-1 right-1 w-4 h-4 rounded text-[hsl(var(--muted-foreground))] hover:text-[hsl(0_84%_70%)] opacity-0 group-hover/note:opacity-100">
                  <Icons.X size={9} />
                </button>
              </div>
            ))}
          </div>
        )}

        {addingNote ? (
          <div className="space-y-1.5 anim-fade-in">
            <textarea
              autoFocus value={noteDraft}
              onChange={e => setNoteDraft(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); addNote(); }
                if (e.key === "Escape") { setAddingNote(false); setNoteDraft(""); }
              }}
              rows={2}
              placeholder="Quick note for the day…"
              className="w-full rounded-[8px] border border-[hsl(var(--primary)/0.4)] bg-[hsl(var(--background))] px-2.5 py-1.5 text-[11.5px] resize-none focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
            />
            <div className="flex items-center justify-end gap-1">
              <button onClick={() => { setAddingNote(false); setNoteDraft(""); }} className="text-[10.5px] px-2 py-1 text-[hsl(var(--muted-foreground))]">Cancel</button>
              <button onClick={addNote} disabled={!noteDraft.trim()} className="text-[10.5px] px-2.5 py-1 rounded bg-[hsl(var(--primary))] text-white disabled:opacity-50">Save</button>
            </div>
          </div>
        ) : (
          <button onClick={() => setAddingNote(true)}
            className="w-full h-8 rounded-[8px] border border-[hsl(var(--border))] hover:bg-[hsl(var(--accent)/0.3)] hover:border-[hsl(var(--primary)/0.4)] text-[11.5px] font-medium text-[hsl(var(--muted-foreground))] flex items-center justify-center gap-1.5 transition-colors">
            <Icons.Pen size={11} /> {notes.length > 0 ? "Add another note" : "Add notes"}
          </button>
        )}
      </CalSection>

      <CalSection title="Slot suggestions" icon={Icons.Sparkles} accent>
        <div className="grid grid-cols-3 gap-1.5 mb-3">
          <MiniSelect label="Duration" value={sugDuration} onChange={setSugDuration} options={[
            { value: "15min", label: "15 min" },
            { value: "30min", label: "30 min" },
            { value: "45min", label: "45 min" },
            { value: "1h",    label: "1 hour" },
            { value: "1h30",  label: "1h30" },
            { value: "2h",    label: "2 hours" },
            { value: "3h",    label: "3 hours" },
          ]} />
          <MiniSelect label="Type" value={sugType} onChange={setSugType} options={[
            { value: "task",    label: "Task" },
            { value: "meeting", label: "Meeting" },
            { value: "focus",   label: "Focus" },
            { value: "habit",   label: "Habit" },
          ]} />
          <MiniSelect label="Priority" value={sugPrio} onChange={setSugPrio} options={[
            { value: "URGENT", label: "Urgente" },
            { value: "HIGH",   label: "Haute" },
            { value: "MEDIUM", label: "Moyenne" },
            { value: "LOW",    label: "Basse" },
          ]} />
        </div>
        <div className="space-y-1.5">
          {(function(){
            const D = window.DPMDate;
            const L = (typeof window !== "undefined" && window.__dpmLang === "fr") ? "fr" : "en";
            const mk = (off) => D ? D.fmt(D.addDays(D.today(), off), { weekday: "short", month: "short", day: "numeric" }, L) : "Mon May 25";
            return [
              { d: mk(1), h: "09:00", desc: "Optimal morning slot for concentration", quality: "Optimal", icon: Icons.Zap },
              { d: mk(2), h: "09:00", desc: "Optimal morning slot for concentration", quality: "Optimal", icon: Icons.Clock },
              { d: mk(3), h: "10:30", desc: "Good slot after the standup",             quality: "Good",    icon: Icons.Clock },
            ];
          })().map((s, i) => {
            const selected = selSlot === i;
            return (
            <div key={i}
              onClick={() => setSelSlot(selected ? null : i)}
              className={cn(
                "rounded-[8px] border bg-[hsl(var(--card))] p-2.5 cursor-pointer transition-all",
                selected
                  ? "border-[hsl(var(--space-accent))] shadow-[0_0_0_1px_hsl(var(--space-accent)/0.5)] bg-[hsl(var(--space-accent)/0.06)]"
                  : "border-[hsl(var(--border))] hover:border-[hsl(var(--space-accent)/0.5)] hover:bg-[hsl(var(--accent)/0.25)]"
              )}>
              <div className="flex items-start gap-2">
                <div className="w-7 h-7 rounded-full bg-[hsl(142_70%_45%/0.15)] text-[hsl(142_70%_55%)] flex items-center justify-center flex-shrink-0">
                  <s.icon size={12} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[11.5px] font-semibold">{s.d}, {s.h}</div>
                  <div className="text-[10.5px] text-[hsl(var(--muted-foreground))] mt-0.5 leading-snug">{s.desc}</div>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span className={cn(
                    "px-1.5 py-0.5 rounded-full text-[9.5px] font-semibold",
                    s.quality === "Optimal" ? "bg-[hsl(142_70%_45%/0.15)] text-[hsl(142_70%_60%)]" : "bg-[hsl(38_92%_55%/0.15)] text-[hsl(38_92%_60%)]"
                  )}>{s.quality}</span>
                  <button onClick={(e) => { e.stopPropagation(); window.__dpmCreateFromSlot?.(s, { type: sugType, prio: sugPrio, duration: sugDuration }); }}
                    className="w-5 h-5 rounded-full bg-[hsl(var(--primary))] text-white flex items-center justify-center" title="Accepter ce créneau">
                    <Icons.Check size={10} stroke={3} />
                  </button>
                </div>
              </div>

              {/* P26 — action bar revealed on selection */}
              {selected && (
                <div className="mt-2.5 pt-2.5 border-t border-[hsl(var(--space-accent)/0.25)] anim-fade-in">
                  <div className="flex items-center gap-1.5 mb-2 text-[10px] text-[hsl(var(--muted-foreground))]">
                    <Icons.Clock size={11} />
                    <span className="font-mono">{s.h} → {window.__dpmSlotEndTime ? window.__dpmSlotEndTime(s.h, ({ "15min":15,"30min":30,"45min":45,"1h":60,"1h30":90,"2h":120,"3h":180 })[sugDuration] || 60) : ""}</span>
                    <span>·</span>
                    <span>{({ task:"Tâche", meeting:"Réunion", focus:"Focus", habit:"Habitude" })[sugType] || sugType}</span>
                    {(sugType === "task" || sugType === "habit") && window.PRIO_MAP && (
                      <span className="inline-flex items-center gap-1" style={{ color: `hsl(${window.PRIO_MAP[sugPrio].color})` }}>
                        · {window.PRIO_MAP[sugPrio].label}
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button onClick={(e) => { e.stopPropagation(); window.__dpmCreateFromSlot?.(s, { type: sugType, prio: sugPrio, duration: sugDuration }); }}
                      className="h-8 rounded-[7px] bg-[hsl(var(--primary))] text-white text-[11.5px] font-semibold flex items-center justify-center gap-1.5 hover:bg-[hsl(var(--primary)/0.9)]">
                      <Icons.Plus size={12} /> Créer
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); window.__dpmShareSlot?.(s, { type: sugType, prio: sugPrio, duration: sugDuration }); }}
                      className="h-8 rounded-[7px] border border-[hsl(var(--space-accent)/0.45)] text-[11.5px] font-semibold flex items-center justify-center gap-1.5 hover:bg-[hsl(var(--space-accent)/0.1)]">
                      <Icons.Share size={12} /> Partager
                    </button>
                  </div>
                </div>
              )}
            </div>
            );
          })}
        </div>
      </CalSection>

      <CalSection title="Events this week" icon={Icons.Calendar}>
        <div className="inline-flex p-0.5 rounded-[8px] bg-[hsl(var(--muted)/0.5)] mb-2.5 gap-0.5">
          {["All", "Past", "Upcoming"].map((t, i) => (
            <button key={t} className={cn(
              "px-2.5 h-6 rounded-[6px] text-[10.5px] font-medium transition-colors",
              i === 0 ? "bg-[hsl(var(--primary)/0.15)] text-[hsl(263_70%_75%)]" : "text-[hsl(var(--muted-foreground))]"
            )}>{t}</button>
          ))}
        </div>
        <div className="space-y-0.5">
          {(function(){
            const D = window.DPMDate;
            const L = (typeof window !== "undefined" && window.__dpmLang === "fr") ? "fr" : "en";
            const mk = (off, time) => (D ? D.fmt(D.addDays(D.today(), off), { day: "numeric", month: "short" }, L) : "20 May") + " " + time;
            return [
              { t: "Test Recurrence", h: mk(-3, "15:45"), done: true },
              { t: "Test Recurrence", h: mk(-2, "15:45"), done: true },
              { t: "Workshop archi",  h: mk(-2, "14:00"), done: true },
              { t: "Q2 presentation", h: mk(1, "10:00"),  done: false },
              { t: "Revue sprint",    h: mk(2, "15:00"),  done: false },
            ];
          })().map((ev, i) => (
            <div key={i} className="flex items-center gap-2 px-1.5 py-1.5 rounded hover:bg-[hsl(var(--accent)/0.3)]">
              <div className={cn(
                "w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                ev.done ? "bg-[hsl(38_92%_55%/0.15)] border-[hsl(38_92%_55%)]" : "border-[hsl(var(--muted-foreground)/0.5)]"
              )}>
                {ev.done && <Icons.Check size={7} stroke={3} className="text-[hsl(38_92%_60%)]" />}
              </div>
              <span className={cn("flex-1 text-[11.5px] truncate", ev.done && "line-through text-[hsl(var(--muted-foreground))]")}>{ev.t}</span>
              <span className="text-[10px] text-[hsl(var(--muted-foreground))] font-mono tabular-nums">{ev.h}</span>
            </div>
          ))}
        </div>
      </CalSection>

      <CalSection title="Week time" icon={Icons.Clock}>
        <div className="space-y-2.5">
          {[
            { name: "Work",  h: "51h", v: 51, max: 60, c: "38 92% 55%" },
            { name: "Personal",h: "8h",  v: 8,  max: 60, c: "263 70% 60%" },
            { name: "Sport",    h: "4h",  v: 4,  max: 60, c: "142 70% 50%" },
          ].map(c => (
            <div key={c.name}>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="font-medium">{c.name}</span>
                <span className="text-[hsl(var(--muted-foreground))] font-mono tabular-nums">{c.h}</span>
              </div>
              <div className="h-2 rounded-full bg-[hsl(var(--muted))] overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${(c.v/c.max)*100}%`, background: `hsl(${c.c})` }} />
              </div>
            </div>
          ))}
        </div>
      </CalSection>
    </div>
  );
}

function CalSection({ title, icon: Icon, count, accent, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-[hsl(var(--border))] last:border-b-0">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-2 px-3 py-3 hover:bg-[hsl(var(--accent)/0.2)] transition-colors"
      >
        <div className="flex items-center gap-2 min-w-0">
          {Icon && <Icon size={13} className={accent ? "text-[hsl(var(--primary))]" : "text-[hsl(var(--muted-foreground))]"} />}
          <span className={cn("text-[12.5px] font-semibold truncate", accent && "text-[hsl(var(--primary))]")}>{title}</span>
          {count !== undefined && <Badge variant="primary" className="font-mono ml-1">{count}</Badge>}
        </div>
        <Icons.ChevronDown size={12} className={cn("text-[hsl(var(--muted-foreground))] flex-shrink-0 transition-transform", !open && "-rotate-90")} />
      </button>
      {open && <div className="px-3 pb-3 anim-fade-in">{children}</div>}
    </div>
  );
}

function MiniSelect({ label, value, onChange, options }) {
  // If options provided, render a real <select>. Otherwise fall back to a
  // display-only button (legacy callers).
  if (options) {
    return (
      <div>
        <div className="text-[9.5px] text-[hsl(var(--muted-foreground))] mb-0.5 uppercase tracking-wider">{label}</div>
        <div className="relative">
          <select
            value={value}
            onChange={(e) => onChange && onChange(e.target.value)}
            className="w-full h-7 pl-2 pr-6 rounded-[6px] border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-[10.5px] hover:border-[hsl(var(--primary)/0.4)] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] appearance-none cursor-pointer truncate"
          >
            {options.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <Icons.ChevronDown size={10} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))] pointer-events-none" />
        </div>
      </div>
    );
  }
  return (
    <div>
      <div className="text-[9.5px] text-[hsl(var(--muted-foreground))] mb-0.5 uppercase tracking-wider">{label}</div>
      <button className="w-full h-7 px-2 rounded-[6px] border border-[hsl(var(--border))] bg-[hsl(var(--background))] flex items-center justify-between text-[10.5px] hover:border-[hsl(var(--primary)/0.4)]">
        <span className="truncate">{value}</span>
        <Icons.ChevronDown size={10} className="text-[hsl(var(--muted-foreground))] flex-shrink-0" />
      </button>
    </div>
  );
}

// Live current week (Mon-first). The mock events stay on their weekday COLUMN
// (index 0 = Monday … 6 = Sunday); only the dates + today flag go dynamic so
// the calendar always reads as "this week" instead of a frozen May 2026.
const WEEK_DAYS = (window.DPMDate
  ? window.DPMDate.weekDays()
  : [
      { d: "Mon", n: 18 }, { d: "Tue", n: 19 }, { d: "Wed", n: 20 },
      { d: "Thu", n: 21 }, { d: "Fri", n: 22 }, { d: "Sat", n: 23, today: true },
      { d: "Sun", n: 24 },
    ]);

/* Events use { start, dur } in hours. `task: true` => checkbox + strike when done.
   Includes intentional overlaps to demonstrate side-by-side layout. */
const WEEK_EVENTS = [
  // Lun (0)
  { day: 0, start: 7,    dur: 0.5,  title: "Morning meditation",     type: "personal" },
  { day: 0, start: 9,    dur: 0.25, title: "Team stand-up",         type: "meeting" },
  { day: 0, start: 10,   dur: 2,    title: "Focus deep work",         type: "focus" },
  { day: 0, start: 13,   dur: 1,    title: "Personal lunch",          type: "personal" },
  { day: 0, start: 14,   dur: 1,    title: "1:1 Léa",                 type: "meeting" },
  { day: 0, start: 16,   dur: 1.5,  title: "Login mockup",          type: "task", task: true, done: true },
  { day: 0, start: 18.5, dur: 1,    title: "Run",           type: "personal" },

  // Mar (1) — overlap cluster 10:00–11:30
  { day: 1, start: 9,    dur: 0.25, title: "Team stand-up",         type: "meeting" },
  { day: 1, start: 10,   dur: 1,    title: "1:1 Sarah (design)",      type: "meeting" },
  { day: 1, start: 10,   dur: 1.5,  title: "Atelier UX onboarding",   type: "meeting" },
  { day: 1, start: 10.5, dur: 0.5,  title: "Appel client Lyon",       type: "meeting" },
  { day: 1, start: 11.5, dur: 1.5,  title: "Refactor auth",           type: "task", task: true },
  { day: 1, start: 14,   dur: 2,    title: "Proposition Desjardins",  type: "task", task: true },
  { day: 1, start: 16.5, dur: 0.75, title: "Review PR #142",          type: "task", task: true, done: true },

  // Mer (2)
  { day: 2, start: 8,    dur: 0.5,  title: "Stretching",              type: "personal" },
  { day: 2, start: 9,    dur: 0.25, title: "Team stand-up",         type: "meeting" },
  { day: 2, start: 14,   dur: 3,    title: "Microservices arch workshop",type: "meeting" },
  { day: 2, start: 17.5, dur: 1,    title: "Run",           type: "personal" },

  // Jeu (3) — overlap 14–15 / 14:30–16
  { day: 3, start: 9,    dur: 0.25, title: "Team stand-up",         type: "meeting" },
  { day: 3, start: 10,   dur: 2,    title: "Travail profond",         type: "focus" },
  { day: 3, start: 12,   dur: 1,    title: "Lunch with Marc",      type: "personal" },
  { day: 3, start: 14,   dur: 1,    title: "Prep Q2 presentation",type: "task", task: true, done: true },
  { day: 3, start: 14.5, dur: 1.5,  title: "Design system review",    type: "meeting" },

  // Ven (4)
  { day: 4, start: 9,    dur: 0.25, title: "Team stand-up",         type: "meeting" },
  { day: 4, start: 10,   dur: 1,    title: "Q2 Board presentation",   type: "meeting" },
  { day: 4, start: 14,   dur: 2,    title: "Focus deep work",         type: "focus" },
  { day: 4, start: 15,   dur: 1,    title: "Revue sprint",            type: "meeting" },
  { day: 4, start: 22,   dur: 0.5,  title: "Journaling",              type: "personal" },

  // Sam (5) — today
  { day: 5, start: 10,   dur: 1.5,  title: "Meditation + Reading",    type: "personal" },
  { day: 5, start: 14,   dur: 1,    title: "Test",                    type: "task", task: true, done: true },
  { day: 5, start: 16,   dur: 1,    title: "Yoga",                    type: "personal" },

  // Dim (6)
  { day: 6, start: 14,   dur: 0.75, title: "Planifier sprint",        type: "task", task: true },
  { day: 6, start: 19,   dur: 1,    title: "Family dinner",           type: "personal" },
];

/* All-day strip: per-day items.
   kind "habit" = recurring (no checkbox), kind "task" = checkable. */
const WEEK_ALLDAY = [
  // Lun
  [
    { id: "ad-l-1", kind: "habit", title: "Read the bible",   color: "263 70% 60%" },
    { id: "ad-l-2", kind: "habit", title: "My workout",       color: "142 70% 50%" },
    { id: "ad-l-3", kind: "habit", title: "Journaling",      color: "330 80% 60%" },
    { id: "ad-l-4", kind: "task",  title: "Buy train tickets", color: "217 91% 60%" },
  ],
  // Mar
  [
    { id: "ad-m-1", kind: "habit", title: "Read the bible",   color: "263 70% 60%" },
    { id: "ad-m-2", kind: "habit", title: "My workout",       color: "142 70% 50%" },
    { id: "ad-m-3", kind: "task",  title: "Do my review",  color: "38 92% 55%" },
  ],
  // Mer
  [
    { id: "ad-w-1", kind: "habit", title: "Read the bible",   color: "263 70% 60%" },
    { id: "ad-w-2", kind: "habit", title: "Meditation",      color: "263 70% 60%" },
    { id: "ad-w-3", kind: "habit", title: "My workout",       color: "142 70% 50%" },
    { id: "ad-w-4", kind: "habit", title: "Journaling",      color: "330 80% 60%" },
    { id: "ad-w-5", kind: "task",  title: "Renew transit pass", color: "20 90% 55%" },
  ],
  // Jeu
  [
    { id: "ad-j-1", kind: "habit", title: "Read the bible",   color: "263 70% 60%" },
    { id: "ad-j-2", kind: "habit", title: "My workout",       color: "142 70% 50%" },
    { id: "ad-j-3", kind: "task",  title: "Call Mom",   color: "330 80% 60%", done: true },
  ],
  // Ven
  [
    { id: "ad-v-1", kind: "habit", title: "Read the bible",   color: "263 70% 60%" },
    { id: "ad-v-2", kind: "habit", title: "My workout",       color: "142 70% 50%" },
    { id: "ad-v-3", kind: "habit", title: "Journaling",      color: "330 80% 60%" },
    { id: "ad-v-4", kind: "task",  title: "Prep weekend",color: "217 91% 60%" },
    { id: "ad-v-5", kind: "task",  title: "Pay electricity bill", color: "20 90% 55%" },
  ],
  // Sam (today)
  [
    { id: "ad-s-1", kind: "habit", title: "Read the bible",   color: "263 70% 60%" },
    { id: "ad-s-2", kind: "habit", title: "Meditation",      color: "263 70% 60%" },
    { id: "ad-s-3", kind: "habit", title: "My workout",       color: "142 70% 50%" },
    { id: "ad-s-4", kind: "task",  title: "Grocery shopping",color: "38 92% 55%" },
    { id: "ad-s-5", kind: "task",  title: "Mom's birthday", color: "330 80% 60%" },
    { id: "ad-s-6", kind: "task",  title: "Do my review",  color: "38 92% 55%" },
  ],
  // Dim
  [
    { id: "ad-d-1", kind: "habit", title: "Read the bible",   color: "263 70% 60%" },
    { id: "ad-d-2", kind: "habit", title: "Meditation",      color: "263 70% 60%" },
    { id: "ad-d-3", kind: "task",  title: "Prep the week", color: "263 70% 60%" },
  ],
];

/* Assigns col / totalCols to each event so simultaneous events share width. */
function layoutOverlaps(items) {
  const annotated = items.map((it, idx) => ({ idx, start: it.start, end: it.start + it.dur }));
  annotated.sort((a, b) => a.start - b.start || a.end - b.end);
  const out = new Map();
  let cluster = [];
  let clusterEnd = -Infinity;
  const flushCluster = () => {
    if (!cluster.length) return;
    const cols = [];
    for (const node of cluster) {
      let placed = -1;
      for (let i = 0; i < cols.length; i++) {
        if (cols[i] <= node.start + 1e-9) { cols[i] = node.end; placed = i; break; }
      }
      if (placed === -1) { cols.push(node.end); placed = cols.length - 1; }
      node.col = placed;
    }
    const total = cols.length;
    for (const node of cluster) out.set(node.idx, { col: node.col, totalCols: total });
    cluster = [];
    clusterEnd = -Infinity;
  };
  for (const node of annotated) {
    if (node.start >= clusterEnd - 1e-9) flushCluster();
    cluster.push(node);
    clusterEnd = Math.max(clusterEnd, node.end);
  }
  flushCluster();
  return out;
}

function WeekView({ emptyState, visibleCalendars, hourRange, zoomPx = CAL_ZOOM_DEFAULT }) {
  // P13 — Two independent levers:
  // - visibleCalendars (Set): hides events whose calendar is OFF (user-chosen,
  //   surfaced in ModeIndicator). Hidden = removed from layout entirely.
  // - hourRange ({start,end} | null): collapses hours OUTSIDE the range into
  //   top/bottom bands with a counter. NEVER hides events; collapsed events
  //   are surfaced via the band's counter.
  // Golden rule: a real event is never grayed, dimmed, or hidden silently.
  const startHour = 0;
  const totalHours = 24;
  // P21 — zoom: hour-row height AND event/label font sizes scale together.
  const hourPx = zoomPx;
  const titleFont = zoomFont(hourPx, 11, 11, 17);
  const timeFont = zoomFont(hourPx, 9.5, 9.5, 14);
  const hourLabelFont = zoomFont(hourPx, 9.5, 9.5, 13);

  // Inline calendar→type mapping (mocked — in real app this is on the event).
  // Used to filter events by the visibleCalendars set.
  const EVENT_CAL = {
    meeting:  "Work",
    task:     "Work",
    focus:    "Work",
    personal: "Personal",
  };
  const isCalendarVisible = (e) => !visibleCalendars || visibleCalendars.has(EVENT_CAL[e.type] || "Work");

  // Hour-band logic (P13):
  // rangeStart/rangeEnd in float hours when hourRange is active.
  const rStart = hourRange ? parseHM(hourRange.start) : startHour;
  const rEnd   = hourRange ? parseHM(hourRange.end)   : startHour + totalHours;
  const hasRange = !!hourRange;
  const beforeHeight = hasRange ? Math.max(0, rStart - startHour) * hourPx : 0;
  const insideHeight = hasRange ? Math.max(0, (rEnd - rStart)) * hourPx : totalHours * hourPx;
  const afterHeight  = hasRange ? Math.max(0, (startHour + totalHours - rEnd)) * hourPx : 0;
  const totalHeight  = hasRange ? insideHeight : totalHours * hourPx;

  // Manually expand a collapsed band so events become accessible.
  const [expandedBands, setExpandedBands] = useState(new Set());
  const beforeExpanded = expandedBands.has("before");
  const afterExpanded  = expandedBands.has("after");
  const toggleBand = (id) => setExpandedBands(prev => {
    const next = new Set(prev);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  });

  const nowHour = 14 + 32/60;
  // y-coordinate in the SCROLLED viewport — depends on which bands are open.
  // If hours are collapsed (band closed), events in that band aren't on the
  // main grid; we render them inside the band overlay (see below).
  const yOf = (hour) => {
    if (!hasRange) return (hour - startHour) * hourPx;
    if (hour < rStart) return (hour - startHour) * hourPx; // we'll only use this when band is open
    if (hour > rEnd)   return beforeHeight + insideHeight + (hour - rEnd) * hourPx;
    return (hour - rStart) * hourPx;
  };
  const nowOffset = (() => {
    if (!hasRange) return (nowHour - startHour) * hourPx;
    // Inside the visible inside-range zone
    if (nowHour >= rStart && nowHour <= rEnd) return (nowHour - rStart) * hourPx;
    return null; // outside the visible range — don't draw
  })();

  // Events partitioned by zone: before / inside / after
  const filteredEvents = WEEK_EVENTS.filter(isCalendarVisible);
  const eventsInside = filteredEvents.filter(e => !hasRange || (e.start + e.dur > rStart && e.start < rEnd));
  const eventsBefore = hasRange ? filteredEvents.filter(e => e.start + e.dur <= rStart) : [];
  const eventsAfter  = hasRange ? filteredEvents.filter(e => e.start >= rEnd) : [];

  const [events, setEvents] = useState(WEEK_EVENTS);
  const [allDay, setAllDay] = useState(WEEK_ALLDAY);
  const [allDayExpanded, setAllDayExpanded] = useState(false);
  const [, taskOps] = useTasks();
  const taskDragging = useTaskDragging();
  const [taskDrop, setTaskDrop] = useState(null); // { day, start, dur } incoming-task preview
  const [allDayDrop, setAllDayDrop] = useState(null); // day index hovered on the all-day strip
  const [popover, setPopover] = useState(null); // { day, hour, x, y }
  const [draft, setDraft] = useState(null); // live range preview { dayIndex, start, end, allDay, freq, color, mode, title }
  const [detail, setDetail] = useState(null); // event/task details popover { e, idx, left, top }
  const dragRef = useRef(null);        // active drag/resize op
  const suppressClickRef = useRef(false); // ignore the click that ends a drag
  const [dragPreview, setDragPreview] = useState(null); // Google-style move preview { idx, day, start, dur, color, title, isTask }
  const [editingEventIdx, setEditingEventIdx] = useState(null);
  const scrollRef = useRef(null);
  const gridRef = useRef(null);

  // Delete and edit handlers for events
  const deleteEvent = (idx) => setEvents(prev => prev.filter((_, i) => i !== idx));
  const updateEvent = (idx, patch) => setEvents(prev => prev.map((e, i) => i === idx ? { ...e, ...patch } : e));

  // P28 — event/task details popover (click an event, à la Google Agenda)
  const openDetail = (e, idx, ev) => {
    const r = ev.currentTarget.getBoundingClientRect();
    const w = 340, h = 260;
    let left = r.right + 8;
    if (left + w > window.innerWidth - 8) left = r.left - w - 8;
    if (left < 8) left = 8;
    let top = r.top;
    if (top + h > window.innerHeight - 8) top = Math.max(8, window.innerHeight - h - 8);
    setDetail({ e, idx, left: left + window.scrollX, top: top + window.scrollY });
  };
  useEffect(() => {
    if (!detail) return;
    const h = () => setDetail(null);
    const k = (ev) => { if (ev.key === "Escape") setDetail(null); };
    document.addEventListener("mousedown", h);
    document.addEventListener("keydown", k);
    return () => { document.removeEventListener("mousedown", h); document.removeEventListener("keydown", k); };
  }, [detail]);

  // P28 — create an event/task from the popover (timed or all-day, with recurrence spread).
  const createItem = (p) => {
    const cols = spreadCols(p);
    if (p.allDay) {
      setAllDay(prev => prev.map((day, i) => cols.includes(i)
        ? [{ id: "u" + Date.now() + "-" + i, kind: p.mode === "task" ? "task" : "habit", title: p.title, color: p.color, done: false }, ...day]
        : day));
    } else {
      const dur = Math.max(0.25, p.end - p.start);
      const news = cols.map((di) => ({ day: di, start: p.start, dur, title: p.title, type: p.mode === "task" ? "task" : "meeting", color: p.color, task: p.mode === "task", done: false }));
      setEvents(prev => [...prev, ...news]);
    }
  };

  // Recompute filtered/partitioned events from the LIVE state.
  const liveFiltered = events.filter(e => isCalendarVisible(e) && !e.allDay);
  const liveInside = liveFiltered.filter(e => !hasRange || (e.start + e.dur > rStart && e.start < rEnd));
  const liveBefore = hasRange ? liveFiltered.filter(e => e.start + e.dur <= rStart) : [];
  const liveAfter  = hasRange ? liveFiltered.filter(e => e.start >= rEnd) : [];

  useEffect(() => {
    if (!scrollRef.current) return;
    const target = hourRange ? 0 : Math.max(0, 7 * hourPx - 32);
    scrollRef.current.scrollTo({
      top: target,
      behavior: scrollRef.current.dataset.everScrolled ? "smooth" : "auto",
    });
    scrollRef.current.dataset.everScrolled = "1";
  }, [hourRange?.start, hourRange?.end]);

  if (emptyState) {
    return (
      <div className="flex-1 flex flex-col">
        <WeekHeader />
        <div className="flex-1 flex items-center justify-center bg-[hsl(var(--background))] dotted-grid">
          <Card padding="p-7" className="max-w-sm text-center">
            <Icons.Calendar size={32} className="text-[hsl(var(--muted-foreground))] mx-auto mb-3" />
            <h3 className="text-[16px] font-semibold mb-1.5">Empty week</h3>
            <p className="text-[12.5px] text-[hsl(var(--muted-foreground))] mb-4">Click a slot or drag a task from the right to schedule it.</p>
            <Button size="sm" icon={Icons.Plus}>Create an event</Button>
          </Card>
        </div>
      </div>
    );
  }

  const typeStyle = {
    meeting: { bg: "hsl(217 91% 60% / 0.18)", border: "hsl(217 91% 60%)", text: "hsl(217 91% 80%)" },
    task:    { bg: "hsl(263 70% 60% / 0.18)", border: "hsl(263 70% 60%)", text: "hsl(263 70% 80%)" },
    focus:   { bg: "hsl(142 70% 50% / 0.16)", border: "hsl(142 70% 50%)", text: "hsl(142 70% 75%)" },
    personal:{ bg: "hsl(38 92% 55% / 0.16)",  border: "hsl(38 92% 55%)",  text: "hsl(38 92% 75%)"  },
  };

  // Precompute per-day overlap layouts — ONLY for events currently inside
  // the visible range. Events in collapsed bands are surfaced via the band
  // counter and become layout-able when the band is expanded.
  const insideForLayout = (beforeExpanded || afterExpanded || !hasRange)
    ? liveFiltered
    : liveInside;
  const dayLayouts = WEEK_DAYS.map((_, di) => {
    const items = insideForLayout.map((e, i) => {
      const origIdx = events.indexOf(e);
      return { ...e, _origIdx: origIdx };
    }).filter(e => e.day === di);
    const layout = layoutOverlaps(items);
    return items.map((it, i) => ({ ...it, _idxInDay: i, _layout: layout.get(i) }));
  });

  // All-day cap
  const allDayCap = 3;
  const overflowCounts = allDay.map(d => Math.max(0, d.length - allDayCap));
  const hasOverflow = overflowCounts.some(n => n > 0);

  const toggleAllDayTask = (di, id) => {
    setAllDay(prev => prev.map((day, i) =>
      i === di ? day.map(it => it.id === id ? { ...it, done: !it.done } : it) : day
    ));
  };
  const toggleInlineTask = (eventRefIdx) => {
    setEvents(prev => prev.map((e, i) => i === eventRefIdx ? { ...e, done: !e.done } : e));
  };

  const openPopoverFromGrid = (di, e) => {
    const colEl = e.currentTarget;
    const rect = colEl.getBoundingClientRect();
    const containerRect = gridRef.current.getBoundingClientRect();
    const yWithinCol = e.clientY - rect.top;
    const hourFloat = startHour + yWithinCol / hourPx;
    const snap = Math.round(hourFloat * 4) / 4;
    const clampedHour = Math.max(startHour, Math.min(startHour + totalHours - 0.25, snap));
    setPopover({
      day: di,
      hour: clampedHour,
      x: rect.left - containerRect.left + rect.width / 2,
      y: clampedHour * hourPx + 8,
    });
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <WeekHeader />

      {/* All-day strip — minimal column separators */}
      <div className="grid border-b border-[hsl(var(--border))] bg-[hsl(var(--card)/0.4)]" style={{ gridTemplateColumns: "56px repeat(7, 1fr)" }}>
        <div className="px-2 py-1.5 flex items-start justify-end pr-2">
          <div className="text-[9.5px] uppercase tracking-wider text-[hsl(var(--muted-foreground))] font-semibold mt-1 leading-tight text-right">
            All<br/>day
          </div>
        </div>
        {allDay.map((dayItems, di) => {
          const visibleItems = allDayExpanded ? dayItems : dayItems.slice(0, allDayCap);
          const hidden = overflowCounts[di];
          return (
            <div key={di} className={cn(
              "px-1 py-1 space-y-0.5 relative",
              WEEK_DAYS[di].today && "bg-[hsl(var(--primary)/0.04)]",
              allDayDrop === di && "ring-1 ring-inset ring-[hsl(var(--primary)/0.6)] bg-[hsl(var(--primary)/0.06)]"
            )}
              onDragOver={(e) => { if (!window.__dpmDragTask) return; e.preventDefault(); e.dataTransfer.dropEffect = "move"; setAllDayDrop(di); }}
              onDragLeave={(e) => { if (e.currentTarget.contains(e.relatedTarget)) return; setAllDayDrop(prev => prev === di ? null : prev); }}
              onDrop={(e) => {
                const t = window.__dpmDragTask;
                if (!t) return;
                e.preventDefault();
                setAllDay(prev => prev.map((day, i) => i === di
                  ? [{ id: "u" + Date.now(), kind: "task", title: t.title, color: t.color, done: false }, ...day]
                  : day));
                taskOps.remove(t.id);
                endTaskDrag();
                setAllDayDrop(null);
              }}
            >
              {draft && draft.allDay && spreadCols(draft).includes(di) && (
                <div className="rounded-[5px] border border-dashed px-1.5 py-0.5 text-[10.5px] font-medium truncate" style={{ borderColor: `hsl(${draft.color})`, background: `hsl(${draft.color} / 0.16)`, color: "hsl(var(--foreground))", opacity: di === draft.dayIndex ? 1 : 0.5 }}>
                  {(draft.mode === "task" ? "✓ " : "") + (draft.title || (draft.mode === "task" ? "(Nouvelle tâche)" : "(Nouvel événement)"))}
                </div>
              )}
              {visibleItems.map(it => (
                <AllDayChip key={it.id} item={it} onToggle={() => it.kind === "task" && toggleAllDayTask(di, it.id)} />
              ))}
              {!allDayExpanded && hidden > 0 && (
                <button
                  onClick={() => setAllDayExpanded(true)}
                  className="w-full text-left px-1.5 py-0.5 rounded text-[10.5px] font-semibold text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent)/0.5)] hover:text-[hsl(var(--foreground))]"
                >
                  +{hidden} more
                </button>
              )}
            </div>
          );
        })}
      </div>
      {allDayExpanded && hasOverflow && (
        <div className="flex justify-end px-3 py-1 border-b border-[hsl(var(--border))] bg-[hsl(var(--card)/0.4)]">
          <button
            onClick={() => setAllDayExpanded(false)}
            className="text-[10.5px] font-semibold text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] px-2 py-0.5 rounded hover:bg-[hsl(var(--accent)/0.5)] flex items-center gap-1"
          >
            <Icons.ChevronUp size={10} /> Collapse band
          </button>
        </div>
      )}

      {/* Hour grid — single background grid, 7 click columns on top */}
      <div className="flex-1 overflow-auto relative bg-[hsl(var(--background))]" ref={scrollRef}>
        {/* Before-range collapsed band (P13) — surfaces events compacted at the top */}
        {hasRange && rStart > startHour && (
          <CollapsedHourBand
            position="before"
            rangeStart={startHour}
            rangeEnd={rStart}
            events={liveBefore}
            expanded={beforeExpanded}
            onToggle={() => toggleBand("before")}
          />
        )}
        <div className="flex relative" style={{ minWidth: 700, height: totalHeight }} ref={gridRef}>
          {/* Hour col (labels) */}
          <div className="w-14 flex-shrink-0 relative sticky left-0 bg-[hsl(var(--background))] z-10" style={{ height: totalHeight }}>
            {Array.from({ length: Math.ceil(rEnd) - Math.floor(rStart) + 1 }, (_, i) => {
              const h = Math.floor(rStart) + i;
              if (h < 0 || h > 23) return null;
              const y = (h - rStart) * hourPx;
              if (y < 0 || y > totalHeight) return null;
              return (
                <div key={h} className="absolute text-[hsl(var(--muted-foreground))] font-mono tabular-nums right-2" style={{ top: y + 2, fontSize: hourLabelFont }}>
                  {String(h).padStart(2,"0")}:00
                </div>
              );
            })}
          </div>

          {/* Day area — single background of hour lines + 7 click columns overlay */}
          <div className="flex-1 relative" style={{ height: totalHeight }}>
            {/* BACKGROUND layer — 24 hour lines + half lines, drawn ONCE full-width */}
            <div className="absolute inset-0 pointer-events-none">
              {Array.from({ length: totalHours + 1 }, (_, i) => (
                <div key={i} className="absolute left-0 right-0 border-t border-[hsl(var(--border)/0.45)]" style={{ top: i * hourPx }} />
              ))}
              {Array.from({ length: totalHours }, (_, i) => (
                <div key={`h${i}`} className="absolute left-0 right-0 border-t border-dashed border-[hsl(var(--border)/0.22)]" style={{ top: i * hourPx + hourPx/2 }} />
              ))}
            </div>

            {/* 7-column overlay (click targets + events) — NO visible vertical borders */}
            <div className="absolute inset-0 grid" style={{ gridTemplateColumns: "repeat(7, 1fr)" }}>
              {WEEK_DAYS.map((d, di) => (
                <div
                  key={di}
                  className={cn(
                    "relative cursor-pointer",
                    d.today && "bg-[hsl(var(--primary)/0.025)]",
                    taskDrop?.day === di && "ring-1 ring-inset ring-[hsl(var(--primary)/0.6)] bg-[hsl(var(--primary)/0.05)]"
                  )}
                  onClick={(e) => {
                    if (e.target === e.currentTarget || e.target.dataset?.gridBg === "1") {
                      openPopoverFromGrid(di, e);
                    }
                  }}
                  onDragOver={(e) => {
                    if (!window.__dpmDragTask) return;
                    e.preventDefault();
                    e.dataTransfer.dropEffect = "move";
                    const colRect = e.currentTarget.getBoundingClientRect();
                    const origin = hasRange ? rStart : startHour;
                    const dur = Math.max(0.25, window.__dpmDragTask.mins / 60);
                    const maxH = startHour + totalHours;
                    let start = origin + (e.clientY - colRect.top) / hourPx;
                    start = Math.round(start * 4) / 4;
                    start = Math.max(startHour, Math.min(start, maxH - dur));
                    setTaskDrop({ day: di, start, dur });
                  }}
                  onDragLeave={(e) => {
                    if (e.currentTarget.contains(e.relatedTarget)) return;
                    setTaskDrop(prev => (prev && prev.day === di ? null : prev));
                  }}
                  onDrop={(e) => {
                    const t = window.__dpmDragTask;
                    if (!t) return;
                    e.preventDefault();
                    const colRect = e.currentTarget.getBoundingClientRect();
                    const origin = hasRange ? rStart : startHour;
                    const dur = Math.max(0.25, t.mins / 60);
                    const maxH = startHour + totalHours;
                    let start = origin + (e.clientY - colRect.top) / hourPx;
                    start = Math.round(start * 4) / 4;
                    start = Math.max(startHour, Math.min(start, maxH - dur));
                    setEvents(prev => [...prev, { day: di, start, dur, title: t.title, type: "task", task: true, color: t.color, done: false }]);
                    taskOps.remove(t.id);
                    endTaskDrag();
                    setTaskDrop(null);
                  }}
                >
                  <div className="absolute inset-0" data-grid-bg="1" />
                  {/* Subtle column separator (only between columns, very low-contrast) */}
                  {di > 0 && (
                    <div className="absolute top-0 bottom-0 left-0 w-px bg-[hsl(var(--border)/0.18)] pointer-events-none" />
                  )}

                  {/* P13 — No more gray veil. Hidden calendars are filtered
                     out of the event layout above; collapsed hours live in
                     the band overlays. The grid background stays clean. */}

                  {/* Events */}
                  {dayLayouts[di].map((e) => {
                    // When a range is active, shift origin to rStart so the
                    // first visible event sits at top:0. Without a range,
                    // origin is startHour (= 0). The band overlays handle
                    // any event outside [rStart, rEnd].
                    const top = ((e.start - (hasRange ? rStart : startHour)) * hourPx);
                    const height = Math.max(18, e.dur * hourPx - 2);
                    const base = typeStyle[e.type] || typeStyle.meeting;
                    const s = e.color ? { bg: `hsl(${e.color} / 0.18)`, border: `hsl(${e.color})`, text: `hsl(${e.color})` } : base;
                    const showTime = height >= 32;
                    const { col, totalCols } = e._layout;
                    const widthPct = 100 / totalCols;
                    const leftPct = col * widthPct;
                    const isTask = !!e.task;
                    const isDone = !!e.done;
                    const globalIdx = e._origIdx;
                    return (
                      <div key={`${di}-${e._idxInDay}`}
                        onPointerDown={(ev) => {
                          if (ev.button !== 0 || !gridRef.current) return;
                          const br = ev.currentTarget.getBoundingClientRect();
                          const resizeZone = Math.max(6, Math.min(12, height * 0.45));
                          const inResize = (br.bottom - ev.clientY) <= resizeZone;
                          try { ev.currentTarget.setPointerCapture(ev.pointerId); } catch (x) {}
                          const gridRect = gridRef.current.getBoundingClientRect();
                          const cursorHour = startHour + (ev.clientY - gridRect.top) / hourPx;
                          dragRef.current = { idx: globalIdx, mode: inResize ? "resize" : "move", moved: false, grabOffset: cursorHour - e.start, origDur: e.dur, gridRect, downX: ev.clientX, downY: ev.clientY, preview: null };
                        }}
                        onPointerMove={(ev) => {
                          const d = dragRef.current; if (!d || d.idx !== globalIdx) return;
                          if (!d.moved && Math.abs(ev.clientX - d.downX) < 5 && Math.abs(ev.clientY - d.downY) < 5) return;
                          d.moved = true;
                          const maxH = startHour + totalHours;
                          const cursorHour = startHour + (ev.clientY - d.gridRect.top) / hourPx;
                          const snap = (h) => Math.round(h * 4) / 4;
                          if (d.mode === "move") {
                            const ns = Math.max(startHour, Math.min(snap(cursorHour - d.grabOffset), maxH - d.origDur));
                            const colW = (d.gridRect.width - 56) / 7;
                            const col = Math.max(0, Math.min(6, Math.floor((ev.clientX - (d.gridRect.left + 56)) / colW)));
                            d.preview = { day: col, start: ns };
                            setDragPreview({ idx: d.idx, day: col, start: ns, dur: d.origDur, color: e.color, title: e.title, isTask: e.task, done: e.done });
                          } else {
                            const nd = Math.max(0.25, Math.min(snap(cursorHour) - e.start, maxH - e.start));
                            if (nd !== e.dur) updateEvent(globalIdx, { dur: nd });
                          }
                        }}
                        onPointerUp={(ev) => {
                          const d = dragRef.current; dragRef.current = null;
                          try { ev.currentTarget.releasePointerCapture(ev.pointerId); } catch (x) {}
                          if (d && d.moved) {
                            suppressClickRef.current = true; setTimeout(() => { suppressClickRef.current = false; }, 0);
                            if (d.mode === "move" && d.preview) updateEvent(d.idx, { start: d.preview.start, day: d.preview.day });
                          }
                          setDragPreview(null);
                        }}
                        onClick={(ev) => { ev.stopPropagation(); if (suppressClickRef.current) return; openDetail(e, globalIdx, ev); }}
                        onDoubleClick={(ev) => { ev.stopPropagation(); setEditingEventIdx(globalIdx); }}
                        title="Glisser pour déplacer · bord bas pour redimensionner · clic = détails"
                        className={cn(
                          "absolute rounded-[6px] overflow-hidden transition-shadow group/evt touch-none select-none cursor-grab active:cursor-grabbing",
                          "hover:brightness-110 hover:z-[15] hover:shadow-md focus-within:z-[15]"
                        )}
                        style={{
                          top,
                          height,
                          left: `calc(${leftPct}% + 2px)`,
                          width: `calc(${widthPct}% - 4px)`,
                          background: isDone ? "hsl(var(--muted) / 0.5)" : s.bg,
                          borderLeft: `2.5px solid ${isDone ? "hsl(var(--muted-foreground))" : s.border}`,
                          color: isDone ? "hsl(var(--muted-foreground))" : s.text,
                          opacity: (dragPreview && dragPreview.idx === globalIdx) ? 0.3 : (isDone ? 0.6 : 1),
                        }}>
                        {height >= 14 && (
                          <div className="absolute left-0 right-0 bottom-0 h-2.5 flex items-end justify-center pb-px cursor-ns-resize opacity-0 group-hover/evt:opacity-100 transition-opacity z-10" title="Drag to resize">
                            <div className="w-6 h-[3px] rounded-full bg-current opacity-60" />
                          </div>
                        )}
                        <div className="flex items-start gap-1.5 leading-tight px-1.5 py-1 h-full">
                          {isTask && (
                            <button
                              onPointerDown={(ev) => ev.stopPropagation()}
                              onClick={(ev) => { ev.stopPropagation(); toggleInlineTask(globalIdx); }}
                              aria-label={isDone ? "Mark not done" : "Mark done"}
                              className={cn(
                                "flex-shrink-0 w-3.5 h-3.5 rounded-full border-[1.5px] flex items-center justify-center mt-0.5 transition-all",
                                isDone
                                  ? "bg-[hsl(var(--primary))] border-[hsl(var(--primary))]"
                                  : "border-current opacity-70 hover:opacity-100 bg-transparent"
                              )}
                            >
                              {isDone && <Icons.Check size={8} stroke={3.5} className="text-white" />}
                            </button>
                          )}
                          <div className="flex-1 min-w-0 overflow-hidden">
                            <div className={cn(
                              "font-medium whitespace-nowrap overflow-hidden text-ellipsis",
                              isDone && "line-through"
                            )} style={{ fontSize: titleFont }} title={e.title}>
                              {e.title}
                            </div>
                            {showTime && (
                              <div className={cn(
                                "font-mono opacity-75 tabular-nums mt-0.5 whitespace-nowrap overflow-hidden text-ellipsis",
                                isDone && "line-through"
                              )} style={{ fontSize: timeFont }}>
                                {fmtHM(e.start)} – {fmtHM(e.start + e.dur)}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* P28 — live range ghost (preview of the draft being created) */}
                  {draft && !draft.allDay && draft.end > draft.start && (() => {
                    const gcols = spreadCols(draft);
                    if (!gcols.includes(di)) return null;
                    const origin = hasRange ? rStart : startHour;
                    const gTop = (draft.start - origin) * hourPx;
                    const gH = Math.max(18, (draft.end - draft.start) * hourPx - 2);
                    const primary = di === draft.dayIndex;
                    return (
                      <div className="absolute rounded-[6px] border-2 border-dashed pointer-events-none z-[16] overflow-hidden" style={{
                        top: gTop, height: gH, left: 2, right: 2,
                        borderColor: `hsl(${draft.color})`,
                        background: `hsl(${draft.color} / 0.16)`,
                        opacity: primary ? 1 : 0.5,
                      }}>
                        <div className="px-1.5 py-1 leading-tight">
                          <div className="font-semibold whitespace-nowrap overflow-hidden text-ellipsis" style={{ fontSize: titleFont, color: "hsl(var(--foreground))" }}>
                            {(draft.mode === "task" ? "✓ " : "") + (draft.title || (draft.mode === "task" ? "(Nouvelle tâche)" : "(Nouvel événement)"))}
                          </div>
                          <div className="font-mono tabular-nums mt-0.5" style={{ fontSize: timeFont, color: `hsl(${draft.color})` }}>
                            De {fmtHM(draft.start)} à {fmtHM(draft.end)}
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* P28 — drag-to-move preview (Google-style: solid block follows cursor, original stays faded) */}
                  {dragPreview && dragPreview.day === di && (() => {
                    const origin = hasRange ? rStart : startHour;
                    const gTop = (dragPreview.start - origin) * hourPx;
                    const gH = Math.max(18, dragPreview.dur * hourPx - 2);
                    const col = dragPreview.color || "263 70% 60%";
                    return (
                      <div className="absolute rounded-[6px] overflow-hidden pointer-events-none z-[19] shadow-xl" style={{
                        top: gTop, height: gH, left: 2, right: 2,
                        background: `hsl(${col} / 0.92)`, borderLeft: `3px solid hsl(${col})`, color: "#fff",
                      }}>
                        <div className="px-1.5 py-1 leading-tight">
                          <div className="font-semibold whitespace-nowrap overflow-hidden text-ellipsis" style={{ fontSize: titleFont }}>{(dragPreview.isTask ? "✓ " : "") + dragPreview.title}</div>
                          <div className="font-mono tabular-nums mt-0.5 opacity-80" style={{ fontSize: timeFont }}>{fmtHM(dragPreview.start)} – {fmtHM(dragPreview.start + dragPreview.dur)}</div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Drag-from-inbox preview — dashed ghost showing where the
                     unscheduled task will land if dropped here. */}
                  {taskDrop && taskDrop.day === di && window.__dpmDragTask && (() => {
                    const origin = hasRange ? rStart : startHour;
                    const gTop = (taskDrop.start - origin) * hourPx;
                    const gH = Math.max(18, taskDrop.dur * hourPx - 2);
                    const col = window.__dpmDragTask.color || "263 70% 60%";
                    return (
                      <div className="absolute rounded-[6px] overflow-hidden pointer-events-none z-[18] border-2 border-dashed" style={{
                        top: gTop, height: gH, left: 2, right: 2,
                        background: `hsl(${col} / 0.18)`, borderColor: `hsl(${col})`, color: `hsl(${col})`,
                      }}>
                        <div className="px-1.5 py-1 leading-tight">
                          <div className="font-semibold whitespace-nowrap overflow-hidden text-ellipsis" style={{ fontSize: titleFont }}>✓ {window.__dpmDragTask.title}</div>
                          <div className="font-mono tabular-nums mt-0.5 opacity-80" style={{ fontSize: timeFont }}>{fmtHM(taskDrop.start)} – {fmtHM(taskDrop.start + taskDrop.dur)}</div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Now indicator (today only) */}
                  {d.today && nowOffset != null && nowOffset > 0 && nowOffset < totalHeight && (
                    <div className="absolute left-0 right-0 z-20 pointer-events-none" style={{ top: nowOffset }}>
                      <div className="flex items-center">
                        <div className="w-2 h-2 -ml-1 rounded-full bg-[hsl(0_84%_60%)]" />
                        <div className="flex-1 h-px bg-[hsl(0_84%_60%)]" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {popover && (
            <CreatePopover
              popover={popover}
              hourPx={hourPx}
              onClose={() => { setPopover(null); setDraft(null); }}
              onDraftChange={setDraft}
              onSave={createItem}
            />
          )}
        </div>
        {/* After-range collapsed band (P13) — surfaces events compacted at the bottom */}
        {hasRange && rEnd < startHour + totalHours && (
          <CollapsedHourBand
            position="after"
            rangeStart={rEnd}            rangeEnd={startHour + totalHours}
            events={liveAfter}
            expanded={afterExpanded}
            onToggle={() => toggleBand("after")}
          />
        )}
      </div>

      {/* P28 — event/task details popover (portaled so it never clips) */}
      {detail && ReactDOM.createPortal(
        <EventDetailsCard
          detail={detail}
          onClose={() => setDetail(null)}
          onToggleDone={() => {
            toggleInlineTask(detail.idx);
            setDetail(d => d ? { ...d, e: { ...d.e, done: !d.e.done } } : d);
          }}
          onConvert={() => {
            const ev = events[detail.idx];
            if (!ev) return;
            const toTask = !ev.task;
            const patch = { task: toTask, type: toTask ? "task" : "meeting", done: toTask ? !!ev.done : false };
            updateEvent(detail.idx, patch);
            setDetail(d => d ? { ...d, e: { ...d.e, ...patch } } : d);
          }}
          onEdit={() => { setEditingEventIdx(detail.idx); setDetail(null); }}
          onDelete={() => { deleteEvent(detail.idx); setDetail(null); }}
        />,
        document.body
      )}

      {/* Edit-event modal — dblclick on any event opens this */}
      {editingEventIdx != null && (
        <EventModal
          open={true}
          onClose={() => setEditingEventIdx(null)}
          initial={(() => {
            const ev = events[editingEventIdx];
            if (!ev) return null;
            return {
              title: ev.title,
              start: fmtHM(ev.start),
              end: fmtHM(ev.start + ev.dur),
              date: new Date().toISOString().slice(0, 10),
              calendar: ev.calendar || "Work",
              color: ev.color || "263 70% 60%",
              desc: ev.desc || "",
            };
          })()}
          onSave={(payload) => {
            const ev = events[editingEventIdx];
            const toH = (hm) => { const [h, m] = (hm || "0:0").split(":").map(Number); return h + (m || 0) / 60; };
            if (payload.allDay) {
              // Move to the ALL DAY band on the event's day (à la Google)
              const di = ev ? ev.day : 0;
              setAllDay(prev => prev.map((day, i) => i === di
                ? [{ id: "u" + Date.now(), kind: (ev && ev.task) ? "task" : "habit", title: payload.title, color: payload.color || (ev && ev.color), done: ev ? !!ev.done : false }, ...day]
                : day));
              deleteEvent(editingEventIdx);
              return;
            }
            const start = toH(payload.start);
            const end = toH(payload.end);
            updateEvent(editingEventIdx, {
              title: payload.title,
              start,
              dur: Math.max(0.25, end - start),
              calendar: payload.calendar,
              color: payload.color,
              desc: payload.desc,
            });
          }}
        />
      )}
    </div>
  );
}

/* P13 — Collapsed hour band.
   When the user picks a hour range (e.g. 09:00–18:00), hours OUTSIDE the
   range collapse into thin bands at the top/bottom of the grid. The band
   shows a counter ("▼ 3 événements après 18h") and a click expands it
   inline so the events become accessible.
   Golden rule: events in the band are NEVER hidden — only compacted with
   a clear, accurate signal. */
function CollapsedHourBand({ position, rangeStart, rangeEnd, events, expanded, onToggle }) {
  const isBefore = position === "before";
  const count = events.length;
  const startHM = `${String(Math.floor(rangeStart)).padStart(2,"0")}:00`;
  const endHM   = `${String(Math.floor(rangeEnd)).padStart(2,"0")}:00`;
  const label = count === 0
    ? `${startHM}–${endHM} · no events`
    : `${count} event${count > 1 ? "s" : ""} ${isBefore ? "before " + endHM : "after " + startHM}`;
  return (
    <div
      className={cn(
        "border-y border-[hsl(var(--border))] bg-[hsl(var(--card)/0.5)]",
        isBefore ? "border-t-0" : ""
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        className={cn(
          "w-full px-3 py-1.5 flex items-center gap-2 text-[11px] font-medium text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent)/0.3)] transition-colors",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-inset",
          "min-h-[44px]"
        )}
      >
        {isBefore
          ? <Icons.ChevronUp size={11} className={cn("transition-transform", expanded && "rotate-180")} />
          : <Icons.ChevronDown size={11} className={cn("transition-transform", expanded && "rotate-180")} />
        }
        <span className="font-mono tabular-nums">{isBefore ? `${startHM}–${endHM}` : `${startHM}–${endHM}`}</span>
        {count > 0 && (
          <span className="px-1.5 py-0.5 rounded-full bg-[hsl(var(--primary)/0.18)] text-[hsl(263_70%_80%)] text-[10px] font-semibold tabular-nums">
            {count}
          </span>
        )}
        <span className="flex-1 text-left truncate">{label}</span>
        <span className="text-[10.5px] uppercase tracking-wider">
          {expanded ? "Collapse" : "Expand"}
        </span>
      </button>
      {expanded && count > 0 && (
        <div className="px-3 py-2 border-t border-[hsl(var(--border))] space-y-1 max-h-[180px] overflow-y-auto">
          {events.map((e, i) => {
            const typeColor = {
              meeting:  "217 91% 60%",
              task:     "263 70% 60%",
              focus:    "142 70% 50%",
              personal: "38 92% 55%",
            }[e.type] || "263 70% 60%";
            return (
              <div key={i} className="flex items-center gap-2 text-[11.5px] py-1">
                <span className="w-1 self-stretch rounded-full flex-shrink-0 min-h-[20px]" style={{ background: `hsl(${typeColor})` }} />
                <span className="font-mono tabular-nums text-[hsl(var(--muted-foreground))] w-24 flex-shrink-0">
                  {fmtHM(e.start)}–{fmtHM(e.start + e.dur)}
                </span>
                <span className={cn("flex-1 truncate", e.done && "line-through text-[hsl(var(--muted-foreground))]")}>
                  {e.title}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
                  {WEEK_DAYS[e.day]?.d}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* All-day chip — checkable when kind="task", static when kind="habit" */
function AllDayChip({ item, onToggle }) {
  const isTask = item.kind === "task";
  const isDone = !!item.done;
  const [h, s] = item.color.split(" ");
  const textColor = isDone ? "hsl(var(--muted-foreground))" : `hsl(${h} ${s} 80%)`;
  return (
    <div
      onClick={isTask ? onToggle : undefined}
      className={cn(
        "h-[18px] rounded-[4px] px-1.5 flex items-center gap-1 text-[10.5px] font-medium overflow-hidden",
        isTask ? "cursor-pointer hover:brightness-110" : "cursor-default"
      )}
      style={{
        background: isDone ? "hsl(var(--muted) / 0.5)" : `hsl(${item.color} / 0.22)`,
        color: textColor,
        borderLeft: `2px solid ${isDone ? "hsl(var(--muted-foreground))" : `hsl(${item.color})`}`,
      }}
    >
      {isTask ? (
        <span
          className={cn(
            "flex-shrink-0 w-2.5 h-2.5 rounded-full border flex items-center justify-center",
            isDone ? "bg-[hsl(var(--primary))] border-[hsl(var(--primary))]" : "border-current opacity-80"
          )}
        >
          {isDone && <Icons.Check size={6} stroke={4} className="text-white" />}
        </span>
      ) : (
        <Icons.Refresh size={8} className="flex-shrink-0 opacity-70" />
      )}
      <span className={cn("truncate", isDone && "line-through")}>{item.title}</span>
    </div>
  );
}

/* Create popover — opens at clicked slot. Event / Task tabs. */
const CREATE_CALS = [
  { name: "Travail",   color: "263 70% 60%" },
  { name: "Réunions",  color: "217 91% 60%" },
  { name: "Personnel", color: "38 92% 55%" },
  { name: "Bien-être", color: "142 70% 50%" },
];
const FR_DAY = { Mon: "Lundi", Tue: "Mardi", Wed: "Mercredi", Thu: "Jeudi", Fri: "Vendredi", Sat: "Samedi", Sun: "Dimanche" };

/* Which visible-week columns a draft/saved item occupies:
   - all-day single occurrence with an end date → the date span
   - recurrence "daily" → all 7, "weekdays" → Mon–Fri
   - otherwise → just its day. */
function spreadCols(p) {
  if (!p) return [];
  if (p.allDay && p.freq === "une" && p.endDayIndex != null && p.endDayIndex > p.dayIndex) {
    const out = []; for (let i = p.dayIndex; i <= p.endDayIndex; i++) out.push(i); return out;
  }
  if (p.freq === "daily") return [0, 1, 2, 3, 4, 5, 6];
  if (p.freq === "weekdays") return [0, 1, 2, 3, 4];
  return [p.dayIndex];
}

/* Détails d'un événement / tâche au clic (façon Google Agenda). */
function EventDetailsCard({ detail, onClose, onEdit, onDelete, onToggleDone, onConvert }) {
  const e = detail.e;
  const wd = WEEK_DAYS[e.day] || { d: "Lun", n: 18 };
  const f12 = (h) => (window.pkFmt12 ? window.pkFmt12(fmtHM(h)) : fmtHM(h));
  const color = e.color || (e.type === "meeting" ? "217 91% 60%" : e.type === "focus" ? "142 70% 50%" : e.type === "personal" ? "38 92% 55%" : "263 70% 60%");
  const cal = CREATE_CALS.find((c) => c.color === e.color);
  const dateLine = (FR_DAY[wd.d] || wd.d) + ", " + wd.n + " mai · " + (e.allDay ? "Toute la journée" : "De " + f12(e.start) + " à " + f12(e.start + e.dur));
  const IconBtn = ({ icon: I, label, onClick, danger }) => (
    <button onClick={onClick} title={label} aria-label={label}
      className={cn("w-8 h-8 rounded-full flex items-center justify-center transition-colors", danger ? "text-[hsl(var(--muted-foreground))] hover:text-[hsl(0_84%_65%)] hover:bg-[hsl(0_84%_60%/0.12)]" : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))]")}>
      <I size={16} />
    </button>
  );
  return (
    <div onMouseDown={(ev) => ev.stopPropagation()} style={{ position: "absolute", left: detail.left, top: detail.top, width: 340 }}
      className="z-[1900] rounded-[16px] border border-[hsl(var(--border))] bg-[hsl(var(--popover))] shadow-2xl anim-scale-in overflow-hidden">
      <div className="flex items-center justify-end gap-0.5 px-2 py-1.5">
        <IconBtn icon={Icons.Edit} label="Modifier" onClick={onEdit} />
        <IconBtn icon={Icons.Trash} label="Supprimer" onClick={onDelete} danger />
        <IconBtn icon={Icons.X} label="Fermer" onClick={onClose} />
      </div>
      <div className="px-5 pb-5 pt-1">
        <div className="flex items-start gap-3.5">
          <span className="w-3.5 h-3.5 rounded-[4px] mt-1.5 flex-shrink-0" style={{ background: `hsl(${color})` }} />
          <div className="min-w-0">
            <h3 className="text-[19px] font-semibold leading-snug tracking-tight flex items-center gap-2">
              {e.task && (
                <button
                  type="button"
                  onClick={(ev) => { ev.stopPropagation(); onToggleDone?.(); }}
                  aria-label={e.done ? "Mark not done" : "Mark done"}
                  title={e.done ? "Mark not done" : "Mark done"}
                  className={cn("w-5 h-5 rounded-full border-[1.5px] flex items-center justify-center flex-shrink-0 transition-colors hover:scale-110", e.done ? "bg-[hsl(var(--primary))] border-[hsl(var(--primary))]" : "border-[hsl(var(--muted-foreground))] hover:border-[hsl(var(--primary))]")}>
                  {e.done && <Icons.Check size={11} stroke={3} className="text-white" />}
                </button>
              )}
              <span className={cn(e.done && "line-through text-[hsl(var(--muted-foreground))]")}>{e.title}</span>
            </h3>
            <div className="text-[13px] text-[hsl(var(--muted-foreground))] mt-1">{dateLine}</div>
          </div>
        </div>
        <div className="mt-4 space-y-2.5 text-[13px]">
          <div className="flex items-center gap-3.5 text-[hsl(var(--muted-foreground))]">
            <Icons.Layout size={15} className="flex-shrink-0" />
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm" style={{ background: `hsl(${color})` }} />
              {cal ? cal.name : (e.task ? "Tâche" : "Événement")}
            </span>
          </div>
          <div className="flex items-center gap-3.5 text-[hsl(var(--muted-foreground))]">
            {e.task ? <Icons.CheckSquare size={15} className="flex-shrink-0" /> : <Icons.Calendar size={15} className="flex-shrink-0" />}
            <span>{e.task ? "Tâche" : "Événement"}{e.allDay ? " · toute la journée" : ""}</span>
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-[hsl(var(--border))] flex items-center gap-2">
          <Button size="sm" variant="outline" icon={Icons.Edit} onClick={onEdit}>Modifier</Button>
          <Button size="sm" variant="outline" icon={e.task ? Icons.Calendar : Icons.CheckSquare} onClick={onConvert}>
            {e.task ? "En événement" : "En tâche"}
          </Button>
          <button onClick={onClose} className="ml-auto text-[12px] font-medium text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] px-2 py-1 rounded-md hover:bg-[hsl(var(--accent))]">Fermer</button>
        </div>
      </div>
    </div>
  );
}

function CreatePopover({ popover, hourPx, onClose, onDraftChange, onSave }) {
  const [tab, setTab] = useState("event");
  const [title, setTitle] = useState("");
  const [dateISO, setDateISO] = useState(() => { const wd = WEEK_DAYS[popover.day]; return window.pkISO ? window.pkISO(wd.year ?? 2026, wd.month ?? 4, wd.n) : "2026-05-18"; });
  const [start, setStart] = useState(() => fmtHM(popover.hour));
  const [end, setEnd] = useState(() => fmtHM(popover.hour + 1));
  const [allDay, setAllDay] = useState(false);
  const [freq, setFreq] = useState("une");
  const [calIdx, setCalIdx] = useState(0);
  const [prio, setPrio] = useState("MEDIUM");
  const [endDateISO, setEndDateISO] = useState(() => { const wd = WEEK_DAYS[popover.day]; return window.pkISO ? window.pkISO(wd.year ?? 2026, wd.month ?? 4, wd.n) : "2026-05-18"; });
  const titleRef = useRef(null);
  const wrapperRef = useRef(null);

  // Map an ISO date to a column in the visible week (by weekday, Mon-first).
  const colForISO = (iso) => {
    const p = window.pkParseISO ? window.pkParseISO(iso) : { y: 2026, m: 4, d: 18 };
    return (new Date(p.y, p.m, p.d).getDay() + 6) % 7;
  };
  const payload = () => ({
    dayIndex: colForISO(dateISO), endDayIndex: colForISO(endDateISO),
    start: parseHM(start), end: parseHM(end),
    allDay, freq, color: CREATE_CALS[calIdx].color, mode: tab, title,
  });

  // Report the live draft to the grid so it can draw the range ghost.
  useEffect(() => {
    if (!onDraftChange) return;
    onDraftChange(payload());
  }, [dateISO, endDateISO, start, end, allDay, freq, calIdx, tab, title, onDraftChange]);

  const handleSave = () => {
    onSave && onSave({ ...payload(), title: title.trim() || "(Sans titre)" });
    onClose();
  };

  useEffect(() => {
    requestAnimationFrame(() => titleRef.current?.focus());
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    const onClick = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) onClose();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [onClose]);

  const dayLabel = WEEK_DAYS[popover.day].d + " " + WEEK_DAYS[popover.day].n;
  const defaultDur = tab === "event" ? 1 : 0.5;
  const startHM = fmtHM(popover.hour);
  const endHM = fmtHM(popover.hour + defaultDur);

  return (
    <div
      ref={wrapperRef}
      onClick={(e) => e.stopPropagation()}
      className="absolute z-30 w-[300px] rounded-[12px] border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-2xl anim-scale-in overflow-visible"
      style={{
        top: Math.min(popover.y, 24 * hourPx - 280),
        left: `min(${popover.x}px, calc(100% - 312px))`,
      }}
      role="dialog"
      aria-label="Create an item"
    >
      <div className="px-3 pt-3 pb-2 flex items-start justify-between gap-2">
        <div className="flex items-center gap-1 p-0.5 bg-[hsl(var(--muted)/0.5)] rounded-[8px]">
          {[
            { id: "event", label: "Événement", icon: Icons.Calendar },
            { id: "task",  label: "Tâche",     icon: Icons.CheckSquare },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "h-7 px-2.5 rounded-[6px] flex items-center gap-1.5 text-[11.5px] font-medium transition-all",
                tab === t.id
                  ? "bg-[hsl(var(--card))] shadow-sm text-[hsl(var(--foreground))]"
                  : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
              )}
            >
              <t.icon size={11} /> {t.label}
            </button>
          ))}
        </div>
        <button
          onClick={() => { window.__dpmQuickCreate?.({ type: tab, date: dateISO, start: startHM, end: endHM, title }); onClose(); }}
          title="More options"
          className="w-6 h-6 rounded hover:bg-[hsl(var(--accent))] flex items-center justify-center text-[hsl(var(--muted-foreground))] -mt-0.5"
        >
          <Icons.Maximize size={12} />
        </button>
        <button
          onClick={onClose}
          aria-label="Close"
          className="w-6 h-6 rounded hover:bg-[hsl(var(--accent))] flex items-center justify-center text-[hsl(var(--muted-foreground))] -mr-1 -mt-0.5"
        >
          <Icons.X size={13} />
        </button>
      </div>

      <div className="px-3 pb-3 space-y-2.5">
        <input
          ref={titleRef}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={tab === "event" ? "Ajouter un titre" : "Que veux-tu faire ?"}
          className="w-full h-9 px-2 text-[14px] font-medium bg-transparent border-b border-[hsl(var(--border))] focus:outline-none focus:border-[hsl(var(--primary))] placeholder:text-[hsl(var(--muted-foreground)/0.6)]"
        />

        <div className="flex items-center gap-1.5 flex-wrap">
          <Icons.Clock size={12} className="flex-shrink-0 text-[hsl(var(--muted-foreground))]" />
          {allDay ? (
            <React.Fragment>
              <DateField value={dateISO} onChange={(v) => { setDateISO(v); if (endDateISO < v) setEndDateISO(v); }} />
              <span className="text-[hsl(var(--muted-foreground))]">–</span>
              <DateField value={endDateISO} onChange={(v) => setEndDateISO(v < dateISO ? dateISO : v)} />
            </React.Fragment>
          ) : (
            <React.Fragment>
              <DateField value={dateISO} onChange={(v) => { setDateISO(v); setEndDateISO(v); }} />
              <TimeSelect value={start} onChange={(v) => { setStart(v); if (parseHM(end) <= parseHM(v)) setEnd(fmtHM(Math.min(parseHM(v) + 1, 23.75))); }} />
              <span className="text-[hsl(var(--muted-foreground))]">–</span>
              <TimeSelect value={end} onChange={(v) => { setEnd(parseHM(v) <= parseHM(start) ? fmtHM(Math.min(parseHM(start) + 0.25, 23.75)) : v); }} />
            </React.Fragment>
          )}
        </div>

        <div className="flex items-center gap-2 pl-[18px]">
          <label className="inline-flex items-center gap-1.5 text-[12px] cursor-pointer select-none">
            <Switch checked={allDay} onChange={setAllDay} size="sm" />
            Toute la journée
          </label>
        </div>

        <div className="flex items-center gap-1.5 pl-[18px]">
          <Icons.Refresh size={12} className="flex-shrink-0 text-[hsl(var(--muted-foreground))]" />
          <FreqSelect dateISO={dateISO} value={freq} onChange={setFreq} />
        </div>

        {tab === "event" ? (
          <div className="flex items-center gap-2 text-[12px] text-[hsl(var(--muted-foreground))]">
            <Icons.Activity size={12} className="flex-shrink-0" />
            <input
              type="text"
              placeholder="Ajouter un lieu ou un lien"
              className="flex-1 bg-transparent text-[12px] focus:outline-none placeholder:text-[hsl(var(--muted-foreground)/0.6)]"
            />
          </div>
        ) : (
          <div className="flex items-start gap-2 text-[12px] text-[hsl(var(--muted-foreground))] flex-wrap">
            <Icons.AlertTriangle size={12} className="flex-shrink-0 mt-1" />
            <div className="flex items-center gap-1 flex-wrap">
              {[
                { v: "URGENT", l: "Urgent",  c: "0 84% 60%"  },
                { v: "HIGH",   l: "Haute",   c: "20 90% 55%" },
                { v: "MEDIUM", l: "Moyenne", c: "50 90% 55%" },
                { v: "LOW",    l: "Basse",   c: "142 70% 50%"},
              ].map(p => (
                <button
                  key={p.v}
                  onClick={() => setPrio(p.v)}
                  className="h-6 px-1.5 rounded-[5px] flex items-center gap-1 text-[10.5px] font-medium border transition-colors"
                  style={prio === p.v ? { borderColor: `hsl(${p.c} / 0.6)`, background: `hsl(${p.c} / 0.14)`, color: `hsl(${p.c})` } : { borderColor: "hsl(var(--border))" }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: `hsl(${p.c})` }} />
                  {p.l}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 text-[12px] text-[hsl(var(--muted-foreground))]">
          <Icons.Layout size={12} className="flex-shrink-0" />
          <div className="flex items-center gap-1 flex-wrap">
            {CREATE_CALS.map((c, i) => (
              <button
                key={c.name}
                onClick={() => setCalIdx(i)}
                className="h-6 px-1.5 rounded-[5px] text-[11px] font-medium border transition-colors flex items-center gap-1.5"
                style={calIdx === i ? { borderColor: `hsl(${c.color} / 0.6)`, background: `hsl(${c.color} / 0.12)`, color: "hsl(var(--foreground))" } : { borderColor: "hsl(var(--border))" }}
              >
                <span className="w-2 h-2 rounded-sm" style={{ background: `hsl(${c.color})` }} />
                {c.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-3 py-2.5 border-t border-[hsl(var(--border))] bg-[hsl(var(--background)/0.4)] flex items-center justify-between">
        <button className="text-[11px] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] flex items-center gap-1">
          <Icons.Edit size={11} /> Options avancées
        </button>
        <Button size="sm" onClick={handleSave}>
          Enregistrer
        </Button>
      </div>
    </div>
  );
}

/* Format hour float (e.g. 14.5) → "14:30" */
function fmtHM(h) {
  const hh = Math.floor(h);
  const mm = Math.round((h - hh) * 60);
  return `${String(hh).padStart(2,"0")}:${String(mm).padStart(2,"0")}`;
}
/* "HH:MM" → float hours (e.g. "09:30" → 9.5) */
function parseHM(s) {
  if (!s) return 0;
  const [h, m] = s.split(":").map(Number);
  return h + (m || 0) / 60;
}
/* Set equality — used to detect whether the active state still matches a preset. */
function setEq(a, b) {
  if (a.size !== b.size) return false;
  for (const x of a) if (!b.has(x)) return false;
  return true;
}
/* Compare two hour-range objects (null = 24h). */
function sameHourRange(a, b) {
  if (!a && !b) return true;
  if (!a || !b) return false;
  return a.start === b.start && a.end === b.end;
}

function WeekHeader() {
  return (
    <div className="grid border-b border-[hsl(var(--border))] bg-[hsl(var(--card))]" style={{ gridTemplateColumns: "56px repeat(7, 1fr)" }}>
      <div />
      {WEEK_DAYS.map((d, i) => (
        <div key={i} className={cn(
          "px-2 py-2.5 text-center",
          d.today && "bg-[hsl(var(--primary)/0.05)]"
        )}>
          <div className="text-[10.5px] uppercase font-semibold text-[hsl(var(--muted-foreground))] tracking-wider">{d.d}</div>
          <div className={cn(
            "inline-flex items-center justify-center w-7 h-7 rounded-full text-[13px] font-semibold tabular-nums mt-0.5",
            d.today ? "bg-[hsl(var(--primary))] text-white" : ""
          )}>{d.n}</div>
        </div>
      ))}
    </div>
  );
}

const DAY_START = 7, DAY_END = 20;
const DAY_TYPE_COLOR = { focus: "142 70% 50%", personal: "38 92% 55%", task: "263 70% 60%", meeting: "217 91% 60%" };

function DayView({ zoomPx = CAL_ZOOM_DEFAULT }) {
  const hourPx = zoomPx;
  const titleFont = zoomFont(hourPx, 13, 13, 19);
  const timeFont = zoomFont(hourPx, 11, 11, 15);
  const [, taskOps] = useTasks();
  const taskDragging = useTaskDragging();
  const [evs, setEvs] = useState([
    { id: "d1", s: 10, d: 1.5, t: "Meditation + Reading", color: DAY_TYPE_COLOR.personal },
    { id: "d2", s: 14, d: 2,   t: "Free focus · writing", color: DAY_TYPE_COLOR.focus },
    { id: "d3", s: 17, d: 0.5, t: "Run",                  color: DAY_TYPE_COLOR.personal },
  ]);
  const [drop, setDrop] = useState(null); // { s, d } incoming-task preview
  const [dragId, setDragId] = useState(null);
  const gridRef = useRef(null);
  const dragRef = useRef(null);

  const hourAt = (clientY) => {
    const r = gridRef.current.getBoundingClientRect();
    return Math.round((DAY_START + (clientY - r.top) / hourPx) * 4) / 4;
  };
  const clampStart = (s, dur) => Math.max(DAY_START, Math.min(s, DAY_END - dur));

  return (
    <div className="flex-1 overflow-auto bg-[hsl(var(--background))]">
      <div className="max-w-2xl mx-auto p-6">
        <h2 className="text-[18px] font-bold mb-1">{window.DPMDate ? window.DPMDate.fmt(window.DPMDate.today(), { weekday: "long", month: "long", day: "numeric" }, window.__dpmLang === "fr" ? "fr" : "en") : "Saturday May 23"}</h2>
        <p className="text-[12px] text-[hsl(var(--muted-foreground))] mb-5 tabular-nums">{window.DPMDate ? window.DPMDate.time() : "14:32"} · {evs.length} events · drag to move · drop tasks to schedule</p>
        <div
          ref={gridRef}
          className={cn("relative rounded-[8px] transition-colors", drop && "ring-1 ring-[hsl(var(--primary)/0.5)]")}
          style={{ height: 13 * hourPx }}
          onDragOver={(e) => {
            if (!window.__dpmDragTask) return;
            e.preventDefault(); e.dataTransfer.dropEffect = "move";
            const dur = Math.max(0.25, window.__dpmDragTask.mins / 60);
            setDrop({ s: clampStart(hourAt(e.clientY), dur), d: dur });
          }}
          onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setDrop(null); }}
          onDrop={(e) => {
            const t = window.__dpmDragTask; if (!t) return;
            e.preventDefault();
            const dur = Math.max(0.25, t.mins / 60);
            const s = clampStart(hourAt(e.clientY), dur);
            setEvs(prev => [...prev, { id: "d" + Date.now(), s, d: dur, t: t.title, color: t.color, task: true }]);
            taskOps.remove(t.id); endTaskDrag(); setDrop(null);
          }}
        >
          {Array.from({ length: 14 }, (_, i) => (
            <div key={i} className="absolute left-0 right-0 border-t border-[hsl(var(--border)/0.5)]" style={{ top: i * hourPx }}>
              <span className="absolute -top-2 left-0 text-[10px] font-mono text-[hsl(var(--muted-foreground))] bg-[hsl(var(--background))] pr-2">
                {String(7+i).padStart(2,"0")}:00
              </span>
            </div>
          ))}
          {evs.map((e) => {
            const isDragging = dragId === e.id;
            return (
              <div key={e.id}
                onPointerDown={(ev) => {
                  if (ev.button !== 0 || !gridRef.current) return;
                  try { ev.currentTarget.setPointerCapture(ev.pointerId); } catch (x) {}
                  dragRef.current = { id: e.id, grabOffset: hourAt(ev.clientY) - e.s, dur: e.d, moved: false, downY: ev.clientY };
                }}
                onPointerMove={(ev) => {
                  const dctx = dragRef.current; if (!dctx || dctx.id !== e.id) return;
                  if (!dctx.moved && Math.abs(ev.clientY - dctx.downY) < 4) return;
                  dctx.moved = true; setDragId(e.id);
                  const ns = clampStart(hourAt(ev.clientY) - dctx.grabOffset, dctx.dur);
                  setEvs(prev => prev.map(x => x.id === e.id ? { ...x, s: ns } : x));
                }}
                onPointerUp={(ev) => { try { ev.currentTarget.releasePointerCapture(ev.pointerId); } catch (x) {} dragRef.current = null; setDragId(null); }}
                title="Drag to move"
                className={cn(
                  "absolute left-16 right-0 rounded-[8px] p-3 cursor-grab active:cursor-grabbing touch-none select-none transition-shadow",
                  isDragging ? "shadow-xl z-20 brightness-110" : "hover:brightness-105"
                )}
                style={{ top: (e.s - 7) * hourPx, height: e.d * hourPx - 4, background: `hsl(${e.color} / 0.16)`, borderLeft: `3px solid hsl(${e.color})` }}>
                <div className="font-semibold flex items-center gap-1.5" style={{ fontSize: titleFont }}>
                  {e.task && <span className="w-3.5 h-3.5 rounded-full border-[1.5px] border-current opacity-70 flex-shrink-0" />}
                  {e.t}
                </div>
                <div className="font-mono opacity-70 mt-0.5 tabular-nums" style={{ fontSize: timeFont }}>
                  {fmtHM(e.s)} → {fmtHM(e.s + e.d)}
                </div>
              </div>
            );
          })}
          {/* Incoming-task drop preview */}
          {drop && window.__dpmDragTask && (
            <div className="absolute left-16 right-0 rounded-[8px] p-3 pointer-events-none z-10 border-2 border-dashed"
              style={{ top: (drop.s - 7) * hourPx, height: drop.d * hourPx - 4, background: `hsl(${window.__dpmDragTask.color} / 0.18)`, borderColor: `hsl(${window.__dpmDragTask.color})`, color: `hsl(${window.__dpmDragTask.color})` }}>
              <div className="font-semibold" style={{ fontSize: titleFont }}>✓ {window.__dpmDragTask.title}</div>
              <div className="font-mono opacity-80 mt-0.5 tabular-nums" style={{ fontSize: timeFont }}>{fmtHM(drop.s)} → {fmtHM(drop.s + drop.d)}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MonthView() {
  const days = ["MON","TUE","WED","THU","FRI","SAT","SUN"];
  const startDay = 4;
  const cells = [];
  for (let i = 0; i < startDay; i++) cells.push({ prev: true, n: 27 + i });
  for (let i = 1; i <= 31; i++) cells.push({ n: i, today: i === 24 });
  let nextN = 1;
  while (cells.length % 7) cells.push({ next: true, n: nextN++ });

  const [, taskOps] = useTasks();
  const taskDragging = useTaskDragging();
  const [events, setEvents] = useState({
    18: [{ id: "m18a", t: "Stand-up", c: "info" }, { id: "m18b", t: "Focus 2h", c: "primary" }],
    19: [{ id: "m19a", t: "1:1 Sarah", c: "info" }, { id: "m19b", t: "Desjardins 2h", c: "primary" }],
    20: [{ id: "m20a", t: "Workshop", c: "info" }],
    21: [{ id: "m21a", t: "Lunch with Marc", c: "warning" }, { id: "m21b", t: "Presentation", c: "primary" }],
    22: [{ id: "m22a", t: "Board Q2", c: "info" }, { id: "m22b", t: "Revue sprint", c: "info" }],
    23: [{ id: "m23a", t: "Lecture", c: "warning" }],
    24: [{ id: "m24a", t: "Sprint planning", c: "primary" }],
    28: [{ id: "m28a", t: "Vacances", c: "success" }],
    29: [{ id: "m29a", t: "Vacances", c: "success" }],
    30: [{ id: "m30a", t: "Vacances", c: "success" }],
  });
  const [dropDay, setDropDay] = useState(null);
  const cmap = {
    info:    "bg-[hsl(217_91%_60%/0.18)] text-[hsl(217_91%_75%)] border-l-2 border-[hsl(217_91%_60%)]",
    primary: "bg-[hsl(263_70%_60%/0.18)] text-[hsl(263_70%_75%)] border-l-2 border-[hsl(263_70%_60%)]",
    warning: "bg-[hsl(38_92%_55%/0.18)] text-[hsl(38_92%_70%)] border-l-2 border-[hsl(38_92%_55%)]",
    success: "bg-[hsl(142_70%_50%/0.18)] text-[hsl(142_70%_70%)] border-l-2 border-[hsl(142_70%_50%)]",
  };

  const handleDrop = (dayN) => {
    const task = window.__dpmDragTask;
    const chip = window.__dpmDragChip;
    if (task) {
      setEvents(prev => ({ ...prev, [dayN]: [...(prev[dayN] || []), { id: "m" + Date.now(), t: task.title, color: task.color }] }));
      taskOps.remove(task.id); endTaskDrag();
    } else if (chip) {
      setEvents(prev => {
        const from = (prev[chip.fromDay] || []).filter(x => x.id !== chip.item.id);
        const to = [...(prev[dayN] || []), chip.item];
        return { ...prev, [chip.fromDay]: from, [dayN]: to };
      });
      window.__dpmDragChip = null;
    }
    setDropDay(null);
  };

  return (
    <div className="flex-1 flex flex-col bg-[hsl(var(--background))] overflow-hidden">
      <div className="grid grid-cols-7 border-b border-[hsl(var(--border))]">
        {days.map(d => (
          <div key={d} className="text-[10.5px] uppercase font-semibold text-[hsl(var(--muted-foreground))] tracking-wider px-3 py-2 border-r border-[hsl(var(--border))] last:border-0">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 grid-rows-6 flex-1">
        {cells.map((c, i) => {
          const evs = events[c.n] || [];
          const droppable = !c.prev && !c.next;
          return (
            <div key={i} className={cn(
              "border-r border-b border-[hsl(var(--border))] p-1.5 overflow-hidden transition-colors",
              (c.prev || c.next) && "bg-[hsl(var(--muted)/0.2)] opacity-50",
              c.today && "bg-[hsl(var(--primary)/0.05)]",
              dropDay === c.n && droppable && "bg-[hsl(var(--primary)/0.1)] ring-1 ring-inset ring-[hsl(var(--primary)/0.6)]"
            )}
              onDragOver={(e) => {
                if (!droppable || (!window.__dpmDragTask && !window.__dpmDragChip)) return;
                e.preventDefault(); e.dataTransfer.dropEffect = "move"; setDropDay(c.n);
              }}
              onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setDropDay(prev => prev === c.n ? null : prev); }}
              onDrop={(e) => { if (!droppable) return; e.preventDefault(); handleDrop(c.n); }}
            >
              <div className={cn(
                "text-[11.5px] font-semibold tabular-nums",
                c.today ? "inline-flex items-center justify-center w-6 h-6 rounded-full bg-[hsl(var(--primary))] text-white" : "px-1"
              )}>{c.n}</div>
              <div className="space-y-0.5 mt-0.5">
                {evs.slice(0,3).map((e) => (
                  <div
                    key={e.id}
                    title={e.t}
                    draggable={droppable}
                    onDragStart={(ev) => { window.__dpmDragChip = { fromDay: c.n, item: e }; ev.dataTransfer.effectAllowed = "move"; try { ev.dataTransfer.setData("text/plain", e.t); } catch (x) {} }}
                    onDragEnd={() => { window.__dpmDragChip = null; setDropDay(null); }}
                    className={cn("text-[10px] px-1.5 py-0.5 rounded-r truncate font-medium cursor-grab active:cursor-grabbing", !e.color && cmap[e.c])}
                    style={e.color ? { background: `hsl(${e.color} / 0.18)`, color: `hsl(${e.color})`, borderLeft: `2px solid hsl(${e.color})` } : undefined}
                  >{e.t}</div>
                ))}
                {evs.length > 3 && <div className="text-[9.5px] text-[hsl(var(--muted-foreground))] px-1">+{evs.length-3}</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AgendaView() {
  const [, taskOps] = useTasks();
  const taskDragging = useTaskDragging();
  const [groups, setGroups] = useState([
    { id: "ga", day: "Today · Sat 24", items: [
      { id: "a1", h: "10:00–11:30", t: "Meditation + Reading", type: "personal" },
      { id: "a2", h: "14:00–16:00", t: "Free focus · writing", type: "focus" },
    ]},
    { id: "gb", day: "Tomorrow · Sun 25", items: [
      { id: "a3", h: "10:00–11:00", t: "Sprint planning", type: "task" },
    ]},
    { id: "gc", day: "Lundi 26", items: [
      { id: "a4", h: "09:00–09:15", t: "Team stand-up", type: "meeting" },
      { id: "a5", h: "10:00–12:00", t: "Focus deep work", type: "focus" },
      { id: "a6", h: "14:00–15:00", t: "1:1 Léa", type: "meeting" },
    ]},
    { id: "gd", day: "Tue 27", items: [
      { id: "a7", h: "09:00–09:15", t: "Team stand-up", type: "meeting" },
      { id: "a8", h: "10:00–10:30", t: "1:1 Sarah (design)", type: "meeting" },
      { id: "a9", h: "14:00–16:00", t: "Proposition Desjardins", type: "task" },
    ]},
  ]);
  const [dropGroup, setDropGroup] = useState(null);
  const dot = { meeting: "bg-[hsl(217_91%_60%)]", task: "bg-[hsl(263_70%_60%)]", focus: "bg-[hsl(142_70%_50%)]", personal: "bg-[hsl(38_92%_55%)]" };

  const handleDrop = (gid) => {
    const task = window.__dpmDragTask;
    const chip = window.__dpmDragChip;
    if (task) {
      const item = { id: "a" + Date.now(), h: DUR_LABEL(task.mins), t: task.title, color: task.color };
      setGroups(prev => prev.map(g => g.id === gid ? { ...g, items: [...g.items, item] } : g));
      taskOps.remove(task.id); endTaskDrag();
    } else if (chip) {
      setGroups(prev => prev.map(g => {
        if (g.id === chip.fromGroup) return { ...g, items: g.items.filter(x => x.id !== chip.item.id) };
        return g;
      }).map(g => g.id === gid ? { ...g, items: [...g.items, chip.item] } : g));
      window.__dpmDragChip = null;
    }
    setDropGroup(null);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[hsl(var(--background))]">
      <div className="max-w-2xl mx-auto p-6 space-y-5">
        {groups.map(g => (
          <div
            key={g.id}
            className={cn("rounded-[10px] -mx-2 px-2 py-1 transition-colors", dropGroup === g.id && "bg-[hsl(var(--primary)/0.07)] ring-1 ring-inset ring-[hsl(var(--primary)/0.5)]")}
            onDragOver={(e) => { if (!window.__dpmDragTask && !window.__dpmDragChip) return; e.preventDefault(); e.dataTransfer.dropEffect = "move"; setDropGroup(g.id); }}
            onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setDropGroup(prev => prev === g.id ? null : prev); }}
            onDrop={(e) => { e.preventDefault(); handleDrop(g.id); }}
          >
            <div className="text-[10.5px] uppercase tracking-[0.08em] font-semibold text-[hsl(var(--muted-foreground))] mb-2">{g.day}</div>
            <div className="space-y-1 min-h-[8px]">
              {g.items.map((it) => (
                <div
                  key={it.id}
                  draggable
                  onDragStart={(ev) => { window.__dpmDragChip = { fromGroup: g.id, item: it }; ev.dataTransfer.effectAllowed = "move"; try { ev.dataTransfer.setData("text/plain", it.t); } catch (x) {} }}
                  onDragEnd={() => { window.__dpmDragChip = null; setDropGroup(null); }}
                  className="flex items-center gap-3 p-3 rounded-[8px] hover:bg-[hsl(var(--accent)/0.3)] transition-colors cursor-grab active:cursor-grabbing"
                >
                  <div className="text-[11px] font-mono text-[hsl(var(--muted-foreground))] tabular-nums w-24">{it.h}</div>
                  <div className={cn("w-1.5 h-1.5 rounded-full", !it.color && dot[it.type])} style={it.color ? { background: `hsl(${it.color})` } : undefined} />
                  <div className="text-[13.5px] font-medium flex-1">{it.t}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TimelineView() {
  const D = window.DPMDate;
  const L = (typeof window !== "undefined" && window.__dpmLang === "fr") ? "fr" : "en";
  const days = 14;
  const start = D ? D.weekStart(D.now()) : new Date(2026, 4, 18); // Monday of this week
  const monthLabel = D ? D.monthYear(start, L) : "May 2026";
  const wkA = D ? D.isoWeek(start) : 21;
  const wkB = D ? D.isoWeek(D.addDays(start, 7)) : 22;
  const rangeLabel = `${monthLabel} · ${L === "fr" ? "S" : "W"}${wkA} – ${L === "fr" ? "S" : "W"}${wkB}`;
  const projects = [
    { name: "Proposition Desjardins", color: "263 70% 60%", bars: [{ s: 1, w: 3 }, { s: 6, w: 2 }] },
    { name: "Q2 presentation",        color: "38 92% 55%",  bars: [{ s: 2, w: 5 }] },
    { name: "Refactor auth",          color: "217 91% 60%", bars: [{ s: 0, w: 8 }] },
    { name: "Doc API",                color: "142 70% 50%", bars: [{ s: 7, w: 4 }] },
    { name: "Sprint planning",        color: "0 84% 60%",   bars: [{ s: 7, w: 1 }] },
  ];
  const dayLabels = Array.from({ length: days }, (_, i) =>
    (D ? D.addDays(start, i) : new Date(2026, 4, 18 + i)).getDate());
  const dayCol = `repeat(${days}, minmax(0, 1fr))`;
  const todayIndex = D ? Math.round((D.today() - start) / 86400000) : 5;

  return (
    <div className="flex-1 overflow-auto bg-[hsl(var(--background))]">
      <div className="min-w-[820px] p-5">
        {/* Header: month label spans the 14 days */}
        <div className="grid gap-2" style={{ gridTemplateColumns: `200px 1fr` }}>
          <div />
          <div className="text-[10.5px] uppercase tracking-[0.08em] font-semibold text-[hsl(var(--muted-foreground))] pb-1">
            {rangeLabel}
          </div>
        </div>

        {/* Day numbers */}
        <div className="grid gap-2 pb-2 border-b border-[hsl(var(--border))]" style={{ gridTemplateColumns: `200px 1fr` }}>
          <div />
          <div className="grid gap-px text-center text-[10.5px] font-mono tabular-nums" style={{ gridTemplateColumns: dayCol }}>
            {dayLabels.map((n, i) => {
              const isWeekend = (i % 7) >= 5;
              const isToday = i === todayIndex;
              return (
                <div key={i} className={cn(
                  "py-1.5",
                  isToday ? "bg-[hsl(var(--primary))] text-white font-bold rounded-t-md" :
                  isWeekend ? "text-[hsl(var(--muted-foreground)/0.5)]" :
                  "text-[hsl(var(--muted-foreground))]"
                )}>{n}</div>
              );
            })}
          </div>
        </div>

        {/* Rows */}
        <div className="space-y-1.5 pt-2">
          {projects.map((p, i) => (
            <div key={i} className="grid gap-2 items-center" style={{ gridTemplateColumns: `200px 1fr` }}>
              <div className="text-[12.5px] font-medium truncate flex items-center gap-2 pr-2">
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: `hsl(${p.color})` }} />
                {p.name}
              </div>
              <div className="relative h-9">
                {/* Day grid background */}
                <div className="absolute inset-0 grid gap-px" style={{ gridTemplateColumns: dayCol }}>
                  {Array.from({ length: days }, (_, j) => {
                    const isWeekend = (j % 7) >= 5;
                    const isToday = j === todayIndex;
                    return (
                      <div key={j} className={cn(
                        "h-full rounded-sm",
                        isToday ? "bg-[hsl(var(--primary)/0.08)] border-l border-[hsl(var(--primary)/0.4)]" :
                        isWeekend ? "bg-[hsl(var(--muted)/0.4)]" :
                        "bg-[hsl(var(--muted)/0.18)]"
                      )} />
                    );
                  })}
                </div>
                {/* Bars positioned by day index */}
                {p.bars.map((b, bi) => (
                  <div key={bi}
                    className="absolute top-1.5 h-6 rounded-[5px] text-[10.5px] text-white font-medium flex items-center px-2 shadow-sm"
                    style={{
                      left: `calc(${(b.s / days) * 100}% + 1px)`,
                      width: `calc(${(b.w / days) * 100}% - 2px)`,
                      background: `hsl(${p.color})`,
                    }}>
                    <span className="truncate">{p.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-6 text-[11px] text-[hsl(var(--muted-foreground))]">
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[hsl(263_70%_60%)]"/>Client</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[hsl(38_92%_55%)]"/>Internal</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[hsl(217_91%_60%)]"/>Code</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[hsl(142_70%_50%)]"/>Doc</span>
          <span className="flex items-center gap-1.5 ml-auto"><span className="w-3 h-3 rounded-sm bg-[hsl(var(--muted))]"/>Weekend</span>
        </div>
      </div>
    </div>
  );
}

function LoadView() {
  const days = [
    { d: "Lun 18", v: 6.5, max: 8 },
    { d: "Mar 19", v: 7.8, max: 8 },
    { d: "Mer 20", v: 8.5, max: 8 },
    { d: "Jeu 21", v: 5.2, max: 8 },
    { d: "Ven 22", v: 4.0, max: 8 },
    { d: "Sam 23", v: 1.5, max: 8 },
    { d: "Dim 24", v: 0.75, max: 8 },
  ];
  return (
    <div className="flex-1 overflow-auto bg-[hsl(var(--background))] p-6">
      <div className="max-w-2xl mx-auto">
        <h3 className="text-[14px] font-semibold mb-1">Week workload</h3>
        <p className="text-[12px] text-[hsl(var(--muted-foreground))] mb-5">Heatmap of planned hours per day</p>
        <div className="space-y-2.5">
          {days.map(d => {
            const pct = (d.v / d.max) * 100;
            const over = pct > 100;
            const cell = pct > 100 ? "hsl(0 84% 60%)" : pct > 80 ? "hsl(38 92% 55%)" : pct > 40 ? "hsl(263 70% 60%)" : "hsl(142 70% 50%)";
            return (
              <div key={d.d} className="flex items-center gap-3">
                <div className="w-20 text-[12px] font-medium">{d.d}</div>
                <div className="flex-1 h-7 rounded-[6px] bg-[hsl(var(--muted))] relative overflow-hidden">
                  <div className="absolute inset-y-0 left-0 rounded-[6px] flex items-center px-2 text-[11px] font-mono text-white tabular-nums" style={{ width: `${Math.min(100, pct)}%`, background: cell }}>
                    {d.v}h
                  </div>
                  {over && <div className="absolute inset-y-0 right-0 px-2 text-[10px] font-mono text-[hsl(0_84%_70%)] flex items-center">+{(d.v - d.max).toFixed(1)}h</div>}
                </div>
                <div className="w-16 text-right text-[11px] text-[hsl(var(--muted-foreground))] tabular-nums">{Math.round(pct)}%</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   PAGE 6 — TASKS (/tasks)
============================================================ */
/* Priority options shared by the list + board filters. */
const TASK_PRIORITIES = [
  { v: "all",    key: "common.all",            c: null },
  { v: "URGENT", key: "tasks.priority.urgent", c: "0 84% 60%" },
  { v: "HIGH",   key: "tasks.priority.high",   c: "20 90% 55%" },
  { v: "MEDIUM", key: "tasks.priority.medium", c: "50 90% 55%" },
  { v: "LOW",    key: "tasks.priority.low",    c: "142 70% 50%" },
];
const priorityMeta = (v) => TASK_PRIORITIES.find(p => p.v === v) || TASK_PRIORITIES[0];

/* Default filter shape used by both List and Boards (kept per-view). */
const EMPTY_TASK_FILTER = { prio: "all", status: "all", tags: [], due: "all" };

const TASK_STATUS_OPTS = [
  { v: "all",       key: "common.all" },
  { v: "active",    key: "tasks.status.active" },
  { v: "completed", key: "tasks.status.completed" },
];
const TASK_DUE_OPTS = [
  { v: "all",      key: "common.all" },
  { v: "today",    key: "common.today" },
  { v: "tomorrow", key: "common.tomorrow" },
  { v: "week",     key: "tasks.filters.thisWeek" },
  { v: "later",    key: "tasks.filters.later" },
];

/* Best-effort bucketing of the mock's free-form, bilingual due-date labels. */
function taskDueBucket(dateStr) {
  const s = (dateStr || "").toLowerCase();
  if (/aujourd|today/.test(s)) return "today";
  if (/demain|tomorrow/.test(s)) return "tomorrow";
  if (/lun|mar|mer|jeu|ven|sam|dim|mon|tue|wed|thu|fri|sat|sun|this wk|this week|cette semaine|weekend|vendredi|samedi|dimanche|lundi|mardi|mercredi|jeudi/.test(s)) return "week";
  return "later";
}

/* Unique tag pool for the active view's data set. */
function taskTagPool(view) {
  const src = view === "kanban"
    ? (typeof BOARD_TASKS !== "undefined" ? BOARD_TASKS : [])
    : [...(TASK_DATA.doing || []), ...(TASK_DATA.todo || [])];
  const set = new Set();
  src.forEach(tk => (tk.tags || []).forEach(t => set.add(t)));
  return [...set];
}

/* Shared matcher for priority + tags + due (status handled per-view since only
   the List tracks a done state). */
function matchTaskFilter(task, f) {
  if (!f) return true;
  if (f.prio && f.prio !== "all" && task.p !== f.prio) return false;
  if (f.tags && f.tags.length && !(task.tags || []).some(tg => f.tags.includes(tg))) return false;
  if (f.due && f.due !== "all" && taskDueBucket(task.date) !== f.due) return false;
  return true;
}

/* Toolbar toggle. Lights up (primary tint + dot) when the panel is OPEN or a
   filter is ACTIVE — so the user always sees that filtering is in play. */
function FilterToggle({ open, active, onClick, label }) {
  const lit = open || active;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={open}
      className={cn(
        "inline-flex items-center gap-2 h-8 px-3 rounded-[8px] text-[13px] font-medium transition-colors border whitespace-nowrap",
        lit
          ? "border-[hsl(var(--primary)/0.55)] bg-[hsl(var(--primary)/0.12)] text-[hsl(var(--foreground))]"
          : "border-[hsl(var(--border))] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))]"
      )}
    >
      <Icons.Filter size={14} className={cn(lit && "text-[hsl(var(--primary))]")} />
      {label}
      {active && <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--primary))]" />}
      <Icons.ChevronDown size={13} className={cn("transition-transform duration-200 text-[hsl(var(--muted-foreground))]", open && "rotate-180")} />
    </button>
  );
}

/* INLINE filter panel (P22 fix). Rendered in the page flow BETWEEN the toolbar
   and the content, so opening it pushes the content down (reflow) and NEVER
   overlaps what it filters. All dimensions are functional; available controls
   adapt to the active view (Statut only applies to the List's done-state). */
function TaskFilterPanel({ view, f, onChange, availableTags, hasActive, onClearAll, onClose }) {
  const t = useT();
  const supportsFilter = view === "list" || view === "kanban";
  const viewName = ({
    list: t("tasks.view.list"), kanban: t("tasks.view.kanban"),
    gantt: t("tasks.view.gantt"), calendar: t("tasks.view.calendar"), stats: t("tasks.view.stats"),
  })[view] || view;

  const pill = (active, onClick, content, key, dot) => (
    <button
      key={key}
      onClick={onClick}
      className={cn(
        "h-8 px-3 rounded-md text-[12px] font-medium transition-colors flex items-center gap-1.5",
        active ? "bg-[hsl(var(--primary))] text-white" : "border border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))]"
      )}
    >
      {dot && <span className="w-1.5 h-1.5 rounded-full" style={{ background: active ? "rgba(255,255,255,0.9)" : `hsl(${dot})` }} />}
      {content}
    </button>
  );

  const Section = ({ label, children }) => (
    <div>
      <div className="text-[11px] font-medium text-[hsl(var(--muted-foreground))] mb-1.5">{label}</div>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );

  return (
    <div className="rounded-[12px] border border-[hsl(var(--primary)/0.25)] bg-[hsl(var(--card))] overflow-hidden anim-fade-in">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[hsl(var(--border))] bg-[hsl(var(--primary)/0.06)]">
        <div className="flex items-center gap-2">
          <Icons.Filter size={13} className="text-[hsl(var(--primary))]" />
          <span className="text-[10.5px] uppercase tracking-[0.14em] font-semibold text-[hsl(var(--muted-foreground))]">
            {t("common.filters")} · {viewName}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          {hasActive && (
            <button onClick={onClearAll} className="h-7 px-2 rounded-md text-[11px] font-medium text-[hsl(263_70%_80%)] hover:bg-[hsl(var(--accent))] hover:text-[hsl(263_70%_90%)] transition-colors">
              {t("common.clearAll")}
            </button>
          )}
          <button onClick={onClose} aria-label={t("common.close")} className="w-7 h-7 rounded-md flex items-center justify-center text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--foreground))] transition-colors">
            <Icons.X size={14} />
          </button>
        </div>
      </div>
      {supportsFilter ? (
        <div className="p-4 flex flex-wrap items-start gap-x-10 gap-y-4">
          <Section label={t("common.priority")}>
            {TASK_PRIORITIES.map(p => pill(f.prio === p.v, () => onChange({ prio: p.v }), t(p.key), p.v, p.c))}
          </Section>

          {view === "list" && (
            <Section label={t("common.status")}>
              {TASK_STATUS_OPTS.map(s => pill(f.status === s.v, () => onChange({ status: s.v }), t(s.key), s.v))}
            </Section>
          )}

          <Section label={t("tasks.filters.due")}>
            {TASK_DUE_OPTS.map(d => pill(f.due === d.v, () => onChange({ due: d.v }), t(d.key), d.v))}
          </Section>

          {availableTags.length > 0 && (
            <Section label={t("common.tags")}>
              {availableTags.map(tag => {
                const active = f.tags.includes(tag);
                return pill(
                  active,
                  () => onChange({ tags: active ? f.tags.filter(x => x !== tag) : [...f.tags, tag] }),
                  <span className="flex items-center gap-1">{!active && <span className="text-[hsl(var(--muted-foreground))]">#</span>}{tag}</span>,
                  tag
                );
              })}
            </Section>
          )}
        </div>
      ) : (
        <div className="p-4 text-[12.5px] text-[hsl(var(--muted-foreground))]">{t("tasks.filters.none")}</div>
      )}
    </div>
  );
}

/* Persistent active-filter chips. Stay visible when the panel is CLOSED so the
   user always sees the current filtering and can remove any of it in one click.
   Each chip carries an explicit field label + value; wraps gracefully. */
function ActiveFilterChips({ chips, onClearAll }) {
  const t = useT();
  if (!chips.length) return null;
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-[10px] uppercase tracking-[0.14em] font-semibold text-[hsl(var(--muted-foreground))]">{t("tasks.filters.active")}</span>
      {chips.map(c => (
        <button
          key={c.id}
          onClick={c.onRemove}
          className="group inline-flex items-center gap-1.5 h-7 pl-2.5 pr-1.5 rounded-full border border-[hsl(var(--primary)/0.35)] bg-[hsl(var(--primary)/0.10)] text-[11.5px] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--primary)/0.18)] transition-colors max-w-[240px]"
          title={`${c.label} : ${c.value} — ${t("common.close")}`}
        >
          {c.dot && <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: `hsl(${c.dot})` }} />}
          <span className="text-[hsl(var(--muted-foreground))] flex-shrink-0">{c.label} :</span>
          <span className="font-medium truncate">{c.value}</span>
          <span className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 text-[hsl(var(--muted-foreground))] group-hover:bg-[hsl(var(--primary)/0.25)] group-hover:text-[hsl(var(--foreground))]">
            <Icons.X size={10} stroke={2.5} />
          </span>
        </button>
      ))}
      <button onClick={onClearAll} className="text-[11px] text-[hsl(263_70%_80%)] hover:text-[hsl(263_70%_90%)] ml-0.5">{t("common.clearAll")}</button>
    </div>
  );
}

function TasksPage({ emptyState, onOpenTask }) {
  const t = useT();
  const [view, setView] = useState("kanban");
  const [search, setSearch] = useState("");
  // All filter dimensions kept per-view so List and Boards stay independent.
  const [filtersByView, setFiltersByView] = useState({ list: { ...EMPTY_TASK_FILTER }, kanban: { ...EMPTY_TASK_FILTER } });
  const f = filtersByView[view] || EMPTY_TASK_FILTER;
  const setF = (patch) => setFiltersByView(m => ({ ...m, [view]: { ...(m[view] || EMPTY_TASK_FILTER), ...patch } }));
  // Lets the single top "+ Task" button open the List's own create modal
  // when the List view is active (otherwise it opens the global task modal).
  const [listCreateSignal, setListCreateSignal] = useState(0);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const showSearch = view === "list" || view === "kanban";
  const supportsFilter = view === "list" || view === "kanban";
  const availableTags = useMemo(() => taskTagPool(view), [view]);

  // Derive the persistent active-filter chips from search + every dimension.
  const filtersActive = (showSearch && !!search.trim()) || (supportsFilter && (
    f.prio !== "all" || f.status !== "all" || f.tags.length > 0 || f.due !== "all"
  ));
  const chips = [];
  if (showSearch && search.trim()) {
    chips.push({ id: "search", label: t("common.search").replace("…", ""), value: `"${search.trim()}"`, onRemove: () => setSearch("") });
  }
  if (supportsFilter) {
    if (f.prio !== "all") {
      const m = priorityMeta(f.prio);
      chips.push({ id: "prio", label: t("common.priority"), value: t(m.key), dot: m.c, onRemove: () => setF({ prio: "all" }) });
    }
    if (view === "list" && f.status !== "all") {
      const s = TASK_STATUS_OPTS.find(o => o.v === f.status);
      chips.push({ id: "status", label: t("common.status"), value: t(s.key), onRemove: () => setF({ status: "all" }) });
    }
    if (f.due !== "all") {
      const d = TASK_DUE_OPTS.find(o => o.v === f.due);
      chips.push({ id: "due", label: t("tasks.filters.due"), value: t(d.key), onRemove: () => setF({ due: "all" }) });
    }
    f.tags.forEach(tag => {
      chips.push({ id: "tag-" + tag, label: t("common.tags"), value: tag, onRemove: () => setF({ tags: f.tags.filter(x => x !== tag) }) });
    });
  }
  const clearAll = () => { setSearch(""); setF({ ...EMPTY_TASK_FILTER }); };

  if (emptyState) {
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[24px] font-bold tracking-tight">{t("tasks.title")}</h1>
            <p className="text-[13px] text-[hsl(var(--muted-foreground))] mt-1">{t("tasks.subtitle")}</p>
          </div>
        </div>
        <Card padding="p-20" className="text-center">
          <div className="w-16 h-16 rounded-full bg-[hsl(var(--muted))] flex items-center justify-center mx-auto mb-5 text-[hsl(var(--muted-foreground))]">
            <Icons.CheckSquare size={28} />
          </div>
          <h3 className="text-[20px] font-semibold mb-2">{t("tasks.empty")}</h3>
          <p className="text-[14px] text-[hsl(var(--muted-foreground))] mb-7 max-w-md mx-auto">
            Create your first task to get started. You can schedule, estimate and track it across multiple views.
          </p>
          <Button size="lg" icon={Icons.Plus} onClick={onOpenTask}>{t("tasks.newTask")}</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-[24px] font-bold tracking-tight">{t("tasks.title")}</h1>
          <p className="text-[13px] text-[hsl(var(--muted-foreground))] mt-1">24 active tasks · 3 urgent</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {showSearch && (
            <div className="relative">
              <Icons.Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t("common.search")} className="h-9 pl-8 pr-3 rounded-[8px] border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-[12.5px] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] w-48" />
            </div>
          )}
          <FilterToggle
            open={filtersOpen}
            active={filtersActive}
            onClick={() => setFiltersOpen(o => !o)}
            label={t("common.filters")}
          />
          <span data-tour="feat-tasks-views">
          <ViewToggle
            value={view} onChange={setView}
            options={[
              { value: "list",     label: t("tasks.view.list"),     icon: Icons.ListChecks },
              { value: "kanban",   label: t("tasks.view.kanban"),   icon: Icons.Grid },
              { value: "gantt",    label: t("tasks.view.gantt"),    icon: Icons.BarChart },
              { value: "calendar", label: t("tasks.view.calendar"), icon: Icons.Calendar },
              { value: "stats",    label: t("tasks.view.stats"),    icon: Icons.Activity },
            ]}
          />
          </span>
          <ModuleTutorialButton module="tasks" />
          <Button size="sm" icon={Icons.Plus} onClick={() => view === "list" ? setListCreateSignal(n => n + 1) : onOpenTask()}>{t("tasks.new")}</Button>
        </div>
      </div>

      {/* Inline filter panel — pushes content down, never overlaps (P22). */}
      {filtersOpen && (
        <TaskFilterPanel
          view={view}
          f={f}
          onChange={setF}
          availableTags={availableTags}
          hasActive={filtersActive}
          onClearAll={clearAll}
          onClose={() => setFiltersOpen(false)}
        />
      )}
      {/* Persistent active-filter chips, shown when the panel is closed. */}
      {!filtersOpen && chips.length > 0 && (
        <ActiveFilterChips chips={chips} onClearAll={clearAll} />
      )}

      {view === "kanban" && <div data-tour="feat-tasks-kanban"><KanbanView search={search} filters={f} /></div>}
      {view === "list" && <TaskList search={search} filters={f} createSignal={listCreateSignal} />}
      {view === "gantt" && <TaskGantt />}
      {view === "calendar" && <TaskCalendar />}
      {view === "stats" && <TaskStats />}
    </div>
  );
}

const COLUMNS = [
  { id: "todo", t: "To do", color: "muted-foreground", count: 8 },
  { id: "doing", t: "In progress", color: "primary", count: 3 },
  { id: "done", t: "Done", color: "success", count: 12 },
  { id: "cancel", t: "Canceled", color: "danger", count: 1 },
];

const TASK_DATA = {
  todo: [
    { t: "Prep Q2 Board presentation", p: "HIGH", d: "3h", date: "Friday", tags: ["Presentation", "Q2"], subs: { done: 1, total: 5 } },
    { t: "API documentation update", p: "LOW", d: "1h", date: "Next wk", tags: ["Doc"] },
    { t: "Planifier sprint planning lundi", p: "MEDIUM", d: "15min", date: "Dimanche", tags: ["Planning"] },
    { t: "Site accessibility audit", p: "MEDIUM", d: "2h", date: "Next wk", tags: ["A11y", "Audit"] },
    { t: "Staging database migration", p: "HIGH", d: "2h", date: "Monday", tags: ["DB", "Migration"] },
  ],
  doing: [
    { t: "Finalize Desjardins client proposal", p: "URGENT", d: "2h", date: "Tomorrow", tags: ["Client", "Proposal"], subs: { done: 3, total: 6 }, energy: "high", active: true },
    { t: "Review PR #142 — refactoring auth", p: "HIGH", d: "45min", date: "Today", tags: ["Code", "Review"] },
    { t: "Reply to supplier emails", p: "MEDIUM", d: "30min", date: "Today", tags: ["Admin"] },
  ],
  done: [
    { t: "Login mockup finalized", p: "MEDIUM", d: "1h", date: "Yesterday", tags: ["Design"] },
    { t: "1:1 meeting Sarah", p: "MEDIUM", d: "30min", date: "Yesterday", tags: ["1:1"] },
    { t: "New project setup", p: "LOW", d: "45min", date: "Yesterday", tags: ["Setup"] },
  ],
  cancel: [
    { t: "Refactor legacy module", p: "LOW", d: "4h", date: "Canceled", tags: ["Tech debt"] },
  ],
};

function KanbanView(props) {
  return <BoardsView {...props} />;
}

/* ============================================================
   MULTI-BOARDS — "Tableaux" (formerly Kanban)
   Many-to-many: a task can sit on multiple boards with
   independent statuses per board.
============================================================ */
const INITIAL_BOARDS = [
  { id: "cours",  name: "Courses",            icon: Icons.Book,      color: "263 70% 60%", desc: "Exams, labs, projects" },
  { id: "emploi", name: "Internships & jobs",  icon: Icons.Target,    color: "20 90% 55%",  desc: "Applications, interviews, resume" },
  { id: "perso",  name: "Personal",            icon: Icons.Heart,     color: "330 80% 60%", desc: "Personal life, appointments, leisure" },
];

const BOARD_COLUMNS = [
  { id: "todo",   t: "To do",  color: "muted-foreground" },
  { id: "doing",  t: "In progress", color: "primary" },
  { id: "done",   t: "Done",     color: "success" },
];

const MAX_BOARD_COLUMNS = 6;

/* ============================================================
   P29 — COLUMN DELIGHT: color resolution + animation catalog.
============================================================ */
/* Named column color tokens → HSL triples. Column `color` may also already be
   a raw triple ("142 70% 50%"); resolveColHsl handles both. */
const COL_COLOR_TOKENS = {
  "muted-foreground": "215 15% 55%",
  primary: "263 70% 60%",
  success: "142 70% 50%",
  info:    "217 91% 60%",
  danger:  "0 84% 60%",
  warning: "38 92% 55%",
};
const IS_HSL_TRIPLE = /^\d+(\.\d+)?\s+\d+(\.\d+)?%\s+\d+(\.\d+)?%$/;
function resolveColHsl(color) {
  if (!color) return COL_COLOR_TOKENS["muted-foreground"];
  if (IS_HSL_TRIPLE.test(color)) return color;
  return COL_COLOR_TOKENS[color] || COL_COLOR_TOKENS["muted-foreground"];
}
/* Curated swatches offered in the column color picker. */
const COL_COLOR_SWATCHES = [
  { hsl: "215 15% 55%", name: "Gris" },
  { hsl: "263 70% 60%", name: "Violet" },
  { hsl: "217 91% 60%", name: "Bleu" },
  { hsl: "142 70% 50%", name: "Vert" },
  { hsl: "38 92% 55%",  name: "Ambre" },
  { hsl: "20 90% 55%",  name: "Orange" },
  { hsl: "0 84% 60%",   name: "Rouge" },
  { hsl: "330 80% 60%", name: "Rose" },
];

/* Offered animations. Every animation is freely selectable on ANY column.
   The "completion column" simply DEFAULTS to confetti (see defaultColAnim),
   but an explicit choice always wins. */
const COL_ANIMATIONS = [
  { id: "none",     label: "Aucune",   glyph: "∅" },
  { id: "confetti", label: "Confettis", glyph: "🎉" },
  { id: "glow",     label: "Lueur",    glyph: "✨" },
  { id: "check",    label: "Coche",    glyph: "✓" },
];
/* Default animation for a column when the user hasn't chosen one:
   completion column → confetti, an "in progress"-ish column → glow, else none. */
function defaultColAnim(colId, isEnd) {
  if (isEnd) return "confetti";
  if (colId === "doing") return "glow";
  return "none";
}

/* Board templates — preset column sets to bootstrap a board quickly.
   Cap each at MAX_BOARD_COLUMNS-1 columns so the user can still add one
   themselves after import. */
const BOARD_TEMPLATES = [
  {
    id: "blank",   name: "Vierge",                icon: Icons.Layout, color: "263 70% 60%",
    desc: "3 classic columns: To do / In progress / Done.",
    columns: [
      { id: "todo",  t: "To do",  color: "muted-foreground" },
      { id: "doing", t: "In progress", color: "primary" },
      { id: "done",  t: "Done",     color: "success" },
    ],
  },
  {
    id: "cours",   name: "Courses & study",        icon: Icons.Book, color: "263 70% 60%",
    desc: "Track courses, assignments, exams.",
    columns: [
      { id: "tobackup", t: "To plan",  color: "muted-foreground" },
      { id: "doing",    t: "In progress",     color: "primary" },
      { id: "review",   t: "Review",       color: "info" },
      { id: "done",     t: "Validated",    color: "success" },
    ],
  },
  {
    id: "emploi",  name: "Recherche d'emploi",     icon: Icons.Target, color: "20 90% 55%",
    desc: "From scouting to accepted offer.",
    columns: [
      { id: "wishlist", t: "Interesting", color: "muted-foreground" },
      { id: "applied",  t: "Applied",     color: "primary" },
      { id: "interview",t: "Entretien",   color: "warning" },
      { id: "offer",    t: "Offer received", color: "info" },
      { id: "done",     t: "Accepted",    color: "success" },
    ],
  },
  {
    id: "projet",  name: "Projet personnel",       icon: Icons.Star,  color: "330 80% 60%",
    desc: "Agile workflow: idea → spec → build → shipped.",
    columns: [
      { id: "ideas",    t: "Ideas",       color: "muted-foreground" },
      { id: "spec",     t: "Spec",        color: "info" },
      { id: "build",    t: "Build",       color: "primary" },
      { id: "shipped",  t: "Shipped",     color: "success" },
    ],
  },
  {
    id: "appart",  name: "Recherche d'appart",     icon: Icons.Heart, color: "142 70% 50%",
    desc: "Annonces, visites, dossiers, signature.",
    columns: [
      { id: "shortlist",t: "Shortlist",   color: "muted-foreground" },
      { id: "visit",    t: "Visite",      color: "info" },
      { id: "dossier",  t: "Dossier",     color: "warning" },
      { id: "signed",   t: "Signed",      color: "success" },
    ],
  },
];

const BOARD_TASKS = [
  { id: "t1", title: "Review Algorithms exam",            p: "HIGH",   d: "4h",    date: "Thu 28",        tags: ["INF353"] },
  { id: "t2", title: "Submit Networks lab",               p: "URGENT", d: "3h",    date: "Tomorrow",      tags: ["INF421"] },
  { id: "t3", title: "Candidature Google Cloud",         p: "MEDIUM", d: "1h30",  date: "Vendredi 29",   tags: ["Stage"] },
  { id: "t4", title: "Prep Datadog interview",            p: "HIGH",   d: "2h",    date: "Mon Jun 02",    tags: ["Interview"], active: true },
  { id: "t5", title: "Update the resume",                 p: "MEDIUM", d: "1h",    date: "This wk",       tags: ["CV"] },
  { id: "t6", title: "Distributed architecture workshop", p: "MEDIUM", d: "3h",    date: "Tue 27",        tags: ["INF421"] },
  { id: "t7", title: "Mom's birthday",            p: "HIGH",   d: "—",     date: "Samedi 30",     tags: ["Family"] },
  { id: "t8", title: "Lire « Sapiens » ch. 5",           p: "LOW",    d: "1h",    date: "Ce weekend",    tags: ["Lecture"] },
  { id: "t9", title: "Datadog cover-letter draft",       p: "HIGH",   d: "1h30",  date: "Tomorrow",      tags: ["Cover letter"] },
  { id: "t10", title: "Cours de yoga",                   p: "LOW",    d: "1h",    date: "Samedi 30",     tags: ["Sport"] },
  { id: "t11", title: "Soutenance projet IA",            p: "URGENT", d: "—",     date: "Mer 04 juin",   tags: ["Soutenance"] },
  { id: "t12", title: "Interview thank-you notes", p: "LOW",    d: "20min", date: "Today",   tags: ["Suivi"] },
];

// Many-to-many: a task can be on multiple boards, with independent statuses.
// Note t5 ("CV") appears on both emploi+perso; t6 (workshop) appears on cours+emploi
// with DIFFERENT statuses — proof that status is per-board.
const INITIAL_PLACEMENTS = [
  // Cours
  { taskId: "t1",  boardId: "cours",  status: "doing" },
  { taskId: "t2",  boardId: "cours",  status: "doing" },
  { taskId: "t6",  boardId: "cours",  status: "todo" },
  { taskId: "t11", boardId: "cours",  status: "todo" },
  // Emploi
  { taskId: "t3",  boardId: "emploi", status: "todo" },
  { taskId: "t4",  boardId: "emploi", status: "doing" },
  { taskId: "t9",  boardId: "emploi", status: "doing" },
  { taskId: "t5",  boardId: "emploi", status: "todo" },   // ← shared task
  { taskId: "t6",  boardId: "emploi", status: "done" },   // ← shared, but done HERE
  { taskId: "t12", boardId: "emploi", status: "done" },
  // Perso
  { taskId: "t7",  boardId: "perso",  status: "todo" },
  { taskId: "t8",  boardId: "perso",  status: "doing" },
  { taskId: "t10", boardId: "perso",  status: "doing" },
  { taskId: "t5",  boardId: "perso",  status: "todo" },   // ← shared task
];

/* Board tab options menu: rename, pin/unpin (max 3), delete. Fixed-positioned
   so it escapes the board switcher's horizontal-scroll clipping. */
function BoardTabMenu({ pos, pinned, pinDisabled, canDelete, onRename, onTogglePin, onDelete, onClose }) {
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    const k = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("mousedown", h);
    window.addEventListener("keydown", k);
    return () => { window.removeEventListener("mousedown", h); window.removeEventListener("keydown", k); };
  }, [onClose]);
  return (
    <div ref={ref} role="menu"
      onClick={(e) => e.stopPropagation()}
      style={{ position: "fixed", left: pos.left, top: pos.top, width: 180 }}
      className="rounded-[10px] border border-[hsl(var(--border))] bg-[hsl(var(--popover))] shadow-2xl z-[1900] anim-fade-in py-1">
      <button onClick={onRename}
        className="w-full px-3 py-1.5 text-[12.5px] flex items-center gap-2 hover:bg-[hsl(var(--accent))] text-left">
        <Icons.Edit size={13} /> Renommer
      </button>
      <button onClick={onTogglePin} disabled={pinDisabled}
        title={pinDisabled ? "Maximum 3 favoris épinglés" : undefined}
        className={cn("w-full px-3 py-1.5 text-[12.5px] flex items-center gap-2 text-left",
          pinDisabled ? "opacity-40 cursor-not-allowed" : "hover:bg-[hsl(var(--accent))]")}>
        <Icons.Star size={13} style={pinned ? { fill: "hsl(38 92% 60%)", color: "hsl(38 92% 60%)" } : undefined} />
        {pinned ? "Désépingler" : "Épingler en favori"}
      </button>
      <div className="my-1 border-t border-[hsl(var(--border))]" />
      <button onClick={onDelete} disabled={!canDelete}
        title={!canDelete ? "Au moins un tableau requis" : undefined}
        className={cn("w-full px-3 py-1.5 text-[12.5px] flex items-center gap-2 text-left",
          canDelete ? "text-[hsl(0_84%_70%)] hover:bg-[hsl(0_84%_60%/0.1)]" : "opacity-40 cursor-not-allowed")}>
        <Icons.Trash size={13} /> Supprimer
      </button>
    </div>
  );
}

/* P29 — Global motion mode: Complètes / Discrètes / Désactivées. Honored by
   ColumnFxOverlay and reflected on <html> for the CSS kill-switch. A reduced-
   motion note appears when the OS pref is active (CSS already forces effects off). */
function MotionModeControl({ motion, onChange }) {
  const reduced = typeof window !== "undefined" && window.matchMedia
    && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const opts = [
    { id: "full",   label: "Complètes", glyph: "🎉" },
    { id: "subtle", label: "Discrètes", glyph: "✨" },
    { id: "off",    label: "Off",       glyph: "∅" },
  ];
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] uppercase tracking-[0.08em] font-semibold text-[hsl(var(--muted-foreground))] flex items-center gap-1">
        <Icons.Sparkles size={11} /> Animations
      </span>
      <div className="inline-flex p-0.5 rounded-[8px] bg-[hsl(var(--muted)/0.5)] gap-0.5" role="radiogroup" aria-label="Mode d'animation">
        {opts.map(o => (
          <button key={o.id} role="radio" aria-checked={motion === o.id}
            onClick={() => onChange(o.id)}
            title={o.label}
            className={cn("h-7 px-2 rounded-[6px] text-[11px] font-medium transition-all flex items-center gap-1",
              motion === o.id ? "bg-[hsl(var(--card))] shadow-sm text-[hsl(var(--foreground))]" : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]")}>
            <span className="text-[12px] leading-none">{o.glyph}</span>{o.label}
          </button>
        ))}
      </div>
      {reduced && (
        <span title="Votre système demande des animations réduites — les effets sont désactivés automatiquement."
          className="text-[10px] text-[hsl(38_92%_62%)] flex items-center gap-1">
          <Icons.AlertTriangle size={10} /> réduit (OS)
        </span>
      )}
    </div>
  );
}

/* ============================================================
   P29 — Column arrival-animation overlay. Decorative, non-blocking,
   pointer-events-none. Re-mounts on `fxKey` so the same effect can replay.
   Honors the global motion mode: "off" renders nothing, "subtle" swaps any
   loud effect for one gentle pulse. (prefers-reduced-motion is killed in CSS.)
============================================================ */
function ColumnFxOverlay({ anim, fxKey, hsl, motion }) {
  if (!anim || anim === "none" || motion === "off") return null;
  const style = { "--kc": hsl };
  if (motion === "subtle") {
    return <div key={fxKey} className="absolute inset-0 z-20 pointer-events-none overflow-hidden" style={style}><span className="kfx-subtle-pulse" /></div>;
  }
  let inner = null;
  if (anim === "confetti") {
    const palette = [hsl, "38 92% 55%", "142 70% 50%", "217 91% 60%", "330 80% 60%", "0 84% 60%"];
    inner = Array.from({ length: 16 }, (_, i) => {
      const dx = (Math.random() * 2 - 1) * 120;
      const dy = 120 + Math.random() * 160;
      const dr = (Math.random() * 2 - 1) * 540;
      const delay = Math.random() * 120;
      const c = palette[i % palette.length];
      return (
        <span key={i} className="kfx-confetti-piece" style={{
          background: `hsl(${c})`,
          "--dx": `${dx}px`, "--dy": `${dy}px`, "--dr": `${dr}deg`,
          animationDelay: `${delay}ms`,
          marginLeft: `${(Math.random() * 2 - 1) * 30}px`,
          borderRadius: i % 3 === 0 ? "50%" : "2px",
        }} />
      );
    });
  } else if (anim === "glow") {
    inner = <span className="kfx-glow" />;
  } else if (anim === "check") {
    inner = (
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="kfx-check w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
          style={{ background: `hsl(${hsl})`, color: "#fff" }}>
          <Icons.Check size={26} stroke={3} />
        </span>
      </div>
    );
  }
  return <div key={fxKey} className="absolute inset-0 z-20 pointer-events-none overflow-hidden" style={style}>{inner}</div>;
}

/* P29 — Per-column settings popover: designated color, arrival animation
   (with preview), completion-column toggle, and remove. Opened from the
   column header's gear. */
function ColumnFxMenu({ board, col, fx, ops, isEnd, onPreview, onClose, onRemove, canRemove }) {
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    const k = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("mousedown", h);
    window.addEventListener("keydown", k);
    return () => { window.removeEventListener("mousedown", h); window.removeEventListener("keydown", k); };
  }, [onClose]);

  const key = board.id + ":" + col.id;
  const curColor = fx.color[key] || resolveColHsl(col.color);
  const curAnim = fx.anim[key] ?? defaultColAnim(col.id, isEnd);

  return (
    <div ref={ref} role="menu"
      onClick={(e) => e.stopPropagation()}
      className="absolute right-0 top-full mt-1.5 w-[268px] rounded-[12px] border border-[hsl(var(--border))] bg-[hsl(var(--popover))] shadow-2xl z-50 anim-fade-in p-3">
      {/* Color */}
      <div className="text-[10px] uppercase tracking-[0.1em] font-semibold text-[hsl(var(--muted-foreground))] mb-1.5">Couleur de la colonne</div>
      <div className="mb-3">
        <SwatchPicker
          value={curColor}
          onChange={(hsl) => ops.setColor(board.id, col.id, hsl)}
          palette={COL_COLOR_SWATCHES.map(s => s.hsl)}
          size={28}
          ring="foreground"
        />
      </div>

      {/* Completion column */}
      <button onClick={() => ops.setEndCol(board.id, col.id)}
        className={cn("w-full flex items-center gap-2 px-2.5 py-2 rounded-[8px] text-[12px] mb-3 border transition-colors text-left",
          isEnd ? "border-[hsl(142_70%_50%/0.5)] bg-[hsl(142_70%_50%/0.1)] text-[hsl(142_70%_65%)]"
                : "border-[hsl(var(--border))] hover:bg-[hsl(var(--accent))] text-[hsl(var(--foreground))]")}>
        <span className={cn("w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0",
          isEnd ? "bg-[hsl(142_70%_50%)] border-[hsl(142_70%_50%)]" : "border-[hsl(var(--muted-foreground)/0.5)]")}>
          {isEnd && <Icons.Check size={10} stroke={3} className="text-white" />}
        </span>
        <span className="flex-1">Colonne de fin <span className="text-[hsl(var(--muted-foreground))]">(célébration)</span></span>
        {isEnd && <span className="text-[14px]">🎉</span>}
      </button>

      {/* Animation */}
      <div className="text-[10px] uppercase tracking-[0.1em] font-semibold text-[hsl(var(--muted-foreground))] mb-1.5 flex items-center justify-between">
        <span>Animation à l'arrivée</span>
        <button onClick={() => onPreview(curAnim)} title="Aperçu"
          className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary)/0.1)]">
          <Icons.Eye size={10} /> Aperçu
        </button>
      </div>
      <div className="grid grid-cols-1 gap-1">
        {COL_ANIMATIONS.map(a => {
          const active = curAnim === a.id;
          return (
            <button key={a.id}
              onClick={() => { ops.setAnim(board.id, col.id, a.id); onPreview(a.id); }}
              className={cn("flex items-center gap-2.5 px-2.5 py-1.5 rounded-[8px] text-[12.5px] text-left transition-colors",
                active ? "bg-[hsl(var(--primary)/0.12)] text-[hsl(263_70%_82%)]" : "hover:bg-[hsl(var(--accent))]")}>
              <span className="w-5 text-center text-[15px]">{a.glyph}</span>
              <span className="flex-1">{a.label}</span>
              {active && <Icons.Check size={13} className="text-[hsl(var(--primary))]" />}
            </button>
          );
        })}
      </div>

      {canRemove && (
        <>
          <div className="h-px bg-[hsl(var(--border))] my-2.5" />
          <button onClick={onRemove}
            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-[8px] text-[12px] text-[hsl(0_84%_70%)] hover:bg-[hsl(0_84%_60%/0.1)] text-left">
            <Icons.Trash size={13} /> Supprimer la colonne
          </button>
        </>
      )}
    </div>
  );
}

function BoardsView({ search = "", filters = EMPTY_TASK_FILTER }) {
  const [boards, setBoards] = useState(INITIAL_BOARDS);
  const [placements, setPlacements] = useState(INITIAL_PLACEMENTS);
  // Board tasks made stateful so titles can be edited inline.
  const [boardTasks, setBoardTasks] = useState(BOARD_TASKS);
  const renameTask = (id, next) => setBoardTasks(arr => arr.map(t => t.id === id ? { ...t, title: next } : t));
  const [activeBoardId, setActiveBoardId] = useState(INITIAL_BOARDS[0].id);
  const [creating, setCreating] = useState(false);
  const [linkingTaskId, setLinkingTaskId] = useState(null);

  // P20 — scope visible boards to the active Espace.
  const [boardSpaceId] = useSpace();
  const visibleBoards = boards.filter(b => window.__dpmBoardInSpace ? window.__dpmBoardInSpace(b.name, boardSpaceId) : true);
  useEffect(() => {
    if (visibleBoards.length && !visibleBoards.some(b => b.id === activeBoardId)) {
      setActiveBoardId(visibleBoards[0].id);
    }
  }, [boardSpaceId]);

  // Per-board columns state — default boards seed with the standard 3-column set.
  // User can add columns up to MAX_BOARD_COLUMNS via the inline adder.
  const [columnsByBoard, setColumnsByBoard] = useState(() =>
    Object.fromEntries(INITIAL_BOARDS.map(b => [b.id, BOARD_COLUMNS]))
  );
  const activeColumns = columnsByBoard[activeBoardId] || BOARD_COLUMNS;
  const colCount = activeColumns.length;
  const atColumnCap = colCount >= MAX_BOARD_COLUMNS;

  const addColumn = (name) => {
    if (atColumnCap || !name.trim()) return;
    setColumnsByBoard(map => ({
      ...map,
      [activeBoardId]: [
        ...activeColumns,
        { id: "c" + Date.now(), t: name.trim(), color: "info" },
      ],
    }));
  };
  const renameColumn = (colId, newName) => {
    setColumnsByBoard(map => ({
      ...map,
      [activeBoardId]: activeColumns.map(c => c.id === colId ? { ...c, t: newName } : c),
    }));
  };
  const removeColumn = (colId) => {
    // Move placements in this column to the first remaining one
    const remaining = activeColumns.filter(c => c.id !== colId);
    if (remaining.length === 0) return; // never go below 1
    setColumnsByBoard(map => ({ ...map, [activeBoardId]: remaining }));
    setPlacements(arr => arr.map(p =>
      (p.boardId === activeBoardId && p.status === colId)
        ? { ...p, status: remaining[0].id }
        : p
    ));
  };
  const [draggingTaskId, setDraggingTaskId] = useState(null);
  const [dragOverCol, setDragOverCol] = useState(null);
  const [dragFromCol, setDragFromCol] = useState(null);        // origin column of the dragged card
  const [dropTarget, setDropTarget] = useState(null);          // { col, beforeId } — beforeId null = end of column
  const linkAnchorRef = useRef(null);

  // P29 — per-column delight animations + designated color + global motion.
  const [fx, fxOps] = useKanbanFx();
  // Transient per-column trigger: bump a key to (re)play the column's animation.
  const [colFx, setColFx] = useState({}); // { [colId]: { anim, key } }
  const [menuColId, setMenuColId] = useState(null);
  // The board's completion column: explicit choice, else a "done" column, else last.
  const endColId = fx.endCol[activeBoardId]
    || (activeColumns.some(c => c.id === "done") ? "done" : activeColumns[activeColumns.length - 1]?.id);
  const colAnimFor = (colId) => fx.anim[activeBoardId + ":" + colId] ?? defaultColAnim(colId, colId === endColId);
  const colHslFor  = (col)   => fx.color[activeBoardId + ":" + col.id] || resolveColHsl(col.color);
  // Fire a column's arrival animation (decorative — never blocks the move).
  // The column always plays EXACTLY its selected animation — no override.
  const playColFx = (colId) => {
    const anim = colAnimFor(colId);
    if (!anim || anim === "none") return;
    setColFx(prev => ({ ...prev, [colId]: { anim, key: Date.now() } }));
  };

  const activeBoard = boards.find(b => b.id === activeBoardId) || boards[0];

  // Group active board's tasks by column (with search + filters: priority/tags/due)
  const byColumn = useMemo(() => {
    const q = search.trim().toLowerCase();
    const out = Object.fromEntries(activeColumns.map(c => [c.id, []]));
    for (const p of placements) {
      if (p.boardId !== activeBoardId) continue;
      const task = boardTasks.find(tk => tk.id === p.taskId);
      if (!task || !out[p.status]) continue;
      if (!matchTaskFilter(task, filters)) continue;
      if (q && !task.title.toLowerCase().includes(q)) continue;
      out[p.status].push(task);
    }
    return out;
  }, [placements, activeBoardId, activeColumns, boardTasks, search, filters]);

  // How many DIFFERENT boards a task is on (for the "présente sur N tableaux" badge)
  const boardCountForTask = (taskId) => new Set(placements.filter(p => p.taskId === taskId).map(p => p.boardId)).size;

  // The per-board status of a task on a given board (used by the link picker)
  const statusOnBoard = (taskId, boardId) => placements.find(p => p.taskId === taskId && p.boardId === boardId)?.status;

  // Counts per board for the tab badges
  const taskCountByBoard = (boardId) => new Set(placements.filter(p => p.boardId === boardId).map(p => p.taskId)).size;

  // Move a task to a column AND position it (drag-and-drop). `beforeId` = insert
  // before that task within the target column; null = append at the column's end.
  // Reorders the placements array so byColumn (which preserves array order) reflects it.
  const moveTask = (taskId, toStatus, beforeId = null) => {
    setPlacements(prev => {
      const i = prev.findIndex(p => p.taskId === taskId && p.boardId === activeBoardId);
      if (i === -1) return prev;
      const moved = { ...prev[i], status: toStatus };
      const rest = prev.slice(0, i).concat(prev.slice(i + 1));
      let insertAt;
      if (beforeId != null) {
        const bIdx = rest.findIndex(p => p.taskId === beforeId && p.boardId === activeBoardId && p.status === toStatus);
        insertAt = bIdx === -1 ? rest.length : bIdx;
      } else {
        // Append after the last placement already in the target column.
        let lastMatch = -1;
        for (let k = 0; k < rest.length; k++) {
          if (rest[k].boardId === activeBoardId && rest[k].status === toStatus) lastMatch = k;
        }
        insertAt = lastMatch === -1 ? rest.length : lastMatch + 1;
      }
      rest.splice(insertAt, 0, moved);
      return rest;
    });
  };

  // Commit a drop onto a column. Plays the arrival animation ONLY when the card
  // crosses into a DIFFERENT column — a same-column reorder is silent (no fx),
  // since repeating it would be annoying.
  const commitDrop = (toCol) => {
    if (!draggingTaskId) { setDropTarget(null); return; }
    const crossed = dragFromCol !== toCol;
    const beforeId = dropTarget && dropTarget.col === toCol ? dropTarget.beforeId : null;
    moveTask(draggingTaskId, toCol, beforeId);
    if (crossed) playColFx(toCol);
    setDraggingTaskId(null);
    setDragOverCol(null);
    setDragFromCol(null);
    setDropTarget(null);
  };

  // Move a task to a different column on the ACTIVE board (drag-and-drop)
  const moveTaskToColumn = (taskId, toStatus) => {
    setPlacements(prev => {
      const idx = prev.findIndex(p => p.taskId === taskId && p.boardId === activeBoardId);
      if (idx === -1) return prev;
      if (prev[idx].status === toStatus) return prev;
      const next = prev.slice();
      next[idx] = { ...next[idx], status: toStatus };
      return next;
    });
  };

  // Link/unlink a task to/from a board (multi-select picker)
  const toggleLink = (taskId, boardId) => {
    setPlacements(prev => {
      const has = prev.some(p => p.taskId === taskId && p.boardId === boardId);
      if (has) return prev.filter(p => !(p.taskId === taskId && p.boardId === boardId));
      return [...prev, { taskId, boardId, status: "todo" }];
    });
  };

  const onCreateBoard = (name, color, template) => {
    const id = "b" + Date.now();
    setBoards(b => [...b, { id, name, color, icon: template?.icon || Icons.Layout, desc: template?.desc || "New board" }]);
    setColumnsByBoard(map => ({ ...map, [id]: template?.columns || BOARD_COLUMNS }));
    setActiveBoardId(id);
    setCreating(false);
  };

  // ---- Board rename / delete / pin (max 3 favorites) ----
  const MAX_PINNED = 3;
  const [pinned, setPinned] = useState([]);          // board ids, in pin order
  const [editingBoardId, setEditingBoardId] = useState(null);
  const [boardDraft, setBoardDraft] = useState("");
  const [boardMenuId, setBoardMenuId] = useState(null);
  const [boardMenuPos, setBoardMenuPos] = useState(null);

  const renameBoard = (id, next) => {
    const v = (next || "").trim();
    if (!v) return;
    setBoards(arr => arr.map(b => b.id === id ? { ...b, name: v } : b));
  };
  const startRenameBoard = (b) => { setEditingBoardId(b.id); setBoardDraft(b.name); setBoardMenuId(null); };
  const commitRenameBoard = () => {
    if (editingBoardId) renameBoard(editingBoardId, boardDraft);
    setEditingBoardId(null); setBoardDraft("");
  };
  const removeBoard = (id) => {
    if (boards.length <= 1) return; // never delete the last board
    setBoards(arr => arr.filter(b => b.id !== id));
    setColumnsByBoard(map => { const m = { ...map }; delete m[id]; return m; });
    setPlacements(arr => arr.filter(p => p.boardId !== id));
    setPinned(arr => arr.filter(x => x !== id));
    setBoardMenuId(null);
    if (activeBoardId === id) {
      const next = boards.find(b => b.id !== id);
      if (next) setActiveBoardId(next.id);
    }
  };
  const isPinned = (id) => pinned.includes(id);
  const togglePin = (id) => {
    setPinned(arr => {
      if (arr.includes(id)) return arr.filter(x => x !== id);
      if (arr.length >= MAX_PINNED) return arr; // cap at 3
      return [...arr, id];
    });
  };
  // Pinned boards float to the front (in pin order); others keep their order.
  const orderedBoards = useMemo(() => {
    const rank = (id) => { const i = pinned.indexOf(id); return i === -1 ? Infinity : i; };
    return [...visibleBoards].sort((a, b) => rank(a.id) - rank(b.id));
  }, [visibleBoards, pinned]);

  // P20 — a space with no task boards shows a clean empty-state.
  if (visibleBoards.length === 0) {
    const sp = window.__dpmSpaceById ? window.__dpmSpaceById(boardSpaceId) : null;
    return (
      <Card padding="p-16" className="text-center">
        <div className="w-14 h-14 rounded-full bg-[hsl(var(--muted))] flex items-center justify-center mx-auto mb-4 text-[hsl(var(--muted-foreground))]">
          <Icons.Grid size={24} />
        </div>
        <h3 className="text-[17px] font-semibold mb-1.5">No board in {sp ? `“${sp.name}”` : "this space"}</h3>
        <p className="text-[13px] text-[hsl(var(--muted-foreground))] max-w-sm mx-auto mb-5">
          This space has no task board yet. Attach one from “Manage spaces”, or switch back to “All” to see everything.
        </p>
        <div className="flex items-center justify-center gap-2">
          <Button size="sm" variant="outline" icon={Icons.Settings} onClick={() => window.__dpmOpenSpaces?.("manage", boardSpaceId)}>Manage space</Button>
          <Button size="sm" icon={Icons.Layers} onClick={() => window.__dpmSetSpace?.("all")}>View “All”</Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4 relative">
      {/* Boards switcher */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 -mx-1 px-1">
        {orderedBoards.map(b => {
          const active = b.id === activeBoardId;
          const count = taskCountByBoard(b.id);
          const editing = editingBoardId === b.id;
          const pinnedB = isPinned(b.id);
          const pinDisabled = !pinnedB && pinned.length >= MAX_PINNED;
          return (
            <div key={b.id} className="relative flex-shrink-0">
              <div
                role="button"
                tabIndex={0}
                onClick={() => { if (!editing) setActiveBoardId(b.id); }}
                onKeyDown={(e) => { if ((e.key === "Enter" || e.key === " ") && !editing) { e.preventDefault(); setActiveBoardId(b.id); } }}
                className={cn(
                  "group/btab h-10 pl-3 pr-2 rounded-[10px] border flex items-center gap-2 text-[13px] font-medium transition-all cursor-pointer",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))]",
                  active
                    ? "bg-[hsl(var(--card))] border-[hsl(var(--primary)/0.5)] shadow-sm"
                    : "bg-[hsl(var(--card)/0.4)] border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:border-[hsl(var(--primary)/0.3)]"
                )}
              >
                <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: `hsl(${b.color})` }} />
                <b.icon size={14} className={active ? "text-[hsl(var(--foreground))]" : ""} />
                {editing && !active ? (
                  <input
                    autoFocus
                    value={boardDraft}
                    onChange={(e) => setBoardDraft(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    onBlur={commitRenameBoard}
                    onKeyDown={(e) => {
                      e.stopPropagation();
                      if (e.key === "Enter") { e.preventDefault(); commitRenameBoard(); }
                      else if (e.key === "Escape") { setEditingBoardId(null); setBoardDraft(""); }
                    }}
                    className="w-28 bg-transparent border-b border-[hsl(var(--primary))] text-[13px] font-medium focus:outline-none px-0.5"
                  />
                ) : (
                  <span
                    onDoubleClick={(e) => { e.stopPropagation(); startRenameBoard(b); }}
                    title="Double-cliquez pour renommer"
                    className="select-none"
                  >
                    {b.name}
                  </span>
                )}
                {pinnedB && !editing && (
                  <Icons.Star size={11} className="text-[hsl(38_92%_60%)] flex-shrink-0" style={{ fill: "hsl(38 92% 60%)" }} />
                )}
                <span className={cn(
                  "ml-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-mono tabular-nums flex-shrink-0",
                  active ? "bg-[hsl(var(--primary)/0.18)] text-[hsl(263_70%_80%)]" : "bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]"
                )}>{count}</span>
                {!editing && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (boardMenuId === b.id) { setBoardMenuId(null); return; }
                      const r = e.currentTarget.getBoundingClientRect();
                      setBoardMenuPos({ left: Math.min(r.left, window.innerWidth - 188), top: r.bottom + 6 });
                      setBoardMenuId(b.id);
                    }}
                    title="Options du tableau"
                    className={cn(
                      "w-6 h-6 -mr-1 rounded flex items-center justify-center text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))] flex-shrink-0 transition-opacity",
                      (active || boardMenuId === b.id) ? "opacity-100" : "opacity-0 group-hover/btab:opacity-100"
                    )}
                  >
                    <Icons.More size={14} />
                  </button>
                )}
              </div>
              {boardMenuId === b.id && boardMenuPos && (
                <BoardTabMenu
                  pos={boardMenuPos}
                  pinned={pinnedB}
                  pinDisabled={pinDisabled}
                  canDelete={boards.length > 1}
                  onRename={() => startRenameBoard(b)}
                  onTogglePin={() => { togglePin(b.id); setBoardMenuId(null); }}
                  onDelete={() => { if (window.confirm(`Supprimer le tableau « ${b.name} » ?`)) removeBoard(b.id); else setBoardMenuId(null); }}
                  onClose={() => setBoardMenuId(null)}
                />
              )}
            </div>
          );
        })}
        <button
          onClick={() => setCreating(true)}
          className="h-10 px-3 rounded-[10px] border border-dashed border-[hsl(var(--border))] flex items-center gap-1.5 text-[12.5px] font-medium text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:border-[hsl(var(--primary)/0.4)] hover:bg-[hsl(var(--accent)/0.3)] transition-colors flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))]"
        >
          <Icons.Plus size={13} /> New board
        </button>
      </div>

      {/* Active board header */}
      <div className="flex items-end justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-[10px] flex items-center justify-center flex-shrink-0" style={{ background: `hsl(${activeBoard.color} / 0.18)`, color: `hsl(${activeBoard.color})` }}>
            <activeBoard.icon size={18} />
          </div>
          <div className="min-w-0">
            {editingBoardId === activeBoard.id ? (
              <input
                autoFocus
                value={boardDraft}
                onChange={(e) => setBoardDraft(e.target.value)}
                onBlur={commitRenameBoard}
                onKeyDown={(e) => {
                  if (e.key === "Enter") { e.preventDefault(); commitRenameBoard(); }
                  else if (e.key === "Escape") { setEditingBoardId(null); setBoardDraft(""); }
                }}
                className="text-[18px] font-bold tracking-tight bg-transparent border-b-2 border-[hsl(var(--primary))] focus:outline-none w-full max-w-[320px]"
              />
            ) : (
              <h2 onDoubleClick={() => startRenameBoard(activeBoard)} title="Double-cliquez pour renommer"
                className="text-[18px] font-bold tracking-tight truncate cursor-text">{activeBoard.name}</h2>
            )}
            <p className="text-[12px] text-[hsl(var(--muted-foreground))] truncate">{activeBoard.desc}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <MotionModeControl motion={fx.motion} onChange={fxOps.setMotion} />
          <ColumnCountBadge count={colCount} max={MAX_BOARD_COLUMNS} />
          <div className="flex items-center gap-1.5 text-[11.5px] text-[hsl(var(--muted-foreground))]">
            <Icons.Sparkles size={11} className="text-[hsl(var(--primary))]" />
            Astuce : glissez une carte — l'encadré prend la couleur de la colonne, et son animation se joue à l'arrivée.
          </div>
        </div>
      </div>

      {/* Columns */}
      <div className="flex gap-4 overflow-x-auto pb-2 min-h-[calc(100vh-340px)]">
        {activeColumns.map(col => {
          const items = byColumn[col.id];
          const isDropTarget = dragOverCol === col.id && draggingTaskId;
          const colHsl = colHslFor(col);
          const isEnd = col.id === endColId;
          const fxActive = colFx[col.id];
          return (
            <div
              key={col.id}
              onDragOver={(e) => {
                if (!draggingTaskId) return;
                e.preventDefault();
                setDragOverCol(col.id);
                // Default insert position = end of column, unless a card sets a precise slot.
                setDropTarget(prev => (prev && prev.col === col.id) ? prev : { col: col.id, beforeId: null });
              }}
              onDragLeave={(e) => { if (e.currentTarget.contains(e.relatedTarget)) return; setDragOverCol(prev => prev === col.id ? null : prev); }}
              onDrop={(e) => { e.preventDefault(); commitDrop(col.id); }}
              style={{ flex: "1 1 280px", minWidth: 280, maxWidth: 360, "--kc": colHsl }}
              className={cn(
                "relative rounded-[12px] border bg-[hsl(var(--card)/0.4)] flex flex-col min-h-0 transition-all"
              )}
            >
              {/* Hover/drop highlight — tinted by THIS column's designated color */}
              {isDropTarget && (
                <div className="absolute inset-0 rounded-[12px] pointer-events-none z-10 transition-all"
                  style={{ border: `2px solid hsl(${colHsl})`, background: `hsl(${colHsl} / 0.08)`, boxShadow: `0 0 0 3px hsl(${colHsl} / 0.22)` }} />
              )}
              {/* Per-column delight overlay (decorative, non-blocking) */}
              <ColumnFxOverlay anim={fxActive?.anim} fxKey={fxActive?.key} hsl={colHsl} motion={fx.motion} />

              <div className="px-4 py-3 border-b border-[hsl(var(--border))] flex items-center justify-between relative">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: `hsl(${colHsl})` }} />
                  <span className="text-[13px] font-semibold truncate">{col.t}</span>
                  <Badge variant="muted" className="font-mono">{items.length}</Badge>
                  {isEnd && <span title="Colonne de fin" className="text-[11px] leading-none opacity-80">🏁</span>}
                  {colAnimFor(col.id) !== "none" && (
                    <span title={`Animation : ${(COL_ANIMATIONS.find(a => a.id === colAnimFor(col.id)) || {}).label}`}
                      className="text-[11px] leading-none opacity-70">
                      {(COL_ANIMATIONS.find(a => a.id === colAnimFor(col.id)) || {}).glyph}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setMenuColId(prev => prev === col.id ? null : col.id)}
                  title="Couleur & animation de la colonne"
                  className={cn("w-7 h-7 rounded hover:bg-[hsl(var(--accent))] flex items-center justify-center text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] flex-shrink-0",
                    menuColId === col.id && "bg-[hsl(var(--accent))] text-[hsl(var(--foreground))]")}>
                  <Icons.Settings size={14} />
                </button>
                {menuColId === col.id && (
                  <ColumnFxMenu
                    board={activeBoard}
                    col={col}
                    fx={fx}
                    ops={fxOps}
                    isEnd={isEnd}
                    canRemove={activeColumns.length > 1}
                    onPreview={(anim) => {
                      if (anim && anim !== "none") setColFx(prev => ({ ...prev, [col.id]: { anim, key: Date.now() } }));
                    }}
                    onRemove={() => { removeColumn(col.id); setMenuColId(null); }}
                    onClose={() => setMenuColId(null)}
                  />
                )}
              </div>
              <div className="flex-1 overflow-y-auto p-2 space-y-2">
                {items.map((t, idx) => {
                  const showBar = draggingTaskId && dropTarget && dropTarget.col === col.id && dropTarget.beforeId === t.id;
                  return (
                    <React.Fragment key={t.id}>
                      {showBar && (
                        <div className="h-0.5 -my-1 rounded-full" style={{ background: `hsl(${colHsl})`, boxShadow: `0 0 0 2px hsl(${colHsl} / 0.25)` }} />
                      )}
                      <BoardTaskCard
                        task={t}
                        multiCount={boardCountForTask(t.id)}
                        dragging={draggingTaskId === t.id}
                        onDragStart={() => { setDraggingTaskId(t.id); setDragFromCol(col.id); }}
                        onDragEnd={() => { setDraggingTaskId(null); setDragOverCol(null); setDragFromCol(null); setDropTarget(null); }}
                        onDragOverCard={(e) => {
                          if (!draggingTaskId) return;
                          e.preventDefault();
                          e.stopPropagation();
                          setDragOverCol(col.id);
                          const r = e.currentTarget.getBoundingClientRect();
                          const topHalf = (e.clientY - r.top) < r.height / 2;
                          // Insert before this card (top half) or before the next card (bottom half).
                          const beforeId = topHalf ? t.id : (items[idx + 1] ? items[idx + 1].id : null);
                          setDropTarget({ col: col.id, beforeId });
                        }}
                        onDropCard={(e) => { e.preventDefault(); e.stopPropagation(); commitDrop(col.id); }}
                        onLink={(ref) => { linkAnchorRef.current = ref; setLinkingTaskId(t.id); }}
                        onRename={(next) => renameTask(t.id, next)}
                      />
                    </React.Fragment>
                  );
                })}
                {/* End-of-column insert bar */}
                {draggingTaskId && dropTarget && dropTarget.col === col.id && dropTarget.beforeId === null && items.length > 0 && (
                  <div className="h-0.5 -my-1 rounded-full" style={{ background: `hsl(${colHsl})`, boxShadow: `0 0 0 2px hsl(${colHsl} / 0.25)` }} />
                )}
                {items.length === 0 && (
                  <div className={cn(
                    "rounded-[8px] border border-dashed p-4 text-center text-[11.5px] transition-colors",
                    !isDropTarget && "border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))]"
                  )}
                  style={isDropTarget ? { borderColor: `hsl(${colHsl} / 0.6)`, color: `hsl(${colHsl})`, background: `hsl(${colHsl} / 0.06)` } : undefined}>
                    {isDropTarget ? "Déposer ici" : "Aucune carte"}
                  </div>
                )}
                {col.id === "todo" && (
                  <button onClick={() => window.__dpmQuickCreate?.({ type: "task" })} className="w-full rounded-[8px] border border-dashed border-[hsl(var(--border))] p-3 text-[12px] text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent)/0.3)] flex items-center justify-center gap-1.5">
                    <Icons.Plus size={12} /> Add a card
                  </button>
                )}
              </div>
            </div>
          );
        })}
        <AddColumnTile
          atCap={atColumnCap}
          colCount={colCount}
          max={MAX_BOARD_COLUMNS}
          onAdd={addColumn}
        />
      </div>

      {/* Link picker — modal */}
      {linkingTaskId && (
        <LinkBoardsPicker
          task={boardTasks.find(tk => tk.id === linkingTaskId)}
          boards={boards}
          statusOnBoard={statusOnBoard}
          activeBoardId={activeBoardId}
          onToggle={(boardId) => toggleLink(linkingTaskId, boardId)}
          onClose={() => setLinkingTaskId(null)}
        />
      )}

      {/* New board — modal */}
      {creating && (
        <NewBoardModal onClose={() => setCreating(false)} onCreate={onCreateBoard} />
      )}
    </div>
  );
}

function BoardTaskCard({ task, multiCount, dragging, onDragStart, onDragEnd, onDragOverCard, onDropCard, onLink, onRename }) {
  const pColors = { URGENT: "danger", HIGH: "orange", MEDIUM: "warning", LOW: "success" };
  const pBorder = {
    URGENT: "border-l-[hsl(0_84%_60%)]",
    HIGH:   "border-l-[hsl(20_90%_55%)]",
    MEDIUM: "border-l-[hsl(50_90%_55%)]",
    LOW:    "border-l-[hsl(142_70%_50%)]",
  };
  return (
    <div
      draggable
      onDragStart={(e) => { e.dataTransfer.effectAllowed = "move"; onDragStart?.(); }}
      onDragEnd={onDragEnd}
      onDragOver={onDragOverCard}
      onDrop={onDropCard}
      className={cn(
        "rounded-[8px] border border-[hsl(var(--border))] border-l-[3px] bg-[hsl(var(--card))] p-3 cursor-grab active:cursor-grabbing transition-all",
        "hover:border-[hsl(var(--primary)/0.4)] hover:shadow-md hover:shadow-black/20",
        pBorder[task.p],
        task.active && !dragging && "ring-1 ring-[hsl(var(--primary)/0.5)]",
        dragging && "opacity-50 rotate-[1deg] shadow-2xl shadow-[hsl(var(--primary)/0.35)] ring-2 ring-[hsl(var(--primary)/0.6)] scale-[1.02]"
      )}
    >
      <div className="flex items-start gap-2 mb-2">
        <div className="flex-1 text-[13px] font-medium leading-snug line-clamp-2">
          <EditableTitle value={task.title} onCommit={onRename} multiline />
        </div>
        <button onClick={onLink} title="Link to boards" className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] flex-shrink-0 w-6 h-6 rounded hover:bg-[hsl(var(--accent))] flex items-center justify-center">
          <Icons.More size={13} />
        </button>
      </div>
      <div className="flex flex-wrap items-center gap-1.5 mb-2">
        <Badge variant={pColors[task.p]} dot className="text-[10px]">{task.p}</Badge>
        <Badge variant="muted" className="text-[10px]"><Icons.Clock size={10}/> {task.d}</Badge>
      </div>
      <div className="flex items-center justify-between text-[10.5px] text-[hsl(var(--muted-foreground))]">
        <span className="flex items-center gap-1"><Icons.Calendar size={10}/>{task.date}</span>
        <div className="flex items-center gap-1.5">
          {task.tags && task.tags.length > 0 && (
            <span className="truncate">#{task.tags[0]}{task.tags.length > 1 ? ` +${task.tags.length-1}` : ""}</span>
          )}
          {multiCount > 1 && (
            <button
              onClick={onLink}
              title={`On ${multiCount} boards — click to manage`}
              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[hsl(var(--primary)/0.15)] text-[hsl(263_70%_80%)] text-[10px] font-mono tabular-nums hover:bg-[hsl(var(--primary)/0.25)]"
            >
              <Icons.Layout size={9} /> {multiCount}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function LinkBoardsPicker({ task, boards, statusOnBoard, activeBoardId, onToggle, onClose }) {
  useEffect(() => {
    const h = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);
  const STATUS_LABEL = { todo: "To do", doing: "In progress", done: "Done" };
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 anim-fade-in"
      style={{ backdropFilter: "blur(6px)", background: "rgba(0,0,0,0.55)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-md rounded-[14px] border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-2xl anim-scale-in flex flex-col max-h-[80vh] overflow-hidden">
        <div className="px-5 pt-5 pb-3 flex items-start justify-between">
          <div className="min-w-0">
            <div className="text-[10.5px] uppercase tracking-[0.1em] font-semibold text-[hsl(var(--muted-foreground))] mb-1">Link to boards</div>
            <h2 className="text-[17px] font-bold tracking-tight leading-snug">{task.title}</h2>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-md hover:bg-[hsl(var(--accent))] flex items-center justify-center text-[hsl(var(--muted-foreground))] -mr-1">
            <Icons.X size={15} />
          </button>
        </div>
        <div className="px-5 pb-2 text-[11.5px] text-[hsl(var(--muted-foreground))] leading-relaxed">
          The task appears on the checked boards. <span className="text-[hsl(var(--foreground))] font-medium">Status is per-board</span> (it can be “In progress” on one and “Done” on another).
        </div>
        <div className="px-3 py-2 space-y-1 overflow-y-auto flex-1">
          {boards.map(b => {
            const linkedStatus = statusOnBoard(task.id, b.id);
            const linked = !!linkedStatus;
            return (
              <label
                key={b.id}
                className={cn(
                  "flex items-center gap-3 px-2.5 py-2.5 rounded-[8px] cursor-pointer transition-colors",
                  linked ? "bg-[hsl(var(--primary)/0.08)]" : "hover:bg-[hsl(var(--accent)/0.5)]"
                )}
              >
                <Checkbox checked={linked} onChange={() => onToggle(b.id)} />
                <span
                  className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                  style={{ background: `hsl(${b.color})` }}
                />
                <b.icon size={14} className="text-[hsl(var(--muted-foreground))]" />
                <span className="flex-1 text-[13px] font-medium truncate">{b.name}</span>
                {linked && (
                  <Badge variant={linkedStatus === "done" ? "success" : linkedStatus === "doing" ? "primary" : "muted"} dot className="text-[10px]">
                    {STATUS_LABEL[linkedStatus]}
                  </Badge>
                )}
                {b.id === activeBoardId && (
                  <span className="text-[10px] text-[hsl(var(--muted-foreground))]">actif</span>
                )}
              </label>
            );
          })}
        </div>
        <div className="px-5 py-3.5 border-t border-[hsl(var(--border))] flex items-center justify-end gap-2 bg-[hsl(var(--background)/0.4)]">
          <Button size="sm" onClick={onClose}>Done</Button>
        </div>
      </div>
    </div>
  );
}

function ColumnCountBadge({ count, max }) {
  const ratio = count / max;
  const tone = ratio >= 1 ? "danger" : ratio >= 0.83 ? "warning" : "muted";
  return (
    <div
      title={`${count} column${count > 1 ? "s" : ""} of ${max} max — beyond that, the board becomes unreadable`}
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-1 rounded-full border text-[11px] font-mono tabular-nums",
        tone === "danger"  && "border-[hsl(0_84%_60%/0.5)]  bg-[hsl(0_84%_60%/0.1)]  text-[hsl(0_84%_70%)]",
        tone === "warning" && "border-[hsl(38_92%_55%/0.5)] bg-[hsl(38_92%_55%/0.1)] text-[hsl(38_92%_60%)]",
        tone === "muted"   && "border-[hsl(var(--border))]  bg-[hsl(var(--muted)/0.3)] text-[hsl(var(--muted-foreground))]"
      )}
    >
      <Icons.Layout size={10} />
      <span><span className="font-semibold">{count}</span> / {max} colonnes</span>
    </div>
  );
}

/* Add-column tile — sits at the end of the column row. Two states:
   - empty: a button "+ Ajouter une colonne"
   - typing: inline field + Enter to confirm
   At the cap: visually disabled with a clear message + tooltip explaining why. */
function AddColumnTile({ atCap, colCount, max, onAdd }) {
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const inputRef = useRef(null);
  useEffect(() => {
    if (adding) requestAnimationFrame(() => inputRef.current?.focus());
  }, [adding]);

  if (atCap) {
    return (
      <div
        title="Maximum reached — delete a column to add another"
        style={{ flex: "1 1 280px", minWidth: 280, maxWidth: 360 }}
        className="rounded-[12px] border border-dashed border-[hsl(38_92%_55%/0.4)] bg-[hsl(38_92%_55%/0.05)] flex flex-col items-center justify-center p-6 text-center"
      >
        <Icons.AlertTriangle size={20} className="text-[hsl(38_92%_60%)] mb-2" />
        <div className="text-[12.5px] font-semibold text-[hsl(38_92%_70%)]">Limit reached</div>
        <div className="text-[11px] text-[hsl(var(--muted-foreground))] mt-1 leading-snug max-w-[200px]">
          Maximum <span className="font-mono tabular-nums font-semibold">{max} columns</span> per board to avoid overload. Delete one before creating another.
        </div>
      </div>
    );
  }

  if (!adding) {
    return (
      <button
        type="button"
        onClick={() => setAdding(true)}
        style={{ flex: "0 0 220px", minWidth: 220 }}
        className="rounded-[12px] border border-dashed border-[hsl(var(--border))] bg-transparent hover:border-[hsl(var(--primary)/0.5)] hover:bg-[hsl(var(--primary)/0.04)] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] flex flex-col items-center justify-center p-6 transition-all min-h-[140px]"
      >
        <Icons.Plus size={18} className="mb-1.5" />
        <span className="text-[12.5px] font-medium">Add a column</span>
        <span className="text-[10.5px] mt-1 text-[hsl(var(--muted-foreground))] font-mono tabular-nums">
          {colCount}/{max} · reste {max - colCount}
        </span>
      </button>
    );
  }

  return (
    <div
      style={{ flex: "0 0 260px", minWidth: 260 }}
      className="rounded-[12px] border border-[hsl(var(--primary)/0.5)] bg-[hsl(var(--primary)/0.04)] flex flex-col p-3 gap-2"
    >
      <input
        ref={inputRef}
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") { e.preventDefault(); if (name.trim()) { onAdd(name); setName(""); setAdding(false); } }
          else if (e.key === "Escape") { setAdding(false); setName(""); }
        }}
        placeholder="Column name…"
        className="w-full h-9 px-3 rounded-[8px] border border-[hsl(var(--input))] bg-[hsl(var(--background))] text-[13px] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
      />
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={() => { setAdding(false); setName(""); }}
          className="text-[11.5px] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
        >
          Cancel
        </button>
        <Button
          size="sm"
          icon={Icons.Plus}
          disabled={!name.trim()}
          onClick={() => { onAdd(name); setName(""); setAdding(false); }}
        >
          Create
        </Button>
      </div>
      <div className="text-[10.5px] text-[hsl(var(--muted-foreground))] font-mono tabular-nums">
        Enter to confirm · Esc to cancel · {colCount + 1}/{max} after creation
      </div>
    </div>
  );
}

function NewBoardModal({ onClose, onCreate }) {
  const [name, setName] = useState("");
  const [color, setColor] = useState("263 70% 60%");
  const [templateId, setTemplateId] = useState("blank");
  const inputRef = useRef(null);
  const palette = [
    "263 70% 60%", "20 90% 55%", "330 80% 60%", "142 70% 50%",
    "217 91% 60%", "50 90% 55%", "0 84% 60%", "180 65% 50%",
  ];
  useEffect(() => {
    const h = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    setTimeout(() => inputRef.current?.focus(), 50);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);
  const selectedTemplate = BOARD_TEMPLATES.find(t => t.id === templateId) || BOARD_TEMPLATES[0];
  const submit = (e) => {
    e?.preventDefault?.();
    if (!name.trim()) return;
    onCreate(name.trim(), color, selectedTemplate);
  };

  // When user picks a template, prefill name + color from it (only if user hasn't typed yet)
  const pickTemplate = (tpl) => {
    setTemplateId(tpl.id);
    setColor(tpl.color);
    if (!name.trim() && tpl.id !== "blank") setName(tpl.name);
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 anim-fade-in"
      style={{ backdropFilter: "blur(6px)", background: "rgba(0,0,0,0.55)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <form onSubmit={submit} className="w-full max-w-2xl rounded-[14px] border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-2xl anim-scale-in overflow-hidden flex flex-col" style={{ maxHeight: "90vh" }}>
        <div className="px-5 pt-5 pb-3 flex items-start justify-between">
          <div>
            <h2 className="text-[18px] font-bold tracking-tight">New board</h2>
            <p className="text-[11.5px] text-[hsl(var(--muted-foreground))] mt-1">Start from a template or create a blank board.</p>
          </div>
          <button type="button" onClick={onClose} className="w-7 h-7 rounded-md hover:bg-[hsl(var(--accent))] flex items-center justify-center text-[hsl(var(--muted-foreground))] -mr-1">
            <Icons.X size={15} />
          </button>
        </div>

        <div className="px-5 pb-4 space-y-4 overflow-y-auto">
          {/* Templates */}
          <div>
            <label className="block text-[12.5px] font-medium mb-2">Template</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {BOARD_TEMPLATES.map(tpl => {
                const active = templateId === tpl.id;
                return (
                  <button
                    type="button"
                    key={tpl.id}
                    onClick={() => pickTemplate(tpl)}
                    style={active ? { borderColor: `hsl(${color} / 0.7)`, background: `hsl(${color} / 0.07)`, boxShadow: `0 0 0 1px hsl(${color} / 0.35)` } : undefined}
                    className={cn(
                      "text-left rounded-[10px] border p-3 transition-all",
                      active
                        ? ""
                        : "border-[hsl(var(--border))] hover:border-[hsl(var(--primary)/0.4)] hover:bg-[hsl(var(--accent)/0.4)]"
                    )}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="w-8 h-8 rounded-[8px] flex items-center justify-center flex-shrink-0" style={{ background: `hsl(${active ? color : tpl.color} / 0.15)`, color: `hsl(${active ? color : tpl.color})` }}>
                        <tpl.icon size={14} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[13px] font-semibold">{tpl.name}</span>
                          {active && <Icons.Check size={11} style={{ color: `hsl(${color})` }} />}
                        </div>
                        <div className="text-[11px] text-[hsl(var(--muted-foreground))] mt-0.5 leading-snug">{tpl.desc}</div>
                      </div>
                    </div>
                    <div className="mt-2.5 flex items-center gap-1 flex-wrap">
                      {tpl.columns.map(c => (
                        <span key={c.id} className="px-1.5 py-0.5 rounded-[5px] text-[10px] font-medium bg-[hsl(var(--muted)/0.5)] text-[hsl(var(--muted-foreground))]">
                          {c.t}
                        </span>
                      ))}
                    </div>
                    <div className="mt-2 text-[10px] font-mono tabular-nums text-[hsl(var(--muted-foreground))]">
                      {tpl.columns.length} column{tpl.columns.length > 1 ? "s" : ""} · {MAX_BOARD_COLUMNS - tpl.columns.length} before the limit
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-[12.5px] font-medium mb-1.5">Board name</label>
            <input
              ref={inputRef}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex. Recherche d'appartement"
              className="w-full h-10 px-3 rounded-[8px] border border-[hsl(var(--input))] bg-[hsl(var(--background))] text-[13px] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
            />
          </div>
          <div>
            <label className="block text-[12.5px] font-medium mb-1.5">Color</label>
            <SwatchPicker value={color} onChange={setColor} palette={palette} ring="primary" />
          </div>
        </div>

        <div className="px-5 py-3.5 border-t border-[hsl(var(--border))] flex items-center justify-between gap-2 bg-[hsl(var(--background)/0.4)]">
          <div className="text-[11px] text-[hsl(var(--muted-foreground))] flex items-center gap-1.5">
            <Icons.Layout size={11} />
            <span className="font-mono tabular-nums">{selectedTemplate.columns.length}/{MAX_BOARD_COLUMNS} columns</span> at creation
          </div>
          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>Cancel</Button>
            <Button type="submit" size="sm" disabled={!name.trim()} icon={Icons.Plus}>Create board</Button>
          </div>
        </div>
      </form>
    </div>
  );
}

function TaskCard({ task }) {
  const pColors = { URGENT: "danger", HIGH: "orange", MEDIUM: "warning", LOW: "success" };
  const pBorder = {
    URGENT: "border-l-[hsl(0_84%_60%)]",
    HIGH:   "border-l-[hsl(20_90%_55%)]",
    MEDIUM: "border-l-[hsl(50_90%_55%)]",
    LOW:    "border-l-[hsl(142_70%_50%)]",
  };
  return (
    <div className={cn(
      "rounded-[8px] border border-[hsl(var(--border))] border-l-[3px] bg-[hsl(var(--card))] p-3 cursor-grab hover:border-[hsl(var(--primary)/0.4)] transition-all",
      pBorder[task.p],
      task.active && "ring-1 ring-[hsl(var(--primary)/0.5)]"
    )}>
      <div className="flex items-start gap-2 mb-2">
        <div className="flex-1 text-[13px] font-medium leading-snug line-clamp-2">{task.t}</div>
        <button className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] flex-shrink-0">
          <Icons.More size={14} />
        </button>
      </div>
      <div className="flex flex-wrap items-center gap-1.5 mb-2">
        <Badge variant={pColors[task.p]} dot className="text-[10px]">{task.p}</Badge>
        <Badge variant="muted" className="text-[10px]"><Icons.Clock size={10}/> {task.d}</Badge>
        {task.energy && <Badge variant="primary" className="text-[10px]"><Icons.Zap size={10}/> {task.energy}</Badge>}
      </div>
      {task.subs && (
        <div className="mb-2">
          <div className="flex items-center justify-between text-[10.5px] text-[hsl(var(--muted-foreground))] mb-1">
            <span>Subtasks</span>
            <span className="tabular-nums">{task.subs.done}/{task.subs.total}</span>
          </div>
          <ProgressBar value={task.subs.done} max={task.subs.total} height="h-1" />
        </div>
      )}
      <div className="flex items-center justify-between text-[10.5px] text-[hsl(var(--muted-foreground))]">
        <span className="flex items-center gap-1"><Icons.Calendar size={10}/>{task.date}</span>
        {task.tags && task.tags.length > 0 && (
          <span className="truncate">#{task.tags[0]}{task.tags.length > 1 ? ` +${task.tags.length-1}` : ""}</span>
        )}
      </div>
    </div>
  );
}

/* Compact create/edit dialog for a list task. Freeform duration + due-date
   text to match the mockup's data style ("2h", "Tomorrow"). */
function TaskListEditModal({ open, mode, initial, onClose, onSave }) {
  const t = useT();
  const [title, setTitle] = useState("");
  const [prio, setPrio] = useState("MEDIUM");
  const [dur, setDur] = useState("");
  const [date, setDate] = useState("");
  useEffect(() => {
    if (open) {
      setTitle(initial?.t || "");
      setPrio(initial?.p || "MEDIUM");
      setDur(initial?.d || "");
      setDate(initial?.date || "");
    }
  }, [open, initial]);
  const PRIOS = [
    { v: "URGENT", c: "0 84% 60%" },
    { v: "HIGH",   c: "20 90% 55%" },
    { v: "MEDIUM", c: "50 90% 55%" },
    { v: "LOW",    c: "142 70% 50%" },
  ];
  const submit = (e) => {
    e?.preventDefault?.();
    if (!title.trim()) return;
    onSave({ t: title.trim(), p: prio, d: dur.trim() || "—", date: date.trim() || "—" });
    onClose();
  };
  return (
    <Modal open={open} onClose={onClose} size="sm">
      <form onSubmit={submit}>
        <ModalHeader title={mode === "edit" ? "Edit task" : "New task"} onClose={onClose} />
        <ModalBody className="space-y-4">
          <FieldRow icon={Icons.CheckSquare} label="Task">
            <Input autoFocus value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Finaliser proposition client" />
          </FieldRow>
          <FieldRow icon={Icons.Star} label={t("common.priority")}>
            <div className="flex items-center gap-1.5 flex-wrap">
              {PRIOS.map(p => (
                <button
                  key={p.v}
                  type="button"
                  onClick={() => setPrio(p.v)}
                  className={cn(
                    "h-8 px-3 rounded-[8px] text-[11.5px] font-semibold flex items-center gap-1.5 transition-all border",
                    prio === p.v
                      ? "border-transparent text-white"
                      : "border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))]"
                  )}
                  style={prio === p.v ? { background: `hsl(${p.c})` } : undefined}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: prio === p.v ? "rgba(255,255,255,0.9)" : `hsl(${p.c})` }} />
                  {p.v}
                </button>
              ))}
            </div>
          </FieldRow>
          <div className="grid grid-cols-2 gap-3">
            <FieldRow icon={Icons.Clock} label={t("common.duration")}>
              <Input value={dur} onChange={(e) => setDur(e.target.value)} placeholder="e.g. 2h, 30min" />
            </FieldRow>
            <FieldRow icon={Icons.Calendar} label="Due date">
              <Input value={date} onChange={(e) => setDate(e.target.value)} placeholder="e.g. Tomorrow, Friday" />
            </FieldRow>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button type="button" variant="outline" size="sm" onClick={onClose}>{t("common.cancel") || "Cancel"}</Button>
          <Button type="submit" size="sm" disabled={!title.trim()} icon={mode === "edit" ? Icons.Check : Icons.Plus}>
            {mode === "edit" ? "Save" : "Create"}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}

/* Row ⋯ menu — Edit / Duplicate / Delete. Closes on outside click. */
function TaskRowMenu({ onEdit, onDuplicate, onDelete, onClose }) {
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    const k = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("mousedown", h);
    document.addEventListener("keydown", k);
    return () => { document.removeEventListener("mousedown", h); document.removeEventListener("keydown", k); };
  }, [onClose]);
  return (
    <div
      ref={ref}
      role="menu"
      onClick={(e) => e.stopPropagation()}
      className="absolute right-0 top-full mt-1 w-40 rounded-[10px] border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-xl z-40 anim-fade-in py-1"
    >
      <MenuItem icon={Icons.Edit} onClick={onEdit}>Edit…</MenuItem>
      <MenuItem icon={Icons.Copy} onClick={onDuplicate}>Duplicate</MenuItem>
      <div className="my-1 border-t border-[hsl(var(--border))]" />
      <MenuItem icon={Icons.Trash} danger onClick={onDelete}>Delete</MenuItem>
    </div>
  );
}

function TaskList({ search = "", filters = EMPTY_TASK_FILTER, createSignal = 0 }) {
  const t = useT();
  const pColors = { URGENT: "danger", HIGH: "orange", MEDIUM: "warning", LOW: "success" };
  const initial = [...TASK_DATA.doing, ...TASK_DATA.todo].map((r, i) => ({ ...r, id: "tl" + i, done: false }));
  const [rows, setRows] = useState(initial);
  const [menuId, setMenuId] = useState(null);
  const [editor, setEditor] = useState(null); // { mode, task } | null

  // Open the create modal when the page-level "+ Task" button fires.
  // Guard against firing on (re)mount — only when the signal actually changes.
  const prevCreateSignal = useRef(createSignal);
  useEffect(() => {
    if (createSignal !== prevCreateSignal.current) {
      prevCreateSignal.current = createSignal;
      if (createSignal > 0) setEditor({ mode: "create", task: null });
    }
  }, [createSignal]);

  // Drag-reorder state (operates on row ids so it survives filtering)
  const [dragId, setDragId] = useState(null);
  const [over, setOver] = useState(null); // { id, place: "before"|"after" }
  const idSeq = useRef(initial.length);
  const newId = () => "tl" + (++idSeq.current) + "-" + Date.now().toString(36);

  const f = filters || EMPTY_TASK_FILTER;
  const anyFilter = f.prio !== "all" || f.status !== "all" || (f.tags && f.tags.length > 0) || f.due !== "all";
  const canReorder = !anyFilter && !search.trim();

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter(r => {
      if (q && !r.t.toLowerCase().includes(q)) return false;
      if (!matchTaskFilter(r, f)) return false;
      if (f.status === "active" && r.done) return false;
      if (f.status === "completed" && !r.done) return false;
      return true;
    });
  }, [rows, search, f]);

  const setRowTitle = (id, next) => setRows(arr => arr.map(r => r.id === id ? { ...r, t: next } : r));
  const toggleDone = (id) => setRows(arr => arr.map(r => r.id === id ? { ...r, done: !r.done } : r));
  const removeRow = (id) => setRows(arr => arr.filter(r => r.id !== id));
  const duplicateRow = (id) => setRows(arr => {
    const i = arr.findIndex(r => r.id === id);
    if (i < 0) return arr;
    const copy = { ...arr[i], id: newId(), t: arr[i].t + " (copy)", done: false };
    const next = arr.slice();
    next.splice(i + 1, 0, copy);
    return next;
  });
  const saveEditor = (data) => {
    if (editor?.mode === "edit") {
      setRows(arr => arr.map(r => r.id === editor.task.id ? { ...r, ...data } : r));
    } else {
      setRows(arr => [{ ...data, id: newId(), done: false }, ...arr]);
    }
  };

  const moveRow = (fromId, targetId, place) => {
    if (!fromId || fromId === targetId) return;
    setRows(arr => {
      const from = arr.findIndex(r => r.id === fromId);
      if (from < 0) return arr;
      const next = arr.slice();
      const [item] = next.splice(from, 1);
      let to = next.findIndex(r => r.id === targetId);
      if (to < 0) return arr;
      if (place === "after") to += 1;
      next.splice(to, 0, item);
      return next;
    });
  };

  const onRowDragOver = (id) => (e) => {
    if (!canReorder || !dragId) return;
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const place = e.clientY - rect.top < rect.height / 2 ? "before" : "after";
    setOver(o => (o && o.id === id && o.place === place) ? o : { id, place });
  };
  const onRowDrop = (id) => (e) => {
    if (!canReorder || !dragId) return;
    e.preventDefault();
    const place = over?.id === id ? over.place : "before";
    moveRow(dragId, id, place);
    setDragId(null); setOver(null);
  };
  const endDrag = () => { setDragId(null); setOver(null); };

  const COLS = "grid grid-cols-[20px_24px_1fr_120px_80px_96px_140px_40px] gap-3";
  const focusMap = (typeof window !== "undefined" && window.useFocusTime) ? window.useFocusTime()[0] : {};
  const fmtFT = window.fmtFocusTime || ((s) => "");
  const nT = window.normTitle || ((s) => String(s || "").trim().toLowerCase());

  return (
    <Card padding="p-0">
      <div className={cn(COLS, "px-4 py-3 border-b border-[hsl(var(--border))] text-[10.5px] uppercase tracking-wider font-semibold text-[hsl(var(--muted-foreground))]")}>
        <div></div>
        <div></div>
        <div>Task</div>
        <div>{t("common.priority")}</div>
        <div>{t("common.duration")}</div>
        <div title="Time spent in Focus">Focus</div>
        <div>Due date</div>
        <div></div>
      </div>

      <div className="divide-y divide-[hsl(var(--border))]">
        {filtered.length === 0 && (
          <div className="p-10 text-center">
            <div className="text-[12.5px] text-[hsl(var(--muted-foreground))] mb-3">
              {rows.length === 0 ? "No tasks yet." : "No task matches."}
            </div>
            {rows.length === 0 && (
              <Button size="sm" icon={Icons.Plus} onClick={() => setEditor({ mode: "create", task: null })}>Create your first task</Button>
            )}
          </div>
        )}
        {filtered.map(r => {
          const isOver = over && over.id === r.id && dragId && dragId !== r.id;
          return (
            <div
              key={r.id}
              draggable={canReorder}
              onDragStart={(e) => { if (!canReorder) return; setDragId(r.id); e.dataTransfer.effectAllowed = "move"; }}
              onDragOver={onRowDragOver(r.id)}
              onDrop={onRowDrop(r.id)}
              onDragEnd={endDrag}
              className={cn(
                COLS,
                "group px-4 py-3 items-center transition-colors text-[13px] relative",
                dragId === r.id ? "opacity-40" : "hover:bg-[hsl(var(--accent)/0.3)]"
              )}
              style={isOver ? {
                boxShadow: over.place === "before"
                  ? "inset 0 2px 0 0 hsl(var(--primary))"
                  : "inset 0 -2px 0 0 hsl(var(--primary))"
              } : undefined}
            >
              {/* Drag handle */}
              <div
                className={cn(
                  "flex items-center justify-center -ml-1 transition-opacity",
                  canReorder ? "cursor-grab active:cursor-grabbing text-[hsl(var(--muted-foreground))] opacity-0 group-hover:opacity-100" : "opacity-0 pointer-events-none"
                )}
                title={canReorder ? "Drag to reorder" : "Clear search/filter to reorder"}
              >
                <Icons.Drag size={14} />
              </div>

              <Checkbox checked={r.done} onChange={() => toggleDone(r.id)} />

              <div className={cn("font-medium truncate", r.done && "line-through text-[hsl(var(--muted-foreground))]")}>
                <EditableTitle value={r.t} onCommit={(next) => setRowTitle(r.id, next)} />
              </div>
              <div><Badge variant={pColors[r.p]} dot>{r.p}</Badge></div>
              <div className="text-[hsl(var(--muted-foreground))] font-mono tabular-nums">{r.d}</div>
              <div className="font-mono tabular-nums">
                {(() => {
                  const ft = focusMap[nT(r.t)] || 0;
                  return ft
                    ? <span className="inline-flex items-center gap-1 text-[hsl(263_70%_72%)]" title="Time spent in Focus"><Icons.Target size={11} />{fmtFT(ft)}</span>
                    : <span className="text-[hsl(var(--muted-foreground))] opacity-40">—</span>;
                })()}
              </div>
              <div className="text-[hsl(var(--muted-foreground))]">{r.date}</div>

              <div className="relative justify-self-end">
                <button
                  onClick={() => setMenuId(m => m === r.id ? null : r.id)}
                  className={cn(
                    "w-7 h-7 rounded-md flex items-center justify-center transition-colors",
                    menuId === r.id ? "bg-[hsl(var(--accent))] text-[hsl(var(--foreground))]" : "text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--foreground))]"
                  )}
                  aria-label="Task actions"
                >
                  <Icons.More size={14} />
                </button>
                {menuId === r.id && (
                  <TaskRowMenu
                    onEdit={() => { setMenuId(null); setEditor({ mode: "edit", task: r }); }}
                    onDuplicate={() => { setMenuId(null); duplicateRow(r.id); }}
                    onDelete={() => { setMenuId(null); removeRow(r.id); }}
                    onClose={() => setMenuId(null)}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="px-4 py-2.5 border-t border-[hsl(var(--border))] flex items-center justify-between text-[11px] text-[hsl(var(--muted-foreground))]">
        <span className="tabular-nums">{filtered.length} task{filtered.length !== 1 ? "s" : ""}{filtered.filter(r => r.done).length > 0 ? ` · ${filtered.filter(r => r.done).length} done` : ""}</span>
        <span className="flex items-center gap-1.5 italic">
          <Icons.Drag size={11} />
          {canReorder ? "Drag rows to reorder · double-click a title to rename" : "Clear search & filter to reorder"}
        </span>
      </div>

      <TaskListEditModal
        open={!!editor}
        mode={editor?.mode}
        initial={editor?.task}
        onClose={() => setEditor(null)}
        onSave={saveEditor}
      />
    </Card>
  );
}

function TaskGantt() {
  const items = [
    { t: "Refactor auth", s: 0, w: 4, c: "263 70% 60%" },
    { t: "Maquette login", s: 1, w: 2, c: "330 80% 60%" },
    { t: "Proposition Desjardins", s: 2, w: 3, c: "0 84% 60%" },
    { t: "Q2 presentation", s: 3, w: 5, c: "38 92% 55%" },
    { t: "Doc API", s: 6, w: 4, c: "142 70% 50%" },
    { t: "Sprint planning", s: 7, w: 1, c: "217 91% 60%" },
  ];
  return (
    <Card>
      <SectionTitle>10-day schedule</SectionTitle>
      <div className="grid grid-cols-[180px_1fr] gap-2">
        <div className="text-[10.5px] text-[hsl(var(--muted-foreground))] uppercase tracking-wider font-semibold pb-2">Task</div>
        <div className="grid grid-cols-10 gap-px text-center text-[10.5px] text-[hsl(var(--muted-foreground))] tabular-nums pb-2">
          {Array.from({ length: 10 }, (_, i) => 24 + i).map(n => <div key={n}>{n > 31 ? n - 31 : n}</div>)}
        </div>
        {items.map((it, i) => (
          <React.Fragment key={i}>
            <div className="text-[12.5px] font-medium pt-2 pr-2">{it.t}</div>
            <div className="relative h-9">
              <div className="grid grid-cols-10 gap-px h-full">
                {Array.from({ length: 10 }, (_, j) => (
                  <div key={j} className={cn("h-full", j === 0 ? "bg-[hsl(var(--primary)/0.06)]" : "bg-[hsl(var(--muted)/0.2)]")} />
                ))}
              </div>
              <div className="absolute top-2 h-5 rounded-[5px] text-[10px] text-white font-medium flex items-center px-2 truncate" style={{
                left: `${(it.s / 10) * 100}%`, width: `${(it.w / 10) * 100}%`, background: `hsl(${it.c})`
              }}>{it.t}</div>
            </div>
          </React.Fragment>
        ))}
      </div>
    </Card>
  );
}

function TaskCalendar() {
  return <MonthView />;
}

function TaskStats() {
  const t = useT();
  // Synthesize stats from TASK_DATA (the mockup constant)
  const ALL = [...TASK_DATA.todo, ...TASK_DATA.doing, ...TASK_DATA.done, ...TASK_DATA.cancel];
  const total = ALL.length;
  const done = TASK_DATA.done.length;
  const overdue = 2; // mocked
  const byPriority = { URGENT: 0, HIGH: 0, MEDIUM: 0, LOW: 0 };
  for (const r of ALL) byPriority[r.p] = (byPriority[r.p] || 0) + 1;
  const tagCounts = {};
  for (const r of ALL) (r.tags || []).forEach(tag => { tagCounts[tag] = (tagCounts[tag] || 0) + 1; });
  const topTags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]).slice(0, 6);

  // Bucketize durations
  const buckets = { "<15min": 0, "15-30min": 0, "30-60min": 0, "1-2h": 0, ">2h": 0 };
  for (const r of ALL) {
    const m = parseDurationMin(r.d);
    if (m < 15) buckets["<15min"]++;
    else if (m < 30) buckets["15-30min"]++;
    else if (m < 60) buckets["30-60min"]++;
    else if (m < 120) buckets["1-2h"]++;
    else buckets[">2h"]++;
  }
  const maxBucket = Math.max(1, ...Object.values(buckets));

  // Weekly trend (mocked, 7 days)
  const weekly = [3, 4, 2, 5, 4, 6, 4];
  const dayLabels = ["L", "M", "M", "J", "V", "S", "D"];
  const maxWeekly = Math.max(...weekly);

  return (
    <div className="space-y-4">
      {/* Top KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { l: "Total",    v: total,   icon: Icons.CheckSquare, c: "primary" },
          { l: t("tasks.stats.completed"), v: `${done}/${total}`, icon: Icons.Check, c: "success" },
          { l: t("tasks.stats.completionRate"), v: Math.round(done / Math.max(1, total) * 100) + "%", icon: Icons.Activity, c: "info" },
          { l: t("tasks.stats.overdue"), v: overdue, icon: Icons.AlertTriangle, c: "warning" },
        ].map(s => (
          <Card key={s.l} padding="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-[hsl(var(--muted-foreground))]">{s.l}</span>
              <s.icon size={14} className={cn(
                s.c === "primary" && "text-[hsl(var(--primary))]",
                s.c === "success" && "text-[hsl(142_70%_55%)]",
                s.c === "info" && "text-[hsl(217_91%_70%)]",
                s.c === "warning" && "text-[hsl(38_92%_60%)]",
              )} />
            </div>
            <div className="text-[24px] font-bold tabular-nums">{s.v}</div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <SectionTitle>{t("tasks.stats.byPriority")}</SectionTitle>
          <div className="space-y-3">
            {[
              { p: "URGENT", c: "danger" },
              { p: "HIGH",   c: "orange" },
              { p: "MEDIUM", c: "warning" },
              { p: "LOW",    c: "success" },
            ].map(s => (
              <div key={s.p}>
                <div className="flex justify-between text-[12px] mb-1.5">
                  <span>{s.p}</span>
                  <span className="tabular-nums text-[hsl(var(--muted-foreground))]">{byPriority[s.p]}</span>
                </div>
                <ProgressBar value={byPriority[s.p]} max={total || 1} color={s.c} height="h-2" />
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <SectionTitle>{t("tasks.stats.byDuration")}</SectionTitle>
          <div className="space-y-2">
            {Object.entries(buckets).map(([k, v]) => (
              <div key={k} className="flex items-center gap-3">
                <span className="text-[11.5px] w-20 font-mono tabular-nums text-[hsl(var(--muted-foreground))]">{k}</span>
                <div className="flex-1 h-2.5 rounded-full bg-[hsl(var(--muted))] overflow-hidden">
                  <div className="h-full rounded-full transition-all bg-[hsl(var(--primary))]" style={{ width: `${(v / maxBucket) * 100}%` }} />
                </div>
                <span className="text-[11.5px] tabular-nums w-5 text-right text-[hsl(var(--muted-foreground))]">{v}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <SectionTitle>{t("tasks.stats.thisWeek")}</SectionTitle>
          <div className="flex items-end gap-1 h-24">
            {weekly.map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center justify-end gap-1.5">
                <div className="w-full bg-[hsl(var(--primary))] rounded-t-md transition-all" style={{ height: `${(v / maxWeekly) * 80}px` }} title={`${v} tasks`} />
                <span className="text-[10px] font-mono text-[hsl(var(--muted-foreground))]">{dayLabels[i]}</span>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-[hsl(142_70%_60%)] mt-3">+3 vs previous week</p>
        </Card>

        <Card className="md:col-span-2">
          <SectionTitle>{t("tasks.stats.byTag")}</SectionTitle>
          {topTags.length === 0 ? (
            <div className="text-[12px] text-[hsl(var(--muted-foreground))] italic py-6 text-center">No tags yet.</div>
          ) : (
            <div className="space-y-2">
              {topTags.map(([tag, count]) => (
                <div key={tag} className="flex items-center gap-3">
                  <span className="text-[12px] w-32 truncate">#{tag}</span>
                  <div className="flex-1">
                    <ProgressBar value={count} max={topTags[0][1]} color="primary" height="h-1.5" />
                  </div>
                  <span className="text-[11.5px] tabular-nums w-5 text-right text-[hsl(var(--muted-foreground))]">{count}</span>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <SectionTitle>{t("tasks.stats.energy")}</SectionTitle>
          <div className="space-y-2">
            {[
              { l: t("tasks.priority.high"),   v: 5, c: "danger" },
              { l: t("tasks.priority.medium"), v: 12, c: "warning" },
              { l: t("tasks.priority.low"),    v: 7, c: "success" },
            ].map(e => (
              <div key={e.l} className="flex items-center gap-3">
                <span className="text-[12px] w-16">{e.l}</span>
                <div className="flex-1"><ProgressBar value={e.v} max={24} color={e.c} height="h-1.5" /></div>
                <span className="text-[12px] text-[hsl(var(--muted-foreground))] tabular-nums">{e.v}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function parseDurationMin(d) {
  if (!d) return 0;
  const s = String(d).toLowerCase();
  if (s.includes("h")) {
    const [h, m] = s.split("h");
    return (parseInt(h, 10) || 0) * 60 + (parseInt(m, 10) || 0);
  }
  return parseInt(s, 10) || 0;
}

/* ============================================================
   PAGE 12 — MATRIX (/matrix) — Eisenhower
============================================================ */
function MatrixPage({ onOpenTask }) {
  const t = useT();
  const QUADRANT_META = [
    { id: "q1", t: t("matrix.q1"), subt: t("matrix.q1.sub"), color: "0 84% 60%",   icon: Icons.AlertTriangle, pos: "top-left" },
    { id: "q2", t: t("matrix.q2"), subt: t("matrix.q2.sub"), color: "217 91% 60%", icon: Icons.Target,        pos: "top-right" },
    { id: "q3", t: t("matrix.q3"), subt: t("matrix.q3.sub"), color: "38 92% 55%",  icon: Icons.Clock,         pos: "bottom-left" },
    { id: "q4", t: t("matrix.q4"), subt: t("matrix.q4.sub"), color: "215 15% 55%", icon: Icons.Trash,         pos: "bottom-right" },
  ];

  // Tasks held as a map { quadrantId: Task[] } so order is preserved
  // and we can move/reorder via drag-and-drop. Each task has a stable id.
  // `done` drives the checkbox; `assignees` (person ids) drives delegation.
  const [tasksByQuadrant, setTasksByQuadrant] = useState({
    q1: [
      { id: "t1", t: "Talk to Matis",               date: "Apr 18",      prio: "Urgent", done: false, assignees: [] },
      { id: "t2", t: "Critical production bug",     date: "Today", prio: "Urgent", done: false, assignees: [] },
    ],
    q2: [
      { id: "t3", t: "Learn Rust — sessions",       date: "Ongoing",       prio: "High", done: false, assignees: [] },
      { id: "t4", t: "Prep Q2 Board presentation", date: "Friday",     prio: "High", done: false, assignees: [] },
      { id: "t5", t: "Q3 team roadmap",             date: "Next wk",        prio: "Medium", done: false, assignees: [] },
    ],
    q3: [
      { id: "t6", t: "Reply to supplier emails", date: "Today", prio: "Medium", done: false, assignees: ["p2"] },
      { id: "t7", t: "Confirmer commande catering",  date: "Lundi",       prio: "Faible", done: false, assignees: [] },
    ],
    q4: [],
  });

  // People available for delegation (especially the "Delegate" quadrant).
  const TEAM = [
    { id: "p1", name: "Sarah Chen",   color: "263 70% 60%" },
    { id: "p2", name: "Marc Dubois",  color: "217 91% 60%" },
    { id: "p3", name: "Léa Martin",   color: "142 70% 50%" },
    { id: "p4", name: "Tom Roy",      color: "20 90% 55%" },
    { id: "p5", name: "Aïcha Benali", color: "330 80% 60%" },
  ];
  const personById = (id) => TEAM.find(p => p.id === id);
  const initials = (name) => name.split(/\s+/).map(w => w[0]).join("").slice(0, 2).toUpperCase();

  // Toggle a task's completion (checkbox).
  const toggleDone = (quad, taskId) => {
    setTasksByQuadrant(prev => ({
      ...prev,
      [quad]: prev[quad].map(x => x.id === taskId ? { ...x, done: !x.done } : x),
    }));
  };
  // Assign / unassign a person to a task (delegation).
  const toggleAssignee = (quad, taskId, personId) => {
    setTasksByQuadrant(prev => ({
      ...prev,
      [quad]: prev[quad].map(x => {
        if (x.id !== taskId) return x;
        const has = (x.assignees || []).includes(personId);
        return { ...x, assignees: has ? x.assignees.filter(p => p !== personId) : [...(x.assignees || []), personId] };
      }),
    }));
  };

  // UI state for the info popover and the assignee picker.
  const [infoOpen, setInfoOpen] = useState(false);
  const [assignPicker, setAssignPicker] = useState(null); // { quad, taskId, pos }

  // Drag state — { taskId, fromQuad } while a card is being dragged
  const [dragging, setDragging] = useState(null);
  const [hoverTarget, setHoverTarget] = useState(null); // { quad, index } where to insert

  const prioColor = {
    "Urgent": "0 84% 60%",
    "High":   "20 90% 55%",
    "Medium": "50 90% 55%",
    "Faible":  "142 70% 50%",
  };

  // Move task from (fromQuad, fromIdx) → (toQuad, toIdx).
  // If toIdx is null, append at end.
  const moveTask = (fromQuad, taskId, toQuad, toIdx) => {
    setTasksByQuadrant(prev => {
      const fromList = [...prev[fromQuad]];
      const fromIdx = fromList.findIndex(t => t.id === taskId);
      if (fromIdx === -1) return prev;
      const [task] = fromList.splice(fromIdx, 1);

      let toList;
      if (fromQuad === toQuad) {
        toList = fromList;
        let insertAt = toIdx == null ? toList.length : toIdx;
        // No-op? snap to end if dropped on itself's slot
        if (insertAt > toList.length) insertAt = toList.length;
        toList.splice(insertAt, 0, task);
        return { ...prev, [toQuad]: toList };
      } else {
        toList = [...prev[toQuad]];
        const insertAt = toIdx == null ? toList.length : Math.min(toIdx, toList.length);
        toList.splice(insertAt, 0, task);
        return { ...prev, [fromQuad]: fromList, [toQuad]: toList };
      }
    });
  };

  const onDragStartTask = (e, fromQuad, taskId) => {
    setDragging({ taskId, fromQuad });
    e.dataTransfer.effectAllowed = "move";
    // Required for Firefox
    try { e.dataTransfer.setData("text/plain", taskId); } catch {}
    // Mark the dragged element for opacity
    e.currentTarget.classList.add("matrix-dragging");
  };
  const onDragEndTask = (e) => {
    e.currentTarget.classList.remove("matrix-dragging");
    setDragging(null);
    setHoverTarget(null);
  };

  // Drop on a quadrant (empty area or end of list)
  const onDropQuadrant = (e, quad) => {
    e.preventDefault();
    if (!dragging) return;
    moveTask(dragging.fromQuad, dragging.taskId, quad, null);
    setDragging(null);
    setHoverTarget(null);
  };

  // Drop on a specific task → insert before it
  const onDropOnTask = (e, quad, idx) => {
    e.preventDefault();
    e.stopPropagation();
    if (!dragging) return;
    // If dropping a task on its own slot or the slot immediately after itself in
    // the same quadrant, do nothing.
    if (dragging.fromQuad === quad) {
      const fromIdx = tasksByQuadrant[quad].findIndex(t => t.id === dragging.taskId);
      if (fromIdx === idx || fromIdx === idx - 1) {
        setDragging(null);
        setHoverTarget(null);
        return;
      }
      // Adjust insertion index since we'll be removing fromIdx first
      const adjustedIdx = fromIdx < idx ? idx - 1 : idx;
      moveTask(quad, dragging.taskId, quad, adjustedIdx);
    } else {
      moveTask(dragging.fromQuad, dragging.taskId, quad, idx);
    }
    setDragging(null);
    setHoverTarget(null);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-[10px] bg-[hsl(var(--primary)/0.15)] text-[hsl(var(--primary))] flex items-center justify-center flex-shrink-0">
            <Icons.Grid size={20} />
          </div>
          <div>
            <h1 className="text-[24px] font-bold tracking-tight flex items-center gap-2">
              {t("matrix.title")}
              <span className="relative">
                <button
                  onClick={() => setInfoOpen(o => !o)}
                  title="En savoir plus — matrice urgence/importance"
                  className={cn("w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-bold transition-colors",
                    infoOpen ? "border-[hsl(var(--primary))] bg-[hsl(var(--primary)/0.15)] text-[hsl(var(--primary))]" : "border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))]")}>
                  i
                </button>
                {infoOpen && <MatrixInfoPopover meta={QUADRANT_META} onClose={() => setInfoOpen(false)} />}
              </span>
            </h1>
            <p className="text-[13px] text-[hsl(var(--muted-foreground))] mt-0.5">
              {t("matrix.subtitle")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ModuleTutorialButton module="matrix" />
          <Button onClick={onOpenTask} icon={Icons.Plus}>{t("matrix.newTask")}</Button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-4 relative" data-tour="feat-matrix-grid">
        {QUADRANT_META.map(q => {
          const tasks = tasksByQuadrant[q.id];
          const isDropTarget = dragging && hoverTarget?.quad === q.id;
          const isCrossQuadrant = dragging && dragging.fromQuad !== q.id;
          const gradient = {
            "top-left":     `linear-gradient(135deg, hsl(${q.color} / 0.12) 0%, hsl(${q.color} / 0.02) 50%, transparent 100%)`,
            "top-right":    `linear-gradient(225deg, hsl(${q.color} / 0.12) 0%, hsl(${q.color} / 0.02) 50%, transparent 100%)`,
            "bottom-left":  `linear-gradient(45deg,  hsl(${q.color} / 0.12) 0%, hsl(${q.color} / 0.02) 50%, transparent 100%)`,
            "bottom-right": `linear-gradient(315deg, hsl(${q.color} / 0.12) 0%, hsl(${q.color} / 0.02) 50%, transparent 100%)`,
          }[q.pos];

          return (
            <div key={q.id}
              data-tour={q.id === "q1" ? "feat-matrix-quadrant" : undefined}
              onDragOver={(e) => {
                if (!dragging) return;
                e.preventDefault();
                e.dataTransfer.dropEffect = "move";
                setHoverTarget({ quad: q.id, index: null });
              }}
              onDragLeave={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget)) {
                  if (hoverTarget?.quad === q.id) setHoverTarget(null);
                }
              }}
              onDrop={(e) => onDropQuadrant(e, q.id)}
              className={cn(
                "rounded-[14px] border bg-[hsl(var(--card))] min-h-[300px] flex flex-col overflow-hidden relative transition-all",
                isDropTarget && "ring-2 ring-offset-2 ring-offset-[hsl(var(--background))]"
              )}
              style={{
                borderColor: `hsl(${q.color} / ${isDropTarget ? 0.7 : 0.35})`,
                boxShadow: isDropTarget ? `0 0 0 3px hsl(${q.color} / 0.18)` : undefined,
              }}
            >
              <div className="absolute inset-0 pointer-events-none" style={{ background: gradient }} />
              <div className="relative px-5 pt-5 pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-2">
                    <q.icon size={16} style={{ color: `hsl(${q.color})` }} className="mt-0.5" />
                    <div>
                      <h3 className="text-[15px] font-bold leading-tight" style={{ color: `hsl(${q.color})` }}>{q.t}</h3>
                      <div className="text-[12px] text-[hsl(var(--muted-foreground))] mt-0.5">{q.subt}</div>
                    </div>
                  </div>
                  <span className="text-[12.5px] font-mono tabular-nums" style={{ color: `hsl(${q.color})` }}>{tasks.length}</span>
                </div>
                {isCrossQuadrant && isDropTarget && (
                  <div className="mt-2 text-[10.5px] font-semibold uppercase tracking-wider flex items-center gap-1" style={{ color: `hsl(${q.color})` }}>
                    <Icons.ArrowRight size={11} /> Drop here
                  </div>
                )}
              </div>
              <div className="relative flex-1 px-3 pb-3 space-y-1.5">
                {tasks.length === 0 ? (
                  <div
                    className={cn(
                      "h-full min-h-[140px] flex items-center justify-center text-[12.5px] italic py-10 rounded-[10px] border border-dashed transition-all",
                      isDropTarget
                        ? "text-[hsl(var(--foreground))]"
                        : "text-[hsl(var(--muted-foreground))] border-transparent"
                    )}
                    style={isDropTarget ? { borderColor: `hsl(${q.color} / 0.6)`, background: `hsl(${q.color} / 0.08)` } : undefined}
                  >
                    {isDropTarget && isCrossQuadrant
                      ? `Drop in “${q.t}”`
                      : t("matrix.empty")}
                  </div>
                ) : (
                  <>
                    {tasks.map((task, i) => {
                      const isThis = dragging?.taskId === task.id;
                      return (
                        <React.Fragment key={task.id}>
                          {/* Drop slot BEFORE this card */}
                          <DropSlot
                            active={dragging && hoverTarget?.quad === q.id && hoverTarget?.index === i}
                            color={q.color}
                            onDragOver={(e) => {
                              if (!dragging) return;
                              e.preventDefault();
                              e.stopPropagation();
                              setHoverTarget({ quad: q.id, index: i });
                            }}
                            onDrop={(e) => onDropOnTask(e, q.id, i)}
                          />
                          <div
                            draggable
                            onDragStart={(e) => onDragStartTask(e, q.id, task.id)}
                            onDragEnd={onDragEndTask}
                            onDragOver={(e) => {
                              if (!dragging) return;
                              e.preventDefault();
                              e.stopPropagation();
                              const rect = e.currentTarget.getBoundingClientRect();
                              const onTopHalf = (e.clientY - rect.top) < rect.height / 2;
                              setHoverTarget({ quad: q.id, index: onTopHalf ? i : i + 1 });
                            }}
                            onDrop={(e) => {
                              const rect = e.currentTarget.getBoundingClientRect();
                              const onTopHalf = (e.clientY - rect.top) < rect.height / 2;
                              onDropOnTask(e, q.id, onTopHalf ? i : i + 1);
                            }}
                            className={cn(
                              "flex items-center gap-3 px-3 py-2.5 rounded-[8px] bg-[hsl(var(--background))] border cursor-grab active:cursor-grabbing transition-all group",
                              "hover:border-[hsl(var(--primary)/0.4)] hover:shadow-sm",
                              isThis && "opacity-30",
                              task.done && "opacity-60"
                            )}
                            style={{ borderColor: "hsl(var(--border))" }}
                          >
                            <button
                              onClick={(e) => { e.stopPropagation(); toggleDone(q.id, task.id); }}
                              title={task.done ? "Marquer non terminé" : "Marquer terminé"}
                              aria-pressed={task.done}
                              className={cn(
                                "w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors",
                                task.done
                                  ? "border-[hsl(142_70%_45%)] bg-[hsl(142_70%_45%)] text-white"
                                  : "border-[hsl(var(--muted-foreground)/0.45)] hover:border-[hsl(var(--primary))]"
                              )}>
                              {task.done && <Icons.Check size={11} stroke={3} />}
                            </button>
                            <div className="flex-1 min-w-0">
                              <div className={cn("text-[13px] font-medium truncate", task.done && "line-through text-[hsl(var(--muted-foreground))]")}>
                                <EditableTitle
                                  value={task.t}
                                  onCommit={(next) => {
                                    setTasksByQuadrant(prev => ({
                                      ...prev,
                                      [q.id]: prev[q.id].map(x => x.id === task.id ? { ...x, t: next } : x)
                                    }));
                                  }}
                                />
                              </div>
                              <div className="flex items-center gap-3 text-[10.5px] text-[hsl(var(--muted-foreground))] mt-1 flex-wrap">
                                <span className="flex items-center gap-1"><Icons.Calendar size={10}/>{task.date}</span>
                                <span className="flex items-center gap-1">
                                  <span className="inline-block w-2 h-2 rounded-full" style={{ background: `hsl(${prioColor[task.prio]})` }} />
                                  {task.prio}
                                </span>
                                {/* Delegation — assigned people (avatar stack) + assign button */}
                                <span className="flex items-center gap-1.5 ml-auto" onClick={(e) => e.stopPropagation()}>
                                  {(task.assignees || []).length > 0 && (
                                    <span className="flex items-center -space-x-1.5">
                                      {task.assignees.map(pid => {
                                        const p = personById(pid);
                                        if (!p) return null;
                                        return (
                                          <span key={pid} title={p.name}
                                            className="w-5 h-5 rounded-full flex items-center justify-center text-[8.5px] font-bold text-white ring-2 ring-[hsl(var(--background))]"
                                            style={{ background: `hsl(${p.color})` }}>
                                            {initials(p.name)}
                                          </span>
                                        );
                                      })}
                                    </span>
                                  )}
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const r = e.currentTarget.getBoundingClientRect();
                                      setAssignPicker({ quad: q.id, taskId: task.id, pos: { left: Math.min(r.left, window.innerWidth - 230), top: r.bottom + 6 } });
                                    }}
                                    title="Déléguer / assigner"
                                    className={cn(
                                      "h-5 px-1.5 rounded-full border border-dashed flex items-center gap-1 transition-colors",
                                      (task.assignees || []).length === 0 && q.id === "q3"
                                        ? "border-[hsl(38_92%_55%/0.6)] text-[hsl(38_92%_62%)] hover:bg-[hsl(38_92%_55%/0.12)]"
                                        : "border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))]"
                                    )}>
                                    <Icons.Plus size={10} />
                                    {(task.assignees || []).length === 0 && (q.id === "q3" ? "Déléguer" : "Assigner")}
                                  </button>
                                </span>
                              </div>
                            </div>
                            <Icons.Drag size={11} className="text-[hsl(var(--muted-foreground))] opacity-0 group-hover:opacity-100 flex-shrink-0" />
                          </div>
                        </React.Fragment>
                      );
                    })}
                    {/* Drop slot AFTER the last card */}
                    <DropSlot
                      active={dragging && hoverTarget?.quad === q.id && hoverTarget?.index === tasks.length}
                      color={q.color}
                      onDragOver={(e) => {
                        if (!dragging) return;
                        e.preventDefault();
                        e.stopPropagation();
                        setHoverTarget({ quad: q.id, index: tasks.length });
                      }}
                      onDrop={(e) => onDropOnTask(e, q.id, tasks.length)}
                    />
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Assignee / delegation picker (fixed — escapes quadrant overflow) */}
      {assignPicker && (() => {
        const task = (tasksByQuadrant[assignPicker.quad] || []).find(x => x.id === assignPicker.taskId);
        if (!task) return null;
        return (
          <AssigneePicker
            pos={assignPicker.pos}
            team={TEAM}
            initials={initials}
            selected={task.assignees || []}
            onToggle={(pid) => toggleAssignee(assignPicker.quad, assignPicker.taskId, pid)}
            onClose={() => setAssignPicker(null)}
          />
        );
      })()}

    </div>
  );
}

/* Eisenhower matrix explainer — anchored popover for the "i" button. */
function MatrixInfoPopover({ meta, onClose }) {
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    const k = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("mousedown", h);
    window.addEventListener("keydown", k);
    return () => { window.removeEventListener("mousedown", h); window.removeEventListener("keydown", k); };
  }, [onClose]);
  return (
    <div ref={ref}
      onClick={(e) => e.stopPropagation()}
      className="absolute left-0 top-full mt-2 w-[320px] rounded-[12px] border border-[hsl(var(--border))] bg-[hsl(var(--popover))] shadow-2xl z-[1900] anim-fade-in p-4 font-normal">
      <div className="text-[13px] font-bold tracking-tight mb-1">La matrice d'Eisenhower</div>
      <p className="text-[11.5px] text-[hsl(var(--muted-foreground))] leading-relaxed mb-3" style={{ textWrap: "pretty" }}>
        Classe chaque tâche selon deux axes — <span className="font-semibold text-[hsl(var(--foreground))]">urgence</span> et <span className="font-semibold text-[hsl(var(--foreground))]">importance</span> — pour décider quoi faire en premier.
      </p>
      <div className="space-y-2">
        {meta.map(q => (
          <div key={q.id} className="flex items-start gap-2.5">
            <span className="w-6 h-6 rounded-[7px] flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: `hsl(${q.color} / 0.15)`, color: `hsl(${q.color})` }}>
              <q.icon size={13} />
            </span>
            <div className="min-w-0">
              <div className="text-[12px] font-semibold" style={{ color: `hsl(${q.color})` }}>{q.t} <span className="text-[hsl(var(--muted-foreground))] font-normal">· {q.subt}</span></div>
              <div className="text-[11px] text-[hsl(var(--muted-foreground))] leading-snug mt-0.5">
                {q.id === "q1" && "À traiter tout de suite, toi-même."}
                {q.id === "q2" && "Planifie un créneau — c'est là que se joue le long terme."}
                {q.id === "q3" && "Délègue à la bonne personne plutôt que de t'en charger."}
                {q.id === "q4" && "À supprimer ou reporter sans culpabilité."}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* Delegation picker — assign one or more people to a task. Fixed-positioned so
   it isn't clipped by the quadrant's overflow-hidden. */
function AssigneePicker({ pos, team, initials, selected, onToggle, onClose }) {
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    const k = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("mousedown", h);
    window.addEventListener("keydown", k);
    return () => { window.removeEventListener("mousedown", h); window.removeEventListener("keydown", k); };
  }, [onClose]);
  return (
    <div ref={ref}
      onClick={(e) => e.stopPropagation()}
      style={{ position: "fixed", left: pos.left, top: pos.top, width: 220 }}
      className="rounded-[12px] border border-[hsl(var(--border))] bg-[hsl(var(--popover))] shadow-2xl z-[1900] anim-fade-in p-1.5">
      <div className="px-2 py-1.5 text-[10px] uppercase tracking-[0.1em] font-semibold text-[hsl(var(--muted-foreground))]">Déléguer à</div>
      {team.map(p => {
        const on = selected.includes(p.id);
        return (
          <button key={p.id} onClick={() => onToggle(p.id)}
            className={cn("w-full flex items-center gap-2.5 px-2 py-1.5 rounded-[8px] text-left transition-colors",
              on ? "bg-[hsl(var(--primary)/0.1)]" : "hover:bg-[hsl(var(--accent))]")}>
            <span className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0" style={{ background: `hsl(${p.color})` }}>
              {initials(p.name)}
            </span>
            <span className="flex-1 text-[12.5px] font-medium truncate">{p.name}</span>
            {on && <Icons.Check size={14} className="text-[hsl(var(--primary))] flex-shrink-0" />}
          </button>
        );
      })}
    </div>
  );
}

/* Drop slot — thin gap between cards that becomes a highlighted bar
   while dragging. Provides a clear "insert here" visual. */
function DropSlot({ active, color, onDragOver, onDrop }) {
  return (
    <div
      onDragOver={onDragOver}
      onDrop={onDrop}
      className={cn(
        "transition-all rounded-full",
        active ? "h-1.5 -my-0.5" : "h-1 -my-0.5"
      )}
      style={{
        background: active ? `hsl(${color})` : "transparent",
        boxShadow: active ? `0 0 0 3px hsl(${color} / 0.25)` : undefined,
      }}
    />
  );
}

Object.assign(window, { CalendarPage, TasksPage, MatrixPage });
