import type { MetadataRoute } from "next";

const BASE_URL = "https://ralphgabriel.dev";

const projects = [
  "the-mad-space",
  "cadence",
  "fastercom-tms",
  "dpm-elevate",
  "financej",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = ["fr", "en"];
  const pages = ["", "/about", "/experience", "/contact", "/projects"];

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const page of pages) {
      entries.push({
        url: `${BASE_URL}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: page === "" ? "weekly" : "monthly",
        priority: page === "" ? 1.0 : 0.8,
        alternates: {
          languages: {
            fr: `${BASE_URL}/fr${page}`,
            en: `${BASE_URL}/en${page}`,
          },
        },
      });
    }

    for (const slug of projects) {
      entries.push({
        url: `${BASE_URL}/${locale}/projects/${slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
        alternates: {
          languages: {
            fr: `${BASE_URL}/fr/projects/${slug}`,
            en: `${BASE_URL}/en/projects/${slug}`,
          },
        },
      });
    }
  }

  return entries;
}
