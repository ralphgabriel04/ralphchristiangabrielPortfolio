/* global React, Icons, Button, Card, SectionTitle, Badge, Input, Checkbox, Avatar, Logo, cn,
          useState, useRef, ProgressBar, Ring, EmptyState, Switch, EnergyModal,
          useT */

/* ============================================================
   PAGE 4 — HOME (/home)
============================================================ */

/* Shared energy scale — used by quick header picker, EnergyModal, AI
   suggestions, and the day-curve check-ins. Source of truth for level →
   emoji/color/label across the app. Do not redefine elsewhere. */
const ENERGY_SCALE = [
  { n: 1, emoji: "😴", c: "0 84% 60%",   label: "Exhausted" },
  { n: 2, emoji: "😕", c: "20 90% 55%",  label: "Low" },
  { n: 3, emoji: "😐", c: "50 90% 55%",  label: "Medium" },
  { n: 4, emoji: "😄", c: "142 70% 50%", label: "Good" },
  { n: 5, emoji: "🔥", c: "263 70% 60%", label: "High" },
];
const ENERGY_BY_N = Object.fromEntries(ENERGY_SCALE.map(e => [e.n, e]));
if (typeof window !== "undefined") {
  window.ENERGY_SCALE = ENERGY_SCALE;
  window.ENERGY_BY_N = ENERGY_BY_N;
}

/* Day check-ins — { time: "HH:MM", level: 1..5 }. In a real app this is
   persisted; the mockup keeps a few realistic samples + lets the user add. */
const DEFAULT_CHECKINS = [
  { id: "c1", time: "07:30", level: 3 },
  { id: "c2", time: "09:45", level: 5 },
  { id: "c3", time: "13:00", level: 2 },
  { id: "c4", time: "14:32", level: 4 },
];
if (typeof window !== "undefined" && !window.__dpmCheckIns) {
  window.__dpmCheckIns = DEFAULT_CHECKINS;
}
const CHECKINS_EVT = "dpm-energy-checkins-change";
function useEnergyCheckIns() {
  const [list, setList] = useState(
    typeof window !== "undefined" ? window.__dpmCheckIns : DEFAULT_CHECKINS
  );
  useEffect(() => {
    const onChange = (e) => setList([...e.detail]);
    window.addEventListener(CHECKINS_EVT, onChange);
    return () => window.removeEventListener(CHECKINS_EVT, onChange);
  }, []);
  const addCheckIn = (level) => {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    const next = [...window.__dpmCheckIns, { id: "c" + Date.now(), time: `${hh}:${mm}`, level }];
    window.__dpmCheckIns = next;
    window.dispatchEvent(new CustomEvent(CHECKINS_EVT, { detail: next }));
  };
  return [list, addCheckIn];
}
if (typeof window !== "undefined") window.useEnergyCheckIns = useEnergyCheckIns;

/* Sleep log — one entry per night: { date, bedtime, wake, qualityLevel (1-5),
   source: "manual" | "health" }. Duration is derived in minutes. */
const DEFAULT_SLEEP = [
  { date: "lun", bedtime: "23:45", wake: "07:00", qualityLevel: 4, source: "manual" },
  { date: "mar", bedtime: "23:30", wake: "06:45", qualityLevel: 4, source: "manual" },
  { date: "mer", bedtime: "00:50", wake: "06:40", qualityLevel: 2, source: "manual" }, // mauvaise nuit, prouve le moat
  { date: "jeu", bedtime: "23:15", wake: "06:50", qualityLevel: 4, source: "manual" },
  { date: "ven", bedtime: "00:20", wake: "07:15", qualityLevel: 3, source: "manual" },
  { date: "sam", bedtime: "01:10", wake: "08:30", qualityLevel: 5, source: "manual" },
  { date: "dim", bedtime: "23:30", wake: "06:45", qualityLevel: 4, source: "health" },
];
if (typeof window !== "undefined" && !window.__dpmSleep) {
  window.__dpmSleep = { entries: DEFAULT_SLEEP, todayLogged: false };
}
const SLEEP_EVT = "dpm-sleep-change";
function useSleepLog() {
  const [state, setState] = useState(window.__dpmSleep);
  useEffect(() => {
    const h = (e) => setState({ ...e.detail });
    window.addEventListener(SLEEP_EVT, h);
    return () => window.removeEventListener(SLEEP_EVT, h);
  }, []);
  const setTodayLogged = (v) => {
    window.__dpmSleep = { ...window.__dpmSleep, todayLogged: v };
    window.dispatchEvent(new CustomEvent(SLEEP_EVT, { detail: window.__dpmSleep }));
  };
  return [state, setTodayLogged];
}
if (typeof window !== "undefined") window.useSleepLog = useSleepLog;

/* ============================================================
   HOME WIDGETS — modular like the dashboard; togglable via the
   same "Personnaliser" panel (reused from pages-tracking.jsx).
   IDs are stable and stored in localStorage("dpm-home-widgets-v1").
============================================================ */
const HOME_WIDGETS = [
  { id: "workload",     label: "Daily workload",           group: "Overview", desc: "Stacked bar — tasks / meetings / focus" },
  { id: "sleep-prompt", label: "Morning sleep check-in",   group: "Overview", desc: "Nightly check-in — bedtime / wake-up / quality" },
  { id: "energy-mini",  label: "Energy of the day",        group: "Overview", desc: "Sparkline + summary + link to analytics" },
  { id: "health",       label: "Health & sleep",           group: "Overview", desc: "Vitals, sleep & chronotype carousel with day/week/month selector" },
  { id: "current-task", label: "Current task",             group: "Action",   desc: "Banner of the active task with progress" },
  { id: "overview",     label: "Day overview",             group: "Action",   desc: "4 key figures: tasks, meetings, focus, habits" },
  { id: "quick-actions",label: "Quick actions",            group: "Action",   desc: "5 shortcuts: Task, Calendar, Focus, Habits, Stats" },
  { id: "assistant",    label: "AI assistant",             group: "Advice",   desc: "Contextual advice + sourced suggestions" },
  { id: "upcoming",     label: "Upcoming",                 group: "Side",     desc: "The day's next events" },
  { id: "tasks-today",  label: "Today's tasks",            group: "Side",     desc: "Checkable list of tasks scheduled today" },
];
if (typeof window !== "undefined") window.HOME_WIDGETS = HOME_WIDGETS;
const HOME_STORAGE_KEY = "dpm-home-widgets-v1";

