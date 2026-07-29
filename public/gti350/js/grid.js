// ============================================================
// GRID — Grille 2D identique à McGuffin : grid[x][y]
// (colonne d'abord, rangée ensuite)
// ============================================================

import { NUM_CELLS_HORIZONTAL, NUM_CELLS_VERTICAL, CELL_EMPTY } from './constants.js';

export var grid = [];

export function initGrid() {
    grid = [];
    for (var c = 0; c < NUM_CELLS_HORIZONTAL; c++) {
        grid.push([]);
        for (var r = 0; r < NUM_CELLS_VERTICAL; r++) {
            grid[c].push(0);
        }
    }
}
