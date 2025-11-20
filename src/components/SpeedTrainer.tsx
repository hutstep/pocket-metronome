import { useState } from 'react';
import { metronomeEngine } from '../lib/audio/MetronomeEngine';
import { ChevronDown, ChevronUp } from 'lucide-react';

export function SpeedTrainer() {
  const [isOpen, setIsOpen] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [startBpm, setStartBpm] = useState(100);
  const [endBpm, setEndBpm] = useState(140);
  const [increment, setIncrement] = useState(5);
  const [interval, setInterval] = useState(4);

  const toggleTrainer = () => {
    const newState = !isEnabled;
    setIsEnabled(newState);
    metronomeEngine.setSpeedTrainer({
      isEnabled: newState,
      startBpm,
      endBpm,
      increment,
      interval,
    });
  };

  const updateSettings = (updates: any) => {
    if (updates.startBpm) setStartBpm(updates.startBpm);
    if (updates.endBpm) setEndBpm(updates.endBpm);
    if (updates.increment) setIncrement(updates.increment);
    if (updates.interval) setInterval(updates.interval);

    if (isEnabled) {
      metronomeEngine.setSpeedTrainer({
        ...updates,
      });
    }
  };

  return (
    <div className="w-full bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between font-semibold text-slate-700 dark:text-slate-200 cursor-pointer"
      >
        <span>Speed Trainer</span>
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>

      {isOpen && (
        <div className="p-4 pt-0 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">Enable</span>
            <button
              onClick={toggleTrainer}
              className={`
                w-12 h-6 rounded-full transition-colors relative cursor-pointer
                ${
                  isEnabled ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-600'
                }
              `}
            >
              <div
                className={`
                absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform
                ${isEnabled ? 'translate-x-6' : 'translate-x-0'}
              `}
              />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1">
                Start BPM
              </label>
              <input
                type="number"
                value={startBpm}
                onChange={(e) =>
                  updateSettings({ startBpm: Number(e.target.value) })
                }
                className="w-full p-2 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">
                End BPM
              </label>
              <input
                type="number"
                value={endBpm}
                onChange={(e) =>
                  updateSettings({ endBpm: Number(e.target.value) })
                }
                className="w-full p-2 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">
                Increase By
              </label>
              <input
                type="number"
                value={increment}
                onChange={(e) =>
                  updateSettings({ increment: Number(e.target.value) })
                }
                className="w-full p-2 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">
                Every (Bars)
              </label>
              <input
                type="number"
                value={interval}
                onChange={(e) =>
                  updateSettings({ interval: Number(e.target.value) })
                }
                className="w-full p-2 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
