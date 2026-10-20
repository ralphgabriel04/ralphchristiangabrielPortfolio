import { useTranslations, useLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { ArrowRight, ArrowDown, ArrowUpRight, Download } from "lucide-react";
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
import { ProfilePhoto } from "@/components/ui/profile-photo";
import { TestimonialsCarousel } from "@/components/ui/testimonials-carousel";
import { testimonials, categoryLabels } from "@/lib/testimonials";
import { certifications as certList } from "@/lib/certifications";

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
              <figure className="relative overflow-hidden rounded-2xl border border-border-color bg-muted-2 shadow-md">
                <ProfilePhoto
                  alt="Ralph Christian Gabriel"
                  className="aspect-[20/21] w-full"
                  priority
                  sizes="300px"
                />
                <figcaption className="absolute inset-x-0 bottom-0 flex items-center px-3 py-2.5 font-mono text-[11px] text-foreground dark:bg-gradient-to-t dark:from-background/90 dark:to-transparent">
                  {/* Light theme: compact chip (no wash-out fade). Dark: gradient. */}
                  <span className="inline-flex items-center gap-2 rounded-md bg-background/80 px-2 py-1 shadow-sm backdrop-blur-sm dark:bg-transparent dark:p-0 dark:shadow-none dark:backdrop-blur-none">
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--shipped)" }} />
                    RCG.SYS · Montréal
                  </span>
                </figcaption>
              </figure>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── Proof ── */}
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

                {certList.length > 0 && (
                  <Link
                    href="/experience#certifications"
                    className="mt-2 inline-flex items-center gap-1.5 self-start text-sm font-medium text-accent hover:underline"
                  >
                    {t("certLink", { count: certList.length })} <ArrowRight size={14} />
                  </Link>
                )}
              </div>
            </Reveal>
          </div>
        </div>

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