/* Duration in min between bedtime "HH:MM" and wake "HH:MM" (wraps midnight). */
function sleepDurationMin(bedtime, wake) {
  const [bh, bm] = bedtime.split(":").map(Number);
  const [wh, wm] = wake.split(":").map(Number);
  const bedMin = bh * 60 + bm;
  const wakeMin = wh * 60 + wm;
  let dur = wakeMin - bedMin;
  if (dur <= 0) dur += 24 * 60;
  return dur;
}
function fmtDur(min) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${h}h${String(m).padStart(2, "0")}`;
}

/* ============================================================
   WORKLOAD WIDGET — editable hours of availability + breakdown.
   The user can change "heures disponibles" (capacity) inline; the
   breakdown bar updates automatically.
============================================================ */
function WorkloadWidget() {
  // Persisted "available hours" — defaults to 8h. Stored in localStorage so
  // it survives reloads (mockup uses a separate key from the widget config).
  const [hoursStr, setHoursStr] = useState(() => {
    try { return localStorage.getItem("dpm-workload-hours") || "8"; } catch { return "8"; }
  });
  const hours = Math.max(1, Math.min(24, parseFloat(hoursStr) || 8));
  const [bump, setBump] = useState(false);   // tiny pulse on change — delightful feedback
  useEffect(() => {
    try { localStorage.setItem("dpm-workload-hours", String(hours)); } catch {}
  }, [hours]);
  const setHours = (n, snap = true) => {
    let v = snap ? Math.round(n * 2) / 2 : Math.round(n * 60) / 60; // snap=0.5h for steppers, exact minutes when typing
    v = Math.max(1, Math.min(24, v));
    setHoursStr(String(v));
    setBump(true);
    setTimeout(() => setBump(false), 180);
  };
  const fmtHours = (h) => {
    const hh = Math.floor(h);
    const mm = Math.round((h - hh) * 60);
    return mm === 0 ? `${hh}h` : `${hh}h${String(mm).padStart(2, "0")}`;
  };
  // Inline typing of the availability — double-click the number to edit.
  const [editing, setEditing] = useState(false);
  const parseHoursInput = (str) => {
    const s = String(str).trim().toLowerCase();
    let m;
    if ((m = s.match(/^(\d+(?:[.,]\d+)?)\s*h\s*(\d+)$/))) return parseFloat(m[1].replace(",", ".")) + parseInt(m[2], 10) / 60;
    if ((m = s.match(/^(\d+(?:[.,]\d+)?)\s*h?$/))) return parseFloat(m[1].replace(",", "."));
    return NaN;
  };
  const commitEdit = (val) => {
    const n = parseHoursInput(val);
    if (Number.isFinite(n)) setHours(n, false);
    setEditing(false);
  };

  // Mock planned breakdown (mins)
  const tasksMin = 105;
  const meetingsMin = 85;
  const focusMin = 50;
  const totalPlanned = tasksMin + meetingsMin + focusMin;
  const totalCapacity = hours * 60;
  const pctTasks = (tasksMin / totalCapacity) * 100;
  const pctMeetings = (meetingsMin / totalCapacity) * 100;
  const pctFocus = (focusMin / totalCapacity) * 100;
  const fmt = (m) => `${Math.floor(m / 60)}h${String(m % 60).padStart(2, "0")}`;

  return (
    <Card>
      <SectionTitle action={
        <div className="flex items-center gap-2 text-[12px] text-[hsl(var(--muted-foreground))] tabular-nums">
          <span>{fmt(totalPlanned)} planned</span>
          <span className="text-[hsl(var(--muted-foreground)/0.5)]">/</span>
          <div className="inline-flex items-center rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--background))] overflow-hidden h-7 select-none">
            <button
              onClick={() => setHours(hours - 0.5)}
              disabled={hours <= 1}
              aria-label="Less availability"
              className="w-7 h-7 flex items-center justify-center text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary)/0.1)] active:scale-90 transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[hsl(var(--muted-foreground))]"
            >
              <Icons.Minus size={13} />
            </button>
            <div
              title="Day availability — double-click to type, wheel or +/− to adjust"
              onDoubleClick={() => setEditing(true)}
              onWheel={(e) => { e.preventDefault(); setHours(hours + (e.deltaY < 0 ? 0.5 : -0.5)); }}
              className="px-1 h-7 min-w-[3rem] flex items-center justify-center text-[12.5px] font-semibold text-[hsl(var(--foreground))] cursor-ns-resize"
            >
              {editing ? (
                <input
                  autoFocus
                  type="text"
                  defaultValue={fmtHours(hours)}
                  onFocus={(e) => e.target.select()}
                  onBlur={(e) => commitEdit(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") { e.preventDefault(); commitEdit(e.currentTarget.value); }
                    if (e.key === "Escape") { e.preventDefault(); setEditing(false); }
                  }}
                  aria-label="Available hours"
                  className="w-12 h-6 text-center bg-transparent border-b border-[hsl(var(--primary))] text-[hsl(var(--foreground))] focus:outline-none"
                />
              ) : (
                <span className={cn("transition-transform duration-150", bump && "scale-125 text-[hsl(var(--primary))]")}>{fmtHours(hours)}</span>
              )}
            </div>
            <button
              onClick={() => setHours(hours + 0.5)}
              disabled={hours >= 24}
              aria-label="More availability"
              className="w-7 h-7 flex items-center justify-center text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary)/0.1)] active:scale-90 transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[hsl(var(--muted-foreground))]"
            >
              <Icons.Plus size={13} />
            </button>
          </div>
          <span className="text-[11px] hidden sm:inline">dispo</span>
        </div>
      }>
        Daily workload
      </SectionTitle>
      <div className="flex h-3 rounded-full overflow-hidden gap-px bg-[hsl(var(--muted)/0.4)]">
        <div className="bg-[hsl(263_70%_60%)]" style={{ width: `${pctTasks}%` }} title="Tasks" />
        <div className="bg-[hsl(217_91%_60%)]" style={{ width: `${pctMeetings}%` }} title="Meetings" />
        <div className="bg-[hsl(142_70%_50%)]" style={{ width: `${pctFocus}%` }} title="Focus" />
      </div>
      <div className="flex items-center gap-4 mt-3 text-[11.5px] text-[hsl(var(--muted-foreground))] flex-wrap">
        <Legend color="263 70% 60%" label="Tasks"     v={fmt(tasksMin)} />
        <Legend color="217 91% 60%" label="Meetings"  v={fmt(meetingsMin)} />
        <Legend color="142 70% 50%" label="Focus"      v={fmt(focusMin)} />
        <Legend color="var(--muted)" label="Disponible" v={fmt(Math.max(0, totalCapacity - totalPlanned))} raw />
      </div>
    </Card>
  );
}

function HomePage({ setRoute, emptyState, onOpenTask }) {
  const isMobile = window.useIsMobile ? window.useIsMobile() : false;
  const [energy, setEnergy] = useState(4);
  const [homeSpaceId] = useSpace();
  const inHomeSpace = (e) => homeSpaceId === "all" || (window.__dpmItemInSpace ? window.__dpmItemInSpace(e, homeSpaceId) : true);
  const [doneTasks, setDoneTasks] = useState(new Set([1, 4]));
  const [energyModalLevel, setEnergyModalLevel] = useState(null);
  const [checkIns, addCheckIn] = useEnergyCheckIns();
  const [sleep, setTodaySleepLogged] = useSleepLog();
  const [customizing, setCustomizing] = useState(false);

  // Generic widget visibility hook lives in pages-tracking.jsx and is exposed
  // on window. We reuse it here with HOME_WIDGETS to mirror the dashboard's
  // "Personnaliser" panel without duplicating logic.
  // Inline widget-visibility + order hook — kept local so HomePage doesn't
  // depend on pages-tracking.jsx being parsed first (which would otherwise
  // violate Rules of Hooks when window.useWidgetVisibility becomes available
  // after first render).
  const HOME_ALL_ON = useMemo(() => Object.fromEntries(HOME_WIDGETS.map(w => [w.id, true])), []);
  const HOME_DEFAULT_ORDER = useMemo(() => HOME_WIDGETS.map(w => w.id), []);
  const [homeVisible, setHomeVisible] = useState(() => {
    try {
      const saved = localStorage.getItem(HOME_STORAGE_KEY);
      if (saved) {
        const p = JSON.parse(saved);
        return { ...HOME_ALL_ON, ...(p.visible || p) };
      }
    } catch (e) { /* ignore */ }
    return HOME_ALL_ON;
  });
  const [homeOrder, setHomeOrder] = useState(() => {
    try {
      const saved = localStorage.getItem(HOME_STORAGE_KEY);
      if (saved) {
        const p = JSON.parse(saved);
        if (Array.isArray(p.order)) {
          const known = new Set(HOME_DEFAULT_ORDER);
          const valid = p.order.filter(id => known.has(id));
          for (const id of HOME_DEFAULT_ORDER) if (!valid.includes(id)) valid.push(id);
          return valid;
        }
      }
    } catch (e) { /* ignore */ }
    return HOME_DEFAULT_ORDER;
  });
  useEffect(() => {
    try { localStorage.setItem(HOME_STORAGE_KEY, JSON.stringify({ visible: homeVisible, order: homeOrder })); } catch (e) { /* ignore */ }
  }, [homeVisible, homeOrder]);

  const toggleHome = (id) => setHomeVisible(v => ({ ...v, [id]: !v[id] }));
  const resetHome = () => { setHomeVisible(HOME_ALL_ON); setHomeOrder(HOME_DEFAULT_ORDER); };
  const hideAllHome = () => setHomeVisible(Object.fromEntries(HOME_WIDGETS.map(w => [w.id, false])));
  const homeReorder = (movedId, toId) => {
    setHomeOrder(curr => {
      const without = curr.filter(id => id !== movedId);
      if (toId == null) return [...without, movedId];
      const idx = without.indexOf(toId);
      if (idx < 0) return [...without, movedId];
      return [...without.slice(0, idx), movedId, ...without.slice(idx)];
    });
  };
  const homeVisibleCount = HOME_WIDGETS.filter(w => homeVisible[w.id]).length;
  const homeTotalCount = HOME_WIDGETS.length;

  // Drag-and-drop in-place reorder on the page (Mechanism B from P11.7).
  const [draggingWidget, setDraggingWidget] = useState(null);
  const [overWidget, setOverWidget] = useState(null);
  const onWidgetDragStart = (id) => (e) => {
    setDraggingWidget(id);
    e.dataTransfer.effectAllowed = "move";
    try { e.dataTransfer.setData("text/plain", id); } catch {}
  };
  const onWidgetDragOver = (id) => (e) => {
    if (!draggingWidget || draggingWidget === id) return;
    e.preventDefault();
    setOverWidget(id);
  };
  const onWidgetDrop = (id) => (e) => {
    e.preventDefault();
    if (draggingWidget && draggingWidget !== id) homeReorder(draggingWidget, id);
    setDraggingWidget(null);
    setOverWidget(null);
  };
  const onWidgetDragEnd = () => { setDraggingWidget(null); setOverWidget(null); };

  const HW = (id, children) => {
    const W = window.Widget;
    if (!homeVisible[id]) return null;
    if (!W) return children;
    const isOver = overWidget === id && draggingWidget && draggingWidget !== id;
    return (
      <>
        {isOver && <div className="h-1 -my-2 rounded-full bg-[hsl(var(--primary))] shadow-[0_0_0_3px_hsl(var(--primary)/0.25)]" />}
        <W
          id={id}
          visible={homeVisible}
          onHide={toggleHome}
          widgets={HOME_WIDGETS}
          draggable
          customizing={customizing}
          onDragStart={onWidgetDragStart(id)}
          onDragEnd={onWidgetDragEnd}
          onDragOver={onWidgetDragOver(id)}
          onDrop={onWidgetDrop(id)}
          dragging={draggingWidget === id}
        >
          {children}
        </W>
      </>
    );
  };

  const pickEnergy = (n) => {
    setEnergy(n);
    setEnergyModalLevel(n);
    addCheckIn(n); // every quick-pick logs a timestamped check-in
  };

  if (emptyState) {
    return (
      <div className="max-w-5xl mx-auto pt-12">
        <div className="text-center mb-12">
          <h1 className="text-[32px] font-bold tracking-tight">Good afternoon, Ralph!</h1>
          <p className="text-[14px] text-[hsl(var(--muted-foreground))] mt-1.5">Your day starts here.</p>
        </div>
        <Card padding="p-16" className="text-center">
          <div className="w-16 h-16 rounded-full bg-[hsl(var(--primary)/0.1)] flex items-center justify-center mx-auto mb-5">
            <Icons.Sunrise size={28} className="text-[hsl(var(--primary))]" />
          </div>
          <h3 className="text-[20px] font-semibold mb-2">No tasks planned</h3>
          <p className="text-[14px] text-[hsl(var(--muted-foreground))] max-w-md mx-auto mb-7">
            Start by planning your day to see your workload, rituals and focus suggestions appear.
          </p>
          <div className="flex items-center justify-center gap-2.5">
            <Button onClick={() => setRoute("daily-planning")} icon={Icons.Sunrise} size="lg">Plan my day</Button>
            <Button variant="outline" onClick={onOpenTask} icon={Icons.Plus} size="lg">Create a task</Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex gap-5 items-start min-h-full">
      <div className="flex-1 min-w-0 space-y-6">
      {/* Greeting + Personnaliser */}
      <div className="flex items-start justify-between gap-6 flex-wrap">
        <div>
          <h1 className="text-[28px] font-bold tracking-tight flex items-center gap-2.5">
            <Icons.Sun size={22} className="text-[hsl(38_92%_60%)]" />
            Good afternoon, Ralph
          </h1>
          <p className="text-[13px] text-[hsl(var(--muted-foreground))] mt-1 tabular-nums">
            14:32 · samedi 24 mai 2026
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <Card padding="p-4" className="flex items-center gap-4 flex-shrink-0">
            <EnergyHeaderPicker
              energy={energy}
              checkIns={checkIns}
              onPick={pickEnergy}
            />
          </Card>
          <ModuleTutorialButton module="home" />
          <Button
            variant={customizing ? "primary" : "outline"}
            size="sm"
            icon={Icons.Layout}
            onClick={() => setCustomizing(c => !c)}
          >
            Personnaliser
            {homeVisibleCount < homeTotalCount && (
              <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-[hsl(var(--primary)/0.18)] text-[hsl(263_70%_80%)] text-[10px] font-mono tabular-nums">
                {homeVisibleCount}/{homeTotalCount}
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Empty state when all home widgets hidden */}
      {homeVisibleCount === 0 && (
        <Card padding="p-12" className="text-center border-dashed">
          <div className="w-14 h-14 rounded-full bg-[hsl(var(--muted))] flex items-center justify-center mx-auto mb-4">
            <Icons.Layout size={24} className="text-[hsl(var(--muted-foreground))]" />
          </div>
          <h3 className="text-[16px] font-semibold mb-1.5">All widgets are hidden</h3>
          <p className="text-[12.5px] text-[hsl(var(--muted-foreground))] max-w-sm mx-auto mb-5">
            Open “Customize” to re-enable the sections you care about. Your settings are remembered.
          </p>
          <Button size="sm" icon={Icons.Layout} onClick={() => setCustomizing(true)}>Personnaliser</Button>
        </Card>
      )}

      {/* Slot content per widget id — full-width vertical stack. */}
      {(() => {
        const HOME_SLOTS = {
          "workload": <WorkloadWidget />,
          "sleep-prompt": <MorningSleepPrompt logged={sleep.todayLogged} onLogged={() => setTodaySleepLogged(true)} />,
          "energy-mini": <EnergyMiniCard checkIns={checkIns} onNavigateAnalysis={() => setRoute("dashboard")} />,
          "health": window.HealthSleepWidget ? <window.HealthSleepWidget period="day" onSeeDetails={() => setRoute("dashboard")} /> : null,
          "current-task": (
            <Card padding="p-5" className="relative overflow-hidden">
              <div className="absolute inset-y-0 left-0 w-1 gradient-violet" />
              <div className="flex items-start gap-4 flex-wrap">
                <div className="w-14 h-14 rounded-[12px] gradient-violet flex items-center justify-center flex-shrink-0">
                  <Icons.Zap size={24} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="primary" dot>In progress</Badge>
                    <Badge variant="danger" dot>Urgent</Badge>
                  </div>
                  <h3 className="text-[18px] font-semibold leading-tight">Finalize the Desjardins client proposal</h3>
                  <div className="flex items-center gap-x-4 gap-y-1 flex-wrap text-[12px] text-[hsl(var(--muted-foreground))] mt-2">
                    <span className="flex items-center gap-1.5"><Icons.Clock size={12} /> 2h estimated · 45min elapsed</span>
                    <span className="flex items-center gap-1.5"><Icons.Target size={12} /> Started at 13:47</span>
                  </div>
                  <div className="mt-3">
                    <ProgressBar value={37} height="h-1.5" />
                  </div>
                </div>
                <div className={cn("flex items-center gap-1.5", isMobile ? "w-full justify-end" : "flex-shrink-0")}>
                  <Button variant="outline" size="sm" icon={Icons.Check}>Terminer</Button>
                  <Button variant="ghost" size="iconSm" title="Passer"><Icons.SkipForward size={14}/></Button>
                  <Button variant="ghost" size="iconSm" title="Plus"><Icons.More size={14}/></Button>
                </div>
              </div>
            </Card>
          ),
          "overview": (
            <div>
              <SectionTitle>Day overview</SectionTitle>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { l: "Tasks", v: "3/5", icon: Icons.CheckSquare, color: "primary", trend: "+1 yesterday" },
                  { l: "Meetings", v: "2", icon: Icons.Calendar, color: "info", trend: "1h25" },
                  { l: "Focus", v: "2h", icon: Icons.Target, color: "success", trend: "Goal 3h" },
                  { l: "Habits", v: "1/3", icon: Icons.Flame, color: "warning", trend: "Med · Reading" },
                ].map(s => (
                  <Card key={s.l} padding="p-4">
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="text-[11.5px] text-[hsl(var(--muted-foreground))] font-medium">{s.l}</span>
                      <s.icon size={14} className={cn(
                        s.color === "primary" && "text-[hsl(var(--primary))]",
                        s.color === "info" && "text-[hsl(217_91%_60%)]",
                        s.color === "success" && "text-[hsl(142_70%_55%)]",
                        s.color === "warning" && "text-[hsl(38_92%_60%)]",
                      )} />
                    </div>
                    <div className="text-[24px] font-bold tabular-nums leading-none">{s.v}</div>
                    <div className="text-[11px] text-[hsl(var(--muted-foreground))] mt-2">{s.trend}</div>
                  </Card>
                ))}
              </div>
            </div>
          ),
          "quick-actions": (
            <div>
              <SectionTitle>Quick actions</SectionTitle>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {[
                  { l: "Task", icon: Icons.Plus, action: () => onOpenTask?.() },
                  { l: "Calendar", icon: Icons.Calendar, action: () => setRoute("calendar") },
                  { l: "Focus", icon: Icons.Target, action: () => setRoute("planner") },
                  { l: "Habits", icon: Icons.Flame, action: () => setRoute("habits") },
                  { l: "Stats", icon: Icons.BarChart, action: () => setRoute("dashboard") },
                ].map(a => (
                  <button key={a.l} onClick={a.action}
                    className="flex flex-col items-center justify-center gap-2 p-4 rounded-[10px] border border-[hsl(var(--border))] hover:border-[hsl(var(--primary)/0.4)] hover:bg-[hsl(var(--primary)/0.05)] transition-all">
                    <a.icon size={18} className="text-[hsl(var(--primary))]" />
                    <span className="text-[12px] font-medium">{a.l}</span>
                  </button>
                ))}
              </div>
            </div>
          ),
          "assistant": <AIAssistant />,
          "upcoming": (
            <Card>
              <SectionTitle action={<button className="text-[11px] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]">View all</button>}>
                Upcoming
              </SectionTitle>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                {[
                  { t: "14:30 → 14:45", title: "Product team stand-up", type: "meeting", participants: 6, space: "pro" },
                  { t: "15:00 → 16:00", title: "Desjardins client call", type: "meeting", participants: 3, urgent: true, space: "pro" },
                  { t: "16:30 → 17:15", title: "Review PR #142", type: "task", space: "pro" },
                  { t: "17:15 → 18:00", title: "Deep work focus", type: "focus", space: "pro" },
                  { t: "19:00 → 19:20", title: "Reading (habit)", type: "habit", spaces: ["perso","etudes"] },
                ].filter(inHomeSpace).map((e, i) => (
                  <div key={i} className="flex items-start gap-3 p-2 -mx-2 rounded-[8px] hover:bg-[hsl(var(--accent)/0.3)] transition-colors">
                    <div className={cn(
                      "w-1 self-stretch rounded-full min-h-[28px]",
                      e.type === "meeting" ? "bg-[hsl(217_91%_60%)]" :
                      e.type === "task" ? "bg-[hsl(var(--primary))]" :
                      e.type === "focus" ? "bg-[hsl(142_70%_50%)]" :
                      "bg-[hsl(38_92%_55%)]"
                    )} />
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] text-[hsl(var(--muted-foreground))] font-mono tabular-nums">{e.t}</div>
                      <div className="text-[13px] font-medium truncate">{e.title}</div>
                      {e.participants && <div className="text-[10.5px] text-[hsl(var(--muted-foreground))] mt-0.5">{e.participants} participants</div>}
                    </div>
                    {e.urgent && <Badge variant="danger" className="flex-shrink-0">!</Badge>}
                  </div>
                ))}
              </div>
            </Card>
          ),
          "tasks-today": (
            <Card>
              <SectionTitle action={<button onClick={() => setRoute("tasks")} className="text-[11px] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]">View all</button>}>
                Today's tasks · 2/5
              </SectionTitle>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-3 gap-y-0.5">
                {[
                  { id: 1, title: "Morning stand-up · prep notes", duration: "10min", priority: "muted", space: "pro" },
                  { id: 2, title: "Desjardins proposal", duration: "2h", priority: "danger", space: "pro" },
                  { id: 3, title: "Review PR #142", duration: "45min", priority: "warning", space: "pro" },
                  { id: 4, title: "Reply to supplier emails", duration: "30min", priority: "primary", spaces: ["pro","perso"] },
                  { id: 5, title: "Prepare Q2 presentation", duration: "3h", priority: "warning", space: "pro" },
                ].filter(inHomeSpace).map(t => {
                  const done = doneTasks.has(t.id);
                  return (
                    <div key={t.id}
                      onClick={() => setDoneTasks(s => { const n = new Set(s); n.has(t.id) ? n.delete(t.id) : n.add(t.id); return n; })}
                      className="w-full flex items-center gap-2.5 p-2 rounded-[6px] hover:bg-[hsl(var(--accent)/0.3)] transition-colors text-left cursor-pointer"
                    >
                      <Checkbox checked={done} onChange={() => {}} />
                      <span className={cn("flex-1 text-[13px] truncate", done && "line-through text-[hsl(var(--muted-foreground))]")}>{t.title}</span>
                      <Badge variant={t.priority} dot={t.priority !== "muted"}>{t.duration}</Badge>
                    </div>
                  );
                })}
              </div>
            </Card>
          ),
        };
        return homeOrder.map(id => HOME_SLOTS[id] ? <React.Fragment key={id}>{HW(id, HOME_SLOTS[id])}</React.Fragment> : null);
      })()}

      <EnergyModal open={energyModalLevel !== null} onClose={() => setEnergyModalLevel(null)} level={energyModalLevel || 5} />
      </div>

      {/* Customize panel — same component as the dashboard, scoped to the home */}
      {customizing && window.CustomizePanel && (
        <window.CustomizePanel
          visible={homeVisible}
          onToggle={toggleHome}
          onReset={resetHome}
          onHideAll={hideAllHome}
          onClose={() => setCustomizing(false)}
          visibleCount={homeVisibleCount}
          totalCount={homeTotalCount}
          widgets={HOME_WIDGETS}
          surfaceLabel="the home"
          order={homeOrder}
          onReorder={homeReorder}
        />
      )}
    </div>
  );
}

function Legend({ color, label, v, raw }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="w-2 h-2 rounded-full" style={{ background: raw ? `hsl(${color})` : `hsl(${color})` }} />
      <span>{label}</span>
      <span className="text-[hsl(var(--foreground))] font-medium tabular-nums">{v}</span>
    </div>
  );
}

/* ============================================================
   MORNING SLEEP PROMPT — appears in the morning, once per day.
   Soft, non-modal. Reuses ENERGY_SCALE for "qualité ressentie".
   Two intake modes: empty (manual) or pre-filled from Health.
   Confirmed state: collapses to a 1-line summary with "modifier".
============================================================ */
function MorningSleepPrompt({ logged, onLogged }) {
  const [dismissed, setDismissed] = useState(false);
  const [mode, setMode] = useState("health"); // "manual" | "health" — toggle to demo both
  const [bedtime, setBedtime] = useState(mode === "health" ? "23:30" : "");
  const [wake, setWake] = useState(mode === "health" ? "06:45" : "");
  const [quality, setQuality] = useState(mode === "health" ? 4 : null);
  const [editing, setEditing] = useState(false);

  if (dismissed) return null;

  // Once logged: collapsed summary card
  if (logged && !editing) {
    const min = sleepDurationMin(bedtime, wake);
    const qMeta = quality ? ENERGY_BY_N[quality] : null;
    return (
      <div className="rounded-[12px] border border-[hsl(var(--border))] bg-[hsl(263_70%_55%/0.06)] dark:bg-[hsl(263_70%_15%/0.4)] p-3.5 flex items-center gap-3 anim-fade-in">
        <div className="w-9 h-9 rounded-[10px] bg-[hsl(263_70%_55%/0.15)] dark:bg-[hsl(263_70%_30%/0.5)] text-[hsl(263_70%_50%)] dark:text-[hsl(263_70%_75%)] flex items-center justify-center flex-shrink-0">
          <Icons.Moon size={14} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[12.5px] font-semibold leading-tight flex items-center gap-2 flex-wrap">
            Sleep logged · <span className="font-mono tabular-nums text-[hsl(263_70%_50%)] dark:text-[hsl(263_70%_80%)]">{fmtDur(min)}</span>
            {qMeta && <span title={qMeta.label}>{qMeta.emoji}</span>}
            <Icons.Check size={12} className="text-[hsl(142_70%_55%)]" />
          </div>
          <div className="text-[10.5px] text-[hsl(var(--muted-foreground))] mt-0.5 font-mono">
            {bedtime} → {wake}
          </div>
        </div>
        <button
          onClick={() => setEditing(true)}
          className="text-[11.5px] text-[hsl(263_70%_50%)] dark:text-[hsl(263_70%_75%)] hover:text-[hsl(263_70%_40%)] dark:hover:text-[hsl(263_70%_85%)] px-2 py-1 rounded hover:bg-[hsl(263_70%_55%/0.10)] dark:hover:bg-[hsl(263_70%_30%/0.3)]"
        >
          Edit
        </button>
      </div>
    );
  }

  const min = bedtime && wake ? sleepDurationMin(bedtime, wake) : null;
  const canSave = bedtime && wake && quality != null;

  return (
    <div className="rounded-[12px] border border-[hsl(263_70%_55%/0.30)] bg-[hsl(263_70%_55%/0.06)] dark:bg-gradient-to-br dark:from-[hsl(263_70%_18%/0.6)] dark:to-[hsl(263_70%_10%/0.4)] overflow-hidden anim-fade-in">
      {/* Health import banner */}
      {mode === "health" && (
        <div className="flex items-center gap-2 px-4 py-2 border-b border-[hsl(263_70%_55%/0.20)] bg-[hsl(263_70%_55%/0.05)] dark:bg-[hsl(263_70%_45%/0.08)]">
          <Icons.Heart size={11} className="text-[hsl(330_80%_50%)] dark:text-[hsl(330_80%_70%)] flex-shrink-0" />
          <div className="text-[11px] text-[hsl(var(--muted-foreground))] flex-1">
            <span className="text-[hsl(330_80%_45%)] dark:text-[hsl(330_80%_75%)] font-medium">Imported from Health</span> · confirm or adjust if needed
          </div>
          <button onClick={() => { setMode("manual"); setBedtime(""); setWake(""); setQuality(null); }} className="text-[10.5px] underline opacity-80 hover:opacity-100">
            enter manually
          </button>
        </div>
      )}

      <div className="p-4">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-9 h-9 rounded-[10px] bg-[hsl(263_70%_55%/0.15)] dark:bg-[hsl(263_70%_30%/0.5)] text-[hsl(263_70%_50%)] dark:text-[hsl(263_70%_80%)] flex items-center justify-center flex-shrink-0">
            <Icons.Moon size={15} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[13.5px] font-semibold leading-tight">How did you sleep?</div>
            <div className="text-[11px] text-[hsl(var(--muted-foreground))] mt-0.5">
              30 seconds · helps DPM plan your day
            </div>
          </div>
          <button
            onClick={() => setDismissed(true)}
            aria-label="Later"
            title="Later"
            className="flex-shrink-0 w-7 h-7 rounded-md text-[hsl(var(--muted-foreground))] hover:bg-[hsl(263_70%_55%/0.15)] dark:hover:bg-[hsl(263_70%_30%/0.4)] hover:text-[hsl(var(--foreground))] flex items-center justify-center -mt-1"
          >
            <Icons.X size={13} />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          <SleepTimeField label="In bed at" value={bedtime} onChange={setBedtime} placeholder="23:30" icon={Icons.Moon} />
          <SleepTimeField label="Up at"     value={wake}    onChange={setWake}    placeholder="06:45" icon={Icons.Sunrise} />
          <div className="rounded-[8px] border border-[hsl(263_70%_55%/0.20)] bg-[hsl(263_70%_55%/0.06)] dark:bg-[hsl(263_70%_25%/0.25)] px-3 py-2">
            <div className="text-[9.5px] uppercase tracking-wider text-[hsl(var(--muted-foreground))] font-semibold mb-0.5">Duration</div>
            <div className="text-[18px] font-bold tabular-nums leading-none text-[hsl(263_70%_50%)] dark:text-[hsl(263_70%_80%)]">
              {min != null ? fmtDur(min) : "—"}
            </div>
          </div>
        </div>

        <div className="mb-4">
          <div className="text-[11px] uppercase tracking-wider text-[hsl(var(--muted-foreground))] font-semibold mb-2">Perceived quality</div>
          <div className="flex items-center gap-2">
            {ENERGY_SCALE.map(e => (
              <button
                key={e.n}
                onClick={() => setQuality(e.n)}
                title={`${e.label} · ${e.n}/5`}
                className={cn(
                  "flex-1 h-12 rounded-[10px] border-2 flex flex-col items-center justify-center gap-0.5 transition-all",
                  quality === e.n
                    ? "scale-105"
                    : "opacity-50 grayscale hover:opacity-90 hover:grayscale-0 border-transparent bg-[hsl(263_70%_55%/0.06)] dark:bg-[hsl(263_70%_25%/0.25)]"
                )}
                style={quality === e.n ? {
                  borderColor: `hsl(${e.c})`,
                  background: `hsl(${e.c} / 0.18)`,
                } : {}}
              >
                <span className="text-[18px]">{e.emoji}</span>
                <span className="text-[8.5px] font-semibold uppercase tracking-wider" style={quality === e.n ? { color: `hsl(${e.c})` } : { color: "hsl(var(--muted-foreground))" }}>{e.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between gap-2">
          <button
            onClick={() => setDismissed(true)}
            className="text-[12px] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
          >
            Later
          </button>
          <Button
            size="sm"
            disabled={!canSave}
            icon={Icons.Check}
            onClick={() => { onLogged(); setEditing(false); }}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}

function SleepTimeField({ label, value, onChange, placeholder, icon: Icon }) {
  return (
    <label className="rounded-[8px] border border-[hsl(263_70%_55%/0.20)] bg-[hsl(263_70%_55%/0.06)] dark:bg-[hsl(263_70%_25%/0.25)] px-3 py-2 flex flex-col cursor-text focus-within:border-[hsl(263_70%_60%/0.6)] focus-within:bg-[hsl(263_70%_55%/0.10)] dark:focus-within:bg-[hsl(263_70%_30%/0.35)]">
      <div className="text-[9.5px] uppercase tracking-wider text-[hsl(var(--muted-foreground))] font-semibold mb-0.5 flex items-center gap-1">
        <Icon size={9} /> {label}
      </div>
      <input
        type="time"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="bg-transparent text-[16px] font-bold tabular-nums leading-none text-[hsl(263_70%_45%)] dark:text-[hsl(263_70%_85%)] focus:outline-none placeholder:text-[hsl(var(--muted-foreground)/0.5)] appearance-none"
      />
    </label>
  );
}

/* ============================================================
   ENERGY HEADER PICKER — the SINGLE energy entry point on Home.
   Two states:
   - "à saisir" : 5 emojis to tap (if last check-in is older than
     THRESHOLD_MIN, default 3h, or no check-in today)
   - "capté"   : "Énergie captée à HH:MM ✓ · modifier" (reduced state)
   The picker auto-collapses after a tap and stays collapsed until the
   threshold elapses again. Never bloque, toujours modifiable.
============================================================ */
function EnergyHeaderPicker({ energy, checkIns, onPick }) {
  const THRESHOLD_MIN = 180; // 3h
  const last = checkIns.length ? checkIns[checkIns.length - 1] : null;
  const [editing, setEditing] = useState(false);

  // Time since last check-in, in minutes. We mock "now" against the
  // last check-in's time string (HH:MM) — in real app this uses Date.now().
  const nowMins = (() => {
    const d = new Date();
    return d.getHours() * 60 + d.getMinutes();
  })();
  const lastMins = last ? (() => {
    const [h, m] = last.time.split(":").map(Number);
    return h * 60 + m;
  })() : null;
  const ageMin = lastMins != null ? Math.max(0, nowMins - lastMins) : Infinity;
  const stale = ageMin >= THRESHOLD_MIN;
  const expanded = editing || stale || !last;

  if (expanded) {
    return (
      <>
        <div>
          <div className="text-[11px] uppercase tracking-wider text-[hsl(var(--muted-foreground))] font-semibold">Energy</div>
          <div className="text-[12px] mt-0.5">{last ? "Recapture now" : "How are you feeling?"}</div>
        </div>
        <div className="flex items-center gap-1.5">
          {ENERGY_SCALE.map(e => (
            <button
              key={e.n}
              onClick={() => { onPick(e.n); setEditing(false); }}
              title={`${e.label} · ${e.n}/5`}
              className={cn(
                "w-9 h-9 rounded-full flex items-center justify-center text-[16px] transition-all",
                e.n <= energy
                  ? "shadow-sm scale-100"
                  : "grayscale opacity-50 hover:opacity-90 hover:grayscale-0"
              )}
              style={e.n <= energy ? { background: `hsl(${e.c} / 0.18)`, boxShadow: `inset 0 0 0 1px hsl(${e.c} / 0.4)` } : {}}
            >{e.emoji}</button>
          ))}
        </div>
      </>
    );
  }

  // Captured (compact) state
  const meta = ENERGY_BY_N[last.level];
  return (
    <>
      <div className="flex items-center gap-2">
        <span className="text-[20px]">{meta.emoji}</span>
        <div>
          <div className="text-[11px] uppercase tracking-wider text-[hsl(var(--muted-foreground))] font-semibold">Energy</div>
          <div className="text-[12.5px] mt-0.5 leading-tight">
            Captured at <span className="font-mono tabular-nums font-semibold">{last.time}</span>
            <Icons.Check size={11} className="inline ml-1 text-[hsl(142_70%_55%)]" />
          </div>
        </div>
      </div>
      <button
        onClick={() => setEditing(true)}
        className="text-[11.5px] text-[hsl(263_70%_75%)] hover:text-[hsl(263_70%_85%)] px-2 py-1 rounded hover:bg-[hsl(263_70%_30%/0.2)]"
      >
        Edit
      </button>
    </>
  );
}

/* ============================================================
   ENERGY MINI CARD — compact feedback. Sparkline only (no axes,
   no legend, no per-point emojis), one-line textual summary, link
   to the full analysis on the Tableau d'analyses.
   Target height ~120px. Empty state stays elegant.
============================================================ */
function EnergyMiniCard({ checkIns, onNavigateAnalysis }) {
  const empty = checkIns.length === 0;

  // Find peak / trough across the day
  let peak = null, trough = null;
  for (const c of checkIns) {
    if (!peak   || c.level > peak.level)   peak = c;
    if (!trough || c.level < trough.level) trough = c;
  }

  return (
    <Card padding="p-4" className="flex items-center gap-4">
      <div className="flex-shrink-0 w-9 h-9 rounded-[10px] bg-[hsl(263_70%_30%/0.4)] text-[hsl(263_70%_80%)] flex items-center justify-center">
        <Icons.Activity size={15} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-semibold leading-tight">Your energy today</div>
        <div className="text-[11.5px] text-[hsl(var(--muted-foreground))] mt-0.5 leading-snug">
          {empty
            ? "No check-in yet — a tap in the header above is enough."
            : (
              <>
                {peak && trough && peak !== trough
                  ? <>peak <span className="font-mono tabular-nums">{peak.time}</span> · trough <span className="font-mono tabular-nums">{trough.time}</span></>
                  : <>last check-in <span className="font-mono tabular-nums">{checkIns[checkIns.length - 1].time}</span></>
                }
                <span className="mx-1.5 opacity-50">·</span>
                {checkIns.length} check-in{checkIns.length > 1 ? "s" : ""}
              </>
            )}
        </div>
      </div>

      <div className="flex-shrink-0 w-[200px] h-12">
        <EnergySparkline checkIns={checkIns} />
      </div>

      <button
        onClick={onNavigateAnalysis}
        className="flex-shrink-0 text-[11.5px] text-[hsl(263_70%_75%)] hover:text-[hsl(263_70%_85%)] px-2.5 py-1.5 rounded-md hover:bg-[hsl(263_70%_30%/0.2)] flex items-center gap-1 font-medium"
      >
        View analysis <Icons.ArrowRight size={11} />
      </button>
    </Card>
  );
}

/* Plain sparkline — silhouette only, no axes, no legend, no point markers. */
function EnergySparkline({ checkIns }) {
  const W = 200, H = 48, padY = 6;
  if (checkIns.length === 0) {
    return (
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full" preserveAspectRatio="none">
        <line x1="0" y1={H / 2} x2={W} y2={H / 2} stroke="hsl(var(--border) / 0.5)" strokeDasharray="3 4" />
      </svg>
    );
  }
  const dayStart = 6 * 60, dayEnd = 22 * 60;
  const sorted = [...checkIns].sort((a, b) => a.time.localeCompare(b.time));
  const xOf = (timeStr) => {
    const [h, m] = timeStr.split(":").map(Number);
    const mins = Math.max(dayStart, Math.min(dayEnd, h * 60 + m));
    return (mins - dayStart) / (dayEnd - dayStart) * W;
  };
  const yOf = (lvl) => padY + (H - 2 * padY) * (1 - (lvl - 1) / 4);
  const pts = sorted.map(c => ({ x: xOf(c.time), y: yOf(c.level) }));

  const path = (() => {
    if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`;
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] || pts[i];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2] || p2;
      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;
      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return d;
  })();
  const areaPath = `${path} L ${pts[pts.length - 1].x} ${H} L ${pts[0].x} ${H} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="energySparkArea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="hsl(263 70% 60%)" stopOpacity="0.45" />
          <stop offset="100%" stopColor="hsl(263 70% 60%)" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#energySparkArea)" />
      <path d={path} fill="none" stroke="hsl(263 70% 75%)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ============================================================
   SOFT ENERGY CHECK-IN — non-modal AI-driven nudge.
   Tap a level → it's gone. Never blocks the UI.
============================================================ */
function SoftCheckInPrompt({ onLog }) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;
  return (
    <div className="rounded-[12px] border border-[hsl(var(--primary)/0.25)] bg-gradient-to-r from-[hsl(var(--primary)/0.06)] to-transparent p-4 flex items-center gap-4 anim-fade-in" role="region" aria-label="Energy check-in suggestion">
      <div className="flex-shrink-0 w-9 h-9 rounded-[10px] gradient-violet flex items-center justify-center shadow-[0_0_0_3px_hsl(var(--primary)/0.10)]">
        <Icons.Sparkles size={14} className="text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[12.5px] font-semibold text-[hsl(var(--foreground))] leading-tight">
          What's your energy level right now?
        </div>
        <div className="text-[11px] text-[hsl(var(--muted-foreground))] mt-0.5">
          One tap is enough · it helps the app better suggest what to do and when
        </div>
      </div>
      <div className="flex items-center gap-1 flex-shrink-0">
        {ENERGY_SCALE.map(e => (
          <button
            key={e.n}
            onClick={() => { onLog(e.n); setDismissed(true); }}
            title={`${e.label} · ${e.n}/5`}
            className="w-10 h-10 rounded-full flex items-center justify-center text-[18px] grayscale opacity-70 hover:opacity-100 hover:grayscale-0 hover:scale-110 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))]"
          >
            {e.emoji}
          </button>
        ))}
      </div>
      <button
        onClick={() => setDismissed(true)}
        aria-label="Later"
        title="Later"
        className="flex-shrink-0 w-7 h-7 rounded-md text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--foreground))] flex items-center justify-center"
      >
        <Icons.X size={13} />
      </button>
    </div>
  );
}

/* ============================================================
   ENERGY CURVE CARD — today's check-ins as a curve + 7-day pattern.
============================================================ */
function EnergyCurveCard({ checkIns, onAdd }) {
  const [tab, setTab] = useState("today");
  const [showAdd, setShowAdd] = useState(false);
  const empty = checkIns.length === 0;

  const history = [
    { d: "Mon", curve: [2, 3, 4, 5, 4, 3, 4, 3, 2, 3] },
    { d: "Tue", curve: [3, 4, 5, 5, 4, 2, 3, 3, 2, 2] },
    { d: "Wed", curve: [3, 4, 4, 5, 3, 2, 3, 4, 4, 3] },
    { d: "Thu", curve: [2, 3, 4, 5, 5, 3, 2, 3, 3, 3] },
    { d: "Fri", curve: [3, 4, 5, 4, 3, 2, 2, 3, 2, 1] },
    { d: "Sat", curve: [4, 4, 5, 4, 4, 3, 4, 4, 3, 3] },
    { d: "Sun", curve: [3, 3, 5, 4, 2, 4, 4, 3, 3, 2] },
  ];
  const avg = Array.from({ length: 10 }, (_, i) =>
    history.reduce((a, b) => a + b.curve[i], 0) / history.length
  );

  return (
    <Card padding="p-5">
      <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="text-[14px] font-semibold tracking-tight">Energy throughout the day</h3>
            <Badge variant="muted" className="text-[10px]">{checkIns.length} check-in{checkIns.length > 1 ? "s" : ""}</Badge>
          </div>
          <div className="text-[11.5px] text-[hsl(var(--muted-foreground))]">
            {empty
              ? "No check-in yet today — make one to see your curve take shape."
              : "Peak, trough, rebound — visualized at a glance."}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="inline-flex p-0.5 bg-[hsl(var(--muted)/0.5)] rounded-[8px]">
            {[
              { id: "today",   label: "Today" },
              { id: "history", label: "History" },
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  "h-7 px-2.5 rounded-[6px] text-[11.5px] font-medium transition-all",
                  tab === t.id
                    ? "bg-[hsl(var(--card))] text-[hsl(var(--foreground))] shadow-sm"
                    : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
          {tab === "today" && (
            <Button size="sm" variant="outline" icon={Icons.Plus} onClick={() => setShowAdd(s => !s)}>
              Check in now
            </Button>
          )}
        </div>
      </div>

      {showAdd && tab === "today" && (
        <div className="mb-4 p-3 rounded-[10px] border border-dashed border-[hsl(var(--primary)/0.4)] bg-[hsl(var(--primary)/0.05)] flex items-center justify-between gap-3 anim-fade-in">
          <div className="text-[12.5px] text-[hsl(var(--foreground))]">How do you feel right now?</div>
          <div className="flex items-center gap-1">
            {ENERGY_SCALE.map(e => (
              <button
                key={e.n}
                onClick={() => { onAdd(e.n); setShowAdd(false); }}
                title={`${e.label} · ${e.n}/5`}
                className="w-9 h-9 rounded-full flex items-center justify-center text-[16px] grayscale opacity-70 hover:opacity-100 hover:grayscale-0 hover:scale-110 transition-all"
              >
                {e.emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      {tab === "today" ? (
        empty
          ? <EnergyCurveEmpty onPrompt={() => setShowAdd(true)} />
          : <EnergyCurveToday checkIns={checkIns} />
      ) : (
        <EnergyHistory history={history} avg={avg} />
      )}
    </Card>
  );
}

function EnergyCurveEmpty({ onPrompt }) {
  return (
    <div className="py-8 px-4 rounded-[10px] border border-dashed border-[hsl(var(--border))] flex flex-col items-center text-center">
      <div className="text-[28px] mb-2 grayscale opacity-50">📈</div>
      <div className="text-[13px] font-semibold mb-1">No check-in today</div>
      <p className="text-[12px] text-[hsl(var(--muted-foreground))] max-w-sm leading-relaxed">
        Check in on your energy whenever you think of it. No pressure — a few check-ins are enough to see your rhythm emerge.
      </p>
      <Button size="sm" className="mt-3" icon={Icons.Plus} onClick={onPrompt}>Check in now</Button>
    </div>
  );
}

function EnergyCurveToday({ checkIns }) {
  const dayStart = 6 * 60, dayEnd = 22 * 60;
  const W = 720, H = 160, padL = 38, padR = 16, padT = 16, padB = 26;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;
  const xOf = (timeStr) => {
    const [h, m] = timeStr.split(":").map(Number);
    const mins = Math.max(dayStart, Math.min(dayEnd, h * 60 + m));
    return padL + ((mins - dayStart) / (dayEnd - dayStart)) * plotW;
  };
  const yOf = (level) => padT + plotH - ((level - 1) / 4) * plotH;
  const sorted = [...checkIns].sort((a, b) => a.time.localeCompare(b.time));
  const pts = sorted.map(c => ({ x: xOf(c.time), y: yOf(c.level), c }));

  const path = (() => {
    if (pts.length === 0) return "";
    if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`;
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] || pts[i];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2] || p2;
      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;
      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return d;
  })();
  const areaPath = path
    ? `${path} L ${pts[pts.length - 1].x} ${padT + plotH} L ${pts[0].x} ${padT + plotH} Z`
    : "";

  const ticks = [6, 10, 14, 18, 22];
  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" preserveAspectRatio="none">
        <defs>
          <linearGradient id="energyArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(263 70% 60%)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="hsl(263 70% 60%)" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {[1,2,3,4,5].map(l => {
          const y = yOf(l);
          return (
            <g key={l}>
              <line x1={padL} y1={y} x2={W - padR} y2={y} stroke="hsl(var(--border) / 0.4)" strokeDasharray="2 4" />
              <text x={padL - 6} y={y + 3.5} textAnchor="end" style={{ fontSize: 10 }}>{ENERGY_BY_N[l].emoji}</text>
            </g>
          );
        })}
        {ticks.map(h => {
          const x = padL + ((h * 60 - dayStart) / (dayEnd - dayStart)) * plotW;
          return (
            <g key={h}>
              <line x1={x} y1={padT} x2={x} y2={padT + plotH} stroke="hsl(var(--border) / 0.25)" />
              <text x={x} y={padT + plotH + 14} textAnchor="middle" className="fill-[hsl(var(--muted-foreground))]" style={{ fontSize: 9.5, fontFamily: "ui-monospace, monospace" }}>{String(h).padStart(2,"0")}:00</text>
            </g>
          );
        })}
        {areaPath && <path d={areaPath} fill="url(#energyArea)" />}
        {path && <path d={path} fill="none" stroke="hsl(263 70% 72%)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />}
        {pts.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="7" fill="hsl(var(--background))" stroke={`hsl(${ENERGY_BY_N[p.c.level].c})`} strokeWidth="2" />
            <text x={p.x} y={p.y + 4} textAnchor="middle" style={{ fontSize: 10 }}>{ENERGY_BY_N[p.c.level].emoji}</text>
            <title>{`${p.c.time} · ${ENERGY_BY_N[p.c.level].label}`}</title>
          </g>
        ))}
        {(() => {
          const now = new Date();
          const nowMins = now.getHours() * 60 + now.getMinutes();
          if (nowMins < dayStart || nowMins > dayEnd) return null;
          const x = padL + ((nowMins - dayStart) / (dayEnd - dayStart)) * plotW;
          return (
            <g>
              <line x1={x} y1={padT} x2={x} y2={padT + plotH} stroke="hsl(0 84% 60%)" strokeWidth="1" strokeDasharray="3 3" />
              <circle cx={x} cy={padT} r="3" fill="hsl(0 84% 60%)" />
            </g>
          );
        })()}
      </svg>
      <div className="flex items-center justify-between mt-2 text-[10.5px] text-[hsl(var(--muted-foreground))] flex-wrap gap-2">
        <div className="flex items-center gap-3 flex-wrap">
          {ENERGY_SCALE.map(e => (
            <span key={e.n} className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full" style={{ background: `hsl(${e.c})` }} />
              {e.label}
            </span>
          ))}
        </div>
        <span className="font-mono">{sorted[0]?.time}{sorted.length > 1 ? ` → ${sorted[sorted.length - 1].time}` : ""}</span>
      </div>
    </div>
  );
}

