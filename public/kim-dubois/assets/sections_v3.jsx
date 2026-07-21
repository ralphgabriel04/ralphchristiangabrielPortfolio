/* Sections V3 : Compteurs · Empathie · Parcours · Témoignages (carrousel) · Produits · Infolettre */

// Compteurs « fierté » — animation de comptage gated sur reveal + reduced-motion
function Counters() {
  const C = window.KD.counters;
  return (
    <section className="section counters" aria-label="En quelques chiffres">
      <div className="wrap counters-grid">
        {C.items.map((c, i) => (
          <div className="count-cell reveal" data-d={(i % 3) + 1} key={i}>
            <CountUp value={c.n} suffix={c.suffix} />
            <span className="count-label">{c.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function CountUp({ value, suffix }) {
  const ref = useRef(null);
  const numeric = /^\d+$/.test(value);
  const [shown, setShown] = useState(numeric ? "0" : value);
  useEffect(() => {
    if (!numeric) { setShown(value); return; }
    const root = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const animOff = root.getAttribute("data-anim") === "off";
    if (reduce || animOff || !("IntersectionObserver" in window)) { setShown(value); return; }
    const target = parseInt(value, 10);
    let raf = 0, animating = false, done = false;
    const run = () => {
      animating = true; done = false;
      const t0 = performance.now(), dur = 1400;
      const tick = (now) => {
        const p = Math.min(1, (now - t0) / dur);
        const eased = 1 - Math.pow(1 - p, 4); // easeOutQuart — démarre vite, finit en douceur
        setShown(String(Math.round(target * eased)));
        if (p < 1) { raf = requestAnimationFrame(tick); }
        else { animating = false; done = true; }
      };
      setShown("0");
      raf = requestAnimationFrame(tick);
    };
    // On lit « replay » en direct → le comptage rejoue à chaque retour à l'écran.
    const io = new IntersectionObserver((ents) => {
      const replay = root.getAttribute("data-anim-replay") === "on";
      ents.forEach((e) => {
        if (e.isIntersecting) {
          if (!animating && (replay || !done)) run();
        } else if (replay) {
          if (raf) cancelAnimationFrame(raf);
          animating = false; done = false;
          setShown("0"); // ré-arme pour rejouer
        }
      });
    }, { threshold: 0, rootMargin: "0px 0px -18% 0px" });
    if (ref.current) io.observe(ref.current);
    return () => { io.disconnect(); if (raf) cancelAnimationFrame(raf); };
  }, [value, numeric]);
  return <span className="count-n" ref={ref}>{shown}<i>{suffix}</i></span>;
}

// Bloc empathie « vous » — varie selon l'audience
function Empathy({ audience }) {
  const E = window.KD.empathy[audience] || window.KD.empathy.particuliers;
  return (
    <section className="section section--soft empathy" aria-labelledby="emp-title">
      <div className="wrap empathy-inner reveal" key={audience}>
        <span className="empathy-mark" aria-hidden="true"><Monogram size={56} dash /></span>
        <span className="eyebrow">{E.eyebrow}</span>
        <h2 id="emp-title" className="empathy-title">{E.title}</h2>
        <p className="empathy-body">{E.body}</p>
        <a href="#contact" className="btn btn-book">{E.cta}</a>
      </div>
    </section>
  );
}

// Parcours « Comment ça se passe »
function Process() {
  const P = window.KD.process;
  return (
    <section id="parcours" className="section process" aria-labelledby="proc-title">
      <div className="wrap">
        <div className="section-head reveal">
          <span className="eyebrow">{P.eyebrow}</span>
          <h2 id="proc-title">{P.title}</h2>
          <p>{P.intro}</p>
        </div>
        <ol className="proc-steps">
          {P.steps.map((s, i) => (
            <li className="proc-step reveal" data-d={(i % 3) + 1} key={i}>
              <span className="proc-num" style={{ "--c": s.color }}>{i + 1}</span>
              <div className="proc-text">
                <h3>{s.t}</h3>
                <p>{s.d}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

// Carrousel de témoignages (client + animal + photo)
function Testimonials() {
  const T = window.KD.testimonials;
  const U = window.KD.ui;
  const [idx, setIdx] = useState(0);
  const [hover, setHover] = useState(false);
  const [interacting, setInteracting] = useState(false);
  const interactTimer = useRef(0);
  const fillRef = useRef(null);
  const n = T.items.length;
  const reduce = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const DELAY = 6500;
  const bump = () => { setInteracting(true); clearTimeout(interactTimer.current); interactTimer.current = setTimeout(() => setInteracting(false), 8000); };
  const go = (d) => { setIdx((v) => (v + d + n) % n); bump(); };
  const goTo = (i) => { setIdx(i); bump(); };
  useEffect(() => { setIdx(0); }, [window.__KDLANG]);

  // Autoplay + remplissage de la barre active (lecture confortable ~6,5 s).
  const paused = hover || interacting;
  useEffect(() => {
    if (fillRef.current && !reduce) fillRef.current.style.transform = "scaleX(0)";
    if (reduce || paused || n <= 1) return;
    let raf, start = null;
    const tick = (ts) => {
      if (start === null) start = ts;
      const p = Math.min(1, (ts - start) / DELAY);
      if (fillRef.current) fillRef.current.style.transform = "scaleX(" + p + ")";
      if (p >= 1) { setIdx((v) => (v + 1) % n); return; }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => raf && cancelAnimationFrame(raf);
  }, [idx, paused, n, reduce]);

  const t = T.items[idx];
  return (
    <section className="section testimonials" aria-labelledby="tm-title">
      <div className="wrap">
        <div className="section-head reveal" style={{ marginInline: "auto", textAlign: "center" }}>
          <span className="eyebrow" style={{ justifyContent: "center" }}>{T.eyebrow}</span>
          <h2 id="tm-title">{T.title}</h2>
          {T.google && (
            <div className="tm-google" aria-label={T.google.label + " " + T.google.rating}>
              <span className="tm-google-logo" aria-hidden="true">G</span>
              <span className="tm-google-stars" aria-hidden="true">★★★★★</span>
              <span className="tm-google-rating">{T.google.rating}</span>
              <span className="tm-google-meta">{T.google.count} · {T.google.label}</span>
            </div>
          )}
        </div>

        <div className="tm-carousel reveal" data-d="1"
          onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
          <button className="tm-arrow" onClick={() => go(-1)} aria-label={U.prev}>‹</button>

          <figure className="tm-card" key={idx}>
            <div className="tm-photo photo-card">
              {/* ZONE PHOTO : portrait du client avec son animal */}
              <PhotoZone color={t.color} label={t.author} alt={t.alt} src={t.src} monoSize={52} />
            </div>
            <div className="tm-body">
              <span className={"tm-badge" + (t.verified ? " is-verified" : "")}>
                {t.verified && <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>}
                {t.verified ? U.tmVerified : U.tmExample}
              </span>
              <span className="tm-quote" aria-hidden="true">“</span>
              <blockquote>{t.quote}</blockquote>
              <figcaption>
                <strong>{t.author}</strong>
                <span>{t.animal} · {t.place}</span>
              </figcaption>
            </div>
          </figure>

          <button className="tm-arrow" onClick={() => go(1)} aria-label={U.next}>›</button>
        </div>

        <div className="pfc-prog tm-prog" role="tablist" aria-label={T.eyebrow}>
          {T.items.map((_, i) => (
            <button key={i} type="button" role="tab" className={"pfc-seg" + (i === idx ? " on" : "")}
              onClick={() => goTo(i)} aria-selected={i === idx} aria-label={(i + 1) + " / " + n}>
              <span ref={i === idx ? fillRef : null} className="pfc-seg-fill"
                style={{ transform: "scaleX(" + (i === idx ? (reduce ? 1 : 0) : 0) + ")" }}></span>
            </button>
          ))}
        </div>
        <p className="tm-note reveal">{T.note}</p>
      </div>
    </section>
  );
}

// Produits / œuvres + boutique Etsy
function Products() {
  const P = window.KD.products;
  return (
    <section id="produits" className="section section--soft products" aria-labelledby="prod-title">
      <div className="wrap">
        <div className="products-head reveal">
          <div>
            <span className="eyebrow">{P.eyebrow}</span>
            <h2 id="prod-title">{P.title}</h2>
            <p className="products-intro">{P.intro}</p>
          </div>
          <div className="products-cta-wrap">
            <a href={P.ctaHref} target="_blank" rel="noopener" className="btn btn-blue products-cta">{P.cta} →</a>
            {P.shopNote && <p className="products-shopnote"><span aria-hidden="true">e</span>{P.shopNote}</p>}
          </div>
        </div>
        <div className="products-grid">
          {P.items.map((it, i) => (
            <article className="product-card reveal" data-d={(i % 3) + 1} key={i}>
              <div className="product-photo photo-card">
                {/* ZONE PHOTO : produit / œuvre */}
                <PhotoZone color={it.color} label={it.t} alt={it.alt} monoSize={48} />
              </div>
              <h3>{it.t}</h3>
              <p>{it.d}</p>
            </article>
          ))}
        </div>
        {P.extras && (
          <div className="products-extras reveal" data-d="2">
            <span className="products-extras-title">{P.extrasTitle}</span>
            <ul className="products-extras-list">
              {P.extras.map((x, i) => (
                <li key={i}><strong>{x.t}</strong><span>{x.d}</span></li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}

// Infolettre
function Newsletter() {
  const N = window.KD.newsletter;
  const [done, setDone] = useState(false);
  return (
    <section id="newsletter" className="section newsletter" aria-labelledby="nl-title">
      <div className="wrap newsletter-inner reveal">
        <div className="newsletter-text">
          <span className="eyebrow">{N.eyebrow}</span>
          <h2 id="nl-title">{N.title}</h2>
          <p>{N.body}</p>
          {N.perks && (
            <ul className="newsletter-perks">
              {N.perks.map((p, i) => <li key={i}><span aria-hidden="true">✦</span>{p}</li>)}
            </ul>
          )}
        </div>
        <form className="newsletter-form" onSubmit={(e) => { e.preventDefault(); setDone(true); }}>
          {done ? (
            <p className="newsletter-success" role="status">{N.success}</p>
          ) : (
            <React.Fragment>
              <label className="vh" htmlFor="nl-email">{N.placeholder}</label>
              <input id="nl-email" type="email" placeholder={N.placeholder} required />
              <button type="submit" className="btn btn-book">{N.submit}</button>
            </React.Fragment>
          )}
        </form>
      </div>
    </section>
  );
}

/* Prochains déplacements */
function Travel() {
  const V = window.KD.travel;
  return (
    <section id="deplacements" className="section section--soft travel" aria-labelledby="tv-title">
      <div className="wrap">
        <div className="section-head reveal">
          <span className="eyebrow">{V.eyebrow}</span>
          <h2 id="tv-title">{V.title}</h2>
          <p>{V.intro}</p>
        </div>
        <ul className="tv-list">
          {V.stops.map((s, i) => (
            <li className="tv-stop reveal" data-d={(i % 3) + 1} key={i}>
              <div className="tv-when"><span className="tv-period">{s.period}</span><span className="tv-spots">{s.spots}</span></div>
              <div className="tv-where"><h3>{s.city}</h3><span className="tv-type">{s.type}</span></div>
              <div className="tv-cta">
                <a href="#contact" className="btn btn-blue tv-notify" onClick={(e) => { e.preventDefault(); window.KDnav && window.KDnav("contact"); }}>{V.notify}</a>
                <a href="#contact" className="btn btn-book tv-book" onClick={(e) => { e.preventDefault(); window.KDnav && window.KDnav("contact"); }}>{V.book}</a>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

Object.assign(window, { Counters, Empathy, Process, Testimonials, Products, Newsletter, Travel });
