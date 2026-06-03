/* global React, Icons, cn, Card, SectionTitle, Button, Badge, Switch,
          Modal, ModalHeader, ModalBody, ModalFooter, useState, useEffect */

/* ============================================================
   APPAREILS CONNECTÉS (P27) — wearables → énergie & chronotype.

   Honnêteté technique (réelle) :
     • Fitbit · Oura · Google Fit → OAuth web (connectables depuis le web).
     • Apple Watch → HealthKit, app iOS native uniquement (« via app mobile »).
     • Garmin → API partenaire, sur approbation.

   Confidentialité (non négociable) : opt-in explicite, scopes minimaux en
   LECTURE SEULE, jamais partagé, révocation + suppression faciles.
   Loi 25 / PIPEDA / RGPD (catégorie de données sensibles).

   Store pub/sub window.* + localStorage — comme le reste de l'app.
============================================================ */

const DEVICES_KEY = "dpm-devices";

const DEVICE_CATALOG = [
  { id: "apple",  name: "Apple Watch", letter: "AW", color: "215 15% 60%", mode: "mobile",
    provides: ["Sommeil", "FC", "Activité", "Récupération"] },
  { id: "garmin", name: "Garmin",      letter: "Gr", color: "217 91% 55%", mode: "partner",
    provides: ["Sommeil", "FC", "Récupération"] },
  { id: "fitbit", name: "Fitbit",      letter: "Fb", color: "174 62% 48%", mode: "web",
    provides: ["Sommeil", "FC", "Pas"] },
  { id: "oura",   name: "Oura Ring",   letter: "Ou", color: "263 70% 60%", mode: "web",
    provides: ["Sommeil", "Récupération", "FC repos"] },
  { id: "gfit",   name: "Google Fit",  letter: "GF", color: "142 70% 48%", mode: "web",
    provides: ["Activité", "Pas", "FC"] },
];

function readDevices() {
  try {
    const r = localStorage.getItem(DEVICES_KEY);
    if (r) { const p = JSON.parse(r); if (p && typeof p === "object") return p; }
  } catch (e) {}
  return { connected: { fitbit: true }, requested: {} };
}
function writeDevices(s) { try { localStorage.setItem(DEVICES_KEY, JSON.stringify(s)); } catch (e) {} }

if (typeof window !== "undefined" && !window.__dpmDevices) window.__dpmDevices = readDevices();

function setDevices(next) {
  window.__dpmDevices = typeof next === "function" ? next(window.__dpmDevices) : next;
  writeDevices(window.__dpmDevices);
  window.dispatchEvent(new CustomEvent("dpm-devices-change", { detail: window.__dpmDevices }));
}

function useDevices() {
  const [state, setState] = useState(window.__dpmDevices || { connected: {}, requested: {} });
  useEffect(() => {
    const h = (e) => setState({ ...e.detail });
    window.addEventListener("dpm-devices-change", h);
    return () => window.removeEventListener("dpm-devices-change", h);
  }, []);
  const ops = {
    connect: (id) => setDevices((s) => ({ ...s, connected: { ...s.connected, [id]: true } })),
    disconnect: (id) => setDevices((s) => { const c = { ...s.connected }; delete c[id]; return { ...s, connected: c }; }),
    request: (id) => setDevices((s) => ({ ...s, requested: { ...s.requested, [id]: true } })),
  };
  return [state, ops];
}

if (typeof window !== "undefined") Object.assign(window, { useDevices });

/* ---------- consent (opt-in) modal ---------- */
function DeviceConsentModal({ open, device, onClose, onAuthorize }) {
  if (!open || !device) return null;
  const scopes = [];
  if (device.provides.some((p) => /sommeil/i.test(p))) scopes.push(["Sommeil", "Durée, régularité, qualité — pour la courbe d'énergie."]);
  if (device.provides.some((p) => /fc/i.test(p))) scopes.push(["Fréquence cardiaque au repos", "Tendance uniquement — pas de données médicales."]);
  if (device.provides.some((p) => /récup/i.test(p))) scopes.push(["Récupération", "Score quotidien — pour ajuster la charge proposée."]);
  if (device.provides.some((p) => /activ|pas/i.test(p))) scopes.push(["Activité & pas", "Volume d'activité — contextualise l'énergie du jour."]);
  if (!scopes.length) scopes.push(["Sommeil", "Pour la courbe d'énergie."]);

  return (
    <Modal open={open} onClose={onClose} size="md">
      <ModalHeader title={"Autoriser l'accès — " + device.name} onClose={onClose} />
      <ModalBody>
        <div className="flex items-center gap-3 mb-4">
          <span className="w-11 h-11 rounded-[12px] flex items-center justify-center flex-shrink-0 text-[14px] font-bold"
            style={{ background: `hsl(${device.color} / 0.18)`, color: `hsl(${device.color})` }}>{device.letter}</span>
          <div>
            <div className="text-[15px] font-bold leading-tight">{device.name}</div>
            <div className="text-[12px] text-[hsl(var(--muted-foreground))]">OAuth web · lecture seule</div>
          </div>
        </div>
        <div className="text-[11px] uppercase tracking-[0.12em] font-semibold text-[hsl(var(--muted-foreground))] mb-1">DPM pourra lire</div>
        <div className="divide-y divide-[hsl(var(--border))]">
          {scopes.map(([t, d]) => (
            <div key={t} className="flex items-start gap-2.5 py-2.5">
              <span className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: "hsl(142 70% 45% / 0.18)", color: "hsl(142 70% 60%)" }}>
                <Icons.Check size={12} stroke={3} />
              </span>
              <div><div className="text-[12.5px] font-semibold">{t}</div><div className="text-[11px] text-[hsl(var(--muted-foreground))]">{d}</div></div>
            </div>
          ))}
        </div>
        <div className="rounded-[10px] border border-dashed border-[hsl(var(--border))] mt-3 p-3 flex items-start gap-2.5">
          <span className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0" style={{ background: "hsl(0 84% 60% / 0.14)", color: "hsl(0 84% 70%)" }}><Icons.X size={13} stroke={2.4} /></span>
          <div className="text-[11.5px] leading-snug"><strong>Jamais demandé :</strong> <span className="text-[hsl(var(--muted-foreground))]">écriture, localisation, contacts, données médicales détaillées. Et jamais partagé.</span></div>
        </div>
        <p className="text-[10.5px] text-[hsl(var(--muted-foreground))] mt-3 flex items-center gap-1.5">
          <Icons.Lock size={12} /> Révocable à tout moment — déconnexion + suppression des données importées.
        </p>
      </ModalBody>
      <ModalFooter>
        <Button variant="outline" size="sm" onClick={onClose}>Annuler</Button>
        <Button size="sm" icon={Icons.Lock} onClick={() => { onAuthorize(); onClose(); }}>Autoriser la lecture</Button>
      </ModalFooter>
    </Modal>
  );
}

