/* ============================================================
   CRCC, Logique partagée
   Chrome injecté · thème · langue · annotations · nav mobile
   ============================================================ */
(function () {
  "use strict";

  /* Apply the saved theme immediately (before chrome builds) so navigating
     between pages keeps the user's choice without a flash. */
  try {
    var _savedTheme = localStorage.getItem("crcc-theme");
    if (_savedTheme) document.documentElement.setAttribute("data-theme", _savedTheme);
  } catch (e) {}

  /* ---- Resource sources (lifted for standalone bundling; fall back to file paths) ---- */
  const _res = (typeof window !== "undefined" && window.__resources) || {};
  const LOGO_MARK_SRC = _res.logoMark || "assets/logo-crcc.png";
  const LOGO_RED_SRC  = _res.logoRed  || "assets/logo-crcc-red.png";

  /* ---- Logo : marque officielle CRCC (image fournie) ---- */
  const MARK = `<img class="brand-logo" src="${LOGO_MARK_SRC}" alt="CRCC — Club du Rex de Cornouailles du Canada" width="760" height="505">`;

  /* ---------- Icônes ---------- */
  const ICON = {
    sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4.2"/><path d="M12 2v2.5M12 19.5V22M4.2 4.2l1.8 1.8M18 18l1.8 1.8M2 12h2.5M19.5 12H22M4.2 19.8 6 18M18 6l1.8-1.8"/></svg>',
    moon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a6.7 6.7 0 0 0 9.8 9.8Z"/></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    chev: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M9 6l6 6-6 6"/></svg>',
    info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9.2"/><path d="M12 11v5M12 7.6h.01" stroke-linecap="round"/></svg>'
  };

  /* ---------- Liens externes réels ---------- */
  const LINKS = {
    zeffy: "https://www.zeffy.com/fr-CA/ticketing/adhesion-annuelle-2026-membre-regulier",
    fbMembers: "https://www.facebook.com/groups/179824389290311/",
    fbRegular: "https://www.facebook.com/groups/1091303434214089",
    email: "info@club-crcc.ca",
    pdfEthique: "https://club-crcc.ca/wp-content/uploads/2022/12/CRCC_CodeEthique_2022.pdf",
    pdfPratiques: "https://club-crcc.ca/wp-content/uploads/2022/08/CRCC_CodeDePratique_2022.pdf",
    pdfStandard: "https://club-crcc.ca/wp-content/uploads/2020/06/LE-STANDARD-DE-LA-RACE.pdf"
  };
  const EXT = 'target="_blank" rel="noopener"';

  /* ---------- Navigation ---------- */
  const NAV = [
    { href: "race.html",         key: "nav.breed" },
    { href: "annuaire.html",     key: "nav.directory" },
    { href: "publications.html", key: "nav.pubs" },
    { href: "codes.html",        key: "nav.codes" },
    { href: "club.html",         key: "nav.club" },
    { href: "contact.html",      key: "nav.contact" }
  ];

  /* ---------- Dictionnaire i18n (chrome + accueil) ---------- */
  const I18N = {
    fr: {
      "nav.home": "Accueil", "nav.breed": "La race", "nav.directory": "Annuaire",
      "nav.pubs": "Publications", "nav.codes": "Codes & éthique", "nav.club": "Le club", "nav.contact": "Contact",
      "cta.adopt": "Adopter un Rex", "cta.join": "Devenir membre", "cta.donate": "Faire un don",
      "foot.tagline": "Protéger, faire reconnaître et développer le Rex de Cornouailles au Canada.",
      "foot.explore": "Explorer", "foot.engage": "S'impliquer", "foot.about": "À propos",
      "foot.fb": "Groupe Facebook des membres", "foot.fbRegular": "Groupe des membres réguliers", "foot.bylaws": "Règlements administratifs",
      "foot.code1": "Code d'éthique", "foot.code2": "Code de pratiques",
      "foot.osbl": "Organisme à but non lucratif · fondé en 2017",
      "foot.rights": "Club du Rex de Cornouailles du Canada. Maquette de démonstration.",
      "foot.diligence": "Vérification diligente recommandée auprès de tout éleveur.",
      "annot.banner": "Mode annotations : les pastilles expliquent les décisions de refonte vs le site actuel.",
      "lang.label": "Langue", "theme.label": "Basculer le thème clair / sombre", "menu.open": "Ouvrir le menu", "menu.title": "Menu",
      "load.name": "Club du Rex de Cornouailles du Canada", "load.status": "Chargement", "load.aria": "Chargement — Club du Rex de Cornouailles du Canada"
    },
    en: {
      "nav.home": "Home", "nav.breed": "The breed", "nav.directory": "Breeders",
      "nav.pubs": "Articles", "nav.codes": "Codes & ethics", "nav.club": "The club", "nav.contact": "Contact",
      "cta.adopt": "Adopt a Rex", "cta.join": "Become a member", "cta.donate": "Donate",
      "foot.tagline": "Protecting, recognizing and growing the Cornish Rex in Canada.",
      "foot.explore": "Explore", "foot.engage": "Get involved", "foot.about": "About",
      "foot.fb": "Members' Facebook group", "foot.fbRegular": "Regular members’ group", "foot.bylaws": "By-laws",
      "foot.code1": "Code of ethics", "foot.code2": "Code of practices",
      "foot.osbl": "Non-profit organization · founded 2017",
      "foot.rights": "Cornish Rex Club of Canada. Demonstration mockup.",
      "foot.diligence": "Due diligence recommended with any breeder.",
      "annot.banner": "Annotation mode: pins explain redesign decisions vs the current site.",
      "lang.label": "Language", "theme.label": "Toggle light / dark theme", "menu.open": "Open menu", "menu.title": "Menu",
      "load.name": "Cornish Rex Club of Canada", "load.status": "Loading", "load.aria": "Loading — Cornish Rex Club of Canada"
    }
  };

  const CRCC = window.CRCC = {
    lang: "fr",
    t(key) { return (I18N[this.lang] && I18N[this.lang][key]) || (I18N.fr[key]) || key; },
    onLangChange: []
  };

  /* ============================================================
     Splash de chargement — joué une fois par session, non bloquant.
     ============================================================ */
  let _splash = null;
  function buildSplash(lang) {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    _splash = document.createElement("div");
    _splash.className = "crcc-splash";
    _splash.setAttribute("role", "img");
    _splash.setAttribute("aria-label", I18N[lang]["load.aria"]);
    _splash.setAttribute("aria-busy", "true");
    _splash.innerHTML = `
      <div class="crcc-loader">
        <div class="logo-wrap">
          <img class="lg-img" src="${LOGO_RED_SRC}" alt="" draggable="false">
          <span class="lg-sheen" aria-hidden="true"></span>
          <span class="lg-burst" aria-hidden="true"></span>
          <span class="lg-aura" aria-hidden="true"></span>
        </div>
        <div class="lg-cap">
          <span class="lg-name">${I18N[lang]["load.name"]}</span>
          <span class="lg-status" aria-hidden="true">${I18N[lang]["load.status"]}<span class="lg-dot">.</span><span class="lg-dot">.</span><span class="lg-dot">.</span></span>
        </div>
      </div>`;
    (document.body || document.documentElement).appendChild(_splash);
    _splash.__t0 = Date.now();
    document.documentElement.style.overflow = "hidden";
    // safety net: never let the splash get stuck
    setTimeout(hideSplash, reduce ? 1200 : 6000);
  }
  function hideSplash() {
    if (!_splash || _splash.__closing) return;
    _splash.__closing = true;
    const MIN = 700;
    const wait = Math.max(0, MIN - (Date.now() - _splash.__t0));
    setTimeout(() => {
      _splash.classList.add("is-done");
      _splash.setAttribute("aria-busy", "false");
      document.documentElement.style.overflow = "";
      const el = _splash;
      setTimeout(() => { el.remove(); }, 850);
      _splash = null;
    }, wait);
  }

  /* Trigger: first page load of the session only (no replay on every nav). */
  (function initSplash() {
    let seen = false;
    try { seen = sessionStorage.getItem("crcc-splash-seen"); } catch (e) {}
    if (seen) return;
    try { sessionStorage.setItem("crcc-splash-seen", "1"); } catch (e) {}
    let lang = "fr";
    try { lang = localStorage.getItem("crcc-lang") || "fr"; } catch (e) {}
    buildSplash(lang);
    if (document.readyState === "complete") hideSplash();
    else window.addEventListener("load", hideSplash);
  })();

  /* ---------- Build header ---------- */
  function buildHeader() {
    const current = (location.pathname.split("/").pop() || "index.html");
    const header = document.createElement("header");
    header.className = "site-header";
    header.innerHTML = `
      <div class="annot-banner">${ICON.info}<span data-i18n="annot.banner">${CRCC.t("annot.banner")}</span></div>
      <div class="wrap nav">
        <a class="brand" href="index.html" aria-label="CRCC · Club du Rex de Cornouailles du Canada · Accueil">
          ${MARK}
        </a>
        <nav class="nav-links" aria-label="Navigation principale">
          ${NAV.map(n => `<a href="${n.href}" data-i18n="${n.key}" class="${n.href === current ? "active" : ""}">${CRCC.t(n.key)}</a>`).join("")}
        </nav>
        <div class="nav-actions">
          <div class="lang-toggle" role="group" aria-label="${CRCC.t("lang.label")}">
            <button data-lang="fr" class="active" aria-pressed="true">FR</button>
            <button data-lang="en" aria-pressed="false">EN</button>
          </div>
          <button class="icon-btn theme-btn" aria-label="${CRCC.t("theme.label")}" title="${CRCC.t("theme.label")}">${ICON.moon}</button>
          <a class="btn btn-accent btn-sm join-cta" href="adhesion.html" data-i18n="cta.join">${CRCC.t("cta.join")}</a>
          <button class="icon-btn menu-btn" aria-label="${CRCC.t("menu.open")}" aria-expanded="false">${ICON.menu}</button>
        </div>
      </div>`;
    document.body.prepend(header);

    // Drawer
    const overlay = document.createElement("div");
    overlay.className = "drawer-overlay";
    overlay.innerHTML = `
      <aside class="drawer" role="dialog" aria-modal="true" aria-label="${CRCC.t("menu.title")}">
        <div class="drawer-head">
          <a class="brand" href="index.html" aria-label="CRCC · Accueil">${MARK}</a>
          <button class="icon-btn drawer-close" aria-label="Fermer">${ICON.close}</button>
        </div>
        <nav aria-label="Navigation mobile">
          ${NAV.map(n => `<a href="${n.href}" data-i18n="${n.key}" class="${n.href === current ? "active" : ""}">${CRCC.t(n.key)} ${ICON.chev}</a>`).join("")}
        </nav>
        <div class="drawer-tools">
          <div class="lang-toggle" role="group" aria-label="${CRCC.t("lang.label")}">
            <button data-lang="fr" class="active" aria-pressed="true">FR</button>
            <button data-lang="en" aria-pressed="false">EN</button>
          </div>
          <button class="icon-btn theme-btn" aria-label="${CRCC.t("theme.label")}" title="${CRCC.t("theme.label")}">${ICON.moon}</button>
        </div>
        <div class="drawer-foot">
          <a class="btn btn-accent btn-block" href="adhesion.html" data-i18n="cta.join">${CRCC.t("cta.join")}</a>
          <a class="btn btn-ghost btn-block" href="adhesion.html#don" data-i18n="cta.donate">${CRCC.t("cta.donate")}</a>
        </div>
      </aside>`;
    document.body.appendChild(overlay);

    const drawer = overlay.querySelector(".drawer");
    const menuBtn = header.querySelector(".menu-btn");
    let lastFocused = null;
    const focusables = () => [...drawer.querySelectorAll('a[href], button:not([disabled])')].filter(el => el.offsetParent !== null);
    const openMenu = () => {
      lastFocused = document.activeElement;
      overlay.classList.add("open"); drawer.classList.add("open");
      menuBtn.setAttribute("aria-expanded","true"); document.body.style.overflow = "hidden";
      const f = focusables(); if (f.length) f[0].focus();
    };
    const closeMenu = () => {
      if (!overlay.classList.contains("open")) return;
      overlay.classList.remove("open"); drawer.classList.remove("open");
      menuBtn.setAttribute("aria-expanded","false"); document.body.style.overflow = "";
      if (lastFocused && lastFocused.focus) lastFocused.focus();
    };
    menuBtn.addEventListener("click", openMenu);
    overlay.querySelector(".drawer-close").addEventListener("click", closeMenu);
    overlay.addEventListener("click", e => { if (e.target === overlay) closeMenu(); });
    document.addEventListener("keydown", e => { if (e.key === "Escape") closeMenu(); });
    // Fermer le drawer en suivant un lien de navigation
    drawer.querySelectorAll('nav a').forEach(a => a.addEventListener("click", closeMenu));
    // Piège de focus dans le drawer ouvert
    drawer.addEventListener("keydown", e => {
      if (e.key !== "Tab") return;
      const f = focusables(); if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
    // Outils du drawer : FR/EN + thème
    overlay.querySelectorAll(".lang-toggle button").forEach(b => b.addEventListener("click", () => setLang(b.dataset.lang)));
    overlay.querySelector(".theme-btn").addEventListener("click", toggleTheme);

    // Scroll shadow
    const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true }); onScroll();

    // Lang buttons
    header.querySelectorAll(".lang-toggle button").forEach(b => {
      b.addEventListener("click", () => setLang(b.dataset.lang));
    });
    // Theme button
    header.querySelector(".theme-btn").addEventListener("click", toggleTheme);
  }

  /* ---------- Footer ---------- */
  function buildFooter() {
    const f = document.createElement("footer");
    f.className = "site-footer";
    f.innerHTML = `
      <div class="wrap">
        <div class="footer-grid">
          <div class="footer-brand-col footer-brand">
            <div class="flex items-center gap-sm" style="margin-bottom:14px">${MARK}</div>
            <p style="color:#b6bda6;max-width:34ch" data-i18n="foot.tagline">${CRCC.t("foot.tagline")}</p>
            <p style="color:#8b9275;font-size:.85rem;margin-top:16px" data-i18n="foot.osbl">${CRCC.t("foot.osbl")}</p>
            <p style="color:#8b9275;font-size:.85rem;margin-top:4px"><a href="mailto:${LINKS.email}">${LINKS.email}</a></p>
          </div>
          <div>
            <h5 data-i18n="foot.explore">${CRCC.t("foot.explore")}</h5>
            <ul>
              <li><a href="race.html" data-i18n="nav.breed">${CRCC.t("nav.breed")}</a></li>
              <li><a href="annuaire.html" data-i18n="nav.directory">${CRCC.t("nav.directory")}</a></li>
              <li><a href="publications.html" data-i18n="nav.pubs">${CRCC.t("nav.pubs")}</a></li>
              <li><a href="codes.html" data-i18n="nav.codes">${CRCC.t("nav.codes")}</a></li>
            </ul>
          </div>
          <div>
            <h5 data-i18n="foot.engage">${CRCC.t("foot.engage")}</h5>
            <ul>
              <li><a href="adhesion.html" data-i18n="cta.join">${CRCC.t("cta.join")}</a></li>
              <li><a href="${LINKS.zeffy}" ${EXT} data-i18n="cta.donate">${CRCC.t("cta.donate")}</a></li>
              <li><a href="annuaire.html" data-i18n="cta.adopt">${CRCC.t("cta.adopt")}</a></li>
              <li><a href="${LINKS.fbMembers}" ${EXT} data-i18n="foot.fb">${CRCC.t("foot.fb")}</a></li>
              <li><a href="${LINKS.fbRegular}" ${EXT} data-i18n="foot.fbRegular">${CRCC.t("foot.fbRegular")}</a></li>
              <li><a href="contact.html" data-i18n="nav.contact">${CRCC.t("nav.contact")}</a></li>
            </ul>
          </div>
          <div>
            <h5 data-i18n="foot.about">${CRCC.t("foot.about")}</h5>
            <ul>
              <li><a href="club.html" data-i18n="nav.club">${CRCC.t("nav.club")}</a></li>
              <li><a href="reglements.html" data-i18n="foot.bylaws">${CRCC.t("foot.bylaws")}</a></li>
              <li><a href="codes.html">${CRCC.t("foot.code1")}</a></li>
              <li><a href="codes.html#pratiques">${CRCC.t("foot.code2")}</a></li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <span data-i18n="foot.rights">© ${new Date().getFullYear()} ${CRCC.t("foot.rights")}</span>
          <span data-i18n="foot.diligence">${CRCC.t("foot.diligence")}</span>
        </div>
      </div>`;
    document.body.appendChild(f);
  }

  /* ---------- Theme ---------- */
  function applyTheme(mode) {
    document.documentElement.setAttribute("data-theme", mode);
    const btn = document.querySelector(".theme-btn");
    if (btn) btn.innerHTML = mode === "dark" ? ICON.sun : ICON.moon;
    CRCC.theme = mode;
    try { localStorage.setItem("crcc-theme", mode); } catch (e) {}
  }
  function toggleTheme() {
    applyTheme(document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark");
  }

  /* ---------- Language ---------- */
  function setLang(lang) {
    CRCC.lang = lang;
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const k = el.getAttribute("data-i18n");
      const dict = I18N[lang];
      // Only translate keys present in chrome dictionary; page-level handled via data-fr/data-en
      if (dict && dict[k] !== undefined) el.textContent = dict[k];
    });
    // Page content with data-fr / data-en attributes
    document.querySelectorAll("[data-fr]").forEach(el => {
      const val = el.getAttribute("data-" + lang);
      if (val !== null) {
        if (el.hasAttribute("data-i18n-html")) el.innerHTML = val; else el.textContent = val;
      }
    });
    document.querySelectorAll("[data-fr-ph]").forEach(el => {
      const val = el.getAttribute("data-" + lang + "-ph");
      if (val !== null) el.setAttribute("placeholder", val);
    });
    document.querySelectorAll(".lang-toggle button").forEach(b => {
      const on = b.dataset.lang === lang;
      b.classList.toggle("active", on);
      b.setAttribute("aria-pressed", on ? "true" : "false");
    });
    try { localStorage.setItem("crcc-lang", lang); } catch (e) {}
    CRCC.onLangChange.forEach(fn => { try { fn(lang); } catch(e){} });
  }
  CRCC.setLang = setLang;

  /* ---------- Annotations ---------- */
  function buildAnnotToggle() {
    // Floating control bottom-left to toggle annotation mode
    const ctl = document.createElement("button");
    ctl.className = "annot-toggle";
    ctl.setAttribute("aria-pressed", "false");
    ctl.innerHTML = `${ICON.info}<span>Notes de refonte</span>`;
    Object.assign(ctl.style, {
      position: "fixed", left: "18px", bottom: "18px", zIndex: 120,
      display: "inline-flex", alignItems: "center", gap: "8px",
      minHeight: "44px", padding: "0 16px", borderRadius: "999px",
      border: "1.5px solid var(--border-strong)", background: "var(--surface)",
      color: "var(--text-soft)", fontWeight: "700", fontSize: ".88rem",
      cursor: "pointer", boxShadow: "var(--shadow-md)"
    });
    ctl.querySelector("svg").style.width = "18px";
    ctl.querySelector("svg").style.height = "18px";
    ctl.addEventListener("click", () => {
      const on = document.body.classList.toggle("annotations-on");
      ctl.setAttribute("aria-pressed", on ? "true" : "false");
      ctl.style.background = on ? "var(--rust)" : "var(--surface)";
      ctl.style.color = on ? "#fff" : "var(--text-soft)";
      ctl.style.borderColor = on ? "var(--rust)" : "var(--border-strong)";
    });
    document.body.appendChild(ctl);

    // Click-to-open pops on touch
    document.addEventListener("click", e => {
      const dot = e.target.closest(".annot-dot");
      document.querySelectorAll(".annot.open").forEach(a => { if (!dot || a !== dot.parentElement) a.classList.remove("open"); });
      if (dot) dot.parentElement.classList.toggle("open");
    });
  }

  /* ---------- Reveal on scroll ---------- */
  function initReveal() {
    const els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      els.forEach(el => el.classList.add("in")); return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: .12, rootMargin: "0px 0px -8% 0px" });
    els.forEach(el => io.observe(el));
  }

  /* ---------- Init ---------- */
  function init() {
    document.body.insertAdjacentHTML("afterbegin", '<a class="skip-link" href="#main">Aller au contenu</a>');
    buildHeader();
    buildFooter();
    buildAnnotToggle();
    let savedTheme = "light", savedLang = "fr";
    try { savedTheme = localStorage.getItem("crcc-theme") || "light"; } catch (e) {}
    try { savedLang = localStorage.getItem("crcc-lang") || "fr"; } catch (e) {}
    applyTheme(savedTheme);
    initReveal();
    setLang(savedLang);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();

  CRCC.ICON = ICON;
  CRCC.LINKS = LINKS;
})();
