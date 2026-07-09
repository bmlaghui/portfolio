import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FooterComponent } from '../../components/footer/footer';
import { NavbarComponent } from '../../components/navbar/navbar';
import { AnalyticsService } from '../../core/services/analytics.service';
import { SeoService } from '../../core/services/seo.service';
import { Project, ProjectService } from '../../services/project.service';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent],
  template: `
    <app-navbar />
    @if (project(); as p) {
      <main class="pd-root">

        <!-- ── Hero ── -->
        <header class="pd-hero" [style.--accent]="p.accent || 'var(--primary)'">
          <!-- BG image -->
          <div class="pd-hero-bg" *ngIf="p.imageUrl">
            <img [src]="p.imageUrl" [alt]="title()" class="pd-hero-bg-img">
            <div class="pd-hero-bg-overlay"></div>
          </div>
          <div class="pd-orb"></div>

          <div class="container pd-hero-content">
            <!-- Back -->
            <a routerLink="/" fragment="projects" class="pd-back">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
              {{ t.currentLang() === 'fr' ? 'Projets' : 'Projects' }}
            </a>

            <!-- Title + meta -->
            <div class="pd-hero-body">
              <div class="pd-hero-left">
                <div class="pd-tags">
                  <span class="pd-tag" *ngFor="let tag of p.tags">{{ tag }}</span>
                </div>
                <h1 class="pd-title">{{ title() }}</h1>
                <div class="pd-links">
                  <a *ngIf="p.github" [href]="p.github" target="_blank" rel="noopener noreferrer" class="pd-btn pd-btn--outline">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.1.82-.26.82-.58v-2.03c-3.34.72-4.04-1.6-4.04-1.6-.54-1.37-1.33-1.74-1.33-1.74-1.08-.74.08-.72.08-.72 1.2.08 1.83 1.23 1.83 1.23 1.06 1.82 2.79 1.3 3.47.99.1-.77.41-1.3.75-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02 0 2.04.13 3 .4 2.28-1.55 3.29-1.23 3.29-1.23.66 1.65.24 2.87.12 3.17.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.62-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.69.82.57C20.56 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z"/></svg>
                    GitHub
                  </a>
                  <a *ngIf="p.link" [href]="p.link" target="_blank" rel="noopener noreferrer" class="pd-btn pd-btn--primary">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15,3 21,3 21,9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                    {{ t.currentLang() === 'fr' ? 'Voir le live' : 'Live demo' }}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </header>

        <!-- ── Body ── -->
        <div class="container pd-layout">

          <!-- Description + gallery (main col) -->
          <div class="pd-main">
            <div class="pd-desc glass-card" [innerHTML]="description()"></div>

            <!-- Gallery Carousel -->
            <div class="pd-gallery" *ngIf="gallery().length > 0">
              <div class="carousel-wrap">
                <div class="carousel-track" [style.transform]="'translateX(-' + (currentSlide() * 100) + '%)'">
                  <div class="carousel-slide" *ngFor="let img of gallery()">
                    <img [src]="img" [alt]="title()" loading="lazy">
                  </div>
                </div>
                <button class="carousel-btn prev" (click)="prevSlide()" *ngIf="gallery().length > 1" aria-label="Précédent">‹</button>
                <button class="carousel-btn next" (click)="nextSlide()" *ngIf="gallery().length > 1" aria-label="Suivant">›</button>
                <div class="carousel-dots" *ngIf="gallery().length > 1">
                  <button *ngFor="let img of gallery(); let i = index" class="dot" [class.active]="i === currentSlide()" (click)="currentSlide.set(i)"></button>
                </div>
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <aside class="pd-sidebar">
            <div class="pd-sidebar-card glass-card">
              <p class="pd-sidebar-label">{{ t.currentLang() === 'fr' ? 'Stack technique' : 'Tech stack' }}</p>
              <div class="pd-stack">
                <span *ngFor="let tag of p.tags" class="pd-stack-tag">{{ tag }}</span>
              </div>
            </div>

            <div class="pd-sidebar-card pd-contact-card" *ngIf="p.github || p.link">
              <p class="pd-sidebar-label">{{ t.currentLang() === 'fr' ? 'Liens' : 'Links' }}</p>
              <a *ngIf="p.github" [href]="p.github" target="_blank" rel="noopener noreferrer" class="pd-sidebar-link">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.1.82-.26.82-.58v-2.03c-3.34.72-4.04-1.6-4.04-1.6-.54-1.37-1.33-1.74-1.33-1.74-1.08-.74.08-.72.08-.72 1.2.08 1.83 1.23 1.83 1.23 1.06 1.82 2.79 1.3 3.47.99.1-.77.41-1.3.75-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02 0 2.04.13 3 .4 2.28-1.55 3.29-1.23 3.29-1.23.66 1.65.24 2.87.12 3.17.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.62-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.69.82.57C20.56 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z"/></svg>
                GitHub
              </a>
              <a *ngIf="p.link" [href]="p.link" target="_blank" rel="noopener noreferrer" class="pd-sidebar-link">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15,3 21,3 21,9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                {{ t.currentLang() === 'fr' ? 'Voir le live' : 'Live demo' }}
              </a>
            </div>
          </aside>
        </div>
      </main>
    } @else {
      <main class="pd-loading container">{{ t.currentLang() === 'fr' ? 'Chargement…' : 'Loading…' }}</main>
    }
    <app-footer />
  `,
  styles: [`
    .pd-root { min-height: 100vh; }

    /* ── Hero ── */
    .pd-hero {
      position: relative;
      padding: 9rem 0 5rem;
      overflow: hidden;
      min-height: 480px;
      display: flex;
      align-items: flex-end;
      border-bottom: 1px solid var(--glass-border);
    }

    .pd-hero-bg { position: absolute; inset: 0; z-index: 0; }
    .pd-hero-bg-img { width: 100%; height: 100%; object-fit: cover; opacity: 0.18; }
    .pd-hero-bg-overlay {
      position: absolute; inset: 0;
      background: linear-gradient(to right, var(--bg) 35%, transparent 100%),
                  linear-gradient(to top, var(--bg) 15%, transparent 70%);
    }

    .pd-orb {
      position: absolute;
      width: 600px; height: 600px;
      border-radius: 50%;
      right: -100px; top: 50%;
      transform: translateY(-50%);
      background: var(--accent, var(--primary));
      filter: blur(160px);
      opacity: 0.08;
      pointer-events: none;
    }

    .pd-hero-content {
      position: relative;
      z-index: 2;
      width: 100%;
    }

    .pd-back {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--text-muted);
      text-decoration: none;
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 1px;
      text-transform: uppercase;
      margin-bottom: 3rem;
      transition: color 0.2s;
    }
    .pd-back:hover { color: var(--accent, var(--primary)); }

    .pd-hero-body { max-width: 800px; }

    .pd-tags { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1.25rem; }
    .pd-tag {
      font-size: 0.65rem;
      font-weight: 700;
      color: var(--accent, var(--primary));
      background: color-mix(in srgb, var(--accent, var(--primary)) 10%, transparent);
      border: 1px solid color-mix(in srgb, var(--accent, var(--primary)) 25%, transparent);
      padding: 0.3rem 0.75rem;
      border-radius: 99px;
    }

    .pd-title {
      font-size: clamp(2.5rem, 6vw, 6rem);
      font-weight: 800;
      line-height: 0.95;
      letter-spacing: -2px;
      margin: 0 0 2.5rem;
    }

    .pd-links { display: flex; gap: 0.75rem; flex-wrap: wrap; }
    .pd-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.55rem;
      padding: 0.75rem 1.5rem;
      border-radius: 10px;
      text-decoration: none;
      font-weight: 700;
      font-size: 0.82rem;
      transition: 0.25s;
    }
    .pd-btn--primary { background: var(--accent, var(--primary)); color: #000; }
    .pd-btn--primary:hover { filter: brightness(1.1); transform: translateY(-2px); }
    .pd-btn--outline { border: 1px solid var(--glass-border); color: var(--text); }
    .pd-btn--outline:hover { border-color: var(--accent, var(--primary)); color: var(--accent, var(--primary)); }

    /* ── Layout ── */
    .pd-layout {
      display: grid;
      grid-template-columns: 1fr 280px;
      gap: 3rem;
      padding-top: 4rem;
      padding-bottom: 8rem;
      align-items: start;
    }

    /* ── Description ── */
    .pd-desc {
      padding: 2.5rem;
      font-size: 1rem;
      line-height: 1.8;
      color: var(--text-muted);
      margin-bottom: 2.5rem;
    }
    .pd-desc :is(h1,h2,h3,h4) { color: var(--text); margin: 1.5rem 0 0.75rem; font-weight: 700; }
    .pd-desc h1 { font-size: 1.6rem; }
    .pd-desc h2 { font-size: 1.3rem; }
    .pd-desc h3 { font-size: 1.1rem; }
    .pd-desc p { margin: 0 0 1rem; }
    .pd-desc ul, .pd-desc ol { padding-left: 1.5rem; margin: 0.5rem 0 1rem; }
    .pd-desc li { margin-bottom: 0.4rem; }
    .pd-desc strong, .pd-desc b { color: var(--text); font-weight: 700; }
    .pd-desc a { color: var(--accent, var(--primary)); }
    .pd-desc code { background: rgba(255,255,255,0.05); border: 1px solid var(--glass-border); padding: 0.1rem 0.4rem; border-radius: 4px; font-size: 0.85em; }
    .pd-desc pre { background: rgba(0,0,0,0.3); border: 1px solid var(--glass-border); padding: 1.25rem; border-radius: 10px; overflow-x: auto; margin: 1rem 0; }

    /* ── Gallery ── */
    .pd-gallery { margin-bottom: 2rem; }
    .carousel-wrap { position: relative; overflow: hidden; border-radius: 16px; border: 1px solid var(--glass-border); aspect-ratio: 16/9; }
    .carousel-track { display: flex; transition: transform 0.5s cubic-bezier(0.2,1,0.2,1); height: 100%; }
    .carousel-slide { flex: 0 0 100%; height: 100%; }
    .carousel-slide img { width: 100%; height: 100%; object-fit: cover; }
    .carousel-btn { position: absolute; top: 50%; transform: translateY(-50%); background: rgba(0,0,0,0.6); border: 1px solid var(--glass-border); color: #fff; width: 44px; height: 44px; border-radius: 50%; cursor: pointer; font-size: 1.6rem; display: flex; align-items: center; justify-content: center; transition: 0.25s; backdrop-filter: blur(8px); }
    .carousel-btn:hover { background: var(--accent, var(--primary)); color: #000; }
    .carousel-btn.prev { left: 1rem; }
    .carousel-btn.next { right: 1rem; }
    .carousel-dots { position: absolute; bottom: 1rem; left: 50%; transform: translateX(-50%); display: flex; gap: 0.4rem; }
    .dot { width: 7px; height: 7px; border-radius: 50%; background: rgba(255,255,255,0.3); border: none; cursor: pointer; transition: 0.25s; }
    .dot.active { background: var(--accent, var(--primary)); width: 22px; border-radius: 4px; }

    /* ── Sidebar ── */
    .pd-sidebar { display: flex; flex-direction: column; gap: 1rem; position: sticky; top: 100px; }
    .pd-sidebar-card { padding: 1.5rem; }
    .pd-sidebar-label { font-size: 0.6rem; font-weight: 900; letter-spacing: 2px; color: var(--text-muted); text-transform: uppercase; margin-bottom: 1rem; }
    .pd-stack { display: flex; flex-wrap: wrap; gap: 0.5rem; }
    .pd-stack-tag {
      font-size: 0.7rem;
      font-weight: 700;
      color: var(--text-muted);
      border: 1px solid var(--glass-border);
      padding: 0.3rem 0.75rem;
      border-radius: 99px;
    }
    .pd-sidebar-link {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--text-muted);
      text-decoration: none;
      font-size: 0.82rem;
      font-weight: 600;
      padding: 0.5rem 0;
      border-bottom: 1px solid var(--glass-border);
      transition: color 0.2s;
    }
    .pd-sidebar-link:last-child { border-bottom: none; }
    .pd-sidebar-link:hover { color: var(--accent, var(--primary)); }

    :host-context([data-theme="light"]) .pd-hero-bg-img {
      opacity: .12;
    }
    :host-context([data-theme="light"]) .pd-desc,
    :host-context([data-theme="light"]) .pd-sidebar-card {
      background: rgba(255,255,255,.84);
      box-shadow: 0 18px 45px rgba(15,23,42,.08);
    }
    :host-context([data-theme="light"]) .pd-desc code {
      background: rgba(241,245,249,.9);
    }
    :host-context([data-theme="light"]) .pd-desc pre {
      background: rgba(255,255,255,.9);
      box-shadow: 0 14px 32px rgba(15,23,42,.08);
    }
    :host-context([data-theme="light"]) .carousel-btn {
      background: rgba(255,255,255,.82);
      color: var(--text);
      box-shadow: 0 10px 24px rgba(15,23,42,.14);
    }
    :host-context([data-theme="light"]) .dot {
      background: rgba(15,23,42,.22);
    }

    /* ── Loading ── */
    .pd-loading { padding: 15rem 0; min-height: 70vh; color: var(--text-muted); }

    /* ── Responsive ── */
    @media (max-width: 900px) {
      .pd-layout { grid-template-columns: 1fr; }
      .pd-sidebar { position: static; }
    }
    @media (max-width: 600px) {
      .pd-hero { padding-top: 7rem; min-height: auto; }
      .pd-title { letter-spacing: -1px; }
      .pd-links { flex-direction: column; }
      .pd-desc { padding: 1.5rem; }
      .carousel-wrap { aspect-ratio: 4/3; }
    }
  `]
})
export class ProjectDetailComponent implements OnInit {
  t = inject(TranslationService);
  private route = inject(ActivatedRoute);
  private service = inject(ProjectService);
  private seo = inject(SeoService);
  private analytics = inject(AnalyticsService);
  project = signal<Project | null>(null);
  currentSlide = signal(0);
  title = computed(() => this.localized('title', 'titleEn'));
  description = computed(() => this.localized('description', 'descriptionEn'));
  gallery = computed(() => this.project()?.gallery ?? []);

  ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug')!;
    this.service.getBySlug(slug).subscribe(project => {
      this.project.set(project);
      this.currentSlide.set(0);
      this.seo.setPage({ title: `${this.title()} | Brahim MLAGHUI`, description: this.description().replace(/<[^>]+>/g, '').slice(0, 160), image: project.imageUrl, path: `/projects/${slug}` });
      this.analytics.track('project_view', { resource: 'project', resourceId: String(project.id), path: `/projects/${slug}` });
    });
  }

  private localized(fr: keyof Project, en: keyof Project) {
    const p = this.project();
    return String((this.t.currentLang() === 'en' && p?.[en] ? p[en] : p?.[fr]) || '');
  }

  nextSlide() { this.currentSlide.update(s => (s + 1) % this.gallery().length); }
  prevSlide() { this.currentSlide.update(s => (s - 1 + this.gallery().length) % this.gallery().length); }
}
