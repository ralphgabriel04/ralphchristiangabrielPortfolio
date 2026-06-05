/* App — assemble la page, gère thème / annotations / réglages (Tweaks) */

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "light",
  "gold": "#C9A24B",
  "titleFont": "Cormorant Garamond",
  "hero": "plein-bleed",
  "grain": true
}/*EDITMODE-END*/;

const GOLD_SETS = {
  "#C9A24B": ["#C9A24B", "#A8842F", "#E4CE97"], // doré signature
  "#B8893A": ["#B8893A", "#8A6420", "#E0C079"], // doré ambré profond
  "#CDB36A": ["#CDB36A", "#A8924A", "#ECDDB0"], // champagne clair
};

const TITLE_FONTS = {
  "Cormorant Garamond": '"Cormorant Garamond", Georgia, serif',
  "Playfair Display": '"Playfair Display", Georgia, serif',
  "Fraunces": '"Fraunces", Georgia, serif',
};

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [showAnno, setShowAnno] = useState(false);
  const [lang, setLang] = useState(() => {
    try { return localStorage.getItem("kd-lang") || "fr"; } catch (e) { return "fr"; }
  });
  // Applique la langue AVANT le rendu des enfants (window.KD renvoie la bonne langue)
  window.__KDLANG = lang;
  const theme = t.theme === "dark" ? "dark" : "light";

  useEffect(() => {
    document.documentElement.setAttribute("lang", lang);
    try { localStorage.setItem("kd-lang", lang); } catch (e) {}
    const U = window.KD_I18N[lang].ui;
    document.title = U.pageTitle;
    const md = document.querySelector('meta[name="description"]');
    if (md) md.setAttribute("content", U.metaDesc);
  }, [lang]);

  // Applique thème + tokens pilotés par les réglages
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", theme);
    const set = GOLD_SETS[t.gold] || GOLD_SETS["#C9A24B"];
    root.style.setProperty("--gold", set[0]);
    root.style.setProperty("--gold-dark", set[1]);
    root.style.setProperty("--gold-light", set[2]);
    root.style.setProperty("--font-title", TITLE_FONTS[t.titleFont] || TITLE_FONTS["Cormorant Garamond"]);
    root.setAttribute("data-hero", t.hero);
    root.setAttribute("data-grain", t.grain ? "on" : "off");
  }, [theme, t.gold, t.titleFont, t.hero, t.grain]);

  useEffect(() => {
    document.body.classList.toggle("show-anno", showAnno);
  }, [showAnno]);

  useReveal();

  const U = window.KD.ui;
  return (
    <React.Fragment>
      <a href="#accueil" className="skip-link">{U.skip}</a>
      <Header theme={theme} lang={lang} onSetLang={setLang}
        onToggleTheme={() => setTweak("theme", theme === "dark" ? "light" : "dark")}
        showAnno={showAnno} onToggleAnno={() => setShowAnno((v) => !v)} />
      <main>
        <Hero />
        <Awards />
        <Portfolio />
        <About />
        <Packages />
        <RainbowBridge />
        <Blog />
        <Testimonials />
        <Contact />
      </main>
      <Footer />

      <TweaksPanel>
        <TweakSection label="Ambiance" />
        <TweakRadio label="Thème" value={t.theme} options={["light", "dark"]}
          onChange={(v) => setTweak("theme", v)} />
        <TweakRadio label="Héros" value={t.hero} options={["plein-bleed", "demi-bleed"]}
          onChange={(v) => setTweak("hero", v)} />
        <TweakToggle label="Grain / texture studio" value={t.grain}
          onChange={(v) => setTweak("grain", v)} />

        <TweakSection label="Accent doré" />
        <TweakColor label="Ton du doré" value={t.gold}
          options={Object.keys(GOLD_SETS)}
          onChange={(v) => setTweak("gold", v)} />

        <TweakSection label="Typographie" />
        <TweakSelect label="Police des titres" value={t.titleFont}
          options={Object.keys(TITLE_FONTS)}
          onChange={(v) => setTweak("titleFont", v)} />
      </TweaksPanel>
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
