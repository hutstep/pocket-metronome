export type SoundType = 'beep' | 'click' | 'woodblock';

export class Synthesizer {
  private context: AudioContext;

  constructor(context: AudioContext) {
    this.context = context;
  }

  playNote(time: number, type: SoundType, isAccent: boolean) {
    switch (type) {
      case 'beep':
        this.playBeep(time, isAccent);
        break;
      case 'click':
        this.playClick(time, isAccent);
        break;
      case 'woodblock':
        this.playWoodblock(time, isAccent);
        break;
    }
  }

  private playBeep(time: number, isAccent: boolean) {
    const osc = this.context.createOscillator();
    const gain = this.context.createGain();

    osc.connect(gain);
    gain.connect(this.context.destination);

    osc.frequency.value = isAccent ? 1200 : 800;
    osc.type = 'sine';

    gain.gain.setValueAtTime(isAccent ? 1 : 0.7, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.1);

    osc.start(time);
    osc.stop(time + 0.1);
  }

  private playClick(time: number, isAccent: boolean) {
    const osc = this.context.createOscillator();
    const gain = this.context.createGain();

    osc.connect(gain);
    gain.connect(this.context.destination);

    osc.frequency.value = isAccent ? 1500 : 1000;
    osc.type = 'square';

    gain.gain.setValueAtTime(isAccent ? 0.5 : 0.3, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);

    osc.start(time);
    osc.stop(time + 0.05);
  }

  private playWoodblock(time: number, isAccent: boolean) {
    const osc = this.context.createOscillator();
    const gain = this.context.createGain();

    osc.connect(gain);
    gain.connect(this.context.destination);

    osc.frequency.value = isAccent ? 1000 : 800;
    osc.type = 'sine';

    gain.gain.setValueAtTime(isAccent ? 1 : 0.7, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);

    osc.start(time);
    osc.stop(time + 0.05);
  }
}
