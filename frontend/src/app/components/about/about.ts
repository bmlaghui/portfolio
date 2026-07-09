import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { SkillsService, Skill } from '../../services/skills.service';
import { TranslationService } from '../../services/translation.service';

interface Stat {
  label: string;
  target: number;
  suffix: string;
  current: number;
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="about-section" id="about">
      <span class="section-watermark" aria-hidden="true">01</span>

      <div class="container">
        <header class="about-header reveal">
          <div class="sec-label">
            <span class="dash"></span>
            <span class="num">01</span>
            <span class="word">{{ t.translate('about.label') }}</span>
          </div>

          <div class="headline-grid">
            <h2 class="sec-title">
              {{ t.translate('about.title') }}<br>
              <span class="gradient-text">{{ t.translate('about.titleSub') }}</span>
            </h2>
            <p class="headline-note">
              {{ t.currentLang() === 'fr'
                ? 'Transformer une vision produit en systèmes fiables, lisibles et capables d’évoluer.'
                : 'Turning product vision into reliable, readable systems built to evolve.' }}
            </p>
          </div>
        </header>

        <div class="story-grid">
          <div class="visual-col reveal-left">
            <figure class="portrait-card">
              <div class="portrait-top">
                <span>BRAHIM_MLAGHUI.JPG</span>
                <span class="live-status"><i></i>{{ t.currentLang() === 'fr' ? 'DISPONIBLE' : 'AVAILABLE' }}</span>
              </div>
              <div class="portrait-wrap">
                <img src="philosophy.png"
                     [alt]="t.currentLang() === 'fr' ? 'Portrait de Brahim MLAGHUI' : 'Portrait of Brahim MLAGHUI'"
                     class="portrait">
                <div class="portrait-overlay"></div>
                <div class="portrait-caption">
                  <span>TECHNICAL LEAD</span>
                  <strong>Angular × Symfony</strong>
                </div>
              </div>
            </figure>

            <div class="experience-card">
              <span class="experience-value">{{ stats[0].current }}+</span>
              <span class="experience-copy">{{ t.translate('about.yearExp') }}</span>
              <span class="experience-line"></span>
            </div>

            <div class="signature-card">
              <span class="signature-mark">BM</span>
              <span>{{ t.currentLang() === 'fr' ? 'Concevoir. Simplifier. Transmettre.' : 'Design. Simplify. Empower.' }}</span>
            </div>
          </div>

          <div class="content-col reveal-right">
            <div class="expertise-line">
              <span>ENGINEERING</span><i></i><span>PRODUCT</span><i></i><span>LEADERSHIP</span>
            </div>

            <blockquote class="manifesto">
              “{{ t.translate('about.manifesto') }}”
            </blockquote>

            <div class="bio-grid">
              <p>{{ t.translate('about.bio1') }}</p>
              <p>{{ t.translate('about.bio2') }}</p>
            </div>

            <div class="principles">
              <article>
                <span>01</span>
                <div>
                  <h3>{{ t.currentLang() === 'fr' ? 'Architecture utile' : 'Useful architecture' }}</h3>
                  <p>{{ t.currentLang() === 'fr' ? 'La juste structure, au service du produit.' : 'The right structure, serving the product.' }}</p>
                </div>
              </article>
              <article>
                <span>02</span>
                <div>
                  <h3>{{ t.currentLang() === 'fr' ? 'Exécution exigeante' : 'Deliberate execution' }}</h3>
                  <p>{{ t.currentLang() === 'fr' ? 'Qualité, performance et livraison continue.' : 'Quality, performance, and continuous delivery.' }}</p>
                </div>
              </article>
              <article>
                <span>03</span>
                <div>
                  <h3>{{ t.currentLang() === 'fr' ? 'Transmission' : 'Empowerment' }}</h3>
                  <p>{{ t.currentLang() === 'fr' ? 'Faire grandir le système et l’équipe.' : 'Growing both the system and the team.' }}</p>
                </div>
              </article>
            </div>

