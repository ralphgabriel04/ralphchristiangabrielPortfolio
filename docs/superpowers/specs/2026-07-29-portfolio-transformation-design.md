# Portfolio Transformation — Design Spec

Date: 2026-07-29 · Branch: `feat/portfolio-transformation` · Owner: Ralph Christian Gabriel

Goal: turn the portfolio into a 10/10 experience that works for three audiences at once
(recruiter in 30s · technical lead · non-technical client) without blending their needs.

---

## 1. Non-negotiable rules

- **Title law (Québec/OIQ):** never use "ingénieur / ingénieur logiciel / ingénieur full-stack".
  Use "étudiant en génie logiciel", "développeur full-stack", "développeur logiciel",
  "concepteur-développeur". → Fix `hero.kicker`, `hero.title`, the The Mad Space role
  ("Ingénieur logiciel Full-Stack" → "Développeur logiciel Full-Stack"), OG/JSON-LD `jobTitle`.
- **Do not touch testimonials** (`lib/testimonials.ts`) — real quotes, verbatim.
- **No invented facts / anecdotes.** No unmeasured business claims. Don't present a mockup as a
  live product, simulated AI as a real integration, or planned compliance (Loi 25/GDPR) as audited.
- **Humanizer** runs AFTER editorial restructuring, and its output is a draft to verify — never a
  source of fact.

## 2. Canonical identity (single source of truth)

| Field | Value |
|---|---|
| Name | Ralph Christian Gabriel (never "Ralph Gabriel" in prose) |
| Brand | RCG · RCG.SYS (motif) |
| Positioning | « Étudiant en génie logiciel à l'ÉTS · Développeur full-stack web et mobile » |
| Email | ralph.c.gabriel@proton.me |
| Location | Repentigny · Grand Montréal (hybride) |
| Domain | rcgabriel.dev |
| Seniority | Junior / Intermédiaire (consistent everywhere) |

Differentiator: **end-to-end ownership** (produit → design → dev → déploiement → relation client),
framed as "je prends en charge de bout en bout", not "je fais tout".

## 3. Audit findings (diagnostic)

1. **Positioning/title risk** — live site uses "Ingénieur Full-Stack" (kicker/title) and role
   "Ingénieur logiciel Full-Stack" (The Mad Space). Reserved title + inconsistent with LinkedIn.
2. **Uniformly dense/technical tone** — even "À propos" opens on LOC/endpoints; personality is
   siloed at the bottom. Cold for clients; versatility never stated as a headline strength.
3. **Two-mode promise half-built** — plain mode only relabels nav + shows a glossary; body copy is
   identical in both modes. The recruiter-vs-client split needs real dual copy on key sections.
4. **SEO/ATS** — copy is metric-rich but not keyword-structured per page; some cross-section redundancy.
5. **AI-writing tells** — "je conçois / je livre / j'explique", "systèmes qui tiennent", rule-of-three
   lists, em-dash overuse, "haute-fidélité" repeated, "propulsé par l'IA", "nativement bilingue".
6. **Status accuracy** — FinanceJ is state `"production"` but is an academic project (LOG240) →
   must become "Projet académique". Verify every project's status against the taxonomy.
7. **Brand consistency** — RG.SYS→RCG.SYS and ralphgabriel.dev→rcgabriel.dev already fixed on main;
   ensure no regressions and that OG/JSON-LD carry the corrected identity.

## 4. Information architecture

Progressive disclosure: simple answer first, depth on demand. Three self-identify paths near the top:

- **Je recrute** → recruiter view (`/recruteur`) + CV + 3 proofs
- **J'ai un projet** → Services + contact
- **Je découvre** → featured projects / systems

Homepage order (max 2 CTAs, max 3 proofs, 3 featured projects):
1. Hero (5-second clarity) + value proposition
2. Three paths (self-identify)
3. Three proofs (measurable)
4. Three featured projects (complementary skills)
5. Short path/parcours
6. Personality (human) — versatility as a strength
7. Selected testimonials (unchanged quotes)
8. Services (client path)
9. Simple, reassuring contact

## 5. Two registers (mode) — mechanism

- **Technical mode (default)** — recruiters/tech: stack, architecture decisions, metrics, ATS keywords.
- **Simple mode** — clients: outcomes/benefits, plain language, "what I build for you", trust.
- Implementation: add sibling `*Plain` keys in messages for the sections that benefit (hero pitch,
  about intro, project one-liners, services, key CTAs/section intros); read via a small `usePlainText`
  helper that returns the plain variant when `usePlain()` is on, else the technical one. Keep single
  copy where one line serves both. Extend the glossary (`lib/plain.ts`) to cover new jargon.

## 6. Featured projects (proof-first cards)

Featured trio (complementary): **The Mad Space** (client · production · API/integrations),
**FinanceJ** (Java · tests · team · academic leadership), **Cadence** (mobile · product · in dev).

