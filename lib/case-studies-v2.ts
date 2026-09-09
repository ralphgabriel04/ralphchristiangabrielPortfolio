/**
 * Modular, multi-mode case-study model (v2). Each project declares an identity
 * card + sections tagged with the mode(s) they belong to (recruiter /
 * engineering / business), plus evidence-tagged metrics, decisions, a
 * responsibility matrix and honest limits. The renderer picks sections by the
 * active mode and never presents a planned item as a measured result.
 *
 * Projects without a v2 entry fall back to the legacy case-study renderer.
 */

export type CaseMode = "recruiter" | "engineering" | "business";

export type Maturity =
  | "research" | "planning" | "architecture" | "prototype" | "pre-mvp"
  | "mvp" | "pilot" | "beta" | "production" | "maintenance" | "archived";

/** Honesty axis: how proven is a given item. */
export type EvidenceLevel =
  | "planned" | "designed" | "implemented" | "tested" | "validated" | "deployed" | "measured";

export type RaciRole = "lead" | "contributor" | "consulted" | "none";

export type CaseLink = { label: string; url: string; kind: "product" | "repo" | "demo" | "doc" };

export interface CaseMetric {
  label: string;
  value: string;
  evidence: EvidenceLevel;
  note?: string;
}

export interface CaseDecisionV2 {
  id: string;
  title: string;
  context: string;
  decision: string;
  rationale: string;
  tradeoff: string;
}

export interface CaseResponsibility {
  area: string;
  me: RaciRole;
  other?: RaciRole;
  otherName?: string;
  shared: boolean;
}

export type SectionKind =
  | "text" | "flow" | "data-model" | "decisions" | "raci" | "metrics" | "limits" | "links";

export interface CaseSectionV2 {
  id: string;
  title: string;
  modes: CaseMode[];
  kind?: SectionKind; // default "text"
  body?: string;
  points?: string[];
  /** For engineering depth: render collapsed (accordion) by default. */
  collapsible?: boolean;
}

export interface CaseIdentity {
  valueProp: string;
  kind: string;
  domain: string;
  maturity: Maturity;
  maturityLabel: string;
  period: string;
  team?: string;
  role: string;
  market?: string;
  platforms?: string[];
  stack: string[];
  updated: string;
}

export interface CaseStudyV2 {
  modes: CaseMode[];
  identity: CaseIdentity;
  sections: CaseSectionV2[];
  metrics?: CaseMetric[];
  decisions?: CaseDecisionV2[];
  responsibilities?: CaseResponsibility[];
  responsibilitiesNote?: string;
  limits?: string[];
  links: CaseLink[];
}

/** Localised evidence-level labels (shown as a small tag on metrics). */
export const EVIDENCE_LABEL: Record<EvidenceLevel, { fr: string; en: string; tone: "plan" | "build" | "proof" }> = {
  planned: { fr: "Planifié", en: "Planned", tone: "plan" },
  designed: { fr: "Conçu", en: "Designed", tone: "plan" },
  implemented: { fr: "Implémenté", en: "Implemented", tone: "build" },
  tested: { fr: "Testé", en: "Tested", tone: "build" },
  validated: { fr: "Validé", en: "Validated", tone: "proof" },
  deployed: { fr: "Déployé", en: "Deployed", tone: "proof" },
  measured: { fr: "Mesuré", en: "Measured", tone: "proof" },
};

export const MODE_LABEL: Record<CaseMode, { fr: string; en: string }> = {
  recruiter: { fr: "Recruteur", en: "Recruiter" },
  engineering: { fr: "Ingénierie", en: "Engineering" },
  business: { fr: "Client", en: "Client" },
};

export const RACI_LABEL: Record<RaciRole, { fr: string; en: string }> = {
  lead: { fr: "Responsable", en: "Lead" },
  contributor: { fr: "Contributeur", en: "Contributor" },
  consulted: { fr: "Consulté", en: "Consulted" },
  none: { fr: "—", en: "—" },
};

// ─────────────────────────────────────────────────────────────────────────────
// CADENCE — pilot (co-founded product · architecture → pré-MVP)
// Honest framing from code-level research: the data model + RLS authorization +
// auth + CI/security + discovery are real; the mobile feature screens are
// designed/planned (placeholders); the working feature code lives in the web app.
// ─────────────────────────────────────────────────────────────────────────────

const cadenceFr: CaseStudyV2 = {
  modes: ["recruiter", "engineering"],
  identity: {
    valueProp: "Plateforme de coaching sportif coach ↔ athlète (musculation), pensée mobile-first pour le Québec francophone.",
    kind: "Produit cofondé",
    domain: "Coaching sportif",
    maturity: "pre-mvp",
    maturityLabel: "Architecture / pré-MVP",
    period: "2025 · présent · pivot « athlète-first » (mai 2026)",
    team: "Ralph (technique) · Alexandre Boisvert (produit & design)",
    role: "Cofondateur · Responsable technique",
    market: "Coachs de musculation francophones au Québec, et leurs athlètes",
    platforms: ["Mobile (iOS / Android)", "Web (landing + app)"],
    stack: ["Expo · React Native", "TypeScript", "Supabase (Postgres · Auth · RLS)", "Next.js 16", "NativeWind", "GitHub Actions"],
    updated: "2026-07-29",
  },
  sections: [
    { id: "resume", title: "Résumé", modes: ["recruiter"],
      body: "Cadence relie un coach de musculation et ses athlètes : le coach conçoit des programmes, l'athlète les suit et enregistre ses séances. Cofondé avec Alexandre (produit & design), je porte toute la technique. Le projet est mené par la découverte : personas athlètes validés, analyse concurrentielle, puis un pivot « athlète-first » documenté." },
    { id: "probleme", title: "Problème & marché", modes: ["recruiter", "engineering"],
      body: "Les coachs indépendants jonglent avec des tableurs, des messages et des vidéos. Cadence centralise programme, suivi et communication.",
      points: ["Beachhead : coachs de musculation francophones au Québec", "Deux personas athlètes validés par entretiens (méthode Mom Test)", "Concurrence analysée : Hevy, TrueCoach, Everfit, Trainerize, Hexfit"] },
    { id: "role", title: "Mon rôle", modes: ["recruiter", "engineering"],
      body: "Cofondateur et responsable technique : architecture, modèle de données, autorisation, auth, CI/sécurité et développement. Alexandre est responsable du produit et du design ; les décisions produit sont partagées." },
    { id: "contribution", title: "Contribution principale", modes: ["recruiter"],
      points: ["Modèle de données (14 tables) et son autorisation par Row-Level Security", "Système d'authentification (mobile + web) sur Supabase", "Architecture de l'app mobile (Expo/React Native) + design system", "Pipeline CI avec analyse de sécurité (scan de secrets, audit de dépendances)"] },
    { id: "fiche", title: "Fiche technique", modes: ["engineering"],
      points: ["Mobile : Expo SDK 54 · React Native 0.81 · Expo Router · NativeWind · expo-secure-store", "Backend : Supabase — Postgres, Auth, Row-Level Security", "Web : Next.js 16 (landing avec liste d'attente + app dashboard)", "État : app mobile en pré-MVP (auth + navigation + design system) ; fonctionnalités surtout dans l'app web"] },
    { id: "acteurs", title: "Acteurs", modes: ["engineering"],
      points: ["Coach : crée exercices, programmes, séances ; suit ses athlètes", "Athlète : suit ses programmes, enregistre séances et « readiness »", "Note privée du coach : jamais visible par l'athlète (règle d'autorisation)"] },
    { id: "architecture", title: "Architecture", modes: ["engineering"], kind: "flow",
      body: "App mobile (Expo/React Native) et app web (Next.js) partagent un backend Supabase : Athlète/Coach → app → Supabase (Auth + Postgres protégé par RLS) → server actions / requêtes. Landing Next.js séparée (liste d'attente, anti-bot Turnstile, analytics)." },
    { id: "data", title: "Modèle de données", modes: ["engineering"], kind: "data-model", collapsible: true,
      body: "14 tables, avec la relation coach ↔ athlète au centre et une suppression logique (soft-delete) partout.",
      points: ["profiles · coach_athletes (lien, statut pending/active/inactive)", "exercises · programs · sessions · session_exercises (séries/reps/repos/tempo)", "program_assignments · session_logs · exercise_logs (reps/poids/RPE/PR)", "readiness_logs (sommeil/énergie/…, colonne calculée) · conversations · messages", "session_images · coach_notes (privées) · soft-delete + index partiels"] },
    { id: "securite", title: "Sécurité & autorisation", modes: ["engineering"], collapsible: true,
      body: "L'autorisation vit dans la base : Row-Level Security activée sur les 14 tables, avec des politiques par rôle.",
      points: ["Un coach ne voit les journaux d'un athlète que si la relation est « active »", "Les notes du coach sont invisibles pour l'athlète", "Un bug de récursivité de politique RLS détecté et corrigé (migration dédiée)", "Jetons stockés via expo-secure-store ; masquage d'e-mail à l'affichage"] },
    { id: "decisions", title: "Décisions d'architecture", modes: ["engineering"], kind: "decisions" },
    { id: "responsabilites", title: "Qui a fait quoi", modes: ["recruiter", "engineering"], kind: "raci" },
    { id: "tests", title: "Tests & CI/CD", modes: ["engineering"], collapsible: true,
      body: "Pipeline en place, couverture volontairement modeste pour l'instant.",
      points: ["CI : lint · vérification de types · tests · build Expo", "Sécurité : audit des dépendances · ESLint-security · scan de secrets (TruffleHog) · Dependabot", "OTA via Expo ; aperçus EAS sur les PR", "Honnête : les tests couvrent surtout des utilitaires purs (seuil bas assumé au stade actuel)"] },
    { id: "avancement", title: "Avancement et préparation", modes: ["recruiter", "engineering"], kind: "metrics",
      body: "À ce stade, l'essentiel est de la préparation et de la conception — présentées comme telles, pas comme des résultats produit." },
    { id: "risques", title: "Risques & prochaines étapes", modes: ["engineering"], kind: "limits" },
    { id: "apprentissages", title: "Apprentissages", modes: ["recruiter"],
      body: "Le principal apprentissage : ne construire que sur une demande validée. Seuls les personas athlètes étaient validés — d'où le pivot « athlète-first » (l'app athlète d'abord, le coach ensuite) plutôt que de bâtir des fonctionnalités coach spéculatives." },
  ],
  metrics: [
    { label: "issues structurées (177 web + 64 mobile)", value: "241", evidence: "planned", note: "gouvernance & traçabilité — pas un résultat produit" },
    { label: "tables · RLS sur toutes", value: "14", evidence: "implemented" },
    { label: "personas athlètes validés (Mom Test)", value: "2", evidence: "validated" },
    { label: "apps concurrentes analysées", value: "5", evidence: "validated" },
    { label: "app mobile : auth + navigation + design system", value: "✓", evidence: "implemented" },
    { label: "écrans de fonctionnalités mobiles", value: "conçus", evidence: "designed", note: "maquettes complètes ; implémentation à venir" },
  ],
  decisions: [
    { id: "adr-001", title: "Pivot « athlète-first » (4 phases)",
      context: "Seuls les personas athlètes avaient été validés par entretiens ; les personas coachs, non.",
      decision: "Réordonner la feuille de route en 4 phases : app athlète mobile, puis coach mobile, puis athlète web, puis coach web.",
      rationale: "Construire sur une demande validée plutôt que sur des hypothèses coach non testées.",
      tradeoff: "Les fonctionnalités coach arrivent plus tard." },
    { id: "adr-002", title: "Exercices comme bibliothèque réutilisable",
      context: "Un même exercice sert dans plusieurs séances et programmes.",
      decision: "Bibliothèque d'exercices possédée par le coach + table de jonction séance↔exercice (séries/reps/repos/tempo).",
      rationale: "Éviter la duplication et permettre la réutilisation.",
      tradeoff: "Un peu plus de jointures à gérer." },
    { id: "adr-003", title: "Autorisation dans la base (RLS)",
      context: "Données sensibles (santé, notes privées du coach) partagées entre rôles.",
      decision: "Row-Level Security sur les 14 tables + soft-delete partout, plutôt que des vérifications uniquement applicatives.",
      rationale: "Défense en profondeur : la base refuse l'accès même si l'app se trompe.",
      tradeoff: "Politiques à écrire et déboguer (un bug de récursivité corrigé)." },
  ],
  responsibilities: [
    { area: "Architecture technique", me: "lead", other: "consulted", otherName: "Alexandre", shared: false },
    { area: "Modèle de données & RLS", me: "lead", other: "none", shared: false },
    { area: "Développement", me: "lead", other: "none", shared: false },
    { area: "Design UX/UI", me: "consulted", other: "lead", otherName: "Alexandre", shared: true },
    { area: "Produit & priorisation", me: "contributor", other: "contributor", otherName: "Alexandre", shared: true },
    { area: "Recherche utilisateur", me: "contributor", other: "lead", otherName: "Alexandre", shared: true },
  ],
  responsibilitiesNote: "« Autre » = Alexandre Boisvert (cofondateur, produit & design).",
  limits: [
    "L'app mobile (surface phare) a l'auth, la navigation et le design system, mais ses écrans de fonctionnalités sont encore des maquettes.",
    "Les personas coachs ne sont pas encore validés — bloquant assumé avant la phase coach.",
    "Notifications push, mode hors-ligne et conformité Loi 25 formelle : planifiés, pas encore construits.",
    "Les tests couvrent surtout des utilitaires ; la couverture grandira avec les fonctionnalités.",
  ],
  links: [
    { label: "Landing en ligne", url: "https://cadence-web-fawn.vercel.app", kind: "demo" },
    { label: "GitHub (mobile)", url: "https://github.com/ralphgabriel04/cadence-mobile", kind: "repo" },
  ],
};

