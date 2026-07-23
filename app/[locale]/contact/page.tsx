import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import {
  Calendar,
  Mail,
  FileText,
  ExternalLink,
} from "lucide-react";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/icons";
import { Card } from "@/components/ui/card";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { TrackedLink } from "@/components/ui/tracked-link";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isFr = locale === "fr";
  return {
    title: "Contact",
    description: isFr
      ? "Disponible pour des postes Full-Stack Junior/Intermediate dans le Grand Montréal. Email, LinkedIn, Cal.com."
      : "Available for Junior/Intermediate Full-Stack roles in Greater Montréal. Email, LinkedIn, Cal.com.",
    alternates: {
      languages: { fr: "/fr/contact", en: "/en/contact" },
    },
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ContactContent locale={locale} />;
}

function ContactContent({ locale }: { locale: string }) {
  const t = useTranslations("contact");
  const tSec = useTranslations("sectionLabels");

  return (
    <section className="mx-auto max-w-[var(--max-content)] px-[var(--page-pad)] py-20">
      <Reveal>
        <SectionHeading as="h1" kicker={tSec("contact")} title={t("title")} />
        <p className="mt-2 mb-4 max-w-[55ch] text-sm text-muted-foreground">
          {t("lede")}
        </p>
        <p className="mb-12 max-w-[55ch] text-xs text-muted-foreground italic">
          {t("noFormNote")}
        </p>
      </Reveal>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Cal.com — prominent card */}
        <Reveal delay={60} className="md:col-span-2">
          <SpotlightCard className="p-8" radius={450} opacity={0.1}>
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <Calendar size={24} />
              </div>
              <h3 className="text-lg font-medium">{t("bookCall")}</h3>
              <p className="max-w-[40ch] text-sm text-muted-foreground">
                {t("lede")}
              </p>
              <TrackedLink
                href="https://cal.com/ralphchristiangabriel/15min"
                target="_blank"
                rel="noreferrer"
                event="book_call_click"
              >
                <Button>
                  <Calendar size={16} /> {t("bookCall")}{" "}
                  <ExternalLink size={14} />
                </Button>
              </TrackedLink>
            </div>
          </SpotlightCard>
        </Reveal>

        {/* Email */}
        <Reveal delay={120}>
          <Card className="p-6 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <Mail size={18} className="text-muted-foreground" />
              <h3 className="text-sm font-medium">{t("email")}</h3>
            </div>
            <a
              href="mailto:ralph.c.gabriel@proton.me"
              className="text-sm text-accent hover:underline break-all"
            >
              ralph.c.gabriel@proton.me
            </a>
          </Card>
        </Reveal>

        {/* LinkedIn */}
        <Reveal delay={180}>
          <Card className="p-6 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <LinkedInIcon size={18} className="text-muted-foreground" />
              <h3 className="text-sm font-medium">LinkedIn</h3>
            </div>
            <a
              href="https://linkedin.com/in/ralph-christian-gabriel-45092021b"
              target="_blank"
              rel="noreferrer"
              className="text-sm text-accent hover:underline"
            >
              linkedin.com/in/ralph-christian-gabriel
              <ExternalLink size={12} className="inline ml-1" />
            </a>
          </Card>
        </Reveal>

        {/* GitHub */}
        <Reveal delay={240}>
          <Card className="p-6 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <GitHubIcon size={18} className="text-muted-foreground" />
              <h3 className="text-sm font-medium">GitHub</h3>
            </div>
            <a
              href="https://github.com/ralphgabriel04"
              target="_blank"
              rel="noreferrer"
              className="text-sm text-accent hover:underline"
            >
              github.com/ralphgabriel04
              <ExternalLink size={12} className="inline ml-1" />
            </a>
          </Card>
        </Reveal>

        {/* CV Downloads */}
        <Reveal delay={300}>
          <Card className="p-6 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <FileText size={18} className="text-muted-foreground" />
              <h3 className="text-sm font-medium">CV</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              <a
                href="/cv/ralph-gabriel-cv-fr.pdf"
                target="_blank"
                rel="noreferrer"
              >
                <Button variant="secondary" size="sm">
                  {t("cvFr")} <ExternalLink size={12} />
                </Button>
              </a>
              <a
                href="/cv/ralph-gabriel-cv-en.pdf"
                target="_blank"
                rel="noreferrer"
              >
                <Button variant="secondary" size="sm">
                  {t("cvEn")} <ExternalLink size={12} />
                </Button>
              </a>
            </div>
          </Card>
        </Reveal>
      </div>
    </section>
  );
}
