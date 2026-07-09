import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NavbarComponent } from '../../components/navbar/navbar';
import { FooterComponent } from '../../components/footer/footer';
import { BlogPost, BlogService } from '../../services/blog.service';
import { TranslationService } from '../../services/translation.service';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent],
  template: `
    <app-navbar></app-navbar>
    <main class="reading-experience" *ngIf="post()">

      <!-- Hero Banner image -->
      <div class="hero-banner reveal">
         <img *ngIf="post()?.imageUrl" [src]="post()?.imageUrl" [alt]="postTitle()" class="banner-img" />
         <div *ngIf="!post()?.imageUrl" class="banner-visual" aria-hidden="true">
           <span>&lt;/&gt;</span>
           <strong>{{ post()?.tags?.[0] || 'ENGINEERING' }}</strong>
         </div>
         <div class="banner-overlay"></div>
      </div>

      <article class="container narrow article-content">
        <header class="reading-header reveal" style="animation-delay: 0.1s">
           <div class="meta-tag">
              <span class="cat">{{ post()?.tags?.[0] || 'ENGINEERING' }}</span>
              <span class="time">{{ post()?.readTime || 5 }} MIN READ</span>
           </div>
           <h1 class="reading-title">{{ postTitle() }}</h1>
           <div class="reading-meta">
              <span class="date">{{ post()?.createdAt | date:'longDate' }}</span>
              <span class="divider"></span>
              <span class="author">BY BRAHIM MLAGHUI</span>
           </div>
        </header>

        <div class="abstract reveal" style="animation-delay: 0.2s">
           <p>{{ postSummary() }}</p>
        </div>

        <div class="reading-body reveal" style="animation-delay: 0.3s" [innerHTML]="renderedContent()"></div>
        
        <!-- Block-based tags display -->
        <div class="post-tags" *ngIf="post()?.tags?.length">
          <span *ngFor="let tag of post()?.tags" class="post-tag">{{ tag }}</span>
        </div>

        <footer class="reading-footer reveal">
           <div class="glass-card share-box">
              <div class="discussion-action">
                <span>{{ t.currentLang() === 'fr' ? 'POURSUIVRE LA DISCUSSION' : 'CONTINUE THE DISCUSSION' }}</span>
                <a class="linkedin-share" [href]="linkedinShareUrl()" target="_blank" rel="noopener noreferrer"
                   [attr.aria-label]="t.currentLang() === 'fr' ? 'Partager cet article sur LinkedIn' : 'Share this article on LinkedIn'">
                  <b aria-hidden="true">in</b>
                  {{ t.currentLang() === 'fr' ? 'Partager' : 'Share' }}
                </a>
              </div>
              <div class="social-links">
                 <a href="mailto:bmlaghui@gmail.com">EMAIL</a>
                 <a href="https://github.com/bmlaghui" target="_blank" rel="noopener noreferrer">GH</a>
              </div>
           </div>
        </footer>
      </article>
    </main>
    <app-footer></app-footer>
  `,
  styles: [`
    .reading-experience { min-height: 100vh; padding-bottom: 150px; }
    
    /* Hero Banner */
    .hero-banner {
      position: relative;
      width: 100%;
      height: 60vh;
      min-height: 400px;
      margin-bottom: 3rem;
      overflow: hidden;
    }
    .banner-img {
      width: 100%; height: 100%;
      object-fit: cover;
      object-position: center;
    }
    .banner-visual {
      width: 100%; height: 100%;
      display: grid; place-content: center; gap: 1rem; text-align: center;
      background:
        radial-gradient(circle at 50% 35%, rgba(192,132,252,0.28), transparent 32%),
        linear-gradient(145deg, #17172a, #07070c);
    }
    .banner-visual span { font: 800 clamp(5rem, 12vw, 10rem) var(--font-title); color: var(--primary); opacity: 0.8; }
    .banner-visual strong { font-size: 0.75rem; letter-spacing: 6px; color: var(--text-muted); }
    .banner-overlay {
      position: absolute; inset: 0;
      background: linear-gradient(to bottom, transparent 30%, var(--bg) 95%);
    }

    .article-content { margin-top: -8rem; position: relative; z-index: 10; }
    .narrow { max-width: 900px; }
    
    /* Header */
    .reading-header { margin-bottom: 4rem; text-align: center; }
    .meta-tag { display: flex; justify-content: center; gap: 2rem; margin-bottom: 2rem; }
    .cat {
      font-size: 0.7rem; font-weight: 800; color: white; background: var(--primary);
      padding: 0.4rem 1.2rem; border-radius: 50px; letter-spacing: 2px;
    }
    .time { font-size: 0.7rem; color: var(--text-muted); font-weight: 700; align-self: center; }
    
    .reading-title { font-size: 5rem; line-height: 1.1; margin-bottom: 3rem; letter-spacing: -2px; text-shadow: 0 4px 20px rgba(0,0,0,0.5); }
    
    .reading-meta { display: flex; align-items: center; justify-content: center; gap: 1.5rem; color: var(--text-muted); font-size: 0.85rem; font-weight: 600; }
    .divider { width: 30px; height: 1px; background: var(--glass-border); }
    
    /* Body */
    .abstract { font-size: 1.6rem; line-height: 1.6; color: white; font-weight: 500; margin-bottom: 6rem; padding-left: 2rem; border-left: 3px solid var(--primary); }
    
    .reading-body { font-size: 1.2rem; line-height: 1.9; color: var(--text-muted); }
    :host ::ng-deep .reading-body h2 { font-size: 2.2rem; color: var(--text); margin: 4rem 0 2rem; }
    :host ::ng-deep .reading-body p { margin-bottom: 1.6rem; }
    :host ::ng-deep .reading-body ul { margin: 0 0 2rem 1.5rem; }
    :host ::ng-deep .reading-body strong { color: var(--text); }
    :host ::ng-deep .reading-body pre {
      padding: 2rem; margin: 3rem 0; border: 1px solid var(--glass-border);
      border-radius: 16px; background: rgba(0,0,0,0.5); overflow-x: auto;
    }
    /* Block styles */
    :host ::ng-deep .block-paragraph { font-size: 1.15rem; line-height: 1.9; color: var(--text-muted); margin-bottom: 1.8rem; }
    :host ::ng-deep .block-paragraph :is(h2,h3) { color: var(--text); margin: 2.5rem 0 1rem; font-family: var(--font-title); }
    :host ::ng-deep .block-paragraph strong { color: var(--text); }
    :host ::ng-deep .block-code { background: #070710; border: 1px solid var(--glass-border); border-radius: 16px; margin: 3rem 0; overflow: hidden; }
    :host ::ng-deep .block-code .code-head { background: rgba(255,255,255,0.03); padding: 0.8rem 1.5rem; border-bottom: 1px solid var(--glass-border); font-size: 0.65rem; font-weight: 900; color: var(--secondary); letter-spacing: 2px; font-family: 'Fira Code', monospace; }
    :host ::ng-deep .block-code pre { padding: 2rem; margin: 0; overflow-x: auto; }
    :host ::ng-deep .block-code code { font-family: 'Fira Code', monospace; font-size: 0.95rem; color: #a5b4fc; line-height: 1.7; }
    :host ::ng-deep .block-image { margin: 3rem 0; }
    :host ::ng-deep .block-image img { width: 100%; border-radius: 12px; border: 1px solid var(--glass-border); }
    :host ::ng-deep .block-image figcaption { text-align: center; font-size: 0.8rem; color: var(--text-muted); margin-top: 0.75rem; font-style: italic; }
    :host ::ng-deep .block-video { margin: 3rem 0; }
    :host ::ng-deep .block-video :is(iframe, video) { width: 100%; aspect-ratio: 16/9; border-radius: 12px; border: 1px solid var(--glass-border); }
    :host ::ng-deep .block-quote { border-left: 3px solid var(--primary); padding: 1.5rem 2rem; margin: 3rem 0; background: rgba(192,132,252,0.05); border-radius: 0 12px 12px 0; }
    :host ::ng-deep .block-quote p { font-size: 1.25rem; color: #e2e8f0; font-style: italic; line-height: 1.7; margin: 0 0 0.5rem; }
    :host ::ng-deep .block-quote cite { font-size: 0.8rem; color: var(--primary); font-style: normal; font-weight: 700; }
    
    .quote-card { padding: 4rem; margin: 5rem 0; text-align: center; border-color: var(--primary); background: rgba(192,132,252,0.05); }
    .quote-card p { font-size: 2rem; font-family: var(--font-title); color: white; margin: 0; }
    
    .code-cyber { background: rgba(0,0,0,0.5); border: 1px solid var(--glass-border); border-radius: 16px; margin: 5rem 0; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.4); }
    .code-head { background: rgba(255,255,255,0.03); padding: 1rem 2rem; border-bottom: 1px solid var(--glass-border); font-size: 0.7rem; font-weight: 900; color: var(--primary); letter-spacing: 1px; }
    pre { padding: 2.5rem; margin: 0; font-family: 'Fira Code', monospace; font-size: 1rem; color: #a5b4fc; overflow-x: auto; }

    .reading-footer { margin-top: 8rem; }
    .post-tags { display: flex; flex-wrap: wrap; gap: 0.5rem; margin: 3rem 0; }
    .post-tag { font-size: 0.7rem; font-weight: 700; color: var(--primary); border: 1px solid rgba(192,132,252,0.3); border-radius: 20px; padding: 0.35rem 0.9rem; }
    .share-box { padding: 2.5rem 3rem; display: flex; justify-content: space-between; align-items: center; border-radius: 16px; }
    .share-box span { font-size: 0.8rem; font-weight: 800; letter-spacing: 2px; }
    .discussion-action { display: flex; align-items: center; gap: 1.2rem; flex-wrap: wrap; }
    .linkedin-share {
      display: inline-flex; align-items: center; gap: .55rem;
      padding: .55rem .85rem; border: 1px solid rgba(10,102,194,.45); border-radius: 9px;
      color: #fff; background: rgba(10,102,194,.14); text-decoration: none;
      font-size: .72rem; font-weight: 800; transition: .3s ease;
    }
    .linkedin-share b {
      display: grid; place-items: center; width: 22px; height: 22px; border-radius: 5px;
      color: #fff; background: #0a66c2; font: 900 .72rem Arial, sans-serif;
    }
    .linkedin-share:hover { border-color: #0a66c2; background: #0a66c2; transform: translateY(-2px); }
    .social-links { display: flex; gap: 2rem; }
    .social-links a { color: var(--primary); text-decoration: none; font-weight: 900; transition: color 0.3s; &:hover { color: white; } }

    :host-context([data-theme="light"]) .banner-visual {
      background:
        radial-gradient(circle at 50% 35%, rgba(192,132,252,0.16), transparent 32%),
        linear-gradient(145deg, rgba(255,255,255,.96), rgba(226,232,240,.72));
    }
    :host-context([data-theme="light"]) .reading-title {
      text-shadow: none;
    }
    :host-context([data-theme="light"]) .abstract {
      color: var(--text);
    }
    :host-context([data-theme="light"]) ::ng-deep .reading-body pre,
    :host-context([data-theme="light"]) ::ng-deep .block-code,
    :host-context([data-theme="light"]) .code-cyber {
      background: rgba(255,255,255,.86);
      box-shadow: 0 18px 45px rgba(15,23,42,.08);
    }
    :host-context([data-theme="light"]) ::ng-deep .block-code .code-head,
    :host-context([data-theme="light"]) .code-head {
      background: rgba(241,245,249,.78);
    }
    :host-context([data-theme="light"]) ::ng-deep .block-code code,
    :host-context([data-theme="light"]) pre {
      color: #334155;
    }
    :host-context([data-theme="light"]) ::ng-deep .block-quote p,
    :host-context([data-theme="light"]) .quote-card p {
      color: var(--text);
    }
    :host-context([data-theme="light"]) .linkedin-share {
      color: #0a66c2;
      background: rgba(10,102,194,.08);
    }
    :host-context([data-theme="light"]) .linkedin-share:hover {
      color: #fff;
    }

    @media (max-width: 900px) {
      .reading-title { font-size: 3.5rem; }
      .abstract { font-size: 1.3rem; margin-bottom: 4rem; }
      .hero-banner { height: 40vh; }
      .share-box { flex-direction: column; gap: 2rem; }
      .discussion-action { justify-content: center; }
    }
  `]
})
export class BlogDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private blogService = inject(BlogService);
  private sanitizer = inject(DomSanitizer);
  private seo = inject(SeoService);
  t = inject(TranslationService);
  post = signal<BlogPost | null>(null);
  renderedContent = computed<SafeHtml>(() => {
    const post = this.post();
    if (!post) return '';
    // Use blocks if available
    if (post.blocks && post.blocks.length > 0) {
      const isEn = this.t.currentLang() === 'en';
      const blocks = isEn ? post.blocks.filter((b: any) => b.id?.startsWith('en_')) : post.blocks.filter((b: any) => !b.id?.startsWith('en_'));
      const html = blocks.map((b: any) => this.renderBlock(b)).join('');
      return this.sanitizer.bypassSecurityTrustHtml(html);
    }
    const markdown = this.t.currentLang() === 'en' && post.contentEn ? post.contentEn : post.content;
    return this.sanitizer.bypassSecurityTrustHtml(this.renderMarkdown(markdown));
  });

  ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (!slug) return;
    this.blogService.getBySlug(slug).subscribe({
      next: post => {
        this.post.set(post);
        this.seo.setPage({
          title: `${this.postTitle()} — Journal | Brahim MLAGHUI`,
          description: this.postSummary(),
          image: post.imageUrl,
          type: 'article',
          path: `/blog/${post.slug}`,
        });
      },
      error: error => console.error('Failed to load blog post', error),
    });
  }

  postTitle() {
    const post = this.post();
    if (!post) return '';
    return this.t.currentLang() === 'en' && post.titleEn ? post.titleEn : post.title;
  }

  postSummary() {
    const post = this.post();
    if (!post) return '';
    return this.t.currentLang() === 'en' && post.summaryEn ? post.summaryEn : post.summary;
  }

  linkedinShareUrl() {
    if (typeof window === 'undefined') return 'https://www.linkedin.com/';
    return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`;
  }

  private renderBlock(b: any): string {
    switch (b.type) {
      case 'paragraph':
        return `<div class="block-paragraph">${b.content ?? ''}</div>`;
      case 'code':
        const lang = b.language ?? 'code';
        const escaped = (b.content ?? '').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return `<div class="block-code"><div class="code-head">${lang.toUpperCase()}</div><pre><code>${escaped}</code></pre></div>`;
      case 'image':
        const caption = b.caption ? `<figcaption>${b.caption}</figcaption>` : '';
        return `<figure class="block-image"><img src="${b.url}" alt="${b.alt || ''}" loading="lazy">${caption}</figure>`;
      case 'video':
        const embedUrl = this.makeEmbedUrl(b.url ?? '');
        if (!embedUrl) return '';
        const isIframe = embedUrl.includes('youtube') || embedUrl.includes('vimeo');
        return isIframe
          ? `<div class="block-video"><iframe src="${embedUrl}" frameborder="0" allowfullscreen loading="lazy"></iframe></div>`
          : `<div class="block-video"><video src="${b.url}" controls></video></div>`;
      case 'quote':
        const source = b.caption ? `<cite>— ${b.caption}</cite>` : '';
        return `<blockquote class="block-quote"><p>${b.content ?? ''}</p>${source}</blockquote>`;
      default:
        return '';
    }
  }

  private makeEmbedUrl(url: string): string {
    if (!url) return '';
    if (url.includes('youtube.com/watch')) return url.replace('watch?v=', 'embed/');
    if (url.includes('youtu.be/')) return 'https://www.youtube.com/embed/' + url.split('youtu.be/')[1];
    if (url.includes('vimeo.com/')) return 'https://player.vimeo.com/video/' + url.split('vimeo.com/')[1];
    return url;
  }

  private renderMarkdown(markdown: string): string {
    const escape = (value: string) => value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    const inline = (value: string) => escape(value)
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/`([^`]+)`/g, '<code>$1</code>');

    const lines = markdown.split('\n');
    const html: string[] = [];
    let inCode = false;
    let inList = false;
    for (const line of lines) {
      if (line.startsWith('```')) {
        if (inList) { html.push('</ul>'); inList = false; }
        html.push(inCode ? '</code></pre>' : '<pre><code>');
        inCode = !inCode;
      } else if (inCode) {
        html.push(`${escape(line)}\n`);
      } else if (line.startsWith('# ')) {
        continue;
      } else if (line.startsWith('## ')) {
        if (inList) { html.push('</ul>'); inList = false; }
        html.push(`<h2>${inline(line.slice(3))}</h2>`);
      } else if (line.startsWith('- ')) {
        if (!inList) { html.push('<ul>'); inList = true; }
        html.push(`<li>${inline(line.slice(2))}</li>`);
      } else if (line.trim()) {
        if (inList) { html.push('</ul>'); inList = false; }
        html.push(`<p>${inline(line)}</p>`);
      }
    }
    if (inList) html.push('</ul>');
    if (inCode) html.push('</code></pre>');
    return html.join('');
  }
}
