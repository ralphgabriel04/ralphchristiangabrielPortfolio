// ============================================================
// CONSTANTES
// ============================================================

export var cellSize = 5;

export var CANVAS_WIDTH = 700;
export var CANVAS_HEIGHT = 700;

export var NUM_CELLS_HORIZONTAL = CANVAS_WIDTH / cellSize;   // 140
export var NUM_CELLS_VERTICAL   = CANVAS_HEIGHT / cellSize;  // 140

export var x0 = (CANVAS_WIDTH - NUM_CELLS_HORIZONTAL * cellSize) / 2;
export var y0 = (CANVAS_HEIGHT - NUM_CELLS_VERTICAL * cellSize) / 2;

export var CELL_EMPTY = 0;
export var CELL_OCCUPIED_1 = 1;  // trace du joueur 1
export var CELL_OCCUPIED_2 = 2;  // trace du joueur 2
