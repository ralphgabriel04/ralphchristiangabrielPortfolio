/* global React, Icons */
/* ============================================================
   TOUR CATALOG — SINGLE SOURCE OF TRUTH (P19)

   Everything downstream derives from this file:
     • the in-app guided tour (overview + per-module mini-tours)
     • the nav labels referenced by the tour
     • the "Guide by feature" of the Resource Center
     • the per-module replay menu in the help "?" button

   Each module: { id, route, navId, label (EXACT nav label), icon,
   group, blurb (overview teaching line), features[] }.

   Each feature: { sel (data-tour selector value), label (EXACT on-screen
   label), desc (one functional line — the "gold standard" format), key
   (boolean → part of the 2–3 step mini-tour), title (mini-tour bubble
   title), body (mini-tour bubble body — teaches the JOB, not the UI) }.

   ⚠️ All user-facing copy lives HERE so it stays trivially replaceable as
   soon as real field feedback comes in.
============================================================ */

const TOUR_MODULES = [
  {
    id: "home", route: "home", navId: "main:home",
    label: "Home", icon: "Home", group: "Main",
    blurb: "Your starting point: today's workload, energy, the task in progress and an assistant that tells you what to do right now.",
    features: [
      { sel: "w-workload", label: "Daily workload", desc: "Stacked bar — tasks / meetings / focus", key: true,
        title: "See your day at a glance", body: "The bar compares what's planned against your real capacity — you spot overload before it hits." },
      { sel: "w-sleep-prompt", label: "Morning sleep check-in", desc: "Nightly check-in — bedtime / wake-up / quality" },
      { sel: "w-energy-mini", label: "Energy of the day", desc: "Sparkline + summary + link to the analytics" },
      { sel: "w-current-task", label: "Current task", desc: "Banner of the active task with progress" },
      { sel: "w-overview", label: "Day overview", desc: "4 key figures: tasks, meetings, focus, habits", key: true,
        title: "Four numbers, zero thinking", body: "Today's tasks, meetings, focus and habits summed up in four numbers — know where you stand without opening three pages." },
      { sel: "w-quick-actions", label: "Quick actions", desc: "5 shortcuts: Task, Calendar, Focus, Habits, Stats" },
      { sel: "w-assistant", label: "AI assistant", desc: "Contextual advice + sourced suggestions", key: true,
        title: "Advice, not a manual", body: "The assistant reads your workload, energy and schedule to suggest the next useful action — every suggestion is sourced." },
      { sel: "w-upcoming", label: "Upcoming", desc: "The day's next events" },
      { sel: "w-tasks-today", label: "Today's tasks", desc: "Checkable list of tasks scheduled today" },
    ],
  },
  {
    id: "calendar", route: "calendar", navId: "main:calendar",
    label: "Calendar", icon: "Calendar", group: "Main",
    blurb: "Far more than a grid: six views, a calendar tree and context views to show only what matters here, now.",
    features: [
      { sel: "feat-calendar-views", label: "6 views", desc: "Day · Week · Month · Agenda · Timeline · Workload", key: true,
        title: "The right view for the right question", body: "Week to execute, Month to plan, Workload to spot saturated days — one click is enough to change angle." },
      { sel: "feat-calendar-context", label: "Context views", desc: "Presets All / Work / Personal / Family — calendars + time range", key: true,
        title: "Separate work from home", body: "A preset composes both the visible calendars AND the time range at once — switch from \"Work 9–6\" to \"Personal\" without touching ten boxes." },
      { sel: "feat-calendar-tree", label: "Calendar tree", desc: "Groups → subgroups → calendars (2 levels), colors, on/off", key: true,
        title: "Organize your calendars like a folder", body: "Group Work, Family, Travel… then turn an entire branch on or off. A disabled calendar is flagged — no event vanishes silently." },
      { sel: "feat-calendar-side", label: "Side panel", desc: "Mini-calendar, unscheduled items and shortcuts" },
    ],
  },
  {
    id: "daily-planning", route: "daily-planning", navId: "daily:planning",
    label: "Planning", icon: "Sunrise", group: "Daily rituals",
    blurb: "A six-step assistant that turns a fuzzy list into a realistic day placed in the calendar.",
    features: [
      { sel: "feat-planning-steps", label: "6-step assistant", desc: "Add · Estimate · Fill · Prioritize · Schedule · Document", key: true,
        title: "One day, six guided steps", body: "You move step by step — the app keeps you from doing everything at once and drowning. The ritual takes two minutes." },
      { sel: "feat-planning-current", label: "Current step", desc: "The work of the active step, isolated to stay focused", key: true,
        title: "One decision at a time", body: "Estimate, prioritize, place: each step only shows what you need right now. Less mental load, more decisions kept." },
    ],
  },
  {
    id: "planner", route: "planner", navId: "daily:focus",
    label: "Focus", icon: "Zap", group: "Daily rituals",
    blurb: "Execution mode: a task queue, a Pomodoro timer and a session run-of-show to get into deep work.",
    features: [
      { sel: "feat-focus-timer", label: "Focus timer", desc: "Circular ring focus / breaks, hyperfocus mode", key: true,
        title: "Deep work, paced", body: "The ring paces focus and breaks to hold concentration without burning out — or chain blocks in hyperfocus when you're on a roll." },
      { sel: "feat-focus-queue", label: "Task queue", desc: "Reorderable list of the session's tasks", key: true,
        title: "Always know what to tackle next", body: "Reorder your queue; the top task becomes your session. No more \"what do I do now?\" between blocks." },
      { sel: "feat-focus-run", label: "Session run-of-show", desc: "Focus / break schedule + quotes" },
    ],
  },
  {
    id: "tasks", route: "tasks", navId: "prod:tasks",
    label: "Tasks", icon: "CheckSquare", group: "Productivity",
    blurb: "All your tasks, five ways to see them — from a simple list to a multi-board Kanban with work-in-progress limits.",
    features: [
      { sel: "feat-tasks-views", label: "5 views", desc: "List · Boards · Timeline · Calendar · Stats", key: true,
        title: "The same work, five angles", body: "List to check off, Boards for flow, Timeline for deadlines, Stats for perspective. You choose based on the question of the moment." },
      { sel: "feat-tasks-kanban", label: "Kanban boards", desc: "Multiple boards + columns with WIP limits", key: true,
        title: "Limit work in progress", body: "Columns have WIP limits: beyond them, the app slows you down so you finish before starting something else." },
    ],
  },
  {
    id: "matrix", route: "matrix", navId: "prod:matrix",
    label: "Prioritization", icon: "Grid", group: "Productivity",
    blurb: "The Eisenhower matrix: drag your tasks between Do, Plan, Delegate and Eliminate to decide with a cool head.",
    features: [
      { sel: "feat-matrix-grid", label: "Eisenhower matrix", desc: "4 quadrants: Do · Plan · Delegate · Eliminate", key: true,
        title: "Urgent isn't important", body: "Place each task by urgency × importance: you instantly see what deserves your time and what can drop." },
      { sel: "feat-matrix-quadrant", label: "Drag and drop", desc: "Move a task from one quadrant to another", key: true,
        title: "Re-prioritizing is dragging", body: "A priority changed? Drag the task into another quadrant — the decision stays visual and reversible." },
    ],
  },
  {
    id: "habits", route: "habits", navId: "prod:habits",
    label: "Habits", icon: "Flame", group: "Productivity",
    blurb: "Build rituals that stick: streaks, heatmap and consistency show you steadiness rather than a single day's performance.",
    features: [
      { sel: "feat-habits-stats", label: "Stats header", desc: "Best streak · consistency · monthly total", key: true,
        title: "Consistency, not the feat", body: "Best streak, consistency and the month's total in one banner: you track the underlying trend, not one day's mood." },
      { sel: "feat-habits-card", label: "Habit cards", desc: "Icon, color, type, frequency + streak 🔥", key: true,
        title: "A card = a living habit", body: "The 🔥 streak rewards the current chain. Check today and watch the run grow — it's the engine of the habit." },
      { sel: "feat-habits-heatmap", label: "7-day heatmap", desc: "Grid of the last 7 days per habit", key: true,
        title: "Spot the gaps", body: "Seven days in a grid: you see at a glance which days slip and adjust before the run breaks." },
    ],
  },
  {
    id: "goals", route: "goals", navId: "prod:goals",
    label: "Goals", icon: "Target", group: "Productivity",
    blurb: "Your long-term targets, framed SMART and linked to the habits that move them forward day after day.",
    features: [
      { sel: "feat-goals-card", label: "Goal cards", desc: "Progress cur/max, category, deadlines", key: true,
        title: "From target to measured progress", body: "Each goal shows where you stand against its target. The distant \"read 24 books\" becomes a concrete \"15/24\"." },
      { sel: "feat-goals-smart", label: "SMART badges", desc: "5 criteria: Specific · Measurable · Achievable · Realistic · Time-bound", key: true,
        title: "A well-framed goal holds", body: "The five S·M·A·R·T badges tell you whether the goal is framed to succeed — a grey box is a signal to fix." },
    ],
  },
  {
    id: "rules", route: "rules", navId: "auto:rules",
    label: "Rules", icon: "Shield", group: "Automation",
    blurb: "Automate planning chores: \"If… Then…\" protects your focus, inserts your breaks and adds buffers without a thought.",
    features: [
      { sel: "feat-rules-card", label: "If… Then… automations", desc: "Trigger × action + run counter + toggle", key: true,
        title: "Your schedule defends itself", body: "A rule = a trigger and an action. \"Buffer between meetings\" adds 15 min after each meeting — you see how many times it acted." },
      { sel: "feat-rules-templates", label: "Ready-made templates", desc: "Focus Time · Lunch break · Meeting buffers", key: true,
        title: "Start with a template", body: "No need to configure everything: start from a proven template (Focus Time, Lunch break…) and adjust it to your reality." },
    ],
  },
  {
    id: "dashboard", route: "dashboard", navId: "insights:analytics",
    label: "Analytics dashboard", icon: "BarChart", group: "Insights",
    blurb: "The perspective: indicators, trends and correlations (down to the sleep → energy link) to decide on facts, not impressions.",
    features: [
      { sel: "w-stats", label: "Key indicators", desc: "4 cards: hours, tasks, completion, score", key: true,
        title: "The numbers that count, up front", body: "Hours worked, tasks done, completion rate and score: the health of your week in four cards." },
      { sel: "w-explorer", label: "Metrics explorer", desc: "A chart with a metric selector — period inherited from the header", key: true,
        title: "One chart, all your metrics", body: "Switch metric without switching page: the period follows the header, you compare apples to apples." },
      { sel: "w-score", label: "Score & temps", desc: "Productivity score ring + breakdown + time distribution" },
      { sel: "w-streaks", label: "Habit streaks", desc: "Current consecutive habits" },
      { sel: "w-goals", label: "Goal progress", desc: "Progress bars for long-term goals" },
      { sel: "w-workload", label: "Workload (carousel)", desc: "Workload by day, meetings, work — arrow navigation" },
      { sel: "w-sleep", label: "Health & sleep", desc: "Vitals + sleep + chronotype carousel" },
    ],
  },
  {
    id: "settings", route: "settings", navId: "settings",
    label: "Settings", icon: "Settings", group: "Other",
    blurb: "Connect your calendars, declare your working hours and set your preferences — the foundation everything else adjusts to.",
    features: [
      { sel: "feat-settings-integrations", label: "Calendar integrations", desc: "Connect Google · Microsoft · Apple and manage sync", key: true,
        title: "It all starts with a connected calendar", body: "Connect your accounts so DPM sees your real events — without it, workload and suggestions fly blind." },
      { sel: "feat-settings-hours", label: "Working hours", desc: "Ranges that feed the context views and planning" },
      { sel: "feat-settings-danger", label: "Danger zone", desc: "Data export · account deletion", key: true,
        title: "Your data is yours", body: "Export everything whenever you want, delete your account in a clear place. No traps, no friction (GDPR / Law 25)." },
    ],
  },
];

