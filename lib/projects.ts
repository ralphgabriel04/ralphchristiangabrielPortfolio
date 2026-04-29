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
}

export const projects: Project[] = [
  {
    id: "the-mad-space",
    year: "2025 — présent",
    status: { fr: "En production", en: "In production" },
    name: "The Mad Space",
    tag: { fr: "E-commerce production", en: "Production e-commerce" },
    stack: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "Stripe", "Vercel", "Supabase"],
    summary: {
      fr: "Plateforme e-commerce full-stack avec multi-rôles, i18n (2 langues), multi-devises (4 devises) et 5+ intégrations APIs.",
      en: "Full-stack e-commerce platform with multi-role auth, i18n (2 languages), multi-currency (4 currencies) and 5+ API integrations."
    },
    metrics: {
      fr: ["~15 000 LOC", "20+ APIs REST", "Traitement −10–15 min"],
      en: ["~15,000 LOC", "20+ REST APIs", "Processing −10–15 min"]
    },
    featured: true
  },
  {
    id: "the-project",
    year: "2025 — présent",
    status: { fr: "En développement", en: "In development" },
    name: "The Project",
    tag: { fr: "SaaS coaching sportif", en: "Sports coaching SaaS" },
    stack: ["Next.js 16", "React 19", "TypeScript", "Tailwind v4", "Supabase"],
    summary: {
      fr: "Plateforme SaaS de coaching sportif avec planification et suivi de performance.",
      en: "Sports-coaching SaaS with planning and performance tracking."
    },
    metrics: { fr: ["MVP — fin Sprint 6"], en: ["MVP — end of Sprint 6"] }
  },
  {
    id: "fastercom-tms",
    year: "2025-12 — 2026-03",
    status: { fr: "B2B · NDA partiel", en: "B2B · partial NDA" },
    name: "Fastercom TMS",
    tag: { fr: "Intégration enterprise", en: "Enterprise integration" },
    stack: ["Spring Boot", "Angular", "GitLab CI/CD", "Google Maps API"],
    summary: {
      fr: "Paramétrage et intégration de solutions TMS enterprise avec déploiement Test → Dev → Production.",
      en: "TMS enterprise configuration and integration with Test → Dev → Production deployment."
    },
    metrics: { fr: ["Pipeline 3 environnements", "Géocodage Google Maps"], en: ["3-env pipeline", "Google Maps geocoding"] }
  },
  {
    id: "dpm-calendar",
    year: "2025 — présent",
    status: { fr: "En développement", en: "In development" },
    name: "DPM Calendar",
    tag: { fr: "SaaS productivité", en: "Productivity SaaS" },
    stack: ["Next.js", "TypeScript", "Supabase"],
    summary: {
      fr: "SaaS de calendrier intelligent ciblant App Store et Play Store.",
      en: "Smart calendar SaaS targeting App Store and Play Store."
    },
    metrics: { fr: ["Live: dpm-calendar.vercel.app"], en: ["Live: dpm-calendar.vercel.app"] }
  },
  {
    id: "financej",
    year: "2024",
    status: { fr: "Académique · ÉTS", en: "Academic · ÉTS" },
    name: "FinanceJ",
    tag: { fr: "Application Java desktop", en: "Java desktop app" },
    stack: ["Java 21", "Maven", "JUnit", "Checkstyle", "PMD", "QALab"],
    summary: {
      fr: "Application desktop modulaire MVC avec Observer + AbstractTableModel. Refactorisation Java 21.",
      en: "Modular MVC desktop app with Observer + AbstractTableModel. Java 21 refactor."
    },
    metrics: { fr: ["Refactor Java 21", "Pipeline qualité complet"], en: ["Java 21 refactor", "Full quality pipeline"] }
  }
]

export const caseStudyIds = new Set([
  "the-mad-space",
  "the-project",
  "fastercom-tms",
  "dpm-calendar",
  "financej",
])

/** Role per project, used in project detail meta strip */
export const projectRoles: Record<string, { fr: string; en: string }> = {
  "the-mad-space": { fr: "Ingénieur Full-Stack (Contractuel)", en: "Full-Stack Engineer (Contract)" },
  "the-project": { fr: "Fondateur & Développeur", en: "Founder & Developer" },
  "fastercom-tms": { fr: "Développeur Intégrateur de Solutions", en: "Solutions Integration Developer" },
  "dpm-calendar": { fr: "Fondateur & Développeur", en: "Founder & Developer" },
  "financej": { fr: "Développeur (Projet académique)", en: "Developer (Academic Project)" },
}
