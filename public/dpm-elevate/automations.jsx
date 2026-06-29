/* global React, useState, useEffect, useMemo, cn, Icons, Button, Card, Badge, Switch */

/* ============================================================
   AUTOMATIONS BUILDER  (/automations)
   A visual If / Then engine. Each rule reads as a flow: a trigger, optional
   conditions, and one or more actions. Build them in a drawer, simulate the
   outcome before/after, and track runs + health. FRONT-END ONLY — rules are
   mock state (seeded from useRules() when present).
============================================================ */

const TRIGGERS = [
  { id: "event-created", label: "An event is created", icon: Icons.Calendar },
  { id: "task-overdue", label: "A task becomes overdue", icon: Icons.AlertTriangle },
  { id: "day-overloaded", label: "The day gets overloaded", icon: Icons.Activity },
  { id: "focus-moved", label: "A focus block is moved", icon: Icons.Zap },
  { id: "habit-missed", label: "A habit is not checked", icon: Icons.Flame },
  { id: "energy-low", label: "Energy is low", icon: Icons.Activity },
  { id: "meeting-added", label: "A meeting is added", icon: Icons.Users },
];
const CONDITIONS = [
  { id: "priority", label: "Priority is high" },
  { id: "duration", label: "Duration > 1h" },
  { id: "calendar", label: "On Work calendar" },
  { id: "tag", label: "Has tag #deep" },
  { id: "time", label: "Before 12:00" },
  { id: "load", label: "Daily load > 80%" },
];
const ACTIONS = [
  { id: "suggest-slot", label: "Suggest a better slot", icon: Icons.Sparkles },
  { id: "move-flex", label: "Move a flexible block", icon: Icons.ArrowRight },
  { id: "add-buffer", label: "Add a 15-min buffer", icon: Icons.Clock },
  { id: "remind", label: "Send a reminder", icon: Icons.Bell },
  { id: "create-focus", label: "Create a focus block", icon: Icons.Zap },
  { id: "split-task", label: "Split the task", icon: Icons.Layers },
  { id: "add-break", label: "Insert a break", icon: Icons.Coffee },
];

const SEED_RULES = [
  { id: "r1", name: "Protect deep work", trigger: "event-created", conditions: ["duration", "calendar"], actions: ["add-buffer"], active: true, runs: 34, last: "2h ago", health: "ok" },
  { id: "r2", name: "Rescue overloaded days", trigger: "day-overloaded", conditions: ["load"], actions: ["suggest-slot", "move-flex"], active: true, runs: 12, last: "yesterday", health: "ok" },
  { id: "r3", name: "Never miss a deadline", trigger: "task-overdue", conditions: ["priority"], actions: ["remind", "suggest-slot"], active: false, runs: 5, last: "3 days ago", health: "paused" },
  { id: "r4", name: "Recover missed habits", trigger: "habit-missed", conditions: [], actions: ["create-focus"], active: true, runs: 0, last: "never", health: "error" },
];

const TPL = [
  { name: "Buffer between meetings", trigger: "meeting-added", conditions: [], actions: ["add-buffer"] },
  { name: "Lunch break", trigger: "day-overloaded", conditions: [], actions: ["add-break"] },
  { name: "Focus rescue", trigger: "focus-moved", conditions: [], actions: ["suggest-slot"] },
];

function metaTrigger(id) { return TRIGGERS.find(x => x.id === id) || TRIGGERS[0]; }
function metaAction(id) { return ACTIONS.find(x => x.id === id) || ACTIONS[0]; }
function metaCond(id) { return CONDITIONS.find(x => x.id === id); }

/* ---- flow node ---- */
function FlowNode({ kind, icon: Icon, label, tone }) {
  return (
    <div className="flex items-center gap-2 h-9 px-3 rounded-[8px] border" style={{ borderColor: `hsl(${tone} / 0.4)`, background: `hsl(${tone} / 0.07)` }}>
      <Icon size={14} style={{ color: `hsl(${tone})` }} />
      <span className="text-[12.5px] font-medium">{label}</span>
    </div>
  );
}

function RuleFlow({ r }) {
  const tg = metaTrigger(r.trigger);
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-[10px] font-bold uppercase tracking-wide text-[hsl(var(--muted-foreground))]">If</span>
      <FlowNode icon={tg.icon} label={tg.label} tone="217 91% 60%" />
      {r.conditions.length > 0 && <>
        <span className="text-[10px] font-bold uppercase tracking-wide text-[hsl(var(--muted-foreground))]">and</span>
        {r.conditions.map(c => <FlowNode key={c} icon={Icons.Filter} label={metaCond(c)?.label || c} tone="38 92% 55%" />)}
      </>}
      <Icons.ArrowRight size={15} className="text-[hsl(var(--muted-foreground))] mx-0.5" />
      <span className="text-[10px] font-bold uppercase tracking-wide text-[hsl(var(--muted-foreground))]">Then</span>
      {r.actions.map(a => { const m = metaAction(a); return <FlowNode key={a} icon={m.icon} label={m.label} tone="263 70% 62%" />; })}
    </div>
  );
}

