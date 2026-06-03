/* global React, Icons, Button, Card, SectionTitle, Badge, Input, Checkbox, cn,
          useState, useEffect, useRef */

/* ============================================================
   MODAL — base overlay
============================================================ */
function Modal({ open, onClose, children, size = "lg" }) {
  useEffect(() => {
    if (!open) return;
    const h = (e) => { if (e.key === "Escape") onClose?.(); };
    window.addEventListener("keydown", h);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", h);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;
  const widths = { sm: "max-w-sm", md: "max-w-md", lg: "max-w-lg", xl: "max-w-xl", "2xl": "max-w-2xl" };
  return (
    <div className="fixed inset-0 z-[50] flex items-center justify-center p-4 anim-fade-in" style={{ backdropFilter: "blur(8px)", background: "rgba(0,0,0,0.55)" }}
         onClick={(e) => { if (e.target === e.currentTarget) onClose?.(); }}>
      <div className={cn("relative w-full rounded-[14px] border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-2xl anim-scale-in flex flex-col max-h-[92vh] overflow-hidden", widths[size])}>
        {children}
      </div>
    </div>
  );
}

function ModalHeader({ title, onClose }) {
  return (
    <div className="px-5 pt-5 pb-3 flex items-start justify-between">
      <h2 className="text-[20px] font-bold tracking-tight">{title}</h2>
      <button onClick={onClose} className="w-7 h-7 rounded-md hover:bg-[hsl(var(--accent))] flex items-center justify-center text-[hsl(var(--muted-foreground))] -mr-1">
        <Icons.X size={16} />
      </button>
    </div>
  );
}

function ModalBody({ children, className = "" }) {
  return <div className={cn("px-5 pb-4 overflow-y-auto flex-1", className)}>{children}</div>;
}

function ModalFooter({ children }) {
  return <div className="px-5 py-3.5 border-t border-[hsl(var(--border))] flex items-center justify-end gap-2 bg-[hsl(var(--background)/0.4)]">{children}</div>;
}

/* ============================================================
   Reusable form bits
============================================================ */
function FieldRow({ icon: Icon, label, children, sub }) {
  return (
    <div className="space-y-1.5">
      {label && (
        <div className="flex items-center gap-2 text-[12.5px] font-medium">
          {Icon && <Icon size={13} className="text-[hsl(var(--muted-foreground))]" />}
          <span>{label}</span>
          {sub && <span className="text-[hsl(var(--muted-foreground))] font-normal text-[11.5px]">{sub}</span>}
        </div>
      )}
      {children}
    </div>
  );
}

function FauxSelect({ value, icon, placeholder = "Select…", colorDot }) {
  return (
    <div className="h-10 px-3 rounded-[8px] border border-[hsl(var(--input))] bg-[hsl(var(--background))] flex items-center gap-2 cursor-pointer hover:border-[hsl(var(--primary)/0.4)] transition-colors text-[13px]">
      {colorDot && <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: `hsl(${colorDot})` }} />}
      {icon && !colorDot && icon}
      <span className={value ? "" : "text-[hsl(var(--muted-foreground))]"}>{value || placeholder}</span>
      <Icons.ChevronDown size={13} className="ml-auto text-[hsl(var(--muted-foreground))]" />
    </div>
  );
}

function PillButton({ active, onClick, children, className = "" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-9 px-3.5 rounded-[10px] text-[12.5px] font-medium transition-all border tabular-nums",
        active
          ? "bg-[hsl(var(--primary))] text-white border-transparent"
          : "border-[hsl(var(--border))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))] hover:border-[hsl(var(--primary)/0.4)]",
        className
      )}
    >{children}</button>
  );
}

