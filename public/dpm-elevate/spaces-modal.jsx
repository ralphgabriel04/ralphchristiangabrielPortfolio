/* global React, Icons, Button, Card, Badge, Switch, Input, cn,
          useState, useEffect, useRef,
          useSpaces, useSpace, spaceById, ALL_CALENDAR_NAMES, ALL_BOARD_NAMES,
          useShares, SHARE_MODULES, shareCountForSpace */

/* ============================================================
   ESPACES — Gérer / Créer (modal) (P20)

   Liste à gauche, formulaire à droite. "Tous" sélectionnable mais
   non modifiable (filet de sécurité). Suppression d'un espace sur
   mesure → ses éléments retombent dans "Tous" (jamais de perte).
   Réutilise les groupes réels (calendriers / tableaux de tâches) +
   un IconPicker et un ColorPicker compacts cohérents avec la marque.
============================================================ */

const SPACE_ICON_SET = ["Briefcase", "Heart", "GraduationCap", "Layers", "Globe", "Home2", "Plane", "Users", "Target", "Star", "Flame", "Activity", "Book", "Compass"];
const SPACE_COLOR_SET = ["263 70% 60%", "217 91% 60%", "330 80% 60%", "38 92% 55%", "142 70% 50%", "180 65% 50%", "0 84% 60%", "20 90% 55%", "280 60% 65%"];
const SPACE_CALENDARS = ["Work", "Meetings", "Projects", "Personal", "Sport", "Family", "Léa", "Tom", "Mom"];
const SPACE_BOARDS = ["Courses", "Internships & jobs", "Personal"];

