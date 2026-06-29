/* FAQ complète (accordéon) + Espace client / Galeries privées */

function FaqItem({ q, a, open, onToggle, id }) {
  const ref = useRef(null);
  return (
    <div className={"faq-item" + (open ? " is-open" : "")}>
      <h3 className="faq-q">
        <button type="button" id={"fq-" + id} aria-expanded={open} aria-controls={"fa-" + id}
          className="faq-trigger" onClick={onToggle}>
          <span>{q}</span>
          <span className="faq-ic" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
        </button>
      </h3>
      <div id={"fa-" + id} role="region" aria-labelledby={"fq-" + id} className="faq-a"
        ref={ref} style={{ maxHeight: open ? (ref.current ? ref.current.scrollHeight + "px" : "600px") : "0px" }}>
        <p>{a}</p>
      </div>
    </div>
  );
}

function Faq() {
  const F = window.KD.faq;
  const [open, setOpen] = useState("0-0"); // premier ouvert
  return (
    <section id="faq" className="section section--soft faq" aria-labelledby="faq-title">
      <div className="wrap">
        <div className="section-head reveal" style={{ marginInline: "auto", textAlign: "center" }}>
          <span className="eyebrow" style={{ justifyContent: "center" }}>{F.eyebrow}</span>
          <h2 id="faq-title">{F.title}</h2>
          <p style={{ marginInline: "auto" }}>{F.intro}</p>
        </div>

        <div className="faq-groups">
          {F.groups.map((g, gi) => (
            <div className="faq-group reveal" data-d={(gi % 3) + 1} key={gi}>
              <h3 className="faq-group-name">{g.name}</h3>
              <div className="faq-list">
                {g.items.map((it, ii) => {
                  const key = gi + "-" + ii;
                  return (
                    <FaqItem key={key} id={key} q={it.q} a={it.a}
                      open={open === key} onToggle={() => setOpen((v) => (v === key ? null : key))} />
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="faq-foot reveal">
          <a href="#contact" className="btn btn-book"
            onClick={(e) => { e.preventDefault(); window.KDnav && window.KDnav("contact"); }}>{F.cta}</a>
        </div>
      </div>
    </section>
  );
}

function ClientArea() {
  const C = window.KD.clientarea;
  const icons = {
    0: "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z|circle:12,12,3",
    1: "M12 3v12M7 10l5 5 5-5M5 21h14",
    2: "M3 7h18v13H3zM3 7l3-3h7l3 3",
    3: "M4 12a8 8 0 0 1 16 0|M9 12l2 2 4-4",
  };
  const Ic = ({ k }) => {
    const p = { width: 22, height: 22, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true };
    if (k === 0) return (<svg {...p}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>);
    if (k === 1) return (<svg {...p}><path d="M12 3v12" /><path d="M7 10l5 5 5-5" /><path d="M5 21h14" /></svg>);
    if (k === 2) return (<svg {...p}><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M3 7l3-3h7l3 3" /></svg>);
    return (<svg {...p}><path d="M4 12a8 8 0 1 1 16 0" /><path d="M9 12l2 2 4-4" /></svg>);
  };
  const [code, setCode] = useState("");
  return (
    <section id="espace-client" className="section client-area" aria-labelledby="ca-title">
      <div className="wrap client-grid">
        <div className="client-text reveal">
          <span className="eyebrow">{C.eyebrow}</span>
          <h2 id="ca-title">{C.title}</h2>
          <p className="client-body">{C.body}</p>
          <form className="client-login" onSubmit={(e) => e.preventDefault()}>
            <label className="vh" htmlFor="ca-code">{C.codePlaceholder}</label>
            <input id="ca-code" type="text" placeholder={C.codePlaceholder}
              value={code} onChange={(e) => setCode(e.target.value)} />
            <button type="submit" className="btn btn-book">{C.cta}</button>
          </form>
          <p className="client-note">{C.note}</p>
        </div>

        <ul className="client-features reveal" data-d="1">
          {C.features.map((f, i) => (
            <li className="client-feature" key={i}>
              <span className="client-fic" aria-hidden="true"><Ic k={i} /></span>
              <div><strong>{f.t}</strong><span>{f.d}</span></div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

Object.assign(window, { Faq, ClientArea });
