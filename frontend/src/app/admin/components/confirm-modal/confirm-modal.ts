import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="cm-overlay" *ngIf="visible" (click)="onCancel()">
      <div class="cm-box" (click)="$event.stopPropagation()">
        <div class="cm-icon">{{ icon }}</div>
        <h3 class="cm-title">{{ title }}</h3>
        <p class="cm-message">{{ message }}</p>
        <div class="cm-actions">
          <button class="cm-btn cm-btn--cancel" (click)="onCancel()">{{ cancelLabel }}</button>
          <button class="cm-btn cm-btn--confirm" [class.danger]="danger" (click)="onConfirm()">{{ confirmLabel }}</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .cm-overlay {
      position: fixed; inset: 0;
      background: rgba(0,0,0,0.75);
      backdrop-filter: blur(4px);
      z-index: 2000;
      display: flex; align-items: center; justify-content: center;
      padding: 1rem;
      animation: cm-fade-in 0.15s ease;
    }
    @keyframes cm-fade-in { from { opacity: 0 } to { opacity: 1 } }

    .cm-box {
      background: #0c0c0c;
      border: 1px solid #1a1a1a;
      border-radius: 14px;
      padding: 2rem;
      width: 100%;
      max-width: 380px;
      text-align: center;
      box-shadow: 0 30px 60px rgba(0,0,0,0.7);
      animation: cm-slide-up 0.15s ease;
    }
    @keyframes cm-slide-up { from { transform: translateY(8px); opacity: 0 } to { transform: none; opacity: 1 } }

    .cm-icon { font-size: 2.2rem; margin-bottom: 1rem; }

    .cm-title {
      font-size: 1rem;
      font-weight: 800;
      color: #e2e8f0;
      margin: 0 0 0.5rem;
    }

    .cm-message {
      font-size: 0.82rem;
      color: #555;
      margin: 0 0 1.75rem;
      line-height: 1.6;
    }

    .cm-actions {
      display: flex;
      gap: 0.625rem;
    }

    .cm-btn {
      flex: 1;
      padding: 0.65rem 1rem;
      border-radius: 8px;
      font-size: 0.8rem;
      font-weight: 700;
      cursor: pointer;
      transition: 0.2s;
      border: none;
    }

    .cm-btn--cancel {
      background: #111;
      border: 1px solid #1d1d1d;
      color: #666;
    }
    .cm-btn--cancel:hover { color: #ccc; border-color: #333; }

    .cm-btn--confirm {
      background: #1d1d1d;
      color: #e2e8f0;
      border: 1px solid #2a2a2a;
    }
    .cm-btn--confirm:hover { background: #252525; }
    .cm-btn--confirm.danger { background: rgba(239,68,68,0.12); color: #f87171; border-color: rgba(239,68,68,0.25); }
    .cm-btn--confirm.danger:hover { background: rgba(239,68,68,0.2); }
  `]
})
export class ConfirmModalComponent {
  @Input() visible = false;
  @Input() title = 'Confirmer';
  @Input() message = 'Êtes-vous sûr de vouloir continuer ?';
  @Input() icon = '⚠️';
  @Input() confirmLabel = 'Confirmer';
  @Input() cancelLabel = 'Annuler';
  @Input() danger = true;

  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  onConfirm() { this.confirmed.emit(); }
  onCancel() { this.cancelled.emit(); }
}
