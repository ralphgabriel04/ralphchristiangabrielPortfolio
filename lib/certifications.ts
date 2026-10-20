/**
 * Certifications: single source of truth (experience page + home "Parcours" chips).
 *
 * Images (generated 2026-10-16 from the official verification pages):
 *  - card: 2000x1250 transparent PNG, certificate centred at a fixed height with a
 *          soft warm shadow, so every card has the same rhythm in light and dark mode.
 *  - full: full-resolution certificate (opened in a new tab on click).
 *
 * Titles stay in English: they are the official names printed on each certificate.
 * Dates are the issue dates printed on each certificate (America/Toronto).
 */
export type Certification = {
  slug: string;
  title: string;
  issuer: "freeCodeCamp" | "Codecademy";
  /** ISO date (YYYY-MM-DD) printed on the certificate */
  issued: string;
  /** Verification code printed on the certificate, if any */
  credentialId?: string;
  /** Public page where anyone can verify the certificate */
  verifyUrl: string;
  /** Uniform card visual (transparent PNG 2000x1250) */
  card: string;
  /** Full-resolution certificate */
  full: string;
  /** Workload stated on the certificate, if any */
  hours?: number;
  tags: string[];
};

const CC_PROFILE = "https://www.codecademy.com/profiles/DopmanProgramming/certificates";

export const certifications: Certification[] = [
  {
    slug: "freecodecamp-responsive-web-design",
    title: "Responsive Web Design",
    issuer: "freeCodeCamp",
    issued: "2025-03-27",
    verifyUrl:
      "https://www.freecodecamp.org/certification/fccd43dd6b4-811a-41a2-a13f-f276ec396f64/responsive-web-design",
    card: "/images/certs/cards/freecodecamp-responsive-web-design.png",
    full: "/images/certs/hd/freecodecamp-responsive-web-design.jpg",
    hours: 300,
    tags: ["HTML", "CSS"],
  },
  {
    slug: "codecademy-intro-to-llms",
    title: "Intro to Large Language Models (LLMs)",
    issuer: "Codecademy",
    issued: "2024-05-24",
    credentialId: "22EA5DAB-A",
    verifyUrl: `${CC_PROFILE}/1fb2fea548cf4c5f937545d9872a0c07`,
    card: "/images/certs/cards/codecademy-intro-to-llms.png",
    full: "/images/certs/hd/codecademy-intro-to-llms.png",
    tags: ["GenAI", "LLM"],
  },
  {
    slug: "codecademy-intro-to-ai-strategy",
    title: "Intro to AI Strategy",
    issuer: "Codecademy",
    issued: "2024-04-25",
    credentialId: "8281D9DA-7",
    verifyUrl: `${CC_PROFILE}/d6f9857857814649999f444381c75035`,
    card: "/images/certs/cards/codecademy-intro-to-ai-strategy.png",
    full: "/images/certs/hd/codecademy-intro-to-ai-strategy.png",
    tags: ["GenAI"],
  },
  {
    slug: "codecademy-learn-how-to-use-chatgpt",
    title: "Learn How to Use ChatGPT",
    issuer: "Codecademy",
    issued: "2024-04-25",
    credentialId: "6A0BF7A2-4",
    verifyUrl: `${CC_PROFILE}/ef9a06323b7d44b091a3ec7816092dc6`,
    card: "/images/certs/cards/codecademy-learn-how-to-use-chatgpt.png",
    full: "/images/certs/hd/codecademy-learn-how-to-use-chatgpt.png",
    tags: ["GenAI", "Prompting"],
  },
  {
    slug: "codecademy-learn-python-3",
    title: "Learn Python 3",
    issuer: "Codecademy",
    issued: "2024-03-06",
    credentialId: "ECF77C74-6",
    verifyUrl: `${CC_PROFILE}/6c152bd262967f8c941c9707ed636bda`,
    card: "/images/certs/cards/codecademy-learn-python-3.png",
    full: "/images/certs/hd/codecademy-learn-python-3.png",
    tags: ["Python"],
  },
  {
    slug: "codecademy-learn-html",
    title: "Learn HTML",
    issuer: "Codecademy",
    issued: "2024-01-10",
    credentialId: "93A2F5D4-2",
    verifyUrl: `${CC_PROFILE}/9eb0741e5ebef1f9f58a53bfac67d3a7`,
    card: "/images/certs/cards/codecademy-learn-html.png",
    full: "/images/certs/hd/codecademy-learn-html.png",
    tags: ["HTML"],
  },
];

/** "mars 2025" / "Mar 2025" */
export function formatCertDate(iso: string, locale: string): string {
  return new Intl.DateTimeFormat(locale === "fr" ? "fr-CA" : "en-CA", {
    month: "short",
    year: "numeric",
    timeZone: "America/Toronto",
  }).format(new Date(`${iso}T12:00:00-04:00`));
}
