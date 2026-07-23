import type { Metadata } from "next";
import { useTranslations, useLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/ui/reveal";
import { TestimonialsPageGrid } from "@/components/ui/testimonials-page-grid";
import { testimonials } from "@/lib/testimonials";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isFr = locale === "fr";
  return {
    title: isFr ? "Témoignages" : "Testimonials",
    description: isFr
      ? "Découvrez les retours de personnes avec qui j'ai eu le plaisir de collaborer sur différents projets."
      : "Discover feedback from people I've had the pleasure of collaborating with on various projects.",
    alternates: {
      languages: { fr: "/fr/temoignages", en: "/en/temoignages" },
    },
  };
}

export default async function TestimonialsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <TestimonialsContent />;
}

function TestimonialsContent() {
  const t = useTranslations("testimonialsPage");
  const locale = useLocale() as "fr" | "en";

  return (
    <section className="min-h-screen bg-muted/40">
      <div className="mx-auto max-w-[var(--max-content)] px-[var(--page-pad)] pt-16 pb-24 md:pt-24">
        {/* Breadcrumb */}
        <Reveal>
          <nav className="text-[12.5px] text-muted-foreground/60">
            <Link href="/" className="hover:text-foreground transition-colors">
              {t("breadcrumbHome")}
            </Link>
            <span className="px-2">/</span>
            <span className="text-foreground">{t("breadcrumbCurrent")}</span>
          </nav>
        </Reveal>

        {/* Title */}
        <Reveal delay={40}>
          <div className="mt-6 max-w-3xl">
            <h1 className="text-[40px] font-medium leading-[1.05] tracking-tight md:text-[56px]">
              {t("headingPre")}
              <span
                className="italic"
                style={{ fontFamily: "var(--font-instrument-serif), 'Georgia', serif", fontWeight: 400 }}
              >
                {t("headingItalic")}
              </span>
            </h1>
            <p className="mt-5 max-w-xl text-[15.5px] leading-relaxed text-muted-foreground md:text-[17px]">
              {t("subtitle")}
            </p>
          </div>
        </Reveal>

        {/* Filters + Grid */}
        <Reveal delay={80}>
          <TestimonialsPageGrid
            testimonials={testimonials}
            locale={locale}
            addLabel={t("addTestimonial")}
            addHref={t("addHref")}
            addCtaTitle={t("addCtaTitle")}
            addCtaSubtitle={t("addCtaSubtitle")}
            addCtaBadge={t("addCtaBadge")}
            resultLabel={t("resultLabel")}
            resultLabelPlural={t("resultLabelPlural")}
            emptyLabel={t("emptyLabel")}
          />
        </Reveal>
      </div>
    </section>
  );
}
