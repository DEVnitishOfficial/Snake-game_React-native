import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { colors } from '@/constants/theme';

// Root layout: wraps every screen. Like Next.js app/layout.tsx.
// A Stack works like a pile of cards: opening a screen puts it on top,
// going back takes it off.
export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'fade',
          contentStyle: { backgroundColor: colors.background },
        }}
      />
    </>
  );
}