function EnergyHistory({ history, avg }) {
  const W = 720, H = 110, padL = 36, padR = 16, padT = 8, padB = 22;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;
  const xOfIdx = (i) => padL + (i / 9) * plotW;
  const yOf = (level) => padT + plotH - ((level - 1) / 4) * plotH;
  const hours = ["06", "08", "10", "12", "14", "16", "18", "20", "22"];

  const avgPath = (() => {
    let d = `M ${xOfIdx(0)} ${yOf(avg[0])}`;
    for (let i = 1; i < avg.length; i++) {
      const xPrev = xOfIdx(i - 1), yPrev = yOf(avg[i - 1]);
      const xCur = xOfIdx(i), yCur = yOf(avg[i]);
      const xMid = (xPrev + xCur) / 2;
      d += ` C ${xMid} ${yPrev}, ${xMid} ${yCur}, ${xCur} ${yCur}`;
    }
    return d;
  })();

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-7 gap-2">
        {history.map((day, di) => {
          const isToday = di === history.length - 1;
          const pts = day.curve.map((v, i) => `${xOfIdx(i)},${yOf(v)}`).join(" ");
          return (
            <div key={day.d} className={cn(
              "rounded-[8px] p-2 border",
              isToday ? "border-[hsl(var(--primary)/0.5)] bg-[hsl(var(--primary)/0.06)]" : "border-[hsl(var(--border))] bg-[hsl(var(--card))]"
            )}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10.5px] font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">{day.d}</span>
                <span className="text-[9.5px] text-[hsl(var(--muted-foreground))]">
                  {(day.curve.reduce((a, b) => a + b, 0) / day.curve.length).toFixed(1)}
                </span>
              </div>
              <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-10" preserveAspectRatio="none">
                <polyline points={pts} fill="none" stroke={isToday ? "hsl(var(--primary))" : "hsl(263 70% 60% / 0.6)"} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
              </svg>
            </div>
          );
        })}
      </div>

      <div className="rounded-[10px] border border-[hsl(var(--border))] p-3">
        <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
          <div className="text-[12.5px] font-semibold">Your pattern — 7-day average</div>
          <div className="text-[11px] text-[hsl(142_70%_60%)] flex items-center gap-1">
            <Icons.Sunrise size={11} /> Peak around 10am · trough around 2pm
          </div>
        </div>
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-24" preserveAspectRatio="none">
          {[1,3,5].map(l => (
            <line key={l} x1={padL} y1={yOf(l)} x2={W - padR} y2={yOf(l)} stroke="hsl(var(--border) / 0.4)" strokeDasharray="2 4" />
          ))}
          <path d={avgPath} fill="none" stroke="hsl(263 70% 72%)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          {avg.map((v, i) => (
            <circle key={i} cx={xOfIdx(i)} cy={yOf(v)} r="3" fill="hsl(263 70% 72%)" />
          ))}
          {hours.map((h, i) => (
            <text key={h} x={padL + (i / 8) * plotW} y={H - 6} textAnchor="middle" className="fill-[hsl(var(--muted-foreground))]" style={{ fontSize: 9, fontFamily: "ui-monospace, monospace" }}>{h}:00</text>
          ))}
        </svg>
      </div>
    </div>
  );
}

