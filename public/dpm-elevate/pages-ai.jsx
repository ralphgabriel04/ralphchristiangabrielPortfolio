/* global React, useState, useEffect, cn, Icons, Button, Card, Badge, ProgressBar */

/* ============================================================
   AI PLANNING PREVIEW  (/ai-planning)
   The AI doesn't just suggest — it EXPLAINS. Every proposed change shows
   what moves, why (the constraints it used), the impact on the day, a
   confidence score and alternatives. Accept / reject / modify each, or
   apply all — with undo. FRONT-END ONLY: suggestions are mock, generated
   from a small heuristic over a mock day.
============================================================ */

const AI_SCENARIOS = [
  { id: "day", label: "Plan my day", icon: Icons.Sun },
  { id: "week", label: "Plan my week", icon: Icons.Calendar },
  { id: "conflict", label: "Replan after conflict", icon: Icons.AlertTriangle },
  { id: "overload", label: "Day too full", icon: Icons.Activity },
];

const REASON_ICON = {
  energy: Icons.Zap, duration: Icons.Clock, deadline: Icons.Flame,
  conflict: Icons.Check, focus: Icons.Shield, load: Icons.Activity, gap: Icons.Calendar,
};

function makeSuggestions(scenario) {
  const base = [
    {
      id: "s1", title: "Review PR #142", type: "task",
      from: "Unscheduled", to: "09:30 → 10:15", confidence: 92,
      reasons: [
        { k: "energy", t: "High morning energy — ideal for focused review" },
        { k: "duration", t: "Estimated 45 min from past PRs" },
        { k: "deadline", t: "Due today" },
        { k: "conflict", t: "No conflict in this window" },
      ],
      impact: "Frees your afternoon for deep work",
      alts: ["11:00 → 11:45", "13:30 → 14:15"],
    },
    {
      id: "s2", title: "Deep work — Architecture doc", type: "focus",
      from: "15:00 → 16:00", to: "10:30 → 12:00", confidence: 78,
      reasons: [
        { k: "focus", t: "Protected focus block, no meetings" },
        { k: "energy", t: "Cognitive peak before lunch" },
        { k: "duration", t: "Extended to 90 min for momentum" },
      ],
      impact: "+30 min of uninterrupted focus",
      alts: ["09:00 → 10:30"],
    },
    {
      id: "s3", title: "Gym", type: "habit",
      from: "07:00", to: "18:00 → 19:00", confidence: 64,
      reasons: [
        { k: "load", t: "Morning is overloaded today" },
        { k: "gap", t: "Open slot after last meeting" },
      ],
      impact: "Keeps your streak without cutting focus time",
      alts: ["12:30 → 13:15"],
    },
  ];
  if (scenario === "conflict") {
    return [{
      id: "c1", title: "1:1 — Sarah", type: "event",
      from: "10:00 → 10:30 (overlaps Design review)", to: "16:30 → 17:00", confidence: 88,
      reasons: [
        { k: "conflict", t: "Resolves overlap with Design review" },
        { k: "gap", t: "Both free at 16:30" },
        { k: "energy", t: "Light task — fits lower-energy slot" },
      ],
      impact: "Clears the morning conflict",
      alts: ["17:00 → 17:30"],
    }, ...base.slice(0, 1)];
  }
  if (scenario === "overload") {
    return [{
      id: "o1", title: "Move 2 low-priority tasks to tomorrow", type: "task",
      from: "Today (11 items)", to: "Tomorrow morning", confidence: 81,
      reasons: [
        { k: "load", t: "Today is 140% of your usual capacity" },
        { k: "deadline", t: "Neither task is due today" },
      ],
      impact: "Brings today back to a realistic load",
      alts: ["Defer to Thursday"],
    }, ...base.slice(1)];
  }
  return base;
}

