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

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const roles = plain
      ? fr
        ? [
            "je construis des sites et des applications",
            "étudiant en génie logiciel à l'ÉTS",
            "je conçois, je livre, et j'explique simplement",
            "bilingue français/anglais — Grand Montréal",
          ]
        : [
            "I build websites and applications",
            "software engineering student at ÉTS",
            "I design, I deliver, and I explain simply",
            "bilingual French/English — Greater Montréal",
          ]
      : fr
        ? [
            "dev full-stack — React · Next.js · Java",
            "étudiant en génie logiciel @ ÉTS",
            "je conçois, je livre, j'explique",
            "bilingue FR/EN — Grand Montréal",
          ]
        : [
            "full-stack dev — React · Next.js · Java",
            "software engineering student @ ÉTS",
            "I design, I ship, I explain",
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
    scramble(roles[0] ?? "");
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
