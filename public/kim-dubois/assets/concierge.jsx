/* ============================================================
   Assistant-concierge — clavardage guidé (bulle flottante)
   Flux à boutons : rendez-vous · portfolio · section · question · contact
   Finalité = contact réel (courriel pré-rempli + appel). Sans serveur.
   ============================================================ */

const CG = {
  fr: {
    bubble: "Discutons", teaser: "Une question ? 🐾",
    headTitle: "Discutons ! 🐾", online: "Réponse rapide",
    close: "Fermer", restart: "Recommencer", skip: "Passer",
    again: "Que puis-je faire d’autre pour vous ?",
    inputPh: "Écrivez un message…", send: "Envoyer",
    attach: "Joindre un fichier", removeFile: "Retirer", fileWord: "fichier(s)",
    welcome: "Bonjour ! Je suis l’assistante de Kim. Comment puis-je vous aider ?",
    opt: { rdv: "📅 Prendre un rendez-vous", folio: "🎨 Voir le portfolio", faq: "❓ Questions fréquentes", sec: "🧭 Trouver une section", q: "✍️ Poser une question", call: "📞 Contacter directement" },
    seanceQ: "Avec plaisir ! Quel type de séance vous intéresse ?",
    seances: ["Extérieur", "Studio", "Exposition féline", "Avant le pont de l’arc-en-ciel", "Commerciale", "Sur mesure"],
    animalQ: "Parfait. Pour quel compagnon ?",
    animals: ["Un chien", "Un chat", "Plusieurs", "Autre"],
    whenQ: "Quand souhaiteriez-vous la séance ?",
    whens: ["Le plus tôt possible", "Dans 1 à 3 mois", "Plus tard cette année", "Je ne sais pas encore"],
    regionQ: "Dans quelle région êtes-vous ?",
    regions: ["Montréal", "Rive-Nord (Laval, Blainville…)", "Rive-Sud (Longueuil, Brossard…)", "Ailleurs au Québec"],
    nameQ: "Comment vous appelez-vous ?", namePh: "Votre prénom",
    mailQ: "Et votre courriel, pour que Kim vous réponde ?", mailPh: "vous@exemple.com",
    noteQ: "Un mot sur votre animal ou votre projet ? (facultatif)", notePh: "Ex. chien réactif, séance en forêt…",
    recapIntro: "Voici votre demande, prête à partir :",
    recapSend: "📧 Envoyer à Kim", recapCall: "📞 Appeler Kim",
    secQ: "Vers quelle section souhaitez-vous aller ?",
    sections: [["Portfolio", "portfolio"], ["Séances & tarifs", "seances"], ["Distinctions", "distinctions"], ["Blog", "blog"], ["Boutique", "produits"], ["Espace client", "espace-client"], ["FAQ", "faq"], ["Contact", "contact"]],
    faqQ: "Voici les questions qu’on me pose le plus souvent. Touchez celle qui vous intéresse :",
    faqItems: [
      { q: "Y a-t-il un dépôt à verser ?", a: "Oui, un dépôt de 50 % confirme votre date ; le solde est payé le jour de la séance." },
      { q: "Et s’il pleut ?", a: "Les séances extérieures sont reportées sans frais jusqu’à une belle météo." },
      { q: "Mon animal est réactif ou anxieux", a: "C’est la spécialité de Kim, diplômée en comportement canin : lieu, rythme et distances adaptés pour une séance sécuritaire et positive." },
      { q: "Quels sont les délais ?", a: "Votre galerie privée est livrée en ligne sous 2 à 3 semaines." },
      { q: "Vous déplacez-vous ?", a: "Oui, partout au Québec. Des frais peuvent s’appliquer hors de la région de Montréal." },
    ],
    faqMore: "📖 Voir toute la FAQ",
    secGo: "C’est parti, je vous y amène ! 🐾",
    folioGo: "Je vous ouvre le portfolio complet. 🎨",
    qQ: "Bien sûr ! Quelle est votre question ?", qPh: "Votre question…",
    qThanks: "Merci ! Vous pouvez l’envoyer à Kim ou l’appeler directement :",
    callIntro: "Voici comment joindre Kim directement :",
    freeThanks: "Merci pour votre message ! Le plus simple : l’envoyer à Kim ou l’appeler.",
    mailSubject: "Demande de séance (site web)",
    labels: { seance: "Séance", animal: "Compagnon", when: "Échéance", region: "Région", name: "Prénom", mail: "Courriel", note: "Note" },
  },
  en: {
    bubble: "Chat", teaser: "A question? 🐾",
    headTitle: "Let’s chat! 🐾", online: "Quick reply",
    close: "Close", restart: "Start over", skip: "Skip",
    again: "What else can I help you with?",
    inputPh: "Type a message…", send: "Send",
    attach: "Attach a file", removeFile: "Remove", fileWord: "file(s)",
    welcome: "Hi! I’m Kim’s assistant. How can I help you?",
    opt: { rdv: "📅 Book a session", folio: "🎨 View the portfolio", faq: "❓ Frequently asked questions", sec: "🧭 Find a section", q: "✍️ Ask a question", call: "📞 Contact directly" },
    seanceQ: "Happy to help! What kind of session are you interested in?",
    seances: ["Outdoor", "Studio", "Cat show", "Before the Rainbow Bridge", "Commercial", "Custom"],
    animalQ: "Great. For which companion?",
    animals: ["A dog", "A cat", "Several", "Other"],
    whenQ: "When would you like the session?",
    whens: ["As soon as possible", "In 1–3 months", "Later this year", "Not sure yet"],
    regionQ: "Which area are you in?",
    regions: ["Montréal", "North Shore (Laval, Blainville…)", "South Shore (Longueuil, Brossard…)", "Elsewhere in Québec"],
    nameQ: "What’s your name?", namePh: "Your first name",
    mailQ: "And your email, so Kim can reply?", mailPh: "you@example.com",
    noteQ: "A word about your animal or project? (optional)", notePh: "E.g. reactive dog, forest session…",
    recapIntro: "Here’s your request, ready to send:",
    recapSend: "📧 Send to Kim", recapCall: "📞 Call Kim",
    secQ: "Which section would you like to go to?",
    sections: [["Portfolio", "portfolio"], ["Sessions & pricing", "seances"], ["Awards", "distinctions"], ["Blog", "blog"], ["Shop", "produits"], ["Client area", "espace-client"], ["FAQ", "faq"], ["Contact", "contact"]],
    faqQ: "Here are the questions I get asked most. Tap the one you’re curious about:",
    faqItems: [
      { q: "Is there a deposit?", a: "Yes, a 50% deposit confirms your date; the balance is paid on the day of the session." },
      { q: "What if it rains?", a: "Outdoor sessions are rescheduled at no charge until the weather is nice." },
      { q: "My animal is reactive or anxious", a: "That’s Kim’s specialty, certified in canine behaviour: location, pace and distances adapted for a safe, positive session." },
      { q: "What are the delivery times?", a: "Your private gallery is delivered online within 2 to 3 weeks." },
      { q: "Do you travel?", a: "Yes, anywhere in Québec. Fees may apply outside the Montréal area." },
    ],
    faqMore: "📖 See the full FAQ",
    secGo: "Here we go, taking you there! 🐾",
    folioGo: "Opening the full portfolio. 🎨",
    qQ: "Of course! What’s your question?", qPh: "Your question…",
    qThanks: "Thanks! You can send it to Kim or call directly:",
    callIntro: "Here’s how to reach Kim directly:",
    freeThanks: "Thanks for your message! Easiest is to send it to Kim or give a call.",
    mailSubject: "Session request (website)",
    labels: { seance: "Session", animal: "Companion", when: "Timing", region: "Area", name: "Name", mail: "Email", note: "Note" },
  },
};

