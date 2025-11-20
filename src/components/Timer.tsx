import { useState, useEffect, useRef } from 'react';
import { metronomeEngine } from '../lib/audio/MetronomeEngine';
import { Timer as TimerIcon, Play, Pause, RotateCcw } from 'lucide-react';

export function Timer() {
  const [duration, setDuration] = useState(300); // 5 minutes default
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            metronomeEngine.stop();
            // Force update UI state if needed, but metronomeEngine.stop() updates internal state.
            // We might need to sync UI state via callback if we had a global isPlaying state listener.
            // But useMetronome handles that via setStateChangeCallback? No, useMetronome handles local state.
            // Actually, metronomeEngine.stop() sets isPlaying=false internally.
            // We should trigger a state change callback so useMetronome updates.
            metronomeEngine.setState({ isPlaying: false });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const reset = () => {
    setIsRunning(false);
    setTimeLeft(duration);
  };

  return (
    <div className="mt-4 w-full bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200 font-semibold">
          <TimerIcon size={20} />
          <span>Practice Timer</span>
        </div>
        <div className="text-2xl font-mono font-bold tabular-nums">
          {formatTime(timeLeft)}
        </div>
      </div>

      <div className="flex gap-2">
        <select
          value={duration}
          onChange={(e) => {
            const val = Number(e.target.value);
            setDuration(val);
            setTimeLeft(val);
            setIsRunning(false);
          }}
          className="flex-1 p-2 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 cursor-pointer"
        >
          <option value={60}>1 min</option>
          <option value={300}>5 min</option>
          <option value={600}>10 min</option>
          <option value={900}>15 min</option>
          <option value={1200}>20 min</option>
          <option value={1800}>30 min</option>
          <option value={3600}>60 min</option>
        </select>

        <button
          onClick={() => setIsRunning(!isRunning)}
          className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer"
        >
          {isRunning ? <Pause size={20} /> : <Play size={20} />}
        </button>

        <button
          onClick={reset}
          className="p-2 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors cursor-pointer"
        >
          <RotateCcw size={20} />
        </button>
      </div>
    </div>
  );
}