function MarkdownToolbar() {
  const tools = [
    { I: Icons.Menu, label: "Format" },
    { l: "B", className: "font-bold", label: "Bold" },
    { l: "I", className: "italic", label: "Italic" },
    { I: () => <span className="font-mono text-[12px]">{"<>"}</span>, label: "Code" },
    { l: "H₂", className: "font-semibold text-[11px]", label: "Heading" },
    { l: "\u201D", className: "text-[14px]", label: "Quote" },
    { I: () => <span className="text-[14px]">≡</span>, label: "List" },
    { I: () => <span className="font-mono text-[10px]">1.</span>, label: "Numbered list" },
    { I: Icons.CheckSquare, label: "Checklist" },
    { I: () => <span>🔗</span>, label: "Link" },
  ];
  return (
    <div className="flex items-center gap-0.5 px-2 py-1.5 border-b border-[hsl(var(--border))] bg-[hsl(var(--muted)/0.4)] rounded-t-[8px]">
      {tools.map((t, i) => (
        <button key={i} title={t.label}
                className={cn("w-7 h-7 rounded-md hover:bg-[hsl(var(--accent))] flex items-center justify-center text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]", t.className)}>
          {t.I ? <t.I size={13} /> : t.l}
        </button>
      ))}
    </div>
  );
}

