"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useTheme } from "next-themes";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { Sun, Moon, Menu, X, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PulseDot } from "@/components/ui/pulse-dot";
import { Button } from "@/components/ui/button";

export function Header() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setDrawerOpen(false); }, [pathname]);

  const links = [
    { href: "/projects" as const, label: t("projects") },
    { href: "/about" as const, label: t("about") },
    { href: "/experience" as const, label: t("experience") },
    { href: "/contact" as const, label: t("contact") },
  ];

  const switchLocale = () => {
    const newLocale = locale === "fr" ? "en" : "fr";
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-[border-color,background-color] duration-200 ${
        scrolled ? "border-b border-border-color" : "border-b border-transparent"
      }`}
      style={{
        background: "color-mix(in srgb, var(--background) 78%, transparent)",
        backdropFilter: "saturate(180%) blur(12px)",
        WebkitBackdropFilter: "saturate(180%) blur(12px)",
      }}
    >
      <div className="mx-auto flex h-16 max-w-[var(--max-hero)] items-center justify-between gap-4 px-[var(--page-pad)]">
        {/* Left: Logo + Desktop Nav */}
        <div className="flex items-center gap-6">
          <Link href="/" className="inline-flex items-center gap-2.5 p-1" aria-label="Home">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-[6px] border border-border-strong font-mono text-xs font-medium tracking-[-0.02em]">
              RG
            </span>
            <span className="font-mono text-[13px] text-muted-foreground">
              ralphgabriel<span className="text-foreground">.dev</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-6 md:flex" aria-label="Primary">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`relative whitespace-nowrap px-1 py-2 text-sm transition-colors duration-150 ${
                  pathname === l.href
                    ? "text-foreground after:absolute after:bottom-0.5 after:left-1 after:right-1 after:h-px after:bg-current"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right: Badge + Lang + Theme + Cal + Mobile menu */}
        <div className="flex items-center gap-3">
          <Badge className="hidden md:inline-flex">
            <PulseDot />
            <span>{t("available")}</span>
          </Badge>

          <div className="hidden items-center gap-0 md:flex" role="group" aria-label="Language">
            <button
              onClick={switchLocale}
              className="cursor-pointer border-0 bg-transparent px-1.5 py-1 font-mono text-xs"
              style={{ color: locale === "fr" ? "var(--foreground)" : "var(--muted-foreground)", fontWeight: locale === "fr" ? 600 : 400 }}
            >
              FR
            </button>
            <span className="text-[11px] text-muted-foreground">/</span>
            <button
              onClick={switchLocale}
              className="cursor-pointer border-0 bg-transparent px-1.5 py-1 font-mono text-xs"
              style={{ color: locale === "en" ? "var(--foreground)" : "var(--muted-foreground)", fontWeight: locale === "en" ? 600 : 400 }}
            >
              EN
            </button>
          </div>

          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </Button>
          )}

          <Button
            variant="secondary"
            size="sm"
            className="hidden md:inline-flex"
            onClick={() => window.open("#", "_blank")}
            aria-label={t("book")}
          >
            <Calendar size={16} />
            <span className="hidden lg:inline">{t("book")}</span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Open menu"
            aria-expanded={drawerOpen}
            onClick={() => setDrawerOpen(true)}
          >
            <Menu size={20} />
          </Button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-[100] flex flex-col bg-background p-6 transition-transform duration-[220ms] ease-out ${
          drawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!drawerOpen}
      >
        <div className="mb-8 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2.5" aria-label="Home" onClick={() => setDrawerOpen(false)}>
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-[6px] border border-border-strong font-mono text-xs font-medium">RG</span>
            <span className="font-mono text-[13px] text-muted-foreground">ralphgabriel<span className="text-foreground">.dev</span></span>
          </Link>
          <Button variant="ghost" size="icon" aria-label="Close menu" onClick={() => setDrawerOpen(false)}>
            <X size={20} />
          </Button>
        </div>
        <div className="flex flex-col gap-4">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setDrawerOpen(false)}
              className={`border-b border-border-color py-3 text-left text-[22px] ${
                pathname === l.href ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>
        <div className="mt-8 flex flex-col gap-3">
          <Badge>
            <PulseDot />
            <span>{t("available")}</span>
          </Badge>
          <div className="flex items-center gap-1">
            <button onClick={switchLocale} className="cursor-pointer border-0 bg-transparent px-1.5 py-1 font-mono text-xs" style={{ color: locale === "fr" ? "var(--foreground)" : "var(--muted-foreground)", fontWeight: locale === "fr" ? 600 : 400 }}>FR</button>
            <span className="text-[11px] text-muted-foreground">/</span>
            <button onClick={switchLocale} className="cursor-pointer border-0 bg-transparent px-1.5 py-1 font-mono text-xs" style={{ color: locale === "en" ? "var(--foreground)" : "var(--muted-foreground)", fontWeight: locale === "en" ? 600 : 400 }}>EN</button>
          </div>
          <Button variant="secondary" onClick={() => window.open("#", "_blank")}>
            <Calendar size={16} /> {t("book")}
          </Button>
        </div>
      </div>
    </header>
  );
}
