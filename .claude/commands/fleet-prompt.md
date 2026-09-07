---
description: Génère un prompt autonome, prêt à coller, à partir des constats réellement ouverts dans le carnet de la Fleet.
argument-hint: "[departement] [nombre de constats]"
---

Produis un prompt de mission tiré de l'état réel du carnet — pas d'une intention, pas
d'un souvenir de conversation.

```bash
node .claude/fleet/fleet.mjs prompt --departement $1 --n ${2:-10}
```

(Sans département, la commande produit un lot transversal des constats les plus
prioritaires, tous départements confondus.)

Ensuite :

1. Relis la sortie et retire les constats qui ne tiennent plus (fichier supprimé, choix
   produit tranché entre-temps) — signale-les avec `fleet rejeter <ID> --raison "..."`.
2. Écris le prompt final dans `docs/prompts/` s'il existe, sinon dans
   `.claude/fleet/etat/prompts/`, avec la date dans le nom du fichier.
3. Rends le chemin du fichier et un résumé en trois lignes : combien de constats, quelle
   gravité maximale, quelles portes devront être vertes à la fin.

Ce prompt est fait pour être exécuté ailleurs — autre session, autre machine, autre
personne. Il doit donc se suffire à lui-même : aucun « comme discuté plus haut ».
