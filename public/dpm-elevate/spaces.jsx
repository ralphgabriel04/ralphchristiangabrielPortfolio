/* global React, Icons, Button, Card, Badge, Switch, cn,
          useState, useEffect, useRef, useMemo */

/* ============================================================
   ESPACES (P20) — global work-contexts that scope the whole app.

   One mental model of "contexte" — the Espaces ABSORB the calendar
   presets (Tout/Bureau/Perso/Famille) and the task boards. Choosing
   a space filters tasks, calendars, habitudes, objectifs and règles.

   Architecture (mirrors useHabits/useGoals):
     window.__dpmSpaces       ← list (store)         · localStorage["dpm-spaces"]
     window.__dpmSpace        ← current space id     · localStorage["dpm-current-space"]
     dpm-spaces-change        ← list changed
     dpm-space-change         ← active space switched
     useSpaces() → [list, {add,update,remove}]
     useSpace()  → [currentId, setCurrent]
     useCurrentSpace() → resolved space object

   Garde-fous (non négociables) :
     • "Tous" (id "all") = défaut, NON supprimable, vue union (filet).
     • Accent ambiant permanent (var CSS --space-accent).
     • Bascule réversible en un clic.
     • Retrait/suppression d'espace ne supprime JAMAIS de données
       (les éléments retombent dans "Tous").
============================================================ */

const SPACES_KEY = "dpm-spaces";
const CURRENT_SPACE_KEY = "dpm-current-space";

/* Default spaces. "all" is the safety net; pro/perso/études seed from the
   real calendar groups + task boards already in the product. */
const DEFAULT_SPACES = [
  { id: "all", name: "All", icon: "Layers", color: "263 70% 60%", system: true,
    arrivalView: "home", hours: "All hours",
    content: { calendars: [], boards: [] } },
  { id: "pro", name: "Professional", icon: "Briefcase", color: "217 91% 60%",
    arrivalView: "home", hours: "09:00 – 17:00",
    content: { calendars: ["Work", "Meetings", "Projects"], boards: ["Internships & jobs"] } },
  { id: "perso", name: "Personal", icon: "Heart", color: "330 80% 60%",
    arrivalView: "home", hours: "Evenings & weekends",
    content: { calendars: ["Personal", "Sport", "Family", "Léa", "Tom", "Mom"], boards: ["Personal"] } },
  { id: "etudes", name: "Studies", icon: "GraduationCap", color: "38 92% 55%",
    arrivalView: "daily-planning", hours: "Evenings",
    content: { calendars: [], boards: ["Courses"] } },
];

/* Calendars / boards that exist in the product but aren't claimed by any
   custom space stay visible in "Tous" only (legacy). */
const ALL_CALENDAR_NAMES = ["Work", "Meetings", "Projects", "Personal", "Sport", "Family", "Léa", "Tom", "Mom", "Flights", "Hotels", "Activities"];
const ALL_BOARD_NAMES = ["Courses", "Internships & jobs", "Personal"];

/* ---------- persistence + store ---------- */
function readSpaces() {
  try {
    const raw = localStorage.getItem(SPACES_KEY);
    if (raw) { const p = JSON.parse(raw); if (Array.isArray(p) && p.length) return p; }
  } catch {}
  return DEFAULT_SPACES;
}
function writeSpaces(list) {
  try { localStorage.setItem(SPACES_KEY, JSON.stringify(list)); } catch {}
}
function readCurrentSpace() {
  try { return localStorage.getItem(CURRENT_SPACE_KEY) || "all"; } catch { return "all"; }
}

if (typeof window !== "undefined") {
  if (!window.__dpmSpaces) window.__dpmSpaces = readSpaces();
  if (!window.__dpmSpace) window.__dpmSpace = readCurrentSpace();
  // ensure current still exists
  if (!window.__dpmSpaces.some(s => s.id === window.__dpmSpace)) window.__dpmSpace = "all";
}

function setSpacesList(next) {
  window.__dpmSpaces = typeof next === "function" ? next(window.__dpmSpaces) : next;
  writeSpaces(window.__dpmSpaces);
  window.dispatchEvent(new CustomEvent("dpm-spaces-change", { detail: window.__dpmSpaces }));
}
function setCurrentSpace(id) {
  if (!window.__dpmSpaces.some(s => s.id === id)) id = "all";
  window.__dpmSpace = id;
  try { localStorage.setItem(CURRENT_SPACE_KEY, id); } catch {}
  applySpaceAccent(spaceById(id));
  window.dispatchEvent(new CustomEvent("dpm-space-change", { detail: id }));
}

