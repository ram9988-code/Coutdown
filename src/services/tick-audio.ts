import { Platform } from 'react-native';

/**
 * Procedural web audio tick sound synthesizer.
 * Creates a subtle, soothing analog clock tick escapement sound
 * without any external MP3 or asset files.
 */
class TickAudioManager {
  private audioCtx: AudioContext | null = null;
  private isEnabled: boolean = false;
  private lastTickType: 'tick' | 'tock' = 'tock';

  constructor() {
    // Lazy init on first user interaction
  }

  public toggle(): boolean {
    this.isEnabled = !this.isEnabled;
    if (this.isEnabled && !this.audioCtx && Platform.OS === 'web' && typeof window !== 'undefined') {
      try {
        const AudioContextClass =
          window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioContextClass) {
          this.audioCtx = new AudioContextClass();
        }
      } catch (err) {
        console.warn('AudioContext initialization failed', err);
      }
    }
    if (this.isEnabled && this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.isEnabled;
  }

  public getEnabled(): boolean {
    return this.isEnabled;
  }

  public setEnabled(val: boolean) {
    this.isEnabled = val;
  }

  public playTick() {
    if (!this.isEnabled || Platform.OS !== 'web' || !this.audioCtx) return;

    try {
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      // Alternate between higher frequency tick and lower tock
      const isTick = this.lastTickType === 'tock';
      this.lastTickType = isTick ? 'tick' : 'tock';

      osc.type = 'sine';
      osc.frequency.setValueAtTime(isTick ? 1400 : 1050, now);
      osc.frequency.exponentialRampToValueAtTime(100, now + 0.025);

      // Very soft, tactile volume
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.025);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.025);
    } catch {
      // Ignore audio synthesis glitches quietly
    }
  }
}

export const tickAudio = new TickAudioManager();
