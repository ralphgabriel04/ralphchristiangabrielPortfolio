"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Pause, Play } from "lucide-react";

type L10n = { fr: string; en: string };
type Slide = { src: string; caption: L10n; alt: L10n; position?: string };

const LA_CAISSE: L10n = { fr: "La Caisse · Montréal · oct. 2026", en: "La Caisse · Montréal · Oct. 2026" };
const STUDIO: L10n = { fr: "RCG.SYS · Montréal", en: "RCG.SYS · Montréal" };

/**
 * Hero portraits: the La Caisse photos (headquarters, Oct. 2026) alternate with the studio
 * portraits (Jan. 2025). Only portraits of Ralph: the building shot crops the logo in this
 * frame, and the cohort photo is a large group. The striped La Caisse headshot is kept for
 * the contact block, so no photo appears twice on the home page.
 */
const SLIDES: Slide[] = [
  {
    src: "/images/gallery/la-caisse-portrait-2026.jpg",
    position: "50% 12%",
    caption: LA_CAISSE,
    alt: {
      fr: "Ralph Christian Gabriel en blazer gris, dans l'atrium du siège de La Caisse à Montréal",
      en: "Ralph Christian Gabriel in a grey blazer, in the atrium of La Caisse headquarters in Montréal",
    },
  },
  {
    src: "/images/ralph-gabriel-1.png",
    caption: STUDIO,
    alt: {
      fr: "Portrait studio de Ralph Christian Gabriel, chandail gris, fond sombre",
      en: "Studio portrait of Ralph Christian Gabriel, grey sweater, dark background",
    },
  },
  {
    src: "/images/experience/la-caisse-ralph-atrium.jpg",
    caption: LA_CAISSE,
    alt: {
      fr: "Ralph Christian Gabriel souriant, appuyé à la rampe de l'atrium de La Caisse",
      en: "Ralph Christian Gabriel smiling, leaning on the railing of the La Caisse atrium",
    },
  },
  {
    src: "/images/ralph-gabriel-3.png",
    caption: STUDIO,
    alt: {
      fr: "Portrait studio de Ralph Christian Gabriel, bras croisés",
      en: "Studio portrait of Ralph Christian Gabriel, arms crossed",
    },
  },
  {
    src: "/images/gallery/la-caisse-atrium-sourire-2026.jpg",
    caption: LA_CAISSE,
    alt: {
      fr: "Ralph Christian Gabriel souriant dans l'atrium vitré de La Caisse",
      en: "Ralph Christian Gabriel smiling in the glass atrium of La Caisse",
    },
  },
  {
    src: "/images/ralph-gabriel-2.png",
    caption: STUDIO,
    alt: {
      fr: "Portrait studio de Ralph Christian Gabriel, de trois quarts",
      en: "Studio portrait of Ralph Christian Gabriel, three-quarter view",
    },
  },
];

const INTERVAL_MS = 4500;

/**
 * Crossfading portrait carousel for the home hero. Rotation stops while the pointer or the
 * keyboard focus is on it, when the visitor presses pause, and entirely for visitors who ask
 * the OS to reduce motion (WCAG 2.2.2). Controls are 24 px targets (WCAG 2.5.8).
 */
export function HeroPortrait({
  locale,
  labels,
}: {
  locale: string;
  labels: { pause: string; play: string; show: string; group: string };
}) {
  const lang = locale === "fr" ? "fr" : "en";
  const [active, setActive] = useState(0);
  // Caption index lags the photo by half the crossfade, so text and picture change together.
  const [shown, setShown] = useState(0);
  const [paused, setPaused] = useState(false);
  const [holding, setHolding] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const rotating = !paused && !holding && !reduced;

  useEffect(() => {
    if (!rotating) return;
    const id = window.setInterval(() => setActive((i) => (i + 1) % SLIDES.length), INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [rotating]);

  useEffect(() => {
    const id = window.setTimeout(() => setShown(active), 600);
    return () => window.clearTimeout(id);
  }, [active]);

  const slide = SLIDES[shown] ?? SLIDES[0]!;

  return (
    <div
      role="group"
      aria-roledescription={lang === "fr" ? "carrousel" : "carousel"}
      aria-label={labels.group}
      onMouseEnter={() => setHolding(true)}
      onMouseLeave={() => setHolding(false)}
      onFocus={() => setHolding(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setHolding(false);
      }}
    >
      <figure className="relative overflow-hidden rounded-2xl border border-border-color bg-muted-2 shadow-md">
        <div className="relative aspect-[20/21] w-full">
          {SLIDES.map((s, i) => (
            <Image
              key={s.src}
              src={s.src}
              alt={i === active ? s.alt[lang] : ""}
              aria-hidden={i === active ? undefined : true}
              fill
              sizes="300px"
              priority={i === 0}
              style={s.position ? { objectPosition: s.position } : undefined}
              className={`object-cover transition-opacity duration-[1200ms] ease-in-out motion-reduce:transition-none ${
                i === active ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
        </div>
        <figcaption className="absolute inset-x-0 bottom-0 flex items-center px-3 py-2.5 font-mono text-[11px] text-foreground dark:bg-gradient-to-t dark:from-background/90 dark:to-transparent">
          {/* Light theme: compact chip (no wash-out fade). Dark: gradient. Announced only when the rotation is stopped. */}
          <span
            aria-live={rotating ? "off" : "polite"}
            className="inline-flex items-center gap-2 rounded-md bg-background/80 px-2 py-1 shadow-sm backdrop-blur-sm dark:bg-transparent dark:p-0 dark:shadow-none dark:backdrop-blur-none"
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--shipped)" }} />
            {slide.caption[lang]}
          </span>
        </figcaption>
      </figure>

      {/* One dot per photo, then pause / play */}
      <div className="mt-2 flex items-center justify-center">
        {SLIDES.map((s, i) => (
          <button
            key={s.src}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`${labels.show} ${i + 1} / ${SLIDES.length} : ${s.caption[lang]}`}
            aria-current={i === active ? "true" : undefined}
            className="group inline-flex h-6 w-6 items-center justify-center rounded-full"
          >
            <span
              className={`h-1.5 rounded-full transition-all duration-300 motion-reduce:transition-none ${
                i === active ? "w-4 bg-accent" : "w-1.5 bg-border-strong group-hover:bg-muted-foreground"
              }`}
            />
          </button>
        ))}
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-label={paused ? labels.play : labels.pause}
          aria-pressed={paused}
          className="ml-1 inline-flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground"
        >
          {paused ? <Play size={12} aria-hidden="true" /> : <Pause size={12} aria-hidden="true" />}
        </button>
      </div>
    </div>
  );
}
