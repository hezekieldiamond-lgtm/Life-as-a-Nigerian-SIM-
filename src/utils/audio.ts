// Procedural Web Audio API sound generator for authentic game feedback

class SoundEffectsEngine {
  private ctx: AudioContext | null = null;
  private muted: boolean = false;

  constructor() {
    // Check saved audio preference
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('naija_sim_audio_muted');
      if (saved !== null) {
        this.muted = saved === 'true';
      }
    }
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public setMuted(muted: boolean) {
    this.muted = muted;
    if (typeof window !== 'undefined') {
      localStorage.setItem('naija_sim_audio_muted', muted ? 'true' : 'false');
    }
  }

  public toggleMute(): boolean {
    this.setMuted(!this.muted);
    return this.muted;
  }

  // Crisp modern button click
  public playClick() {
    if (this.muted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch {
      // AudioContext policy safe guard
    }
  }

  // Money spray chime / cash inflow
  public playMoneyChime() {
    if (this.muted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx!.currentTime + i * 0.06);

        gain.gain.setValueAtTime(0, this.ctx!.currentTime + i * 0.06);
        gain.gain.linearRampToValueAtTime(0.18, this.ctx!.currentTime + i * 0.06 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx!.currentTime + i * 0.06 + 0.28);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(this.ctx!.currentTime + i * 0.06);
        osc.stop(this.ctx!.currentTime + i * 0.06 + 0.3);
      });
    } catch {
      // AudioContext policy
    }
  }

  // Sapa warning / heavy expense chord
  public playSapaWarning() {
    if (this.muted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const notes = [220, 207.65, 196]; // A3, G#3, G3 (dramatic drop)
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, this.ctx!.currentTime + idx * 0.12);

        gain.gain.setValueAtTime(0.15, this.ctx!.currentTime + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx!.currentTime + idx * 0.12 + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(this.ctx!.currentTime + idx * 0.12);
        osc.stop(this.ctx!.currentTime + idx * 0.12 + 0.26);
      });
    } catch {
      // Safe guard
    }
  }

  // Generator engine start sound effect
  public playGeneratorStart() {
    if (this.muted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // Cord pull
      const noiseBuffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.3, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < noiseBuffer.length; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.18, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      whiteNoise.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);
      whiteNoise.start(now);

      // Low generator drone sputter
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(55, now + 0.15);
      osc.frequency.linearRampToValueAtTime(80, now + 0.5);

      oscGain.gain.setValueAtTime(0, now + 0.15);
      oscGain.gain.linearRampToValueAtTime(0.16, now + 0.25);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

      osc.connect(oscGain);
      oscGain.connect(this.ctx.destination);
      osc.start(now + 0.15);
      osc.stop(now + 0.72);
    } catch {
      // Safe guard
    }
  }

  // Big milestone fanfare (Graduation, Promotion, Japa Visa, Chieftaincy)
  public playFanfare() {
    if (this.muted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      // Uplifting arpeggio: C4, E4, G4, C5, E5, G5
      const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99];
      const now = this.ctx.currentTime;
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.2, now + idx * 0.08 + 0.03);
        const duration = idx === notes.length - 1 ? 0.6 : 0.2;
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + duration);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + duration + 0.05);
      });
    } catch {
      // Safe guard
    }
  }

  // Error buzzer / bad news
  public playFailure() {
    if (this.muted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(95, this.ctx.currentTime + 0.3);

      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.36);
    } catch {
      // Safe guard
    }
  }
}

export const soundEngine = new SoundEffectsEngine();
