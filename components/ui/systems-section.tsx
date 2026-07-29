"use client";

import { useRef, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import {
  type Project,
  projects,
  projectLinks,
  projectState,
  stateColor,
  caseStudyIds,
} from "@/lib/projects";
import { LazyVideo } from "@/components/ui/lazy-video";
import { ProjectTypeBadge } from "@/components/ui/project-type-badge";
import { usePlain } from "@/components/ui/plain-mode";
import { plainSummary, techPlainOf } from "@/lib/plain";

const FEATURED = ["the-mad-space", "cadence", "wise-wealthy", "dpm-elevate"];
const STATE_ICON: Record<string, string> = {
  production: "●",
  development: "◐",
  prototype: "◇",
  academic: "▤",
  planned: "○",
};

function metricParts(s: string): { v: string; l: string } {
  const m = s.match(/^([~<>≈]?\s?\d[\d\s.,/+–—-]*\+?%?)\s+(.+)$/u);
  return m ? { v: (m[1] ?? "").trim(), l: (m[2] ?? "").trim() } : { v: "", l: s };
}

/** Stack chip. In plain mode, techs with a plain-language definition get a
 *  hover/focus tooltip explaining them in everyday words. */
function TechChip({ tech }: { tech: string }) {
  const { plain } = usePlain();
  const locale = useLocale() as "fr" | "en";
  const def = plain ? techPlainOf(tech) : null;

  if (!def)
    return (
      <span className="rounded-full border border-border-color px-2.5 py-1 font-mono text-[11px] text-muted-foreground">
        {tech}
      </span>
    );

  return (
    <span className="group/tech relative z-10 inline-block">
      <span
        tabIndex={0}
        data-cur
        className="inline-block cursor-help rounded-full border border-dashed border-accent/70 px-2.5 py-1 font-mono text-[11px] text-muted-foreground transition-colors hover:border-accent hover:text-foreground focus-visible:border-accent focus-visible:text-foreground"
      >
        {tech}
      </span>
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-2 w-52 max-w-[70vw] -translate-x-1/2 rounded-lg border border-border-strong bg-muted px-3 py-2 text-left text-[12px] font-normal not-italic leading-snug text-foreground opacity-0 shadow-md transition-opacity duration-150 group-hover/tech:opacity-100 group-focus-within/tech:opacity-100"
      >
        {def[locale]}
      </span>
    </span>
  );
}

/** Featured card with a cursor-following accent glow ("lueur"). */
function GlowCard({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const onMove = (e: React.MouseEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--gx", `${e.clientX - r.left}px`);
    el.style.setProperty("--gy", `${e.clientY - r.top}px`);
  };
  return (
    <article ref={ref} onMouseMove={onMove} data-cur className={`rg-glow cursor-pointer ${className}`}>
      {children}
      <span aria-hidden="true" className="rg-glow-layer" />
    </article>
  );
}

/** v2 "Systèmes" section: featured bento cards + an expandable SYS archive. */
export function SystemsSection() {
  const t = useTranslations("projects");
  const locale = useLocale() as "fr" | "en";
  const { plain } = usePlain();
  const [open, setOpen] = useState<string | null>(null);

  // Floating hover-preview thumbnail for archive rows (imperative → no re-render
  // per mousemove). Fine-pointer only; hidden on touch via `md:block`.
  const prevRef = useRef<HTMLDivElement>(null);
  const prevImgRef = useRef<HTMLImageElement>(null);
  const previewSrc = (p: Project): string | null => {
    if (!p.media?.enabled || !p.media.src) return null;
    return p.media.type === "video"
      ? p.media.src.replace(/\.mp4$/, "-poster.jpg")
      : p.media.src;
  };
  const showPreview = (src: string | null) => {
    const el = prevRef.current;
    if (!el || !src) return;
    if (prevImgRef.current) prevImgRef.current.src = src;
    el.style.opacity = "1";
  };
  const movePreview = (e: React.MouseEvent) => {
    const el = prevRef.current;
    if (!el) return;
    const x = Math.min(e.clientX + 24, window.innerWidth - 248);
    const y = Math.min(Math.max(e.clientY - 70, 12), window.innerHeight - 160);
    el.style.transform = `translate(${x}px, ${y}px)`;
  };
  const hidePreview = () => {
    const el = prevRef.current;
    if (el) el.style.opacity = "0";
  };

  const summaryOf = (p: Project) =>
    plain && plainSummary[p.id] ? plainSummary[p.id]![locale] : p.summary[locale];

  const featured = FEATURED.map((id) => projects.find((p) => p.id === id)).filter(
    (p): p is Project => !!p,
  );
  const archive = projects.filter((p) => !FEATURED.includes(p.id));
  const ordered = [...featured, ...archive];
  const sys = (p: Project) => String(ordered.indexOf(p) + 1).padStart(2, "0");
  const first = featured[0];
  const rest = featured.slice(1);
  if (!first) return null;

  const Chrome = ({ label }: { label: string }) => (
    <div className="flex items-center gap-1.5 border-b border-border-color px-3.5 py-2.5">
      <span className="h-2 w-2 rounded-full bg-border-strong" />
      <span className="h-2 w-2 rounded-full bg-border-strong" />
      <span className="h-2 w-2 rounded-full bg-border-strong" />
      <span className="ml-2 truncate font-mono text-[10.5px] text-muted-foreground">{label}</span>
    </div>
  );

  const Media = ({ p }: { p: Project }) => {
    if (!p.media?.enabled || !p.media.src) return null;
    if (p.media.type === "video")
      return (
        <LazyVideo
          src={p.media.src}
          poster={p.media.src.replace(/\.mp4$/, "-poster.jpg")}
          className="aspect-video w-full bg-muted-2"
        />
      );
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={p.media.src}
        alt={p.name}
        loading="lazy"
        className="aspect-video w-full object-cover object-top"
      />
    );
  };

  const Status = ({ id }: { id: string }) => {
    const s = projectState(id);
    return (
      <span className="flex items-center gap-1.5 font-mono text-[11.5px] text-muted-foreground">
        <span style={{ color: stateColor[s] }}>{STATE_ICON[s]}</span>
        {t(`state.${s}`)}
      </span>
    );
  };

  const Links = ({ p, size = 14 }: { p: Project; size?: number }) => {
    const live = projectLinks[p.id]?.find((l) => l.type === "live")?.url;
    return (
      <div className="mt-auto flex flex-wrap gap-4 border-t border-border-color pt-3 text-[13.5px] font-semibold">
        {caseStudyIds.has(p.id) && (
          // Stretched link: the ::after covers the whole card, so clicking
          // anywhere on the card opens the case study.
          <Link
            href={`/projects/${p.id}`}
            aria-label={`${t("caseStudyLink")} — ${p.name}`}
            className="inline-flex items-center gap-1.5 text-accent hover:underline after:absolute after:inset-0 after:z-0 after:content-['']"
          >
            {t("caseStudyLink")} <ArrowRight size={size} />
          </Link>
        )}
        {live && (
          <a
            href={live}
            target="_blank"
            rel="noreferrer"
            className="relative z-10 inline-flex items-center gap-1.5 text-foreground hover:underline"
          >
            {t("viewLive")} <ArrowUpRight size={size} />
          </a>
        )}
      </div>
    );
  };

  const Body = ({ p }: { p: Project }) => {
    const metrics = p.metrics[locale].slice(0, 3).map(metricParts);
    return (
      <div className="flex flex-1 flex-col gap-3.5 p-6 md:p-7">
        <div className="flex items-center justify-between gap-2 font-mono text-[11.5px]">
          <div className="flex items-center gap-2">
            <span style={{ color: "var(--accent)" }}>SYS–{sys(p)}</span>
            <ProjectTypeBadge id={p.id} />
          </div>
          <Status id={p.id} />
        </div>
        <div>
          <h3 className="text-2xl md:text-[26px]" style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}>
            {p.name}
          </h3>
          <div className="mt-1 font-mono text-[11px] text-muted-foreground">
            {p.tag[locale]} · {p.year}
          </div>
        </div>
        <p className="max-w-[58ch] text-sm leading-relaxed text-muted-foreground">{summaryOf(p)}</p>
        {metrics.length > 0 && (
          <div className="grid grid-cols-3 gap-px overflow-hidden rounded-lg border border-border-color bg-border-color">
            {metrics.map((m, i) => (
              <div key={i} className="bg-muted p-2.5">
                <div className="font-mono text-sm font-medium text-accent">{m.v || m.l}</div>
                {m.v && <div className="mt-0.5 text-[11px] text-muted-foreground">{m.l}</div>}
              </div>
            ))}
          </div>
        )}
        <div className="flex flex-wrap gap-1.5">
          {p.stack.slice(0, 5).map((tech) => (
            <TechChip key={tech} tech={tech} />
          ))}
        </div>
        <Links p={p} />
      </div>
    );
  };

  return (
    <>
      {/* Featured bento */}
      <div className="mt-10 flex flex-col gap-4 md:mt-14">
        <GlowCard className="grid grid-cols-1 overflow-hidden rounded-2xl border border-border-color bg-muted md:grid-cols-2">
          <div className="border-b border-border-color md:border-b-0 md:border-r">
            <Chrome label={first.tag[locale]} />
            <Media p={first} />
          </div>
          <Body p={first} />
        </GlowCard>
        <div className="grid gap-4 md:grid-cols-2">
          {rest.map((p) => (
            <GlowCard key={p.id} className="flex flex-col overflow-hidden rounded-2xl border border-border-color bg-muted">
              <div>
                <Chrome label={p.tag[locale]} />
                <Media p={p} />
              </div>
              <Body p={p} />
            </GlowCard>
          ))}
        </div>
      </div>

      {/* Archive */}
      <div className="mt-10">
        <div className="mb-3 flex items-center justify-between gap-4">
          <span className="font-mono text-[11.5px] uppercase tracking-[0.14em] text-muted-foreground">
            {locale === "fr" ? "Autres systèmes" : "Other systems"}
          </span>
          <span className="hidden font-mono text-[11px] text-muted-foreground sm:inline">
            {locale === "fr" ? "clique une ligne pour le détail" : "click a row for detail"}
          </span>
        </div>
        <div className="overflow-hidden rounded-2xl border border-border-color">
          {archive.map((p) => {
            const isOpen = open === p.id;
            const s = projectState(p.id);
            const live =
              projectLinks[p.id]?.find((l) => l.type === "live")?.url ??
              projectLinks[p.id]?.[0]?.url;
            return (
              <div key={p.id} className="border-b border-border-color last:border-b-0">
                <button
                  type="button"
                  onClick={() => {
                    hidePreview();
                    setOpen(isOpen ? null : p.id);
                  }}
                  onMouseEnter={(e) => {
                    if (!isOpen) {
                      showPreview(previewSrc(p));
                      movePreview(e);
                    }
                  }}
                  onMouseMove={(e) => {
                    if (!isOpen) movePreview(e);
                  }}
                  onMouseLeave={hidePreview}
                  aria-expanded={isOpen}
                  className="flex w-full items-center gap-3 px-4 pt-4 pb-2 text-left transition-colors hover:bg-muted/60 md:px-6"
                >
                  <span className="font-mono text-[11.5px]" style={{ color: "var(--accent)" }}>SYS–{sys(p)}</span>
                  <span
                    className="font-mono text-[11px] transition-transform duration-300"
                    style={{ color: isOpen ? "var(--accent)" : "var(--muted-foreground)", transform: isOpen ? "rotate(90deg)" : "none" }}
                  >
                    ▸
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="truncate text-sm font-semibold">{p.name}</span>
                      <ProjectTypeBadge id={p.id} className="hidden shrink-0 sm:inline-flex" />
                    </span>
                    <span className="block truncate font-mono text-[11px] text-muted-foreground">{p.tag[locale]}</span>
                  </span>
                  <span className="hidden items-center gap-1.5 font-mono text-[11.5px] text-muted-foreground sm:flex">
                    <span style={{ color: stateColor[s] }}>{STATE_ICON[s]}</span>
                    {p.year}
                  </span>
                </button>

                {/* Always-visible links (case study + landing/live) */}
                <div className="flex flex-wrap items-center justify-end gap-x-4 gap-y-1 px-4 pb-3.5 font-mono text-[12.5px] font-semibold md:px-6">
                  {caseStudyIds.has(p.id) && (
                    <Link
                      href={`/projects/${p.id}`}
                      className="inline-flex items-center gap-1 text-accent hover:underline"
                    >
                      {t("caseStudyLink")} <ArrowRight size={13} />
                    </Link>
                  )}
                  {live && (
                    <a
                      href={live}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-foreground hover:underline"
                    >
                      {t("viewLive")} <ArrowUpRight size={13} />
                    </a>
                  )}
                </div>
                <div
                  className="grid transition-[grid-template-rows] duration-500 ease-out motion-reduce:transition-none"
                  style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <div className="grid gap-6 bg-muted/40 px-4 pb-6 md:grid-cols-2 md:px-6">
                      <div className="flex flex-col gap-4">
                        <p className="max-w-[58ch] text-sm leading-relaxed text-muted-foreground">{summaryOf(p)}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {p.stack.slice(0, 6).map((tech) => (
                            <TechChip key={tech} tech={tech} />
                          ))}
                        </div>
                      </div>
                      {p.media?.enabled && p.media.src && (
                        <div className="self-start overflow-hidden rounded-xl border border-border-color">
                          <Chrome label={p.tag[locale]} />
                          <Media p={p} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating hover preview — shows the system's screenshot near the cursor */}
      <div
        ref={prevRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[120] hidden w-[224px] opacity-0 transition-opacity duration-150 will-change-transform md:block"
      >
        <div className="overflow-hidden rounded-lg border border-border-strong bg-muted shadow-md">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img ref={prevImgRef} alt="" className="aspect-video w-full bg-muted-2 object-cover object-top" />
        </div>
      </div>
    </>
  );
}
