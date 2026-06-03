"use client";

import { type TestimonialCategory, categoryLabels } from "@/lib/testimonials";

type FilterValue = TestimonialCategory | "all";

interface TestimonialsFiltersProps {
  active: FilterValue;
  onChange: (value: FilterValue) => void;
  locale: "fr" | "en";
  counts?: Record<string, number>;
}

const filters: FilterValue[] = ["all", "client", "colleague", "teacher", "partner"];

export function TestimonialsFilters({ active, onChange, locale, counts }: TestimonialsFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {filters.map((value) => {
        const isActive = active === value;
        const count = counts?.[value] ?? 0;

        // Hide categories with no testimonials (always show "all")
        if (value !== "all" && count === 0) return null;

        return (
          <button
            key={value}
            onClick={() => onChange(value)}
            className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[13px] transition-all duration-200 cursor-pointer ${
              isActive
                ? "border-foreground bg-foreground text-background"
                : "border-border-color bg-background text-muted-foreground hover:border-border-strong hover:text-foreground"
            }`}
          >
            {categoryLabels[locale][value]}
            {count !== undefined && (
              <span className={`text-[11.5px] tabular-nums ${isActive ? "text-background/60" : "text-muted-foreground/50"}`}>
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
