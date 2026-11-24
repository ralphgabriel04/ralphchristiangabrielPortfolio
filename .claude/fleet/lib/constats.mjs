// Le carnet de constats : la mémoire de la Fleet entre deux itérations et entre
// deux sessions. C'est ce fichier qui permet à la boucle de reprendre là où elle
// s'est arrêtée au lieu de re-découvrir chaque fois les mêmes trente problèmes.

import { chemins, ecrireJsonl, empreinte, lireJsonl, maintenant, normaliser } from './util.mjs';
import { parCle } from './departements.mjs';

export const GRAVITES = { bloquant: 100, majeur: 40, mineur: 12, polish: 4 };
export const PORTEES = { global: 3, section: 2, route: 1.5, composant: 1 };
export const COUTS = { S: 1, M: 2, L: 4 };
export const OUVERTS = new Set(['ouvert', 'en_cours']);
export const STATUTS = ['ouvert', 'en_cours', 'corrige', 'verifie', 'rejete', 'doublon', 'differe'];

export function charger(c = chemins()) {
  return lireJsonl(c.constats);
}

export function sauver(liste, c = chemins()) {
  ecrireJsonl(c.constats, liste);
}

export function priorite(k) {
  const g = GRAVITES[k.gravite] ?? 12;
  const p = PORTEES[k.portee] ?? 1;
  const cout = COUTS[String(k.cout ?? 'M').toUpperCase()] ?? 2;
  const conf = typeof k.confiance === 'number' ? Math.min(1, Math.max(0.1, k.confiance)) : 0.8;
  return Math.round((g * p * conf) / cout);
}

const cibleCourte = (k) => String(k.cible ?? k.fichier ?? k.route ?? '').split('/').slice(-2).join('/');

export function empreinteDe(k) {
  return empreinte(k.departement, normaliser(k.titre), normaliser(cibleCourte(k)));
}

function prochainId(liste, departement) {
  const prefixe = parCle(departement)?.prefixe ?? departement.slice(0, 4).toUpperCase();
  const n = liste.filter((k) => k.departement === departement).length + 1;
  return `${prefixe}-${String(n).padStart(3, '0')}`;
}

/**
 * Ingère des constats bruts. Idempotent : deux passes du même département ne
 * créent pas deux fois le même constat. Un constat déjà marqué corrigé qui
 * revient est signalé comme RÉGRESSION — c'est le seul moyen de savoir qu'un
 * correctif n'a pas tenu.
 */
export function ingerer(bruts, { departement, source = 'agent', iteration = 0 } = {}, c = chemins()) {
  const liste = charger(c);
  const parEmpreinte = new Map(liste.map((k) => [k.empreinte, k]));
  const resultat = { crees: [], revus: [], regressions: [], rejetes: [] };

  for (const brut of bruts) {
    const dep = brut.departement ?? departement;
    if (!dep || !brut.titre) {
      resultat.rejetes.push({ brut, raison: 'departement ou titre manquant' });
      continue;
    }
    const gravite = String(brut.gravite ?? 'mineur').toLowerCase();
    if (!GRAVITES[gravite]) {
      resultat.rejetes.push({ brut, raison: `gravite inconnue: ${brut.gravite}` });
      continue;
    }
    if (!brut.preuve) {
      resultat.rejetes.push({ brut, raison: 'preuve manquante (regle non negociable)' });
      continue;
    }

    const normalise = {
      departement: dep,
      titre: String(brut.titre).trim(),
      gravite,
      portee: String(brut.portee ?? 'composant').toLowerCase(),
      cible: brut.cible ?? brut.fichier ?? brut.route ?? null,
      ligne: brut.ligne ?? null,
      preuve: String(brut.preuve).trim(),
      impact: brut.impact ?? null,
      correctif: brut.correctif ?? brut.correctif_propose ?? null,
      cout: String(brut.cout ?? 'M').toUpperCase(),
      confiance: typeof brut.confiance === 'number' ? brut.confiance : 0.8,
      etapes: brut.etapes ?? null,
      reference: brut.reference ?? null,
    };
    normalise.empreinte = empreinteDe(normalise);
    normalise.priorite = priorite(normalise);

    const existant = parEmpreinte.get(normalise.empreinte);
    if (existant) {
      existant.vu = (existant.vu ?? 1) + 1;
      existant.derniere_vue = maintenant();
      existant.preuve = normalise.preuve;
      existant.priorite = priorite({ ...existant, ...normalise });
      if (existant.statut === 'corrige' || existant.statut === 'verifie') {
        existant.statut = 'ouvert';
        existant.regressions = (existant.regressions ?? 0) + 1;
        existant.notes = [...(existant.notes ?? []), { le: maintenant(), texte: 'RÉGRESSION : ce constat était marqué corrigé et il est de retour.' }];
        resultat.regressions.push(existant);
      } else {
        resultat.revus.push(existant);
      }
      continue;
    }

    const constat = {
      id: prochainId(liste, dep),
      ...normalise,
      statut: 'ouvert',
      source,
      iteration,
      vu: 1,
      cree_le: maintenant(),
      derniere_vue: maintenant(),
      notes: [],
      verifications: [],
    };
    liste.push(constat);
    parEmpreinte.set(constat.empreinte, constat);
    resultat.crees.push(constat);
  }

  sauver(liste, c);
  return resultat;
}