/* ---------- stat card + sparkline ---------- */
function HealthStatCard({ icon: Icon, color, label, value, unit, sub, bars }) {
  return (
    <div className="rounded-[12px] border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-3.5 h-full">
      <div className="flex items-center gap-2 mb-2" style={{ color: `hsl(${color})` }}>
        <Icon size={14} />
        <span className="text-[10.5px] uppercase tracking-wide font-semibold text-[hsl(var(--muted-foreground))] whitespace-nowrap">{label}</span>
      </div>
      <div className="text-[20px] font-bold tabular-nums leading-none">
        {value}{unit && <span className="text-[11px] font-medium text-[hsl(var(--muted-foreground))]"> {unit}</span>}
      </div>
      <div className="text-[10.5px] mt-1 font-medium" style={{ color: `hsl(${sub.color})` }}>{sub.text}</div>
      <div className="flex items-end gap-[3px] h-6 mt-2.5">
        {bars.map((h, i) => (
          <span key={i} className="flex-1 rounded-t-[2px]" style={{ height: h + "%", background: i === bars.length - 1 ? `hsl(${color})` : `hsl(${color} / 0.4)` }} />
        ))}
      </div>
    </div>
  );
}

/* Daily health metrics — single source of truth, reused by the settings card
   and the Home snapshot. */
const HEALTH_METRICS = [
  { id: "sleep",    icon: Icons.Moon,  color: "263 70% 70%", label: "Sommeil",        value: "7 h 24",          sub: { color: "142 70% 60%", text: "Qualité bonne · +38 min" }, bars: [60, 45, 70, 55, 50, 80, 90] },
  { id: "hr",       icon: Icons.Flame, color: "0 84% 68%",   label: "FC repos",       value: "58", unit: "bpm",  sub: { color: "142 70% 60%", text: "Stable · normal" },        bars: [50, 55, 48, 52, 46, 50, 48] },
  { id: "steps",    icon: Icons.Zap,   color: "217 91% 72%", label: "Activité · pas", value: "6 240",           sub: { color: "38 92% 62%",  text: "62 % de l'objectif" },      bars: [30, 55, 40, 75, 60, 45, 62] },
  { id: "recovery", icon: Icons.Clock, color: "142 70% 62%", label: "Récupération",   value: "82", unit: "/100", sub: { color: "142 70% 60%", text: "Élevée · prêt" },           bars: [55, 60, 50, 65, 70, 75, 82] },
];

/* Animate scrollLeft with a manual rAF tween. We can't use the browser's
   smooth scroll (CSS scroll-behavior OR the `behavior:"smooth"` option) here:
   on a scroll-snap container this engine cancels the in-flight smooth animation
   and reverts to the start. Per-frame scrollLeft writes (with scroll-behavior
   auto) aren't treated as a smooth animation, so snap leaves them alone and we
   land exactly on a snap boundary. */
