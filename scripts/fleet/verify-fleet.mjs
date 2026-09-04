#!/usr/bin/env node
// Garde de cohérence de la flotte d'agents.
//
// Il existe parce qu'un registre, des prompts, des grilles et des permissions
// qui vieillissent séparément finissent par se contredire EN SILENCE — et un
// garde qu'aucune porte n'exécute ne garde rien. Celui-ci tourne en CI.
//
//   node scripts/fleet/verify-fleet.mjs            cohérence complète
//   node scripts/fleet/verify-fleet.mjs --secrets  + balayage de secrets sur le diff
//   node scripts/fleet/verify-fleet.mjs --json     sortie machine
//
// Code de sortie : 0 = conforme, 1 = au moins une violation.
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';

const REGISTRE = '.claude/fleet/registry.json';
const DOSSIER_AGENTS = '.claude/agents';
const INSTRUCTION = 'flotte-regles';
const OUTILS_ECRITURE = ['Write', 'Edit', 'NotebookEdit'];

const violations = [];
const avertissements = [];
const ko = (regle, message) => violations.push({ regle, message });
const attention = (regle, message) => avertissements.push({ regle, message });

// ---------------------------------------------------------- frontmatter YAML
function frontmatter(texte) {
  const m = texte.match(/^---\n([\s\S]*?)\n---\n/);
  if (!m) return null;
  const o = {};
  for (const ligne of m[1].split('\n')) {
    const p = ligne.match(/^([a-zA-Z_-]+):\s*(.*)$/);
    if (!p) continue;
    let v = p[2].trim();
    if (v.startsWith('[') && v.endsWith(']')) {
      v = v.slice(1, -1).split(',').map((s) => s.trim().replace(/^["']|["']$/g, '')).filter(Boolean);
    } else {
      v = v.replace(/^["']|["']$/g, '');
    }
    o[p[1]] = v;
  }
  return o;
}
const listeOutils = (v) => (Array.isArray(v) ? v : String(v || '').split(',').map((s) => s.trim()).filter(Boolean));

// ------------------------------------------------------------------ registre
if (!existsSync(REGISTRE)) {
  console.error(`✗ ${REGISTRE} est introuvable — la flotte n'a pas de source de vérité.`);
  process.exit(1);
}
let R;
try { R = JSON.parse(readFileSync(REGISTRE, 'utf8')); }
catch (e) { console.error(`✗ ${REGISTRE} n'est pas un JSON valide : ${e.message}`); process.exit(1); }

const paliers = R.tiers || {};
const portes = R.gates || {};
const parNom = new Map();

// ------------------------------------------------------- agents du registre
for (const a of R.agents || []) {
  const ctx = `agent « ${a.name} »`;
  parNom.set(a.name, a);

  if (!existsSync(a.file)) { ko('A1', `${ctx} : fichier déclaré introuvable — ${a.file}`); continue; }
  const fm = frontmatter(readFileSync(a.file, 'utf8'));
  if (!fm) { ko('A2', `${ctx} : ${a.file} n'a pas de frontmatter YAML en tête.`); continue; }

  if (fm.name !== a.name) ko('A3', `${ctx} : le frontmatter dit « ${fm.name} », le registre dit « ${a.name} ».`);
  if (!fm.description) ko('A4', `${ctx} : « description » manquante — c'est le déclencheur de délégation.`);
  else {
    const mots = fm.description.split(/\s+/).length;
    if (mots > 60) ko('A5', `${ctx} : description de ${mots} mots (max 60) — elle pèse sur le contexte de chaque session.`);
    else if (mots > 55) attention('A5', `${ctx} : description de ${mots} mots, proche du plafond de 60.`);
  }

  const palier = paliers[a.tier];
  if (!palier) ko('A6', `${ctx} : palier « ${a.tier} » absent de registry.tiers.`);
  else if (fm.model !== palier.model) ko('A7', `${ctx} : modèle « ${fm.model} » ≠ « ${palier.model} » attendu pour le palier ${a.tier}.`);

  const outils = listeOutils(fm.tools);
  const ecrit = outils.filter((t) => OUTILS_ECRITURE.includes(t));
  if (a.privilege === 'lecture' && ecrit.length) {
    ko('P1', `${ctx} : déclaré « lecture » mais possède ${ecrit.join(', ')}. Le moindre privilège est une liste blanche, pas une promesse.`);
  }
  if (a.privilege === 'ecriture' && !ecrit.length) {
    ko('P2', `${ctx} : déclaré « ecriture » mais aucun outil d'écriture — le registre ment sur ce qu'il peut faire.`);
  }
  if (!outils.length) attention('P3', `${ctx} : aucune liste d'outils — il hérite de tout. Est-ce voulu ?`);

  const skills = Array.isArray(fm.skills) ? fm.skills : listeOutils(fm.skills);
  if (!skills.includes(INSTRUCTION)) {
    ko('I1', `${ctx} : l'instruction maître n'est pas préchargée. Ajouter « skills: [${INSTRUCTION}] » au frontmatter.`);
  }

  if (a.maxTurns && fm.maxTurns && +fm.maxTurns !== a.maxTurns) {
    ko('A8', `${ctx} : maxTurns ${fm.maxTurns} ≠ ${a.maxTurns} au registre.`);
  }

  for (const g of a.gates || []) if (!portes[g]) ko('G1', `${ctx} : porte « ${g} » inconnue de registry.gates.`);

  for (const k of a.knowledge || []) {
    if (!existsSync(k)) ko('C1', `${ctx} : connaissance déclarée introuvable — ${k}. Un pointeur mort enseigne un dépôt qui n'existe plus.`);
  }

  if (!a.eval) ko('E1', `${ctx} : aucun jeu d'évaluation. Un agent sans grille n'est pas évaluable, donc pas améliorable.`);
  else if (!existsSync(a.eval)) ko('E2', `${ctx} : jeu d'évaluation introuvable — ${a.eval}`);
  else {
    let ev;
    try { ev = JSON.parse(readFileSync(a.eval, 'utf8')); }
    catch (e) { ko('E3', `${ctx} : ${a.eval} n'est pas un JSON valide : ${e.message}`); }
    if (ev) {
      const n = (ev.rubriquesCommunes || []).length + (ev.criteresSpecifiques || []).length;
      if (n < 3) ko('E4', `${ctx} : ${n} critère(s). La fourchette utile est 3 à 13.`);
      if (n > 13) attention('E4', `${ctx} : ${n} critères — au-delà de 13, le juge se disperse.`);
      if (!(ev.rubriquesCommunes || []).some((r) => r.eliminatoire)) {
        ko('E5', `${ctx} : aucune rubrique éliminatoire. R3 (exactitude) doit l'être, sinon rien ne garantit les ancres.`);
      }
      if (!(ev.casAncrage || []).length) ko('E6', `${ctx} : aucun cas d'ancrage.`);
      if (ev.seuilAgregation !== R.policy.evalAggregationThreshold) {
        ko('E7', `${ctx} : seuil d'agrégation ${ev.seuilAgregation} ≠ ${R.policy.evalAggregationThreshold} au registre.`);
      }
    }
  }
}

// ------------------------------- agents présents sur disque mais hors registre
const surDisque = [];
if (existsSync(DOSSIER_AGENTS)) {
  for (const d of readdirSync(DOSSIER_AGENTS)) {
    const p = join(DOSSIER_AGENTS, d);
    if (!statSync(p).isDirectory()) continue;
    for (const f of readdirSync(p).filter((x) => x.endsWith('.md'))) {
      const chemin = join(p, f);
      surDisque.push(chemin);
      const fm = frontmatter(readFileSync(chemin, 'utf8'));
      if (fm?.name && !parNom.has(fm.name)) {
        ko('A9', `agent « ${fm.name} » (${chemin}) est sur le disque mais absent du registre — il échappe à tout audit.`);
      }
    }
  }
}
if (surDisque.length !== (R.agents || []).length) {
  attention('A10', `${surDisque.length} fichier(s) d'agent sur disque pour ${(R.agents || []).length} au registre.`);
}

// -------------------------------------------------------------------- topics
const ids = new Set();
for (const t of R.topics || []) {
  const ctx = `topic « ${t.id} »`;
  if (ids.has(t.id)) ko('T1', `${ctx} : identifiant en double.`);
  ids.add(t.id);
  if (!t.intent) ko('T2', `${ctx} : aucune intention déclarée.`);

  for (const nom of t.crew || []) if (!parNom.has(nom)) ko('T3', `${ctx} : équipage → agent « ${nom} » inconnu du registre.`);
  if (!(t.crew || []).length) ko('T4', `${ctx} : équipage vide.`);

  const par_vagues = String(t.execution || '').includes('vagues');
  if (!par_vagues && (t.crew || []).length > R.policy.maxCrewPerWave) {
    ko('T5', `${ctx} : ${t.crew.length} agents pour un plafond de ${R.policy.maxCrewPerWave} par vague. Découper en vagues, ou déclarer execution « parallele-par-vagues ».`);
  }

  const d = t.triggers || {};
  const aDeclencheur = d.generative || (d.commands || []).length || (d.paths || []).length || (d.events || []).length;
  if (!aDeclencheur) ko('T6', `${ctx} : aucun déclencheur — ce topic ne peut jamais s'activer.`);
  if (!d.generative && !(d.commands || []).length) {
    attention('T7', `${ctx} : ni déclencheur génératif ni commande — il ne s'activera que par chemin ou événement.`);
  }
  for (const g of t.gates || []) if (!portes[g]) ko('G2', `${ctx} : porte « ${g} » inconnue de registry.gates.`);
}

// -------------------------------------------------------------------- portes
for (const [nom, g] of Object.entries(portes)) {
  if (!g.command) ko('G3', `porte « ${nom} » : aucune commande.`);
  if (!g.description) attention('G4', `porte « ${nom} » : aucune description.`);
  const m = String(g.command || '').match(/node\s+((?:scripts|prototype)\/[\w./-]+)/);
  if (m && !existsSync(m[1])) ko('G5', `porte « ${nom} » : le script ${m[1]} n'existe pas — la porte ne peut pas passer.`);
}

// ---------------------------------------------------- instruction et journal
if (!existsSync(R.masterInstruction || '')) {
  ko('I2', `instruction maître introuvable — ${R.masterInstruction}`);
}
const REGLAGES = '.claude/settings.json';
if (!existsSync(REGLAGES)) {
  ko('J1', `${REGLAGES} manquant : sans lui, ni journal ni interdits.`);
} else {
  let s;
  try { s = JSON.parse(readFileSync(REGLAGES, 'utf8')); }
  catch (e) { ko('J2', `${REGLAGES} n'est pas un JSON valide : ${e.message}`); }
  if (s) {
    const deny = s.permissions?.deny || [];
    if (!deny.some((r) => r.includes('.claude/fleet/journal'))) {
      ko('J3', `${REGLAGES} : aucune règle « deny » sur le journal. Un agent qui peut éditer sa trace n'en laisse pas.`);
    }
    for (const h of ['SubagentStart', 'SubagentStop', 'PostToolUse']) {
      if (!s.hooks?.[h]) ko('J4', `${REGLAGES} : hook ${h} absent — le journal serait écrit par les agents, pas par le harnais.`);
    }
    for (const i of ['mcp__github__merge_pull_request', 'mcp__Vercel__deploy_to_vercel', 'mcp__Supabase__apply_migration']) {
      if (!deny.includes(i)) ko('J5', `${REGLAGES} : « ${i} » n'est pas interdit. Aucun agent ne fusionne, ne déploie ni ne migre.`);
    }
  }
}

// -------------------------------------------------- balayage de secrets (opt)
if (process.argv.includes('--secrets')) {
  const MOTIFS = [
    [/\bsk-[A-Za-z0-9_-]{20,}\b/, 'clé de type sk-'],
    [/\bgh[pousr]_[A-Za-z0-9]{30,}\b/, 'jeton GitHub'],
    [/\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\./, 'JWT'],
    [/-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----/, 'clé privée'],
    [/(SUPABASE_SERVICE_ROLE_KEY|STRIPE_SECRET_KEY|TOKEN_ENC_KEY)\s*=\s*["']?[A-Za-z0-9_\-.]{12,}/, 'secret nommé avec valeur'],
  ];
  let diff = '';
  try { diff = execFileSync('git', ['diff', 'origin/main...HEAD', '--unified=0'], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }); }
  catch { try { diff = execFileSync('git', ['diff', 'HEAD', '--unified=0'], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }); } catch { diff = ''; } }
  let fichier = '';
  for (const ligne of diff.split('\n')) {
    if (ligne.startsWith('+++ b/')) { fichier = ligne.slice(6); continue; }
    if (!ligne.startsWith('+') || ligne.startsWith('+++')) continue;
    if (/\.env\.example$/.test(fichier)) continue;
    for (const [re, nom] of MOTIFS) {
      if (re.test(ligne)) ko('S1', `secret probable (${nom}) ajouté dans ${fichier}. La valeur n'est pas reproduite ici.`);
    }
  }
}

// ------------------------------------------------------------------- rapport
const resume = {
  agents: (R.agents || []).length,
  topics: (R.topics || []).length,
  portes: Object.keys(portes).length,
  lecture: (R.agents || []).filter((a) => a.privilege === 'lecture').length,
  ecriture: (R.agents || []).filter((a) => a.privilege === 'ecriture').length,
  violations: violations.length,
  avertissements: avertissements.length,
};

if (process.argv.includes('--json')) {
  console.log(JSON.stringify({ resume, violations, avertissements }, null, 2));
} else {
  console.log(`Flotte : ${resume.agents} agents (${resume.lecture} en lecture, ${resume.ecriture} en écriture) · ${resume.topics} topics · ${resume.portes} portes`);
  if (avertissements.length) {
    console.log(`\n⚠ ${avertissements.length} avertissement(s) :`);
    for (const a of avertissements) console.log(`  [${a.regle}] ${a.message}`);
  }
  if (violations.length) {
    console.log(`\n✗ ${violations.length} violation(s) :`);
    for (const v of violations) console.log(`  [${v.regle}] ${v.message}`);
    console.log('\nLa flotte est incohérente. Corrigez le registre OU les fichiers — pas seulement le message.');
  } else {
    console.log('\n✓ Registre, agents, topics, portes, connaissances, grilles, privilèges et journal sont cohérents.');
  }
}
process.exit(violations.length ? 1 : 0);
