"use client";

import { useRef, useState, type HTMLAttributes } from "react";

interface SpotlightCardProps extends HTMLAttributes<HTMLDivElement> {
  /** Spotlight radius in px */
  radius?: number;
  /** Spotlight opacity 0-1 */
  opacity?: number;
  /** Spotlight color — defaults to accent */
  color?: string;
}

export function SpotlightCard({
  children,
  className = "",
  radius = 350,
  opacity = 0.08,
  color,
  ...props
}: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      className={`group relative overflow-hidden rounded-lg border border-border-color bg-muted transition-all duration-200 ease-out hover:shadow-md hover:border-border-strong ${className}`}
      {...props}
    >
      {/* Spotlight overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300 motion-reduce:hidden"
        style={{
          opacity: visible ? 1 : 0,
          background: `radial-gradient(${radius}px circle at ${pos.x}px ${pos.y}px, ${color ?? "var(--accent)"} 0%, transparent 100%)`,
          filter: `opacity(${opacity})`,
        }}
      />
      {/* Content sits above the spotlight — full width so parent flex + items-center still stretches */}
      <div className="relative z-10 w-full min-w-0 self-stretch">
        {children}
      </div>
    </div>
  );
}
