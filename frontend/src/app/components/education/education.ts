import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../services/translation.service';
import { EducationService, Education } from '../../services/education.service';

interface EduCard {
  school: string;
  degree: string;
  field: string;
  year: string;
  type: string;
  description: string;
}

@Component({
  selector: 'app-education',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="edu-section" id="education">
      <div class="container">

        <!-- Label -->
        <div class="sec-label reveal">
          <span class="dash"></span>
          <span class="num">04</span>
          <span class="word">{{ t.currentLang() === 'fr' ? 'FORMATION' : 'ACADEMIC BACKGROUND' }}</span>
        </div>

        <h2 class="sec-title reveal">
          {{ t.currentLang() === 'fr' ? 'Formation &' : 'Education &' }}
          <span class="gradient-text">{{ t.currentLang() === 'fr' ? 'diplômes.' : 'Degrees.' }}</span>
        </h2>

        <div class="edu-grid" [attr.aria-busy]="loading()">
          <div class="skeleton-card" *ngFor="let item of loading() ? [1,2,3] : []" aria-hidden="true">
            <div class="skeleton-line short"></div>
            <div class="skeleton-line title"></div>
            <div class="skeleton-line"></div>
            <div class="skeleton-line short"></div>
          </div>
          <div class="edu-card glass-card reveal"
               *ngFor="let edu of education; let i = index"
               [style.animation-delay]="(i * 0.1) + 's'">
            <div class="card-glow"></div>
            <div class="edu-top">
              <span class="year">{{ edu.year }}</span>
              <span class="type-badge">{{ edu.type }}</span>
            </div>
            <h3>{{ edu.degree }}</h3>
            <span class="school">{{ edu.school }} · {{ edu.field }}</span>
            <div class="divider"></div>
            <p class="edu-desc">{{ edu.description }}</p>
          </div>
        </div>

      </div>
    </section>
  `,
  styles: [`
    .edu-section { padding: 8rem 0; }

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
      margin-bottom: 4rem;
    }

    .edu-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
      gap: 2rem;
    }

    .edu-card {
      position: relative;
      padding: 2.5rem;
      border-radius: 18px;
      overflow: hidden;
      transition: transform 0.3s, box-shadow 0.3s;
    }
    .edu-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 25px 50px rgba(0,0,0,0.3);
    }
    .card-glow {
      position: absolute;
      top: -50%; right: -50%;
      width: 100%; height: 100%;
      background: radial-gradient(circle, var(--primary) 0%, transparent 70%);
      opacity: 0.04;
      filter: blur(40px);
      pointer-events: none;
    }
    .edu-card:hover .card-glow { opacity: 0.09; }

    .edu-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.2rem;
    }
    .year { font-size: 0.7rem; font-weight: 900; color: var(--secondary); letter-spacing: 2px; }
    .type-badge {
      font-size: 0.55rem;
      font-weight: 900;
      letter-spacing: 1px;
      padding: 0.3rem 0.8rem;
      background: rgba(192,132,252,0.08);
      border: 1px solid rgba(192,132,252,0.2);
      border-radius: 50px;
      color: var(--primary);
    }

    h3 { font-size: 1.3rem; font-weight: 800; margin-bottom: 0.4rem; line-height: 1.2; }
    .school { font-size: 0.8rem; color: var(--text-muted); font-weight: 600; }

    .divider { width: 40px; height: 2px; background: linear-gradient(90deg, var(--primary), var(--secondary)); border-radius: 2px; margin: 1.5rem 0; }

    .edu-desc { color: var(--text-muted); font-size: 0.9rem; line-height: 1.7; margin-bottom: 1.2rem; }

    .skills { display: flex; gap: 0.5rem; flex-wrap: wrap; }
    .chip {
      font-size: 0.6rem; font-weight: 700;
      color: var(--text-muted);
      background: rgba(255,255,255,0.04);
      border: 1px solid var(--glass-border);
      padding: 0.2rem 0.7rem;
      border-radius: 50px;
    }

    @media (max-width: 768px) {
      .edu-grid { grid-template-columns: 1fr; }
      .edu-card { padding: 1.8rem; }
    }
  `]
})
export class EducationComponent implements OnInit {
  t = inject(TranslationService);
  private educationService = inject(EducationService);

  education: EduCard[] = [];
  loading = signal(true);

  ngOnInit() {
    this.educationService.getAll().subscribe({
      next: data => {
        this.education = data.map(edu => ({
          school: edu.school,
          degree: edu.degree,
          field: edu.field,
          year: this.formatYear(edu.startDate, edu.endDate),
          type: this.getType(edu.degree),
          description: edu.description ?? '',
        }));
        this.loading.set(false);
      },
      error: err => {
        this.loading.set(false);
        console.error('Failed to load education', err);
      }
    });
  }

  private formatYear(startDate: string, endDate?: string): string {
    const start = new Date(startDate).getFullYear();
    if (!endDate) return `${start}`;
    const end = new Date(endDate).getFullYear();
    return `${start} — ${end}`;
  }

  private getType(degree: string): string {
    const d = degree.toLowerCase();
    if (d.includes('master') || d.includes('mastère')) return 'MASTER';
    if (d.includes('bachelor') || d.includes('licence')) return 'LICENCE';
    if (d.includes('bts')) return 'BTS';
    if (d.includes('cert') || d.includes('diplôme')) return 'CERT';
    return 'DEGREE';
  }
}
