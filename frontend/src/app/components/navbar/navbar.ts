import { Component, signal, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="main-nav" [class.scrolled]="isScrolled" [class.open]="isMenuOpen()" aria-label="Navigation principale">
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
    </nav>

    <!-- Mobile drawer — sibling of nav -->
    <div id="mobile-menu" class="drawer" [class.open]="isMenuOpen()" [attr.aria-hidden]="!isMenuOpen()">
      <nav class="drawer-nav" aria-label="Navigation mobile">
        <a class="dl" href="/#about" (click)="goToSection($event, 'about')">
          <span class="dl-num">01</span><span class="dl-label">{{ t.translate('nav.about') }}</span>
        </a>
        <a class="dl" href="/#projects" (click)="goToSection($event, 'projects')">
          <span class="dl-num">02</span><span class="dl-label">{{ t.translate('nav.projects') }}</span>
        </a>
        <a class="dl" routerLink="/blog" routerLinkActive="dl-active" (click)="close()">
          <span class="dl-num">03</span><span class="dl-label">{{ t.translate('nav.blog') }}</span>
        </a>
        <a class="dl" href="/#contact" (click)="goToSection($event, 'contact')">
          <span class="dl-num">04</span><span class="dl-label">{{ t.translate('nav.contact') }}</span>
        </a>
      </nav>
      <footer class="drawer-foot">
        <div class="drawer-lang">
          <button [class.on]="t.currentLang()==='fr'" (click)="t.setLang('fr')">FR</button>
          <span class="sep">/</span>
          <button [class.on]="t.currentLang()==='en'" (click)="t.setLang('en')">EN</button>
        </div>
        <div class="drawer-socials">
          <a href="https://github.com/bmlaghui" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href="https://www.linkedin.com/in/brahimlaghui" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    /* ─── Base ─── */
    .main-nav {
      position: fixed;
      inset: 0 0 auto 0;
      height: 80px;
      z-index: 1000;
      transition: background 0.4s, backdrop-filter 0.4s, border-color 0.4s;
    }
    .main-nav.scrolled {
      background: color-mix(in srgb, var(--bg) 80%, transparent);
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
      gap: 1rem;
    }

    /* ─── Logo ─── */
    .logo {
      display: flex;
      align-items: center;
      gap: 0.9rem;
      text-decoration: none;
      flex-shrink: 0;
    }
    .logo-text { display: flex; align-items: baseline; gap: 0.45rem; }
    .fn { font-weight: 300; font-size: 1.05rem; color: var(--text); letter-spacing: 1px; }
    .ln { font-weight: 800; font-size: 1.05rem; color: var(--text); letter-spacing: 2px; }

    /* ─── Desktop links ─── */
    .links {
      display: flex; list-style: none; margin: 0; padding: 0; gap: 0.5rem;
    }
    .lnk {
      display: flex; align-items: center; gap: 0.5rem;
      padding: 0.5rem 1rem; font-size: 0.78rem; font-weight: 700;
      letter-spacing: 0.5px; color: var(--text); text-decoration: none;
      border-radius: 8px; cursor: pointer; white-space: nowrap;
      transition: color 0.3s, background 0.3s;
    }
    .lnk em { font-style: normal; font-size: 0.55rem; color: var(--secondary); font-weight: 900; opacity: 0.7; }
    .lnk:hover, .lnk.active { color: var(--primary); background: rgba(192,132,252,0.07); }

    /* ─── Controls ─── */
    .controls { display: flex; align-items: center; gap: 0.75rem; flex-shrink: 0; }

    .lang-pill {
      display: flex; background: var(--surface);
      border: 1px solid var(--glass-border); border-radius: 50px; padding: 3px;
    }
    .lang-pill button {
      background: none; border: none; color: var(--text-muted);
      font-size: 0.6rem; font-weight: 900; padding: 4px 10px;
      border-radius: 50px; cursor: pointer; transition: all 0.3s;
    }
    .lang-pill button.on { background: var(--primary); color: #fff; box-shadow: 0 0 12px rgba(192,132,252,0.4); }

    .theme-btn {
      width: 40px; height: 40px; background: var(--surface);
      border: 1px solid var(--glass-border); border-radius: 50%; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      font-size: 1rem; transition: transform 0.3s, border-color 0.3s;
    }
    .theme-btn:hover { transform: rotate(20deg) scale(1.1); border-color: var(--primary); }

    /* ─── Burger (mobile only) ─── */
    .burger {
      display: none;
      width: 42px; height: 42px;
      background: var(--surface);
      border: 1px solid var(--glass-border);
      border-radius: 10px;
      cursor: pointer;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      gap: 5px;
      transition: border-color 0.3s, background 0.3s;
    }
    .burger span {
      display: block; width: 18px; height: 2px;
      background: var(--text); border-radius: 2px;
      transition: transform 0.4s cubic-bezier(0.2,1,0.2,1), opacity 0.3s;
      transform-origin: center;
    }
    .burger.active { border-color: var(--primary); background: rgba(192,132,252,0.08); }
    .burger.active span:first-child { transform: translateY(3.5px) rotate(45deg); }
    .burger.active span:last-child  { transform: translateY(-3.5px) rotate(-45deg); }

    /* ─── Mobile Drawer ─── */
    .drawer {
      position: fixed;
      top: 64px; left: 0; right: 0;
      height: calc(100vh - 64px);
      height: calc(100dvh - 64px);
      background: var(--bg);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      transform: translateX(100%);
      transition: transform 0.45s cubic-bezier(0.16,1,0.3,1), visibility 0s linear 0.45s;
      z-index: 999;
      visibility: hidden;
      pointer-events: none;
    }
    .drawer::after {
      content: '';
      position: fixed;
      top: 64px; right: -15%;
      width: 70vw; height: 70vw;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(192,132,252,0.10) 0%, transparent 65%);
      pointer-events: none;
      z-index: 998;
    }
    .drawer.open {
      transform: translateX(0);
      visibility: visible;
      pointer-events: auto;
      transition: transform 0.45s cubic-bezier(0.16,1,0.3,1);
    }

    /* Drawer nav links */
    .drawer-nav {
      flex: 1;
      min-height: 0;
      display: flex;
      flex-direction: column;
      overflow-y: auto;
      border-top: 1px solid var(--glass-border);
    }
    .dl {
      display: flex;
      align-items: center;
      gap: 1.25rem;
      padding: 1.4rem 2rem;
      border-bottom: 1px solid var(--glass-border);
      text-decoration: none;
      color: var(--text);
      position: relative;
      transition: background 0.25s, color 0.25s, padding-left 0.3s;
    }
    .dl::before {
      content: '';
      position: absolute;
      left: 0; top: 0; bottom: 0;
      width: 3px;
      background: var(--primary);
      border-radius: 0 3px 3px 0;
      transform: scaleY(0);
      transition: transform 0.25s;
    }
    .dl:hover, .dl.dl-active { background: rgba(192,132,252,0.05); color: var(--primary); padding-left: 2.5rem; }
    .dl:hover::before, .dl.dl-active::before { transform: scaleY(1); }
    .dl-num {
      font-size: 0.6rem; font-weight: 900;
      color: var(--secondary); letter-spacing: 3px;
      flex-shrink: 0; min-width: 20px;
      opacity: 0.7;
    }
    .dl-label {
      font-size: clamp(1.5rem, 8vw, 2.4rem);
      font-weight: 800;
      letter-spacing: -0.5px;
      text-transform: uppercase;
      line-height: 1;
    }

    /* Drawer footer */
    .drawer-foot {
      padding: 1rem 2rem;
      border-top: 1px solid var(--glass-border);
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: var(--bg);
    }
    .drawer-lang { display: flex; align-items: center; gap: 0.6rem; }
    .drawer-lang button {
      background: none; border: none; cursor: pointer;
      font-size: 0.7rem; font-weight: 900; letter-spacing: 2px;
      color: var(--text-muted); padding: 0;
      transition: color 0.2s;
    }
    .drawer-lang button.on { color: var(--primary); }
    .drawer-lang .sep { color: var(--text-muted); font-size: 0.65rem; }
    .drawer-socials { display: flex; gap: 1.5rem; }
    .drawer-socials a {
      color: var(--text-muted); text-decoration: none;
      font-size: 0.62rem; font-weight: 700; letter-spacing: 1px;
      text-transform: uppercase; transition: color 0.2s;
    }
    .drawer-socials a:hover { color: var(--primary); }

    /* ─── Responsive ─── */
    @media (max-width: 1000px) {
      .links  { display: none; }
      .burger { display: flex; }
    }

    @media (max-width: 768px) {
      .main-nav { height: 64px; background: color-mix(in srgb, var(--bg) 95%, transparent); border-bottom: 1px solid var(--glass-border); }
      .main-nav.scrolled { backdrop-filter: none; background: color-mix(in srgb, var(--bg) 96%, transparent); }
      .inner { padding: 0 1.25rem; height: 64px; }
      .fn { display: none; }
      .logo { gap: 0.6rem; }
      .brand-monogram { width: 34px; height: 34px; font-size: 0.7rem; }
      .ln { font-size: 0.95rem; }
      .controls { gap: 0.5rem; }
      .lang-pill button { font-size: 0.58rem; padding: 4px 9px; }
      .theme-btn { width: 36px; height: 36px; font-size: 0.9rem; }
    }

    @media (max-width: 480px) {
      .inner { padding: 0 1rem; }
      .theme-btn { display: none; }
      .lang-pill { display: none; }
      .dl { padding: 1.2rem 1.5rem; }
      .dl:hover, .dl.dl-active { padding-left: 2rem; }
      .drawer-foot { padding: 1rem 1.5rem; }
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
