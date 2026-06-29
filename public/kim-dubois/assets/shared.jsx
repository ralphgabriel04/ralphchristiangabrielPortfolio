/* Helpers partagés : monogramme KD, zone photo, apparition au scroll */
const { useState, useEffect, useRef, useCallback } = React;

// Logo officiel KD (oreilles + KD) — vraie marque de Kim, rendu en <img> (robuste).
// Couleur pilotée par filtre selon le thème : noir en clair, blanc en sombre.
// `size` = hauteur en px. Props spin/dash/stroke ignorées (compat).
function Monogram({ size = 44, className = "" }) {
  return (
    <img
      className={"kd-logo " + className}
      src="assets/photos/logo-mark.png"
      alt=""
      aria-hidden="true"
      style={{ height: size, width: "auto" }}
    />
  );
}

// Zone photo : vraie image si `src` fourni, sinon aplat studio + monogramme (placeholder)
// (Marqueur <!-- ZONE PHOTO --> pour brancher les vraies images de Kim)
function PhotoZone({ color, label, alt, src, monoSize = 56, className = "", style = {}, fit = "cover", pos = "center" }) {
  return (
    <figure
      className={"photo-zone " + (src ? "has-img " : "") + className}
      style={{ "--studio-color": color, ...style }}
      role="img"
      aria-label={alt}
    >
      {src ? (
        <img className="pz-img" src={src} alt={alt} loading="eager" decoding="async"
             style={{ objectFit: fit, objectPosition: pos }} />
      ) : (
        <span className="pz-mono"><Monogram size={monoSize} stroke={1.2} /></span>
      )}
      {label && <figcaption className="pz-label">{label}</figcaption>}
    </figure>
  );
}

// Apparition au scroll — pilotée par les réglages admin (data-anim*)
// Rejoue à chaque entrée dans le viewport si « rejouer » est actif.
function useReveal() {
  useEffect(() => {
    const root = document.documentElement;
    const animOn = root.getAttribute("data-anim") !== "off";
    if (!animOn || !("IntersectionObserver" in window)) {
      document.querySelectorAll(".reveal").forEach((e) => { e.classList.add("in"); e.setAttribute("data-rv", "in"); });
      return;
    }
    // On lit « replay » EN DIRECT dans le callback (et pas une seule fois au montage)
    // pour que le réglage admin prenne effet sans recharger.
    const io = new IntersectionObserver(
      (entries) => {
        const replay = root.getAttribute("data-anim-replay") === "on";
        entries.forEach((en) => {
          // On marque l'état « révélé » par un ATTRIBUT (en plus de la classe) :
          // React ne gère pas data-rv, donc un re-rendu (ex. ouverture d'une carte)
          // ne l'efface pas — l'élément ne disparaît plus. La classe seule serait
          // réécrite par React au prochain rendu.
          if (en.isIntersecting) { en.target.classList.add("in"); en.target.setAttribute("data-rv", "in"); }
          else if (replay) { en.target.classList.remove("in"); en.target.removeAttribute("data-rv"); }
        });
      },
      // threshold 0 + marge basse : l'élément se ré-arme dès qu'il quitte le
      // viewport par le haut OU par le bas → l'animation rejoue à chaque passage.
      { threshold: 0, rootMargin: "0px 0px -12% 0px" }
    );
    const observed = new WeakSet();
    const scan = () => document.querySelectorAll(".reveal").forEach((e) => {
      if (!observed.has(e)) { observed.add(e); io.observe(e); }
    });
    scan();
    // Re-scan quand l'ordre/visibilité des sections change.
    window.addEventListener("kd:relayout", scan);
    return () => { io.disconnect(); window.removeEventListener("kd:relayout", scan); };
  }, []);
}

Object.assign(window, { Monogram, PhotoZone, useReveal });
