/** Fire a Plausible custom event (no-op if Plausible is not loaded) */
export function trackEvent(name: string, props?: Record<string, string>) {
  if (typeof window !== "undefined" && "plausible" in window) {
    (window as unknown as { plausible: (name: string, opts?: { props: Record<string, string> }) => void })
      .plausible(name, props ? { props } : undefined);
  }
}
