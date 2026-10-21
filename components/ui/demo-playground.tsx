"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, ArrowUpRight, Clock, Keyboard, Monitor, Play, Smartphone } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { Demo } from "@/lib/demos";

type Labels = {
  choose: string;
  launch: string;
  frameTitle: string;
  open: string;
  caseStudy: string;
  tryThis: string;
  mobile: string;
  desktop: string;
  minutes: string;
  keyboard: string;
  keyboardHint: string;
};

/**
 * Demo playground: one tab per prototype, a poster with a launch button, then the
 * prototype itself in a same-origin iframe. Nothing heavy loads before the visitor
 * clicks. The URL hash (#wise-wealthy) preselects a demo, so case studies can link here.
 */
export function DemoPlayground({ demos, locale, labels }: { demos: Demo[]; locale: string; labels: Labels }) {
  const lang = locale === "fr" ? "fr" : "en";
  const [index, setIndex] = useState(0);
  const [launched, setLaunched] = useState<Record<string, boolean>>({});
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const fromHash = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      const i = demos.findIndex((d) => d.id === id);
      if (i >= 0) setIndex(i);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, [demos]);

  const select = useCallback(
    (i: number, focus = false) => {
      const n = (i + demos.length) % demos.length;
      setIndex(n);
      window.history.replaceState(null, "", `#${demos[n]!.id}`);
      if (focus) tabsRef.current[n]?.focus();
    },
    [demos],
  );

  const d = demos[index] ?? demos[0]!;
  const on = !!launched[d.id];
  const DeviceIcon = d.device === "mobile" ? Smartphone : Monitor;

  return (
    <div>
      {/* Tabs (WAI-ARIA pattern: arrows move, Home / End jump) */}
      <div role="tablist" aria-label={labels.choose} className="flex flex-wrap gap-2">
        {demos.map((x, i) => (
          <button
            key={x.id}
            ref={(el) => {
              tabsRef.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`tab-${x.id}`}
            aria-selected={i === index}
            aria-controls="demo-panel"
            tabIndex={i === index ? 0 : -1}
            onClick={() => select(i)}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight") { e.preventDefault(); select(i + 1, true); }
              else if (e.key === "ArrowLeft") { e.preventDefault(); select(i - 1, true); }
              else if (e.key === "Home") { e.preventDefault(); select(0, true); }
              else if (e.key === "End") { e.preventDefault(); select(demos.length - 1, true); }
            }}
            className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
              i === index
                ? "border-foreground bg-foreground text-background"
                : "border-border-color text-muted-foreground hover:border-border-strong hover:text-foreground"
            }`}
          >
            {x.name}
          </button>
        ))}
      </div>

      <div
        id="demo-panel"
        role="tabpanel"
        aria-labelledby={`tab-${d.id}`}
        className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-8"
      >
        {/* Frame */}
        <div className="overflow-hidden rounded-2xl border border-border-color bg-muted shadow-md">
          <div className="flex items-center gap-3 border-b border-border-color px-4 py-2.5">
            <span className="flex gap-1.5" aria-hidden="true">
              <span className="h-2.5 w-2.5 rounded-full bg-border-strong" />
              <span className="h-2.5 w-2.5 rounded-full bg-border-strong" />
              <span className="h-2.5 w-2.5 rounded-full bg-border-strong" />
            </span>
            <span className="min-w-0 flex-1 truncate font-mono text-[12px] text-muted-foreground">rcgabriel.dev{d.src}</span>
            <a
              href={d.src}
              target="_blank"
              rel="noreferrer"
              className="inline-flex shrink-0 items-center gap-1 text-[12.5px] font-medium text-foreground hover:text-accent"
            >
              {labels.open} <ArrowUpRight size={13} aria-hidden="true" />
            </a>
          </div>
          <div className={`relative bg-muted-2 ${d.device === "mobile" ? "h-[600px] md:h-[780px]" : "h-[520px] md:h-[640px]"}`}>
            {on ? (
              <iframe
                key={d.id}
                src={d.src}
                title={`${labels.frameTitle} : ${d.name}`}
                className="h-full w-full border-0"
                allow="fullscreen"
              />
            ) : (
              <button
                type="button"
                onClick={() => setLaunched((m) => ({ ...m, [d.id]: true }))}
                className="group absolute inset-0 block w-full"
                aria-label={`${labels.launch} : ${d.name}`}
              >
                <Image
                  src={d.poster}
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 100vw, 760px"
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.01] motion-reduce:transition-none"
                />
                <span className="absolute inset-0 bg-background/35 transition-colors group-hover:bg-background/20" aria-hidden="true" />
                <span className="absolute left-1/2 top-1/2 inline-flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background shadow-lg transition-transform group-hover:scale-105 motion-reduce:transition-none">
                  <Play size={16} aria-hidden="true" /> {labels.launch}
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Guide */}
        <aside className="flex flex-col">
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{d.kind[lang]}</span>
          <h2
            className="mt-2 text-3xl leading-[1.05] tracking-[-0.01em]"
            style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}
          >
            {d.name}
          </h2>
          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 font-mono text-[12px] text-muted-foreground">
            <li className="inline-flex items-center gap-1.5">
              <DeviceIcon size={13} aria-hidden="true" /> {d.device === "mobile" ? labels.mobile : labels.desktop}
            </li>
            <li className="inline-flex items-center gap-1.5">
              <Clock size={13} aria-hidden="true" /> {d.minutes} {labels.minutes}
            </li>
            {d.keyboard && (
              <li className="inline-flex items-center gap-1.5">
                <Keyboard size={13} aria-hidden="true" /> {labels.keyboard}
              </li>
            )}
          </ul>

          <h3 className="mt-6 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{labels.tryThis}</h3>
          <ol className="mt-3 flex flex-col gap-3">
            {d.steps[lang].map((s, i) => (
              <li key={i} className="flex gap-3 text-[15px] leading-relaxed">
                <span className="mt-0.5 font-mono text-[12px] text-accent">{String(i + 1).padStart(2, "0")}</span>
                <span>{s}</span>
              </li>
            ))}
          </ol>
          {d.keyboard && <p className="mt-3 text-[13.5px] text-muted-foreground">{labels.keyboardHint}</p>}
          <p className="mt-4 border-l-2 border-border-strong pl-3 text-[13.5px] leading-relaxed text-muted-foreground">{d.note[lang]}</p>

          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border-color pt-5 text-sm font-semibold">
            {!on && (
              <button
                type="button"
                onClick={() => setLaunched((m) => ({ ...m, [d.id]: true }))}
                className="inline-flex items-center gap-1.5 text-accent hover:underline"
              >
                <Play size={14} aria-hidden="true" /> {labels.launch}
              </button>
            )}
            <Link href={`/projects/${d.id}`} className="inline-flex items-center gap-1 text-foreground hover:text-accent">
              {labels.caseStudy} <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
