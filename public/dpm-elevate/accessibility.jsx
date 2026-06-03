/* global React, useState, useEffect */

/* ============================================================
   P25 — AFFICHAGE VIF store (accessibility emphasis mode)

   Mirrors the spaces store pattern:
     window.__dpmVif            ← current on/off       · localStorage["dpm-affichage-vif"]
     dpm-vif-change             ← toggled
     useVif() → [on, setVif]
     window.__dpmSetVif(on)     ← imperative setter

   • Manual choice wins and is remembered.
   • If the user never chose, follow the OS `prefers-contrast: more`.
   • Applies the `vif` class on <html>; the heavy lifting is CSS (styles.css).
============================================================ */

const VIF_KEY = "dpm-affichage-vif";

function readVifPref() {
  try {
    const raw = localStorage.getItem(VIF_KEY);
    if (raw === "1") return true;
    if (raw === "0") return false;
  } catch (e) {}
  // no manual choice → honor the OS contrast preference
  try {
    if (window.matchMedia && window.matchMedia("(prefers-contrast: more)").matches) return true;
  } catch (e) {}
  return false;
}

function applyVif(on) {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("vif", !!on);
}

function setVif(on, persist) {
  window.__dpmVif = !!on;
  applyVif(on);
  if (persist !== false) { try { localStorage.setItem(VIF_KEY, on ? "1" : "0"); } catch (e) {} }
  window.dispatchEvent(new CustomEvent("dpm-vif-change", { detail: !!on }));
}

if (typeof window !== "undefined") {
  if (window.__dpmVif === undefined) window.__dpmVif = readVifPref();
  applyVif(window.__dpmVif);
  window.__dpmSetVif = setVif;

  // React to OS contrast changes only while the user hasn't made a manual choice.
  try {
    const mq = window.matchMedia("(prefers-contrast: more)");
    const onChange = (e) => {
      let manual = null;
      try { manual = localStorage.getItem(VIF_KEY); } catch (err) {}
      if (manual !== "1" && manual !== "0") setVif(e.matches, false);
    };
    if (mq.addEventListener) mq.addEventListener("change", onChange);
    else if (mq.addListener) mq.addListener(onChange);
  } catch (e) {}
}

function useVif() {
  const [on, setOn] = useState(typeof window !== "undefined" ? !!window.__dpmVif : false);
  useEffect(() => {
    const h = (e) => setOn(!!e.detail);
    window.addEventListener("dpm-vif-change", h);
    return () => window.removeEventListener("dpm-vif-change", h);
  }, []);
  return [on, (v) => setVif(v, true)];
}

if (typeof window !== "undefined") {
  Object.assign(window, { useVif });
}
