import { Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslationService } from '../../services/translation.service';
import { BlogService, BlogPost } from '../../services/blog.service';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="blog-section" id="blog">
      <div class="container">

        <header class="section-header reveal">
           <div>
             <div class="sec-label">
                <span class="dash"></span>
                <span class="num">05</span>
                <span class="word">JOURNAL</span>
             </div>
             <h2 class="sec-title">
               {{ t.currentLang() === 'fr' ? 'Dernières' : 'Latest' }}
               <span class="gradient-text">{{ t.currentLang() === 'fr' ? 'analyses.' : 'Insights.' }}</span>
             </h2>
           </div>
           <div class="header-actions">
             <a class="btn-secondary" routerLink="/blog">
               {{ t.currentLang() === 'fr' ? 'Explorer le journal' : 'Explore Journal' }}
               <span class="btn-icon" aria-hidden="true">→</span>
             </a>
             <div class="slider-controls" aria-label="Navigation des articles">
               <button type="button" (click)="slide(-1)" [attr.aria-label]="t.currentLang() === 'fr' ? 'Articles précédents' : 'Previous articles'">←</button>
               <button type="button" (click)="slide(1)" [attr.aria-label]="t.currentLang() === 'fr' ? 'Articles suivants' : 'Next articles'">→</button>
             </div>
           </div>
        </header>
        
        <div class="blog-track" #blogTrack [attr.aria-busy]="loading()" (scroll)="updateActiveSlide()">
          <div class="skeleton-card" *ngFor="let item of loading() ? [1,2,3] : []" aria-hidden="true">
            <div class="skeleton-block"></div>
            <div class="skeleton-line title"></div>
            <div class="skeleton-line"></div>
            <div class="skeleton-line short"></div>
          </div>
          <article class="glass-card post-card reveal" *ngFor="let post of posts; let i = index"
                   [style.animation-delay]="(i * 0.08) + 's'" [attr.aria-label]="postTitle(post)">
            
             <!-- Thumbnail -->
             <div class="p-thumb-wrapper" [class.generated]="!post.imageUrl">
               <img *ngIf="post.imageUrl" [src]="post.imageUrl" [alt]="postTitle(post)" class="p-thumb" />
               <div *ngIf="!post.imageUrl" class="article-visual" aria-hidden="true">
                 <span>&lt;/&gt;</span>
                 <strong>{{ post.tags[0] }}</strong>
               </div>
               <div class="cat-pill">{{ post.tags[0] || 'ENGINEERING' }}</div>
             </div>

             <div class="p-content">
               <div class="post-meta">
                  <span class="read-time">{{ post.readTime || 5 }} MIN {{ t.currentLang() === 'fr' ? 'DE LECTURE' : 'READ' }}</span>
               </div>
               <h3>{{ postTitle(post) }}</h3>
               <p>{{ postSummary(post) }}</p>
               
               <div class="card-footer">
                  <span class="post-date">{{ postDate(post) }}</span>
                  <a [routerLink]="['/blog', post.slug]" class="read-link">{{ t.currentLang() === 'fr' ? 'LIRE' : 'READ MORE' }} →</a>
               </div>
             </div>
             
          </article>
        </div>
        <div class="slider-progress" *ngIf="posts.length">
          <button *ngFor="let post of posts; let i = index" type="button"
                  [class.active]="activeSlide() === i" (click)="goToSlide(i)"
                  [attr.aria-label]="(t.currentLang() === 'fr' ? 'Aller à l’article ' : 'Go to article ') + (i + 1)"></button>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .blog-section { padding: 8rem 0; }

    .sec-label {
      display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem;
    }
    .dash { display: block; width: 40px; height: 1px; background: var(--primary); }
    .num  { font-size: 0.65rem; font-weight: 900; color: var(--secondary); letter-spacing: 3px; }
    .word { font-size: 0.65rem; font-weight: 900; letter-spacing: 4px; color: var(--text-muted); text-transform: uppercase; }

    .section-header {
      display: flex; 
      justify-content: space-between; 
      align-items: flex-end; 
      margin-bottom: 5rem; 
    }
    .header-actions { display: flex; align-items: center; gap: 1rem; }
    .slider-controls { display: flex; gap: 0.5rem; }
    .slider-controls button {
      width: 46px; height: 46px; border-radius: 50%;
      border: 1px solid var(--glass-border);
      background: var(--surface);
      color: var(--text);
      font-size: 1.1rem;
      cursor: pointer;
      transition: .3s ease;
    }
    .slider-controls button:hover {
      color: #fff;
      border-color: var(--primary);
      background: var(--primary);
      transform: translateY(-2px);
    }
    .sec-title { font-size: clamp(2.5rem, 4.5vw, 4.5rem); letter-spacing: -2px; font-weight: 800; line-height: 1; margin: 0; }
    
    .blog-track {
      display: grid;
      grid-auto-flow: column;
      grid-auto-columns: minmax(320px, 390px);
      gap: 1.5rem;
      padding: 0.25rem 0 2rem;
      overflow-x: auto;
      overscroll-behavior-inline: contain;
      scroll-snap-type: inline mandatory;
      scroll-behavior: smooth;
      scrollbar-width: none;
    }
    .blog-track::-webkit-scrollbar { display: none; }
    
    .post-card {
      padding: 0;
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: hidden;
      border-radius: 16px;
      transition: transform 0.3s, box-shadow 0.3s;
      scroll-snap-align: start;
    }
    .post-card:hover { transform: translateY(-5px); box-shadow: 0 20px 40px rgba(0,0,0,0.3); }

    .p-thumb-wrapper {
      position: relative;
      height: 200px;
      overflow: hidden;
      background: rgba(255,255,255,0.02);
      border-bottom: 1px solid var(--glass-border);
    }
    .p-thumb {
      width: 100%; height: 100%; object-fit: cover;
      opacity: 0.8; transition: transform 0.5s, opacity 0.5s;
    }
    .article-visual {
      width: 100%;
      height: 100%;
      display: grid;
      place-content: center;
      gap: 0.35rem;
      text-align: center;
      background:
        radial-gradient(circle at 50% 30%, rgba(34,211,238,0.2), transparent 35%),
        linear-gradient(145deg, #151526, #09090f);
    }
    .article-visual span { font: 800 3rem var(--font-title); color: var(--secondary); opacity: 0.85; }
    .article-visual strong { font-size: 0.65rem; letter-spacing: 4px; color: var(--text-muted); }
    .post-card:hover .p-thumb { transform: scale(1.05); opacity: 1; }
    
    .cat-pill {
      position: absolute;
      top: 1rem; left: 1rem;
      font-size: 0.55rem;
      font-weight: 800;
      color: white;
      background: var(--primary);
      padding: 0.3rem 0.8rem;
      border-radius: 50px;
      letter-spacing: 1px;
      box-shadow: 0 4px 10px rgba(0,0,0,0.5);
    }

    .p-content { padding: 2rem; display: flex; flex-direction: column; flex: 1; }
    
    .post-meta { margin-bottom: 1rem; }
    .read-time { font-size: 0.6rem; color: var(--text-muted); font-weight: 700; letter-spacing: 1px; }
    
    h3 { font-size: 1.5rem; font-weight: 800; margin-bottom: 1rem; line-height: 1.2; letter-spacing: -0.5px; }
    p { color: var(--text-muted); line-height: 1.6; margin-bottom: 2rem; flex: 1; font-size: 0.95rem; }
    
    .card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 1.5rem;
      border-top: 1px solid var(--glass-border);
    }
    .post-date { font-size: 0.7rem; color: var(--text-muted); font-weight: 600; }
    .read-link {
      font-family: var(--font-title);
      font-weight: 900;
      font-size: 0.7rem;
      color: var(--secondary);
      text-decoration: none;
      transition: color 0.3s ease, transform 0.3s ease;
    }
    .read-link:hover { color: var(--primary); transform: translateX(3px); }

    .slider-progress {
      display: flex;
      justify-content: center;
      gap: 0.55rem;
      margin-top: 1rem;
    }
    .slider-progress button {
      width: 7px; height: 7px;
      padding: 0;
      border: 0;
      border-radius: 99px;
      background: var(--glass-border);
      cursor: pointer;
      transition: width .3s ease, background .3s ease;
    }
    .slider-progress button.active { width: 28px; background: var(--primary); }

    @media (max-width: 900px) {
      .section-header { flex-direction: column; align-items: flex-start; gap: 2rem; margin-bottom: 3rem; }
      .header-actions { width: 100%; justify-content: space-between; }
      .blog-track { grid-auto-columns: minmax(285px, 86vw); }
    }
    @media (max-width: 520px) {
      .header-actions { align-items: stretch; }
      .slider-controls { display: none; }
      .btn-secondary { width: 100%; }
    }
  `]
})
export class BlogComponent implements OnInit {
  @ViewChild('blogTrack') blogTrack?: ElementRef<HTMLElement>;
  t = inject(TranslationService);
  private blogService = inject(BlogService);

  posts: BlogPost[] = [];
  loading = signal(true);
  activeSlide = signal(0);

  ngOnInit() {
    this.blogService.getAll().subscribe({
      next: data => {
        this.posts = data.slice(0, 5);
        this.loading.set(false);
      },
      error: err => {
        this.loading.set(false);
        console.error('Failed to load blog posts', err);
      }
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
      month: 'short',
      year: 'numeric',
    }).format(new Date(post.createdAt));
  }

  slide(direction: number) {
    const track = this.blogTrack?.nativeElement;
    if (!track) return;
    track.scrollBy({ left: direction * Math.min(track.clientWidth * 0.85, 410), behavior: 'smooth' });
  }

  goToSlide(index: number) {
    const track = this.blogTrack?.nativeElement;
    const card = track?.querySelector<HTMLElement>('.post-card');
    if (!track || !card) return;
    track.scrollTo({ left: index * (card.offsetWidth + 24), behavior: 'smooth' });
  }

  updateActiveSlide() {
    const track = this.blogTrack?.nativeElement;
    const card = track?.querySelector<HTMLElement>('.post-card');
    if (!track || !card) return;
    const index = Math.round(track.scrollLeft / (card.offsetWidth + 24));
    this.activeSlide.set(Math.max(0, Math.min(index, this.posts.length - 1)));
  }
}
