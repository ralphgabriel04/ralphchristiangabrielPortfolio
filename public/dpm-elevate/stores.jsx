/* global React, useState, useEffect, Icons */
/* ============================================================
   STORES — small in-memory CRUD stores backed by window.* and
   custom events. No localStorage by default (mockup), but easy
   to wire in later.

   For each store:
     window.__dpmX = [...]          ← source of truth
     window.dispatchEvent(new CustomEvent("dpm-x-change", ...))
     useX() hook returns [list, ops]
============================================================ */

function makeStore(key, initial) {
  if (typeof window === "undefined") return;
  if (!window["__dpm" + key]) window["__dpm" + key] = initial;
  const evt = "dpm-" + key.toLowerCase() + "-change";

  const dispatch = () => {
    window.dispatchEvent(new CustomEvent(evt, { detail: window["__dpm" + key] }));
  };
  const set = (next) => {
    window["__dpm" + key] = typeof next === "function" ? next(window["__dpm" + key]) : next;
    dispatch();
  };
  const get = () => window["__dpm" + key];

  return { evt, set, get, dispatch };
}

/* Scope a raw store list to the active space (P20). Re-renders on space
   switch. "all" → unfiltered union. */
function useScopedList(rawList) {
  const [spaceId, setSpaceId] = useState(() => (typeof window !== "undefined" && window.__dpmSpace) || "all");
  useEffect(() => {
    const h = (e) => setSpaceId(e.detail || "all");
    window.addEventListener("dpm-space-change", h);
    return () => window.removeEventListener("dpm-space-change", h);
  }, []);
  return (typeof window !== "undefined" && window.__dpmScopeItems) ? window.__dpmScopeItems(rawList, spaceId) : rawList;
}
function currentSpaceTag() {
  const s = (typeof window !== "undefined" && window.__dpmSpace) || "all";
  return s === "all" ? undefined : s;
}

/* ============================================================
   HABITS
============================================================ */
const HABIT_ICONS = ["Brain", "Run", "Book", "Pen", "Heart", "Coffee", "Sun", "Moon", "Activity", "Target", "Star", "Flame", "Sparkles", "Zap"];
const HABIT_COLORS = ["263 70% 60%", "217 91% 60%", "142 70% 50%", "330 80% 60%", "38 92% 55%", "20 90% 55%", "180 65% 50%", "0 84% 60%"];

const habitsInit = [
  { id: "h1", name: "Meditation", iconName: "Brain", color: "263 70% 60%", type: "Fixed · 07:00", freq: "Daily", streak: 7, weekly: [1,1,1,1,1,1,1], duration: "10 min", done: true, space: "perso" },
  { id: "h2", name: "Running", iconName: "Run", color: "217 91% 60%", type: "Flexible", freq: "3×/wk", streak: 12, weekly: [1,0,1,0,1,1,0], duration: "30 min", done: false, space: "perso" },
  { id: "h3", name: "Reading", iconName: "Book", color: "142 70% 50%", type: "Fixed · 21:00", freq: "Daily", streak: 3, weekly: [0,0,0,0,1,1,1], duration: "20 min", done: false, spaces: ["perso","etudes"] },
  { id: "h4", name: "Journaling", iconName: "Pen", color: "330 80% 60%", type: "Fixed · 22:00", freq: "Daily", streak: 5, weekly: [1,1,0,1,1,1,1], duration: "10 min", done: false, space: "perso" },
  { id: "h5", name: "Stretching", iconName: "Heart", color: "38 92% 55%", type: "Fixed · 07:30", freq: "Daily", streak: 2, weekly: [0,0,0,0,0,1,1], duration: "15 min", done: true, space: "perso" },
  { id: "h6", name: "No coffee after 2pm", iconName: "Coffee", color: "20 90% 55%", type: "Conditional", freq: "Daily", streak: 9, weekly: [1,1,1,1,1,1,1], duration: "—", done: true, spaces: ["pro","perso"] },
];
const habitsStore = makeStore("Habits", habitsInit);

