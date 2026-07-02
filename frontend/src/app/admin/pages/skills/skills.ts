import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SkillsApiService } from '../../services/admin-api.services';
import { Skill, QueryOptions } from '../../interfaces/admin.interfaces';
import { PaginationComponent } from '../../components/pagination/pagination';
import { EmptyDataComponent } from '../../components/empty-data/empty-data';
import { ToastService } from '../../../core/services/toast.service';

type SkillTab = 'info' | 'level';

@Component({
  selector: 'app-admin-skills',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationComponent, EmptyDataComponent],
  template: `
    <div class="admin-page">
      <div class="header-section">
        <div class="titles">
          <div class="cyber-badge">Tech Stack Arsenal</div>
          <h1>Arsenal de Compétences</h1>
          <p>Gestion de la matrice d'expertise et du stack technologique.</p>
        </div>
        <button class="btn-cyber-primary" (click)="openModal()">
          <span class="btn-glitch">Nouvel Outil</span>
          <span class="btn-icon">⚡</span>
        </button>
      </div>

      <div class="control-console-container">
        <div class="control-console">
           <div class="console-segment search">
              <span class="segment-label">FILTRE_MATRICE</span>
              <div class="input-wrap"><input type="text" [(ngModel)]="query.search" (ngModelChange)="onSearch()" placeholder="SCANNER LA STACK..." class="console-input"></div>
           </div>
           <div class="console-segment sort">
              <span class="segment-label">CALIBRAGE</span>
              <div class="select-wrap">
                 <select [(ngModel)]="query.sortBy" (change)="load()" class="console-select">
                    <option value="category">CATEG_GROUP</option>
                    <option value="level">EXPERTISE_LVL</option>
                 </select>
                 <button (click)="toggleSort()" class="sort-toggle-btn" [class.desc]="query.sortOrder === 'desc'"><span class="arrow">↓</span></button>
              </div>
           </div>
           <div class="console-meta"><div class="stat-node"><span class="val">{{ total() }}</span><span class="lab">NODES</span></div></div>
        </div>
      </div>

      <div class="content-area">
        <div class="skills-matrix" *ngIf="skills().length > 0; else emptyState">
          <div class="skill-node glass-neo-deep" *ngFor="let s of skills(); let i = index" [style.animation-delay]="i * 0.05 + 's'">
            <div class="node-header">
              <div class="cat-pill" [attr.data-cat]="s.category">{{ s.category | uppercase }}</div>
              <div class="node-actions"><button (click)="openModal(s)">✏️</button><button class="del" (click)="deleteSkill(s.id!)">🗑️</button></div>
            </div>
            <div class="node-main"><div class="node-icon">{{ s.icon || '🛠️' }}</div><h3 class="node-name">{{ s.name }}</h3></div>
            <div class="node-level">
               <div class="level-bar-wrap"><div class="level-fill" [style.width]="((s.level || 0) * 20) + '%'" [attr.data-lvl]="s.level"></div><div class="level-overlay"></div></div>
               <div class="level-label">EXPERTISE_LEVEL: {{ s.level }}/5</div>
            </div>
          </div>
        </div>
        <ng-template #emptyState>
          <app-empty-data icon="🔌" title="Arsenal Déconnecté" text="Aucune compétence n'est actuellement liée à la matrice." (action)="openModal()"></app-empty-data>
        </ng-template>
        <div class="footer-pagination" *ngIf="total() > query.limit!">
           <app-pagination [page]="query.page!" [totalPages]="totalPages()" [total]="total()" (pageChange)="onPageChange($event)"></app-pagination>
        </div>
      </div>

      <div class="modal-root" *ngIf="showModal()" (click)="closeModal()">
        <div class="modal-frame glass-neo-deep" (click)="$event.stopPropagation()">
            <aside class="modal-sidebar">
               <div class="brand">SKILLS.DB</div>
               <nav class="nav-steps">
                  <button [class.active]="activeTab() === 'info'" (click)="activeTab.set('info')"><span>01 BASICS</span><span class="dot-status" [class.valid]="formSkill.name && formSkill.category"></span></button>
                  <button [class.active]="activeTab() === 'level'" (click)="activeTab.set('level')"><span>02 EXPERTISE</span><span class="dot-status" [class.valid]="true"></span></button>
               </nav>
            </aside>
            <main class="modal-main">
               <header class="main-header">
                  <div class="titles"><h2>CALIBRAGE TECHNIQUE</h2><span class="breadcrumb">admin // arsenal // {{ activeTab() }}</span></div>
                  <button class="btn-exit" (click)="closeModal()">×</button>
               </header>
               <form (ngSubmit)="save()" class="liquid-form" #skillForm="ngForm">
                  <div class="modal-scroll-area">
                    <div class="tab-pane reveal" *ngIf="activeTab() === 'info'">
                       <div class="form-group"><label>Nom Technologie</label><input type="text" [(ngModel)]="formSkill.name" name="name" required #sn="ngModel" placeholder="Ex: Angular..." class="cyber-input" [class.invalid]="sn.invalid && sn.touched"></div>
                       <div class="form-group"><label>Catégorie</label><select [(ngModel)]="formSkill.category" name="cat" required class="cyber-input"><option value="Frontend">Frontend</option><option value="Backend">Backend</option><option value="DevOps">DevOps</option><option value="Cloud">Cloud/Infra</option><option value="Other">Autre</option></select></div>
                       <div class="form-group"><label>Icône (Emoji / SVG)</label><input type="text" [(ngModel)]="formSkill.icon" name="icon" placeholder="🚀, ⚛️..." class="cyber-input"></div>
                       <div class="next-step-hint"><button type="button" class="btn-next-tab" (click)="activeTab.set('level')">CALIBRATION EXPERTISE →</button></div>
                    </div>
                    <div class="tab-pane reveal" *ngIf="activeTab() === 'level'">
                       <div class="form-group"><label>Niveau de maîtrise : <span style="color:var(--primary); font-weight:950;">{{ formSkill.level }}/5</span></label>
                          <div class="range-wrap">
                             <input type="range" [(ngModel)]="formSkill.level" name="lvl" min="1" max="5" step="1" class="cyber-range">
                             <div class="range-labels"><span>INITIATION</span><span>MAÎTRISE</span><span>EXPERTISE</span></div>
                          </div>
                       </div>
                       <div class="form-group"><label>Ordre d'affichage</label><input type="number" [(ngModel)]="formSkill.order" name="ord" class="cyber-input"></div>
                    </div>
                  </div>
                  <footer class="modal-footer-final"><button type="button" class="btn-cancel" (click)="closeModal()">ANNULER</button><div class="spacer"></div><button type="submit" class="btn-submit-cyber" [disabled]="skillForm.invalid">SCELLER DANS L'ARSENAL</button></footer>
               </form>
            </main>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .btn-cyber-primary { background: #fff; color: #000; border: none; padding: 1rem 3rem; font-weight: 950; text-transform: uppercase; cursor: pointer; transition: 0.3s; clip-path: polygon(10% 0, 100% 0, 90% 100%, 0 100%); }
    .btn-cyber-primary:hover { background: var(--primary); color: #fff; }
    .skills-matrix { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 2rem; }
    .skill-node { padding: 2.5rem; display: flex; flex-direction: column; gap: 2rem; transition: 0.4s; overflow: hidden; border-radius: 20px; border: 1px solid rgba(255,255,255,0.03); }
    .skill-node:hover { transform: translateY(-5px); border-color: var(--primary); background: rgba(192, 132, 252, 0.05); }
    .node-header { display: flex; justify-content: space-between; align-items: center; }
    .cat-pill { font-size: 0.6rem; font-weight: 950; padding: 0.2rem 0.6rem; background: #000; border-radius: 4px; color: #475569; border: 1px solid #111; letter-spacing: 1px; }
    .node-actions { display: flex; gap: 0.5rem; }
    .node-actions button { background: none; border: none; font-size: 1rem; cursor: pointer; opacity: 0.3; transition: 0.3s; }
    .skill-node:hover .node-actions button { opacity: 1; }
    .node-actions button:hover { transform: scale(1.2); }
    .node-actions .del:hover { color: #ef4444; }
    .node-main { display: flex; align-items: center; gap: 1.5rem; }
    .node-icon { font-size: 2.5rem; filter: drop-shadow(0 0 10px rgba(255,255,255,0.1)); }
    .node-name { font-size: 1.6rem; font-weight: 950; color: #fff; margin: 0; }
    .level-bar-wrap { height: 6px; background: #000; border-radius: 10px; overflow: hidden; position: relative; border: 1px solid #111; }
    .level-fill { height: 100%; background: var(--primary); box-shadow: 0 0 15px var(--primary); transition: 0.6s cubic-bezier(0.4, 0, 0.2, 1); }
    .level-label { font-size: 0.65rem; font-weight: 950; color: #222; margin-top: 0.5rem; letter-spacing: 1px; }
    .btn-exit { background: none; border: none; font-size: 2.5rem; color: #111; cursor: pointer; }
    .btn-exit:hover { color: #fff; }

    .modal-scroll-area { max-height: 60vh; overflow-y: auto; padding-right: 1rem; margin-bottom: 2rem; }
    .modal-scroll-area::-webkit-scrollbar { width: 4px; }
    .modal-scroll-area::-webkit-scrollbar-thumb { background: var(--primary); border-radius: 10px; }

    .cyber-range { width: 100%; accent-color: var(--primary); cursor: pointer; height: 30px; }
    .range-labels { display: flex; justify-content: space-between; margin-top: 1rem; font-size: 0.6rem; font-weight: 950; color: #222; letter-spacing: 1px; }
  `]
})
export class AdminSkillsComponent implements OnInit {
  skills = signal<Skill[]>([]);
  total = signal(0);
  totalPages = signal(0);
  activeTab = signal<SkillTab>('info');
  query: QueryOptions = { page: 1, limit: 12, search: '', sortBy: 'order', sortOrder: 'asc' };
  showModal = signal(false);
  editingId = signal<number | null>(null);
  formSkill: Skill = this.resetForm();
  api = inject(SkillsApiService);
  toast = inject(ToastService);

