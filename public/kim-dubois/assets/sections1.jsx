/* En-tête sticky + Héros + Bandeau distinctions */

// Petites icônes de navigation (discrètes, trait fin)
function NavIcon({ name }) {
  const p = { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true };
  if (name === "award") return (<svg {...p}><circle cx="12" cy="9" r="5"></circle><path d="M9 13.4 8 21l4-2.2L16 21l-1-7.6"></path></svg>);
  if (name === "pen") return (<svg {...p}><path d="M4 20h4L18.5 9.5a2.1 2.1 0 0 0-3-3L5 17v3z"></path><path d="M13.5 7l3 3"></path></svg>);
  if (name === "bag") return (<svg {...p}><path d="M6.5 7.5h11l.9 12.5H5.6l.9-12.5z"></path><path d="M9 7.5a3 3 0 0 1 6 0"></path></svg>);
  if (name === "mail") return (<svg {...p}><rect x="3" y="5.5" width="18" height="13" rx="2.2"></rect><path d="m4 7.5 8 5.2 8-5.2"></path></svg>);
  return null;
}

function Header({ theme, onToggleTheme, showAnno, onToggleAnno, lang, onSetLang, audience, onSetAudience }) {
  const D = window.KD;
  const U = D.ui;
  const AUD = D.audience;
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef(null);
  const burgerRef = useRef(null);
  const en = lang === "en";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Étagère ouverte : Échap + clic extérieur ferment ; le focus revient au hamburger.
  // On NE verrouille PAS le défilement : le contenu reste visible et utilisable.
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") { setOpen(false); burgerRef.current && burgerRef.current.focus(); } };
    const onDown = (e) => { if (headerRef.current && !headerRef.current.contains(e.target)) setOpen(false); };
    let y0 = window.scrollY;
    const onScroll = () => { if (Math.abs(window.scrollY - y0) > 60) setOpen(false); };
    window.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
      window.removeEventListener("scroll", onScroll);
    };
  }, [open]);

  const go = (href) => { setOpen(false); window.KDnav && window.KDnav((href || "").replace("#", "") || "home"); };
  const isSecondary = (href) => ["#distinctions", "#blog", "#contact"].includes(href);

  // Pages prioritaires (restent dans l'entête) + secondaires (étagère)
  const subs = {
    "#distinctions": en ? "Awards & recognition" : "Récompenses & reconnaissances",
    "#blog": en ? "Tips & stories" : "Conseils & récits",
    "#contact": en ? "Let’s talk" : "Échangeons",
  };
  const icons = { "#distinctions": "award", "#blog": "pen", "#contact": "mail" };
  const primary = D.nav.filter((n) => !isSecondary(n.href));
  const secondary = D.nav.filter((n) => isSecondary(n.href))
    .map((n) => ({ label: n.label, href: n.href, sub: subs[n.href], icon: icons[n.href] }));

  return (
    <header ref={headerRef} className={"site-header" + (scrolled ? " is-scrolled" : "") + (open ? " is-open" : "")}>
      <div className="wrap header-inner">
        <a className="brand" href="#accueil" onClick={(e) => { e.preventDefault(); go("#accueil"); }} aria-label={D.brand.full + " — " + D.nav[0].label}>
          <Monogram size={42} spin dash />
          <span className="brand-text">
            <strong>{D.brand.name}</strong>
            <em>{D.brand.roleline}</em>
          </span>
        </a>

        <nav className="nav-primary" aria-label={en ? "Main navigation" : "Navigation principale"}>
          {D.nav.map((n) => (
            <a key={n.label} href={n.href} className={"nav-link" + (isSecondary(n.href) ? " is-secondary" : "")}
              onClick={(e) => { e.preventDefault(); go(n.href); }}>{n.label}</a>
          ))}
        </nav>

        <div className="header-actions">
          <div className="aud-switch hide-compact" role="group" aria-label={AUD.label}>
            {["particuliers", "entreprises"].map((a) => (
              <button key={a} className={"aud-opt" + (audience === a ? " on" : "")}
                onClick={() => onSetAudience(a)} aria-pressed={audience === a}>
                {a === "particuliers" ? AUD.particuliers : AUD.entreprises}
              </button>
            ))}
          </div>

          <button className="icon-btn" onClick={onToggleTheme}
            aria-label={theme === "dark" ? U.themeToLight : U.themeToDark}
            title={theme === "dark" ? U.themeToLight : U.themeToDark}>
            {theme === "dark" ? "☀" : "☾"}
          </button>

          <a href="#contact" className="btn btn-book header-cta" onClick={(e) => { e.preventDefault(); go("#contact"); }}>
            <span className="cta-long">{U.bookSession}</span>
            <span className="cta-short">{en ? "Book" : "Réserver"}</span>
          </a>

          <button ref={burgerRef} className={"burger" + (open ? " open" : "")}
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? U.menuClose : U.menuOpen} aria-expanded={open} aria-controls="kd-shelf">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>

      {/* Étagère : l'entête s'étend juste assez pour révéler les pages secondaires */}
      <div id="kd-shelf" className={"shelf" + (open ? " open" : "")} aria-hidden={!open}>
        <div className="wrap shelf-inner">
          <nav className="shelf-primary" aria-label={en ? "Main pages" : "Pages principales"}>
            {primary.map((n) => (
              <a key={n.label} href={n.href} className="shelf-plink"
                onClick={(e) => { e.preventDefault(); go(n.href); }}>{n.label}</a>
            ))}
          </nav>

          <nav className="shelf-grid" aria-label={en ? "More pages" : "Plus de pages"}>
            {secondary.map((it) => (
              <a key={it.label} href={it.href} className="shelf-card"
                target={it.external ? "_blank" : undefined} rel={it.external ? "noopener noreferrer" : undefined}
                onClick={it.external ? () => setOpen(false) : (e) => { e.preventDefault(); go(it.href); }}>
                <span className="shelf-ic"><NavIcon name={it.icon} /></span>
                <span className="shelf-text">
                  <strong>{it.label}{it.external && <i className="shelf-ext" aria-hidden="true">↗</i>}</strong>
                  <em>{it.sub}</em>
                </span>
              </a>
            ))}
          </nav>

          <div className="shelf-meta">
            <div className="aud-switch shelf-aud" role="group" aria-label={AUD.label}>
              {["particuliers", "entreprises"].map((a) => (
                <button key={a} className={"aud-opt" + (audience === a ? " on" : "")}
                  onClick={() => onSetAudience(a)} aria-pressed={audience === a}>
                  {a === "particuliers" ? AUD.particuliers : AUD.entreprises}
                </button>
              ))}
            </div>
            <div className="shelf-tools">
              <button className={"shelf-tool" + (showAnno ? " on" : "")} onClick={onToggleAnno} aria-pressed={showAnno}>
                <span className="shelf-tool-ic">✦</span>
                <span>{U.notesDesign}</span>
              </button>
              <div className="lang-switch shelf-lang" role="group" aria-label={U.langGroup}>
                {["fr", "en"].map((l, i) => (
                  <React.Fragment key={l}>
                    {i > 0 && <span className="lang-div" aria-hidden="true"></span>}
                    <button className={"lang-opt" + (lang === l ? " on" : "")} onClick={() => onSetLang(l)} aria-pressed={lang === l}>{l.toUpperCase()}</button>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function Hero({ audience }) {
  const HERO = window.KD.hero;
  const H = HERO[audience] || HERO.particuliers;
  const U = window.KD.ui;
  return (
    <section id="accueil" className="hero" aria-labelledby="hero-title">
      {/* ZONE PHOTO : héros plein écran — vraie photo de Kim */}
      <div className="hero-bg" role="img" aria-label={HERO.bgAlt}>
        {HERO.bgSrc && <img className="hero-photo" src={HERO.bgSrc} alt="" aria-hidden="true"
          style={{ objectPosition: HERO.bgPos || "center" }} />}
        <div className="hero-bg-grad"></div>
        <span className="hero-watermark"><Monogram size={420} stroke={0.6} /></span>
      </div>

      <div className="wrap hero-inner">
        <div className="hero-content" key={audience}>
          <span className="eyebrow hero-eyebrow">{H.eyebrow}</span>
          <h1 id="hero-title" className="hero-title">{H.title}</h1>
          <p className="hero-sub">{H.subtitle}</p>
          <div className="hero-cta">
            <a href="#contact" className="btn btn-book" onClick={(e) => { e.preventDefault(); window.KDnav && window.KDnav("contact"); }}>{H.ctaPrimary}</a>
            <a href="#portfolio" className="btn btn-outline-light" onClick={(e) => { e.preventDefault(); window.KDnav && window.KDnav("portfolio"); }}>{H.ctaSecondary}</a>
          </div>
          {H.ctaTertiary && (
            <a href="#newsletter" className="hero-tertiary" onClick={(e) => { e.preventDefault(); window.KDnav && window.KDnav("newsletter"); }}>
              <span aria-hidden="true">✦</span>{H.ctaTertiary}
            </a>
          )}
          {H.proof && (
            <ul className="hero-proof" aria-label="Points de confiance">
              {H.proof.map((p, i) => <li key={i}>{p}</li>)}
            </ul>
          )}
        </div>
      </div>

      {/* Annotation : pourquoi cette accroche */}
      <span className="anno-dot" style={{ left: "calc(var(--gut) + 4px)", top: "52%" }}>1</span>
      <aside className="anno" style={{ left: "var(--gut)", top: "60%" }}>
        <span className="anno-tag">{U.annoTag}</span>
        <span dangerouslySetInnerHTML={{ __html: U.anno1 }}></span>
      </aside>

      <div className="hero-scroll" aria-hidden="true"><span></span>{U.scroll}</div>
    </section>
  );
}

Object.assign(window, { Header, Hero });
