/**
 * Atmospheric Audio Synthesizer for Himalayan Environment
 * Uses Web Audio API to create authentic mountain wind and singing bowl drone.
 * 100% self-contained, no external asset load failures or CORS issues.
 */

class MountainAudioService {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private masterGain: GainNode | null = null;
  private windGain: GainNode | null = null;
  private bowlGain: GainNode | null = null;
  private noiseNode: AudioBufferSourceNode | null = null;
  private bowlOsc1: OscillatorNode | null = null;
  private bowlOsc2: OscillatorNode | null = null;
  private bowlOsc3: OscillatorNode | null = null;
  private filterLFO: OscillatorNode | null = null;

  public init() {
    if (this.ctx) return;
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    this.ctx = new AudioContextClass();

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);
  }

  public async toggle(): Promise<boolean> {
    if (!this.ctx) {
      this.init();
    }
    if (!this.ctx) return false;

    if (this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }

    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  private start() {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    // 1. Synthesize Pink Noise for Himalayan High-Altitude Wind
    const bufferSize = this.ctx.sampleRate * 3;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      output[i] *= 0.11;
      b6 = white * 0.115926;
    }

    this.noiseNode = this.ctx.createBufferSource();
    this.noiseNode.buffer = noiseBuffer;
    this.noiseNode.loop = true;

    // Wind Bandpass filter for hollow gusty sound
    const windFilter = this.ctx.createBiquadFilter();
    windFilter.type = 'bandpass';
    windFilter.frequency.setValueAtTime(280, now);
    windFilter.Q.setValueAtTime(1.8, now);

    // LFO to slowly sweep wind gusts like mountain peaks
    this.filterLFO = this.ctx.createOscillator();
    this.filterLFO.frequency.setValueAtTime(0.12, now); // Slow gust cycle
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(180, now);
    this.filterLFO.connect(lfoGain);
    lfoGain.connect(windFilter.frequency);

    this.windGain = this.ctx.createGain();
    this.windGain.gain.setValueAtTime(0.45, now);

    this.noiseNode.connect(windFilter);
    windFilter.connect(this.windGain);
    this.windGain.connect(this.masterGain);

    this.noiseNode.start(now);
    this.filterLFO.start(now);

    // 2. Harmonic Tibetan Singing Bowl ambient drone (Root note F# / 185Hz + harmonics 370Hz, 554Hz)
    this.bowlGain = this.ctx.createGain();
    this.bowlGain.gain.setValueAtTime(0.08, now);

    this.bowlOsc1 = this.ctx.createOscillator();
    this.bowlOsc1.type = 'sine';
    this.bowlOsc1.frequency.setValueAtTime(185.0, now);

    this.bowlOsc2 = this.ctx.createOscillator();
    this.bowlOsc2.type = 'sine';
    this.bowlOsc2.frequency.setValueAtTime(370.4, now);

    this.bowlOsc3 = this.ctx.createOscillator();
    this.bowlOsc3.type = 'sine';
    this.bowlOsc3.frequency.setValueAtTime(555.0, now);

    const subGain2 = this.ctx.createGain();
    subGain2.gain.setValueAtTime(0.4, now);
    const subGain3 = this.ctx.createGain();
    subGain3.gain.setValueAtTime(0.2, now);

    this.bowlOsc1.connect(this.bowlGain);
    this.bowlOsc2.connect(subGain2);
    subGain2.connect(this.bowlGain);
    this.bowlOsc3.connect(subGain3);
    subGain3.connect(this.bowlGain);

    this.bowlGain.connect(this.masterGain);

    this.bowlOsc1.start(now);
    this.bowlOsc2.start(now);
    this.bowlOsc3.start(now);

    // Gentle fade in
    this.masterGain.gain.linearRampToValueAtTime(0.65, now + 2.5);
    this.isPlaying = true;
  }

  private stop() {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    this.masterGain.gain.linearRampToValueAtTime(0.001, now + 1.2);
    setTimeout(() => {
      try {
        this.noiseNode?.stop();
        this.filterLFO?.stop();
        this.bowlOsc1?.stop();
        this.bowlOsc2?.stop();
        this.bowlOsc3?.stop();
      } catch {
        // already stopped
      }
      this.isPlaying = false;
    }, 1300);
  }

  public getStatus(): boolean {
    return this.isPlaying;
  }
}

export const mountainAudio = new MountainAudioService();
