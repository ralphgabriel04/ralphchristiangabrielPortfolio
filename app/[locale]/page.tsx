import { useTranslations, useLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowRight, ArrowDown, ArrowUpRight, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { SystemsSection } from "@/components/ui/systems-section";
import { ServicesSection } from "@/components/ui/services-section";
import { TrackedLink } from "@/components/ui/tracked-link";
import { HeroRole } from "@/components/ui/hero-role";
import { HeroStatus } from "@/components/ui/hero-status";
import { EmailCopy } from "@/components/ui/email-copy";
import { TerminalTrigger } from "@/components/ui/terminal-trigger";
import { HeroCanvas } from "@/components/ui/hero-canvas";
import { Marquee } from "@/components/ui/marquee";
import { SectionRail } from "@/components/ui/section-rail";
import { CountUp } from "@/components/ui/count-up";
import { PlainBanner, Lexicon, PlainSwap } from "@/components/ui/plain-mode";
import { stackGroups, usedIn } from "@/lib/stack";
import { ProfilePhoto } from "@/components/ui/profile-photo";
import { TestimonialsCarousel } from "@/components/ui/testimonials-carousel";
import { testimonials } from "@/lib/testimonials";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <HomeContent />;
}

function HomeContent() {
  const t = useTranslations("hero");
  const tSec = useTranslations("sectionLabels");
  const tHome = useTranslations("home");
  const locale = useLocale() as "fr" | "en";

  const heroName = t("name");
  const nameParts = heroName.split(" ");
  const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : heroName;
  const firstName = nameParts.length > 1 ? nameParts.slice(0, -1).join(" ") : "";

  return (
    <>
      <SectionRail />
      {/* ── Hero ── */}
      <section className="relative overflow-hidden px-[var(--page-pad)] pt-14 pb-20 md:pt-20">
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
          <div className="relative z-[1] mx-auto grid max-w-[var(--max-hero)] items-center gap-10 xl:grid-cols-[minmax(0,1fr)_300px] xl:gap-14">
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
                className="mt-6 text-[52px] leading-[0.92] tracking-[-0.02em] sm:text-7xl md:text-[88px] lg:text-[104px] xl:text-[84px] 2xl:text-[100px]"
                style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}
              >
                <span className="block">{firstName}</span>
                <span className="block">
                  {lastName}
                  <span className="text-accent">.</span>
                </span>
              </h1>

              {/* Typewriter role */}
              <div className="mt-6">
                <HeroRole />
              </div>

              <div className="mt-5">
                <PlainBanner />
              </div>

              <p className="mt-5 max-w-[54ch] text-lg leading-relaxed text-muted-foreground">
                <PlainSwap tech={t("pitch")} plain={t("pitchPlain")} />
              </p>

              {/* CTAs */}
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a href="#sec-systemes" data-mag>
                  <Button>
                    {t("ctaSystems")} <ArrowDown size={16} />
                  </Button>
                </a>
                <Link href="/recruteur">
                  <Button variant="secondary">{t("ctaRecruiter")}</Button>
                </Link>
                <TerminalTrigger
                  ariaLabel={locale === "fr" ? "Ouvrir le terminal" : "Open the terminal"}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-md border border-border-strong px-4 py-2.5 font-mono text-[13px] text-muted-foreground transition-colors hover:border-accent hover:text-accent"
                >
                  <span style={{ color: "var(--accent)" }}>&gt;_</span> {t("ctaTerminal")}
                  <span className="hidden opacity-60 sm:inline">⌘K</span>
                </TerminalTrigger>
              </div>

              {/* Status line */}
              <div className="mt-8">
                <HeroStatus available={t("available")} location={t("location")} />
              </div>
            </div>

            {/* Portrait — right column (xl+) */}
            <div className="hidden xl:block">
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

      {/* ── Marquee ── */}
      <Marquee />

      {/* ── Proof quad ── */}
      <ProofQuad />

      {/* ── Now ── */}
      <NowSection />

      {/* ── Systèmes ── */}
      <section id="sec-systemes" className="scroll-mt-24 border-t border-border-color">
        <div className="mx-auto max-w-[var(--max-content)] px-[var(--page-pad)] py-20 md:py-28">
          <Reveal>
            <div className="flex items-end justify-between gap-4 border-b border-border-strong pb-8">
              <div>
                <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
                  {tSec("selected")}
                </span>
                <h2
                  className="mt-3 text-4xl leading-[1.03] tracking-[-0.01em] md:text-[52px]"
                  style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}
                >
                  <span className="align-super font-mono text-[0.32em] tracking-widest text-accent">01</span>{" "}
                  <PlainSwap
                    tech={locale === "fr" ? "Systèmes" : "Systems"}
                    plain={locale === "fr" ? "Projets" : "Projects"}
                  />
                </h2>
              </div>
              <Link
                href="/projects"
                className="hidden shrink-0 items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
              >
                {tHome("seeAll")} <ArrowRight size={14} />
              </Link>
            </div>
          </Reveal>

          <SystemsSection />

          <div className="mt-14 flex justify-center sm:hidden">
            <Link
              href="/projects"
              className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {tHome("seeAll")} <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stack ── */}
      <StackSection />

      {/* ── Lexique (plain mode) ── */}
      <Lexicon />

      {/* ── Parcours ── */}
      <ParcoursSection />

      {/* ── Témoignages ── */}
      <TestimonialsSection />

      {/* ── Services ("J'ai un projet") ── */}
      <ServicesSection />

      {/* ── Contact ── */}
      <ContactSection />
    </>
  );
}

