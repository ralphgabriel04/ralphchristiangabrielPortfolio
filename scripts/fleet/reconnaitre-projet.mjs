#!/usr/bin/env node
// Reconnaissance de projet — établit CE QUE CE DÉPÔT EST, par constat.
//
// C'est l'étape qui rend la flotte portable. Sans elle, générer des agents pour
// un projet inconnu revient à deviner : un agent i18n dans un projet monolingue
// ne trouve rien et fait perdre du temps ; un agent de données dans un projet
// sans base non plus.
//
// RÈGLE : ce script ne conclut RIEN qu'il n'ait constaté. Chaque fait porte sa
// preuve (le fichier lu, la commande trouvée). Ce qu'il n'a pas pu établir est
// listé dans `incertitudes`, jamais deviné — c'est ensuite au modèle de trancher
// avec l'humain, pas au script de faire semblant.
//
//   node scripts/fleet/reconnaitre-projet.mjs [--racine <chemin>] [--sortie <fichier>] [--json]
import { readFileSync, existsSync, readdirSync, statSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, relative, basename, dirname, isAbsolute } from 'node:path';
import { execFileSync } from 'node:child_process';

const arg = (n, d = null) => { const i = process.argv.indexOf('--' + n); return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : d; };
const RACINE = arg('racine', process.cwd());
const R = (...p) => join(RACINE, ...p);
const existe = (...p) => existsSync(R(...p));
const lire = (...p) => { try { return readFileSync(R(...p), 'utf8'); } catch { return null; } };
const lireJson = (...p) => { try { return JSON.parse(readFileSync(R(...p), 'utf8')); } catch { return null; } };

// Parcours borné : on ne descend pas dans les dossiers qui ne décrivent pas le projet.
const IGNORE = new Set(['node_modules', '.git', 'dist', 'build', '.next', 'out', 'coverage', '.turbo', 'vendor', '__pycache__', '.venv', 'target', '.claude']);
function* fichiers(dir = RACINE, profondeur = 0) {
  if (profondeur > 4) return;
  let entrees;
  try { entrees = readdirSync(dir); } catch { return; }
  for (const e of entrees) {
    if (IGNORE.has(e) || e.startsWith('.') && e !== '.github') continue;
    const p = join(dir, e);
    let st; try { st = statSync(p); } catch { continue; }
    if (st.isDirectory()) yield* fichiers(p, profondeur + 1);
    else yield relative(RACINE, p);
  }
}

const preuves = [];
const preuve = (fait, ou) => { preuves.push({ fait, preuve: ou }); return true; };
const incertitudes = [];
const incertain = (quoi, pourquoi) => incertitudes.push({ quoi, pourquoi });

