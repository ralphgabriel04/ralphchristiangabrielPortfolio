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
  /** Short card copy (2 sentences max): what it is + my part. Cards, rows and
   *  meta descriptions use it; the long `summary` stays on the case-study page. */
  pitch?: { fr: string; en: string }
  metrics: { fr: string[]; en: string[] }
  featured?: boolean
  media?: ProjectMedia
}

export const projects: Project[] = [
  {
    id: "the-mad-space",
    year: "2025 · 2026",
    status: { fr: "En production", en: "In production" },
    name: "The Mad Space",
    pitch: {
      fr: "Marketplace d'impression à la demande, en ligne. En contrat, j'ai conçu et livré la plateforme : paiements Stripe, production Gelato, 4 devises, en français et en anglais.",
      en: "A live print-on-demand marketplace. Under contract, I designed and shipped the platform: Stripe payments, Gelato production, 4 currencies, in French and English.",
    },
    tag: { fr: "Marketplace bilingue · créations imprimées à la demande", en: "Bilingual marketplace · print-on-demand creations" },
    stack: ["Next.js 16", "TypeScript", "PostgreSQL", "Prisma", "Stripe", "Gelato", "Supabase", "Vercel"],
    summary: {
      fr: "The Mad Space permet aux créateurs de soumettre leurs œuvres, de les transformer en vêtements et de recevoir une commission sur chaque vente. Comme CTO, je prends en charge la direction technique, l'architecture et le développement de la plateforme, du parcours créateur jusqu'au paiement et à la production automatisée des commandes.",
      en: "The Mad Space lets creators submit their artwork, turn it into apparel and earn a commission on every sale. As CTO, I own the technical direction, architecture and development of the platform, from the creator journey to payment and automated order fulfilment."
    },
    metrics: {
      fr: ["~15 000 lignes de code en production", "7 API tierces intégrées", "10-15 min de moins par commande", "4 devises · CAD/USD/EUR/GBP"],
      en: ["~15,000 lines of code in production", "7 third-party APIs integrated", "10-15 min saved per order", "4 currencies · CAD/USD/EUR/GBP"]
    },
    featured: true,
    media: { enabled: true, type: "image", src: "/media/the-mad-space.jpg" }
  },
  {
    id: "cadence",
    year: "2025 · présent",
    status: { fr: "En développement", en: "In development" },
    name: "Cadence",
    pitch: {
      fr: "Application mobile qui relie coachs de musculation et athlètes au Québec. Cofondateur, je porte toute la technique : architecture, données, sécurité et CI.",
      en: "A mobile app connecting strength coaches and athletes in Quebec. As co-founder, I own the engineering: architecture, data, security and CI.",
    },
    tag: { fr: "App mobile coaching sportif", en: "Sports coaching mobile app" },
    stack: ["Expo", "React Native", "TypeScript", "NativeWind", "Supabase", "Next.js"],
    summary: {
      fr: "Application mobile coach ↔ athlète co-fondée avec Alexandre (design). 169+ tickets structurés sur 13 sprints, audit concurrentiel de 8+ apps, conformité Loi 25 + PIPEDA + GDPR-ready. Marché de départ : coachs musculation francophones au Québec.",
      en: "Coach ↔ athlete mobile app co-founded with Alexandre (design). 169+ issues structured across 13 sprints, competitive audit of 8+ apps, Loi 25 + PIPEDA + GDPR-ready compliance. Beachhead: francophone gym coaches in Quebec."
    },
    metrics: { fr: ["13 sprints menés", "169+ tickets avec critères d'acceptation", "74/74 fonctionnalités couvertes"], en: ["13 sprints run", "169+ tickets with acceptance criteria", "74/74 features covered"] },
    media: { enabled: true, type: "video", src: "/media/cadence.mp4" }
  },
  {
    id: "cantelcox",
    year: "2026",
    status: { fr: "Académique · ÉTS · Système distribué", en: "Academic · ÉTS · Distributed system" },
    name: "CanTelcoX",
    pitch: {
      fr: "Système de facturation et d'activation d'un opérateur mobile, migré vers une architecture événementielle (6 microservices, saga RabbitMQ). Projet de session ÉTS en équipe de 5, mesuré sous charge.",
      en: "A mobile carrier's billing and activation system, moved to an event-driven architecture (6 microservices, RabbitMQ saga). ÉTS term project, team of 5, measured under load.",
    },
    tag: { fr: "BSS télécom événementiel · saga, Outbox, DLQ", en: "Event-driven telecom BSS · saga, Outbox, DLQ" },
    stack: ["Python 3.12", "FastAPI", "RabbitMQ", "MySQL · Flyway", "Redis", "KrakenD", "NGINX", "Prometheus", "Grafana", "Jaeger", "k6", "Docker Compose", "free5GC"],
    summary: {
      fr: "Système de support commercial (BSS) d'un opérateur mobile : portabilité de numéro, activation de ligne, facturation, MFA et anti-fraude. Le système passe d'un découpage microservices synchrone à une architecture orientée événements : 6 services hexagonaux, aucun appel HTTP direct de service à service dans le flux métier, saga chorégraphiée sur RabbitMQ avec compensation, patron Outbox transactionnel, file de rebut et traçage distribué. Deux intégrations externes réelles sont isolées derrière une couche anticorruption : free5GC (cœur réseau 5G, provisionnement des MSISDN via les API UDM) et un hub de portabilité Java, en rôle receveur et donneur, par webhooks TMF Event v4 à signature vérifiée. Ce que j'en retiens n'est pas la liste de patrons mais la façon dont l'optimisation a été conduite : cinq paliers, chacun mesuré et consigné, y compris celui qui n'a rien donné. Le palier 2 est le plus instructif, accélérer la publication a amélioré l'accusé de réception sans améliorer la convergence, parce que le goulot s'était déplacé vers svc-subscription ; la mesure l'a localisé (3 960 messages en attente sur un seul consommateur) et les paliers suivants l'ont traité. Résultat final : accusé P95 divisé par 2,4, convergence des sagas passée de 47 % à 100 %, zéro erreur sur 22 031 requêtes.",
      en: "The business support system (BSS) of a mobile carrier: number portability, line activation, billing, MFA and fraud screening. The system moves from synchronous microservices to an event-driven architecture, 6 hexagonal services, no direct service-to-service HTTP in the business flow, a choreographed saga over RabbitMQ with compensation, a transactional Outbox, a dead-letter queue and distributed tracing. Two real external integrations sit behind an anti-corruption layer: free5GC (5G core, MSISDN provisioning through the UDM APIs) and a Java number-portability hub, acting as both recipient and donor, over signature-verified TMF Event v4 webhooks. What I take from it isn't the pattern checklist but how the optimization was run: five stages, each measured and recorded, including the one that produced nothing. Stage 2 is the instructive one, speeding up publication improved acknowledgement without improving convergence, because the bottleneck had moved to svc-subscription; measurement located it (3,960 messages queued on a single consumer) and the later stages addressed it. Final result: acknowledgement P95 divided by 2.4, saga convergence up from 47% to 100%, zero errors across 22,031 requests.",
    },
    metrics: {
      fr: ["2,4 fois plus rapide (P95 : 952 → 396 ms)", "100 % des sagas convergent (47 % avant)", "0 erreur sur 22 031 requêtes", "173 tests · 60 des 97 commits"],
      en: ["2.4 times faster (P95: 952 → 396 ms)", "100% of sagas converge (was 47%)", "0 errors across 22,031 requests", "173 tests · 60 of 97 commits"],
    },
    // Real flow map from the public repo (docs/phase2/gabarit/figures/fig1_carte_flux.png).
    media: { enabled: true, type: "image", src: "/media/cantelcox-architecture.jpg" },
  },
  {
    id: "vibe",
    year: "2026 · présent",
    status: { fr: "Prototype interactif · En développement actif", en: "High-fidelity prototype · Actively in development" },
    name: "Vibe Montréal",
    pitch: {
      fr: "Guide local qui propose quoi faire à Montréal selon l'ambiance, l'heure et le budget. Prototype mobile et web, avec une carte du métro interactive.",
      en: "A local guide that suggests what to do in Montréal based on mood, time and budget. Mobile and web prototype with an interactive metro map.",
    },
    tag: { fr: "Découverte locale intelligente · Prototype mobile + web", en: "Smart local discovery · Mobile + web prototype" },
    stack: ["HTML", "CSS", "JavaScript", "Claude Design", "Claude Code"],
    summary: {
      fr: "Guide local intelligent qui aide à décider quoi faire maintenant à Montréal selon l'ambiance, l'heure, le budget, la localisation et la station STM. L'utilisateur choisit une ambiance (Chill, Romantique, Étudier, Aventure, Budget, Social ou Solo) et reçoit cafés, restos, bars, activités, parcs, terrasses sur les toits et lieux cachés ouverts autour de lui. Deux différenciateurs : STM Pulse, une carte du métro de Montréal qui transforme chaque station en interface de découverte (événements, lieux, temps de marche, budget, ambiance autour de l'arrêt), et Vibe AI, un assistant conversationnel qui change une envie vague (« quoi faire ce soir en 2h ? », « date pas cher ») en plan concret. Une couche communauté légère (mini-reviews, votes de vibe, nouveaux spots proposés avec badge Découvreur). Prototype interactif couvrant l'accueil par ambiance, Vibe AI, STM Pulse, Explorer, fiches lieux enrichies, communauté et version bureau, mobile-first, mais navigable sur web et bureau.",
      en: "Smart local guide that helps you decide what to do right now in Montréal based on mood, time of day, budget, location and STM metro station. Users pick a vibe (Chill, Romantic, Study, Adventure, Budget, Social or Solo) and get cafés, restaurants, bars, activities, parks, rooftops and hidden spots open around them. Two differentiators: STM Pulse, a Montréal metro map that turns each station into a discovery interface (events, spots, walking time, budget, vibe around the stop), and Vibe AI, a conversational assistant that turns a vague urge (\"what to do tonight in 2h?\", \"cheap date\") into a concrete plan. A light community layer (mini-reviews, vibe votes, new spots submitted with a Discoverer badge). A interactive prototype spanning a mood-first home, Vibe AI, STM Pulse, Explore, enriched place pages, community and a desktop version, mobile-first, yet navigable on web and desktop."
    },
    metrics: {
      fr: ["7 ambiances au choix", "1 carte du métro interactive (STM Pulse)", "2 versions : mobile et bureau"],
      en: ["7 moods to choose from", "1 interactive metro map (STM Pulse)", "2 versions: mobile and desktop"]
    },
    media: { enabled: true, type: "image", src: "/media/vibe.jpg" }
  },
  {
    id: "dpm-elevate",
    year: "2025 · présent",
    status: { fr: "En développement actif · Déployé", en: "Actively in development · Deployed" },
    name: "DPM Elevate",
    pitch: {
      fr: "Application web de planification (agenda, tâches, habitudes) que je conçois et développe seul, déployée : synchro Google et Microsoft, jetons chiffrés, conformité Loi 25.",
      en: "A planning web app (calendar, tasks, habits) I design and build solo, deployed: Google and Microsoft sync, encrypted tokens, Loi 25 compliance.",
    },
    tag: { fr: "Agenda, tâches, habitudes & focus · App web", en: "Calendar, tasks, habits & focus · Web app" },
    stack: ["Next.js 14", "TypeScript", "tRPC", "Prisma", "PostgreSQL (Supabase)", "NextAuth v5", "Tailwind · Radix", "next-intl (FR/EN)", "Vitest", "Vercel"],
    summary: {
      fr: "Application web personnelle de planification (agenda, tâches, habitudes, objectifs et focus) que je conçois et développe en solo, aujourd'hui déployée. Née d'une maquette détaillée d'une vingtaine d'écrans, elle est devenue un vrai produit Next.js : synchronisation réelle des calendriers Google et Microsoft, authentification multi-fournisseurs (NextAuth v5 (Google, Microsoft, Apple, GitHub, OIDC) et une attention sérieuse à la sécurité et à la vie privée) jetons OAuth chiffrés au repos (AES-256-GCM), row-level security en défense en profondeur, limitation de débit, avec conformité Loi 25 : suppression de compte, export des données et journal d'audit en libre-service. Bilingue FR/EN, thème clair/sombre, sur tRPC et Prisma/PostgreSQL.",
      en: "A personal planning web app (calendar, tasks, habits, goals and focus) that I design and build solo, and that's now deployed. It grew from a detailed ~20-screen mockup into a real Next.js product: real Google and Microsoft calendar sync, multi-provider authentication (NextAuth v5 (Google, Microsoft, Apple, GitHub, OIDC) and serious attention to security and privacy) OAuth tokens encrypted at rest (AES-256-GCM), defense-in-depth row-level security, rate limiting, with Loi 25 compliance: self-serve account deletion, data export and an audit log. Bilingual FR/EN, light/dark theme, on tRPC and Prisma/PostgreSQL."
    },
    metrics: {
      fr: ["2 agendas synchronisés · Google, Microsoft", "5 fournisseurs de connexion", "256 bits · jetons OAuth chiffrés (AES-GCM)", "Conformité Loi 25 (export et suppression)"],
      en: ["2 calendars synced · Google, Microsoft", "5 sign-in providers", "256 bits · OAuth tokens encrypted (AES-GCM)", "Loi 25 compliance (export and deletion)"]
    },
    media: { enabled: true, type: "video", src: "/media/dpm-elevate.mp4" }
  },
  {
    id: "wise-wealthy",
    year: "2026",
    status: { fr: "Concept · Prototype interactif", en: "Concept · High-fidelity prototype" },
    name: "Wise & Wealthy",
    pitch: {
      fr: "Coach financier assisté par l'IA pour les 18 à 35 ans. Prototype interactif d'une vingtaine d'écrans, appuyé sur un modèle d'affaires complet.",
      en: "An AI-assisted money coach for 18 to 35 year-olds. A clickable prototype of about twenty screens, built on a full business model.",
    },
    tag: { fr: "Coach financier IA · Prototype mobile", en: "AI financial coach · Mobile prototype" },
    stack: ["React 18", "JavaScript", "CSS", "Claude Design", "Claude Code"],
    summary: {
      fr: "Concept et prototype interactif de Wise & Wealthy, un coach financier personnel, assisté par l'IA, qui rend l'éducation financière plus accessible aux 18–35 ans peu à l'aise avec la finance. Le produit est pensé à partir d'un modèle d'affaires complet (12 pages : étude de marché, Business Model Canvas, analyse concurrentielle YNAB/Rocket Money/Wealthsimple, MVP, indicateurs) et d'un PRD de découverte, et se positionne à l'opposé des apps de trading : éducation, vulgarisation et accompagnement plutôt que spéculation. La maquette mobile couvre une vingtaine d'écrans et d'états : parcours d'accueil guidé, tableau de bord (revenus, dépenses, épargne, « série de clarté », action du jour), assistant conversationnel « Wiz », budget et budget setup, objectifs d'épargne, mini-leçons + flashcards + exercices, actualité financière vulgarisée, notifications, profil, confidentialité et paywall freemium. Identité rassurante et non intimidante (mascotte Wiz, verts apaisants, Bricolage Grotesque + Plus Jakarta Sans), bilingue FR/EN, thème clair/sombre. Plus qu'une seule app, c'est une petite suite : l'app adulte ; « Mes finances », surface de suivi avancée (Transactions, Prévu vs réel, Cashflow, Abonnements, Dettes, import banque/CSV) qui incarne le palier premium ; « Wise & Wealthy Kids », déclinaison ludique pour enfants (tirelire, pièces, étoiles, jalons) ; « Espace Famille », espace parents avec code PIN à 4 chiffres et profils enfants ; et Wiz, la mascotte réutilisable (6 humeurs) qui unifie le tout. Positionnement assumé : éducation financière, pas de conseil réglementé, orienté confiance et protection des données (Loi 25).",
      en: "Concept and interactive prototype of Wise & Wealthy, an AI-assisted personal financial coach that makes financial literacy more approachable for 18–35 year-olds who aren't comfortable with finance. The product is grounded in a full business model (12 pages: market study, Business Model Canvas, competitive analysis of YNAB/Rocket Money/Wealthsimple, MVP, KPIs) and a discovery PRD, and is positioned as the opposite of trading apps: education, plain-language guidance and coaching rather than speculation. The mobile mockup spans around twenty screens and states, guided onboarding, dashboard (income, expenses, savings, a \"clarity streak\", daily action), conversational \"Wiz\" assistant, budget and budget setup, savings goals, mini-lessons + flashcards + exercises, simplified financial news, notifications, profile, privacy and a freemium paywall. A reassuring, non-intimidating identity (Wiz mascot, calming greens, Bricolage Grotesque + Plus Jakarta Sans), bilingual FR/EN, light/dark theme. More than a single app, it's a small suite: the adult app; \"Mes finances\", an advanced tracking surface (Transactions, Planned vs actual, Cashflow, Subscriptions, Debts, bank/CSV import) embodying the premium tier; \"Wise & Wealthy Kids\", a playful variant for children (piggy bank, coins, stars, milestones); \"Family Space\", a parent area with a 4-digit PIN and child profiles; and Wiz, the reusable mascot (6 moods) that unifies it all. A deliberate stance: financial education, not regulated advice, built around trust and data protection (Loi 25)."
    },
    metrics: {
      fr: ["20+ écrans et états", "5 surfaces dans une même suite", "12 pages de modèle d'affaires", "Bilingue FR/EN · clair/sombre"],
      en: ["20+ screens and states", "5 surfaces in one suite", "12 pages of business model", "Bilingual FR/EN · light/dark"]
    },
    media: { enabled: true, type: "video", src: "/media/wise-wealthy.mp4" }
  },
  {
    id: "kim-dubois",
    year: "2026",
    status: { fr: "Prototype client · Premier client payant", en: "Client prototype · First paying client" },
    name: "Kim Dubois Photographe",
    pitch: {
      fr: "Refonte du site d'une photographe animalière primée, mon premier client payant. Maquette bilingue de plusieurs pages, avec un mode d'édition pour la cliente.",
      en: "A redesign for an award-winning pet photographer, my first paying client. A bilingual multi-page mockup with an editing mode for the client.",
    },
    tag: { fr: "Site vitrine photographe animalière · Prototype", en: "Pet photographer portfolio site · Prototype" },
    stack: ["React", "JavaScript", "CSS", "Claude Design", "Claude Code"],
    summary: {
      fr: "Reprise et refonte du site d'une photographe animalière primée à l'international (TIPPA 2024-2025, Bronze), dont le site Wix était resté inachevé. Démarche complète orientée premier client payant : formulaire de découverte Word de 60 questions, deck PowerPoint de 9 diapos pour cadrer l'appel, brief Claude Design structuré, puis maquette générée et implémentée. Au fil des itérations, le prototype est passé d'une page d'accueil unique à une maquette complète et interactive : multi-pages (accueil, galerie portfolio, page distinctions), une quinzaine de sections modulaires (héros, compteurs, parcours, forfaits, témoignages, boutique, espace client, infolettre, FAQ, pont de l'arc-en-ciel…), de vraies photos primées organisées par catégorie, un carrousel intelligent avec lightbox et un fil « cousu » animé au scroll. Le tout bilingue FR/EN, clair/sombre, sélecteur d'audience (particuliers/commercial), identité éditoriale dorée (Cormorant Garamond + Mulish), protection légère des images et un assistant-concierge menant à un contact réel. Un mode administrateur intégré (« liberté encadrée ») permet d'éditer contenu et apparence, masquer/réordonner les sections et gérer des codes promo, pour absorber les retours de la cliente sans jamais casser la maquette.",
      en: "Takeover and redesign of the site of an internationally awarded pet photographer (TIPPA 2024-2025, Bronze) whose Wix site had been left unfinished. A complete first-paying-client process: a 60-question Word discovery form, a 9-slide PowerPoint deck to frame the call, a structured Claude Design brief, then a generated mockup implemented in code. Across iterations the prototype grew from a single home page into a full, interactive mockup: multi-page (home, portfolio gallery, distinctions page), around fifteen modular sections (hero, counters, process, packages, testimonials, shop, client area, newsletter, FAQ, rainbow bridge…), real awarded photos organised by category, a smart carousel with lightbox and a signature thread \"sewn\" along the scroll. All bilingual FR/EN, light/dark, with an audience switcher (consumer/commercial), an editorial gold identity (Cormorant Garamond + Mulish), light image protection and a concierge assistant leading to real contact. A built-in admin mode: \"bounded freedom\", lets you edit content and appearance, hide/reorder sections and manage promo codes, to absorb the client's feedback without ever breaking the mockup."
    },
    metrics: {
      fr: ["~15 sections modulaires", "60 questions de découverte avec la cliente", "2 langues · clair et sombre"],
      en: ["~15 modular sections", "60 discovery questions with the client", "2 languages · light and dark"]
    },
    media: { enabled: true, type: "video", src: "/media/kim-dubois.mp4" }
  },
  {
    id: "boa-traiteur",
    year: "2026",
    status: { fr: "Prototype client · Chef privé à Montréal", en: "Client prototype · Private chef in Montreal" },
    name: "BOA · Chef privé",
    pitch: {
      fr: "Site de réservation pour un chef privé à Montréal : parcours en plusieurs étapes, dépôt de 25 % et concierge de menu. Prototype bilingue, paiement simulé.",
      en: "A booking site for a private chef in Montréal: multi-step flow, 25% deposit and a menu concierge. Bilingual prototype with simulated payment.",
    },
    tag: { fr: "Site de réservation chef privé & service à table · Prototype bilingue", en: "Private chef & table-service booking site · Bilingual prototype" },
    stack: ["HTML", "CSS", "JavaScript", "Claude Design", "Claude Code"],
    summary: {
      fr: "Conception et prototype interactif de BOA, la marque de chef privé et service à table à Montréal du chef Max. Repris d'un PRD rempli par le client (document Word) et d'une analyse concurrentielle (Take a Chef, The Culinistas, Cozymeal, Tock), le site vend une expérience : « When the love for food meets unforgettable memories », plutôt qu'un simple traiteur : soupers privés, mariages, anniversaires et corporatif, préparés et servis à domicile. La maquette couvre tout le parcours : accueil éditorial (hero, piliers « l'art de recevoir », trust strip, « ce qui est inclus »), un concierge culinaire qui recommande un menu en 30 secondes (occasion, convives, budget, restrictions), les menus (fixe / événement / appel requis), les expériences, les lieux, une galerie photos, la présentation du chef et le contact. Le cœur est un parcours de réservation multi-étapes : menu → date (délai minimum 2 semaines, frais de dernière minute signalés, waitlist « me prévenir ») → format (service à table / table du chef / événement), convives (plafond 20, +20 → appel obligatoire), adresse (Île de Montréal · frais selon distance) et allergies → résumé (dépôt 25 % non remboursable, solde selon entente, taxes non appliquées) → paiement simulé (carte, débit, Interac) → confirmation (dépôt reçu, rappel 48 h, notification à Max). S'y ajoutent un chatbot « Concierge BOA » à réponses guidées, un sélecteur FR/EN, un thème clair/sombre bourgogne & crème (Newsreader + Hanken Grotesk + Allura), des animations premium respectant prefers-reduced-motion, et un mode administrateur avec emplacements photo en drag & drop pour brancher les vraies images. Tout est mocké proprement (aucun paiement réel, aucune IA branchée) en attendant de trancher prix, calendrier (Calendly), processeur de paiement (Stripe / Square) et textes légaux (Loi 25) avec le client.",
      en: "Design and interactive prototype of BOA, chef Max's private-chef and table-service brand in Montreal. Built from a client-filled PRD (Word document) and a competitive analysis (Take a Chef, The Culinistas, Cozymeal, Tock), the site sells an experience: \"When the love for food meets unforgettable memories\", rather than plain catering: private dinners, weddings, birthdays and corporate events, cooked and served at your home. The mockup covers the whole journey: an editorial home (hero, \"the art of hosting\" pillars, trust strip, \"what's included\"), a culinary concierge that recommends a menu in 30 seconds (occasion, guests, budget, restrictions), the menus (fixed / event / call required), experiences, venues, a photo gallery, the chef's story and contact. At its core is a multi-step booking flow: menu → date (2-week minimum lead time, last-minute fees flagged, \"notify me\" waitlist) → format (table service / chef's table / event), guests (capped at 20, 20+ → mandatory call), address (Island of Montreal · distance-based fee) and allergies → summary (25% non-refundable deposit, balance per agreement, taxes not applied) → mocked payment (card / debit / Interac) → confirmation (deposit received, 48h reminder, notification to Max). It also ships a guided \"BOA Concierge\" chatbot, an FR/EN switcher, a burgundy & cream light/dark theme (Newsreader + Hanken Grotesk + Allura), premium animations honouring prefers-reduced-motion, and an admin mode with drag-and-drop photo slots to wire in real images. Everything is cleanly mocked (no real payment, no live AI) pending decisions on pricing, calendar (Calendly), payment processor (Stripe / Square) and legal copy (Loi 25) with the client.",
    },
    metrics: {
      fr: ["25 % de dépôt intégré au parcours", "30 s pour une recommandation de menu", "2 langues · clair et sombre"],
      en: ["25% deposit built into the flow", "30 s to a menu recommendation", "2 languages · light and dark"],
    },
    media: { enabled: true, type: "image", src: "/media/boa-traiteur.jpg" }
  },
  {
    id: "crcc",
    year: "2026",
    status: { fr: "Maquette de refonte livrée", en: "Redesign mockup delivered" },
    name: "CRCC · Refonte",
    pitch: {
      fr: "Maquette de refonte de 10 pages pour un club d'éleveurs sans but lucratif : bilingue, accessible et bâtie sur des données réelles.",
      en: "A 10-page redesign mockup for a nonprofit breeders' club: bilingual, accessible and built on real data.",
    },
    tag: { fr: "Refonte de site OSBL · Maquette bilingue", en: "Nonprofit website redesign · Bilingual mockup" },
    stack: ["HTML", "CSS", "JavaScript", "ARIA", "Claude Design"],
    summary: {
      fr: "Maquette de refonte complète pour le Club du Rex de Cornouailles du Canada (OSBL bilingue d'éleveurs). Site statique multi-pages organisé autour de trois parcours : adopter un chaton, devenir éleveur membre, soutenir le club. 10 pages (Accueil, La race, Annuaire des éleveurs, Codes & éthique, Règlements, Publications, Adhésion, Administrateurs & comités, Contact) avec explorateur d'anatomie interactif, carte de répartition filtrable et identité Rouge & Blanc dérivée du logo officiel. Bilingue FR/EN à bascule instantanée, thème clair/sombre, mobile-first (375px → bureau), accessibilité WCAG 2.2 AA, sans backend. Données réelles intégrées (11 chatteries, badges Anima-Québec, 7 associations félines, ressources officielles), sans inventer ni surpromettre.",
      en: "Complete redesign mockup for the Cornwall Rex Club of Canada (bilingual nonprofit breeder community). Static multi-page site organised around three journeys: adopt a kitten, become a member breeder, support the club. 10 pages (Home, The Breed, Breeder Directory, Codes & Ethics, By-laws, Publications, Membership, Board & Committees, Contact) with an interactive anatomy explorer, a filterable distribution map and a Red & White identity derived from the official logo. Bilingual FR/EN with instant toggle, light/dark theme, mobile-first (375px → desktop), WCAG 2.2 AA accessibility, no backend. Real data integrated (11 catteries, Anima-Québec badges, 7 feline associations, official resources), without inventing or overpromising."
    },
    metrics: {
      fr: ["10 pages · bilingue FR/EN", "Explorateur d'anatomie (10 parties)", "11 chatteries · données réelles", "WCAG 2.2 AA · clair/sombre"],
      en: ["10 pages · bilingual FR/EN", "Anatomy explorer (10 parts)", "11 catteries · real data", "WCAG 2.2 AA · light/dark"]
    },
    media: { enabled: true, type: "image", src: "/media/crcc.png" }
  },
  {
    id: "financej",
    year: "2026",
    status: { fr: "Académique · ÉTS", en: "Academic · ÉTS" },
    name: "FinanceJ",
    pitch: {
      fr: "Application Java de finances personnelles, cours LOG240 en équipe de 6 : 133 tests, 100 % de couverture, et le plus grand nombre de commits de l'équipe.",
      en: "A Java personal-finance app, LOG240 course, team of 6: 133 tests, 100% coverage, and the most commits on the team.",
    },
    tag: { fr: "App desktop de finances personnelles", en: "Personal finance desktop app" },
    stack: ["Java 21", "Maven", "Java Swing", "Apache Derby", "JUnit 4", "AssertJ Swing", "JaCoCo", "Checkstyle", "PMD", "QALab"],
    summary: {
      fr: "Application desktop Java de gestion de finances personnelles (revenus, dépenses, budgets). Équipe de 6 développeurs, cours LOG240 (Tests et Maintenance). 5 250+ LOC, 133 tests (100% couverture JaCoCo), 85 commits. Architecture MVC avec Singleton, DAO et AbstractTableModel. Contributeur le plus actif (28 commits).",
      en: "Java desktop personal finance app (income, expenses, budgets). Team of 6 developers, LOG240 course (Testing & Maintenance). 5,250+ LOC, 133 tests (100% JaCoCo coverage), 85 commits. MVC architecture with Singleton, DAO and AbstractTableModel patterns. Most active contributor (28 commits)."
    },
    metrics: {
      fr: ["5 250+ lignes de code", "133 tests · 100 % de couverture", "85 commits · 6 développeurs", "28 commits (premier contributeur)"],
      en: ["5,250+ LOC", "133 tests · 100% coverage", "85 commits · 6 devs", "28 commits (top contributor)"]
    },
    media: { enabled: true, type: "video", src: "/media/financej.mp4" }
  },
  {
    id: "tatzy",
    year: "2025 · 2026",
    status: { fr: "Prototype · Déployé", en: "Prototype · Deployed" },
    name: "Tatzy",
    pitch: {
      fr: "Site de réservation de taxi cofondé avec Aimen Djebbar : monorepo web et API en Next.js, bilingue, déployé. Prototype sans trafic réel pour l'instant.",
      en: "A taxi-booking site co-founded with Aimen Djebbar: Next.js web and API monorepo, bilingual, deployed. A prototype with no real traffic yet.",
    },
    tag: { fr: "Réservation de taxi en ligne · Prototype", en: "Online taxi booking · Prototype" },
    stack: ["Next.js 14", "TypeScript", "Tailwind CSS", "Prisma", "PostgreSQL", "next-intl (FR/EN)", "Zod", "Vercel"],
    summary: {
      fr: "Site de réservation de taxi cofondé avec Aimen Djebbar. Monorepo web + API : page d'accueil, tunnel de réservation et fondations d'une API, en Next.js 14 (App Router) avec Prisma/PostgreSQL, bilingue FR/EN. Le prototype est déployé sur Vercel. Encore au stade prototype, pas de trafic client réel pour l'instant.",
      en: "Taxi-booking site co-founded with Aimen Djebbar. Web + API monorepo: landing page, booking flow and API foundations, in Next.js 14 (App Router) with Prisma/PostgreSQL, bilingual FR/EN. The prototype is deployed on Vercel. Still at prototype stage, no real customer traffic yet."
    },
    metrics: {
      fr: ["Monorepo web + API", "Bilingue FR/EN", "Déployé sur Vercel", "Cofondé (2 personnes)"],
      en: ["Web + API monorepo", "Bilingual FR/EN", "Deployed on Vercel", "Co-founded (2 people)"]
    },
    media: { enabled: true, type: "image", src: "/media/tatzy.jpg" }
  },
  {
    id: "log430",
    year: "2026",
    status: { fr: "Académique · ÉTS", en: "Academic · ÉTS" },
    name: "LOG430 · Architecture logicielle",
    pitch: {
      fr: "Laboratoires d'architecture logicielle à l'ÉTS : la même application passe du monolithe aux microservices événementiels, un patron à la fois.",
      en: "ÉTS software-architecture labs: one application moves from a monolith to event-driven microservices, one pattern at a time.",
    },
    tag: { fr: "Du monolithe aux microservices événementiels", en: "From monolith to event-driven microservices" },
    stack: ["Python", "Flask / FastAPI", "Docker Compose", "PostgreSQL", "Redis", "Apache Kafka", "GraphQL", "Kong / KrakenD", "Prometheus / Grafana"],
    summary: {
      fr: "Série de laboratoires du cours d'architecture logicielle à l'ÉTS : une même application de gestion de magasin est réarchitecturée d'un labo à l'autre. Le parcours va d'un monolithe conteneurisé (Docker, CI/CD) vers du client-serveur avec DAO, du CQRS avec persistance polyglotte (PostgreSQL + Redis), des API REST puis GraphQL, du cache et de la répartition de charge (Nginx, tests de charge Locust), de l'observabilité (Prometheus), puis une décomposition en microservices derrière une passerelle d'API, un microservice de paiement isolé, une saga orchestrée avec traçage distribué (Jaeger), de l'architecture événementielle avec Kafka (event sourcing, saga chorégraphiée, patron Outbox) et enfin des bases de données distribuées (YugabyteDB / CockroachDB). Chaque labo isole un patron sur la même application jouet. Le projet de session, CanTelcoX, est l'endroit où ces patrons sont assemblés dans un seul système sur un domaine métier réel : phase 1 en microservices synchrones (5 services DDD derrière une passerelle Kong en haute disponibilité, cache Redis, observabilité Prometheus/Grafana), Phase 2 en architecture événementielle : voir la fiche dédiée.",
      en: "Lab series from ÉTS's software-architecture course: a single store-management app is re-architected from one lab to the next. The path runs from a containerized monolith (Docker, CI/CD) to client-server with DAO, CQRS with polyglot persistence (PostgreSQL + Redis), REST then GraphQL APIs, caching and load balancing (Nginx, Locust load tests), observability (Prometheus), then a break-up into microservices behind an API gateway, an isolated payment microservice, an orchestrated saga with distributed tracing (Jaeger), event-driven architecture with Kafka (event sourcing, choreographed saga, Outbox pattern) and finally distributed databases (YugabyteDB / CockroachDB). Each lab isolates one pattern on the same toy application. The term project, CanTelcoX, is where those patterns get assembled into a single system on a real business domain, Phase 1 in synchronous microservices (5 DDD services behind a high-availability Kong gateway, Redis caching, Prometheus/Grafana observability), Phase 2 event-driven: see its dedicated entry."
    },
    metrics: {
      fr: ["12 dépôts · monolithe → microservices", "Projet de session : CanTelcoX (fiche dédiée)", "REST · GraphQL · Kafka · Saga", "Observabilité Prometheus/Grafana"],
      en: ["12 repos · monolith → microservices", "Term project: CanTelcoX (own entry)", "REST · GraphQL · Kafka · Saga", "Prometheus/Grafana observability"]
    }
  },
  {
    id: "log210",
    year: "2025",
    status: { fr: "Académique · ÉTS", en: "Academic · ÉTS" },
    name: "LOG210 · Analyse et conception",
    pitch: {
      fr: "Analyse et conception orientée objet à l'ÉTS, en équipe de 6 : modèle du domaine UML, cas d'utilisation, patron Contrôleur et tests Jest.",
      en: "Object-oriented analysis and design at ÉTS, team of 6: UML domain model, use cases, Controller pattern and Jest tests.",
    },
    tag: { fr: "Modélisation UML & conception OO · Équipe", en: "UML modeling & OO design · Team" },
    stack: ["TypeScript", "Node.js", "Express", "Jest", "UML (PlantUML)", "GRASP"],
    summary: {
      fr: "Laboratoire d'analyse et de conception logicielle à l'ÉTS, en équipe de 6. À partir d'un squelette « jeu de dés », l'équipe modélise et implémente une application de gestion de cours et de devoirs : modèle du domaine UML, cas d'utilisation, conception en couches avec le patron GRASP Contrôleur, passerelle/adaptateur vers un backend, et une suite de tests Jest avec couverture. Le tout appuyé par des rapports d'itération.",
      en: "Analysis-and-design lab at ÉTS, in a team of 6. Starting from a \"dice game\" skeleton, the team models and builds a course-and-assignment management app: UML domain model, use cases, layered design with the GRASP Controller pattern, a gateway/adapter to a backend, and a Jest test suite with coverage. Backed by iteration reports."
    },
    metrics: {
      fr: ["Équipe de 6 · GitHub Classroom", "Modèle du domaine UML · cas d'usage", "Patron GRASP Contrôleur", "Tests Jest avec couverture"],
      en: ["Team of 6 · GitHub Classroom", "UML domain model · use cases", "GRASP Controller pattern", "Jest tests with coverage"]
    }
  },
  {
    id: "gti350",
    year: "2026",
    status: { fr: "Académique · ÉTS", en: "Academic · ÉTS" },
    name: "Tron Light Cycles · GTI350",
    pitch: {
      fr: "Jeu Tron à 2 joueurs en JavaScript natif pour le cours d'interfaces : canevas HTML5, clavier et gestes à la souris, 9 modules.",
      en: "A two-player Tron game in plain JavaScript for the user-interfaces course: HTML5 canvas, keyboard and mouse gestures, 9 modules.",
    },
    tag: { fr: "Jeu 2 joueurs · Interfaces & manipulation directe · Équipe", en: "2-player game · UI & direct manipulation · Team" },
    stack: ["JavaScript (vanilla)", "Canvas HTML5", "Modules ES6", "HTML/CSS"],
    summary: {
      fr: "Jeu « Tron » 2 joueurs codé en JavaScript vanilla (sans librairie) pour le cours d'interfaces utilisateurs à l'ÉTS, en équipe de 2. Rendu sur Canvas HTML5, deux modes d'entrée (clavier avec gestion QWERTY/AZERTY et gestes de souris pour diriger la moto directement sur le canvas), détection de collisions (traînées + murs), score multi-manches, boutons virtuels pause/reprise/redémarrage et accélération progressive. Architecture modulaire (9 modules à responsabilité unique) pensée pour le travail en parallèle sur Git.",
      en: "Two-player \"Tron\" game written in vanilla JavaScript (no libraries) for ÉTS's user-interfaces course, in a team of 2. Rendered on an HTML5 Canvas, two input modes (keyboard with QWERTY/AZERTY handling, and mouse gestures to steer the cycle directly on the canvas), collision detection (trails + walls), multi-round scoring, virtual pause/resume/restart buttons and progressive acceleration. Modular architecture (9 single-responsibility modules) designed for parallel work on Git."
    },
    metrics: {
      fr: ["Vanilla JS · Canvas HTML5", "2 modes d'entrée (clavier + souris)", "9 modules · ~460 lignes", "Équipe de 2"],
      en: ["Vanilla JS · HTML5 Canvas", "2 input modes (keyboard + mouse)", "9 modules · ~460 lines", "Team of 2"]
    },
    media: { enabled: true, type: "image", src: "/media/gti350.jpg" }
  }
]

