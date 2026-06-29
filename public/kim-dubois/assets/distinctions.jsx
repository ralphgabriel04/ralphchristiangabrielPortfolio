/* Section « Distinctions & récompenses » + page complète « Toutes les distinctions »
   - Grille éditoriale (aperçu progressif « Voir plus »)
   - Panneau de détail (sticky desktop / carte sous la grille en mobile)
   - Réutilise la visionneuse <Lightbox> partagée pour « Agrandir »
   - Accessible : cartes = boutons, état actif, focus visible, aria-live, reduced-motion */

function tierKey(t) { return (t || "").toLowerCase().replace(/[^a-z]+/g, "-").replace(/^-|-$/g, ""); }
function catLabel(A, cat) { return (A.certCats && A.certCats[cat]) || cat; }
function certToItem(A, c) {
  const cat = catLabel(A, c.cat);
  return { src: c.src, title: c.tier + " " + A.awardWord, cat: cat + " · " + c.year,
    alt: A.certAlt + " " + c.tier + " · " + cat + " (" + c.year + ")" };
}

// Carte certificat (bouton accessible)
function CertCard({ cert, A, active, onSelect }) {
  const cat = catLabel(A, cert.cat);
  return (
    <button type="button" className={"cert-card tier-" + tierKey(cert.tier) + (active ? " is-active" : "")}
      onClick={onSelect} aria-pressed={active}
      aria-label={cert.tier + " — " + cat + ", " + cert.year}>
      <span className="cert-thumb">
        <img src={cert.src} alt={A.certAlt + " " + cert.tier + " · " + cat + " (" + cert.year + ")"}
          loading="lazy" decoding="async" />
        <span className="cert-dot" aria-hidden="true"></span>
      </span>
      <span className="cert-card-meta">
        <strong>{cert.tier}</strong>
        <span>{cat} · {cert.year}</span>
      </span>
    </button>
  );
}

// Panneau de détail
function CertDetail({ cert, A, onEnlarge, onMore }) {
  if (!cert) return (<div className="cert-detail is-empty"><p>{A.emptyDetail}</p></div>);
  const cat = catLabel(A, cert.cat);
  const M = A.metaLabels;
  return (
    <div className="cert-detail" key={cert.id}>
      <span className="cert-plate">{A.selectedLabel}</span>
      <button type="button" className="cert-figure" onClick={onEnlarge} aria-label={A.enlarge}>
        <img src={cert.src} alt={A.certAlt + " " + cert.tier + " · " + cat + " (" + cert.year + ")"} decoding="async" />
        <span className="cert-figure-zoom" aria-hidden="true">⤢</span>
      </button>
      <h3 className="cert-title">{cert.tier} {A.awardWord}</h3>
      <p className="cert-sub">{cat} · {cert.year}</p>
      <p className="cert-desc">{A.descTemplate}</p>
      <dl className="cert-meta">
        <div><dt>{M.year}</dt><dd>{cert.year}</dd></div>
        <div><dt>{M.cat}</dt><dd>{cat}</dd></div>
        <div><dt>{M.tier}</dt><dd>{cert.tier}</dd></div>
        <div><dt>{M.photographer}</dt><dd>{A.photographer}</dd></div>
      </dl>
      <blockquote className="cert-quote">{A.quote}</blockquote>
      <div className="cert-cta">
        <button type="button" className="btn btn-book" onClick={onEnlarge}>{A.enlarge}</button>
        <button type="button" className="btn btn-ghost" onClick={onMore}>{A.details}</button>
      </div>
    </div>
  );
}

