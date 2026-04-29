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
  "the-project": {
    fr: {
      problem: {
        title: "Le problème",
        body: "Le coaching sportif manque d'outils numériques modernes pour la planification d'entraînements et le suivi de performance. Les solutions existantes sont souvent rigides, mal adaptées au mobile, et ne répondent pas aux besoins spécifiques des coachs indépendants.",
        type: "text"
      },
      constraints: {
        title: "Les contraintes",
        body: "L'application doit fonctionner sur mobile (cibles App Store et Play Store), avec un design mobile-first dès le jour 1. Stack moderne requise pour assurer la maintenabilité à long terme et la performance sur appareils mobiles.",
        type: "text"
      },
      approach: {
        title: "La solution",
        body: "Architecture mobile-first avec Next.js 16 et React 19 pour un rendu performant, Supabase pour l'authentification et la base de données temps réel, et Tailwind v4 pour un design system cohérent. L'approche itérative en sprints permet de valider chaque fonctionnalité avec des utilisateurs cibles avant de passer à la suivante.",
        type: "text"
      },
      stack: {
        title: "Stack technique",
        items: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS v4", "Supabase (auth + DB)"],
        type: "list"
      },
      outcomes: {
        title: "Résultats",
        body: "MVP en cours de développement, Sprint 6 ciblé pour la livraison. Design mobile-first validé avec des utilisateurs cibles. Architecture modulaire permettant l'ajout progressif de fonctionnalités sans refactoring majeur.",
        type: "text"
      },
      learnings: {
        title: "Apprentissages",
        body: "Construire mobile-first dès le jour 1 est fondamentalement différent de retrofitter une app desktop pour le mobile. Les décisions d'architecture prises tôt (taille des composants, navigation tactile, gestion du state offline) évitent des refactorings coûteux plus tard.",
        type: "text"
      }
    },
    en: {
      problem: {
        title: "The problem",
        body: "Sports coaching lacks modern digital tools for workout planning and performance tracking. Existing solutions are often rigid, poorly suited to mobile, and fail to meet the specific needs of independent coaches.",
        type: "text"
      },
      constraints: {
        title: "Constraints",
        body: "The app must work on mobile (App Store and Play Store targets), with a mobile-first design from day 1. A modern stack is required to ensure long-term maintainability and performance on mobile devices.",
        type: "text"
      },
      approach: {
        title: "The solution",
        body: "Mobile-first architecture with Next.js 16 and React 19 for performant rendering, Supabase for auth and real-time database, and Tailwind v4 for a cohesive design system. The iterative sprint approach validates each feature with target users before moving on.",
        type: "text"
      },
      stack: {
        title: "Tech stack",
        items: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS v4", "Supabase (auth + DB)"],
        type: "list"
      },
      outcomes: {
        title: "Outcomes",
        body: "MVP in active development, Sprint 6 targeted for delivery. Mobile-first design validated with target users. Modular architecture enables progressive feature additions without major refactoring.",
        type: "text"
      },
      learnings: {
        title: "Learnings",
        body: "Building mobile-first from day 1 is fundamentally different from retrofitting a desktop app for mobile. Early architecture decisions (component sizing, touch navigation, offline state management) prevent costly refactors down the line.",
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
  "dpm-calendar": {
    fr: {
      problem: {
        title: "Le problème",
        body: "Les outils de calendrier existants manquent de fonctionnalités de planification intelligente. Les utilisateurs jonglent entre plusieurs applications pour gérer leur temps, sans avoir de vue unifiée ni d'aide à la prise de décision sur l'allocation de leur temps.",
        type: "text"
      },
      constraints: {
        title: "Les contraintes",
        body: "L'application doit fonctionner en cross-platform (web + cibles mobiles). La gestion des fuseaux horaires et la détection de conflits doivent être fiables dès le départ. Approche progressive web app pour maximiser la portée sans les contraintes des app stores.",
        type: "text"
      },
      approach: {
        title: "La solution",
        body: "Architecture Next.js avec TypeScript pour un typage strict sur la logique de dates et d'événements. Supabase pour la synchronisation temps réel des calendriers entre appareils. Approche progressive web app pour une expérience native sur mobile et desktop sans déploiement via app store.",
        type: "text"
      },
      stack: {
        title: "Stack technique",
        items: ["Next.js", "TypeScript", "Supabase (auth + DB)", "Tailwind CSS"],
        type: "list"
      },
      outcomes: {
        title: "Résultats",
        body: "Application live sur dpm-calendar.vercel.app. Développement actif avec itérations régulières. Synchronisation temps réel fonctionnelle entre appareils.",
        type: "text"
      },
      learnings: {
        title: "Apprentissages",
        body: "L'UX de calendrier exige une gestion minutieuse des fuseaux horaires et de la détection de conflits. Les edge cases liés aux dates (changements d'heure, événements récurrents traversant les fuseaux) sont plus complexes qu'ils n'y paraissent et justifient un investissement précoce dans des tests exhaustifs.",
        type: "text"
      }
    },
    en: {
      problem: {
        title: "The problem",
        body: "Existing calendar tools lack intelligent scheduling features. Users juggle multiple apps to manage their time without a unified view or decision support for time allocation.",
        type: "text"
      },
      constraints: {
        title: "Constraints",
        body: "The app must work cross-platform (web + mobile targets). Timezone handling and conflict detection must be reliable from the start. Progressive web app approach to maximize reach without app store constraints.",
        type: "text"
      },
      approach: {
        title: "The solution",
        body: "Next.js architecture with TypeScript for strict typing on date and event logic. Supabase for real-time calendar sync across devices. Progressive web app approach for a native-like experience on mobile and desktop without app store deployment.",
        type: "text"
      },
      stack: {
        title: "Tech stack",
        items: ["Next.js", "TypeScript", "Supabase (auth + DB)", "Tailwind CSS"],
        type: "list"
      },
      outcomes: {
        title: "Outcomes",
        body: "App live at dpm-calendar.vercel.app. Active development with regular iterations. Real-time sync working across devices.",
        type: "text"
      },
      learnings: {
        title: "Learnings",
        body: "Calendar UX requires careful timezone handling and conflict detection. Date-related edge cases (daylight saving changes, recurring events crossing timezones) are more complex than they appear and justify early investment in comprehensive testing.",
        type: "text"
      }
    }
  },
  "financej": {
    fr: {
      problem: {
        title: "Le problème",
        body: "Une application Java desktop legacy nécessitait une modernisation et l'ajout d'outils de qualité. Le code existant manquait de séparation des responsabilités, rendant les modifications risquées et les tests difficiles.",
        type: "text"
      },
      constraints: {
        title: "Les contraintes",
        body: "Projet académique à l'ÉTS avec architecture MVC requise. Migration vers Java 21 obligatoire. Pipeline Maven avec portes de qualité (quality gates) à mettre en place. Respect des standards de code imposés par l'établissement.",
        type: "text"
      },
      approach: {
        title: "La solution",
        body: "Refactorisation MVC avec le pattern Observer et AbstractTableModel pour découpler les mises à jour de l'interface utilisateur de la logique métier. Pipeline Maven complet avec JUnit pour les tests unitaires, Checkstyle et PMD pour l'analyse statique, et QALab pour le suivi de la qualité dans le temps.",
        type: "text"
      },
      stack: {
        title: "Stack technique",
        items: ["Java 21", "Maven", "JUnit", "Checkstyle", "PMD", "QALab"],
        type: "list"
      },
      outcomes: {
        title: "Résultats",
        body: "Pipeline de qualité complet opérationnel. Migration Java 21 complétée avec succès. Architecture MVC propre avec Observer pattern permettant des extensions sans régression.",
        type: "text"
      },
      learnings: {
        title: "Apprentissages",
        body: "Le pattern Observer découple efficacement les mises à jour de l'UI, permettant d'ajouter de nouvelles vues sans modifier la logique métier. L'analyse statique (Checkstyle, PMD) détecte les problèmes tôt dans le cycle de développement, avant même l'exécution des tests — un filet de sécurité précieux pour du code legacy.",
        type: "text"
      }
    },
    en: {
      problem: {
        title: "The problem",
        body: "A legacy Java desktop application needed modernization and quality tooling. The existing code lacked separation of concerns, making changes risky and testing difficult.",
        type: "text"
      },
      constraints: {
        title: "Constraints",
        body: "Academic project at ÉTS with required MVC architecture. Mandatory Java 21 migration. Maven pipeline with quality gates to implement. Code standards imposed by the institution.",
        type: "text"
      },
      approach: {
        title: "The solution",
        body: "MVC refactoring with Observer pattern and AbstractTableModel to decouple UI updates from business logic. Full Maven pipeline with JUnit for unit testing, Checkstyle and PMD for static analysis, and QALab for quality tracking over time.",
        type: "text"
      },
      stack: {
        title: "Tech stack",
        items: ["Java 21", "Maven", "JUnit", "Checkstyle", "PMD", "QALab"],
        type: "list"
      },
      outcomes: {
        title: "Outcomes",
        body: "Full quality pipeline operational. Java 21 migration completed successfully. Clean MVC architecture with Observer pattern enabling extensions without regressions.",
        type: "text"
      },
      learnings: {
        title: "Learnings",
        body: "The Observer pattern decouples UI updates effectively, allowing new views to be added without touching business logic. Static analysis (Checkstyle, PMD) catches issues early in the development cycle, before tests even run — a valuable safety net for legacy code.",
        type: "text"
      }
    }
  },
  "the-mad-space": {
    fr: {
      problem: {
        title: "Le problème",
        body: "Le client avait besoin d'une plateforme e-commerce capable de gérer 3 rôles utilisateurs (admin, vendeur, client), 4 devises (CAD, USD, EUR, GBP), 2 langues (FR, EN) et plusieurs intégrations externes (Stripe, Gelato, Google Merchant Center) — sans devenir un cauchemar de maintenance pour une équipe d'une seule personne en charge.",
        type: "text"
      },
      constraints: {
        title: "Les contraintes",
        body: "Stack imposée : Next.js / Vercel / Supabase pour rester aligné avec le reste de l'écosystème. Délais serrés (~3 mois pour le MVP). Sécurité non négociable (paiements en production). Documentation à fournir en parallèle pour permettre un onboarding rapide d'un futur 2e dev.",
        type: "text"
      },
      approach: {
        title: "La solution",
        body: "Architecture en couches : Next.js App Router côté front (Server Components par défaut), Prisma comme couche d'accès avec 10 modèles relationnels, et des modules métier isolés pour chaque workflow (commande, retour, inventaire, fidélité). Stripe pour le paiement avec signature webhook HMAC, Gelato pour le print-on-demand via webhooks 300-500 ms, Google Merchant Center pour la diffusion catalogue. Sécurité : rate limiting, cookies HttpOnly, audit logs centralisés.",
        type: "text"
      },
      stack: {
        title: "Stack technique",
        items: ["Next.js (App Router)", "TypeScript strict", "Prisma + PostgreSQL", "Tailwind CSS", "Stripe (paiements)", "Gelato (print-on-demand)", "Google Merchant Center", "Vercel (hébergement)", "Supabase (auth + DB)"],
        type: "list"
      },
      outcomes: {
        title: "Résultats",
        body: "~15 000 LOC TypeScript en production. 20+ APIs REST exposées. 4 workflows métier livrés (commande, retour, inventaire, fidélité). 20-30 déploiements CI/CD réussis. Latence API 150-300 ms, traitement des webhooks 300-500 ms. Le traitement d'une commande complexe est passé de ~25 min à ~10 min — soit une réduction de 10-15 minutes par commande traitée.",
        type: "text"
      },
      learnings: {
        title: "Apprentissages",
        body: "L'over-engineering est tentant en e-commerce, mais l'architecture la plus simple qui satisfait les contraintes survit le mieux. La séparation stricte des workflows métier dans des modules isolés a permis d'ajouter le 4e workflow (fidélité) en quelques jours sans toucher aux 3 premiers. À refaire : j'aurais investi plus tôt dans des tests d'intégration sur les chemins de paiement — j'ai appris à mes dépens qu'un mock Stripe ne capture pas tous les edge cases.",
        type: "text"
      }
    },
    en: {
      problem: {
        title: "The problem",
        body: "The client needed an e-commerce platform that could handle 3 user roles (admin, seller, customer), 4 currencies (CAD, USD, EUR, GBP), 2 languages (FR, EN) and several external integrations (Stripe, Gelato, Google Merchant Center) — without becoming a maintenance nightmare for a single-person engineering team.",
        type: "text"
      },
      constraints: {
        title: "Constraints",
        body: "Mandatory stack: Next.js / Vercel / Supabase to stay aligned with the broader ecosystem. Tight deadlines (~3 months for MVP). Non-negotiable security (production payments). Documentation required in parallel to enable quick onboarding of a future second dev.",
        type: "text"
      },
      approach: {
        title: "The solution",
        body: "Layered architecture: Next.js App Router on the front-end (Server Components by default), Prisma as the data layer with 10 relational models, and isolated business modules per workflow (order, return, inventory, loyalty). Stripe for payments with HMAC webhook signatures, Gelato for print-on-demand via webhooks at 300-500 ms, Google Merchant Center for catalog distribution. Security: rate limiting, HttpOnly cookies, centralized audit logs.",
        type: "text"
      },
      stack: {
        title: "Tech stack",
        items: ["Next.js (App Router)", "TypeScript strict", "Prisma + PostgreSQL", "Tailwind CSS", "Stripe (payments)", "Gelato (print-on-demand)", "Google Merchant Center", "Vercel (hosting)", "Supabase (auth + DB)"],
        type: "list"
      },
      outcomes: {
        title: "Outcomes",
        body: "~15,000 lines of production TypeScript. 20+ exposed REST APIs. 4 business workflows shipped (order, return, inventory, loyalty). 20-30 successful CI/CD deployments. API latency 150-300 ms, webhook processing 300-500 ms. Complex-order processing dropped from ~25 min to ~10 min — a 10-15 minute reduction per order.",
        type: "text"
      },
      learnings: {
        title: "Learnings",
        body: "Over-engineering is tempting in e-commerce, but the simplest architecture that satisfies the constraints survives best. Strict separation of business workflows into isolated modules let me add the 4th workflow (loyalty) in a few days without touching the first 3. What I'd do differently: invest earlier in integration tests on payment paths — I learned the hard way that a Stripe mock doesn't capture every edge case.",
        type: "text"
      }
    }
  }
}
