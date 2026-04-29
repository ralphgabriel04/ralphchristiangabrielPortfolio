export function PulseDot() {
  return (
    <span className="relative inline-block w-[7px] h-[7px] rounded-full bg-emerald-500 shrink-0">
      <span
        className="absolute inset-[-3px] rounded-full bg-emerald-500 opacity-40 animate-[pulse_1.8s_ease-out_infinite] motion-reduce:animate-none"
        aria-hidden="true"
      />
    </span>
  );
}
