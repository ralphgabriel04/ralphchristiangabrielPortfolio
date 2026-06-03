/* global React, Icons, Button, Card, Badge, Input, cn,
          useState, useEffect, useRef,
          TOUR_MODULES, TOUR_VIDEOS, TOUR_PERSONAS, TOUR_FAQ, getTourModule */

/* ============================================================
   CENTRE DE RESSOURCES (P19) — route "resources"

   Hub in-app cherchable. Tout son contenu dérive du catalogue
   unique (tour-catalog.jsx) : vidéos, personas, FAQ et le
   « Guide par fonctionnalité » (une ancre id="res-<module>" par
   module — cible des « En savoir plus → » de la visite).

   Deep-link : window.__dpmOpenResources(moduleId) → l'app bascule
   sur cette route puis émet "dpm-res-deeplink"; on scrolle vers
   #res-<module> et on le surligne brièvement.
============================================================ */

const WIKI_URL = "https://github.com/dpm-calendar/dpm/wiki";

function ResourcesPage() {
  const [query, setQuery] = useState("");
  const [highlight, setHighlight] = useState(null);
  const scrollRef = useRef(null);

  // Deep-link handling — scroll + transient highlight on the target section.
  useEffect(() => {
    const go = (moduleId) => {
      if (!moduleId) return;
      // wait a frame so the section is laid out
      requestAnimationFrame(() => setTimeout(() => {
        const el = document.getElementById("res-" + moduleId);
        const sc = scrollRef.current;
        if (el && sc) {
          const er = el.getBoundingClientRect();
          const cr = sc.getBoundingClientRect();
          sc.scrollTop += (er.top - cr.top) - 16;
        }
        setHighlight(moduleId);
        setTimeout(() => setHighlight(h => (h === moduleId ? null : h)), 2600);
      }, 60));
    };
    const onDeep = (e) => go(e.detail);
    window.addEventListener("dpm-res-deeplink", onDeep);
    // honor a pending target set before this page mounted
    if (window.__dpmResTarget) { const id = window.__dpmResTarget; window.__dpmResTarget = null; go(id); }
    return () => window.removeEventListener("dpm-res-deeplink", onDeep);
  }, []);

  const q = query.trim().toLowerCase();
  const matchVideos = TOUR_VIDEOS.filter(v => !q || v.title.toLowerCase().includes(q) || (getTourModule(v.module)?.label || "").toLowerCase().includes(q));
  const matchFaq = TOUR_FAQ.map(g => ({
    ...g,
    items: g.items.filter(it => !q || it.q.toLowerCase().includes(q) || it.a.toLowerCase().includes(q)),
  })).filter(g => g.items.length);
  const matchModules = TOUR_MODULES.filter(m => !q
    || m.label.toLowerCase().includes(q)
    || m.blurb.toLowerCase().includes(q)
    || m.features.some(f => f.label.toLowerCase().includes(q) || f.desc.toLowerCase().includes(q)));

  const startTour = () => window.__dpmTour?.startOverview();

  return (
    <div ref={scrollRef} className="h-full overflow-y-auto">
      <div className="max-w-6xl mx-auto px-1 pb-16">
        {/* ===== HEADER ===== */}
        <div className="relative overflow-hidden rounded-[16px] border border-[hsl(var(--border))] bg-gradient-to-br from-[hsl(263_70%_16%/0.5)] via-[hsl(var(--card))] to-[hsl(330_70%_14%/0.3)] p-6 md:p-8 mb-8">
          <div className="absolute -right-10 -top-16 w-56 h-56 rounded-full gradient-violet opacity-15 blur-3xl pointer-events-none" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[hsl(var(--primary)/0.15)] text-[hsl(263_70%_82%)] text-[11px] font-semibold mb-3">
              <Icons.Book size={12} /> Resource center
            </div>
            <h1 className="text-[28px] md:text-[32px] font-bold tracking-tight leading-tight">Learn DPM at your own pace</h1>
            <p className="text-[14px] text-[hsl(var(--muted-foreground))] mt-2 max-w-2xl leading-relaxed">
              Short videos, journeys by profile, answers to frequent questions and a module-by-module guide. Everything is searchable — and the guided tour is never far.
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-5">
              <div className="relative flex-1 max-w-md">
                <Input
                  icon={Icons.Search}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search a feature, a question…"
                />
              </div>
              <div className="flex items-center gap-2">
                <Button icon={Icons.Play} onClick={startTour}>Full guided tour</Button>
                <a href={WIKI_URL} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" icon={Icons.Github} iconRight={Icons.ArrowRight}>Wiki GitHub</Button>
                </a>
              </div>
            </div>
          </div>
        </div>

        {q && matchVideos.length === 0 && matchFaq.length === 0 && matchModules.length === 0 && (
          <div className="text-center py-14">
            <div className="w-12 h-12 rounded-full bg-[hsl(var(--muted))] flex items-center justify-center mx-auto mb-3 text-[hsl(var(--muted-foreground))]"><Icons.Search size={20} /></div>
            <p className="font-medium text-[15px]">No results for “{query}”</p>
            <p className="text-[13px] text-[hsl(var(--muted-foreground))] mt-1">Try another term, or launch the guided tour to explore.</p>
          </div>
        )}

        {/* ===== VIDÉOS ===== */}
        {matchVideos.length > 0 && (
          <Section title="Explainer videos" subtitle="Short formats — placeholders pending filming." icon={Icons.PlayCircle}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {matchVideos.map(v => <VideoCard key={v.id} v={v} />)}
            </div>
          </Section>
        )}

        {/* ===== PAR PROFIL ===== */}
        {!q && (
          <Section title="By profile" subtitle="Pick the persona that fits you — we'll launch the most useful journey." icon={Icons.Users}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {TOUR_PERSONAS.map(p => <PersonaCard key={p.id} p={p} />)}
            </div>
          </Section>
        )}

        {/* ===== FAQ ===== */}
        {matchFaq.length > 0 && (
          <Section title="Frequently asked questions" subtitle="Pricing, privacy (Law 25 / GDPR), tour, sync, mobile…" icon={Icons.HelpCircle}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
              {matchFaq.map((g, gi) => (
                <FaqGroup key={g.cat} group={g} defaultOpenFirst={gi === 0 && !q} forceOpen={!!q} />
              ))}
            </div>
          </Section>
        )}

        {/* ===== GUIDE PAR FONCTIONNALITÉ ===== */}
        {matchModules.length > 0 && (
          <Section title="Guide by feature" subtitle="Every module and everything it can do — replay a tutorial anytime." icon={Icons.Compass}>
            <div className="space-y-3">
              {matchModules.map(m => (
                <ModuleGuide key={m.id} m={m} highlighted={highlight === m.id} query={q} />
              ))}
            </div>
          </Section>
        )}
      </div>
    </div>
  );
}

