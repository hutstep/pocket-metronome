import type {
  MetronomeSettings,
  Preset,
  Setlist,
  StorageAdapter,
} from './types';

const KEYS = {
  SETTINGS: 'metronome_settings',
  PRESETS: 'metronome_presets',
  SETLISTS: 'metronome_setlists',
};

export class LocalStorageAdapter implements StorageAdapter {
  async saveSettings(settings: MetronomeSettings): Promise<void> {
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
  }

  async getSettings(): Promise<MetronomeSettings | null> {
    const data = localStorage.getItem(KEYS.SETTINGS);
    return data ? JSON.parse(data) : null;
  }

  async savePreset(preset: Preset): Promise<void> {
    const presets = await this.getPresets();
    const index = presets.findIndex((p) => p.id === preset.id);
    if (index >= 0) {
      presets[index] = preset;
    } else {
      presets.push(preset);
    }
    localStorage.setItem(KEYS.PRESETS, JSON.stringify(presets));
  }

  async getPresets(): Promise<Preset[]> {
    const data = localStorage.getItem(KEYS.PRESETS);
    return data ? JSON.parse(data) : [];
  }

  async deletePreset(id: string): Promise<void> {
    const presets = await this.getPresets();
    const newPresets = presets.filter((p) => p.id !== id);
    localStorage.setItem(KEYS.PRESETS, JSON.stringify(newPresets));
  }

  async saveSetlist(setlist: Setlist): Promise<void> {
    const setlists = await this.getSetlists();
    const index = setlists.findIndex((s) => s.id === setlist.id);
    if (index >= 0) {
      setlists[index] = setlist;
    } else {
      setlists.push(setlist);
    }
    localStorage.setItem(KEYS.SETLISTS, JSON.stringify(setlists));
  }

  async getSetlists(): Promise<Setlist[]> {
    const data = localStorage.getItem(KEYS.SETLISTS);
    return data ? JSON.parse(data) : [];
  }

  async deleteSetlist(id: string): Promise<void> {
    const setlists = await this.getSetlists();
    const newSetlists = setlists.filter((s) => s.id !== id);
    localStorage.setItem(KEYS.SETLISTS, JSON.stringify(newSetlists));
  }
}
