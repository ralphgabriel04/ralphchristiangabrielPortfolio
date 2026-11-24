// Les portes. Aucune itération de la boucle ne se termine sans passer par ici :
// un correctif non vérifié n'est pas un correctif, c'est une hypothèse committée.

import { spawnSync } from 'node:child_process';
import { ajouterJsonl, chemins, maintenant } from './util.mjs';

// Ordre volontaire : du moins cher au plus cher. On s'arrête tôt si demandé.
export const ORDRE = ['format', 'lint', 'typecheck', 'test', 'build', 'e2e'];
export const RAPIDES = ['lint', 'typecheck', 'test'];

function queue(texte, n = 40) {
  const lignes = String(texte ?? '').trimEnd().split('\n');
  return lignes.slice(-n).join('\n');
}

export function lancerPorte(role, commande, { racine, minutes = 15 }) {
  const debut = Date.now();
  const res = spawnSync(commande, {
    cwd: racine,
    shell: true,
    encoding: 'utf8',
    timeout: minutes * 60_000,
    maxBuffer: 32 * 1024 * 1024,
    env: { ...process.env, CI: '1', FORCE_COLOR: '0' },
  });
  const expire = res.error && res.error.code === 'ETIMEDOUT';
  return {
    role,
    commande,
    code: expire ? 124 : (res.status ?? 1),
    ok: !expire && res.status === 0,
    expire: Boolean(expire),
    duree_s: Math.round((Date.now() - debut) / 1000),
    sortie: queue(`${res.stdout ?? ''}\n${res.stderr ?? ''}`),
  };
}

export function lancerPortes(profil, { portes = null, rapide = false, arretPremiereErreur = false, minutes = 15 } = {}) {
  const c = chemins(profil.racine);
  const choisies = portes ?? (rapide ? RAPIDES : ORDRE);
  const resultats = [];
  for (const role of ORDRE) {
    if (!choisies.includes(role)) continue;
    const commande = profil.commandes?.[role];
    if (!commande) {
      resultats.push({ role, commande: null, ok: null, absente: true });
      continue;
    }
    const r = lancerPorte(role, commande, { racine: profil.racine, minutes });
    resultats.push(r);
    if (!r.ok && arretPremiereErreur) break;
  }
  const bilan = {
    le: maintenant(),
    portes: resultats.map(({ role, ok, code, duree_s, absente }) => ({ role, ok, code, duree_s, absente })),
    vert: resultats.every((r) => r.ok !== false),
  };
  ajouterJsonl(c.verifications, bilan);
  return { resultats, ...bilan };
}
