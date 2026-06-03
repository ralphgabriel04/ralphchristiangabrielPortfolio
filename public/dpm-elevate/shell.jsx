/* global React, Icons, Button, cn, Logo, Avatar, Badge, Switch, useState, useEffect, useT, useNotes */

/* ============================================================
   SHELL — Left sidebar + Main + Right sidebar
   Every nav item has a unique `id`. Active state tracks the
   clicked id, not the route — so duplicates (e.g. two items
   pointing to `/goals`) don't both light up.
============================================================ */

/* Nav data uses i18n keys (labelKey/titleKey). Components translate at render. */
const NAV_MAIN = [
  { id: "main:home",     labelKey: "nav.home",     icon: Icons.Home,     route: "home" },
  { id: "main:calendar", labelKey: "nav.calendar", icon: Icons.Calendar, route: "calendar" },
];

const NAV_SECTIONS = [
  {
    id: "daily", titleKey: "nav.daily", expanded: true,
    items: [
      { id: "daily:planning",  labelKey: "nav.daily.planning", icon: Icons.Sunrise, route: "daily-planning" },
      { id: "daily:focus",     labelKey: "nav.daily.focus",    icon: Icons.Zap,     route: "planner", badge: "Pomodoro" },
    ],
  },
  {
    id: "productivity", titleKey: "nav.productivity", expanded: true,
    items: [
      { id: "prod:tasks",  labelKey: "nav.tasks",  icon: Icons.CheckSquare, route: "tasks", badge: "12" },
      { id: "prod:matrix", labelKey: "nav.matrix", icon: Icons.Grid,        route: "matrix" },
      { id: "prod:habits", labelKey: "nav.habits", icon: Icons.Flame,       route: "habits" },
      { id: "prod:goals",  labelKey: "nav.goals",  icon: Icons.Target,      route: "goals" },
    ],
  },
  {
    id: "automation", titleKey: "nav.automation", expanded: false,
    items: [
      { id: "auto:rules", labelKey: "nav.rules", icon: Icons.Shield, route: "rules" },
    ],
  },
  {
    id: "insights", titleKey: "nav.insights", expanded: true,
    items: [
      { id: "insights:analytics", labelKey: "nav.dashboard", icon: Icons.BarChart, route: "dashboard" },
    ],
  },
];

const ALL_NAV = [
  ...NAV_MAIN,
  ...NAV_SECTIONS.flatMap(s => s.items),
];

// Default nav id for a route (used when route changes externally —
// e.g. user clicks a button in Home that calls setRoute("calendar"))
function defaultNavIdForRoute(route) {
  if (route === "settings") return "settings";
  if (route === "resources") return "resources";
  const hit = ALL_NAV.find(i => i.route === route);
  return hit ? hit.id : "main:home";
}

