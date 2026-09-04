#!/usr/bin/env node
// Chantier — la file de travail reprenable de la flotte.
//
// POURQUOI CE FICHIER EXISTE. Le travail autonome ne peut pas reposer sur « je
// détecte que la limite est levée et je repars ». Rien ne garantit qu'une
// session survive à une interruption : plafond d'usage, fenêtre de contexte
// pleine, machine qui dort, tâche planifiée qui ne tire pas.
//
// La réponse est de rendre l'interruption SANS CONSÉQUENCE : l'état vit sur le
// disque, une unité de travail est petite et close, et n'importe quel
// déclenchement ultérieur reprend exactement là où le précédent s'est arrêté.
// Un travail dont la reprise est gratuite n'a pas besoin de deviner quand il
// pourra reprendre.
//
//   node scripts/fleet/chantier.mjs etat
//   node scripts/fleet/chantier.mjs ajouter --titre "…" [--topic t] [--priorite P5] [--note "…"]
//   node scripts/fleet/chantier.mjs importer --json '[{"titre":"…"}, …]'
//   node scripts/fleet/chantier.mjs suivant            # réserve l'unité suivante
//   node scripts/fleet/chantier.mjs terminer <id> --resume "…" [--commit <sha>]
//   node scripts/fleet/chantier.mjs bloquer  <id> --raison "…"
//   node scripts/fleet/chantier.mjs relacher <id>      # rend une unité réservée
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const F = '.claude/fleet/chantier.json';
const MAX_TENTATIVES = 3;   // au-delà, l'unité est bloquée : une nuit ne se passe
                            // pas à rejouer le même échec.
const PRIORITES = ['P0','P1','P2','P3','P4','P5','P6','P7','P8','P9'];

const [, , cmd, ...reste] = process.argv;
const arg = (n, d = null) => { const i = reste.indexOf('--' + n); return i !== -1 && reste[i + 1] ? reste[i + 1] : d; };
const git = (...a) => { try { return execFileSync('git', a, { encoding: 'utf8', stdio: ['ignore','pipe','ignore'] }).trim(); } catch { return ''; } };

const charger = () => existsSync(F) ? JSON.parse(readFileSync(F, 'utf8')) : { version: 1, cree: new Date().toISOString(), items: [] };
const sauver = (c) => { mkdirSync('.claude/fleet', { recursive: true }); writeFileSync(F, JSON.stringify(c, null, 2) + '\n'); };
const id = () => 'u' + Math.random().toString(36).slice(2, 8);

const ORDRE = (a, b) => PRIORITES.indexOf(a.priorite) - PRIORITES.indexOf(b.priorite) || a.cree.localeCompare(b.cree);

