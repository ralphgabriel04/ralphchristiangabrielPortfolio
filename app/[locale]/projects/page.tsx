import { useTranslations, useLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { projects, caseStudyIds } from "@/lib/projects";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PulseDot } from "@/components/ui/pulse-dot";
import { Tag } from "@/components/ui/tag";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ProjectsContent />;
}

function ProjectsContent() {
  const t = useTranslations("projects");
  const tSec = useTranslations("sectionLabels");
  const locale = useLocale() as "fr" | "en";

  return (
    <section className="mx-auto max-w-[var(--max-content)] px-[var(--page-pad)] py-20">
      <Reveal>
        <SectionHeading kicker={tSec("selected")} title={t("heading")} />
        <p className="mt-2 mb-12 max-w-[60ch] text-sm text-muted-foreground">
          {t("description")}
        </p>
      </Reveal>

      <div className="grid gap-6">
        {projects.map((project, i) => (
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

                <h2 className="text-xl font-medium tracking-[-0.01em] md:text-2xl">
                  {project.name}
                </h2>

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

                <div className="flex flex-wrap items-center gap-4 pt-1">
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
                    {t("caseStudyLink")} <ArrowRight size={14} />
                  </Link>
                )}
              </div>
            </Card>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
