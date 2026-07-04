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
        <div class="inbox-toolbar" *ngIf="messages().length > 0">
          <div class="view-tabs">
            <button type="button" [class.active]="view() === 'all'" (click)="view.set('all')">Tous <span>{{ messages().length }}</span></button>
            <button type="button" [class.active]="view() === 'unread'" (click)="view.set('unread')">Non lus <span>{{ unreadCount() }}</span></button>
            <button type="button" [class.active]="view() === 'read'" (click)="view.set('read')">Lus <span>{{ messages().length - unreadCount() }}</span></button>
          </div>
          <span class="page-context">PAGE {{ query.page }} · {{ total() }} MESSAGE{{ total() > 1 ? 'S' : '' }}</span>
        </div>

        <div class="messages-stack" *ngIf="visibleMessages().length > 0; else emptyState">
          <article class="msg-card" *ngFor="let m of visibleMessages(); let i = index" [class.unread]="!m.read" [class.expanded]="expandedId() === m.id" [style.animation-delay]="i * 0.05 + 's'">
            <div class="msg-header">
              <div class="sender">
                <div class="avatar">{{ m.name.charAt(0).toUpperCase() }}<i *ngIf="!m.read"></i></div>
                <div class="info">
                  <div><h3>{{ m.name }}</h3><span class="unread-pill" *ngIf="!m.read">NOUVEAU</span></div>
                  <a [href]="'mailto:' + m.email" class="email">{{ m.email }}</a>
                </div>
              </div>
              <time class="timestamp">{{ m.createdAt | date:'dd MMM yyyy · HH:mm' }}</time>
            </div>
            <div class="msg-body">
              <span class="subject-label">OBJET</span>
              <h4>{{ m.subject || 'Nouveau message depuis le portfolio' }}</h4>
              <p class="content">{{ m.message }}</p>
            </div>
            <footer class="msg-footer">
              <button type="button" class="open-message" (click)="toggleMessage(m.id)">{{ expandedId() === m.id ? 'Réduire' : 'Lire le message' }} <span>{{ expandedId() === m.id ? '↑' : '↓' }}</span></button>
              <div class="message-actions">
                <button type="button" class="read-action" (click)="markAsRead(m.id)" *ngIf="!m.read">✓ Marquer lu</button>
                <a [href]="'mailto:' + m.email + '?subject=Re: ' + (m.subject || 'Votre message')">↗ Répondre</a>
                <button type="button" class="delete-action" (click)="deleteMessage(m.id)" aria-label="Supprimer">✕</button>
              </div>
            </footer>
          </article>
        </div>
        <ng-template #emptyState>
           <app-empty-data
             icon="📡"
             [title]="messages().length ? 'Aucun message dans ce filtre' : 'Fréquences Libres'"
             [description]="messages().length ? 'Essayez une autre vue pour retrouver vos messages.' : 'Aucun signal entrant détecté dans les archives.'"
             [showAction]="false">
           </app-empty-data>
        </ng-template>
        <div class="footer-pagination" *ngIf="messages().length > 0">
           <app-pagination [page]="query.page!" [totalPages]="totalPages()" [total]="total()" (pageChange)="onPageChange($event)"></app-pagination>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .inbox-toolbar { display:flex; align-items:center; justify-content:space-between; gap:1rem; margin-bottom:1rem; padding:.65rem; background:#090909; border:1px solid #171717; border-radius:12px; }
    .view-tabs { display:flex; gap:.3rem; }
    .view-tabs button { display:flex; align-items:center; gap:.45rem; padding:.5rem .75rem; color:#4d5561; background:transparent; border:1px solid transparent; border-radius:8px; cursor:pointer; font-size:.66rem; font-weight:800; }
    .view-tabs button span { min-width:18px; padding:.1rem .3rem; color:#69727f; background:#141414; border-radius:10px; font-size:.54rem; }
    .view-tabs button.active { color:#e2e8f0; background:#141414; border-color:#222; }
    .view-tabs button.active span { color:#080808; background:var(--primary); }
    .page-context { color:#303742; font:.55rem monospace; letter-spacing:1px; }
    .messages-stack { display:flex; flex-direction:column; gap:.75rem; }
    .msg-card { position:relative; overflow:hidden; background:#0a0a0a; border:1px solid #181818; border-left:3px solid #222; border-radius:13px; transition:.25s; }
    .msg-card:hover { border-color:#242424; box-shadow:0 14px 35px rgba(0,0,0,.25); }
    .msg-card.unread { border-left-color:var(--primary); background:linear-gradient(100deg,rgba(192,132,252,.035),transparent 35%),#0a0a0a; }
    .msg-header { display:flex; justify-content:space-between; align-items:center; gap:1rem; padding:1rem 1.2rem .75rem; }
    .sender { display:flex; align-items:center; gap:.8rem; min-width:0; }
    .avatar { position:relative; width:42px; height:42px; flex-shrink:0; display:grid; place-items:center; color:#c084fc; background:radial-gradient(circle,rgba(192,132,252,.13),transparent 70%),#101010; border:1px solid #202020; border-radius:11px; font-size:.95rem; font-weight:900; }
    .avatar i { position:absolute; top:-2px; right:-2px; width:7px; height:7px; background:var(--primary); border:2px solid #0a0a0a; border-radius:50%; box-shadow:0 0 7px var(--primary); }
    .info { min-width:0; }
    .info > div { display:flex; align-items:center; gap:.55rem; }
    .info h3 { overflow:hidden; margin:0; color:#e8ecf2; font-size:.86rem; font-weight:850; text-overflow:ellipsis; white-space:nowrap; }
    .unread-pill { padding:.17rem .38rem; color:var(--primary); background:rgba(192,132,252,.08); border:1px solid rgba(192,132,252,.16); border-radius:4px; font-size:.46rem; font-weight:900; letter-spacing:.8px; }
    .email { display:block; overflow:hidden; margin-top:.15rem; color:#4d5663; font-size:.64rem; text-decoration:none; text-overflow:ellipsis; white-space:nowrap; }
    .email:hover { color:var(--primary); }
    .timestamp { flex-shrink:0; color:#343b46; font:.57rem monospace; }
    .msg-body { padding:.55rem 1.2rem 1rem 4.45rem; }
    .subject-label { color:#353c47; font:.5rem monospace; letter-spacing:1.2px; }
    .msg-body h4 { margin:.28rem 0 .45rem; color:#aeb6c2; font-size:.78rem; }
    .content { display:-webkit-box; overflow:hidden; margin:0; color:#596270; font-size:.76rem; line-height:1.65; white-space:pre-wrap; -webkit-box-orient:vertical; -webkit-line-clamp:2; }
    .msg-card.expanded .content { display:block; color:#8993a1; }
    .msg-footer { display:flex; align-items:center; justify-content:space-between; gap:1rem; padding:.75rem 1.2rem; background:#080808; border-top:1px solid #151515; }
    .open-message { padding:0; color:#66707d; background:transparent; border:0; cursor:pointer; font-size:.62rem; font-weight:800; }
    .open-message span { margin-left:.3rem; color:var(--primary); }
    .message-actions { display:flex; align-items:center; gap:.4rem; }
    .message-actions button,.message-actions a { min-height:30px; display:flex; align-items:center; padding:0 .65rem; border-radius:7px; cursor:pointer; font-size:.56rem; font-weight:850; text-decoration:none; }
    .read-action { color:#86efac; background:rgba(74,222,128,.06); border:1px solid rgba(74,222,128,.16); }
    .message-actions a { color:#d8b4fe; background:rgba(192,132,252,.08); border:1px solid rgba(192,132,252,.18); }
    .delete-action { width:30px; padding:0!important; justify-content:center; color:#f87171; background:rgba(239,68,68,.05); border:1px solid rgba(239,68,68,.15); }
    .delete-action:hover { color:#fff; background:#dc2626; }
    @media(max-width:650px) {
      .inbox-toolbar { align-items:flex-start; flex-direction:column; }
      .page-context { padding-left:.4rem; }
      .msg-header { align-items:flex-start; }
      .timestamp { max-width:80px; text-align:right; line-height:1.5; }
      .msg-body { padding-left:1.2rem; }
      .msg-footer { align-items:flex-start; flex-direction:column; }
      .message-actions { width:100%; flex-wrap:wrap; }
      .message-actions a { flex:1; justify-content:center; }
    }
  `]
})
export class AdminMessagesComponent implements OnInit {
  messages = signal<ContactMessage[]>([]);
  total = signal(0);
  totalPages = signal(0);
  view = signal<'all' | 'unread' | 'read'>('all');
  expandedId = signal<number | null>(null);
  query: QueryOptions = { page: 1, limit: 10, search: '', sortBy: 'createdAt', sortOrder: 'desc' };
  api = inject(ContactApiService);
  toast = inject(ToastService);
  msgState = inject(MessagingStateService);

  ngOnInit() { this.load(); }
  load() { this.api.getAll(this.query).subscribe(res => { this.messages.set(res.items); this.total.set(res.meta.total); this.totalPages.set(res.meta.totalPages); }); }
  onPageChange(page: number) { this.query.page = page; this.load(); }
  onSearch() { this.query.page = 1; this.load(); }
  unreadCount() { return this.messages().filter(message => !message.read).length; }
  visibleMessages() {
    if (this.view() === 'unread') return this.messages().filter(message => !message.read);
    if (this.view() === 'read') return this.messages().filter(message => message.read);
    return this.messages();
  }
  toggleMessage(id: number) { this.expandedId.set(this.expandedId() === id ? null : id); }
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
