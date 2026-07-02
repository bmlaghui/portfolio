import { Component, signal, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav [class.scrolled]="isScrolled" [class.open]="isMenuOpen()" aria-label="Navigation principale">
      <div class="inner">

        <!-- Logo -->
        <a class="logo" routerLink="/" aria-label="Retour à l’accueil">
          <span class="brand-monogram" aria-hidden="true"><span>BM</span></span>
          <div class="logo-text">
            <span class="fn">Brahim</span>
            <span class="ln">MLAGHUI</span>
          </div>
        </a>

        <!-- Desktop links -->
        <ul class="links" role="list">
          <li><a class="lnk" href="/#about" [class.active]="activeSection()==='about'" (click)="goToSection($event, 'about')"><em>01</em>{{ t.translate('nav.about') }}</a></li>
          <li><a class="lnk" href="/#projects" [class.active]="activeSection()==='projects'" (click)="goToSection($event, 'projects')"><em>02</em>{{ t.translate('nav.projects') }}</a></li>
          <li><a class="lnk" routerLink="/blog" routerLinkActive="active"><em>03</em>{{ t.translate('nav.blog') }}</a></li>
          <li><a class="lnk" href="/#contact" [class.active]="activeSection()==='contact'" (click)="goToSection($event, 'contact')"><em>04</em>{{ t.translate('nav.contact') }}</a></li>
        </ul>

        <!-- Right controls -->
        <div class="controls">
          <!-- Lang toggle -->
          <div class="lang-pill">
            <button [class.on]="t.currentLang()==='fr'" (click)="t.setLang('fr')" [attr.aria-pressed]="t.currentLang()==='fr'">FR</button>
            <button [class.on]="t.currentLang()==='en'" (click)="t.setLang('en')" [attr.aria-pressed]="t.currentLang()==='en'">EN</button>
          </div>

          <!-- Theme toggle -->
          <button class="theme-btn" (click)="toggleTheme()" [attr.aria-label]="isDark() ? 'Activer le thème clair' : 'Activer le thème sombre'">
            <span>{{ isDark() ? '🌙' : '☀️' }}</span>
          </button>

          <!-- Burger -->
          <button class="burger" (click)="toggleMenu()" [class.active]="isMenuOpen()"
                  aria-label="Menu" aria-controls="mobile-menu" [attr.aria-expanded]="isMenuOpen()">
            <span></span><span></span>
          </button>
        </div>
      </div>

      <!-- Mobile drawer -->
      <div id="mobile-menu" class="drawer" [class.open]="isMenuOpen()" [attr.aria-hidden]="!isMenuOpen()">
        <nav class="drawer-links" aria-label="Navigation mobile">
          <a class="dl" href="/#about" (click)="goToSection($event, 'about')"><em>01</em>{{ t.translate('nav.about').toUpperCase() }}</a>
          <a class="dl" href="/#projects" (click)="goToSection($event, 'projects')"><em>02</em>{{ t.translate('nav.projects').toUpperCase() }}</a>
          <a class="dl" routerLink="/blog" routerLinkActive="active" (click)="close()"><em>03</em>{{ t.translate('nav.blog').toUpperCase() }}</a>
          <a class="dl" href="/#contact" (click)="goToSection($event, 'contact')"><em>04</em>{{ t.translate('nav.contact').toUpperCase() }}</a>
        </nav>
        <footer class="drawer-foot">
          <div class="socials">
            <a href="https://github.com/bmlaghui" target="_blank" rel="noopener noreferrer">GH</a>
            <a href="https://www.linkedin.com/in/brahimlaghui" target="_blank" rel="noopener noreferrer">LN</a>
          </div>
          <small>© 2026 Brahim MLAGHUI</small>
        </footer>
      </div>
    </nav>
  `,
  styles: [`
    /* ─── Base ─── */
    nav {
      position: fixed;
      inset: 0 0 auto 0;
      height: 80px;
      z-index: 1000;
      transition: background 0.5s ease, height 0.5s ease, backdrop-filter 0.5s ease;
    }
    nav.scrolled {
      background: color-mix(in srgb, var(--bg) 78%, transparent);
      backdrop-filter: blur(22px);
      border-bottom: 1px solid var(--glass-border);
    }

    /* ─── Inner row ─── */
    .inner {
      position: relative;
      z-index: 1001;
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 2.5rem;
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 2rem;
    }

    /* ─── Logo ─── */
    .logo {
      display: flex;
      align-items: center;
      gap: 1rem;
      cursor: pointer;
      text-decoration: none;
      flex-shrink: 0;
    }
    .logo-text {
      display: flex;
      align-items: baseline;
      gap: 0.5rem;
    }
    .fn { font-weight: 300; font-size: 1.05rem; color: var(--text); letter-spacing: 1px; }
    .ln { font-weight: 800; font-size: 1.05rem; color: var(--text); letter-spacing: 2px; }

    /* ─── Desktop links ─── */
    .links {
      display: flex;
      list-style: none;
      margin: 0; padding: 0;
      gap: 0.5rem;
    }
    .lnk {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      font-size: 0.78rem;
      font-weight: 700;
      letter-spacing: 0.5px;
      color: var(--text);
      text-decoration: none;
      border-radius: 8px;
      cursor: pointer;
      transition: color 0.3s, background 0.3s;
      white-space: nowrap;
    }
    .lnk em {
      font-style: normal;
      font-size: 0.55rem;
      color: var(--secondary);
      font-weight: 900;
      margin-right: 2px;
      opacity: 0.7;
    }
    .lnk:hover, .lnk.active { color: var(--primary); background: rgba(192,132,252,0.07); }
    .lnk.active::after {
      content: ''; width: 4px; height: 4px; border-radius: 50%; background: var(--primary);
    }

    /* ─── Controls ─── */
    .controls {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex-shrink: 0;
    }

    /* Lang pill */
    .lang-pill {
      display: flex;
      background: var(--surface);
      border: 1px solid var(--glass-border);
      border-radius: 50px;
      padding: 3px;
    }
    .lang-pill button {
      background: none;
      border: none;
      color: var(--text-muted);
      font-size: 0.6rem;
      font-weight: 900;
      padding: 4px 10px;
      border-radius: 50px;
      cursor: pointer;
      transition: all 0.3s;
    }
    .lang-pill button.on {
      background: var(--primary);
      color: white;
      box-shadow: 0 0 12px rgba(192,132,252,0.4);
    }

    /* Theme button */
    .theme-btn {
      width: 40px; height: 40px;
      background: var(--surface);
      border: 1px solid var(--glass-border);
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1rem;
      transition: transform 0.3s, border-color 0.3s;
    }
    .theme-btn:hover { transform: rotate(20deg) scale(1.1); border-color: var(--primary); }

    /* Burger */
    .burger {
      display: none;
      flex-direction: column;
      gap: 5px;
      width: 40px; height: 40px;
      background: none;
      border: none;
      cursor: pointer;
      align-items: center;
      justify-content: center;
    }
    .burger span {
      display: block;
      width: 22px; height: 2px;
      background: var(--text);
      border-radius: 2px;
      transition: transform 0.4s cubic-bezier(0.2,1,0.2,1);
    }
    .burger.active span:first-child { transform: translateY(3.5px) rotate(45deg); }
    .burger.active span:last-child  { transform: translateY(-3.5px) rotate(-45deg); }

    /* ─── Mobile Drawer ─── */
    .drawer {
      position: fixed;
      inset: 0;
      background: var(--bg);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      padding: 4rem 3rem;
      transform: translateX(100%);
      transition: transform 0.7s cubic-bezier(0.2,1,0.2,1);
      z-index: 900;
      visibility: hidden;
      pointer-events: none;
    }
    .drawer.open { transform: translateX(0); visibility: visible; pointer-events: auto; }

    .drawer-links {
      display: flex;
      flex-direction: column;
      gap: 2.5rem;
    }
    .dl {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      font-size: clamp(2rem, 8vw, 3.5rem);
      font-weight: 800;
      letter-spacing: -2px;
      color: var(--text);
      text-decoration: none;
      cursor: pointer;
      transition: color 0.3s, padding-left 0.3s;
    }
    .dl em {
      font-style: normal;
      font-size: 0.9rem;
      color: var(--secondary);
      letter-spacing: 2px;
      font-weight: 700;
    }
    .dl:hover, .dl.active { color: var(--primary); padding-left: 0.5rem; }

    .drawer-foot {
      position: absolute;
      bottom: 3rem; left: 3rem; right: 3rem;
      border-top: 1px solid var(--glass-border);
      padding-top: 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .socials { display: flex; gap: 1.5rem; }
    .socials a { color: var(--text); text-decoration: none; font-weight: 900; font-size: 0.75rem; }
    .drawer-foot small { font-size: 0.55rem; color: var(--text-muted); letter-spacing: 1px; }

    /* ─── Responsive ─── */
    @media (max-width: 1000px) {
      .links  { display: none; }
      .burger { display: flex; }
    }

    @media (max-width: 600px) {
      .inner { padding: 0 1.1rem; gap: 0.75rem; }
      .logo { gap: 0.7rem; }
      .logo-text .fn { display: none; }
      .theme-btn { display: none; }
      .controls { gap: 0.35rem; }
      .drawer { padding-inline: 1.5rem; }
      .drawer-foot { left: 1.5rem; right: 1.5rem; }
      .dl { font-size: clamp(1.8rem, 10vw, 3rem); }
    }
  `]
})
export class NavbarComponent {
  t = inject(TranslationService);
  isScrolled = false;
  isDark = signal(true);
  isMenuOpen = signal(false);
  activeSection = signal('home');

  @HostListener('window:scroll')
  onScroll() {
    this.isScrolled = window.scrollY > 20;
    const sections = ['about', 'projects', 'experience', 'education', 'blog', 'contact'];
    const current = sections
      .map(id => document.getElementById(id))
      .filter((section): section is HTMLElement => !!section)
      .filter(section => section.offsetTop <= window.scrollY + 180)
      .at(-1);
    this.activeSection.set(current?.id || 'home');
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    if (this.isMenuOpen()) this.close();
  }

  toggleTheme() {
    this.isDark.update(v => !v);
    document.documentElement.setAttribute('data-theme', this.isDark() ? 'dark' : 'light');
  }

  toggleMenu() {
    this.isMenuOpen.update(v => !v);
    document.body.style.overflow = this.isMenuOpen() ? 'hidden' : '';
  }

  close() {
    this.isMenuOpen.set(false);
    document.body.style.overflow = '';
  }

  goToSection(event: Event, id: string) {
    const section = document.getElementById(id);
    if (!section) return;
    event.preventDefault();
    this.close();
    section.scrollIntoView({ behavior: 'smooth' });
  }
}
