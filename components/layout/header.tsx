"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useTheme } from "next-themes";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { Sun, Moon, Menu, X, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PulseDot } from "@/components/ui/pulse-dot";
import { Button } from "@/components/ui/button";
import { SummaryDrawer } from "@/components/ui/summary-drawer";
import { trackEvent } from "@/lib/analytics";

export function Header() {
  const t = useTranslations("nav");
  const tA = useTranslations("a11y");
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
    { href: "/temoignages" as const, label: t("testimonials") },
    { href: "/contact" as const, label: t("contact") },
  ];

  const switchLocale = () => {
    const newLocale = locale === "fr" ? "en" : "fr";
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <>
      {/* Skip link */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[200] focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-foreground focus:shadow-md focus:outline-2 focus:outline-ring"
      >
        {tA("skipToContent")}
      </a>
    <header
      className={`sticky top-0 z-50 w-full transition-[border-color] duration-200 ${
        scrolled ? "border-b border-border-color" : "border-b border-transparent"
      }`}
    >
      {/* Blurred backdrop kept OFF <header> itself: an element with
          backdrop-filter becomes a containing block for position:fixed
          descendants, which would trap the mobile drawer inside the 64px bar. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: "color-mix(in srgb, var(--background) 78%, transparent)",
          backdropFilter: "saturate(180%) blur(12px)",
          WebkitBackdropFilter: "saturate(180%) blur(12px)",
        }}
      />
      <div className="relative mx-auto flex h-16 max-w-[var(--max-hero)] items-center justify-between gap-4 px-[var(--page-pad)]">
        {/* Left: Logo + Desktop Nav */}
        <div className="flex items-center gap-6">
          <Link href="/" className="inline-flex items-center gap-2.5 p-1">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-[6px] border border-border-strong font-mono text-xs font-medium tracking-[-0.02em]">
              RG
            </span>
            <span className="font-mono text-[13px] text-muted-foreground">
              ralphgabriel<span className="text-foreground">.dev</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-6 lg:flex" aria-label={tA("primaryNav")}>
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

        {/* Right: desktop cluster (collapses as one on mobile) + Theme + Mobile menu */}
        <div className="flex items-center gap-3">
          {/* Single hidden→lg:flex wrapper guarantees the whole cluster collapses
              below lg (tablets use the hamburger), regardless of each child's
              own display utility. */}
          <div className="hidden items-center gap-3 lg:flex">
            <SummaryDrawer />

            {/* Availability badge only from xl — keeps the lg cluster within the
                content width once --page-pad grows to 96px. (Wrapped so the
                display utility wins over Badge's base inline-flex.) */}
            <span className="hidden xl:inline-flex">
              <Badge>
                <PulseDot />
                <span>{t("available")}</span>
              </Badge>
            </span>

            <div className="flex items-center gap-0" role="group" aria-label={tA("language")}>
              <button
                onClick={switchLocale}
                className="cursor-pointer border-0 bg-transparent px-1.5 py-1 font-mono text-xs"
                style={{ color: locale === "fr" ? "var(--foreground)" : "var(--muted-foreground)", fontWeight: locale === "fr" ? 600 : 400 }}
                aria-label="Passer en français"
                aria-current={locale === "fr" ? "true" : undefined}
              >
                FR
              </button>
              <span className="text-[11px] text-muted-foreground" aria-hidden="true">/</span>
              <button
                onClick={switchLocale}
                className="cursor-pointer border-0 bg-transparent px-1.5 py-1 font-mono text-xs"
                style={{ color: locale === "en" ? "var(--foreground)" : "var(--muted-foreground)", fontWeight: locale === "en" ? 600 : 400 }}
                aria-label="Switch to English"
                aria-current={locale === "en" ? "true" : undefined}
              >
                EN
              </button>
            </div>

            <Button
              variant="secondary"
              size="sm"
              onClick={() => { trackEvent("book_call_click"); window.open("https://cal.com/ralphchristiangabriel/15min", "_blank"); }}
              aria-label={t("book")}
            >
              <Calendar size={16} />
              <span className="hidden xl:inline">{t("book")}</span>
            </Button>
          </div>

          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label={theme === "dark" ? tA("themeToLight") : tA("themeToDark")}
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label={tA("openMenu")}
            aria-expanded={drawerOpen}
            onClick={() => setDrawerOpen(true)}
          >
            <Menu size={20} />
          </Button>
        </div>
      </div>

      {/* Mobile drawer — w-full + translate avoids widening document scroll width */}
      <div
        className={`fixed inset-y-0 right-0 z-[100] flex w-full max-w-full flex-col overflow-x-hidden overflow-y-auto bg-background p-6 transition-transform duration-[220ms] ease-out motion-reduce:transition-none ${
          drawerOpen ? "translate-x-0" : "translate-x-full pointer-events-none"
        }`}
        aria-hidden={!drawerOpen}
        inert={!drawerOpen ? true : undefined}
      >
        <div className="mb-8 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2.5" onClick={() => setDrawerOpen(false)}>
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-[6px] border border-border-strong font-mono text-xs font-medium">RG</span>
            <span className="font-mono text-[13px] text-muted-foreground">ralphgabriel<span className="text-foreground">.dev</span></span>
          </Link>
          <Button variant="ghost" size="icon" aria-label={tA("closeMenu")} onClick={() => setDrawerOpen(false)}>
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
          <SummaryDrawer className="self-start" />
          <Badge>
            <PulseDot />
            <span>{t("available")}</span>
          </Badge>
          <div className="flex items-center gap-1">
            <button onClick={switchLocale} className="cursor-pointer border-0 bg-transparent px-1.5 py-1 font-mono text-xs" style={{ color: locale === "fr" ? "var(--foreground)" : "var(--muted-foreground)", fontWeight: locale === "fr" ? 600 : 400 }} aria-label="Passer en français" aria-current={locale === "fr" ? "true" : undefined}>FR</button>
            <span className="text-[11px] text-muted-foreground" aria-hidden="true">/</span>
            <button onClick={switchLocale} className="cursor-pointer border-0 bg-transparent px-1.5 py-1 font-mono text-xs" style={{ color: locale === "en" ? "var(--foreground)" : "var(--muted-foreground)", fontWeight: locale === "en" ? 600 : 400 }} aria-label="Switch to English" aria-current={locale === "en" ? "true" : undefined}>EN</button>
          </div>
          <Button variant="secondary" onClick={() => { trackEvent("book_call_click"); window.open("https://cal.com/ralphchristiangabriel/15min", "_blank"); }}>
            <Calendar size={16} /> {t("book")}
          </Button>
        </div>
      </div>
    </header>
    </>
  );
}