            <div class="about-cta">
              <button class="btn-cyber" type="button" (click)="scrollTo('contact')">
                {{ t.translate('about.cta1') }}
              </button>
              <a class="btn-secondary" href="/cv">
                {{ t.currentLang() === 'fr' ? 'Voir mon CV dynamique' : 'View my live resume' }}
                <span class="btn-icon" aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </div>

        <div class="proof-bar reveal" (mouseenter)="animateStats()">
          <div class="proof-stat" *ngFor="let stat of stats">
            <strong>{{ stat.suffix === '∞' ? '∞' : stat.current + stat.suffix }}</strong>
            <span>{{ statLabel(stat.label) }}</span>
          </div>
        </div>

        <div class="stack-showcase reveal">
          <header class="stack-heading">
            <div>
              <span class="stack-kicker">STACK / EXPERTISE</span>
              <h3>{{ t.currentLang() === 'fr' ? 'Mon terrain de jeu technique.' : 'My technical playground.' }}</h3>
            </div>
            <p>{{ t.currentLang() === 'fr'
              ? 'Des technologies choisies pour résoudre un problème, construire durablement et livrer avec confiance.'
              : 'Technologies selected to solve real problems, build sustainably, and ship with confidence.' }}</p>
          </header>

          <div class="stack-list">
            <article class="stack-row" *ngFor="let group of skills; let index = index">
              <span class="stack-index">{{ (index + 1).toString().padStart(2, '0') }}</span>
              <div class="stack-category">
                <strong>{{ categoryLabel(group.label) }}</strong>
                <small>{{ group.items.length }} {{ t.currentLang() === 'fr' ? 'outils' : 'tools' }}</small>
              </div>
              <div class="stack-items">
                <span *ngFor="let skill of group.items | slice:0:7">{{ skill }}</span>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .about-section {
      position: relative;
      padding: 9rem 0;
      overflow: hidden;
      border-block: 1px solid rgba(255,255,255,.045);
      background: linear-gradient(180deg, transparent, rgba(192,132,252,.025) 45%, transparent);
    }

    .section-watermark {
      position: absolute;
      top: 4rem;
      right: max(2rem, calc((100vw - 1300px) / 2));
      font: 800 clamp(8rem, 18vw, 18rem)/1 var(--font-title);
      color: transparent;
      -webkit-text-stroke: 1px rgba(255,255,255,.035);
      user-select: none;
    }

    .about-header {
      position: relative;
      z-index: 2;
      margin-bottom: 5rem;
    }

    .sec-label {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 2rem;
    }
    .dash { width: 40px; height: 1px; background: var(--primary); box-shadow: 0 0 8px var(--primary); }
    .num { color: var(--secondary); font-size: .65rem; font-weight: 900; letter-spacing: 3px; }
    .word { color: var(--text-muted); font-size: .65rem; font-weight: 900; letter-spacing: 4px; text-transform: uppercase; }

    .headline-grid {
      display: grid;
      grid-template-columns: minmax(0, 1.55fr) minmax(280px, .65fr);
      gap: 5rem;
      align-items: end;
    }

    .sec-title {
      max-width: 850px;
      margin: 0;
      font-size: clamp(3.2rem, 6vw, 6.5rem);
      line-height: .92;
      letter-spacing: -.055em;
    }

    .headline-note {
      max-width: 380px;
      margin: 0 0 .5rem;
      padding-left: 1.5rem;
      border-left: 1px solid var(--primary);
      color: var(--text-muted);
      font-size: 1rem;
      line-height: 1.75;
    }

    .story-grid {
      position: relative;
      z-index: 2;
      display: grid;
      grid-template-columns: minmax(340px, .82fr) minmax(0, 1.18fr);
      gap: clamp(4rem, 8vw, 8rem);
      align-items: center;
    }

    .visual-col {
      position: relative;
      max-width: 500px;
    }

