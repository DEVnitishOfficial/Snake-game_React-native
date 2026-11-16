import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/primary-button';
import { colors, radius, spacing } from '@/constants/theme';
import { getBestScore } from '@/features/snake/storage';

// Route "/" (the first screen). Like Next.js app/page.tsx.
export default function HomeScreen() {
  const [best, setBest] = useState(getBestScore);

  // Re-read the best score every time this screen comes back into view
  // (e.g. after returning from a game).
  useFocusEffect(
    useCallback(() => {
      setBest(getBestScore());
    }, []),
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.hero}>
        <View style={styles.logo}>
          {[0, 1, 2, 3].map((i) => (
            <View key={i} style={[styles.segment, i === 3 && styles.head]} />
          ))}
          <View style={styles.gap} />
          <View style={[styles.segment, styles.food]} />
        </View>
        <Text style={styles.title}>SNAKE</Text>
        <Text style={styles.tagline}>Eat. Grow. Don&apos;t bite yourself.</Text>
      </View>

      <View style={styles.actions}>
        <PrimaryButton label="PLAY" onPress={() => router.push('/game')} />
        {best > 0 && <Text style={styles.best}>Best score: {best}</Text>}
      </View>
    </SafeAreaView>
  );
}

const SEGMENT = 22;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    padding: spacing.lg,
  },
  hero: {
    alignItems: 'center',
    gap: spacing.md,
  },
  logo: {
    flexDirection: 'row',
    gap: 3,
    marginBottom: spacing.sm,
  },
  segment: {
    width: SEGMENT,
    height: SEGMENT,
    borderRadius: radius.sm,
    backgroundColor: colors.snake,
  },
  head: {
    backgroundColor: colors.snakeHead,
  },
  gap: {
    width: SEGMENT,
  },
  food: {
    backgroundColor: colors.food,
    borderRadius: SEGMENT / 2,
  },
  title: {
    color: colors.text,
    fontSize: 56,
    fontWeight: '900',
    letterSpacing: 8,
  },
  tagline: {
    color: colors.textMuted,
    fontSize: 16,
  },
  actions: {
    alignItems: 'center',
    gap: spacing.md,
  },
  best: {
    color: colors.textMuted,
    fontSize: 16,
    fontWeight: '600',
  },
});