/* ============================================================
   ASSISTANT IA — single voice on the Home page.
   Consolidates "Suggestions IA" + "Conseil personnalisé" +
   "Astuce productivité" into one block with a contextual
   message + actionable suggestions + sourced principles.

   Enable/disable is mirrored between this block's "..." menu
   and the Paramètres page via a global signal so both stay
   in sync without prop drilling.
============================================================ */
const AI_EVT = "dpm-ai-enabled-change";
if (typeof window !== "undefined" && typeof window.__dpmAIEnabled === "undefined") {
  window.__dpmAIEnabled = true;
}
function useAIEnabled() {
  const [enabled, setEnabledState] = useState(
    typeof window !== "undefined" ? !!window.__dpmAIEnabled : true
  );
  useEffect(() => {
    const onChange = (e) => setEnabledState(!!e.detail);
    window.addEventListener(AI_EVT, onChange);
    return () => window.removeEventListener(AI_EVT, onChange);
  }, []);
  const setEnabled = (v) => {
    const next = typeof v === "function" ? v(window.__dpmAIEnabled) : v;
    window.__dpmAIEnabled = !!next;
    window.dispatchEvent(new CustomEvent(AI_EVT, { detail: !!next }));
  };
  return [enabled, setEnabled];
}
// Expose for cross-file use (settings page lives in pages-tracking.jsx).
if (typeof window !== "undefined") window.useAIEnabled = useAIEnabled;

const AI_SUGGESTIONS = [
  {
    id: "sleep-light",
    text: "You slept little (5h50, quality 2/5). Lighten your morning: push “Desjardins proposal” to 2pm, keep the morning for admin and short meetings.",
    action: "Reschedule",
    icon: "Moon",
    source: { title: "Why We Sleep", author: "Matthew Walker" },
  },
  {
    id: "energy-pattern",
    text: "Your energy is usually high around 10am and low around 2pm. Place your hard task in the morning rather than after lunch — you'll gain 20–30% productivity.",
    action: "View the day",
    icon: "Sunrise",
    source: { title: "When", author: "Daniel H. Pink" },
  },
  {
    id: "habit-1",
    text: "The “Reading” habit hasn't been checked for 2 days. Block 20 min tonight before journaling to keep your momentum.",
    action: "Block 20 min",
    icon: "Clock",
    source: { title: "Atomic Habits", author: "James Clear" },
  },
];

