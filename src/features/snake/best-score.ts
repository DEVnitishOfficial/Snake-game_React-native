import Storage from 'expo-sqlite/kv-store';

// Saved on the phone, so it survives closing the app.
// Like localStorage on the web.
const BEST_SCORE_KEY = 'snake.bestScore';

export function getBestScore(): number {
  const saved = Number(Storage.getItemSync(BEST_SCORE_KEY));
  return Number.isFinite(saved) && saved > 0 ? saved : 0;
}

export function saveBestScore(score: number): void {
  Storage.setItem(BEST_SCORE_KEY, String(score)).catch((error) => {
    console.warn('Could not save best score', error);
  });
}
