---
name: flotte-eval
description: Évalue la flotte elle-même — note les rapports rendus contre les six rubriques, mesure l'exactitude des ancres, et dit quel agent doit être amélioré. À utiliser après plusieurs missions, ou pour vérifier qu'un changement de prompt a servi à quelque chose.
argument-hint: [agent à évaluer, ou vide pour toute la flotte]
allowed-tools: Read, Grep, Glob, Bash(node scripts/fleet/*), Bash(git *)
---

# Évaluation de la flotte — cible : **$ARGUMENTS**

Tu mesures un instrument de mesure. La seule chose qui rend cet exercice utile,
c'est ton refus de noter ce que tu ne peux pas établir.

## 1. Rassembler la matière

- Trajectoires : `.claude/fleet/journal/runs.jsonl`
- Couverture déclarée : `.claude/fleet/journal/couverture.jsonl`
- Rapports de mission : `.claude/fleet/journal/missions/`
- Grilles : `.claude/fleet/evals/<agent>.json`

## 2. Le contrôle d'exactitude — d'abord, et il est éliminatoire

Pour chaque agent, prends **5 ancres au hasard** dans ses rapports et vérifie-les
une par une :

| Type | Comment vérifier |
|---|---|
| `CODE` | Ouvrir le fichier à la ligne. Le contenu correspond-il ? |
| `SORTIE` | La commande existe-t-elle ? La relancer donne-t-elle ce texte ? |
| `CAPTURE` | Le fichier existe-t-il ? Montre-t-il ce qui est décrit ? |
| `SOURCE` | L'URL répond-elle ? La date est-elle présente ? |
| `DOC` | La section citée existe-t-elle et dit-elle cela ? |

**Une ancre fausse annule le rapport entier** (rubrique R3). Une ancre fausse est
pire qu'un constat manqué : elle détruit la raison d'être de la flotte.

## 3. Noter — un passage par critère

Ne note jamais plusieurs critères d'un coup : les scores se contaminent.
Barème : `1,0–0,8` excellent · `0,7–0,5` adéquat · `< 0,5` insuffisant.
Chaque note porte **la citation** qui la justifie ; une note sans citation vaut
zéro et se rapporte comme non notée.

Les six rubriques sont dans `.claude/fleet/registry.json → rubriques` :
**R1** ancrage · **R2** honnêteté de couverture · **R3** exactitude *(éliminatoire)*
· **R4** priorisation · **R5** actionnabilité · **R6** économie.

## 4. La règle d'honnêteté sur l'agrégation

Le registre fixe `policy.evalAggregationThreshold` (**50 cas**).

> **Sous ce seuil, aucun score agrégé n'est publié.** Écris
> `ancrage — non agrégeable (<n>/50)` et rends les notes par critère.

Un score moyen sur douze cas se lit comme une mesure alors qu'il n'en est pas
une. C'est exactement la fausse métrique que ce dépôt interdit partout ailleurs.

## 5. Chercher les faux négatifs

Le plus coûteux des échecs est invisible : l'agent n'a rien trouvé alors que le
défaut existait. Deux façons de le débusquer :

- **Recoupement** : un défaut trouvé par l'agent A dans une zone que l'agent B
  déclarait « rien à signaler » est un faux négatif de B. Compte-les.
- **Couverture déclarée vs réelle** : l'agent a-t-il examiné ce qu'il dit avoir
  examiné ? Le journal des outils le dit.

## 6. Rendre

```
# Évaluation — <agent | flotte> · <n> cas
Statut : ancrage — non agrégeable (<n>/50) | agrégeable

## Contrôle d'exactitude (R3, éliminatoire)
| Agent | Ancres vérifiées | Fausses | Verdict |

## Notes par rubrique
| Agent | R1 | R2 | R4 | R5 | R6 | Citation la plus parlante |

## Faux négatifs détectés
| Zone | Manqué par | Trouvé par | Gravité |

## Trajectoires
| Agent | Tours médians | Outils par tour | Détours notables |

## Biais de cette évaluation
<au moins un, nommé>

## Une chose à changer par agent
| Agent | Le changement qui aurait le plus d'effet |
```

Puis passe les conclusions à `forgeron-de-prompts` — c'est lui qui réécrit, pas toi.
