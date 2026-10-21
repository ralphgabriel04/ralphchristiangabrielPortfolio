/**
 * Photo gallery (/photos): every usable photo of Ralph gathered on 2026-10-17 from his
 * Proton originals (La Caisse, Oct. 2026), Instagram and LinkedIn posts (2023-2026).
 * Dates are the month of the shoot or of the post. Files: public/images/gallery/<slug>.jpg
 * (1600 px max, EXIF removed). Left out on purpose: large group photos (his rule), couple
 * and family photos, a shirtless photo, screenshots, and near-identical frames.
 */
type L10n = { fr: string; en: string };

export type GalleryPhoto = { slug: string; w: number; h: number; date: L10n; caption: L10n; alt: L10n };
export type GalleryGroup = { id: string; title: L10n; intro: L10n; photos: GalleryPhoto[] };

export const gallerySrc = (slug: string) => `/images/gallery/${slug}.jpg`;

export const galleryGroups: GalleryGroup[] = [
  {
    id: "la-caisse",
    title: { fr: "À La Caisse", en: "At La Caisse" },
    intro: { fr: "Stage en automatisation de processus, automne 2026.", en: "Process automation internship, fall 2026." },
    photos: [
      { slug: "la-caisse-portrait-2026", w: 1280, h: 1600, date: { fr: "oct. 2026", en: "Oct. 2026" }, caption: { fr: "Au siège de La Caisse", en: "At La Caisse headquarters" }, alt: { fr: "Ralph Christian Gabriel en blazer gris dans l'atrium vitré du siège de La Caisse", en: "Ralph Christian Gabriel in a grey blazer in the glass atrium of La Caisse headquarters" } },
      { slug: "la-caisse-atrium-sourire-2026", w: 1600, h: 1067, date: { fr: "oct. 2026", en: "Oct. 2026" }, caption: { fr: "Dans l'atrium", en: "In the atrium" }, alt: { fr: "Ralph Christian Gabriel souriant, appuyé à la rampe de l'atrium de La Caisse", en: "Ralph Christian Gabriel smiling, leaning on the railing of the La Caisse atrium" } },
      { slug: "la-caisse-headshot-2026", w: 1280, h: 1600, date: { fr: "oct. 2026", en: "Oct. 2026" }, caption: { fr: "Portrait professionnel", en: "Professional headshot" }, alt: { fr: "Portrait de Ralph Christian Gabriel souriant, chandail rayé et cravate", en: "Headshot of Ralph Christian Gabriel smiling, in a striped sweater and tie" } },
      { slug: "la-caisse-ambassadeur-2026", w: 1287, h: 1019, date: { fr: "oct. 2026", en: "Oct. 2026" }, caption: { fr: "Ambassadeur du programme P.A.S.", en: "P.A.S. program ambassador" }, alt: { fr: "Carte d'ambassadeur de La Caisse au nom de Ralph Christian Gabriel, Solutions numériques et analytique, Automatisation des processus", en: "La Caisse ambassador card for Ralph Christian Gabriel, Digital Solutions and Analytics, Process Automation" } },
    ],
  },
  {
    id: "portraits",
    title: { fr: "Portraits", en: "Portraits" },
    intro: { fr: "Séance studio, complet gris et sorties.", en: "Studio session, grey suit and evenings out." },
    photos: [
      { slug: "studio-bras-croises-2025", w: 1284, h: 1291, date: { fr: "janv. 2025", en: "Jan. 2025" }, caption: { fr: "Séance studio", en: "Studio session" }, alt: { fr: "Portrait studio de Ralph Christian Gabriel, bras croisés, chandail gris, fond sombre", en: "Studio portrait of Ralph Christian Gabriel, arms crossed, grey sweater, dark background" } },
      { slug: "studio-trois-quarts-2025", w: 1284, h: 1290, date: { fr: "janv. 2025", en: "Jan. 2025" }, caption: { fr: "Séance studio, de trois quarts", en: "Studio session, three-quarter view" }, alt: { fr: "Portrait studio de Ralph Christian Gabriel de trois quarts, sourire discret", en: "Studio portrait of Ralph Christian Gabriel in three-quarter view, with a slight smile" } },
      { slug: "complet-gris-2024", w: 1280, h: 1600, date: { fr: "sept. 2024", en: "Sept. 2024" }, caption: { fr: "En complet gris", en: "In a grey suit" }, alt: { fr: "Ralph Christian Gabriel en complet gris et lunettes de soleil, assis devant un mur à lattes", en: "Ralph Christian Gabriel in a grey suit and sunglasses, sitting in front of a slatted wall" } },
      { slug: "restaurant-2026", w: 1200, h: 1600, date: { fr: "févr. 2026", en: "Feb. 2026" }, caption: { fr: "Au restaurant", en: "At a restaurant" }, alt: { fr: "Ralph Christian Gabriel à table au restaurant, chemise blanche et lunettes, la main au menton", en: "Ralph Christian Gabriel at a restaurant table, white shirt and glasses, hand on his chin" } },
    ],
  },
  {
    id: "etudes",
    title: { fr: "Études", en: "Studies" },
    intro: { fr: "Le DEC au Collège de Rosemont, puis le baccalauréat à l'ÉTS.", en: "The DEC at Collège de Rosemont, then the bachelor's degree at ÉTS." },
    photos: [
      { slug: "finissant-portrait-2024", w: 1105, h: 1600, date: { fr: "juin 2024", en: "June 2024" }, caption: { fr: "Portrait de finissant, Collège de Rosemont", en: "Graduation portrait, Collège de Rosemont" }, alt: { fr: "Ralph Christian Gabriel en toge et toque, diplôme en main, sur fond clair", en: "Ralph Christian Gabriel in gown and cap, diploma in hand, on a light background" } },
      { slug: "finissant-diplome-2024", w: 1440, h: 1085, date: { fr: "juin 2024", en: "June 2024" }, caption: { fr: "Diplôme en main", en: "Diploma in hand" }, alt: { fr: "Ralph Christian Gabriel souriant en toge, tenant son diplôme", en: "Ralph Christian Gabriel smiling in his gown, holding his diploma" } },
      { slug: "finissant-toge-2024", w: 1440, h: 1085, date: { fr: "juin 2024", en: "June 2024" }, caption: { fr: "En toge", en: "In the gown" }, alt: { fr: "Ralph Christian Gabriel debout en toge et toque devant un fond blanc", en: "Ralph Christian Gabriel standing in gown and cap in front of a white backdrop" } },
      { slug: "finissant-coulisses-2024", w: 1440, h: 1085, date: { fr: "juin 2024", en: "June 2024" }, caption: { fr: "Les coulisses de la séance photo", en: "Behind the scenes of the photo session" }, alt: { fr: "Ralph Christian Gabriel en toge pendant la séance photo, la photographe au premier plan", en: "Ralph Christian Gabriel in his gown during the photo session, the photographer in the foreground" } },
      { slug: "finissant-diplome-toque-2024", w: 1440, h: 1085, date: { fr: "juin 2024", en: "June 2024" }, caption: { fr: "Diplôme, toque et rose", en: "Diploma, cap and rose" }, alt: { fr: "Diplôme roulé, toque et rose posés sur un parquet", en: "Rolled diploma, cap and rose on a parquet floor" } },
      { slug: "ets-facade-2024", w: 1600, h: 1200, date: { fr: "sept. 2024", en: "Sept. 2024" }, caption: { fr: "Le pavillon principal de l'ÉTS", en: "The ÉTS main building" }, alt: { fr: "Façade du pavillon principal de l'ÉTS, l'ancienne brasserie Dow, à Montréal", en: "Facade of the ÉTS main building, the former Dow brewery, in Montréal" } },
      { slug: "ets-50-ans-2024", w: 1600, h: 1200, date: { fr: "sept. 2024", en: "Sept. 2024" }, caption: { fr: "Les 50 ans de l'ÉTS", en: "ÉTS turns 50" }, alt: { fr: "Escalier décoré pour les 50 ans de l'ÉTS", en: "Staircase decorated for the 50th anniversary of ÉTS" } },
      { slug: "ets-campus-2024", w: 1600, h: 1200, date: { fr: "sept. 2024", en: "Sept. 2024" }, caption: { fr: "Le campus de l'ÉTS", en: "The ÉTS campus" }, alt: { fr: "Promenade et pavillons du campus de l'ÉTS sous un ciel bleu", en: "Walkway and buildings of the ÉTS campus under a blue sky" } },
      { slug: "ets-centre-ville-2024", w: 1600, h: 1200, date: { fr: "sept. 2024", en: "Sept. 2024" }, caption: { fr: "L'ÉTS et le centre-ville", en: "ÉTS and downtown" }, alt: { fr: "Pavillon de l'ÉTS avec les tours du centre-ville de Montréal en arrière-plan", en: "ÉTS building with the downtown Montréal towers in the background" } },
    ],
  },
  {
    id: "sport",
    title: { fr: "Sport", en: "Sport" },
    intro: { fr: "Le demi-marathon de Laval, l'entraînement et le ski.", en: "The Laval half marathon, training and skiing." },
    photos: [
      { slug: "demi-marathon-medaille-2024", w: 1200, h: 1600, date: { fr: "juin 2024", en: "June 2024" }, caption: { fr: "Médaille du demi-marathon", en: "Half-marathon medal" }, alt: { fr: "Ralph Christian Gabriel brandit sa médaille après le demi-marathon de Laval", en: "Ralph Christian Gabriel holding up his medal after the Laval half marathon" } },
      { slug: "demi-marathon-arrivee-2024", w: 720, h: 480, date: { fr: "juin 2024", en: "June 2024" }, caption: { fr: "À l'arrivée", en: "At the finish" }, alt: { fr: "Ralph Christian Gabriel souriant près de l'arrivée du demi-marathon, dossard 559", en: "Ralph Christian Gabriel smiling near the half-marathon finish, bib 559" } },
      { slug: "demi-marathon-course-1-2024", w: 715, h: 1080, date: { fr: "juin 2024", en: "June 2024" }, caption: { fr: "Devant les spectateurs", en: "Past the spectators" }, alt: { fr: "Ralph Christian Gabriel court devant les spectateurs, dossard 559", en: "Ralph Christian Gabriel running past the spectators, bib 559" } },
      { slug: "demi-marathon-course-2-2024", w: 720, h: 1080, date: { fr: "juin 2024", en: "June 2024" }, caption: { fr: "Entre les arbres", en: "Under the trees" }, alt: { fr: "Ralph Christian Gabriel en pleine course sur une route bordée d'arbres", en: "Ralph Christian Gabriel running on a tree-lined road" } },
      { slug: "demi-marathon-course-3-2024", w: 720, h: 1080, date: { fr: "juin 2024", en: "June 2024" }, caption: { fr: "Seul sur la route", en: "Alone on the road" }, alt: { fr: "Ralph Christian Gabriel court seul sur la route", en: "Ralph Christian Gabriel running alone on the road" } },
      { slug: "demi-marathon-duo-2024", w: 720, h: 1080, date: { fr: "juin 2024", en: "June 2024" }, caption: { fr: "Côte à côte", en: "Side by side" }, alt: { fr: "Ralph Christian Gabriel court à côté d'un autre coureur", en: "Ralph Christian Gabriel running beside another runner" } },
      { slug: "demi-marathon-selfie-2024", w: 1440, h: 1080, date: { fr: "juin 2024", en: "June 2024" }, caption: { fr: "Selfie avec la médaille", en: "Selfie with the medal" }, alt: { fr: "Selfie de Ralph Christian Gabriel avec sa médaille et son casque d'écoute", en: "Selfie of Ralph Christian Gabriel with his medal and headphones" } },
      { slug: "demi-marathon-dossard-2024", w: 1440, h: 1085, date: { fr: "juin 2024", en: "June 2024" }, caption: { fr: "Dossard 559, 21,1 km", en: "Bib 559, 21.1 km" }, alt: { fr: "Dossard 559 au nom de Ralph Christian, Course des pompiers de Laval, 21,1 km", en: "Bib 559 for Ralph Christian, Laval firefighters' race, 21.1 km" } },
      { slug: "course-entrainement-2025", w: 640, h: 1136, date: { fr: "mai 2025", en: "May 2025" }, caption: { fr: "Entraînement de course", en: "Running practice" }, alt: { fr: "Selfie souriant de Ralph Christian Gabriel pendant un entraînement de course", en: "Smiling selfie of Ralph Christian Gabriel during a running practice" } },
      { slug: "course-sentier-2025", w: 640, h: 1136, date: { fr: "mai 2025", en: "May 2025" }, caption: { fr: "En sentier", en: "On the trail" }, alt: { fr: "Selfie de Ralph Christian Gabriel pendant un entraînement en sentier", en: "Selfie of Ralph Christian Gabriel during a trail run" } },
      { slug: "salle-velo-2024", w: 900, h: 1253, date: { fr: "août 2024", en: "Aug. 2024" }, caption: { fr: "Vélo stationnaire", en: "Stationary bike" }, alt: { fr: "Ralph Christian Gabriel sur un vélo stationnaire, devant une murale de forêt", en: "Ralph Christian Gabriel on a stationary bike in front of a forest mural" } },
      { slug: "ski-val-saint-come-2024", w: 1440, h: 1083, date: { fr: "déc. 2024", en: "Dec. 2024" }, caption: { fr: "Ski à Val-Saint-Côme", en: "Skiing at Val-Saint-Côme" }, alt: { fr: "Selfie de Ralph Christian Gabriel en casque de ski, bâtons à la main", en: "Selfie of Ralph Christian Gabriel in a ski helmet, poles in hand" } },
      { slug: "ski-piste-2024", w: 1440, h: 1083, date: { fr: "déc. 2024", en: "Dec. 2024" }, caption: { fr: "La piste au crépuscule", en: "The slope at dusk" }, alt: { fr: "Piste de ski de Val-Saint-Côme au crépuscule, montagnes en arrière-plan", en: "Ski slope at Val-Saint-Côme at dusk, mountains in the background" } },
    ],
  },
  {
    id: "plein-air",
    title: { fr: "Plein air", en: "Outdoors" },
    intro: { fr: "Montréal, Québec et ailleurs.", en: "Montréal, Québec City and beyond." },
    photos: [
      { slug: "mont-royal-2025", w: 1204, h: 1600, date: { fr: "août 2025", en: "Aug. 2025" }, caption: { fr: "Belvédère du Mont-Royal, la nuit", en: "Mount Royal lookout, at night" }, alt: { fr: "Ralph Christian Gabriel au belvédère du Mont-Royal, la nuit, avec Montréal illuminée en arrière-plan", en: "Ralph Christian Gabriel at the Mount Royal lookout at night, with Montréal lit up behind him" } },
      { slug: "bord-de-l-eau-2026", w: 1200, h: 1600, date: { fr: "juin 2026", en: "June 2026" }, caption: { fr: "Au bord de l'eau", en: "By the water" }, alt: { fr: "Ralph Christian Gabriel debout au bord d'une rivière, en tenue crème", en: "Ralph Christian Gabriel standing by a river in a cream outfit" } },
      { slug: "sutton-2026", w: 1212, h: 1600, date: { fr: "août 2026", en: "Aug. 2026" }, caption: { fr: "Un café à Sutton", en: "A café in Sutton" }, alt: { fr: "Ralph Christian Gabriel assis à une table dans un café de Sutton, le regard tourné vers la fenêtre", en: "Ralph Christian Gabriel sitting at a table in a café in Sutton, looking toward the window" } },
      { slug: "chute-montmorency-2024", w: 1045, h: 789, date: { fr: "août 2024", en: "Aug. 2024" }, caption: { fr: "Chute Montmorency et arc-en-ciel", en: "Montmorency Falls and a rainbow" }, alt: { fr: "Selfie de Ralph Christian Gabriel devant la chute Montmorency, avec un arc-en-ciel", en: "Selfie of Ralph Christian Gabriel in front of Montmorency Falls, with a rainbow" } },
      { slug: "cabane-a-sucre-2024", w: 812, h: 611, date: { fr: "2024", en: "2024" }, caption: { fr: "Cabane à sucre", en: "Sugar shack" }, alt: { fr: "Ralph Christian Gabriel debout sur une chaise géante rose, dans la neige, à la cabane à sucre", en: "Ralph Christian Gabriel standing on a giant pink chair in the snow at a sugar shack" } },
    ],
  },
  {
    id: "cuisine",
    title: { fr: "En cuisine", en: "In the kitchen" },
    intro: { fr: "Fait maison.", en: "Homemade." },
    photos: [
      { slug: "cuisine-pizza-2025", w: 900, h: 1600, date: { fr: "avr. 2025", en: "Apr. 2025" }, caption: { fr: "Pizza maison", en: "Homemade pizza" }, alt: { fr: "Pizza maison garnie, avant la cuisson", en: "Homemade pizza with toppings, before baking" } },
      { slug: "cuisine-repas-2024", w: 1170, h: 859, date: { fr: "juill. 2024", en: "July 2024" }, caption: { fr: "Un repas équilibré", en: "A balanced meal" }, alt: { fr: "Assiette avec pâtes, pain pita, banane, café et verre d'eau", en: "Plate with pasta, pita bread, a banana, coffee and a glass of water" } },
      { slug: "cuisine-oeufs-2024", w: 640, h: 1136, date: { fr: "juin 2024", en: "June 2024" }, caption: { fr: "Œufs à la poêle", en: "Eggs in the pan" }, alt: { fr: "Œufs qui cuisent dans une poêle, avec la phrase « No one turns their eggs better than me »", en: "Eggs cooking in a pan, with the caption \"No one turns their eggs better than me\"" } },
    ],
  },
  {
    id: "poste",
    title: { fr: "Mon poste de travail", en: "My desk" },
    intro: { fr: "Là où j'écris mon code.", en: "Where I write my code." },
    photos: [
      { slug: "poste-double-ecran-2024", w: 1022, h: 1600, date: { fr: "juin 2024", en: "June 2024" }, caption: { fr: "Double écran et clavier mécanique", en: "Two screens and a mechanical keyboard" }, alt: { fr: "Bureau avec deux écrans allumés et un clavier mécanique", en: "Desk with two screens on and a mechanical keyboard" } },
      { slug: "poste-portable-2025", w: 640, h: 960, date: { fr: "mars 2025", en: "Mar. 2025" }, caption: { fr: "Du code et de la musique lo-fi", en: "Code and lo-fi music" }, alt: { fr: "Portable ouvert sur un éditeur de code, avec une pastille de musique lo-fi", en: "Laptop open on a code editor, with a lo-fi music sticker" } },
      { slug: "poste-nuit-2023", w: 640, h: 808, date: { fr: "déc. 2023", en: "Dec. 2023" }, caption: { fr: "Session de code à 2 h 27", en: "Coding session at 2:27 a.m." }, alt: { fr: "Écran de code et clavier rétroéclairé dans le noir, avec l'heure 02:27", en: "Code on screen and a backlit keyboard in the dark, with the time 02:27" } },
    ],
  },
];

export const galleryCount = galleryGroups.reduce((total, g) => total + g.photos.length, 0);
