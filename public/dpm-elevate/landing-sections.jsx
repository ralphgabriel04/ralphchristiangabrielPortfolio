/* global React, Icons, Button, Badge, cn, useState, useEffect, useRef,
   Reveal, Eyebrow, SectionHead, useLandingT, window, document */

/* ============================================================
   LANDING — sections & overlays added for the 10/10 pass:
   BrandMarquee · SocialProofBar · VideoModal · PricingSection ·
   FAQSection · CookieBanner · LegalModal.
   All bilingual via the copy dictionary (t = useLandingT(lang)).
============================================================ */

/* ---------- Monochrome brand SVGs (currentColor, theme-aware) ---------- */
const BrandMarks = {
  google: (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <rect x="5" y="5" width="14" height="14" rx="1" fill="#fff"/>
      <path fill="#EA4335" d="M5 7a2 2 0 0 1 2-2h1.2v3H5z"/>
      <path fill="#FBBC05" d="M19 7a2 2 0 0 0-2-2h-1.2v3H19z"/>
      <path fill="#34A853" d="M19 17a2 2 0 0 1-2 2h-1.2v-3H19z"/>
      <path fill="#4285F4" d="M5 17a2 2 0 0 0 2 2h1.2v-3H5z"/>
      <text x="12" y="15.6" fontSize="7.4" fontWeight="700" textAnchor="middle" fill="#4285F4" fontFamily="Arial, sans-serif">31</text>
    </svg>
  ),
  outlook: (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <rect x="11" y="7" width="10" height="10" rx="1" fill="#28A8EA"/>
      <path fill="#fff" d="M11 8.4l5 3.1 5-3.1V7.6l-5 3.1-5-3.1z"/>
      <path fill="#0A4A8C" d="M3 6 13 4.3v15.4L3 18z"/>
      <ellipse cx="7.7" cy="12" rx="2.7" ry="3.3" fill="none" stroke="#fff" strokeWidth="1.6"/>
    </svg>
  ),
  apple: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
      <path d="M16.365 1.43c0 1.14-.42 2.2-1.12 2.99-.74.84-1.95 1.49-3.13 1.4-.14-1.13.43-2.31 1.09-3.06.74-.84 2.01-1.45 3.16-1.33zM20.5 17.2c-.57 1.32-.85 1.91-1.59 3.08-1.03 1.63-2.49 3.66-4.29 3.67-1.6.02-2.01-1.04-4.18-1.03-2.17.01-2.62 1.05-4.22 1.03-1.8-.02-3.18-1.85-4.21-3.48-2.88-4.56-3.19-9.91-1.41-12.76 1.27-2.02 3.27-3.2 5.15-3.2 1.92 0 3.12 1.05 4.71 1.05 1.54 0 2.48-1.05 4.7-1.05 1.68 0 3.46.91 4.73 2.49-4.16 2.28-3.48 8.21.81 9.94z"/>
    </svg>
  ),
  todoist: (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" fill="#E44332"/>
      <path d="M7 9.1l1.7 1 4.3-2.5M7 12.3l1.7 1 4.3-2.5M7 15.5l1.7 1 4.3-2.5" fill="none" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  slack: (
    <svg viewBox="0 0 122.8 122.8" width="18" height="18" aria-hidden="true">
      <path fill="#E01E5A" d="M25.8 77.6c0 7.1-5.8 12.9-12.9 12.9S0 84.7 0 77.6s5.8-12.9 12.9-12.9h12.9v12.9zm6.5 0c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9v32.3c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V77.6z"/>
      <path fill="#36C5F0" d="M45.2 25.8c-7.1 0-12.9-5.8-12.9-12.9S38.1 0 45.2 0s12.9 5.8 12.9 12.9v12.9H45.2zm0 6.5c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H12.9C5.8 58.1 0 52.3 0 45.2s5.8-12.9 12.9-12.9h32.3z"/>
      <path fill="#2EB67D" d="M97 45.2c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9-5.8 12.9-12.9 12.9H97V45.2zm-6.5 0c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V12.9C64.7 5.8 70.5 0 77.6 0s12.9 5.8 12.9 12.9v32.3z"/>
      <path fill="#ECB22E" d="M77.6 97c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9-12.9-5.8-12.9-12.9V97h12.9zm0-6.5c-7.1 0-12.9-5.8-12.9-12.9s5.8-12.9 12.9-12.9h32.3c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H77.6z"/>
    </svg>
  ),
  notion: (
    <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="3" fill="#fff" stroke="#000" strokeWidth="0.8" strokeOpacity="0.15"/>
      <path fill="#000" d="M8 7.8v8.4h1.7v-5.1l3.8 5.1H15V7.8h-1.7v5l-3.7-5z"/>
    </svg>
  ),
  zoom: (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="6" fill="#2D8CFF"/>
      <path fill="#fff" d="M6 9.7C6 8.8 6.8 8 7.7 8h5.1c.9 0 1.7.8 1.7 1.7v4.6c0 .9-.8 1.7-1.7 1.7H7.7C6.8 16 6 15.2 6 14.3V9.7zm9.5 1.6 2.7-2c.43-.32 1 0 1 .52v5.36c0 .52-.57.84-1 .52l-2.7-2v-2.4z"/>
    </svg>
  ),
};

