export interface ProjectMedia {
  enabled: boolean
  type: "gantt" | "bar-chart" | "kanban" | "calendar" | "terminal" | "video" | "image"
  src?: string
}

export interface Project {
  id: string
  year: string
  status: { fr: string; en: string }
  name: string
  tag: { fr: string; en: string }
  stack: string[]
  summary: { fr: string; en: string }
  metrics: { fr: string[]; en: string[] }
  featured?: boolean
  media?: ProjectMedia
}

export const projects: Project[] = [
  {
    id: "the-mad-space",
    year: "2025 · présent",
    status: { fr: "En production", en: "In production" },
    name: "The Mad Space",
    tag: { fr: "Marketplace e-commerce print-on-demand", en: "Print-on-demand e-commerce marketplace" },
    stack: ["Next.js 16", "TypeScript", "Prisma", "PostgreSQL", "Stripe", "Gelato", "Supabase", "Vercel"],
    summary: {
      fr: "Marketplace print-on-demand connectant créateurs et consommateurs. ~15 000 LOC, 30+ endpoints API, auth custom session-based, OAuth 2.0 Google, conformité GDPR/Loi 25, 7+ intégrations B2B et fulfillment automatisé Gelato.",
      en: "Print-on-demand marketplace connecting creators and consumers. ~15,000 LOC, 30+ API endpoints, custom session-based auth, Google OAuth 2.0, GDPR/Loi 25 compliance, 7+ B2B integrations and automated Gelato fulfillment."
    },
    metrics: {
      fr: ["~15 000 LOC", "30+ endpoints API", "7+ intégrations B2B", "Traitement −10–15 min"],
      en: ["~15,000 LOC", "30+ API endpoints", "7+ B2B integrations", "Processing −10–15 min"]
    },
    featured: true,
    media: { enabled: true, type: "video", src: "/media/the-mad-space.mp4" }
  },
  {
    id: "cadence",
    year: "2025 · présent",
    status: { fr: "En développement", en: "In development" },
    name: "Cadence",
    tag: { fr: "App mobile coaching sportif", en: "Sports coaching mobile app" },
    stack: ["Expo", "React Native", "TypeScript", "NativeWind", "Supabase", "Next.js"],
    summary: {
      fr: "Application mobile coach ↔ athlète co-fondée avec Alexandre (design). 169+ issues structurées sur 13 sprints, audit concurrentiel de 8+ apps, conformité Loi 25 + PIPEDA + GDPR-ready. Beachhead : coachs musculation francophones au Québec.",
      en: "Coach ↔ athlete mobile app co-founded with Alexandre (design). 169+ issues structured across 13 sprints, competitive audit of 8+ apps, Loi 25 + PIPEDA + GDPR-ready compliance. Beachhead: francophone gym coaches in Quebec."
    },
    metrics: { fr: ["169+ issues GitHub", "13 sprints planifiés", "74/74 features couvertes"], en: ["169+ GitHub issues", "13 sprints planned", "74/74 features covered"] },
    media: { enabled: true, type: "image", src: "/media/cadence.gif" }
  },
  {
    id: "fastercom-tms",
    year: "Déc. 2025 · Mars 2026",
    status: { fr: "B2B · NDA partiel", en: "B2B · partial NDA" },
    name: "Fastercom TMS",
    tag: { fr: "Intégration enterprise", en: "Enterprise integration" },
    stack: ["Spring Boot", "Angular", "GitLab CI/CD", "Google Maps API"],
    summary: {
      fr: "Paramétrage et intégration de solutions TMS enterprise avec déploiement Test → Dev → Production.",
      en: "TMS enterprise configuration and integration with Test → Dev → Production deployment."
    },
    metrics: { fr: ["Pipeline 3 environnements", "Géocodage Google Maps"], en: ["3-env pipeline", "Google Maps geocoding"] },
    media: { enabled: true, type: "image", src: "/media/fastercom-tms.webp" }
  },
  {
    id: "dpm-elevate",
    year: "2025 · présent",
    status: { fr: "En développement actif", en: "Actively in development" },
    name: "DPM Elevate",
    tag: { fr: "Planification holistique · Prototype haute-fidélité", en: "Holistic planning · High-fidelity prototype" },
    stack: ["React 18", "Tailwind CSS", "Babel", "i18n FR/EN", "CSS Custom Properties", "WCAG AA"],
    summary: {
      fr: "Prototype interactif haute-fidélité d'une application de planification holistique — tout le cycle de productivité dans un seul produit cohérent. 14 écrans couvrant landing, onboarding, dashboard, planification quotidienne, focus Pomodoro, calendrier multi-vues, tâches (5 vues), matrice Eisenhower, habitudes, objectifs SMART, règles d'automatisation et analytics. Nativement bilingue FR/EN, dark/light mode, responsive desktop + mobile, sur un design system complet WCAG AA, avec un moteur de science comportementale (chronotype, MCII, anti-procrastination CBT) intégré au flux de planification.",
      en: "High-fidelity interactive prototype of a holistic planning application — the entire productivity cycle in one coherent product. 14 screens spanning landing, onboarding, dashboard, daily planning, Pomodoro focus, multi-view calendar, tasks (5 views), Eisenhower matrix, habits, SMART goals, automation rules and analytics. Natively bilingual FR/EN, dark/light mode, responsive desktop + mobile, on a complete WCAG AA design system, with a behavioural-science engine (chronotype, MCII, CBT anti-procrastination) wired into the planning flow."
    },
    metrics: {
      fr: ["14 écrans · 20+ composants", "Tâches en 5 vues", "~130 clés i18n FR/EN", "WCAG AA conforme"],
      en: ["14 screens · 20+ components", "Tasks across 5 views", "~130 i18n keys FR/EN", "WCAG AA compliant"]
    },
    media: { enabled: true, type: "image", src: "/media/dpm-elevate.gif" }
  },
  {
    id: "financej",
    year: "Jan. 2026 · Avr. 2026",
    status: { fr: "Académique · ÉTS", en: "Academic · ÉTS" },
    name: "FinanceJ",
    tag: { fr: "App desktop de finances personnelles", en: "Personal finance desktop app" },
    stack: ["Java 21", "Maven", "Java Swing", "Apache Derby", "JUnit 4", "AssertJ Swing", "JaCoCo", "Checkstyle", "PMD", "QALab"],
    summary: {
      fr: "Application desktop Java de gestion de finances personnelles (revenus, dépenses, budgets). Équipe de 6 développeurs, cours LOG240 (Tests et Maintenance). 5 250+ LOC, 133 tests (100% couverture JaCoCo), 85 commits. Architecture MVC avec Singleton, DAO et AbstractTableModel. Contributeur le plus actif (28 commits).",
      en: "Java desktop personal finance app (income, expenses, budgets). Team of 6 developers, LOG240 course (Testing & Maintenance). 5,250+ LOC, 133 tests (100% JaCoCo coverage), 85 commits. MVC architecture with Singleton, DAO and AbstractTableModel patterns. Most active contributor (28 commits)."
    },
    metrics: {
      fr: ["5 250+ LOC", "133 tests · 100% couverture", "85 commits · 6 devs", "28 commits (top contributeur)"],
      en: ["5,250+ LOC", "133 tests · 100% coverage", "85 commits · 6 devs", "28 commits (top contributor)"]
    },
    media: { enabled: true, type: "image", src: "/media/financej.gif" }
  }
]

