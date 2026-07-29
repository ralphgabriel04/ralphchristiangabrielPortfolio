/** Scrolling tech marquee strip (RCG.SYS). CSS-only; pauses on hover. */
const ITEMS = [
  "Full-Stack",
  "Next.js · TypeScript",
  "Java · Spring",
  "PostgreSQL · Prisma",
  "Supabase",
  "Stripe · OAuth",
  "TDD · Tests",
  "FR / EN",
  "Montréal",
];

function Strip() {
  return (
    <div className="flex items-center gap-6 pr-6">
      {ITEMS.map((it, i) => (
        <span
          key={i}
          className="flex items-center gap-6 whitespace-nowrap font-mono text-[12.5px] uppercase tracking-[0.12em] text-muted-foreground/70"
        >
          {it}
          <span className="inline-block text-accent motion-safe:animate-[rg-spin-slow_7s_linear_infinite]">
            ✳
          </span>
        </span>
      ))}
    </div>
  );
}

export function Marquee() {
  return (
    <div className="group overflow-hidden border-y border-border-color bg-muted/40 py-3.5 print:hidden">
      <div className="flex w-max motion-safe:animate-[rg-mq_32s_linear_infinite] group-hover:[animation-play-state:paused]">
        <Strip />
        <Strip />
      </div>
    </div>
  );
}