function BrandMarquee({ t }) {
  const brands = [
    { id: "google", name: "Google Calendar" }, { id: "outlook", name: "Outlook" },
    { id: "apple", name: "Apple Calendar" }, { id: "todoist", name: "Todoist" },
    { id: "slack", name: "Slack" }, { id: "notion", name: "Notion" }, { id: "zoom", name: "Zoom" },
  ];
  const row = [...brands, ...brands];
  return (
    <div className="lp-marquee-host relative mt-5 overflow-hidden"
      style={{ maskImage: "linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)", WebkitMaskImage: "linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)" }}>
      <div className="lp-marquee">
        {row.map((b, i) => (
          <span key={i} className="flex items-center gap-2.5 px-7 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors">
            <span className="opacity-90">{BrandMarks[b.id]}</span>
            <span className="text-[15px] font-semibold tracking-tight whitespace-nowrap">{b.name}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---------- Social proof bar: rating · users · Product Hunt ---------- */
function SocialProofBar({ t }) {
  const sp = t.socialProof;
  return (
    <Reveal delay={60} className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
      <div className="flex items-center gap-2">
        <div className="flex gap-0.5">{[0,1,2,3,4].map(s => <Icons.Star key={s} size={15} className="text-[hsl(38_92%_55%)]" fill="currentColor" />)}</div>
        <span className="text-[13px] font-semibold">{sp.rating}</span>
      </div>
      <span className="hidden sm:block w-px h-4 bg-[hsl(var(--border))]" />
      <div className="flex items-center gap-2 text-[13px] text-[hsl(var(--muted-foreground))]">
        <Icons.Users size={15} className="text-[hsl(var(--primary))]" /> <span className="font-semibold text-[hsl(var(--foreground))]">{sp.users}</span>
      </div>
      <span className="hidden sm:block w-px h-4 bg-[hsl(var(--border))]" />
      <div className="flex items-center gap-2">
        <span className="w-6 h-6 rounded-full bg-[hsl(14_90%_55%)] flex items-center justify-center text-white text-[11px] font-bold">P</span>
        <div className="leading-tight text-left">
          <div className="text-[9px] uppercase tracking-wide text-[hsl(var(--muted-foreground))]">Product Hunt</div>
          <div className="text-[11.5px] font-semibold">{sp.ph}</div>
        </div>
      </div>
    </Reveal>
  );
}

/* ---------- Video demo modal (placeholder player) ---------- */
function VideoModal({ open, onClose, t }) {
  const d = t.demo;
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    if (!open) { setPlaying(false); return; }
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-8" role="dialog" aria-modal="true" aria-label={d.title}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm lp-fade-in" onClick={onClose} />
      <div className="relative w-full max-w-3xl lp-pop">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-[15px] font-semibold text-white">{d.title}</div>
            <div className="text-[12.5px] text-white/60">{d.sub}</div>
          </div>
          <button onClick={onClose} aria-label={d.close}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
            <Icons.X size={18} />
          </button>
        </div>
        <div className="relative aspect-video rounded-[16px] overflow-hidden border border-white/15 bg-[#0b0b14]">
          {/* placeholder stage */}
          <div className="absolute inset-0" style={{ background: "radial-gradient(120% 100% at 50% 0%, #2d1b69 0%, #12121c 70%)" }} />
          <div className="lp-glow" style={{ width: 320, height: 320, top: -120, left: "50%", marginLeft: -160, background: "hsl(263 70% 55%)", opacity: 0.5 }} />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            <button onClick={() => setPlaying(p => !p)} aria-label={playing ? "Pause" : "Play"}
              className="w-16 h-16 rounded-full bg-white/95 text-[#1e1b4b] flex items-center justify-center shadow-2xl hover:scale-105 transition-transform">
              {playing ? <Icons.Pause size={26} /> : <Icons.Play size={26} className="ml-1" />}
            </button>
            <div className="text-[12px] text-white/70 font-mono">{d.caption}</div>
          </div>
          {/* faux controls */}
          <div className="absolute left-0 right-0 bottom-0 px-4 py-3 flex items-center gap-3 bg-gradient-to-t from-black/60 to-transparent">
            <Icons.Play size={14} className="text-white/80" />
            <div className="flex-1 h-1 rounded-full bg-white/25 overflow-hidden">
              <div className={cn("h-full rounded-full bg-white", playing ? "lp-video-progress" : "")} style={{ width: playing ? undefined : "8%" }} />
            </div>
            <span className="text-[11px] font-mono text-white/70">{d.duration}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Pricing ---------- */
function PricingSection({ t, onSignup }) {
  const p = t.pricing;
  const [yearly, setYearly] = useState(true);
  const ctaFor = (id) => id === "free" ? p.cta : id === "pro" ? p.ctaPro : p.ctaTeam;
  return (
    <section id="pricing" className="relative max-w-[1180px] mx-auto px-6 py-16 scroll-mt-24">
      <SectionHead n="06" label={p.label} title={p.title} sub={p.sub} />

      {/* billing toggle */}
      <Reveal delay={80} className="flex items-center justify-center gap-3 mt-9">
        <span className={cn("text-[13.5px] font-medium transition-colors", !yearly ? "text-[hsl(var(--foreground))]" : "text-[hsl(var(--muted-foreground))]")}>{p.monthly}</span>
        <button onClick={() => setYearly(y => !y)} role="switch" aria-checked={yearly} aria-label={p.yearly}
          className={cn("relative w-12 h-6.5 h-[26px] rounded-full transition-colors p-0.5", yearly ? "bg-[hsl(var(--primary))]" : "bg-[hsl(var(--muted))]")}>
          <span className={cn("block w-[22px] h-[22px] rounded-full bg-white shadow-sm transition-transform", yearly ? "translate-x-[24px]" : "translate-x-0")} />
        </button>
        <span className={cn("text-[13.5px] font-medium transition-colors", yearly ? "text-[hsl(var(--foreground))]" : "text-[hsl(var(--muted-foreground))]")}>{p.yearly}</span>
        <Badge variant="success" className="ml-1">{p.save}</Badge>
      </Reveal>

      <div className="grid md:grid-cols-3 gap-5 mt-10 items-stretch">
        {p.plans.map((plan, i) => {
          const popular = plan.id === "pro";
          const price = yearly ? plan.priceY : plan.priceM;
          return (
            <Reveal key={plan.id} delay={i * 90} className="h-full">
              <div className={cn("relative h-full rounded-[18px] border p-7 flex flex-col transition-all",
                popular ? "border-[hsl(var(--primary)/0.6)] bg-[hsl(var(--card))] shadow-xl lp-ring" : "border-[hsl(var(--border))] bg-[hsl(var(--card))] lp-card-hover")}>
                {popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-[hsl(var(--primary))] text-white shadow-lg whitespace-nowrap">{p.popular}</span>
                  </div>
                )}
                <div className="text-[15px] font-semibold">{plan.name}</div>
                <div className="text-[12.5px] text-[hsl(var(--muted-foreground))] mt-0.5">{plan.tagline}</div>
                <div className="mt-5 flex items-end gap-1.5">
                  <span className="text-[40px] font-bold tracking-tight leading-none tabular-nums">CA${price}</span>
                  <span className="text-[13px] text-[hsl(var(--muted-foreground))] mb-1.5">{price === 0 ? p.forever : p.perMonth}</span>
                </div>
                <div className="text-[11.5px] text-[hsl(var(--muted-foreground))] mt-1 h-4">
                  {price > 0 ? (yearly ? `${p.billedYearly} · ${plan.id === "team" ? p.perSeat : ""}` : (plan.id === "team" ? p.perSeat : "")) : ""}
                </div>
                <Button className="w-full mt-5" variant={popular ? "primary" : "outline"} onClick={onSignup}>
                  {ctaFor(plan.id)} <Icons.ArrowRight size={16} />
                </Button>
                <ul className="mt-6 space-y-2.5">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-2.5 text-[13px]">
                      <Icons.Check size={15} className="text-[hsl(var(--primary))] flex-shrink-0 mt-0.5" stroke={2.5} />
                      <span className="text-[hsl(var(--foreground)/0.9)]">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

/* ---------- FAQ accordion ---------- */
function FaqItem({ q, a, open, onToggle, id }) {
  return (
    <div className="border-b border-[hsl(var(--border))]">
      <button onClick={onToggle} aria-expanded={open} aria-controls={id}
        className="w-full flex items-center justify-between gap-4 py-5 text-left group">
        <span className="text-[15.5px] font-medium group-hover:text-[hsl(var(--primary))] transition-colors" style={{ textWrap: "balance" }}>{q}</span>
        <span className={cn("w-8 h-8 rounded-full border border-[hsl(var(--border))] flex items-center justify-center flex-shrink-0 transition-all", open ? "bg-[hsl(var(--primary))] border-transparent text-white rotate-180" : "text-[hsl(var(--muted-foreground))]")}>
          <Icons.ChevronDown size={16} />
        </span>
      </button>
      <div id={id} className="grid transition-[grid-template-rows] duration-300 ease-out" style={{ gridTemplateRows: open ? "1fr" : "0fr" }}>
        <div className="overflow-hidden">
          <p className="pb-5 pr-12 text-[14px] text-[hsl(var(--muted-foreground))] leading-relaxed" style={{ textWrap: "pretty" }}>{a}</p>
        </div>
      </div>
    </div>
  );
}

function FaqSection({ t }) {
  const f = t.faq;
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" className="relative max-w-[820px] mx-auto px-6 py-16 scroll-mt-24">
      <SectionHead n="07" label={f.label} title={f.title} sub={f.sub} />
      <Reveal delay={80} className="mt-10">
        <div className="rounded-[18px] border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-6 sm:px-8">
          {f.items.map((it, i) => (
            <FaqItem key={i} id={`faq-${i}`} q={it.q} a={it.a} open={open === i} onToggle={() => setOpen(open === i ? -1 : i)} />
          ))}
        </div>
      </Reveal>
    </section>
  );
}

/* ---------- Cookie consent banner (persisted) ---------- */
const COOKIE_LS_KEY = "dpm-cookie-consent";
function CookieBanner({ t, onLegal }) {
  const c = t.cookie;
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    let seen = "1";
    try { seen = localStorage.getItem(COOKIE_LS_KEY); } catch (e) {}
    if (!seen) setVisible(true);
  }, []);
  const decide = (val) => {
    try { localStorage.setItem(COOKIE_LS_KEY, val); } catch (e) {}
    setVisible(false);
  };
  if (!visible) return null;
  return (
    <div className="fixed inset-x-0 bottom-0 z-[70] p-4 sm:p-5 lp-slide-up" role="region" aria-label={c.title}>
      <div className="max-w-[920px] mx-auto rounded-[16px] border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="w-10 h-10 rounded-[10px] bg-[hsl(var(--primary)/0.12)] flex items-center justify-center flex-shrink-0">
          <Icons.Shield size={20} className="text-[hsl(var(--primary))]" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[14px] font-semibold">{c.title}</div>
          <p className="text-[12.5px] text-[hsl(var(--muted-foreground))] mt-0.5 leading-snug">
            {c.body} <button onClick={() => onLegal && onLegal("cookies")} className="underline hover:text-[hsl(var(--foreground))]">{c.learn}</button>
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button variant="ghost" size="sm" onClick={() => decide("essential")}>{c.essential}</Button>
          <Button size="sm" onClick={() => decide("all")}>{c.accept}</Button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Legal modal (Terms / Privacy / Cookies / GDPR) ---------- */
function LegalModal({ open, tab = "terms", onClose, onTab, t: tProp }) {
  const t = tProp || (typeof useLandingT === "function" ? useLandingT(window.__dpmLang || "en") : null);
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") onClose && onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open || !t || !t.legal) return null;
  const lg = t.legal;
  const active = tab && lg[tab] ? tab : "terms";
  const tabIds = ["terms", "privacy", "cookies", "gdpr"];
  const sec = lg[active];
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 sm:p-8" role="dialog" aria-modal="true" aria-label={sec.title}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm lp-fade-in" onClick={onClose} />
      <div className="relative w-full max-w-2xl max-h-[85vh] rounded-[18px] border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-2xl flex flex-col lp-pop">
        <div className="flex items-center justify-between p-5 border-b border-[hsl(var(--border))]">
          <div className="flex items-center gap-2.5">
            <Icons.Shield size={18} className="text-[hsl(var(--primary))]" />
            <span className="text-[15px] font-semibold">{sec.title}</span>
          </div>
          <button onClick={onClose} aria-label={lg.close} className="w-8 h-8 rounded-full hover:bg-[hsl(var(--accent))] flex items-center justify-center transition-colors">
            <Icons.X size={17} />
          </button>
        </div>
        <div className="flex items-center gap-1 px-5 pt-4 flex-wrap">
          {tabIds.map(id => (
            <button key={id} onClick={() => onTab && onTab(id)}
              className={cn("px-3 h-8 rounded-[8px] text-[12.5px] font-medium transition-colors",
                active === id ? "bg-[hsl(var(--primary))] text-white" : "text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))]")}>
              {lg.tabs[id]}
            </button>
          ))}
        </div>
        <div className="p-5 overflow-y-auto">
          <div className="text-[11.5px] font-mono uppercase tracking-wide text-[hsl(var(--muted-foreground))] mb-4">{lg.updated}</div>
          <div className="space-y-4">
            {sec.body.map((para, i) => (
              <p key={i} className="text-[14px] leading-relaxed text-[hsl(var(--foreground)/0.9)]" style={{ textWrap: "pretty" }}>{para}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  BrandMarquee, SocialProofBar, VideoModal, PricingSection, FaqSection, CookieBanner, LegalModal,
});
