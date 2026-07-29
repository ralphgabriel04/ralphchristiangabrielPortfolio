# Domain & Production Setup — rcgabriel.dev

Validation date: **2026-07-27**
Branch: `feat/domain-production-rcgabriel-dev`
Maintainer: Ralph Christian Gabriel

---

## 1. Primary domain

| Item | Value |
|------|-------|
| Canonical production domain | `https://rcgabriel.dev` |
| WWW subdomain | `www.rcgabriel.dev` → 308 redirect to apex |
| Registrar / DNS manager | CanSpace (unchanged — no transfer, no extra hosting) |
| Historical Vercel URL | `ralph-gabriel-portfolio.vercel.app` (stays reachable, never canonical) |

> The domain `dpmelevate.com` belongs to another application and must **never** be
> associated with, redirected to, or mixed into this project.

---

## 2. Vercel project

| Item | Value |
|------|-------|
| Project name | `ralph-gabriel-portfolio` |
| Project ID | `prj_7d43PMHRZx022SAUI9iRsYQwTv6j` |
| Org / Team ID | `team_EUMxxbYhS2rFRz7UlvXFSKrS` |
| Framework | Next.js (App Router) |
| Node version | 24.x |
| Local link | `.vercel/project.json` matches the IDs above ✅ |

The repo is already linked to the correct project. **Do not create a second Vercel
project.** Confirmed via the Vercel API on 2026-07-27 — current attached domains were
only `*.vercel.app`; `rcgabriel.dev` was not yet attached.

### Steps to attach the domain (Vercel dashboard)

1. Project → **Settings → Domains → Add**.
2. Add `rcgabriel.dev`. Vercel marks it as the production domain.
3. Add `www.rcgabriel.dev`. Choose **Redirect to `rcgabriel.dev`** (Vercel issues a
   permanent **308** redirect automatically — do not add a separate app-level redirect).
4. Vercel provisions the TLS certificate automatically once DNS resolves.
5. Read the **exact** DNS records Vercel shows in that screen and apply them at
   CanSpace (see §3). The values below are the standard Vercel values; always prefer
   what the dashboard displays for this project.

CLI equivalent (optional, if the Vercel CLI is installed and authenticated):

```bash
npm i -g vercel
vercel login
vercel link --project ralph-gabriel-portfolio           # confirms the existing link
vercel domains add rcgabriel.dev
vercel domains add www.rcgabriel.dev
vercel domains inspect rcgabriel.dev                     # shows the exact records to set
```

---

## 3. DNS configuration (CanSpace)

CanSpace is a cPanel-style manager: apex (`@`) must be an **A record** (CNAME is not
allowed at the apex), `www` uses a **CNAME**.

| Type | Name | Value | TTL | Action |
|------|------|-------|-----|--------|
| A | `@` | *(IP shown by Vercel — typically `76.76.21.21`)* | 3600 | Add / update |
| CNAME | `www` | `cname.vercel-dns.com` | 3600 | Add / update |
| TXT | `@` or `_vercel` | *(only if Vercel asks for a verification TXT)* | 3600 | Add if requested |

> ⚠️ Confirm the apex **A** value against the Vercel dashboard for this project before
> applying — Vercel occasionally serves a different anycast IP. Never guess if the
> dashboard shows a specific value.

### Conflicting records to detect and remove (only if confirmed conflicting)

- Old `A` / `AAAA` records on `@` pointing elsewhere (previous host / parking).
- Old `CNAME` on `www` pointing to a different target.
- Registrar-level **domain forwarding / parking / URL redirect** on `rcgabriel.dev`
  (disable it — it collides with Vercel).
- Any Cloudflare-style proxy (orange cloud) — Vercel needs DNS-only / direct records.

Do not delete a record unless its conflict with the table above is confirmed.

### Verification of propagation

```bash
nslookup rcgabriel.dev
nslookup www.rcgabriel.dev
```

`rcgabriel.dev` should resolve to the Vercel A IP; `www` should resolve via
`cname.vercel-dns.com`.

---

## 4. Environment variables

The canonical URL is centralized in **`lib/site.ts`** and resolves automatically:

| Environment | Resolved `SITE_URL` | Source |
|-------------|---------------------|--------|
| Production (`VERCEL_ENV=production`) | `https://rcgabriel.dev` | hard default in `lib/site.ts` |
| Preview | `https://<deployment>.vercel.app` | `VERCEL_URL` |
| Local dev | `http://localhost:3000` | fallback |

No environment variable is **required** — production is correct by default.

Optional override (only if the canonical domain ever changes):

```
NEXT_PUBLIC_SITE_URL=https://rcgabriel.dev   # Production scope, Vercel → Settings → Environment Variables
```

Existing optional var (unchanged): `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` (enables the
Plausible script only when set). **No secrets are stored in the repo.**

---

## 5. Canonical & language strategy

- Single source of truth: `lib/site.ts` (`SITE_URL`, `PRODUCTION_SITE_URL`,
  `IS_PRODUCTION`, `alternatesFor()`).
