# Portfolio Transformation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the portfolio into a 10/10, three-audience experience (recruiter 30s · tech lead · client) with corrected positioning, dual-register copy, proof-first projects, a services path, and per-page SEO.

**Architecture:** Copy lives in `messages/{fr,en}.json` + `lib/{projects,case-studies,plain}.ts`; UI in `app/[locale]/**` + `components/**`. Dual register via a `usePlainText` helper reading `*Plain` sibling keys when plain mode is on. Progressive disclosure on the homepage. Testimonials untouched.

**Tech Stack:** Next.js 16 (App Router), next-intl, TypeScript, Tailwind v4, Playwright.

Full context, rules and audit: `docs/superpowers/specs/2026-07-29-portfolio-transformation-design.md`. Voice/keyword/ban-list rules there apply to EVERY copy task below.

---

## Task 0: Baseline green

**Files:** none (verification only)

- [ ] **Step 1:** Run `npm run typecheck` — note the pre-existing stale `.next/types` error is acceptable; source must be clean.
- [ ] **Step 2:** Run `npm run build` — Expected: success (regenerates `.next/types`, clearing the stale error).
- [ ] **Step 3:** Run `npm test` — Expected: current suite passes (record baseline count).

---

## Task 1: Positioning & title fixes (P0)

**Files:**
- Modify: `messages/fr.json` (`hero.kicker`, `hero.title`, `experience.items[].role` The Mad Space, `summary.role`, `recruteur.role`)
- Modify: `messages/en.json` (same keys)
- Modify: `app/[locale]/layout.tsx` (JSON-LD `jobTitle`, title/OG strings)
- Modify: `app/[locale]/opengraph-image.tsx` + `app/[locale]/projects/[slug]/opengraph-image.tsx` (any "Ingénieur/Engineer" wording)

- [ ] **Step 1:** Replace every "Ingénieur/ingénieur/Engineer" self-reference with "Développeur full-stack" / "Software Engineering student" / "développeur logiciel" per the OIQ rule. The Mad Space role: "Ingénieur logiciel Full-Stack" → "Développeur logiciel Full-Stack". JSON-LD `jobTitle`: "Software Engineering Student and Full-Stack Developer".
- [ ] **Step 2:** Set hero kicker/title to the canonical positioning ("Étudiant en génie logiciel à l'ÉTS · Développeur full-stack web et mobile" / EN equivalent, separately authored).
- [ ] **Step 3:** `grep -rniE "ing[eé]nieur|\\bengineer\\b" messages app components lib` → Expected: only "génie logiciel" / "Software Engineering student", no reserved-title use.
- [ ] **Step 4:** `npm run typecheck` (source clean) then commit: `feat(copy): correct positioning, drop reserved "ingénieur" title`.

---

## Task 2: Status taxonomy + FinanceJ correction (P0)

**Files:**
- Modify: `lib/projects.ts` (`projectState` map, state type/union, `stateColor`, FinanceJ entry)
- Modify: `app/[locale]/projects/[slug]/page.tsx` (`STATE_ICON` record) + any status label maps in `messages`

- [ ] **Step 1:** Add `academic` to the `ProjectState` union, `stateColor`, and `STATE_ICON` (icon e.g. "◇"/"▤"; distinct colour). Add FR/EN labels "Projet académique" / "Academic project".
- [ ] **Step 2:** Set `"financej": "academic"` in `projectState` (was `"production"`). Verify every other project's state matches reality (production/development/prototype/concept/academic) against the spec taxonomy.
- [ ] **Step 3:** `npm run typecheck` — Expected: no new errors (all `ProjectState` usages exhaustive).
- [ ] **Step 4:** `npm run build` — Expected: success. Commit: `fix(projects): add academic status; FinanceJ is academic not production`.

---

## Task 3: Dual-register plumbing (P1)

**Files:**
- Create: `lib/plain-text.ts` (`usePlainText` helper)
- Modify: `components/ui/plain-mode.tsx` (export helper or co-locate)
- Modify: `lib/plain.ts` (extend glossary with new jargon: REST API, CI/CD, MVC, Spring Boot, Prisma, Edge Functions)

