import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectsApiService } from '../../services/admin-api.services';
import { Project, QueryOptions } from '../../interfaces/admin.interfaces';
import { PaginationComponent } from '../../components/pagination/pagination';
import { EmptyDataComponent } from '../../components/empty-data/empty-data';
import { FileUploaderComponent } from '../../components/file-uploader/file-uploader';
import { ToastService } from '../../../core/services/toast.service';

type FormTab = 'fr' | 'en' | 'case' | 'config';

@Component({
  selector: 'app-admin-projects',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationComponent, EmptyDataComponent, FileUploaderComponent],
  template: `
    <div class="admin-page">
      <div class="header-section">
        <div class="titles">
          <div class="cyber-badge">Engineering Hub</div>
          <h1>Projets & Labs</h1>
          <p>Vitrine technologique de vos déploiements et innovations.</p>
        </div>
        <button class="btn-cyber-primary" (click)="openModal()">
          <span class="btn-glitch">Nouvelle Réalisation</span>
          <span class="btn-icon">🚀</span>
        </button>
      </div>

      <div class="control-console-container">
        <div class="control-console">
           <div class="console-segment search">
              <span class="segment-label">ORDRE_RECHERCHE</span>
              <div class="input-wrap">
                 <span class="pulse-icon">🔍</span>
                 <input type="text" [(ngModel)]="query.search" (ngModelChange)="onSearch()" placeholder="SCANNER LA DB..." class="console-input">
              </div>
           </div>
           <div class="console-segment sort">
              <span class="segment-label">SÉQUENÇAGE</span>
              <div class="select-wrap">
                 <select [(ngModel)]="query.sortBy" (change)="load()" class="console-select">
                    <option value="order">ID_ORDRE</option>
                    <option value="title">ALPHABÉTIQUE</option>
                    <option value="createdAt">TIMESTAMP_CRÉATION</option>
                 </select>
                 <button (click)="toggleSort()" class="sort-toggle-btn" [class.desc]="query.sortOrder === 'desc'"><span class="arrow">↓</span></button>
              </div>
           </div>
           <div class="console-meta">
              <div class="stat-node">
                 <span class="val">{{ total() }}</span>
                 <span class="lab">TOTAL_ENTRIES</span>
              </div>
           </div>
        </div>
      </div>

      <div class="content-area">
        <div class="table-frame glass-card" *ngIf="projects().length > 0; else emptyState">
          <table class="cyber-list-table">
            <thead>
              <tr>
                <th>VISUEL / TITRE</th>
                <th>STACK TECHNIQUE</th>
                <th>VISIBILITÉ</th>
                <th>ORDRE</th>
                <th class="actions-th">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let p of projects(); let i = index" [style.animation-delay]="i * 0.05 + 's'">
                <td>
                  <div class="project-cell">
                    <div class="p-img-box"><img [src]="p.imageUrl || '/assets/placeholder.jpg'" alt=""><div class="p-glow"></div></div>
                    <div class="p-info"><span class="p-title">{{ p.title }}</span><span class="p-path">/projects/{{ p.id }}</span></div>
                  </div>
                </td>
                <td><div class="tech-row"><span *ngFor="let t of p.tags" class="tech-pill">{{ t }}</span></div></td>
                <td><div class="status-box" [class.online]="p.published"><span class="pulse-dot"></span> {{ p.published ? 'ONLINE' : 'OFFLINE' }}</div></td>
                <td><div class="order-val">#{{ p.order }}</div></td>
                <td class="actions-td">
                  <div class="actions-group">
                    <button class="action-btn-neo edit" (click)="openModal(p)">✏️</button>
                    <button class="action-btn-neo delete" (click)="deleteProject(p.id!)">🗑️</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <ng-template #emptyState>
          <app-empty-data icon="🛠️" title="Atelier Vide" text="Aucun projet détecté dans les serveurs." (action)="openModal()"></app-empty-data>
        </ng-template>

        <div class="pagination-footer" *ngIf="projects().length > 0">
          <app-pagination [page]="query.page!" [totalPages]="totalPages()" [total]="total()" (pageChange)="onPageChange($event)"></app-pagination>
        </div>
      </div>

      <div class="modal-root" *ngIf="showModal()" (click)="closeModal()">
        <div class="modal-frame glass-neo-deep" (click)="$event.stopPropagation()">
          <aside class="modal-sidebar">
            <div class="brand">PROJ.EXE</div>
            <nav class="nav-steps">
              <button [class.active]="activeTab() === 'fr'" (click)="activeTab.set('fr')">
                <span>01 CONTENU FR</span><span class="dot-status" [class.valid]="formProject.title && formProject.description"></span>
              </button>
              <button [class.active]="activeTab() === 'en'" (click)="activeTab.set('en')">
                <span>02 CONTENT EN</span><span class="dot-status" [class.valid]="formProject.titleEn && formProject.descriptionEn"></span>
              </button>
              <button [class.active]="activeTab() === 'config'" (click)="activeTab.set('config')">
                <span>04 CONFIGURATION</span><span class="dot-status" [class.valid]="formProject.imageUrl || formProject.github"></span>
              </button>
              <button [class.active]="activeTab() === 'case'" (click)="activeTab.set('case')">
                <span>03 ÉTUDE DE CAS</span><span class="dot-status" [class.valid]="formProject.challenge && formProject.solution"></span>
              </button>
            </nav>
          </aside>

          <main class="modal-main">
            <header class="main-header">
              <div class="titles"><h2>ÉDITION RÉALISATION</h2><span class="breadcrumb">admin // nexus // {{ activeTab() }}</span></div>
              <button class="btn-exit" (click)="closeModal()">×</button>
            </header>

            <form (ngSubmit)="save()" class="liquid-form" #projForm="ngForm">
              <div class="modal-scroll-area">
                <div class="tab-pane reveal" *ngIf="activeTab() === 'fr'">
                  <div class="form-group large">
                    <label>Titre (FR)</label>
                    <input type="text" [(ngModel)]="formProject.title" name="title" required #tf="ngModel" class="cyber-input" [class.invalid]="tf.invalid && tf.touched">
                    <span class="help-text">Titre principal (version FR).</span>
                  </div>
                  <div class="form-group full">
                    <label>Description détaillée (FR)</label>
                    <textarea [(ngModel)]="formProject.description" name="desc" required class="cyber-input area" rows="8"></textarea>
                  </div>
                  <div class="next-step-hint"><button type="button" class="btn-next-tab" (click)="activeTab.set('en')">SECTION SUIVANTE (EN) →</button></div>
                </div>

                <div class="tab-pane reveal" *ngIf="activeTab() === 'en'">
                  <div class="form-group large">
                    <label>Project Title (EN)</label>
                    <input type="text" [(ngModel)]="formProject.titleEn" name="te" required #te="ngModel" class="cyber-input" [class.invalid]="te.invalid && te.touched">
                  </div>
                  <div class="form-group full">
                    <label>Description (EN)</label>
                    <textarea [(ngModel)]="formProject.descriptionEn" name="de" required class="cyber-input area" rows="8"></textarea>
                  </div>
                  <div class="next-step-hint"><button type="button" class="btn-next-tab" (click)="activeTab.set('case')">ÉTUDE DE CAS →</button></div>
                </div>

                <div class="tab-pane reveal" *ngIf="activeTab() === 'case'">
                  <div class="form-grid-three">
                    <div class="form-group"><label>Slug URL</label><input [(ngModel)]="formProject.slug" name="slug" class="cyber-input" placeholder="mon-projet"></div>
                    <div class="form-group"><label>Rôle</label><input [(ngModel)]="formProject.role" name="role" class="cyber-input"></div>
                    <div class="form-group"><label>Durée</label><input [(ngModel)]="formProject.duration" name="duration" class="cyber-input"></div>
                    <div class="form-group full"><label>Défi (FR)</label><textarea [(ngModel)]="formProject.challenge" name="challenge" class="cyber-input area" rows="4"></textarea></div>
                    <div class="form-group full"><label>Solution (FR)</label><textarea [(ngModel)]="formProject.solution" name="solution" class="cyber-input area" rows="4"></textarea></div>
                    <div class="form-group full"><label>Résultats FR (un par ligne)</label><textarea [(ngModel)]="resultsText" name="results" class="cyber-input area" rows="4"></textarea></div>
                    <div class="form-group full"><label>Challenge (EN)</label><textarea [(ngModel)]="formProject.challengeEn" name="challengeEn" class="cyber-input area" rows="4"></textarea></div>
                    <div class="form-group full"><label>Solution (EN)</label><textarea [(ngModel)]="formProject.solutionEn" name="solutionEn" class="cyber-input area" rows="4"></textarea></div>
                    <div class="form-group full"><label>Results EN (one per line)</label><textarea [(ngModel)]="resultsEnText" name="resultsEn" class="cyber-input area" rows="4"></textarea></div>
                  </div>
                  <div class="next-step-hint"><button type="button" class="btn-next-tab" (click)="activeTab.set('config')">CONFIGURATION FINALE →</button></div>
                </div>

                <div class="tab-pane reveal" *ngIf="activeTab() === 'config'">
                  <div class="form-grid-three">
                    <div class="form-group full"><label>Visuel Haute-Résolution (Fichier)</label>
                      <app-file-uploader [currentUrl]="formProject.imageUrl" (uploaded)="formProject.imageUrl = $event" (removed)="formProject.imageUrl = ''"></app-file-uploader>
                    </div>
                    <div class="form-group"><label>Lien GitHub</label><input type="text" [(ngModel)]="formProject.github" name="git" class="cyber-input" placeholder="https://github.com/..."></div>
                    <div class="form-group"><label>Lien Démo / Live</label><input type="text" [(ngModel)]="formProject.link" name="live" class="cyber-input" placeholder="https://..."></div>
                    <div class="form-group"><label>Stack (tags séparés par virgules)</label><input type="text" [ngModel]="tagsString()" (ngModelChange)="setTags($event)" name="tags" class="cyber-input"></div>
                    <div class="form-group"><label>Index d'Affichage</label><input type="number" [(ngModel)]="formProject.order" name="ord" class="cyber-input"></div>
                  </div>
                  <div class="toggles-row">
                     <label class="hybrid-toggle"><input type="checkbox" [(ngModel)]="formProject.published" name="pub"><div class="toggle-control"></div><span class="toggle-text">DÉPLOIEMENT PUBLIC ACTIF</span></label>
                  </div>
                </div>
              </div>
              
              <footer class="modal-footer-final">
                <button type="button" class="btn-cancel" (click)="closeModal()">ANNULER</button><div class="spacer"></div>
                <button type="submit" class="btn-submit-cyber" [disabled]="projForm.invalid">SCELLER LE PROJET</button>
              </footer>
            </form>
          </main>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .btn-cyber-primary { background: #fff; color: #000; border: none; padding: 1rem 3rem; font-weight: 950; text-transform: uppercase; cursor: pointer; transition: 0.3s; clip-path: polygon(10% 0, 100% 0, 90% 100%, 0 100%); }
    .btn-cyber-primary:hover { background: var(--primary); color: #fff; }
    .cyber-list-table { width: 100%; border-collapse: collapse; }
    .cyber-list-table th { background: rgba(255,255,255,0.01); padding: 1.5rem; text-align: left; font-size: 0.65rem; font-weight: 950; color: #444; letter-spacing: 2px; }
    .cyber-list-table td { padding: 1.5rem; border-top: 1px solid rgba(255,255,255,0.02); }
    .project-cell { display: flex; align-items: center; gap: 1.5rem; }
    .p-img-box { width: 80px; height: 50px; border-radius: 8px; overflow: hidden; position: relative; border: 1px solid #111; }
    .p-img-box img { width: 100%; height: 100%; object-fit: cover; }
    .p-title { display: block; font-size: 1.1rem; font-weight: 950; color: #fff; }
    .p-path { font-size: 0.65rem; color: #222; font-family: monospace; }
    .tech-pill { font-size: 0.6rem; padding: 0.2rem 0.5rem; background: #111; border-radius: 4px; color: #475569; margin-right: 0.4rem; border: 1px solid #222; }
    .status-box { font-size: 0.65rem; font-weight: 950; color: #334155; display: flex; align-items: center; gap: 0.5rem; }
    .status-box.online { color: #4ade80; }
    .pulse-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; animation: pulse-glow 2s infinite; }
    .action-btn-neo { width: 38px; height: 38px; background: #000; border: 1px solid #111; border-radius: 6px; cursor: pointer; transition: 0.3s; }
    .action-btn-neo:hover { border-color: var(--primary); transform: translateY(-3px); }
    .btn-exit { background: none; border: none; font-size: 2.5rem; color: #111; cursor: pointer; }
    .btn-exit:hover { color: #fff; }

    .modal-scroll-area { max-height: 65vh; overflow-y: auto; padding-right: 1rem; margin-bottom: 2rem; }
    .modal-scroll-area::-webkit-scrollbar { width: 4px; }
    .modal-scroll-area::-webkit-scrollbar-thumb { background: var(--primary); border-radius: 10px; }

    .form-grid-three { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
    .form-grid-three .full { grid-column: span 2; }
  `]
})
export class AdminProjectsComponent implements OnInit {
  projects = signal<Project[]>([]);
  total = signal(0);
  totalPages = signal(0);
  activeTab = signal<FormTab>('fr');
  query: QueryOptions = { page: 1, limit: 12, search: '', sortBy: 'order', sortOrder: 'asc' };
  showModal = signal(false);
  editingId = signal<number | null>(null);
  formProject: Project = this.resetForm();
  resultsText = '';
  resultsEnText = '';
  api = inject(ProjectsApiService);
  toast = inject(ToastService);

