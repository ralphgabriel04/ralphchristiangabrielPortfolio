#!/usr/bin/env node
// Journal de la flotte — lecture, ouverture de mission, couverture, retour arrière.
//
//   node scripts/fleet/journal.mjs mission --id <id> --topic <topic> [--agents "a,b"]
//   node scripts/fleet/journal.mjs resume [--mission <id>] [--agent <nom>] [--limite 40]
//   node scripts/fleet/journal.mjs couverture --agent <nom> --json '<objet>'
//   node scripts/fleet/journal.mjs rollback <id>
//
// `rollback` IMPRIME la commande, il ne l'exécute pas. Défaire est une décision,
// pas un effet de bord.
import { appendFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const RUNS = '.claude/fleet/journal/runs.jsonl';
const COUV = '.claude/fleet/journal/couverture.jsonl';
const [, , commande, ...reste] = process.argv;
const arg = (n, d = null) => { const i = reste.indexOf('--' + n); return i !== -1 && reste[i + 1] ? reste[i + 1] : d; };
const git = (...a) => { try { return execFileSync('git', a, { encoding: 'utf8' }).trim(); } catch { return ''; } };
const lire = (f) => (existsSync(f) ? readFileSync(f, 'utf8').split('\n').filter(Boolean).map((l) => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean) : []);
const ecrire = (f, o) => { mkdirSync('.claude/fleet/journal', { recursive: true }); appendFileSync(f, JSON.stringify(o) + '\n'); };

switch (commande) {
  case 'mission': {
    const id = arg('id') || 'mission-' + Date.now();
    const o = {
      t: new Date().toISOString(), evenement: 'MissionOuverte', mission: id,
      topic: arg('topic'), base: arg('base') || git('rev-parse', '--short', 'HEAD'),
      branche: git('rev-parse', '--abbrev-ref', 'HEAD'),
      agents: (arg('agents') || '').split(',').map((s) => s.trim()).filter(Boolean),
    };
    ecrire(RUNS, o);
    console.log(JSON.stringify(o, null, 2));
    console.log(`\nRetour arrière disponible avec :\n  node scripts/fleet/journal.mjs rollback ${id}`);
    break;
  }

  case 'couverture': {
    let charge = {};
    try { charge = JSON.parse(arg('json') || '{}'); } catch { charge = { brut: arg('json') }; }
    const o = { t: new Date().toISOString(), agent: arg('agent'), mission: arg('mission'), ...charge };
    ecrire(COUV, o);
    console.log('couverture enregistrée');
    break;
  }

  case 'resume': {
    const limite = +(arg('limite') || 40);
    const mission = arg('mission'), agent = arg('agent');
    let l = lire(RUNS);
    if (mission) l = l.filter((x) => x.mission === mission);
    if (agent) l = l.filter((x) => x.agent === agent);
    if (!l.length) { console.log('Journal vide' + (mission || agent ? ' pour ce filtre.' : ". Aucune mission n'a encore tourné.")); break; }
    const missions = l.filter((x) => x.evenement === 'MissionOuverte');
    if (missions.length) {
      console.log('MISSIONS');
      for (const m of missions) console.log(`  ${m.t.slice(0, 16)}  ${m.mission}  topic=${m.topic}  base=${m.base}  agents=${(m.agents || []).join(' ')}`);
      console.log('');
    }
    const parAgent = {};
    for (const x of l) if (x.agent) parAgent[x.agent] = (parAgent[x.agent] || 0) + 1;
    if (Object.keys(parAgent).length) {
      console.log('ÉVÉNEMENTS PAR AGENT');
      for (const [a, n] of Object.entries(parAgent).sort((x, y) => y[1] - x[1])) console.log(`  ${String(n).padStart(4)}  ${a}`);
      console.log('');
    }
    const mutations = l.filter((x) => x.outil && /Edit|Write|NotebookEdit/.test(x.outil));
    console.log(`MUTATIONS (${mutations.length})`);
    for (const m of mutations.slice(-limite)) console.log(`  ${m.t.slice(0, 19)}  ${m.agent || 'session'}  ${m.outil}  ${m.cible || ''}`);
    const couv = lire(COUV);
    if (couv.length) {
      console.log(`\nCOUVERTURE DÉCLARÉE (${couv.length})`);
      for (const c of couv.slice(-10)) console.log(`  ${c.t.slice(0, 19)}  ${c.agent}  confiance=${c.confiance || '?'}  non examiné: ${c.nonExamine || '—'}`);
    }
    break;
  }

  case 'rollback': {
    const id = reste[0];
    if (!id) { console.error('Usage : journal.mjs rollback <id-de-mission>'); process.exit(2); }
    const m = lire(RUNS).reverse().find((x) => x.evenement === 'MissionOuverte' && x.mission === id);
    if (!m) {
      console.error(`Mission « ${id} » absente du journal.`);
      console.error('Missions connues :', lire(RUNS).filter((x) => x.mission).map((x) => x.mission).join(', ') || '(aucune)');
      process.exit(1);
    }
    const tete = git('rev-parse', '--short', 'HEAD');
    const commits = git('log', '--oneline', `${m.base}..HEAD`);
    console.log(`Mission   : ${id}`);
    console.log(`Topic     : ${m.topic || '—'}`);
    console.log(`Branche   : ${m.branche}`);
    console.log(`Base      : ${m.base}    HEAD actuel : ${tete}`);
    console.log(`\nCommits de la mission :\n${commits || '  (aucun — rien à défaire)'}`);
    if (!commits) break;
    console.log('\nPour voir exactement ce qui changerait :');
    console.log(`  git diff ${m.base}..HEAD`);
    console.log('\nPour défaire en conservant l\'historique (recommandé) :');
    console.log(`  git revert --no-commit ${m.base}..HEAD && git commit -m "revert: mission ${id}"`);
    console.log('\nPour défaire un seul commit :');
    console.log('  git revert <sha>');
    console.log('\nCes commandes ne sont PAS exécutées. Défaire est une décision.');
    break;
  }

  default:
    console.log(readFileSync(new URL(import.meta.url), 'utf8').split('\n').slice(1).filter((l) => l.startsWith('//')).map((l) => l.replace(/^\/\/ ?/, '')).join('\n'));
    process.exit(commande ? 2 : 0);
}
