import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, spacing } from '@/constants/theme';
import { Board } from '@/features/snake/components/board';

// Route "/game". The screen only arranges pieces; the game itself
// lives in src/features/snake.
export default function GameScreen() {
  const goToMenu = () => (router.canGoBack() ? router.back() : router.replace('/'));

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable accessibilityRole="button" hitSlop={12} onPress={goToMenu}>
          <Text style={styles.menu}>‹ Menu</Text>
        </Pressable>
        <Text style={styles.score}>Score 0</Text>
      </View>

      <View style={styles.boardArea}>
        <Board />
      </View>

      <Text style={styles.hint}>Swipe to steer the snake</Text>
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
  menu: {
    color: colors.textMuted,
    fontSize: 18,
    fontWeight: '600',
  },
  score: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '800',
  },
  boardArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hint: {
    color: colors.textMuted,
    textAlign: 'center',
    paddingBottom: spacing.lg,
  },
});
