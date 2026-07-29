"use client";

import { useEffect } from "react";

/** RCG.SYS custom cursor: an accent dot + a lagging ring that grows over
 *  interactive elements, plus a light magnetic pull on [data-mag] elements.
 *  Only on fine-pointer devices with motion enabled; hides the native cursor. */
export function CustomCursor() {
  useEffect(() => {
    const fine = window.matchMedia?.("(hover:hover) and (pointer:fine)").matches;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const automated = typeof navigator !== "undefined" && navigator.webdriver;
    if (!fine || reduce || automated) return;

    const dot = document.createElement("div");
    const ring = document.createElement("div");
    dot.setAttribute("aria-hidden", "true");
    ring.setAttribute("aria-hidden", "true");
    dot.style.cssText =
      "position:fixed;left:0;top:0;width:6px;height:6px;border-radius:50%;background:var(--accent);z-index:300;pointer-events:none;transform:translate(-100px,-100px)";
    ring.style.cssText =
      "position:fixed;left:0;top:0;width:34px;height:34px;border-radius:50%;border:1.5px solid var(--accent);opacity:.45;z-index:299;pointer-events:none;transform:translate(-100px,-100px);transition:width .2s,height .2s,opacity .2s";
    document.body.append(dot, ring);
    document.documentElement.classList.add("rg-hide-cursor");

    let dx = -100,
      dy = -100,
      rx = -100,
      ry = -100,
      raf = 0;
    let mag: HTMLElement | null = null;

    const move = (e: MouseEvent) => {
      dx = e.clientX;
      dy = e.clientY;
      dot.style.transform = `translate(${dx - 3}px, ${dy - 3}px)`;
      if (mag) {
        const r = mag.getBoundingClientRect();
        const ox = (dx - (r.left + r.width / 2)) * 0.25;
        const oy = (dy - (r.top + r.height / 2)) * 0.3;
        mag.style.transform = `translate(${ox}px, ${oy}px)`;
      }
    };
    const loop = () => {
      rx += (dx - rx) * 0.18;
      ry += (dy - ry) * 0.18;
      ring.style.transform = `translate(${rx - 17}px, ${ry - 17}px)`;
      raf = requestAnimationFrame(loop);
    };
    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      const hov = t.closest?.("a,button,[role=button],input,textarea,[data-cur]");
      const big = !!hov;
      ring.style.width = big ? "46px" : "34px";
      ring.style.height = big ? "46px" : "34px";
      ring.style.opacity = big ? "0.9" : "0.45";
      const m = (t.closest?.("[data-mag]") as HTMLElement | null) ?? null;
      if (m !== mag) {
        if (mag) mag.style.transform = "";
        mag = m;
        if (mag) mag.style.transition = "transform .15s ease-out";
      }
    };
    const out = (e: MouseEvent) => {
      const t = e.relatedTarget as HTMLElement | null;
      if (mag && (!t || !t.closest?.("[data-mag]"))) {
        mag.style.transform = "";
        mag = null;
      }
    };

    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mouseover", over, { passive: true });
    window.addEventListener("mouseout", out, { passive: true });
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      window.removeEventListener("mouseout", out);
      document.documentElement.classList.remove("rg-hide-cursor");
      if (mag) mag.style.transform = "";
      dot.remove();
      ring.remove();
    };
  }, []);

  return null;
}
