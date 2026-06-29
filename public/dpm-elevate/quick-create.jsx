/* global React, useState, useEffect, cn, Icons, Button, Badge, Switch, SwatchPicker */

/* ============================================================
   ADVANCED CREATE POPOVER  + RECURRENCE DESIGNER
   Opened from a calendar slot (inherits the clicked day/time), the command
   palette, or a button. One composer for Event / Task / Focus / Habit /
   Availability / Meeting poll, with a full recurrence designer and a
   scope dialog for editing recurring items. FRONT-END ONLY.

   Open it from anywhere:
     window.__dpmQuickCreate({ type, date, start, end, title })
============================================================ */

const QC_TYPES = [
  { id: "event", label: "Event", icon: Icons.Calendar, hsl: "217 91% 60%" },
  { id: "task", label: "Task", icon: Icons.CheckSquare, hsl: "263 70% 62%" },
  { id: "focus", label: "Focus", icon: Icons.Zap, hsl: "142 70% 45%" },
  { id: "habit", label: "Habit", icon: Icons.Flame, hsl: "20 90% 55%" },
  { id: "availability", label: "Availability", icon: Icons.Clock, hsl: "190 80% 50%" },
  { id: "poll", label: "Meeting poll", icon: Icons.Users, hsl: "330 80% 60%" },
];
const QC_CALS = [
  { name: "Work", color: "217 91% 60%" },
  { name: "Personal", color: "263 70% 62%" },
  { name: "School", color: "142 70% 45%" },
];
const WEEK = ["M", "T", "W", "T", "F", "S", "S"];
const WEEKF = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/* ---- recurrence designer ---- */
function RecurrenceDesigner({ value, onChange }) {
  const v = value;
  const set = (patch) => onChange({ ...v, ...patch });
  const freqs = [
    { id: "none", label: "Does not repeat" },
    { id: "daily", label: "Daily" },
    { id: "weekly", label: "Weekly" },
    { id: "monthly", label: "Monthly" },
    { id: "yearly", label: "Yearly" },
    { id: "custom", label: "Custom" },
  ];
  const summary = () => {
    if (v.freq === "none") return "Does not repeat";
    let s = "";
    const every = v.interval > 1 ? `every ${v.interval} ` : "every ";
    if (v.freq === "daily") s = `${every}day`;
    else if (v.freq === "weekly" || v.freq === "custom") {
      const days = v.days.map(d => WEEKF[d]).join(", ");
      s = `${every}week${days ? " on " + days : ""}`;
    } else if (v.freq === "monthly") s = `${every}month`;
    else if (v.freq === "yearly") s = `${every}year`;
    if (v.end === "on") s += ` until ${v.until}`;
    else if (v.end === "after") s += ` for ${v.count} times`;
    return s.charAt(0).toUpperCase() + s.slice(1);
  };
  const showDays = v.freq === "weekly" || v.freq === "custom";
  return (
    <div className="rounded-[10px] border border-[hsl(var(--border))] overflow-hidden">
      <div className="p-3 space-y-3">
        <div className="flex items-center gap-2 flex-wrap">
          {freqs.map(f => (
            <button key={f.id} onClick={() => set({ freq: f.id, interval: f.id === "none" ? 1 : v.interval })}
              className={cn("h-8 px-3 rounded-[7px] text-[12px] font-medium border transition-colors",
                v.freq === f.id ? "border-[hsl(var(--primary)/0.5)] bg-[hsl(var(--primary)/0.1)] text-[hsl(263_70%_75%)]" : "border-[hsl(var(--border))] hover:bg-[hsl(var(--accent))]")}>
              {f.label}
            </button>
          ))}
        </div>

        {v.freq !== "none" && (
          <>
            <div className="flex items-center gap-2 text-[12.5px]">
              <span className="text-[hsl(var(--muted-foreground))]">Repeat every</span>
              <input type="number" min={1} max={30} value={v.interval} onChange={e => set({ interval: Math.max(1, +e.target.value || 1) })}
                className="w-14 h-8 px-2 rounded-[6px] border border-[hsl(var(--input))] bg-[hsl(var(--background))] text-center font-medium focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]" />
              <span className="text-[hsl(var(--muted-foreground))]">{v.freq === "daily" ? "day(s)" : v.freq === "monthly" ? "month(s)" : v.freq === "yearly" ? "year(s)" : "week(s)"}</span>
            </div>

            {showDays && (
              <div className="flex items-center gap-1.5">
                {WEEK.map((d, i) => (
                  <button key={i} onClick={() => set({ days: v.days.includes(i) ? v.days.filter(x => x !== i) : [...v.days, i].sort() })}
                    className={cn("w-8 h-8 rounded-full text-[11.5px] font-semibold transition-colors",
                      v.days.includes(i) ? "bg-[hsl(var(--primary))] text-white" : "bg-[hsl(var(--muted)/0.5)] text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))]")}>
                    {d}
                  </button>
                ))}
              </div>
            )}

            {/* ends */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-semibold text-[hsl(var(--muted-foreground))]">Ends</div>
              <div className="flex items-center gap-2 flex-wrap text-[12.5px]">
                {[["never", "Never"], ["on", "On date"], ["after", "After"]].map(([id, lbl]) => (
                  <button key={id} onClick={() => set({ end: id })}
                    className={cn("h-8 px-3 rounded-[7px] font-medium border transition-colors",
                      v.end === id ? "border-[hsl(var(--primary)/0.5)] bg-[hsl(var(--primary)/0.1)] text-[hsl(263_70%_75%)]" : "border-[hsl(var(--border))] hover:bg-[hsl(var(--accent))]")}>
                    {lbl}
                  </button>
                ))}
                {v.end === "on" && (
                  <input type="date" value={v.until} onChange={e => set({ until: e.target.value })}
                    className="h-8 px-2 rounded-[6px] border border-[hsl(var(--input))] bg-[hsl(var(--background))] text-[12px] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]" />
                )}
                {v.end === "after" && (
                  <div className="flex items-center gap-1.5">
                    <input type="number" min={1} value={v.count} onChange={e => set({ count: Math.max(1, +e.target.value || 1) })}
                      className="w-14 h-8 px-2 rounded-[6px] border border-[hsl(var(--input))] bg-[hsl(var(--background))] text-center font-medium focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]" />
                    <span className="text-[hsl(var(--muted-foreground))]">occurrences</span>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
      <div className="px-3 py-2 bg-[hsl(var(--muted)/0.25)] border-t border-[hsl(var(--border))] flex items-center gap-2">
        <Icons.Refresh size={12} className="text-[hsl(var(--primary))]" />
        <span className="text-[11.5px] text-[hsl(var(--muted-foreground))]">{summary()}</span>
      </div>
    </div>
  );
}

function FieldLabel({ children }) { return <label className="text-[11.5px] font-semibold text-[hsl(var(--muted-foreground))] mb-1.5 block">{children}</label>; }
function qcInput(extra = "") { return cn("w-full h-9 px-3 rounded-[8px] border border-[hsl(var(--input))] bg-[hsl(var(--background))] text-[13px] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]", extra); }

// Dynamic date helpers (P4) — never hard-code a frozen day.
function qcTodayISO() {
  const D = window.DPMDate;
  const d = D ? D.today() : (() => { const x = new Date(); x.setHours(0,0,0,0); return x; })();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}
function qcYearEndISO() {
  const y = (window.DPMDate ? window.DPMDate.today() : new Date()).getFullYear();
  return `${y}-12-31`;
}

function QuickCreatePopover({ open, slot, onClose }) {
  const [type, setType] = useState("event");
  const [f, setF] = useState({ title: "", date: qcTodayISO(), start: "14:00", end: "15:00", allDay: false, calendar: "Work", color: "217 91% 60%", participants: "", location: "", busy: true, visibility: "default", reminder: "10", notes: "", priority: "MEDIUM", editing: false });
  const [showRec, setShowRec] = useState(false);
  const [rec, setRec] = useState({ freq: "none", interval: 1, days: [], end: "never", until: qcYearEndISO(), count: 10 });
  const [scopeAsk, setScopeAsk] = useState(false);
  const [capDismissed, setCapDismissed] = useState(false);
  const lang = (typeof window !== "undefined" && window.__dpmLang === "fr") ? "fr" : "en";
  const speech = window.useSpeech(lang, (text) => { setF(s => ({ ...s, title: text })); setCapDismissed(false); });
  // Natural-language capture on the title (same parser as the command palette).
  const capture = React.useMemo(() => {
    if (!open || capDismissed) return null;
    const txt = (f.title || "").trim();
    if (txt.length < 4 || typeof window === "undefined" || !window.parseCapture) return null;
    try {
      const p = window.parseCapture(txt);
      if (!p) return null;
      const sig = p.priority === "high" || (p.tags && p.tags.length) || p.startMin != null || p.durMin != null || (p.dateLabel && p.dateLabel !== "No date");
      return sig ? p : null;
    } catch (e) { return null; }
  }, [f.title, open, capDismissed]);

  useEffect(() => {
    if (!open) return;
    setType(slot?.type || "event");
    setF({
      title: slot?.title || "",
      date: slot?.date || qcTodayISO(),
      start: slot?.start || "14:00",
      end: slot?.end || "15:00",
      allDay: false,
      calendar: "Work",
      color: "217 91% 60%",
      participants: "",
      location: "",
      busy: true,
      visibility: "default",
      reminder: "10",
      notes: "",
      editing: slot?.editing || false,
    });
    setRec({ freq: "none", interval: 1, days: [], end: "never", until: qcYearEndISO(), count: 10 });
    setShowRec(false); setScopeAsk(false); setCapDismissed(false);
    const onKey = (e) => { if (e.key === "Escape") onClose?.(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, slot, onClose]);
  if (!open) return null;

  const set = (patch) => setF(s => ({ ...s, ...patch }));
  const applyCapture = (p) => {
    const patch = {};
    if (p.title) patch.title = p.title;
    if (p.startMin != null && window.fmtMinLocal) patch.start = window.fmtMinLocal(p.startMin);
    if (p.endMin != null && window.fmtMinLocal) patch.end = window.fmtMinLocal(p.endMin);
    if (p.priority === "high") patch.priority = "URGENT";
    setF(s => ({ ...s, ...patch }));
    if (p.type && ["event", "task", "focus"].includes(p.type)) setType(p.type);
    setCapDismissed(true);
    window.__dpmToast?.("Details applied from capture");
  };
  const meta = QC_TYPES.find(x => x.id === type);
  const isTimed = type === "event" || type === "focus" || type === "availability";
  const hasConflict = isTimed && f.start === "14:00" && !f.allDay; // mock: 14:00 overlaps Design review

  const doSave = (mode) => {
    if (f.editing && rec.freq !== "none" && !scopeAsk) { setScopeAsk(true); return; }
    // Actually persist to the right store so the item shows up in its views (P2).
    window.__dpmCreate?.({
      type,
      title: (f.title || "").trim() || meta.label,
      date: f.date, start: f.start, end: f.end, allDay: f.allDay,
      calendar: f.calendar, color: f.color,
      location: f.location, notes: f.notes, priority: f.priority,
      busy: f.busy ? "busy" : "free", visibility: f.visibility,
      repeat: rec.freq,
    });
    window.__dpmToast?.(`${meta.label} saved${mode ? " · " + mode : ""}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[115] flex items-start justify-center px-4 pt-[8vh] anim-fade-in" style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)" }}
         onMouseDown={(e) => { if (e.target === e.currentTarget) onClose?.(); }}>
      <div className="w-full max-w-[560px] rounded-[14px] border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-2xl anim-scale-in overflow-hidden flex flex-col max-h-[84vh]">
        {/* type tabs */}
        <div className="flex items-center gap-1 px-3 pt-3 pb-2 overflow-x-auto">
          {QC_TYPES.map(t => (
            <button key={t.id} onClick={() => setType(t.id)}
              className={cn("h-8 px-3 rounded-[7px] text-[12.5px] font-medium inline-flex items-center gap-1.5 whitespace-nowrap transition-colors flex-shrink-0",
                type === t.id ? "text-white" : "text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))]")}
              style={type === t.id ? { background: `hsl(${t.hsl})` } : undefined}>
              <t.icon size={13} /> {t.label}
            </button>
          ))}
        </div>

        <div className="overflow-y-auto px-4 py-3 space-y-3.5">
          {/* title + voice dictation + smart capture */}
          <div>
            <div className="relative">
              <input autoFocus value={f.title} onChange={e => { set({ title: e.target.value }); setCapDismissed(false); }}
                placeholder={`${meta.label} title…`}
                className="w-full h-11 pl-3 pr-11 rounded-[9px] border border-[hsl(var(--input))] bg-[hsl(var(--background))] text-[15px] font-medium focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]" />
              <button type="button"
                title={speech.supported ? (speech.listening ? "Stop" : "Voice dictation") : "Voice input not supported"}
                onClick={() => { if (!speech.supported) { window.__dpmToast?.("Voice input not supported — type instead"); return; } speech.listening ? speech.stop() : speech.start(); }}
                className={cn("absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-md flex items-center justify-center transition-colors",
                  speech.listening ? "bg-[hsl(0_84%_60%)] text-white animate-pulse" : "hover:bg-[hsl(var(--accent))] text-[hsl(var(--muted-foreground))]")}>
                <Icons.Mic size={14} />
              </button>
            </div>
            {speech.listening && (
              <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-[hsl(0_84%_65%)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[hsl(0_84%_60%)] animate-pulse" /> Listening…
              </div>
            )}
            {capture && window.CaptureSuggestion && (
              <window.CaptureSuggestion p={capture} onApply={applyCapture} onDismiss={() => setCapDismissed(true)} />
            )}
          </div>

          {/* inherited slot banner */}
          {slot && !slot.editing && (
            <div className="flex items-center gap-2 text-[11.5px] text-[hsl(var(--muted-foreground))] -mt-1">
              <Icons.Sparkles size={12} className="text-[hsl(var(--primary))]" /> Pre-filled from the slot you clicked
            </div>
          )}

          {/* date + time */}
          <div className="grid grid-cols-2 gap-2.5">
            <div><FieldLabel>Date</FieldLabel><input type="date" value={f.date} onChange={e => set({ date: e.target.value })} className={qcInput()} /></div>
            {type !== "task" && type !== "habit" && (
              <div className="flex items-end gap-2">
                <label className="flex items-center gap-2 h-9 text-[12.5px] cursor-pointer"><Switch checked={f.allDay} onChange={v => set({ allDay: v })} size="sm" /> All-day</label>
              </div>
            )}
          </div>

          {isTimed && !f.allDay && (
            <div className="grid grid-cols-2 gap-2.5">
              <div><FieldLabel>Start</FieldLabel><input type="time" value={f.start} onChange={e => set({ start: e.target.value })} className={qcInput()} /></div>
              <div><FieldLabel>End</FieldLabel><input type="time" value={f.end} onChange={e => set({ end: e.target.value })} className={qcInput()} /></div>
            </div>
          )}

          {/* conflict */}
          {hasConflict && (
            <div className="rounded-[8px] border border-[hsl(38_92%_55%/0.35)] bg-[hsl(38_92%_55%/0.06)] p-2.5 flex items-center gap-2 text-[12px]">
              <Icons.AlertTriangle size={13} className="text-[hsl(38_92%_60%)] flex-shrink-0" />
              <span className="text-[hsl(var(--muted-foreground))]">Overlaps <span className="font-semibold text-[hsl(38_92%_64%)]">Design review</span> (14:00–15:00).</span>
              <button onClick={() => set({ start: "16:30", end: "17:30" })} className="ml-auto text-[hsl(var(--primary))] font-medium hover:underline whitespace-nowrap">Move to 16:30</button>
            </div>
          )}

          {/* calendar + color */}
          {type !== "task" && (
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <FieldLabel>Calendar</FieldLabel>
                <div className="flex items-center gap-1.5">
                  {QC_CALS.map(c => (
                    <button key={c.name} onClick={() => set({ calendar: c.name, color: c.color })}
                      className={cn("h-9 px-2.5 rounded-[8px] text-[12px] font-medium inline-flex items-center gap-1.5 border transition-colors",
                        f.calendar === c.name ? "border-[hsl(var(--primary)/0.5)] bg-[hsl(var(--primary)/0.08)]" : "border-[hsl(var(--border))] hover:bg-[hsl(var(--accent))]")}>
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: `hsl(${c.color})` }} /> {c.name}
                    </button>
                  ))}
                </div>
              </div>
              <div><FieldLabel>Color</FieldLabel><SwatchPicker value={f.color} onChange={c => set({ color: c })} size={26} palette={["217 91% 60%", "263 70% 62%", "142 70% 45%", "20 90% 55%", "330 80% 60%"]} /></div>
            </div>
          )}

          {/* priority for tasks */}
          {(type === "task" || type === "habit") && (
            <div><FieldLabel>Priority</FieldLabel>
              <div className="flex items-center gap-1.5">
                {[["URGENT", "0 84% 60%"], ["HIGH", "25 90% 55%"], ["MEDIUM", "45 93% 50%"], ["LOW", "142 65% 45%"]].map(([p, c]) => (
                  <button key={p} onClick={() => set({ priority: p })}
                    className={cn("h-8 px-3 rounded-[7px] text-[11.5px] font-semibold border transition-colors", f.priority === p ? "text-white" : "border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))]")}
                    style={f.priority === p ? { background: `hsl(${c})`, borderColor: `hsl(${c})` } : undefined}>{p}</button>
                ))}
              </div>
            </div>
          )}

          {/* participants + location for events/poll */}
          {(type === "event" || type === "poll") && (
            <>
              <div><FieldLabel>Participants</FieldLabel><input value={f.participants} onChange={e => set({ participants: e.target.value })} placeholder="Add people by email…" className={qcInput()} /></div>
              <div><FieldLabel>Location / link</FieldLabel><input value={f.location} onChange={e => set({ location: e.target.value })} placeholder="Room, address or video link" className={qcInput()} /></div>
            </>
          )}

          {/* availability/visibility row */}
          {type !== "task" && type !== "habit" && (
            <div className="grid grid-cols-3 gap-2.5">
              <div><FieldLabel>Shows as</FieldLabel>
                <div className="flex items-center rounded-[8px] border border-[hsl(var(--border))] overflow-hidden h-9">
                  {["busy", "free"].map(b => (
                    <button key={b} onClick={() => set({ busy: b === "busy" })} className={cn("flex-1 h-full text-[12px] font-medium capitalize", f.busy === (b === "busy") ? "bg-[hsl(var(--primary))] text-white" : "hover:bg-[hsl(var(--accent))]")}>{b}</button>
                  ))}
                </div>
              </div>
              <div><FieldLabel>Visibility</FieldLabel>
                <select value={f.visibility} onChange={e => set({ visibility: e.target.value })} className={qcInput()}>
                  <option value="default">Default</option><option value="private">Private</option><option value="public">Public</option>
                </select>
              </div>
              <div><FieldLabel>Reminder</FieldLabel>
                <select value={f.reminder} onChange={e => set({ reminder: e.target.value })} className={qcInput()}>
                  <option value="0">At time</option><option value="10">10 min before</option><option value="30">30 min</option><option value="60">1 h</option>
                </select>
              </div>
            </div>
          )}

          {/* recurrence */}
          {type !== "poll" && (
            <div>
              <button onClick={() => setShowRec(s => !s)} className="flex items-center gap-2 text-[12.5px] font-medium text-[hsl(var(--foreground))] hover:text-[hsl(var(--primary))]">
                <Icons.Refresh size={13} /> Recurrence <span className="text-[hsl(var(--muted-foreground))] font-normal">· {rec.freq === "none" ? "does not repeat" : "repeats"}</span>
                <Icons.ChevronDown size={13} className={cn("transition-transform", showRec && "rotate-180")} />
              </button>
              {showRec && <div className="mt-2"><RecurrenceDesigner value={rec} onChange={setRec} /></div>}
            </div>
          )}

          {/* notes */}
          <div><FieldLabel>Notes</FieldLabel><textarea value={f.notes} onChange={e => set({ notes: e.target.value })} rows={2} placeholder="Add details…" className={cn(qcInput("h-auto py-2 resize-none"))} /></div>
        </div>

        {/* footer */}
        <div className="px-4 py-3 border-t border-[hsl(var(--border))] bg-[hsl(var(--background)/0.4)] flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
          <div className="ml-auto flex items-center gap-1.5">
            {type === "event" && <Button variant="outline" size="sm" icon={Icons.Share} onClick={() => doSave("shared")}>Save &amp; share</Button>}
            {(type === "event" || type === "focus") && <Button variant="outline" size="sm" icon={Icons.Zap} onClick={() => doSave("focus")}>Save &amp; focus</Button>}
            <Button size="sm" icon={Icons.Check} onClick={() => doSave()}>Save</Button>
          </div>
        </div>

        {/* recurring edit scope dialog */}
        {scopeAsk && (
          <div className="absolute inset-0 z-10 flex items-center justify-center p-4 bg-[hsl(var(--card)/0.6)]" style={{ backdropFilter: "blur(2px)" }}>
            <div className="w-full max-w-[320px] rounded-[12px] border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-2xl p-4 anim-scale-in">
              <div className="text-[14px] font-semibold mb-1">Edit recurring item</div>
              <div className="text-[12px] text-[hsl(var(--muted-foreground))] mb-3">This change applies to:</div>
              <div className="space-y-1.5">
                {[["This occurrence", "occurrence"], ["This and following", "following"], ["All events in the series", "series"]].map(([l, k]) => (
                  <button key={k} onClick={() => { window.__dpmToast?.(`Saved · ${l.toLowerCase()}`); onClose(); }}
                    className="w-full text-left px-3 h-10 rounded-[8px] border border-[hsl(var(--border))] hover:bg-[hsl(var(--accent))] text-[13px] font-medium">{l}</button>
                ))}
              </div>
              <button onClick={() => setScopeAsk(false)} className="w-full mt-2 h-9 text-[12.5px] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]">Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function QuickCreateHost() {
  const [slot, setSlot] = useState(null);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    window.__dpmQuickCreate = (s) => { setSlot(s || null); setOpen(true); };
    return () => { delete window.__dpmQuickCreate; };
  }, []);
  return <QuickCreatePopover open={open} slot={slot} onClose={() => setOpen(false)} />;
}

Object.assign(window, { QuickCreatePopover, QuickCreateHost, RecurrenceDesigner });
