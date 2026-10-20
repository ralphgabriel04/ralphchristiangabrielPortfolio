/**
 * Reading, quotes and learning system (About page, "Ce que je lis").
 *
 * Source of truth: Ralph's own LinkedIn posts (Mar–Jun 2026). Every book below
 * links to the post where he summarized it; every takeaway is his own sentence
 * from that post (spoken French lightly polished for The ONE Thing only).
 * Covers: Open Library (reference editions), normalized to 400×600; the 12-Week
 * MBA has no public cover, so it uses a typographic cover in the site palette.
 */
type L10n = { fr: string; en: string };

export type BookCategory = "engineering" | "focus" | "leadership" | "business" | "learning" | "meaning";

export type Book = {
  slug: string;
  title: string;
  author: string;
  /** Month he read and posted about it (YYYY-MM) */
  read: string;
  category: BookCategory;
  cover: string;
  /** His LinkedIn note on the book */
  post: string;
  /** Featured books get a takeaway (his words) and where he applied it */
  featured?: { takeaway: L10n; applied: L10n };
};

const li = (id: string) => `https://www.linkedin.com/feed/update/urn:li:activity:${id}/`;
const cover = (slug: string) => `/images/library/${slug}.jpg`;

export const books: Book[] = [
  {
    slug: "thinking-in-systems",
    title: "Thinking in Systems",
    author: "Donella H. Meadows",
    read: "2026-05",
    category: "engineering",
    cover: cover("thinking-in-systems"),
    post: li("7460713048215875586"),
    featured: {
      takeaway: {
        fr: "On ne corrige pas un bug de système au niveau de la feature. On le corrige au niveau des relations.",
        en: "You can't fix a system bug at the feature level. You have to fix it at the relationship level.",
      },
      applied: {
        fr: "Cadence : la boucle d'abandon des athlètes réglée à la source, avec un estimateur de volume pour le coach.",
        en: "Cadence: fixed the athlete drop-off loop at its source, with a volume estimator for coaches.",
      },
    },
  },
  {
    slug: "design-of-everyday-things",
    title: "The Design of Everyday Things",
    author: "Don Norman",
    read: "2026-06",
    category: "engineering",
    cover: cover("design-of-everyday-things"),
    post: li("7470497559661391872"),
    featured: {
      takeaway: {
        fr: "Si ton utilisateur se trompe, regarde ton design avant de blâmer ton utilisateur.",
        en: "If your user makes a mistake, look at your design before blaming the user.",
      },
      applied: {
        fr: "GTI350 (IHM, ÉTS) : affordance, mapping et rétroaction dans mes interfaces.",
        en: "GTI350 (HCI, ÉTS): affordance, mapping and feedback in my interfaces.",
      },
    },
  },
  {
    slug: "deep-work",
    title: "Deep Work",
    author: "Cal Newport",
    read: "2026-03",
    category: "focus",
    cover: cover("deep-work"),
    post: li("7444715259606642688"),
    featured: {
      takeaway: {
        fr: "3 heures concentrées > 8 heures distraites.",
        en: "3 focused hours > 8 distracted hours.",
      },
      applied: {
        fr: "Des blocs horaires précis au lieu de listes, le téléphone dans une autre pièce, 6 Pomodoros maximum par jour.",
        en: "Precise time blocks instead of to-do lists, phone in another room, 6 Pomodoros a day at most.",
      },
    },
  },
  {
    slug: "atomic-habits",
    title: "Atomic Habits",
    author: "James Clear",
    read: "2026-03",
    category: "focus",
    cover: cover("atomic-habits"),
    post: li("7441816018424889348"),
    featured: {
      takeaway: {
        fr: "L'objectif change ce que tu vises. L'identité change ce que tu fais.",
        en: "Goals change what you aim for. Identity changes what you do.",
      },
      applied: {
        fr: "Une habitude à la fois, et ne jamais manquer deux fois de suite.",
        en: "One habit at a time, and never miss twice in a row.",
      },
    },
  },
  {
    slug: "five-dysfunctions-of-a-team",
    title: "The Five Dysfunctions of a Team",
    author: "Patrick Lencioni",
    read: "2026-04",
    category: "leadership",
    cover: cover("five-dysfunctions-of-a-team"),
    post: li("7450158548140908544"),
    featured: {
      takeaway: {
        fr: "La confiance se construit par la clarté, pas par l'amitié.",
        en: "Trust is built through clarity, not friendship.",
      },
      applied: {
        fr: "Cadence : une réunion hebdomadaire, un responsable et une échéance pour chaque tâche.",
        en: "Cadence: a weekly meeting, an owner and a deadline for every task.",
      },
    },
  },
  {
    slug: "the-one-thing",
    title: "The ONE Thing",
    author: "Gary Keller",
    read: "2026-03",
    category: "focus",
    cover: cover("the-one-thing"),
    post: li("7442910755034820608"),
    featured: {
      takeaway: {
        fr: "Le problème, ce n'est jamais le manque de temps. C'est d'avoir trop de priorités.",
        en: "The problem is never a lack of time. It's having too many priorities.",
      },
      applied: {
        fr: "Mon premier domino : le sommeil. Quand il tient, tout le reste suit.",
        en: "My first domino: sleep. When it holds, everything else follows.",
      },
    },
  },
  // Also read in 2026 (shelf)
  { slug: "clean-architecture", title: "Clean Architecture", author: "Robert C. Martin", read: "2026-05", category: "engineering", cover: cover("clean-architecture"), post: li("7461075443341881345") },
  { slug: "pragmatic-programmer", title: "The Pragmatic Programmer", author: "David Thomas & Andrew Hunt", read: "2026-05", category: "engineering", cover: cover("pragmatic-programmer"), post: li("7462162601754492928") },
  { slug: "death-march", title: "Death March", author: "Edward Yourdon", read: "2026-06", category: "engineering", cover: cover("death-march"), post: li("7468323194177794048") },
  { slug: "the-12-week-mba", title: "The 12-Week MBA", author: "Bjorn Billhardt & Nathan Kracklauer", read: "2026-05", category: "business", cover: cover("the-12-week-mba"), post: li("7459980713090719744") },
  { slug: "how-to-make-a-few-billion-dollars", title: "How to Make a Few Billion Dollars", author: "Brad Jacobs", read: "2026-05", category: "business", cover: cover("how-to-make-a-few-billion-dollars"), post: li("7460350657531695104") },
  { slug: "psychology-of-money", title: "The Psychology of Money", author: "Morgan Housel", read: "2026-04", category: "business", cover: cover("psychology-of-money"), post: li("7449426272696328192") },
  { slug: "burn-the-boats", title: "Burn the Boats", author: "Matt Higgins", read: "2026-03", category: "business", cover: cover("burn-the-boats"), post: li("7444352779181129728") },
  { slug: "the-80-20-principle", title: "The 80/20 Principle", author: "Richard Koch", read: "2026-04", category: "focus", cover: cover("the-80-20-principle"), post: li("7445809878696128512") },
  { slug: "four-hour-workweek", title: "The 4-Hour Workweek", author: "Tim Ferriss", read: "2026-03", category: "focus", cover: cover("four-hour-workweek"), post: li("7442548355399921665") },
  { slug: "learn-like-a-pro", title: "Learn Like a Pro", author: "Barbara Oakley & Olav Schewe", read: "2026-04", category: "learning", cover: cover("learn-like-a-pro"), post: li("7445447467115962368") },
  { slug: "fine-art-of-small-talk", title: "The Fine Art of Small Talk", author: "Debra Fine", read: "2026-04", category: "leadership", cover: cover("fine-art-of-small-talk"), post: li("7446889548892016641") },
  { slug: "steve-jobs", title: "Steve Jobs", author: "Walter Isaacson", read: "2026-04", category: "leadership", cover: cover("steve-jobs"), post: li("7445085098980294656") },
  { slug: "mans-search-for-meaning", title: "Man's Search for Meaning", author: "Viktor E. Frankl", read: "2026-04", category: "meaning", cover: cover("mans-search-for-meaning"), post: li("7447984222096703488") },
];

