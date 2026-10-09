// Web Audio API synthesizer for tactile micro-feedback
// Safe across all browsers, zero external audio assets required.

class SoundSystem {
  private ctx: AudioContext | null = null;
  private enabled: boolean = false;
  private lastOrbitSoundAt = 0;

  constructor() {
    // Audio is disabled by default to respect user autoplay preferences
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public async enableWithFeedback(): Promise<void> {
    const AudioCtx = window.AudioContext
      ?? (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) {
      throw new Error('This browser does not support sound effects.');
    }

    this.ctx ??= new AudioCtx();
    if (this.ctx.state !== 'running') await this.ctx.resume();
    if (this.ctx.state !== 'running') {
      throw new Error('Audio could not start. Check your browser audio settings.');
    }

    this.enabled = true;
    this.playEnableChime();
  }

  public disable(): void {
    this.enabled = false;
  }

  private playEnableChime(): void {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    [587.33, 880].forEach((frequency, index) => {
      const startAt = now + index * 0.075;
      const oscillator = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(frequency, startAt);
      gain.gain.setValueAtTime(0.0001, startAt);
      gain.gain.linearRampToValueAtTime(0.035, startAt + 0.025);
      gain.gain.exponentialRampToValueAtTime(0.0001, startAt + 0.2);
      oscillator.connect(gain);
      gain.connect(this.ctx!.destination);
      oscillator.start(startAt);
      oscillator.stop(startAt + 0.21);
    });
  }

  public playGalaxyEnter(): void {
    if (!this.enabled || !this.ctx) return;
    this.playBlip(520);
    window.setTimeout(() => this.playBlip(780), 85);
  }

  public playOrbitMotion(): void {
    if (!this.enabled || !this.ctx || this.ctx.state !== 'running') return;
    const now = this.ctx.currentTime;
    if (now - this.lastOrbitSoundAt < 0.16) return;
    this.lastOrbitSoundAt = now;

    try {
      const oscillator = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(190, now);
      oscillator.frequency.exponentialRampToValueAtTime(520, now + 0.2);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.022, now + 0.035);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.24);
      oscillator.connect(gain);
      gain.connect(this.ctx.destination);
      oscillator.start(now);
      oscillator.stop(now + 0.25);
    } catch {
      // Audio can be interrupted if the browser suspends the page.
    }
  }

  // Soft high-frequency cybernetic blip (node hover)
  public playBlip(freq = 640) {
    if (!this.enabled || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + 0.05);

      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.06);
    } catch {
      // AudioContext interrupted or not allowed
    }
  }

  // Sub-bass confirmation thud (card click / action)
  public playClick() {
    if (!this.enabled || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.08);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.08);
    } catch {
      // Ignore
    }
  }

  // Ambient chime for section transition
  public playTransition() {
    if (!this.enabled || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      [440, 660, 880].forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const offset = idx * 0.03;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + offset);

        gain.gain.setValueAtTime(0.015, now + offset);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + offset + 0.12);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + offset);
        osc.stop(now + offset + 0.12);
      });
    } catch {
      // Ignore
    }
  }
}

export const sound = new SoundSystem();
