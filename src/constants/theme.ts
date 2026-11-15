// Single source of truth for the look of the app.
// Change a color here and every screen updates.

export const colors = {
  background: '#0B1220',
  surface: '#141E33',
  border: '#24304A',
  snake: '#22C55E',
  snakeHead: '#4ADE80',
  food: '#F43F5E',
  text: '#F8FAFC',
  textMuted: '#94A3B8',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 40,
} as const;

export const radius = {
  sm: 6,
  md: 14,
  lg: 24,
} as const;
