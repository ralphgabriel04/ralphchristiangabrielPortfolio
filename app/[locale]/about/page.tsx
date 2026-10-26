import type { Metadata } from "next";
import { alternatesFor } from "@/lib/site";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowRight, Mail, Timer, MapPin, Trophy, ExternalLink, Award, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { LibrarySection } from "@/components/ui/library-section";
import { galleryCount, couplePhotos, gallerySrc } from "@/lib/gallery";

/** Personal photos for the « Hors écran » gallery, oldest first. Captions and alt text: messages about.gallery.items (same order). */
const GALLERY = [
  "/images/beyond-code/hors-ecran-mont-royal-2025.jpg",
  "/images/beyond-code/hors-ecran-riviere-2026.jpg",
  "/images/beyond-code/hors-ecran-sutton-2026.jpg",
] as const;

type GalleryItem = { caption: string; date: string; alt: string };

/** Official chip-time result (Sportstats/RTRT), Course des pompiers de Laval, 2 June 2024. */
const MARATHON_RESULT_URL = "https://track.rtrt.me/e/SS-COURSEDESPOMPIERS24#/dash/R8WN6ZCU";
const MARATHON_CERTIFICATE = "/images/beyond-code/half-marathon-certificate.png";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isFr = locale === "fr";
  return {
    title: isFr ? "À propos" : "About",
    description: isFr
      ? "Développeur full-stack et étudiant en génie logiciel à l'ÉTS, en stage à La Caisse (CDPQ). Mon parcours, du soutien TI au développement web et mobile."
      : "Full-stack developer and software engineering student at ÉTS, interning at La Caisse (CDPQ). My path from IT support to web and mobile development.",
    alternates: alternatesFor(locale, "/about"),
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
  const lang = useLocale() === "fr" ? "fr" : "en";
  const galleryItems = t.raw("gallery.items") as GalleryItem[];
  const tSec = useTranslations("sectionLabels");

  const workPoints = t.raw("personality.points") as string[];

  return (
    <>
      <section className="mx-auto max-w-[var(--max-content)] px-[var(--page-pad)] py-20">
        <Reveal>
          <SectionHeading as="h1" kicker={tSec("about")} title={t("heading")} />
        </Reveal>

        <div className="mt-12 grid gap-12 md:grid-cols-[340px_1fr] lg:grid-cols-[440px_1fr]">
          {/* "About me" poster (FR/EN), first thing on the page; opens full size in a new tab */}
          <Reveal delay={60}>
            <figure className="flex flex-col gap-3">
              <a
                href={t("poster.src")}
                target="_blank"
                rel="noopener"
                aria-label={t("poster.open")}
                className="group relative block aspect-[1122/1402] w-full overflow-hidden rounded-lg border border-border-color bg-muted-2 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
              >
                <Image
                  src={t("poster.src")}
                  alt={t("poster.alt")}
                  fill
                  sizes="(max-width: 767px) 100vw, (max-width: 1023px) 340px, 440px"
                  priority
                  className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.02]"
                />
              </a>
              <figcaption className="text-xs text-muted-foreground">
                {t("poster.caption")} · {t("poster.open")}
              </figcaption>
            </figure>
          </Reveal>

          {/* Bio */}
          <Reveal delay={120}>
            <div className="flex flex-col gap-5">
              <p className="max-w-[62ch] text-base leading-relaxed text-muted-foreground">
                {t("paragraphs.0")}
              </p>
              <p className="max-w-[62ch] text-base leading-relaxed text-muted-foreground">
                {t("paragraphs.1")}
              </p>
              <p className="max-w-[62ch] text-base leading-relaxed text-muted-foreground">
                {t("paragraphs.2")}
              </p>

              {/* Right now (moved here from the home page, shortened) */}
              <div className="max-w-[62ch] rounded-xl border border-border-color bg-muted p-5">
                <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--shipped)" }} aria-hidden="true" />
                  {t("now.title")}
                </div>
                <p className="mt-2 text-[15px] leading-relaxed text-foreground">{t("now.body")}</p>
                <p className="mt-2 font-mono text-[12px] text-muted-foreground">{t("now.updated")}</p>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
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
      <section id="en-dehors-du-code" className="mx-auto max-w-[var(--max-content)] scroll-mt-24 px-[var(--page-pad)] pb-20">
        <Reveal>
          <div className="border-b border-border-strong pb-5">
            <h2
              className="text-3xl leading-[1.05] tracking-[-0.01em] md:text-[40px]"
              style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}
            >
              {t("beyondCode")}
            </h2>
            <p className="mt-3 text-[15px] text-muted-foreground">{t("beyondCodeSub")}</p>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {/* Half-Marathon Card */}
          <Reveal delay={60} className="h-full">
            <div className="group rounded-lg border border-border-color bg-muted overflow-hidden h-full flex flex-col">
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src="/images/beyond-code/half-marathon-finish.png"
                  alt={t("marathon.photoAlt")}
                  fill
                  className="object-cover object-[center_35%] transition-transform duration-500 group-hover:scale-105"
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
                    <span className="text-[12px] text-muted-foreground">{t("marathon.pace")}</span>
                  </div>
                  <div className="flex flex-col items-center rounded-md bg-muted-2 px-2 py-2">
                    <MapPin size={14} className="text-accent mb-1" />
                    <span className="text-xs font-semibold">{t("marathon.distance")}</span>
                    <span className="text-[12px] text-muted-foreground">Laval, QC</span>
                  </div>
                  <div className="flex flex-col items-center rounded-md bg-muted-2 px-2 py-2">
                    <Trophy size={14} className="text-accent mb-1" />
                    <span className="text-xs font-semibold">{t("marathon.rankPos")}</span>
                    <span className="text-[12px] text-muted-foreground">{t("marathon.rankTotal")}</span>
                  </div>
                </div>

                <p className="mt-3 mb-4 text-xs leading-relaxed text-muted-foreground">
                  {t("marathon.desc")}
                </p>

                <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border-color pt-3 text-xs">
                  <a
                    href={MARATHON_CERTIFICATE}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 font-medium underline decoration-border-strong underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
                  >
                    <Award size={14} aria-hidden="true" />
                    {t("marathon.certificate")}
                  </a>
                  <a
                    href={MARATHON_RESULT_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 font-medium underline decoration-border-strong underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
                  >
                    <BadgeCheck size={14} aria-hidden="true" />
                    {t("marathon.result")}
                    <ExternalLink size={12} aria-hidden="true" />
                  </a>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Personality Card — horizontal layout */}
          <Reveal delay={120} className="h-full">
            <div className="rounded-lg border border-border-color bg-muted overflow-hidden h-full">
              <div className="grid grid-cols-[140px_1fr] sm:grid-cols-[200px_1fr] h-full">
                <div className="relative min-h-[220px] overflow-hidden">
                  <Image
                    src="/images/beyond-code/graduation.jpg"
                    alt={t("graduationAlt")}
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

          {/* Chess Card — same height as the ski card (Reveal is the grid item) */}
          <Reveal delay={180} className="h-full">
            <div className="group h-full rounded-lg border border-border-color bg-muted overflow-hidden">
              <div className="grid h-full grid-cols-[120px_1fr] sm:grid-cols-[160px_1fr]">
                <div className="relative min-h-[160px] overflow-hidden">
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
          <Reveal delay={240} className="h-full">
            <div className="group h-full rounded-lg border border-border-color bg-muted overflow-hidden">
              <div className="grid h-full grid-cols-[120px_1fr] sm:grid-cols-[160px_1fr]">
                <div className="relative min-h-[160px] overflow-hidden">
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

      {/* Off screen: personal photos (2025-2026), chronological */}
      <section aria-labelledby="hors-ecran" className="mx-auto max-w-[var(--max-content)] px-[var(--page-pad)] pb-20">
        <Reveal>
          <div className="border-b border-border-strong pb-5">
            <h2
              id="hors-ecran"
              className="text-3xl leading-[1.05] tracking-[-0.01em] md:text-[40px]"
              style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}
            >
              {t("gallery.heading")}
            </h2>
            <p className="mt-3 text-[15px] text-muted-foreground">{t("gallery.sub")}</p>
          </div>
        </Reveal>


        <article id="anne-sofie" aria-labelledby="anne-sofie-heading" className="mt-10 scroll-mt-24 border-b border-border-color pb-10">
          <Reveal>
            <div className="grid items-start gap-8 md:grid-cols-[1fr_1.1fr] md:gap-10">
              <div className="md:col-start-2 md:row-start-1">
                <p className="font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">{t("couple.kicker")}</p>
                <h3 id="anne-sofie-heading" className="mt-3 text-3xl leading-tight md:text-[36px]" style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}>{t("couple.heading")}</h3>
                <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">{t("couple.intro")}</p>
                <p className="mt-5 max-w-[48ch] text-base leading-relaxed text-foreground">{t("couple.message")}</p>
                <p className="mt-4 text-sm font-medium">{t("couple.signature")}</p>
                <Link href="/photos#anne-sofie" className="mt-5 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-accent hover:underline">{t("couple.seePhotos")} <ArrowRight size={14} aria-hidden="true" /></Link>
              </div>
              <figure className="overflow-hidden rounded-lg border border-border-color bg-muted md:col-start-1 md:row-start-1 md:row-span-2">
                <a href={gallerySrc(couplePhotos[0].slug)} target="_blank" rel="noreferrer" className="block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent">
                  <Image src={gallerySrc(couplePhotos[0].slug)} alt={couplePhotos[0].alt[lang]} width={couplePhotos[0].w} height={couplePhotos[0].h} sizes="(max-width: 767px) 100vw, 480px" className="h-auto w-full" />
                </a>
                <figcaption className="flex flex-wrap justify-between gap-1 px-4 py-3 text-[13px]"><span>{couplePhotos[0].caption[lang]}</span><span className="font-mono text-xs text-muted-foreground">{couplePhotos[0].date[lang]}</span></figcaption>
              </figure>
              <div className="grid grid-cols-2 gap-4 md:col-start-2 md:row-start-2">
                {couplePhotos.slice(1).map((photo) => <figure key={photo.slug} className="overflow-hidden rounded-lg border border-border-color bg-muted">
                  <a href={gallerySrc(photo.slug)} target="_blank" rel="noreferrer" className="block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent">
                    <Image src={gallerySrc(photo.slug)} alt={photo.alt[lang]} width={photo.w} height={photo.h} sizes="(max-width: 767px) 50vw, 260px" className="h-auto w-full" />
                  </a>
                  <figcaption className="px-3 py-2 text-[12px] leading-relaxed"><span className="block font-medium">{photo.caption[lang]}</span><span className="font-mono text-muted-foreground">{photo.date[lang]}</span></figcaption>
                </figure>)}
              </div>
            </div>
          </Reveal>
        </article>

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {GALLERY.map((src, i) => {
            const item = galleryItems[i];
            if (!item) return null;
            return (
              <Reveal key={src} delay={60 * (i + 1)}>
                <figure className="group overflow-hidden rounded-lg border border-border-color bg-muted">
                  <div className="relative aspect-[4/5] overflow-hidden sm:aspect-[3/4]">
                    <Image
                      src={src}
                      alt={item.alt}
                      fill
                      className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.03]"
                      sizes="(max-width: 640px) 100vw, 33vw"
                    />
                  </div>
                  <figcaption className="flex items-baseline justify-between gap-3 px-4 py-3">
                    <span className="text-sm font-medium text-foreground">{item.caption}</span>
                    <span className="shrink-0 font-mono text-[12px] text-muted-foreground">{item.date}</span>
                  </figcaption>
                </figure>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={240}>
          <Link
            href="/photos"
            className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline"
          >
            {t("gallery.seeAll", { count: galleryCount })} <ArrowRight size={14} />
          </Link>
        </Reveal>
      </section>

      {/* Reading: books, quotes, learning system */}
      <LibrarySection />

      {/* GitHub Activity */}
      <section className="mx-auto max-w-[var(--max-content)] px-[var(--page-pad)] pb-20">
        <Reveal>
          <div className="border-b border-border-strong pb-5">
            <h2
              className="text-3xl leading-[1.05] tracking-[-0.01em] md:text-[40px]"
              style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}
            >
              {t("github.heading")}
            </h2>
            <p className="mt-3 text-[15px] text-muted-foreground">{t("github.sub")}</p>
          </div>
        </Reveal>

        {/* Third-party stat cards removed (2026-10-18): one rendered empty and the
            other used an off-palette navy/purple theme. First-party pointers instead. */}
        <div className="mt-8 flex flex-col gap-6">
          <Reveal delay={60}>
            <div className="rounded-lg border border-border-color bg-muted p-6">
              <div className="flex flex-col gap-3">
                <div className="flex max-w-[72ch] flex-col gap-2.5 text-[15px] leading-relaxed text-muted-foreground">
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
