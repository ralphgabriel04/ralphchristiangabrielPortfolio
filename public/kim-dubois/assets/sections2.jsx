/* Aperçu portfolio filtrable + À propos + Séances (forfaits) */

/* Onglets de filtre — partagés (accueil + page) */
function PortfolioFilters({ filters, activeIdx, onSelect, label }) {
  return (
    <div className="pf-filters reveal in" data-d="1" role="tablist" aria-label={label}>
      {filters.map((f, i) => (
        <button key={f} role="tab" aria-selected={activeIdx === i}
          className={"pf-tab" + (activeIdx === i ? " on" : "")}
          onClick={() => onSelect(i)}>{f}</button>
      ))}
    </div>
  );
}

/* Visionneuse plein écran — partagée (grille, carrousel, solo) */
function Lightbox({ items, index, setIndex, onClose }) {
  const [paused, setPaused] = useState(false);
  const go = useCallback((d) => setIndex((i) => {
    const n = i + d; return n < 0 ? items.length - 1 : n >= items.length ? 0 : n;
  }), [items.length, setIndex]);
  // Défilement auto : image suivante après 5 s (en pause au survol)
  useEffect(() => {
    if (items.length <= 1 || paused) return;
    const t = setTimeout(() => go(1), 5000);
    return () => clearTimeout(t);
  }, [index, items.length, paused, go]);
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [go, onClose]);
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);
  const it = items[index];
  if (!it) return null;
  const node = (
    <div className="pf-lightbox" role="dialog" aria-modal="true" aria-label={it.alt} onClick={onClose}>
      <button className="lb-close" aria-label="Fermer" onClick={onClose}>×</button>
      {items.length > 1 && <button className="lb-nav lb-prev" aria-label="Précédente" onClick={(e) => { e.stopPropagation(); go(-1); }}>‹</button>}
      <figure className="lb-figure" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
        {it.src ? <img className="lb-img" src={it.src} alt={it.alt} draggable={false}
          onContextMenu={(e) => { e.preventDefault(); window.KDshowCredit && window.KDshowCredit({ title: it.title, cat: it.cat || (window.KD.portfolio && it.tags && it.tags.length ? window.KD.portfolio.filters[it.tags[0]] : "") }); }}
          onDragStart={(e) => e.preventDefault()} /> : <span className="lb-ph"><Monogram size={120} /></span>}
        <figcaption className="lb-cap" onClick={(e) => e.stopPropagation()}><strong>{it.title}</strong><span>{it.cat}</span></figcaption>
        {items.length > 1 && <div className={"lb-progress" + (paused ? " is-paused" : "")} key={index}><span></span></div>}
        {items.length > 1 && <button className="lb-play" aria-pressed={paused} onClick={(e) => { e.stopPropagation(); setPaused((p) => !p); }}>{paused ? "▶ Reprendre le défilement" : "∥ Arrêter le défilement"}</button>}
      </figure>
      {items.length > 1 && <button className="lb-nav lb-next" aria-label="Suivante" onClick={(e) => { e.stopPropagation(); go(1); }}>›</button>}
    </div>
  );
  return ReactDOM.createPortal(node, document.body);
}

/* Grille de tuiles — MÊME disposition (span-2 toutes les 5 tuiles) + lightbox */
function PortfolioGrid({ items, startIndex = 0 }) {
  const [lb, setLb] = useState(-1);
  return (
    <React.Fragment>
      <div className="pf-grid">
        {items.map((it, i) => (
          <a key={it.title + (startIndex + i)} href={it.src || "#portfolio"}
            className={"photo-card pf-item span-" + (((startIndex + i) % 5 === 0) ? "2" : "1")}
            onClick={(e) => { e.preventDefault(); setLb(i); }}
            aria-label={it.alt}>
            <PhotoZone color={it.color} label={it.cat} alt={it.alt} src={it.src} monoSize={64} />
            <span className="photo-cap">{it.title}</span>
          </a>
        ))}
      </div>
      {lb >= 0 && <Lightbox items={items} index={lb} setIndex={setLb} onClose={() => setLb(-1)} />}
    </React.Fragment>
  );
}

