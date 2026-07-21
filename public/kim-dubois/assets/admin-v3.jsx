/* ============================================================
   Admin V3 — Codes promo / ambassadeurs + Styles planifiés
   Composants greffés au mode administrateur existant (contexte useEditor).
   ============================================================ */

const KD_PROMO_TYPES = [
  { v: "free",    label: "Photo gratuite",     unit: "" },
  { v: "fixed",   label: "Rabais fixe",        unit: "$" },
  { v: "percent", label: "Rabais (%)",         unit: "%" },
  { v: "shop",    label: "Crédit boutique",    unit: "$" },
  { v: "session", label: "Crédit séance",      unit: "$" },
];

function kdPromoAdvantage(p) {
  const t = KD_PROMO_TYPES.find((x) => x.v === p.type) || KD_PROMO_TYPES[2];
  if (p.type === "free") return "Photo gratuite";
  if (p.type === "percent") return (p.value || 0) + " % de rabais";
  if (p.type === "fixed") return (p.value || 0) + " $ de rabais";
  return (p.value || 0) + " $ — " + t.label.toLowerCase();
}

function kdPromoStatus(p) {
  const now = Date.now();
  const s = p.start ? Date.parse(p.start) : null;
  const e = p.end ? Date.parse(p.end + "T23:59:59") : null;
  if (s && now < s) return { k: "scheduled", label: "À venir" };
  if (e && now > e) return { k: "expired", label: "Expiré" };
  return { k: "active", label: "Actif" };
}

function kdStyleStatus(sty) {
  if (!sty.start || !sty.end) return null;
  const now = Date.now(), s = Date.parse(sty.start), e = Date.parse(sty.end);
  if (isNaN(s) || isNaN(e)) return null;
  if (now < s) return { k: "scheduled", label: "Planifié" };
  if (now > e) return { k: "expired", label: "Terminé" };
  return { k: "live", label: "En cours" };
}

function kdFmtWhen(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("fr-CA", { day: "2-digit", month: "short" }) + " · " +
           d.toLocaleTimeString("fr-CA", { hour: "2-digit", minute: "2-digit" });
  } catch (e) { return ""; }
}

/* ---------------- Onglet PROMOS ---------------- */
function PromoRow({ p }) {
  const { updatePromo, deletePromo, addPromoBooking, flash } = useEditor();
  const status = kdPromoStatus(p);
  const link = "https://kimduboisphoto.com/?ref=" + encodeURIComponent((p.code || "CODE").trim());
  const copy = () => {
    try { navigator.clipboard && navigator.clipboard.writeText(link); flash("Lien copié ✓"); } catch (e) {}
  };
  const typeObj = KD_PROMO_TYPES.find((x) => x.v === p.type) || KD_PROMO_TYPES[2];
  return (
    <li className={"promo-card status-" + status.k}>
      <div className="promo-top">
        <input className="promo-code" value={p.code} placeholder="CODE"
          onChange={(e) => updatePromo(p.id, { code: e.target.value.toUpperCase() })} />
        <span className={"promo-badge " + status.k}>{status.label}</span>
        <button className="mini ghost danger promo-del" title="Supprimer" onClick={() => deletePromo(p.id)}>🗑</button>
      </div>

      <div className="promo-grid">
        <label className="promo-f">
          <span>Ambassadeur·rice</span>
          <input value={p.ambassador} placeholder="Nom"
            onChange={(e) => updatePromo(p.id, { ambassador: e.target.value })} />
        </label>
        <label className="promo-f">
          <span>Avantage</span>
          <select value={p.type} onChange={(e) => updatePromo(p.id, { type: e.target.value })}>
            {KD_PROMO_TYPES.map((t) => <option key={t.v} value={t.v}>{t.label}</option>)}
          </select>
        </label>
        {p.type !== "free" && (
          <label className="promo-f promo-f--sm">
            <span>Valeur{typeObj.unit ? " (" + typeObj.unit + ")" : ""}</span>
            <input type="number" min="0" value={p.value}
              onChange={(e) => updatePromo(p.id, { value: parseFloat(e.target.value) || 0 })} />
          </label>
        )}
        <label className="promo-f promo-f--sm">
          <span>Début</span>
          <input type="date" value={p.start} onChange={(e) => updatePromo(p.id, { start: e.target.value })} />
        </label>
        <label className="promo-f promo-f--sm">
          <span>Fin</span>
          <input type="date" value={p.end} onChange={(e) => updatePromo(p.id, { end: e.target.value })} />
        </label>
      </div>

      <div className="promo-foot">
        <button className="promo-link" title="Copier le lien d’affiliation" onClick={copy}>
          <span className="promo-link-ico" aria-hidden="true">🔗</span>
          <span className="promo-link-txt">{link.replace("https://", "")}</span>
        </button>
        <div className="promo-track">
          <span className="promo-track-n">{p.bookings || 0}</span>
          <span className="promo-track-l">réservation{(p.bookings || 0) > 1 ? "s" : ""}</span>
          <button className="mini ghost" title="Simuler une réservation" onClick={() => addPromoBooking(p.id)}>+1</button>
        </div>
      </div>
    </li>
  );
}