function spaceById(id) {
  return (window.__dpmSpaces || DEFAULT_SPACES).find(s => s.id === id) || (window.__dpmSpaces || DEFAULT_SPACES)[0];
}

/* ---------- scoping resolvers ---------- */
/* Per-item tag (habits/goals/rules carry `space` string or `spaces` array). */
function itemInSpace(item, spaceId) {
  if (spaceId === "all") return true;
  if (!item) return false;
  if (Array.isArray(item.spaces)) return item.spaces.includes(spaceId);
  if (item.space) return item.space === spaceId;
  return false; // unassigned/legacy → only in "Tous"
}
/* Filter a list of tagged items for the current space. */
function scopeItems(list, spaceId) {
  if (spaceId === "all") return list;
  return (list || []).filter(it => itemInSpace(it, spaceId));
}
/* Calendars / boards: membership lives on the space's content config. */
function calendarInSpace(name, spaceId) {
  if (spaceId === "all") return true;
  const sp = spaceById(spaceId);
  return !!sp.content && Array.isArray(sp.content.calendars) && sp.content.calendars.includes(name);
}
function boardInSpace(name, spaceId) {
  if (spaceId === "all") return true;
  const sp = spaceById(spaceId);
  return !!sp.content && Array.isArray(sp.content.boards) && sp.content.boards.includes(name);
}
/* Is an item shared across >1 space? (drives the "Partagé" badge.) */
function isShared(item) {
  return Array.isArray(item?.spaces) && item.spaces.length > 1;
}

/* Count of items attached to a space (for the switcher menu). */
function countForSpace(spaceId) {
  const habits = window.__dpmHabits || [];
  const goals = window.__dpmGoals || [];
  const rules = window.__dpmRules || [];
  if (spaceId === "all") {
    return habits.length + goals.length + rules.length + ALL_CALENDAR_NAMES.length + ALL_BOARD_NAMES.length;
  }
  const sp = spaceById(spaceId);
  const cals = sp.content?.calendars?.length || 0;
  const boards = sp.content?.boards?.length || 0;
  const h = scopeItems(habits, spaceId).length;
  const g = scopeItems(goals, spaceId).length;
  const r = scopeItems(rules, spaceId).length;
  return cals + boards + h + g + r;
}

if (typeof window !== "undefined") {
  Object.assign(window, {
    __dpmScopeItems: scopeItems, __dpmItemInSpace: itemInSpace,
    __dpmCalendarInSpace: calendarInSpace, __dpmBoardInSpace: boardInSpace,
    __dpmIsShared: isShared, __dpmSpaceById: spaceById, __dpmSetSpace: setCurrentSpace,
    __dpmCountForSpace: countForSpace,
    ALL_CALENDAR_NAMES, ALL_BOARD_NAMES,
  });
}

/* ============================================================
   PARTAGE D'ESPACE (P25) — granular, per-module sharing.

   Sharing is attached to a SPACE (never a parallel model). Each member
   carries per-module rights (Read / Edit). Wellbeing modules (Habits)
   are PRIVATE BY DEFAULT — off until explicitly shared.

     window.__dpmShares        ← { [spaceId]: Member[] }   · localStorage["dpm-shares"]
     dpm-shares-change         ← changed
     useShares(spaceId) → [members, ops]
============================================================ */
const SHARES_KEY = "dpm-shares";

/* The five shareable modules. `private` = wellbeing, off by default. */
const SHARE_MODULES = [
  { id: "calendars", name: "Calendars", icon: "Calendar" },
  { id: "tasks", name: "Tasks", icon: "CheckSquare" },
  { id: "prioritization", name: "Prioritization", icon: "ListChecks" },
  { id: "goals", name: "Goals", icon: "Target" },
  { id: "habits", name: "Habits", icon: "Flame", private: true },
];

function blankPerms() {
  const p = {};
  SHARE_MODULES.forEach((m) => { p[m.id] = { on: false, level: "read" }; });
  return p;
}
function permsFrom(map) {
  const p = blankPerms();
  Object.keys(map || {}).forEach((k) => { if (p[k]) p[k] = { ...p[k], ...map[k] }; });
  return p;
}
function initials(nameOrEmail) {
  const s = (nameOrEmail || "").trim();
  if (s.includes("@")) return s.slice(0, 2).toUpperCase();
  const parts = s.split(/\s+/).filter(Boolean);
  return ((parts[0]?.[0] || "") + (parts[1]?.[0] || "")).toUpperCase() || s.slice(0, 2).toUpperCase();
}

