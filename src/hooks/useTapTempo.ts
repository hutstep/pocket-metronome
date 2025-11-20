import { useState, useCallback } from 'react';

export function useTapTempo(onBpmChange: (bpm: number) => void) {
  const [, setTaps] = useState<number[]>([]);

  const tap = useCallback(() => {
    const now = Date.now();
    setTaps((prev) => {
      // Reset if last tap was too long ago (> 2s)
      const lastTap = prev[prev.length - 1];
      if (lastTap && now - lastTap > 2000) {
        return [now];
      }

      const newTaps = [...prev, now];
      if (newTaps.length > 4) {
        newTaps.shift(); // Keep last 4 taps
      }

      if (newTaps.length > 1) {
        const intervals = [];
        for (let i = 1; i < newTaps.length; i++) {
          intervals.push(newTaps[i] - newTaps[i - 1]);
        }
        const avgInterval =
          intervals.reduce((a, b) => a + b, 0) / intervals.length;
        const bpm = Math.round(60000 / avgInterval);
        if (bpm >= 30 && bpm <= 300) {
          onBpmChange(bpm);
        }
      }

      return newTaps;
    });
  }, [onBpmChange]);

  return tap;
}
