#!/usr/bin/env node
// Inspecteur d'écrans de la flotte — OUVRE l'application réelle, capture, et
// mesure ce qu'un humain verrait : débordements, texte tronqué, polices
// incohérentes, clés de traduction non résolues, images cassées, cibles trop
// petites, erreurs de console, requêtes en échec.
//
// Il ne juge RIEN. Il produit des ancres : des captures et des mesures. C'est
// l'agent `pilote-visuel` qui interprète, et il ne peut interpréter que ce
// fichier-ci — pas ses souvenirs.
//
// Usage :
//   node scripts/fleet/inspecter-ecrans.mjs [--url http://localhost:4173]
//                                           [--ecrans /,/privacy]
//                                           [--viewport desktop|mobile|tous]
//                                           [--sortie <dossier>]
//
// Prérequis : le serveur doit tourner. Le plus court :
//   node prototype/build.mjs && node scripts/e2e-serve.mjs &
import { chromium, devices } from '@playwright/test';
import { mkdirSync, writeFileSync, existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const arg = (n, d) => {
  const i = process.argv.indexOf('--' + n);
  return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : d;
};

const CONF_PATH = '.claude/fleet/ecrans.json';
const conf = existsSync(CONF_PATH) ? JSON.parse(readFileSync(CONF_PATH, 'utf8')) : {};

const BASE = arg('url', conf.baseUrl || process.env.FLEET_URL || 'http://localhost:4173');
const HORODATAGE = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const SORTIE = arg('sortie', join('.claude', 'fleet', 'captures', HORODATAGE));
const VIEWPORT = arg('viewport', 'tous');

const VIEWPORTS = {
  desktop: { name: 'desktop', viewport: { width: 1280, height: 800 }, isMobile: false },
  mobile: { ...devices['iPhone 13'], name: 'mobile', browserName: undefined },
};
const choisis =
  VIEWPORT === 'tous' ? ['desktop', 'mobile'] : [VIEWPORT];

// ---------------------------------------------------------------- audits DOM
// Exécuté DANS la page. Ne retourne que du mesuré ; aucune appréciation.
const AUDIT = () => {
  const visible = (el) => {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return false;
    const s = getComputedStyle(el);
    return s.visibility !== 'hidden' && s.display !== 'none' && s.opacity !== '0';
  };
  const chemin = (el) => {
    const bouts = [];
    for (let n = el; n && n.nodeType === 1 && bouts.length < 4; n = n.parentElement) {
      let b = n.tagName.toLowerCase();
      if (n.id) { bouts.unshift(b + '#' + n.id); break; }
      if (n.className && typeof n.className === 'string') {
        const c = n.className.trim().split(/\s+/).slice(0, 2).join('.');
        if (c) b += '.' + c;
      }
      bouts.unshift(b);
    }
    return bouts.join(' > ');
  };
  const texte = (el) => (el.innerText || '').trim().slice(0, 90);

  const tous = Array.from(document.querySelectorAll('body *')).filter(visible);
  const largeurDoc = document.documentElement.clientWidth;

  // 1. Débordement horizontal du document — « ça dépasse à droite »
  const debordementDocument =
    document.documentElement.scrollWidth > largeurDoc + 1
      ? { scrollWidth: document.documentElement.scrollWidth, clientWidth: largeurDoc }
      : null;

  // 2. Éléments qui sortent du cadre du viewport
  const horsCadre = tous
    .filter((el) => {
      const r = el.getBoundingClientRect();
      return r.width > 4 && (r.right > largeurDoc + 1 || r.left < -1);
    })
    .filter((el) => !el.closest('[aria-hidden="true"]'))
    .slice(0, 25)
    .map((el) => ({
      selecteur: chemin(el),
      texte: texte(el),
      droite: Math.round(el.getBoundingClientRect().right),
      largeurDoc: largeurDoc,
    }));

  // 3. Texte tronqué : le contenu est plus large/haut que sa boîte, et la boîte coupe
  const tronque = tous
    .filter((el) => {
      if (!el.innerText || !el.innerText.trim()) return false;
      if (el.children.length > 3) return false;
      const s = getComputedStyle(el);
      const coupe = s.overflow === 'hidden' || s.overflowX === 'hidden' || s.overflowY === 'hidden' || s.textOverflow === 'ellipsis';
      if (!coupe) return false;
      return el.scrollWidth > el.clientWidth + 2 || el.scrollHeight > el.clientHeight + 2;
    })
    .slice(0, 25)
    .map((el) => ({
      selecteur: chemin(el),
      texte: texte(el),
      contenu: el.scrollWidth + '×' + el.scrollHeight,
      boite: el.clientWidth + '×' + el.clientHeight,
      ellipsis: getComputedStyle(el).textOverflow === 'ellipsis',
    }));

  // 4. Inventaire des polices réellement rendues
  const polices = {};
  for (const el of tous) {
    if (!el.innerText || !el.innerText.trim()) continue;
    const s = getComputedStyle(el);
    const cle = s.fontFamily.split(',')[0].replace(/["']/g, '').trim();
    polices[cle] = (polices[cle] || 0) + 1;
  }

  // 5. Traductions non résolues : gabarits, clés brutes, valeurs manquantes
  const corps = document.body.innerText || '';
  const motifs = [
    { nom: 'gabarit-non-interpole', re: /\{\{[^}]{1,40}\}\}/g },
    { nom: 'cle-brute', re: /\b[a-z][a-z0-9]*(?:\.[a-z][a-zA-Z0-9]*){1,4}\b(?=\s|$)/g },
    { nom: 'undefined-affiche', re: /\bundefined\b|\bNaN\b|\[object Object\]/g },
  ];
  const i18n = [];
  for (const m of motifs) {
    const trouves = [...new Set((corps.match(m.re) || []).slice(0, 40))];
    const gardes = m.nom === 'cle-brute'
      ? trouves.filter((t) => /^(nav|common|app|ui|label|btn|msg|error|page|form|menu|title|action)\./.test(t))
      : trouves;
    if (gardes.length) i18n.push({ motif: m.nom, occurrences: gardes.slice(0, 12) });
  }

  // 6. Images cassées
  const imagesCassees = Array.from(document.images)
    .filter((i) => i.complete && i.naturalWidth === 0)
    .slice(0, 15)
    .map((i) => ({ src: i.getAttribute('src'), alt: i.getAttribute('alt') }));

  // 7. Cibles tactiles sous le seuil WCAG 2.5.8 (24 px)
  const ciblesPetites = tous
    .filter((el) => ['A', 'BUTTON', 'INPUT', 'SELECT', 'SUMMARY'].includes(el.tagName) || el.getAttribute('role') === 'button')
    .filter((el) => {
      const r = el.getBoundingClientRect();
      return r.width > 0 && (r.width < 24 || r.height < 24);
    })
    .slice(0, 20)
    .map((el) => {
      const r = el.getBoundingClientRect();
      return { selecteur: chemin(el), texte: texte(el), taille: Math.round(r.width) + '×' + Math.round(r.height) };
    });

  // 8. Contrôles sans nom accessible
  const sansNom = tous
    .filter((el) => ['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'].includes(el.tagName))
    .filter((el) => {
      const n = (el.getAttribute('aria-label') || el.getAttribute('title') || el.innerText || '').trim();
      const parLabel = el.id && document.querySelector('label[for="' + CSS.escape(el.id) + '"]');
      const parRef = el.getAttribute('aria-labelledby');
      return !n && !parLabel && !parRef;
    })
    .slice(0, 20)
    .map((el) => ({ selecteur: chemin(el), tag: el.tagName.toLowerCase() }));

  // 9. Navigation découverte — sert à l'exploration automatique
  const nav = [...new Set(
    Array.from(document.querySelectorAll('a[href], [role="link"], nav button, [data-route]'))
      .filter(visible)
      .map((el) => el.getAttribute('href') || el.getAttribute('data-route') || texte(el))
      .filter(Boolean)
      .filter((h) => !/^(https?:|mailto:|tel:)/.test(h))
  )].slice(0, 40);

  return {
    langue: document.documentElement.lang || null,
    titre: document.title,
    debordementDocument,
    horsCadre,
    tronque,
    polices,
    i18n,
    imagesCassees,
    ciblesPetites,
    sansNom,
    nav,
    compteElements: tous.length,
  };
};

// ------------------------------------------------------------------- moteur
async function inspecter() {
  mkdirSync(SORTIE, { recursive: true });
  const navigateur = await chromium.launch();
  const rapport = {
    horodatage: new Date().toISOString(),
    base: BASE,
    dossier: SORTIE,
    ecrans: [],
    erreurs: [],
  };

  let ecrans = (arg('ecrans', '') || (conf.ecrans || []).join(',')).split(',').map((s) => s.trim()).filter(Boolean);

  for (const nomVp of choisis) {
    const vp = VIEWPORTS[nomVp];
    const contexte = await navigateur.newContext({
      viewport: vp.viewport,
      userAgent: vp.userAgent,
      deviceScaleFactor: vp.deviceScaleFactor,
      isMobile: vp.isMobile,
      hasTouch: vp.hasTouch,
      locale: conf.locale || 'fr-CA',
    });
    const page = await contexte.newPage();

    // Découverte : si aucun écran n'est fourni, on lit la navigation de l'accueil.
    if (!ecrans.length) {
      try {
        await page.goto(BASE, { waitUntil: 'networkidle', timeout: 30000 });
        const nav = await page.evaluate(AUDIT).then((r) => r.nav);
        ecrans = ['/', ...nav.filter((h) => h.startsWith('/'))].slice(0, 12);
        rapport.decouverte = ecrans;
      } catch (e) {
        rapport.erreurs.push({ etape: 'decouverte', message: String(e.message || e) });
        ecrans = ['/'];
      }
    }

    for (const chemin of ecrans) {
      const url = new URL(chemin, BASE).toString();
      const console_ = [];
      const reseau = [];
      const onConsole = (m) => { if (m.type() === 'error') console_.push(m.text().slice(0, 300)); };
      const onFailed = (r) => reseau.push({ url: r.url().slice(0, 200), erreur: r.failure()?.errorText });
      const onReponse = (r) => { if (r.status() >= 400) reseau.push({ url: r.url().slice(0, 200), statut: r.status() }); };
      page.on('console', onConsole);
      page.on('requestfailed', onFailed);
      page.on('response', onReponse);

      const entree = { ecran: chemin, viewport: nomVp, url };
      try {
        const rep = await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
        entree.statutHttp = rep ? rep.status() : null;
        await page.waitForTimeout(400);
        const fichier = join(SORTIE, `${nomVp}${chemin.replace(/[^a-z0-9]+/gi, '_') || '_racine'}.png`);
        await page.screenshot({ path: fichier, fullPage: true });
        entree.capture = fichier;
        Object.assign(entree, await page.evaluate(AUDIT));
      } catch (e) {
        entree.echec = String(e.message || e);
      }
      entree.erreursConsole = console_;
      entree.reseauEnEchec = reseau;
      page.off('console', onConsole);
      page.off('requestfailed', onFailed);
      page.off('response', onReponse);
      rapport.ecrans.push(entree);
      process.stderr.write(`  ${nomVp} ${chemin} ${entree.echec ? '✗' : '✓'}\n`);
    }
    await contexte.close();
  }
  await navigateur.close();

  // Synthèse chiffrée — aucune interprétation, seulement des compteurs.
  const c = (f) => rapport.ecrans.reduce((n, e) => n + (Array.isArray(e[f]) ? e[f].length : 0), 0);
  rapport.synthese = {
    ecransInspectes: rapport.ecrans.length,
    ecransEnEchec: rapport.ecrans.filter((e) => e.echec).length,
    debordementsDocument: rapport.ecrans.filter((e) => e.debordementDocument).length,
    elementsHorsCadre: c('horsCadre'),
    textesTronques: c('tronque'),
    imagesCassees: c('imagesCassees'),
    ciblesTropPetites: c('ciblesPetites'),
    controlesSansNom: c('sansNom'),
    erreursConsole: c('erreursConsole'),
    reseauEnEchec: c('reseauEnEchec'),
    famillesDePolices: [...new Set(rapport.ecrans.flatMap((e) => Object.keys(e.polices || {})))],
  };

  const chemin = join(SORTIE, 'rapport.json');
  writeFileSync(chemin, JSON.stringify(rapport, null, 2));
  console.log(JSON.stringify({ rapport: chemin, dossier: SORTIE, synthese: rapport.synthese }, null, 2));
  return rapport;
}

inspecter().catch((e) => {
  console.error('[inspecter-ecrans] échec :', e.message);
  console.error("Le serveur tourne-t-il ? `node prototype/build.mjs && node scripts/e2e-serve.mjs`");
  process.exit(1);
});
