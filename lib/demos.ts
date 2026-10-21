/**
 * Demos (/demos): applications a visitor can test.
 *
 * - `demos`: prototypes hosted on this site (public/<dir>), playable inside the page
 *   (same-origin iframe; next.config.ts allows SAMEORIGIN framing for these dirs only).
 * - `liveApps`: apps deployed elsewhere; they refuse to be framed or hold real data,
 *   so they open in a new tab.
 *
 * Every "what to try" line was checked against the prototype on 2026-10-21.
 * Posters: screenshots of each prototype (public/images/demos, 1200x750).
 */
type L10n = { fr: string; en: string };

export type Demo = {
  /** Project id: the case study lives at /projects/<id> */
  id: string;
  name: string;
  /** Same-origin prototype URL loaded in the iframe */
  src: string;
  poster: string;
  kind: L10n;
  device: "mobile" | "desktop";
  minutes: number;
  /** What to try, in order (2 to 3 short steps) */
  steps: { fr: string[]; en: string[] };
  /** Honest limit, shown under the steps */
  note: L10n;
  /** Needs the keyboard: the visitor must click into the frame first */
  keyboard?: boolean;
};

export const demos: Demo[] = [
  {
    id: "wise-wealthy",
    name: "Wise & Wealthy",
    src: "/wise-wealthy/index.html",
    poster: "/images/demos/wise-wealthy.jpg",
    kind: { fr: "Application mobile · coach financier", en: "Mobile app · financial coach" },
    device: "mobile",
    minutes: 3,
    steps: {
      fr: [
        "Suivez l'accueil guidé (Continuer), puis choisissez Explorer sans compte.",
        "Découvrez le tableau de bord : série de clarté, action du jour, météo financière.",
        "Parcourez dépenses, épargne et objectifs, guidé par le coach Wiz.",
      ],
      en: [
        "Go through the guided onboarding (Continue), then choose Explore without an account.",
        "Discover the dashboard: clarity streak, action of the day, financial weather.",
        "Browse expenses, savings and goals, guided by the Wiz coach.",
      ],
    },
    note: {
      fr: "Prototype interactif : l'assistant est simulé, aucune donnée n'est enregistrée.",
      en: "Interactive prototype: the assistant is simulated and no data is saved.",
    },
  },
  {
    id: "vibe",
    name: "Vibe Montréal",
    src: "/vibe/index.html",
    poster: "/images/demos/vibe.jpg",
    kind: { fr: "Application mobile et web · sorties à Montréal", en: "Mobile and web app · going out in Montréal" },
    device: "mobile",
    minutes: 2,
    steps: {
      fr: [
        "Choisissez une ambiance : Chill, Romantique, Étudier, Aventure…",
        "Changez le moment de la journée (Matin, Après-midi, Soir).",
        "Basculez entre Mobile et Desktop en haut de l'écran.",
      ],
      en: [
        "Pick a vibe: Chill, Romantic, Study, Adventure…",
        "Change the time of day (Morning, Afternoon, Evening).",
        "Switch between Mobile and Desktop at the top of the screen.",
      ],
    },
    note: {
      fr: "Prototype : Vibe AI et les données des lieux sont simulés.",
      en: "Prototype: Vibe AI and the venue data are simulated.",
    },
  },
  {
    id: "boa-traiteur",
    name: "BOA · Chef privé",
    src: "/boa-traiteur/index.html",
    poster: "/images/demos/boa-traiteur.jpg",
    kind: { fr: "Site de réservation · chef privé", en: "Booking site · private chef" },
    device: "desktop",
    minutes: 3,
    steps: {
      fr: [
        "Cliquez sur Réserver et choisissez un menu, une date et le nombre de convives.",
        "Suivez le parcours jusqu'au dépôt et au paiement simulé.",
        "Basculez FR / EN et le thème sombre (☾).",
      ],
      en: [
        "Click Book, then pick a menu, a date and the number of guests.",
        "Follow the flow up to the deposit and the simulated payment.",
        "Switch FR / EN and the dark theme (☾).",
      ],
    },
    note: {
      fr: "Paiement simulé : aucune carte n'est demandée ni débitée.",
      en: "Simulated payment: no card is requested or charged.",
    },
  },
  {
    id: "gti350",
    name: "Tron Light Cycles",
    src: "/gti350/index.html",
    poster: "/images/demos/gti350.jpg",
    kind: { fr: "Jeu à 2 joueurs · ÉTS GTI350", en: "2-player game · ÉTS GTI350" },
    device: "desktop",
    minutes: 2,
    keyboard: true,
    steps: {
      fr: [
        "Cliquez dans le jeu, puis sur Go.",
        "Joueur 1 : les flèches (ou glissez à la souris). Joueur 2 : ZQSD ou WASD.",
        "Espace relance une manche après une collision.",
      ],
      en: [
        "Click inside the game, then on Go.",
        "Player 1: arrow keys (or swipe with the mouse). Player 2: WASD.",
        "Space starts a new round after a crash.",
      ],
    },
    note: {
      fr: "Jeu complet, codé en JavaScript sans bibliothèque. Clavier conseillé.",
      en: "Complete game, written in plain JavaScript. A keyboard is recommended.",
    },
  },
  {
    id: "kim-dubois",
    name: "Kim Dubois Photographe",
    src: "/kim-dubois/index.html",
    poster: "/images/demos/kim-dubois.jpg",
    kind: { fr: "Site vitrine · photographe animalière", en: "Showcase site · pet photographer" },
    device: "desktop",
    minutes: 2,
    steps: {
      fr: [
        "Parcourez le portfolio et les séances.",
        "Ouvrez Réserver une séance et remplissez le formulaire.",
        "Activez le mode administrateur (en bas à gauche) pour éditer la page.",
      ],
      en: [
        "Browse the portfolio and the sessions.",
        "Open Book a session and fill in the form.",
        "Turn on the admin mode (bottom left) to edit the page.",
      ],
    },
    note: {
      fr: "Maquette complète : le formulaire n'envoie rien.",
      en: "Complete mockup: the form sends nothing.",
    },
  },
  {
    id: "crcc",
    name: "CRCC · Refonte",
    src: "/crcc/index.html",
    poster: "/images/demos/crcc.jpg",
    kind: { fr: "Refonte de site · organisme sans but lucratif", en: "Site redesign · non-profit" },
    device: "desktop",
    minutes: 2,
    steps: {
      fr: [
        "Suivez un des 3 parcours : adopter, devenir éleveur ou soutenir le club.",
        "Consultez l'annuaire des éleveurs.",
        "Ouvrez les Notes de refonte (en bas à gauche).",
      ],
      en: [
        "Follow one of the 3 journeys: adopt, become a breeder or support the club.",
        "Look up the breeder directory.",
        "Open the redesign notes (bottom left).",
      ],
    },
    note: {
      fr: "Maquette de refonte livrée au client, sans connexion à une base de données.",
      en: "Redesign mockup delivered to the client, with no database behind it.",
    },
  },
];