    .portrait-card {
      position: relative;
      margin: 0;
      padding: 8px;
      border: 1px solid var(--glass-border);
      border-radius: 28px;
      background: rgba(8,9,16,.82);
      box-shadow: 0 45px 100px rgba(0,0,0,.45);
    }

    .portrait-top {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      padding: .65rem .8rem .85rem;
      color: #657086;
      font: 700 .55rem/1 'Fira Code', monospace;
      letter-spacing: .12em;
    }

    .live-status { display: flex; align-items: center; gap: .45rem; color: #4ade80; }
    .live-status i {
      width: 6px; height: 6px;
      border-radius: 50%;
      background: #4ade80;
      box-shadow: 0 0 10px #4ade80;
    }

    .portrait-wrap {
      position: relative;
      overflow: hidden;
      min-height: 520px;
      border-radius: 21px;
      background: #0d0d16;
    }

    .portrait {
      width: 100%;
      height: 100%;
      min-height: 520px;
      display: block;
      object-fit: cover;
      filter: saturate(.85) contrast(1.04);
      transition: transform .8s cubic-bezier(.2,.8,.2,1), filter .5s ease;
    }
    .portrait-card:hover .portrait { transform: scale(1.035); filter: saturate(1) contrast(1.04); }

    .portrait-overlay {
      position: absolute;
      inset: 0;
      background:
        linear-gradient(to top, rgba(5,5,8,.94), transparent 46%),
        linear-gradient(135deg, rgba(192,132,252,.12), transparent 42%);
    }

    .portrait-caption {
      position: absolute;
      left: 1.6rem;
      right: 1.6rem;
      bottom: 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: end;
      gap: 1rem;
    }
    .portrait-caption span { color: var(--secondary); font-size: .58rem; font-weight: 900; letter-spacing: .2em; }
    .portrait-caption strong { color: #fff; font-size: .86rem; }

    .experience-card {
      position: absolute;
      right: -3rem;
      top: 18%;
      width: 150px;
      padding: 1.4rem;
      border: 1px solid rgba(192,132,252,.32);
      border-radius: 18px;
      background: rgba(9,9,16,.9);
      backdrop-filter: blur(22px);
      box-shadow: 0 22px 55px rgba(0,0,0,.38);
    }
    .experience-value { display: block; color: var(--primary); font: 800 2.6rem/1 var(--font-title); }
    .experience-copy { display: block; margin-top: .5rem; color: var(--text-muted); font-size: .6rem; font-weight: 800; letter-spacing: .14em; text-transform: uppercase; }
    .experience-line { display: block; width: 32px; height: 2px; margin-top: 1rem; background: var(--secondary); }

    .signature-card {
      position: absolute;
      left: -2rem;
      bottom: 4rem;
      display: flex;
      align-items: center;
      gap: .8rem;
      max-width: 235px;
      padding: .8rem 1rem;
      border: 1px solid var(--glass-border);
      border-radius: 14px;
      color: var(--text-muted);
      background: rgba(9,9,16,.88);
      backdrop-filter: blur(18px);
      font-size: .68rem;
      font-weight: 700;
    }
    .signature-mark {
      display: grid;
      place-items: center;
      width: 34px; height: 34px;
      flex: 0 0 34px;
      border-radius: 10px;
      color: #fff;
      background: var(--grad-primary);
      font: 800 .7rem var(--font-title);
    }

    .expertise-line {
      display: flex;
      align-items: center;
      gap: .75rem;
      margin-bottom: 2rem;
      color: var(--secondary);
      font-size: .58rem;
      font-weight: 900;
      letter-spacing: .18em;
    }
    .expertise-line i { width: 4px; height: 4px; border-radius: 50%; background: var(--primary); }

    .manifesto {
      max-width: 720px;
      margin: 0 0 2.5rem;
      color: var(--text);
      font: 500 clamp(1.65rem, 2.6vw, 2.65rem)/1.25 var(--font-title);
      letter-spacing: -.025em;
    }

    .bio-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      margin-bottom: 2.5rem;
    }
    .bio-grid p { margin: 0; color: var(--text-muted); font-size: .94rem; line-height: 1.8; }

    .principles {
      display: grid;
      gap: .65rem;
      margin-bottom: 2.5rem;
    }
    .principles article {
      display: grid;
      grid-template-columns: 42px 1fr;
      gap: 1rem;
      padding: 1rem 1.15rem;
      border: 1px solid transparent;
      border-radius: 14px;
      transition: .3s ease;
    }
    .principles article:hover {
      border-color: var(--glass-border);
      background: rgba(255,255,255,.025);
      transform: translateX(5px);
    }
    .principles article > span { color: var(--primary); font: 800 .65rem var(--font-title); letter-spacing: .12em; }
    .principles h3 { margin: 0 0 .2rem; font-size: 1rem; letter-spacing: -.01em; }
    .principles p { margin: 0; color: var(--text-muted); font-size: .78rem; }

    .about-cta { display: flex; gap: 1rem; align-items: center; flex-wrap: wrap; }

    .proof-bar {
      position: relative;
      z-index: 2;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      margin-top: 6rem;
      border-block: 1px solid var(--glass-border);
    }
    .proof-stat {
      min-height: 150px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 1.75rem;
      border-right: 1px solid var(--glass-border);
    }
    .proof-stat:last-child { border-right: 0; }
    .proof-stat strong { color: var(--text); font: 800 clamp(2.2rem, 4vw, 4rem)/1 var(--font-title); letter-spacing: -.04em; }
    .proof-stat span { margin-top: .65rem; color: var(--text-muted); font-size: .62rem; font-weight: 800; letter-spacing: .14em; text-transform: uppercase; }

    :host-context([data-theme="light"]) .about-section {
      border-block-color: rgba(15,23,42,.08);
      background: linear-gradient(180deg, transparent, rgba(192,132,252,.035) 45%, transparent);
    }
    :host-context([data-theme="light"]) .section-watermark {
      -webkit-text-stroke-color: rgba(15,23,42,.055);
    }
    :host-context([data-theme="light"]) .portrait-card {
      background: rgba(255,255,255,.86);
      box-shadow: 0 38px 90px rgba(15,23,42,.16);
    }
    :host-context([data-theme="light"]) .portrait-top { color: rgba(15,23,42,.52); }
    :host-context([data-theme="light"]) .portrait-wrap {
      background: linear-gradient(145deg, rgba(241,245,249,.95), rgba(226,232,240,.65));
    }
    :host-context([data-theme="light"]) .portrait-overlay {
      background:
        linear-gradient(to top, rgba(15,23,42,.62), transparent 46%),
        linear-gradient(135deg, rgba(192,132,252,.12), transparent 42%);
    }
    :host-context([data-theme="light"]) .experience-card,
    :host-context([data-theme="light"]) .signature-card {
      background: rgba(255,255,255,.9);
      box-shadow: 0 20px 50px rgba(15,23,42,.15);
    }
    :host-context([data-theme="light"]) .principles article:hover {
      background: rgba(255,255,255,.7);
    }

    @media (max-width: 1100px) {
      .headline-grid { grid-template-columns: 1fr; gap: 2rem; }
      .headline-note { max-width: 620px; }
      .story-grid { grid-template-columns: minmax(320px, .85fr) 1.15fr; gap: 4rem; }
      .experience-card { right: -1.5rem; }
      .signature-card { left: -1rem; }
      .bio-grid { grid-template-columns: 1fr; gap: 1rem; }
    }

    @media (max-width: 820px) {
      .about-section { padding: 7rem 0; }
      .story-grid { grid-template-columns: 1fr; }
      .visual-col { width: calc(100% - 2rem); margin: 0 auto; }
      .portrait-wrap, .portrait { min-height: auto; aspect-ratio: 4 / 5; }
      .content-col { margin-top: 1rem; }
      .proof-bar { grid-template-columns: 1fr 1fr; }
      .proof-stat:nth-child(2) { border-right: 0; }
      .proof-stat:nth-child(-n+2) { border-bottom: 1px solid var(--glass-border); }
    }

    @media (max-width: 560px) {
      .about-section { padding: 5.5rem 0; }
      .about-header { margin-bottom: 3rem; }
      .sec-title { font-size: clamp(2.7rem, 14vw, 4rem); }
      .headline-note { padding-left: 1rem; }
      .visual-col { width: 100%; }
      .portrait-card { border-radius: 20px; }
      .portrait-wrap { border-radius: 14px; }
      .experience-card { top: auto; right: -.4rem; bottom: 5rem; width: 130px; }
      .signature-card { display: none; }
      .portrait-caption { left: 1rem; right: 1rem; bottom: 1rem; }
      .portrait-caption { flex-direction: column; align-items: flex-start; }
      .expertise-line { flex-wrap: wrap; }
      .manifesto { font-size: 1.65rem; }
      .about-cta { flex-direction: column; }
      .about-cta > * { width: 100%; }
      .proof-stat { min-height: 120px; padding: 1.2rem; }
    }
  `],
})
export class AboutComponent implements OnInit {
  t = inject(TranslationService);
  private skillsService = inject(SkillsService);

  stats: Stat[] = [
    { label: 'years', target: 10, suffix: '+', current: 0 },
    { label: 'projects', target: 30, suffix: '+', current: 0 },
    { label: 'technologies', target: 20, suffix: '+', current: 0 },
    { label: 'learning', target: 0, suffix: '∞', current: 0 },
  ];

  skills: { label: string; items: string[] }[] = [];
  private animated = false;

  ngOnInit() {
    if (typeof IntersectionObserver !== 'undefined') {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) this.animateStats();
        },
        { threshold: 0.2 },
      );
      const element = document.getElementById('about');
      if (element) observer.observe(element);
    }

    this.skillsService.getAll().subscribe({
      next: (data: Skill[]) => {
        const groups: Record<string, string[]> = {};
        data.forEach(skill => {
          if (!groups[skill.category]) groups[skill.category] = [];
          groups[skill.category].push(skill.name);
        });
        this.skills = Object.entries(groups).map(([label, items]) => ({ label, items }));
      },
      error: error => console.error('Failed to load skills', error),
    });
  }

  animateStats() {
    if (this.animated) return;
    this.animated = true;

    this.stats.forEach(stat => {
      if (stat.suffix === '∞') return;
      const duration = 1500;
      const step = 16;
      const increment = stat.target / (duration / step);
      let current = 0;
      const interval = setInterval(() => {
        current = Math.min(current + increment, stat.target);
        stat.current = Math.floor(current);
        if (current >= stat.target) clearInterval(interval);
      }, step);
    });
  }

  scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }

  statLabel(key: string) {
    const labels: Record<string, { fr: string; en: string }> = {
      years: { fr: 'Années d’expérience', en: 'Years of experience' },
      projects: { fr: 'Projets livrés', en: 'Projects delivered' },
      technologies: { fr: 'Technologies maîtrisées', en: 'Core technologies' },
      learning: { fr: 'Curiosité technique', en: 'Technical curiosity' },
    };
    return labels[key]?.[this.t.currentLang()] || key;
  }

  categoryLabel(category: string) {
    const labels: Record<string, { fr: string; en: string }> = {
      Frontend: { fr: 'Frontend', en: 'Frontend' },
      Backend: { fr: 'Backend', en: 'Backend' },
      DevOps: { fr: 'DevOps & Cloud', en: 'DevOps & Cloud' },
      CMS: { fr: 'CMS & Commerce', en: 'CMS & Commerce' },
    };
    return labels[category]?.[this.t.currentLang()] || category;
  }
}
