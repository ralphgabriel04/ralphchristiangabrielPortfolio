/* global window, document */
/* ============================================================
   RUNTIME UI TRANSLATION LAYER

   Many UI strings and ALL mock data (task/goal/habit/event titles)
   are authored in English directly in JSX. The bilingual DICT in
   i18n.jsx only covers t()-wrapped chrome. To make the FR/EN toggle
   flip EVERYTHING — including data — without rewriting every file,
   this layer translates matching text nodes + attributes in place
   when lang === "fr", and restores the English originals on "en".

   It listens to the existing "dpm-lang-change" event and uses a
   MutationObserver so React re-renders stay translated. Translation
   is idempotent (French text has no FR key) so there are no loops.
============================================================ */

const UI_FR = {
  // ── Welcome banner ──
  "Welcome to DPM Elevate 👋": "Bienvenue dans DPM Elevate 👋",
  "Eleven modules, one app. In under 2 minutes, the guided tour shows you where to start — and you can dive into any module whenever you want.":
    "Onze modules, une seule app. En moins de 2 minutes, la visite guidée te montre par où commencer — et tu peux plonger dans n'importe quel module quand tu veux.",
  "Start the tour": "Lancer la visite",
  "Later": "Plus tard",

  // ── Tour ──
  "Guided tour": "Visite guidée",
  "Skip": "Passer",
  "Previous": "Précédent",
  "Next": "Suivant",
  "Finish": "Terminer",
  "Learn more": "En savoir plus",
  "Explore this module": "Explorer ce module",
  "Close the tour": "Fermer la visite",
  "Help & guided tour": "Aide & visite guidée",
  "Full guided tour": "Visite guidée complète",
  "Overview of 11 modules · ~2 min": "Survol des 11 modules · ~2 min",
  "Tours by module": "Visites par module",
  "Help and guided tour": "Aide et visite guidée",
  "Replay tutorial": "Revoir le tutoriel",
  "Replay this module's tutorial": "Revoir le tutoriel de ce module",
  "Open the Resource center": "Ouvrir le Centre de ressources",

  // ── Sidebar / chrome ──
  "OTHER": "AUTRE",
  "Account settings": "Paramètres du compte",
  "Switch account": "Changer de compte",
  "Log out": "Se déconnecter",
  "Logged out": "Déconnecté",
  "Time spent in Focus": "Temps passé en Focus",
  "Focus": "Focus",
  "Help & Resources": "Aide & Ressources",
  "Tour seen": "Visite vue",
  "Theme": "Thème",
  "Customize": "Personnaliser",

  // ── Common buttons / words ──
  "Save": "Enregistrer",
  "Edit": "Modifier",
  "Delete": "Supprimer",
  "Cancel": "Annuler",
  "Create": "Créer",
  "Close": "Fermer",
  "Add": "Ajouter",
  "Done": "Terminé",
  "Today": "Aujourd'hui",
  "Tomorrow": "Demain",
  "Yesterday": "Hier",
  "Friday": "Vendredi",
  "Mon": "Lun", "Tue": "Mar", "Wed": "Mer", "Thu": "Jeu", "Fri": "Ven", "Sat": "Sam", "Sun": "Dim",
  "Reset": "Réinitialiser",
  "Show all": "Tout voir",
  "View all": "Tout voir",
  "More options": "Plus d'options",
  "Hide options": "Masquer les options",

  // ── Home: greeting ──
  "Good afternoon, Ralph": "Bon après-midi, Ralph",
  "Good afternoon, Ralph!": "Bon après-midi, Ralph !",
  "Your day starts here.": "Votre journée commence ici.",
  "No tasks planned": "Aucune tâche planifiée",
  "Start by planning your day to see your workload, rituals and focus suggestions appear.":
    "Commencez par planifier votre journée pour voir apparaître votre charge, vos rituels et vos suggestions de focus.",
  "Plan my day": "Planifier ma journée",
  "Create a task": "Créer une tâche",
  "All widgets are hidden": "Tous les widgets sont masqués",

  // ── Home: energy header / picker ──
  "Energy": "Énergie",
  "Captured at": "Captée à",
  "Recapture now": "Recapter maintenant",
  "How are you feeling?": "Comment vous sentez-vous ?",

  // ── Home: sleep card ──
  "Imported from Health": "Importé depuis Santé",
  "confirm or adjust if needed": "confirme ou ajuste si besoin",
  "enter manually": "saisir manuellement",
  "How did you sleep?": "Comment as-tu dormi ?",
  "30 seconds · helps DPM plan your day": "30 secondes · ça aide DPM à planifier ta journée",
  "In bed at": "Couché à",
  "Up at": "Levé à",
  "Duration": "Durée",
  "Perceived quality": "Qualité ressentie",
  "Exhausted": "Épuisé",
  "Low": "Faible",
  "Medium": "Moyen",
  "Good": "Bon",
  "High": "Élevé",
  "Sleep logged ·": "Sommeil noté ·",

  // ── Home: workload ──
  "Daily workload": "Charge de la journée",
  "planned": "planifié",
  "Tasks": "Tâches",
  "Meetings": "Réunions",
  "Focus": "Focus",
  "Day availability — wheel or +/− to adjust": "Disponibilité du jour — molette ou +/− pour ajuster",
  "Less availability": "Moins de disponibilité",
  "More availability": "Plus de disponibilité",

  // ── Home: day overview ──
  "Day overview": "Aperçu de la journée",
  "Habits": "Habitudes",
  "+1 yesterday": "+1 hier",
  "Goal 3h": "Objectif 3h",
  "Med · Reading": "Méd · Lecture",

  // ── Home: quick actions ──
  "Quick actions": "Actions rapides",
  "Task": "Tâche",
  "Calendar": "Calendrier",
  "Stats": "Stats",

  // ── Home: AI assistant ──
  "AI assistant": "Assistant IA",
  "AI assistant disabled": "Assistant IA désactivé",
  "Personalized to your day": "Personnalisé selon ta journée",
  "Re-enable the assistant": "Réactiver l'Assistant",
  "Regenerate advice": "Régénérer les conseils",
  "Assistant preferences": "Préférences de l'Assistant",
  "Hide the AI assistant": "Masquer l'Assistant IA",
  "Reschedule": "Replanifier",
  "View the day": "Voir la journée",
  "Block 20 min": "Bloquer 20 min",
  "Task rescheduled to 2 PM": "Tâche replanifiée à 14 h",
  "Rescheduled": "Replanifiée",
  "20 min blocked for Reading tonight": "20 min bloquées pour la lecture ce soir",
  "Blocked": "Bloqué",
  "You'll no longer see contextual advice on the home page. You can re-enable it anytime here or in Settings.":
    "Vous ne verrez plus de conseils contextuels sur l'accueil. Vous pouvez le réactiver à tout moment ici ou dans les Paramètres.",

  // ── Home: current task banner ──
  "In progress": "En cours",
  "Finalize the Desjardins client proposal": "Finaliser la proposition client Desjardins",
  "Started at 13:47": "Démarrée à 13:47",

  // ── Home: energy mini card ──
  "Your energy today": "Ton énergie aujourd'hui",
  "View analysis": "Voir l'analyse",

  // ── Home: tasks-today ──
  "Today's tasks · 2/5": "Tâches du jour · 2/5",

  // ── Mock data: task / event titles ──
  "Desjardins proposal": "Proposition Desjardins",
  "Q2 presentation": "Présentation Q2",
  "Desjardins client call": "Appel client Desjardins",
  "Product team stand-up": "Stand-up équipe produit",
  "Reading (habit)": "Lecture (habitude)",
  "Deep work focus": "Focus deep work",
  "Morning stand-up · prep notes": "Stand-up matin · prép notes",
  "Reply to supplier emails": "Répondre emails fournisseurs",
  "Prepare Q2 presentation": "Préparer présentation Q2",
  "Team stand-up": "Stand-up équipe",
  "Quick stand-up": "Stand-up éclair",
  "Desjardins call": "Appel Desjardins",
  "Free focus": "Focus libre",
  "Reading": "Lecture",
  "In 2 min": "Dans 2 min",
  "Supplier emails": "Emails fournisseurs",
  "Run": "Course à pied",
  "Meditation": "Méditation",
  "Stretching": "Étirements",
  "No coffee after 2pm": "Pas de café après 14h",
  "Journaling": "Journaling",
  "Morning meditation": "Méditation matinale",
  "Meditation + Reading": "Méditation + Lecture",
  "Personal lunch": "Déjeuner perso",
  "Lunch with Marc": "Déjeuner avec Marc",
  "Design system review": "Revue design système",
  "Family dinner": "Dîner famille",
  "Login mockup": "Maquette login",
  "Finalize Desjardins client proposal": "Finaliser proposition client Desjardins",
  "New project setup": "Setup nouveau projet",

  // ── Quick notes seed ──
  "Remember to call the design team before tomorrow's standup.":
    "Penser à appeler l'équipe design avant le standup de demain.",

  // ── New task modal ──
  "New task": "Nouvelle tâche",
  "Task title": "Titre de la tâche",
  "Voice dictation": "Dictée vocale",
  "Task title — or dictate it": "Titre de la tâche — ou dictez-le",
  "Voice input not supported": "Saisie vocale non prise en charge",
  "Voice input not supported — type instead": "Saisie vocale non prise en charge — tapez plutôt",
  "Microphone blocked — allow it and open this page in a browser tab": "Micro bloqué — autorisez-le et ouvrez cette page dans un onglet du navigateur",
  "No microphone detected": "Aucun microphone détecté",
  "Didn't catch that — try again": "Je n'ai pas saisi — réessayez",
  "Dictation failed — type instead": "La dictée a échoué — tapez plutôt",
  "Stop": "Arrêter",
  "Listening…": "À l'écoute…",
  "I understood": "J'ai compris",
  "Apply": "Appliquer",
  "Dismiss": "Ignorer",
  "Details applied from capture": "Détails appliqués depuis la saisie",
  "Task created": "Tâche créée",
  "Task created & scheduled": "Tâche créée et planifiée",
  "Status": "Statut",
  "Priority": "Priorité",
  "Urgent": "Urgent",
  "Due date": "Date d'échéance",
  "Monday": "Lundi",
  "Next week": "Semaine prochaine",
  "Schedule": "Planifier",
  "optional": "optionnel",
  "Time": "Heure",
  "Custom": "Personnalisé",
  "Description (Markdown supported)": "Description (Markdown pris en charge)",
  "Checklist": "Liste de vérification",
  "Add an item": "Ajouter un élément",
  "Tags": "Étiquettes",
  "Add a tag": "Ajouter une étiquette",
  "Suggestions:": "Suggestions :",
  "Linked URL": "URL liée",
  "Energy required": "Énergie requise",
  "helps AI planning": "aide la planification IA",
  "Link to an event": "Lier à un événement",
  "Choose an event…": "Choisir un événement…",
  "Search an event": "Rechercher un événement",
  // ── Home: customize / density ──
  "Essential": "Essentiel",
  "Complete": "Complet",
  "Home density": "Densité de l'accueil",
  "No event found": "Aucun événement trouvé",
  "Remove link": "Retirer le lien",
  "Personal notes": "Notes personnelles",
  "Personal notes (Markdown supported)": "Notes personnelles (Markdown pris en charge)",
  "Save & schedule": "Enregistrer & planifier",
  "to create": "pour créer",

  // ── Calendar chrome ──
  "Load": "Charge",
  "Week": "Semaine",
  "Month": "Mois",
  "Day": "Jour",
  "Year": "Année",
  "Event": "Événement",
  "New calendar": "Nouveau calendrier",
  "New group": "Nouveau groupe",
  "My calendars": "Mes calendriers",
  "active calendars": "calendriers actifs",
  "Shared": "Partagés",
  "Week time": "Temps de la semaine",
  "Unscheduled": "Non planifiées",
  "Add a task": "Ajouter une tâche",
  "Slot suggestions": "Suggestions de créneaux",
  "Events this week": "Événements de la semaine",
  "Past": "Passés",
  "Upcoming": "À venir",
  "Empty week": "Semaine vide",
  "Create an event": "Créer un événement",
  "Pick a shade": "Choisir une teinte",
  "Read the bible": "Lire la bible",
  "My workout": "Mon sport",
  "Do my review": "Faire ma revue",
  "Call Mom": "Appeler Maman",
  "Buy train tickets": "Acheter tickets train",
  "Grocery shopping": "Faire les courses",
  "Mom's birthday": "Anniversaire de Maman",
  "Dentist reminder": "Rappel dentiste",
  "Read chapter 4 — Atomic Habits": "Lire chapitre 4 — Atomic Habits",
  "Sprint planning": "Sprint planning",

  // ── Tasks page chrome ──
  "All your tasks in one place": "Toutes vos tâches en un seul endroit",
  "Boards": "Tableaux",
  "List": "Liste",
  "Timeline": "Échéancier",
  "To do": "À faire",
  "Canceled": "Annulé",
  "New board": "Nouveau tableau",
  "Add a column": "Ajouter une colonne",
  "Add a card": "Ajouter une carte",
  "Link to boards": "Lier à des tableaux",

  // ── Goals / Habits chrome ──
  "Build your rituals": "Construisez vos rituels",
  "Checked today": "Cochées aujourd'hui",
  "Unchecked": "Non cochées",
  "Longest streak": "Plus longue série",
  "No goal matches the filters.": "Aucun objectif ne correspond aux filtres.",
  "No habit matches the filters.": "Aucune habitude ne correspond aux filtres.",
  "Completed": "Complété",
  "Running": "Course à pied",

  // ── Goal / habit data titles ──
  "Read 24 books this year": "Lire 24 livres cette année",
  "Run 50h per month": "Courir 50h par mois",
  "Learn Rust — fundamentals": "Apprendre Rust — fondamentaux",
  "Lose 5kg": "Perdre 5kg",
  "Launch side project X": "Lancer le projet side X",
  "Meditate 30 days straight": "Méditer 30 jours d'affilée",

  // ── Dashboard chrome ──
  "Private analytics · your productivity metrics": "Analyses privées · vos métriques de productivité",
  "Productivity score": "Score de productivité",
  "Score breakdown": "Répartition du score",
  "Time distribution": "Répartition du temps",
  "Current streaks": "Séries en cours",
  "Goal progress": "Progrès des objectifs",
  "Upcoming deadlines": "Échéances à venir",
  "Key indicators": "Indicateurs clés",
  "Planned hours": "Heures planifiées",
  "Tasks completed": "Tâches complétées",
  "Completion rate": "Taux de complétion",

  // ── Settings chrome ──
  "Configure your experience": "Configurez votre expérience",
  "Calendar comfort": "Confort du calendrier",
  "Row height & event text size in the Day / Week calendar. Applies instantly.":
    "Hauteur des lignes et taille du texte des événements dans le calendrier Jour / Semaine. Appliqué instantanément.",
  "Compact": "Compact",
  "Normal": "Normal",
  "Comfort": "Confort",
  "Large": "Large",
  "More days on screen": "Plus de jours à l'écran",
  "Balanced (default)": "Équilibré (défaut)",
  "Roomier rows & text": "Lignes et texte plus aérés",
  "Maximum readability": "Lisibilité maximale",
  "Profile": "Profil",
  "Preferences": "Préférences",
  "Connected": "Connecté",
  "Not connected": "Non connecté",
  "Disconnect": "Déconnecter",
  "Connect": "Connecter",
  "Danger zone": "Zone sensible",
  "Export my data": "Exporter mes données",
  "Export": "Exporter",
  "Delete my account": "Supprimer mon compte",
  "Working-hour ranges": "Plages d'heures de travail",
  "Add a range": "Ajouter une plage",
  "Resolve all": "Résoudre tout",
  "Keep local": "Garder local",

  // ── Spaces ──
  "Spaces": "Espaces",
  "Manage spaces": "Gérer les espaces",
  "New space": "Nouvel espace",
  "All hours": "Toutes les heures",
  // space names + switcher chrome
  "All": "Tous",
  "Professional": "Professionnel",
  "Personal": "Personnel",
  "Studies": "Études",
  "Space": "Espace",
  "Automatic": "Automatique",
  // P25 — sharing + accessibility
  "Details": "Détails",
  "Sharing": "Partage",
  "Share this space": "Partager cet espace",
  "Invite to this space": "Inviter dans cet espace",
  "Invite": "Inviter",
  "Default level:": "Niveau par défaut :",
  "Read": "Lecture",
  "Edit": "Modification",
  "Owner": "Propriétaire",
  "Member": "Membre",
  "Pending": "En attente",
  "Full access · all modules": "Accès complet · tous les modules",
  "No access yet": "Aucun accès encore",
  "Access by module": "Accès par module",
  "No access": "Pas d'accès",
  "Not shared": "Non partagé",
  "private": "privé",
  "Calendars": "Calendriers",
  "Prioritization": "Priorisation",
  "Remove access": "Retirer l'accès",
  "Invitation sent. Rights below apply once accepted.": "Invitation envoyée. Les droits ci-dessous s'appliquent dès l'acceptation.",
  "Private modules stay off until shared.": "Les modules privés restent inactifs tant qu'ils ne sont pas partagés.",
  "Wellbeing is private by default.": "Le bien-être est privé par défaut.",
  "Wellbeing data shared.": "Donnée de bien-être partagée.",
  "Changes save automatically. Wellbeing stays private unless shared explicitly.": "Les modifications sont enregistrées automatiquement. Le bien-être reste privé sauf partage explicite.",
  "Affichage vif (accessibility)": "Affichage vif (accessibilité)",
  "Accessibility": "Accessibilité",
  "Pick a preset or set a fully custom color.": "Choisissez un préréglage ou une couleur entièrement personnalisée.",
  "custom": "personnalisé",
  "Custom color": "Couleur personnalisée",
  "Color (ambient accent)": "Couleur (accent ambiant)",
  "Done": "Terminé",
  "Tous": "Tous",
  "item": "élément",
  "items": "éléments",

  // ── End-of-day wrap-up card ──
  "Have a good evening": "Bonne soirée",
  "Your day is wrapped up.": "Ta journée est bouclée.",
  "4 tasks completed · 3h00 of deep work · 5h of buffer respected. Rest up, tomorrow is already planned.":
    "4 tâches accomplies · 3h00 de deep work · 5h de marge respectée. Repose-toi, demain est déjà planifié.",
  "Score": "Score",
  "Review the plan": "Revoir le plan",
  "Good evening": "Bonne soirée",

  // ── Productivity quotes (evening card + carousel) ──
  "Eat the frog first — start with the hardest task.": "Avale le crapaud d'abord — commence par la tâche la plus dure.",
  "Eat That Frog · Brian Tracy": "Eat That Frog · Brian Tracy",
  "If it can be done in 2 minutes, do it now.": "Si ça prend moins de 2 minutes, fais-le maintenant.",
  "Getting Things Done · David Allen": "Getting Things Done · David Allen",
  "Focus on what's important, not just what's urgent.": "Concentre-toi sur l'important, pas seulement sur l'urgent.",
  "7 Habits · Stephen Covey": "Les 7 habitudes · Stephen Covey",
  "A task takes exactly as long as the time you give it.": "Une tâche prend exactement le temps qu'on lui accorde.",
  "Parkinson's Law": "Loi de Parkinson",
  "Attention is the rarest resource. Protect it.": "L'attention est la ressource la plus rare. Protège-la.",
  "Deep Work · Cal Newport": "Deep Work · Cal Newport",
  "Small gains add up. 1% a day = 37× over a year.": "Les petits gains s'accumulent. 1 % par jour = 37× sur un an.",
  "Atomic Habits · James Clear": "Un rien peut tout changer · James Clear",
  "If everything is a priority, nothing is.": "Si tout est prioritaire, rien ne l'est.",
  "Essentialism · Greg McKeown": "L'essentialisme · Greg McKeown",
  "Plan the night before. Start with a clear direction.": "Planifie la veille. Démarre avec une direction claire.",
  "Make Time · Knapp & Zeratsky": "Make Time · Knapp & Zeratsky",
  "Energy follows attention. Choose well.": "L'énergie suit l'attention. Choisis bien.",
  "The Power of Full Engagement · Loehr & Schwartz": "The Power of Full Engagement · Loehr & Schwartz",
  "Make fewer decisions a day, better ones.": "Prends moins de décisions par jour, mais de meilleures.",
  "Decision fatigue · Roy Baumeister": "Fatigue décisionnelle · Roy Baumeister",
  "A postponed decision is a decision made.": "Une décision reportée est une décision prise.",
  "Anonymous": "Anonyme",
  "Work in sprints, rest like an athlete.": "Travaille en sprints, repose-toi comme un athlète.",
  "Peak Performance · Stulberg & Magness": "Peak Performance · Stulberg & Magness",
  "Do less, but with intensity.": "Fais-en moins, mais avec intensité.",
  "The One Thing · Gary Keller": "The One Thing · Gary Keller",
  "What gets measured gets improved.": "Ce qui se mesure s'améliore.",
  "Lord Kelvin": "Lord Kelvin",
  "Discipline is remembering what you really want.": "La discipline, c'est se rappeler ce qu'on veut vraiment.",
  "David Campbell": "David Campbell",

  // ── Habit type / frequency ──
  "Daily": "Quotidien",
  "Conditional": "Conditionnel",
  "Fixed": "Fixe",
  "Weekly": "Hebdomadaire",
  "Monthly": "Mensuel",
  "5×/wk": "5×/sem",
  // ── Goal categories (shown raw on cards) ──
  "Health": "Santé",
  "Learning": "Apprentissage",
  "Business": "Professionnel",
  "Wellness": "Bien-être",
  "Family": "Famille",
  "Fixed · 07:00": "Fixe · 07:00",
  "Fixed · 07:30": "Fixe · 07:30",
  "Fixed · 21:00": "Fixe · 21:00",
  "Fixed · 22:00": "Fixe · 22:00",
  "3×/wk": "3×/sem",
  "Shared": "Partagé",

  // ── Module labels (Guide by feature) ──
  "Home": "Accueil",
  "Planning": "Planification",
  "Prioritization": "Priorisation",
  "Goals": "Objectifs",
  "Rules": "Règles",
  "Analytics dashboard": "Tableau de bord analytique",
  "Settings": "Paramètres",

  // ── Module blurbs ──
  "Your starting point: today's workload, energy, the task in progress and an assistant that tells you what to do right now.":
    "Votre point de départ : la charge du jour, l'énergie, la tâche en cours et un assistant qui vous dit quoi faire maintenant.",
  "Far more than a grid: six views, a calendar tree and context views to show only what matters here, now.":
    "Bien plus qu'une grille : six vues, une arborescence de calendriers et des vues contextuelles pour n'afficher que l'essentiel, ici et maintenant.",
  "A six-step assistant that turns a fuzzy list into a realistic day placed in the calendar.":
    "Un assistant en six étapes qui transforme une liste floue en une journée réaliste posée dans le calendrier.",
  "Execution mode: a task queue, a Pomodoro timer and a session run-of-show to get into deep work.":
    "Mode exécution : une file de tâches, un minuteur Pomodoro et un déroulé de session pour entrer en deep work.",
  "All your tasks, five ways to see them — from a simple list to a multi-board Kanban with work-in-progress limits.":
    "Toutes vos tâches, cinq façons de les voir — de la simple liste au Kanban multi-tableaux avec limites de travail en cours.",
  "The Eisenhower matrix: drag your tasks between Do, Plan, Delegate and Eliminate to decide with a cool head.":
    "La matrice d'Eisenhower : glissez vos tâches entre Faire, Planifier, Déléguer et Éliminer pour décider à tête reposée.",
  "Build rituals that stick: streaks, heatmap and consistency show you steadiness rather than a single day's performance.":
    "Construisez des rituels qui tiennent : séries, heatmap et régularité montrent la constance plutôt que la performance d'un seul jour.",
  "Your long-term targets, framed SMART and linked to the habits that move them forward day after day.":
    "Vos cibles long terme, cadrées SMART et reliées aux habitudes qui les font avancer jour après jour.",
  "Automate planning chores: \"If… Then…\" protects your focus, inserts your breaks and adds buffers without a thought.":
    "Automatisez les corvées de planification : « Si… Alors… » protège votre focus, insère vos pauses et ajoute des marges sans y penser.",
  "The perspective: indicators, trends and correlations (down to the sleep → energy link) to decide on facts, not impressions.":
    "La prise de recul : indicateurs, tendances et corrélations (jusqu'au lien sommeil → énergie) pour décider sur des faits, pas des impressions.",
  "Connect your calendars, declare your working hours and set your preferences — the foundation everything else adjusts to.":
    "Connectez vos calendriers, déclarez vos heures de travail et réglez vos préférences — la base sur laquelle tout le reste s'ajuste.",

  // ── Feature labels + descriptions (Guide by feature) ──
  "Today's tasks": "Tâches du jour",
  "Morning sleep check-in": "Bilan de sommeil du matin",
  "Energy of the day": "Énergie du jour",
  "Current task": "Tâche en cours",
  "Stacked bar — tasks / meetings / focus": "Barre empilée — tâches / réunions / focus",
  "Nightly check-in — bedtime / wake-up / quality": "Bilan nocturne — coucher / lever / qualité",
  "Sparkline + summary + link to the analytics": "Sparkline + résumé + lien vers les analyses",
  "Banner of the active task with progress": "Bannière de la tâche active avec progression",
  "4 key figures: tasks, meetings, focus, habits": "4 chiffres clés : tâches, réunions, focus, habitudes",
  "5 shortcuts: Task, Calendar, Focus, Habits, Stats": "5 raccourcis : Tâche, Calendrier, Focus, Habitudes, Stats",
  "Contextual advice + sourced suggestions": "Conseils contextuels + suggestions sourcées",
  "The day's next events": "Les prochains événements du jour",
  "Checkable list of tasks scheduled today": "Liste cochable des tâches planifiées aujourd'hui",
  "6 views": "6 vues",
  "Day · Week · Month · Agenda · Timeline · Workload": "Jour · Semaine · Mois · Agenda · Échéancier · Charge",
  "Context views": "Vues contextuelles",
  "Presets All / Work / Personal / Family — calendars + time range": "Préréglages Tous / Travail / Personnel / Famille — calendriers + plage horaire",
  "Calendar tree": "Arborescence de calendriers",
  "Groups → subgroups → calendars (2 levels), colors, on/off": "Groupes → sous-groupes → calendriers (2 niveaux), couleurs, on/off",
  "Side panel": "Panneau latéral",
  "Mini-calendar, unscheduled items and shortcuts": "Mini-calendrier, éléments non planifiés et raccourcis",
  "6-step assistant": "Assistant en 6 étapes",
  "Add · Estimate · Fill · Prioritize · Schedule · Document": "Ajouter · Estimer · Compléter · Prioriser · Planifier · Documenter",
  "Current step": "Étape en cours",
  "The work of the active step, isolated to stay focused": "Le travail de l'étape active, isolé pour rester concentré",
  "Focus timer": "Minuteur Focus",
  "Circular ring focus / breaks, hyperfocus mode": "Anneau circulaire focus / pauses, mode hyperfocus",
  "Task queue": "File de tâches",
  "Reorderable list of the session's tasks": "Liste réordonnable des tâches de la session",
  "Session run-of-show": "Déroulé de session",
  "Focus / break schedule + quotes": "Programme focus / pauses + citations",
  "5 views": "5 vues",
  "List · Boards · Timeline · Calendar · Stats": "Liste · Tableaux · Échéancier · Calendrier · Stats",
  "Kanban boards": "Tableaux Kanban",
  "Multiple boards + columns with WIP limits": "Plusieurs tableaux + colonnes avec limites WIP",
  "Eisenhower matrix": "Matrice d'Eisenhower",
  "4 quadrants: Do · Plan · Delegate · Eliminate": "4 quadrants : Faire · Planifier · Déléguer · Éliminer",
  "Drag and drop": "Glisser-déposer",
  "Move a task from one quadrant to another": "Déplacer une tâche d'un quadrant à un autre",
  "Stats header": "En-tête de stats",
  "Best streak · consistency · monthly total": "Meilleure série · régularité · total mensuel",
  "Habit cards": "Cartes d'habitude",
  "Icon, color, type, frequency + streak 🔥": "Icône, couleur, type, fréquence + série 🔥",
  "7-day heatmap": "Heatmap 7 jours",
  "Grid of the last 7 days per habit": "Grille des 7 derniers jours par habitude",
  "Goal cards": "Cartes d'objectif",
  "Progress cur/max, category, deadlines": "Progression actuel/max, catégorie, échéances",
  "SMART badges": "Badges SMART",
  "5 criteria: Specific · Measurable · Achievable · Realistic · Time-bound": "5 critères : Spécifique · Mesurable · Atteignable · Réaliste · Temporel",
  "If… Then… automations": "Automatisations Si… Alors…",
  "Trigger × action + run counter + toggle": "Déclencheur × action + compteur d'exécutions + bascule",
  "Ready-made templates": "Modèles prêts à l'emploi",
  "Focus Time · Lunch break · Meeting buffers": "Temps Focus · Pause déjeuner · Marges de réunion",
  "Key indicators": "Indicateurs clés",
  "4 cards: hours, tasks, completion, score": "4 cartes : heures, tâches, complétion, score",
  "Metrics explorer": "Explorateur de métriques",
  "A chart with a metric selector — period inherited from the header": "Un graphique avec sélecteur de métrique — période héritée de l'en-tête",
  "6-month activity": "Activité sur 6 mois",
  "Heatmap of active days over 184 days": "Heatmap des jours actifs sur 184 jours",
  "Ring + breakdown tasks / focus / habits": "Anneau + répartition tâches / focus / habitudes",
  "Donut: focus, meetings, admin, breaks": "Donut : focus, réunions, admin, pauses",
  "Habit streaks": "Séries d'habitudes",
  "Current consecutive habits": "Habitudes consécutives en cours",
  "Progress bars for long-term goals": "Barres de progression des objectifs long terme",
  "Workload (carousel)": "Charge (carrousel)",
  "Workload by day, meetings, work — arrow navigation": "Charge par jour, réunions, travail — navigation par flèches",
  "Sleep & chronotype": "Sommeil & chronotype",
  "Duration, regularity, quality + sleep → energy correlation": "Durée, régularité, qualité + corrélation sommeil → énergie",
  "Calendar integrations": "Intégrations calendrier",
  "Connect Google · Microsoft · Apple and manage sync": "Connectez Google · Microsoft · Apple et gérez la synchro",
  "Working hours": "Heures de travail",
  "Ranges that feed the context views and planning": "Plages qui alimentent les vues contextuelles et la planification",
  "Data export · account deletion": "Export de données · suppression de compte",

  // ── Guided-tour bubbles (titles + bodies) ──
  "See your day at a glance": "Votre journée d'un coup d'œil",
  "The bar compares what's planned against your real capacity — you spot overload before it hits.":
    "La barre compare ce qui est planifié à votre capacité réelle — vous repérez la surcharge avant qu'elle ne frappe.",
  "Four numbers, zero thinking": "Quatre chiffres, zéro réflexion",
  "Today's tasks, meetings, focus and habits summed up in four numbers — know where you stand without opening three pages.":
    "Tâches, réunions, focus et habitudes du jour résumés en quatre chiffres — sachez où vous en êtes sans ouvrir trois pages.",
  "Advice, not a manual": "Des conseils, pas un manuel",
  "The assistant reads your workload, energy and schedule to suggest the next useful action — every suggestion is sourced.":
    "L'assistant lit votre charge, votre énergie et votre agenda pour suggérer la prochaine action utile — chaque suggestion est sourcée.",
  "The right view for the right question": "La bonne vue pour la bonne question",
  "Week to execute, Month to plan, Workload to spot saturated days — one click is enough to change angle.":
    "Semaine pour exécuter, Mois pour planifier, Charge pour repérer les jours saturés — un clic suffit pour changer d'angle.",
  "Separate work from home": "Séparez le travail du perso",
  "A preset composes both the visible calendars AND the time range at once — switch from \"Work 9–6\" to \"Personal\" without touching ten boxes.":
    "Un préréglage compose à la fois les calendriers visibles ET la plage horaire — passez de « Travail 9–18 » à « Personnel » sans toucher dix cases.",
  "Organize your calendars like a folder": "Organisez vos calendriers comme un dossier",
  "Group Work, Family, Travel… then turn an entire branch on or off. A disabled calendar is flagged — no event vanishes silently.":
    "Regroupez Travail, Famille, Voyages… puis activez ou désactivez une branche entière. Un calendrier désactivé est signalé — aucun événement ne disparaît en silence.",
  "One day, six guided steps": "Une journée, six étapes guidées",
  "You move step by step — the app keeps you from doing everything at once and drowning. The ritual takes two minutes.":
    "Vous avancez pas à pas — l'app vous évite de tout faire d'un coup et de vous noyer. Le rituel prend deux minutes.",
  "One decision at a time": "Une décision à la fois",
  "Estimate, prioritize, place: each step only shows what you need right now. Less mental load, more decisions kept.":
    "Estimer, prioriser, placer : chaque étape n'affiche que ce dont vous avez besoin là. Moins de charge mentale, plus de décisions tenues.",
  "Deep work, paced": "Deep work, au bon rythme",
  "The ring paces focus and breaks to hold concentration without burning out — or chain blocks in hyperfocus when you're on a roll.":
    "L'anneau cadence focus et pauses pour tenir la concentration sans s'épuiser — ou enchaînez les blocs en hyperfocus quand vous êtes lancé.",
  "Always know what to tackle next": "Sachez toujours quoi attaquer ensuite",
  "Reorder your queue; the top task becomes your session. No more \"what do I do now?\" between blocks.":
    "Réordonnez votre file ; la tâche du haut devient votre session. Fini le « je fais quoi maintenant ? » entre les blocs.",
  "The same work, five angles": "Le même travail, cinq angles",
  "List to check off, Boards for flow, Timeline for deadlines, Stats for perspective. You choose based on the question of the moment.":
    "Liste pour cocher, Tableaux pour le flux, Échéancier pour les délais, Stats pour le recul. Vous choisissez selon la question du moment.",
  "Limit work in progress": "Limitez le travail en cours",
  "Columns have WIP limits: beyond them, the app slows you down so you finish before starting something else.":
    "Les colonnes ont des limites WIP : au-delà, l'app vous freine pour que vous finissiez avant d'en commencer une autre.",
  "Urgent isn't important": "Urgent n'est pas important",
  "Place each task by urgency × importance: you instantly see what deserves your time and what can drop.":
    "Placez chaque tâche par urgence × importance : vous voyez instantanément ce qui mérite votre temps et ce qui peut tomber.",
  "Re-prioritizing is dragging": "Re-prioriser, c'est glisser",
  "A priority changed? Drag the task into another quadrant — the decision stays visual and reversible.":
    "Une priorité a changé ? Glissez la tâche dans un autre quadrant — la décision reste visuelle et réversible.",
  "Consistency, not the feat": "La régularité, pas l'exploit",
  "Best streak, consistency and the month's total in one banner: you track the underlying trend, not one day's mood.":
    "Meilleure série, régularité et total du mois dans une bannière : vous suivez la tendance de fond, pas l'humeur d'un jour.",
  "A card = a living habit": "Une carte = une habitude vivante",
  "The 🔥 streak rewards the current chain. Check today and watch the run grow — it's the engine of the habit.":
    "La série 🔥 récompense la chaîne en cours. Cochez aujourd'hui et regardez la série grandir — c'est le moteur de l'habitude.",
  "Spot the gaps": "Repérez les trous",
  "Seven days in a grid: you see at a glance which days slip and adjust before the run breaks.":
    "Sept jours dans une grille : vous voyez d'un coup d'œil quels jours décrochent et ajustez avant que la série ne casse.",
  "From target to measured progress": "De la cible au progrès mesuré",
  "Each goal shows where you stand against its target. The distant \"read 24 books\" becomes a concrete \"15/24\".":
    "Chaque objectif montre où vous en êtes par rapport à sa cible. Le lointain « lire 24 livres » devient un concret « 15/24 ».",
  "A well-framed goal holds": "Un objectif bien cadré tient",
  "The five S·M·A·R·T badges tell you whether the goal is framed to succeed — a grey box is a signal to fix.":
    "Les cinq badges S·M·A·R·T vous disent si l'objectif est cadré pour réussir — une case grise est un signal à corriger.",
  "Your schedule defends itself": "Votre agenda se défend tout seul",
  "A rule = a trigger and an action. \"Buffer between meetings\" adds 15 min after each meeting — you see how many times it acted.":
    "Une règle = un déclencheur et une action. « Marge entre réunions » ajoute 15 min après chaque réunion — vous voyez combien de fois elle a agi.",
  "Start with a template": "Commencez par un modèle",
  "No need to configure everything: start from a proven template (Focus Time, Lunch break…) and adjust it to your reality.":
    "Pas besoin de tout configurer : partez d'un modèle éprouvé (Temps Focus, Pause déjeuner…) et ajustez-le à votre réalité.",
  "The numbers that count, up front": "Les chiffres qui comptent, en avant",
  "Hours worked, tasks done, completion rate and score: the health of your week in four cards.":
    "Heures travaillées, tâches faites, taux de complétion et score : la santé de votre semaine en quatre cartes.",
  "One chart, all your metrics": "Un graphique, toutes vos métriques",
  "Switch metric without switching page: the period follows the header, you compare apples to apples.":
    "Changez de métrique sans changer de page : la période suit l'en-tête, vous comparez ce qui est comparable.",
  "It all starts with a connected calendar": "Tout commence par un calendrier connecté",
  "Connect your accounts so DPM sees your real events — without it, workload and suggestions fly blind.":
    "Connectez vos comptes pour que DPM voie vos vrais événements — sans ça, charge et suggestions avancent à l'aveugle.",
  "Your data is yours": "Vos données vous appartiennent",
  "Export everything whenever you want, delete your account in a clear place. No traps, no friction (GDPR / Law 25).":
    "Exportez tout quand vous voulez, supprimez votre compte à un endroit clair. Aucun piège, aucune friction (RGPD / Loi 25).",

  // ── Resource center (P19) — chrome ──
  "Resource center": "Centre de ressources",
  "Learn DPM at your own pace": "Apprenez DPM à votre rythme",
  "Short videos, journeys by profile, answers to frequent questions and a module-by-module guide. Everything is searchable — and the guided tour is never far.":
    "Des vidéos courtes, des parcours par profil, des réponses aux questions fréquentes et un guide module par module. Tout est cherchable — et la visite guidée n'est jamais loin.",
  "Search a feature, a question…": "Rechercher une fonction, une question…",
  "Wiki GitHub": "Wiki GitHub",
  "Explainer videos": "Vidéos explicatives",
  "Short formats — placeholders pending filming.": "Formats courts — espaces réservés en attendant le tournage.",
  "By profile": "Par profil",
  "Pick the persona that fits you — we'll launch the most useful journey.":
    "Choisissez le profil qui vous ressemble — on lance le parcours le plus utile.",
  "Frequently asked questions": "Questions fréquentes",
  "Pricing, privacy (Law 25 / GDPR), tour, sync, mobile…": "Tarifs, confidentialité (Loi 25 / RGPD), visite, synchro, mobile…",
  "Guide by feature": "Guide par fonctionnalité",
  "Every module and everything it can do — replay a tutorial anytime.":
    "Chaque module et tout ce qu'il sait faire — rejouez un tutoriel à tout moment.",
  "Video · placeholder": "Vidéo · à venir",
  "Start the journey": "Démarrer le parcours",
  "View in the Wiki": "Voir dans le Wiki",
  "functions": "fonctions",
  "Key": "Clé",
  "Try another term, or launch the guided tour to explore.": "Essayez un autre terme, ou lancez la visite guidée pour explorer.",

  // ── Resource center — video titles ──
  "First steps in 2 minutes": "Premiers pas en 2 minutes",
  "Mastering calendar views": "Maîtriser les vues du calendrier",
  "The daily planning ritual": "Le rituel de planification quotidienne",
  "Deep work with Focus mode": "Deep work avec le mode Focus",
  "Automating your schedule with Rules": "Automatiser son agenda avec les Règles",
  "Reading your Analytics dashboard": "Lire son tableau de bord Analytique",

  // ── Resource center — personas ──
  "Student": "Étudiant",
  "Founder": "Fondatrice",
  "Freelancer": "Indépendant",
  "Team lead": "Chef d'équipe",
  "Procrastinates and loses the big picture of his deadlines.": "Procrastine et perd la vue d'ensemble de ses échéances.",
  "Back-to-back meetings, real risk of burnout.": "Réunions à la chaîne, vrai risque d'épuisement.",
  "Multiple clients, needs to track billable time.": "Plusieurs clients, besoin de suivre le temps facturable.",
  "Looking for team visibility and the common time slot.": "Cherche la visibilité d'équipe et le créneau commun.",

  // ── Resource center — FAQ categories ──
  "Pricing & plans": "Tarifs & forfaits",
  "Privacy (Law 25 / GDPR)": "Confidentialité (Loi 25 / RGPD)",
  "The guided tour": "La visite guidée",
  "Calendar sync": "Synchronisation du calendrier",
  "Mobile": "Mobile",
  "Competitor comparison": "Comparaison concurrents",
  // ── FAQ questions ──
  "Is DPM Elevate free?": "DPM Elevate est-il gratuit ?",
  "Can I switch plans at any time?": "Puis-je changer de forfait à tout moment ?",
  "Where is my data stored?": "Où sont stockées mes données ?",
  "Do you sell my data?": "Vendez-vous mes données ?",
  "How do I restart the guided tour?": "Comment relancer la visite guidée ?",
  "Will the tour restart on its own?": "La visite se relancera-t-elle toute seule ?",
  "Which calendars can I connect?": "Quels calendriers puis-je connecter ?",
  "Is there a mobile app?": "Existe-t-il une application mobile ?",
  "How is DPM different from a plain calendar?": "En quoi DPM diffère-t-il d'un simple calendrier ?",
  // ── FAQ answers ──
  "The Discovery plan is free and includes the calendar, tasks and habits. Advanced analytics views, unlimited rules and multi-account sync are on the Pro plan.":
    "Le forfait Découverte est gratuit et inclut le calendrier, les tâches et les habitudes. Les vues analytiques avancées, les règles illimitées et la synchro multi-comptes sont sur le forfait Pro.",
  "Yes — upgrading to Pro is immediate, and downgrading to the free plan takes effect at the end of the current period, with no data loss.":
    "Oui — le passage à Pro est immédiat, et le retour au forfait gratuit prend effet à la fin de la période en cours, sans perte de données.",
  "On servers hosted in Canada and the EU. You can export all your data or delete your account from Settings → Danger zone, in line with Law 25 and GDPR.":
    "Sur des serveurs hébergés au Canada et dans l'UE. Vous pouvez exporter toutes vos données ou supprimer votre compte depuis Paramètres → Zone sensible, conformément à la Loi 25 et au RGPD.",
  "Never. No personal data is sold or used for advertising. Calendar integrations use tokens you can revoke at any time.":
    "Jamais. Aucune donnée personnelle n'est vendue ni utilisée à des fins publicitaires. Les intégrations calendrier utilisent des jetons que vous pouvez révoquer à tout moment.",
  "The floating \"?\" button (bottom) opens the full tour or any per-module mini-tour. You can also reset it in Settings → Reset tutorials.":
    "Le bouton flottant « ? » (en bas) ouvre la visite complète ou n'importe quelle mini-visite par module. Vous pouvez aussi la réinitialiser dans Paramètres → Réinitialiser les tutoriels.",
  "No. The welcome tour only launches automatically once, right after onboarding. After that, you always trigger it yourself.":
    "Non. La visite de bienvenue ne se lance automatiquement qu'une seule fois, juste après l'intégration. Ensuite, c'est toujours vous qui la déclenchez.",
  "Google Calendar, Microsoft Outlook and Apple Calendar (iCloud). Sync is two-way and conflicts are flagged in Settings → Sync conflicts.":
    "Google Calendar, Microsoft Outlook et Apple Calendar (iCloud). La synchro est bidirectionnelle et les conflits sont signalés dans Paramètres → Conflits de synchro.",
  "The web app is fully responsive: on mobile, navigation moves to a bottom bar and the guided tour shows as a bottom sheet. Native iOS / Android apps are on the way.":
    "L'app web est entièrement responsive : sur mobile, la navigation passe dans une barre du bas et la visite guidée s'affiche en feuille basse. Les apps natives iOS / Android arrivent.",
  "A calendar shows your events; DPM links calendar, tasks, habits, goals and energy to tell you what to do now — not just what's scheduled.":
    "Un calendrier montre vos événements ; DPM relie calendrier, tâches, habitudes, objectifs et énergie pour vous dire quoi faire maintenant — pas seulement ce qui est planifié.",

  // ── Sidebar: Workspace + Account nav ──
  "WORKSPACE": "ESPACE DE TRAVAIL",
  "AI Planning": "Planification IA",
  "Sync Center": "Centre de synchro",
  "Plan & Billing": "Forfait & Facturation",
  "Data & Privacy": "Données & Confidentialité",

  // ── AI assistant (home) ──
  "Your day is busy and your hardest task —": "Votre journée est chargée et votre tâche la plus difficile —",
  "— is still to do. Use your morning energy peak to tackle it first.": "— reste à faire. Profitez de votre pic d'énergie matinal pour l'attaquer en premier.",
  "You slept little (5h50, quality 2/5). Lighten your morning: push “Desjardins proposal” to 2pm, keep the morning for admin and short meetings.":
    "Vous avez peu dormi (5h50, qualité 2/5). Allégez votre matinée : repoussez « Proposition Desjardins » à 14h, gardez la matinée pour l'administratif et les réunions courtes.",
  "Your energy is usually high around 10am and low around 2pm. Place your hard task in the morning rather than after lunch — you'll gain 20–30% productivity.":
    "Votre énergie est généralement haute vers 10h et basse vers 14h. Placez votre tâche difficile le matin plutôt qu'après le déjeuner — vous gagnerez 20–30 % de productivité.",
  "The “Reading” habit hasn't been checked for 2 days. Block 20 min tonight before journaling to keep your momentum.":
    "L'habitude « Lecture » n'a pas été cochée depuis 2 jours. Bloquez 20 min ce soir avant le journaling pour garder votre élan.",

  // ── AI Planning page ──
  "Explainable suggestions you stay in control of. Nothing changes until you accept.":
    "Des suggestions explicables que vous gardez sous contrôle. Rien ne change tant que vous n'acceptez pas.",
  "Plan my week": "Planifier ma semaine",
  "Replan after conflict": "Replanifier après conflit",
  "Day too full": "Journée trop chargée",
  "Let the assistant draft a plan": "Laissez l'assistant préparer un plan",
  "Pick a scenario above. You'll see exactly what would change and why — then accept, tweak, or ignore each suggestion.":
    "Choisissez un scénario ci-dessus. Vous verrez exactement ce qui changerait et pourquoi — puis acceptez, ajustez ou ignorez chaque suggestion.",

  // ── Collaboration page ──
  "Share spaces, set roles, collect availability — without exposing your whole calendar.":
    "Partagez des espaces, définissez des rôles, recueillez les disponibilités — sans exposer tout votre agenda.",
  "Work space": "Espace de travail",
  "Invite by email…": "Inviter par e-mail…",
  "Viewer": "Lecteur",
  "Editor": "Éditeur",
  "(you)": "(vous)",
  "Access expired": "Accès expiré",
  "Renew": "Renouveler",
  "Share link": "Lien de partage",
  "Copy": "Copier",
  "Anyone with the link can view · sign-in required": "Toute personne avec le lien peut voir · connexion requise",
  "Meeting poll": "Sondage de réunion",
  "Best": "Idéal",
  "No votes": "Aucun vote",
  "Best slot:": "Meilleur créneau :",
  "Create event": "Créer l'événement",
  "Recent activity": "ACTIVITÉ RÉCENTE",

  // ── Plan & Billing page ──
  "Manage your subscription, usage and invoices.": "Gérez votre abonnement, votre usage et vos factures.",
  "Active": "Actif",
  "Manage": "Gérer",
  "Upgrade to Team": "Passer à Team",
  "Team trial — 9 days left. Add your team before it ends to keep shared spaces.":
    "Essai Team — 9 jours restants. Ajoutez votre équipe avant la fin pour conserver les espaces partagés.",
  "Start trial": "Démarrer l'essai",
  "Usage this period": "Usage cette période",
  "Calendars connected": "Calendriers connectés",
  "Active automations": "Automatisations actives",
  "AI suggestions this month": "Suggestions IA ce mois",
  "Shared spaces": "Espaces partagés",
  "Compare plans": "COMPARER LES FORFAITS",
  "Free": "Gratuit",
  "forever": "pour toujours",
  "Most popular": "Le plus populaire",
  "/ month": "/ mois",
  "/ user / mo": "/ utilisateur / mois",
  "1 calendar": "1 calendrier",
  "Basic planning": "Planification de base",
  "5 automations": "5 automatisations",
  "Community support": "Support communautaire",
  "Unlimited calendars": "Calendriers illimités",
  "AI planning": "Planification IA",
  "Unlimited automations": "Automatisations illimitées",
  "All integrations": "Toutes les intégrations",
  "Priority support": "Support prioritaire",
  "Everything in Pro": "Tout le forfait Pro",
  "Meeting polls": "Sondages de réunion",
  "Admin controls": "Contrôles admin",
  "Downgrade": "Rétrograder",
  "Current plan": "Forfait actuel",
  "Upgrade": "Passer au supérieur",
  "Payment method": "Moyen de paiement",
  "Update": "Mettre à jour",
  "Invoices": "Factures",
  "Paid": "Payé",

  // ── Data & Privacy page ──
  "Exactly what's stored, why, and how to remove it. Your data is yours.":
    "Exactement ce qui est stocké, pourquoi, et comment le supprimer. Vos données vous appartiennent.",
  "Your calendar is private by default.": "Votre agenda est privé par défaut.",
  "DPM never sells your data and never uses your notes or events to train models. You can export or delete everything at any time.":
    "DPM ne vend jamais vos données et n'utilise jamais vos notes ou événements pour entraîner des modèles. Vous pouvez tout exporter ou supprimer à tout moment.",
  "What we store": "CE QUE NOUS STOCKONS",
  "Calendar & events": "Calendrier & événements",
  "Powers your agenda, planning and conflict detection.": "Alimente votre agenda, la planification et la détection de conflits.",
  "Tasks & projects": "Tâches & projets",
  "Your to-dos, priorities and time estimates.": "Vos tâches, priorités et estimations de temps.",
  "Health & energy": "Santé & énergie",
  "Energy check-ins to schedule around your peaks.": "Bilans d'énergie pour planifier autour de vos pics.",
  "From Apple Health": "Depuis Apple Santé",
  "Notes & journal": "Notes & journal",
  "Quick notes and reflections. Never used for AI training.": "Notes rapides et réflexions. Jamais utilisées pour l'entraînement IA.",
  "Usage analytics": "Analyses d'usage",
  "Anonymous product metrics. Optional.": "Métriques produit anonymes. Optionnel.",
  "Opt-out anytime": "Désactivable à tout moment",
  "Connected apps & permissions": "APPS & PERMISSIONS CONNECTÉES",
  "Revoke": "Révoquer",
  "Consents": "Consentements",
  "Anonymous analytics": "Analyses anonymes",
  "Help improve DPM with non-identifying usage data.": "Aidez à améliorer DPM avec des données d'usage non identifiantes.",
  "Personalized suggestions": "Suggestions personnalisées",
  "Let the AI use your patterns to plan better.": "Laissez l'IA utiliser vos habitudes pour mieux planifier.",
  "Product emails": "E-mails produit",
  "Occasional updates about new features.": "Mises à jour occasionnelles sur les nouveautés.",
  "Access history": "HISTORIQUE D'ACCÈS",
  "Calendar synced": "Calendrier synchronisé",
  "automated": "automatisé",
  "Data export generated": "Export de données généré",
  "You": "Vous",
  "Signed in": "Connexion",
  "Health data imported": "Données de santé importées",
  "Erase data": "Effacer les données",
  "Delete imported data": "Supprimer les données importées",
  "Remove everything imported from other apps — keeps your DPM data.": "Supprime tout ce qui a été importé d'autres apps — conserve vos données DPM.",
  "Delete imports": "Supprimer les imports",
  "Pause my account": "Mettre mon compte en pause",
  "Hide your data and stop all syncing. Reversible anytime.": "Masque vos données et arrête toute synchro. Réversible à tout moment.",
  "Permanent erasure within 24h · double confirmation required.": "Effacement permanent sous 24h · double confirmation requise.",
  "Delete account": "Supprimer le compte",

  // ── Sync Center page ──
  "Connect your calendars, manage permissions, and keep everything in agreement.":
    "Connectez vos calendriers, gérez les permissions et gardez tout en accord.",
  "Needs attention": "Attention requise",
  "All healthy": "Tout est sain",
  "Sync all now": "Tout synchroniser",
  "Connected accounts": "Comptes connectés",
  "3 available": "3 disponibles",
  "Calendars syncing": "Calendriers synchronisés",
  "across all accounts": "sur tous les comptes",
  "Open conflicts": "Conflits ouverts",
  "needs your call": "à vous de trancher",
  "all resolved": "tout est résolu",
  "Data portability": "Portabilité des données",
  "Import": "Importer",
  "ICS, CSV, Todoist, Notion, Google — with mapping & duplicate detection.":
    "ICS, CSV, Todoist, Notion, Google — avec mappage et détection des doublons.",
  "JSON archive, ICS calendar, CSV tasks & habits. GDPR-ready, link or email.":
    "Archive JSON, calendrier ICS, tâches & habitudes CSV. Conforme RGPD, par lien ou e-mail.",
  // provider card states
  "Two-way": "Bidirectionnel",
  "Import only": "Import seul",
  "Reconnect required": "Reconnexion requise",
  "Syncing…": "Synchro…",
  "Paused": "En pause",
  "Limited access": "Accès limité",
  "calendars · last sync": "calendriers · dernière synchro",
  "token expired": "jeton expiré",
  "· token expired": "· jeton expiré",
  "conflicts": "conflits",
  "4 min ago": "il y a 4 min",
  "3 days ago": "il y a 3 jours",
  "just now": "à l'instant",
  "Pulling events…": "Récupération des événements…",
  "1 calendar skipped — insufficient permission": "1 calendrier ignoré — permission insuffisante",
  "Review permissions": "Revoir les permissions",
  "Authorization expired — Microsoft requires you to sign in again. Sync is paused until you reconnect.":
    "Autorisation expirée — Microsoft exige une nouvelle connexion. La synchro est en pause jusqu'à la reconnexion.",
  "Connect to import and two-way sync your calendars": "Connectez pour importer et synchroniser vos calendriers dans les deux sens",
  "Sync now": "Synchroniser",
  "Manage calendars": "Gérer les calendriers",
  "Reconnect": "Reconnecter",
  "Pause": "Pause",
  // ── Sync drawers ──
  "Save changes": "Enregistrer les modifications",
  "Calendar settings saved": "Réglages du calendrier enregistrés",
  "Mode": "Mode",
  "· disabled": "· désactivé",
  "Read-only": "Lecture seule",
  "Read access not granted — re-authorize to enable this calendar.":
    "Accès en lecture non accordé — réautorisez pour activer ce calendrier.",
  "Conflict Center": "Centre de conflits",
  "3 unresolved": "3 non résolus",
  "2 unresolved": "2 non résolus",
  "1 unresolved": "1 non résolu",
  "0 unresolved": "0 non résolu",
  "Resolutions apply on next sync": "Les résolutions s'appliquent à la prochaine synchro",
  "All caught up": "Tout est à jour",
  "No sync conflicts. Everything is in agreement across your calendars.":
    "Aucun conflit de synchro. Tout est en accord sur vos calendriers.",
  "Recurring": "Récurrent",
  "Deleted remotely · kept locally": "Supprimé à distance · conservé en local",
  "Series time changed": "Horaire de la série modifié",
  "Time overlap": "Chevauchement horaire",
  "This device": "Cet appareil",
  "Accept": "Accepter",
  "Merge": "Fusionner",
  "This occurrence": "Cette occurrence",
  "Whole series": "Toute la série",
  "Ignore": "Ignorer",
  "Conflict resolved": "Conflit résolu",
  "Export data": "Exporter les données",
  "GDPR-compliant · take your data anywhere": "Conforme RGPD · emportez vos données partout",
  "Prepare export": "Préparer l'export",
  "Email me the link": "M'envoyer le lien par e-mail",
  "Download .zip": "Télécharger le .zip",
  "Preparing your export…": "Préparation de votre export…",
  "Export ready": "Export prêt",
  "Ready": "Prêt",
  "Import data": "Importer les données",
  "Bring events and tasks from anywhere": "Importez événements et tâches depuis n'importe où",
  "Back": "Retour",
  "ICS file": "Fichier ICS",
  "CSV file": "Fichier CSV",
  "Google Takeout": "Google Takeout",
  "Drop a file": "Déposer un fichier",
  "Column mapping": "Mappage des colonnes",
  "Import complete": "Import terminé",

  // ── Collaboration (remaining) ──
  "people": "personnes",
  "Commenter": "Commentateur",
  "Can view": "Peut voir",
  "Can comment": "Peut commenter",
  "Can edit": "Peut modifier",
  "Role": "Rôle",
  "Copied": "Copié",
  "responded": "réponses",
  "Tue 30 · 10:00": "Mar 30 · 10:00",
  "Tue 30 · 14:00": "Mar 30 · 14:00",
  "Wed 1 · 11:00": "Mer 1 · 11:00",
  "Thu 2 · 16:00": "Jeu 2 · 16:00",
  "voted on": "a voté sur",
  "commented on": "a commenté",
  "shared": "a partagé",
  "access expired for": "accès expiré pour",
  "12 min ago": "il y a 12 min",
  "1h ago": "il y a 1h",
  "3h ago": "il y a 3h",
  "yesterday": "hier",
  "Access removed": "Accès retiré",
  "Anyone with the link can view": "Toute personne avec le lien peut voir",
  "· sign-in required": "· connexion requise",
  "· public": "· public",

  // ── Command palette / Quick capture ──
  "Capture or command…  e.g. “Réviser LOG430 demain 14h–16h”":
    "Capturer ou commander…  ex. “Réviser LOG430 demain 14h–16h”",
  "Quick capture": "Capture rapide",
  "Quick capture  ⌘K": "Capture rapide  ⌘K",
  "Go to": "Aller à",
  "Daily planning": "Planification quotidienne",
  "Analytics": "Analyses",
  "Automations": "Automatisations",
  "New event… (advanced)": "Nouvel événement… (avancé)",
  "Sync all calendars now": "Synchroniser tous les calendriers",
  "Toggle dark / light": "Basculer sombre / clair",
  "Syncing all calendars…": "Synchronisation de tous les calendriers…",
  "Create as": "Créer comme",
  "cycle": "cycler",
  "High confidence": "Confiance élevée",
  "Needs a check": "À vérifier",
  "Ambiguous": "Ambigu",
  "Next free slot:": "Prochain créneau libre :",
  "Use slot": "Utiliser ce créneau",
  "Undo": "Annuler",
  "New": "Nouveau",
  "Creation undone": "Création annulée",
  "No matching command. Keep typing to capture an item.":
    "Aucune commande correspondante. Continuez à taper pour capturer un élément.",
  "create / run": "créer / lancer",
  "change type": "changer de type",
  "navigate": "naviguer",
  "Natural-language capture": "Capture en langage naturel",
};

