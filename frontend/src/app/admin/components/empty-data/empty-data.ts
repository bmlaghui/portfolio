import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-empty-data',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="empty-state glass-card">
      <div class="icon-container">
        <span class="icon">{{ icon }}</span>
      </div>
      <h3>{{ title }}</h3>
      <p>{{ description }}</p>
      <button *ngIf="showAction" class="btn-primary-outline" (click)="action.emit()">
        {{ actionLabel }}
      </button>
    </div>
  `,
  styles: [`
    .empty-state {
      padding: 4rem 2rem;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.5rem;
      background: rgba(255, 255, 255, 0.02);
      border: 1px dashed rgba(255, 255, 255, 0.1);
      margin: 2rem 0;
    }
    .icon-container {
      width: 80px;
      height: 80px;
      background: rgba(192, 132, 252, 0.1);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2.5rem;
    }
    h3 { font-size: 1.5rem; color: #f8fafc; margin: 0; }
    p { color: #94a3b8; max-width: 300px; line-height: 1.6; margin: 0; }
    .btn-primary-outline {
      background: transparent;
      border: 1px solid #c084fc;
      color: #c084fc;
      padding: 0.6rem 1.5rem;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s;
    }
    .btn-primary-outline:hover {
      background: #c084fc;
      color: #000;
    }
  `]
})
export class EmptyDataComponent {
  @Input() icon = '📂';
  @Input() title = 'Aucune donnée';
  @Input() description = 'Commencez par ajouter un nouvel élément pour voir apparaître vos données ici.';
  @Input() showAction = true;
  @Input() actionLabel = 'Ajouter';
  
  @Output() action = new EventEmitter<void>();
}