function AIAssistant() {
  const [enabled, setEnabled] = useAIEnabled();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onDown = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [menuOpen]);

  if (!enabled) {
    return (
      <Card padding="p-5" className="border-dashed">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-[10px] bg-[hsl(var(--muted)/0.6)] text-[hsl(var(--muted-foreground))] flex items-center justify-center flex-shrink-0">
            <Icons.Sparkles size={15} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-[14px] font-semibold mb-0.5">AI assistant disabled</h3>
            <p className="text-[12.5px] text-[hsl(var(--muted-foreground))] leading-relaxed">
              You'll no longer see contextual advice on the home page. You can re-enable it anytime here or in Settings.
            </p>
            <Button variant="outline" size="sm" className="mt-3" icon={Icons.Sparkles} onClick={() => setEnabled(true)}>
              Re-enable the assistant
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card padding="p-5" className="relative overflow-visible border-[hsl(var(--primary)/0.28)] bg-gradient-to-br from-[hsl(var(--primary)/0.06)] to-[hsl(330_80%_60%/0.02)]">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-[10px] gradient-violet flex items-center justify-center flex-shrink-0 shadow-[0_0_0_3px_hsl(var(--primary)/0.12)]">
            <Icons.Sparkles size={14} className="text-white" />
          </div>
          <div className="min-w-0">
            <h3 className="text-[13.5px] font-semibold leading-tight">AI assistant</h3>
            <div className="text-[10.5px] text-[hsl(var(--muted-foreground))] flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[hsl(142_70%_55%)]" />
              Personalized to your day
            </div>
          </div>
        </div>
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(o => !o)}
            aria-label="AI assistant options"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            className="w-7 h-7 rounded-md text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--foreground))] flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))]"
          >
            <Icons.More size={14} />
          </button>
          {menuOpen && (
            <div role="menu" className="absolute right-0 top-full mt-1 w-56 rounded-[10px] border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-xl z-20 anim-fade-in py-1">
              <MenuItem icon={Icons.Refresh}>Regenerate advice</MenuItem>
              <MenuItem icon={Icons.Settings}>Assistant preferences</MenuItem>
              <div className="my-1 border-t border-[hsl(var(--border))]" />
              <MenuItem icon={Icons.Eye} onClick={() => { setMenuOpen(false); setEnabled(false); }}>
                Hide the AI assistant
              </MenuItem>
            </div>
          )}
        </div>
      </div>

      {/* Contextual message — top voice of the assistant */}
      <p className="text-[13px] leading-relaxed text-[hsl(var(--foreground))] mb-4" style={{ textWrap: "pretty" }}>
        Your day is busy and your hardest task —{" "}
        <span className="font-semibold text-[hsl(263_70%_80%)]">Desjardins proposal</span>{" "}
        — is still to do. Use your morning energy peak to tackle it first.
      </p>

      {/* Suggestions */}
      <div className="space-y-1.5 -mx-1">
        {AI_SUGGESTIONS.map(s => (
          <SuggestionRow key={s.id} suggestion={s} />
        ))}
      </div>
    </Card>
  );
}

function MenuItem({ icon: Icon, children, onClick }) {
  return (
    <button
      role="menuitem"
      onClick={onClick}
      className="w-full text-left px-3 py-1.5 text-[12.5px] hover:bg-[hsl(var(--accent))] flex items-center gap-2 text-[hsl(var(--foreground))]"
    >
      <Icon size={12} className="text-[hsl(var(--muted-foreground))]" />
      {children}
    </button>
  );
}

function SuggestionRow({ suggestion }) {
  const ActionIcon = Icons[suggestion.icon] || Icons.ArrowRight;
  return (
    <div className="flex items-start gap-3 p-2.5 rounded-[8px] hover:bg-[hsl(var(--accent)/0.4)] transition-colors group/sug">
      <div className="w-0.5 self-stretch rounded-full bg-[hsl(var(--primary))] flex-shrink-0 min-h-[28px]" />
      <div className="flex-1 min-w-0">
        <div className="text-[12.5px] leading-relaxed text-[hsl(var(--foreground))]" style={{ textWrap: "pretty" }}>
          {suggestion.text}
        </div>
        {suggestion.source && (
          <div className="mt-1.5 inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10.5px] text-[hsl(var(--muted-foreground))] bg-[hsl(var(--muted)/0.5)]" title="Principle from a curated source">
            <Icons.Book size={9} className="opacity-70" />
            <em className="not-italic font-medium text-[hsl(var(--foreground))]">{suggestion.source.title}</em>
            <span className="opacity-70">·</span>
            <span>{suggestion.source.author}</span>
          </div>
        )}
      </div>
      <Button variant="outline" size="sm" icon={ActionIcon} className="flex-shrink-0 opacity-90 group-hover/sug:opacity-100">
        {suggestion.action}
      </Button>
    </div>
  );
}

