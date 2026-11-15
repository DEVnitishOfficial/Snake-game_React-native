import type { ReactNode } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';

import { colors, radius, spacing } from '@/constants/theme';

import { GRID_SIZE } from '../constants';
import type { Point } from '../engine';

type Props = {
  snake: Point[];
  food: Point;
  /** Drawn on top of the board (e.g. the game-over card). */
  children?: ReactNode;
};

const BORDER = 1;

/** Draws the game. It only displays the state; it makes no decisions. */
export function Board({ snake, food, children }: Props) {
  const { width, height } = useWindowDimensions();

  // Whole-pixel cells keep the snake crisp on every screen density.
  const maxSize = Math.min(width - spacing.md * 2, height * 0.6);
  const cellSize = Math.floor(maxSize / GRID_SIZE);
  const boardSize = cellSize * GRID_SIZE + BORDER * 2;

  return (
    <View style={[styles.board, { width: boardSize, height: boardSize }]}>
      <Cell point={food} size={cellSize} color={colors.food} round />
      {snake.map((point, index) => (
        <Cell
          key={index}
          point={point}
          size={cellSize}
          color={index === 0 ? colors.snakeHead : colors.snake}
        />
      ))}
      {children}
    </View>
  );
}

type CellProps = { point: Point; size: number; color: string; round?: boolean };

function Cell({ point, size, color, round }: CellProps) {
  const gap = 1;
  return (
    <View
      style={{
        position: 'absolute',
        left: point.x * size + gap,
        top: point.y * size + gap,
        width: size - gap * 2,
        height: size - gap * 2,
        borderRadius: round ? size / 2 : radius.sm / 2,
        backgroundColor: color,
      }}
    />
  );
}

const styles = StyleSheet.create({
  board: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: BORDER,
    borderRadius: radius.sm,
    overflow: 'hidden',
  },
});
