import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="admin-layout">
      <aside class="sidebar">
        <h2 class="gradient-text">ADMIN</h2>
        <nav>
          <a class="active">Dashboard</a>
          <a>Projects</a>
          <a>Experience</a>
          <a>Settings</a>
        </nav>
        <a routerLink="/" class="back-btn">← Back to Site</a>
      </aside>
      
      <main class="content">
        <header>
          <h1>Project Management</h1>
          <button class="btn-premium" (click)="openModal()">+ New Project</button>
        </header>

        <div class="glass-card projects-table">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Tags</th>
                <th>Order</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let p of projects">
                <td>{{ p.title }}</td>
                <td>
                  <span class="tag" *ngFor="let t of p.tags">{{ t }}</span>
                </td>
                <td>{{ p.order }}</td>
                <td class="actions">
                  <button class="edit">Edit</button>
                  <button class="delete">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .admin-layout {
      display: flex;
      min-height: 100vh;
      background: #0a0f1d;
    }
    .sidebar {
      width: 280px;
      border-right: 1px solid var(--glass-border);
      padding: 2.5rem;
      display: flex;
      flex-direction: column;
    }
    .sidebar h2 {
      margin-bottom: 3rem;
      font-size: 1.8rem;
    }
    nav {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      flex: 1;
    }
    nav a {
      padding: 1rem;
      border-radius: 12px;
      color: var(--text-muted);
      cursor: pointer;
      transition: all 0.3s ease;
      
      &:hover, &.active {
        background: rgba(255, 255, 255, 0.05);
        color: white;
      }
      &.active {
        border-left: 3px solid var(--primary);
      }
    }
    .back-btn {
      margin-top: 2rem;
      color: var(--text-muted);
      text-decoration: none;
    }
    .content {
      flex: 1;
      padding: 4rem;
    }
    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 3rem;
    }
    .projects-table {
      padding: 2rem;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th {
      text-align: left;
      color: var(--text-muted);
      font-weight: 500;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid var(--glass-border);
    }
    td {
      padding: 1.5rem 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.03);
    }
    .tag {
      font-size: 0.7rem;
      padding: 0.2rem 0.5rem;
      background: rgba(99, 102, 241, 0.1);
      color: var(--primary);
      border-radius: 4px;
      margin-right: 0.4rem;
    }
    .actions {
      display: flex;
      gap: 1rem;
    }
    .actions button {
      background: none;
      border: none;
      cursor: pointer;
      font-weight: 600;
    }
    .edit { color: var(--primary); }
    .delete { color: var(--accent); }
  `]
})
export class AdminComponent {
  projects = [
    { title: 'AI Platform', tags: ['Angular', 'NestJS'], order: 1 },
    { title: 'Crypto Wallet', tags: ['TS', 'Web3'], order: 2 },
    { title: 'Design System', tags: ['SCSS'], order: 3 },
  ];

  openModal() {
    alert('New Project Modal Placeholder');
  }
}
