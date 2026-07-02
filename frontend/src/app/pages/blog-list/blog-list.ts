import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar';
import { FooterComponent } from '../../components/footer/footer';
import { BlogPost, BlogService } from '../../services/blog.service';
import { TranslationService } from '../../services/translation.service';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent],
  template: `
    <app-navbar></app-navbar>
    <main class="journal-page container">
      <header class="page-header reveal">
        <span class="label">05 / JOURNAL</span>
        <h1 class="page-title">{{ t.currentLang() === 'fr' ? 'Carnet' : 'Engineering' }} <span class="gradient-text">{{ t.currentLang() === 'fr' ? 'technique.' : 'Journal.' }}</span></h1>
        <p class="summary">{{ t.currentLang() === 'fr' ? 'Retours d’expérience et analyses sur Angular, NestJS et l’architecture de produits web modernes.' : 'Field notes and deep dives into Angular, NestJS, and modern web product architecture.' }}</p>
      </header>

      <section class="journal-tools reveal" aria-label="Filtres du journal">
        <label class="search-box">
          <span aria-hidden="true">⌕</span>
          <input type="search" [value]="search()" (input)="setSearch($any($event.target).value)"
                 [placeholder]="t.currentLang() === 'fr' ? 'Rechercher un article…' : 'Search articles…'">
        </label>
        <div class="filter-row">
          <button *ngFor="let category of categories" type="button"
                  [class.active]="activeCategory() === category"
                  [attr.aria-pressed]="activeCategory() === category"
                  (click)="setCategory(category)">
            {{ category === 'all' ? (t.currentLang() === 'fr' ? 'Tous' : 'All') : category }}
          </button>
        </div>
        <span class="result-count">{{ filteredPosts().length }} {{ t.currentLang() === 'fr' ? 'article(s)' : 'article(s)' }}</span>
      </section>

      <div class="journal-grid" [attr.aria-busy]="loading()">
        <div class="skeleton-card" *ngFor="let item of loading() ? [1,2,3] : []" aria-hidden="true">
          <div class="skeleton-block"></div>
          <div class="skeleton-line title"></div>
          <div class="skeleton-line"></div>
          <div class="skeleton-line short"></div>
        </div>
        <article class="glass-card post-card reveal" *ngFor="let post of paginatedPosts(); let i = index" [style.animation-delay]="(i * 0.08) + 's'">
           
           <!-- Thumbnail -->
           <div class="p-thumb-wrapper">
             <img *ngIf="post.imageUrl" [src]="post.imageUrl" [alt]="postTitle(post)" class="p-thumb" />
             <div *ngIf="!post.imageUrl" class="article-visual" aria-hidden="true">
               <span>&lt;/&gt;</span>
               <strong>{{ post.tags[0] }}</strong>
             </div>
             <div class="cat-pill">{{ post.tags[0] || 'ENGINEERING' }}</div>
           </div>

           <div class="p-content">
             <div class="post-meta">
                <span class="read-time">{{ post.readTime || 5 }} MIN READ</span>
             </div>
             <h3>{{ postTitle(post) }}</h3>
             <p>{{ postSummary(post) }}</p>
             <div class="post-footer">
                <span class="date">{{ postDate(post) }}</span>
                <a [routerLink]="['/blog', post.slug]" class="read-link">{{ t.currentLang() === 'fr' ? 'LIRE' : 'READ' }} →</a>
             </div>
           </div>
           
        </article>
        <div class="empty-state" *ngIf="!loading() && filteredPosts().length === 0">
          <span>⌕</span>
          <h2>{{ t.currentLang() === 'fr' ? 'Aucun article trouvé' : 'No articles found' }}</h2>
          <p>{{ t.currentLang() === 'fr' ? 'Essayez un autre mot-clé ou filtre.' : 'Try another keyword or filter.' }}</p>
        </div>
      </div>

      <nav class="pagination" *ngIf="totalPages() > 1" [attr.aria-label]="t.currentLang() === 'fr' ? 'Pagination du blog' : 'Blog pagination'">
        <button type="button" (click)="changePage(activePage() - 1)" [disabled]="activePage() === 1" aria-label="Page précédente">←</button>
        <button *ngFor="let page of pageNumbers()" type="button" (click)="changePage(page)"
                [class.active]="activePage() === page" [attr.aria-current]="activePage() === page ? 'page' : null">
          {{ page }}
        </button>
        <button type="button" (click)="changePage(activePage() + 1)" [disabled]="activePage() === totalPages()" aria-label="Page suivante">→</button>
      </nav>
    </main>
    <app-footer></app-footer>
  `,
  styles: [`
    .journal-page { padding-top: 200px; min-height: 100vh; }
    .page-header { margin-bottom: 4rem; }
    .label { font-family: var(--font-title); font-size: 0.7rem; color: var(--secondary); letter-spacing: 4px; display: block; margin-bottom: 2rem; }
    .page-title { font-size: 6rem; line-height: 1; margin-bottom: 2rem; letter-spacing: -2px; }
    .summary { font-size: 1.5rem; color: var(--text-muted); max-width: 700px; }

    .journal-tools {
      display: grid;
      grid-template-columns: minmax(260px, 420px) 1fr auto;
      gap: 1.25rem;
      align-items: center;
      margin-bottom: 4rem;
      padding: 1rem;
      border: 1px solid var(--glass-border);
      border-radius: 20px;
      background: var(--surface);
      backdrop-filter: blur(18px);
    }
    .search-box {
      display: flex;
      align-items: center;
      gap: .8rem;
      min-height: 48px;
      padding: 0 .9rem;
      border: 1px solid var(--glass-border);
      border-radius: 14px;
      background: color-mix(in srgb, var(--bg) 72%, transparent);
    }
    .search-box span { color: var(--secondary); font-size: 1.4rem; }
    .search-box input {
      width: 100%;
      border: 0;
      outline: 0;
      color: var(--text);
      background: transparent;
      font: inherit;
    }
    .filter-row { display: flex; gap: .5rem; flex-wrap: wrap; }
    .filter-row button {
      padding: .6rem .9rem;
      border: 1px solid transparent;
      border-radius: 999px;
      color: var(--text-muted);
      background: transparent;
      font-weight: 700;
      cursor: pointer;
      transition: .25s ease;
    }
    .filter-row button:hover, .filter-row button.active {
      color: var(--text);
      border-color: var(--glass-border);
      background: rgba(192,132,252,.1);
    }
    .result-count { color: var(--text-muted); font-size: .78rem; white-space: nowrap; }
    
    .journal-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
      gap: 3rem;
      padding-bottom: 150px;
    }
    
    .post-card {
      padding: 0;
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: hidden;
      border-radius: 20px;
      transition: transform 0.3s, box-shadow 0.3s;
    }
    .post-card:hover { transform: translateY(-6px); box-shadow: 0 25px 50px rgba(0,0,0,0.4); }

    .p-thumb-wrapper {
      position: relative;
      height: 240px;
      overflow: hidden;
      background: rgba(255,255,255,0.02);
      border-bottom: 1px solid var(--glass-border);
    }
    .p-thumb {
      width: 100%; height: 100%; object-fit: cover;
      opacity: 0.8; transition: transform 0.6s, opacity 0.6s;
    }
    .article-visual {
      width: 100%; height: 100%;
      display: grid; place-content: center; gap: 0.5rem; text-align: center;
      background:
        radial-gradient(circle at 50% 30%, rgba(192,132,252,0.24), transparent 38%),
        linear-gradient(145deg, #161627, #08080e);
    }
    .article-visual span { font: 800 4rem var(--font-title); color: var(--primary); }
    .article-visual strong { font-size: 0.65rem; letter-spacing: 4px; color: var(--text-muted); }
    .post-card:hover .p-thumb { transform: scale(1.05); opacity: 1; }
    
    .cat-pill {
      position: absolute;
      top: 1.5rem; left: 1.5rem;
      font-size: 0.6rem;
      font-weight: 800;
      color: white;
      background: var(--primary);
      padding: 0.4rem 1rem;
      border-radius: 50px;
      letter-spacing: 1px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.4);
    }

    .p-content { padding: 2.5rem; display: flex; flex-direction: column; flex: 1; }
    
    .post-meta { display: flex; justify-content: flex-end; margin-bottom: 1rem; }
    .read-time { font-size: 0.65rem; color: var(--text-muted); font-weight: 700; letter-spacing: 1px; }
    
    h3 { font-size: 1.8rem; margin-bottom: 1rem; line-height: 1.2; letter-spacing: -0.5px; }
    p { color: var(--text-muted); font-size: 1.05rem; line-height: 1.7; margin-bottom: 2rem; flex: 1; }
    
    .post-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 1.5rem;
      border-top: 1px solid var(--glass-border);
    }
    .date { font-size: 0.8rem; color: var(--text-muted); font-weight: 600; }
    .read-link {
      font-family: var(--font-title);
      font-weight: 900;
      font-size: 0.75rem;
      color: var(--secondary);
      text-decoration: none;
      transition: color 0.3s ease, transform 0.3s ease;
    }
    .read-link:hover { color: var(--primary); transform: translateX(5px); }

    .empty-state {
      grid-column: 1 / -1;
      padding: 5rem 2rem;
      text-align: center;
      border: 1px dashed var(--glass-border);
      border-radius: 20px;
      color: var(--text-muted);
    }
    .empty-state span { display: block; color: var(--primary); font-size: 3rem; }
    .empty-state h2 { color: var(--text); margin: 1rem 0 .5rem; }
    .empty-state p { margin: 0; }

    .pagination {
      display: flex;
      justify-content: center;
      gap: .6rem;
      padding: 0 0 8rem;
    }
    .pagination button {
      width: 44px; height: 44px;
      border: 1px solid var(--glass-border);
      border-radius: 12px;
      color: var(--text-muted);
      background: var(--surface);
      font-weight: 800;
      cursor: pointer;
      transition: .25s ease;
    }
    .pagination button:hover:not(:disabled), .pagination button.active {
      color: #fff;
      border-color: var(--primary);
      background: var(--primary);
      transform: translateY(-2px);
    }
    .pagination button:disabled { opacity: .35; }

    @media (max-width: 900px) {
      .journal-grid { grid-template-columns: 1fr; }
      .page-title { font-size: 3.5rem; }
      .p-thumb-wrapper { height: 200px; }
      .journal-tools { grid-template-columns: 1fr; }
      .result-count { padding-inline: .25rem; }
    }
  `]
})
export class BlogListComponent implements OnInit {
  t = inject(TranslationService);
  private blogService = inject(BlogService);
  private seo = inject(SeoService);
  posts = signal<BlogPost[]>([]);
  loading = signal(true);
  search = signal('');
  activeCategory = signal('all');
  activePage = signal(1);
  readonly pageSize = 6;
  readonly categories = ['all', 'Angular', 'Backend', 'Architecture', 'Leadership', 'DevOps'];

