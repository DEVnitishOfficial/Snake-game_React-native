import { useRef } from 'react';
import { usePanGesture } from 'react-native-gesture-handler';

import type { Direction } from './engine';

/** How far (in points) a finger must move to count as a swipe. */
const SWIPE_DISTANCE = 24;

/**
 * Turns finger movement into directions. Works without lifting the finger:
 * after each detected swipe, the next one is measured from that point.
 */
export function useSwipe(onSwipe: (direction: Direction) => void) {
  const anchor = useRef({ x: 0, y: 0 });

  return usePanGesture({
    minDistance: 10,
    // Run on the JS thread so we can call React state updates directly.
    runOnJS: true,
    onBegin: () => {
      anchor.current = { x: 0, y: 0 };
    },
    onUpdate: (event) => {
      const dx = event.translationX - anchor.current.x;
      const dy = event.translationY - anchor.current.y;
      if (Math.max(Math.abs(dx), Math.abs(dy)) < SWIPE_DISTANCE) return;

      if (Math.abs(dx) > Math.abs(dy)) onSwipe(dx > 0 ? 'right' : 'left');
      else onSwipe(dy > 0 ? 'down' : 'up');

      anchor.current = { x: event.translationX, y: event.translationY };
    },
  });
}
