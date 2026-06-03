/* global React, ReactDOM, useState, useEffect,
          Sidebar, RightSidebar, defaultNavIdForRoute, TaskModal,
          LandingPage, LoginPage, OnboardingPage,
          HomePage, DailyPlanningPage, PlannerPage,
          CalendarPage, TasksPage, MatrixPage,
          HabitsPage, GoalsPage,
          DashboardPage, SettingsPage, RulesPage,
          TweaksPanel, useTweaks, TweakSection, TweakRadio, TweakToggle, TweakSelect, cn,
          useVif, SpaceTitleBar, useCurrentSpace,
          Icons, Logo */

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "dark",
  "lang": "en",
  "sidebarCollapsed": false,
  "rightSidebarCollapsed": false,
  "emptyState": false,
  "viewport": "desktop"
}/*EDITMODE-END*/;

const PAGES = [
  { id: "landing", label: "Landing", chrome: false },
  { id: "login", label: "Login", chrome: false },
  { id: "onboarding", label: "Onboarding", chrome: false },
  { id: "home", label: "Home", chrome: true, screen: "04 Home" },
  { id: "planner", label: "Planner", chrome: true, screen: "11 Planner" },
  { id: "daily-planning", label: "Daily planning", chrome: true, screen: "10 Daily Planning" },
  { id: "calendar", label: "Calendar", chrome: true, screen: "05 Calendar", fullbleed: true },
  { id: "tasks", label: "Tasks", chrome: true, screen: "06 Tasks" },
  { id: "matrix", label: "Prioritization", chrome: true, screen: "12 Matrix" },
  { id: "habits", label: "Habits", chrome: true, screen: "07 Habits" },
  { id: "goals", label: "Goals", chrome: true, screen: "08 Goals" },
  { id: "dashboard", label: "Analytics dashboard", chrome: true, screen: "09 Dashboard" },
  { id: "rules", label: "Rules", chrome: true, screen: "Rules" },
  { id: "settings", label: "Settings", chrome: true, screen: "13 Settings" },
  { id: "resources", label: "Help & Resources", chrome: true, screen: "P19 Resources" },
];

