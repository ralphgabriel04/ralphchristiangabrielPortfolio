/* Carrousel portfolio intelligent
   - < 5 images  → grand format (fondu enchaîné, immersif)
   - ≥ 5 images  → multi-cartes (5 visibles desktop · 3 tablette · 1–2 mobile)
   Autoplay ~5,5 s avec indicateur de progression qui se remplit, pause au survol
   et à l'interaction, boucle douce, clavier + reduced-motion + lightbox. */

function SmartCarousel({ items }) {
  const reduce = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const big = items.length < 5;
  const DELAY = 5500;

  const [visible, setVisible] = useState(big ? 1 : 5);
  useEffect(() => {
    if (big) { setVisible(1); return; }
    const calc = () => {
      const w = window.innerWidth;
      setVisible(w <= 420 ? 1 : w <= 640 ? 2 : w <= 980 ? 3 : 5);
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, [big]);

  const per = big ? 1 : visible;
  const steps = big ? items.length : Math.max(1, Math.ceil(items.length / per));

  const [step, setStep] = useState(0);
  const [hover, setHover] = useState(false);
  const [interacting, setInteracting] = useState(false);
  const [lb, setLb] = useState(-1);
  const interactTimer = useRef(0);
  const touch = useRef({ x: 0, on: false });
  const fillRef = useRef(null);

  // Si le nombre d'étapes change (resize / filtre), on borne l'étape.
  useEffect(() => { setStep((s) => (s > steps - 1 ? 0 : s)); }, [steps]);

  const paused = hover || interacting || lb >= 0;

  const bump = () => {
    setInteracting(true);
    clearTimeout(interactTimer.current);
    interactTimer.current = setTimeout(() => setInteracting(false), 7000);
  };
  const goTo = (s) => { setStep(((s % steps) + steps) % steps); bump(); };
  const go = (d) => goTo(step + d);

  // Autoplay + remplissage de la barre active (DOM direct → pas de re-render/frame).
  useEffect(() => {
    if (fillRef.current && !reduce) fillRef.current.style.transform = "scaleX(0)";
    if (reduce || paused || steps <= 1) return;
    let raf, start = null;
    const tick = (t) => {
      if (start === null) start = t;
      const p = Math.min(1, (t - start) / DELAY);
      if (fillRef.current) fillRef.current.style.transform = "scaleX(" + p + ")";
      if (p >= 1) { setStep((s) => (s + 1) % steps); return; }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => raf && cancelAnimationFrame(raf);
  }, [step, paused, steps, reduce]);

  const onTouchStart = (e) => { touch.current = { x: e.touches[0].clientX, on: true }; };
  const onTouchEnd = (e) => {
    if (!touch.current.on) return;
    const dx = e.changedTouches[0].clientX - touch.current.x;
    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
    touch.current.on = false;
  };

  const card = (it, gi, mono) => (
    <button type="button" className="pfc-card photo-card" key={it.title + gi}
      onClick={() => { setLb(gi); bump(); }} aria-label={it.alt}>
      <PhotoZone color={it.color} label={it.cat} alt={it.alt} src={it.src} monoSize={mono} />
      <span className="photo-cap">{it.title}</span>
    </button>
  );

  const pages = [];
  if (!big) for (let s = 0; s < steps; s++) pages.push(items.slice(s * per, s * per + per));

  return (
    <div className={"pfc " + (big ? "pfc--big" : "pfc--multi vis-" + per)} style={big ? undefined : { "--vis": per }}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      role="group" aria-roledescription="carrousel" aria-label="Aperçu du portfolio">

      <div className="pfc-stage">
        {steps > 1 && <button type="button" className="pfc-arrow prev" onClick={() => go(-1)} aria-label="Images précédentes">‹</button>}

        <div className="pfc-viewport" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        {big ? (
          <div className="pfc-stack">
            {items.map((it, idx) => (
              <div className={"pfc-fade" + (idx === step ? " on" : "")} key={it.title + idx} aria-hidden={idx !== step}>
                {card(it, idx, 110)}
              </div>
            ))}
          </div>
        ) : (
          <div className="pfc-track" style={{ transform: "translateX(-" + (step * 100) + "%)" }}>
            {pages.map((page, pi) => (
              <div className="pfc-page" key={pi} aria-hidden={pi !== step}>
                {page.map((it, j) => card(it, pi * per + j, 64))}
              </div>
            ))}
          </div>
        )}
        </div>
        {steps > 1 && <button type="button" className="pfc-arrow next" onClick={() => go(1)} aria-label="Images suivantes">›</button>}
      </div>

      {steps > 1 && (
        <div className="pfc-prog" role="tablist" aria-label="Progression du carrousel">
          {Array.from({ length: steps }).map((_, d) => (
            <button type="button" key={d} role="tab" aria-selected={d === step}
              className={"pfc-seg" + (d === step ? " on" : "")}
              aria-label={"Aller à " + (big ? "l’image " : "la vue ") + (d + 1) + " sur " + steps}
              onClick={() => goTo(d)}>
              <span ref={d === step ? fillRef : null} className="pfc-seg-fill"
                style={{ transform: "scaleX(" + (d === step ? (reduce ? 1 : 0) : 0) + ")" }}></span>
            </button>
          ))}
        </div>
      )}

      {lb >= 0 && <Lightbox items={items} index={lb} setIndex={setLb} onClose={() => setLb(-1)} />}
    </div>
  );
}

Object.assign(window, { SmartCarousel });
