"use client";

import { useLocale } from "next-intl";
import { usePlain } from "@/components/ui/plain-mode";

/** Scrolling marquee strip (RCG.SYS). CSS-only; pauses on hover. Two registers:
 *  technical (default) and simple (plain mode), each in FR/EN. */
const TECH_FR = [
  "Génie logiciel",
  "Analyse · Conception",
  "Architecture · Systèmes",
  "Web · Mobile",
  "Produit · Expérience utilisateur",
  "React · Next.js · TypeScript",
  "Java · Spring · API",
  "Qualité · Tests · Déploiement",
  "Collaboration · Accompagnement",
  "FR / EN · Montréal",
];

const TECH_EN = [
  "Software engineering",
  "Analysis · Design",
  "Architecture · Systems",
  "Web · Mobile",
  "Product · User experience",
  "React · Next.js · TypeScript",
  "Java · Spring · API",
  "Quality · Tests · Deployment",
  "Collaboration · Support",
  "FR / EN · Montréal",
];

const SIMPLE_FR = [
  "Passionné · Polyvalent · À l'écoute",
  "Étudiant en génie logiciel à l'ÉTS",
  "Comprendre · Concevoir · Construire",
  "Idées · Solutions concrètes",
  "Web · Mobile · Systèmes",
  "Collaboration · Disponibilité · Confiance",
  "Projets personnels · Mandats · Cofondation",
  "Apprendre · Progresser · Partager",
  "FR / EN · Montréal",
];

const SIMPLE_EN = [
  "Passionate · Versatile · A good listener",
  "Software engineering student at ÉTS",
  "Understand · Design · Build",
  "Ideas · Concrete solutions",
  "Web · Mobile · Systems",
  "Collaboration · Availability · Trust",
  "Personal projects · Client work · Co-founding",
  "Learn · Grow · Share",
  "FR / EN · Montréal",
];

function Strip({ items }: { items: string[] }) {
  return (
    <div className="flex items-center gap-6 pr-6">
      {items.map((it, i) => (
        <span
          key={i}
          className="flex items-center gap-6 whitespace-nowrap font-mono text-[12.5px] uppercase tracking-[0.12em] text-muted-foreground/70"
        >
          {it}
          <span className="inline-block text-accent motion-safe:animate-[rg-spin-slow_7s_linear_infinite]">
            ✳
          </span>
        </span>
      ))}
    </div>
  );
}

export function Marquee() {
  const fr = useLocale() === "fr";
  const { plain } = usePlain();
  const items = plain ? (fr ? SIMPLE_FR : SIMPLE_EN) : fr ? TECH_FR : TECH_EN;

  return (
    <div className="group overflow-hidden border-y border-border-color bg-muted/40 py-3.5 print:hidden">
      <div className="flex w-max motion-safe:animate-[rg-mq_32s_linear_infinite] group-hover:[animation-play-state:paused]">
        <Strip items={items} />
        <Strip items={items} />
      </div>
    </div>
  );
}
