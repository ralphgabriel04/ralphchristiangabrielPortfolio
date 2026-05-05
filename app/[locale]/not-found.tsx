import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <section className="mx-auto flex min-h-[60vh] max-w-[var(--max-content)] flex-col items-center justify-center gap-6 px-[var(--page-pad)] py-20 text-center">
      <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
        404
      </span>
      <h1 className="text-4xl font-medium tracking-[-0.03em] md:text-5xl">
        {t("heading")}
      </h1>
      <p className="max-w-[45ch] text-sm text-muted-foreground">
        {t("body")}
      </p>
      <div className="flex flex-wrap items-center gap-3 pt-2">
        <Link href="/">
          <Button>
            <Home size={16} /> {t("home")}
          </Button>
        </Link>
        <Link href="/projects">
          <Button variant="secondary">
            {t("projects")}
          </Button>
        </Link>
        <Link href="/contact">
          <Button variant="ghost">
            <ArrowLeft size={16} /> {t("contact")}
          </Button>
        </Link>
      </div>
    </section>
  );
}
