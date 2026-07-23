"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Sparkles, X, ArrowUpRight, Download, Mail, Calendar, MapPin } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

/**
 * "30-second summary" drawer — a recruiter-oriented at-a-glance panel:
 * who / target role / specialization / three proofs / availability / CV + contact.
 * All content comes from existing i18n + hero metrics; the same information also
 * lives on the pages, so the site stays fully usable without this feature.
 */
export function SummaryDrawer({ className = "" }: { className?: string }) {
  const t = useTranslations("summary");
  const tHero = useTranslations("hero");
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  const close = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  const metrics = [
    { num: tHero("metrics.0.num"), label: tHero("metrics.0.label") },
    { num: tHero("metrics.1.num"), label: tHero("metrics.1.label") },
    { num: tHero("metrics.2.num"), label: tHero("metrics.2.label") },
  ];
  const cvHref =
    locale === "fr" ? "/cv/ralph-gabriel-cv-fr.pdf" : "/cv/ralph-gabriel-cv-en.pdf";
  const proofs = [
    { text: t("proof1"), href: "/projects/the-mad-space" },
    { text: t("proof2"), href: "/projects/cadence" },
    { text: t("proof3"), href: "/experience" },
  ];

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => {
          setOpen(true);
          trackEvent("summary_open");
        }}
        aria-haspopup="dialog"
        className={`inline-flex items-center gap-1.5 rounded-full border border-border-strong px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-accent hover:text-accent ${className}`}
      >
        <Sparkles size={13} className="text-accent" />
        {t("trigger")}
      </button>

      {open && createPortal(
        <div className="fixed inset-0 z-[120]">
          <div
            className="absolute inset-0 bg-foreground/30 backdrop-blur-[2px] motion-safe:animate-[page-in_.2s_ease]"
            onClick={close}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="summary-title"
            className="absolute right-0 top-0 flex h-full w-full max-w-[400px] flex-col overflow-y-auto border-l border-border-color bg-muted p-6 shadow-md motion-safe:animate-[page-in_.25s_ease]"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent">
                  30s
                </span>
                <h2
                  id="summary-title"
                  className="mt-1 text-[26px] leading-tight tracking-[-0.01em]"
                  style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}
                >
                  {t("title")}
                </h2>
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={close}
                aria-label={t("close")}
                className="mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border-color text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground"
              >
                <X size={16} />
              </button>
            </div>

            {/* Proof metrics */}
            <div className="mt-6 grid grid-cols-3 gap-2.5">
              {metrics.map((m, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-border-color bg-background p-3"
                >
                  <div className="text-lg font-semibold tracking-[-0.02em] text-accent">
                    {m.num}
                  </div>
                  <div className="mt-0.5 text-[11px] leading-tight text-muted-foreground">
                    {m.label}
                  </div>
                </div>
              ))}
            </div>

            <Field label={t("roleLabel")}>{t("role")}</Field>
            <Field label={t("specLabel")}>{t("spec")}</Field>

            {/* Three proofs → real project / experience pages */}
            <div className="mt-5">
              <div className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                {t("proofsLabel")}
              </div>
              <ul className="mt-2 flex flex-col gap-2">
                {proofs.map((p) => (
                  <li key={p.href}>
                    <Link
                      href={p.href}
                      onClick={close}
                      className="group flex items-center justify-between gap-3 rounded-lg border border-border-color bg-background px-3 py-2.5 text-sm text-foreground transition-colors hover:border-accent/50"
                    >
                      <span>{p.text}</span>
                      <ArrowUpRight
                        size={15}
                        className="shrink-0 text-muted-foreground transition-colors group-hover:text-accent"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin size={14} className="shrink-0 text-accent" />
              <span>
                <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                  {t("availabilityLabel")}
                </span>
                <br />
                {t("availability")}
              </span>
            </div>

            {/* CTAs */}
            <div className="mt-6 flex flex-col gap-2">
              <a
                href={cvHref}
                target="_blank"
                rel="noreferrer"
                onClick={() => trackEvent(`cv_download_${locale}`)}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
              >
                <Download size={15} /> {t("cv")}
              </a>
              <div className="grid grid-cols-2 gap-2">
                <a
                  href="mailto:ralph.c.gabriel@proton.me"
                  onClick={() => trackEvent("email_click")}
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-border-color px-3 py-2.5 text-sm text-foreground transition-colors hover:border-border-strong"
                >
                  <Mail size={14} /> {t("email")}
                </a>
                <a
                  href="https://cal.com/ralphchristiangabriel/15min"
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => trackEvent("book_call_click")}
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-border-color px-3 py-2.5 text-sm text-foreground transition-colors hover:border-border-strong"
                >
                  <Calendar size={14} /> {t("book")}
                </a>
              </div>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mt-5">
      <div className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </div>
      <p className="mt-1.5 text-sm leading-relaxed text-foreground">{children}</p>
    </div>
  );
}