/* Seed: the owner + a couple of realistic members on pro/perso. */
function seedShares() {
  return {
    pro: [
      { id: "owner", name: "Ralph Aubry", email: "you · owner", role: "owner", initials: "RA", color: "263 70% 55%", perms: blankPerms() },
      { id: "m_lea", name: "Léa Bouchard", email: "lea.bouchard@email.com", role: "member", initials: "LB", color: "217 91% 55%",
        perms: permsFrom({ calendars: { on: true, level: "edit" }, tasks: { on: true, level: "read" }, goals: { on: true, level: "read" } }) },
      { id: "m_marc", name: "Marc Therrien", email: "marc.t@email.com", role: "pending", initials: "MT", color: "38 92% 50%",
        perms: permsFrom({ calendars: { on: true, level: "read" }, tasks: { on: true, level: "read" } }) },
    ],
    perso: [
      { id: "owner", name: "Ralph Aubry", email: "you · owner", role: "owner", initials: "RA", color: "263 70% 55%", perms: blankPerms() },
      { id: "m_tom", name: "Tom Mercier", email: "tom.mercier@email.com", role: "member", initials: "TM", color: "330 80% 55%",
        perms: permsFrom({ calendars: { on: true, level: "edit" }, tasks: { on: true, level: "edit" } }) },
    ],
  };
}
function readShares() {
  try {
    const raw = localStorage.getItem(SHARES_KEY);
    if (raw) { const p = JSON.parse(raw); if (p && typeof p === "object") return p; }
  } catch (e) {}
  return seedShares();
}
function writeShares(map) {
  try { localStorage.setItem(SHARES_KEY, JSON.stringify(map)); } catch (e) {}
}
if (typeof window !== "undefined" && !window.__dpmShares) window.__dpmShares = readShares();

function setShares(next) {
  window.__dpmShares = typeof next === "function" ? next(window.__dpmShares) : next;
  writeShares(window.__dpmShares);
  window.dispatchEvent(new CustomEvent("dpm-shares-change", { detail: window.__dpmShares }));
}

/* Count of people with active access to a space (excludes the owner row). */
function shareCountForSpace(spaceId) {
  const list = (window.__dpmShares || {})[spaceId] || [];
  return list.filter((m) => m.role !== "owner").length;
}

function useShares(spaceId) {
  const [map, setMap] = useState(window.__dpmShares || {});
  useEffect(() => {
    const h = (e) => setMap({ ...e.detail });
    window.addEventListener("dpm-shares-change", h);
    return () => window.removeEventListener("dpm-shares-change", h);
  }, []);
  const members = map[spaceId] || [];
  const ops = {
    invite: (email) => {
      const m = {
        id: "m" + Date.now(), name: email, email: "Pending invite", role: "pending",
        initials: initials(email), color: "38 92% 50%",
        perms: permsFrom({ calendars: { on: true, level: "read" }, tasks: { on: true, level: "read" } }),
      };
      setShares((curr) => ({ ...curr, [spaceId]: [...(curr[spaceId] || []), m] }));
    },
    toggleModule: (memberId, moduleId) => setShares((curr) => ({
      ...curr,
      [spaceId]: (curr[spaceId] || []).map((m) => m.id === memberId
        ? { ...m, perms: { ...m.perms, [moduleId]: { ...m.perms[moduleId], on: !m.perms[moduleId].on } } } : m),
    })),
    setLevel: (memberId, moduleId, level) => setShares((curr) => ({
      ...curr,
      [spaceId]: (curr[spaceId] || []).map((m) => m.id === memberId
        ? { ...m, perms: { ...m.perms, [moduleId]: { ...m.perms[moduleId], level } } } : m),
    })),
    remove: (memberId) => setShares((curr) => ({
      ...curr, [spaceId]: (curr[spaceId] || []).filter((m) => m.id !== memberId),
    })),
  };
  return [members, ops];
}

if (typeof window !== "undefined") {
  Object.assign(window, { useShares, SHARE_MODULES, shareCountForSpace, __dpmShareCount: shareCountForSpace });
}

