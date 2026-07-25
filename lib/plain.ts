/** Plain-language mode content: a glossary + simplified project summaries,
 *  for the ◍ toggle (helps non-technical recruiters). Bilingual. */

export const lexicon: { term: string; def: { fr: string; en: string } }[] = [
  {
    term: "Full-Stack",
    def: {
      fr: "Je travaille autant sur ce que l'utilisateur voit (l'interface) que sur les coulisses (serveur, base de données).",
      en: "I work on both what the user sees (the interface) and the behind-the-scenes (server, database).",
    },
  },
  {
    term: "API",
    def: {
      fr: "Une porte d'entrée qui permet à deux logiciels de communiquer.",
      en: "A doorway that lets two pieces of software talk to each other.",
    },
  },
  {
    term: "Base de données",
    def: {
      fr: "Le classeur organisé où l'application range toutes ses informations (comptes, commandes…).",
      en: "The organized filing cabinet where the app stores all its information (accounts, orders…).",
    },
  },
  {
    term: "OAuth 2.0",
    def: {
      fr: "La technologie derrière le bouton « Se connecter avec Google ».",
      en: "The technology behind the “Sign in with Google” button.",
    },
  },
  {
    term: "Stripe",
    def: {
      fr: "Le service qui encaisse les paiements par carte, en toute sécurité.",
      en: "The service that securely handles card payments.",
    },
  },
  {
    term: "CI/CD",
    def: {
      fr: "Un robot qui teste et met le code en ligne automatiquement à chaque changement.",
      en: "A robot that tests and ships the code automatically on every change.",
    },
  },
  {
    term: "TDD / tests",
    def: {
      fr: "Écrire les vérifications avant le code pour être sûr qu'il fonctionne — et qu'il continue de fonctionner.",
      en: "Writing the checks before the code to be sure it works — and keeps working.",
    },
  },
  {
    term: "Prototype",
    def: {
      fr: "Une maquette cliquable qui ressemble au produit final, avant de tout brancher.",
      en: "A clickable mockup that looks like the final product, before wiring everything up.",
    },
  },
  {
    term: "Loi 25 / GDPR",
    def: {
      fr: "Les règles qui protègent les données personnelles des utilisateurs.",
      en: "The rules that protect users' personal data.",
    },
  },
  {
    term: "Supabase",
    def: {
      fr: "Une boîte à outils prête à l'emploi : base de données + connexion des utilisateurs.",
      en: "A ready-to-use toolbox: database + user sign-in.",
    },
  },
];

/** Simplified, jargon-free summaries shown for a few projects in plain mode. */
export const plainSummary: Record<string, { fr: string; en: string }> = {
  "the-mad-space": {
    fr: "Une boutique en ligne où des créateurs vendent leurs designs imprimés sur des vêtements. J'ai tout construit et sécurisé seul : paiements en 4 devises, comptes, et envoi automatique des commandes.",
    en: "An online shop where creators sell their designs printed on clothing. I built and secured all of it alone: payments in 4 currencies, accounts, and automatic order fulfillment.",
  },
  "cadence": {
    fr: "Une app mobile qui relie entraîneurs sportifs et athlètes. Avant d'écrire le code, on a découpé tout le travail en 169 tâches réparties sur 13 périodes.",
    en: "A mobile app connecting sports coaches with their athletes. Before writing any code, we broke all the work into 169 tasks across 13 periods.",
  },
  "financej": {
    fr: "Une app de finances personnelles faite en équipe de six, avec énormément de tests pour garantir sa fiabilité. J'étais le chef d'équipe.",
    en: "A personal-finance app built by a team of six, with lots of tests to guarantee reliability. I was the team lead.",
  },
};
