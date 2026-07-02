import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '../../services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-stack">
      <div *ngFor="let t of toastService.toasts(); trackBy: trackById" 
           class="toast-card glass-neo-deep" 
           [class]="t.type"
           (click)="toastService.remove(t.id)">
        
        <div class="toast-icon">{{ getIcon(t.type) }}</div>
        
        <div class="toast-content">
          <p>{{ t.message }}</p>
        </div>

        <div class="progress-track">
           <div class="progress-fill" [style.animation-duration]="t.duration + 'ms'"></div>
        </div>

        <button class="close-btn">×</button>
      </div>
    </div>
  `,
  styles: [`
    .toast-stack {
      position: fixed;
      top: 2rem;
      right: 2rem;
      z-index: 99999;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      width: 380px;
      pointer-events: none;
    }

    .toast-card {
      pointer-events: auto;
      padding: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1.2rem;
      border-radius: 12px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      animation: toast-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
      border: 1px solid rgba(255,255,255,0.05);
    }

    @keyframes toast-in {
      from { transform: translateX(100%) scale(0.9); opacity: 0; }
      to { transform: translateX(0) scale(1); opacity: 1; }
    }

    .toast-icon {
      font-size: 1.5rem;
      width: 40px; height: 40px;
      display: flex; align-items: center; justify-content: center;
      background: rgba(255,255,255,0.02);
      border-radius: 10px;
    }

    .toast-content p {
      margin: 0;
      font-size: 0.95rem;
      font-weight: 700;
      color: #fff;
      line-height: 1.4;
    }

    /* Types Colors */
    .success { border-left: 4px solid #4ade80 !important; .toast-icon { color: #4ade80; } .progress-fill { background: #4ade80; box-shadow: 0 0 10px #4ade80; } }
    .error { border-left: 4px solid #ef4444 !important; .toast-icon { color: #ef4444; } .progress-fill { background: #ef4444; box-shadow: 0 0 10px #ef4444; } }
    .info { border-left: 4px solid #c084fc !important; .toast-icon { color: #c084fc; } .progress-fill { background: #c084fc; box-shadow: 0 0 10px #c084fc; } }
    .warning { border-left: 4px solid #f59e0b !important; .toast-icon { color: #f59e0b; } .progress-fill { background: #f59e0b; box-shadow: 0 0 10px #f59e0b; } }

    /* Progress Animation */
    .progress-track {
      position: absolute;
      bottom: 0; left: 0; right: 0;
      height: 3px;
      background: rgba(0,0,0,0.2);
    }
    .progress-fill {
      height: 100%;
      width: 100%;
      transform-origin: left;
      animation: shrink linear forwards;
    }

    @keyframes shrink {
      from { transform: scaleX(1); }
      to { transform: scaleX(0); }
    }

    .close-btn {
      margin-left: auto;
      background: none; border: none;
      color: #475569;
      font-size: 1.4rem;
      cursor: pointer;
      opacity: 0;
      transition: 0.3s;
    }
    .toast-card:hover .close-btn { opacity: 1; }
  `]
})
export class ToastContainerComponent {
  toastService = inject(ToastService);

  trackById(index: number, toast: Toast) {
    return toast.id;
  }

  getIcon(type: string) {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '🚨';
      case 'warning': return '⚠️';
      default: return 'ℹ️';
    }
  }
}
