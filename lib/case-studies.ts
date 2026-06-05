export interface CaseStudySection {
  title: string
  body?: string
  items?: string[]
  type: "text" | "list"
}

export interface CaseStudy {
  fr: Record<string, CaseStudySection>
  en: Record<string, CaseStudySection>
}

export const caseStudies: Record<string, CaseStudy> = {
  "cadence": {
    fr: {
      problem: {
        title: "Le problème",
        body: "Les solutions de coaching sportif existantes (TrueCoach, Trainerize, Everfit) sont anglophones avec des traductions françaises approximatives. Les coachs de musculation francophones perdent du temps à naviguer dans des interfaces pensées en anglais. Côté athlète, l'expérience mobile est souvent cassée : pas de readiness check intégré, pas de PRs auto-détectés, pas de timer de repos natif. L'engagement chute après 30 jours dans 80% des solutions du marché.",
        type: "text"
      },
      constraints: {
        title: "Les contraintes",
        body: "Bilatéralité mobile native : coach ET athlète doivent avoir une expérience complète sur mobile, pas de \"use desktop for programming\". Français natif, pas un filtre i18n appliqué après coup. UI conçue en français québécois. Sécurité non-négociable dès le Sprint 1 : données de santé (readiness, blessures, poids) soumises à Loi 25 + PIPEDA + GDPR-ready. Bootstrap sans financement externe. Beachhead strict : 50 coachs payants + NPS > 40 + rétention M3 > 70% avant d'élargir.",
        type: "text"
      },
      approach: {
        title: "La solution",
        body: "Architecture mobile-first avec Expo SDK 52+ (React Native), TypeScript strict et NativeWind. Supabase pour l'auth, la base de données Postgres et le RLS sur 100% des tables dès le Sprint 1. Landing page Next.js avec waitlist active. Audit concurrentiel exhaustif de 8+ apps (TrueCoach, Trainerize, TrainHeroic, Everfit, Hevy, CoachNow, TeamBuildr, PT Distinction) pour identifier les gaps. 169+ issues GitHub structurées avec critères d'acceptation détaillés et user flows écran par écran. Alexandre (co-fondateur design) travaille toujours 1 sprint en avance sur les maquettes Figma. Tests utilisateurs planifiés aux Sprints 3, 5, 7, 9.",
        type: "text"
      },
      stack: {
        title: "Stack technique",
        items: ["Expo SDK 52+ (React Native)", "TypeScript strict", "NativeWind", "EAS Build", "Supabase (auth + DB + RLS)", "Next.js (landing page)", "Sentry", "PostHog", "Detox/Maestro (E2E)"],
        type: "list"
      },
      outcomes: {
        title: "Résultats",
        body: "169+ issues GitHub structurées sur 2 repos (41 cadence-mobile + 128+ the-project). 13 sprints planifiés avec versioning rigoureux (alpha → beta → RC → prod). 74/74 features marché couvertes après audit (100% coverage sur 7 piliers fonctionnels). 36 issues feature avec user flows complets écran par écran. 10 principes fondamentaux documentés comme filtres de décision. Sécurité by design : RLS Sprint 1, chiffrement AES-256 at-rest, TLS 1.3, JWT short-lived, audit OWASP Mobile Top 10 planifié pré-beta.",
        type: "text"
      },
      learnings: {
        title: "Apprentissages",
        body: "Planifier comme Tech Lead change tout. Faire 90% de la planification AVANT le code donne moins de surprises, un scope plus clair et de la dette technique évitée. La discipline \"si c'est pas MVP, c'est plus tard\" a réduit le scope de ~40 features à ~25 features chirurgicales. Le co-fondateur design en avance d'un sprint élimine les blocages : les maquettes Figma sont prêtes quand le dev arrive. Les 10 principes fondamentaux (Athlete-First, Ship > Perfect, Data > Opinions) servent de filtres de décision qui évitent les débats stériles.",
        type: "text"
      }
    },
    en: {
      problem: {
        title: "The problem",
        body: "Existing sports coaching solutions (TrueCoach, Trainerize, Everfit) are English-first with approximate French translations. Francophone gym coaches waste time navigating interfaces designed in English. On the athlete side, the mobile experience is often broken: no integrated readiness check, no auto-detected PRs, no native rest timer. Engagement drops after 30 days in 80% of market solutions.",
        type: "text"
      },
      constraints: {
        title: "Constraints",
        body: "Native mobile bilaterality: both coach AND athlete must have a complete mobile experience, no \"use desktop for programming\". Native French, not an i18n filter applied after the fact. UI designed in Quebec French. Non-negotiable security from Sprint 1: health data (readiness, injuries, weight) subject to Loi 25 + PIPEDA + GDPR-ready. Bootstrap with no external funding. Strict beachhead: 50 paying coaches + NPS > 40 + M3 retention > 70% before expanding.",
        type: "text"
      },
      approach: {
        title: "The solution",
        body: "Mobile-first architecture with Expo SDK 52+ (React Native), strict TypeScript and NativeWind. Supabase for auth, Postgres database and RLS on 100% of tables from Sprint 1. Next.js landing page with active waitlist. Exhaustive competitive audit of 8+ apps (TrueCoach, Trainerize, TrainHeroic, Everfit, Hevy, CoachNow, TeamBuildr, PT Distinction) to identify gaps. 169+ structured GitHub issues with detailed acceptance criteria and screen-by-screen user flows. Alexandre (design co-founder) always works 1 sprint ahead on Figma mockups. User testing planned at Sprints 3, 5, 7, 9.",
        type: "text"
      },
      stack: {
        title: "Tech stack",
        items: ["Expo SDK 52+ (React Native)", "TypeScript strict", "NativeWind", "EAS Build", "Supabase (auth + DB + RLS)", "Next.js (landing page)", "Sentry", "PostHog", "Detox/Maestro (E2E)"],
        type: "list"
      },
      outcomes: {
        title: "Outcomes",
        body: "169+ GitHub issues structured across 2 repos (41 cadence-mobile + 128+ the-project). 13 sprints planned with rigorous versioning (alpha → beta → RC → prod). 74/74 market features covered after audit (100% coverage across 7 functional pillars). 36 feature issues with complete screen-by-screen user flows. 10 foundational principles documented as decision filters. Security by design: Sprint 1 RLS, AES-256 encryption at-rest, TLS 1.3, short-lived JWTs, OWASP Mobile Top 10 audit planned pre-beta.",
        type: "text"
      },
      learnings: {
        title: "Learnings",
        body: "Planning as a Tech Lead changes everything. Doing 90% of planning BEFORE code means fewer surprises, clearer scope and avoided tech debt. The discipline of \"if it's not MVP, it's later\" reduced scope from ~40 features to ~25 surgical ones. Having the design co-founder one sprint ahead eliminates blockers: Figma mockups are ready when dev arrives. The 10 foundational principles (Athlete-First, Ship > Perfect, Data > Opinions) serve as decision filters that prevent unproductive debates.",
        type: "text"
      }
    }
  },
  "fastercom-tms": {
    fr: {
      problem: {
        title: "Le problème",
        body: "Chaque client TMS a des exigences de configuration uniques dans des environnements hétérogènes. L'intégration B2B dans le domaine du transport nécessite une flexibilité extrême pour s'adapter aux processus métier spécifiques de chaque entreprise, tout en maintenant une base de code commune.",
        type: "text"
      },
      constraints: {
        title: "Les contraintes",
        body: "NDA partiel limitant les détails partageables. Stack imposée : Spring Boot côté back-end, Angular côté front-end. Pipeline GitLab CI/CD obligatoire avec déploiement sur 3 environnements (Test, Dev, Production). Intégration Google Maps pour le géocodage des adresses.",
        type: "text"
      },
      approach: {
        title: "La solution",
        body: "Configuration pilotée par base de données permettant d'adapter le comportement du TMS par client sans modification de code. Intégration du géocodage Google Maps pour la validation et l'enrichissement des adresses. Pipeline de déploiement en 3 étapes avec promotion manuelle entre les environnements pour garantir la stabilité en production.",
        type: "text"
      },
      stack: {
        title: "Stack technique",
        items: ["Spring Boot", "Angular", "GitLab CI/CD", "Google Maps API", "PostgreSQL"],
        type: "list"
      },
      outcomes: {
        title: "Résultats",
        body: "Pipeline Test → Dev → Production opérationnel et stable. Géocodage Google Maps intégré pour la validation d'adresses. Configuration par client fonctionnelle sans modification du code source.",
        type: "text"
      },
      learnings: {
        title: "Apprentissages",
        body: "L'intégration B2B exige une flexibilité de configuration extrême par client. Un système de configuration piloté par la base de données est indispensable quand chaque client a des règles métier distinctes. La promotion manuelle entre environnements, bien que plus lente, offre une sécurité critique en contexte enterprise.",
        type: "text"
      }
    },
    en: {
      problem: {
        title: "The problem",
        body: "Each TMS client has unique configuration requirements in heterogeneous environments. B2B integration in the transport domain requires extreme flexibility to adapt to each company's specific business processes while maintaining a shared codebase.",
        type: "text"
      },
      constraints: {
        title: "Constraints",
        body: "Partial NDA limiting shareable details. Imposed stack: Spring Boot on the back-end, Angular on the front-end. Mandatory GitLab CI/CD pipeline with 3-environment deployment (Test, Dev, Production). Google Maps integration for address geocoding.",
        type: "text"
      },
      approach: {
        title: "The solution",
        body: "Database-driven configuration enabling per-client TMS behavior without code changes. Google Maps geocoding integration for address validation and enrichment. 3-stage deployment pipeline with manual promotion between environments to ensure production stability.",
        type: "text"
      },
      stack: {
        title: "Tech stack",
        items: ["Spring Boot", "Angular", "GitLab CI/CD", "Google Maps API", "PostgreSQL"],
        type: "list"
      },
      outcomes: {
        title: "Outcomes",
        body: "Test → Dev → Production pipeline operational and stable. Google Maps geocoding integrated for address validation. Per-client configuration working without source code modifications.",
        type: "text"
      },
      learnings: {
        title: "Learnings",
        body: "B2B integration demands extreme per-client configuration flexibility. A database-driven configuration system is essential when each client has distinct business rules. Manual promotion between environments, while slower, provides critical safety in an enterprise context.",
        type: "text"
      }
    }
  },
  "dpm-elevate": {
    fr: {
      problem: {
        title: "Le problème",
        body: "Les outils de productivité sont fragmentés. Le calendrier vit dans une app, les tâches dans une autre, les habitudes dans une troisième, les objectifs dans un carnet. Les gens jonglent entre quatre ou cinq outils et ne voient jamais leur journée comme un tout — encore moins comment leur énergie, leur sommeil et leur comportement la façonnent. Aucun produit grand public n'unifie planification quotidienne, énergie et bien-être, habitudes, objectifs SMART et automatisation derrière une interface unique, cohérente et bilingue. Avant d'engager un backend complet, il fallait prouver l'expérience et les workflows — d'où le pari d'un prototype interactif haute-fidélité de bout en bout plutôt qu'un deck de specs.",
        type: "text"
      },
      constraints: {
        title: "Les contraintes",
        body: "Des contraintes auto-imposées ont gardé le travail rapide et honnête. Aucun build system : React 18 + Babel Standalone dans le navigateur (CDN) — zéro config, itération instantanée. Bilingue dès le jour 1 : FR/EN intégré au premier écran (~130 clés), jamais ajouté après coup. Deux viewports dans une seule app : desktop et un mobile simulé 390×844, commutables en direct. Accessibilité non négociable WCAG AA : contrastes vérifiés (le violet de marque s'assombrit à #7c3aed sur les boutons pleins pour dépasser 4.5:1), prefers-reduced-motion respecté, focus rings visibles. Design system avant les pages : tokens et composants d'abord, écrans ensuite — jamais l'inverse. État jetable : tout en mémoire, aucune persistance — le prototype est jetable, seuls les apprentissages UX sont conservés.",
        type: "text"
      },
      approach: {
        title: "La solution",
        body: "Une architecture de prototype choisie pour la vitesse d'itération plutôt que la pureté de production : React 18 (UMD) + Babel Standalone pour la transpilation en navigateur, Tailwind via CDN, et une couche de tokens en CSS Custom Properties. Une couche d'état pub/sub maison : window.* comme source de vérité + CustomEvent pour la notification + hooks React pour l'abonnement, le tout canalisé via une factory makeStore() unique. 30+ fichiers source structurés par domaine : une couche design-system (ui.jsx, 20+ composants), un runtime i18n, des stores domaine (Habits / Goals / Rules / Notes / Events), des couches de modales, un app shell, et des pages auth, dashboard, calendrier, tâches et tracking. Un Tweaks Panel flottant et draggable pour sauter d'un écran à l'autre, basculer thème / langue / viewport et forcer les empty states à la demande — l'outil le plus utile pour le dogfooding et les démos. Le vrai différenciateur vit sous la surface : un moteur de science comportementale — modélisation chronotype & énergie, intentions d'implémentation (MCII), anti-procrastination type CBT — exposé en suggestions actionnables au cœur du flux de planification, pas dans une page d'analytics séparée.",
        type: "text"
      },
      stack: {
        title: "Stack technique",
        items: ["React 18.3.1 (CDN UMD)", "Babel Standalone 7.29 (transpilation navigateur)", "Tailwind CSS (CDN)", "CSS Custom Properties (design tokens)", "Pattern pub/sub maison (window.* + CustomEvent)", "postMessage (communication hôte)", "Inter + JetBrains Mono + Instrument Serif", "i18n FR/EN (~130 clés)", "WCAG AA"],
        type: "list"
      },
      outcomes: {
        title: "Résultats",
        body: "Une surface de produit cohérente et démontrable : 14 écrans fonctionnels — landing, login mock-OAuth, onboarding 4 étapes, dashboard avec check-in énergie et log de sommeil, planification quotidienne en 6 étapes, focus Pomodoro, calendrier multi-vues (arbre de calendriers 2 niveaux, clic-pour-créer événements & tâches avec aperçu live de la plage horaire), tâches en 5 vues (Liste, Kanban avec animations de complétion par colonne, Gantt, Calendrier et Stats), matrice Eisenhower avec drag & drop, habitudes avec heatmap et streaks, objectifs SMART, règles d'automatisation (4 déclencheurs × 5 actions avec conditions JSON), énergie & sommeil alimentant le modèle de chronotype, et analytics injectant un conseil actionnable dans la planification. Nouveaux modules : Espaces (partage granulaire par module, titre dynamique, bien-être privé par défaut) et Appareils connectés (wearables alimentant énergie/récupération). Le tout sur un design system complet : 20+ composants réutilisables (Button — 6 variantes × 5 tailles, Card, Badge — 7 variantes, Input, Switch, Avatar, Ring SVG…), 40+ icônes SVG inline, et une palette de 12 couleurs calibrée dark mode. Le prototype live tourne avec changement de langue instantané et basculement desktop / mobile.",
        type: "text"
      },
      learnings: {
        title: "Apprentissages",
        body: "Le prototypage haute-fidélité avant le backend a validé les décisions qui comptaient le plus — le wizard de planification quotidienne en 6 étapes, le check-in énergie et l'arbre de calendriers 2 niveaux. Le pattern pub/sub maison a suffi pour un prototype complexe — et ses limites (globals partout, pas de modules) marquent clairement où une vraie architecture devient nécessaire en production. Construire le design system avant les pages a accéléré les 14 écrans : chaque nouvelle page réutilise les mêmes blocs. Le Tweaks Panel (navigation + thème + langue + viewport + empty states) s'est rentabilisé immédiatement pour le dogfooding et les démos. La leçon la plus honnête : la largeur a été conçue en amont des vrais utilisateurs. Le prochain test n'est pas un écran de plus — c'est mettre le produit devant des gens et laisser leur feedback décider de ce qui mérite sa place.",
        type: "text"
      }
    },
    en: {
      problem: {
        title: "The problem",
        body: "Productivity tools are fragmented. The calendar lives in one app, tasks in another, habits in a third, goals in a notebook. People juggle four or five tools and still never see their day as a whole — let alone how their energy, sleep and behaviour shape it. No mainstream product unifies daily planning, energy and well-being, habits, SMART goals and automation behind a single coherent, bilingual interface. Before committing to a full backend, the experience and the workflows had to be proven — so the bet was a high-fidelity, end-to-end interactive prototype rather than a spec deck.",
        type: "text"
      },
      constraints: {
        title: "Constraints",
        body: "Self-imposed constraints kept the work fast and honest. No build system: React 18 + Babel Standalone in the browser (CDN) — zero config, instant iteration. Bilingual from day one: FR / EN baked into the first screen (~130 translation keys), never bolted on afterwards. Two viewports in one app: desktop and a simulated 390×844 mobile, switchable live. Accessibility non-negotiable at WCAG AA: verified contrasts (the brand violet darkens to #7c3aed on solid buttons to clear 4.5:1), prefers-reduced-motion respected, visible focus rings. Design system before pages: tokens and components first, screens second — never the reverse. Disposable state: everything in memory, no persistence — the prototype is throwaway, only the UX learnings are kept.",
        type: "text"
      },
      approach: {
        title: "The solution",
        body: "A prototype architecture chosen for speed of iteration over production purity: React 18 (UMD) + Babel Standalone for in-browser transpilation, Tailwind via CDN, and a token layer in CSS Custom Properties. A custom pub/sub state layer: window.* as the source of truth + CustomEvent for notification + React hooks for subscription, all funnelled through a single makeStore() factory. 30+ source files structured by domain: a design-system layer (ui.jsx, 20+ components), an i18n runtime, domain stores (Habits / Goals / Rules / Notes / Events), modal layers, an app shell, and pages for auth, dashboard, calendar, tasks and tracking. A floating, draggable Tweaks Panel to jump across every screen, flip theme / language / viewport, and force empty states on demand — the single most useful tool for dogfooding and demos. The real differentiator lives under the surface: a behavioural-science engine — chronotype & energy modelling, implementation-intentions (MCII), CBT-style anti-procrastination — surfaced as actionable suggestions inside the planning flow, not as a separate analytics page.",
        type: "text"
      },
      stack: {
        title: "Tech stack",
        items: ["React 18.3.1 (CDN UMD)", "Babel Standalone 7.29 (in-browser transpilation)", "Tailwind CSS (CDN)", "CSS Custom Properties (design tokens)", "Custom pub/sub pattern (window.* + CustomEvent)", "postMessage (host comms)", "Inter + JetBrains Mono + Instrument Serif", "i18n FR/EN (~130 keys)", "WCAG AA"],
        type: "list"
      },
      outcomes: {
        title: "Outcomes",
        body: "A cohesive, demoable product surface: 14 functional screens — landing, mock-OAuth login, 4-step onboarding, dashboard with energy check-in and sleep log, 6-step daily planning, Pomodoro focus, multi-view calendar (2-level calendar tree, click-to-create events & tasks with a live time-range preview), tasks across five views (List, Kanban with per-column completion animations, Gantt, Calendar and Stats), Eisenhower matrix with drag & drop, habits with heatmap and streaks, SMART goals, automation rules (4 triggers × 5 actions with JSON conditions), energy & sleep feeding the chronotype model, and analytics injecting an actionable tip into planning. New modules: Spaces (granular per-module sharing, dynamic title, well-being private by default) and Connected devices (wearables feeding energy / recovery). All backed by a complete design system: 20+ reusable components (Button — 6 variants × 5 sizes, Card, Badge — 7 variants, Input, Switch, Avatar, SVG Ring…), 40+ inline SVG icons, and a 12-colour palette calibrated for dark mode. The live prototype runs with instant language switching and a desktop / mobile toggle.",
        type: "text"
      },
      learnings: {
        title: "Learnings",
        body: "High-fidelity prototyping before the backend validated the decisions that mattered most — the 6-step daily-planning wizard, the energy check-in, and the 2-level calendar tree. The custom pub/sub pattern was enough for a complex prototype — and its limits (globals everywhere, no modules) clearly mark where real architecture is needed in production. Building the design system before the pages accelerated all 14 screens: each new page reused the same blocks. The Tweaks Panel (navigation + theme + language + viewport + empty states) paid for itself immediately for dogfooding and demos. The most honest lesson: breadth was designed ahead of real users. The next test isn't another screen — it's putting the product in front of people and letting their feedback decide what earns its place.",
        type: "text"
      }
    }
  },
  "crcc": {
    fr: {
      problem: {
        title: "Le problème",
        body: "Le Club du Rex de Cornouailles du Canada (OSBL bilingue, petite communauté d'éleveurs) disposait d'un site WordPress vieillissant, peu optimisé et difficile à naviguer. Le contenu (éleveurs, codes, standard, règlements, ressources) existait mais était dispersé, et l'expérience ne servait pas clairement ses trois publics : adopter un chaton, devenir éleveur membre, et soutenir le club. Objectif : une maquette de refonte moderne, claire et digne de confiance, fidèle au contenu réel, sans reconstruire le backend.",
        type: "text"
      },
      constraints: {
        title: "Les contraintes",
        body: "Bilingue FR/EN sur tout le contenu, bascule instantanée. Fidélité au site d'origine (vraies coordonnées d'éleveurs, codes, standard, règlements, partenaires, liens) — sans inventer de données ni surpromettre (pas de « portées » fictives, pas de certifications non confirmées). Accessibilité WCAG 2.2 AA, navigation clavier, prefers-reduced-motion. Mobile-first (de 375px au bureau) + thème clair et sombre. Sans backend : maquette statique, données câblées côté client. Respect de l'identité (logo officiel) → palette Rouge & Blanc dérivée du logo, avec contraintes de contraste AA.",
        type: "text"
      },
      approach: {
        title: "La solution",
        body: "Une maquette statique complète, construite dans Claude Design, organisée autour des trois parcours. Pages : Accueil, La race (avec explorateur d'anatomie interactif), Annuaire des éleveurs (coordonnées réelles, badges de confiance, recherche/filtres, carte de répartition), Codes & éthique, Règlements, Publications, Adhésion (Zeffy), Administrateurs & comités, Contact. Éléments distinctifs : système de design en tokens basculé vers une identité Rouge & Blanc + Montserrat ; explorateur d'anatomie bidirectionnel (10 parties du standard) ; carte/tuiles de répartition synchronisées aux filtres ; typologie d'éleveurs + certifications (Anima-Québec réel) ; animation de chargement de marque (le logo se compose puis la feuille d'érable s'illumine) ; version mobile avec menu hamburger accessible. Méthode : audit du site réel (extraction page par page + PDF) → masterprompts ciblés (fidélité/données, anatomie, répartition, identité Rouge & Blanc + Montserrat + spécialités, mobile), avec maquettes intermédiaires validées avant chaque prompt.",
        type: "text"
      },
      stack: {
        title: "Stack technique",
        items: ["Claude Design (génération à partir de masterprompts)", "HTML / CSS / JS statiques, multi-pages", "CSS Custom Properties (design tokens) + thème clair/sombre via [data-theme]", "i18n maison (data-fr/data-en + CRCC.setLang / onLangChange)", "JavaScript vanilla (explorateur anat.js, menu mobile, filtres annuaire, chrome crcc.js)", "Montserrat (Google Fonts + fallback)", "ARIA (aria-expanded, aria-pressed/current)", "Animation de chargement CSS (clip-path + keyframes)", "Liens officiels câblés : Zeffy, PDF (standard, codes), 7 associations félines, ressources (SOQUIJ/MAPAQ/Anima-Québec/labgenvet/UC Davis/Éducaloi/IDENTRAC/SPCA), 2 groupes Facebook"],
        type: "list"
      },
      outcomes: {
        title: "Résultats",
        body: "Maquette complète, bilingue, responsive, clair/sombre, avec l'identité Rouge & Blanc et Montserrat appliquées. Données réelles intégrées : 11 chatteries, badges Anima-Québec, partenaires, standards, ressources, 2 groupes FB. Fonctionnalités phares livrées : explorateur d'anatomie, carte de répartition filtrable, typologie/certifications d'éleveurs, animation de chargement, mention « spécialisé dans… ». Accessibilité AA + reduced-motion. Évaluation interne ≈ 8,5/10 — forces : fidélité des données, design/marque, accessibilité, parcours ; à compléter : articles individualisés, règlements intégraux + version EN, vraies photos, recherche globale. Livrables annexes : masterprompts réutilisables + présentation PPTX/PDF pour le club.",
        type: "text"
      },
      learnings: {
        title: "Apprentissages",
        body: "Séparer le brief de contenu des décisions de design dans les prompts donne de meilleurs résultats (laisser Claude Design choisir layout/composants). Une intention par prompt (passes ciblées) bat un méga-prompt fourre-tout. Ancrer dans le contenu réel (audit page par page, PDF) évite les fausses données et la surpromesse. Valider des maquettes intermédiaires (palette, cartes) avant de lancer un prompt réduit les allers-retours. Accessibilité + bilinguisme dès le départ (tokens, i18n, ARIA, reduced-motion), pas après coup. En passant à une couleur vive, garder le corps de texte en presque-noir et réserver le rouge aux accents (rouge foncé pour les petits liens) pour rester AA. Le dernier pas vers un « vrai site » reste le contenu éditorial + la photographie réelle.",
        type: "text"
      }
    },
    en: {
      problem: {
        title: "The problem",
        body: "The Cornwall Rex Club of Canada (a bilingual nonprofit, a small breeder community) had an ageing WordPress site that was poorly optimised and hard to navigate. The content (breeders, codes, breed standard, by-laws, resources) existed but was scattered, and the experience didn't clearly serve its three audiences: adopt a kitten, become a member breeder, and support the club. Goal: a modern, clear, trustworthy redesign mockup, faithful to the real content, without rebuilding the backend.",
        type: "text"
      },
      constraints: {
        title: "Constraints",
        body: "Bilingual FR/EN across all content, with instant toggle. Fidelity to the original site (real breeder contact details, codes, standard, by-laws, partners, links) — without inventing data or overpromising (no fictional \"litters\", no unconfirmed certifications). WCAG 2.2 AA accessibility, keyboard navigation, prefers-reduced-motion. Mobile-first (from 375px to desktop) + light and dark themes. No backend: static mockup, data wired client-side. Respect for the identity (official logo) → a Red & White palette derived from the logo, under AA contrast constraints.",
        type: "text"
      },
      approach: {
        title: "The solution",
        body: "A complete static mockup, built in Claude Design, organised around the three journeys. Pages: Home, The Breed (with an interactive anatomy explorer), Breeder Directory (real contacts, trust badges, search/filters, distribution map), Codes & Ethics, By-laws, Publications, Membership (Zeffy), Board & Committees, Contact. Distinctive elements: a token-based design system flipped to a Red & White + Montserrat identity; a bidirectional anatomy explorer (10 parts of the standard); distribution map/tiles synced to the filters; breeder typology + certifications (real Anima-Québec); a brand loading animation (the logo assembles, then the maple leaf lights up); a mobile version with an accessible hamburger menu. Method: audit of the real site (page-by-page extraction + PDF) → targeted masterprompts (fidelity/data, anatomy, distribution, Red & White + Montserrat + specialties identity, mobile), with intermediate mockups validated before each prompt.",
        type: "text"
      },
      stack: {
        title: "Tech stack",
        items: ["Claude Design (generation from masterprompts)", "Static HTML / CSS / JS, multi-page", "CSS Custom Properties (design tokens) + light/dark theme via [data-theme]", "Home-grown i18n (data-fr/data-en + CRCC.setLang / onLangChange)", "Vanilla JavaScript (anatomy explorer anat.js, mobile menu, directory filters, chrome crcc.js)", "Montserrat (Google Fonts + fallback)", "ARIA (aria-expanded, aria-pressed/current)", "CSS loading animation (clip-path + keyframes)", "Wired official links: Zeffy, PDFs (standard, codes), 7 feline associations, resources (SOQUIJ/MAPAQ/Anima-Québec/labgenvet/UC Davis/Éducaloi/IDENTRAC/SPCA), 2 Facebook groups"],
        type: "list"
      },
      outcomes: {
        title: "Outcomes",
        body: "A complete mockup — bilingual, responsive, light/dark — with the Red & White identity and Montserrat applied. Real data integrated: 11 catteries, Anima-Québec badges, partners, standards, resources, 2 FB groups. Flagship features delivered: anatomy explorer, filterable distribution map, breeder typology/certifications, loading animation, \"specialised in…\" mention. AA accessibility + reduced-motion. Internal rating ≈ 8.5/10 — strengths: data fidelity, design/brand, accessibility, journeys; to complete: individualised articles, full by-laws + EN version, real photos, global search. Side deliverables: reusable masterprompts + a PPTX/PDF presentation for the club.",
        type: "text"
      },
      learnings: {
        title: "Learnings",
        body: "Separating the content brief from design decisions in prompts yields better results (let Claude Design choose layout/components). One intent per prompt (focused passes) beats a catch-all mega-prompt. Anchoring in real content (page-by-page audit, PDFs) avoids fake data and overpromising. Validating intermediate mockups (palette, cards) before launching a prompt reduces back-and-forth. Accessibility + bilingualism from the start (tokens, i18n, ARIA, reduced-motion), not as an afterthought. When switching to a vivid colour, keep body text near-black and reserve red for accents (dark red for small links) to stay AA. The final step toward a \"real site\" remains editorial content + real photography.",
        type: "text"
      }
    }
  },
  "financej": {
    fr: {
      problem: {
        title: "Le problème",
        body: "Dans le cadre du cours LOG240 (Tests et Maintenance) à l'ÉTS, notre équipe de 6 développeurs devait concevoir une application desktop Java permettant aux utilisateurs de suivre leurs revenus et dépenses par rapport à un budget, sans nécessiter de connaissances en comptabilité. Le défi : livrer une application fiable avec couverture de test complète en ~3,5 mois (janvier – avril 2026).",
        type: "text"
      },
      constraints: {
        title: "Les contraintes",
        body: "Architecture MVC imposée avec Java Swing. Base de données embarquée Apache Derby (pas de serveur externe). Pipeline Maven avec portes de qualité obligatoires (Checkstyle, PMD, JaCoCo). Objectif de 100% de couverture de code. Tests d'intégration GUI avec AssertJ Swing (tests boîte noire). Documentation structurée avec classes d'équivalence et défauts identifiés. Git Flow avec branches par développeur/fonctionnalité.",
        type: "text"
      },
      approach: {
        title: "La solution",
        body: "Architecture MVC avec Java Swing, structurée autour de 4 modules fonctionnels : comptes (CRUD + solde et valeur nette en temps réel), catégories/budgets, grand livre de transactions (revenus/dépenses avec association aux comptes, catégories et bénéficiaires), et rapports financiers HTML (sommaire et détaillé). Patrons de conception : Singleton (DerbyUtils — connexion BD), DAO (AccountDAO, CategoryDAO — abstraction d'accès aux données), MVC (Model-View-Controller avec Swing), TableModel (AbstractTableModel pour le binding de données). Pipeline Maven complet avec JUnit 4 pour les tests unitaires, AssertJ Swing pour les tests d'intégration GUI, JaCoCo pour la couverture, et Checkstyle/PMD/QALab pour l'analyse statique et le suivi de qualité.",
        type: "text"
      },
      stack: {
        title: "Stack technique",
        items: ["Java 21", "Maven 3.x", "Java Swing (MVC)", "Apache Derby (embarquée)", "JUnit 4 + AssertJ Swing", "JaCoCo", "Checkstyle", "PMD", "QALab"],
        type: "list"
      },
      outcomes: {
        title: "Résultats",
        body: "5 250+ lignes de code total (13 classes production + 9 classes tests). Ratio test/code de 61% (1 981 / 3 269 LOC). 133 tests unitaires et d'intégration avec objectif de 100% couverture atteint. 85 commits sur le projet, 6 développeurs contributeurs. 4 tables BD (account, category, ledger, beneficiary). Rapports financiers HTML générés (sommaire et détaillé). Git Flow avec branches par développeur/fonctionnalité (ralph/lab4-account, jeremy/lab4-infrastructure, etc.).",
        type: "text"
      },
      learnings: {
        title: "Ma contribution & apprentissages",
        body: "28 commits — contributeur le plus actif du projet. Développement du module Account complet (DAO, TableModel, tests). Intégration des tests pour atteindre 100% de couverture (133/133). Résolution de conflits de fusion et consolidation finale sur main. Apprentissage clé : l'investissement dans les tests d'intégration GUI (AssertJ Swing) capture des bugs que les tests unitaires seuls ne détectent pas — les interactions entre composants Swing révèlent des problèmes de threading et de binding de données invisibles en isolation. L'analyse statique (Checkstyle, PMD) combinée à JaCoCo crée un filet de sécurité complet qui donne confiance pour refactorer sans régression.",
        type: "text"
      }
    },
    en: {
      problem: {
        title: "The problem",
        body: "As part of the LOG240 course (Testing & Maintenance) at ÉTS, our team of 6 developers had to build a Java desktop application allowing users to track income and expenses against a budget, without requiring accounting knowledge. The challenge: deliver a reliable application with complete test coverage in ~3.5 months (January – April 2026).",
        type: "text"
      },
      constraints: {
        title: "Constraints",
        body: "Imposed MVC architecture with Java Swing. Embedded Apache Derby database (no external server). Maven pipeline with mandatory quality gates (Checkstyle, PMD, JaCoCo). 100% code coverage target. GUI integration tests with AssertJ Swing (black-box testing). Structured documentation with equivalence classes and identified defects. Git Flow with per-developer/feature branches.",
        type: "text"
      },
      approach: {
        title: "The solution",
        body: "MVC architecture with Java Swing, structured around 4 functional modules: accounts (CRUD + real-time balance and net worth), categories/budgets, transaction ledger (income/expenses with account, category and beneficiary associations), and HTML financial reports (summary and detailed). Design patterns: Singleton (DerbyUtils — DB connection), DAO (AccountDAO, CategoryDAO — data access abstraction), MVC (Model-View-Controller with Swing), TableModel (AbstractTableModel for data binding). Full Maven pipeline with JUnit 4 for unit testing, AssertJ Swing for GUI integration tests, JaCoCo for coverage, and Checkstyle/PMD/QALab for static analysis and quality tracking.",
        type: "text"
      },
      stack: {
        title: "Tech stack",
        items: ["Java 21", "Maven 3.x", "Java Swing (MVC)", "Apache Derby (embedded)", "JUnit 4 + AssertJ Swing", "JaCoCo", "Checkstyle", "PMD", "QALab"],
        type: "list"
      },
      outcomes: {
        title: "Outcomes",
        body: "5,250+ total lines of code (13 production classes + 9 test classes). Test/code ratio of 61% (1,981 / 3,269 LOC). 133 unit and integration tests with 100% coverage target achieved. 85 commits across the project, 6 contributing developers. 4 DB tables (account, category, ledger, beneficiary). Generated HTML financial reports (summary and detailed). Git Flow with per-developer/feature branches (ralph/lab4-account, jeremy/lab4-infrastructure, etc.).",
        type: "text"
      },
      learnings: {
        title: "My contribution & learnings",
        body: "28 commits — most active contributor on the project. Developed the complete Account module (DAO, TableModel, tests). Integrated tests to reach 100% coverage (133/133). Resolved merge conflicts and final consolidation on main. Key learning: investing in GUI integration tests (AssertJ Swing) catches bugs that unit tests alone miss — interactions between Swing components reveal threading and data binding issues invisible in isolation. Static analysis (Checkstyle, PMD) combined with JaCoCo creates a comprehensive safety net that gives confidence to refactor without regressions.",
        type: "text"
      }
    }
  },
  "the-mad-space": {
    fr: {
      problem: {
        title: "Le problème",
        body: "Le fondateur voulait créer une marketplace où les idées créatives sont valorisées, les artistes vivent de leurs designs, et le partage de profits est transparent (10-20% donneurs d'idées, 20-35% designers). Il fallait gérer 3 rôles utilisateurs (admin, créateur, client), 4 devises (CAD, USD, EUR, GBP), 2 langues (FR, EN) et 7+ intégrations externes, le tout maintenu par un seul ingénieur. La demande initiale était WordPress. J'ai recommandé une stack custom Next.js, justifiée par les besoins en workflows complexes, Edge Functions et multi-devises.",
        type: "text"
      },
      constraints: {
        title: "Les contraintes",
        body: "Délais serrés (~3 mois pour le MVP). Paiements en production dès le lancement : sécurité non négociable. Conformité GDPR, Loi 25 Québec et Loi 96 (bilinguisme) requise dès le jour 1. Documentation en parallèle pour permettre l'onboarding d'un futur 2e développeur. Le client n'avait aucune expertise technique : chaque décision d'architecture devait être expliquée et défendue.",
        type: "text"
      },
      approach: {
        title: "La solution",
        body: "Architecture en couches avec Next.js 16 App Router (Server Components par défaut), Prisma comme couche d'accès avec 10+ modèles relationnels, et des modules métier isolés par workflow. Auth custom session-based avec vérification email 6-digit (rate limiting 3/h, expiration 15 min, max 5 tentatives) et OAuth 2.0 Google avec rotation de refresh token. Stripe Checkout multi-devises avec signature webhook HMAC, Gelato pour le fulfillment automatisé (mockups live, templates, expédition), Google Merchant Center synchronisé via Supabase Edge Functions Deno avec pagination 5/batch. Cookie consent multi-catégories avec chargement conditionnel de GA4 et Google Ads selon consentement. Auto-détection devise par géolocation Vercel/Cloudflare. Bulk upload admin avec color detection intelligente sur pattern de fichiers ZIP (gco_COLORNAME).",
        type: "text"
      },
      stack: {
        title: "Stack technique",
        items: ["Next.js 16 (App Router)", "TypeScript strict", "Prisma + PostgreSQL", "Tailwind CSS 4", "Stripe Checkout", "Gelato (print-on-demand)", "Google Merchant Center (OAuth 2.0)", "GA4 + Google Ads", "Supabase (DB + Storage + Edge Functions Deno)", "Vercel", "Framer Motion"],
        type: "list"
      },
      outcomes: {
        title: "Résultats",
        body: "~15 000 LOC TypeScript en production. 30+ endpoints API REST. 10+ modèles Prisma/PostgreSQL. 17+ pages bilingues complètes. 5 contextes React globaux (theme, cart, currency, cookie consent, auth). 4 workflows métier livrés (commande, retour, inventaire, fidélité) avec 5-7 étapes automatisées par workflow. 20-30 déploiements CI/CD réussis sur Vercel. Latence API 150-300 ms, traitement webhook Stripe→Gelato 300-500 ms. Le traitement d'une commande complexe est passé de ~25 min à ~10 min. Marketplace live sur 2 marchés (Canada + USA) avec profit-sharing fonctionnel.",
        type: "text"
      },
      learnings: {
        title: "Apprentissages",
        body: "Choisir Next.js custom plutôt que WordPress a rendu possible tout le reste : Edge Functions, Server Components, multi-devises complexe. La séparation stricte des workflows métier en modules isolés a permis d'ajouter le 4e workflow (fidélité) en quelques jours sans toucher aux 3 premiers. Sécuriser un système de paiement en production change la mentalité : passer de \"ça marche en local\" à \"ça résiste à 100 tentatives en 1 minute\". À refaire : j'aurais investi plus tôt dans des tests d'intégration Playwright + Stripe test mode sur les chemins de paiement. Les mocks Stripe ne capturent pas tous les edge cases (cartes refusées, webhooks dupliqués).",
        type: "text"
      }
    },
    en: {
      problem: {
        title: "The problem",
        body: "The founder wanted to build a marketplace where creative ideas are valued, artists earn from their designs, and profit-sharing is transparent (10-20% for idea contributors, 20-35% for designers). The platform needed to handle 3 user roles (admin, creator, customer), 4 currencies (CAD, USD, EUR, GBP), 2 languages (FR, EN) and 7+ external integrations, all maintained by a single engineer. The initial request was WordPress. I recommended a custom Next.js stack, justified by the need for complex workflows, Edge Functions and multi-currency support.",
        type: "text"
      },
      constraints: {
        title: "Constraints",
        body: "Tight deadlines (~3 months for MVP). Production payments from day one: security non-negotiable. GDPR, Quebec Loi 25 and Loi 96 (bilingualism) compliance required from the start. Documentation in parallel to enable onboarding of a future second developer. The client had no technical expertise: every architecture decision had to be explained and defended.",
        type: "text"
      },
      approach: {
        title: "The solution",
        body: "Layered architecture with Next.js 16 App Router (Server Components by default), Prisma as the data layer with 10+ relational models, and isolated business modules per workflow. Custom session-based auth with 6-digit email verification (rate limiting 3/h, 15 min expiry, max 5 attempts) and Google OAuth 2.0 with refresh token rotation. Multi-currency Stripe Checkout with HMAC webhook signatures, Gelato for automated fulfillment (live mockups, templates, shipping), Google Merchant Center synced via Supabase Edge Functions Deno with 5/batch pagination. Multi-category cookie consent with conditional GA4 and Google Ads loading based on consent. Auto-currency detection via Vercel/Cloudflare geolocation headers. Admin bulk upload with intelligent color detection on ZIP file patterns (gco_COLORNAME).",
        type: "text"
      },
      stack: {
        title: "Tech stack",
        items: ["Next.js 16 (App Router)", "TypeScript strict", "Prisma + PostgreSQL", "Tailwind CSS 4", "Stripe Checkout", "Gelato (print-on-demand)", "Google Merchant Center (OAuth 2.0)", "GA4 + Google Ads", "Supabase (DB + Storage + Edge Functions Deno)", "Vercel", "Framer Motion"],
        type: "list"
      },
      outcomes: {
        title: "Outcomes",
        body: "~15,000 LOC of production TypeScript. 30+ REST API endpoints. 10+ Prisma/PostgreSQL models. 17+ fully bilingual pages. 5 global React contexts (theme, cart, currency, cookie consent, auth). 4 business workflows shipped (order, return, inventory, loyalty) with 5-7 automated steps per workflow. 20-30 successful CI/CD deployments on Vercel. API latency 150-300 ms, Stripe→Gelato webhook processing 300-500 ms. Complex-order processing dropped from ~25 min to ~10 min. Marketplace live in 2 markets (Canada + USA) with functional profit-sharing.",
        type: "text"
      },
      learnings: {
        title: "Learnings",
        body: "Choosing custom Next.js over WordPress made everything else possible: Edge Functions, Server Components, complex multi-currency. Strict separation of business workflows into isolated modules let me add the 4th workflow (loyalty) in a few days without touching the first 3. Securing a production payment system changes your mindset: going from \"it works locally\" to \"it withstands 100 attempts in 1 minute\". What I'd do differently: invest earlier in Playwright + Stripe test mode integration tests on payment paths. Stripe mocks don't capture every edge case (declined cards, duplicate webhooks).",
        type: "text"
      }
    }
  }
}
