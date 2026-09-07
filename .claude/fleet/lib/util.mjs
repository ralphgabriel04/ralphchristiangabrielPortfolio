// Utilitaires communs à la Fleet. Zéro dépendance : ce fichier doit tourner
// dans n'importe quel dépôt, y compris un dépôt sans `node_modules` installé.
import { createHash } from 'node:crypto';
import { appendFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

/** Racine du dépôt = le dossier qui contient `.claude/fleet` (sinon `.git`). */
export function racine(depuis = process.cwd()) {
  let d = resolve(depuis);
  for (;;) {
    if (existsSync(resolve(d, '.claude/fleet/fleet.mjs'))) return d;
    if (existsSync(resolve(d, '.git'))) return d;
    const parent = dirname(d);
    if (parent === d) return resolve(depuis);
    d = parent;
  }
}

export const chemins = (r = racine()) => ({
  racine: r,
  fleet: resolve(r, '.claude/fleet'),
  etat: resolve(r, '.claude/fleet/etat'),
  entrant: resolve(r, '.claude/fleet/etat/entrant'),
  profil: resolve(r, '.claude/fleet/etat/profil.json'),
  constats: resolve(r, '.claude/fleet/etat/constats.jsonl'),
  verifications: resolve(r, '.claude/fleet/etat/verifications.jsonl'),
  journal: resolve(r, '.claude/fleet/etat/JOURNAL.md'),
  rapport: resolve(r, '.claude/fleet/etat/RAPPORT.md'),
  config: resolve(r, 'fleet.config.json'),
});

export function lireJson(f, defaut = null) {
  try {
    return JSON.parse(readFileSync(f, 'utf8'));
  } catch {
    return defaut;
  }
}

export function ecrireJson(f, v) {
  mkdirSync(dirname(f), { recursive: true });
  writeFileSync(f, JSON.stringify(v, null, 2) + '\n');
}

export function lireJsonl(f) {
  if (!existsSync(f)) return [];
  return readFileSync(f, 'utf8')
    .split('\n')
    .filter((l) => l.trim())
    .map((l) => {
      try {
        return JSON.parse(l);
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}

export function ecrireJsonl(f, lignes) {
  mkdirSync(dirname(f), { recursive: true });
  writeFileSync(f, lignes.map((l) => JSON.stringify(l)).join('\n') + (lignes.length ? '\n' : ''));
}

export function ajouterJsonl(f, ligne) {
  mkdirSync(dirname(f), { recursive: true });
  appendFileSync(f, JSON.stringify(ligne) + '\n');
}

export const empreinte = (...parties) =>
  createHash('sha1')
    .update(parties.map((p) => String(p ?? '')).join(' '))
    .digest('hex')
    .slice(0, 12);

/** Normalise un titre pour la déduplication : casse, accents, ponctuation, chiffres. */
export const normaliser = (s) =>
  String(s ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\b\d+\b/g, '#')
    .trim();

export const maintenant = () => new Date().toISOString();

const ESC = String.fromCharCode(27);
const teinte = (code) => (s) => (process.stdout.isTTY ? `${ESC}[${code}m${s}${ESC}[0m` : String(s));
export const couleurs = {
  gras: teinte(1),
  faible: teinte(2),
  rouge: teinte(31),
  vert: teinte(32),
  jaune: teinte(33),
  bleu: teinte(36),
};

/** Parse `--cle valeur`, `--cle=valeur`, `--drapeau`, et les positionnels. */
export function args(argv) {
  const positionnels = [];
  const options = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const [cle, valeurInline] = a.slice(2).split('=');
      if (valeurInline !== undefined) options[cle] = valeurInline;
      else if (argv[i + 1] && !argv[i + 1].startsWith('--')) options[cle] = argv[++i];
      else options[cle] = true;
    } else positionnels.push(a);
  }
  return { positionnels, options };
}
