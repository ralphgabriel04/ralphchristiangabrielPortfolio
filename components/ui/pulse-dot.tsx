export function PulseDot({ color }: { color?: string }) {
  // Default: emerald (availability). Pass a CSS color/var for status tones.
  const c = color ?? "#10b981";
  return (
    <span
      className="relative inline-block w-[7px] h-[7px] rounded-full shrink-0"
      style={{ backgroundColor: c }}
    >
      <span
        className="absolute inset-[-3px] rounded-full opacity-40 animate-[pulse_1.8s_ease-out_infinite] motion-reduce:animate-none"
        style={{ backgroundColor: c }}
        aria-hidden="true"
      />
    </span>
  );
}
