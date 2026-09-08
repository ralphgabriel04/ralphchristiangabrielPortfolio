import type { Metadata } from "next";
import Script from "next/script";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Providers } from "@/components/providers";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Instrument_Serif } from "next/font/google";
import { routing } from "@/i18n/routing";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SideRail } from "@/components/ui/side-rail";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import { Terminal } from "@/components/ui/terminal";
import { Boot } from "@/components/ui/boot";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { CustomCursor } from "@/components/ui/custom-cursor";
import { PlainModeProvider } from "@/components/ui/plain-mode";
import { SITE_URL, IS_PRODUCTION, alternatesFor } from "@/lib/site";
import "@/app/globals.css";

const BASE_URL = SITE_URL;

const instrumentSerif = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-instrument-serif",
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isFr = locale === "fr";

  return {
    title: {
      default: isFr
        ? "Ralph Christian Gabriel · Étudiant en génie logiciel"
        : "Ralph Christian Gabriel · Software Engineering Student",
      template: "%s | Ralph Christian Gabriel",
    },
    description: isFr
      ? "Étudiant en génie logiciel à l’ÉTS et stagiaire en automatisation de processus à La Caisse (CDPQ), bilingue FR/EN. Analyse, architecture, produits web et mobiles, avec réalisations documentées. Grand Montréal."
      : "Software Engineering student at ÉTS and process automation developer intern at La Caisse (CDPQ), bilingual FR/EN. Analysis, architecture, web and mobile products, with documented work. Greater Montréal.",
    metadataBase: new URL(BASE_URL),
    alternates: alternatesFor(locale, ""),
    openGraph: {
      type: "website",
      locale: isFr ? "fr_CA" : "en_CA",
      url: `${BASE_URL}/${locale}`,
      siteName: "Ralph Christian Gabriel",
      title: isFr
        ? "Ralph Christian Gabriel · Étudiant en génie logiciel"
        : "Ralph Christian Gabriel · Software Engineering Student",
      description: isFr
        ? "Analyse, architecture et conception de produits web et mobiles. Portfolio bilingue d’un étudiant en génie logiciel à l’ÉTS, stagiaire en automatisation de processus à La Caisse (CDPQ)."
        : "Analysis, architecture, and web and mobile product design. Bilingual portfolio of a Software Engineering student at ÉTS, process automation developer intern at La Caisse (CDPQ).",
    },
    twitter: {
      card: "summary_large_image",
      title: "Ralph Christian Gabriel",
      description: isFr
        ? "Étudiant en génie logiciel à l’ÉTS · Web, mobile et architecture"
        : "Software Engineering student at ÉTS · Web, mobile and architecture",
    },
    // Only the production deployment is indexable — preview URLs and local
    // builds must stay out of search results.
    robots: IS_PRODUCTION
      ? { index: true, follow: true }
      : { index: false, follow: false },
    verification: {
      google: "yEHJTde4FzMEk20PqCq5WqtmXrdJb0dwAzdQ1dm1vMU",
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const personId = `${BASE_URL}/#person`;
const websiteId = `${BASE_URL}/#website`;

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": personId,
      name: "Ralph Christian Gabriel",
      jobTitle: "Software Engineering Student and Software Developer",
      url: BASE_URL,
      email: "ralph.c.gabriel@proton.me",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Repentigny",
        addressRegion: "QC",
        addressCountry: "CA",
      },
      alumniOf: [
        { "@type": "CollegeOrUniversity", name: "ÉTS, École de technologie supérieure" },
        { "@type": "CollegeOrUniversity", name: "Collège Rosemont" },
        { "@type": "EducationalOrganization", name: "CFP des Riverains" },
      ],
      worksFor: [
        { "@type": "Organization", name: "La Caisse (CDPQ)", url: "https://www.lacaisse.com" },
        { "@type": "Organization", name: "Cadence" },
        { "@type": "Organization", name: "The Mad Space" },
      ],
      knowsLanguage: ["fr", "en"],
      sameAs: [
        "https://github.com/ralphgabriel04",
        "https://linkedin.com/in/ralph-christian-gabriel-45092021b",
      ],
    },
    {
      "@type": "WebSite",
      "@id": websiteId,
      url: BASE_URL,
      name: "Ralph Christian Gabriel",
      inLanguage: ["fr-CA", "en-CA"],
      author: { "@id": personId },
      publisher: { "@id": personId },
    },
    {
      "@type": "ProfilePage",
      url: BASE_URL,
      name: "Ralph Christian Gabriel · Portfolio",
      isPartOf: { "@id": websiteId },
      about: { "@id": personId },
      mainEntity: { "@id": personId },
    },
  ],
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} ${instrumentSerif.variable} font-sans antialiased`}
      >
        <Providers>
          <NextIntlClientProvider>
            <PlainModeProvider>
            <Boot />
            <ScrollProgress />
            <Header />
            <SideRail />
            <main id="main" className="min-h-screen">{children}</main>
            <Footer />
            <ScrollToTop />
            <Terminal />
            <CustomCursor />
            </PlainModeProvider>
          </NextIntlClientProvider>
        </Providers>
        {process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN && (
          <Script
            defer
            data-domain={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN}
            src="https://plausible.io/js/script.js"
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
