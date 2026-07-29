import type { NextConfig } from "next";
import { resolve } from "path";
import createMDX from "@next/mdx";
import createNextIntlPlugin from "next-intl/plugin";

/**
 * Content-Security-Policy — production only. Dev is skipped because Turbopack /
 * React Fast Refresh need 'unsafe-eval' and websocket connections that a strict
 * policy would block.
 *
 * Allowed beyond 'self':
 *  - script/connect: plausible.io (privacy analytics, loaded only when
 *    NEXT_PUBLIC_PLAUSIBLE_DOMAIN is set)
 *  - img: the GitHub stats card used on the About page
 *  - 'unsafe-inline' for scripts (JSON-LD + Next bootstrap, no nonce infra) and
 *    styles (Tailwind + inline style attributes)
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "img-src 'self' data: blob: https://github-profile-summary-cards.vercel.app",
  "font-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "script-src 'self' 'unsafe-inline' https://plausible.io",
  "connect-src 'self' https://plausible.io",
  "upgrade-insecure-requests",
].join("; ");

// Baseline security headers — safe on every route (incl. the static design
// mockups in /public, which are never framed and load no policy-sensitive
// resources via these headers).
const baseSecurityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
];

const cspHeader = { key: "Content-Security-Policy", value: contentSecurityPolicy };

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  turbopack: {
    root: resolve(__dirname),
  },
  async headers() {
    const rules = [{ source: "/:path*", headers: baseSecurityHeaders }];
    // The strict CSP is applied ONLY to the locale-prefixed Next app pages
    // (/fr, /en, /fr/*, /en/*). The static Claude-Design mockups live at
    // top-level dirs (/vibe, /wise-wealthy, /kim-dubois, …) and load Google
    // Fonts, unpkg, the Tailwind CDN and Babel (which needs 'unsafe-eval') —
    // a strict CSP would break them, so they are deliberately left uncovered.
    if (process.env.NODE_ENV === "production") {
      rules.push(
        { source: "/:locale(fr|en)", headers: [cspHeader] },
        { source: "/:locale(fr|en)/:path*", headers: [cspHeader] },
      );
    }
    return rules;
  },
};

const withMDX = createMDX({});
const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

export default withNextIntl(withMDX(nextConfig));
