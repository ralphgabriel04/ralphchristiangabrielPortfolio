/* ============================================================
   Mode administrateur — édition en place (couverture maximale)
   • Texte : tout libellé « feuille » de la page devient éditable
     (titres, paragraphes, listes, puces, libellés, valeurs, boutons,
      liens, statistiques…). Détection générale pilotée par le DOM —
      aucun composant à réécrire.
   • Médias : zones héros / photo (conteneurs) ET chaque <img> de contenu
     (certificats, portfolio, blogue…) — remplaçables par photo ou vidéo.
   Overrides re-appliqués après chaque rendu.
   ============================================================ */

/* Tags porteurs de texte que l'on autorise à devenir éditables.
   On édite TOUJOURS la feuille la plus pertinente (cf. isTextLeaf). */
const EDIT_TEXT_SEL = [
  "h1", "h2", "h3", "h4", "h5", "h6",
  "p", "li", "dt", "dd", "blockquote", "figcaption",
  "span", "strong", "em", "b", "a", "button", "small", "label",
  "th", "td", "caption", "summary",
].join(",");

/* Conteneurs média gérés « par insertion » (héros + zones photo placeholder) */
const MEDIA_SEL = ".hero-bg, .photo-zone";

/* Zones jamais éditables : chrome admin, panneaux, annotations, conciergerie,
   visionneuse, icônes SVG. */
const EXCLUDE_WITHIN = [
  ".admin-panel", ".admin-toggle", ".admin-toast", ".preview-bar",
  ".tweaks-panel", ".anno", ".anno-dot", ".skip-link",
  ".cg-launch", ".cg-panel",
  ".lightbox", ".lb-stage", ".lb-shell",
  ".sr-only",
].join(",");

/* Contrôles purement « icône / symbole » à ne pas transformer en texte */
const CTRL_ICON_SEL = ".burger, .icon-btn, .back-to-top, .media-edit, .cert-figure-zoom, .pal-add, .cg-bubble";

function scopeOf(el) {
  const sec = el.closest("section[id]");
  if (sec) return sec.id;
  if (el.closest(".dist-page, .pf-page")) return (el.closest(".dist-page") ? "dist-page" : "pf-page");
  if (el.closest("footer, .site-footer")) return "footer";
  if (el.closest("header, .site-header")) return "header";
  return "page";
}

function isExcluded(el) {
  return !!(el.closest(EXCLUDE_WITHIN) || el.closest("svg") || el.namespaceURI === "http://www.w3.org/2000/svg");
}

/* Au moins une lettre ou un chiffre (exclut « ‹ › ⤢ × ↑ ↓ ✓ ✎ » seuls) */
function hasWord(s) { return /[\p{L}\p{N}]/u.test(s || ""); }

/* Texte provenant DIRECTEMENT de l'élément (pas de ses enfants) */
function directText(el) {
  let t = "";
  el.childNodes.forEach((n) => { if (n.nodeType === 3) t += n.nodeValue; });
  return t.replace(/\s+/g, " ").trim();
}

/* Une « feuille de texte » = élément qui porte son propre texte.
   → un <p>Texte <strong>gras</strong></p> est édité d'un bloc (a du texte direct)
   → un <li><strong>k</strong><span>v</span></li> donne deux feuilles (strong, span) */
function isTextLeaf(el) {
  if (isExcluded(el)) return false;
  if (el.matches(CTRL_ICON_SEL)) return false;
  // Champs de formulaire : on n'édite pas la valeur saisie par le visiteur
  if (el.matches("input, textarea, select, option")) return false;
  // Conteneur média : géré ailleurs
  if (el.matches(MEDIA_SEL) || el.closest(MEDIA_SEL)) {
    if (el.matches(MEDIA_SEL)) return false;
  }
  const dt = directText(el);
  if (!dt || !hasWord(dt)) return false;
  // Les boutons/liens « icône » sans mot sont déjà écartés par hasWord
  return true;
}

/* ---- Stampe + applique les overrides de TEXTE (scan général) ---- */
function applyTextOverrides(content, lang, editing) {
  const counters = {};
  const nodes = document.querySelectorAll(EDIT_TEXT_SEL);
  nodes.forEach((el) => {
    if (!isTextLeaf(el)) {
      // S'assure qu'un ancien marquage ne reste pas collé
      if (el.dataset.ek) { el.removeAttribute("contenteditable"); el.classList.remove("kd-editable"); }
      return;
    }
    const scope = scopeOf(el);
    const cls = (el.className && typeof el.className === "string") ? "." + el.className.split(" ")[0] : "";
    const sig = (el.tagName + cls).toLowerCase();
    const ck = scope + "|" + sig;
    const i = counters[ck] = (counters[ck] == null ? 0 : counters[ck] + 1);
    const key = lang + "::" + ck + "." + i;
    el.dataset.ek = key;
    if (Object.prototype.hasOwnProperty.call(content, key)) {
      // Ne jamais écraser ce que l'admin est en train de taper
      if (el !== document.activeElement && el.innerHTML !== content[key]) el.innerHTML = content[key];
    }
    if (editing) {
      el.classList.add("kd-editable");
      el.setAttribute("contenteditable", "true");
      el.setAttribute("spellcheck", "false");
    } else {
      el.removeAttribute("contenteditable");
      el.classList.remove("kd-editable");
    }
  });
}

