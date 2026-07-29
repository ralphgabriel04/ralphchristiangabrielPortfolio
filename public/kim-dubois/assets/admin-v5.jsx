/* ============================================================
   Mode administrateur v5 — chrome à 3 dispositions + Historique
   • Barre (paysage) en haut · Panneau (portrait) à droite · Pastille
   • Journal des modifications, publications restaurables, annuler/rétablir
   ============================================================ */

/* Icônes de disposition (glyphes d'interface, pas d'illustration) */
const CH_ICONS = {
  bar: <svg viewBox="0 0 22 16" width="19" height="14" aria-hidden="true"><rect x="1.2" y="2.2" width="19.6" height="11.6" rx="2.2" fill="none" stroke="currentColor" strokeWidth="1.5" /><rect x="1.2" y="2.2" width="19.6" height="3.6" rx="1.8" fill="currentColor" /></svg>,
  panel: <svg viewBox="0 0 16 22" width="14" height="19" aria-hidden="true"><rect x="1.2" y="1.2" width="13.6" height="19.6" rx="2.2" fill="none" stroke="currentColor" strokeWidth="1.5" /><rect x="9.6" y="1.2" width="5.2" height="19.6" rx="2" fill="currentColor" /></svg>,
  dot: <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true"><circle cx="8" cy="8" r="3.6" fill="currentColor" /></svg>,
};
const CH_LABELS = { bar: "Barre en haut", panel: "Panneau à droite", dot: "Réduire en pastille" };

function ChromeSwitch() {
  const { st, setChrome } = useEditor();
  return (
    <div className="ch-switch" role="group" aria-label="Disposition des outils">
      {["bar", "panel", "dot"].map((v) => (
        <button key={v} type="button" className={"ch-btn" + (st.chrome === v ? " on" : "")}
          title={CH_LABELS[v]} aria-label={CH_LABELS[v]} aria-pressed={st.chrome === v}
          onClick={() => setChrome(v)}>{CH_ICONS[v]}</button>
      ))}
    </div>
  );
}

function SaveChip({ compact }) {
  const { st } = useEditor();
  const s = st.saveState;
  const k = s === "error" ? "err" : s === "saving" ? "busy" : st.dirty ? "warn" : "ok";
  const txt = s === "error" ? "Échec de sauvegarde"
    : s === "saving" ? "Enregistrement…"
    : st.dirty ? "Modifications non publiées" : "Aucune modification";
  return (
    <span className={"save-chip k-" + k + (compact ? " compact" : "")} title={txt} aria-live="polite">
      <i className="sc-dot" aria-hidden="true"></i><span className="sc-txt">{txt}</span>
    </span>
  );
}

function HistoryBtns() {
  const { undo, redo, canUndo, canRedo } = useEditor();
  return (
    <div className="hb-group">
      <button className="hb-btn" onClick={undo} disabled={!canUndo} title="Annuler (⌘Z)" aria-label="Annuler">↶</button>
      <button className="hb-btn" onClick={redo} disabled={!canRedo} title="Rétablir (⇧⌘Z)" aria-label="Rétablir">↷</button>
    </div>
  );
}

