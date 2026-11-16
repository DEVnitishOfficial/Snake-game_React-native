import { type AudioPlayer, useAudioPlayer } from 'expo-audio';
import { useEffect } from 'react';

import type { GameStatus } from './engine';
import { rewind } from './use-game-sounds';

const MUSIC = require('../../../assets/sounds/music.wav');

/** Music sits quietly under the effects, like a movie soundtrack. */
const MUSIC_VOLUME = 0.35;

/** Music tempo at the snake's top speed (1 = normal, 1.5 = 50% faster). */
const MAX_MUSIC_RATE = 1.5;

type Options = {
  status: GameStatus;
  /** 0 at the start, 1 at top speed (from the engine). */
  speedProgress: number;
  muted: boolean;
};

/**
 * Background music that FOLLOWS the game state:
 * ready = silent, playing = music, paused/over = music stops,
 * new game = starts again from the top. Speeds up with the snake.
 */
export function useGameMusic({ status, speedProgress, muted }: Options) {
  const music = useAudioPlayer(MUSIC);

  useEffect(() => configureMusic(music), [music]);

  useEffect(() => {
    if (status === 'playing' && !muted) {
      music.play();
      return;
    }
    music.pause();
    if (status === 'ready') rewind(music);
  }, [status, muted, music]);

  useEffect(() => {
    music.setPlaybackRate(1 + speedProgress * (MAX_MUSIC_RATE - 1));
  }, [speedProgress, music]);
}

/**
 * One-time setup. The player is a native object that expo-audio configures
 * through properties. React's lint rule forbids setting properties on a
 * hook's result (it protects React state), so this lives in a plain function.
 */
function configureMusic(player: AudioPlayer) {
  player.loop = true;
  player.volume = MUSIC_VOLUME;
  // Keep the notes at the same pitch when the tempo speeds up.
  // Must be set before the first speed change.
  player.shouldCorrectPitch = true;
}
