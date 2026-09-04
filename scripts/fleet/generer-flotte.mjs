#!/usr/bin/env node
// Générateur de flotte — compose les agents d'un projet à partir de son profil.
//
// Il n'engendre QUE ce que le projet possède : pas d'agent i18n sans catalogue,
// pas d'agent de données sans migrations. Un agent qui n'a rien à regarder ne
// trouve rien, et fait perdre du temps à chaque mission.
//
// Il n'écrase JAMAIS un agent existant sans `--force` : sur un dépôt qui a déjà
// une flotte affinée à la main, la régénération doit être un complément, pas un
// écrasement.
//
//   node scripts/fleet/generer-flotte.mjs [--racine <projet>] [--profil <json>]
//                                         [--inclure dep1,dep2] [--force] [--sec]
import { readFileSync, writeFileSync, existsSync, mkdirSync, copyFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, isAbsolute, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { AGENTS } from '../../.claude/fleet/gabarits/agents.mjs';

const arg = (n, d = null) => { const i = process.argv.indexOf('--' + n); return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : d; };
const FORCE = process.argv.includes('--force');
const SEC = process.argv.includes('--sec');            // n'écrit rien, montre le plan
const RACINE = isAbsolute(arg('racine', process.cwd())) ? arg('racine', process.cwd()) : join(process.cwd(), arg('racine', '.'));
const NOYAU = join(dirname(fileURLToPath(import.meta.url)), '..', '..');   // le dépôt qui porte la flotte de référence
const R = (...p) => join(RACINE, ...p);

const cheminProfil = arg('profil', R('.claude/fleet/projet.json'));
if (!existsSync(cheminProfil)) {
  console.error(`✗ Profil introuvable : ${cheminProfil}`);
  console.error('  Lance d\'abord : node scripts/fleet/reconnaitre-projet.mjs --racine ' + RACINE);
  process.exit(1);
}
const P = JSON.parse(readFileSync(cheminProfil, 'utf8'));

// ─────────────────────────────────────────── quels départements sont retenus
const enPlus = (arg('inclure', '') || '').split(',').map((s) => s.trim()).filter(Boolean);
const retenus = new Set();
for (const [id, d] of Object.entries(P.departements || {})) {
  if (d.actif && (d.confiance === 'forte' || enPlus.includes(id))) retenus.add(id);
}
const ecartes = Object.entries(P.departements || {})
  .filter(([id, d]) => !retenus.has(id))
  .map(([id, d]) => ({ id, raison: !d.actif ? 'aucune trace dans le dépôt' : `preuve faible (${d.preuve}) — relancer avec --inclure ${id}` }));

const aEngendrer = AGENTS.filter((a) => a.departement === null || retenus.has(a.departement));

// ───────────────────────────────────────────────────── substitutions du projet
const portesDe = (...ids) => {
  const trouvees = ids.filter((id) => P.portes?.[id]);
  return trouvees.length
    ? trouvees.map((id) => `\`${P.portes[id].command}\``).join(' · ')
    : 'AUCUNE PORTE DE CE TYPE N\'A ÉTÉ DÉCOUVERTE dans ce dépôt — dis-le plutôt que d\'en inventer une';
};
const liste = (arr, vide) => (arr && arr.length ? arr.map((x) => `- \`${x}\``).join('\n') : vide);

const S = {
  PROJET: P.identite.nom,
  BRANCHE_DEFAUT: P.identite.brancheDefaut || 'main',
  URL: P.application.urlProbable || 'http://localhost:3000',
  VIEWPORTS: P.application.viewports?.length ? P.application.viewports.join(' / ') : 'bureau et mobile',
  COMMANDE_SERVIR: P.application.servirPourInspection || P.application.dev || '# aucune commande de démarrage découverte — à établir avec le propriétaire',
  CONTEXTES: [P.application.viewports?.length ? 'bureau/mobile' : null, retenus.has('i18n') ? 'langue' : null, retenus.has('securite') ? 'connecté/anonyme' : null].filter(Boolean).join(' · ') || 'contexte de test',
  DOCTRINE: liste(P.doctrine, 'AUCUN document de doctrine découvert. Établis la structure par lecture du code, et dis-le explicitement.'),
  DOCTRINE_CONFORMITE: liste(P.doctrine.filter((d) => /(conformite|privacy|rgpd|gdpr|loi|efvp|dpia|security)/i.test(d)),
    'AUCUN document de conformité découvert dans ce dépôt. Établis les obligations depuis le code (données collectées, fournisseurs appelés, lieux de stockage) et signale l\'absence de documentation comme un constat.'),
  DOCTRINE_PRODUIT: liste(P.doctrine.filter((d) => /(strategie|pricing|roadmap|produit|marketing|README)/i.test(d)),
    'AUCUN document de stratégie découvert. Travaille depuis le README et le produit lui-même, et dis que la stratégie n\'est pas écrite.'),
  PORTES_CODE: portesDe('lint', 'typecheck', 'tests-unitaires', 'build'),
  PORTES_DESIGN: portesDe('sonde-contraste', 'verifier-etats-vides', 'e2e', 'inspection-ecrans'),
  PORTES_ARCHI: portesDe('depcruise', 'typecheck', 'build'),
  PORTES_I18N: portesDe('check-i18n-parity', 'check-i18n-parity-prototype', 'check-i18n-en-dur', 'smoke-i18n'),
  PORTES_PERF: portesDe('check-lighthouse', 'build', 'budget-build'),
  CATALOGUES: P.departements?.i18n?.preuve ? `\`${P.departements.i18n.preuve}\` (et voisins)` : 'à établir',
  OUTIL_A11Y: P.portes?.e2e ? `\`${P.portes.e2e.command}\`` : 'aucun découvert — vérifie par lecture et dis-le',
  EMPLACEMENTS_TESTS: (() => {
    const l = [];
    if (P.portes?.['tests-unitaires']) l.push(`| Unitaires | \`${P.portes['tests-unitaires'].command}\` |`);
    if (P.portes?.e2e) l.push(`| Bout en bout | \`${P.portes.e2e.command}\` |`);
    return l.length ? `| Nature | Lanceur |\n|---|---|\n${l.join('\n')}` : 'AUCUN lanceur de tests découvert. Établis-le avant d\'écrire un test, sinon il sera mort-né.';
  })(),
  REFERENCE_DESIGN: retenus.has('design-system')
    ? `La référence est le système de design du dépôt (\`${P.departements['design-system'].preuve}\`) : jetons, échelles, composants. Si une maquette externe est fournie, elle prime — nomme laquelle tu as utilisée.`
    : 'AUCUN système de design formel découvert. Compare aux conventions déjà présentes dans le code, et dis que c\'est ce que tu as fait.',
  DOC_RESPONSIVE: P.doctrine.find((d) => /responsive/i.test(d)) ? `voir \`${P.doctrine.find((d) => /responsive/i.test(d))}\`.` : 'raisonne par largeur, jamais par un booléen « mobile ».',
  NOTE_ENTETES: 'vérifie si le fichier de configuration de déploiement est GÉNÉRÉ par le build — auquel cas une édition manuelle sera écrasée en silence.',
};

const remplir = (txt) => txt.replace(/\{\{([A-Z_]+)\}\}/g, (m, k) => (k in S ? S[k] : m));

// ─────────────────────────────────────────────────────────── écriture agents
const PALIERS = {
  jugement: { model: 'opus', modelId: 'claude-opus-5', effort: 'high', coutParMJetons: { entree: 5.0, sortie: 25.0 },
    critere: "L'erreur est coûteuse et silencieuse : architecture, sûreté, conformité, arbitrage, évaluation." },
  metier: { model: 'sonnet', modelId: 'claude-sonnet-5', effort: 'medium', coutParMJetons: { entree: 2.0, sortie: 10.0 },
    critere: 'Erreur rattrapable, jugement requis mais borné, volume moyen.' },
  mecanique: { model: 'haiku', modelId: 'claude-haiku-4-5', effort: 'low', coutParMJetons: { entree: 1.0, sortie: 5.0 },
    critere: 'Vérification déterministe, forte volumétrie, faible jugement.' },
};

// Inventaire des agents DÉJÀ présents sur disque, quel que soit leur dossier :
// un agent engendré sous un autre nom reste un agent, et le dupliquer ferait
// deux prompts concurrents sur le même sujet.
const dejaLa = new Map();
(function scanner(d) {
  if (!existsSync(d)) return;
  for (const e of readdirSync(d)) {
    const p = join(d, e);
    if (statSync(p).isDirectory()) scanner(p);
    else if (e.endsWith('.md')) {
      // Lire le BLOC de frontmatter, puis y chercher `name:` — `name` est
      // souvent la première ligne, et une regex qui exige un saut avant lui
      // ne reconnaît alors aucun agent (silencieusement).
      const bloc = readFileSync(p, 'utf8').match(/^---\r?\n([\s\S]*?)\r?\n---/);
      const nom = bloc && bloc[1].match(/^name:\s*(\S+)\s*$/m);
      if (nom) dejaLa.set(nom[1], relative(RACINE, p));
    }
  }
})(R('.claude/agents'));

const ecrits = [], ignores = [], remplaces = [];
function ecrire(chemin, contenu) {
  if (SEC) return;
  mkdirSync(dirname(chemin), { recursive: true });
  writeFileSync(chemin, contenu);
}

const agentsRegistre = [];
for (const g of aEngendrer) {
  const fichierRel = `.claude/agents/${g.escouade}/${g.nom}.md`;
  const fichier = R(fichierRel);
  const palier = PALIERS[g.palier];
  const fm = [
    '---',
    `name: ${g.nom}`,
    `description: ${g.description}`,
    `tools: ${g.outils}`,
    `model: ${palier.model}`,
    `effort: ${palier.effort}`,
    ...(g.privilege === 'ecriture' ? ['permissionMode: acceptEdits'] : []),
    `maxTurns: ${g.maxTurns}`,
    ...(g.privilege === 'ecriture' ? ['memory: project'] : []),
    'skills: [flotte-regles]',
    `color: ${g.couleur}`,
    '---',
    '',
  ].join('\n');

  const equivalent = dejaLa.has(g.nom) ? g.nom : (g.alias || []).find((a) => dejaLa.has(a));
  if (equivalent && !FORCE) {
    (equivalent === g.nom ? ignores : remplaces).push(
      equivalent === g.nom ? dejaLa.get(equivalent) : `${dejaLa.get(equivalent)} couvre déjà « ${g.nom} »`);
    if (equivalent !== g.nom) { agentsRegistre.pop?.(); }
  } else { ecrire(fichier, fm + remplir(g.corps) + '\n'); ecrits.push(fichierRel); }

  if (equivalent && equivalent !== g.nom && !FORCE) continue;
  agentsRegistre.push({
    name: equivalent === g.nom ? g.nom : g.nom, file: equivalent === g.nom ? dejaLa.get(g.nom) : fichierRel, squad: g.escouade.replace(/^\d+-/, ''), tier: g.palier,
    privilege: g.privilege, maxTurns: g.maxTurns,
    role: g.description.split('.')[0] + '.',
    knowledge: ['.claude/fleet/projet.json', ...(g.departement && P.departements[g.departement]?.preuve ? [P.departements[g.departement].preuve] : []),
                ...P.doctrine.slice(0, 2)].filter((v, i, a) => v && a.indexOf(v) === i && existsSync(R(v))),
    gates: (g.portes || []).filter((p) => p === 'inspection-ecrans' || P.portes?.[p]),
    eval: `.claude/fleet/evals/${g.nom}.json`,
  });
}

// ────────────────────────────────────────────────────────── grilles d'évaluation
const RUBRIQUES = [
  { id: 'R1', nom: 'Ancrage', enonce: "Chaque constat porte une ancre valide (CODE, SORTIE, CAPTURE, SOURCE ou DOC)." },
  { id: 'R2', nom: 'Honnêteté de couverture', enonce: 'Le bloc Couverture est présent : examiné, non examiné, angles morts, confiance.' },
  { id: 'R3', nom: 'Exactitude', enonce: "Chaque ancre vérifiée pointe bien là où l'agent le dit.", eliminatoire: true },
  { id: 'R4', nom: 'Priorisation', enonce: 'Les constats sont classés P0…P9, les plus graves en premier.' },
  { id: 'R5', nom: 'Actionnabilité', enonce: 'Chaque constat porte le plus petit correctif qui suffit.' },
  { id: 'R6', nom: 'Économie', enonce: 'Douze constats au maximum, sans redite.' },
];
for (const a of agentsRegistre) {
  const f = R(a.eval);
  if (existsSync(f) && !FORCE) continue;
  ecrire(f, JSON.stringify({
    agent: a.name, version: '1.0.0', seuilAgregation: 50, statut: 'ancrage — non agrégeable',
    _note: "Grille engendrée. Les critères spécifiques doivent être étoffés par `forgeron-de-prompts` avec les défauts réellement rencontrés sur CE projet : une grille générique note générique.",
    rubriquesCommunes: RUBRIQUES,
    criteresSpecifiques: [
      { id: 'S1', enonce: `Respecte la portée de ${a.name} et ne déborde pas sur celle d'un autre agent.` },
      { id: 'S2', enonce: 'Exécute les portes de son domaine et cite leur sortie réelle, ou écrit NON EXÉCUTÉ avec la raison.' },
      { id: 'S3', enonce: "Sépare les constats des soupçons et des hypothèses." },
    ],
    casAncrage: [
      { id: 'C1', situation: 'Aucune porte de son domaine ne peut être exécutée.',
        attendu: 'Écrit NON EXÉCUTÉ avec la raison, et ne rend que des constats de lecture.',
        echecSi: "Rapporte une sortie d'outil qu'il n'a pas lancée." },
      { id: 'C2', situation: 'Il ne trouve rien de grave.',
        attendu: '« rien à signaler sur X, Y, Z ; non examiné : A, B ».', echecSi: '« RAS » sans périmètre.' },
    ],
  }, null, 2) + '\n');
}

// ──────────────────────────────────────────────────────────────────── registre
const PORTES = { ...P.portes };
if (retenus.has('interface')) {
  PORTES['inspection-ecrans'] = {
    command: `node scripts/fleet/inspecter-ecrans.mjs --url ${S.URL} --viewport tous`,
    description: "Ouvre l'application réelle et mesure débordements, troncatures, polices, i18n visible, images, cibles, erreurs de console.",
  };
}
PORTES['flotte-coherence'] = { command: 'node scripts/fleet/verify-fleet.mjs', description: 'Cohérence registre ↔ agents ↔ topics ↔ connaissances ↔ privilèges ↔ journal.' };

const nomsAgents = new Set(agentsRegistre.map((a) => a.name));
const equipage = (...noms) => noms.filter((n) => nomsAgents.has(n));
const portesExistantes = (...ids) => ids.filter((id) => PORTES[id]);

const TOPICS = [];
const topic = (id, intent, commands, paths, crew, execution, gates) => {
  const c = equipage(...crew);
  if (c.length) TOPICS.push({ id, intent, triggers: { generative: true, commands, paths, events: [] }, crew: c, execution, gates: portesExistantes(...gates) });
};
topic('audit-complet', "Balayer toute l'application et rendre un état des lieux prouvé.", ['/flotte-audit'], [],
  ['pilote-visuel', 'parite-mobile', 'gardien-accessibilite', 'inspecteur-design', 'verificateur-i18n', 'architecte', 'relecteur-code', 'sentinelle-securite', 'gardien-donnees', 'conformite-reglementaire', 'mesureur-performance', 'strategie-produit', 'strategie-seo-marketing'],
  'parallele-par-vagues', ['flotte-coherence']);
topic('inspection-visuelle', "Ouvrir l'application et rapporter ce qui se voit.", ['/flotte visuel'],
  ['**/*.tsx', '**/*.jsx', '**/*.css'], ['pilote-visuel', 'parite-mobile'], 'parallele', ['inspection-ecrans']);
topic('revue-de-diff', 'Relire un changement avant la revue humaine.', ['/flotte revue'], [],
  ['relecteur-code', 'sentinelle-securite', 'ingenieur-tests'], 'parallele-puis-sequentiel', ['lint', 'typecheck', 'tests-unitaires']);
topic('boucle-amelioration', 'Pré-analyse → analyse → comparatif → implémentation → test → re-vérification.', ['/flotte-boucle'], [],
  ['pilote-visuel', 'veilleur-design', 'implementeur', 'ingenieur-tests', 'guide-validation'], 'sequentiel', ['lint', 'typecheck', 'tests-unitaires']);
topic('qualite-code', "Élever le code aux standards d'ingénierie logicielle.", ['/flotte artisanat'], [],
  ['artisan-code', 'implementeur', 'ingenieur-tests'], 'sequentiel', ['lint', 'typecheck', 'tests-unitaires']);
topic('securite', "Chercher ce qui expose l'application ou ses utilisateurs.", ['/flotte securite'], ['.env.example'],
  ['sentinelle-securite', 'gardien-donnees'], 'parallele', []);
topic('i18n', 'Tenir la parité des catalogues servis.', ['/flotte i18n'], [], ['verificateur-i18n'], 'sequentiel',
  ['check-i18n-parity', 'check-i18n-parity-prototype', 'check-i18n-en-dur']);
topic('performance', "Mesurer avant d'optimiser, et refuser d'optimiser sans mesure.", ['/flotte perf'], [],
  ['mesureur-performance'], 'sequentiel', ['check-lighthouse', 'build']);
topic('acquisition', 'SEO, message et partage social.', ['/flotte seo'], [], ['strategie-seo-marketing', 'verificateur-i18n'], 'parallele', ['build']);
topic('validation-humaine', "Dire à l'humain quoi vérifier, dans quel ordre.", ['/flotte valider'], [], ['guide-validation'], 'sequentiel', []);
topic('meta-flotte', 'Améliorer la flotte elle-même.', ['/flotte meta', '/flotte-eval'], ['.claude/**'],
  ['forgeron-de-prompts', 'evaluateur', 'archiviste'], 'sequentiel', ['flotte-coherence']);

const registre = {
  version: '1.0.0', updated: new Date().toISOString().slice(0, 10),
  description: `Registre de la flotte d'agents de ${P.identite.nom}. SOURCE DE VÉRITÉ, vérifiée par scripts/fleet/verify-fleet.mjs.`,
  engendrePar: 'scripts/fleet/generer-flotte.mjs', profil: '.claude/fleet/projet.json',
  scope: "Outillage de développement Claude Code. Ne s'exécute jamais dans le produit servi aux utilisateurs.",
  masterInstruction: '.claude/skills/flotte-regles/SKILL.md',
  policy: {
    maxCrewPerWave: 5, parallelReadOnly: true, sequentialWrites: true,
    humanGate: 'pr-brouillon', neverMerge: true, neverDeploy: true, evalAggregationThreshold: 50,
    evidenceTypes: ['CODE', 'SORTIE', 'CAPTURE', 'SOURCE', 'DOC'],
    certaintyLevels: ['CONSTAT', 'SOUPCON', 'HYPOTHESE'],
    maxConstatsParRapport: 12,
    priorities: P.priorites.map((l, i) => ({ id: 'P' + i, label: l })),
    arbitrationOrder: P.priorites,
  },
  tiers: PALIERS,
  rubriques: Object.fromEntries(RUBRIQUES.map((r) => [r.id, { nom: r.nom, description: r.enonce, ...(r.eliminatoire ? { eliminatoire: true } : {}) }])),
  agents: agentsRegistre,
  topics: TOPICS,
  gates: PORTES,
  journal: { runs: '.claude/fleet/journal/runs.jsonl', missions: '.claude/fleet/journal/missions',
    append_only: true, written_by: 'hooks', rollback: 'node scripts/fleet/journal.mjs rollback <mission>' },
  departementsEcartes: ecartes,
};
if (!existsSync(R('.claude/fleet/registry.json')) || FORCE) ecrire(R('.claude/fleet/registry.json'), JSON.stringify(registre, null, 2) + '\n');

// ─────────────────────────────── noyau : instruction maître, skills, scripts
const NOYAU_FICHIERS = [
  '.claude/skills/flotte-regles/SKILL.md', '.claude/skills/flotte/SKILL.md',
  '.claude/skills/flotte-audit/SKILL.md', '.claude/skills/flotte-boucle/SKILL.md',
  '.claude/skills/flotte-eval/SKILL.md', '.claude/skills/flotte-init/SKILL.md',
  '.claude/skills/flotte-nuit/SKILL.md', '.claude/fleet/journal/README.md',
  'scripts/fleet/verify-fleet.mjs', 'scripts/fleet/journal.mjs', 'scripts/fleet/hook-journal.mjs',
  'scripts/fleet/inspecter-ecrans.mjs', 'scripts/fleet/reconnaitre-projet.mjs',
  'scripts/fleet/generer-flotte.mjs', 'scripts/fleet/chantier.mjs', 'scripts/fleet/rapport-nuit.mjs',
  '.claude/fleet/gabarits/agents.mjs',
];
const copies = [];
if (RACINE !== NOYAU) {
  for (const f of NOYAU_FICHIERS) {
    const src = join(NOYAU, f);
    if (!existsSync(src)) continue;
    if (existsSync(R(f)) && !FORCE) continue;
    if (!SEC) { mkdirSync(dirname(R(f)), { recursive: true }); copyFileSync(src, R(f)); }
    copies.push(f);
  }
}

// réglages : permissions et hooks (jamais écrasés sans --force)
const reglages = {
  $schema: 'https://json.schemastore.org/claude-code-settings.json',
  permissions: {
    deny: ['Read(./.env)', 'Read(./.env.local)', 'Read(./**/.env)',
      'Edit(.claude/fleet/journal/**)', 'Write(.claude/fleet/journal/runs.jsonl)',
      'Bash(git push --force*)', 'Bash(git push -f*)', 'Bash(git reset --hard*)', 'Bash(git clean -fdx*)',
      'Bash(npm publish*)', 'Bash(pnpm publish*)', 'Bash(vercel deploy*)', 'Bash(vercel --prod*)',
      'Bash(supabase db push*)',
      // Ces interdits sont posés MÊME si le projet n'utilise pas le service :
      // une règle « deny » sur un outil absent ne coûte rien, alors qu'un
      // service branché plus tard hériterait sinon d'un agent sans garde-fou.
      'mcp__github__merge_pull_request', 'mcp__github__enable_pr_auto_merge',
      'mcp__Vercel__deploy_to_vercel',
      'mcp__Supabase__apply_migration', 'mcp__Supabase__execute_sql', 'mcp__Supabase__deploy_edge_function'],
    ask: ['Bash(git push*)', 'Bash(git commit*)', 'mcp__github__create_pull_request'],
    allow: ['Bash(node scripts/fleet/*)', 'Bash(git status*)', 'Bash(git diff*)', 'Bash(git log*)', 'Bash(git rev-parse*)',
      ...Object.values(PORTES).map((g) => `Bash(${g.command.split(' ').slice(0, 2).join(' ')}*)`).filter((v, i, a) => a.indexOf(v) === i),
      'Read(.claude/fleet/**)'],
  },
  hooks: Object.fromEntries(['SubagentStart', 'SubagentStop'].map((h) => [h,
    [{ hooks: [{ type: 'command', command: 'node', args: ['scripts/fleet/hook-journal.mjs'], timeout: 10 }] }]])),
};
reglages.hooks.PostToolUse = [{ matcher: 'Edit|Write|NotebookEdit',
  hooks: [{ type: 'command', command: 'node', args: ['scripts/fleet/hook-journal.mjs'], timeout: 10 }] }];
if (!existsSync(R('.claude/settings.json')) || FORCE) ecrire(R('.claude/settings.json'), JSON.stringify(reglages, null, 2) + '\n');
if (!SEC) {
  mkdirSync(R('.claude/fleet/journal/missions'), { recursive: true });
  for (const f of ['runs.jsonl', 'couverture.jsonl']) if (!existsSync(R('.claude/fleet/journal', f))) ecrire(R('.claude/fleet/journal', f), '');
  if (!existsSync(R('.claude/fleet/.gitignore'))) ecrire(R('.claude/fleet/.gitignore'), 'captures/\n');
}

// ───────────────────────────────────────────────────────────────── rapport
console.log(`${SEC ? '[SEC — rien écrit] ' : ''}Flotte pour « ${P.identite.nom} »\n`);
console.log(`Départements retenus : ${[...retenus].join(', ') || 'aucun'}`);
if (ecartes.length) {
  console.log('Départements écartés :');
  for (const e of ecartes) console.log(`  · ${e.id.padEnd(14)} ${e.raison}`);
}
console.log(`\nAgents engendrés : ${ecrits.length}`);
for (const f of ecrits) console.log(`  + ${f}`);
if (remplaces.length) {
  console.log(`\nDéjà couverts sous un autre nom (aucun doublon créé) : ${remplaces.length}`);
  for (const f of remplaces) console.log(`  ~ ${f}`);
}
if (ignores.length) {
  console.log(`\nAgents CONSERVÉS tels quels (déjà présents, --force pour écraser) : ${ignores.length}`);
  for (const f of ignores) console.log(`  = ${f}`);
}
if (copies.length) console.log(`\nNoyau copié : ${copies.length} fichier(s)`);
console.log(`\nPortes du registre : ${Object.keys(PORTES).length} · Topics : ${TOPICS.length}`);
if (P.incertitudes?.length) {
  console.log(`\n⚠ ${P.incertitudes.length} point(s) NON établi(s) par la reconnaissance — à trancher avec le propriétaire :`);
  for (const i of P.incertitudes) console.log(`  · ${i.quoi} — ${i.pourquoi}`);
}
console.log(`\nÉtape suivante : node scripts/fleet/verify-fleet.mjs`);
