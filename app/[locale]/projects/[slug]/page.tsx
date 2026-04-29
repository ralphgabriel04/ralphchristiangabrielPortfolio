import { notFound } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowLeft, ArrowRight, ImageIcon } from "lucide-react";
import { projects, projectRoles } from "@/lib/projects";
import { caseStudies } from "@/lib/case-studies";
import { Tag } from "@/components/ui/tag";
import { Badge } from "@/components/ui/badge";
import { PulseDot } from "@/components/ui/pulse-dot";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";

const allSlugs = projects.map((p) => p.id);

export function generateStaticParams() {
  return allSlugs.map((slug) => ({ slug }));
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  if (!allSlugs.includes(slug)) {
    notFound();
  }

  return <ProjectDetailContent slug={slug} />;
}

const sectionKeys = [
  "problem",
  "constraints",
  "approach",
  "stack",
  "outcomes",
  "learnings",
] as const;

function ProjectDetailContent({ slug }: { slug: string }) {
  const t = useTranslations("projects");
  const tSec = useTranslations("sectionLabels");
  const locale = useLocale() as "fr" | "en";

  const project = projects.find((p) => p.id === slug);
  if (!project) return null;

  const study = caseStudies[slug];
  const sections = study?.[locale];
  const hasCaseStudy = !!sections;

  const role = projectRoles[slug]?.[locale] ?? project.tag[locale];

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
            kicker={hasCaseStudy ? tSec("caseStudy") : tSec("overview")}
            title={project.name}
          />

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

          {/* Meta strip */}
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{role}</span>
          </div>

          <div className="mt-4 flex flex-wrap gap-1">
            {project.stack.map((tech) => (
              <Tag key={tech}>{tech}</Tag>
            ))}
          </div>

          {/* Summary */}
          <p className="mt-6 max-w-[65ch] text-sm leading-relaxed text-muted-foreground">
            {project.summary[locale]}
          </p>
        </div>
      </Reveal>

      {/* Media showcase */}
      <Reveal delay={80}>
        <div className="mb-16">
          <div className="grid gap-3 md:grid-cols-2">
            {/* Large image placeholder */}
            <div className="md:row-span-2 flex flex-col items-center justify-center gap-2 rounded-lg border border-border-color bg-muted/30 text-muted-foreground"
              style={{ aspectRatio: "16/9" }}
            >
              <ImageIcon size={32} strokeWidth={1.5} />
              <span className="text-sm font-medium">{project.name}</span>
              <span className="text-xs">{t("screenshotPlaceholder")}</span>
            </div>
            {/* Two smaller placeholders */}
            {[1, 2].map((n) => (
              <div
                key={n}
                className="flex flex-col items-center justify-center gap-2 rounded-lg border border-border-color bg-muted/30 text-muted-foreground"
                style={{ aspectRatio: "16/9" }}
              >
                <ImageIcon size={24} strokeWidth={1.5} />
                <span className="text-xs">{t("screenshotPlaceholder")}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            {t("screenshotsCaption")}
          </p>
        </div>
      </Reveal>

      {/* Case study sections OR coming soon fallback */}
      {hasCaseStudy ? (
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
      ) : (
        <Reveal>
          <div className="rounded-lg border border-border-color bg-muted/20 px-6 py-12 text-center">
            <p className="text-sm text-muted-foreground">
              {t("caseStudyComingSoon")}
            </p>
          </div>
        </Reveal>
      )}

      {/* Next project */}
      {nextProject && (
        <Reveal delay={100}>
          <div className="mt-20 border-t border-border-color pt-10">
            <Link href={`/projects/${nextProject.id}`}>
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
