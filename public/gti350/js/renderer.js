// ============================================================
// RENDERER — Dessine les deux motos et leurs traces
// ============================================================

import { cellSize, NUM_CELLS_HORIZONTAL, NUM_CELLS_VERTICAL, x0, y0, CELL_OCCUPIED_1, CELL_OCCUPIED_2 } from './constants.js';
import { grid } from './grid.js';
import {
    lightCycle1_x, lightCycle1_y, lightCycle1_alive,
    lightCycle2_x, lightCycle2_y, lightCycle2_alive
} from './motorcycle.js';

var ctx = null;
var canvasWidth = 0;
var canvasHeight = 0;

export function initRenderer(canvas) {
    ctx = canvas.getContext('2d');
    canvasWidth = canvas.width;
    canvasHeight = canvas.height;
}

export function redraw() {
    // Fond noir
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Traces
    for (var i = 0; i < NUM_CELLS_HORIZONTAL; ++i) {
        for (var j = 0; j < NUM_CELLS_VERTICAL; ++j) {
            if (grid[i][j] === CELL_OCCUPIED_1) {
                ctx.fillStyle = "#00ffff";  // cyan — joueur 1
                ctx.fillRect(x0 + i * cellSize + 1, y0 + j * cellSize + 1, cellSize - 2, cellSize - 2);
            } else if (grid[i][j] === CELL_OCCUPIED_2) {
                ctx.fillStyle = "#ffa500";  // orange — joueur 2
                ctx.fillRect(x0 + i * cellSize + 1, y0 + j * cellSize + 1, cellSize - 2, cellSize - 2);
            }
        }
    }

    // Tête joueur 1
    ctx.fillStyle = lightCycle1_alive ? "#ff0000" : "#ffffff";
    ctx.fillRect(x0 + lightCycle1_x * cellSize, y0 + lightCycle1_y * cellSize, cellSize, cellSize);

    // Tête joueur 2
    ctx.fillStyle = lightCycle2_alive ? "#ff0000" : "#ffffff";
    ctx.fillRect(x0 + lightCycle2_x * cellSize, y0 + lightCycle2_y * cellSize, cellSize, cellSize);
}