function ConfidenceMeter({ value }) {
  const tone = value >= 80 ? "142 70% 45%" : value >= 65 ? "38 92% 55%" : "20 90% 55%";
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 rounded-full bg-[hsl(var(--muted))] overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${value}%`, background: `hsl(${tone})` }} />
      </div>
      <span className="text-[11.5px] font-semibold tabular-nums" style={{ color: `hsl(${tone})` }}>{value}%</span>
    </div>
  );
}

const AI_TYPE = {
  task: { icon: Icons.CheckSquare, hsl: "263 70% 62%" },
  event: { icon: Icons.Calendar, hsl: "217 91% 60%" },
  focus: { icon: Icons.Zap, hsl: "142 70% 45%" },
  habit: { icon: Icons.Flame, hsl: "20 90% 55%" },
};

function SuggestionCard({ s, status, onAccept, onReject, onModify }) {
  const meta = AI_TYPE[s.type] || AI_TYPE.task;
  const Icon = meta.icon;
  const [chosen, setChosen] = useState(s.to);
  const decided = status === "accepted" || status === "rejected";
  return (
    <Card padding="p-0" className={cn("overflow-hidden transition-opacity", status === "rejected" && "opacity-50")}>
      <div className="flex items-start gap-3.5 p-4">
        <div className="w-10 h-10 rounded-[9px] flex items-center justify-center flex-shrink-0" style={{ background: `hsl(${meta.hsl} / 0.14)`, color: `hsl(${meta.hsl})` }}>
          <Icon size={18} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[14.5px] font-semibold">{s.title}</span>
            {status === "accepted" && <Badge variant="success" dot>Accepted</Badge>}
            {status === "rejected" && <Badge variant="muted">Dismissed</Badge>}
          </div>
          {/* move */}
          <div className="flex items-center gap-2 mt-1.5 text-[12.5px]">
            <span className="text-[hsl(var(--muted-foreground))] line-through">{s.from}</span>
            <Icons.ArrowRight size={13} className="text-[hsl(var(--muted-foreground))]" />
            <span className="font-semibold" style={{ color: `hsl(${meta.hsl})` }}>{chosen}</span>
          </div>
          {/* confidence + impact */}
          <div className="flex items-center gap-4 mt-2.5">
            <ConfidenceMeter value={s.confidence} />
            <span className="text-[11.5px] text-[hsl(var(--muted-foreground))] inline-flex items-center gap-1"><Icons.Trending size={12} /> {s.impact}</span>
          </div>
        </div>
      </div>

      {/* reasons */}
      <div className="px-4 pb-3">
        <div className="text-[10.5px] font-semibold uppercase tracking-wide text-[hsl(var(--muted-foreground))] mb-1.5">Why</div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
          {s.reasons.map((r, i) => {
            const RIcon = REASON_ICON[r.k] || Icons.Check;
            return (
              <div key={i} className="flex items-start gap-1.5 text-[12px] text-[hsl(var(--muted-foreground))]">
                <RIcon size={12} className="mt-0.5 flex-shrink-0 text-[hsl(var(--primary))]" />
                <span>{r.t}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* alternatives + actions */}
      {!decided && (
        <div className="px-4 py-3 border-t border-[hsl(var(--border))] bg-[hsl(var(--muted)/0.18)] flex items-center gap-2 flex-wrap">
          <span className="text-[11px] text-[hsl(var(--muted-foreground))]">Alternatives</span>
          {s.alts.map(a => (
            <button key={a} onClick={() => setChosen(a)}
              className={cn("h-7 px-2.5 rounded-[6px] text-[11.5px] font-medium font-mono transition-colors",
                chosen === a ? "bg-[hsl(var(--primary))] text-white" : "border border-[hsl(var(--border))] hover:bg-[hsl(var(--accent))]")}>
              {a}
            </button>
          ))}
          <div className="ml-auto flex items-center gap-1.5">
            <Button size="sm" variant="ghost" onClick={() => onReject(s.id)}>Dismiss</Button>
            <Button size="sm" variant="outline" icon={Icons.Edit} onClick={() => onModify(s)}>Modify</Button>
            <Button size="sm" icon={Icons.Check} onClick={() => onAccept(s.id, chosen)}>Accept</Button>
          </div>
        </div>
      )}
      {decided && (
        <div className="px-4 py-2.5 border-t border-[hsl(var(--border))] bg-[hsl(var(--muted)/0.18)] flex items-center justify-end">
          <button onClick={() => onModify(s, "reopen")} className="text-[12px] text-[hsl(var(--primary))] hover:underline inline-flex items-center gap-1"><Icons.Refresh size={12} /> Reconsider</button>
        </div>
      )}
    </Card>
  );
}

function AIPlanningPage() {
  const [scenario, setScenario] = useState("day");
  const [phase, setPhase] = useState("idle"); // idle | thinking | ready
  const [suggestions, setSuggestions] = useState([]);
  const [status, setStatus] = useState({}); // id -> accepted|rejected
  const [applied, setApplied] = useState(false);

  const run = (sc) => {
    setScenario(sc); setPhase("thinking"); setStatus({}); setApplied(false);
    setTimeout(() => { setSuggestions(makeSuggestions(sc)); setPhase("ready"); }, 950);
  };

  // auto-run if arriving via command palette intent
  useEffect(() => {
    if (window.__dpmAIIntent) { run(window.__dpmAIIntent); window.__dpmAIIntent = null; }
  }, []);

  const accept = (id, slot) => { setStatus(s => ({ ...s, [id]: "accepted" })); window.__dpmToast?.("Suggestion accepted"); };
  const reject = (id) => { setStatus(s => ({ ...s, [id]: "rejected" })); };
  const modify = (s, reopen) => {
    if (reopen) { setStatus(st => { const n = { ...st }; delete n[s.id]; return n; }); return; }
    window.__dpmQuickCreate?.({ title: s.title, type: s.type === "habit" ? "task" : s.type, when: s.to });
  };
  const applyAll = () => {
    const next = {}; suggestions.forEach(s => { if (status[s.id] !== "rejected") next[s.id] = "accepted"; });
    setStatus(next); setApplied(true); window.__dpmToast?.(`${Object.keys(next).length} changes applied to your day`);
  };
  const undoAll = () => { setStatus({}); setApplied(false); window.__dpmToast?.("Plan reverted"); };

  const pending = suggestions.filter(s => !status[s.id]).length;
  const accepted = suggestions.filter(s => status[s.id] === "accepted").length;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* header */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-[24px] font-bold tracking-tight flex items-center gap-2"><Icons.Sparkles size={20} className="text-[hsl(var(--primary))]" /> AI Planning</h1>
          <p className="text-[13px] text-[hsl(var(--muted-foreground))] mt-1">Explainable suggestions you stay in control of. Nothing changes until you accept.</p>
        </div>
      </div>

      {/* scenario launcher */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
        {AI_SCENARIOS.map(sc => (
          <button key={sc.id} onClick={() => run(sc.id)}
            className={cn("flex flex-col items-start gap-2 p-3.5 rounded-[12px] border text-left transition-colors",
              scenario === sc.id && phase !== "idle" ? "border-[hsl(var(--primary)/0.5)] bg-[hsl(var(--primary)/0.05)]" : "border-[hsl(var(--border))] hover:bg-[hsl(var(--accent))]")}>
            <span className="w-9 h-9 rounded-[8px] bg-[hsl(var(--muted)/0.5)] flex items-center justify-center"><sc.icon size={16} className="text-[hsl(var(--primary))]" /></span>
            <span className="text-[12.5px] font-semibold leading-tight">{sc.label}</span>
          </button>
        ))}
      </div>

      {/* idle */}
      {phase === "idle" && (
        <Card padding="p-10" className="text-center">
          <div className="w-12 h-12 rounded-full bg-[hsl(var(--primary)/0.12)] flex items-center justify-center mx-auto mb-4"><Icons.Sparkles size={22} className="text-[hsl(var(--primary))]" /></div>
          <p className="font-medium text-[15px] mb-1">Let the assistant draft a plan</p>
          <p className="text-[13px] text-[hsl(var(--muted-foreground))] max-w-sm mx-auto">Pick a scenario above. You'll see exactly what would change and why — then accept, tweak, or ignore each suggestion.</p>
        </Card>
      )}

      {/* thinking */}
      {phase === "thinking" && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-[13px] text-[hsl(var(--muted-foreground))]"><Icons.Sparkles size={14} className="text-[hsl(var(--primary))] animate-pulse" /> Reading your calendar, energy and deadlines…</div>
          {[0, 1, 2].map(i => (
            <Card key={i} padding="p-4"><div className="flex gap-3.5"><div className="w-10 h-10 rounded-[9px] skeleton" /><div className="flex-1 space-y-2"><div className="h-3.5 w-1/3 skeleton rounded" /><div className="h-3 w-1/2 skeleton rounded" /><div className="h-3 w-2/3 skeleton rounded" /></div></div></Card>
          ))}
        </div>
      )}

      {/* ready */}
      {phase === "ready" && (
        <>
          <div className="flex items-center justify-between">
            <div className="text-[13px]"><span className="font-semibold">{suggestions.length} suggestions</span> <span className="text-[hsl(var(--muted-foreground))]">· {accepted} accepted · {pending} pending</span></div>
            <div className="flex items-center gap-2">
              {applied ? <Button size="sm" variant="outline" icon={Icons.Refresh} onClick={undoAll}>Undo all</Button>
                : <Button size="sm" icon={Icons.Check} onClick={applyAll} disabled={pending === 0 && accepted === 0}>Apply all</Button>}
            </div>
          </div>
          <div className="space-y-3">
            {suggestions.map(s => (
              <SuggestionCard key={s.id} s={s} status={status[s.id]} onAccept={accept} onReject={reject} onModify={modify} />
            ))}
          </div>
          <div className="rounded-[10px] border border-[hsl(var(--border))] bg-[hsl(var(--muted)/0.2)] p-3 flex items-start gap-2 text-[12px] text-[hsl(var(--muted-foreground))]">
            <Icons.Shield size={14} className="text-[hsl(var(--primary))] flex-shrink-0 mt-0.5" />
            The assistant only reads scheduling data you've connected. It never moves a protected focus block or an event you've locked.
          </div>
        </>
      )}
    </div>
  );
}

Object.assign(window, { AIPlanningPage });
