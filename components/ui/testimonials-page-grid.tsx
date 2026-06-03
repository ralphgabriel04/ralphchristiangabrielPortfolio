"use client";

import { useState, useMemo } from "react";
import { type Testimonial, type TestimonialCategory, getTestimonialsByCategory } from "@/lib/testimonials";
import { TestimonialCard } from "@/components/ui/testimonial-card";
import { TestimonialsFilters } from "@/components/ui/testimonials-filters";

interface TestimonialsPageGridProps {
  testimonials: Testimonial[];
  locale: "fr" | "en";
  addLabel: string;
  addHref: string;
  addCtaTitle: string;
  addCtaSubtitle: string;
  addCtaBadge: string;
  resultLabel: string;
  resultLabelPlural: string;
  emptyLabel: string;
}

export function TestimonialsPageGrid({
  testimonials,
  locale,
  addLabel,
  addHref,
  addCtaTitle,
  addCtaSubtitle,
  addCtaBadge,
  resultLabel,
  resultLabelPlural,
  emptyLabel,
}: TestimonialsPageGridProps) {
  const [filter, setFilter] = useState<TestimonialCategory | "all">("all");

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: testimonials.length };
    testimonials.forEach((t) => {
      c[t.category] = (c[t.category] || 0) + 1;
    });
    return c;
  }, [testimonials]);

  const filtered = getTestimonialsByCategory(filter);

  return (
    <>
      {/* Filters row with result count */}
      <div className="mt-10 flex flex-col gap-4 border-y border-border-color py-5 md:flex-row md:items-center md:justify-between">
        <TestimonialsFilters active={filter} onChange={setFilter} locale={locale} counts={counts} />
        <div className="text-[12.5px] text-muted-foreground">
          <span className="font-medium text-foreground tabular-nums">{filtered.length}</span>{" "}
          {filtered.length > 1 ? resultLabelPlural : resultLabel}
        </div>
      </div>

      {/* Grid */}
      <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
        {filtered.map((t, i) => (
          <div
            key={t.id}
            className="animate-[page-in_400ms_ease-out_both]"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <TestimonialCard testimonial={t} locale={locale} />
          </div>
        ))}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="mt-12 rounded-2xl border border-dashed border-border-color bg-background p-10 text-center">
          <p className="text-[14px] text-muted-foreground">{emptyLabel}</p>
        </div>
      )}

      {/* CTA card */}
      <div className="mt-16 flex flex-col items-center gap-3 rounded-2xl border border-border-color bg-background p-10 text-center md:p-14">
        <span className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-[11.5px] font-medium uppercase tracking-[0.16em] text-accent">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          {addCtaBadge}
        </span>
        <h3 className="mt-2 text-[24px] font-medium tracking-tight md:text-[28px]">
          {addCtaTitle}
        </h3>
        <p className="max-w-md text-[14.5px] leading-relaxed text-muted-foreground">
          {addCtaSubtitle}
        </p>
        <a
          href={addHref}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-3 text-[13.5px] font-medium text-background shadow-sm transition-all hover:opacity-90 hover:shadow-md active:scale-[0.98]"
        >
          {addLabel}
          <span>→</span>
        </a>
      </div>
    </>
  );
}
