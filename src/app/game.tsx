import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, spacing } from '@/constants/theme';
import { getBestScore, saveBestScore } from '@/features/snake/best-score';
import { Board } from '@/features/snake/components/board';
import { GameOverlay } from '@/features/snake/components/game-overlay';
import { useGameSounds } from '@/features/snake/use-game-sounds';
import { useSnakeGame } from '@/features/snake/use-snake-game';
import { useSwipe } from '@/features/snake/use-swipe';

// Route "/game". The screen wires the pieces together:
// game events -> sounds + best score, swipes -> game.
export default function GameScreen() {
  const sounds = useGameSounds();
  const [best, setBest] = useState(getBestScore);
  const [isNewBest, setIsNewBest] = useState(false);

  const { game, turn, pause, resume, restart } = useSnakeGame({
    onEat: sounds.playEat,
    onGameOver: (score) => {
      sounds.playCrash();
      if (score > best) {
        saveBestScore(score);
        setBest(score);
        setIsNewBest(true);
      }
    },
  });

  const swipe = useSwipe(turn);

  const playAgain = () => {
    setIsNewBest(false);
    restart();
  };
  const goToMenu = () => (router.canGoBack() ? router.back() : router.replace('/'));
  const canPause = game.status === 'playing';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable accessibilityRole="button" hitSlop={12} onPress={goToMenu}>
          <Text style={styles.headerButton}>‹ Menu</Text>
        </Pressable>

        <View style={styles.scoreBox}>
          <Text style={styles.score}>{game.score}</Text>
          <Text style={styles.scoreLabel}>SCORE</Text>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled: !canPause }}
          disabled={!canPause}
          hitSlop={12}
          onPress={pause}
          style={!canPause && styles.hidden}
        >
          <Text style={styles.headerButton}>Pause</Text>
        </Pressable>
      </View>

      {/* Swipe anywhere in this area to steer. */}
      <GestureDetector gesture={swipe}>
        <View style={styles.playArea}>
          <Board snake={game.snake} food={game.food}>
            <GameOverlay
              status={game.status}
              score={game.score}
              best={best}
              isNewBest={isNewBest}
              onResume={resume}
              onPlayAgain={playAgain}
              onMenu={goToMenu}
            />
          </Board>
        </View>
      </GestureDetector>

      <Text style={styles.footer}>Best {best}</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  headerButton: {
    color: colors.textMuted,
    fontSize: 18,
    fontWeight: '600',
    minWidth: 64,
  },
  hidden: {
    opacity: 0,
  },
  scoreBox: {
    alignItems: 'center',
  },
  score: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '900',
  },
  scoreLabel: {
    color: colors.textMuted,
    fontSize: 12,
    letterSpacing: 2,
  },
  playArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    color: colors.textMuted,
    textAlign: 'center',
    fontSize: 16,
    paddingBottom: spacing.lg,
  },
});