function MarkdownEditor({ value, onChange, placeholder, rows = 4 }) {
  return (
    <div className="rounded-[8px] border border-[hsl(var(--input))] bg-[hsl(var(--background))] focus-within:ring-2 focus-within:ring-[hsl(var(--ring))] focus-within:border-transparent transition-all">
      <MarkdownToolbar />
      <textarea
        value={value}
        onChange={e => onChange?.(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="w-full px-3 py-2 text-[13px] bg-transparent resize-none focus:outline-none placeholder:text-[hsl(var(--muted-foreground)/0.7)]"
      />
      <div className="px-3 py-1.5 border-t border-[hsl(var(--border))] text-[10.5px] text-[hsl(var(--muted-foreground))] bg-[hsl(var(--muted)/0.25)] rounded-b-[8px]">
        Markdown supported: <code className="font-mono">**bold**</code>, <code className="font-mono">_italic_</code>, <code className="font-mono">`code`</code>, <code className="font-mono">[link](url)</code>
      </div>
    </div>
  );
}

/* ============================================================
   TASK MODAL — matches reference screenshot
============================================================ */
const STATUS_OPTIONS = [
  { id: "todo",     label: "To do" },
  { id: "doing",    label: "In progress" },
  { id: "done",     label: "Done" },
  { id: "canceled", label: "Canceled" },
];

const PRIORITY_OPTIONS = [
  { id: "URGENT", label: "Urgent", color: "0 84% 60%" },
  { id: "HIGH",   label: "High",    color: "20 90% 55%" },
  { id: "MEDIUM", label: "Medium",  color: "50 90% 55%" },
  { id: "LOW",    label: "Low",     color: "142 70% 50%" },
];

const DURATION_PRESETS = [
  { v: 15, l: "15 min" },
  { v: 30, l: "30 min" },
  { v: 60, l: "1h" },
  { v: 120, l: "2h" },
  { v: 240, l: "4h" },
];

function TaskModal({ open, onClose, defaults = {} }) {
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("todo");
  const [priority, setPriority] = useState("MEDIUM");
  const [dueDate, setDueDate] = useState("");
  const [planDate, setPlanDate] = useState("");
  const [planTime, setPlanTime] = useState("");
  const [duration, setDuration] = useState(30);
  const [desc, setDesc] = useState("");
  const [checklist, setChecklist] = useState([]);
  const [checkInput, setCheckInput] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [url, setUrl] = useState("");
  const [energy, setEnergy] = useState("MEDIUM");
  const [notes, setNotes] = useState("");
  const titleRef = useRef(null);

  // Signature of defaults so the prefill re-runs when the slot payload changes,
  // not only on open-toggle (fixes duration not carrying over on rapid re-open).
  const defaultsKey = open ? JSON.stringify(defaults || {}) : "";

  useEffect(() => {
    if (open) {
      setTitle(defaults.title || ""); setStatus("todo"); setPriority(defaults.priority || "MEDIUM");
      setDueDate(""); setPlanDate(defaults.planDate || ""); setPlanTime(defaults.planTime || ""); setDuration(defaults.duration || 30);
      setDesc(""); setChecklist([]); setCheckInput("");
      setTags([]); setTagInput("");
      setShowAdvanced(false); setUrl(""); setEnergy("MEDIUM"); setNotes("");
      setTimeout(() => titleRef.current?.focus(), 80);
    }
  }, [open, defaultsKey]);

  const addCheck = () => {
    const v = checkInput.trim();
    if (v) { setChecklist([...checklist, { id: Date.now(), title: v, done: false }]); setCheckInput(""); }
  };
  const addTag = (v) => {
    const t = (v ?? tagInput).trim();
    if (t && !tags.includes(t)) setTags([...tags, t]);
    setTagInput("");
  };

  const priorityObj = PRIORITY_OPTIONS.find(p => p.id === priority);
  const statusObj = STATUS_OPTIONS.find(s => s.id === status);

  return (
    <Modal open={open} onClose={onClose} size="xl">
      <ModalHeader title="New task" onClose={onClose} />

      <ModalBody className="space-y-4">
        {/* Title with mic */}
        <div className="relative">
          <input
            ref={titleRef}
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Task title"
            className="w-full h-11 pl-3 pr-11 rounded-[8px] border border-[hsl(var(--input))] bg-[hsl(var(--background))] text-[14px] font-medium focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] placeholder:text-[hsl(var(--muted-foreground))]"
          />
          <button title="Voice dictation" className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-md hover:bg-[hsl(var(--accent))] flex items-center justify-center text-[hsl(var(--muted-foreground))]">
            <Icons.Mic size={14} />
          </button>
        </div>

        {/* Statut + Priorité */}
        <div className="grid grid-cols-2 gap-3">
          <FieldRow label="Status">
            <Dropdown
              value={statusObj.label}
              onChange={setStatus}
              options={STATUS_OPTIONS}
            />
          </FieldRow>
          <FieldRow label="Priority">
            <Dropdown
              value={<span className="flex items-center gap-1.5"><FlagIcon color={priorityObj.color} /> {priorityObj.label}</span>}
              onChange={setPriority}
              options={PRIORITY_OPTIONS.map(p => ({ id: p.id, label: p.label, color: p.color, withFlag: true }))}
            />
          </FieldRow>
        </div>

        {/* Date d'échéance — chips quick + personnalisée */}
        <FieldRow icon={Icons.Calendar} label="Due date">
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: "today",     l: "Today",            sub: "Sat May 24" },
              { id: "tomorrow",  l: "Tomorrow",         sub: "Sun May 25" },
              { id: "monday",    l: "Monday",           sub: "Mon 26" },
              { id: "friday",    l: "Friday",           sub: "Fri 29" },
              { id: "next-week", l: "Next week",        sub: "Mon Jun 02" },
            ].map(c => (
              <button
                key={c.id}
                onClick={() => setDueDate(dueDate === c.id ? "" : c.id)}
                className={cn(
                  "h-8 px-3 rounded-[8px] text-[11.5px] font-medium transition-colors flex items-center gap-1.5",
                  dueDate === c.id
                    ? "bg-[hsl(var(--primary))] text-white"
                    : "border border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))]"
                )}
              >
                <span>{c.l}</span>
                {dueDate === c.id && <span className="opacity-75 text-[10px]">· {c.sub}</span>}
              </button>
            ))}
            <button className="h-8 px-3 rounded-[8px] text-[11.5px] font-medium border border-dashed border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))] flex items-center gap-1.5">
              <Icons.Calendar size={11} /> Date…
            </button>
          </div>
        </FieldRow>

        {/* Planifier */}
        <FieldRow icon={Icons.Clock} label="Schedule" sub="optional">
          <div className="grid grid-cols-[1fr_auto] gap-2">
            <button className="h-10 px-3 rounded-[8px] border border-[hsl(var(--input))] bg-[hsl(var(--background))] flex items-center gap-2 text-[13px] hover:border-[hsl(var(--primary)/0.4)] transition-colors text-left">
              <Icons.Calendar size={13} className="text-[hsl(var(--muted-foreground))]" />
              <span className={planDate ? "" : "text-[hsl(var(--muted-foreground))]"}>{planDate || "Date"}</span>
            </button>
            <button className="h-10 px-3 rounded-[8px] border border-[hsl(var(--input))] bg-[hsl(var(--background))] flex items-center gap-2 text-[13px] hover:border-[hsl(var(--primary)/0.4)] transition-colors min-w-[112px]">
              <Icons.Clock size={13} className="text-[hsl(var(--muted-foreground))]" />
              <span className={planTime ? "" : "text-[hsl(var(--muted-foreground))]"}>{planTime || "Time"}</span>
            </button>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap pt-1">
            {DURATION_PRESETS.map(d => (
              <PillButton key={d.v} active={duration === d.v} onClick={() => setDuration(d.v)}>{d.l}</PillButton>
            ))}
            <button className="h-9 px-3 rounded-[10px] text-[12.5px] font-medium border border-dashed border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))] flex items-center gap-1">
              <Icons.Edit size={11}/> Custom
            </button>
          </div>
        </FieldRow>

        {/* Description */}
        <FieldRow>
          <MarkdownEditor value={desc} onChange={setDesc} placeholder="Description (Markdown supported)" />
        </FieldRow>

        {/* Liste de vérification */}
        <FieldRow icon={Icons.CheckSquare} label="Checklist" sub={checklist.length > 0 ? `· ${checklist.filter(c => c.done).length}/${checklist.length}` : ""}>
          {checklist.length > 0 && (
            <div className="space-y-1 mb-1.5">
              {checklist.map((c, i) => (
                <div key={c.id} className="flex items-center gap-2.5 p-2 rounded-[6px] bg-[hsl(var(--muted)/0.3)] group">
                  <Checkbox checked={c.done} onChange={(v) => setChecklist(arr => arr.map((x, j) => j === i ? { ...x, done: v } : x))} />
                  <span className={cn("flex-1 text-[12.5px]", c.done && "line-through text-[hsl(var(--muted-foreground))]")}>{c.title}</span>
                  <button onClick={() => setChecklist(arr => arr.filter((_, j) => j !== i))} className="opacity-0 group-hover:opacity-100 text-[hsl(var(--muted-foreground))] hover:text-[hsl(0_84%_60%)]">
                    <Icons.X size={11} />
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="flex items-center gap-2">
            <Icons.Plus size={14} className="text-[hsl(var(--muted-foreground))] flex-shrink-0" />
            <input
              value={checkInput}
              onChange={e => setCheckInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addCheck(); } }}
              placeholder="Add an item"
              className="flex-1 h-10 px-3 rounded-[8px] border border-[hsl(var(--input))] bg-[hsl(var(--background))] text-[13px] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] placeholder:text-[hsl(var(--muted-foreground))]"
            />
          </div>
        </FieldRow>

        {/* Étiquettes */}
        <FieldRow icon={() => <span className="text-[13px]">🏷</span>} label="Tags">
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {tags.map(t => (
                <span key={t} className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[hsl(var(--primary)/0.15)] text-[hsl(263_70%_75%)] text-[11px] font-medium">
                  #{t}
                  <button onClick={() => setTags(tags.filter(x => x !== t))} className="hover:text-white">
                    <Icons.X size={10} stroke={3} />
                  </button>
                </span>
              ))}
            </div>
          )}
          <div className="flex items-center gap-2">
            <input
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addTag(); } }}
              placeholder="Add a tag"
              className="flex-1 h-10 px-3 rounded-[8px] border border-[hsl(var(--input))] bg-[hsl(var(--background))] text-[13px] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] placeholder:text-[hsl(var(--muted-foreground))]"
            />
            <button onClick={() => addTag()} className="w-10 h-10 rounded-[8px] border border-[hsl(var(--input))] bg-[hsl(var(--background))] flex items-center justify-center text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))]">
              <Icons.Plus size={14} />
            </button>
          </div>
          {tagInput === "" && tags.length < 4 && (
            <div className="flex flex-wrap items-center gap-1 mt-2">
              <span className="text-[10.5px] text-[hsl(var(--muted-foreground))] mr-1">Suggestions:</span>
              {["Client","Code","Design","Review","Admin","Q2"].filter(s => !tags.includes(s)).slice(0, 5).map(t => (
                <button key={t} onClick={() => addTag(t)} className="text-[10.5px] px-1.5 py-0.5 rounded-full bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))]">
                  +{t}
                </button>
              ))}
            </div>
          )}
        </FieldRow>

        {/* Plus d'options */}
        <button onClick={() => setShowAdvanced(s => !s)} className="text-[12.5px] font-semibold text-[hsl(var(--primary))] hover:underline">
          {showAdvanced ? "Hide options" : "More options"}
        </button>

        {showAdvanced && (
          <div className="space-y-4 anim-fade-in pt-1 border-t border-[hsl(var(--border))]">
            <div className="pt-3" />
            {/* URL */}
            <FieldRow icon={() => <span className="text-[12px]">🔗</span>} label="Linked URL">
              <input
                value={url}
                onChange={e => setUrl(e.target.value)}
                placeholder="https://…"
                className="w-full h-10 px-3 rounded-[8px] border border-[hsl(var(--input))] bg-[hsl(var(--background))] text-[13px] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] placeholder:text-[hsl(var(--muted-foreground))]"
              />
            </FieldRow>

            {/* Energy */}
            <FieldRow icon={Icons.Zap} label="Energy required" sub="helps AI planning">
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "LOW",    label: "Low",     emoji: "🔋", color: "142 70% 50%" },
                  { id: "MEDIUM", label: "Medium",  emoji: "⚡", color: "38 92% 55%" },
                  { id: "HIGH",   label: "High",    emoji: "🔥", color: "0 84% 60%" },
                ].map(e => (
                  <button key={e.id} onClick={() => setEnergy(e.id)}
                    className={cn(
                      "h-10 px-3 rounded-[8px] border flex items-center justify-center gap-2 text-[12.5px] font-medium transition-all",
                      energy === e.id
                        ? "bg-[hsl(var(--primary)/0.1)] border-[hsl(var(--primary)/0.5)] text-[hsl(var(--foreground))]"
                        : "border-[hsl(var(--input))] bg-[hsl(var(--background))] text-[hsl(var(--muted-foreground))] hover:border-[hsl(var(--primary)/0.3)] hover:text-[hsl(var(--foreground))]"
                    )}
                  >
                    <span>{e.emoji}</span>
                    {e.label}
                  </button>
                ))}
              </div>
            </FieldRow>

            {/* Linked event */}
            <FieldRow icon={Icons.Calendar} label="Link to an event" sub="optional">
              <button className="w-full flex items-center gap-2 p-3 rounded-[8px] border border-dashed border-[hsl(var(--border))] text-[12.5px] text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent)/0.3)]">
                <Icons.Calendar size={13} />
                Choose an event…
              </button>
            </FieldRow>

            {/* Notes */}
            <FieldRow label="Personal notes">
              <MarkdownEditor value={notes} onChange={setNotes} placeholder="Personal notes (Markdown supported)" rows={3} />
            </FieldRow>
          </div>
        )}
      </ModalBody>

      <ModalFooter>
        <div className="flex items-center gap-1.5 text-[11px] text-[hsl(var(--muted-foreground))] mr-auto">
          <kbd className="px-1.5 py-0.5 rounded bg-[hsl(var(--muted))] text-[10px] font-mono">⌘</kbd>
          <kbd className="px-1.5 py-0.5 rounded bg-[hsl(var(--muted))] text-[10px] font-mono">↵</kbd>
          <span>to create</span>
        </div>
        <Button variant="outline" size="sm" icon={Icons.Calendar} disabled={!title.trim()}>Save & schedule</Button>
        <Button size="sm" disabled={!title.trim()} onClick={onClose}>Create</Button>
      </ModalFooter>
    </Modal>
  );
}