/* ============================================================
   CLOSING SCREEN — shown after the user finishes the
   end-of-day rituel. Calm, positive, sourced quote.
============================================================ */
function ClosingScreen({ onClose }) {
  // Pick a daily quote from the curated list. In a real app, this would
  // rotate by date so each evening surfaces a different one.
  const quote = PRODUCTIVITY_TIPS[(new Date().getDate()) % PRODUCTIVITY_TIPS.length];

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[hsl(var(--background)/0.92)] backdrop-blur-md anim-fade-in" role="dialog" aria-modal="true" aria-label="End of day">
      {/* Ambient gradient */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-[hsl(263_70%_60%/0.18)] blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-[600px] h-[600px] rounded-full bg-[hsl(330_80%_60%/0.12)] blur-3xl" />
      </div>

      <div className="relative w-full max-w-xl rounded-[20px] border border-[hsl(var(--border))] bg-[hsl(var(--card)/0.85)] backdrop-blur-xl shadow-2xl anim-scale-in overflow-hidden">
        {/* Header band */}
        <div className="px-8 pt-8 pb-2 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full gradient-violet mb-4 shadow-[0_0_0_8px_hsl(var(--primary)/0.10)]">
            <Icons.Moon size={22} className="text-white" />
          </div>
          <div className="text-[11px] uppercase tracking-[0.2em] text-[hsl(var(--muted-foreground))] font-semibold mb-1.5">Have a good evening</div>
          <h2 className="text-[24px] font-bold tracking-tight" style={{ textWrap: "balance" }}>
            Your day is wrapped up.
          </h2>
          <p className="text-[13px] text-[hsl(var(--muted-foreground))] mt-2 leading-relaxed max-w-md mx-auto" style={{ textWrap: "pretty" }}>
            4 tasks completed · 3h00 of deep work · 5h of buffer respected. Rest up, tomorrow is already planned.
          </p>
        </div>

        {/* Stats récap */}
        <div className="px-8 pt-2">
          <div className="grid grid-cols-3 gap-2">
            {[
              { v: "4/4", l: "Tasks" },
              { v: "3h00", l: "Focus" },
              { v: "78", l: "Score" },
            ].map(s => (
              <div key={s.l} className="rounded-[10px] bg-[hsl(var(--muted)/0.4)] p-3 text-center">
                <div className="text-[20px] font-bold tabular-nums leading-none">{s.v}</div>
                <div className="text-[10.5px] text-[hsl(var(--muted-foreground))] mt-1 uppercase tracking-wider font-semibold">{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Quote — the reward */}
        <div className="px-8 py-6 mt-4 border-t border-[hsl(var(--border))]">
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-[8px] bg-[hsl(38_92%_55%/0.15)] text-[hsl(38_92%_60%)] flex items-center justify-center flex-shrink-0">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M7 7h4v4H7c0 3 1 5 4 5v2c-5 0-8-3-8-8V7zm10 0h4v4h-4c0 3 1 5 4 5v2c-5 0-8-3-8-8V7z"/></svg>
            </div>
            <div className="flex-1">
              <blockquote className="text-[15px] leading-relaxed italic text-[hsl(var(--foreground))] mb-3" style={{ textWrap: "pretty" }}>
                « {quote.q} »
              </blockquote>
              <div className="flex items-center gap-1.5 text-[11.5px] text-[hsl(var(--muted-foreground))]">
                <Icons.Book size={11} className="opacity-70" />
                <span>{quote.a}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-4 border-t border-[hsl(var(--border))] flex items-center justify-between bg-[hsl(var(--background)/0.4)]">
          <button
            onClick={onClose}
            className="text-[12px] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] flex items-center gap-1.5"
          >
            <Icons.Refresh size={11} /> Review the plan
          </button>
          <Button size="md" onClick={onClose} icon={Icons.Check}>
            Good evening
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Daily productivity quote carousel ---------- */
const PRODUCTIVITY_TIPS = [
  { q: "Eat the frog first — start with the hardest task.", a: "Eat That Frog · Brian Tracy" },
  { q: "If it can be done in 2 minutes, do it now.", a: "Getting Things Done · David Allen" },
  { q: "Focus on what's important, not just what's urgent.", a: "7 Habits · Stephen Covey" },
  { q: "A task takes exactly as long as the time you give it.", a: "Parkinson's Law" },
  { q: "Attention is the rarest resource. Protect it.", a: "Deep Work · Cal Newport" },
  { q: "Small gains add up. 1% a day = 37× over a year.", a: "Atomic Habits · James Clear" },
  { q: "If everything is a priority, nothing is.", a: "Essentialism · Greg McKeown" },
  { q: "Plan the night before. Start with a clear direction.", a: "Make Time · Knapp & Zeratsky" },
  { q: "Energy follows attention. Choose well.", a: "The Power of Full Engagement · Loehr & Schwartz" },
  { q: "Make fewer decisions a day, better ones.", a: "Decision fatigue · Roy Baumeister" },
  { q: "A postponed decision is a decision made.", a: "Anonymous" },
  { q: "Work in sprints, rest like an athlete.", a: "Peak Performance · Stulberg & Magness" },
  { q: "Do less, but with intensity.", a: "The One Thing · Gary Keller" },
  { q: "What gets measured gets improved.", a: "Lord Kelvin" },
  { q: "Discipline is remembering what you really want.", a: "David Campbell" },
];

function ProductivityTipCard() {
  const [open, setOpen] = useState(true);
  const [i, setI] = useState(0);
  const tip = PRODUCTIVITY_TIPS[i];
  const total = PRODUCTIVITY_TIPS.length;
  return (
    <Card padding="p-5">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between mb-2 -mx-1 px-1 rounded-md hover:bg-[hsl(var(--accent)/0.3)] transition-colors py-0.5"
      >
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-[8px] bg-[hsl(38_92%_55%/0.15)] text-[hsl(38_92%_60%)] flex items-center justify-center flex-shrink-0">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7c.7.6 1 1.5 1 2.3v1h6v-1c0-.8.3-1.7 1-2.3A7 7 0 0 0 12 2z" />
            </svg>
          </div>
          <h3 className="text-[13px] font-semibold">Productivity tip</h3>
        </div>
        <Icons.ChevronDown size={13} className={cn("text-[hsl(var(--muted-foreground))] transition-transform", !open && "-rotate-90")} />
      </button>
      {open && (
        <div className="anim-fade-in">
          <blockquote className="text-[13px] leading-relaxed mb-3 italic text-[hsl(var(--foreground))]" style={{ textWrap: "pretty" }}>
            « {tip.q} »
          </blockquote>
          <div className="flex items-center justify-between pt-2 border-t border-[hsl(var(--border))]">
            <div className="flex items-center gap-1.5 text-[11px] text-[hsl(var(--muted-foreground))] min-w-0">
              <Icons.Book size={11} className="flex-shrink-0" />
              <span className="truncate">{tip.a}</span>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0 ml-2">
              <button onClick={() => setI(p => (p - 1 + total) % total)}
                      className="w-6 h-6 rounded-md hover:bg-[hsl(var(--accent))] flex items-center justify-center text-[hsl(var(--muted-foreground))]">
                <Icons.ChevronLeft size={12} />
              </button>
              <span className="text-[10.5px] text-[hsl(var(--muted-foreground))] font-mono tabular-nums">{i+1}/{total}</span>
              <button onClick={() => setI(p => (p + 1) % total)}
                      className="w-6 h-6 rounded-md hover:bg-[hsl(var(--accent))] flex items-center justify-center text-[hsl(var(--muted-foreground))]">
                <Icons.ChevronRight size={12} />
              </button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

/* ============================================================
   PAGE 10 — DAILY PLANNING (/daily-planning)
============================================================ */
function DailyPlanningPage({ setRoute }) {
  const t = useT();
  const [step, setStep] = useState(3);
  const [showClosing, setShowClosing] = useState(false);

  // Shared daily-planning task list — built up step by step and reused across
  // Estimate / Prioritize / Schedule. Each task has stable id.
  const [dpTasks, setDpTasks] = useState([
    { id: "dt1", title: "Desjardins client proposal",   duration: 120, priority: "URGENT" },
    { id: "dt2", title: "Review PR #142",                duration: 45,  priority: "HIGH" },
    { id: "dt3", title: "Call the supplier",            duration: 15,  priority: "MEDIUM" },
    { id: "dt4", title: "API doc update",               duration: 60,  priority: "LOW" },
  ]);

  // Scheduled slots — used by step 5. Each "drop" slot is empty by default,
  // and the user can drop a task onto it. Time slots are HH:MM strings.
  const [schedule, setSchedule] = useState([
    { id: "s1", time: "09:00", end: null, title: "Stand-up", type: "meeting" },
    { id: "s2", time: "09:30", end: "11:30", title: "Desjardins proposal", type: "task", taskId: "dt1" },
    { id: "s3", time: "11:30", end: null, title: "Break", type: "break" },
    { id: "s4", time: "14:00", end: "14:45", title: "Review PR #142", type: "task", taskId: "dt2" },
    { id: "s5", time: "15:00", end: null, title: "Desjardins client call", type: "meeting" },
    { id: "s6", time: "16:30", end: null, title: "", type: "drop", taskId: null },
    { id: "s7", time: "17:30", end: null, title: "", type: "drop", taskId: null },
  ]);

  const steps = [
    { t: t("dp.add"),        d: "List the day's tasks" },
    { t: t("dp.estimate"),   d: t("dp.estimate.subtitle") },
    { t: t("dp.fill"),       d: "Check capacity" },
    { t: t("dp.prioritize"), d: t("dp.prioritize.subtitle") },
    { t: t("dp.schedule"),   d: t("dp.schedule.subtitle") },
    { t: t("dp.document"),   d: "Notes & summary" },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      {/* Progress bar */}
      <Card padding="p-5" className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Icons.Sunrise size={18} className="text-[hsl(var(--primary))]" />
          <h2 className="text-[16px] font-semibold">{t("dp.title")}</h2>
          <span className="ml-auto text-[12px] text-[hsl(var(--muted-foreground))]">Step {step + 1} / 6 · ~ 3min</span>
          <ModuleTutorialButton module="daily-planning" className="-my-2" />
        </div>
        <div className="grid grid-cols-6 gap-1.5 mt-4" data-tour="feat-planning-steps">
          {steps.map((s, i) => (
            <button key={i} onClick={() => setStep(i)} className="text-left">
              <div className={cn(
                "h-1 rounded-full transition-colors",
                i <= step ? "bg-[hsl(var(--primary))]" : "bg-[hsl(var(--muted))]"
              )} />
              <div className={cn(
                "text-[11px] mt-1.5 font-medium",
                i === step ? "text-[hsl(var(--foreground))]" :
                i < step ? "text-[hsl(var(--muted-foreground))]" :
                "text-[hsl(var(--muted-foreground)/0.5)]"
              )}>{String(i+1).padStart(2,"0")} {s.t}</div>
            </button>
          ))}
        </div>
      </Card>

      {/* Step content */}
      <Card padding="p-7" className="mb-5 min-h-[420px]" data-tour="feat-planning-current">
        <h2 className="text-[22px] font-bold tracking-tight">{steps[step].t}</h2>
        <p className="text-[13px] text-[hsl(var(--muted-foreground))] mt-1 mb-6">{steps[step].d}</p>

        {step === 0 && <DPAdd tasks={dpTasks} setTasks={setDpTasks} />}
        {step === 1 && <DPEstimate tasks={dpTasks} setTasks={setDpTasks} />}
        {step === 2 && <DPFill tasks={dpTasks} />}
        {step === 3 && <DPPrioritize tasks={dpTasks} setTasks={setDpTasks} />}
        {step === 4 && <DPSchedule tasks={dpTasks} setTasks={setDpTasks} schedule={schedule} setSchedule={setSchedule} />}
        {step === 5 && <DPDocument />}
      </Card>

      {/* Footer nav */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" disabled={step === 0} onClick={() => setStep(s => s-1)} icon={Icons.ChevronLeft}>{t("common.previous")}</Button>
        <div className="flex items-center gap-3 text-[12px] text-[hsl(var(--muted-foreground))]">
          <span>Auto-save on</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[hsl(142_70%_50%)]" />
        </div>
        {step < 5
          ? <Button onClick={() => setStep(s => s+1)} iconRight={Icons.ChevronRight}>{t("common.next")}</Button>
          : <Button onClick={() => setShowClosing(true)} icon={Icons.Check}>End my day</Button>
        }
      </div>

      {showClosing && (
        <ClosingScreen
          onClose={() => { setShowClosing(false); setRoute("home"); }}
        />
      )}
    </div>
  );
}

function DPAdd({ tasks, setTasks }) {
  const t = useT();
  const [val, setVal] = useState("");
  const add = () => {
    const v = val.trim();
    if (!v) return;
    setTasks(arr => [...arr, { id: "dt" + Date.now(), title: v, duration: 30, priority: "MEDIUM" }]);
    setVal("");
  };
  return (
    <div className="space-y-3 max-w-xl">
      <div className="flex gap-2">
        <Input placeholder={t("dp.add.placeholder")} value={val} onChange={e => setVal(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") add(); }}
          className="flex-1" />
        <Button icon={Icons.Plus} onClick={add}>{t("common.add")}</Button>
      </div>
      <div className="space-y-1.5 mt-4">
        {tasks.map((task, i) => (
          <div key={task.id} className="flex items-center gap-3 p-3 rounded-[8px] border border-[hsl(var(--border))]">
            <Icons.Drag size={14} className="text-[hsl(var(--muted-foreground))]" />
            <span className="flex-1 text-[13.5px]">{task.title}</span>
            <button onClick={() => setTasks(arr => arr.filter((_, j) => j !== i))} className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(0_84%_60%)]">
              <Icons.X size={14} />
            </button>
          </div>
        ))}
      </div>
      <div className="rounded-[8px] bg-[hsl(var(--muted)/0.4)] p-3 text-[12px] text-[hsl(var(--muted-foreground))] flex items-start gap-2 mt-4">
        <Icons.Inbox size={14} className="mt-0.5 flex-shrink-0" />
        <span>2 tasks left from yesterday — drag them here to resume them.</span>
      </div>
    </div>
  );
}

function DPEstimate({ tasks, setTasks }) {
  const t = useT();
  const presets = [5, 15, 30, 45, 60, 90, 120, 180];
  const [customFor, setCustomFor] = useState(null);
  const [customVal, setCustomVal] = useState("");

  const setDuration = (id, d) => setTasks(arr => arr.map(x => x.id === id ? { ...x, duration: d } : x));
  const fmt = (m) => m < 60 ? `${m}min` : `${Math.floor(m / 60)}h${m % 60 ? " " + (m % 60) : ""}`;

  return (
    <div className="space-y-4">
      {tasks.map(task => {
        const customActive = customFor === task.id;
        return (
          <div key={task.id} className="rounded-[10px] border border-[hsl(var(--border))] p-4">
            <div className="text-[14px] font-medium mb-3">{task.title}</div>
            <div className="flex items-center gap-1.5 flex-wrap">
              {presets.map(p => (
                <button key={p} onClick={() => setDuration(task.id, p)}
                  className={cn(
                    "px-3 h-8 rounded-[6px] text-[12px] font-medium transition-colors tabular-nums",
                    task.duration === p
                      ? "bg-[hsl(var(--primary))] text-white"
                      : "border border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))]"
                  )}>{fmt(p)}</button>
              ))}
              {!presets.includes(task.duration) && task.duration > 0 && (
                <button onClick={() => setDuration(task.id, task.duration)}
                  className="px-3 h-8 rounded-[6px] text-[12px] font-medium bg-[hsl(var(--primary))] text-white tabular-nums">
                  {fmt(task.duration)}
                </button>
              )}
              {customActive ? (
                <div className="inline-flex items-center gap-1 h-8 px-2 rounded-[6px] border border-[hsl(var(--primary)/0.5)] bg-[hsl(var(--background))]">
                  <input
                    autoFocus type="number" min="1" max="600"
                    value={customVal}
                    onChange={e => setCustomVal(e.target.value.replace(/\D/g, ""))}
                    onKeyDown={e => {
                      if (e.key === "Enter") {
                        const n = parseInt(customVal, 10);
                        if (n > 0) setDuration(task.id, n);
                        setCustomFor(null);
                      } else if (e.key === "Escape") setCustomFor(null);
                    }}
                    onBlur={() => {
                      const n = parseInt(customVal, 10);
                      if (n > 0) setDuration(task.id, n);
                      setCustomFor(null);
                    }}
                    className="w-12 text-[12px] tabular-nums bg-transparent text-center focus:outline-none"
                    placeholder="20"
                  />
                  <span className="text-[11px] text-[hsl(var(--muted-foreground))]">min</span>
                </div>
              ) : (
                <button
                  onClick={() => { setCustomFor(task.id); setCustomVal(String(task.duration || "")); }}
                  className="px-3 h-8 rounded-[6px] text-[12px] font-medium border border-dashed border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))]">
                  {t("dp.custom")}
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function DPFill({ tasks }) {
  const t = useT();
  const totalMin = tasks.reduce((s, x) => s + (x.duration || 0), 0);
  const capacityMin = 8 * 60;
  const planedH = Math.floor(totalMin / 60);
  const planedM = totalMin % 60;
  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center justify-between mb-2 text-[13px]">
          <span className="font-medium">Day capacity</span>
          <span className="tabular-nums">{planedH}h{String(planedM).padStart(2, "0")} planned / <span className="text-[hsl(142_70%_55%)] font-semibold">8h available</span></span>
        </div>
        <div className="h-8 rounded-[8px] overflow-hidden bg-[hsl(var(--muted))] flex">
          {tasks.map(x => {
            const pct = (x.duration / capacityMin) * 100;
            const colors = { URGENT: "263 70% 60%", HIGH: "38 92% 55%", MEDIUM: "217 91% 60%", LOW: "142 70% 50%" };
            const c = colors[x.priority] || "263 70% 60%";
            return (
              <div key={x.id} style={{ width: `${pct}%`, background: `hsl(${c})` }}
                title={`${x.title} · ${x.duration}min`}
                className="flex items-center justify-center text-[10px] text-white font-medium overflow-hidden">
                {pct > 5 ? x.title.split(" ").slice(0, 2).join(" ") : ""}
              </div>
            );
          })}
          <div className="flex-1" />
        </div>
      </div>
      <div className="rounded-[10px] border border-[hsl(142_70%_45%/0.3)] bg-[hsl(142_70%_45%/0.06)] p-4 flex items-start gap-3">
        <Icons.Check size={18} className="text-[hsl(142_70%_55%)] mt-0.5" />
        <div>
          <div className="text-[13.5px] font-semibold">{totalMin <= capacityMin ? "Balanced day" : "Overloaded day"}</div>
          <div className="text-[12px] text-[hsl(var(--muted-foreground))] mt-0.5">
            {Math.max(0, Math.floor((capacityMin - totalMin) / 60))}h of buffer for the unexpected.
          </div>
        </div>
      </div>
    </div>
  );
}

function DPPrioritize({ tasks, setTasks }) {
  const t = useT();
  const [dragIdx, setDragIdx] = useState(null);
  const [overIdx, setOverIdx] = useState(null);
  const colors = { URGENT: "bg-[hsl(0_84%_60%)]", HIGH: "bg-[hsl(20_90%_55%)]", MEDIUM: "bg-[hsl(50_90%_55%)]", LOW: "bg-[hsl(142_70%_50%)]" };
  const fmt = (m) => m < 60 ? `${m}min` : `${Math.floor(m / 60)}h${m % 60 ? " " + (m % 60) : ""}`;

  const reorder = (from, to) => {
    if (from === to || from < 0 || to < 0 || from >= tasks.length || to > tasks.length) return;
    setTasks(arr => {
      const next = arr.slice();
      const [moved] = next.splice(from, 1);
      const insertAt = from < to ? to - 1 : to;
      next.splice(insertAt, 0, moved);
      return next;
    });
  };

  const move = (idx, delta) => {
    const target = idx + delta;
    if (target < 0 || target >= tasks.length) return;
    setTasks(arr => {
      const next = arr.slice();
      [next[idx], next[target]] = [next[target], next[idx]];
      return next;
    });
  };

  return (
    <div className="max-w-xl space-y-2">
      <div className="text-[12px] text-[hsl(var(--muted-foreground))] mb-3">{t("dp.prioritize.hint")}</div>
      {tasks.map((it, i) => {
        const isOver = overIdx === i && dragIdx !== null && dragIdx !== i;
        return (
          <React.Fragment key={it.id}>
            {isOver && <div className="h-1 -my-1 rounded-full bg-[hsl(var(--primary))] shadow-[0_0_0_3px_hsl(var(--primary)/0.25)]" />}
            <div
              draggable
              onDragStart={(e) => { setDragIdx(i); e.dataTransfer.effectAllowed = "move"; try { e.dataTransfer.setData("text/plain", it.id); } catch {} }}
              onDragOver={(e) => { if (dragIdx !== null) { e.preventDefault(); setOverIdx(i); } }}
              onDragLeave={() => { if (overIdx === i) setOverIdx(null); }}
              onDrop={(e) => { e.preventDefault(); if (dragIdx !== null && dragIdx !== i) reorder(dragIdx, i); setDragIdx(null); setOverIdx(null); }}
              onDragEnd={() => { setDragIdx(null); setOverIdx(null); }}
              className={cn(
                "flex items-center gap-3 p-3 rounded-[10px] border border-[hsl(var(--border))] bg-[hsl(var(--card))] cursor-grab hover:border-[hsl(var(--primary)/0.4)] transition-colors",
                dragIdx === i && "opacity-40"
              )}>
              <Icons.Drag size={16} className="text-[hsl(var(--muted-foreground))]" />
              <div className={cn("w-1 h-9 rounded-full", colors[it.priority])} />
              <div className="flex-1">
                <div className="text-[14px] font-medium">{it.title}</div>
                <div className="text-[11.5px] text-[hsl(var(--muted-foreground))] mt-0.5 flex items-center gap-2">
                  <Badge variant={it.priority === "URGENT" ? "danger" : it.priority === "HIGH" ? "orange" : it.priority === "MEDIUM" ? "warning" : "success"}>{it.priority}</Badge>
                  <span>· {fmt(it.duration)}</span>
                </div>
              </div>
              <div className="flex flex-col gap-0.5">
                <button onClick={() => move(i, -1)} disabled={i === 0} title="Move up"
                  className="w-6 h-6 rounded text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))] disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center">
                  <Icons.ChevronUp size={11} />
                </button>
                <button onClick={() => move(i, 1)} disabled={i === tasks.length - 1} title="Move down"
                  className="w-6 h-6 rounded text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))] disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center">
                  <Icons.ChevronDown size={11} />
                </button>
              </div>
              <div className="text-[11px] font-mono text-[hsl(var(--muted-foreground))] tabular-nums">#{i+1}</div>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}

function DPSchedule({ tasks, schedule, setSchedule }) {
  const t = useT();
  // Unplaced tasks = anything in `tasks` whose id is not on a schedule slot.
  const placedIds = new Set(schedule.filter(s => s.taskId).map(s => s.taskId));
  const unplaced = tasks.filter(x => !placedIds.has(x.id));
  const [dragId, setDragId] = useState(null);
  const [overSlot, setOverSlot] = useState(null);

  const fmt = (m) => m < 60 ? `${m}min` : `${Math.floor(m / 60)}h${m % 60 ? " " + (m % 60) : ""}`;
  const colorByPrio = { URGENT: "danger", HIGH: "warning", MEDIUM: "info", LOW: "success" };

  const drop = (slotId, taskId) => {
    const task = tasks.find(x => x.id === taskId);
    if (!task) return;
    setSchedule(arr => arr.map(s => {
      if (s.id === slotId) {
        return { ...s, title: task.title, type: "task", taskId: task.id };
      }
      return s;
    }));
  };
  const unplace = (slotId) => {
    setSchedule(arr => arr.map(s => s.id === slotId ? { ...s, title: "", type: "drop", taskId: null, end: null } : s));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div>
        <SectionTitle>{t("dp.schedule.tasksToPlace")}</SectionTitle>
        <div className="space-y-2">
          {unplaced.map(x => (
            <div key={x.id}
              draggable
              onDragStart={(e) => { setDragId(x.id); e.dataTransfer.effectAllowed = "move"; try { e.dataTransfer.setData("text/plain", x.id); } catch {} }}
              onDragEnd={() => { setDragId(null); setOverSlot(null); }}
              className={cn(
                "flex items-center gap-2 p-2.5 rounded-[8px] border border-[hsl(var(--border))] bg-[hsl(var(--muted)/0.3)] cursor-grab hover:border-[hsl(var(--primary)/0.4)] transition-colors",
                dragId === x.id && "opacity-40"
              )}>
              <Icons.Drag size={14} className="text-[hsl(var(--muted-foreground))]" />
              <div className="flex-1 text-[13px] font-medium">{x.title}</div>
              <Badge variant={colorByPrio[x.priority] || "muted"}>{fmt(x.duration)}</Badge>
            </div>
          ))}
        </div>
        <div className="rounded-[10px] border border-dashed border-[hsl(var(--border))] p-6 text-center text-[12px] text-[hsl(var(--muted-foreground))] mt-3">
          {unplaced.length === 0 ? t("dp.schedule.allPlaced") : `${unplaced.length} task${unplaced.length > 1 ? "s" : ""} to place`}
        </div>
      </div>
      <div>
        <SectionTitle>Today · May 24</SectionTitle>
        <div className="rounded-[10px] border border-[hsl(var(--border))] overflow-hidden">
          {schedule.map(row => {
            const isDrop = row.type === "drop" && !row.taskId;
            const isOver = overSlot === row.id && dragId;
            return (
              <div key={row.id}
                onDragOver={(e) => { if (isDrop && dragId) { e.preventDefault(); setOverSlot(row.id); } }}
                onDragLeave={() => { if (overSlot === row.id) setOverSlot(null); }}
                onDrop={(e) => { if (isDrop && dragId) { e.preventDefault(); drop(row.id, dragId); } setDragId(null); setOverSlot(null); }}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 border-b border-[hsl(var(--border))] last:border-b-0 transition-colors group/slot",
                  isOver && "bg-[hsl(var(--primary)/0.08)] ring-1 ring-inset ring-[hsl(var(--primary)/0.5)]"
                )}>
                <div className="text-[11px] font-mono text-[hsl(var(--muted-foreground))] tabular-nums w-16">
                  {row.time}{row.end && <div>→ {row.end}</div>}
                </div>
                <div className={cn(
                  "flex-1 text-[13px] rounded-[6px] px-2 py-1.5 border-l-2 relative",
                  row.type === "meeting" ? "bg-[hsl(217_91%_60%/0.1)] border-l-[hsl(217_91%_60%)]" :
                  row.type === "task"    ? "bg-[hsl(263_70%_60%/0.1)] border-l-[hsl(263_70%_60%)]" :
                  row.type === "focus"   ? "bg-[hsl(142_70%_50%/0.1)] border-l-[hsl(142_70%_50%)] italic" :
                  row.type === "break"   ? "bg-[hsl(var(--muted)/0.4)] border-l-[hsl(var(--muted-foreground))] italic text-[hsl(var(--muted-foreground))]" :
                  "bg-[hsl(var(--muted)/0.2)] border-l-[hsl(var(--border))] italic text-[hsl(var(--muted-foreground))] border-dashed"
                )}>
                  {isDrop ? (
                    <span className="opacity-60">{isOver ? "Release to add" : t("dp.schedule.dropHere")}</span>
                  ) : row.title}
                  {row.taskId && (
                    <button onClick={() => unplace(row.id)} title="Remove"
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded hover:bg-[hsl(var(--accent))] text-[hsl(var(--muted-foreground))] opacity-0 group-hover/slot:opacity-100 flex items-center justify-center">
                      <Icons.X size={10} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function DPDocument() {
  return (
    <div className="max-w-2xl space-y-5">
      <Card padding="p-4">
        <div className="text-[12px] uppercase tracking-wider text-[hsl(var(--muted-foreground))] font-semibold mb-3">Summary of your day</div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          {[
            { v: "4", l: "Tasks" },
            { v: "3h00", l: "Work" },
            { v: "2", l: "Meetings" },
            { v: "5h", l: "Buffer" },
          ].map(s => (
            <div key={s.l} className="rounded-[8px] bg-[hsl(var(--muted)/0.4)] p-3">
              <div className="text-[22px] font-bold tabular-nums">{s.v}</div>
              <div className="text-[11px] text-[hsl(var(--muted-foreground))]">{s.l}</div>
            </div>
          ))}
        </div>
      </Card>

      <div>
        <SectionTitle>Notes & intentions</SectionTitle>
        <textarea
          className="w-full min-h-[140px] rounded-[10px] border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-4 py-3 text-[13.5px] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
          placeholder="Any particular intention for today?&#10;&#10;e.g. “Finish the proposal before 11am so I can prep the client call calmly.”"
          defaultValue=""
        />
      </div>

      <div className="flex items-center gap-3">
        <Switch checked onChange={() => {}} />
        <span className="text-[13px]">Start the first task now</span>
      </div>
    </div>
  );
}

/* ============================================================
   PAGE 11 — PLANNER (/planner) — command center
============================================================ */

/* Pomodoro duration stepper — round 44px tap target, disabled state grays out */
function Stepper({ dir, disabled, onClick, title }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={dir === "up" ? "Increase by 5 minutes" : "Decrease by 5 minutes"}
      className={cn(
        "w-11 h-11 rounded-full border flex items-center justify-center transition-all flex-shrink-0",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))]",
        disabled
          ? "border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] opacity-40 cursor-not-allowed bg-[hsl(var(--muted)/0.2)]"
          : "border-[hsl(var(--border))] text-[hsl(var(--foreground))] bg-[hsl(var(--background))] hover:bg-[hsl(var(--accent))] hover:border-[hsl(var(--primary)/0.5)] active:scale-95"
      )}
    >
      {dir === "up"
        ? <Icons.Plus size={16} stroke={2.4} />
        : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/></svg>}
    </button>
  );
}

/* ============================================================
   FOCUS VIEW PANELS (P24) — the same "Personnaliser" pattern as Home /
   Dashboard, generalized to a view's PANELS. Order + visibility persist per
   view in localStorage (dpm-layout-focus) via the shared useViewLayout engine.
   `session` is the REQUIRED core panel (movable, never hidden). `weight` drives
   flex-grow so hiding a panel lets the others — especially the Session — widen.
============================================================ */
const FOCUS_PANELS = [
  { id: "queue",    labelKey: "focusLayout.queue.label",    descKey: "focusLayout.queue.desc",    weight: 1 },
  { id: "session",  labelKey: "focusLayout.session.label",  descKey: "focusLayout.session.desc",  weight: 1.5, required: true },
  { id: "schedule", labelKey: "focusLayout.schedule.label", descKey: "focusLayout.schedule.desc", weight: 1 },
  { id: "music",    labelKey: "focusLayout.music.label",    descKey: "focusLayout.music.desc",    weight: 1, selfStart: true },
];

function PlannerPage({ setRoute, onOpenTask }) {
  const t = useT();
  const isMobile = window.useIsMobile ? window.useIsMobile() : false;
  // Local task queue (mutable for reordering). We carry the original list shape.
  const [taskQueue, setTaskQueue] = useState([
    { id: 1, t: "Stand-up · notes",         d: "10min", p: "muted",   done: true  },
    { id: 2, t: "Desjardins proposal",   d: "2h",    p: "danger"   },
    { id: 3, t: "Review PR #142",           d: "45min", p: "warning"  },
    { id: 4, t: "Supplier emails",          d: "30min", p: "primary"  },
    { id: 5, t: "Q2 presentation",          d: "3h",    p: "warning"  },
  ]);
  // The task the user is hovering on / has selected (preview).
  // Defaults to the second one to preserve the demo.
  const [selectedTask, setSelectedTask] = useState(2);
  // The task that's LOCKED in (set when user clicks Démarrer). null = no lock.
  const [lockedTask, setLockedTask] = useState(null);
  const [focusActive, setFocusActive] = useState(false);
  const [duration, setDuration] = useState(60);
  const [skipBreaks, setSkipBreaks] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState("");
  const editRef = useRef(null);

  // Drag-reorder state on the queue
  const [dragId, setDragId] = useState(null);
  const [overId, setOverId] = useState(null);

  const reorder = (fromId, toId) => {
    if (fromId === toId) return;
    setTaskQueue(arr => {
      const next = arr.slice();
      const fromIdx = next.findIndex(x => x.id === fromId);
      const toIdx = next.findIndex(x => x.id === toId);
      if (fromIdx < 0 || toIdx < 0) return arr;
      const [moved] = next.splice(fromIdx, 1);
      const insertAt = fromIdx < toIdx ? toIdx - 1 : toIdx;
      next.splice(insertAt, 0, moved);
      return next;
    });
  };

  const FOCUS_MIN = 15;
  const FOCUS_MAX = 240;
  const FOCUS_STEP = 15;
  const SEGMENT_MIN = 30;
  const BREAK_MIN = 5;
  const locked = focusActive || lockedTask !== null;
  const atMin = duration <= FOCUS_MIN;
  const atMax = duration >= FOCUS_MAX;

  const autoBreaks = Math.max(0, Math.floor(duration / SEGMENT_MIN) - 1);
  const effectiveBreaks = skipBreaks ? 0 : autoBreaks;
  const schedule = (() => {
    if (skipBreaks || autoBreaks === 0) return [{ kind: "focus", min: duration }];
    const segs = [];
    let remaining = duration;
    while (remaining > 0) {
      const f = Math.min(SEGMENT_MIN, remaining);
      segs.push({ kind: "focus", min: f });
      remaining -= f;
      if (remaining > 0) segs.push({ kind: "break", min: BREAK_MIN });
    }
    return segs;
  })();
  const totalWithBreaks = duration + effectiveBreaks * BREAK_MIN;

  const countdownLabel = (() => {
    const total = duration * 60;
    const remaining = Math.max(0, Math.floor(total * 0.62));
    const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
    const ss = String(remaining % 60).padStart(2, "0");
    return `${mm}:${ss}`;
  })();

  // The visible "tâche en cours" reflects the LOCKED task once started, or
  // the user's current selection (preview) otherwise.
  const shownTaskId = lockedTask ?? selectedTask;
  const shownTask = taskQueue.find(x => x.id === shownTaskId) || taskQueue[0];

  const startEdit = () => {
    if (locked) return;
    setEditValue(String(duration));
    setEditing(true);
    requestAnimationFrame(() => { editRef.current?.focus(); editRef.current?.select(); });
  };
  const commitEdit = () => {
    const n = parseInt(editValue, 10);
    if (Number.isFinite(n) && n >= FOCUS_MIN && n <= FOCUS_MAX) setDuration(n);
    setEditing(false);
  };
  const cancelEdit = () => setEditing(false);
  const step = (delta) => {
    if (locked) return;
    setDuration(d => {
      const snapped = Math.round(d / FOCUS_STEP) * FOCUS_STEP;
      return Math.max(FOCUS_MIN, Math.min(FOCUS_MAX, snapped + delta));
    });
  };

  const handleSelect = (id) => {
    if (lockedTask !== null) return; // can't change selection while locked
    setSelectedTask(id);
  };
  const startSession = () => {
    setLockedTask(selectedTask);
    setFocusActive(true);
  };
  const endSession = () => {
    setLockedTask(null);
    setFocusActive(false);
  };
  const restartSession = () => {
    setFocusActive(false);
    setLockedTask(null);
    // user can now pick another task
  };

  // ---- View layout (P24): per-view order + visibility of Focus panels ----
  const [customizing, setCustomizing] = useState(false);
  const layout = window.useViewLayout("focus", FOCUS_PANELS);
  const { visible: pVisible, toggle: pToggle, reset: pReset, hideAll: pHideAll, order: pOrder, reorder: pReorder, move: pMove } = layout;
  const panelMeta = useMemo(() => Object.fromEntries(FOCUS_PANELS.map(p => [p.id, p])), []);
  const focusPanelsT = useMemo(() => FOCUS_PANELS.map(p => ({ ...p, label: t(p.labelKey), desc: t(p.descKey), group: t("layout.group") })), [t]);
  const orderedVisible = pOrder.filter(id => panelMeta[id] && pVisible[id] !== false);
  const layoutTotal = FOCUS_PANELS.length;
  const layoutVisible = FOCUS_PANELS.filter(p => pVisible[p.id] !== false).length;
  const [panelDrag, setPanelDrag] = useState(null);
  const [panelOver, setPanelOver] = useState(null);

  // ---- Panel content renderers (kept here for access to session state) ----
  const renderQueue = () => (
    <Card padding="p-0" className={cn("flex flex-col min-h-0", isMobile ? "" : "h-full")} data-tour="feat-focus-queue">
      <div className="p-4 border-b border-[hsl(var(--border))]">
        <div className="flex items-center justify-between">
          <h3 className="text-[13px] font-semibold">{t("focus.queue")}</h3>
          <span className="text-[11px] text-[hsl(var(--muted-foreground))]">{taskQueue.filter(x => !x.done).length} {t("focus.remaining")}</span>
        </div>
        {lockedTask !== null && (
          <div className="mt-2 text-[10.5px] flex items-center gap-1.5 text-[hsl(38_92%_70%)] bg-[hsl(38_92%_55%/0.08)] border border-[hsl(38_92%_55%/0.3)] rounded-md px-2 py-1">
            <Icons.Lock size={10} /> {t("focus.locked")}
          </div>
        )}
        {lockedTask === null && (
          <div className="mt-2 text-[10.5px] text-[hsl(var(--muted-foreground))] italic">
            {t("focus.selectToStart")}
          </div>
        )}
      </div>
      <div className={cn("p-3 space-y-1.5", isMobile ? "" : "flex-1 overflow-y-auto")}>
        {taskQueue.map(taskItem => {
          const isSelected = shownTaskId === taskItem.id;
          const isLockedRow = lockedTask === taskItem.id;
          const disabled = lockedTask !== null && !isLockedRow;
          const isOver = overId === taskItem.id && dragId && dragId !== taskItem.id;
          return (
            <React.Fragment key={taskItem.id}>
              {isOver && <div className="h-1 -my-0.5 rounded-full bg-[hsl(var(--primary))] shadow-[0_0_0_3px_hsl(var(--primary)/0.25)]" />}
              <div
                onClick={() => !disabled && handleSelect(taskItem.id)}
                draggable={!locked && !customizing}
                onDragStart={(e) => { if (locked || customizing) return; setDragId(taskItem.id); e.dataTransfer.effectAllowed = "move"; try { e.dataTransfer.setData("text/plain", String(taskItem.id)); } catch {} }}
                onDragOver={(e) => { if (dragId && dragId !== taskItem.id) { e.preventDefault(); setOverId(taskItem.id); } }}
                onDragLeave={() => { if (overId === taskItem.id) setOverId(null); }}
                onDrop={(e) => { e.preventDefault(); if (dragId && dragId !== taskItem.id) reorder(dragId, taskItem.id); setDragId(null); setOverId(null); }}
                onDragEnd={() => { setDragId(null); setOverId(null); }}
                className={cn(
                  "w-full flex items-center gap-2.5 p-3 rounded-[8px] text-left transition-all",
                  disabled && "opacity-40 cursor-not-allowed",
                  !disabled && !locked && "cursor-pointer",
                  isLockedRow ? "bg-[hsl(38_92%_55%/0.12)] border border-[hsl(38_92%_55%/0.4)]" :
                  isSelected ? "bg-[hsl(var(--primary)/0.1)] border border-[hsl(var(--primary)/0.4)]" :
                  "hover:bg-[hsl(var(--accent)/0.3)] border border-transparent",
                  dragId === taskItem.id && "opacity-40"
                )}
              >
                <Checkbox checked={taskItem.done} onChange={() => {}} />
                <div className="flex-1 min-w-0">
                  <div className={cn("text-[13px] font-medium truncate", taskItem.done && "line-through text-[hsl(var(--muted-foreground))]")}>{taskItem.t}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={taskItem.p} dot={taskItem.p !== "muted"} className="text-[10px]">{taskItem.d}</Badge>
                    {isLockedRow && <span className="text-[10px] text-[hsl(38_92%_65%)] font-semibold uppercase tracking-wider flex items-center gap-1"><Icons.Lock size={9} /> {t("focus.taskInProgress")}</span>}
                    {!isLockedRow && isSelected && lockedTask === null && <span className="text-[10px] text-[hsl(var(--primary))] font-semibold uppercase tracking-wider">Selected</span>}
                  </div>
                </div>
                {!locked && !customizing && <Icons.Drag size={12} className="text-[hsl(var(--muted-foreground))]" />}
                {isLockedRow && <Icons.Lock size={12} className="text-[hsl(38_92%_65%)]" />}
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </Card>
  );

  const renderSession = () => (
    <Card padding="p-6" className={cn("flex flex-col", isMobile ? "" : "h-full")} data-tour="feat-focus-timer">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[13px] font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">{t("focus.session")}</h3>
        <Badge variant="primary" dot>{duration} min · {effectiveBreaks} break{effectiveBreaks > 1 ? "s" : ""}</Badge>
      </div>

      {!focusActive && (
        <p className="text-[12.5px] text-[hsl(var(--muted-foreground))] leading-relaxed mb-4" style={{ textWrap: "pretty" }}>
          Notifications will be silenced during the session. For longer sessions, short breaks are added to recharge you.
        </p>
      )}

      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div className="text-[10px] uppercase tracking-[0.2em] text-[hsl(var(--muted-foreground))] font-semibold mb-1">{t("focus.currentTask")}</div>
        <h2 className="text-[20px] font-bold tracking-tight max-w-xs mb-5">{shownTask?.t}</h2>

        <Ring value={focusActive ? 62 : 0} size={200} stroke={10} color="263 70% 60%">
          {focusActive ? (
            <div className="flex flex-col items-center">
              <div className="text-[40px] font-bold tabular-nums leading-none">{countdownLabel}</div>
              <div className="text-[11px] text-[hsl(var(--muted-foreground))] uppercase tracking-wider mt-2 flex items-center gap-1.5">
                <Icons.Lock size={10} /> Focus in progress
              </div>
            </div>
          ) : editing ? (
            <div className="flex flex-col items-center">
              <div className="flex items-baseline gap-1.5">
                <input
                  ref={editRef}
                  type="number"
                  inputMode="numeric"
                  min={FOCUS_MIN}
                  max={FOCUS_MAX}
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value.replace(/[^\d]/g, ""))}
                  onBlur={commitEdit}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") { e.preventDefault(); commitEdit(); }
                    else if (e.key === "Escape") { e.preventDefault(); cancelEdit(); }
                  }}
                  className="w-[100px] text-center text-[52px] font-bold tabular-nums leading-none bg-transparent border-b-2 border-[hsl(var(--primary))] focus:outline-none caret-[hsl(var(--primary))] appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <span className="text-[14px] text-[hsl(var(--muted-foreground))] font-medium">min</span>
              </div>
              <div className="text-[10.5px] text-[hsl(var(--muted-foreground))] mt-2.5 leading-tight">
                Enter to confirm · Esc to cancel
              </div>
            </div>
          ) : (
            <button
              type="button"
              onDoubleClick={startEdit}
              title="Double-click to edit the duration"
              className="group flex flex-col items-center bg-transparent border-0 p-0 cursor-text focus:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] rounded-md transition-colors"
            >
              <div className="flex items-baseline gap-1.5">
                <span className="text-[52px] font-bold tabular-nums leading-none group-hover:text-[hsl(var(--primary))] transition-colors">{duration}</span>
                <span className="text-[14px] text-[hsl(var(--muted-foreground))] font-medium">min</span>
              </div>
              <div className="text-[10.5px] text-[hsl(var(--muted-foreground))] uppercase tracking-[0.16em] mt-1.5 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity">
                Double-click to edit
              </div>
            </button>
          )}
        </Ring>

        <div className="flex items-center gap-3 mt-5" role="group" aria-label="Adjust the duration">
          <Stepper dir="down" disabled={locked || atMin} onClick={() => step(-FOCUS_STEP)} title={locked ? "Locked during the session" : atMin ? "Minimum 15 min" : "−15 minutes"} />
          <div className="min-w-[110px] text-center">
            <div className={cn("text-[12px] font-medium transition-colors", locked ? "text-[hsl(var(--muted-foreground))]" : skipBreaks ? "text-[hsl(38_92%_60%)]" : "text-[hsl(263_70%_75%)]")}>
              {locked ? "Locked" : skipBreaks ? t("focus.noBreaks") : `${t("focus.youWillHave")} ${autoBreaks} break${autoBreaks > 1 ? "s" : ""}`}
            </div>
            <div className="text-[9.5px] text-[hsl(var(--muted-foreground))]/70 mt-0.5 tabular-nums">
              steps of {FOCUS_STEP} min · {FOCUS_MIN}–{FOCUS_MAX} min
            </div>
          </div>
          <Stepper dir="up" disabled={locked || atMax} onClick={() => step(FOCUS_STEP)} title={locked ? "Locked during the session" : atMax ? "Maximum 4h" : "+15 minutes"} />
        </div>

        <label className={cn(
          "mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-[8px] border text-[12px] transition-all cursor-pointer select-none",
          locked && "opacity-50 cursor-not-allowed",
          skipBreaks
            ? "bg-[hsl(38_92%_55%/0.12)] border-[hsl(38_92%_55%/0.45)] text-[hsl(38_92%_70%)]"
            : "bg-[hsl(var(--card))] border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:border-[hsl(var(--primary)/0.4)] hover:text-[hsl(var(--foreground))]"
        )}>
          <input
            type="checkbox"
            checked={skipBreaks}
            disabled={locked}
            onChange={(e) => setSkipBreaks(e.target.checked)}
            className="sr-only peer"
          />
          <span className={cn(
            "w-4 h-4 rounded border flex items-center justify-center transition-all",
            skipBreaks ? "bg-[hsl(38_92%_55%)] border-[hsl(38_92%_55%)]" : "bg-transparent border-[hsl(var(--muted-foreground)/0.5)]"
          )}>
            {skipBreaks && <Icons.Check size={10} stroke={3.5} className="text-[hsl(var(--background))]" />}
          </span>
          {t("focus.skipBreaks")}
        </label>

        {!focusActive && (
          <div className="w-full mt-5 px-1">
            <div className="text-[10.5px] uppercase tracking-wider text-[hsl(var(--muted-foreground))] font-semibold mb-2 flex items-center justify-between">
              <span>{t("focus.run")}</span>
              <span className="font-mono tabular-nums normal-case tracking-normal">{totalWithBreaks} min total</span>
            </div>
            <div className="flex items-stretch gap-0.5 h-6 rounded-[6px] overflow-hidden bg-[hsl(var(--muted)/0.3)]">
              {schedule.map((seg, i) => {
                const flex = seg.min;
                const isFocus = seg.kind === "focus";
                return (
                  <div
                    key={i}
                    title={`${isFocus ? "Focus" : "Break"} · ${seg.min} min`}
                    className={cn(
                      "flex items-center justify-center text-[9px] font-semibold tracking-wider transition-all",
                      isFocus
                        ? "bg-[hsl(263_70%_60%/0.85)] text-white"
                        : "bg-[hsl(38_92%_55%/0.85)] text-[hsl(38_92%_15%)]"
                    )}
                    style={{ flex }}
                  >
                    {seg.min >= 15 ? `${seg.min}'` : ""}
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-center gap-4 mt-2 text-[10px] text-[hsl(var(--muted-foreground))]">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-[hsl(263_70%_60%)]"/>Focus</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-[hsl(38_92%_55%)]"/>Break {BREAK_MIN} min</span>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 mt-5">
          <Button variant="ghost" size="iconSm" title={t("common.restart")} onClick={restartSession}><Icons.Refresh size={16}/></Button>
          {!locked && (
            <Button size="lg" icon={Icons.Play} onClick={startSession}>{t("focus.start")}</Button>
          )}
          {locked && focusActive && (
            <Button size="lg" icon={Icons.Pause} variant="outline" onClick={() => setFocusActive(false)}>{t("common.pause")}</Button>
          )}
          {locked && !focusActive && (
            <Button size="lg" icon={Icons.Play} variant="outline" onClick={() => setFocusActive(true)}>{t("common.resume")}</Button>
          )}
          {lockedTask !== null && (
            <Button size="lg" variant="destructive" icon={Icons.Check} onClick={endSession}>{t("focus.endSession")}</Button>
          )}
          <Button variant="ghost" size="iconSm" title="Skip"><Icons.SkipForward size={16}/></Button>
        </div>
      </div>
    </Card>
  );

  const renderSchedule = () => (
    <Card padding="p-0" className={cn("flex flex-col min-h-0", isMobile ? "" : "h-full")}>
      <div className="p-4 border-b border-[hsl(var(--border))]">
        <div className="flex items-center justify-between">
          <h3 className="text-[13px] font-semibold">{t("focus.programme")}</h3>
          <span className="text-[11px] text-[hsl(var(--muted-foreground))] font-mono tabular-nums">14:32</span>
        </div>
      </div>
      <div className={isMobile ? "" : "flex-1 overflow-y-auto"}>
        <MiniTimeline />
      </div>
    </Card>
  );

  const renderPanel = (id) =>
    id === "queue" ? renderQueue() :
    id === "session" ? renderSession() :
    id === "schedule" ? renderSchedule() :
    id === "music" ? <FocusMusicPanel /> : null;

  // Edit-mode control strip for a panel (drag handle, arrows, hide/lock).
  const PanelEditBar = ({ id }) => {
    const meta = panelMeta[id];
    const idx = orderedVisible.indexOf(id);
    return (
      <div className="flex items-center gap-1 mb-2 px-1.5 py-1 rounded-[8px] bg-[hsl(var(--primary)/0.08)] border border-[hsl(var(--primary)/0.2)]">
        <button type="button" draggable
          onDragStart={(e) => { setPanelDrag(id); e.dataTransfer.effectAllowed = "move"; try { e.dataTransfer.setData("text/plain", id); } catch (x) {} }}
          onDragEnd={() => { setPanelDrag(null); setPanelOver(null); }}
          title={t("layout.dragReorder")} aria-label={t("layout.dragReorder")}
          className="w-7 h-7 rounded-md flex items-center justify-center text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] cursor-grab active:cursor-grabbing">
          <Icons.Drag size={13} />
        </button>
        <span className="flex-1 min-w-0 truncate text-[12px] font-semibold">{t(meta.labelKey)}</span>
        <button type="button" onClick={() => pMove(id, -1)} disabled={idx <= 0}
          title={t("layout.moveLeft")} aria-label={t("layout.moveLeft")}
          className="w-7 h-7 rounded-md flex items-center justify-center text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary))] disabled:opacity-30 disabled:pointer-events-none">
          <Icons.ChevronLeft size={14} />
        </button>
        <button type="button" onClick={() => pMove(id, 1)} disabled={idx >= orderedVisible.length - 1}
          title={t("layout.moveRight")} aria-label={t("layout.moveRight")}
          className="w-7 h-7 rounded-md flex items-center justify-center text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary))] disabled:opacity-30 disabled:pointer-events-none">
          <Icons.ChevronRight size={14} />
        </button>
        {meta.required ? (
          <span title={t("layout.requiredTip")} className="w-7 h-7 rounded-md flex items-center justify-center text-[hsl(var(--muted-foreground))]">
            <Icons.Lock size={13} />
          </span>
        ) : (
          <button type="button" onClick={() => pToggle(id)} title={t("layout.hidePanel")} aria-label={t("layout.hidePanel")}
            className="w-7 h-7 rounded-md flex items-center justify-center text-[hsl(var(--muted-foreground))] hover:text-[hsl(0_84%_70%)] hover:bg-[hsl(0_84%_60%/0.12)]">
            <Icons.X size={14} />
          </button>
        )}
      </div>
    );
  };

  return (
    <div className={cn(isMobile ? "flex flex-col gap-4" : "h-full flex gap-4 items-stretch min-h-0")}>
      <div className={cn("min-w-0", isMobile ? "flex flex-col gap-4" : "flex-1 h-full flex flex-col gap-4")}>
        {/* Toolbar */}
        <div className="flex items-center gap-3 flex-wrap">
          <div>
            <h1 className="text-[22px] font-bold tracking-tight">{t("focus.title")}</h1>
            <p className="text-[12px] text-[hsl(var(--muted-foreground))] mt-0.5">Saturday May 24 · {taskQueue.length} tasks · 3h planned</p>
          </div>
          <div className="flex-1" />
          <ModuleTutorialButton module="planner" />
          <button
            onClick={() => setCustomizing(c => !c)}
            className={cn(
              "inline-flex items-center gap-2 h-8 px-3 rounded-[8px] text-[13px] font-medium border transition-colors whitespace-nowrap",
              customizing
                ? "border-[hsl(var(--primary)/0.55)] bg-[hsl(var(--primary)/0.12)] text-[hsl(var(--foreground))]"
                : "border-[hsl(var(--border))] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))]"
            )}
          >
            <Icons.Layout size={14} className={cn(customizing && "text-[hsl(var(--primary))]")} />
            {t("layout.customize")}
            <span className="px-1.5 py-0.5 rounded-full bg-[hsl(var(--primary)/0.18)] text-[hsl(263_70%_80%)] text-[10px] font-mono tabular-nums">{layoutVisible}/{layoutTotal}</span>
          </button>
          <Button variant="outline" size="sm" icon={Icons.Calendar} onClick={() => setRoute("calendar")}>{t("nav.calendar")}</Button>
          <Button variant="outline" size="sm" icon={Icons.Sunrise} onClick={() => setRoute("daily-planning")}>Re-plan</Button>
          <Button size="sm" icon={Icons.Plus} onClick={onOpenTask}>{t("tasks.new")}</Button>
        </div>

        {customizing && (
          <div className="flex items-center gap-2 text-[11.5px] text-[hsl(var(--muted-foreground))] px-1 -mt-1">
            <Icons.Sparkles size={12} className="text-[hsl(var(--primary))]" /> {t("layout.editHint")}
          </div>
        )}

        {orderedVisible.length === 0 ? (
          <Card className="flex-1 flex flex-col items-center justify-center text-center py-12">
            <Icons.Layout size={26} className="text-[hsl(var(--muted-foreground))] mb-3" />
            <p className="text-[13px] text-[hsl(var(--muted-foreground))] max-w-xs mb-4">{t("layout.editHint")}</p>
            <Button size="sm" icon={Icons.Refresh} onClick={pReset}>{t("common.reset") || "Reset"}</Button>
          </Card>
        ) : (
          <div className={cn("flex flex-col gap-4", isMobile ? "" : "lg:flex-row flex-1 min-h-0 items-stretch")}>
            {orderedVisible.map(id => {
              const meta = panelMeta[id];
              const isOver = customizing && panelOver === id && panelDrag && panelDrag !== id;
              return (
                <div
                  key={id}
                  draggable={customizing}
                  onDragStart={(e) => { if (customizing) { setPanelDrag(id); e.dataTransfer.effectAllowed = "move"; try { e.dataTransfer.setData("text/plain", id); } catch (x) {} } }}
                  onDragOver={(e) => { if (customizing && panelDrag && panelDrag !== id) { e.preventDefault(); e.dataTransfer.dropEffect = "move"; setPanelOver(id); } }}
                  onDragLeave={(e) => { if (e.currentTarget.contains(e.relatedTarget)) return; if (panelOver === id) setPanelOver(null); }}
                  onDrop={(e) => { e.preventDefault(); if (customizing && panelDrag && panelDrag !== id) pReorder(panelDrag, id); setPanelDrag(null); setPanelOver(null); }}
                  onDragEnd={() => { setPanelDrag(null); setPanelOver(null); }}
                  style={isMobile ? {} : { flexGrow: meta.weight, flexBasis: 0 }}
                  className={cn(
                    "min-w-0 flex flex-col",
                    !isMobile && "min-h-0",
                    meta.selfStart && !customizing && "lg:self-start",
                    customizing && "rounded-[14px] border-2 border-dashed p-2 transition-colors",
                    customizing && (isOver ? "border-[hsl(var(--primary))] bg-[hsl(var(--primary)/0.06)]" : "border-[hsl(var(--primary)/0.35)]"),
                    panelDrag === id && "opacity-40"
                  )}
                >
                  {customizing && <PanelEditBar id={id} />}
                  <div className="flex-1 min-h-0 flex flex-col">{renderPanel(id)}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {customizing && window.CustomizePanel && (
        <window.CustomizePanel
          visible={pVisible}
          onToggle={pToggle}
          onReset={pReset}
          onHideAll={pHideAll}
          onClose={() => setCustomizing(false)}
          visibleCount={layoutVisible}
          totalCount={layoutTotal}
          widgets={focusPanelsT}
          surfaceLabel={t("layout.viewSurface")}
          order={pOrder}
          onReorder={pReorder}
          onMove={pMove}
        />
      )}
    </div>
  );
}

function MiniTimeline() {
  const items = [
    { h: "09:00", t: "Team stand-up", type: "meeting", done: true },
    { h: "09:30", t: "Desjardins proposal", type: "task", active: true, h2: "13:47 → 15:47" },
    { h: "14:30", t: "Quick stand-up", type: "meeting", up: true },
    { h: "15:00", t: "Desjardins call", type: "meeting" },
    { h: "16:30", t: "Review PR #142", type: "task" },
    { h: "17:15", t: "Free focus", type: "focus" },
    { h: "19:00", t: "Reading", type: "habit" },
  ];
  return (
    <div>
      {items.map((it, i) => (
        <div key={i} className={cn(
          "flex items-stretch gap-3 px-4 py-2.5 border-b border-[hsl(var(--border))] last:border-0",
          it.up && "bg-[hsl(var(--primary)/0.05)]",
          it.done && "opacity-50"
        )}>
          <div className="text-[10.5px] font-mono text-[hsl(var(--muted-foreground))] tabular-nums w-12 pt-0.5">{it.h}</div>
          <div className={cn(
            "w-1 rounded-full flex-shrink-0",
            it.type === "meeting" ? "bg-[hsl(217_91%_60%)]" :
            it.type === "task" ? "bg-[hsl(263_70%_60%)]" :
            it.type === "focus" ? "bg-[hsl(142_70%_50%)]" :
            "bg-[hsl(38_92%_55%)]"
          )} />
          <div className="flex-1 min-w-0">
            <div className={cn("text-[12.5px] font-medium truncate", it.done && "line-through")}>{it.t}</div>
            {it.h2 && <div className="text-[10px] text-[hsl(var(--primary))] mt-0.5 font-mono tabular-nums">{it.h2}</div>}
            {it.up && !it.h2 && <div className="text-[10px] text-[hsl(var(--primary))] mt-0.5 font-medium">In 2 min</div>}
          </div>
        </div>
      ))}
    </div>
  );
}

Object.assign(window, { HomePage, DailyPlanningPage, PlannerPage });
