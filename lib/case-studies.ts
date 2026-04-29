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
