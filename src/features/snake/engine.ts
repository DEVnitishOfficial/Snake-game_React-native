// The game engine: pure rules, no React, no UI, no sound.
// Every function takes a state and returns a NEW state, which makes the
// rules easy to test and reuse.

import {
  GRID_SIZE,
  INITIAL_SNAKE_LENGTH,
  MIN_TICK_MS,
  SPEEDUP_PER_FOOD_MS,
  START_TICK_MS,
} from './constants';

export type Point = { x: number; y: number };
export type Direction = 'up' | 'down' | 'left' | 'right';
export type GameStatus = 'ready' | 'playing' | 'paused' | 'over';

export type GameState = {
  /** Cells the snake occupies, head first. */
  snake: Point[];
  /** Direction of the last move. */
  direction: Direction;
  /** Turns the player swiped, applied one per tick. */
  queuedTurns: Direction[];
  food: Point;
  score: number;
  status: GameStatus;
};

/** What happened on a tick, so the app can react (sounds, saving scores). */
export type TickEvent = 'moved' | 'ate' | 'crashed';

type Random = () => number;

const STEP: Record<Direction, Point> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

const OPPOSITE: Record<Direction, Direction> = {
  up: 'down',
  down: 'up',
  left: 'right',
  right: 'left',
};

/** Two queued turns lets quick "up then left" swipes both register. */
const MAX_QUEUED_TURNS = 2;

const samePoint = (a: Point, b: Point) => a.x === b.x && a.y === b.y;

const isOutside = (p: Point) => p.x < 0 || p.y < 0 || p.x >= GRID_SIZE || p.y >= GRID_SIZE;

/** A fresh game: short snake in the middle-left, facing right. */
export function createGame(random: Random = Math.random): GameState {
  const y = Math.floor(GRID_SIZE / 2);
  const headX = Math.floor(GRID_SIZE / 4) + INITIAL_SNAKE_LENGTH - 1;
  const snake = Array.from({ length: INITIAL_SNAKE_LENGTH }, (_, i) => ({ x: headX - i, y }));

  const food = placeFood(snake, random);
  if (!food) throw new Error('Board is too small for the snake');

  return { snake, direction: 'right', queuedTurns: [], food, score: 0, status: 'ready' };
}

/** Food goes on a random EMPTY cell. Returns null if the board is full. */
export function placeFood(snake: Point[], random: Random = Math.random): Point | null {
  const taken = new Set(snake.map((p) => p.y * GRID_SIZE + p.x));
  const free: Point[] = [];
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      if (!taken.has(y * GRID_SIZE + x)) free.push({ x, y });
    }
  }
  if (free.length === 0) return null;
  return free[Math.floor(random() * free.length)];
}

/**
 * Remember a swipe. U-turns are ignored (the snake would bite its own neck),
 * and each turn is checked against the one queued before it, so fast
 * double-swipes can't sneak a U-turn in between two moves.
 */
export function queueTurn(state: GameState, turn: Direction): GameState {
  if (state.status !== 'ready' && state.status !== 'playing') return state;

  const { queuedTurns } = state;
  const previous = queuedTurns[queuedTurns.length - 1] ?? state.direction;
  if (turn === previous || turn === OPPOSITE[previous]) return state;
  if (queuedTurns.length >= MAX_QUEUED_TURNS) return state;

  return { ...state, queuedTurns: [...queuedTurns, turn] };
}

/**
 * One heartbeat of the game. Like a train: add a car at the front, drop one
 * at the back. Eating skips dropping the back car, so the snake grows.
 */
export function tick(
  state: GameState,
  random: Random = Math.random,
): { state: GameState; event: TickEvent | null } {
  if (state.status !== 'playing') return { state, event: null };

  const [direction = state.direction, ...queuedTurns] = state.queuedTurns;
  const head = state.snake[0];
  const newHead = { x: head.x + STEP[direction].x, y: head.y + STEP[direction].y };

  const willEat = samePoint(newHead, state.food);
  // The tail moves out of the way this tick, unless the snake is growing.
  const body = willEat ? state.snake : state.snake.slice(0, -1);

  if (isOutside(newHead) || body.some((p) => samePoint(p, newHead))) {
    return {
      state: { ...state, direction, queuedTurns: [], status: 'over' },
      event: 'crashed',
    };
  }

  const snake = [newHead, ...body];

  if (!willEat) {
    return { state: { ...state, snake, direction, queuedTurns }, event: 'moved' };
  }

  // No room left for food means the snake filled the board: game won.
  const food = placeFood(snake, random);
  return {
    state: {
      ...state,
      snake,
      direction,
      queuedTurns,
      score: state.score + 1,
      food: food ?? state.food,
      status: food ? 'playing' : 'over',
    },
    event: 'ate',
  };
}

/** Speed rises with the score: each food shaves a few ms off each move. */
export function getTickMs(score: number): number {
  return Math.max(MIN_TICK_MS, START_TICK_MS - score * SPEEDUP_PER_FOOD_MS);
}

export function startGame(state: GameState): GameState {
  return state.status === 'ready' ? { ...state, status: 'playing' } : state;
}

export function pauseGame(state: GameState): GameState {
  return state.status === 'playing' ? { ...state, status: 'paused' } : state;
}

export function resumeGame(state: GameState): GameState {
  return state.status === 'paused' ? { ...state, status: 'playing', queuedTurns: [] } : state;
}
