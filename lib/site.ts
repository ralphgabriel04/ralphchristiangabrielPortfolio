/**
 * Canonical site origin, used for metadata, canonical URLs, Open Graph,
 * JSON-LD, sitemap and robots.
 *
 * Resolution order:
 *  1. NEXT_PUBLIC_SITE_URL — set this once the custom domain (e.g.
 *     https://ralphgabriel.dev) is live to switch every URL at once.
 *  2. VERCEL_PROJECT_PRODUCTION_URL — the stable production Vercel domain.
 *  3. The current live Vercel URL as a safe, resolving fallback.
 */
const RAW =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "") ||
  "https://ralph-gabriel-portfolio.vercel.app";

/** Origin with no trailing slash (e.g. "https://ralph-gabriel-portfolio.vercel.app"). */
export const SITE_URL = RAW.replace(/\/+$/, "");
