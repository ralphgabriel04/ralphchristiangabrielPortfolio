/* global React, Icons, Button, Card, Badge, Input, Checkbox, Switch, Logo, cn,
          useState, useEffect, useLang, applyAccent */

/* ============================================================
   PAGE 3 — ONBOARDING (/onboarding)  ·  rebuilt

   A guided, two-pane onboarding. The LEFT pane is the step the
   user acts on; the RIGHT pane is a *live "Tomorrow" preview*
   that fills up as they answer — connect a calendar and meetings
   appear, add tasks and they land in a tray, choose your rhythm
   and they snap onto your energy peak. It ends on a celebratory
   reward screen showing the day DPM just built.

   Authored bilingually (FR default / EN) via useLang().
============================================================ */

const ACCENT_TRIPLE = {
  violet: "263 70% 60%", blue: "217 85% 60%", teal: "174 62% 47%",
  green: "142 65% 48%", amber: "38 90% 52%", orange: "20 88% 55%",
  rose: "330 78% 58%", red: "0 80% 58%",
};
const accentTriple = (id) => ACCENT_TRIPLE[id] || ACCENT_TRIPLE.violet;

const SPACE_COLORS = ["217 85% 60%", "174 62% 47%", "330 78% 58%", "38 90% 52%", "142 65% 48%", "263 70% 60%"];

const PERSONAS = [
  {
    id: "founder", icon: Icons.Briefcase, accent: "blue", chrono: "lark",
    fr: { t: "Entrepreneur", d: "Plusieurs projets, des décisions en rafale.", spaces: ["Travail", "Clients", "Perso"],
          tasks: ["Préparer le pitch investisseurs", "Rappeler le client Lyon", "Relire le contrat"], goal: "Lancer la nouvelle offre ce trimestre" },
    en: { t: "Founder", d: "Many projects, decisions back-to-back.", spaces: ["Work", "Clients", "Personal"],
          tasks: ["Prep the investor pitch", "Call the Lyon client", "Review the contract"], goal: "Launch the new offer this quarter" },
  },
  {
    id: "student", icon: Icons.GraduationCap, accent: "amber", chrono: "owl",
    fr: { t: "Étudiant·e", d: "Cours, projets et vie — sans clash.", spaces: ["Cours", "Projets", "Perso"],
          tasks: ["Réviser le partiel de stats", "Rendre le rapport de projet", "Réserver la salle de révision"], goal: "Valider mon semestre avec mention" },
    en: { t: "Student", d: "Classes, projects and life — no clashes.", spaces: ["Classes", "Projects", "Personal"],
          tasks: ["Revise for the stats exam", "Submit the project report", "Book the study room"], goal: "Pass my semester with honors" },
  },
  {
    id: "manager", icon: Icons.Users, accent: "violet", chrono: "third",
    fr: { t: "Manager", d: "1-1, deep work et équipe à protéger.", spaces: ["Équipe", "Deep work", "Perso"],
          tasks: ["Préparer les 1-1 de la semaine", "Relire la PR de Sarah", "Caler le point produit"], goal: "Livrer la refonte sans heures sup" },
    en: { t: "Manager", d: "1-1s, deep work and a team to protect.", spaces: ["Team", "Deep work", "Personal"],
          tasks: ["Prep this week's 1-1s", "Review Sarah's PR", "Schedule the product sync"], goal: "Ship the redesign without overtime" },
  },
  {
    id: "freelancer", icon: Icons.Compass, accent: "teal", chrono: "lark",
    fr: { t: "Freelance", d: "Plusieurs clients, une seule semaine.", spaces: ["Client A", "Client B", "Perso"],
          tasks: ["Envoyer le devis au prospect", "Finir la maquette client", "Facturer le mois"], goal: "Atteindre 5 k€ de CA ce mois" },
    en: { t: "Freelancer", d: "Several clients, one single week.", spaces: ["Client A", "Client B", "Personal"],
          tasks: ["Send the prospect quote", "Finish the client mockup", "Invoice the month"], goal: "Hit €5k revenue this month" },
  },
];

const CHRONOS = [
  { id: "lark",  icon: Icons.Sunrise, peak: [9, 11],  path: "M0,72 C15,22 26,14 36,26 C56,56 76,82 100,90 L100,100 L0,100 Z",
    fr: { t: "Alouette", d: "Pic d'énergie le matin, couché tôt.", hrs: "05:00 – 21:00", peak: "matin" },
    en: { t: "Early bird", d: "Energy peak in the morning, early to bed.", hrs: "05:00 – 21:00", peak: "morning" } },
  { id: "third", icon: Icons.Sun,     peak: [12, 14], path: "M0,82 C20,62 36,26 50,21 C64,26 80,62 100,84 L100,100 L0,100 Z",
    fr: { t: "Troisième oiseau", d: "Au mieux au milieu de la journée.", hrs: "07:00 – 23:00", peak: "midi" },
    en: { t: "Third bird", d: "Best around the middle of the day.", hrs: "07:00 – 23:00", peak: "midday" } },
  { id: "owl",   icon: Icons.Moon,    peak: [16, 18], path: "M0,90 C26,82 46,56 66,26 C76,18 88,18 100,30 L100,100 L0,100 Z",
    fr: { t: "Hibou", d: "Tu travailles mieux le soir.", hrs: "10:00 – 02:00", peak: "fin de journée" },
    en: { t: "Night owl", d: "You work better in the evening.", hrs: "10:00 – 02:00", peak: "evening" } },
];

const WATCHES = [
  { id: "apple", name: "Apple Watch" }, { id: "garmin", name: "Garmin" },
  { id: "fitbit", name: "Fitbit" }, { id: "oura", name: "Oura" },
];

const HABIT_SEEDS = [
  { id: "sport", icon: Icons.Run,    fr: "Sport", en: "Exercise" },
  { id: "read",  icon: Icons.Book,   fr: "Lecture", en: "Reading" },
  { id: "medit", icon: Icons.Brain,  fr: "Méditation", en: "Meditation" },
  { id: "water", icon: Icons.Heart,  fr: "Bien-être", en: "Wellness" },
];

const ACCENTS = [
  { id: "violet" }, { id: "blue" }, { id: "teal" }, { id: "green" },
  { id: "amber" }, { id: "orange" }, { id: "rose" }, { id: "red" },
];

