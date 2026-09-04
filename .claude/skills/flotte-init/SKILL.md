---
name: flotte-init
description: Crée la flotte d'agents pour un projet — reconnaît ce que le dépôt est, propose les départements, engendre les agents adaptés, puis les ancre dans la doctrine réelle. À utiliser pour « crée les agents pour ce projet » ou pour rafraîchir une flotte après un changement de stack.
argument-hint: [chemin du projet, ou vide pour le dépôt courant]
allowed-tools: Read, Grep, Glob, Bash(node scripts/fleet/*), Bash(git status*), Bash(git rev-parse*), Bash(ls *), Bash(claude plugin validate *)
---

# Création d'une flotte pour **$ARGUMENTS**

Sans argument : le dépôt courant.

Ta tâche n'est pas de lancer deux scripts. Les scripts font la partie mécanique ;
**toi, tu fais le jugement** — quels départements ce projet mérite vraiment, quelle
est sa doctrine, ce qui prime quand deux constats se contredisent.

---

## 1. Reconnaître — jamais supposer

```bash
node scripts/fleet/reconnaitre-projet.mjs --racine <projet>
```

Le script établit : identité, langue de travail, pile, **portes réellement
existantes**, CI, départements avec leur preuve, doctrine, comment lancer
l'application. Il écrit `.claude/fleet/projet.json`.

**Lis sa section `incertitudes` en premier.** Elle liste ce qu'il n'a pas pu
établir. C'est exactement ce que tu dois trancher avant d'engendrer quoi que ce
soit — un agent bâti sur une supposition produira des rapports bâtis sur une
supposition.

Complète ensuite ce que le script ne peut pas voir :

- Lis le README, la doctrine découverte, et 20 à 40 messages de commit récents.
  **Le vocabulaire du dépôt et ses interdits vivent là**, pas dans le code.
- Repère les règles maison : ce que l'équipe refuse, ce qu'elle a déjà corrigé
  deux fois, ce qu'un garde CI protège. Ce sont les meilleures contraintes à
  mettre dans les prompts.

## 2. Proposer — et laisser trancher

Montre ce tableau **avant** d'engendrer :

```
Projet     : <nom> · <langue> · <pile>
Portes     : <n> découvertes — <liste>
Départements retenus  : <liste>  (preuve forte)
Départements proposés : <liste>  (preuve faible — à confirmer)
Départements écartés  : <liste>  (aucune trace)
Agents à engendrer    : <n>
Non établi            : <les incertitudes, une par ligne>
```

Utilise `AskUserQuestion` pour les deux décisions que le script ne peut pas
prendre :

1. **Les départements à preuve faible** — les garder ou non.
2. **L'ordre des priorités** — c'est le propriétaire qui décide ce qui prime dans
   *son* produit. L'ordre générique proposé n'est qu'un point de départ.

## 3. Engendrer

```bash
node scripts/fleet/generer-flotte.mjs --racine <projet> [--inclure dep1,dep2] [--sec]
```

`--sec` montre le plan sans rien écrire — commence toujours par là.

Le générateur **n'écrase jamais** un agent existant sans `--force`, et reconnaît
les équivalents sous un autre nom : sur un dépôt qui a déjà une flotte affinée,
la régénération complète, elle ne remplace pas.

## 4. Ancrer — c'est ici que la flotte devient utile

Les agents engendrés sont une **base**. Un prompt générique rend des rapports
génériques. Passe `forgeron-de-prompts` sur les agents des départements qui
comptent le plus dans ce projet, avec ce que tu as appris à l'étape 1 :

- les interdits maison, formulés comme des interdits ;
- les pièges déjà rencontrés (« cette porte ne voit que la surface X ») ;
- les documents qui font autorité, et ceux qu'il ne faut **pas** citer ;
- l'ordre de priorité retenu à l'étape 2.

Un seul agent bien ancré vaut mieux que dix génériques. Commence par les trois
départements où l'erreur coûte le plus cher dans **ce** projet.

## 5. Vérifier — et prouver que le garde mord

```bash
node scripts/fleet/verify-fleet.mjs      # doit sortir en 0
claude plugin validate .claude/agents/   # le validateur officiel du harnais
```

Puis un **contrôle négatif** : casse volontairement la flotte (donne `Write` à un
agent de lecture), relance le garde, exige qu'il échoue, remets en état. Un garde
qui ne rougit jamais ne prouve rien.

## 6. Rendre

```
## Flotte créée pour <projet>
Agents : <n> en <n> escouades — <n> en lecture, <n> en écriture
Départements : retenus <…> · proposés <…> · écartés <…>
Portes réutilisées : <liste>          ← aucune inventée
Garde : node scripts/fleet/verify-fleet.mjs → <sortie>
Contrôle négatif : <la violation qu'il a levée>
Ancrés à la main : <agents affinés, et pourquoi ceux-là>

## Non établi
<ce qui reste supposé, et ce qu'il faudrait pour trancher>

## Pour s'en servir
/flotte-audit · /flotte visuel · /flotte-boucle <département> · /flotte valider
```

---

## Comment cette skill se déclenche

| Déclencheur | Exemple |
|---|---|
| **Commande** | `/flotte-init` · `/flotte-init ../autre-projet` |
| **Génératif** | « crée les agents pour ce projet », « installe la flotte ici », « adapte les agents à ce dépôt » |
| **Rafraîchissement** | après un changement de pile, l'ajout d'un département (i18n, base de données), ou l'arrivée d'un garde CI |

## Interdits

- **Ne jamais engendrer un département sans preuve** dans le dépôt. Un agent qui
  n'a rien à regarder ne trouve rien, et fait perdre du temps à chaque mission.
- **Ne jamais inventer une porte.** Le registre ne contient que des commandes qui
  existent et qui passent. Une porte inventée n'est jamais exécutée.
- **Ne jamais écraser une flotte affinée** sans le dire et sans `--force` explicite.
- Ne pas conclure « flotte prête » sans la sortie réelle du garde **et** du
  contrôle négatif.
