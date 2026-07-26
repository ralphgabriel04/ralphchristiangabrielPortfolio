"use client";

import { CountUp } from "@/components/ui/count-up";
import { Reveal } from "@/components/ui/reveal";
import type { CaseSection, CaseResult, CaseDecision } from "@/lib/case-studies";

type Loc = "fr" | "en";

const PHASES = [
  { fr: "Cadrage", en: "Framing", upto: 2, mix: 18 },
  { fr: "Système de design", en: "Design system", upto: 5, mix: 34 },
  { fr: "Fonctions principales", en: "Core features", upto: 10, mix: 60 },
  { fr: "Version d'essai", en: "Beta", upto: 13, mix: 100 },
] as const;

const phaseBg = (mix: number) =>
  mix >= 100 ? "var(--accent)" : `color-mix(in srgb, var(--accent) ${mix}%, transparent)`;

/** Delivery gantt: 13 sprint segments coloured by phase + a legend. */
function Sprints({ locale }: { locale: Loc }) {
  const sprints = Array.from({ length: 13 }, (_, i) => {
    // Every i (0–12) matches the last phase (upto 13), so find always resolves.
    const ph = (PHASES.find((p) => i < p.upto) ?? PHASES[3])!;
    return { n: `S${i + 1}`, mix: ph.mix, phase: `S${i + 1} — ${ph[locale]}` };
  });
  return (
    <div className="mt-6 rounded-2xl border border-border-color bg-muted p-5 md:p-7">
      <div className="flex gap-1">
        {sprints.map((sp) => (
          <span
            key={sp.n}
            title={sp.phase}
            tabIndex={0}
            className="flex h-9 flex-1 items-end justify-center rounded-md border border-border-color pb-0.5 font-mono text-[9px] text-muted-foreground"
            style={{ background: phaseBg(sp.mix) }}
          >
            {sp.n}
          </span>
        ))}
      </div>
      <div className="mt-3.5 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[11px] text-muted-foreground">
        {PHASES.map((p) => (
          <span key={p.en} className="flex items-center gap-1.5">
            <span
              className="h-2.5 w-2.5 rounded-[3px] border border-border-color"
              style={{ background: phaseBg(p.mix) }}
            />
            {p[locale]}
          </span>
        ))}
        <span className="text-muted-foreground/60">
          {locale === "fr"
            ? "· plan de livraison (13 cycles de 2 semaines)"
            : "· delivery plan (13 two-week cycles)"}
        </span>
      </div>
    </div>
  );
}

/** Test pyramid (FinanceJ · TDD). */
function Pyramid({ locale }: { locale: Loc }) {
  const L = (fr: string, en: string) => (locale === "fr" ? fr : en);
  const tiers = [
    { w: "34%", label: L("UI / bout en bout — parcours critiques", "UI / end-to-end — critical flows"), pale: true },
    { w: "60%", label: L("Intégration — modules du grand livre", "Integration — ledger modules"), pale: false },
    { w: "88%", label: L("Unitaires — la majorité des 133 tests", "Unit — most of the 133 tests"), pale: false },
  ];
  return (
    <div className="mt-6 flex flex-col items-center gap-2.5 rounded-2xl border border-border-color bg-muted p-5 md:p-7">
      {tiers.map((t, i) => (
        <div
          key={i}
          className={`rounded-lg border px-4 py-2.5 text-center font-mono text-[12px] ${
            t.pale ? "border-accent" : "border-border-strong"
          }`}
          style={{
            width: t.w,
            minWidth: 150,
            background: t.pale ? "color-mix(in srgb, var(--accent) 16%, transparent)" : "var(--muted-2)",
          }}
        >
          {t.label}
        </div>
      ))}
      <div className="mt-1.5 font-mono text-[11px] text-muted-foreground/70">
        {L("133 tests au total · couverture complète annoncée*", "133 tests total · full coverage as reported*")}
      </div>
    </div>
  );
}

/** Architecture / trade-off decision cards. */
function Decisions({ items, locale }: { items: CaseDecision[]; locale: Loc }) {
  const L = (fr: string, en: string) => (locale === "fr" ? fr : en);
  return (
    <div className="mt-6 grid gap-4 md:grid-cols-3">
      {items.map((d, i) => (
        <div key={i} className="rounded-2xl border border-border-color bg-muted p-5">
          <div className="text-[15px] font-semibold">{d.title}</div>
          <div className="mt-2.5 font-mono text-[11.5px] text-muted-foreground">{L("Contrainte", "Constraint")}</div>
          <div className="text-[13px] text-muted-foreground">{d.cons}</div>
          <div className="mt-2 font-mono text-[11.5px] text-accent">{L("Choix", "Choice")}</div>
          <div className="text-[13px]">{d.choice}</div>
          <div className="mt-2 font-mono text-[11.5px] text-muted-foreground">{L("Compromis", "Trade-off")}</div>
          <div className="text-[13px] text-muted-foreground">{d.trade}</div>
          <div className="mt-3 border-t border-border-color pt-2.5 text-[13px]" style={{ color: "var(--shipped)" }}>
            ✓ {d.effect}
          </div>
        </div>
      ))}
    </div>
  );
}

/** Results metric quad (with count-up). */
function Results({ items }: { items: CaseResult[] }) {
  const cols = items.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-4";
  return (
    <div
      className={`mt-6 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border-color bg-border-color ${cols}`}
    >
      {items.map((r, i) => (
        <div key={i} className="bg-muted p-5">
          <CountUp
            value={r.value}
            className="text-2xl leading-none tracking-[-0.02em] text-accent md:text-[34px]"
            style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}
          />
          <div className="mt-2 text-[12.5px] text-muted-foreground">{r.label}</div>
        </div>
      ))}
    </div>
  );
}

/** v2 case-study sections: numbered serif heading + body + 2-col points, with
 *  special renderers for results, sprints, pyramid and decision cards. */
export function CaseSections({ sections, locale }: { sections: CaseSection[]; locale: Loc }) {
  return (
    <div>
      {sections.map((sec, i) => (
        <Reveal key={sec.num} delay={i * 50}>
          <section className="pt-12 md:pt-16">
            <div className="flex items-baseline gap-3.5 border-b border-border-strong pb-3">
              <span className="font-mono text-xs text-accent">{sec.num}</span>
              <h2
                className="text-2xl leading-[1.05] tracking-[-0.01em] md:text-[38px]"
                style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}
              >
                {sec.title}
              </h2>
            </div>
            <p className="mt-5 max-w-[62ch] text-[15.5px] leading-relaxed text-muted-foreground">
              {sec.body}
            </p>
            {sec.points && (
              <ul className="mt-5 grid list-none gap-x-6 gap-y-2.5 sm:grid-cols-2">
                {sec.points.map((pt, j) => (
                  <li key={j} className="flex gap-2.5 text-sm text-muted-foreground">
                    <span className="flex-none font-mono text-accent">▸</span>
                    {pt}
                  </li>
                ))}
              </ul>
            )}
            {sec.decisions && <Decisions items={sec.decisions} locale={locale} />}
            {sec.kind === "sprints" && <Sprints locale={locale} />}
            {sec.kind === "pyramid" && <Pyramid locale={locale} />}
            {sec.results && <Results items={sec.results} />}
          </section>
        </Reveal>
      ))}
    </div>
  );
}
