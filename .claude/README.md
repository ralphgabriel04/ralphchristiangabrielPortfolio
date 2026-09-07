# La Fleet — régie d'audit multi-départements

Un dispositif d'agents qui **ouvre l'application, l'exerce, constate ce qui cloche,
corrige, prouve, et recommence** — pour ne plus avoir à tester chaque fonctionnalité à la
main après chaque changement.

Il est **transversal** : le même dossier `.claude/` déposé dans un autre dépôt se
reconfigure seul (technos, commandes, routes, locales, sondes disponibles) et n'active
que les départements qui ont quelque chose à auditer là-bas.

---

## Démarrer

```bash
node .claude/fleet/fleet.mjs recon        # que suis-je en train d'auditer ?
node .claude/fleet/fleet.mjs statut       # où en est-on ?
```

Puis, dans Claude Code :

| Commande | Ce qu'elle fait |
|---|---|
| `/fleet` | État : score par département, file de travail, régressions, prochaine action |
| `/fleet-boucle [n]` | Une itération complète : audit → triage → correctifs prouvés → vérification adverse → portes → rapport |
| `/fleet-dept <nom>` | Une seule équipe, en profondeur (`a11y`, `perf`, `parcours`, `securite`…) |
| `/fleet-prompt [dept]` | Un prompt autonome, prêt à coller ailleurs, tiré du carnet réel |
| `/loop 30m /fleet-boucle` | La boucle en continu, cadencée |

La première fois, laisse la boucle commencer par la **cartographie** : sans parcours
utilisateurs, le département Parcours audite au hasard.

---

## La sonde : ce qui remplace « j'ouvre l'app et je clique partout »

```bash
node .claude/fleet/fleet.mjs sonde parcours --demarrer
```

Elle démarre l'application, ouvre **chaque route dans un vrai Chromium**, à 390px et
1440px, et relève par page : statut HTTP, erreurs console, erreurs JS, requêtes en échec,
débordement horizontal mesuré, présence de `main`, nombre de `h1`, sauts de niveau de
titre, images sans `alt`, contrôles sans nom accessible, champs sans étiquette, cibles
tactiles sous 24px, violations axe (si `axe-core` est installé), et une capture par
route.

Le relevé va dans `etat/entrant/sonde-parcours.json`. Ce sont des **observations**, pas
des constats : les départements les vérifient, les qualifient et les transforment en
constats avec preuve. Une sonde qui juge est une sonde qu'on croit sur parole.

Options utiles : `--url` (application déjà lancée), `--routes /,/tarifs`, `--largeurs`,
`--max`, `--navigateur /chemin/vers/chrome` (ou `FLEET_CHROMIUM`) quand l'image fournit
son propre Chromium.

---

## Les quatorze départements

| Clé | Département | Ce qu'il traque |
|---|---|---|
| `parcours` | QA fonctionnelle navigateur | Ce qui casse quand on utilise vraiment l'application |
| `ux` | UX / Design | Jetons contournés, états manquants, hiérarchie, réactivité |
| `a11y` | Accessibilité | WCAG 2.2 AA : clavier, focus, contraste, sémantique |
| `i18n` | Internationalisation | Parité des catalogues, chaînes en dur, formats locaux |
| `perf` | Performance | Budgets, Web Vitals, poids, requêtes, rendu |
| `frontend` | Front-end | État, effets, frontière serveur/client, robustesse |
| `backend` | Back-end | Validation, autorisation, codes, transactions, contrats |
| `donnees` | Données | Schéma, contraintes, migrations réversibles, isolation |
| `securite` | Sécurité | Secrets, authz, injection, en-têtes, dépendances |
| `tests` | Tests | Tests morts, portes manquantes, zones nues |
| `observabilite` | Observabilité | Erreurs avalées, journaux, santé, métriques |
| `architecture` | Architecture | Frontières, code mort, duplication, doc périmée |
| `produit` | Produit | Promesse vs produit, copie, premier lancement, SEO |
| `livraison` | Livraison | Portes fantômes, cliquets, reproductibilité, retour arrière |

Un département **jamais audité** n'est pas un département vert : c'est un département
dont on ne sait rien. Le rapport les nomme explicitement.

---

## Comment ça tient debout

