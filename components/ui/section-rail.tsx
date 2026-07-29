"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";

const SECTIONS = [
  { id: "sec-systemes", fr: "Systèmes", en: "Systems" },
  { id: "sec-stack", fr: "Stack", en: "Stack" },
  { id: "sec-parcours", fr: "Parcours", en: "Path" },
  { id: "sec-temoignages", fr: "Témoignages", en: "Testimonials" },
  { id: "sec-contact", fr: "Contact", en: "Contact" },
];

/** Fixed vertical section rail (RCG.SYS) with scroll-spy. Home page only. */
export function SectionRail() {
  const fr = useLocale() === "fr";
  const [active, setActive] = useState("");

  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(
      (e): e is HTMLElement => !!e,
    );
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <nav
      aria-label="Sections"
      className="fixed left-4 top-1/2 z-[105] hidden -translate-y-1/2 flex-col gap-0.5 lg:flex print:hidden"
    >
      {SECTIONS.map((s, i) => {
        const on = active === s.id;
        return (
          <button
            key={s.id}
            type="button"
            onClick={() =>
              document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth", block: "start" })
            }
            aria-label={fr ? s.fr : s.en}
            aria-current={on ? "true" : undefined}
            className="group flex items-center gap-2.5 py-1.5"
          >
            <span
              className={`h-px transition-all duration-500 ${
                on
                  ? "w-7 bg-accent"
                  : "w-3.5 bg-border-strong group-hover:w-6 group-hover:bg-foreground"
              }`}
            />
            <span
              className={`font-mono text-[9.5px] tracking-widest transition-colors ${
                on ? "text-accent" : "text-muted-foreground group-hover:text-foreground"
              }`}
            >
              0{i + 1}
            </span>
            <span
              className={`font-mono text-[10px] opacity-0 transition-opacity group-hover:opacity-100 ${
                on ? "text-accent" : "text-muted-foreground group-hover:text-foreground"
              }`}
            >
              {fr ? s.fr : s.en}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
