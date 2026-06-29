/* ============================================================
   Mode administrateur — chrome (entrée + panneau à onglets)
   Sur-marque : mêmes tokens que le site, clair/sombre, FR clair.
   ============================================================ */

/* Petites primitives ----------------------------------------------------- */
function Seg({ value, options, onChange, labels }) {
  return (
    <div className="seg" role="group">
      {options.map((o) => (
        <button key={o} type="button" className={"seg-opt" + (value === o ? " on" : "")}
          aria-pressed={value === o} onClick={() => onChange(o)}>
          {labels ? labels[o] || o : o}
        </button>
      ))}
    </div>
  );
}

function Slider({ label, value, min, max, step, suffix, onChange }) {
  return (
    <label className="ed-slider">
      <span className="ed-slabel">{label}<b>{value}{suffix || ""}</b></span>
      <input type="range" min={min} max={max} step={step || 1} value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))} />
    </label>
  );
}

/* Onglet APPARENCE ------------------------------------------------------- */
function PaletteManager() {
  const { st, addPaletteColor, removePaletteColor, setPrimary, setSecondary } = useEditor();
  const [draft, setDraft] = React.useState("#C9A24B");
  return (
    <div className="ed-block">
      <div className="ed-head">
        <span className="ed-title">🎨 Ma palette de couleurs</span>
        <span className="ed-hint">Composez vos teintes. Elles deviennent vos choix ci-dessous.</span>
      </div>

      <div className="pal-grid">
        {st.palette.map((c) => (
          <div className="pal-chip" key={c} style={{ "--c": c }}>
            <span className="pal-dot" style={{ background: c }} title={c}></span>
            <button className="pal-x" title="Retirer" aria-label={"Retirer " + c}
              onClick={() => removePaletteColor(c)}>×</button>
          </div>
        ))}
        <label className="pal-add" title="Ajouter une couleur">
          <input type="color" value={draft} onChange={(e) => setDraft(e.target.value)}
            onBlur={() => addPaletteColor(draft)} aria-label="Choisir une nouvelle couleur" />
          <span aria-hidden="true">+</span>
        </label>
      </div>

      <div className="ed-row">
        <span className="ed-rlabel">Couleur principale</span>
        <div className="pal-pick">
          {st.palette.map((c) => (
            <button key={c} className={"pick-dot" + (st.primary === c ? " on" : "")}
              style={{ background: c }} title={c} aria-label={"Principale " + c}
              onClick={() => setPrimary(c)}></button>
          ))}
        </div>
      </div>
      <div className="ed-row">
        <span className="ed-rlabel">Couleur secondaire</span>
        <div className="pal-pick">
          {st.palette.map((c) => (
            <button key={c} className={"pick-dot" + (st.secondary === c ? " on" : "")}
              style={{ background: c }} title={c} aria-label={"Secondaire " + c}
              onClick={() => setSecondary(c)}></button>
          ))}
        </div>
      </div>
    </div>
  );
}

