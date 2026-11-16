import { type AudioPlayer, setAudioModeAsync, useAudioPlayer } from 'expo-audio';
import { useCallback, useEffect } from 'react';

const EAT_SOUND = require('../../../assets/sounds/eat.wav');
const CRASH_SOUND = require('../../../assets/sounds/crash.wav');

/**
 * Short sound effects, triggered by game EVENTS (ate, crashed).
 * Background music lives in use-game-music.ts because it follows game STATE.
 */
export function useGameSounds({ muted }: { muted: boolean }) {
  // Players are released automatically when the screen closes.
  const eatPlayer = useAudioPlayer(EAT_SOUND);
  const crashPlayer = useAudioPlayer(CRASH_SOUND);

  useEffect(() => {
    // App-wide audio rules: only make sound when the phone is not on
    // silent/vibrate, and never stop the user's own music app.
    setAudioModeAsync({ playsInSilentMode: false, interruptionMode: 'mixWithOthers' }).catch(
      () => {},
    );
  }, []);

  const playEat = useCallback(() => {
    if (!muted) playFromStart(eatPlayer);
  }, [eatPlayer, muted]);

  const playCrash = useCallback(() => {
    if (!muted) playFromStart(crashPlayer);
  }, [crashPlayer, muted]);

  return { playEat, playCrash };
}

/** Rewind and play, so rapid repeats always sound from the beginning. */
export function playFromStart(player: AudioPlayer) {
  rewind(player);
  player.play();
}

export function rewind(player: AudioPlayer) {
  player.seekTo(0).catch(() => {});
}
