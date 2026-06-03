"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TestimonialsGridProps {
  children: ReactNode[];
  visibleCount: number;
  showMoreLabel: string;
  showLessLabel: string;
}

export function TestimonialsGrid({
  children,
  visibleCount,
  showMoreLabel,
  showLessLabel,
}: TestimonialsGridProps) {
  const [expanded, setExpanded] = useState(false);
  const hasMore = children.length > visibleCount;
  const visible = expanded ? children : children.slice(0, visibleCount);

  return (
    <>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {visible}
      </div>

      {hasMore && (
        <div className="mt-8 flex justify-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? showLessLabel : showMoreLabel}
            {expanded ? (
              <ChevronUp className="ml-1 h-4 w-4" />
            ) : (
              <ChevronDown className="ml-1 h-4 w-4" />
            )}
          </Button>
        </div>
      )}
    </>
  );
}
