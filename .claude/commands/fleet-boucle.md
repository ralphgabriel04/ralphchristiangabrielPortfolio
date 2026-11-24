---
description: Une itération complète de la Fleet — audit multi-départements, triage, correctifs prouvés, vérification adverse, portes, rapport.
argument-hint: "[nombre d'itérations, défaut 1]"
---

Exécute la boucle de la Fleet en suivant la compétence `audit-transversal`
(`.claude/skills/audit-transversal/SKILL.md`) — lis-la maintenant si elle n'est pas déjà
dans le contexte, et applique ses phases 0 à 6 dans l'ordre.

Nombre d'itérations demandé : **$1** (1 par défaut).

Rappels qui sautent le plus souvent :

- Phase 0 obligatoire même en reprise : `recon`, `statut`, `departements`.
  Un carnet qui contient déjà des constats ouverts ne se re-audite pas — on corrige.
- Les audits partent **en parallèle, dans un seul message** ; les correctifs sont
  **séquentiels**.
- La vérification adverse (phase 4) n'est pas optionnelle.
- Les portes doivent être vertes avant de clore l'itération.
- Termine par un compte rendu de cinq lignes : score global, corrigé et prouvé, rouvert,
  bloquant restant, prochaine cible.

Si le dépôt n'a jamais été cartographié (`parcours` vide dans le profil), commence par le
sous-agent `fleet-cartographe`.
