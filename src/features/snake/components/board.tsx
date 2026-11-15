import { StyleSheet, useWindowDimensions, View } from 'react-native';

import { colors, radius, spacing } from '@/constants/theme';

import { GRID_SIZE } from '../constants';

/** The square play area. Sizes itself to fit any phone screen. */
export function Board() {
  const { width, height } = useWindowDimensions();

  // Whole-pixel cells keep the snake crisp on every screen density.
  const maxSize = Math.min(width - spacing.md * 2, height * 0.6);
  const cellSize = Math.floor(maxSize / GRID_SIZE);
  const boardSize = cellSize * GRID_SIZE;

  // Snake and food are drawn inside this View in Step 2.
  return <View style={[styles.board, { width: boardSize, height: boardSize }]} />;
}

const styles = StyleSheet.create({
  board: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.sm,
  },
});
