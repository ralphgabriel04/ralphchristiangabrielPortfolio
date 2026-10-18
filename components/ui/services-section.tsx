import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";

type ServiceItem = {
  title: string;
  audience: string;
  problem: string;
  deliver: string;
  example: string;
  exampleId: string;
};

/**
 * "Comment je peux aider" — how I help each kind of visitor. Four tracks (clients
 * for web apps, prototypes and integrations, plus recruiters/teams), each grounded
 * in real shipped work that links to an actual project. No commercial promises:
 * just audience, need, what I bring, and a real example.
 */
export function ServicesSection() {
  const t = useTranslations("services");
  const items = t.raw("items") as ServiceItem[];

  return (
    <section id="sec-services" className="scroll-mt-24 border-t border-border-color">
      <div className="mx-auto max-w-[var(--max-content)] px-[var(--page-pad)] py-20 md:py-24">
        <Reveal>
          <div className="border-b border-border-strong pb-6">
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
              {t("kicker")}
            </span>
            <h2
              className="mt-3 text-4xl leading-[1.03] tracking-[-0.01em] md:text-[52px]"
              style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}
            >
              {t("heading")}
            </h2>
          </div>
          <p className="mt-6 max-w-[60ch] text-base leading-relaxed text-muted-foreground">{t("intro")}</p>
        </Reveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {items.map((s, i) => (
            <Reveal key={s.title} delay={i * 60}>
              <div className="flex h-full flex-col rounded-2xl border border-border-color bg-muted p-6 md:p-7">
                <h3 className="text-xl font-semibold tracking-tight">{s.title}</h3>
                <dl className="mt-5 flex flex-col gap-3.5 text-[14.5px]">
                  <div>
                    <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                      {t("labelAudience")}
                    </dt>
                    <dd className="mt-1 text-foreground">{s.audience}</dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                      {t("labelProblem")}
                    </dt>
                    <dd className="mt-1 text-muted-foreground">{s.problem}</dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                      {t("labelDeliver")}
                    </dt>
                    <dd className="mt-1 text-muted-foreground">{s.deliver}</dd>
                  </div>
                </dl>
                <Link
                  href={`/projects/${s.exampleId}`}
                  className="group mt-auto block border-t border-border-color pt-4"
                >
                  <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
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

      </div>
    </section>
  );
}
