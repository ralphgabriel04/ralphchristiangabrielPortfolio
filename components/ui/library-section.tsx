import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { ArrowUpRight, BookOpen } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import {
  books,
  quotes,
  readingSteps,
  readingPostUrl,
  selfStudy,
  formatReadMonth,
  type Book,
} from "@/lib/library";

const SERIF = { fontFamily: "var(--font-instrument-serif), Georgia, serif" } as const;
/** French guillemets with non-breaking spaces so « and » never end up alone on a line. */
const quoteFr = (s: string) => `\u00ab\u00a0${s}\u00a0\u00bb`;
const quoteEn = (s: string) => `\u201c${s}\u201d`;
const COVER_SHADOW =
  "shadow-[0_1px_2px_rgba(25,24,17,0.14),0_12px_24px_-14px_rgba(25,24,17,0.5)]";

/**
 * "Ce que je lis" — About page. Featured books (cover + his takeaway + where he
 * applied it), the rest of the 2026 shelf as a compact list, quotes he keeps,
 * and his reading system. Data: lib/library.ts.
 */
export function LibrarySection() {
  const t = useTranslations("about.library");
  const locale = useLocale();
  const lang = locale === "fr" ? "fr" : "en";

  const featured = books.filter((b) => b.featured);
  const shelf = books.filter((b) => !b.featured);

  return (
    <section
      id="lectures"
      className="mx-auto max-w-[var(--max-content)] px-[var(--page-pad)] pb-20"
    >
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">{t("heading")}</h2>
            <p className="mt-2 max-w-[62ch] text-sm text-muted-foreground">{t("sub")}</p>
          </div>
          <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
            {t("meta", { count: books.length })}
          </span>
        </div>
      </Reveal>

      {/* Featured books */}
      <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {featured.map((b, i) => (
          <Reveal key={b.slug} delay={60 + i * 50} className="h-full">
            <FeaturedBook book={b} lang={lang} locale={locale} category={t(`categories.${b.category}`)} noteLabel={t("note")} appliedLabel={t("applied")} />
          </Reveal>
        ))}
      </div>

      {/* Rest of the 2026 shelf */}
      <Reveal delay={80}>
        <div className="mt-12">
          <h3 className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
            {t("shelf")}
          </h3>
          <ul className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
            {shelf.map((b) => (
              <li key={b.slug}>
                <a
                  href={b.post}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${b.title}, ${b.author} : ${t("note")}`}
                  className="group flex items-center gap-3 rounded-md p-1.5 transition-colors hover:bg-muted-2"
                >
                  <span className={`relative h-[54px] w-[36px] shrink-0 overflow-hidden rounded-[2px] ${COVER_SHADOW}`}>
                    <Image src={b.cover} alt="" fill sizes="36px" className="object-cover" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="line-clamp-2 text-sm font-medium leading-snug transition-colors group-hover:text-accent">
                      {b.title}
                    </span>
                    <span className="mt-0.5 block truncate text-xs text-muted-foreground">{b.author}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>

      {/* Quotes + reading system */}
      <div className="mt-12 grid gap-6 lg:grid-cols-[1.25fr_1fr]">
        <Reveal delay={60}>
          <div>
            <h3 className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
              {t("quotesTitle")}
            </h3>
            <div className="mt-5 flex flex-col gap-6">
              {quotes.map((q) => (
                <figure key={q.author} className="border-l-2 border-accent pl-4">
                  <blockquote className="text-xl leading-snug md:text-[22px]" style={SERIF}>
                    {lang === "fr" ? quoteFr(q.text.fr) : quoteEn(q.text.en)}
                  </blockquote>
                  <figcaption className="mt-2 font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
                    {q.author} · <span className="normal-case italic tracking-normal">{q.source}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="h-full rounded-lg border border-border-color bg-muted p-5">
            <div className="flex items-center gap-2">
              <BookOpen size={16} className="text-accent" aria-hidden="true" />
              <h3 className="text-sm font-semibold">{t("methodTitle")}</h3>
            </div>
            <ol className="mt-4 flex flex-col gap-3">
              {readingSteps.map((s, i) => (
                <li key={s.title.en} className="grid grid-cols-[28px_1fr] gap-2">
                  <span className="font-mono text-[11px] text-accent">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-xs leading-relaxed text-muted-foreground">
                    <span className="font-semibold text-foreground">{s.title[lang]}.</span> {s.body[lang]}
                  </span>
                </li>
              ))}
            </ol>
            <p className="mt-4 text-sm leading-snug" style={SERIF}>
              {t("rule")}
            </p>
            <a
              href={readingPostUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex items-center gap-1 text-xs font-medium underline decoration-border-strong underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
            >
              {t("methodLink")} <ArrowUpRight size={12} aria-hidden="true" />
            </a>

            <div className="mt-5 border-t border-border-color pt-4">
              <h4 className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
                {t("selfStudy")}
              </h4>
              <ul className="mt-3 flex flex-col gap-2">
                {selfStudy.map((s) => (
                  <li key={s.href}>
                    <a href={s.href} target="_blank" rel="noreferrer" className="group block text-xs">
                      <span className="inline-flex items-center gap-1 font-medium transition-colors group-hover:text-accent">
                        {s.title[lang]} <ArrowUpRight size={11} aria-hidden="true" />
                      </span>
                      <span className="block leading-relaxed text-muted-foreground">{s.detail[lang]}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function FeaturedBook({
  book,
  lang,
  locale,
  category,
  noteLabel,
  appliedLabel,
}: {
  book: Book;
  lang: "fr" | "en";
  locale: string;
  category: string;
  noteLabel: string;
  appliedLabel: string;
}) {
  const f = book.featured!;
  return (
    <article className="group flex h-full gap-4 rounded-lg border border-border-color bg-muted p-4 transition-all duration-200 ease-out hover:border-border-strong hover:shadow-md">
      <div className={`relative h-[120px] w-[80px] shrink-0 overflow-hidden rounded-[3px] ${COVER_SHADOW}`}>
        <Image
          src={book.cover}
          alt={`${book.title}, ${book.author}`}
          fill
          sizes="80px"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04] motion-reduce:transition-none"
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="font-mono text-[10.5px] uppercase tracking-[0.08em] text-muted-foreground">
          {category} · {formatReadMonth(book.read, locale)}
        </span>
        <h3 className="mt-1 text-sm font-semibold leading-snug">{book.title}</h3>
        <p className="text-xs text-muted-foreground">{book.author}</p>
        <blockquote className="mt-3 text-[16px] leading-snug" style={SERIF}>
          {lang === "fr" ? quoteFr(f.takeaway.fr) : quoteEn(f.takeaway.en)}
        </blockquote>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          <span className="font-medium text-foreground">{appliedLabel}</span> {f.applied[lang]}
        </p>
        <a
          href={book.post}
          target="_blank"
          rel="noreferrer"
          className="mt-auto inline-flex w-fit items-center gap-1 pt-3 text-xs font-medium underline decoration-border-strong underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
        >
          {noteLabel} <ArrowUpRight size={12} aria-hidden="true" />
        </a>
      </div>
    </article>
  );
}
