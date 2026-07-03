import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BlogApiService } from '../../services/admin-api.services';
import { BlogPost, QueryOptions } from '../../interfaces/admin.interfaces';
import { PaginationComponent } from '../../components/pagination/pagination';
import { EmptyDataComponent } from '../../components/empty-data/empty-data';
import { FileUploaderComponent } from '../../components/file-uploader/file-uploader';
import { BlockEditorComponent, ContentBlock } from '../../components/block-editor/block-editor';
import { ToastService } from '../../../core/services/toast.service';

type BlogTab = 'fr' | 'en' | 'config';

@Component({
  selector: 'app-admin-blog',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationComponent, EmptyDataComponent, FileUploaderComponent, BlockEditorComponent],
  template: `
    <div class="admin-page">
      <div class="header-section">
        <div class="titles">
          <div class="cyber-badge">Neural Archives</div>
          <h1>Gestion Blog</h1>
        </div>
        <button class="btn-cyber-primary" (click)="openModal()">
          <span class="btn-glitch">Nouvel Article</span>
          <span class="btn-icon">✍️</span>
        </button>
      </div>

       <div class="control-console-container">
        <div class="control-console">
           <div class="console-segment search">
              <span class="segment-label">MOTEUR_RECHERCHE</span>
              <div class="input-wrap">
                 <input type="text" [(ngModel)]="query.search" (ngModelChange)="onSearch()" placeholder="SCANNER ARCHIVES..." class="console-input">
              </div>
           </div>
           <div class="console-segment sort">
              <span class="segment-label">TRI</span>
              <div class="select-wrap">
                 <select [(ngModel)]="query.sortBy" (change)="load()" class="console-select">
                    <option value="createdAt">DATE</option>
                    <option value="title">ALPHA</option>
                 </select>
                 <button (click)="toggleSort()" class="sort-toggle-btn" [class.desc]="query.sortOrder === 'desc'"><span class="arrow">↓</span></button>
              </div>
           </div>
           <div class="console-meta">
              <div class="stat-node"><span class="val">{{ total() }}</span><span class="lab">TOTAL_POSTS</span></div>
           </div>
        </div>
      </div>

      <div class="content-area">
        <div class="blog-grid" *ngIf="posts().length > 0; else emptyState">
          <div class="blog-item glass-card" *ngFor="let p of posts(); let i = index" [style.animation-delay]="i * 0.1 + 's'">
            <div class="post-cover">
              <img [src]="p.imageUrl || '/assets/blog-placeholder.jpg'" alt="">
              <div class="status-overlay" [class.live]="p.published">{{ p.published ? 'LIVE' : 'DRAFT' }}</div>
            </div>
            <div class="post-body">
              <div class="meta-row"><span>{{ p.createdAt | date:'dd MMM yyyy' }}</span><span>{{ p.readTime }} min</span></div>
              <h3 class="post-title">{{ p.title }}</h3>
              <div class="actions-footer">
                <button class="action-mini edit" (click)="openModal(p)">ÉDITER</button>
                <div class="spacer"></div>
                <button class="action-mini del" (click)="deletePost(p.id!)">EFFACER</button>
              </div>
            </div>
          </div>
        </div>
        <ng-template #emptyState>
          <app-empty-data icon="📭" title="Archives Vides" (action)="openModal()"></app-empty-data>
        </ng-template>
        <div class="pagination-container" *ngIf="posts().length > 0">
           <app-pagination [page]="query.page!" [totalPages]="totalPages()" [total]="total()" (pageChange)="onPageChange($event)"></app-pagination>
        </div>
      </div>

      <div class="modal-root" *ngIf="showModal()" (click)="closeModal()">
        <div class="modal-frame" (click)="$event.stopPropagation()">
          <aside class="modal-sidebar">
            <div class="brand">BLOG.EXE</div>
            <nav class="nav-steps">
              <button [class.active]="activeTab() === 'fr'" (click)="activeTab.set('fr')"><span>01 FR</span><span class="dot-status" [class.valid]="formPost.title && formPost.content"></span></button>
              <button [class.active]="activeTab() === 'en'" (click)="activeTab.set('en')"><span>02 EN</span><span class="dot-status" [class.valid]="formPost.titleEn && formPost.contentEn"></span></button>
              <button [class.active]="activeTab() === 'config'" (click)="activeTab.set('config')"><span>03 CONFIG</span><span class="dot-status" [class.valid]="formPost.imageUrl"></span></button>
            </nav>
          </aside>
          <main class="modal-main">
            <header class="main-header">
              <div class="titles"><h2>ÉDITION ARTICLE</h2><span class="breadcrumb">content // arcs // {{ activeTab() }}</span></div>
              <button class="btn-exit" (click)="closeModal()">×</button>
            </header>
            <form (ngSubmit)="save()" class="liquid-form" #blogForm="ngForm">
              <div class="tab-pane reveal" *ngIf="activeTab() === 'fr'">
                <div class="form-group large"><label>Titre (FR)</label><input type="text" [(ngModel)]="formPost.title" name="title" required #tf="ngModel" class="cyber-input" [class.invalid]="tf.invalid && tf.touched"></div>
                <div class="form-group large"><label>Résumé (FR)</label><input type="text" [(ngModel)]="formPost.summary" name="sum" required class="cyber-input"></div>
                <div class="form-group full">
                  <label>Contenu (FR) — Blocs</label>
                  <app-block-editor [value]="blocksFR" (valueChange)="blocksFF($event)"></app-block-editor>
                </div>
                <div class="next-step-hint"><button type="button" class="btn-next-tab" (click)="activeTab.set('en')">DÉTAILS EN →</button></div>
              </div>
              <div class="tab-pane reveal" *ngIf="activeTab() === 'en'">
                <div class="form-group large"><label>Title (EN)</label><input type="text" [(ngModel)]="formPost.titleEn" name="te" class="cyber-input"></div>
                <div class="form-group large"><label>Summary (EN)</label><input type="text" [(ngModel)]="formPost.summaryEn" name="se" class="cyber-input"></div>
                <div class="form-group full">
                  <label>Content (EN) — Blocks</label>
                  <app-block-editor [value]="blocksEN" (valueChange)="blocksEE($event)"></app-block-editor>
                </div>
                <div class="next-step-hint"><button type="button" class="btn-next-tab" (click)="activeTab.set('config')">RÉGLAGES FINAUX →</button></div>
              </div>
              <div class="tab-pane reveal" *ngIf="activeTab() === 'config'">
                <div class="form-group full"><app-file-uploader [currentUrl]="formPost.imageUrl" (uploaded)="formPost.imageUrl = $event" (removed)="formPost.imageUrl = ''"></app-file-uploader></div>
                <div class="form-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
                  <div class="form-group"><label>Temps lecture (min)</label><input type="number" [(ngModel)]="formPost.readTime" name="read" class="cyber-input"></div>
                  <div class="form-group"><label>Tags</label><input type="text" [ngModel]="tagsString()" (ngModelChange)="setTags($event)" name="tags" class="cyber-input"></div>
                </div>
                <div class="toggles-row"><label class="hybrid-toggle"><input type="checkbox" [(ngModel)]="formPost.published" name="pub"><div class="toggle-control"></div><span class="toggle-text">LIRE EN DIRECT</span></label></div>
                <div class="toggles-row"><label class="hybrid-toggle"><input type="checkbox" [(ngModel)]="formPost.featured" name="feat"><div class="toggle-control"></div><span class="toggle-text">ARTICLE MIS EN AVANT</span></label></div>
                <footer class="modal-footer-final"><button type="button" class="btn-cancel" (click)="closeModal()">ABANDONNER</button><div class="spacer"></div><button type="submit" class="btn-submit-cyber" [disabled]="!formPost.title || !formPost.summary">PUBLIER ARCHIVE</button></footer>
              </div>
            </form>
          </main>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .btn-cyber-primary { background: #fff; color: #000; border: none; padding: 1rem 3rem; font-weight: 950; text-transform: uppercase; cursor: pointer; transition: 0.3s; clip-path: polygon(10% 0, 100% 0, 90% 100%, 0 100%); }
    .btn-cyber-primary:hover { background: var(--primary); color: #fff; }
    .blog-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 2rem; }
    .blog-item { overflow: hidden; display: flex; flex-direction: column; transition: 0.3s; }
    .blog-item:hover { transform: translateY(-8px); border-color: var(--primary); }
    .post-cover { height: 180px; position: relative; }
    .post-cover img { width: 100%; height: 100%; object-fit: cover; }
    .status-overlay { position: absolute; top: 1rem; right: 1rem; background: #000; padding: 0.3rem 0.8rem; border-radius: 4px; font-size: 0.6rem; font-weight: 950; }
    .post-body { padding: 1.5rem; flex: 1; display: flex; flex-direction: column; gap: 1rem; }
    .meta-row { display: flex; justify-content: space-between; font-size: 0.7rem; color: #334; font-weight: 950; }
    .post-title { font-size: 1.2rem; color: #fff; font-weight: 950; line-height: 1.3; }
    .actions-footer { display: flex; align-items: center; border-top: 1px solid rgba(255,255,255,0.03); padding-top: 1rem; margin-top: auto; }
    .action-mini { background: none; border: none; font-size: 0.7rem; font-weight: 950; color: #334; cursor: pointer; transition: 0.3s; }
    .action-mini:hover { color: #fff; }
    .action-mini.del:hover { color: #ef4444; }
    .btn-exit { background: none; border: none; font-size: 2.5rem; color: #111; cursor: pointer; }
    .btn-exit:hover { color: #fff; }
  `]
})
export class AdminBlogComponent implements OnInit {
  posts = signal<BlogPost[]>([]);
  total = signal(0);
  totalPages = signal(0);
  activeTab = signal<BlogTab>('fr');
  query: QueryOptions = { page: 1, limit: 12, search: '', sortBy: 'createdAt', sortOrder: 'desc' };
  showModal = signal(false);
  editingId = signal<number | null>(null);
  formPost: BlogPost = this.resetForm();
  blocksFR: ContentBlock[] = [];
  blocksEN: ContentBlock[] = [];
  api = inject(BlogApiService);
  toast = inject(ToastService);

