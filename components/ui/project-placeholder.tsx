import type { ProjectMedia } from "@/lib/projects";
import { LazyVideo } from "@/components/ui/lazy-video";

function GanttPlaceholder() {
  return (
    <svg viewBox="0 0 280 160" fill="none" className="w-full h-full">
      {/* Grid lines */}
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <line
          key={`v${i}`}
          x1={40 + i * 40}
          y1={15}
          x2={40 + i * 40}
          y2={140}
          stroke="currentColor"
          strokeOpacity={0.08}
          strokeWidth={1}
        />
      ))}
      {/* Gantt bars */}
      <rect x={40} y={22} width={160} height={14} rx={2} fill="currentColor" fillOpacity={0.7} />
      <rect x={80} y={44} width={120} height={14} rx={2} fill="currentColor" fillOpacity={0.45} />
      <rect x={40} y={66} width={80} height={14} rx={2} fill="currentColor" fillOpacity={0.25} />
      {/* Overlapping detail block */}
      <rect x={60} y={90} width={180} height={48} rx={4} fill="currentColor" fillOpacity={0.04} stroke="currentColor" strokeOpacity={0.1} />
      <rect x={72} y={100} width={100} height={8} rx={1} fill="currentColor" fillOpacity={0.15} />
      <rect x={72} y={114} width={60} height={8} rx={1} fill="currentColor" fillOpacity={0.4} />
      <rect x={140} y={114} width={40} height={8} rx={1} fill="currentColor" fillOpacity={0.12} />
      <rect x={190} y={114} width={38} height={8} rx={1} fill="currentColor" fillOpacity={0.55} />
    </svg>
  );
}

function BarChartPlaceholder() {
  const bars = [
    { h: 30, opacity: 0.15 },
    { h: 45, opacity: 0.2 },
    { h: 35, opacity: 0.15 },
    { h: 70, opacity: 0.35 },
    { h: 55, opacity: 0.25 },
    { h: 85, opacity: 0.55 },
    { h: 100, opacity: 0.7 },
  ];

  return (
    <svg viewBox="0 0 280 160" fill="none" className="w-full h-full">
      <text x={14} y={18} fontSize={9} fontFamily="var(--font-mono)" fill="currentColor" fillOpacity={0.3} letterSpacing={1.5}>
        VOLUME / WEEK
      </text>
      {/* Baseline */}
      <line x1={30} y1={140} x2={265} y2={140} stroke="currentColor" strokeOpacity={0.1} />
      {/* Bars */}
      {bars.map((bar, i) => (
        <rect
          key={i}
          x={38 + i * 32}
          y={140 - bar.h}
          width={22}
          height={bar.h}
          rx={2}
          fill="currentColor"
          fillOpacity={bar.opacity}
        />
      ))}
    </svg>
  );
}

function KanbanPlaceholder() {
  return (
    <svg viewBox="0 0 280 160" fill="none" className="w-full h-full">
      {/* Column headers */}
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x={14 + i * 90} y={12} width={78} height={10} rx={2} fill="currentColor" fillOpacity={0.12} />
          <line x1={14 + i * 90} y1={28} x2={92 + i * 90} y2={28} stroke="currentColor" strokeOpacity={0.08} />
        </g>
      ))}
      {/* Cards col 1 */}
      <rect x={14} y={34} width={78} height={28} rx={3} fill="currentColor" fillOpacity={0.06} stroke="currentColor" strokeOpacity={0.1} />
      <rect x={22} y={42} width={40} height={5} rx={1} fill="currentColor" fillOpacity={0.2} />
      <rect x={22} y={51} width={55} height={4} rx={1} fill="currentColor" fillOpacity={0.1} />
      <rect x={14} y={68} width={78} height={28} rx={3} fill="currentColor" fillOpacity={0.06} stroke="currentColor" strokeOpacity={0.1} />
      <rect x={22} y={76} width={50} height={5} rx={1} fill="currentColor" fillOpacity={0.2} />
      <rect x={22} y={85} width={35} height={4} rx={1} fill="currentColor" fillOpacity={0.1} />
      <rect x={14} y={102} width={78} height={28} rx={3} fill="currentColor" fillOpacity={0.06} stroke="currentColor" strokeOpacity={0.1} />
      <rect x={22} y={110} width={45} height={5} rx={1} fill="currentColor" fillOpacity={0.2} />
      {/* Cards col 2 */}
      <rect x={104} y={34} width={78} height={28} rx={3} fill="currentColor" fillOpacity={0.06} stroke="currentColor" strokeOpacity={0.1} />
      <rect x={112} y={42} width={48} height={5} rx={1} fill="currentColor" fillOpacity={0.3} />
      <rect x={112} y={51} width={30} height={4} rx={1} fill="currentColor" fillOpacity={0.1} />
      <rect x={104} y={68} width={78} height={28} rx={3} fill="currentColor" fillOpacity={0.06} stroke="currentColor" strokeOpacity={0.1} />
      <rect x={112} y={76} width={55} height={5} rx={1} fill="currentColor" fillOpacity={0.3} />
      {/* Cards col 3 */}
      <rect x={194} y={34} width={78} height={28} rx={3} fill="currentColor" fillOpacity={0.06} stroke="currentColor" strokeOpacity={0.1} />
      <rect x={202} y={42} width={42} height={5} rx={1} fill="currentColor" fillOpacity={0.5} />
      <rect x={202} y={51} width={60} height={4} rx={1} fill="currentColor" fillOpacity={0.15} />
    </svg>
  );
}

