// ============================================================
// INPUT KEYBOARD — Flèches (J1) + ZQSD/WASD (J2) + Espace (nouveau round)
// ============================================================

import { setDirection1, setDirection2 } from './motorcycle.js';
import { gameStopped, resetRound } from './game.js';

function keyDownHandler(e) {
    // Espace : relancer un nouveau round après une collision
    if (e.keyCode === 32 && gameStopped) {
        resetRound();
        return;
    }

    // --- Joueur 1 : flèches ---
    if (e.keyCode === 38) {        // up arrow
        setDirection1(0, -1);
    }
    else if (e.keyCode === 40) {   // down arrow
        setDirection1(0, 1);
    }
    else if (e.keyCode === 37) {   // left arrow
        setDirection1(-1, 0);
    }
    else if (e.keyCode === 39) {   // right arrow
        setDirection1(1, 0);
    }
    // --- Joueur 2 : ZQSD / WASD ---
    else if (e.key === "w" || e.key === "z") {
        setDirection2(0, -1);
    }
    else if (e.key === "s") {
        setDirection2(0, 1);
    }
    else if (e.key === "q" || e.key === "a") {
        setDirection2(-1, 0);
    }
    else if (e.key === "d") {
        setDirection2(1, 0);
    }
}

document.onkeydown = keyDownHandler;
