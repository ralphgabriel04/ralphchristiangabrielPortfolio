import { useTranslations, useLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowRight, Download, Mail } from "lucide-react";
import { projects } from "@/lib/projects";
import { caseStudyIds } from "@/lib/projects";
import { Button } from "@/components/ui/button";
import { Tag } from "@/components/ui/tag";
import { Card } from "@/components/ui/card";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { Badge } from "@/components/ui/badge";
import { PulseDot } from "@/components/ui/pulse-dot";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { ProjectPlaceholder } from "@/components/ui/project-placeholder";
import { TrackedLink } from "@/components/ui/tracked-link";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <HomeContent />;
}

function HomeContent() {
  const t = useTranslations("hero");
  const tSec = useTranslations("sectionLabels");
  const tHome = useTranslations("home");
  const tProjects = useTranslations("projects");
  const locale = useLocale() as "fr" | "en";

  const featured = projects.filter((p) => p.featured).slice(0, 3);
  // If fewer than 3 featured, pad with non-featured
  const selectedProjects =
    featured.length >= 3
      ? featured
      : [...featured, ...projects.filter((p) => !p.featured)].slice(0, 3);

  const metrics = [
    { num: t("metrics.0.num"), label: t("metrics.0.label") },
    { num: t("metrics.1.num"), label: t("metrics.1.label") },
    { num: t("metrics.2.num"), label: t("metrics.2.label") },
  ];

  return (
    <>
      {/* ── Hero ── */}
      <section className="mx-auto max-w-[var(--max-hero)] px-[var(--page-pad)] pt-16 pb-20">
        <Reveal>
          <div className="flex max-w-[980px] flex-col gap-8">
            <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
              {t("kicker")}
            </span>

            <h1 className="text-4xl font-medium leading-[1.05] tracking-[-0.03em] md:text-5xl lg:text-6xl">
              <span className="block">{t("title.0")}</span>
              <span className="block text-muted-foreground">
                {t("title.1")}{" "}
                <span className="text-border-strong">·</span> {t("title.2")}
              </span>
            </h1>

            <p className="max-w-[55ch] text-lg text-muted-foreground">
              {t("pitch")}
            </p>

            {/* Metrics */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {metrics.map((m, i) => (
                <div key={i} className="flex flex-col gap-1">
                  <span className="text-2xl font-semibold tracking-[-0.02em] text-accent md:text-3xl">
                    {m.num}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {m.label}
                  </span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/projects">
                <Button>
                  {t("ctaPrimary")} <ArrowRight size={16} />
                </Button>
              </Link>
              <TrackedLink
                href={
                  locale === "fr"
                    ? "/cv/ralph-gabriel-cv-fr.pdf"
                    : "/cv/ralph-gabriel-cv-en.pdf"
                }
                target="_blank"
                rel="noreferrer"
                event={`cv_download_${locale}`}
              >
                <Button variant="secondary">
                  <Download size={16} /> {t("ctaSecondary")}
                </Button>
              </TrackedLink>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── Now ── */}
      <NowSection />

      {/* ── Selected Projects ── */}
      <section className="border-t border-border-color">
        <div className="mx-auto max-w-[var(--max-content)] px-[var(--page-pad)] py-20">
          <Reveal>
            <div className="mb-10 flex items-end justify-between gap-4">
              <SectionHeading
                kicker={tSec("selected")}
                title={tHome("projectsHeading")}
              />
              <Link
                href="/projects"
                className="hidden text-sm text-muted-foreground hover:text-foreground transition-colors sm:inline-flex items-center gap-1"
              >
                {tHome("seeAll")} <ArrowRight size={14} />
              </Link>
            </div>
          </Reveal>

          <div className="grid gap-6">
            {selectedProjects.map((project, i) => {
              const hasMedia = project.media?.enabled ?? false;

              return (
                <Reveal key={project.id} delay={i * 80}>
                  <SpotlightCard className="p-6 md:p-8">
                    <div
                      className={
                        hasMedia
                          ? "grid gap-6 md:grid-cols-[1fr_1fr]"
                          : "flex flex-col gap-4"
                      }
                    >
                      {hasMedia && project.media && (
                        <ProjectPlaceholder
                          type={project.media.type}
                          label={project.id}
                          src={project.media.src}
                        />
                      )}

                      <div className="flex flex-col gap-4 justify-center">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="font-mono text-xs text-muted-foreground/40 tabular-nums">
                            {String(i + 1).padStart(2, "0")}.
                          </span>
                          <span className="font-mono text-xs text-muted-foreground">
                            {project.year}
                          </span>
                          <Badge>
                            <PulseDot />
                            {project.status[locale]}
                          </Badge>
                        </div>

                        <h3 className="text-xl font-medium tracking-[-0.01em] md:text-2xl">
                          {project.name}
                        </h3>

                        <p className="text-sm text-muted-foreground">
                          {project.tag[locale]}
                        </p>

                        <p className="max-w-[65ch] text-sm leading-relaxed text-muted-foreground">
                          {project.summary[locale]}
                        </p>

                        <div className="flex flex-wrap gap-1">
                          {project.stack.map((tech) => (
                            <Tag key={tech}>{tech}</Tag>
                          ))}
                        </div>

                        <div className="flex flex-wrap items-center gap-4 pt-2">
                          {project.metrics[locale].map((m, j) => (
                            <span
                              key={j}
                              className="font-mono text-xs text-muted-foreground"
                            >
                              {m}
                            </span>
                          ))}
                        </div>

                        {caseStudyIds.has(project.id) && (
                          <Link
                            href={`/projects/${project.id}`}
                            className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
                          >
                            {tProjects("caseStudyLink")}{" "}
                            <ArrowRight size={14} />
                          </Link>
                        )}
                      </div>
                    </div>
                  </SpotlightCard>
                </Reveal>
              );
            })}
          </div>

          <div className="mt-6 flex justify-center sm:hidden">
            <Link
              href="/projects"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
            >
              {tHome("seeAll")} <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <TestimonialsSection />

      {/* ── Stack ── */}
      <StackSection />

      {/* ── Contact CTA ── */}
      <ContactSection />
    </>
  );
}

function TestimonialsSection() {
  const tSec = useTranslations("sectionLabels");
  const tHome = useTranslations("home");
  const tTest = useTranslations("testimonials");

  // Only render testimonials that are not placeholders
  const testimonialCount = 1;
  const activeIndices: number[] = [];
  for (let i = 0; i < testimonialCount; i++) {
    const quote = tTest(`${i}.quote`);
    if (!quote.startsWith("[")) {
      activeIndices.push(i);
    }
  }

  if (activeIndices.length === 0) return null;

  return (
    <section className="border-t border-border-color">
      <div className="mx-auto max-w-[var(--max-content)] px-[var(--page-pad)] py-20">
        <Reveal>
          <SectionHeading
            kicker={tSec("testimonials")}
            title={tHome("testimonialsHeading")}
          />
        </Reveal>

        <div className={`mt-10 grid gap-6 ${activeIndices.length === 1 ? "max-w-lg" : activeIndices.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3"}`}>
          {activeIndices.map((i, idx) => (
            <Reveal key={i} delay={idx * 80}>
              <Card className="p-6 flex flex-col gap-4 h-full">
                <p className="flex-1 text-sm leading-relaxed text-muted-foreground italic">
                  &ldquo;{tTest(`${i}.quote`)}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-2 border-t border-border-color">
                  {(() => {
                    try {
                      const img = tTest(`${i}.image`);
                      if (img && img.startsWith("/")) return (
                        <img src={img} alt={tTest(`${i}.author`)} width={32} height={32} className="h-8 w-8 rounded-full object-cover border border-border-color shrink-0" />
                      );
                    } catch {}
                    return <div className="h-8 w-8 rounded-full bg-muted-2 border border-border-color shrink-0" aria-hidden="true" />;
                  })()}
                  <div>
                    <p className="text-sm font-medium">
                      {tTest(`${i}.author`)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {tTest(`${i}.role`)}
                    </p>
                  </div>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function NowSection() {
  const tNow = useTranslations("now");

  return (
    <section className="border-t border-border-color">
      <div className="mx-auto max-w-[var(--max-content)] px-[var(--page-pad)] py-16">
        <Reveal>
          <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
            {tNow("kicker")}
          </span>
          <p className="mt-4 max-w-[75ch] text-base leading-relaxed text-muted-foreground">
            {tNow("body")}
          </p>
          <span className="mt-4 block font-mono text-[10px] text-muted-foreground/50">
            {tNow("updated")}
          </span>
        </Reveal>
      </div>
    </section>
  );
}

// Stack data — static, same in FR and EN
const stackData = [
  { cat: "Languages", items: ["TypeScript", "JavaScript", "Java", "C#", "Python"] },
  { cat: "Frontend", items: ["React", "Next.js", "Tailwind CSS", "Angular"] },
  { cat: "Backend", items: ["Node.js", "Express", "Spring Boot", ".NET"] },
  { cat: "Database", items: ["PostgreSQL", "Prisma", "MySQL", "Supabase", "SQLite"] },
  { cat: "DevOps", items: ["Docker", "GitHub Actions", "GitLab CI/CD", "Vercel"] },
  { cat: "Testing", items: ["JUnit", "Jest", "TDD"] },
  { cat: "Architecture", items: ["MVC", "REST", "Observer", "Strategy", "Template Method", "DDD", "GRASP"] },
];

function StackSection() {
  const tSec = useTranslations("sectionLabels");
  const tHome = useTranslations("home");

  return (
    <section className="border-t border-border-color">
      <div className="mx-auto max-w-[var(--max-content)] px-[var(--page-pad)] py-20">
        <Reveal>
          <SectionHeading
            kicker={tSec("stack")}
            title={tHome("stackHeading")}
          />
        </Reveal>

        <div className="mt-10 flex flex-col">
          {stackData.map((category, i) => (
            <Reveal key={category.cat} delay={i * 50}>
              <div className="grid grid-cols-[100px_1fr] md:grid-cols-[140px_1fr] items-baseline gap-4 border-t border-border-color py-5">
                <span className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
                  {category.cat}
                </span>
                <div className="flex flex-wrap gap-1">
                  {category.items.map((item) => (
                    <Tag key={item}>{item}</Tag>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  const tSec = useTranslations("sectionLabels");
  const tHome = useTranslations("home");

  return (
    <section className="border-t border-border-color">
      <div className="mx-auto max-w-[var(--max-content)] px-[var(--page-pad)] py-20">
        <Reveal>
          <SectionHeading
            kicker={tSec("contact")}
            title={tHome("contactHeading")}
          />
          <p className="mt-4 max-w-[50ch] text-sm text-muted-foreground">
            {tHome("contactLede")}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/contact">
              <Button>
                {tHome("contactCta")} <ArrowRight size={16} />
              </Button>
            </Link>
            <TrackedLink
              href="mailto:christian8339@hotmail.com"
              className="inline-flex items-center gap-2 rounded-md border border-border-color px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:border-border-strong transition-colors"
              event="email_click"
            >
              <Mail size={14} />
              christian8339@hotmail.com
            </TrackedLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
