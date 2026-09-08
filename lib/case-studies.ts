/** Case-study content (v2 "étude de cas" model): a meta strip + numbered
 *  sections. Sections are body + 2-column points by default; special kinds
 *  render a results quad, a delivery gantt (sprints), decision cards or a
 *  test pyramid. Bilingual (fr/en), keyed by project id. */

export type CaseMeta = { k: string; v: string };
export type CaseResult = { value: string; label: string };
export type CaseDecision = {
  title: string;
  cons: string;
  choice: string;
  trade: string;
  effect: string;
};
export type CaseSection = {
  num: string;
  title: string;
  body: string;
  points?: string[];
  results?: CaseResult[];
  decisions?: CaseDecision[];
  kind?: "sprints" | "pyramid" | "flow";
};
export type CaseStudy = { meta: CaseMeta[]; sections: CaseSection[] };

export const caseStudies: Record<string, { fr: CaseStudy; en: CaseStudy }> = {
  "the-mad-space": {
    fr: {
      meta: [
        { k: "Rôle", v: "CTO" },
        { k: "Responsabilités", v: "Direction technique · Architecture · Développement" },
        { k: "Produit", v: "Marketplace e-commerce print-on-demand" },
        { k: "Statut", v: "En production" },
        { k: "Période", v: "Produit lancé 2024 · CTO depuis 2025" },
        { k: "Stack", v: "Next.js 16 · TypeScript · PostgreSQL · Prisma" },
      ],
      sections: [
        {
          num: "01",
          title: "Contexte",
          body: "The Mad Space est une plateforme montréalaise qui permet aux artistes et aux porteurs d'idées de commercialiser leurs créations sans gérer l'inventaire, l'impression ni la livraison. Le produit réunit trois parcours : les créateurs soumettent leurs œuvres, les clients achètent, et l'équipe interne valide les créations, administre le catalogue et supervise les opérations.",
          points: [
            "Comptes et profils de créateurs · soumission et validation des œuvres",
            "Commissions progressives sur chaque vente",
            "Catalogue : t-shirts, hoodies et crewnecks (3 catégories)",
            "Expérience bilingue FR/EN · paiement en 4 devises",
            "Production et expédition automatisées avec Gelato",
            "Blogue bilingue et contenu SEO · avis réservés aux acheteurs vérifiés",
          ],
        },
        {
          num: "02",
          title: "Contraintes",
          body: "Le défi : une seule plateforme pour plusieurs types d'utilisateurs, avec les opérations essentielles automatisées et une architecture assez claire pour faire évoluer le produit.",
          points: [
            "Centraliser les parcours acheteur, créateur et administrateur",
            "Synchroniser paiement, vente, commission et production",
            "Réduire les opérations manuelles après une commande",
            "Prendre en charge deux langues et quatre devises",
            "Assurer la traçabilité des commandes et des revenus",
            "Permettre l'évolution du catalogue et du contenu",
          ],
        },
        {
          num: "03",
          title: "Décisions",
          body: "Trois décisions d'architecture ont défini le produit.",
          decisions: [
            {
              title: "Un produit intégré et évolutif",
              cons: "Plusieurs types d'utilisateurs, des opérations à automatiser, un produit à faire évoluer vite.",
              choice: "Une application Next.js modulaire réunissant l'expérience utilisateur, les API et les outils d'administration.",
              trade: "Une seule base de code à structurer proprement.",
              effect: "Évolution rapide autour d'une logique métier centralisée : créateurs, designs, produits, ventes, commandes.",
            },
            {
              title: "Un parcours de commande automatisé",
              cons: "Paiement, vente, commission et production à synchroniser sans intervention manuelle.",
              choice: "Stripe Checkout déclenche un webhook vérifié ; la commande et les ventes sont enregistrées avant la transmission des informations de production à Gelato.",
              trade: "Chemins d'erreur et idempotence à coder soigneusement.",
              effect: "Paiement, commissions, production, confirmation par courriel et suivi réunis dans un même parcours.",
            },
            {
              title: "Une plateforme pensée pour plusieurs rôles",
              cons: "Trois expériences très différentes : acheteur, créateur, administrateur.",
              choice: "Des parcours séparés sur un modèle de données commun.",
              trade: "Une seule application à faire évoluer, pas trois.",
              effect: "Chaque rôle dispose d'un parcours adapté sans fragmenter la plateforme.",
            },
          ],
        },
        {
          num: "04",
          title: "Architecture",
          kind: "flow",
          body: "Le parcours d'une commande, de l'acheteur au fulfillment : Acheteur → Next.js → Stripe Checkout → webhook vérifié → PostgreSQL/Prisma → calcul des ventes et commissions → Gelato → confirmation et suivi. Services principaux : Stripe · Gelato · Supabase · PostgreSQL · Prisma · Resend · Vercel.",
        },
        {
          num: "05",
          title: "Résultats",
          body: "Une marketplace bilingue en production, capable de gérer les créateurs, les soumissions, le catalogue, les paiements, les commissions, la production et le suivi des commandes dans une seule plateforme.",
          results: [
            { value: "37", label: "modules de routes API" },
            { value: "12", label: "modèles de données" },
            { value: "32", label: "pages applicatives" },
            { value: "4", label: "devises · 2 langues" },
          ],
        },
      ],
    },
    en: {
      meta: [
        { k: "Role", v: "CTO" },
        { k: "Responsibilities", v: "Technical direction · Architecture · Development" },
        { k: "Product", v: "Print-on-demand e-commerce marketplace" },
        { k: "Status", v: "In production" },
        { k: "Period", v: "Product launched 2024 · CTO since 2025" },
        { k: "Stack", v: "Next.js 16 · TypeScript · PostgreSQL · Prisma" },
      ],
      sections: [
        {
          num: "01",
          title: "Context",
          body: "The Mad Space is a Montréal platform that lets artists and idea-owners sell their creations without handling inventory, printing or shipping. The product brings together three journeys: creators submit their artwork, customers buy, and the internal team validates creations, manages the catalogue and oversees operations.",
          points: [
            "Creator accounts and profiles · artwork submission and validation",
            "Progressive commissions on every sale",
            "Catalogue: t-shirts, hoodies and crewnecks (3 categories)",
            "Bilingual FR/EN experience · payment in 4 currencies",
            "Automated production and shipping with Gelato",
            "Bilingual blog and SEO content · reviews limited to verified buyers",
          ],
        },
        {
          num: "02",
          title: "Constraints",
          body: "The challenge: a single platform for several types of users, with the essential operations automated and an architecture clear enough to grow the product.",
          points: [
            "Centralize the buyer, creator and admin journeys",
            "Sync payment, sale, commission and production",
            "Cut manual operations after an order",
            "Support two languages and four currencies",
            "Ensure traceability of orders and revenue",
            "Let the catalogue and content grow",
          ],
        },
        {
          num: "03",
          title: "Decisions",
          body: "Three architecture decisions shaped the product.",
          decisions: [
            {
              title: "An integrated, scalable product",
              cons: "Several user types, operations to automate, a product to evolve fast.",
              choice: "A modular Next.js app bringing together the user experience, the APIs and the admin tools.",
              trade: "A single codebase to structure cleanly.",
              effect: "Fast evolution around centralized business logic: creators, designs, products, sales, orders.",
            },
            {
              title: "An automated order journey",
              cons: "Payment, sale, commission and production to sync with no manual step.",
              choice: "Stripe Checkout triggers a verified webhook; the order and sales are recorded before production data is sent to Gelato.",
              trade: "Error paths and idempotency to code carefully.",
              effect: "Payment, commissions, production, email confirmation and tracking in one journey.",
            },
            {
              title: "A platform built for multiple roles",
              cons: "Three very different experiences: buyer, creator, admin.",
              choice: "Separate journeys on a shared data model.",
              trade: "One app to evolve, not three.",
              effect: "Each role gets a tailored journey without fragmenting the platform.",
            },
          ],
        },
        {
          num: "04",
          title: "Architecture",
          kind: "flow",
          body: "The path of an order, from buyer to fulfillment: Buyer → Next.js → Stripe Checkout → verified webhook → PostgreSQL/Prisma → sales and commission calculation → Gelato → confirmation and tracking. Core services: Stripe · Gelato · Supabase · PostgreSQL · Prisma · Resend · Vercel.",
        },
        {
          num: "05",
          title: "Results",
          body: "A bilingual marketplace in production, able to manage creators, submissions, the catalogue, payments, commissions, production and order tracking in a single platform.",
          results: [
            { value: "37", label: "API route modules" },
            { value: "12", label: "data models" },
            { value: "32", label: "app pages" },
            { value: "4", label: "currencies · 2 languages" },
          ],
        },
      ],
    },
  },

  financej: {
    fr: {
      meta: [
        { k: "Rôle", v: "Chef d'équipe" },
        { k: "Équipe", v: "6 développeurs" },
        { k: "Stack", v: "Java · JUnit" },
        { k: "Cadre", v: "ÉTS — Test & Maintenance" },
      ],
      sections: [
        {
          num: "01",
          title: "Contexte",
          body: "Une application de finances personnelles (comptes, budgets, transactions) livrée en équipe de six, dans un cours où la note se joue sur la qualité des tests et la maintenabilité.",
          points: [
            "Java Swing · architecture MVC",
            "Gestion multi-comptes, budgets et rapports",
            "Code existant à faire évoluer sans rien casser",
            "Évaluation sur la couverture et la rigueur des tests",
          ],
        },
        {
          num: "02",
          title: "Rôle : chef d'équipe",
          body: "J'ai pris la coordination : connaître les forces de chacun, répartir les tâches avec équité, garder le rythme — et livrer ma propre part.",
          points: [
            "Répartition des tâches selon les forces de chacun",
            "Revues croisées avant chaque fusion de code",
            "Suivi d'avancement et relances calmes",
            "Témoignages d'équipe : « un excellent leader »",
          ],
        },
        {
          num: "03",
          title: "Approche : TDD",
          kind: "pyramid",
          body: "Tests d'abord quand le module s'y prêtait : chaque comportement critique du grand livre est verrouillé par un test avant réécriture.",
        },
        {
          num: "04",
          title: "Résultats",
          body: "Une série de 133 tests qui a permis de réécrire le code sans crainte, et une livraison à temps.",
          results: [
            { value: "133", label: "tests" },
            { value: "6", label: "développeurs coordonnés" },
            { value: "complète*", label: "couverture annoncée" },
            { value: "100%", label: "livré à temps" },
          ],
        },
        {
          num: "05",
          title: "Apprentissages",
          body: "Le leadership technique, c'est d'abord de la clarté : qui fait quoi, pourquoi, et comment on vérifie.",
          points: [
            "Les tests sont un contrat d'équipe, pas une corvée individuelle",
            "Une base testée rend les réécritures sereines",
            "Assigner selon les forces > assigner également",
          ],
        },
      ],
    },
    en: {
      meta: [
        { k: "Role", v: "Team lead" },
        { k: "Team", v: "6 developers" },
        { k: "Stack", v: "Java · JUnit" },
        { k: "Setting", v: "ÉTS — Test & Maintenance" },
      ],
      sections: [
        {
          num: "01",
          title: "Context",
          body: "A personal-finance application (accounts, budgets, transactions) delivered by a team of six, in a course graded on test quality and maintainability.",
          points: [
            "Java Swing · MVC architecture",
            "Multi-account management, budgets and reports",
            "Legacy codebase to evolve without regression",
            "Graded on coverage and testing rigor",
          ],
        },
        {
          num: "02",
          title: "Role: team lead",
          body: "I took coordination: knowing each member's strengths, assigning tasks fairly, keeping the pace — and shipping my own share.",
          points: [
            "Task assignment based on individual strengths",
            "Cross-reviews before every merge",
            "Progress tracking and calm follow-ups",
            "Team testimonials: “an excellent leader”",
          ],
        },
        {
          num: "03",
          title: "Approach: TDD",
          kind: "pyramid",
          body: "Tests first where the module allowed it: every critical ledger behavior locked by a test before refactoring.",
        },
        {
          num: "04",
          title: "Results",
          body: "A 133-test suite that made fearless refactoring possible, and an on-time delivery.",
          results: [
            { value: "133", label: "tests" },
            { value: "6", label: "developers coordinated" },
            { value: "full*", label: "coverage as reported" },
            { value: "100%", label: "delivered on time" },
          ],
        },
        {
          num: "05",
          title: "Lessons",
          body: "Technical leadership is first about clarity: who does what, why, and how it is verified.",
          points: [
            "Tests are a team contract, not an individual chore",
            "A tested base makes refactors calm",
            "Assigning by strengths beats assigning equally",
          ],
        },
      ],
    },
  },

  cadence: {
    fr: {
      meta: [
        { k: "Rôle", v: "Cofondateur · Tech Lead" },
        { k: "Marché", v: "Coachs du Québec" },
        { k: "Stack", v: "Expo · Supabase" },
        { k: "Statut", v: "En développement" },
      ],
      sections: [
        {
          num: "01",
          title: "Contexte",
          body: "Cadence relie coachs et athlètes : programmes, suivi, communication. Cofondée avec Alexandre Boisvert (design) pour le marché francophone.",
          points: [
            "Analyse de 8+ applications concurrentes",
            "Cible : coachs francophones mal servis par les outils anglophones",
            "Conformité à la Loi 25 et à la LPRPDE pensée dès le cadrage",
            "Page de présentation Next.js en ligne",
          ],
        },
        {
          num: "02",
          title: "Méthode : planifier d'abord",
          body: "Avant la première ligne de code : 169+ tâches structurées couvrant 74/74 fonctionnalités, réparties sur 13 cycles de deux semaines.",
          points: [
            "169+ tâches GitHub structurées (étiquettes, jalons, critères)",
            "74/74 fonctionnalités reliées à une tâche",
            "Architecture Expo/React Native + Supabase décidée et documentée",
            "Rôles clairs : produit et design (Alexandre) · technique (Ralph)",
          ],
        },
        {
          num: "03",
          title: "Plan de livraison",
          kind: "sprints",
          body: "13 cycles de deux semaines, quatre phases — du cadrage à la version d'essai. Survole les segments.",
        },
        {
          num: "04",
          title: "Résultats (à date)",
          body: "Le pari : une exécution sans surprise parce que tout a été pensé avant.",
          results: [
            { value: "169+", label: "issues structurées" },
            { value: "74/74", label: "fonctionnalités couvertes" },
            { value: "13", label: "cycles planifiés" },
            { value: "8+", label: "applications étudiées" },
          ],
        },
        {
          num: "05",
          title: "Apprentissages",
          body: "Cofonder, c'est décider à deux : le design et la tech se contraignent mutuellement, et c'est une force.",
          points: [
            "La planification est un livrable en soi",
            "Analyser la concurrence évite de construire la mauvaise chose",
            "La conformité coûte moins cher pensée d'avance",
          ],
        },
      ],
    },
    en: {
      meta: [
        { k: "Role", v: "Co-founder · Tech Lead" },
        { k: "Market", v: "Québec coaches" },
        { k: "Stack", v: "Expo · Supabase" },
        { k: "Status", v: "In development" },
      ],
      sections: [
        {
          num: "01",
          title: "Context",
          body: "Cadence connects coaches and athletes: programs, tracking, communication. Co-founded with Alexandre Boisvert (design) for the francophone market.",
          points: [
            "Competitive audit of 8+ existing apps",
            "Target: francophone coaches underserved by anglophone tools",
            "Law 25 · PIPEDA compliance considered from framing",
            "Next.js landing live",
          ],
        },
        {
          num: "02",
          title: "Method: plan first",
          body: "Before the first line of code: 169+ structured issues covering 74/74 features, spread across 13 sprints.",
          points: [
            "169+ structured GitHub issues (labels, milestones, criteria)",
            "74/74 features traced to issues",
            "Expo/React Native + Supabase architecture decided via ADRs",
            "Clear roles: product/design (Alexandre) · tech (Ralph)",
          ],
        },
        {
          num: "03",
          title: "Delivery plan",
          kind: "sprints",
          body: "13 sprints, four phases — from framing to beta. Hover the segments.",
        },
        {
          num: "04",
          title: "Results (to date)",
          body: "The bet: execution without surprises because everything was thought through first.",
          results: [
            { value: "169+", label: "structured issues" },
            { value: "74/74", label: "features covered" },
            { value: "13", label: "planned sprints" },
            { value: "8+", label: "apps audited" },
          ],
        },
        {
          num: "05",
          title: "Lessons",
          body: "Co-founding means deciding together: design and tech constrain each other, and that is a strength.",
          points: [
            "Planning is a deliverable in itself",
            "A competitive audit avoids building the wrong thing",
            "Compliance is cheaper when designed up front",
          ],
        },
      ],
    },
  },

  vibe: {
    fr: {
      meta: [
        { k: "Rôle", v: "Concepteur de produit" },
        { k: "Type", v: "Maquette détaillée" },
        { k: "Stack", v: "OpenAI · Maps · GTFS" },
        { k: "Statut", v: "Prototype" },
      ],
      sections: [
        {
          num: "01",
          title: "Le problème",
          body: "« Qu'est-ce qu'on fait à Montréal ce soir ? » — la question la plus courante, la pire à répondre. Les apps existantes listent des lieux ; aucune ne décide.",
          points: [
            "Recherche par ambiance (7 au total) plutôt que par catégorie",
            "Contraintes réelles : l'heure, le budget, la distance en transport",
            "Cible : résidents et nouveaux arrivants du Grand Montréal",
          ],
        },
        {
          num: "02",
          title: "Deux signatures",
          body: "Deux fonctionnalités portent tout le concept — le reste est du support.",
          decisions: [
            {
              title: "STM Pulse",
              cons: "Le transport décide de ce qui est faisable ce soir.",
              choice: "Flux GTFS de la STM intégré à la suggestion.",
              trade: "Dépendance à une donnée externe.",
              effect: "Chaque suggestion est atteignable, pas juste jolie.",
            },
            {
              title: "Vibe AI",
              cons: "Une liste de lieux ne répond pas à la question.",
              choice: "Requête en langage naturel → un plan de soirée.",
              trade: "Coût par requête et latence.",
              effect: "L'app décide au lieu de faire chercher.",
            },
          ],
        },
        {
          num: "03",
          title: "État actuel",
          body: "Maquette détaillée mobile et ordinateur, prête à être développée.",
          results: [
            { value: "7", label: "ambiances conçues" },
            { value: "2", label: "plateformes maquettées" },
            { value: "3", label: "sources de données" },
          ],
        },
      ],
    },
    en: {
      meta: [
        { k: "Role", v: "Product designer" },
        { k: "Type", v: "Hi-fi prototype" },
        { k: "Stack", v: "OpenAI · Maps · GTFS" },
        { k: "Status", v: "Prototype" },
      ],
      sections: [
        {
          num: "01",
          title: "The problem",
          body: "“What do we do in Montréal tonight?” — the most common question, the worst to answer. Existing apps list places; none of them decides.",
          points: [
            "Search across 7 moods rather than categories",
            "Real constraints: time, budget, transit distance",
            "Target: Greater Montréal residents and newcomers",
          ],
        },
        {
          num: "02",
          title: "Two signatures",
          body: "Two features carry the whole concept — the rest is support.",
          decisions: [
            {
              title: "STM Pulse",
              cons: "Transit decides what is feasible tonight.",
              choice: "STM GTFS feed integrated into the suggestion.",
              trade: "Dependency on external data.",
              effect: "Every suggestion is reachable, not just pretty.",
            },
            {
              title: "Vibe AI",
              cons: "A list of places does not answer the question.",
              choice: "Natural-language query → an evening plan.",
              trade: "Cost per query and latency.",
              effect: "The app decides instead of making you search.",
            },
          ],
        },
        {
          num: "03",
          title: "Current state",
          body: "Hi-fi mobile and desktop prototype, ready to be built.",
          results: [
            { value: "7", label: "moods designed" },
            { value: "2", label: "platforms mocked" },
            { value: "3", label: "data sources" },
          ],
        },
      ],
    },
  },

  "wise-wealthy": {
    fr: {
      meta: [
        { k: "Rôle", v: "Concepteur & développeur" },
        { k: "Équipe", v: "3 cofondateurs" },
        { k: "Stack", v: "Next.js · TypeScript · IA" },
        { k: "Statut", v: "En développement" },
      ],
      sections: [
        {
          num: "01",
          title: "Contexte",
          body: "Sao Saint-Vil et Mathis Labonté avaient une vision d'accompagnement financier accessible ; j'ai été le bras technique, de la demande initiale à la réalisation.",
          points: [
            "Accompagnement financier assisté par IA, pour le public francophone",
            "Design system bilingue, thèmes clair et sombre",
            "Technologies visées : Next.js + TypeScript",
          ],
        },
        {
          num: "02",
          title: "Mon apport",
          body: "Traduire une idée de produit en système : composants, tokens, structure de pages, puis implémentation.",
          points: [
            "Système de design complet avant la première page",
            "Architecture Next.js App Router",
            "Décisions expliquées à des cofondateurs non techniques",
          ],
        },
        {
          num: "03",
          title: "Retour des cofondateurs",
          body: "Le résultat, dans leurs mots : une plateforme fidèle à leur vision, livrée dans les délais.",
          results: [
            { value: "2", label: "témoignages cofondateurs" },
            { value: "2", label: "langues · 2 thèmes" },
            { value: "100%", label: "échéances respectées" },
          ],
        },
      ],
    },
    en: {
      meta: [
        { k: "Role", v: "Designer & developer" },
        { k: "Team", v: "3 co-founders" },
        { k: "Stack", v: "Next.js · TypeScript · AI" },
        { k: "Status", v: "In development" },
      ],
      sections: [
        {
          num: "01",
          title: "Context",
          body: "Sao Saint-Vil and Mathis Labonté had a vision for accessible financial coaching; I was the technical arm, from brief to implementation.",
          points: [
            "AI-assisted financial coaching, for a francophone audience",
            "Bilingual design system, light and dark themes",
            "Technical target: Next.js + TypeScript",
          ],
        },
        {
          num: "02",
          title: "My contribution",
          body: "Translating a product idea into a system: components, tokens, page structure, then implementation.",
          points: [
            "Full design system before the first page",
            "Next.js App Router architecture",
            "Decisions explained to non-technical co-founders",
          ],
        },
        {
          num: "03",
          title: "Co-founder feedback",
          body: "The result, in their words: a platform true to their vision, delivered on time.",
          results: [
            { value: "2", label: "co-founder testimonials" },
            { value: "2", label: "languages · 2 themes" },
            { value: "100%", label: "deadlines met" },
          ],
        },
      ],
    },
  },

  "kim-dubois": {
    fr: {
      meta: [
        { k: "Rôle", v: "Concepteur & développeur" },
        { k: "Jalon", v: "1er client payant" },
        { k: "Stack", v: "HTML · CSS · JS" },
        { k: "Statut", v: "Livré" },
      ],
      sections: [
        {
          num: "01",
          title: "Le premier client",
          body: "Kim Dubois, photographe, avait besoin d'une vitrine crédible. Premier mandat payant : de la demande à la mise en ligne, seul.",
          points: [
            "Identité visuelle chaleureuse, centrée sur les photos",
            "Structure simple : galerie, forfaits, contact",
            "Bilingue FR/EN, responsive",
            "Sans cadriciel : rapidité et coût d'hébergement minimal",
          ],
        },
        {
          num: "02",
          title: "Ce que ça m'a appris",
          body: "Le code n'était pas la partie difficile — c'était de traduire un besoin flou en décisions claires, et de les expliquer.",
          points: [
            "Cadrer avant de coder évite deux refontes",
            "Un client non technique a besoin du pourquoi, pas du comment",
            "Livrer petit et en ligne bat livrer parfait et en retard",
          ],
        },
        {
          num: "03",
          title: "Résultat",
          body: "Site livré, en ligne, et un témoignage client qui a ouvert les mandats suivants.",
          results: [
            { value: "1", label: "premier client payant" },
            { value: "2", label: "langues livrées" },
            { value: "0", label: "dépendance externe" },
          ],
        },
      ],
    },
    en: {
      meta: [
        { k: "Role", v: "Designer & developer" },
        { k: "Milestone", v: "1st paying client" },
        { k: "Stack", v: "HTML · CSS · JS" },
        { k: "Status", v: "Shipped" },
      ],
      sections: [
        {
          num: "01",
          title: "The first client",
          body: "Kim Dubois, a photographer, needed a credible showcase. First paid mandate: from brief to launch, solo.",
          points: [
            "Warm visual identity, photo-centred",
            "Simple structure: gallery, packages, contact",
            "Bilingual FR/EN, responsive",
            "No framework: speed and minimal hosting cost",
          ],
        },
        {
          num: "02",
          title: "What it taught me",
          body: "The code was not the hard part — it was translating a fuzzy need into clear decisions, and explaining them.",
          points: [
            "Framing before coding avoids two redesigns",
            "A non-technical client needs the why, not the how",
            "Shipping small and live beats shipping perfect and late",
          ],
        },
        {
          num: "03",
          title: "Result",
          body: "Site delivered, live, and a client testimonial that opened the following mandates.",
          results: [
            { value: "1", label: "first paying client" },
            { value: "2", label: "languages shipped" },
            { value: "0", label: "framework dependencies" },
          ],
        },
      ],
    },
  },

  "boa-traiteur": {
    fr: {
      meta: [
        { k: "Rôle", v: "Concepteur de produit" },
        { k: "Type", v: "Concept" },
        { k: "Stack", v: "Next.js (visé)" },
        { k: "Statut", v: "Cadrage" },
      ],
      sections: [
        {
          num: "01",
          title: "L'idée",
          body: "Réserver un chef privé devrait être aussi simple que réserver une table. BOA explore ce parcours : chef, menu, date, service à domicile.",
          points: [
            "Deux faces : le client qui réserve, le chef qui gère",
            "Contrainte : la disponibilité et le menu changent ensemble",
            "Statut assumé : cadrage produit, pas encore de code",
          ],
        },
        {
          num: "02",
          title: "Pourquoi le montrer",
          body: "Un portfolio honnête montre aussi ce qui est en réflexion — et ce que je ferais avant d'écrire la première ligne.",
          points: [
            "Cadrage avant code : la leçon de Cadence, réappliquée",
            "Prochaine étape : maquetter le parcours de réservation",
          ],
        },
      ],
    },
    en: {
      meta: [
        { k: "Role", v: "Product designer" },
        { k: "Type", v: "Concept" },
        { k: "Stack", v: "Next.js (target)" },
        { k: "Status", v: "Framing" },
      ],
      sections: [
        {
          num: "01",
          title: "The idea",
          body: "Booking a private chef should be as simple as booking a table. BOA explores that flow: chef, menu, date, at-home service.",
          points: [
            "Two sides: the client who books, the chef who manages",
            "Constraint: availability and menu change together",
            "Honest status: product framing, no code yet",
          ],
        },
        {
          num: "02",
          title: "Why show it",
          body: "An honest portfolio also shows what is being thought through — and what I would do before writing the first line.",
          points: [
            "Framing before code: the Cadence lesson, reapplied",
            "Next step: prototype the booking flow",
          ],
        },
      ],
    },
  },

  "dpm-elevate": {
    fr: {
      meta: [
        { k: "Rôle", v: "Fondateur · Design & Développement" },
        { k: "Type", v: "App web (issue d'une maquette)" },
        { k: "Stack", v: "Next.js · tRPC · Prisma" },
        { k: "Statut", v: "Déployée · en développement actif" },
      ],
      sections: [
        {
          num: "01",
          title: "La maquette",
          body: "Au départ, une application personnelle de planification dessinée comme une maquette détaillée : tout le cycle de productivité — calendrier, tâches, focus, habitudes, objectifs — dans un seul produit cohérent.",
          points: [
            "20+ écrans couvrant tout le parcours, du landing au compte",
            "Tâches en 5 vues · matrice Eisenhower · focus Pomodoro",
            "Moteur de science comportementale (chronotype, MCII, CBT)",
            "Bilingue FR/EN, clair/sombre",
          ],
        },
        {
          num: "02",
          title: "Système de conception",
          body: "Un design system complet avant les écrans : tokens, composants, palette de commandes ⌘K, dates dynamiques.",
          points: [
            "25+ composants réutilisables",
            "Palette de commandes ⌘K et création rapide",
            "Conforme WCAG AA · responsive desktop + mobile",
          ],
        },
        {
          num: "03",
          title: "Aujourd'hui : déployée",
          body: "DPM Elevate est maintenant un vrai produit Next.js déployé : synchronisation réelle des calendriers Google et Microsoft, authentification multi-fournisseurs, jetons OAuth chiffrés (AES-256-GCM), row-level security et conformité Loi 25 (export et suppression en libre-service). Je continue de le développer en solo.",
          results: [
            { value: "Déployée", label: "sur Vercel" },
            { value: "5", label: "fournisseurs d'authentification" },
            { value: "AES-256", label: "jetons chiffrés au repos" },
            { value: "Loi 25", label: "export + suppression" },
          ],
        },
      ],
    },
    en: {
      meta: [
        { k: "Role", v: "Founder · Design & Development" },
        { k: "Type", v: "Web app (from a mockup)" },
        { k: "Stack", v: "Next.js · tRPC · Prisma" },
        { k: "Status", v: "Deployed · actively developed" },
      ],
      sections: [
        {
          num: "01",
          title: "The mockup",
          body: "It started as a personal planning app designed as a detailed mockup: the whole productivity cycle — calendar, tasks, focus, habits, goals — in one coherent product.",
          points: [
            "20+ screens spanning the full journey, from landing to account",
            "Tasks across 5 views · Eisenhower matrix · Pomodoro focus",
            "Behavioural-science engine (chronotype, MCII, CBT)",
            "Bilingual FR/EN, light/dark",
          ],
        },
        {
          num: "02",
          title: "Design system",
          body: "A complete design system before the screens: tokens, components, ⌘K command palette, live dynamic dates.",
          points: [
            "25+ reusable components",
            "⌘K command palette and quick-create",
            "WCAG AA compliant · responsive desktop + mobile",
          ],
        },
        {
          num: "03",
          title: "Today: deployed",
          body: "DPM Elevate is now a real, deployed Next.js product: real Google and Microsoft calendar sync, multi-provider authentication, OAuth tokens encrypted (AES-256-GCM), row-level security and Loi 25 compliance (self-serve export and deletion). I keep building it solo.",
          results: [
            { value: "Deployed", label: "on Vercel" },
            { value: "5", label: "auth providers" },
            { value: "AES-256", label: "tokens encrypted at rest" },
            { value: "Loi 25", label: "export + deletion" },
          ],
        },
      ],
    },
  },

  crcc: {
    fr: {
      meta: [
        { k: "Rôle", v: "Design & Prototypage (Refonte)" },
        { k: "Type", v: "Maquette bilingue" },
        { k: "Stack", v: "HTML · CSS · JS" },
        { k: "Statut", v: "Livré" },
      ],
      sections: [
        {
          num: "01",
          title: "Contexte",
          body: "Refonte complète du site d'un OSBL bilingue d'éleveurs (Club du Rex de Cornouailles du Canada), organisée autour de trois parcours : adopter, devenir membre, soutenir.",
          points: [
            "10 pages, de l'accueil à l'annuaire des éleveurs",
            "Explorateur d'anatomie interactif et carte de répartition filtrable",
            "Identité Rouge & Blanc dérivée du logo officiel",
            "Données réelles intégrées, sans surpromettre",
          ],
        },
        {
          num: "02",
          title: "Approche",
          body: "Un site statique multi-pages, accessible et bilingue, sans backend — pensé mobile d'abord.",
          points: [
            "Bilingue FR/EN à bascule instantanée",
            "Thème clair/sombre · mobile-first (375px → bureau)",
            "Accessibilité WCAG 2.2 AA",
          ],
        },
        {
          num: "03",
          title: "Résultat",
          body: "Une maquette de refonte livrée, fidèle à la mission de l'organisme et prête à être mise en ligne.",
          results: [
            { value: "10", label: "pages livrées" },
            { value: "11", label: "chatteries · données réelles" },
            { value: "AA", label: "WCAG 2.2" },
            { value: "2", label: "langues · clair/sombre" },
          ],
        },
      ],
    },
    en: {
      meta: [
        { k: "Role", v: "Design & Prototyping (Redesign)" },
        { k: "Type", v: "Bilingual mockup" },
        { k: "Stack", v: "HTML · CSS · JS" },
        { k: "Status", v: "Shipped" },
      ],
      sections: [
        {
          num: "01",
          title: "Context",
          body: "Complete redesign of a bilingual breeder nonprofit's site (Cornwall Rex Club of Canada), organised around three journeys: adopt, become a member, support.",
          points: [
            "10 pages, from home to the breeder directory",
            "Interactive anatomy explorer and filterable distribution map",
            "Red & White identity derived from the official logo",
            "Real data integrated, without overpromising",
          ],
        },
        {
          num: "02",
          title: "Approach",
          body: "A static multi-page site, accessible and bilingual, with no backend — built mobile-first.",
          points: [
            "Bilingual FR/EN with instant toggle",
            "Light/dark theme · mobile-first (375px → desktop)",
            "WCAG 2.2 AA accessibility",
          ],
        },
        {
          num: "03",
          title: "Result",
          body: "A redesign mockup delivered, true to the organisation's mission and ready to go live.",
          results: [
            { value: "10", label: "pages delivered" },
            { value: "11", label: "catteries · real data" },
            { value: "AA", label: "WCAG 2.2" },
            { value: "2", label: "languages · light/dark" },
          ],
        },
      ],
    },
  },

  tatzy: {
    fr: {
      meta: [
        { k: "Rôle", v: "Cofondateur · Développement" },
        { k: "Type", v: "Prototype déployé" },
        { k: "Stack", v: "Next.js 14 · Prisma · PostgreSQL" },
        { k: "Statut", v: "Prototype · déployé" },
      ],
      sections: [
        {
          num: "01",
          title: "Contexte",
          body: "Site de réservation de taxi en ligne (Tatzy), cofondé avec Aimen Djebbar.",
          points: [
            "Monorepo web + API",
            "Page d'accueil et tunnel de réservation",
            "Bilingue FR/EN",
            "Déployé sur Vercel",
          ],
        },
        {
          num: "02",
          title: "Approche",
          body: "Next.js 14 (App Router) côté web, Prisma et PostgreSQL côté données, avec i18n et validation.",
          points: ["Next.js 14 · TypeScript · Tailwind", "Prisma + PostgreSQL", "next-intl (FR/EN) · Zod"],
        },
        {
          num: "03",
          title: "État",
          body: "Un prototype fonctionnel déployé — encore au stade prototype, sans trafic client réel.",
          results: [
            { value: "Live", label: "déployé sur Vercel" },
            { value: "2", label: "cofondateurs" },
            { value: "FR/EN", label: "bilingue" },
            { value: "web+API", label: "monorepo" },
          ],
        },
      ],
    },
    en: {
      meta: [
        { k: "Role", v: "Co-founder · Development" },
        { k: "Type", v: "Deployed prototype" },
        { k: "Stack", v: "Next.js 14 · Prisma · PostgreSQL" },
        { k: "Status", v: "Prototype · deployed" },
      ],
      sections: [
        {
          num: "01",
          title: "Context",
          body: "An online taxi-booking site (Tatzy), co-founded with Aimen Djebbar.",
          points: ["Web + API monorepo", "Landing page and booking flow", "Bilingual FR/EN", "Deployed on Vercel"],
        },
        {
          num: "02",
          title: "Approach",
          body: "Next.js 14 (App Router) on the web, Prisma and PostgreSQL for data, with i18n and validation.",
          points: ["Next.js 14 · TypeScript · Tailwind", "Prisma + PostgreSQL", "next-intl (FR/EN) · Zod"],
        },
        {
          num: "03",
          title: "State",
          body: "A working prototype, deployed — still at prototype stage, no real customer traffic.",
          results: [
            { value: "Live", label: "deployed on Vercel" },
            { value: "2", label: "co-founders" },
            { value: "FR/EN", label: "bilingual" },
            { value: "web+API", label: "monorepo" },
          ],
        },
      ],
    },
  },

  log430: {
    fr: {
      meta: [
        { k: "Rôle", v: "Développeur (majoritairement solo)" },
        { k: "Type", v: "Travaux d'architecture (ÉTS)" },
        { k: "Stack", v: "Python · Docker · Kafka · PostgreSQL" },
        { k: "Statut", v: "Académique" },
      ],
      sections: [
        {
          num: "01",
          title: "Contexte",
          body: "Cours d'architecture logicielle à l'ÉTS : une même application de gestion de magasin est réarchitecturée d'un laboratoire à l'autre.",
          points: [
            "Du monolithe conteneurisé aux microservices",
            "API REST puis GraphQL",
            "Cache, répartition de charge, observabilité",
            "Saga, Kafka et bases de données distribuées",
          ],
        },
        {
          num: "02",
          title: "Le parcours",
          body: "Chaque labo ajoute une contrainte de production et le système est réarchitecturé en conséquence.",
          points: [
            "DAO · CQRS · DDD · persistance polyglotte (PostgreSQL + Redis)",
            "Passerelle d'API (KrakenD / Kong) · tests de charge (Locust)",
            "Saga orchestrée + traçage distribué (Jaeger)",
            "Event sourcing + patron Outbox (Kafka) · YugabyteDB / CockroachDB",
          ],
        },
        {
          num: "03",
          title: "Projet de fin — CanTelcoX",
          body: "Le projet de fin de session regroupe le tout : 5 microservices DDD, une base par service, derrière une passerelle Kong en haute disponibilité.",
          results: [
            { value: "12", label: "dépôts · monolithe → microservices" },
            { value: "5", label: "microservices DDD (une base/service)" },
            { value: "REST+GraphQL", label: "+ Kafka · Saga" },
            { value: "Grafana", label: "observabilité Prometheus" },
          ],
        },
      ],
    },
    en: {
      meta: [
        { k: "Role", v: "Developer (mostly solo)" },
        { k: "Type", v: "Architecture coursework (ÉTS)" },
        { k: "Stack", v: "Python · Docker · Kafka · PostgreSQL" },
        { k: "Status", v: "Academic" },
      ],
      sections: [
        {
          num: "01",
          title: "Context",
          body: "ÉTS software-architecture course: a single store-management app is re-architected from one lab to the next.",
          points: [
            "From a containerized monolith to microservices",
            "REST then GraphQL APIs",
            "Caching, load balancing, observability",
            "Saga, Kafka and distributed databases",
          ],
        },
        {
          num: "02",
          title: "The journey",
          body: "Each lab adds a production constraint and the system is re-architected to meet it.",
          points: [
            "DAO · CQRS · DDD · polyglot persistence (PostgreSQL + Redis)",
            "API gateway (KrakenD / Kong) · load testing (Locust)",
            "Orchestrated saga + distributed tracing (Jaeger)",
            "Event sourcing + Outbox pattern (Kafka) · YugabyteDB / CockroachDB",
          ],
        },
        {
          num: "03",
          title: "Capstone — CanTelcoX",
          body: "The capstone consolidates it all: 5 DDD microservices, a database per service, behind a high-availability Kong gateway.",
          results: [
            { value: "12", label: "repos · monolith → microservices" },
            { value: "5", label: "DDD microservices (db per service)" },
            { value: "REST+GraphQL", label: "+ Kafka · Saga" },
            { value: "Grafana", label: "Prometheus observability" },
          ],
        },
      ],
    },
  },

  log210: {
    fr: {
      meta: [
        { k: "Rôle", v: "Développeur · équipe de 6" },
        { k: "Type", v: "Analyse & conception (ÉTS)" },
        { k: "Stack", v: "TypeScript · Express · Jest" },
        { k: "Statut", v: "Académique" },
      ],
      sections: [
        {
          num: "01",
          title: "Contexte",
          body: "Laboratoire d'analyse et de conception logicielle à l'ÉTS, en équipe de 6 (GitHub Classroom).",
          points: [
            "Modèle du domaine UML et cas d'utilisation",
            "Application de gestion de cours et de devoirs",
            "Rapports d'itération",
          ],
        },
        {
          num: "02",
          title: "Conception",
          body: "Conception en couches appuyée sur le patron GRASP Contrôleur, avec une passerelle/adaptateur vers le backend.",
          points: [
            "Un contrôleur par entité du domaine",
            "Express : routes, sessions, JWT",
            "Suite de tests Jest avec couverture",
          ],
        },
        {
          num: "03",
          title: "Résultat",
          body: "Une application modélisée et implémentée en équipe, avec des tests et des artefacts de conception à l'appui.",
          results: [
            { value: "6", label: "coéquipiers" },
            { value: "UML", label: "modèle du domaine · cas d'usage" },
            { value: "GRASP", label: "patron Contrôleur" },
            { value: "Jest", label: "tests avec couverture" },
          ],
        },
      ],
    },
    en: {
      meta: [
        { k: "Role", v: "Developer · team of 6" },
        { k: "Type", v: "Analysis & design (ÉTS)" },
        { k: "Stack", v: "TypeScript · Express · Jest" },
        { k: "Status", v: "Academic" },
      ],
      sections: [
        {
          num: "01",
          title: "Context",
          body: "Software analysis-and-design lab at ÉTS, in a team of 6 (GitHub Classroom).",
          points: [
            "UML domain model and use cases",
            "A course-and-assignment management app",
            "Iteration reports",
          ],
        },
        {
          num: "02",
          title: "Design",
          body: "A layered design built on the GRASP Controller pattern, with a gateway/adapter to the backend.",
          points: ["One controller per domain entity", "Express: routes, sessions, JWT", "Jest test suite with coverage"],
        },
        {
          num: "03",
          title: "Result",
          body: "An app modelled and built as a team, backed by tests and design artifacts.",
          results: [
            { value: "6", label: "teammates" },
            { value: "UML", label: "domain model · use cases" },
            { value: "GRASP", label: "Controller pattern" },
            { value: "Jest", label: "tests with coverage" },
          ],
        },
      ],
    },
  },

  gti350: {
    fr: {
      meta: [
        { k: "Rôle", v: "Développeur · équipe de 2" },
        { k: "Type", v: "Jeu · interfaces (ÉTS)" },
        { k: "Stack", v: "JavaScript · Canvas HTML5" },
        { k: "Statut", v: "Académique" },
      ],
      sections: [
        {
          num: "01",
          title: "Contexte",
          body: "Jeu « Tron » 2 joueurs en JavaScript vanilla, pour le cours d'interfaces utilisateurs à l'ÉTS (équipe de 2).",
          points: [
            "Rendu sur Canvas HTML5",
            "Deux modes d'entrée : clavier (QWERTY/AZERTY) et gestes de souris",
            "Détection de collisions (traînées + murs)",
            "Score multi-manches",
          ],
        },
        {
          num: "02",
          title: "Conception",
          body: "Une architecture modulaire pensée pour le travail en parallèle sur Git, avec une boucle de jeu maîtrisée.",
          points: [
            "9 modules à responsabilité unique",
            "Boucle setTimeout (jamais hors de l'état RUNNING)",
            "Ordre « avancer → vérifier → dessiner » pour éviter les collisions à un pixel près",
          ],
        },
        {
          num: "03",
          title: "Résultat",
          body: "Un jeu jouable, testé à deux, avec 8 fonctionnalités livrées.",
          results: [
            { value: "9", label: "modules · ~460 lignes" },
            { value: "2", label: "modes d'entrée" },
            { value: "2", label: "coéquipiers" },
            { value: "Jouable", label: "en ligne" },
          ],
        },
      ],
    },
    en: {
      meta: [
        { k: "Role", v: "Developer · team of 2" },
        { k: "Type", v: "Game · UI (ÉTS)" },
        { k: "Stack", v: "JavaScript · HTML5 Canvas" },
        { k: "Status", v: "Academic" },
      ],
      sections: [
        {
          num: "01",
          title: "Context",
          body: "A two-player \"Tron\" game in vanilla JavaScript, for ÉTS's user-interfaces course (team of 2).",
          points: [
            "Rendered on an HTML5 Canvas",
            "Two input modes: keyboard (QWERTY/AZERTY) and mouse gestures",
            "Collision detection (trails + walls)",
            "Multi-round scoring",
          ],
        },
        {
          num: "02",
          title: "Design",
          body: "A modular architecture designed for parallel Git work, with a carefully controlled game loop.",
          points: [
            "9 single-responsibility modules",
            "setTimeout loop (never runs outside the RUNNING state)",
            "\"advance → check → draw\" order to avoid off-by-one collisions",
          ],
        },
        {
          num: "03",
          title: "Result",
          body: "A playable game, tested by two, with 8 features shipped.",
          results: [
            { value: "9", label: "modules · ~460 lines" },
            { value: "2", label: "input modes" },
            { value: "2", label: "teammates" },
            { value: "Playable", label: "online" },
          ],
        },
      ],
    },
  },
};
