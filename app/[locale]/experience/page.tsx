import type { Metadata } from "next";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Briefcase, GraduationCap, Award } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isFr = locale === "fr";
  return {
    title: isFr ? "Expérience" : "Experience",
    description: isFr
      ? "Parcours professionnel et formation. Cadence (cofondateur), projets freelance, The Mad Space, Fastercom, Vidéotron. B. Ing. génie logiciel ÉTS."
      : "Career and education. Cadence (co-founder), freelance projects, The Mad Space, Fastercom, Vidéotron. B.Eng. Software Engineering ÉTS.",
    alternates: {
      languages: { fr: "/fr/experience", en: "/en/experience" },
    },
  };
}
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";

const certImages = [
  "/images/certs/responsive-web-design.png",
  "/images/certs/learn-html.png",
  "/images/certs/learn-python-3.png",
  "/images/certs/intro-ai-strategy.png",
];

export default async function ExperiencePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ExperienceContent />;
}

function ExperienceContent() {
  const t = useTranslations("experience");
  const tSec = useTranslations("sectionLabels");

  const proCount = 3;
  const eduCount = 3;
  const certCount = 4;

  return (
    <section className="mx-auto max-w-[var(--max-content)] px-[var(--page-pad)] py-20">
      <Reveal>
        <SectionHeading as="h1" kicker={tSec("experience")} title={t("heading")} />
      </Reveal>

      {/* Professional Experience */}
      <div className="mt-14">
        <Reveal delay={60}>
          <div className="mb-8 flex items-center gap-2">
            <Briefcase size={18} className="text-muted-foreground" />
            <h3 className="text-lg font-medium">{t("proTitle")}</h3>
          </div>
        </Reveal>

        <div className="flex flex-col gap-0 border-l border-border-color ml-2">
          {Array.from({ length: proCount }, (_, i) => (
            <Reveal key={i} delay={80 + i * 60}>
              <div className="relative pl-8 pb-10 last:pb-0">
                <div className="absolute left-[-5px] top-1 h-2.5 w-2.5 rounded-full border-2 border-border-strong bg-background" />
                <span className="font-mono text-xs text-muted-foreground">
                  {t(`items.${i}.date`)}
                </span>
                <h4 className="mt-1 text-sm font-medium">
                  {t(`items.${i}.role`)}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {t(`items.${i}.org`)}
                </p>
                <p className="mt-2 max-w-[60ch] text-sm leading-relaxed text-muted-foreground">
                  {t(`items.${i}.desc`)}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Education */}
      <div className="mt-16">
        <Reveal delay={60}>
          <div className="mb-8 flex items-center gap-2">
            <GraduationCap size={18} className="text-muted-foreground" />
            <h3 className="text-lg font-medium">{t("eduTitle")}</h3>
          </div>
        </Reveal>

        <div className="flex flex-col gap-0 border-l border-border-color ml-2">
          {Array.from({ length: eduCount }, (_, i) => (
            <Reveal key={i} delay={80 + i * 60}>
              <div className="relative pl-8 pb-8 last:pb-0">
                <div className="absolute left-[-5px] top-1 h-2.5 w-2.5 rounded-full border-2 border-border-strong bg-background" />
                <span className="font-mono text-xs text-muted-foreground">
                  {t(`education.${i}.date`)}
                </span>
                <h4 className="mt-1 text-sm font-medium">
                  {t(`education.${i}.title`)}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {t(`education.${i}.org`)}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Certifications */}
      <div className="mt-16">
        <Reveal delay={60}>
          <div className="mb-8 flex items-center gap-2">
            <Award size={18} className="text-muted-foreground" />
            <h3 className="text-lg font-medium">{t("certTitle")}</h3>
          </div>
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: certCount }, (_, i) => (
            <Reveal key={i} delay={80 + i * 60}>
              <a
                href={certImages[i]}
                target="_blank"
                rel="noreferrer"
                className="group block rounded-lg border border-border-color bg-muted overflow-hidden transition-colors hover:border-border-strong"
              >
                <Image
                  src={certImages[i]!}
                  alt={t(`certifications.${i}.title`)}
                  width={600}
                  height={400}
                  className="w-full object-cover"
                />
                <div className="p-4">
                  <h4 className="text-sm font-medium group-hover:text-accent transition-colors">
                    {t(`certifications.${i}.title`)}
                  </h4>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {t(`certifications.${i}.org`)}
                  </p>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