function useHabits() {
  const [list, setList] = useState(habitsStore.get());
  useEffect(() => {
    const h = (e) => setList([...e.detail]);
    window.addEventListener(habitsStore.evt, h);
    return () => window.removeEventListener(habitsStore.evt, h);
  }, []);
  const add = (partial) => {
    const h = {
      id: "h" + Date.now(),
      name: partial.name || "New habit",
      iconName: partial.iconName || "Star",
      color: partial.color || HABIT_COLORS[0],
      type: partial.type || "Daily",
      freq: partial.freq || "Daily",
      streak: 0,
      weekly: [0,0,0,0,0,0,0],
      duration: partial.duration || "—",
      done: false,
      space: partial.space || currentSpaceTag(),
    };
    habitsStore.set(curr => [...curr, h]);
    return h.id;
  };
  const update = (id, patch) => habitsStore.set(curr => curr.map(h => h.id === id ? { ...h, ...patch } : h));
  const remove = (id) => habitsStore.set(curr => curr.filter(h => h.id !== id));
  const toggleDone = (id) => habitsStore.set(curr => curr.map(h => h.id === id ? { ...h, done: !h.done } : h));
  return [useScopedList(list), { add, update, remove, toggleDone }];
}

/* ============================================================
   GOALS
============================================================ */
const goalsInit = [
  { id: "g1", t: "Read 24 books this year", cat: "Personal", iconName: "Book", cur: 15, max: 24, unit: "books", from: "Jan 01 2026", to: "Dec 31 2026", status: "active", color: "263 70% 60%",
    smart: { S: true, M: true, A: true, R: true, T: true }, linked: ["Reading (habit)"], spaces: ["perso","etudes"] },
  { id: "g2", t: "Run 50h per month", cat: "Health", iconName: "Run", cur: 32, max: 50, unit: "h", from: "May 01", to: "May 31", status: "active", color: "217 91% 60%",
    smart: { S: true, M: true, A: true, R: true, T: true }, linked: ["Running (habit)"], space: "perso" },
  { id: "g3", t: "Learn Rust — fundamentals", cat: "Learning", iconName: "Brain", cur: 8, max: 30, unit: "sessions", from: "Apr 01", to: "Aug 31", status: "active", color: "20 90% 55%",
    smart: { S: true, M: true, A: true, R: false, T: true }, linked: [], space: "etudes" },
  { id: "g4", t: "Lose 5kg", cat: "Health", iconName: "Activity", cur: 3, max: 5, unit: "kg", from: "Mar 01", to: "Jun 30", status: "active", color: "142 70% 50%",
    smart: { S: true, M: true, A: true, R: true, T: true }, linked: ["Run (habit)", "Stretching (habit)"], space: "perso" },
  { id: "g5", t: "Launch side project X", cat: "Business", iconName: "Star", cur: 65, max: 100, unit: "%", from: "Feb 01", to: "Jun 30", status: "active", color: "330 80% 60%",
    smart: { S: true, M: false, A: true, R: true, T: true }, linked: [], space: "pro" },
  { id: "g6", t: "Meditate 30 days straight", cat: "Wellness", iconName: "Brain", cur: 30, max: 30, unit: "days", from: "Apr 20", to: "May 20", status: "done", color: "142 70% 50%",
    smart: { S: true, M: true, A: true, R: true, T: true }, linked: ["Meditation (habit)"], space: "perso" },
];
const goalsStore = makeStore("Goals", goalsInit);
function useGoals() {
  const [list, setList] = useState(goalsStore.get());
  useEffect(() => {
    const h = (e) => setList([...e.detail]);
    window.addEventListener(goalsStore.evt, h);
    return () => window.removeEventListener(goalsStore.evt, h);
  }, []);
  const add = (partial) => {
    const g = {
      id: "g" + Date.now(),
      t: partial.t || "New goal",
      cat: partial.cat || "Personal",
      iconName: partial.iconName || "Target",
      cur: 0,
      max: partial.max || 100,
      unit: partial.unit || "%",
      from: partial.from || "Today",
      to: partial.to || "Dec 31",
      status: "active",
      color: partial.color || "263 70% 60%",
      smart: partial.smart || { S: true, M: true, A: true, R: true, T: true },
      linked: [],
      space: partial.space || currentSpaceTag(),
    };
    goalsStore.set(curr => [...curr, g]);
    return g.id;
  };
  const update = (id, patch) => goalsStore.set(curr => curr.map(g => g.id === id ? { ...g, ...patch } : g));
  const remove = (id) => goalsStore.set(curr => curr.filter(g => g.id !== id));
  return [useScopedList(list), { add, update, remove }];
}

