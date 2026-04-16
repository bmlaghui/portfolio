import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar">
      <div class="logo">
        <span class="gradient-text">PORTFOLIO</span>
      </div>
      <div class="links">
        <a routerLink="/" fragment="about">About</a>
        <a routerLink="/" fragment="projects">Projects</a>
        <a routerLink="/" fragment="contact">Contact</a>
        <a routerLink="/admin" class="admin-btn">Admin</a>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem 5%;
      position: fixed;
      top: 0;
      width: 100%;
      z-index: 1000;
      backdrop-filter: blur(15px);
      -webkit-backdrop-filter: blur(15px);
      background: rgba(15, 23, 42, 0.6);
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }
    .logo {
      font-family: 'Outfit', sans-serif;
      font-weight: 800;
      font-size: 1.5rem;
      letter-spacing: 1px;
    }
    .links {
      display: flex;
      gap: 2.5rem;
      align-items: center;
    }
    a {
      text-decoration: none;
      color: var(--text-muted);
      font-weight: 500;
      transition: all 0.3s ease;
      cursor: pointer;
      font-size: 0.95rem;
      
      &:hover {
        color: var(--text);
      }
    }
    .admin-btn {
      padding: 0.5rem 1.2rem;
      border: 1px solid var(--primary);
      border-radius: 12px;
      color: var(--primary) !important;
      
      &:hover {
        background: var(--primary);
        color: white !important;
        box-shadow: 0 0 15px var(--primary-glow);
      }
    }
  `]
})
export class NavbarComponent {}
