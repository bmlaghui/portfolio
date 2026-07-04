import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="hero-section" id="home">
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>
      <div class="grid-overlay"></div>

      <div class="container hero-content">
        <div class="hero-grid">
          <div class="text-box reveal-left">
            <div class="hero-badge">
              <span class="pulse-dot"></span>
              {{ t.translate('hero.badge') }}
            </div>

            <h1
              class="hero-title"
              [class.phrase-entering]="phraseState() === 'enter'"
              [class.phrase-leaving]="phraseState() === 'exit'"
            >
              <span class="title-line">
                <span class="word-row">
                  @for (word of line1Words(); track $index) {
                    <span class="title-word" [style.--word-index]="$index">{{ word }}</span>
                  }
                </span>
              </span>
              <span class="title-line title-line-accent">
                <span class="word-row">
                  @for (word of line2Words(); track $index) {
                    <span class="title-word" [style.--word-index]="$index">{{ word }}</span>
                  }
                </span>
              </span>
            </h1>

            <p class="hero-lead" [innerHTML]="t.translate('hero.lead')"></p>

            <div class="hero-actions">
              <button class="btn-cyber" (click)="scrollTo('contact')">
                {{ t.translate('hero.action1') }}
              </button>
              <a class="btn-secondary" href="#projects" (click)="$event.preventDefault(); scrollTo('projects')">
                {{ t.translate('hero.action2') }}
                <span class="btn-icon" aria-hidden="true">→</span>
              </a>
            </div>
          </div>

          <div class="hero-graphic reveal-right" aria-label="Animation de code TypeScript">
            <div class="terminal-aura"></div>
            <div class="terminal-orbit orbit-one"></div>
            <div class="terminal-orbit orbit-two"></div>

            <div class="code-terminal">
              <div class="terminal-topbar">
                <div class="terminal-dots" aria-hidden="true">
                  <span class="red"></span>
                  <span class="yellow"></span>
                  <span class="green"></span>
                </div>
                <span class="terminal-project">portfolio / core</span>
                <span class="terminal-live"><i></i> LIVE CODING</span>
              </div>

              <div class="terminal-tabbar">
                <span class="terminal-tab">
                  <b>TS</b>
                  brahim.service.ts
                  <i>×</i>
                </span>
                <span class="terminal-plus">+</span>
              </div>

              <div class="terminal-body">
                <div class="line-numbers" aria-hidden="true">
                  <span>01</span><span>02</span><span>03</span><span>04</span>
                  <span>05</span><span>06</span><span>07</span><span>08</span>
                  <span>09</span><span>10</span><span>11</span><span>12</span>
                  <span>13</span><span>14</span>
                </div>
                <pre><code class="ts-code">{{ typedCode() }}<span class="cursor">▍</span></code></pre>
              </div>

              <div class="terminal-footer">
                <span><i class="status-ok"></i> TypeScript</span>
                <span class="terminal-branch">⑂ main</span>
                <span class="terminal-ready">✓ BUILD READY</span>
              </div>
            </div>

            <span class="floating-chip chip-stack">ANGULAR · NESTJS</span>
            <span class="floating-chip chip-cloud">CLOUD READY</span>
          </div>
        </div>
      </div>

      <div class="scroll-ind">
        <div class="mouse-icon"><div class="wheel"></div></div>
        <span class="scroll-txt">{{ t.translate('hero.scroll') }}</span>
      </div>
    </section>
  `,
  styles: [`
    .hero-section {
      position: relative;
      min-height: 100vh;
      display: flex;
      align-items: center;
      padding-top: 100px;
      overflow: hidden;
    }

    .blob {
      position: absolute;
      border-radius: 50%;
      filter: blur(120px);
      pointer-events: none;
      z-index: 0;
    }
    .blob-1 {
      width: 600px;
      height: 600px;
      top: -10%;
      right: -5%;
      background: var(--primary);
      opacity: .08;
      animation: float-blob 18s ease-in-out infinite alternate;
    }
    .blob-2 {
      width: 500px;
      height: 500px;
      bottom: -10%;
      left: -5%;
      background: var(--secondary);
      opacity: .06;
      animation: float-blob 22s ease-in-out infinite alternate-reverse;
    }
    @keyframes float-blob {
      to { transform: translate(60px, 40px) scale(1.1); }
    }

    .grid-overlay {
      position: absolute;
      inset: 0;
      z-index: 0;
      pointer-events: none;
      background-image:
        linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,.025) 1px, transparent 1px);
      background-size: 60px 60px;
      mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, #000 0%, transparent 100%);
    }

    .hero-content {
      position: relative;
      z-index: 5;
      width: 100%;
    }
    .hero-grid {
      display: grid;
      grid-template-columns: minmax(0, 1.05fr) minmax(440px, .95fr);
      gap: clamp(2.5rem, 5vw, 5rem);
      align-items: center;
    }
    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: .8rem;
      padding: .5rem 1.2rem;
      margin-bottom: 2rem;
      border: 1px solid var(--glass-border);
      border-radius: 100px;
      background: rgba(255,255,255,.03);
      color: var(--secondary);
      font-size: .65rem;
      font-weight: 800;
      letter-spacing: 3px;
    }
    .pulse-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--secondary);
      box-shadow: 0 0 12px var(--secondary);
      animation: pulse-glow 2s infinite;
    }
    .hero-title {
      position: relative;
      display: grid;
      grid-template-areas:
        "primary"
        "accent";
      grid-template-columns: minmax(0, 1fr);
      grid-template-rows: repeat(2, minmax(1.14em, auto));
      row-gap: .02em;
      min-height: 2.3em;
      margin-bottom: 2rem;
      font-size: clamp(2.6rem, 4vw, 3.55rem);
      font-weight: 800;
      line-height: 1.08;
      letter-spacing: -3px;
    }
    .title-line {
      position: relative;
      display: block !important;
      width: 100%;
      min-width: 0;
      min-height: 1.14em;
      overflow: visible;
      padding: .02em .05em .16em 0;
    }
    .title-line:first-child { grid-area: primary; }
    .title-line-accent { grid-area: accent; }
    .word-row {
      display: flex !important;
      width: 100%;
      min-height: 1.08em;
      align-items: baseline;
      flex-wrap: nowrap;
      gap: .23em;
      perspective: 700px;
    }
    .title-word {
      display: inline-block;
      transform-origin: 50% 100%;
      will-change: transform, opacity, filter;
    }
    .title-line-accent .title-word {
      color: #c084fc;
      background: var(--grad-primary);
      background-size: 220% auto;
      background-position: center;
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .phrase-entering .title-line .title-word {
      animation: word-rise-in .82s cubic-bezier(.16, 1, .3, 1) both;
      animation-delay: calc(var(--word-index) * 90ms);
    }
    .phrase-entering .title-line-accent .title-word {
      animation-name: word-fold-in;
      animation-delay: calc(140ms + var(--word-index) * 90ms);
    }
    .phrase-leaving .title-line .title-word {
      animation: word-scatter-out .56s cubic-bezier(.7, 0, .84, 0) both;
      animation-delay: calc(var(--word-index) * 42ms);
    }
    .phrase-leaving .title-line-accent .title-word {
      animation-name: word-collapse-out;
      animation-delay: calc(60ms + var(--word-index) * 42ms);
    }
    .hero-lead {
      max-width: 560px;
      margin-bottom: 3rem;
      color: var(--text-muted);
      font-size: 1.1rem;
      line-height: 1.7;
    }
    :host ::ng-deep .hero-lead strong { color: var(--text); }
    .hero-actions {
      display: flex;
      align-items: center;
      gap: 1.2rem;
      flex-wrap: wrap;
    }

    .hero-graphic {
      position: relative;
      min-width: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      perspective: 1200px;
    }
    .terminal-aura {
      position: absolute;
      width: 105%;
      height: 115%;
      border-radius: 50%;
      background:
        radial-gradient(circle at 65% 35%, rgba(34,211,238,.16), transparent 40%),
        radial-gradient(circle at 35% 65%, rgba(192,132,252,.22), transparent 52%);
      filter: blur(34px);
      animation: aura-breathe 5s ease-in-out infinite;
    }
    .terminal-orbit {
      position: absolute;
      border: 1px solid rgba(192,132,252,.11);
      border-radius: 50%;
      pointer-events: none;
    }
    .orbit-one {
      width: 112%;
      aspect-ratio: 1;
      border-style: dashed;
      animation: orbit-spin 35s linear infinite;
    }
    .orbit-two {
      width: 88%;
      aspect-ratio: 1;
      border-color: rgba(34,211,238,.08);
      animation: orbit-spin 28s linear infinite reverse;
    }

    .code-terminal {
      position: relative;
      z-index: 2;
      width: 100%;
      max-width: 560px;
      overflow: hidden;
      border: 1px solid rgba(192,132,252,.32);
      border-radius: 20px;
      background: rgba(7, 8, 17, .96);
      box-shadow:
        -25px 45px 100px rgba(0,0,0,.62),
        0 0 55px rgba(192,132,252,.1),
        inset 0 1px 0 rgba(255,255,255,.06);
      transform: rotateY(-5deg) rotateX(2deg);
      animation: terminal-float 7s ease-in-out infinite;
      transition: border-color .35s ease, box-shadow .35s ease;
    }
    .code-terminal:hover {
      border-color: rgba(34,211,238,.48);
      box-shadow:
        -20px 50px 110px rgba(0,0,0,.68),
        0 0 70px rgba(34,211,238,.14);
    }
    .terminal-topbar {
      height: 45px;
      padding: 0 1rem;
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      align-items: center;
      border-bottom: 1px solid rgba(255,255,255,.065);
      background: rgba(255,255,255,.025);
      font-family: 'Fira Code', 'Cascadia Code', monospace;
      font-size: .52rem;
      color: rgba(255,255,255,.36);
    }
    .terminal-dots { display: flex; gap: 6px; }
    .terminal-dots span {
      width: 9px;
      height: 9px;
      border-radius: 50%;
    }
    .red { background: #ff5f56; }
    .yellow { background: #ffbd2e; }
    .green { background: #27c93f; }
    .terminal-live {
      justify-self: end;
      display: flex;
      align-items: center;
      gap: .4rem;
      color: rgba(110,231,183,.7);
      font-weight: 700;
      letter-spacing: .08em;
    }
    .terminal-live i, .status-ok {
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background: #34d399;
      box-shadow: 0 0 8px #34d399;
      animation: pulse-glow 2s infinite;
    }
    .terminal-tabbar {
      height: 39px;
      padding-left: .8rem;
      display: flex;
      align-items: flex-end;
      gap: .55rem;
      border-bottom: 1px solid rgba(255,255,255,.055);
      background: rgba(255,255,255,.012);
    }
    .terminal-tab {
      height: 33px;
      min-width: 175px;
      padding: 0 .8rem;
      display: flex;
      align-items: center;
      gap: .5rem;
      border-top: 1px solid rgba(192,132,252,.35);
      background: rgba(192,132,252,.07);
      color: rgba(255,255,255,.68);
      font-family: 'Fira Code', 'Cascadia Code', monospace;
      font-size: .58rem;
    }
    .terminal-tab b { color: #60a5fa; font-size: .5rem; }
    .terminal-tab i { margin-left: auto; color: rgba(255,255,255,.25); font-style: normal; }
    .terminal-plus { align-self: center; color: rgba(255,255,255,.3); font-size: .8rem; }
    .terminal-body {
      min-height: 342px;
      padding: 1.35rem 1.1rem .9rem;
      display: grid;
      grid-template-columns: 26px minmax(0, 1fr);
      background:
        linear-gradient(90deg, rgba(192,132,252,.035), transparent 22%),
        radial-gradient(circle at 80% 20%, rgba(34,211,238,.035), transparent 36%);
      font-family: 'Fira Code', 'Cascadia Code', monospace;
      font-size: clamp(.7rem, 1vw, .82rem);
      line-height: 1.72;
    }
    .line-numbers {
      display: flex;
      flex-direction: column;
      color: rgba(255,255,255,.16);
      user-select: none;
      font-size: .65rem;
      line-height: 2.17;
    }
    pre { margin: 0; min-width: 0; }
    .ts-code {
      color: #b8c0dd;
      white-space: pre-wrap;
      overflow-wrap: anywhere;
      text-shadow: 0 0 18px rgba(165,180,252,.08);
    }
    .cursor {
      color: #c084fc;
      text-shadow: 0 0 10px #c084fc;
      animation: blink .85s step-end infinite;
    }
    .terminal-footer {
      height: 32px;
      padding: 0 .9rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      border-top: 1px solid rgba(255,255,255,.06);
      background: linear-gradient(90deg, rgba(192,132,252,.09), rgba(34,211,238,.045));
      color: rgba(255,255,255,.4);
      font-family: 'Fira Code', 'Cascadia Code', monospace;
      font-size: .47rem;
      letter-spacing: .06em;
    }
    .terminal-footer span { display: flex; align-items: center; gap: .35rem; }
    .terminal-ready { margin-left: auto; color: rgba(110,231,183,.72); }
    .floating-chip {
      position: absolute;
      z-index: 3;
      padding: .45rem .7rem;
      border: 1px solid rgba(255,255,255,.1);
      border-radius: 8px;
      background: rgba(10,11,23,.88);
      box-shadow: 0 12px 30px rgba(0,0,0,.35);
      color: rgba(255,255,255,.54);
      backdrop-filter: blur(8px);
      font-family: 'Fira Code', 'Cascadia Code', monospace;
      font-size: .46rem;
      font-weight: 700;
      letter-spacing: .1em;
    }
    .chip-stack { top: 5%; right: -2%; animation: chip-float 4s ease-in-out infinite; }
    .chip-cloud { bottom: 8%; left: -4%; animation: chip-float 4.7s ease-in-out infinite reverse; }

    @keyframes terminal-float {
      0%, 100% { transform: rotateY(-5deg) rotateX(2deg) translateY(0); }
      50% { transform: rotateY(-2deg) rotateX(0) translateY(-12px); }
    }
    @keyframes aura-breathe {
      50% { opacity: .7; transform: scale(1.08); }
    }
    @keyframes orbit-spin { to { transform: rotate(360deg); } }
    @keyframes chip-float { 50% { transform: translateY(-10px); } }
    @keyframes blink { 50% { opacity: 0; } }
    @keyframes word-rise-in {
      0% {
        opacity: 0;
        filter: blur(12px);
        transform: translate3d(0, 110%, -80px) rotateX(-72deg) scale(.88);
      }
      65% { opacity: 1; filter: blur(1px); }
      100% {
        opacity: 1;
        filter: blur(0);
        transform: translate3d(0, 0, 0) rotateX(0) scale(1);
      }
    }
    @keyframes word-fold-in {
      0% {
        opacity: 0;
        filter: blur(14px);
        transform: translate3d(0, -105%, -100px) rotateX(78deg) scale(.9);
      }
      100% {
        opacity: 1;
        filter: blur(0);
        transform: translate3d(0, 0, 0) rotateX(0) scale(1);
      }
    }
    @keyframes word-scatter-out {
      0% { opacity: 1; filter: blur(0); transform: translateX(0); }
      100% {
        opacity: 0;
        filter: blur(9px);
        transform: translate3d(24px, -75%, -60px) rotateX(48deg) scale(.92);
      }
    }
    @keyframes word-collapse-out {
      0% { opacity: 1; filter: blur(0); transform: translate3d(0, 0, 0); }
      100% {
        opacity: 0;
        filter: blur(10px);
        transform: translate3d(-20px, 80%, -70px) rotateX(-55deg) scale(.9);
      }
    }
    .scroll-ind {
      position: absolute;
      bottom: clamp(3.5rem, 6vh, 5.5rem);
      left: 50%;
      z-index: 5;
      transform: translateX(-50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: .8rem;
    }
    .mouse-icon {
      width: 22px;
      height: 36px;
      padding-top: 5px;
      display: flex;
      justify-content: center;
      border: 2px solid rgba(255,255,255,.2);
      border-radius: 12px;
    }
    .wheel {
      width: 3px;
      height: 7px;
      border-radius: 2px;
      background: var(--primary);
      animation: scroll-wheel 1.8s ease infinite;
    }
    .scroll-txt {
      color: var(--text-muted);
      opacity: .4;
      font-size: .5rem;
      font-weight: 900;
      letter-spacing: 3px;
    }
    @keyframes scroll-wheel {
      80%, 100% { opacity: 0; transform: translateY(10px); }
    }

    @media (max-width: 1100px) {
      .hero-section { padding-block: 130px 6rem; }
      .hero-grid {
        grid-template-columns: 1fr;
        gap: 4.5rem;
        text-align: center;
      }
      .hero-badge, .hero-lead { margin-inline: auto; }
      .hero-actions { justify-content: center; }
      .word-row { justify-content: center; }
      .hero-graphic { width: min(100%, 600px); margin-inline: auto; }
      .code-terminal { transform: none; }
      .code-terminal:hover { transform: translateY(-4px); }
    }

    @media (max-width: 768px) {
      .hero-section { min-height: auto; padding: 110px 0 4.5rem; }
      .hero-grid { gap: 3.2rem; }
      .hero-title {
        font-size: clamp(2rem, 8.8vw, 2.7rem);
        letter-spacing: -2px;
      }
      .hero-lead { margin-bottom: 2rem; font-size: .95rem; }
      .hero-actions { flex-direction: column; }
      .hero-actions button, .hero-actions a {
        width: 100%;
        justify-content: center;
        text-align: center;
      }
      .code-terminal { border-radius: 15px; }
      .terminal-topbar {
        grid-template-columns: 1fr 1fr;
        padding-inline: .75rem;
      }
      .terminal-project { display: none; }
      .terminal-body {
        min-height: 300px;
        padding: 1rem .65rem .8rem;
        grid-template-columns: 23px minmax(0, 1fr);
        font-size: clamp(.58rem, 2.55vw, .7rem);
        line-height: 1.68;
      }
      .line-numbers { font-size: .54rem; line-height: 2.17; }
      .floating-chip { display: none; }
      .terminal-orbit { opacity: .55; }
      .terminal-branch { display: none !important; }
      .scroll-ind { display: none; }
    }

    @media (max-width: 390px) {
      .terminal-body { min-height: 275px; font-size: .55rem; }
      .terminal-tab { min-width: 158px; }
      .terminal-footer { gap: .5rem; padding-inline: .6rem; }
    }

    @media (prefers-reduced-motion: reduce) {
      .blob, .pulse-dot, .terminal-live i, .terminal-aura, .terminal-orbit,
      .code-terminal, .floating-chip, .cursor, .wheel,
      .title-word { animation: none !important; }
      .code-terminal, .code-terminal:hover { transform: none; }
      .title-word { opacity: 1; filter: none; transform: none; }
    }
  `]
})
export class HeroComponent implements OnInit, OnDestroy {
  t = inject(TranslationService);
  typedCode = signal('');
  phraseState = signal<'enter' | 'exit'>('enter');
  phraseIndex = signal(0);
  phrases = computed(() => this.t.translate('hero.statements') as Array<{ line1: string; line2: string }>);
  activePhrase = computed(() => this.phrases()[this.phraseIndex()] ?? this.phrases()[0]);
  line1Words = computed(() => this.activePhrase().line1.split(' '));
  line2Words = computed(() => this.activePhrase().line2.split(' '));

  private typingTimer?: ReturnType<typeof setTimeout>;
  private phraseTimer?: ReturnType<typeof setTimeout>;
  private characterIndex = 0;

  private readonly fullCode =
`type Product = {
  vision: "ambitious";
  experience: "seamless";
};

const brahim = new TechLead({
  stack: ["Angular", "Symfony", "NestJS"],
  mindset: "product-first",
});

brahim.architect()
  .build()
  .scale()
  .ship({ cloud: true });`;

  ngOnInit() {
    const reduceMotion =
      typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion) {
      this.typedCode.set(this.fullCode);
      return;
    }

    this.typeNextCharacter();
    this.scheduleNextPhrase();
  }

  ngOnDestroy() {
    clearTimeout(this.typingTimer);
    clearTimeout(this.phraseTimer);
  }

  private typeNextCharacter() {
    if (this.characterIndex < this.fullCode.length) {
      this.typedCode.update(value => value + this.fullCode[this.characterIndex++]);
      this.typingTimer = setTimeout(() => this.typeNextCharacter(), 24 + Math.random() * 34);
      return;
    }

    this.typingTimer = setTimeout(() => {
      this.typedCode.set('');
      this.characterIndex = 0;
      this.typeNextCharacter();
    }, 3200);
  }

  private scheduleNextPhrase() {
    this.phraseTimer = setTimeout(() => {
      this.phraseState.set('exit');

      this.phraseTimer = setTimeout(() => {
        this.phraseIndex.update(index => (index + 1) % this.phrases().length);
        this.phraseState.set('enter');
        this.scheduleNextPhrase();
      }, 720);
    }, 3900);
  }

  scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }
}
