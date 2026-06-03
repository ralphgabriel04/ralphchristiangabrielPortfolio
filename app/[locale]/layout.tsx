import type { Metadata } from "next";
import Script from "next/script";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Providers } from "@/components/providers";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { routing } from "@/i18n/routing";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SideRail } from "@/components/ui/side-rail";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import "@/app/globals.css";

const BASE_URL = "https://ralphgabriel.dev";

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
        ? "Ralph Christian Gabriel · Développeur Full-Stack"
        : "Ralph Christian Gabriel · Full-Stack Developer",
      template: "%s | Ralph Gabriel",
    },
    description: isFr
      ? "Développeur Full-Stack bilingue FR/EN. ~15 000 LOC en production, 30+ endpoints API, 2 000+ tickets résolus (94% sat.). Montréal."
      : "Bilingual FR/EN Full-Stack Developer. ~15,000 LOC in production, 30+ API endpoints, 2,000+ tickets resolved (94% sat.). Montréal.",
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical: `${BASE_URL}/${locale}`,
      languages: { fr: `${BASE_URL}/fr`, en: `${BASE_URL}/en` },
    },
    openGraph: {
      type: "website",
      locale: isFr ? "fr_CA" : "en_CA",
      url: `${BASE_URL}/${locale}`,
      siteName: "Ralph Gabriel",
      title: isFr
        ? "Ralph Christian Gabriel · Développeur Full-Stack"
        : "Ralph Christian Gabriel · Full-Stack Developer",
      description: isFr
        ? "Développeur Full-Stack bilingue. ~15 000 LOC en production, 30+ endpoints API. Montréal."
        : "Bilingual Full-Stack Developer. ~15,000 LOC in production, 30+ API endpoints. Montréal.",
    },
    twitter: {
      card: "summary_large_image",
      title: "Ralph Christian Gabriel",
      description: isFr
        ? "Développeur Full-Stack · Montréal"
        : "Full-Stack Developer · Montréal",
    },
    robots: { index: true, follow: true },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Ralph Christian Gabriel",
  jobTitle: "Full-Stack Developer",
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
  worksFor: { "@type": "Organization", name: "The Mad Space" },
  knowsLanguage: ["fr", "en"],
  sameAs: [
    "https://github.com/ralphgabriel04",
    "https://linkedin.com/in/ralph-christian-gabriel-45092021b",
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased`}
      >
        <Providers>
          <NextIntlClientProvider>
            <Header />
            <SideRail />
            <main id="main" className="min-h-screen">{children}</main>
            <Footer />
            <ScrollToTop />
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
