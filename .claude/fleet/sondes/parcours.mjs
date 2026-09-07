#!/usr/bin/env node
// Sonde Parcours — ouvre RÉELLEMENT l'application dans un navigateur et rapporte
// ce qu'elle voit. C'est la pièce qui remplace « j'ouvre l'app et je clique
// partout pour vérifier ».
//
//   node .claude/fleet/sondes/parcours.mjs [--url http://localhost:3000]
//                                          [--routes /,/tarifs] [--demarrer]
//                                          [--largeurs 390,1440] [--max 20]
//
// Elle ne produit PAS de constats : elle produit des OBSERVATIONS mesurées, que
// le département Parcours (ou a11y, ou ux) transforme en constats avec preuve.
// La distinction est volontaire : une sonde qui juge est une sonde qu'on croit
// sur parole.

import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { args, chemins, lireJson } from '../lib/util.mjs';

const { options } = args(process.argv.slice(2));
const c = chemins();
const profil = lireJson(c.profil) ?? {};
const url = String(options.url ?? profil.appli?.urlBase ?? 'http://localhost:3000').replace(/\/$/, '');
const largeurs = String(options.largeurs ?? '390,1440').split(',').map(Number);
const maxRoutes = Number(options.max ?? 20);
const routes = String(options.routes ?? (profil.routes ?? ['/']).join(','))
  .split(',')
  .map((r) => r.trim())
  .filter(Boolean)
  .filter((r) => !r.includes('[')) // routes dynamiques : sans donnée, elles ne prouvent rien
  .slice(0, maxRoutes);

const require_ = createRequire(import.meta.url);

async function chargerPlaywright() {
  for (const mod of ['playwright', 'playwright-core', '@playwright/test']) {
    try {
      return await import(mod);
    } catch {
      /* module suivant */
    }
  }
  console.error(
    'Playwright est introuvable dans ce dépôt.\n' +
      'Installe-le (`npm i -D playwright` puis `npx playwright install chromium`),\n' +
      "ou lance la sonde depuis un dépôt qui l'a déjà. La sonde ne devine pas :\n" +
      'sans navigateur, il n\'y a rien à rapporter.',
  );
  process.exit(3);
}

async function repond(u, ms = 2500) {
  try {
    const ctrl = AbortSignal.timeout(ms);
    const r = await fetch(u, { signal: ctrl, redirect: 'manual' });
    return r.status < 500;
  } catch {
    return false;
  }
}

async function demarrerAppli() {
  const commande = options.commande ?? profil.appli?.commandeDev;
  if (!commande) {
    console.error("Aucune commande de démarrage connue. Passe --url sur une application déjà lancée.");
    process.exit(3);
  }
  console.error(`Démarrage : ${commande}`);
  const enfant = spawn(commande, { cwd: profil.racine ?? process.cwd(), shell: true, detached: true, stdio: 'ignore' });
  enfant.unref();
  for (let i = 0; i < 60; i++) {
    if (await repond(url)) return enfant;
    await new Promise((r) => setTimeout(r, 2000));
  }
  try {
    process.kill(-enfant.pid, 'SIGTERM');
  } catch {
    /* déjà mort */
  }
  console.error(`L'application n'a pas répondu sur ${url} après 2 minutes.`);
  process.exit(3);
}

// Contrôles exécutés DANS la page. Volontairement factuels : chaque valeur
// remontée est vérifiable à la main en rouvrant la page.
const RELEVE = () => {
  const visible = (el) => {
    const s = getComputedStyle(el);
    return s.display !== 'none' && s.visibility !== 'hidden' && el.offsetParent !== null;
  };
  const nomAccessible = (el) =>
    (el.getAttribute('aria-label') ??
      el.getAttribute('title') ??
      (el.getAttribute('aria-labelledby') ? document.getElementById(el.getAttribute('aria-labelledby'))?.textContent : '') ??
      el.textContent ??
      '').trim();

  const titres = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map((h) => Number(h.tagName[1]));
  const sauts = [];
  for (let i = 1; i < titres.length; i++) if (titres[i] - titres[i - 1] > 1) sauts.push(`h${titres[i - 1]} → h${titres[i]}`);

  return {
    titre: document.title,
    langue: document.documentElement.lang || null,
    landmarkMain: Boolean(document.querySelector('main, [role="main"]')),
    h1: document.querySelectorAll('h1').length,
    sautsDeNiveau: sauts,
    debordementHorizontal: document.documentElement.scrollWidth > window.innerWidth + 1
      ? { scrollWidth: document.documentElement.scrollWidth, innerWidth: window.innerWidth }
      : null,
    imagesSansAlt: [...document.querySelectorAll('img:not([alt])')].map((i) => i.getAttribute('src')).slice(0, 10),
    controlesSansNom: [...document.querySelectorAll('button, a[href], [role="button"]')]
      .filter(visible)
      .filter((el) => !nomAccessible(el))
      .map((el) => el.outerHTML.slice(0, 120))
      .slice(0, 10),
    champsSansEtiquette: [...document.querySelectorAll('input:not([type="hidden"]), select, textarea')]
      .filter(visible)
      .filter((el) => {
        if (el.getAttribute('aria-label') || el.getAttribute('aria-labelledby')) return false;
        return !(el.id && document.querySelector(`label[for="${CSS.escape(el.id)}"]`)) && !el.closest('label');
      })
      .map((el) => el.outerHTML.slice(0, 120))
      .slice(0, 10),
    ciblesTactilesPetites: [...document.querySelectorAll('button, a[href], [role="button"], input[type="checkbox"]')]
      .filter(visible)
      .map((el) => ({ el, r: el.getBoundingClientRect() }))
      .filter(({ r }) => r.width > 0 && (r.width < 24 || r.height < 24))
      .map(({ el, r }) => ({ html: el.outerHTML.slice(0, 80), taille: `${Math.round(r.width)}x${Math.round(r.height)}` }))
      .slice(0, 10),
    metaDescription: document.querySelector('meta[name="description"]')?.content ?? null,
  };
};