/* Onglet HISTORIQUE ------------------------------------------------------ */
function TabHistorique() {
  const { st, publish, restorePublication, simulateSaveError, retrySave, clearJournal } = useEditor();
  const pubs = st.publications || [];
  const jr = st.journal || [];
  return (
    <div className="ed-tabpane">
      <div className="ed-block">
        <div className="ed-head">
          <span className="ed-title">Publication</span>
          <span className="ed-hint">Vos changements restent un brouillon. Le site public ne bouge qu’à la publication.</span>
        </div>
        <div className="hist-publish">
          <SaveChip />
          <button className="mini solid" disabled={!st.dirty} onClick={() => publish("Kim")}>Publier</button>
        </div>
        {pubs.length === 0
          ? <p className="ed-empty">Aucune publication pour l’instant. Publiez une première fois : chaque version restera restaurable ici.</p>
          : <ul className="pub-list">
              {pubs.map((p) => (
                <li className="pub-item" key={p.id}>
                  <span className="pub-i"><b>Publication</b><i>{kdFmtJ(p.at)} · {p.by}</i></span>
                  <button className="mini" onClick={() => restorePublication(p.id)}>Restaurer</button>
                </li>
              ))}
            </ul>}
      </div>

      <div className="ed-block">
        <div className="ed-head">
          <span className="ed-title">Journal des modifications</span>
          <span className="ed-hint">Les 80 derniers gestes, du plus récent au plus ancien. Faites défiler pour remonter.</span>
        </div>
        {jr.length === 0
          ? <p className="ed-empty">Rien encore. Changez un texte, une photo ou une couleur : tout s’inscrit ici.</p>
          : <ol className="jr-list">
              {jr.map((e) => (
                <li key={e.id} className={"jr-item k-" + (e.kind || "edit")}>
                  <time>{kdFmtJ(e.at)}</time><span>{e.label}</span>
                </li>
              ))}
            </ol>}
        <div className="jr-foot">
          <p>Sauvegarde côté serveur, brouillon séparé du contenu publié, session fermée après 15 min d’inactivité. Aucun mot de passe conservé dans le navigateur.</p>
          <div className="jr-fbtns">
            {st.saveState === "error"
              ? <button className="mini solid" onClick={retrySave}>Réessayer la sauvegarde</button>
              : <button className="mini ghost danger" onClick={simulateSaveError}>Simuler une erreur de sauvegarde</button>}
            <button className="mini ghost" onClick={clearJournal} disabled={!jr.length}>Vider le journal</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Onglets partagés ------------------------------------------------------- */
const KD_TABS = [
  ["aide", "Aide"],
  ["apparence", "Apparence"],
  ["styles", "Styles"],
  ["promos", "Promos"],
  ["sections", "Sections"],
  ["historique", "Historique"],
];

function TabPane({ tab }) {
  if (tab === "aide") return <TabAide />;
  if (tab === "apparence") return <TabApparence />;
  if (tab === "styles") return <TabStylesV3 />;
  if (tab === "promos") return <TabPromos />;
  if (tab === "sections") return <TabSections />;
  if (tab === "historique") return <TabHistorique />;
  return null;
}

/* Rangée d'onglets défilante (flèches quand ça déborde) ------------------ */
function TabStrip({ tab, setTab, onPick }) {
  const ref = React.useRef(null);
  const [ov, setOv] = React.useState({ l: false, r: false });
  const sync = React.useCallback(() => {
    const el = ref.current; if (!el) return;
    setOv({ l: el.scrollLeft > 4, r: el.scrollLeft + el.clientWidth < el.scrollWidth - 4 });
  }, []);
  React.useEffect(() => { sync(); window.addEventListener("resize", sync); return () => window.removeEventListener("resize", sync); }, [sync]);
  const nudge = (d) => { const el = ref.current; if (el) el.scrollBy({ left: d * 130, behavior: "smooth" }); };
  return (
    <div className={"tabstrip" + (ov.l ? " ov-l" : "") + (ov.r ? " ov-r" : "")}>
      <button className="ts-arrow l" aria-label="Onglets précédents" tabIndex={-1} onClick={() => nudge(-1)}>‹</button>
      <div className="ts-scroll" ref={ref} onScroll={sync} role="tablist">
        {KD_TABS.map(([id, lbl]) => (
          <button key={id} role="tab" aria-selected={tab === id}
            className={"ap-tab" + (tab === id ? " on" : "")}
            onClick={() => { setTab(id); if (onPick) onPick(id); }}>{lbl}</button>
        ))}
      </div>
      <button className="ts-arrow r" aria-label="Onglets suivants" tabIndex={-1} onClick={() => nudge(1)}>›</button>
    </div>
  );
}

/* Chrome principal ------------------------------------------------------- */
function AdminShellV5() {
  const { st, update, resetAll, setChrome, undo, redo, publish } = useEditor();
  const [tab, setTab] = React.useState("apparence");
  const [open, setOpen] = React.useState(false); // tiroir de la barre paysage
  const editing = st.mode === "edit";
  const chrome = st.chrome || "panel";

  // Décalage du site : largeur (panneau) ou hauteur (barre) — jamais de chevauchement
  React.useEffect(() => {
    const on = st.enabled && editing;
    const isPanel = on && chrome === "panel";
    const isBar = on && chrome === "bar";
    const root = document.documentElement;
    root.classList.toggle("kd-admin-open", isPanel);
    root.classList.toggle("kd-adminbar-open", isBar);
    const apply = () => {
      const desktop = window.matchMedia("(min-width: 761px)").matches;
      document.body.style.transition = "width .24s var(--ease, ease), padding-top .24s var(--ease, ease)";
      document.body.style.width = isPanel && desktop ? "calc(100% - 374px)" : "";
      document.body.style.paddingTop = isBar ? "var(--kd-barh, 104px)" : "";
    };
    apply();
    window.addEventListener("resize", apply);
    return () => {
      window.removeEventListener("resize", apply);
      root.classList.remove("kd-admin-open", "kd-adminbar-open");
      document.body.style.width = "";
      document.body.style.paddingTop = "";
    };
  }, [st.enabled, editing, chrome]);

  // Raccourcis ⌘Z / ⇧⌘Z hors zone de saisie
  React.useEffect(() => {
    if (!st.enabled || !editing) return;
    const onKey = (e) => {
      const t = e.target;
      if (t && (t.isContentEditable || /^(input|textarea|select)$/i.test(t.tagName || ""))) return;
      if ((e.metaKey || e.ctrlKey) && (e.key === "z" || e.key === "Z")) {
        e.preventDefault(); e.shiftKey ? redo() : undo();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [st.enabled, editing, undo, redo]);

  if (!st.enabled) return null;

  /* Aperçu visiteur : aucune chrome d'édition */
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

  /* Pastille : tout replié, le site respire */
  if (chrome === "dot") {
    return (
      <div className="adm-dot-wrap">
        <SaveChip compact />
        <button className="adm-dot" title="Rouvrir les outils d’administration" aria-label="Rouvrir les outils"
          onClick={() => setChrome("panel")}>
          <Monogram size={24} />
        </button>
      </div>
    );
  }

  /* Barre paysage en haut ------------------------------------------------ */
  if (chrome === "bar") {
    return (
      <header className="adm-bar" aria-label="Mode administrateur">
        <div className="ab-row">
          <div className="ab-brand">
            <Monogram size={26} />
            <span className="ab-names"><b>KIM DUBOIS</b><i>MODE ADMINISTRATEUR</i></span>
          </div>
          <SaveChip />
          <div className="ab-modes">
            <button className="ab-mode on" onClick={() => update({ mode: "edit" })}>Édition</button>
            <button className="ab-mode" onClick={() => update({ mode: "preview" })}>Aperçu visiteur</button>
          </div>
          <div className="ab-actions">
            <HistoryBtns />
            <button className="mini solid ab-pub" disabled={!st.dirty} onClick={() => publish("Kim")}>Publier</button>
            <ChromeSwitch />
            <button className="hb-btn" title="Fermer (revenir au site)" aria-label="Fermer"
              onClick={() => update({ enabled: false })}>×</button>
          </div>
        </div>

        <div className="ab-tabsrow">
          <TabStrip tab={tab} setTab={setTab} onPick={(id) => setOpen((o) => (id === tab ? !o : true))} />
          <button className="ab-toggle" onClick={() => setOpen((o) => !o)}
            aria-expanded={open}>{open ? "Replier ▴" : "Déplier ▾"}</button>
        </div>

        <div className={"ab-drawer" + (open ? " open" : "")}>
          <div className="ab-drawerbody"><TabPane tab={tab} /></div>
          <div className="ab-drawerfoot">
            <span className="ap-mock">Maquette de discussion · sauvegarde navigateur</span>
            <button className="ap-reset" onClick={resetAll}>Réinitialiser</button>
          </div>
        </div>
      </header>
    );
  }

  /* Panneau portrait à droite -------------------------------------------- */
  return (
    <aside className="admin-panel" aria-label="Mode administrateur">
      <header className="ap-top">
        <div className="ap-brand"><Monogram size={26} /><span>Mode administrateur</span></div>
        <div className="ap-topact">
          <ChromeSwitch />
          <button className="ap-close" title="Fermer (revenir au site)" aria-label="Fermer"
            onClick={() => update({ enabled: false })}>×</button>
        </div>
      </header>

      <div className="ap-modes">
        <button className="ap-mode on" onClick={() => update({ mode: "edit" })}>✎ Édition</button>
        <button className="ap-mode" onClick={() => update({ mode: "preview" })}>👁 Aperçu</button>
      </div>

      <div className="ap-statusrow">
        <SaveChip />
        <HistoryBtns />
      </div>

      <TabStrip tab={tab} setTab={setTab} />

      <div className="ap-body"><TabPane tab={tab} /></div>

      <footer className="ap-foot">
        <button className="mini solid" disabled={!st.dirty} onClick={() => publish("Kim")}>Publier</button>
        <span className="ap-mock">Sauvegarde navigateur</span>
        <button className="ap-reset" onClick={resetAll} title="Tout réinitialiser">Réinitialiser</button>
      </footer>
    </aside>
  );
}

Object.assign(window, { AdminPanel: AdminShellV5, AdminShellV5, TabHistorique, SaveChip, ChromeSwitch });
