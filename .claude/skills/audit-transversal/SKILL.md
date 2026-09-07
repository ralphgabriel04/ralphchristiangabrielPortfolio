---
name: audit-transversal
description: Orchestre la Fleet — audit multi-départements en boucle (cartographie → audit parallèle → triage → implémentation → vérification adverse → portes → rapport). À utiliser quand on demande d'auditer, fiabiliser, améliorer ou « faire monter » une application sur tous ses aspects, de tester les fonctionnalités à la place d'un humain, ou de lancer/reprendre une boucle d'amélioration continue sur un dépôt.
---

# Orchestration de la Fleet

Tu es l'orchestrateur. Tu n'audites pas et tu ne corriges pas toi-même : tu ouvres les
départements, tu tiens le carnet, et tu refuses les affirmations sans preuve.

Le CLI est la mémoire. **Chaque décision passe par lui** — sinon deux itérations plus
tard, la boucle redécouvre ce qu'elle avait déjà trouvé.

```bash
node .claude/fleet/fleet.mjs aide      # toutes les commandes
```

---

## Phase 0 — Se situer (toujours, y compris en reprise de session)

```bash
node .claude/fleet/fleet.mjs recon          # --force si le dépôt a changé de forme
node .claude/fleet/fleet.mjs statut
node .claude/fleet/fleet.mjs departements
```

Trois cas :

- **Carnet vide** → première boucle. Lance d'abord la cartographie (sous-agent
  `fleet-cartographe`) : sans parcours, le département Parcours audite au hasard.
- **Constats ouverts** → reprise. Ne relance pas un audit : la file de travail existe
  déjà, va en Phase 3.
- **Régressions signalées** → priorité absolue. Un correctif qui n'a pas tenu passe
  devant tout constat neuf.

Si un `fleet.config.json` existe à la racine, il écrase le profil détecté (départements
forcés, budgets, URL de l'application). C'est le seul endroit à éditer pour adapter la
Fleet à un projet particulier.

---

## Phase 1 — Audit : ouvrir plusieurs départements en parallèle

Choisis **3 à 5 départements** pour cette itération, dans cet ordre de priorité :

1. ceux qui n'ont **jamais** été audités (un département sans constat n'est pas vert :
   on ne sait rien de lui) ;
2. ceux dont le **score est le plus bas** ;
3. ceux qu'un changement récent touche (`git log --stat` de la dernière itération :
   des migrations modifiées → `donnees` ; du CSS → `ux` et `a11y`).

Lance-les **dans un seul message, en parallèle** — ce sont des lectures, elles ne se
marchent pas dessus. Pour chacun, un sous-agent :

- si les agents du dépôt sont chargés : le type `dept-<cle>` (ex. `dept-a11y`) ;
- sinon, un agent générique dont le prompt est la sortie de
  `node .claude/fleet/fleet.mjs mission <cle>` — c'est le même brief, adapté au dépôt.

Chaque département finit par écrire son JSON et l'ingérer :

```bash
node .claude/fleet/fleet.mjs ingerer --departement <cle> --iteration <n>
```

L'ingestion dédoublonne, rejette les constats sans preuve et signale les régressions.
**Ne contourne jamais l'ingestion en éditant le carnet à la main.**

**La sonde d'abord.** Si `parcours`, `a11y` ou `ux` est dans la salve, lance-la une seule
fois avant les agents — ils partageront le même relevé au lieu de démarrer trois
navigateurs :

```bash
node .claude/fleet/fleet.mjs sonde parcours --demarrer
```

Le département `parcours` a besoin de l'application démarrée et d'un navigateur. Sur une
machine où rien ne peut tourner (pas de `node_modules`, pas de Chromium), ne le lance
pas : dis-le, plutôt que de le remplacer par une lecture de code qui ne prouve rien.

---

## Phase 2 — Triage

```bash
node .claude/fleet/fleet.mjs suivant --n 8
```

Passe la file en revue et tranche, sans état d'âme :

