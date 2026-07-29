import { Rocket, Flag, Handshake, GraduationCap, Sparkles, type LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { type ProjectType, projectType, typeColor } from "@/lib/projects";

const TYPE_ICON: Record<ProjectType, LucideIcon> = {
  cofounder: Rocket,
  founder: Flag,
  client: Handshake,
  academic: GraduationCap,
  personal: Sparkles,
};

/**
 * Compact role-type badge: how I was involved in a project (co-founder,
 * founder, client mandate, academic team, personal). A tinted pill + coloured
 * lucide icon, kept visually distinct from the delivery-state pill. Every badge
 * carries a native tooltip (its meaning); pass `describe` to also render a
 * styled hover tooltip (used as a legend). Pass a project `id` or a `type`.
 */
export function ProjectTypeBadge({
  id,
  type,
  className = "",
  describe = false,
}: {
  id?: string;
  type?: ProjectType;
  className?: string;
  describe?: boolean;
}) {
  const t = useTranslations("projects");
  const kind = type ?? projectType(id ?? "");
  const Icon = TYPE_ICON[kind];
  const color = typeColor[kind];
  const desc = t(`typeDesc.${kind}`);

  const badge = (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10.5px] font-medium uppercase tracking-[0.06em] ${className}`}
      style={{
        color,
        borderColor: `color-mix(in srgb, ${color} 38%, transparent)`,
        backgroundColor: `color-mix(in srgb, ${color} 9%, transparent)`,
      }}
      title={desc}
    >
      <Icon size={12} strokeWidth={2} aria-hidden="true" />
      {t(`type.${kind}`)}
    </span>
  );

  if (!describe) return badge;

  return (
    <span className="group/tb relative inline-block">
      {badge}
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-0 z-30 mb-2 w-60 max-w-[70vw] rounded-lg border border-border-strong bg-muted px-3 py-2 text-left font-sans text-[12px] font-normal normal-case not-italic leading-snug tracking-normal text-foreground opacity-0 shadow-md transition-opacity duration-150 group-hover/tb:opacity-100 group-focus-within/tb:opacity-100"
      >
        {desc}
      </span>
    </span>
  );
}
