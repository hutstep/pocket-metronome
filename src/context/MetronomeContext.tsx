import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import { metronomeEngine } from '../lib/audio/MetronomeEngine';
import type { SoundType } from '../lib/audio/Synthesizer';

interface MetronomeContextType {
  isPlaying: boolean;
  bpm: number;
  setBpm: (bpm: number) => void;
  beatsPerBar: number;
  setBeatsPerBar: (beats: number) => void;
  noteValue: number;
  setNoteValue: (value: number) => void;
  subdivision: number;
  setSubdivision: (sub: number) => void;
  soundPreset: SoundType;
  setSoundPreset: (sound: SoundType) => void;
  mutedBeats: boolean[];
  setMutedBeats: (muted: boolean[]) => void;
  toggleMuteBeat: (index: number) => void;
  togglePlay: () => void;
}

const MetronomeContext = createContext<MetronomeContextType | undefined>(
  undefined
);

export function MetronomeProvider({ children }: { children: ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(120);
  const [beatsPerBar, setBeatsPerBar] = useState(4);
  const [noteValue, setNoteValue] = useState(4);
  const [subdivision, setSubdivision] = useState(1);
  const [soundPreset, setSoundPreset] = useState<SoundType>('beep');
  const [mutedBeats, setMutedBeats] = useState<boolean[]>(
    new Array(4).fill(false)
  );

  useEffect(() => {
    metronomeEngine.setState({
      bpm,
      beatsPerBar,
      noteValue,
      subdivision,
      soundPreset,
      mutedBeats,
    });
  }, [bpm, beatsPerBar, noteValue, subdivision, soundPreset, mutedBeats]);

  // Sync mutedBeats length when beatsPerBar changes
  useEffect(() => {
    setMutedBeats((prev) => {
      if (prev.length === beatsPerBar) return prev;
      const newMuted = new Array(beatsPerBar).fill(false);
      for (let i = 0; i < Math.min(prev.length, beatsPerBar); i++) {
        newMuted[i] = prev[i];
      }
      return newMuted;
    });
  }, [beatsPerBar]);

  useEffect(() => {
    metronomeEngine.setStateChangeCallback((state) => {
      if (state.bpm) setBpm(state.bpm);
      if (state.isPlaying !== undefined) setIsPlaying(state.isPlaying);
    });
  }, []);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      metronomeEngine.stop();
      setIsPlaying(false);
    } else {
      metronomeEngine.start();
      setIsPlaying(true);
    }
  }, [isPlaying]);

  const toggleMuteBeat = useCallback((index: number) => {
    setMutedBeats((prev) => {
      const newMuted = [...prev];
      if (index >= 0 && index < newMuted.length) {
        newMuted[index] = !newMuted[index];
      }
      return newMuted;
    });
  }, []);

  const value = {
    isPlaying,
    bpm,
    setBpm,
    beatsPerBar,
    setBeatsPerBar,
    noteValue,
    setNoteValue,
    subdivision,
    setSubdivision,
    soundPreset,
    setSoundPreset,
    mutedBeats,
    setMutedBeats,
    toggleMuteBeat,
    togglePlay,
  };

  return (
    <MetronomeContext.Provider value={value}>
      {children}
    </MetronomeContext.Provider>
  );
}

export function useMetronomeContext() {
  const context = useContext(MetronomeContext);
  if (context === undefined) {
    throw new Error(
      'useMetronomeContext must be used within a MetronomeProvider'
    );
  }
  return context;
}
