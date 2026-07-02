import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../services/translation.service';
import { ExperienceService, Experience } from '../../services/experience.service';

interface Exp {
  company: string;
  position: string;
  positionEn?: string;
  period: string;
  current: boolean;
  description: string;
  descriptionEn?: string;
  skills: string[];
}

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="exp-section" id="experience">
      <div class="container">

        <!-- Label -->
        <div class="sec-label reveal">
          <span class="dash"></span>
          <span class="num">03</span>
          <span class="word">{{ t.currentLang() === 'fr' ? 'PARCOURS' : 'CAREER' }}</span>
        </div>

        <h2 class="sec-title reveal">
          {{ t.currentLang() === 'fr' ? 'Mon' : 'The' }}
          <span class="gradient-text">{{ t.currentLang() === 'fr' ? 'parcours.' : 'Journey.' }}</span>
        </h2>

        <!-- Timeline -->
        <div class="timeline" [attr.aria-busy]="loading()">
          <div class="timeline-line"></div>
          <div class="tl-item" *ngFor="let item of loading() ? [1,2,3] : []" aria-hidden="true">
            <div class="tl-card skeleton-card">
              <div class="skeleton-line short"></div>
              <div class="skeleton-line title"></div>
              <div class="skeleton-line"></div>
              <div class="skeleton-line short"></div>
            </div>
          </div>

          <div class="tl-item reveal" *ngFor="let exp of experiences; let i = index"
               [style.animation-delay]="(i * 0.12) + 's'">

            <!-- Dot -->
            <div class="tl-dot" [class.current]="exp.current"></div>

            <!-- Card -->
            <div class="tl-card glass-card">
              <div class="tl-top">
                <div>
                  <span class="period">{{ exp.period }}</span>
                  <h3 class="position">{{ expPosition(exp) }}</h3>
                  <span class="company">@ {{ exp.company }}</span>
                </div>
                <div class="status-badge" *ngIf="exp.current">{{ t.currentLang() === 'fr' ? 'ACTUEL' : 'NOW' }}</div>
              </div>
              <p class="desc">{{ expDescription(exp) }}</p>
              <div class="skill-chips">
                <span class="chip" *ngFor="let s of exp.skills">{{ s }}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  `,
  styles: [`
    .exp-section { padding: 8rem 0; }

    .sec-label {
      display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem;
    }
    .dash { display: block; width: 40px; height: 1px; background: var(--primary); box-shadow: 0 0 8px var(--primary); }
    .num  { font-size: 0.65rem; font-weight: 900; color: var(--secondary); letter-spacing: 3px; }
    .word { font-size: 0.65rem; font-weight: 900; letter-spacing: 4px; color: var(--text-muted); }

    .sec-title {
      font-size: clamp(2.5rem, 5vw, 5rem);
      line-height: 1;
      letter-spacing: -2px;
      font-weight: 800;
      margin-bottom: 5rem;
    }

    /* Timeline */
    .timeline {
      position: relative;
      padding-left: 2rem;
      max-width: 900px;
    }
    .timeline-line {
      position: absolute;
      left: 0; top: 0; bottom: 0;
      width: 1px;
      background: linear-gradient(to bottom, var(--primary) 0%, var(--secondary) 50%, transparent 100%);
      opacity: 0.3;
    }

    .tl-item {
      position: relative;
      padding-left: 3rem;
      margin-bottom: 3rem;
    }
    .tl-dot {
      position: absolute;
      left: -5px; top: 1.8rem;
      width: 11px; height: 11px;
      border-radius: 50%;
      background: var(--glass-border);
      border: 2px solid var(--glass-border);
      transition: all 0.3s;
    }
    .tl-dot.current {
      background: var(--primary);
      border-color: var(--primary);
      box-shadow: 0 0 14px var(--primary);
    }
    .tl-item:hover .tl-dot { background: var(--primary); border-color: var(--primary); }

    .tl-card {
      padding: 2rem 2.5rem;
      border-radius: 16px;
      transition: transform 0.3s;
    }
    .tl-card:hover { transform: translateX(6px); }

    .tl-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
    }
    .period {
      display: block;
      font-size: 0.6rem;
      font-weight: 900;
      letter-spacing: 2px;
      color: var(--secondary);
      margin-bottom: 0.6rem;
    }
    .position { font-size: 1.4rem; font-weight: 800; margin-bottom: 0.3rem; line-height: 1.1; }
    .company  { font-size: 0.85rem; color: var(--text-muted); font-weight: 600; }

    .status-badge {
      background: var(--primary);
      color: white;
      font-size: 0.55rem;
      font-weight: 900;
      padding: 0.35rem 0.9rem;
      border-radius: 50px;
      letter-spacing: 2px;
      box-shadow: 0 0 14px rgba(192,132,252,0.4);
      white-space: nowrap;
    }

    .desc {
      color: var(--text-muted);
      font-size: 0.95rem;
      line-height: 1.75;
      margin-bottom: 1.5rem;
    }

    .skill-chips { display: flex; gap: 0.5rem; flex-wrap: wrap; }
    .chip {
      font-size: 0.65rem;
      font-weight: 700;
      color: var(--text-muted);
      background: rgba(255,255,255,0.04);
      border: 1px solid var(--glass-border);
      padding: 0.25rem 0.75rem;
      border-radius: 50px;
      transition: all 0.2s;
    }
    .chip:hover { color: var(--secondary); border-color: var(--secondary); }

    @media (max-width: 768px) {
      .timeline { padding-left: 1rem; }
      .tl-item { padding-left: 2rem; }
      .tl-card { padding: 1.5rem; }
      .position { font-size: 1.2rem; }
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
          period: this.formatPeriod(exp.startDate, exp.endDate, exp.current),
          current: exp.current,
          description: exp.description,
          descriptionEn: exp.descriptionEn,
          skills: exp.skills,
        }));
        this.loading.set(false);
      },
      error: err => {
        this.loading.set(false);
        console.error('Failed to load experiences', err);
      }
    });
  }

  private formatPeriod(startDate: string, endDate?: string, current?: boolean): string {
    const start = new Date(startDate).getFullYear();
    if (current) return `${start} — ${this.t.currentLang() === 'fr' ? 'AUJOURD’HUI' : 'PRESENT'}`;
    const end = endDate ? new Date(endDate).getFullYear() : '?';
    return `${start} — ${end}`;
  }

  expPosition(exp: Exp) {
    return this.t.currentLang() === 'en' && exp.positionEn ? exp.positionEn : exp.position;
  }

  expDescription(exp: Exp) {
    return this.t.currentLang() === 'en' && exp.descriptionEn ? exp.descriptionEn : exp.description;
  }
}
