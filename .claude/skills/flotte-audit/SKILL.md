---
name: flotte-audit
description: Balayage complet de DPM Elevate par la flotte — visuel, design, accessibilité, mobile, architecture, code, sécurité, données, conformité, i18n, performance, acquisition. Rend un état des lieux priorisé et ancré. À utiliser pour « regarde toute mon application et dis-moi ce qui ne va pas ».
argument-hint: [périmètre optionnel : ecran <nom> | paquet <nom> | tout]
allowed-tools: Read, Grep, Glob, Bash(node scripts/fleet/*), Bash(git *)
---

# Balayage complet

Périmètre : **$ARGUMENTS** (vide = tout le produit servi)

Lis `.claude/fleet/registry.json`, puis exécute **trois vagues**. Jamais plus de
5 agents par vague : la limite existe parce qu'un contexte partagé entre douze
rapports simultanés produit une synthèse plus pauvre, pas plus riche.

## Vague 0 — le réel, avant toute lecture de code

Un audit qui commence par le code découvre ce que le code dit, pas ce que
l'utilisateur voit. On commence donc par ouvrir l'application.

```bash
node prototype/build.mjs && node scripts/e2e-serve.mjs &
node scripts/fleet/inspecter-ecrans.mjs --viewport tous
```

Le rapport produit sous `.claude/fleet/captures/<horodatage>/` est l'ancre
commune des vagues suivantes : transmets son chemin à chaque agent.

## Vague 1 — ce que voit l'utilisateur (parallèle, 5)

`pilote-visuel` · `parite-mobile` · `gardien-accessibilite` · `inspecteur-design` · `verificateur-i18n`

Chacun reçoit : le périmètre, le chemin du rapport d'inspection, et **ce que les
autres couvrent déjà**. Sans cette dernière ligne, tu recevras quatre fois le
même constat de contraste.

## Vague 2 — ce qui tient l'application (parallèle, 4)

`architecte` · `relecteur-code` · `sentinelle-securite` · `gardien-donnees`

## Vague 3 — ce qui l'entoure (parallèle, 4)

`conformite-loi25` · `mesureur-performance` · `strategie-produit` · `strategie-seo-marketing`

## Synthèse

1. **Dédoublonne.** Un même défaut vu par trois agents est **un** constat, avec
   trois ancres. Le rapporter trois fois fait perdre les deux qui comptent.
2. **Priorise P0 → P9.** Le rapport final ne dépasse pas **15 constats**. Le reste
   se résume en une ligne agrégée par catégorie.
3. **Contrôle 5 ancres au hasard.** Une seule fausse et le rapport de l'agent
   concerné est écarté (rubrique R3, éliminatoire) — dis-le.
4. **Déclare la couverture globale** : écrans inspectés, paquets lus, ce qui n'a
   pas été regardé, et pourquoi.

## Rendu

```
# État des lieux — <date>
Verdict en une phrase : …

## Les 5 choses à corriger d'abord
| # | P | Constat | Ancre | Effort | À qui |

## Tous les constats
| P | Domaine | Constat | Ancre | Agent |

## Agrégé (hors des 15)
| Catégorie | Nombre | Exemple |

## Contrôle d'ancres
## Couverture globale
Écrans inspectés : … / Non examiné : … / Angles morts : … / Confiance : …

## Ce que je propose comme prochaine mission
<une seule, avec la commande /flotte …>
```

**Ne corrige rien pendant l'audit.** Un audit qui modifie ce qu'il mesure ne
mesure plus rien. Les correctifs partent en missions séparées, via `/flotte-boucle`.