/* ---------- ambient accent ---------- */
function applySpaceAccent(space) {
  if (typeof document === "undefined" || !space) return;
  const root = document.documentElement;
  root.style.setProperty("--space-accent", space.color);
  root.style.setProperty("--space-is-all", space.id === "all" ? "1" : "0");
}
if (typeof window !== "undefined") {
  applySpaceAccent(spaceById(window.__dpmSpace));
  window.addEventListener("dpm-spaces-change", () => applySpaceAccent(spaceById(window.__dpmSpace)));
}

/* ---------- hooks ---------- */
function useSpaces() {
  const [list, setList] = useState(window.__dpmSpaces || DEFAULT_SPACES);
  useEffect(() => {
    const h = (e) => setList([...e.detail]);
    window.addEventListener("dpm-spaces-change", h);
    return () => window.removeEventListener("dpm-spaces-change", h);
  }, []);
  const add = (partial) => {
    const id = "sp" + Date.now();
    const s = {
      id, name: partial.name || "New space",
      icon: partial.icon || "Layers", color: partial.color || "263 70% 60%",
      arrivalView: partial.arrivalView || "home", hours: partial.hours || "All hours",
      content: partial.content || { calendars: [], boards: [] },
    };
    setSpacesList(curr => [...curr, s]);
    return id;
  };
  const update = (id, patch) => setSpacesList(curr => curr.map(s => s.id === id ? { ...s, ...patch } : s));
  const remove = (id) => {
    if (id === "all") return;
    setSpacesList(curr => curr.filter(s => s.id !== id));
    if (window.__dpmSpace === id) setCurrentSpace("all"); // reattach to safety net
  };
  return [list, { add, update, remove }];
}

function useSpace() {
  const [id, setId] = useState(window.__dpmSpace || "all");
  useEffect(() => {
    const h = (e) => setId(e.detail);
    window.addEventListener("dpm-space-change", h);
    return () => window.removeEventListener("dpm-space-change", h);
  }, []);
  return [id, setCurrentSpace];
}
function useCurrentSpace() {
  const [id] = useSpace();
  const [, force] = useState(0);
  useEffect(() => {
    const h = () => force(n => n + 1);
    window.addEventListener("dpm-spaces-change", h);
    return () => window.removeEventListener("dpm-spaces-change", h);
  }, []);
  return spaceById(id);
}

/* ============================================================
   SPACE SWITCHER MENU — shared dropdown body.
============================================================ */
function SpaceMenu({ spaces, currentId, onPick, onManage, onShare, onClose }) {
  return (
    <div className="w-[252px] rounded-[12px] border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-2xl overflow-hidden anim-scale-in">
      <div className="px-3 pt-2.5 pb-1.5">
        <div className="text-[10px] uppercase tracking-[0.12em] font-semibold text-[hsl(var(--muted-foreground))]">Spaces</div>
      </div>
      <div className="px-1.5 pb-1.5 max-h-[280px] overflow-y-auto">
        {spaces.map(s => {
          const IconC = Icons[s.icon] || Icons.Layers;
          const active = s.id === currentId;
          const count = countForSpace(s.id);
          return (
            <button
              key={s.id}
              onClick={() => { onPick(s.id); onClose(); }}
              className={cn(
                "w-full flex items-center gap-2.5 px-2 py-2 rounded-[8px] text-left transition-colors",
                active ? "bg-[hsl(var(--accent))]" : "hover:bg-[hsl(var(--accent)/0.5)]"
              )}
            >
              <span className="w-7 h-7 rounded-[8px] flex items-center justify-center flex-shrink-0"
                    style={{ background: `hsl(${s.color} / 0.16)`, color: `hsl(${s.color})` }}>
                <IconC size={15} />
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-medium leading-tight flex items-center gap-1.5">
                  {s.name}
                  {s.system && <span className="text-[9px] uppercase tracking-wider font-semibold text-[hsl(var(--muted-foreground))] bg-[hsl(var(--muted))] px-1 py-0.5 rounded">union</span>}
                </div>
                <div className="text-[10.5px] text-[hsl(var(--muted-foreground))] tabular-nums">
                  {count} item{count > 1 ? "s" : ""}
                </div>
              </div>
              {active && <Icons.Check size={14} className="flex-shrink-0" style={{ color: `hsl(${s.color})` }} />}
            </button>
          );
        })}
      </div>
      <div className="border-t border-[hsl(var(--border))] p-1.5">
        {currentId !== "all" && (
          <button onClick={() => { onShare(); onClose(); }}
            className="w-full flex items-center gap-2 px-2 py-2 rounded-[8px] hover:bg-[hsl(var(--accent))] text-left transition-colors text-[12.5px] font-medium">
            <Icons.Users size={14} className="text-[hsl(var(--muted-foreground))]" /> Share this space
          </button>
        )}
        <button onClick={() => { onManage("manage"); onClose(); }}
          className="w-full flex items-center gap-2 px-2 py-2 rounded-[8px] hover:bg-[hsl(var(--accent))] text-left transition-colors text-[12.5px] font-medium">
          <Icons.Settings size={14} className="text-[hsl(var(--muted-foreground))]" /> Manage spaces
        </button>
        <button onClick={() => { onManage("create"); onClose(); }}
          className="w-full flex items-center gap-2 px-2 py-2 rounded-[8px] hover:bg-[hsl(var(--accent))] text-left transition-colors text-[12.5px] font-medium text-[hsl(263_70%_82%)]">
          <Icons.Plus size={14} /> New space
        </button>
      </div>
    </div>
  );
}