/* ============================================================
   RULES
============================================================ */
const rulesInit = [
  { id: "r1", name: "Focus time", desc: "Protects time blocks for deep work", iconName: "Shield", color: "263 70% 60%", tags: ["Protection", "Schedule"], active: true, runs: 12, trigger: "schedule", action: "block", space: "pro" },
  { id: "r2", name: "Lunch break", desc: "Automatically inserts a lunch break", iconName: "Coffee", color: "142 70% 50%", tags: ["Break", "Schedule"], active: true, runs: 8, trigger: "schedule", action: "insert", spaces: ["pro","perso"] },
  { id: "r3", name: "Buffer between meetings", desc: "Adds 15 min of buffer after each meeting", iconName: "Zap", color: "20 90% 55%", tags: ["Conditional", "On event creation"], active: true, runs: 3, trigger: "event-created", action: "add-buffer", space: "pro" },
  { id: "r4", name: "Tuesday overload", desc: "If load > 8h on Tuesday → move LOW to Wednesday", iconName: "Activity", color: "0 84% 60%", tags: ["Conditional", "Workload"], active: false, runs: 0, trigger: "workload", action: "reschedule", space: "pro" },
];
const rulesStore = makeStore("Rules", rulesInit);
function useRules() {
  const [list, setList] = useState(rulesStore.get());
  useEffect(() => {
    const h = (e) => setList([...e.detail]);
    window.addEventListener(rulesStore.evt, h);
    return () => window.removeEventListener(rulesStore.evt, h);
  }, []);
  const add = (partial) => {
    const r = {
      id: "r" + Date.now(),
      name: partial.name || "New rule",
      desc: partial.desc || "",
      iconName: partial.iconName || "Shield",
      color: partial.color || "263 70% 60%",
      tags: partial.tags || [],
      active: true,
      runs: 0,
      trigger: partial.trigger || "schedule",
      action: partial.action || "block",
      space: partial.space || currentSpaceTag(),
    };
    rulesStore.set(curr => [...curr, r]);
    return r.id;
  };
  const update = (id, patch) => rulesStore.set(curr => curr.map(r => r.id === id ? { ...r, ...patch } : r));
  const remove = (id) => rulesStore.set(curr => curr.filter(r => r.id !== id));
  const toggle = (id) => rulesStore.set(curr => curr.map(r => r.id === id ? { ...r, active: !r.active } : r));
  return [useScopedList(list), { add, update, remove, toggle }];
}

/* ============================================================
   QUICK NOTES (right sidebar)
============================================================ */
const notesInit = [
  { id: "n1", text: "Remember to call the design team before tomorrow's standup.", createdAt: Date.now() - 3600000 },
];
const notesStore = makeStore("Notes", notesInit);
function useNotes() {
  const [list, setList] = useState(notesStore.get());
  useEffect(() => {
    const h = (e) => setList([...e.detail]);
    window.addEventListener(notesStore.evt, h);
    return () => window.removeEventListener(notesStore.evt, h);
  }, []);
  const add = (text) => {
    const t = String(text || "").trim();
    if (!t) return;
    notesStore.set(curr => [{ id: "n" + Date.now(), text: t, createdAt: Date.now() }, ...curr]);
  };
  const update = (id, text) => notesStore.set(curr => curr.map(n => n.id === id ? { ...n, text } : n));
  const remove = (id) => notesStore.set(curr => curr.filter(n => n.id !== id));
  return [list, { add, update, remove }];
}

