import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { storage, type Preset } from '../lib/storage';
import { useMetronome } from '../hooks/useMetronome';
import { Save, Trash2, Play } from 'lucide-react';

export function PresetManager() {
  const {
    bpm,
    beatsPerBar,
    noteValue,
    subdivision,
    soundPreset,
    mutedBeats,
    setBpm,
    setBeatsPerBar,
    setNoteValue,
    setSubdivision,
    setSoundPreset,
    setMutedBeats,
  } = useMetronome();
  const [newPresetName, setNewPresetName] = useState('');
  const queryClient = useQueryClient();

  const { data: presets } = useQuery({
    queryKey: ['presets'],
    queryFn: () => storage.getPresets(),
  });

  const saveMutation = useMutation({
    mutationFn: (name: string) =>
      storage.savePreset({
        id: crypto.randomUUID(),
        name,
        settings: {
          bpm,
          beatsPerBar,
          subdivision,
          soundPreset,
          noteValue,
          mutedBeats,
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['presets'] });
      setNewPresetName('');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => storage.deletePreset(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['presets'] }),
  });

  const loadPreset = (preset: Preset) => {
    setBpm(preset.settings.bpm);
    setBeatsPerBar(preset.settings.beatsPerBar);
    if (preset.settings.noteValue) setNoteValue(preset.settings.noteValue);
    setSubdivision(preset.settings.subdivision);
    setSoundPreset(preset.settings.soundPreset as any);
    if (preset.settings.mutedBeats) {
      setMutedBeats(preset.settings.mutedBeats);
    } else {
      // Reset if not present in preset
      setMutedBeats(new Array(preset.settings.beatsPerBar).fill(false));
    }
  };

  return (
    <div className="mt-8 w-full">
      <h3 className="text-lg font-bold mb-4 text-slate-900 dark:text-white">
        Presets
      </h3>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={newPresetName}
          onChange={(e) => setNewPresetName(e.target.value)}
          placeholder="New preset name..."
          className="flex-1 p-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
        />
        <button
          onClick={() => newPresetName && saveMutation.mutate(newPresetName)}
          disabled={!newPresetName}
          className="p-2 bg-indigo-600 text-white rounded-lg disabled:opacity-50 hover:bg-indigo-700 transition-colors cursor-pointer"
        >
          <Save size={20} />
        </button>
      </div>

      <div className="space-y-2 max-h-60 overflow-y-auto">
        {presets?.map((preset) => (
          <div
            key={preset.id}
            className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm"
          >
            <div>
              <div className="font-medium">{preset.name}</div>
              <div className="text-xs text-slate-500">
                {preset.settings.bpm} BPM • {preset.settings.beatsPerBar}/
                {preset.settings.noteValue || 4}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => loadPreset(preset)}
                className="p-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors cursor-pointer"
              >
                <Play size={16} />
              </button>
              <button
                onClick={() => deleteMutation.mutate(preset.id)}
                className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-colors cursor-pointer"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
        {presets?.length === 0 && (
          <div className="text-center text-slate-500 py-4">
            No presets saved
          </div>
        )}
      </div>
    </div>
  );
}
