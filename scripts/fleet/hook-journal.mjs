#!/usr/bin/env node
// Écrit le journal de la flotte. Appelé par les hooks de Claude Code, JAMAIS par
// un agent : c'est ce qui en fait une trace et non un compte-rendu. Un agent qui
// pourrait éditer sa propre trace n'en laisse pas.
//
// Il échoue TOUJOURS en silence (code 0) : un journal cassé ne doit jamais
// bloquer le travail. La perte d'une ligne de journal se voit ; une session
// bloquée par son propre journal coûte plus cher.
import { appendFileSync, mkdirSync, readFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { execFileSync } from 'node:child_process';

const FICHIER = '.claude/fleet/journal/runs.jsonl';

const lireEntree = () => {
  try { return JSON.parse(readFileSync(0, 'utf8')); } catch { return {}; }
};
const tete = () => {
  try { return execFileSync('git', ['rev-parse', '--short', 'HEAD'], { encoding: 'utf8' }).trim(); }
  catch { return null; }
};
// Ne journalise jamais une valeur qui ressemble à un secret.
const assainir = (v) => {
  if (typeof v !== 'string') return v;
  return v.replace(/\b(sk-[A-Za-z0-9_-]{8,}|eyJ[A-Za-z0-9_.-]{20,}|gh[pousr]_[A-Za-z0-9]{20,})\b/g, '<secret-masqué>')
          .slice(0, 600);
};

try {
  const e = lireEntree();
  const ligne = {
    t: new Date().toISOString(),
    session: e.session_id || null,
    evenement: e.hook_event_name || 'inconnu',
    agent: e.agent_type || e.agent_id || null,
    outil: e.tool_name || null,
    cible: assainir(e.tool_input?.file_path || e.tool_input?.command || null),
    cwd: e.cwd || null,
    head: tete(),
  };
  mkdirSync(dirname(FICHIER), { recursive: true });
  appendFileSync(FICHIER, JSON.stringify(ligne) + '\n');
} catch {
  // silence volontaire — voir l'en-tête
}
process.exit(0);