function TabPromos() {
  const { st, addPromo } = useEditor();
  const [code, setCode] = React.useState("");
  const [amb, setAmb] = React.useState("");
  const [type, setType] = React.useState("percent");
  const [value, setValue] = React.useState(15);

  const create = () => {
    addPromo({ code: code.trim().toUpperCase() || "PROMO", ambassador: amb.trim(), type, value });
    setCode(""); setAmb("");
  };

  const active = st.promos.filter((p) => kdPromoStatus(p).k === "active").length;

  return (
    <div className="ed-tabpane">
      <div className="ed-block">
        <div className="ed-head">
          <span className="ed-title">Codes promo & ambassadeurs</span>
          <span className="ed-hint">Créez un code, liez-le à un·e ambassadeur·rice, suivez les réservations générées.</span>
        </div>

        <div className="promo-create">
          <div className="promo-create-row">
            <input className="pc-code" value={code} placeholder="LUNA15"
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              onKeyDown={(e) => { if (e.key === "Enter") create(); }} />
            <input className="pc-amb" value={amb} placeholder="Ambassadeur·rice (ex. Luna)"
              onChange={(e) => setAmb(e.target.value)} />
          </div>
          <div className="promo-create-row">
            <select value={type} onChange={(e) => setType(e.target.value)}>
              {KD_PROMO_TYPES.map((t) => <option key={t.v} value={t.v}>{t.label}</option>)}
            </select>
            {type !== "free" && (
              <input className="pc-val" type="number" min="0" value={value}
                onChange={(e) => setValue(parseFloat(e.target.value) || 0)} />
            )}
            <button className="mini solid" onClick={create}>Créer le code</button>
          </div>
        </div>

        {st.promos.length === 0 && (
          <p className="ed-empty">Aucun code pour l’instant. Essayez « LUNA15 », « THEO-GRATUIT » ou « STUDIO20 ».</p>
        )}
      </div>

      {st.promos.length > 0 && (
        <div className="ed-block">
          <div className="ed-head">
            <span className="ed-title">{st.promos.length} code{st.promos.length > 1 ? "s" : ""} · {active} actif{active > 1 ? "s" : ""}</span>
          </div>
          <ul className="promo-list">
            {st.promos.map((p) => <PromoRow key={p.id} p={p} />)}
          </ul>
        </div>
      )}
    </div>
  );
}