function FlagIcon({ color }) {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill={`hsl(${color})`} stroke="none">
      <path d="M4 2v20M5 3h11l-2 4 2 4H5"/>
    </svg>
  );
}

function Dropdown({ value, onChange, options }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(o => !o)}
        className="w-full h-10 px-3 rounded-[8px] border border-[hsl(var(--input))] bg-[hsl(var(--background))] flex items-center gap-2 text-[13px] hover:border-[hsl(var(--primary)/0.4)] transition-colors">
        <span className="flex-1 text-left flex items-center">{value}</span>
        <Icons.ChevronDown size={13} className={cn("text-[hsl(var(--muted-foreground))] transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="absolute z-50 left-0 right-0 mt-1.5 rounded-[8px] border border-[hsl(var(--border))] bg-[hsl(var(--popover))] shadow-xl py-1 anim-fade-in">
          {options.map(o => (
            <button key={o.id} onClick={() => { onChange(o.id); setOpen(false); }}
              className="w-full px-3 py-1.5 flex items-center gap-2 text-[13px] hover:bg-[hsl(var(--accent))] text-left">
              {o.withFlag && <FlagIcon color={o.color} />}
              <span className="flex-1">{o.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ============================================================
   ENERGY MODAL — opens after picking energy level on Home
============================================================ */
const ENERGY_DETAILS = {
  1: { emoji: "😴", title: "You feel exhausted", subtitle: "Here are a few tips for you", glow: "0 84% 60%",
       tips: [
         { i: Icons.Heart, t: "Rest up", d: "Favor LOW tasks and soothing rituals. Avoid coffee after 2pm." },
         { i: Icons.Coffee, t: "Active break", d: "10 minutes walking outside, a glass of water, a little sun." },
         { i: Icons.Calendar, t: "Postpone the hard stuff", d: "Push HIGH/URGENT tasks to tomorrow morning. The app can do it for you." },
       ]},
  2: { emoji: "😕", title: "You're running low", subtitle: "Here are a few tips for you", glow: "20 90% 55%",
       tips: [
         { i: Icons.Coffee, t: "Light recharge", d: "A real 20-min break · a healthy snack · no screen." },
         { i: Icons.ListChecks, t: "Aim for quick wins", d: "Finish 2-3 short tasks to restart the momentum." },
         { i: Icons.Brain, t: "Avoid complexity", d: "No important decisions now — note them for later." },
       ]},
  3: { emoji: "🙂", title: "You're steady", subtitle: "Here are a few tips for you", glow: "50 90% 55%",
       tips: [
         { i: Icons.CheckSquare, t: "Move steadily", d: "Short Pomodoros (25/5) on MEDIUM tasks." },
         { i: Icons.Activity, t: "Move a little", d: "A bit of physical activity will boost your energy at midday." },
         { i: Icons.Target, t: "Pick your priority", d: "Just one HIGH task to tackle now — no more." },
       ]},
  4: { emoji: "😄", title: "You're in good shape", subtitle: "Here are a few tips for you", glow: "142 70% 50%",
       tips: [
         { i: Icons.Sparkles, t: "Ride the flow", d: "Now's the time for 60-90 min of deep work without interruption." },
         { i: Icons.Brain, t: "Complex tasks", d: "Tackle the ones that demand creativity or analysis." },
         { i: Icons.Star, t: "Advance your goals", d: "Use it to push a long-term goal forward." },
       ]},
  5: { emoji: "🔥", title: "You feel on top", subtitle: "Here are a few tips for you", glow: "263 70% 60%",
       tips: [
         { i: Icons.Sparkles, t: "Tackle the hardest", d: "It's the perfect time to take on the day's hardest or most important task." },
         { i: Icons.Brain,    t: "Solve problems", d: "Use this mental clarity to solve complex problems or make important decisions." },
         { i: Icons.Heart,    t: "Preserve this energy", d: "Note what put you in this state (sleep, food, exercise) so you can reproduce it." },
       ]},
};

const MOOD_REASONS = [
  "Slept well", "Slept badly", "Stressed", "Motivated", "Exercised this morning",
  "Accumulated fatigue", "Good news", "Worried", "Balanced meal",
  "Too much coffee", "Gloomy weather", "Back-to-back meetings"
];

function EnergyModal({ open, onClose, level = 5 }) {
  const [reasons, setReasons] = useState([]);
  const [note, setNote] = useState("");
  const d = ENERGY_DETAILS[level] || ENERGY_DETAILS[5];

  useEffect(() => {
    if (open) { setReasons([]); setNote(""); }
  }, [open, level]);

  const toggle = (r) => setReasons(s => s.includes(r) ? s.filter(x => x !== r) : [...s, r]);

  return (
    <Modal open={open} onClose={onClose} size="lg">
      <div className="absolute inset-0 pointer-events-none rounded-[14px] opacity-60" style={{
        background: `radial-gradient(circle at 50% 0%, hsl(${d.glow} / 0.25), transparent 60%)`,
      }} />

      <div className="relative">
        <div className="px-6 pt-6 pb-2 flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-[12px] flex items-center justify-center text-[28px] flex-shrink-0" style={{
              background: `hsl(${d.glow} / 0.18)`,
              boxShadow: `inset 0 0 0 1px hsl(${d.glow} / 0.3)`,
            }}>
              {d.emoji}
            </div>
            <div>
              <h2 className="text-[22px] font-bold tracking-tight" style={{ color: `hsl(${d.glow})` }}>{d.title}</h2>
              <p className="text-[13px] text-[hsl(var(--muted-foreground))] mt-0.5">{d.subtitle}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-md hover:bg-[hsl(var(--accent))] flex items-center justify-center text-[hsl(var(--muted-foreground))]">
            <Icons.X size={16} />
          </button>
        </div>
      </div>

      <ModalBody className="space-y-5 pt-3">
        {/* Tips */}
        <div className="space-y-2">
          {d.tips.map((tip, i) => (
            <div key={i} className="flex items-start gap-3 p-3.5 rounded-[10px] bg-[hsl(var(--muted)/0.35)] border border-[hsl(var(--border))]">
              <div className="w-9 h-9 rounded-[8px] flex items-center justify-center flex-shrink-0" style={{
                background: `hsl(${d.glow} / 0.15)`, color: `hsl(${d.glow})`,
              }}>
                <tip.i size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13.5px] font-semibold">{tip.t}</div>
                <div className="text-[12px] text-[hsl(var(--muted-foreground))] mt-0.5 leading-relaxed">{tip.d}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Reasons */}
        <div>
          <div className="flex items-center gap-2 text-[13px] font-semibold mb-3">
            <Icons.Pen size={13} className="text-[hsl(var(--muted-foreground))]" />
            What explains this state?
            <span className="text-[hsl(var(--muted-foreground))] font-normal text-[11.5px]">(optional)</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {MOOD_REASONS.map(r => (
              <button key={r} onClick={() => toggle(r)}
                className={cn(
                  "px-3 h-8 rounded-full text-[12px] font-medium transition-all border",
                  reasons.includes(r)
                    ? "bg-[hsl(var(--primary)/0.15)] border-[hsl(var(--primary)/0.5)] text-[hsl(263_70%_80%)]"
                    : "border-[hsl(var(--border))] bg-[hsl(var(--background))] text-[hsl(var(--muted-foreground))] hover:border-[hsl(var(--primary)/0.3)] hover:text-[hsl(var(--foreground))]"
                )}
              >{r}</button>
            ))}
          </div>
        </div>

        {/* Note */}
        <textarea
          value={note}
          onChange={e => setNote(e.target.value)}
          rows={3}
          placeholder="Add a personal note…"
          className="w-full rounded-[10px] border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3.5 py-2.5 text-[13px] resize-none focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] placeholder:text-[hsl(var(--muted-foreground))]"
        />
      </ModalBody>

      <ModalFooter>
        <Button variant="outline" size="sm" onClick={onClose}>Close</Button>
        <Button size="sm" onClick={onClose}>Save</Button>
      </ModalFooter>
    </Modal>
  );
}

Object.assign(window, {
  Modal, ModalHeader, ModalBody, ModalFooter,
  TaskModal, EnergyModal,
  FieldRow, FauxSelect, PillButton, MarkdownToolbar, MarkdownEditor, FlagIcon, Dropdown
});
