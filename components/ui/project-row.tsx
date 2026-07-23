import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import {
  type Project,
  caseStudyIds,
  projectLinks,
  projectState,
  stateColor,
} from "@/lib/projects";
import { ProjectPlaceholder } from "@/components/ui/project-placeholder";
import { Badge } from "@/components/ui/badge";
import { PulseDot } from "@/components/ui/pulse-dot";
import { Tag } from "@/components/ui/tag";

/** Split a metric string like "~15 000 LOC" into a big number + label.
 *  Falls back to no-number when the metric doesn't start with a figure. */
function splitMetric(s: string): { num: string; label: string } {
  const m = s.match(/^([~<>≈]?\s?\d[\d\s.,/+–—-]*\+?%?)\s+(.+)$/u);
  return m ? { num: (m[1] ?? "").trim(), label: (m[2] ?? "").trim() } : { num: "", label: s };
}

/**
 * Editorial, alternating project row: large media on one side, details on the
 * other (side swaps via `reverse`). Shared by the homepage and the projects
 * page. Reads project data by locale; content stays visible without JS.
 */
export function ProjectRow({
  project,
  index,
  reverse = false,
}: {
  project: Project;
  index: number;
  reverse?: boolean;
}) {
  const t = useTranslations("projects");
  const locale = useLocale() as "fr" | "en";

  const hasMedia = (project.media?.enabled ?? false) && !!project.media?.src;
  const state = projectState(project.id);
  const isCase = caseStudyIds.has(project.id);
  const live = projectLinks[project.id]?.find((l) => l.type === "live")?.url;
  const metrics = project.metrics[locale].slice(0, 3);

  return (
    <div className="grid items-center gap-8 md:grid-cols-2 md:gap-14">
      {hasMedia && project.media && (
        <div className={reverse ? "md:order-2" : ""}>
          <ProjectPlaceholder
            type={project.media.type}
            label={project.id}
            src={project.media.src}
          />
        </div>
      )}

      <div
        className={`flex flex-col gap-5 ${
          hasMedia ? (reverse ? "md:order-1" : "") : "md:col-span-2"
        }`}
      >
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <span className="font-mono tabular-nums text-muted-foreground/50">
            {String(index).padStart(2, "0")}
          </span>
          <span className="font-mono text-muted-foreground">{project.year}</span>
          <Badge>
            <PulseDot color={stateColor[state]} />
            {t(`state.${state}`)}
          </Badge>
        </div>

        <div>
          <h3
            className="text-3xl leading-[1.05] tracking-[-0.01em] md:text-[40px]"
            style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}
          >
            {project.name}
          </h3>
          <p className="mt-2 text-base text-muted-foreground">
            {project.tag[locale]}
          </p>
        </div>

        <p className="max-w-[54ch] leading-relaxed text-muted-foreground">
          {project.summary[locale]}
        </p>

        <div className="flex flex-wrap gap-1.5">
          {project.stack.slice(0, 8).map((tech) => (
            <Tag key={tech}>{tech}</Tag>
          ))}
        </div>

        {metrics.length > 0 && (
          <div className="flex flex-wrap gap-x-8 gap-y-3 pt-1">
            {metrics.map((mstr, i) => {
              const { num, label } = splitMetric(mstr);
              return (
                <div key={i} className="flex flex-col">
                  {num && (
                    <span className="font-mono text-lg font-semibold tracking-[-0.02em] text-foreground">
                      {num}
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground">{label}</span>
                </div>
              );
            })}
          </div>
        )}

        {(isCase || live) && (
          <div className="flex flex-wrap items-center gap-6 pt-1">
            {isCase && (
              <Link
                href={`/projects/${project.id}`}
                className="inline-flex items-center gap-1 border-b border-accent/40 pb-0.5 text-sm font-medium text-accent transition-colors hover:border-accent"
              >
                {t("caseStudyLink")} <ArrowRight size={14} />
              </Link>
            )}
            {live && (
              <a
                href={live}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 border-b border-border-strong pb-0.5 text-sm font-medium text-foreground transition-colors hover:border-foreground"
              >
                {t("viewLive")} <ArrowUpRight size={14} />
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
