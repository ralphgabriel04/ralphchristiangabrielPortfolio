/* global React, useState, useEffect, useRef, Icons, Modal, ModalHeader, ModalBody, ModalFooter,
          Button, Input, Checkbox, Switch, cn, FieldRow, PillButton, useT, HABIT_ICONS, HABIT_COLORS */
/* ============================================================
   EXTRA MODALS — Habit / Goal / Rule / Event creation+edit.
   All controlled-form modals; they call onSave(payload) on submit
   and close themselves.
============================================================ */

const ICON_BANK = ["Brain", "Run", "Book", "Pen", "Heart", "Coffee", "Sun", "Moon",
                   "Activity", "Target", "Star", "Flame", "Sparkles", "Zap", "Shield",
                   "Clock", "Mail", "Calendar", "CheckSquare", "Pause"];

function IconPicker({ value, onChange, color }) {
  // The selected icon tile tints to the live color selection (symbiosis with
  // the Color picker) — falls back to primary if no color is provided.
  const accent = color || "263 70% 60%";
  return (
    <div className="grid grid-cols-10 gap-1">
      {ICON_BANK.map(name => {
        const I = Icons[name];
        if (!I) return null;
        const active = value === name;
        return (
          <button
            key={name}
            type="button"
            onClick={() => onChange(name)}
            style={active ? { background: `hsl(${accent} / 0.15)`, borderColor: `hsl(${accent} / 0.6)`, color: `hsl(${accent})` } : undefined}
            className={cn(
              "h-9 w-9 rounded-[8px] flex items-center justify-center transition-all border",
              active
                ? ""
                : "border-transparent text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--foreground))]"
            )}
            title={name}
          >
            <I size={15} />
          </button>
        );
      })}
    </div>
  );
}

function ColorPicker({ value, onChange, palette }) {
  // Calibrated palette + native custom-color tile (shared component).
  return <SwatchPicker value={value} onChange={onChange} palette={palette} ring="foreground" />;
}

/* ============================================================
   HABIT MODAL
============================================================ */
function HabitModal({ open, onClose, initial, onSave }) {
  const t = (typeof useT === "function") ? useT() : (k) => k;
  const [name, setName] = useState("");
  const [iconName, setIconName] = useState("Star");
  const [color, setColor] = useState("263 70% 60%");
  const [freq, setFreq] = useState("Daily");
  const [type, setType] = useState("Flexible");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("10 min");

  useEffect(() => {
    if (open) {
      setName(initial?.name || "");
      setIconName(initial?.iconName || "Star");
      setColor(initial?.color || "263 70% 60%");
      setFreq(initial?.freq || "Daily");
      setType(initial?.type ? (initial.type.startsWith("Fixed") ? "Fixed" : initial.type) : "Flexible");
      setTime(initial?.type?.includes("·") ? initial.type.split("·")[1].trim() : "");
      setDuration(initial?.duration || "10 min");
    }
  }, [open, initial]);

  const submit = () => {
    if (!name.trim()) return;
    const finalType = type === "Fixed" && time ? `Fixed · ${time}` : type;
    onSave({ name: name.trim(), iconName, color, freq, type: finalType, duration });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} size="lg">
      <ModalHeader title={initial ? t("common.edit") + " — " + (window.__dpmTr ? window.__dpmTr(initial.name || "habit") : (initial.name || "habit")) : t("habits.newHabit")} onClose={onClose} />
      <ModalBody className="space-y-4">
        <FieldRow label={t("common.title")}>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            autoFocus
            placeholder="Morning meditation, walk…"
            className="w-full h-11 px-3 rounded-[8px] border border-[hsl(var(--input))] bg-[hsl(var(--background))] text-[14px] font-medium focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
          />
        </FieldRow>

        <FieldRow label={t("common.icon")}>
          <IconPicker value={iconName} onChange={setIconName} color={color} />
        </FieldRow>

        <FieldRow label={t("common.color")}>
          <ColorPicker value={color} onChange={setColor} />
        </FieldRow>

        <div className="grid grid-cols-2 gap-3">
          <FieldRow label={t("habit.frequency")}>
            <select value={freq} onChange={e => setFreq(e.target.value)}
              className="w-full h-10 px-3 rounded-[8px] border border-[hsl(var(--input))] bg-[hsl(var(--background))] text-[13px]">
              <option value="Daily">{t("habit.freq.daily")}</option>
              <option value="3×/wk">{t("habit.freq.3wk")}</option>
              <option value="5×/wk">{t("habit.freq.5wk")}</option>
              <option value="Weekly">{t("habit.freq.weekly")}</option>
              <option value="Monthly">{t("habit.freq.monthly")}</option>
            </select>
          </FieldRow>
          <FieldRow label="Type">
            <select value={type} onChange={e => setType(e.target.value)}
              className="w-full h-10 px-3 rounded-[8px] border border-[hsl(var(--input))] bg-[hsl(var(--background))] text-[13px]">
              <option value="Flexible">{t("habit.type.flexible")}</option>
              <option value="Fixed">{t("habit.type.fixed")}</option>
              <option value="Conditional">{t("habit.type.conditional")}</option>
            </select>
          </FieldRow>
        </div>

        {type === "Fixed" && (
          <div className="grid grid-cols-2 gap-3">
            <FieldRow label={t("habit.time")}>
              <input type="time" value={time} onChange={e => setTime(e.target.value)}
                className="w-full h-10 px-3 rounded-[8px] border border-[hsl(var(--input))] bg-[hsl(var(--background))] text-[13px]" />
            </FieldRow>
            <FieldRow label={t("common.duration")}>
              <input value={duration} onChange={e => setDuration(e.target.value)}
                placeholder="10 min"
                className="w-full h-10 px-3 rounded-[8px] border border-[hsl(var(--input))] bg-[hsl(var(--background))] text-[13px]" />
            </FieldRow>
          </div>
        )}
        {type !== "Fixed" && (
          <FieldRow label="Duration">
            <input value={duration} onChange={e => setDuration(e.target.value)}
              placeholder="—"
              className="w-full h-10 px-3 rounded-[8px] border border-[hsl(var(--input))] bg-[hsl(var(--background))] text-[13px]" />
          </FieldRow>
        )}
      </ModalBody>
      <ModalFooter>
        <Button variant="outline" size="sm" onClick={onClose}>{t("common.cancel")}</Button>
        <Button size="sm" disabled={!name.trim()} onClick={submit}>{initial ? t("common.save") : t("common.create")}</Button>
      </ModalFooter>
    </Modal>
  );
}

