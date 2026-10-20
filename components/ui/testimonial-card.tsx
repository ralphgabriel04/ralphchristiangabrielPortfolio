"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { type Testimonial, categoryLabels } from "@/lib/testimonials";
import { Link } from "@/i18n/navigation";

interface TestimonialCardProps {
  testimonial: Testimonial;
  locale: "fr" | "en";
  dense?: boolean;
  expanded?: boolean;
  onHoverStart?: () => void;
  onHoverEnd?: () => void;
  /** Click/keyboard alternative to hover (touch screens, keyboard users). */
  onToggle?: () => void;
}

export function TestimonialCard({
  testimonial,
  locale,
  dense,
  expanded,
  onHoverStart,
  onHoverEnd,
  onToggle,
}: TestimonialCardProps) {
  const t = testimonial;
  const catLabel = categoryLabels[locale][t.category];
  const initials = t.name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const isClient = t.category === "client";

  const [isClamped, setIsClamped] = useState(false);
  const quoteRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = quoteRef.current;
    if (!el || !dense) return;
    setIsClamped(el.scrollHeight > el.clientHeight + 2);
  }, [dense, locale]);

  return (
    <article
      className={`group relative flex flex-col rounded-2xl border border-border-color bg-background shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_18px_40px_-20px_rgba(15,23,42,0.14)] hover:border-border-strong h-full ${dense ? "p-7" : "p-8"}`}
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
    >
      {/* Serif quote glyph */}
      <span
        aria-hidden="true"
        className="text-[40px] leading-none text-accent/25 select-none"
        style={{ fontFamily: "var(--font-instrument-serif), 'Georgia', serif" }}
      >
        &ldquo;
      </span>

      {/* Quote text — expands on hover */}
      <p
        ref={quoteRef}
        // No flex-1 when clamped: a stretched box would show a 6th, half-cut line.
        className={`mt-2 ${dense ? "" : "flex-1"} text-[15px] leading-[1.65] text-muted-foreground transition-all duration-300 ${
          dense && !expanded ? "line-clamp-5" : ""
        } ${dense ? "" : "md:text-[15.5px]"}`}
      >
        {t.quote[locale]}
      </p>

      {/* "Lire la suite": a real button, so it works by touch and keyboard too */}
      {dense && isClamped && onToggle && (
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={!!expanded}
          className="mt-2 self-start text-[13px] font-medium text-accent underline-offset-4 hover:underline"
        >
          {expanded
            ? locale === "fr" ? "Réduire" : "Show less"
            : locale === "fr" ? "Lire la suite" : "Read more"}
        </button>
      )}

      {/* Separator: a 1px rule (a 1px div with padding painted a 21px grey bar) */}
      <div className="mt-auto pt-5">
        <div className="h-px w-full bg-border-color" />
      </div>

      {/* Author row */}
      <div className="mt-5 flex items-center gap-3">
        {t.avatar ? (
          <Image
            src={t.avatar}
            alt={t.name}
            width={40}
            height={40}
            className="h-10 w-10 rounded-full object-cover ring-1 ring-border-color shrink-0"
            loading="lazy"
          />
        ) : (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted ring-1 ring-border-color">
            <span className="text-[12.5px] font-medium tracking-tight text-muted-foreground">
              {initials}
            </span>
          </div>
        )}

        <div className="min-w-0 flex-1">
          <p className="text-[14px] font-semibold leading-snug">{t.name}</p>
          {t.projectLink ? (
            <Link
              href={`/projects/${t.projectLink}`}
              className="line-clamp-2 block text-[12.5px] text-accent hover:underline"
            >
              {t.role[locale]}
            </Link>
          ) : (
            <p className="line-clamp-2 text-[12.5px] text-muted-foreground">
              {t.role[locale]}
            </p>
          )}
        </div>

        <span
          className={`shrink-0 inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium ring-1 ring-inset ${
            isClient
              ? "bg-accent/10 text-accent ring-accent/20"
              : "bg-muted text-muted-foreground ring-border-color"
          }`}
        >
          {catLabel}
        </span>
      </div>
    </article>
  );
}