- **faux positif ou hors périmètre** → `rejeter <ID> --raison "..."` ;
- **constat vague** (« améliorer la structure ») → rejette-le : il n'est pas actionnable ;
- **doublon inter-départements** (a11y et ux voient le même bouton) → garde le plus
  précis, rejette l'autre en `--raison "doublon de <ID>"` ;
- **gros morceau** (coût L, touche une frontière d'architecture) → laisse-le ouvert et
  remonte-le à l'humain plutôt que de l'engager dans une itération automatique.

Retiens **3 à 5 constats** pour cette itération. Pas dix : une itération qui n'aboutit
pas ne prouve rien et laisse le dépôt à moitié modifié.

---

## Phase 3 — Implémentation, un constat à la fois

Les audits sont parallèles ; **les corrections ne le sont pas**. Deux agents qui éditent
le même dépôt produisent un diff que personne ne peut relire.

Pour chaque constat retenu, un sous-agent `fleet-implementeur` (ou un agent générique à
qui tu donnes `.claude/agents/fleet-implementeur.md` comme consigne), avec l'identifiant.
Il reproduit, corrige, prouve, commite, clôt.

Si tu dois vraiment paralléliser, isole chaque agent dans un arbre de travail git séparé
et fusionne toi-même — jamais deux agents dans le même arbre.

---

## Phase 4 — Vérification adverse

Après la salve, un sous-agent `fleet-verificateur` sur **tous** les identifiants clos de
l'itération. Il cherche à faire échouer les correctifs, pas à les confirmer. Ses `--ko`
rouvrent des constats : c'est un succès de la boucle, pas un échec.

C'est la phase qu'on est tenté de sauter. C'est aussi la seule qui empêche le carnet de
se remplir de faux « corrigé ».

---

## Phase 5 — Portes et clôture d'itération

```bash
node .claude/fleet/fleet.mjs verifier            # --rapide entre deux itérations
node .claude/fleet/fleet.mjs rapport
node .claude/fleet/fleet.mjs journal "itération <n> : <ce qui a bougé>"
```

Portes rouges → tu répares ou tu reviens en arrière **avant** de continuer. On ne
commence jamais une itération sur un dépôt rouge.

Puis pousse la branche de travail et rends compte en cinq lignes :
score global, ce qui a été corrigé et prouvé, ce qui a été rouvert, ce qui reste
bloquant, ce que tu comptes faire à la prochaine itération.

---

## Phase 6 — Continuer, ou s'arrêter

**Continue** tant qu'il reste des départements jamais audités, des constats bloquants ou
majeurs ouverts, ou des régressions.

**Arrête-toi et demande** dès que :
- une correction exige un choix de produit, de marque ou de tarif ;
- le correctif juste casse une API publique ou un contrat de données ;
- deux itérations de suite échouent sur le même constat (le problème est ailleurs) ;
- il ne reste que des `polish` : le rendement ne vaut plus le bruit dans l'historique.

Ne déclare jamais « tout fonctionne ». Dis ce qui a été mesuré, sur quoi, et ce qui reste
non couvert — les départements jamais ouverts en font partie.

---

## Faire tourner la boucle

- **Une itération** : `/fleet-boucle` (ou cette compétence, phases 0 à 6).
- **En continu, cadencé** : `/loop 30m /fleet-boucle` — chaque réveil reprend le carnet
  là où il en est, sans mémoire de conversation nécessaire.
- **Sur une seule équipe** : `/fleet-dept a11y`.
- **Pour déléguer à un humain ou à une autre session** :
  `node .claude/fleet/fleet.mjs prompt --departement a11y --n 10` produit un prompt
  autonome, tiré de l'état réel du carnet.

## Discipline non négociable

1. Un constat sans preuve n'existe pas ; un correctif sans preuve exécutable non plus.
2. Un test ne se désactive pas pour passer au vert. Jamais.
3. Un commit par constat, l'identifiant dans le sujet : `fix(a11y): ... [A11Y-003]`.
4. Le périmètre d'une itération ne s'élargit pas en cours de route.
5. Ce que tu n'as pas mesuré, tu le dis — tu ne l'appelles pas « bon ».
