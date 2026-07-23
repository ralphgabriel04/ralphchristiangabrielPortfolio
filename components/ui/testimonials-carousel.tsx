"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { type Testimonial } from "@/lib/testimonials";
import { TestimonialCard } from "@/components/ui/testimonial-card";

interface TestimonialsCarouselProps {
  testimonials: Testimonial[];
  locale: "fr" | "en";
  autoPlayInterval?: number;
}

function usePerPage() {
  const [perPage, setPerPage] = useState(3);

  useEffect(() => {
    const update = () => {
      if (window.innerWidth < 640) setPerPage(1);
      else if (window.innerWidth < 1024) setPerPage(2);
      else setPerPage(3);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return perPage;
}

export function TestimonialsCarousel({
  testimonials,
  locale,
  autoPlayInterval = 5000,
}: TestimonialsCarouselProps) {
  const perPage = usePerPage();
  const [page, setPage] = useState(0);
  const [paused, setPaused] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const total = testimonials.length;

  const pageCount = Math.ceil(total / perPage);

  useEffect(() => {
    setPage((p) => Math.min(p, pageCount - 1));
  }, [pageCount]);

  const pages = useMemo(() => {
    const result: Testimonial[][] = [];
    for (let i = 0; i < total; i += perPage) {
      result.push(testimonials.slice(i, i + perPage));
    }
    return result;
  }, [testimonials, perPage, total]);

  const goTo = useCallback(
    (index: number) => {
      setExpandedId(null);
      setPage(((index % pageCount) + pageCount) % pageCount);
    },
    [pageCount],
  );

  const next = useCallback(() => goTo(page + 1), [page, goTo]);
  const prev = useCallback(() => goTo(page - 1), [page, goTo]);

  // Auto-play — pause when hovering OR when a card is expanded
  useEffect(() => {
    if (paused || expandedId || pageCount <= 1) return;
    const timer = setInterval(next, autoPlayInterval);
    return () => clearInterval(timer);
  }, [paused, expandedId, next, autoPlayInterval, pageCount]);

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => {
        setPaused(false);
        setExpandedId(null);
      }}
    >
      {/* Pages with crossfade */}
      <div className="relative overflow-hidden">
        {pages.map((group, i) => (
          <div
            key={i}
            className={`transition-all duration-500 ease-out ${
              i === page
                ? "relative opacity-100 translate-x-0"
                : "absolute inset-0 opacity-0 pointer-events-none translate-x-4"
            }`}
            aria-hidden={i !== page}
            inert={i !== page ? true : undefined}
          >
            <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {group.map((t) => (
                <div key={t.id}>
                  <TestimonialCard
                    testimonial={t}
                    locale={locale}
                    dense
                    expanded={expandedId === t.id}
                    onHoverStart={() => setExpandedId(t.id)}
                    onHoverEnd={() => setExpandedId(null)}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Navigation */}
      {pageCount > 1 && (
        <div className="flex items-center justify-between mt-6">
          <div className="flex gap-1.5">
            {pages.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  i === page
                    ? "w-6 bg-accent"
                    : "w-1.5 bg-border-strong hover:bg-muted-foreground"
                }`}
                aria-label={`Page ${i + 1}`}
              />
            ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={prev}
              className="h-9 w-9 rounded-full border border-border-color bg-background flex items-center justify-center transition-all duration-200 hover:border-border-strong hover:bg-muted cursor-pointer active:scale-95"
              aria-label="Previous"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={next}
              className="h-9 w-9 rounded-full border border-border-color bg-background flex items-center justify-center transition-all duration-200 hover:border-border-strong hover:bg-muted cursor-pointer active:scale-95"
              aria-label="Next"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
