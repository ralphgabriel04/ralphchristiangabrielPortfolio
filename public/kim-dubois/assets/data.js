/* ============================================================
   CONTENU CENTRALISÉ BILINGUE — Kim Dubois Photographe Animalière
   FR par défaut · bascule EN complète.
   Tout le texte vit ici : libellés, prix, articles, UI…
   Pour éditer : modifier la chaîne dans la bonne langue.
   ============================================================ */

const KD_SHARED = {
  // Couleurs des zones photo + hrefs : identiques dans les deux langues
  portfolioColors: ["var(--studio-corail)", "#6E7F52", "var(--studio-jaune)", "#8A6F4B", "#7C8696", "var(--studio-bleu)", "#5B6470", "var(--studio-noir)"],
  navHrefs: ["#accueil", "#portfolio", "#seances", "#distinctions", "#blog", "#contact"],
  blogColors: ["#8A6F4B", "#6E7F52", "var(--studio-bleu)"],
  social: [
    { label: "Facebook",  href: "https://www.facebook.com/KimDuboisPhotographeAnimaliere/" },
    { label: "Instagram", href: "https://www.instagram.com/kimduboisphotographeanimaliere/" },
    { label: "YouTube",   href: "https://www.youtube.com/channel/UC3ttz8W0VuogITohYgigfrw" },
    { label: "Boutique",  href: "https://www.etsy.com/ca-fr/shop/KimDuboisPhotographe" },
  ],
  regions: ["Montréal", "Laval", "Boisbriand", "Blainville", "Saint-Eustache", "Sainte-Thérèse", "Deux-Montagnes", "Longueuil", "Brossard"],
  medalTiers: ["Silver", "Bronze Distinction", "Bronze", "Bronze"],
  medalCats: ["Canine Portrait", "Creative", "Documentary", "Portrait"],
  awardCategories: ["Portrait", "Documentary", "Canine Portrait", "Creative"],
  packageNames: ["Au Cœur du Moment", "Portrait Complice"],
  packagePrices: ["200", "350"],
};