/* Carrousel — quand il y a 2 à 4 images (tactile + flèches + points) */
function PortfolioCarousel({ items }) {
  const [i, setI] = useState(0);
  const [lb, setLb] = useState(-1);
  const n = items.length;
  const go = (d) => setI((p) => (p + d + n) % n);
  const touch = useRef({ x: 0, on: false });
  useEffect(() => { setI(0); }, [n]);

  const onTouchStart = (e) => { touch.current = { x: e.touches[0].clientX, on: true }; };
  const onTouchEnd = (e) => {
    if (!touch.current.on) return;
    const dx = e.changedTouches[0].clientX - touch.current.x;
    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
    touch.current.on = false;
  };

  return (
    <div className="pf-carousel reveal in">
      <button className="pfc-arrow prev" onClick={() => go(-1)} aria-label="Image précédente">‹</button>
      <div className="pfc-viewport" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <div className="pfc-track" style={{ transform: `translateX(-${i * 100}%)` }}>
          {items.map((it, idx) => (
            <div className="pfc-slide" key={it.title + idx} aria-hidden={idx !== i}>
              <a href={it.src || "#"} className="photo-card pfc-card" aria-label={it.alt}
                onClick={(e) => { e.preventDefault(); setLb(idx); }}>
                <PhotoZone color={it.color} label={it.cat} alt={it.alt} src={it.src} monoSize={80} />
                <span className="photo-cap">{it.title}</span>
              </a>
            </div>
          ))}
        </div>
      </div>
      <button className="pfc-arrow next" onClick={() => go(1)} aria-label="Image suivante">›</button>
      <div className="pfc-dots" role="tablist" aria-label="Images">
        {items.map((_, d) => (
          <button key={d} className={"pfc-dot" + (d === i ? " on" : "")} aria-current={d === i}
            aria-label={"Image " + (d + 1)} onClick={() => setI(d)}></button>
        ))}
      </div>
      {lb >= 0 && <Lightbox items={items} index={lb} setIndex={setLb} onClose={() => setLb(-1)} />}
    </div>
  );
}

/* Solo — une seule image : grand format façon « Avant le pont de l'arc-en-ciel » */
function PortfolioSolo({ item }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="pf-solo reveal in">
      <a href={item.src || "#"} className="photo-card pf-solo-card" aria-label={item.alt}
        onClick={(e) => { e.preventDefault(); setOpen(true); }}>
        <PhotoZone color={item.color} label={item.cat} alt={item.alt} src={item.src} monoSize={110} className="pf-solo-photo" />
        <span className="photo-cap">{item.title}</span>
      </a>
      {open && <Lightbox items={[item]} index={0} setIndex={() => {}} onClose={() => setOpen(false)} />}
    </div>
  );
}

/* Choisit le carrousel selon le nombre d'images du filtre :
   < 5 → grand format (fondu) · ≥ 5 → multi-cartes (5 visibles desktop) */
function PortfolioApercu({ items }) {
  if (!items.length) return null;
  // Aperçu = sélection (pas le catalogue complet) → progression lisible.
  // Le mode (grand format / multi-cartes) suit le nombre réel d'images du filtre.
  const preview = items.length >= 5 ? items.slice(0, 15) : items;
  return <SmartCarousel items={preview} />;
}

/* ACCUEIL — sélection éditoriale courte (sans filtres) + bouton vers la page */
function Portfolio({ audience }) {
  const P = window.KD.portfolio;
  const U = window.KD.ui;
  const selection = kdEditorialPick(P.items, 8, 2);

  return (
    <section id="portfolio" className="section section--soft portfolio" aria-labelledby="pf-title">
      <div className="wrap">
        <div className="section-head reveal">
          <span className="eyebrow">{P.eyebrow}</span>
          <h2 id="pf-title">{P.title}</h2>
          <p>{P.intro}</p>
        </div>

        <div className="reveal" data-d="1">
          <MasonryGrid items={selection} variant="home" />
        </div>

        <div className="pf-foot reveal" data-d="2">
          <button className="btn btn-book" onClick={() => window.KDnav && window.KDnav("portfolio")}>{U.pfFullCta || P.cta} →</button>
        </div>
      </div>
    </section>
  );
}