  ngOnInit() { this.load(); }
  load() { this.api.getAll(this.query).subscribe(res => { this.posts.set(res.items); this.total.set(res.meta.total); this.totalPages.set(res.meta.totalPages); }); }
  onPageChange(page: number) { this.query.page = page; this.load(); }
  onSearch() { this.query.page = 1; this.load(); }
  toggleSort() { this.query.sortOrder = this.query.sortOrder === 'asc' ? 'desc' : 'asc'; this.load(); }

  openModal(p?: BlogPost) {
    this.activeTab.set('fr');
    if (p) {
      this.formPost = { ...p, tags: [...(p.tags || [])] };
      const blocks: ContentBlock[] = p.blocks ?? [];
      // Split blocks by language (fr blocks first, en blocks start after a marker or just duplicate for now)
      this.blocksFR = blocks.filter(b => !b.id.startsWith('en_')) as ContentBlock[];
      this.blocksEN = blocks.filter(b => b.id.startsWith('en_')) as ContentBlock[];
      this.editingId.set(p.id!);
    } else {
      this.formPost = this.resetForm();
      this.blocksFR = [];
      this.blocksEN = [];
      this.editingId.set(null);
    }
    this.showModal.set(true);
  }
  closeModal() { this.showModal.set(false); }
  resetForm(): BlogPost { return { title: '', summary: '', content: '', titleEn: '', summaryEn: '', contentEn: '', slug: '', published: false, tags: [], readTime: 5, blocks: [] }; }
  tagsString() { return this.formPost.tags?.join(', ') || ''; }
  setTags(val: string) { this.formPost.tags = val.split(',').map(s => s.trim()).filter(s => !!s); }

