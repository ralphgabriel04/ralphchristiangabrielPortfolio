"use client";

import { useEffect, useRef, useState } from "react";

/** Animates the numeric core of a metric string (e.g. "~15 000", "30+", "169+")
 *  from 0 to target when it scrolls into view. Preserves prefix/suffix and the
 *  thousands separator. Static under reduced-motion. */
export function CountUp({
  value,
  className,
  style,
}: {
  value: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const m = value.match(/^(\D*)(\d[\d\s.,]*)(.*)$/u);
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (!m || reduce) {
      setDisplay(value);
      return;
    }
    const prefix = m[1] ?? "";
    const numRaw = m[2] ?? "";
    const suffix = m[3] ?? "";
    const target = parseInt(numRaw.replace(/[\s.,]/g, ""), 10);
    if (!Number.isFinite(target)) {
      setDisplay(value);
      return;
    }
    const sep = /\s/.test(numRaw) ? " " : /,/.test(numRaw) ? "," : "";
    const fmt = (n: number) =>
      sep ? String(n).replace(/\B(?=(\d{3})+(?!\d))/g, sep) : String(n);

    let raf = 0;
    let done = false;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting || done) return;
        done = true;
        io.disconnect();
        const dur = 1100;
        let t0 = 0;
        const tick = (t: number) => {
          if (!t0) t0 = t;
          const p = Math.min(1, (t - t0) / dur);
          const eased = 1 - Math.pow(1 - p, 3);
          setDisplay(prefix + fmt(Math.round(eased * target)) + suffix);
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value]);

  return (
    <span ref={ref} className={className} style={style}>
      {display}
    </span>
  );
}