/* ---------------- Onglet STYLES (enrichi : aperçu + planification + historique) ---------------- */
function TabStylesV3() {
  const { st, createStyle, applyStyle, saveStyle, renameStyle, deleteStyle,
    previewStyle, setStyleSchedule, revertToDefault } = useEditor();
  const [name, setName] = React.useState("");
  const [editId, setEditId] = React.useState(null);
  const [editName, setEditName] = React.useState("");
  const [schedId, setSchedId] = React.useState(null);

  return (
    <div className="ed-tabpane">
      <div className="ed-block">
        <div className="ed-head">
          <span className="ed-title">Styles enregistrés & planifiés</span>
          <span className="ed-hint">Plusieurs looks, prévisualisables, activables tout de suite ou à une date. Textes et photos ne bougent pas.</span>
        </div>

        {st.styles.length === 0 && (
          <p className="ed-empty">Aucun style. Réglez l’apparence dans l’onglet « Apparence », puis créez-en un (Noël, Automne, Expo féline…).</p>
        )}

        <ul className="style-list">
          {st.styles.map((sty) => {
            const status = kdStyleStatus(sty);
            const isActive = st.activeStyleId === sty.id;
            return (
              <li key={sty.id} className={"style-item" + (isActive ? " active" : "")}>
                <div className="style-main">
                  <span className="style-mark" style={{ background: sty.snap.primary }} aria-hidden="true">{isActive ? "✦" : ""}</span>
                  {editId === sty.id ? (
                    <input className="style-rename" autoFocus value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onBlur={() => { renameStyle(sty.id, editName || sty.name); setEditId(null); }}
                      onKeyDown={(e) => { if (e.key === "Enter") { renameStyle(sty.id, editName || sty.name); setEditId(null); } }} />
                  ) : (
                    <span className="style-name" title="Double-cliquer pour renommer" onDoubleClick={() => { setEditId(sty.id); setEditName(sty.name); }}>{sty.name}</span>
                  )}
                  {status && <span className={"style-status " + status.k}>{status.label}</span>}
                  <span className="style-swatches" aria-hidden="true">
                    <i style={{ background: sty.snap.primary }}></i>
                    <i style={{ background: sty.snap.secondary }}></i>
                  </span>
                </div>
                <div className="style-actions">
                  <button className="mini" onClick={() => applyStyle(sty.id)}>Activer</button>
                  <button className="mini ghost" title="Aperçu temporaire (4 s)" onClick={() => previewStyle(sty.id)}>Aperçu</button>
                  <button className="mini ghost" title="Planifier une date" onClick={() => setSchedId(schedId === sty.id ? null : sty.id)}>📅</button>
                  <button className="mini ghost" title="Sauvegarder l’apparence actuelle ici" onClick={() => saveStyle(sty.id)}>Sauver</button>
                  <button className="mini ghost" title="Renommer" onClick={() => { setEditId(sty.id); setEditName(sty.name); }}>✎</button>
                  <button className="mini ghost danger" title="Supprimer" onClick={() => deleteStyle(sty.id)}>🗑</button>
                </div>
                {(schedId === sty.id || (sty.start && sty.end)) && (
                  <div className="style-sched">
                    <label><span>Activer le</span>
                      <input type="datetime-local" value={sty.start || ""}
                        onChange={(e) => setStyleSchedule(sty.id, { start: e.target.value })} /></label>
                    <label><span>Jusqu’au</span>
                      <input type="datetime-local" value={sty.end || ""}
                        onChange={(e) => setStyleSchedule(sty.id, { end: e.target.value })} /></label>
                    {(sty.start || sty.end) && (
                      <button className="mini ghost" onClick={() => setStyleSchedule(sty.id, { start: "", end: "" })}>Effacer la planification</button>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        <div className="style-create">
          <input value={name} placeholder="Nom du style (ex. « Temps des fêtes »)"
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && name.trim()) { createStyle(name.trim()); setName(""); } }} />
          <button className="mini solid" disabled={!name.trim()}
            onClick={() => { createStyle(name.trim()); setName(""); }}>Créer ce style</button>
        </div>

        <button className="style-default" onClick={revertToDefault}>↺ Revenir au style par défaut</button>
      </div>

      {st.styleHistory && st.styleHistory.length > 0 && (
        <div className="ed-block">
          <div className="ed-head"><span className="ed-title">Historique</span>
            <span className="ed-hint">Derniers styles enregistrés et activés.</span></div>
          <ul className="style-hist">
            {st.styleHistory.slice(0, 8).map((h, i) => (
              <li key={i}>
                <span className="sh-name">{h.name}</span>
                <span className="sh-act">{h.action}</span>
                <span className="sh-when">{kdFmtWhen(h.at)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

Object.assign(window, { TabPromos, TabStylesV3, KD_PROMO_TYPES });

/* ---------------- Bannière promo PUBLIQUE (site visible) ----------------
   S'affiche automatiquement quand un code est actif. Le visuel change selon
   le type d'avantage. Un lien ?ref=CODE met en avant ce code précis. */
function kdPromoTheme(type) {
  switch (type) {
    case "free":    return { cls: "is-free",    ico: "★", tag: "Offert" };
    case "shop":    return { cls: "is-shop",    ico: "❦", tag: "Boutique" };
    case "session": return { cls: "is-session", ico: "❦", tag: "Séance" };
    case "fixed":   return { cls: "is-fixed",   ico: "%", tag: "Économie" };
    default:        return { cls: "is-percent", ico: "%", tag: "Rabais" };
  }
}

function PromoBanner() {
  const { st } = useEditor();
  const active = (st.promos || []).filter((p) => kdPromoStatus(p).k === "active" && (p.code || "").trim());
  const ref = React.useMemo(() => {
    try { return (new URLSearchParams(location.search).get("ref") || "").trim().toUpperCase(); } catch (e) { return ""; }
  }, []);
  const promo = React.useMemo(() => {
    if (!active.length) return null;
    if (ref) { const m = active.find((p) => (p.code || "").trim().toUpperCase() === ref); if (m) return m; }
    return active[0];
  }, [active, ref]);

  const [closed, setClosed] = React.useState(false);
  React.useEffect(() => {
    if (!promo) return;
    try { setClosed(sessionStorage.getItem("kd-promo-x") === promo.id); } catch (e) {}
  }, [promo && promo.id]);
  if (!promo || closed) return null;

  const th = kdPromoTheme(promo.type);
  const advantage = kdPromoAdvantage(promo);
  const matched = ref && (promo.code || "").trim().toUpperCase() === ref;
  const close = () => {
    setClosed(true);
    try { sessionStorage.setItem("kd-promo-x", promo.id); } catch (e) {}
  };
  return (
    <aside className={"promo-banner " + th.cls} role="region" aria-label="Offre en cours">
      <span className="pb-ico" aria-hidden="true">{th.ico}</span>
      <span className="pb-tag">{th.tag}</span>
      <p className="pb-txt">
        {matched && promo.ambassador
          ? <React.Fragment>Grâce à <strong>{promo.ambassador}</strong>, profitez de </React.Fragment>
          : "Offre en cours : "}
        <strong className="pb-adv">{advantage}</strong>
        <span className="pb-code"> avec le code <b>{(promo.code || "").trim()}</b></span>
      </p>
      <a className="pb-cta" href="#contact">Réserver ma séance</a>
      <button className="pb-close" aria-label="Fermer l’offre" onClick={close}>×</button>
    </aside>
  );
}

Object.assign(window, { PromoBanner, kdPromoStatus, kdPromoAdvantage });

/* Promo actif retenu pour l'affichage public (même logique que la bannière) */
function kdActivePromo(promos) {
  const active = (promos || []).filter((p) => kdPromoStatus(p).k === "active" && (p.code || "").trim());
  if (!active.length) return null;
  let ref = "";
  try { ref = (new URLSearchParams(location.search).get("ref") || "").trim().toUpperCase(); } catch (e) {}
  if (ref) { const m = active.find((p) => (p.code || "").trim().toUpperCase() === ref); if (m) return m; }
  return active[0];
}

/* Applique un promo à une chaîne de prix ("dès 300 $", "dès 15 $ / photo", "sur soumission").
   Renvoie null si aucun effet visuel, sinon { kind, wasText, nowText, chip, note }. */
function kdApplyPromoToPrice(priceStr, promo) {
  if (!promo) return null;
  const s = String(priceStr || "");
  if (promo.type === "free") return { kind: "gift", note: "1 photo offerte avec « " + (promo.code || "").trim() + " »" };
  if (promo.type === "shop") return { kind: "credit", note: "+ " + (promo.value || 0) + " $ de crédit boutique" };
  const m = s.match(/(\d[\d\s]*)\s*\$/);
  if (!m) return null;                                  // « sur soumission »
  const base = parseInt(m[1].replace(/\s/g, ""), 10);
  if (!base) return null;
  const perPhoto = /photo/i.test(s);
  let now = base;
  if (promo.type === "percent") now = Math.round(base * (1 - (promo.value || 0) / 100));
  else if (promo.type === "fixed") now = Math.max(0, base - (promo.value || 0));
  else if (promo.type === "session") { if (perPhoto) return null; now = Math.max(0, base - (promo.value || 0)); }
  if (now === base) return null;
  const suffix = perPhoto ? " $ / photo" : " $";
  const prefix = s.slice(0, m.index).replace(/\s*$/, "");                     // « dès »
  const applied = promo.type === "session" ? "Crédit appliqué" : "Rabais appliqué";
  return { kind: "cut", wasText: base + suffix, nowText: (prefix ? prefix + " " : "") + now + suffix, applied };
}

Object.assign(window, { kdActivePromo, kdApplyPromoToPrice });