/* The switcher. variant: "bar" (expanded sidebar), "rail" (collapsed sidebar),
   "chip" (mobile header). */
function SpaceSwitcher({ variant = "bar" }) {
  const [spaces] = useSpaces();
  const [currentId] = useSpace();
  const space = spaceById(currentId);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const IconC = Icons[space.icon] || Icons.Layers;
  const count = countForSpace(currentId);

  useEffect(() => {
    if (!open) return;
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const k = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", h);
    document.addEventListener("keydown", k);
    return () => { document.removeEventListener("mousedown", h); document.removeEventListener("keydown", k); };
  }, [open]);

  const openManage = (mode) => { window.__dpmOpenSpaces?.(mode); };
  const openShare = () => { window.__dpmOpenSpaces?.("share", currentId); };

  const menu = open && (
    <SpaceMenu
      spaces={spaces} currentId={currentId}
      onPick={setCurrentSpace} onManage={openManage} onShare={openShare} onClose={() => setOpen(false)}
    />
  );

  if (variant === "rail") {
    return (
      <div className="relative" ref={ref}>
        <button
          onClick={() => setOpen(o => !o)}
          title={`Space: ${space.name}`}
          className="w-10 h-10 rounded-[10px] flex items-center justify-center transition-all"
          style={{ background: `hsl(${space.color} / 0.16)`, color: `hsl(${space.color})`, boxShadow: `inset 0 0 0 1.5px hsl(${space.color} / 0.45)` }}
        >
          <IconC size={17} />
        </button>
        {open && <div className="absolute left-[48px] top-0 z-[60]">{menu}</div>}
      </div>
    );
  }

  if (variant === "chip") {
    return (
      <div className="relative" ref={ref}>
        <button
          onClick={() => setOpen(o => !o)}
          className="h-8 pl-1.5 pr-2 rounded-full flex items-center gap-1.5 transition-all"
          style={{ background: `hsl(${space.color} / 0.16)`, color: `hsl(${space.color})`, boxShadow: `inset 0 0 0 1px hsl(${space.color} / 0.4)` }}
        >
          <span className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: `hsl(${space.color} / 0.25)` }}>
            <IconC size={12} />
          </span>
          <span className="text-[12px] font-semibold max-w-[90px] truncate">{space.name}</span>
          <Icons.ChevronDown size={12} className={cn("transition-transform", open && "rotate-180")} />
        </button>
        {open && <div className="absolute left-0 top-[38px] z-[60]">{menu}</div>}
      </div>
    );
  }

  // "bar" — expanded sidebar
  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full h-11 px-2 rounded-[10px] flex items-center gap-2.5 transition-all border"
        style={{
          background: `hsl(${space.color} / 0.10)`,
          borderColor: `hsl(${space.color} / 0.30)`,
        }}
      >
        <span className="w-7 h-7 rounded-[8px] flex items-center justify-center flex-shrink-0"
              style={{ background: `hsl(${space.color} / 0.22)`, color: `hsl(${space.color})` }}>
          <IconC size={15} />
        </span>
        <div className="flex-1 min-w-0 text-left">
          <div className="text-[9px] uppercase tracking-[0.1em] font-semibold text-[hsl(var(--muted-foreground))] leading-none">Space</div>
          <div className="text-[13px] font-semibold leading-tight truncate mt-0.5">{space.name}</div>
        </div>
        <span className="text-[10px] font-mono tabular-nums text-[hsl(var(--muted-foreground))] flex-shrink-0">{count}</span>
        <Icons.ChevronDown size={13} className={cn("flex-shrink-0 text-[hsl(var(--muted-foreground))] transition-transform", open && "rotate-180")} />
      </button>
      {open && <div className="absolute left-0 top-[48px] z-[60] w-[252px]">{menu}</div>}
    </div>
  );
}