function CalendarPlaceholder() {
  return (
    <svg viewBox="0 0 280 160" fill="none" className="w-full h-full">
      {/* Header */}
      <rect x={20} y={12} width={60} height={8} rx={2} fill="currentColor" fillOpacity={0.15} />
      {/* Day labels */}
      {["L", "M", "M", "J", "V", "S", "D"].map((d, i) => (
        <text key={i} x={32 + i * 34} y={38} fontSize={8} fontFamily="var(--font-mono)" fill="currentColor" fillOpacity={0.2} textAnchor="middle">
          {d}
        </text>
      ))}
      {/* Grid cells */}
      {[0, 1, 2, 3].map((row) =>
        [0, 1, 2, 3, 4, 5, 6].map((col) => {
          const highlighted = (row === 1 && col === 2) || (row === 2 && col === 4) || (row === 0 && col === 5);
          return (
            <rect
              key={`${row}-${col}`}
              x={14 + col * 34}
              y={44 + row * 28}
              width={30}
              height={24}
              rx={3}
              fill="currentColor"
              fillOpacity={highlighted ? 0.12 : 0.03}
              stroke="currentColor"
              strokeOpacity={0.06}
            />
          );
        })
      )}
    </svg>
  );
}

function TerminalPlaceholder() {
  return (
    <svg viewBox="0 0 280 160" fill="none" className="w-full h-full">
      {/* Window chrome */}
      <circle cx={20} cy={16} r={4} fill="currentColor" fillOpacity={0.15} />
      <circle cx={34} cy={16} r={4} fill="currentColor" fillOpacity={0.1} />
      <circle cx={48} cy={16} r={4} fill="currentColor" fillOpacity={0.1} />
      <line x1={14} y1={28} x2={266} y2={28} stroke="currentColor" strokeOpacity={0.08} />
      {/* Terminal lines */}
      <rect x={20} y={38} width={8} height={7} rx={1} fill="currentColor" fillOpacity={0.3} />
      <rect x={34} y={38} width={90} height={7} rx={1} fill="currentColor" fillOpacity={0.15} />
      <rect x={20} y={52} width={8} height={7} rx={1} fill="currentColor" fillOpacity={0.3} />
      <rect x={34} y={52} width={140} height={7} rx={1} fill="currentColor" fillOpacity={0.12} />
      <rect x={20} y={66} width={8} height={7} rx={1} fill="currentColor" fillOpacity={0.3} />
      <rect x={34} y={66} width={60} height={7} rx={1} fill="currentColor" fillOpacity={0.4} />
      <rect x={100} y={66} width={40} height={7} rx={1} fill="currentColor" fillOpacity={0.15} />
      <rect x={20} y={80} width={8} height={7} rx={1} fill="currentColor" fillOpacity={0.3} />
      <rect x={34} y={80} width={110} height={7} rx={1} fill="currentColor" fillOpacity={0.1} />
      <rect x={20} y={94} width={8} height={7} rx={1} fill="currentColor" fillOpacity={0.3} />
      <rect x={34} y={94} width={70} height={7} rx={1} fill="currentColor" fillOpacity={0.5} />
      {/* Cursor blink */}
      <rect x={20} y={114} width={8} height={7} rx={1} fill="currentColor" fillOpacity={0.3} />
      <rect x={34} y={114} width={6} height={7} rx={1} fill="currentColor" fillOpacity={0.6} />
    </svg>
  );
}

const placeholders: Record<string, () => React.JSX.Element> = {
  "gantt": GanttPlaceholder,
  "bar-chart": BarChartPlaceholder,
  "kanban": KanbanPlaceholder,
  "calendar": CalendarPlaceholder,
  "terminal": TerminalPlaceholder,
};

export function ProjectPlaceholder({
  type,
  label,
  src,
}: {
  type: ProjectMedia["type"];
  label: string;
  src?: string;
}) {
  if (type === "video" && src) {
    return (
      <LazyVideo
        src={src}
        poster={src.replace(/\.mp4$/, "-poster.jpg")}
        className="relative rounded-md border border-border-color overflow-hidden aspect-[4/3] md:aspect-auto bg-muted-2"
      />
    );
  }

  if (type === "image" && src) {
    return (
      <div className="relative rounded-md border border-border-color overflow-hidden aspect-[4/3] md:aspect-auto bg-muted-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={label}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  const Viz = placeholders[type] ?? GanttPlaceholder;

  return (
    <div className="relative flex flex-col justify-between rounded-md bg-muted-2 border border-border-color overflow-hidden aspect-[4/3] md:aspect-auto">
      <div className="flex-1 flex items-center justify-center p-4 text-foreground">
        <Viz />
      </div>
      <span className="block px-4 pb-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground/50 text-right">
        {label} · placeholder
      </span>
    </div>
  );
}