/* ============================================================
   EVENTS (calendar)
============================================================ */
const eventsInit = [];
const eventsStore = makeStore("Events", eventsInit);
function useEvents() {
  const [list, setList] = useState(eventsStore.get());
  useEffect(() => {
    const h = (e) => setList([...e.detail]);
    window.addEventListener(eventsStore.evt, h);
    return () => window.removeEventListener(eventsStore.evt, h);
  }, []);
  const add = (partial) => {
    const e = {
      id: "e" + Date.now(),
      title: partial.title || "New event",
      calendar: partial.calendar || "Work",
      color: partial.color || "263 70% 60%",
      allDay: !!partial.allDay,
      date: partial.date || new Date().toISOString().slice(0, 10),
      start: partial.start || "09:00",
      end: partial.end || "10:00",
      location: partial.location || "",
      attendees: partial.attendees || [],
      notify: partial.notify ?? true,
      repeat: partial.repeat || "none",
      busy: partial.busy || "busy",
      visibility: partial.visibility || "default",
      desc: partial.desc || "",
    };
    eventsStore.set(curr => [...curr, e]);
    return e.id;
  };
  const update = (id, patch) => eventsStore.set(curr => curr.map(e => e.id === id ? { ...e, ...patch } : e));
  const remove = (id) => eventsStore.set(curr => curr.filter(e => e.id !== id));
  return [list, { add, update, remove }];
}

/* ============================================================
   UNSCHEDULED TASKS (calendar right panel ↔ all calendar views)
   Shared so a task can be dragged out of the inbox into ANY view
   (day / week / month / agenda) and removed once it is scheduled.
   `mins` drives the duration of the event created on drop.
============================================================ */
const tasksInit = [
  { id: "u1", t: "Q2 presentation",                d: "3h",    mins: 180, p: "warning", e: "high" },
  { id: "u2", t: "API doc update",                 d: "1h",    mins: 60,  p: "success" },
  { id: "u3", t: "Sprint planning",                d: "15min", mins: 15,  p: "warning" },
  { id: "u4", t: "Dentist reminder",               d: "30min", mins: 30,  p: "primary" },
  { id: "u5", t: "Read chapter 4 — Atomic Habits", d: "20min", mins: 20,  p: "primary", e: "low" },
];
const tasksStore = makeStore("Tasks", tasksInit);
function useTasks() {
  const [list, setList] = useState(tasksStore.get());
  useEffect(() => {
    const h = (e) => setList([...e.detail]);
    window.addEventListener(tasksStore.evt, h);
    return () => window.removeEventListener(tasksStore.evt, h);
  }, []);
  const add = (partial) => {
    const t = {
      id: "u" + Date.now(),
      t: partial.t || "New task",
      d: partial.d || "30min",
      mins: partial.mins || 30,
      p: partial.p || "primary",
      ...(partial.e ? { e: partial.e } : {}),
    };
    tasksStore.set(curr => [...curr, t]);
    return t.id;
  };
  const remove = (id) => tasksStore.set(curr => curr.filter(t => t.id !== id));
  const rename = (id, t) => tasksStore.set(curr => curr.map(x => x.id === id ? { ...x, t } : x));
  return [list, { add, remove, rename }];
}

Object.assign(window, {
  useHabits, useGoals, useRules, useNotes, useEvents, useTasks, useKanbanFx,
  HABIT_ICONS, HABIT_COLORS,
});

