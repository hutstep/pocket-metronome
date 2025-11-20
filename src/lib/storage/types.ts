export interface MetronomeSettings {
  bpm: number;
  beatsPerBar: number;
  noteValue: number; // 4 for quarter note, 8 for eighth note
  subdivision: number; // 1, 2, 3, 4
  soundPreset: string;
  mutedBeats?: boolean[];
}

export interface Preset {
  id: string;
  name: string;
  settings: MetronomeSettings;
}

export interface Setlist {
  id: string;
  name: string;
  presets: Preset[];
}

export interface StorageAdapter {
  saveSettings(settings: MetronomeSettings): Promise<void>;
  getSettings(): Promise<MetronomeSettings | null>;

  savePreset(preset: Preset): Promise<void>;
  getPresets(): Promise<Preset[]>;
  deletePreset(id: string): Promise<void>;

  saveSetlist(setlist: Setlist): Promise<void>;
  getSetlists(): Promise<Setlist[]>;
  deleteSetlist(id: string): Promise<void>;
}
