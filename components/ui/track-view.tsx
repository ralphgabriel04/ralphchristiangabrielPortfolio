"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

/** Fires a Plausible event once on mount */
export function TrackView({ event, props }: { event: string; props?: Record<string, string> }) {
  useEffect(() => {
    trackEvent(event, props);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return null;
}
