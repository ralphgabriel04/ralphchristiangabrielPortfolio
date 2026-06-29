/* global window */
/* ============================================================
   LANDING — copy pack #3 (pricing · FAQ · social proof · demo · cookies · legal)
   Merged into LANDING_COPY at load, same pattern as pack #2.
============================================================ */
const __LANDING_COPY3 = {
  en: {
    nav: { pricing: "Pricing", faq: "FAQ", signup: "Start free" },

    socialProof: {
      label: "Trusted by busy people everywhere",
      rating: "4.9/5 average rating",
      users: "12,000+ weeks planned",
      ph: "#1 Product of the Day",
    },

    demo: {
      title: "See DPM in 90 seconds",
      sub: "A quick tour of planning a real week — calendar, focus, habits and analytics.",
      duration: "1:30",
      close: "Close",
      caption: "Product walkthrough · no audio required",
    },

    pricing: {
      label: "Pricing",
      title: "Simple pricing that grows with you.",
      sub: "Start free, upgrade when it pays for itself. Every plan includes the full holistic workspace.",
      monthly: "Monthly", yearly: "Yearly", save: "Save 20%",
      perMonth: "/mo", billedYearly: "billed yearly", forever: "free forever",
      popular: "Most popular",
      cta: "Start free", ctaPro: "Start 14-day trial", ctaTeam: "Start with Team",
      plans: [
        {
          id: "free", name: "Free", priceM: 0, priceY: 0,
          tagline: "For getting organized.",
          features: ["1 calendar connected", "Tasks, habits & goals", "Daily planning ritual", "7-day analytics", "Mobile & web"],
        },
        {
          id: "pro", name: "Pro", priceM: 12, priceY: 9,
          tagline: "For taking back your time.",
          features: ["Unlimited calendars", "Contextual AI planning", "Focus & Pomodoro Pro", "Energy & chronotype", "Unlimited analytics", "Rules & automations"],
        },
        {
          id: "team", name: "Team", priceM: 25, priceY: 20,
          tagline: "For planning together.",
          features: ["Everything in Pro", "Shared spaces & calendars", "Team availability", "Roles & permissions", "Priority support", "Admin & audit log"],
        },
      ],
      perSeat: "per seat",
    },

    faq: {
      label: "FAQ",
      title: "Questions, answered.",
      sub: "Everything you might want to know before you start. Still curious? Reach the team in-app.",
      items: [
        { q: "Is my data secure and private?", a: "Yes. Sensitive data is encrypted with AES-256, we run zero third-party ad tracking, and your analytics are never shared. We're GDPR-compliant and SOC2 is in progress." },
        { q: "Can I cancel anytime?", a: "Always, in one click from settings — no email, no phone call. You keep access until the end of your billing period, and the Free plan stays free forever." },
        { q: "Can I migrate from Google Calendar or Notion?", a: "Yes. Two-way sync connects Google, Outlook and Apple calendars in seconds, and you can import tasks from Notion, Todoist and CSV. Nothing is locked in." },
        { q: "Is there a free trial?", a: "Pro and Team include a 14-day trial with no credit card required. If you do nothing, you simply drop to the Free plan — you're never charged by surprise." },
        { q: "What happens to my data if I leave?", a: "Export everything (JSON, ICS, CSV) in one click, anytime. Ask for deletion and your account and data are erased within 24 hours." },
        { q: "Do you support both English and French?", a: "Fully. The entire app, help center and tutorials are bilingual — switch language anytime and everything follows instantly." },
        { q: "Which devices and integrations are supported?", a: "Web and mobile, plus Google, Outlook and Apple calendars, Todoist, Slack, Notion and Zoom. More integrations ship regularly." },
        { q: "Do I need a credit card to start?", a: "No. Create your account and use the Free plan with no card. Add billing only if and when you choose to upgrade." },
      ],
    },

    cookie: {
      title: "We value your privacy",
      body: "We use essential cookies to run the app and optional analytics to improve it. You choose what to allow.",
      accept: "Accept all", essential: "Essential only", customize: "Cookie settings",
      learn: "Cookie Policy",
    },

    legal: {
      updated: "Last updated June 2026",
      close: "Close",
      tabs: { terms: "Terms", privacy: "Privacy", cookies: "Cookies", gdpr: "GDPR" },
      terms: {
        title: "Terms of Service",
        body: [
          "Welcome to DPM Elevate. By creating an account you agree to use the service lawfully and to keep your login credentials secure.",
          "Your subscription renews automatically until cancelled. You can cancel at any time from settings; access continues until the end of the paid period.",
          "We provide the service “as is” and improve it continuously. We may update these terms; material changes are announced in-app before they take effect.",
        ],
      },
      privacy: {
        title: "Privacy Policy",
        body: [
          "We collect only what we need to run DPM: your account details, the content you create, and basic usage signals to improve the product.",
          "Sensitive data is encrypted with AES-256. We never sell your data and run no third-party advertising trackers.",
          "You can export or permanently delete your data at any time. Deletion requests are completed within 24 hours.",
        ],
      },
      cookies: {
        title: "Cookie Policy",
        body: [
          "Essential cookies keep you signed in and remember your preferences — these are always on.",
          "Optional analytics cookies help us understand which features matter. You can accept or refuse them, and change your mind anytime from Cookie settings.",
          "We do not use advertising or cross-site tracking cookies.",
        ],
      },
      gdpr: {
        title: "GDPR",
        body: [
          "As an EU-friendly product, we honor your rights to access, rectify, port and erase your personal data.",
          "You are the controller of your content; we act as processor and only handle data on your instructions.",
          "To exercise any right, use the in-app controls or contact our Data Protection Officer — we respond within 30 days.",
        ],
      },
    },
  },

  fr: {
    nav: { pricing: "Tarifs", faq: "FAQ", signup: "Commencer" },

    socialProof: {
      label: "Adopté par les gens occupés, partout",
      rating: "Note moyenne 4,9/5",
      users: "12 000+ semaines planifiées",
      ph: "Produit du jour n°1",
    },

    demo: {
      title: "Découvrez DPM en 90 secondes",
      sub: "Un aperçu rapide d'une vraie semaine planifiée — agenda, focus, habitudes et statistiques.",
      duration: "1:30",
      close: "Fermer",
      caption: "Démonstration produit · sans audio nécessaire",
    },

    pricing: {
      label: "Tarifs",
      title: "Une tarification simple qui grandit avec vous.",
      sub: "Commencez gratuitement, passez au niveau supérieur quand ça vaut le coup. Chaque offre inclut l'espace de travail complet.",
      monthly: "Mensuel", yearly: "Annuel", save: "−20 %",
      perMonth: "/mois", billedYearly: "facturé annuellement", forever: "gratuit à vie",
      popular: "Le plus choisi",
      cta: "Commencer gratuitement", ctaPro: "Essai 14 jours", ctaTeam: "Choisir Équipe",
      plans: [
        {
          id: "free", name: "Gratuit", priceM: 0, priceY: 0,
          tagline: "Pour s'organiser.",
          features: ["1 agenda connecté", "Tâches, habitudes & objectifs", "Rituel de planification", "Statistiques 7 jours", "Mobile & web"],
        },
        {
          id: "pro", name: "Pro", priceM: 12, priceY: 9,
          tagline: "Pour reprendre votre temps.",
          features: ["Agendas illimités", "Planification par IA", "Focus & Pomodoro Pro", "Énergie & chronotype", "Statistiques illimitées", "Règles & automatisations"],
        },
        {
          id: "team", name: "Équipe", priceM: 25, priceY: 20,
          tagline: "Pour planifier ensemble.",
          features: ["Tout le plan Pro", "Espaces & agendas partagés", "Disponibilités d'équipe", "Rôles & permissions", "Support prioritaire", "Admin & journal d'audit"],
        },
      ],
      perSeat: "par personne",
    },

    faq: {
      label: "FAQ",
      title: "Vos questions, nos réponses.",
      sub: "Tout ce qu'il faut savoir avant de commencer. Une autre question ? L'équipe répond dans l'app.",
      items: [
        { q: "Mes données sont-elles sécurisées et privées ?", a: "Oui. Les données sensibles sont chiffrées en AES-256, aucun tracking publicitaire tiers, et vos statistiques ne sont jamais partagées. Nous sommes conformes RGPD et SOC2 est en cours." },
        { q: "Puis-je résilier à tout moment ?", a: "Toujours, en un clic depuis les réglages — sans email ni appel. Vous gardez l'accès jusqu'à la fin de la période payée, et le plan Gratuit reste gratuit à vie." },
        { q: "Puis-je migrer depuis Google Agenda ou Notion ?", a: "Oui. La synchro bidirectionnelle connecte Google, Outlook et Apple en quelques secondes, et vous importez vos tâches depuis Notion, Todoist et CSV. Rien n'est verrouillé." },
        { q: "Y a-t-il un essai gratuit ?", a: "Pro et Équipe incluent un essai de 14 jours sans carte bancaire. Si vous ne faites rien, vous basculez simplement sur le plan Gratuit — jamais de prélèvement surprise." },
        { q: "Que deviennent mes données si je pars ?", a: "Exportez tout (JSON, ICS, CSV) en un clic, à tout moment. Demandez la suppression et votre compte et vos données sont effacés sous 24 h." },
        { q: "Le français et l'anglais sont-ils pris en charge ?", a: "Entièrement. Toute l'app, le centre d'aide et les tutoriels sont bilingues — changez de langue quand vous voulez, tout suit instantanément." },
        { q: "Quels appareils et intégrations sont pris en charge ?", a: "Web et mobile, plus les agendas Google, Outlook et Apple, Todoist, Slack, Notion et Zoom. De nouvelles intégrations arrivent régulièrement." },
        { q: "Faut-il une carte bancaire pour commencer ?", a: "Non. Créez votre compte et utilisez le plan Gratuit sans carte. Ajoutez un moyen de paiement uniquement si vous décidez de passer à un plan supérieur." },
      ],
    },

    cookie: {
      title: "Votre vie privée compte",
      body: "Nous utilisons des cookies essentiels pour faire fonctionner l'app et des cookies de mesure optionnels pour l'améliorer. Vous choisissez ce que vous autorisez.",
      accept: "Tout accepter", essential: "Essentiels uniquement", customize: "Réglages cookies",
      learn: "Politique cookies",
    },

    legal: {
      updated: "Mise à jour juin 2026",
      close: "Fermer",
      tabs: { terms: "Conditions", privacy: "Confidentialité", cookies: "Cookies", gdpr: "RGPD" },
      terms: {
        title: "Conditions d'utilisation",
        body: [
          "Bienvenue sur DPM Elevate. En créant un compte, vous acceptez d'utiliser le service de façon licite et de protéger vos identifiants de connexion.",
          "Votre abonnement se renouvelle automatiquement jusqu'à résiliation. Vous pouvez résilier à tout moment depuis les réglages ; l'accès continue jusqu'à la fin de la période payée.",
          "Le service est fourni « tel quel » et amélioré en continu. Nous pouvons mettre à jour ces conditions ; tout changement important est annoncé dans l'app avant son entrée en vigueur.",
        ],
      },
      privacy: {
        title: "Politique de confidentialité",
        body: [
          "Nous ne collectons que le nécessaire au fonctionnement de DPM : vos informations de compte, le contenu que vous créez et des signaux d'usage de base pour améliorer le produit.",
          "Les données sensibles sont chiffrées en AES-256. Nous ne vendons jamais vos données et n'utilisons aucun traqueur publicitaire tiers.",
          "Vous pouvez exporter ou supprimer définitivement vos données à tout moment. Les demandes de suppression sont traitées sous 24 h.",
        ],
      },
      cookies: {
        title: "Politique cookies",
        body: [
          "Les cookies essentiels vous maintiennent connecté et mémorisent vos préférences — ils sont toujours actifs.",
          "Les cookies de mesure optionnels nous aident à comprendre quelles fonctionnalités comptent. Vous pouvez les accepter ou les refuser, et changer d'avis à tout moment depuis les Réglages cookies.",
          "Nous n'utilisons aucun cookie publicitaire ni de suivi inter-sites.",
        ],
      },
      gdpr: {
        title: "RGPD",
        body: [
          "Produit respectueux du cadre européen, nous honorons vos droits d'accès, de rectification, de portabilité et d'effacement de vos données personnelles.",
          "Vous êtes responsable de votre contenu ; nous agissons comme sous-traitant et ne traitons les données que sur vos instructions.",
          "Pour exercer un droit, utilisez les commandes dans l'app ou contactez notre Délégué à la protection des données — nous répondons sous 30 jours.",
        ],
      },
    },
  },
};

if (typeof window !== "undefined" && window.LANDING_COPY) {
  // deep-merge the `nav` sub-object so existing nav keys are preserved
  ["en", "fr"].forEach(l => {
    const extra = __LANDING_COPY3[l];
    const base = window.LANDING_COPY[l];
    if (!base) return;
    Object.keys(extra).forEach(k => {
      if (k === "nav" && base.nav) Object.assign(base.nav, extra.nav);
      else base[k] = extra[k];
    });
  });
}