- [ ] **Step 1:** Implement `usePlainText(technical, plain)` returning `plain` when `usePlain().plain` is true, else `technical`. Also a server-safe variant note: dual copy is consumed in client components (hero/about/services already client or wrappable).
- [ ] **Step 2:** Establish the message convention: sibling keys `foo` (technical) + `fooPlain` (simple). Document in the spec/plan comment.
- [ ] **Step 3:** Add 5–6 glossary entries in `lib/plain.ts` (FR+EN defs). `npm run typecheck`.
- [ ] **Step 4:** Commit: `feat(plain): usePlainText helper + expand glossary`.

---

## Task 4: Homepage restructure (P2)

**Files:**
- Modify: `app/[locale]/page.tsx` (section order, three-paths block, proofs, featured trio, personality teaser, services teaser, contact)
- Create (if needed): `components/ui/audience-paths.tsx` (three self-identify cards), `components/ui/services-teaser.tsx`
- Modify: `messages/{fr,en}.json` (`home` block: paths labels, proofs, services teaser)

- [ ] **Step 1:** Add the three-paths block ("Je recrute" → /recruteur+CV, "J'ai un projet" → services/contact, "Je découvre" → #systemes) with keyboard-accessible links, below the hero.
- [ ] **Step 2:** Ensure max 2 hero CTAs and exactly 3 proofs (measurable, consistent numbers). Featured trio = The Mad Space, FinanceJ, Cadence (complementary).
- [ ] **Step 3:** Add short personality teaser + services teaser sections linking to About and Services.
- [ ] **Step 4:** `npm run build`; visual check `/fr` and `/en` desktop+mobile (Playwright screenshot). Commit: `feat(home): three-audience progressive layout`.

---

## Task 5: Services section/page (P2)

**Files:**
- Create: `app/[locale]/services/page.tsx` (+ metadata via `alternatesFor`)
- Modify: `messages/{fr,en}.json` (`services` block)
- Modify: nav (`components/layout/header.tsx`, `footer.tsx`) + `app/sitemap.ts`

- [ ] **Step 1:** Build three service groups (sites & apps web · prototypes & MVP · intégrations & automatisation). Per service: who it's for · problem · deliverable · real example (link to a real project) · next step (contact/Cal.com). No unmeasured promises; no "agency" tone.
- [ ] **Step 2:** Add `/services` to nav + sitemap; per-page SEO (title/description/OG, `alternatesFor(locale, "/services")`).
- [ ] **Step 3:** `npm run build`; verify `/fr/services` + `/en/services` 200 and canonical/hreflang correct. Commit: `feat(services): client-facing services path`.

---

## Task 6: About / personality rewrite (P3 FR)

**Files:** Modify `messages/fr.json` (`about` block), `app/[locale]/about/page.tsx` (drop INTJ % bars if kept minimal)

- [ ] **Step 1:** Rewrite the narrative arc (support TI & automation → app dev → ÉTS → current projects), versatility as a stated strength ("prise en charge de bout en bout"). Keep marathon/chess/ski as real, low-analogy notes. Remove the INTJ-A percentage bars (keep at most a one-line trait).
- [ ] **Step 2:** Apply voice + ban-list rules; add `*Plain` variants for the intro paragraph(s).
- [ ] **Step 3:** `npm run build`; visual `/fr/about` technical + plain mode. Commit: `feat(copy): humanize About (FR)`.

---

## Task 7: Hero / summary / experience / contact / now rewrite (P3 FR)

**Files:** Modify `messages/fr.json` (`hero`, `summary`, `experience`, `contact`, `now`, `footer`, `stack`)

- [ ] **Step 1:** Rewrite each block per voice/keyword/ban rules; first person where contribution matters; explain jargon; add `*Plain` for hero pitch + key CTAs.
- [ ] **Step 2:** Ensure proofs/metrics are consistent and defined (NPS 9,6/10 → "satisfaction interne, NPS 9,6/10" context; ~15 000 LOC; 2 000+ tickets).
- [ ] **Step 3:** `npm run build`; visual pass. Commit: `feat(copy): humanize hero/experience/contact (FR)`.

---

## Task 8: Project tags & summaries rewrite (P3 FR)

**Files:** Modify `lib/projects.ts` (`tag`, `summary` per project — FR side)

- [ ] **Step 1:** For each project write a non-technical one-liner (need → outcome) + a concise summary; essential tech only; accurate status wording (no mockup-as-product).
- [ ] **Step 2:** `npm run build`; check `/fr/projects` + a detail page. Commit: `feat(copy): project tags & summaries (FR)`.

---

## Task 9: Canadian-English authoring (P4)

**Files:** Modify `messages/en.json` (all rewritten blocks), `lib/projects.ts` (`en` sides), `lib/case-studies.ts` (`en` sides for Task 10 scope)

- [ ] **Step 1:** Independently author Canadian English for every block rewritten in FR (not literal translation); same voice/keyword/ban rules with EN keyword set.
- [ ] **Step 2:** `npm run build`; verify FR/EN parity (same keys present). Commit: `feat(copy): Canadian English authoring`.

---

## Task 10: Proof-first project cards + case studies (P5)

**Files:** Modify `app/[locale]/projects/[slug]/page.tsx` + `components/ui/case-study.tsx` (proof chips: role/status/contribution/demo/GitHub-if-real/tests/testimonial/result; two-level reading Résumé/Détails). Modify `lib/case-studies.ts` (tighten prose, outcome-forward, both locales).

- [ ] **Step 1:** Add a proof-chip row driven by data (only render GitHub where a real repo exists — today Cadence only). Add a "Résumé / Détails techniques" toggle for the case body.
- [ ] **Step 2:** Humanize/tighten case-study prose; remove ban-list phrasing; keep facts accurate (simulated AI/mock payments labelled as such).
- [ ] **Step 3:** `npm run build`; visual on 2–3 detail pages (incl. FinanceJ, Cadence). Commit: `feat(projects): proof-first cards + tightened case studies`.

---

## Task 11: SEO per page (P6)

**Files:** Modify each `app/[locale]/**/page.tsx` `generateMetadata` (titles/descriptions with per-page intent + keyword sets), verify `app/sitemap.ts` (add /services), JSON-LD.

- [ ] **Step 1:** One intent + keyword-woven title/description per page (FR+EN), no stuffing. Verify canonical/hreflang/x-default via `alternatesFor` on new pages.
- [ ] **Step 2:** `npm run build`; `curl` rendered `<title>`/canonical/hreflang on `/fr`, `/en`, `/fr/services`, a project. Commit: `feat(seo): per-page intent + keywords`.

---

## Task 12: Animation & a11y pass + Humanizer (P7)

**Files:** `components/ui/**` (remove purely decorative motion that hurts reading), all rewritten copy (Humanizer skill pass)

- [ ] **Step 1:** Run the `humanizer` skill over the rewritten FR then EN copy; verify output against facts (never trust it for facts); apply accepted edits.
- [ ] **Step 2:** Audit animations against the "must earn its place" rule; ensure prefers-reduced-motion, focus states, keyboard nav, contrast.
- [ ] **Step 3:** Commit: `refactor(ux): humanizer pass + animation/a11y cleanup`.

---

## Task 13: Full validation + tests update

**Files:** `tests/smoke.spec.ts` (update hero/kicker/text assertions to new copy; add /services + status assertions)

- [ ] **Step 1:** Update Playwright assertions to match new copy/structure; add checks for /services (FR/EN 200), academic status render, three-paths block.
- [ ] **Step 2:** Run `npm run lint`, `npm run typecheck`, `npm run build`, `npm test` — Expected: all green.
- [ ] **Step 3:** Visual sweep: FR/EN · light/dark · mobile/tablet/desktop · plain vs technical mode · 404. Verify links (CV, email, GitHub, LinkedIn, Cal.com), RCG/full name/rcgabriel.dev, no testimonial rewritten, prototypes labelled.
- [ ] **Step 4:** Commit; push branch; open PR with the before/after + scorecard /10 (recruiters · tech leads · non-technical · clients · personality · SEO · a11y · conversion).

---

## Self-review notes

- Spec coverage: P0–P7 map to Tasks 1–13. Testimonials excluded (no task touches `lib/testimonials.ts`). Factual gaps (FinanceJ repo/role, Mad Space repo, intro video) carry spec defaults; surface to user if they become blocking.
- Placeholders: none — each task names exact files, changes, and a build/visual/test gate. Copy strings are authored during execution under the spec's fixed voice/keyword/ban rules (not pre-dumped here to avoid drift).
- Consistency: `usePlainText` + `*Plain` convention used consistently (Tasks 3,6,7); `ProjectState` union extended once (Task 2) and consumed exhaustively.
