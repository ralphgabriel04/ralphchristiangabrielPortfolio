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
  "vibe": {
    fr: {
      problem: {
        title: "Le problème",
        body: "Trouver quoi faire à Montréal demande souvent de jongler entre Google Maps, TikTok, Instagram, Eventbrite, Yelp et les sites d'événements. Ces outils donnent beaucoup d'informations, mais peu d'aide à la décision. L'utilisateur sait rarement quoi choisir selon son humeur, le moment, son budget, sa position ou la station STM où il se trouve. Le public visé — jeunes, étudiants, touristes urbains et personnes spontanées — veut sortir sans perdre du temps à chercher, mais aucun produit ne répond simplement à la vraie question : « qu'est-ce que je fais maintenant ? ».",
        type: "text"
      },
      constraints: {
        title: "Les contraintes",
        body: "Le prototype devait rester simple, visuel et interactif tout en montrant une vision produit complète : découverte locale, IA, communauté, spots cachés et carte STM. Il fallait éviter de créer une simple copie de Google Maps ou Yelp — l'app devait être plus vivante que Google Maps, plus spontanée qu'Eventbrite et plus orientée mood que Yelp. Le défi était de rendre l'expérience claire, rapide et mobile-first, tout en restant navigable sur web et bureau, et en simulant des données (spots, événements, réseau STM, réponses de l'assistant) qui seront plus tard branchées à des APIs réelles.",
        type: "text"
      },
      approach: {
        title: "La solution",
        body: "Vibe propose une expérience centrée sur le mood et le moment. L'utilisateur choisit son ambiance, puis reçoit des recommandations adaptées : plan express, spot du moment, lieux ouverts, endroits cachés et suggestions autour des stations STM. Vibe AI permet de demander un plan personnalisé (« quoi faire ce soir en 2h ? », « date pas cher », « café calme pour étudier », « quoi faire autour de ma station STM ? »), tandis que STM Pulse transforme le métro en interface de découverte locale : on sélectionne une station et on voit quoi faire autour — événements, activités, spots recommandés, temps de marche, budget et ambiance. La communauté ajoute une couche sociale avec validations, mini-reviews, votes de vibe et nouveaux spots proposés par les utilisateurs, récompensés par un badge Découvreur. Le tout existe en deux surfaces cohérentes : une app mobile (cadre téléphone) et une version web/bureau, pour que l'utilisateur navigue le produit peu importe l'appareil.",
        type: "text"
      },
      stack: {
        title: "Stack technique",
        items: ["Prototype : HTML/CSS/JS (runtime dc)", "Claude Design → Claude Code", "Design Components · prototype interactif", "Responsive mobile / desktop", "Design system dark mode (tokens CSS)", "Poppins + Montserrat", "Simulation IA (Vibe AI)", "Simulation données STM (STM Pulse)", "Cible : React / Next.js", "Tailwind CSS", "Supabase · PostgreSQL", "Auth + Storage photos", "OpenAI API", "Google Maps API", "STM GTFS / données transport", "API événements Montréal"],
        type: "list"
      },
      outcomes: {
        title: "Résultats",
        body: "Le prototype V3 présente une expérience cohérente avec plusieurs parcours clés : accueil mood-first, Vibe AI, STM Pulse, communauté, ajout de spot, fiches lieux enrichies (% match, budget, temps de marche, ambiance, preuve sociale) et version bureau. L'application montre clairement son différenciateur : aider l'utilisateur à décider rapidement quoi faire et où descendre dans Montréal selon sa vibe du moment. Honnêteté de l'état : c'est un prototype haute-fidélité — pas de backend, données simulées et assistant mis en scène. Évaluation interne : ≈ 8,4/10 comme prototype haute-fidélité, ≈ 7/10 comme produit réel, car il manque encore backend, données réelles, modération, géolocalisation réelle et API STM/événements.",
        type: "text"
      },
      learnings: {
        title: "Apprentissages",
        body: "Le concept est clair, mémorable et différenciant : STM Pulse (le métro comme interface de découverte) et Vibe AI (transformer une envie vague en plan concret) portent l'identité, et le badge Découvreur renforce la dimension communautaire. La leçon la plus honnête : Vibe est passé d'un simple concept d'app locale à une vraie étude de cas produit, mais reste un prototype, pas encore un produit. Les prochaines étapes sont claires — brancher des données réelles (horaires, événements, stations, géolocalisation), prévoir la modération des spots proposés, ajouter un onboarding court pour expliquer STM Pulse, unifier parfaitement mobile et web, corriger les détails techniques (petites erreurs SVG sur la carte STM, remplacer les transition: all par des transitions ciblées) et clarifier le modèle économique : freemium, partenariats locaux, premium et deals étudiants.",
        type: "text"
      }
    },
    en: {
      problem: {
        title: "The problem",
        body: "Finding what to do in Montréal usually means juggling Google Maps, TikTok, Instagram, Eventbrite, Yelp and event sites. These tools give plenty of information but little help deciding. Users rarely know what to pick based on their mood, the moment, their budget, their location or the STM station they're at. The target audience — young people, students, urban tourists and spontaneous people — wants to go out without wasting time searching, yet no product simply answers the real question: \"what do I do right now?\".",
        type: "text"
      },
      constraints: {
        title: "Constraints",
        body: "The prototype had to stay simple, visual and interactive while showing a complete product vision: local discovery, AI, community, hidden spots and an STM map. It had to avoid being a mere copy of Google Maps or Yelp — the app needed to feel more alive than Google Maps, more spontaneous than Eventbrite and more mood-driven than Yelp. The challenge was to make the experience clear, fast and mobile-first, while staying navigable on web and desktop, and simulating data (spots, events, STM network, assistant answers) that would later be wired to real APIs.",
        type: "text"
      },
      approach: {
        title: "The solution",
        body: "Vibe centres the experience on mood and moment. Users pick their vibe, then get tailored recommendations: an express plan, the spot of the moment, open places, hidden gems and suggestions around STM stations. Vibe AI lets you ask for a personalised plan (\"what to do tonight in 2h?\", \"cheap date\", \"quiet café to study\", \"what to do around my STM station?\"), while STM Pulse turns the metro into a local discovery interface: select a station and see what to do around it — events, activities, recommended spots, walking time, budget and vibe. The community adds a social layer with validations, mini-reviews, vibe votes and new spots submitted by users, rewarded with a Discoverer badge. All of it lives across two coherent surfaces: a mobile app (phone frame) and a web/desktop version, so users can navigate the product on any device.",
        type: "text"
      },
      stack: {
        title: "Tech stack",
        items: ["Prototype: HTML/CSS/JS (dc runtime)", "Claude Design → Claude Code", "Design Components · interactive prototype", "Responsive mobile / desktop", "Dark-mode design system (CSS tokens)", "Poppins + Montserrat", "Simulated AI (Vibe AI)", "Simulated STM data (STM Pulse)", "Target: React / Next.js", "Tailwind CSS", "Supabase · PostgreSQL", "Auth + photo storage", "OpenAI API", "Google Maps API", "STM GTFS / transit data", "Montréal events API"],
        type: "list"
      },
      outcomes: {
        title: "Outcomes",
        body: "The V3 prototype presents a coherent experience with several key journeys: a mood-first home, Vibe AI, STM Pulse, community, add-a-spot, enriched place pages (% match, budget, walking time, vibe, social proof) and a desktop version. The app clearly shows its differentiator: helping users quickly decide what to do and where to get off in Montréal based on their current vibe. An honest status: this is a high-fidelity prototype — no backend, simulated data and a staged assistant. Internal rating: ≈ 8.4/10 as a high-fidelity prototype, ≈ 7/10 as a real product, since it still lacks a backend, real data, moderation, real geolocation and STM/events APIs.",
        type: "text"
      },
      learnings: {
        title: "Learnings",
        body: "The concept is clear, memorable and differentiating: STM Pulse (the metro as a discovery interface) and Vibe AI (turning a vague urge into a concrete plan) carry the identity, and the Discoverer badge strengthens the community dimension. The most honest lesson: Vibe went from a simple local-app concept to a real product case study, but it's still a prototype, not yet a product. The next steps are clear — wire in real data (schedules, events, stations, geolocation), plan moderation for submitted spots, add a short onboarding to explain STM Pulse, perfectly unify mobile and web, fix the technical details (small SVG glitches on the STM map, replace transition: all with targeted transitions) and clarify the business model: freemium, local partnerships, premium and student deals.",
        type: "text"
      }
    }
  },
  "boa-traiteur": {
    fr: {
      problem: {
        title: "Le problème",
        body: "Max est chef privé à Montréal (marque BOA) mais n'a aucune présence en ligne qui vend l'expérience — service à table à domicile, soupers privés, mariages, corporatif — ni de moyen simple de recevoir des réservations qualifiées. Les visiteurs doivent comprendre une offre plus riche qu'un traiteur classique, choisir un menu sans se noyer dans les options, puis réserver avec un dépôt. Côté chef, il faut filtrer les demandes hors zone, hors délai ou trop grosses, et réduire les no-shows, sans logiciel de réservation coûteux.",
        type: "text"
      },
      constraints: {
        title: "Les contraintes",
        body: "Aucun backend : tout est mocké proprement (aucun paiement réel, aucune IA branchée). Les règles métier viennent d'un PRD rempli par le client et doivent être respectées à la lettre : délai minimum de 2 semaines, dépôt 25 % non remboursable (sauf annulation par BOA), zone Île de Montréal avec frais selon distance, plafond de 20 convives (au-delà → appel obligatoire), taxes non appliquées pour l'instant. Bilingue FR/EN, identité de marque BOA (bourgogne #6E1F2E + crème, slogan « When the love for food meets unforgettable memories »), accessibilité et prefers-reduced-motion. Rien d'inventé : les points non tranchés (prix réels, calendrier, processeur de paiement, textes légaux Loi 25) sont signalés dans la maquette plutôt que devinés.",
        type: "text"
      },
      approach: {
        title: "La solution",
        body: "Une analyse concurrentielle (Take a Chef, The Culinistas, Cozymeal, Tock) a guidé chaque décision. Pour réduire la friction de choix, un concierge culinaire recommande un menu en 30 secondes à partir de l'occasion, du nombre de convives, du budget et des restrictions. Pour rassurer avant de payer, une section « ce qui est inclus » et un résumé détaillé (dépôt, solde, taxes, conditions) lèvent les zones grises. Pour réduire les no-shows, un dépôt à la réservation et une waitlist « me prévenir » sur les dates complètes. Le tout dans un parcours de réservation multi-étapes (menu → date → format & détails → résumé → paiement mocké → confirmation), doublé d'un chatbot « Concierge BOA » à réponses guidées, d'un sélecteur FR/EN par dictionnaire, d'un thème clair/sombre et d'un mode administrateur avec emplacements photo en drag & drop pour brancher les vraies images.",
        type: "text"
      },
      stack: {
        title: "Stack technique",
        items: ["Claude Design → Claude Code", "HTML/CSS/JS (runtime dc)", "Dictionnaire i18n FR → EN", "CSS Custom Properties (thème clair/sombre)", "Newsreader + Hanken Grotesk + Allura", "image-slot.js (drag & drop)", "IntersectionObserver (reveal au scroll)", "prefers-reduced-motion"],
        type: "list"
      },
      outcomes: {
        title: "Résultats",
        body: "Un prototype v4 complet et cohérent, bilingue FR/EN et clair/sombre, couvrant tout le parcours de réservation de bout en bout (souper et événement) plus concierge, menus, expériences, lieux, galerie, à propos et contact. Les vraies règles d'affaires de Max sont encodées (délai 2 semaines, dépôt 25 %, zone Montréal, plafond 20 convives, frais de dernière minute). Les décisions restantes sont explicitement marquées « à confirmer », prêtes à devenir un vrai site avec Stripe/Square, Calendly et courriels automatiques.",
        type: "text"
      },
      learnings: {
        title: "Apprentissages",
        body: "Pour un service haut de gamme, vendre l'expérience prime sur la liste de plats : le concierge et le ton éditorial convertissent mieux qu'un catalogue. Rassurer avant de payer (inclusions, dépôt clair, conditions) réduit l'hésitation, et un dépôt + waitlist attaquent directement les no-shows. Encoder les vraies règles du client dans le parcours — plutôt que de les inventer — rend la maquette immédiatement crédible et transforme le prototype en outil de décision : Max valide des règles concrètes, pas des hypothèses.",
        type: "text"
      }
    },
    en: {
      problem: {
        title: "The problem",
        body: "Max is a private chef in Montreal (the BOA brand) but has no online presence that sells the experience — table service at home, private dinners, weddings, corporate — nor a simple way to receive qualified bookings. Visitors have to grasp an offer richer than plain catering, pick a menu without drowning in options, then book with a deposit. On the chef's side, out-of-zone, out-of-lead-time or oversized requests need filtering, and no-shows reduced, without expensive booking software.",
        type: "text"
      },
      constraints: {
        title: "Constraints",
        body: "No backend: everything is cleanly mocked (no real payment, no live AI). Business rules come from a client-filled PRD and must be honoured exactly: 2-week minimum lead time, 25% non-refundable deposit (unless BOA cancels), Island of Montreal zone with distance-based fees, 20-guest cap (beyond → mandatory call), taxes not applied for now. Bilingual FR/EN, BOA brand identity (burgundy #6E1F2E + cream, tagline \"When the love for food meets unforgettable memories\"), accessibility and prefers-reduced-motion. Nothing invented: undecided points (real pricing, calendar, payment processor, Loi 25 legal copy) are flagged in the mockup rather than guessed.",
        type: "text"
      },
      approach: {
        title: "The solution",
        body: "A competitive analysis (Take a Chef, The Culinistas, Cozymeal, Tock) drove every decision. To cut choice friction, a culinary concierge recommends a menu in 30 seconds from occasion, guest count, budget and restrictions. To reassure before paying, a \"what's included\" section and a detailed summary (deposit, balance, taxes, terms) remove the grey areas. To reduce no-shows, a deposit at booking and a \"notify me\" waitlist on full dates. All within a multi-step booking flow (menu → date → format & details → summary → mocked payment → confirmation), plus a guided \"BOA Concierge\" chatbot, a dictionary-based FR/EN switcher, a light/dark theme and an admin mode with drag-and-drop photo slots to wire in real images.",
        type: "text"
      },
      stack: {
        title: "Tech stack",
        items: ["Claude Design → Claude Code", "HTML/CSS/JS (dc runtime)", "FR → EN i18n dictionary", "CSS Custom Properties (light/dark theme)", "Newsreader + Hanken Grotesk + Allura", "image-slot.js (drag & drop)", "IntersectionObserver (scroll reveal)", "prefers-reduced-motion"],
        type: "list"
      },
      outcomes: {
        title: "Outcomes",
        body: "A complete, coherent v4 prototype, bilingual FR/EN and light/dark, covering the entire booking journey end to end (dinner and event) plus concierge, menus, experiences, venues, gallery, about and contact. Max's real business rules are encoded (2-week lead time, 25% deposit, Montreal zone, 20-guest cap, last-minute fees). Remaining decisions are explicitly marked \"to confirm\", ready to become a real site with Stripe/Square, Calendly and automated emails.",
        type: "text"
      },
      learnings: {
        title: "Learnings",
        body: "For a premium service, selling the experience beats listing dishes: the concierge and editorial tone convert better than a catalogue. Reassuring before payment (inclusions, a clear deposit, terms) reduces hesitation, and a deposit + waitlist tackle no-shows head-on. Encoding the client's real rules into the flow — rather than inventing them — makes the mockup instantly credible and turns the prototype into a decision tool: Max validates concrete rules, not assumptions.",
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
        body: "Une architecture de prototype choisie pour la vitesse d'itération plutôt que la pureté de production : React 18 (UMD) + Babel Standalone pour la transpilation en navigateur, Tailwind via CDN, et une couche de tokens en CSS Custom Properties. Une couche d'état pub/sub maison : window.* comme source de vérité + CustomEvent pour la notification + hooks React pour l'abonnement, le tout canalisé via une factory makeStore() unique. 45+ fichiers source structurés par domaine : une couche design-system (ui.jsx, 25+ composants), un runtime i18n, des stores domaine (Habits / Goals / Rules / Notes / Events), des couches de modales, un app shell, une palette de commandes ⌘K et une création rapide, et des pages auth & inscription, dashboard, calendrier, tâches, tracking, automatisations, planification IA, collaboration, synchronisation d'appareils, notifications, facturation et compte. Un Tweaks Panel flottant et draggable pour sauter d'un écran à l'autre, basculer thème / langue / viewport et forcer les empty states à la demande — l'outil le plus utile pour le dogfooding et les démos. Le vrai différenciateur vit sous la surface : un moteur de science comportementale — modélisation chronotype & énergie, intentions d'implémentation (MCII), anti-procrastination type CBT — exposé en suggestions actionnables au cœur du flux de planification, pas dans une page d'analytics séparée.",
        type: "text"
      },
      stack: {
        title: "Stack technique",
        items: ["React 18.3.1 (CDN UMD)", "Babel Standalone 7.29 (transpilation navigateur)", "Tailwind CSS (CDN)", "CSS Custom Properties (design tokens)", "Pattern pub/sub maison (window.* + CustomEvent)", "postMessage (communication hôte)", "Inter + JetBrains Mono + Instrument Serif", "i18n FR/EN (200+ clés)", "WCAG AA"],
        type: "list"
      },
      outcomes: {
        title: "Résultats",
        body: "Une surface de produit cohérente et démontrable : 20+ écrans fonctionnels — landing, login mock-OAuth et inscription, onboarding 4 étapes, dashboard avec check-in énergie et log de sommeil, planification quotidienne en 6 étapes, focus Pomodoro, calendrier multi-vues (arbre de calendriers 2 niveaux, clic-pour-créer événements & tâches avec aperçu live de la plage horaire), tâches en 5 vues (Liste, Kanban avec animations de complétion par colonne, Gantt, Calendrier et Stats), matrice Eisenhower avec drag & drop, habitudes avec heatmap et streaks, objectifs SMART, automatisations (4 déclencheurs × 5 actions avec conditions JSON), énergie & sommeil alimentant le modèle de chronotype, et analytics injectant un conseil actionnable dans la planification. Nouveaux modules : assistant de planification IA, collaboration & espaces partagés (partage granulaire par module, titre dynamique, bien-être privé par défaut), synchronisation d'appareils connectés (wearables alimentant énergie/récupération), centre de notifications, facturation et compte — plus une palette de commandes ⌘K et une création rapide qui traversent toute l'app. Le tout sur un design system complet : 25+ composants réutilisables (Button — 6 variantes × 5 tailles, Card, Badge — 7 variantes, Input, Switch, Avatar, Ring SVG…), 40+ icônes SVG inline, et une palette de 12 couleurs calibrée dark mode. Le prototype live tourne avec changement de langue instantané et basculement desktop / mobile.",
        type: "text"
      },
      learnings: {
        title: "Apprentissages",
        body: "Le prototypage haute-fidélité avant le backend a validé les décisions qui comptaient le plus — le wizard de planification quotidienne en 6 étapes, le check-in énergie et l'arbre de calendriers 2 niveaux. Le pattern pub/sub maison a suffi pour un prototype complexe — et ses limites (globals partout, pas de modules) marquent clairement où une vraie architecture devient nécessaire en production. Construire le design system avant les pages a accéléré les 20+ écrans : chaque nouvelle page réutilise les mêmes blocs. Le Tweaks Panel (navigation + thème + langue + viewport + empty states) s'est rentabilisé immédiatement pour le dogfooding et les démos. La leçon la plus honnête : la largeur a été conçue en amont des vrais utilisateurs. Le prochain test n'est pas un écran de plus — c'est mettre le produit devant des gens et laisser leur feedback décider de ce qui mérite sa place.",
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
        body: "A prototype architecture chosen for speed of iteration over production purity: React 18 (UMD) + Babel Standalone for in-browser transpilation, Tailwind via CDN, and a token layer in CSS Custom Properties. A custom pub/sub state layer: window.* as the source of truth + CustomEvent for notification + React hooks for subscription, all funnelled through a single makeStore() factory. 45+ source files structured by domain: a design-system layer (ui.jsx, 25+ components), an i18n runtime, domain stores (Habits / Goals / Rules / Notes / Events), modal layers, an app shell, a ⌘K command palette and quick-create, and pages for auth & sign-up, dashboard, calendar, tasks, tracking, automations, AI planning, collaboration, device sync, notifications, billing and account. A floating, draggable Tweaks Panel to jump across every screen, flip theme / language / viewport, and force empty states on demand — the single most useful tool for dogfooding and demos. The real differentiator lives under the surface: a behavioural-science engine — chronotype & energy modelling, implementation-intentions (MCII), CBT-style anti-procrastination — surfaced as actionable suggestions inside the planning flow, not as a separate analytics page.",
        type: "text"
      },
      stack: {
        title: "Tech stack",
        items: ["React 18.3.1 (CDN UMD)", "Babel Standalone 7.29 (in-browser transpilation)", "Tailwind CSS (CDN)", "CSS Custom Properties (design tokens)", "Custom pub/sub pattern (window.* + CustomEvent)", "postMessage (host comms)", "Inter + JetBrains Mono + Instrument Serif", "i18n FR/EN (200+ keys)", "WCAG AA"],
        type: "list"
      },
      outcomes: {
        title: "Outcomes",
        body: "A cohesive, demoable product surface: 20+ functional screens — landing, mock-OAuth login and sign-up, 4-step onboarding, dashboard with energy check-in and sleep log, 6-step daily planning, Pomodoro focus, multi-view calendar (2-level calendar tree, click-to-create events & tasks with a live time-range preview), tasks across five views (List, Kanban with per-column completion animations, Gantt, Calendar and Stats), Eisenhower matrix with drag & drop, habits with heatmap and streaks, SMART goals, automations (4 triggers × 5 actions with JSON conditions), energy & sleep feeding the chronotype model, and analytics injecting an actionable tip into planning. New modules: an AI planning assistant, collaboration & shared spaces (granular per-module sharing, dynamic title, well-being private by default), connected-device sync (wearables feeding energy / recovery), a notification centre, billing and account — plus a ⌘K command palette and quick-create that cut across the whole app. All backed by a complete design system: 25+ reusable components (Button — 6 variants × 5 sizes, Card, Badge — 7 variants, Input, Switch, Avatar, SVG Ring…), 40+ inline SVG icons, and a 12-colour palette calibrated for dark mode. The live prototype runs with instant language switching and a desktop / mobile toggle.",
        type: "text"
      },
      learnings: {
        title: "Learnings",
        body: "High-fidelity prototyping before the backend validated the decisions that mattered most — the 6-step daily-planning wizard, the energy check-in, and the 2-level calendar tree. The custom pub/sub pattern was enough for a complex prototype — and its limits (globals everywhere, no modules) clearly mark where real architecture is needed in production. Building the design system before the pages accelerated all 20+ screens: each new page reused the same blocks. The Tweaks Panel (navigation + theme + language + viewport + empty states) paid for itself immediately for dogfooding and demos. The most honest lesson: breadth was designed ahead of real users. The next test isn't another screen — it's putting the product in front of people and letting their feedback decide what earns its place.",
        type: "text"
      }
    }
  },
  "wise-wealthy": {
    fr: {
      problem: {
        title: "Le problème",
        body: "La majorité des gens ne reçoivent jamais de réelle éducation financière : ils ne savent pas comment budgéter, économiser, rembourser leurs dettes ni commencer à investir. Résultat — stress financier, évitement et mauvaises décisions. Les solutions existantes n'aident pas vraiment ce public : YNAB est puissant mais complexe pour un débutant, Rocket Money automatise sans éduquer, BabyPips reste niché sur le trading, et Wealthsimple suppose déjà des connaissances et pousse des produits d'investissement. Toutes affichent surtout des chiffres et des graphiques, sans accompagner l'utilisateur dans la décision du quotidien. Le segment prioritaire : les 18–35 ans au Québec qui commencent à gagner leur vie, veulent reprendre le contrôle de leur argent, mais trouvent la finance intimidante. Avant d'investir dans un backend, il fallait prouver qu'une expérience « coach », rassurante et vulgarisée, donne envie — d'où le choix d'un prototype mobile haute-fidélité adossé à un vrai modèle d'affaires.",
        type: "text"
      },
      constraints: {
        title: "Les contraintes",
        body: "Éducation, pas conseil réglementé : la contrainte structurante. La plateforme vulgarise, recommande de façon générale et accompagne — elle ne se présente jamais comme un conseiller financier autorisé et n'offre ni trading, ni transactions, ni gestion directe d'investissements. Marque rassurante et non intimidante : ton humain, encourageant, jamais culpabilisant — l'utilisateur ne doit pas se sentir jugé par sa situation. MVP volontairement étroit : assistant IA, budget simple, objectifs, mini-leçons et actualité vulgarisée ; tout le reste (connexion bancaire automatique, titres spécifiques, fiscalité avancée) est reporté. Garde-fous IA : les réponses de l'assistant doivent être encadrées et prudentes, car une IA peut se tromper sur un sujet sensible. Confiance & données : sujet finances personnelles = données sensibles → transparence et protection (esprit Loi 25). Bilingue FR/EN et thème clair/sombre dès le départ. Mobile-first, dans un cadre de téléphone réaliste.",
        type: "text"
      },
      approach: {
        title: "La solution",
        body: "Partir de la stratégie, pas de l'écran. D'abord un modèle d'affaires complet (~12 pages : vision, étude de marché, analyse concurrentielle YNAB / Rocket Money / BabyPips / Wealthsimple, positionnement, Business Model Canvas, modèle freemium, KPIs, risques) et un PRD de découverte — puis seulement la maquette. Le produit prend vie à travers « Wiz », une mascotte-coach (un billet vert expressif, 6 humeurs) qui incarne le ton rassurant et guide chaque parcours. Prototype mobile haute-fidélité construit avec Claude Design (runtime dc / React 18, Bricolage Grotesque + Plus Jakarta Sans, verts apaisants en tokens CSS, clair/sombre, FR/EN). Une vingtaine d'écrans et d'états : onboarding qui personnalise selon l'objectif principal (mieux budgéter / économiser / rembourser / investir), création de compte avec « explorer sans compte », tableau de bord (revenus, dépenses, épargne, « épargne possible », série de clarté, action du jour de 2 min), assistant conversationnel Wiz, budget + budget setup, objectifs d'épargne et détail d'objectif, mini-leçons + flashcards + exercices, actualité financière vulgarisée, notifications, profil, confidentialité et paywall freemium (premium ≈ 9,99–19,99 $/mois). Le concept dépasse une seule app : c'est une petite suite cohérente, toute portée par Wiz. (1) Wise & Wealthy — le coach adulte décrit ci-dessus. (2) Mes finances — une surface de suivi plus avancée (la promesse « premium » / long terme du plan), organisée en onglets Transactions, Prévu vs réel, Cashflow, Abonnements et Dettes, avec import par connexion bancaire sécurisée ou fichier CSV et catégorisation des transactions ; c'est précisément la couche que le MVP garde volontairement de côté, prototypée ici pour montrer où va le produit. (3) Wise & Wealthy Kids — une déclinaison ludique pour enfants (« Apprends l'argent en t'amusant »), avec Wiz, une tirelire, des pièces et des étoiles, un écran de personnalisation, des jalons et des écrans de célébration. (4) Espace Famille — l'espace parents qui encadre Kids : verrou par code PIN à 4 chiffres « connu de vous seul, jamais visible par l'enfant », profils enfants et réglages de confidentialité. (5) Wiz — la mascotte elle-même, composant réutilisable (6 humeurs : salut, idée, réflexion, sécurité, content, célébration) partagé par toute la suite, plus un fragment Hero d'accroche. Cette famille d'apps rend tangibles les pistes « famille » et « institutionnelle / B2B » du business plan, sans surpromettre : ce sont des explorations, pas des produits livrés.",
        type: "text"
      },
      stack: {
        title: "Stack technique",
        items: ["Claude Design → Claude Code", "Runtime dc (React 18 via CDN)", "Prototype mobile haute-fidélité (cadre téléphone)", "20+ écrans / états", "Mascotte-coach « Wiz » (6 humeurs)", "Design tokens (CSS Custom Properties)", "Bricolage Grotesque + Plus Jakarta Sans", "Thème clair/sombre · prefers-reduced-motion", "Bilingue FR/EN", "Onboarding personnalisé par objectif", "Dashboard · Budget · Objectifs · Leçons · Flashcards", "Actualité financière vulgarisée", "Modèle freemium · paywall premium", "Déclinaisons Kids + Espace Famille (verrou PIN)", "Positionnement éducation (non conseil réglementé) · esprit Loi 25", "Production visée : Next.js + TypeScript"],
        type: "list"
      },
      outcomes: {
        title: "Résultats",
        body: "Un dossier produit cohérent, de la stratégie à l'expérience : un modèle d'affaires de ~12 pages + un PRD de découverte, traduits en un prototype mobile démontrable d'une vingtaine d'écrans. L'app adulte couvre le cœur du MVP — onboarding par objectif, tableau de bord avec série de clarté et action du jour, assistant Wiz, budget, objectifs, mini-leçons / flashcards / exercices, actualité vulgarisée, profil, confidentialité et paywall freemium. Une identité de marque complète et rassurante : mascotte Wiz (6 humeurs), palette de verts apaisants, Bricolage Grotesque + Plus Jakarta Sans, le tout bilingue FR/EN et clair/sombre. Et surtout, une suite de cinq surfaces plutôt qu'une seule app : l'app adulte ; « Mes finances », la couche de suivi avancée (Transactions, Prévu vs réel, Cashflow, Abonnements, Dettes, import banque/CSV) qui incarne le palier premium ; « Wise & Wealthy Kids », l'app ludique enfants (tirelire, pièces, étoiles, personnalisation, jalons, célébrations) ; « Espace Famille », l'espace parents avec code PIN à 4 chiffres et profils enfants ; et Wiz, la mascotte réutilisable (6 humeurs) qui unifie le tout. Honnêteté de l'état : c'est un concept au stade prototype — pas de backend, l'assistant IA est mis en scène (réponses scénarisées), et aucun utilisateur réel n'a encore été mesuré. La prochaine étape est la validation prévue au plan opérationnel : sondage 18–35 ans, entrevues, page d'attente et tests des réponses de l'assistant.",
        type: "text"
      },
      learnings: {
        title: "Apprentissages",
        body: "En finance, le positionnement est une décision de risque autant que de marketing : assumer « éducation, pas conseil réglementé » protège le projet et simplifie tout le reste. La discipline de portée paie — garder le MVP à l'assistant + budget + objectifs + leçons, et reporter la connexion bancaire et les titres spécifiques, garde la maquette crédible et livrable. Le ton fait le produit : une mascotte chaleureuse (Wiz) et un langage non culpabilisant transforment un sujet anxiogène en expérience rassurante. Prototyper avant le backend permet de tester l'expérience et le parcours d'objectif sans écrire de serveur ni brancher une vraie IA. La leçon la plus honnête : la largeur (Kids, Espace Famille) a été conçue en amont de la validation — le prochain vrai test n'est pas un écran de plus, mais mettre le prototype devant des 18–35 ans et laisser leurs retours décider de ce qui mérite d'exister.",
        type: "text"
      }
    },
    en: {
      problem: {
        title: "The problem",
        body: "Most people never get real financial education: they don't know how to budget, save, pay down debt or start investing. The result — financial stress, avoidance and poor decisions. Existing solutions don't truly serve this audience: YNAB is powerful but complex for a beginner, Rocket Money automates without educating, BabyPips stays niched on trading, and Wealthsimple already assumes knowledge and pushes investment products. They all mostly display numbers and charts, without guiding the user through everyday decisions. The priority segment: 18–35 year-olds in Quebec who are starting to earn a living, want to take back control of their money, but find finance intimidating. Before investing in a backend, the goal was to prove that a reassuring, plain-language \"coach\" experience is compelling — hence a high-fidelity mobile prototype backed by a real business model.",
        type: "text"
      },
      constraints: {
        title: "Constraints",
        body: "Education, not regulated advice: the structuring constraint. The platform explains, gives general recommendations and coaches — it never presents itself as a licensed financial advisor and offers no trading, transactions or direct investment management. A reassuring, non-intimidating brand: a human, encouraging tone, never guilt-inducing — users must not feel judged by their situation. A deliberately narrow MVP: AI assistant, simple budget, goals, mini-lessons and simplified news; everything else (automatic bank connection, specific securities, advanced tax) is deferred. AI guardrails: the assistant's answers must be framed and cautious, since AI can be wrong on a sensitive subject. Trust & data: personal finance means sensitive data → transparency and protection (Loi 25 spirit). Bilingual FR/EN and a light/dark theme from the start. Mobile-first, inside a realistic phone frame.",
        type: "text"
      },
      approach: {
        title: "The solution",
        body: "Start from strategy, not the screen. First a full business model (~12 pages: vision, market study, competitive analysis of YNAB / Rocket Money / BabyPips / Wealthsimple, positioning, Business Model Canvas, freemium model, KPIs, risks) and a discovery PRD — then the mockup. The product comes alive through \"Wiz\", a coach mascot (an expressive green banknote, 6 moods) that embodies the reassuring tone and guides every journey. A high-fidelity mobile prototype built with Claude Design (dc runtime / React 18, Bricolage Grotesque + Plus Jakarta Sans, calming greens as CSS tokens, light/dark, FR/EN). Around twenty screens and states: onboarding that personalises by main goal (budget better / save / pay down debt / invest), account creation with \"explore without an account\", a dashboard (income, expenses, savings, \"possible savings\", a clarity streak, a 2-minute daily action), the conversational Wiz assistant, budget + budget setup, savings goals and goal detail, mini-lessons + flashcards + exercises, simplified financial news, notifications, profile, privacy and a freemium paywall (premium ≈ $9.99–19.99/mo). The concept goes beyond a single app: it's a small coherent suite, all carried by Wiz. (1) Wise & Wealthy — the adult coach described above. (2) Mes finances (\"My finances\") — a more advanced tracking surface (the plan's \"premium\" / long-term promise), organised into Transactions, Planned vs actual, Cashflow, Subscriptions and Debts tabs, with import via secure bank connection or CSV file and transaction categorisation; this is precisely the layer the MVP deliberately leaves out, prototyped here to show where the product is heading. (3) Wise & Wealthy Kids — a playful variant for children (\"Learn money while having fun\"), with Wiz, a piggy bank, coins and stars, a customise screen, milestones and celebration screens. (4) Family Space — the parent area that frames Kids: a 4-digit PIN lock \"known only to you, never visible to the child\", child profiles and privacy settings. (5) Wiz — the mascot itself, a reusable component (6 moods: wave, idea, thinking, secure, happy, celebrate) shared across the whole suite, plus a Hero hook fragment. This family of apps makes the business plan's \"family\" and \"institutional / B2B\" tracks tangible, without overpromising: these are explorations, not shipped products.",
        type: "text"
      },
      stack: {
        title: "Tech stack",
        items: ["Claude Design → Claude Code", "dc runtime (React 18 via CDN)", "High-fidelity mobile prototype (phone frame)", "20+ screens / states", "\"Wiz\" coach mascot (6 moods)", "Design tokens (CSS Custom Properties)", "Bricolage Grotesque + Plus Jakarta Sans", "Light/dark theme · prefers-reduced-motion", "Bilingual FR/EN", "Goal-based personalised onboarding", "Dashboard · Budget · Goals · Lessons · Flashcards", "Simplified financial news", "Freemium model · premium paywall", "Kids + Family Space variants (PIN lock)", "Education positioning (not regulated advice) · Loi 25 spirit", "Target production: Next.js + TypeScript"],
        type: "list"
      },
      outcomes: {
        title: "Outcomes",
        body: "A coherent product dossier, from strategy to experience: a ~12-page business model + a discovery PRD, translated into a demoable mobile prototype of around twenty screens. The adult app covers the MVP core — goal-based onboarding, a dashboard with a clarity streak and daily action, the Wiz assistant, budget, goals, mini-lessons / flashcards / exercises, simplified news, profile, privacy and a freemium paywall. A complete, reassuring brand identity: the Wiz mascot (6 moods), a calming green palette, Bricolage Grotesque + Plus Jakarta Sans, all bilingual FR/EN and light/dark. And, crucially, a suite of five surfaces rather than a single app: the adult app; \"Mes finances\", the advanced tracking layer (Transactions, Planned vs actual, Cashflow, Subscriptions, Debts, bank/CSV import) that embodies the premium tier; \"Wise & Wealthy Kids\", the playful kids app (piggy bank, coins, stars, customisation, milestones, celebrations); \"Family Space\", the parent area with a 4-digit PIN and child profiles; and Wiz, the reusable mascot (6 moods) that unifies it all. An honest status: this is a concept at prototype stage — no backend, the AI assistant is staged (scripted answers), and no real users have been measured yet. The next step is the validation planned in the operational roadmap: an 18–35 survey, interviews, a waitlist and testing the assistant's answers.",
        type: "text"
      },
      learnings: {
        title: "Learnings",
        body: "In finance, positioning is a risk decision as much as a marketing one: owning \"education, not regulated advice\" protects the project and simplifies everything else. Scope discipline pays off — keeping the MVP to assistant + budget + goals + lessons, and deferring bank connection and specific securities, keeps the mockup credible and shippable. Tone makes the product: a warm mascot (Wiz) and non-judgmental language turn an anxiety-inducing subject into a reassuring experience. Prototyping before the backend lets you test the experience and the goal-based journey without writing a server or wiring a real AI. The most honest lesson: breadth (Kids, Family Space) was designed ahead of validation — the next real test isn't another screen, it's putting the prototype in front of 18–35 year-olds and letting their feedback decide what deserves to exist.",
        type: "text"
      }
    }
  },
  "kim-dubois": {
    fr: {
      problem: {
        title: "Le problème",
        body: "Kim Dubois — photographe animalière primée à l'international (TIPPA 2024-2025), référée par Matis — avait commencé elle-même son site sur Wix, mais il était resté inachevé (mention « en construction », bandeau publicitaire Wix, plan gratuit) et ne reflétait ni la qualité de son travail ni son statut de photographe primée. Je l'ai contactée pour lui offrir mon assistance : reprendre le site qu'elle avait amorcé, le finaliser et le remodeler, en concevoir une nouvelle version sous forme de prototype (via un outil de design), puis la lui présenter pour recueillir ses réactions et orienter la suite. Comme c'est mon premier vrai client payant, l'enjeu est de livrer un travail impeccable et de décrocher un témoignage concret pour mon portfolio.",
        type: "text"
      },
      constraints: {
        title: "Les contraintes",
        body: "Premier client payant : zéro droit à l'erreur sur la qualité comme sur la relation. La photo doit primer — le site est un aperçu émotionnel, pas un catalogue. Bilingue FR/EN et thème clair/sombre dès le départ. Identité éditoriale haut de gamme fidèle au travail d'une primée (tokens dorés, Cormorant Garamond + Mulish). La question d'autonomie de la cliente (gère-t-elle elle-même son contenu ?) est le vrai pivot : elle décide la plateforme et le budget. Tout le contenu doit rester centralisé et éditable, car il changera dès les premiers retours de Kim. Côté budget : différer le prix jusqu'au cadrage de la portée, donner une fourchette, garder domaine/hébergement au nom de la cliente, et proposer un tarif premier-client en échange d'un témoignage.",
        type: "text"
      },
      approach: {
        title: "La solution",
        body: "Une démarche en plusieurs livrables cohérents partageant la même palette, la même typo et le même ton : (1) un formulaire de découverte Word de 60 questions, adapté du formulaire de Matis et habillé aux couleurs KD ; (2) un PowerPoint de 9 diapos comme colonne vertébrale de l'appel (écouter > parler, le prototype comme pièce maîtresse) ; (3) un brief Claude Design structuré séparant le contenu des décisions de structure/design pour générer la maquette ; (4) la maquette, qui a mûri d'une page d'accueil unique vers un prototype complet et interactif : multi-pages (accueil, galerie portfolio, page « toutes les distinctions »), une quinzaine de sections modulaires réordonnables (héros, compteurs, empathie, parcours, forfaits, témoignages, boutique, espace client, infolettre, voyage, FAQ, pont de l'arc-en-ciel…), de vraies photos primées classées par catégorie, un carrousel intelligent (qui s'adapte selon le nombre de photos) avec lightbox, un fil signature « cousu » au scroll (CSS scroll-driven animations, repli rAF, respect de reduced-motion), une protection légère des images inspirée de 500px, un assistant-concierge en clavardage guidé menant à un contact réel (courriel pré-rempli, sans serveur), et un mode administrateur intégré — « liberté encadrée » — pour éditer contenu et apparence, masquer/réordonner les sections et gérer codes promo, persistant côté navigateur (→ CMS en production) ; (5) des messages clients (confirmation, rappel) en québécois ; (6) une stratégie de budget (fourchette + report du prix après cadrage, récurrents au nom de Kim, tarif premier-client contre témoignage). Le déck guide la conversation, le prototype crée le « wow », le formulaire devient un devoir post-appel — jamais rempli en direct.",
        type: "text"
      },
      stack: {
        title: "Stack technique",
        items: ["Maquette : HTML/CSS/JS (React + Babel côté Claude Design)", "Prototype multi-pages (accueil · galerie · distinctions) en routage hash léger", "~15 sections modulaires affichables/masquables/réordonnables", "Mode administrateur intégré (éditeur de contenu + apparence, codes promo)", "Assistant-concierge (clavardage guidé, courriel pré-rempli, sans serveur)", "Carrousel intelligent + visionneuse (lightbox) partagée", "Fil signature : CSS Scroll-Driven Animations + repli requestAnimationFrame", "Protection légère des images (clic droit/drag) + crédit", "CSS Custom Properties (tokens dorés)", "Cormorant Garamond + Mulish", "i18n FR/EN · sélecteur d'audience (particuliers/commercial)", "Thème clair/sombre · reduced-motion · accessibilité (aria, focus)", "Production visée : Next.js (App Router) + TypeScript + Tailwind", "Contenu centralisé en fichiers de données (persistance navigateur → CMS)", "Outils : Word/PowerPoint générés, Claude Design → Claude Code"],
        type: "list"
      },
      outcomes: {
        title: "Résultats",
        body: "Un kit de rencontre complet et cohérent (même palette, typo et ton partout) : formulaire de découverte 60 questions, deck 9 diapos, brief de design et messages clients. Et un prototype qui a nettement mûri depuis le premier appel : maquette multi-pages bilingue clair/sombre, une quinzaine de sections modulaires, vraies photos primées par catégorie, carrousel intelligent avec lightbox, fil signature animé au scroll, assistant-concierge et mode administrateur intégré (« liberté encadrée »). Des messages envoyés et une cliente engagée — Kim a confirmé l'appel (17 h) avec un ❤️. Résultat humain : je suis arrivé à l'appel outillé et crédible, avec le prototype comme pièce maîtresse plutôt qu'un simple discours — désormais assez riche pour servir de base de production.",
        type: "text"
      },
      learnings: {
        title: "Apprentissages",
        body: "Séparer le brief de contenu des décisions de structure/design donne de meilleurs résultats avec Claude Design. Ne pas remplir le formulaire en direct : le déck guide la conversation, le prototype crée le « wow », le formulaire est un devoir post-appel. La question d'autonomie de la cliente est le vrai pivot : elle décide la plateforme et le budget. Différer le prix jusqu'au cadrage de la portée ; donner une fourchette, garder domaine/hébergement au nom de la cliente, tarif premier-client en échange d'un témoignage. La maquette doit rester un aperçu émotionnel (la photo prime), pas un catalogue ; et tout le contenu centralisé/éditable, car il changera dès les premiers retours de Kim. Enfin, un mode administrateur « liberté encadrée » (éditer contenu et apparence, masquer/réordonner, mais jamais casser) transforme le prototype en outil de discussion vivant et prépare le passage à un CMS en production.",
        type: "text"
      }
    },
    en: {
      problem: {
        title: "The problem",
        body: "Kim Dubois — an internationally awarded pet photographer (TIPPA 2024-2025), referred by Matis — had started her own site on Wix, but it had been left unfinished (an \"under construction\" notice, a Wix ad banner, the free plan) and reflected neither the quality of her work nor her status as an awarded photographer. I reached out to offer my help: take over the site she had started, finish and reshape it, design a new version as a prototype (via a design tool), then present it to her to gather her reactions and steer what comes next. As this is my first real paying client, the stakes are to deliver impeccable work and earn a concrete testimonial for my portfolio.",
        type: "text"
      },
      constraints: {
        title: "Constraints",
        body: "First paying client: no room for error on quality or on the relationship. Photography must come first — the site is an emotional preview, not a catalogue. Bilingual FR/EN and a light/dark theme from the start. A high-end editorial identity faithful to an award-winner's work (gold tokens, Cormorant Garamond + Mulish). The client's autonomy question (does she manage her own content?) is the real pivot: it decides the platform and the budget. All content must stay centralised and editable, since it will change with Kim's first feedback. On budget: defer pricing until scope is framed, give a range, keep domain/hosting in the client's name, and offer a first-client rate in exchange for a testimonial.",
        type: "text"
      },
      approach: {
        title: "The solution",
        body: "A process of several coherent deliverables sharing the same palette, typography and tone: (1) a 60-question Word discovery form, adapted from Matis's form and dressed in KD colours; (2) a 9-slide PowerPoint as the backbone of the call (listen > talk, the prototype as the centrepiece); (3) a structured Claude Design brief separating content from structure/design decisions to generate the mockup; (4) the mockup, which matured from a single home page into a full, interactive prototype: multi-page (home, portfolio gallery, full \"all distinctions\" page), around fifteen reorderable modular sections (hero, counters, empathy, process, packages, testimonials, shop, client area, newsletter, travel, FAQ, rainbow bridge…), real awarded photos sorted by category, a smart carousel (adapting to the number of photos) with a lightbox, a signature thread \"sewn\" along the scroll (CSS scroll-driven animations, rAF fallback, reduced-motion aware), light image protection inspired by 500px, a guided concierge-chat assistant leading to real contact (pre-filled email, no server), and a built-in admin mode — \"bounded freedom\" — to edit content and appearance, hide/reorder sections and manage promo codes, persisted in the browser (→ CMS in production); (5) client messages (confirmation, reminder) in Quebec French; (6) a budget strategy (range + deferred price after scoping, recurring costs in Kim's name, first-client rate for a testimonial). The deck guides the conversation, the prototype creates the \"wow\", the form becomes post-call homework — never filled in live.",
        type: "text"
      },
      stack: {
        title: "Tech stack",
        items: ["Mockup: HTML/CSS/JS (React + Babel on the Claude Design side)", "Multi-page prototype (home · gallery · distinctions) via light hash routing", "~15 modular sections, show/hide/reorderable", "Built-in admin mode (content + appearance editor, promo codes)", "Concierge assistant (guided chat, pre-filled email, no server)", "Smart carousel + shared lightbox viewer", "Signature thread: CSS Scroll-Driven Animations + requestAnimationFrame fallback", "Light image protection (right-click/drag) + credit", "CSS Custom Properties (gold tokens)", "Cormorant Garamond + Mulish", "FR/EN i18n · audience switcher (consumer/commercial)", "Light/dark theme · reduced-motion · accessibility (aria, focus)", "Target production: Next.js (App Router) + TypeScript + Tailwind", "Content centralised in data files (browser persistence → CMS)", "Tools: generated Word/PowerPoint, Claude Design → Claude Code"],
        type: "list"
      },
      outcomes: {
        title: "Outcomes",
        body: "A complete, coherent meeting kit (same palette, type and tone throughout): 60-question discovery form, 9-slide deck, design brief and client messages. And a prototype that has clearly matured since the first call: a multi-page bilingual light/dark mockup, around fifteen modular sections, real awarded photos by category, a smart carousel with lightbox, an animated signature scroll thread, a concierge assistant and a built-in admin mode (\"bounded freedom\"). Messages sent and an engaged client — Kim confirmed the call (5 p.m.) with a ❤️. The human result: I showed up to the call equipped and credible, with the prototype as the centrepiece rather than just a pitch — now rich enough to serve as a production base.",
        type: "text"
      },
      learnings: {
        title: "Learnings",
        body: "Separating the content brief from structure/design decisions yields better results with Claude Design. Don't fill the form in live: the deck guides the conversation, the prototype creates the \"wow\", the form is post-call homework. The client's autonomy question is the real pivot: it decides the platform and the budget. Defer pricing until scope is framed; give a range, keep domain/hosting in the client's name, first-client rate in exchange for a testimonial. The mockup must stay an emotional preview (photography first), not a catalogue; and keep all content centralised/editable, since it will change with Kim's first feedback. Finally, a \"bounded-freedom\" admin mode (edit content and appearance, hide/reorder, but never break it) turns the prototype into a living discussion tool and paves the way to a production CMS.",
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
