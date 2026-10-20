import type { Metadata } from "next";
import { alternatesFor } from "@/lib/site";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Briefcase, GraduationCap, Award } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { CertCard } from "@/components/ui/cert-card";
import { certifications } from "@/lib/certifications";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isFr = locale === "fr";
  return {
    title: isFr ? "Expérience" : "Experience",
    description: isFr
      ? "Expérience et formation : La Caisse (CDPQ), Fastercom, The Mad Space, Cadence, Vidéotron. Génie logiciel à l'ÉTS (en cours) et 6 certifications vérifiables."
      : "Experience and education: La Caisse (CDPQ), Fastercom, The Mad Space, Cadence, Vidéotron. Software engineering studies at ÉTS and 6 verifiable certifications.",
    alternates: alternatesFor(locale, "/experience"),
  };
}

export default async function ExperiencePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ExperienceContent />;
}

type ExpImage = { src: string; alt: string };
type ExpItem = {
  date: string;
  role: string;
  org: string;
  orgUrl?: string;
  desc: string;
  points?: string[];
  stack?: string;
  images?: ExpImage[];
};
type EduItem = { date: string; title: string; org: string };

/** Section title inside the page (h2), with its icon. */
function GroupTitle({ icon, children, aside }: { icon: React.ReactNode; children: React.ReactNode; aside?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-center justify-between gap-3 border-b border-border-strong pb-4">
      <div className="flex items-center gap-2.5">
        <span className="text-accent">{icon}</span>
        <h2 className="text-2xl leading-none tracking-[-0.01em] md:text-[30px]" style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}>
          {children}
        </h2>
      </div>
      {aside}
    </div>
  );
}

/**
 * CV layout (audit 2026-10-18): date and organisation in a left column, role and
 * achievements on the right. Uses the full content width instead of a 60ch strip,
 * and every entry keeps its bottom spacing (the old `last:pb-0` sat inside each
 * Reveal wrapper, so it removed the gap under every entry).
 */
function ExperienceContent() {
  const t = useTranslations("experience");
  const tSec = useTranslations("sectionLabels");
  const locale = useLocale();

  const items = t.raw("items") as ExpItem[];
  const education = t.raw("education") as EduItem[];

  return (
    <section className="mx-auto max-w-[var(--max-content)] px-[var(--page-pad)] py-20">
      <Reveal>
        <SectionHeading as="h1" kicker={tSec("experience")} title={t("heading")} />
      </Reveal>

      {/* Professional experience */}
      <div className="mt-14">
        <Reveal delay={60}>
          <GroupTitle icon={<Briefcase size={18} />}>{t("proTitle")}</GroupTitle>
        </Reveal>

        <ol className="flex flex-col">
          {items.map((e, i) => (
            <li key={i} className="border-b border-border-color py-8 first:pt-0 last:border-b-0">
              <Reveal delay={40}>
                <div className="grid gap-3 md:grid-cols-[220px_minmax(0,1fr)] md:gap-10">
                  {/* Left: when + where */}
                  <div>
                    <div className="font-mono text-[12px] text-muted-foreground">{e.date}</div>
                    <div className="mt-1.5 text-[15px] font-medium">
                      {e.orgUrl ? (
                        <a
                          href={e.orgUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="underline decoration-border-strong underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
                        >
                          {e.org}
                        </a>
                      ) : (
                        e.org
                      )}
                    </div>
                  </div>

                  {/* Right: role + what I did */}
                  <div className="min-w-0">
                    <h3 className="text-lg font-semibold leading-snug">{e.role}</h3>
                    {e.points && e.points.length > 0 ? (
                      <ul className="mt-3 flex max-w-[72ch] flex-col gap-2">
                        {e.points.map((p) => (
                          <li key={p} className="flex gap-3 text-[15px] leading-relaxed text-muted-foreground">
                            <span aria-hidden="true" className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                            <span>{p}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-2 max-w-[72ch] text-[15px] leading-relaxed text-muted-foreground">{e.desc}</p>
                    )}
                    {e.stack && (
                      <p className="mt-3 font-mono text-[12px] text-muted-foreground">{e.stack}</p>
                    )}
                    {e.images && (
                      <div className="mt-5 grid max-w-[640px] grid-cols-3 gap-3">
                        {e.images.map((img) => (
                          <a
                            key={img.src}
                            href={img.src}
                            target="_blank"
                            rel="noreferrer"
                            className="block overflow-hidden rounded-lg border border-border-color bg-muted transition-colors hover:border-border-strong"
                          >
                            <Image
                              src={img.src}
                              alt={img.alt}
                              width={600}
                              height={400}
                              sizes="(max-width: 768px) 33vw, 210px"
                              className="aspect-[3/2] w-full object-cover"
                            />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>

      {/* Education */}
      <div className="mt-16">
        <Reveal delay={60}>
          <GroupTitle icon={<GraduationCap size={18} />}>{t("eduTitle")}</GroupTitle>
        </Reveal>

        <ol className="grid gap-4 md:grid-cols-3">
          {education.map((e, i) => (
            <li key={i}>
              <Reveal delay={60 + i * 40} className="h-full">
                <div className="h-full rounded-xl border border-border-color bg-muted p-5">
                  <div className="font-mono text-[12px] text-muted-foreground">{e.date}</div>
                  <h3 className="mt-1.5 text-[15px] font-semibold leading-snug">{e.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{e.org}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>

      {/* Certifications */}
      <div id="certifications" className="mt-16 scroll-mt-24">
        <Reveal delay={60}>
          <GroupTitle
            icon={<Award size={18} />}
            aside={
              <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
                {t("certMeta", { count: certifications.length })}
              </span>
            }
          >
            {t("certTitle")}
          </GroupTitle>
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {certifications.map((cert, i) => (
            <Reveal key={cert.slug} delay={80 + i * 60} className="h-full">
              <CertCard
                cert={cert}
                locale={locale}
                labels={{ verify: t("certVerify"), view: t("certView") }}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
