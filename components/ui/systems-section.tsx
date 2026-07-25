"use client";

import { useState } from "react";
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
import { usePlain } from "@/components/ui/plain-mode";
import { plainSummary } from "@/lib/plain";

const FEATURED = ["the-mad-space", "cadence", "financej"];
const STATE_ICON: Record<string, string> = {
  production: "●",
  development: "◐",
  prototype: "◇",
  planned: "○",
};

function metricParts(s: string): { v: string; l: string } {
  const m = s.match(/^([~<>≈]?\s?\d[\d\s.,/+–—-]*\+?%?)\s+(.+)$/u);
  return m ? { v: (m[1] ?? "").trim(), l: (m[2] ?? "").trim() } : { v: "", l: s };
}

/** v2 "Systèmes" section: featured bento cards + an expandable SYS archive. */
export function SystemsSection() {
  const t = useTranslations("projects");
  const locale = useLocale() as "fr" | "en";
  const { plain } = usePlain();
  const [open, setOpen] = useState<string | null>(null);
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
          <Link href={`/projects/${p.id}`} className="inline-flex items-center gap-1.5 text-accent hover:underline">
            {t("caseStudyLink")} <ArrowRight size={size} />
          </Link>
        )}
        {live && (
          <a href={live} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-foreground hover:underline">
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
          <span style={{ color: "var(--accent)" }}>SYS–{sys(p)}</span>
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
            <span key={tech} className="rounded-full border border-border-color px-2.5 py-1 font-mono text-[11px] text-muted-foreground">
              {tech}
            </span>
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
        <article className="grid grid-cols-1 overflow-hidden rounded-2xl border border-border-color bg-muted md:grid-cols-2">
          <div className="border-b border-border-color md:border-b-0 md:border-r">
            <Chrome label={first.tag[locale]} />
            <Media p={first} />
          </div>
          <Body p={first} />
        </article>
        <div className="grid gap-4 md:grid-cols-2">
          {rest.map((p) => (
            <article key={p.id} className="flex flex-col overflow-hidden rounded-2xl border border-border-color bg-muted">
              <div>
                <Chrome label={p.tag[locale]} />
                <Media p={p} />
              </div>
              <Body p={p} />
            </article>
          ))}
        </div>
      </div>

      {/* Archive */}
      <div className="mt-10">
        <div className="mb-3 font-mono text-[11.5px] uppercase tracking-[0.14em] text-muted-foreground">
          {locale === "fr" ? "Archive · autres systèmes" : "Archive · other systems"}
        </div>
        <div className="overflow-hidden rounded-2xl border border-border-color">
          {archive.map((p) => {
            const isOpen = open === p.id;
            const s = projectState(p.id);
            return (
              <div key={p.id} className="border-b border-border-color last:border-b-0">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : p.id)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center gap-3 px-4 py-4 text-left transition-colors hover:bg-muted/60 md:px-6"
                >
                  <span className="font-mono text-[11.5px]" style={{ color: "var(--accent)" }}>SYS–{sys(p)}</span>
                  <span
                    className="font-mono text-[11px] transition-transform duration-300"
                    style={{ color: isOpen ? "var(--accent)" : "var(--muted-foreground)", transform: isOpen ? "rotate(90deg)" : "none" }}
                  >
                    ▸
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold">{p.name}</span>
                    <span className="block truncate font-mono text-[11px] text-muted-foreground">{p.tag[locale]}</span>
                  </span>
                  <span className="hidden items-center gap-1.5 font-mono text-[11.5px] text-muted-foreground sm:flex">
                    <span style={{ color: stateColor[s] }}>{STATE_ICON[s]}</span>
                    {p.year}
                  </span>
                </button>
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
                            <span key={tech} className="rounded-full border border-border-color px-2.5 py-1 font-mono text-[11px] text-muted-foreground">
                              {tech}
                            </span>
                          ))}
                        </div>
                        <Links p={p} size={13} />
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
    </>
  );
}
