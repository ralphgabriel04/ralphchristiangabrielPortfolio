"use client";

import { useEffect, useState } from "react";

/** Footer status line — "● SYS.OK · HH:MM · MTL" (Montréal time), à la RCG.SYS. */
export function SysClock() {
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

  return (
    <span className="inline-flex items-center gap-2 font-mono text-xs text-muted-foreground">
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--shipped)" }} />
      SYS.OK{time && ` · ${time} · MTL`}
    </span>
  );
}
