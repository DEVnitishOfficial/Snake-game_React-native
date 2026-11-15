// Rules of the game live here, separate from how it looks.
// Tweak these numbers to change how the game feels.

/** The board is GRID_SIZE x GRID_SIZE cells. */
export const GRID_SIZE = 20;

/** How many cells long the snake is at the start. */
export const INITIAL_SNAKE_LENGTH = 3;

/** Milliseconds between moves at the start. Lower = faster. */
export const START_TICK_MS = 170;

/** The fastest the snake can ever go. */
export const MIN_TICK_MS = 70;

/** How much faster (in ms) each food makes the snake. */
export const SPEEDUP_PER_FOOD_MS = 4;
