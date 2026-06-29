/* global window */
/* ============================================================
   DPM — DYNAMIC DATE LAYER  (window.DPMDate)

   Single source of truth for "now" across the whole mockup so the
   product never looks frozen in a past month. Everything that used
   to hard-code "24 May 2026 / Week 21" reads from here instead.

   - Anchored on the REAL current date (new Date()).
   - Locale-aware (FR / EN) via Intl — no month/day tables to drift.
   - Week math is Monday-first (matches the calendar grid).

   All helpers are pure and cheap; call them at render time so a
   day-boundary crossing (or a language toggle) is reflected live.
============================================================ */
(function () {
  const lang = () => (typeof window !== "undefined" && window.__dpmLang === "fr") ? "fr" : "en";
  const loc = (l) => ((l || lang()) === "fr" ? "fr-FR" : "en-US");

  const atMidnight = (d) => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; };
  const now = () => new Date();
  const today = () => atMidnight(now());

  const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
  const sameDay = (a, b) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

  // Monday of the week containing `d` (Mon-first; getDay() Sun=0).
  const weekStart = (d) => {
    const base = atMidnight(d || now());
    const dow = (base.getDay() + 6) % 7; // 0 = Monday
    return addDays(base, -dow);
  };

  // ISO-8601 week number (Mon-first, week 1 contains the first Thursday).
  const isoWeek = (d) => {
    const date = atMidnight(d || now());
    const day = (date.getDay() + 6) % 7;
    date.setDate(date.getDate() - day + 3); // nearest Thursday
    const firstThu = new Date(date.getFullYear(), 0, 4);
    const firstDay = (firstThu.getDay() + 6) % 7;
    firstThu.setDate(firstThu.getDate() - firstDay + 3);
    return 1 + Math.round((date - firstThu) / (7 * 24 * 3600 * 1000));
  };

  const fmt = (d, opts, l) => new Intl.DateTimeFormat(loc(l), opts).format(d);

  // Short English weekday key kept stable for the EN→FR runtime dict
  // (so the calendar header day labels still flip language).
  const EN_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // The 7 day-cells of the week containing `d`. Each cell exposes the bits the
  // calendar grid + mini-cal need, with the mock events kept on their original
  // weekday COLUMN (Mon..Sun) — only the labels/numbers go live.
  const weekDays = (d) => {
    const start = weekStart(d || now());
    const t = today();
    return Array.from({ length: 7 }, (_, i) => {
      const date = addDays(start, i);
      return {
        date,
        d: EN_SHORT[date.getDay()],            // "Mon" … (runtime-translatable)
        n: date.getDate(),                      // day of month
        month: date.getMonth(),
        year: date.getFullYear(),
        today: sameDay(date, t),
        weekend: date.getDay() === 0 || date.getDay() === 6,
      };
    });
  };

  // "May 18 – 24, 2026"  /  "18 – 24 mai 2026"  (handles month/year spans)
  const weekRangeLabel = (d, l) => {
    const start = weekStart(d || now());
    const end = addDays(start, 6);
    const L = l || lang();
    const y = end.getFullYear();
    const sM = fmt(start, { month: L === "fr" ? "long" : "short" }, L);
    const eM = fmt(end, { month: L === "fr" ? "long" : "short" }, L);
    if (start.getMonth() === end.getMonth()) {
      return L === "fr"
        ? `${start.getDate()} – ${end.getDate()} ${sM} ${y}`
        : `${sM} ${start.getDate()} – ${end.getDate()}, ${y}`;
    }
    return L === "fr"
      ? `${start.getDate()} ${sM} – ${end.getDate()} ${eM} ${y}`
      : `${sM} ${start.getDate()} – ${eM} ${end.getDate()}, ${y}`;
  };

  // "May 2026" / "mai 2026"
  const monthYear = (d, l) => {
    const x = d || now();
    const s = fmt(x, { month: "long", year: "numeric" }, l);
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  // "Saturday, June 28, 2026" / "samedi 28 juin 2026"
  const longDate = (d, l) =>
    fmt(d || now(), { weekday: "long", day: "numeric", month: "long", year: "numeric" }, l);

  // "14:32"  (24h FR, 24h EN here too for a planning tool)
  const time = (d, l) =>
    fmt(d || now(), { hour: "2-digit", minute: "2-digit", hour12: false }, l);

  // Time-of-day greeting, localized + named.
  const greeting = (l, name) => {
    const L = l || lang();
    const h = now().getHours();
    let key;
    if (h < 12) key = L === "fr" ? "Bonjour" : "Good morning";
    else if (h < 18) key = L === "fr" ? "Bon après-midi" : "Good afternoon";
    else key = L === "fr" ? "Bonsoir" : "Good evening";
    const nm = (name || "").trim();
    return nm ? `${key}, ${nm}` : key;
  };

  // Relative-day label for task chips etc. ("Today/Tomorrow/Mon 30").
  const relDay = (d, l) => {
    const L = l || lang();
    const t = today();
    const target = atMidnight(d);
    const diff = Math.round((target - t) / 86400000);
    if (diff === 0) return L === "fr" ? "Aujourd'hui" : "Today";
    if (diff === 1) return L === "fr" ? "Demain" : "Tomorrow";
    if (diff === -1) return L === "fr" ? "Hier" : "Yesterday";
    if (diff > 1 && diff < 7) return fmt(target, { weekday: "long" }, L);
    return fmt(target, { weekday: "short", day: "numeric", month: "short" }, L);
  };

  window.DPMDate = {
    lang, now, today, atMidnight, addDays, sameDay,
    weekStart, isoWeek, weekDays, weekRangeLabel,
    monthYear, longDate, time, greeting, relDay, fmt,
  };
})();
