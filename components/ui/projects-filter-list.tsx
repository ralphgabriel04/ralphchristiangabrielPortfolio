"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import {
  type Project,
  type ProjectState,
  projectState,
  stateColor,
  STATE_ORDER,
} from "@/lib/projects";
import { ProjectRow } from "@/components/ui/project-row";
import { PulseDot } from "@/components/ui/pulse-dot";

/**
 * Projects page list with state filters. Filtering is client-side over the
 * (serializable) project data; the full list renders on the server first, so
 * every project stays visible if JS never runs.
 */
export function ProjectsFilterList({ projects }: { projects: Project[] }) {
  const t = useTranslations("projects");
  const [active, setActive] = useState<ProjectState | "all">("all");

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: projects.length };
    for (const p of projects) {
      const s = projectState(p.id);
      c[s] = (c[s] ?? 0) + 1;
    }
    return c;
  }, [projects]);

  const shown =
    active === "all"
      ? projects
      : projects.filter((p) => projectState(p.id) === active);
  const statesWithItems = STATE_ORDER.filter((s) => (counts[s] ?? 0) > 0);

  function Pill({
    value,
    label,
    color,
  }: {
    value: ProjectState | "all";
    label: string;
    color?: string;
  }) {
    const isActive = active === value;
    return (
      <button
        type="button"
        onClick={() => setActive(value)}
        aria-pressed={isActive}
        className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 font-mono text-xs transition-colors ${
          isActive
            ? "border-transparent bg-foreground text-background"
            : "border-border-color text-muted-foreground hover:border-border-strong hover:text-foreground"
        }`}
      >
        {color && <PulseDot color={color} />}
        {label}
        <span className={isActive ? "text-background/60" : "text-muted-foreground/50"}>
          {counts[value] ?? 0}
        </span>
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-14">
      <div className="flex flex-wrap gap-2">
        <Pill value="all" label={t("filterAll")} />
        {statesWithItems.map((s) => (
          <Pill key={s} value={s} label={t(`state.${s}`)} color={stateColor[s]} />
        ))}
      </div>

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
    </div>
  );
}
