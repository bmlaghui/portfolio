import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EducationApiService } from '../../services/admin-api.services';
import { Education, QueryOptions } from '../../interfaces/admin.interfaces';
import { PaginationComponent } from '../../components/pagination/pagination';
import { EmptyDataComponent } from '../../components/empty-data/empty-data';
import { ToastService } from '../../../core/services/toast.service';

type EduTab = 'details' | 'story';

@Component({
  selector: 'app-admin-education',
  standalone: true,
  imports: [CommonModule, FormsModule, EmptyDataComponent],
  template: `
    <div class="admin-page">
      <div class="header-section">
        <div class="titles">
          <div class="cyber-badge">Academic Records</div>
          <h1>Cursus & Formations</h1>
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
              <div class="input-wrap"><input type="text" [(ngModel)]="query.search" (ngModelChange)="onSearch()" placeholder="ÉCOLE, DIPLÔME..." class="console-input"></div>
           </div>
           <div class="console-meta"><div class="stat-node"><span class="val">{{ total() }}</span><span class="lab">DEGREES</span></div></div>
        </div>
      </div>

      <div class="content-area">
        <div class="edu-grid" *ngIf="education().length > 0; else emptyState">
          <div class="edu-card glass-card" *ngFor="let ed of education(); let i = index" [style.animation-delay]="i * 0.1 + 's'">
            <div class="edu-header">
               <div class="school-icon">🏛️</div>
               <div class="school-info"><h3 class="degree">{{ ed.degree }}</h3><span class="school">{{ ed.school }}</span></div>
            </div>
            <div class="edu-body"><div class="period">{{ ed.startDate | date:'yyyy' }} — {{ ed.endDate ? (ed.endDate | date:'yyyy') : 'PRÉSENT' }}</div><p class="field">{{ ed.field }}</p></div>
            <div class="edu-actions">
               <button class="btn-action-glass" (click)="openModal(ed)">ÉDITER</button>
               <button class="btn-action-glass del" (click)="deleteEdu(ed.id!)">RÉVOQUER</button>
            </div>
          </div>
        </div>
        <ng-template #emptyState>
          <app-empty-data icon="🎓" title="Aucun Diplôme" (action)="openModal()"></app-empty-data>
        </ng-template>
      </div>

      <div class="modal-root" *ngIf="showModal()" (click)="closeModal()">
        <div class="modal-frame" (click)="$event.stopPropagation()">
           <aside class="modal-sidebar">
              <div class="brand">EDU.SYS</div>
              <nav class="nav-steps">
                 <button [class.active]="activeTab() === 'details'" (click)="activeTab.set('details')"><span>01 DÉTAILS</span><span class="dot-status" [class.valid]="formEdu.school && formEdu.degree"></span></button>
                 <button [class.active]="activeTab() === 'story'" (click)="activeTab.set('story')"><span>02 STORY</span><span class="dot-status" [class.valid]="formEdu.description"></span></button>
              </nav>
           </aside>
           <main class="modal-main">
              <header class="main-header">
                <div class="titles"><h2>QUALIFICATION</h2><span class="breadcrumb">admin // nexus // {{ activeTab() }}</span></div>
                <button class="btn-exit" (click)="closeModal()">×</button>
              </header>
              <form (ngSubmit)="save()" class="liquid-form" #eduForm="ngForm">
                 <div class="tab-pane reveal" *ngIf="activeTab() === 'details'">
                    <div class="form-group"><label>Établissement</label><input type="text" [(ngModel)]="formEdu.school" name="school" required class="cyber-input"></div>
                    <div class="form-grid" style="display:grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
                       <div class="form-group"><label>Diplôme</label><input type="text" [(ngModel)]="formEdu.degree" name="deg" required class="cyber-input"></div>
                       <div class="form-group"><label>Domaine</label><input type="text" [(ngModel)]="formEdu.field" name="field" required class="cyber-input"></div>
                       <div class="form-group"><label>Année Début</label><input type="date" [(ngModel)]="formEdu.startDate" name="start" required class="cyber-input"></div>
                       <div class="form-group"><label>Année Fin</label><input type="date" [(ngModel)]="formEdu.endDate" name="end" class="cyber-input"></div>
                    </div>
                    <div class="next-step-hint"><button type="button" class="btn-next-tab" (click)="activeTab.set('story')">RÉCIT ACADÉMIQUE →</button></div>
                 </div>
                 <div class="tab-pane reveal" *ngIf="activeTab() === 'story'">
                    <div class="form-group full"><label>Description / Réalisations</label><textarea [(ngModel)]="formEdu.description" name="desc" class="cyber-input area" rows="12"></textarea></div>
                    <footer class="modal-footer-final"><button type="button" class="btn-cancel" (click)="closeModal()">QUITTER</button><div class="spacer"></div><button type="submit" class="btn-submit-cyber" [disabled]="eduForm.invalid">VALIDER LE DIPLÔME</button></footer>
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
    .edu-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 2rem; }
    .edu-card { padding: 2rem; display: flex; flex-direction: column; gap: 1.5rem; transition: 0.3s; }
    .edu-card:hover { transform: translateY(-5px); border-color: var(--primary); }
    .edu-header { display: flex; align-items: center; gap: 1.5rem; }
    .school-icon { font-size: 2rem; width: 60px; height: 60px; display: flex; align-items: center; justify-content: center; background: #000; border-radius: 12px; border: 1px solid #111; }
    .degree { font-size: 1.2rem; font-weight: 950; color: #fff; margin: 0; }
    .school { font-size: 0.75rem; color: var(--primary); font-weight: 950; text-transform: uppercase; letter-spacing: 1px; }
    .edu-body .period { font-family: monospace; font-size: 0.8rem; color: #222; font-weight: 950; margin-bottom: 0.5rem; }
    .field { font-size: 0.9rem; color: #475569; }
    .edu-actions { display: flex; gap: 1rem; border-top: 1px solid rgba(255,255,255,0.02); padding-top: 1.5rem; }
    .btn-action-glass { background: rgba(255,255,255,0.01); border: 1px solid #111; color: #222; font-size: 0.7rem; font-weight: 950; padding: 0.6rem 1rem; cursor: pointer; transition: 0.3s; }
    .btn-action-glass:hover { color: #fff; border-color: #333; }
    .btn-action-glass.del:hover { color: #ef4444; border-color: rgba(239, 68, 68, 0.2); }
    .btn-exit { background: none; border: none; font-size: 2.5rem; color: #111; cursor: pointer; }
    .btn-exit:hover { color: #fff; }
  `]
})
export class AdminEducationComponent implements OnInit {
  education = signal<Education[]>([]);
  total = signal(0);
  query: QueryOptions = { page: 1, limit: 12, sortBy: 'startDate', sortOrder: 'desc' };
  showModal = signal(false);
  activeTab = signal<EduTab>('details');
  editingId = signal<number | null>(null);
  formEdu: Education = this.resetForm();
  api = inject(EducationApiService);
  toast = inject(ToastService);

