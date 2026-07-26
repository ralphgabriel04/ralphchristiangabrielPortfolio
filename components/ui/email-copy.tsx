"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

/** Contact email chip with a one-click copy button (v2 contact section). */
export function EmailCopy({
  email,
  copyLabel,
  copiedLabel,
}: {
  email: string;
  copyLabel: string;
  copiedLabel: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      trackEvent("email_copy");
      setTimeout(() => setCopied(false), 1600);
    } catch {}
  };

  return (
    <div className="inline-flex items-center gap-2.5 rounded-xl border border-border-color bg-muted px-4 py-3">
      <a
        href={`mailto:${email}`}
        className="font-mono text-[13.5px] font-medium text-foreground transition-colors hover:text-accent"
      >
        {email}
      </a>
      <span className="text-border-strong" aria-hidden="true">
        ·
      </span>
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? copiedLabel : copyLabel}
        className="inline-flex items-center gap-1 font-mono text-[12px] text-accent transition-opacity hover:opacity-80"
      >
        {copied ? <Check size={12} /> : <Copy size={12} />}
        {copied ? copiedLabel : copyLabel}
      </button>
    </div>
  );
}