/** Canonical order (projects page, recruiter view, SYS numbers). Featured first. */
const PROJECT_ORDER = [
  "the-mad-space",
  "cantelcox",
  "cadence",
  "dpm-elevate",
  "wise-wealthy",
  "vibe",
  "kim-dubois",
  "boa-traiteur",
  "crcc",
  "financej",
  "tatzy",
  "log430",
  "log210",
  "gti350",
]
projects.sort((a, b) => PROJECT_ORDER.indexOf(a.id) - PROJECT_ORDER.indexOf(b.id))

/** Home "Systèmes" featured trio (design spec 2026-07-29: 3 complementary projects). */
export const FEATURED_IDS: string[] = ["the-mad-space", "cantelcox", "cadence"]

/** Same SYS-XX number on every page (home, projects, case study, recruiter view). */
export const sysNumber = (id: string): string =>
  String(projects.findIndex((p) => p.id === id) + 1).padStart(2, "0")

/** Short card copy, falling back to the long summary. */
export const pitchOf = (p: Project, locale: "fr" | "en"): string => p.pitch?.[locale] ?? p.summary[locale]

/** Delivery state per project — drives the status pill, its dot colour and the
 *  filter on the projects page. Explicit map (not derived from status strings)
 *  so each project's stage is intentional. */
