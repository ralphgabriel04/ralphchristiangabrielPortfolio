import type { Metadata } from "next";
import Image from "next/image";
import { ProfilePhoto } from "@/components/ui/profile-photo";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowRight, Mail, Timer, MapPin, Trophy, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isFr = locale === "fr";
  return {
    title: isFr ? "À propos" : "About",
    description: isFr
      ? "Développeur full-stack junior et étudiant en génie logiciel à l'ÉTS, basé à Repentigny (Grand Montréal). Du support TI à l'automatisation, puis au développement web et mobile."
      : "Junior full-stack developer and Software Engineering student at ÉTS, based in Repentigny (Greater Montréal). From IT support and automation to web and mobile development.",
    alternates: {
      languages: { fr: "/fr/about", en: "/en/about" },
    },
  };
}

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

  const workPoints = t.raw("personality.points") as string[];

  return (
    <>
      <section className="mx-auto max-w-[var(--max-content)] px-[var(--page-pad)] py-20">
        <Reveal>
          <SectionHeading as="h1" kicker={tSec("about")} title={t("heading")} />
        </Reveal>

        <div className="mt-12 grid gap-12 md:grid-cols-[280px_1fr] lg:grid-cols-[320px_1fr]">
          {/* Photo */}
          <Reveal delay={60}>
            <div className="flex flex-col gap-3">
              <div className="aspect-[4/5] w-full rounded-lg border border-border-color bg-muted-2 overflow-hidden relative">
                <ProfilePhoto
                  alt="Ralph Christian Gabriel"
                  fill
                  sizes="(max-width: 768px) 100vw, 320px"
                  priority
                />
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

      {/* Beyond Code */}
      <section className="mx-auto max-w-[var(--max-content)] px-[var(--page-pad)] pb-20">
        <Reveal>
          <h2 className="text-xl font-semibold tracking-tight">{t("beyondCode")}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{t("beyondCodeSub")}</p>
        </Reveal>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {/* Half-Marathon Card */}
          <Reveal delay={60}>
            <div className="group rounded-lg border border-border-color bg-muted overflow-hidden h-full flex flex-col">
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src="/images/beyond-code/half-marathon-certificate.png"
                  alt={t("marathon.event")}
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
              </div>
              <div className="p-5 flex flex-col flex-1">
                <h3 className="text-sm font-semibold">{t("marathon.title")}</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  {t("marathon.event")} &middot; {t("marathon.date")}
                </p>

                <div className="mt-3 grid grid-cols-3 gap-2">
                  <div className="flex flex-col items-center rounded-md bg-muted-2 px-2 py-2">
                    <Timer size={14} className="text-accent mb-1" />
                    <span className="text-xs font-semibold">{t("marathon.time")}</span>
                    <span className="text-[10px] text-muted-foreground">{t("marathon.pace")}</span>
                  </div>
                  <div className="flex flex-col items-center rounded-md bg-muted-2 px-2 py-2">
                    <MapPin size={14} className="text-accent mb-1" />
                    <span className="text-xs font-semibold">{t("marathon.distance")}</span>
                    <span className="text-[10px] text-muted-foreground">Laval, QC</span>
                  </div>
                  <div className="flex flex-col items-center rounded-md bg-muted-2 px-2 py-2">
                    <Trophy size={14} className="text-accent mb-1" />
                    <span className="text-xs font-semibold">511e</span>
                    <span className="text-[10px] text-muted-foreground">/ 1,354</span>
                  </div>
                </div>

                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                  {t("marathon.desc")}
                </p>
              </div>
            </div>
          </Reveal>

          {/* Personality Card — horizontal layout */}
          <Reveal delay={120}>
            <div className="rounded-lg border border-border-color bg-muted overflow-hidden h-full">
              <div className="grid grid-cols-[140px_1fr] sm:grid-cols-[200px_1fr] h-full">
                <div className="relative min-h-[220px] overflow-hidden">
                  <Image
                    src="/images/beyond-code/graduation.png"
                    alt="Graduation"
                    fill
                    className="object-cover object-top"
                    sizes="200px"
                  />
                </div>
                <div className="p-5 flex flex-col justify-center">
                  <h3 className="text-sm font-semibold">{t("personality.title")}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {t("personality.desc")}
                  </p>

                  <ul className="mt-4 flex flex-col gap-2.5">
                    {workPoints.map((point) => (
                      <li key={point} className="flex items-start gap-2.5 text-[12px] leading-relaxed text-muted-foreground">
                        <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Chess Card — compact, between personality and ski */}
          <Reveal delay={180}>
            <div className="group rounded-lg border border-border-color bg-muted overflow-hidden sm:col-span-2">
              <div className="grid grid-cols-[120px_1fr] sm:grid-cols-[160px_1fr]">
                <div className="relative min-h-[140px] overflow-hidden">
                  <Image
                    src="/images/beyond-code/chess.png"
                    alt={t("chess.title")}
                    fill
                    className="object-cover object-[center_30%] transition-transform duration-500 group-hover:scale-105"
                    sizes="160px"
                  />
                </div>
                <div className="p-4 flex flex-col justify-center">
                  <h3 className="text-sm font-semibold">{t("chess.title")}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                    {t("chess.desc")}
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Skiing Card — horizontal layout, zoom out */}
          <Reveal delay={240}>
            <div className="group rounded-lg border border-border-color bg-muted overflow-hidden sm:col-span-2">
              <div className="grid grid-cols-[140px_1fr] sm:grid-cols-[180px_1fr]">
                <div className="relative min-h-[180px] overflow-hidden">
                  <Image
                    src="/images/beyond-code/skiing.png"
                    alt={t("skiing.title")}
                    fill
                    className="object-cover object-[center_60%]"
                    sizes="180px"
                  />
                </div>
                <div className="p-5 flex flex-col justify-center">
                  <h3 className="text-sm font-semibold">{t("skiing.title")}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    {t("skiing.desc")}
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* GitHub Activity */}
      <section className="mx-auto max-w-[var(--max-content)] px-[var(--page-pad)] pb-20">
        <Reveal>
          <h2 className="text-xl font-semibold tracking-tight">{t("github.heading")}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{t("github.sub")}</p>
        </Reveal>

        <div className="mt-8 flex flex-col gap-6">
          {/* Stats + Languages */}
          <Reveal delay={60}>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="overflow-hidden rounded-lg border border-border-color bg-muted p-1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://github-profile-summary-cards.vercel.app/api/cards/stats?username=ralphgabriel04&theme=tokyonight"
                  alt={t("github.statsAlt")}
                  className="w-full"
                  loading="lazy"
                  width={400}
                  height={200}
                />
              </div>
              <div className="overflow-hidden rounded-lg border border-border-color bg-muted p-1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://github-profile-summary-cards.vercel.app/api/cards/most-commit-language?username=ralphgabriel04&theme=tokyonight"
                  alt={t("github.languagesAlt")}
                  className="w-full"
                  loading="lazy"
                  width={400}
                  height={200}
                />
              </div>
            </div>
          </Reveal>

          {/* Highlights + CTA */}
          <Reveal delay={180}>
            <div className="rounded-lg border border-border-color bg-muted p-5">
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                  <p>{t("github.highlights.0")}</p>
                  <p>{t("github.highlights.1")}</p>
                  <p>{t("github.highlights.2")}</p>
                </div>
                <a
                  href="https://github.com/ralphgabriel04"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-flex w-fit items-center gap-2 rounded-md border border-border-color px-4 py-2 text-sm font-medium text-foreground hover:border-border-strong hover:bg-muted-2 transition-colors"
                >
                  <svg viewBox="0 0 24 24" width={16} height={16} fill="currentColor" aria-hidden="true"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
                  {t("github.cta")}
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
