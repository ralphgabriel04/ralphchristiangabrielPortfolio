/** Stack groups + "used in" context per tech, mirroring the v2 Stack section. */
export interface StackGroup {
  name: { fr: string; en: string };
  items: string[];
}

export const stackGroups: StackGroup[] = [
  { name: { fr: "Frontend & mobile", en: "Frontend & mobile" }, items: ["TypeScript", "React", "Next.js", "React Native", "Tailwind CSS"] },
  { name: { fr: "Backend & données", en: "Backend & data" }, items: ["Node.js", "tRPC", "Python", "Spring Boot", "PostgreSQL", "Prisma", "Supabase"] },
  { name: { fr: "Architecture & qualité", en: "Architecture & quality" }, items: ["Docker", "Microservices", "TDD", "Jest", "JUnit", "GitHub Actions", "Vercel"] },
  { name: { fr: "Sécurité & intégrations", en: "Security & integrations" }, items: ["Stripe", "OAuth 2.0", "AES-256", "Loi 25", "Google APIs", "Gelato"] },
];

/** Hover/focus tooltip: where each tech was actually used. */
export const usedIn: Record<string, { fr: string; en: string }> = {
  "TypeScript": { fr: "The Mad Space · Cadence · DPM Elevate", en: "The Mad Space · Cadence · DPM Elevate" },
  "React": { fr: "The Mad Space · Wise & Wealthy", en: "The Mad Space · Wise & Wealthy" },
  "Next.js": { fr: "The Mad Space · DPM Elevate · ce portfolio", en: "The Mad Space · DPM Elevate · this portfolio" },
  "React Native": { fr: "Cadence (Expo)", en: "Cadence (Expo)" },
  "Tailwind CSS": { fr: "The Mad Space · DPM · ce portfolio", en: "The Mad Space · DPM · this portfolio" },
  "Node.js": { fr: "The Mad Space (API)", en: "The Mad Space (API)" },
  "tRPC": { fr: "DPM Elevate (API type-safe)", en: "DPM Elevate (type-safe API)" },
  "Python": { fr: "LOG430 (Flask / FastAPI)", en: "LOG430 (Flask / FastAPI)" },
  "Spring Boot": { fr: "Fastercom (TMS)", en: "Fastercom (TMS)" },
  "PostgreSQL": { fr: "The Mad Space · DPM · LOG430", en: "The Mad Space · DPM · LOG430" },
  "Prisma": { fr: "The Mad Space · DPM Elevate", en: "The Mad Space · DPM Elevate" },
  "Supabase": { fr: "Cadence · DPM · Edge Functions", en: "Cadence · DPM · Edge Functions" },
  "Docker": { fr: "LOG430 (microservices)", en: "LOG430 (microservices)" },
  "Microservices": { fr: "LOG430 · CanTelcoX (5 services DDD)", en: "LOG430 · CanTelcoX (5 DDD services)" },
  "TDD": { fr: "FinanceJ (133 tests)", en: "FinanceJ (133 tests)" },
  "Jest": { fr: "The Mad Space · LOG210", en: "The Mad Space · LOG210" },
  "JUnit": { fr: "FinanceJ (100% couverture)", en: "FinanceJ (100% coverage)" },
  "GitHub Actions": { fr: "Cadence · CI des projets", en: "Cadence · projects CI" },
  "Vercel": { fr: "Déploiements", en: "Deployments" },
  "Stripe": { fr: "The Mad Space (webhooks HMAC)", en: "The Mad Space (HMAC webhooks)" },
  "OAuth 2.0": { fr: "DPM Elevate · The Mad Space", en: "DPM Elevate · The Mad Space" },
  "AES-256": { fr: "DPM Elevate (jetons chiffrés au repos)", en: "DPM Elevate (tokens encrypted at rest)" },
  "Loi 25": { fr: "DPM Elevate (export / suppression)", en: "DPM Elevate (export / deletion)" },
  "Google APIs": { fr: "Fastercom · The Mad Space", en: "Fastercom · The Mad Space" },
  "Gelato": { fr: "The Mad Space (fulfillment)", en: "The Mad Space (fulfillment)" },
};
