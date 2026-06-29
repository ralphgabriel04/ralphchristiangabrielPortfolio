/* global React, Icons, Button, Card, SectionTitle, Badge, Input, Checkbox, Avatar, Logo, cn,
          useState, useEffect, useRef, useMemo, ViewToggle, ProgressBar, Ring, Switch, EmptyState,
          useT, useHabits, useGoals, useRules, HabitModal, GoalModal, RuleModal */

/* ============================================================
   PAGE 7 — HABITS (/habits)
   CRUD via stores (useHabits). Cards support:
   - double-click name to inline-rename
   - "..." menu: edit (modal) / delete
   - Search + filters (by frequency/type)
============================================================ */
function HabitsPage({ emptyState }) {
  const t = useT();
  const [habits, ops] = useHabits();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // all | done | undone | fixe | flexible
  const [filterOpen, setFilterOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return habits.filter(h => {
      if (q && !h.name.toLowerCase().includes(q)) return false;
      if (filter === "done"     && !h.done) return false;
      if (filter === "undone"   && h.done)  return false;
      if (filter === "fixe"     && !(h.type || "").startsWith("Fixe")) return false;
      if (filter === "flexible" && (h.type || "").startsWith("Fixe")) return false;
      return true;
    });
  }, [habits, search, filter]);

  const doneCount = habits.filter(h => h.done).length;
  const openCreate = () => { setEditTarget(null); setModalOpen(true); };
  const openEdit = (h) => { setEditTarget(h); setModalOpen(true); };

  if (emptyState || habits.length === 0) {
    return (
      <div className="space-y-5">
        <div>
          <h1 className="text-[24px] font-bold tracking-tight">{t("habits.title")}</h1>
          <p className="text-[13px] text-[hsl(var(--muted-foreground))] mt-1">Build your rituals</p>
        </div>
        <Card padding="p-20" className="text-center">
          <div className="w-16 h-16 rounded-full bg-[hsl(38_92%_55%/0.12)] flex items-center justify-center mx-auto mb-5">
            <Icons.Flame size={28} className="text-[hsl(38_92%_60%)]" />
          </div>
          <h3 className="text-[20px] font-semibold mb-2">{t("habits.empty")}</h3>
          <p className="text-[14px] text-[hsl(var(--muted-foreground))] mb-7 max-w-md mx-auto">
            Small repeated actions build big results. Start with one simple habit.
          </p>
          <Button icon={Icons.Plus} size="lg" onClick={openCreate}>{t("habits.newHabit")}</Button>
        </Card>
        <HabitModal open={modalOpen} initial={editTarget} onClose={() => setModalOpen(false)}
          onSave={(payload) => {
            if (editTarget) ops.update(editTarget.id, payload);
            else ops.add(payload);
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-[24px] font-bold tracking-tight">{t("habits.title")}</h1>
          <p className="text-[13px] text-[hsl(var(--muted-foreground))] mt-1">
            {habits.length} {t("habits.title").toLowerCase()} · {doneCount} checked today
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Icons.Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder={t("habits.searchPlaceholder")}
              className="h-9 pl-8 pr-3 rounded-[8px] border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-[12.5px] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] w-56" />
          </div>
          <FilterDropdown
            open={filterOpen} setOpen={setFilterOpen}
            value={filter} onChange={setFilter}
            options={[
              { id: "all",      label: t("common.all") },
              { id: "done",     label: "Checked today" },
              { id: "undone",   label: "Unchecked" },
              { id: "fixe",     label: "Horaire fixe" },
              { id: "flexible", label: "Flexibles" },
            ]}
          />
          <ModuleTutorialButton module="habits" />
          <Button size="sm" icon={Icons.Plus} onClick={openCreate}>{t("habits.new")}</Button>
        </div>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3" data-tour="feat-habits-stats">
        {[
          { l: "Longest streak", v: Math.max(0, ...habits.map(h => h.streak)) + "d", icon: Icons.Flame, c: "warning" },
          { l: "Checked today", v: doneCount + "/" + habits.length, icon: Icons.Check, c: "success" },
          { l: "Consistance 7j", v: (() => {
            const all = habits.flatMap(h => h.weekly);
            if (!all.length) return "0%";
            return Math.round(all.reduce((a, b) => a + b, 0) / all.length * 100) + "%";
          })(), icon: Icons.Activity, c: "primary" },
          { l: "Total ce mois", v: habits.reduce((acc, h) => acc + h.weekly.reduce((a, b) => a + b, 0), 0) * 4, icon: Icons.Star, c: "info" },
        ].map(s => (
          <Card key={s.l} padding="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-[hsl(var(--muted-foreground))]">{s.l}</span>
              <s.icon size={14} className={cn(
                s.c === "warning" && "text-[hsl(38_92%_60%)]",
                s.c === "success" && "text-[hsl(142_70%_55%)]",
                s.c === "primary" && "text-[hsl(var(--primary))]",
                s.c === "info" && "text-[hsl(217_91%_65%)]",
              )} />
            </div>
            <div className="text-[24px] font-bold tabular-nums">{s.v}</div>
          </Card>
        ))}
      </div>

      <div className="text-[11px] text-[hsl(var(--muted-foreground))] italic flex items-center gap-1.5">
        <Icons.Edit size={11} /> {t("habits.dblClickHelp")}
      </div>

      {filtered.length === 0 && (
        <Card padding="p-10" className="text-center text-[13px] text-[hsl(var(--muted-foreground))]">
          No habit matches the filters.
          <button onClick={() => { setSearch(""); setFilter("all"); }} className="ml-2 text-[hsl(var(--primary))] hover:underline">Reset</button>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(h => (
          <HabitCard
            key={h.id} habit={h}
            onToggle={() => ops.toggleDone(h.id)}
            onRename={(name) => ops.update(h.id, { name })}
            onEdit={() => openEdit(h)}
            onDelete={() => {
              if (window.confirm(t("habits.deleteConfirm"))) ops.remove(h.id);
            }}
          />
        ))}
        <button
          onClick={openCreate}
          className="rounded-[12px] border-2 border-dashed border-[hsl(var(--border))] hover:border-[hsl(var(--primary)/0.4)] hover:bg-[hsl(var(--primary)/0.04)] p-7 text-center transition-all flex flex-col items-center justify-center min-h-[200px]">
          <Icons.PlusCircle size={28} className="text-[hsl(var(--muted-foreground))] mb-2" />
          <span className="text-[13px] font-medium text-[hsl(var(--muted-foreground))]">{t("habits.newHabit")}</span>
        </button>
      </div>

      <HabitModal open={modalOpen} initial={editTarget} onClose={() => setModalOpen(false)}
        onSave={(payload) => {
          if (editTarget) ops.update(editTarget.id, payload);
          else ops.add(payload);
        }}
      />
    </div>
  );
}

/* Reusable: a self-contained dropdown filter pill.
   Renders a Button trigger and a small popover. */
function FilterDropdown({ open, setOpen, value, onChange, options, icon = Icons.Filter, label }) {
  const ref = useRef(null);
  const t = useT();
  useEffect(() => {
    if (!open) return;
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open, setOpen]);

  const active = options.find(o => o.id === value);
  const isFiltered = value !== "all" && value !== options[0]?.id;
  return (
    <div className="relative" ref={ref}>
      <Button variant="outline" size="sm" icon={icon} onClick={() => setOpen(o => !o)}>
        {label || t("common.filters")}
        {isFiltered && <span className="ml-1 px-1.5 py-0.5 rounded-full bg-[hsl(var(--primary)/0.18)] text-[hsl(263_70%_80%)] text-[10px] font-mono">1</span>}
      </Button>
      {open && (
        <div className="absolute z-40 right-0 top-full mt-1.5 w-56 rounded-[10px] border border-[hsl(var(--border))] bg-[hsl(var(--popover))] shadow-xl py-1 anim-fade-in">
          {options.map(o => (
            <button key={o.id} onClick={() => { onChange(o.id); setOpen(false); }}
              className={cn(
                "w-full text-left px-3 py-1.5 text-[12.5px] flex items-center justify-between hover:bg-[hsl(var(--accent))]",
                value === o.id && "text-[hsl(var(--primary))] font-semibold"
              )}>
              <span>{o.label}</span>
              {value === o.id && <Icons.Check size={12} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function HabitCard({ habit, onToggle, onRename, onEdit, onDelete }) {
  const t = useT();
  const Icon = Icons[habit.iconName] || Icons.Star;
  const [renaming, setRenaming] = useState(false);
  const [val, setVal] = useState(habit.name);
  const inputRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const days = (() => {
    const D = window.DPMDate;
    const isFr = window.__dpmLang === "fr";
    const FR = ["D","L","M","M","J","V","S"]; // by getDay() Sun..Sat
    const EN = ["S","M","T","W","T","F","S"];
    return Array.from({ length: 7 }, (_, i) => {
      const date = D ? D.addDays(D.today(), i - 6)
        : (() => { const x = new Date(); x.setDate(x.getDate() - (6 - i)); return x; })();
      return (isFr ? FR : EN)[date.getDay()];
    });
  })();

  useEffect(() => { setVal(habit.name); }, [habit.name]);
  useEffect(() => {
    if (!menuOpen) return;
    const h = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [menuOpen]);
  useEffect(() => {
    if (renaming) {
      setVal(window.__dpmTr ? window.__dpmTr(habit.name) : habit.name);
      requestAnimationFrame(() => { inputRef.current?.focus(); inputRef.current?.select(); });
    }
  }, [renaming]);

  const commit = () => {
    const v = val.trim();
    const shown = window.__dpmTr ? window.__dpmTr(habit.name) : habit.name;
    // Only rename on a real change; if the user kept the (translated) text as-is,
    // preserve the original so the EN/FR toggle keeps working.
    if (v && v !== habit.name && v !== shown) onRename(v); else setVal(habit.name);
    setRenaming(false);
  };

  return (
    <Card padding="p-5" className="relative overflow-hidden group/hcard" data-tour="feat-habits-card">
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-[0.08] -translate-y-1/3 translate-x-1/3" style={{ background: `hsl(${habit.color})` }} />

      {/* ... menu trigger */}
      <div className="absolute top-3 right-3 z-10" ref={menuRef}>
        <button
          onClick={() => setMenuOpen(o => !o)}
          title={t("common.menu.options")}
          className="w-7 h-7 rounded-md bg-[hsl(var(--card))]/85 backdrop-blur border border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))] flex items-center justify-center opacity-0 group-hover/hcard:opacity-100 transition-opacity">
          <Icons.More size={12} />
        </button>
        {menuOpen && (
          <div role="menu" className="absolute right-0 top-full mt-1 w-40 rounded-[10px] border border-[hsl(var(--border))] bg-[hsl(var(--popover))] shadow-xl py-1 z-20 anim-fade-in">
            <button onClick={() => { setMenuOpen(false); setRenaming(true); }}
              className="w-full px-3 py-1.5 text-[12.5px] flex items-center gap-2 hover:bg-[hsl(var(--accent))] text-left">
              <Icons.Edit size={12} className="text-[hsl(var(--muted-foreground))]" /> {t("common.rename")}
            </button>
            <button onClick={() => { setMenuOpen(false); onEdit(); }}
              className="w-full px-3 py-1.5 text-[12.5px] flex items-center gap-2 hover:bg-[hsl(var(--accent))] text-left">
              <Icons.Settings size={12} className="text-[hsl(var(--muted-foreground))]" /> {t("common.edit")}
            </button>
            <div className="my-1 border-t border-[hsl(var(--border))]" />
            <button onClick={() => { setMenuOpen(false); onDelete(); }}
              className="w-full px-3 py-1.5 text-[12.5px] flex items-center gap-2 hover:bg-[hsl(0_84%_60%/0.1)] text-[hsl(0_84%_70%)] text-left">
              <Icons.Trash size={12} /> {t("common.delete")}
            </button>
          </div>
        )}
      </div>

      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div className="w-10 h-10 rounded-[10px] flex items-center justify-center" style={{ background: `hsl(${habit.color} / 0.15)`, color: `hsl(${habit.color})` }}>
            <Icon size={18} />
          </div>
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-[hsl(38_92%_55%/0.12)] text-[hsl(38_92%_60%)] mr-8">
            <Icons.Flame size={11} />
            <span className="text-[11px] font-semibold tabular-nums">{habit.streak}j</span>
          </div>
        </div>

        {renaming ? (
          <input
            ref={inputRef}
            value={val}
            onChange={e => setVal(e.target.value)}
            onBlur={commit}
            onKeyDown={e => {
              if (e.key === "Enter") { e.preventDefault(); commit(); }
              if (e.key === "Escape") { setVal(habit.name); setRenaming(false); }
            }}
            className="w-full text-[15px] font-semibold mb-1 bg-transparent border-b-2 border-[hsl(var(--primary))] focus:outline-none"
          />
        ) : (
          <h3
            onDoubleClick={() => setRenaming(true)}
            title={t("common.help.dblclick")}
            className="text-[15px] font-semibold mb-1 cursor-text hover:text-[hsl(var(--primary))] transition-colors"
          >{habit.name}</h3>
        )}

        <div className="flex items-center gap-2 text-[11px] text-[hsl(var(--muted-foreground))] mb-4">
          <span>{habit.type}</span>
          <span>·</span>
          <span>{habit.freq}</span>
          {habit.duration !== "—" && <><span>·</span><span>{habit.duration}</span></>}
          {window.__dpmIsShared && window.__dpmIsShared(habit) && (
            <Badge variant="primary" className="text-[10px] ml-auto"><Icons.Layers size={9} /> Shared</Badge>
          )}
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10.5px] uppercase tracking-wider font-semibold text-[hsl(var(--muted-foreground))]">{t("habits.last7days")}</span>
            <span className="text-[10.5px] text-[hsl(var(--muted-foreground))] tabular-nums">{habit.weekly.filter(Boolean).length}/7</span>
          </div>
          <div className="grid grid-cols-7 gap-1" data-tour="feat-habits-heatmap">
            {habit.weekly.map((v, i) => (
              <div key={i} className="aspect-square rounded-[5px] flex items-center justify-center text-[9px] font-semibold"
                   style={{
                     background: v ? `hsl(${habit.color})` : "hsl(var(--muted))",
                     color: v ? "white" : "hsl(var(--muted-foreground))",
                     boxShadow: i === 6 ? "0 0 0 1.5px hsl(var(--foreground) / 0.45)" : "none",
                   }}>
                {days[i]}
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={onToggle}
          className={cn(
            "w-full h-10 rounded-[8px] font-medium text-[13px] transition-all flex items-center justify-center gap-2",
            habit.done
              ? "bg-[hsl(142_70%_45%/0.15)] text-[hsl(142_70%_60%)] border border-[hsl(142_70%_45%/0.3)]"
              : "border border-[hsl(var(--border))] hover:border-[hsl(var(--primary)/0.4)] hover:bg-[hsl(var(--primary)/0.05)]"
          )}
        >
          {habit.done ? <><Icons.Check size={15}/> {t("habits.doneToday")}</> : <>{t("habits.checkToday")}</>}
        </button>
      </div>
    </Card>
  );
}

/* ============================================================
   PAGE 8 — GOALS (/goals)
   CRUD via stores (useGoals). Card supports double-click rename,
   inline progress +/− buttons, and edit/delete via menu.
============================================================ */

function GoalsPage({ emptyState }) {
  const t = useT();
  const [goals, ops] = useGoals();
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("all");
  const [filterOpen, setFilterOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const categories = useMemo(() => {
    return Array.from(new Set(goals.map(g => g.cat)));
  }, [goals]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return goals.filter(g => {
      if (q && !g.t.toLowerCase().includes(q)) return false;
      if (cat !== "all" && g.cat !== cat) return false;
      return true;
    });
  }, [goals, search, cat]);

  const openCreate = () => { setEditTarget(null); setModalOpen(true); };
  const openEdit = (g) => { setEditTarget(g); setModalOpen(true); };

  if (emptyState || goals.length === 0) {
    return (
      <div className="space-y-5">
        <div>
          <h1 className="text-[24px] font-bold tracking-tight">{t("goals.title")}</h1>
        </div>
        <Card padding="p-20" className="text-center">
          <div className="w-16 h-16 rounded-full bg-[hsl(var(--primary)/0.12)] flex items-center justify-center mx-auto mb-5">
            <Icons.Target size={28} className="text-[hsl(var(--primary))]" />
          </div>
          <h3 className="text-[20px] font-semibold mb-2">{t("goals.empty")}</h3>
          <p className="text-[14px] text-[hsl(var(--muted-foreground))] mb-7 max-w-md mx-auto">
            Set your first SMART goals. The app will guide you in writing and tracking them.
          </p>
          <Button size="lg" icon={Icons.Plus} onClick={openCreate}>{t("goals.newGoal")}</Button>
        </Card>
        <GoalModal open={modalOpen} initial={editTarget} onClose={() => setModalOpen(false)}
          onSave={(payload) => editTarget ? ops.update(editTarget.id, payload) : ops.add(payload)}
        />
      </div>
    );
  }

  const active = goals.filter(g => g.status === "active").length;
  const done = goals.filter(g => g.status === "done").length;

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-[24px] font-bold tracking-tight">{t("goals.title")}</h1>
          <p className="text-[13px] text-[hsl(var(--muted-foreground))] mt-1">{active} active · {done} completed</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Icons.Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder={t("goals.searchPlaceholder")}
              className="h-9 pl-8 pr-3 rounded-[8px] border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-[12.5px] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] w-56" />
          </div>
          <FilterDropdown
            open={filterOpen} setOpen={setFilterOpen}
            value={cat} onChange={setCat}
            label={t("common.category")}
            options={[{ id: "all", label: t("common.all") }, ...categories.map(c => ({ id: c, label: c }))]}
          />
          <ModuleTutorialButton module="goals" />
          <Button size="sm" icon={Icons.Plus} onClick={openCreate}>{t("goals.new")}</Button>
        </div>
      </div>

      <div className="text-[11px] text-[hsl(var(--muted-foreground))] italic flex items-center gap-1.5">
        <Icons.Edit size={11} /> Double-click a goal title to rename it — or a goal's number to set an exact value.
      </div>

      {filtered.length === 0 && (
        <Card padding="p-10" className="text-center text-[13px] text-[hsl(var(--muted-foreground))]">
          No goal matches the filters.
          <button onClick={() => { setSearch(""); setCat("all"); }} className="ml-2 text-[hsl(var(--primary))] hover:underline">Reset</button>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map(g => (
          <GoalCard key={g.id} goal={g}
            onRename={(title) => ops.update(g.id, { t: title })}
            onProgress={(cur) => ops.update(g.id, { cur, status: cur >= g.max ? "done" : "active" })}
            onEdit={() => openEdit(g)}
            onDelete={() => { if (window.confirm(t("goals.deleteConfirm"))) ops.remove(g.id); }}
          />
        ))}
        <button
          onClick={openCreate}
          className="rounded-[12px] border-2 border-dashed border-[hsl(var(--border))] hover:border-[hsl(var(--primary)/0.4)] hover:bg-[hsl(var(--primary)/0.04)] p-7 text-center transition-all flex flex-col items-center justify-center min-h-[160px]">
          <Icons.PlusCircle size={28} className="text-[hsl(var(--muted-foreground))] mb-2" />
          <span className="text-[13px] font-medium text-[hsl(var(--muted-foreground))]">{t("goals.newGoal")}</span>
        </button>
      </div>

      <GoalModal open={modalOpen} initial={editTarget} onClose={() => setModalOpen(false)}
        onSave={(payload) => editTarget ? ops.update(editTarget.id, payload) : ops.add(payload)}
      />
    </div>
  );
}

function GoalCard({ goal, onRename, onProgress, onEdit, onDelete }) {
  const t = useT();
  const Icon = Icons[goal.iconName] || Icons.Target;
  const pct = (goal.cur / goal.max) * 100;
  const done = goal.status === "done";
  const smartKeys = ["S", "M", "A", "R", "T"];
  const smartLabels = { S: "Specific", M: "Measurable", A: "Achievable", R: "Realistic", T: "Time-bound" };

  const [renaming, setRenaming] = useState(false);
  const [val, setVal] = useState(goal.t);
  const inputRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => { setVal(goal.t); }, [goal.t]);
  useEffect(() => {
    if (!menuOpen) return;
    const h = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [menuOpen]);
  useEffect(() => {
    if (renaming) {
      setVal(window.__dpmTr ? window.__dpmTr(goal.t) : goal.t);
      requestAnimationFrame(() => { inputRef.current?.focus(); inputRef.current?.select(); });
    }
  }, [renaming]);

  const commit = () => {
    const v = val.trim();
    const shown = window.__dpmTr ? window.__dpmTr(goal.t) : goal.t;
    if (v && v !== goal.t && v !== shown) onRename(v); else setVal(goal.t);
    setRenaming(false);
  };

  const tick = (delta) => {
    const next = Math.max(0, Math.min(goal.max, goal.cur + delta));
    onProgress(next);
  };

  // Double-click the current value to type an exact number.
  const [editingCur, setEditingCur] = useState(false);
  const [curDraft, setCurDraft] = useState(String(goal.cur));
  const curRef = useRef(null);
  useEffect(() => { setCurDraft(String(goal.cur)); }, [goal.cur]);
  useEffect(() => {
    if (editingCur) requestAnimationFrame(() => { curRef.current?.focus(); curRef.current?.select(); });
  }, [editingCur]);
  const commitCur = () => {
    const n = parseInt(curDraft, 10);
    if (Number.isFinite(n)) onProgress(Math.max(0, Math.min(goal.max, n)));
    setEditingCur(false);
  };

  return (
    <Card padding="p-5" className="relative overflow-hidden group/gcard" data-tour="feat-goals-card">
      <div className="absolute top-0 left-0 right-0 h-1" style={{ background: `hsl(${goal.color})` }} />
      <div className="flex items-start gap-4">
        <div className="w-11 h-11 rounded-[10px] flex items-center justify-center flex-shrink-0" style={{ background: `hsl(${goal.color} / 0.15)`, color: `hsl(${goal.color})` }}>
          <Icon size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            {renaming ? (
              <input
                ref={inputRef}
                value={val}
                onChange={e => setVal(e.target.value)}
                onBlur={commit}
                onKeyDown={e => {
                  if (e.key === "Enter") { e.preventDefault(); commit(); }
                  if (e.key === "Escape") { setVal(goal.t); setRenaming(false); }
                }}
                className="flex-1 text-[15.5px] font-semibold leading-tight bg-transparent border-b-2 border-[hsl(var(--primary))] focus:outline-none"
              />
            ) : (
              <h3
                onDoubleClick={() => setRenaming(true)}
                title={t("common.help.dblclick")}
                className="text-[15.5px] font-semibold leading-tight cursor-text hover:text-[hsl(var(--primary))] transition-colors"
              >{goal.t}</h3>
            )}
            <div className="relative flex-shrink-0" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(o => !o)}
                title={t("common.menu.options")}
                className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"><Icons.More size={14}/></button>
              {menuOpen && (
                <div role="menu" className="absolute right-0 top-full mt-1 w-40 rounded-[10px] border border-[hsl(var(--border))] bg-[hsl(var(--popover))] shadow-xl py-1 z-20 anim-fade-in">
                  <button onClick={() => { setMenuOpen(false); setRenaming(true); }}
                    className="w-full px-3 py-1.5 text-[12.5px] flex items-center gap-2 hover:bg-[hsl(var(--accent))] text-left">
                    <Icons.Edit size={12} className="text-[hsl(var(--muted-foreground))]" /> {t("common.rename")}
                  </button>
                  <button onClick={() => { setMenuOpen(false); onEdit(); }}
                    className="w-full px-3 py-1.5 text-[12.5px] flex items-center gap-2 hover:bg-[hsl(var(--accent))] text-left">
                    <Icons.Settings size={12} className="text-[hsl(var(--muted-foreground))]" /> {t("common.edit")}
                  </button>
                  <div className="my-1 border-t border-[hsl(var(--border))]" />
                  <button onClick={() => { setMenuOpen(false); onDelete(); }}
                    className="w-full px-3 py-1.5 text-[12.5px] flex items-center gap-2 hover:bg-[hsl(0_84%_60%/0.1)] text-[hsl(0_84%_70%)] text-left">
                    <Icons.Trash size={12} /> {t("common.delete")}
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-[hsl(var(--muted-foreground))] mb-4">
            <Badge variant="muted">{goal.cat}</Badge>
            <span>·</span>
            <span>{goal.from} → {goal.to}</span>
            {done && <><span>·</span><Badge variant="success" dot>Completed</Badge></>}
            {window.__dpmIsShared && window.__dpmIsShared(goal) && (
              <Badge variant="primary" className="text-[10px]"><Icons.Layers size={9} /> Shared</Badge>
            )}
          </div>

          {/* Progress */}
          <div className="mb-4">
            <div className="flex items-baseline justify-between mb-1.5">
              <div className="flex items-baseline gap-2">
                <button onClick={() => tick(-1)} title="-1"
                  className="w-6 h-6 rounded-md border border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))] text-[14px] flex items-center justify-center">−</button>
                {editingCur ? (
                  <input
                    ref={curRef}
                    type="text"
                    inputMode="numeric"
                    value={curDraft}
                    onChange={(e) => setCurDraft(e.target.value.replace(/[^\d]/g, ""))}
                    onBlur={commitCur}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") { e.preventDefault(); commitCur(); }
                      else if (e.key === "Escape") { setCurDraft(String(goal.cur)); setEditingCur(false); }
                    }}
                    className="w-16 text-[20px] font-bold tabular-nums bg-transparent border-b-2 border-[hsl(var(--primary))] focus:outline-none text-center"
                  />
                ) : (
                  <span
                    onDoubleClick={() => setEditingCur(true)}
                    title="Double-cliquez pour saisir une valeur"
                    className="text-[20px] font-bold tabular-nums cursor-text hover:text-[hsl(var(--primary))] transition-colors"
                  >{goal.cur}</span>
                )}
                <button onClick={() => tick(1)} title="+1"
                  className="w-6 h-6 rounded-md border border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))] text-[14px] flex items-center justify-center">+</button>
                <span className="text-[13px] text-[hsl(var(--muted-foreground))] tabular-nums">/ {goal.max} {goal.unit}</span>
              </div>
              <span className="text-[13px] font-semibold tabular-nums" style={{ color: `hsl(${goal.color})` }}>{Math.round(pct)}%</span>
            </div>
            <div className="h-2 rounded-full bg-[hsl(var(--muted))] overflow-hidden">
              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(100, pct)}%`, background: `hsl(${goal.color})` }} />
            </div>
          </div>

          {/* SMART */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5" data-tour="feat-goals-smart">
              {smartKeys.map(k => (
                <div key={k} title={smartLabels[k]}
                  className={cn(
                    "w-6 h-6 rounded-md flex items-center justify-center text-[10.5px] font-bold border",
                    goal.smart[k]
                      ? "bg-[hsl(142_70%_45%/0.15)] text-[hsl(142_70%_60%)] border-[hsl(142_70%_45%/0.3)]"
                      : "bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] border-[hsl(var(--border))]"
                  )}
                >{k}</div>
              ))}
            </div>
            {goal.linked.length > 0 && (
              <div className="flex items-center gap-1.5 text-[11px] text-[hsl(var(--muted-foreground))]">
                <Icons.Flame size={11} />
                {goal.linked.length} lien{goal.linked.length > 1 ? "s" : ""}
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

/* ============================================================
   DASHBOARD WIDGETS — modular, toggleable
============================================================ */
const DASHBOARD_WIDGETS = [
  { id: "stats",     label: "Key indicators",        group: "Overview",    desc: "4 cards: hours, tasks, completion, score" },
  { id: "explorer",  label: "Metrics explorer",      group: "Overview",    desc: "One chart with a metric selector — period inherited from the header" },
  { id: "score",     label: "Score & temps",         group: "Performance", desc: "Score de productivité + répartition du temps, combinés" },
  { id: "streaks",   label: "Habit streaks",         group: "Performance", desc: "Current consecutive habits" },
  { id: "goals",     label: "Goal progress",         group: "Goals",       desc: "Progress bars for long-term goals" },
  { id: "workload",    label: "Workload (carousel)",   group: "Workload",    desc: "Carousel: workload by day, meetings, work — arrow navigation" },
  { id: "health-sleep", label: "Health & sleep",        group: "Wellness",    desc: "Vitals + sleep + chronotype in one carousel, with a day/week/month/year selector" },
];

const DASHBOARD_STORAGE_KEY = "dpm-dashboard-widgets-v1";

/* Generic widget-visibility hook — keyed by storage slot + widget catalog.
   Drives both the Tableau d'analyses (DASHBOARD_WIDGETS) and the Home
   (HOME_WIDGETS, defined in pages-daily.jsx). Also tracks the user's
   custom widget ORDER (P11.7) so reordering on the page or in the panel
   writes to a single source of truth. */
function useWidgetVisibility(storageKey, widgets) {
  const allOn = useMemo(() => Object.fromEntries(widgets.map(w => [w.id, true])), [widgets]);
  const defaultOrder = useMemo(() => widgets.map(w => w.id), [widgets]);
  // Required panels (P24) can be reordered but never hidden — they preserve a
  // view's reason for being (e.g. the focus timer). No-op for catalogs without.
  const requiredIds = useMemo(() => new Set(widgets.filter(w => w.required).map(w => w.id)), [widgets]);
  const forceRequired = (vis) => {
    if (!requiredIds.size) return vis;
    const next = { ...vis };
    requiredIds.forEach(id => { next[id] = true; });
    return next;
  };

  const [visible, setVisible] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return forceRequired({ ...allOn, ...(JSON.parse(saved).visible || JSON.parse(saved)) });
    } catch (e) { /* ignore */ }
    return allOn;
  });
  const [order, setOrder] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        const savedOrder = parsed.order;
        if (Array.isArray(savedOrder)) {
          // Reconcile with current catalog: keep saved order for known ids,
          // append any new widget ids at the end.
          const known = new Set(defaultOrder);
          const valid = savedOrder.filter(id => known.has(id));
          for (const id of defaultOrder) if (!valid.includes(id)) valid.push(id);
          return valid;
        }
      }
    } catch (e) { /* ignore */ }
    return defaultOrder;
  });

  useEffect(() => {
    try { localStorage.setItem(storageKey, JSON.stringify({ visible, order })); } catch (e) { /* ignore */ }
  }, [storageKey, visible, order]);

  const toggle = (id) => { if (requiredIds.has(id)) return; setVisible(v => ({ ...v, [id]: !v[id] })); };
  const reset = () => { setVisible(allOn); setOrder(defaultOrder); };
  const hideAll = () => setVisible(forceRequired(Object.fromEntries(widgets.map(w => [w.id, false]))));
  /* Move widget `id` to a new position. `toId` = drop on this widget (insert before),
     or null = drop at the end. */
  const reorder = (movedId, toId) => {
    setOrder(curr => {
      const without = curr.filter(id => id !== movedId);
      if (toId == null) return [...without, movedId];
      const idx = without.indexOf(toId);
      if (idx < 0) return [...without, movedId];
      return [...without.slice(0, idx), movedId, ...without.slice(idx)];
    });
  };
  /* Accessible reorder: shift `id` by `delta` (-1 up / +1 down) among the
     VISIBLE widgets in order, so keyboard/button users aren't stuck with drag. */
  const move = (id, delta) => {
    setOrder(curr => {
      const visibleOrder = curr.filter(wid => {
        const w = widgets.find(x => x.id === wid);
        return w && visible[wid] !== false;
      });
      const i = visibleOrder.indexOf(id);
      const j = i + delta;
      if (i < 0 || j < 0 || j >= visibleOrder.length) return curr;
      const targetId = visibleOrder[j];
      // swap id and targetId positions in the FULL order array
      const next = curr.slice();
      const a = next.indexOf(id), b = next.indexOf(targetId);
      [next[a], next[b]] = [next[b], next[a]];
      return next;
    });
  };

  return { visible, toggle, reset, hideAll, order, reorder, move, requiredIds };
}
if (typeof window !== "undefined") window.useWidgetVisibility = useWidgetVisibility;
/* P24 — semantic alias: per-view layout (order + visibility) persisted under
   dpm-layout-<viewId>. Same engine as the widget customizer, generalized to any
   view's panels. */
if (typeof window !== "undefined") window.useViewLayout = (viewId, panels) => useWidgetVisibility("dpm-layout-" + viewId, panels);

function useDashboardWidgets() {
  return useWidgetVisibility(DASHBOARD_STORAGE_KEY, DASHBOARD_WIDGETS);
}

/* Wraps a widget Card; renders nothing when hidden; shows a discreet "hide"
   handle on hover. Accepts a widgets catalog (defaults to DASHBOARD_WIDGETS).
   When draggable (onDragStart provided), also exposes a ⠿ grab handle. */
function Widget({ id, visible, onHide, children, className, widgets = DASHBOARD_WIDGETS, draggable, onDragStart, onDragEnd, onDragOver, onDrop, dragging, customizing }) {
  if (!visible[id]) return null;
  const meta = widgets.find(w => w.id === id);
  const canDrag = draggable && customizing;
  return (
    <div
      data-tour={"w-" + id}
      className={cn(
        "relative group/widget", className,
        dragging && "opacity-30",
        customizing && "rounded-[14px] outline-2 outline-dashed outline-offset-2 outline-[hsl(var(--primary)/0.4)]"
      )}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      {children}
      {canDrag && (
        <button
          type="button"
          draggable
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          title={`Drag to reorder “${meta?.label}”`}
          aria-label={`Reorder ${meta?.label}`}
          className="absolute top-2.5 left-2.5 w-7 h-7 rounded-md bg-[hsl(var(--card))]/90 backdrop-blur border border-[hsl(var(--border))] flex items-center justify-center text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))] transition-colors cursor-grab active:cursor-grabbing focus:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] z-10"
        >
          <Icons.Drag size={12} />
        </button>
      )}
      {customizing && (
        <button
          type="button"
          onClick={() => onHide(id)}
          title={`Hide “${meta?.label}”`}
          aria-label={`Hide the ${meta?.label} widget`}
          className="absolute top-2.5 right-2.5 w-7 h-7 rounded-md bg-[hsl(var(--card))]/90 backdrop-blur border border-[hsl(var(--border))] flex items-center justify-center text-[hsl(var(--muted-foreground))] hover:text-[hsl(0_84%_70%)] hover:bg-[hsl(0_84%_60%/0.12)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] z-10"
        >
          <Icons.X size={13} />
        </button>
      )}
    </div>
  );
}

/* ============================================================
   PAGE 9 — DASHBOARD (/dashboard)
============================================================ */
function DashboardPage() {
  const [range, setRange] = useState("week");
  const [customizing, setCustomizing] = useState(false);
  const { visible, toggle, reset, hideAll, order, reorder } = useDashboardWidgets();
  const visibleCount = DASHBOARD_WIDGETS.filter(w => visible[w.id]).length;
  const totalCount = DASHBOARD_WIDGETS.length;
  const anyWidgetVisible = visibleCount > 0;

  // Slot map keyed by widget id — render content in user-defined `order`.
  // Multi-widget rows from the old layout are split into single full-width
  // widgets so each can be reordered independently (P11.7).
  const SLOTS = {
    stats: (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Planned hours" value="24.5h" delta="+12% vs prev wk" trend="up" />
        <StatCard label="Tasks completed" value="15/20" delta="+3 vs prev wk" trend="up" />
        <StatCard label="Completion rate" value="75%" delta="+5%" trend="up" />
        <StatCard label="Productivity score" value="78" valueSuffix="/100" delta="+4" trend="up" />
      </div>
    ),
    explorer: <MetricExplorer range={range} />,
    score: (
      <Card>
        <div className="flex items-center justify-between mb-4">
          <SectionTitle className="mb-0">Aujourd'hui</SectionTitle>
          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[hsl(142_70%_45%/0.15)] text-[hsl(142_70%_60%)]">Good</span>
        </div>

        {/* Score ring + breakdown bars */}
        <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6 items-center">
          <div className="flex flex-col items-center">
            <Ring value={78} size={150} stroke={12}>
              <div className="text-center">
                <div className="text-[40px] font-bold tabular-nums leading-none">78</div>
                <div className="text-[10px] uppercase tracking-wider text-[hsl(var(--muted-foreground))] font-semibold mt-1">/ 100</div>
              </div>
            </Ring>
          </div>
          <div className="space-y-3">
            {[
              { l: "Tâches",    w: "30%", v: 85, c: "263 70% 60%", icon: Icons.CheckSquare },
              { l: "Focus",     w: "30%", v: 72, c: "142 70% 50%", icon: Icons.Target },
              { l: "Habitudes", w: "20%", v: 65, c: "38 92% 55%",  icon: Icons.Flame },
              { l: "Équilibre", w: "20%", v: 90, c: "217 91% 60%", icon: Icons.Activity },
            ].map(b => (
              <div key={b.l}>
                <div className="flex items-center justify-between text-[12px] mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <b.icon size={13} style={{ color: `hsl(${b.c})` }} />
                    <span className="font-medium">{b.l}</span>
                    <span className="text-[hsl(var(--muted-foreground))]">({b.w})</span>
                  </span>
                  <span className="tabular-nums font-semibold" style={{ color: `hsl(${b.c})` }}>{b.v}%</span>
                </div>
                <div className="h-2 rounded-full bg-[hsl(var(--muted))] overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${b.v}%`, background: `hsl(${b.c})` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[hsl(var(--border))] my-5" />

        {/* Time distribution — stacked bar + legend */}
        <div className="text-[10.5px] uppercase tracking-wider font-semibold text-[hsl(var(--muted-foreground))] mb-2.5">Répartition du temps</div>
        <div className="flex h-3.5 rounded-full overflow-hidden gap-px mb-3">
          {[
            { c: "263 70% 60%", v: 40 },
            { c: "217 91% 60%", v: 30 },
            { c: "38 92% 55%", v: 18 },
            { c: "142 70% 50%", v: 12 },
          ].map((s, i) => (
            <div key={i} className="h-full first:rounded-l-full last:rounded-r-full" style={{ width: `${s.v}%`, background: `hsl(${s.c})` }} />
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
          {[
            { c: "263 70% 60%", l: "Focus", v: "9h48", p: "40%" },
            { c: "217 91% 60%", l: "Réunions", v: "7h21", p: "30%" },
            { c: "38 92% 55%", l: "Admin", v: "4h25", p: "18%" },
            { c: "142 70% 50%", l: "Pauses", v: "2h56", p: "12%" },
          ].map(r => (
            <div key={r.l} className="flex items-center gap-2 text-[13px]">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: `hsl(${r.c})` }} />
              <span className="text-[hsl(var(--muted-foreground))]">{r.l}</span>
              <span className="ml-auto font-semibold tabular-nums">{r.v}</span>
              <span className="text-[hsl(var(--muted-foreground))] w-9 text-right tabular-nums">{r.p}</span>
            </div>
          ))}
        </div>

        {/* Conseil footer */}
        <div className="mt-5 rounded-[10px] border border-[hsl(263_70%_60%/0.3)] bg-[hsl(263_70%_60%/0.07)] p-3.5 flex items-start gap-2.5">
          <Icons.Sparkles size={14} className="text-[hsl(263_70%_75%)] mt-0.5 flex-shrink-0" />
          <div>
            <div className="text-[10.5px] uppercase tracking-wider font-bold text-[hsl(263_70%_78%)] mb-0.5">Conseil</div>
            <p className="text-[12.5px] leading-relaxed" style={{ textWrap: "pretty" }}>Bloque 2 h de focus demain matin pour passer ton score au-dessus de 80.</p>
          </div>
        </div>
      </Card>
    ),
    streaks: (
      <Card>
        <SectionTitle action={
          <button onClick={() => window.__dpmNavigate?.("habits")} className="text-[11px] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] flex items-center gap-1">
            Voir plus <Icons.ArrowRight size={11} />
          </button>
        }>
          Séries en cours
        </SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { icon: Icons.Run, name: "Running", days: 12, color: "217 91% 60%" },
            { icon: Icons.Coffee, name: "No coffee after 2pm", days: 9, color: "20 90% 55%" },
            { icon: Icons.Brain, name: "Meditation", days: 7, color: "263 70% 60%" },
            { icon: Icons.Pen, name: "Journaling", days: 5, color: "330 80% 60%" },
            { icon: Icons.Book, name: "Lecture", days: 3, color: "142 70% 50%" },
          ].map(s => (
            <div key={s.name} className="flex items-center gap-3 p-2 rounded-[8px] bg-[hsl(var(--muted)/0.25)]">
              <div className="w-9 h-9 rounded-[8px] flex items-center justify-center flex-shrink-0" style={{ background: `hsl(${s.color} / 0.15)`, color: `hsl(${s.color})` }}>
                <s.icon size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[12.5px] font-medium truncate">{s.name}</div>
                <div className="text-[10.5px] text-[hsl(var(--muted-foreground))]">{s.days} consecutive days</div>
              </div>
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-[hsl(38_92%_55%/0.12)] text-[hsl(38_92%_60%)]">
                <Icons.Flame size={11} />
                <span className="text-[11px] font-semibold tabular-nums">{s.days}j</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    ),
    goals: (
      <Card>
        <SectionTitle action={<button className="text-[11px] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]">View all →</button>}>
          Goal progress
        </SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          {[
            { t: "Lire 24 livres", v: 15, m: 24, c: "263 70% 60%" },
            { t: "Run 50h this month", v: 32, m: 50, c: "217 91% 60%" },
            { t: "Apprendre Rust", v: 8, m: 30, c: "20 90% 55%" },
            { t: "Perdre 5kg", v: 3, m: 5, c: "142 70% 50%" },
          ].map(g => (
            <div key={g.t}>
              <div className="flex items-baseline justify-between mb-1.5">
                <span className="text-[13px] font-medium">{g.t}</span>
                <span className="text-[12px] text-[hsl(var(--muted-foreground))] tabular-nums">{g.v}/{g.m}</span>
              </div>
              <div className="h-2 rounded-full bg-[hsl(var(--muted))] overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${(g.v/g.m)*100}%`, background: `hsl(${g.c})` }} />
              </div>
            </div>
          ))}
        </div>
      </Card>
    ),
    deadlines: (
      <Card>
        <SectionTitle>Upcoming deadlines</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {[
            { t: "Deliver client mockups", w: "Tomorrow, 18:00", d: "1d", c: "danger" },
            { t: "Review code PR #142", w: "Mercredi, 12:00", d: "3j", c: "orange" },
            { t: "Prep Q2 presentation", w: "Friday, 09:00", d: "5d", c: "warning" },
            { t: "Sprint planning", w: "Lundi prochain", d: "8j", c: "muted" },
          ].map((t, i) => (
            <div key={i} className="flex items-center gap-3 p-2.5 rounded-[8px] bg-[hsl(var(--muted)/0.3)] hover:bg-[hsl(var(--accent)/0.4)] transition-colors cursor-pointer">
              <div className={cn("w-1 h-9 rounded-full",
                t.c === "danger" && "bg-[hsl(0_84%_60%)]",
                t.c === "orange" && "bg-[hsl(20_90%_55%)]",
                t.c === "warning" && "bg-[hsl(50_90%_55%)]",
                t.c === "muted" && "bg-[hsl(var(--muted-foreground))]"
              )} />
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-medium truncate">{t.t}</div>
                <div className="text-[11px] text-[hsl(var(--muted-foreground))] mt-0.5">{t.w}</div>
              </div>
              <Badge variant={t.c} className="font-mono tabular-nums">{t.d}</Badge>
            </div>
          ))}
        </div>
      </Card>
    ),
    workload: <ChargeCarousel />,
    "health-sleep": window.HealthSleepWidget ? <window.HealthSleepWidget period={range} onSeeDetails={() => window.__dpmNavigate?.("settings")} /> : null,
  };

  // Drag-and-drop reorder state (Mechanism B — drag in-place on the page)
  const [draggingWidget, setDraggingWidget] = useState(null);
  const [overWidget, setOverWidget] = useState(null);
  const onWidgetDragStart = (id) => (e) => {
    setDraggingWidget(id);
    e.dataTransfer.effectAllowed = "move";
    try { e.dataTransfer.setData("text/plain", id); } catch {}
  };
  const onWidgetDragOver = (id) => (e) => {
    if (!draggingWidget || draggingWidget === id) return;
    e.preventDefault();
    setOverWidget(id);
  };
  const onWidgetDrop = (id) => (e) => {
    e.preventDefault();
    if (draggingWidget && draggingWidget !== id) reorder(draggingWidget, id);
    setDraggingWidget(null);
    setOverWidget(null);
  };
  const onWidgetDragEnd = () => { setDraggingWidget(null); setOverWidget(null); };

  return (
    <div className="flex gap-5 items-start min-h-full">
      <div className="flex-1 min-w-0 space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-[24px] font-bold tracking-tight">Analytics dashboard</h1>
            <p className="text-[13px] text-[hsl(var(--muted-foreground))] mt-1">Private analytics · your productivity metrics</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <ViewToggle value={range} onChange={setRange} options={[
              { value: "today", label: "Day" },
              { value: "week", label: "Week" },
              { value: "month", label: "Month" },
              { value: "quarter", label: "Trimestre" },
              { value: "year", label: "Year" },
            ]} />
            <ModuleTutorialButton module="dashboard" />
            <Button
              variant={customizing ? "primary" : "outline"}
              size="sm"
              icon={Icons.Layout}
              onClick={() => setCustomizing(c => !c)}
            >
              Personnaliser
              {visibleCount < totalCount && (
                <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-[hsl(var(--primary)/0.18)] text-[hsl(263_70%_80%)] text-[10px] font-mono tabular-nums">
                  {visibleCount}/{totalCount}
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* Empty state */}
        {!anyWidgetVisible && (
          <Card padding="p-12" className="text-center border-dashed">
            <div className="w-14 h-14 rounded-full bg-[hsl(var(--muted))] flex items-center justify-center mx-auto mb-4">
              <Icons.Layout size={24} className="text-[hsl(var(--muted-foreground))]" />
            </div>
            <h3 className="text-[16px] font-semibold mb-1.5">All widgets are hidden</h3>
            <p className="text-[12.5px] text-[hsl(var(--muted-foreground))] max-w-sm mx-auto mb-5">
              Open “Customize” to re-enable the sections you care about.
            </p>
            <Button size="sm" icon={Icons.Layout} onClick={() => setCustomizing(true)}>Customize</Button>
          </Card>
        )}

        {/* Reorderable widget feed — vertical stack rendered in user-defined order. */}
        {order.map(id => {
          if (!SLOTS[id]) return null;
          const isOver = overWidget === id && draggingWidget && draggingWidget !== id;
          return (
            <React.Fragment key={id}>
              {isOver && <div className="h-1 -my-2 rounded-full bg-[hsl(var(--primary))] shadow-[0_0_0_3px_hsl(var(--primary)/0.25)]" />}
              <Widget
                id={id}
                visible={visible}
                onHide={toggle}
                widgets={DASHBOARD_WIDGETS}
                draggable
                customizing={customizing}
                onDragStart={onWidgetDragStart(id)}
                onDragEnd={onWidgetDragEnd}
                onDragOver={onWidgetDragOver(id)}
                onDrop={onWidgetDrop(id)}
                dragging={draggingWidget === id}
              >
                {SLOTS[id]}
              </Widget>
            </React.Fragment>
          );
        })}
      </div>

      {/* Customize panel — docked right, full-height, in-flow on desktop */}
      {customizing && (
        <CustomizePanel
          visible={visible}
          onToggle={toggle}
          onReset={reset}
          onHideAll={hideAll}
          onClose={() => setCustomizing(false)}
          visibleCount={visibleCount}
          totalCount={totalCount}
          order={order}
          onReorder={reorder}
        />
      )}
    </div>
  );
}

function CustomizePanel({ visible, onToggle, onReset, onHideAll, onClose, visibleCount, totalCount, widgets = DASHBOARD_WIDGETS, surfaceLabel = "le tableau", order, onReorder, onMove }) {
  const t = (window.useT ? window.useT() : (k) => k);
  // Group widgets by their `group` field, preserving the user's custom ORDER
  // when reordering is enabled (order prop present). Falls back to declaration
  // order when no order is provided.
  const orderedWidgets = useMemo(() => {
    if (!order) return widgets;
    const byId = Object.fromEntries(widgets.map(w => [w.id, w]));
    return order.map(id => byId[id]).filter(Boolean);
  }, [widgets, order]);

  const [draggingId, setDraggingId] = useState(null);
  const [overId, setOverId] = useState(null);

  // Flat reorder ignores groups; the grouped display is just visual.
  const onItemDragStart = (id) => {
    setDraggingId(id);
  };
  const onItemDragOver = (e, id) => {
    if (!draggingId) return;
    e.preventDefault();
    setOverId(id);
  };
  const onItemDrop = (id) => {
    if (!draggingId || !onReorder) { setDraggingId(null); setOverId(null); return; }
    if (draggingId !== id) onReorder(draggingId, id);
    setDraggingId(null);
    setOverId(null);
  };
  const onItemDragEnd = () => { setDraggingId(null); setOverId(null); };

  const groups = useMemo(() => {
    const out = [];
    for (const w of orderedWidgets) {
      let g = out.find(x => x.name === w.group);
      if (!g) { g = { name: w.group, items: [] }; out.push(g); }
      g.items.push(w);
    }
    return out;
  }, [orderedWidgets]);

  return (
    <aside className="w-[320px] flex-shrink-0 sticky top-0 self-start max-h-[calc(100vh-3rem)] overflow-hidden rounded-[12px] border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-xl anim-fade-in flex flex-col">
      <div className="px-4 pt-4 pb-3 border-b border-[hsl(var(--border))] flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Icons.Layout size={14} className="text-[hsl(var(--primary))]" />
            <h3 className="text-[13.5px] font-semibold">Customize {surfaceLabel}</h3>
          </div>
          <p className="text-[11.5px] text-[hsl(var(--muted-foreground))] mt-1 leading-snug">Enable or hide sections. Your settings are remembered.</p>
        </div>
        <button
          onClick={onClose}
          aria-label="Close the panel"
          className="w-7 h-7 rounded-md hover:bg-[hsl(var(--accent))] flex items-center justify-center text-[hsl(var(--muted-foreground))] flex-shrink-0 -mr-1"
        >
          <Icons.X size={14} />
        </button>
      </div>

      <div className="px-4 py-2.5 border-b border-[hsl(var(--border))] flex items-center justify-between text-[11px]">
        <span className="text-[hsl(var(--muted-foreground))]">
          <span className="font-semibold tabular-nums text-[hsl(var(--foreground))]">{visibleCount}</span>
          <span> / {totalCount} visibles</span>
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={onHideAll}
            disabled={visibleCount === 0}
            className="px-2 py-1 rounded-md text-[11px] font-medium text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--foreground))] disabled:opacity-40 disabled:pointer-events-none"
          >Hide all</button>
          <button
            onClick={onReset}
            disabled={visibleCount === totalCount}
            className="px-2 py-1 rounded-md text-[11px] font-medium text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary)/0.12)] disabled:opacity-40 disabled:pointer-events-none"
          >Reset</button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-4">
        {groups.map(g => (
          <div key={g.name}>
            <div className="px-2 pb-1.5 text-[10px] uppercase tracking-[0.08em] font-semibold text-[hsl(var(--muted-foreground))]">{g.name}</div>
            <div className="space-y-0.5">
              {g.items.map(w => {
                const isDragging = draggingId === w.id;
                const isOver = overId === w.id && draggingId && draggingId !== w.id;
                const isRequired = !!w.required;
                return (
                  <div
                    key={w.id}
                    onDragOver={(e) => onItemDragOver(e, w.id)}
                    onDrop={() => onItemDrop(w.id)}
                    className={cn(
                      "flex items-start gap-2 px-2 py-2 rounded-[8px] transition-all relative",
                      "hover:bg-[hsl(var(--accent)/0.5)]",
                      isDragging && "opacity-30",
                      isOver && "ring-1 ring-[hsl(var(--primary)/0.6)] bg-[hsl(var(--primary)/0.05)]"
                    )}
                  >
                    {/* Drop indicator above */}
                    {isOver && (
                      <div className="absolute -top-0.5 left-2 right-2 h-0.5 bg-[hsl(var(--primary))] rounded-full" />
                    )}
                    {/* Reorder controls: drag handle + accessible arrows */}
                    {onReorder && (
                      <div className="flex flex-col items-center flex-shrink-0">
                        <button
                          type="button"
                          draggable
                          onDragStart={() => onItemDragStart(w.id)}
                          onDragEnd={onItemDragEnd}
                          title={t("layout.dragReorder")}
                          aria-label={`Reorder ${w.label}`}
                          className="w-6 h-6 rounded-md flex items-center justify-center text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] cursor-grab active:cursor-grabbing"
                        >
                          <Icons.Drag size={11} />
                        </button>
                        {onMove && (
                          <div className="flex flex-col -mt-0.5">
                            <button type="button" onClick={() => onMove(w.id, -1)} aria-label={`Move ${w.label} up`}
                              className="w-6 h-3.5 flex items-center justify-center text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary))]">
                              <Icons.ChevronUp size={11} />
                            </button>
                            <button type="button" onClick={() => onMove(w.id, 1)} aria-label={`Move ${w.label} down`}
                              className="w-6 h-3.5 flex items-center justify-center text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary))]">
                              <Icons.ChevronDown size={11} />
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                    {isRequired ? (
                      <span title={t("layout.requiredTip")}
                        className="w-9 h-5 rounded-full bg-[hsl(var(--muted))] flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Icons.Lock size={11} className="text-[hsl(var(--muted-foreground))]" />
                      </span>
                    ) : (
                      <Switch
                        checked={!!visible[w.id]}
                        onChange={() => onToggle(w.id)}
                      />
                    )}
                    <div className={cn("flex-1 min-w-0", !visible[w.id] && !isRequired && "opacity-55")}>
                      <div className="text-[12.5px] font-medium leading-tight flex items-center gap-1.5">
                        {w.label}
                        {isRequired && <span className="text-[9px] uppercase tracking-wide font-semibold text-[hsl(263_70%_80%)] bg-[hsl(var(--primary)/0.14)] px-1.5 py-0.5 rounded-full">{t("layout.required")}</span>}
                      </div>
                      <div className="text-[11px] text-[hsl(var(--muted-foreground))] mt-0.5 leading-snug">{w.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="px-4 py-3 border-t border-[hsl(var(--border))] text-[10.5px] text-[hsl(var(--muted-foreground))] leading-snug flex items-start gap-1.5">
        <Icons.Sparkles size={11} className="text-[hsl(var(--primary))] mt-0.5 flex-shrink-0" />
        <span>
          {onReorder
            ? "Drag the ⠿ handle to reorder. Hover a widget to hide it (×) or move it directly from the page."
            : "Hover any widget to hide it in one click via the × button."}
        </span>
      </div>
    </aside>
  );
}

function StatCard({ label, value, valueSuffix, delta, trend }) {
  const TrendIcon = trend === "up" ? Icons.ArrowUp : Icons.ArrowDown;
  return (
    <Card padding="p-5">
      <div className="text-[12px] text-[hsl(var(--muted-foreground))] mb-1.5">{label}</div>
      <div className="flex items-baseline gap-1">
        <span className="text-[26px] font-bold tabular-nums leading-none">{value}</span>
        {valueSuffix && <span className="text-[14px] text-[hsl(var(--muted-foreground))] tabular-nums">{valueSuffix}</span>}
      </div>
      <div className="flex items-center gap-1 mt-2 text-[11.5px]">
        <span className={cn("flex items-center gap-0.5 px-1.5 py-0.5 rounded-md font-medium",
          trend === "up" ? "text-[hsl(142_70%_60%)] bg-[hsl(142_70%_45%/0.12)]" : "text-[hsl(0_84%_70%)] bg-[hsl(0_84%_60%/0.12)]"
        )}>
          <TrendIcon size={10} stroke={3} />
          {delta.split(" ")[0]}
        </span>
        <span className="text-[hsl(var(--muted-foreground))] truncate">{delta.split(" ").slice(1).join(" ")}</span>
      </div>
    </Card>
  );
}

function ContributionHeatmap() {
  // 26 weeks × 7 days
  const data = Array.from({ length: 26 }, (_, w) =>
    Array.from({ length: 7 }, (_, d) => {
      const r = Math.sin(w * 1.7 + d * 0.9) * 0.5 + 0.5;
      const v = Math.max(0, Math.min(1, r + (Math.random() - 0.5) * 0.4));
      return v;
    })
  );
  const months = ["Dec", "Jan", "Feb", "Mar", "Apr", "May"];
  return (
    <div>
      <div className="grid grid-cols-26 gap-0.5 text-[9px] text-[hsl(var(--muted-foreground))] mb-1 pl-5" style={{ gridTemplateColumns: "repeat(26, minmax(0, 1fr))" }}>
        {months.map((m, i) => <div key={i} style={{ gridColumn: `span ${26/6}` }}>{m}</div>)}
      </div>
      <div className="flex gap-0.5">
        <div className="flex flex-col gap-0.5 text-[9px] text-[hsl(var(--muted-foreground))] pr-1 justify-around py-1">
          <span>Mon</span><span>Wed</span><span>Fri</span>
        </div>
        <div className="grid grid-flow-col grid-rows-7 gap-0.5 flex-1">
          {data.flat().map((v, i) => {
            const intensity = v > 0.7 ? 4 : v > 0.5 ? 3 : v > 0.3 ? 2 : v > 0.1 ? 1 : 0;
            const bg = ["hsl(var(--muted))",
                        "hsl(263 70% 60% / 0.25)",
                        "hsl(263 70% 60% / 0.5)",
                        "hsl(263 70% 60% / 0.75)",
                        "hsl(263 70% 60% / 1)"][intensity];
            return <div key={i} className="rounded-[3px] aspect-square" style={{ background: bg }} />;
          })}
        </div>
      </div>
      <div className="flex items-center justify-end gap-1.5 mt-2 text-[10px] text-[hsl(var(--muted-foreground))]">
        <span>Less</span>
        {[0,1,2,3,4].map(i => (
          <div key={i} className="w-3 h-3 rounded-[3px]" style={{ background: ["hsl(var(--muted))",
            "hsl(263 70% 60% / 0.25)", "hsl(263 70% 60% / 0.5)", "hsl(263 70% 60% / 0.75)", "hsl(263 70% 60% / 1)"][i] }} />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}

function DonutChart({ segments, size = 140, stroke = 22 }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  let offset = 0;
  return (
    <svg width={size} height={size} className="-rotate-90">
      {segments.map((s, i) => {
        const len = (s.v / 100) * c;
        const el = <circle key={i} cx={size/2} cy={size/2} r={r} fill="none" stroke={`hsl(${s.c})`} strokeWidth={stroke}
                           strokeDasharray={`${len} ${c - len}`} strokeDashoffset={-offset} />;
        offset += len;
        return el;
      })}
    </svg>
  );
}

/* ============================================================
   METRIC EXPLORER — single graph container with metric + period
   selectors. Replaces a row of side-by-side time-series cards.
   Pattern reference: Whoop / Oura / RescueTime — many series in
   little space via selectors, not by stacking cards.
============================================================ */
function MetricExplorer({ range = "week" }) {
  const [metric, setMetric] = useState("energy"); // energy | focus | load
  // Period is inherited from the dashboard header `range`. We map the 5-value
  // range (today / week / month / quarter / year) onto the 3-bucket internal
  // body (day / week / month) so the rest of the explorer stays stable.
  const period = range === "today" ? "day"
    : range === "week" ? "week"
    : "month"; // month, quarter, year all show the month-style view
  const [subTab, setSubTab] = useState("today");  // for energy day view
  const RANGE_LABELS = {
    today: "Day", week: "Week", month: "Month", quarter: "Quarter", year: "Year",
  };

  const METRICS = [
    { id: "energy", label: "Énergie", icon: Icons.Activity, color: "263 70% 60%" },
    { id: "focus",  label: "Focus",   icon: Icons.Target,   color: "142 70% 50%" },
    { id: "load",   label: "Load",   icon: Icons.BarChart, color: "217 91% 60%" },
  ];
  const active = METRICS.find(m => m.id === metric);

  // Quick stats per metric (mock — would be computed in prod)
  const headerStats = {
    energy: [
      { l: "Moyenne",      v: "3.4 / 5" },
      { l: "Pic",          v: "10:00" },
      { l: "Creux",        v: "14:00" },
      { l: "Prises",       v: "4" },
    ],
    focus: [
      { l: "Total",        v: "12h45" },
      { l: "Session moy.", v: "47 min" },
      { l: "Best day",    v: "Tue" },
      { l: "Sessions",     v: "16" },
    ],
    load: [
      { l: "Total",        v: "24h30" },
      { l: "Status",       v: "Balanced" },
      { l: "Busiest day",  v: "Wed" },
      { l: "% meetings",   v: "15.5%" },
    ],
  };

  return (
    <Card padding="p-0" className="overflow-hidden">
      {/* Toolbar */}
      <div className="px-5 pt-4 pb-3 border-b border-[hsl(var(--border))] flex items-start justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <h3 className="text-[14px] font-semibold tracking-tight flex items-center gap-2">
            <active.icon size={14} style={{ color: `hsl(${active.color})` }} />
            Metrics explorer
          </h3>
          <span className="text-[10.5px] text-[hsl(var(--muted-foreground))] font-mono px-1.5 py-0.5 rounded bg-[hsl(var(--muted)/0.4)]" title="Period inherited from the global header filter">
            · {RANGE_LABELS[range] || "Week"}
          </span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Metric tabs only — period comes from the global header */}
          <div className="inline-flex p-0.5 bg-[hsl(var(--muted)/0.5)] rounded-[8px]" role="tablist" aria-label="Metric">
            {METRICS.map(m => (
              <button
                key={m.id}
                role="tab"
                aria-selected={metric === m.id}
                onClick={() => setMetric(m.id)}
                className={cn(
                  "h-7 px-2.5 rounded-[6px] text-[11.5px] font-medium transition-all flex items-center gap-1.5",
                  metric === m.id
                    ? "bg-[hsl(var(--card))] text-[hsl(var(--foreground))] shadow-sm"
                    : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
                )}
                style={metric === m.id ? { color: `hsl(${m.color})` } : {}}
              >
                <m.icon size={11} /> {m.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Header stats row */}
      <div className="px-5 py-3 border-b border-[hsl(var(--border))] grid grid-cols-2 md:grid-cols-4 gap-4">
        {headerStats[metric].map(s => (
          <div key={s.l}>
            <div className="text-[10.5px] uppercase tracking-wider text-[hsl(var(--muted-foreground))] font-semibold mb-1">{s.l}</div>
            <div className="text-[18px] font-bold tabular-nums leading-none">{s.v}</div>
          </div>
        ))}
      </div>

      {/* Body — switches per metric */}
      <div className="p-5">
        {metric === "energy" && (
          <EnergyExplorerBody period={period} subTab={subTab} setSubTab={setSubTab} />
        )}
        {metric === "focus" && (
          <FocusExplorerBody period={period} />
        )}
        {metric === "load" && (
          <LoadExplorerBody period={period} />
        )}
      </div>
    </Card>
  );
}

/* Energy body — keeps the rich curve (axes, legend, Today/History toggle)
   that used to live on the Home. Reuses the existing EnergyCurveToday and
   EnergyHistory components from pages-daily.jsx via window globals. */
function EnergyExplorerBody({ period, subTab, setSubTab }) {
  const [checkIns] = (window.useEnergyCheckIns ? window.useEnergyCheckIns() : [[]]);

  if (period === "day") {
    return (
      <>
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <div className="text-[11.5px] text-[hsl(var(--muted-foreground))]">
            Full curve, readable axes · Today / History
          </div>
          <div className="inline-flex p-0.5 bg-[hsl(var(--muted)/0.5)] rounded-[8px]">
            {[{ id: "today", label: "Today" }, { id: "history", label: "History" }].map(t => (
              <button
                key={t.id}
                onClick={() => setSubTab(t.id)}
                className={cn(
                  "h-7 px-2.5 rounded-[6px] text-[11.5px] font-medium transition-all",
                  subTab === t.id
                    ? "bg-[hsl(var(--card))] text-[hsl(var(--foreground))] shadow-sm"
                    : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
                )}
              >{t.label}</button>
            ))}
          </div>
        </div>
        {subTab === "today" ? <EnergyExplorerToday checkIns={checkIns} /> : <EnergyExplorerHistory />}
      </>
    );
  }

  if (period === "week") return <EnergyWeekChart />;
  return <EnergyMonthChart />;
}

/* Local copies of the curve / history renderers, scaled for the explorer
   container. These mirror the heavy versions removed from the Home so the
   user can still drill in here without losing fidelity. */
function EnergyExplorerToday({ checkIns }) {
  const ES = window.ENERGY_SCALE || [];
  const ESby = window.ENERGY_BY_N || {};
  const dayStart = 6 * 60, dayEnd = 22 * 60;
  const W = 820, H = 180, padL = 38, padR = 16, padT = 16, padB = 26;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;
  const xOf = (timeStr) => {
    const [h, m] = timeStr.split(":").map(Number);
    const mins = Math.max(dayStart, Math.min(dayEnd, h * 60 + m));
    return padL + ((mins - dayStart) / (dayEnd - dayStart)) * plotW;
  };
  const yOf = (lvl) => padT + plotH - ((lvl - 1) / 4) * plotH;
  const sorted = [...checkIns].sort((a, b) => a.time.localeCompare(b.time));
  const pts = sorted.map(c => ({ x: xOf(c.time), y: yOf(c.level), c }));
  if (pts.length === 0) {
    return (
      <div className="py-12 rounded-[10px] border border-dashed border-[hsl(var(--border))] text-center text-[12.5px] text-[hsl(var(--muted-foreground))]">
        No check-in yet today — the app draws your curve as you go.
      </div>
    );
  }
  const path = (() => {
    if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`;
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] || pts[i];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2] || p2;
      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;
      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return d;
  })();
  const areaPath = `${path} L ${pts[pts.length - 1].x} ${padT + plotH} L ${pts[0].x} ${padT + plotH} Z`;
  const ticks = [6, 10, 14, 18, 22];
  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" preserveAspectRatio="none">
        <defs>
          <linearGradient id="explorerEnergyArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(263 70% 60%)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="hsl(263 70% 60%)" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {[1,2,3,4,5].map(l => (
          <g key={l}>
            <line x1={padL} y1={yOf(l)} x2={W - padR} y2={yOf(l)} stroke="hsl(var(--border) / 0.4)" strokeDasharray="2 4" />
            <text x={padL - 6} y={yOf(l) + 3.5} textAnchor="end" style={{ fontSize: 10 }}>{ESby[l]?.emoji}</text>
          </g>
        ))}
        {ticks.map(h => {
          const x = padL + ((h * 60 - dayStart) / (dayEnd - dayStart)) * plotW;
          return (
            <g key={h}>
              <line x1={x} y1={padT} x2={x} y2={padT + plotH} stroke="hsl(var(--border) / 0.25)" />
              <text x={x} y={padT + plotH + 14} textAnchor="middle" className="fill-[hsl(var(--muted-foreground))]" style={{ fontSize: 9.5, fontFamily: "ui-monospace, monospace" }}>{String(h).padStart(2,"0")}:00</text>
            </g>
          );
        })}
        <path d={areaPath} fill="url(#explorerEnergyArea)" />
        <path d={path} fill="none" stroke="hsl(263 70% 72%)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {pts.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="7" fill="hsl(var(--background))" stroke={`hsl(${ESby[p.c.level]?.c})`} strokeWidth="2" />
            <text x={p.x} y={p.y + 4} textAnchor="middle" style={{ fontSize: 10 }}>{ESby[p.c.level]?.emoji}</text>
          </g>
        ))}
      </svg>
      <div className="flex items-center gap-3 mt-2 text-[10.5px] text-[hsl(var(--muted-foreground))] flex-wrap">
        {ES.map(e => (
          <span key={e.n} className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full" style={{ background: `hsl(${e.c})` }} />
            {e.label}
          </span>
        ))}
      </div>
    </div>
  );
}

function EnergyExplorerHistory() {
  const days = [
    { d: "Lun", curve: [2, 3, 4, 5, 4, 3, 4, 3, 2, 3] },
    { d: "Mar", curve: [3, 4, 5, 5, 4, 2, 3, 3, 2, 2] },
    { d: "Mer", curve: [3, 4, 4, 5, 3, 2, 3, 4, 4, 3] },
    { d: "Jeu", curve: [2, 3, 4, 5, 5, 3, 2, 3, 3, 3] },
    { d: "Ven", curve: [3, 4, 5, 4, 3, 2, 2, 3, 2, 1] },
    { d: "Sam", curve: [4, 4, 5, 4, 4, 3, 4, 4, 3, 3] },
    { d: "Dim", curve: [3, 3, 5, 4, 2, 4, 4, 3, 3, 2] },
  ];
  const avg = Array.from({ length: 10 }, (_, i) =>
    days.reduce((a, b) => a + b.curve[i], 0) / days.length
  );
  const W = 820, H = 180, padL = 38, padR = 16, padT = 10, padB = 26;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;
  const xOf = (i) => padL + (i / 9) * plotW;
  const yOf = (l) => padT + plotH - ((l - 1) / 4) * plotH;
  const path = (() => {
    let d = `M ${xOf(0)} ${yOf(avg[0])}`;
    for (let i = 1; i < avg.length; i++) {
      const xMid = (xOf(i - 1) + xOf(i)) / 2;
      d += ` C ${xMid} ${yOf(avg[i - 1])}, ${xMid} ${yOf(avg[i])}, ${xOf(i)} ${yOf(avg[i])}`;
    }
    return d;
  })();
  const hours = ["06","08","10","12","14","16","18","20","22"];
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-7 gap-2">
        {days.map((d, di) => {
          const isToday = di === days.length - 1;
          const pts = d.curve.map((v, i) => `${xOf(i)},${yOf(v)}`).join(" ");
          return (
            <div key={d.d} className={cn(
              "rounded-[8px] p-2 border",
              isToday ? "border-[hsl(var(--primary)/0.5)] bg-[hsl(var(--primary)/0.06)]" : "border-[hsl(var(--border))] bg-[hsl(var(--card))]"
            )}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10.5px] font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">{d.d}</span>
                <span className="text-[9.5px] text-[hsl(var(--muted-foreground))]">{(d.curve.reduce((a,b)=>a+b,0)/d.curve.length).toFixed(1)}</span>
              </div>
              <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-10" preserveAspectRatio="none">
                <polyline points={pts} fill="none" stroke={isToday ? "hsl(var(--primary))" : "hsl(263 70% 60% / 0.6)"} strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" />
              </svg>
            </div>
          );
        })}
      </div>
      <div className="rounded-[10px] border border-[hsl(var(--border))] p-3">
        <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
          <div className="text-[12.5px] font-semibold">Your pattern — 7-day average</div>
          <div className="text-[11px] text-[hsl(142_70%_60%)] flex items-center gap-1">
            <Icons.Sunrise size={11} /> Pic vers 10h · creux vers 14h
          </div>
        </div>
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-32" preserveAspectRatio="none">
          {[1,3,5].map(l => (
            <line key={l} x1={padL} y1={yOf(l)} x2={W - padR} y2={yOf(l)} stroke="hsl(var(--border) / 0.4)" strokeDasharray="2 4" />
          ))}
          <path d={path} fill="none" stroke="hsl(263 70% 72%)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          {avg.map((v, i) => (
            <circle key={i} cx={xOf(i)} cy={yOf(v)} r="3" fill="hsl(263 70% 72%)" />
          ))}
          {hours.map((h, i) => (
            <text key={h} x={padL + (i / 8) * plotW} y={H - 6} textAnchor="middle" className="fill-[hsl(var(--muted-foreground))]" style={{ fontSize: 9, fontFamily: "ui-monospace, monospace" }}>{h}:00</text>
          ))}
        </svg>
      </div>
    </div>
  );
}

function EnergyWeekChart() {
  const days = [
    { d: "Lun", avg: 3.4 },
    { d: "Mar", avg: 3.8 },
    { d: "Mer", avg: 3.2 },
    { d: "Jeu", avg: 3.5 },
    { d: "Ven", avg: 3.0 },
    { d: "Sam", avg: 4.0 },
    { d: "Dim", avg: 3.3 },
  ];
  return (
    <div className="flex items-end gap-3 h-44">
      {days.map(d => (
        <div key={d.d} className="flex-1 flex flex-col items-center gap-1.5">
          <div className="text-[10px] font-mono tabular-nums text-[hsl(var(--muted-foreground))]">{d.avg.toFixed(1)}</div>
          <div className="w-full rounded-t-md transition-all" style={{ height: `${(d.avg / 5) * 100}%`, background: "linear-gradient(180deg, hsl(263 70% 70%), hsl(263 70% 50%))" }} />
          <span className="text-[10.5px] text-[hsl(var(--muted-foreground))] font-medium">{d.d}</span>
        </div>
      ))}
    </div>
  );
}

function EnergyMonthChart() {
  // 4 weeks of energy averages — compact calendar-style heatmap (1–5).
  const dayNames = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
  const weeks = Array.from({ length: 4 }, (_, w) =>
    Array.from({ length: 7 }, (_, d) => ({
      val: 2 + Math.round(Math.abs(Math.sin((w * 7 + d) * 1.1)) * 3),
      label: `S${w + 1} ${dayNames[d]}`,
    }))
  );
  const heat = (v) => `hsl(263 70% 60% / ${0.12 + (v / 5) * 0.7})`;
  const cols = "28px repeat(7, minmax(0, 1fr))";
  return (
    <div>
      <div className="text-[11.5px] text-[hsl(var(--muted-foreground))] mb-3">
        Énergie moyenne par jour · plus la case est vive, plus l'énergie est haute (1–5)
      </div>
      <div className="max-w-[560px]">
        <div className="grid gap-1.5 mb-1.5" style={{ gridTemplateColumns: cols }}>
          <div />
          {dayNames.map(d => (
            <div key={d} className="text-[10px] text-center uppercase tracking-wider font-semibold text-[hsl(var(--muted-foreground))]">{d}</div>
          ))}
        </div>
        {weeks.map((w, wi) => (
          <div key={wi} className="grid gap-1.5 mb-1.5 items-center" style={{ gridTemplateColumns: cols }}>
            <div className="text-[10px] font-semibold text-[hsl(var(--muted-foreground))]">S{wi + 1}</div>
            {w.map((cell, ci) => (
              <div
                key={ci}
                title={`${cell.label} — moyenne ${cell.val}/5`}
                className="h-11 rounded-[6px] flex items-center justify-center text-[12.5px] font-semibold tabular-nums"
                style={{ background: heat(cell.val), color: cell.val >= 4 ? "#fff" : "hsl(263 70% 88%)" }}
              >
                {cell.val}
              </div>
            ))}
          </div>
        ))}
        <div className="flex items-center justify-end gap-1.5 mt-3 text-[10px] text-[hsl(var(--muted-foreground))]">
          <span>Faible</span>
          {[1, 2, 3, 4, 5].map(v => <span key={v} className="w-4 h-4 rounded-[4px]" style={{ background: heat(v) }} />)}
          <span>Élevé</span>
        </div>
      </div>
    </div>
  );
}

function FocusExplorerBody({ period }) {
  if (period === "day") {
    // Today's focus sessions as a horizontal timeline
    return (
      <div>
        <div className="text-[11.5px] text-[hsl(var(--muted-foreground))] mb-3">
          Focus sessions today · 3h05 total
        </div>
        <div className="relative h-20 rounded-[8px] bg-[hsl(var(--muted)/0.3)] overflow-hidden">
          {[
            { start: 0.36, len: 0.10, label: "Deep work" },
            { start: 0.50, len: 0.08, label: "Refactor" },
            { start: 0.66, len: 0.16, label: "Proposition" },
            { start: 0.84, len: 0.08, label: "Review PR" },
          ].map((s, i) => (
            <div key={i}
              className="absolute top-2 bottom-2 rounded-[6px] flex items-center justify-center text-[10.5px] font-medium px-2 truncate"
              style={{
                left: `${s.start * 100}%`,
                width: `${s.len * 100}%`,
                background: "hsl(142 70% 50% / 0.18)",
                borderLeft: "2.5px solid hsl(142 70% 50%)",
                color: "hsl(142 70% 80%)",
              }}>
              {s.label}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between mt-2 text-[10px] font-mono text-[hsl(var(--muted-foreground))]">
          <span>06:00</span><span>10:00</span><span>14:00</span><span>18:00</span><span>22:00</span>
        </div>
      </div>
    );
  }
  if (period === "week") {
    const days = [3.2, 4.5, 2.8, 3.6, 2.2, 1.5, 0.5];
    return (
      <div className="flex items-end gap-3 h-44">
        {["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"].map((d, i) => (
          <div key={d} className="flex-1 flex flex-col items-center gap-1.5">
            <div className="text-[10px] font-mono tabular-nums text-[hsl(var(--muted-foreground))]">{days[i]}h</div>
            <div className="w-full rounded-t-md" style={{ height: `${(days[i] / 6) * 100}%`, background: "linear-gradient(180deg, hsl(142 70% 60%), hsl(142 70% 40%))" }} />
            <span className="text-[10.5px] text-[hsl(var(--muted-foreground))] font-medium">{d}</span>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="text-center py-12 text-[12.5px] text-[hsl(var(--muted-foreground))] rounded-[10px] border border-dashed border-[hsl(var(--border))]">
      Month view — total 56h · best week 16h45
    </div>
  );
}

function LoadExplorerBody({ period }) {
  return (
    <div>
      <div className="text-[11.5px] text-[hsl(var(--muted-foreground))] mb-3">
        Workload {period === "day" ? "today" : period === "week" ? "this week" : "this month"} · breakdown tasks / meetings / focus
      </div>
      <div className="flex h-3 rounded-full overflow-hidden gap-px bg-[hsl(var(--muted)/0.4)] mb-4">
        <div className="bg-[hsl(263_70%_60%)]" style={{ width: "32%" }} title="Tasks" />
        <div className="bg-[hsl(217_91%_60%)]" style={{ width: "26%" }} title="Meetings" />
        <div className="bg-[hsl(142_70%_50%)]" style={{ width: "18%" }} title="Focus" />
      </div>
      <div className="flex items-end gap-2 h-32">
        {["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"].map((d, i) => {
          const total = [6, 7.8, 9.2, 6.5, 4.5, 1.5, 0.8][i];
          const isHeavy = total > 8;
          return (
            <div key={d} className="flex-1 flex flex-col items-center gap-1.5">
              <div className="text-[10px] font-mono tabular-nums text-[hsl(var(--muted-foreground))]">{total}h</div>
              <div className="w-full rounded-t-md" style={{ height: `${(total / 10) * 100}%`, background: isHeavy ? "hsl(20 90% 55%)" : "hsl(217 91% 60%)" }} />
              <span className="text-[10.5px] text-[hsl(var(--muted-foreground))] font-medium">{d}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ============================================================
   CHARGE CAROUSEL — single zone with 3 slides:
   Workload by day / Meeting load / Work load.
============================================================ */
function ChargeCarousel() {
  const slides = [
    { id: "daily",    title: "Workload by day",   badge: { text: "Balanced",      variant: "success", dot: true }, render: () => <WorkloadChart /> },
    { id: "meetings", title: "Meeting load",     badge: { text: "Below threshold",variant: "success" },           render: () => <MeetingsLoadView /> },
    { id: "work",     title: "Work load",          badge: { text: "Sustainable",  variant: "info",    dot: true }, render: () => <WorkHoursLoadView /> },
  ];
  const [idx, setIdx] = useState(0);
  const total = slides.length;
  const goTo = (n) => setIdx(((n % total) + total) % total);
  const next = () => goTo(idx + 1);
  const prev = () => goTo(idx - 1);

  const touchStart = useRef(null);
  const onTouchStart = (e) => { touchStart.current = e.changedTouches[0].clientX; };
  const onTouchEnd = (e) => {
    const start = touchStart.current;
    if (start == null) return;
    const dx = e.changedTouches[0].clientX - start;
    if (Math.abs(dx) > 40) (dx < 0 ? next : prev)();
    touchStart.current = null;
  };
  const onKey = (e) => {
    if (e.key === "ArrowRight") { e.preventDefault(); next(); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); prev(); }
  };

  const current = slides[idx];

  return (
    <Card padding="p-0" className="overflow-hidden">
      <div
        className="p-5 pb-4 flex items-start justify-between gap-3 border-b border-[hsl(var(--border))]"
        onKeyDown={onKey}
        tabIndex={0}
        role="region"
        aria-roledescription="carrousel"
        aria-label="Workload"
      >
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-[15px] font-semibold tracking-tight truncate">{current.title}</h3>
            <Badge variant={current.badge.variant} dot={current.badge.dot}>{current.badge.text}</Badge>
          </div>
          <div className="text-[11.5px] text-[hsl(var(--muted-foreground))]">
            {idx + 1} of {total} · this week
          </div>
        </div>
        {/* Top-right is reserved for the widget close × (rendered by <Widget>).
           Carousel nav lives at the bottom, see below. */}
      </div>

      <div className="relative overflow-hidden" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <div
          className="flex transition-transform duration-[280ms] ease-out"
          style={{ transform: `translateX(-${idx * 100}%)` }}
          aria-live="polite"
        >
          {slides.map((s, i) => (
            <div
              key={s.id}
              className="w-full flex-shrink-0 px-5 py-5"
              aria-hidden={i !== idx}
              role="group"
              aria-roledescription="diapositive"
              aria-label={`${i + 1} of ${total} — ${s.title}`}
            >
              {s.render()}
            </div>
          ))}
        </div>
      </div>

      {/* Carousel navigation — grouped at the BOTTOM and CENTERED, far from
         the widget × (top-right) to avoid mis-taps. Pattern: ‹  • • •  › */}
      <div className="px-5 pb-4 pt-1 flex items-center justify-center gap-2" role="tablist" aria-label="Navigation du carrousel">
        <button
          onClick={prev}
          aria-label="Previous view"
          className={cn(
            "w-11 h-11 rounded-full flex items-center justify-center transition-all",
            "hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--foreground))]",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))]",
            "text-[hsl(var(--muted-foreground))] active:scale-95"
          )}
        >
          <Icons.ChevronLeft size={18} />
        </button>
        <div className="flex items-center justify-center gap-2 px-3" aria-label="Carousel position">
          {slides.map((s, i) => (
            <button
              key={s.id}
              role="tab"
              aria-selected={i === idx}
              aria-label={`Go to: ${s.title}`}
              onClick={() => goTo(i)}
              className={cn(
                "rounded-full transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))]",
                i === idx
                  ? "w-7 h-1.5 bg-[hsl(var(--primary))]"
                  : "w-1.5 h-1.5 bg-[hsl(var(--muted-foreground)/0.35)] hover:bg-[hsl(var(--muted-foreground)/0.65)]"
              )}
            />
          ))}
        </div>
        <button
          onClick={next}
          aria-label="Vue suivante"
          className={cn(
            "w-11 h-11 rounded-full flex items-center justify-center transition-all",
            "hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--foreground))]",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))]",
            "text-[hsl(var(--muted-foreground))] active:scale-95"
          )}
        >
          <Icons.ChevronRight size={18} />
        </button>
      </div>
    </Card>
  );
}

function MeetingsLoadView() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_1.4fr] gap-6 items-center">
      <div>
        <div className="text-[44px] font-bold tabular-nums leading-none">6.2<span className="text-[24px] text-[hsl(var(--muted-foreground))] ml-1">h</span></div>
        <div className="text-[13px] text-[hsl(var(--muted-foreground))] mt-1">this week</div>
        <div className="mt-5 space-y-2">
          <div className="flex justify-between text-[12.5px]">
            <span className="text-[hsl(var(--muted-foreground))]">% temps travail</span>
            <span className="font-semibold tabular-nums">15.5%</span>
          </div>
          <ProgressBar value={15.5} color="info" height="h-2" />
          <div className="text-[11px] text-[hsl(142_70%_60%)] flex items-center gap-1">
            <Icons.Check size={11} stroke={3} /> Recommended threshold: 25%
          </div>
        </div>
      </div>
      <div className="space-y-2 text-[12.5px]">
        {[
          { d: "Lun", v: 1.5 },
          { d: "Mar", v: 0.5 },
          { d: "Mer", v: 2.25 },
          { d: "Jeu", v: 1.0 },
          { d: "Ven", v: 1.0 },
          { d: "Sam", v: 0 },
          { d: "Dim", v: 0 },
        ].map(d => (
          <div key={d.d} className="flex items-center gap-2.5">
            <span className="text-[hsl(var(--muted-foreground))] w-9 font-medium">{d.d}</span>
            <div className="flex-1"><ProgressBar value={d.v} max={3} color="info" height="h-2" /></div>
            <span className="tabular-nums w-12 text-right">{d.v ? `${d.v}h` : "—"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function WorkHoursLoadView() {
  const days = [
    { d: "Lun", v: 4.5, max: 6 },
    { d: "Mar", v: 7.3, max: 6 },
    { d: "Mer", v: 6.9, max: 6 },
    { d: "Jeu", v: 5.5, max: 6 },
    { d: "Ven", v: 3.5, max: 6 },
    { d: "Sam", v: 1.5, max: 6 },
    { d: "Dim", v: 0.8, max: 6 },
  ];
  const total = days.reduce((a, b) => a + b.v, 0);
  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <div className="text-[44px] font-bold tabular-nums leading-none">{total.toFixed(1)}<span className="text-[24px] text-[hsl(var(--muted-foreground))] ml-1">h</span></div>
          <div className="text-[13px] text-[hsl(var(--muted-foreground))] mt-1">actual work this week</div>
        </div>
        <div className="text-right">
          <div className="text-[11px] uppercase tracking-wider text-[hsl(var(--muted-foreground))] font-semibold mb-0.5">Target / day</div>
          <div className="text-[18px] font-semibold tabular-nums">6 h</div>
        </div>
      </div>
      <div className="flex items-end gap-2 h-28">
        {days.map(d => {
          const over = d.v > d.max;
          const fillPct = Math.min(100, (d.v / 8) * 100);
          return (
            <div key={d.d} className="flex-1 flex flex-col items-center gap-1.5">
              <div className="text-[10px] font-mono tabular-nums text-[hsl(var(--muted-foreground))]">{d.v}h</div>
              <div className="w-full rounded-t-md transition-all" style={{
                height: `${fillPct}%`,
                background: over ? "hsl(20 90% 55%)" : d.v >= d.max * 0.8 ? "hsl(263 70% 60%)" : "hsl(142 70% 50%)"
              }} />
              <span className="text-[10px] text-[hsl(var(--muted-foreground))] font-medium">{d.d}</span>
            </div>
          );
        })}
      </div>
      <div className="flex items-center justify-center gap-4 text-[11px] text-[hsl(var(--muted-foreground))]">
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[hsl(142_70%_50%)]"/>Light</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[hsl(263_70%_60%)]"/>Normal</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[hsl(20_90%_55%)]"/>Overload</span>
      </div>
    </div>
  );
}

/* ============================================================
   SLEEP CARD — full-width on the dashboard.
   Reuses energy scale colors. NEVER shows REM/Deep phases (web-first
   product, no sensors). Captures only: bedtime, wake, duration, quality.

   Top row: 3 stat cards (Durée moyenne, Régularité du coucher, Qualité)
   Middle: 7-day mini-bars (duration) with quality dots
   Bottom: chronotype enrichment + correlation insight + AI replan suggestion
============================================================ */
function SleepCard() {
  const [sleep] = (window.useSleepLog ? window.useSleepLog() : [{ entries: [], todayLogged: false }]);
  const ES = window.ENERGY_BY_N || {};
  const entries = sleep.entries || [];
  const enough = entries.length >= 3;
  const enoughForChrono = entries.length >= 7;

  // Compute duration in minutes per night
  const durations = entries.map(e => {
    const [bh, bm] = e.bedtime.split(":").map(Number);
    const [wh, wm] = e.wake.split(":").map(Number);
    let dur = (wh * 60 + wm) - (bh * 60 + bm);
    if (dur <= 0) dur += 24 * 60;
    return dur;
  });
  const avgDur = durations.length ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length) : 0;
  const fmtAvg = `${Math.floor(avgDur / 60)}h${String(avgDur % 60).padStart(2, "0")}`;

  // Regularity: stddev of bedtime, expressed in ± minutes (treating crossing
  // midnight as shift around mean). We normalize to a 24h-circle by shifting
  // bedtimes after midnight (00:00–05:00) by +24h.
  const bedtimes = entries.map(e => {
    const [h, m] = e.bedtime.split(":").map(Number);
    let mins = h * 60 + m;
    if (h < 5) mins += 24 * 60;
    return mins;
  });
  const meanBed = bedtimes.reduce((a, b) => a + b, 0) / (bedtimes.length || 1);
  const variance = bedtimes.reduce((acc, x) => acc + (x - meanBed) ** 2, 0) / (bedtimes.length || 1);
  const stdBedMin = Math.round(Math.sqrt(variance));

  // Avg quality (1-5)
  const avgQ = entries.length
    ? (entries.reduce((a, b) => a + b.qualityLevel, 0) / entries.length)
    : 0;
  const avgQRounded = Math.round(avgQ);

  if (!enough) {
    return (
      <Card>
        <SectionTitle action={
          <span className="text-[11px] text-[hsl(var(--muted-foreground))]">
            {entries.length} night{entries.length > 1 ? "s" : ""} of 7
          </span>
        }>
          <span className="flex items-center gap-2">
            <Icons.Moon size={15} className="text-[hsl(263_70%_75%)]" />
            Sommeil & chronotype
          </span>
        </SectionTitle>
        <div className="py-8 px-4 rounded-[10px] border border-dashed border-[hsl(263_70%_45%/0.3)] bg-[hsl(263_70%_18%/0.25)] flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-[hsl(263_70%_30%/0.4)] flex items-center justify-center mb-3">
            <Icons.Moon size={18} className="text-[hsl(263_70%_80%)]" />
          </div>
          <div className="text-[13.5px] font-semibold mb-1">Your profile sharpens with a few nights</div>
          <p className="text-[12px] text-[hsl(var(--muted-foreground))] max-w-md leading-relaxed">
            Log your sleep a few mornings in a row — DPM will start linking your nights to your energy
            after <span className="text-[hsl(263_70%_80%)] font-medium">3 nights</span>, and refine your chronotype after ~7.
            No invented data while it's insufficient.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <SectionTitle action={
        <span className="text-[11px] text-[hsl(var(--muted-foreground))]">
          Last 7 days · {entries.length} night{entries.length > 1 ? "s" : ""} logged
        </span>
      }>
        <span className="flex items-center gap-2">
          <Icons.Moon size={15} className="text-[hsl(263_70%_75%)]" />
          Sommeil & chronotype
        </span>
      </SectionTitle>

      {/* Top: 3 stat tiles — Régularité mis en avant (centre, accent) */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <SleepStat
          label="Average duration"
          value={fmtAvg}
          sub="recommended: 7–9h"
        />
        <SleepStat
          label="Bedtime regularity"
          value={`± ${stdBedMin} min`}
          sub="the more regular, the better your body recovers"
          highlighted
        />
        <SleepStat
          label="Average quality"
          value={
            <span className="flex items-baseline gap-1.5">
              <span>{avgQ.toFixed(1)}</span>
              <span className="text-[14px] text-[hsl(var(--muted-foreground))]">/5</span>
              <span className="text-[20px] ml-1">{ES[avgQRounded]?.emoji}</span>
            </span>
          }
          sub={`${entries.length} night${entries.length > 1 ? "s" : ""} of 7`}
        />
      </div>

      {/* 7-day mini bars */}
      <div className="mb-5">
        <div className="text-[10.5px] uppercase tracking-wider text-[hsl(var(--muted-foreground))] font-semibold mb-2">
          Recent durations
        </div>
        <div className="grid grid-cols-7 gap-2 items-end">
          {entries.map((e, i) => {
            const dur = durations[i];
            const fillPct = Math.min(100, (dur / (10 * 60)) * 100); // out of 10h max
            const qMeta = ES[e.qualityLevel];
            const isLight = dur < 6 * 60;
            return (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className="text-[9.5px] font-mono tabular-nums text-[hsl(var(--muted-foreground))]">
                  {Math.floor(dur / 60)}h{String(dur % 60).padStart(2, "0")}
                </div>
                <div className="w-full h-16 rounded-t-[4px] relative overflow-hidden bg-[hsl(var(--muted)/0.25)]">
                  <div
                    className="absolute bottom-0 left-0 right-0 rounded-t-[4px] transition-all"
                    style={{
                      height: `${fillPct}%`,
                      background: isLight
                        ? "linear-gradient(180deg, hsl(20 90% 55% / 0.85), hsl(20 90% 45% / 0.85))"
                        : "linear-gradient(180deg, hsl(263 70% 65%), hsl(263 70% 45%))",
                    }}
                  />
                </div>
                <div className="flex items-center gap-1 text-[10px]">
                  <span className="text-[hsl(var(--muted-foreground))] font-semibold uppercase">{e.date}</span>
                  <span title={qMeta?.label}>{qMeta?.emoji}</span>
                  {e.source === "health" && (
                    <span title="Imported from Health">
                      <Icons.Heart size={8} className="text-[hsl(330_80%_70%)]" />
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chronotype enrichment with sparkle insight */}
      <div className="rounded-[12px] border border-[hsl(var(--border))] bg-[hsl(var(--muted)/0.25)] overflow-hidden">
        <div className="px-4 py-3 flex items-center gap-3 border-b border-[hsl(var(--border))]">
          <div className="w-9 h-9 rounded-[10px] bg-[hsl(38_92%_55%/0.15)] text-[hsl(38_92%_60%)] flex items-center justify-center flex-shrink-0 text-[20px]">
            🐦
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-semibold leading-tight">Chronotype — Early bird</div>
            <div className="text-[11px] text-[hsl(var(--muted-foreground))] mt-0.5">
              Energy peak in the morning, dip in early afternoon · profile based on {entries.length} night{entries.length > 1 ? "s" : ""} & {7} days of energy check-ins
            </div>
          </div>
          {!enoughForChrono && (
            <Badge variant="warning" className="text-[10px]">sharpening</Badge>
          )}
        </div>

        {/* Correlation insight */}
        <div className="px-4 py-3 flex items-start gap-3 bg-[hsl(263_70%_45%/0.06)]">
          <Icons.Sparkles size={12} className="text-[hsl(263_70%_75%)] mt-0.5 flex-shrink-0" />
          <div className="flex-1 text-[12.5px] leading-relaxed" style={{ textWrap: "pretty" }}>
            {enoughForChrono ? (
              <>
                <span className="font-semibold text-[hsl(263_70%_85%)]">Insight:</span>{" "}
                On nights under 6h, your energy peak arrives <span className="font-semibold">~90 min later</span> and stays lower all day. Keep the morning for admin on those days.
              </>
            ) : (
              <span className="text-[hsl(var(--muted-foreground))]">
                Your profile sharpens over a few days. While the history is short, DPM offers no insight to avoid telling you nonsense.
              </span>
            )}
          </div>
        </div>

        {/* Linked AI suggestion */}
        {enoughForChrono && (
          <div className="px-4 py-3 flex items-start gap-3 border-t border-[hsl(var(--border))]">
            <div className="w-0.5 self-stretch rounded-full bg-[hsl(263_70%_60%)] flex-shrink-0 min-h-[28px]" />
            <div className="flex-1 min-w-0">
              <div className="text-[12.5px] leading-relaxed" style={{ textWrap: "pretty" }}>
                <span className="font-semibold">Suggestion: </span>
                Wednesday you slept 5h50 — lighten your morning and place the hard task at 2pm, not 9am.
              </div>
              <div className="mt-1.5 inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10.5px] text-[hsl(var(--muted-foreground))] bg-[hsl(var(--muted)/0.5)]">
                <Icons.Book size={9} className="opacity-70" />
                <em className="not-italic font-medium text-[hsl(var(--foreground))]">Why We Sleep</em>
                <span className="opacity-70">·</span>
                <span>Matthew Walker</span>
              </div>
            </div>
            <Button variant="outline" size="sm" icon={Icons.Refresh}>Re-plan</Button>
          </div>
        )}
      </div>
    </Card>
  );
}

function SleepStat({ label, value, sub, highlighted }) {
  return (
    <div className={cn(
      "rounded-[12px] border p-4 flex flex-col gap-1",
      highlighted
        ? "border-[hsl(263_70%_60%/0.4)] bg-gradient-to-br from-[hsl(263_70%_25%/0.35)] to-[hsl(263_70%_15%/0.15)]"
        : "border-[hsl(var(--border))] bg-[hsl(var(--muted)/0.25)]"
    )}>
      <div className="text-[10.5px] uppercase tracking-wider font-semibold flex items-center gap-1.5" style={{ color: highlighted ? "hsl(263 70% 80%)" : "hsl(var(--muted-foreground))" }}>
        {highlighted && <Icons.Star size={9} />}
        {label}
      </div>
      <div className={cn("text-[26px] font-bold tabular-nums leading-none", highlighted && "text-[hsl(263_70%_85%)]")}>
        {value}
      </div>
      <div className="text-[11px] text-[hsl(var(--muted-foreground))] mt-1 leading-snug">{sub}</div>
    </div>
  );
}

function WorkloadChart() {
  const days = [
    { d: "Lun", v: 6.0, max: 8, c: "primary" },
    { d: "Mar", v: 7.8, max: 8, c: "primary" },
    { d: "Mer", v: 9.2, max: 8, c: "danger" },
    { d: "Jeu", v: 6.5, max: 8, c: "primary" },
    { d: "Ven", v: 4.5, max: 8, c: "success" },
    { d: "Sam", v: 1.5, max: 8, c: "muted" },
    { d: "Dim", v: 0.8, max: 8, c: "muted" },
  ];
  const colors = {
    primary: "hsl(263 70% 60%)",
    danger:  "hsl(0 84% 60%)",
    success: "hsl(142 70% 50%)",
    muted:   "hsl(var(--muted-foreground) / 0.5)",
  };
  return (
    <>
      <div className="flex items-end gap-2 h-32">
        {days.map(d => (
          <div key={d.d} className="flex-1 flex flex-col items-center gap-1.5">
            <div className="text-[10px] font-mono tabular-nums text-[hsl(var(--muted-foreground))]">{d.v}h</div>
            <div className="w-full rounded-t-md transition-all" style={{ height: `${(d.v / 10) * 100}%`, background: colors[d.c] }} />
            <span className="text-[10px] text-[hsl(var(--muted-foreground))] font-medium">{d.d}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center gap-4 mt-4 text-[11px] text-[hsl(var(--muted-foreground))]">
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[hsl(263_70%_60%)]"/>Normal</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[hsl(0_84%_60%)]"/>Overload</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[hsl(142_70%_50%)]"/>Light</span>
      </div>
    </>
  );
}

/* Global accent / selection color picker. Recolors the app's --primary family
   (active nav, filled buttons, rings, focus, space accent) live. */
function AppearanceCard() {
  const [accent, setAccent, customApi] = (window.useAccent ? window.useAccent() : ["violet", () => {}, { custom: "#8b5cf6", setCustom: () => {} }]);
  const presets = window.ACCENT_PRESETS || [];
  const space = window.useCurrentSpace ? window.useCurrentSpace() : null;
  const spaceColor = (space && space.color) || "263 70% 60%";
  const spaceName = (space && space.name) || "Space";
  const customHex = customApi.custom || "#8b5cf6";
  const swBase = "w-9 h-9 rounded-full flex items-center justify-center transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))]";
  const ringOn = "ring-2 ring-offset-2 ring-offset-[hsl(var(--card))]";
  return (
    <Card>
      <SectionTitle>Accent color</SectionTitle>
      <p className="text-[12.5px] text-[hsl(var(--muted-foreground))] -mt-1 mb-3 leading-relaxed" style={{ textWrap: "pretty" }}>
        Sets the selection color across the whole app — active menu items, the New task button, highlights and focus rings. A custom color overrides each Space's tint; keep Violet to let Spaces own their own accent, or pick “Same as space” to follow the current one.
      </p>
      <div className="flex flex-wrap items-center gap-2.5">
        {presets.map(p => {
          const on = accent === p.id;
          return (
            <button key={p.id} type="button" onClick={() => setAccent(p.id)} title={p.name} aria-label={p.name} aria-pressed={on}
              className={cn(swBase, on && ringOn)}
              style={{ background: `hsl(${p.swatch})`, boxShadow: on ? `0 0 0 2px hsl(${p.swatch})` : undefined }}>
              {on && <Icons.Check size={15} stroke={3} className="text-white" />}
            </button>
          );
        })}

        {/* Divider */}
        <span className="w-px h-7 bg-[hsl(var(--border))] mx-0.5" />

        {/* Same as current space */}
        <button type="button" onClick={() => setAccent("space")} title={`Same as space — ${spaceName}`} aria-label="Same as selected space" aria-pressed={accent === "space"}
          className={cn(swBase, "relative", accent === "space" && ringOn)}
          style={{ background: `hsl(${spaceColor})`, boxShadow: accent === "space" ? `0 0 0 2px hsl(${spaceColor})` : undefined }}>
          {accent === "space" ? <Icons.Check size={14} stroke={3} className="text-white" /> : <Icons.Layers size={13} className="text-white/90" />}
        </button>

        {/* Custom color — native picker behind a round swatch */}
        <label title="Custom color" aria-label="Custom color"
          className={cn(swBase, "relative cursor-pointer overflow-hidden", accent === "custom" && ringOn)}
          style={{
            background: accent === "custom" ? customHex : undefined,
            backgroundImage: accent === "custom" ? undefined : "conic-gradient(from 0deg, #ef4444, #f59e0b, #22c55e, #06b6d4, #6366f1, #d946ef, #ef4444)",
            boxShadow: accent === "custom" ? `0 0 0 2px ${customHex}` : undefined,
          }}>
          <input type="color" value={customHex} onChange={(e) => customApi.setCustom(e.target.value)}
            className="absolute inset-0 opacity-0 cursor-pointer" />
          {accent === "custom" ? <Icons.Check size={15} stroke={3} className="text-white" /> : <Icons.Plus size={14} className="text-white drop-shadow" />}
        </label>

        <span className="ml-1 text-[12px] text-[hsl(var(--muted-foreground))]">
          {accent === "custom" ? "Custom"
            : accent === "space" ? `Same as space · ${spaceName}`
            : (presets.find(p => p.id === accent) || {}).name}
        </span>
      </div>
    </Card>
  );
}

/* ============================================================
   PAGE 13 — SETTINGS (/settings)
============================================================ */
function SettingsPage() {
  const [aiEnabled, setAIEnabled] = (window.useAIEnabled ? window.useAIEnabled() : [true, () => {}]);
  return (
    <div className="max-w-3xl mx-auto space-y-7">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-[24px] font-bold tracking-tight">Settings</h1>
          <p className="text-[13px] text-[hsl(var(--muted-foreground))] mt-1">Configure your experience</p>
        </div>
        <ModuleTutorialButton module="settings" />
      </div>

      {/* Profile */}
      <Card>
        <SectionTitle>Profile</SectionTitle>
        <div className="flex items-center gap-4">
          <Avatar name="RG" size={56} />
          <div className="flex-1">
            <div className="text-[15px] font-semibold">Ralph Gabriel</div>
            <div className="text-[12.5px] text-[hsl(var(--muted-foreground))]">ralph@example.com · Plan Pro · FR</div>
          </div>
          <Button variant="outline" size="sm" icon={Icons.Edit}>Edit</Button>
        </div>
      </Card>

      {/* Appearance — global accent / selection color */}
      <AppearanceCard />

      {/* Connexions */}
      <Card data-tour="feat-settings-integrations">
        <SectionTitle action={<Button variant="ghost" size="sm" icon={Icons.ArrowRight} onClick={() => window.__dpmNavigate?.("sync")}>Sync Center</Button>}>
          Connexions calendrier
        </SectionTitle>
        <div className="space-y-2">
          {[
            { icon: <Icons.Google size={20} />, n: "Google Calendar", e: "ralph@gmail.com", status: "connected", lastSync: "il y a 4 min", conflicts: 2 },
            { icon: <Icons.Microsoft size={20} />, n: "Microsoft Outlook", e: "—", status: "disconnected" },
            { icon: <Icons.Apple size={20} />, n: "Apple Calendar", e: "—", status: "disconnected" },
          ].map((p, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-[10px] border border-[hsl(var(--border))]">
              <div className="w-10 h-10 rounded-[8px] bg-[hsl(var(--muted)/0.4)] flex items-center justify-center">{p.icon}</div>
              <div className="flex-1">
                <div className="text-[13.5px] font-semibold flex items-center gap-2">
                  {p.n}
                  {p.status === "connected" && <Badge variant="success" dot>Connected</Badge>}
                </div>
                <div className="text-[11.5px] text-[hsl(var(--muted-foreground))]">
                  {p.status === "connected" ? <>{p.e} · sync {p.lastSync}</> : "Not connected"}
                  {p.conflicts > 0 && <span className="text-[hsl(38_92%_60%)] ml-1.5">· {p.conflicts} conflits</span>}
                </div>
              </div>
              {p.status === "connected"
                ? <Button variant="outline" size="sm">Disconnect</Button>
                : <Button size="sm">Connect</Button>}
            </div>
          ))}
        </div>
      </Card>

      {/* Working-hour ranges — multi-plages personnalisables */}
      <div data-tour="feat-settings-hours"><WorkHoursCard /></div>

      {/* Music integration (P23) */}
      <MusicSettingsCard />

      {/* Accessibility (P25) */}
      <AccessibilityCard />

      {/* Santé & appareils (P27) */}
      <DevicesSettingsCard />

      {/* Preferences */}
      <Card>
        <SectionTitle>Preferences</SectionTitle>
        <div className="space-y-4 divide-y divide-[hsl(var(--border))]">
          <SettingsRow l="Urgent task cap" d="Max URGENT tasks/day">
            <select className="h-9 px-3 rounded-[8px] border border-[hsl(var(--input))] bg-[hsl(var(--background))] text-[13px]">
              <option>3</option><option selected>5</option><option>10</option>
            </select>
          </SettingsRow>
          <SettingsRow l="Time format" d="How hours display in the calendar and blocks" pt>
            <select className="h-9 px-3 rounded-[8px] border border-[hsl(var(--input))] bg-[hsl(var(--background))] text-[13px]">
              <option selected>24h (14:30)</option><option>12h (2:30 PM)</option>
            </select>
          </SettingsRow>
          <SettingsRow l="Date format" d="How dates display in lists" pt>
            <select className="h-9 px-3 rounded-[8px] border border-[hsl(var(--input))] bg-[hsl(var(--background))] text-[13px]">
              <option selected>jj/mm/aaaa (26/05/2026)</option>
              <option>aaaa-mm-jj (2026-05-26)</option>
              <option>day month year (May 26 2026)</option>
            </select>
          </SettingsRow>
          <CalendarComfortRow />
          <SettingsRow l="AI assistant" d="Contextual advice and suggestions on the home page — sourced citations (Eat That Frog, Atomic Habits…)" pt>
            <Switch checked={aiEnabled} onChange={setAIEnabled} />
          </SettingsRow>
          <SettingsRow l="Automatic breaks" d="Block 15 min between meetings" pt>
            <Switch checked={false} onChange={() => {}} />
          </SettingsRow>
          <SettingsRow l="Reset tutorials" d="Resets the guided tour — the home page can relaunch it" pt>
            <Button variant="outline" size="sm" icon={Icons.Refresh}
              onClick={() => { window.tourResetCompleted?.(); window.alert("Tutorials reset. The welcome tour can relaunch."); }}
            >Reset</Button>
          </SettingsRow>
        </div>
      </Card>

      {/* Notifications — gestion granulaire */}
      <NotificationsCard />

      {/* Conflits */}
      <Card>
        <SectionTitle action={<Button variant="ghost" size="sm" icon={Icons.ArrowRight} onClick={() => { window.__dpmSyncIntent = "conflicts"; window.__dpmNavigate?.("sync"); }}>Open Conflict Center</Button>}>
          Conflits de synchronisation · 2
        </SectionTitle>
        <div className="space-y-2">
          {[
            { t: "1:1 with Sarah", local: "10:00 → 10:30", remote: "10:15 → 10:45", src: "Google" },
            { t: "Arch workshop", local: "14:00 → 16:00", remote: "Deleted", src: "Google" },
          ].map((c, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-[10px] border border-[hsl(38_92%_55%/0.3)] bg-[hsl(38_92%_55%/0.04)]">
              <Icons.AlertTriangle size={18} className="text-[hsl(38_92%_60%)] flex-shrink-0" />
              <div className="flex-1">
                <div className="text-[13.5px] font-semibold">{c.t}</div>
                <div className="text-[11.5px] text-[hsl(var(--muted-foreground))] mt-0.5">
                  Local : <span className="font-mono">{c.local}</span> · {c.src} : <span className="font-mono">{c.remote}</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <Button variant="outline" size="sm">Keep local</Button>
                <Button size="sm">Accept {c.src}</Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Danger zone */}
      <Card className="border-[hsl(0_84%_60%/0.3)]" data-tour="feat-settings-danger">
        <div className="flex items-center gap-2 mb-3">
          <Icons.AlertTriangle size={16} className="text-[hsl(0_84%_70%)]" />
          <h3 className="text-[14px] font-semibold text-[hsl(0_84%_75%)]">Danger zone</h3>
        </div>
        <div className="space-y-3">
          <AccountPauseRow />
          <SettingsRow l="Export my data" d="JSON + ICS + CSV · GDPR-compliant" pt>
            <Button variant="outline" size="sm" icon={Icons.Download}>Export</Button>
          </SettingsRow>
          <SettingsRow l="Delete my account" d="Permanent erasure within 24h · double confirmation required" pt>
            <Button variant="destructive" size="sm" icon={Icons.Trash}>Delete</Button>
          </SettingsRow>
        </div>
      </Card>
    </div>
  );
}

/* P21 — Calendar visual comfort, relocated from the calendar toolbar into
   Settings. Self-contained: shares the SAME localStorage key + event as the
   calendar's useCalZoom() hook (in pages-cal-tasks.jsx), so changing it here
   live-updates the calendar's row height & event text size. */
const CAL_COMFORT_KEY = "dpm-cal-zoom";
const CAL_COMFORT_EVT = "dpm-cal-zoom-change";
const CAL_COMFORT_OPTIONS = [
  { label: "Compact", px: 44, hint: "More days on screen" },
  { label: "Normal",  px: 56, hint: "Balanced (default)" },
  { label: "Comfort", px: 80, hint: "Roomier rows & text" },
  { label: "Large",   px: 104, hint: "Maximum readability" },
];
function readCalComfort() {
  try { const v = parseInt(localStorage.getItem(CAL_COMFORT_KEY), 10); return Number.isFinite(v) ? v : 56; }
  catch { return 56; }
}
// Snap an arbitrary px to the nearest named option.
function nearestComfort(px) {
  let best = CAL_COMFORT_OPTIONS[0];
  for (const o of CAL_COMFORT_OPTIONS) if (Math.abs(o.px - px) < Math.abs(best.px - px)) best = o;
  return best;
}

function CalendarComfortRow() {
  const [px, setPx] = useState(readCalComfort);
  useEffect(() => {
    const h = (e) => setPx(e.detail);
    window.addEventListener(CAL_COMFORT_EVT, h);
    return () => window.removeEventListener(CAL_COMFORT_EVT, h);
  }, []);
  const choose = (val) => {
    try { localStorage.setItem(CAL_COMFORT_KEY, String(val)); } catch {}
    window.dispatchEvent(new CustomEvent(CAL_COMFORT_EVT, { detail: val }));
    setPx(val);
  };
  const active = nearestComfort(px);
  return (
    <SettingsRow
      l="Calendar comfort"
      d="Row height & event text size in the Day / Week calendar. Applies instantly."
      pt
    >
      <div className="flex items-center gap-1 rounded-[9px] border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-1" role="group" aria-label="Calendar comfort">
        {CAL_COMFORT_OPTIONS.map((o) => {
          const on = o.label === active.label;
          return (
            <button
              key={o.label}
              onClick={() => choose(o.px)}
              title={o.hint}
              aria-pressed={on}
              className={cn(
                "h-8 px-3 rounded-[6px] text-[12.5px] font-medium transition-colors whitespace-nowrap",
                on
                  ? "bg-[hsl(var(--primary-solid))] text-white"
                  : "text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--foreground))]"
              )}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </SettingsRow>
  );
}

function SettingsRow({ l, d, children, pt }) {
  return (
    <div className={cn("flex items-center gap-4 justify-between", pt && "pt-4")}>
      <div className="flex-1 min-w-0">
        <div className="text-[13.5px] font-medium">{l}</div>
        <div className="text-[11.5px] text-[hsl(var(--muted-foreground))] mt-0.5">{d}</div>
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  );
}

/* ============================================================
   P25 — ACCESSIBILITY card. Houses the "Affichage vif" emphasis
   mode. Reads/writes the shared vif store (accessibility.jsx), so it
   stays in sync with the Tweaks panel and the OS prefers-contrast.
============================================================ */
function AccessibilityCard() {
  const [vif, setVif] = useVif();
  return (
    <Card>
      <SectionTitle>Accessibilité</SectionTitle>
      <div className="space-y-4 divide-y divide-[hsl(var(--border))]">
        <SettingsRow
          l="Affichage vif"
          d="Couleurs plus vives, urgent et important mis en avant, secondaire estompé — pour un repérage rapide. Complète le contraste AA, sans le remplacer."
        >
          <Switch checked={vif} onChange={setVif} />
        </SettingsRow>
        <SettingsRow
          l="Suivre le contraste du système"
          d="Quand aucun choix manuel n'est fait, l'affichage vif s'active si le système signale un besoin de contraste élevé (prefers-contrast)."
          pt
        >
          <span className="inline-flex items-center gap-1.5 text-[11.5px] text-[hsl(var(--muted-foreground))]">
            <Icons.Check size={13} className="text-[hsl(142_70%_55%)]" /> Automatique
          </span>
        </SettingsRow>
      </div>
    </Card>
  );
}


/* ============================================================
   WORK HOURS — multi-schedule support.
   Some users have several work shifts (day/evening, weekdays/weekend,
   freelance multi-client). Lets them define multiple named ranges
   with day picks. Default is "Bureau · Lun–Ven 09:00–18:00".
   The list is exposed on window so the calendar header can read it
   for the "Bureau" eye-icon switcher.
============================================================ */
const DEFAULT_SCHEDULES = [
  { id: "s1", name: "Bureau",      start: "09:00", end: "18:00", days: ["L","M","Me","J","V"], color: "263 70% 60%", enabled: true },
  { id: "s2", name: "Personal evening",start: "20:00", end: "22:30", days: ["M","T","W","T"],     color: "217 91% 60%", enabled: true },
  { id: "s3", name: "Week-end",    start: "10:00", end: "13:00", days: ["S","D"],               color: "142 70% 50%", enabled: false },
];
const SCHEDULES_EVT = "dpm-work-schedules-change";
if (typeof window !== "undefined" && !window.__dpmSchedules) {
  window.__dpmSchedules = DEFAULT_SCHEDULES;
}
function useWorkSchedules() {
  const [list, setList] = useState(() => window.__dpmSchedules || DEFAULT_SCHEDULES);
  useEffect(() => {
    const h = (e) => setList([...e.detail]);
    window.addEventListener(SCHEDULES_EVT, h);
    return () => window.removeEventListener(SCHEDULES_EVT, h);
  }, []);
  const update = (next) => {
    window.__dpmSchedules = next;
    window.dispatchEvent(new CustomEvent(SCHEDULES_EVT, { detail: next }));
  };
  return [list, update];
}
if (typeof window !== "undefined") window.useWorkSchedules = useWorkSchedules;
const ALL_DAYS = [
  { id: "L",  full: "Lundi" }, { id: "M",  full: "Mardi" }, { id: "Me", full: "Mercredi" },
  { id: "J",  full: "Jeudi" }, { id: "V",  full: "Vendredi" }, { id: "S",  full: "Samedi" }, { id: "D",  full: "Dimanche" },
];

function WorkHoursCard() {
  const [schedules, setSchedules] = useWorkSchedules();
  const update = (id, patch) => setSchedules(schedules.map(s => s.id === id ? { ...s, ...patch } : s));
  const remove = (id) => setSchedules(schedules.filter(s => s.id !== id));
  const add = () => {
    const id = "s" + Date.now();
    const colors = ["263 70% 60%", "217 91% 60%", "142 70% 50%", "38 92% 55%", "330 80% 60%"];
    setSchedules([...schedules, {
      id, name: "New range", start: "09:00", end: "12:00",
      days: ["L","M","Me","J","V"], color: colors[schedules.length % colors.length], enabled: true,
    }]);
  };
  const toggleDay = (id, day) => setSchedules(schedules.map(s => s.id === id
    ? { ...s, days: s.days.includes(day) ? s.days.filter(d => d !== day) : [...s.days, day] }
    : s));

  return (
    <Card>
      <SectionTitle action={
        <Button variant="outline" size="sm" icon={Icons.Plus} onClick={add}>Add a range</Button>
      }>
        Working-hour ranges
      </SectionTitle>
      <p className="text-[12px] text-[hsl(var(--muted-foreground))] mb-4 leading-relaxed">
        Define several ranges if your week mixes office, personal projects or weekends. DPM uses them for planning, reminders, workload analysis and calendar framing.
      </p>
      <div className="space-y-3">
        {schedules.map(s => (
          <div key={s.id} className={cn(
            "rounded-[12px] border p-4 transition-all",
            s.enabled
              ? "border-[hsl(var(--border))] bg-[hsl(var(--card))]"
              : "border-[hsl(var(--border))] bg-[hsl(var(--muted)/0.2)] opacity-65"
          )}>
            {/* Row 1 : color + name + switch + delete */}
            <div className="flex items-center gap-3 mb-3">
              <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: `hsl(${s.color})` }} />
              <input
                type="text" value={s.name}
                onChange={(e) => update(s.id, { name: e.target.value })}
                className="flex-1 bg-transparent text-[14px] font-semibold focus:outline-none border-b border-transparent focus:border-[hsl(var(--primary))] py-0.5"
              />
              <Switch checked={s.enabled} onChange={(v) => update(s.id, { enabled: v })} />
              <button
                onClick={() => remove(s.id)}
                aria-label="Delete this range"
                title="Delete"
                className="w-8 h-8 rounded-md hover:bg-[hsl(0_84%_60%/0.15)] text-[hsl(var(--muted-foreground))] hover:text-[hsl(0_84%_70%)] flex items-center justify-center"
              >
                <Icons.Trash size={13} />
              </button>
            </div>

            {/* Row 2 : time range, full breathing room */}
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <div className="text-[10.5px] uppercase tracking-wider font-semibold text-[hsl(var(--muted-foreground))] w-12">From</div>
              <TimeField
                value={s.start}
                onChange={(v) => update(s.id, { start: v })}
                accent={s.color}
              />
              <span className="text-[hsl(var(--muted-foreground))] text-[14px] mx-1">→</span>
              <div className="text-[10.5px] uppercase tracking-wider font-semibold text-[hsl(var(--muted-foreground))]">À</div>
              <TimeField
                value={s.end}
                onChange={(v) => update(s.id, { end: v })}
                accent={s.color}
              />
              <div className="text-[11px] font-mono tabular-nums text-[hsl(var(--muted-foreground))] ml-2">
                {durationLabel(s.start, s.end)}
              </div>
            </div>

            {/* Row 3 : day chips */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="text-[10.5px] uppercase tracking-wider font-semibold text-[hsl(var(--muted-foreground))] w-12">Days</div>
              <div className="flex items-center gap-1.5 flex-wrap">
                {ALL_DAYS.map(d => (
                  <button
                    key={d.id}
                    onClick={() => toggleDay(s.id, d.id)}
                    title={d.full}
                    className={cn(
                      "h-9 min-w-[44px] px-2 rounded-[8px] text-[12px] font-semibold transition-all",
                      s.days.includes(d.id)
                        ? "text-white shadow-sm"
                        : "bg-[hsl(var(--muted)/0.4)] text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))]"
                    )}
                    style={s.days.includes(d.id) ? { background: `hsl(${s.color})` } : {}}
                  >
                    {d.id}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 text-[11px] text-[hsl(var(--muted-foreground))] flex items-center gap-1.5">
        <Icons.Sparkles size={11} className="text-[hsl(var(--primary))]" />
        Tip: disable “Personal evening” during holidays so you're not pinged outside work.
      </div>
    </Card>
  );
}

/* Wider time field — hides the native clock icon (which crops the digits)
   and centers the value with a monospace font. */
function TimeField({ value, onChange, accent }) {
  return (
    <div className="relative" style={{ width: 112 }}>
      <input
        type="time"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-10 px-3 rounded-[8px] border border-[hsl(var(--input))] bg-[hsl(var(--background))] text-[16px] font-mono tabular-nums text-center focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
        style={{ borderColor: accent ? `hsl(${accent} / 0.3)` : undefined }}
      />
    </div>
  );
}

/* Returns "X h Y min" between two HH:MM strings (wraps midnight if needed). */
function durationLabel(start, end) {
  if (!start || !end) return "";
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  let mins = (eh * 60 + em) - (sh * 60 + sm);
  if (mins <= 0) mins += 24 * 60;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m ? `${h}h${String(m).padStart(2,"0")}` : `${h}h`;
}

/* ============================================================
   NOTIFICATIONS — granular control.
   Lists everything the app COULD notify about, grouped by area,
   each with a channel selector (push / email / silencieux).
   Plus a Quiet Hours block.
============================================================ */
const NOTIF_CATEGORIES = [
  { group: "Calendrier", items: [
    { id: "event.reminder",  l: "Reminder before an event",          d: "10 min before by default" },
    { id: "event.starting",  l: "Event starting now",                d: "Notification at start" },
    { id: "event.changed",   l: "Event changed or canceled",         d: "Conflict, move, cancellation" },
  ]},
  { group: "Tasks & focus", items: [
    { id: "task.due",        l: "Task due date",                     d: "When a task reaches its due date" },
    { id: "task.overdue",    l: "Overdue task",                      d: "Morning summary of overdue tasks" },
    { id: "focus.end",       l: "End of a focus session",            d: "When the timer ends" },
    { id: "focus.break",     l: "Start of a break",                  d: "Disabled in hyperfocus mode" },
  ]},
  { group: "Habitudes & rituels", items: [
    { id: "habit.reminder",  l: "Habit reminder",                    d: "At the scheduled time" },
    { id: "habit.streak",    l: "Streak at risk",                    d: "If a key habit hasn't been checked" },
    { id: "daily.ritual",    l: "Rituel quotidien (matin / soir)",   d: "Planification du matin, revue du soir" },
  ]},
  { group: "Wellness", items: [
    { id: "energy.checkin",  l: "Suggested energy check-in",         d: "When the AI thinks it's relevant" },
    { id: "sleep.morning",   l: "Morning sleep check-in",            d: "Once per day only" },
  ]},
  { group: "Assistant IA", items: [
    { id: "ai.tip",          l: "New contextual advice",             d: "When the AI spots an opportunity (max 2/day)" },
    { id: "ai.weekly",       l: "Weekly AI review",                  d: "Sunday evening summary" },
  ]},
];
const NOTIF_CHANNELS = [
  { id: "push",  l: "Push",       icon: Icons.Bell },
  { id: "email", l: "Email",      icon: Icons.Pen },
  { id: "off",   l: "Silencieux", icon: Icons.X },
];

function NotificationsCard() {
  const [masterOn, setMasterOn] = useState(true);
  const [prefs, setPrefs] = useState(() => {
    const seed = {};
    for (const g of NOTIF_CATEGORIES) for (const it of g.items) {
      seed[it.id] = ["energy.checkin", "ai.tip", "focus.break"].includes(it.id) ? "off"
        : ["task.overdue", "ai.weekly"].includes(it.id) ? "email"
        : "push";
    }
    return seed;
  });
  const [quietOn, setQuietOn] = useState(true);
  const [quietFrom, setQuietFrom] = useState("22:00");
  const [quietTo, setQuietTo] = useState("07:00");

  const setChannel = (id, channel) => setPrefs(p => ({ ...p, [id]: channel }));
  const enabledCount = Object.values(prefs).filter(v => v !== "off").length;
  const totalCount = Object.keys(prefs).length;

  return (
    <Card>
      <SectionTitle action={
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-[hsl(var(--muted-foreground))] tabular-nums">
            <span className="text-[hsl(var(--foreground))] font-semibold">{masterOn ? enabledCount : 0}</span> / {totalCount} actives
          </span>
          <Switch checked={masterOn} onChange={setMasterOn} />
        </div>
      }>
        Notifications
      </SectionTitle>

      <p className="text-[12px] text-[hsl(var(--muted-foreground))] mb-4 leading-relaxed">
        Choose what deserves your attention. Disable the master toggle to mute everything temporarily (extended focus).
      </p>

      <div className={cn("space-y-5 transition-opacity", !masterOn && "opacity-40 pointer-events-none")}>
        {NOTIF_CATEGORIES.map(g => (
          <div key={g.group}>
            <h4 className="text-[10.5px] uppercase tracking-[0.12em] font-semibold text-[hsl(var(--muted-foreground))] mb-2">{g.group}</h4>
            <div className="space-y-1">
              {g.items.map(it => (
                <div key={it.id} className="flex items-center gap-3 py-1.5">
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-medium leading-tight">{it.l}</div>
                    <div className="text-[11px] text-[hsl(var(--muted-foreground))] mt-0.5">{it.d}</div>
                  </div>
                  <div className="flex items-center p-0.5 bg-[hsl(var(--muted)/0.4)] rounded-[8px] flex-shrink-0">
                    {NOTIF_CHANNELS.map(c => (
                      <button key={c.id} onClick={() => setChannel(it.id, c.id)} title={c.l}
                        className={cn(
                          "h-7 px-2 rounded-[6px] flex items-center gap-1 text-[11px] font-medium transition-all",
                          prefs[it.id] === c.id
                            ? "bg-[hsl(var(--card))] shadow-sm " + (c.id === "off" ? "text-[hsl(var(--muted-foreground))]" : "text-[hsl(var(--foreground))]")
                            : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
                        )}>
                        <c.icon size={10} />
                        <span className="hidden md:inline">{c.l}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 pt-5 border-t border-[hsl(var(--border))]">
        <div className="flex items-start justify-between gap-4 mb-2">
          <div>
            <div className="text-[13px] font-semibold">Quiet hours</div>
            <div className="text-[11.5px] text-[hsl(var(--muted-foreground))] mt-0.5">No notifications between these hours (emergencies excepted).</div>
          </div>
          <Switch checked={quietOn} onChange={setQuietOn} />
        </div>
        <div className={cn("flex items-center gap-2 mt-3 flex-wrap", !quietOn && "opacity-40 pointer-events-none")}>
          <input
            type="time"
            value={quietFrom}
            onChange={(e) => setQuietFrom(e.target.value)}
            className="h-10 w-32 px-3 rounded-[8px] border border-[hsl(var(--input))] bg-[hsl(var(--background))] text-[14px] font-mono tabular-nums text-center focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
          />
          <span className="text-[hsl(var(--muted-foreground))]">→</span>
          <input
            type="time"
            value={quietTo}
            onChange={(e) => setQuietTo(e.target.value)}
            className="h-10 w-32 px-3 rounded-[8px] border border-[hsl(var(--input))] bg-[hsl(var(--background))] text-[14px] font-mono tabular-nums text-center focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
          />
          <span className="text-[11.5px] text-[hsl(var(--muted-foreground))] ml-2">next day if it crosses midnight</span>
        </div>
      </div>
    </Card>
  );
}

/* ============================================================
   ACCOUNT PAUSE — non-destructive break. Reversible (vs. delete).
============================================================ */
function AccountPauseRow() {
  const [paused, setPaused] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [duration, setDuration] = useState("7d");
  const labels = { "1d": "1 day", "7d": "1 week", "30d": "1 month", "open": "Indefinite" };

  if (paused) {
    return (
      <div className="rounded-[10px] border border-[hsl(38_92%_55%/0.35)] bg-[hsl(38_92%_55%/0.06)] p-3 flex items-center gap-3">
        <div className="w-9 h-9 rounded-[10px] bg-[hsl(38_92%_55%/0.15)] text-[hsl(38_92%_60%)] flex items-center justify-center flex-shrink-0">
          <Icons.Pause size={15} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[13.5px] font-semibold leading-tight">Account paused · {labels[duration]}</div>
          <div className="text-[11.5px] text-[hsl(var(--muted-foreground))] mt-0.5 leading-snug">
            No notifications, no prompts. Your data is kept intact. Resume whenever you like.
          </div>
        </div>
        <Button size="sm" icon={Icons.Play} onClick={() => setPaused(false)}>Resume</Button>
      </div>
    );
  }

  if (confirming) {
    return (
      <div className="rounded-[10px] border border-[hsl(38_92%_55%/0.4)] bg-[hsl(38_92%_55%/0.06)] p-4">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-9 h-9 rounded-[10px] bg-[hsl(38_92%_55%/0.15)] text-[hsl(38_92%_60%)] flex items-center justify-center flex-shrink-0">
            <Icons.Pause size={15} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[13.5px] font-semibold">Pause the account</div>
            <div className="text-[11.5px] text-[hsl(var(--muted-foreground))] mt-0.5 leading-relaxed">
              Temporarily freeze the app — useful during holidays, an intense sprint, or a break. Your data stays intact; reversible anytime.
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
          {Object.entries(labels).map(([id, l]) => (
            <button key={id} onClick={() => setDuration(id)}
              className={cn(
                "h-9 px-2.5 rounded-[8px] border text-[12px] font-medium transition-all",
                duration === id
                  ? "border-[hsl(38_92%_55%/0.6)] bg-[hsl(38_92%_55%/0.12)] text-[hsl(38_92%_70%)]"
                  : "border-[hsl(var(--border))] hover:border-[hsl(var(--primary)/0.4)] text-[hsl(var(--muted-foreground))]"
              )}>{l}</button>
          ))}
        </div>
        <div className="flex items-center justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => setConfirming(false)}>Cancel</Button>
          <Button size="sm" icon={Icons.Pause} onClick={() => { setPaused(true); setConfirming(false); }}>Pause</Button>
        </div>
      </div>
    );
  }

  return (
    <SettingsRow l="Pause the account" d="Temporarily freeze the app — reversible, your data stays intact (ideal for holidays or a break)">
      <Button variant="outline" size="sm" icon={Icons.Pause} onClick={() => setConfirming(true)}>Pause</Button>
    </SettingsRow>
  );
}

/* ============================================================
   RULES (placeholder — sidebar links here)
============================================================ */
function RulesPage() {
  const t = useT();
  const [rules, ops] = useRules();
  const [showInactive, setShowInactive] = useState(true);
  const [search, setSearch] = useState("");
  const [editTarget, setEditTarget] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rules.filter(r => {
      if (!showInactive && !r.active) return false;
      if (q && !r.name.toLowerCase().includes(q) && !(r.desc || "").toLowerCase().includes(q)) return false;
      return true;
    });
  }, [rules, showInactive, search]);
  const openCreate = () => { setEditTarget(null); setModalOpen(true); };
  const openEdit = (r) => { setEditTarget(r); setModalOpen(true); };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-[24px] font-bold tracking-tight">{t("rules.title")}</h1>
          <p className="text-[13px] text-[hsl(var(--muted-foreground))] mt-1">{t("rules.subtitle")}</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Icons.Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder={t("rules.searchPlaceholder")}
              className="h-9 pl-8 pr-3 rounded-[8px] border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-[12.5px] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] w-56" />
          </div>
          <TemplatesDropdown onPick={(tpl) => ops.add(tpl)} />
          <ModuleTutorialButton module="rules" />
          <Button size="sm" icon={Icons.Plus} onClick={openCreate}>{t("rules.new")}</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {[
          { l: t("rules.created"),  v: rules.length,                        icon: Icons.Shield,   c: "primary" },
          { l: t("rules.active"),   v: rules.filter(r => r.active).length,  icon: Icons.Zap,      c: "success" },
          { l: t("rules.runs"),     v: rules.reduce((s,r)=>s+r.runs, 0),    icon: Icons.Activity, c: "info" },
        ].map(s => (
          <Card key={s.l} padding="p-4" className="flex items-center gap-3.5">
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
              s.c === "primary" && "bg-[hsl(var(--primary)/0.12)] text-[hsl(var(--primary))]",
              s.c === "success" && "bg-[hsl(142_70%_45%/0.12)] text-[hsl(142_70%_60%)]",
              s.c === "info" && "bg-[hsl(217_91%_60%/0.12)] text-[hsl(217_91%_70%)]"
            )}>
              <s.icon size={16} />
            </div>
            <div>
              <div className="text-[24px] font-bold tabular-nums leading-none">{s.v}</div>
              <div className="text-[12px] text-[hsl(var(--muted-foreground))] mt-1">{s.l}</div>
            </div>
          </Card>
        ))}
      </div>

      <label className="flex items-center gap-2 cursor-pointer text-[12.5px] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]">
        <Checkbox checked={showInactive} onChange={setShowInactive} className="w-4 h-4" />
        {t("rules.showInactive")}
      </label>

      {visible.length === 0 && (
        <Card padding="p-10" className="text-center text-[13px] text-[hsl(var(--muted-foreground))]">
          No rule matches.
          <button onClick={() => { setSearch(""); setShowInactive(true); }} className="ml-2 text-[hsl(var(--primary))] hover:underline">Reset</button>
        </Card>
      )}

      <div className="space-y-3">
        {visible.map(r => {
          const Icon = Icons[r.iconName] || Icons.Shield;
          return (
            <Card key={r.id} padding="p-4" data-tour="feat-rules-card" className={cn("flex items-start gap-4 group/rule", !r.active && "opacity-60")}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{
                background: `hsl(${r.color} / 0.15)`, color: `hsl(${r.color})`
              }}>
                <Icon size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[14.5px] font-semibold">{r.name}</div>
                <div className="text-[12.5px] text-[hsl(var(--muted-foreground))] mt-0.5">{r.desc}</div>
                <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                  {r.tags.map(tg => (
                    <span key={tg} className="px-2 py-0.5 rounded-full text-[10.5px] font-medium bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]">{tg}</span>
                  ))}
                  {window.__dpmIsShared && window.__dpmIsShared(r) && (
                    <Badge variant="primary" className="text-[10px]"><Icons.Layers size={9} /> Shared</Badge>
                  )}
                </div>
                <div className="text-[11px] text-[hsl(var(--muted-foreground))] mt-3 tabular-nums">{t("rules.runCount")} : {r.runs}</div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => openEdit(r)} title={t("common.edit")}
                  className="w-8 h-8 rounded-md text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--foreground))] flex items-center justify-center opacity-0 group-hover/rule:opacity-100 transition-opacity">
                  <Icons.Edit size={13} />
                </button>
                <button onClick={() => { if (window.confirm(t("rules.deleteConfirm"))) ops.remove(r.id); }} title={t("common.delete")}
                  className="w-8 h-8 rounded-md text-[hsl(var(--muted-foreground))] hover:bg-[hsl(0_84%_60%/0.1)] hover:text-[hsl(0_84%_70%)] flex items-center justify-center opacity-0 group-hover/rule:opacity-100 transition-opacity">
                  <Icons.Trash size={13} />
                </button>
                <Switch checked={r.active} onChange={() => ops.toggle(r.id)} />
              </div>
            </Card>
          );
        })}
        <button
          onClick={openCreate}
          className="w-full rounded-[12px] border-2 border-dashed border-[hsl(var(--border))] hover:border-[hsl(var(--primary)/0.4)] p-5 text-[13px] text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--primary)/0.04)] flex items-center justify-center gap-1.5 transition-all">
          <Icons.Plus size={14} /> {t("rules.new")}
        </button>
      </div>

      <RuleModal open={modalOpen} initial={editTarget} onClose={() => setModalOpen(false)}
        onSave={(payload) => editTarget ? ops.update(editTarget.id, payload) : ops.add(payload)}
      />
    </div>
  );
}

function TemplatesDropdown({ onPick }) {
  const t = useT();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  const templates = [
    { name: "Focus time",           desc: "Protects time blocks for deep work",          iconName: "Shield", color: "263 70% 60%", trigger: "schedule",      action: "block",      tags: ["Protection","Schedule"] },
    { name: "Lunch break",          desc: "Automatically inserts a lunch break",         iconName: "Coffee", color: "142 70% 50%", trigger: "schedule",      action: "insert",     tags: ["Break","Schedule"] },
    { name: "Buffer between meetings",desc: "Adds 15 min of buffer after each meeting",    iconName: "Zap",    color: "20 90% 55%",  trigger: "event-created", action: "add-buffer", tags: ["Conditional"] },
  ];
  return (
    <div className="relative" ref={ref} data-tour="feat-rules-templates">
      <Button variant="outline" size="sm" icon={Icons.Sparkles} onClick={() => setOpen(o => !o)}>Templates</Button>
      {open && (
        <div className="absolute z-50 right-0 top-full mt-1.5 w-[280px] rounded-[10px] border border-[hsl(var(--border))] bg-[hsl(var(--popover))] shadow-xl p-1.5 anim-fade-in">
          {templates.map((tpl, i) => (
            <button key={i}
              onClick={() => { onPick && onPick(tpl); setOpen(false); }}
              className="w-full text-left p-3 rounded-[8px] hover:bg-[hsl(var(--accent))] transition-colors">
              <div className="text-[13px] font-semibold">{tpl.name}</div>
              <div className="text-[11.5px] text-[hsl(var(--muted-foreground))] mt-0.5">{tpl.desc}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

Object.assign(window, { HabitsPage, GoalsPage, DashboardPage, SettingsPage, RulesPage });
Object.assign(window, { Widget, CustomizePanel });