/* Sample meetings revealed once a calendar is connected. */
const MEETINGS = {
  fr: [{ t: "Stand-up équipe", at: 9, dur: 0.5 }, { t: "1:1 Sarah", at: 14, dur: 1 }, { t: "Point produit", at: 16.5, dur: 0.5 }],
  en: [{ t: "Team stand-up", at: 9, dur: 0.5 }, { t: "1:1 Sarah", at: 14, dur: 1 }, { t: "Product sync", at: 16.5, dur: 0.5 }],
};

/* ── Bilingual UI strings ── */
const L = {
  fr: {
    skip: "Passer", previous: "Précédent", next: "Suivant", finish: "Entrer dans DPM",
    stepOf: (n, N) => `Étape ${n} sur ${N}`,
    steps: [
      { t: "Profil", s: "Qui es-tu ? On adapte l'app autour de toi." },
      { t: "Calendriers", s: "Connecte tes agendas — DPM les unifie." },
      { t: "Tes Espaces", s: "Sépare tes mondes. Une couleur par contexte." },
      { t: "Premières tâches", s: "Pose 3 choses à faire. On les placera." },
      { t: "Ton objectif", s: "Une intention pour donner un cap à ta semaine." },
      { t: "Ton rythme", s: "Quand es-tu au top ? On planifie autour." },
      { t: "À ton image", s: "Une couleur, deux réglages, et c'est parti." },
    ],
    personaTitle: "Pour commencer, qui es-tu ?",
    personaHint: "On pré-remplit tes espaces, tâches et rythme. Tout est modifiable.",
    nameLabel: "Ton prénom", namePh: "Camille",
    nameHint: "On l'utilise pour personnaliser ton espace et ton avatar.",
    nameReq: "Indique ton prénom pour continuer.",
    required: "Requis", optional: "Optionnel",
    estLeft: "~2 min restantes", estAlmost: "Moins d'une minute",
    calMore: "Tu pourras en connecter d'autres depuis les réglages.",
    connect: "Connecter", connected: "Connecté",
    spacesHint: "Les Espaces filtrent calendriers, tâches et objectifs. Active ceux qui te parlent.",
    addSpace: "Ajouter un espace",
    tasksHint: "Commence petit. Tu pourras tout planifier ensuite.",
    tasksPh: ["Préparer la maquette du sprint", "Rappeler le client", "Réserver le restaurant"],
    goalLabel: "Mon objectif principal",
    goalPh: "Ex. Lancer le produit en juin",
    goalSuggest: "Suggestions",
    goalSeeds: ["Lancer le produit ce trimestre", "Reprendre le sport 3×/semaine", "Finir le side-project"],
    habitLabel: "Démarre une habitude (optionnel)",
    chronoLabel: "Ton chronotype",
    watchLabel: "Ou laisse DPM l'apprendre tout seul",
    watchHint: "Connecte ta montre — DPM lira ton sommeil et affinera ton chronotype automatiquement.",
    watchDone: "Connectée · DPM affinera ton pic au fil des nuits.",
    hoursLabel: "Tes heures de travail", start: "Début", end: "Fin",
    daysLabel: "Jours actifs",
    accentLabel: "Ta couleur d'accent",
    accentHint: "Toute l'app se recolore en direct.",
    notifLabel: "Rappels intelligents", notifDesc: "Au bon moment, jamais du spam.",
    prefs: [
      { l: "Pauses automatiques", d: "15 min entre les réunions" },
      { l: "Bloc focus", d: "2 h protégées sur ton pic d'énergie" },
      { l: "Mode IA", d: "Suggestions de planning intelligentes" },
    ],
    // preview
    pvTomorrow: "Demain", pvDate: "Jeu. 12 juin", pvUnplanned: "À planifier",
    pvEnergy: "Énergie", pvGoal: "Objectif", pvFocus: "Focus", pvConnect: "Connecte un agenda pour voir tes réunions",
    pvEmpty: "Ta journée se construit ici, à chaque étape.",
    // reward
    rwBadge: "C'est prêt", rwTitle: "Voici ta journée de demain.",
    rwSub: "DPM a placé tes tâches sur ton pic d'énergie, posé tes pauses et protégé ton focus. Tu n'as plus qu'à vivre la journée.",
    rwStatTasks: "tâches placées", rwStatFocus: "de focus protégé", rwStatPeak: (p) => `calées sur ton pic du ${p}`,
    rwGoalOn: "Ton objectif est en vue :",
  },
  en: {
    skip: "Skip", previous: "Back", next: "Next", finish: "Enter DPM",
    stepOf: (n, N) => `Step ${n} of ${N}`,
    steps: [
      { t: "Profile", s: "Who are you? We'll shape the app around you." },
      { t: "Calendars", s: "Connect your calendars — DPM unifies them." },
      { t: "Your Spaces", s: "Separate your worlds. One color per context." },
      { t: "First tasks", s: "Drop 3 things to do. We'll place them." },
      { t: "Your goal", s: "One intention to give your week a direction." },
      { t: "Your rhythm", s: "When are you at your best? We plan around it." },
      { t: "Make it yours", s: "A color, two toggles, and you're in." },
    ],
    personaTitle: "To get started, who are you?",
    personaHint: "We pre-fill your spaces, tasks and rhythm. Everything stays editable.",
    nameLabel: "Your first name", namePh: "Camille",
    nameHint: "We use it to personalize your workspace and avatar.",
    nameReq: "Enter your first name to continue.",
    required: "Required", optional: "Optional",
    estLeft: "~2 min left", estAlmost: "Less than a minute",
    calMore: "You can connect more later from settings.",
    connect: "Connect", connected: "Connected",
    spacesHint: "Spaces filter calendars, tasks and goals. Turn on the ones that fit.",
    addSpace: "Add a space",
    tasksHint: "Start small. You can schedule everything afterwards.",
    tasksPh: ["Prep the sprint mockup", "Call the client", "Book the restaurant"],
    goalLabel: "My main goal",
    goalPh: "e.g. Launch the product in June",
    goalSuggest: "Suggestions",
    goalSeeds: ["Launch the product this quarter", "Get back to sport 3×/week", "Finish the side-project"],
    habitLabel: "Start a habit (optional)",
    chronoLabel: "Your chronotype",
    watchLabel: "Or let DPM learn it for you",
    watchHint: "Connect your watch — DPM reads your sleep and refines your chronotype automatically.",
    watchDone: "Connected · DPM will refine your peak over a few nights.",
    hoursLabel: "Your working hours", start: "Start", end: "End",
    daysLabel: "Active days",
    accentLabel: "Your accent color",
    accentHint: "The whole app recolors, live.",
    notifLabel: "Smart reminders", notifDesc: "At the right moment, never spam.",
    prefs: [
      { l: "Automatic breaks", d: "15 min between meetings" },
      { l: "Focus block", d: "2 h protected on your energy peak" },
      { l: "AI mode", d: "Smart planning suggestions" },
    ],
    pvTomorrow: "Tomorrow", pvDate: "Thu, Jun 12", pvUnplanned: "To schedule",
    pvEnergy: "Energy", pvGoal: "Goal", pvFocus: "Focus", pvConnect: "Connect a calendar to see your meetings",
    pvEmpty: "Your day builds here, step by step.",
    rwBadge: "All set", rwTitle: "Here's your day tomorrow.",
    rwSub: "DPM placed your tasks on your energy peak, set your breaks and protected your focus. All that's left is to live the day.",
    rwStatTasks: "tasks placed", rwStatFocus: "of protected focus", rwStatPeak: (p) => `on your ${p} peak`,
    rwGoalOn: "Your goal is in sight:",
  },
};