// ------------------------------------------------------------------ identité
const pkg = lireJson('package.json');
const identite = {
  nom: pkg?.name || basename(RACINE),
  racine: RACINE,
  depot: null,
  brancheDefaut: null,
  langue: null,
};
try {
  const git = (...a) => execFileSync('git', ['-C', RACINE, ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  identite.depot = git('remote', 'get-url', 'origin').replace(/\.git$/, '');
  try { identite.brancheDefaut = git('symbolic-ref', '--short', 'refs/remotes/origin/HEAD').split('/').pop(); }
  catch {
    // Le dépôt local ne déclare pas toujours origin/HEAD (clone superficiel).
    // On retombe sur la première branche distante classique CONSTATÉE.
    const distantes = (() => { try { return git('branch', '-r'); } catch { return ''; } })();
    identite.brancheDefaut = ['main', 'master', 'develop'].find((b) => distantes.includes('origin/' + b)) || null;
    if (identite.brancheDefaut) preuve(`branche par défaut : ${identite.brancheDefaut}`, 'git branch -r');
    else incertain('branche par défaut', 'ni origin/HEAD ni branche distante classique');
  }
} catch { incertain('dépôt git', 'aucun remote origin lisible'); }

// Langue de travail : le vocabulaire des agents doit suivre celui du dépôt.
{
  const messages = (() => {
    try { return execFileSync('git', ['-C', RACINE, 'log', '-40', '--format=%s%n%b'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }); }
    catch { return ''; }
  })();
  const docsMd = [];
  try {
    for (const f of readdirSync(R('docs'))) if (f.endsWith('.md') && docsMd.length < 4) docsMd.push(lire('docs', f));
  } catch { /* pas de docs/ */ }
  // Les messages de commit et la documentation interne pèsent DOUBLE : un README
  // en anglais est une vitrine, la langue de TRAVAIL se lit dans l'historique.
  const echantillon = [lire('README.md'), lire('CONTRIBUTING.md'), messages, messages, ...docsMd, ...docsMd]
    .filter(Boolean).join('\n').slice(0, 60000);
  const fr = (echantillon.match(/\b(le|la|les|des|une|qui|pour|dans|avec|sont|cette|être|où|déjà|même)\b/gi) || []).length;
  const en = (echantillon.match(/\b(the|and|with|for|this|that|from|which|are|been|where)\b/gi) || []).length;
  identite.langue = fr > en * 1.2 ? 'fr' : en > fr * 1.2 ? 'en' : 'mixte';
  preuve(`langue de travail : ${identite.langue} (fr=${fr}, en=${en})`, 'README.md');
}

// --------------------------------------------------------------------- stack
const pile = { langages: [], frameworks: [], gestionnaire: null, monorepo: false, runtime: null };
if (pkg) {
  pile.langages.push('javascript');
  const deps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
  if (deps.typescript || existe('tsconfig.json')) { pile.langages.push('typescript'); preuve('typescript', existe('tsconfig.json') ? 'tsconfig.json' : 'package.json'); }
  for (const [nom, marqueur] of [['next', 'next'], ['react', 'react'], ['vue', 'vue'], ['svelte', 'svelte'], ['angular', '@angular/core'],
                                 ['express', 'express'], ['fastify', 'fastify'], ['nest', '@nestjs/core'], ['astro', 'astro'],
                                 ['remix', '@remix-run/react'], ['expo', 'expo'], ['react-native', 'react-native'], ['electron', 'electron'],
                                 ['tailwind', 'tailwindcss'], ['drizzle', 'drizzle-orm'], ['prisma', 'prisma'], ['supabase', '@supabase/supabase-js']]) {
    if (deps[marqueur]) { pile.frameworks.push(nom); preuve(`${nom} @ ${deps[marqueur]}`, 'package.json'); }
  }
  pile.gestionnaire = pkg.packageManager?.split('@')[0]
    || (existe('pnpm-lock.yaml') ? 'pnpm' : existe('yarn.lock') ? 'yarn' : existe('bun.lockb') ? 'bun' : existe('package-lock.json') ? 'npm' : null);
  if (pile.gestionnaire) preuve(`gestionnaire : ${pile.gestionnaire}`, pkg.packageManager ? 'package.json' : 'fichier de verrou');
  pile.monorepo = existe('pnpm-workspace.yaml') || Array.isArray(pkg.workspaces) || existe('turbo.json') || existe('nx.json');
  if (pile.monorepo) preuve('monorepo', existe('turbo.json') ? 'turbo.json' : 'workspaces');
  pile.runtime = pkg.engines?.node ? `node ${pkg.engines.node}` : (lire('.nvmrc') ? `node ${lire('.nvmrc').trim()}` : 'node');
}
for (const [f, l] of [['pyproject.toml', 'python'], ['requirements.txt', 'python'], ['go.mod', 'go'], ['Cargo.toml', 'rust'],
                      ['Gemfile', 'ruby'], ['composer.json', 'php'], ['pom.xml', 'java'], ['build.gradle', 'java'], ['*.csproj', 'csharp']]) {
  if (existe(f)) { pile.langages.push(l); preuve(`langage ${l}`, f); }
}
if (!pile.langages.length) incertain('langage principal', "aucun manifeste reconnu à la racine");

// ---------------------------------------------------------------- LES PORTES
// Le point le plus important du profil : une flotte n'invente jamais de porte,
// elle réutilise celles qui existent. Une porte inventée n'est jamais exécutée.
const portes = {};
const ajouterPorte = (id, commande, description, ou) => { portes[id] = { command: commande, description, decouvertPar: ou }; };
if (pkg?.scripts) {
  const s = pkg.scripts, g = pile.gestionnaire || 'npm';
  const lancer = (n) => (g === 'npm' ? `npm run ${n}` : `${g} run ${n}`);
  const carte = [
    ['lint', /^lint$/, 'Analyse statique.'],
    ['typecheck', /^(typecheck|type-check|tsc)$/, 'Vérification de types.'],
    ['tests-unitaires', /^(test|test:unit|unit)$/, 'Tests.'],
    ['e2e', /^(test:e2e|e2e)$/, 'Tests de bout en bout.'],
    ['build', /^build$/, 'Construction.'],
    ['format', /^(format:check|format|fmt)$/, 'Format.'],
  ];
  for (const [id, re, desc] of carte) {
    const nom = Object.keys(s).find((k) => re.test(k));
    if (nom) ajouterPorte(id, lancer(nom), desc, `package.json → scripts.${nom}`);
  }
}
// Scripts de garde maison : souvent les plus précieux, et invisibles d'un package.json.
const gardesMaison = [];
for (const f of fichiers()) {
  if (!/^scripts\/.+\.(mjs|js|cjs|ts|sh|py)$/.test(f)) continue;
  if (/\/(fleet|flotte)\//.test(f)) continue;
  if (!/(check|verif|vérif|guard|garde|smoke|audit|lint|budget|parity|parite|sonde|test)/i.test(f)) continue;
  gardesMaison.push(f);
}
for (const f of gardesMaison.slice(0, 12)) {
  const id = basename(f).replace(/\.(mjs|js|cjs|ts|sh|py)$/, '').replace(/^_/, '');
  const cmd = /\.(sh)$/.test(f) ? `bash ${f}` : /\.py$/.test(f) ? `python3 ${f}` : `node ${f}`;
  const tete = (lire(f) || '').split('\n').slice(0, 6).join(' ').replace(/^[\s/*#-]+/gm, '').trim().slice(0, 140);
  ajouterPorte(id, cmd, tete || 'Garde maison découvert dans scripts/.', f);
}

// ------------------------------------------------------------------ CI réelle
const ci = { workflows: [], jobs: [] };
if (existe('.github/workflows')) {
  for (const f of readdirSync(R('.github/workflows')).filter((x) => /\.ya?ml$/.test(x))) {
    ci.workflows.push('.github/workflows/' + f);
    const y = lire('.github/workflows/' + f) || '';
    for (const m of y.matchAll(/^\s{4}name:\s*(.+)$/gm)) ci.jobs.push(m[1].trim());
  }
  preuve(`${ci.workflows.length} workflow(s), ${ci.jobs.length} job(s) nommés`, '.github/workflows/');
} else incertain('intégration continue', 'aucun .github/workflows');

// ------------------------------------------------------- départements décelés
// Un département n'est retenu que si le dépôt en porte la trace. C'est ce qui
// évite d'engendrer un agent qui n'aurait rien à regarder.
const listeFichiers = [...fichiers()];

// Un actif statique n'est PAS une preuve de département. Deux faux positifs
// trouvés en inspectant un second dépôt : `securite` déduit d'une copie d'app
// dans public/, et `mobile` d'un certificat nommé responsive-web-design.png.
// Une image ne fait pas un département ; elle fait un nom de fichier.
const ACTIF = /^(public|static|assets|dist|out|coverage|prototype\/dist)\//;
const BINAIRE = /\.(png|jpe?g|gif|webp|avif|svg|ico|woff2?|ttf|otf|eot|mp[34]|webm|pdf|zip|lock)$/i;
const listeCode = listeFichiers.filter((f) => !ACTIF.test(f) && !BINAIRE.test(f));
const aFichier = (re) => listeCode.find((f) => re.test(f)) || null;
const departements = {};
// `confiance` distingue une preuve structurelle (un catalogue i18n, une config
// Playwright) d'un simple nom de fichier évocateur. Un département « faible »
// est PROPOSÉ, pas retenu : c'est l'humain qui tranche à /flotte-init.
const dep = (id, actif, ouSurQuoi, note, confiance = 'forte') => {
  departements[id] = { actif: !!actif, confiance: actif ? confiance : null, preuve: ouSurQuoi || null, note: note || null };
};

const uiFichier = aFichier(/\.(tsx|jsx|vue|svelte)$/) || aFichier(/\.(css|scss)$/);
dep('interface', uiFichier, uiFichier, 'Écrans, composants, feuilles de style.');
dep('design-system', aFichier(/(packages\/ui|design-system|tokens|theme)\b/i) || (pile.frameworks.includes('tailwind') ? 'tailwind' : null), aFichier(/(packages\/ui|design-system|tokens|theme)\b/i) || 'tailwindcss');
// Chercher d'abord la preuve FORTE, puis se rabattre sur la faible. Tester la
// force sur la première correspondance venue déclassait des projets qui portent
// les deux — l'ordre du parcours de fichiers décidait du verdict.
const i18nFort = aFichier(/(messages\/[a-z-]{2,5}\.json|locales?\/[a-z-]{2,5}\/|\.(po|xliff)$)/i);
const i18nFaible = aFichier(/(i18n|intl|translat)/i);
dep('i18n', i18nFort || i18nFaible, i18nFort || i18nFaible, 'Catalogues de traduction.', i18nFort ? 'forte' : 'faible');
const dbFort = aFichier(/(migrations?\/.+\.(sql|ts)$|schema\.(sql|prisma)$|\.sql$)/i);
const dbFaible = aFichier(/(drizzle|prisma|supabase\/|schema\.ts$|repositor)/i);
dep('donnees', dbFort || dbFaible, dbFort || dbFaible, 'Migrations ou schéma.', dbFort ? 'forte' : 'faible');
const testF = aFichier(/(\.(test|spec)\.[a-z]+$|__tests__\/|tests?\/)/);
dep('tests', testF, testF, null);
const e2eF = aFichier(/(playwright|cypress|e2e)/i);
dep('e2e', e2eF, e2eF, null);
// Preuve FORTE : un fichier d'environnement déclaré, une politique RLS, un
// middleware d'authentification. Un fichier qui contient « auth » dans son nom
// est une preuve faible.
const secForte = (existe('.env.example') && '.env.example')
  || aFichier(/(middleware\.(ts|js)$|\/auth\/|rls|policies?\.sql|next-auth)/i);
const secFaible = aFichier(/(auth|session|login|token)/i);
dep('securite', secForte || secFaible, secForte || secFaible, null, secForte ? 'forte' : 'faible');
const pwTexte = (lire('playwright.config.mjs') || lire('playwright.config.ts') || lire('playwright.config.js') || '');
const cssAvecMedia = listeCode.filter((f) => /\.(css|scss)$/.test(f)).find((f) => /@media[^)]{0,80}max-width/i.test(lire(f) || ''));
const mobForte = (/(iPhone|Pixel|Galaxy|isMobile|devices\[)/.test(pwTexte) && 'playwright.config → viewport mobile')
  || (pile.frameworks.some((f) => f === 'expo' || f === 'react-native') && 'package.json → cible native')
  || cssAvecMedia;
const mobFaible = aFichier(/(responsive|mobile)/i);
dep('mobile', mobForte || mobFaible, mobForte || mobFaible, null, mobForte ? 'forte' : 'faible');
const seoFort = aFichier(/(sitemap|robots\.txt|opengraph|seo-routes)/i);
const seoFaible = aFichier(/(metadata|landing|marketing)/i);
dep('acquisition', seoFort || seoFaible, seoFort || seoFaible, null, seoFort ? 'forte' : 'faible');
const perfF = aFichier(/(lighthouse|budget|bundle|perf)/i);
dep('performance', perfF, perfF, null);
const confF = aFichier(/(privacy|rgpd|gdpr|loi-?25|conformite|efvp|dpia)/i);
dep('conformite', confF, confF, null);
const docF = aFichier(/(docs?\/|ADR|arc42|architecture)/i);
dep('architecture', docF || pile.monorepo, docF || 'monorepo');
const produitF = aFichier(/(strategie|pricing|roadmap|produit|marketing)/i);
dep('produit', produitF, produitF, null);

// -------------------------------------------- doctrine : ce qui fait autorité
const doctrine = [];
for (const motif of [/^README\.md$/i, /ARC42/i, /^docs\/.*ADR.*\.md$/i, /^docs\/architecture\//i, /CONTRIBUTING/i,
                     /^CLAUDE\.md$/i, /^docs\/quality\//i, /^docs\/security\//i, /^docs\/conformite\//i]) {
  for (const f of listeFichiers.filter((x) => motif.test(x)).slice(0, 4)) if (!doctrine.includes(f)) doctrine.push(f);
}

// --------------------------------------------------- application : la lancer ?
const application = { dev: null, servirPourInspection: null, urlProbable: null, viewports: [] };
if (pkg?.scripts?.dev) {
  const g = pile.gestionnaire || 'npm';
  application.dev = g === 'npm' ? 'npm run dev' : `${g} run dev`;
  application.urlProbable = pile.frameworks.includes('next') ? 'http://localhost:3000' : 'http://localhost:3000';
}
const pwConf = lire('playwright.config.mjs') || lire('playwright.config.ts') || lire('playwright.config.js');
if (pwConf) {
  const bu = pwConf.match(/baseURL:\s*['"`]([^'"`]+)/);
  if (bu) {
    let url = bu[1];
    if (url.endsWith(':')) {
      // Forme « 'http://localhost:' + (process.env.PORT || 4173) » : le port
      // vit APRÈS la chaîne. Sans ce rattrapage, l'URL sort tronquée et
      // l'inspection visuelle ne peut pas se lancer.
      const ligne = pwConf.slice(pwConf.indexOf(bu[0]), pwConf.indexOf(bu[0]) + 220);
      const port = ligne.match(/\b(\d{4,5})\b/);
      url = port ? url + port[1] : null;
      if (!url) incertain("port de l'application", 'baseURL concaténé, aucun port littéral à proximité');
    }
    if (url) application.urlProbable = url;
  }
  const ws = pwConf.match(/command:\s*['"`]([^'"`]+)/);
  if (ws) application.servirPourInspection = ws[1];
  for (const m of pwConf.matchAll(/devices\[['"]([^'"]+)['"]\]/g)) if (!application.viewports.includes(m[1])) application.viewports.push(m[1]);
  preuve(`application inspectable sur ${application.urlProbable}`, 'playwright.config');
} else if (!application.dev) incertain("comment lancer l'application", 'ni script dev ni configuration Playwright');

// ------------------------------------------------------------------ priorités
// Ordre par défaut, à confirmer avec l'humain : le script ne peut pas deviner ce
// qui compte le plus dans CE produit.
const priorites = [
  'correction des données', 'perte silencieuse', 'sécurité et accès', 'fonctionnalité cassée',
  'accessibilité', 'écart au design', 'performance', 'lisibilité',
];
incertain('ordre des priorités', "ordre générique proposé — à confirmer avec le propriétaire ; c'est lui qui décide ce qui prime");

// -------------------------------------------------------------------- profil
const profil = {
  version: '1.0.0',
  genereLe: new Date().toISOString(),
  generePar: 'scripts/fleet/reconnaitre-projet.mjs',
  avertissement: "Constats de reconnaissance. Les points listés dans `incertitudes` NE SONT PAS établis : ils demandent une décision humaine avant que la flotte s'en serve.",
  identite, pile, portes, ci,
  departements,
  doctrine,
  application,
  priorites,
  fichiers: listeFichiers.length,
  preuves,
  incertitudes,
};

const sortie = arg('sortie', '.claude/fleet/projet.json');
// Un chemin de sortie ABSOLU ne se résout pas sous la racine du projet inspecté.
// Sans cette ligne, `--racine /autre/projet --sortie /tmp/x.json` écrivait dans
// `/autre/projet/tmp/x.json` — trouvé en inspectant un second dépôt, pas en relisant.
const cheminSortie = isAbsolute(sortie) ? sortie : R(sortie);
if (process.argv.includes('--json')) {
  console.log(JSON.stringify(profil, null, 2));
} else {
  mkdirSync(dirname(cheminSortie), { recursive: true });
  writeFileSync(cheminSortie, JSON.stringify(profil, null, 2) + '\n');
  const actifs = Object.entries(departements).filter(([, v]) => v.actif && v.confiance === 'forte').map(([k]) => k);
  const proposes = Object.entries(departements).filter(([, v]) => v.actif && v.confiance === 'faible');
  for (const [k, v] of proposes) incertain(`département « ${k} »`, `preuve faible (${v.preuve}) — à confirmer avant d'engendrer l'agent`);
  console.log(`Projet      : ${identite.nom}${identite.depot ? ' — ' + identite.depot : ''}`);
  console.log(`Langue      : ${identite.langue}`);
  console.log(`Pile        : ${[...new Set(pile.langages)].join(', ')}${pile.frameworks.length ? ' · ' + pile.frameworks.join(', ') : ''}${pile.monorepo ? ' · monorepo' : ''}`);
  console.log(`Portes      : ${Object.keys(portes).length} découvertes — ${Object.keys(portes).join(', ') || 'aucune'}`);
  console.log(`CI          : ${ci.jobs.length} job(s) dans ${ci.workflows.length} workflow(s)`);
  console.log(`Départements: ${actifs.join(', ') || 'aucun'}`);
  if (proposes.length) console.log(`  proposés   : ${proposes.map(([k]) => k).join(', ')} (preuve faible)`);
  console.log(`Application : ${application.urlProbable || 'non déterminée'}${application.viewports.length ? ' · ' + application.viewports.join(' / ') : ''}`);
  console.log(`Doctrine    : ${doctrine.length} document(s)`);
  if (incertitudes.length) {
    console.log(`\n⚠ ${incertitudes.length} point(s) NON établi(s) — à trancher avant génération :`);
    for (const i of incertitudes) console.log(`  · ${i.quoi} — ${i.pourquoi}`);
  }
  console.log(`\nProfil écrit : ${cheminSortie}`);
}