- Every localized page emits a **self-referential canonical** via
  `alternatesFor(locale, path)` — sub-pages no longer inherit the homepage canonical.
- `hreflang` on every page: `fr`, `en`, and `x-default` (→ `fr`).
- `/` redirects to the default locale (`/fr`) through the next-intl middleware (`proxy.ts`).
- Indexing is gated: `robots: index` only when `VERCEL_ENV=production`. Preview and
  local builds emit `noindex, nofollow`.
- Locales: `fr` (default) and `en`, defined in `i18n/routing.ts`.

---

## 6. Validation commands

```bash
npm run lint        # ESLint (flat config) — clean
npm run typecheck   # tsc --noEmit — 0 errors
npm run build       # next build — succeeds, 37 static pages
npm test            # Playwright — 32/32 passing

# Post-DNS live checks
curl -I https://rcgabriel.dev              # expect 200 + valid TLS
curl -I https://www.rcgabriel.dev          # expect 308 → https://rcgabriel.dev
curl -I https://rcgabriel.dev/robots.txt   # expect 200
curl -I https://rcgabriel.dev/sitemap.xml  # expect 200
```

Local production-parity verification (already run on 2026-07-27, `VERCEL_ENV=production`):

- canonical / hreflang / `x-default` correct on `/fr/about`, `/en/projects/*`
- `og:url` / `og:image` absolute on `rcgabriel.dev`
- JSON-LD `@graph`: `Person` + `WebSite` + `ProfilePage`
- security headers present (see §10)
- `robots.txt` and `sitemap.xml` (32 URLs) use `rcgabriel.dev`

---

## 7. Deployment procedure

1. Merge the PR from `feat/domain-production-rcgabriel-dev` into `main`.
2. Vercel auto-builds the production deployment from `main`
   (`VERCEL_ENV=production` → canonical `rcgabriel.dev`).
3. Ensure the domain is attached (§2) and DNS is applied (§3).
4. Run the post-DNS live checks (§6).

---

## 8. Rollback procedure

- **Code**: revert the merge commit on `main` (`git revert -m 1 <merge_sha>`) and push;
  Vercel redeploys the previous state. No `reset --hard`.
- **Instant**: Vercel → Deployments → pick the last known-good production deployment →
  **Promote to Production** (or **Instant Rollback**).
- **Domain**: the apex keeps resolving; only the served build changes.

---

## 9. Renewal procedure

- **Domain registration**: renewed at **CanSpace** (registrar). Keep auto-renew on.
- **TLS certificate**: managed and renewed automatically by Vercel — no action.
- **DNS**: static; no renewal needed unless records change.

---

## 10. Security headers (`next.config.ts`)

Applied to all routes via `headers()`:

| Header | Value |
|--------|-------|
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` | `DENY` (+ CSP `frame-ancestors 'none'`) |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(), browsing-topics=()` |
| `Content-Security-Policy` | production-only; `default-src 'self'`, allows Plausible (script/connect) and the GitHub stats card (img); `'unsafe-inline'` kept for inline JSON-LD/Next bootstrap and Tailwind inline styles |

- CSP is **production-only** (dev needs `unsafe-eval` + websockets for Turbopack HMR).
- **HSTS preload is intentionally NOT enabled** until the domain, HTTPS and subdomains
  are fully stabilized. Vercel serves a baseline HSTS automatically; add `preload`
  later, deliberately.

---

## 11. Search Console / indexing

1. **Google Search Console** → add property `https://rcgabriel.dev`.
   - **URL-prefix property**: already verifiable — the site renders
     `<meta name="google-site-verification" ...>` on every page (wired via
     `verification.google` in the localized metadata). Just click **Verify**.
   - **Domain property** (optional, covers all subdomains): use DNS TXT
     verification at CanSpace instead.
2. Submit sitemap: `https://rcgabriel.dev/sitemap.xml`.
3. **Bing Webmaster Tools** → add the site (can import from GSC) → submit the same sitemap.
4. Request indexing for the homepage after DNS + TLS are live.

No new analytics/tracking was added. Plausible remains opt-in via
`NEXT_PUBLIC_PLAUSIBLE_DOMAIN`.

---

## 12. Residual items (non-blocking)

- **Top-level 404 styling**: arbitrary unmatched top-level paths (e.g. `/fr/xyz-typo`)
  return the correct **HTTP 404** but render Next's minimal default page, because there
  is no root `app/layout.tsx` (the `<html>` lives in `app/[locale]/layout.tsx`). The
  fully-styled localized 404 (`app/[locale]/not-found.tsx`) already renders for the
  realistic case — broken internal links / invalid project slugs. Making every 404
  styled would require introducing a root layout (larger refactor); deferred.
- **Web app manifest**: none present. Optional PWA polish; would benefit from dedicated
  192/512 PNG icons before adding.
- **DNS apex IP**: confirm the exact A-record value in the Vercel dashboard for this
  project before applying at CanSpace.
