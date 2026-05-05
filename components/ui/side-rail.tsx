"use client";

import { useLocale } from "next-intl";
import { Mail, FileText } from "lucide-react";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/icons";
import { trackEvent } from "@/lib/analytics";

const links = [
  {
    href: "https://github.com/ralphgabriel04",
    label: "GitHub",
    icon: GitHubIcon,
    external: true,
    event: "github_click",
  },
  {
    href: "https://linkedin.com/in/ralph-christian-gabriel-45092021b",
    label: "LinkedIn",
    icon: LinkedInIcon,
    external: true,
    event: "linkedin_click",
  },
  {
    href: "mailto:christian8339@hotmail.com",
    label: "Email",
    icon: Mail,
    external: false,
    event: "email_click",
  },
] as const;

export function SideRail() {
  const locale = useLocale();
  const cvHref = locale === "fr" ? "/cv/ralph-gabriel-cv-fr.pdf" : "/cv/ralph-gabriel-cv-en.pdf";

  return (
    <aside
      className="fixed bottom-0 left-6 z-40 hidden flex-col items-center gap-5 md:flex"
      aria-label="Social links"
    >
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target={link.external ? "_blank" : undefined}
          rel={link.external ? "noreferrer" : undefined}
          aria-label={link.label}
          className="text-muted-foreground transition-all duration-150 hover:text-foreground hover:-translate-y-0.5"
          onClick={() => trackEvent(link.event)}
        >
          <link.icon size={18} />
        </a>
      ))}
      <a
        href={cvHref}
        target="_blank"
        rel="noreferrer"
        aria-label={locale === "fr" ? "Télécharger CV" : "Download CV"}
        className="text-muted-foreground transition-all duration-150 hover:text-foreground hover:-translate-y-0.5"
        onClick={() => trackEvent(`cv_download_${locale}`)}
      >
        <FileText size={18} />
      </a>
      <div className="h-24 w-px bg-border-color" />
    </aside>
  );
}