export type ProjectState = "production" | "development" | "prototype" | "planned" | "academic"

export const projectStates: Record<string, ProjectState> = {
  "the-mad-space": "production",
  "cadence": "development",
  "vibe": "prototype",
  "dpm-elevate": "development",
  "wise-wealthy": "prototype",
  "kim-dubois": "prototype",
  "boa-traiteur": "prototype",
  "crcc": "prototype",
  "cantelcox": "academic",
  "financej": "academic",
  "tatzy": "prototype",
  "log430": "academic",
  "log210": "academic",
  "gti350": "academic",
}

/** Display / filter order. */
export const STATE_ORDER: ProjectState[] = ["production", "development", "prototype", "academic", "planned"]

/** Dot / accent colour per state (production=green, development=amber,
 *  prototype & planned=blue). */
export const stateColor: Record<ProjectState, string> = {
  production: "var(--shipped)",
  development: "var(--active)",
  prototype: "var(--planned)",
  planned: "var(--planned)",
  academic: "var(--muted-foreground)",
}

export const projectState = (id: string): ProjectState => projectStates[id] ?? "prototype"
/** Dot colour for a project's state (name kept for existing call sites). */
export const toneColor = (id: string): string => stateColor[projectState(id)]

/** Context / relationship to each project — how I was involved. Drives the
 *  role-type badge and the "by role" filter on the projects page. Distinct from
 *  `projectStates` (delivery stage): this is *who I was* on the project.
 *  `academic` = ÉTS / college coursework; `personal` = solo side project. */
