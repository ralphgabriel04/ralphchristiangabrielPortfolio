import { useTranslations, useLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { ArrowRight, ArrowDown, ArrowUpRight, Download, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { SystemsSection } from "@/components/ui/systems-section";
import { ServicesSection } from "@/components/ui/services-section";
import { TrackedLink } from "@/components/ui/tracked-link";
import { HeroStatus } from "@/components/ui/hero-status";
import { EmailCopy } from "@/components/ui/email-copy";
import { HeroCanvas } from "@/components/ui/hero-canvas";
import { CountUp } from "@/components/ui/count-up";
import { PlainBanner, Lexicon, PlainSwap } from "@/components/ui/plain-mode";
import { stackGroups, usedIn } from "@/lib/stack";
import { HeroPortrait } from "@/components/ui/hero-portrait";
import { TestimonialsCarousel } from "@/components/ui/testimonials-carousel";
import { testimonials, categoryLabels } from "@/lib/testimonials";
import { certifications as certList, formatCertDate } from "@/lib/certifications";
import { books } from "@/lib/library";
import { demos } from "@/lib/demos";
import { galleryCount, galleryGroups, gallerySrc, type GalleryPhoto } from "@/lib/gallery";

const SERIF = { fontFamily: "var(--font-instrument-serif), Georgia, serif" } as const;

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <HomeContent />;
}

/**
 * Home order (design spec 2026-07-29, updated after the 2026-10-18 audit):
 * hero (who, what, availability) → proof → featured projects → path →
 * tools → testimonials → services (client path) → contact.
 */
function HomeContent() {
  const t = useTranslations("hero");
  const tSum = useTranslations("summary");
  const locale = useLocale();

  const heroName = t("name");
  const nameParts = heroName.split(" ");
  const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : heroName;
  const firstName = nameParts.length > 1 ? nameParts.slice(0, -1).join(" ") : "";

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-14 pb-16 md:pt-20 md:pb-20">
        <HeroCanvas />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(1100px 520px at 60% 12%, color-mix(in srgb, var(--accent) 10%, transparent), transparent 70%)",
          }}
        />
        <Reveal>
          <div className="relative z-[1] mx-auto grid max-w-[var(--max-content)] items-center gap-10 px-[var(--page-pad)] lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-14">
            <div>
              {/* Mobile and tablet: the portrait column is hidden, so a small portrait opens the hero. */}
              <Image
                src="/images/gallery/la-caisse-portrait-2026.jpg"
                alt="Ralph Christian Gabriel"
                width={72}
                height={72}
                priority
                className="mb-6 h-[72px] w-[72px] rounded-2xl border border-border-color object-cover object-[50%_12%] shadow-sm lg:hidden"
              />
              {/* Kicker */}
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-accent" />
                <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                  {t("kicker")}
                </span>
              </div>

              {/* Name as H1 */}
              <h1
                className="mt-6 text-[52px] leading-[0.92] tracking-[-0.02em] sm:text-7xl md:text-[88px] lg:text-[84px] xl:text-[96px]"
                style={SERIF}
              >
                <span className="block">{firstName}</span>
                <span className="block">
                  {lastName}
                  <span className="text-accent">.</span>
                </span>
              </h1>

              {/* Role: one line, the same as the CV headline */}
              <p className="mt-6 text-xl font-medium tracking-[-0.01em] text-foreground md:text-2xl">
                {tSum("role")}
              </p>

              <div className="mt-4">
                <PlainBanner />
              </div>

              <p className="mt-4 max-w-[56ch] text-lg leading-relaxed text-muted-foreground">
                <PlainSwap tech={t("pitch")} plain={t("pitchPlain")} />
              </p>

              {/* CTAs: one primary, one secondary (terminal stays an easter egg: ⌘K, footer) */}
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a href="#sec-systemes" data-mag>
                  <Button>
                    {t("ctaSystems")} <ArrowDown size={16} />
                  </Button>
                </a>
                <Link href="/recruteur">
                  <Button variant="secondary">{t("ctaRecruiter")}</Button>
                </Link>
              </div>

              {/* Status line */}
              <div className="mt-8">
                <HeroStatus available={t("available")} location={t("location")} />
              </div>
            </div>

            {/* Portrait — right column (lg+) */}
            <div className="hidden lg:block">
              <HeroPortrait
                locale={locale}
                labels={{
                  pause: t("portraitPause"),
                  play: t("portraitPlay"),
                  show: t("portraitShow"),
                  group: t("portraitGroup"),
                }}
              />
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── Proof ── */}
      <BriefSection />

      <ProofQuad />

      {/* ── Projects ── */}
      <ProjectsSection />

      {/* ── Path ── */}
      <ParcoursSection />

      {/* ── Tools ── */}
      <StackSection />

      {/* ── Glossary (plain mode only) ── */}
      <Lexicon />

      {/* ── Testimonials ── */}
      <TestimonialsSection />

      {/* ── Beyond the code: previews of the photos, reading and interests pages ── */}
      <BeyondSection />

      {/* ── Services (client path) ── */}
      <ServicesSection />

      {/* ── Contact ── */}
      <ContactSection />
    </>
  );
}

