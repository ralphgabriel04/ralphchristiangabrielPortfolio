// ============================================================
// MAIN — Point d'entrée
// ============================================================

import { initGrid } from './grid.js';
import { initMotos } from './motorcycle.js';
import './input-keyboard.js';
import { initMouse } from './input-mouse.js';
import { initRenderer } from './renderer.js';
import { advance, pauseGame, goGame, resetRound } from './game.js';

var canvas = document.getElementById('gameCanvas');

initGrid();
initMotos();
initRenderer(canvas);
initMouse(canvas);

setInterval(function () { advance(); }, 100);

// Exposer les handlers des boutons au HTML (onclick)
window.pauseButtonHandler = function () { pauseGame(); };
window.goButtonHandler = function () { goGame(); };
window.restartButtonHandler = function () { resetRound(); };