/* ============================================================
   GLOBAL ACCENT COLOR — lets the user recolor the app's selection/primary
   color (active nav, filled buttons, rings, focus highlights, space accent)
   from Settings. Overrides the --primary family on <html> via inline custom
   properties; persisted to localStorage; pub/sub via window event.
   Lightness is derived per theme so white text on solid fills stays AA.
============================================================ */
const ACCENT_PRESETS = [
  { id: "violet", name: "Violet",   h: 263, s: 70, swatch: "263 70% 60%" },
  { id: "blue",   name: "Bleu",     h: 217, s: 85, swatch: "217 85% 60%" },
  { id: "teal",   name: "Sarcelle", h: 174, s: 62, swatch: "174 62% 47%" },
  { id: "green",  name: "Vert",     h: 142, s: 65, swatch: "142 65% 48%" },
  { id: "amber",  name: "Ambre",    h: 38,  s: 90, swatch: "38 90% 52%" },
  { id: "orange", name: "Orange",   h: 20,  s: 88, swatch: "20 88% 55%" },
  { id: "rose",   name: "Rose",     h: 330, s: 78, swatch: "330 78% 58%" },
  { id: "red",    name: "Rouge",    h: 0,   s: 80, swatch: "0 80% 58%" },
];
const ACCENT_LS_KEY = "dpm-accent";
const ACCENT_CUSTOM_KEY = "dpm-accent-custom";
// hex (#rrggbb) → { h, s, l } in CSS units (h deg, s/l %).
function hexToHsl(hex) {
  let m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex || "");
  if (!m) return { h: 263, s: 70, l: 60 };
  const r = parseInt(m[1], 16) / 255, g = parseInt(m[2], 16) / 255, b = parseInt(m[3], 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0; const l = (max + min) / 2;
  const d = max - min;
  if (d) {
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
  }
  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
}
// Resolve the hue/sat for an accent id: a preset, the live custom color, or the
// current Space's color ("space"). Returns null when unresolvable.
function accentHS(id) {
  if (id === "custom") { const c = hexToHsl(window.__dpmAccentCustom || "#8b5cf6"); return { h: c.h, s: c.s }; }
  if (id === "space") {
    const sp = window.__dpmSpaceById ? window.__dpmSpaceById(window.__dpmSpace) : null;
    const m = sp && /(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)%/.exec(sp.color || "");
    return m ? { h: parseFloat(m[1]), s: parseFloat(m[2]) } : null;
  }
  const p = ACCENT_PRESETS.find(x => x.id === id);
  return p ? { h: p.h, s: p.s } : null;
}
// Apply (or clear, for the default violet) the accent custom properties.
// A CUSTOM accent (non-violet) also overrides the per-space ambient (--space-accent)
// so the user's chosen selection color wins app-wide. The default violet leaves
// --space-accent untouched so Spaces keep owning their own tint out of the box.
// "space" matches the current Space's color but lets the Space keep owning --space-accent.
function applyAccent(id) {
  if (typeof document === "undefined") return;
  const r = document.documentElement.style;
  const clearPrimary = () => ["--primary", "--primary-solid", "--primary-solid-hover", "--ring"].forEach(k => r.removeProperty(k));
  // Default violet = let the stylesheet own the brand, and Spaces own --space-accent.
  if (!id || id === "violet") { clearPrimary(); return; }
  const hs = accentHS(id);
  if (!hs) { clearPrimary(); return; }
  const light = document.documentElement.classList.contains("light");
  const pL = light ? 48 : 62;   // text/icon/border accent
  const sL = light ? 44 : 52;   // solid fills carrying white text (AA)
  r.setProperty("--primary", `${hs.h} ${hs.s}% ${pL}%`);
  r.setProperty("--primary-solid", `${hs.h} ${hs.s}% ${sL}%`);
  r.setProperty("--primary-solid-hover", `${hs.h} ${hs.s}% ${Math.max(0, sL - 6)}%`);
  r.setProperty("--ring", `${hs.h} ${hs.s}% ${pL}%`);
  // "space" mirrors the Space color but doesn't seize --space-accent (Space owns it).
  // We still must CLEAR any stale inline override left by a prior preset/custom
  // accent — reset --space-accent to the current Space's actual color.
  if (id === "space") {
    const sp = window.__dpmSpaceById ? window.__dpmSpaceById(window.__dpmSpace) : null;
    if (sp && sp.color) r.setProperty("--space-accent", sp.color);
    else r.removeProperty("--space-accent");
  } else {
    r.setProperty("--space-accent", `${hs.h} ${hs.s}% ${sL}%`);
  }
}
// Apply persisted accent immediately on load (html already carries .dark/.light).
if (typeof window !== "undefined") {
  try {
    window.__dpmAccent = window.localStorage.getItem(ACCENT_LS_KEY) || "violet";
    window.__dpmAccentCustom = window.localStorage.getItem(ACCENT_CUSTOM_KEY) || "#8b5cf6";
  } catch (e) { window.__dpmAccent = "violet"; window.__dpmAccentCustom = "#8b5cf6"; }
  applyAccent(window.__dpmAccent);
  // A Space switch re-sets --space-accent; re-assert a non-default accent AFTER it
  // so a custom/space-matched selection color stays in sync (default violet defers).
  const reassertAccent = () => {
    if ((window.__dpmAccent || "violet") !== "violet") {
      setTimeout(() => applyAccent(window.__dpmAccent), 0);
    }
  };
  window.addEventListener("dpm-space-change", reassertAccent);
  window.addEventListener("dpm-spaces-change", reassertAccent);
}
function useAccent() {
  const [id, setId] = useState(() => (typeof window !== "undefined" && window.__dpmAccent) || "violet");
  useEffect(() => {
    const h = (e) => setId(e.detail);
    window.addEventListener("dpm-accent-change", h);
    return () => window.removeEventListener("dpm-accent-change", h);
  }, []);
  const set = (next) => {
    window.__dpmAccent = next;
    try { window.localStorage.setItem(ACCENT_LS_KEY, next); } catch (e) {}
    applyAccent(next);
    window.dispatchEvent(new CustomEvent("dpm-accent-change", { detail: next }));
  };
  // Pick an arbitrary custom color (hex) — selects the "custom" accent.
  const setCustom = (hex) => {
    window.__dpmAccentCustom = hex;
    try { window.localStorage.setItem(ACCENT_CUSTOM_KEY, hex); } catch (e) {}
    set("custom");
  };
  return [id, set, { custom: (typeof window !== "undefined" && window.__dpmAccentCustom) || "#8b5cf6", setCustom }];
}
if (typeof window !== "undefined") Object.assign(window, { useAccent, applyAccent, ACCENT_PRESETS });

