// ============================================================
// INPUT MOUSE — Gestes de glissement (F2)
// Owner : Ralph
// Affecte le Joueur 1 uniquement (énoncé : "un des joueurs").
//
// IMPORTANT : attacher les listeners au CANVAS uniquement, pas à
// document, pour ne pas interférer avec les boutons HTML (F5).
// ============================================================
 
import { getState, STATE_RUNNING } from './game.js';
import { setDirection1} from './motorcycle.js';

let x0 = 0;
let y0 = 0;
let isMouseDown = false;

export function initMouse(canvas) {
    canvas.addEventListener('mousedown', handleMouseDown);
    // mouseup sur document pour capter le relâchement même hors du canvas
    document.addEventListener('mouseup', handleMouseUp);
}

function handleMouseDown(event) {
    x0 = event.offsetX;
    y0 = event.offsetY;
    isMouseDown = true;
}

function handleMouseUp(event) {
    if (!isMouseDown) return;
    isMouseDown = false;
    if (getState() !== STATE_RUNNING) return;

    const x1 = event.offsetX;
    const y1 = event.offsetY;
    const deltaX = x1 - x0;
    const deltaY = y1 - y0;



    // Pseudocode EXACT de l'énoncé GTI350 Lab1
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0) setDirection1(1,0);
        else            setDirection1(-1,0);
    } else if (deltaY > 0) {
        setDirection1(0,1);
    } else {
        setDirection1(0,-1);
    }
}
