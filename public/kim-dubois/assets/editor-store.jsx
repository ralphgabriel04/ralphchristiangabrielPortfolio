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
  merged.promos = Array.isArray(saved.promos) ? saved.promos : [];
  merged.styleHistory = Array.isArray(saved.styleHistory) ? saved.styleHistory : [];
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

  // Mutateurs ------------------------------------------------------------
  const update = React.useCallback((patch) => {
    setSt((s) => ({ ...s, ...(typeof patch === "function" ? patch(s) : patch) }));
  }, []);

  const setAppearance = React.useCallback((patch, opts = {}) => {
    setSt((s) => ({ ...s, appearance: { ...s.appearance, ...patch },
      activeStyleId: opts.keepActive ? s.activeStyleId : null }));
  }, []);

  const setPrimary = React.useCallback((c) =>
    setSt((s) => ({ ...s, primary: c, activeStyleId: null })), []);
  const setSecondary = React.useCallback((c) =>
    setSt((s) => ({ ...s, secondary: c, activeStyleId: null })), []);

  const addPaletteColor = React.useCallback((c) => setSt((s) =>
    s.palette.includes(c) ? s : { ...s, palette: [...s.palette, c] }), []);
  const removePaletteColor = React.useCallback((c) => setSt((s) =>
    ({ ...s, palette: s.palette.filter((x) => x !== c) })), []);

  // Styles (apparences enregistrées) ------------------------------------
  const snapshot = (s) => ({ primary: s.primary, secondary: s.secondary, appearance: { ...s.appearance } });
  const createStyle = React.useCallback((name) => {
    const id = "sty-" + Date.now().toString(36);
    setSt((s) => ({ ...s, styles: [...s.styles, { id, name: name || "Style", snap: snapshot(s), start: "", end: "" }], activeStyleId: id,
      styleHistory: [{ id, name: name || "Style", action: "créé", at: new Date().toISOString() }, ...s.styleHistory].slice(0, 24) }));
    flash("Style créé ✓");
  }, [flash]);
  const applyStyle = React.useCallback((id) => {
    setSt((s) => {
      const sty = s.styles.find((x) => x.id === id);
      if (!sty) return s;
      return { ...s, ...sty.snap, appearance: { ...sty.snap.appearance }, activeStyleId: id,
        styleHistory: [{ id, name: sty.name, action: "appliqué", at: new Date().toISOString() }, ...s.styleHistory].slice(0, 24) };
    });
    flash("Style appliqué ✓");
  }, [flash]);
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
    setSt((s) => ({ ...s, styles: s.styles.filter((x) => x.id !== id), activeStyleId: s.activeStyleId === id ? null : s.activeStyleId })), []);

  // Sections -------------------------------------------------------------
  const toggleSection = React.useCallback((id) =>
    setSt((s) => ({ ...s, sections: s.sections.map((x) => x.id === id ? { ...x, visible: !x.visible } : x) })), []);
  const moveSection = React.useCallback((id, dir) => setSt((s) => {
    const arr = [...s.sections];
    const i = arr.findIndex((x) => x.id === id);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= arr.length) return s;
    [arr[i], arr[j]] = [arr[j], arr[i]];
    return { ...s, sections: arr };
  }), []);

  // Contenu & médias (édition en place) ---------------------------------
  const setContent = React.useCallback((key, html) =>
    setSt((s) => ({ ...s, content: { ...s.content, [key]: html } })), []);
  const setMedia = React.useCallback((key, val) =>
    setSt((s) => ({ ...s, media: { ...s.media, [key]: val } })), []);

  // Codes promo / ambassadeurs ------------------------------------------
  const addPromo = React.useCallback((data) => setSt((s) => ({ ...s,
    promos: [{ id: "pr-" + Date.now().toString(36), code: "", ambassador: "", type: "percent", value: 10, start: "", end: "", bookings: 0, ...data }, ...s.promos] })), []);
  const updatePromo = React.useCallback((id, patch) =>
    setSt((s) => ({ ...s, promos: s.promos.map((p) => p.id === id ? { ...p, ...patch } : p) })), []);
  const deletePromo = React.useCallback((id) =>
    setSt((s) => ({ ...s, promos: s.promos.filter((p) => p.id !== id) })), []);
  const addPromoBooking = React.useCallback((id) =>
    setSt((s) => ({ ...s, promos: s.promos.map((p) => p.id === id ? { ...p, bookings: (p.bookings || 0) + 1 } : p) })), []);

  const resetAll = React.useCallback(() => {
    const fresh = defaultState();
    fresh.enabled = true; fresh.mode = "edit";
    setSt(fresh);
    flash("Réinitialisé ✓");
  }, [flash]);

  const value = {
    st, setSt, update, flash, toast,
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
  EditorCtx, useEditor, EditorProvider,
  SECTION_DEFS, TITLE_FONT_STACKS, DEFAULT_APPEARANCE,
});
