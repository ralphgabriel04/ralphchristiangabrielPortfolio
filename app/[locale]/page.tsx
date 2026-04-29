import { useTranslations, useLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowRight, Download } from "lucide-react";
import { projects } from "@/lib/projects";
import { caseStudyIds } from "@/lib/projects";
import { Button } from "@/components/ui/button";
import { Tag } from "@/components/ui/tag";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PulseDot } from "@/components/ui/pulse-dot";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";

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
              <a
                href={
                  locale === "fr"
                    ? "/cv/ralph-gabriel-cv-fr.pdf"
                    : "/cv/ralph-gabriel-cv-en.pdf"
                }
                target="_blank"
                rel="noreferrer"
              >
                <Button variant="secondary">
                  <Download size={16} /> {t("ctaSecondary")}
                </Button>
              </a>
            </div>
          </div>
        </Reveal>
      </section>

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
            {selectedProjects.map((project, i) => (
              <Reveal key={project.id} delay={i * 80}>
                <Card className="p-6 md:p-8">
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-wrap items-center gap-3">
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
                </Card>
              </Reveal>
            ))}
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

      {/* ── Stack ── */}
      <StackSection />
    </>
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

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {stackData.map((category, i) => (
            <Reveal key={category.cat} delay={i * 60}>
              <div className="flex flex-col gap-3">
                <span className="font-mono text-xs font-medium uppercase tracking-[0.06em] text-muted-foreground">
                  {category.cat}
                </span>
                <div className="flex flex-wrap">
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
