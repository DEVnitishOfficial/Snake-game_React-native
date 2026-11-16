import Storage from 'expo-sqlite/kv-store';

// Everything the game saves on the phone lives here, so it survives
// closing the app. Like localStorage on the web, or a tiny database layer:
// screens ask this file for data and never talk to storage directly.

const KEYS = {
  bestScore: 'snake.bestScore',
  muted: 'snake.muted',
} as const;

export function getBestScore(): number {
  const saved = Number(Storage.getItemSync(KEYS.bestScore));
  return Number.isFinite(saved) && saved > 0 ? saved : 0;
}

export function saveBestScore(score: number): void {
  save(KEYS.bestScore, String(score));
}

export function getMuted(): boolean {
  return Storage.getItemSync(KEYS.muted) === 'true';
}

export function saveMuted(muted: boolean): void {
  save(KEYS.muted, String(muted));
}

function save(key: string, value: string): void {
  Storage.setItem(key, value).catch((error) => {
    console.warn(`Could not save ${key}`, error);
  });
}