/* ----------------------- FRANÇAIS ----------------------- */
const KD_FR = {
  brand: { name: "Kim Dubois", full: "Kim Dubois Photographe Animalière", roleline: "Photographe animalière" },
  nav: [
    { label: "Accueil",      href: "#accueil" },
    { label: "Portfolio",    href: "#portfolio" },
    { label: "Séances",      href: "#seances" },
    { label: "Distinctions", href: "#distinctions" },
    { label: "Blog",         href: "#blog" },
    { label: "Contact",      href: "#contact" },
  ],
  hero: {
    eyebrow: "Photographe animalière · Montréal · depuis 2011",
    title: "Votre compagnon mérite d’être immortalisé.",
    subtitle: "Portraits animaliers primés, en studio et en plein air. Montréal et ses environs.",
    ctaPrimary: "Réserver une séance",
    ctaSecondary: "Voir le portfolio",
    bgAlt: "Portrait animalier en studio sur fond coloré — image de substitution",
  },
  awards: {
    eyebrow: "Reconnaissance internationale",
    title: "Primée aux International Pet Photography Awards",
    counters: [
      { n: "12", label: "distinctions" },
      { n: "2",  label: "éditions" },
      { n: "4",  label: "catégories" },
    ],
    note: "TIPPA 2024 – 2025 · Bronze, Bronze Distinction et Silver",
  },
  portfolio: {
    eyebrow: "Aperçu du portfolio",
    title: "Des regards, gravés pour toujours",
    intro: "Un aperçu, pas un catalogue. Chaque image cherche l’émotion juste — la complicité d’un instant.",
    filters: ["Tous", "Chiens", "Studio", "Avant le pont de l’arc-en-ciel", "Commerciale"],
    cta: "Voir tout le portfolio",
    items: [
      { catIdx: 2, title: "Studio · fond corail",  alt: "Portrait studio d’un chien sur fond corail" },
      { catIdx: 1, title: "En forêt, automne",     alt: "Chien en plein air dans une forêt aux teintes d’automne" },
      { catIdx: 2, title: "Studio · fond jaune",   alt: "Portrait studio d’un chat sur fond jaune" },
      { catIdx: 4, title: "Produit & animal",      alt: "Photo commerciale d’un produit accompagné d’un animal" },
      { catIdx: 3, title: "Lumière douce",         alt: "Portrait mémoire d’un animal âgé en lumière douce" },
      { catIdx: 2, title: "Studio · fond bleu",    alt: "Portrait studio d’un chien sur fond bleu" },
      { catIdx: 1, title: "Ville, fin de jour",    alt: "Chien photographié en ville à la fin du jour" },
      { catIdx: 2, title: "Studio · fond noir",    alt: "Portrait studio d’un chien sur fond noir" },
    ],
  },
  about: {
    eyebrow: "À propos",
    title: "Photographe passionnée, depuis 2011",
    body: [
      "Basée à Montréal, je photographie les animaux et le lien qui nous unit à eux depuis 2011 — en studio sur fonds colorés comme en pleine nature.",
      "Mon travail a été reconnu à l’international, mais ma vraie récompense reste ce moment où vous reconnaissez votre compagnon dans une image.",
    ],
    signature: "Kim Dubois",
    portraitAlt: "Portrait de Kim Dubois, photographe animalière, en séance",
    badgeLabel: "Portrait · Kim",
  },
  packages: {
    eyebrow: "Séances",
    title: "Deux façons de vivre votre séance",
    intro: "Chaque forfait commence par une consultation et se termine par une rencontre de sélection, ensemble.",
    pricePrefix: "dès",
    priceSuffix: "$",
    cards: [
      { steps: ["Consultation 30 min (Google Meet)", "Séance 30 min", "Sélection initiale", "2ᵉ rencontre 30 min"], featured: false },
      { steps: ["Consultation 1 h", "Séance 1 h", "Sélection initiale", "2ᵉ rencontre 1 h"], featured: true },
    ],
    fineprint: "Retouches, produits et déplacement non inclus · 0,60 $/km au-delà de 15 km de Montréal · Taxes en sus · Report en cas de mauvaise météo.",
    cta: "Voir toutes les séances",
  },
  rainbow: {
    eyebrow: "Avant le pont de l’arc-en-ciel",
    title: "Pour le temps qu’il reste, et celui qu’on garde",
    body: "Une séance mémoire, tout en douceur, pour célébrer un compagnon dont le grand âge ou la maladie raccourcit le chemin. À votre rythme, dans le respect.",
    cta: "En parler ensemble",
    alt: "Animal âgé photographié en lumière tamisée, ambiance paisible",
    label: "Mémoire · lumière douce",
  },
  blog: {
    eyebrow: "Le blogue",
    title: "Coulisses & réflexions",
    cta: "Lire le blogue",
    posts: [
      { date: "3 sept. 2024", category: "Avant – Après", title: "Redécouvrir mes photos de 2015 : une nouvelle perspective en 2024", excerpt: "Neuf ans plus tard, je rouvre mes archives et je vois autrement ces images — ce qu’elles disent de mon regard, et de son évolution.", alt: "Comparaison avant-après d’une photographie animalière de 2015", real: true },
      { date: "À venir", category: "Lieux pour les séances", title: "Mes endroits favoris autour de Montréal pour une séance en plein air", excerpt: "Parcs, berges et sous-bois : où la lumière et les décors subliment vos compagnons au fil des saisons.", alt: "Sous-bois lumineux propice à une séance photo en plein air", real: false },
      { date: "À venir", category: "Avant – Après", title: "Du fichier brut à l’œuvre encadrée : mon processus de retouche", excerpt: "Une retouche fidèle, jamais artificielle : comment je révèle l’animal sans le trahir.", alt: "Écran montrant une photographie animalière en cours de retouche", real: false },
    ],
  },
  testimonials: {
    eyebrow: "Témoignages",
    title: "Ce que ressentent les familles",
    note: "Citations à confirmer — placeholders pour la maquette.",
    items: [
      { quote: "Je pleure encore en regardant ces photos. Kim a su capter exactement qui était notre chien.", author: "Famille L.", place: "Laval" },
      { quote: "Une douceur et une patience incroyables avec notre chat anxieux. Le résultat est magnifique.", author: "Marie-Pier G.", place: "Boisbriand" },
      { quote: "Professionnelle du début à la fin. On a enfin un portrait digne de notre compagnon.", author: "Sébastien R.", place: "Longueuil" },
    ],
  },
  contact: {
    eyebrow: "Contact & réservation",
    title: "Réservons votre séance",
    intro: "Dites-moi quelques mots sur votre compagnon — je vous réponds rapidement pour planifier la consultation.",
    fields: { name: "Votre nom", email: "Courriel", animal: "Votre compagnon (nom, espèce)", message: "Votre projet en quelques mots", submit: "Envoyer ma demande" },
    success: "Merci ! (Maquette — aucune donnée n’est envoyée.)",
    newRequest: "Nouvelle demande",
    emailLabel: "Courriel",
    phoneLabel: "Téléphone",
    email: "bonjour@kimdubois.ca",
    phone: "514 000-0000",
  },
  footer: {
    blurb: "Portraits animaliers primés, en studio et en plein air. Montréal et ses environs, depuis 2011.",
    exploreTitle: "Explorer",
    regionsTitle: "Régions desservies",
    copyright: "© 2025 Kim Dubois Photographe Animalière. Tous droits réservés.",
  },
  ui: {
    bookSession: "Réserver une séance",
    notesDesign: "Notes design",
    notesTitle: "Afficher les notes de design",
    skip: "Aller au contenu",
    scroll: "défiler",
    themeToDark: "Passer en thème sombre",
    themeToLight: "Passer en thème clair",
    menuOpen: "Ouvrir le menu",
    menuClose: "Fermer le menu",
    langGroup: "Langue du site",
    frTitle: "Version française",
    enTitle: "English version",
    mostChosen: "Le plus choisi",
    choosePackage: "Choisir ce forfait",
    readArticle: "Lire l’article →",
    realArticle: "Article réel",
    annoTag: "Note design",
    mockNote: "Maquette de discussion — contenu et prix à confirmer",
    pageTitle: "Kim Dubois — Photographe animalière primée | Montréal",
    metaDesc: "Kim Dubois, photographe animalière primée à l’international (TIPPA 2024-2025). Portraits en studio et en plein air à Montréal et ses environs. Réservez votre séance.",
    anno1: "Accroche centrée sur <b>le propriétaire</b>, pas sur l’outil : « votre compagnon mérite… ». On vend l’émotion d’abord, la preuve (primée, studio + plein air) juste en dessous.",
    anno2: "Les distinctions arrivent <b>juste après le héros</b> : la crédibilité en moins de 5 s, en preuve sociale sobre (badges + compteurs) — jamais tape-à-l’œil.",
    anno3: "Section mémoire : <b>beaucoup d’espace</b>, teintes froides apaisées, une seule phrase sensible. Sobre et respectueux — jamais larmoyant.",
  },
};

