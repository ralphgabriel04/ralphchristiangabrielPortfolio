/* ============================================================
   Mode administrateur — magasin d'état (contexte)
   Liberté encadrée : contenu + apparence sûrs, jamais cassables.
   Persistance navigateur (maquette) → CMS en production.
   ============================================================ */

const EditorCtx = React.createContext(null);
const useEditor = () => React.useContext(EditorCtx);

/* Sections réordonnables / masquables (en-tête & pied de page exclus) */
const SECTION_DEFS = [
  { id: "hero",         fr: "Héros",                          en: "Hero" },
  { id: "counters",     fr: "Compteurs",                      en: "Counters" },
  { id: "empathy",      fr: "Message d’empathie",             en: "Empathy message" },
  { id: "awards",       fr: "Distinctions",                   en: "Awards" },
  { id: "partners",     fr: "Partenaires",                    en: "Partners" },
  { id: "portfolio",    fr: "Portfolio",                      en: "Portfolio" },
  { id: "about",        fr: "À propos",                       en: "About" },
  { id: "process",      fr: "Comment ça se passe",            en: "How it works" },
  { id: "packages",     fr: "Séances & forfaits",             en: "Sessions & packages" },
  { id: "rainbow",      fr: "Avant le pont de l’arc-en-ciel", en: "Before the Rainbow Bridge" },
  { id: "testimonials", fr: "Témoignages",                    en: "Testimonials" },
  { id: "products",     fr: "Produits & œuvres",              en: "Products & artwork" },
  { id: "clientarea",   fr: "Espace client / galeries",        en: "Client area / galleries" },
  { id: "blog",         fr: "Blogue",                         en: "Blog" },
  { id: "travel",       fr: "Prochains déplacements",         en: "Upcoming travel" },
  { id: "faq",          fr: "FAQ",                            en: "FAQ" },
  { id: "contact",      fr: "Contact",                        en: "Contact" },
  { id: "newsletter",   fr: "Infolettre",                     en: "Newsletter" },
];

/* Apparence par défaut = choix de Kim (doré primaire / bleu secondaire) */
const DEFAULT_APPEARANCE = {
  theme: "light",
  titleFont: "Cormorant Garamond",
  textScale: 1,     // 0.9 – 1.15
  radius: 16,       // 4 – 22 (px, --r-lg)
  heroH: 88,        // 64 – 100 (vh)
  anim: true,       // animations d'apparition activées
  animStyle: "dynamique",// "doux" | "dynamique"
  animReplay: true, // rejouer à chaque entrée/sortie au scroll
};

const DEFAULT_PALETTE = ["#C9A24B", "#A8842F", "#45758A", "#2E4E5C", "#1C1A17", "#F7F6F4"];

const TITLE_FONT_STACKS = {
  "Cormorant Garamond": '"Cormorant Garamond", Georgia, serif',
  "Playfair Display": '"Playfair Display", Georgia, serif',
  "Fraunces": '"Fraunces", Georgia, serif',
};

const STORE_KEY = "kd-editor-v1";

/* Historique : clés capturées dans les instantanés (annuler / rétablir / restaurer) */
const HIST_KEYS = ["primary", "secondary", "appearance", "styles", "activeStyleId", "sections", "content", "media", "promos"];
const kdSnapOf = (s) => { const o = {}; HIST_KEYS.forEach((k) => { o[k] = s[k]; }); return JSON.parse(JSON.stringify(o)); };
const kdJId = (p) => (p || "j") + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
function kdFmtJ(iso) {
  try {
    const d = new Date(iso);
    const day = d.toLocaleDateString("fr-CA", { day: "numeric", month: "short" });
    const h = String(d.getHours()), m = String(d.getMinutes()).padStart(2, "0");
    return day + " · " + h + " h " + m;
  } catch (e) { return ""; }
}

function loadStore() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return null;
}

