/* Section « Partenaires & collaborations »
   - Grille de cartes : partenaires réels (lien externe) + placeholders « à venir »
   - Marque texte (initiales) faute de logo fourni ; se remplace par un vrai logo plus tard
   - Réutilise les conventions (section, wrap, eyebrow, reveal) */
function Partners() {
  const P = window.KD.partners;
  if (!P) return null;
  const items = P.items || [];
  const placeholders = Array.from({ length: P.placeholders || 0 });
  return (
    <section id="partenaires" className="section section--soft partners-sec" aria-labelledby="pt-title">
      <div className="wrap">
        <div className="section-head reveal">
          <span className="eyebrow">{P.eyebrow}</span>
          <h2 id="pt-title">{P.title}</h2>
          <p>{P.intro}</p>
        </div>
        <ul className="pt-grid">
          {items.map((it, i) => (
            <li key={it.name} className="reveal" data-d={(i % 3) + 1}>
              <a className="pt-card" href={it.href} target="_blank" rel="noopener noreferrer">
                <span className={"pt-mark" + (it.photo ? " pt-mark--photo" : it.logo ? " pt-mark--logo" : "")}
                  style={{ "--pt-accent": it.accent }} aria-hidden="true">
                  {it.photo ? <img src={it.photo} alt="" loading="lazy" decoding="async" />
                    : it.logo ? <img src={it.logo} alt="" loading="lazy" decoding="async" />
                    : it.initials}
                </span>
                <span className="pt-body">
                  <strong className="pt-name">{it.name}</strong>
                  <span className="pt-role">{it.role}</span>
                  {it.desc && <span className="pt-desc">{it.desc}</span>}
                </span>
                <span className="pt-visit">{P.visit}<span className="pt-arrow" aria-hidden="true">→</span></span>
              </a>
            </li>
          ))}
          {placeholders.map((_, i) => (
            <li key={"pt-ph-" + i} className="reveal" data-d={((items.length + i) % 3) + 1}>
              <div className="pt-card pt-card--empty">
                <span className="pt-mark pt-mark--empty" aria-hidden="true"><Monogram size={24} /></span>
                <span className="pt-body">
                  <strong className="pt-name">{P.placeholderName}</strong>
                  <span className="pt-role">{P.placeholderRole}</span>
                </span>
                <span className="pt-visit pt-visit--muted">{P.placeholderCta}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

Object.assign(window, { Partners });
