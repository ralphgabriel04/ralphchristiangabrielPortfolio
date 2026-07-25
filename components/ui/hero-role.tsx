"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";

/** Terminal-style rotating role line: `$ <role> ▍`. */
export function HeroRole() {
  const fr = useLocale() === "fr";
  const roles = fr
    ? [
        "dev full-stack junior/intermédiaire",
        "React · Next.js · TypeScript",
        "Java · Spring · PostgreSQL",
        "bilingue FR/EN · Grand Montréal",
      ]
    : [
        "junior/intermediate full-stack dev",
        "React · Next.js · TypeScript",
        "Java · Spring · PostgreSQL",
        "bilingual FR/EN · Greater Montréal",
      ];
  const [i, setI] = useState(0);
  const [show, setShow] = useState(true);

  useEffect(() => {
    const t = setInterval(() => {
      setShow(false);
      const s = setTimeout(() => {
        setI((v) => (v + 1) % roles.length);
        setShow(true);
      }, 220);
      return () => clearTimeout(s);
    }, 3000);
    return () => clearInterval(t);
  }, [roles.length]);

  return (
    <div className="font-mono text-sm text-muted-foreground md:text-[15px]" aria-live="off">
      <span style={{ color: "var(--accent)" }}>$</span>{" "}
      <span style={{ opacity: show ? 1 : 0, transition: "opacity .2s ease" }}>{roles[i]}</span>
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