function defaultState() {
  return {
    enabled: false,         // mode admin actif (chrome + cues visibles)
    mode: "edit",           // "edit" | "preview"
    palette: [...DEFAULT_PALETTE],
    primary: "#C9A24B",
    secondary: "#45758A",
    appearance: { ...DEFAULT_APPEARANCE },
    styles: [],             // [{id,name,snap:{primary,secondary,appearance}}]
    activeStyleId: null,
    sections: SECTION_DEFS.map((s) => ({ id: s.id, visible: true })),
    content: {},            // { key: html }
    media: {},              // { key: {url,type} }
    promos: [],             // [{id,code,ambassador,type,value,start,end,bookings}]
    styleHistory: [],       // [{id,name,action,at}]
    chrome: "panel",        // "bar" (paysage) | "panel" (portrait) | "dot" (pastille)
    journal: [],            // [{id,at,label,kind}]
    publications: [],       // [{id,at,by,snap}]
    dirty: false,           // modifications non publiées
    saveState: "idle",      // idle | saving | saved | error
  };
}

function mergeState(saved) {
  const base = defaultState();
  if (!saved) return base;
  const merged = { ...base, ...saved };
  merged.appearance = { ...base.appearance, ...(saved.appearance || {}) };
  // Réconcilie la liste des sections avec les définitions (ajouts futurs)
  const known = new Set(SECTION_DEFS.map((s) => s.id));
  const savedSecs = (saved.sections || []).filter((s) => known.has(s.id));
  const savedIds = new Set(savedSecs.map((s) => s.id));
  SECTION_DEFS.forEach((s) => { if (!savedIds.has(s.id)) savedSecs.push({ id: s.id, visible: true }); });
  merged.sections = savedSecs;
  merged.enabled = false; // toujours démarrer en vue visiteur
  merged.mode = "edit";
  // Migration unique : active les animations dynamiques + replay pour les états existants
  if (!saved._animMigrated) {
    merged.appearance.anim = true;
    merged.appearance.animStyle = "dynamique";
    merged.appearance.animReplay = true;
    merged._animMigrated = true;
  }
  // Migration : « Prochains déplacements » avant Contact, « Infolettre » après Contact.
  if (!saved._secOrder1) {
    const rest = merged.sections.filter((s) => s.id !== "travel" && s.id !== "newsletter");
    const ci = rest.findIndex((s) => s.id === "contact");
    const travel = merged.sections.find((s) => s.id === "travel") || { id: "travel", visible: true };
    const news = merged.sections.find((s) => s.id === "newsletter") || { id: "newsletter", visible: true };
    if (ci >= 0) { rest.splice(ci, 0, travel); rest.splice(ci + 2, 0, news); }
    else { rest.push(travel, news); }
    merged.sections = rest;
    merged._secOrder1 = true;
  }
  // Migration : insertion FAQ (avant Contact) + Espace client (après Produits).
  if (!saved._secOrder2) {
    let arr = merged.sections.filter((s) => s.id !== "faq" && s.id !== "clientarea");
    const faq = merged.sections.find((s) => s.id === "faq") || { id: "faq", visible: true };
    const ca = merged.sections.find((s) => s.id === "clientarea") || { id: "clientarea", visible: true };
    const pi = arr.findIndex((s) => s.id === "products");
    if (pi >= 0) arr.splice(pi + 1, 0, ca); else arr.push(ca);
    const ci = arr.findIndex((s) => s.id === "contact");
    if (ci >= 0) arr.splice(ci, 0, faq); else arr.push(faq);
    merged.sections = arr;
    merged._secOrder2 = true;
  }
  // Migration : insertion « Partenaires » (après Témoignages, sinon avant Contact).
  if (!saved._secOrder3) {
    let arr = merged.sections.filter((s) => s.id !== "partners");
    const pt = merged.sections.find((s) => s.id === "partners") || { id: "partners", visible: true };
    const ti = arr.findIndex((s) => s.id === "testimonials");
    if (ti >= 0) arr.splice(ti + 1, 0, pt);
    else { const ci = arr.findIndex((s) => s.id === "contact"); if (ci >= 0) arr.splice(ci, 0, pt); else arr.push(pt); }
    merged.sections = arr;
    merged._secOrder3 = true;
  }
  merged.promos = Array.isArray(saved.promos) ? saved.promos : [];
  merged.styleHistory = Array.isArray(saved.styleHistory) ? saved.styleHistory : [];
  merged.journal = Array.isArray(saved.journal) ? saved.journal : [];
  merged.publications = Array.isArray(saved.publications) ? saved.publications : [];
  merged.chrome = ["bar", "panel", "dot"].includes(saved.chrome) ? saved.chrome : "panel";
  // Le panneau à droite reste la disposition par défaut (la barre paysage est une option).
  if (!saved._chromeDefault1) { merged.chrome = "panel"; merged._chromeDefault1 = true; }
  merged.saveState = "idle";
  return merged;
}

