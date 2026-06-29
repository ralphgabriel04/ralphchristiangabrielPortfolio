/* ============================================================
   Fil signature — couture verticale « cousue » au scroll
   - REPENSÉ : le fil descend dans la MARGE GAUCHE (hors de la
     colonne de texte) en serpentin doux + petits nœuds de couture
     à chaque section. Il ne croise JAMAIS le contenu.
   - PRIMAIRE : CSS Scroll-Driven Animations (animation-timeline: scroll())
     → tracé (stroke-dashoffset) + point de tête (offset-path) pilotés
       par le compositeur, 60 fps, aucun travail JS par frame.
   - REPLI : requestAnimationFrame (un seul rAF/frame) si pas de support.
   - prefers-reduced-motion → fil complet STATIQUE, point de tête masqué.
   - décoratif : aria-hidden + pointer-events:none, jamais bloquant.
   ============================================================ */

function ScrollThread() {
  const wrapRef = useRef(null);
  const pathRef = useRef(null);
  const headRef = useRef(null);
  const [geo, setGeo] = useState({ w: 0, h: 0, d: "", nodes: [] });

  const supportsTimeline = (() => {
    try { return CSS && CSS.supports && CSS.supports("animation-timeline: scroll()"); }
    catch (e) { return false; }
  })();
  const reduced = () =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Trace une couture verticale dans la marge gauche vide (jamais sur le contenu)
  const build = useCallback(() => {
    const secs = [...document.querySelectorAll("main > section, .site-footer")];
    if (!secs.length) return;
    const vw = window.innerWidth;
    // Hauteur = bas du dernier bloc (footer), JAMAIS scrollHeight (qui peut
    // inclure le débordement du fil lui-même → hauteur fantôme sous le footer).
    const lastEl = secs[secs.length - 1];
    const docH = Math.round(
      lastEl.getBoundingClientRect().bottom + window.scrollY
    );

    // Largeur de la marge gauche vide = bord gauche de la colonne de contenu
    const wrapEl = document.querySelector(".wrap");
    let marginL = 40;
    if (wrapEl) {
      const wr = wrapEl.getBoundingClientRect();
      const padL = parseFloat(getComputedStyle(wrapEl).paddingLeft) || 24;
      marginL = Math.max(24, wr.left + padL); // espace libre à gauche du texte
    }
    const mobile = vw <= 760;
    // Rail au milieu de la marge, amplitude contenue DANS la marge → zéro chevauchement
    let railX = mobile ? Math.min(20, marginL * 0.5) : marginL * 0.46;
    let amp = mobile ? 6 : Math.min(20, marginL * 0.24);
    if (railX + amp > marginL - 6) amp = Math.max(3, marginL - 6 - railX);
    railX = Math.max(mobile ? 12 : 16, railX);

    const pts = secs.map((s, i) => {
      const r = s.getBoundingClientRect();
      const y = r.top + window.scrollY + r.height * 0.5;
      const x = railX + (i % 2 === 0 ? -amp : amp); // serpentin doux dans la marge
      return { x, y };
    });

    let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
    for (let i = 1; i < pts.length; i++) {
      const p0 = pts[i - 1], p1 = pts[i];
      const my = (p0.y + p1.y) / 2;
      d += ` C ${p0.x.toFixed(1)} ${my.toFixed(1)}, ${p1.x.toFixed(1)} ${my.toFixed(1)}, ${p1.x.toFixed(1)} ${p1.y.toFixed(1)}`;
    }
    setGeo({ w: vw, h: docH, d, nodes: pts });
  }, []);

  // (Re)construit au montage, après chargement, au resize et sur relayout
  useEffect(() => {
    build();
    const t1 = setTimeout(build, 350);
    const t2 = setTimeout(build, 1200);
    window.addEventListener("resize", build);
    window.addEventListener("kd:relayout", build);
    window.addEventListener("load", build);
    return () => {
      clearTimeout(t1); clearTimeout(t2);
      window.removeEventListener("resize", build);
      window.removeEventListener("kd:relayout", build);
      window.removeEventListener("load", build);
    };
  }, [build]);

  // Applique le tracé : longueur, repli statique ou pilotage
  useEffect(() => {
    const path = pathRef.current;
    const head = headRef.current;
    const wrap = wrapRef.current;
    if (!path || !geo.d) return;
    const L = path.getTotalLength();
    if (!L) return;
    path.style.setProperty("--thread-len", L + "px");

    const isReduced = reduced();

    // Mode CSS (primaire) : on active les animations scroll-driven, zéro JS/frame
    if (supportsTimeline && !isReduced) {
      head.style.offsetPath = `path('${geo.d}')`;
      head.style.transform = "";
      wrap.classList.add("thread-anim");
      return;
    }

    // Repli statique (mouvement réduit) : fil complet, tête masquée
    wrap.classList.remove("thread-anim");
    if (isReduced) {
      path.style.strokeDashoffset = "0";
      head.style.opacity = "0";
      return;
    }

    // Repli JS : rAF sur le scroll (un seul par frame)
    path.style.strokeDasharray = L;
    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      const max = Math.max(1, document.documentElement.scrollHeight - vh);
      const prog = Math.min(1, Math.max(0, window.scrollY / max));
      const drawn = L * prog;
      path.style.strokeDashoffset = L - drawn;
      const pt = path.getPointAtLength(drawn);
      head.style.transform = `translate(${pt.x.toFixed(1)}px, ${pt.y.toFixed(1)}px)`;
      head.style.opacity = prog > 0.004 && prog < 0.996 ? "1" : "0";
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [geo, supportsTimeline]);

  return (
    <div ref={wrapRef} className="thread-wrap" aria-hidden="true">
      <svg
        className="thread-svg"
        width={geo.w}
        height={geo.h}
        viewBox={`0 0 ${geo.w} ${geo.h}`}
        focusable="false"
      >
        <path ref={pathRef} className="thread-path" d={geo.d} fill="none" />
        {geo.nodes.map((n, i) => (
          <circle key={i} className="thread-node" cx={n.x} cy={n.y} r="2.6" />
        ))}
      </svg>
      <span ref={headRef} className="thread-head"></span>
    </div>
  );
}

Object.assign(window, { ScrollThread });