function cgEsc(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/\n/g, "<br>");
}

function Concierge() {
  const lang = window.__KDLANG === "en" ? "en" : "fr";
  const T = CG[lang];
  const C = window.KD.contact;
  const [open, setOpen] = useState(false);
  const [teaser, setTeaser] = useState(false);
  const [msgs, setMsgs] = useState([]);
  const [opts, setOpts] = useState([]);
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState(null); // {key, ph, type, optional}
  const [text, setText] = useState("");
  const data = useRef({});
  const bodyRef = useRef(null);
  const [files, setFiles] = useState([]);
  const attachRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setTeaser(true), 6000);
    return () => clearTimeout(t);
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle("cg-open", open);
    return () => document.documentElement.classList.remove("cg-open");
  }, [open]);
  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [msgs, typing, opts, input]);

  const pushUser = (t, fls) => setMsgs((m) => [...m, { from: "user", text: t, files: fls && fls.length ? fls : undefined }]);
  const botSay = useCallback((items, then) => {
    setOpts([]); setInput(null); setTyping(true);
    const list = Array.isArray(items) ? items : [items];
    let i = 0;
    const next = () => {
      const tx = list[i];
      if (tx != null) setMsgs((m) => [...m, { from: "bot", text: tx }]);
      i++;
      if (i < list.length) setTimeout(next, 520);
      else { setTyping(false); then && then(); }
    };
    setTimeout(next, 540);
  }, []);

  const reduce = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ----- Étapes -----
  const start = useCallback(() => {
    data.current = {}; setMsgs([]); setInput(null);
    botSay(T.welcome, setMainOpts);
  }, [T, botSay]);

  // Menu principal — réaffiché après chaque action pour continuer la conversation
  const setMainOpts = () => setOpts([
    { l: T.opt.rdv, go: () => stepSeance() },
    { l: T.opt.folio, go: () => { botSay(T.folioGo); setTimeout(() => { window.KDnav && window.KDnav("portfolio"); showMenu(); }, 600); } },
    { l: T.opt.faq, go: () => stepFaq() },
    { l: T.opt.sec, go: () => stepSection() },
    { l: T.opt.q, go: () => stepQuestion() },
    { l: T.opt.call, go: () => stepContact() },
  ]);
  const showMenu = () => botSay(T.again, setMainOpts);

  const askOptions = (q, arr, key, then) => botSay(q, () =>
    setOpts(arr.map((a) => ({ l: a, go: () => { data.current[key] = a; pushUser(a); then(); } }))));

  const stepSeance = () => askOptions(T.seanceQ, T.seances, "seance", stepAnimal);
  const stepAnimal = () => askOptions(T.animalQ, T.animals, "animal", stepWhen);
  const stepWhen = () => askOptions(T.whenQ, T.whens, "when", stepRegion);
  const stepRegion = () => askOptions(T.regionQ, T.regions, "region", stepName);
  const stepName = () => botSay(T.nameQ, () => setInput({ key: "name", ph: T.namePh, type: "text", next: stepMail }));
  const stepMail = () => botSay(T.mailQ, () => setInput({ key: "mail", ph: T.mailPh, type: "email", next: stepNote }));
  const stepNote = () => botSay(T.noteQ, () => setInput({ key: "note", ph: T.notePh, type: "text", optional: true, next: recap }));

  const recap = () => {
    const d = data.current, L = T.labels;
    const lines = [
      [L.seance, d.seance], [L.animal, d.animal], [L.when, d.when],
      [L.region, d.region], [L.name, d.name], [L.mail, d.mail], [L.note, d.note],
    ].filter(([, v]) => v);
    const recapText = T.recapIntro + "\n" + lines.map(([k, v]) => "• " + k + " : " + v).join("\n");
    botSay(recapText, () => setOpts([
      { l: T.recapSend, go: () => sendEmail(lines) },
      { l: T.recapCall, go: () => callKim() },
      { l: T.restart, go: () => start() },
    ]));
  };

  const sendEmail = (lines) => {
    const body = lines.map(([k, v]) => k + " : " + v).join("\n");
    window.location.href = "mailto:" + C.email + "?subject=" + encodeURIComponent(T.mailSubject) + "&body=" + encodeURIComponent(body);
    showMenu();
  };
  const callKim = () => { window.location.href = "tel:" + C.phone.replace(/\s/g, ""); showMenu(); };

  const stepSection = () => botSay(T.secQ, () => setOpts(
    T.sections.map(([l, id]) => ({ l, go: () => { pushUser(l); botSay(T.secGo); setTimeout(() => { window.KDnav && window.KDnav(id); showMenu(); }, 700); } }))));

  // FAQ rapide : réponses directes en bulle, puis retour au menu FAQ
  const faqOpts = () => setOpts(
    T.faqItems.map((it) => ({ l: it.q, go: () => { pushUser(it.q); botSay(it.a, faqOpts); } })).concat([
      { l: T.faqMore, go: () => { pushUser(T.faqMore); botSay(T.secGo); setTimeout(() => { window.KDnav && window.KDnav("faq"); showMenu(); }, 700); } },
      { l: T.restart, go: () => start() },
    ]));
  const stepFaq = () => botSay(T.faqQ, faqOpts);

  const stepQuestion = () => botSay(T.qQ, () => setInput({ key: "question", ph: T.qPh, type: "text", next: () => {
    botSay(T.qThanks, () => setOpts([
      { l: T.recapSend, go: () => { window.location.href = "mailto:" + C.email + "?subject=" + encodeURIComponent(T.mailSubject) + "&body=" + encodeURIComponent(data.current.question || ""); showMenu(); } },
      { l: T.recapCall, go: () => callKim() },
      { l: T.restart, go: () => start() },
    ]));
  } }));

  const stepContact = () => botSay(T.callIntro, () => setOpts([
    { l: "📧 " + C.email, go: () => { window.location.href = "mailto:" + C.email; showMenu(); } },
    { l: "📞 " + C.phone, go: () => { callKim(); } },
    { l: T.restart, go: () => start() },
  ]));

  const submitInput = (e) => {
    e && e.preventDefault();
    const val = text.trim();
    const fls = files;
    if (input) {
      if (!val && !fls.length && !input.optional) return;
      data.current[input.key] = val || (fls.length ? "(" + fls.length + " " + T.fileWord + ")" : "—");
      pushUser(val || ("📎 " + fls.length + " " + T.fileWord), fls);
      const nx = input.next; setText(""); setFiles([]); setInput(null); nx && nx();
    } else {
      if (!val && !fls.length) return;
      pushUser(val || ("📎 " + fls.length + " " + T.fileWord), fls); setText(""); setFiles([]);
      botSay(T.freeThanks, () => setOpts([
        { l: T.recapSend, go: () => { window.location.href = "mailto:" + C.email + "?subject=" + encodeURIComponent(T.mailSubject) + "&body=" + encodeURIComponent(val + (fls.length ? "\n[" + fls.length + " " + T.fileWord + "]" : "")); showMenu(); } },
        { l: T.recapCall, go: () => callKim() },
        { l: T.restart, go: () => start() },
      ]));
    }
  };

  const onAttach = (e) => {
    const list = [...(e.target.files || [])];
    list.forEach((file) => {
      const id = Math.random().toString(36).slice(2);
      if (file.type.startsWith("image")) {
        const r = new FileReader();
        r.onload = () => setFiles((p) => [...p, { id, name: file.name, type: "image", url: r.result }]);
        r.readAsDataURL(file);
      } else {
        setFiles((p) => [...p, { id, name: file.name, type: "file", url: null }]);
      }
    });
    e.target.value = "";
  };
  const removeFile = (id) => setFiles((p) => p.filter((f) => f.id !== id));

  const toggleOpen = () => {
    setOpen((o) => {
      const n = !o; setTeaser(false);
      if (n && msgs.length === 0) setTimeout(start, 120);
      return n;
    });
  };

  return (
    <React.Fragment>
      {!open && (
        <div className="cg-launch">
          {teaser && <button className="cg-teaser" onClick={toggleOpen}>{T.teaser}</button>}
          <button className="cg-bubble" onClick={toggleOpen} aria-label={T.headTitle}>
            <span aria-hidden="true">💬</span>
          </button>
        </div>
      )}

      {open && (
        <section className="cg-panel" role="dialog" aria-modal="false" aria-label={T.headTitle}>
          <header className="cg-head">
            <div className="cg-head-id">
              <span className="cg-avatar"><Monogram size={26} /></span>
              <div className="cg-head-txt">
                <strong>{T.headTitle}</strong>
                <span className="cg-online"><i></i>{T.online}</span>
              </div>
            </div>
            <button className="cg-x" onClick={toggleOpen} aria-label={T.close}>×</button>
          </header>

          <div className="cg-body" ref={bodyRef}>
            {msgs.map((m, i) => (
              <div key={i} className={"cg-msg " + m.from}>
                {m.text ? <span className="cg-txt">{m.text}</span> : null}
                {m.files && m.files.length > 0 && (
                  <div className="cg-files">
                    {m.files.map((f, k) => f.type === "image"
                      ? <img key={k} className="cg-file-img" src={f.url} alt={f.name} title={f.name} />
                      : <span key={k} className="cg-file-doc"><b aria-hidden="true">📄</b>{f.name}</span>)}
                  </div>
                )}
              </div>
            ))}
            {typing && <div className="cg-msg bot"><span className="cg-typing"><i></i><i></i><i></i></span></div>}
            {!typing && opts.length > 0 && (
              <div className="cg-opts">
                {opts.map((o, i) => (
                  <button key={i} className="cg-opt" onClick={o.go}>{o.l}</button>
                ))}
              </div>
            )}
            {!typing && input && input.optional && (
              <div className="cg-opts"><button className="cg-opt ghost" onClick={() => { const nx = input.next; pushUser(T.skip); setInput(null); nx && nx(); }}>{T.skip}</button></div>
            )}
          </div>

          {files.length > 0 && (
            <div className="cg-pending">
              {files.map((f) => (
                <div className="cg-chip" key={f.id}>
                  {f.type === "image" ? <img src={f.url} alt="" /> : <span className="cg-chip-ico" aria-hidden="true">📄</span>}
                  <span className="cg-chip-name">{f.name}</span>
                  <button type="button" className="cg-chip-x" onClick={() => removeFile(f.id)} aria-label={T.removeFile}>×</button>
                </div>
              ))}
            </div>
          )}
          <form className="cg-input" onSubmit={submitInput}>
            <label className="cg-attach" title={T.attach}>
              <input ref={attachRef} type="file" multiple accept="image/*,.pdf,.doc,.docx,.txt" onChange={onAttach} hidden />
              <span aria-hidden="true">📎</span>
            </label>
            <input type={input && input.type === "email" ? "email" : "text"}
              value={text} onChange={(e) => setText(e.target.value)}
              placeholder={input ? input.ph : T.inputPh} aria-label={input ? input.ph : T.inputPh} />
            <button type="submit" className="cg-send" aria-label={T.send}>➤</button>
          </form>
        </section>
      )}
    </React.Fragment>
  );
}

Object.assign(window, { Concierge });