/* Applique l'apparence en direct via variables CSS (incassable, sur-marque) */
function applyAppearance(st) {
  const root = document.documentElement;
  const a = st.appearance;
  root.setAttribute("data-theme", a.theme === "dark" ? "dark" : "light");

  // Doré = primaire ; nuances dérivées en color-mix (pas de math JS)
  root.style.setProperty("--gold", st.primary);
  root.style.setProperty("--gold-dark", `color-mix(in srgb, ${st.primary} 76%, #1C1A17)`);
  root.style.setProperty("--gold-light", `color-mix(in srgb, ${st.primary} 52%, #ffffff)`);
  // Bleu = secondaire
  root.style.setProperty("--blue", st.secondary);
  root.style.setProperty("--blue-deep", `color-mix(in srgb, ${st.secondary} 66%, #0c1418)`);
  root.style.setProperty("--blue-pale", a.theme === "dark"
    ? `color-mix(in srgb, ${st.secondary} 26%, #11181c)`
    : `color-mix(in srgb, ${st.secondary} 12%, #ffffff)`);

  root.style.setProperty("--font-title", TITLE_FONT_STACKS[a.titleFont] || TITLE_FONT_STACKS["Cormorant Garamond"]);
  root.style.setProperty("--ts", String(a.textScale));
  root.style.setProperty("--r-lg", a.radius + "px");
  root.style.setProperty("--r-md", Math.round(a.radius * 0.72) + "px");
  root.style.setProperty("--r-sm", Math.round(a.radius * 0.5) + "px");
  root.style.setProperty("--hero-h", a.heroH + "vh");

  // Animations (apparition au scroll) — réglages admin
  root.setAttribute("data-anim", a.anim === false ? "off" : "on");
  root.setAttribute("data-anim-style", a.animStyle || "doux");
  root.setAttribute("data-anim-replay", a.animReplay ? "on" : "off");
}