/* ============================================================
   GOAL MODAL
============================================================ */
function GoalModal({ open, onClose, initial, onSave }) {
  const t = (typeof useT === "function") ? useT() : (k) => k;
  const [title, setTitle] = useState("");
  const [cat, setCat] = useState("Personal");
  const [iconName, setIconName] = useState("Target");
  const [color, setColor] = useState("263 70% 60%");
  const [max, setMax] = useState(100);
  const [unit, setUnit] = useState("%");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  useEffect(() => {
    if (open) {
      setTitle(initial?.t || "");
      setCat(initial?.cat || "Personal");
      setIconName(initial?.iconName || "Target");
      setColor(initial?.color || "263 70% 60%");
      setMax(initial?.max || 100);
      setUnit(initial?.unit || "%");
      setFrom(initial?.from || "");
      setTo(initial?.to || "");
    }
  }, [open, initial]);

  const submit = () => {
    if (!title.trim()) return;
    onSave({ t: title.trim(), cat, iconName, color, max: Number(max) || 100, unit, from, to });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} size="lg">
      <ModalHeader title={initial ? t("common.edit") + " — " + (window.__dpmTr ? window.__dpmTr(initial.t || "goal") : (initial.t || "goal")) : t("goals.newGoal")} onClose={onClose} />
      <ModalBody className="space-y-4">
        <FieldRow label={t("common.title")}>
          <input value={title} onChange={e => setTitle(e.target.value)} autoFocus
            placeholder="e.g. Read 12 books this year"
            className="w-full h-11 px-3 rounded-[8px] border border-[hsl(var(--input))] bg-[hsl(var(--background))] text-[14px] font-medium focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
          />
        </FieldRow>

        <div className="grid grid-cols-2 gap-3">
          <FieldRow label={t("common.category")}>
            <select value={cat} onChange={e => setCat(e.target.value)}
              className="w-full h-10 px-3 rounded-[8px] border border-[hsl(var(--input))] bg-[hsl(var(--background))] text-[13px]">
              <option value="Personal">{t("goal.cat.personal")}</option>
              <option value="Health">{t("goal.cat.health")}</option>
              <option value="Learning">{t("goal.cat.learning")}</option>
              <option value="Business">{t("goal.cat.business")}</option>
              <option value="Wellness">{t("goal.cat.wellness")}</option>
              <option value="Family">{t("goal.cat.family")}</option>
            </select>
          </FieldRow>
          <FieldRow label={t("common.color")}>
            <ColorPicker value={color} onChange={setColor} />
          </FieldRow>
        </div>

        <FieldRow label={t("common.icon")}>
          <IconPicker value={iconName} onChange={setIconName} color={color} />
        </FieldRow>

        <div className="grid grid-cols-2 gap-3">
          <FieldRow label={t("goals.target")}>
            <input type="number" value={max} onChange={e => setMax(e.target.value)}
              className="w-full h-10 px-3 rounded-[8px] border border-[hsl(var(--input))] bg-[hsl(var(--background))] text-[13px]" />
          </FieldRow>
          <FieldRow label={t("goals.unit")}>
            <input value={unit} onChange={e => setUnit(e.target.value)} placeholder="books, h, kg, %…"
              className="w-full h-10 px-3 rounded-[8px] border border-[hsl(var(--input))] bg-[hsl(var(--background))] text-[13px]" />
          </FieldRow>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <FieldRow label="From">
            <input value={from} onChange={e => setFrom(e.target.value)} placeholder="Jan 01"
              className="w-full h-10 px-3 rounded-[8px] border border-[hsl(var(--input))] bg-[hsl(var(--background))] text-[13px]" />
          </FieldRow>
          <FieldRow label="To">
            <input value={to} onChange={e => setTo(e.target.value)} placeholder="Dec 31"
              className="w-full h-10 px-3 rounded-[8px] border border-[hsl(var(--input))] bg-[hsl(var(--background))] text-[13px]" />
          </FieldRow>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button variant="outline" size="sm" onClick={onClose}>{t("common.cancel")}</Button>
        <Button size="sm" disabled={!title.trim()} onClick={submit}>{initial ? t("common.save") : t("common.create")}</Button>
      </ModalFooter>
    </Modal>
  );
}

