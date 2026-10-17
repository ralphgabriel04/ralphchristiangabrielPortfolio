import Image from "next/image";
import { BadgeCheck, ExternalLink } from "lucide-react";
import { formatCertDate, type Certification } from "@/lib/certifications";

interface CertCardProps {
  cert: Certification;
  locale: string;
  labels: { verify: string; view: string };
}

/**
 * Certification card, same visual language as Card / Tag / SectionHeading:
 * warm surface, 1px border, mono kicker, rust accent on hover.
 * The visual is a transparent 16:10 PNG, so every card has the same height and
 * the certificate sits on `bg-muted-2` in both light and dark mode.
 */
export function CertCard({ cert, locale, labels }: CertCardProps) {
  const date = formatCertDate(cert.issued, locale);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-border-color bg-muted transition-all duration-200 ease-out hover:border-border-strong hover:shadow-md">
      <a
        href={cert.full}
        target="_blank"
        rel="noreferrer"
        aria-label={`${labels.view} : ${cert.title} (${cert.issuer})`}
        className="relative block aspect-[16/10] overflow-hidden border-b border-border-color bg-muted-2"
      >
        <Image
          src={cert.card}
          alt={`${cert.issuer}, ${cert.title}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 360px"
          className="object-contain transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
      </a>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-center justify-between gap-3 font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
          <span>{cert.issuer}</span>
          <time dateTime={cert.issued}>{date}</time>
        </div>

        <h4 className="text-sm font-medium leading-snug transition-colors group-hover:text-accent">
          {cert.title}
        </h4>

        <div className="flex flex-wrap gap-1.5">
          {cert.hours ? (
            <span className="inline-flex rounded border border-border-color bg-background px-2 py-[3px] font-mono text-[11px] text-foreground">
              {cert.hours} h
            </span>
          ) : null}
          {cert.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex rounded border border-border-color bg-background px-2 py-[3px] font-mono text-[11px] text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-border-color pt-3">
          <span className="truncate font-mono text-[11px] text-muted-foreground">
            {cert.credentialId ? `ID ${cert.credentialId}` : cert.issuer.toLowerCase() + ".org"}
          </span>
          <a
            href={cert.verifyUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex shrink-0 items-center gap-1.5 text-xs font-medium text-foreground underline decoration-border-strong underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
          >
            <BadgeCheck size={14} aria-hidden="true" />
            {labels.verify}
            <ExternalLink size={12} aria-hidden="true" />
          </a>
        </div>
      </div>
    </article>
  );
}
