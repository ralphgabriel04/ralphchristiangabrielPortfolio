import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowRight, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <AboutContent />;
}

function AboutContent() {
  const t = useTranslations("about");
  const tSec = useTranslations("sectionLabels");

  return (
    <section className="mx-auto max-w-[var(--max-content)] px-[var(--page-pad)] py-20">
      <Reveal>
        <SectionHeading kicker={tSec("about")} title={t("heading")} />
      </Reveal>

      <div className="mt-12 grid gap-12 md:grid-cols-[280px_1fr] lg:grid-cols-[320px_1fr]">
        {/* Photo placeholder */}
        <Reveal delay={60}>
          <div className="flex flex-col gap-3">
            <div className="aspect-[4/5] w-full rounded-lg border border-border-color bg-muted-2 flex items-center justify-center">
              <span className="font-mono text-xs text-muted-foreground">
                Photo
              </span>
            </div>
            <span className="text-xs text-muted-foreground">
              {t("caption")}
            </span>
          </div>
        </Reveal>

        {/* Bio */}
        <Reveal delay={120}>
          <div className="flex flex-col gap-6">
            <p className="max-w-[60ch] text-sm leading-relaxed text-muted-foreground">
              {t("paragraphs.0")}
            </p>
            <p className="max-w-[60ch] text-sm leading-relaxed text-muted-foreground">
              {t("paragraphs.1")}
            </p>
            <p className="max-w-[60ch] text-sm leading-relaxed text-muted-foreground">
              {t("paragraphs.2")}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-4">
              <Link href="/experience">
                <Button variant="secondary">
                  {t("seeExperience")} <ArrowRight size={16} />
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="ghost">
                  <Mail size={16} /> {t("getInTouch")}
                </Button>
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
