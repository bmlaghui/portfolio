import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContactApiService } from '../../services/admin-api.services';
import { ContactMessage, QueryOptions } from '../../interfaces/admin.interfaces';
import { PaginationComponent } from '../../components/pagination/pagination';
import { EmptyDataComponent } from '../../components/empty-data/empty-data';
import { ToastService } from '../../../core/services/toast.service';
import { MessagingStateService } from '../../services/messaging-state.service';

@Component({
  selector: 'app-admin-messages',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationComponent, EmptyDataComponent],
  template: `
    <div class="admin-page">
      <div class="header-section">
        <div class="titles">
          <div class="cyber-badge">Inbound Communications</div>
          <h1>Canal de Contact</h1>
          <p>Interception des transmissions extérieures.</p>
        </div>
      </div>

       <div class="control-console-container">
        <div class="control-console">
           <div class="console-segment search">
              <span class="segment-label">SCAN_MESSAGE</span>
              <div class="input-wrap"><input type="text" [(ngModel)]="query.search" (ngModelChange)="onSearch()" placeholder="EXPÉDITEUR, SUJET..." class="console-input"></div>
           </div>
           <div class="console-meta"><div class="stat-node"><span class="val">{{ total() }}</span><span class="lab">SIGNALS</span></div></div>
        </div>
      </div>

      <div class="content-area">
        <div class="messages-stack" *ngIf="messages().length > 0; else emptyState">
          <div class="msg-card glass-neo-deep" *ngFor="let m of messages(); let i = index" [class.unread]="!m.read" [style.animation-delay]="i * 0.1 + 's'">
            <div class="msg-header">
               <div class="sender">
                  <div class="avatar">{{ m.name.charAt(0) }}</div>
                  <div class="info">
                     <h3>{{ m.name }}</h3>
                     <a [href]="'mailto:' + m.email" class="email">{{ m.email }}</a>
                  </div>
               </div>
               <div class="meta">
                  <span class="timestamp">{{ m.createdAt | date:'short' }}</span>
                  <div class="actions">
                     <button class="btn-neo-round" (click)="markAsRead(m.id)" *ngIf="!m.read" title="Marquer comme lu">👁️</button>
                     <button class="btn-neo-round delete" (click)="deleteMessage(m.id)" title="Désintégrer">🗑️</button>
                  </div>
               </div>
            </div>
            <div class="msg-body">
               <div class="subject" *ngIf="m.subject">SUBJECT // {{ m.subject | uppercase }}</div>
               <p class="content">{{ m.message }}</p>
            </div>
            <div class="status-flag" *ngIf="!m.read">NEW_TRANSMISSION</div>
          </div>
        </div>
        <ng-template #emptyState>
           <app-empty-data icon="📡" title="Fréquences Libres" text="Aucun signal entrant détecté dans les archives."></app-empty-data>
        </ng-template>
        <div class="footer-pagination" *ngIf="messages().length > 0">
           <app-pagination [page]="query.page!" [totalPages]="totalPages()" [total]="total()" (pageChange)="onPageChange($event)"></app-pagination>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .messages-stack { display: flex; flex-direction: column; gap: 1.5rem; }
    .msg-card { padding: 2.5rem; position: relative; border-left: 2px solid rgba(255,255,255,0.05); transition: 0.3s; }
    .msg-card.unread { border-left-color: var(--primary); }
    .msg-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
    .sender { display: flex; align-items: center; gap: 1.5rem; }
    .avatar { width: 50px; height: 50px; border-radius: 12px; background: #000; border: 1px solid #111; display: flex; align-items: center; justify-content: center; font-weight: 950; color: var(--primary); font-size: 1.2rem; }
    .info h3 { font-size: 1.1rem; font-weight: 950; color: #fff; margin: 0; }
    .email { font-size: 0.75rem; color: #475569; text-decoration: none; font-weight: 900; }
    .meta { text-align: right; display: flex; flex-direction: column; gap: 0.5rem; }
    .timestamp { font-family: monospace; font-size: 0.7rem; color: #222; font-weight: 950; }
    .actions { display: flex; gap: 0.5rem; justify-content: flex-end; }
    .btn-neo-round { width: 34px; height: 34px; border-radius: 50%; background: #000; border: 1px solid #111; cursor: pointer; transition: 0.3s; }
    .btn-neo-round:hover { border-color: var(--primary); transform: scale(1.1); }
    .btn-neo-round.delete:hover { border-color: #ef4444; }
    .msg-body { background: rgba(0,0,0,0.2); padding: 2rem; border-radius: 12px; border: 1px solid rgba(255,255,255,0.02); }
    .subject { font-size: 0.65rem; font-weight: 950; color: var(--primary); letter-spacing: 2px; margin-bottom: 1rem; }
    .content { font-size: 0.95rem; line-height: 1.7; color: #94a3b8; margin: 0; }
    .status-flag { position: absolute; top: 1rem; right: 2.5rem; font-size: 0.55rem; font-weight: 950; color: var(--primary); letter-spacing: 1px; }
  `]
})
export class AdminMessagesComponent implements OnInit {
  messages = signal<ContactMessage[]>([]);
  total = signal(0);
  totalPages = signal(0);
  query: QueryOptions = { page: 1, limit: 10, search: '', sortBy: 'createdAt', sortOrder: 'desc' };
  api = inject(ContactApiService);
  toast = inject(ToastService);
  msgState = inject(MessagingStateService);

  ngOnInit() { this.load(); }
  load() { this.api.getAll(this.query).subscribe(res => { this.messages.set(res.items); this.total.set(res.meta.total); this.totalPages.set(res.meta.totalPages); }); }
  onPageChange(page: number) { this.query.page = page; this.load(); }
  onSearch() { this.query.page = 1; this.load(); }
  markAsRead(id: number) { 
    this.api.markRead(id).subscribe(() => { 
      this.toast.info('Signal marqué comme intercepté'); 
      this.load(); 
      this.msgState.refresh();
    }); 
  }
  deleteMessage(id: number) { 
    if (confirm('Désintégrer cette transmission ?')) { 
      this.api.delete(id).subscribe(() => { 
        this.toast.warning('Transmission effacée du Nexus'); 
        this.load(); 
        this.msgState.refresh();
      }); 
    } 
  }
}