export type ProjectType = "cofounder" | "founder" | "client" | "academic" | "personal"

export const projectTypes: Record<string, ProjectType> = {
  "the-mad-space": "client", // contract (CV: Oct. 2025 to Mar. 2026), technical lead
  "cadence": "cofounder", // co-founded with Alexandre
  "vibe": "cofounder",
  "dpm-elevate": "founder", // sole founder — personal venture
  "wise-wealthy": "cofounder",
  "kim-dubois": "client", // first paying client
  "boa-traiteur": "client", // client mandate (chef Max)
  "crcc": "client", // nonprofit redesign mandate
  "cantelcox": "academic", // ÉTS LOG430 term project — team of 5, I signed 60 of 97 commits
  "financej": "academic", // ÉTS LOG240, team of 6
  "tatzy": "cofounder", // co-founded with Aimen
  "log430": "academic", // ÉTS LOG430 (mostly solo)
  "log210": "academic", // ÉTS LOG210, team of 6
  "gti350": "academic", // ÉTS GTI350, team of 2
}

/** Filter / display order for the role-type chips. */
export const TYPE_ORDER: ProjectType[] = ["cofounder", "founder", "client", "academic", "personal"]

/** Accent colour per type (echoes the v2 badge treatment; kept visually
 *  distinct from the state dots via the badge's icon + tinted pill). */
