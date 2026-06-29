/* App — assemble la page (V3) + Mode administrateur (éditeur visuel intégré)
   L'apparence est pilotée par l'éditeur (variables CSS) ; les sections sont
   rendues d'après la liste éditable (afficher/masquer/réordonner). */

/* Réglages Tweaks restreints à ce que l'éditeur ne couvre pas (héros, grain) */
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "hero": "plein-bleed",
  "grain": true,
  "heromark": "discret"
}/*EDITMODE-END*/;

function BackToTop({ label }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => { raf = 0; setShow(window.scrollY > window.innerHeight * 0.8); });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => { window.removeEventListener("scroll", onScroll); if (raf) cancelAnimationFrame(raf); };
  }, []);
  const toTop = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };
  return (
    <button type="button" className={"back-to-top" + (show ? " is-visible" : "")}
      onClick={toTop} aria-label={label} title={label}>
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
        <path d="M12 19V6M6 12l6-6 6 6" stroke="currentColor" strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

function Site() {
  const ed = useEditor();
  const { st, setAppearance } = ed;
  const theme = st.appearance.theme === "dark" ? "dark" : "light";

  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [showAnno, setShowAnno] = useState(false);
  const readRoute = () => (location.hash === "#galerie" ? "portfolio" : location.hash === "#toutes-distinctions" ? "distinctions" : "home");
  const [route, setRoute] = useState(readRoute);
  const [lang, setLang] = useState(() => {
    try { return localStorage.getItem("kd-lang") || "fr"; } catch (e) { return "fr"; }
  });
  const [audience, setAudience] = useState(() => {
    try { return localStorage.getItem("kd-aud") || "particuliers"; } catch (e) { return "particuliers"; }
  });
  window.__KDLANG = lang;

  // Routage léger accueil ↔ portfolio (hash #galerie), exposé globalement
  useEffect(() => {
    const onHash = () => setRoute(readRoute());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  window.KDnav = (target) => {
    // Libère un éventuel verrou de défilement (menu mobile ouvert)
    document.body.style.overflow = "";
    if (target === "portfolio") {
      if (location.hash !== "#galerie") location.hash = "galerie"; else setRoute("portfolio");
      window.scrollTo(0, 0);
    } else if (target === "distinctions-all") {
      if (location.hash !== "#toutes-distinctions") location.hash = "toutes-distinctions"; else setRoute("distinctions");
      window.scrollTo(0, 0);
    } else {
      const id = target && !["home", "accueil"].includes(target) ? target : null;
      if (location.hash) { try { history.pushState("", document.title, location.pathname + location.search); } catch (e) {} }
      setRoute("home");
      const doScroll = () => {
        if (id) { const el = document.getElementById(id); if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: "smooth" }); }
        else window.scrollTo({ top: 0, behavior: "smooth" });
      };
      requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(doScroll, 70)));
    }
  };

  useEffect(() => {
    document.documentElement.setAttribute("lang", lang);
    try { localStorage.setItem("kd-lang", lang); } catch (e) {}
    const U = window.KD_I18N[lang].ui;
    document.title = U.pageTitle;
    const md = document.querySelector('meta[name="description"]');
    if (md) md.setAttribute("content", U.metaDesc);
    requestAnimationFrame(() => window.dispatchEvent(new Event("kd:relayout")));
  }, [lang]);

  useEffect(() => {
    try { localStorage.setItem("kd-aud", audience); } catch (e) {}
    requestAnimationFrame(() => window.dispatchEvent(new Event("kd:relayout")));
  }, [audience]);

  // Héros plein/demi-bleed + grain (réglages Tweaks)
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-hero", t.hero);
    root.setAttribute("data-grain", t.grain ? "on" : "off");
    root.setAttribute("data-heromark", t.heromark || "discret");
  }, [t.hero, t.grain, t.heromark]);

  // Réordonnancement / masquage des sections → recalcul du fil + reveals.
  // On ne révèle d'office que ce qui est déjà visible ; le reste s'anime au scroll
  // (et peut rejouer si « rejouer au défilement » est actif).
  useEffect(() => {
    requestAnimationFrame(() => {
      window.dispatchEvent(new Event("kd:relayout"));
      const vh = window.innerHeight || 800;
      document.querySelectorAll(".reveal:not(.in)").forEach((e) => {
        if (e.getBoundingClientRect().top < vh * 0.92) e.classList.add("in");
      });
    });
  }, [st.sections]);

  useEffect(() => { document.body.classList.toggle("show-anno", showAnno); }, [showAnno]);

  useReveal();

  const U = window.KD.ui;

  // Registre des sections (clé → composant)
  const REG = {
    hero: <Hero audience={audience} />,
    counters: <Counters />,
    empathy: <Empathy audience={audience} />,
    awards: <Distinctions />,
    portfolio: <Portfolio audience={audience} />,
    about: <About />,
    process: <Process />,
    packages: <Packages />,
    rainbow: <RainbowBridge />,
    testimonials: <Testimonials />,
    products: <Products />,
    clientarea: <ClientArea />,
    blog: <Blog />,
    newsletter: <Newsletter />,
    travel: <Travel />,
    faq: <Faq />,
    contact: <Contact />,
  };

  return (
    <React.Fragment>
      <a href="#accueil" className="skip-link">{U.skip}</a>
      <Header theme={theme} lang={lang} onSetLang={setLang}
        audience={audience} onSetAudience={setAudience}
        onToggleTheme={() => setAppearance({ theme: theme === "dark" ? "light" : "dark" })}
        showAnno={showAnno} onToggleAnno={() => setShowAnno((v) => !v)} />
      <main>
        {route === "portfolio" ? (
          <PortfolioPage />
        ) : route === "distinctions" ? (
          <DistinctionsPage />
        ) : (
          <React.Fragment>
            <ScrollThread />
            {st.sections.filter((s) => s.visible).map((s) => (
              <React.Fragment key={s.id}>{REG[s.id]}</React.Fragment>
            ))}
          </React.Fragment>
        )}
      </main>
      <Footer />
      <BackToTop label={U.backToTop} />

      {/* Mode administrateur (éditeur visuel intégré) */}
      <InlineEditingLayer />
      <AdminToggle />
      <AdminPanel />
      <AdminToast />
      <Concierge />

      <TweaksPanel>
        <TweakSection label="Héros" />
        <TweakRadio label="Cadrage" value={t.hero} options={["plein-bleed", "demi-bleed"]}
          onChange={(v) => setTweak("hero", v)} />
        <TweakToggle label="Grain / texture studio" value={t.grain}
          onChange={(v) => setTweak("grain", v)} />
        <TweakRadio label="Filigrane (logo)" value={t.heromark} options={["discret", "marqué", "masqué"]}
          onChange={(v) => setTweak("heromark", v)} />
      </TweaksPanel>
    </React.Fragment>
  );
}

function App() {
  return (
    <EditorProvider>
      <Site />
    </EditorProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
