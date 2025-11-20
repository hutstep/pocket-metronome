import { useEffect, useRef, useState } from 'react';
import { metronomeEngine } from '../lib/audio/MetronomeEngine';
import { audioContextManager } from '../lib/audio/AudioContextManager';

interface VisualizerProps {
  beatsPerBar: number;
  subdivision: number;
  mutedBeats: boolean[];
  onToggleMute: (index: number) => void;
}

export function Visualizer({
  beatsPerBar,
  subdivision,
  mutedBeats,
  onToggleMute,
}: VisualizerProps) {
  const [currentBeat, setCurrentBeat] = useState<number>(-1);
  const requestRef = useRef<number | null>(null);

  useEffect(() => {
    const animate = () => {
      const context = audioContextManager.getContext();
      const notes = metronomeEngine.pollNotes(context.currentTime);

      if (notes.length > 0) {
        const lastNote = notes[notes.length - 1];
        const mainBeatIndex = Math.floor(lastNote.beat / subdivision);
        setCurrentBeat(mainBeatIndex);

        // Flash effect
        setTimeout(() => setCurrentBeat(-1), 100);
      }

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current!);
  }, [subdivision]);

  return (
    <div className="flex justify-center gap-4 mb-8 h-8 items-center">
      {Array.from({ length: beatsPerBar }).map((_, i) => {
        const isMuted = mutedBeats[i];
        const isActive = currentBeat === i;

        return (
          <button
            key={i}
            onClick={() => onToggleMute(i)}
            className={`
              w-4 h-4 rounded-full transition-all duration-75 cursor-pointer focus:outline-none
              ${
                isActive
                  ? isMuted
                    ? 'border-2 border-indigo-500 scale-150 shadow-[0_0_15px_rgba(99,102,241,0.4)] bg-transparent'
                    : 'bg-indigo-500 scale-150 shadow-[0_0_15px_rgba(99,102,241,0.8)]'
                  : isMuted
                  ? 'border-2 border-slate-300 dark:border-slate-600 bg-transparent'
                  : 'bg-slate-300 dark:bg-slate-700'
              }
            `}
            aria-label={`Beat ${i + 1} ${isMuted ? 'muted' : 'active'}`}
          />
        );
      })}
    </div>
  );
}