// ---- Section (accueil) ----
function Distinctions() {
  const A = window.KD.awards;
  const U = window.KD.ui;
  const certs = A.certs.map((c, i) => ({ ...c, id: i }));
  const [filter, setFilter] = useState("Tous");
  const [count, setCount] = useState(A.initial);
  const [selId, setSelId] = useState(0);
  const [lb, setLb] = useState(null); // { items, index }
  const liveRef = useRef(null);
  const asideRef = useRef(null);

  const filtered = filter === "Tous" ? certs : certs.filter((c) => c.cat === filter);
  const shown = filtered.slice(0, count);
  const sel = certs.find((c) => c.id === selId) || certs[0];
  const allShown = count >= filtered.length;

  const applyFilter = (f) => {
    setFilter(f); setCount(A.initial);
    const list = f === "Tous" ? certs : certs.filter((c) => c.cat === f);
    if (list[0]) setSelId(list[0].id);
  };
  const select = (c) => {
    setSelId(c.id);
    if (liveRef.current) liveRef.current.textContent = A.selectedLabel + " : " + c.tier + " " + A.awardWord + ", " + catLabel(A, c.cat) + ", " + c.year;
    if (window.innerWidth <= 900 && asideRef.current) {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const y = asideRef.current.getBoundingClientRect().top + window.scrollY - 84;
      window.scrollTo({ top: y, behavior: reduce ? "auto" : "smooth" });
    }
  };
  const enlarge = () => setLb({ items: [certToItem(A, sel)], index: 0 });

  return (
    <section id="distinctions" className="section distinctions" aria-labelledby="dist-title">
      <div className="wrap">
        <div className="dist-head reveal">
          <span className="eyebrow">{A.eyebrow}</span>
          <h2 id="dist-title">{A.title}</h2>
          <p className="dist-sub">{A.subtext}</p>
          <p className="dist-cred">{A.credibility}</p>
        </div>

        <ul className="dist-band reveal" data-d="1">
          {A.band.map((b, i) => (
            <li key={i}><strong>{b.k}</strong><span>{b.v}</span></li>
          ))}
        </ul>

        <div className="dist-diploma reveal" data-d="1">
          <span className="dist-diploma-badge"><Monogram size={26} /></span>
          <span className="dist-diploma-text"><strong>{A.diploma.title}</strong><em>{A.diploma.body}</em></span>
        </div>

        <div className="dist-layout">
          <div className="dist-main">
            <div className="dist-chips reveal" role="tablist" aria-label={A.filterGroups.cat}>
              {A.filters.map((f) => (
                <button key={f} type="button" role="tab" aria-selected={filter === f}
                  className={"dist-chip" + (filter === f ? " on" : "")} onClick={() => applyFilter(f)}>
                  {f === "Tous" ? f : catLabel(A, f)}
                </button>
              ))}
            </div>

            <ul className="dist-grid reveal" data-d="1">
              {shown.map((c) => (
                <li key={c.id}>
                  <CertCard cert={c} A={A} active={sel && sel.id === c.id} onSelect={() => select(c)} />
                </li>
              ))}
            </ul>

            <div className="dist-actions">
              {filtered.length > A.initial && (
                <button type="button" className="btn btn-ghost dist-more"
                  onClick={() => setCount(allShown ? A.initial : count + A.step)}>
                  {allShown ? A.less : A.more}
                </button>
              )}
              <button type="button" className="btn btn-book"
                onClick={() => window.KDnav && window.KDnav("distinctions-all")}>{A.all}</button>
            </div>
          </div>

          <aside className="dist-aside" ref={asideRef}>
            <div className="dist-aside-sticky">
              <span ref={liveRef} className="sr-only" aria-live="polite"></span>
              <CertDetail cert={sel} A={A} onEnlarge={enlarge}
                onMore={() => window.KDnav && window.KDnav("distinctions-all")} />
            </div>
          </aside>
        </div>
      </div>

      {lb && <Lightbox items={lb.items} index={lb.index} setIndex={() => {}} onClose={() => setLb(null)} />}

      {/* Annotation : pourquoi les distinctions apparaissent tôt */}
      <span className="anno-dot" style={{ right: "calc(var(--gut))", top: "18px" }}>2</span>
      <aside className="anno" style={{ right: "var(--gut)", top: "44px" }}>
        <span className="anno-tag">{U.annoTag}</span>
        <span dangerouslySetInnerHTML={{ __html: U.anno2 }}></span>
      </aside>
    </section>
  );
}

// ---- Page complète ----
function DistinctionsPage() {
  const A = window.KD.awards;
  const certs = A.certs.map((c, i) => ({ ...c, id: i }));
  const [cat, setCat] = useState("Tous");
  const [tier, setTier] = useState("Tous");
  const [year, setYear] = useState("Tous");
  const [lb, setLb] = useState(-1);

  const uniq = (arr) => arr.filter((v, i) => arr.indexOf(v) === i);
  const cats = ["Tous"].concat(uniq(certs.map((c) => c.cat)));
  const tiers = ["Tous"].concat(uniq(certs.map((c) => c.tier)));
  const years = ["Tous"].concat(uniq(certs.map((c) => String(c.year))));
  const filtered = certs.filter((c) =>
    (cat === "Tous" || c.cat === cat) &&
    (tier === "Tous" || c.tier === tier) &&
    (year === "Tous" || String(c.year) === year));
  const items = filtered.map((c) => certToItem(A, c));

  const Group = ({ label, value, set, options, fmt }) => (
    <div className="dist-fgroup">
      <span className="dist-flabel">{label}</span>
      <div className="dist-chips" role="group" aria-label={label}>
        {options.map((o) => (
          <button key={o} type="button" className={"dist-chip" + (value === o ? " on" : "")}
            onClick={() => set(o)} aria-pressed={value === o}>{o === "Tous" ? "Tous" : (fmt ? fmt(o) : o)}</button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="dist-page section">
      <div className="wrap">
        <button type="button" className="pf-back btn btn-blue" onClick={() => window.KDnav && window.KDnav("home")}>
          ‹ {A.back}
        </button>
        <div className="dist-head">
          <span className="eyebrow">{A.pageEyebrow}</span>
          <h1 id="dist-page-title">{A.pageTitle}</h1>
          <p className="dist-sub">{A.pageIntro}</p>
        </div>

        <div className="dist-filters">
          <Group label={A.filterGroups.cat} value={cat} set={setCat} options={cats} fmt={(o) => catLabel(A, o)} />
          <Group label={A.filterGroups.tier} value={tier} set={setTier} options={tiers} />
          <Group label={A.filterGroups.year} value={year} set={setYear} options={years} />
        </div>

        <p className="dist-count" aria-live="polite">{filtered.length} {A.resultsLabel}</p>

        <ul className="dist-grid dist-grid--page">
          {filtered.map((c, i) => (
            <li key={c.id}>
              <CertCard cert={c} A={A} active={false} onSelect={() => setLb(i)} />
            </li>
          ))}
        </ul>
      </div>

      {lb >= 0 && <Lightbox items={items} index={lb} setIndex={setLb} onClose={() => setLb(-1)} />}
    </div>
  );
}

Object.assign(window, { Distinctions, DistinctionsPage, CertCard, CertDetail });