export const typeColor: Record<ProjectType, string> = {
  cofounder: "var(--accent)",
  founder: "var(--active)",
  client: "var(--planned)",
  academic: "var(--muted-foreground)",
  personal: "var(--shipped)",
}

export const projectType = (id: string): ProjectType => projectTypes[id] ?? "personal"

export const caseStudyIds = new Set([
  "the-mad-space",
  "cadence",
  "vibe",
  "dpm-elevate",
  "wise-wealthy",
  "kim-dubois",
  "boa-traiteur",
  "crcc",
  "cantelcox",
  "financej",
  "tatzy",
  "log430",
  "log210",
  "gti350",
])

/** Role per project, used in project detail meta strip */
export const projectRoles: Record<string, { fr: string; en: string }> = {
  "the-mad-space": { fr: "Développeur full-stack (contrat) · responsable de la technique", en: "Full-stack developer (contract) · technical lead" },
  "cadence": { fr: "Cofondateur · responsable technique", en: "Co-founder · Tech lead" },
  "vibe": { fr: "Cofondateur · conception produit et prototypage", en: "Co-founder · Product design and prototyping" },
  "dpm-elevate": { fr: "Fondateur · Design & Prototypage", en: "Founder · Design & Prototyping" },
  "wise-wealthy": { fr: "Conception produit · Modèle d'affaires & Prototypage", en: "Product Design · Business Model & Prototyping" },
  "kim-dubois": { fr: "Freelance · Design, Prototypage & Relation client", en: "Freelance · Design, Prototyping & Client Relations" },
  "boa-traiteur": { fr: "Freelance · Design produit, Prototypage & Relation client", en: "Freelance · Product Design, Prototyping & Client Relations" },
  "crcc": { fr: "Design & Prototypage (Refonte)", en: "Design & Prototyping (Redesign)" },
  "cantelcox": { fr: "Architecture & développement · 60 des 97 commits (Projet de session, LOG430)", en: "Architecture & development · 60 of 97 commits (Term project: LOG430)" },
  "financej": { fr: "Développeur · Top contributeur (Projet académique : LOG240)", en: "Developer · Top contributor (Academic Project: LOG240)" },
}

