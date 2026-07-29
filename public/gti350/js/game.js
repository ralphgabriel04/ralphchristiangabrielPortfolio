// ============================================================
// GAME — advance() + collisions + score + multi-tours (F3)
// ============================================================

import { NUM_CELLS_HORIZONTAL, NUM_CELLS_VERTICAL, CELL_EMPTY, CELL_OCCUPIED_1, CELL_OCCUPIED_2 } from './constants.js';
import { grid, initGrid } from './grid.js';
import {
    lightCycle1_x, lightCycle1_y, lightCycle1_vx, lightCycle1_vy, lightCycle1_alive,
    lightCycle2_x, lightCycle2_y, lightCycle2_vx, lightCycle2_vy, lightCycle2_alive,
    setPosition1, setAlive1,
    setPosition2, setAlive2,
    resetMotos
} from './motorcycle.js';
import { redraw } from './renderer.js';

export var gameStopped = false;
export var gamePaused = false;
export var scoreJ1 = 0;
export var scoreJ2 = 0;
export var scoreNuls = 0;

// Pour input-mouse.js
export var STATE_RUNNING = 'running';
export var STATE_STOPPED = 'stopped';

export function getState() {
    if (gameStopped) return STATE_STOPPED;
    if (gamePaused) return STATE_STOPPED;
    return STATE_RUNNING;
}

export function pauseGame() {
    gamePaused = true;
}

export function goGame() {
    gamePaused = false;
}

export function advance() {
    if (gameStopped || gamePaused) return;

    // Calculer les nouvelles positions
    var new1_x = lightCycle1_x + lightCycle1_vx;
    var new1_y = lightCycle1_y + lightCycle1_vy;
    var new2_x = lightCycle2_x + lightCycle2_vx;
    var new2_y = lightCycle2_y + lightCycle2_vy;

    // Vérifier collision joueur 1 (bords + traces)
    var crash1 = new1_x < 0 || new1_x >= NUM_CELLS_HORIZONTAL
        || new1_y < 0 || new1_y >= NUM_CELLS_VERTICAL
        || grid[new1_x][new1_y] !== CELL_EMPTY;

    // Vérifier collision joueur 2 (bords + traces)
    var crash2 = new2_x < 0 || new2_x >= NUM_CELLS_HORIZONTAL
        || new2_y < 0 || new2_y >= NUM_CELLS_VERTICAL
        || grid[new2_x][new2_y] !== CELL_EMPTY;

    // Collision tête-à-tête
    if (new1_x === new2_x && new1_y === new2_y) {
        crash1 = true;
        crash2 = true;
    }

    if (crash1 || crash2) {
        if (crash1) setAlive1(false);
        if (crash2) setAlive2(false);
        gameStopped = true;

        // Mettre à jour le score
        if (crash1 && crash2) {
            scoreNuls++;
        } else if (crash1) {
            scoreJ2++;  // J2 gagne ce round
        } else {
            scoreJ1++;  // J1 gagne ce round
        }
        updateScoreDisplay();
    } else {
        grid[new1_x][new1_y] = CELL_OCCUPIED_1;
        setPosition1(new1_x, new1_y);
        grid[new2_x][new2_y] = CELL_OCCUPIED_2;
        setPosition2(new2_x, new2_y);
    }

    redraw();
}

// Relance un nouveau round sans recharger la page
export function resetRound() {
    initGrid();
    resetMotos();
    gameStopped = false;
    gamePaused = false;
    redraw();
    updateScoreDisplay();
}

function updateScoreDisplay() {
    document.getElementById('scoreJ1').textContent = scoreJ1;
    document.getElementById('scoreJ2').textContent = scoreJ2;
    document.getElementById('scoreNuls').textContent = scoreNuls;
}
