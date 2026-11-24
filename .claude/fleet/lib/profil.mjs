// Reconnaissance : ce que ce dépôt EST, mesuré, jamais supposé.
//
// Tout le reste de la Fleet lit ce profil : quels départements ouvrir, quelles
// commandes lancer, quelles routes visiter, quelles preuves exiger. C'est la
// pièce qui rend le kit transversal — déposé ailleurs, il se reconfigure seul.

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { chemins, lireJson, maintenant } from './util.mjs';

const IGNORE = new Set([
  'node_modules', '.git', '.next', '.turbo', 'dist', 'build', 'out', 'coverage',
  '.vercel', '.cache', 'vendor', '.venv', '__pycache__', '.pnpm-store', 'playwright-report',
  'test-results', '.claude',
]);

function* fichiers(racineDir, { profondeurMax = 6, base = racineDir } = {}) {
  let entrees;
  try {
    entrees = readdirSync(racineDir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const e of entrees) {
    if (e.name.startsWith('.') && e.name !== '.github') continue;
    if (IGNORE.has(e.name)) continue;
    const chemin = join(racineDir, e.name);
    if (e.isDirectory()) {
      if (profondeurMax <= 0) continue;
      yield* fichiers(chemin, { profondeurMax: profondeurMax - 1, base });
    } else {
      yield relative(base, chemin).split('\\').join('/');
    }
  }
}

const existe = (r, ...cands) => cands.find((c) => existsSync(resolve(r, c))) ?? null;

function packagesJson(r) {
  const liste = [];
  const racinePkg = lireJson(resolve(r, 'package.json'));
  if (racinePkg) liste.push({ chemin: 'package.json', pkg: racinePkg });
  for (const dossier of ['apps', 'packages', 'contexts', 'tooling', 'services', 'libs']) {
    const d = resolve(r, dossier);
    if (!existsSync(d)) continue;
    for (const sous of readdirSync(d, { withFileTypes: true })) {
      if (!sous.isDirectory()) continue;
      const p = lireJson(resolve(d, sous.name, 'package.json'));
      if (p) liste.push({ chemin: `${dossier}/${sous.name}/package.json`, pkg: p });
    }
  }
  return liste;
}

const TECHNOS = {
  next: ['next'], react: ['react'], vue: ['vue'], svelte: ['svelte'], astro: ['astro'],
  remix: ['@remix-run/react'], expo: ['expo'], tailwind: ['tailwindcss'],
  typescript: ['typescript'], vitest: ['vitest'], jest: ['jest'],
  playwright: ['@playwright/test', 'playwright'], cypress: ['cypress'],
  storybook: ['storybook', '@storybook/react'],
  drizzle: ['drizzle-orm'], prisma: ['prisma', '@prisma/client'],
  supabase: ['@supabase/supabase-js', 'supabase'], postgres: ['pg', 'postgres'],
  mongoose: ['mongoose'], sequelize: ['sequelize'],
  express: ['express'], fastify: ['fastify'], nest: ['@nestjs/core'], hono: ['hono'],
  'next-intl': ['next-intl'], i18next: ['i18next', 'react-i18next'],
  'react-intl': ['react-intl'], 'vue-i18n': ['vue-i18n'],
  sentry: ['@sentry/nextjs', '@sentry/node', '@sentry/react'],
  otel: ['@opentelemetry/api'], pino: ['pino'], winston: ['winston'],
  stripe: ['stripe'], zod: ['zod'], turbo: ['turbo'], lighthouse: ['lighthouse'],
  axe: ['@axe-core/playwright', 'axe-core'], 'dependency-cruiser': ['dependency-cruiser'],
};

function detecterTechnos(pkgs) {
  const toutes = new Set();
  const deps = {};
  for (const { pkg } of pkgs) Object.assign(deps, pkg.dependencies, pkg.devDependencies);
  for (const [techno, marqueurs] of Object.entries(TECHNOS)) {
    if (marqueurs.some((m) => deps[m])) toutes.add(techno);
  }
  return [...toutes].sort();
}

/** Associe un rôle (lint, test, build…) au script racine qui le remplit. */
function detecterCommandes(pkgRacine, gestionnaire) {
  const scripts = pkgRacine?.scripts ?? {};
  const lancer = (nom) => `${gestionnaire} run ${nom}`;
  const premier = (...noms) => noms.find((n) => scripts[n]);
  const roles = {
    lint: premier('lint', 'eslint'),
    format: premier('format:check', 'format', 'prettier:check'),
    typecheck: premier('typecheck', 'type-check', 'tsc'),
    test: premier('test', 'test:unit', 'vitest'),
    e2e: premier('test:e2e', 'e2e', 'playwright'),
    build: premier('build'),
    dev: premier('dev', 'start:dev', 'serve'),
    depcruise: premier('depcruise', 'deps'),
  };
  const commandes = {};
  for (const [role, nom] of Object.entries(roles)) if (nom) commandes[role] = lancer(nom);
  return { commandes, scripts: Object.keys(scripts) };
}

/** Routes Next (app + pages), Astro, Remix. Chemins servis, pas fichiers. */
function detecterRoutes(r, tousLesFichiers) {
  const routes = new Set();
  for (const f of tousLesFichiers) {
    let m;
    if ((m = f.match(/(?:^|\/)app\/(.*)\/?page\.(tsx|jsx|ts|js|mdx)$/))) {
      const segments = m[1]
        .split('/')
        .filter(Boolean)
        .filter((s) => !(s.startsWith('(') && s.endsWith(')')))
        .filter((s) => !s.startsWith('@'));
      routes.add('/' + segments.join('/'));
    } else if ((m = f.match(/(?:^|\/)pages\/(.+)\.(tsx|jsx|ts|js|mdx)$/))) {
      if (m[1].startsWith('api/') || m[1].startsWith('_')) continue;
      routes.add('/' + m[1].replace(/\/?index$/, ''));
    } else if ((m = f.match(/(?:^|\/)src\/pages\/(.+)\.astro$/))) {
      routes.add('/' + m[1].replace(/\/?index$/, ''));
    }
  }
  return [...routes]
    .map((x) => (x === '' ? '/' : x))
    .sort()
    .slice(0, 200);
}

function detecterApi(tousLesFichiers) {
  return tousLesFichiers
    .filter((f) => /(?:^|\/)app\/.*\/route\.(ts|js)$/.test(f) || /(?:^|\/)pages\/api\//.test(f) || /(?:^|\/)supabase\/functions\/[^/]+\/index\.ts$/.test(f))
    .slice(0, 200);
}

function detecterI18n(r, tousLesFichiers) {
  const catalogues = tousLesFichiers
    .filter((f) => /(?:messages|locales|lang|i18n|translations)\/[a-z]{2}(?:-[A-Z]{2})?\.json$/.test(f))
    .slice(0, 60);
  const locales = [...new Set(catalogues.map((c) => c.split('/').pop().replace('.json', '')))].sort();
  return { catalogues, locales };
}

function detecterPortDev(pkgRacine, r) {
  const dev = pkgRacine?.scripts?.dev ?? '';
  const m = dev.match(/-p\s*(\d{4})|--port[= ](\d{4})/);
  if (m) return Number(m[1] ?? m[2]);
  const pw = existe(r, 'playwright.config.ts', 'playwright.config.mjs', 'playwright.config.js');
  if (pw) {
    const src = readFileSync(resolve(r, pw), 'utf8');
    const p = src.match(/localhost:(\d{4})/);
    if (p) return Number(p[1]);
  }
  return 3000;
}

export function construireProfil(r = chemins().racine) {
  const tousLesFichiers = [...fichiers(r)];
  const pkgs = packagesJson(r);
  const pkgRacine = pkgs[0]?.pkg ?? null;
  const gestionnaire = existsSync(resolve(r, 'pnpm-lock.yaml'))
    ? 'pnpm'
    : existsSync(resolve(r, 'yarn.lock'))
      ? 'yarn'
      : existsSync(resolve(r, 'bun.lockb'))
        ? 'bun'
        : 'npm';
  const technos = detecterTechnos(pkgs);
  const { commandes, scripts } = detecterCommandes(pkgRacine, gestionnaire);
  const port = detecterPortDev(pkgRacine, r);
  const workflows = tousLesFichiers.filter((f) => f.startsWith('.github/workflows/'));
  const i18n = detecterI18n(r, tousLesFichiers);
  const scriptsMjs = tousLesFichiers.filter((f) => /^scripts\/.+\.(mjs|js|ts|sh|ps1)$/.test(f));

  const sondes = {
    a11y: technos.includes('axe') ? 'axe-core via Playwright' : null,
    perf: technos.includes('lighthouse')
      ? (scriptsMjs.find((s) => /lighthouse/i.test(s)) ?? 'lighthouse')
      : null,
    archi: technos.includes('dependency-cruiser') ? (commandes.depcruise ?? 'depcruise') : null,
    i18n: scriptsMjs.filter((s) => /i18n/i.test(s)),
    audit: `${gestionnaire} audit --json`,
  };

  const profil = {
    genere_le: maintenant(),
    version_kit: 1,
    nom: pkgRacine?.name ?? r.split('/').pop(),
    racine: r,
    gestionnaire,
    monorepo: Boolean(pkgRacine?.workspaces) || existsSync(resolve(r, 'pnpm-workspace.yaml')),
    paquets: pkgs.map((p) => p.chemin),
    technos,
    commandes,
    scripts_disponibles: scripts,
    appli: {
      commandeDev: commandes.dev ?? null,
      urlBase: `http://localhost:${port}`,
      port,
    },
    routes: detecterRoutes(r, tousLesFichiers),
    api: detecterApi(tousLesFichiers),
    i18n,
    dossiers: {
      composants: existe(r, 'components', 'src/components', 'packages/ui', 'app/components'),
      api: existe(r, 'app/api', 'src/app/api', 'pages/api', 'apps/web/app/api', 'supabase/functions'),
      tests: existe(r, 'tests', 'test', '__tests__', 'e2e'),
      captures: existe(r, 'docs/audits/captures', 'test-results', 'playwright-report') ?? '.claude/fleet/etat/captures',
      migrations: existe(r, 'supabase/migrations', 'migrations', 'packages/db/migrations', 'prisma/migrations'),
      jetons: existe(r, 'tailwind.config.ts', 'tailwind.config.js', 'app/globals.css', 'src/styles/globals.css', 'packages/ui/src/styles'),
    },
    ci: { workflows },
    env_exemple: existe(r, '.env.example', '.env.sample', '.env.template'),
    sondes,
    parcours: [],
    departements: {},
    budget: { constats_par_departement: 12, iterations_par_defaut: 3 },
  };

  return profil;
}

/** Fusionne : profil détecté < fleet.config.json < parcours déjà cartographiés. */
export function fusionner(detecte, ancien, config) {
  const fusion = { ...detecte };
  if (ancien?.parcours?.length) fusion.parcours = ancien.parcours;
  if (config) {
    for (const [cle, valeur] of Object.entries(config)) {
      if (valeur && typeof valeur === 'object' && !Array.isArray(valeur)) {
        fusion[cle] = { ...(fusion[cle] ?? {}), ...valeur };
      } else {
        fusion[cle] = valeur;
      }
    }
  }
  return fusion;
}

export function ageProfilEnHeures(profil) {
  if (!profil?.genere_le) return Infinity;
  return (Date.now() - Date.parse(profil.genere_le)) / 3_600_000;
}

export function resumerProfil(profil) {
  const l = [];
  l.push(`Projet        ${profil.nom}${profil.monorepo ? ' (monorepo)' : ''}`);
  l.push(`Gestionnaire  ${profil.gestionnaire}`);
  l.push(`Technos       ${profil.technos.join(', ') || '—'}`);
  l.push(`Commandes     ${Object.entries(profil.commandes).map(([k, v]) => `${k}: ${v}`).join(' · ') || '—'}`);
  l.push(`Application   ${profil.appli.commandeDev ?? '—'} → ${profil.appli.urlBase}`);
  l.push(`Routes        ${profil.routes.length} · API ${profil.api.length} · locales ${profil.i18n.locales.join('/') || '—'}`);
  l.push(`CI            ${profil.ci.workflows.length} workflow(s)`);
  l.push(`Parcours      ${profil.parcours.length} cartographié(s)`);
  return l.join('\n');
}

export { existe };
