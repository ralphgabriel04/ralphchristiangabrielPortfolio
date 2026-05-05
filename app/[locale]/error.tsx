"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Home, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("error");

  useEffect(() => {
    console.error("[Portfolio Error]", error);
  }, [error]);

  return (
    <section className="mx-auto flex min-h-[60vh] max-w-[var(--max-content)] flex-col items-center justify-center gap-6 px-[var(--page-pad)] py-20 text-center">
      <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
        {t("kicker")}
      </span>
      <h1 className="text-4xl font-medium tracking-[-0.03em] md:text-5xl">
        {t("heading")}
      </h1>
      <p className="max-w-[45ch] text-sm text-muted-foreground">
        {t("body")}
      </p>
      <div className="flex flex-wrap items-center gap-3 pt-2">
        <Button onClick={reset}>
          <RotateCcw size={16} /> {t("retry")}
        </Button>
        <Link href="/">
          <Button variant="secondary">
            <Home size={16} /> {t("home")}
          </Button>
        </Link>
      </div>
    </section>
  );
}