Each card: need/problem → my exact role → my personal contribution → real status → one proof/result
→ essential tech only → one clear action. Non-technical summary first, technical details on demand.

Explicit status taxonomy (add `academic`): En production · En développement · Prototype fonctionnel ·
Concept · Projet académique. Verifiable-proof chips per project: role, status, contribution, demo,
GitHub (only where a real repo exists — today only Cadence), diagram, tests, testimonial, result.

## 7. Services (client path)

Group by demonstrated capability: (a) sites & apps web, (b) prototypes & MVP web/mobile,
(c) intégrations & automatisation. Per service: who it's for · problem · deliverable · real example
· next step. No unmeasured commercial promises; no "full agency" impression.

## 8. Personality (About)

Narrative arc: support TI & automation (Vidéotron) → application development → ÉTS → current projects.
Real elements: half-marathon, chess, ski, how I collaborate, what I'm learning, real project
difficulties. Drop "INTJ-A, Architecte" if it weakens credibility (recommend removing the % bars,
keep a one-line trait note at most). Optional 30–45s intro video (no autoplay, captions, transcript)
— only if it genuinely helps; deferred unless assets exist.

## 9. SEO (one intent per page)

Weave keywords naturally (no stuffing). Per-page title/description/OG/JSON-LD.
- FR: Ralph Christian Gabriel · étudiant en génie logiciel à l'ÉTS · développeur full-stack junior
  Montréal · stage développement logiciel Montréal · React/Next.js/TypeScript · Java/Spring Boot ·
  API REST · intégration de solutions · automatisation de processus · tests & CI/CD.
- EN: Ralph Christian Gabriel · Software Engineering student at ÉTS · junior full-stack developer
  Montreal · software development internship Montreal · React/Next.js/TypeScript · Java/Spring Boot ·
  REST API · solutions integration · process automation · software testing & CI/CD.

## 10. Design & animations

Keep the editorial, technical-but-human identity; simplify anything that hurts comprehension. Terminal
stays as a signature Easter egg, not primary nav. Animations must earn their place (explain a relation,
show a project, guide attention, confirm interaction, reinforce personality). Remove purely decorative
motion that slows reading. Respect keyboard, screen readers, contrast, focus, prefers-reduced-motion.

## 11. Copy rules (voice)

First person where contribution matters · concrete verbs · varied sentence length · one idea per
paragraph · explain technical terms · professional Québec French · separately-authored Canadian
English (no literal translation) · no agency/press-release/PRD tone. Ban list: "je conçois/je livre/
j'explique", "systèmes qui tiennent", "compromis assumé", "haute-fidélité"(repeated), "propulsé par
l'IA", "démocratiser", "holistique", "robuste", "scalable", "premium", "nativement bilingue", "sans
jamais", "véritable", "beachhead", "builder", long tech strings, em-dash-stuffed sentences.

## 12. Factual items to confirm (non-blocking; sensible defaults noted)

- **FinanceJ GitHub repo** — public URL? (default: no GitHub chip until confirmed).
- **FinanceJ role** — "team lead / top contributor" on LOG240? (a testimonial references leading a
  Testing & Maintenance course team → default: "Développeur · leadership d'équipe (projet académique LOG240)").
- **The Mad Space repo** — public or private? (default: private, no GitHub chip; keep live link).
- **Intro video** — do 30–45s captioned assets exist? (default: skip until provided).

## 13. Phased plan (priorized)

- **P0 — Foundations & positioning** (highest impact, low risk): fix title/positioning everywhere
  (messages FR/EN, OG image, JSON-LD jobTitle, The Mad Space role), correct FinanceJ status +
  add `academic` state, brand/consistency sweep.
- **P1 — Dual-register plumbing**: `usePlainText` helper + `*Plain` message keys wired into hero,
  about, project one-liners, services; extend glossary.
- **P2 — Homepage restructure**: three paths, proofs, featured trio, personality, services, contact.
- **P3 — Copy rewrite (FR)**: hero, about, experience, recruteur, contact, now, footer, stack intro
  + project tags/summaries; humanizer pass.
- **P4 — Copy rewrite (EN)**: independent Canadian-English authoring (not translation).
- **P5 — Project proof cards + case studies**: proof chips, summary/technical two-level reading,
  tighten case-study prose (`lib/case-studies.ts`).
- **P6 — SEO per page**: titles/descriptions/OG/JSON-LD/hreflang review.
- **P7 — Animation/a11y pass** + validation (lint/typecheck/build/test, FR/EN, light/dark,
  mobile/tablet/desktop, no-JS where relevant).

## 14. Delivery & validation

Branch `feat/portfolio-transformation` → PR. Run `npm run lint`, `npm run typecheck`, `npm run build`,
`npm test`. Update tests that assert hero/kicker text. Final scorecard /10 for: recruiters · technical
leads · non-technical visitors · clients · personality · SEO · accessibility · conversion.
