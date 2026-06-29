/* global React, useState, useEffect, useRef, cn, Icons, Button, Logo, Badge,
   useLandingT, Reveal, Eyebrow, SectionHead, BrowserChrome, DemoShell, FeatureRow, FeatureTrail,
   useCountUp, useInViewOnce,
   LiveCalendarDemo, MatrixDnD, TaskCompleteDemo, HabitTrackerDemo, PomodoroDemo,
   EnergyDemo, AISuggestionDemo, StatsDemo, ColorCustomizerDemo, ResourcesDemo, LP_ACCENTS,
   KanbanDemo, FocusProDemo, MusicWidget, CalendarProDemo, SpacesDemo, RulesDemo,
   HealthSleepDemo, GoalsProDemo, DailyPlanningDemo, ReviewsGrid,
   window */

/* Derive a darker "solid fill" lightness from an HSL triple (keeps AA on white text). */
function lpDeriveSolid(triple, dl) {
  const m = String(triple).match(/([\d.]+)\s+([\d.]+)%\s+([\d.]+)%/);
  if (!m) return triple;
  return `${m[1]} ${m[2]}% ${Math.max(0, +m[3] - dl)}%`;
}

/* ---------- Stat band (count-up) ---------- */
function StatItem({ v, suffix, t, d, seen, i }) {
  const n = useCountUp(v, seen, 1300 + i * 150);
  return (
    <Reveal delay={i * 90} className="text-center sm:text-left">
      <div className="text-[clamp(38px,5vw,56px)] font-bold tracking-tight leading-none">
        {Math.round(n)}<span className="text-[hsl(var(--primary))]">{suffix}</span>
      </div>
      <div className="mt-2 text-[14px] font-semibold">{t}</div>
      <div className="mt-1 text-[13px] text-[hsl(var(--muted-foreground))] leading-snug">{d}</div>
    </Reveal>
  );
}

function StatBand({ t }) {
  const s = t.stats;
  const [ref, seen] = useInViewOnce(0.4);
  return (
    <div ref={ref} className="grid sm:grid-cols-3 gap-8 sm:gap-10">
      {s.items.map((it, i) => <StatItem key={i} {...it} seen={seen} i={i} />)}
    </div>
  );
}

/* Group divider inside the module tour. */
function LpGroup({ label }) {
  return (
    <Reveal className="flex items-center gap-4 pt-6">
      <Eyebrow>{label}</Eyebrow>
      <span className="flex-1 h-px bg-[hsl(var(--border))]" />
    </Reveal>
  );
}

