# Journal de la flotte

## Ce qui est écrit ici, et par qui

| Fichier | Écrit par | Contenu |
|---|---|---|
| `runs.jsonl` | **les hooks de Claude Code** (`SubagentStart`, `SubagentStop`, `PostToolUse`) | Chaque démarrage d'agent, chaque arrêt, chaque mutation de fichier |
| `couverture.jsonl` | les agents, via `journal.mjs couverture` | Le périmètre déclaré : examiné, non examiné, angles morts, confiance |
| `missions/*.md` | l'agent `archiviste` | L'entrée lisible d'une mission, et sa commande de retour arrière |

**`runs.jsonl` n'est jamais écrit par un agent.** C'est ce qui en fait une trace
et non un compte-rendu : un agent qui pourrait éditer sa propre trace n'en laisse
pas. `.claude/settings.json` le protège par une règle `deny` explicite.

Le hook masque toute chaîne ressemblant à un secret avant écriture, et échoue en
silence : un journal cassé ne bloque jamais le travail.

## S'en servir

```bash
node scripts/fleet/journal.mjs resume                    # historique lisible
node scripts/fleet/journal.mjs resume --agent implementeur
node scripts/fleet/journal.mjs rollback <id-de-mission>  # IMPRIME la commande
```

## Limite honnête

Le journal est inviolable **par les agents**, pas cryptographiquement. Un humain
avec accès au dépôt peut le réécrire. Le rendre infalsifiable demanderait une
signature externe — hors périmètre, et dit ici plutôt que sous-entendu.
