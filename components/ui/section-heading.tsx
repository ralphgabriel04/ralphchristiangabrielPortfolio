interface SectionHeadingProps {
  kicker: string;
  title: string;
  /** Heading level for the title. Use "h1" when this is a page's main title,
   *  "h2" (default) for a section within a page that already has an h1. */
  as?: "h1" | "h2";
}

export function SectionHeading({ kicker, title, as = "h2" }: SectionHeadingProps) {
  const Title = as;
  return (
    <div className="flex flex-col gap-2">
      <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
        {kicker}
      </span>
      <Title className="text-2xl font-medium leading-[1.2] tracking-[-0.02em] md:text-3xl">
        {title}
      </Title>
    </div>
  );
}