/* Libellés lisibles pour le journal */
function kdApprLabel(p) {
  if ("theme" in p) return "Thème — " + (p.theme === "dark" ? "Sombre" : "Clair");
  if ("titleFont" in p) return "Police des titres — " + p.titleFont;
  if ("textScale" in p) return "Taille du texte — " + Math.round(p.textScale * 100) + " %";
  if ("radius" in p) return "Arrondi des coins — " + p.radius + " px";
  if ("heroH" in p) return "Hauteur du héros — " + p.heroH + " %";
  if ("anim" in p) return "Animations — " + (p.anim ? "activées" : "désactivées");
  if ("animStyle" in p) return "Style d’animation — " + p.animStyle;
  if ("animReplay" in p) return "Rejeu au défilement — " + (p.animReplay ? "oui" : "non");
  return "Apparence modifiée";
}
function kdExcerpt(html) {
  const t = String(html || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  return t.length > 34 ? t.slice(0, 34) + "…" : t;
}

function EditorProvider({ children }) {
  const [st, setSt] = React.useState(() => mergeState(loadStore()));
  const [toast, setToast] = React.useState(null);
  const toastTimer = React.useRef(0);
  const previewTimer = React.useRef(0);

  // Persistance
  React.useEffect(() => {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(st)); } catch (e) {}
  }, [st]);

  // Apparence en direct
  React.useEffect(() => {
    applyAppearance(st);
    requestAnimationFrame(() => window.dispatchEvent(new Event("kd:relayout")));
  }, [st.primary, st.secondary, st.appearance, st.activeStyleId]);

  // Planificateur de styles : active/retire automatiquement selon date+heure
  React.useEffect(() => {
    const tick = () => {
      const now = Date.now();
      setSt((s) => {
        const due = s.styles.find((x) => x.start && x.end &&
          now >= Date.parse(x.start) && now <= Date.parse(x.end));
        if (due && s.activeStyleId !== due.id) {
          return { ...s, ...due.snap, appearance: { ...due.snap.appearance }, activeStyleId: due.id,
            styleHistory: [{ id: due.id, name: due.name, action: "activé (planifié)", at: new Date().toISOString() }, ...s.styleHistory].slice(0, 24) };
        }
        if (s.activeStyleId) {
          const act = s.styles.find((x) => x.id === s.activeStyleId);
          if (act && act.start && act.end && now > Date.parse(act.end)) {
            const d = defaultState();
            return { ...s, primary: d.primary, secondary: d.secondary, appearance: { ...d.appearance }, activeStyleId: null,
              styleHistory: [{ id: act.id, name: act.name, action: "expiré → style par défaut", at: new Date().toISOString() }, ...s.styleHistory].slice(0, 24) };
          }
        }
        return s;
      });
    };
    tick();
    const iv = setInterval(tick, 30000);
    return () => clearInterval(iv);
  }, []);

  const flash = React.useCallback((msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 1900);
  }, []);

  // Journal, annuler / rétablir ------------------------------------------
  const undoRef = React.useRef([]);
  const redoRef = React.useRef([]);
  const [histTick, setHistTick] = React.useState(0);
  const lastDraftLog = React.useRef(0);

  const pushEntry = (list, label, kind, ck) => {
    const now = Date.now();
    const arr = list || [];
    const top = arr[0];
    if (ck && top && top.ck === ck && now - Date.parse(top.at) < 25000)
      return [{ ...top, label, at: new Date().toISOString() }, ...arr.slice(1)];
    return [{ id: kdJId(), at: new Date().toISOString(), label, kind: kind || "edit", ck: ck || null }, ...arr].slice(0, 80);
  };

  /* Toute modification passe par commit() : instantané pour annuler + ligne de journal. */
  const commit = React.useCallback((label, opts, fn) => {
    setSt((s) => {
      const next = fn(s);
      if (!next || next === s) return s;
      undoRef.current = [...undoRef.current, kdSnapOf(s)].slice(-40);
      redoRef.current = [];
      const o = opts || {};
      return { ...next, dirty: true, saveState: s.saveState === "error" ? "error" : "saving",
        journal: label ? pushEntry(next.journal || s.journal, label, o.kind, o.ck) : (next.journal || s.journal) };
    });
    setHistTick((t) => t + 1);
  }, []);

  // « Brouillon enregistré » : le voyant repasse au vert, journalisé au plus une fois / 90 s
  React.useEffect(() => {
    if (st.saveState !== "saving") return;
    const t = setTimeout(() => setSt((s) => {
      if (s.saveState !== "saving") return s;
      const now = Date.now();
      const log = now - lastDraftLog.current > 90000;
      if (log) lastDraftLog.current = now;
      return { ...s, saveState: "saved",
        journal: log ? [{ id: kdJId("jd"), at: new Date().toISOString(), label: "Brouillon enregistré", kind: "system" }, ...(s.journal || [])].slice(0, 80) : s.journal };
    }), 1100);
    return () => clearTimeout(t);
  }, [st.saveState, histTick]);

  const undo = React.useCallback(() => {
    if (!undoRef.current.length) return;
    const snap = undoRef.current[undoRef.current.length - 1];
    undoRef.current = undoRef.current.slice(0, -1);
    setSt((s) => {
      redoRef.current = [...redoRef.current, kdSnapOf(s)].slice(-40);
      return { ...s, ...snap, dirty: true, saveState: "saving",
        journal: pushEntry(s.journal, "Modification annulée", "undo") };
    });
    setHistTick((t) => t + 1);
    flash("Annulé");
  }, [flash]);

  const redo = React.useCallback(() => {
    if (!redoRef.current.length) return;
    const snap = redoRef.current[redoRef.current.length - 1];
    redoRef.current = redoRef.current.slice(0, -1);
    setSt((s) => {
      undoRef.current = [...undoRef.current, kdSnapOf(s)].slice(-40);
      return { ...s, ...snap, dirty: true, saveState: "saving",
        journal: pushEntry(s.journal, "Modification rétablie", "redo") };
    });
    setHistTick((t) => t + 1);
    flash("Rétabli");
  }, [flash]);

  const publish = React.useCallback((by) => {
    setSt((s) => {
      const at = new Date().toISOString();
      const pub = { id: kdJId("pub"), at, by: by || "Kim", snap: kdSnapOf(s) };
      return { ...s, dirty: false, saveState: "saved", publications: [pub, ...(s.publications || [])].slice(0, 8),
        journal: [{ id: kdJId("jp"), at, label: "Site publié par " + (by || "Kim"), kind: "publish" }, ...(s.journal || [])].slice(0, 80) };
    });
    flash("Site publié ✓");
  }, [flash]);

  const restorePublication = React.useCallback((id) => {
    setSt((s) => {
      const p = (s.publications || []).find((x) => x.id === id);
      if (!p) return s;
      undoRef.current = [...undoRef.current, kdSnapOf(s)].slice(-40);
      return { ...s, ...p.snap, dirty: false, saveState: "saved",
        journal: [{ id: kdJId("jr"), at: new Date().toISOString(), label: "Version restaurée — " + kdFmtJ(p.at), kind: "restore" }, ...(s.journal || [])].slice(0, 80) };
    });
    setHistTick((t) => t + 1);
    flash("Version restaurée ✓");
  }, [flash]);

  const simulateSaveError = React.useCallback(() => setSt((s) => ({ ...s, saveState: "error",
    journal: [{ id: kdJId("je"), at: new Date().toISOString(), label: "Échec de sauvegarde — connexion interrompue", kind: "error" }, ...(s.journal || [])].slice(0, 80) })), []);
  const retrySave = React.useCallback(() => { setSt((s) => ({ ...s, saveState: "saving" })); setHistTick((t) => t + 1); }, []);
  const clearJournal = React.useCallback(() => setSt((s) => ({ ...s, journal: [] })), []);
  const setChrome = React.useCallback((v) => setSt((s) => ({ ...s, chrome: v, lastChrome: s.chrome === "dot" ? s.lastChrome : s.chrome })), []);

  // Mutateurs ------------------------------------------------------------
  const update = React.useCallback((patch) => {
    setSt((s) => ({ ...s, ...(typeof patch === "function" ? patch(s) : patch) }));
  }, []);

  const setAppearance = React.useCallback((patch, opts = {}) => {
    commit(kdApprLabel(patch), { ck: "appr:" + Object.keys(patch)[0] }, (s) => ({ ...s,
      appearance: { ...s.appearance, ...patch },
      activeStyleId: opts.keepActive ? s.activeStyleId : null }));
  }, [commit]);

  const setPrimary = React.useCallback((c) =>
    commit("Couleur principale modifiée", { ck: "col:p" }, (s) => ({ ...s, primary: c, activeStyleId: null })), [commit]);
  const setSecondary = React.useCallback((c) =>
    commit("Couleur secondaire modifiée", { ck: "col:s" }, (s) => ({ ...s, secondary: c, activeStyleId: null })), [commit]);

  const addPaletteColor = React.useCallback((c) => setSt((s) =>
    s.palette.includes(c) ? s : { ...s, palette: [...s.palette, c] }), []);
  const removePaletteColor = React.useCallback((c) => setSt((s) =>
    ({ ...s, palette: s.palette.filter((x) => x !== c) })), []);

  // Styles (apparences enregistrées) ------------------------------------
  const snapshot = (s) => ({ primary: s.primary, secondary: s.secondary, appearance: { ...s.appearance } });
  const createStyle = React.useCallback((name) => {
    const id = "sty-" + Date.now().toString(36);
    commit("Style créé — " + (name || "Style"), { kind: "style" }, (s) => ({ ...s,
      styles: [...s.styles, { id, name: name || "Style", snap: snapshot(s), start: "", end: "" }], activeStyleId: id,
      styleHistory: [{ id, name: name || "Style", action: "créé", at: new Date().toISOString() }, ...s.styleHistory].slice(0, 24) }));
    flash("Style créé ✓");
  }, [flash, commit]);
  const applyStyle = React.useCallback((id) => {
    commit(null, { kind: "style" }, (s) => {
      const sty = s.styles.find((x) => x.id === id);
      if (!sty) return s;
      return { ...s, ...sty.snap, appearance: { ...sty.snap.appearance }, activeStyleId: id,
        journal: pushEntry(s.journal, "Style activé — " + sty.name, "style"),
        styleHistory: [{ id, name: sty.name, action: "appliqué", at: new Date().toISOString() }, ...s.styleHistory].slice(0, 24) };
    });
    flash("Style appliqué ✓");
  }, [flash, commit]);
  // Aperçu temporaire (n'engage rien) : applique en direct puis revient.
  const previewStyle = React.useCallback((id) => {
    const sty = st.styles.find((x) => x.id === id);
    if (!sty) return;
    applyAppearance(sty.snap);
    flash("Aperçu du style — 4 s");
    clearTimeout(previewTimer.current);
    previewTimer.current = setTimeout(() => applyAppearance(st), 4000);
  }, [st, flash]);
  const setStyleSchedule = React.useCallback((id, patch) =>
    setSt((s) => ({ ...s, styles: s.styles.map((x) => x.id === id ? { ...x, ...patch } : x) })), []);
  const revertToDefault = React.useCallback(() => setSt((s) => {
    const d = defaultState();
    return { ...s, primary: d.primary, secondary: d.secondary, appearance: { ...d.appearance }, activeStyleId: null,
      styleHistory: [{ name: "Style par défaut", action: "rétabli", at: new Date().toISOString() }, ...s.styleHistory].slice(0, 24) };
  }), []);
  const saveStyle = React.useCallback((id) => {
    setSt((s) => ({ ...s, styles: s.styles.map((x) => x.id === id ? { ...x, snap: snapshot(s) } : x), activeStyleId: id }));
    flash("Style mis à jour ✓");
  }, [flash]);
  const renameStyle = React.useCallback((id, name) =>
    setSt((s) => ({ ...s, styles: s.styles.map((x) => x.id === id ? { ...x, name } : x) })), []);
  const deleteStyle = React.useCallback((id) =>
    commit(null, { kind: "style" }, (s) => {
      const sty = s.styles.find((x) => x.id === id);
      return { ...s, styles: s.styles.filter((x) => x.id !== id),
        journal: pushEntry(s.journal, "Style supprimé — " + ((sty && sty.name) || "Style"), "style"),
        activeStyleId: s.activeStyleId === id ? null : s.activeStyleId };
    }), [commit]);

  // Sections -------------------------------------------------------------
  const secLabel = (id) => { const d = SECTION_DEFS.find((x) => x.id === id); return d ? d.fr : id; };
  const toggleSection = React.useCallback((id) =>
    commit(null, { kind: "section" }, (s) => {
      const cur = s.sections.find((x) => x.id === id);
      const now = !(cur && cur.visible);
      return { ...s, sections: s.sections.map((x) => x.id === id ? { ...x, visible: !x.visible } : x),
        journal: pushEntry(s.journal, (now ? "Section affichée — " : "Section masquée — ") + secLabel(id), "section") };
    }), [commit]);
  const moveSection = React.useCallback((id, dir) => commit(null, { kind: "section", ck: "sec:" + id }, (s) => {
    const arr = [...s.sections];
    const i = arr.findIndex((x) => x.id === id);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= arr.length) return s;
    [arr[i], arr[j]] = [arr[j], arr[i]];
    return { ...s, sections: arr, journal: pushEntry(s.journal, "Section déplacée — " + secLabel(id), "section", "sec:" + id) };
  }), [commit]);

  // Contenu & médias (édition en place) ---------------------------------
  const setContent = React.useCallback((key, html) =>
    commit(null, {}, (s) => (s.content[key] === html ? s : { ...s, content: { ...s.content, [key]: html },
      journal: pushEntry(s.journal, "Texte — « " + kdExcerpt(html) + " »", "text", "txt:" + key) })), [commit]);
  const setMedia = React.useCallback((key, val) =>
    commit(null, {}, (s) => ({ ...s, media: { ...s.media, [key]: val },
      journal: pushEntry(s.journal, (val && val.type === "video" ? "Vidéo remplacée" : "Photo remplacée"), "media", "med:" + key) })), [commit]);

  // Codes promo / ambassadeurs ------------------------------------------
  const addPromo = React.useCallback((data) => commit(null, { kind: "promo" }, (s) => ({ ...s,
    promos: [{ id: "pr-" + Date.now().toString(36), code: "", ambassador: "", type: "percent", value: 10, start: "", end: "", bookings: 0, ...data }, ...s.promos],
    journal: pushEntry(s.journal, "Code promo créé — " + ((data && data.code) || "sans code"), "promo") })), [commit]);
  const updatePromo = React.useCallback((id, patch) =>
    commit(null, { kind: "promo" }, (s) => {
      const p0 = s.promos.find((p) => p.id === id);
      return { ...s, promos: s.promos.map((p) => p.id === id ? { ...p, ...patch } : p),
        journal: pushEntry(s.journal, "Code promo modifié — " + (((patch && patch.code) || (p0 && p0.code)) || "sans code"), "promo", "promo:" + id) };
    }), [commit]);
  const deletePromo = React.useCallback((id) =>
    commit(null, { kind: "promo" }, (s) => {
      const p0 = s.promos.find((p) => p.id === id);
      return { ...s, promos: s.promos.filter((p) => p.id !== id),
        journal: pushEntry(s.journal, "Code promo supprimé — " + ((p0 && p0.code) || "sans code"), "promo") };
    }), [commit]);
  const addPromoBooking = React.useCallback((id) =>
    setSt((s) => ({ ...s, promos: s.promos.map((p) => p.id === id ? { ...p, bookings: (p.bookings || 0) + 1 } : p) })), []);

  const resetAll = React.useCallback(() => {
    const fresh = defaultState();
    fresh.enabled = true; fresh.mode = "edit";
    setSt(fresh);
    flash("Réinitialisé ✓");
  }, [flash]);

  const value = {
    st, setSt, update, flash, toast, commit,
    undo, redo, canUndo: undoRef.current.length > 0, canRedo: redoRef.current.length > 0,
    publish, restorePublication, simulateSaveError, retrySave, clearJournal, setChrome, kdFmtJ,
    setAppearance, setPrimary, setSecondary,
    addPaletteColor, removePaletteColor,
    createStyle, applyStyle, saveStyle, renameStyle, deleteStyle,
    previewStyle, setStyleSchedule, revertToDefault,
    addPromo, updatePromo, deletePromo, addPromoBooking,
    toggleSection, moveSection,
    setContent, setMedia, resetAll,
    SECTION_DEFS, TITLE_FONT_STACKS,
  };
  return <EditorCtx.Provider value={value}>{children}</EditorCtx.Provider>;
}

Object.assign(window, {
  EditorCtx, useEditor, EditorProvider, kdFmtJ,
  SECTION_DEFS, TITLE_FONT_STACKS, DEFAULT_APPEARANCE,
});
