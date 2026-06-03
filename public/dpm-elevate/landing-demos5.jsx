/* global React, useState, cn, Icons, useInViewOnce, useCountUp, window */
/* ============================================================
   LANDING — deep demos #5: Health & sleep, Goals (SMART),
   Daily planning ritual, Reviews
============================================================ */

/* ---------- Health & sleep & chronotype ---------- */
function HealthSleepDemo({ t }) {
  const h = t.health;
  const [tab, setTab] = useState(0);
  const bars7 = [0.55, 0.7, 0.5, 0.8, 0.62, 0.74, 0.95];
  const [srcOn, setSrcOn] = useState(() => h.sources.map((s) => s.on));
  const [syncMsg, setSyncMsg] = useState(h.synced);
  const toggleSrc = (i) => setSrcOn((a) => a.map((v, k) => (k === i ? !v : v)));
  const syncNow = () => setSyncMsg(h.sync.just);

  return (
    <div className="rounded-[12px] border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-3.5">
      {/* header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icons.Activity size={15} className="text-[hsl(142_70%_50%)]" />
          <span className="text-[13px] font-semibold">{h.tag.split(" · ")[0]}</span>
        </div>
        <div className="flex items-center gap-1.5 text-[9.5px] text-[hsl(var(--muted-foreground))]">
          <span className="w-1.5 h-1.5 rounded-full bg-[hsl(142_70%_50%)] lp-pulse" /> {syncMsg}
        </div>
      </div>

      {/* tabs */}
      <div className="inline-flex items-center gap-0.5 rounded-[8px] border border-[hsl(var(--border))] bg-[hsl(var(--muted)/0.4)] p-0.5 mb-3">
        {h.tabs.map((tb, i) => (
          <button key={i} onClick={() => setTab(i)}
            className={cn("px-3 h-7 text-[11px] font-medium rounded-[6px] transition-all", tab === i ? "bg-[hsl(var(--card))] text-[hsl(var(--foreground))] shadow-sm" : "text-[hsl(var(--muted-foreground))]")}>
            {tb}
          </button>
        ))}
      </div>

      {tab === 0 && (
        <div className="grid grid-cols-2 gap-2">
          {h.vitals.map((v) => (
            <div key={v.k} className="rounded-[10px] border border-[hsl(var(--border))] bg-[hsl(var(--card)/0.5)] p-2.5">
              <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-wide font-semibold" style={{ color: `hsl(${v.c})` }}>
                {React.createElement(Icons[v.icon] || Icons.Activity, { size: 11 })} {v.label}
              </div>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-[20px] font-bold tabular-nums leading-none">{v.v}</span>
                {v.unit && <span className="text-[10px] text-[hsl(var(--muted-foreground))]">{v.unit}</span>}
              </div>
              <div className="text-[9.5px] mt-0.5" style={{ color: `hsl(${v.c})` }}>{v.sub}</div>
              <div className="flex items-end gap-0.5 h-5 mt-2">
                {bars7.map((b, i) => (
                  <div key={i} className="flex-1 rounded-[2px]" style={{ height: `${b * 100}%`, background: `hsl(${v.c} / ${i === 6 ? 1 : 0.4})` }} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 1 && (
        <div>
          <div className="grid grid-cols-3 gap-2 mb-3">
            {[["Avg duration", "7h 18", "rec. 7–9h"], ["Bedtime ±", "24 min", "regular"], ["Quality", "Good", "73%"]].map(([l, v, s], i) => (
              <div key={i} className={cn("rounded-[9px] border p-2 text-center", i === 1 ? "border-[hsl(263_70%_60%/0.4)] bg-[hsl(263_70%_60%/0.06)]" : "border-[hsl(var(--border))]")}>
                <div className="text-[8.5px] uppercase tracking-wide text-[hsl(var(--muted-foreground))]">{l}</div>
                <div className="text-[15px] font-bold tabular-nums mt-0.5">{v}</div>
                <div className="text-[8.5px] text-[hsl(var(--muted-foreground))]">{s}</div>
              </div>
            ))}
          </div>
          <div className="flex items-end gap-1.5 h-16">
            {[7.5, 6.8, 7.2, 8.1, 6.5, 7.4, 7.4].map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full rounded-t-[3px] bg-[hsl(263_70%_60%/0.7)]" style={{ height: `${(v / 9) * 100}%` }} />
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: i % 3 === 1 ? "hsl(38 92% 55%)" : "hsl(142 70% 50%)" }} />
              </div>
            ))}
          </div>
          <div className="text-[8.5px] font-mono text-[hsl(var(--muted-foreground))] text-center mt-1">last 7 nights · duration + quality</div>
        </div>
      )}

      {tab === 2 && (
        <div className="flex flex-col gap-1.5">
          {h.chronotypes.map((ct) => {
            const Ic = Icons[ct.icon] || Icons.Sun;
            return (
              <div key={ct.id} className={cn("rounded-[9px] border p-2.5 flex items-center gap-2.5", ct.on ? "border-[hsl(263_70%_60%/0.5)] bg-[hsl(263_70%_60%/0.07)]" : "border-[hsl(var(--border))]")}>
                <span className={cn("w-8 h-8 rounded-[8px] flex items-center justify-center flex-shrink-0", ct.on ? "bg-[hsl(263_70%_60%/0.18)] text-[hsl(263_70%_68%)]" : "bg-[hsl(var(--muted)/0.5)] text-[hsl(var(--muted-foreground))]")}><Ic size={15} /></span>
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] font-semibold flex items-center gap-1.5">{ct.n}{ct.on && <Icons.Check size={12} stroke={3} className="text-[hsl(263_70%_68%)]" />}</div>
                  <div className="text-[10px] text-[hsl(var(--muted-foreground))]">{ct.d}</div>
                </div>
                <span className="text-[9.5px] font-mono text-[hsl(var(--muted-foreground))] whitespace-nowrap">{ct.hrs}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* AI recovery suggestion */}
      <div className="mt-3 rounded-[10px] border border-[hsl(var(--primary)/0.3)] bg-[hsl(var(--primary)/0.06)] p-2.5 flex items-start gap-2">
        <span className="w-6 h-6 rounded-[7px] gradient-violet flex items-center justify-center flex-shrink-0"><Icons.Sparkles size={12} className="text-white" /></span>
        <div className="min-w-0">
          <div className="text-[11px] leading-snug">{h.ai}<span className="font-bold">{h.aiTime}</span>.</div>
          <button className="mt-1.5 text-[10px] font-semibold text-[hsl(var(--primary))] flex items-center gap-1"><Icons.ArrowRight size={11} /> {h.seeSlot}</button>
        </div>
      </div>

      {/* device & phone sync */}
      <div className="mt-3 rounded-[10px] border border-[hsl(var(--border))] bg-[hsl(var(--card)/0.5)] p-2.5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[9.5px] uppercase tracking-wide font-mono text-[hsl(var(--muted-foreground))]">{h.sync.label}</span>
          <button onClick={syncNow} className="text-[9.5px] font-semibold px-2 py-0.5 rounded-full bg-[hsl(142_70%_45%/0.16)] text-[hsl(142_70%_55%)] flex items-center gap-1"><Icons.Refresh size={10} /> {h.sync.now}</button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {h.sources.map((s, i) => (
            <button key={i} onClick={() => toggleSrc(i)}
              className={cn("text-[9.5px] px-2 py-1 rounded-full border flex items-center gap-1.5 transition-colors", srcOn[i] ? "" : "border-dashed border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))]")}
              style={srcOn[i] ? { borderColor: `hsl(${s.c} / 0.5)`, background: `hsl(${s.c} / 0.12)`, color: "hsl(var(--foreground))" } : {}}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: srcOn[i] ? `hsl(${s.c})` : "hsl(var(--muted-foreground))" }} />
              {s.n}{srcOn[i] && <Icons.Check size={9} stroke={3} className="text-[hsl(142_70%_55%)]" />}
            </button>
          ))}
        </div>
        <div className="text-[9px] text-[hsl(var(--muted-foreground))] mt-2 flex items-center gap-1"><Icons.Smartphone size={9} /> {h.sync.auto}</div>
      </div>
    </div>
  );
}

/* ---------- Goals: progress + SMART badges + linked habit ---------- */
function GoalsProDemo({ t }) {
  const g = t.goalsPro;
  const [ref, seen] = useInViewOnce(0.3);
  return (
    <div ref={ref} className="rounded-[12px] border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-3.5 flex flex-col gap-2.5">
      {g.items.map((goal, gi) => {
        const pct = Math.round((goal.cur / goal.max) * 100);
        return (
          <div key={gi} className="rounded-[10px] border border-[hsl(var(--border))] bg-[hsl(var(--card)/0.5)] p-3">
            <div className="flex items-center justify-between mb-1.5">
              <div className="min-w-0">
                <div className="text-[12.5px] font-semibold leading-tight truncate">{goal.t}</div>
                <div className="text-[9.5px] text-[hsl(var(--muted-foreground))]">{goal.cat}</div>
              </div>
              <div className="text-right flex-shrink-0 ml-2">
                <span className="text-[15px] font-bold tabular-nums" style={{ color: `hsl(${goal.c})` }}>{goal.cur}</span>
                <span className="text-[10px] text-[hsl(var(--muted-foreground))]">/{goal.max} {goal.unit}</span>
              </div>
            </div>
            <div className="h-1.5 rounded-full bg-[hsl(var(--muted))] overflow-hidden">
              <div className="h-full rounded-full transition-[width] duration-[900ms] ease-out" style={{ width: seen ? `${pct}%` : "0%", transitionDelay: `${gi * 140}ms`, background: `hsl(${goal.c})` }} />
            </div>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-1">
                {g.smart.map((sm, si) => (
                  <span key={si} title={g.smartFull[si]} className={cn("w-4 h-4 rounded-[4px] text-[8px] font-bold flex items-center justify-center transition-all", goal.smart[si] ? "text-white" : "bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]", seen && "lp-check-pop")}
                    style={{ ...(goal.smart[si] ? { background: `hsl(${goal.c})` } : {}), animationDelay: `${gi * 140 + si * 60}ms` }}>{sm}</span>
                ))}
              </div>
              {goal.linked && (
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] flex items-center gap-1"><Icons.Flame size={9} /> {goal.linked}</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ---------- Daily planning: 6-step ritual on YOUR tasks ---------- */
function DailyPlanningDemo({ t }) {
  const d = t.daily;
  const q = t.matrix.quadrants;
  const [step, setStep] = useState(0);
  const icons = [Icons.Plus, Icons.Clock, Icons.Layers, Icons.Grid, Icons.Calendar, Icons.Pen];
  const ESTS = ["15m", "30m", "1h", "2h"];
  const QC = ["0 84% 60%", "263 70% 60%", "217 91% 60%", "215 16% 55%"];
  const QK = ["do", "plan", "delegate", "drop"];
  const [tasks, setTasks] = useState([
    { id: 1, label: "Write the Q2 deck", est: 2, q: 0 },
    { id: 2, label: "Reply to Léa", est: 0, q: 1 },
    { id: 3, label: "Gym", est: 2, q: 1 },
  ]);
  const [draft, setDraft] = useState("");
  const nextId = useRef(4);
  const add = () => { const v = draft.trim(); if (!v) return; setTasks((ts) => [...ts, { id: nextId.current++, label: v, est: 1, q: 1 }]); setDraft(""); };
  const remove = (id) => setTasks((ts) => ts.filter((x) => x.id !== id));
  const cycleEst = (id) => setTasks((ts) => ts.map((x) => (x.id === id ? { ...x, est: (x.est + 1) % ESTS.length } : x)));
  const cycleQ = (id) => setTasks((ts) => ts.map((x) => (x.id === id ? { ...x, q: (x.q + 1) % 4 } : x)));

  return (
    <div className="rounded-[12px] border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-3.5">
      {/* step rail */}
      <div className="flex items-center gap-1 mb-3">
        {d.steps.map((s, i) => (
          <React.Fragment key={i}>
            <button onClick={() => setStep(i)} className="flex items-center justify-center flex-shrink-0" title={s.k}>
              <span className={cn("w-7 h-7 rounded-full flex items-center justify-center transition-all", i <= step ? "bg-[hsl(var(--primary))] text-white" : "bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]")}>
                {i < step ? <Icons.Check size={12} stroke={3} /> : React.createElement(icons[i], { size: 12 })}
              </span>
            </button>
            {i < d.steps.length - 1 && <div className={cn("flex-1 h-0.5 rounded-full transition-colors", i < step ? "bg-[hsl(var(--primary))]" : "bg-[hsl(var(--muted))]")} />}
          </React.Fragment>
        ))}
      </div>

      <div className="rounded-[10px] border border-[hsl(var(--border))] bg-[hsl(var(--card)/0.5)] p-3.5 min-h-[150px]">
        <div className="flex items-center gap-2 mb-2.5">
          <span className="text-[10px] font-mono text-[hsl(var(--primary))] tabular-nums">0{step + 1}/06</span>
          <span className="text-[14px] font-semibold">{d.steps[step].k}</span>
          <span className="text-[11px] text-[hsl(var(--muted-foreground))] ml-auto">{d.steps[step].d}</span>
        </div>

        {/* STEP 0 — add your own tasks */}
        {step === 0 && (
          <div className="flex flex-col gap-2">
            <div className="flex gap-1.5">
              <input value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => e.key === "Enter" && add()}
                placeholder={d.placeholder}
                className="flex-1 h-8 rounded-[7px] border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-2.5 text-[12px] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]" />
              <button onClick={add} className="h-8 w-8 rounded-[7px] bg-[hsl(var(--primary))] text-white flex items-center justify-center flex-shrink-0"><Icons.Plus size={14} /></button>
            </div>
            <div className="flex flex-col gap-1">
              {tasks.map((x) => (
                <div key={x.id} className="flex items-center gap-2 text-[11.5px] rounded-[6px] border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-2 py-1.5">
                  <Icons.Plus size={11} className="text-[hsl(var(--primary))]" />
                  <span className="flex-1 truncate">{x.label}</span>
                  <button onClick={() => remove(x.id)} className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(0_84%_60%)]"><Icons.X size={12} /></button>
                </div>
              ))}
              {tasks.length === 0 && <div className="text-[11px] text-[hsl(var(--muted-foreground))] italic px-1 py-2">{d.placeholder}</div>}
            </div>
          </div>
        )}

        {/* STEP 1 — estimate each task */}
        {step === 1 && (
          <div className="flex flex-col gap-1.5">
            {tasks.map((x) => (
              <div key={x.id} className="flex items-center gap-2 text-[11.5px]">
                <Icons.Clock size={11} className="text-[hsl(var(--primary))]" />
                <span className="flex-1 truncate">{x.label}</span>
                <button onClick={() => cycleEst(x.id)} className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[hsl(var(--primary)/0.12)] text-[hsl(var(--primary))] tabular-nums">{ESTS[x.est]}</button>
              </div>
            ))}
            {!tasks.length && <span className="text-[11px] text-[hsl(var(--muted-foreground))] italic">— add tasks in step 01 —</span>}
          </div>
        )}

        {/* STEP 2 — fill with habits & events */}
        {step === 2 && (
          <div className="flex flex-col gap-1">
            {["+ Meditation (habit)", "+ Stand-up 09:00", "+ Lunch 12:30"].map((x, i) => (
              <div key={i} className="flex items-center gap-2 text-[11px] text-[hsl(var(--muted-foreground))]"><Icons.Layers size={11} className="text-[hsl(var(--primary))]" />{x}</div>
            ))}
            <div className="text-[10px] text-[hsl(var(--muted-foreground))] mt-1">+ {tasks.length} {d.steps[0].k.toLowerCase()} tasks</div>
          </div>
        )}

        {/* STEP 3 — prioritize each task (tap to cycle quadrant) */}
        {step === 3 && (
          <div className="flex flex-col gap-1.5">
            {tasks.map((x) => (
              <div key={x.id} className="flex items-center gap-2 text-[11.5px]">
                <span className="flex-1 truncate">{x.label}</span>
                <button onClick={() => cycleQ(x.id)} className="text-[9.5px] font-semibold px-2 py-0.5 rounded-full text-white flex items-center gap-1" style={{ background: `hsl(${QC[x.q]})` }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-white/80" />{q[QK[x.q]]}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* STEP 4 — schedule: tasks become blocks */}
        {step === 4 && (
          <div className="grid grid-cols-1 gap-1">
            {tasks.map((x) => (
              <div key={x.id} className="rounded-[6px] px-2 py-1.5 text-[11px] font-medium text-white flex items-center justify-between" style={{ background: `hsl(${QC[x.q]} / 0.9)` }}>
                <span className="truncate">{x.label}</span>
                <span className="text-[9px] font-mono opacity-80">{ESTS[x.est]}</span>
              </div>
            ))}
            {!tasks.length && <span className="text-[11px] text-[hsl(var(--muted-foreground))] italic">— nothing to schedule —</span>}
          </div>
        )}

        {/* STEP 5 — document */}
        {step === 5 && (
          <div className="rounded-[7px] border border-[hsl(var(--border))] p-2.5 text-[11.5px] text-[hsl(var(--muted-foreground))]">
            <span className="text-[hsl(var(--foreground))] font-medium">{tasks.length}</span> tasks planned ·
            <span className="text-[hsl(var(--foreground))] font-medium"> {tasks.filter((x) => x.q === 0).length}</span> for today.
            <div className="italic mt-1">"{tasks[0]?.label || "Deep work"} first, then the rest."</div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-3">
        <button onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0} className="h-8 px-3 rounded-[7px] border border-[hsl(var(--border))] text-[12px] font-medium disabled:opacity-40 flex items-center gap-1"><Icons.ChevronLeft size={13} /></button>
        <span className="text-[10px] text-[hsl(var(--muted-foreground))] flex items-center gap-1"><Icons.Sparkles size={10} className="text-[hsl(var(--primary))]" /> {d.addedNote}</span>
        <button onClick={() => setStep((s) => Math.min(5, s + 1))} disabled={step === 5} className="h-8 px-4 rounded-[7px] bg-[hsl(var(--primary))] text-white text-[12px] font-medium disabled:opacity-40 flex items-center gap-1">{step === 5 ? "Done" : "Next"} <Icons.ChevronRight size={13} /></button>
      </div>
    </div>
  );
}

/* ---------- Reviews + tips ---------- */
function ReviewsGrid({ t }) {
  const r = t.reviews;
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {r.items.map((rv, i) => (
        <div key={i} className="rounded-[14px] border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 flex flex-col">
          <div className="flex items-center gap-3 mb-3">
            <span className="w-10 h-10 rounded-full gradient-violet flex items-center justify-center flex-shrink-0">
              {React.createElement(Icons[rv.icon] || Icons.Users, { size: 18, className: "text-white" })}
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-[13.5px] font-semibold">{rv.name}</div>
              <div className="text-[11px] text-[hsl(var(--muted-foreground))]">{rv.role}</div>
            </div>
            <div className="flex gap-0.5">
              {[0,1,2,3,4].map((s) => <Icons.Star key={s} size={12} className={s < rv.stars ? "text-[hsl(38_92%_55%)]" : "text-[hsl(var(--muted))]"} fill={s < rv.stars ? "currentColor" : "none"} />)}
            </div>
          </div>
          <p className="text-[13.5px] leading-relaxed text-[hsl(var(--foreground)/0.9)] flex-1" style={{ textWrap: "pretty" }}>{rv.text}</p>
          <div className="mt-3 pt-3 border-t border-[hsl(var(--border))] flex items-start gap-2 text-[12px] text-[hsl(var(--muted-foreground))]">
            <Icons.Sparkles size={13} className="text-[hsl(var(--primary))] flex-shrink-0 mt-0.5" />
            <span style={{ textWrap: "pretty" }}>{rv.tip}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

Object.assign(window, { HealthSleepDemo, GoalsProDemo, DailyPlanningDemo, ReviewsGrid });