  filteredPosts = computed(() => {
    const query = this.search().trim().toLocaleLowerCase();
    const category = this.activeCategory().toLocaleLowerCase();
    return this.posts().filter(post => {
      const localizedText = [
        post.title, post.titleEn, post.summary, post.summaryEn, ...post.tags,
      ].filter(Boolean).join(' ').toLocaleLowerCase();
      const matchesQuery = !query || localizedText.includes(query);
      const matchesCategory = category === 'all' ||
        post.tags.some(tag => tag.toLocaleLowerCase() === category);
      return matchesQuery && matchesCategory;
    });
  });
  totalPages = computed(() => Math.max(1, Math.ceil(this.filteredPosts().length / this.pageSize)));
  paginatedPosts = computed(() => {
    const start = (this.activePage() - 1) * this.pageSize;
    return this.filteredPosts().slice(start, start + this.pageSize);
  });
  pageNumbers = computed(() => Array.from({ length: this.totalPages() }, (_, index) => index + 1));

  ngOnInit() {
    this.seo.setPage({
      title: 'Journal engineering — Brahim MLAGHUI',
      description: 'Analyses et retours d’expérience sur Angular, NestJS, l’architecture logicielle et le leadership technique.',
      path: '/blog',
    });
    this.blogService.getAll().subscribe({
      next: posts => {
        this.posts.set(posts);
        this.loading.set(false);
      },
      error: error => {
        this.loading.set(false);
        console.error('Failed to load blog posts', error);
      },
    });
  }

  postTitle(post: BlogPost) {
    return this.t.currentLang() === 'en' && post.titleEn ? post.titleEn : post.title;
  }

  postSummary(post: BlogPost) {
    return this.t.currentLang() === 'en' && post.summaryEn ? post.summaryEn : post.summary;
  }

  postDate(post: BlogPost) {
    return new Intl.DateTimeFormat(this.t.currentLang() === 'fr' ? 'fr-FR' : 'en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(post.createdAt));
  }

  setSearch(value: string) {
    this.search.set(value);
    this.activePage.set(1);
  }

  setCategory(category: string) {
    this.activeCategory.set(category);
    this.activePage.set(1);
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages()) return;
    this.activePage.set(page);
    window.scrollTo({ top: 430, behavior: 'smooth' });
  }
}