/* The overview tour walks these 11 destinations in nav order. */
const TOUR_OVERVIEW_ORDER = [
  "home", "calendar", "daily-planning", "planner",
  "tasks", "matrix", "habits", "goals",
  "rules", "dashboard", "settings",
];

const getModule = (id) => TOUR_MODULES.find(m => m.id === id);
const getKeyFeatures = (id) => (getModule(id)?.features || []).filter(f => f.key);

/* ============================================================
   PERSONAS — drive the "By profile" cards + "Start the journey".
   `start` is the module id whose mini-tour fires first.
============================================================ */
const TOUR_PERSONAS = [
  { id: "marcus", emoji: "🎓", name: "Marcus", role: "Student",
    pain: "Procrastinates and loses the big picture of his deadlines.",
    modules: ["calendar", "habits", "matrix"], start: "calendar" },
  { id: "sofia", emoji: "🚀", name: "Sofia", role: "Founder",
    pain: "Back-to-back meetings, real risk of burnout.",
    modules: ["planner", "rules", "dashboard"], start: "planner" },
  { id: "alex", emoji: "💼", name: "Alex", role: "Freelancer",
    pain: "Multiple clients, needs to track billable time.",
    modules: ["tasks", "calendar", "goals"], start: "tasks" },
  { id: "priya", emoji: "🧭", name: "Priya", role: "Team lead",
    pain: "Looking for team visibility and the common time slot.",
    modules: ["calendar", "dashboard", "rules"], start: "calendar" },
];

