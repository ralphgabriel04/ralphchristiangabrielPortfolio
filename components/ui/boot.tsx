"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";

/** RCG.SYS boot sequence — shown once per session on the home visit, skippable,
 *  skipped entirely under reduced-motion. */
export function Boot() {
  const fr = useLocale() === "fr";
  const [show, setShow] = useState(false);

  useEffect(() => {
    let seen = false;
    try {
      seen = !!sessionStorage.getItem("rg-boot");
    } catch {}
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const automated = typeof navigator !== "undefined" && navigator.webdriver;
    if (seen || reduce || automated) return;
    setShow(true);
    try {
      sessionStorage.setItem("rg-boot", "1");
    } catch {}
    const t = setTimeout(() => setShow(false), 2000);
    const dismiss = () => setShow(false);
    window.addEventListener("keydown", dismiss);
    window.addEventListener("pointerdown", dismiss);
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", dismiss);
      window.removeEventListener("pointerdown", dismiss);
    };
  }, []);

  if (!show) return null;
  const L = (a: string, b: string) => (fr ? a : b);
  const line = "opacity-0 motion-safe:animate-[rg-fade_.3s_forwards]";
  const ok = { color: "var(--shipped)" };

  return (
    <div
      onClick={() => setShow(false)}
      className="fixed inset-0 z-[200] flex cursor-pointer items-center justify-center bg-background"
      role="status"
      aria-label="RCG.SYS boot"
    >
      <div className="flex min-w-[min(420px,84vw)] flex-col gap-2.5 font-mono text-[13px] text-muted-foreground">
        <div className="mb-1.5 flex items-baseline gap-2.5">
          <span className="text-xl font-medium" style={{ color: "var(--accent)" }}>RCG</span>
          <span className="text-muted-foreground/60">.SYS v2.0</span>
        </div>
        <div className={line} style={{ animationDelay: ".15s" }}>
          &gt; init noyau … <span style={ok}>ok</span>
        </div>
        <div className={line} style={{ animationDelay: ".45s" }}>
          &gt; modules : {L("projets · parcours · terminal", "projects · path · terminal")} … <span style={ok}>ok</span>
        </div>
        <div className={line} style={{ animationDelay: ".75s" }}>
          &gt; locale FR/EN · {L("thème", "theme")} … <span style={ok}>ok</span>
        </div>
        <div className={line} style={{ animationDelay: "1.05s", color: "var(--foreground)" }}>
          &gt; {L("système en ligne", "system online")}
          <span className="motion-safe:animate-[caret_1s_steps(1)_infinite]">_</span>
        </div>
        <div className="mt-2 h-0.5 overflow-hidden rounded-sm bg-border-color">
          <div
            className="h-full origin-left motion-safe:animate-[rg-bar_1.4s_cubic-bezier(.16,1,.3,1)_forwards]"
            style={{ background: "var(--accent)" }}
          />
        </div>
        <div className="text-[10.5px] uppercase tracking-wider text-muted-foreground/60">
          {L("cliquer pour passer", "click to skip")}
        </div>
      </div>
    </div>
  );
}
