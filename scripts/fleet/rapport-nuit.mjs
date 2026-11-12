#!/usr/bin/env node
// Rapport du matin — ce que la flotte a fait pendant que personne ne regardait.
//
// Il ne raconte rien : il lit le chantier, le journal et git, et met en face de
// chaque affirmation la preuve qui la soutient. Un rapport de nuit qui se lit
// comme un récit est un rapport qu'on ne peut pas vérifier.
//
//   node scripts/fleet/rapport-nuit.mjs [--depuis 12h|3j|<sha>] [--sortie <fichier.md>]
import { readFileSync, existsSync, writeFileSync, readdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const arg = (n, d = null) => { const i = process.argv.indexOf('--' + n); return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : d; };
const git = (...a) => { try { return execFileSync('git', a, { encoding: 'utf8', maxBuffer: 32e6, stdio: ['ignore','pipe','ignore'] }).trim(); } catch { return ''; } };
const lireJson = (f) => { try { return JSON.parse(readFileSync(f, 'utf8')); } catch { return null; } };
const lireJsonl = (f) => existsSync(f) ? readFileSync(f, 'utf8').split('\n').filter(Boolean).map((l) => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean) : [];

const depuis = arg('depuis', '16h');
const estSha = /^[0-9a-f]{7,40}$/i.test(depuis);
const sinceGit = estSha ? null : depuis.replace(/(\d+)h/, '$1 hours ago').replace(/(\d+)j/, '$1 days ago');
const borne = estSha ? `${depuis}..HEAD` : null;

const commits = (borne ? git('log', '--format=%h|%ad|%s', '--date=format:%d/%m %H:%M', borne)
                       : git('log', `--since=${sinceGit}`, '--format=%h|%ad|%s', '--date=format:%d/%m %H:%M'))
  .split('\n').filter(Boolean).map((l) => { const [sha, date, ...s] = l.split('|'); return { sha, date, sujet: s.join('|') }; });

const chantier = lireJson('.claude/fleet/chantier.json') || { items: [] };
const runs = lireJsonl('.claude/fleet/journal/runs.jsonl');
const couv = lireJsonl('.claude/fleet/journal/couverture.jsonl');

const depuisMs = estSha ? 0 : Date.now() - (parseInt(depuis) || 16) * (depuis.includes('j') ? 864e5 : 36e5);
const recent = (t) => !t || estSha || new Date(t).getTime() >= depuisMs;

const faites = chantier.items.filter((x) => x.statut === 'fait' && recent(x.fini));
const bloquees = chantier.items.filter((x) => x.statut === 'bloque' && recent(x.fini));
const enCours = chantier.items.filter((x) => x.statut === 'en-cours');
const restantes = chantier.items.filter((x) => x.statut === 'a-faire');

const agents = {};
for (const r of runs) if (r.agent && recent(r.t)) agents[r.agent] = (agents[r.agent] || 0) + 1;
const mutations = runs.filter((r) => r.outil && /Edit|Write/.test(r.outil) && recent(r.t));

// Captures produites pendant la période — la preuve visuelle.
let captures = [];
try {
  for (const d of readdirSync('.claude/fleet/captures')) {
    const rap = `.claude/fleet/captures/${d}/rapport.json`;
    if (!existsSync(rap)) continue;
    const j = lireJson(rap);
    if (j && recent(j.horodatage)) captures.push({ dossier: d, synthese: j.synthese, ecrans: j.ecrans?.length || 0 });
  }
} catch { /* aucune capture */ }

const L = [];
const p = (s = '') => L.push(s);

p(`# Rapport de nuit — ${new Date().toLocaleString('fr-CA')}`);
p('');
p(`Période : ${estSha ? `depuis ${depuis}` : `les ${depuis} dernières heures`} · Branche : ${git('rev-parse','--abbrev-ref','HEAD') || '?'}`);
p('');

if (!faites.length && !bloquees.length && !commits.length) {
  p('## Rien à signaler');
  p('');
  p("Aucune unité terminée, aucune bloquée, aucun commit sur la période. Soit rien n'a tourné, soit le chantier était vide.");
  p('');
  p(`Chantier : ${restantes.length} unité(s) à faire, ${enCours.length} en cours.`);
} else {
  p('## En une ligne');
  p('');
  p(`**${faites.length} unité(s) terminée(s)**, ${bloquees.length} bloquée(s), ${commits.length} commit(s), ${mutations.length} fichier(s) modifié(s). ${restantes.length} unité(s) restent au chantier.`);
  p('');

  if (faites.length) {
    p('## Ce qui a été fait');
    p('');
    for (const x of faites) {
      p(`### ${x.titre}`);
      p('');
      p(`- Priorité : \`${x.priorite}\`${x.topic ? ` · Topic : \`${x.topic}\`` : ''}`);
      if (x.resume) p(`- Résultat : ${x.resume}`);
      if (x.ancre) p(`- Ancre d'origine : \`${x.ancre}\``);
      if (x.commits?.length) {
        p(`- Commits : ${x.commits.map((s) => `\`${s}\``).join(', ')}`);
        for (const sha of x.commits) {
          const stat = git('show', '--stat', '--format=', sha);
          if (stat) { p(''); p('```'); p(stat.split('\n').slice(0, 12).join('\n')); p('```'); }
        }
      }
      p('');
    }
  }

  if (bloquees.length) {
    p('## Ce qui est bloqué — ta décision est requise');
    p('');
    for (const x of bloquees) p(`- **${x.titre}** (\`${x.priorite}\`) — ${x.raison}`);
    p('');
    p('Une unité bloquée ne se débloquera pas seule : elle a rencontré une règle d\'arrêt (P0–P2, porte cassée hors zone, ancre périmée, décision d\'architecture).');
    p('');
  }

  if (commits.length) {
    p('## Commits');
    p('');
    p('| Quand | SHA | Sujet |');
    p('|---|---|---|');
    for (const c of commits) p(`| ${c.date} | \`${c.sha}\` | ${c.sujet.replace(/\|/g, '\\|')} |`);
    p('');
    const base = commits[commits.length - 1]?.sha;
    if (base) {
      p('### Voir tout le changement');
      p('');
      p('```bash');
      p(`git diff ${base}~1..HEAD          # le diff complet`);
      p(`git log -p ${base}~1..HEAD        # avec les messages`);
      p('```');
      p('');
    }
  }

  if (captures.length) {
    p('## Preuve visuelle');
    p('');
    for (const c of captures) {
      p(`- \`.claude/fleet/captures/${c.dossier}/\` — ${c.ecrans} écran(s) capturé(s)`);
      if (c.synthese) {
        const s = c.synthese;
        p(`  · débordements ${s.debordementsDocument ?? '?'} · hors cadre ${s.elementsHorsCadre ?? '?'} · texte tronqué ${s.textesTronques ?? '?'} · images cassées ${s.imagesCassees ?? '?'} · erreurs console ${s.erreursConsole ?? '?'}`);
      }
    }
    p('');
  }

  if (Object.keys(agents).length) {
    p('## Qui a travaillé');
    p('');
    p('| Agent | Événements |');
    p('|---|---|');
    for (const [a, n] of Object.entries(agents).sort((x, y) => y[1] - x[1])) p(`| \`${a}\` | ${n} |`);
    p('');
  }

  if (couv.length) {
    p('## Couverture déclarée');
    p('');
    for (const c of couv.filter((x) => recent(x.t)).slice(-8)) {
      p(`- \`${c.agent}\` — confiance **${c.confiance || '?'}** — non examiné : ${c.nonExamine || '—'}`);
    }
    p('');
  }
}

p('## À vérifier de ton côté');
p('');
if (faites.length) {
  p('Lance la liste de validation pour ce qui a changé :');
  p('');
  p('```');
  p('/flotte valider');
  p('```');
  p('');
}
p('Pour défaire une nuit entière :');
p('');
p('```bash');
p('node scripts/fleet/journal.mjs resume            # ce qui a été touché, par qui');
p('node scripts/fleet/journal.mjs rollback <mission>  # imprime la commande exacte');
p('```');
p('');
p('---');
p('');
p('_Rapport engendré par `scripts/fleet/rapport-nuit.mjs` à partir du chantier, du journal et de git. Aucune affirmation n\'y est écrite à la main._');

const texte = L.join('\n') + '\n';
const sortie = arg('sortie');
if (sortie) { writeFileSync(sortie, texte); console.log(`Rapport écrit : ${sortie}`); }
else console.log(texte);
