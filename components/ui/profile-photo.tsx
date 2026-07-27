"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/**
 * Photos of Ralph that auto-cycle with a crossfade, making every spot where
 * the portrait appears feel a little more alive. Add/remove files here and the
 * rotation updates everywhere the component is used.
 */
const PHOTOS = [
  "/images/ralph-gabriel-1.png",
  "/images/ralph-gabriel-2.png",
  "/images/ralph-gabriel-3.png",
  "/images/ralph-gabriel-4.png",
] as const;

const INTERVAL_MS = 4000;

interface ProfilePhotoProps {
  alt: string;
  /** Extra classes on the relative wrapper (aspect ratio, rounding, size). Ignored when `fill`. */
  className?: string;
  /** Classes applied to each <Image> layer. */
  imageClassName?: string;
  /** Drop the layers straight into an already-sized `relative` parent (no wrapper). */
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
}

export function ProfilePhoto({
  alt,
  className,
  imageClassName = "object-cover",
  fill = false,
  sizes,
  priority = false,
}: ProfilePhotoProps) {
  const [active, setActive] = useState(0);
  const prefersReducedMotion = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined" || PHOTOS.length <= 1) return;
    prefersReducedMotion.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion.current) return;

    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % PHOTOS.length);
    }, INTERVAL_MS);
    return () => window.clearInterval(id);
  }, []);

  const layers = PHOTOS.map((src, i) => (
    <Image
      key={src}
      src={src}
      alt={i === 0 ? alt : ""}
      aria-hidden={i !== 0 ? true : undefined}
      fill
      sizes={sizes}
      priority={priority && i === 0}
      className={`absolute inset-0 h-full w-full transition-opacity duration-[1200ms] ease-in-out ${imageClassName} ${
        i === active ? "opacity-100" : "opacity-0"
      }`}
    />
  ));

  // `fill` mode: caller's parent is already `relative` and sized — just stack layers.
  if (fill) return <>{layers}</>;

  return <div className={`relative ${className ?? ""}`}>{layers}</div>;
}