function TestimonialsSection() {
  const tHome = useTranslations("home");
  const locale = useLocale() as "fr" | "en";

  return (
    <section id="sec-temoignages" className="scroll-mt-24 border-t border-border-color">
      <div className="mx-auto max-w-[var(--max-content)] px-[var(--page-pad)] py-24 md:py-32">
        {/* Centered header with decorative eyebrow */}
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <div className="inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              <span className="h-px w-6 bg-border-strong" />
              {tHome("testimonialsKicker")}
              <span className="h-px w-6 bg-border-strong" />
            </div>
            <h2 className="mt-6 text-[34px] font-medium leading-[1.1] tracking-tight md:text-[44px]">
              {tHome("testimonialsHeadingPre")}
              <span
                className="italic"
                style={{ fontFamily: "var(--font-instrument-serif), 'Georgia', serif", fontWeight: 400 }}
              >
                {tHome("testimonialsHeadingItalic")}
              </span>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-muted-foreground md:text-[16px]">
              {tHome("testimonialsSubtitle")}
            </p>
          </div>
        </Reveal>

        {/* Carousel — all testimonials, auto-rotates every 5s */}
        <div className="mt-14">
          <Reveal delay={80}>
            <TestimonialsCarousel testimonials={testimonials} locale={locale} autoPlayInterval={5000} />
          </Reveal>
        </div>

        {/* CTA + stats */}
        <Reveal delay={120}>
          <div className="mt-12 flex flex-col items-center md:mt-14">
            {/* Rounded-full CTA button */}
            <Link
              href="/temoignages"
              className="group inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-3 text-[13.5px] font-medium text-background shadow-sm transition-all duration-200 hover:opacity-90 hover:shadow-md active:scale-[0.98]"
            >
              {tHome("testimonialsViewAll")}
              <span className="transition-transform group-hover:translate-x-0.5">→</span>
            </Link>

            {/* Stats card */}
            <div className="mt-10 flex w-full max-w-3xl flex-col items-center divide-y divide-border-color rounded-2xl border border-border-color bg-muted/50 md:flex-row md:divide-x md:divide-y-0">
              <div className="flex w-full items-center justify-center gap-2 px-6 py-5 text-center md:flex-1">
                <span className="text-[15px] font-semibold tracking-tight text-accent">{testimonials.length}</span>
                <span className="text-[13.5px] text-muted-foreground">{tHome("statCollaborations")}</span>
              </div>
              <div className="flex w-full items-center justify-center gap-2 px-6 py-5 text-center md:flex-1">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-accent/10 text-accent">
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path d="M2.5 6.2l2.3 2.3L9.5 3.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span className="text-[13.5px] text-muted-foreground">{tHome("statVerified")}</span>
              </div>
              <div className="flex w-full items-center justify-center gap-2 px-6 py-5 text-center md:flex-1">
                <span className="text-[15px] font-semibold tracking-tight text-accent">100%</span>
                <span className="text-[13.5px] text-muted-foreground">{tHome("statSatisfaction")}</span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function NowSection() {
  const tNow = useTranslations("now");

  return (
    <section className="border-t border-border-color">
      <div className="mx-auto max-w-[var(--max-content)] px-[var(--page-pad)] py-16">
        <Reveal>
          <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
            {tNow("kicker")}
          </span>
          <p className="mt-4 max-w-[75ch] text-base leading-relaxed text-muted-foreground">
            {tNow("body")}
          </p>
          <span className="mt-4 block font-mono text-[10px] text-muted-foreground/50">
            {tNow("updated")}
          </span>
        </Reveal>
      </div>
    </section>
  );
}

type ProofItem = { value: string; label: string; source: string };

/** v2 trust strip — four proof cards (metric · label · source) with count-up. */
function ProofQuad() {
  const tHome = useTranslations("home");
  const items = tHome.raw("proofQuad") as ProofItem[];
  const note = tHome("proofNote");

  return (
    <section className="border-t border-border-color">
      <div className="mx-auto max-w-[var(--max-content)] px-[var(--page-pad)] py-10 md:py-12">
        <Reveal>
          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border-color bg-border-color sm:grid-cols-2 lg:grid-cols-4">
            {items.map((m, i) => (
              <div key={i} className="flex flex-col bg-muted p-6">
                <CountUp
                  value={m.value}
                  className="text-3xl leading-none tracking-[-0.02em] text-accent md:text-[40px]"
                  style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}
                />
                <div className="mt-2.5 text-sm font-semibold text-foreground">{m.label}</div>
                <div className="mt-0.5 font-mono text-[11px] text-muted-foreground">{m.source}</div>
              </div>
            ))}
          </div>
          {note && (
            <p className="mt-3 text-right font-mono text-[10.5px] text-muted-foreground/70">
              {note}
            </p>
          )}
        </Reveal>
      </div>
    </section>
  );
}

/** v2 numbered serif section header (01 · Systèmes …). */
function NumberedHeading({ n, kicker, title }: { n: string; kicker: string; title: string }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border-strong pb-5">
      <div>
        <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
          {kicker}
        </span>
        <h2
          className="mt-2 text-4xl leading-none tracking-[-0.01em] md:text-[52px]"
          style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}
        >
          <span className="align-super font-mono text-[0.32em] tracking-widest text-accent">{n}</span>{" "}
          {title}
        </h2>
      </div>
    </div>
  );
}