/* ============================================================
   VIDEOS — assumed placeholders (no real footage to produce yet).
============================================================ */
const TOUR_VIDEOS = [
  { id: "v1", title: "First steps in 2 minutes", duration: "2:14", hue: 263, module: "home" },
  { id: "v2", title: "Mastering calendar views", duration: "4:38", hue: 217, module: "calendar" },
  { id: "v3", title: "The daily planning ritual", duration: "3:05", hue: 38, module: "daily-planning" },
  { id: "v4", title: "Deep work with Focus mode", duration: "5:21", hue: 142, module: "planner" },
  { id: "v5", title: "Automating your schedule with Rules", duration: "3:47", hue: 330, module: "rules" },
  { id: "v6", title: "Reading your Analytics dashboard", duration: "6:02", hue: 280, module: "dashboard" },
];

/* ============================================================
   FAQ — grouped by category. Centralised so support can edit copy
   without touching JSX.
============================================================ */
const TOUR_FAQ = [
  { cat: "Pricing & plans", items: [
    { q: "Is DPM Elevate free?", a: "The Discovery plan is free and includes the calendar, tasks and habits. Advanced analytics views, unlimited rules and multi-account sync are on the Pro plan." },
    { q: "Can I switch plans at any time?", a: "Yes — upgrading to Pro is immediate, and downgrading to the free plan takes effect at the end of the current period, with no data loss." },
  ]},
  { cat: "Privacy (Law 25 / GDPR)", items: [
    { q: "Where is my data stored?", a: "On servers hosted in Canada and the EU. You can export all your data or delete your account from Settings → Danger zone, in line with Law 25 and GDPR." },
    { q: "Do you sell my data?", a: "Never. No personal data is sold or used for advertising. Calendar integrations use tokens you can revoke at any time." },
  ]},
  { cat: "The guided tour", items: [
    { q: "How do I restart the guided tour?", a: "The floating \"?\" button (bottom) opens the full tour or any per-module mini-tour. You can also reset it in Settings → Reset tutorials." },
    { q: "Will the tour restart on its own?", a: "No. The welcome tour only launches automatically once, right after onboarding. After that, you always trigger it yourself." },
  ]},
  { cat: "Calendar sync", items: [
    { q: "Which calendars can I connect?", a: "Google Calendar, Microsoft Outlook and Apple Calendar (iCloud). Sync is two-way and conflicts are flagged in Settings → Sync conflicts." },
  ]},
  { cat: "Mobile", items: [
    { q: "Is there a mobile app?", a: "The web app is fully responsive: on mobile, navigation moves to a bottom bar and the guided tour shows as a bottom sheet. Native iOS / Android apps are on the way." },
  ]},
  { cat: "Competitor comparison", items: [
    { q: "How is DPM different from a plain calendar?", a: "A calendar shows your events; DPM links calendar, tasks, habits, goals and energy to tell you what to do now — not just what's scheduled." },
  ]},
];

if (typeof window !== "undefined") {
  Object.assign(window, {
    TOUR_MODULES, TOUR_OVERVIEW_ORDER, TOUR_PERSONAS, TOUR_VIDEOS, TOUR_FAQ,
    getTourModule: getModule, getTourKeyFeatures: getKeyFeatures,
  });
}