**Le carnet.** `etat/constats.jsonl` est la mémoire. Chaque constat a un identifiant
(`A11Y-003`), une preuve, une gravité, un coût, un statut. L'ingestion **dédoublonne** :
deux passes du même département ne créent pas deux fois le même constat. Et un constat
marqué corrigé qui revient est signalé comme **régression** — c'est le seul moyen de
savoir qu'un correctif n'a pas tenu.

**La preuve.** Un constat sans preuve est rejeté à l'ingestion, automatiquement. Un
correctif se clôt avec la commande *et* son résultat, jamais avec « vérifié ».

**La vérification adverse.** Une fois les correctifs posés, un département dont le seul
travail est d'essayer de les faire échouer : cas limite, autre occurrence du même défaut,
test qui passerait même sans le correctif, porte contournée (`skip`, `eslint-disable`,
baseline mise à jour). Ses verdicts négatifs rouvrent les constats.

**Les portes.** Aucune itération ne se clôt sur un dépôt rouge. `fleet verifier` lance
les commandes de qualité **détectées dans ce dépôt** — pas une liste écrite d'avance.

**Parallèle / série.** Les audits partent en parallèle (ce sont des lectures). Les
correctifs sont séquentiels : deux agents qui éditent le même arbre produisent un diff
que personne ne peut relire.

---

## L'installer ailleurs

```bash
node .claude/fleet/fleet.mjs installer --vers ../autre-projet
cd ../autre-projet && node .claude/fleet/fleet.mjs recon
```

L'outil est copié, **pas sa mémoire** : le nouveau dépôt part avec un carnet vierge.

### L'adapter à un projet

Un `fleet.config.json` à la racine écrase le profil détecté :

```json
{
  "departements": { "donnees": false, "i18n": true },
  "appli": { "urlBase": "http://localhost:4321", "commandeDev": "pnpm dev --port 4321" },
  "commandes": { "e2e": "pnpm exec playwright test --project=chromium" },
  "budget": { "constats_par_departement": 8 }
}
```

`false` ferme un département, `true` le force même si la détection ne le juge pas
pertinent. Tout le reste est fusionné par-dessus ce que `recon` a trouvé.

---

## Modifier les départements

Les briefs vivent **à un seul endroit** : `.claude/fleet/lib/departements.mjs`. Les
fichiers `.claude/agents/dept-*.md` en sont générés :

```bash
node .claude/fleet/fleet.mjs sync-agents
```

N'éditez pas les agents à la main — un brief dupliqué à deux endroits diverge en une
semaine, et c'est précisément le défaut que ce registre existe pour empêcher.

---

## Le CLI

```
recon [--force]                    Détecte le projet : technos, commandes, routes, sondes
departements                       Qui est dans le périmètre, qui n'a jamais été audité
parcours [--fichier f.json]        Enregistre les parcours utilisateurs cartographiés
sonde parcours [--demarrer]        Ouvre l'application dans un navigateur et relève tout
mission <dept> [--iteration n]     Le brief complet d'un département, adapté au dépôt
ingerer --departement <dept>       Ingère etat/entrant/<dept>.json (dédoublonne, détecte les régressions)
suivant [--n 5] [--departement d]  La file de travail, triée par priorité
montrer <ID> · prendre <ID>        Détail d'un constat · le passer en cours
clore <ID> --preuve "..."          → corrigé (preuve obligatoire)
verdict <ID> --ok|--ko --preuve    Vérification adverse : confirme ou rouvre
rejeter <ID> --raison "..."        Faux positif ou hors périmètre
verifier [--rapide] [--portes a,b] Lance les portes du dépôt
statut · rapport                   Tableau de bord · etat/RAPPORT.md
prompt [--departement d] [--n 10]  Prompt prêt à coller depuis l'état réel du carnet
sync-agents · installer --vers X   Maintenance
```

Zéro dépendance : le CLI tourne avec Node seul, y compris dans un dépôt dont les
`node_modules` ne sont pas installés.

---

## Ce que la Fleet ne fait pas

- Elle ne dit jamais « tout fonctionne ». Elle dit ce qui a été mesuré, sur quoi, et ce
  qui reste non couvert.
- Elle ne désactive pas un test pour passer au vert.
- Elle ne tranche pas un choix de produit, de marque ou de tarif : elle s'arrête et
  demande.
- Elle n'élargit pas le périmètre d'une itération en cours de route.