function StackSection() {
  const tSec = useTranslations("sectionLabels");
  const tHome = useTranslations("home");
  const locale = useLocale() as "fr" | "en";

  return (
    <section id="sec-stack" className="scroll-mt-24 border-t border-border-color">
      <div className="mx-auto max-w-[var(--max-content)] px-[var(--page-pad)] py-20 md:py-28">
        <Reveal>
          <NumberedHeading n="02" kicker={tSec("stack")} title={tHome("stackHeading")} />
        </Reveal>
        <Reveal delay={80}>
          <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-border-color bg-border-color sm:grid-cols-2 lg:grid-cols-4">
            {stackGroups.map((g) => (
              <div key={g.name.en} className="h-full bg-muted p-6">
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
                        className="cursor-default rounded-lg border border-border-color px-3 py-2 font-mono text-[12.5px] text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-accent hover:text-foreground focus-visible:border-accent focus-visible:text-foreground"
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
type CertItem = { title: string; org: string; image?: string };

function ParcoursSection() {
  const t = useTranslations("experience");
  const locale = useLocale() as "fr" | "en";
  const items = t.raw("items") as ExpItem[];
  const education = t.raw("education") as EduItem[];
  const certifications = t.raw("certifications") as CertItem[];

  return (
    <section id="sec-parcours" className="scroll-mt-24 border-t border-border-color">
      <div className="mx-auto max-w-[var(--max-content)] px-[var(--page-pad)] py-20 md:py-28">
        <Reveal>
          <NumberedHeading n="03" kicker={locale === "fr" ? "Parcours" : "Path"} title={t("heading")} />
        </Reveal>
        <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col">
            {items.map((e, i) => (
              <Reveal key={i} delay={i * 50}>
                <div className="flex gap-4 pb-7">
                  <div className="flex w-[22px] flex-none flex-col items-center">
                    <span className="mt-1.5 h-2.5 w-2.5 flex-none rounded-full border-2 border-accent bg-background" />
                    <span
                      className="w-px flex-1"
                      style={{ background: "linear-gradient(var(--border-strong), var(--border-color))" }}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-mono text-[11.5px] text-muted-foreground">{e.date}</div>
                    <div className="mt-1 text-[16px] font-semibold">
                      {e.role} <span className="font-normal text-muted-foreground">— {e.org}</span>
                    </div>
                    {e.desc && (
                      <div className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                        {e.desc}
                      </div>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
            <Link
              href="/experience"
              className="inline-flex items-center gap-1 self-start text-sm font-medium text-accent hover:underline"
            >
              {locale === "fr" ? "Parcours complet" : "Full path"} <ArrowRight size={14} />
            </Link>
          </div>

          <div>
            <Reveal delay={80}>
              <div className="flex flex-col gap-3.5">
                <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                  {t("eduTitle")}
                </div>
                {education.map((e, i) => (
                  <div key={i} className="rounded-xl border border-border-color bg-muted p-4">
                    <div className="font-mono text-[11px] text-muted-foreground">{e.date}</div>
                    <div className="mt-1 text-sm font-semibold">{e.title}</div>
                    <div className="text-xs text-muted-foreground">{e.org}</div>
                  </div>
                ))}

                {certifications.length > 0 && (
                  <div className="mt-2">
                    <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                      {t("certTitle")}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {certifications.map((c, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1.5 rounded-full border border-border-color px-3 py-1.5 font-mono text-[11px] text-muted-foreground"
                        >
                          <span style={{ color: "var(--accent)" }} aria-hidden="true">
                            ▪
                          </span>
                          {c.title} · {c.org}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Reveal>
          </div>
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
    locale === "fr" ? "/cv/ralph-gabriel-cv-fr.pdf" : "/cv/ralph-gabriel-cv-en.pdf";

  return (
    <section id="sec-contact" className="scroll-mt-24 border-t border-border-color">
      <div className="mx-auto max-w-[var(--max-content)] px-[var(--page-pad)] py-20 md:py-28">
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

                <h2
                  className="mt-5 text-[38px] leading-[1.02] tracking-[-0.01em] md:text-[56px]"
                  style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}
                >
                  {tHome("contactHeadingPre")}
                  <span className="italic text-accent">{tHome("contactHeadingItalic")}</span>
                </h2>

                <p className="mt-5 max-w-[46ch] text-[15px] leading-relaxed text-muted-foreground">
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

                <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[12px] text-muted-foreground">
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
              </div>

              {/* Right — portrait + principles */}
              <div className="flex flex-col gap-6">
                <figure className="overflow-hidden rounded-2xl border border-border-color bg-muted-2">
                  <ProfilePhoto
                    alt="Ralph Christian Gabriel"
                    className="aspect-square w-full"
                    sizes="(min-width: 1024px) 300px, 100vw"
                  />
                </figure>
                <ul className="flex flex-col gap-4">
                  {principles.map((p, i) => (
                    <li key={i} className="border-l-2 border-accent pl-3.5">
                      <div className="text-sm font-semibold text-foreground">{p.title}</div>
                      <div className="mt-0.5 text-[12.5px] leading-relaxed text-muted-foreground">
                        {p.desc}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
