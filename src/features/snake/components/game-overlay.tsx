import { Pressable, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/components/primary-button';
import { colors, radius, spacing } from '@/constants/theme';

import type { GameStatus } from '../engine';

type Props = {
  status: GameStatus;
  score: number;
  best: number;
  isNewBest: boolean;
  onResume: () => void;
  onPlayAgain: () => void;
  onMenu: () => void;
};

/** The message shown over the board for each game state. */
export function GameOverlay({ status, score, best, isNewBest, onResume, onPlayAgain, onMenu }: Props) {
  if (status === 'playing') return null;

  if (status === 'ready') {
    return (
      <View style={[styles.overlay, styles.light]} pointerEvents="none">
        <Text style={styles.title}>Swipe to start</Text>
        <Text style={styles.muted}>Eat the red dots. Avoid walls and yourself.</Text>
      </View>
    );
  }

  if (status === 'paused') {
    return (
      <View style={styles.overlay}>
        <Text style={styles.title}>Paused</Text>
        <PrimaryButton label="RESUME" onPress={onResume} />
      </View>
    );
  }

  return (
    <View style={styles.overlay}>
      <Text style={styles.title}>Game over</Text>
      {isNewBest && <Text style={styles.badge}>NEW BEST!</Text>}

      <View style={styles.stats}>
        <Stat label="SCORE" value={score} />
        <Stat label="BEST" value={best} />
      </View>

      <PrimaryButton label="PLAY AGAIN" onPress={onPlayAgain} />
      <Pressable accessibilityRole="button" hitSlop={12} onPress={onMenu}>
        <Text style={styles.link}>Menu</Text>
      </Pressable>
    </View>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.muted}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    padding: spacing.md,
    backgroundColor: 'rgba(11, 18, 32, 0.82)',
  },
  light: {
    backgroundColor: 'rgba(11, 18, 32, 0.45)',
  },
  title: {
    color: colors.text,
    fontSize: 32,
    fontWeight: '900',
  },
  badge: {
    color: colors.background,
    backgroundColor: colors.snakeHead,
    fontWeight: '900',
    letterSpacing: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  stats: {
    flexDirection: 'row',
    gap: spacing.xl,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    color: colors.text,
    fontSize: 36,
    fontWeight: '800',
  },
  muted: {
    color: colors.textMuted,
    textAlign: 'center',
  },
  link: {
    color: colors.textMuted,
    fontSize: 16,
    fontWeight: '600',
  },
});