// Global "open task modal" context (poor man's)
const TaskModalCtx = React.createContext({ open: () => {} });

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [route, _setRoute] = useState("landing");
  const [navId, setNavId] = useState("main:home");
  const [taskOpen, setTaskOpen] = useState(false);

  // setRoute that also resolves navId based on the route when called externally
  const setRoute = (r) => {
    _setRoute(r);
    setNavId(defaultNavIdForRoute(r));
  };

  // Apply theme to <html>
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", t.theme === "dark");
    root.classList.toggle("light", t.theme === "light");
    // Re-derive the accent's lightness for the new theme (keeps fills AA).
    window.applyAccent?.(window.__dpmAccent || "violet");
  }, [t.theme]);

  // Broadcast lang to any component using useT() / useLang().
  useEffect(() => {
    window.__dpmLang = t.lang;
    window.dispatchEvent(new CustomEvent("dpm-lang-change", { detail: t.lang }));
  }, [t.lang]);

  // Tour route bridge — lets window.__dpmTour navigate + deep-link resources.
  useEffect(() => {
    window.__dpmNavigate = (r) => setRoute(r);
    window.__dpmOpenResources = (moduleId) => {
      setRoute("resources");
      if (moduleId) {
        window.__dpmResTarget = moduleId;
        window.dispatchEvent(new CustomEvent("dpm-res-deeplink", { detail: moduleId }));
      }
    };
  }, []);

  // Auto-launch the overview ONCE, just after onboarding (first visit on Home).
  useEffect(() => {
    let seen = true;
    try { seen = localStorage.getItem("dpm-tour-overview-seen") === "1"; } catch {}
    if (!seen && route === "home") {
      const id = setTimeout(() => { window.__dpmTour?.startOverview(); }, 1200);
      return () => clearTimeout(id);
    }
  }, []);

  const page = PAGES.find(p => p.id === route) || PAGES[0];
  const setSidebarCollapsed = (v) => setTweak("sidebarCollapsed", typeof v === "function" ? v(t.sidebarCollapsed) : v);
  const setRightCollapsed = (v) => setTweak("rightSidebarCollapsed", typeof v === "function" ? v(t.rightSidebarCollapsed) : v);

  // P21 — Extended/fullscreen Calendar bridge. The Calendar dispatches
  // "dpm-cal-fullscreen" {detail:on}; we collapse BOTH global sidebars and
  // remember their prior state so exiting restores exactly what was there.
  const chromeRestore = React.useRef(null);
  useEffect(() => {
    const onFs = (e) => {
      const on = !!e.detail;
      if (on) {
        if (!chromeRestore.current) {
          chromeRestore.current = { l: t.sidebarCollapsed, r: t.rightSidebarCollapsed };
        }
        setTweak({ sidebarCollapsed: true, rightSidebarCollapsed: true });
      } else {
        if (!chromeRestore.current) return; // never entered full view — nothing to restore
        const prev = chromeRestore.current;
        setTweak({ sidebarCollapsed: prev.l, rightSidebarCollapsed: prev.r });
        chromeRestore.current = null;
      }
    };
    window.addEventListener("dpm-cal-fullscreen", onFs);
    return () => window.removeEventListener("dpm-cal-fullscreen", onFs);
  }, [t.sidebarCollapsed, t.rightSidebarCollapsed]);

  const mobile = t.viewport === "mobile";

  // Broadcast mobile state to any component using useIsMobile().
  useEffect(() => {
    window.__dpmMobile = mobile;
    window.dispatchEvent(new CustomEvent("dpm-mobile-change", { detail: mobile }));
  }, [mobile]);

  const openTask = () => setTaskOpen(true);
  const appCtl = {
    theme: t.theme, setTheme: (v) => setTweak("theme", typeof v === "function" ? v(t.theme) : v),
    lang: t.lang, setLang: (v) => setTweak("lang", typeof v === "function" ? v(t.lang) : v),
  };
  const screen = renderScreen(route, setRoute, t.emptyState, openTask, appCtl);

  // Auth pages: full-bleed, no shell
  if (!page.chrome) {
    return (
      <TaskModalCtx.Provider value={{ open: openTask }}>
        <div className="h-full w-full overflow-y-auto bg-[hsl(var(--background))]">
          {screen}
        </div>
        <TaskModal open={taskOpen} onClose={() => setTaskOpen(false)} />
        <DPMTweaks t={t} setTweak={setTweak} route={route} setRoute={setRoute} />
      </TaskModalCtx.Provider>
    );
  }

  // Mobile shell
  if (mobile) {
    return (
      <TaskModalCtx.Provider value={{ open: openTask }}>
        <div className="h-full w-full bg-[hsl(var(--background))] flex items-center justify-center p-6 overflow-auto">
          <div className="w-[390px] h-[844px] rounded-[40px] border border-[hsl(var(--border))] bg-[hsl(var(--background))] shadow-2xl overflow-hidden flex flex-col relative">
            <div className="absolute top-0 left-0 right-0 h-[3px] z-40 pointer-events-none transition-colors duration-300" style={{ background: "hsl(var(--space-accent))" }} />
            <MobileHeader />
            <main className="dpm-mobile flex-1 overflow-y-auto px-4 py-4 pb-24">
              <div data-screen-label={page.screen}>
                {route === "home" && <div className="space-y-3 mb-4 empty:hidden"><SpaceScopeBanner /><TourWelcomeBanner /></div>}
                {screen}
              </div>
            </main>
            <MobileBottomNav route={route} setRoute={setRoute} onOpenTask={openTask} />
          </div>
          <TaskModal open={taskOpen} onClose={() => setTaskOpen(false)} />
          <DPMTweaks t={t} setTweak={setTweak} route={route} setRoute={setRoute} />
          <TourLayer mobile={true} />
          <TourHelpButton mobile={true} onOpenResources={() => setRoute("resources")} />
          <SpacesModal />
          <SlotActionHost />
        </div>
      </TaskModalCtx.Provider>
    );
  }

  // Desktop / tablet shell
  return (
    <TaskModalCtx.Provider value={{ open: openTask }}>
      <div className="h-full w-full flex bg-[hsl(var(--background))] overflow-hidden relative">
        {/* Ambient accent — liseré supérieur teinté par l'Espace courant (P20) */}
        <div className="absolute top-0 left-0 right-0 h-[3px] z-40 pointer-events-none transition-colors duration-300" style={{ background: "hsl(var(--space-accent))" }} />
        <Sidebar
          route={route} setRoute={_setRoute}
          navId={navId} setNavId={setNavId}
          collapsed={t.sidebarCollapsed} setCollapsed={setSidebarCollapsed}
          theme={t.theme} setTheme={(v) => setTweak("theme", typeof v === "function" ? v(t.theme) : v)}
          lang={t.lang} setLang={(v) => setTweak("lang", typeof v === "function" ? v(t.lang) : v)}
          onOpenTask={openTask}
        />
        <main className="flex-1 min-w-0 overflow-hidden flex flex-col relative" data-screen-label={page.screen}>
          {page.fullbleed
            ? <div className="flex-1 overflow-hidden p-4">{screen}</div>
            : <div className="flex-1 overflow-y-auto px-6 py-6">
                <SpaceTitleBar className="mb-4" />
                {route === "home" && <div className="space-y-4 mb-5 empty:hidden"><TourWelcomeBanner /></div>}
                {screen}
              </div>}
        </main>
        <RightSidebar
          collapsed={t.rightSidebarCollapsed} setCollapsed={setRightCollapsed}
          setRoute={setRoute} onOpenTask={openTask}
          route={route}
        />
        <TaskModal open={taskOpen} onClose={() => setTaskOpen(false)} />
        <DPMTweaks t={t} setTweak={setTweak} route={route} setRoute={setRoute} />
        <TourLayer mobile={false} />
        <SpacesModal />
        <SlotActionHost />
      </div>
    </TaskModalCtx.Provider>
  );
}

