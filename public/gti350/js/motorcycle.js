// ============================================================
// MOTORCYCLE — État des deux motos
// ============================================================

import { NUM_CELLS_HORIZONTAL, NUM_CELLS_VERTICAL, CELL_OCCUPIED_1, CELL_OCCUPIED_2 } from './constants.js';
import { grid } from './grid.js';

// Positions initiales (constantes)
var START1_X = NUM_CELLS_HORIZONTAL / 2;
var START1_Y = NUM_CELLS_VERTICAL - 2;
var START2_X = NUM_CELLS_HORIZONTAL / 2;
var START2_Y = 1;

// --- Joueur 1 (en bas, va vers le haut) ---
export var lightCycle1_x = START1_X;
export var lightCycle1_y = START1_Y;
export var lightCycle1_vx = 0;
export var lightCycle1_vy = -1;
export var lightCycle1_alive = true;

// --- Joueur 2 (en haut, va vers le bas) ---
export var lightCycle2_x = START2_X;
export var lightCycle2_y = START2_Y;
export var lightCycle2_vx = 0;
export var lightCycle2_vy = 1;
export var lightCycle2_alive = true;

// Marquer les cellules initiales comme occupées
export function initMotos() {
    grid[lightCycle1_x][lightCycle1_y] = CELL_OCCUPIED_1;
    grid[lightCycle2_x][lightCycle2_y] = CELL_OCCUPIED_2;
}

// Reset les motos aux positions de départ (nouveau round)
export function resetMotos() {
    lightCycle1_x = START1_X;
    lightCycle1_y = START1_Y;
    lightCycle1_vx = 0;
    lightCycle1_vy = -1;
    lightCycle1_alive = true;

    lightCycle2_x = START2_X;
    lightCycle2_y = START2_Y;
    lightCycle2_vx = 0;
    lightCycle2_vy = 1;
    lightCycle2_alive = true;

    grid[lightCycle1_x][lightCycle1_y] = CELL_OCCUPIED_1;
    grid[lightCycle2_x][lightCycle2_y] = CELL_OCCUPIED_2;
}

// --- Setters joueur 1 ---
export function setDirection1(vx, vy) {
    lightCycle1_vx = vx;
    lightCycle1_vy = vy;
}
export function setPosition1(x, y) {
    lightCycle1_x = x;
    lightCycle1_y = y;
}
export function setAlive1(alive) {
    lightCycle1_alive = alive;
}

// --- Setters joueur 2 ---
export function setDirection2(vx, vy) {
    lightCycle2_vx = vx;
    lightCycle2_vy = vy;
}
export function setPosition2(x, y) {
    lightCycle2_x = x;
    lightCycle2_y = y;
}
export function setAlive2(alive) {
    lightCycle2_alive = alive;
}
