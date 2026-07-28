import type { Metadata } from "next";
import { alternatesFor } from "@/lib/site";
import { useTranslations, useLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowLeft, Mail, Calendar } from "lucide-react";
import {
  projects,
  projectLinks,
  projectState,
  stateColor,
  caseStudyIds,
} from "@/lib/projects";
import { PrintButton } from "@/components/ui/print-button";
import { ProfilePhoto } from "@/components/ui/profile-photo";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/icons";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isFr = locale === "fr";
  return {
    title: isFr ? "Vue recruteur" : "Recruiter view",
    description: isFr
      ? "Synthèse CV d'une page : preuves, systèmes livrés, parcours et contact."
      : "One-page résumé: proof, shipped systems, path and contact.",
    alternates: alternatesFor(locale, "/recruteur"),
  };
}

export default async function RecruiterPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <RecruiterContent />;
}

type Proof = { value: string; label: string };
type ExpItem = { date: string; role: string; org: string };
type EduItem = { date: string; title: string; org: string };

const CHIP =
  "inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-border-color px-3.5 py-2 text-muted-foreground transition-colors hover:border-accent hover:text-accent";

function RecruiterContent() {
  const t = useTranslations("recruteur");
  const tExp = useTranslations("experience");
  const locale = useLocale() as "fr" | "en";

  const proofs = t.raw("proofs") as Proof[];
  const items = tExp.raw("items") as ExpItem[];
  const education = tExp.raw("education") as EduItem[];
  const sys = projects.slice(0, 6);
  const cvHref =
    locale === "fr" ? "/cv/ralph-gabriel-cv-fr.pdf" : "/cv/ralph-gabriel-cv-en.pdf";

  return (
    <article className="mx-auto max-w-[900px] px-[var(--page-pad)] py-14 md:py-20">
      {/* Top bar — hidden in print */}
      <div className="flex items-center justify-between gap-3 print:hidden">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft size={14} /> {t("back")}
        </Link>
        <PrintButton label={t("print")} />
      </div>

      {/* Identity */}
      <header className="mt-7 flex items-center gap-5">
        <ProfilePhoto
          alt="Ralph Christian Gabriel"
          className="h-[74px] w-[74px] overflow-hidden rounded-2xl border border-border-strong"
          priority
          sizes="74px"
        />
        <div>
          <h1
            className="text-3xl leading-none md:text-[42px]"
            style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}
          >
            Ralph Christian Gabriel
          </h1>
          <p className="mt-2 font-mono text-xs text-muted-foreground">
            {t("role")} · {t("tagline")}
          </p>
        </div>
      </header>

      {/* Contact */}
      <div className="mt-5 flex flex-wrap gap-2 font-mono text-xs">
        <span className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-border-color px-3.5 py-2 text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--shipped)" }} />
          {t("availability")}
        </span>
        <a href="mailto:ralph.c.gabriel@proton.me" className={CHIP}>
          <Mail size={13} /> ralph.c.gabriel@proton.me
        </a>
        <a href="https://cal.com/ralphchristiangabriel/15min" target="_blank" rel="noreferrer" className={CHIP}>
          <Calendar size={13} /> cal.com ↗
        </a>
        <a href="https://linkedin.com/in/ralph-christian-gabriel-45092021b" target="_blank" rel="noreferrer" className={CHIP}>
          <LinkedInIcon size={13} /> LinkedIn ↗
        </a>
        <a href="https://github.com/ralphgabriel04" target="_blank" rel="noreferrer" className={CHIP}>
          <GitHubIcon size={13} /> GitHub ↗
        </a>
        <a
          href={cvHref}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-accent bg-accent px-3.5 py-2 font-semibold text-[color:var(--accent-foreground)] transition-opacity hover:opacity-90"
        >
          {t("cv")} ↓
        </a>
      </div>

      {/* Proof quad */}
      <div className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border-color bg-border-color md:grid-cols-4">
        {proofs.map((p) => (
          <div key={p.label} className="bg-muted p-4">
            <div
              className="text-[1.7rem] leading-none text-accent"
              style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}
            >
              {p.value}
            </div>
            <div className="mt-1.5 text-xs text-muted-foreground">{p.label}</div>
          </div>
        ))}
      </div>

      {/* Systems */}
      <h2 className="mt-9 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
        {t("systemsLabel")}
      </h2>
      <div className="mt-3 overflow-hidden rounded-xl border border-border-color">
        {sys.map((p, i) => {
          const live = projectLinks[p.id]?.find((l) => l.type === "live")?.url;
          return (
            <div
              key={p.id}
              className="grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-1.5 border-b border-border-color px-4 py-3.5 last:border-b-0 sm:grid-cols-[auto_1fr_auto]"
            >
              <span className="flex items-center gap-2 font-mono text-[11px]" style={{ color: "var(--accent)" }}>
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: stateColor[projectState(p.id)] }} />
                SYS–0{i + 1}
              </span>
              <div className="min-w-0">
                <div className="text-sm font-medium">{p.name}</div>
                <div className="truncate text-xs text-muted-foreground">{p.tag[locale]}</div>
              </div>
              <div className="col-span-2 flex gap-4 text-xs font-medium sm:col-span-1 sm:justify-end">
                {caseStudyIds.has(p.id) && (
                  <Link href={`/projects/${p.id}`} className="text-accent hover:underline">
                    {t("viewCase")} →
                  </Link>
                )}
                {live && (
                  <a href={live} target="_blank" rel="noreferrer" className="text-foreground hover:underline">
                    {t("demo")} ↗
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Path + Education */}
      <div className="mt-9 grid gap-8 md:grid-cols-2">
        <section>
          <h2 className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
            {t("pathLabel")}
          </h2>
          <div className="mt-3 flex flex-col gap-2.5">
            {items.map((e, i) => (
              <div key={i} className="text-[13px] leading-relaxed">
                <span className="font-mono text-[11px] text-muted-foreground">{e.date}</span> —{" "}
                <strong className="font-semibold">{e.role}</strong>, {e.org}
              </div>
            ))}
          </div>
        </section>
        <section>
          <h2 className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
            {t("eduLabel")}
          </h2>
          <div className="mt-3 flex flex-col gap-2.5">
            {education.map((e, i) => (
              <div key={i} className="text-[13px] leading-relaxed text-muted-foreground">
                <span className="font-mono text-[11px]">{e.date}</span> — {e.title}, {e.org}
              </div>
            ))}
          </div>
        </section>
      </div>
    </article>
  );
}
