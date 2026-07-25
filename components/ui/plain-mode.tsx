"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { lexicon } from "@/lib/plain";

const Ctx = createContext<{ plain: boolean; toggle: () => void }>({
  plain: false,
  toggle: () => {},
});

export function PlainModeProvider({ children }: { children: React.ReactNode }) {
  const [plain, setPlain] = useState(false);
  useEffect(() => {
    try {
      if (localStorage.getItem("rg-plain") === "1") setPlain(true);
    } catch {}
  }, []);
  const toggle = () =>
    setPlain((p) => {
      const n = !p;
      try {
        localStorage.setItem("rg-plain", n ? "1" : "0");
      } catch {}
      return n;
    });
  return <Ctx.Provider value={{ plain, toggle }}>{children}</Ctx.Provider>;
}

export const usePlain = () => useContext(Ctx);

/** Header toggle ◍ — plain vs technical language. */
export function PlainToggle({ className = "" }: { className?: string }) {
  const { plain, toggle } = usePlain();
  const fr = useLocale() === "fr";
  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={plain}
      title={fr ? "Langage simple / technique" : "Plain / technical language"}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-xs transition-colors ${
        plain
          ? "border-accent text-accent"
          : "border-border-strong text-muted-foreground hover:border-accent hover:text-accent"
      } ${className}`}
    >
      <span aria-hidden="true">◍</span>
      <span className="hidden 2xl:inline">{fr ? "Simple" : "Plain"}</span>
    </button>
  );
}

/** Small hero banner shown when plain mode is on. */
export function PlainBanner() {
  const { plain } = usePlain();
  const fr = useLocale() === "fr";
  if (!plain) return null;
  return (
    <div className="flex items-center gap-2 border-l-2 border-accent pl-3 font-mono text-xs text-accent">
      <span aria-hidden="true">◍</span>
      {fr
        ? "Mode langage simple — jargon expliqué dans le lexique en bas de page."
        : "Plain-language mode — jargon explained in the glossary near the bottom."}
    </div>
  );
}

/** Glossary section — only rendered in plain mode. */
export function Lexicon() {
  const { plain } = usePlain();
  const fr = useLocale() === "fr";
  if (!plain) return null;
  return (
    <section className="border-t border-border-color">
      <div className="mx-auto max-w-[var(--max-content)] px-[var(--page-pad)] py-12">
        <div className="rounded-2xl border border-dashed border-border-strong bg-muted/40 p-6 md:p-8">
          <div className="flex flex-wrap items-baseline gap-3">
            <span className="font-mono text-[11.5px] uppercase tracking-[0.14em] text-accent">
              ◍ {fr ? "Lexique" : "Glossary"}
            </span>
            <span className="font-mono text-[11px] text-muted-foreground">
              {fr ? "le jargon, en clair" : "the jargon, in plain words"}
            </span>
          </div>
          <dl className="mt-5 grid gap-x-8 gap-y-4 sm:grid-cols-2">
            {lexicon.map((g) => (
              <div key={g.term} className="flex flex-col gap-1">
                <dt className="font-mono text-[12.5px] text-foreground">{g.term}</dt>
                <dd className="m-0 text-[13px] leading-relaxed text-muted-foreground">
                  {g.def[fr ? "fr" : "en"]}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