switch (cmd) {
  case 'ajouter': {
    const c = charger();
    const item = {
      id: id(), titre: arg('titre'), topic: arg('topic') || null,
      priorite: PRIORITES.includes(arg('priorite')) ? arg('priorite') : 'P5',
      note: arg('note') || null, ancre: arg('ancre') || null,
      statut: 'a-faire', cree: new Date().toISOString(),
      tentatives: 0, commits: [], resume: null, raison: null,
    };
    if (!item.titre) { console.error('✗ --titre est requis.'); process.exit(2); }
    c.items.push(item); sauver(c);
    console.log(`+ ${item.id}  [${item.priorite}]  ${item.titre}`);
    break;
  }

  case 'importer': {
    const c = charger();
    let lot; try { lot = JSON.parse(arg('json') || '[]'); } catch (e) { console.error('✗ --json invalide :', e.message); process.exit(2); }
    for (const x of lot) {
      if (!x.titre) continue;
      c.items.push({ id: id(), titre: x.titre, topic: x.topic || null,
        priorite: PRIORITES.includes(x.priorite) ? x.priorite : 'P5',
        note: x.note || null, ancre: x.ancre || null,
        statut: 'a-faire', cree: new Date().toISOString(), tentatives: 0, commits: [], resume: null, raison: null });
    }
    sauver(c);
    console.log(`${lot.length} unité(s) ajoutée(s).`);
    break;
  }

  case 'suivant': {
    const c = charger();
    // Une unité restée « en-cours » signifie qu'un déclenchement précédent a été
    // interrompu. On la REPREND plutôt que d'en ouvrir une nouvelle : sinon le
    // chantier se remplit d'unités à demi faites que plus rien ne termine.
    let item = c.items.find((x) => x.statut === 'en-cours');
    let reprise = !!item;
    if (item) {
      item.tentatives += 1;
      if (item.tentatives > MAX_TENTATIVES) {
        item.statut = 'bloque';
        item.raison = `${MAX_TENTATIVES} tentatives sans aboutir — une nuit ne se passe pas à rejouer le même échec.`;
        sauver(c);
        console.log(JSON.stringify({ rien: true, motif: 'unite-bloquee', item }, null, 2));
        break;
      }
    } else {
      item = c.items.filter((x) => x.statut === 'a-faire').sort(ORDRE)[0];
      if (item) { item.statut = 'en-cours'; item.debute = new Date().toISOString(); item.tentatives = 1; }
    }
    if (!item) {
      console.log(JSON.stringify({ rien: true, motif: 'chantier-vide',
        message: 'Aucune unité à faire. Ne commence RIEN de nouveau de ta propre initiative.' }, null, 2));
      break;
    }
    item.base = git('rev-parse', '--short', 'HEAD') || null;
    sauver(c);
    console.log(JSON.stringify({ rien: false, reprise, item,
      restant: c.items.filter((x) => x.statut === 'a-faire').length }, null, 2));
    break;
  }

  case 'terminer': {
    const c = charger(); const x = c.items.find((i) => i.id === reste[0]);
    if (!x) { console.error(`✗ unité « ${reste[0]} » inconnue.`); process.exit(1); }
    x.statut = 'fait'; x.fini = new Date().toISOString();
    x.resume = arg('resume') || null;
    const sha = arg('commit') || git('rev-parse', '--short', 'HEAD');
    if (sha && !x.commits.includes(sha)) x.commits.push(sha);
    sauver(c);
    console.log(`✓ ${x.id} terminée${sha ? ' — ' + sha : ''}`);
    break;
  }

  case 'bloquer': {
    const c = charger(); const x = c.items.find((i) => i.id === reste[0]);
    if (!x) { console.error(`✗ unité « ${reste[0]} » inconnue.`); process.exit(1); }
    x.statut = 'bloque'; x.raison = arg('raison') || 'non précisé'; x.fini = new Date().toISOString();
    sauver(c);
    console.log(`⊘ ${x.id} bloquée — ${x.raison}`);
    break;
  }

  case 'relacher': {
    const c = charger(); const x = c.items.find((i) => i.id === reste[0]);
    if (!x) { console.error(`✗ unité « ${reste[0]} » inconnue.`); process.exit(1); }
    x.statut = 'a-faire'; delete x.debute; sauver(c);
    console.log(`↩ ${x.id} remise à faire`);
    break;
  }

  case 'etat':
  default: {
    const c = charger();
    if (!c.items.length) {
      console.log('Chantier vide.\n\nAjouter une unité :\n  node scripts/fleet/chantier.mjs ajouter --titre "…" --priorite P5');
      break;
    }
    const par = (s) => c.items.filter((x) => x.statut === s);
    console.log(`Chantier — ${c.items.length} unité(s) : ${par('a-faire').length} à faire · ${par('en-cours').length} en cours · ${par('fait').length} faites · ${par('bloque').length} bloquées\n`);
    for (const s of ['en-cours', 'a-faire', 'bloque', 'fait']) {
      const l = par(s).sort(ORDRE);
      if (!l.length) continue;
      console.log(s.toUpperCase());
      for (const x of l) {
        const marque = { 'en-cours': '▶', 'a-faire': '·', bloque: '⊘', fait: '✓' }[s];
        console.log(`  ${marque} ${x.id}  [${x.priorite}]  ${x.titre}`);
        if (x.raison) console.log(`      raison : ${x.raison}`);
        if (x.resume) console.log(`      → ${x.resume}`);
        if (x.commits?.length) console.log(`      commits : ${x.commits.join(', ')}`);
      }
      console.log('');
    }
    if (par('bloque').length) console.log("Les unités bloquées demandent une décision humaine : elles ne se débloqueront pas seules.");
    break;
  }
}