function TabApparence() {
  const { st, setAppearance, TITLE_FONT_STACKS } = useEditor();
  const a = st.appearance;
  return (
    <div className="ed-tabpane">
      <PaletteManager />

      <div className="ed-block">
        <div className="ed-head"><span className="ed-title">Ambiance & lecture</span></div>

        <div className="ed-row">
          <span className="ed-rlabel">Thème</span>
          <Seg value={a.theme} options={["light", "dark"]}
            labels={{ light: "Clair", dark: "Sombre" }}
            onChange={(v) => setAppearance({ theme: v })} />
        </div>

        <div className="ed-row col">
          <span className="ed-rlabel">Police des titres</span>
          <Seg value={a.titleFont} options={Object.keys(TITLE_FONT_STACKS)}
            labels={{ "Cormorant Garamond": "Cormorant", "Playfair Display": "Playfair", "Fraunces": "Fraunces" }}
            onChange={(v) => setAppearance({ titleFont: v })} />
        </div>

        <Slider label="Taille du texte" value={Math.round(a.textScale * 100)} min={90} max={115} step={1}
          suffix=" %" onChange={(v) => setAppearance({ textScale: v / 100 })} />
        <Slider label="Arrondi des coins" value={a.radius} min={4} max={22} step={1}
          suffix=" px" onChange={(v) => setAppearance({ radius: v })} />
        <Slider label="Hauteur du héros" value={a.heroH} min={64} max={100} step={1}
          suffix=" %" onChange={(v) => setAppearance({ heroH: v })} />
      </div>

      <div className="ed-block">
        <div className="ed-head"><span className="ed-title">Animations</span>
          <span className="ed-hint">Apparitions au défilement. Tout reste lisible — vous pouvez les désactiver.</span></div>
        <div className="ed-row">
          <span className="ed-rlabel">Animations</span>
          <Seg value={a.anim === false ? "off" : "on"} options={["on", "off"]}
            labels={{ on: "Activées", off: "Désactivées" }}
            onChange={(v) => setAppearance({ anim: v === "on" })} />
        </div>
        <div className="ed-row">
          <span className="ed-rlabel">Style</span>
          <Seg value={a.animStyle || "doux"} options={["doux", "dynamique"]}
            labels={{ doux: "Doux", dynamique: "Dynamique" }}
            onChange={(v) => setAppearance({ animStyle: v })} />
        </div>
        <div className="ed-row">
          <span className="ed-rlabel">Rejouer au défilement</span>
          <Seg value={a.animReplay ? "on" : "off"} options={["off", "on"]}
            labels={{ off: "Non", on: "Oui" }}
            onChange={(v) => setAppearance({ animReplay: v === "on" })} />
        </div>
      </div>
    </div>
  );
}

/* Onglet STYLES ---------------------------------------------------------- */
function TabStyles() {
  const { st, createStyle, applyStyle, saveStyle, renameStyle, deleteStyle } = useEditor();
  const [name, setName] = React.useState("");
  const [editId, setEditId] = React.useState(null);
  const [editName, setEditName] = React.useState("");

  return (
    <div className="ed-tabpane">
      <div className="ed-block">
        <div className="ed-head">
          <span className="ed-title">Styles enregistrés</span>
          <span className="ed-hint">Plusieurs looks, basculables à volonté. Vos textes et photos ne bougent pas.</span>
        </div>

        {st.styles.length === 0 && (
          <p className="ed-empty">Aucun style pour l’instant. Réglez l’apparence à votre goût, puis créez-en un.</p>
        )}

        <ul className="style-list">
          {st.styles.map((sty) => (
            <li key={sty.id} className={"style-item" + (st.activeStyleId === sty.id ? " active" : "")}>
              <span className="style-mark" style={{ background: sty.snap.primary }} aria-hidden="true">
                {st.activeStyleId === sty.id ? "✦" : ""}
              </span>
              {editId === sty.id ? (
                <input className="style-rename" autoFocus value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onBlur={() => { renameStyle(sty.id, editName || sty.name); setEditId(null); }}
                  onKeyDown={(e) => { if (e.key === "Enter") { renameStyle(sty.id, editName || sty.name); setEditId(null); } }} />
              ) : (
                <span className="style-name">{sty.name}</span>
              )}
              <span className="style-swatches" aria-hidden="true">
                <i style={{ background: sty.snap.primary }}></i>
                <i style={{ background: sty.snap.secondary }}></i>
              </span>
              <div className="style-actions">
                <button className="mini" onClick={() => applyStyle(sty.id)}>Appliquer</button>
                <button className="mini ghost" title="Sauvegarder l’apparence actuelle ici"
                  onClick={() => saveStyle(sty.id)}>Sauver</button>
                <button className="mini ghost" title="Renommer"
                  onClick={() => { setEditId(sty.id); setEditName(sty.name); }}>✎</button>
                <button className="mini ghost danger" title="Supprimer"
                  onClick={() => deleteStyle(sty.id)}>🗑</button>
              </div>
            </li>
          ))}
        </ul>

        <div className="style-create">
          <input value={name} placeholder="Nom du style (ex. « Sombre élégant »)"
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && name.trim()) { createStyle(name.trim()); setName(""); } }} />
          <button className="mini solid" disabled={!name.trim()}
            onClick={() => { createStyle(name.trim()); setName(""); }}>Créer ce style</button>
        </div>
      </div>
    </div>
  );
}