export type Quote = { text: L10n; author: string; source: string };

/** Quotes he shared on LinkedIn (verified wording from the books). */
export const quotes: Quote[] = [
  {
    text: {
      fr: "Chaque action est un vote pour le type de personne que tu veux devenir.",
      en: "Every action you take is a vote for the type of person you wish to become.",
    },
    author: "James Clear",
    source: "Atomic Habits",
  },
  {
    text: {
      fr: "Quand nous ne sommes plus capables de changer une situation, nous sommes mis au défi de nous changer nous-mêmes.",
      en: "When we are no longer able to change a situation, we are challenged to change ourselves.",
    },
    author: "Viktor E. Frankl",
    source: "Man's Search for Meaning",
  },
  {
    text: {
      fr: "Tant que ma seule chose n'est pas faite, tout le reste est une distraction.",
      en: "Until my ONE Thing is done, everything else is a distraction.",
    },
    author: "Gary Keller",
    source: "The ONE Thing",
  },
];

/** How he reads (posts of 2026-03-17 and 2026-05-07). */
export const readingSteps: { title: L10n; body: L10n }[] = [
  {
    title: { fr: "Survoler", en: "Skim" },
    body: {
      fr: "Blinkist pour repérer les idées clés avant d'y investir des heures.",
      en: "Blinkist to spot the key ideas before investing hours.",
    },
  },
  {
    title: { fr: "Une page", en: "One page" },
    body: {
      fr: "Un gabarit CRAP sur ma reMarkable : Clés, Résumé, Application, Points faibles.",
      en: "A one-page template on my reMarkable: key ideas, summary, application, weak spots.",
    },
  },
  {
    title: { fr: "Appliquer", en: "Apply" },
    body: {
      fr: "Une seule idée, cette semaine, dans un vrai projet : Cadence, un cours, ma routine.",
      en: "One idea, this week, in a real project: Cadence, a course, my routine.",
    },
  },
  {
    title: { fr: "Expliquer", en: "Explain" },
    body: {
      fr: "À voix haute, puis en public sur LinkedIn. Si je ne peux pas l'expliquer, je ne l'ai pas compris.",
      en: "Out loud, then publicly on LinkedIn. If I can't explain it, I haven't understood it.",
    },
  },
];

