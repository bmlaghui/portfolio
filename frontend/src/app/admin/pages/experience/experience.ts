import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExperienceApiService } from '../../services/admin-api.services';
import { Experience, QueryOptions } from '../../interfaces/admin.interfaces';
import { PaginationComponent } from '../../components/pagination/pagination';
import { EmptyDataComponent } from '../../components/empty-data/empty-data';
import { ToastService } from '../../../core/services/toast.service';

type ExpTab = 'core' | 'fr' | 'en';

@Component({
  selector: 'app-admin-experience',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationComponent, EmptyDataComponent],
  template: `
    <div class="admin-page">
      <div class="header-section">
        <div class="titles">
          <div class="cyber-badge">Career Nexus</div>
          <h1>Parcours Expert</h1>
          <p>Chronologie de vos déploiements professionnels.</p>
        </div>
        <button class="btn-cyber-primary" (click)="openModal()">
          <span class="btn-glitch">Nouvelle Étape</span>
          <span class="btn-icon">💼</span>
        </button>
      </div>

       <div class="control-console-container">
        <div class="control-console">
           <div class="console-segment search">
              <span class="segment-label">FILTRAGE_CARRIÈRE</span>
              <div class="input-wrap"><input type="text" [(ngModel)]="query.search" (ngModelChange)="onSearch()" placeholder="ENTREPRISE, POSTE..." class="console-input"></div>
           </div>
           <div class="console-segment sort">
              <span class="segment-label">INDEX_CHRONO</span>
              <div class="select-wrap">
                 <select [(ngModel)]="query.sortBy" (change)="load()" class="console-select">
                    <option value="startDate">DÉBUT</option>
                    <option value="company">SOCIÉTÉ</option>
                 </select>
                 <button (click)="toggleSort()" class="sort-toggle-btn" [class.desc]="query.sortOrder === 'desc'"><span class="arrow">↓</span></button>
              </div>
           </div>
           <div class="console-meta"><div class="stat-node"><span class="val">{{ total() }}</span><span class="lab">NODES</span></div></div>
        </div>
      </div>

      <div class="content-area">
        <div class="exp-list" *ngIf="experience().length > 0; else emptyState">
          <div class="exp-item glass-neo-deep" *ngFor="let exp of experience(); let i = index" [style.animation-delay]="i * 0.1 + 's'">
            <div class="exp-visual">
              <div class="badge">{{ exp.company.charAt(0) | uppercase }}</div>
              <div class="line"></div>
            </div>
            <div class="exp-content">
              <div class="header">
                <div><h3 class="pos">{{ exp.position }}</h3><span class="comp">{{ exp.company | uppercase }}</span></div>
                <div class="period">
                   <span class="tag-date">{{ exp.startDate | date:'MMM yyyy' }}</span>
                   <span class="to">→</span>
                   <span class="tag-date" [class.current]="exp.current">{{ exp.current ? 'PRESENT // ACTIVE' : (exp.endDate | date:'MMM yyyy') }}</span>
                </div>
              </div>
              <div class="skills-row"><span *ngFor="let s of exp.skills" class="skill-tag">{{ s }}</span></div>
            </div>
            <div class="exp-actions">
               <button class="btn-neo-round" (click)="openModal(exp)">✏️</button>
               <button class="btn-neo-round delete" (click)="deleteExp(exp.id!)">🗑️</button>
            </div>
          </div>
        </div>
        <ng-template #emptyState>
          <app-empty-data icon="👔" title="Archives Vides" text="Aucune trace de votre parcours professionnel n'a été détectée." (action)="openModal()"></app-empty-data>
        </ng-template>
        <div class="footer-pagination" *ngIf="experience().length > 0">
           <app-pagination [page]="query.page!" [totalPages]="totalPages()" [total]="total()" (pageChange)="onPageChange($event)"></app-pagination>
        </div>
      </div>

      <div class="modal-root" *ngIf="showModal()" (click)="closeModal()">
        <div class="modal-frame glass-neo-deep" (click)="$event.stopPropagation()">
          <aside class="modal-sidebar">
            <div class="brand">EXP.LOG</div>
            <nav class="nav-steps">
               <button [class.active]="activeTab() === 'core'" (click)="activeTab.set('core')"><span>01 FONDATIONS</span><span class="dot-status" [class.valid]="formExp.company && formExp.startDate"></span></button>
               <button [class.active]="activeTab() === 'fr'" (click)="activeTab.set('fr')"><span>02 RÉCIT FR</span><span class="dot-status" [class.valid]="formExp.position && formExp.description"></span></button>
               <button [class.active]="activeTab() === 'en'" (click)="activeTab.set('en')"><span>03 STORY EN</span><span class="dot-status" [class.valid]="formExp.positionEn && formExp.descriptionEn"></span></button>
            </nav>
          </aside>
          <main class="modal-main">
            <header class="main-header">
              <div class="titles"><h2>EXPÉRIENCE</h2><span class="breadcrumb">admin // nexus // {{ activeTab() }}</span></div>
              <button class="btn-exit" (click)="closeModal()">×</button>
            </header>
            <form (ngSubmit)="save()" class="liquid-form" #expForm="ngForm">
               <div class="modal-scroll-area">
                 <div class="tab-pane reveal" *ngIf="activeTab() === 'core'">
                   <div class="form-grid-two">
                      <div class="form-group full"><label>Entreprise / Organisation</label><input type="text" [(ngModel)]="formExp.company" name="comp" required class="cyber-input" placeholder="Ex: CyberDyne Systems..."></div>
                      <div class="form-group"><label>Date de Début</label><input type="date" [(ngModel)]="formExp.startDate" name="start" required class="cyber-input"></div>
                      <div class="form-group"><label>Date de Fin</label><input type="date" [(ngModel)]="formExp.endDate" name="end" [disabled]="formExp.current" class="cyber-input"></div>
                      <div class="form-group full"><label class="hybrid-toggle"><input type="checkbox" [(ngModel)]="formExp.current" name="curr"><div class="toggle-control"></div><span class="toggle-text">MISSION TOUJOURS ACTIVE</span></label></div>
                      <div class="form-group full"><label>Stack Technologique (virgules)</label><input type="text" [ngModel]="skillsString()" (ngModelChange)="setSkills($event)" name="skills" class="cyber-input" placeholder="Angular, NestJS, Docker..."></div>
                   </div>
                   <div class="next-step-hint"><button type="button" class="btn-next-tab" (click)="activeTab.set('fr')">DÉTAILS FRANÇAIS →</button></div>
                 </div>
                 <div class="tab-pane reveal" *ngIf="activeTab() === 'fr'">
                    <div class="form-group"><label>Intitulé du Poste (FR)</label><input type="text" [(ngModel)]="formExp.position" name="pf" required class="cyber-input"></div>
                    <div class="form-group full"><label>Missions & Réalisations (FR)</label><textarea [(ngModel)]="formExp.description" name="df" required class="cyber-input area" rows="10"></textarea></div>
                    <div class="next-step-hint"><button type="button" class="btn-next-tab" (click)="activeTab.set('en')">DÉTAILS ANGLAIS →</button></div>
                 </div>
                 <div class="tab-pane reveal" *ngIf="activeTab() === 'en'">
                    <div class="form-group"><label>Job Title (EN)</label><input type="text" [(ngModel)]="formExp.positionEn" name="pe" required class="cyber-input"></div>
                    <div class="form-group full"><label>Missions & Impact (EN)</label><textarea [(ngModel)]="formExp.descriptionEn" name="de" required class="cyber-input area" rows="10"></textarea></div>
                 </div>
               </div>
               <footer class="modal-footer-final"><button type="button" class="btn-cancel" (click)="closeModal()">ANNULER</button><div class="spacer"></div><button type="submit" class="btn-submit-cyber" [disabled]="expForm.invalid">SCELLER L'ÉXPERIENCE</button></footer>
            </form>
          </main>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .btn-cyber-primary { background: #fff; color: #000; border: none; padding: 1rem 3rem; font-weight: 950; text-transform: uppercase; cursor: pointer; transition: 0.3s; clip-path: polygon(10% 0, 100% 0, 90% 100%, 0 100%); }
    .btn-cyber-primary:hover { background: var(--primary); color: #fff; }
    .exp-list { display: flex; flex-direction: column; gap: 1.5rem; }
    .exp-item { display: grid; grid-template-columns: 80px 1fr 120px; align-items: stretch; padding: 2rem; border-radius: 20px; border: 1px solid rgba(255,255,255,0.03); transition: 0.3s; }
    .exp-item:hover { border-color: var(--primary); background: rgba(192, 132, 252, 0.03); }
    .exp-visual { display: flex; flex-direction: column; align-items: center; gap: 1rem; }
    .badge { width: 44px; height: 44px; border-radius: 12px; background: #000; border: 1px solid #111; color: var(--primary); display: flex; align-items: center; justify-content: center; font-weight: 950; font-size: 1.2rem; }
    .line { flex: 1; width: 1px; background: rgba(192, 132, 252, 0.1); }
    .exp-content { display: flex; flex-direction: column; gap: 1rem; }
    .pos { font-size: 1.4rem; color: #fff; margin: 0; font-weight: 950; letter-spacing: -0.5px; }
    .comp { font-weight: 950; color: var(--primary); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 2px; }
    .period { display: flex; gap: 1rem; align-items: center; font-size: 0.7rem; font-weight: 950; color: #444; }
    .tag-date { font-family: monospace; color: #1e293b; background: rgba(255,255,255,0.03); padding: 0.2rem 0.5rem; border-radius: 4px; }
    .current { color: #4ade80; text-shadow: 0 0 10px rgba(74, 222, 128, 0.3); }
    .skill-tag { padding: 0.25rem 0.7rem; background: #000; border: 1px solid #111; border-radius: 6px; font-size: 0.65rem; font-weight: 950; color: #475569; margin-right: 0.5rem; }
    .btn-neo-round { width: 38px; height: 38px; border-radius: 50%; background: #000; border: 1px solid #111; cursor: pointer; transition: 0.3s; margin-bottom: 0.5rem; }
    .btn-neo-round:hover { border-color: var(--primary); transform: translateY(-3px); }
    .btn-exit { background: none; border: none; font-size: 2.5rem; color: #111; cursor: pointer; }
    .btn-exit:hover { color: #fff; }

    .modal-scroll-area { max-height: 60vh; overflow-y: auto; padding-right: 1.5rem; margin-bottom: 2rem; }
    .modal-scroll-area::-webkit-scrollbar { width: 4px; }
    .modal-scroll-area::-webkit-scrollbar-thumb { background: var(--primary); border-radius: 10px; }
    .form-grid-two { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
    .form-grid-two .full { grid-column: span 2; }
  `]
})
export class AdminExperienceComponent implements OnInit {
  experience = signal<Experience[]>([]);
  total = signal(0);
  totalPages = signal(0);
  activeTab = signal<ExpTab>('core');
  query: QueryOptions = { page: 1, limit: 12, search: '', sortBy: 'startDate', sortOrder: 'desc' };
  showModal = signal(false);
  editingId = signal<number | null>(null);
  formExp: Experience = this.resetForm();
  api = inject(ExperienceApiService);
  toast = inject(ToastService);
  ngOnInit() { this.load(); }
  load() { this.api.getAll(this.query).subscribe(res => { this.experience.set(res.items); this.total.set(res.meta.total); this.totalPages.set(res.meta.totalPages); }); }
  onPageChange(page: number) { this.query.page = page; this.load(); }
  onSearch() { this.query.page = 1; this.load(); }
  toggleSort() { this.query.sortOrder = this.query.sortOrder === 'asc' ? 'desc' : 'asc'; this.load(); }
  openModal(exp?: Experience) { this.activeTab.set('core'); if (exp) { this.formExp = { ...exp, skills: [...(exp.skills || [])] }; if (exp.startDate) this.formExp.startDate = new Date(exp.startDate).toISOString().split('T')[0]; if (exp.endDate) this.formExp.endDate = new Date(exp.endDate).toISOString().split('T')[0]; this.editingId.set(exp.id!); } else { this.formExp = this.resetForm(); this.editingId.set(null); } this.showModal.set(true); }
  closeModal() { this.showModal.set(false); }
  resetForm(): Experience { return { company: '', position: '', positionEn: '', startDate: '', current: false, description: '', descriptionEn: '', skills: [], order: 0 }; }
  skillsString() { return this.formExp.skills?.join(', ') || ''; }
  setSkills(val: string) { this.formExp.skills = val.split(',').map(s => s.trim()).filter(s => !!s); }
  save() { 
    const obs = this.editingId() ? this.api.update(this.editingId()!, this.formExp) : this.api.create(this.formExp); 
    obs.subscribe(() => { 
      this.toast.success(this.editingId() ? 'Parcours mis à jour' : 'Nouvelle étape ajoutée au nexus');
      this.load(); 
      this.closeModal(); 
    }); 
  }
  deleteExp(id: number) { 
    if (confirm('Voulez-vous vraiment supprimer cette expérience ?')) {
      this.api.delete(id).subscribe(() => {
        this.toast.warning('Étape supprimée du parcours');
        this.load();
      });
    }
  }
}