/* ============================================================
   RULE MODAL
============================================================ */
const RULE_TRIGGERS = [
  { id: "schedule",      label: "Recurring time slot",      desc: "Every day / certain days, at a set time." },
  { id: "event-created", label: "Event created",            desc: "When an event is created / modified." },
  { id: "workload",      label: "Over / under load",        desc: "If the day exceeds a capacity threshold." },
  { id: "task-overdue",  label: "Overdue task",             desc: "If a task passes its due date." },
];
const RULE_ACTIONS = [
  { id: "block",         label: "Block a slot",             desc: "Creates a “protected” event in the calendar." },
  { id: "insert",        label: "Insert an event",          desc: "Adds an event (break, focus, etc.)." },
  { id: "add-buffer",    label: "Add a buffer",             desc: "Inserts a buffer before/after." },
  { id: "reschedule",    label: "Auto-reschedule",          desc: "Moves the affected tasks to the next free slot." },
  { id: "notify",        label: "Send a notification",      desc: "Notifies you (push, email)." },
];

function RuleModal({ open, onClose, initial, onSave }) {
  const t = (typeof useT === "function") ? useT() : (k) => k;
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [iconName, setIconName] = useState("Shield");
  const [color, setColor] = useState("263 70% 60%");
  const [trigger, setTrigger] = useState("schedule");
  const [action, setAction] = useState("block");
  const [tagsInput, setTagsInput] = useState("");

  useEffect(() => {
    if (open) {
      setName(initial?.name || "");
      setDesc(initial?.desc || "");
      setIconName(initial?.iconName || "Shield");
      setColor(initial?.color || "263 70% 60%");
      setTrigger(initial?.trigger || "schedule");
      setAction(initial?.action || "block");
      setTagsInput((initial?.tags || []).join(", "));
    }
  }, [open, initial]);

  const submit = () => {
    if (!name.trim()) return;
    const tags = tagsInput.split(",").map(s => s.trim()).filter(Boolean);
    onSave({ name: name.trim(), desc: desc.trim(), iconName, color, trigger, action, tags });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} size="xl">
      <ModalHeader title={initial ? t("common.edit") + " — " + (initial.name || "rule") : t("rules.new")} onClose={onClose} />
      <ModalBody className="space-y-4">
        <FieldRow label={t("common.title")}>
          <input value={name} onChange={e => setName(e.target.value)} autoFocus
            placeholder="e.g. Block Friday afternoons for deep work"
            className="w-full h-11 px-3 rounded-[8px] border border-[hsl(var(--input))] bg-[hsl(var(--background))] text-[14px] font-medium focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
          />
        </FieldRow>

        <FieldRow label={t("common.description")} sub={"(" + t("common.optional") + ")"}>
          <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={2}
            placeholder="What the rule does, in one sentence."
            className="w-full px-3 py-2 rounded-[8px] border border-[hsl(var(--input))] bg-[hsl(var(--background))] text-[13px] resize-none focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
          />
        </FieldRow>

        <div className="grid grid-cols-2 gap-3">
          <FieldRow label={t("common.icon")}>
            <IconPicker value={iconName} onChange={setIconName} color={color} />
          </FieldRow>
          <FieldRow label={t("common.color")}>
            <ColorPicker value={color} onChange={setColor} />
          </FieldRow>
        </div>

        <FieldRow label={t("rules.trigger")}>
          <div className="space-y-1.5">
            {RULE_TRIGGERS.map(rt => (
              <button key={rt.id} type="button" onClick={() => setTrigger(rt.id)}
                className={cn(
                  "w-full text-left p-3 rounded-[8px] border transition-all",
                  trigger === rt.id
                    ? "border-[hsl(var(--primary)/0.5)] bg-[hsl(var(--primary)/0.06)]"
                    : "border-[hsl(var(--border))] hover:border-[hsl(var(--primary)/0.3)]"
                )}>
                <div className="text-[13px] font-medium">{rt.label}</div>
                <div className="text-[11.5px] text-[hsl(var(--muted-foreground))] mt-0.5">{rt.desc}</div>
              </button>
            ))}
          </div>
        </FieldRow>

        <FieldRow label={t("rules.action")}>
          <div className="space-y-1.5">
            {RULE_ACTIONS.map(ra => (
              <button key={ra.id} type="button" onClick={() => setAction(ra.id)}
                className={cn(
                  "w-full text-left p-3 rounded-[8px] border transition-all",
                  action === ra.id
                    ? "border-[hsl(var(--primary)/0.5)] bg-[hsl(var(--primary)/0.06)]"
                    : "border-[hsl(var(--border))] hover:border-[hsl(var(--primary)/0.3)]"
                )}>
                <div className="text-[13px] font-medium">{ra.label}</div>
                <div className="text-[11.5px] text-[hsl(var(--muted-foreground))] mt-0.5">{ra.desc}</div>
              </button>
            ))}
          </div>
        </FieldRow>

        <FieldRow label="Tags" sub={"(" + t("common.optional") + ", comma-separated)"}>
          <input value={tagsInput} onChange={e => setTagsInput(e.target.value)}
            placeholder="Protection, Schedule, Deep work"
            className="w-full h-10 px-3 rounded-[8px] border border-[hsl(var(--input))] bg-[hsl(var(--background))] text-[13px]" />
        </FieldRow>
      </ModalBody>
      <ModalFooter>
        <Button variant="outline" size="sm" onClick={onClose}>{t("common.cancel")}</Button>
        <Button size="sm" disabled={!name.trim()} onClick={submit}>{initial ? t("common.save") : t("common.create")}</Button>
      </ModalFooter>
    </Modal>
  );
}

