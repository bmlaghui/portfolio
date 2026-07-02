import { CommonModule } from '@angular/common';
import { Component, HostListener, computed, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';
import { BlogService } from '../../../services/blog.service';
import { ProjectService } from '../../../services/project.service';
import { SkillsService } from '../../../services/skills.service';
import { TranslationService } from '../../../services/translation.service';

interface SearchItem {
  type: 'Projet' | 'Article' | 'Expertise';
  title: string;
  subtitle: string;
  url: string;
}

@Component({
  selector: 'app-global-search',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <button class="search-trigger" type="button" (click)="open()" aria-label="Ouvrir la recherche">
      <span>⌕</span><kbd>⌘ K</kbd>
    </button>

    @if (opened()) {
      <div class="backdrop" (mousedown)="close()" role="presentation">
        <section class="palette" role="dialog" aria-modal="true" aria-label="Recherche globale" (mousedown)="$event.stopPropagation()">
          <div class="input-row">
            <span>⌕</span>
            <input #searchInput autofocus [value]="query()" (input)="query.set(searchInput.value)"
              [placeholder]="t.currentLang() === 'fr' ? 'Rechercher un projet, un article, une expertise…' : 'Search projects, articles, expertise…'">
            <kbd>ESC</kbd>
          </div>
          <div class="results">
            @if (loading()) {
              <p class="state">Recherche dans le portfolio…</p>
            } @else if (!results().length) {
              <p class="state">{{ t.currentLang() === 'fr' ? 'Aucun résultat.' : 'No results.' }}</p>
            } @else {
              @for (item of results(); track item.type + item.title) {
                <a [routerLink]="item.url" (click)="close()">
                  <span class="kind">{{ item.type }}</span>
                  <span><strong>{{ item.title }}</strong><small>{{ item.subtitle }}</small></span>
                  <b>↗</b>
                </a>
              }
            }
          </div>
          <footer><span>↑↓ naviguer</span><span>Entrée ouvrir</span><span>Ctrl/⌘ K</span></footer>
        </section>
      </div>
    }
  `,
  styles: [`
    .search-trigger{position:fixed;right:1.25rem;bottom:1.25rem;z-index:800;border:1px solid var(--glass-border);background:color-mix(in srgb,var(--surface) 88%,transparent);backdrop-filter:blur(16px);color:var(--text);border-radius:14px;padding:.65rem .75rem;display:flex;align-items:center;gap:.65rem;box-shadow:0 12px 35px rgba(0,0,0,.2);cursor:pointer}
    .search-trigger span{font-size:1.25rem}.search-trigger kbd,.input-row kbd{font:700 .62rem monospace;color:var(--text-muted);border:1px solid var(--glass-border);border-radius:6px;padding:.25rem .4rem}
    .backdrop{position:fixed;inset:0;z-index:3000;background:rgba(4,3,12,.72);backdrop-filter:blur(8px);display:grid;place-items:start center;padding:14vh 1rem 1rem}
    .palette{width:min(680px,100%);background:var(--bg);border:1px solid color-mix(in srgb,var(--primary) 35%,var(--glass-border));border-radius:22px;overflow:hidden;box-shadow:0 30px 100px rgba(0,0,0,.55)}
    .input-row{display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:1rem;padding:1.1rem 1.25rem;border-bottom:1px solid var(--glass-border)}
    input{border:0;outline:0;background:none;color:var(--text);font:600 1rem inherit;width:100%}input::placeholder{color:var(--text-muted)}
    .results{max-height:420px;overflow:auto;padding:.55rem}
    .results a{display:grid;grid-template-columns:80px 1fr auto;gap:1rem;align-items:center;padding:.85rem 1rem;border-radius:13px;color:var(--text);text-decoration:none}
    .results a:hover{background:color-mix(in srgb,var(--primary) 10%,var(--surface))}
    .kind{font-size:.58rem;font-weight:900;letter-spacing:1px;color:var(--secondary);text-transform:uppercase}
    strong,small{display:block}strong{font-size:.9rem}small{color:var(--text-muted);font-size:.72rem;margin-top:.2rem}.results b{color:var(--primary)}
    .state{text-align:center;color:var(--text-muted);padding:3rem 1rem}
    footer{display:flex;gap:1rem;padding:.65rem 1.2rem;border-top:1px solid var(--glass-border);color:var(--text-muted);font-size:.62rem}
    @media(max-width:650px){.search-trigger kbd{display:none}.results a{grid-template-columns:65px 1fr auto}.backdrop{padding-top:6rem}}
  `]
})
export class GlobalSearchComponent {
  t = inject(TranslationService);
  private blog = inject(BlogService);
  private projects = inject(ProjectService);
  private skills = inject(SkillsService);
  private router = inject(Router);
  opened = signal(false);
  loading = signal(false);
  query = signal('');
  items = signal<SearchItem[]>([]);
  results = computed(() => {
    const q = this.query().trim().toLocaleLowerCase();
    return (q ? this.items().filter(item =>
      `${item.title} ${item.subtitle} ${item.type}`.toLocaleLowerCase().includes(q)
    ) : this.items()).slice(0, 9);
  });

  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent) {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      this.opened() ? this.close() : this.open();
    } else if (event.key === 'Escape') this.close();
  }

  open() {
    this.opened.set(true);
    if (this.items().length) return;
    this.loading.set(true);
    forkJoin({
      projects: this.projects.getAll(),
      posts: this.blog.getAll(),
      skills: this.skills.getAll(),
    }).subscribe({
      next: ({ projects, posts, skills }) => {
        const en = this.t.currentLang() === 'en';
        this.items.set([
          ...projects.map(p => ({ type: 'Projet' as const, title: en && p.titleEn ? p.titleEn : p.title, subtitle: p.tags.join(' · '), url: `/projects/${p.slug || p.id}` })),
          ...posts.map(p => ({ type: 'Article' as const, title: en && p.titleEn ? p.titleEn : p.title, subtitle: p.tags.join(' · '), url: `/blog/${p.slug}` })),
          ...skills.map(s => ({ type: 'Expertise' as const, title: s.name, subtitle: s.category, url: '/#about' })),
        ]);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  close() {
    this.opened.set(false);
    this.query.set('');
  }
}