function Section({ title, subtitle, icon: Icon, children }) {
  return (
    <section className="mb-10">
      <div className="flex items-center gap-2.5 mb-4">
        <span className="w-8 h-8 rounded-[9px] bg-[hsl(var(--primary)/0.12)] text-[hsl(263_70%_80%)] flex items-center justify-center flex-shrink-0">
          <Icon size={16} />
        </span>
        <div>
          <h2 className="text-[18px] font-bold tracking-tight leading-none">{title}</h2>
          {subtitle && <p className="text-[12.5px] text-[hsl(var(--muted-foreground))] mt-1">{subtitle}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}

function VideoCard({ v }) {
  return (
    <button className="group text-left rounded-[12px] border border-[hsl(var(--border))] bg-[hsl(var(--card))] overflow-hidden hover:border-[hsl(var(--primary)/0.4)] hover:shadow-lg transition-all">
      <div
        className="relative aspect-video flex items-center justify-center"
        style={{ background: `linear-gradient(135deg, hsl(${v.hue} 70% 28%), hsl(${(v.hue + 40) % 360} 70% 20%))` }}
      >
        <span className="w-12 h-12 rounded-full bg-white/15 backdrop-blur border border-white/25 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
          <Icons.Play size={18} />
        </span>
        <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/55 text-white text-[11px] font-mono tabular-nums">{v.duration}</span>
        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/40 text-white/90 text-[10px] font-medium">{getTourModule(v.module)?.label}</span>
      </div>
      <div className="p-3.5">
        <div className="text-[13.5px] font-semibold leading-snug">{v.title}</div>
        <div className="text-[11.5px] text-[hsl(var(--muted-foreground))] mt-1 flex items-center gap-1">
          <Icons.PlayCircle size={11} /> Video · placeholder
        </div>
      </div>
    </button>
  );
}

function PersonaCard({ p }) {
  return (
    <Card className="flex flex-col gap-3" interactive={false}>
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 rounded-[12px] bg-[hsl(var(--muted))] flex items-center justify-center text-[22px] flex-shrink-0">{p.emoji}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-[15px] font-bold tracking-tight">{p.name}</h3>
            <Badge variant="primary">{p.role}</Badge>
          </div>
          <p className="text-[12.5px] text-[hsl(var(--muted-foreground))] mt-1 leading-snug">{p.pain}</p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-1.5">
        {p.modules.map(id => {
          const m = getTourModule(id);
          const IconC = Icons[m?.icon] || Icons.Sparkles;
          return (
            <span key={id} className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[hsl(var(--muted)/0.6)] text-[11.5px] font-medium">
              <IconC size={11} className="text-[hsl(263_70%_75%)]" /> {m?.label}
            </span>
          );
        })}
      </div>
      <Button
        size="sm"
        className="w-full mt-0.5"
        icon={Icons.Play}
        onClick={() => window.__dpmTour?.startModule(p.start)}
      >
        Start the journey
      </Button>
    </Card>
  );
}

function FaqGroup({ group, defaultOpenFirst, forceOpen }) {
  const [open, setOpen] = useState(() => (defaultOpenFirst ? 0 : -1));
  return (
    <div className="mb-2">
      <div className="text-[11px] uppercase tracking-[0.1em] font-semibold text-[hsl(var(--muted-foreground))] mb-2 px-1">{group.cat}</div>
      <div className="space-y-1.5">
        {group.items.map((it, i) => {
          const isOpen = forceOpen || open === i;
          return (
            <div key={i} className="rounded-[10px] border border-[hsl(var(--border))] bg-[hsl(var(--card))] overflow-hidden">
              <button
                onClick={() => setOpen(o => (o === i ? -1 : i))}
                className="w-full flex items-center justify-between gap-3 px-3.5 py-3 text-left hover:bg-[hsl(var(--accent)/0.3)] transition-colors"
                aria-expanded={isOpen}
              >
                <span className="text-[13px] font-medium leading-snug">{it.q}</span>
                <Icons.ChevronDown size={14} className={cn("flex-shrink-0 text-[hsl(var(--muted-foreground))] transition-transform duration-200", isOpen && "rotate-180")} />
              </button>
              {isOpen && (
                <div className="px-3.5 pb-3.5 -mt-0.5 text-[12.5px] text-[hsl(var(--muted-foreground))] leading-relaxed anim-fade-in">
                  {it.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ModuleGuide({ m, highlighted, query }) {
  const IconC = Icons[m.icon] || Icons.Sparkles;
  const [open, setOpen] = useState(false);
  const expanded = open || highlighted || !!query;
  return (
    <div
      id={"res-" + m.id}
      className={cn(
        "scroll-mt-4 rounded-[12px] border bg-[hsl(var(--card))] transition-all duration-300",
        highlighted
          ? "border-[hsl(var(--primary)/0.7)] shadow-[0_0_0_3px_hsl(var(--primary)/0.25)] bg-[hsl(var(--primary)/0.04)]"
          : "border-[hsl(var(--border))]"
      )}
    >
      <div className="flex items-center gap-3 p-4">
        <span className="w-9 h-9 rounded-[10px] bg-[hsl(var(--primary)/0.12)] text-[hsl(263_70%_80%)] flex items-center justify-center flex-shrink-0">
          <IconC size={17} />
        </span>
        <button onClick={() => setOpen(o => !o)} className="flex-1 min-w-0 text-left">
          <div className="flex items-center gap-2">
            <h3 className="text-[15px] font-bold tracking-tight">{m.label}</h3>
            <span className="text-[11px] text-[hsl(var(--muted-foreground))] font-mono tabular-nums">{m.features.length} functions</span>
          </div>
          <p className="text-[12px] text-[hsl(var(--muted-foreground))] mt-0.5 leading-snug line-clamp-1">{m.blurb}</p>
        </button>
        <Icons.ChevronDown
          size={16}
          onClick={() => setOpen(o => !o)}
          className={cn("flex-shrink-0 text-[hsl(var(--muted-foreground))] cursor-pointer transition-transform duration-200", expanded && "rotate-180")}
        />
      </div>

      {expanded && (
        <div className="px-4 pb-4 anim-fade-in">
          <div className="rounded-[10px] border border-[hsl(var(--border))] divide-y divide-[hsl(var(--border))] overflow-hidden mb-3">
            {m.features.map(f => (
              <div key={f.sel} className="flex items-start gap-3 px-3.5 py-2.5">
                <span className={cn("mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0", f.key ? "bg-[hsl(var(--primary))]" : "bg-[hsl(var(--muted-foreground)/0.5)]")} />
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[13px] font-semibold">{f.label}</span>
                    {f.key && <span className="text-[9.5px] uppercase tracking-wider font-semibold text-[hsl(263_70%_80%)] bg-[hsl(var(--primary)/0.12)] px-1.5 py-0.5 rounded">Key</span>}
                  </div>
                  <div className="text-[12px] text-[hsl(var(--muted-foreground))] leading-snug mt-0.5"><em className="not-italic">{f.desc}</em></div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" icon={Icons.Play} onClick={() => window.__dpmTour?.startModule(m.id)}>
              Replay this module's tutorial
            </Button>
            <a href={WIKI_URL} target="_blank" rel="noopener noreferrer">
              <Button size="sm" variant="outline" icon={Icons.Github} iconRight={Icons.ArrowRight}>View in the Wiki</Button>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

if (typeof window !== "undefined") {
  Object.assign(window, { ResourcesPage });
}