/** External links per project (shown on detail page) */
export const projectLinks: Record<string, { label: string; url: string; type: "github" | "live" | "demo" }[]> = {
  "tatzy": [
    { label: "Démo live", url: "https://tatzy-taxi.vercel.app", type: "live" },
    { label: "GitHub", url: "https://github.com/ralphgabriel04/tatzy-taxi", type: "github" },
  ],
  "cantelcox": [
    { label: "GitHub", url: "https://github.com/ralphgabriel04/cantelcox-bss-event-driven", type: "github" },
  ],
  "log430": [
    { label: "Labo REST & GraphQL", url: "https://github.com/ralphgabriel04/Labo-03-REST-APIs-GraphQL", type: "github" },
    { label: "Labo événementiel (Kafka)", url: "https://github.com/ralphgabriel04/log430-labo8", type: "github" },
  ],
  "log210": [
    { label: "GitHub", url: "https://github.com/ralphgabriel04/laboratoire-01-log210-a25-equipe-210-detached", type: "github" },
  ],
  "gti350": [
    { label: "Jouer en ligne", url: "/gti350/index.html", type: "live" },
    { label: "GitHub", url: "https://github.com/ralphgabriel04/gti350-lab1-tron-light-cycles", type: "github" },
  ],
  "the-mad-space": [
    { label: "Live", url: "https://themadspace.com", type: "live" },
  ],
  "cadence": [
    { label: "Landing page", url: "https://cadence-web-fawn.vercel.app", type: "live" },
    { label: "GitHub", url: "https://github.com/ralphgabriel04/cadence-mobile", type: "github" },
  ],
  "vibe": [
    { label: "Maquette live (mobile)", url: "/vibe/index.html", type: "live" },
    { label: "Version web / bureau", url: "/vibe/Vibe%20Web.dc.html", type: "demo" },
    { label: "Composant fiche lieu", url: "/vibe/PlaceCard.dc.html", type: "demo" },
  ],
  "dpm-elevate": [
    { label: "App live", url: "https://dpm-calendar.vercel.app", type: "live" },
    { label: "GitHub", url: "https://github.com/ralphgabriel04/dpm-calendar", type: "github" },
    { label: "Maquette (design)", url: "/dpm-elevate/index.html", type: "demo" },
  ],
  "wise-wealthy": [
    { label: "Maquette live (app adulte)", url: "/wise-wealthy/index.html", type: "live" },
    { label: "Mes finances", url: "/wise-wealthy/Finances.dc.html", type: "demo" },
    { label: "Wise & Wealthy Kids", url: "/wise-wealthy/Wise%20%26%20Wealthy%20Kids.dc.html", type: "demo" },
    { label: "Espace Famille", url: "/wise-wealthy/Espace%20Famille.dc.html", type: "demo" },
    { label: "App adulte: ancienne version (archive V7)", url: "/wise-wealthy/Wise%20%26%20Wealthy%20(archive%20V7).dc.html", type: "demo" },
  ],
  "crcc": [
    { label: "Maquette live", url: "/crcc/index.html", type: "live" },
    { label: "Site actuel", url: "https://club-crcc.ca", type: "demo" },
  ],
  "kim-dubois": [
    { label: "Maquette live", url: "/kim-dubois/index.html", type: "live" },
    { label: "Instagram", url: "https://www.instagram.com/kimduboisphotographeanimaliere/", type: "demo" },
  ],
  "boa-traiteur": [
    { label: "Maquette live", url: "/boa-traiteur/index.html", type: "live" },
  ],
}