  ngOnInit() { this.load(); }
  load() { this.api.getAll(this.query).subscribe(res => { this.education.set(res.items); this.total.set(res.meta.total); }); }
  onSearch() { this.load(); }
  openModal(ed?: Education) { this.activeTab.set('details'); if (ed) { this.formEdu = { ...ed }; if (ed.startDate) this.formEdu.startDate = new Date(ed.startDate).toISOString().split('T')[0]; if (ed.endDate) this.formEdu.endDate = new Date(ed.endDate).toISOString().split('T')[0]; this.editingId.set(ed.id!); } else { this.formEdu = this.resetForm(); this.editingId.set(null); } this.showModal.set(true); }
  closeModal() { this.showModal.set(false); }
  resetForm(): Education { return { school: '', degree: '', field: '', startDate: '', description: '', order: 0 }; }
  
  save() { 
    const obs = this.editingId() ? this.api.update(this.editingId()!, this.formEdu) : this.api.create(this.formEdu); 
    obs.subscribe(() => { 
      this.toast.success(this.editingId() ? 'Qualification mise à jour' : 'Nouveau diplôme enregistré');
      this.load(); 
      this.closeModal(); 
    }); 
  }
  deleteEdu(id: number) { 
    if (confirm('Voulez-vous vraiment supprimer ce diplôme ?')) {
      this.api.delete(id).subscribe(() => {
        this.toast.warning('Qualification révoquée de la base');
        this.load();
      });
    }
  }
}
