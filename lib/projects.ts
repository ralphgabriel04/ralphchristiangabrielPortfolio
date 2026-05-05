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
    id: "dpm-calendar",
    year: "2025 · présent",
    status: { fr: "En développement", en: "In development" },
    name: "DPM Calendar",
    tag: { fr: "SaaS productivité", en: "Productivity SaaS" },
    stack: ["Next.js", "TypeScript", "Supabase"],
    summary: {
      fr: "SaaS de calendrier intelligent ciblant App Store et Play Store.",
      en: "Smart calendar SaaS targeting App Store and Play Store."
    },
    metrics: { fr: ["Live: dpm-calendar.vercel.app"], en: ["Live: dpm-calendar.vercel.app"] },
    media: { enabled: true, type: "image", src: "/media/dpm-calendar.gif" }
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
  "dpm-calendar",
  "financej",
])

/** Role per project, used in project detail meta strip */
export const projectRoles: Record<string, { fr: string; en: string }> = {
  "the-mad-space": { fr: "Ingénieur Full-Stack (Contractuel)", en: "Full-Stack Engineer (Contract)" },
  "cadence": { fr: "Co-fondateur · Tech Lead", en: "Co-founder · Tech Lead" },
  "fastercom-tms": { fr: "Développeur Intégrateur de Solutions", en: "Solutions Integration Developer" },
  "dpm-calendar": { fr: "Fondateur & Développeur", en: "Founder & Developer" },
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
  "dpm-calendar": [
    { label: "Live", url: "https://dpm-calendar.vercel.app", type: "live" },
  ],
}
