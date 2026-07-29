"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useTheme } from "next-themes";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { Sun, Moon, Menu, X, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PulseDot } from "@/components/ui/pulse-dot";
import { Button } from "@/components/ui/button";
import { openTerminal } from "@/components/ui/terminal";
import { PlainToggle, usePlain } from "@/components/ui/plain-mode";
import { trackEvent } from "@/lib/analytics";

/** Terminal-style path shown in the header logo, per current route (v2 logic):
 *  home → ~/portfolio, case study → ~/etudes/{slug}, else → ~/{segments}.
 *  `pathname` comes from next-intl and is already locale-stripped. */
function toHeaderPath(pathname: string): string {
  const p = pathname.replace(/\/+$/, "");
  if (!p || p === "/") return "~/portfolio";
  const seg = p.split("/").filter(Boolean);
  if (seg[0] === "projects") return seg[1] ? `~/etudes/${seg[1]}` : "~/etudes";
  return `~/${seg.join("/")}`;
}

export function Header() {
  const t = useTranslations("nav");
  const tA = useTranslations("a11y");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { plain } = usePlain();
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

  // v2 single-page section nav. Plain-language mode swaps RG.SYS terms for
  // plainer ones (Systèmes → Projets, Stack → Outils, Parcours → Expérience).
  const links = [
    { id: "sec-systemes", label: plain ? t("projects") : t("systems") },
    { id: "sec-stack", label: plain ? t("tools") : t("stack") },
    { id: "sec-parcours", label: plain ? t("experience") : t("path") },
    { id: "sec-contact", label: t("contact") },
  ];
  const anchor = (id: string) => `/${locale}#${id}`;
  const headerPath = toHeaderPath(pathname);

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
      className={`sticky top-0 z-50 w-full transition-[border-color] duration-200 print:hidden ${
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
            <span className="inline-flex h-7 min-w-9 items-center justify-center rounded-[6px] border border-border-strong px-1.5 font-mono text-[11px] font-medium tracking-[-0.04em]">
              RCG
            </span>
            <span className="font-mono text-[13px] text-muted-foreground">
              {headerPath}
            </span>
          </Link>
          <nav className="hidden items-center gap-6 lg:flex" aria-label={tA("primaryNav")}>
            {links.map((l) => (
              <a
                key={l.id}
                href={anchor(l.id)}
                className="relative whitespace-nowrap px-1 py-2 text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground"
              >
                {l.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Right: desktop cluster (collapses as one on mobile) + Theme + Mobile menu */}
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-3 lg:flex">
            <PlainToggle />

            <button
              onClick={switchLocale}
              aria-label={locale === "fr" ? "Switch to English" : "Passer en français"}
              className="inline-flex items-center rounded-full border border-border-strong px-3 py-1.5 font-mono text-xs text-muted-foreground transition-colors hover:border-accent hover:text-accent"
            >
              {locale === "fr" ? "FR → EN" : "EN → FR"}
            </button>

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

            <button
              type="button"
              onClick={openTerminal}
              aria-label={tA("terminal")}
              title="⌘K"
              className="inline-flex items-center gap-1.5 rounded-full border border-border-strong px-3 py-1.5 font-mono text-xs text-foreground transition-colors hover:border-accent hover:text-accent"
            >
              <span style={{ color: "var(--accent)" }}>&gt;_</span>
              <span className="hidden xl:inline">terminal</span>
            </button>

            <Link
              href="/recruteur"
              data-mag
              className="inline-flex items-center rounded-full bg-accent px-3.5 py-1.5 text-xs font-semibold text-[color:var(--accent-foreground)] transition-opacity hover:opacity-90"
            >
              {t("recruiter")}
            </Link>
          </div>

          {/* Mobile: theme + hamburger */}
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
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
            <span className="inline-flex h-7 min-w-9 items-center justify-center rounded-[6px] border border-border-strong px-1.5 font-mono text-[11px] font-medium tracking-[-0.04em]">RCG</span>
            <span className="font-mono text-[13px] text-muted-foreground">{headerPath}</span>
          </Link>
          <Button variant="ghost" size="icon" aria-label={tA("closeMenu")} onClick={() => setDrawerOpen(false)}>
            <X size={20} />
          </Button>
        </div>
        <div className="flex flex-col gap-4">
          {links.map((l) => (
            <a
              key={l.id}
              href={anchor(l.id)}
              onClick={() => setDrawerOpen(false)}
              className="border-b border-border-color py-3 text-left text-[22px] text-muted-foreground"
            >
              {l.label}
            </a>
          ))}
        </div>
        <div className="mt-8 flex flex-col gap-3">
          <button
            type="button"
            onClick={() => { setDrawerOpen(false); openTerminal(); }}
            aria-label={tA("terminal")}
            className="inline-flex w-fit items-center gap-1.5 rounded-full border border-border-strong px-3 py-1.5 font-mono text-xs text-foreground transition-colors hover:border-accent hover:text-accent"
          >
            <span style={{ color: "var(--accent)" }}>&gt;_</span> terminal
          </button>
          <PlainToggle className="self-start" expanded />
          <Link
            href="/recruteur"
            onClick={() => setDrawerOpen(false)}
            className="inline-flex w-fit items-center rounded-full bg-accent px-3.5 py-2 text-sm font-semibold text-[color:var(--accent-foreground)]"
          >
            {t("recruiter")}
          </Link>
          <Badge>
            <PulseDot />
            <span>{t("available")}</span>
          </Badge>
          <button onClick={switchLocale} className="w-fit cursor-pointer rounded-full border border-border-strong px-3 py-1.5 font-mono text-xs text-muted-foreground" aria-label={locale === "fr" ? "Switch to English" : "Passer en français"}>
            {locale === "fr" ? "FR → EN" : "EN → FR"}
          </button>
          <Button variant="secondary" onClick={() => { trackEvent("book_call_click"); window.open("https://cal.com/ralphchristiangabriel/15min", "_blank"); }}>
            <Calendar size={16} /> {t("book")}
          </Button>
        </div>
      </div>
    </header>
    </>
  );
}
