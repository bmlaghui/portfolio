import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="hero">
      <div class="content">
        <h2 class="badge">Available for projects</h2>
        <h1 class="title">
          Building Digital <br />
          <span class="gradient-text">Experiences</span> that Matter
        </h1>
        <p class="description">
          I'm a Fullstack Developer specializing in building exceptional digital experiences.
          Currently, I'm focused on building accessible, human-centered products.
        </p>
        <div class="actions">
          <button class="btn-premium">View Projects</button>
          <button class="btn-outline">Contact Me</button>
        </div>
      </div>
      <div class="visual">
        <div class="blob floating"></div>
      </div>
    </section>
  `,
  styles: [`
    .hero {
      min-height: 100vh;
      display: flex;
      align-items: center;
      padding: 0 10%;
      padding-top: 80px;
      gap: 5%;
    }
    .content {
      flex: 1;
      max-width: 650px;
    }
    .badge {
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 2px;
      color: var(--primary);
      margin-bottom: 1.5rem;
      border: 1px solid rgba(99, 102, 241, 0.3);
      padding: 0.5rem 1rem;
      border-radius: 100px;
      display: inline-block;
      background: rgba(99, 102, 241, 0.05);
    }
    .title {
      font-size: 5.5rem;
      line-height: 1.1;
      margin-bottom: 2rem;
      color: white;
      @media (max-width: 768px) {
        font-size: 3.5rem;
      }
    }
    .description {
      font-size: 1.25rem;
      color: var(--text-muted);
      line-height: 1.7;
      margin-bottom: 3rem;
      max-width: 550px;
    }
    .actions {
      display: flex;
      gap: 1.5rem;
    }
    .btn-outline {
      padding: 12px 28px;
      border-radius: 14px;
      border: 1px solid var(--glass-border);
      background: transparent;
      color: white;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      
      &:hover {
        background: rgba(255, 255, 255, 0.05);
        border-color: white;
      }
    }
    .visual {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
    }
    .blob {
      width: 400px;
      height: 400px;
      background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
      filter: blur(80px);
      border-radius: 50%;
      opacity: 0.4;
    }
  `]
})
export class HeroComponent {}
