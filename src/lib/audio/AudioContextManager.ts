class AudioContextManager {
  private context: AudioContext | null = null;

  getContext(): AudioContext {
    if (!this.context) {
      this.context = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
    }
    return this.context;
  }

  async resume() {
    const ctx = this.getContext();
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }
  }
}

export const audioContextManager = new AudioContextManager();