const DAYS = { fr: ["L", "M", "M", "J", "V", "S", "D"], en: ["M", "T", "W", "T", "F", "S", "S"] };

const TOTAL = 7;
const IDX = { PROFILE: 0, CAL: 1, SPACES: 2, TASKS: 3, GOAL: 4, RHYTHM: 5, PERSO: 6 };

function OnboardingPage({ setRoute }) {
  const lang = (typeof useLang === "function") ? useLang() : "fr";
  const T = L[lang] || L.fr;
  const [profile, updateProfile] = (typeof useProfile === "function") ? useProfile() : [{}, () => {}];

  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [data, setData] = useState({
    firstName: (profile && profile.firstName) || "",
    persona: null,
    calendars: { google: false, microsoft: false, apple: false },
    spaces: [],
    tasks: ["", "", ""],
    goal: "",
    habit: null,
    chrono: "third",
    watch: null,
    hours: { start: "09:00", end: "18:00" },
    days: [true, true, true, true, true, false, false],
    accent: "violet",
    notif: true,
    prefs: [true, true, true],
  });
  const set = (patch) => setData(d => ({ ...d, ...patch }));

  // Persona selection seeds the rest of the flow. We auto-advance only once a
  // first name is present (it's required for the account); otherwise we just
  // select and let the user fill the name + tap Next.
  const choosePersona = (p) => {
    const loc = p[lang];
    set({
      persona: p.id,
      accent: p.accent,
      chrono: p.chrono,
      spaces: loc.spaces.map((name, i) => ({ id: p.id + i, name, color: SPACE_COLORS[i % SPACE_COLORS.length], on: true })),
      tasks: loc.tasks.slice(0, 3),
      goal: loc.goal,
    });
    if ((data.firstName || "").trim()) setTimeout(() => setStep(IDX.CAL), 420);
  };

  // Persist the full captured profile, apply the accent, and enter the app.
  const finish = () => {
    try {
      window.__dpmAccent = data.accent; applyAccent?.(data.accent);
      window.dispatchEvent(new CustomEvent("dpm-accent-change", { detail: data.accent }));
    } catch (e) {}
    updateProfile({
      firstName: (data.firstName || "").trim(),
      onboarded: true,
      calendars: data.calendars, spaces: data.spaces,
      tasks: data.tasks.filter(t => t && t.trim()), goal: data.goal, habit: data.habit,
      chrono: data.chrono, watch: data.watch, hours: data.hours, days: data.days,
      accent: data.accent, notif: data.notif, prefs: data.prefs,
    });
    setRoute("home");
  };

  const accent = accentTriple(data.accent);

  if (done) return <OnbReward data={data} lang={lang} T={T} accent={accent} onFinish={finish} />;

  return (
    <div className="min-h-full flex flex-col lg:grid lg:grid-cols-[1fr_minmax(380px,440px)]"
         style={{ "--onb-accent": accent }}>
      {/* LEFT — steps */}
      <div className="flex flex-col min-h-full">
        {/* Top bar + progress */}
        <div className="px-8 pt-7">
          <div className="max-w-xl mx-auto w-full">
            <div className="flex items-center justify-between">
              <Logo size={28} />
              <button onClick={() => setRoute("home")}
                className="text-[12.5px] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors">
                {T.skip}
              </button>
            </div>
            <div className="flex items-center gap-1.5 mt-7">
              {Array.from({ length: TOTAL }).map((_, n) => (
                <div key={n} className="h-1 flex-1 rounded-full overflow-hidden bg-[hsl(var(--muted))]">
                  <div className="h-full rounded-full transition-all duration-500"
                       style={{ width: n < step ? "100%" : n === step ? "55%" : "0%", background: `hsl(${accent})` }} />
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-baseline gap-2.5">
              <span className="text-[12px] font-mono font-semibold" style={{ color: `hsl(${accent})` }}>
                {String(step + 1).padStart(2, "0")}
              </span>
              <span className="text-[13px] font-medium">{T.steps[step].t}</span>
              <span className="ml-auto flex items-center gap-3 text-[12px] text-[hsl(var(--muted-foreground))] tabular-nums">
                <span className="hidden sm:flex items-center gap-1.5">
                  <Icons.Clock size={12} /> {step >= TOTAL - 2 ? T.estAlmost : T.estLeft}
                </span>
                <span>{T.stepOf(step + 1, TOTAL)}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex items-start lg:items-center justify-center px-8 py-8">
          <div className="w-full max-w-xl">
            <h2 className="text-[26px] font-bold tracking-tight leading-tight">{T.steps[step].t === T.steps[0].t && step === 0 ? T.personaTitle : T.steps[step].t}</h2>
            <p className="text-[14px] text-[hsl(var(--muted-foreground))] mt-1.5 mb-7" style={{ textWrap: "balance" }}>{T.steps[step].s}</p>

            {step === IDX.PROFILE && <StepProfile data={data} set={set} lang={lang} T={T} accent={accent} onPick={choosePersona} />}
            {step === IDX.CAL && <StepCalendars data={data} set={set} T={T} accent={accent} />}
            {step === IDX.SPACES && <StepSpaces data={data} set={set} T={T} accent={accent} />}
            {step === IDX.TASKS && <StepTasks data={data} set={set} T={T} accent={accent} />}
            {step === IDX.GOAL && <StepGoal data={data} set={set} lang={lang} T={T} accent={accent} />}
            {step === IDX.RHYTHM && <StepRhythm data={data} set={set} lang={lang} T={T} accent={accent} />}
            {step === IDX.PERSO && <StepPerso data={data} set={set} T={T} accent={accent} />}
          </div>
        </div>

        {/* Footer nav */}
        <div className="border-t border-[hsl(var(--border))] px-8 py-5">
          <div className="max-w-xl mx-auto flex items-center justify-between">
            <Button variant="ghost" disabled={step === 0} onClick={() => setStep(s => Math.max(0, s - 1))}><Icons.ChevronLeft size={16} /> {T.previous}</Button>
            <div className="hidden sm:flex items-center gap-1.5">
              {Array.from({ length: TOTAL }).map((_, n) => (
                <span key={n} className="w-1.5 h-1.5 rounded-full transition-all"
                      style={{ background: n === step ? `hsl(${accent})` : "hsl(var(--muted))", transform: n === step ? "scale(1.3)" : "scale(1)" }} />
              ))}
            </div>
            {step < TOTAL - 1
              ? <Button onClick={() => setStep(s => s + 1)}
                        disabled={step === IDX.PROFILE && !(data.firstName || "").trim()}
                        title={step === IDX.PROFILE && !(data.firstName || "").trim() ? T.nameReq : undefined}
                        style={{ background: `hsl(${accent})` }}>{T.next} <Icons.ChevronRight size={16} /></Button>
              : <Button onClick={() => setDone(true)}
                        style={{ background: `hsl(${accent})` }}>{T.next} <Icons.ArrowRight size={16} /></Button>}
          </div>
        </div>
      </div>

      {/* RIGHT — live preview */}
      <div className="hidden lg:flex flex-col border-l border-[hsl(var(--border))] bg-[hsl(var(--muted)/0.25)] p-8 items-center justify-center">
        <OnbPreview data={data} lang={lang} T={T} step={step} accent={accent} />
      </div>
    </div>
  );
}

/* ============================================================
   STEP 1 — Profile / persona
============================================================ */
function StepProfile({ data, set, lang, T, accent, onPick }) {
  const nameMissing = !(data.firstName || "").trim();
  return (
    <div>
      {/* First name — required for the account / avatar / greeting */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-1.5">
          <label htmlFor="onb-name" className="text-[12.5px] font-medium">{T.nameLabel}</label>
          <span className="text-[10.5px] font-medium px-1.5 py-0.5 rounded-full" style={{ background: `hsl(${accent} / 0.12)`, color: `hsl(${accent})` }}>{T.required}</span>
        </div>
        <Input id="onb-name" value={data.firstName} placeholder={T.namePh} className="h-12 text-[15px]"
               autoFocus name="given-name" autoComplete="given-name"
               onChange={e => set({ firstName: e.target.value })} />
        <p className="mt-1.5 text-[11.5px] text-[hsl(var(--muted-foreground))]">{T.nameHint}</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {PERSONAS.map(p => {
          const on = data.persona === p.id;
          return (
            <button key={p.id} onClick={() => onPick(p)}
              className={cn("flex flex-col items-start gap-2.5 p-4 rounded-[12px] border-2 text-left transition-all",
                on ? "shadow-sm" : "border-[hsl(var(--border))] hover:bg-[hsl(var(--accent)/0.4)]")}
              style={on ? { borderColor: `hsl(${accent})`, background: `hsl(${accent} / 0.06)` } : {}}>
              <div className="w-11 h-11 rounded-[10px] flex items-center justify-center"
                   style={{ background: on ? `hsl(${accent} / 0.15)` : "hsl(var(--muted))", color: on ? `hsl(${accent})` : "hsl(var(--muted-foreground))" }}>
                <p.icon size={22} />
              </div>
              <div>
                <div className="text-[14.5px] font-semibold">{p[lang].t}</div>
                <div className="text-[12px] text-[hsl(var(--muted-foreground))] leading-snug mt-0.5">{p[lang].d}</div>
              </div>
            </button>
          );
        })}
      </div>
      <p className="text-[12px] text-[hsl(var(--muted-foreground))] text-center mt-5 flex items-center justify-center gap-1.5">
        {nameMissing && data.persona
          ? <><Icons.AlertTriangle size={13} style={{ color: `hsl(${accent})` }} /> {T.nameReq}</>
          : <><Icons.Sparkles size={13} style={{ color: `hsl(${accent})` }} /> {T.personaHint}</>}
      </p>
    </div>
  );
}

/* ============================================================
   STEP 2 — Calendars
============================================================ */
function StepCalendars({ data, set, T, accent }) {
  const provs = [
    { id: "google", icon: <Icons.Google size={20} />, name: "Google Calendar", d: "Two-way sync, events and invitations" },
    { id: "microsoft", icon: <Icons.Microsoft size={20} />, name: "Microsoft Outlook", d: "365 calendar + Teams meetings" },
    { id: "apple", icon: <Icons.Apple size={20} />, name: "Apple Calendar", d: "iCloud · CalDAV" },
  ];
  return (
    <div className="space-y-3">
      {provs.map(p => {
        const on = data.calendars[p.id];
        return (
          <Card key={p.id} padding="p-4" className="flex items-center gap-4 transition-colors"
                style={on ? { borderColor: `hsl(${accent} / 0.5)`, background: `hsl(${accent} / 0.04)` } : {}}>
            <div className="w-10 h-10 rounded-[8px] bg-[hsl(var(--muted))] flex items-center justify-center flex-shrink-0">{p.icon}</div>
            <div className="flex-1 min-w-0">
              <div className="text-[14px] font-semibold">{p.name}</div>
              <div className="text-[12px] text-[hsl(var(--muted-foreground))]">{p.d}</div>
            </div>
            {on
              ? <Badge variant="success" dot>{T.connected}</Badge>
              : <Button variant="outline" size="sm" onClick={() => set({ calendars: { ...data.calendars, [p.id]: true } })}>{T.connect}</Button>}
          </Card>
        );
      })}
      <div className="text-[12px] text-[hsl(var(--muted-foreground))] text-center pt-1">{T.calMore}</div>
    </div>
  );
}

/* ============================================================
   STEP 3 — Spaces
============================================================ */
function StepSpaces({ data, set, T, accent }) {
  const toggle = (id) => set({ spaces: data.spaces.map(s => s.id === id ? { ...s, on: !s.on } : s) });
  const rename = (id, name) => set({ spaces: data.spaces.map(s => s.id === id ? { ...s, name } : s) });
  const addSpace = () => {
    const i = data.spaces.length;
    set({ spaces: [...data.spaces, { id: "x" + Date.now(), name: "", color: SPACE_COLORS[i % SPACE_COLORS.length], on: true }] });
  };
  return (
    <div className="space-y-2.5">
      {data.spaces.map(s => (
        <div key={s.id}
          className={cn("flex items-center gap-3 p-3 rounded-[10px] border transition-all",
            s.on ? "border-[hsl(var(--border))] bg-[hsl(var(--card))]" : "border-[hsl(var(--border))] opacity-50")}>
          <span className="w-3.5 h-3.5 rounded-full flex-shrink-0" style={{ background: `hsl(${s.color})` }} />
          <input value={s.name} onChange={e => rename(s.id, e.target.value)} placeholder="…"
                 className="flex-1 bg-transparent text-[14px] font-medium focus:outline-none" />
          <Switch checked={s.on} onChange={() => toggle(s.id)} />
        </div>
      ))}
      {data.spaces.length < 6 && (
        <button onClick={addSpace}
          className="w-full flex items-center justify-center gap-2 p-2.5 rounded-[10px] border border-dashed border-[hsl(var(--border))] text-[13px] text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent)/0.4)] transition-colors">
          <Icons.Plus size={15} /> {T.addSpace}
        </button>
      )}
      <p className="text-[12px] text-[hsl(var(--muted-foreground))] pt-1 flex items-start gap-1.5">
        <Icons.Layers size={13} className="mt-0.5 flex-shrink-0" style={{ color: `hsl(${accent})` }} /> {T.spacesHint}
      </p>
    </div>
  );
}

/* ============================================================
   STEP 4 — First tasks
============================================================ */
function StepTasks({ data, set, T, accent }) {
  return (
    <div className="space-y-3">
      {data.tasks.map((t, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full border-2 flex items-center justify-center text-[12px] font-semibold flex-shrink-0"
               style={{ borderColor: t ? `hsl(${accent})` : "hsl(var(--muted-foreground) / 0.35)", color: t ? `hsl(${accent})` : "hsl(var(--muted-foreground))" }}>
            {i + 1}
          </div>
          <Input placeholder={T.tasksPh[i]} value={t} className="flex-1 h-11"
                 onChange={e => set({ tasks: data.tasks.map((x, j) => j === i ? e.target.value : x) })} />
        </div>
      ))}
      <div className="rounded-[8px] p-3 text-[12px] flex items-start gap-2"
           style={{ background: `hsl(${accent} / 0.08)`, border: `1px solid hsl(${accent} / 0.2)` }}>
        <Icons.Sparkles size={14} className="mt-0.5 flex-shrink-0" style={{ color: `hsl(${accent})` }} />
        <span>{T.tasksHint}</span>
      </div>
    </div>
  );
}

/* ============================================================
   STEP 5 — Goal (+ optional habit)
============================================================ */
function StepGoal({ data, set, lang, T, accent }) {
  return (
    <div className="space-y-6">
      <div>
        <div className="text-[12.5px] font-medium mb-2 flex items-center gap-1.5">
          <Icons.Target size={14} style={{ color: `hsl(${accent})` }} /> {T.goalLabel}
        </div>
        <Input value={data.goal} placeholder={T.goalPh} className="h-12 text-[15px]"
               onChange={e => set({ goal: e.target.value })} />
        <div className="flex flex-wrap gap-2 mt-3">
          {T.goalSeeds.map(g => (
            <button key={g} onClick={() => set({ goal: g })}
              className="px-3 py-1.5 rounded-full text-[12px] border border-[hsl(var(--border))] hover:bg-[hsl(var(--accent)/0.4)] transition-colors">
              {g}
            </button>
          ))}
        </div>
      </div>
      <div>
        <div className="text-[12.5px] font-medium mb-2.5">{T.habitLabel}</div>
        <div className="grid grid-cols-4 gap-2.5">
          {HABIT_SEEDS.map(h => {
            const on = data.habit === h.id;
            return (
              <button key={h.id} onClick={() => set({ habit: on ? null : h.id })}
                className={cn("flex flex-col items-center gap-1.5 py-3 rounded-[10px] border-2 transition-all",
                  on ? "" : "border-[hsl(var(--border))] hover:bg-[hsl(var(--accent)/0.4)]")}
                style={on ? { borderColor: `hsl(${accent})`, background: `hsl(${accent} / 0.06)`, color: `hsl(${accent})` } : {}}>
                <h.icon size={20} />
                <span className="text-[11.5px] font-medium">{h[lang]}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   STEP 6 — Rhythm: chronotype + watch + hours + days
============================================================ */
function StepRhythm({ data, set, lang, T, accent }) {
  return (
    <div className="space-y-6">
      <div>
        <div className="text-[12.5px] font-medium mb-2.5">{T.chronoLabel}</div>
        <div className="space-y-2.5">
          {CHRONOS.map(c => {
            const on = data.chrono === c.id;
            return (
              <button key={c.id} onClick={() => set({ chrono: c.id })}
                className={cn("w-full flex items-center gap-3.5 p-3.5 rounded-[10px] border-2 text-left transition-all",
                  on ? "" : "border-[hsl(var(--border))] hover:bg-[hsl(var(--accent)/0.3)]")}
                style={on ? { borderColor: `hsl(${accent})`, background: `hsl(${accent} / 0.06)` } : {}}>
                <div className="w-11 h-11 rounded-[10px] flex items-center justify-center flex-shrink-0"
                     style={{ background: on ? `hsl(${accent} / 0.15)` : "hsl(var(--muted))", color: on ? `hsl(${accent})` : "hsl(var(--muted-foreground))" }}>
                  <c.icon size={21} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[14.5px] font-semibold">{c[lang].t}</div>
                  <div className="text-[12px] text-[hsl(var(--muted-foreground))]">{c[lang].d}</div>
                </div>
                <div className="text-[11.5px] font-mono text-[hsl(var(--muted-foreground))] hidden sm:block">{c[lang].hrs}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Connect watch — auto-learns chronotype */}
      <div className="rounded-[10px] border border-[hsl(var(--border))] p-4">
        <div className="flex items-center gap-2 text-[12.5px] font-medium">
          <Icons.Activity size={14} style={{ color: `hsl(${accent})` }} /> {T.watchLabel}
        </div>
        <p className="text-[11.5px] text-[hsl(var(--muted-foreground))] mt-1 leading-snug">{T.watchHint}</p>
        <div className="flex flex-wrap gap-2 mt-3">
          {WATCHES.map(w => {
            const on = data.watch === w.id;
            return (
              <button key={w.id} onClick={() => set({ watch: on ? null : w.id })}
                className={cn("px-3 py-1.5 rounded-full text-[12px] font-medium border-2 transition-all",
                  on ? "" : "border-[hsl(var(--border))] hover:bg-[hsl(var(--accent)/0.4)]")}
                style={on ? { borderColor: `hsl(${accent})`, background: `hsl(${accent} / 0.08)`, color: `hsl(${accent})` } : {}}>
                {w.name}
              </button>
            );
          })}
        </div>
        {data.watch && (
          <div className="mt-3 text-[11.5px] flex items-center gap-1.5" style={{ color: `hsl(${accent})` }}>
            <Icons.Check size={13} stroke={3} /> {T.watchDone}
          </div>
        )}
      </div>

      {/* Hours + days */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="text-[11px] text-[hsl(var(--muted-foreground))] mb-1">{T.start}</div>
          <Input value={data.hours.start} onChange={e => set({ hours: { ...data.hours, start: e.target.value } })} />
        </div>
        <div>
          <div className="text-[11px] text-[hsl(var(--muted-foreground))] mb-1">{T.end}</div>
          <Input value={data.hours.end} onChange={e => set({ hours: { ...data.hours, end: e.target.value } })} />
        </div>
      </div>
      <div>
        <div className="text-[12.5px] font-medium mb-2">{T.daysLabel}</div>
        <div className="flex gap-2">
          {DAYS[lang].map((d, i) => {
            const on = data.days[i];
            return (
              <button key={i} onClick={() => set({ days: data.days.map((x, j) => j === i ? !x : x) })}
                className="flex-1 h-11 rounded-[8px] text-[13px] font-semibold transition-colors"
                style={on ? { background: `hsl(${accent})`, color: "#fff" } : { background: "hsl(var(--muted))", color: "hsl(var(--muted-foreground))" }}>
                {d}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   STEP 7 — Make it yours: accent + notifications + prefs
============================================================ */
function StepPerso({ data, set, T, accent }) {
  return (
    <div className="space-y-6">
      <div>
        <div className="text-[12.5px] font-medium mb-1">{T.accentLabel}</div>
        <p className="text-[11.5px] text-[hsl(var(--muted-foreground))] mb-3">{T.accentHint}</p>
        <div className="flex flex-wrap gap-2.5">
          {ACCENTS.map(a => {
            const on = data.accent === a.id;
            const tri = accentTriple(a.id);
            return (
              <button key={a.id} onClick={() => set({ accent: a.id })}
                className="w-9 h-9 rounded-full flex items-center justify-center transition-transform"
                style={{ background: `hsl(${tri})`, transform: on ? "scale(1.1)" : "scale(1)", boxShadow: on ? `0 0 0 3px hsl(var(--background)), 0 0 0 5px hsl(${tri})` : "none" }}>
                {on && <Icons.Check size={16} stroke={3} className="text-white" />}
              </button>
            );
          })}
        </div>
      </div>

      <label className="flex items-center gap-3 p-3.5 rounded-[10px] border border-[hsl(var(--border))] cursor-pointer">
        <div className="w-9 h-9 rounded-[8px] flex items-center justify-center flex-shrink-0"
             style={{ background: `hsl(${accent} / 0.12)`, color: `hsl(${accent})` }}><Icons.Bell size={17} /></div>
        <div className="flex-1">
          <div className="text-[13.5px] font-medium">{T.notifLabel}</div>
          <div className="text-[11.5px] text-[hsl(var(--muted-foreground))]">{T.notifDesc}</div>
        </div>
        <Switch checked={data.notif} onChange={() => set({ notif: !data.notif })} />
      </label>

      <div className="rounded-[10px] border border-[hsl(var(--border))] p-4 space-y-3.5">
        {T.prefs.map((p, i) => {
          const ic = [Icons.Coffee, Icons.Target, Icons.Sparkles][i];
          return (
            <label key={i} className="flex items-start gap-3 cursor-pointer">
              <Checkbox checked={data.prefs[i]} onChange={() => set({ prefs: data.prefs.map((x, j) => j === i ? !x : x) })} className="mt-0.5" />
              <div className="flex-1">
                <div className="text-[13px] font-medium flex items-center gap-1.5">{ic && React.createElement(ic, { size: 13, style: { color: `hsl(${accent})` } })} {p.l}</div>
                <div className="text-[11.5px] text-[hsl(var(--muted-foreground))]">{p.d}</div>
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}

/* ============================================================
   LIVE PREVIEW — "Tomorrow", fills up as the user answers
============================================================ */
function buildDay(data, lang, step, { complete = false } = {}) {
  const enabledSpaces = data.spaces.filter(s => s.on);
  const connected = Object.values(data.calendars).filter(Boolean).length;
  const tasks = data.tasks.filter(t => t.trim());
  const chrono = CHRONOS.find(c => c.id === data.chrono) || CHRONOS[1];
  const scheduled = complete || step >= IDX.RHYTHM;
  const showFocus = (complete || step >= IDX.PERSO) && data.prefs[1];

  const occupied = [];                                   // [{ s, e }]
  const overlaps = (s, e) => occupied.some(o => s < o.e && e > o.s);
  const blocks = [];
  const tray = [];

  // 1) Focus block sits on the energy peak.
  if (showFocus) {
    const s = chrono.peak[0], e = s + 2;
    occupied.push({ s, e });
    blocks.push({ t: lang === "fr" ? "Focus profond" : "Deep focus", at: s, dur: 2, kind: "focus" });
  }

  // 2) Meetings, revealed once a calendar is connected — skip any that clash with focus.
  const meetings = (connected >= 1 || complete)
    ? MEETINGS[lang].slice(0, complete ? 3 : Math.min(connected + 1, 3))
    : [];
  meetings.forEach(m => {
    const e = m.at + m.dur;
    if (!overlaps(m.at, e)) { occupied.push({ s: m.at, e }); blocks.push({ ...m, kind: "meeting" }); }
  });

  // 3) Tasks drop into the first free hour, preferring slots from the peak onward.
  const order = [];
  for (let h = Math.max(8, chrono.peak[0]); h <= 17; h++) order.push(h);
  for (let h = 8; h < chrono.peak[0]; h++) order.push(h);
  tasks.forEach((t, i) => {
    const color = enabledSpaces.length ? enabledSpaces[i % enabledSpaces.length].color : accentTriple(data.accent);
    if (!scheduled) { tray.push({ t, color }); return; }
    let slot = order.find(h => !overlaps(h, h + 1));
    if (slot == null) slot = 8 + i;
    occupied.push({ s: slot, e: slot + 1 });
    blocks.push({ t, at: slot, dur: 1, kind: "task", color });
  });

  blocks.sort((a, b) => a.at - b.at);
  return { blocks, tray, chrono, scheduled, connected, enabledSpaces };
}

function OnbPreview({ data, lang, T, step, accent }) {
  const { blocks, tray, chrono, scheduled, connected } = buildDay(data, lang, step);
  const H = 360, top = 8, span = 10; // 08:00–18:00
  const y = (h) => ((h - top) / span) * H;
  const showEnergy = step >= IDX.RHYTHM;
  const isEmpty = !data.persona && connected === 0 && blocks.length === 0 && tray.length === 0;

  return (
    <div className="w-full max-w-[380px]">
      <Card padding="p-0" className="overflow-hidden shadow-xl">
        {/* Goal ribbon */}
        {data.goal.trim() && (
          <div className="px-4 py-2.5 flex items-center gap-2 text-[12px] font-medium border-b border-[hsl(var(--border))]"
               style={{ background: `hsl(${accent} / 0.1)`, color: `hsl(${accent})` }}>
            <Icons.Target size={14} className="flex-shrink-0" />
            <span className="truncate">{data.goal}</span>
          </div>
        )}
        {/* Header */}
        <div className="px-4 pt-4 pb-3 flex items-center justify-between">
          <div>
            <div className="text-[15px] font-bold tracking-tight">{T.pvTomorrow}</div>
            <div className="text-[11.5px] text-[hsl(var(--muted-foreground))]">{T.pvDate}</div>
          </div>
          {showEnergy && (
            <Badge variant="muted" className="gap-1.5" style={{ background: `hsl(${accent} / 0.12)`, color: `hsl(${accent})` }}>
              <Icons.Zap size={11} /> {chrono[lang].peak}
            </Badge>
          )}
        </div>

        {/* Timeline */}
        <div className="relative px-4 pb-4">
          <div className="relative" style={{ height: H }}>
            {/* Energy curve */}
            {showEnergy && (
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full" style={{ opacity: 0.13 }}>
                <path d={chrono.path} fill={`hsl(${accent})`} />
              </svg>
            )}
            {/* Hour gridlines */}
            {[8, 10, 12, 14, 16, 18].map(h => (
              <div key={h} className="absolute left-8 right-0 border-t border-dashed border-[hsl(var(--border)/0.7)]"
                   style={{ top: y(h) }}>
                <span className="absolute -top-2 -left-8 text-[10px] font-mono text-[hsl(var(--muted-foreground))] w-7 text-right">
                  {String(h).padStart(2, "0")}h
                </span>
              </div>
            ))}
            {/* Blocks */}
            <div className="absolute left-8 right-0 top-0 bottom-0">
              {blocks.map((b, i) => {
                const t = y(b.at), ht = Math.max(22, (b.dur / span) * H - 3);
                if (b.kind === "meeting")
                  return (
                    <div key={i} className="absolute left-0 right-1 rounded-[7px] border border-[hsl(var(--border))] bg-[hsl(var(--muted)/0.6)] px-2 py-1 overflow-hidden"
                         style={{ top: t, height: ht }}>
                      <div className="text-[11px] font-medium truncate text-[hsl(var(--foreground))]">{b.t}</div>
                      <div className="text-[9.5px] text-[hsl(var(--muted-foreground))] font-mono">{fmt(b.at)}</div>
                    </div>
                  );
                if (b.kind === "focus")
                  return (
                    <div key={i} className="absolute left-0 right-1 rounded-[7px] px-2 py-1 overflow-hidden border-2 border-dashed flex items-center gap-1.5"
                         style={{ top: t, height: ht, borderColor: `hsl(${accent} / 0.5)`, background: `hsl(${accent} / 0.07)` }}>
                      <Icons.Target size={12} style={{ color: `hsl(${accent})` }} />
                      <span className="text-[11px] font-semibold" style={{ color: `hsl(${accent})` }}>{b.t}</span>
                    </div>
                  );
                return (
                  <div key={i} className="absolute left-0 right-1 rounded-[7px] px-2 py-1 overflow-hidden onb-snap"
                       style={{ top: t, height: ht, background: `hsl(${b.color} / 0.16)`, borderLeft: `3px solid hsl(${b.color})` }}>
                    <div className="text-[11px] font-medium truncate" style={{ color: `hsl(${b.color})` }}>{b.t}</div>
                    <div className="text-[9.5px] text-[hsl(var(--muted-foreground))] font-mono">{fmt(b.at)}</div>
                  </div>
                );
              })}
            </div>
            {/* Empty hint */}
            {isEmpty && (
              <div className="absolute inset-0 flex items-center justify-center text-center px-6">
                <p className="text-[12px] text-[hsl(var(--muted-foreground))]">{T.pvEmpty}</p>
              </div>
            )}
            {!isEmpty && connected === 0 && blocks.length === 0 && (
              <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 text-center">
                <p className="text-[11.5px] text-[hsl(var(--muted-foreground))]">{T.pvConnect}</p>
              </div>
            )}
          </div>

          {/* Unscheduled tray */}
          {tray.length > 0 && (
            <div className="mt-2 pt-3 border-t border-[hsl(var(--border))]">
              <div className="text-[10.5px] font-semibold uppercase tracking-wide text-[hsl(var(--muted-foreground))] mb-2">{T.pvUnplanned}</div>
              <div className="space-y-1.5">
                {tray.map((t, i) => (
                  <div key={i} className="flex items-center gap-2 px-2.5 py-1.5 rounded-[7px] bg-[hsl(var(--muted)/0.5)]">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: `hsl(${t.color})` }} />
                    <span className="text-[11.5px] truncate">{t.t}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

function fmt(h) {
  const hh = Math.floor(h), mm = Math.round((h - hh) * 60);
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

/* ============================================================
   REWARD — the day DPM just built, with confetti
============================================================ */
function OnbReward({ data, lang, T, accent, onFinish }) {
  const { blocks, chrono } = buildDay(data, lang, IDX.PERSO, { complete: true });
  const tasksPlaced = data.tasks.filter(t => t.trim()).length;
  const focusH = data.prefs[1] ? 2 : 0;
  const H = 300, top = 8, span = 10;
  const y = (h) => ((h - top) / span) * H;

  return (
    <div className="min-h-full flex items-center justify-center p-6 relative overflow-hidden" style={{ "--onb-accent": accent }}>
      <OnbConfetti accent={accent} />
      <style>{`
        @keyframes onbPop { 0%{opacity:0;transform:scale(.9) translateY(10px)} 100%{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes onbFall { 0%{transform:translateY(-20px) rotate(0);opacity:1} 100%{transform:translateY(105vh) rotate(540deg);opacity:.9} }
        @keyframes onbSnap { 0%{opacity:0;transform:translateX(8px)} 100%{opacity:1;transform:translateX(0)} }
        .onb-snap{ animation: onbSnap .45s ease both; }
        .onb-pop{ animation: onbPop .5s cubic-bezier(.2,.8,.2,1) both; }
      `}</style>

      <div className="w-full max-w-3xl grid lg:grid-cols-[1fr_300px] gap-8 items-center relative z-10">
        {/* Left — message */}
        <div className="onb-pop">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[12px] font-semibold mb-5"
               style={{ background: `hsl(${accent} / 0.14)`, color: `hsl(${accent})` }}>
            <Icons.Sparkles size={13} /> {T.rwBadge}
          </div>
          <h1 className="text-[34px] font-bold tracking-tight leading-[1.1]" style={{ textWrap: "balance" }}>{T.rwTitle}</h1>
          <p className="text-[14.5px] text-[hsl(var(--muted-foreground))] mt-3 leading-relaxed max-w-md" style={{ textWrap: "pretty" }}>{T.rwSub}</p>

          {/* Stat chips */}
          <div className="flex flex-wrap gap-2.5 mt-6">
            <RwStat icon={Icons.CheckSquare} accent={accent} big={tasksPlaced} label={T.rwStatTasks} />
            {focusH > 0 && <RwStat icon={Icons.Target} accent={accent} big={`${focusH}h`} label={T.rwStatFocus} />}
            <RwStat icon={Icons.Zap} accent={accent} label={T.rwStatPeak(chrono[lang].peak)} />
          </div>

          {data.goal.trim() && (
            <div className="mt-5 flex items-center gap-2.5 text-[13px]">
              <Icons.Target size={15} style={{ color: `hsl(${accent})` }} />
              <span className="text-[hsl(var(--muted-foreground))]">{T.rwGoalOn}</span>
              <span className="font-semibold">{data.goal}</span>
            </div>
          )}

          <Button size="lg" className="mt-8 px-7" onClick={onFinish}
                  style={{ background: `hsl(${accent})` }}>{T.finish} <Icons.ArrowRight size={16} /></Button>
        </div>

        {/* Right — the built day */}
        <div className="onb-pop hidden lg:block" style={{ animationDelay: ".1s" }}>
          <Card padding="p-0" className="overflow-hidden shadow-2xl">
            <div className="px-4 py-2.5 flex items-center gap-2 text-[12px] font-medium border-b border-[hsl(var(--border))]"
                 style={{ background: `hsl(${accent} / 0.1)`, color: `hsl(${accent})` }}>
              <Icons.Sparkles size={13} /> {T.pvTomorrow} · {T.pvDate}
            </div>
            <div className="relative px-4 py-4" style={{ height: H + 32 }}>
              <div className="relative" style={{ height: H }}>
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full" style={{ opacity: 0.13 }}>
                  <path d={chrono.path} fill={`hsl(${accent})`} />
                </svg>
                {[8, 11, 14, 17].map(h => (
                  <div key={h} className="absolute left-8 right-0 border-t border-dashed border-[hsl(var(--border)/0.7)]" style={{ top: y(h) }}>
                    <span className="absolute -top-2 -left-8 text-[10px] font-mono text-[hsl(var(--muted-foreground))] w-7 text-right">{String(h).padStart(2, "0")}h</span>
                  </div>
                ))}
                <div className="absolute left-8 right-0 top-0 bottom-0">
                  {blocks.map((b, i) => {
                    const t = y(b.at), ht = Math.max(20, (b.dur / span) * H - 3);
                    const isTask = b.kind === "task", isFocus = b.kind === "focus";
                    const col = isTask ? b.color : accent;
                    return (
                      <div key={i} className="absolute left-0 right-1 rounded-[7px] px-2 py-1 overflow-hidden onb-snap"
                           style={{
                             top: t, height: ht, animationDelay: `${.15 + i * .08}s`,
                             ...(b.kind === "meeting"
                               ? { border: "1px solid hsl(var(--border))", background: "hsl(var(--muted)/0.6)" }
                               : isFocus
                                 ? { border: `2px dashed hsl(${accent} / 0.5)`, background: `hsl(${accent} / 0.07)` }
                                 : { background: `hsl(${col} / 0.16)`, borderLeft: `3px solid hsl(${col})` }),
                           }}>
                        <div className="text-[11px] font-medium truncate" style={{ color: b.kind === "meeting" ? "hsl(var(--foreground))" : `hsl(${col})` }}>{b.t}</div>
                        <div className="text-[9.5px] text-[hsl(var(--muted-foreground))] font-mono">{fmt(b.at)}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function RwStat({ icon: Ic, accent, big, label }) {
  return (
    <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-[10px] border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
      <div className="w-8 h-8 rounded-[8px] flex items-center justify-center flex-shrink-0"
           style={{ background: `hsl(${accent} / 0.12)`, color: `hsl(${accent})` }}><Ic size={16} /></div>
      <div className="leading-tight">
        {big != null && <span className="text-[15px] font-bold mr-1 tabular-nums">{big}</span>}
        <span className="text-[12px] text-[hsl(var(--muted-foreground))]">{label}</span>
      </div>
    </div>
  );
}

function OnbConfetti({ accent }) {
  const cols = [`hsl(${accent})`, "hsl(38 90% 55%)", "hsl(142 65% 52%)", "hsl(330 78% 60%)", "hsl(217 85% 62%)"];
  const bits = Array.from({ length: 36 }).map((_, i) => ({
    left: Math.random() * 100, delay: Math.random() * 0.5, dur: 2.6 + Math.random() * 1.4,
    col: cols[i % cols.length], size: 6 + Math.random() * 6, rad: Math.random() > 0.5 ? "50%" : "2px",
  }));
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {bits.map((b, i) => (
        <span key={i} className="absolute top-0"
              style={{ left: `${b.left}%`, width: b.size, height: b.size, background: b.col, borderRadius: b.rad,
                       animation: `onbFall ${b.dur}s linear ${b.delay}s 2 forwards` }} />
      ))}
    </div>
  );
}

Object.assign(window, { OnboardingPage });
