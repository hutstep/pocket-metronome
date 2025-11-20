import { Play, Square, Plus, Minus } from 'lucide-react';
import { useMetronome } from '../hooks/useMetronome';
import { useTapTempo } from '../hooks/useTapTempo';
import type { SoundType } from '../lib/audio/Synthesizer';
import { Visualizer } from './Visualizer';
import { SpeedTrainer } from './SpeedTrainer';
import { PresetManager } from './PresetManager';
import { Timer } from './Timer';

export function MetronomeControls() {
  const {
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
    toggleMuteBeat,
    togglePlay,
  } = useMetronome();

  const tap = useTapTempo(setBpm);

  return (
    <div className="flex flex-col gap-6 w-full">
      <Visualizer
        beatsPerBar={beatsPerBar}
        subdivision={subdivision}
        mutedBeats={mutedBeats}
        onToggleMute={toggleMuteBeat}
      />

      {/* BPM Control */}
      <div className="flex flex-col items-center gap-2">
        <div className="text-6xl font-bold tabular-nums text-slate-900 dark:text-white">
          {bpm}
        </div>
        <div className="text-sm text-slate-500 uppercase tracking-wider font-semibold">
          BPM
        </div>

        <div className="flex items-center gap-4 w-full mt-4">
          <button
            onClick={() => setBpm(Math.max(30, bpm - 1))}
            className="p-4 rounded-full bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <Minus size={24} />
          </button>
          <input
            type="range"
            min="30"
            max="300"
            value={bpm}
            onChange={(e) => setBpm(Number(e.target.value))}
            className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-indigo-600"
          />
          <button
            onClick={() => setBpm(Math.min(300, bpm + 1))}
            className="p-4 rounded-full bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <Plus size={24} />
          </button>
        </div>

        <button
          onClick={tap}
          className="mt-4 px-8 py-3 rounded-full bg-slate-100 dark:bg-slate-800 font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer border-2 border-slate-200 dark:border-slate-700 active:scale-95"
        >
          TAP TEMPO
        </button>
      </div>

      {/* Play Button */}
      <div className="flex justify-center my-4">
        <button
          onClick={togglePlay}
          className={`
            p-8 rounded-full transition-all transform hover:scale-105 active:scale-95 shadow-lg cursor-pointer
            ${
              isPlaying
                ? 'bg-rose-500 hover:bg-rose-600 text-white'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }
          `}
        >
          {isPlaying ? (
            <Square size={48} fill="currentColor" />
          ) : (
            <Play size={48} fill="currentColor" />
          )}
        </button>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">
            Time Signature
          </label>
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setBeatsPerBar(Math.max(1, beatsPerBar - 1))}
                className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
              >
                <Minus size={16} />
              </button>
              <span className="text-2xl font-bold w-8 text-center">
                {beatsPerBar}
              </span>
              <button
                onClick={() => setBeatsPerBar(Math.min(16, beatsPerBar + 1))}
                className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
              >
                <Plus size={16} />
              </button>
            </div>

            <span className="text-2xl font-light text-slate-400">/</span>

            <div className="relative">
              <select
                value={noteValue}
                onChange={(e) => setNoteValue(Number(e.target.value))}
                className="appearance-none bg-transparent text-2xl font-bold text-center w-16 cursor-pointer focus:outline-none border-b-2 border-transparent hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
              >
                {[1, 2, 4, 8, 16, 32].map((val) => (
                  <option key={val} value={val}>
                    {val}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="col-span-2 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">
            Subdivision
          </label>
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSubdivision(Math.max(1, subdivision - 1))}
              className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
            >
              <Minus size={16} />
            </button>
            <span className="text-xl font-bold">{subdivision}</span>
            <button
              onClick={() => setSubdivision(Math.min(4, subdivision + 1))}
              className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        <div className="col-span-2 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">
            Sound
          </label>
          <div className="flex gap-2">
            {(['beep', 'click', 'woodblock'] as SoundType[]).map((sound) => (
              <button
                key={sound}
                onClick={() => setSoundPreset(sound)}
                className={`
                   flex-1 py-2 px-3 rounded-lg text-sm font-medium capitalize transition-colors cursor-pointer
                   ${
                     soundPreset === sound
                       ? 'bg-indigo-600 text-white shadow-sm'
                       : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600'
                   }
                 `}
              >
                {sound}
              </button>
            ))}
          </div>
        </div>

        <div className="col-span-2">
          <SpeedTrainer />
        </div>

        <div className="col-span-2">
          <Timer />
        </div>

        <div className="col-span-2">
          <PresetManager />
        </div>
      </div>
    </div>
  );
}
