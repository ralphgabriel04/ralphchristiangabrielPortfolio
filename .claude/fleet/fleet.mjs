#!/usr/bin/env node
// Fleet — régie d'audit multi-départements.
//
//   node .claude/fleet/fleet.mjs <commande> [options]
//
// Le CLI ne juge rien : il tient l'état (profil, carnet de constats, portes,
// rapport) pour que les agents puissent travailler en boucle sans se répéter,
// sans se contredire, et sans rien perdre entre deux sessions.

import { spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { args, chemins, couleurs as C, ecrireJson, lireJson, maintenant, racine } from './lib/util.mjs';
import { DEPARTEMENTS, departementsActifs, parCle } from './lib/departements.mjs';
import { ageProfilEnHeures, construireProfil, fusionner, resumerProfil } from './lib/profil.mjs';
import {
  GRAVITES, OUVERTS, charger, ingerer, majConstat, noter, prochains, statistiques, trouver,
} from './lib/constats.mjs';
import { lancerPortes } from './lib/verif.mjs';
import { genererPrompt, genererRapport, journaliser, rendreMission } from './lib/rapport.mjs';

const { positionnels, options } = args(process.argv.slice(2));
const commande = positionnels[0] ?? 'aide';
const R = racine();
const c = chemins(R);
const sortir = (code = 0) => process.exit(code);

function profilOuMourir({ silencieux = false } = {}) {
  const p = lireJson(c.profil);
  if (!p) {
    console.error(C.rouge('Aucun profil. Lance d\'abord : node .claude/fleet/fleet.mjs recon'));
    sortir(1);
  }
  const age = ageProfilEnHeures(p);
  if (age > 72 && !silencieux) {
    console.error(C.jaune(`Profil vieux de ${Math.round(age)} h — pense à « recon --force ».`));
  }
  return p;
}

// ------------------------------------------------------------------ commandes

const commandes = {
  recon() {
    const ancien = lireJson(c.profil);
    if (ancien && !options.force && ageProfilEnHeures(ancien) < 24) {
      console.log(C.faible(`Profil récent (${Math.round(ageProfilEnHeures(ancien))} h). --force pour refaire.`));
      console.log(resumerProfil(ancien));
      return;
    }
    const profil = fusionner(construireProfil(R), ancien, lireJson(c.config));
    ecrireJson(c.profil, profil);
    mkdirSync(c.entrant, { recursive: true });
    journaliser(`recon : ${profil.technos.length} technos, ${profil.routes.length} routes, ${departementsActifs(profil).length} départements actifs`, c);
    console.log(resumerProfil(profil));
    console.log('');
    commandes.departements();
  },

  departements() {
    const profil = profilOuMourir({ silencieux: true });
    const actifs = new Set(departementsActifs(profil).map((d) => d.cle));
    const liste = charger(c);
    const stats = new Map(statistiques(c).departements.map((s) => [s.departement, s]));
    console.log(C.gras('Départements'));
    for (const d of DEPARTEMENTS) {
      const on = actifs.has(d.cle);
      const s = stats.get(d.cle);
      const vus = liste.some((k) => k.departement === d.cle);
      const etat = !on
        ? C.faible('hors périmètre')
        : !vus
          ? C.jaune('jamais audité')
          : C.vert(`score ${s.score} · ${s.ouverts} ouvert(s)`);
      console.log(`  ${on ? C.vert('●') : C.faible('○')} ${d.cle.padEnd(15)} ${etat.padEnd(30)} ${C.faible(d.resume)}`);
    }
  },

  mission() {
    const profil = profilOuMourir();
    const cle = positionnels[1];
    if (!cle || !parCle(cle)) {
      console.error(`Usage : mission <${DEPARTEMENTS.map((d) => d.cle).join('|')}>`);
      sortir(1);
    }
    const texte = rendreMission(cle, profil, {
      iteration: Number(options.iteration ?? 0),
      budget: options.budget ? Number(options.budget) : null,
    });
    const dossier = resolve(c.etat, 'missions');
    mkdirSync(dossier, { recursive: true });
    writeFileSync(resolve(dossier, `${cle}.md`), texte);
    console.log(texte);
  },

  ingerer() {
    const dep = options.departement ?? options.dept ?? positionnels[1];
    const fichier = options.fichier ?? (dep ? resolve(c.entrant, `${dep}.json`) : null);
    if (!fichier || !existsSync(fichier)) {
      console.error(C.rouge(`Rien à ingérer : ${fichier ?? '(aucun fichier)'} est introuvable.`));
      console.error('Le département doit écrire ses constats dans .claude/fleet/etat/entrant/<dept>.json');
      sortir(1);
    }
    const brut = lireJson(fichier);
    const constats = Array.isArray(brut) ? brut : (brut?.constats ?? []);
    const departement = brut?.departement ?? dep;
    const res = ingerer(constats, { departement, iteration: Number(options.iteration ?? 0), source: options.source ?? 'agent' }, c);

    const archives = resolve(c.entrant, 'traites');
    mkdirSync(archives, { recursive: true });
    renameSync(fichier, resolve(archives, `${departement}-${Date.now()}.json`));

    console.log(
      `${C.vert(res.crees.length + ' nouveau(x)')} · ${res.revus.length} déjà connu(s) · ` +
        `${res.regressions.length ? C.rouge(res.regressions.length + ' RÉGRESSION(S)') : '0 régression'} · ` +
        `${res.rejetes.length ? C.jaune(res.rejetes.length + ' rejeté(s)') : '0 rejeté'}`,
    );
    for (const k of res.crees) console.log(`  + ${k.id} [${k.gravite}] ${k.titre}`);
    for (const k of res.regressions) console.log(C.rouge(`  ! ${k.id} revenu : ${k.titre}`));
    for (const r of res.rejetes) console.log(C.jaune(`  - rejeté (${r.raison}) : ${r.brut.titre ?? '(sans titre)'}`));
    journaliser(`ingestion ${departement} : +${res.crees.length}, ${res.regressions.length} régression(s), ${res.rejetes.length} rejeté(s)`, c);
  },

  suivant() {
    const liste = prochains(
      {
        n: Number(options.n ?? 5),
        departement: options.departement ?? null,
        graviteMin: options['gravite-min'] ?? null,
      },
      c,
    );
    if (options.json) {
      console.log(JSON.stringify(liste, null, 2));
      return;
    }
    if (!liste.length) {
      console.log(C.vert('File vide : rien d\'ouvert au-dessus du seuil demandé.'));
      return;
    }
    for (const k of liste) {
      console.log(`${C.gras(k.id)} ${C.faible('p' + k.priorite)} [${k.gravite}/${k.portee}/${k.cout}] ${k.titre}`);
      if (k.cible) console.log(`   ${C.bleu(k.cible + (k.ligne ? ':' + k.ligne : ''))}`);
      console.log(`   preuve    ${k.preuve}`);
      if (k.correctif) console.log(`   correctif ${k.correctif}`);
    }
  },

  montrer() {
    const k = trouver(positionnels[1], c);
    if (!k) {
      console.error(`Constat introuvable : ${positionnels[1]}`);
      sortir(1);
    }
    console.log(JSON.stringify(k, null, 2));
  },

  prendre() {
    const k = majConstat(positionnels[1], { statut: 'en_cours' }, c);
    if (!k) sortir(1);
    console.log(`${k.id} → en_cours`);
  },

  clore() {
    const id = positionnels[1];
    const preuve = options.preuve;
    if (!id || !preuve) {
      console.error('Usage : clore <ID> --preuve "<commande + résultat qui le prouve>" [--commit <sha>]');
      sortir(1);
    }
    const k = majConstat(id, {
      statut: 'corrige',
      preuve_correction: String(preuve),
      commit: options.commit ?? null,
      corrige_le: maintenant(),
    }, c);
    if (!k) {
      console.error(`Constat introuvable : ${id}`);
      sortir(1);
    }
    console.log(`${C.vert('corrigé')} ${k.id} — ${k.titre}`);
    journaliser(`${k.id} corrigé : ${k.titre} (preuve : ${String(preuve).slice(0, 160)})`, c);
  },

  verdict() {
    const id = positionnels[1];
    const k = trouver(id, c);
    if (!k) {
      console.error(`Constat introuvable : ${id}`);
      sortir(1);
    }
    const ok = Boolean(options.ok) && !options.ko;
    const entree = { le: maintenant(), verdict: ok ? 'tient' : 'ne tient pas', preuve: options.preuve ?? null };
    majConstat(id, {
      statut: ok ? 'verifie' : 'ouvert',
      verifications: [...(k.verifications ?? []), entree],
    }, c);
    if (!ok) noter(id, `Vérification en échec : ${options.preuve ?? 'sans détail'}`, c);
    console.log(ok ? C.vert(`${id} vérifié`) : C.rouge(`${id} rouvert — le correctif ne tient pas`));
    journaliser(`${id} vérification : ${entree.verdict}`, c);
  },

  rejeter() {
    const k = majConstat(positionnels[1], { statut: 'rejete', raison: options.raison ?? null }, c);
    if (!k) sortir(1);
    console.log(`${k.id} → rejeté${options.raison ? ` (${options.raison})` : ''}`);
    journaliser(`${k.id} rejeté : ${options.raison ?? 'sans raison donnée'}`, c);
  },

  verifier() {
    const profil = profilOuMourir({ silencieux: true });
    const portes = options.portes ? String(options.portes).split(',').map((s) => s.trim()) : null;
    const bilan = lancerPortes(profil, {
      portes,
      rapide: Boolean(options.rapide),
      arretPremiereErreur: Boolean(options.arret),
      minutes: Number(options.minutes ?? 15),
    });
    for (const r of bilan.resultats) {
      if (r.absente) {
        console.log(`${C.faible('○')} ${r.role.padEnd(10)} ${C.faible('aucune commande dans ce dépôt')}`);
        continue;
      }
      const badge = r.ok ? C.vert('✔') : C.rouge('✘');
      console.log(`${badge} ${r.role.padEnd(10)} ${r.duree_s}s  ${C.faible(r.commande)}`);
      if (!r.ok) {
        console.log(C.faible(r.sortie.split('\n').map((l) => '    ' + l).join('\n')));
      }
    }
    journaliser(`portes : ${bilan.vert ? 'VERT' : 'ROUGE'} (${bilan.portes.filter((p) => p.ok === false).map((p) => p.role).join(', ') || 'aucune en échec'})`, c);
    if (!bilan.vert) sortir(2);
  },

  statut() {
    const profil = lireJson(c.profil);
    const s = statistiques(c);
    if (profil) console.log(C.gras(profil.nom) + C.faible(`  ·  profil vieux de ${Math.round(ageProfilEnHeures(profil))} h`));
    console.log('');
    if (!s.total) {
      console.log(C.jaune('Carnet vide : aucun département n\'a encore rapporté.'));
      return;
    }
    for (const d of s.departements) {
      const dep = parCle(d.departement);
      const couleur = d.score >= 90 ? C.vert : d.score >= 70 ? C.jaune : C.rouge;
      console.log(
        `${couleur(String(d.score).padStart(3))}  ${(dep?.nom ?? d.departement).padEnd(42)} ` +
          `${String(d.ouverts).padStart(3)} ouvert(s)  ${d.bloquants ? C.rouge(d.bloquants + ' bloquant(s)') : ''} ${d.regressions ? C.jaune(d.regressions + ' régression(s)') : ''}`,
      );
    }
    console.log('');
    console.log(`${C.gras('Global')} ${s.global}/100 · ${s.ouverts}/${s.total} ouverts · ${s.bloquants} bloquants`);
  },

  rapport() {
    const profil = profilOuMourir({ silencieux: true });
    const { fichier, stats } = genererRapport(profil, c);
    console.log(`Rapport écrit : ${fichier} (score global ${stats.global ?? '—'}/100)`);
  },

  prompt() {
    const profil = profilOuMourir({ silencieux: true });
    console.log(
      genererPrompt(profil, {
        departement: options.departement ?? positionnels[1] ?? null,
        n: Number(options.n ?? 10),
        gravite: options.gravite ?? null,
      }, c),
    );
  },

  sonde() {
    const nom = positionnels[1] ?? 'parcours';
    const fichier = resolve(c.fleet, 'sondes', `${nom}.mjs`);
    if (!existsSync(fichier)) {
      console.error(`Sonde inconnue : ${nom}. Disponible : parcours.`);
      sortir(1);
    }
    // On relaie les options telles quelles : la sonde a son propre analyseur.
    const passees = process.argv.slice(process.argv.indexOf(commande) + 1).filter((x) => x !== nom);
    const res = spawnSync(process.execPath, [fichier, ...passees], { stdio: 'inherit', cwd: R });
    sortir(res.status ?? 1);
  },

  parcours() {
    const profil = profilOuMourir({ silencieux: true });
    const fichier = options.fichier ?? resolve(c.entrant, 'parcours.json');
    const brut = lireJson(fichier);
    if (!brut) {
      console.error(`Fichier de parcours introuvable ou illisible : ${fichier}`);
      console.error('Forme attendue : [{ "nom": "...", "route": "/...", "etapes": "...", "critique": true }]');
      sortir(1);
    }
    profil.parcours = Array.isArray(brut) ? brut : (brut.parcours ?? []);
    ecrireJson(c.profil, profil);
    console.log(`${profil.parcours.length} parcours enregistrés dans le profil.`);
    journaliser(`cartographie : ${profil.parcours.length} parcours`, c);
  },

  journal() {
    journaliser(positionnels.slice(1).join(' '), c);
  },

  'sync-agents'() {
    const profil = lireJson(c.profil) ?? construireProfil(R);
    const dossier = resolve(R, '.claude/agents');
    mkdirSync(dossier, { recursive: true });
    let n = 0;
    for (const d of DEPARTEMENTS) {
      const corps = rendreMission(d.cle, profil, { sansContexte: true }).trim();
      const texte = [
        '---',
        `name: dept-${d.cle}`,
        `description: ${d.resume} À lancer par l'orchestrateur de la Fleet (voir la compétence audit-transversal), ou directement pour un audit ciblé du département ${d.nom}.`,
        `tools: ${d.outils}`,
        '---',
        '',
        '<!-- GÉNÉRÉ par `node .claude/fleet/fleet.mjs sync-agents` — éditez',
        '     .claude/fleet/lib/departements.mjs, pas ce fichier. -->',
        '',
        corps,
        '',
        '## Avant de commencer',
        '',
        'Lis le contexte réel du projet et tes constats déjà ouverts :',
        '',
        '```bash',
        `node .claude/fleet/fleet.mjs mission ${d.cle}`,
        '```',
        '',
        "Cette commande imprime ta mission complète, adaptée à CE dépôt (commandes, routes,",
        'locales, sondes disponibles) et la liste de ce qui est déjà connu. Suis-la, puis',
        `écris tes constats dans \`.claude/fleet/etat/entrant/${d.cle}.json\` et lance`,
        `\`node .claude/fleet/fleet.mjs ingerer --departement ${d.cle}\`.`,
        '',
      ].join('\n');
      writeFileSync(resolve(dossier, `dept-${d.cle}.md`), texte);
      n++;
    }
    console.log(`${n} agents de département régénérés dans .claude/agents/`);
  },

  installer() {
    const cible = options.vers ?? positionnels[1];
    if (!cible) {
      console.error('Usage : installer --vers <chemin/du/depot>');
      sortir(1);
    }
    const destination = resolve(cible, '.claude');
    for (const sous of ['fleet', 'agents', 'commands', 'skills/audit-transversal', 'README.md']) {
      const src = resolve(R, '.claude', sous);
      if (!existsSync(src)) continue;
      // L'état est propre au dépôt d'origine : on copie l'outil, jamais sa mémoire.
      cpSync(src, resolve(destination, sous), {
        recursive: true,
        filter: (s) => !/[\\/]fleet[\\/]etat([\\/]|$)/.test(s),
      });
    }
    mkdirSync(resolve(destination, 'fleet/etat/entrant'), { recursive: true });
    // Le .gitignore de l'état est exclu par le filtre ci-dessus alors qu'il doit
    // suivre l'outil : sans lui, le dépôt d'accueil committerait profil.json et
    // les dépôts bruts des départements.
    const regles = resolve(R, '.claude/fleet/etat/.gitignore');
    if (existsSync(regles)) cpSync(regles, resolve(destination, 'fleet/etat/.gitignore'));
    console.log(`Fleet installée dans ${destination}`);
    console.log('Prochaine étape, depuis ce dépôt :  node .claude/fleet/fleet.mjs recon');
  },

  aide() {
    console.log(`
${C.gras('Fleet')} — régie d'audit multi-départements

  ${C.gras('Cartographie')}
    recon [--force]                    Détecte le projet : technos, commandes, routes, sondes
    departements                       Qui est dans le périmètre, qui n'a jamais été audité
    parcours [--fichier f.json]        Enregistre les parcours utilisateurs cartographiés
    sonde parcours [--demarrer]        Ouvre RÉELLEMENT l'app dans un navigateur et relève
                                       erreurs, requêtes en échec, axe, débordements, captures

  ${C.gras('Audit')}
    mission <dept> [--iteration n]     Imprime le brief complet d'un département
    ingerer --departement <dept>       Ingère etat/entrant/<dept>.json (dédoublonne, détecte les régressions)

  ${C.gras('Travail')}
    suivant [--n 5] [--departement d]  La file de travail, triée par priorité
    montrer <ID>                       Le constat en entier
    prendre <ID>                       → en_cours
    clore <ID> --preuve "..."          → corrigé (preuve obligatoire)
    verdict <ID> --ok|--ko --preuve    Vérification adverse : confirme ou rouvre
    rejeter <ID> --raison "..."        Faux positif ou hors périmètre

  ${C.gras('Portes et sorties')}
    verifier [--rapide] [--portes a,b] Lance les portes du dépôt et journalise le résultat
    statut                             Tableau de bord par département
    rapport                            Écrit etat/RAPPORT.md
    prompt [--departement d] [--n 10]  Prompt prêt à coller depuis l'état réel du carnet

  ${C.gras('Maintenance')}
    sync-agents                        Régénère .claude/agents/dept-*.md depuis le registre
    installer --vers <depot>           Copie la Fleet dans un autre dépôt
`);
  },
};

const fn = commandes[commande] ?? commandes[commande.replace(/-/g, '')];
if (!fn) {
  console.error(`Commande inconnue : ${commande}`);
  commandes.aide();
  sortir(1);
}
fn();
