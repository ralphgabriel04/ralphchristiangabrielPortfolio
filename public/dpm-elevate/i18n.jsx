/* global React, useState, useEffect */
/* ============================================================
   i18n — bilingual FR/EN runtime.

   Usage:
     const t = useT();
     <h1>{t("habits.title")}</h1>

   For strings that come from data (e.g. user-typed names), DON'T
   translate; use them as-is. Translate ONLY UI chrome strings.

   The lang state lives in the app (Tweaks → "lang"). The shell
   pushes the current lang onto window.__dpmLang and dispatches the
   "dpm-lang-change" event whenever it flips, so any component using
   useT() re-renders on flip.

   Translation keys are dotted; missing keys fall through to the FR
   value, and if that's missing too, return the key itself so
   debugging is easy.
============================================================ */

const DICT = {
  // Common UI
  "common.new": { fr: "Nouveau", en: "New" },
  "common.add": { fr: "Ajouter", en: "Add" },
  "common.edit": { fr: "Modifier", en: "Edit" },
  "common.delete": { fr: "Supprimer", en: "Delete" },
  "common.rename": { fr: "Renommer", en: "Rename" },
  "common.cancel": { fr: "Annuler", en: "Cancel" },
  "common.save": { fr: "Enregistrer", en: "Save" },
  "common.confirm": { fr: "Confirmer", en: "Confirm" },
  "common.create": { fr: "Créer", en: "Create" },
  "common.close": { fr: "Fermer", en: "Close" },
  "common.search": { fr: "Rechercher…", en: "Search…" },
  "common.filters": { fr: "Filtres", en: "Filters" },
  "common.all": { fr: "Tous", en: "All" },
  "common.today": { fr: "Aujourd'hui", en: "Today" },
  "common.tomorrow": { fr: "Demain", en: "Tomorrow" },
  "common.yesterday": { fr: "Hier", en: "Yesterday" },
  "common.week": { fr: "Semaine", en: "Week" },
  "common.month": { fr: "Mois", en: "Month" },
  "common.day": { fr: "Jour", en: "Day" },
  "common.duration": { fr: "Durée", en: "Duration" },
  "common.priority": { fr: "Priorité", en: "Priority" },
  "common.status": { fr: "Statut", en: "Status" },
  "common.clearAll": { fr: "Tout effacer", en: "Clear all" },
  "common.tags": { fr: "Tags", en: "Tags" },
  "common.soon": { fr: "bientôt", en: "soon" },
  "common.title": { fr: "Titre", en: "Title" },
  "common.description": { fr: "Description", en: "Description" },
  "common.optional": { fr: "optionnel", en: "optional" },
  "common.advanced": { fr: "Plus d'options", en: "More options" },
  "common.hideAdvanced": { fr: "Masquer les options", en: "Hide options" },
  "common.notes": { fr: "Notes", en: "Notes" },
  "common.note": { fr: "Note", en: "Note" },
  "common.start": { fr: "Démarrer", en: "Start" },
  "common.pause": { fr: "Pause", en: "Pause" },
  "common.resume": { fr: "Reprendre", en: "Resume" },
  "common.end": { fr: "Fin", en: "End" },
  "common.restart": { fr: "Recommencer", en: "Restart" },
  "common.skip": { fr: "Passer", en: "Skip" },
  "common.reset": { fr: "Réinitialiser", en: "Reset" },
  "common.empty": { fr: "Vide", en: "Empty" },
  "common.color": { fr: "Couleur", en: "Color" },
  "common.icon": { fr: "Icône", en: "Icon" },
  "common.category": { fr: "Catégorie", en: "Category" },
  "common.placeholder.title": { fr: "Titre…", en: "Title…" },
  "common.next": { fr: "Suivant", en: "Next" },
  "common.previous": { fr: "Précédent", en: "Previous" },
  "common.menu.options": { fr: "Options", en: "Options" },
  "common.help.dblclick": { fr: "Double-cliquez pour modifier", en: "Double-click to edit" },

  // Nav
  "nav.home": { fr: "Accueil", en: "Home" },
  "nav.calendar": { fr: "Calendrier", en: "Calendar" },
  "nav.daily": { fr: "RITUELS QUOTIDIENS", en: "DAILY RITUALS" },
  "nav.daily.planning": { fr: "Planification", en: "Planning" },
  "nav.daily.focus": { fr: "Focus", en: "Focus" },
  "nav.productivity": { fr: "PRODUCTIVITÉ", en: "PRODUCTIVITY" },
  "nav.tasks": { fr: "Tâches", en: "Tasks" },
  "nav.matrix": { fr: "Priorisation", en: "Prioritization" },
  "nav.habits": { fr: "Habitudes", en: "Habits" },
  "nav.goals": { fr: "Objectifs", en: "Goals" },
  "nav.automation": { fr: "AUTOMATION", en: "AUTOMATION" },
  "nav.rules": { fr: "Règles", en: "Rules" },
  "nav.insights": { fr: "ANALYSES", en: "INSIGHTS" },
  "nav.dashboard": { fr: "Tableau d'analyses", en: "Analytics dashboard" },
  "nav.settings": { fr: "Paramètres", en: "Settings" },
  "nav.newTask": { fr: "Nouvelle tâche", en: "New task" },
  "nav.context": { fr: "CONTEXTE", en: "CONTEXT" },
  "nav.viewAll": { fr: "Tout voir", en: "View all" },
  "nav.upcoming": { fr: "À venir", en: "Upcoming" },
  "nav.quickNotes": { fr: "Notes rapides", en: "Quick notes" },
  "nav.collapseSidebar": { fr: "Réduire la sidebar", en: "Collapse sidebar" },
  "nav.expandSidebar": { fr: "Étendre", en: "Expand" },

  // Pages
  "habits.title": { fr: "Habitudes", en: "Habits" },
  "habits.subtitle": { fr: "habitudes actives · cochées aujourd'hui", en: "active habits · checked today" },
  "habits.new": { fr: "Habitude", en: "Habit" },
  "habits.newHabit": { fr: "Nouvelle habitude", en: "New habit" },
  "habits.empty": { fr: "Aucune habitude", en: "No habits yet" },
  "habits.searchPlaceholder": { fr: "Rechercher une habitude…", en: "Search a habit…" },
  "habits.doneToday": { fr: "Fait aujourd'hui", en: "Done today" },
  "habits.checkToday": { fr: "Cocher aujourd'hui", en: "Check today" },
  "habits.last7days": { fr: "7 derniers jours", en: "Last 7 days" },
  "habits.deleteConfirm": { fr: "Supprimer cette habitude ?", en: "Delete this habit?" },
  "habits.dblClickHelp": { fr: "Double-cliquez sur le nom pour le modifier", en: "Double-click the name to edit" },

  "goals.title": { fr: "Objectifs", en: "Goals" },
  "goals.new": { fr: "Objectif", en: "Goal" },
  "goals.newGoal": { fr: "Nouvel objectif", en: "New goal" },
  "goals.empty": { fr: "Aucun objectif", en: "No goals yet" },
  "goals.searchPlaceholder": { fr: "Rechercher un objectif…", en: "Search a goal…" },
  "goals.deleteConfirm": { fr: "Supprimer cet objectif ?", en: "Delete this goal?" },
  "goals.target": { fr: "Cible", en: "Target" },
  "goals.progress": { fr: "Progrès", en: "Progress" },
  "goals.unit": { fr: "Unité", en: "Unit" },

  // Habit modal — frequency / type (canonical EN values kept in data; only display translates)
  "habit.frequency": { fr: "Fréquence", en: "Frequency" },
  "habit.time": { fr: "Heure", en: "Time" },
  "habit.freq.daily": { fr: "Quotidien", en: "Daily" },
  "habit.freq.3wk": { fr: "3×/sem", en: "3×/wk" },
  "habit.freq.5wk": { fr: "5×/sem", en: "5×/wk" },
  "habit.freq.weekly": { fr: "Hebdomadaire", en: "Weekly" },
  "habit.freq.monthly": { fr: "Mensuel", en: "Monthly" },
  "habit.type.flexible": { fr: "Flexible", en: "Flexible" },
  "habit.type.fixed": { fr: "Fixe", en: "Fixed" },
  "habit.type.conditional": { fr: "Conditionnel", en: "Conditional" },
  // Goal modal — categories (canonical EN values kept in data)
  "goal.cat.personal": { fr: "Personnel", en: "Personal" },
  "goal.cat.health": { fr: "Santé", en: "Health" },
  "goal.cat.learning": { fr: "Apprentissage", en: "Learning" },
  "goal.cat.business": { fr: "Professionnel", en: "Business" },
  "goal.cat.wellness": { fr: "Bien-être", en: "Wellness" },
  "goal.cat.family": { fr: "Famille", en: "Family" },

  "rules.title": { fr: "Règles", en: "Rules" },
  "rules.subtitle": { fr: "Automatisez ce qui doit l'être", en: "Automate the routine" },
  "rules.new": { fr: "Nouvelle règle", en: "New rule" },
  "rules.searchPlaceholder": { fr: "Rechercher…", en: "Search…" },
  "rules.deleteConfirm": { fr: "Supprimer cette règle ?", en: "Delete this rule?" },
  "rules.created": { fr: "Règles créées", en: "Rules created" },
  "rules.active": { fr: "Règles actives", en: "Active rules" },
  "rules.runs": { fr: "Exécutions totales", en: "Total runs" },
  "rules.runCount": { fr: "Exécutions", en: "Runs" },
  "rules.showInactive": { fr: "Afficher les règles inactives", en: "Show inactive rules" },
  "rules.trigger": { fr: "Déclencheur", en: "Trigger" },
  "rules.action": { fr: "Action", en: "Action" },

  "tasks.title": { fr: "Tâches", en: "Tasks" },
  "tasks.subtitle": { fr: "Toutes vos tâches en un seul endroit", en: "All your tasks in one place" },
  "tasks.empty": { fr: "Boîte de réception vide", en: "Inbox empty" },
  "tasks.new": { fr: "Tâche", en: "Task" },
  "tasks.newTask": { fr: "Nouvelle tâche", en: "New task" },
  "tasks.view.list": { fr: "Liste", en: "List" },
  "tasks.view.kanban": { fr: "Tableaux", en: "Boards" },
  "tasks.view.gantt": { fr: "Échéancier", en: "Timeline" },
  "tasks.view.calendar": { fr: "Cal.", en: "Cal." },
  "tasks.view.stats": { fr: "Stats", en: "Stats" },
  "tasks.priority.urgent": { fr: "Urgente", en: "Urgent" },
  "tasks.priority.high": { fr: "Haute", en: "High" },
  "tasks.priority.medium": { fr: "Moyenne", en: "Medium" },
  "tasks.priority.low": { fr: "Basse", en: "Low" },
  "tasks.priority.URGENT": { fr: "URGENT", en: "URGENT" },
  "tasks.priority.HIGH": { fr: "HIGH", en: "HIGH" },
  "tasks.priority.MEDIUM": { fr: "MEDIUM", en: "MEDIUM" },
  "tasks.priority.LOW": { fr: "LOW", en: "LOW" },
  "tasks.statusTodo": { fr: "À faire", en: "To do" },
  "tasks.statusDoing": { fr: "En cours", en: "In progress" },
  "tasks.filters.active": { fr: "Filtres actifs", en: "Active filters" },
  "tasks.filters.more": { fr: "Autres filtres", en: "More filters" },
  "tasks.filters.due": { fr: "Échéance", en: "Due date" },
  "tasks.filters.thisWeek": { fr: "Cette semaine", en: "This week" },
  "tasks.filters.later": { fr: "Plus tard", en: "Later" },
  "tasks.status.active": { fr: "Actives", en: "Active" },
  "tasks.status.completed": { fr: "Terminées", en: "Completed" },
  "tasks.filters.none": { fr: "Aucun filtre pour cette vue.", en: "No filters for this view." },
  "tasks.statusDone": { fr: "Terminé", en: "Done" },
  "tasks.statusCanceled": { fr: "Annulé", en: "Canceled" },
  "tasks.stats.byPriority": { fr: "Par priorité", en: "By priority" },
  "tasks.stats.thisWeek": { fr: "Cette semaine", en: "This week" },
  "tasks.stats.energy": { fr: "Énergie estimée", en: "Estimated energy" },
  "tasks.stats.completed": { fr: "Tâches complétées", en: "Tasks completed" },
  "tasks.stats.completionRate": { fr: "Taux de complétion", en: "Completion rate" },
  "tasks.stats.byTag": { fr: "Par étiquette", en: "By tag" },
  "tasks.stats.timeSpent": { fr: "Temps passé", en: "Time spent" },
  "tasks.stats.byDuration": { fr: "Distribution des durées", en: "Duration distribution" },
  "tasks.stats.overdue": { fr: "En retard", en: "Overdue" },

  "matrix.title": { fr: "Priorisation", en: "Prioritization" },
  "matrix.subtitle": { fr: "Glissez les tâches entre les quadrants · réordonnez à l'intérieur d'un quadrant", en: "Drag tasks between quadrants · reorder inside a quadrant" },
  "matrix.q1": { fr: "Faire", en: "Do" },
  "matrix.q1.sub": { fr: "Urgent & Important", en: "Urgent & Important" },
  "matrix.q2": { fr: "Planifier", en: "Plan" },
  "matrix.q2.sub": { fr: "Important mais pas urgent", en: "Important not urgent" },
  "matrix.q3": { fr: "Déléguer", en: "Delegate" },
  "matrix.q3.sub": { fr: "Urgent mais pas important", en: "Urgent not important" },
  "matrix.q4": { fr: "Éliminer", en: "Eliminate" },
  "matrix.q4.sub": { fr: "Ni urgent ni important", en: "Neither urgent nor important" },
  "matrix.empty": { fr: "Aucune tâche dans ce quadrant", en: "No task in this quadrant" },
  "matrix.newTask": { fr: "Nouvelle tâche", en: "New task" },

  // Daily planning
  "dp.title": { fr: "Planification de la journée", en: "Daily planning" },
  "dp.add": { fr: "Ajouter", en: "Add" },
  "dp.estimate": { fr: "Estimer", en: "Estimate" },
  "dp.fill": { fr: "Remplir", en: "Fill" },
  "dp.prioritize": { fr: "Prioriser", en: "Prioritize" },
  "dp.schedule": { fr: "Planifier", en: "Schedule" },
  "dp.document": { fr: "Documenter", en: "Document" },
  "dp.estimate.subtitle": { fr: "Combien de temps pour chacune ?", en: "How long for each one?" },
  "dp.prioritize.subtitle": { fr: "Glisser pour réordonner", en: "Drag to reorder" },
  "dp.prioritize.hint": { fr: "Glissez-déposez pour réordonner.", en: "Drag and drop to reorder." },
  "dp.schedule.subtitle": { fr: "Placer dans le calendrier", en: "Place in the calendar" },
  "dp.schedule.tasksToPlace": { fr: "Tâches à placer", en: "Tasks to place" },
  "dp.schedule.allPlaced": { fr: "✓ Toutes les tâches sont placées", en: "✓ All tasks placed" },
  "dp.schedule.dropHere": { fr: "Glissez ici pour ajouter", en: "Drop here to add" },
  "dp.add.placeholder": { fr: "Que voulez-vous accomplir aujourd'hui ?", en: "What do you want to accomplish today?" },
  "dp.custom": { fr: "Personnalisé", en: "Custom" },

  // Focus / planner
  "focus.title": { fr: "Aujourd'hui", en: "Today" },
  "focus.queue": { fr: "File de tâches", en: "Task queue" },
  "focus.remaining": { fr: "restantes", en: "remaining" },
  "focus.session": { fr: "Session de focus", en: "Focus session" },
  "focus.currentTask": { fr: "Tâche en cours", en: "Current task" },
  "focus.start": { fr: "Démarrer la session de focus", en: "Start focus session" },
  "focus.programme": { fr: "Programme", en: "Schedule" },
  "focus.locked": { fr: "Tâche verrouillée — cliquez sur Fin pour libérer", en: "Task locked — click End to release" },
  "focus.endSession": { fr: "Fin", en: "End" },
  "focus.restartSession": { fr: "Recommencer", en: "Restart" },
  "focus.selectToStart": { fr: "Sélectionnez une tâche pour la démarrer", en: "Select a task to start" },
  "focus.taskInProgress": { fr: "EN COURS", en: "IN PROGRESS" },
  "focus.duration": { fr: "Durée", en: "Duration" },
  "focus.youWillHave": { fr: "Vous aurez", en: "You will have" },
  "focus.noBreaks": { fr: "Aucune pause", en: "No breaks" },
  "focus.skipBreaks": { fr: "Sauter les pauses (mode hyperfocus)", en: "Skip breaks (hyperfocus mode)" },
  "focus.run": { fr: "Déroulé", en: "Run of show" },

  // Right sidebar
  "qn.placeholder": { fr: "Écrire une note rapide…", en: "Write a quick note…" },
  "qn.empty": { fr: "Aucune note. Cliquez sur + pour en ajouter.", en: "No notes yet. Click + to add one." },
  "qn.add": { fr: "Ajouter une note", en: "Add a note" },
  "qn.editDouble": { fr: "Double-cliquez pour modifier", en: "Double-click to edit" },

  // Events
  "event.new": { fr: "Nouvel événement", en: "New event" },
  "event.title": { fr: "Titre", en: "Title" },
  "event.titlePlaceholder": { fr: "Titre de l'événement", en: "Event title" },
  "event.calendar": { fr: "Calendrier", en: "Calendar" },
  "event.allDay": { fr: "Toute la journée", en: "All day" },
  "event.start": { fr: "Début", en: "Start" },
  "event.end": { fr: "Fin", en: "End" },
  "event.location": { fr: "Lieu", en: "Location" },
  "event.locationPlaceholder": { fr: "Adresse ou visioconférence…", en: "Address or video link…" },
  "event.participants": { fr: "Participants", en: "Attendees" },
  "event.participantsPlaceholder": { fr: "Ajouter une personne…", en: "Add a person…" },
  "event.notify": { fr: "Notifier", en: "Notify" },
  "event.repeat": { fr: "Répéter", en: "Repeat" },
  "event.repeat.none": { fr: "Ne pas répéter", en: "Doesn't repeat" },
  "event.repeat.daily": { fr: "Tous les jours", en: "Every day" },
  "event.repeat.weekly": { fr: "Toutes les semaines", en: "Every week" },
  "event.repeat.monthly": { fr: "Tous les mois", en: "Every month" },
  "event.repeat.yearly": { fr: "Tous les ans", en: "Every year" },
  "event.busy": { fr: "Disponibilité", en: "Availability" },
  "event.busy.busy": { fr: "Occupé", en: "Busy" },
  "event.busy.free": { fr: "Disponible", en: "Free" },
  "event.visibility": { fr: "Visibilité", en: "Visibility" },
  "event.visibility.default": { fr: "Par défaut", en: "Default" },
  "event.visibility.public": { fr: "Publique", en: "Public" },
  "event.visibility.private": { fr: "Privée", en: "Private" },

  // ── Music during focus (P23) ──
  "music.title": { fr: "Musique", en: "Music" },
  "music.integrationTitle": { fr: "Musique", en: "Music" },
  "music.limitedApi": { fr: "API limitée", en: "Limited API" },
  "music.connectIntro": { fr: "Reliez votre service de musique pour écouter vos propres playlists pendant le focus.", en: "Connect your music service to play your own playlists during focus." },
  "music.scopes": { fr: "OAuth — DPM ne demande que la lecture de vos playlists et le contrôle de la lecture. Déconnexion possible à tout moment (Loi 25 / PIPEDA).", en: "OAuth — DPM only requests reading your playlists and controlling playback. Disconnect anytime (Law 25 / PIPEDA)." },
  "music.svc.spotifyNote": { fr: "Lecture + repérage focus", en: "Playback + focus picks" },
  "music.svc.appleNote": { fr: "Lecture · repérage focus limité", en: "Playback · limited focus picks" },
  "music.svc.youtubeNote": { fr: "Intégration exploratoire · lecture limitée", en: "Exploratory · limited playback" },
  "music.volume": { fr: "Volume", en: "Volume" },
  "music.mute": { fr: "Couper le son", en: "Mute" },
  "music.unmute": { fr: "Rétablir le son", en: "Unmute" },
  "music.prev": { fr: "Précédent", en: "Previous" },
  "music.next": { fr: "Suivant", en: "Next" },
  "music.play": { fr: "Lecture", en: "Play" },
  "music.changePlaylist": { fr: "Changer de playlist", en: "Change playlist" },
  "music.yourPlaylists": { fr: "Vos playlists", en: "Your playlists" },
  "music.tracks": { fr: "titres", en: "tracks" },
  "music.focusFriendly": { fr: "Idéal focus", en: "Focus-friendly" },
  "music.focusFriendly.tip": { fr: "Repérée comme propice à la concentration, d'après les caractéristiques audio de vos titres.", en: "Flagged as concentration-friendly, based on your tracks' audio features." },
  "music.library": { fr: "Bibliothèque musicale", en: "Music library" },
  "music.connected": { fr: "Connecté", en: "Connected" },
  "music.disconnect": { fr: "Déconnecter", en: "Disconnect" },
  "music.connect": { fr: "Connecter", en: "Connect" },
  "music.caps.scoring": { fr: "Repérage focus actif (caractéristiques audio)", en: "Focus scoring on (audio features)" },
  "music.caps.noScoring": { fr: "Repérage focus indisponible pour ce service", en: "Focus scoring unavailable for this service" },
  "music.caps.full": { fr: "Lecture complète + repérage focus", en: "Full playback + focus picks" },
  "music.caps.limited": { fr: "Connecté · lecture indisponible", en: "Connected · playback unavailable" },
  "music.accountTier": { fr: "Type de compte (démo)", en: "Account type (demo)" },
  "music.tier.premium": { fr: "Premium", en: "Premium" },
  "music.tier.free": { fr: "Gratuit", en: "Free" },
  "music.sortedByFocus": { fr: "triées par focus", en: "sorted by focus" },
  "music.scoringUnavailable": { fr: "Le repérage focus n'est pas disponible pour ce service (Apple Music expose peu de données).", en: "Focus scoring isn't available for this service (Apple Music exposes limited data)." },
  "music.openInApp": { fr: "Ouvrir dans l'app", en: "Open in the app" },
  "music.degraded.freeTier": { fr: "Lecture indisponible — compte gratuit", en: "Playback unavailable — free account" },
  "music.degraded.freeTierDesc": { fr: "Le contrôle de la lecture nécessite un abonnement (ex. Spotify Premium). Vos playlists restent visibles.", en: "Controlling playback requires a subscription (e.g. Spotify Premium). Your playlists stay visible." },
  "music.degraded.noApi": { fr: "Lecture non disponible", en: "Playback not available" },
  "music.degraded.noApiDesc": { fr: "YouTube Music n'expose pas d'API de lecture officielle. Intégration exploratoire.", en: "YouTube Music exposes no official playback API. Exploratory integration." },
  "music.vignetteHidden": { fr: "Vignette musique masquée", en: "Music vignette hidden" },
  "music.show": { fr: "Afficher", en: "Show" },
  "music.hide": { fr: "Masquer la vignette", en: "Hide the vignette" },
  "music.expand": { fr: "Agrandir le lecteur", en: "Expand player" },
  "music.collapse": { fr: "Réduire le lecteur", en: "Collapse player" },
  "music.connectShort": { fr: "Connecter un service", en: "Connect a service" },
  "music.startWithSession": { fr: "Démarrer la musique avec la session", en: "Start music with the session" },
  "music.startWithSessionDesc": { fr: "La lecture démarre quand vous lancez un focus.", en: "Playback starts when you start a focus." },
  "music.muteOnBreak": { fr: "Couper pendant les pauses", en: "Mute during breaks" },
  "music.showVignette": { fr: "Afficher la vignette dans la session de concentration", en: "Show the vignette in the focus session" },
  "music.showVignetteDesc": { fr: "Le mini-lecteur « lecture en cours » apparaît dans le module Focus.", en: "The \"now playing\" mini-player appears in the Focus module." },
  "music.openLibrary": { fr: "Ouvrir la bibliothèque", en: "Open the library" },

  // ── View layout customization (P24) ──
  "layout.customize": { fr: "Personnaliser", en: "Customize" },
  "layout.done": { fr: "Terminé", en: "Done" },
  "layout.viewSurface": { fr: "la vue", en: "the view" },
  "layout.group": { fr: "Panneaux de la vue", en: "View panels" },
  "layout.required": { fr: "Requis", en: "Required" },
  "layout.requiredTip": { fr: "Panneau requis — déplaçable mais non masquable", en: "Required panel — movable but can't be hidden" },
  "layout.dragReorder": { fr: "Glisser pour réordonner", en: "Drag to reorder" },
  "layout.hidePanel": { fr: "Masquer le panneau", en: "Hide panel" },
  "layout.moveLeft": { fr: "Déplacer à gauche", en: "Move left" },
  "layout.moveRight": { fr: "Déplacer à droite", en: "Move right" },
  "layout.editHint": { fr: "Réorganisez, masquez ou réordonnez les panneaux. Glissez ⠿ ou utilisez les flèches.", en: "Rearrange, hide or reorder panels. Drag ⠿ or use the arrows." },
  "focusLayout.queue.label": { fr: "File de focus", en: "Focus queue" },
  "focusLayout.queue.desc": { fr: "Vos tâches de session, réordonnables", en: "Your session tasks, reorderable" },
  "focusLayout.session.label": { fr: "Session de focus", en: "Focus session" },
  "focusLayout.session.desc": { fr: "Minuteur & déroulé — cœur de la vue", en: "Timer & run-of-show — the view's core" },
  "focusLayout.schedule.label": { fr: "Agenda", en: "Schedule" },
  "focusLayout.schedule.desc": { fr: "Votre programme du jour", en: "Today's schedule" },
  "focusLayout.music.label": { fr: "Musique", en: "Music" },
  "focusLayout.music.desc": { fr: "Lecteur musique pendant le focus", en: "Music player during focus" },
};

function tt(key, lang) {
  const row = DICT[key];
  if (!row) return key;
  return row[lang] || row.fr || key;
}

/* Returns a translation function `t(key)` bound to the current lang.
   Re-renders the calling component when the lang flips. */
function useT() {
  const [lang, setLang] = useState(() =>
    (typeof window !== "undefined" && window.__dpmLang) || "fr"
  );
  useEffect(() => {
    const handler = (e) => setLang(e.detail || "fr");
    window.addEventListener("dpm-lang-change", handler);
    return () => window.removeEventListener("dpm-lang-change", handler);
  }, []);
  return (key) => tt(key, lang);
}

function useLang() {
  const [lang, setLang] = useState(() =>
    (typeof window !== "undefined" && window.__dpmLang) || "fr"
  );
  useEffect(() => {
    const handler = (e) => setLang(e.detail || "fr");
    window.addEventListener("dpm-lang-change", handler);
    return () => window.removeEventListener("dpm-lang-change", handler);
  }, []);
  return lang;
}

Object.assign(window, { useT, useLang, ttKey: tt });