/* ============================================================
   LANDING PAGE
============================================================ */
function LandingPage({ setRoute, theme = "dark", setTheme, lang = "en", setLang }) {
  const t = useLandingT(lang);
  const [accent, setAccent] = useState("263 70% 60%");
  const [scrolled, setScrolled] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);
  const [legal, setLegal] = useState(null);   // null | "terms" | "privacy" | "cookies" | "gdpr"
  const sentinel = useRef(null);
  const tryRef = useRef(null);

  const goSignup = () => setRoute("signup");
  const goLogin = () => setRoute("login");

  // nav glass on scroll (sentinel at very top of the page)
  useEffect(() => {
    const el = sentinel.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const obs = new IntersectionObserver(([e]) => setScrolled(!e.isIntersecting), { threshold: 0 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // FAILSAFE — reveals start at opacity:0 and rely on IntersectionObserver.
  // If IO never fires in this context (some embedded/preview surfaces), the
  // page would stay blank. After mount, if NOTHING has revealed yet, force
  // everything visible. When IO works normally, the hero reveals immediately
  // so this no-ops and on-scroll reveals are preserved.
  useEffect(() => {
    const reveal = () => document.querySelectorAll(".lp-reveal:not(.is-visible)").forEach((el) => el.classList.add("is-visible"));
    const id = setTimeout(() => {
      if (!document.querySelector(".lp-reveal.is-visible")) reveal();
    }, 1000);
    return () => clearTimeout(id);
  }, []);

  const rootStyle = {
    "--primary": accent,
    "--ring": accent,
    "--primary-solid": lpDeriveSolid(accent, 8),
    "--primary-solid-hover": lpDeriveSolid(accent, 14),
  };

  const toggleTheme = () => setTheme && setTheme(theme === "dark" ? "light" : "dark");
  const toggleLang = () => setLang && setLang(lang === "fr" ? "en" : "fr");

  return (
    <div className="lp-page min-h-full bg-[hsl(var(--background))] relative overflow-x-hidden" style={rootStyle}>
      <ScrollControls />
      <div ref={sentinel} className="absolute top-0 left-0 w-full h-1 pointer-events-none" />

      {/* ambient mesh */}
      <div className="lp-glow" style={{ width: 620, height: 620, top: -240, left: -120, background: "hsl(263 70% 55%)" }} />
      <div className="lp-glow" style={{ width: 520, height: 520, top: 80, right: -160, background: "hsl(330 75% 55%)", animationDelay: "-7s" }} />

      {/* ---------------- NAV ---------------- */}
      <nav className={cn("lp-nav sticky top-0 z-30 border-b transition-all duration-300",
        scrolled ? "bg-[hsl(var(--background)/0.85)] backdrop-blur-xl border-[hsl(var(--border))] shadow-sm" : "bg-transparent border-transparent")}>
        <div className={cn("max-w-[1180px] mx-auto px-6 flex items-center justify-between transition-all duration-300", scrolled ? "h-14" : "h-16")}>
          <Logo size={scrolled ? 30 : 34} />
          <div className="hidden lg:flex items-center gap-7 text-[13.5px] text-[hsl(var(--muted-foreground))]">
            <a className="hover:text-[hsl(var(--foreground))] transition-colors" href="#modules">{t.nav.modules}</a>
            <a className="hover:text-[hsl(var(--foreground))] transition-colors" href="#how">{t.nav.how}</a>
            <a className="hover:text-[hsl(var(--foreground))] transition-colors" href="#pricing">{t.nav.pricing}</a>
            <a className="hover:text-[hsl(var(--foreground))] transition-colors" href="#faq">{t.nav.faq}</a>
          </div>
          <div className="flex items-center gap-1.5">
            <button onClick={toggleLang} title={t.nav.toFr}
              className="h-8 px-2.5 rounded-[8px] text-[12px] font-semibold font-mono uppercase tracking-wide text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))] transition-colors flex items-center gap-1.5">
              <Icons.Globe size={14} /> {lang === "fr" ? "EN" : "FR"}
            </button>
            <button onClick={toggleTheme} title={t.nav.theme}
              className="h-8 w-8 rounded-[8px] flex items-center justify-center text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))] transition-colors">
              {theme === "dark" ? <Icons.Sun size={15} /> : <Icons.Moon size={15} />}
            </button>
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex" onClick={goLogin}>{t.nav.login}</Button>
            <Button size="sm" onClick={goSignup}>{t.nav.cta} <Icons.ArrowRight size={14} /></Button>
          </div>
        </div>
      </nav>

      {/* ---------------- HERO ---------------- */}
      <header className="relative max-w-[1180px] mx-auto px-6 pt-16 pb-12 sm:pt-24 text-center">
        <Reveal className="flex justify-center">
          <Badge variant="primary" className="gap-1.5"><Icons.Sparkles size={11} /> {t.hero.badge}</Badge>
        </Reveal>
        <Reveal delay={60}>
          <h1 className="mt-6 text-[clamp(40px,7vw,82px)] font-bold tracking-[-0.02em] leading-[1.02]" style={{ textWrap: "balance" }}>
            {t.hero.titleA}<br />
            <span className="lp-gradient-text font-serif italic font-normal">{t.hero.titleB}</span>
          </h1>
        </Reveal>
        <Reveal delay={120}>
          <p className="mt-6 text-[16.5px] sm:text-[18px] text-[hsl(var(--muted-foreground))] max-w-2xl mx-auto leading-relaxed" style={{ textWrap: "pretty" }}>
            {t.hero.sub}
          </p>
        </Reveal>
        <Reveal delay={180} className="flex flex-wrap items-center justify-center gap-3 mt-9">
          <Button size="lg" onClick={goSignup}>{t.hero.ctaPrimary} <Icons.ArrowRight size={16} /></Button>
          <Button size="lg" variant="outline" onClick={() => setVideoOpen(true)}><Icons.Play size={16} /> {t.hero.ctaSecondary}</Button>
        </Reveal>
        <Reveal delay={220}><div className="text-[12px] text-[hsl(var(--muted-foreground))] mt-4">{t.hero.trust}</div></Reveal>
        <SocialProofBar t={t} />

        {/* live product stage */}
        <Reveal scale delay={120} className="relative mt-14 mx-auto max-w-[920px]">
          <div className="absolute -inset-6 rounded-[28px] bg-[hsl(var(--primary)/0.18)] blur-3xl pointer-events-none" />
          <div className="relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-mono px-3 py-1 rounded-full bg-[hsl(var(--card))] border border-[hsl(var(--border))] shadow-lg text-[hsl(var(--muted-foreground))]">
                <span className="w-1.5 h-1.5 rounded-full bg-[hsl(142_70%_50%)] lp-pulse" /> {t.hero.liveBadge}
              </span>
            </div>
            <BrowserChrome url="app.dpmelevate.io / calendar" className="text-left">
              <div className="p-4 sm:p-5 lp-stage">
                <LiveCalendarDemo t={t} />
              </div>
            </BrowserChrome>

            {/* floating module chips */}
            <div className="hidden md:block absolute -left-10 top-1/3 lp-float">
              <div className="lp-ring rounded-[14px] bg-[hsl(var(--card))] border border-[hsl(var(--border))] shadow-xl p-3 w-[140px] text-left">
                <div className="flex items-center gap-1.5 text-[10px] font-semibold text-[hsl(38_92%_58%)]"><Icons.Flame size={13} /> 12 {t.habits.streak}</div>
                <div className="mt-2 flex gap-1">{[1,1,1,1,1,0,0].map((v,i)=>(<span key={i} className={cn("flex-1 h-5 rounded-[3px]", v?"bg-[hsl(var(--primary))]":"bg-[hsl(var(--muted))]")} />))}</div>
              </div>
            </div>
            <div className="hidden md:block absolute -right-12 top-12 lp-float-slow">
              <div className="lp-ring rounded-[14px] bg-[hsl(var(--card))] border border-[hsl(var(--border))] shadow-xl p-3 w-[180px] text-left">
                <div className="flex items-center gap-1.5 text-[10px] font-semibold text-[hsl(var(--primary))]"><Icons.Sparkles size={12} /> DPM AI</div>
                <div className="mt-1.5 text-[11px] leading-snug text-[hsl(var(--foreground)/0.9)]">{t.ai.suggestion}</div>
              </div>
            </div>
            <div className="hidden md:block absolute -right-8 -bottom-6 lp-float">
              <div className="lp-ring rounded-[14px] bg-[hsl(var(--card))] border border-[hsl(var(--border))] shadow-xl px-3.5 py-2.5 flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-full bg-[hsl(var(--primary))] flex items-center justify-center"><Icons.Check size={15} stroke={3} className="text-white" /></span>
                <div className="text-left"><div className="text-[12px] font-bold tabular-nums">3/5</div><div className="text-[9.5px] text-[hsl(var(--muted-foreground))]">{t.tasks.done}</div></div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* integrations marquee */}
        <div className="mt-16">
          <Reveal><div className="text-[11px] uppercase tracking-[0.18em] text-[hsl(var(--muted-foreground))] font-mono">{t.hero.integrates}</div></Reveal>
          <BrandMarquee t={t} />
        </div>
      </header>

      {/* ---------------- STAT BAND ---------------- */}
      <section className="relative max-w-[1180px] mx-auto px-6 py-16">
        <div className="rounded-[20px] border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-7 sm:px-12 py-10">
          <Reveal><Eyebrow className="justify-center mb-8">{t.stats.label}</Eyebrow></Reveal>
          <StatBand t={t} />
        </div>
      </section>

      {/* ---------------- HOW IT WORKS ---------------- */}
      <section id="how" className="relative max-w-[1180px] mx-auto px-6 py-16">
        <SectionHead n="01" label={t.how.label} title={t.how.title} />
        <div className="grid md:grid-cols-3 gap-5 mt-12">
          {t.how.steps.map((step, i) => (
            <Reveal key={i} delay={i * 110}>
              <div className="lp-ring lp-card-hover rounded-[16px] border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-7 h-full relative overflow-hidden">
                <div className="text-[68px] font-serif italic leading-none text-[hsl(var(--primary)/0.18)] absolute top-3 right-5 select-none">{step.n}</div>
                <div className="w-11 h-11 rounded-[12px] bg-[hsl(var(--primary)/0.12)] flex items-center justify-center mb-5">
                  {[Icons.Sunrise, Icons.Zap, Icons.BarChart][i] && React.createElement([Icons.Sunrise, Icons.Zap, Icons.BarChart][i], { size: 20, className: "text-[hsl(var(--primary))]" })}
                </div>
                <h3 className="text-[19px] font-semibold tracking-tight mb-2">{step.t}</h3>
                <p className="text-[13.5px] text-[hsl(var(--muted-foreground))] leading-relaxed">{step.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------- MODULES (playable) ---------------- */}
      <section id="modules" className="relative pt-12">
        <div className="max-w-[1180px] mx-auto px-6">
          <SectionHead n="02" label={t.modules.label} title={t.modules.title} sub={t.modules.sub} />
        </div>

        <div id="try" ref={tryRef} className="relative max-w-[1180px] mx-auto px-6 mt-14 pb-16 space-y-20 sm:space-y-24">
          <FeatureTrail containerRef={tryRef} />

          {/* Calendar & sharing */}
          <LpGroup label={t.groups.calendar} />
          <FeatureRow n="01" tag={t.calendarPro.tag} title={t.calendarPro.title} desc={t.calendarPro.desc} bullets={t.calendarPro.bullets}>
            <DemoShell hint={t.calendarPro.hint}><CalendarProDemo t={t} /></DemoShell>
          </FeatureRow>

          {/* Daily rituals */}
          <LpGroup label={t.groups.rituals} />
          <FeatureRow n="02" reverse tag={t.daily.tag} title={t.daily.title} desc={t.daily.desc} bullets={t.daily.bullets}>
            <DemoShell hint={t.daily.hint}><DailyPlanningDemo t={t} /></DemoShell>
          </FeatureRow>
          <FeatureRow n="03" tag={t.focusPro.tag} title={t.focusPro.title} desc={t.focusPro.desc} bullets={t.focusPro.bullets}>
            <DemoShell hint={t.focusPro.hint}><FocusProDemo t={t} /></DemoShell>
          </FeatureRow>

          {/* Productivity */}
          <LpGroup label={t.groups.productivity} />
          <FeatureRow n="04" reverse tag={t.tasksPro.tag} title={t.tasksPro.title} desc={t.tasksPro.desc} bullets={t.tasksPro.bullets}>
            <DemoShell hint={t.tasksPro.hint}><KanbanDemo t={t} /></DemoShell>
          </FeatureRow>
          <FeatureRow n="05" tag={t.matrix.tag} title={t.matrix.title} desc={t.matrix.desc} bullets={t.matrix.bullets}>
            <DemoShell hint={t.matrix.hint}><MatrixDnD t={t} /></DemoShell>
          </FeatureRow>
          <FeatureRow n="06" reverse tag={t.habits.tag} title={t.habits.title} desc={t.habits.desc} bullets={t.habits.bullets}>
            <DemoShell hint={t.habits.hint}><HabitTrackerDemo t={t} /></DemoShell>
          </FeatureRow>
          <FeatureRow n="07" tag={t.goalsPro.tag} title={t.goalsPro.title} desc={t.goalsPro.desc} bullets={t.goalsPro.bullets}>
            <DemoShell><GoalsProDemo t={t} /></DemoShell>
          </FeatureRow>

          {/* Well-being */}
          <LpGroup label={t.groups.wellbeing} />
          <FeatureRow n="08" reverse tag={t.health.tag} title={t.health.title} desc={t.health.desc} bullets={t.health.bullets}>
            <DemoShell><HealthSleepDemo t={t} /></DemoShell>
          </FeatureRow>
          <FeatureRow n="09" tag={t.energy.tag} title={t.energy.title} desc={t.energy.desc} bullets={t.energy.bullets}>
            <DemoShell hint={t.energy.hint}><EnergyDemo t={t} /></DemoShell>
          </FeatureRow>

          {/* Insights & automation */}
          <LpGroup label={t.groups.insights} />
          <FeatureRow n="10" reverse tag={t.stats2.tag} title={t.stats2.title} desc={t.stats2.desc} bullets={t.stats2.bullets}>
            <DemoShell><StatsDemo t={t} /></DemoShell>
          </FeatureRow>
          <FeatureRow n="11" tag={t.rules.tag} title={t.rules.title} desc={t.rules.desc} bullets={t.rules.bullets}>
            <DemoShell hint={t.rules.hint}><RulesDemo t={t} /></DemoShell>
          </FeatureRow>

          {/* Make it yours */}
          <LpGroup label={t.groups.personalize} />
          <FeatureRow n="12" reverse tag={t.spaces.tag} title={t.spaces.title} desc={t.spaces.desc} bullets={t.spaces.bullets}>
            <DemoShell hint={t.spaces.hint}><SpacesDemo t={t} onAccent={(c) => setAccent(c || "263 70% 60%")} /></DemoShell>
          </FeatureRow>
          <FeatureRow n="13" tag={t.customize.tag} title={t.customize.title} desc={t.customize.desc} bullets={t.customize.bullets}>
            <DemoShell hint={t.customize.hint}>
              <ColorCustomizerDemo t={t} accent={accent} setAccent={setAccent} theme={theme} setTheme={setTheme} />
            </DemoShell>
          </FeatureRow>
        </div>
      </section>

      {/* ---------------- AI (feature spotlight band) ---------------- */}
      <section className="relative max-w-[1180px] mx-auto px-6 py-24">
        <div className="lp-ring rounded-[24px] border border-[hsl(var(--border))] overflow-hidden relative lp-stage">
          <div className="lp-glow" style={{ width: 360, height: 360, top: -140, right: 40, background: "hsl(263 70% 58%)" }} />
          <div className="relative grid lg:grid-cols-2 gap-10 items-center p-8 sm:p-12">
            <Reveal>
              <Eyebrow n="03">{t.ai.tag}</Eyebrow>
              <h2 className="mt-5 text-[clamp(26px,3.4vw,38px)] font-bold tracking-tight leading-[1.1]" style={{ textWrap: "balance" }}>{t.ai.title}</h2>
              <p className="mt-4 text-[15px] text-[hsl(var(--muted-foreground))] leading-relaxed">{t.ai.desc}</p>
            </Reveal>
            <Reveal scale delay={120}><AISuggestionDemo t={t} /></Reveal>
          </div>
        </div>
      </section>

      {/* ---------------- RESOURCES ---------------- */}
      <section className="relative max-w-[1180px] mx-auto px-6 py-16">
        <SectionHead n="04" label={t.resources.tag} title={t.resources.title} sub={t.resources.desc} />
        <div className="mt-12"><Reveal scale><ResourcesDemo t={t} /></Reveal></div>
        <Reveal delay={120}>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-7 gap-y-2 text-[13px] text-[hsl(var(--muted-foreground))]">
            {t.resources.bullets.map((b, i) => (
              <span key={i} className="flex items-center gap-2"><Icons.Check size={13} className="text-[hsl(var(--primary))]" /> {b}</span>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ---------------- REVIEWS ---------------- */}
      <section className="relative max-w-[1180px] mx-auto px-6 py-16">
        <SectionHead n="05" label={t.reviews.label} title={t.reviews.title} sub={t.reviews.sub} />
        <div className="mt-12"><ReviewsGrid t={t} /></div>
      </section>

      {/* ---------------- SECURITY ---------------- */}
      <section className="relative max-w-[1180px] mx-auto px-6 py-16">
        <Reveal scale>
          <div className="lp-ring rounded-[24px] border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-8 sm:p-12 relative overflow-hidden">
            <div className="lp-glow" style={{ width: 340, height: 340, top: -160, left: -40, background: "hsl(142 60% 45%)", opacity: 0.3 }} />
            <div className="relative grid lg:grid-cols-2 gap-10 items-center">
              <div>
                <span className="w-12 h-12 rounded-[14px] bg-[hsl(142_70%_45%/0.14)] flex items-center justify-center mb-5">
                  <Icons.Shield size={24} className="text-[hsl(142_70%_50%)]" />
                </span>
                <Eyebrow>{t.security.tag}</Eyebrow>
                <h2 className="mt-4 text-[clamp(26px,3.2vw,36px)] font-bold tracking-tight">{t.security.title}</h2>
                <p className="text-[14.5px] text-[hsl(var(--muted-foreground))] leading-relaxed mt-4 mb-6">{t.security.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {t.security.badges.map((b, i) => <Badge key={i} variant={["success", "info", "primary"][i]} dot>{b}</Badge>)}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {t.security.cards.map((c, i) => (
                  <Reveal key={i} delay={i * 80} className="h-full">
                    <div className="lp-card-hover h-full rounded-[12px] border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-4">
                      <div className="text-[14px] font-semibold">{c.t}</div>
                      <div className="text-[12.5px] text-[hsl(var(--muted-foreground))] mt-1">{c.d}</div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ---------------- PRICING ---------------- */}
      <PricingSection t={t} onSignup={goSignup} />

      {/* ---------------- FAQ ---------------- */}
      <FaqSection t={t} />

      {/* ---------------- FINAL CTA ---------------- */}
      <section className="relative max-w-[1180px] mx-auto px-6 py-20">
        <Reveal scale>
          <div className="relative rounded-[28px] overflow-hidden text-center px-6 py-16 sm:py-20 border border-[hsl(var(--border))] lp-stage">
            <div className="lp-glow" style={{ width: 500, height: 500, top: -200, left: "50%", marginLeft: -250, background: "hsl(263 70% 55%)" }} />
            <div className="relative">
              <h2 className="text-[clamp(32px,5vw,52px)] font-bold tracking-tight leading-[1.05]" style={{ textWrap: "balance" }}>
                {t.finalCta.title}
              </h2>
              <p className="text-[15.5px] text-[hsl(var(--muted-foreground))] mt-4 mb-8">{t.finalCta.sub}</p>
              <div className="flex flex-wrap justify-center gap-3">
                <Button size="lg" onClick={goSignup}>{t.finalCta.button} <Icons.ArrowRight size={16} /></Button>
                <Button size="lg" variant="outline" onClick={goLogin}>{t.nav.login}</Button>
              </div>
              <div className="mt-5 text-[12.5px] text-[hsl(var(--muted-foreground))] flex items-center justify-center gap-2">
                <Icons.Check size={14} className="text-[hsl(142_70%_50%)]" /> {t.finalCta.reassure}
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ---------------- FOOTER ---------------- */}
      <footer className="border-t border-[hsl(var(--border))] py-14">
        <div className="max-w-[1180px] mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-10 text-[13px]">
          <div className="col-span-2 md:col-span-1">
            <Logo size={32} />
            <p className="text-[12.5px] text-[hsl(var(--muted-foreground))] mt-3 leading-relaxed">
              {t.footer.tagline}<br />{t.footer.rights}
            </p>
            <div className="flex items-center gap-2 mt-4">
              {[Icons.Github, Icons.Globe, Icons.Mail].map((I, i) => (
                <span key={i} className="w-8 h-8 rounded-[8px] border border-[hsl(var(--border))] flex items-center justify-center text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:border-[hsl(var(--primary)/0.4)] transition-colors cursor-pointer">
                  <I size={15} />
                </span>
              ))}
            </div>
          </div>
          {t.footer.cols.map((c, ci) => {
            const legalTabs = ["terms", "privacy", "cookies", "gdpr"];
            const sectionFor = ci === 0 ? ["#modules", "#modules", "#pricing", "#faq"] : ["#faq", "#modules", "#faq", "#faq"];
            return (
              <div key={c.t}>
                <div className="text-[11px] uppercase tracking-[0.1em] font-semibold mb-3 text-[hsl(var(--muted-foreground))] font-mono">{c.t}</div>
                <ul className="space-y-2.5 text-[hsl(var(--muted-foreground))]">
                  {c.l.map((item, ii) => (
                    <li key={item}>
                      {ci === 2
                        ? <button onClick={() => setLegal(legalTabs[ii] || "terms")} className="hover:text-[hsl(var(--foreground))] transition-colors text-left">{item}</button>
                        : <a className="hover:text-[hsl(var(--foreground))] transition-colors" href={sectionFor[ii] || "#modules"}>{item}</a>}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
        {/* bottom legal strip — always-available real links */}
        <div className="max-w-[1180px] mx-auto px-6 mt-10 pt-6 border-t border-[hsl(var(--border))] flex flex-wrap items-center justify-between gap-3 text-[12px] text-[hsl(var(--muted-foreground))]">
          <span>{t.footer.rights}</span>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
            {["terms", "privacy", "cookies", "gdpr"].map(id => (
              <button key={id} onClick={() => setLegal(id)} className="hover:text-[hsl(var(--foreground))] transition-colors">{t.legal.tabs[id]}</button>
            ))}
          </div>
        </div>
      </footer>

      {/* ---------------- OVERLAYS ---------------- */}
      <VideoModal open={videoOpen} onClose={() => setVideoOpen(false)} t={t} />
      <LegalModal open={!!legal} tab={legal} onClose={() => setLegal(null)} onTab={setLegal} t={t} />
      <CookieBanner t={t} onLegal={setLegal} />
    </div>
  );
}

Object.assign(window, { LandingPage });