function renderScreen(route, setRoute, emptyState, openTask, appCtl = {}) {
  switch (route) {
    case "landing": return <LandingPage setRoute={setRoute} theme={appCtl.theme} setTheme={appCtl.setTheme} lang={appCtl.lang} setLang={appCtl.setLang} />;
    case "login": return <LoginPage setRoute={setRoute} />;
    case "onboarding": return <OnboardingPage setRoute={setRoute} />;
    case "home": return <HomePage setRoute={setRoute} emptyState={emptyState} onOpenTask={openTask} />;
    case "planner": return <PlannerPage setRoute={setRoute} onOpenTask={openTask} />;
    case "daily-planning": return <DailyPlanningPage setRoute={setRoute} />;
    case "calendar": return <CalendarPage setRoute={setRoute} emptyState={emptyState} onOpenTask={openTask} />;
    case "tasks": return <TasksPage emptyState={emptyState} onOpenTask={openTask} />;
    case "matrix": return <MatrixPage onOpenTask={openTask} />;
    case "habits": return <HabitsPage emptyState={emptyState} />;
    case "goals": return <GoalsPage emptyState={emptyState} />;
    case "dashboard": return <DashboardPage />;
    case "rules": return <RulesPage />;
    case "settings": return <SettingsPage />;
    case "resources": return <ResourcesPage />;
    default: return <HomePage setRoute={setRoute} />;
  }
}

function useIsMobile() {
  const [m, setM] = useState(() => (typeof window !== "undefined" ? !!window.__dpmMobile : false));
  useEffect(() => {
    const h = (e) => setM(!!e.detail);
    window.addEventListener("dpm-mobile-change", h);
    return () => window.removeEventListener("dpm-mobile-change", h);
  }, []);
  return m;
}
if (typeof window !== "undefined") window.useIsMobile = useIsMobile;

function MobileHeader() {
  return (
    <header className="h-14 px-3 flex items-center gap-2 border-b border-[hsl(var(--border))] bg-[hsl(var(--card))]">
      <button className="w-9 h-9 rounded-md hover:bg-[hsl(var(--accent))] flex items-center justify-center flex-shrink-0">
        <Icons.Menu size={18} />
      </button>
      {/* Espace switcher (P20) — toujours visible en tête sur mobile */}
      <div className="flex-1 min-w-0"><SpaceSwitcher variant="chip" /></div>
      <button className="w-9 h-9 rounded-md hover:bg-[hsl(var(--accent))] flex items-center justify-center flex-shrink-0 relative">
        <Icons.Bell size={16} />
        <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[hsl(var(--primary))]" />
      </button>
    </header>
  );
}