  blocksFF(blocks: ContentBlock[]) { this.blocksFR = blocks; }
  blocksEE(blocks: ContentBlock[]) {
    this.blocksEN = blocks.map(b => ({ ...b, id: b.id.startsWith('en_') ? b.id : 'en_' + b.id }));
  }

  save() {
    if (!this.formPost.slug) this.formPost.slug = this.formPost.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    // Merge FR and EN blocks, extracting plain text content for backward compat
    this.formPost.blocks = [...this.blocksFR, ...this.blocksEN];
    this.formPost.content = this.blocksFR.filter(b => b.type === 'paragraph' || b.type === 'quote').map(b => b.content ?? '').join('\n');
    this.formPost.contentEn = this.blocksEN.filter(b => b.type === 'paragraph' || b.type === 'quote').map(b => b.content ?? '').join('\n');
    const obs = this.editingId() ? this.api.update(this.editingId()!, this.formPost) : this.api.create(this.formPost);
    obs.subscribe(() => {
      this.toast.success(this.editingId() ? 'Article mis à jour' : 'Nouvel article publié dans les archives');
      this.load();
      this.closeModal();
    });
  }

  deletePost(id: number) {
    if (confirm('Voulez-vous vraiment supprimer cet article ?')) {
      this.api.delete(id).subscribe(() => {
        this.toast.warning('Article effacé de la mémoire');
        this.load();
      });
    }
  }
}
