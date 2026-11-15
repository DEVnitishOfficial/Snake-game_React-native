import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';

import {
  createGame,
  type Direction,
  type GameState,
  getTickMs,
  pauseGame,
  queueTurn,
  resumeGame,
  startGame,
  tick,
} from './engine';

type Options = {
  /** Called every time the snake eats. */
  onEat?: () => void;
  /** Called once when the game ends, with the final score. */
  onGameOver?: (score: number) => void;
};

/**
 * The game's "brain and heartbeat": holds the state, runs the timer that
 * moves the snake, and reports events. It knows nothing about sound,
 * storage or drawing, so the screen decides what to do with events.
 */
export function useSnakeGame({ onEat, onGameOver }: Options = {}) {
  const [game, setGame] = useState(createGame);

  // A ref always holds the latest state, so the timer never reads a stale copy.
  const gameRef = useRef(game);
  const callbacksRef = useRef({ onEat, onGameOver });
  useEffect(() => {
    callbacksRef.current = { onEat, onGameOver };
  });

  const update = useCallback((change: (state: GameState) => GameState) => {
    const next = change(gameRef.current);
    if (next === gameRef.current) return;
    gameRef.current = next;
    setGame(next);
  }, []);

  // Heartbeat: restarts with a shorter interval whenever the score changes.
  const tickMs = getTickMs(game.score);
  useEffect(() => {
    if (game.status !== 'playing') return;

    const timer = setInterval(() => {
      const result = tick(gameRef.current);
      gameRef.current = result.state;
      setGame(result.state);

      if (result.event === 'ate') callbacksRef.current.onEat?.();
      if (result.state.status === 'over') callbacksRef.current.onGameOver?.(result.state.score);
    }, tickMs);

    // Cleanup: stop the timer when paused, over, or leaving the screen.
    return () => clearInterval(timer);
  }, [game.status, tickMs]);

  // Mobile-only care: pause if a call comes in or the user switches apps.
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (appState) => {
      if (appState !== 'active') update(pauseGame);
    });
    return () => subscription.remove();
  }, [update]);

  const turn = useCallback(
    (direction: Direction) => update((state) => startGame(queueTurn(state, direction))),
    [update],
  );
  const pause = useCallback(() => update(pauseGame), [update]);
  const resume = useCallback(() => update(resumeGame), [update]);
  const restart = useCallback(() => update(() => createGame()), [update]);

  return { game, turn, pause, resume, restart };
}