const I18N_ATTRS = ["placeholder", "title", "aria-label"];
let __i18nObserver = null;

function __frFor(text) {
  if (text == null) return null;
  const trimmed = text.trim();
  if (!trimmed) return null;
  const fr = UI_FR[trimmed];
  return fr && fr !== trimmed ? fr : null;
}

/* Imperative translate helper for cases the DOM observer can't reach — e.g.
   the value pre-filled into an inline-rename <input> (an input's value isn't a
   text node, so the observer never sees it). Returns the FR string when the
   current lang is "fr" and a mapping exists, otherwise the input unchanged. */
function __dpmTr(text) {
  if (typeof window === "undefined" || window.__dpmLang !== "fr" || text == null) return text;
  const k = String(text).trim();
  return UI_FR[k] || text;
}

function __translateTextNode(node, toFr) {
  if (toFr) {
    // Stale-cache guard: React reuses text nodes across renders, so a node we
    // once translated (e.g. "All"→"Tous") can be repopulated with brand-new
    // English ("Professional"). If the current value matches NEITHER our last
    // French write NOR the cached English origin, React replaced the content —
    // forget the old origin so we re-translate from the new text. Without this,
    // the node would be forced back to the stale translation forever.
    if (node.__i18nEn != null) {
      const enTrim = node.__i18nEn.trim();
      const frMap = UI_FR[enTrim];
      const cachedFr = frMap && frMap !== enTrim
        ? node.__i18nEn.match(/^\s*/)[0] + frMap + node.__i18nEn.match(/\s*$/)[0]
        : node.__i18nEn;
      if (node.nodeValue !== cachedFr && node.nodeValue !== node.__i18nEn) {
        node.__i18nEn = null;
      }
    }
    // English source = stored original (if already processed) else current value.
    const src = node.__i18nEn != null ? node.__i18nEn : node.nodeValue;
    if (src == null) return;
    const fr = UI_FR[src.trim()];
    if (!fr || fr === src.trim()) return;
    const target = src.match(/^\s*/)[0] + fr + src.match(/\s*$/)[0];
    // CRITICAL: only write if it actually changes — otherwise the write
    // fires another characterData mutation and the observer loops forever.
    if (node.nodeValue !== target) {
      if (node.__i18nEn == null) node.__i18nEn = node.nodeValue;
      node.nodeValue = target;
    }
  } else if (node.__i18nEn != null) {
    if (node.nodeValue !== node.__i18nEn) node.nodeValue = node.__i18nEn;
    node.__i18nEn = null;
  }
}