/* Onglet SECTIONS -------------------------------------------------------- */
function TabSections() {
  const { st, toggleSection, moveSection, SECTION_DEFS } = useEditor();
  const lang = window.__KDLANG === "en" ? "en" : "fr";
  const labelOf = (id) => { const d = SECTION_DEFS.find((x) => x.id === id); return d ? d[lang] : id; };
  return (
    <div className="ed-tabpane">
      <div className="ed-block">
        <div className="ed-head">
          <span className="ed-title">Sections de la page</span>
          <span className="ed-hint">Affichez, masquez ou réordonnez. L’en-tête et le pied de page restent en place.</span>
        </div>
        <ul className="sec-list">
          {st.sections.map((s, i) => (
            <li key={s.id} className={"sec-item" + (s.visible ? "" : " hidden")}>
              <button className="sec-eye" aria-pressed={s.visible} title={s.visible ? "Masquer" : "Afficher"}
                onClick={() => toggleSection(s.id)}>{s.visible ? "👁" : "🚫"}</button>
              <span className="sec-name">{labelOf(s.id)}</span>
              <div className="sec-move">
                <button className="mini ghost" disabled={i === 0} title="Monter"
                  onClick={() => moveSection(s.id, -1)}>↑</button>
                <button className="mini ghost" disabled={i === st.sections.length - 1} title="Descendre"
                  onClick={() => moveSection(s.id, 1)}>↓</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* Onglet AIDE ------------------------------------------------------------ */
function TabAide() {
  const steps = [
    ["Activez le mode", "Cliquez sur le cadenas en bas à droite. Des contours apparaissent : vous pouvez modifier."],
    ["Changez un texte", "Cliquez sur n’importe quel titre ou paragraphe et écrivez. C’est enregistré tout seul."],
    ["Remplacez une photo", "Survolez une image et cliquez « Changer la photo / vidéo » pour choisir un fichier."],
    ["Habillez le site", "Onglet « Apparence » : vos couleurs, le thème, la police, les tailles — aperçu immédiat."],
    ["Gardez vos looks", "Onglet « Styles » : enregistrez une apparence et basculez d’un look à l’autre quand vous voulez."],
  ];
  return (
    <div className="ed-tabpane">
      <div className="ed-block">
        <div className="ed-head">
          <span className="ed-title">Prise en main en 5 étapes</span>
          <span className="ed-hint">Aucune compétence technique requise. Vous ne pouvez rien casser.</span>
        </div>
        <ol className="aide-list">
          {steps.map((s, i) => (
            <li key={i}><span className="aide-n">{i + 1}</span>
              <span className="aide-txt"><strong>{s[0]}</strong>{s[1]}</span></li>
          ))}
        </ol>
        <p className="aide-foot">Terminé ? Cliquez « Aperçu » pour voir le site comme vos visiteurs — sans aucun outil d’édition.</p>
      </div>

      <div className="ed-block ed-rationale">
        <div className="ed-head"><span className="ed-title">Pourquoi cet éditeur ?</span>
          <span className="ed-hint">Notes de conception (maquette de discussion).</span></div>
        <ul className="rat-list">
          <li><strong>Liberté encadrée.</strong> On ne propose que des gestes sûrs et sur-marque : textes, photos, palette, styles, ordre des sections. Impossible de produire une page cassée ou hors marque — l’inverse d’un constructeur libre qui noierait une non-technicienne.</li>
          <li><strong>Sauvegarde automatique.</strong> Chaque modification s’enregistre seule (petit « Enregistré ✓ »). Aucun bouton « publier » à oublier, aucune peur de perdre son travail.</li>
          <li><strong>Repli mobile.</strong> Sur téléphone, le panneau devient une feuille du bas et la pastille « Changer la photo » reste visible au doigt — l’édition se fait au pouce, pas à la souris.</li>
        </ul>
      </div>
    </div>
  );
}

/* Bouton d'entrée flottant ---------------------------------------------- */
function AdminToggle() {
  const { st, update } = useEditor();
  if (st.enabled) return null;
  return (
    <button type="button" className="admin-toggle" title="Mode administrateur"
      onClick={() => update({ enabled: true, mode: "edit" })}>
      <span className="at-ico" aria-hidden="true">🔒</span>
      <span className="at-txt">Mode administrateur</span>
    </button>
  );
}

/* Panneau principal ------------------------------------------------------ */
function AdminPanel() {
  const { st, update, resetAll } = useEditor();
  const [tab, setTab] = React.useState("apparence");
  const editing = st.mode === "edit";

  // Décale le site uniquement en mode édition (desktop) → zéro chevauchement
  React.useEffect(() => {
    const on = st.enabled && editing;
    document.documentElement.classList.toggle("kd-admin-open", on);
    const apply = () => {
      const desktop = window.matchMedia("(min-width: 761px)").matches;
      document.body.style.transition = "width .24s var(--ease, ease)";
      document.body.style.width = on && desktop ? "calc(100% - 374px)" : "";
    };
    apply();
    window.addEventListener("resize", apply);
    return () => {
      window.removeEventListener("resize", apply);
      document.documentElement.classList.remove("kd-admin-open");
      document.body.style.width = "";
    };
  }, [st.enabled, editing]);

  if (!st.enabled) return null;

  // Mode aperçu = vue visiteur : aucune chrome d'édition, juste une barre flottante
  if (!editing) {
    return (
      <div className="preview-bar" role="group" aria-label="Mode administrateur — aperçu">
        <button className="pv-mode" onClick={() => update({ mode: "edit" })}>✎ Édition</button>
        <button className="pv-mode on" onClick={() => update({ mode: "preview" })}>👁 Aperçu</button>
        <button className="pv-close" title="Fermer (revenir au site)" aria-label="Fermer"
          onClick={() => update({ enabled: false })}>×</button>
      </div>
    );
  }

  const TABS = [
    ["aide", "Aide"],
    ["apparence", "Apparence"],
    ["styles", "Styles"],
    ["promos", "Promos"],
    ["sections", "Sections"],
  ];

  return (
    <aside className="admin-panel" aria-label="Mode administrateur">
      <header className="ap-top">
        <div className="ap-brand">
          <Monogram size={26} />
          <span>Mode administrateur</span>
        </div>
        <button className="ap-close" title="Fermer (revenir au site)" aria-label="Fermer"
          onClick={() => update({ enabled: false })}>×</button>
      </header>

      <div className="ap-modes">
        <button className="ap-mode on" onClick={() => update({ mode: "edit" })}>
          ✎ Édition</button>
        <button className="ap-mode" onClick={() => update({ mode: "preview" })}>
          👁 Aperçu</button>
      </div>

      <nav className="ap-tabs" role="tablist">
        {TABS.map(([id, lbl]) => (
          <button key={id} role="tab" aria-selected={tab === id}
            className={"ap-tab" + (tab === id ? " on" : "")} onClick={() => setTab(id)}>{lbl}</button>
        ))}
      </nav>

      <div className="ap-body">
        {tab === "aide" && <TabAide />}
        {tab === "apparence" && <TabApparence />}
        {tab === "styles" && <TabStylesV3 />}
        {tab === "promos" && <TabPromos />}
        {tab === "sections" && <TabSections />}
      </div>

      <footer className="ap-foot">
        <span className="ap-mock">Maquette de discussion · sauvegarde navigateur</span>
        <button className="ap-reset" onClick={resetAll} title="Tout réinitialiser">Réinitialiser</button>
      </footer>
    </aside>
  );
}

Object.assign(window, { AdminToggle, AdminPanel });
