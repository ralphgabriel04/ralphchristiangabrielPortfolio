"use client";

import { useEffect, useRef } from "react";

/** Interactive dot-grid background (RCG.SYS hero): dots wobble and are drawn to
 *  the cursor, turning accent-coloured within a radius. Skipped under
 *  reduced-motion. Colours read from the parent's computed style so it tracks
 *  the theme. */
export function HeroCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const parent = cv.parentElement;
    const ctx = cv.getContext("2d");
    if (!parent || !ctx) return;

    let w = 0,
      h = 0,
      dpr = 1,
      vis = true,
      mx = -999,
      my = -999,
      t = 0,
      raf = 0;
    let colors: { dot: string; acc: string } | null = null;

    const size = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      const r = cv.getBoundingClientRect();
      w = r.width;
      h = r.height;
      cv.width = w * dpr;
      cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      colors = null;
    };
    size();

    const onMove = (e: MouseEvent) => {
      const r = cv.getBoundingClientRect();
      mx = e.clientX - r.left;
      my = e.clientY - r.top;
    };
    const onLeave = () => {
      mx = -999;
      my = -999;
    };
    parent.addEventListener("mousemove", onMove, { passive: true });
    parent.addEventListener("mouseleave", onLeave, { passive: true });
    const io = new IntersectionObserver((es) => {
      vis = es[0]?.isIntersecting ?? true;
    }, { threshold: 0 });
    io.observe(cv);
    const ro = new ResizeObserver(() => size());
    ro.observe(parent);

    const draw = () => {
      raf = requestAnimationFrame(draw);
      if (!vis) return;
      if (!colors) {
        const cs = getComputedStyle(parent);
        colors = {
          dot: cs.color,
          acc: cs.getPropertyValue("--accent").trim() || "#FF5A2E",
        };
      }
      t += 0.012;
      ctx.clearRect(0, 0, w, h);
      const gap = 30,
        r0 = 0.9;
      for (let x = gap / 2; x < w; x += gap) {
        for (let y = gap / 2; y < h; y += gap) {
          const dx = x - mx,
            dy = y - my,
            dist = Math.hypot(dx, dy);
          const wob = Math.sin(t + x * 0.02 + y * 0.015) * 0.5;
          let r = r0 + wob * 0.35,
            ox = 0,
            oy = 0,
            a = 0.1 + wob * 0.04,
            col = colors.dot;
          if (dist < 130) {
            const f = 1 - dist / 130;
            ox = (dx / (dist || 1)) * f * 10;
            oy = (dy / (dist || 1)) * f * 10;
            r = r0 + f * 1.7;
            a = 0.1 + f * 0.55;
            col = colors.acc;
          }
          ctx.globalAlpha = a;
          ctx.fillStyle = col;
          ctx.beginPath();
          ctx.arc(x + ox, y + oy, r, 0, 6.284);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      parent.removeEventListener("mousemove", onMove);
      parent.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
