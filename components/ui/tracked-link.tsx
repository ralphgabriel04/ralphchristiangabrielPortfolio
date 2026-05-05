"use client";

import { trackEvent } from "@/lib/analytics";

export function TrackedLink({
  event,
  children,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & { event: string }) {
  return (
    <a {...props} onClick={() => trackEvent(event)}>
      {children}
    </a>
  );
}
