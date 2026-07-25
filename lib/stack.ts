/** Stack groups + "used in" context per tech, mirroring the v2 Stack section. */
export interface StackGroup {
  name: { fr: string; en: string };
  items: string[];
}

export const stackGroups: StackGroup[] = [
  { name: { fr: "Frontend", en: "Frontend" }, items: ["TypeScript", "React", "Next.js", "Tailwind CSS", "React Native"] },
  { name: { fr: "Backend & données", en: "Backend & data" }, items: ["Node.js", "Spring Boot", "PostgreSQL", "Prisma", "Supabase"] },
  { name: { fr: "Qualité & livraison", en: "Quality & delivery" }, items: ["TDD", "JUnit", "Jest", "GitHub Actions", "Vercel"] },
  { name: { fr: "Intégrations", en: "Integrations" }, items: ["Stripe", "OAuth 2.0", "Gelato", "Google APIs"] },
];

/** Hover/focus tooltip: where each tech was actually used. */
export const usedIn: Record<string, { fr: string; en: string }> = {
  "TypeScript": { fr: "The Mad Space · Cadence", en: "The Mad Space · Cadence" },
  "React": { fr: "The Mad Space · Wise & Wealthy", en: "The Mad Space · Wise & Wealthy" },
  "Next.js": { fr: "The Mad Space · W&W · ce portfolio", en: "The Mad Space · W&W · this portfolio" },
  "Tailwind CSS": { fr: "The Mad Space · ce portfolio", en: "The Mad Space · this portfolio" },
  "React Native": { fr: "Cadence (Expo)", en: "Cadence (Expo)" },
  "Node.js": { fr: "The Mad Space (API)", en: "The Mad Space (API)" },
  "Spring Boot": { fr: "Fastercom (TMS)", en: "Fastercom (TMS)" },
  "PostgreSQL": { fr: "The Mad Space", en: "The Mad Space" },
  "Prisma": { fr: "The Mad Space", en: "The Mad Space" },
  "Supabase": { fr: "Cadence · Edge Functions", en: "Cadence · Edge Functions" },
  "TDD": { fr: "FinanceJ (133 tests)", en: "FinanceJ (133 tests)" },
  "JUnit": { fr: "FinanceJ", en: "FinanceJ" },
  "Jest": { fr: "The Mad Space", en: "The Mad Space" },
  "GitHub Actions": { fr: "CI des projets", en: "Projects CI" },
  "Vercel": { fr: "Déploiements", en: "Deployments" },
  "Stripe": { fr: "The Mad Space (webhooks HMAC)", en: "The Mad Space (HMAC webhooks)" },
  "OAuth 2.0": { fr: "The Mad Space (Google)", en: "The Mad Space (Google)" },
  "Gelato": { fr: "The Mad Space (fulfillment)", en: "The Mad Space (fulfillment)" },
  "Google APIs": { fr: "Fastercom · The Mad Space", en: "Fastercom · The Mad Space" },
};