/* ============================================================
   EVENT MODAL — full advanced options.
============================================================ */
const CAL_OPTIONS = [
  { name: "Work",      color: "263 70% 60%" },
  { name: "Meetings",  color: "217 91% 60%" },
  { name: "Personal",  color: "38 92% 55%" },
  { name: "Sport",     color: "142 70% 50%" },
  { name: "Family",    color: "330 80% 60%" },
];

function EventModal({ open, onClose, initial, onSave }) {
  const t = (typeof useT === "function") ? useT() : (k) => k;
  const [title, setTitle] = useState("");
  const [calendar, setCalendar] = useState("Work");
  const [color, setColor] = useState("263 70% 60%");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [start, setStart] = useState("09:00");
  const [end, setEnd] = useState("10:00");
  const [allDay, setAllDay] = useState(false);
  const [location, setLocation] = useState("");
  const [attendeesInput, setAttendeesInput] = useState("");
  const [attendees, setAttendees] = useState([]);
  const [notify, setNotify] = useState(true);
  const [repeat, setRepeat] = useState("none");
  const [busy, setBusy] = useState("busy");
  const [visibility, setVisibility] = useState("default");
  const [desc, setDesc] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    if (open) {
      setTitle(initial?.title || "");
      setCalendar(initial?.calendar || "Work");
      setColor(initial?.color || "263 70% 60%");
      setDate(initial?.date || new Date().toISOString().slice(0, 10));
      setStart(initial?.start || "09:00");
      setEnd(initial?.end || "10:00");
      setAllDay(!!initial?.allDay);
      setLocation(initial?.location || "");
      setAttendees(initial?.attendees || []);
      setAttendeesInput("");
      setNotify(initial?.notify ?? true);
      setRepeat(initial?.repeat || "none");
      setBusy(initial?.busy || "busy");
      setVisibility(initial?.visibility || "default");
      setDesc(initial?.desc || "");
      setShowAdvanced(false);
    }
  }, [open, initial]);

  const addAttendee = () => {
    const a = attendeesInput.trim();
    if (a && !attendees.includes(a)) setAttendees([...attendees, a]);
    setAttendeesInput("");
  };

  const submit = () => {
    if (!title.trim()) return;
    onSave({
      title: title.trim(), calendar, color, date,
      start: allDay ? "00:00" : start,
      end: allDay ? "23:59" : end,
      allDay, location, attendees, notify, repeat, busy, visibility, desc,
    });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} size="xl">
      <ModalHeader title={initial && initial.title ? t("common.edit") + " — event" : t("event.new")} onClose={onClose} />
      <ModalBody className="space-y-4">
        <input value={title} onChange={e => setTitle(e.target.value)} autoFocus
          placeholder={t("event.titlePlaceholder")}
          className="w-full h-11 px-3 rounded-[8px] border border-[hsl(var(--input))] bg-[hsl(var(--background))] text-[14px] font-medium focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
        />

        <FieldRow label={t("event.calendar")}>
          <div className="grid grid-cols-5 gap-1.5">
            {CAL_OPTIONS.map(c => {
              const active = calendar === c.name;
              return (
                <button key={c.name} type="button" onClick={() => { setCalendar(c.name); setColor(c.color); }}
                  className={cn(
                    "h-9 px-2 rounded-[8px] border flex items-center gap-1.5 text-[12px] font-medium transition-all",
                    active ? "border-[hsl(var(--primary)/0.5)] bg-[hsl(var(--primary)/0.08)]" : "border-[hsl(var(--border))] hover:bg-[hsl(var(--accent))]"
                  )}>
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: `hsl(${c.color})` }} />
                  <span className="truncate">{c.name}</span>
                </button>
              );
            })}
          </div>
        </FieldRow>

        <FieldRow label="Date & time">
          <div className="flex items-center gap-2 mb-2">
            <label className="inline-flex items-center gap-1.5 text-[12.5px] cursor-pointer">
              <Switch checked={allDay} onChange={setAllDay} size="sm" />
              {t("event.allDay")}
            </label>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <DateField value={date} onChange={setDate} />
            <TimeSelect value={start} disabled={allDay} onChange={(v) => {
              setStart(v);
              if (v >= end) { const [h, m] = v.split(":").map(Number); const tt = h * 60 + m + 60; setEnd(String(Math.floor(tt / 60) % 24).padStart(2, "0") + ":" + String(tt % 60).padStart(2, "0")); }
            }} />
            <span className="text-[hsl(var(--muted-foreground))] text-[13px]">–</span>
            <TimeSelect value={end} disabled={allDay} onChange={(v) => { setEnd(v <= start ? start : v); }} />
          </div>
        </FieldRow>

        <button onClick={() => setShowAdvanced(s => !s)}
          className="text-[12.5px] font-semibold text-[hsl(var(--primary))] hover:underline flex items-center gap-1">
          {showAdvanced ? t("common.hideAdvanced") : t("common.advanced")}
          <Icons.ChevronDown size={11} className={cn("transition-transform", showAdvanced && "rotate-180")} />
        </button>

        {showAdvanced && (
          <div className="space-y-4 anim-fade-in border-t border-[hsl(var(--border))] pt-4">
            <FieldRow icon={Icons.Target} label={t("event.location")}>
              <input value={location} onChange={e => setLocation(e.target.value)}
                placeholder={t("event.locationPlaceholder")}
                className="w-full h-10 px-3 rounded-[8px] border border-[hsl(var(--input))] bg-[hsl(var(--background))] text-[13px]" />
            </FieldRow>

            <FieldRow icon={Icons.More} label={t("event.participants")}>
              {attendees.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {attendees.map(a => (
                    <span key={a} className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[hsl(var(--primary)/0.15)] text-[hsl(263_70%_75%)] text-[11px] font-medium">
                      {a}
                      <button onClick={() => setAttendees(attendees.filter(x => x !== a))}>
                        <Icons.X size={10} stroke={3} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <div className="flex items-center gap-2">
                <input value={attendeesInput} onChange={e => setAttendeesInput(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addAttendee(); } }}
                  placeholder={t("event.participantsPlaceholder")}
                  className="flex-1 h-10 px-3 rounded-[8px] border border-[hsl(var(--input))] bg-[hsl(var(--background))] text-[13px]" />
                <button type="button" onClick={addAttendee}
                  className="w-10 h-10 rounded-[8px] border border-[hsl(var(--input))] flex items-center justify-center text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))]">
                  <Icons.Plus size={14} />
                </button>
              </div>
            </FieldRow>

            <div className="grid grid-cols-2 gap-3">
              <FieldRow label={t("event.repeat")}>
                <select value={repeat} onChange={e => setRepeat(e.target.value)}
                  className="w-full h-10 px-3 rounded-[8px] border border-[hsl(var(--input))] bg-[hsl(var(--background))] text-[13px]">
                  <option value="none">{t("event.repeat.none")}</option>
                  <option value="daily">{t("event.repeat.daily")}</option>
                  <option value="weekly">{t("event.repeat.weekly")}</option>
                  <option value="monthly">{t("event.repeat.monthly")}</option>
                  <option value="yearly">{t("event.repeat.yearly")}</option>
                </select>
              </FieldRow>
              <FieldRow label={t("event.busy")}>
                <select value={busy} onChange={e => setBusy(e.target.value)}
                  className="w-full h-10 px-3 rounded-[8px] border border-[hsl(var(--input))] bg-[hsl(var(--background))] text-[13px]">
                  <option value="busy">{t("event.busy.busy")}</option>
                  <option value="free">{t("event.busy.free")}</option>
                </select>
              </FieldRow>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <FieldRow label={t("event.visibility")}>
                <select value={visibility} onChange={e => setVisibility(e.target.value)}
                  className="w-full h-10 px-3 rounded-[8px] border border-[hsl(var(--input))] bg-[hsl(var(--background))] text-[13px]">
                  <option value="default">{t("event.visibility.default")}</option>
                  <option value="public">{t("event.visibility.public")}</option>
                  <option value="private">{t("event.visibility.private")}</option>
                </select>
              </FieldRow>
              <FieldRow label={t("event.notify")}>
                <label className="inline-flex items-center gap-2 h-10 cursor-pointer text-[13px]">
                  <Switch checked={notify} onChange={setNotify} />
                  <span>{notify ? "On · 10 min before" : "Off"}</span>
                </label>
              </FieldRow>
            </div>

            <FieldRow label={t("common.notes")}>
              <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={3}
                placeholder="Agenda, context…"
                className="w-full px-3 py-2 rounded-[8px] border border-[hsl(var(--input))] bg-[hsl(var(--background))] text-[13px] resize-none focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
              />
            </FieldRow>
          </div>
        )}
      </ModalBody>
      <ModalFooter>
        <Button variant="outline" size="sm" onClick={onClose}>{t("common.cancel")}</Button>
        <Button size="sm" disabled={!title.trim()} onClick={submit}>{initial ? t("common.save") : t("common.create")}</Button>
      </ModalFooter>
    </Modal>
  );
}

Object.assign(window, { HabitModal, GoalModal, RuleModal, EventModal, IconPicker, ColorPicker });
