/* global React, useState, useEffect, useRef, cn, Icons, Ring, useCountUp, useInView, useInViewOnce, window */
/* ============================================================
   LANDING — interactive demos (energy, AI, stats, customize, resources)
============================================================ */

/* ---------- Energy & chronotype: tap to teach your rhythm ---------- */
function EnergyDemo({ t }) {
  const e = t.energy;
  const [levels, setLevels] = useState([1, 2, 3, 2, 1, 0]); // 0..3 per time slot
  const [ref, seen] = useInView(0.3);                       // re-arms: bars grow on entry, reset on exit
  const cycle = (i) => setLevels((ls) => ls.map((v, k) => (k === i ? (v + 1) % 4 : v)));
  // peak slot (highest level; earliest on tie)
  const peak = levels.reduce((best, v, i) => (v > levels[best] ? i : best), 0);
  const tones = ["215 16% 55%", "217 70% 58%", "263 70% 60%", "142 70% 50%"];

  return (
    <div ref={ref} className="rounded-[12px] border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-4">
      <div className="flex items-center gap-2 mb-4">
        <Icons.Activity size={15} className="text-[hsl(var(--primary))]" />
        <span className="text-[13px] font-semibold tracking-tight">{e.tag}</span>
      </div>
      <div className="grid grid-cols-6 gap-2 h-[132px] items-end">
        {levels.map((v, i) => (
          <button key={i} onClick={() => cycle(i)} className="h-full flex flex-col justify-end items-center gap-1 group">
            <div className="w-full rounded-[6px] transition-all duration-500 ease-out group-hover:opacity-90 origin-bottom"
              style={{ height: seen ? `${((v + 1) / 4) * 100}%` : "0%", transitionDelay: `${i * 55}ms`, background: `hsl(${tones[v]} / ${i === peak ? 1 : 0.55})`, boxShadow: i === peak ? `0 0 0 1px hsl(${tones[v]})` : "none" }} />
            <span className="text-[9.5px] font-mono text-[hsl(var(--muted-foreground))]">{e.times[i]}</span>
          </button>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-2 rounded-[8px] border border-[hsl(var(--primary)/0.3)] bg-[hsl(var(--primary)/0.06)] px-3 py-2">
        <Icons.Sparkles size={13} className="text-[hsl(var(--primary))] flex-shrink-0" />
        <span className="text-[12px]"><span className="text-[hsl(var(--muted-foreground))]">{e.ai}</span><span className="font-semibold">{e.times[peak]}</span></span>
      </div>
    </div>
  );
}

/* ---------- Contextual AI: suggestion you accept in one click ---------- */
function AISuggestionDemo({ t }) {
  const a = t.ai;
  const [state, setState] = useState("idle"); // idle | thinking | applied
  const accept = () => { setState("thinking"); setTimeout(() => setState("applied"), 900); };
  const reset = () => setState("idle");

  return (
    <div className="rounded-[12px] border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="w-7 h-7 rounded-[8px] gradient-violet flex items-center justify-center flex-shrink-0">
          <Icons.Brain size={15} className="text-white" />
        </span>
        <div>
          <div className="text-[12.5px] font-semibold">DPM AI</div>
          <div className="text-[10px] text-[hsl(var(--muted-foreground))] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[hsl(142_70%_50%)] lp-pulse" /> online
          </div>
        </div>
      </div>

      <div className={cn("relative rounded-[10px] border p-3 overflow-hidden transition-colors",
        state === "applied" ? "border-[hsl(142_70%_50%/0.4)] bg-[hsl(142_70%_50%/0.07)]" : "border-[hsl(var(--primary)/0.3)] bg-[hsl(var(--primary)/0.05)]")}>
        {state === "thinking" && <div className="lp-sweep absolute inset-0" />}
        <div className="relative text-[13px] leading-relaxed">
          {state === "thinking" ? <span className="text-[hsl(var(--muted-foreground))] font-mono text-[12px]">{a.thinking}</span> : a.suggestion}
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2">
        {state === "applied" ? (
          <>
            <span className="h-9 px-3 rounded-[8px] bg-[hsl(142_70%_45%/0.15)] text-[hsl(142_70%_55%)] text-[13px] font-medium flex items-center gap-1.5">
              <Icons.Check size={14} stroke={3} /> {a.applied}
            </span>
            <button onClick={reset} className="text-[12px] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] px-2">↻</button>
          </>
        ) : (
          <>
            <button onClick={accept} disabled={state === "thinking"}
              className="h-9 px-4 rounded-[8px] bg-[hsl(var(--primary))] text-white text-[13px] font-medium hover:bg-[hsl(var(--primary)/0.9)] transition-colors disabled:opacity-60">
              {a.accept}
            </button>
            <button onClick={reset} disabled={state === "thinking"}
              className="h-9 px-4 rounded-[8px] border border-[hsl(var(--border))] text-[13px] font-medium text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))] transition-colors">
              {a.dismiss}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* ---------- Analytics: donut + count-up + focus-hour bars ---------- */
function StatBar({ label, v, c, seen, i }) {
  const pct = useCountUp(v, seen, 1200 + i * 120);
  return (
    <div>
      <div className="flex items-center justify-between text-[11.5px] mb-1">
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ background: `hsl(${c})` }} />{label}</span>
        <span className="font-mono tabular-nums text-[hsl(var(--muted-foreground))]">{Math.round(pct)}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-[hsl(var(--muted))] overflow-hidden">
        <div className="h-full rounded-full transition-[width] duration-700" style={{ width: `${pct}%`, background: `hsl(${c})` }} />
      </div>
    </div>
  );
}

function StatsDemo({ t }) {
  const s = t.stats2;
  const [ref, seen] = useInViewOnce(0.35);
  const total = s.breakdown.reduce((a, b) => a + b.v, 0);
  const grow = useCountUp(1, seen, 1100); // 0→1 sweep that draws the donut
  const maxAngle = grow * 360;
  let acc = 0;
  const parts = s.breakdown.map((b) => {
    const start = (acc / total) * 360; acc += b.v;
    const end = (acc / total) * 360;
    return `hsl(${b.c}) ${Math.min(start, maxAngle)}deg ${Math.min(end, maxAngle)}deg`;
  });
  const segs = parts.join(", ") + `, hsl(var(--muted) / 0.4) ${maxAngle}deg 360deg`;
  const score = useCountUp(8.6, seen, 1400);
  const hrs = [4, 6, 3, 7, 5, 2, 6];

  return (
    <div ref={ref} className="rounded-[12px] border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-4">
      <div className="grid grid-cols-2 gap-4 items-center">
        <div className="relative w-[128px] h-[128px] mx-auto rounded-full" style={{ background: `conic-gradient(${segs})` }}>
          <div className="absolute inset-[18px] rounded-full bg-[hsl(var(--background))] flex flex-col items-center justify-center">
            <div className="text-[22px] font-bold tabular-nums leading-none">{score.toFixed(1)}</div>
            <div className="text-[9px] uppercase tracking-wide text-[hsl(var(--muted-foreground))] mt-1 text-center px-2">{s.score}</div>
          </div>
        </div>
        <div className="space-y-2">
          {s.breakdown.map((b, i) => (
            <StatBar key={i} label={b.label} v={b.v} c={b.c} seen={seen} i={i} />
          ))}
        </div>
      </div>
      <div className="mt-4 pt-3 border-t border-[hsl(var(--border))]">
        <div className="text-[10.5px] uppercase tracking-wide text-[hsl(var(--muted-foreground))] mb-2 font-mono">{s.hours}</div>
        <div className="flex items-end gap-1.5 h-12">
          {hrs.map((v, i) => (
            <div key={i} className="flex-1 rounded-t-[3px] bg-[hsl(var(--primary)/0.65)] transition-all duration-700"
              style={{ height: seen ? `${(v / 7) * 100}%` : "0%", transitionDelay: `${i * 60}ms` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- Live customizer: pick an accent → page recolors ---------- */
const LP_ACCENTS = [
  { name: "Violet", triple: "263 70% 60%" },
  { name: "Blue", triple: "217 91% 60%" },
  { name: "Emerald", triple: "152 65% 45%" },
  { name: "Amber", triple: "33 92% 52%" },
  { name: "Rose", triple: "342 80% 60%" },
  { name: "Cyan", triple: "190 85% 48%" },
];
function ColorCustomizerDemo({ t, accent, setAccent, theme, setTheme }) {
  const c = t.customize;
  return (
    <div className="rounded-[12px] border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-4">
      <div className="text-[10.5px] uppercase tracking-wide text-[hsl(var(--muted-foreground))] font-mono mb-2.5">{c.accent}</div>
      <div className="flex flex-wrap gap-2 mb-5">
        {LP_ACCENTS.map((a) => {
          const on = accent === a.triple;
          return (
            <button key={a.triple} onClick={() => setAccent(a.triple)} title={a.name}
              className={cn("w-9 h-9 rounded-full flex items-center justify-center transition-transform",
                on ? "ring-2 ring-offset-2 ring-offset-[hsl(var(--background))] ring-[hsl(var(--foreground))] scale-105" : "hover:scale-110")}
              style={{ background: `hsl(${a.triple})` }}>
              {on && <Icons.Check size={16} stroke={3} className="text-white" />}
            </button>
          );
        })}
      </div>

      <div className="text-[10.5px] uppercase tracking-wide text-[hsl(var(--muted-foreground))] font-mono mb-2.5">{c.appearance}</div>
      <div className="inline-flex items-center gap-0.5 rounded-[10px] border border-[hsl(var(--border))] bg-[hsl(var(--muted)/0.4)] p-0.5 mb-5">
        {[{ v: "light", icon: Icons.Sun, label: c.light }, { v: "dark", icon: Icons.Moon, label: c.dark }].map((o) => (
          <button key={o.v} onClick={() => setTheme(o.v)}
            className={cn("px-3 h-8 text-[12.5px] font-medium rounded-[8px] flex items-center gap-1.5 transition-all",
              theme === o.v ? "bg-[hsl(var(--card))] text-[hsl(var(--foreground))] shadow-sm" : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]")}>
            <o.icon size={14} /> {o.label}
          </button>
        ))}
      </div>

      {/* live preview chips */}
      <div className="rounded-[10px] border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-3 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[12px] font-medium">Preview</span>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[hsl(var(--primary)/0.14)] text-[hsl(var(--primary))]">Live</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-8 px-3 rounded-[8px] bg-[hsl(var(--primary))] text-white text-[12px] font-medium flex items-center">Primary</span>
          <span className="h-8 w-8 rounded-[8px] border-2 border-[hsl(var(--primary))] flex items-center justify-center"><Icons.Heart size={14} className="text-[hsl(var(--primary))]" /></span>
          <div className="flex-1 h-1.5 rounded-full bg-[hsl(var(--muted))] overflow-hidden"><div className="h-full w-2/3 rounded-full bg-[hsl(var(--primary))]" /></div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Resources & tutorials: video walkthroughs ---------- */
function ResourcesDemo({ t }) {
  const r = t.resources;
  const [playing, setPlaying] = useState(null);
  return (
    <div className="grid sm:grid-cols-3 gap-4">
      {r.videos.map((v, i) => (
        <div key={i} className="rounded-[12px] border border-[hsl(var(--border))] bg-[hsl(var(--card))] overflow-hidden group">
          <button onClick={() => setPlaying(playing === i ? null : i)} className="relative block w-full striped aspect-video">
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="w-11 h-11 rounded-full bg-[hsl(var(--background)/0.85)] backdrop-blur border border-[hsl(var(--border))] flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                {playing === i ? <Icons.Pause size={16} className="text-[hsl(var(--primary))]" /> : <Icons.Play size={16} className="text-[hsl(var(--primary))] ml-0.5" />}
              </span>
            </span>
            <span className="absolute bottom-2 right-2 text-[10px] font-mono px-1.5 py-0.5 rounded bg-[hsl(var(--background)/0.8)] text-[hsl(var(--foreground))]">{v.len}</span>
            <span className="absolute top-2 left-2 text-[9px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded bg-[hsl(var(--primary)/0.85)] text-white">{v.tag}</span>
            {playing === i && <span className="absolute bottom-0 left-0 h-0.5 bg-[hsl(var(--primary))] lp-sweep" style={{ width: "40%" }} />}
          </button>
          <div className="p-3">
            <div className="text-[13px] font-medium leading-snug" style={{ textWrap: "balance" }}>{v.t}</div>
            <div className="mt-2 flex items-center gap-1.5 text-[11.5px] text-[hsl(var(--primary))] font-medium">
              <Icons.PlayCircle size={13} /> {r.watch}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

Object.assign(window, { EnergyDemo, AISuggestionDemo, StatsDemo, ColorCustomizerDemo, ResourcesDemo, LP_ACCENTS });
