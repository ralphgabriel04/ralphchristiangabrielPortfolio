import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Mail, Calendar } from "lucide-react";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/icons";

export function Footer() {
  const locale = useLocale();
  const t = useTranslations("footer");

  return (
    <footer className="border-t border-border-color px-[var(--page-pad)] py-12 text-[13px] text-muted-foreground">
      <div className="mx-auto max-w-[var(--max-content)]">
        <div className="grid gap-8 sm:grid-cols-3">
          {/* Branding */}
          <div className="flex flex-col gap-3">
            <Link href="/" className="inline-flex items-center gap-2.5" aria-label="Home">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-[6px] border border-border-strong font-mono text-xs font-medium text-foreground">RG</span>
              <span className="font-mono text-[13px] text-muted-foreground">ralphgabriel<span className="text-foreground">.dev</span></span>
            </Link>
            <span className="font-mono text-xs">{t("location")}</span>
          </div>

          {/* Navigation */}
          <nav aria-label="Footer" className="flex flex-col gap-2">
            <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground/60 mb-1">Navigation</span>
            <Link href="/projects" className="text-muted-foreground hover:text-foreground transition-colors">
              {locale === "fr" ? "Projets" : "Projects"}
            </Link>
            <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
              {locale === "fr" ? "À propos" : "About"}
            </Link>
            <Link href="/experience" className="text-muted-foreground hover:text-foreground transition-colors">
              {locale === "fr" ? "Expérience" : "Experience"}
            </Link>
            <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
              Contact
            </Link>
          </nav>

          {/* Links */}
          <nav aria-label={locale === "fr" ? "Liens externes" : "External links"} className="flex flex-col gap-2">
            <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground/60 mb-1">{locale === "fr" ? "Liens" : "Links"}</span>
            <a href="https://github.com/ralphgabriel04" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors" target="_blank" rel="noreferrer">
              <GitHubIcon size={14} /> GitHub
            </a>
            <a href="https://linkedin.com/in/ralph-christian-gabriel-45092021b" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors" target="_blank" rel="noreferrer">
              <LinkedInIcon size={14} /> LinkedIn
            </a>
            <a href="mailto:christian8339@hotmail.com" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <Mail size={14} /> Email
            </a>
            <a href="https://cal.com/ralphchristiangabriel/15min" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors" target="_blank" rel="noreferrer">
              <Calendar size={14} /> Cal.com
            </a>
          </nav>
        </div>

        <hr className="h-px border-0 bg-border-color mt-8 mb-4" />
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="font-mono text-xs">&copy; 2026 Ralph Christian Gabriel</span>
          <span className="font-mono text-xs text-muted-foreground/60">
            Built with Next.js ·{" "}
            <a
              href="https://github.com/ralphgabriel04/ralphchristiangabrielPortfolio"
              target="_blank"
              rel="noreferrer"
              className="hover:text-foreground transition-colors"
            >
              Source
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