export function trouver(id, c = chemins()) {
  return charger(c).find((k) => k.id === id) ?? null;
}

export function majConstat(id, patch, c = chemins()) {
  const liste = charger(c);
  const k = liste.find((x) => x.id === id);
  if (!k) return null;
  Object.assign(k, patch, { maj_le: maintenant() });
  k.priorite = priorite(k);
  sauver(liste, c);
  return k;
}

export function noter(id, texte, c = chemins()) {
  const k = trouver(id, c);
  if (!k) return null;
  return majConstat(id, { notes: [...(k.notes ?? []), { le: maintenant(), texte }] }, c);
}

/** File de travail : ce sur quoi la prochaine itération doit taper. */
export function prochains({ n = 5, departement = null, graviteMin = null } = {}, c = chemins()) {
  const seuil = graviteMin ? (GRAVITES[graviteMin] ?? 0) : 0;
  return charger(c)
    .filter((k) => OUVERTS.has(k.statut))
    .filter((k) => !departement || k.departement === departement)
    .filter((k) => (GRAVITES[k.gravite] ?? 0) >= seuil)
    .sort((a, b) => b.priorite - a.priorite || (GRAVITES[b.gravite] ?? 0) - (GRAVITES[a.gravite] ?? 0))
    .slice(0, n);
}

/** Score par département : 100 moins la dette ouverte, plancher 0. */
export function statistiques(c = chemins()) {
  const liste = charger(c);
  const parDep = new Map();
  for (const k of liste) {
    if (!parDep.has(k.departement)) {
      parDep.set(k.departement, { departement: k.departement, total: 0, ouverts: 0, corriges: 0, verifies: 0, rejetes: 0, regressions: 0, dette: 0, bloquants: 0 });
    }
    const s = parDep.get(k.departement);
    s.total++;
    s.regressions += k.regressions ?? 0;
    if (OUVERTS.has(k.statut)) {
      s.ouverts++;
      s.dette += (GRAVITES[k.gravite] ?? 0) * (PORTEES[k.portee] ?? 1);
      if (k.gravite === 'bloquant') s.bloquants++;
    } else if (k.statut === 'verifie') s.verifies++;
    else if (k.statut === 'corrige') s.corriges++;
    else if (k.statut === 'rejete' || k.statut === 'doublon') s.rejetes++;
  }
  for (const s of parDep.values()) {
    s.score = Math.max(0, Math.round(100 - Math.min(100, s.dette / 6)));
  }
  const deps = [...parDep.values()].sort((a, b) => a.score - b.score);
  const global = deps.length ? Math.round(deps.reduce((t, s) => t + s.score, 0) / deps.length) : null;
  return {
    departements: deps,
    global,
    total: liste.length,
    ouverts: liste.filter((k) => OUVERTS.has(k.statut)).length,
    bloquants: liste.filter((k) => OUVERTS.has(k.statut) && k.gravite === 'bloquant').length,
  };
}
