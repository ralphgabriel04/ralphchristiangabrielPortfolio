/* Avant le pont de l’arc-en-ciel + Blog + Témoignages + Contact + Pied de page */

function RainbowBridge() {
  const R = window.KD.rainbow;
  const U = window.KD.ui;
  return (
    <section id="memoire" className="section rainbow" aria-labelledby="rb-title">
      <div className="wrap rainbow-grid">
        <div className="rainbow-text reveal">
          <span className="eyebrow">{R.eyebrow}</span>
          <h2 id="rb-title">{R.title}</h2>
          <p className="rainbow-body">{R.body}</p>
          <p className="rainbow-price"><strong>{R.price}</strong><span>{R.priceNote}</span></p>
          <a href="#contact" className="btn btn-ghost">{R.cta}</a>
        </div>
        <div className="rainbow-media reveal" data-d="1">
          {/* ZONE PHOTO : séance mémoire, lumière douce */}
          <PhotoZone color="#5E768A" label={R.label} alt={R.alt} src={R.src} monoSize={80} className="rainbow-photo" />
        </div>
      </div>

      {/* Annotation : traitement de la section mémoire */}
      <span className="anno-dot" style={{ left: "calc(var(--gut))", bottom: "18px" }}>3</span>
      <aside className="anno" style={{ left: "var(--gut)", bottom: "44px" }}>
        <span className="anno-tag">{U.annoTag}</span>
        <span dangerouslySetInnerHTML={{ __html: U.anno3 }}></span>
      </aside>
    </section>
  );
}

