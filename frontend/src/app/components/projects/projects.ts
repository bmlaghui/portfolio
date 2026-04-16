import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="projects">
      <div class="header">
        <h2 class="section-title">Featured <span class="gradient-text">Work</span></h2>
        <p>A selection of my favorite projects.</p>
      </div>
      <div class="grid">
        <div class="glass-card project-card" *ngFor="let p of mockProjects">
          <div class="image-placeholder"></div>
          <div class="content">
            <h3>{{ p.title }}</h3>
            <p>{{ p.description }}</p>
            <div class="tags">
              <span class="tag" *ngFor="let tag of p.tags">{{ tag }}</span>
            </div>
            <div class="project-links">
              <a [href]="p.link" target="_blank" class="view-btn">View Case Study</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .projects {
      padding: 100px 10%;
    }
    .header {
      margin-bottom: 4rem;
    }
    .section-title {
      font-size: 3rem;
      margin-bottom: 1rem;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 2.5rem;
    }
    .project-card {
      overflow: hidden;
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    .image-placeholder {
      height: 220px;
      background: rgba(255, 255, 255, 0.03);
      border-bottom: 1px solid var(--glass-border);
    }
    .content {
      padding: 2rem;
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    h3 {
      font-size: 1.5rem;
      margin-bottom: 1rem;
    }
    p {
      color: var(--text-muted);
      line-height: 1.6;
      margin-bottom: 1.5rem;
      font-size: 0.95rem;
    }
    .tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 2rem;
    }
    .tag {
      font-size: 0.75rem;
      background: rgba(255, 255, 255, 0.05);
      padding: 0.3rem 0.8rem;
      border-radius: 6px;
      color: var(--primary);
      border: 1px solid rgba(99, 102, 241, 0.2);
    }
    .project-links {
      margin-top: auto;
    }
    .view-btn {
      color: white;
      text-decoration: none;
      font-size: 0.9rem;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      
      &:after {
        content: '→';
        transition: transform 0.3s ease;
      }
      
      &:hover:after {
        transform: translateX(5px);
      }
    }
  `]
})
export class ProjectsComponent {
  mockProjects = [
    { title: 'AI Platform', description: 'A sophisticated AI-driven analytics platform with real-time data visualization.', tags: ['Angular', 'NestJS', 'TensorFlow'], link: '#' },
    { title: 'Crypto Wallet', description: 'Secure multi-currency wallet with advanced encryption and biometric auth.', tags: ['TypeScript', 'Solidity', 'Web3'], link: '#' },
    { title: 'Design System', description: 'Enterprise-grade design system for scalable web applications.', tags: ['SCSS', 'Storybook', 'Angular'], link: '#' },
  ];
}
