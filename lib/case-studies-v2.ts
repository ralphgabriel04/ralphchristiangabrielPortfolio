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

export const caseStudiesV2: Record<string, { fr: CaseStudyV2; en: CaseStudyV2 }> = {
  cadence: { fr: cadenceFr, en: cadenceEn },
  "dpm-elevate": { fr: dpmFr, en: dpmEn },
};
