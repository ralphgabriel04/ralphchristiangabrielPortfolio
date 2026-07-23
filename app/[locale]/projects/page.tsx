import type { Metadata } from "next";
import { useTranslations, useLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isFr = locale === "fr";
  return {
    title: isFr ? "Projets" : "Projects",
    description: isFr
      ? "Neuf projets : e-commerce, apps mobiles, prototypes produit, sites clients et architecture académique."
      : "Nine projects: e-commerce, mobile apps, product prototypes, client sites and academic architecture.",
    alternates: {
      languages: { fr: "/fr/projects", en: "/en/projects" },
    },
  };
}
import { projects } from "@/lib/projects";
import { Reveal } from "@/components/ui/reveal";
import { ProjectsFilterList } from "@/components/ui/projects-filter-list";

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ProjectsContent />;
}

function ProjectsContent() {
  const t = useTranslations("projects");
  const tSec = useTranslations("sectionLabels");
  const locale = useLocale();

  return (
    <section className="mx-auto max-w-[var(--max-content)] px-[var(--page-pad)] py-20 md:py-24">
      <Reveal>
        <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
          {tSec("selected")}
        </span>
        <h1
          className="mt-3 text-4xl leading-[1.02] tracking-[-0.01em] md:text-[56px]"
          style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}
        >
          {locale === "fr" ? "Projets" : "Projects"}
        </h1>
        <p className="mt-4 mb-12 max-w-[60ch] text-[15px] leading-relaxed text-muted-foreground">
          {t("subtitle")}
        </p>
      </Reveal>

      <Reveal delay={60}>
        <ProjectsFilterList projects={projects} />
      </Reveal>
    </section>
  );
}