  ngOnInit() { this.load(); }
  load() { 
    this.api.getAll(this.query).subscribe(res => { 
      this.skills.set(res.items); 
      this.total.set(res.meta.total); 
      this.totalPages.set(res.meta.totalPages);
    }); 
  }
  onPageChange(page: number) { this.query.page = page; this.load(); }
  onSearch() { this.query.page = 1; this.load(); }
  toggleSort() { this.query.sortOrder = this.query.sortOrder === 'asc' ? 'desc' : 'asc'; this.load(); }
  openModal(s?: Skill) { 
    this.activeTab.set('info'); 
    if (s) { 
      this.formSkill = { ...s }; 
      this.editingId.set(s.id!); 
    } else { 
      this.formSkill = this.resetForm(); 
      this.editingId.set(null); 
    } 
    this.showModal.set(true); 
  }
  closeModal() { this.showModal.set(false); }
  resetForm(): Skill { return { name: '', category: 'Frontend', icon: '🛠️', level: 3, order: 0 }; }
  
  save() { 
    const obs = this.editingId() ? this.api.update(this.editingId()!, this.formSkill) : this.api.create(this.formSkill); 
    obs.subscribe(() => { 
      this.toast.success(this.editingId() ? 'Expertise recalibrée' : 'Nouvelle compétence intégrée à l\'arsenal');
      this.load(); 
      this.closeModal(); 
    }); 
  }
  deleteSkill(id: number) { 
    if (confirm('Voulez-vous vraiment supprimer cette compétence ?')) {
      this.api.delete(id).subscribe(() => {
        this.toast.warning('Compétence désinstallée');
        this.load();
      });
    }
  }
}
