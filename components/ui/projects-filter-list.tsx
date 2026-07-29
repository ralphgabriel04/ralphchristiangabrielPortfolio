"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import {
  type Project,
  type ProjectState,
  type ProjectType,
  projectState,
  projectType,
  stateColor,
  typeColor,
  STATE_ORDER,
  TYPE_ORDER,
} from "@/lib/projects";
import { ProjectRow } from "@/components/ui/project-row";
import { PulseDot } from "@/components/ui/pulse-dot";

/**
 * Projects page list with two independent filter dimensions: delivery **state**
 * (shipped / in dev / prototype …) and **role** (co-founder / founder / client /
 * team). Both filters combine with AND. Filtering is client-side over the
 * (serializable) project data; the full list renders on the server first, so
 * every project stays visible if JS never runs.
 */
export function ProjectsFilterList({ projects }: { projects: Project[] }) {
  const t = useTranslations("projects");
  const [state, setState] = useState<ProjectState | "all">("all");
  const [type, setType] = useState<ProjectType | "all">("all");

  const stateCounts = useMemo(() => {
    const c: Record<string, number> = { all: projects.length };
    for (const p of projects) {
      const s = projectState(p.id);
      c[s] = (c[s] ?? 0) + 1;
    }
    return c;
  }, [projects]);

  const typeCounts = useMemo(() => {
    const c: Record<string, number> = { all: projects.length };
    for (const p of projects) {
      const ty = projectType(p.id);
      c[ty] = (c[ty] ?? 0) + 1;
    }
    return c;
  }, [projects]);

  const shown = projects.filter(
    (p) =>
      (state === "all" || projectState(p.id) === state) &&
      (type === "all" || projectType(p.id) === type),
  );
  const statesWithItems = STATE_ORDER.filter((s) => (stateCounts[s] ?? 0) > 0);
  const typesWithItems = TYPE_ORDER.filter((ty) => (typeCounts[ty] ?? 0) > 0);

  function Pill({
    isActive,
    onClick,
    label,
    count,
    color,
    title,
  }: {
    isActive: boolean;
    onClick: () => void;
    label: string;
    count: number;
    color?: string;
    title?: string;
  }) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={isActive}
        title={title}
        className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 font-mono text-xs transition-colors ${
          isActive
            ? "border-transparent bg-foreground text-background"
            : "border-border-color text-muted-foreground hover:border-border-strong hover:text-foreground"
        }`}
      >
        {color && <PulseDot color={color} />}
        {label}
        <span className={isActive ? "text-background/60" : "text-muted-foreground/50"}>
          {count}
        </span>
      </button>
    );
  }

  const groupLabel =
    "shrink-0 font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted-foreground/70";

  return (
    <div className="flex flex-col gap-14">
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className={groupLabel}>{t("filterState")}</span>
          <Pill
            isActive={state === "all"}
            onClick={() => setState("all")}
            label={t("filterAll")}
            count={stateCounts.all ?? 0}
          />
          {statesWithItems.map((s) => (
            <Pill
              key={s}
              isActive={state === s}
              onClick={() => setState(s)}
              label={t(`state.${s}`)}
              count={stateCounts[s] ?? 0}
              color={stateColor[s]}
            />
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className={groupLabel}>{t("filterType")}</span>
          <Pill
            isActive={type === "all"}
            onClick={() => setType("all")}
            label={t("filterAll")}
            count={typeCounts.all ?? 0}
          />
          {typesWithItems.map((ty) => (
            <Pill
              key={ty}
              isActive={type === ty}
              onClick={() => setType(ty)}
              label={t(`type.${ty}`)}
              count={typeCounts[ty] ?? 0}
              color={typeColor[ty]}
              title={t(`typeDesc.${ty}`)}
            />
          ))}
        </div>
      </div>

      {shown.length === 0 ? (
        <p className="font-mono text-sm text-muted-foreground">
          {t("filterAll")} — 0
        </p>
      ) : (
        <div className="flex flex-col gap-16 md:gap-24">
          {shown.map((p, i) => (
            <div
              key={p.id}
              className="border-t border-border-color pt-16 first:border-t-0 first:pt-0 md:pt-24"
            >
              <ProjectRow project={p} index={i + 1} reverse={i % 2 === 1} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
