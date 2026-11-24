---
description: État de la Fleet — score par département, file de travail, régressions, et la prochaine action recommandée.
argument-hint: ""
---

Donne l'état de la Fleet sur ce dépôt, sans rien corriger.

```bash
node .claude/fleet/fleet.mjs recon
node .claude/fleet/fleet.mjs statut
node .claude/fleet/fleet.mjs departements
node .claude/fleet/fleet.mjs suivant --n 8
```

Puis, en une dizaine de lignes maximum :

- le score global et les trois départements les plus bas ;
- les **régressions** (un correctif qui n'a pas tenu passe avant tout constat neuf) ;
- les départements **jamais audités** — dis explicitement qu'on ne sait rien d'eux,
  ce n'est pas la même chose qu'un département sain ;
- la prochaine action recommandée, avec la commande exacte
  (`/fleet-boucle`, `/fleet-dept <nom>`, ou la cartographie si le profil n'a pas de
  parcours).

Si aucun profil n'existe encore, lance `recon`, explique en trois lignes ce que la Fleet
a détecté du projet, et propose la première boucle.
