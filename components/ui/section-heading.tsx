interface SectionHeadingProps {
  kicker: string;
  title: string;
}

export function SectionHeading({ kicker, title }: SectionHeadingProps) {
  return (
    <div className="flex flex-col gap-2">
      <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
        {kicker}
      </span>
      <h2 className="text-2xl font-medium leading-[1.2] tracking-[-0.02em] md:text-3xl">
        {title}
      </h2>
    </div>
  );
}
