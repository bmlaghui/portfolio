import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer>
      <div class="divider"></div>
      <div class="footer-content">
        <p>© 2026 Portfolio. Built with <span class="gradient-text">Angular</span> & <span class="gradient-text">NestJS</span></p>
        <div class="socials">
          <a href="#">Github</a>
          <a href="#">LinkedIn</a>
          <a href="#">Twitter</a>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    footer {
      padding: 2rem 10% 4rem;
    }
    .divider {
      height: 1px;
      background: linear-gradient(90deg, transparent, var(--glass-border), transparent);
      margin-bottom: 3rem;
    }
    .footer-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: var(--text-muted);
      font-size: 0.9rem;
    }
    .socials {
      display: flex;
      gap: 2rem;
    }
    a {
      color: var(--text-muted);
      text-decoration: none;
      transition: color 0.3s ease;
      &:hover {
        color: white;
      }
    }
  `]
})
export class FooterComponent {}
