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
        { k: "Rôle", v: "Seul développeur" },
        { k: "Durée", v: "~3 mois (1re version)" },
        { k: "Stack", v: "Next.js · PostgreSQL" },
        { k: "Statut", v: "En production" },
      ],
      sections: [
        {
          num: "01",
          title: "Contexte",
          body: "Une place de marché d'impression à la demande pensée pour valoriser les idées créatives, avec un partage des profits transparent.",
          points: [
            "Partage des profits : 10–20 % aux porteurs d'idées, 20–35 % aux designers",
            "3 rôles utilisateurs : admin, créateur, client",
            "4 devises (CAD, USD, EUR, GBP) et 2 langues",
            "7+ services externes branchés, maintenus par un seul développeur",
          ],
        },
        {
          num: "02",
          title: "Contraintes",
          body: "Une première version rapide, sécurisée dès le premier paiement, conforme dès le jour 1.",
          points: [
            "~3 mois pour la première version",
            "Paiements réels dès le lancement : sécurité non négociable",
            "Conformité au RGPD, à la Loi 25 et à la Loi 96 dès le jour 1",
            "Client non technique : chaque décision lui est expliquée",
          ],
        },
        {
          num: "03",
          title: "Décisions",
          body: "Trois décisions d'architecture ont défini le projet — chacune un compromis assumé.",
          decisions: [
            {
              title: "WordPress ou solution sur mesure ?",
              cons: "Première version en ~3 mois, un seul développeur, multidevise.",
              choice: "Next.js sur mesure (App Router).",
              trade: "Plus de code initial à écrire.",
              effect: "Traitements en périphérie et processus complexes rendus possibles.",
            },
            {
              title: "Sécurité des paiements",
              cons: "Paiements réels dès le lancement.",
              choice: "Notifications Stripe signées (HMAC) + limitation du débit.",
              trade: "Chemins d'erreur plus longs à coder.",
              effect: "Résiste aux requêtes falsifiées et aux notifications dupliquées.",
            },
            {
              title: "Organisation des processus",
              cons: "4 processus métier à maintenir seul.",
              choice: "Modules isolés par processus.",
              trade: "Un peu de duplication structurelle.",
              effect: "4e processus (fidélité) ajouté en quelques jours.",
            },
          ],
        },
        {
          num: "04",
          title: "Architecture",
          kind: "flow",
          body: "Le chemin d'une commande, du client au fulfillment : requête → API vérifiée par signature (HMAC) → Prisma/PostgreSQL → traitement automatisé Gelato/Stripe, sans intervention manuelle.",
        },
        {
          num: "05",
          title: "Résultats",
          body: "Le gain le plus concret : le traitement d'une commande complexe, divisé par plus de deux.",
          results: [
            { value: "~15 000", label: "lignes de TypeScript" },
            { value: "30+", label: "points d'API REST" },
            { value: "4", label: "processus métier" },
            { value: "150–300ms", label: "temps de réponse" },
          ],
        },
        {
          num: "06",
          title: "Apprentissages",
          body: "Les choix structurants ont payé ; l'outillage de test aurait dû venir plus tôt.",
          points: [
            "Next.js sur mesure plutôt que WordPress a rendu possible tout le reste",
            "Processus isolés : le 4e (fidélité) ajouté en quelques jours",
            "À refaire : tests d'intégration Playwright et mode test de Stripe plus tôt",
          ],
        },
      ],
    },
    en: {
      meta: [
        { k: "Role", v: "Sole developer" },
        { k: "Duration", v: "~3 months (MVP)" },
        { k: "Stack", v: "Next.js · PostgreSQL" },
        { k: "Status", v: "In production" },
      ],
      sections: [
        {
          num: "01",
          title: "Context",
          body: "A print-on-demand marketplace built to reward creative ideas, with transparent profit-sharing.",
          points: [
            "Profit-sharing: 10–20% idea-givers, 20–35% designers",
            "3 user roles: admin, creator, client",
            "4 currencies (CAD, USD, EUR, GBP) and 2 languages",
            "7+ external integrations, maintained by a single developer",
          ],
        },
        {
          num: "02",
          title: "Constraints",
          body: "A fast MVP, secured from the first payment, compliant from day 1.",
          points: [
            "~3 months for the MVP",
            "Real payments from launch: security non-negotiable",
            "GDPR, Law 25 and Law 96 compliance from day 1",
            "Non-technical client: every decision explained",
          ],
        },
        {
          num: "03",
          title: "Decisions",
          body: "Three architecture decisions shaped the project — each a deliberate trade-off.",
          decisions: [
            {
              title: "WordPress or custom stack?",
              cons: "MVP in ~3 months, single dev, multi-currency.",
              choice: "Custom Next.js (App Router).",
              trade: "More initial code to write.",
              effect: "Edge Functions and complex workflows made possible.",
            },
            {
              title: "Payment security",
              cons: "Real payments from launch.",
              choice: "HMAC-signed Stripe webhooks + rate limiting.",
              trade: "Longer error paths to code.",
              effect: "Resists forged requests and duplicate webhooks.",
            },
            {
              title: "Workflow organization",
              cons: "4 business workflows to maintain alone.",
              choice: "Modules isolated per workflow.",
              trade: "Some structural duplication.",
              effect: "4th workflow (loyalty) added in days.",
            },
          ],
        },
        {
          num: "04",
          title: "Architecture",
          kind: "flow",
          body: "The path of an order, from client to fulfillment: request → API verified by HMAC signature → Prisma/PostgreSQL → automated Gelato/Stripe fulfillment, no manual step.",
        },
        {
          num: "05",
          title: "Results",
          body: "The most concrete win: complex-order processing, more than halved.",
          results: [
            { value: "~15,000", label: "TypeScript LOC" },
            { value: "30+", label: "REST endpoints" },
            { value: "4", label: "business workflows" },
            { value: "150–300ms", label: "API latency" },
          ],
        },
        {
          num: "06",
          title: "Lessons",
          body: "The structural choices paid off; test tooling should have come earlier.",
          points: [
            "Custom Next.js over WordPress made everything else possible",
            "Isolated workflows: 4th (loyalty) added in days",
            "Next time: Playwright + Stripe test-mode integration tests earlier",
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
        { k: "Rôle", v: "Fondateur · Design & Prototypage" },
        { k: "Type", v: "Prototype haute-fidélité" },
        { k: "Stack", v: "React · Tailwind" },
        { k: "Statut", v: "En développement" },
      ],
      sections: [
        {
          num: "01",
          title: "Contexte",
          body: "Une application de planification holistique : tout le cycle de productivité — calendrier, tâches, focus, habitudes, objectifs — dans un seul produit cohérent.",
          points: [
            "20+ écrans couvrant tout le parcours, du landing au compte",
            "Tâches en 5 vues · matrice Eisenhower · focus Pomodoro",
            "Moteur de science comportementale (chronotype, MCII, CBT)",
            "Nativement bilingue FR/EN, clair/sombre",
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
          title: "État actuel",
          body: "Prototype interactif haute-fidélité, prêt à être développé sur une base Next.js.",
          results: [
            { value: "20+", label: "écrans" },
            { value: "25+", label: "composants" },
            { value: "200+", label: "clés i18n FR/EN" },
            { value: "AA", label: "WCAG conforme" },
          ],
        },
      ],
    },
    en: {
      meta: [
        { k: "Role", v: "Founder · Design & Prototyping" },
        { k: "Type", v: "High-fidelity prototype" },
        { k: "Stack", v: "React · Tailwind" },
        { k: "Status", v: "In development" },
      ],
      sections: [
        {
          num: "01",
          title: "Context",
          body: "A holistic planning application: the whole productivity cycle — calendar, tasks, focus, habits, goals — in one coherent product.",
          points: [
            "20+ screens spanning the full journey, from landing to account",
            "Tasks across 5 views · Eisenhower matrix · Pomodoro focus",
            "Behavioural-science engine (chronotype, MCII, CBT)",
            "Natively bilingual FR/EN, light/dark",
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
          title: "Current state",
          body: "High-fidelity interactive prototype, ready to be built on a Next.js base.",
          results: [
            { value: "20+", label: "screens" },
            { value: "25+", label: "components" },
            { value: "200+", label: "i18n keys FR/EN" },
            { value: "AA", label: "WCAG compliant" },
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
};
