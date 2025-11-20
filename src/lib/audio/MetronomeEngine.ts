import { audioContextManager } from './AudioContextManager';
import { Synthesizer, type SoundType } from './Synthesizer';

export interface MetronomeState {
  isPlaying: boolean;
  bpm: number;
  beatsPerBar: number;
  noteValue: number;
  subdivision: number;
  soundPreset: SoundType;
  mutedBeats: boolean[];
}

export interface ScheduledNote {
  beat: number;
  time: number;
}

export interface SpeedTrainerState {
  isEnabled: boolean;
  startBpm: number;
  endBpm: number;
  increment: number;
  interval: number;
}

export class MetronomeEngine {
  private isPlaying: boolean = false;
  private bpm: number = 120;
  private beatsPerBar: number = 4;
  private noteValue: number = 4;

  // ...

  getNoteValue() {
    return this.noteValue;
  }
  private subdivision: number = 1;
  private soundPreset: SoundType = 'beep';
  private mutedBeats: boolean[] = [false, false, false, false];

  private nextNoteTime: number = 0.0;
  private currentBeatInBar: number = 0;
  private timerID: number | null = null;
  private lookahead: number = 25.0; // ms
  private scheduleAheadTime: number = 0.1; // s

  private synthesizer: Synthesizer | null = null;
  private onBeatCallback: ((beat: number, time: number) => void) | null = null;
  private noteQueue: ScheduledNote[] = [];

  private speedTrainer: SpeedTrainerState = {
    isEnabled: false,
    startBpm: 100,
    endBpm: 120,
    increment: 5,
    interval: 4,
  };
  private barsPlayed: number = 0;
  private onStateChangeCallback:
    | ((state: Partial<MetronomeState>) => void)
    | null = null;

  constructor() {
    // Initialize later
  }

  setCallback(callback: (beat: number, time: number) => void) {
    this.onBeatCallback = callback;
  }

  setStateChangeCallback(callback: (state: Partial<MetronomeState>) => void) {
    this.onStateChangeCallback = callback;
  }

  setSpeedTrainer(state: Partial<SpeedTrainerState>) {
    this.speedTrainer = { ...this.speedTrainer, ...state };
    if (state.isEnabled && state.startBpm) {
      this.barsPlayed = 0;
      this.bpm = state.startBpm;
      if (this.onStateChangeCallback)
        this.onStateChangeCallback({ bpm: this.bpm });
    }
  }

  pollNotes(currentTime: number): ScheduledNote[] {
    const notesToPlay: ScheduledNote[] = [];
    while (this.noteQueue.length && this.noteQueue[0].time <= currentTime) {
      notesToPlay.push(this.noteQueue.shift()!);
    }
    return notesToPlay;
  }

  getMutedBeats() {
    return [...this.mutedBeats];
  }

  setMutedBeats(mutedBeats: boolean[]) {
    this.mutedBeats = mutedBeats;
    if (this.onStateChangeCallback) {
      this.onStateChangeCallback({ mutedBeats: this.mutedBeats });
    }
  }

  toggleMuteBeat(index: number) {
    if (index >= 0 && index < this.mutedBeats.length) {
      const newMutedBeats = [...this.mutedBeats];
      newMutedBeats[index] = !newMutedBeats[index];
      this.setMutedBeats(newMutedBeats);
    }
  }

  setState(state: Partial<MetronomeState> & { mutedBeats?: boolean[] }) {
    if (state.bpm) this.bpm = state.bpm;
    if (state.beatsPerBar) {
      this.beatsPerBar = state.beatsPerBar;
      // Resize mutedBeats array if needed
      if (this.mutedBeats.length !== this.beatsPerBar) {
        const newMutedBeats = new Array(this.beatsPerBar).fill(false);
        // Preserve existing mute states where possible
        for (
          let i = 0;
          i < Math.min(this.mutedBeats.length, this.beatsPerBar);
          i++
        ) {
          newMutedBeats[i] = this.mutedBeats[i];
        }
        this.mutedBeats = newMutedBeats;
        // Notify state change for mutedBeats as well since it changed implicitly
        if (this.onStateChangeCallback) {
          // We need to defer this slightly or handle it carefully to avoid loops if not careful,
          // but here it's just a notification.
          // Actually, let's just include it in the next update or let the UI pull it.
          // Better to be explicit.
        }
      }
    }
    if (state.noteValue) this.noteValue = state.noteValue;
    if (state.subdivision) this.subdivision = state.subdivision;
    if (state.soundPreset) this.soundPreset = state.soundPreset;
    if (state.mutedBeats) this.mutedBeats = state.mutedBeats;

    if (state.isPlaying !== undefined) {
      if (state.isPlaying && !this.isPlaying) {
        this.start();
      } else if (!state.isPlaying && this.isPlaying) {
        this.stop();
      }
    }
  }