export const readingPostUrl = li("7439750150459260928");

/** Self-study, outside courses and certifications. */
export const selfStudy: { title: L10n; detail: L10n; href: string }[] = [
  {
    title: { fr: "Learn Git Branching", en: "Learn Git Branching" },
    detail: { fr: "Tous les niveaux, des bases aux dépôts distants (juil. 2026)", en: "Every level, from basics to remotes (Jul 2026)" },
    href: li("7478107681489256450"),
  },
  {
    title: { fr: "30 Days of Python", en: "30 Days of Python" },
    detail: { fr: "Défi d'Asabeneh : NumPy, pandas, Flask, MongoDB", en: "Asabeneh's challenge: NumPy, pandas, Flask, MongoDB" },
    href: "https://github.com/ralphgabriel04/30DaysOfPython",
  },
  {
    title: { fr: "Méthode d'étude V2", en: "Study method v2" },
    detail: { fr: "Obsidian relié à Claude, enseigner pour vérifier (mai 2026)", en: "Obsidian linked to Claude, teach to check (May 2026)" },
    href: li("7458177601312874497"),
  },
];

/** "mars 2026" / "Mar 2026" */
export function formatReadMonth(ym: string, locale: string): string {
  return new Intl.DateTimeFormat(locale === "fr" ? "fr-CA" : "en-CA", {
    month: "short",
    year: "numeric",
    timeZone: "America/Toronto",
  }).format(new Date(`${ym}-15T12:00:00-04:00`));
}
