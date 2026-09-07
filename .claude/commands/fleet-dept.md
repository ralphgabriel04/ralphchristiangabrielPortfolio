---
description: Audit approfondi d'un seul département de la Fleet (a11y, perf, securite, parcours…), puis correctifs prouvés des constats trouvés.
argument-hint: "<departement> [--audit-seul]"
---

Département visé : **$1**

1. Situe-toi :
   ```bash
   node .claude/fleet/fleet.mjs recon
   node .claude/fleet/fleet.mjs departements
   node .claude/fleet/fleet.mjs mission $1
   ```
   Si `$1` n'est pas un département connu, affiche la liste et demande lequel.
   S'il est hors périmètre pour ce dépôt, dis pourquoi avant de continuer.

2. Lance le sous-agent `dept-$1` — ou, si les agents du dépôt ne sont pas chargés, un
   agent générique dont le prompt est la sortie complète de `fleet mission $1`.
   Budget par défaut : 12 constats, les plus graves d'abord.

3. Ingère et trie :
   ```bash
   node .claude/fleet/fleet.mjs ingerer --departement $1
   node .claude/fleet/fleet.mjs suivant --departement $1 --n 8
   ```
   Rejette les faux positifs et les constats non actionnables, avec leur raison.

4. Sauf si `--audit-seul` est demandé : corrige les 3 à 5 constats les mieux classés,
   un sous-agent `fleet-implementeur` par constat, **en série**. Puis une vérification
   adverse (`fleet-verificateur`) sur tout ce qui a été clos.

5. Clôture :
   ```bash
   node .claude/fleet/fleet.mjs verifier --rapide
   node .claude/fleet/fleet.mjs rapport
   ```
   Compte rendu : score du département avant/après, ce qui est prouvé, ce qui reste.