if (typeof window !== "undefined") {
  Object.assign(window, {
    useSpaces, useSpace, useCurrentSpace, SpaceSwitcher, spaceById,
    DEFAULT_SPACES, SpaceScopeBanner, SpaceTitleBar,
  });
}

/* ============================================================
   SPACE TITLE BAR (P25) — titre dynamique.
   A slim header line at the top of the main content area that
   reflects the CURRENT space (name + ambient accent + count). It
   updates evidently on every space switch and offers a one-click
   escape back to "Tous". Shown on every chrome page.
============================================================ */
function SpaceTitleBar({ className }) {
  const space = useCurrentSpace();
  if (!space) return null;
  const IconC = Icons[space.icon] || Icons.Layers;
  const isAll = space.id === "all";
  const count = countForSpace(space.id);
  return (
    <div className={cn("flex items-center gap-2.5 transition-colors", className)}>
      <span className="w-8 h-8 rounded-[9px] flex items-center justify-center flex-shrink-0"
            style={{ background: `hsl(${space.color} / 0.16)`, color: `hsl(${space.color})` }}>
        <IconC size={16} />
      </span>
      <div className="flex items-baseline gap-2 min-w-0 flex-wrap">
        <span className="text-[10px] uppercase tracking-[0.16em] font-semibold text-[hsl(var(--muted-foreground))]">Espace</span>
        <span className="text-[15px] font-bold tracking-tight truncate" style={{ color: `hsl(${space.color})` }}>{space.name}</span>
        {isAll && <span className="text-[9px] uppercase tracking-wider font-semibold text-[hsl(var(--muted-foreground))] bg-[hsl(var(--muted))] px-1 py-0.5 rounded">union</span>}
        <span className="text-[11px] text-[hsl(var(--muted-foreground))] tabular-nums">· {count} élément{count > 1 ? "s" : ""}</span>
      </div>
      {!isAll && (
        <button onClick={() => window.__dpmSetSpace?.("all")}
          className="ml-auto text-[11px] font-semibold px-2 py-1 rounded-md hover:bg-[hsl(var(--accent))] flex items-center gap-1 flex-shrink-0 whitespace-nowrap transition-colors"
          style={{ color: `hsl(${space.color})` }}>
          <Icons.Layers size={11} /> Tous
        </button>
      )}
    </div>
  );
}

/* Reassurance strip — shown on Home when a non-"all" space is active, with a
   one-click escape back to the safety net. Anti-« où est ma tâche ?! ». */
function SpaceScopeBanner() {
  const space = useCurrentSpace();
  if (!space || space.id === "all") return null;
  const IconC = Icons[space.icon] || Icons.Layers;
  return (
    <div className="rounded-[12px] border px-3.5 py-2.5 flex items-center gap-2.5"
      style={{ borderColor: `hsl(${space.color} / 0.35)`, background: `hsl(${space.color} / 0.07)` }}>
      <span className="w-7 h-7 rounded-[8px] flex items-center justify-center flex-shrink-0"
            style={{ background: `hsl(${space.color} / 0.18)`, color: `hsl(${space.color})` }}><IconC size={14} /></span>
      <div className="flex-1 min-w-0 text-[12.5px] leading-snug">
        <span className="font-semibold">Space {space.name}</span>
        <span className="text-[hsl(var(--muted-foreground))]"> · the app only shows this space's content. Nothing is deleted.</span>
      </div>
      <button onClick={() => window.__dpmSetSpace?.("all")}
        className="text-[11.5px] font-semibold px-2.5 py-1.5 rounded-md hover:bg-[hsl(var(--accent))] flex items-center gap-1 flex-shrink-0 whitespace-nowrap"
        style={{ color: `hsl(${space.color})` }}>
        <Icons.Layers size={12} /> View All
      </button>
    </div>
  );
}
