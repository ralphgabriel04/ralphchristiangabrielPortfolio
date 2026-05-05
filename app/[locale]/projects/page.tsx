import type { Metadata } from "next";
import { useTranslations, useLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isFr = locale === "fr";
  return {
    title: isFr ? "Projets" : "Projects",
    description: isFr
      ? "Cinq projets : e-commerce, app mobile, intégration TMS, SaaS et architecture académique."
      : "Five projects: e-commerce, mobile app, TMS integration, SaaS and academic architecture.",
    alternates: {
      languages: { fr: "/fr/projects", en: "/en/projects" },
    },
  };
}
import { projects, caseStudyIds } from "@/lib/projects";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { Badge } from "@/components/ui/badge";
import { PulseDot } from "@/components/ui/pulse-dot";
import { Tag } from "@/components/ui/tag";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { ProjectPlaceholder } from "@/components/ui/project-placeholder";

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
        {projects.map((project, i) => {
          const hasMedia = project.media?.enabled ?? false;

          return (
            <Reveal key={project.id} delay={i * 80}>
              <Link href={`/projects/${project.id}`} className="block group">
                <SpotlightCard className="p-6 md:p-8 transition-colors group-hover:border-accent/40">
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

                      <h2 className="text-xl font-medium tracking-[-0.01em] md:text-2xl group-hover:text-accent transition-colors">
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

                      <span className="inline-flex items-center gap-1 text-sm font-medium text-accent">
                        {caseStudyIds.has(project.id)
                          ? t("caseStudyLink")
                          : t("viewProject")}{" "}
                        <ArrowRight
                          size={14}
                          className="transition-transform group-hover:translate-x-1"
                        />
                      </span>
                    </div>
                  </div>
                </SpotlightCard>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
