/**
 * Canonical site origin — the single source of truth for metadata, canonical
 * URLs, Open Graph, JSON-LD, sitemap and robots.
 *
 * Resolution order:
 *  1. NEXT_PUBLIC_SITE_URL — explicit override (set in Vercel if the canonical
 *     domain ever changes). Always wins.
 *  2. Production (VERCEL_ENV === "production") → the canonical custom domain.
 *  3. Preview deployments → the dynamic per-deployment Vercel URL, so preview
 *     metadata resolves to the preview itself (never to production).
 *  4. Local development → http://localhost:3000.
 *
 * The `.vercel.app` production URL stays reachable, but it must never be the
 * canonical origin — that role belongs to https://rcgabriel.dev.
 */
const PRODUCTION_URL = "https://rcgabriel.dev";

function resolveSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_ENV === "production") return PRODUCTION_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

/** Origin with no trailing slash (e.g. "https://rcgabriel.dev"). */
export const SITE_URL = resolveSiteUrl().replace(/\/+$/, "");

/** The canonical production origin, independent of the current environment. */
export const PRODUCTION_SITE_URL = PRODUCTION_URL;

/** True only on the Vercel production deployment (used to gate indexing). */
export const IS_PRODUCTION = process.env.VERCEL_ENV === "production";

/**
 * Per-page canonical + hreflang alternates. Every localized page must call this
 * so its canonical points to itself (not to the layout's homepage default) and
 * declares fr / en / x-default variants. `path` is the locale-agnostic route
 * (e.g. "/about" or "/projects/cadence"); pass "" for the homepage.
 */
export function alternatesFor(locale: string, path = "") {
  return {
    canonical: `${SITE_URL}/${locale}${path}`,
    languages: {
      fr: `${SITE_URL}/fr${path}`,
      en: `${SITE_URL}/en${path}`,
      "x-default": `${SITE_URL}/fr${path}`,
    },
  };
}
