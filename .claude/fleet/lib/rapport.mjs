// Ce que la Fleet produit pour des humains : briefs de mission, rapport d'état,
// journal, et prompts prêts à coller.

import { appendFileSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { chemins, maintenant } from './util.mjs';
import { GRAVITES, OUVERTS, charger, statistiques } from './constats.mjs';
import { departementsActifs, parCle } from './departements.mjs';

// ---------------------------------------------------------------- substitutions

export function substitutions(profil) {
  const q = Object.entries(profil.commandes ?? {})
    .filter(([r]) => r !== 'dev')
    .map(([r, c]) => `${r} → ${c}`)
    .join(' · ');
  return {
    commandeDev: profil.appli?.commandeDev ?? 'aucune commande de dev détectée',
    urlBase: profil.appli?.urlBase ?? 'http://localhost:3000',
    dossierTests: profil.dossiers?.tests ?? 'tests/',
    dossierCaptures: profil.dossiers?.captures ?? '.claude/fleet/etat/captures',
    jetons: profil.dossiers?.jetons ?? 'aucun fichier de jetons détecté',
    sondeA11y: profil.sondes?.a11y ?? 'aucune sonde a11y installée — audit manuel',
    sondePerf: profil.sondes?.perf ?? 'aucune sonde perf installée — mesure par build',
    sondeArchi: profil.sondes?.archi ?? 'aucun outil de frontières installé',
    sondeI18n: (profil.sondes?.i18n ?? []).join(', ') || 'aucun contrôle i18n scripté',
    sondeAudit: profil.sondes?.audit ?? `${profil.gestionnaire} audit`,
    locales: (profil.i18n?.locales ?? []).join(', ') || 'aucune locale détectée',
    commandesQualite: q || 'aucune',
    fichierEnvExemple: profil.env_exemple ?? 'aucun fichier .env.example',
  };
}

const appliquer = (texte, subs) =>
  texte.replace(/\{\{(\w+)\}\}/g, (_, cle) => String(subs[cle] ?? `{{${cle}}}`));

// ------------------------------------------------------------------- mission

const CONTRAT = (dept, profil, budget) => `
## Contrat de sortie — NON NÉGOCIABLE

Écris tes constats dans \`.claude/fleet/etat/entrant/${dept.cle}.json\`, exactement
cette forme, rien autour :

\`\`\`json
{
  "departement": "${dept.cle}",
  "constats": [
    {
      "titre": "phrase courte, factuelle, sans adjectif",
      "gravite": "bloquant | majeur | mineur | polish",
      "portee": "global | section | route | composant",
      "cible": "chemin/du/fichier.tsx ou /route",
      "ligne": 42,
      "preuve": "ce que tu as MESURÉ ou VU — sortie de commande, ratio calculé, texte de l'erreur, extrait de code",
      "impact": "ce qui casse pour un utilisateur ou un mainteneur, en une phrase",
      "correctif": "le changement précis à faire, pas une direction vague",
      "cout": "S | M | L",
      "confiance": 0.9,
      "etapes": ["reproduction, si applicable"],
      "reference": "critère WCAG, CWE, règle interne… si applicable"
    }
  ]
}
\`\`\`

Puis, en dernière action, lance :
\`node .claude/fleet/fleet.mjs ingerer --departement ${dept.cle}\`

## Règles de la Fleet

1. **Pas de preuve, pas de constat.** Un constat sans mesure, sans sortie de commande
   ou sans extrait de code exact est supprimé à l'ingestion. Compte-le comme du bruit.
2. **Budget : ${budget} constats maximum.** Si tu en trouves plus, garde les plus graves.
   Un rapport de 60 lignes que personne ne traite ne vaut rien.
3. **Tu n'écris pas de code applicatif.** Ton rôle est de constater. Le département
   d'implémentation corrige, et il a besoin de ton \`correctif\` pour le faire vite.
   (Seule exception : le département Parcours peut ajouter un test de non-régression.)
4. **Pas de doublon.** La liste des constats déjà ouverts t'est donnée plus bas :
   ne les redéclare pas. Si tu constates qu'un constat marqué corrigé est de retour,
   déclare-le quand même : la Fleet le comptera comme régression.
5. **Gravité honnête.** \`bloquant\` veut dire : une personne ne peut pas faire ce
   qu'elle est venue faire, ou des données sont en jeu. Pas « c'est important ».
6. **Cible réelle.** Chemin de fichier existant ou route servie, jamais un module inventé.
`;

/**
 * Le brief complet d'un département, adapté à CE dépôt.
 * `sansContexte` produit la version intemporelle (mission + contrat) destinée au
 * fichier d'agent committé : y figer les routes et les constats du jour en
 * ferait un document faux dès la semaine suivante.
 */
export function rendreMission(cle, profil, { iteration = 0, budget = null, constatsExistants = null, sansContexte = false } = {}) {
  const dept = parCle(cle);
  if (!dept) throw new Error(`Département inconnu : ${cle}`);
  const subs = substitutions(profil);
  const b = budget ?? profil.budget?.constats_par_departement ?? 12;
  if (sansContexte) {
    return [`# Département ${dept.nom}`, '', appliquer(dept.mission.trim(), subs), '', CONTRAT(dept, profil, b)].join('\n');
  }
  const tous = constatsExistants ?? charger(chemins(profil.racine));
  const ouverts = tous.filter((k) => k.departement === cle && OUVERTS.has(k.statut));
  const corriges = tous.filter((k) => k.departement === cle && (k.statut === 'corrige' || k.statut === 'verifie'));

  const contexte = [
    `## Le projet, tel qu'il est réellement`,
    '',
    '```',
    `nom          ${profil.nom}`,
    `technos      ${profil.technos.join(', ') || '—'}`,
    `commandes    ${Object.entries(profil.commandes ?? {}).map(([k, v]) => `${k}: ${v}`).join('\n             ') || '—'}`,
    `application  ${subs.commandeDev} → ${subs.urlBase}`,
    `routes       ${profil.routes.slice(0, 30).join(' ') || '—'}${profil.routes.length > 30 ? ` … (+${profil.routes.length - 30})` : ''}`,
    `locales      ${subs.locales}`,
    '```',
  ].join('\n');

  const parcours = profil.parcours?.length
    ? ['## Parcours cartographiés', '', ...profil.parcours.map((p, i) => `${i + 1}. **${p.nom}** — ${p.etapes ?? p.description ?? ''} ${p.route ? `(${p.route})` : ''}`)].join('\n')
    : '';

  const connus = ouverts.length
    ? ['## Constats déjà ouverts pour ce département — NE PAS redéclarer', '', ...ouverts.map((k) => `- \`${k.id}\` [${k.gravite}] ${k.titre}${k.cible ? ` — ${k.cible}` : ''}`)].join('\n')
    : '## Constats déjà ouverts pour ce département\n\nAucun : c\'est la première passe.';

  const fermes = corriges.length
    ? ['', '## Déjà corrigés — vérifie qu\'ils tiennent toujours', '', ...corriges.slice(-15).map((k) => `- \`${k.id}\` ${k.titre}`)].join('\n')
    : '';

  return [
    `# Mission — Département ${dept.nom}`,
    `_Itération ${iteration} · ${profil.nom} · généré le ${maintenant()}_`,
    '',
    appliquer(dept.mission.trim(), subs),
    '',
    contexte,
    parcours ? '\n' + parcours : '',
    '',
    connus,
    fermes,
    '',
    CONTRAT(dept, profil, b),
  ]
    .filter(Boolean)
    .join('\n');
}

// ------------------------------------------------------------------- rapport

const barre = (score) => {
  const n = Math.round(score / 10);
  return '█'.repeat(n) + '░'.repeat(10 - n);
};

export function genererRapport(profil, c = chemins(profil.racine)) {
  const liste = charger(c);
  const stats = statistiques(c);
  const actifs = departementsActifs(profil);
  const jamaisAudites = actifs.filter((d) => !liste.some((k) => k.departement === d.cle));

  const lignes = [];
  lignes.push(`# Rapport Fleet — ${profil.nom}`);
  lignes.push('');
  lignes.push(`_Généré le ${maintenant()} · ${stats.total} constats · ${stats.ouverts} ouverts · ${stats.bloquants} bloquants_`);
  lignes.push('');
  lignes.push(`## Score par département`);
  lignes.push('');
  lignes.push('| Département | Score | Ouverts | Bloquants | Corrigés | Vérifiés | Régressions |');
  lignes.push('|---|---|---|---|---|---|---|');
  for (const s of stats.departements) {
    const dep = parCle(s.departement);
    lignes.push(
      `| ${dep?.nom ?? s.departement} | \`${barre(s.score)}\` ${s.score} | ${s.ouverts} | ${s.bloquants} | ${s.corriges} | ${s.verifies} | ${s.regressions} |`,
    );
  }
  if (stats.global !== null) {
    lignes.push('');
    lignes.push(`**Score global : ${stats.global}/100** — moyenne des départements audités.`);
  }

  if (jamaisAudites.length) {
    lignes.push('');
    lignes.push('## Départements pertinents jamais audités');
    lignes.push('');
    lignes.push('Ce ne sont pas des départements « verts » : ce sont des départements dont on ne sait rien.');
    lignes.push('');
    for (const d of jamaisAudites) lignes.push(`- **${d.nom}** — ${d.resume}`);
  }

  const ouverts = liste.filter((k) => OUVERTS.has(k.statut)).sort((a, b) => b.priorite - a.priorite);
  lignes.push('');
  lignes.push('## File de travail (30 premiers)');
  lignes.push('');
  if (!ouverts.length) lignes.push('_Rien d\'ouvert._');
  for (const k of ouverts.slice(0, 30)) {
    lignes.push(`### \`${k.id}\` · ${k.titre}`);
    lignes.push('');
    lignes.push(`**${k.gravite}** · portée ${k.portee} · coût ${k.cout} · priorité ${k.priorite}${k.regressions ? ` · ⚠️ ${k.regressions} régression(s)` : ''}`);
    if (k.cible) lignes.push(`\`${k.cible}${k.ligne ? ':' + k.ligne : ''}\``);
    lignes.push('');
    lignes.push(`**Preuve** — ${k.preuve}`);
    if (k.impact) lignes.push(`**Impact** — ${k.impact}`);
    if (k.correctif) lignes.push(`**Correctif** — ${k.correctif}`);
    lignes.push('');
  }

  const corriges = liste.filter((k) => k.statut === 'corrige' || k.statut === 'verifie');
  if (corriges.length) {
    lignes.push('## Corrigés');
    lignes.push('');
    lignes.push('| ID | Constat | Statut | Preuve du correctif |');
    lignes.push('|---|---|---|---|');
    for (const k of corriges.slice(-40)) {
      lignes.push(`| \`${k.id}\` | ${k.titre} | ${k.statut} | ${(k.preuve_correction ?? '—').slice(0, 120)} |`);
    }
  }

  const texte = lignes.join('\n') + '\n';
  mkdirSync(dirname(c.rapport), { recursive: true });
  writeFileSync(c.rapport, texte);
  return { fichier: c.rapport, stats };
}

// ------------------------------------------------------------------- journal

export function journaliser(texte, c = chemins()) {
  mkdirSync(dirname(c.journal), { recursive: true });
  if (!existsSync(c.journal)) {
    writeFileSync(c.journal, '# Journal de la Fleet\n\nUne ligne par action. Append-only.\n\n');
  }
  appendFileSync(c.journal, `- **${maintenant()}** — ${texte}\n`);
}

// -------------------------------------------------------------------- prompt

/**
 * Prompt prêt à coller : reprend l'état réel du carnet et le transforme en
 * mission d'implémentation autonome, dans le format que le propriétaire du
 * dépôt utilise déjà (lots, preuves, portes).
 */
export function genererPrompt(profil, { departement = null, n = 10, gravite = null } = {}, c = chemins(profil.racine)) {
  const stats = statistiques(c);
  const seuil = gravite ? (GRAVITES[gravite] ?? 0) : 0;
  const cibles = charger(c)
    .filter((k) => OUVERTS.has(k.statut))
    .filter((k) => !departement || k.departement === departement)
    .filter((k) => (GRAVITES[k.gravite] ?? 0) >= seuil)
    .sort((a, b) => b.priorite - a.priorite)
    .slice(0, n);

  const titre = departement ? `Lot ${parCle(departement)?.nom ?? departement}` : 'Lot transversal';
  const subs = substitutions(profil);

  const l = [];
  l.push(`# ${titre} — ${profil.nom}`);
  l.push(`_${cibles.length} constats · généré depuis le carnet de la Fleet le ${maintenant()}_`);
  l.push('');
  l.push('## Contexte');
  l.push('');
  l.push('```');
  l.push(`racine       ${profil.racine}`);
  l.push(`technos      ${profil.technos.join(', ')}`);
  l.push(`portes       ${subs.commandesQualite}`);
  l.push(`application  ${subs.commandeDev} → ${subs.urlBase}`);
  l.push('```');
  l.push('');
  l.push('## Ce qui est demandé');
  l.push('');
  l.push('Corrige les constats ci-dessous, **un commit par constat**, dans l\'ordre donné.');
  l.push('Pour chacun : reproduis d\'abord, corrige ensuite, prouve enfin. Un constat clos');
  l.push('sans preuve reproductible est rouvert à l\'itération suivante.');
  l.push('');
  l.push('Après chaque correctif :');
  l.push('```bash');
  l.push('node .claude/fleet/fleet.mjs verifier --rapide');
  l.push('node .claude/fleet/fleet.mjs clore <ID> --preuve "<commande + résultat>" --commit <sha>');
  l.push('```');
  l.push('');
  l.push('## Constats');
  l.push('');
  for (const k of cibles) {
    l.push(`### \`${k.id}\` · ${k.titre}`);
    l.push('');
    l.push(`- **Gravité** : ${k.gravite} (priorité ${k.priorite})`);
    if (k.cible) l.push(`- **Cible** : \`${k.cible}${k.ligne ? ':' + k.ligne : ''}\``);
    l.push(`- **Preuve du problème** : ${k.preuve}`);
    if (k.impact) l.push(`- **Impact** : ${k.impact}`);
    if (k.correctif) l.push(`- **Correctif attendu** : ${k.correctif}`);
    if (k.etapes?.length) l.push(`- **Reproduction** : ${k.etapes.join(' → ')}`);
    l.push('');
  }
  l.push('## Interdits');
  l.push('');
  l.push('- Désactiver, ignorer ou mettre en quarantaine un test pour passer au vert.');
  l.push('- Élargir le périmètre : rien en dehors des constats listés.');
  l.push('- Clore un constat sans preuve exécutable.');
  l.push('');
  l.push(`_État au moment de la génération : score global ${stats.global ?? '—'}/100, ${stats.ouverts} constats ouverts._`);
  return l.join('\n');
}
