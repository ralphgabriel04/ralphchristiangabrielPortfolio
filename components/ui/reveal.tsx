"use client";

import { useRef, useEffect, useState, type ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  /** Replay the reveal every time the element re-enters the viewport (scroll up
   *  or down). Set to false for a one-shot reveal. */
  repeat?: boolean;
}

export function Reveal({ children, delay = 0, className = "", repeat = true }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [shown, setShown] = useState(true); // SSR: visible by default

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    setMounted(true);

    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }

    // Client: start hidden and let the observer drive the entrance — and, when
    // `repeat`, the exit too, so the animation plays again on the next scroll-in.
    setShown(false);

    let timer: ReturnType<typeof setTimeout>;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            timer = setTimeout(() => setShown(true), delay);
            if (!repeat) observer.disconnect(); // one-shot: stop after first entrance
          } else if (repeat) {
            clearTimeout(timer);
            setShown(false); // reset so the reveal replays next time it scrolls in
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -20px 0px" }
    );

    observer.observe(el);
    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [delay, repeat]);

  return (
    <div
      ref={ref}
      className={`${
        mounted
          ? `transition-all duration-400 ease-out motion-reduce:opacity-100 motion-reduce:translate-y-0 motion-reduce:transition-none ${
              shown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
            }`
          : "" // no classes during SSR — content is visible
      } ${className}`}
    >
      {children}
    </div>
  );
}