function Sidebar({ route, setRoute, navId, setNavId, collapsed, setCollapsed, theme, setTheme, lang, setLang, onOpenTask }) {
  const t = useT();
  const completedRaw = window.useTourCompleted ? window.useTourCompleted() : {};
  // Transitory ✓ — once every module's tour is seen, the marks retire and the
  // nav goes clean again (status stays persisted in dpm-tour-completed).
  const completed = (window.allModulesSeen && window.allModulesSeen(completedRaw)) ? {} : completedRaw;
  const [sections, setSections] = useState(() =>
    Object.fromEntries(NAV_SECTIONS.map(s => [s.id, s.expanded]))
  );
  const toggle = (id) => setSections(s => ({ ...s, [id]: !s[id] }));

  const go = (item) => {
    setNavId(item.id);
    setRoute(item.route);
  };

  if (collapsed) {
    return (
      <aside className="h-full bg-[hsl(var(--card))] border-r border-[hsl(var(--border))] flex flex-col items-center w-[60px]">
        {/* Header: logo + expand */}
        <div className="h-16 w-full flex flex-col items-center justify-center border-b border-[hsl(var(--border))] gap-1.5 px-2 py-2">
          <button onClick={() => go(NAV_MAIN[0])} title="DPM Elevate">
            <Logo size={28} withText={false} />
          </button>
        </div>
        <button
          onClick={() => setCollapsed(false)}
          className="w-9 h-7 mt-2 rounded-md hover:bg-[hsl(var(--accent))] flex items-center justify-center text-[hsl(var(--muted-foreground))]"
          title={t("nav.expandSidebar")}
        >
          <Icons.ChevronRight size={14} />
        </button>

        {/* Espace switcher (collapsed) */}
        <div className="mt-2"><SpaceSwitcher variant="rail" /></div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 w-full flex flex-col items-center gap-1">
          {NAV_MAIN.map(item => (
            <NavIcon key={item.id} item={{ ...item, label: t(item.labelKey) }} active={navId === item.id} onClick={() => go(item)} completed={completed} />
          ))}
          <div className="w-7 h-px bg-[hsl(var(--border))] my-1.5" />
          {NAV_SECTIONS.flatMap(s => s.items).map(item => (
            <NavIcon key={item.id} item={{ ...item, label: t(item.labelKey) }} active={navId === item.id} onClick={() => go(item)} completed={completed} />
          ))}
        </nav>

        {/* Bottom: settings only (le « + » et l'aide « ? » vivent ailleurs) */}
        <div className="w-full p-2 border-t border-[hsl(var(--border))] flex flex-col items-center gap-1">
          <NavIcon
            item={{ id: "settings", label: t("nav.settings"), icon: Icons.Settings, route: "settings" }}
            active={route === "settings"}
            onClick={() => { setNavId("settings"); setRoute("settings"); }}
            completed={completed}
          />
        </div>
      </aside>
    );
  }

  return (
    <aside className="h-full bg-[hsl(var(--card))] border-r border-[hsl(var(--border))] flex flex-col w-[232px]">
      {/* Header — logo + collapse toggle stays here in BOTH states */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-[hsl(var(--border))]">
        <button onClick={() => go(NAV_MAIN[0])} className="flex items-center gap-2.5">
          <Logo size={32} />
        </button>
        <button
          onClick={() => setCollapsed(true)}
          className="w-7 h-7 rounded-md hover:bg-[hsl(var(--accent))] flex items-center justify-center text-[hsl(var(--muted-foreground))]"
          title={t("nav.collapseSidebar")}
        >
          <Icons.ChevronLeft size={14} />
        </button>
      </div>

      {/* Espace switcher (P20) — sous le logo, au-dessus de Nouvelle tâche */}
      <div className="px-3 pt-3">
        <SpaceSwitcher variant="bar" />
      </div>

      {/* Quick action — new task (hérite de l'espace courant) */}
      <div className="px-3 pt-2">
        <NewTaskButton onOpenTask={onOpenTask} t={t} />
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* Main nav */}
        <div className="space-y-0.5">
          {NAV_MAIN.map(item => (
            <NavLink key={item.id} item={{ ...item, label: t(item.labelKey) }} active={navId === item.id} onClick={() => go(item)} completed={completed} />
          ))}
        </div>

        {/* Sections */}
        {NAV_SECTIONS.map(s => (
          <div key={s.id} className="space-y-0.5">
            <button
              onClick={() => toggle(s.id)}
              className="w-full flex items-center justify-between px-2.5 py-1.5 text-[10.5px] font-semibold text-[hsl(var(--muted-foreground))] tracking-[0.08em] hover:text-[hsl(var(--foreground))]"
            >
              <span>{t(s.titleKey)}</span>
              <Icons.ChevronDown size={11} className={cn("transition-transform duration-150", !sections[s.id] && "-rotate-90")} />
            </button>
            {sections[s.id] && (
              <div className="space-y-0.5">
                {s.items.map(item => (
                  <NavLink key={item.id} item={{ ...item, label: t(item.labelKey) }} active={navId === item.id} onClick={() => go(item)} indent completed={completed} />
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Other */}
        <div className="space-y-0.5">
          <div className="px-2.5 py-1.5 text-[10.5px] font-semibold text-[hsl(var(--muted-foreground))] tracking-[0.08em]">OTHER</div>
          <NavLink
            item={{ id: "resources", label: "Help & Resources", icon: Icons.HelpCircle, route: "resources" }}
            active={navId === "resources" || route === "resources"}
            onClick={() => { setNavId("resources"); setRoute("resources"); }}
            indent
            completed={completed}
          />
        </div>
      </nav>

      {/* Bottom */}
      <div className="border-t border-[hsl(var(--border))] p-3 space-y-2">
        <NavLink
          item={{ id: "settings", label: t("nav.settings"), icon: Icons.Settings, route: "settings" }}
          active={navId === "settings" || route === "settings"}
          onClick={() => { setNavId("settings"); setRoute("settings"); }}
          completed={completed}
        />
        <div className="flex items-center justify-between px-2.5 pt-1">
          <div className="flex items-center gap-1">
            <div className="flex items-center p-0.5 rounded-md bg-[hsl(var(--muted)/0.5)] border border-[hsl(var(--border))]">
              {["fr", "en"].map(code => (
                <button
                  key={code}
                  onClick={() => setLang(code)}
                  aria-pressed={lang === code}
                  className={cn(
                    "px-2 py-0.5 rounded-[5px] text-[11px] font-semibold uppercase transition-colors",
                    lang === code
                      ? "bg-[hsl(var(--primary))] text-white shadow-sm"
                      : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
                  )}
                >
                  {code}
                </button>
              ))}
            </div>
            <button
              onClick={() => setTheme(t => t === "dark" ? "light" : "dark")}
              className="w-7 h-7 rounded-md hover:bg-[hsl(var(--accent))] flex items-center justify-center text-[hsl(var(--muted-foreground))]"
              title="Theme"
            >
              {theme === "dark" ? <Icons.Moon size={14} /> : <Icons.Sun size={14} />}
            </button>
          </div>
          <span className="text-[10px] text-[hsl(var(--muted-foreground))] font-mono">v0.1.0</span>
        </div>
      </div>
    </aside>
  );
}

function NavLink({ item, active, onClick, indent = false, completed }) {
  const done = completed && item.route && completed[item.route];
  return (
    <button
      onClick={onClick}
      data-tour={item.route ? "nav-" + item.route : undefined}
      className={cn(
        "w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-[7px] text-[13px] font-medium transition-all duration-150 text-left",
        indent && "ml-1",
        active
          ? "bg-[hsl(var(--space-accent))] text-white shadow-sm shadow-[hsl(var(--space-accent)/0.25)]"
          : "text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--foreground))]"
      )}
    >
      <item.icon size={16} className="flex-shrink-0" />
      <span className="flex-1 truncate">{item.label}</span>
      {done && (
        <span
          title="Tour seen"
          className={cn(
            "flex-shrink-0 w-3.5 h-3.5 rounded-full flex items-center justify-center",
            active ? "bg-white/25" : "bg-[hsl(142_70%_45%/0.18)]"
          )}
        >
          <Icons.Check size={9} stroke={3} className={active ? "text-white" : "text-[hsl(142_70%_60%)]"} />
        </span>
      )}
      {item.badge && (
        <span className={cn(
          "text-[10px] px-1.5 py-0.5 rounded-full font-semibold flex-shrink-0",
          active ? "bg-white/20" : "bg-[hsl(var(--primary)/0.15)] text-[hsl(263_70%_75%)]"
        )}>{item.badge}</span>
      )}
    </button>
  );
}

function NavIcon({ item, active, onClick, completed }) {
  const done = completed && item.route && completed[item.route];
  return (
    <button
      onClick={onClick}
      title={item.label}
      data-tour={item.route ? "nav-" + item.route : undefined}
      className={cn(
        "relative w-10 h-10 rounded-[8px] flex items-center justify-center transition-colors",
        active
          ? "bg-[hsl(var(--space-accent))] text-white shadow-sm shadow-[hsl(var(--space-accent)/0.25)]"
          : "text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--foreground))]"
      )}
    >
      <item.icon size={17} />
      {done && (
        <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-[hsl(142_70%_45%)] border-2 border-[hsl(var(--card))] flex items-center justify-center" />
      )}
    </button>
  );
}

/* ============================================================
   RIGHT SIDEBAR
============================================================ */

function RightSidebar({ collapsed, setCollapsed, setRoute, onOpenTask, route }) {
  const t = useT();
  // Hide the mini-calendar in the right sidebar when the main view is
  // already the Calendar route — the big calendar makes the mini one redundant.
  // i18n keys touched here: rightSidebar.miniCalendar (now route-conditional).
  const hideMiniCalendar = route === "calendar";

  if (collapsed) {
    const collapsedItems = [
      { I: Icons.Calendar, label: t("nav.calendar"), id: "mini" },
      { I: Icons.CheckSquare, label: t("nav.tasks"), id: "tasks" },
      { I: Icons.Pen, label: t("nav.quickNotes"), id: "notes" },
      { I: Icons.Bell, label: "Notifications", id: "notifs" },
    ].filter(x => !(hideMiniCalendar && x.id === "mini"));

    return (
      <aside className="h-full bg-[hsl(var(--card))] border-l border-[hsl(var(--border))] flex flex-col items-center w-[48px]">
        <div className="h-12 flex items-center justify-center border-b border-[hsl(var(--border))] w-full">
          <button onClick={() => setCollapsed(false)} className="w-8 h-8 rounded-md flex items-center justify-center text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))]" title={t("nav.expandSidebar")}>
            <Icons.ChevronLeft size={14} />
          </button>
        </div>
        <div className="flex-1 py-2 flex flex-col items-center gap-1">
          {collapsedItems.map((x, i) => (
            <button key={i} title={x.label} className="w-9 h-9 rounded-[8px] flex items-center justify-center text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))]">
              <x.I size={16} />
            </button>
          ))}
        </div>
        <div className="p-2 border-t border-[hsl(var(--border))] w-full flex flex-col items-center gap-1">
          <TourHelpButton anchor="dock-rail" onOpenResources={() => setRoute?.("resources")} />
        </div>
      </aside>
    );
  }

  return (
    <aside className="h-full bg-[hsl(var(--card))] border-l border-[hsl(var(--border))] flex flex-col w-[260px]">
      <div className="h-12 px-4 flex items-center justify-between border-b border-[hsl(var(--border))]">
        <span className="text-[11px] font-semibold text-[hsl(var(--muted-foreground))] tracking-[0.08em]">{t("nav.context")}</span>
        <button onClick={() => setCollapsed(true)} className="w-7 h-7 rounded-md hover:bg-[hsl(var(--accent))] flex items-center justify-center text-[hsl(var(--muted-foreground))]">
          <Icons.ChevronRight size={14} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-5">
        {!hideMiniCalendar && <MiniCalendar />}
        <UpcomingTasks setRoute={setRoute} />
        <QuickNotes />
      </div>
      {/* Docked help & guided tour (P19/P15) — lives in the CONTEXTE sidebar,
          never floats over content. */}
      <div className="p-2 border-t border-[hsl(var(--border))]">
        <TourHelpButton anchor="dock-bar" onOpenResources={() => setRoute?.("resources")} />
      </div>
    </aside>
  );
}

function MiniCalendar() {
  const [month, setMonth] = useState(4);
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const days = ["M","T","W","T","F","S","S"];
  const startDay = 4;
  const daysInMonth = 31;
  const today = 24;
  const cells = [];
  for (let i = 0; i < startDay; i++) cells.push(null);
  for (let i = 1; i <= daysInMonth; i++) cells.push(i);
  while (cells.length % 7) cells.push(null);

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[12px] font-semibold">{months[month]} 2026</span>
        <div className="flex items-center gap-0.5">
          <button onClick={() => setMonth(m => Math.max(0, m-1))} className="w-6 h-6 rounded hover:bg-[hsl(var(--accent))] flex items-center justify-center text-[hsl(var(--muted-foreground))]">
            <Icons.ChevronLeft size={12} />
          </button>
          <button onClick={() => setMonth(m => Math.min(11, m+1))} className="w-6 h-6 rounded hover:bg-[hsl(var(--accent))] flex items-center justify-center text-[hsl(var(--muted-foreground))]">
            <Icons.ChevronRight size={12} />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-0.5 text-center mb-1">
        {days.map((d, i) => <div key={i} className="text-[10px] text-[hsl(var(--muted-foreground))] py-1">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-0.5 text-center">
        {cells.map((c, i) => (
          <button
            key={i}
            disabled={!c}
            className={cn(
              "h-6 text-[11px] rounded transition-colors",
              !c && "invisible",
              c === today
                ? "bg-[hsl(var(--primary))] text-white font-semibold"
                : c && [22, 23, 25, 27, 29].includes(c)
                  ? "text-[hsl(var(--foreground))] relative after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:rounded-full after:bg-[hsl(var(--primary))]"
                  : "text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))]"
            )}
          >{c}</button>
        ))}
      </div>
    </div>
  );
}

function UpcomingTasks({ setRoute }) {
  const t = useT();
  const tasks = [
    { title: "Review PR #142", time: t("common.today"), priority: "warning" },
    { title: "Desjardins proposal", time: t("common.tomorrow"), priority: "danger" },
    { title: "Q2 presentation", time: "Friday", priority: "warning" },
  ];
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[12px] font-semibold">{t("nav.upcoming")}</span>
        <button onClick={() => setRoute?.("tasks")} className="text-[11px] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]">{t("nav.viewAll")}</button>
      </div>
      <div className="space-y-1">
        {tasks.map((t, i) => (
          <button key={i} className="w-full flex items-center gap-2 p-2 rounded-md hover:bg-[hsl(var(--accent))] text-left transition-colors">
            <div className={cn(
              "w-1 h-7 rounded-full",
              t.priority === "danger" ? "bg-[hsl(0_84%_60%)]" : "bg-[hsl(38_92%_55%)]"
            )} />
            <div className="flex-1 min-w-0">
              <div className="text-[12px] font-medium truncate">{t.title}</div>
              <div className="text-[10.5px] text-[hsl(var(--muted-foreground))]">{t.time}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function QuickNotes() {
  const t = useT();
  const [notes, { add, update, remove }] = useNotes();
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const inputRef = useRef(null);
  const editRef = useRef(null);

  useEffect(() => {
    if (adding) requestAnimationFrame(() => inputRef.current?.focus());
  }, [adding]);
  useEffect(() => {
    if (editingId) requestAnimationFrame(() => editRef.current?.focus());
  }, [editingId]);

  const submit = () => {
    if (draft.trim()) add(draft.trim());
    setDraft(""); setAdding(false);
  };
  const startEdit = (n) => { setEditingId(n.id); setEditText(n.text); };
  const commitEdit = () => {
    if (editingId && editText.trim()) update(editingId, editText.trim());
    setEditingId(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[12px] font-semibold">{t("nav.quickNotes")}</span>
        <button
          onClick={() => setAdding(a => !a)}
          title={t("qn.add")}
          className="w-5 h-5 rounded hover:bg-[hsl(var(--accent))] flex items-center justify-center text-[hsl(var(--muted-foreground))]">
          <Icons.Plus size={12} />
        </button>
      </div>

      {adding && (
        <div className="mb-2 anim-fade-in">
          <textarea
            ref={inputRef}
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); submit(); }
              if (e.key === "Escape") { setDraft(""); setAdding(false); }
            }}
            rows={3}
            placeholder={t("qn.placeholder")}
            className="w-full rounded-[8px] border border-[hsl(var(--primary)/0.4)] bg-[hsl(var(--background))] px-2.5 py-2 text-[11.5px] resize-none focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
          />
          <div className="flex items-center justify-end gap-1 mt-1.5">
            <button onClick={() => { setAdding(false); setDraft(""); }} className="text-[10.5px] px-2 py-1 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]">
              {t("common.cancel")}
            </button>
            <button onClick={submit} disabled={!draft.trim()}
              className="text-[10.5px] px-2.5 py-1 rounded bg-[hsl(var(--primary))] text-white disabled:opacity-50 hover:bg-[hsl(var(--primary)/0.9)]">
              {t("common.save")}
            </button>
          </div>
        </div>
      )}

      <div className="space-y-1.5">
        {notes.length === 0 && !adding && (
          <div className="rounded-[8px] border border-dashed border-[hsl(var(--border))] p-3 text-[11px] text-[hsl(var(--muted-foreground))] italic text-center">
            {t("qn.empty")}
          </div>
        )}
        {notes.map(n => (
          <div key={n.id} className="group/note relative rounded-[8px] border border-dashed border-[hsl(var(--border))] p-2.5 hover:border-[hsl(var(--primary)/0.4)] hover:bg-[hsl(var(--accent)/0.2)] transition-colors">
            {editingId === n.id ? (
              <textarea
                ref={editRef}
                value={editText}
                onChange={e => setEditText(e.target.value)}
                onBlur={commitEdit}
                onKeyDown={e => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); commitEdit(); }
                  if (e.key === "Escape") { setEditingId(null); }
                }}
                rows={3}
                className="w-full bg-transparent text-[11.5px] resize-none focus:outline-none"
              />
            ) : (
              <div
                onDoubleClick={() => startEdit(n)}
                className="text-[11.5px] text-[hsl(var(--muted-foreground))] italic cursor-text whitespace-pre-wrap break-words"
                title={t("qn.editDouble")}
              >
                « {n.text} »
              </div>
            )}
            {editingId !== n.id && (
              <button
                onClick={() => remove(n.id)}
                title={t("common.delete")}
                className="absolute top-1 right-1 w-5 h-5 rounded text-[hsl(var(--muted-foreground))] hover:text-[hsl(0_84%_70%)] hover:bg-[hsl(0_84%_60%/0.1)] flex items-center justify-center opacity-0 group-hover/note:opacity-100 transition-opacity">
                <Icons.X size={10} />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function PageHeader({ title, subtitle, children, sticky = true }) {
  return (
    <div className={cn(
      "flex items-start justify-between gap-4 pb-4 mb-5 border-b border-[hsl(var(--border))]",
      sticky && "sticky top-0 z-20 bg-[hsl(var(--background))] -mx-6 px-6 pt-5"
    )}>
      <div>
        <h1 className="text-[24px] font-bold tracking-tight leading-tight">{title}</h1>
        {subtitle && <p className="text-[13px] text-[hsl(var(--muted-foreground))] mt-1">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">{children}</div>
    </div>
  );
}

Object.assign(window, { Sidebar, RightSidebar, PageHeader, NavLink, defaultNavIdForRoute });

/* New-task button. The active Espace is already shown by the switcher
   directly above, so we don't repeat the target here. */
function NewTaskButton({ onOpenTask, t }) {
  return (
    <button
      onClick={onOpenTask}
      className="w-full h-9 rounded-[8px] bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary)/0.9)] text-white flex items-center justify-center gap-1.5 text-[13px] font-medium shadow-sm shadow-[hsl(var(--primary)/0.2)] transition-all active:scale-[0.98]"
    >
      <Icons.Plus size={14} /> {t("nav.newTask")}
    </button>
  );
}
window.NewTaskButton = NewTaskButton;
