import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GeekySoundService {
  private audioCtx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private initialized = false;

  /**
   * Initialize Audio Context.
   * MUST be called inside a user interaction (click) event handler
   * to bypass browser autoplay policies.
   */
  initAudio() {
    if (this.initialized) return;
    
    // Cross-browser support
    const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
    this.audioCtx = new AudioContextClass();
    
    // Master Volume Control (Safety first!)
    this.masterGain = this.audioCtx!.createGain();
    this.masterGain.gain.value = 0.2; // Keep it subtle
    this.masterGain.connect(this.audioCtx!.destination);
    
    this.initialized = true;
  }

  /**
   * Sound 1: Mechanical Switch
   * A short triangle wave with a sharp decay.
   */
  playTypeSound() {
    if (!this.audioCtx || !this.masterGain) return;
    const t = this.audioCtx.currentTime;
    
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'triangle'; 
    osc.frequency.setValueAtTime(600 + Math.random() * 200, t); // Pitch variance
    
    gain.gain.setValueAtTime(0.5, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.05); // Snap decay

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.05);
  }

  /**
   * Sound 2: 8-Bit Power Up
   * A square wave that slides up in pitch.
   */
  playRetroCoin() {
    if (!this.audioCtx || !this.masterGain) return;
    const t = this.audioCtx.currentTime;

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(440, t);
    osc.frequency.exponentialRampToValueAtTime(880, t + 0.1); // Slide up

    gain.gain.setValueAtTime(0.1, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.1);
  }

  /**
   * Sound 3: Procedural Explosion
   * White noise filtered through a Lowpass filter.
   */
  playExplosion() {
    if (!this.audioCtx || !this.masterGain) return;
    const duration = 0.5;
    const t = this.audioCtx.currentTime;
    
    // Generate White Noise Buffer
    const bufferSize = this.audioCtx.sampleRate * duration;
    const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.audioCtx.createBufferSource();
    noise.buffer = buffer;

    // Filter frequencies to sound "bassy" rather than "hissy"
    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1000;

    const gain = this.audioCtx.createGain();
    gain.gain.setValueAtTime(0.5, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start(t);
  }
}
