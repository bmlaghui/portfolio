import { Component, signal, OnInit, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="hero-section" id="home">
      <!-- Floating mesh blobs -->
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>
      <!-- Subtle grid overlay -->
      <div class="grid-overlay"></div>

      <div class="container hero-content">
        <div class="hero-grid">

          <!-- ─── Left: Text ─── -->
          <div class="text-box reveal-left">
            <div class="hero-badge">
              <span class="pulse-dot"></span>
              {{ t.translate('hero.badge') }}
            </div>

            <h1 class="hero-title">
              {{ t.translate('hero.title') }}<br>
              <span class="gradient-text type-effect">{{ currentRole() }}</span>
            </h1>

            <p class="hero-lead" [innerHTML]="t.translate('hero.lead')"></p>

            <div class="hero-actions">
              <button class="btn-cyber" (click)="scrollTo('contact')">{{ t.translate('hero.action1') }}</button>
              <a class="btn-secondary" href="#projects" (click)="$event.preventDefault(); scrollTo('projects')">
                {{ t.translate('hero.action2') }}
                <span class="btn-icon" aria-hidden="true">→</span>
              </a>
            </div>

            <div class="tech-stack-mini">
              <span>#ANGULAR</span>
              <span>#NESTJS</span>
              <span>#SYMFONY</span>
              <span>#POSTGRESQL</span>
              <span>#DOCKER</span>
            </div>
          </div>

          <!-- ─── Right: Code Terminal ─── -->
          <div class="hero-graphic reveal-right">
            <div class="terminal-glow"></div>
            <div class="code-terminal float-3d-anim">
              <div class="terminal-header">
                <div class="terminal-dots">
                  <span class="red"></span>
                  <span class="yellow"></span>
                  <span class="green"></span>
                </div>
                <span class="terminal-title">brahim.service.ts</span>
              </div>
              <div class="terminal-body">
                <pre><code class="ts-code"><span>{{ typedCode() }}</span><span class="cursor">|</span></code></pre>
              </div>
            </div>
          </div>

        </div>
      </div>

      <!-- Scroll indicator -->
      <div class="scroll-ind">
        <div class="mouse-icon"><div class="wheel"></div></div>
        <span class="scroll-txt">{{ t.translate('hero.scroll') }}</span>
      </div>
    </section>
  `,
  styles: [`
    /* ─── Section Shell ─── */
    .hero-section {
      position: relative;
      min-height: 100vh;
      display: flex;
      align-items: center;
      padding-top: 100px; /* clear navbar */
    }

    /* ─── Background blobs ─── */
    .blob {
      position: absolute;
      border-radius: 50%;
      filter: blur(120px);
      pointer-events: none;
      z-index: 0;
    }
    .blob-1 {
      width: 600px; height: 600px;
      background: var(--primary);
      opacity: 0.07;
      top: -10%; right: -5%;
      animation: float-blob 18s ease-in-out infinite alternate;
    }
    .blob-2 {
      width: 500px; height: 500px;
      background: var(--secondary);
      opacity: 0.06;
      bottom: -10%; left: -5%;
      animation: float-blob 22s ease-in-out infinite alternate-reverse;
    }
    @keyframes float-blob {
      0%   { transform: translate(0, 0) scale(1); }
      100% { transform: translate(60px, 40px) scale(1.1); }
    }

    /* ─── Grid overlay ─── */
    .grid-overlay {
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
      background-size: 60px 60px;
      mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 0%, transparent 100%);
      z-index: 0;
    }

    /* ─── Content ─── */
    .hero-content {
      position: relative;
      z-index: 5;
      width: 100%;
    }

    /* ─── 2-col grid ─── */
    .hero-grid {
      display: grid;
      grid-template-columns: 1.1fr 0.9fr;
      gap: 4rem;
      align-items: center;
    }

    /* ─── Badge ─── */
    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.8rem;
      padding: 0.5rem 1.2rem;
      background: rgba(255,255,255,0.03);
      border: 1px solid var(--glass-border);
      border-radius: 100px;
      font-size: 0.65rem;
      font-weight: 800;
      letter-spacing: 3px;
      margin-bottom: 2rem;
      color: var(--secondary);
    }
    .pulse-dot {
      width: 6px; height: 6px;
      background: var(--secondary);
      border-radius: 50%;
      box-shadow: 0 0 12px var(--secondary);
      animation: pulse-glow 2s infinite;
    }

    /* ─── Title ─── */
    .hero-title {
      font-size: clamp(2.8rem, 5.5vw, 5.5rem);
      line-height: 1;
      margin-bottom: 2rem;
      letter-spacing: -3px;
      font-weight: 800;
    }

    /* ─── Lead ─── */
    .hero-lead {
      font-size: 1.1rem;
      color: var(--text-muted);
      margin-bottom: 3rem;
      max-width: 540px;
      line-height: 1.7;
    }
    :host ::ng-deep .hero-lead strong { color: var(--text); }

    /* ─── Actions ─── */
    .hero-actions {
      display: flex;
      gap: 1.2rem;
      align-items: center;
      flex-wrap: wrap;
    }

    /* ─── Tech stack ─── */
    .tech-stack-mini {
      margin-top: 3.5rem;
      display: flex;
      gap: 1.5rem;
      flex-wrap: wrap;
      opacity: 0.35;
      font-size: 0.6rem;
      font-weight: 900;
      letter-spacing: 2px;
    }

    /* ─── Terminal ─── */
    .hero-graphic {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .terminal-glow {
      position: absolute;
      inset: -10%;
      background: radial-gradient(circle, rgba(192,132,252,0.12) 0%, transparent 70%);
      filter: blur(30px);
      z-index: 0;
      pointer-events: none;
    }
    .code-terminal {
      position: relative;
      z-index: 2;
      width: 100%;
      max-width: 480px;
      border-radius: 14px;
      overflow: hidden;
      background: rgba(8, 9, 18, 0.92);
      border: 1px solid var(--glass-border);
      box-shadow: 0 40px 80px rgba(0,0,0,0.6);
    }
    .float-3d-anim {
      animation: float-3d-terminal 8s ease-in-out infinite;
    }
    @keyframes float-3d-terminal {
      0% {
        transform: perspective(1000px) rotateX(6deg) rotateY(-8deg) translateY(0) translateZ(0);
        box-shadow: -20px 40px 80px rgba(0,0,0,0.7), 0 0 40px rgba(192, 132, 252, 0.1);
      }
      50% {
        transform: perspective(1000px) rotateX(-4deg) rotateY(12deg) translateY(-25px) translateZ(30px);
        box-shadow: -30px 50px 100px rgba(0,0,0,0.8), 0 0 60px rgba(34, 211, 238, 0.2);
        border-color: rgba(34, 211, 238, 0.4);
      }
      100% {
        transform: perspective(1000px) rotateX(6deg) rotateY(-8deg) translateY(0) translateZ(0);
        box-shadow: -20px 40px 80px rgba(0,0,0,0.7), 0 0 40px rgba(192, 132, 252, 0.1);
      }
    }
    .terminal-header {
      background: rgba(255,255,255,0.03);
      padding: 0.75rem 1.2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid var(--glass-border);
    }
    .terminal-dots { display: flex; gap: 6px; }
    .terminal-dots span { width: 10px; height: 10px; border-radius: 50%; }
    .red    { background: #ff5f56; }
    .yellow { background: #ffbd2e; }
    .green  { background: #27c93f; }
    .terminal-title {
      font-size: 0.58rem;
      font-weight: 700;
      color: var(--text-muted);
      letter-spacing: 1px;
    }
    .terminal-body {
      padding: 1.4rem 1.6rem;
      font-family: 'Fira Code', 'Cascadia Code', monospace;
      font-size: 0.82rem;
      line-height: 1.65;
      min-height: 250px;
    }
    pre { margin: 0; }
    .ts-code { color: #a9b1d6; white-space: pre-wrap; }
    .token-kw   { color: #c084fc; font-weight: 600; }
    .token-str  { color: #22d3ee; }
    .token-type { color: #f472b6; }
    .token-func { color: #4ade80; }
    .cursor { color: var(--primary); animation: blink 1s step-end infinite; }
    @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0; } }

    /* ─── Scroll indicator ─── */
    .scroll-ind {
      position: absolute;
      bottom: 2.5rem; left: 50%;
      transform: translateX(-50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.8rem;
      z-index: 5;
    }
    .mouse-icon {
      width: 22px; height: 36px;
      border: 2px solid rgba(255,255,255,0.2);
      border-radius: 12px;
      display: flex;
      justify-content: center;
      padding-top: 5px;
    }
    .wheel {
      width: 3px; height: 7px;
      background: var(--primary);
      border-radius: 2px;
      animation: scroll-wheel 1.8s ease infinite;
    }
    @keyframes scroll-wheel {
      0%   { opacity: 1; transform: translateY(0); }
      80%  { opacity: 0; transform: translateY(10px); }
      100% { opacity: 0; }
    }
    .scroll-txt {
      font-size: 0.5rem;
      font-weight: 900;
      letter-spacing: 3px;
      color: var(--text-muted);
      opacity: 0.4;
    }

    /* ─── Tablet (≤ 1100px) ─── */
    @media (max-width: 1100px) {
      .hero-grid {
        grid-template-columns: 1fr;
        gap: 3rem;
        text-align: center;
        padding-bottom: 4rem;
      }
      .hero-badge  { margin-inline: auto; }
      .hero-lead   { margin-inline: auto; }
      .hero-actions { justify-content: center; }
      .tech-stack-mini { justify-content: center; }
      /* put terminal above text on tablet */
      .hero-graphic { order: -1; }
      .code-terminal { max-width: 440px; }
    }

    /* ─── Mobile (≤ 768px) ─── */
    @media (max-width: 768px) {
      .hero-section { min-height: auto; padding: 110px 0 4rem; }
      .hero-title { font-size: 2.5rem; letter-spacing: -2px; }
      .hero-lead   { font-size: 0.95rem; margin-bottom: 2rem; }
      .hero-actions { flex-direction: column; }
      .hero-actions button,
      .hero-actions a { width: 100%; text-align: center; justify-content: center; }
      .code-terminal { display: none; } /* too cramped on small screens */
      .tech-stack-mini { gap: 1rem; margin-top: 2.25rem; }
      .scroll-ind { display: none; }
    }
  `]
})
export class HeroComponent implements OnInit {
  t = inject(TranslationService);

  roles = computed(() => this.t.translate('hero.roles') as string[]);
  currentRole = signal('');

  fullCode =
`interface Engineer {
  name: "Brahim MLAGHUI";
  role: "Technical Lead";
  stack: ["Angular", "Symfony", "NestJS"];
}

const buildSystem = (vision: string) => {
  return System.design(vision)
    .deploy.toCloud();
};`;

  typedCode = signal('');

  ngOnInit() {
    this.currentRole.set(this.roles()[0]);

    // Rotate roles every 3 s
    let idx = 0;
    setInterval(() => {
      const arr = this.roles();
      idx = (idx + 1) % arr.length;
      this.currentRole.set(arr[idx]);
    }, 3000);

    // Typing animation
    let ci = 0;
    const type = () => {
      if (ci < this.fullCode.length) {
        this.typedCode.update(v => v + this.fullCode[ci++]);
        setTimeout(type, 28 + Math.random() * 45);
      } else {
        setTimeout(() => { this.typedCode.set(''); ci = 0; type(); }, 2800);
      }
    };
    type();
  }

  scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }
}