/* PAGE DÉDIÉE — masonry (ratios respectés) + filtres complets + chargement progressif */
function PortfolioPage() {
  const P = window.KD.portfolio;
  const U = window.KD.ui;
  const LOTS = P.lots || { initial: 9, step: 6 };
  const soonIdx = P.soon ? P.filters.length - 1 : -1;
  const [activeIdx, setActiveIdx] = useState(0);
  const [count, setCount] = useState(LOTS.initial);
  const tabs = P.filters.map((f, i) => ({ label: f, idx: i }))
    .filter((t) => t.idx === 0 || t.idx === soonIdx || P.items.some((it) => it.tags && it.tags.includes(t.idx)));
  const filtered = activeIdx === 0 ? P.items : P.items.filter((it) => it.tags && it.tags.includes(activeIdx));
  const shown = filtered.slice(0, count);
  const remaining = Math.max(0, filtered.length - count);
  const isSoon = activeIdx === soonIdx && filtered.length === 0;

  const selectFilter = (i) => { setActiveIdx(i); setCount(LOTS.initial); };

  return (
    <section className="section portfolio pf-page" aria-labelledby="pfp-title">
      <div className="wrap">
        <button className="pf-back btn btn-blue" onClick={() => window.KDnav && window.KDnav("home")}>{U.backHome}</button>

        <div className="section-head reveal in">
          <span className="eyebrow">{P.eyebrow}</span>
          <h2 id="pfp-title">{U.pfPageTitle}</h2>
          <p>{P.intro}</p>
        </div>

        <PortfolioFiltersIdx tabs={tabs} activeIdx={activeIdx} onSelect={selectFilter} label={P.eyebrow} />

        {isSoon ? (
          <div className="pf-soon reveal in">
            <span className="pf-soon-mark" aria-hidden="true"><Monogram size={84} dash /></span>
            <h3 className="pf-soon-title">{P.soon.title}</h3>
            <p className="pf-soon-body">{P.soon.body}</p>
            <a href="#contact" className="btn btn-book" onClick={(e) => { e.preventDefault(); window.KDnav && window.KDnav("contact"); }}>{P.soon.cta}</a>
          </div>
        ) : (
          <React.Fragment>
            <MasonryGrid key={activeIdx} items={shown} />

            <div className="pf-page-foot">
              {remaining > 0 ? (
                <button className="btn btn-book pf-more" onClick={() => setCount((c) => c + LOTS.step)}>
                  {U.seeMore} ({remaining}) →
                </button>
              ) : (
                <p className="pf-allshown">{U.allShown} · {filtered.length}</p>
              )}
            </div>
          </React.Fragment>
        )}
      </div>
    </section>
  );
}

function About() {
  const A = window.KD.about;
  return (
    <section id="apropos" className="section about" aria-labelledby="about-title">
      <div className="wrap about-grid">
        <div className="about-media reveal">
          {/* ZONE PHOTO : portrait de Kim en séance */}
          <PhotoZone color="#6E7F52" label={A.badgeLabel} alt={A.portraitAlt} src={A.portraitSrc} monoSize={72} className="about-photo" />
          <span className="about-badge"><Monogram size={64} spin dash /></span>
          {A.creditHandle && (
            <p className="about-credit">
              <svg className="about-credit-ic" viewBox="0 0 24 24" width="13" height="13" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="3.5" y="3.5" width="17" height="17" rx="5"></rect><circle cx="12" cy="12" r="3.6"></circle><circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none"></circle></svg>
              {A.creditPrefix} <a href={A.creditUrl} target="_blank" rel="noopener noreferrer">{A.creditHandle}</a>
            </p>
          )}
        </div>
        <div className="about-text reveal" data-d="1">
          <span className="eyebrow">{A.eyebrow}</span>
          <h2 id="about-title">{A.title}</h2>
          {A.body.map((p, i) => <p key={i} className="about-p">{p}</p>)}
          <ul className="about-values">
            {A.values.map((v, i) => (
              <li key={i}><strong>{v.k}</strong><span>{v.v}</span></li>
            ))}
          </ul>
          <p className="about-sign">{A.signature}</p>
        </div>
      </div>
    </section>
  );
}

