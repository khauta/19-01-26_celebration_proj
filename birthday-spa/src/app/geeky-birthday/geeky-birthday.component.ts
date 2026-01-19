import { Component, ElementRef, HostListener, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeekySoundService } from '../geeky-sound.service';

interface Particle {
  x: number; y: number;
  vx: number; vy: number; // Velocities
  alpha: number;          // Opacity
  color: string;
  size: number;
  type: 'binary' | 'symbol' | 'glitter' | 'svg';
  char?: string;          // For text particles
  path?: Path2D;          // For SVG particles
  life: number;           // Frames to live
  decay: number;          // Alpha decay rate
}

@Component({
  selector: 'app-geeky-birthday',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container" (click)="handleInteraction($event)">
      
      <div *ngIf="!audioUnlocked" class="click-to-start">
        <div class="blink">&gt; INITIALIZE SYSTEM_</div>
      </div>

      <canvas #canvas></canvas>

      <div *ngIf="audioUnlocked && !bootComplete" class="terminal-overlay">
        <div class="terminal-window">
          <div class="header">
             <span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span>
             <span class="title">usr/bin/life_compiler</span>
          </div>
          <div class="content">
            <p *ngFor="let log of logs" [innerHTML]="log"></p>
            <span class="cursor">_</span>
          </div>
        </div>
      </div>
      
      <div *ngIf="bootComplete" class="celebration-text">
        <h1 class="glitch" data-text="LEVEL UP!">LEVEL UP!</h1>
        <p class="subtitle">Compilation Successful. Happy Birthday Khauta John Maliehe Sofe Lijana.</p>
        <small class="hint">// Click to execute fireworks()</small>
        <div class="birthday-note" style="margin-top:20px; color:#8b949e; font-size:0.9rem;">
          [System Uptime: 31 Years]<br>
          Executing protocol: Celebration...
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; width: 100vw; height: 100vh; background: #0d1117; overflow: hidden; }
    .container { position: relative; width: 100%; height: 100%; cursor: crosshair; }
    canvas { position: absolute; top: 0; left: 0; display: block; }

    /* START SCREEN */
    .click-to-start {
      position: absolute; z-index: 50; width: 100%; height: 100%;
      display: flex; align-items: center; justify-content: center;
      background: #000; color: #3fb950; font-family: 'Courier New', monospace; font-size: 2rem;
    }
    .blink { animation: blink 1s infinite; }

    /* TERMINAL */
    .terminal-overlay {
      position: absolute; z-index: 20; width: 100%; height: 100%;
      background: rgba(13,17,23, 0.9);
      display: flex; align-items: center; justify-content: center;
    }
    .terminal-window {
      width: 600px; height: 400px; background: #161b22; 
      border: 1px solid #30363d; border-radius: 6px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
      display: flex; flex-direction: column; font-family: monospace;
    }
    .header {
      background: #21262d; padding: 10px; display: flex; align-items: center;
      border-bottom: 1px solid #30363d;
    }
    .dot { width: 12px; height: 12px; border-radius: 50%; margin-right: 6px; }
    .red { background: #ff5f56; } .yellow { background: #ffbd2e; } .green { background: #27c93f; }
    .title { margin-left: auto; margin-right: auto; color: #8b949e; font-size: 0.8rem; }
    .content { padding: 20px; color: #58a6ff; font-size: 1rem; line-height: 1.5; overflow-y: auto; }
    .cursor { animation: blink 1s step-end infinite; color: #3fb950; }

    /* CELEBRATION */
    .celebration-text {
      position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
      z-index: 10; text-align: center; pointer-events: none;
    }
    h1.glitch {
      font-size: 5rem; color: white; margin: 0; font-family: sans-serif; font-weight: 900;
      text-shadow: 3px 3px 0 #ff00ff, -3px -3px 0 #00ffff;
    }
    .subtitle { color: #8b949e; font-family: monospace; font-size: 1.2rem; }
    .hint { color: #30363d; font-family: monospace; margin-top: 20px; display: block; }
    .birthday-note { animation: fadeIn 2s ease-in; }

    @keyframes blink { 50% { opacity: 0; } }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  `]
})
export class GeekyBirthdayComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  
  // State
  ctx!: CanvasRenderingContext2D;
  width = 0; height = 0;
  particles: Particle[] = [];
  animationId = 0;
  
  // Logic
  audioUnlocked = false;
  bootComplete = false;
  
  // Data
  logs: string[] = [];
  logQueue = [
    'Loading <span style="color:#d2a8ff">Kernel v31.0.0</span>...', // 31st Birthday
    'Mounting file system: /dev/life...',
    'Scanning for <span style="color:#ff7b72">bugs</span>... 0 found (hopefully)',
    'Compiling <span style="color:#79c0ff">Wisdom.ts</span>...',
    'Optimizing happiness algorithms...',
    'Initializing <span style="color:#ffa657">Khauta.John.Maliehe.Sofe.Lijana</span> module...',
    '<span style="color:#3fb950">SUCCESS:</span> System Update Complete.'
  ];
  
  colors = ['#58a6ff', '#3fb950', '#d2a8ff', '#ff7b72', '#ffa657'];
  symbols = ['0', '1', '{ }', '&&', '||', '!=', '/>', '$$'];
  chipPath = new Path2D("M4 4h16v16H4z M2 8h2 M2 12h2 M2 16h2 M20 8h2 M20 12h2 M20 16h2 M8 2v2 M12 2v2 M16 2v2 M8 20v2 M12 20v2 M16 20v2");

  constructor(private sound: GeekySoundService) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.initCanvas();
    this.animate();
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.animationId);
  }

  // --- INTERACTION HANDLER ---
  handleInteraction(e: MouseEvent) {
    // 1. First Click: Unlock Audio & Start Boot
    if (!this.audioUnlocked) {
      this.sound.initAudio();
      this.audioUnlocked = true;
      this.runBootSequence();
      return;
    }
    
    // 2. Subsequent Clicks: Fireworks (Only if boot is done)
    if (this.bootComplete) {
      this.sound.playRetroCoin();
      this.spawnFireworks(e.clientX, e.clientY, 60);
    }
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    if (this.bootComplete) {
      // Create binary trail
      this.spawnParticles(e.clientX, e.clientY, 1, 'binary');
    }
  }

  @HostListener('window:resize')
  resize() {
    this.width = this.canvasRef.nativeElement.width = window.innerWidth;
    this.height = this.canvasRef.nativeElement.height = window.innerHeight;
  }

  // --- LOGIC: BOOT SEQUENCE ---
  runBootSequence() {
    let delay = 0;
    this.logQueue.forEach((msg, i) => {
      delay += Math.random() * 400 + 300;
      setTimeout(() => {
        this.logs.push(msg);
        this.sound.playTypeSound();
        
        // End of boot
        if (i === this.logQueue.length - 1) {
          setTimeout(() => {
            this.bootComplete = true;
            this.sound.playExplosion();
            this.spawnFireworks(this.width/2, this.height/2, 120);
          }, 800);
        }
      }, delay);
    });
  }

  // --- GRAPHICS: CANVAS SETUP ---
  initCanvas() {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d', { alpha: false })!; // Alpha false for performance
    this.resize();
  }

  // --- GRAPHICS: PARTICLE SYSTEM ---
  spawnParticles(x: number, y: number, count: number, type: Particle['type']) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 5 + 2;
      
      this.particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1,
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
        size: Math.random() * 14 + 10,
        type: type === 'binary' && Math.random() > 0.8 ? 'symbol' : type,
        char: type === 'binary' ? (Math.random() > 0.5 ? '0' : '1') : this.symbols[Math.floor(Math.random() * this.symbols.length)],
        path: this.chipPath,
        life: Math.random() * 100 + 60,
        decay: Math.random() * 0.015 + 0.005
      });
    }
  }

  spawnFireworks(x: number, y: number, count: number) {
    this.spawnParticles(x, y, count / 2, 'symbol'); // Math symbols
    this.spawnParticles(x, y, count / 4, 'glitter'); // Dots
    
    // Add heavy chips
    for(let i=0; i<6; i++) {
       this.particles.push({
         x, y,
         vx: (Math.random() - 0.5) * 15, vy: (Math.random() - 0.5) * 15,
         alpha: 1, color: '#ffd700', size: 1, type: 'svg',
         life: 150, decay: 0.01, path: this.chipPath
       });
    }
  }

  // --- THE PHYSICS LOOP ---
  animate() {
    // 1. Clear Screen with Fade (Trails)
    this.ctx.fillStyle = 'rgba(13, 17, 23, 0.25)';
    this.ctx.fillRect(0, 0, this.width, this.height);

    // 2. Update & Draw Particles
    this.particles.forEach((p, index) => {
      // Physics
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.05;  // Gravity
      p.vx *= 0.95;  // Air Friction
      p.vy *= 0.95;
      p.alpha -= p.decay;

      // Render
      this.ctx.globalAlpha = Math.max(0, p.alpha);
      this.ctx.fillStyle = p.color;

      if (p.type === 'symbol' || p.type === 'binary') {
        this.ctx.font = `bold ${p.size}px "Fira Code", monospace`;
        this.ctx.fillText(p.char!, p.x, p.y);
      } else if (p.type === 'svg' && p.path) {
        this.ctx.save();
        this.ctx.translate(p.x, p.y);
        this.ctx.scale(1.5, 1.5);
        this.ctx.strokeStyle = p.color;
        this.ctx.stroke(p.path);
        this.ctx.restore();
      } else {
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, 3, 0, Math.PI*2);
        this.ctx.fill();
      }

      // Cleanup
      if (p.alpha <= 0) this.particles.splice(index, 1);
    });

    this.ctx.globalAlpha = 1;
    this.animationId = requestAnimationFrame(() => this.animate());
  }
}