/* ---- Applique un média (image ou vidéo) à un CONTENEUR (héros / photo-zone) ---- */
function applyMediaToEl(el, val) {
  if (!val || !val.url) return;
  el.querySelectorAll(".kd-media-override").forEach((n) => n.remove());
  const isVideo = val.type === "video";
  const isHero = el.classList.contains("hero-bg");
  let node;
  if (isVideo) {
    node = document.createElement("video");
    node.src = val.url;
    node.autoplay = true; node.loop = true; node.muted = true;
    node.playsInline = true; node.setAttribute("playsinline", "");
  } else {
    node = document.createElement("img");
    node.src = val.url;
    node.alt = "";
  }
  node.className = "kd-media-override " + (isHero ? "hero-photo" : "pz-img");
  if (isHero) {
    el.insertBefore(node, el.firstChild);
  } else {
    el.classList.add("has-img");
    const ph = el.querySelector(".pz-mono");
    if (ph) ph.style.display = "none";
    el.insertBefore(node, el.firstChild);
  }
}

/* ---- Stampe les conteneurs média + bouton « Changer » ---- */
function applyMediaOverrides(media, editing) {
  const counters = {};
  document.querySelectorAll(MEDIA_SEL).forEach((el) => {
    if (isExcluded(el)) return;
    const scope = scopeOf(el);
    const i = counters[scope] = (counters[scope] == null ? 0 : counters[scope] + 1);
    const key = scope + "~m." + i;
    el.dataset.mk = key;
    el.classList.add("kd-media");
    if (media[key]) applyMediaToEl(el, media[key]);

    const existing = el.querySelector(":scope > .media-edit");
    const lbl = window.__KDLANG === "en" ? "Change photo / video" : "Changer la photo / vidéo";
    if (editing && !existing) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "media-edit";
      btn.dataset.mk = key;
      btn.innerHTML = '<span class="me-ico" aria-hidden="true">⇄</span><span class="me-txt">' + lbl + "</span>";
      el.appendChild(btn);
    } else if (!editing && existing) {
      existing.remove();
    } else if (editing && existing) {
      existing.querySelector(".me-txt").textContent = lbl;
    }
  });
}

/* ---- Stampe chaque <img> de contenu (remplacement direct) ---- */
function applyImageOverrides(media, editing) {
  const counters = {};
  document.querySelectorAll("img").forEach((el) => {
    if (isExcluded(el)) return;
    if (el.classList.contains("kd-media-override")) return;   // notre propre insertion
    if (el.closest(MEDIA_SEL)) return;                        // géré par conteneur
    const scope = scopeOf(el);
    const i = counters[scope] = (counters[scope] == null ? 0 : counters[scope] + 1);
    const key = scope + "~img." + i;
    el.dataset.ik = key;
    const val = media[key];
    if (val && val.url) {
      if (val.type === "video" && el.tagName === "IMG") {
        // remplace l'image par une vidéo en place
        let v = el.nextElementSibling;
        if (!v || !v.classList || !v.classList.contains("kd-img-video")) {
          v = document.createElement("video");
          v.className = "kd-img-video";
          v.autoplay = true; v.loop = true; v.muted = true; v.playsInline = true; v.setAttribute("playsinline", "");
          v.dataset.ik = key;
          el.parentNode.insertBefore(v, el.nextSibling);
        }
        v.src = val.url;
        v.style.cssText = (getComputedStyle(el).cssText, "");
        el.style.display = "none";
      } else if (el.getAttribute("src") !== val.url) {
        el.style.display = "";
        const nv = el.parentNode && el.parentNode.querySelector(":scope > .kd-img-video[data-ik='" + (window.CSS && CSS.escape ? CSS.escape(key) : key) + "']");
        if (nv) nv.remove();
        el.src = val.url;
      }
    }
    el.classList.toggle("kd-img-edit", !!editing);
    if (editing) el.setAttribute("title", window.__KDLANG === "en" ? "Click to change the image" : "Cliquer pour changer l’image");
    else el.removeAttribute("title");
  });
}

/* ============================================================
   Couche d'édition montée dans l'app
   ============================================================ */
