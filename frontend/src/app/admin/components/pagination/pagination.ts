import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="pagination-container" *ngIf="totalPages > 1">
      <button 
        class="page-btn" 
        [disabled]="page === 1" 
        (click)="changePage(page - 1)">
        &laquo;
      </button>
      
      <div class="pages">
        <button 
          *ngFor="let p of pages" 
          class="page-btn" 
          [class.active]="p === page"
          (click)="changePage(p)">
          {{ p }}
        </button>
      </div>

      <button 
        class="page-btn" 
        [disabled]="page === totalPages" 
        (click)="changePage(page + 1)">
        &raquo;
      </button>

      <div class="info">
        Page {{ page }} sur {{ totalPages }} (Total: {{ total }})
      </div>
    </div>
  `,
  styles: [`
    .pagination-container {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-top: 2rem;
      justify-content: center;
    }
    .pages { display: flex; gap: 0.5rem; }
    .page-btn {
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      color: #94a3b8;
      width: 32px;
      height: 32px;
      border-radius: 6px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.85rem;
      transition: all 0.3s;
    }
    .page-btn:hover:not(:disabled) {
      background: rgba(192, 132, 252, 0.1);
      border-color: #c084fc;
      color: #fff;
    }
    .page-btn.active {
      background: #c084fc;
      color: #000;
      border-color: #c084fc;
      font-weight: 700;
    }
    .page-btn:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }
    .info { font-size: 0.75rem; color: #64748b; }
  `]
})
export class PaginationComponent {
  @Input() page = 1;
  @Input() totalPages = 1;
  @Input() total = 0;
  @Output() pageChange = new EventEmitter<number>();

  get pages(): number[] {
    const range = [];
    for (let i = 1; i <= this.totalPages; i++) {
      range.push(i);
    }
    return range;
  }

  changePage(p: number) {
    if (p >= 1 && p <= this.totalPages) {
      this.pageChange.emit(p);
    }
  }
}
