"use client";

import { openTerminal } from "@/components/ui/terminal";

/** Client button that opens the RG.SYS terminal — usable inside Server
 *  Components (e.g. the footer). */
export function TerminalTrigger({
  className = "",
  children,
  ariaLabel = "Terminal",
}: {
  className?: string;
  children: React.ReactNode;
  ariaLabel?: string;
}) {
  return (
    <button type="button" onClick={openTerminal} aria-label={ariaLabel} className={className}>
      {children}
    </button>
  );
}
