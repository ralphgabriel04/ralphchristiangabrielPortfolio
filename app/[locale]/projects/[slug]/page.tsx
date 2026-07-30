import type { Metadata } from "next";
import { alternatesFor } from "@/lib/site";
import { notFound } from "next/navigation";
import { useLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import {
  projects,
  projectLinks,
  projectGalleries,
  projectState,
  stateColor,
  type ProjectState,
} from "@/lib/projects";
import { caseStudies } from "@/lib/case-studies";
import { CaseSections } from "@/components/ui/case-study";
import { caseStudiesV2 } from "@/lib/case-studies-v2";
import { CaseStudyV2View } from "@/components/ui/case-study-v2";
import { ProjectTypeBadge } from "@/components/ui/project-type-badge";
import { Reveal } from "@/components/ui/reveal";
import { TrackView } from "@/components/ui/track-view";

const allSlugs = projects.map((p) => p.id);

// Same order as the homepage "Systèmes" grid (featured, then archive) → SYS-XX.
const FEATURED = ["the-mad-space", "cadence", "wise-wealthy", "dpm-elevate"];
const ordered = [
  ...FEATURED,
  ...projects.map((p) => p.id).filter((id) => !FEATURED.includes(id)),
];
const STATE_ICON: Record<ProjectState, string> = {
  production: "●",
  development: "◐",
  prototype: "◇",
  academic: "▤",
  planned: "○",
};

export function generateStaticParams() {
  return allSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = projects.find((p) => p.id === slug);
  if (!project) return {};
  const isFr = locale === "fr";
  return {
    title: project.name,
    description: project.summary[isFr ? "fr" : "en"].slice(0, 155),
    alternates: alternatesFor(locale, `/projects/${slug}`),
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  if (!allSlugs.includes(slug)) notFound();
  return <ProjectDetailContent slug={slug} />;
}

function ProjectDetailContent({ slug }: { slug: string }) {
  const locale = useLocale() as "fr" | "en";
  const fr = locale === "fr";

  const project = projects.find((p) => p.id === slug);
  if (!project) return null;

  const study = caseStudies[slug]?.[locale];
  const v2 = caseStudiesV2[slug]?.[locale] ?? null;
  const state = projectState(slug);
  const sysNum = String(ordered.indexOf(slug) + 1).padStart(2, "0");
  const gallery = projectGalleries[slug] ?? [];

  const links = projectLinks[slug] ?? [];
  const primary = links.find((l) => l.type === "live") ?? links[0];

  const idx = projects.findIndex((p) => p.id === slug);
  const nextProject = projects[(idx + 1) % projects.length];

  return (
    <article className="mx-auto max-w-[980px] px-[var(--page-pad)] pb-24 pt-16 md:pt-24">
      <TrackView event="project_view" props={{ project: slug }} />

      {/* Back */}
      <Reveal>
        <Link
          href="/projects"
          className="inline-flex items-center gap-1.5 font-mono text-[12.5px] text-muted-foreground transition-colors hover:text-foreground"
        >
          <span aria-hidden="true">←</span> {fr ? "Retour" : "Back"}
        </Link>
      </Reveal>

      {/* Header */}
      <Reveal delay={60}>
        <div className="mt-7 flex flex-wrap items-center gap-x-3.5 gap-y-1 font-mono text-xs">
          <span className="text-accent">SYS–{sysNum}</span>
          <span className="text-muted-foreground">{fr ? "Étude de cas" : "Case study"}</span>
          <ProjectTypeBadge id={slug} />
          <span className="ml-auto flex items-center gap-2 text-muted-foreground">
            <span style={{ color: stateColor[state] }}>{STATE_ICON[state]}</span>
            {v2 ? v2.identity.maturityLabel : project.status[locale]}
          </span>
        </div>

        <h1
          className="mt-3.5 text-[42px] leading-none tracking-[-0.01em] md:text-[72px]"
          style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}
        >
          {project.name}
        </h1>

        {!v2 && (
          <>
            <p className="mt-4 max-w-[60ch] text-[16px] leading-relaxed text-muted-foreground">
              {project.summary[locale]}
            </p>

            {/* Meta strip */}
            {study && (
              <div className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border-color bg-border-color sm:grid-cols-4">
                {study.meta.map((m, i) => (
                  <div key={i} className="bg-muted px-4 py-3.5">
                    <div className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-muted-foreground">
                      {m.k}
                    </div>
                    <div className="mt-1 text-[13.5px] font-semibold">{m.v}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Primary link */}
            {primary && (
              <div className="mt-5">
                <a
                  href={primary.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline"
                >
                  {primary.label} <ArrowUpRight size={15} />
                </a>
              </div>
            )}
          </>
        )}
      </Reveal>

      {/* Media */}
      {project.media?.enabled && project.media.src && (
        <Reveal delay={90}>
          <figure className="mt-10 overflow-hidden rounded-2xl border border-border-color bg-muted">
            {project.media.type === "video" ? (
              <video
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                poster={project.media.src.replace(/\.mp4$/, "-poster.jpg")}
                className="w-full"
              >
                <source src={project.media.src} type="video/mp4" />
              </video>
            ) : (
              <Image
                src={project.media.src}
                alt={project.name}
                width={1100}
                height={620}
                priority
                sizes="(max-width: 980px) 100vw, 980px"
                className="w-full"
                unoptimized={project.media.src.endsWith(".gif")}
              />
            )}
          </figure>
        </Reveal>
      )}

      {/* Sections */}
      {v2 ? (
        <Reveal>
          <CaseStudyV2View study={v2} locale={locale} />
        </Reveal>
      ) : study ? (
        <CaseSections sections={study.sections} locale={locale} />
      ) : (
        <Reveal>
          <div className="mt-12 rounded-2xl border border-border-color bg-muted/40 px-6 py-12 text-center text-muted-foreground">
            {fr
              ? "Le résumé et les liens ci-dessus couvrent l'essentiel de ce projet. Une étude de cas détaillée peut suivre."
              : "The summary and links above cover the essentials of this project. A detailed case study may follow."}
          </div>
        </Reveal>
      )}

      {/* Suite gallery */}
      {gallery.length > 0 && (
        <Reveal delay={80}>
          <div className="pt-12 md:pt-16">
            <div className="flex items-baseline gap-3.5 border-b border-border-strong pb-3">
              <span className="font-mono text-xs text-accent">→</span>
              <h2
                className="text-2xl leading-[1.05] tracking-[-0.01em] md:text-[38px]"
                style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}
              >
                {fr ? "La suite" : "The suite"}
              </h2>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {gallery.map((item) => (
                <figure key={item.src} className="overflow-hidden rounded-2xl border border-border-color bg-muted">
                  {item.src.endsWith(".mp4") ? (
                    <video
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload="metadata"
                      poster={item.src.replace(/\.mp4$/, "-poster.jpg")}
                      aria-label={item.caption[locale]}
                      className="w-full"
                    >
                      <source src={item.src} type="video/mp4" />
                    </video>
                  ) : (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={item.src} alt={item.caption[locale]} loading="lazy" className="w-full" />
                  )}
                  <figcaption className="px-4 py-3 text-[13px] text-muted-foreground">
                    {item.caption[locale]}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </Reveal>
      )}

      {/* Footer: back + next case */}
      <Reveal delay={80}>
        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-border-color pt-6">
          <Link
            href="/projects"
            className="font-mono text-[13px] font-semibold text-muted-foreground transition-colors hover:text-foreground"
          >
            ← {fr ? "Tous les projets" : "All projects"}
          </Link>
          {nextProject && (
            <Link
              href={`/projects/${nextProject.id}`}
              className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-accent hover:underline"
            >
              {fr ? "Étude suivante" : "Next case"}: {nextProject.name} <ArrowRight size={14} />
            </Link>
          )}
        </div>
      </Reveal>
    </article>
  );
}
