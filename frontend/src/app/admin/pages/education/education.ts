import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EducationApiService } from '../../services/admin-api.services';
import { Education, QueryOptions } from '../../interfaces/admin.interfaces';
import { PaginationComponent } from '../../components/pagination/pagination';
import { EmptyDataComponent } from '../../components/empty-data/empty-data';
import { FileUploaderComponent } from '../../components/file-uploader/file-uploader';
import { ConfirmModalComponent } from '../../components/confirm-modal/confirm-modal';
import { ToastService } from '../../../core/services/toast.service';

type EduTab = 'details' | 'content' | 'settings';

@Component({
  selector: 'app-admin-education',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationComponent, EmptyDataComponent, FileUploaderComponent, ConfirmModalComponent],
  template: `
    <div class="admin-page">
      <div class="header-section">
        <div class="titles">
          <div class="cyber-badge">Academic Records</div>
          <h1>Cursus & Formations</h1>
          <p>Gérez vos diplômes et certifications.</p>
        </div>
        <button class="btn-cyber-primary" (click)="openModal()">
          <span class="btn-glitch">Nouveau Diplôme</span>
          <span class="btn-icon">🎓</span>
        </button>
      </div>

      <div class="control-console-container">
        <div class="control-console">
          <div class="console-segment search">
            <span class="segment-label">SCAN_ACADÉMIQUE</span>
            <div class="input-wrap">
              <span class="pulse-icon">🔍</span>
              <input type="text" [(ngModel)]="query.search" (ngModelChange)="onSearch()" placeholder="ÉCOLE, DIPLÔME..." class="console-input">
            </div>
          </div>
          <div class="console-segment sort">
            <span class="segment-label">INDEX_CHRONO</span>
            <div class="select-wrap">
              <select [(ngModel)]="query.sortBy" (change)="load()" class="console-select">
                <option value="startDate">DÉBUT</option>
                <option value="school">ÉCOLE</option>
              </select>
              <button (click)="toggleSort()" class="sort-toggle-btn" [class.desc]="query.sortOrder === 'desc'"><span class="arrow">↓</span></button>
            </div>
          </div>
          <div class="console-meta">
            <div class="stat-node"><span class="val">{{ total() }}</span><span class="lab">DIPLÔMES</span></div>
          </div>
        </div>
      </div>

      <div class="content-area">
        <div class="edu-list" *ngIf="education().length > 0; else emptyState">
          <div class="edu-item glass-neo-deep" *ngFor="let ed of education(); let i = index" [style.animation-delay]="i * 0.1 + 's'">
            <div class="edu-icon">🎓</div>
            <div class="edu-content">
              <h3 class="edu-degree">{{ ed.degree }}</h3>
              <span class="edu-school">{{ ed.school | uppercase }}</span>
              <div class="edu-meta">
                <span class="edu-field">{{ ed.field }}</span>
                <span class="edu-sep">·</span>
                <span class="edu-period">{{ ed.startDate | date:"yyyy" }} — {{ ed.endDate ? (ed.endDate | date:"yyyy") : "Présent" }}</span>
              </div>
            </div>
            <div class="edu-actions">
              <button class="btn-neo-round" (click)="openModal(ed)">✏️</button>
              <button class="btn-neo-round delete" (click)="deleteEdu(ed.id!)">🗑️</button>
            </div>
          </div>
        </div>

        <ng-template #emptyState>
          <app-empty-data icon="🎓" title="Archives Vides" text="Aucune formation enregistrée." (action)="openModal()"></app-empty-data>
        </ng-template>

        <div class="footer-pagination" *ngIf="education().length > 0">
          <app-pagination [page]="query.page!" [totalPages]="totalPages()" [total]="total()" (pageChange)="onPageChange($event)"></app-pagination>
        </div>
      </div>

      <!-- Confirm Delete -->
      <app-confirm-modal
        [visible]="confirmVisible()"
        title="Supprimer la formation"
        message="Cette action est irréversible. Le diplôme sera définitivement supprimé."
        icon="🎓"
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
        [danger]="true"
        (confirmed)="onDeleteConfirmed()"
        (cancelled)="confirmVisible.set(false)">
      </app-confirm-modal>

      <!-- Modal -->
      <div class="modal-root" *ngIf="showModal()" (click)="closeModal()">
        <div class="pf-modal" (click)="$event.stopPropagation()">

          <header class="pf-header">
            <div class="pf-header-left">
              <span class="pf-tag">EDU.LOG</span>
              <h2 class="pf-title">{{ editingId() ? "Modifier la formation" : "Nouvelle formation" }}</h2>
            </div>
            <button class="pf-close" (click)="closeModal()">✕</button>
          </header>

          <nav class="pf-tabs">
            <button type="button" class="pf-tab" [class.active]="activeTab() === 'details'" (click)="activeTab.set('details')">
              <span class="pf-tab-num">01</span>
              <span class="pf-tab-label">Établissement</span>
              <span class="pf-tab-dot" [class.ok]="!!(formEdu.school && formEdu.degree && formEdu.startDate)"></span>
            </button>
            <button type="button" class="pf-tab" [class.active]="activeTab() === 'content'" (click)="activeTab.set('content')">
              <span class="pf-tab-num">02</span>
              <span class="pf-tab-label">Contenu</span>
              <span class="pf-tab-dot" [class.ok]="!!(formEdu.field)"></span>
            </button>
            <button type="button" class="pf-tab" [class.active]="activeTab() === 'settings'" (click)="activeTab.set('settings')">
              <span class="pf-tab-num">03</span>
              <span class="pf-tab-label">Paramètres</span>
              <span class="pf-tab-dot" [class.ok]="true"></span>
            </button>
          </nav>

          <form (ngSubmit)="save()" class="pf-form">
            <div class="pf-body">

              <!-- Tab 01 : Établissement -->
              <div class="pf-pane" *ngIf="activeTab() === 'details'">
                <div class="pf-group">
                  <label class="pf-label">Établissement / École <span class="req">*</span></label>
                  <input type="text" [(ngModel)]="formEdu.school" name="school" required class="pf-input" placeholder="Ex : ITIC Paris, Université Paris-Saclay…">
                </div>
                <div class="pf-grid">
                  <div class="pf-group">
                    <label class="pf-label">Date de début <span class="req">*</span></label>
                    <input type="date" [(ngModel)]="formEdu.startDate" name="startDate" required class="pf-input">
                  </div>
                  <div class="pf-group">
                    <label class="pf-label">Date de fin</label>
                    <input type="date" [(ngModel)]="formEdu.endDate" name="endDate" class="pf-input">
                  </div>
                </div>
              </div>

              <!-- Tab 02 : Contenu -->
              <div class="pf-pane" *ngIf="activeTab() === 'content'">
                <div class="pf-group">
                  <label class="pf-label">Diplôme / Titre <span class="req">*</span></label>
                  <input type="text" [(ngModel)]="formEdu.degree" name="degree" required class="pf-input" placeholder="Ex : Master 2, Licence, Certification…">
                </div>
                <div class="pf-group">
                  <label class="pf-label">Domaine / Spécialisation <span class="req">*</span></label>
                  <input type="text" [(ngModel)]="formEdu.field" name="field" required class="pf-input" placeholder="Ex : Informatique, Intelligence Artificielle…">
                </div>
                <div class="pf-group">
                  <label class="pf-label">Description / Réalisations</label>
                  <textarea [(ngModel)]="formEdu.description" name="description" class="pf-input pf-textarea" rows="5" placeholder="Décrivez les matières, projets, compétences acquises…"></textarea>
                </div>
              </div>

              <!-- Tab 03 : Paramètres -->
              <div class="pf-pane" *ngIf="activeTab() === 'settings'">
                <div class="pf-group">
                  <label class="pf-label">URL du certificat / diplôme</label>
                  <input type="url" [(ngModel)]="formEdu.certificateUrl" name="certificateUrl" class="pf-input" placeholder="https://…">
                </div>
                <div class="pf-group">
                  <label class="pf-label">Ou uploader l'image du diplôme</label>
                  <app-file-uploader [currentUrl]="formEdu.certificateUrl || undefined" (uploaded)="formEdu.certificateUrl = $event" (removed)="formEdu.certificateUrl = ''"></app-file-uploader>
                </div>
                <div class="pf-group">
                  <label class="pf-label">Ordre d'affichage</label>
                  <input type="number" [(ngModel)]="formEdu.order" name="order" class="pf-input" placeholder="0">
                </div>
              </div>

            </div>

            <footer class="pf-footer">
              <button type="button" class="pf-btn-cancel" (click)="closeModal()">Annuler</button>
              <div class="pf-footer-nav">
                <button type="button" class="pf-btn-prev" *ngIf="prevTab()" (click)="goTab(prevTab()!)">← Précédent</button>
                <button type="button" class="pf-btn-next" *ngIf="nextTab()" (click)="goTab(nextTab()!)">Suivant →</button>
                <button type="submit" class="pf-btn-save" *ngIf="!nextTab()" [disabled]="!formEdu.school || !formEdu.degree || !formEdu.field || !formEdu.startDate">Enregistrer</button>
              </div>
            </footer>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .btn-cyber-primary { background: #fff; color: #000; border: none; padding: 1rem 3rem; font-weight: 950; text-transform: uppercase; cursor: pointer; transition: 0.3s; clip-path: polygon(10% 0, 100% 0, 90% 100%, 0 100%); }
    .btn-cyber-primary:hover { background: var(--primary); color: #fff; }

    /* List */
    .edu-list { display: flex; flex-direction: column; gap: 1rem; }
    .edu-item { display: grid; grid-template-columns: 56px 1fr auto; align-items: center; gap: 1.5rem; padding: 1.25rem 1.5rem; border-radius: 14px; border: 1px solid rgba(255,255,255,0.03); transition: 0.3s; }
    .edu-item:hover { border-color: var(--primary); background: rgba(192,132,252,0.03); }
    .edu-icon { width: 48px; height: 48px; border-radius: 10px; background: #000; border: 1px solid #111; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; flex-shrink: 0; }
    .edu-content { display: flex; flex-direction: column; gap: 0.25rem; min-width: 0; }
    .edu-degree { font-size: 1.1rem; color: #fff; margin: 0; font-weight: 900; letter-spacing: -0.3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .edu-school { font-weight: 950; color: var(--primary); font-size: 0.68rem; text-transform: uppercase; letter-spacing: 2px; }
    .edu-meta { display: flex; align-items: center; gap: 0.5rem; font-size: 0.75rem; color: #334155; margin-top: 0.1rem; }
    .edu-sep { color: #1e293b; }
    .edu-actions { display: flex; gap: 0.5rem; }
    .btn-neo-round { width: 36px; height: 36px; border-radius: 50%; background: #000; border: 1px solid #111; cursor: pointer; transition: 0.3s; }
    .btn-neo-round:hover { border-color: var(--primary); transform: translateY(-2px); }

    /* Modal */
    .modal-root { position: fixed; inset: 0; background: rgba(0,0,0,0.8); backdrop-filter: blur(6px); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 1rem; }
    .pf-modal { background: #0a0a0a; border: 1px solid #1a1a1a; border-radius: 16px; width: 100%; max-width: 720px; max-height: 92vh; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 40px 80px rgba(0,0,0,0.8); }

    .pf-header { display: flex; align-items: center; justify-content: space-between; padding: 1.25rem 1.75rem; border-bottom: 1px solid #111; flex-shrink: 0; }
    .pf-header-left { display: flex; align-items: center; gap: 0.875rem; }
    .pf-tag { font-size: 0.6rem; font-weight: 950; letter-spacing: 2px; color: var(--primary); background: rgba(192,132,252,0.08); border: 1px solid rgba(192,132,252,0.2); padding: 0.2rem 0.55rem; border-radius: 4px; }
    .pf-title { font-size: 1rem; font-weight: 800; color: #e2e8f0; margin: 0; }
    .pf-close { background: none; border: none; font-size: 1rem; color: #444; cursor: pointer; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: 6px; transition: 0.2s; }
    .pf-close:hover { background: #111; color: #fff; }

    .pf-tabs { display: flex; padding: 0 1.75rem; border-bottom: 1px solid #111; flex-shrink: 0; }
    .pf-tab { display: flex; align-items: center; gap: 0.5rem; padding: 0.875rem 1.25rem; background: none; border: none; border-bottom: 2px solid transparent; color: #444; font-size: 0.75rem; font-weight: 700; cursor: pointer; transition: 0.2s; margin-bottom: -1px; letter-spacing: 0.5px; text-transform: uppercase; }
    .pf-tab:hover { color: #777; }
    .pf-tab.active { color: #e2e8f0; border-bottom-color: var(--primary); }
    .pf-tab-num { font-size: 0.58rem; font-weight: 950; opacity: 0.4; font-family: monospace; }
    .pf-tab-dot { width: 5px; height: 5px; border-radius: 50%; background: #222; transition: background 0.3s; flex-shrink: 0; }
    .pf-tab-dot.ok { background: #4ade80; box-shadow: 0 0 6px #4ade80; }

    .pf-form { display: flex; flex-direction: column; flex: 1; overflow: hidden; min-height: 0; }
    .pf-body { flex: 1; overflow-y: auto; padding: 1.75rem; }
    .pf-body::-webkit-scrollbar { width: 3px; }
    .pf-body::-webkit-scrollbar-thumb { background: #1f1f1f; border-radius: 10px; }
    .pf-pane { display: flex; flex-direction: column; gap: 1.25rem; }

    .pf-group { display: flex; flex-direction: column; gap: 0.4rem; }
    .pf-label { font-size: 0.68rem; font-weight: 800; color: #4a5568; letter-spacing: 1px; text-transform: uppercase; }
    .req { color: var(--primary); }
    .pf-input { background: #0d0d0d; border: 1px solid #1a1a1a; border-radius: 8px; padding: 0.7rem 0.875rem; color: #e2e8f0; font-size: 0.9rem; width: 100%; transition: border-color 0.2s; box-sizing: border-box; }
    .pf-input:focus { outline: none; border-color: rgba(192,132,252,0.4); }
    .pf-textarea { resize: vertical; min-height: 100px; font-family: inherit; line-height: 1.6; }
    .pf-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }

    .pf-footer { display: flex; align-items: center; justify-content: space-between; padding: 1rem 1.75rem; border-top: 1px solid #111; flex-shrink: 0; background: #070707; }
    .pf-footer-nav { display: flex; align-items: center; gap: 0.625rem; }
    .pf-btn-cancel { background: none; border: 1px solid #1a1a1a; color: #444; padding: 0.55rem 1.1rem; border-radius: 8px; cursor: pointer; font-size: 0.78rem; font-weight: 700; transition: 0.2s; }
    .pf-btn-cancel:hover { color: #888; border-color: #2a2a2a; }
    .pf-btn-prev { background: #111; border: 1px solid #1d1d1d; color: #777; padding: 0.55rem 1.1rem; border-radius: 8px; cursor: pointer; font-size: 0.78rem; font-weight: 700; transition: 0.2s; }
    .pf-btn-prev:hover { color: #ccc; border-color: #333; }
    .pf-btn-next { background: #161616; border: 1px solid #2a2a2a; color: #e2e8f0; padding: 0.55rem 1.25rem; border-radius: 8px; cursor: pointer; font-size: 0.78rem; font-weight: 800; transition: 0.2s; }
    .pf-btn-next:hover { border-color: rgba(192,132,252,0.5); color: var(--primary); }
    .pf-btn-save { background: var(--primary); border: none; color: #000; padding: 0.55rem 1.5rem; border-radius: 8px; cursor: pointer; font-size: 0.82rem; font-weight: 900; transition: filter 0.2s; }
    .pf-btn-save:hover:not(:disabled) { filter: brightness(1.12); }
    .pf-btn-save:disabled { opacity: 0.3; cursor: not-allowed; }
  `]
})
export class AdminEducationComponent implements OnInit {
  education = signal<Education[]>([]);
  total = signal(0);
  totalPages = signal(0);  activeTab = signal<EduTab>('details');
  query: QueryOptions = { page: 1, limit: 12, search: '', sortBy: 'startDate', sortOrder: 'desc' };
  showModal = signal(false);
  editingId = signal<number | null>(null);
  formEdu: Education = this.resetForm();
  confirmVisible = signal(false);
  pendingDeleteId = signal<number | null>(null);
  api = inject(EducationApiService);
  toast = inject(ToastService);

