/* ============================================================
   Masonry éditorial — respecte les ratios naturels des photos.
   Portrait reste portrait, paysage reste paysage, carré reste carré.
   Aucun recadrage forcé. Protection + lightbox intégrées.
   ============================================================ */

/* Sélection éditoriale courte et variée (accueil) : max N, varié par catégorie. */
function kdEditorialPick(items, n, perCat) {
  n = n || 8; perCat = perCat || 2;
  var out = [], counts = {};
  for (var i = 0; i < items.length && out.length < n; i++) {
    var it = items[i];
    var c = (it.tags && it.tags.length ? it.tags[0] : it.catIdx) || 0;
    counts[c] = counts[c] || 0;
    if (counts[c] < perCat) { out.push(it); counts[c]++; }
  }
  // Complète si besoin (catégories peu fournies) pour atteindre n.
  if (out.length < n) {
    for (var j = 0; j < items.length && out.length < n; j++) {
      if (out.indexOf(items[j]) === -1) out.push(items[j]);
    }
  }
  return out;
}

/* Onglets de filtre par INDEX réel (permet de masquer les catégories vides). */
function PortfolioFiltersIdx({ tabs, activeIdx, onSelect, label }) {
  return (
    <div className="pf-filters reveal in" data-d="1" role="tablist" aria-label={label}>
      {tabs.map((t) => (
        <button key={t.idx} role="tab" aria-selected={activeIdx === t.idx}
          className={"pf-tab" + (activeIdx === t.idx ? " on" : "")}
          onClick={() => onSelect(t.idx)}>{t.label}</button>
      ))}
    </div>
  );
}

/* Grille maçonnée en colonnes CSS — chaque image garde son ratio. */
function MasonryGrid({ items, variant }) {
  const [lb, setLb] = useState(-1);
  return (
    <React.Fragment>
      <div className={"pf-masonry" + (variant ? " pf-masonry--" + variant : "")}>
        {items.map((it, i) => (
          <a key={it.src + "-" + i} href={it.src} className="m-item"
            style={{ animationDelay: ((i % 8) * 45) + "ms" }}
            aria-label={it.alt}
            onClick={(e) => { e.preventDefault(); setLb(i); }}>
            <VirtualImg item={it} />
            <span className="m-cap"><strong>{it.title}</strong>{it.tags && it.tags.length ? <em>{window.KD.portfolio.filters[it.tags[0]]}</em> : null}</span>
          </a>
        ))}
      </div>
      {lb >= 0 && <Lightbox items={items} index={lb} setIndex={setLb} onClose={() => setLb(-1)} />}
    </React.Fragment>
  );
}

Object.assign(window, { MasonryGrid, PortfolioFiltersIdx, kdEditorialPick });

/* Image virtualisée : montée seulement à l'approche du viewport, démontée
   au loin (DOM allégé, images HD conservées), fondu doux au (re)retour.
   La hauteur du logement est conservée pour éviter tout saut de mise en page. */
function VirtualImg({ item }) {
  const ref = React.useRef(null);
  const [near, setNear] = React.useState(false);
  const [everSeen, setEverSeen] = React.useState(false);
  const [h, setH] = React.useState(0);
  const [shown, setShown] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") { setNear(true); setEverSeen(true); return; }
    const io = new IntersectionObserver((ents) => {
      ents.forEach((e) => {
        setNear(e.isIntersecting);
        if (e.isIntersecting) setEverSeen(true);
      });
    }, { rootMargin: "900px 0px 900px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Tant qu'une image n'a jamais été vue, on la garde montée (jamais de blanc,
  // robuste hors écran / export). Une fois vue puis éloignée → on l'allège du DOM.
  const show = near || !everSeen;
  React.useEffect(() => { if (!show) setShown(false); }, [show]);

  // Révèle l'image (mesure + fondu). Robuste aux images déjà en cache.
  // On mesure la HAUTEUR DE L'IMAGE (pas du logement, gonflé par le min-height
  // de réservation) — sinon le cadre reste figé à 240px et laisse un vide.
  const settle = React.useCallback(() => {
    const fr = ref.current;
    const img = fr && fr.querySelector("img");
    if (img && img.offsetHeight) setH(img.offsetHeight);
    setShown(true);
  }, []);
  const onLoad = () => requestAnimationFrame(settle);
  // Image déjà complète au montage (cache) : onLoad ne se déclenche pas → on révèle direct.
  const imgRefCb = (el) => { if (el && el.complete && el.naturalWidth > 0) requestAnimationFrame(settle); };
  // Filet de sécurité : jamais d'image bloquée invisible.
  React.useEffect(() => {
    if (!show) return;
    const t = setTimeout(() => setShown(true), 1500);
    return () => clearTimeout(t);
  }, [show]);

  // La réservation de hauteur suit EXACTEMENT la hauteur rendue de la photo.
  // On sonde en rAF jusqu'à connaître ses dimensions (l'événement load n'est pas
  // fiable ici), puis on cale minHeight dessus → zéro espace vide sous une image
  // paysage. Re-mesure au redimensionnement de la fenêtre.
  React.useEffect(() => {
    if (!show) return;
    const fr = ref.current;
    const img = fr && fr.querySelector("img");
    if (!img) return;
    let raf = 0, tries = 0;
    const measure = () => { if (img.offsetHeight) { setH(img.offsetHeight); return true; } return false; };
    const tick = () => { if (!measure() && tries++ < 180) raf = requestAnimationFrame(tick); };
    tick();
    const onResize = () => measure();
    window.addEventListener("resize", onResize);
    return () => { if (raf) cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); };
  }, [show]);

  // Réservation de hauteur (anti-saut). Une fois la photo mesurée, minHeight = sa
  // hauteur exacte → le cadre l'épouse, sans espace vide. Avant mesure : 240px.
  const style = h ? { minHeight: h + "px" } : { minHeight: "240px" };
  return (
    <span className="m-frame" ref={ref} style={style}>
      {show ? <GuardedImage item={item} className={"m-img" + (shown ? " in" : "")} onLoad={onLoad} innerRef={imgRefCb} /> : null}
    </span>
  );
}

Object.assign(window, { VirtualImg });
