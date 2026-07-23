import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { ArrowLeft, ArrowRight, ExternalLink, ImageIcon } from "lucide-react";
import { projects, projectRoles, projectLinks, projectGalleries } from "@/lib/projects";
import { caseStudies } from "@/lib/case-studies";
import { Tag } from "@/components/ui/tag";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { Badge } from "@/components/ui/badge";
import { PulseDot } from "@/components/ui/pulse-dot";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { ProjectPlaceholder } from "@/components/ui/project-placeholder";
import { TrackView } from "@/components/ui/track-view";

const allSlugs = projects.map((p) => p.id);

export function generateStaticParams() {
  return allSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = projects.find((p) => p.id === slug);
  if (!project) return {};
  const isFr = locale === "fr";
  return {
    title: project.name,
    description: project.summary[isFr ? "fr" : "en"].slice(0, 155),
    alternates: {
      languages: {
        fr: `/fr/projects/${slug}`,
        en: `/en/projects/${slug}`,
      },
    },
  };
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

  // Track project view on mount

  const study = caseStudies[slug];
  const sections = study?.[locale];
  const hasCaseStudy = !!sections;

  const role = projectRoles[slug]?.[locale] ?? project.tag[locale];
  const gallery = projectGalleries[slug] ?? [];

  // Find prev/next projects for navigation
  const projectIndex = projects.findIndex((p) => p.id === slug);
  const prevProject = projects[(projectIndex - 1 + projects.length) % projects.length];
  const nextProject = projects[(projectIndex + 1) % projects.length];

  return (
    <article className="mx-auto max-w-[var(--max-content)] px-[var(--page-pad)] py-20">
      <TrackView event="project_view" props={{ project: slug }} />
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
            as="h1"
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
          <p className="mt-6 max-w-[65ch] text-base leading-relaxed text-muted-foreground">
            {project.summary[locale]}
          </p>
        </div>
      </Reveal>

      {/* Media showcase */}
      <Reveal delay={80}>
        <div className="mb-16">
          {project.media?.enabled && project.media.src ? (
            <div className="overflow-hidden rounded-lg border border-border-color">
              {project.media.type === "video" ? (
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  className="w-full"
                >
                  <source src={project.media.src} type="video/mp4" />
                </video>
              ) : project.media.type === "image" ? (
                <Image
                  src={project.media.src}
                  alt={project.name}
                  width={1100}
                  height={620}
                  priority
                  sizes="(max-width: 1100px) 100vw, 1100px"
                  className="w-full"
                  unoptimized={project.media.src.endsWith(".gif")}
                />
              ) : (
                <div className="aspect-video">
                  <ProjectPlaceholder
                    type={project.media.type}
                    label={project.id}
                  />
                </div>
              )}
            </div>
          ) : project.media?.enabled && project.media.type !== "video" && project.media.type !== "image" ? (
            <div className="overflow-hidden rounded-lg border border-border-color aspect-video">
              <ProjectPlaceholder
                type={project.media.type}
                label={project.id}
              />
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              <div className="md:row-span-2 flex flex-col items-center justify-center gap-2 rounded-lg border border-border-color bg-muted/30 text-muted-foreground"
                style={{ aspectRatio: "16/9" }}
              >
                <ImageIcon size={32} strokeWidth={1.5} />
                <span className="text-sm font-medium">{project.name}</span>
                <span className="text-xs">{t("screenshotPlaceholder")}</span>
              </div>
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
          )}
        </div>
      </Reveal>

      {/* Suite gallery (extra animated previews) */}
      {gallery.length > 0 && (
        <Reveal delay={100}>
          <div className="mb-16">
            <h2 className="mb-5 text-sm font-medium uppercase tracking-[0.08em] text-muted-foreground">
              {locale === "fr" ? "La suite" : "The suite"}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {gallery.map((item) => (
                <figure
                  key={item.src}
                  className="overflow-hidden rounded-lg border border-border-color"
                >
                  {item.src.endsWith(".mp4") ? (
                    <video
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload="metadata"
                      aria-label={item.caption[locale]}
                      className="w-full"
                    >
                      <source src={item.src} type="video/mp4" />
                    </video>
                  ) : (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={item.src}
                      alt={item.caption[locale]}
                      loading="lazy"
                      className="w-full"
                    />
                  )}
                  <figcaption className="px-4 py-3 text-sm text-muted-foreground">
                    {item.caption[locale]}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </Reveal>
      )}

      {/* Case study sections OR coming soon fallback */}
      {hasCaseStudy ? (
        <div className="flex flex-col gap-12">
          {sectionKeys.map((key, i) => {
            const section = sections[key];
            if (!section) return null;

            return (
              <Reveal key={key} delay={i * 60}>
                <SpotlightCard className="bg-muted/20 p-6 md:p-8" radius={400} opacity={0.06}>
                  <div className="flex items-baseline gap-4 mb-4">
                    <span className="font-mono text-xs text-muted-foreground">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="text-2xl font-semibold tracking-[-0.02em]">
                      {section.title}
                    </h3>
                  </div>
                  {section.type === "text" && section.body && (
                    <p className="max-w-[75ch] text-base leading-[1.75] text-muted-foreground">
                      {section.body}
                    </p>
                  )}
                  {section.type === "list" && section.items && (
                    <div className="flex flex-wrap gap-2">
                      {section.items.map((item) => (
                        <Tag key={item}>{item}</Tag>
                      ))}
                    </div>
                  )}
                </SpotlightCard>
              </Reveal>
            );
          })}
        </div>
      ) : (
        <Reveal>
          <div className="rounded-lg border border-border-color bg-muted/20 px-6 py-12 text-center">
            <p className="text-base text-muted-foreground">
              {t("caseStudyComingSoon")}
            </p>
          </div>
        </Reveal>
      )}

      {/* External links */}
      {projectLinks[slug] && projectLinks[slug].length > 0 && (
        <Reveal delay={80}>
          <div className="mt-12 flex flex-wrap gap-3">
            {projectLinks[slug].map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-md border border-border-color px-4 py-2.5 text-sm font-medium text-foreground hover:border-border-strong hover:bg-muted transition-colors"
              >
                {link.label} <ExternalLink size={14} />
              </a>
            ))}
          </div>
        </Reveal>
      )}

      {/* Project navigation */}
      <Reveal delay={100}>
        <div className="mt-20 border-t border-border-color pt-10 grid grid-cols-2 gap-4">
          {prevProject && (
            <Link href={`/projects/${prevProject.id}`} className="group">
              <div className="flex items-center gap-3">
                <ArrowLeft
                  size={20}
                  className="text-muted-foreground group-hover:text-accent transition-colors shrink-0"
                />
                <div>
                  <span className="text-sm text-muted-foreground">
                    {t("previousProject")}
                  </span>
                  <h4 className="text-lg font-medium group-hover:text-accent transition-colors">
                    {prevProject.name}
                  </h4>
                </div>
              </div>
            </Link>
          )}
          {nextProject && (
            <Link href={`/projects/${nextProject.id}`} className="group col-start-2">
              <div className="flex items-center justify-end gap-3 text-right">
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
                  className="text-muted-foreground group-hover:text-accent transition-colors shrink-0"
                />
              </div>
            </Link>
          )}
        </div>
      </Reveal>
    </article>
  );
}