/* ---- builder drawer ---- */
function AutomationBuilderDrawer({ open, onClose, initial, onSave }) {
  const [name, setName] = useState("");
  const [trigger, setTrigger] = useState("event-created");
  const [conditions, setConditions] = useState([]);
  const [actions, setActions] = useState([]);
  const [simulated, setSimulated] = useState(false);

  useEffect(() => {
    if (!open) return;
    setName(initial?.name || "");
    setTrigger(initial?.trigger || "event-created");
    setConditions(initial?.conditions || []);
    setActions(initial?.actions || []);
    setSimulated(false);
    const onKey = (e) => { if (e.key === "Escape") onClose?.(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, initial, onClose]);
  if (!open) return null;

  const toggle = (arr, set, id) => set(arr.includes(id) ? arr.filter(x => x !== id) : [...arr, id]);
  const valid = name.trim() && actions.length > 0;

  return (
    <div className="fixed inset-0 z-[110] flex justify-end anim-fade-in" style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
         onMouseDown={(e) => { if (e.target === e.currentTarget) onClose?.(); }}>
      <div className="h-full w-full max-w-[560px] bg-[hsl(var(--card))] border-l border-[hsl(var(--border))] shadow-2xl flex flex-col anim-scale-in" style={{ transformOrigin: "right" }}>
        <div className="px-5 h-16 flex items-center gap-3 border-b border-[hsl(var(--border))] flex-shrink-0">
          <div className="w-9 h-9 rounded-[8px] bg-[hsl(var(--primary)/0.12)] text-[hsl(var(--primary))] flex items-center justify-center"><Icons.Shield size={17} /></div>
          <div className="flex-1"><div className="text-[15px] font-semibold">{initial ? "Edit automation" : "New automation"}</div><div className="text-[12px] text-[hsl(var(--muted-foreground))]">If this, then that</div></div>
          <button onClick={onClose} className="w-8 h-8 rounded-md hover:bg-[hsl(var(--accent))] flex items-center justify-center text-[hsl(var(--muted-foreground))]"><Icons.X size={16} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          <div>
            <label className="text-[11.5px] font-semibold text-[hsl(var(--muted-foreground))] mb-1.5 block">Name</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Protect deep work"
              className="w-full h-10 px-3 rounded-[8px] border border-[hsl(var(--input))] bg-[hsl(var(--background))] text-[14px] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]" />
          </div>

          {/* IF */}
          <div>
            <div className="flex items-center gap-2 mb-2"><span className="w-6 h-6 rounded-[6px] bg-[hsl(217_91%_60%/0.14)] text-[hsl(217_91%_65%)] flex items-center justify-center text-[11px] font-bold">If</span><span className="text-[12.5px] font-semibold">Trigger</span></div>
            <div className="grid grid-cols-1 gap-1.5">
              {TRIGGERS.map(tg => (
                <button key={tg.id} onClick={() => setTrigger(tg.id)}
                  className={cn("flex items-center gap-2.5 h-10 px-3 rounded-[8px] border text-left text-[13px] transition-colors",
                    trigger === tg.id ? "border-[hsl(217_91%_60%/0.5)] bg-[hsl(217_91%_60%/0.07)]" : "border-[hsl(var(--border))] hover:bg-[hsl(var(--accent))]")}>
                  <tg.icon size={15} className="text-[hsl(217_91%_65%)]" /> {tg.label}
                  {trigger === tg.id && <Icons.Check size={14} className="ml-auto text-[hsl(217_91%_65%)]" stroke={3} />}
                </button>
              ))}
            </div>
          </div>

          {/* CONDITIONS */}
          <div>
            <div className="flex items-center gap-2 mb-2"><span className="w-6 h-6 rounded-[6px] bg-[hsl(38_92%_55%/0.14)] text-[hsl(38_92%_60%)] flex items-center justify-center"><Icons.Filter size={12} /></span><span className="text-[12.5px] font-semibold">Conditions <span className="text-[hsl(var(--muted-foreground))] font-normal">· optional</span></span></div>
            <div className="flex flex-wrap gap-1.5">
              {CONDITIONS.map(c => (
                <button key={c.id} onClick={() => toggle(conditions, setConditions, c.id)}
                  className={cn("h-8 px-3 rounded-[7px] text-[12px] font-medium border transition-colors",
                    conditions.includes(c.id) ? "border-[hsl(38_92%_55%/0.5)] bg-[hsl(38_92%_55%/0.1)] text-[hsl(38_92%_62%)]" : "border-[hsl(var(--border))] hover:bg-[hsl(var(--accent))]")}>
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* THEN */}
          <div>
            <div className="flex items-center gap-2 mb-2"><span className="w-6 h-6 rounded-[6px] bg-[hsl(263_70%_62%/0.14)] text-[hsl(263_70%_72%)] flex items-center justify-center text-[10px] font-bold">Do</span><span className="text-[12.5px] font-semibold">Actions</span></div>
            <div className="grid grid-cols-1 gap-1.5">
              {ACTIONS.map(a => (
                <button key={a.id} onClick={() => toggle(actions, setActions, a.id)}
                  className={cn("flex items-center gap-2.5 h-10 px-3 rounded-[8px] border text-left text-[13px] transition-colors",
                    actions.includes(a.id) ? "border-[hsl(263_70%_62%/0.5)] bg-[hsl(263_70%_62%/0.07)]" : "border-[hsl(var(--border))] hover:bg-[hsl(var(--accent))]")}>
                  <a.icon size={15} className="text-[hsl(263_70%_72%)]" /> {a.label}
                  {actions.includes(a.id) && <Icons.Check size={14} className="ml-auto text-[hsl(263_70%_72%)]" stroke={3} />}
                </button>
              ))}
            </div>
          </div>

          {/* simulation */}
          <div>
            <button onClick={() => setSimulated(true)} className="w-full h-10 rounded-[8px] border border-dashed border-[hsl(var(--border))] hover:bg-[hsl(var(--accent))] text-[12.5px] font-medium inline-flex items-center justify-center gap-2 text-[hsl(var(--muted-foreground))]">
              <Icons.Play size={13} /> Simulate on today
            </button>
            {simulated && (
              <div className="mt-2.5 rounded-[10px] border border-[hsl(var(--border))] overflow-hidden">
                <div className="grid grid-cols-2 divide-x divide-[hsl(var(--border))] text-[12px]">
                  <div className="p-3"><div className="text-[10px] font-semibold uppercase text-[hsl(var(--muted-foreground))] mb-1.5">Before</div><div className="text-[hsl(var(--muted-foreground))]">11 items · 2 overlaps · 140% load</div></div>
                  <div className="p-3 bg-[hsl(142_70%_45%/0.05)]"><div className="text-[10px] font-semibold uppercase text-[hsl(142_70%_55%)] mb-1.5">After</div><div>9 items · 0 overlaps · 92% load</div></div>
                </div>
                <div className="px-3 py-2 bg-[hsl(var(--muted)/0.2)] text-[11.5px] text-[hsl(var(--muted-foreground))] flex items-center gap-1.5"><Icons.Sparkles size={11} className="text-[hsl(var(--primary))]" /> Would run 2 times today</div>
              </div>
            )}
          </div>
        </div>

        <div className="px-5 py-3.5 border-t border-[hsl(var(--border))] flex items-center gap-2 bg-[hsl(var(--background)/0.4)] flex-shrink-0">
          {valid && (
            <div className="text-[11.5px] text-[hsl(var(--muted-foreground))] mr-auto flex items-center gap-1.5 flex-wrap">
              <Icons.Zap size={12} className="text-[hsl(var(--primary))]" /> If {metaTrigger(trigger).label.toLowerCase()} → {actions.map(a => metaAction(a).label.toLowerCase()).join(", ")}
            </div>
          )}
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button disabled={!valid} onClick={() => { onSave({ id: initial?.id || "r" + Date.now(), name: name.trim(), trigger, conditions, actions, active: true, runs: initial?.runs || 0, last: initial?.last || "never", health: "ok" }); }}>{initial ? "Save" : "Create automation"}</Button>
        </div>
      </div>
    </div>
  );
}

function AutomationsBuilderPage() {
  const [rules, setRules] = useState(SEED_RULES);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const save = (r) => {
    setRules(rs => rs.some(x => x.id === r.id) ? rs.map(x => x.id === r.id ? r : x) : [...rs, r]);
    setOpen(false); window.__dpmToast?.(editing ? "Automation updated" : "Automation created");
  };
  const remove = (id) => setRules(rs => rs.filter(r => r.id !== id));
  const toggle = (id) => setRules(rs => rs.map(r => r.id === id ? { ...r, active: !r.active } : r));

  const active = rules.filter(r => r.active).length;
  const totalRuns = rules.reduce((n, r) => n + r.runs, 0);
  const errors = rules.filter(r => r.health === "error").length;

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-[24px] font-bold tracking-tight">Automations</h1>
          <p className="text-[13px] text-[hsl(var(--muted-foreground))] mt-1">If this, then that — let DPM keep your schedule healthy automatically.</p>
        </div>
        <Button size="sm" icon={Icons.Plus} onClick={() => { setEditing(null); setOpen(true); }}>New automation</Button>
      </div>

      {/* stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { l: "Active", v: active, sub: `${rules.length} total`, icon: Icons.Zap, tone: "142 70% 45%" },
          { l: "Runs this month", v: totalRuns, sub: "across all rules", icon: Icons.Activity, tone: "217 91% 60%" },
          { l: "Need attention", v: errors, sub: errors ? "rule failing" : "all healthy", icon: Icons.AlertTriangle, tone: errors ? "0 84% 60%" : "142 70% 45%" },
        ].map((s, i) => (
          <Card key={i} padding="p-4" className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: `hsl(${s.tone} / 0.12)`, color: `hsl(${s.tone})` }}><s.icon size={16} /></div>
            <div><div className="text-[24px] font-bold tabular-nums leading-none">{s.v}</div><div className="text-[12px] text-[hsl(var(--muted-foreground))] mt-1">{s.l}</div></div>
          </Card>
        ))}
      </div>

      {/* templates */}
      <div>
        <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[hsl(var(--muted-foreground))] mb-2">Start from a template</div>
        <div className="grid grid-cols-3 gap-2.5">
          {TPL.map((t, i) => (
            <button key={i} onClick={() => save({ ...t, id: "r" + Date.now() + i, active: true, runs: 0, last: "never", health: "ok" })}
              className="text-left p-3 rounded-[10px] border border-[hsl(var(--border))] hover:border-[hsl(var(--primary)/0.4)] hover:bg-[hsl(var(--accent))] transition-colors">
              <div className="text-[13px] font-semibold mb-1.5">{t.name}</div>
              <div className="text-[11px] text-[hsl(var(--muted-foreground))] inline-flex items-center gap-1"><Icons.Plus size={11} /> Add in one tap</div>
            </button>
          ))}
        </div>
      </div>

      {/* rules */}
      <div className="space-y-3">
        {rules.map(r => (
          <Card key={r.id} padding="p-4" className={cn("group/r", !r.active && "opacity-65")}>
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[14.5px] font-semibold">{r.name}</span>
                {r.health === "error" && <Badge variant="danger" dot>Error</Badge>}
                {r.health === "paused" && <Badge variant="muted" dot>Inactive</Badge>}
                {r.health === "ok" && r.active && <Badge variant="success" dot>Active</Badge>}
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button onClick={() => { setEditing(r); setOpen(true); }} className="w-8 h-8 rounded-md text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))] flex items-center justify-center opacity-0 group-hover/r:opacity-100 transition-opacity"><Icons.Edit size={13} /></button>
                <button onClick={() => remove(r.id)} className="w-8 h-8 rounded-md text-[hsl(var(--muted-foreground))] hover:bg-[hsl(0_84%_60%/0.1)] hover:text-[hsl(0_84%_70%)] flex items-center justify-center opacity-0 group-hover/r:opacity-100 transition-opacity"><Icons.Trash size={13} /></button>
                <Switch checked={r.active} onChange={() => toggle(r.id)} />
              </div>
            </div>
            <RuleFlow r={r} />
            {r.health === "error" && (
              <div className="mt-3 rounded-[8px] border border-[hsl(0_84%_60%/0.3)] bg-[hsl(0_84%_60%/0.05)] p-2.5 flex items-center gap-2 text-[12px] text-[hsl(var(--muted-foreground))]">
                <Icons.AlertTriangle size={13} className="text-[hsl(0_84%_70%)]" /> Last run failed — target focus block no longer exists. <button onClick={() => { setEditing(r); setOpen(true); }} className="text-[hsl(var(--primary))] font-medium hover:underline">Fix</button>
              </div>
            )}
            <div className="mt-3 pt-3 border-t border-[hsl(var(--border))] flex items-center gap-4 text-[11.5px] text-[hsl(var(--muted-foreground))]">
              <span className="inline-flex items-center gap-1"><Icons.Activity size={11} /> {r.runs} runs</span>
              <span className="inline-flex items-center gap-1"><Icons.Clock size={11} /> Last: {r.last}</span>
              <button className="ml-auto inline-flex items-center gap-1 hover:text-[hsl(var(--foreground))]"><Icons.Book size={11} /> History</button>
            </div>
          </Card>
        ))}
      </div>

      <AutomationBuilderDrawer open={open} onClose={() => setOpen(false)} initial={editing} onSave={save} />
    </div>
  );
}

Object.assign(window, { AutomationsBuilderPage });
