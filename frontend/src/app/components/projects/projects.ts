import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../services/translation.service';
import { ProjectService, Project } from '../../services/project.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="projects-section" id="projects">
      <div class="container">

        <!-- Section label -->
        <div class="sec-label reveal">
          <span class="dash"></span>
          <span class="num">02</span>
          <span class="word">{{ t.currentLang() === 'fr' ? 'PROJETS SÉLECTIONNÉS' : 'SELECTED WORKS' }}</span>
        </div>

        <h2 class="sec-title reveal">
          {{ t.translate('projects.title') }}<br>
          <span class="gradient-text">{{ t.translate('projects.titleSub') }}</span>
        </h2>

        <!-- Filter chips -->
        <div class="filters reveal">
          <button class="filter-btn" [class.on]="activeFilter() === 'all'" [attr.aria-pressed]="activeFilter() === 'all'" (click)="activeFilter.set('all')">{{ t.currentLang() === 'fr' ? 'Tout' : 'All' }}</button>
          <button class="filter-btn" [class.on]="activeFilter() === 'frontend'" [attr.aria-pressed]="activeFilter() === 'frontend'" (click)="activeFilter.set('frontend')">Frontend</button>
          <button class="filter-btn" [class.on]="activeFilter() === 'backend'" [attr.aria-pressed]="activeFilter() === 'backend'" (click)="activeFilter.set('backend')">Backend</button>
          <button class="filter-btn" [class.on]="activeFilter() === 'devops'" [attr.aria-pressed]="activeFilter() === 'devops'" (click)="activeFilter.set('devops')">DevOps</button>
        </div>

        <!-- Projects grid -->
        <div class="projects-grid" [attr.aria-busy]="loading()">
          <article class="skeleton-card" *ngFor="let item of loading() ? [1,2,3,4] : []" aria-hidden="true">
            <div class="skeleton-block"></div>
            <div class="skeleton-line title"></div>
            <div class="skeleton-line"></div>
            <div class="skeleton-line short"></div>
          </article>
          <article class="project-card glass-card reveal-scale"
                   *ngFor="let p of filteredProjects(); let i = index"
                   [style.--accent]="p.accent ?? '#c084fc'"
                   [style.transition-delay]="(i * 0.15) + 's'">

            <!-- Background glow -->
            <div class="card-glow"></div>

            <!-- Image thumbnail -->
            <div class="p-thumb-wrapper">
              <img *ngIf="p.imageUrl; else projectVisual" [src]="p.imageUrl" [alt]="projectTitle(p)" class="p-thumb" />
              <ng-template #projectVisual>
                <div class="project-visual" aria-hidden="true">
                  <span>{{ p.tags[0] || 'FULL STACK' }}</span>
                  <strong>{{ projectMonogram(p) }}</strong>
                  <small>{{ p.tags.slice(1, 4).join(' · ') }}</small>
                </div>
              </ng-template>
              <div class="p-overlay"></div>
            </div>

            <!-- Top row -->
            <div class="card-top">
              <span class="p-num">{{ (i + 1).toString().padStart(2, '0') }}</span>
              <div class="p-links">
                <a *ngIf="p.link" [href]="p.link" target="_blank" rel="noopener noreferrer" class="icon-btn" [title]="t.currentLang() === 'fr' ? 'Voir le projet' : 'View project'">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                    <polyline points="15,3 21,3 21,9"/><line x1="10" y1="14" x2="21" y2="3"/>
                  </svg>
                </a>
                <a *ngIf="p.github" [href]="p.github" target="_blank" rel="noopener noreferrer" class="icon-btn" title="GitHub">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.1.82-.26.82-.58v-2.03c-3.34.72-4.04-1.6-4.04-1.6-.54-1.37-1.33-1.74-1.33-1.74-1.08-.74.08-.72.08-.72 1.2.08 1.83 1.23 1.83 1.23 1.06 1.82 2.79 1.3 3.47.99.1-.77.41-1.3.75-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02 0 2.04.13 3 .4 2.28-1.55 3.29-1.23 3.29-1.23.66 1.65.24 2.87.12 3.17.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.62-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.69.82.57C20.56 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z"/>
                  </svg>
                </a>
              </div>
            </div>

            <!-- Content -->
            <h3 class="p-title">{{ projectTitle(p) }}</h3>
            <div class="p-desc" [innerHTML]="projectDescription(p)"></div>

            <!-- Tags -->
            <div class="p-tags">
              <span *ngFor="let tag of p.tags" class="tag">{{ tag }}</span>
            </div>

            <!-- Bottom CTA -->
            <a [routerLink]="['/projects', p.slug || p.id]" class="p-cta">
              <span class="p-cta-text">{{ t.currentLang() === 'fr' ? 'Étude de cas' : 'Case study' }}</span>
              <span class="p-cta-arr">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </span>
            </a>
          </article>
          <p class="empty-state" *ngIf="!loading() && filteredProjects().length === 0">
            {{ t.currentLang() === 'fr' ? 'Aucun projet dans cette catégorie.' : 'No project in this category yet.' }}
          </p>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .projects-section {
      padding: 8rem 0;
      position: relative;
    }

    /* ─── Label ─── */
    .sec-label {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 2rem;
    }
    .dash { display: block; width: 40px; height: 1px; background: var(--primary); box-shadow: 0 0 8px var(--primary); }
    .num  { font-size: 0.65rem; font-weight: 900; color: var(--secondary); letter-spacing: 3px; }
    .word { font-size: 0.65rem; font-weight: 900; letter-spacing: 4px; color: var(--text-muted); text-transform: uppercase; }

    .sec-title {
      font-size: clamp(2.5rem, 5vw, 5rem);
      line-height: 1;
      letter-spacing: -2px;
      font-weight: 800;
      margin-bottom: 3rem;
    }

    /* ─── Filters ─── */
    .filters {
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;
      margin-bottom: 4rem;
    }
    .filter-btn {
      background: var(--surface);
      border: 1px solid var(--glass-border);
      color: var(--text-muted);
      font-size: 0.7rem;
      font-weight: 800;
      letter-spacing: 1px;
      padding: 0.5rem 1.4rem;
      border-radius: 50px;
      cursor: pointer;
      transition: all 0.3s;
    }
    .filter-btn.on, .filter-btn:hover {
      background: var(--primary);
      border-color: var(--primary);
      color: white;
      box-shadow: 0 0 18px rgba(192,132,252,0.3);
    }

    /* ─── Grid ─── */
    .projects-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 2rem;
    }
    .empty-state {
      grid-column: 1 / -1;
      padding: 3rem;
      text-align: center;
      color: var(--text-muted);
      border: 1px dashed var(--glass-border);
      border-radius: 18px;
    }

    /* ─── Card ─── */
    .project-card {
      position: relative;
      padding: 0;
      display: flex;
      flex-direction: column;
      height: 520px;
      overflow: hidden;
      transition: transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.6s;
      border: 1px solid var(--glass-border);
      border-radius: 20px;
    }
    .project-card:hover {
      transform: translateY(-8px) scale(1.02);
      border-color: var(--accent, var(--primary));
      box-shadow: 0 40px 80px rgba(0,0,0,0.5), 0 0 50px rgba(192,132,252,0.1);
    }

    .card-glow {
      position: absolute;
      top: -40%; right: -40%;
      width: 80%; height: 80%;
      background: radial-gradient(circle, var(--accent, var(--primary)) 0%, transparent 70%);
      opacity: 0.04;
      filter: blur(30px);
      pointer-events: none;
      transition: opacity 0.4s;
    }
    .project-card:hover .card-glow { opacity: 0.1; }

    /* Thumb */
    .p-thumb-wrapper {
      position: relative;
      height: 200px;
      width: 100%;
      background: rgba(255,255,255,0.02);
      border-bottom: 1px solid var(--glass-border);
      overflow: hidden;
    }
    .p-thumb {
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0.7;
      transition: transform 0.6s ease, opacity 0.6s ease;
    }
    .project-visual {
      width: 100%;
      height: 100%;
      padding: 2rem;
      display: grid;
      grid-template-columns: 1fr auto;
      align-content: space-between;
      background:
        radial-gradient(circle at 80% 20%, color-mix(in srgb, var(--accent) 32%, transparent), transparent 38%),
        linear-gradient(135deg, #11111b, #08080d);
      color: var(--text);
    }
    .project-visual span,
    .project-visual small {
      font-size: 0.58rem;
      font-weight: 800;
      letter-spacing: 2px;
      color: var(--text-muted);
    }
    .project-visual strong {
      grid-row: 1 / 3;
      grid-column: 2;
      align-self: center;
      font-family: var(--font-title);
      font-size: clamp(3rem, 7vw, 6rem);
      line-height: 1;
      color: var(--accent);
      opacity: 0.75;
    }
    .project-card:hover .p-thumb {
      transform: scale(1.05);
      opacity: 0.9;
    }
    .p-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(to bottom, transparent, rgba(5,5,8,0.9));
      z-index: 1;
    }

    .card-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem 2rem 0;
      position: relative;
      z-index: 2;
    }
    .p-num {
      font-size: 0.65rem;
      font-weight: 900;
      color: var(--accent, var(--primary));
      letter-spacing: 3px;
      opacity: 0.8;
    }
    .p-links { display: flex; gap: 0.5rem; }
    .icon-btn {
      width: 36px; height: 36px;
      display: flex; align-items: center; justify-content: center;
      background: rgba(255,255,255,0.04);
      border: 1px solid var(--glass-border);
      border-radius: 8px;
      color: var(--text-muted);
      text-decoration: none;
      transition: all 0.3s;
    }
    .icon-btn:hover {
      background: var(--primary);
      border-color: var(--primary);
      color: white;
    }

    .p-title {
      font-size: 1.8rem;
      font-weight: 800;
      letter-spacing: -1px;
      margin-bottom: 1rem;
      line-height: 1.1;
      padding: 0 2rem;
      position: relative;
      z-index: 2;
    }
    .p-desc {
      color: var(--text-muted);
      font-size: 0.85rem;
      line-height: 1.6;
      flex: 1;
      max-height: 90px;
      overflow: hidden;
      mask-image: linear-gradient(to bottom, black 50%, transparent 100%);
      -webkit-mask-image: linear-gradient(to bottom, black 50%, transparent 100%);
      margin-bottom: 1.5rem;
      padding: 0 2rem;
      position: relative;
      z-index: 2;
    }
    .p-desc p { margin: 0 0 0.4rem; }
    .p-desc ul, .p-desc ol { margin: 0.25rem 0 0.4rem 1.2rem; padding: 0; }
    .p-desc li { margin-bottom: 0.2rem; }
    .p-desc strong, .p-desc b { color: var(--text); font-weight: 700; }
    .p-desc h1, .p-desc h2, .p-desc h3 { font-size: 0.9rem; font-weight: 700; color: var(--text); margin: 0 0 0.3rem; }
    .p-tags {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
      margin-bottom: 1.5rem;
      padding: 0 2rem;
      position: relative;
      z-index: 2;
    }
    .tag {
      font-size: 0.65rem;
      font-weight: 700;
      color: var(--secondary);
      background: rgba(34,211,238,0.07);
      border: 1px solid rgba(34,211,238,0.15);
      padding: 0.3rem 0.8rem;
      border-radius: 50px;
    }
    .p-cta {
      display: flex;
      align-items: center;
      justify-content: space-between;
      text-decoration: none;
      margin: 0 2rem 2rem;
      padding: 0.75rem 1rem;
      border-radius: 10px;
      border: 1px solid var(--glass-border);
      background: rgba(255,255,255,0.02);
      transition: border-color 0.3s, background 0.3s;
      position: relative;
      z-index: 2;
    }
    .p-cta:hover {
      border-color: var(--accent, var(--primary));
      background: rgba(192,132,252,0.04);
    }
    .p-cta-text {
      font-size: 0.72rem;
      font-weight: 800;
      letter-spacing: 1.5px;
      color: var(--text-muted);
      text-transform: uppercase;
      transition: color 0.3s;
    }
    .p-cta:hover .p-cta-text { color: var(--accent, var(--primary)); }
    .p-cta-arr {
      width: 28px; height: 28px;
      border-radius: 50%;
      background: var(--glass-border);
      display: flex; align-items: center; justify-content: center;
      color: var(--text-muted);
      transition: background 0.3s, color 0.3s, transform 0.3s;
      flex-shrink: 0;
    }
    .p-cta:hover .p-cta-arr {
      background: var(--accent, var(--primary));
      color: #000;
      transform: translateX(3px);
    }

    :host-context([data-theme="light"]) .project-card {
      background: rgba(255,255,255,.82);
      box-shadow: 0 18px 45px rgba(15,23,42,.08);
    }
    :host-context([data-theme="light"]) .project-card:hover {
      box-shadow: 0 28px 70px rgba(15,23,42,.16), 0 0 42px rgba(192,132,252,.1);
    }
    :host-context([data-theme="light"]) .p-thumb-wrapper {
      background: rgba(241,245,249,.82);
    }
    :host-context([data-theme="light"]) .project-visual {
      background:
        radial-gradient(circle at 80% 20%, color-mix(in srgb, var(--accent) 22%, transparent), transparent 38%),
        linear-gradient(135deg, rgba(255,255,255,.96), rgba(226,232,240,.72));
    }
    :host-context([data-theme="light"]) .project-visual strong { opacity: .62; }
    :host-context([data-theme="light"]) .p-overlay {
      background: linear-gradient(to bottom, transparent 45%, rgba(255,255,255,.92));
    }
    :host-context([data-theme="light"]) .icon-btn,
    :host-context([data-theme="light"]) .p-cta {
      background: rgba(255,255,255,.74);
    }

    /* ─── Responsive ─── */
    @media (max-width: 900px) {
      .projects-grid { grid-template-columns: 1fr; }
    }
    @media (max-width: 600px) {
      .project-card { height: auto; min-height: 480px; }
      .p-title { font-size: 1.4rem; }
      .p-thumb-wrapper { height: 160px; }
    }
  `]
})
export class ProjectsComponent implements OnInit {
  t = inject(TranslationService);
  private projectService = inject(ProjectService);
  activeFilter = signal('all');
  loading = signal(true);

  projects = signal<Project[]>([]);
  filteredProjects = computed(() => {
    const filter = this.activeFilter();
    if (filter === 'all') return this.projects();
    const groups: Record<string, string[]> = {
      frontend: ['angular', 'typescript', 'javascript', 'html', 'css'],
      backend: ['nestjs', 'symfony', 'node.js', 'php', 'postgresql', 'elasticsearch'],
      devops: ['docker', 'jenkins', 'logstash', 'suricata'],
    };
    return this.projects().filter(project =>
      project.tags.some(tag => groups[filter]?.includes(tag.toLowerCase())),
    );
  });

  ngOnInit() {
    this.projectService.getAll().subscribe({
      next: data => {
        this.projects.set(data);
        this.loading.set(false);
      },
      error: err => {
        this.loading.set(false);
        console.error('Failed to load projects', err);
      }
    });
  }

  projectTitle(project: Project) {
    return this.t.currentLang() === 'en' && project.titleEn ? project.titleEn : project.title;
  }

  projectDescription(project: Project) {
    return this.t.currentLang() === 'en' && project.descriptionEn
      ? project.descriptionEn
      : project.description;
  }

  projectMonogram(project: Project) {
    return project.title
      .split(/\s+/)
      .slice(0, 2)
      .map(word => word[0])
      .join('')
      .toUpperCase();
  }
}
