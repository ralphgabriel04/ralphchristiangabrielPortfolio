"use client";

import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";

/** RCG.SYS hero status line:
 *  ● Disponible — emploi ou contrat · 📍 Grand Montréal · hybride · HH h MM · MTL · GitHub ↗ · LinkedIn ↗ */
export function HeroStatus({
  available,
  location,
}: {
  available: string;
  location: string;
}) {
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () => {
      try {
        setTime(
          new Intl.DateTimeFormat("fr-CA", {
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "America/Toronto",
          }).format(new Date()),
        );
      } catch {}
    };
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, []);

  const Sep = () => (
    <span className="text-border-strong" aria-hidden="true">
      ·
    </span>
  );

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[11.5px] text-muted-foreground">
      <span className="inline-flex items-center gap-2">
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
      <Sep />
      <span className="inline-flex items-center gap-1">
        <MapPin size={12} className="text-accent" />
        {location}
      </span>
      {time && (
        <>
          <Sep />
          <span>{time} · MTL</span>
        </>
      )}
      <Sep />
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
    </div>
  );
}
