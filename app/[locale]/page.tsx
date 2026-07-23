import { useTranslations, useLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowRight, Download, Mail } from "lucide-react";
import { projects } from "@/lib/projects";
import { Button } from "@/components/ui/button";
import { Tag } from "@/components/ui/tag";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { ProjectRow } from "@/components/ui/project-row";
import { TrackedLink } from "@/components/ui/tracked-link";
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

  const featured = projects.filter((p) => p.featured).slice(0, 3);
  // If fewer than 3 featured, pad with non-featured
  const selectedProjects =
    featured.length >= 3
      ? featured
      : [...featured, ...projects.filter((p) => !p.featured)].slice(0, 3);

  const metrics = [
    { num: t("metrics.0.num"), label: t("metrics.0.label") },
    { num: t("metrics.1.num"), label: t("metrics.1.label") },
    { num: t("metrics.2.num"), label: t("metrics.2.label") },
  ];

  return (
    <>
      {/* ── Hero ── */}
      <section className="mx-auto max-w-[var(--max-hero)] px-[var(--page-pad)] pt-16 pb-20">
        <Reveal>
          <div className="flex max-w-[980px] flex-col gap-8">
            <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
              {t("kicker")}
            </span>

            <h1 className="text-4xl font-medium leading-[1.05] tracking-[-0.03em] md:text-5xl lg:text-6xl">
              <span className="block">{t("title.0")}</span>
              <span className="block text-muted-foreground">
                {t("title.1")}{" "}
                <span className="text-border-strong">·</span> {t("title.2")}
              </span>
            </h1>

            <p className="max-w-[55ch] text-lg text-muted-foreground">
              {t("pitch")}
            </p>

            {/* Metrics */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {metrics.map((m, i) => (
                <div key={i} className="flex flex-col gap-1">
                  <span className="text-2xl font-semibold tracking-[-0.02em] text-accent md:text-3xl">
                    {m.num}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {m.label}
                  </span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/projects">
                <Button>
                  {t("ctaPrimary")} <ArrowRight size={16} />
                </Button>
              </Link>
              <TrackedLink
                href={
                  locale === "fr"
                    ? "/cv/ralph-gabriel-cv-fr.pdf"
                    : "/cv/ralph-gabriel-cv-en.pdf"
                }
                target="_blank"
                rel="noreferrer"
                event={`cv_download_${locale}`}
              >
                <Button variant="secondary">
                  <Download size={16} /> {t("ctaSecondary")}
                </Button>
              </TrackedLink>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── Now ── */}
      <NowSection />

      {/* ── Selected Projects ── */}
      <section className="border-t border-border-color">
        <div className="mx-auto max-w-[var(--max-content)] px-[var(--page-pad)] py-20 md:py-28">
          <Reveal>
            <div className="flex items-end justify-between gap-4 border-b border-border-color pb-8">
              <div>
                <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
                  {tSec("selected")}
                </span>
                <h2
                  className="mt-3 text-4xl leading-[1.03] tracking-[-0.01em] md:text-[52px]"
                  style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}
                >
                  {tHome("projectsHeading")}
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

          <div className="mt-14 flex flex-col gap-16 md:mt-20 md:gap-24">
            {selectedProjects.map((project, i) => (
              <Reveal key={project.id} delay={i * 60}>
                <ProjectRow project={project} index={i + 1} reverse={i % 2 === 1} />
              </Reveal>
            ))}
          </div>

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

      {/* ── Testimonials ── */}
      <TestimonialsSection />

      {/* ── Stack ── */}
      <StackSection />

      {/* ── Contact CTA ── */}
      <ContactSection />
    </>
  );
}

function TestimonialsSection() {
  const tHome = useTranslations("home");
  const locale = useLocale() as "fr" | "en";

  return (
    <section className="border-t border-border-color">
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

// Stack data — static, same in FR and EN
const stackData = [
  { cat: "Languages", items: ["TypeScript", "JavaScript", "Java", "C#", "Python"] },
  { cat: "Frontend", items: ["React", "Next.js", "Tailwind CSS", "Angular"] },
  { cat: "Backend", items: ["Node.js", "Express", "Spring Boot", ".NET"] },
  { cat: "Database", items: ["PostgreSQL", "Prisma", "MySQL", "Supabase", "SQLite"] },
  { cat: "DevOps", items: ["Docker", "GitHub Actions", "GitLab CI/CD", "Vercel"] },
  { cat: "Testing", items: ["JUnit", "Jest", "TDD"] },
  { cat: "Architecture", items: ["MVC", "REST", "Observer", "Strategy", "Template Method", "DDD", "GRASP"] },
];

function StackSection() {
  const tSec = useTranslations("sectionLabels");
  const tHome = useTranslations("home");

  return (
    <section className="border-t border-border-color">
      <div className="mx-auto max-w-[var(--max-content)] px-[var(--page-pad)] py-20">
        <Reveal>
          <SectionHeading
            kicker={tSec("stack")}
            title={tHome("stackHeading")}
          />
        </Reveal>

        <div className="mt-10 flex flex-col">
          {stackData.map((category, i) => (
            <Reveal key={category.cat} delay={i * 50}>
              <div className="grid grid-cols-[100px_1fr] md:grid-cols-[140px_1fr] items-baseline gap-4 border-t border-border-color py-5">
                <span className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
                  {category.cat}
                </span>
                <div className="flex flex-wrap gap-1">
                  {category.items.map((item) => (
                    <Tag key={item}>{item}</Tag>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  const tSec = useTranslations("sectionLabels");
  const tHome = useTranslations("home");

  return (
    <section className="border-t border-border-color">
      <div className="mx-auto max-w-[var(--max-content)] px-[var(--page-pad)] py-20">
        <Reveal>
          <SectionHeading
            kicker={tSec("contact")}
            title={tHome("contactHeading")}
          />
          <p className="mt-4 max-w-[50ch] text-sm text-muted-foreground">
            {tHome("contactLede")}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/contact">
              <Button>
                {tHome("contactCta")} <ArrowRight size={16} />
              </Button>
            </Link>
            <TrackedLink
              href="mailto:ralph.c.gabriel@proton.me"
              className="inline-flex items-center gap-2 rounded-md border border-border-color px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:border-border-strong transition-colors"
              event="email_click"
            >
              <Mail size={14} />
              ralph.c.gabriel@proton.me
            </TrackedLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
