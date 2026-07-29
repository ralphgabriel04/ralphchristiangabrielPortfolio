// ============================================================
// UI — Boutons, color pickers, scoreboard
// Owners : Aimen (F3 score, F5 boutons), Ralph (F6 colors)
//
// Sections clairement séparées par des bandeaux de commentaires.
// ============================================================

import {
    setState, resetRound, getScores, getMotos, getState,
    STATE_RUNNING, STATE_PAUSED, STATE_READY, STATE_GAME_OVER
} from './game.js';

// Sera défini par main.js au démarrage (pour permettre de redémarrer la boucle au clic Go)
let onGoCallback = null;
let onRestartCallback = null;

export function setOnGoCallback(cb)      { onGoCallback = cb; }
export function setOnRestartCallback(cb) { onRestartCallback = cb; }

export function initUI() {
    initButtons();       // F5 — Aimen
    initColorPickers();  // F6 — Ralph
    initScoreboard();    // F3 — Aimen
}

// =========================================================
// F5 — BOUTONS PAUSE / GO / RESTART (Aimen)
// =========================================================
function initButtons() {
    document.getElementById('btnGo').addEventListener('click', () => {
        const state = getState();
        if (state === STATE_RUNNING) return;  // déjà en cours
        setState(STATE_RUNNING);
        if (onGoCallback) onGoCallback();
    });

    document.getElementById('btnPause').addEventListener('click', () => {
        if (getState() === STATE_RUNNING) {
            setState(STATE_PAUSED);
        }
    });

    document.getElementById('btnRestart').addEventListener('click', () => {
        resetRound();
        if (onRestartCallback) onRestartCallback();
    });
}

// =========================================================
// F6 — COLOR PICKERS (Ralph)
// =========================================================
function initColorPickers() {
    document.getElementById('colorJ1').addEventListener('change', (e) => {
        const { motoJ1 } = getMotos();
        if (motoJ1) motoJ1.setColor(e.target.value);
    });

    document.getElementById('colorJ2').addEventListener('change', (e) => {
        const { motoJ2 } = getMotos();
        if (motoJ2) motoJ2.setColor(e.target.value);
    });
}

// =========================================================
// F3 — SCOREBOARD (Aimen)
// =========================================================
function initScoreboard() {
    updateScoreDisplay();
}

export function updateScoreDisplay() {
    const { scoreJ1, scoreJ2, scoreNuls } = getScores();
    document.getElementById('scoreJ1').textContent = scoreJ1;
    document.getElementById('scoreJ2').textContent = scoreJ2;
    document.getElementById('scoreNuls').textContent = scoreNuls;
}

export function updateStateDisplay() {
    document.getElementById('stateLabel').textContent = getState();
}
