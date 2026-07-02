import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AdminAuthService } from '../services/admin-auth.service';
import { MessagingStateService } from '../services/messaging-state.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="admin-shell" [class.sidebar-open]="isSidebarOpen()">
      <div class="sidebar-overlay" (click)="isSidebarOpen.set(false)"></div>

      <aside class="sidebar">
        <div class="sidebar-header">
          <span class="logo-text">ADMIN<span class="dot">.</span></span>
        </div>
        
        <nav class="sidebar-nav">
          <a routerLink="/admin/dashboard" routerLinkActive="active" class="nav-item">
            <span class="icon">📊</span> DASHBOARD
          </a>
          <a routerLink="/admin/projects" routerLinkActive="active" class="nav-item">
            <span class="icon">📁</span> PROJETS
          </a>
          <a routerLink="/admin/experience" routerLinkActive="active" class="nav-item">
            <span class="icon">💼</span> EXPÉRIENCE
          </a>
          <a routerLink="/admin/education" routerLinkActive="active" class="nav-item">
            <span class="icon">🎓</span> ÉDUCATION
          </a>
          <a routerLink="/admin/blog" routerLinkActive="active" class="nav-item">
            <span class="icon">✍️</span> BLOG
          </a>
          <a routerLink="/admin/skills" routerLinkActive="active" class="nav-item">
            <span class="icon">⚡</span> SKILLS
          </a>
          <a routerLink="/admin/profile" routerLinkActive="active" class="nav-item">
            <span class="icon">👤</span> PROFIL
          </a>
          <a routerLink="/admin/testimonials" routerLinkActive="active" class="nav-item">
            <span class="icon">💬</span> TÉMOIGNAGES
          </a>
          <a routerLink="/admin/audience" routerLinkActive="active" class="nav-item">
            <span class="icon">◎</span> AUDIENCE
          </a>
          <a routerLink="/admin/messages" routerLinkActive="active" class="nav-item">
            <span class="icon">✉️</span> MESSAGES
            <span class="unread-badge" *ngIf="msgState.unreadCount() > 0">{{ msgState.unreadCount() }}</span>
          </a>
        </nav>

        <div class="sidebar-footer">
          <button (click)="logout()" class="btn-logout">DÉCONNEXION</button>
        </div>
      </aside>

      <main class="content-area">
        <header class="top-bar">
          <div class="left-actions">
            <button class="hamburger-btn" (click)="isSidebarOpen.set(!isSidebarOpen())">
               <span class="bar"></span><span class="bar"></span><span class="bar"></span>
            </button>
            <div class="user-info">
              <span class="welcome">BONJOUR, <strong>{{ auth.currentUser()?.name | uppercase }}</strong></span>
            </div>
          </div>
          <div class="actions">
            <a href="/" target="_blank" class="view-site">VOIR LE SITE ↗</a>
          </div>
        </header>

        <section class="page-container">
          <router-outlet></router-outlet>
        </section>
      </main>
    </div>
  `,
  styles: [`
    :host { --sidebar-width: 280px; --topbar-height: 80px; --primary: #c084fc; --bg: #050505; }
    
    .admin-shell { display: flex; min-height: 100vh; background: var(--bg); color: #e2e8f0; font-family: 'Inter', sans-serif; }

    .sidebar {
      width: var(--sidebar-width);
      background: rgba(8, 9, 18, 0.85);
      backdrop-filter: blur(30px) saturate(180%);
      border-right: 1px solid rgba(255,255,255,0.06);
      display: flex;
      flex-direction: column;
      position: fixed;
      height: 100vh;
      z-index: 100;
    }
    .sidebar::after { content: ""; position: absolute; inset: 0; background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.1) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03)); background-size: 100% 4px, 3px 100%; pointer-events: none; z-index: 101; opacity: 0.2; }

    .sidebar-header { padding: 3rem 2rem; text-align: center; }
    .logo-text { font-weight: 950; font-size: 1.6rem; letter-spacing: 6px; color: #fff; text-shadow: 0 0 20px rgba(192, 132, 252, 0.4); }
    .dot { color: var(--primary); }

    .sidebar-nav { flex: 1; padding: 1rem; display: flex; flex-direction: column; gap: 0.4rem; z-index: 102; }
    .nav-item {
      display: flex; align-items: center; padding: 1rem 1.4rem; border-radius: 12px; color: #64748b;
      text-decoration: none; transition: 0.3s; gap: 1.2rem; font-weight: 950; font-size: 0.65rem; letter-spacing: 1.5px;
    }
    .nav-item:hover { background: rgba(255,255,255,0.02); color: #fff; }
    .nav-item.active { background: var(--primary); color: #000; box-shadow: 0 0 25px rgba(192, 132, 252, 0.3); }
    .unread-badge { background: #ef4444; color: #fff; font-size: 0.6rem; font-weight: 950; padding: 0.1rem 0.6rem; border-radius: 20px; margin-left: auto; box-shadow: 0 0 15px rgba(239, 68, 68, 0.5); }

    .sidebar-footer { padding: 2rem 1rem; border-top: 1px solid rgba(255,255,255,0.03); z-index: 102; }
    .btn-logout {
      width: 100%; padding: 1rem; border: 1px solid rgba(239, 68, 68, 0.2); background: rgba(239, 68, 68, 0.02);
      color: #ef4444; border-radius: 12px; cursor: pointer; transition: 0.3s; font-weight: 950; font-size: 0.65rem; letter-spacing: 2px;
    }
    .btn-logout:hover { background: #ef4444; color: #fff; box-shadow: 0 0 20px rgba(239, 68, 68, 0.4); }

    .content-area { flex: 1; margin-left: var(--sidebar-width); display: flex; flex-direction: column; }
    .top-bar {
      height: var(--topbar-height); background: rgba(5, 5, 5, 0.7); backdrop-filter: blur(20px);
      border-bottom: 1px solid rgba(255,255,255,0.04); display: flex; align-items: center;
      justify-content: space-between; padding: 0 3rem; position: sticky; top: 0; z-index: 90;
    }
    .welcome { font-size: 0.7rem; font-weight: 950; color: #475569; letter-spacing: 1px; }
    .welcome strong { color: #fff; }

    .view-site {
      color: var(--primary); text-decoration: none; font-size: 0.7rem; font-weight: 950;
      padding: 0.7rem 1.5rem; border: 1px solid rgba(192, 132, 252, 0.3); border-radius: 8px; transition: 0.3s; letter-spacing: 1px;
    }
    .view-site:hover { background: var(--primary); color: #000; box-shadow: 0 0 20px rgba(192, 132, 252, 0.2); }

    .page-container { padding: 3rem; flex: 1; overflow-x: hidden; }

    .sidebar-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.8); z-index: 95; opacity: 0; pointer-events: none; transition: 0.4s; backdrop-filter: blur(10px); }
    .hamburger-btn { display: none; flex-direction: column; gap: 5px; background: none; border: none; cursor: pointer; padding: 10px; }
    .hamburger-btn .bar { width: 24px; height: 1.5px; background: #fff; border-radius: 2px; transition: 0.3s; }

    @media (max-width: 1024px) {
      .sidebar { transform: translateX(-100%); transition: 0.5s cubic-bezier(0.4, 0, 0.2, 1); }
      .admin-shell.sidebar-open .sidebar { transform: translateX(0); }
      .admin-shell.sidebar-open .sidebar-overlay { opacity: 1; pointer-events: auto; }
      .content-area { margin-left: 0; }
      .hamburger-btn { display: flex; }
      .top-bar { padding: 0 1.5rem; height: 70px; }
      .page-container { padding: 1.5rem; }
      .left-actions { display: flex; align-items: center; gap: 1rem; }
    }
  `]
})
export class AdminLayoutComponent implements OnInit {
  auth = inject(AdminAuthService);
  router = inject(Router);
  msgState = inject(MessagingStateService);
  isSidebarOpen = signal(false);

  ngOnInit() {
    this.msgState.refresh();
    this.router.events.subscribe(() => this.isSidebarOpen.set(false));
  }

  logout() {
    this.auth.logout();
  }
}
