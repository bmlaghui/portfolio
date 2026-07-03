import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../services/translation.service';
import { ExperienceService, Experience } from '../../services/experience.service';

interface Exp {
  company: string;
  position: string;
  positionEn?: string;
  startYear: string;
  endYear: string;
  current: boolean;
  description: string;
  descriptionEn?: string;
  skills: string[];
  logoUrl?: string;
  linkedinUrl?: string;
  initial: string;
}

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="exp-section" id="experience">
      <div class="container">

        <div class="sec-label reveal">
          <span class="dash"></span>
          <span class="num">03</span>
          <span class="word">{{ t.currentLang() === "fr" ? "PARCOURS" : "CAREER" }}</span>
        </div>
        <h2 class="sec-title reveal">
          {{ t.currentLang() === "fr" ? "Mon" : "The" }}
          <span class="gradient-text">{{ t.currentLang() === "fr" ? "parcours." : "Journey." }}</span>
        </h2>

        <!-- Skeleton -->
        <div class="tl-wrap" *ngIf="loading()">
          <div class="tl-line"></div>
          <div class="tl-row" *ngFor="let i of [1,2,3]">
            <div class="tl-side"><div class="exp-card skeleton-card"><div class="skeleton-line short"></div><div class="skeleton-line title"></div><div class="skeleton-line"></div></div></div>
            <div class="tl-node"><div class="tl-dot"></div></div>
            <div class="tl-side"></div>
          </div>
        </div>

        <!-- Timeline -->
        <div class="tl-wrap" *ngIf="!loading()">
          <div class="tl-line"></div>

          <div class="tl-row"
               *ngFor="let exp of experiences; let i = index"
               [class.flip]="i % 2 === 1">

            <!-- Card side -->
            <div class="tl-side card-side">
              <div class="exp-card"
                   [class.current]="exp.current"
                   [class.reveal-left]="i % 2 === 0"
                   [class.reveal-right]="i % 2 === 1"
                   [style.transition-delay]="(i * 0.08) + 's'">

                <!-- Logo header -->
                <div class="card-logo-wrap">
                  <div class="logo-box" *ngIf="exp.logoUrl; else initTpl">
                    <img [src]="exp.logoUrl" [alt]="exp.company" class="logo-img">
                  </div>
                  <ng-template #initTpl>
                    <div class="logo-initial">{{ exp.initial }}</div>
                  </ng-template>
                  <div class="logo-info">
                    <span class="company-name">{{ exp.company }}</span>
                    <a *ngIf="exp.linkedinUrl" [href]="exp.linkedinUrl" target="_blank" rel="noopener noreferrer" class="li-btn">in</a>
                  </div>
                  <div class="now-pill" *ngIf="exp.current">
                    <span class="now-dot"></span>{{ t.currentLang() === "fr" ? "EN POSTE" : "ACTIVE" }}
                  </div>
                </div>

                <!-- Period bar -->
                <div class="period-bar">
                  <span class="yr">{{ exp.startYear }}</span>
                  <span class="period-line"></span>
                  <span class="yr" [class.now]="exp.current">
                    {{ exp.current ? (t.currentLang() === "fr" ? "Aujourd'hui" : "Present") : exp.endYear }}
                  </span>
                </div>

                <!-- Title -->
                <h3 class="position">{{ expPosition(exp) }}</h3>

                <!-- Description -->
                <div class="desc" [innerHTML]="expDescription(exp)"></div>

                <!-- Skills -->
                <div class="skill-row">
                  <span class="chip" *ngFor="let s of exp.skills">{{ s }}</span>
                </div>

                <!-- Bottom accent -->
                <div class="card-accent"></div>
              </div>
            </div>

            <!-- Center node -->
            <div class="tl-node">
              <div class="tl-dot reveal-scale"
                   [class.is-current]="exp.current"
                   [style.transition-delay]="(i * 0.08 + 0.15) + 's'">
                <div class="tl-ring" *ngIf="exp.current"></div>
              </div>
              <div class="tl-year-tag">{{ exp.startYear }}</div>
            </div>

            <!-- Spacer -->
            <div class="tl-side"></div>
          </div>
        </div>

      </div>
    </section>
  `,
  styles: [`
    .exp-section { padding: 8rem 0; }

    .sec-label { display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem; }
    .dash { display: block; width: 40px; height: 1px; background: var(--primary); box-shadow: 0 0 8px var(--primary); }
    .num  { font-size: 0.65rem; font-weight: 900; color: var(--secondary); letter-spacing: 3px; }
    .word { font-size: 0.65rem; font-weight: 900; letter-spacing: 4px; color: var(--text-muted); }
    .sec-title { font-size: clamp(2.5rem, 5vw, 5rem); line-height: 1; letter-spacing: -2px; font-weight: 800; margin-bottom: 5rem; }

    /* ── Timeline wrap ── */
    .tl-wrap {
      position: relative;
      display: flex;
      flex-direction: column;
      gap: 3rem;
    }

    /* Vertical spine */
    .tl-line {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      top: 0; bottom: 0;
      width: 1px;
      background: linear-gradient(to bottom,
        rgba(192,132,252,0.6) 0%,
        rgba(192,132,252,0.2) 60%,
        transparent 100%);
      pointer-events: none;
    }

    /* ── Each row ── */
    .tl-row {
      display: grid;
      grid-template-columns: 1fr 80px 1fr;
      align-items: center;
      gap: 0;
    }

    /* Flip: card goes to right column */
    .tl-side { display: flex; }
    .card-side { justify-content: flex-end; padding-right: 2rem; }
    .tl-row.flip .card-side { justify-content: flex-start; padding-right: 0; padding-left: 2rem; order: 3; }
    .tl-row.flip .tl-node { order: 2; }
    .tl-row.flip .tl-side:last-child { order: 1; justify-content: flex-end; padding-right: 2rem; }

    /* ── Node ── */
    .tl-node {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      position: relative;
      z-index: 2;
    }
    .tl-dot {
      width: 14px; height: 14px;
      border-radius: 50%;
      background: #1a1a1a;
      border: 2px solid #333;
      transition: all 0.3s;
      position: relative;
    }
    .tl-dot.is-current {
      background: var(--primary);
      border-color: var(--primary);
      box-shadow: 0 0 0 4px rgba(192,132,252,0.2), 0 0 20px rgba(192,132,252,0.4);
    }
    .tl-ring {
      position: absolute;
      inset: -6px;
      border-radius: 50%;
      border: 1px solid rgba(192,132,252,0.4);
      animation: ring-pulse 2.5s infinite;
    }
    @keyframes ring-pulse {
      0%   { transform: scale(1);   opacity: 0.8; }
      50%  { transform: scale(1.4); opacity: 0.2; }
      100% { transform: scale(1);   opacity: 0.8; }
    }
    .tl-year-tag {
      font-size: 0.55rem; font-weight: 900; font-family: monospace;
      color: #2a2a2a; letter-spacing: 1px;
      white-space: nowrap;
    }

    /* ── Card ── */
    .exp-card {
      position: relative;
      background: #080808;
      border: 1px solid #111;
      border-radius: 20px;
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      overflow: hidden;
      width: 100%;
      max-width: 480px;
      transition: transform 0.35s, border-color 0.35s, box-shadow 0.35s;
    }
    /* Arrow pointing right (left card → spine) */
    .card-side .exp-card::after {
      content: '';
      position: absolute;
      right: -10px; top: 2.5rem;
      width: 0; height: 0;
      border-top: 10px solid transparent;
      border-bottom: 10px solid transparent;
      border-left: 10px solid #111;
      transition: border-left-color 0.35s;
    }
    /* Arrow pointing left (right card ← spine) */
    .tl-row.flip .card-side .exp-card::after {
      right: auto; left: -10px;
      border-left: none;
      border-right: 10px solid #111;
      border-top: 10px solid transparent;
      border-bottom: 10px solid transparent;
      transition: border-right-color 0.35s;
    }
    .exp-card:hover { transform: translateY(-4px); border-color: rgba(192,132,252,0.3); box-shadow: 0 16px 48px rgba(0,0,0,0.7), 0 0 0 1px rgba(192,132,252,0.1); }
    .exp-card:hover::after { border-left-color: rgba(192,132,252,0.3); }
    .tl-row.flip .exp-card:hover::after { border-left-color: transparent; border-right-color: rgba(192,132,252,0.3); }
    .exp-card.current { border-color: rgba(192,132,252,0.25); background: linear-gradient(135deg, #0c090f 0%, #090909 100%); }

    /* ── Logo header ── */
    .card-logo-wrap {
      display: flex; align-items: center; gap: 0.875rem;
    }
    /* Logo box — white bg so any logo is visible */
    .logo-box {
      width: 60px; height: 60px;
      border-radius: 12px;
      background: #fff;
      border: 1px solid rgba(255,255,255,0.15);
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
      box-shadow: 0 4px 16px rgba(0,0,0,0.4);
      overflow: hidden;
    }
    .logo-img { width: 100%; height: 100%; object-fit: contain; padding: 6px; }

    .logo-initial {
      width: 60px; height: 60px; border-radius: 12px;
      background: linear-gradient(135deg, rgba(192,132,252,0.18) 0%, rgba(139,92,246,0.08) 100%);
      border: 1px solid rgba(192,132,252,0.2);
      display: flex; align-items: center; justify-content: center;
      font-size: 1.6rem; font-weight: 950; color: var(--primary);
      flex-shrink: 0;
      box-shadow: 0 4px 16px rgba(192,132,252,0.1);
    }
    .logo-info { display: flex; flex-direction: column; gap: 0.25rem; flex: 1; min-width: 0; }
    .company-name { font-size: 0.85rem; font-weight: 900; color: #e2e8f0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .li-btn { display: inline-flex; align-items: center; justify-content: center; width: 20px; height: 20px; background: #0A66C2; color: #fff; border-radius: 4px; font-size: 0.6rem; font-weight: 900; text-decoration: none; transition: 0.2s; }
    .li-btn:hover { background: #004182; transform: scale(1.1); }
    .now-pill { margin-left: auto; display: inline-flex; align-items: center; gap: 0.4rem; font-size: 0.55rem; font-weight: 900; letter-spacing: 1.5px; color: #4ade80; background: rgba(74,222,128,0.07); border: 1px solid rgba(74,222,128,0.2); padding: 0.28rem 0.6rem; border-radius: 50px; white-space: nowrap; flex-shrink: 0; }
    .now-dot { width: 5px; height: 5px; border-radius: 50%; background: #4ade80; box-shadow: 0 0 8px #4ade80; animation: pdot 2s infinite; }
    @keyframes pdot { 0%,100%{ opacity:1; transform:scale(1); } 50%{ opacity:0.4; transform:scale(0.7); } }

    /* ── Period bar ── */
    .period-bar { display: flex; align-items: center; gap: 0.5rem; }
    .yr { font-size: 0.68rem; font-weight: 900; font-family: monospace; color: #334155; }
    .yr.now { color: #4ade80; }
    .period-line { flex: 1; height: 1px; background: linear-gradient(90deg, #1e293b, transparent); }

    /* ── Content ── */
    .position { font-size: 1.2rem; font-weight: 900; color: #e2e8f0; margin: 0; letter-spacing: -0.5px; line-height: 1.2; }
    .desc { color: #475569; font-size: 0.85rem; line-height: 1.7; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }

    /* ── Skills ── */
    .skill-row { display: flex; flex-wrap: wrap; gap: 0.3rem; }
    .chip { font-size: 0.6rem; font-weight: 800; color: #334155; background: #0d0d0d; border: 1px solid #161616; padding: 0.18rem 0.5rem; border-radius: 5px; transition: all 0.2s; }
    .chip:hover { color: var(--primary); border-color: rgba(192,132,252,0.3); }

    /* Accent bar */
    .card-accent { position: absolute; bottom: 0; left: 0; right: 0; height: 2px; background: transparent; transition: background 0.35s; }
    .exp-card:hover .card-accent { background: linear-gradient(90deg, transparent, var(--primary), transparent); }
    .exp-card.current .card-accent { background: linear-gradient(90deg, transparent, var(--primary), rgba(139,92,246,0.3)); }

    /* ── Mobile ── */
    @media (max-width: 860px) {
      .tl-line { left: 24px; transform: none; }
      .tl-row { grid-template-columns: 48px 1fr; }
      .tl-node { grid-column: 1; grid-row: 1; align-items: center; }
      .tl-year-tag { display: none; }
      .card-side { grid-column: 2; grid-row: 1; justify-content: flex-start; padding-right: 0; padding-left: 1rem; }
      .tl-row.flip .card-side { order: unset; padding-left: 1rem; padding-right: 0; justify-content: flex-start; }
      .tl-row.flip .tl-node { order: unset; }
      .tl-row.flip .tl-side:last-child { display: none; }
      .tl-side:last-child:not(.card-side) { display: none; }
      .exp-card::after, .tl-row.flip .card-side .exp-card::after { display: none; }
      .exp-card { max-width: 100%; }
    }
  `]
})
export class ExperienceComponent implements OnInit {
  t = inject(TranslationService);
  private experienceService = inject(ExperienceService);

  experiences: Exp[] = [];
  loading = signal(true);

  ngOnInit() {
    this.experienceService.getAll().subscribe({
      next: data => {
        this.experiences = data.map(exp => ({
          company: exp.company,
          position: exp.position,
          positionEn: exp.positionEn,
          startYear: new Date(exp.startDate).getFullYear().toString(),
          endYear: exp.endDate ? new Date(exp.endDate).getFullYear().toString() : '',
          current: exp.current,
          description: exp.description,
          descriptionEn: exp.descriptionEn,
          skills: exp.skills,
          logoUrl: exp.logoUrl,
          linkedinUrl: exp.linkedinUrl,
          initial: exp.company.charAt(0).toUpperCase(),
        }));
        this.loading.set(false);
      },
      error: err => {
        this.loading.set(false);
        console.error('Failed to load experiences', err);
      }
    });
  }

  expPosition(exp: Exp) {
    return this.t.currentLang() === 'en' && exp.positionEn ? exp.positionEn : exp.position;
  }

  expDescription(exp: Exp) {
    return this.t.currentLang() === 'en' && exp.descriptionEn ? exp.descriptionEn : exp.description;
  }
}