export const caseStudyIds = new Set([
  "the-mad-space",
  "cadence",
  "fastercom-tms",
  "dpm-elevate",
  "financej",
])

/** Role per project, used in project detail meta strip */
export const projectRoles: Record<string, { fr: string; en: string }> = {
  "the-mad-space": { fr: "Ingénieur Full-Stack (Contractuel)", en: "Full-Stack Engineer (Contract)" },
  "cadence": { fr: "Co-fondateur · Tech Lead", en: "Co-founder · Tech Lead" },
  "fastercom-tms": { fr: "Développeur Intégrateur de Solutions", en: "Solutions Integration Developer" },
  "dpm-elevate": { fr: "Fondateur · Design & Prototypage", en: "Founder · Design & Prototyping" },
  "financej": { fr: "Développeur · Top contributeur (Projet académique — LOG240)", en: "Developer · Top contributor (Academic Project — LOG240)" },
}

/** External links per project (shown on detail page) */
export const projectLinks: Record<string, { label: string; url: string; type: "github" | "live" | "demo" }[]> = {
  "the-mad-space": [
    { label: "Live", url: "https://themadspace.com", type: "live" },
  ],
  "cadence": [
    { label: "Landing page", url: "https://cadence-web-fawn.vercel.app", type: "live" },
    { label: "GitHub", url: "https://github.com/ralphgabriel04/cadence-mobile", type: "github" },
  ],
  "dpm-elevate": [
    { label: "Live", url: "/dpm-elevate/index.html", type: "live" },
  ],
}
