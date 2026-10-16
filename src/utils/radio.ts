// Procedural Web Audio Afrobeats Radio Engine (Naija FM 99.9)

export type RadioStationId = 'lagos_hustle' | 'fuji_groove' | 'sunday_highlife';

export interface RadioStation {
  id: RadioStationId;
  name: string;
  frequency: string;
  genre: string;
  bpm: number;
  currentTrack: string;
  djQuote: string;
}

export const RADIO_STATIONS: RadioStation[] = [
  {
    id: 'lagos_hustle',
    name: 'Lagos Hustle FM',
    frequency: '99.9 MHz',
    genre: 'Afro-House & Amapiano',
    bpm: 118,
    currentTrack: 'Mainland Expressway Log Drums',
    djQuote: 'No sleeping in Lagos! Keep the hustle moving!',
  },
  {
    id: 'fuji_groove',
    name: 'Fuji & Juju Classics',
    frequency: '105.5 MHz',
    genre: 'Traditional Fuji & Talking Drum',
    bpm: 104,
    currentTrack: 'Balogun Chieftaincy Praise',
    djQuote: 'Gbe body e! Spray the mint notes on the dance floor!',
  },
  {
    id: 'sunday_highlife',
    name: 'Sunday Highlife Chill',
    frequency: '92.3 MHz',
    genre: 'Classic Highlife & Afro-Soul',
    bpm: 96,
    currentTrack: 'Palmwine & Sweet Guitar Serenade',
    djQuote: 'Relax your mind, eat good food, life is sweet.',
  },
];

class NaijaRadioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private currentStation: RadioStationId = 'lagos_hustle';
  private volume: number = 0.25;
  private timerId: number | null = null;
  private step: number = 0;
  private listeners: Array<() => void> = [];

  private masterGain: GainNode | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('naija_radio_playing');
      const savedStation = localStorage.getItem('naija_radio_station') as RadioStationId;
      if (savedStation && RADIO_STATIONS.some((s) => s.id === savedStation)) {
        this.currentStation = savedStation;
      }
    }
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public subscribe(cb: () => void) {
    this.listeners.push(cb);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== cb);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getCurrentStation(): RadioStation {
    return RADIO_STATIONS.find((s) => s.id === this.currentStation) || RADIO_STATIONS[0];
  }

  public setStation(stationId: RadioStationId) {
    this.currentStation = stationId;
    if (typeof window !== 'undefined') {
      localStorage.setItem('naija_radio_station', stationId);
    }
    if (this.isPlaying) {
      this.stopBeatLoop();
      this.startBeatLoop();
    }
    this.notify();
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
    this.notify();
  }

  public getVolume(): number {
    return this.volume;
  }

  public togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  public play() {
    this.initCtx();
    this.isPlaying = true;
    this.startBeatLoop();
    this.notify();
  }

  public pause() {
    this.isPlaying = false;
    this.stopBeatLoop();
    this.notify();
  }

  private stopBeatLoop() {
    if (this.timerId !== null) {
      window.clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  private startBeatLoop() {
    this.stopBeatLoop();
    const station = this.getCurrentStation();
    const intervalMs = (60 / station.bpm / 4) * 1000; // 16th note clock

    this.timerId = window.setInterval(() => {
      this.tick();
    }, intervalMs);
  }

  private tick() {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const s = this.step % 16;

    if (this.currentStation === 'lagos_hustle') {
      // Amapiano style: 4/4 Kick on quarter notes (0, 4, 8, 12), Shakers on 16ths, Log Drum Bass syncopated
      if (s === 0 || s === 4 || s === 8 || s === 12) {
        this.playKick(now);
      }
      if (s % 2 === 0) {
        this.playShaker(now, s % 4 === 2 ? 0.08 : 0.04);
      }
      // Amapiano log drum syncopated bass hits
      if (s === 2 || s === 5 || s === 7 || s === 11 || s === 14) {
        const bassFreq = s === 2 ? 55 : s === 5 ? 65 : s === 7 ? 49 : 58;
        this.playLogDrum(now, bassFreq);
      }
      // Warm Rhodes chords on bar beats
      if (s === 0 || s === 8) {
        this.playChord(now, s === 0 ? [261.63, 329.63, 392.0] : [220.0, 261.63, 329.63]);
      }
    } else if (this.currentStation === 'fuji_groove') {
      // Fuji style: Talking drum polyrhythms, bell percussion, walking pentatonic groove
      if (s === 0 || s === 6 || s === 10) {
        this.playTalkingDrum(now, 140, 190);
      }
      if (s === 3 || s === 9 || s === 14) {
        this.playTalkingDrum(now, 180, 130);
      }
      // Fuji metallic bell
      if (s === 0 || s === 3 || s === 6 || s === 8 || s === 10 || s === 12 || s === 14) {
        this.playBell(now);
      }
      // Melodic pentatonic synth lead
      if (s === 4 || s === 8 || s === 12) {
        const notes = [293.66, 349.23, 392.0, 440.0, 523.25];
        this.playLeadNote(now, notes[s % notes.length]);
      }
    } else {
      // Sunday Highlife: Warm swing, brass horn stabs, sweet bassline
      if (s === 0 || s === 8) {
        this.playHighlifeKick(now);
      }
      if (s === 4 || s === 12) {
        this.playSnare(now);
      }
      if (s % 2 === 1) {
        this.playShaker(now, 0.03);
      }
      // Highlife horn chords
      if (s === 2 || s === 6 || s === 10 || s === 14) {
        this.playHornStab(now, [329.63, 392.0, 493.88]);
      }
    }

    this.step++;
  }

  // Synthesis helpers:
  private playKick(time: number) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.frequency.setValueAtTime(120, time);
    osc.frequency.exponentialRampToValueAtTime(40, time + 0.08);

    gain.gain.setValueAtTime(0.4, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.12);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(time);
    osc.stop(time + 0.13);
  }

  private playHighlifeKick(time: number) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.frequency.setValueAtTime(95, time);
    osc.frequency.exponentialRampToValueAtTime(45, time + 0.1);

    gain.gain.setValueAtTime(0.3, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.15);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(time);
    osc.stop(time + 0.16);
  }

  private playSnare(time: number) {
    if (!this.ctx || !this.masterGain) return;
    const noiseBuffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.1, this.ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < noiseBuffer.length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.02));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.2, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.1);

    noise.connect(gain);
    gain.connect(this.masterGain);
    noise.start(time);
  }

  private playShaker(time: number, vol: number) {
    if (!this.ctx || !this.masterGain) return;
    const buffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.03, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < buffer.length; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const source = this.ctx.createBufferSource();
    source.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(6000, time);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(vol, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.03);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    source.start(time);
  }

  private playLogDrum(time: number, freq: number) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq * 1.5, time);
    osc.frequency.exponentialRampToValueAtTime(freq, time + 0.06);

    gain.gain.setValueAtTime(0.35, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.18);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(time);
    osc.stop(time + 0.2);
  }

  private playTalkingDrum(time: number, startFreq: number, endFreq: number) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(startFreq, time);
    osc.frequency.linearRampToValueAtTime(endFreq, time + 0.1);

    gain.gain.setValueAtTime(0.3, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.14);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(time);
    osc.stop(time + 0.15);
  }

  private playBell(time: number) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1180, time);

    gain.gain.setValueAtTime(0.12, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.06);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(time);
    osc.stop(time + 0.07);
  }

  private playChord(time: number, freqs: number[]) {
    if (!this.ctx || !this.masterGain) return;
    freqs.forEach((freq) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);

      gain.gain.setValueAtTime(0.08, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.35);

      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start(time);
      osc.stop(time + 0.38);
    });
  }

  private playHornStab(time: number, freqs: number[]) {
    if (!this.ctx || !this.masterGain) return;
    freqs.forEach((freq) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, time);

      gain.gain.setValueAtTime(0.06, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.2);

      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start(time);
      osc.stop(time + 0.22);
    });
  }

  private playLeadNote(time: number, freq: number) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, time);

    gain.gain.setValueAtTime(0.12, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.18);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(time);
    osc.stop(time + 0.2);
  }
}

export const naijaRadio = new NaijaRadioEngine();