function __translateAttrs(el, toFr) {
  if (!el.hasAttribute) return;
  for (const a of I18N_ATTRS) {
    if (toFr) {
      if (!el.hasAttribute(a)) continue;
      const cur = el.getAttribute(a);
      const fr = __frFor(cur);
      if (fr && cur !== fr) {            // skip no-op writes to avoid loops
        el.__i18nAttr = el.__i18nAttr || {};
        if (el.__i18nAttr[a] == null) el.__i18nAttr[a] = cur;
        el.setAttribute(a, fr);
      }
    } else if (el.__i18nAttr && el.__i18nAttr[a] != null) {
      if (el.getAttribute(a) !== el.__i18nAttr[a]) el.setAttribute(a, el.__i18nAttr[a]);
      el.__i18nAttr[a] = null;
    }
  }
}

function __walk(root, toFr) {
  if (!root) return;
  if (root.nodeType === 1) __translateAttrs(root, toFr);
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(n) {
      const p = n.parentNode;
      if (!p) return NodeFilter.FILTER_REJECT;
      const tag = p.nodeName;
      if (tag === "SCRIPT" || tag === "STYLE" || tag === "TEXTAREA") return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });
  const texts = [];
  let n;
  while ((n = walker.nextNode())) texts.push(n);
  texts.forEach((t) => __translateTextNode(t, toFr));
  if (root.querySelectorAll) {
    root.querySelectorAll("[placeholder],[title],[aria-label]").forEach((el) => __translateAttrs(el, toFr));
  }
}