/* ============================================================
   KANBAN COLUMN FX (P29) — per-column arrival animation + designated
   color + global motion mode. Persisted to localStorage; pub/sub via
   window event so any view stays in sync. Additive to the board.

   Shape:
     motion : "full" | "subtle" | "off"
     anim   : { "<boardId>:<colId>": "none|confetti|glow|check|bounce" }
     endCol : { "<boardId>": "<colId>" }   ← the completion column
     color  : { "<boardId>:<colId>": "H S% L%" }  ← color overrides
============================================================ */
const KFX_LS_KEY = "dpm-kanban-fx";
const kfxInit = (() => {
  const base = { motion: "full", anim: {}, endCol: {}, color: {} };
  if (typeof window === "undefined") return base;
  try {
    const raw = window.localStorage.getItem(KFX_LS_KEY);
    if (raw) return { ...base, ...JSON.parse(raw) };
  } catch (e) {}
  return base;
})();
const kfxStore = makeStore("KanbanFx", kfxInit);
function kfxPersist() {
  try { window.localStorage.setItem(KFX_LS_KEY, JSON.stringify(window.__dpmKanbanFx)); } catch (e) {}
}
// Reflect the global motion mode on <html> so the CSS kill/subtle switches apply.
function kfxSyncClass() {
  if (typeof document === "undefined") return;
  const m = (window.__dpmKanbanFx || {}).motion || "full";
  const cl = document.documentElement.classList;
  cl.toggle("kfx-off", m === "off");
  cl.toggle("kfx-subtle", m === "subtle");
}
if (typeof window !== "undefined") kfxSyncClass();

function useKanbanFx() {
  const [state, setState] = useState(kfxStore.get());
  useEffect(() => {
    const h = (e) => setState({ ...e.detail });
    window.addEventListener(kfxStore.evt, h);
    return () => window.removeEventListener(kfxStore.evt, h);
  }, []);
  const commit = (next) => { kfxStore.set(next); kfxPersist(); kfxSyncClass(); };
  const setMotion  = (motion)              => commit(s => ({ ...s, motion }));
  const setAnim    = (boardId, colId, v)   => commit(s => ({ ...s, anim:  { ...s.anim,  [boardId + ":" + colId]: v } }));
  const setEndCol  = (boardId, colId)      => commit(s => ({ ...s, endCol:{ ...s.endCol, [boardId]: colId } }));
  const setColor   = (boardId, colId, hsl) => commit(s => ({ ...s, color: { ...s.color, [boardId + ":" + colId]: hsl } }));
  return [state, { setMotion, setAnim, setEndCol, setColor }];
}