export type LiveApp = {
  id: string;
  name: string;
  url: string;
  poster: string;
  kind: L10n;
  what: L10n;
  access: L10n;
};

export const liveApps: LiveApp[] = [
  {
    id: "the-mad-space",
    name: "The Mad Space",
    url: "https://themadspace.com",
    poster: "/media/the-mad-space.jpg",
    kind: { fr: "Marketplace en production", en: "Marketplace in production" },
    what: { fr: "Parcourez les créations, changez de devise et de langue.", en: "Browse the artwork, switch currency and language." },
    access: { fr: "Boutique réelle : ne passez pas de commande pour tester.", en: "Real store: please don't place an order to test it." },
  },
  {
    id: "dpm-elevate",
    name: "DPM Elevate",
    url: "https://dpm-calendar.vercel.app",
    poster: "/images/demos/dpm-elevate.jpg",
    kind: { fr: "Application web déployée", en: "Deployed web app" },
    what: { fr: "Agenda, tâches, habitudes et focus dans une seule application.", en: "Calendar, tasks, habits and focus in one app." },
    access: { fr: "Connexion requise : Google, Microsoft, GitHub ou courriel.", en: "Sign-in required: Google, Microsoft, GitHub or email." },
  },
  {
    id: "tatzy",
    name: "Tatzy",
    url: "https://tatzy-taxi.vercel.app",
    poster: "/images/demos/tatzy.jpg",
    kind: { fr: "Site de réservation de taxi", en: "Taxi booking site" },
    what: { fr: "Réservez un trajet de bout en bout, en français ou en anglais.", en: "Book a ride end to end, in French or English." },
    access: { fr: "Prototype : aucun vrai chauffeur n'est envoyé.", en: "Prototype: no real driver is dispatched." },
  },
];

/** Projects that can be tested inside /demos (for "Tester" links on cards and case studies). */
export const demoIds = new Set(demos.map((d) => d.id));