const I18N_OBS_OPTS = { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: I18N_ATTRS };

// rAF-coalesced processing: all mutations in a frame are batched and handled
// in ONE pass per animation frame (~60/s max). This makes a microtask flood /
// main-thread starvation physically impossible. The observer is also
// disconnected during our own writes so they never re-enqueue records.
let __i18nQueue = [];
let __i18nRaf = 0;
let __i18nTimer = 0;
let __i18nTripped = false;
let __i18nFlushes = 0;
let __i18nWindowStart = 0;

/* Schedule a flush via BOTH requestAnimationFrame and a setTimeout fallback.
   rAF is fast (~16ms) for a foreground tab but is PAUSED entirely when the page
   is hidden/backgrounded — which would otherwise leave dynamically-mounted
   content (modals, popovers, lazily-rendered pages) stuck in English. The
   setTimeout fallback guarantees the flush still runs in that case. Whichever
   fires first cancels the other. */
function __i18nSchedule() {
  if (__i18nRaf || __i18nTimer) return;
  __i18nRaf = requestAnimationFrame(__i18nFlush);
  __i18nTimer = setTimeout(__i18nFlush, 50);
}

function __i18nFlush() {
  if (__i18nRaf) { cancelAnimationFrame(__i18nRaf); __i18nRaf = 0; }
  if (__i18nTimer) { clearTimeout(__i18nTimer); __i18nTimer = 0; }
  if (__i18nTripped || !__i18nObserver) return;
  // Circuit breaker (belt & suspenders): if we ever flush absurdly often,
  // give up rather than risk the page.
  const now = Date.now();
  if (now - __i18nWindowStart > 1000) { __i18nWindowStart = now; __i18nFlushes = 0; }
  if (++__i18nFlushes > 180) { __i18nTripped = true; __i18nObserver.disconnect(); return; }

  const batch = __i18nQueue;
  __i18nQueue = [];
  const root = document.getElementById("root");
  __i18nObserver.disconnect();
  try {
    for (const m of batch) {
      if (m.type === "characterData") {
        __translateTextNode(m.target, true);
      } else if (m.type === "attributes" && m.target.nodeType === 1) {
        __translateAttrs(m.target, true);
      } else if (m.type === "childList") {
        m.addedNodes.forEach((node) => {
          if (node.nodeType === 3) __translateTextNode(node, true);
          else if (node.nodeType === 1) __walk(node, true);
        });
      }
    }
  } catch (e) { /* never let translation break the app */ }
  finally {
    if (!__i18nTripped && root) __i18nObserver.observe(root, I18N_OBS_OPTS);
  }
}

function applyUiLang(lang) {
  const root = document.getElementById("root");
  if (!root || __i18nTripped) return;
  const toFr = lang === "fr";

  if (__i18nObserver) __i18nObserver.disconnect();
  try { __walk(root, toFr); } catch (e) { /* swallow */ }

  if (toFr) {
    if (!__i18nObserver) {
      __i18nObserver = new MutationObserver((muts) => {
        if (__i18nTripped) return;
        for (let i = 0; i < muts.length; i++) __i18nQueue.push(muts[i]);
        __i18nSchedule();
      });
    }
    __i18nObserver.observe(root, I18N_OBS_OPTS);
  }
  // toFr === false: observer stays disconnected; English is the DOM default.
}

if (typeof window !== "undefined") {
  window.addEventListener("dpm-lang-change", (e) => applyUiLang(e.detail || "en"));
  // Apply on first paint in case lang is already FR.
  const boot = () => applyUiLang(window.__dpmLang || "en");
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else setTimeout(boot, 0);
  window.__dpmApplyUiLang = applyUiLang;
  window.__dpmTr = __dpmTr;
}
