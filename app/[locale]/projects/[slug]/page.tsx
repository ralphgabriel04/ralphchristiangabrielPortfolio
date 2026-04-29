import { notFound } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { projects, caseStudyIds } from "@/lib/projects";
import { caseStudies } from "@/lib/case-studies";
import { Button } from "@/components/ui/button";
import { Tag } from "@/components/ui/tag";
import { Badge } from "@/components/ui/badge";
import { PulseDot } from "@/components/ui/pulse-dot";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";

export function generateStaticParams() {
  return Array.from(caseStudyIds).map((slug) => ({ slug }));
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  if (!caseStudyIds.has(slug)) {
    notFound();
  }

  return <CaseStudyContent slug={slug} />;
}

const sectionKeys = [
  "problem",
  "constraints",
  "approach",
  "stack",
  "outcomes",
  "learnings",
] as const;

function CaseStudyContent({ slug }: { slug: string }) {
  const t = useTranslations("projects");
  const tSec = useTranslations("sectionLabels");
  const locale = useLocale() as "fr" | "en";

  const study = caseStudies[slug];
  if (!study) return null;

  const sections = study[locale];
  const project = projects.find((p) => p.id === slug);

  // Find next project for the "next project" button
  const projectIndex = projects.findIndex((p) => p.id === slug);
  const nextProject = projects[(projectIndex + 1) % projects.length];

  return (
    <article className="mx-auto max-w-[var(--max-content)] px-[var(--page-pad)] py-20">
      {/* Back link */}
      <Reveal>
        <Link
          href="/projects"
          className="mb-8 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={14} /> {t("allProjects")}
        </Link>
      </Reveal>

      {/* Header */}
      <Reveal delay={60}>
        <div className="mb-12">
          <SectionHeading
            kicker={tSec("caseStudy")}
            title={project?.name ?? slug}
          />

          {project && (
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <Badge>
                <PulseDot />
                {project.status[locale]}
              </Badge>
              <span className="font-mono text-xs text-muted-foreground">
                {project.year}
              </span>
              <span className="text-sm text-muted-foreground">
                {project.tag[locale]}
              </span>
            </div>
          )}

          {/* Meta strip */}
          {project && (
            <div className="mt-6 flex flex-wrap gap-1">
              {project.stack.map((tech) => (
                <Tag key={tech}>{tech}</Tag>
              ))}
            </div>
          )}
        </div>
      </Reveal>

      {/* 6 sections: 01-06 */}
      <div className="flex flex-col gap-16">
        {sectionKeys.map((key, i) => {
          const section = sections[key];
          if (!section) return null;

          return (
            <Reveal key={key} delay={i * 60}>
              <div className="grid gap-4 md:grid-cols-[80px_1fr]">
                <span className="font-mono text-sm text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex flex-col gap-3">
                  <h3 className="text-lg font-medium tracking-[-0.01em]">
                    {section.title}
                  </h3>
                  {section.type === "text" && section.body && (
                    <p className="max-w-[65ch] text-sm leading-relaxed text-muted-foreground">
                      {section.body}
                    </p>
                  )}
                  {section.type === "list" && section.items && (
                    <div className="flex flex-wrap gap-1">
                      {section.items.map((item) => (
                        <Tag key={item}>{item}</Tag>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>

      {/* Next project */}
      {nextProject && (
        <Reveal delay={100}>
          <div className="mt-20 border-t border-border-color pt-10">
            <Link
              href={
                caseStudyIds.has(nextProject.id)
                  ? `/projects/${nextProject.id}`
                  : "/projects"
              }
            >
              <div className="group flex items-center justify-between">
                <div>
                  <span className="text-sm text-muted-foreground">
                    {t("nextProject")}
                  </span>
                  <h4 className="text-lg font-medium group-hover:text-accent transition-colors">
                    {nextProject.name}
                  </h4>
                </div>
                <ArrowRight
                  size={20}
                  className="text-muted-foreground group-hover:text-accent transition-colors"
                />
              </div>
            </Link>
          </div>
        </Reveal>
      )}
    </article>
  );
}
