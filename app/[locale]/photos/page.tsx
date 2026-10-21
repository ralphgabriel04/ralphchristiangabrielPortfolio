import type { Metadata } from "next";
import Image from "next/image";
import { setRequestLocale } from "next-intl/server";
import { ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { alternatesFor } from "@/lib/site";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { galleryGroups, galleryCount, gallerySrc } from "@/lib/gallery";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isFr = locale === "fr";
  return {
    title: "Photos",
    description: isFr
      ? `${galleryCount} photos de Ralph Christian Gabriel : stage à La Caisse, études à l'ÉTS, demi-marathon, plein air, cuisine et poste de travail.`
      : `${galleryCount} photos of Ralph Christian Gabriel: La Caisse internship, studies at ÉTS, half marathon, outdoors, cooking and desk setup.`,
    alternates: alternatesFor(locale, "/photos"),
  };
}

/**
 * Photo gallery: every usable photo of Ralph, grouped by theme (data: lib/gallery.ts).
 * Masonry with CSS columns so portrait and landscape photos keep their real ratio.
 */
export default async function PhotosPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const lang = locale === "fr" ? "fr" : "en";
  const isFr = lang === "fr";

  return (
    <div className="mx-auto max-w-[var(--max-content)] px-[var(--page-pad)] py-20">
      <Reveal>
        <Link
          href="/about"
          className="inline-flex items-center gap-1.5 font-mono text-[12px] text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft size={13} /> {isFr ? "À propos" : "About"}
        </Link>
        <div className="mt-6">
          <SectionHeading as="h1" kicker={isFr ? "Photos" : "Photos"} title={isFr ? "En images." : "In pictures."} />
        </div>
        <p className="mt-5 max-w-[62ch] text-[15px] leading-relaxed text-muted-foreground md:text-base">
          {isFr
            ? `Le travail, les études, le sport et le reste : ${galleryCount} photos, de 2023 à 2026.`
            : `Work, studies, sport and everything else: ${galleryCount} photos, from 2023 to 2026.`}
        </p>

        {/* Jump links to each theme */}
        <nav aria-label={isFr ? "Thèmes" : "Themes"} className="mt-8 flex flex-wrap gap-2">
          {galleryGroups.map((g) => (
            <a
              key={g.id}
              href={`#${g.id}`}
              className="rounded-full border border-border-color px-3 py-1.5 font-mono text-[12px] text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground"
            >
              {g.title[lang]} <span className="text-muted-foreground">{g.photos.length}</span>
            </a>
          ))}
        </nav>
      </Reveal>

      {galleryGroups.map((g) => (
        <section key={g.id} id={g.id} aria-labelledby={`${g.id}-title`} className="mt-16 scroll-mt-24">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-3 border-b border-border-strong pb-4">
              <div>
                <h2
                  id={`${g.id}-title`}
                  className="text-3xl leading-[1.05] tracking-[-0.01em] md:text-[40px]"
                  style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}
                >
                  {g.title[lang]}
                </h2>
                <p className="mt-2 text-[15px] text-muted-foreground">{g.intro[lang]}</p>
              </div>
              <span className="font-mono text-[12px] text-muted-foreground">
                {g.photos.length} {g.photos.length > 1 ? "photos" : "photo"}
              </span>
            </div>
          </Reveal>

          {/* 4 photos: one row of 4 on large screens instead of a lone photo on a 2nd row. */}
          <div className={`mt-8 columns-2 gap-4 md:gap-6 ${g.photos.length === 4 ? "lg:columns-4" : "md:columns-3"}`}>
            {g.photos.map((p) => (
              <figure
                key={p.slug}
                className="group mb-4 break-inside-avoid overflow-hidden rounded-lg border border-border-color bg-muted md:mb-6"
              >
                <a href={gallerySrc(p.slug)} target="_blank" rel="noreferrer" className="block overflow-hidden">
                  <Image
                    src={gallerySrc(p.slug)}
                    alt={p.alt[lang]}
                    width={p.w}
                    height={p.h}
                    sizes="(max-width: 768px) 50vw, 360px"
                    className="h-auto w-full transition-transform duration-500 motion-safe:group-hover:scale-[1.02]"
                  />
                </a>
                <figcaption className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5 px-3.5 py-2.5">
                  <span className="text-[13.5px] font-medium leading-snug text-foreground">{p.caption[lang]}</span>
                  <span className="shrink-0 font-mono text-[12px] text-muted-foreground">{p.date[lang]}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
