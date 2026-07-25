"use client";

import { useTheme } from "next-themes";
import { Printer } from "lucide-react";

/** Prints the page; if in dark mode, switches to light first (cleaner print),
 *  then restores. Mirrors the v2 recruiter-view print behaviour. */
export function PrintButton({ label }: { label: string }) {
  const { setTheme } = useTheme();

  const onPrint = () => {
    const wasDark =
      typeof document !== "undefined" &&
      document.documentElement.classList.contains("dark");
    if (wasDark) setTheme("light");
    setTimeout(() => {
      window.print();
      if (wasDark) setTimeout(() => setTheme("dark"), 400);
    }, 200);
  };

  return (
    <button
      type="button"
      onClick={onPrint}
      className="inline-flex items-center gap-1.5 rounded-lg border border-border-strong px-4 py-2 text-[13.5px] font-medium text-foreground transition-colors hover:border-accent hover:text-accent"
    >
      <Printer size={14} /> {label}
    </button>
  );
}
