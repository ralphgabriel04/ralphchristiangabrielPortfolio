import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";

type ServiceItem = {
  title: string;
  audience: string;
  problem: string;
  deliver: string;
  example: string;
  exampleId: string;
};

/**
 * "J'ai un projet" — the client-facing journey. Three service tracks grounded in
 * real shipped work (each example links to an actual project). No commercial
 * promises: just audience → problem → what I deliver → a real example.
 */
export function ServicesSection() {
  const t = useTranslations("services");
  const items = t.raw("items") as ServiceItem[];
  const email = "ralph.c.gabriel@proton.me";

  return (
    <section id="sec-services" className="scroll-mt-24 border-t border-border-color">
      <div className="mx-auto max-w-[var(--max-content)] px-[var(--page-pad)] py-20 md:py-28">
        <Reveal>
          <div className="max-w-2xl">
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
              {t("kicker")}
            </span>
            <h2
              className="mt-3 text-4xl leading-[1.03] tracking-[-0.01em] md:text-[52px]"
              style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}
            >
              {t("heading")}
            </h2>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">{t("intro")}</p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {items.map((s, i) => (
            <Reveal key={s.title} delay={i * 60}>
              <div className="flex h-full flex-col rounded-2xl border border-border-color bg-muted p-6 md:p-7">
                <h3 className="text-xl font-semibold tracking-tight">{s.title}</h3>
                <dl className="mt-5 flex flex-col gap-3.5 text-sm">
                  <div>
                    <dt className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted-foreground/70">
                      {t("labelAudience")}
                    </dt>
                    <dd className="mt-1 text-foreground">{s.audience}</dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted-foreground/70">
                      {t("labelProblem")}
                    </dt>
                    <dd className="mt-1 text-muted-foreground">{s.problem}</dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted-foreground/70">
                      {t("labelDeliver")}
                    </dt>
                    <dd className="mt-1 text-muted-foreground">{s.deliver}</dd>
                  </div>
                </dl>
                <Link
                  href={`/projects/${s.exampleId}`}
                  className="group mt-auto block border-t border-border-color pt-4"
                >
                  <span className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted-foreground/70">
                    {t("labelExample")}
                  </span>
                  <span className="mt-1 flex items-start gap-1 text-[13px] font-medium text-accent group-hover:underline">
                    {s.example}
                    <ArrowRight size={13} className="mt-0.5 shrink-0" />
                  </span>
                </Link>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={120}>
          <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-lg font-medium">{t("cta")}</p>
            <div className="flex flex-wrap gap-3">
              <a href={`mailto:${email}`}>
                <Button>
                  {t("ctaButton")} <ArrowRight size={16} />
                </Button>
              </a>
              <a href="https://cal.com/ralphchristiangabriel/15min" target="_blank" rel="noreferrer">
                <Button variant="secondary">
                  {t("ctaBook")} <ArrowUpRight size={16} />
                </Button>
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
