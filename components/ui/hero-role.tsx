"use client";

import { useEffect, useRef } from "react";
import { useLocale } from "next-intl";

const GLYPHS = "<>/{}[]#$%&*+=—·";

// Deduplicated rotating phrases for the terminal role line. Kept as short
// mono-friendly lines; order = first appearance.
const FR_ROLES = [
  "étudiant en génie logiciel @ ÉTS",
  "passion · polyvalence · écoute",
  "comprendre · concevoir · construire",
  "systèmes · web · mobile",
  "bilingue FR/EN · Grand Montréal",
  "collaboration · disponibilité · confiance",
  "rigueur · qualité · fiabilité",
  "apprendre · progresser · partager",
  "projets personnels · mandats · cofondateur",
  "besoins réels · solutions concrètes",
  "du besoin au déploiement",
  "écouter avant de développer",
  "architecture · produit · expérience",
  "technique · humain · concret",
  "construire · tester · améliorer",
  "faire simple · faire utile",
  "concevoir pour durer",
  "autonome · collaboratif · fiable",
  "expliquer chaque décision",
];

const EN_ROLES = [
  "software engineering student @ ÉTS",
  "passion · versatility · listening",
  "understand · design · build",
  "systems · web · mobile",
  "bilingual FR/EN · Greater Montréal",
  "collaboration · availability · trust",
  "rigor · quality · reliability",
  "learn · grow · share",
  "personal projects · client work · co-founder",
  "real needs · concrete solutions",
  "from need to deployment",
  "listen before building",
  "architecture · product · experience",
  "technical · human · concrete",
  "build · test · improve",
  "keep it simple · make it useful",
  "design to last",
  "autonomous · collaborative · reliable",
  "explain every decision",
];

/** Terminal role line `$ <phrase> ▍` that scramble-decodes to each new phrase
 *  (RCG.SYS effect), rotating every few seconds. Respects reduced-motion. */
export function HeroRole() {
  const fr = useLocale() === "fr";
  const ref = useRef<HTMLSpanElement>(null);
  const idx = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const roles = fr ? FR_ROLES : EN_ROLES;

    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      el.textContent = roles[0] ?? "";
      return;
    }

    let scr: ReturnType<typeof setInterval> | undefined;
    const scramble = (final: string) => {
      let f = 0;
      const total = 16;
      if (scr) clearInterval(scr);
      scr = setInterval(() => {
        f++;
        const n = Math.floor((final.length * f) / total);
        let out = final.slice(0, n);
        for (let i = n; i < final.length; i++) {
          out += final[i] === " " ? " " : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }
        el.textContent = out;
        if (f >= total) {
          if (scr) clearInterval(scr);
          el.textContent = final;
        }
      }, 34);
    };

    idx.current = 0;
    scramble(roles[0] ?? "");
    const rotate = setInterval(() => {
      idx.current = (idx.current + 1) % roles.length;
      scramble(roles[idx.current] ?? "");
    }, 3200);

    return () => {
      if (scr) clearInterval(scr);
      clearInterval(rotate);
    };
  }, [fr]);

  return (
    <div className="font-mono text-sm text-muted-foreground md:text-[15px]" aria-live="off">
      <span style={{ color: "var(--accent)" }}>$</span>{" "}
      <span ref={ref} suppressHydrationWarning />
      <span
        className="ml-0.5 inline-block motion-safe:animate-[caret_1.1s_steps(1)_infinite]"
        style={{ color: "var(--accent)" }}
        aria-hidden="true"
      >
        ▍
      </span>
    </div>
  );
}
