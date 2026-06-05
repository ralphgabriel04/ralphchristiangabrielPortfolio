/* Aperçu portfolio filtrable + À propos + Séances (forfaits) */

function Portfolio() {
  const P = window.KD.portfolio;
  const [activeIdx, setActiveIdx] = useState(0);
  const shown = activeIdx === 0 ? P.items : P.items.filter((it) => it.catIdx === activeIdx);

  return (
    <section id="portfolio" className="section section--soft portfolio" aria-labelledby="pf-title">
      <div className="wrap">
        <div className="section-head reveal">
          <span className="eyebrow">{P.eyebrow}</span>
          <h2 id="pf-title">{P.title}</h2>
          <p>{P.intro}</p>
        </div>

        <div className="pf-filters reveal" data-d="1" role="tablist" aria-label={P.eyebrow}>
          {P.filters.map((f, i) => (
            <button key={f} role="tab" aria-selected={activeIdx === i}
              className={"pf-tab" + (activeIdx === i ? " on" : "")}
              onClick={() => setActiveIdx(i)}>{f}</button>
          ))}
        </div>

        <div className="pf-grid reveal" data-d="1">
          {shown.map((it, i) => (
            <a key={it.title + i} href="#portfolio" className={"photo-card pf-item span-" + ((i % 5 === 0) ? "2" : "1")}>
              <PhotoZone color={it.color} label={it.cat} alt={it.alt} monoSize={64} />
              <span className="photo-cap">{it.title}</span>
            </a>
          ))}
        </div>

        <div className="pf-foot reveal" data-d="2">
          <a href="#portfolio" className="btn btn-ghost">{P.cta} →</a>
        </div>
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
          <PhotoZone color="#6E7F52" label={A.badgeLabel} alt={A.portraitAlt} monoSize={72} className="about-photo" />
          <span className="about-badge"><Monogram size={64} spin dash /></span>
        </div>
        <div className="about-text reveal" data-d="1">
          <span className="eyebrow">{A.eyebrow}</span>
          <h2 id="about-title">{A.title}</h2>
          {A.body.map((p, i) => <p key={i} className="about-p">{p}</p>)}
          <p className="about-sign">{A.signature}</p>
        </div>
      </div>
    </section>
  );
}

function Packages() {
  const P = window.KD.packages;
  const U = window.KD.ui;
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
            <article key={c.name} className={"pk-card reveal" + (c.featured ? " featured" : "")} data-d={i + 1}>
              {c.featured && <span className="pk-flag">{U.mostChosen}</span>}
              <div className="pk-card-head">
                <Monogram size={40} stroke={1.2} />
                <h3>{c.name}</h3>
                <p className="pk-price">{c.price}</p>
              </div>
              <ul className="pk-steps">
                {c.steps.map((s, j) => (
                  <li key={j}><span className="pk-step-n">{j + 1}</span>{s}</li>
                ))}
              </ul>
              <a href="#contact" className={"btn " + (c.featured ? "btn-gold" : "btn-ghost")}>{U.choosePackage}</a>
            </article>
          ))}
        </div>

        <p className="pk-fineprint reveal" data-d="2">{P.fineprint}</p>
        <div className="pf-foot reveal" data-d="2"><a href="#seances" className="btn btn-ghost">{P.cta} →</a></div>
      </div>
    </section>
  );
}

Object.assign(window, { Portfolio, About, Packages });