/* ---- color helpers (HSL token string <-> hex for the native picker) ---- */
function hslStrToHex(str) {
  const m = String(str || "").trim().match(/^([\d.]+)\s+([\d.]+)%\s+([\d.]+)%$/);
  if (!m) return "#8b5cf6";
  const h = +m[1], s = +m[2] / 100, l = +m[3] / 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => { const k = (n + h / 30) % 12; return l - a * Math.max(-1, Math.min(k - 3, Math.min(9 - k, 1))); };
  const toHex = (x) => Math.round(x * 255).toString(16).padStart(2, "0");
  return "#" + toHex(f(0)) + toHex(f(8)) + toHex(f(4));
}
function hexToHslStr(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255, g = parseInt(hex.slice(3, 5), 16) / 255, b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
  let h = 0, s = 0; const l = (max + min) / 2;
  if (d) {
    s = d / (1 - Math.abs(2 * l - 1));
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60; if (h < 0) h += 360;
  }
  return `${Math.round(h)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

const ARRIVAL_VIEWS = [
  { id: "home", label: "Home" },
  { id: "calendar", label: "Calendar" },
  { id: "daily-planning", label: "Planning" },
  { id: "planner", label: "Focus" },
  { id: "tasks", label: "Tasks" },
  { id: "dashboard", label: "Analytics dashboard" },
];

function blankDraft() {
  return {
    name: "", icon: "Layers", color: SPACE_COLOR_SET[0],
    arrivalView: "home", hours: "All hours",
    content: { calendars: [], boards: [] },
  };
}

function SpacesModal() {
  const [spaces, ops] = useSpaces();
  const [, setSpace] = useSpace();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("manage");      // "manage" | "create"
  const [selectedId, setSelectedId] = useState("all");
  const [draft, setDraft] = useState(blankDraft());
  const [tab, setTab] = useState("details");   // "details" | "share"

  // Open via window.__dpmOpenSpaces(mode, spaceId)
  useEffect(() => {
    const handler = (e) => {
      const { mode: m, spaceId } = e.detail || {};
      setOpen(true);
      if (m === "create") {
        setMode("create"); setDraft(blankDraft()); setTab("details");
      } else {
        setMode("manage");
        const id = spaceId || window.__dpmSpace || "all";
        setSelectedId(id);
        setTab(m === "share" ? "share" : "details");
        const sp = spaceById(id);
        setDraft({ ...sp, content: { calendars: [...(sp.content?.calendars || [])], boards: [...(sp.content?.boards || [])] } });
      }
    };
    window.__dpmOpenSpaces = (m, spaceId) => window.dispatchEvent(new CustomEvent("dpm-spaces-modal", { detail: { mode: m, spaceId } }));
    window.addEventListener("dpm-spaces-modal", handler);
    return () => window.removeEventListener("dpm-spaces-modal", handler);
  }, []);

  useEffect(() => {
    const k = (e) => { if (e.key === "Escape") setOpen(false); };
    if (open) document.addEventListener("keydown", k);
    return () => document.removeEventListener("keydown", k);
  }, [open]);

  if (!open) return null;

  const isCreate = mode === "create";
  const selected = isCreate ? null : spaceById(selectedId);
  const isAll = !isCreate && selectedId === "all";

  const selectSpace = (id) => {
    setMode("manage");
    setSelectedId(id);
    setTab("details");
    const sp = spaceById(id);
    setDraft({ ...sp, content: { calendars: [...(sp.content?.calendars || [])], boards: [...(sp.content?.boards || [])] } });
  };
  const startCreate = () => { setMode("create"); setDraft(blankDraft()); };

  const toggleContent = (kind, name) => setDraft(d => {
    const arr = d.content[kind] || [];
    const next = arr.includes(name) ? arr.filter(n => n !== name) : [...arr, name];
    return { ...d, content: { ...d.content, [kind]: next } };
  });

  const save = () => {
    if (isCreate) {
      const id = ops.add(draft);
      setSpace(id);
      setOpen(false);
    } else if (!isAll) {
      ops.update(selectedId, draft);
      setOpen(false);
    }
  };
  const del = () => {
    if (isAll || isCreate) return;
    if (window.confirm(`Delete the space “${selected.name}”? Its items will be reassigned to “All” — no data is lost.`)) {
      ops.remove(selectedId);
      setOpen(false);
    }
  };

  const IconPreview = Icons[draft.icon] || Icons.Layers;
  const contentTotal = (draft.content.calendars?.length || 0) + (draft.content.boards?.length || 0);

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" onClick={() => setOpen(false)} />
      <div className="relative w-full sm:max-w-3xl h-full sm:h-auto sm:max-h-[88vh] bg-[hsl(var(--card))] sm:rounded-[14px] border border-[hsl(var(--border))] shadow-2xl flex flex-col anim-scale-in overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[hsl(var(--border))] flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-[9px] bg-[hsl(var(--primary)/0.14)] text-[hsl(263_70%_80%)] flex items-center justify-center"><Icons.Layers size={16} /></span>
            <div>
              <h2 className="text-[16px] font-bold tracking-tight leading-none">Manage spaces</h2>
              <p className="text-[11.5px] text-[hsl(var(--muted-foreground))] mt-1">Contexts that scope the whole app</p>
            </div>
          </div>
          <button onClick={() => setOpen(false)} className="w-8 h-8 rounded-md hover:bg-[hsl(var(--accent))] flex items-center justify-center text-[hsl(var(--muted-foreground))]"><Icons.X size={16} /></button>
        </div>

        {/* Body */}
        <div className="flex-1 min-h-0 flex flex-col sm:flex-row overflow-hidden">
          {/* List */}
          <div className="sm:w-[210px] flex-shrink-0 border-b sm:border-b-0 sm:border-r border-[hsl(var(--border))] p-2 overflow-y-auto flex sm:block gap-1.5 sm:gap-0">
            {spaces.map(s => {
              const IconC = Icons[s.icon] || Icons.Layers;
              const active = !isCreate && selectedId === s.id;
              return (
                <button key={s.id} onClick={() => selectSpace(s.id)}
                  className={cn("w-full flex items-center gap-2.5 px-2.5 py-2 rounded-[8px] text-left transition-colors mb-0.5 flex-shrink-0",
                    active ? "bg-[hsl(var(--accent))]" : "hover:bg-[hsl(var(--accent)/0.5)]")}>
                  <span className="w-7 h-7 rounded-[8px] flex items-center justify-center flex-shrink-0"
                        style={{ background: `hsl(${s.color} / 0.16)`, color: `hsl(${s.color})` }}><IconC size={14} /></span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-[12.5px] font-medium truncate">{s.name}</span>
                    {s.system && <span className="block text-[10px] text-[hsl(var(--muted-foreground))]">Automatic</span>}
                  </span>
                </button>
              );
            })}
            <button onClick={startCreate}
              className={cn("w-full flex items-center gap-2 px-2.5 py-2 rounded-[8px] text-left transition-colors text-[12.5px] font-medium flex-shrink-0",
                isCreate ? "bg-[hsl(var(--primary)/0.12)] text-[hsl(263_70%_85%)]" : "text-[hsl(263_70%_80%)] hover:bg-[hsl(var(--accent)/0.5)]")}>
              <Icons.Plus size={14} /> <span className="whitespace-nowrap">New space</span>
            </button>
          </div>

          {/* Form / detail */}
          <div className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden p-5">
            {isAll ? (
              <AllSpaceNote />
            ) : (
              <>
              {!isCreate && (
                <div className="flex items-center gap-1 mb-5 p-1 rounded-[10px] bg-[hsl(var(--muted)/0.5)] w-fit">
                  <ShareTab active={tab === "details"} onClick={() => setTab("details")} icon={Icons.Settings} label="Details" />
                  <ShareTab active={tab === "share"} onClick={() => setTab("share")} icon={Icons.Users} label="Sharing" badge={shareCountForSpace(selectedId) || null} color={draft.color} />
                </div>
              )}
              {(isCreate || tab === "details") ? (
              <div className="space-y-5">
                {/* Preview + Name */}
                <div className="flex items-center gap-3">
                  <span className="w-12 h-12 rounded-[12px] flex items-center justify-center flex-shrink-0"
                        style={{ background: `hsl(${draft.color} / 0.18)`, color: `hsl(${draft.color})` }}>
                    <IconPreview size={22} />
                  </span>
                  <div className="flex-1">
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-[hsl(var(--muted-foreground))] mb-1">Space name</label>
                    <Input value={draft.name} onChange={e => setDraft(d => ({ ...d, name: e.target.value }))} placeholder="e.g. Client X, Family, Studies…" />
                  </div>
                </div>

                {/* Icon */}
                <Field label="Icon">
                  <div className="flex flex-wrap gap-1.5">
                    {SPACE_ICON_SET.map(name => {
                      const IconC = Icons[name] || Icons.Layers;
                      const on = draft.icon === name;
                      return (
                        <button key={name} onClick={() => setDraft(d => ({ ...d, icon: name }))}
                          className={cn("w-9 h-9 rounded-[8px] flex items-center justify-center transition-all",
                            on ? "text-white" : "bg-[hsl(var(--muted)/0.5)] text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))]")}
                          style={on ? { background: `hsl(${draft.color})` } : {}}>
                          <IconC size={16} />
                        </button>
                      );
                    })}
                  </div>
                </Field>

                {/* Color */}
                <Field label="Color (ambient accent)" sub="Pick a preset or set a fully custom color.">
                  <ColorSwatches value={draft.color} onChange={(c) => setDraft(d => ({ ...d, color: c }))} />
                </Field>

                {/* Content */}
                <Field label={`Contenu inclus${contentTotal ? ` · ${contentTotal}` : ""}`} sub="Reuses existing groups — items outside this space stay visible in “All”.">
                  <div className="space-y-3">
                    <ContentGroup title="Calendars" names={SPACE_CALENDARS} selected={draft.content.calendars} onToggle={(n) => toggleContent("calendars", n)} color={draft.color} />
                    <ContentGroup title="Task boards" names={SPACE_BOARDS} selected={draft.content.boards} onToggle={(n) => toggleContent("boards", n)} color={draft.color} />
                    <div className="rounded-[8px] border border-dashed border-[hsl(var(--border))] px-3 py-2.5 text-[11.5px] text-[hsl(var(--muted-foreground))] leading-snug flex items-start gap-2">
                      <Icons.Sparkles size={12} className="mt-0.5 flex-shrink-0 text-[hsl(263_70%_75%)]" />
                      <span>Habits, goals and rules inherit the space when created — each item can be reassigned individually.</span>
                    </div>
                  </div>
                </Field>

                {/* Defaults */}
                <Field label="Default settings" sub="What the app looks like when you switch to this space.">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className="block">
                      <span className="block text-[11px] text-[hsl(var(--muted-foreground))] mb-1">Arrival view</span>
                      <select value={draft.arrivalView} onChange={e => setDraft(d => ({ ...d, arrivalView: e.target.value }))}
                        className="w-full h-10 px-3 rounded-[8px] border border-[hsl(var(--input))] bg-[hsl(var(--background))] text-[13px] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]">
                        {ARRIVAL_VIEWS.map(v => <option key={v.id} value={v.id}>{v.label}</option>)}
                      </select>
                    </label>
                    <label className="block">
                      <span className="block text-[11px] text-[hsl(var(--muted-foreground))] mb-1">Working hours</span>
                      <Input value={draft.hours} onChange={e => setDraft(d => ({ ...d, hours: e.target.value }))} placeholder="09:00 – 17:00" />
                    </label>
                  </div>
                </Field>
              </div>
              ) : (
                <SharingPanel spaceId={selectedId} space={selected} />
              )}
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        {!isAll && (isCreate || tab === "details") && (
          <div className="px-5 py-3.5 border-t border-[hsl(var(--border))] flex items-center justify-between gap-2 flex-shrink-0">
            {!isCreate
              ? <Button variant="destructive" size="sm" icon={Icons.Trash} onClick={del}>Delete</Button>
              : <span className="text-[11.5px] text-[hsl(var(--muted-foreground))]">The new space starts empty — you'll attach content to it.</span>}
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>Cancel</Button>
              <Button size="sm" icon={isCreate ? Icons.Plus : Icons.Check} onClick={save} disabled={!draft.name.trim()}>
                {isCreate ? "Create space" : "Save"}
              </Button>
            </div>
          </div>
        )}
        {!isAll && !isCreate && tab === "share" && (
          <div className="px-5 py-3.5 border-t border-[hsl(var(--border))] flex items-center justify-between gap-3 flex-shrink-0">
            <span className="text-[11.5px] text-[hsl(var(--muted-foreground))] flex items-center gap-1.5 min-w-0">
              <Icons.Lock size={12} className="flex-shrink-0 text-[hsl(263_70%_75%)]" />
              <span className="truncate">Changes save automatically. Wellbeing stays private unless shared explicitly.</span>
            </span>
            <Button size="sm" icon={Icons.Check} onClick={() => setOpen(false)}>Done</Button>
          </div>
        )}
      </div>
    </div>
  );
}

function ColorSwatches({ value, onChange }) {
  const isPreset = SPACE_COLOR_SET.includes(value);
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5">
        {SPACE_COLOR_SET.map(c => {
          const on = value === c;
          return (
            <button key={c} type="button" onClick={() => onChange(c)} title={`hsl(${c})`}
              className="w-9 h-9 rounded-[8px] flex items-center justify-center transition-all hover:scale-110"
              style={{ background: `hsl(${c})`, ...(on ? { boxShadow: `0 0 0 2px hsl(${c})` } : {}) }}>
              {on && <Icons.Check size={14} className="text-white" stroke={3} />}
            </button>
          );
        })}
        {/* Custom color — native picker */}
        <label title="Custom color"
          className="relative w-9 h-9 rounded-[8px] flex items-center justify-center cursor-pointer transition-all hover:scale-110 overflow-hidden"
          style={!isPreset
            ? { background: `hsl(${value})`, boxShadow: `0 0 0 2px hsl(${value})` }
            : { background: "conic-gradient(from 0deg, #ef4444, #f59e0b, #22c55e, #06b6d4, #3b82f6, #8b5cf6, #ec4899, #ef4444)" }}>
          {!isPreset
            ? <Icons.Check size={14} className="text-white" stroke={3} />
            : <span className="w-4.5 h-4.5 rounded-full bg-[hsl(var(--card))] flex items-center justify-center" style={{ width: 18, height: 18 }}><Icons.Plus size={11} className="text-[hsl(var(--foreground))]" /></span>}
          <input type="color" value={hslStrToHex(value)} onChange={(e) => onChange(hexToHslStr(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" aria-label="Custom color" />
        </label>
      </div>
      <div className="flex items-center gap-1.5 text-[11px] text-[hsl(var(--muted-foreground))]">
        <span className="w-3.5 h-3.5 rounded-full flex-shrink-0" style={{ background: `hsl(${value})` }} />
        <span className="font-mono">{hslStrToHex(value)}</span>
        {!isPreset && <span className="text-[hsl(263_70%_78%)] font-medium">· custom</span>}
      </div>
    </div>
  );
}

function Field({ label, sub, children }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wider font-semibold text-[hsl(var(--muted-foreground))] mb-1.5">{label}</div>
      {sub && <p className="text-[11.5px] text-[hsl(var(--muted-foreground))] -mt-0.5 mb-2 leading-snug">{sub}</p>}
      {children}
    </div>
  );
}

function ContentGroup({ title, names, selected, onToggle, color }) {
  return (
    <div>
      <div className="text-[11.5px] font-semibold mb-1.5">{title}</div>
      <div className="flex flex-wrap gap-1.5">
        {names.map(n => {
          const on = selected.includes(n);
          return (
            <button key={n} onClick={() => onToggle(n)}
              className={cn("px-2.5 py-1.5 rounded-[8px] text-[12px] font-medium border transition-all flex items-center gap-1.5",
                on ? "text-[hsl(var(--foreground))]" : "border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:border-[hsl(var(--primary)/0.4)]")}
              style={on ? { background: `hsl(${color} / 0.14)`, borderColor: `hsl(${color} / 0.5)` } : {}}>
              <span className="w-2 h-2 rounded-full" style={{ background: on ? `hsl(${color})` : "hsl(var(--muted-foreground) / 0.4)" }} />
              {n}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function AllSpaceNote() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center py-10 px-4">
      <span className="w-14 h-14 rounded-[14px] bg-[hsl(263_70%_60%/0.15)] text-[hsl(263_70%_80%)] flex items-center justify-center mb-4"><Icons.Layers size={26} /></span>
      <h3 className="text-[17px] font-bold tracking-tight">“All” is automatic</h3>
      <p className="text-[13px] text-[hsl(var(--muted-foreground))] mt-2 max-w-sm leading-relaxed">
        It's the <strong className="text-[hsl(var(--foreground))] font-semibold">union</strong> view of all your spaces — your safety net. It has no content or settings of its own: it shows everything, including items not yet filed.
      </p>
      <div className="mt-4 rounded-[10px] border border-[hsl(var(--border))] bg-[hsl(var(--muted)/0.3)] px-4 py-3 text-[12px] text-[hsl(var(--muted-foreground))] max-w-sm leading-snug flex items-start gap-2">
        <Icons.Shield size={14} className="mt-0.5 flex-shrink-0 text-[hsl(263_70%_75%)]" />
        <span>Non-deletable by design: as long as “All” exists, no task can “disappear” into the wrong space.</span>
      </div>
    </div>
  );
}

if (typeof window !== "undefined") {
  Object.assign(window, { SpacesModal });
}

/* ============================================================
   PARTAGE — UI (P25). Tabs + members accordion with per-module
   Read/Edit rights. Wellbeing (Habits) is private by default and
   shows a confidentiality warning when shared.
============================================================ */
function ShareTab({ active, onClick, icon: Icon, label, badge, color }) {
  return (
    <button onClick={onClick}
      className={cn("h-8 px-3 rounded-[7px] text-[12.5px] font-medium flex items-center gap-1.5 transition-colors",
        active ? "bg-[hsl(var(--card))] text-[hsl(var(--foreground))] shadow-sm" : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]")}>
      <Icon size={13} /> {label}
      {badge != null && (
        <span className="text-[10px] font-semibold tabular-nums px-1.5 rounded-full"
          style={{ background: `hsl(${color || "263 70% 60%"} / 0.18)`, color: `hsl(${color || "263 70% 60%"})` }}>{badge}</span>
      )}
    </button>
  );
}

const ROLE_LABEL = { owner: "Owner", member: "Member", pending: "Pending" };
function roleStyle(role) {
  if (role === "owner") return { background: "hsl(263 70% 60% / 0.18)", color: "hsl(263 70% 82%)" };
  if (role === "pending") return { background: "hsl(38 92% 55% / 0.16)", color: "hsl(38 92% 66%)" };
  return { background: "hsl(217 91% 60% / 0.16)", color: "hsl(217 91% 74%)" };
}
function memberSummary(m) {
  if (m.role === "owner") return "Full access · all modules";
  const n = SHARE_MODULES.filter((mod) => m.perms[mod.id] && m.perms[mod.id].on).length;
  return n === 0 ? "No access yet" : "Access to " + n + " module" + (n > 1 ? "s" : "");
}

function SharingPanel({ spaceId, space }) {
  const [members, ops] = useShares(spaceId);
  const [email, setEmail] = useState("");
  const [expandedId, setExpandedId] = useState(() => {
    const firstShared = members.find((m) => m.role !== "owner");
    return firstShared ? firstShared.id : null;
  });
  const [err, setErr] = useState(false);
  const accent = space?.color || "263 70% 60%";

  const submitInvite = () => {
    const e = email.trim();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e)) { setErr(true); setTimeout(() => setErr(false), 1400); return; }
    ops.invite(e);
    setEmail("");
  };

  return (
    <div className="space-y-4">
      {/* Invite */}
      <div className="rounded-[10px] border border-[hsl(var(--border))] bg-[hsl(var(--muted)/0.3)] p-3">
        <div className="text-[11px] uppercase tracking-wider font-semibold text-[hsl(var(--muted-foreground))] mb-2">Invite to this space</div>
        <div className="flex items-center gap-2">
          <div className="flex-1 min-w-0">
            <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com"
              onKeyDown={(e) => { if (e.key === "Enter") submitInvite(); }}
              style={err ? { borderColor: "hsl(0 84% 60%)" } : {}} />
          </div>
          <Button size="sm" icon={Icons.Mail} onClick={submitInvite}>Invite</Button>
        </div>
        <div className="text-[10.5px] text-[hsl(var(--muted-foreground))] mt-2 flex items-center gap-1.5">
          <Icons.HelpCircle size={11} /> Default level: <strong className="text-[hsl(var(--foreground))]">Read</strong> on Calendars + Tasks.
        </div>
      </div>

      {/* Members */}
      <div className="space-y-2">
        {members.map((m) => {
          const expanded = expandedId === m.id;
          const isOwner = m.role === "owner";
          return (
            <div key={m.id} className="rounded-[10px] border border-[hsl(var(--border))] overflow-hidden">
              <button onClick={() => !isOwner && setExpandedId(expanded ? null : m.id)}
                className={cn("w-full flex items-center gap-2.5 p-2.5 text-left transition-colors",
                  !isOwner && "hover:bg-[hsl(var(--accent)/0.4)]")}>
                <span className="w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-bold text-white flex-shrink-0"
                      style={{ background: `hsl(${m.color})` }}>{m.initials}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[13px] font-semibold truncate">{m.name}</span>
                    <span className="text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded" style={roleStyle(m.role)}>{ROLE_LABEL[m.role]}</span>
                  </div>
                  <div className="text-[11px] text-[hsl(var(--muted-foreground))] truncate">{memberSummary(m)}</div>
                </div>
                {!isOwner && <Icons.ChevronDown size={15} className={cn("flex-shrink-0 text-[hsl(var(--muted-foreground))] transition-transform", expanded && "rotate-180")} />}
              </button>

              {!isOwner && expanded && (
                <div className="border-t border-[hsl(var(--border))] p-3 anim-fade-in">
                  {m.role === "pending" && (
                    <div className="rounded-[8px] border border-[hsl(38_92%_55%/0.35)] bg-[hsl(38_92%_40%/0.10)] px-3 py-2 mb-3 text-[11.5px] flex items-center gap-2">
                      <Icons.Mail size={13} className="text-[hsl(38_92%_66%)] flex-shrink-0" />
                      <span className="flex-1">Invitation sent. Rights below apply once accepted.</span>
                    </div>
                  )}
                  <div className="text-[11px] uppercase tracking-wider font-semibold text-[hsl(var(--muted-foreground))] mb-2">Access by module</div>
                  <div className="rounded-[10px] border border-[hsl(var(--border))] divide-y divide-[hsl(var(--border))]">
                    {SHARE_MODULES.map((mod) => (
                      <ModuleRow key={mod.id} mod={mod} perm={m.perms[mod.id]} member={m} accent={accent}
                        onToggle={() => ops.toggleModule(m.id, mod.id)}
                        onLevel={(lvl) => ops.setLevel(m.id, mod.id, lvl)} />
                    ))}
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-[10.5px] text-[hsl(var(--muted-foreground))] flex items-center gap-1.5">
                      <Icons.Lock size={11} /> Private modules stay off until shared.
                    </span>
                    <Button variant="ghost" size="sm" icon={Icons.Trash}
                      className="text-[hsl(0_84%_70%)] hover:bg-[hsl(0_84%_60%/0.1)]"
                      onClick={() => { ops.remove(m.id); setExpandedId(null); }}>Remove access</Button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Privacy reminder */}
      <div className="rounded-[10px] border border-[hsl(263_70%_60%/0.4)] bg-[hsl(263_70%_30%/0.12)] p-3 flex items-start gap-2.5">
        <Icons.Shield size={15} className="mt-0.5 flex-shrink-0 text-[hsl(263_70%_80%)]" />
        <div className="text-[11.5px] leading-relaxed">
          <strong className="text-[hsl(263_70%_85%)]">Wellbeing is private by default.</strong>
          <span className="text-[hsl(var(--muted-foreground))]"> Habits, journal and energy are never shared automatically. Sharing them is explicit, granular and revocable — in line with Law 25 / PIPEDA / GDPR.</span>
        </div>
      </div>
    </div>
  );
}

function ModuleRow({ mod, perm, member, accent, onToggle, onLevel }) {
  const on = perm.on;
  const priv = mod.private;
  const IconC = Icons[mod.icon] || Icons.Layers;
  return (
    <div className={cn("p-2.5", priv && "bg-[hsl(263_70%_30%/0.10)]")}>
      <div className="flex items-center gap-2.5">
        <span className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0"
          style={{ background: priv ? "hsl(263 70% 60% / 0.18)" : `hsl(${accent} / 0.16)`, color: priv ? "hsl(263 70% 80%)" : `hsl(${accent})` }}>
          <IconC size={14} />
        </span>
        <div className="flex-1 min-w-0">
          <div className="text-[12.5px] font-semibold flex items-center gap-1.5">
            {mod.name}
            {priv && <span className="text-[8.5px] uppercase tracking-wider font-semibold px-1 py-0.5 rounded" style={{ background: "hsl(263 70% 60% / 0.2)", color: "hsl(263 70% 82%)" }}>private</span>}
          </div>
          <div className="text-[10.5px] mt-0.5" style={{ color: on ? `hsl(${accent})` : "hsl(var(--muted-foreground))" }}>
            {on ? (perm.level === "edit" ? "Edit" : "Read") : (priv ? "Not shared" : "No access")}
          </div>
        </div>
        {/* Read / Edit segmented */}
        <div className={cn("inline-flex bg-[hsl(var(--muted)/0.6)] rounded-[7px] p-0.5 gap-0.5", !on && "opacity-40 pointer-events-none")}>
          {["read", "edit"].map((lvl) => (
            <button key={lvl} onClick={() => onLevel(lvl)}
              className={cn("h-7 px-2.5 rounded-[5px] text-[11px] font-semibold transition-colors",
                perm.level === lvl ? "text-white" : "text-[hsl(var(--muted-foreground))]")}
              style={perm.level === lvl ? { background: `hsl(${accent})` } : {}}>
              {lvl === "read" ? "Read" : "Edit"}
            </button>
          ))}
        </div>
        <Switch checked={on} onChange={onToggle} />
      </div>
      {priv && on && (
        <div className="rounded-[8px] border border-[hsl(263_70%_60%/0.4)] bg-[hsl(263_70%_30%/0.12)] px-2.5 py-2 mt-2.5 text-[11px] leading-snug flex items-start gap-2">
          <Icons.AlertTriangle size={12} className="mt-0.5 flex-shrink-0 text-[hsl(263_70%_80%)]" />
          <span><strong className="text-[hsl(263_70%_85%)]">Wellbeing data shared.</strong> <span className="text-[hsl(var(--muted-foreground))]">{(member.name || "").split(" ")[0]} will see your habits. Reversible anytime.</span></span>
        </div>
      )}
    </div>
  );
}
