# Design Merge Plan — v2 "RG.SYS" terminal design → portfolio

Reference: `Ralph Gabriel Portfolio v2.dc.html` (dark-first warm terminal OS). Same fonts as the
app (Geist / Geist Mono / Instrument Serif); light palette already matches. **Do not** replace the
Next app with the dc.html. Keep routing, i18n, case studies, project data, testimonials, perf/SEO/a11y.

## What v2 adds (audit)
- **Interactive terminal `RG.SYS`** (⌘K / backtick / `>_` button): commands `help · whoami · projets ·
  etude 01|02|03 · stack · parcours · contact · cv · recruteur · theme · fr|en · clear · sudo hire`,
  bilingual, routes through the app, opens CV, toggles theme/locale. **The signature novelty.**
- **Terminal hero**: boot line, `$ role` typewriter with blinking caret, Ralph's photo.
- **Dark-first warm palette** (`#0C0B09` / accent `#FF5A2E`), accent options (ember/gold/mint).
- Projects framed as **SYS-0N systems** with status (shipped/active/proto/planned) — already matches
  my state filters.

## Merge decisions
| Element | Decision |
|---|---|
| Interactive terminal | **BUILD** as a global React component wired to routes/theme/locale/CV. Triggers in header + footer + ⌘K/backtick. |
| Recruiter mode | Map terminal `recruteur` → open the existing **30-second summary drawer** (already built). |
| Hero | Add Ralph's photo + `$ role` typewriter line + terminal boot kicker; keep existing h1/metrics/CTAs. |
| Palette | Refine **dark** tokens to v2 (`#0C0B09`, brighter orange) so dark = terminal; keep light as-is. |
| Project rows / filters | KEEP (already the SYS-style presentation). |
| Fonts | KEEP existing self-hosted (v2 uses the same). |
| Accent picker | Defer (nice-to-have); terminal `theme` covers mode switching. |

## Components touched / added
- New `components/ui/terminal.tsx` (+ `openTerminal()` helper); render in `app/[locale]/layout.tsx`.
- `components/layout/header.tsx` + `footer.tsx`: `>_ terminal ⌘K` trigger.
- `components/ui/summary-drawer.tsx`: open on `rg:summary` event (recruiter command).
- `app/[locale]/page.tsx`: hero photo + typewriter line.
- `app/globals.css`: dark palette refinement.
- `messages/*`: `terminal` chrome keys.

## Validation
tsc · next build · Playwright · screenshots (terminal open, hero) at 390/1280, light + dark ·
content visible without JS · FR/EN parity.
