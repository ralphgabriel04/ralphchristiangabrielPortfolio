export type TestimonialCategory = "client" | "colleague" | "teacher" | "partner"

export interface Testimonial {
  id: string
  quote: { fr: string; en: string }
  name: string
  role: { fr: string; en: string }
  company?: string
  avatar?: string
  category: TestimonialCategory
  featured: boolean
  projectLink?: string
  createdAt: string
}

export const testimonials: Testimonial[] = [
  {
    id: "madspace",
    quote: {
      fr: "Christian a cr\u00e9\u00e9 un site web professionnel, moderne et parfaitement adapt\u00e9 \u00e0 mes besoins. Sa rigueur, sa cr\u00e9ativit\u00e9 et sa capacit\u00e9 \u00e0 communiquer clairement tout au long du projet ont grandement facilit\u00e9 la collaboration.",
      en: "Christian created a professional, modern website perfectly suited to my needs. His professionalism, creativity, and clear communication made the entire process smooth and efficient.",
    },
    name: "Fondateur",
    role: { fr: "The Mad Space \u00b7 2025-pr\u00e9sent", en: "The Mad Space \u00b7 2025-present" },
    company: "The Mad Space",
    avatar: "/images/testimonial-madspace.jpg",
    category: "client",
    featured: true,
    projectLink: "the-mad-space",
    createdAt: "2025-01-15",
  },
  {
    id: "jonathan",
    quote: {
      fr: "Ralph a pris en charge l\u2019\u00e9quipe lors de nos projets pour le cours de Test et Maintenance. Il a appris \u00e0 conna\u00eetre les membres de l\u2019\u00e9quipe pour leur attribuer les t\u00e2ches leur correspondant le mieux, avec un bon \u00e9quilibre et un principe d\u2019\u00e9quit\u00e9. Il \u00e9tait toujours disponible pour r\u00e9pondre aux questions, patient et pr\u00eat \u00e0 aider. C\u2019est un travailleur qui cherche toujours \u00e0 s\u2019am\u00e9liorer et sortir le meilleur de ses co\u00e9quipiers. C\u2019est un excellent leader.",
      en: "Ralph took charge of the team during our Testing and Maintenance course projects. He got to know each team member to assign tasks that suited them best, always keeping things fair and balanced. He was always available to answer questions, patient, and ready to help. He\u2019s someone who constantly works to improve himself and bring out the best in his teammates. Simply put, he\u2019s an excellent leader.",
    },
    name: "Jonathan Euclide Marc",
    role: { fr: "Coll\u00e8gue \u00b7 \u00c9TS \u00b7 2026", en: "Peer \u00b7 \u00c9TS \u00b7 2026" },
    company: "\u00c9TS",
    avatar: "/images/testimonial-jonathan.png",
    category: "colleague",
    featured: true,
    projectLink: "financej",
    createdAt: "2026-01-10",
  },
  {
    id: "sunny",
    quote: {
      fr: "Ralph s\u2019est d\u00e9marqu\u00e9 par son professionnalisme et son esprit d\u2019\u00e9quipe. Il \u00e9tait toujours pr\u00e9sent pour me soutenir lorsque je me retrouvais en difficult\u00e9, et ce qui m\u2019a le plus marqu\u00e9, c\u2019est sa patience. Peu importe la complexit\u00e9 de la situation, il prenait le temps d\u2019expliquer, d\u2019accompagner et de s\u2019assurer que tout \u00e9tait bien r\u00e9solu. Je le recommande sans r\u00e9serve.",
      en: "Ralph stood out through his professionalism and team spirit. He was always there to support me when I was struggling, and what struck me most was his patience. No matter how complex the situation, he took the time to explain, guide, and make sure everything was properly resolved. I recommend him without hesitation.",
    },
    name: "Sunny M\u00e9lissa Gabriel",
    role: { fr: "Coordonnatrice logistique \u00b7 Groupe Contex", en: "Logistics Coordinator \u00b7 Groupe Contex" },
    company: "Groupe Contex",
    avatar: "/images/testimonial-sunny.png",
    category: "colleague",
    featured: true,
    createdAt: "2025-06-01",
  },
  {
    id: "annesofie",
    quote: {
      fr: "Ralph Christian Gabriel est un expert dans son domaine! Il m\u2019a aid\u00e9 \u00e0 de nombreuses reprises pour mes probl\u00e8mes techniques \u00e0 l\u2019ordinateur. Il est fiable et pers\u00e9v\u00e8re toujours pour trouver des solutions aux probl\u00e8mes. J\u2019ai grandement appr\u00e9ci\u00e9 le fait qu\u2019il prenait toujours le temps d\u2019expliquer le pourquoi du comment derri\u00e8re son plan d\u2019action. Ceci d\u00e9montrait selon moi sa rigueur, mais aussi son d\u00e9vouement pour la satisfaction des personnes qu\u2019il aide.",
      en: "Ralph Christian Gabriel is an expert in his field! He helped me on numerous occasions with my computer technical issues. He is reliable and always perseveres to find solutions to problems. I greatly appreciated that he always took the time to explain the reasoning behind his plan of action. This demonstrated, in my opinion, his thoroughness but also his dedication to the satisfaction of the people he helps.",
    },
    name: "Anne Sofie Laurent",
    role: { fr: "Coordonnatrice \u00b7 Emploi \u00c9t\u00e9 Canada", en: "Coordinator \u00b7 Canada Summer Jobs" },
    company: "Emploi \u00c9t\u00e9 Canada",
    avatar: "/images/testimonial-annesofie.png",
    category: "colleague",
    featured: false,
    createdAt: "2025-04-20",
  },
  {
    id: "alexandre",
    quote: {
      fr: "Lorsque j\u2019ai voulu concr\u00e9tiser l\u2019id\u00e9e de Cadence, Ralph a \u00e9t\u00e9 la premi\u00e8re personne \u00e0 qui j\u2019ai pens\u00e9 pour m\u2019accompagner dans cette aventure. Ancien partenaire de classe, Ralph a toujours su montrer une rigueur hors du commun. Il a rapidement montr\u00e9 la m\u00eame rigueur et expertise en tant que partenaire d\u2019affaires. Il aborde chaque probl\u00e8me avec une vraie r\u00e9flexion approfondie, il r\u00e9fl\u00e9chit \u00e0 l\u2019architecture, anticipe les probl\u00e8mes, et livre un travail propre et maintenable. Ce qui m\u2019a particuli\u00e8rement impressionn\u00e9, c\u2019est sa capacit\u00e9 \u00e0 apprendre vite et \u00e0 s\u2019adapter aux contraintes r\u00e9elles d\u2019un projet en construction. Il a su prendre en charge des d\u00e9fis techniques complexes de fa\u00e7on autonome, tout en restant un partenaire de r\u00e9flexion fiable. Je recommanderais Ralph \u00e0 tout moment sans aucune h\u00e9sitation.",
      en: "When I wanted to bring the idea of Cadence to life, Ralph was the first person I thought of to join me on this adventure. A former classmate, Ralph has always shown exceptional rigor. He quickly demonstrated the same rigor and expertise as a business partner. He approaches every problem with genuine deep thinking \u2014 he considers the architecture, anticipates issues, and delivers clean, maintainable work. What particularly impressed me is his ability to learn fast and adapt to the real constraints of a project under construction. He took on complex technical challenges autonomously while remaining a reliable thinking partner. I would recommend Ralph at any time without the slightest hesitation.",
    },
    name: "Alexandre Boisvert",
    role: { fr: "Cofondateur \u00b7 Cadence", en: "Co-founder \u00b7 Cadence" },
    company: "Cadence",
    avatar: "/images/testimonial-alexandre.png",
    category: "partner",
    featured: true,
    projectLink: "cadence",
    createdAt: "2026-05-19",
  },
  {
    id: "amine",
    quote: {
      fr: "Ralph a naturellement pris le r\u00f4le de chef d\u2019\u00e9quipe et s\u2019est assur\u00e9 que chacun avait un r\u00f4le \u00e0 jouer. Il \u00e9tait proactif dans l\u2019attribution des t\u00e2ches et gardait l\u2019\u00e9quipe organis\u00e9e et sur la bonne voie. En plus de g\u00e9rer l\u2019\u00e9quipe, il livrait son propre travail de fa\u00e7on constante, rapide et efficace. Chaque fois que la progression ralentissait, il savait relancer l\u2019\u00e9quipe avec calme et respect. Ralph est le genre de personne qu\u2019une \u00e9quipe a la chance d\u2019avoir : il est fiable, motiv\u00e9 et r\u00e9ellement investi dans l\u2019accomplissement du travail.",
      en: "Ralph naturally stepped up as the team lead and made sure everyone had a role to play. He was proactive in assigning tasks and kept the team organized and on track. On top of managing the team, he was consistent in delivering his own work quickly and efficiently. Whenever progress slowed down, he knew how to nudge the team forward in a calm and respectful way. Ralph is the kind of person a team is lucky to have: he is dependable, driven, and genuinely invested in getting things done.",
    },
    name: "Amine Essif",
    role: { fr: "Pair \u00b7 \u00c9TS \u00b7 2026", en: "Peer \u00b7 \u00c9TS \u00b7 2026" },
    company: "\u00c9TS",
    avatar: "/images/testimonial-amine.jpg",
    category: "colleague",
    featured: true,
    projectLink: "financej",
    createdAt: "2026-06-03",
  },
  {
    id: "sao",
    quote: {
      fr: "Travailler avec lui sur notre projet a été une expérience très positive. Il a su transformer avec justesse une idée conceptualisée sur papier en une plateforme concrète, fonctionnelle et fidèle à notre vision. À l’écoute de nos besoins, il a su s’adapter, effectuer les réajustements nécessaires et proposer des améliorations pertinentes qui ont réellement bonifié le projet. Son professionnalisme, son respect des délais et la qualité de son travail nous ont permis d’obtenir un résultat au-delà de nos attentes. Cette collaboration marque, sans l’ombre d’un doute, le début d’un partenariat que nous souhaitons poursuivre dans le futur. Nous recommandons son expertise sans hésitation.",
      en: "Working with him on our project was a very positive experience. He knew exactly how to turn an idea sketched out on paper into a concrete, functional platform that stayed true to our vision. Attentive to our needs, he adapted, made the necessary adjustments and suggested relevant improvements that genuinely elevated the project. His professionalism, his respect for deadlines and the quality of his work allowed us to reach a result beyond our expectations. This collaboration marks, without a shadow of a doubt, the beginning of a partnership we hope to continue in the future. We recommend his expertise without hesitation.",
    },
    name: "Sao Saint-Vil",
    role: { fr: "Cofondateur · Wise & Wealthy", en: "Co-founder · Wise & Wealthy" },
    company: "Wise & Wealthy",
    avatar: "/images/testimonial-sao.png",
    category: "partner",
    featured: true,
    projectLink: "wise-wealthy",
    createdAt: "2026-07-06",
  },
  {
    id: "mathis",
    quote: {
      fr: "Travailler avec lui sur le développement de notre projet a été une excellente expérience. Il a rapidement compris notre vision et a su transformer nos idées en une plateforme concrète, bien structurée et conforme à nos attentes. Tout au long du processus, il s’est montré disponible, à l’écoute et très professionnel. Il a pris le temps d’apporter les ajustements demandés, tout en proposant des solutions et des améliorations pertinentes qui ont permis de faire évoluer le projet dans la bonne direction. Son sérieux, sa rigueur et le respect des échéances ont rendu la collaboration simple et efficace. Cette première collaboration nous donne entière confiance pour la suite. Nous avons bien l’intention de continuer à travailler avec lui sur les prochaines étapes du projet et nous recommandons ses services sans la moindre hésitation.",
      en: "Working with him on the development of our project was an excellent experience. He quickly grasped our vision and turned our ideas into a concrete, well-structured platform that matched our expectations. Throughout the process, he was available, attentive and highly professional. He took the time to make the requested adjustments while also proposing relevant solutions and improvements that moved the project forward in the right direction. His seriousness, his rigor and his respect for deadlines made the collaboration simple and effective. This first collaboration gives us complete confidence for what lies ahead. We fully intend to keep working with him on the project’s next stages, and we recommend his services without the slightest hesitation.",
    },
    name: "Mathis Labonté",
    role: { fr: "Cofondateur · Wise & Wealthy", en: "Co-founder · Wise & Wealthy" },
    company: "Wise & Wealthy",
    avatar: "/images/testimonial-mathis.png",
    category: "partner",
    featured: true,
    projectLink: "wise-wealthy",
    createdAt: "2026-07-06",
  },
  {
    id: "loutfi",
    quote: {
      fr: "Christian a été un pilier dans les deux projets académiques sur lesquels nous avons collaboré. Techniquement, il est très solide : que ce soit pour déployer une application avec Docker, résoudre des problèmes de configuration complexes, ou concevoir une architecture logicielle cohérente et bien pensée, il a toujours une longueur d'avance. Il a aussi naturellement pris le rôle de leader, organisant l'équipe avec un plan clair et des échéances précises, tout en gardant tout le monde sur la bonne voie. Ce qui m'a le plus marqué, c'est sa disponibilité : peu importe l'heure, il était toujours prêt à dépanner un bug ou un problème de déploiement, avec une aisance qui fait clairement de lui l'un des développeurs les plus compétents avec qui j'ai travaillé. Je recommande sans la moindre hésitation de collaborer avec lui.",
      en: "Christian was a pillar on both academic projects we worked on together. Technically, he is rock-solid: whether deploying an application with Docker, resolving complex configuration problems, or designing a coherent, well-thought-out software architecture, he is always a step ahead. He also naturally took on the leader role, organizing the team with a clear plan and precise deadlines while keeping everyone on track. What struck me most was his availability: no matter the hour, he was always ready to troubleshoot a bug or a deployment issue, with an ease that clearly makes him one of the most competent developers I've worked with. I recommend collaborating with him without the slightest hesitation.",
    },
    name: "Loutfi Mohamed",
    role: { fr: "Coéquipier · ÉTS · 2026", en: "Teammate · ÉTS · 2026" },
    company: "ÉTS",
    avatar: "/images/testimonial-loutfi.png",
    category: "colleague",
    featured: true,
    projectLink: "financej",
    createdAt: "2026-07-22",
  },
]

export const categoryLabels = {
  fr: {
    all: "Tous",
    client: "Clients",
    colleague: "Coll\u00e8gues",
    teacher: "Enseignants",
    partner: "Partenaires",
  },
  en: {
    all: "All",
    client: "Clients",
    colleague: "Colleagues",
    teacher: "Teachers",
    partner: "Partners",
  },
} as const

export function getFeaturedTestimonials(): Testimonial[] {
  return testimonials.filter((t) => t.featured)
}

export function getTestimonialsByCategory(category: TestimonialCategory | "all"): Testimonial[] {
  if (category === "all") return testimonials
  return testimonials.filter((t) => t.category === category)
}
