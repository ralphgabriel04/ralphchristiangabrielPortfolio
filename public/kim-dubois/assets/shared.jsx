/* Helpers partagés : monogramme KD, zone photo, apparition au scroll */
const { useState, useEffect, useRef, useCallback } = React;

// Monogramme « KD » dans un fin cercle doré
function Monogram({ size = 44, spin = false, stroke = 1.4, dash = false }) {
  const r = size / 2 - stroke;
  return (
    <span className={"kd-mono" + (spin ? " kd-mono--spin" : "")} aria-hidden="true">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size/2} cy={size/2} r={r} strokeWidth={stroke} />
        {dash && (
          <circle className="kd-ring-dash" cx={size/2} cy={size/2} r={r - 4} strokeWidth={stroke * 0.8} />
        )}
        <text x="50%" y="52%" dominantBaseline="central" textAnchor="middle"
              fontSize={size * 0.42} letterSpacing="0.5">KD</text>
      </svg>
    </span>
  );
}

// Zone photo de substitution : aplat studio + monogramme + libellé de zone
// (Marqueur <!-- ZONE PHOTO --> pour brancher les vraies images de Kim)
function PhotoZone({ color, label, alt, monoSize = 56, className = "", style = {} }) {
  return (
    <figure
      className={"photo-zone " + className}
      style={{ "--studio-color": color, ...style }}
      role="img"
      aria-label={alt}
    >
      {/* ZONE PHOTO : remplacer par la vraie image — alt = description FR */}
      <span className="pz-mono"><Monogram size={monoSize} stroke={1.2} /></span>
      {label && <figcaption className="pz-label">{label}</figcaption>}
    </figure>
  );
}

// Apparition au scroll via IntersectionObserver
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal:not(.in)");
    if (!("IntersectionObserver" in window) || els.length === 0) {
      els.forEach((e) => e.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  });
}

Object.assign(window, { Monogram, PhotoZone, useReveal });
