"use client";

import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Mail } from "lucide-react";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/icons";

export function Footer() {
  const locale = useLocale();
  const t = useTranslations("footer");

  return (
    <footer className="border-t border-border-color px-[var(--page-pad)] py-12 text-[13px] text-muted-foreground">
      <div className="mx-auto max-w-[var(--max-content)]">
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link href="/" className="inline-flex items-center gap-2.5" aria-label="Home">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-[6px] border border-border-strong font-mono text-xs font-medium text-foreground">RG</span>
              <span className="font-mono text-[13px] text-muted-foreground">ralphgabriel<span className="text-foreground">.dev</span></span>
            </Link>
            <div className="flex items-center gap-4">
              <a href="https://github.com/ralphgabriel04" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors" target="_blank" rel="noreferrer" aria-label="GitHub">
                <GitHubIcon size={16} /> GitHub
              </a>
              <a href="https://linkedin.com/in/ralph-christian-gabriel-45092021b" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                <LinkedInIcon size={16} /> LinkedIn
              </a>
              <a href="mailto:christian8339@hotmail.com" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors" aria-label="Email">
                <Mail size={16} /> Email
              </a>
            </div>
          </div>
          <hr className="h-px border-0 bg-border-color" />
          <div className="flex flex-wrap justify-between gap-3">
            <span className="font-mono text-xs">&copy; 2026 Ralph Christian Gabriel</span>
            <span className="font-mono text-xs">{t("location")}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
