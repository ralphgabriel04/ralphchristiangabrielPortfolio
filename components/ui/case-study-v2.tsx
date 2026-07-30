"use client";

import { useState } from "react";
import {
  type CaseStudyV2,
  type CaseMode,
  type CaseSectionV2,
  type EvidenceLevel,
  EVIDENCE_LABEL,
  MODE_LABEL,
  RACI_LABEL,
} from "@/lib/case-studies-v2";

type Loc = "fr" | "en";

const TONE: Record<"plan" | "build" | "proof", string> = {
  plan: "var(--muted-foreground)",
  build: "var(--active)",
  proof: "var(--shipped)",
};

function EvidenceTag({ level, locale }: { level: EvidenceLevel; locale: Loc }) {
  const e = EVIDENCE_LABEL[level];
  const color = TONE[e.tone];
  return (
    <span
      className="inline-flex items-center rounded-full border px-2 py-0.5 font-mono text-[9.5px] font-medium uppercase tracking-[0.08em]"
      style={{
        color,
        borderColor: `color-mix(in srgb, ${color} 38%, transparent)`,
        backgroundColor: `color-mix(in srgb, ${color} 9%, transparent)`,
      }}
    >
      {e[locale]}
    </span>
  );
}

/** Multi-mode case-study renderer (recruiter / engineering / business). */
export function CaseStudyV2View({ study, locale }: { study: CaseStudyV2; locale: Loc }) {
  const fr = locale === "fr";
  const modes = study.modes;
  const [mode, setMode] = useState<CaseMode>(modes.includes("recruiter") ? "recruiter" : modes[0]!);

  const id = study.identity;
  const shown = study.sections.filter((s) => s.modes.includes(mode));

  const metaRows: [string, string | undefined][] = [
    [fr ? "Type" : "Type", id.kind],
    [fr ? "Domaine" : "Domain", id.domain],
    [fr ? "Statut" : "Status", id.maturityLabel],
    [fr ? "Période" : "Period", id.period],
    [fr ? "Rôle" : "Role", id.role],
    [fr ? "Équipe" : "Team", id.team],
    [fr ? "Marché" : "Market", id.market],
    [fr ? "Plateformes" : "Platforms", id.platforms?.join(" · ")],
  ];

  return (
    <div className="mt-8">
      {/* Mode toggle */}
      {modes.length > 1 && (
        <div className="inline-flex rounded-full border border-border-color bg-muted p-1 print:hidden" role="tablist" aria-label={fr ? "Mode de consultation" : "View mode"}>
          {modes.map((m) => {
            const active = m === mode;
            return (
              <button
                key={m}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setMode(m)}
                className={`rounded-full px-4 py-1.5 font-mono text-xs transition-colors ${
                  active ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {MODE_LABEL[m][locale]}
              </button>
            );
          })}
        </div>
      )}

      {/* Identity card */}
      <div className="mt-6 rounded-2xl border border-border-color bg-muted/40 p-6 md:p-7">
        <p className="max-w-[60ch] text-[15px] leading-relaxed text-foreground">{id.valueProp}</p>
        <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3 lg:grid-cols-4">
          {metaRows.filter(([, v]) => !!v).map(([k, v]) => (
            <div key={k}>
              <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">{k}</div>
              <div className="mt-1 text-[13px] font-medium">{v}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {id.stack.map((s) => (
            <span key={s} className="rounded-full border border-border-color px-2.5 py-1 font-mono text-[11px] text-muted-foreground">{s}</span>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border-color pt-3 font-mono text-[12px]">
          {study.links.map((l) => (
            <a key={l.url} href={l.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-accent hover:underline">
              {l.label} <span aria-hidden="true">↗</span>
            </a>
          ))}
          <span className="ml-auto text-muted-foreground/60">{fr ? "Mis à jour" : "Updated"} : {id.updated}</span>
        </div>
      </div>

      {/* Sections */}
      <div className="mt-8 flex flex-col gap-8">
        {shown.map((s, i) => (
          <Section key={s.id} section={s} study={study} locale={locale} num={String(i + 1).padStart(2, "0")} />
        ))}
      </div>
    </div>
  );
}

function Section({ section, study, locale, num }: { section: CaseSectionV2; study: CaseStudyV2; locale: Loc; num: string }) {
  const fr = locale === "fr";
  const kind = section.kind ?? "text";

  const inner = (
    <>
      {section.body && <p className="max-w-[62ch] text-[15px] leading-relaxed text-muted-foreground">{section.body}</p>}

      {kind === "flow" ? (
        <div className="mt-4 rounded-xl border border-border-color bg-muted p-4 font-mono text-[12.5px] leading-relaxed text-muted-foreground">
          {section.body}
        </div>
      ) : null}

      {(kind === "text" || kind === "data-model") && section.points && (
        <ul className="mt-3 grid gap-x-8 gap-y-2 sm:grid-cols-2">
          {section.points.map((p) => (
            <li key={p} className="flex items-start gap-2 text-sm leading-relaxed text-muted-foreground">
              <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              {p}
            </li>
          ))}
        </ul>
      )}

      {kind === "metrics" && study.metrics && (
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {study.metrics.map((m, i) => (
            <div key={i} className="rounded-xl border border-border-color bg-muted p-4">
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-mono text-lg font-semibold text-accent">{m.value}</span>
                <EvidenceTag level={m.evidence} locale={locale} />
              </div>
              <div className="mt-1 text-[12.5px] text-muted-foreground">{m.label}</div>
              {m.note && <div className="mt-1 text-[11px] italic text-muted-foreground/60">{m.note}</div>}
            </div>
          ))}
        </div>
      )}

      {kind === "decisions" && study.decisions && (
        <div className="mt-4 flex flex-col gap-3">
          {study.decisions.map((d) => (
            <div key={d.id} className="rounded-xl border border-border-color bg-muted p-5">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-accent">{d.id}</span>
                <h4 className="text-[15px] font-semibold">{d.title}</h4>
              </div>
              <dl className="mt-3 grid gap-2.5 text-[13px] sm:grid-cols-2">
                {([
                  [fr ? "Contexte" : "Context", d.context],
                  [fr ? "Décision" : "Decision", d.decision],
                  [fr ? "Pourquoi" : "Why", d.rationale],
                  [fr ? "Compromis" : "Trade-off", d.tradeoff],
                ] as const).map(([k, v]) => (
                  <div key={k}>
                    <dt className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground/70">{k}</dt>
                    <dd className="mt-0.5 leading-snug text-muted-foreground">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
      )}

      {kind === "raci" && study.responsibilities && (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[420px] border-collapse text-[13px]">
            <thead>
              <tr className="border-b border-border-strong text-left font-mono text-[10.5px] uppercase tracking-[0.08em] text-muted-foreground">
                <th className="py-2 pr-4 font-medium">{fr ? "Domaine" : "Area"}</th>
                <th className="py-2 pr-4 font-medium">{fr ? "Moi" : "Me"}</th>
                <th className="py-2 pr-4 font-medium">{study.responsibilities.find((r) => r.otherName)?.otherName ?? (fr ? "Autre" : "Other")}</th>
                <th className="py-2 font-medium">{fr ? "Partagé" : "Shared"}</th>
              </tr>
            </thead>
            <tbody>
              {study.responsibilities.map((r) => (
                <tr key={r.area} className="border-b border-border-color">
                  <td className="py-2 pr-4 font-medium text-foreground">{r.area}</td>
                  <td className="py-2 pr-4 text-muted-foreground">{RACI_LABEL[r.me][locale]}</td>
                  <td className="py-2 pr-4 text-muted-foreground">{RACI_LABEL[r.other ?? "none"][locale]}</td>
                  <td className="py-2 text-muted-foreground">{r.shared ? (fr ? "Oui" : "Yes") : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {study.responsibilitiesNote && (
            <p className="mt-2 font-mono text-[11px] text-muted-foreground/60">{study.responsibilitiesNote}</p>
          )}
        </div>
      )}

      {kind === "limits" && study.limits && (
        <ul className="mt-3 flex flex-col gap-2">
          {study.limits.map((l) => (
            <li key={l} className="flex items-start gap-2 text-sm leading-relaxed text-muted-foreground">
              <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: "var(--active)" }} />
              {l}
            </li>
          ))}
        </ul>
      )}
    </>
  );

  const header = (
    <h3 className="group/anchor flex items-baseline gap-2 text-xl font-semibold tracking-tight">
      <a
        href={`#${section.id}`}
        onClick={(e) => e.stopPropagation()}
        aria-label={fr ? `Lien vers « ${section.title} »` : `Link to "${section.title}"`}
        className="font-mono text-[0.7em] text-accent hover:underline"
      >
        {num}
      </a>{" "}
      {section.title}
      <span
        aria-hidden="true"
        className="font-mono text-[0.6em] text-muted-foreground/40 opacity-0 transition-opacity group-hover/anchor:opacity-100"
      >
        #
      </span>
    </h3>
  );

  if (section.collapsible) {
    return (
      <details id={section.id} className="group scroll-mt-24 border-t border-border-color pt-6 first:border-t-0 first:pt-0">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-2">
          {header}
          <span className="font-mono text-xs text-muted-foreground transition-transform group-open:rotate-90">▸</span>
        </summary>
        <div className="mt-3">{inner}</div>
      </details>
    );
  }

  return (
    <section id={section.id} className="scroll-mt-24 border-t border-border-color pt-6 first:border-t-0 first:pt-0">
      {header}
      <div className="mt-3">{inner}</div>
    </section>
  );
}