function Blog() {
  const B = window.KD.blog;
  const U = window.KD.ui;
  const cats = B.categories || [];
  const [active, setActive] = useState(0);
  const posts = active === 0 || !cats.length ? B.posts : B.posts.filter((p) => p.category === cats[active]);
  return (
    <section id="blog" className="section section--soft blog" aria-labelledby="blog-title">
      <div className="wrap">
        <div className="blog-head reveal">
          <div>
            <span className="eyebrow">{B.eyebrow}</span>
            <h2 id="blog-title">{B.title}</h2>
          </div>
          <a href="#blog" className="btn btn-ghost blog-head-cta">{B.cta} →</a>
        </div>

        {cats.length > 0 && (
          <div className="blog-cats reveal" data-d="1" role="tablist" aria-label={B.eyebrow}>
            {cats.map((c, i) => (
              <button key={c} type="button" role="tab" aria-selected={active === i}
                className={"blog-cat" + (active === i ? " on" : "")} onClick={() => setActive(i)}>{c}</button>
            ))}
          </div>
        )}

        <div className="blog-grid">
          {posts.map((post, i) => (
            <a key={post.title} href="#blog" className={"blog-card reveal" + (post.real ? " is-real" : " is-draft")} data-d={(i % 3) + 1}>
              <div className="blog-thumb photo-card">
                {/* ZONE PHOTO : vignette d’article */}
                <PhotoZone color={post.color} label={post.category} alt={post.alt} monoSize={48} />
                {post.real ? <span className="blog-flag">{U.realArticle}</span> : <span className="blog-flag blog-flag--draft">{U.draftLabel}</span>}
              </div>
              <div className="blog-body">
                <div className="blog-meta"><span>{post.category}</span><span>·</span><time>{post.date}</time></div>
                <h3 className="blog-title-3">{post.title}</h3>
                <p className="blog-excerpt">{post.excerpt}</p>
                <span className="blog-readmore">{U.readArticle}</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const C = window.KD.contact;
  const U = window.KD.ui;
  const [sent, setSent] = useState(false);
  const submit = (e) => { e.preventDefault(); setSent(true); };
  return (
    <section id="contact" className="section section--soft contact" aria-labelledby="ct-title">
      <div className="wrap contact-grid">
        <div className="contact-intro reveal">
          <span className="eyebrow">{C.eyebrow}</span>
          <h2 id="ct-title">{C.title}</h2>
          <p>{C.intro}</p>
          <ul className="contact-coords">
            <li><span className="cc-label">{C.emailLabel}</span><a href={"mailto:" + C.email}>{C.email}</a></li>
            <li><span className="cc-label">{C.phoneLabel}</span><a href={"tel:" + C.phone.replace(/\s/g, "")}>{C.phone}</a></li>
          </ul>
          {C.coordsNote && <p className="contact-confirm">{C.coordsNote}</p>}
          <p className="contact-channels">{C.channelsNote}</p>
          <div className="contact-social">
            {window.KD.social.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener" className="social-chip">{s.label}</a>
            ))}
          </div>
        </div>

        <form className="contact-form reveal" data-d="1" onSubmit={submit} noValidate>
          {sent ? (
            <div className="form-success" role="status">
              <Monogram size={56} spin dash />
              <p>{C.success}</p>
              <button type="button" className="btn btn-ghost" onClick={() => setSent(false)}>{C.newRequest}</button>
            </div>
          ) : (
            <React.Fragment>
              <label className="field"><span>{C.fields.name}</span>
                <input type="text" name="name" autoComplete="name" required /></label>
              <label className="field"><span>{C.fields.email}</span>
                <input type="email" name="email" autoComplete="email" required /></label>
              <label className="field"><span>{C.fields.animal}</span>
                <input type="text" name="animal" /></label>
              <label className="field"><span>{C.fields.message}</span>
                <textarea name="message" rows="4"></textarea></label>
              <button type="submit" className="btn btn-book form-submit">{C.fields.submit}</button>
            </React.Fragment>
          )}
        </form>
      </div>
    </section>
  );
}

function Footer() {
  const D = window.KD;
  const U = D.ui;
  return (
    <footer className="site-footer">
      <div className="wrap footer-grid">
        <div className="footer-brand">
          <a className="brand" href="#accueil" aria-label={D.brand.full + " — " + D.nav[0].label}>
            <Monogram size={48} spin dash />
            <span className="brand-text"><strong>{D.brand.name}</strong><em>{D.brand.roleline}</em></span>
          </a>
          <p className="footer-blurb">{D.footer.blurb}</p>
          <div className="footer-social">
            {D.social.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener">{s.label}</a>
            ))}
          </div>
        </div>

        <nav className="footer-col" aria-label={D.footer.exploreTitle}>
          <h4>{D.footer.exploreTitle}</h4>
          {D.nav.map((n) => <a key={n.label} href={n.href}>{n.label}</a>)}
        </nav>

        <div className="footer-col">
          <h4>{D.footer.regionsTitle}</h4>
          <ul className="footer-regions">
            {D.regions.map((r) => <li key={r}>{r}</li>)}
          </ul>
          <p className="footer-regions-extra">{D.footer.regionsExtra}</p>
        </div>

        <nav className="footer-col" aria-label={D.footer.moreTitle}>
          <h4>{D.footer.moreTitle}</h4>
          {D.footer.moreLinks.map((m, i) => {
            const targets = ["#faq", "#espace-client", "#produits", D.products.ctaHref];
            const href = targets[i] || "#contact";
            const ext = href === D.products.ctaHref;
            const onClick = ext ? undefined : (e) => {
              e.preventDefault();
              const id = href.replace("#", "");
              window.KDnav && window.KDnav(id === "produits" ? "produits" : id);
            };
            return (
              <a key={m} href={href} target={ext ? "_blank" : undefined} rel={ext ? "noopener" : undefined} onClick={onClick}>{m}</a>
            );
          })}
        </nav>
      </div>

      <div className="wrap footer-bottom">
        <span>{D.footer.copyright}</span>
        <span className="footer-mock">{U.mockNote}</span>
      </div>
    </footer>
  );
}

Object.assign(window, { RainbowBridge, Blog, Contact, Footer });
