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

/** Plain-language descriptions for technical stack chips. In simple mode, a
 *  matching chip gets a hover/focus tooltip explaining the tech in everyday
 *  words. Matched by substring (lowercased), most specific first. */
export const techPlain: { match: string[]; def: { fr: string; en: string } }[] = [
  {
    match: ["react native"],
    def: {
      fr: "Permet d'écrire une seule application qui fonctionne à la fois sur iPhone et sur Android.",
      en: "Lets you write a single app that runs on both iPhone and Android.",
    },
  },
  {
    match: ["nativewind"],
    def: {
      fr: "Une façon rapide de styliser une app mobile, comme on le ferait pour un site web.",
      en: "A fast way to style a mobile app, like you would a website.",
    },
  },
  {
    match: ["expo"],
    def: {
      fr: "Une boîte à outils qui accélère la création et le test d'applications mobiles.",
      en: "A toolkit that speeds up building and testing mobile apps.",
    },
  },
  {
    match: ["next"],
    def: {
      fr: "L'outil qui construit des sites web rapides et bien référencés sur Google.",
      en: "The tool that builds fast, search-friendly websites.",
    },
  },
  {
    match: ["react"],
    def: {
      fr: "La technologie qui rend les interfaces web interactives et fluides.",
      en: "The technology that makes web interfaces interactive and smooth.",
    },
  },
  {
    match: ["typescript"],
    def: {
      fr: "Une version plus sûre de JavaScript qui attrape les erreurs avant les utilisateurs.",
      en: "A safer version of JavaScript that catches mistakes before users do.",
    },
  },
  {
    match: ["javascript", "html/css/js", "vanilla"],
    def: {
      fr: "Les langages de base qui font fonctionner et vivre toutes les pages web.",
      en: "The core languages that make every web page work and come alive.",
    },
  },
  {
    match: ["supabase"],
    def: {
      fr: "Une boîte à outils prête à l'emploi : base de données + connexion des utilisateurs.",
      en: "A ready-to-use toolbox: database + user sign-in.",
    },
  },
  {
    match: ["postgres"],
    def: {
      fr: "Un classeur numérique robuste où l'application range ses données.",
      en: "A robust digital filing cabinet where the app stores its data.",
    },
  },
  {
    match: ["prisma"],
    def: {
      fr: "Un traducteur qui aide le code à parler à la base de données sans erreur.",
      en: "A translator that helps the code talk to the database without mistakes.",
    },
  },
  {
    match: ["mysql", "sqlite", "derby"],
    def: {
      fr: "Un endroit organisé où l'application garde toutes ses informations.",
      en: "An organized place where the app keeps all its information.",
    },
  },
  {
    match: ["stripe"],
    def: {
      fr: "Le service qui encaisse les paiements par carte, en toute sécurité.",
      en: "The service that securely handles card payments.",
    },
  },
  {
    match: ["spring"],
    def: {
      fr: "Un cadre de travail pour construire la partie serveur (coulisses) en Java.",
      en: "A framework for building the server side (behind the scenes) in Java.",
    },
  },
  {
    match: ["swing"],
    def: {
      fr: "Un outil pour créer des logiciels de bureau (fenêtres, boutons) en Java.",
      en: "A tool to build desktop software (windows, buttons) in Java.",
    },
  },
  {
    match: ["java"],
    def: {
      fr: "Un langage de programmation solide, très utilisé en entreprise.",
      en: "A solid programming language, widely used in business.",
    },
  },
  {
    match: ["maven"],
    def: {
      fr: "Un assistant qui assemble le projet Java et gère ses composants.",
      en: "An assistant that assembles the Java project and manages its parts.",
    },
  },
  {
    match: ["junit", "assertj", "jacoco", "jest", "tdd"],
    def: {
      fr: "Des vérifications automatiques qui s'assurent que le code fonctionne bien.",
      en: "Automatic checks that make sure the code works correctly.",
    },
  },
  {
    match: ["angular"],
    def: {
      fr: "Une technologie pour construire des interfaces web structurées.",
      en: "A technology for building structured web interfaces.",
    },
  },
  {
    match: ["tailwind"],
    def: {
      fr: "Une boîte à outils pour styliser un site rapidement et de façon cohérente.",
      en: "A toolkit to style a site quickly and consistently.",
    },
  },
  {
    match: ["vercel"],
    def: {
      fr: "La plateforme qui met le site en ligne et le garde rapide partout dans le monde.",
      en: "The platform that puts the site online and keeps it fast worldwide.",
    },
  },
  {
    match: ["node", "express", ".net", "deno"],
    def: {
      fr: "La technologie qui fait tourner la partie serveur (coulisses) de l'application.",
      en: "The technology that runs the server side (behind the scenes) of the app.",
    },
  },
  {
    match: ["docker"],
    def: {
      fr: "Un moyen d'emballer une application pour qu'elle tourne pareil partout.",
      en: "A way to package an app so it runs the same everywhere.",
    },
  },
  {
    match: ["openai", "vibe ai", "assistant"],
    def: {
      fr: "L'intelligence artificielle : un assistant qui comprend et répond en langage naturel.",
      en: "Artificial intelligence: an assistant that understands and replies in plain language.",
    },
  },
  {
    match: ["gelato"],
    def: {
      fr: "Un partenaire qui imprime et expédie automatiquement les commandes.",
      en: "A partner that automatically prints and ships orders.",
    },
  },
  {
    match: ["maps", "gtfs", "stm"],
    def: {
      fr: "Des services de cartes et de données de transport (métro, autobus) intégrés à l'app.",
      en: "Map and transit-data services (metro, bus) built into the app.",
    },
  },
  {
    match: ["claude design", "claude code"],
    def: {
      fr: "Des outils d'IA que j'utilise pour concevoir et coder les maquettes plus vite.",
      en: "AI tools I use to design and code the mockups faster.",
    },
  },
  {
    match: ["wcag", "aria"],
    def: {
      fr: "Les règles qui rendent un site utilisable par tout le monde, y compris avec un handicap.",
      en: "The rules that make a site usable by everyone, including people with disabilities.",
    },
  },
  {
    match: ["i18n", "fr/en", "bilingue", "bilingual"],
    def: {
      fr: "Le site est offert en plusieurs langues, avec bascule instantanée.",
      en: "The site is offered in several languages, with instant switching.",
    },
  },
];

/** Plain-language description for a stack chip, or null if none matches. */
export function techPlainOf(tech: string): { fr: string; en: string } | null {
  const t = tech.toLowerCase();
  for (const e of techPlain) if (e.match.some((m) => t.includes(m))) return e.def;
  return null;
}

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