const cadenceEn: CaseStudyV2 = {
  modes: ["recruiter", "engineering"],
  identity: {
    valueProp: "A coach ↔ athlete strength-coaching platform, mobile-first, for francophone Quebec.",
    kind: "Co-founded product",
    domain: "Sports coaching",
    maturity: "pre-mvp",
    maturityLabel: "Architecture / pre-MVP",
    period: "2025 · present · \"athlete-first\" pivot (May 2026)",
    team: "Ralph (tech) · Alexandre Boisvert (product & design)",
    role: "Co-founder · Tech lead",
    market: "Francophone gym coaches in Quebec, and their athletes",
    platforms: ["Mobile (iOS / Android)", "Web (landing + app)"],
    stack: ["Expo · React Native", "TypeScript", "Supabase (Postgres · Auth · RLS)", "Next.js 16", "NativeWind", "GitHub Actions"],
    updated: "2026-07-29",
  },
  sections: [
    { id: "resume", title: "Summary", modes: ["recruiter"],
      body: "Cadence connects a strength coach with their athletes: the coach builds programs, the athlete follows them and logs sessions. Co-founded with Alexandre (product & design), I own all the tech. The project is discovery-led: validated athlete personas, competitive analysis, then a documented \"athlete-first\" pivot." },
    { id: "probleme", title: "Problem & market", modes: ["recruiter", "engineering"],
      body: "Independent coaches juggle spreadsheets, messages and videos. Cadence centralizes program, tracking and communication.",
      points: ["Beachhead: francophone gym coaches in Quebec", "Two athlete personas validated through interviews (Mom Test)", "Competition analyzed: Hevy, TrueCoach, Everfit, Trainerize, Hexfit"] },
    { id: "role", title: "My role", modes: ["recruiter", "engineering"],
      body: "Co-founder and tech lead: architecture, data model, authorization, auth, CI/security and development. Alexandre leads product and design; product decisions are shared." },
    { id: "contribution", title: "Main contribution", modes: ["recruiter"],
      points: ["The data model (14 tables) and its Row-Level Security authorization", "The auth system (mobile + web) on Supabase", "The mobile app architecture (Expo/React Native) + design system", "A CI pipeline with security analysis (secret scanning, dependency audit)"] },
    { id: "fiche", title: "Tech sheet", modes: ["engineering"],
      points: ["Mobile: Expo SDK 54 · React Native 0.81 · Expo Router · NativeWind · expo-secure-store", "Backend: Supabase — Postgres, Auth, Row-Level Security", "Web: Next.js 16 (landing with waitlist + app dashboard)", "State: mobile app at pre-MVP (auth + navigation + design system); features mostly live in the web app"] },
    { id: "acteurs", title: "Actors", modes: ["engineering"],
      points: ["Coach: creates exercises, programs, sessions; follows athletes", "Athlete: follows programs, logs sessions and readiness", "Coach's private note: never visible to the athlete (authorization rule)"] },
    { id: "architecture", title: "Architecture", modes: ["engineering"], kind: "flow",
      body: "The mobile app (Expo/React Native) and the web app (Next.js) share a Supabase backend: Athlete/Coach → app → Supabase (Auth + RLS-protected Postgres) → server actions / queries. A separate Next.js landing (waitlist, Turnstile anti-bot, analytics)." },
    { id: "data", title: "Data model", modes: ["engineering"], kind: "data-model", collapsible: true,
      body: "14 tables, with the coach ↔ athlete relationship at the center and soft-delete everywhere.",
      points: ["profiles · coach_athletes (link, status pending/active/inactive)", "exercises · programs · sessions · session_exercises (sets/reps/rest/tempo)", "program_assignments · session_logs · exercise_logs (reps/weight/RPE/PR)", "readiness_logs (sleep/energy/…, generated column) · conversations · messages", "session_images · coach_notes (private) · soft-delete + partial indexes"] },
    { id: "securite", title: "Security & authorization", modes: ["engineering"], collapsible: true,
      body: "Authorization lives in the database: Row-Level Security on all 14 tables, with role-aware policies.",
      points: ["A coach sees an athlete's logs only if the relationship is \"active\"", "Coach notes are invisible to the athlete", "A recursive RLS-policy bug found and fixed (dedicated migration)", "Tokens stored via expo-secure-store; email masking on display"] },
    { id: "decisions", title: "Architecture decisions", modes: ["engineering"], kind: "decisions" },
    { id: "responsabilites", title: "Who did what", modes: ["recruiter", "engineering"], kind: "raci" },
    { id: "tests", title: "Tests & CI/CD", modes: ["engineering"], collapsible: true,
      body: "Pipeline in place, coverage deliberately modest for now.",
      points: ["CI: lint · typecheck · tests · Expo build", "Security: dependency audit · ESLint-security · secret scanning (TruffleHog) · Dependabot", "OTA via Expo; EAS previews on PRs", "Honest: tests mostly cover pure utilities (a low threshold, owned at this stage)"] },
    { id: "avancement", title: "Progress & preparation", modes: ["recruiter", "engineering"], kind: "metrics",
      body: "At this stage most of the work is preparation and design — shown as such, not as product results." },
    { id: "risques", title: "Risks & next steps", modes: ["engineering"], kind: "limits" },
    { id: "apprentissages", title: "Lessons", modes: ["recruiter"],
      body: "The main lesson: only build on validated demand. Only the athlete personas were validated — hence the \"athlete-first\" pivot (the athlete app first, coach later) rather than building speculative coach features." },
  ],
  metrics: [
    { label: "structured issues (177 web + 64 mobile)", value: "241", evidence: "planned", note: "governance & traceability — not a product result" },
    { label: "tables · RLS on all of them", value: "14", evidence: "implemented" },
    { label: "athlete personas validated (Mom Test)", value: "2", evidence: "validated" },
    { label: "competing apps analyzed", value: "5", evidence: "validated" },
    { label: "mobile app: auth + navigation + design system", value: "✓", evidence: "implemented" },
    { label: "mobile feature screens", value: "designed", evidence: "designed", note: "full mockups; implementation to come" },
  ],
  decisions: [
    { id: "adr-001", title: "\"Athlete-first\" pivot (4 phases)",
      context: "Only the athlete personas had been validated through interviews; the coach personas had not.",
      decision: "Re-order the roadmap into 4 phases: athlete mobile app, then coach mobile, then athlete web, then coach web.",
      rationale: "Build on validated demand rather than untested coach assumptions.",
      tradeoff: "Coach features arrive later." },
    { id: "adr-002", title: "Exercises as a reusable library",
      context: "The same exercise is used across many sessions and programs.",
      decision: "A coach-owned exercise library + a session↔exercise junction table (sets/reps/rest/tempo).",
      rationale: "Avoid duplication and enable reuse.",
      tradeoff: "A few more joins to manage." },
    { id: "adr-003", title: "Authorization in the database (RLS)",
      context: "Sensitive data (health, coach's private notes) shared across roles.",
      decision: "Row-Level Security on all 14 tables + soft-delete everywhere, rather than app-only checks.",
      rationale: "Defense in depth: the database denies access even if the app slips.",
      tradeoff: "Policies to write and debug (one recursion bug fixed)." },
  ],
  responsibilities: [
    { area: "Technical architecture", me: "lead", other: "consulted", otherName: "Alexandre", shared: false },
    { area: "Data model & RLS", me: "lead", other: "none", shared: false },
    { area: "Development", me: "lead", other: "none", shared: false },
    { area: "UX/UI design", me: "consulted", other: "lead", otherName: "Alexandre", shared: true },
    { area: "Product & prioritization", me: "contributor", other: "contributor", otherName: "Alexandre", shared: true },
    { area: "User research", me: "contributor", other: "lead", otherName: "Alexandre", shared: true },
  ],
  responsibilitiesNote: "\"Other\" = Alexandre Boisvert (co-founder, product & design).",
  limits: [
    "The mobile app (flagship surface) has auth, navigation and the design system, but its feature screens are still mockups.",
    "Coach personas aren't validated yet — an owned blocker before the coach phase.",
    "Push notifications, offline mode and formal Loi 25 compliance: planned, not yet built.",
    "Tests mostly cover utilities; coverage will grow with the features.",
  ],
  links: [
    { label: "Live landing", url: "https://cadence-web-fawn.vercel.app", kind: "demo" },
    { label: "GitHub (mobile)", url: "https://github.com/ralphgabriel04/cadence-mobile", kind: "repo" },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// DPM ELEVATE — solo product, SaaS-architected, deployed (single-user).
// The strongest engineering story: real tests, real security, real breadth.
// ─────────────────────────────────────────────────────────────────────────────

const dpmFr: CaseStudyV2 = {
  modes: ["recruiter", "engineering"],
  identity: {
    valueProp: "Une application web de planification — agenda, tâches, habitudes, objectifs et focus — pensée « vie privée d'abord », avec synchronisation réelle des calendriers Google et Microsoft.",
    kind: "Produit personnel · architecture SaaS",
    domain: "Productivité",
    maturity: "production",
    maturityLabel: "En production · mono-utilisateur",
    period: "2025 · présent",
    team: "Solo",
    role: "Fondateur · Développeur (solo)",
    market: "Personnel aujourd'hui · architecture multi-locataire prête",
    platforms: ["Web (responsive)"],
    stack: ["Next.js 14", "TypeScript", "tRPC v11", "Prisma · PostgreSQL", "NextAuth v5", "Tailwind · Radix", "Vitest · Playwright", "Vercel"],
    updated: "2026-07-29",
  },
  sections: [
    { id: "resume", title: "Résumé", modes: ["recruiter"],
      body: "DPM Elevate réunit agenda, tâches, habitudes, objectifs et focus dans une seule application web, déployée et fonctionnelle. Je l'ai conçue et développée seul, de bout en bout, avec une vraie exigence de sécurité et de vie privée : synchronisation réelle des calendriers Google et Microsoft, chiffrement des jetons, autorisation en défense en profondeur et fonctions Loi 25 en libre-service." },
    { id: "probleme", title: "Problème", modes: ["recruiter", "engineering"],
      body: "Les outils de productivité éparpillent le calendrier, les tâches et les habitudes dans plusieurs apps. DPM Elevate les réunit, en gardant les données de l'utilisateur sous son contrôle." },
    { id: "role", title: "Mon rôle", modes: ["recruiter", "engineering"],
      body: "Projet solo : conception produit, architecture, développement, sécurité, tests et déploiement — tout par moi. C'est mon terrain pour pousser une architecture propre et une sécurité sérieuse de bout en bout." },
    { id: "contribution", title: "Contribution principale", modes: ["recruiter"],
      points: ["Architecture par feature avec API type-safe de bout en bout (tRPC)", "Sécurité : chiffrement des jetons + autorisation en défense en profondeur (RLS)", "Synchronisation réelle des calendriers Google et Microsoft", "Vraie stratégie de tests (unitaires, RLS, bout-en-bout Playwright)"] },
    { id: "fiche", title: "Fiche technique", modes: ["engineering"],
      points: ["Next.js 14 (App Router) · TypeScript strict · tRPC v11 + Zod", "Prisma + PostgreSQL (Supabase) · 55 modèles · 15 migrations", "NextAuth v5 (Google · Microsoft · Apple · GitHub · OIDC)", "TanStack Query (serveur) + Zustand (UI) · déployé sur Vercel"] },
    { id: "acteurs", title: "Acteurs", modes: ["engineering"],
      points: ["Un utilisateur, authentifié par un des cinq fournisseurs", "Intégrations : Google Calendar, Microsoft Outlook (sync réelle)", "Architecture multi-locataire prête (mono-utilisateur en exploitation)"] },
    { id: "architecture", title: "Architecture", modes: ["engineering"], kind: "flow",
      body: "Client Next.js → API tRPC type-safe (routeurs par feature) → Prisma → PostgreSQL protégé par Row-Level Security. Auth NextAuth v5 ; synchronisation calendrier via cron Vercel. Chaque procédure vérifie la session de l'utilisateur ; la base applique en plus la RLS." },
    { id: "data", title: "Modèle de données", modes: ["engineering"], kind: "data-model", collapsible: true,
      body: "55 modèles Prisma, organisés par domaine.",
      points: ["Agenda & événements · synchronisation (Google/Microsoft)", "Tâches · habitudes · objectifs · sessions de focus", "Collaboration & espaces partagés", "Facturation · confidentialité · journal d'audit · intégrations"] },
    { id: "securite", title: "Sécurité & vie privée", modes: ["engineering"], collapsible: true,
      body: "La sécurité et la vie privée sont au cœur du produit — en défense en profondeur.",
      points: ["Autorisation à deux niveaux : vérification par procédure (session) + Row-Level Security PostgreSQL", "Jetons OAuth chiffrés au repos (AES-256-GCM, format versionné, migration incrémentale)", "Limitation de débit + journal d'audit", "Loi 25 : suppression de compte, export et journal en libre-service (principes intégrés ; audit juridique à compléter)"] },
    { id: "decisions", title: "Décisions d'architecture", modes: ["engineering"], kind: "decisions" },
    { id: "tests", title: "Tests & qualité", modes: ["recruiter", "engineering"], collapsible: true,
      body: "Une vraie stratégie de tests, du unitaire au bout-en-bout.",
      points: ["Unitaires : chiffrement, limitation de débit, chronotype, planificateur IA", "Tests des routeurs tRPC", "Test d'intégration de la Row-Level Security (isolation entre utilisateurs)", "Suite Playwright end-to-end (~30 scénarios : isolation, vie privée, facturation)"] },
    { id: "etat", title: "État & résultats", modes: ["recruiter", "engineering"], kind: "metrics",
      body: "Les résultats présentés sont techniques (implémenté, testé, déployé). Il n'y a pas encore de métriques d'usage réelles — l'app est mono-utilisateur." },
    { id: "risques", title: "Risques & limites", modes: ["engineering"], kind: "limits" },
    { id: "apprentissages", title: "Apprentissages", modes: ["recruiter"],
      body: "Investir tôt dans l'autorisation (RLS) et le chiffrement paie : ça encadre tout le reste. La migration incrémentale des jetons (préfixe de version pour détecter le déjà-chiffré) a évité un « big-bang » risqué." },
  ],
  metrics: [
    { label: "routeurs tRPC (par feature)", value: "32", evidence: "implemented" },
    { label: "modèles de données · 15 migrations", value: "55", evidence: "implemented" },
    { label: "fichiers de tests (unit · RLS · e2e)", value: "53", evidence: "tested" },
    { label: "chiffrement des jetons OAuth", value: "AES-256", evidence: "implemented" },
    { label: "fournisseurs d'auth (NextAuth v5)", value: "5", evidence: "implemented" },
    { label: "Loi 25 · export + suppression libre-service", value: "✓", evidence: "implemented" },
  ],
  decisions: [
    { id: "adr-001", title: "API type-safe de bout en bout (tRPC) + architecture par feature",
      context: "Un produit large (agenda, tâches, habitudes, objectifs, focus…) à faire évoluer sans casser.",
      decision: "tRPC v11 avec des routeurs découpés par feature, validation Zod.",
      rationale: "Types partagés client↔serveur, refactorings sûrs, domaine lisible.",
      tradeoff: "Couplage au monolithe Next.js (assumé au stade actuel)." },
    { id: "adr-002", title: "Autorisation en défense en profondeur",
      context: "Données personnelles sensibles ; une seule erreur applicative ne doit pas tout exposer.",
      decision: "Vérification de la session dans chaque procédure tRPC + Row-Level Security PostgreSQL.",
      rationale: "La base refuse l'accès même si l'application se trompe.",
      tradeoff: "Politiques RLS à écrire et maintenir." },
    { id: "adr-003", title: "Chiffrement des jetons au repos + migration incrémentale",
      context: "Stocker des jetons OAuth Google/Microsoft en clair est inacceptable.",
      decision: "Chiffrement AES-256-GCM avec un format versionné (préfixe « enc:v1: »).",
      rationale: "Le préfixe détecte le déjà-chiffré → migration progressive, sans « big-bang ».",
      tradeoff: "Gestion de clé et code de chiffrement à maintenir." },
  ],
  limits: [
    "Mono-utilisateur aujourd'hui : l'architecture multi-locataire est prête mais pas exploitée commercialement.",
    "Aucune métrique d'usage réelle (pas encore de vrais utilisateurs) — les résultats présentés sont techniques.",
    "CSP en mode « Report-Only » (observation, pas encore bloquant).",
    "Conformité Loi 25 : principes intégrés et fonctions en libre-service, mais sans audit juridique formel.",
  ],
  links: [
    { label: "App en ligne", url: "https://dpm-calendar.vercel.app", kind: "product" },
    { label: "GitHub", url: "https://github.com/ralphgabriel04/dpm-calendar", kind: "repo" },
    { label: "Maquette (design)", url: "/dpm-elevate/index.html", kind: "demo" },
  ],
};

const dpmEn: CaseStudyV2 = {
  modes: ["recruiter", "engineering"],
  identity: {
    valueProp: "A planning web app — calendar, tasks, habits, goals and focus — built \"privacy-first\", with real Google and Microsoft calendar sync.",
    kind: "Personal product · SaaS architecture",
    domain: "Productivity",
    maturity: "production",
    maturityLabel: "In production · single-user",
    period: "2025 · present",
    team: "Solo",
    role: "Founder · Developer (solo)",
    market: "Personal today · multi-tenant architecture ready",
    platforms: ["Web (responsive)"],
    stack: ["Next.js 14", "TypeScript", "tRPC v11", "Prisma · PostgreSQL", "NextAuth v5", "Tailwind · Radix", "Vitest · Playwright", "Vercel"],
    updated: "2026-07-29",
  },
  sections: [
    { id: "resume", title: "Summary", modes: ["recruiter"],
      body: "DPM Elevate brings calendar, tasks, habits, goals and focus into a single web app — deployed and working. I designed and built it solo, end to end, with real attention to security and privacy: real Google and Microsoft calendar sync, encrypted tokens, defense-in-depth authorization and self-serve Loi 25 features." },
    { id: "probleme", title: "Problem", modes: ["recruiter", "engineering"],
      body: "Productivity tools scatter calendar, tasks and habits across many apps. DPM Elevate brings them together, keeping the user's data under their control." },
    { id: "role", title: "My role", modes: ["recruiter", "engineering"],
      body: "Solo project: product design, architecture, development, security, tests and deployment — all me. It's my ground for pushing clean architecture and serious end-to-end security." },
    { id: "contribution", title: "Main contribution", modes: ["recruiter"],
      points: ["Feature-sliced architecture with an end-to-end type-safe API (tRPC)", "Security: token encryption + defense-in-depth authorization (RLS)", "Real Google and Microsoft calendar sync", "A real testing strategy (unit, RLS, end-to-end Playwright)"] },
    { id: "fiche", title: "Tech sheet", modes: ["engineering"],
      points: ["Next.js 14 (App Router) · strict TypeScript · tRPC v11 + Zod", "Prisma + PostgreSQL (Supabase) · 55 models · 15 migrations", "NextAuth v5 (Google · Microsoft · Apple · GitHub · OIDC)", "TanStack Query (server) + Zustand (UI) · deployed on Vercel"] },
    { id: "acteurs", title: "Actors", modes: ["engineering"],
      points: ["One user, authenticated via one of five providers", "Integrations: Google Calendar, Microsoft Outlook (real sync)", "Multi-tenant architecture ready (single-user in operation)"] },
    { id: "architecture", title: "Architecture", modes: ["engineering"], kind: "flow",
      body: "Next.js client → type-safe tRPC API (feature-sliced routers) → Prisma → PostgreSQL protected by Row-Level Security. NextAuth v5 auth; calendar sync via Vercel cron. Every procedure checks the user's session; the database also enforces RLS." },
    { id: "data", title: "Data model", modes: ["engineering"], kind: "data-model", collapsible: true,
      body: "55 Prisma models, organized by domain.",
      points: ["Calendar & events · sync (Google/Microsoft)", "Tasks · habits · goals · focus sessions", "Collaboration & shared spaces", "Billing · privacy · audit log · integrations"] },
    { id: "securite", title: "Security & privacy", modes: ["engineering"], collapsible: true,
      body: "Security and privacy are at the core — defense in depth.",
      points: ["Two-layer authorization: per-procedure session check + PostgreSQL Row-Level Security", "OAuth tokens encrypted at rest (AES-256-GCM, versioned format, incremental migration)", "Rate limiting + audit log", "Loi 25: self-serve account deletion, data export and audit log (principles built in; formal legal audit pending)"] },
    { id: "decisions", title: "Architecture decisions", modes: ["engineering"], kind: "decisions" },
    { id: "tests", title: "Tests & quality", modes: ["recruiter", "engineering"], collapsible: true,
      body: "A real testing strategy, from unit to end-to-end.",
      points: ["Unit: encryption, rate limiting, chronotype, AI scheduler", "tRPC router tests", "Row-Level Security integration test (isolation between users)", "Playwright end-to-end suite (~30 scenarios: isolation, privacy, billing)"] },
    { id: "etat", title: "State & results", modes: ["recruiter", "engineering"], kind: "metrics",
      body: "The results shown are technical (implemented, tested, deployed). There are no real usage metrics yet — the app is single-user." },
    { id: "risques", title: "Risks & limits", modes: ["engineering"], kind: "limits" },
    { id: "apprentissages", title: "Lessons", modes: ["recruiter"],
      body: "Investing early in authorization (RLS) and encryption pays off: it frames everything else. The incremental token migration (a version prefix to detect already-encrypted values) avoided a risky big-bang." },
  ],
  metrics: [
    { label: "tRPC routers (feature-sliced)", value: "32", evidence: "implemented" },
    { label: "data models · 15 migrations", value: "55", evidence: "implemented" },
    { label: "test files (unit · RLS · e2e)", value: "53", evidence: "tested" },
    { label: "OAuth token encryption", value: "AES-256", evidence: "implemented" },
    { label: "auth providers (NextAuth v5)", value: "5", evidence: "implemented" },
    { label: "Loi 25 · self-serve export + deletion", value: "✓", evidence: "implemented" },
  ],
  decisions: [
    { id: "adr-001", title: "End-to-end type-safe API (tRPC) + feature-sliced architecture",
      context: "A broad product (calendar, tasks, habits, goals, focus…) to evolve without breaking.",
      decision: "tRPC v11 with routers sliced per feature, Zod validation.",
      rationale: "Shared client↔server types, safe refactors, a readable domain.",
      tradeoff: "Coupling to the Next.js monolith (owned at this stage)." },
    { id: "adr-002", title: "Defense-in-depth authorization",
      context: "Sensitive personal data; a single app-level slip must not expose everything.",
      decision: "Session check in every tRPC procedure + PostgreSQL Row-Level Security.",
      rationale: "The database denies access even if the app gets it wrong.",
      tradeoff: "RLS policies to write and maintain." },
    { id: "adr-003", title: "Token encryption at rest + incremental migration",
      context: "Storing Google/Microsoft OAuth tokens in plaintext is unacceptable.",
      decision: "AES-256-GCM encryption with a versioned format (\"enc:v1:\" prefix).",
      rationale: "The prefix detects already-encrypted values → gradual migration, no big-bang.",
      tradeoff: "Key management and crypto code to maintain." },
  ],
  limits: [
    "Single-user today: the multi-tenant architecture is ready but not commercially operated.",
    "No real usage metrics yet (no real users) — the results shown are technical.",
    "CSP in \"Report-Only\" mode (observed, not yet enforced).",
    "Loi 25 compliance: principles built in and self-serve features shipped, but no formal legal audit.",
  ],
  links: [
    { label: "Live app", url: "https://dpm-calendar.vercel.app", kind: "product" },
    { label: "GitHub", url: "https://github.com/ralphgabriel04/dpm-calendar", kind: "repo" },
    { label: "Mockup (design)", url: "/dpm-elevate/index.html", kind: "demo" },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// CLIENT MANDATES — recruiter + business modes. Honestly framed as delivered
// high-fidelity prototypes / mockups (viewable online), not production sites.
// ─────────────────────────────────────────────────────────────────────────────

const kimFr: CaseStudyV2 = {
  modes: ["recruiter", "business"],
  identity: {
    valueProp: "Refonte du site d'une photographe animalière primée à l'international — de la découverte du besoin jusqu'à une maquette complète et testable.",
    kind: "Mandat client · premier client payant",
    domain: "Site vitrine · photographie",
    maturity: "prototype",
    maturityLabel: "Maquette livrée (prototype)",
    period: "2026",
    role: "Freelance · Design, prototypage & relation client",
    market: "Photographe animalière (TIPPA 2024-2025) · particuliers & commercial",
    platforms: ["Web · maquette bilingue clair/sombre"],
    stack: ["Claude Design → Claude Code", "HTML/CSS/JS (React + Babel)", "i18n FR/EN", "Cible : Next.js + TS + Tailwind"],
    updated: "2026-07-29",
  },
  sections: [
    { id: "resume", title: "Résumé", modes: ["recruiter"], body: "Reprise et refonte du site d'une photographe animalière primée (TIPPA), dont le site Wix était resté inachevé. Une démarche complète orientée premier client payant : découverte structurée, cadrage, puis une maquette générée et implémentée, itérée avec la cliente." },
    { id: "client", title: "Le client", modes: ["recruiter", "business"], body: "Une photographe animalière primée à l'international (TIPPA 2024-2025, Bronze), dont le site Wix était resté inachevé — mon premier client payant." },
    { id: "mandat", title: "Situation & mandat", modes: ["business"], body: "Reprendre un site inachevé et le refondre, avec un objectif clair : convertir de vrais visiteurs en clients.", points: ["Pas de présence web professionnelle exploitable", "Deux audiences : particuliers et commercial", "Un premier mandat payant, donc une confiance à établir"] },
    { id: "demarche", title: "Déroulement", modes: ["recruiter", "business"], body: "Une démarche cadrée avant de produire quoi que ce soit.", points: ["Formulaire de découverte (60 questions)", "Deck de présentation (9 diapos) pour cadrer l'appel", "Brief structuré, puis maquette générée et implémentée", "Plusieurs itérations à partir des retours de la cliente"] },
    { id: "solution", title: "La solution livrée", modes: ["recruiter", "business"], body: "Une maquette multi-pages bilingue, claire/sombre, réellement navigable.", points: ["Multi-pages : accueil, galerie portfolio, page distinctions", "~15 sections modulaires (héros, forfaits, témoignages, boutique, FAQ…)", "Vraies photos primées par catégorie · carrousel + lightbox", "Mode admin « liberté encadrée » : éditer contenu et apparence sans casser la maquette"] },
    { id: "livrables", title: "Livrables & état", modes: ["recruiter", "business"], kind: "metrics", body: "Le livrable est une maquette complète et interactive — un prototype, pas encore un site en production." },
    { id: "services", title: "Ce que je peux reproduire", modes: ["business"], body: "La même démarche pour un autre client.", points: ["Découverte structurée (formulaire + appel cadré)", "Prototype haute-fidélité bilingue clair/sombre", "Éditeur admin pour absorber les retours sans tout casser", "Passage en production (Next.js + TypeScript)"] },
    { id: "limites", title: "Limites", modes: ["recruiter", "business"], kind: "limits" },
  ],
  metrics: [
    { label: "sections modulaires", value: "~15", evidence: "designed" },
    { label: "pages (accueil · galerie · distinctions)", value: "3", evidence: "implemented" },
    { label: "maquette bilingue · clair/sombre", value: "✓", evidence: "implemented" },
    { label: "maquette en ligne (démo)", value: "Live", evidence: "deployed" },
  ],
  limits: ["C'est une maquette haute-fidélité, pas encore un site en production.", "Passage en production (Next.js) et textes légaux à finaliser avec la cliente."],
  links: [
    { label: "Maquette en ligne", url: "/kim-dubois/index.html", kind: "demo" },
    { label: "Instagram", url: "https://www.instagram.com/kimduboisphotographeanimaliere/", kind: "doc" },
  ],
};

const kimEn: CaseStudyV2 = {
  modes: ["recruiter", "business"],
  identity: {
    valueProp: "Redesign of an internationally awarded pet photographer's site — from discovering the need to a complete, testable mockup.",
    kind: "Client mandate · first paying client",
    domain: "Portfolio site · photography",
    maturity: "prototype",
    maturityLabel: "Delivered mockup (prototype)",
    period: "2026",
    role: "Freelance · Design, prototyping & client relations",
    market: "Pet photographer (TIPPA 2024-2025) · consumer & commercial",
    platforms: ["Web · bilingual light/dark mockup"],
    stack: ["Claude Design → Claude Code", "HTML/CSS/JS (React + Babel)", "i18n FR/EN", "Target: Next.js + TS + Tailwind"],
    updated: "2026-07-29",
  },
  sections: [
    { id: "resume", title: "Summary", modes: ["recruiter"], body: "Takeover and redesign of an awarded pet photographer's (TIPPA) site, whose Wix site had been left unfinished. A full first-paying-client process: structured discovery, framing, then a generated-and-implemented mockup, iterated with the client." },
    { id: "client", title: "The client", modes: ["recruiter", "business"], body: "An internationally awarded pet photographer (TIPPA 2024-2025, Bronze), whose Wix site had been left unfinished — my first paying client." },
    { id: "mandat", title: "Situation & mandate", modes: ["business"], body: "Take over an unfinished site and redesign it, with a clear goal: turn real visitors into clients.", points: ["No usable professional web presence", "Two audiences: consumer and commercial", "A first paid mandate — trust to build"] },
    { id: "demarche", title: "Process", modes: ["recruiter", "business"], body: "A framed process before producing anything.", points: ["A 60-question discovery form", "A 9-slide deck to frame the call", "A structured brief, then a generated-and-implemented mockup", "Several iterations from the client's feedback"] },
    { id: "solution", title: "The delivered solution", modes: ["recruiter", "business"], body: "A multi-page bilingual mockup, light/dark, genuinely navigable.", points: ["Multi-page: home, portfolio gallery, distinctions page", "~15 modular sections (hero, packages, testimonials, shop, FAQ…)", "Real awarded photos by category · carousel + lightbox", "Admin mode \"bounded freedom\": edit content and look without breaking the mockup"] },
    { id: "livrables", title: "Deliverables & state", modes: ["recruiter", "business"], kind: "metrics", body: "The deliverable is a complete, interactive mockup — a prototype, not yet a production site." },
    { id: "services", title: "What I can reproduce", modes: ["business"], body: "The same process for another client.", points: ["Structured discovery (form + framed call)", "High-fidelity bilingual light/dark prototype", "Admin editor to absorb feedback without breaking things", "Move to production (Next.js + TypeScript)"] },
    { id: "limites", title: "Limits", modes: ["recruiter", "business"], kind: "limits" },
  ],
  metrics: [
    { label: "modular sections", value: "~15", evidence: "designed" },
    { label: "pages (home · gallery · distinctions)", value: "3", evidence: "implemented" },
    { label: "bilingual mockup · light/dark", value: "✓", evidence: "implemented" },
    { label: "mockup online (demo)", value: "Live", evidence: "deployed" },
  ],
  limits: ["It's a high-fidelity mockup, not yet a production site.", "Move to production (Next.js) and legal copy to finalize with the client."],
  links: [
    { label: "Live mockup", url: "/kim-dubois/index.html", kind: "demo" },
    { label: "Instagram", url: "https://www.instagram.com/kimduboisphotographeanimaliere/", kind: "doc" },
  ],
};

const boaFr: CaseStudyV2 = {
  modes: ["recruiter", "business"],
  identity: {
    valueProp: "Site de réservation pour un chef privé à Montréal — une expérience éditoriale et un parcours de réservation complet, entièrement maquettés.",
    kind: "Mandat client · chef privé",
    domain: "Réservation · service à table",
    maturity: "prototype",
    maturityLabel: "Prototype (maquette)",
    period: "2026",
    role: "Freelance · Design produit, prototypage & relation client",
    market: "Chef privé & service à table à Montréal (soupers privés, événements)",
    platforms: ["Web · maquette bilingue clair/sombre"],
    stack: ["Claude Design → Claude Code", "HTML/CSS/JS", "i18n FR/EN", "Cible : Next.js + Stripe/Square + Calendly"],
    updated: "2026-07-29",
  },
  sections: [
    { id: "resume", title: "Résumé", modes: ["recruiter"], body: "Conception et prototype d'un site de chef privé et service à table à Montréal (chef Max), repris d'un PRD client et d'une analyse concurrentielle. Le site vend une expérience plutôt qu'un simple traiteur, avec un parcours de réservation complet — le tout proprement mocké." },
    { id: "client", title: "Le client", modes: ["recruiter", "business"], body: "Chef Max, qui lance sa marque de chef privé et service à table à Montréal." },
    { id: "mandat", title: "Mandat & cadrage", modes: ["business"], body: "Transformer un besoin en site vendeur, à partir des documents du client.", points: ["PRD rempli par le client (document Word)", "Analyse concurrentielle (Take a Chef, The Culinistas, Cozymeal, Tock)", "Vendre une expérience, pas un simple service de traiteur"] },
    { id: "solution", title: "La solution maquettée", modes: ["recruiter", "business"], body: "Une maquette éditoriale bilingue avec un vrai parcours de réservation.", points: ["Accueil éditorial · menus · expériences · galerie · contact", "Concierge culinaire : une reco de menu en 30 s", "Réservation multi-étapes : menu → date → format → convives → adresse → dépôt 25 % → paiement (mocké) → confirmation", "Mode admin avec emplacements photo en glisser-déposer"] },
    { id: "livrables", title: "Livrables & état", modes: ["recruiter", "business"], kind: "metrics", body: "Tout est proprement mocké — aucun paiement réel, aucune IA branchée — en attendant les décisions du client." },
    { id: "services", title: "Ce que je peux reproduire", modes: ["business"], points: ["Prototype éditorial + parcours de réservation", "Branchement paiement (Stripe/Square) et calendrier (Calendly)", "Mode admin pour brancher les vraies images et textes", "Passage en production"] },
    { id: "limites", title: "Limites", modes: ["recruiter", "business"], kind: "limits" },
  ],
  metrics: [
    { label: "parcours de réservation multi-étapes", value: "✓", evidence: "designed" },
    { label: "concierge menu (30 s) + chatbot", value: "✓", evidence: "designed" },
    { label: "bilingue FR/EN · clair/sombre", value: "✓", evidence: "implemented" },
    { label: "maquette en ligne (démo)", value: "Live", evidence: "deployed" },
  ],
  limits: ["Tout est mocké : aucun paiement réel, aucune IA réellement branchée.", "Prix, calendrier, processeur de paiement et textes légaux (Loi 25) à trancher avec le client."],
  links: [{ label: "Maquette en ligne", url: "/boa-traiteur/index.html", kind: "demo" }],
};

const boaEn: CaseStudyV2 = {
  modes: ["recruiter", "business"],
  identity: {
    valueProp: "A booking site for a private chef in Montréal — an editorial experience and a full booking flow, entirely mocked up.",
    kind: "Client mandate · private chef",
    domain: "Booking · table service",
    maturity: "prototype",
    maturityLabel: "Prototype (mockup)",
    period: "2026",
    role: "Freelance · Product design, prototyping & client relations",
    market: "Private chef & table service in Montréal (private dinners, events)",
    platforms: ["Web · bilingual light/dark mockup"],
    stack: ["Claude Design → Claude Code", "HTML/CSS/JS", "i18n FR/EN", "Target: Next.js + Stripe/Square + Calendly"],
    updated: "2026-07-29",
  },
  sections: [
    { id: "resume", title: "Summary", modes: ["recruiter"], body: "Design and prototype of a private-chef and table-service site in Montréal (chef Max), built from a client PRD and a competitive analysis. The site sells an experience rather than plain catering, with a full booking flow — all cleanly mocked." },
    { id: "client", title: "The client", modes: ["recruiter", "business"], body: "Chef Max, launching his private-chef and table-service brand in Montréal." },
    { id: "mandat", title: "Mandate & framing", modes: ["business"], body: "Turn a need into a selling site, from the client's documents.", points: ["A client-filled PRD (Word document)", "A competitive analysis (Take a Chef, The Culinistas, Cozymeal, Tock)", "Sell an experience, not plain catering"] },
    { id: "solution", title: "The mocked solution", modes: ["recruiter", "business"], body: "A bilingual editorial mockup with a real booking flow.", points: ["Editorial home · menus · experiences · gallery · contact", "Culinary concierge: a menu recommendation in 30s", "Multi-step booking: menu → date → format → guests → address → 25% deposit → payment (mocked) → confirmation", "Admin mode with drag-and-drop photo slots"] },
    { id: "livrables", title: "Deliverables & state", modes: ["recruiter", "business"], kind: "metrics", body: "Everything is cleanly mocked — no real payment, no live AI — pending the client's decisions." },
    { id: "services", title: "What I can reproduce", modes: ["business"], points: ["Editorial prototype + booking flow", "Wiring payment (Stripe/Square) and calendar (Calendly)", "Admin mode to wire in real images and copy", "Move to production"] },
    { id: "limites", title: "Limits", modes: ["recruiter", "business"], kind: "limits" },
  ],
  metrics: [
    { label: "multi-step booking flow", value: "✓", evidence: "designed" },
    { label: "30s menu concierge + chatbot", value: "✓", evidence: "designed" },
    { label: "bilingual FR/EN · light/dark", value: "✓", evidence: "implemented" },
    { label: "mockup online (demo)", value: "Live", evidence: "deployed" },
  ],
  limits: ["Everything is mocked: no real payment, no live AI.", "Pricing, calendar, payment processor and legal copy (Loi 25) to decide with the client."],
  links: [{ label: "Live mockup", url: "/boa-traiteur/index.html", kind: "demo" }],
};

const crccFr: CaseStudyV2 = {
  modes: ["recruiter", "business"],
  identity: {
    valueProp: "Refonte complète du site d'un OSBL d'éleveurs bilingue — 10 pages, accessible, organisée autour de trois parcours.",
    kind: "Mandat client · OSBL",
    domain: "Refonte de site · OSBL",
    maturity: "prototype",
    maturityLabel: "Maquette de refonte livrée",
    period: "2026",
    role: "Design & prototypage (refonte)",
    market: "OSBL bilingue d'éleveurs (Club du Rex de Cornouailles du Canada)",
    platforms: ["Web · maquette statique bilingue clair/sombre"],
    stack: ["Claude Design", "HTML/CSS/JS statiques", "i18n maison FR/EN", "WCAG 2.2 AA"],
    updated: "2026-07-29",
  },
  sections: [
    { id: "resume", title: "Résumé", modes: ["recruiter"], body: "Maquette de refonte complète pour le Club du Rex de Cornouailles du Canada (OSBL bilingue d'éleveurs), organisée autour de trois parcours — adopter un chaton, devenir éleveur membre, soutenir le club." },
    { id: "client", title: "Le client", modes: ["recruiter", "business"], body: "Un organisme sans but lucratif bilingue d'éleveurs, dont le site avait besoin d'une refonte." },
    { id: "mandat", title: "Mandat", modes: ["business"], body: "Refondre le site autour de trois parcours clairs.", points: ["Adopter un chaton", "Devenir éleveur membre", "Soutenir le club"] },
    { id: "solution", title: "La solution livrée", modes: ["recruiter", "business"], body: "Un site statique multi-pages, accessible et bilingue, sans backend.", points: ["10 pages (accueil, la race, annuaire des éleveurs, codes & éthique, règlements…)", "Explorateur d'anatomie interactif · carte de répartition filtrable", "Identité Rouge & Blanc dérivée du logo officiel", "Données réelles intégrées (11 chatteries, associations félines) sans surpromettre"] },
    { id: "livrables", title: "Livrables & état", modes: ["recruiter", "business"], kind: "metrics", body: "Une maquette de refonte livrée, fidèle à la mission de l'organisme et prête à être mise en ligne." },
    { id: "services", title: "Ce que je peux reproduire", modes: ["business"], points: ["Refonte multi-pages accessible (WCAG 2.2 AA)", "Bilingue FR/EN · clair/sombre · mobile-first", "Intégration de données réelles sans backend", "Passage en production"] },
    { id: "limites", title: "Limites", modes: ["recruiter", "business"], kind: "limits" },
  ],
  metrics: [
    { label: "pages livrées", value: "10", evidence: "implemented" },
    { label: "chatteries · données réelles", value: "11", evidence: "validated" },
    { label: "accessibilité WCAG 2.2 AA", value: "AA", evidence: "implemented" },
    { label: "maquette en ligne (démo)", value: "Live", evidence: "deployed" },
  ],
  limits: ["Maquette statique sans backend.", "Données réelles intégrées sans inventer ni surpromettre ; mise en production à faire."],
  links: [
    { label: "Maquette en ligne", url: "/crcc/index.html", kind: "demo" },
    { label: "Site actuel", url: "https://club-crcc.ca", kind: "doc" },
  ],
};

const crccEn: CaseStudyV2 = {
  modes: ["recruiter", "business"],
  identity: {
    valueProp: "Complete redesign of a bilingual breeder nonprofit's site — 10 pages, accessible, organized around three journeys.",
    kind: "Client mandate · nonprofit",
    domain: "Site redesign · nonprofit",
    maturity: "prototype",
    maturityLabel: "Delivered redesign mockup",
    period: "2026",
    role: "Design & prototyping (redesign)",
    market: "Bilingual breeder nonprofit (Cornwall Rex Club of Canada)",
    platforms: ["Web · static bilingual light/dark mockup"],
    stack: ["Claude Design", "Static HTML/CSS/JS", "in-house i18n FR/EN", "WCAG 2.2 AA"],
    updated: "2026-07-29",
  },
  sections: [
    { id: "resume", title: "Summary", modes: ["recruiter"], body: "Complete redesign mockup for the Cornwall Rex Club of Canada (a bilingual breeder nonprofit), organized around three journeys — adopt a kitten, become a member breeder, support the club." },
    { id: "client", title: "The client", modes: ["recruiter", "business"], body: "A bilingual breeder nonprofit whose site needed a redesign." },
    { id: "mandat", title: "Mandate", modes: ["business"], body: "Redesign the site around three clear journeys.", points: ["Adopt a kitten", "Become a member breeder", "Support the club"] },
    { id: "solution", title: "The delivered solution", modes: ["recruiter", "business"], body: "A static multi-page site, accessible and bilingual, with no backend.", points: ["10 pages (home, the breed, breeder directory, codes & ethics, by-laws…)", "Interactive anatomy explorer · filterable distribution map", "Red & White identity derived from the official logo", "Real data integrated (11 catteries, feline associations) without overpromising"] },
    { id: "livrables", title: "Deliverables & state", modes: ["recruiter", "business"], kind: "metrics", body: "A redesign mockup delivered, true to the organization's mission and ready to go live." },
    { id: "services", title: "What I can reproduce", modes: ["business"], points: ["Accessible multi-page redesign (WCAG 2.2 AA)", "Bilingual FR/EN · light/dark · mobile-first", "Integrating real data with no backend", "Move to production"] },
    { id: "limites", title: "Limits", modes: ["recruiter", "business"], kind: "limits" },
  ],
  metrics: [
    { label: "pages delivered", value: "10", evidence: "implemented" },
    { label: "catteries · real data", value: "11", evidence: "validated" },
    { label: "WCAG 2.2 AA accessibility", value: "AA", evidence: "implemented" },
    { label: "mockup online (demo)", value: "Live", evidence: "deployed" },
  ],
  limits: ["Static mockup with no backend.", "Real data integrated without inventing or overpromising; production still to do."],
  links: [
    { label: "Live mockup", url: "/crcc/index.html", kind: "demo" },
    { label: "Current site", url: "https://club-crcc.ca", kind: "doc" },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// THE MAD SPACE — cofounded product, CTO. Recruiter + Engineering + Business.
// In production. Engineering limits are roadmap-framed (auth hardening + tests)
// WITHOUT exposing exploitable specifics — responsible non-disclosure.
// ─────────────────────────────────────────────────────────────────────────────

const madFr: CaseStudyV2 = {
  modes: ["recruiter", "engineering", "business"],
  identity: {
    valueProp: "Marketplace bilingue de créations imprimées à la demande : les créateurs soumettent leurs œuvres, elles deviennent des vêtements, et chaque vente leur verse une commission — paiement, production et suivi automatisés.",
    kind: "Produit cofondé · marketplace (CTO)",
    domain: "E-commerce · impression à la demande",
    maturity: "production",
    maturityLabel: "En production",
    period: "Produit lancé 2024 · CTO depuis 2025",
    team: "Fondateur (produit & marque) · Ralph (CTO · technique)",
    role: "CTO · Architecture, développement & intégrations",
    market: "Créateurs & acheteurs · Canada + international (4 devises)",
    platforms: ["Web (bilingue FR/EN)"],
    stack: ["Next.js 16", "TypeScript", "PostgreSQL · Prisma", "Stripe", "Gelato (POD)", "Supabase", "Resend", "Vercel"],
    updated: "2026-07-29",
  },
  sections: [
    { id: "resume", title: "Résumé", modes: ["recruiter"],
      body: "The Mad Space transforme les œuvres de créateurs en vêtements imprimés à la demande, et reverse une commission à chaque vente. J'y suis CTO : je porte l'architecture, le développement et les intégrations (paiement Stripe, production Gelato, courriels, suivi). Le produit est en production, bilingue et multidevise." },
    { id: "produit", title: "Le produit", modes: ["recruiter", "business"],
      body: "Une marketplace où les créateurs proposent leurs designs, qui deviennent des produits imprimés à la demande. L'acheteur commande, le créateur touche une commission, et la production comme l'expédition sont automatisées de bout en bout." },
    { id: "role", title: "Mon rôle (CTO)", modes: ["recruiter", "engineering", "business"],
      body: "Je suis responsable de toute la technique : conception de l'architecture, développement de l'application, intégrations de paiement et de production, sécurité et fiabilité. Le fondateur porte le produit, la marque et la relation créateurs.",
      points: ["Architecture Next.js sur mesure (32 pages · 37 modules de routes API)", "Intégrations Stripe (paiement) et Gelato (production/expédition)", "Modèle de données, commissions et suivi de commande", "Déploiement, courriels transactionnels et exploitation"] },
    { id: "modele", title: "Le modèle d'affaires", modes: ["business"],
      body: "Les créateurs monétisent leurs œuvres sans gérer ni stock ni logistique.",
      points: ["Le créateur soumet un design → il devient un produit imprimable", "Chaque vente lui verse une commission (calcul basé sur la marge, par paliers)", "Aucun stock ni avance : production à la commande", "La plateforme prend en charge paiement, production, expédition et suivi"] },
    { id: "automatisation", title: "Ce que la plateforme automatise", modes: ["business"],
      body: "Une commande passe de l'acheteur au fabricant sans étape manuelle.",
      points: ["Paiement encaissé (Stripe) et vérifié par signature", "Commande et commissions enregistrées automatiquement", "Production lancée chez Gelato", "Courriel de confirmation (Resend) et suivi de livraison"] },
    { id: "portee", title: "Portée", modes: ["recruiter", "business"],
      body: "Pensée pour un public large dès le départ.",
      points: ["Bilingue FR/EN", "4 devises (CAD · USD · EUR · GBP)", "Expédition Canada + international", "Blog / contenu intégré pour l'acquisition"] },
    { id: "fiche", title: "Fiche technique", modes: ["engineering"],
      body: "Application Next.js (App Router) sur PostgreSQL via Prisma, déployée sur Vercel, avec paiement Stripe et production déléguée à Gelato." },
    { id: "acteurs", title: "Acteurs", modes: ["engineering"],
      points: ["Acheteur : parcourt, commande, paie, suit sa livraison", "Créateur : soumet des designs (après vérification) et touche des commissions", "Admin : modère les designs, gère produits, blog et opérations"] },
    { id: "architecture", title: "Architecture & flux de commande", modes: ["engineering"], kind: "flow",
      body: "Acheteur → Stripe Checkout → webhook vérifié (signature HMAC) → enregistrement Commande + Ventes (+ calcul des commissions) → production Gelato (appel non bloquant) → courriel de confirmation (Resend) → suivi (webhook Gelato + cron de rattrapage)." },
    { id: "data", title: "Modèle de données", modes: ["engineering"], kind: "data-model", collapsible: true,
      body: "12 modèles Prisma (+ 8 énumérations) autour des créateurs, designs, produits, ventes et commandes.",
      points: ["Creator → Design → Product → ProductImage", "Sale = registre des commissions (créateur · produit · commande)", "Order : références Stripe & Gelato · statut de traitement · devise · suivi", "Blog (CMS + génération) · Review (acheteurs vérifiés) · codes de vérification créateur"] },
    { id: "securite", title: "Sécurité & fiabilité", modes: ["engineering"], collapsible: true,
      body: "Les points sensibles — paiement et production — sont vérifiés par signature avant tout traitement.",
      points: ["Webhooks Stripe et Gelato vérifiés par signature (HMAC)", "Validation des entrées (Zod) et messages d'erreur génériques", "Secrets pilotés par variables d'environnement", "Traitement de commande résilient : une commande payée n'est jamais perdue si la production échoue"] },
    { id: "decisions", title: "Décisions d'architecture", modes: ["engineering"], kind: "decisions" },
    { id: "etat", title: "État & résultats", modes: ["recruiter", "engineering", "business"], kind: "metrics",
      body: "Produit en production. Les métriques ci-dessous décrivent l'ampleur de ce qui est bâti et déployé — pas des chiffres de vente." },
    { id: "risques", title: "Risques & feuille de route", modes: ["engineering"], kind: "limits" },
    { id: "responsabilites", title: "Répartition des responsabilités", modes: ["engineering", "business"], kind: "raci" },
    { id: "apprentissages", title: "Apprentissages", modes: ["recruiter"],
      body: "Diriger la technique d'un vrai produit marchand : arbitrer entre livrer vite et bâtir solide, encaisser de l'argent réel de façon fiable, et garder une base qu'on peut faire évoluer sans tout casser." },
  ],
  metrics: [
    { label: "pages applicatives", value: "32", evidence: "implemented" },
    { label: "modules de routes API", value: "37", evidence: "implemented" },
    { label: "modèles de données (Prisma)", value: "12", evidence: "implemented" },
    { label: "devises (CAD · USD · EUR · GBP)", value: "4", evidence: "implemented" },
    { label: "langues (FR / EN)", value: "2", evidence: "implemented" },
    { label: "en production · Vercel", value: "Live", evidence: "deployed" },
  ],
  decisions: [
    { id: "ADR-01", title: "Next.js sur mesure plutôt qu'une plateforme e-commerce clé en main",
      context: "Multidevise, commissions par paliers, production déléguée et contenu — des règles trop spécifiques pour un gabarit générique.",
      decision: "Application Next.js (App Router) sur mesure, avec Prisma/PostgreSQL.",
      rationale: "Contrôle total sur le calcul des commissions, le flux de commande et les intégrations.",
      tradeoff: "Plus de code à écrire et à maintenir soi-même qu'avec une solution clé en main." },
    { id: "ADR-02", title: "Webhooks de paiement et de production vérifiés par signature",
      context: "L'argent et la fabrication se déclenchent sur des événements externes (Stripe, Gelato).",
      decision: "Vérifier la signature (HMAC) de chaque webhook avant tout traitement.",
      rationale: "Empêche qu'une requête falsifiée crée une commande ou une production.",
      tradeoff: "Chemins d'erreur et cas limites supplémentaires à coder." },
    { id: "ADR-03", title: "Production non bloquante",
      context: "L'appel de production chez Gelato peut échouer alors que le paiement, lui, a réussi.",
      decision: "Enregistrer la commande et envoyer le courriel même si la production échoue, avec rattrapage.",
      rationale: "Ne jamais perdre une commande déjà payée.",
      tradeoff: "Réconciliation et suivi des productions en échec à gérer." },
  ],
  responsibilities: [
    { area: "Architecture technique", me: "lead", other: "none", otherName: "Fondateur", shared: false },
    { area: "Développement", me: "lead", other: "none", shared: false },
    { area: "Intégrations (Stripe · Gelato)", me: "lead", other: "none", shared: false },
    { area: "Sécurité & fiabilité", me: "lead", other: "none", shared: false },
    { area: "Vision produit & marque", me: "consulted", other: "lead", shared: false },
    { area: "Contenu & relation créateurs", me: "contributor", other: "lead", shared: true },
  ],
  responsibilitiesNote: "« Autre » = le fondateur (produit, marque, créateurs). Je porte la direction technique (CTO).",
  limits: [
    "Renforcement de l'authentification et suite de tests automatisés : sur la feuille de route.",
    "Taux de change actuellement statiques (à brancher sur un service de taux).",
    "Métriques commerciales (ventes, revenus) confidentielles — non affichées ici.",
  ],
  links: [{ label: "themadspace.com", url: "https://themadspace.com", kind: "product" }],
};

const madEn: CaseStudyV2 = {
  modes: ["recruiter", "engineering", "business"],
  identity: {
    valueProp: "A bilingual print-on-demand marketplace: creators submit their work, it becomes apparel, and every sale pays them a commission — payment, production and tracking fully automated.",
    kind: "Cofounded product · marketplace (CTO)",
    domain: "E-commerce · print-on-demand",
    maturity: "production",
    maturityLabel: "In production",
    period: "Product launched 2024 · CTO since 2025",
    team: "Founder (product & brand) · Ralph (CTO · engineering)",
    role: "CTO · Architecture, development & integrations",
    market: "Creators & buyers · Canada + international (4 currencies)",
    platforms: ["Web (bilingual FR/EN)"],
    stack: ["Next.js 16", "TypeScript", "PostgreSQL · Prisma", "Stripe", "Gelato (POD)", "Supabase", "Resend", "Vercel"],
    updated: "2026-07-29",
  },
  sections: [
    { id: "resume", title: "Summary", modes: ["recruiter"],
      body: "The Mad Space turns creators' artwork into print-on-demand apparel and pays a commission on every sale. I'm CTO: I own the architecture, development and integrations (Stripe payments, Gelato production, emails, tracking). The product is in production, bilingual and multi-currency." },
    { id: "produit", title: "The product", modes: ["recruiter", "business"],
      body: "A marketplace where creators offer designs that become print-on-demand products. Buyers order, creators earn a commission, and both production and shipping are automated end to end." },
    { id: "role", title: "My role (CTO)", modes: ["recruiter", "engineering", "business"],
      body: "I own all of the engineering: architecture, application development, payment and production integrations, security and reliability. The founder owns product, brand and creator relations.",
      points: ["Custom Next.js architecture (32 pages · 37 API route modules)", "Stripe (payments) and Gelato (production/shipping) integrations", "Data model, commissions and order tracking", "Deployment, transactional email and operations"] },
    { id: "modele", title: "The business model", modes: ["business"],
      body: "Creators monetize their work without handling inventory or logistics.",
      points: ["A creator submits a design → it becomes a printable product", "Each sale pays them a commission (margin-based, tiered)", "No inventory, no upfront cost: made to order", "The platform handles payment, production, shipping and tracking"] },
    { id: "automatisation", title: "What the platform automates", modes: ["business"],
      body: "An order goes from buyer to manufacturer with no manual step.",
      points: ["Payment captured (Stripe) and signature-verified", "Order and commissions recorded automatically", "Production kicked off at Gelato", "Confirmation email (Resend) and delivery tracking"] },
    { id: "portee", title: "Reach", modes: ["recruiter", "business"],
      body: "Built for a broad audience from day one.",
      points: ["Bilingual FR/EN", "4 currencies (CAD · USD · EUR · GBP)", "Canada + international shipping", "Built-in blog / content for acquisition"] },
    { id: "fiche", title: "Tech sheet", modes: ["engineering"],
      body: "A Next.js (App Router) app on PostgreSQL via Prisma, deployed on Vercel, with Stripe payments and production delegated to Gelato." },
    { id: "acteurs", title: "Actors", modes: ["engineering"],
      points: ["Buyer: browses, orders, pays, tracks delivery", "Creator: submits designs (after verification) and earns commissions", "Admin: moderates designs, manages products, blog and operations"] },
    { id: "architecture", title: "Architecture & order flow", modes: ["engineering"], kind: "flow",
      body: "Buyer → Stripe Checkout → signature-verified webhook (HMAC) → record Order + Sales (+ commission math) → Gelato production (non-blocking call) → confirmation email (Resend) → tracking (Gelato webhook + reconciliation cron)." },
    { id: "data", title: "Data model", modes: ["engineering"], kind: "data-model", collapsible: true,
      body: "12 Prisma models (+ 8 enums) around creators, designs, products, sales and orders.",
      points: ["Creator → Design → Product → ProductImage", "Sale = commission ledger (creator · product · order)", "Order: Stripe & Gelato references · fulfillment status · currency · tracking", "Blog (CMS + generation) · Review (verified buyers) · creator verification codes"] },
    { id: "securite", title: "Security & reliability", modes: ["engineering"], collapsible: true,
      body: "The sensitive paths — payment and production — are signature-verified before any processing.",
      points: ["Stripe and Gelato webhooks verified by signature (HMAC)", "Input validation (Zod) and generic error messages", "Secrets driven by environment variables", "Resilient order handling: a paid order is never lost if production fails"] },
    { id: "decisions", title: "Architecture decisions", modes: ["engineering"], kind: "decisions" },
    { id: "etat", title: "State & results", modes: ["recruiter", "engineering", "business"], kind: "metrics",
      body: "In production. The metrics below describe the scope of what is built and deployed — not sales figures." },
    { id: "risques", title: "Risks & roadmap", modes: ["engineering"], kind: "limits" },
    { id: "responsabilites", title: "Responsibility split", modes: ["engineering", "business"], kind: "raci" },
    { id: "apprentissages", title: "Takeaways", modes: ["recruiter"],
      body: "Leading the engineering of a real commercial product: balancing shipping fast with building solid, taking real money reliably, and keeping a codebase you can evolve without breaking it." },
  ],
  metrics: [
    { label: "application pages", value: "32", evidence: "implemented" },
    { label: "API route modules", value: "37", evidence: "implemented" },
    { label: "data models (Prisma)", value: "12", evidence: "implemented" },
    { label: "currencies (CAD · USD · EUR · GBP)", value: "4", evidence: "implemented" },
    { label: "languages (FR / EN)", value: "2", evidence: "implemented" },
    { label: "in production · Vercel", value: "Live", evidence: "deployed" },
  ],
  decisions: [
    { id: "ADR-01", title: "Custom Next.js over a turnkey e-commerce platform",
      context: "Multi-currency, tiered commissions, delegated production and content — rules too specific for a generic template.",
      decision: "A custom Next.js (App Router) app with Prisma/PostgreSQL.",
      rationale: "Full control over commission math, order flow and integrations.",
      tradeoff: "More code to write and maintain than a turnkey solution." },
    { id: "ADR-02", title: "Signature-verified payment and production webhooks",
      context: "Money and manufacturing are triggered by external events (Stripe, Gelato).",
      decision: "Verify each webhook's signature (HMAC) before any processing.",
      rationale: "Prevents a forged request from creating an order or a production run.",
      tradeoff: "Extra error paths and edge cases to handle." },
    { id: "ADR-03", title: "Non-blocking production",
      context: "The Gelato production call can fail even though payment succeeded.",
      decision: "Record the order and send the email even if production fails, with reconciliation.",
      rationale: "Never lose an already-paid order.",
      tradeoff: "Reconciliation and follow-up of failed production runs to manage." },
  ],
  responsibilities: [
    { area: "Technical architecture", me: "lead", other: "none", otherName: "Founder", shared: false },
    { area: "Development", me: "lead", other: "none", shared: false },
    { area: "Integrations (Stripe · Gelato)", me: "lead", other: "none", shared: false },
    { area: "Security & reliability", me: "lead", other: "none", shared: false },
    { area: "Product vision & brand", me: "consulted", other: "lead", shared: false },
    { area: "Content & creator relations", me: "contributor", other: "lead", shared: true },
  ],
  responsibilitiesNote: "\"Other\" = the founder (product, brand, creators). I own the technical direction (CTO).",
  limits: [
    "Authentication hardening and an automated test suite: on the roadmap.",
    "Exchange rates currently static (to be wired to a rates service).",
    "Commercial metrics (sales, revenue) confidential — not shown here.",
  ],
  links: [{ label: "themadspace.com", url: "https://themadspace.com", kind: "product" }],
};

// ─────────────────────────────────────────────────────────────────────────────
// ACADEMIC PROJECTS (ÉTS) — recruiter + engineering. Honestly framed as delivered
// coursework: precise about team size, my contribution, and academic scope.
// ─────────────────────────────────────────────────────────────────────────────

const cantelcoxFr: CaseStudyV2 = {
  modes: ["recruiter", "engineering"],
  identity: {
    valueProp: "Un BSS télécom passé de microservices synchrones à une architecture événementielle — et cinq paliers d'optimisation mesurés un par un, y compris celui qui n'a rien donné.",
    kind: "Projet de session · équipe (ÉTS LOG430)",
    domain: "Télécom · BSS (portabilité, activation, facturation, anti-fraude)",
    maturity: "archived",
    maturityLabel: "Projet de session livré · ÉTS",
    period: "2026",
    team: "Équipe de 5 · 60 des 97 commits de la branche sont les miens",
    role: "Architecture & développement · socle événementiel et svc-subscription",
    stack: ["Python 3.12 · FastAPI", "RabbitMQ", "MySQL · Flyway", "Redis", "KrakenD · NGINX", "Prometheus / Grafana", "Jaeger", "k6", "Docker Compose", "free5GC"],
    updated: "2026-09-09",
  },
  sections: [
    { id: "resume", title: "Résumé", modes: ["recruiter"],
      body: "CanTelcoX est le système commercial d'un opérateur mobile : portabilité de numéro, activation de ligne, facturation, MFA, anti-fraude. Le système passe de microservices synchrones à une architecture orientée événements — 6 services hexagonaux, saga chorégraphiée sur RabbitMQ, Outbox transactionnel, file de rebut, traçage distribué. Le livrable dont je suis le plus fier n'est pas la liste de patrons : c'est la campagne de charge, conduite en cinq paliers dont chacun a une cause identifiée par la mesure — accusé P95 divisé par 2,4, convergence des sagas passée de 47 % à 100 %, zéro erreur sur 22 031 requêtes." },
    { id: "contexte", title: "Contexte", modes: ["recruiter", "engineering"],
      body: "Cours d'architecture logicielle (LOG430) à l'ÉTS. Les labos isolent chacun un patron sur la même application jouet ; le projet de session est le seul endroit où ces patrons doivent tenir ensemble, sur un domaine métier réel, avec des intégrations externes qu'on ne contrôle pas et des mesures qu'on doit concevoir soi-même." },
    { id: "role", title: "Mon rôle & l'équipe", modes: ["recruiter", "engineering"],
      body: "Projet d'équipe : 5 contributeurs, 97 commits sur la branche publiée. J'en signe 60, portant principalement sur le socle événementiel et sur le service le plus complexe du système. Chaque affirmation est vérifiable dans l'historique Git du dépôt public.",
      points: [
        "Le châssis de messagerie partagé — enveloppe d'événement, relais outbox, consommateur, DLQ, retry à backoff, propagation du traceId",
        "svc-subscription de bout en bout — domaine, cycle de vie des lignes, ports, ACL, adapters free5GC, portabilité entrante et sortante",
        "La saga chorégraphiée — producteurs, consommateurs, compensation, piste d'audit",
        "Les cinq paliers de performance — scénario k6, campagnes, répartiteur NGINX, réplication, optimisation de l'adapter HLR",
      ] },
    { id: "architecture", title: "Architecture", modes: ["engineering"], kind: "flow",
      body: "Six services autonomes, une base de données logique par service, et surtout aucun appel HTTP direct de service à service dans le flux métier : tout passe par un exchange topic RabbitMQ avec sa file de rebut.",
      points: [
        "svc-identity (clients, MFA, JWT) · svc-subscription (lignes, activation, portabilité) · svc-billing (paiement, usage, facturation)",
        "svc-catalog (lecture hors saga, cache Redis) · svc-compliance (anti-fraude, audit, abonné à tout le trafic) · svc-ordering (commandes, saga)",
        "Saga chorégraphiée avec compensation — pas d'orchestrateur central",
        "Outbox transactionnel : l'événement est écrit dans la même transaction que l'état métier, un relais le publie ensuite (verrou SKIP LOCKED)",
        "traceId propagé dans l'enveloppe d'événement, un historique Flyway par service, DLQ + retry à backoff exponentiel",
      ] },
    { id: "integrations", title: "Intégrations externes réelles", modes: ["engineering"],
      body: "Deux systèmes que je ne contrôle pas, isolés derrière une couche anticorruption pour que leur vocabulaire n'entre pas dans le domaine.",
      points: [
        "free5GC — cœur réseau 5G, provisionnement des MSISDN via les API UDM ; adapter réel et adapter bouchon interchangeables par fabrique",
        "PortabilityHub — hub de portabilité Java, en rôle receveur et donneur, par webhooks TMF Event v4 à signature vérifiée",
        "Écart de contrat relevé et corrigé : le Hub expose 5 statuts là où la spécification fournie en annonçait 3",
      ] },
    { id: "paliers", title: "Cinq paliers, chacun mesuré", modes: ["recruiter", "engineering"], kind: "metrics",
      body: "Campagne k6, montée 10 → 50 → 100 VU sur 3 minutes, trafic entrant par le répartiteur de charge. Deux métriques distinctes, et la distinction est tout le sujet : l'accusé de réception du POST /v1/orders, et la convergence de la saga jusqu'à COMPLETED. Un accusé rapide ne prouve rien si la chaîne derrière n'aboutit pas.",
      points: [
        "1 — Référence (balayage outbox 2 s, prefetch 1, une réplique) : P95 952,78 ms, convergence 47 %",
        "2 — Cadence (balayage 0,5 s, prefetch 4, svc-ordering réparti) : P95 538,51 ms, mais la convergence ne suit pas",
        "3 — Réplication du goulot réel (2ᵉ instance de svc-subscription) : convergence 93,47 %, 3,25 sagas/s",
        "4 — Adapter HLR (session HTTP réutilisée, jeton mis en cache) : P95 395,97 ms, convergence 100 %",
        "5 — Appel HLR sorti de la transaction : aucun gain mesurable, conservé quand même",
      ] },
    { id: "palier2", title: "Le palier 2 est le plus instructif", modes: ["engineering"],
      body: "Accélérer la publication a amélioré l'accusé de réception sans améliorer la convergence. Le goulot ne s'était pas résorbé : il s'était déplacé vers svc-subscription, dont le provisionnement HLR était synchrone dans la transaction.",
      points: [
        "3 960 messages en attente sur un seul consommateur",
        "Ratio 2,8:1 entre paiements autorisés et lignes provisionnées",
        "Conclusion : accélérer l'acceptation sans accélérer le traitement aval ne fait que déplacer la file — les paliers 3 et 4 traitent cette cause",
      ] },
    { id: "palier5", title: "Le palier 5 est un résultat nul, publié comme tel", modes: ["engineering"],
      body: "Sortir l'appel HLR de la transaction était correct — on ne tient pas un verrou pendant une E/S réseau — mais la mesure donne 396 → 444 ms, soit la variance entre exécutions. Le cache de jeton du palier 4 avait déjà retiré l'essentiel du coût. Le changement est conservé parce qu'il est juste et qu'il paiera à plus forte concurrence, pas parce qu'il aurait amélioré les chiffres." },
    { id: "defauts", title: "Deux défauts trouvés par la donnée", modes: ["engineering"],
      points: [
        "1 467 événements dupliqués : le commit par événement annulait le verrou SKIP LOCKED, deux relais outbox publiaient le même lot. Corrigé — 0 doublon après, vérifié.",
        "Une sonde de santé qui mentait : un service répondait 200 alors que son consommateur était mort (except Exception: break, jamais relancé) et la sonde ne testait que la base. Corrigé et vérifié par injection de panne : broker arrêté → 503, broker relancé → 200, sans redémarrer aucun service.",
      ] },
    { id: "discipline", title: "Discipline architecturale automatisée", modes: ["engineering"],
      body: "L'isolation du domaine n'est pas une promesse dans un document : un contrôle dédié (tools/check_domain_isolation.py) échoue la CI si un import technique entre dans domain/ — et la première exécution a immédiatement révélé une violation. À côté : dossier d'architecture Arc42 + vue 4+1, ADR, catalogue d'événements et Event Storming. Durcissement au passage : JWT_SECRET obligatoire au démarrage, .env sorti du suivi Git, signature des webhooks du Hub vérifiée." },
    { id: "limites", title: "Limites", modes: ["recruiter", "engineering"], kind: "limits" },
  ],
  metrics: [
    { label: "accusé P95 (référence → final)", value: "952,78 → 395,97 ms", evidence: "measured", note: "÷ 2,4 — campagne k6 du 2026-08-06" },
    { label: "convergence des sagas", value: "47,05 % → 100 %", evidence: "measured", note: "607/607" },
    { label: "taux d'erreur", value: "0 % (0 / 22 031 req.)", evidence: "measured" },
    { label: "débit HTTP", value: "79,99 → 114,52 req/s", evidence: "measured", note: "+43 %" },
    { label: "sagas complètes par seconde", value: "1,5 → 3,16", evidence: "measured", note: "× 2,1" },
    { label: "événements dupliqués (avant → après correctif)", value: "1 467 → 0", evidence: "measured" },
    { label: "tests unitaires domaine + application", value: "173", evidence: "tested" },
    { label: "mes commits sur la branche publiée", value: "60 / 97", evidence: "implemented" },
  ],
  decisions: [
    {
      id: "saga",
      title: "Saga chorégraphiée plutôt qu'orchestrée",
      context: "La version précédente coordonnait l'activation de ligne par appels REST synchrones : un service lent bloquait toute la chaîne.",
      decision: "Chaque service réagit aux événements des autres et publie sa compensation en cas d'échec, sans orchestrateur central. Aucun appel HTTP direct de service à service ne subsiste dans le flux métier.",
      rationale: "Découplage temporel : la commande est acceptée même si le HLR est lent, et aucun service n'a besoin de connaître le graphe complet.",
      tradeoff: "Le flux n'est plus lisible en un seul endroit — d'où le traceId propagé dans l'enveloppe et le catalogue d'événements documenté, sans quoi le débogage devient impraticable.",
    },
    {
      id: "outbox",
      title: "Outbox transactionnel + verrou SKIP LOCKED",
      context: "Publier sur RabbitMQ après le commit ouvre une fenêtre où l'état est écrit mais l'événement perdu ; publier avant expose l'inverse.",
      decision: "L'événement est écrit dans la table outbox dans la même transaction que l'état métier ; un relais le publie ensuite, en lisant son lot sous verrou SKIP LOCKED.",
      rationale: "Atomicité état/événement, et deux relais peuvent progresser sur des lots disjoints — ce qui rend la réplication du service sûre.",
      tradeoff: "Livraison au moins une fois : les consommateurs doivent être idempotents. Le commit par événement annulait d'ailleurs le verrou — 1 467 doublons avant correctif.",
    },
    {
      id: "acl",
      title: "Couche anticorruption pour free5GC et le PortabilityHub",
      context: "Deux systèmes externes avec leur propre vocabulaire, leurs propres statuts et leur propre disponibilité.",
      decision: "Toute traduction se fait dans des adapters d'infrastructure ; le modèle TMF Forum s'arrête au port et le domaine ne connaît que ses propres concepts.",
      rationale: "Un écart côté Hub — comme les 5 statuts réels au lieu des 3 annoncés — se corrige dans un adapter, pas dans les règles métier.",
      tradeoff: "Une couche de traduction de plus à écrire et à tester pour chaque intégration.",
    },
    {
      id: "hexagonal-ci",
      title: "Isolation du domaine imposée par la CI",
      context: "Une règle d'architecture écrite dans un document est violée dès le premier sprint pressé.",
      decision: "Un contrôle dédié interdit tout import technique dans domain/ et échoue la CI si la règle est franchie.",
      rationale: "La contrainte devient structurelle plutôt que déclarative — c'est la seule forme de discipline qui survit à la pression. La première exécution a d'ailleurs révélé une violation existante.",
      tradeoff: "Quelques détours d'implémentation (ports explicites) là où un import direct aurait été plus court.",
    },
  ],
  limits: [
    "Projet académique : échelle de laboratoire, pas de charge de production réelle ni d'utilisateurs.",
    "Le taux de convergence atteint 100 %, mais la latence de convergence P95 reste à 26,34 s, au-dessus du seuil de 10 s fixé au scénario.",
    "Le débit mesuré (114,52 req/s) demeure loin de la cible de 1 000 ops/s du cahier de charge. L'écart est mesuré et localisé, pas expliqué après coup : la topologie de démonstration — un seul broker, trois nœuds sur une machine — en est la limite structurelle.",
    "Projet d'équipe de 5 : 60 des 97 commits de la branche publiée sont les miens.",
    "Le dépôt est publié sous licence académique restrictive — consultable et exécutable pour évaluation, sans droits accordés sur le code des autres contributeurs.",
  ],
  links: [
    { label: "Dépôt GitHub", url: "https://github.com/ralphgabriel04/cantelcox-bss-event-driven", kind: "repo" },
  ],
};

const cantelcoxEn: CaseStudyV2 = {
  modes: ["recruiter", "engineering"],
  identity: {
    valueProp: "A telecom BSS moved from synchronous microservices to event-driven architecture — and five optimization stages measured one by one, including the one that produced nothing.",
    kind: "Term project · team (ÉTS LOG430)",
    domain: "Telecom · BSS (portability, activation, billing, fraud screening)",
    maturity: "archived",
    maturityLabel: "Delivered term project · ÉTS",
    period: "2026",
    team: "Team of 5 · 60 of the 97 commits on the branch are mine",
    role: "Architecture & development · messaging chassis and svc-subscription",
    stack: ["Python 3.12 · FastAPI", "RabbitMQ", "MySQL · Flyway", "Redis", "KrakenD · NGINX", "Prometheus / Grafana", "Jaeger", "k6", "Docker Compose", "free5GC"],
    updated: "2026-09-09",
  },
  sections: [
    { id: "resume", title: "Summary", modes: ["recruiter"],
      body: "CanTelcoX is a mobile carrier's business system: number portability, line activation, billing, MFA, fraud screening. It moves from synchronous microservices to an event-driven architecture — 6 hexagonal services, a choreographed saga over RabbitMQ, a transactional Outbox, a dead-letter queue, distributed tracing. The deliverable I'm proudest of isn't the pattern checklist: it's the load campaign, run in five stages each with a cause identified by measurement — acknowledgement P95 divided by 2.4, saga convergence up from 47% to 100%, zero errors across 22,031 requests." },
    { id: "contexte", title: "Context", modes: ["recruiter", "engineering"],
      body: "ÉTS's software-architecture course (LOG430). The labs each isolate one pattern on the same toy application; the term project is the only place where those patterns have to hold together, on a real business domain, with external integrations you don't control and measurements you have to design yourself." },
    { id: "role", title: "My role & the team", modes: ["recruiter", "engineering"],
      body: "A team project: 5 contributors, 97 commits on the published branch. I signed 60 of them, mostly on the event-driven foundation and on the most complex service in the system. Every claim is verifiable in the public repository's Git history.",
      points: [
        "The shared messaging chassis — event envelope, outbox relay, consumer, DLQ, backoff retry, traceId propagation",
        "svc-subscription end to end — domain, line lifecycle, ports, ACL, free5GC adapters, port-in and port-out",
        "The choreographed saga — producers, consumers, compensation, audit trail",
        "The five performance stages — k6 scenario, campaigns, NGINX load balancer, replication, HLR adapter optimization",
      ] },
    { id: "architecture", title: "Architecture", modes: ["engineering"], kind: "flow",
      body: "Six autonomous services, one logical database per service, and crucially no direct service-to-service HTTP in the business flow: everything goes through a RabbitMQ topic exchange with its dead-letter queue.",
      points: [
        "svc-identity (customers, MFA, JWT) · svc-subscription (lines, activation, portability) · svc-billing (payment, usage, invoicing)",
        "svc-catalog (reads outside the saga, Redis cache) · svc-compliance (fraud screening, audit, subscribed to all traffic) · svc-ordering (orders, saga)",
        "Choreographed saga with compensation — no central orchestrator",
        "Transactional Outbox: the event is written in the same transaction as the business state, a relay publishes it afterwards (SKIP LOCKED)",
        "traceId propagated in the event envelope, one Flyway history per service, DLQ + exponential backoff retry",
      ] },
    { id: "integrations", title: "Real external integrations", modes: ["engineering"],
      body: "Two systems I don't control, isolated behind an anti-corruption layer so their vocabulary never reaches the domain.",
      points: [
        "free5GC — a 5G core, MSISDN provisioning through the UDM APIs; real and stub adapters interchangeable through a factory",
        "PortabilityHub — a Java portability hub, acting as both recipient and donor, over signature-verified TMF Event v4 webhooks",
        "Contract discrepancy found and corrected: the Hub exposes 5 statuses where the supplied spec announced 3",
      ] },
    { id: "paliers", title: "Five stages, each measured", modes: ["recruiter", "engineering"], kind: "metrics",
      body: "A k6 campaign ramping 10 → 50 → 100 VUs over 3 minutes, traffic entering through the load balancer. Two distinct metrics, and the distinction is the whole point: the acknowledgement of POST /v1/orders, and the saga's convergence to COMPLETED. A fast acknowledgement proves nothing if the chain behind it never completes.",
      points: [
        "1 — Baseline (outbox poll 2s, prefetch 1, one replica): P95 952.78 ms, convergence 47%",
        "2 — Cadence (poll 0.5s, prefetch 4, svc-ordering load-balanced): P95 538.51 ms, but convergence does not follow",
        "3 — Replicating the real bottleneck (2nd svc-subscription instance): convergence 93.47%, 3.25 sagas/s",
        "4 — HLR adapter (reused HTTP session, cached token): P95 395.97 ms, convergence 100%",
        "5 — HLR call moved out of the transaction: no measurable gain, kept anyway",
      ] },
    { id: "palier2", title: "Stage 2 is the instructive one", modes: ["engineering"],
      body: "Speeding up publication improved acknowledgement without improving convergence. The bottleneck hadn't cleared: it had moved to svc-subscription, whose HLR provisioning was synchronous inside the transaction.",
      points: [
        "3,960 messages queued on a single consumer",
        "A 2.8:1 ratio between authorized payments and provisioned lines",
        "Conclusion: speeding up acceptance without speeding up downstream processing only relocates the queue — stages 3 and 4 address that cause",
      ] },
    { id: "palier5", title: "Stage 5 is a null result, published as one", modes: ["engineering"],
      body: "Moving the HLR call out of the transaction was correct — you don't hold a lock across network I/O — but measurement gives 396 → 444 ms, i.e. run-to-run variance. Stage 4's token cache had already removed most of the cost. The change is kept because it is right and will pay off at higher concurrency, not because it \"improved the numbers\"." },
    { id: "defauts", title: "Two defects found by data", modes: ["engineering"],
      points: [
        "1,467 duplicated events: committing per event defeated the SKIP LOCKED row lock, so two outbox relays published the same batch. Fixed — 0 duplicates after, verified.",
        "A lying health check: a service returned 200 while its consumer was dead (except Exception: break, never restarted) and the probe only tested the database. Fixed and verified by fault injection: broker stopped → 503, broker restarted → 200, without restarting any service.",
      ] },
    { id: "discipline", title: "Architectural discipline, automated", modes: ["engineering"],
      body: "Domain isolation isn't a promise in a document: a dedicated check (tools/check_domain_isolation.py) fails CI if a technical import reaches domain/ — and its first run immediately surfaced a violation. Alongside it: an Arc42 architecture dossier with the 4+1 views, ADRs, an event catalogue and Event Storming. Hardening along the way: JWT_SECRET required at startup, .env removed from Git tracking, Hub webhook signatures verified." },
    { id: "limites", title: "Limits", modes: ["recruiter", "engineering"], kind: "limits" },
  ],
  metrics: [
    { label: "acknowledgement P95 (baseline → final)", value: "952.78 → 395.97 ms", evidence: "measured", note: "÷ 2.4 — k6 campaign of 2026-08-06" },
    { label: "saga convergence", value: "47.05% → 100%", evidence: "measured", note: "607/607" },
    { label: "error rate", value: "0% (0 / 22,031 req.)", evidence: "measured" },
    { label: "HTTP throughput", value: "79.99 → 114.52 req/s", evidence: "measured", note: "+43%" },
    { label: "complete sagas per second", value: "1.5 → 3.16", evidence: "measured", note: "× 2.1" },
    { label: "duplicated events (before → after fix)", value: "1,467 → 0", evidence: "measured" },
    { label: "domain + application unit tests", value: "173", evidence: "tested" },
    { label: "my commits on the published branch", value: "60 / 97", evidence: "implemented" },
  ],
  decisions: [
    {
      id: "saga",
      title: "Choreographed saga rather than orchestrated",
      context: "The previous version coordinated line activation through synchronous REST calls: one slow service blocked the whole chain.",
      decision: "Each service reacts to the others' events and publishes its compensation on failure, with no central orchestrator. No direct service-to-service HTTP remains in the business flow.",
      rationale: "Temporal decoupling: the order is accepted even if the HLR is slow, and no service needs to know the full graph.",
      tradeoff: "The flow is no longer readable in one place — hence the traceId propagated in the envelope and a documented event catalogue, without which debugging becomes impractical.",
    },
    {
      id: "outbox",
      title: "Transactional Outbox + SKIP LOCKED",
      context: "Publishing to RabbitMQ after the commit opens a window where the state is written but the event lost; publishing before exposes the opposite.",
      decision: "The event is written to the outbox table in the same transaction as the business state; a relay publishes it afterwards, reading its batch under a SKIP LOCKED row lock.",
      rationale: "State/event atomicity, and two relays can progress on disjoint batches — which makes replicating the service safe.",
      tradeoff: "At-least-once delivery: consumers must be idempotent. Committing per event in fact defeated the lock — 1,467 duplicates before the fix.",
    },
    {
      id: "acl",
      title: "Anti-corruption layer for free5GC and the PortabilityHub",
      context: "Two external systems with their own vocabulary, their own statuses and their own availability.",
      decision: "All translation happens in infrastructure adapters; the TMF Forum model stops at the port and the domain only knows its own concepts.",
      rationale: "A discrepancy on the Hub's side — like the 5 real statuses instead of the 3 announced — is fixed in an adapter, not in business rules.",
      tradeoff: "One more translation layer to write and test per integration.",
    },
    {
      id: "hexagonal-ci",
      title: "Domain isolation enforced by CI",
      context: "An architecture rule written in a document gets violated in the first rushed sprint.",
      decision: "A dedicated check forbids any technical import inside domain/ and fails CI if the rule is crossed.",
      rationale: "The constraint becomes structural rather than declarative — the only kind of discipline that survives pressure. Its first run surfaced an existing violation.",
      tradeoff: "A few implementation detours (explicit ports) where a direct import would have been shorter.",
    },
  ],
  limits: [
    "Academic project: lab scale, no real production load and no real users.",
    "Convergence rate reaches 100%, but convergence latency P95 stays at 26.34s, above the scenario's 10s threshold.",
    "Measured throughput (114.52 req/s) remains far from the brief's 1,000 ops/s target. The gap is measured and localized, not explained away afterwards: the demo topology — a single broker, three nodes on one machine — is the structural limit.",
    "Team project of 5: 60 of the 97 commits on the published branch are mine.",
    "The repository ships under a restrictive academic licence — readable and runnable for evaluation, with no rights granted over the other contributors' code.",
  ],
  links: [
    { label: "GitHub repository", url: "https://github.com/ralphgabriel04/cantelcox-bss-event-driven", kind: "repo" },
  ],
};


const financejFr: CaseStudyV2 = {
  modes: ["recruiter", "engineering"],
  identity: {
    valueProp: "Application desktop Java de finances personnelles, construite en équipe de 6 avec un accent sur les tests et la maintenabilité — j'y étais le contributeur le plus actif.",
    kind: "Projet académique · équipe (ÉTS LOG240)",
    domain: "App desktop · finances personnelles",
    maturity: "archived",
    maturityLabel: "Projet académique livré · ÉTS",
    period: "Jan.–Avr. 2026",
    team: "Équipe de 6 · moi top contributeur (28 / 85 commits)",
    role: "Développeur · contributeur le plus actif",
    stack: ["Java 21", "Maven", "Java Swing", "Apache Derby", "JUnit 4", "AssertJ Swing", "JaCoCo", "Checkstyle · PMD · QALab"],
    updated: "2026-07-29",
  },
  sections: [
    { id: "resume", title: "Résumé", modes: ["recruiter"],
      body: "FinanceJ gère revenus, dépenses et budgets dans une application desktop Java. Réalisée à 6 pour le cours LOG240 (Tests et Maintenance), elle met l'accent sur la couverture de tests et la qualité de code. J'en ai été le contributeur le plus actif (28 des 85 commits)." },
    { id: "contexte", title: "Contexte", modes: ["recruiter", "engineering"],
      body: "Cours LOG240 (Tests et Maintenance) à l'ÉTS : l'objectif pédagogique n'est pas seulement de livrer une app, mais de la rendre testable, mesurée et maintenable." },
    { id: "role", title: "Mon rôle & l'équipe", modes: ["recruiter", "engineering"],
      body: "Équipe de 6 développeurs, suivi sur Git. Honnêtement : le mérite est collectif, mais j'ai été le contributeur le plus actif avec 28 des 85 commits — sur l'architecture, les modèles de tables et les tests." },
    { id: "architecture", title: "Architecture", modes: ["engineering"],
      body: "Architecture MVC classique, avec des patrons adaptés à une app Swing sur base Derby.",
      points: ["MVC (modèle · vue Swing · contrôleur)", "Singleton pour l'accès partagé", "DAO pour isoler la persistance (Apache Derby)", "AbstractTableModel pour les tableaux de données"] },
    { id: "qualite", title: "Qualité & tests", modes: ["engineering"], kind: "metrics",
      body: "Le cœur du cours : une suite de tests mesurée et des analyses statiques automatisées." },
    { id: "limites", title: "Limites", modes: ["recruiter", "engineering"], kind: "limits" },
  ],
  metrics: [
    { label: "lignes de code", value: "5 250+", evidence: "implemented" },
    { label: "tests (JUnit · AssertJ Swing)", value: "133", evidence: "tested" },
    { label: "couverture de lignes (JaCoCo)", value: "100 %", evidence: "tested" },
    { label: "commits · 6 devs", value: "85", evidence: "implemented" },
    { label: "mes commits (top contributeur)", value: "28", evidence: "implemented" },
    { label: "analyse statique (Checkstyle · PMD)", value: "✓", evidence: "implemented" },
  ],
  limits: [
    "Projet académique : pas d'utilisateurs ni de production réels.",
    "« 100 % » est une couverture de lignes (JaCoCo) — une mesure d'exécution, pas une preuve d'absence de bugs.",
    "Périmètre fonctionnel défini par l'énoncé du cours.",
  ],
  links: [],
};

const financejEn: CaseStudyV2 = {
  modes: ["recruiter", "engineering"],
  identity: {
    valueProp: "A Java desktop personal-finance app, built by a team of 6 with a focus on testing and maintainability — I was the most active contributor.",
    kind: "Academic project · team (ÉTS LOG240)",
    domain: "Desktop app · personal finance",
    maturity: "archived",
    maturityLabel: "Delivered academic project · ÉTS",
    period: "Jan.–Apr. 2026",
    team: "Team of 6 · I was top contributor (28 / 85 commits)",
    role: "Developer · most active contributor",
    stack: ["Java 21", "Maven", "Java Swing", "Apache Derby", "JUnit 4", "AssertJ Swing", "JaCoCo", "Checkstyle · PMD · QALab"],
    updated: "2026-07-29",
  },
  sections: [
    { id: "resume", title: "Summary", modes: ["recruiter"],
      body: "FinanceJ manages income, expenses and budgets in a Java desktop app. Built by a team of 6 for the LOG240 course (Testing & Maintenance), it emphasizes test coverage and code quality. I was the most active contributor (28 of 85 commits)." },
    { id: "contexte", title: "Context", modes: ["recruiter", "engineering"],
      body: "ÉTS's LOG240 course (Testing & Maintenance): the goal isn't only to ship an app, but to make it testable, measured and maintainable." },
    { id: "role", title: "My role & the team", modes: ["recruiter", "engineering"],
      body: "A team of 6 developers, tracked on Git. Honestly: the credit is collective, but I was the most active contributor with 28 of 85 commits — on architecture, table models and tests." },
    { id: "architecture", title: "Architecture", modes: ["engineering"],
      body: "Classic MVC architecture, with patterns suited to a Swing app on a Derby database.",
      points: ["MVC (model · Swing view · controller)", "Singleton for shared access", "DAO to isolate persistence (Apache Derby)", "AbstractTableModel for data tables"] },
    { id: "qualite", title: "Quality & tests", modes: ["engineering"], kind: "metrics",
      body: "The heart of the course: a measured test suite and automated static analysis." },
    { id: "limites", title: "Limits", modes: ["recruiter", "engineering"], kind: "limits" },
  ],
  metrics: [
    { label: "lines of code", value: "5,250+", evidence: "implemented" },
    { label: "tests (JUnit · AssertJ Swing)", value: "133", evidence: "tested" },
    { label: "line coverage (JaCoCo)", value: "100%", evidence: "tested" },
    { label: "commits · 6 devs", value: "85", evidence: "implemented" },
    { label: "my commits (top contributor)", value: "28", evidence: "implemented" },
    { label: "static analysis (Checkstyle · PMD)", value: "✓", evidence: "implemented" },
  ],
  limits: [
    "Academic project: no real users or production.",
    "\"100%\" is line coverage (JaCoCo) — an execution metric, not proof of bug-freedom.",
    "Functional scope set by the course brief.",
  ],
  links: [],
};

const log430Fr: CaseStudyV2 = {
  modes: ["recruiter", "engineering"],
  identity: {
    valueProp: "Réarchitecturer une même application, labo après labo, d'un monolithe conteneurisé jusqu'à des microservices événementiels — jusqu'à un capstone en 5 microservices DDD.",
    kind: "Projet académique · labos (ÉTS LOG430)",
    domain: "Architecture logicielle",
    maturity: "archived",
    maturityLabel: "Projet académique livré · ÉTS",
    period: "2026",
    team: "Surtout en solo",
    role: "Architecte / développeur (labos)",
    stack: ["Python · Flask / FastAPI", "Docker Compose", "PostgreSQL · Redis", "Apache Kafka", "GraphQL", "Kong / KrakenD", "Prometheus / Grafana", "Jaeger"],
    updated: "2026-07-29",
  },
  sections: [
    { id: "resume", title: "Résumé", modes: ["recruiter"],
      body: "Une série de labos où une même app de gestion de magasin est réarchitecturée d'un labo à l'autre — du monolithe conteneurisé aux microservices événementiels. Le fil rouge : chaque style architectural, ses gains et ses compromis, mis en pratique." },
    { id: "contexte", title: "Contexte", modes: ["recruiter", "engineering"],
      body: "Cours d'architecture logicielle à l'ÉTS (LOG430). L'objectif est d'éprouver dans le code, et pas seulement en théorie, la progression du monolithe vers le distribué." },
    { id: "parcours", title: "Le parcours architectural", modes: ["engineering"], kind: "flow",
      body: "Monolithe conteneurisé (Docker · CI/CD) → client-serveur avec DAO → CQRS + persistance polyglotte (PostgreSQL + Redis) → API REST → GraphQL → cache + répartition de charge (Nginx · tests Locust) → observabilité (Prometheus) → microservices derrière une passerelle d'API → microservice de paiement isolé → saga orchestrée + traçage distribué (Jaeger) → architecture événementielle Kafka (event sourcing · saga chorégraphiée · Outbox) → bases de données distribuées (YugabyteDB / CockroachDB)." },
    { id: "capstone", title: "Capstone — CanTelcoX", modes: ["recruiter", "engineering"],
      body: "Le projet de fin de session regroupe le parcours en un système cohérent.",
      points: ["5 microservices DDD · une base de données par service", "Passerelle Kong en haute disponibilité", "Cache Redis", "Observabilité Prometheus / Grafana"] },
    { id: "concepts", title: "Concepts clés mis en pratique", modes: ["engineering"],
      points: ["Domain-Driven Design & découpage en services", "CQRS & persistance polyglotte", "Sagas (orchestrée et chorégraphiée) · patron Outbox", "Event sourcing avec Kafka", "Traçage distribué & observabilité"] },
    { id: "limites", title: "Limites", modes: ["recruiter", "engineering"], kind: "limits" },
  ],
  metrics: [
    { label: "dépôts · monolithe → microservices", value: "12", evidence: "implemented" },
    { label: "CanTelcoX · microservices DDD", value: "5", evidence: "implemented" },
    { label: "REST · GraphQL · Kafka · Saga", value: "✓", evidence: "implemented" },
    { label: "observabilité Prometheus / Grafana", value: "✓", evidence: "implemented" },
  ],
  limits: [
    "Projet académique : échelle de labo, pas de charge de production réelle.",
    "C'est un parcours d'apprentissage — chaque labo isole un style architectural plutôt que de bâtir un produit unique.",
  ],
  links: [
    { label: "Labo REST & GraphQL", url: "https://github.com/ralphgabriel04/Labo-03-REST-APIs-GraphQL", kind: "repo" },
    { label: "Labo événementiel (Kafka)", url: "https://github.com/ralphgabriel04/log430-labo8", kind: "repo" },
  ],
};

const log430En: CaseStudyV2 = {
  modes: ["recruiter", "engineering"],
  identity: {
    valueProp: "Re-architecting one app, lab after lab, from a containerized monolith to event-driven microservices — up to a 5-service DDD capstone.",
    kind: "Academic project · labs (ÉTS LOG430)",
    domain: "Software architecture",
    maturity: "archived",
    maturityLabel: "Delivered academic project · ÉTS",
    period: "2026",
    team: "Mostly solo",
    role: "Architect / developer (labs)",
    stack: ["Python · Flask / FastAPI", "Docker Compose", "PostgreSQL · Redis", "Apache Kafka", "GraphQL", "Kong / KrakenD", "Prometheus / Grafana", "Jaeger"],
    updated: "2026-07-29",
  },
  sections: [
    { id: "resume", title: "Summary", modes: ["recruiter"],
      body: "A lab series where a single store-management app is re-architected from one lab to the next — from a containerized monolith to event-driven microservices. The through-line: each architectural style, its gains and its trade-offs, put into practice." },
    { id: "contexte", title: "Context", modes: ["recruiter", "engineering"],
      body: "ÉTS's software-architecture course (LOG430). The goal is to prove out — in code, not just theory — the progression from monolith to distributed." },
    { id: "parcours", title: "The architectural journey", modes: ["engineering"], kind: "flow",
      body: "Containerized monolith (Docker · CI/CD) → client-server with DAO → CQRS + polyglot persistence (PostgreSQL + Redis) → REST API → GraphQL → caching + load balancing (Nginx · Locust tests) → observability (Prometheus) → microservices behind an API gateway → isolated payment microservice → orchestrated saga + distributed tracing (Jaeger) → Kafka event-driven architecture (event sourcing · choreographed saga · Outbox) → distributed databases (YugabyteDB / CockroachDB)." },
    { id: "capstone", title: "Capstone — CanTelcoX", modes: ["recruiter", "engineering"],
      body: "The end-of-term project consolidates the journey into one coherent system.",
      points: ["5 DDD microservices · one database per service", "High-availability Kong gateway", "Redis caching", "Prometheus / Grafana observability"] },
    { id: "concepts", title: "Key concepts put into practice", modes: ["engineering"],
      points: ["Domain-Driven Design & service decomposition", "CQRS & polyglot persistence", "Sagas (orchestrated and choreographed) · Outbox pattern", "Event sourcing with Kafka", "Distributed tracing & observability"] },
    { id: "limites", title: "Limits", modes: ["recruiter", "engineering"], kind: "limits" },
  ],
  metrics: [
    { label: "repos · monolith → microservices", value: "12", evidence: "implemented" },
    { label: "CanTelcoX · DDD microservices", value: "5", evidence: "implemented" },
    { label: "REST · GraphQL · Kafka · Saga", value: "✓", evidence: "implemented" },
    { label: "Prometheus / Grafana observability", value: "✓", evidence: "implemented" },
  ],
  limits: [
    "Academic project: lab scale, not real production load.",
    "It's a learning journey — each lab isolates an architectural style rather than building one single product.",
  ],
  links: [
    { label: "REST & GraphQL lab", url: "https://github.com/ralphgabriel04/Labo-03-REST-APIs-GraphQL", kind: "repo" },
    { label: "Event-driven lab (Kafka)", url: "https://github.com/ralphgabriel04/log430-labo8", kind: "repo" },
  ],
};

const log210Fr: CaseStudyV2 = {
  modes: ["recruiter", "engineering"],
  identity: {
    valueProp: "Modéliser et concevoir une application de gestion de cours en équipe : modèle du domaine UML, cas d'utilisation et conception en couches guidée par GRASP.",
    kind: "Projet académique · équipe (ÉTS LOG210)",
    domain: "Analyse & conception OO",
    maturity: "archived",
    maturityLabel: "Projet académique livré · ÉTS",
    period: "2025",
    team: "Équipe de 6",
    role: "Analyse, conception & développement",
    stack: ["TypeScript", "Node.js · Express", "Jest", "UML (PlantUML)", "GRASP"],
    updated: "2026-07-29",
  },
  sections: [
    { id: "resume", title: "Résumé", modes: ["recruiter"],
      body: "À partir d'un squelette « jeu de dés », l'équipe de 6 modélise et implémente une application de gestion de cours et de devoirs. L'accent est mis sur la démarche : d'abord modéliser, ensuite concevoir en couches, puis implémenter et tester." },
    { id: "contexte", title: "Contexte", modes: ["recruiter", "engineering"],
      body: "Cours d'analyse et de conception logicielle à l'ÉTS (LOG210), en équipe de 6 via GitHub Classroom, appuyé par des rapports d'itération." },
    { id: "demarche", title: "Démarche de conception", modes: ["engineering"],
      body: "La chaîne complète, de l'analyse au code.",
      points: ["Modèle du domaine UML & cas d'utilisation", "Conception en couches (présentation · domaine · accès données)", "Patron GRASP Contrôleur pour orchestrer les cas d'usage", "Passerelle / adaptateur vers un backend", "Suite de tests Jest avec couverture"] },
    { id: "role", title: "Mon rôle & l'équipe", modes: ["recruiter", "engineering"],
      body: "Équipe de 6 sur GitHub Classroom : contribution collective à la modélisation, à la conception en couches et à l'implémentation, itération après itération." },
    { id: "limites", title: "Limites", modes: ["recruiter", "engineering"], kind: "limits" },
  ],
  metrics: [
    { label: "équipe · GitHub Classroom", value: "6", evidence: "implemented" },
    { label: "modèle du domaine UML · cas d'usage", value: "✓", evidence: "designed" },
    { label: "patron GRASP Contrôleur", value: "✓", evidence: "implemented" },
    { label: "tests Jest avec couverture", value: "✓", evidence: "tested" },
  ],
  limits: [
    "Projet académique : l'accent porte sur la conception et la modélisation plus que sur un produit fini.",
    "Périmètre défini par l'énoncé du cours.",
  ],
  links: [
    { label: "GitHub", url: "https://github.com/ralphgabriel04/laboratoire-01-log210-a25-equipe-210-detached", kind: "repo" },
  ],
};

const log210En: CaseStudyV2 = {
  modes: ["recruiter", "engineering"],
  identity: {
    valueProp: "Modeling and designing a course-management app as a team: UML domain model, use cases and layered design guided by GRASP.",
    kind: "Academic project · team (ÉTS LOG210)",
    domain: "OO analysis & design",
    maturity: "archived",
    maturityLabel: "Delivered academic project · ÉTS",
    period: "2025",
    team: "Team of 6",
    role: "Analysis, design & development",
    stack: ["TypeScript", "Node.js · Express", "Jest", "UML (PlantUML)", "GRASP"],
    updated: "2026-07-29",
  },
  sections: [
    { id: "resume", title: "Summary", modes: ["recruiter"],
      body: "Starting from a \"dice game\" skeleton, the team of 6 models and builds a course-and-assignment management app. The emphasis is on the process: model first, then design in layers, then implement and test." },
    { id: "contexte", title: "Context", modes: ["recruiter", "engineering"],
      body: "ÉTS's analysis-and-design course (LOG210), in a team of 6 via GitHub Classroom, backed by iteration reports." },
    { id: "demarche", title: "Design process", modes: ["engineering"],
      body: "The full chain, from analysis to code.",
      points: ["UML domain model & use cases", "Layered design (presentation · domain · data access)", "GRASP Controller pattern to orchestrate use cases", "Gateway / adapter to a backend", "Jest test suite with coverage"] },
    { id: "role", title: "My role & the team", modes: ["recruiter", "engineering"],
      body: "A team of 6 on GitHub Classroom: collective contribution to modeling, layered design and implementation, iteration after iteration." },
    { id: "limites", title: "Limits", modes: ["recruiter", "engineering"], kind: "limits" },
  ],
  metrics: [
    { label: "team · GitHub Classroom", value: "6", evidence: "implemented" },
    { label: "UML domain model · use cases", value: "✓", evidence: "designed" },
    { label: "GRASP Controller pattern", value: "✓", evidence: "implemented" },
    { label: "Jest tests with coverage", value: "✓", evidence: "tested" },
  ],
  limits: [
    "Academic project: the emphasis is on design and modeling more than a finished product.",
    "Scope set by the course brief.",
  ],
  links: [
    { label: "GitHub", url: "https://github.com/ralphgabriel04/laboratoire-01-log210-a25-equipe-210-detached", kind: "repo" },
  ],
};

const gti350Fr: CaseStudyV2 = {
  modes: ["recruiter", "engineering"],
  identity: {
    valueProp: "Un jeu Tron 2 joueurs en JavaScript vanilla, centré sur la manipulation directe et deux modes d'entrée — jouable en ligne.",
    kind: "Projet académique · équipe (ÉTS GTI350)",
    domain: "Interfaces utilisateurs · jeu",
    maturity: "archived",
    maturityLabel: "Projet académique livré · ÉTS",
    period: "2026",
    team: "Équipe de 2",
    role: "Développeur (interfaces & logique de jeu)",
    platforms: ["Web · jouable en ligne"],
    stack: ["JavaScript (vanilla)", "Canvas HTML5", "Modules ES6", "HTML/CSS"],
    updated: "2026-07-29",
  },
  sections: [
    { id: "resume", title: "Résumé", modes: ["recruiter"],
      body: "Un jeu « Tron » 2 joueurs codé sans aucune librairie, pour le cours d'interfaces utilisateurs. L'exercice : la manipulation directe et deux modes d'entrée, avec une architecture modulaire pensée pour le travail en parallèle sur Git." },
    { id: "contexte", title: "Contexte", modes: ["recruiter", "engineering"],
      body: "Cours d'interfaces utilisateurs à l'ÉTS (GTI350), en équipe de 2. La contrainte « vanilla JS, sans librairie » est pédagogique : tout est écrit à la main." },
    { id: "fonctionnalites", title: "Fonctionnalités", modes: ["engineering"],
      body: "Un jeu complet, rendu sur Canvas.",
      points: ["Rendu sur Canvas HTML5", "Deux modes d'entrée : clavier (gestion QWERTY / AZERTY) et gestes de souris pour diriger la moto", "Détection de collisions (traînées + murs)", "Score multi-manches · boutons virtuels pause / reprise / redémarrage", "Accélération progressive"] },
    { id: "architecture", title: "Architecture", modes: ["engineering"],
      body: "Découpage modulaire pour permettre le travail à deux sans se marcher dessus.",
      points: ["9 modules à responsabilité unique (~460 lignes)", "Modules ES6", "Séparation entrée / logique / rendu", "Structure pensée pour le travail en parallèle sur Git"] },
    { id: "limites", title: "Limites", modes: ["recruiter", "engineering"], kind: "limits" },
  ],
  metrics: [
    { label: "vanilla JS · Canvas HTML5", value: "✓", evidence: "implemented" },
    { label: "modes d'entrée (clavier + souris)", value: "2", evidence: "implemented" },
    { label: "modules · ~460 lignes", value: "9", evidence: "implemented" },
    { label: "équipe", value: "2", evidence: "implemented" },
    { label: "jouable en ligne", value: "Live", evidence: "deployed" },
  ],
  limits: [
    "Projet académique : « sans librairie » est une contrainte du cours, pas un choix de production.",
    "Périmètre défini par l'énoncé (un laboratoire d'interfaces).",
  ],
  links: [
    { label: "Jouer en ligne", url: "/gti350/index.html", kind: "demo" },
    { label: "GitHub", url: "https://github.com/ralphgabriel04/gti350-lab1-tron-light-cycles", kind: "repo" },
  ],
};

const gti350En: CaseStudyV2 = {
  modes: ["recruiter", "engineering"],
  identity: {
    valueProp: "A two-player Tron game in vanilla JavaScript, centered on direct manipulation and two input modes — playable online.",
    kind: "Academic project · team (ÉTS GTI350)",
    domain: "User interfaces · game",
    maturity: "archived",
    maturityLabel: "Delivered academic project · ÉTS",
    period: "2026",
    team: "Team of 2",
    role: "Developer (UI & game logic)",
    platforms: ["Web · playable online"],
    stack: ["JavaScript (vanilla)", "HTML5 Canvas", "ES6 modules", "HTML/CSS"],
    updated: "2026-07-29",
  },
  sections: [
    { id: "resume", title: "Summary", modes: ["recruiter"],
      body: "A two-player \"Tron\" game written with no libraries, for the user-interfaces course. The exercise: direct manipulation and two input modes, with a modular architecture designed for parallel work on Git." },
    { id: "contexte", title: "Context", modes: ["recruiter", "engineering"],
      body: "ÉTS's user-interfaces course (GTI350), in a team of 2. The \"vanilla JS, no libraries\" constraint is pedagogical: everything is hand-written." },
    { id: "fonctionnalites", title: "Features", modes: ["engineering"],
      body: "A complete game, rendered on Canvas.",
      points: ["HTML5 Canvas rendering", "Two input modes: keyboard (QWERTY / AZERTY handling) and mouse gestures to steer the cycle", "Collision detection (trails + walls)", "Multi-round scoring · virtual pause / resume / restart buttons", "Progressive acceleration"] },
    { id: "architecture", title: "Architecture", modes: ["engineering"],
      body: "Modular split so two people can work without stepping on each other.",
      points: ["9 single-responsibility modules (~460 lines)", "ES6 modules", "Input / logic / rendering separation", "Structure designed for parallel work on Git"] },
    { id: "limites", title: "Limits", modes: ["recruiter", "engineering"], kind: "limits" },
  ],
  metrics: [
    { label: "vanilla JS · HTML5 Canvas", value: "✓", evidence: "implemented" },
    { label: "input modes (keyboard + mouse)", value: "2", evidence: "implemented" },
    { label: "modules · ~460 lines", value: "9", evidence: "implemented" },
    { label: "team", value: "2", evidence: "implemented" },
    { label: "playable online", value: "Live", evidence: "deployed" },
  ],
  limits: [
    "Academic project: \"no libraries\" is a course constraint, not a production choice.",
    "Scope set by the brief (a UI lab).",
  ],
  links: [
    { label: "Play online", url: "/gti350/index.html", kind: "demo" },
    { label: "GitHub", url: "https://github.com/ralphgabriel04/gti350-lab1-tron-light-cycles", kind: "repo" },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// PRODUCT / PERSONAL PROTOTYPES — honest maturity, no invented results.
// Wise & Wealthy: recruiter + business (grounded in a full business model).
// Tatzy: recruiter + engineering.
// ─────────────────────────────────────────────────────────────────────────────

const wwFr: CaseStudyV2 = {
  modes: ["recruiter", "business"],
  identity: {
    valueProp: "Un coach financier personnel assisté par l'IA, pensé pour les 18-35 ans peu à l'aise avec la finance — éducation et accompagnement, à l'opposé des apps de trading.",
    kind: "Produit cofondé · concept + prototype",
    domain: "Éducation financière · mobile",
    maturity: "prototype",
    maturityLabel: "Concept · prototype interactif",
    period: "2026",
    team: "Projet cofondé",
    role: "Conception produit · modèle d'affaires & prototypage",
    market: "18-35 ans peu à l'aise avec la finance",
    platforms: ["Mobile · maquette bilingue clair/sombre"],
    stack: ["Claude Design → Claude Code", "dc-runtime (React 18)", "Design tokens", "i18n FR/EN", "Cible : Next.js + TS"],
    updated: "2026-07-29",
  },
  sections: [
    { id: "resume", title: "Résumé", modes: ["recruiter"],
      body: "Wise & Wealthy rend l'éducation financière accessible : un assistant « Wiz » explique, encourage et accompagne, plutôt que de pousser à spéculer. Le concept s'appuie sur un modèle d'affaires complet (12 pages) et un PRD, et se matérialise par une maquette d'une vingtaine d'écrans." },
    { id: "probleme", title: "Le problème & le positionnement", modes: ["recruiter", "business"],
      body: "Les 18-35 ans sont souvent mal à l'aise avec la finance, et les apps existantes parlent trading ou budget aride.",
      points: ["Positionnement assumé : éducation & vulgarisation, pas spéculation", "Une identité rassurante, non intimidante (mascotte Wiz, verts apaisants)", "Éducation financière — explicitement pas du conseil réglementé"] },
    { id: "modele", title: "Le modèle d'affaires", modes: ["business"],
      body: "Le concept est fondé sur un dossier d'affaires réel, pas seulement une maquette.",
      points: ["Étude de marché + Business Model Canvas (12 pages)", "Analyse concurrentielle (YNAB · Rocket Money · Wealthsimple)", "Modèle freemium · palier premium 9,99-19,99 $/mois", "Indicateurs (KPIs) et MVP définis"] },
    { id: "suite", title: "Plus qu'une app : une suite", modes: ["recruiter", "business"],
      body: "Le prototype couvre quatre surfaces qui se répondent, unifiées par la mascotte Wiz (6 humeurs).",
      points: ["App adulte : tableau de bord, budget, objectifs, mini-leçons, assistant Wiz", "« Mes finances » (premium) : transactions, prévu vs réel, cashflow, dettes, abonnements, import banque/CSV", "Wise & Wealthy Kids : déclinaison ludique (tirelire, pièces, étoiles, jalons)", "Espace Famille : verrou PIN 4 chiffres + profils enfants"] },
    { id: "confiance", title: "Confiance & données", modes: ["business"],
      body: "Un produit financier doit inspirer confiance avant tout.",
      points: ["Orientation Loi 25 (protection des données)", "Cadre « éducation, non conseil réglementé » assumé", "Bilingue FR/EN · thème clair/sombre"] },
    { id: "limites", title: "Limites", modes: ["recruiter", "business"], kind: "limits" },
  ],
  metrics: [
    { label: "surfaces (adulte · finances · Kids · Famille)", value: "4", evidence: "designed" },
    { label: "écrans & états", value: "20+", evidence: "implemented" },
    { label: "dossier d'affaires", value: "12 p.", evidence: "designed" },
    { label: "maquette bilingue en ligne", value: "Live", evidence: "deployed" },
  ],
  limits: [
    "C'est un concept + une maquette interactive, pas un produit construit.",
    "L'assistant « Wiz » est maquetté — aucune IA n'est réellement branchée.",
    "Le modèle freemium et les prix sont proposés, non validés par le marché.",
  ],
  links: [
    { label: "Maquette live (app adulte)", url: "/wise-wealthy/index.html", kind: "demo" },
    { label: "Mes finances", url: "/wise-wealthy/Finances.dc.html", kind: "demo" },
    { label: "Wise & Wealthy Kids", url: "/wise-wealthy/Wise%20%26%20Wealthy%20Kids.dc.html", kind: "demo" },
  ],
};

const wwEn: CaseStudyV2 = {
  modes: ["recruiter", "business"],
  identity: {
    valueProp: "An AI-assisted personal financial coach for 18-35 year-olds who aren't comfortable with finance — education and guidance, the opposite of trading apps.",
    kind: "Cofounded product · concept + prototype",
    domain: "Financial literacy · mobile",
    maturity: "prototype",
    maturityLabel: "Concept · interactive prototype",
    period: "2026",
    team: "Cofounded project",
    role: "Product design · business model & prototyping",
    market: "18-35 year-olds uneasy with finance",
    platforms: ["Mobile · bilingual light/dark mockup"],
    stack: ["Claude Design → Claude Code", "dc-runtime (React 18)", "Design tokens", "i18n FR/EN", "Target: Next.js + TS"],
    updated: "2026-07-29",
  },
  sections: [
    { id: "resume", title: "Summary", modes: ["recruiter"],
      body: "Wise & Wealthy makes financial literacy approachable: a \"Wiz\" assistant explains, encourages and coaches, rather than pushing you to speculate. The concept rests on a full business model (12 pages) and a PRD, and comes to life as a mockup of around twenty screens." },
    { id: "probleme", title: "The problem & positioning", modes: ["recruiter", "business"],
      body: "18-35 year-olds are often uneasy with finance, and existing apps speak trading or dry budgeting.",
      points: ["Deliberate stance: education & plain language, not speculation", "A reassuring, non-intimidating identity (Wiz mascot, calming greens)", "Financial education — explicitly not regulated advice"] },
    { id: "modele", title: "The business model", modes: ["business"],
      body: "The concept is grounded in a real business case, not just a mockup.",
      points: ["Market study + Business Model Canvas (12 pages)", "Competitive analysis (YNAB · Rocket Money · Wealthsimple)", "Freemium model · premium tier $9.99-19.99/mo", "KPIs and MVP defined"] },
    { id: "suite", title: "More than an app: a suite", modes: ["recruiter", "business"],
      body: "The prototype spans four surfaces that echo each other, unified by the Wiz mascot (6 moods).",
      points: ["Adult app: dashboard, budget, goals, mini-lessons, Wiz assistant", "\"Mes finances\" (premium): transactions, planned vs actual, cashflow, debts, subscriptions, bank/CSV import", "Wise & Wealthy Kids: playful variant (piggy bank, coins, stars, milestones)", "Family Space: 4-digit PIN lock + child profiles"] },
    { id: "confiance", title: "Trust & data", modes: ["business"],
      body: "A financial product must earn trust first.",
      points: ["Loi 25 (data protection) orientation", "A deliberate \"education, not regulated advice\" frame", "Bilingual FR/EN · light/dark theme"] },
    { id: "limites", title: "Limits", modes: ["recruiter", "business"], kind: "limits" },
  ],
  metrics: [
    { label: "surfaces (adult · finances · Kids · Family)", value: "4", evidence: "designed" },
    { label: "screens & states", value: "20+", evidence: "implemented" },
    { label: "business case", value: "12 pp.", evidence: "designed" },
    { label: "bilingual mockup online", value: "Live", evidence: "deployed" },
  ],
  limits: [
    "It's a concept + an interactive mockup, not a built product.",
    "The \"Wiz\" assistant is mocked up — no AI is actually wired in.",
    "The freemium model and pricing are proposed, not market-validated.",
  ],
  links: [
    { label: "Live mockup (adult app)", url: "/wise-wealthy/index.html", kind: "demo" },
    { label: "Mes finances", url: "/wise-wealthy/Finances.dc.html", kind: "demo" },
    { label: "Wise & Wealthy Kids", url: "/wise-wealthy/Wise%20%26%20Wealthy%20Kids.dc.html", kind: "demo" },
  ],
};

const tatzyFr: CaseStudyV2 = {
  modes: ["recruiter", "engineering"],
  identity: {
    valueProp: "Site de réservation de taxi en ligne, cofondé et déployé : un monorepo web + API en Next.js, bilingue, encore au stade prototype.",
    kind: "Produit cofondé · prototype",
    domain: "Réservation · transport",
    maturity: "prototype",
    maturityLabel: "Prototype déployé",
    period: "2025 · 2026",
    team: "Cofondé avec Aimen Djebbar",
    role: "Cofondateur · développement",
    platforms: ["Web (bilingue FR/EN)"],
    stack: ["Next.js 14 (App Router)", "TypeScript", "Tailwind CSS", "Prisma · PostgreSQL", "next-intl (FR/EN)", "Zod", "Vercel"],
    updated: "2026-07-29",
  },
  sections: [
    { id: "resume", title: "Résumé", modes: ["recruiter"],
      body: "Tatzy est un site de réservation de taxi cofondé avec Aimen Djebbar. Le prototype — page d'accueil, tunnel de réservation et fondations d'une API — est déployé sur Vercel. Honnêtement : c'est un prototype, sans trafic client réel pour l'instant." },
    { id: "fiche", title: "Fiche technique", modes: ["recruiter", "engineering"],
      body: "Un monorepo web + API en Next.js 14 (App Router), sur Prisma/PostgreSQL, bilingue et validé par Zod.",
      points: ["Monorepo : application web + fondations d'API", "Page d'accueil + tunnel de réservation", "Prisma / PostgreSQL pour la persistance", "Bilingue FR/EN (next-intl) · validation Zod", "Déployé sur Vercel"] },
    { id: "limites", title: "Limites", modes: ["recruiter", "engineering"], kind: "limits" },
  ],
  metrics: [
    { label: "monorepo web + API", value: "✓", evidence: "implemented" },
    { label: "bilingue FR/EN", value: "✓", evidence: "implemented" },
    { label: "cofondé (2 personnes)", value: "2", evidence: "implemented" },
    { label: "déployé sur Vercel", value: "Live", evidence: "deployed" },
  ],
  limits: [
    "Encore au stade prototype : pas de trafic client réel.",
    "Fondations d'API en place, mais le produit n'est pas en exploitation.",
  ],
  links: [
    { label: "Démo live", url: "https://tatzy-taxi.vercel.app", kind: "demo" },
    { label: "GitHub", url: "https://github.com/ralphgabriel04/tatzy-taxi", kind: "repo" },
  ],
};

const tatzyEn: CaseStudyV2 = {
  modes: ["recruiter", "engineering"],
  identity: {
    valueProp: "An online taxi-booking site, co-founded and deployed: a web + API monorepo in Next.js, bilingual, still at prototype stage.",
    kind: "Cofounded product · prototype",
    domain: "Booking · transport",
    maturity: "prototype",
    maturityLabel: "Deployed prototype",
    period: "2025 · 2026",
    team: "Co-founded with Aimen Djebbar",
    role: "Co-founder · development",
    platforms: ["Web (bilingual FR/EN)"],
    stack: ["Next.js 14 (App Router)", "TypeScript", "Tailwind CSS", "Prisma · PostgreSQL", "next-intl (FR/EN)", "Zod", "Vercel"],
    updated: "2026-07-29",
  },
  sections: [
    { id: "resume", title: "Summary", modes: ["recruiter"],
      body: "Tatzy is a taxi-booking site co-founded with Aimen Djebbar. The prototype — landing page, booking flow and API foundations — is deployed on Vercel. Honestly: it's a prototype, with no real customer traffic yet." },
    { id: "fiche", title: "Tech sheet", modes: ["recruiter", "engineering"],
      body: "A web + API monorepo in Next.js 14 (App Router), on Prisma/PostgreSQL, bilingual and Zod-validated.",
      points: ["Monorepo: web app + API foundations", "Landing page + booking flow", "Prisma / PostgreSQL for persistence", "Bilingual FR/EN (next-intl) · Zod validation", "Deployed on Vercel"] },
    { id: "limites", title: "Limits", modes: ["recruiter", "engineering"], kind: "limits" },
  ],
  metrics: [
    { label: "web + API monorepo", value: "✓", evidence: "implemented" },
    { label: "bilingual FR/EN", value: "✓", evidence: "implemented" },
    { label: "co-founded (2 people)", value: "2", evidence: "implemented" },
    { label: "deployed on Vercel", value: "Live", evidence: "deployed" },
  ],
  limits: [
    "Still at prototype stage: no real customer traffic.",
    "API foundations in place, but the product isn't in operation.",
  ],
  links: [
    { label: "Live demo", url: "https://tatzy-taxi.vercel.app", kind: "demo" },
    { label: "GitHub", url: "https://github.com/ralphgabriel04/tatzy-taxi", kind: "repo" },
  ],
};

const vibeFr: CaseStudyV2 = {
  modes: ["recruiter", "business"],
  identity: {
    valueProp: "Un guide local intelligent qui aide à décider quoi faire maintenant à Montréal selon le mood, l'heure, le budget et la station STM la plus proche.",
    kind: "Produit cofondé · concept + prototype",
    domain: "Découverte locale · mobile + web",
    maturity: "prototype",
    maturityLabel: "Prototype interactif · en développement actif",
    period: "2026 · présent",
    team: "Projet cofondé",
    role: "Conception produit · stratégie & prototypage",
    market: "Montréalais·es cherchant quoi faire maintenant (locaux & visiteurs)",
    platforms: ["Mobile-first · navigable web / bureau"],
    stack: ["Claude Design → Claude Code", "dc-runtime", "Design system dark mode", "Cible : Next.js + TS · Supabase · OpenAI · Google Maps · STM GTFS"],
    updated: "2026-07-29",
  },
  sections: [
    { id: "resume", title: "Résumé", modes: ["recruiter"],
      body: "L'utilisateur choisit une ambiance — Chill, Romantique, Étudier, Aventure, Budget, Social ou Solo — et reçoit cafés, restos, bars, activités, parcs, rooftops et spots cachés ouverts autour de lui. Un prototype interactif qui matérialise le concept sur mobile et bureau." },
    { id: "probleme", title: "Le problème & l'approche", modes: ["recruiter", "business"],
      body: "« Quoi faire maintenant ? » est une question à la fois banale et étonnamment mal résolue.",
      points: ["Point de départ « mood-first » : on choisit une ambiance, pas une catégorie", "Filtré par l'heure, le budget, la localisation et la station STM", "Fiches lieux enrichies (% match · budget · temps de marche)"] },
    { id: "differenciateurs", title: "Deux différenciateurs", modes: ["recruiter", "business"],
      body: "Ce qui distingue Vibe d'un simple annuaire de lieux.",
      points: ["STM Pulse : chaque station de métro devient une interface de découverte (événements, spots, temps de marche, ambiance autour de l'arrêt)", "Vibe AI : un assistant qui transforme une envie vague (« quoi faire ce soir en 2h ? ») en plan concret", "Couche communauté légère : mini-reviews, votes de vibe, spots proposés (badge Découvreur)"] },
    { id: "portee", title: "Ce que couvre le prototype", modes: ["business"],
      points: ["Accueil mood-first (7 ambiances)", "Vibe AI · STM Pulse · Explorer", "Fiches lieux enrichies · communauté", "Version mobile et version bureau"] },
    { id: "limites", title: "Limites", modes: ["recruiter", "business"], kind: "limits" },
  ],
  metrics: [
    { label: "ambiances (mood-first)", value: "7", evidence: "designed" },
    { label: "STM Pulse · carte métro", value: "✓", evidence: "designed" },
    { label: "surfaces (mobile + bureau)", value: "2", evidence: "implemented" },
    { label: "maquette en ligne", value: "Live", evidence: "deployed" },
  ],
  limits: [
    "Prototype interactif : le produit ciblé (Next.js · Supabase · OpenAI · Google Maps · STM GTFS) n'est pas encore construit.",
    "Vibe AI et STM Pulse sont maquettés/simulés — aucune API n'est réellement branchée.",
    "Les données de lieux et d'événements sont illustratives.",
  ],
  links: [
    { label: "Maquette live (mobile)", url: "/vibe/index.html", kind: "demo" },
    { label: "Version web / bureau", url: "/vibe/Vibe%20Web.dc.html", kind: "demo" },
  ],
};

const vibeEn: CaseStudyV2 = {
  modes: ["recruiter", "business"],
  identity: {
    valueProp: "A smart local guide that helps you decide what to do right now in Montréal based on mood, time of day, budget and the nearest STM station.",
    kind: "Cofounded product · concept + prototype",
    domain: "Local discovery · mobile + web",
    maturity: "prototype",
    maturityLabel: "Interactive prototype · actively in development",
    period: "2026 · present",
    team: "Cofounded project",
    role: "Product design · strategy & prototyping",
    market: "Montrealers looking for what to do now (locals & visitors)",
    platforms: ["Mobile-first · navigable web / desktop"],
    stack: ["Claude Design → Claude Code", "dc-runtime", "Dark-mode design system", "Target: Next.js + TS · Supabase · OpenAI · Google Maps · STM GTFS"],
    updated: "2026-07-29",
  },
  sections: [
    { id: "resume", title: "Summary", modes: ["recruiter"],
      body: "Users pick a vibe — Chill, Romantic, Study, Adventure, Budget, Social or Solo — and get cafés, restaurants, bars, activities, parks, rooftops and hidden spots open around them. An interactive prototype that brings the concept to life on mobile and desktop." },
    { id: "probleme", title: "The problem & approach", modes: ["recruiter", "business"],
      body: "\"What should I do right now?\" is both mundane and surprisingly poorly solved.",
      points: ["A \"mood-first\" starting point: you pick a vibe, not a category", "Filtered by time, budget, location and STM station", "Enriched place pages (% match · budget · walking time)"] },
    { id: "differenciateurs", title: "Two differentiators", modes: ["recruiter", "business"],
      body: "What sets Vibe apart from a plain place directory.",
      points: ["STM Pulse: each metro station becomes a discovery interface (events, spots, walking time, vibe around the stop)", "Vibe AI: an assistant that turns a vague urge (\"what to do tonight in 2h?\") into a concrete plan", "A light community layer: mini-reviews, vibe votes, submitted spots (Discoverer badge)"] },
    { id: "portee", title: "What the prototype covers", modes: ["business"],
      points: ["Mood-first home (7 vibes)", "Vibe AI · STM Pulse · Explore", "Enriched place pages · community", "Mobile version and desktop version"] },
    { id: "limites", title: "Limits", modes: ["recruiter", "business"], kind: "limits" },
  ],
  metrics: [
    { label: "vibes (mood-first)", value: "7", evidence: "designed" },
    { label: "STM Pulse · metro map", value: "✓", evidence: "designed" },
    { label: "surfaces (mobile + desktop)", value: "2", evidence: "implemented" },
    { label: "mockup online", value: "Live", evidence: "deployed" },
  ],
  limits: [
    "Interactive prototype: the target product (Next.js · Supabase · OpenAI · Google Maps · STM GTFS) isn't built yet.",
    "Vibe AI and STM Pulse are mocked/simulated — no API is actually wired in.",
    "Place and event data are illustrative.",
  ],
  links: [
    { label: "Live mockup (mobile)", url: "/vibe/index.html", kind: "demo" },
    { label: "Web / desktop version", url: "/vibe/Vibe%20Web.dc.html", kind: "demo" },
  ],
};

export const caseStudiesV2: Record<string, { fr: CaseStudyV2; en: CaseStudyV2 }> = {
  cadence: { fr: cadenceFr, en: cadenceEn },
  "dpm-elevate": { fr: dpmFr, en: dpmEn },
  "the-mad-space": { fr: madFr, en: madEn },
  vibe: { fr: vibeFr, en: vibeEn },
  "wise-wealthy": { fr: wwFr, en: wwEn },
  "kim-dubois": { fr: kimFr, en: kimEn },
  "boa-traiteur": { fr: boaFr, en: boaEn },
  crcc: { fr: crccFr, en: crccEn },
  cantelcox: { fr: cantelcoxFr, en: cantelcoxEn },
  financej: { fr: financejFr, en: financejEn },
  log430: { fr: log430Fr, en: log430En },
  log210: { fr: log210Fr, en: log210En },
  gti350: { fr: gti350Fr, en: gti350En },
  tatzy: { fr: tatzyFr, en: tatzyEn },
};
