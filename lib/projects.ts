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
      fr: "Prototype interactif haute-fidélité d'une application de planification holistique — tout le cycle de productivité dans un seul produit cohérent. 20+ écrans couvrant landing, inscription & onboarding, dashboard, planification quotidienne, focus Pomodoro, calendrier multi-vues, tâches (5 vues), matrice Eisenhower, habitudes, objectifs SMART, automatisations, assistant de planification IA, collaboration & espaces partagés, synchronisation d'appareils, centre de notifications, facturation et compte. Palette de commandes ⌘K, création rapide, dates dynamiques. Nativement bilingue FR/EN, dark/light mode, responsive desktop + mobile, sur un design system complet WCAG AA, avec un moteur de science comportementale (chronotype, MCII, anti-procrastination CBT) intégré au flux de planification.",
      en: "High-fidelity interactive prototype of a holistic planning application — the entire productivity cycle in one coherent product. 20+ screens spanning landing, sign-up & onboarding, dashboard, daily planning, Pomodoro focus, multi-view calendar, tasks (5 views), Eisenhower matrix, habits, SMART goals, automations, an AI planning assistant, collaboration & shared spaces, device sync, a notification centre, billing and account. ⌘K command palette, quick-create, live dynamic dates. Natively bilingual FR/EN, dark/light mode, responsive desktop + mobile, on a complete WCAG AA design system, with a behavioural-science engine (chronotype, MCII, CBT anti-procrastination) wired into the planning flow."
    },
    metrics: {
      fr: ["20+ écrans · 25+ composants", "Tâches en 5 vues · palette ⌘K", "200+ clés i18n FR/EN", "WCAG AA conforme"],
      en: ["20+ screens · 25+ components", "Tasks across 5 views · ⌘K palette", "200+ i18n keys FR/EN", "WCAG AA compliant"]
    },
    media: { enabled: true, type: "image", src: "/media/dpm-elevate.gif" }
  },
  {
    id: "kim-dubois",
    year: "2026",
    status: { fr: "Prototype client · Premier client payant", en: "Client prototype · First paying client" },
    name: "Kim Dubois Photographe",
    tag: { fr: "Site vitrine photographe animalière · Prototype", en: "Pet photographer portfolio site · Prototype" },
    stack: ["Claude Design → Claude Code", "HTML/CSS/JS (React + Babel)", "Multi-pages (accueil · galerie · distinctions)", "~15 sections modulaires réordonnables", "Éditeur visuel intégré (mode admin)", "Assistant-concierge (clavardage guidé)", "Carrousel intelligent + lightbox", "Fil signature (CSS scroll-driven + repli rAF)", "CSS Custom Properties (tokens dorés)", "Cormorant Garamond + Mulish", "i18n FR/EN · audience particuliers/commercial", "Thème clair/sombre · protection photo", "Next.js + TS + Tailwind (visé)"],
    summary: {
      fr: "Reprise et refonte du site d'une photographe animalière primée à l'international (TIPPA 2024-2025, Bronze), dont le site Wix était resté inachevé. Démarche complète orientée premier client payant : formulaire de découverte Word de 60 questions, deck PowerPoint de 9 diapos pour cadrer l'appel, brief Claude Design structuré, puis maquette générée et implémentée. Au fil des itérations, le prototype est passé d'une page d'accueil unique à une maquette complète et interactive : multi-pages (accueil, galerie portfolio, page distinctions), une quinzaine de sections modulaires (héros, compteurs, parcours, forfaits, témoignages, boutique, espace client, infolettre, FAQ, pont de l'arc-en-ciel…), de vraies photos primées organisées par catégorie, un carrousel intelligent avec lightbox et un fil « cousu » animé au scroll. Le tout bilingue FR/EN, clair/sombre, sélecteur d'audience (particuliers/commercial), identité éditoriale dorée (Cormorant Garamond + Mulish), protection légère des images et un assistant-concierge menant à un contact réel. Un mode administrateur intégré — « liberté encadrée » — permet d'éditer contenu et apparence, masquer/réordonner les sections et gérer des codes promo, pour absorber les retours de la cliente sans jamais casser la maquette.",
      en: "Takeover and redesign of the site of an internationally awarded pet photographer (TIPPA 2024-2025, Bronze) whose Wix site had been left unfinished. A complete first-paying-client process: a 60-question Word discovery form, a 9-slide PowerPoint deck to frame the call, a structured Claude Design brief, then a generated mockup implemented in code. Across iterations the prototype grew from a single home page into a full, interactive mockup: multi-page (home, portfolio gallery, distinctions page), around fifteen modular sections (hero, counters, process, packages, testimonials, shop, client area, newsletter, FAQ, rainbow bridge…), real awarded photos organised by category, a smart carousel with lightbox and a signature thread \"sewn\" along the scroll. All bilingual FR/EN, light/dark, with an audience switcher (consumer/commercial), an editorial gold identity (Cormorant Garamond + Mulish), light image protection and a concierge assistant leading to real contact. A built-in admin mode — \"bounded freedom\" — lets you edit content and appearance, hide/reorder sections and manage promo codes, to absorb the client's feedback without ever breaking the mockup."
    },
    metrics: {
      fr: ["Maquette multi-pages bilingue · clair/sombre", "~15 sections modulaires + éditeur admin intégré", "Vraies photos primées (TIPPA 2024-2025) + concierge", "Production visée : Next.js + TS"],
      en: ["Multi-page bilingual mockup · light/dark", "~15 modular sections + built-in admin editor", "Real awarded photos (TIPPA 2024-2025) + concierge", "Target production: Next.js + TS"]
    },
    media: { enabled: true, type: "image", src: "/media/kim-dubois.webp" }
  },
  {
    id: "crcc",
    year: "2026",
    status: { fr: "Maquette de refonte livrée", en: "Redesign mockup delivered" },
    name: "CRCC — Refonte",
    tag: { fr: "Refonte de site OSBL · Maquette bilingue", en: "Nonprofit website redesign · Bilingual mockup" },
    stack: ["Claude Design", "HTML/CSS/JS statiques", "CSS Custom Properties (tokens)", "i18n maison FR/EN", "JavaScript vanilla", "Montserrat", "ARIA", "WCAG 2.2 AA"],
    summary: {
      fr: "Maquette de refonte complète pour le Club du Rex de Cornouailles du Canada (OSBL bilingue d'éleveurs). Site statique multi-pages organisé autour de trois parcours — adopter un chaton, devenir éleveur membre, soutenir le club. 10 pages (Accueil, La race, Annuaire des éleveurs, Codes & éthique, Règlements, Publications, Adhésion, Administrateurs & comités, Contact) avec explorateur d'anatomie interactif, carte de répartition filtrable et identité Rouge & Blanc dérivée du logo officiel. Bilingue FR/EN à bascule instantanée, thème clair/sombre, mobile-first (375px → bureau), accessibilité WCAG 2.2 AA, sans backend. Données réelles intégrées (11 chatteries, badges Anima-Québec, 7 associations félines, ressources officielles), sans inventer ni surpromettre.",
      en: "Complete redesign mockup for the Cornwall Rex Club of Canada (bilingual nonprofit breeder community). Static multi-page site organised around three journeys — adopt a kitten, become a member breeder, support the club. 10 pages (Home, The Breed, Breeder Directory, Codes & Ethics, By-laws, Publications, Membership, Board & Committees, Contact) with an interactive anatomy explorer, a filterable distribution map and a Red & White identity derived from the official logo. Bilingual FR/EN with instant toggle, light/dark theme, mobile-first (375px → desktop), WCAG 2.2 AA accessibility, no backend. Real data integrated (11 catteries, Anima-Québec badges, 7 feline associations, official resources), without inventing or overpromising."
    },
    metrics: {
      fr: ["10 pages · bilingue FR/EN", "Explorateur d'anatomie (10 parties)", "11 chatteries · données réelles", "WCAG 2.2 AA · clair/sombre"],
      en: ["10 pages · bilingual FR/EN", "Anatomy explorer (10 parts)", "11 catteries · real data", "WCAG 2.2 AA · light/dark"]
    },
    media: { enabled: true, type: "image", src: "/media/crcc.png" }
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
  "kim-dubois",
  "crcc",
  "financej",
])