function MobileBottomNav({ route, setRoute, onOpenTask }) {
  const items = [
    { id: "home", label: "Home", icon: Icons.Home },
    { id: "planner", label: "Today", icon: Icons.Layout },
    { id: "add", label: "", icon: Icons.Plus, isAdd: true },
    { id: "tasks", label: "Tasks", icon: Icons.CheckSquare },
    { id: "dashboard", label: "Stats", icon: Icons.BarChart },
  ];
  return (
    <nav className="h-16 border-t border-[hsl(var(--border))] bg-[hsl(var(--card))] grid grid-cols-5 flex-shrink-0 relative">
      {items.map(item => {
        if (item.isAdd) {
          return (
            <button key={item.id} onClick={onOpenTask} className="flex items-center justify-center relative">
              <div className="w-12 h-12 rounded-full gradient-violet shadow-lg shadow-[hsl(var(--primary)/0.4)] -mt-5 flex items-center justify-center text-white">
                <Icons.Plus size={20} stroke={2.5} />
              </div>
            </button>
          );
        }
        const active = route === item.id;
        return (
          <button key={item.id} onClick={() => setRoute(item.id)}
            data-tour={"nav-" + item.id}
            className={cn(
              "flex flex-col items-center justify-center gap-1 transition-colors relative",
              active ? "text-[hsl(var(--primary))]" : "text-[hsl(var(--muted-foreground))]"
            )}
          >
            <item.icon size={18} />
            <span className="text-[9.5px] font-medium">{item.label}</span>
            {active && <span className="absolute top-0 w-8 h-0.5 rounded-b-full bg-[hsl(var(--primary))]" />}
          </button>
        );
      })}
    </nav>
  );
}

function VifTweakToggle() {
  const [on, setOn] = useVif();
  return <TweakToggle label="Affichage vif (accessibility)" value={on} onChange={setOn} />;
}

function DPMTweaks({ t, setTweak, route, setRoute }) {
  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Navigation">
        <div className="grid grid-cols-2 gap-1.5">
          {PAGES.map(p => (
            <button key={p.id} onClick={() => setRoute(p.id)}
              className={cn(
                "px-2 py-1.5 rounded-md text-[11px] font-medium text-left transition-colors",
                route === p.id ? "bg-[hsl(var(--primary))] text-white" : "bg-[hsl(var(--muted)/0.5)] hover:bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]"
              )}
            >{p.label}</button>
          ))}
        </div>
      </TweakSection>

      <TweakSection label="Appearance">
        <TweakRadio label="Theme" value={t.theme} onChange={v => setTweak("theme", v)} options={[
          { value: "dark", label: "Dark" }, { value: "light", label: "Light" }
        ]} />
        <TweakRadio label="Language" value={t.lang} onChange={v => setTweak("lang", v)} options={[
          { value: "fr", label: "FR" }, { value: "en", label: "EN" }
        ]} />
      </TweakSection>

      <TweakSection label="Accessibility">
        <VifTweakToggle />
      </TweakSection>

      <TweakSection label="Layout">
        <TweakRadio label="Viewport" value={t.viewport} onChange={v => setTweak("viewport", v)} options={[
          { value: "desktop", label: "Desktop" }, { value: "mobile", label: "Mobile" }
        ]} />
        <TweakToggle label="Left sidebar collapsed" value={t.sidebarCollapsed} onChange={v => setTweak("sidebarCollapsed", v)} />
        <TweakToggle label="Right sidebar collapsed" value={t.rightSidebarCollapsed} onChange={v => setTweak("rightSidebarCollapsed", v)} />
      </TweakSection>

      <TweakSection label="States">
        <TweakToggle label="Empty state (Home/Cal/Tasks/Habits/Goals)" value={t.emptyState} onChange={v => setTweak("emptyState", v)} />
      </TweakSection>
    </TweaksPanel>
  );
}

window.TaskModalCtx = TaskModalCtx;

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
