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
      <main>
        <header class="case-hero">
          <div class="container">
            <a routerLink="/" fragment="projects" class="back">← {{ t.currentLang() === 'fr' ? 'Tous les projets' : 'All projects' }}</a>
            <span class="label">CASE STUDY / {{ p.tags[0] }}</span>
            <h1>{{ title() }}</h1>
            <p>{{ description() }}</p>
            <div class="facts">
              <div><small>RÔLE</small><strong>{{ p.role || 'Full-stack' }}</strong></div>
              <div><small>{{ t.currentLang() === 'fr' ? 'DURÉE' : 'DURATION' }}</small><strong>{{ p.duration || '—' }}</strong></div>
              <div><small>STACK</small><strong>{{ p.tags.slice(0, 3).join(' · ') }}</strong></div>
            </div>
          </div>
          <div class="orb" [style.background]="p.accent || 'var(--primary)'"></div>
        </header>

        <div class="container case-body">
          <section>
            <span class="section-num">01 / {{ t.currentLang() === 'fr' ? 'LE DÉFI' : 'THE CHALLENGE' }}</span>
            <h2>{{ t.currentLang() === 'fr' ? 'Comprendre avant de construire.' : 'Understand before building.' }}</h2>
            <p>{{ challenge() || description() }}</p>
          </section>
          <section class="solution glass-card">
            <span class="section-num">02 / {{ t.currentLang() === 'fr' ? 'LA RÉPONSE' : 'THE RESPONSE' }}</span>
            <h2>{{ t.currentLang() === 'fr' ? 'Une solution pensée comme un système.' : 'A solution designed as a system.' }}</h2>
            <p>{{ solution() || description() }}</p>
            <div class="stack">@for (tag of p.tags; track tag) { <span>{{ tag }}</span> }</div>
          </section>
          <section>
            <span class="section-num">03 / IMPACT</span>
            <h2>{{ t.currentLang() === 'fr' ? 'Des résultats lisibles.' : 'Outcomes that speak clearly.' }}</h2>
            <div class="results">
              @for (result of results(); track result; let i = $index) {
                <article><b>0{{ i + 1 }}</b><p>{{ result }}</p></article>
              }
            </div>
          </section>
          <aside>
            <span>{{ t.currentLang() === 'fr' ? 'Un projet à transformer ?' : 'A project to transform?' }}</span>
            <h2>{{ t.currentLang() === 'fr' ? 'Construisons la prochaine étude de cas.' : 'Let’s build the next case study.' }}</h2>
            <a routerLink="/" fragment="contact">{{ t.currentLang() === 'fr' ? 'Démarrer une conversation' : 'Start a conversation' }} →</a>
          </aside>
        </div>
      </main>
    } @else {
      <main class="loading container">Chargement de l’étude de cas…</main>
    }
    <app-footer />
  `,
  styles: [`
    .case-hero{min-height:780px;padding:12rem 0 7rem;position:relative;overflow:hidden;display:flex;align-items:center}.case-hero .container{position:relative;z-index:2}
    .back{display:inline-block;color:var(--text-muted);text-decoration:none;margin-bottom:5rem;font-size:.8rem}.label,.section-num{display:block;color:var(--secondary);font:900 .62rem var(--font-title);letter-spacing:4px;margin-bottom:2rem}
    h1{font-size:clamp(4rem,9vw,9rem);line-height:.9;max-width:1100px;letter-spacing:-5px;margin:0 0 2rem}.case-hero p{max-width:750px;font-size:1.35rem;color:var(--text-muted);line-height:1.7}
    .facts{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;margin-top:5rem;border-top:1px solid var(--glass-border);padding-top:2rem;max-width:900px}.facts small,.facts strong{display:block}.facts small{color:var(--text-muted);font-size:.55rem;letter-spacing:2px;margin-bottom:.6rem}.facts strong{font-size:.82rem}
    .orb{position:absolute;width:500px;height:500px;border-radius:50%;right:-120px;top:140px;filter:blur(140px);opacity:.18}
    .case-body>section{padding:8rem 0;max-width:1050px}.case-body h2,.case-body aside h2{font-size:clamp(2.5rem,5vw,5.3rem);line-height:1.02;margin:0 0 2.5rem}.case-body section>p{font-size:1.3rem;line-height:1.9;color:var(--text-muted);max-width:820px}
    .solution{padding:5rem!important;max-width:none!important;margin:2rem 0}.stack{display:flex;gap:.7rem;flex-wrap:wrap;margin-top:3rem}.stack span{border:1px solid var(--glass-border);padding:.55rem 1rem;border-radius:99px;font-size:.7rem;color:var(--text-muted)}
    .results{display:grid;grid-template-columns:repeat(3,1fr);gap:1.2rem}.results article{border-top:1px solid var(--primary);padding:2rem 0}.results b{color:var(--secondary);font-size:.65rem}.results p{font-size:1.1rem;line-height:1.5}
    aside{margin:4rem 0 10rem;padding:5rem;border-radius:28px;background:linear-gradient(135deg,color-mix(in srgb,var(--primary) 17%,var(--surface)),var(--surface));border:1px solid var(--glass-border)}aside span{color:var(--secondary);font-size:.7rem;font-weight:900;letter-spacing:2px}aside h2{max-width:850px;margin-top:1.5rem!important}aside a{display:inline-block;background:var(--primary);color:#fff;text-decoration:none;padding:1rem 1.4rem;border-radius:12px;font-weight:800}
    .loading{padding:15rem 0;min-height:70vh}
    @media(max-width:750px){.case-hero{min-height:700px;padding-top:9rem}h1{letter-spacing:-2px}.facts,.results{grid-template-columns:1fr}.solution,aside{padding:2rem!important}.case-body>section{padding:5rem 0}}
  `]
})
export class ProjectDetailComponent implements OnInit {
  t = inject(TranslationService);
  private route = inject(ActivatedRoute);
  private service = inject(ProjectService);
  private seo = inject(SeoService);
  private analytics = inject(AnalyticsService);
  project = signal<Project | null>(null);
  title = computed(() => this.localized('title', 'titleEn'));
  description = computed(() => this.localized('description', 'descriptionEn'));
  challenge = computed(() => this.localized('challenge', 'challengeEn'));
  solution = computed(() => this.localized('solution', 'solutionEn'));
  results = computed(() => {
    const p = this.project();
    return (this.t.currentLang() === 'en' && p?.resultsEn?.length ? p.resultsEn : p?.results) || [];
  });

  ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug')!;
    this.service.getBySlug(slug).subscribe(project => {
      this.project.set(project);
      this.seo.setPage({ title: `${this.title()} — Case study | Brahim MLAGHUI`, description: this.description(), image: project.imageUrl, path: `/projects/${slug}` });
      this.analytics.track('project_view', { resource: 'project', resourceId: String(project.id), path: `/projects/${slug}` });
    });
  }

  private localized(fr: keyof Project, en: keyof Project) {
    const p = this.project();
    return String((this.t.currentLang() === 'en' && p?.[en] ? p[en] : p?.[fr]) || '');
  }
}