/** Role per project, used in project detail meta strip */
export const projectRoles: Record<string, { fr: string; en: string }> = {
  "the-mad-space": { fr: "Ingénieur Full-Stack (Contractuel)", en: "Full-Stack Engineer (Contract)" },
  "cadence": { fr: "Co-fondateur · Tech Lead", en: "Co-founder · Tech Lead" },
  "fastercom-tms": { fr: "Développeur Intégrateur de Solutions", en: "Solutions Integration Developer" },
  "dpm-elevate": { fr: "Fondateur · Design & Prototypage", en: "Founder · Design & Prototyping" },
  "kim-dubois": { fr: "Freelance · Design, Prototypage & Relation client", en: "Freelance · Design, Prototyping & Client Relations" },
  "crcc": { fr: "Design & Prototypage (Refonte)", en: "Design & Prototyping (Redesign)" },
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
  "crcc": [
    { label: "Maquette live", url: "/crcc/index.html", type: "live" },
    { label: "Site actuel", url: "https://club-crcc.ca", type: "demo" },
  ],
  "kim-dubois": [
    { label: "Maquette live", url: "/kim-dubois/index.html", type: "live" },
    { label: "Instagram", url: "https://www.instagram.com/kimduboisphotographeanimaliere/", type: "demo" },
  ],
}
