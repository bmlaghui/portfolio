import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslationService } from '../../services/translation.service';
import { FormsModule } from '@angular/forms';
import { NewsletterService } from '../../services/newsletter.service';
import { AnalyticsService } from '../../core/services/analytics.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <footer class="site-footer">
      <!-- Top wave separator -->
      <div class="separator"></div>

      <div class="container footer-grid">

        <!-- Brand column -->
        <div class="brand-col">
          <div class="footer-logo">
            <span class="brand-monogram small" aria-hidden="true"><span>BM</span></span>
            <div class="f-name">
              <span class="fn">Brahim</span>
              <span class="ln">MLAGHUI</span>
            </div>
          </div>
          <p class="tagline">
            {{ t.currentLang() === 'fr' ? 'Tech Lead & développeur Full-Stack.' : 'Technical Lead & Full-Stack Developer.' }}
            <br>Angular · Symfony · NestJS · Docker
          </p>
          <div class="avail-badge">
            <span class="dot"></span>
            {{ t.currentLang() === 'fr' ? 'Ouvert aux opportunités' : 'Open to opportunities' }}
          </div>
        </div>

        <!-- Nav column -->
        <div class="nav-col">
          <span class="col-title">NAVIGATION</span>
          <a class="f-link" href="/#about" (click)="scrollTo($event, 'about')">{{ t.translate('nav.about') }}</a>
          <a class="f-link" href="/#projects" (click)="scrollTo($event, 'projects')">{{ t.translate('nav.projects') }}</a>
          <a class="f-link" routerLink="/blog">{{ t.translate('nav.blog') }}</a>
          <a class="f-link" href="/#contact" (click)="scrollTo($event, 'contact')">{{ t.translate('nav.contact') }}</a>
        </div>

        <!-- Social column -->
        <div class="nav-col">
          <span class="col-title">SOCIAL</span>
          <a class="f-link" href="https://github.com/bmlaghui" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a class="f-link" href="https://www.linkedin.com/in/brahimlaghui" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        </div>

        <!-- Tech stack column -->
        <div class="nav-col">
          <span class="col-title">STACK</span>
          <span class="f-link static">Angular 21</span>
          <span class="f-link static">Symfony</span>
          <span class="f-link static">NestJS</span>
          <span class="f-link static">PostgreSQL</span>
          <span class="f-link static">Docker</span>
        </div>
      </div>

      <div class="container newsletter">
        <div>
          <span class="col-title">FIELD NOTES</span>
          <h3>{{ t.currentLang() === 'fr' ? 'Une idée utile, de temps en temps.' : 'One useful idea, occasionally.' }}</h3>
          <p>{{ t.currentLang() === 'fr' ? 'Architecture, Angular et retours de terrain. Sans bruit.' : 'Architecture, Angular and field notes. No noise.' }}</p>
        </div>
        <form (ngSubmit)="subscribe()">
          <label class="sr-only" for="newsletter-email">Email</label>
          <input id="newsletter-email" type="email" name="email" [(ngModel)]="email" required placeholder="vous@email.com">
          <button type="submit" [disabled]="sending">{{ sending ? '…' : (t.currentLang() === 'fr' ? 'S’inscrire' : 'Subscribe') }} →</button>
          @if (newsletterMessage) { <small [class.error]="newsletterError">{{ newsletterMessage }}</small> }
        </form>
      </div>

      <!-- Bottom bar -->
      <div class="container footer-bottom">
        <span>© {{ year }} Brahim MLAGHUI — Tech Lead & Full-Stack Developer.</span>
        <div class="misc">
          <a routerLink="/admin" class="admin-link-sub">Admin</a>
          <span>|</span>
          <span>Made with Angular 21</span>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .site-footer {
      border-top: 1px solid var(--glass-border);
      padding-top: 6rem;
      position: relative;
    }

    .separator {
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 1px;
      background: linear-gradient(90deg, transparent, var(--primary), var(--secondary), transparent);
      opacity: 0.4;
    }

    /* Grid */
    .footer-grid {
      display: grid;
      grid-template-columns: 1.6fr 1fr 1fr 1fr;
      gap: 4rem;
      padding-bottom: 5rem;
    }

    /* Brand */
    .footer-logo {
      display: flex;
      align-items: center;
      gap: 0.8rem;
      margin-bottom: 1.5rem;
    }
    .f-name { display: flex; align-items: baseline; gap: 0.4rem; }
    .fn { font-weight: 300; font-size: 1rem; color: var(--text); }
    .ln { font-weight: 800; font-size: 1rem; color: var(--text); letter-spacing: 2px; }

    .tagline {
      color: var(--text-muted);
      font-size: 0.85rem;
      line-height: 1.7;
      margin-bottom: 1.5rem;
    }

    .avail-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.6rem;
      padding: 0.4rem 1rem;
      background: rgba(74,222,128,0.07);
      border: 1px solid rgba(74,222,128,0.2);
      border-radius: 50px;
      font-size: 0.65rem;
      font-weight: 800;
      letter-spacing: 1px;
      color: #4ade80;
    }
    .avail-badge .dot {
      width: 6px; height: 6px;
      background: #4ade80;
      border-radius: 50%;
      box-shadow: 0 0 8px #4ade80;
      animation: pulse-glow 2s infinite;
    }

    /* Nav columns */
    .nav-col {
      display: flex;
      flex-direction: column;
      gap: 0.9rem;
    }
    .col-title {
      font-size: 0.55rem;
      font-weight: 900;
      letter-spacing: 3px;
      color: var(--secondary);
      margin-bottom: 0.5rem;
    }
    .f-link {
      color: var(--text-muted);
      font-size: 0.9rem;
      font-weight: 600;
      text-decoration: none;
      cursor: pointer;
      transition: color 0.3s;
      width: fit-content;
    }
    .f-link:hover { color: var(--text); }
    .f-link.static { cursor: default; }
    .f-link.static:hover { color: var(--text-muted); }

    /* Bottom bar */
    .footer-bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 2rem 0;
      border-top: 1px solid rgba(255,255,255,0.05);
      font-size: 0.75rem;
      color: var(--text-muted);
    }
    .newsletter{border-top:1px solid var(--glass-border);padding:3rem 0;display:grid;grid-template-columns:1.3fr 1fr;gap:4rem;align-items:center}
    .newsletter h3{font-size:1.6rem;margin:.5rem 0}.newsletter p{color:var(--text-muted);font-size:.8rem}
    .newsletter form{display:grid;grid-template-columns:1fr auto;gap:.6rem}.newsletter input{min-width:0;background:var(--surface);border:1px solid var(--glass-border);border-radius:11px;color:var(--text);padding:.9rem 1rem;outline:none}.newsletter input:focus{border-color:var(--primary)}
    .newsletter button{border:0;border-radius:11px;background:var(--primary);color:#fff;font-weight:800;padding:.9rem 1.1rem;cursor:pointer}.newsletter button:disabled{opacity:.6}
    .newsletter small{grid-column:1/-1;color:#4ade80}.newsletter small.error{color:#fb7185}
    .misc { display: flex; gap: 1rem; align-items: center; }
    .misc-link { color: var(--text-muted); text-decoration: none; transition: color 0.3s; }
    .misc-link:hover { color: var(--primary); }

    /* Responsive */
    @media (max-width: 1000px) {
      .footer-grid { grid-template-columns: 1fr 1fr; gap: 3rem; }
      .brand-col { grid-column: 1 / -1; }
    }
    @media (max-width: 600px) {
      .footer-grid { grid-template-columns: 1fr 1fr; gap: 2rem; }
      .footer-bottom { flex-direction: column; gap: 1rem; text-align: center; }
      .newsletter{grid-template-columns:1fr;gap:1.5rem}.newsletter form{grid-template-columns:1fr}
    }
  `]
})
export class FooterComponent {
  t = inject(TranslationService);
  private newsletter = inject(NewsletterService);
  private analytics = inject(AnalyticsService);
  year = new Date().getFullYear();
  email = '';
  sending = false;
  newsletterMessage = '';
  newsletterError = false;

  subscribe() {
    if (!this.email || this.sending) return;
    this.sending = true;
    this.newsletterMessage = '';
    this.newsletter.subscribe(this.email, this.t.currentLang()).subscribe({
      next: () => {
        this.newsletterError = false;
        this.newsletterMessage = this.t.currentLang() === 'fr' ? 'Inscription confirmée. Merci !' : 'Subscription confirmed. Thank you!';
        this.analytics.track('newsletter_signup', { resource: 'newsletter' });
        this.email = '';
        this.sending = false;
      },
      error: () => {
        this.newsletterError = true;
        this.newsletterMessage = this.t.currentLang() === 'fr' ? 'Impossible de vous inscrire pour le moment.' : 'Could not subscribe right now.';
        this.sending = false;
      }
    });
  }

  scrollTo(event: Event, id: string) {
    const section = document.getElementById(id);
    if (!section) return;
    event.preventDefault();
    section.scrollIntoView({ behavior: 'smooth' });
  }
}
