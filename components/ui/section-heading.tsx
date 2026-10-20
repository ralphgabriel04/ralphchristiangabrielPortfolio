interface SectionHeadingProps {
  kicker: string;
  title: string;
  /** Heading level for the title. Use "h1" when this is a page's main title,
   *  "h2" (default) for a section within a page that already has an h1. */
  as?: "h1" | "h2";
}

/** Page and section title: mono kicker + editorial serif, the same treatment as
 *  the home sections (the sans-serif variant made About, Experience and Contact
 *  look like another site). */
export function SectionHeading({ kicker, title, as = "h2" }: SectionHeadingProps) {
  const Title = as;
  return (
    <div className="flex flex-col gap-3">
      <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
        {kicker}
      </span>
      <Title
        className="text-4xl leading-[1.03] tracking-[-0.01em] md:text-[56px]"
        style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}
      >
        {title}
      </Title>
    </div>
  );
}