/* ----------------------- ENGLISH ----------------------- */
const KD_EN = {
  brand: { name: "Kim Dubois", full: "Kim Dubois Pet Photographer", roleline: "Pet photographer" },
  nav: [
    { label: "Home",      href: "#accueil" },
    { label: "Portfolio", href: "#portfolio" },
    { label: "Sessions",  href: "#seances" },
    { label: "Awards",    href: "#distinctions" },
    { label: "Blog",      href: "#blog" },
    { label: "Contact",   href: "#contact" },
  ],
  hero: {
    eyebrow: "Pet photographer · Montréal · since 2011",
    title: "Your companion deserves to be immortalized.",
    subtitle: "Award-winning pet portraits, in studio and outdoors. Montréal and surrounding areas.",
    ctaPrimary: "Book a session",
    ctaSecondary: "View the portfolio",
    bgAlt: "Studio pet portrait on a colourful backdrop — placeholder image",
  },
  awards: {
    eyebrow: "International recognition",
    title: "Awarded at the International Pet Photography Awards",
    counters: [
      { n: "12", label: "awards" },
      { n: "2",  label: "editions" },
      { n: "4",  label: "categories" },
    ],
    note: "TIPPA 2024 – 2025 · Bronze, Bronze Distinction and Silver",
  },
  portfolio: {
    eyebrow: "Portfolio preview",
    title: "Gazes, captured forever",
    intro: "A preview, not a catalogue. Each image seeks the right emotion — the closeness of a single moment.",
    filters: ["All", "Dogs", "Studio", "Before the Rainbow Bridge", "Commercial"],
    cta: "View the full portfolio",
    items: [
      { catIdx: 2, title: "Studio · coral backdrop",  alt: "Studio portrait of a dog on a coral backdrop" },
      { catIdx: 1, title: "In the forest, autumn",    alt: "Dog outdoors in an autumn-toned forest" },
      { catIdx: 2, title: "Studio · yellow backdrop", alt: "Studio portrait of a cat on a yellow backdrop" },
      { catIdx: 4, title: "Product & animal",         alt: "Commercial photo of a product alongside an animal" },
      { catIdx: 3, title: "Soft light",               alt: "Memorial portrait of a senior animal in soft light" },
      { catIdx: 2, title: "Studio · blue backdrop",   alt: "Studio portrait of a dog on a blue backdrop" },
      { catIdx: 1, title: "City, end of day",         alt: "Dog photographed in the city at day's end" },
      { catIdx: 2, title: "Studio · black backdrop",  alt: "Studio portrait of a dog on a black backdrop" },
    ],
  },
  about: {
    eyebrow: "About",
    title: "A passionate photographer, since 2011",
    body: [
      "Based in Montréal, I have photographed animals and the bond we share with them since 2011 — in studio on colourful backdrops as much as out in nature.",
      "My work has been recognized internationally, but my real reward is the moment you recognize your companion in an image.",
    ],
    signature: "Kim Dubois",
    portraitAlt: "Portrait of Kim Dubois, pet photographer, during a session",
    badgeLabel: "Portrait · Kim",
  },
  packages: {
    eyebrow: "Sessions",
    title: "Two ways to experience your session",
    intro: "Each package begins with a consultation and ends with a selection meeting, together.",
    pricePrefix: "from",
    priceSuffix: "$",
    priceLeading: true,
    cards: [
      { steps: ["30-min consultation (Google Meet)", "30-min session", "Initial selection", "2nd meeting, 30 min"], featured: false },
      { steps: ["1-hour consultation", "1-hour session", "Initial selection", "2nd meeting, 1 hour"], featured: true },
    ],
    fineprint: "Retouching, products and travel not included · $0.60/km beyond 15 km from Montréal · Taxes extra · Rescheduled in case of bad weather.",
    cta: "View all sessions",
  },
  rainbow: {
    eyebrow: "Before the Rainbow Bridge",
    title: "For the time that remains, and the time we keep",
    body: "A gentle memorial session to celebrate a companion whose old age or illness is shortening the road ahead. At your own pace, with care and respect.",
    cta: "Let’s talk about it",
    alt: "Senior animal photographed in soft, subdued light — a peaceful mood",
    label: "Memorial · soft light",
  },
  blog: {
    eyebrow: "The blog",
    title: "Behind the scenes & reflections",
    cta: "Read the blog",
    posts: [
      { date: "Sept. 3, 2024", category: "Before – After", title: "Revisiting my 2015 photos: a new perspective in 2024", excerpt: "Nine years later, I reopen my archives and see these images differently — what they say about my eye, and how it has grown.", alt: "Before-and-after comparison of a 2015 pet photograph", real: true },
      { date: "Coming soon", category: "Session locations", title: "My favourite spots around Montréal for an outdoor session", excerpt: "Parks, riverbanks and woodlands: where light and scenery bring out your companions through the seasons.", alt: "Bright woodland setting ideal for an outdoor photo session", real: false },
      { date: "Coming soon", category: "Before – After", title: "From raw file to framed artwork: my retouching process", excerpt: "Faithful retouching, never artificial: how I reveal the animal without betraying it.", alt: "Screen showing a pet photograph being retouched", real: false },
    ],
  },
  testimonials: {
    eyebrow: "Testimonials",
    title: "What families feel",
    note: "Quotes to be confirmed — placeholders for the mockup.",
    items: [
      { quote: "I still cry when I look at these photos. Kim captured exactly who our dog was.", author: "The L. Family", place: "Laval" },
      { quote: "Incredible gentleness and patience with our anxious cat. The result is gorgeous.", author: "Marie-Pier G.", place: "Boisbriand" },
      { quote: "Professional from start to finish. We finally have a portrait worthy of our companion.", author: "Sébastien R.", place: "Longueuil" },
    ],
  },
  contact: {
    eyebrow: "Contact & booking",
    title: "Let’s book your session",
    intro: "Tell me a few words about your companion — I’ll reply quickly to plan the consultation.",
    fields: { name: "Your name", email: "Email", animal: "Your companion (name, species)", message: "Your project in a few words", submit: "Send my request" },
    success: "Thank you! (Mockup — no data is sent.)",
    newRequest: "New request",
    emailLabel: "Email",
    phoneLabel: "Phone",
    email: "bonjour@kimdubois.ca",
    phone: "514 000-0000",
  },
  footer: {
    blurb: "Award-winning pet portraits, in studio and outdoors. Montréal and surrounding areas, since 2011.",
    exploreTitle: "Explore",
    regionsTitle: "Areas served",
    copyright: "© 2025 Kim Dubois Pet Photographer. All rights reserved.",
  },
  ui: {
    bookSession: "Book a session",
    notesDesign: "Design notes",
    notesTitle: "Show design notes",
    skip: "Skip to content",
    scroll: "scroll",
    themeToDark: "Switch to dark theme",
    themeToLight: "Switch to light theme",
    menuOpen: "Open menu",
    menuClose: "Close menu",
    langGroup: "Site language",
    frTitle: "French version",
    enTitle: "English version",
    mostChosen: "Most chosen",
    choosePackage: "Choose this package",
    readArticle: "Read the article →",
    realArticle: "Real article",
    annoTag: "Design note",
    mockNote: "Discussion mockup — content and prices to be confirmed",
    pageTitle: "Kim Dubois — Award-winning Pet Photographer | Montréal",
    metaDesc: "Kim Dubois, internationally awarded pet photographer (TIPPA 2024-2025). Studio and outdoor portraits in Montréal and surrounding areas. Book your session.",
    anno1: "Headline centred on <b>the owner</b>, not the tool: “your companion deserves…”. We sell the emotion first, the proof (awarded, studio + outdoors) right below.",
    anno2: "The awards appear <b>right after the hero</b>: credibility in under 5 seconds, as quiet social proof (badges + counters) — never flashy.",
    anno3: "Memorial section: <b>lots of space</b>, calm cool tones, a single sensitive sentence. Restrained and respectful — never maudlin.",
  },
};

