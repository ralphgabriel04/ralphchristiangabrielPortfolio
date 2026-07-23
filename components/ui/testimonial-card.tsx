"use client";

import { useRef, useEffect, useState } from "react";
import { type Testimonial, categoryLabels } from "@/lib/testimonials";
import { Link } from "@/i18n/navigation";

interface TestimonialCardProps {
  testimonial: Testimonial;
  locale: "fr" | "en";
  dense?: boolean;
  expanded?: boolean;
  onHoverStart?: () => void;
  onHoverEnd?: () => void;
}

export function TestimonialCard({
  testimonial,
  locale,
  dense,
  expanded,
  onHoverStart,
  onHoverEnd,
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
        className={`mt-2 flex-1 text-[15px] leading-[1.65] text-muted-foreground transition-all duration-300 ${
          dense && !expanded ? "line-clamp-5" : ""
        } ${dense ? "" : "md:text-[15.5px]"}`}
      >
        {t.quote[locale]}
      </p>

      {/* "Lire la suite" hint — only shows when clamped & not expanded */}
      {dense && isClamped && !expanded && (
        <span className="mt-1 text-[12px] text-accent/60 select-none">
          {locale === "fr" ? "Survoler pour lire la suite..." : "Hover to read more..."}
        </span>
      )}

      {/* Separator */}
      <div className="mt-auto pt-5 h-px w-full bg-border-color" />

      {/* Author row */}
      <div className="mt-5 flex items-center gap-3">
        {t.avatar ? (
          <img
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
          <p className="truncate text-[14px] font-semibold">{t.name}</p>
          {t.projectLink ? (
            <Link
              href={`/projects/${t.projectLink}`}
              className="truncate block text-[12.5px] text-accent hover:underline"
            >
              {t.role[locale]}
            </Link>
          ) : (
            <p className="truncate text-[12.5px] text-muted-foreground">
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
