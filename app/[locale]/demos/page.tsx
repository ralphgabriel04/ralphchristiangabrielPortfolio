import type { Metadata } from "next";
import Image from "next/image";
import { setRequestLocale } from "next-intl/server";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { alternatesFor } from "@/lib/site";
import { demos, liveApps } from "@/lib/demos";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { DemoPlayground } from "@/components/ui/demo-playground";

const SERIF = { fontFamily: "var(--font-instrument-serif), Georgia, serif" } as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isFr = locale === "fr";
  return {
    title: isFr ? "Démos" : "Demos",
    description: isFr
      ? "Testez mes applications sans compte : Wise & Wealthy, Vibe Montréal, BOA, un jeu Tron et d'autres prototypes, directement dans la page."
      : "Try my apps without an account: Wise & Wealthy, Vibe Montréal, BOA, a Tron game and other prototypes, right in the page.",
    alternates: alternatesFor(locale, "/demos"),
  };
}

export default async function DemosPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const fr = locale === "fr";
  const lang = fr ? "fr" : "en";

  return (
    <div className="mx-auto max-w-[var(--max-content)] px-[var(--page-pad)] py-20">
      <Reveal>
        <SectionHeading as="h1" kicker={fr ? "Démos" : "Demos"} title={fr ? "Testez mes applications." : "Try my apps."} />
        <p className="mt-5 max-w-[62ch] text-[15px] leading-relaxed text-muted-foreground md:text-base">
          {fr
            ? `${demos.length} prototypes se lancent ici même, sans compte ni installation. Choisissez une application, lancez-la, puis suivez les étapes à droite.`
            : `${demos.length} prototypes run right here, with no account or install. Pick an app, launch it, then follow the steps on the right.`}
        </p>
      </Reveal>

      <Reveal delay={60}>
        <div className="mt-10">
          <DemoPlayground
            demos={demos}
            locale={locale}
            labels={{
              choose: fr ? "Choisir une démo" : "Choose a demo",
              launch: fr ? "Lancer la démo" : "Launch the demo",
              frameTitle: fr ? "Démo interactive" : "Interactive demo",
              open: fr ? "Plein écran" : "Full screen",
              caseStudy: fr ? "Lire l'étude de cas" : "Read the case study",
              tryThis: fr ? "À essayer" : "Things to try",
              mobile: fr ? "Application mobile" : "Mobile app",
              desktop: fr ? "Ordinateur" : "Desktop",
              minutes: "min",
              keyboard: fr ? "Clavier" : "Keyboard",
              keyboardHint: fr
                ? "Le jeu ne capte le clavier qu'après un clic dans la zone de jeu."
                : "The game only receives keys after a click inside the play area.",
            }}
          />
        </div>
      </Reveal>

      {/* Apps deployed elsewhere: real data or framing refused, so they open in a new tab */}
      <section aria-labelledby="en-ligne" className="mt-20">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-3 border-b border-border-strong pb-4">
            <div>
              <h2 id="en-ligne" className="text-3xl leading-[1.05] tracking-[-0.01em] md:text-[40px]" style={SERIF}>
                {fr ? "Applications en ligne." : "Live apps."}
              </h2>
              <p className="mt-2 text-[15px] text-muted-foreground">
                {fr
                  ? "Déployées ailleurs, elles s'ouvrent dans un nouvel onglet."
                  : "Deployed elsewhere, they open in a new tab."}
              </p>
            </div>
          </div>
        </Reveal>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {liveApps.map((a, i) => (
            <Reveal key={a.id} delay={60 * (i + 1)} className="h-full">
              <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border-color bg-muted transition-colors hover:border-border-strong">
                <div className="relative aspect-[16/10] overflow-hidden border-b border-border-color bg-muted-2">
                  <Image
                    src={a.poster}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, 360px"
                    className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none"
                  />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{a.kind[lang]}</span>
                  <h3 className="mt-2 text-[17px] font-semibold">{a.name}</h3>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-muted-foreground">{a.what[lang]}</p>
                  <p className="mt-3 border-l-2 border-border-strong pl-3 text-[13.5px] leading-relaxed text-muted-foreground">{a.access[lang]}</p>
                  <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-5 text-sm font-semibold">
                    <a
                      href={a.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-accent hover:underline"
                    >
                      {fr ? "Ouvrir l'application" : "Open the app"} <ArrowUpRight size={14} aria-hidden="true" />
                    </a>
                    <Link href={`/projects/${a.id}`} className="inline-flex items-center gap-1 text-foreground hover:text-accent">
                      {fr ? "Étude de cas" : "Case study"} <ArrowRight size={14} aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <Reveal>
        <p className="mt-16 text-[15px] text-muted-foreground">
          {fr ? "Une question sur une de ces applications ? " : "A question about one of these apps? "}
          <Link href="/contact" className="font-semibold text-accent hover:underline">
            {fr ? "Écrivez-moi" : "Get in touch"}
          </Link>
          .
        </p>
      </Reveal>
    </div>
  );
}