/* ----- Injecte les données partagées dans chaque langue ----- */
[ [KD_FR, "fr"], [KD_EN, "en"] ].forEach(([D]) => {
  D.brand.since = 2011;
  D.social = KD_SHARED.social;
  D.regions = KD_SHARED.regions;
  D.awards.categories = KD_SHARED.awardCategories;
  D.awards.medals = KD_SHARED.medalTiers.map((tier, i) => ({ tier, cat: KD_SHARED.medalCats[i] }));
  // nav hrefs garantis identiques
  D.nav.forEach((n, i) => { n.href = KD_SHARED.navHrefs[i]; });
  // portfolio : couleur par index + catégorie résolue depuis l'index de filtre
  D.portfolio.items.forEach((it, i) => {
    it.color = KD_SHARED.portfolioColors[i];
    it.cat = D.portfolio.filters[it.catIdx];
  });
  // forfaits : noms + prix partagés (devise placée selon la langue)
  D.packages.cards.forEach((c, i) => {
    c.name = KD_SHARED.packageNames[i];
    const amt = KD_SHARED.packagePrices[i];
    c.price = D.packages.priceLeading
      ? `${D.packages.pricePrefix} ${D.packages.priceSuffix}${amt}`
      : `${D.packages.pricePrefix} ${amt} ${D.packages.priceSuffix}`;
  });
  // blog : couleurs de vignette
  D.blog.posts.forEach((p, i) => { p.color = KD_SHARED.blogColors[i]; });
});

/* ----- Registre i18n + accès dynamique via window.KD ----- */
window.KD_I18N = { fr: KD_FR, en: KD_EN };
window.__KDLANG = "fr";
Object.defineProperty(window, "KD", {
  configurable: true,
  get() { return window.KD_I18N[window.__KDLANG] || window.KD_I18N.fr; },
});
