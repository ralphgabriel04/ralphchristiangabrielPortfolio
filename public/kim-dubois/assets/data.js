/* ============================================================
   CONTENU CENTRALISÉ BILINGUE, Kim Dubois Photographe Animalière
   V3 · FR par défaut · bascule EN complète · bascule d'audience.
   Tout le texte vit ici. Hiérarchie couleur : DORÉ primaire / BLEU secondaire.
   Prix réels (du rapport), À CONFIRMER avant lancement.
   ============================================================ */

const KD_SHARED = {
  navHrefs: ["#accueil", "#portfolio", "#seances", "#distinctions", "#blog", "#contact"],
  portfolioColors: ["var(--studio-corail)", "#6E7F52", "var(--studio-jaune)", "#8A6F4B", "#7C8696", "var(--studio-bleu)", "#5B6470", "var(--studio-noir)"],
  blogColors: ["#8A6F4B", "#6E7F52", "var(--studio-bleu)"],
  testimonialColors: ["var(--studio-corail)", "#6E7F52", "var(--studio-bleu)", "#8A6F4B"],
  productColors: ["#8A6F4B", "#6E7F52", "var(--studio-bleu)"],
  processColors: ["var(--studio-corail)", "var(--studio-jaune)", "#6E7F52", "var(--studio-bleu)", "#8A6F4B"],
  portfolioLots: { preview: 6, initial: 9, step: 6 },
  social: [
    { label: "Facebook",  href: "https://www.facebook.com/KimDuboisPhotographeAnimaliere/" },
    { label: "Instagram", href: "https://www.instagram.com/kimduboisphotographeanimaliere/" },
    { label: "YouTube",   href: "https://www.youtube.com/channel/UC3ttz8W0VuogITohYgigfrw" },
    { label: "TikTok",    href: "https://www.tiktok.com/@kimduboisphotographe" },
    { label: "Etsy",      href: "https://www.etsy.com/ca-fr/shop/KimDuboisPhotographe" },
    { label: "Boutique",  href: "https://www.etsy.com/ca-fr/shop/KimDuboisPhotographe" },
  ],
  regions: ["Montréal", "Laval", "Boisbriand", "Blainville", "Saint-Eustache", "Sainte-Thérèse", "Deux-Montagnes", "Longueuil", "Brossard"],
  medalTiers: ["Silver", "Bronze Distinction", "Bronze", "Bronze"],
  medalCats: ["Canine Portrait", "Creative", "Documentary", "Portrait"],
  awardCategories: ["Portrait", "Documentary", "Canine Portrait", "Creative"],
  // 12 vrais certificats TIPPA (2024-2025), images fournies par Kim
  certs: [
    { src: "assets/photos/cert-01.png", tier: "Bronze Distinction", cat: "Portrait", year: 2024 },
    { src: "assets/photos/cert-02.png", tier: "Bronze Distinction", cat: "Documentary", year: 2024 },
    { src: "assets/photos/cert-03.png", tier: "Bronze Distinction", cat: "Portrait", year: 2024 },
    { src: "assets/photos/cert-04.png", tier: "Bronze", cat: "Portrait", year: 2024 },
    { src: "assets/photos/cert-05.png", tier: "Silver", cat: "Portrait", year: 2024 },
    { src: "assets/photos/cert-06.png", tier: "Bronze", cat: "Canine Portrait", year: 2025 },
    { src: "assets/photos/cert-07.png", tier: "Bronze", cat: "Canine Portrait", year: 2025 },
    { src: "assets/photos/cert-08.png", tier: "Bronze", cat: "Canine Portrait", year: 2025 },
    { src: "assets/photos/cert-09.png", tier: "Bronze", cat: "Creative", year: 2025 },
    { src: "assets/photos/cert-10.png", tier: "Bronze", cat: "Canine Portrait", year: 2025 },
    { src: "assets/photos/cert-11.png", tier: "Bronze", cat: "Canine Portrait", year: 2025 },
    { src: "assets/photos/cert-12.png", tier: "Bronze Distinction", cat: "Documentary", year: 2025 },
  ],
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
  audience: { label: "Vous êtes", particuliers: "Parent d’animal", entreprises: "Entreprise" },

  // Héros, variantes par audience
  hero: {
    particuliers: {
      eyebrow: "Photographe primée · Diplômée en comportement canin · Montréal",
      title: "Votre compagnon mérite de belles photos.",
      subtitle: "Une approche douce et respectueuse, même avec les animaux anxieux ou réactifs. En studio ou en plein air, partout au Québec.",
      ctaPrimary: "Réserver une séance",
      ctaSecondary: "Voir le portfolio",
      ctaTertiary: "Recevoir les conseils de préparation",
      proof: ["10+ ans d’expérience", "Diplômée en comportement canin", "Distinctions internationales TIPPA", "Approche douce et personnalisée"],
    },
    entreprises: {
      eyebrow: "Photographie commerciale animalière · Montréal · partout au Québec",
      title: "Des images chaleureuses pour votre marque.",
      subtitle: "Produits, animaux et personnes : une photographie commerciale chaleureuse, adaptée à vos besoins. Service sur mesure, soumission gratuite.",
      ctaPrimary: "Demander une soumission",
      ctaSecondary: "Voir le portfolio",
    },
    bgAlt: "Chihuahua coiffé d’une casquette devant le Stade olympique de Montréal, photo de Kim Dubois",
    bgSrc: "assets/photos/hero-chihuahua-stade.png",
    bgPos: "center",
  },

  // Compteurs « fierté »
  counters: {
    note: "Chiffres illustratifs, à confirmer.",
    items: [
      { n: "10", suffix: "+", label: "ans d’expérience" },
      { n: "500", suffix: "+", label: "animaux photographiés" },
      { n: "12", suffix: "", label: "distinctions internationales" },
      { n: "∞", suffix: "", label: "patience, toujours" },
    ],
  },

  // Bloc empathie « vous », variantes par audience
  empathy: {
    particuliers: {
      eyebrow: "Vous êtes au bon endroit",
      title: "Un animal anxieux, réactif ou difficile ? Ça ne vous prive de rien.",
      body: "Ce n’est pas parce que votre animal est difficile que vous devez vous priver de beaux souvenirs. Diplômée en comportement canin, je m’adapte à son rythme et à ses craintes, pour une séance positive et sans stress, et des photos vraiment naturelles.",
      cta: "Parlons de votre animal",
    },
    entreprises: {
      eyebrow: "Pour les entreprises",
      title: "Vos produits et vos animaux, photographiés avec sensibilité.",
      body: "Boutiques, marques, éleveurs : je crée des images commerciales chaleureuses qui mettent en valeur vos produits et les animaux qui les accompagnent. Un service adapté à vos besoins, devis gratuit et sans engagement.",
      cta: "Demander une soumission",
    },
  },

  // Distinctions + diplôme comportement canin
  awards: {
    eyebrow: "Reconnaissance & expertise",
    title: "Distinctions & récompenses",
    subtext: "12 certificats décernés par les International Pet Photography Awards, en reconnaissance d’un regard sensible, créatif et engagé envers les animaux.",
    credibility: "Ces distinctions saluent la qualité artistique et la charge émotive des images animalières.",
    band: [
      { k: "12", v: "certificats" },
      { k: "IPPA", v: "Pet Photography Awards" },
      { k: "Bronze · Silver", v: "distinctions" },
      { k: "2024-2025", v: "deux éditions" },
      { k: "4", v: "catégories" },
    ],
    certCats: { "Portrait": "Portrait", "Documentary": "Documentaire", "Canine Portrait": "Portrait canin", "Creative": "Créative" },
    filters: ["Tous", "Portrait", "Documentary", "Canine Portrait", "Creative"],
    initial: 6,
    step: 6,
    more: "Voir plus de certificats",
    less: "Voir moins",
    all: "Voir toutes les distinctions",
    selectedLabel: "Certificat sélectionné",
    emptyDetail: "Touchez un certificat pour en découvrir le détail.",
    awardWord: "Award",
    descTemplate: "Une distinction remise par les International Pet Photography Awards pour reconnaître la force émotionnelle, la composition et la sensibilité de cette image.",
    metaLabels: { year: "Année", cat: "Catégorie", tier: "Distinction", photographer: "Photographe" },
    photographer: "Kim Dubois",
    quote: "J’aime capter le vrai caractère de chaque animal.",
    enlarge: "Agrandir",
    details: "Voir plus de détails",
    note: "TIPPA 2024-2025 · Bronze, Bronze Distinction et Silver",
    certAlt: "Certificat",
    diploma: {
      title: "Diplômée en comportement canin",
      body: "Un différenciateur unique : je combine photographie et comportement animal pour réduire le stress de l’animal comme de l’humain.",
    },
    pageEyebrow: "Le palmarès complet",
    pageTitle: "Toutes les distinctions",
    pageIntro: "L’ensemble des certificats et awards décernés à Kim Dubois par les International Pet Photography Awards.",
    back: "Retour à l’accueil",
    filterGroups: { cat: "Catégorie", tier: "Distinction", year: "Année" },
    resultsLabel: "certificats",
    closeLabel: "Fermer l’aperçu",
  },

  portfolio: {
    eyebrow: "Aperçu du portfolio",
    title: "Un aperçu de mon travail",
    intro: "Quelques images récentes : chiens, chats, en studio comme en plein air.",
    filters: ["Tous", "Chiens", "Chats", "Studio", "Extérieur", "Exposition féline", "Commerciale", "Avant le pont de l’arc-en-ciel", "Avec humains", "Chevaux"],
    soon: { title: "Chevaux, bientôt", body: "Cette catégorie arrive prochainement. Les séances équines rejoindront le portfolio dès les premières images.", cta: "Réserver une séance équine" },
    cta: "Voir tout le portfolio",
    items: [
      { catIdx: 1, tags: [1, 4], title: "Au Stade olympique", src: "assets/photos/hero-chihuahua-stade.png", alt: "Chihuahua à la casquette devant le Stade olympique de Montréal, photo de Kim Dubois" },
      { catIdx: 1, tags: [1, 4], title: "Beagle à la plage", src: "assets/photos/dogs/d01-beagle-plage.png", alt: "Beagle assis sur une plage au bord de l’eau, photo de Kim Dubois" },
      { catIdx: 1, tags: [1, 4], title: "Montréal, en silhouette", src: "assets/photos/dogs/d02-sheltie-ville-silhouette.png", alt: "Sheltie en silhouette devant les gratte-ciel de Montréal au coucher du soleil, photo de Kim Dubois" },
      { catIdx: 1, tags: [1, 4], title: "Au bord de la rivière", src: "assets/photos/dogs/d03-sheltie-eau.png", alt: "Sheltie aux poils mouillés au bord d’une rivière, photo de Kim Dubois" },
      { catIdx: 1, tags: [1, 4], title: "Sur le tronc", src: "assets/photos/dogs/d04-berger-tronc.png", alt: "Berger allemand debout sur un tronc au bord de l’eau, photo de Kim Dubois" },
      { catIdx: 1, tags: [1, 4], title: "Soleil couchant sur la ville", src: "assets/photos/dogs/d05-sheltie-ville-coucher.png", alt: "Sheltie devant les tours de Montréal au soleil couchant, photo de Kim Dubois" },
      { catIdx: 1, tags: [1, 4], title: "Sous la neige", src: "assets/photos/dogs/d06-chien-neige.png", alt: "Chien crème sous la neige qui tombe, photo de Kim Dubois" },
      { catIdx: 1, tags: [1, 4], title: "Parmi les fleurs jaunes", src: "assets/photos/dogs/d07-sheltie-fleurs.png", alt: "Sheltie assis parmi des arbustes en fleurs jaunes, photo de Kim Dubois" },
      { catIdx: 1, tags: [1, 4], title: "Sur le sentier", src: "assets/photos/dogs/d08-shihtzu-sentier.png", alt: "Shih tzu marchant sur un sentier bordé de verdure, photo de Kim Dubois" },
      { catIdx: 1, tags: [1, 4], title: "Caniche en hiver", src: "assets/photos/dogs/d09-caniche-neige.png", alt: "Caniche gris dans la neige en forêt, photo de Kim Dubois" },
      { catIdx: 1, tags: [1, 4], title: "Husky en forêt", src: "assets/photos/dogs/d10-husky-pont.png", alt: "Husky sibérien sur une passerelle en pleine forêt verdoyante, photo de Kim Dubois" },
      { catIdx: 1, tags: [1, 4], title: "Reflet", src: "assets/photos/dogs/d11-berger-arbre-reflet.png", alt: "Berger allemand près d’un arbre se reflétant dans l’eau, photo de Kim Dubois" },
      { catIdx: 1, tags: [1, 4], title: "Malinois sous la neige", src: "assets/photos/dogs/d12-malinois-neige.png", alt: "Malinois belge sous les flocons de neige, photo de Kim Dubois" },
      { catIdx: 1, tags: [1, 4], title: "Course dans la neige", src: "assets/photos/dogs/d13-spitz-blanc-course.png", alt: "Spitz japonais blanc courant dans la neige en ville, photo de Kim Dubois" },
      { catIdx: 1, tags: [1, 4], title: "Duo complice", src: "assets/photos/dogs/d14-duo-foulards.png", alt: "Deux petits chiens à foulards côte à côte, photo de Kim Dubois" },
      { catIdx: 1, tags: [1, 4], title: "Au verger en fleurs", src: "assets/photos/dogs/d15-husky-pommiers.png", alt: "Husky sibérien assis dans un verger de pommiers en fleurs parsemé de pissenlits, photo de Kim Dubois" },
      { catIdx: 1, tags: [1, 4], title: "Bottes de pluie", src: "assets/photos/dogs/d16-berger-mix-bottes.png", alt: "Chien de type berger debout derrière une paire de bottes de cuir sur une route mouillée, photo de Kim Dubois" },
      { catIdx: 1, tags: [1, 4], title: "Berger sous l’orage", src: "assets/photos/dogs/d17-berger-allemand.png", alt: "Berger allemand campé sur une promenade mouillée sous un ciel d’orage, photo de Kim Dubois" },
      { catIdx: 1, tags: [1, 4], title: "Bouledogue au forsythia", src: "assets/photos/dogs/d18-bouledogue-forsythia.png", alt: "Bouledogue français fauve entouré de forsythias en fleurs jaunes, photo de Kim Dubois" },
      { catIdx: 1, tags: [1, 4], title: "Sur le banc du parc", src: "assets/photos/dogs/d19-bouledogue-banc.png", alt: "Bouledogue français debout sur un banc de parc, photo de Kim Dubois" },
      { catIdx: 2, tags: [1, 3], title: "Studio · fond corail", src: "assets/photos/studio/s01-basenji-corail.png", alt: "Basenji assis sur fond corail en studio, photo de Kim Dubois" },
      { catIdx: 2, tags: [1, 3], title: "Regard de Rex", src: "assets/photos/studio/s02-rex-noir.png", alt: "Cornish Rex au regard doré sur fond noir en studio, photo de Kim Dubois" },
      { catIdx: 2, tags: [1, 3], title: "En mouvement", src: "assets/photos/studio/s03-rex-corail.png", alt: "Cornish Rex dressé sur ses pattes sur fond corail en studio, photo de Kim Dubois" },
      { catIdx: 2, tags: [1, 3], title: "Studio · fond jaune", src: "assets/photos/studio/s04-rex-jaune.png", alt: "Cornish Rex de profil sur fond jaune en studio, photo de Kim Dubois" },
      { catIdx: 2, tags: [1, 3], title: "En position", src: "assets/photos/studio/s05-basenji-blocs.png", alt: "Basenji en position d’exposition sur fond corail en studio, photo de Kim Dubois" },
      { catIdx: 2, tags: [1, 3], title: "Profil sur noir", src: "assets/photos/studio/s06-rex-noir-profil.png", alt: "Cornish Rex de profil sur fond noir en studio, photo de Kim Dubois" },
      { catIdx: 2, tags: [1, 3], title: "Portrait basenji", src: "assets/photos/studio/s07-basenji-portrait.png", alt: "Portrait de basenji sur fond corail en studio, photo de Kim Dubois" },
      { catIdx: 2, tags: [1, 3], title: "Studio · fond bleu", src: "assets/photos/studio/s08-canecorso-bleu.png", alt: "Cane Corso gris sur fond bleu en studio, photo de Kim Dubois" },
      { catIdx: 2, tags: [1, 3], title: "Beagle en studio", src: "assets/photos/studio/s09-beagle-corail.png", alt: "Beagle âgé sur fond corail en studio, photo de Kim Dubois" },
      { catIdx: 2, tags: [2, 3], title: "Maine Coon", src: "assets/photos/studio/c01-maincoon-lit.png", alt: "Chat à poil long aux yeux verts allongé dans une lumière douce, photo de Kim Dubois" },
      { catIdx: 2, tags: [2, 3], title: "Chaton Cornish Rex", src: "assets/photos/studio/c02-rex-chaton-gris.png", alt: "Chaton Cornish Rex noir et blanc sur fond gris en studio, photo de Kim Dubois" },
      { catIdx: 2, tags: [2, 4], title: "Chat au banc jaune", src: "assets/photos/studio/c03-chat-banc-jaune.png", alt: "Chat gris assis sur un banc jaune en plein air au soleil, photo de Kim Dubois" },
      { catIdx: 2, tags: [2, 3], title: "Sous la couverture", src: "assets/photos/studio/c04-chat-couverture.png", alt: "Chat tigré blotti sous une couverture douce, photo de Kim Dubois" },
      { catIdx: 2, tags: [2, 3], title: "Regard de Rex", src: "assets/photos/studio/c05-rex-gris.png", alt: "Cornish Rex aux grands yeux verts sur fond gris en studio, photo de Kim Dubois" },
      { catIdx: 2, tags: [2, 3], title: "Lumière du matin", src: "assets/photos/studio/c06-chat-lumiere.png", alt: "Chat noir et blanc au repos dans un rayon de lumière, photo de Kim Dubois" },
      { catIdx: 2, tags: [2, 3], title: "Esprit des fêtes", src: "assets/photos/studio/c07-rex-noel.png", alt: "Cornish Rex en pull à flocons devant les lumières de Noël, photo de Kim Dubois" },
      { catIdx: 2, tags: [2, 3], title: "En tutu", src: "assets/photos/studio/c08-rex-tutu.png", alt: "Cornish Rex en tutu rose et voile, entouré de citrouilles tricotées d’Halloween, photo de Kim Dubois" },
      { catIdx: 2, tags: [2, 3], title: "Portrait sur gris", src: "assets/photos/studio/c09-rex-gris.png", alt: "Portrait de Cornish Rex noir et blanc sur fond gris, photo de Kim Dubois" },
      { catIdx: 4, tags: [2, 6], title: "Mavericks", src: "assets/photos/comm/comm-01-mavericks.png", alt: "Cornish Rex aux côtés des sachets de gâteries lyophilisées Mavericks, photo commerciale de Kim Dubois" },
      { catIdx: 4, tags: [2, 6], title: "Gâterie étoilée", src: "assets/photos/comm/comm-02-rex-etoile.png", alt: "Cornish Rex acceptant une gâterie en forme d’étoile au creux d’une main, photo commerciale de Kim Dubois" },
      { catIdx: 4, tags: [1, 6], title: "Jouet préféré", src: "assets/photos/comm/comm-04-beagle-jouet.png", alt: "Beagle couché mordillant un jouet en peluche à la maison, photo commerciale de Kim Dubois" },
      { catIdx: 4, tags: [1, 6], title: "Saut sur le quai", src: "assets/photos/comm/comm-06-boston-jouet.png", alt: "Boston terrier bondissant pour attraper un jouet os à carreaux sur un quai, photo commerciale de Kim Dubois" },
      { catIdx: 4, tags: [2, 6], title: "Trio Mavericks", src: "assets/photos/comm/comm-03-mavericks-trio.png", alt: "Trois sachets de gâteries lyophilisées Mavericks alignés en présentation produit, photo commerciale de Kim Dubois" },
      { catIdx: 4, tags: [2, 6], title: "Séance créative, tutu", src: "assets/photos/comm/comm-05-rex-tutu.png", alt: "Cornish Rex en tutu rose lors d’une séance créative en studio, photo commerciale de Kim Dubois" },
      { catIdx: 3, tags: [7, 8], title: "Lumière douce", src: "assets/photos/rainbow/rb01-patte-mains.png", alt: "Patte d’un chien reposée dans les mains de sa gardienne, lumière douce, photo mémoire de Kim Dubois" },
      { catIdx: 5, tags: [2, 5], title: "À bout de bras", src: "assets/photos/expo/e01.png", alt: "Cornish Rex noir et blanc présenté à bout de bras à l’exposition féline, photo de Kim Dubois" },
      { catIdx: 5, tags: [2, 5], title: "Cravate léopard", src: "assets/photos/expo/e02.png", alt: "Maine Coon brun à la cravate léopard sur la table de jugement, photo de Kim Dubois" },
      { catIdx: 5, tags: [2, 5], title: "Queue dressée", src: "assets/photos/expo/e03.png", alt: "Chat roux et blanc à poil long, queue dressée, sur un socle d’exposition, photo de Kim Dubois" },
      { catIdx: 5, tags: [2, 5], title: "Sphynx en présentation", src: "assets/photos/expo/e04.png", alt: "Sphynx nu présenté à bout de bras par sa propriétaire, photo de Kim Dubois" },
      { catIdx: 5, tags: [2, 5], title: "Caresse sur la table", src: "assets/photos/expo/e05.png", alt: "British Longhair chocolat caressé sur la table d’exposition, photo de Kim Dubois" },
      { catIdx: 5, tags: [2, 5], title: "Au plumeau", src: "assets/photos/expo/e06.png", alt: "Cornish Rex point siamois suivant un plumeau sur la table de jugement, photo de Kim Dubois" },
      { catIdx: 5, tags: [2, 5], title: "À l’assaut du poteau", src: "assets/photos/expo/e07.png", alt: "Sphynx grimpant au poteau, présenté par un juge en veston, photo de Kim Dubois" },
      { catIdx: 5, tags: [2, 5], title: "Tout en douceur", src: "assets/photos/expo/e08.png", alt: "Cornish Rex siamois tenu tendrement par sa propriétaire, photo de Kim Dubois" },
      { catIdx: 5, tags: [2, 5], title: "En position", src: "assets/photos/expo/e09.png", alt: "British shorthair chocolat présenté en position sur la table d’exposition, photo de Kim Dubois" },
      { catIdx: 5, tags: [2, 5], title: "Devant la murale", src: "assets/photos/expo/e10.png", alt: "Sphynx présenté à bout de bras devant la murale de l’exposition, photo de Kim Dubois" },
      { catIdx: 5, tags: [2, 5], title: "Jugement", src: "assets/photos/expo/e11.png", alt: "Sphynx nu présenté par un juge à l’exposition féline, photo de Kim Dubois" },
      { catIdx: 5, tags: [2, 5], title: "De face", src: "assets/photos/expo/e12.png", alt: "Sphynx présenté de face, soutenu par les mains du juge, photo de Kim Dubois" },
      { catIdx: 5, tags: [2, 5], title: "Coup de patte", src: "assets/photos/expo/e13.png", alt: "Chat roux et blanc jouant avec un plumeau à l’exposition féline, photo de Kim Dubois" },
      { catIdx: 5, tags: [2, 5], title: "L’œil sur le jouet", src: "assets/photos/expo/e14.png", alt: "Cornish Rex siamois attentif à un plumeau sur la table de jugement, photo de Kim Dubois" },
      { catIdx: 5, tags: [2, 5], title: "Petit dinosaure", src: "assets/photos/expo/e15.png", alt: "Cornish Rex en costume de dinosaure vert à l’exposition féline, photo de Kim Dubois" },
      { catIdx: 5, tags: [2, 5], title: "Sur le socle", src: "assets/photos/expo/e16.png", alt: "Chat roux et blanc à poil long assis sur un socle, fond noir, photo de Kim Dubois" },
      { catIdx: 5, tags: [2, 5], title: "Jouet fleuri", src: "assets/photos/expo/e17.png", alt: "Cornish Rex siamois attiré par un jouet fleuri sur la table, photo de Kim Dubois" },
      { catIdx: 5, tags: [2, 5], title: "Moment de tendresse", src: "assets/photos/expo/e18.png", alt: "British Longhair chocolat caressé à l’exposition féline, photo de Kim Dubois" },
    ],
  },

  about: {
    eyebrow: "À propos",
    title: "Photographe & passionnée d’animaux",
    body: [
      "Je m’appelle Kim, photographe animalière passionnée depuis dix ans. Mon aventure a commencé avec un amour profond pour les animaux et la nature, en studio sur fonds colorés comme en pleine nature, partout au Québec.",
      "Diplômée en intervention en comportement canin depuis 2013, je m’adapte à chaque animal : ses limites, ses craintes, ses besoins. C’est ma signature, comprendre l’animal pour le mettre à l’aise, surtout s’il est anxieux, réactif ou difficile. Et je me perfectionne sans cesse, en formation continue.",
      "Chez moi, un vrai petit zoo me sert souvent de modèles : Luly, notre beagle de 13 ans et demi ; Mojo, un adorable bâtard ; et Zaros, mon Cornish Rex, sans oublier six aquariums peuplés de crevettes néocaridina, de grenouilles naines africaines et de poissons.",
      "Fervente défenseuse de la cause animale, je verse une partie des profits de mes ventes à des refuges partout au Canada. Mon but : créer des images sincères de chaque compagnon, que vous garderez toute votre vie.",
    ],
    values: [
      { k: "Respect", v: "Toujours selon les limites et le confort de l’animal." },
      { k: "Patience", v: "Le temps qu’il faut, jamais forcé." },
    ],
    signature: "Kim Dubois",
    portraitSrc: "assets/photos/kim-portrait.png",
    portraitAlt: "Kim Dubois, photographe animalière, appareil Canon à la main dans un champ de lavande",
    badgeLabel: "Portrait · Kim",
    creditPrefix: "Prises par",
    creditHandle: "@joeva_photo",
    creditUrl: "https://www.instagram.com/joeva_photo/",
  },

  // Comment ça se passe, parcours par étapes
  process: {
    eyebrow: "Comment ça se passe",
    title: "De la prise de contact à vos photos",
    intro: "Un parcours simple et rassurant, pensé pour vous et votre animal.",
    steps: [
      { t: "Prise de contact", d: "Par courriel, téléphone, réseaux ou formulaire. On fait connaissance." },
      { t: "Consultation", d: "On planifie la séance selon votre animal, ses besoins et vos envies." },
      { t: "La séance", d: "En studio ou en plein air, à votre rythme. Aucun stress, du jeu." },
      { t: "Sélection", d: "Vous choisissez vos images préférées, ensemble." },
      { t: "Galerie en ligne", d: "Vos photos livrées par galerie privée, prêtes à chérir." },
    ],
  },

  packages: {
    eyebrow: "Séances",
    title: "L’expérience, selon votre animal",
    intro: "Chaque séance est adaptée à votre compagnon. Les prix sont un point de départ, parlons de votre projet.",
    labels: { who: "Pour qui", includes: "Ce qui est inclus", flow: "Comment ça se passe", faq: "Bon à savoir", details: "Détails de la séance", close: "Réduire" },
    cards: [
      { name: "Séance extérieure", price: "dès 300 $", region: "Région de Montréal",
        who: "Pour les chiens (et leurs humains) qui respirent mieux dehors, y compris les animaux anxieux ou réactifs.",
        steps: ["2 photos numériques HD (logo)", "Usage personnel", "En plein air, à votre rythme", "Idéale pour chiens à comportements particuliers"],
        flow: ["Repérage du lieu et de l’heure selon la lumière", "Arrivée en douceur, on laisse l’animal s’acclimater", "Jeu et marche : les images viennent d’elles-mêmes", "Galerie privée en ligne sous 2 à 3 semaines"],
        faq: [{ q: "Et s’il pleut ?", a: "On reporte sans frais jusqu’à une météo clémente." }, { q: "Mon chien est réactif aux autres chiens.", a: "On choisit un lieu calme, à distance de tout déclencheur." }], featured: true },
      { name: "Séance studio", price: "dès 275 $", region: "Studio",
        who: "Pour les chiens et chats à l’aise en intérieur, et les portraits sur fonds colorés.",
        steps: ["3 photos numériques HD (logo)", "Usage personnel", "Fonds colorés", "Chiens & chats"],
        flow: ["Acclimatation au studio, friandises et jeu", "Fonds colorés choisis ensemble", "Prises courtes, pauses fréquentes", "Sélection puis galerie privée en ligne"],
        faq: [{ q: "Mon chat n’est jamais sorti de la maison.", a: "Le studio peut se déplacer ; on en discute pour réduire le stress." }, { q: "Combien de photos ?", a: "Vous choisissez vos préférées ; les extras sont à l’unité." }], featured: false },
      { name: "Exposition féline", price: "dès 15 $ / photo", region: "Sur place",
        who: "Pour les éleveurs et propriétaires présents en exposition féline (CCA / TICA).",
        steps: ["Photos numériques HD (logo)", "En exposition", "Tarif à la photo"],
        flow: ["Sur place, pendant l’exposition", "Photos à la table de jugement et en présentation", "Tarif à la photo, sans engagement", "Livraison numérique rapide"],
        faq: [{ q: "Faut-il réserver ?", a: "Idéalement oui, mais je prends aussi sur place selon les disponibilités." }], featured: false },
      { name: "Commerciale", price: "sur soumission", region: "Gratuite",
        who: "Pour les marques, boutiques et éleveurs qui veulent des images chaleureuses de leurs produits et animaux.",
        steps: ["Service adapté à l’entreprise", "Produits + animaux", "Devis gratuit, sans engagement"],
        flow: ["Appel découverte et devis gratuit", "Direction artistique selon votre marque", "Séance produits + animaux", "Licence d’utilisation commerciale incluse"],
        faq: [{ q: "Cédez-vous les droits ?", a: "Une licence commerciale adaptée à votre usage est incluse ; on la précise dans le devis." }], featured: false },
    ],
    fineprint: "Déplacements partout au Québec · Livraison par galerie en ligne · Taxes en sus · Prix à confirmer avant lancement.",
    cta: "Voir toutes les séances",
  },

  rainbow: {
    eyebrow: "Avant le pont de l’arc-en-ciel",
    title: "Des souvenirs à garder précieusement",
    body: "Une séance mémoire, tout en douceur, pour célébrer un compagnon dont le grand âge ou la maladie raccourcit le chemin. À votre rythme, dans le respect.",
    price: "dès 600 $",
    priceNote: "Inclut un crédit de 300 $ applicable sur toute photo ou produit après la séance.",
    cta: "En parler ensemble",
    alt: "Patte d’un chien reposée dans les mains de sa gardienne, lumière douce, photo mémoire de Kim Dubois",
    src: "assets/photos/rainbow/rb01-patte-mains.png",
    label: "Mémoire · lumière douce",
  },

  // Carrousel de témoignages (client + animal + photo)
  testimonials: {
    eyebrow: "Témoignages",
    title: "Ce qu’en disent les familles",
    google: { rating: "5,0", count: "40+", label: "Avis Google", note: "Note moyenne sur Google et les réseaux." },
    note: "Avis Instagram vérifié. D’autres témoignages clients seront publiés au lancement.",
    items: [
      { quote: "Merci pour cette belle présentation! J’ai adoré mon expérience avec toi & le fait qu’il n’y ait pas de limite de temps faisait que je ne ressentais pas de pression! Je suis encore plus contente de voir que j’ai pu collaborer à une bonne cause en te choisissant! 🤍", author: "izzy.the.tomboy", animal: "Cliente", place: "Instagram", verified: true, alt: "Photo de profil Instagram de la cliente izzy.the.tomboy" },
      { quote: "Je pleure encore en regardant ces photos. Kim a su capter exactement qui était notre chien.", author: "Famille L.", animal: "avecMika", place: "Laval", alt: "Photo de Mika, le chien de la famille L." },
      { quote: "Notre chat est très anxieux. La patience de Kim a tout changé, le résultat est magnifique.", author: "Marie-Pier G.", animal: "avec Pixel", place: "Boisbriand", alt: "Photo de Pixel, le chat de Marie-Pier" },
      { quote: "Professionnelle du début à la fin. On a enfin un portrait digne de notre compagnon.", author: "Sébastien R.", animal: "avec Loup", place: "Longueuil", alt: "Photo de Loup, le chien de Sébastien" },
      { quote: "Mon chien est réactif et je n’osais plus rien faire. Kim nous a redonné de beaux moments.", author: "Andréanne T.", animal: "avec Theo", place: "Montréal", alt: "Photo de Theo, le chien d’Andréanne" },
    ],
  },

  // Produits / œuvres
  products: {
    eyebrow: "Œuvres & produits",
    title: "Au-delà de la séance",
    intro: "Vos photos en tirages fine art, albums et œuvres murales pour la maison.",
    items: [
      { t: "Tirages fine art", d: "Papiers d’archive, couleurs fidèles.", alt: "Tirage fine art encadré d’une photo animalière" },
      { t: "Albums", d: "Votre histoire, reliée à la main.", alt: "Album photo relié d’une séance animalière" },
      { t: "Œuvres murales", d: "Pièces grand format pour votre intérieur.", alt: "Œuvre murale grand format d’un portrait animalier" },
      { t: "Encadrements", d: "Cadres bois et caisses américaines, prêts à accrocher.", alt: "Cadre bois prêt à accrocher d’une photo animalière" },
    ],
    extrasTitle: "Aussi disponibles",
    extras: [
      { t: "Certificats-cadeaux", d: "Offrez une séance ou un montant, livré par courriel." },
      { t: "Crédits produits", d: "Un crédit applicable sur vos tirages et œuvres après la séance." },
      { t: "Licences commerciales", d: "Droits d’utilisation pour marques et boutiques." },
    ],
    shopNote: "Boutique hébergée sur Etsy pour l’instant ; une boutique intégrée au site arrivera plus tard.",
    cta: "Visiter la boutique",
    ctaHref: "https://www.etsy.com/ca-fr/shop/KimDuboisPhotographe",
  },

  // Infolettre — conseils de préparation
  newsletter: {
    eyebrow: "Conseils de préparation",
    title: "Recevez mes conseils pour une séance réussie",
    body: "Préparer un animal anxieux, choisir le bon moment, les accessoires utiles : des conseils concrets, plus mes nouveautés et disponibilités. Aucun spam.",
    placeholder: "Votre courriel",
    submit: "Recevoir les conseils",
    success: "Merci ! (Maquette, aucune donnée n’est envoyée.)",
    perks: ["Guide de préparation", "Animaux réactifs & anxieux", "Disponibilités en primeur"],
  },

  // Espace client / galeries privées
  clientarea: {
    eyebrow: "Espace client",
    title: "Vos galeries privées, au même endroit",
    body: "Après votre séance, vos images vous attendent dans une galerie privée sécurisée : visionnez, téléchargez en haute résolution, commandez tirages et produits, et partagez avec vos proches.",
    features: [
      { t: "Visionnement privé", d: "Un lien sécurisé, rien que pour vous." },
      { t: "Téléchargement HD", d: "Vos fichiers haute résolution, prêts à imprimer." },
      { t: "Commandes de produits", d: "Tirages, albums et œuvres en quelques clics." },
      { t: "Partage facile", d: "Envoyez la galerie à votre famille." },
    ],
    note: "Bientôt disponible. Votre accès vous sera transmis par courriel après la séance.",
    cta: "Accéder à ma galerie",
    codePlaceholder: "Code d’accès",
    ctaNote: "Vous avez déjà reçu un code ?",
  },

  // FAQ complète
  faq: {
    eyebrow: "Questions fréquentes",
    title: "Tout ce qu’il faut savoir avant de réserver",
    intro: "Les réponses aux questions qu’on me pose le plus souvent. Une autre question ? Écrivez-moi.",
    groups: [
      { name: "Réservation & paiement", items: [
        { q: "Comment réserver ma séance ?", a: "Par le formulaire de contact, par courriel, téléphone ou messagerie. On planifie ensuite une courte consultation." },
        { q: "Y a-t-il un dépôt à verser ?", a: "Oui, un dépôt de 50 % confirme votre date ; le solde est dû le jour de la séance." },
        { q: "Quels modes de paiement acceptez-vous ?", a: "Virement Interac, carte et comptant." },
        { q: "Et si je dois annuler ?", a: "On reporte sans frais et le dépôt s’applique à la nouvelle date. En cas d’annulation définitive, le dépôt couvre le temps réservé." },
      ] },
      { name: "La séance", items: [
        { q: "Que se passe-t-il s’il pleut ?", a: "Les séances extérieures sont reportées sans frais jusqu’à une météo favorable." },
        { q: "Vous déplacez-vous ?", a: "Oui, partout au Québec. Des frais de déplacement peuvent s’appliquer hors de la région de Montréal." },
        { q: "Mon animal est réactif ou anxieux, est-ce possible ?", a: "C’est ma spécialité. Diplômée en comportement canin, j’adapte le lieu, le rythme et les distances pour une séance sécuritaire et positive." },
        { q: "Mon chien doit-il rester en laisse ?", a: "Oui, pour sa sécurité. Je retire la laisse à l’image en retouche, sans frais." },
      ] },
      { name: "Photos & livraison", items: [
        { q: "Combien de photos vais-je recevoir ?", a: "Chaque forfait inclut un nombre d’images numériques HD ; vous choisissez vos préférées." },
        { q: "Quels sont les délais de livraison ?", a: "Votre galerie privée est livrée en ligne sous 2 à 3 semaines." },
        { q: "Puis-je acheter des photos supplémentaires ?", a: "Oui, à l’unité ou en lot, directement depuis votre galerie privée." },
        { q: "Comment puis-je utiliser mes photos ?", a: "Usage personnel inclus. Pour un usage commercial, une licence dédiée est disponible." },
        { q: "Qu’est-ce que la galerie privée ?", a: "Un espace en ligne sécurisé où vous visionnez, téléchargez et commandez vos images et produits." },
      ] },
    ],
    cta: "J’ai une autre question",
  },

  travel: {
    eyebrow: "Prochains déplacements",
    title: "Où me rencontrer bientôt",
    intro: "Je me déplace partout au Québec. Voici mes prochaines tournées : réservez votre place ou faites-vous prévenir.",
    notify: "Être averti",
    book: "Réserver ma place",
    stops: [
      { city: "Montréal & environs", period: "En continu", type: "Extérieur · Studio", spots: "Sur rendez-vous" },
      { city: "Québec & Lévis", period: "Printemps 2026", type: "Extérieur", spots: "5 places" },
      { city: "Estrie (Sherbrooke)", period: "Été 2026", type: "Extérieur · Familles", spots: "4 places" },
      { city: "Expositions félines", period: "Calendrier CCA / TICA", type: "Exposition féline", spots: "Sur place" },
    ],
  },

  blog: {
    eyebrow: "Le blogue",
    title: "Coulisses & réflexions",
    cta: "Lire le blogue",
    categories: ["Tous", "Conseils de préparation", "Chiens réactifs & anxieux", "Lieux photo au Québec", "Fin de vie & souvenirs", "Studio & expositions", "Coulisses"],
    posts: [
      { date: "3 sept. 2024", category: "Coulisses", title: "Redécouvrir mes photos de 2015 : une nouvelle perspective en 2024", excerpt: "Neuf ans plus tard, je rouvre mes archives et je vois autrement ces images, ce qu’elles disent de mon regard, et de son évolution.", alt: "Comparaison avant-après d’une photographie animalière de 2015", real: true },
      { date: "À venir", category: "Lieux photo au Québec", title: "Mes endroits favoris autour de Montréal pour une séance en plein air", excerpt: "Parcs, berges et sous-bois : où la lumière et les décors subliment vos compagnons au fil des saisons.", alt: "Sous-bois lumineux propice à une séance photo en plein air", real: false },
      { date: "À venir", category: "Chiens réactifs & anxieux", title: "Photographier un chien réactif : ma méthode pas à pas", excerpt: "Comment je combine comportement canin et photographie pour des séances sereines, même avec un chien difficile.", alt: "Chien attentif lors d’une séance photo en plein air", real: false },
      { date: "À venir", category: "Conseils de préparation", title: "Préparer votre animal à sa séance : ma check-list", excerpt: "Sommeil, repas, jouets préférés et petits rituels : comment arriver détendus le jour J.", alt: "Chien détendu avec son jouet avant une séance photo", real: false },
      { date: "À venir", category: "Fin de vie & souvenirs", title: "Avant le pont de l’arc-en-ciel : créer des souvenirs en douceur", excerpt: "Comment aborder une séance mémoire avec sérénité, au rythme de votre compagnon.", alt: "Main posée tendrement sur un vieux chien, lumière douce", real: false },
      { date: "À venir", category: "Studio & expositions", title: "Dans les coulisses d’une exposition féline", excerpt: "Ce qui se passe à la table de jugement, et comment je capture ces instants sans stresser les chats.", alt: "Chat présenté sur la table de jugement d’une exposition féline", real: false },
    ],
  },

  contact: {
    eyebrow: "Contact & réservation",
    title: "Réservons votre séance",
    intro: "Dites-moi quelques mots sur votre compagnon, je vous réponds rapidement pour planifier la consultation.",
    fields: { name: "Votre nom", email: "Courriel", animal: "Votre compagnon (nom, espèce)", message: "Votre projet en quelques mots", submit: "Envoyer ma demande" },
    success: "Merci ! (Maquette, aucune donnée n’est envoyée.)",
    newRequest: "Nouvelle demande",
    emailLabel: "Courriel",
    phoneLabel: "Téléphone",
    email: "bonjour@kimdubois.ca",
    phone: "514 000-0000",
    channelsNote: "Aussi par Facebook, Instagram ou téléphone, comme vous préférez.",
    coordsNote: "Coordonnées provisoires, à confirmer avant le lancement.",
  },

  footer: {
    blurb: "Portraits animaliers primés, en studio et en plein air. Diplômée en comportement canin. Montréal et partout au Québec.",
    exploreTitle: "Explorer",
    regionsTitle: "Régions desservies",
    moreTitle: "En savoir plus",
    moreLinks: ["FAQ", "Espace client", "Certificats-cadeaux", "Boutique"],
    regionsExtra: "+ partout au Québec sur demande",
    copyright: "© 2026 Kim Dubois Photographe Animalière. Tous droits réservés.",
  },

  ui: {
    bookSession: "Réserver une séance",
    notesDesign: "Notes design",
    notesTitle: "Afficher les notes de design",
    skip: "Aller au contenu",
    backToTop: "Revenir en haut",
    backHome: "← Retour à l’accueil",
    seeMore: "Voir plus",
    allShown: "Vous avez tout vu",
    pfPageTitle: "Le portfolio complet",
    pfFullCta: "Voir le portfolio complet",
    guard: {
      badge: "Image protégée",
      msg: "Photo par Kim Dubois Photographe Animalière. Cette image est protégée par droit d’auteur. Merci de ne pas l’enregistrer, copier ou réutiliser sans autorisation.",
      photographer: "Photographe",
      photographerName: "Kim Dubois",
      titleLabel: "Titre",
      catLabel: "Catégorie",
      copyright: "© Kim Dubois. Tous droits réservés",
    },
    scroll: "défiler",
    themeToDark: "Passer en thème sombre",
    themeToLight: "Passer en thème clair",
    menuOpen: "Ouvrir le menu",
    menuClose: "Fermer le menu",
    langGroup: "Langue du site",
    frTitle: "Version française",
    enTitle: "English version",
    mostChosen: "Le plus choisi",
    choosePackage: "Choisir",
    readArticle: "Lire l’article →",
    realArticle: "Article réel",
    draftLabel: "À venir",
    tmVerified: "Avis vérifié",
    tmExample: "Exemple",
    annoTag: "Note design",
    mockNote: "Maquette de discussion, contenu et prix à confirmer",
    prev: "Précédent",
    next: "Suivant",
    pageTitle: "Kim Dubois, Photographe animalière primée | Montréal",
    metaDesc: "Kim Dubois, photographe animalière primée (TIPPA 2024-2025) et diplômée en comportement canin. Portraits en studio et en plein air, partout au Québec. Réservez votre séance.",
    anno1: "Hiérarchie ferme : <b>doré = actions principales</b> (« Réserver »), <b>bleu = secondaire</b> (canvas du héros, « Voir le portfolio »). Le héros bleu fait ressortir le bouton doré.",
    anno2: "Les distinctions et le <b>diplôme en comportement canin</b> arrivent tôt : crédibilité en moins de 5 s, et un différenciateur que personne d’autre n’a.",
    anno3: "Section mémoire en <b>ambiance bleutée</b>, beaucoup d’espace, une phrase sensible. Sobre et respectueux, jamais larmoyant.",
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
  audience: { label: "You are a", particuliers: "Pet parent", entreprises: "Business" },

  hero: {
    particuliers: {
      eyebrow: "Award-winning · Certified in canine behaviour · Montréal",
      title: "Your companion deserves beautiful photos.",
      subtitle: "A gentle, respectful approach, even with anxious or reactive animals. In studio or outdoors, anywhere in Québec.",
      ctaPrimary: "Book a session",
      ctaSecondary: "View the portfolio",
      ctaTertiary: "Get the preparation tips",
      proof: ["10+ years of experience", "Certified in canine behaviour", "International TIPPA awards", "Gentle, personalized approach"],
    },
    entreprises: {
      eyebrow: "Commercial pet photography · Montréal · across Québec",
      title: "Warm images for your brand.",
      subtitle: "Products, animals and people: warm commercial photography tailored to your needs. Custom service, free quote.",
      ctaPrimary: "Request a quote",
      ctaSecondary: "View the portfolio",
    },
    bgAlt: "Chihuahua wearing a cap in front of Montréal’s Olympic Stadium, photo by Kim Dubois",
    bgSrc: "assets/photos/hero-chihuahua-stade.png",
    bgPos: "center",
  },

  counters: {
    note: "Illustrative figures, to be confirmed.",
    items: [
      { n: "10", suffix: "+", label: "years of experience" },
      { n: "500", suffix: "+", label: "animals photographed" },
      { n: "12", suffix: "", label: "international awards" },
      { n: "∞", suffix: "", label: "patience, always" },
    ],
  },

  empathy: {
    particuliers: {
      eyebrow: "You’re in the right place",
      title: "An anxious, reactive or difficult animal? You lose nothing.",
      body: "Just because your animal is difficult doesn’t mean you should miss out on beautiful memories. Certified in canine behaviour, I adapt to its pace and its fears, for a positive, stress-free session and truly natural photos.",
      cta: "Let’s talk about your animal",
    },
    entreprises: {
      eyebrow: "For businesses",
      title: "Your products and animals, photographed with sensitivity.",
      body: "Shops, brands, breeders: I create warm commercial images that showcase your products and the animals alongside them. A service tailored to your needs, free quote, no commitment.",
      cta: "Request a quote",
    },
  },

  awards: {
    eyebrow: "Recognition & expertise",
    title: "Awards & distinctions",
    subtext: "12 certificates granted by the International Pet Photography Awards, recognising a sensitive, creative and caring eye for animals.",
    credibility: "These distinctions recognise the artistic quality and emotional weight of animal photography.",
    band: [
      { k: "12", v: "certificates" },
      { k: "IPPA", v: "Pet Photography Awards" },
      { k: "Bronze · Silver", v: "distinctions" },
      { k: "2024-2025", v: "two editions" },
      { k: "4", v: "categories" },
    ],
    certCats: { "Portrait": "Portrait", "Documentary": "Documentary", "Canine Portrait": "Canine Portrait", "Creative": "Creative" },
    filters: ["Tous", "Portrait", "Documentary", "Canine Portrait", "Creative"],
    initial: 6,
    step: 6,
    more: "Show more certificates",
    less: "Show less",
    all: "View all distinctions",
    selectedLabel: "Selected certificate",
    emptyDetail: "Tap a certificate to see its details.",
    awardWord: "Award",
    descTemplate: "An award granted by the International Pet Photography Awards to recognise the emotional power, composition and sensitivity of this image.",
    metaLabels: { year: "Year", cat: "Category", tier: "Distinction", photographer: "Photographer" },
    photographer: "Kim Dubois",
    quote: "I love capturing each animal’s real character.",
    enlarge: "Enlarge",
    details: "More details",
    note: "TIPPA 2024-2025 · Bronze, Bronze Distinction and Silver",
    certAlt: "Certificate",
    diploma: {
      title: "Certified in canine behaviour",
      body: "A unique edge: I combine photography and animal behaviour to ease stress for both the animal and you.",
    },
    pageEyebrow: "The full record",
    pageTitle: "All distinctions",
    pageIntro: "Every certificate and award granted to Kim Dubois by the International Pet Photography Awards.",
    back: "Back to home",
    filterGroups: { cat: "Category", tier: "Distinction", year: "Year" },
    resultsLabel: "certificates",
    closeLabel: "Close preview",
  },

  portfolio: {
    eyebrow: "Portfolio preview",
    title: "A look at my work",
    intro: "A few recent images: dogs, cats, in studio and outdoors.",
    filters: ["All", "Dogs", "Cats", "Studio", "Outdoor", "Cat show", "Commercial", "Before the Rainbow Bridge", "With humans", "Horses"],
    soon: { title: "Horses, coming soon", body: "This category is on its way. Equine sessions will join the portfolio as soon as the first images are ready.", cta: "Book an equine session" },
    cta: "View the full portfolio",
    items: [
      { catIdx: 1, tags: [1, 4], title: "At the Olympic Stadium", src: "assets/photos/hero-chihuahua-stade.png", alt: "Chihuahua wearing a cap in front of Montréal’s Olympic Stadium, photo by Kim Dubois" },
      { catIdx: 1, tags: [1, 4], title: "Beagle at the beach", src: "assets/photos/dogs/d01-beagle-plage.png", alt: "Beagle sitting on a beach by the water, photo by Kim Dubois" },
      { catIdx: 1, tags: [1, 4], title: "Montréal, in silhouette", src: "assets/photos/dogs/d02-sheltie-ville-silhouette.png", alt: "Sheltie silhouetted against Montréal’s skyline at sunset, photo by Kim Dubois" },
      { catIdx: 1, tags: [1, 4], title: "By the river", src: "assets/photos/dogs/d03-sheltie-eau.png", alt: "Wet-coated sheltie at the edge of a river, photo by Kim Dubois" },
      { catIdx: 1, tags: [1, 4], title: "On the log", src: "assets/photos/dogs/d04-berger-tronc.png", alt: "German shepherd standing on a log by the water, photo by Kim Dubois" },
      { catIdx: 1, tags: [1, 4], title: "Sunset over the city", src: "assets/photos/dogs/d05-sheltie-ville-coucher.png", alt: "Sheltie in front of Montréal’s towers at sunset, photo by Kim Dubois" },
      { catIdx: 1, tags: [1, 4], title: "In the snow", src: "assets/photos/dogs/d06-chien-neige.png", alt: "Cream-coloured dog in falling snow, photo by Kim Dubois" },
      { catIdx: 1, tags: [1, 4], title: "Among yellow blooms", src: "assets/photos/dogs/d07-sheltie-fleurs.png", alt: "Sheltie sitting among yellow flowering shrubs, photo by Kim Dubois" },
      { catIdx: 1, tags: [1, 4], title: "On the trail", src: "assets/photos/dogs/d08-shihtzu-sentier.png", alt: "Shih tzu walking on a greenery-lined path, photo by Kim Dubois" },
      { catIdx: 1, tags: [1, 4], title: "Poodle in winter", src: "assets/photos/dogs/d09-caniche-neige.png", alt: "Grey poodle in the snow in a forest, photo by Kim Dubois" },
      { catIdx: 1, tags: [1, 4], title: "Husky in the woods", src: "assets/photos/dogs/d10-husky-pont.png", alt: "Siberian husky on a footbridge in lush green woods, photo by Kim Dubois" },
      { catIdx: 1, tags: [1, 4], title: "Reflection", src: "assets/photos/dogs/d11-berger-arbre-reflet.png", alt: "German shepherd by a tree reflected in the water, photo by Kim Dubois" },
      { catIdx: 1, tags: [1, 4], title: "Malinois in the snow", src: "assets/photos/dogs/d12-malinois-neige.png", alt: "Belgian Malinois under falling snow, photo by Kim Dubois" },
      { catIdx: 1, tags: [1, 4], title: "Running in the snow", src: "assets/photos/dogs/d13-spitz-blanc-course.png", alt: "White Japanese spitz running through snow in the city, photo by Kim Dubois" },
      { catIdx: 1, tags: [1, 4], title: "Two of a kind", src: "assets/photos/dogs/d14-duo-foulards.png", alt: "Two small dogs wearing bandanas side by side, photo by Kim Dubois" },
      { catIdx: 1, tags: [1, 4], title: "In the blossom orchard", src: "assets/photos/dogs/d15-husky-pommiers.png", alt: "Siberian husky sitting in a blossoming apple orchard dotted with dandelions, photo by Kim Dubois" },
      { catIdx: 1, tags: [1, 4], title: "Rain boots", src: "assets/photos/dogs/d16-berger-mix-bottes.png", alt: "Shepherd-type dog standing behind a pair of leather boots on a wet road, photo by Kim Dubois" },
      { catIdx: 1, tags: [1, 4], title: "Shepherd in the storm", src: "assets/photos/dogs/d17-berger-allemand.png", alt: "German shepherd planted on a wet promenade under a stormy sky, photo by Kim Dubois" },
      { catIdx: 1, tags: [1, 4], title: "Bulldog in forsythia", src: "assets/photos/dogs/d18-bouledogue-forsythia.png", alt: "Fawn French bulldog surrounded by yellow forsythia blooms, photo by Kim Dubois" },
      { catIdx: 1, tags: [1, 4], title: "On the park bench", src: "assets/photos/dogs/d19-bouledogue-banc.png", alt: "Fawn French bulldog standing on a park bench, photo by Kim Dubois" },
      { catIdx: 2, tags: [1, 3], title: "Studio · coral backdrop", src: "assets/photos/studio/s01-basenji-corail.png", alt: "Basenji sitting on a coral backdrop in studio, photo by Kim Dubois" },
      { catIdx: 2, tags: [1, 3], title: "Rex’s gaze", src: "assets/photos/studio/s02-rex-noir.png", alt: "Cornish Rex with golden eyes on a black backdrop in studio, photo by Kim Dubois" },
      { catIdx: 2, tags: [1, 3], title: "In motion", src: "assets/photos/studio/s03-rex-corail.png", alt: "Cornish Rex standing on its hind legs on a coral backdrop in studio, photo by Kim Dubois" },
      { catIdx: 2, tags: [1, 3], title: "Studio · yellow backdrop", src: "assets/photos/studio/s04-rex-jaune.png", alt: "Cornish Rex in profile on a yellow backdrop in studio, photo by Kim Dubois" },
      { catIdx: 2, tags: [1, 3], title: "In stack", src: "assets/photos/studio/s05-basenji-blocs.png", alt: "Basenji in a show stack on a coral backdrop in studio, photo by Kim Dubois" },
      { catIdx: 2, tags: [1, 3], title: "Profile on black", src: "assets/photos/studio/s06-rex-noir-profil.png", alt: "Cornish Rex in profile on a black backdrop in studio, photo by Kim Dubois" },
      { catIdx: 2, tags: [1, 3], title: "Basenji portrait", src: "assets/photos/studio/s07-basenji-portrait.png", alt: "Basenji portrait on a coral backdrop in studio, photo by Kim Dubois" },
      { catIdx: 2, tags: [1, 3], title: "Studio · blue backdrop", src: "assets/photos/studio/s08-canecorso-bleu.png", alt: "Grey Cane Corso on a blue backdrop in studio, photo by Kim Dubois" },
      { catIdx: 2, tags: [1, 3], title: "Beagle in studio", src: "assets/photos/studio/s09-beagle-corail.png", alt: "Senior beagle on a coral backdrop in studio, photo by Kim Dubois" },
      { catIdx: 2, tags: [2, 3], title: "Maine Coon", src: "assets/photos/studio/c01-maincoon-lit.png", alt: "Long-haired green-eyed cat lying in soft light, photo by Kim Dubois" },
      { catIdx: 2, tags: [2, 3], title: "Cornish Rex kitten", src: "assets/photos/studio/c02-rex-chaton-gris.png", alt: "Black-and-white Cornish Rex kitten on a grey backdrop in studio, photo by Kim Dubois" },
      { catIdx: 2, tags: [2, 4], title: "Cat on a yellow bench", src: "assets/photos/studio/c03-chat-banc-jaune.png", alt: "Grey cat sitting on a yellow bench outdoors in the sun, photo by Kim Dubois" },
      { catIdx: 2, tags: [2, 3], title: "Under the blanket", src: "assets/photos/studio/c04-chat-couverture.png", alt: "Tabby cat nestled under a soft blanket, photo by Kim Dubois" },
      { catIdx: 2, tags: [2, 3], title: "Rex’s gaze", src: "assets/photos/studio/c05-rex-gris.png", alt: "Cornish Rex with large green eyes on a grey backdrop in studio, photo by Kim Dubois" },
      { catIdx: 2, tags: [2, 3], title: "Morning light", src: "assets/photos/studio/c06-chat-lumiere.png", alt: "Black-and-white cat resting in a beam of light, photo by Kim Dubois" },
      { catIdx: 2, tags: [2, 3], title: "Holiday spirit", src: "assets/photos/studio/c07-rex-noel.png", alt: "Cornish Rex in a snowflake sweater against Christmas lights, photo by Kim Dubois" },
      { catIdx: 2, tags: [2, 3], title: "In a tutu", src: "assets/photos/studio/c08-rex-tutu.png", alt: "Cornish Rex in a pink tutu and veil, surrounded by knitted Halloween pumpkins, photo by Kim Dubois" },
      { catIdx: 2, tags: [2, 3], title: "Portrait on grey", src: "assets/photos/studio/c09-rex-gris.png", alt: "Black-and-white Cornish Rex portrait on a grey backdrop, photo by Kim Dubois" },
      { catIdx: 4, tags: [2, 6], title: "Mavericks", src: "assets/photos/comm/comm-01-mavericks.png", alt: "Cornish Rex beside Mavericks freeze-dried treat pouches, commercial photo by Kim Dubois" },
      { catIdx: 4, tags: [2, 6], title: "Star treat", src: "assets/photos/comm/comm-02-rex-etoile.png", alt: "Cornish Rex taking a star-shaped treat from a hand, commercial photo by Kim Dubois" },
      { catIdx: 4, tags: [1, 6], title: "Favourite toy", src: "assets/photos/comm/comm-04-beagle-jouet.png", alt: "Beagle lying down chewing a plush toy at home, commercial photo by Kim Dubois" },
      { catIdx: 4, tags: [1, 2, 6], title: "Leap on the dock", src: "assets/photos/comm/comm-06-boston-jouet.png", alt: "Boston terrier leaping to catch a plaid bone toy on a dock, commercial photo by Kim Dubois" },
      { catIdx: 4, tags: [2, 6], title: "Mavericks trio", src: "assets/photos/comm/comm-03-mavericks-trio.png", alt: "Three Mavericks freeze-dried treat pouches lined up in a product display, commercial photo by Kim Dubois" },
      { catIdx: 4, tags: [2, 6], title: "Creative session, tutu", src: "assets/photos/comm/comm-05-rex-tutu.png", alt: "Cornish Rex in a pink tutu during a creative studio session, commercial photo by Kim Dubois" },
      { catIdx: 3, tags: [7, 8], title: "Soft light", src: "assets/photos/rainbow/rb01-patte-mains.png", alt: "A dog’s paw resting in its guardian’s hands in soft light, memorial photo by Kim Dubois" },
      { catIdx: 5, tags: [2, 5], title: "At arm’s length", src: "assets/photos/expo/e01.png", alt: "Black-and-white Cornish Rex presented at arm’s length at the cat show, photo by Kim Dubois" },
      { catIdx: 5, tags: [2, 5], title: "Leopard tie", src: "assets/photos/expo/e02.png", alt: "Brown Maine Coon wearing a leopard tie on the judging table, photo by Kim Dubois" },
      { catIdx: 5, tags: [2, 5], title: "Tail up", src: "assets/photos/expo/e03.png", alt: "Orange-and-white longhair cat with tail raised on a show plinth, photo by Kim Dubois" },
      { catIdx: 5, tags: [2, 5], title: "Sphynx on show", src: "assets/photos/expo/e04.png", alt: "Hairless Sphynx presented at arm’s length by its owner, photo by Kim Dubois" },
      { catIdx: 5, tags: [2, 5], title: "A gentle stroke", src: "assets/photos/expo/e05.png", alt: "Chocolate British Longhair being stroked on the show table, photo by Kim Dubois" },
      { catIdx: 5, tags: [2, 5], title: "On the wand", src: "assets/photos/expo/e06.png", alt: "Siamese-point Cornish Rex following a feather wand on the judging table, photo by Kim Dubois" },
      { catIdx: 5, tags: [2, 5], title: "Up the post", src: "assets/photos/expo/e07.png", alt: "Sphynx climbing the scratching post, presented by a judge in a blazer, photo by Kim Dubois" },
      { catIdx: 5, tags: [2, 5], title: "All softness", src: "assets/photos/expo/e08.png", alt: "Siamese Cornish Rex held tenderly by its owner, photo by Kim Dubois" },
      { catIdx: 5, tags: [2, 5], title: "In position", src: "assets/photos/expo/e09.png", alt: "Chocolate British shorthair posed in position on the show table, photo by Kim Dubois" },
      { catIdx: 5, tags: [2, 5], title: "By the mural", src: "assets/photos/expo/e10.png", alt: "Sphynx presented at arm’s length in front of the show mural, photo by Kim Dubois" },
      { catIdx: 5, tags: [2, 5], title: "Judging", src: "assets/photos/expo/e11.png", alt: "Hairless Sphynx presented by a judge at the cat show, photo by Kim Dubois" },
      { catIdx: 5, tags: [2, 5], title: "Head on", src: "assets/photos/expo/e12.png", alt: "Sphynx presented head-on, supported by the judge’s hands, photo by Kim Dubois" },
      { catIdx: 5, tags: [2, 5], title: "Paw swipe", src: "assets/photos/expo/e13.png", alt: "Orange-and-white cat batting at a feather wand at the cat show, photo by Kim Dubois" },
      { catIdx: 5, tags: [2, 5], title: "Eye on the toy", src: "assets/photos/expo/e14.png", alt: "Siamese Cornish Rex fixed on a feather wand on the judging table, photo by Kim Dubois" },
      { catIdx: 5, tags: [2, 5], title: "Little dinosaur", src: "assets/photos/expo/e15.png", alt: "Cornish Rex in a green dinosaur costume at the cat show, photo by Kim Dubois" },
      { catIdx: 5, tags: [2, 5], title: "On the plinth", src: "assets/photos/expo/e16.png", alt: "Orange-and-white longhair cat sitting on a plinth against a black background, photo by Kim Dubois" },
      { catIdx: 5, tags: [2, 5], title: "Flower toy", src: "assets/photos/expo/e17.png", alt: "Siamese Cornish Rex drawn to a flower toy on the table, photo by Kim Dubois" },
      { catIdx: 5, tags: [2, 5], title: "A tender moment", src: "assets/photos/expo/e18.png", alt: "Chocolate British Longhair being stroked at the cat show, photo by Kim Dubois" },
    ],
  },

  about: {
    eyebrow: "About",
    title: "Photographer & animal lover",
    body: [
      "I’m Kim. For over ten years I’ve photographed animals and the bond we share with them, in studio on colourful backdrops and out in nature, across Québec.",
      "Certified in canine-behaviour intervention since 2013, I adapt to each animal, its limits, its fears, its needs. That’s my signature: understanding the animal to put it at ease, especially when it’s anxious, reactive or difficult. And I never stop training to do better.",
      "At home, a real little zoo often serves as my models: Luly, our 13-and-a-half-year-old beagle; Mojo, a lovable mutt; and Zaros, my Cornish Rex, plus six aquariums teeming with shrimp, African dwarf frogs and fish.",
      "A committed animal advocate, I give part of my sales profits to shelters across Canada. My goal: honest images of your companion that you’ll keep for life.",
    ],
    values: [
      { k: "Respect", v: "Always within the animal’s limits and comfort." },
      { k: "Patience", v: "As long as it takes, never forced." },
    ],
    signature: "Kim Dubois",
    portraitSrc: "assets/photos/kim-portrait.png",
    portraitAlt: "Kim Dubois, pet photographer, holding her Canon in a lavender field",
    badgeLabel: "Portrait · Kim",
    creditPrefix: "Photographed by",
    creditHandle: "@joeva_photo",
    creditUrl: "https://www.instagram.com/joeva_photo/",
  },

  process: {
    eyebrow: "How it works",
    title: "From first contact to your photos",
    intro: "A simple, reassuring journey, designed for you and your animal.",
    steps: [
      { t: "First contact", d: "By email, phone, social media or the form. We get acquainted." },
      { t: "Consultation", d: "We plan the session around your animal, its needs and your wishes." },
      { t: "The session", d: "In studio or outdoors, at your pace. No stress, just play." },
      { t: "Selection", d: "You choose your favourite images, together." },
      { t: "Online gallery", d: "Your photos delivered via a private gallery, ready to cherish." },
    ],
  },

  packages: {
    eyebrow: "Sessions",
    title: "The experience, tailored to your animal",
    intro: "Every session is adapted to your companion. Prices are a starting point, let’s talk about your project.",
    labels: { who: "For whom", includes: "What’s included", flow: "How it works", faq: "Good to know", details: "Session details", close: "Collapse" },
    cards: [
      { name: "Outdoor session", price: "from $300", region: "Montréal area",
        who: "For dogs (and their humans) who breathe easier outdoors, including anxious or reactive animals.",
        steps: ["2 HD digital photos (logo)", "Personal use", "Outdoors, at your pace", "Ideal for dogs with special behaviours"],
        flow: ["Scouting the spot and time for the best light", "A gentle arrival to let the animal settle in", "Play and walk: the images come on their own", "Private online gallery within 2 to 3 weeks"],
        faq: [{ q: "What if it rains?", a: "We reschedule at no charge until the weather is kind." }, { q: "My dog is reactive to other dogs.", a: "We pick a quiet spot, away from any triggers." }], featured: true },
      { name: "Studio session", price: "from $275", region: "Studio",
        who: "For dogs and cats comfortable indoors, and portraits on colourful backdrops.",
        steps: ["3 HD digital photos (logo)", "Personal use", "Colourful backdrops", "Dogs & cats"],
        flow: ["Settling into the studio, treats and play", "Colourful backdrops chosen together", "Short takes, frequent breaks", "Selection then private online gallery"],
        faq: [{ q: "My cat has never left the house.", a: "The studio can come to you; we’ll discuss it to lower the stress." }, { q: "How many photos?", a: "You choose your favourites; extras are available individually." }], featured: false },
      { name: "Cat show", price: "from $15 / photo", region: "On site",
        who: "For breeders and owners present at the cat show (CCA / TICA).",
        steps: ["HD digital photos (logo)", "At the show", "Per-photo pricing"],
        flow: ["On site, during the show", "Photos at the judging table and on presentation", "Per-photo pricing, no commitment", "Fast digital delivery"],
        faq: [{ q: "Do I need to book?", a: "Ideally yes, but I also shoot on site based on availability." }], featured: false },
      { name: "Commercial", price: "by quote", region: "Free",
        who: "For brands, shops and breeders who want warm images of their products and animals.",
        steps: ["Service tailored to your business", "Products + animals", "Free quote, no commitment"],
        flow: ["Discovery call and free quote", "Art direction to match your brand", "Products + animals session", "Commercial usage licence included"],
        faq: [{ q: "Do you grant the rights?", a: "A commercial licence tailored to your use is included; we spell it out in the quote." }], featured: false },
    ],
    fineprint: "Travel anywhere in Québec · Delivery via online gallery · Taxes extra · Prices to be confirmed before launch.",
    cta: "View all sessions",
  },

  rainbow: {
    eyebrow: "Before the Rainbow Bridge",
    title: "Memories to hold onto",
    body: "A gentle memorial session to celebrate a companion whose age or illness is shortening the road ahead. At your pace, with care and respect.",
    price: "from $600",
    priceNote: "Includes a $300 credit toward any photo or product after the session.",
    cta: "Let’s talk about it",
    alt: "A dog’s paw resting in its guardian’s hands in soft light, memorial photo by Kim Dubois",
    src: "assets/photos/rainbow/rb01-patte-mains.png",
    label: "Memorial · soft light",
  },

  testimonials: {
    eyebrow: "Testimonials",
    title: "What families say",
    google: { rating: "5.0", count: "40+", label: "Google reviews", note: "Average rating across Google and social media." },
    note: "Verified Instagram review. More client testimonials will be published at launch.",
    items: [
      { quote: "Thank you for this lovely feature! I loved my experience with you & the fact that there was no time limit meant I felt no pressure! I’m even happier to see I could contribute to a good cause by choosing you! \uD83E\uDD0D", author: "izzy.the.tomboy", animal: "Client", place: "Instagram", verified: true, alt: "Instagram profile photo of the client izzy.the.tomboy" },
      { quote: "I still cry when I look at these photos. Kim captured exactly who our dog was.", author: "The L. Family", animal: "with Mika", place: "Laval", alt: "Photo of Mika, the L. family’s dog" },
      { quote: "Our cat is very anxious. Kim’s patience changed everything, the result is gorgeous.", author: "Marie-Pier G.", animal: "with Pixel", place: "Boisbriand", alt: "Photo of Pixel, Marie-Pier’s cat" },
      { quote: "Professional from start to finish. We finally have a portrait worthy of our companion.", author: "Sébastien R.", animal: "with Loup", place: "Longueuil", alt: "Photo of Loup, Sébastien’s dog" },
      { quote: "My dog is reactive and I’d given up on outings. Kim gave us beautiful moments again.", author: "Andréanne T.", animal: "with Theo", place: "Montréal", alt: "Photo of Theo, Andréanne’s dog" },
    ],
  },

  products: {
    eyebrow: "Artwork & products",
    title: "Beyond the session",
    intro: "Your photos as fine-art prints, albums and wall art for your home.",
    items: [
      { t: "Fine-art prints", d: "Archival papers, true-to-life colour.", alt: "Framed fine-art print of a pet photograph" },
      { t: "Albums", d: "Your story, hand-bound.", alt: "Bound photo album from a pet session" },
      { t: "Wall art", d: "Large-format pieces for your home.", alt: "Large-format wall art of a pet portrait" },
      { t: "Framing", d: "Wood frames and floater boxes, ready to hang.", alt: "Ready-to-hang wood frame of a pet photograph" },
    ],
    extrasTitle: "Also available",
    extras: [
      { t: "Gift certificates", d: "Gift a session or an amount, delivered by email." },
      { t: "Product credits", d: "A credit toward your prints and artwork after the session." },
      { t: "Commercial licences", d: "Usage rights for brands and shops." },
    ],
    shopNote: "Shop hosted on Etsy for now; an integrated on-site shop is coming later.",
    cta: "Visit the shop",
    ctaHref: "https://www.etsy.com/ca-fr/shop/KimDuboisPhotographe",
  },

  clientarea: {
    eyebrow: "Client area",
    title: "Your private galleries, all in one place",
    body: "After your session, your images await in a secure private gallery: view them, download in high resolution, order prints and products, and share with your loved ones.",
    features: [
      { t: "Private viewing", d: "A secure link, just for you." },
      { t: "HD download", d: "Your high-resolution files, ready to print." },
      { t: "Product orders", d: "Prints, albums and artwork in a few clicks." },
      { t: "Easy sharing", d: "Send the gallery to your family." },
    ],
    note: "Coming soon. Your access will be emailed to you after the session.",
    cta: "Access my gallery",
    codePlaceholder: "Access code",
    ctaNote: "Already received a code?",
  },

  faq: {
    eyebrow: "Frequently asked questions",
    title: "Everything to know before you book",
    intro: "Answers to the questions I get asked most. Another question? Write to me.",
    groups: [
      { name: "Booking & payment", items: [
        { q: "How do I book my session?", a: "Through the contact form, by email, phone or message. We then plan a short consultation." },
        { q: "Is there a deposit?", a: "Yes, a 50% deposit confirms your date; the balance is due on the day of the session." },
        { q: "What payment methods do you accept?", a: "Interac e-transfer, card and cash." },
        { q: "What if I need to cancel?", a: "We reschedule at no charge and the deposit applies to the new date. For a definitive cancellation, the deposit covers the reserved time." },
      ] },
      { name: "The session", items: [
        { q: "What happens if it rains?", a: "Outdoor sessions are rescheduled at no charge until the weather is favourable." },
        { q: "Do you travel?", a: "Yes, anywhere in Québec. Travel fees may apply outside the Montréal area." },
        { q: "My animal is reactive or anxious, is it possible?", a: "That’s my specialty. Certified in canine behaviour, I adapt the location, pace and distances for a safe, positive session." },
        { q: "Does my dog have to stay on leash?", a: "Yes, for safety. I remove the leash from the image in editing, at no charge." },
      ] },
      { name: "Photos & delivery", items: [
        { q: "How many photos will I receive?", a: "Each package includes a set number of HD digital images; you choose your favourites." },
        { q: "What are the delivery times?", a: "Your private gallery is delivered online within 2 to 3 weeks." },
        { q: "Can I buy additional photos?", a: "Yes, individually or in bundles, straight from your private gallery." },
        { q: "How can I use my photos?", a: "Personal use included. For commercial use, a dedicated licence is available." },
        { q: "What is the private gallery?", a: "A secure online space where you view, download and order your images and products." },
      ] },
    ],
    cta: "I have another question",
  },

  newsletter: {
    eyebrow: "Preparation tips",
    title: "Get my tips for a successful session",
    body: "Preparing an anxious animal, picking the right moment, useful accessories: concrete tips, plus my news and availability. No spam.",
    placeholder: "Your email",
    submit: "Get the tips",
    success: "Thank you! (Mockup, no data is sent.)",
    perks: ["Preparation guide", "Reactive & anxious animals", "Early access to availability"],
  },

  travel: {
    eyebrow: "Upcoming travel",
    title: "Where to meet me soon",
    intro: "I travel across Québec. Here are my next stops: book your spot or get notified.",
    notify: "Notify me",
    book: "Book my spot",
    stops: [
      { city: "Montréal & area", period: "Ongoing", type: "Outdoor · Studio", spots: "By appointment" },
      { city: "Québec City & Lévis", period: "Spring 2026", type: "Outdoor", spots: "5 spots" },
      { city: "Eastern Townships", period: "Summer 2026", type: "Outdoor · Families", spots: "4 spots" },
      { city: "Cat shows", period: "CCA / TICA schedule", type: "Cat show", spots: "On site" },
    ],
  },

  blog: {
    eyebrow: "The blog",
    title: "Behind the scenes & reflections",
    cta: "Read the blog",
    categories: ["All", "Preparation tips", "Reactive & anxious dogs", "Québec photo spots", "End of life & memories", "Studio & cat shows", "Behind the scenes"],
    posts: [
      { date: "Sept. 3, 2024", category: "Behind the scenes", title: "Revisiting my 2015 photos: a new perspective in 2024", excerpt: "Nine years later, I reopen my archives and see these images differently, what they say about my eye, and how it has grown.", alt: "Before-and-after comparison of a 2015 pet photograph", real: true },
      { date: "Coming soon", category: "Québec photo spots", title: "My favourite spots around Montréal for an outdoor session", excerpt: "Parks, riverbanks and woodlands: where light and scenery bring out your companions through the seasons.", alt: "Bright woodland setting ideal for an outdoor photo session", real: false },
      { date: "Coming soon", category: "Reactive & anxious dogs", title: "Photographing a reactive dog: my step-by-step method", excerpt: "How I combine canine behaviour and photography for calm sessions, even with a difficult dog.", alt: "Attentive dog during an outdoor photo session", real: false },
      { date: "Coming soon", category: "Preparation tips", title: "Preparing your animal for its session: my checklist", excerpt: "Sleep, meals, favourite toys and little rituals: how to arrive relaxed on the day.", alt: "Relaxed dog with its toy before a photo session", real: false },
      { date: "Coming soon", category: "End of life & memories", title: "Before the Rainbow Bridge: creating memories gently", excerpt: "How to approach a memorial session calmly, at your companion’s pace.", alt: "Hand resting tenderly on an old dog in soft light", real: false },
      { date: "Coming soon", category: "Studio & cat shows", title: "Behind the scenes of a cat show", excerpt: "What happens at the judging table, and how I capture these moments without stressing the cats.", alt: "Cat presented on the judging table at a cat show", real: false },
    ],
  },

  contact: {
    eyebrow: "Contact & booking",
    title: "Let’s book your session",
    intro: "Tell me a few words about your companion, I’ll reply quickly to plan the consultation.",
    fields: { name: "Your name", email: "Email", animal: "Your companion (name, species)", message: "Your project in a few words", submit: "Send my request" },
    success: "Thank you! (Mockup, no data is sent.)",
    newRequest: "New request",
    emailLabel: "Email",
    phoneLabel: "Phone",
    email: "bonjour@kimdubois.ca",
    phone: "514 000-0000",
    channelsNote: "Also via Facebook, Instagram or phone, whatever you prefer.",
    coordsNote: "Placeholder contact details, to be confirmed before launch.",
  },

  footer: {
    blurb: "Award-winning pet portraits, in studio and outdoors. Certified in canine behaviour. Montréal and across Québec.",
    exploreTitle: "Explore",
    regionsTitle: "Areas served",
    moreTitle: "Learn more",
    moreLinks: ["FAQ", "Client area", "Gift certificates", "Shop"],
    regionsExtra: "+ anywhere in Québec on request",
    copyright: "© 2026 Kim Dubois Pet Photographer. All rights reserved.",
  },

  ui: {
    bookSession: "Book a session",
    notesDesign: "Design notes",
    notesTitle: "Show design notes",
    skip: "Skip to content",
    backToTop: "Back to top",
    backHome: "← Back to home",
    seeMore: "See more",
    allShown: "You’ve seen it all",
    pfPageTitle: "The full portfolio",
    pfFullCta: "View the full portfolio",
    guard: {
      badge: "Protected image",
      msg: "Photo by Kim Dubois Pet Photography. This image is protected by copyright. Please do not save, copy or reuse it without permission.",
      photographer: "Photographer",
      photographerName: "Kim Dubois",
      titleLabel: "Title",
      catLabel: "Category",
      copyright: "© Kim Dubois. All rights reserved",
    },
    scroll: "scroll",
    themeToDark: "Switch to dark theme",
    themeToLight: "Switch to light theme",
    menuOpen: "Open menu",
    menuClose: "Close menu",
    langGroup: "Site language",
    frTitle: "French version",
    enTitle: "English version",
    mostChosen: "Most chosen",
    choosePackage: "Choose",
    readArticle: "Read the article →",
    realArticle: "Real article",
    draftLabel: "Coming soon",
    tmVerified: "Verified",
    tmExample: "Example",
    annoTag: "Design note",
    mockNote: "Discussion mockup, content and prices to be confirmed",
    prev: "Previous",
    next: "Next",
    pageTitle: "Kim Dubois, Award-winning Pet Photographer | Montréal",
    metaDesc: "Kim Dubois, award-winning pet photographer (TIPPA 2024-2025) and certified in canine behaviour. Studio and outdoor portraits, across Québec. Book your session.",
    anno1: "Firm hierarchy: <b>gold = primary actions</b> (“Book”), <b>blue = secondary</b> (hero canvas, “View the portfolio”). The blue hero makes the gold button pop.",
    anno2: "Awards and the <b>canine-behaviour certification</b> appear early: credibility in under 5s, and an edge no one else has.",
    anno3: "Memorial section in a <b>blue ambiance</b>, lots of space, one sensitive sentence. Restrained and respectful, never maudlin.",
  },
};

/* ----- Tags portfolio (multi-catégories, déduits du chemin de l'image) ----- */
/* Index alignés sur portfolio.filters :
   0 Tous · 1 Chiens · 2 Chats · 3 Studio · 4 Extérieur · 5 Exposition féline
   6 Commerciale · 7 Avant le pont de l'arc-en-ciel · 8 Avec humains */
function pfTags(src) {
  const s = String(src).toLowerCase();
  const base = s.split("/").pop();
  const t = [];
  const add = (n) => { if (!t.includes(n)) t.push(n); };
  if (s.indexOf("/rainbow/") !== -1) { add(7); add(1); add(8); }
  else if (s.indexOf("/expo/") !== -1) {
    add(5); add(2);
    if (["e01", "e04", "e05", "e07", "e08", "e10", "e11", "e12", "e18"].some((h) => base.indexOf(h) !== -1)) add(8);
  } else if (s.indexOf("/comm/") !== -1) {
    add(6);
    if (base.indexOf("beagle") !== -1 || base.indexOf("boston") !== -1) add(1); else add(2);
    if (base.indexOf("comm-02") !== -1) add(8);
  } else if (s.indexOf("/studio/") !== -1) {
    const outdoorCat = base.indexOf("banc") !== -1 || base.indexOf("exterieur") !== -1;
    if (!outdoorCat) add(3);
    if (base.charAt(0) === "c") add(2); else add(1);
    if (outdoorCat) add(4);
  } else { add(1); add(4); } /* dossier dogs + héros : chiens en extérieur */
  return t;
}

/* ----- Nouvelles photos ajoutées au portfolio (bilingue, catégories via le chemin) ----- */
KD_SHARED.extra = [
  { src: "assets/photos/dogs/n01-chien-banc-orange.jpg", fr: { t: "Sur le banc d'architecte", a: "Chien assis sur un banc design en béton orange en milieu urbain, photo de Kim Dubois" }, en: { t: "On the design bench", a: "Dog sitting on an orange concrete design bench in an urban setting, photo by Kim Dubois" } },
  { src: "assets/photos/dogs/n02-shiba-fleurs.jpg", fr: { t: "Shiba parmi les fleurs", a: "Shiba inu entouré d'arbustes en fleurs jaunes, photo de Kim Dubois" }, en: { t: "Shiba among blooms", a: "Shiba inu surrounded by yellow flowering shrubs, photo by Kim Dubois" } },
  { src: "assets/photos/dogs/n03-danois-ville.jpg", fr: { t: "Deux dogues en ville", a: "Deux dogues allemands côte à côte dans une allée urbaine, photo de Kim Dubois" }, en: { t: "Two Danes in the city", a: "Two Great Danes side by side in an urban alley, photo by Kim Dubois" } },
  { src: "assets/photos/dogs/n04-samoyede-lavande.jpg", fr: { t: "Samoyède en lavande", a: "Samoyède blanc assis dans un champ de lavande, photo de Kim Dubois" }, en: { t: "Samoyed in lavender", a: "White Samoyed sitting in a lavender field, photo by Kim Dubois" } },
  { src: "assets/photos/dogs/n05-bouledogue-banc.jpg", fr: { t: "Bouledogue au parc", a: "Bouledogue français sur un banc de parc parmi les fleurs, photo de Kim Dubois" }, en: { t: "Bulldog at the park", a: "French bulldog on a park bench among blossoms, photo by Kim Dubois" } },
  { src: "assets/photos/dogs/n06-bouledogue-fleurs.jpg", fr: { t: "Bouledogue au forsythia", a: "Bouledogue français entouré de forsythias jaunes, photo de Kim Dubois" }, en: { t: "Bulldog in forsythia", a: "French bulldog surrounded by yellow forsythia, photo by Kim Dubois" } },
  { src: "assets/photos/dogs/n07-bouvier-ville.jpg", fr: { t: "Bouvier bernois en ville", a: "Bouvier bernois debout dans une allée urbaine verdoyante, photo de Kim Dubois" }, en: { t: "Bernese in the city", a: "Bernese mountain dog standing in a leafy urban alley, photo by Kim Dubois" } },
  { src: "assets/photos/dogs/n08-sheltie-riviere.jpg", fr: { t: "Au bord de la rivière", a: "Sheltie aux poils mouillés au bord d'une rivière, photo de Kim Dubois" }, en: { t: "By the river", a: "Wet-coated sheltie at the edge of a river, photo by Kim Dubois" } },
  { src: "assets/photos/dogs/n09-spitz-neige.jpg", fr: { t: "Course dans la neige", a: "Spitz japonais blanc courant dans la neige, photo de Kim Dubois" }, en: { t: "Run in the snow", a: "White Japanese spitz running through snow, photo by Kim Dubois" } },
  { src: "assets/photos/dogs/n10-chien-silhouette.jpg", fr: { t: "Silhouette au crépuscule", a: "Chien à poil long en silhouette sur une promenade, photo de Kim Dubois" }, en: { t: "Dusk silhouette", a: "Long-haired dog silhouetted on a promenade, photo by Kim Dubois" } },
  { src: "assets/photos/dogs/n11-malinois-neige.jpg", fr: { t: "Malinois en hiver", a: "Malinois belge sous la neige, regard attentif, photo de Kim Dubois" }, en: { t: "Malinois in winter", a: "Belgian Malinois in the snow, attentive gaze, photo by Kim Dubois" } },
  { src: "assets/photos/dogs/n12-sheltie-ville-course.jpg", fr: { t: "Élan urbain", a: "Sheltie s'élançant devant les tours de Montréal au lever du soleil, photo de Kim Dubois" }, en: { t: "Urban dash", a: "Sheltie bounding in front of Montréal's towers at sunrise, photo by Kim Dubois" } },
  { src: "assets/photos/dogs/n13-spitz-ville-coucher.jpg", fr: { t: "Coucher de soleil sur la ville", a: "Petit spitz en silhouette devant la ville au soleil couchant, photo de Kim Dubois" }, en: { t: "City sunset", a: "Small spitz silhouetted against the city at sunset, photo by Kim Dubois" } },
  { src: "assets/photos/dogs/n14-akita-escalier.jpg", fr: { t: "Akita sous la neige", a: "Akita américain sur un escalier enneigé, photo de Kim Dubois" }, en: { t: "Akita in snow", a: "American Akita on snowy stairs, photo by Kim Dubois" } },
  { src: "assets/photos/dogs/n15-berger-reflet.jpg", fr: { t: "Reflet sur le chemin", a: "Berger allemand sur un sentier mouillé, reflet dans l'eau, photo de Kim Dubois" }, en: { t: "Reflection on the path", a: "German shepherd on a wet trail, reflected in the water, photo by Kim Dubois" } },
  { src: "assets/photos/dogs/n16-husky-sous-bois.jpg", fr: { t: "Husky en sous-bois", a: "Husky sibérien au bout d'un sentier en sous-bois lumineux, photo de Kim Dubois" }, en: { t: "Husky in the woods", a: "Siberian husky at the end of a bright woodland trail, photo by Kim Dubois" } },
  { src: "assets/photos/dogs/n17-shihtzu-sentier2.jpg", fr: { t: "Shih tzu en promenade", a: "Shih tzu sur un sentier bordé de verdure, photo de Kim Dubois" }, en: { t: "Shih tzu on a walk", a: "Shih tzu on a greenery-lined path, photo by Kim Dubois" } },
  { src: "assets/photos/dogs/n18-berger-tronc2.jpg", fr: { t: "Sur le tronc flotté", a: "Berger allemand debout sur un tronc flotté au bord de l'eau, photo de Kim Dubois" }, en: { t: "On the driftwood", a: "German shepherd standing on driftwood by the water, photo by Kim Dubois" } },
  { src: "assets/photos/dogs/n19-chihuahua-jouet.jpg", fr: { t: "Chihuahua et son jouet", a: "Chihuahua tenant son jouet dans l'herbe fleurie, photo de Kim Dubois" }, en: { t: "Chihuahua and its toy", a: "Chihuahua holding its toy in flowery grass, photo by Kim Dubois" } },
  { src: "assets/photos/studio/s10-canecorso-rose.jpg", fr: { t: "Cane Corso · fond corail", a: "Cane Corso gris sur fond corail en studio, photo de Kim Dubois" }, en: { t: "Cane Corso · coral backdrop", a: "Grey Cane Corso on a coral backdrop in studio, photo by Kim Dubois" } },
  { src: "assets/photos/studio/s11-beagle-rose.jpg", fr: { t: "Studio · fond corail", a: "Beagle sur fond corail en studio, photo de Kim Dubois" }, en: { t: "Studio · coral backdrop", a: "Beagle on a coral backdrop in studio, photo by Kim Dubois" } },
  { src: "assets/photos/studio/s12-basenji-stack.jpg", fr: { t: "Basenji en position", a: "Basenji en position d'exposition sur fond corail, photo de Kim Dubois" }, en: { t: "Basenji in stack", a: "Basenji in a show stack on a coral backdrop, photo by Kim Dubois" } },
  { src: "assets/photos/studio/c10-rex-chatons.jpg", fr: { t: "Chatons Cornish Rex", a: "Deux chatons Cornish Rex blottis sur fond sombre en studio, photo de Kim Dubois" }, en: { t: "Cornish Rex kittens", a: "Two Cornish Rex kittens nestled on a dark studio backdrop, photo by Kim Dubois" } },
  { src: "assets/photos/studio/c11-rex-chaton-blanc.jpg", fr: { t: "Chaton tout en douceur", a: "Chaton Cornish Rex blanc étendu sur fond sombre, photo de Kim Dubois" }, en: { t: "A gentle kitten", a: "White Cornish Rex kitten stretched out on a dark backdrop, photo by Kim Dubois" } },
  { src: "assets/photos/studio/c12-rex-noir2.jpg", fr: { t: "Regard sur noir", a: "Cornish Rex sur fond noir en studio, photo de Kim Dubois" }, en: { t: "Gaze on black", a: "Cornish Rex on a black studio backdrop, photo by Kim Dubois" } },
  { src: "assets/photos/studio/c13-rex-jaune2.jpg", fr: { t: "Studio · fond jaune", a: "Cornish Rex sur fond jaune vif en studio, photo de Kim Dubois" }, en: { t: "Studio · yellow backdrop", a: "Cornish Rex on a bright yellow backdrop in studio, photo by Kim Dubois" } },
  { src: "assets/photos/studio/c14-rex-jaune-patte.jpg", fr: { t: "Petite patte levée", a: "Cornish Rex levant la patte sur fond jaune, photo de Kim Dubois" }, en: { t: "Little raised paw", a: "Cornish Rex lifting a paw on a yellow backdrop, photo by Kim Dubois" } },
  { src: "assets/photos/studio/c15-rex-jaune-cri.jpg", fr: { t: "En pleine conversation", a: "Cornish Rex miaulant sur fond jaune en studio, photo de Kim Dubois" }, en: { t: "Mid-conversation", a: "Cornish Rex meowing on a yellow studio backdrop, photo by Kim Dubois" } },
  { src: "assets/photos/studio/c16-chat-corail.jpg", fr: { t: "Jeu sur fond corail", a: "Chat joueur sur fond corail en studio, photo de Kim Dubois" }, en: { t: "Play on coral", a: "Playful cat on a coral studio backdrop, photo by Kim Dubois" } },
  { src: "assets/photos/studio/c18-chat-lumiere2.jpg", fr: { t: "Lumière douce", a: "Chat noir et blanc au repos dans une lumière douce, photo de Kim Dubois" }, en: { t: "Soft light", a: "Black-and-white cat resting in soft light, photo by Kim Dubois" } },
  { src: "assets/photos/studio/c17-chat-banc-jaune2.jpg", fr: { t: "Chat au banc jaune", a: "Chat gris assis sur un banc jaune en plein air, photo de Kim Dubois" }, en: { t: "Cat on a yellow bench", a: "Grey cat sitting on a yellow bench outdoors, photo by Kim Dubois" } },
  { src: "assets/photos/expo/e19.jpg", fr: { t: "Au plumeau", a: "Sphynx suivant un plumeau sur la table de jugement, photo de Kim Dubois" }, en: { t: "On the wand", a: "Sphynx following a feather wand on the judging table, photo by Kim Dubois" } },
  { src: "assets/photos/expo/e20.jpg", fr: { t: "À bout de bras", a: "Cornish Rex roux et blanc présenté à bout de bras, photo de Kim Dubois" }, en: { t: "At arm's length", a: "Orange-and-white Cornish Rex presented at arm's length, photo by Kim Dubois" } },
  { src: "assets/photos/expo/e21.jpg", fr: { t: "Maine Coon en exposition", a: "Maine Coon sur la table d'exposition féline, photo de Kim Dubois" }, en: { t: "Maine Coon on show", a: "Maine Coon on the cat-show table, photo by Kim Dubois" } },
  { src: "assets/photos/expo/e22.jpg", fr: { t: "Portrait de Maine Coon", a: "Portrait de Maine Coon sur la table de jugement, photo de Kim Dubois" }, en: { t: "Maine Coon portrait", a: "Maine Coon portrait on the judging table, photo by Kim Dubois" } },
  { src: "assets/photos/expo/e23.jpg", fr: { t: "Petit dinosaure", a: "Cornish Rex en costume de dinosaure vert à l'exposition féline, photo de Kim Dubois" }, en: { t: "Little dinosaur", a: "Cornish Rex in a green dinosaur costume at the cat show, photo by Kim Dubois" } },
  { src: "assets/photos/expo/e24.jpg", fr: { t: "Sphynx en présentation", a: "Sphynx présenté sur la table d'exposition, photo de Kim Dubois" }, en: { t: "Sphynx on show", a: "Sphynx presented on the show table, photo by Kim Dubois" } },
  { src: "assets/photos/expo/e25.jpg", fr: { t: "Maine Coon dressé", a: "Maine Coon dressé sur ses pattes en présentation, photo de Kim Dubois" }, en: { t: "Maine Coon standing", a: "Maine Coon standing on its hind legs in presentation, photo by Kim Dubois" } },
  { src: "assets/photos/expo/e26.jpg", fr: { t: "Robe chocolat", a: "Chat brun chocolat sur la table de jugement, photo de Kim Dubois" }, en: { t: "Chocolate coat", a: "Chocolate-brown cat on the judging table, photo by Kim Dubois" } },
  { src: "assets/photos/comm/comm-07-rex-mavericks.jpg", fr: { t: "Gâteries en vedette", a: "Cornish Rex aux côtés d'un sachet de gâteries, photo commerciale de Kim Dubois" }, en: { t: "Treats in focus", a: "Cornish Rex beside a treat pouch, commercial photo by Kim Dubois" } },
];

/* ----- Données partagées injectées dans chaque langue ----- */
[KD_FR, KD_EN].forEach((D) => {
  D.brand.since = 2014;
  (function () {
    const L = (D === KD_FR) ? "fr" : "en";
    KD_SHARED.extra.forEach((x) => { D.portfolio.items.push({ src: x.src, title: x[L].t, alt: x[L].a, catIdx: 1 }); });
  })();
  D.social = KD_SHARED.social;
  D.regions = KD_SHARED.regions;
  D.awards.categories = KD_SHARED.awardCategories;
  D.awards.medals = KD_SHARED.medalTiers.map((tier, i) => ({ tier, cat: KD_SHARED.medalCats[i] }));
  D.awards.certs = KD_SHARED.certs;
  D.nav.forEach((n, i) => { n.href = KD_SHARED.navHrefs[i]; });
  D.portfolio.items.forEach((it, i) => {
    if (!it.color) it.color = KD_SHARED.portfolioColors[i % KD_SHARED.portfolioColors.length];
    it.tags = pfTags(it.src);
    it.cat = D.portfolio.filters[(it.tags[0] != null ? it.tags[0] : it.catIdx)] || D.portfolio.filters[it.catIdx];
  });
  D.portfolio.lots = KD_SHARED.portfolioLots;
  D.testimonials.items.forEach((t, i) => { t.color = KD_SHARED.testimonialColors[i % KD_SHARED.testimonialColors.length]; });
  D.products.items.forEach((p, i) => { p.color = KD_SHARED.productColors[i % KD_SHARED.productColors.length]; });
  D.process.steps.forEach((s, i) => { s.color = KD_SHARED.processColors[i % KD_SHARED.processColors.length]; });
  D.blog.posts.forEach((p, i) => { p.color = KD_SHARED.blogColors[i % KD_SHARED.blogColors.length]; });
  const BLOG_SRC = [
    "assets/photos/blog/b1-sheltie-fleurs.jpg",
    "assets/photos/blog/b2-plein-air.jpg",
    "assets/photos/blog/b3-attentif.jpg",
    "assets/photos/blog/b4-preparation.jpg",
    "assets/photos/blog/b5-douceur.jpg",
    "assets/photos/blog/b6-expo.jpg",
  ];
  const TM_SRC = [
    "assets/photos/testimonials/t1.jpg",
    "assets/photos/testimonials/t2.jpg",
    "assets/photos/testimonials/t3.jpg",
    "assets/photos/testimonials/t4.jpg",
    "assets/photos/testimonials/t5.jpg",
  ];
  D.blog.posts.forEach((p, i) => { if (BLOG_SRC[i]) p.src = BLOG_SRC[i]; });
  D.testimonials.items.forEach((t, i) => { if (TM_SRC[i]) t.src = TM_SRC[i]; });
});

/* ----- Registre i18n + accès dynamique via window.KD ----- */
window.KD_I18N = { fr: KD_FR, en: KD_EN };
window.__KDLANG = "fr";
Object.defineProperty(window, "KD", {
  configurable: true,
  get() { return window.KD_I18N[window.__KDLANG] || window.KD_I18N.fr; },
});
