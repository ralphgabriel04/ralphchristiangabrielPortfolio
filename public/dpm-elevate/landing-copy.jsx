/* global window */
/* ============================================================
   LANDING — bilingual copy (EN / FR)
   The landing renders from this dictionary directly (independent of the
   app's DOM-translation layer) so the FR/EN toggle flips it instantly and
   reliably. Same keys in both languages. Access via LANDING_COPY[lang].
============================================================ */
const LANDING_COPY = {
  en: {
    nav: { features: "Features", modules: "Modules", how: "How it works", try: "Try it live", login: "Log in", cta: "Start free", toFr: "Passer en Français", theme: "Theme" },

    hero: {
      badge: "Early access · Q2 2026",
      titleA: "Your time,",
      titleB: "deserves better.",
      sub: "Calendar, tasks, habits, goals, focus and well-being — one holistic workspace. Drag to plan, log your energy, watch the analytics build themselves. Try every module right here, no signup.",
      ctaPrimary: "Start free",
      ctaSecondary: "Play with the demo",
      trust: "No credit card · 14-day trial · Cancel anytime",
      liveBadge: "Live preview — drag, click, complete",
      integrates: "Syncs with",
    },

    stats: {
      label: "Why people switch",
      items: [
        { v: 11, suffix: "h", t: "saved per week", d: "Less time arranging, more time doing." },
        { v: 9, suffix: "", t: "modules, one place", d: "Calendar to goals, never a second tab." },
        { v: 92, suffix: "%", t: "keep their streak", d: "Habits that actually hold past week two." },
      ],
    },

    how: {
      label: "The method",
      title: "Three steps, one calm routine.",
      steps: [
        { n: "01", t: "Plan", d: "Connect your calendars and drop tasks onto the week. The AI proposes slots around your energy." },
        { n: "02", t: "Execute", d: "Time-blocking, focus sessions and gentle nudges keep you on track — the app handles the rest." },
        { n: "03", t: "Reflect", d: "Clear analytics show where your time really went, so next week plans itself smarter." },
      ],
    },

    modules: {
      label: "Every module, playable",
      title: "Nothing to imagine. Try it below.",
      sub: "These are live, interactive previews of the real product. Drag, click, complete — exactly like inside DPM Elevate.",
    },

    calendar: {
      tag: "Calendar",
      title: "A calendar that bends to your day.",
      desc: "Day, week and month views over your Google, Outlook and Apple calendars — unified. Drag any block to reschedule it.",
      bullets: ["Switch Day · Week · Month instantly", "Drag-and-drop to reschedule", "Real-time sync, color-coded by space"],
      hint: "↓ Switch views and drag a block",
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      views: { day: "Day", week: "Week", month: "Month" },
      events: ["Stand-up", "Deep work", "Design review", "Lunch", "Sprint review"],
      today: "Today", month_label: "May 2026",
    },

    matrix: {
      tag: "Prioritization · Drag & drop",
      title: "Decide what truly deserves your time.",
      desc: "The Eisenhower matrix turns a messy list into four honest quadrants. Drag a task across — the decision stays visual and reversible.",
      bullets: ["Urgent × Important, at a glance", "Drag tasks between quadrants", "What can wait simply… waits"],
      hint: "↓ Drag a task into another quadrant",
      quadrants: { do: "Do now", plan: "Schedule", delegate: "Delegate", drop: "Drop" },
      tasks: ["Fix prod bug", "Plan Q3 roadmap", "Reply to vendor", "Scroll feed"],
    },

    tasks: {
      tag: "Tasks · Satisfying done",
      title: "Completing a task should feel good.",
      desc: "Check it off and watch it celebrate. Tiny, tasteful animations make momentum addictive — without ever getting in your way.",
      bullets: ["One tap to complete", "Confetti on the wins that matter", "Subtasks, due dates, priorities"],
      hint: "↓ Tick a task",
      items: ["Review pull request", "Draft sprint notes", "Book dentist", "Water the plants"],
      done: "done today",
    },

    habits: {
      tag: "Habits & routines",
      title: "Streaks that actually survive.",
      desc: "Tap each day you show up. Watch the streak grow and the flame light up — the gentle pressure that keeps routines alive.",
      bullets: ["Daily check-in, one tap", "Visual streaks & best records", "Routines that adapt to your week"],
      hint: "↓ Tap the days you showed up",
      habit: "Morning run",
      streak: "day streak",
      week: ["M", "T", "W", "T", "F", "S", "S"],
    },

    focus: {
      tag: "Focus · Pomodoro",
      title: "One task. One timer. Zero noise.",
      desc: "Start a focus session and the world quiets down. The ring ticks, distractions are blocked, and your deep work is logged automatically.",
      bullets: ["25 / 5 Pomodoro or custom", "Distraction blocking", "Sessions logged to your stats"],
      hint: "↓ Start the timer",
      label: "Focus",
      start: "Start", pause: "Pause", reset: "Reset",
      session: "Session", of: "of",
    },

    energy: {
      tag: "Energy & chronotype",
      title: "Plan around your real rhythm.",
      desc: "Log how you feel and DPM learns your peaks and dips, then suggests the best slot for deep work. Tap a level to teach it.",
      bullets: ["Log energy in a tap", "Learns your chronotype", "Schedules hard work at your peak"],
      hint: "↓ Tap your energy through the day",
      levels: ["Low", "Mid", "High", "Peak"],
      times: ["8a", "10a", "12p", "2p", "4p", "6p"],
      ai: "Best deep-work window: ",
    },

    ai: {
      tag: "Contextual AI",
      title: "A planner that thinks with you.",
      desc: "DPM reads your week, your energy and your priorities, then offers a move you can accept in one click.",
      suggestion: "Move “Review PR” to 09:30 — your morning energy peak.",
      accept: "Accept", dismiss: "Not now", thinking: "Thinking…", applied: "Applied ✓",
    },

    stats2: {
      tag: "Analytics & statistics",
      title: "See exactly where your time goes.",
      desc: "No guilt, just clarity. Time by category, focus hours, habit consistency and workload — all private, never shared.",
      bullets: ["Time breakdown by category", "Focus hours & deep-work trend", "100% private analytics"],
      breakdown: [
        { label: "Deep work", v: 38, c: "263 70% 60%" },
        { label: "Meetings", v: 24, c: "217 91% 60%" },
        { label: "Personal", v: 22, c: "38 92% 55%" },
        { label: "Admin", v: 16, c: "142 70% 50%" },
      ],
      score: "Productivity score", hours: "Focus hours this week",
    },

    customize: {
      tag: "Make it yours",
      title: "Personalize everything — live.",
      desc: "Pick an accent and watch the whole experience re-theme instantly. Light or dark, your colors per space — accessibility built in.",
      bullets: ["Live accent & theme", "Color per space & calendar", "WCAG-AA contrast, always"],
      hint: "↓ Pick an accent — the page recolors",
      accent: "Accent", appearance: "Appearance", light: "Light", dark: "Dark",
    },

    resources: {
      tag: "Resources & tutorials",
      title: "Never stuck for long.",
      desc: "Short video walkthroughs, guided tours and a searchable help center — in English and French. Hit a snag, find the fix in seconds.",
      bullets: ["Video walkthroughs per module", "Interactive guided tours", "Bilingual help center (EN / FR)"],
      videos: [
        { t: "Getting started in 3 min", len: "3:12", tag: "Tour" },
        { t: "Master drag-and-drop planning", len: "4:48", tag: "Calendar" },
        { t: "Build a habit that sticks", len: "2:30", tag: "Habits" },
      ],
      watch: "Watch",
    },

    personas: {
      label: "Who it's for",
      title: "Built for full lives.",
      items: [
        { t: "Entrepreneur", q: "“Ten hats, one week. DPM helps me arbitrate without dropping a ball.”", n: "Camille · Founder", tag: "12+ projects" },
        { t: "Student", q: "“Classes, internship, life — it finally fits without clashing.”", n: "Léo · MEng", tag: "5 modules" },
        { t: "Manager", q: "“My 1-1s, my deep work and my family — all scheduled, all calm.”", n: "Aïcha · Senior PM", tag: "8 reports" },
      ],
    },

    security: {
      tag: "Security & privacy",
      title: "Your data, your time.",
      desc: "End-to-end encryption for sensitive data. GDPR-compliant, SOC2 in progress. Export or delete everything in one click, anytime.",
      badges: ["GDPR-compliant", "SOC2 ready", "AES-256 encryption"],
      cards: [
        { t: "1-click export", d: "JSON · ICS · CSV" },
        { t: "No ads", d: "Zero third-party tracking" },
        { t: "Full deletion", d: "Erased within 24h" },
        { t: "Audit log", d: "Every action recorded" },
      ],
    },

    finalCta: {
      title: "Take back your time.",
      sub: "Sign up in 30 seconds. Cancel in one click.",
      button: "Create my account",
      reassure: "Free forever plan · No credit card required",
    },

    footer: {
      tagline: "Your time, deserves better.",
      cols: [
        { t: "Product", l: ["Features", "Modules", "Pricing", "Roadmap"] },
        { t: "Resources", l: ["Help center", "Tutorials", "Guides", "Changelog"] },
        { t: "Legal", l: ["Terms", "Privacy", "Cookies", "GDPR"] },
      ],
      rights: "© 2026 DPM Elevate. All rights reserved.",
    },
  },

  fr: {
    nav: { features: "Fonctionnalités", modules: "Modules", how: "Comment ça marche", try: "Essayer en direct", login: "Connexion", cta: "Commencer", toFr: "Switch to English", theme: "Thème" },

    hero: {
      badge: "Accès anticipé · T2 2026",
      titleA: "Votre temps",
      titleB: "mérite mieux.",
      sub: "Agenda, tâches, habitudes, objectifs, focus et bien-être — un seul espace cohérent. Glissez pour planifier, notez votre énergie, regardez les statistiques se construire. Essayez chaque module ici même, sans inscription.",
      ctaPrimary: "Commencer gratuitement",
      ctaSecondary: "Jouer avec la démo",
      trust: "Sans carte bancaire · Essai 14 jours · Annulable à tout moment",
      liveBadge: "Aperçu en direct — glissez, cliquez, complétez",
      integrates: "Se synchronise avec",
    },

    stats: {
      label: "Pourquoi ils basculent",
      items: [
        { v: 11, suffix: "h", t: "économisées / semaine", d: "Moins d'organisation, plus d'action." },
        { v: 9, suffix: "", t: "modules, un seul endroit", d: "De l'agenda aux objectifs, sans second onglet." },
        { v: 92, suffix: "%", t: "gardent leur série", d: "Des habitudes qui tiennent après la 2ᵉ semaine." },
      ],
    },

    how: {
      label: "La méthode",
      title: "Trois étapes, une routine sereine.",
      steps: [
        { n: "01", t: "Planifier", d: "Connectez vos agendas et déposez vos tâches sur la semaine. L'IA propose des créneaux selon votre énergie." },
        { n: "02", t: "Exécuter", d: "Time-blocking, sessions de focus et rappels en douceur vous gardent dans le flux — l'app gère le reste." },
        { n: "03", t: "Analyser", d: "Des stats claires montrent où votre temps est passé, pour une semaine suivante mieux pensée." },
      ],
    },

    modules: {
      label: "Chaque module, jouable",
      title: "Rien à imaginer. Essayez ci-dessous.",
      sub: "Ce sont de vrais aperçus interactifs du produit. Glissez, cliquez, complétez — exactement comme dans DPM Elevate.",
    },

    calendar: {
      tag: "Agenda",
      title: "Un agenda qui épouse votre journée.",
      desc: "Vues jour, semaine et mois sur vos agendas Google, Outlook et Apple — unifiés. Glissez n'importe quel bloc pour le replanifier.",
      bullets: ["Jour · Semaine · Mois en un clic", "Glisser-déposer pour replanifier", "Sync en temps réel, couleurs par espace"],
      hint: "↓ Changez de vue et glissez un bloc",
      days: ["Lun", "Mar", "Mer", "Jeu", "Ven"],
      views: { day: "Jour", week: "Semaine", month: "Mois" },
      events: ["Point d'équipe", "Deep work", "Revue design", "Déjeuner", "Revue de sprint"],
      today: "Aujourd'hui", month_label: "Mai 2026",
    },

    matrix: {
      tag: "Priorisation · Glisser-déposer",
      title: "Décidez ce qui mérite vraiment votre temps.",
      desc: "La matrice d'Eisenhower transforme une liste en désordre en quatre quadrants honnêtes. Glissez une tâche — la décision reste visuelle et réversible.",
      bullets: ["Urgent × Important, d'un regard", "Glissez les tâches entre quadrants", "Ce qui peut attendre… attend"],
      hint: "↓ Glissez une tâche dans un autre quadrant",
      quadrants: { do: "Faire", plan: "Planifier", delegate: "Déléguer", drop: "Abandonner" },
      tasks: ["Corriger bug prod", "Roadmap T3", "Répondre au fournisseur", "Scroller le fil"],
    },

    tasks: {
      tag: "Tâches · Le plaisir du fait",
      title: "Compléter une tâche doit faire du bien.",
      desc: "Cochez-la et regardez-la célébrer. De petites animations soignées rendent l'élan addictif — sans jamais gêner.",
      bullets: ["Un tap pour compléter", "Des confettis sur les vraies victoires", "Sous-tâches, échéances, priorités"],
      hint: "↓ Cochez une tâche",
      items: ["Relire la pull request", "Rédiger les notes de sprint", "Prendre RDV dentiste", "Arroser les plantes"],
      done: "faites aujourd'hui",
    },

    habits: {
      tag: "Habitudes & routines",
      title: "Des séries qui survivent vraiment.",
      desc: "Tapez chaque jour où vous êtes au rendez-vous. La série grandit, la flamme s'allume — la pression douce qui maintient les routines.",
      bullets: ["Check-in quotidien en un tap", "Séries visuelles & records", "Des routines qui s'adaptent à la semaine"],
      hint: "↓ Tapez les jours où vous étiez présent",
      habit: "Course matinale",
      streak: "jours de série",
      week: ["L", "M", "M", "J", "V", "S", "D"],
    },

    focus: {
      tag: "Focus · Pomodoro",
      title: "Une tâche. Un minuteur. Zéro bruit.",
      desc: "Lancez une session de focus et le monde se tait. L'anneau tourne, les distractions sont bloquées, votre deep work est enregistré.",
      bullets: ["Pomodoro 25 / 5 ou personnalisé", "Blocage des distractions", "Sessions ajoutées à vos stats"],
      hint: "↓ Lancez le minuteur",
      label: "Focus",
      start: "Démarrer", pause: "Pause", reset: "Reset",
      session: "Session", of: "/",
    },

    energy: {
      tag: "Énergie & chronotype",
      title: "Planifiez selon votre vrai rythme.",
      desc: "Notez comment vous vous sentez et DPM apprend vos pics et vos creux, puis suggère le meilleur créneau pour le deep work. Tapez un niveau pour l'entraîner.",
      bullets: ["Notez votre énergie en un tap", "Apprend votre chronotype", "Place le travail dur sur votre pic"],
      hint: "↓ Tapez votre énergie au fil de la journée",
      levels: ["Bas", "Moyen", "Haut", "Pic"],
      times: ["8h", "10h", "12h", "14h", "16h", "18h"],
      ai: "Meilleur créneau deep-work : ",
    },

    ai: {
      tag: "IA contextuelle",
      title: "Un planificateur qui réfléchit avec vous.",
      desc: "DPM lit votre semaine, votre énergie et vos priorités, puis propose une action à accepter en un clic.",
      suggestion: "Déplacer « Relire la PR » à 09:30 — votre pic d'énergie du matin.",
      accept: "Accepter", dismiss: "Plus tard", thinking: "Réflexion…", applied: "Appliqué ✓",
    },

    stats2: {
      tag: "Analytics & statistiques",
      title: "Voyez précisément où part votre temps.",
      desc: "Aucune culpabilité, juste de la clarté. Temps par catégorie, heures de focus, régularité des habitudes et charge — tout est privé, jamais partagé.",
      bullets: ["Répartition du temps par catégorie", "Heures de focus & tendance deep-work", "Statistiques 100 % privées"],
      breakdown: [
        { label: "Deep work", v: 38, c: "263 70% 60%" },
        { label: "Réunions", v: 24, c: "217 91% 60%" },
        { label: "Personnel", v: 22, c: "38 92% 55%" },
        { label: "Admin", v: 16, c: "142 70% 50%" },
      ],
      score: "Score de productivité", hours: "Heures de focus cette semaine",
    },

    customize: {
      tag: "À votre image",
      title: "Tout personnaliser — en direct.",
      desc: "Choisissez un accent et regardez toute l'expérience se re-thématiser instantanément. Clair ou sombre, vos couleurs par espace — accessibilité incluse.",
      bullets: ["Accent & thème en direct", "Couleur par espace & agenda", "Contraste WCAG-AA, toujours"],
      hint: "↓ Choisissez un accent — la page se recolore",
      accent: "Accent", appearance: "Apparence", light: "Clair", dark: "Sombre",
    },

    resources: {
      tag: "Ressources & tutoriels",
      title: "Jamais bloqué longtemps.",
      desc: "Des tutoriels vidéo courts, des visites guidées et un centre d'aide cherchable — en français et en anglais. Un souci ? La solution en quelques secondes.",
      bullets: ["Tutoriels vidéo par module", "Visites guidées interactives", "Centre d'aide bilingue (FR / EN)"],
      videos: [
        { t: "Bien démarrer en 3 min", len: "3:12", tag: "Visite" },
        { t: "Maîtriser le glisser-déposer", len: "4:48", tag: "Agenda" },
        { t: "Construire une habitude qui tient", len: "2:30", tag: "Habitudes" },
      ],
      watch: "Regarder",
    },

    personas: {
      label: "Pour qui",
      title: "Pensé pour les vies bien remplies.",
      items: [
        { t: "Entrepreneure", q: "« Dix casquettes, une semaine. DPM m'aide à arbitrer sans rien lâcher. »", n: "Camille · Fondatrice", tag: "12+ projets" },
        { t: "Étudiant", q: "« Cours, stage, vie perso — tout s'emboîte enfin sans se heurter. »", n: "Léo · Ingénieur", tag: "5 modules" },
        { t: "Manager", q: "« Mes 1-1, mon deep work et ma famille — tout est planifié, tout est calme. »", n: "Aïcha · Senior PM", tag: "8 collaborateurs" },
      ],
    },

    security: {
      tag: "Sécurité & confidentialité",
      title: "Vos données, votre temps.",
      desc: "Chiffrement de bout en bout pour les données sensibles. Conforme RGPD, SOC2 en cours. Exportez ou supprimez tout en un clic, à tout moment.",
      badges: ["Conforme RGPD", "SOC2 en cours", "Chiffrement AES-256"],
      cards: [
        { t: "Export en 1 clic", d: "JSON · ICS · CSV" },
        { t: "Sans publicité", d: "Zéro tracking tiers" },
        { t: "Suppression totale", d: "Effacé sous 24 h" },
        { t: "Journal d'audit", d: "Chaque action tracée" },
      ],
    },

    finalCta: {
      title: "Reprenez votre temps.",
      sub: "Inscription en 30 secondes. Annulable en un clic.",
      button: "Créer mon compte",
      reassure: "Plan gratuit à vie · Sans carte bancaire",
    },

    footer: {
      tagline: "Votre temps mérite mieux.",
      cols: [
        { t: "Produit", l: ["Fonctionnalités", "Modules", "Tarifs", "Roadmap"] },
        { t: "Ressources", l: ["Centre d'aide", "Tutoriels", "Guides", "Nouveautés"] },
        { t: "Légal", l: ["Conditions", "Confidentialité", "Cookies", "RGPD"] },
      ],
      rights: "© 2026 DPM Elevate. Tous droits réservés.",
    },
  },
};

function useLandingT(lang) {
  return LANDING_COPY[lang === "fr" ? "fr" : "en"];
}

Object.assign(window, { LANDING_COPY, useLandingT });
