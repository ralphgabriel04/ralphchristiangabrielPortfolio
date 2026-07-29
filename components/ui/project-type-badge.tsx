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
 * founder, client mandate, academic team). A tinted pill + coloured lucide
 * icon keeps it visually distinct from the delivery-state pill (pulse dot).
 * Pass either a project `id` or an explicit `type`.
 */
export function ProjectTypeBadge({
  id,
  type,
  className = "",
}: {
  id?: string;
  type?: ProjectType;
  className?: string;
}) {
  const t = useTranslations("projects");
  const kind = type ?? projectType(id ?? "");
  const Icon = TYPE_ICON[kind];
  const color = typeColor[kind];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10.5px] font-medium uppercase tracking-[0.06em] ${className}`}
      style={{
        color,
        borderColor: `color-mix(in srgb, ${color} 38%, transparent)`,
        backgroundColor: `color-mix(in srgb, ${color} 9%, transparent)`,
      }}
    >
      <Icon size={12} strokeWidth={2} aria-hidden="true" />
      {t(`type.${kind}`)}
    </span>
  );
}