  private nextNote() {
    const secondsPerBeat = 60.0 / this.bpm;
    // Adjust for subdivision
    const secondsPerSubdivision = secondsPerBeat / this.subdivision;

    this.nextNoteTime += secondsPerSubdivision;

    this.currentBeatInBar++;
    if (this.currentBeatInBar >= this.beatsPerBar * this.subdivision) {
      this.currentBeatInBar = 0;

      this.barsPlayed++;
      if (
        this.speedTrainer.isEnabled &&
        this.barsPlayed > 0 &&
        this.barsPlayed % this.speedTrainer.interval === 0
      ) {
        if (this.bpm < this.speedTrainer.endBpm) {
          this.bpm = Math.min(
            this.speedTrainer.endBpm,
            this.bpm + this.speedTrainer.increment
          );
          if (this.onStateChangeCallback) {
            this.onStateChangeCallback({ bpm: this.bpm });
          }
        }
      }
    }
  }

  private scheduleNote(beatNumber: number, time: number) {
    if (!this.synthesizer) return;

    // Determine which main beat this subdivision belongs to
    const mainBeatIndex = Math.floor(beatNumber / this.subdivision);

    // Check if this beat is muted
    if (this.mutedBeats[mainBeatIndex]) {
      // Even if muted, we might want to trigger the callback for visualizer?
      // Usually visualizer should still show the beat, just no sound.
      if (this.onBeatCallback) {
        this.onBeatCallback(beatNumber, time);
      }
      this.noteQueue.push({ beat: beatNumber, time: time });
      return;
    }

    // Determine if it's the first beat of the bar (accent)
    const isAccent = beatNumber === 0;
    // Determine if it's a main beat or a subdivision
    const isMainBeat = beatNumber % this.subdivision === 0;

    if (isMainBeat) {
      this.synthesizer.playNote(time, this.soundPreset, isAccent);
    } else {
      // Play a softer sound for subdivisions if needed
      // For now, we can play a very soft click or just skip
      // Let's play a soft click for subdivisions
      this.synthesizer.playNote(time, 'click', false);
    }

    if (this.onBeatCallback) {
      this.onBeatCallback(beatNumber, time);
    }

    this.noteQueue.push({ beat: beatNumber, time: time });
  }

  private scheduler() {
    const context = audioContextManager.getContext();
    while (this.nextNoteTime < context.currentTime + this.scheduleAheadTime) {
      this.scheduleNote(this.currentBeatInBar, this.nextNoteTime);
      this.nextNote();
    }
    this.timerID = window.setTimeout(() => this.scheduler(), this.lookahead);
  }

  async start() {
    if (this.isPlaying) return;

    await audioContextManager.resume();
    const context = audioContextManager.getContext();
    this.synthesizer = new Synthesizer(context);

    this.isPlaying = true;
    if (this.onStateChangeCallback) {
      this.onStateChangeCallback({ isPlaying: true });
    }

    this.currentBeatInBar = 0;
    this.nextNoteTime = context.currentTime + 0.05;
    this.scheduler();
  }

  stop() {
    this.isPlaying = false;
    if (this.onStateChangeCallback) {
      this.onStateChangeCallback({ isPlaying: false });
    }

    if (this.timerID !== null) {
      window.clearTimeout(this.timerID);
      this.timerID = null;
    }
  }
}

export const metronomeEngine = new MetronomeEngine();