/** Section header shared by every home section: mono kicker + serif title. */
function SectionTitle({
  kicker,
  title,
  aside,
  center = false,
}: {
  kicker: string;
  title: React.ReactNode;
  aside?: React.ReactNode;
  center?: boolean;
}) {
  return (
    <div
      className={`flex flex-wrap items-end gap-4 border-b border-border-strong pb-6 ${
        center ? "justify-center text-center" : "justify-between"
      }`}
    >
      <div>
        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
          {kicker}
        </span>
        <h2 className="mt-3 text-4xl leading-[1.03] tracking-[-0.01em] md:text-[52px]" style={SERIF}>
          {title}
        </h2>
      </div>
      {aside}
    </div>
  );
}

type ProofItem = { value: string; label: string; source: string };

/** "In short": the About poster (FR/EN, validated by Ralph on 2026-10-21) right under the hero,
 *  with the same six facts as readable text and a link to the About page. */
function BriefSection() {
  const tHome = useTranslations("home");
  const tAbout = useTranslations("about");
  const facts = tHome.raw("briefFacts") as string[];
  const posterSrc = tAbout("poster.src");

  return (
    <section id="sec-en-bref" className="scroll-mt-24 border-t border-border-color">
      <div className="mx-auto grid max-w-[var(--max-content)] items-center gap-10 px-[var(--page-pad)] py-14 md:py-16 lg:grid-cols-[400px_minmax(0,1fr)] lg:gap-14">
        <Reveal>
          <figure className="mx-auto flex w-full max-w-[420px] flex-col gap-3 lg:max-w-none">
            <a
              href={posterSrc}
              target="_blank"
              rel="noopener"
              aria-label={tAbout("poster.open")}
              className="group relative block aspect-[1122/1402] w-full overflow-hidden rounded-2xl border border-border-color bg-muted-2 shadow-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            >
              <Image
                src={posterSrc}
                alt={tAbout("poster.alt")}
                fill
                sizes="(max-width: 1023px) min(420px, 100vw), 400px"
                className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.02]"
              />
            </a>
            <figcaption className="text-xs text-muted-foreground">{tAbout("poster.open")}</figcaption>
          </figure>
        </Reveal>

        <Reveal delay={80}>
          <div>
            <SectionTitle kicker={tHome("briefKicker")} title={tHome("briefHeading")} />
            <p className="mt-6 max-w-[56ch] text-lg leading-relaxed text-muted-foreground">{tHome("briefBody")}</p>
            <ul className="mt-6 grid gap-x-8 gap-y-3 sm:grid-cols-2">
              {facts.map((f) => (
                <li key={f} className="flex items-start gap-3 text-[15px] font-medium text-foreground">
                  <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                  {f}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Link href="/about">
                <Button variant="secondary">
                  {tHome("briefCta")} <ArrowRight size={16} />
                </Button>
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/** Developer proof first: four measured facts, each with its source. */
function ProofQuad() {
  const tHome = useTranslations("home");
  const items = tHome.raw("proofQuad") as ProofItem[];

  return (
    <section className="border-t border-border-color">
      <div className="mx-auto max-w-[var(--max-content)] px-[var(--page-pad)] py-10 md:py-12">
        <Reveal>
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border-color bg-border-color lg:grid-cols-4">
            {items.map((m, i) => (
              <div key={i} className="flex flex-col bg-muted p-5 md:p-6">
                <CountUp
                  value={m.value}
                  className="text-3xl leading-none tracking-[-0.02em] text-accent md:text-[40px]"
                  style={SERIF}
                />
                <div className="mt-2.5 text-sm font-semibold text-foreground">{m.label}</div>
                <div className="mt-1 font-mono text-[11px] text-muted-foreground">{m.source}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function ProjectsSection() {
  const tSec = useTranslations("sectionLabels");
  const tHome = useTranslations("home");
  const locale = useLocale() as "fr" | "en";

  return (
    <section id="sec-systemes" className="scroll-mt-24 border-t border-border-color">
      <div className="mx-auto max-w-[var(--max-content)] px-[var(--page-pad)] py-20 md:py-24">
        <Reveal>
          <SectionTitle
            kicker={tSec("selected")}
            title={
              <PlainSwap
                tech={locale === "fr" ? "Ce que j'ai construit." : "What I've built."}
                plain={locale === "fr" ? "Mes projets." : "My projects."}
              />
            }
            aside={
              <Link
                href="/projects"
                className="hidden shrink-0 items-center gap-1 text-sm font-medium text-accent hover:underline sm:inline-flex"
              >
                {tHome("seeAll")} <ArrowRight size={14} />
              </Link>
            }
          />
        </Reveal>

        <SystemsSection />

        {/* Demos: several projects can be tried right on this site */}
        <Reveal>
          <Link
            href="/demos"
            className="group mt-10 flex flex-col gap-4 rounded-2xl border border-border-color bg-muted p-5 transition-colors hover:border-border-strong sm:flex-row sm:items-center sm:justify-between md:p-6"
          >
            <span className="flex items-center gap-4">
              <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                <Play size={18} aria-hidden="true" />
              </span>
              <span>
                <span className="block text-[16px] font-semibold">{tHome("demoCalloutTitle")}</span>
                <span className="mt-0.5 block text-[14.5px] text-muted-foreground">
                  {tHome("demoCalloutDesc", { count: demos.length })}
                </span>
              </span>
            </span>
            <span className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-accent group-hover:underline">
              {tHome("demoCalloutLink")} <ArrowRight size={14} aria-hidden="true" />
            </span>
          </Link>
        </Reveal>

        <div className="mt-10 flex justify-center sm:hidden">
          <Link href="/projects" className="inline-flex items-center gap-1 text-sm font-medium text-accent">
            {tHome("seeAll")} <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}

function StackSection() {
  const tSec = useTranslations("sectionLabels");
  const tHome = useTranslations("home");
  const locale = useLocale() as "fr" | "en";
  const last = stackGroups.length - 1;

  return (
    <section id="sec-stack" className="scroll-mt-24 border-t border-border-color">
      <div className="mx-auto max-w-[var(--max-content)] px-[var(--page-pad)] py-20 md:py-24">
        <Reveal>
          <SectionTitle kicker={tSec("stack")} title={tHome("stackHeading")} />
        </Reveal>
        <Reveal delay={80}>
          {/* 5 groups: 2 columns on tablet (last one full width), 5 on desktop → no empty cell. */}
          <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-border-color bg-border-color sm:grid-cols-2 lg:grid-cols-5">
            {stackGroups.map((g, gi) => (
              <div
                key={g.name.en}
                className={`h-full bg-muted p-5 ${gi === last && stackGroups.length % 2 === 1 ? "sm:col-span-2 lg:col-span-1" : ""}`}
              >
                <div className="mb-4 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                  {g.name[locale]}
                </div>
                <div className="flex flex-wrap gap-2">
                  {g.items.map((item) => {
                    const tip = usedIn[item]?.[locale];
                    return (
                      <span
                        key={item}
                        tabIndex={0}
                        title={tip ? `${locale === "fr" ? "Utilisé dans" : "Used in"} : ${tip}` : undefined}
                        className="cursor-default rounded-lg border border-border-color px-2.5 py-1.5 font-mono text-[12.5px] text-muted-foreground transition-colors hover:border-accent hover:text-foreground focus-visible:border-accent focus-visible:text-foreground"
                      >
                        {item}
                      </span>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

type ExpItem = { date: string; role: string; org: string; desc?: string };
type EduItem = { date: string; title: string; org: string };

function ParcoursSection() {
  const t = useTranslations("experience");
  const locale = useLocale() as "fr" | "en";
  const items = t.raw("items") as ExpItem[];
  const education = t.raw("education") as EduItem[];

  return (
    <section id="sec-parcours" className="scroll-mt-24 border-t border-border-color">
      <div className="mx-auto max-w-[var(--max-content)] px-[var(--page-pad)] py-20 md:py-24">
        <Reveal>
          <SectionTitle
            kicker={locale === "fr" ? "Parcours" : "Path"}
            title={t("heading")}
            aside={
              <Link
                href="/experience"
                className="hidden shrink-0 items-center gap-1 text-sm font-medium text-accent hover:underline sm:inline-flex"
              >
                {locale === "fr" ? "Expérience complète" : "Full experience"} <ArrowRight size={14} />
              </Link>
            }
          />
        </Reveal>
        <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-16">
          <ol className="flex flex-col">
            {items.map((e, i) => (
              <li key={i} className="flex gap-4 pb-7 last:pb-0">
                <div className="flex w-[22px] flex-none flex-col items-center">
                  <span className="mt-1.5 h-2.5 w-2.5 flex-none rounded-full border-2 border-accent bg-background" />
                  <span
                    className="w-px flex-1"
                    style={{ background: "linear-gradient(var(--border-strong), var(--border-color))" }}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-mono text-[12px] text-muted-foreground">{e.date}</div>
                  <div className="mt-1 text-[16px] font-semibold leading-snug">{e.role}</div>
                  <div className="text-[15px] text-muted-foreground">{e.org}</div>
                  {e.desc && <p className="mt-1.5 text-[15px] leading-relaxed text-muted-foreground">{e.desc}</p>}
                </div>
              </li>
            ))}
          </ol>

          <div>
            <Reveal delay={80}>
              <div className="flex flex-col gap-3.5">
                <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                  {t("eduTitle")}
                </div>
                {education.map((e, i) => (
                  <div key={i} className="rounded-xl border border-border-color bg-muted p-4">
                    <div className="font-mono text-[12px] text-muted-foreground">{e.date}</div>
                    <div className="mt-1 text-[15px] font-semibold">{e.title}</div>
                    <div className="text-sm text-muted-foreground">{e.org}</div>
                  </div>
                ))}

              </div>
            </Reveal>
          </div>
        </div>

        {/* Certifications: the 6 certificates, previewed here, detailed on the Experience page */}
        {certList.length > 0 && (
          <Reveal delay={120}>
            <div className="mt-14 border-t border-border-color pt-8">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <h3 className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                  {t("certTitle")}
                </h3>
                <Link
                  href="/experience#certifications"
                  className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
                >
                  {t("certLink", { count: certList.length })} <ArrowRight size={14} />
                </Link>
              </div>
              <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                {certList.map((c) => (
                  <li key={c.slug}>
                    <Link
                      href="/experience#certifications"
                      className="group flex h-full flex-col overflow-hidden rounded-lg border border-border-color bg-muted transition-colors duration-200 hover:border-border-strong"
                    >
                      <span className="relative block aspect-[16/10] border-b border-border-color bg-muted-2">
                        <Image
                          src={c.card}
                          alt=""
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 180px"
                          className="object-contain transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:transition-none"
                        />
                      </span>
                      <span className="flex flex-1 flex-col gap-1.5 p-3">
                        <span className="text-[13px] font-medium leading-snug transition-colors group-hover:text-accent">
                          {c.title}
                        </span>
                        <span className="mt-auto font-mono text-[11px] text-muted-foreground">
                          {c.issuer} · {formatCertDate(c.issued, locale)}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        )}

        <div className="mt-10 sm:hidden">
          <Link href="/experience" className="inline-flex items-center gap-1 text-sm font-medium text-accent">
            {locale === "fr" ? "Expérience complète" : "Full experience"} <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const tHome = useTranslations("home");
  const tNav = useTranslations("nav");
  const locale = useLocale() as "fr" | "en";

  // Counts come from the data, so they can never contradict the carousel.
  const byCategory = testimonials.reduce<Record<string, number>>((acc, t) => {
    acc[t.category] = (acc[t.category] ?? 0) + 1;
    return acc;
  }, {});
  const categories = Object.entries(byCategory).sort((a, b) => b[1] - a[1]);

  return (
    <section id="sec-temoignages" className="scroll-mt-24 border-t border-border-color">
      <div className="mx-auto max-w-[var(--max-content)] px-[var(--page-pad)] py-20 md:py-24">
        <Reveal>
          <SectionTitle
            kicker={tNav("testimonials")}
            title={tHome("testimonialsHeading")}
            aside={
              <Link
                href="/temoignages"
                className="hidden shrink-0 items-center gap-1 text-sm font-medium text-accent hover:underline sm:inline-flex"
              >
                {tHome("testimonialsViewAll")} <ArrowRight size={14} />
              </Link>
            }
          />
          <p className="mt-6 max-w-[60ch] text-[15px] leading-relaxed text-muted-foreground md:text-base">
            {tHome("testimonialsSubtitle")}
            <span className="mt-2 block font-mono text-[12.5px] text-muted-foreground">
              {testimonials.length} {tHome("statCollaborations")}
              {categories.map(([cat, n]) => (
                <span key={cat}>
                  {" · "}
                  {n} {(categoryLabels[locale] as Record<string, string>)[cat]?.toLowerCase() ?? cat}
                </span>
              ))}
            </span>
          </p>
        </Reveal>

        {/* Carousel — auto-rotates every 6 s, pauses on hover and keyboard focus */}
        <div className="mt-10">
          <Reveal delay={80}>
            <TestimonialsCarousel testimonials={testimonials} locale={locale} autoPlayInterval={6000} />
          </Reveal>
        </div>

        <div className="mt-8 sm:hidden">
          <Link href="/temoignages" className="inline-flex items-center gap-1 text-sm font-medium text-accent">
            {tHome("testimonialsViewAll")} <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}

/** Photos picked for the home preview of the /photos page (one per theme, all portraits of Ralph). */
const BEYOND_PHOTOS = ["bord-de-l-eau-2026", "finissant-diplome-2024", "mont-royal-2025", "sutton-2026"] as const;

/**
 * "Au-delà du code": previews of what lives on other pages (photos, reading, life outside
 * work), so visitors know it exists. Each card is one link to its page (stretched link).
 */
function BeyondSection() {
  const tHome = useTranslations("home");
  const allPhotos = galleryGroups.flatMap((g) => g.photos);
  const preview = BEYOND_PHOTOS.map((slug) => allPhotos.find((p) => p.slug === slug)).filter(
    (p): p is GalleryPhoto => Boolean(p),
  );
  const covers = books.filter((b) => b.featured).slice(0, 4);

  const cards = [
    {
      href: "/photos",
      path: "~/photos",
      kicker: tHome("beyondPhotosKicker", { count: galleryCount }),
      title: tHome("beyondPhotosTitle"),
      desc: tHome("beyondPhotosDesc"),
      link: tHome("beyondPhotosLink", { count: galleryCount }),
      visual: (
        <div className="grid h-full grid-cols-2 grid-rows-2 gap-1">
          {preview.map((p) => (
            <div key={p.slug} className="relative overflow-hidden">
              <Image
                src={gallerySrc(p.slug)}
                alt=""
                fill
                sizes="(max-width: 1024px) 50vw, 180px"
                className="object-cover object-[center_30%] transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:transition-none"
              />
            </div>
          ))}
        </div>
      ),
    },
    {
      href: "/about#lectures",
      path: "~/about#lectures",
      kicker: tHome("beyondBooksKicker", { count: books.length }),
      title: tHome("beyondBooksTitle"),
      desc: tHome("beyondBooksDesc"),
      link: tHome("beyondBooksLink"),
      visual: (
        <div className="flex h-full items-center justify-center gap-2 px-4">
          {covers.map((b) => (
            <span
              key={b.slug}
              className="relative aspect-[2/3] w-[72px] shrink-0 overflow-hidden rounded-[3px] shadow-[0_1px_2px_rgba(25,24,17,0.14),0_12px_24px_-14px_rgba(25,24,17,0.5)] transition-transform duration-300 group-hover:-translate-y-1 motion-reduce:transition-none"
            >
              <Image src={b.cover} alt={b.title} fill sizes="72px" className="object-cover" />
            </span>
          ))}
        </div>
      ),
    },
    {
      href: "/about#en-dehors-du-code",
      path: "~/about",
      kicker: tHome("beyondLifeKicker"),
      title: tHome("beyondLifeTitle"),
      desc: tHome("beyondLifeDesc"),
      link: tHome("beyondLifeLink"),
      visual: (
        <div className="grid h-full grid-cols-[1.35fr_1fr] grid-rows-2 gap-1">
          <div className="relative row-span-2 overflow-hidden">
            <Image
              src="/images/beyond-code/half-marathon-finish.png"
              alt=""
              fill
              sizes="(max-width: 1024px) 60vw, 220px"
              className="object-cover object-[center_30%] transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:transition-none"
            />
          </div>
          <div className="relative overflow-hidden">
            <Image src="/images/beyond-code/chess.png" alt="" fill sizes="(max-width: 1024px) 40vw, 140px" className="object-cover" />
          </div>
          <div className="relative overflow-hidden">
            <Image
              src="/images/beyond-code/skiing.png"
              alt=""
              fill
              sizes="(max-width: 1024px) 40vw, 140px"
              className="object-cover object-[center_60%]"
            />
          </div>
        </div>
      ),
    },
  ];

  return (
    <section id="sec-au-dela" className="scroll-mt-24 border-t border-border-color">
      <div className="mx-auto max-w-[var(--max-content)] px-[var(--page-pad)] py-20 md:py-24">
        <Reveal>
          <SectionTitle kicker={tHome("beyondKicker")} title={tHome("beyondHeading")} />
          <p className="mt-6 max-w-[60ch] text-[15px] leading-relaxed text-muted-foreground md:text-base">
            {tHome("beyondIntro")}
          </p>
        </Reveal>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {cards.map((c, i) => (
            <Reveal key={c.href} delay={60 * (i + 1)} className="h-full">
              <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border-color bg-muted transition-colors duration-200 hover:border-border-strong">
                <div className="h-[220px] overflow-hidden border-b border-border-color bg-muted-2">{c.visual}</div>
                <div className="flex flex-1 flex-col p-5">
                  <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{c.kicker}</span>
                  <h3 className="mt-2 text-[17px] font-semibold leading-snug">{c.title}</h3>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-muted-foreground">{c.desc}</p>
                  <div className="mt-auto flex items-center justify-between gap-3 pt-5">
                    <Link
                      href={c.href}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent after:absolute after:inset-0 after:content-[''] group-hover:underline"
                    >
                      {c.link} <ArrowRight size={14} />
                    </Link>
                    <span className="font-mono text-[12px] text-muted-foreground">{c.path}</span>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  const tHome = useTranslations("home");
  const locale = useLocale() as "fr" | "en";
  const principles = tHome.raw("principles") as { title: string; desc: string }[];
  const email = "ralph.c.gabriel@proton.me";
  const cvHref =
    locale === "fr" ? "/cv/ralph-christian-gabriel-cv-fr.pdf" : "/cv/ralph-christian-gabriel-cv-en.pdf";

  return (
    <section id="sec-contact" className="scroll-mt-24 border-t border-border-color">
      <div className="mx-auto max-w-[var(--max-content)] px-[var(--page-pad)] py-20 md:py-24">
        <Reveal>
          <div className="relative overflow-hidden rounded-[20px] border border-border-color bg-muted p-8 md:p-12">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(560px 300px at 6% 0%, color-mix(in srgb, var(--accent) 12%, transparent), transparent 70%)",
              }}
            />
            <div className="relative grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-14">
              {/* Left — pitch + actions */}
              <div>
                <div className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                  <span className="relative inline-flex h-2 w-2">
                    <span
                      className="absolute inline-flex h-full w-full rounded-full opacity-60 motion-safe:animate-[pulse_2.4s_ease-out_infinite]"
                      style={{ background: "var(--shipped)" }}
                    />
                    <span
                      className="relative inline-flex h-2 w-2 rounded-full"
                      style={{ background: "var(--shipped)" }}
                    />
                  </span>
                  {tHome("contactAvailable")}
                </div>

                <h2 className="mt-5 text-[38px] leading-[1.02] tracking-[-0.01em] md:text-[56px]" style={SERIF}>
                  {tHome("contactHeading")}
                </h2>

                <p className="mt-5 max-w-[46ch] text-base leading-relaxed text-muted-foreground">
                  {tHome("contactSub")}
                </p>

                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <EmailCopy
                    email={email}
                    copyLabel={tHome("contactCopy")}
                    copiedLabel={tHome("contactCopied")}
                  />
                  <TrackedLink
                    href="https://cal.com/ralphchristiangabriel/15min"
                    target="_blank"
                    rel="noreferrer"
                    event="book_call_click"
                  >
                    <Button variant="secondary">
                      {tHome("contactBook")} <ArrowUpRight size={16} />
                    </Button>
                  </TrackedLink>
                  <TrackedLink
                    href={cvHref}
                    target="_blank"
                    rel="noreferrer"
                    event={`cv_download_${locale}`}
                  >
                    <Button variant="secondary">
                      <Download size={16} /> {tHome("contactCv")}
                    </Button>
                  </TrackedLink>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[12.5px] text-muted-foreground">
                  <a
                    href="https://linkedin.com/in/ralph-christian-gabriel-45092021b"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-0.5 transition-colors hover:text-foreground"
                  >
                    LinkedIn <span aria-hidden="true">↗</span>
                  </a>
                  <a
                    href="https://github.com/ralphgabriel04"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-0.5 transition-colors hover:text-foreground"
                  >
                    GitHub <span aria-hidden="true">↗</span>
                  </a>
                  <span>{tHome("contactResponse")}</span>
                </div>

                {/* How I work: under the actions, so both columns end together */}
                <ul className="mt-10 grid gap-4 border-t border-border-color pt-8 sm:grid-cols-3">
                  {principles.map((p, i) => (
                    <li key={i} className="border-l-2 border-accent pl-3.5">
                      <div className="text-sm font-semibold text-foreground">{p.title}</div>
                      <div className="mt-0.5 text-[13.5px] leading-relaxed text-muted-foreground">{p.desc}</div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Right: smiling La Caisse headshot (oct. 2026), so the hero studio portrait is not shown twice. */}
              <figure className="hidden self-start overflow-hidden rounded-2xl border border-border-color bg-muted-2 lg:block">
                <Image
                  src="/images/about/ralph-la-caisse-2026-headshot-sourire.jpg"
                  alt={tHome("contactPhotoAlt")}
                  width={1000}
                  height={1250}
                  sizes="300px"
                  className="aspect-[4/5] w-full object-cover"
                />
              </figure>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
