"use client";

import { useEffect, useRef } from "react";
import { useLocale } from "next-intl";
import { usePlain } from "@/components/ui/plain-mode";

const GLYPHS = "<>/{}[]#$%&*+=—·";

/** Terminal role line `$ <role> ▍` that scramble-decodes to each new role
 *  (RCG.SYS effect), rotating every few seconds. Respects reduced-motion and
 *  swaps to plainer wording in simple mode. */
export function HeroRole() {
  const fr = useLocale() === "fr";
  const { plain } = usePlain();
  const ref = useRef<HTMLSpanElement>(null);
  const idx = useRef(0);

  const initialRole = plain
    ? fr
      ? "j'étudie le génie logiciel à l'ÉTS"
      : "I study software engineering at ÉTS"
    : fr
      ? "étudiant en génie logiciel @ ÉTS"
      : "software engineering student @ ÉTS";

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const roles = plain
      ? fr
        ? [
            "j'étudie le génie logiciel à l'ÉTS",
            "je conçois des sites et des applications",
            "j'analyse, je construis et j'explique",
            "bilingue français/anglais — Grand Montréal",
          ]
        : [
            "I study software engineering at ÉTS",
            "I design websites and applications",
            "I analyze, build and explain",
            "bilingual French/English — Greater Montréal",
          ]
      : fr
        ? [
            "étudiant en génie logiciel @ ÉTS",
            "analyse · architecture · web · mobile",
            "je transforme les besoins en produits utiles",
            "bilingue FR/EN — Grand Montréal",
          ]
        : [
            "software engineering student @ ÉTS",
            "analysis · architecture · web · mobile",
            "I turn needs into useful products",
            "bilingual FR/EN — Greater Montréal",
          ];

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
    el.textContent = roles[0] ?? "";
    const rotate = setInterval(() => {
      idx.current = (idx.current + 1) % roles.length;
      scramble(roles[idx.current] ?? "");
    }, 3200);

    return () => {
      if (scr) clearInterval(scr);
      clearInterval(rotate);
    };
  }, [fr, plain]);

  return (
    <div className="font-mono text-sm text-muted-foreground md:text-[15px]" aria-live="off">
      <span style={{ color: "var(--accent)" }}>$</span>{" "}
      <span ref={ref} suppressHydrationWarning>{initialRole}</span>
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