  ngOnInit() { this.load(); }
  load() { this.api.getAll(this.query).subscribe(res => { this.projects.set(res.items); this.total.set(res.meta.total); this.totalPages.set(res.meta.totalPages); }); }
  onPageChange(page: number) { this.query.page = page; this.load(); }
  onSearch() { this.query.page = 1; this.load(); }
  toggleSort() { this.query.sortOrder = this.query.sortOrder === 'asc' ? 'desc' : 'asc'; this.load(); }
  openModal(p?: Project) { 
    this.activeTab.set('fr'); 
    if (p) { 
      this.formProject = { ...p, tags: [...(p.tags || [])] }; 
      this.resultsText = (p.results || []).join('\n');
      this.resultsEnText = (p.resultsEn || []).join('\n');
      this.editingId.set(p.id!); 
    } else { 
      this.formProject = this.resetForm(); 
      this.resultsText = '';
      this.resultsEnText = '';
      this.editingId.set(null); 
    } 
    this.showModal.set(true); 
  }
  closeModal() { this.showModal.set(false); }
  resetForm(): Project { return { title: '', description: '', titleEn: '', descriptionEn: '', tags: [], published: true, order: 0, github: '', link: '', imageUrl: '' }; }
  tagsString() { return this.formProject.tags?.join(', ') || ''; }
  setTags(val: string) { this.formProject.tags = val.split(',').map(s => s.trim()).filter(s => !!s); }
  save() {
    this.formProject.results = this.resultsText.split('\n').map(value => value.trim()).filter(Boolean);
    this.formProject.resultsEn = this.resultsEnText.split('\n').map(value => value.trim()).filter(Boolean);
    const obs = this.editingId() ? this.api.update(this.editingId()!, this.formProject) : this.api.create(this.formProject); 
    obs.subscribe(() => { 
      this.toast.success(this.editingId() ? 'Projet mis à jour avec succès' : 'Nouveau projet scellé dans la base');
      this.load(); 
      this.closeModal(); 
    }); 
  }
  deleteProject(id: number) { 
    if (confirm('Voulez-vous vraiment supprimer ce projet ?')) {
      this.api.delete(id).subscribe(() => {
        this.toast.warning('Projet supprimé des archives');
        this.load();
      });
    }
  }
}