function InlineEditingLayer() {
  const ed = useEditor();
  const { st, setContent, setMedia, flash } = ed;
  const editing = st.enabled && st.mode === "edit";
  const fileRef = React.useRef(null);
  const pending = React.useRef(null); // { kind: "container"|"img", key }
  const saveTimer = React.useRef(0);

  // (Re)stampe + applique après chaque rendu pertinent
  React.useEffect(() => {
    const run = () => {
      applyTextOverrides(st.content, window.__KDLANG || "fr", editing);
      applyMediaOverrides(st.media, editing);
      applyImageOverrides(st.media, editing);
    };
    run();
    const t = setTimeout(run, 200);
    const t2 = setTimeout(run, 700);
    return () => { clearTimeout(t); clearTimeout(t2); };
  }, [editing, st.content, st.media, st.sections, st.activeStyleId]);

  // Re-stampe sur changement de langue / audience / relayout
  React.useEffect(() => {
    const onRelayout = () => {
      applyTextOverrides(st.content, window.__KDLANG || "fr", editing);
      applyMediaOverrides(st.media, editing);
      applyImageOverrides(st.media, editing);
    };
    window.addEventListener("kd:relayout", onRelayout);
    return () => window.removeEventListener("kd:relayout", onRelayout);
  }, [editing, st.content, st.media]);

  // Sauvegarde du texte (délégation)
  React.useEffect(() => {
    if (!editing) return;
    const onInput = (e) => {
      const el = e.target.closest("[data-ek]");
      if (!el || !el.isContentEditable) return;
      clearTimeout(saveTimer.current);
      const key = el.dataset.ek, html = el.innerHTML;
      saveTimer.current = setTimeout(() => { setContent(key, html); flash("Enregistré ✓"); }, 550);
    };
    const onBlur = (e) => {
      const el = e.target.closest("[data-ek]");
      if (!el || !el.isContentEditable) return;
      clearTimeout(saveTimer.current);
      setContent(el.dataset.ek, el.innerHTML);
    };
    const onKey = (e) => {
      const el = e.target.closest("[data-ek]");
      if (!el || !el.isContentEditable) return;
      // Pas de retour ligne dans les titres / boutons / liens courts
      if (e.key === "Enter" && /^(H[1-6]|A|BUTTON|SPAN|STRONG|EM|DT|DD|LI)$/.test(el.tagName)) {
        e.preventDefault(); el.blur();
      }
    };
    document.addEventListener("input", onInput);
    document.addEventListener("focusout", onBlur, true);
    document.addEventListener("keydown", onKey, true);
    return () => {
      document.removeEventListener("input", onInput);
      document.removeEventListener("focusout", onBlur, true);
      document.removeEventListener("keydown", onKey, true);
    };
  }, [editing, setContent, flash]);

  // Clics en mode édition : images + boutons « Changer » + neutralisation des actions
  React.useEffect(() => {
    if (!editing) return;

    // Capture : empêche la navigation / les actions des liens & boutons éditables
    const onClickCapture = (e) => {
      const img = e.target.closest("img.kd-img-edit");
      if (img) {
        e.preventDefault(); e.stopPropagation();
        pending.current = { kind: "img", key: img.dataset.ik };
        if (fileRef.current) { fileRef.current.value = ""; fileRef.current.click(); }
        return;
      }
      const mediaBtn = e.target.closest(".media-edit");
      if (mediaBtn) {
        e.preventDefault(); e.stopPropagation();
        pending.current = { kind: "container", key: mediaBtn.dataset.mk };
        if (fileRef.current) { fileRef.current.value = ""; fileRef.current.click(); }
        return;
      }
      // Lien/bouton éditable : on bloque l'action pour rester en édition (curseur déjà posé)
      const ctrl = e.target.closest("a[data-ek], button[data-ek], [role='tab'][data-ek]");
      if (ctrl && ctrl.isContentEditable) { e.preventDefault(); e.stopPropagation(); }
    };
    document.addEventListener("click", onClickCapture, true);
    return () => document.removeEventListener("click", onClickCapture, true);
  }, [editing]);

  const onFile = (e) => {
    const file = e.target.files && e.target.files[0];
    const p = pending.current;
    if (!file || !p) return;
    const type = file.type.startsWith("video") ? "video" : "image";
    const reader = new FileReader();
    reader.onload = () => {
      const val = { url: reader.result, type };
      setMedia(p.key, val);
      if (p.kind === "container") {
        const el = document.querySelector('[data-mk="' + CSS.escape(p.key) + '"].kd-media');
        if (el) applyMediaToEl(el, val);
      } else {
        const el = document.querySelector('img[data-ik="' + CSS.escape(p.key) + '"]');
        if (el && type === "image") el.src = val.url;
        else applyImageOverrides({ ...st.media, [p.key]: val }, true);
      }
      flash(type === "video" ? "Vidéo ajoutée ✓" : "Image changée ✓");
    };
    reader.readAsDataURL(file);
  };

  return (
    <input ref={fileRef} type="file" accept="image/*,video/*"
      style={{ display: "none" }} onChange={onFile} aria-hidden="true" tabIndex={-1} />
  );
}

/* ---- Toast « Enregistré ✓ » ---- */
function AdminToast() {
  const { toast } = useEditor();
  return (
    <div className={"admin-toast" + (toast ? " show" : "")} role="status" aria-live="polite">
      {toast}
    </div>
  );
}

Object.assign(window, { InlineEditingLayer, AdminToast });
