---
name: flotte-boucle
description: Boucle d'amélioration continue sur un département — pré-analyse, analyse, comparatif avec l'état de l'art, implémentation, test, re-vérification, puis liste de validation humaine. À utiliser pour améliorer réellement une partie de DPM Elevate, pas seulement l'auditer.
argument-hint: <département : design | mobile | fonctionnel | code | seo | accessibilite | donnees> [+ périmètre]
allowed-tools: Read, Grep, Glob, Bash(node scripts/fleet/*), Bash(git *), Bash(pnpm *), Bash(node prototype/build.mjs)
---

# Boucle d'amélioration — département : **$ARGUMENTS**

L'audit constate. La boucle **change quelque chose**, le prouve, et s'arrête sur
une décision humaine. Un tour complet, puis on rend la main : une boucle qui
tourne sans reprendre l'avis de l'humain finit par optimiser la mauvaise chose.

---

## Les six temps d'un tour

```
1. PRÉ-ANALYSE   Que sait-on déjà ? (docs, journal, audits antérieurs)
2. ANALYSE       Que se passe-t-il réellement ? (ouvrir, mesurer, ancrer)
3. COMPARATIF    Que font les meilleurs, et qu'est-ce qui est transposable ?
4. IMPLÉMENTATION Le plus petit changement qui règle le constat le plus grave
5. TEST          Portes exécutées + test qui rejoue le défaut
6. RE-VÉRIFICATION La même mesure qu'au temps 2 — l'écart est la preuve
```

Puis : `guide-validation` produit la liste que l'humain suivra en cinq minutes.

---

## L'équipage par département

| Département | 1-2 Analyse | 3 Comparatif | 4 Implémentation | 5 Test |
|---|---|---|---|---|
| **design** | `pilote-visuel` · `inspecteur-design` | `veilleur-design` | `implementeur` | `ingenieur-tests` |
| **mobile** | `pilote-visuel` · `parite-mobile` | `veilleur-design` | `implementeur` | `ingenieur-tests` |
| **fonctionnel** | `pilote-visuel` · `relecteur-code` | — | `implementeur` | `ingenieur-tests` |
| **code** | `artisan-code` · `architecte` | — | `implementeur` | `ingenieur-tests` |
| **seo** | `strategie-seo-marketing` · `verificateur-i18n` | `strategie-seo-marketing` | `implementeur` | `ingenieur-tests` |
| **accessibilite** | `gardien-accessibilite` · `pilote-visuel` | — | `implementeur` | `ingenieur-tests` |
| **donnees** | `gardien-donnees` · `sentinelle-securite` | — | `implementeur` | `ingenieur-tests` |

`implementeur` est **toujours seul** à écrire. C'est la règle qui empêche les
agents de se marcher dessus : un seul a la main, les autres constatent.

---

## Temps 1 — Pré-analyse

- Lis les rapports antérieurs : `.claude/fleet/journal/missions/`, les audits du
  dépôt (`AUDIT_10SUR10_*.md`, `LANDING_AUDIT.md`, matrices d'implémentation).
- **Ne redécouvre pas ce qui est déjà écrit et daté.** Si un constat existe déjà,
  cite-le et passe au temps 2.
- Note la base : `git rev-parse HEAD`.

## Temps 2 — Analyse

Lance les agents d'analyse **en parallèle**. Pour les départements visuels,
l'inspection réelle est obligatoire :

```bash
node prototype/build.mjs && node scripts/e2e-serve.mjs &
node scripts/fleet/inspecter-ecrans.mjs --viewport tous
```

**Garde le chemin du rapport** : c'est la mesure de référence du temps 6.

## Temps 3 — Comparatif

`veilleur-design` (ou `strategie-seo-marketing` pour le SEO) rend 3 à 6
références sourcées et datées. Chacune doit dire ce qui est **transposable ici**,
et ce qui heurte une contrainte du dépôt. Une tendance sans tâche utilisateur
améliorée est écartée.

## Temps 4 — Implémentation

Choisis **un seul** constat : le plus haut en priorité parmi ceux dont le
correctif est petit et sûr. Passe-le à `implementeur` avec les trois éléments
exigés : le défaut, **son ancre**, le correctif proposé. Sans les trois, il
refusera — et il aura raison.

Annonce la zone d'écriture. Aucun autre agent écrivain ne démarre pendant ce temps.

## Temps 5 — Test

`ingenieur-tests` écrit le test qui rejoue le défaut : rouge d'abord, vert
ensuite. Puis les portes du département :

```
lint · typecheck · tests unitaires · tests prototype · build (si UI) · e2e (si parcours)
```

## Temps 6 — Re-vérification

Relance **exactement** la mesure du temps 2 et compare les deux `rapport.json`.
L'écart chiffré est la preuve — pas l'intention de l'implémenteur.

```
Avant : <compteur> = <n>     Après : <compteur> = <m>     Écart : <m − n>
```

Si l'écart est nul ou négatif, **le tour a échoué**. Dis-le, ne le maquille pas,
et propose ce qu'il faudrait faire autrement.

---

## Fin de tour — ce que tu rends

```
# Boucle <département> — tour <n>

## Point de départ (temps 1-2)
Mesure : <chemin rapport.json> · <compteurs clés>
Constats retenus : <les 3 premiers, ancrés>

## Comparatif (temps 3)
| Référence | Source (URL, date) | Transposable | Contrainte heurtée |

## Changé (temps 4)
### Modifications
| Fichier | Lignes | Intention | Comment le défaire |
Avant / Après / Porte / Risque

## Prouvé (temps 5-6)
| Porte | Résultat |
| Compteur | Avant | Après | Écart |

## À valider par toi — <n> étapes, ~<n> min
<sortie de guide-validation>

## Reste ouvert
<ce que ce tour n'a pas traité, classé P0…P9>

## Tour suivant
/flotte-boucle <département> — <ce sur quoi il porterait>
```

---

## Règles d'arrêt

Le tour s'arrête et rend la main **immédiatement** si :

- une porte casse **hors** de la zone d'écriture ;
- l'écart du temps 6 est nul ou négatif ;
- le constat le plus grave est de priorité P0 à P2 (correction temporelle, perte
  silencieuse, isolation inter-locataires) : ceux-là ne se corrigent pas dans une
  boucle d'amélioration, ils déclenchent une mission dédiée ;
- l'implémenteur signale `ENTRÉE INSUFFISANTE`.

**Un tour, puis l'humain.** Ne lance pas le tour suivant de ta propre initiative.