  private readonly tabs: EduTab[] = ['details', 'content', 'settings'];

  ngOnInit() { this.load(); }

  load() {
    this.api.getAll(this.query).subscribe(res => {
      this.education.set(res);
      this.total.set(res.length);
      this.totalPages.set(1);
    });
  }

  onPageChange(page: number) { this.query.page = page; this.load(); }
  onSearch() { this.query.page = 1; this.load(); }
  toggleSort() { this.query.sortOrder = this.query.sortOrder === 'asc' ? 'desc' : 'asc'; this.load(); }

  prevTab(): EduTab | null { const i = this.tabs.indexOf(this.activeTab()); return i > 0 ? this.tabs[i - 1] : null; }
  nextTab(): EduTab | null { const i = this.tabs.indexOf(this.activeTab()); return i < this.tabs.length - 1 ? this.tabs[i + 1] : null; }
  goTab(tab: EduTab) { this.activeTab.set(tab); }

  openModal(ed?: Education) {
    this.activeTab.set('details');
    if (ed) {
      this.formEdu = { ...ed };
      if (ed.startDate) this.formEdu.startDate = new Date(ed.startDate).toISOString().split('T')[0];
      if (ed.endDate) this.formEdu.endDate = new Date(ed.endDate).toISOString().split('T')[0];
      this.editingId.set(ed.id!);
    } else {
      this.formEdu = this.resetForm();
      this.editingId.set(null);
    }
    this.showModal.set(true);
  }

  closeModal() { this.showModal.set(false); }
  resetForm(): Education { return { school: '', degree: '', field: '', startDate: '', endDate: '', description: '', certificateUrl: '', order: 0 }; }

  save() {
    const obs = this.editingId() ? this.api.update(this.editingId()!, this.formEdu) : this.api.create(this.formEdu);
    obs.subscribe(() => {
      this.toast.success(this.editingId() ? 'Formation mise à jour' : 'Nouveau diplôme enregistré');
      this.load();
      this.closeModal();
    });
  }

  deleteEdu(id: number) {
    this.pendingDeleteId.set(id);
    this.confirmVisible.set(true);
  }

  onDeleteConfirmed() {
    const id = this.pendingDeleteId();
    if (!id) return;
    this.confirmVisible.set(false);
    this.pendingDeleteId.set(null);
    this.api.delete(id).subscribe(() => {
      this.toast.warning('Formation supprimée');
      this.load();
    });
  }
}
