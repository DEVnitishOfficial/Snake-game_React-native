import { setAudioModeAsync, useAudioPlayer } from 'expo-audio';
import { useCallback, useEffect } from 'react';

const EAT_SOUND = require('../../../assets/sounds/eat.wav');
const CRASH_SOUND = require('../../../assets/sounds/crash.wav');

/** Loads the sound effects once and gives back simple play functions. */
export function useGameSounds() {
  // Players are released automatically when the screen closes.
  const eatPlayer = useAudioPlayer(EAT_SOUND);
  const crashPlayer = useAudioPlayer(CRASH_SOUND);

  useEffect(() => {
    // Game sounds should stay quiet when an iPhone is on silent,
    // and should never stop the user's music.
    setAudioModeAsync({ playsInSilentMode: false, interruptionMode: 'mixWithOthers' }).catch(
      () => {},
    );
  }, []);

  const playEat = useCallback(() => {
    eatPlayer.seekTo(0);
    eatPlayer.play();
  }, [eatPlayer]);

  const playCrash = useCallback(() => {
    crashPlayer.seekTo(0);
    crashPlayer.play();
  }, [crashPlayer]);

  return { playEat, playCrash };
}