function PackageCard({ c, i, L }) {
  const U = window.KD.ui;
  const [open, setOpen] = useState(false);
  const bodyRef = useRef(null);
  const ed = window.useEditor ? window.useEditor() : null;
  const promo = ed && window.kdActivePromo ? window.kdActivePromo(ed.st.promos) : null;
  const deal = promo && window.kdApplyPromoToPrice ? window.kdApplyPromoToPrice(c.price, promo) : null;
  return (
    <article className={"pk-card reveal" + (c.featured ? " featured" : "") + (open ? " is-open" : "")} data-d={(i % 3) + 1}>
      {c.featured && <span className="pk-flag">{U.mostChosen}</span>}
      <div className="pk-card-head">
        <span className="pk-region">{c.region}</span>
        <h3>{c.name}</h3>
        {deal && deal.kind === "cut" ? (
          <div className="pk-price pk-price--deal">
            <p className="pk-price-row">
              <span className="pk-price-was">{deal.wasText}</span>
              <span className="pk-price-arrow" aria-hidden="true">→</span>
              <span className="pk-price-now">{deal.nowText}</span>
            </p>
            <span className="pk-price-applied"><span className="pk-price-dot" aria-hidden="true">✓</span>{deal.applied}</span>
          </div>
        ) : (
          <p className="pk-price">{c.price}{deal && (deal.kind === "gift" || deal.kind === "credit") && <span className="pk-price-chip pk-price-chip--bonus">{deal.note}</span>}</p>
        )}
      </div>
      {c.who && <p className="pk-who"><span className="pk-who-label">{L.who}</span>{c.who}</p>}
      <ul className="pk-steps">
        {c.steps.map((s, j) => (
          <li key={j}><span className="pk-check" aria-hidden="true">✓</span>{s}</li>
        ))}
      </ul>

      {(c.flow || c.faq) && (
        <button type="button" className="pk-disclose" aria-expanded={open}
          onClick={() => setOpen((v) => !v)}>
          {open ? L.close : L.details}
          <span className="pk-disclose-ic" aria-hidden="true">{open ? "−" : "+"}</span>
        </button>
      )}
      <div className="pk-details" ref={bodyRef}
        style={{ maxHeight: open ? (bodyRef.current ? bodyRef.current.scrollHeight + "px" : "1000px") : "0px" }}>
        {c.flow && (
          <div className="pk-block">
            <span className="pk-block-label">{L.flow}</span>
            <ol className="pk-flow">
              {c.flow.map((f, k) => <li key={k}><span className="pk-flow-n">{k + 1}</span>{f}</li>)}
            </ol>
          </div>
        )}
        {c.faq && (
          <div className="pk-block">
            <span className="pk-block-label">{L.faq}</span>
            <dl className="pk-faq">
              {c.faq.map((f, k) => (
                <div key={k}><dt>{f.q}</dt><dd>{f.a}</dd></div>
              ))}
            </dl>
          </div>
        )}
      </div>

      <a href="#contact" className={"btn " + (c.featured ? "btn-book" : "btn-blue")}
        onClick={(e) => { e.preventDefault(); window.KDnav && window.KDnav("contact"); }}>{U.choosePackage}</a>
    </article>
  );
}

function Packages() {
  const P = window.KD.packages;
  const L = P.labels || { who: "Pour qui", flow: "Déroulement", faq: "Bon à savoir", details: "Détails", close: "Réduire" };
  return (
    <section id="seances" className="section section--soft packages" aria-labelledby="pk-title">
      <div className="wrap">
        <div className="section-head reveal" style={{ marginInline: "auto", textAlign: "center" }}>
          <span className="eyebrow" style={{ justifyContent: "center" }}>{P.eyebrow}</span>
          <h2 id="pk-title">{P.title}</h2>
          <p style={{ marginInline: "auto" }}>{P.intro}</p>
        </div>

        <div className="pk-grid">
          {P.cards.map((c, i) => (
            <PackageCard key={c.name} c={c} i={i} L={L} />
          ))}
        </div>

        <p className="pk-fineprint reveal" data-d="2">{P.fineprint}</p>
        <div className="pf-foot reveal" data-d="2"><a href="#seances" className="btn btn-ghost">{P.cta} →</a></div>
      </div>
    </section>
  );
}

Object.assign(window, { Portfolio, PortfolioPage, PortfolioGrid, PortfolioApercu, PortfolioCarousel, PortfolioSolo, PortfolioFilters, Lightbox, About, Packages, PackageCard });
