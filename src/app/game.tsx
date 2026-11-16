import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

import { IconButton } from '@/components/icon-button';
import { colors, spacing } from '@/constants/theme';
import { Board } from '@/features/snake/components/board';
import { GameOverlay } from '@/features/snake/components/game-overlay';
import { getSpeedProgress } from '@/features/snake/engine';
import { getBestScore, getMuted, saveBestScore, saveMuted } from '@/features/snake/storage';
import { useGameMusic } from '@/features/snake/use-game-music';
import { useGameSounds } from '@/features/snake/use-game-sounds';
import { useSnakeGame } from '@/features/snake/use-snake-game';
import { useSwipe } from '@/features/snake/use-swipe';

const ICONS = {
  soundOn: { ios: 'speaker.wave.2.fill', android: 'volume_up', web: 'volume_up' },
  soundOff: { ios: 'speaker.slash.fill', android: 'volume_off', web: 'volume_off' },
  pause: { ios: 'pause.fill', android: 'pause', web: 'pause' },
} as const;

// Route "/game". The screen wires the pieces together:
// swipes -> game, game events -> sound effects + best score,
// game state -> music.
export default function GameScreen() {
  const [muted, setMuted] = useState(getMuted);
  const [best, setBest] = useState(getBestScore);
  const [isNewBest, setIsNewBest] = useState(false);

  const sounds = useGameSounds({ muted });

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

  useGameMusic({ status: game.status, speedProgress: getSpeedProgress(game.score), muted });

  const swipe = useSwipe(turn);

  const toggleMute = () => {
    setMuted(!muted);
    saveMuted(!muted);
  };
  const playAgain = () => {
    setIsNewBest(false);
    restart();
  };
  const goToMenu = () => (router.canGoBack() ? router.back() : router.replace('/'));

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.side}>
          <Pressable accessibilityRole="button" hitSlop={12} onPress={goToMenu}>
            <Text style={styles.menu}>‹ Menu</Text>
          </Pressable>
        </View>

        <View style={styles.scoreBox}>
          <Text style={styles.score}>{game.score}</Text>
          <Text style={styles.scoreLabel}>SCORE</Text>
        </View>

        <View style={[styles.side, styles.sideRight]}>
          <IconButton
            icon={muted ? ICONS.soundOff : ICONS.soundOn}
            label={muted ? 'Turn sound on' : 'Mute sound'}
            onPress={toggleMute}
          />
          <IconButton
            icon={ICONS.pause}
            label="Pause"
            onPress={pause}
            hidden={game.status !== 'playing'}
          />
        </View>
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
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  // Equal-width sides keep the score perfectly centered.
  side: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sideRight: {
    justifyContent: 'flex-end',
    gap: spacing.lg,
  },
  menu: {
    color: colors.textMuted,
    fontSize: 18,
    fontWeight: '600',
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