async function auditerAxe(page) {
  let chemin;
  try {
    chemin = require_.resolve('axe-core/axe.min.js');
  } catch {
    return null; // axe n'est pas installé ici : on le dit, on ne l'invente pas
  }
  await page.addScriptTag({ path: chemin });
  return page.evaluate(async () => {
    // eslint-disable-next-line no-undef
    const res = await axe.run(document, { resultTypes: ['violations'] });
    return res.violations.map((v) => ({
      regle: v.id,
      impact: v.impact,
      description: v.help,
      critere: (v.tags ?? []).filter((t) => t.startsWith('wcag')).join(','),
      elements: v.nodes.slice(0, 3).map((n) => n.html.slice(0, 160)),
      nombre: v.nodes.length,
    }));
  });
}

const { chromium } = await chargerPlaywright();

let appli = null;
if (!(await repond(url))) {
  if (options.demarrer) appli = await demarrerAppli();
  else {
    console.error(`Rien ne répond sur ${url}. Lance l'application, ou ajoute --demarrer.`);
    process.exit(3);
  }
}

const dossierCaptures = resolve(c.etat, 'captures');
mkdirSync(dossierCaptures, { recursive: true });

// Certaines images (CI, conteneurs d'agent) fournissent un Chromium système dont
// la version ne correspond pas à celle que Playwright téléchargerait. Sans cette
// porte de sortie, la sonde échoue là où un navigateur parfaitement utilisable
// est déjà présent.
const executablePath = options.navigateur ?? process.env.FLEET_CHROMIUM ?? undefined;
const navigateur = await chromium.launch({ executablePath }).catch((e) => {
  console.error(String(e).split('\n').slice(0, 3).join('\n'));
  console.error(
    '\nAucun navigateur lançable. Deux sorties :\n' +
      '  npx playwright install chromium\n' +
      '  ou : --navigateur /chemin/vers/chrome (ou FLEET_CHROMIUM=/chemin)',
  );
  process.exit(3);
});
const observations = [];

for (const route of routes) {
  for (const largeur of largeurs) {
    const contexte = await navigateur.newContext({ viewport: { width: largeur, height: 900 } });
    const page = await contexte.newPage();
    const erreursConsole = [];
    const erreursPage = [];
    const reseau = [];

    page.on('console', (m) => {
      if (m.type() === 'error') erreursConsole.push(m.text().slice(0, 300));
    });
    page.on('pageerror', (e) => erreursPage.push(String(e).slice(0, 300)));
    page.on('response', (r) => {
      if (r.status() >= 400) reseau.push({ statut: r.status(), url: r.url().slice(0, 200) });
    });

    const observation = { route, largeur, url: `${url}${route}` };
    try {
      const reponse = await page.goto(observation.url, { waitUntil: 'domcontentloaded', timeout: 30_000 });
      observation.statut = reponse?.status() ?? null;
      await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {});
      Object.assign(observation, await page.evaluate(RELEVE));
      if (largeur === largeurs[0]) observation.axe = await auditerAxe(page).catch(() => null);
      const capture = resolve(dossierCaptures, `${route.replace(/\W+/g, '_') || 'racine'}-${largeur}.png`);
      await page.screenshot({ path: capture, fullPage: true });
      observation.capture = capture;
    } catch (e) {
      observation.echec = String(e).slice(0, 300);
    }

    observation.erreursConsole = erreursConsole;
    observation.erreursPage = erreursPage;
    observation.requetesEnEchec = reseau;
    observations.push(observation);
    await contexte.close();
    process.stderr.write(
      `${route} @${largeur}px  ${observation.echec ? 'ÉCHEC' : observation.statut}  ` +
        `${erreursConsole.length + erreursPage.length} erreur(s) · ${reseau.length} requête(s) en échec\n`,
    );
  }
}

await navigateur.close();
if (appli) {
  try {
    process.kill(-appli.pid, 'SIGTERM');
  } catch {
    /* déjà mort */
  }
}

const sortie = options.sortie ?? resolve(c.etat, 'entrant', 'sonde-parcours.json');
mkdirSync(resolve(c.etat, 'entrant'), { recursive: true });
const rapport = {
  genere_le: new Date().toISOString(),
  url,
  routes: routes.length,
  largeurs,
  axe_disponible: observations.some((o) => Array.isArray(o.axe)),
  observations,
};
writeFileSync(sortie, JSON.stringify(rapport, null, 2));

const casses = observations.filter((o) => o.echec || (o.statut ?? 200) >= 400);
const bruyantes = observations.filter((o) => o.erreursConsole.length || o.erreursPage.length);
console.error('');
console.error(`Sonde terminée : ${observations.length} relevés → ${sortie}`);
console.error(`  ${casses.length} page(s) en échec · ${bruyantes.length} page(s) avec erreurs JS`);
console.error('  Ces relevés sont des OBSERVATIONS : à transformer en constats, avec preuve, par le département.');