/** Extra animated previews shown as a gallery on the detail page (beyond the hero media) */
export const projectGalleries: Record<string, { src: string; caption: { fr: string; en: string } }[]> = {
  "vibe": [
    {
      src: "/media/vibe-accueil.jpg",
      caption: { fr: "Accueil par ambiance : « Quelle est ta vibe ce soir ? »", en: "Mood-first home: \"What's your vibe tonight?\"" },
    },
    {
      src: "/media/vibe-stm.jpg",
      caption: { fr: "STM Pulse : carte du métro interactive (mobile)", en: "STM Pulse: interactive metro map (mobile)" },
    },
    {
      src: "/media/vibe-ai.jpg",
      caption: { fr: "Vibe AI: assistant conversationnel", en: "Vibe AI: conversational assistant" },
    },
    {
      src: "/media/vibe-lieu.jpg",
      caption: { fr: "Fiche lieu enrichie: % match, budget, temps de marche", en: "Enriched place page: % match, budget, walking time" },
    },
    {
      src: "/media/vibe-web.jpg",
      caption: { fr: "Explorer: version web / bureau", en: "Explore: web / desktop version" },
    },
  ],
  "wise-wealthy": [
    {
      src: "/media/ww-screen-1.jpg",
      caption: { fr: "Onboarding : le coach Wiz t'accueille", en: "Onboarding: meet your coach Wiz" },
    },
    {
      src: "/media/ww-screen-2.jpg",
      caption: { fr: "Wiz, ton coach financier de poche", en: "Wiz, your pocket money coach" },
    },
    {
      src: "/media/ww-screen-3.jpg",
      caption: { fr: "Confidentialité : tes données protégées (Loi 25)", en: "Privacy: your data protected (Loi 25)" },
    },
    {
      src: "/media/ww-screen-4.jpg",
      caption: { fr: "Création de compte : courriel, Google ou Apple", en: "Sign-up: email, Google or Apple" },
    },
    {
      src: "/media/wise-wealthy-kids.mp4",
      caption: { fr: "Wise & Wealthy Kids : app ludique pour enfants", en: "Wise & Wealthy Kids: playful app for children" },
    },
    {
      src: "/media/wise-wealthy-famille.mp4",
      caption: { fr: "Espace Famille: verrou parent (Face ID / code PIN)", en: "Family Space: parent lock (Face ID / PIN code)" },
    },
  ],
}
