---
name: flotte-nuit
description: Exécute UNE unité du chantier, du bout en bout et de manière prouvée, puis s'arrête. Conçue pour être rappelée en boucle ou sur horaire — chaque passage reprend là où le précédent s'est arrêté. À utiliser pour faire avancer le travail sans surveillance.
argument-hint: [département ou topic pour cibler, sinon la priorité du chantier décide]
allowed-tools: Read, Grep, Glob, Bash(node scripts/fleet/*), Bash(git status*), Bash(git diff*), Bash(git log*), Bash(git rev-parse*), Bash(git add*)
---

# Passage de nuit — **$ARGUMENTS**

Tu exécutes **une seule** unité de travail, complètement, puis tu t'arrêtes.

## Pourquoi une seule

Ce passage peut être interrompu à tout moment : plafond d'usage atteint, fenêtre
de contexte pleine, machine qui dort, session fermée. La robustesse ne vient pas
de deviner quand tu pourras reprendre — elle vient de **rendre l'interruption
sans conséquence**. L'état vit dans `.claude/fleet/chantier.json` ; le passage
suivant reprend exactement là où celui-ci s'est arrêté, sans rien savoir de lui.

Une unité petite et close vaut mieux que trois à moitié faites.

---

## 1. Prendre l'unité

```bash
node scripts/fleet/chantier.mjs suivant
```

| Réponse | Ce que tu fais |
|---|---|
| `rien: true, motif: "chantier-vide"` | **Tu t'arrêtes.** Écris une ligne : « chantier vide, rien fait ». **Ne commence rien de ta propre initiative** — c'est la règle qui empêche une nuit d'autonomie de partir dans une direction que personne n'a demandée. |
| `rien: true, motif: "unite-bloquee"` | L'unité a échoué trop de fois : elle demande une décision humaine. Relance `suivant` une fois pour en prendre une autre. |
| `reprise: true` | Un passage précédent a été coupé sur cette unité. **Reprends-la**, ne la recommence pas de zéro : lis d'abord `git status` et `git diff` pour voir ce qui existe déjà. |
| `rien: false` | Tu as ton unité. Continue. |

## 2. Établir avant d'agir

- Note le commit de base (`item.base`).
- Si l'unité porte une **ancre**, ouvre-la et vérifie qu'elle dit bien ce que le
  titre prétend. Une unité dont l'ancre ne tient plus se **bloque** avec cette
  raison — le dépôt a bougé depuis qu'elle a été inscrite.
- Si l'unité n'a **ni ancre ni note exploitable**, bloque-la :
  `--raison "entrée insuffisante : ni ancre ni constat"`. La règle d'entrée de
  `implementeur` vaut aussi la nuit.

## 3. Faire — au plus petit

Convoque **au plus deux agents**, et **un seul écrivain**. La nuit n'est pas le
moment des grandes manœuvres : personne n'est là pour arbitrer.

| Nature de l'unité | Équipage |
|---|---|
| Constat visuel à corriger | `pilote-visuel` (vérifie) → `implementeur` |
| Défaut de code | `relecteur-code` → `implementeur` |
| Test manquant | `ingenieur-tests` seul |
| Qualité de code | `artisan-code` → `implementeur` |
| Documentation, journal | `archiviste` seul |
| Analyse seule (aucune écriture) | l'agent du domaine, seul |

## 4. Prouver

Exécute les portes du domaine touché et **cite leurs sorties**. La règle de
`implementeur` s'applique : rouge avant, vert après, avec les deux sorties.

**Si une porte casse hors de la zone touchée : arrête-toi, remets l'unité à
faire (`relacher`), et note pourquoi.** Ne répare pas au-delà du mandat.

## 5. Clore

```bash
git add <fichiers de la zone>          # jamais `git add -A` la nuit
git commit -m "<message>"              # sujet court, corps = ce qui a été prouvé
node scripts/fleet/chantier.mjs terminer <id> --resume "<une phrase>"
```

Puis journalise la mission (`node scripts/fleet/journal.mjs mission …`).

**Tu ne pousses pas et tu n'ouvres pas de PR sans y avoir été autorisé
explicitement pour cette nuit.** Un commit local se relit ; une PR ouverte à 3 h
du matin réveille des gens.

## 6. S'arrêter

Une ligne, pas un rapport :

```
[nuit] <id> — <titre> — fait | bloqué (<raison>) | reprise nécessaire
Portes : <résultats>   Commit : <sha>   Restant au chantier : <n>
```

Le rapport complet, c'est `node scripts/fleet/rapport-nuit.mjs` au matin.

---

## Règles d'arrêt immédiat

Le passage s'arrête et rend la main, sans rien commiter, si :

- l'unité est de priorité **P0 à P2** (perte de données, cloisonnement, correction
  des valeurs) — ces défauts-là ne se corrigent pas sans témoin ;
- une porte casse **hors** de la zone touchée ;
- l'ancre de l'unité ne tient plus ;
- le correctif demanderait de toucher plus de **cinq fichiers** ;
- il faudrait une décision d'architecture, de produit ou de conformité.

Dans tous ces cas : `chantier.mjs bloquer <id> --raison "…"`. Une unité bloquée
attend un humain, et c'est le bon résultat.

---

## Comment le faire tourner sans surveillance

Trois mécanismes, avec leurs contraintes **réelles** :

| Mécanisme | Tourne sans la machine | Persiste | Intervalle mini | Limite à connaître |
|---|---|---|---|---|
| `/loop 30m /flotte-nuit` | Non | Restauré au `--resume` | 1 min | **Ne tire que si la session est ouverte et au repos.** Expire au bout de 7 jours. |
| **Routine cloud** | **Oui** | Oui | 1 heure | Part d'un clone frais : pas d'état local entre deux tirs — le chantier doit être **commité** pour survivre. |
| Tâche planifiée de bureau | Non (machine allumée) | Oui | 1 min | Accès aux fichiers locaux. |

Pour une vraie nuit sans surveillance, la **Routine cloud** est le seul mécanisme
qui ne dépend ni d'une session ouverte ni d'une machine allumée. Comme elle
repart d'un clone frais, **committe le chantier** avant de la programmer, sinon
chaque tir redémarre sur une file vide.

Aucun de ces mécanismes ne « détecte la fin d'un plafond d'usage » : un tir qui
échoue est simplement perdu, et le suivant reprend l'unité en cours. C'est
précisément pour ça que l'état vit sur le disque.
