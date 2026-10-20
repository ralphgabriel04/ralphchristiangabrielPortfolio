import { MapPin } from "lucide-react";

/** Hero status line: ● availability · 📍 location · GitHub ↗ · LinkedIn ↗
 *  (the live clock was removed after the 2026-10-18 audit: decoration, no information). */
export function HeroStatus({
  available,
  location,
}: {
  available: string;
  location: string;
}) {
  const Sep = () => (
    <span className="text-border-strong" aria-hidden="true">
      ·
    </span>
  );

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[12px] text-muted-foreground">
      {/* Availability gets its own row, so no separator is left hanging at a line end. */}
      <span className="inline-flex basis-full items-center gap-2">
        <span className="relative inline-flex h-2 w-2">
          <span
            className="absolute inline-flex h-full w-full rounded-full opacity-60 motion-safe:animate-[pulse_2.4s_ease-out_infinite]"
            style={{ background: "var(--shipped)" }}
          />
          <span
            className="relative inline-flex h-2 w-2 rounded-full"
            style={{ background: "var(--shipped)" }}
          />
        </span>
        {available}
      </span>
      <span className="inline-flex items-center gap-1">
        <MapPin size={12} className="text-accent" />
        {location}
      </span>
      <span className="hidden sm:inline">
        <Sep />
      </span>
      {/* Links wrap together on narrow screens. */}
      <span className="inline-flex items-center gap-3">
      <a
        href="https://github.com/ralphgabriel04"
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-0.5 transition-colors hover:text-foreground"
      >
        GitHub <span aria-hidden="true">↗</span>
      </a>
      <a
        href="https://linkedin.com/in/ralph-christian-gabriel-45092021b"
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-0.5 transition-colors hover:text-foreground"
      >
        LinkedIn <span aria-hidden="true">↗</span>
      </a>
      </span>
    </div>
  );
}
