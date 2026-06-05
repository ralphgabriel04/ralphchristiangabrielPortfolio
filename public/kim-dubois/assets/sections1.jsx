/* En-tête sticky + Héros + Bandeau distinctions */

function Header({ theme, onToggleTheme, showAnno, onToggleAnno, lang, onSetLang }) {
  const D = window.KD;
  const U = D.ui;
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <header className={"site-header" + (scrolled ? " is-scrolled" : "")}>
      <div className="wrap header-inner">
        <a className="brand" href="#accueil" onClick={() => setOpen(false)} aria-label={D.brand.full + " — " + D.nav[0].label}>
          <Monogram size={42} spin dash />
          <span className="brand-text">
            <strong>{D.brand.name}</strong>
            <em>{D.brand.roleline}</em>
          </span>
        </a>

        <nav className="nav-desktop" aria-label={U.langGroup}>
          {D.nav.map((n) => (
            <a key={n.label} href={n.href} className="nav-link">{n.label}</a>
          ))}
        </nav>

        <div className="header-actions">
          <div className="lang-switch" role="group" aria-label={U.langGroup}>
            {["fr", "en"].map((l, i) => (
              <React.Fragment key={l}>
                {i > 0 && <span className="lang-div" aria-hidden="true"></span>}
                <button className={"lang-opt" + (lang === l ? " on" : "")}
                  onClick={() => onSetLang(l)} aria-pressed={lang === l}
                  title={l === "en" ? U.enTitle : U.frTitle}>{l.toUpperCase()}</button>
              </React.Fragment>
            ))}
          </div>

          <button className="icon-btn" onClick={onToggleTheme}
            aria-label={theme === "dark" ? U.themeToLight : U.themeToDark}
            title={theme === "dark" ? U.themeToLight : U.themeToDark}>
            {theme === "dark" ? "☀" : "☾"}
          </button>

          <button className={"icon-btn anno-btn" + (showAnno ? " on" : "")} onClick={onToggleAnno}
            aria-pressed={showAnno} title={U.notesTitle}>{U.notesDesign}</button>

          <a href="#contact" className="btn btn-gold header-cta">{U.bookSession}</a>

          <button className={"burger" + (open ? " open" : "")} onClick={() => setOpen(!open)}
            aria-label={open ? U.menuClose : U.menuOpen} aria-expanded={open}>
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>

      {/* Menu mobile plein écran */}
      <div className={"mobile-menu" + (open ? " open" : "")} role="dialog" aria-modal="true" aria-label={U.langGroup}>
        <nav className="mobile-nav">
          {D.nav.map((n, i) => (
            <a key={n.label} href={n.href} className="mobile-link reveal" data-d={(i % 3) + 1}
               onClick={() => setOpen(false)} style={{ transitionDelay: open ? `${0.05 + i * 0.05}s` : "0s" }}>
              <span>{n.label}</span><Monogram size={22} stroke={1.2} />
            </a>
          ))}
        </nav>
        <a href="#contact" className="btn btn-gold mobile-cta" onClick={() => setOpen(false)}>{U.bookSession}</a>
        <div className="mobile-langs">
          {["fr", "en"].map((l) => (
            <button key={l} className={"lang-opt" + (lang === l ? " on" : "")} onClick={() => onSetLang(l)}>{l.toUpperCase()}</button>
          ))}
        </div>
      </div>
    </header>
  );
}

function Hero() {
  const H = window.KD.hero;
  const U = window.KD.ui;
  return (
    <section id="accueil" className="hero" aria-labelledby="hero-title">
      {/* ZONE PHOTO : héros plein écran — portrait animalier signature de Kim */}
      <div className="hero-bg" role="img" aria-label={H.bgAlt}>
        <div className="hero-bg-grad"></div>
        <span className="hero-watermark"><Monogram size={420} stroke={0.6} /></span>
      </div>

      <div className="wrap hero-inner">
        <div className="hero-content">
          <span className="eyebrow hero-eyebrow">{H.eyebrow}</span>
          <h1 id="hero-title" className="hero-title">{H.title}</h1>
          <p className="hero-sub">{H.subtitle}</p>
          <div className="hero-cta">
            <a href="#contact" className="btn btn-gold">{H.ctaPrimary}</a>
            <a href="#portfolio" className="btn btn-outline-light">{H.ctaSecondary}</a>
          </div>
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

function Awards() {
  const A = window.KD.awards;
  const U = window.KD.ui;
  return (
    <section id="distinctions" className="section awards" aria-labelledby="awards-title">
      <div className="wrap">
        <div className="awards-grid">
          <div className="awards-head reveal">
            <span className="eyebrow">{A.eyebrow}</span>
            <h2 id="awards-title">{A.title}</h2>
            <p className="awards-note">{A.note}</p>
          </div>

          <div className="awards-counters reveal" data-d="1">
            {A.counters.map((c, i) => (
              <React.Fragment key={c.label}>
                {i > 0 && <span className="counter-sep" aria-hidden="true">·</span>}
                <div className="counter">
                  <span className="counter-n">{c.n}</span>
                  <span className="counter-l">{c.label}</span>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>

        <hr className="gold-rule awards-rule reveal" data-d="1" />

        <ul className="medals reveal" data-d="2">
          {A.medals.map((m, i) => (
            <li className="medal" key={i}>
              <span className={"medal-badge tier-" + m.tier.split(" ")[0].toLowerCase()}>
                <Monogram size={34} stroke={1.1} />
              </span>
              <span className="medal-text">
                <strong>{m.tier}</strong>
                <em>{m.cat}</em>
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Annotation : pourquoi les distinctions si haut */}
      <span className="anno-dot" style={{ right: "calc(var(--gut))", top: "18px" }}>2</span>
      <aside className="anno" style={{ right: "var(--gut)", top: "44px" }}>
        <span className="anno-tag">{U.annoTag}</span>
        <span dangerouslySetInnerHTML={{ __html: U.anno2 }}></span>
      </aside>
    </section>
  );
}

Object.assign(window, { Header, Hero, Awards });