function animateScrollLeft(el, to, dur = 300) {
  if (!el) return;
  const start = el.scrollLeft;
  const delta = to - start;
  if (Math.abs(delta) < 1) { el.scrollLeft = to; return; }
  const t0 = performance.now();
  const ease = (p) => (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2);
  const step = (now) => {
    const p = Math.min(1, (now - t0) / dur);
    el.scrollLeft = start + delta * ease(p);
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

/* ---------- day-health carousel ----------
   Horizontal scroll-snap carousel of the day's metrics with arrow paging and
   page dots. Replaces the fixed 4-col grid so the last card never gets clipped
   and the same component works in a narrow Home column or a wide settings card.
   `perView` controls how many cards are visible at once (peek via fractional). */
function DayHealthCarousel({ perView = 2 }) {
  const scroller = React.useRef(null);
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(1);
  const recompute = () => {
    const el = scroller.current; if (!el) return;
    const pg = el.clientWidth > 0 ? Math.round(el.scrollLeft / el.clientWidth) : 0;
    setPage(pg);
    setPages(Math.max(1, Math.ceil((el.scrollWidth - 2) / el.clientWidth)));
  };
  useEffect(() => {
    const el = scroller.current; if (!el) return;
    recompute();
    el.addEventListener("scroll", recompute, { passive: true });
    window.addEventListener("resize", recompute);
    const t = setTimeout(recompute, 60);
    return () => { el.removeEventListener("scroll", recompute); window.removeEventListener("resize", recompute); clearTimeout(t); };
  }, []);
  const go = (dir) => { const el = scroller.current; if (!el) return; el.scrollLeft = el.scrollLeft + dir * el.clientWidth; };
  const gap = 10; // gap-2.5
  const basis = `calc((100% - ${(perView - 1) * gap}px) / ${perView})`;
  const hasPager = pages > 1;

  return (
    <div className="relative">
      <div
        ref={scroller}
        className="flex gap-2.5 overflow-x-auto snap-x snap-proximity pb-0.5"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {HEALTH_METRICS.map((m) => (
          <div key={m.id} className="snap-start flex-shrink-0" style={{ flexBasis: basis }}>
            <HealthStatCard icon={m.icon} color={m.color} label={m.label} value={m.value} unit={m.unit} sub={m.sub} bars={m.bars} />
          </div>
        ))}
      </div>

      {hasPager && (
        <React.Fragment>
          <button
            onClick={() => go(-1)} aria-label="Previous"
            disabled={page <= 0}
            className="absolute -left-2 top-[42%] -translate-y-1/2 w-7 h-7 rounded-full bg-[hsl(var(--card))] border border-[hsl(var(--border))] shadow-md flex items-center justify-center text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))] disabled:opacity-0 transition-opacity z-10"
          >
            <Icons.ChevronLeft size={15} />
          </button>
          <button
            onClick={() => go(1)} aria-label="Next"
            disabled={page >= pages - 1}
            className="absolute -right-2 top-[42%] -translate-y-1/2 w-7 h-7 rounded-full bg-[hsl(var(--card))] border border-[hsl(var(--border))] shadow-md flex items-center justify-center text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))] disabled:opacity-0 transition-opacity z-10"
          >
            <Icons.ChevronRight size={15} />
          </button>
          <div className="flex justify-center gap-1.5 mt-2.5">
            {Array.from({ length: pages }).map((_, i) => (
              <button
                key={i} aria-label={`Page ${i + 1}`}
                onClick={() => { const el = scroller.current; if (el) el.scrollLeft = i * el.clientWidth; }}
                className={cn("h-1.5 rounded-full transition-all", i === page ? "w-5 bg-[hsl(var(--primary))]" : "w-1.5 bg-[hsl(var(--muted-foreground)/0.35)] hover:bg-[hsl(var(--muted-foreground)/0.6)]")}
              />
            ))}
          </div>
        </React.Fragment>
      )}
    </div>
  );
}

/* Derived recommendation chain (récupération → énergie → chronotype → créneau). */
function DayHealthSuggestion({ compact = false }) {
  return (
    <div className={cn("rounded-[12px] border border-[hsl(263_70%_60%/0.35)] bg-[hsl(263_70%_60%/0.07)]", compact ? "p-3.5" : "p-4")}>
      <div className="flex items-center gap-2 flex-wrap mb-3">
        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[hsl(142_70%_45%/0.15)] text-[hsl(142_70%_60%)]">Récupération 82</span>
        <Icons.ArrowRight size={12} className="text-[hsl(var(--muted-foreground))]" />
        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[hsl(263_70%_60%/0.15)] text-[hsl(263_70%_82%)]">Énergie ↑ ce matin</span>
        <Icons.ArrowRight size={12} className="text-[hsl(var(--muted-foreground))]" />
        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[hsl(38_92%_55%/0.15)] text-[hsl(38_92%_64%)]">Chronotype · Alouette</span>
        <Icons.ArrowRight size={12} className="text-[hsl(var(--muted-foreground))]" />
        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[hsl(217_91%_60%/0.15)] text-[hsl(217_91%_74%)]">Créneau 09:00</span>
      </div>
      <div className="flex items-start gap-3">
        <span className="w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0 gradient-violet"><Icons.Sparkles size={16} className="text-white" /></span>
        <div className="flex-1">
          <div className="text-[14px] font-bold leading-tight">Bonne récupération → place ta tâche la plus exigeante ce matin</div>
          <p className="text-[12px] text-[hsl(var(--muted-foreground))] mt-1 leading-relaxed">Ta nuit complète et ta récupération élevée poussent ton pic d'énergie tôt. DPM propose un créneau <strong className="text-[hsl(var(--foreground))]">Optimal à 09:00</strong> pour le travail profond.</p>
          <div className="mt-2.5">
            <Button size="sm" icon={Icons.ArrowRight} onClick={() => window.__dpmNavigate && window.__dpmNavigate("calendar")}>Voir le créneau</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Full snapshot used inside the settings/devices card. */
function DayHealthSnapshot() {
  return (
    <div className="mt-4 pt-4 border-t border-[hsl(var(--border))]">
      <div className="flex items-center justify-between mb-3">
        <div className="text-[11px] uppercase tracking-[0.12em] font-semibold text-[hsl(var(--muted-foreground))]">Aperçu santé du jour</div>
        <span className="px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-[hsl(142_70%_45%/0.15)] text-[hsl(142_70%_60%)] inline-flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[hsl(142_70%_55%)]" />sync il y a 4 min
        </span>
      </div>
      <DayHealthCarousel perView={2} />
      <div className="mt-3"><DayHealthSuggestion /></div>
    </div>
  );
}

/* ============================================================
   UNIFIED HEALTH + SLEEP WIDGET
   Merges "Santé du jour" (vitals) and "Sommeil & chronotype" into ONE
   browsable widget: a period selector (Jour/Semaine/Mois/Année) reshapes the
   data, and a panel carousel lets you swipe between Vitals → Sommeil →
   Chronotype, with a persistent recommendation footer.
============================================================ */
const HS_PERIODS = [
  { id: "day",   label: "Jour" },
  { id: "week",  label: "Semaine" },
  { id: "month", label: "Mois" },
  { id: "year",  label: "Année" },
];
const hsFmtMin = (m) => `${Math.floor(m / 60)}h${String(m % 60).padStart(2, "0")}`;

const HS_DATA = {
  day: {
    range: "Aujourd'hui · sync il y a 4 min",
    vitals: [
      { id: "sleep",    icon: Icons.Moon,  color: "263 70% 70%", label: "Sommeil",        value: "7 h 24",          sub: { color: "142 70% 60%", text: "Qualité bonne · +38 min" }, bars: [60, 45, 70, 55, 50, 80, 90] },
      { id: "hr",       icon: Icons.Flame, color: "0 84% 68%",   label: "FC repos",       value: "58", unit: "bpm",  sub: { color: "142 70% 60%", text: "Stable · normal" },        bars: [50, 55, 48, 52, 46, 50, 48] },
      { id: "steps",    icon: Icons.Zap,   color: "217 91% 72%", label: "Activité · pas", value: "6 240",           sub: { color: "38 92% 62%",  text: "62 % de l'objectif" },      bars: [30, 55, 40, 75, 60, 45, 62] },
      { id: "recovery", icon: Icons.Clock, color: "142 70% 62%", label: "Récupération",   value: "82", unit: "/100", sub: { color: "142 70% 60%", text: "Élevée · prêt" },           bars: [55, 60, 50, 65, 70, 75, 82] },
    ],
    sleep: { duration: "7h24", durSub: "recommandé : 7–9h", regularity: "± 41 min", quality: "3.7", qEmoji: "😄", qSub: "nuit du jour" },
    barsLabel: "7 dernières nuits",
    bars: [{ l: "LUN", m: 435, q: 4 }, { l: "MAR", m: 435, q: 3 }, { l: "MER", m: 350, q: 2 }, { l: "JEU", m: 455, q: 4 }, { l: "VEN", m: 415, q: 3 }, { l: "SAM", m: 440, q: 5 }, { l: "DIM", m: 435, q: 4 }],
    chrono: { name: "Alouette", desc: "Pic d'énergie le matin, creux en début d'après-midi · profil basé sur 7 nuits & 7 jours de prises d'énergie" },
    insight: <>Les nuits sous 6h, ton pic d'énergie arrive <span className="font-semibold">~90 min plus tard</span> et reste plus bas toute la journée. Garde le matin pour l'administratif ces jours-là.</>,
    suggestion: "Mercredi tu as dormi 5h50 — allège ta matinée et place la tâche difficile à 14h, pas 9h.",
    chain: ["Récupération 82", "Énergie ↑ ce matin", "Chronotype · Alouette", "Créneau 09:00"],
    headline: "Bonne récupération → place ta tâche la plus exigeante ce matin",
    detail: <>Ta nuit complète et ta récupération élevée poussent ton pic d'énergie tôt. DPM propose un créneau <strong className="text-[hsl(var(--foreground))]">Optimal à 09:00</strong> pour le travail profond.</>,
  },
  week: {
    range: "7 derniers jours",
    vitals: [
      { id: "sleep",    icon: Icons.Moon,  color: "263 70% 70%", label: "Sommeil",        value: "7 h 04",          sub: { color: "var(--muted-foreground)", text: "moy. / nuit" },     bars: [70, 70, 55, 75, 65, 72, 70] },
      { id: "hr",       icon: Icons.Flame, color: "0 84% 68%",   label: "FC repos",       value: "56", unit: "bpm",  sub: { color: "142 70% 60%", text: "−2 vs sem. préc." },          bars: [54, 56, 55, 57, 56, 55, 56] },
      { id: "steps",    icon: Icons.Zap,   color: "217 91% 72%", label: "Activité · pas", value: "7 850",           sub: { color: "38 92% 62%",  text: "78 % de l'objectif" },          bars: [60, 70, 55, 85, 75, 50, 40] },
      { id: "recovery", icon: Icons.Clock, color: "142 70% 62%", label: "Récupération",   value: "76", unit: "/100", sub: { color: "142 70% 60%", text: "Bonne · moy." },               bars: [70, 72, 68, 75, 80, 74, 76] },
    ],
    sleep: { duration: "7h04", durSub: "moy. sur 7 nuits", regularity: "± 41 min", quality: "3.7", qEmoji: "😄", qSub: "7 nuits sur 7" },
    barsLabel: "Durées récentes",
    bars: [{ l: "LUN", m: 435, q: 4 }, { l: "MAR", m: 435, q: 3 }, { l: "MER", m: 350, q: 2 }, { l: "JEU", m: 455, q: 4 }, { l: "VEN", m: 415, q: 3 }, { l: "SAM", m: 440, q: 5 }, { l: "DIM", m: 435, q: 4 }],
    chrono: { name: "Alouette", desc: "Pic d'énergie le matin, creux en début d'après-midi · profil basé sur 7 nuits & 7 jours" },
    insight: <>Cette semaine, tes nuits sous 6h ont décalé ton pic d'énergie de <span className="font-semibold">~90 min</span>. Tes meilleurs jours (SAM, JEU) suivent tes nuits ≥ 7h.</>,
    suggestion: "Mercredi tu as dormi 5h50 — allège ta matinée et place la tâche difficile à 14h, pas 9h.",
    chain: ["Récup. moy. 76", "Énergie matinale", "Chronotype · Alouette", "Bloc focus matin"],
    headline: "Semaine régulière → protège tes matinées pour le travail profond",
    detail: <>Ta régularité de coucher (± 41 min) soutient une énergie stable le matin. DPM suggère de réserver <strong className="text-[hsl(var(--foreground))]">9:00–11:00</strong> en focus les jours bien dormis.</>,
  },
  month: {
    range: "30 derniers jours",
    vitals: [
      { id: "sleep",    icon: Icons.Moon,  color: "263 70% 70%", label: "Sommeil",        value: "7 h 09",          sub: { color: "var(--muted-foreground)", text: "moy. / nuit" },   bars: [68, 64, 70, 66, 0, 0, 0] },
      { id: "hr",       icon: Icons.Flame, color: "0 84% 68%",   label: "FC repos",       value: "57", unit: "bpm",  sub: { color: "142 70% 60%", text: "Stable sur le mois" },       bars: [56, 57, 55, 58, 0, 0, 0] },
      { id: "steps",    icon: Icons.Zap,   color: "217 91% 72%", label: "Activité · pas", value: "8 120",           sub: { color: "38 92% 62%",  text: "81 % de l'objectif" },         bars: [70, 75, 60, 80, 0, 0, 0] },
      { id: "recovery", icon: Icons.Clock, color: "142 70% 62%", label: "Récupération",   value: "74", unit: "/100", sub: { color: "142 70% 60%", text: "Bonne · moy." },              bars: [72, 70, 76, 74, 0, 0, 0] },
    ],
    sleep: { duration: "7h09", durSub: "moy. sur 30 nuits", regularity: "± 48 min", quality: "3.6", qEmoji: "🙂", qSub: "28 nuits notées" },
    barsLabel: "Moyenne par semaine",
    bars: [{ l: "S1", m: 430, q: 4 }, { l: "S2", m: 410, q: 3 }, { l: "S3", m: 440, q: 4 }, { l: "S4", m: 425, q: 4 }],
    chrono: { name: "Alouette", desc: "Profil stable sur le mois · pic matinal confirmé sur 28 nuits & 30 jours d'énergie" },
    insight: <>Sur le mois, ta régularité s'est dégradée en S2 (± 48 min). Les semaines les plus régulières montrent <span className="font-semibold">+11 % d'énergie</span> en après-midi.</>,
    suggestion: "Vise un coucher dans une fenêtre de 30 min — c'est ton meilleur levier énergie ce mois-ci.",
    chain: ["Récup. moy. 74", "Régularité à travailler", "Chronotype · Alouette", "Routine du soir"],
    headline: "Mois solide → resserre ta fenêtre de coucher",
    detail: <>Ta durée moyenne est bonne mais ta régularité varie. DPM peut <strong className="text-[hsl(var(--foreground))]">bloquer un rappel coucher</strong> pour stabiliser ton énergie.</>,
  },
  year: {
    range: "12 derniers mois",
    vitals: [
      { id: "sleep",    icon: Icons.Moon,  color: "263 70% 70%", label: "Sommeil",        value: "7 h 12",          sub: { color: "var(--muted-foreground)", text: "moy. / nuit" },   bars: [60, 62, 64, 66, 68, 70, 72, 71, 69, 66, 64, 65] },
      { id: "hr",       icon: Icons.Flame, color: "0 84% 68%",   label: "FC repos",       value: "57", unit: "bpm",  sub: { color: "142 70% 60%", text: "Tendance stable" },           bars: [58, 57, 57, 56, 56, 55, 55, 56, 57, 57, 56, 57] },
      { id: "steps",    icon: Icons.Zap,   color: "217 91% 72%", label: "Activité · pas", value: "7 600",           sub: { color: "38 92% 62%",  text: "76 % de l'objectif" },         bars: [50, 55, 60, 70, 80, 85, 88, 84, 75, 65, 55, 52] },
      { id: "recovery", icon: Icons.Clock, color: "142 70% 62%", label: "Récupération",   value: "75", unit: "/100", sub: { color: "142 70% 60%", text: "Bonne · moy." },              bars: [70, 71, 72, 74, 75, 77, 78, 76, 74, 73, 72, 75] },
    ],
    sleep: { duration: "7h12", durSub: "moy. sur l'année", regularity: "± 52 min", quality: "3.5", qEmoji: "🙂", qSub: "312 nuits notées" },
    barsLabel: "Moyenne par mois",
    bars: [{ l: "J", m: 420, q: 3 }, { l: "F", m: 415, q: 3 }, { l: "M", m: 425, q: 4 }, { l: "A", m: 435, q: 4 }, { l: "M", m: 440, q: 4 }, { l: "J", m: 445, q: 5 }, { l: "J", m: 450, q: 5 }, { l: "A", m: 448, q: 4 }, { l: "S", m: 438, q: 4 }, { l: "O", m: 432, q: 4 }, { l: "N", m: 425, q: 3 }, { l: "D", m: 428, q: 4 }],
    chrono: { name: "Alouette", desc: "Chronotype matinal confirmé sur l'année · plus marqué l'été" },
    insight: <>Tes étés sont tes meilleures saisons de sommeil (jusqu'à <span className="font-semibold">7h30</span> de moyenne). L'hiver, avance ton coucher de 20 min pour compenser.</>,
    suggestion: "Sur l'année, tes blocs focus matinaux ont le meilleur taux de complétion — continue de les protéger.",
    chain: ["Récup. an 75", "Saisonnalité", "Chronotype · Alouette", "Focus matinal"],
    headline: "Année cohérente → ton matin reste ton moment fort",
    detail: <>Ton énergie suit ton sommeil de près sur l'année. DPM garde tes <strong className="text-[hsl(var(--foreground))]">créneaux profonds le matin</strong> par défaut.</>,
  },
};

/* Sleep tile (compact) used inside the Sommeil panel. */
function HSSleepStat({ label, value, sub, highlighted }) {
  return (
    <div className={cn(
      "rounded-[12px] border p-3.5 flex flex-col gap-1 h-full",
      highlighted
        ? "border-[hsl(263_70%_60%/0.4)] bg-gradient-to-br from-[hsl(263_70%_25%/0.35)] to-[hsl(263_70%_15%/0.15)]"
        : "border-[hsl(var(--border))] bg-[hsl(var(--muted)/0.25)]"
    )}>
      <div className="text-[10px] uppercase tracking-wider font-semibold flex items-center gap-1.5" style={{ color: highlighted ? "hsl(263 70% 80%)" : "hsl(var(--muted-foreground))" }}>
        {highlighted && <Icons.Star size={9} />}{label}
      </div>
      <div className={cn("text-[22px] font-bold tabular-nums leading-none", highlighted && "text-[hsl(263_70%_85%)]")}>{value}</div>
      <div className="text-[10.5px] text-[hsl(var(--muted-foreground))] mt-0.5 leading-snug">{sub}</div>
    </div>
  );
}

function HealthSleepWidget({ onSeeDetails, period = "week" }) {
  const [state] = useDevices();
  const connected = Object.keys(state.connected || {}).some((k) => state.connected[k]);
  // Period is CONTROLLED by the parent (e.g. the Analytics dashboard's top range
  // menu). Map its 5-value range onto our datasets; quarter reuses the year
  // profile with a 3-month framing.
  const periodKey = { today: "day", day: "day", week: "week", month: "month", quarter: "quarter", year: "year" }[period] || "week";
  const d = periodKey === "quarter"
    ? { ...HS_DATA.year, range: "3 derniers mois", barsLabel: "Moyenne par mois", bars: HS_DATA.year.bars.slice(-3) }
    : (HS_DATA[periodKey] || HS_DATA.week);

  // Panel carousel
  const PANELS = ["Vitaux", "Sommeil", "Chronotype"];
  const [panel, setPanel] = useState(0);
  const scroller = React.useRef(null);
  const goPanel = (i) => {
    const el = scroller.current; if (!el) return;
    const clamped = Math.max(0, Math.min(PANELS.length - 1, i));
    el.scrollLeft = clamped * el.clientWidth;
    setPanel(clamped);
  };
  const onScroll = () => { const el = scroller.current; if (!el) return; setPanel(Math.round(el.scrollLeft / el.clientWidth)); };
  // Keep the active panel in view when the period changes (no horizontal jump).
  useEffect(() => { const el = scroller.current; if (el) el.scrollLeft = panel * el.clientWidth; }, [period]);

  const maxBar = 10 * 60; // 10h ceiling for duration bars

  return (
    <Card>
      <SectionTitle action={
        <div className="flex items-center gap-2">
          <span className="px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-[hsl(142_70%_45%/0.15)] text-[hsl(142_70%_60%)] hidden sm:inline-flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[hsl(142_70%_55%)]" />sync 4 min
          </span>
          {onSeeDetails && <button onClick={onSeeDetails} className="text-[11px] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]">Détails</button>}
        </div>
      }>
        <span className="flex items-center gap-2"><Icons.Activity size={15} className="text-[hsl(174_62%_58%)]" /> Santé &amp; sommeil</span>
      </SectionTitle>

      {!connected ? (
        <div className="text-center py-6">
          <span className="w-10 h-10 rounded-[11px] inline-flex items-center justify-center mb-2" style={{ background: "hsl(174 62% 45% / 0.14)", color: "hsl(174 62% 58%)" }}><Icons.Activity size={19} /></span>
          <div className="text-[13px] font-semibold">Aucun appareil connecté</div>
          <p className="text-[11.5px] text-[hsl(var(--muted-foreground))] mt-1 max-w-xs mx-auto leading-relaxed">Connecte Fitbit, Oura ou Google Fit dans Réglages pour voir ta santé.</p>
        </div>
      ) : (
        <React.Fragment>
          {/* Period is driven by the dashboard's top range menu — no in-widget selector. */}
          <div className="flex items-center justify-end gap-2 mb-2">
            <span className="text-[10.5px] text-[hsl(var(--muted-foreground))] tabular-nums">{d.range}</span>
          </div>

          {/* Panel tabs */}
          <div className="flex items-center gap-1 mb-2.5">
            {PANELS.map((label, i) => (
              <button key={label} onClick={() => goPanel(i)}
                className={cn("h-7 px-2.5 rounded-full text-[11px] font-semibold transition-all",
                  panel === i ? "bg-[hsl(var(--primary)/0.15)] text-[hsl(263_70%_80%)]" : "text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent)/0.4)]")}>
                {label}
              </button>
            ))}
            <div className="flex-1" />
            <button onClick={() => goPanel(panel - 1)} disabled={panel <= 0} aria-label="Précédent"
              className="w-7 h-7 rounded-full border border-[hsl(var(--border))] flex items-center justify-center hover:bg-[hsl(var(--accent))] disabled:opacity-30"><Icons.ChevronLeft size={14} /></button>
            <button onClick={() => goPanel(panel + 1)} disabled={panel >= PANELS.length - 1} aria-label="Suivant"
              className="w-7 h-7 rounded-full border border-[hsl(var(--border))] flex items-center justify-center hover:bg-[hsl(var(--accent))] disabled:opacity-30"><Icons.ChevronRight size={14} /></button>
          </div>

          {/* Carousel of panels */}
          <div ref={scroller} onScroll={onScroll}
            className="flex overflow-x-auto snap-x snap-proximity -mx-1 px-1" style={{ scrollbarWidth: "none" }}>
            {/* PANEL 1 — Vitaux */}
            <div className="snap-start flex-shrink-0 w-full pr-1">
              <div className="grid grid-cols-2 gap-2.5">
                {d.vitals.map((m) => (
                  <HealthStatCard key={m.id} icon={m.icon} color={m.color} label={m.label} value={m.value} unit={m.unit} sub={m.sub} bars={m.bars.filter(b => b > 0)} />
                ))}
              </div>
            </div>

            {/* PANEL 2 — Sommeil */}
            <div className="snap-start flex-shrink-0 w-full pr-1">
              <div className="grid grid-cols-3 gap-2.5 mb-3">
                <HSSleepStat label="Durée moyenne" value={d.sleep.duration} sub={d.sleep.durSub} />
                <HSSleepStat label="Régularité coucher" value={d.sleep.regularity} sub="plus régulier = meilleure récup" highlighted />
                <HSSleepStat label="Qualité moyenne" value={<span className="flex items-baseline gap-1">{d.sleep.quality}<span className="text-[12px] text-[hsl(var(--muted-foreground))]">/5</span><span className="text-[17px] ml-0.5">{d.sleep.qEmoji}</span></span>} sub={d.sleep.qSub} />
              </div>
              <div className="text-[10px] uppercase tracking-wider text-[hsl(var(--muted-foreground))] font-semibold mb-2">{d.barsLabel}</div>
              <div className="flex gap-1.5 items-end">
                {d.bars.map((b, i) => {
                  const fillPct = Math.min(100, (b.m / maxBar) * 100);
                  const isLight = b.m < 6 * 60;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div className="text-[9px] font-mono tabular-nums text-[hsl(var(--muted-foreground))]">{hsFmtMin(b.m)}</div>
                      <div className="w-full h-14 rounded-[4px] relative overflow-hidden bg-[hsl(var(--muted)/0.25)]">
                        <div className="absolute bottom-0 left-0 right-0 rounded-[4px]" style={{ height: `${fillPct}%`, background: isLight ? "linear-gradient(180deg, hsl(20 90% 55% / 0.85), hsl(20 90% 45% / 0.85))" : "linear-gradient(180deg, hsl(263 70% 65%), hsl(263 70% 45%))" }} />
                      </div>
                      <div className="text-[9.5px] font-semibold uppercase text-[hsl(var(--muted-foreground))]">{b.l}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* PANEL 3 — Chronotype */}
            <div className="snap-start flex-shrink-0 w-full pr-1">
              <div className="rounded-[12px] border border-[hsl(var(--border))] bg-[hsl(var(--muted)/0.25)] overflow-hidden h-full">
                <div className="px-4 py-3 flex items-center gap-3 border-b border-[hsl(var(--border))]">
                  <div className="w-9 h-9 rounded-[10px] bg-[hsl(38_92%_55%/0.15)] text-[hsl(38_92%_60%)] flex items-center justify-center flex-shrink-0 text-[20px]">🐦</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-semibold leading-tight">Chronotype — {d.chrono.name}</div>
                    <div className="text-[11px] text-[hsl(var(--muted-foreground))] mt-0.5">{d.chrono.desc}</div>
                  </div>
                </div>
                <div className="px-4 py-3 flex items-start gap-3 bg-[hsl(263_70%_45%/0.06)]">
                  <Icons.Sparkles size={12} className="text-[hsl(263_70%_75%)] mt-0.5 flex-shrink-0" />
                  <div className="flex-1 text-[12.5px] leading-relaxed" style={{ textWrap: "pretty" }}>
                    <span className="font-semibold text-[hsl(263_70%_85%)]">Insight :</span> {d.insight}
                  </div>
                </div>
                <div className="px-4 py-3 flex items-start gap-3 border-t border-[hsl(var(--border))]">
                  <div className="w-0.5 self-stretch rounded-full bg-[hsl(263_70%_60%)] flex-shrink-0 min-h-[28px]" />
                  <div className="flex-1 min-w-0">
                    <div className="text-[12.5px] leading-relaxed" style={{ textWrap: "pretty" }}><span className="font-semibold">Suggestion : </span>{d.suggestion}</div>
                    <div className="mt-1.5 inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10.5px] text-[hsl(var(--muted-foreground))] bg-[hsl(var(--muted)/0.5)]">
                      <Icons.Book size={9} className="opacity-70" /><em className="not-italic font-medium text-[hsl(var(--foreground))]">Why We Sleep</em><span className="opacity-70">·</span><span>Matthew Walker</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" icon={Icons.Refresh}>Re-plan</Button>
                </div>
              </div>
            </div>
          </div>

          {/* Persistent recommendation footer (period-aware) */}
          <div className="rounded-[12px] border border-[hsl(263_70%_60%/0.35)] bg-[hsl(263_70%_60%/0.07)] p-4 mt-3">
            <div className="flex items-center gap-2 flex-wrap mb-3">
              {d.chain.map((c, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <Icons.ArrowRight size={12} className="text-[hsl(var(--muted-foreground))]" />}
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold" style={{ background: ["hsl(142 70% 45% / 0.15)", "hsl(263 70% 60% / 0.15)", "hsl(38 92% 55% / 0.15)", "hsl(217 91% 60% / 0.15)"][i % 4], color: ["hsl(142 70% 60%)", "hsl(263 70% 82%)", "hsl(38 92% 64%)", "hsl(217 91% 74%)"][i % 4] }}>{c}</span>
                </React.Fragment>
              ))}
            </div>
            <div className="flex items-start gap-3">
              <span className="w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0 gradient-violet"><Icons.Sparkles size={16} className="text-white" /></span>
              <div className="flex-1">
                <div className="text-[14px] font-bold leading-tight">{d.headline}</div>
                <p className="text-[12px] text-[hsl(var(--muted-foreground))] mt-1 leading-relaxed">{d.detail}</p>
                <div className="mt-2.5">
                  <Button size="sm" icon={Icons.ArrowRight} onClick={() => window.__dpmNavigate && window.__dpmNavigate("calendar")}>Voir le créneau</Button>
                </div>
              </div>
            </div>
          </div>
        </React.Fragment>
      )}
    </Card>
  );
}

/* Home widget — surfaces the day's health (carousel + one suggestion) right on
   the home screen since it's daily data. Gated on a connected device. */
function HomeHealthCard({ onSeeDetails }) {
  const [state] = useDevices();
  const connected = Object.keys(state.connected || {}).some((k) => state.connected[k]);
  return (
    <Card>
      <SectionTitle action={
        <span className="inline-flex items-center gap-2">
          <span className="px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-[hsl(142_70%_45%/0.15)] text-[hsl(142_70%_60%)] inline-flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[hsl(142_70%_55%)]" />sync 4 min
          </span>
          <button onClick={onSeeDetails} className="text-[11px] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]">Détails</button>
        </span>
      }>
        <span className="flex items-center gap-2"><Icons.Activity size={15} className="text-[hsl(174_62%_58%)]" /> Santé du jour</span>
      </SectionTitle>
      {connected ? (
        <React.Fragment>
          <DayHealthCarousel perView={2} />
          <div className="mt-3"><DayHealthSuggestion compact /></div>
        </React.Fragment>
      ) : (
        <div className="text-center py-6">
          <span className="w-10 h-10 rounded-[11px] inline-flex items-center justify-center mb-2" style={{ background: "hsl(174 62% 45% / 0.14)", color: "hsl(174 62% 58%)" }}><Icons.Activity size={19} /></span>
          <div className="text-[13px] font-semibold">Aucun appareil connecté</div>
          <p className="text-[11.5px] text-[hsl(var(--muted-foreground))] mt-1 max-w-xs mx-auto leading-relaxed">Connecte Fitbit, Oura ou Google Fit dans Réglages pour voir ta santé du jour.</p>
        </div>
      )}
    </Card>
  );
}

/* ---------- main settings card ---------- */
function DevicesSettingsCard() {
  const [state, ops] = useDevices();
  const [consent, setConsent] = useState(null); // device awaiting consent
  const [note, setNote] = useState({});         // transient per-row notes

  const connectedIds = Object.keys(state.connected || {}).filter((k) => state.connected[k]);
  const anyConnected = connectedIds.length > 0;

  const flash = (id, text) => {
    setNote((n) => ({ ...n, [id]: text }));
    setTimeout(() => setNote((n) => { const m = { ...n }; delete m[id]; return m; }), 3000);
  };

  return (
    <Card data-tour="feat-settings-devices">
      <SectionTitle>
        <span className="flex items-center gap-2"><Icons.Activity size={15} className="text-[hsl(174_62%_58%)]" /> Santé &amp; appareils</span>
      </SectionTitle>

      <div className="flex items-center gap-3 text-[10.5px] text-[hsl(var(--muted-foreground))] mb-3 flex-wrap">
        <span className="inline-flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[hsl(174_62%_50%)]" />Web</span>
        <span className="inline-flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[hsl(38_92%_55%)]" />App mobile</span>
        <span className="inline-flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[hsl(263_70%_65%)]" />Partenaire</span>
      </div>

      <div className="space-y-2">
        {DEVICE_CATALOG.map((d) => {
          const isConn = !!(state.connected && state.connected[d.id]);
          const isReq = !!(state.requested && state.requested[d.id]);
          let rowStyle = {};
          if (isConn) rowStyle = { borderColor: "hsl(174 62% 45% / 0.4)", background: "hsl(174 62% 35% / 0.06)" };

          let badge = null, action = null;
          if (d.mode === "web" && isConn) {
            badge = <Badge variant="success" dot>Connecté</Badge>;
            action = <Button variant="outline" size="sm" onClick={() => { ops.disconnect(d.id); flash(d.id, "Déconnecté · données importées effacées."); }}>Déconnecter</Button>;
          } else if (d.mode === "web") {
            badge = <span className="px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-[hsl(174_62%_45%/0.15)] text-[hsl(174_62%_58%)]">Connectable web</span>;
            action = <Button size="sm" onClick={() => setConsent(d)}>Connecter</Button>;
          } else if (d.mode === "mobile") {
            badge = <span className="px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-[hsl(38_92%_55%/0.15)] text-[hsl(38_92%_62%)]">Via app mobile</span>;
            action = <Button variant="outline" size="sm" onClick={() => flash(d.id, "Ouvre l'app DPM sur ton téléphone pour connecter via HealthKit.")}>Ouvrir l'app</Button>;
          } else if (d.mode === "partner") {
            badge = isReq
              ? <Badge variant="success" dot>Demande envoyée</Badge>
              : <span className="px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-[hsl(263_70%_60%/0.15)] text-[hsl(263_70%_80%)]">API partenaire</span>;
            action = isReq
              ? <Button variant="outline" size="sm" disabled>En attente</Button>
              : <Button variant="outline" size="sm" onClick={() => ops.request(d.id)}>Demander</Button>;
          }

          return (
            <div key={d.id} className="rounded-[10px] border border-[hsl(var(--border))] p-3" style={rowStyle}>
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-[8px] flex items-center justify-center flex-shrink-0 text-[12.5px] font-bold"
                  style={{ background: `hsl(${d.color} / 0.18)`, color: `hsl(${d.color})` }}>{d.letter}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-[13.5px] font-semibold flex items-center gap-2 flex-wrap">{d.name}{badge}</div>
                  <div className="text-[11.5px] text-[hsl(var(--muted-foreground))] mt-0.5">
                    {isConn ? <>Fournit : {d.provides.join(" · ")} · sync il y a 4 min</> : <>Fournit : {d.provides.join(" · ")}</>}
                  </div>
                </div>
                <div className="flex-shrink-0">{action}</div>
              </div>
              {note[d.id] && (
                <div className="mt-2 text-[11px] text-[hsl(38_92%_64%)] flex items-center gap-1.5 anim-fade-in">
                  <Icons.AlertTriangle size={11} /> {note[d.id]}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Today's synced stats + derived suggestion */}
      {anyConnected ? (
        <DayHealthSnapshot />
      ) : (
        <div className="mt-4 pt-4 border-t border-[hsl(var(--border))] text-center py-6">
          <span className="w-10 h-10 rounded-[11px] inline-flex items-center justify-center mb-2" style={{ background: "hsl(174 62% 45% / 0.14)", color: "hsl(174 62% 58%)" }}><Icons.Activity size={19} /></span>
          <div className="text-[13px] font-semibold">Aucun appareil connecté</div>
          <p className="text-[11.5px] text-[hsl(var(--muted-foreground))] mt-1 max-w-xs mx-auto leading-relaxed">Connecte Fitbit, Oura ou Google Fit pour nourrir ton énergie et tes suggestions de créneaux.</p>
        </div>
      )}

      {/* Privacy note */}
      <div className="rounded-[12px] border border-[hsl(263_70%_60%/0.4)] bg-[hsl(263_70%_30%/0.12)] p-3.5 mt-4 flex items-start gap-3">
        <span className="w-8 h-8 rounded-[9px] flex items-center justify-center flex-shrink-0" style={{ background: "hsl(263 70% 60% / 0.18)", color: "hsl(263 70% 80%)" }}><Icons.Lock size={15} /></span>
        <div className="text-[12px] leading-relaxed">
          <strong className="text-[hsl(263_70%_85%)]">Santé = la donnée la plus sensible.</strong>
          <span className="text-[hsl(var(--muted-foreground))]"> Connexion opt-in, scopes minimaux en lecture seule, jamais partagée, révocation facile. Conforme Loi 25 / PIPEDA / RGPD.</span>
        </div>
      </div>

      <DeviceConsentModal open={!!consent} device={consent} onClose={() => setConsent(null)} onAuthorize={() => consent && ops.connect(consent.id)} />
    </Card>
  );
}

if (typeof window !== "undefined") Object.assign(window, { DevicesSettingsCard, DayHealthCarousel, DayHealthSnapshot, HomeHealthCard, HealthSleepWidget });
