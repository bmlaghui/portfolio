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
          <article class="skill-node" *ngFor="let s of skills(); let i = index" [style.animation-delay]="i * 0.05 + 's'">
            <div class="node-header">
              <span class="cat-pill" [attr.data-cat]="s.category"><i></i>{{ s.category | uppercase }}</span>
              <span class="order-badge">#{{ (s.order || 0).toString().padStart(2, '0') }}</span>
            </div>
            <div class="node-main">
              <div class="node-icon">{{ s.icon || '🛠️' }}</div>
              <div><span class="node-kicker">TECHNOLOGIE</span><h3 class="node-name">{{ s.name }}</h3></div>
            </div>
            <div class="node-level">
              <div class="level-head"><span>MAÎTRISE</span><b>{{ levelLabel(s.level || 1) }}</b></div>
              <div class="level-segments">
                <span *ngFor="let point of levelPoints" [class.active]="point <= (s.level || 0)"></span>
              </div>
            </div>
            <footer class="node-footer">
              <span>{{ s.level || 0 }}/5</span>
              <div class="node-actions">
                <button type="button" class="edit" (click)="openModal(s)">ÉDITER</button>
                <button type="button" class="del" (click)="deleteSkill(s.id!)" aria-label="Supprimer">✕</button>
              </div>
            </footer>
          </article>
        </div>
        <ng-template #emptyState>
          <app-empty-data icon="🔌" title="Arsenal Déconnecté" text="Aucune compétence n'est actuellement liée à la matrice." (action)="openModal()"></app-empty-data>
        </ng-template>
        <div class="footer-pagination" *ngIf="total() > query.limit!">
           <app-pagination [page]="query.page!" [totalPages]="totalPages()" [total]="total()" (pageChange)="onPageChange($event)"></app-pagination>
        </div>
      </div>

      <div class="modal-root" *ngIf="showModal()" (click)="closeModal()">
        <div class="skill-modal" (click)="$event.stopPropagation()">
          <header class="sm-header">
            <div><span>SKILLS.DB</span><h2>{{ editingId() ? 'Modifier la compétence' : 'Nouvelle compétence' }}</h2></div>
            <button type="button" (click)="closeModal()" aria-label="Fermer">✕</button>
          </header>
          <nav class="sm-tabs">
            <button type="button" [class.active]="activeTab() === 'info'" (click)="activeTab.set('info')"><i>01</i><span>Identité<small>Nom, catégorie, icône</small></span><b [class.done]="formSkill.name && formSkill.category">✓</b></button>
            <button type="button" [class.active]="activeTab() === 'level'" (click)="activeTab.set('level')"><i>02</i><span>Expertise<small>Niveau et position</small></span><b class="done">✓</b></button>
          </nav>
          <form (ngSubmit)="save()" class="sm-form" #skillForm="ngForm">
            <div class="sm-body">
              <section class="sm-pane" *ngIf="activeTab() === 'info'">
                <div class="pane-title"><span>ÉTAPE 01 · IDENTITÉ</span><h3>Ajoutez une technologie à votre arsenal.</h3><p>Choisissez un nom court et une icône immédiatement reconnaissable.</p></div>
                <div class="identity-layout">
                  <div class="icon-preview">{{ formSkill.icon || '🛠️' }}<small>APERÇU</small></div>
                  <div class="fields">
                    <label><span class="label-text">Nom de la technologie <em>*</em></span><input type="text" [(ngModel)]="formSkill.name" name="name" required placeholder="Ex. Angular"></label>
                    <div class="field-grid">
                      <label><span class="label-text">Catégorie <em>*</em></span><select [(ngModel)]="formSkill.category" name="category" required><option value="Frontend">Frontend</option><option value="Backend">Backend</option><option value="DevOps">DevOps</option><option value="Cloud">Cloud / Infra</option><option value="Other">Autre</option></select></label>
                      <label>Icône<input type="text" [(ngModel)]="formSkill.icon" name="icon" maxlength="12" placeholder="🚀 ou ⚛️"></label>
                    </div>
                  </div>
                </div>
              </section>
              <section class="sm-pane" *ngIf="activeTab() === 'level'">
                <div class="pane-title"><span>ÉTAPE 02 · EXPERTISE</span><h3>Positionnez votre niveau avec justesse.</h3><p>Cette jauge est visible sur le portfolio : privilégiez une évaluation crédible.</p></div>
                <div class="level-studio">
                  <div class="level-score"><strong>{{ formSkill.level }}</strong><span>/ 5</span><small>{{ levelLabel(formSkill.level || 1) }}</small></div>
                  <div class="range-wrap">
                    <input type="range" [(ngModel)]="formSkill.level" name="level" min="1" max="5" step="1">
                    <div class="range-labels"><span>Découverte</span><span>Autonome</span><span>Expertise</span></div>
                  </div>
                </div>
                <label class="order-field">Ordre d’affichage<input type="number" min="0" [(ngModel)]="formSkill.order" name="order"><small>Les valeurs les plus basses apparaissent en premier.</small></label>
              </section>
            </div>
            <footer class="sm-footer">
              <button type="button" class="cancel" (click)="closeModal()">Annuler</button>
              <div>
                <button type="button" class="previous" *ngIf="activeTab() === 'level'" (click)="activeTab.set('info')">← Précédent</button>
                <button type="button" class="next" *ngIf="activeTab() === 'info'" (click)="activeTab.set('level')">Continuer →</button>
                <button type="submit" class="save" *ngIf="activeTab() === 'level'" [disabled]="skillForm.invalid">{{ editingId() ? 'Enregistrer' : 'Ajouter à l’arsenal' }}</button>
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
    .skills-matrix { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.25rem; }
    .skill-node { position: relative; overflow: hidden; display: flex; flex-direction: column; min-height: 280px; padding: 1.4rem; background: radial-gradient(circle at 90% 0, rgba(192,132,252,.06), transparent 35%), #0a0a0a; border: 1px solid #181818; border-radius: 16px; transition: .3s; }
    .skill-node::before { content: ''; position: absolute; inset: 0 0 auto; height: 2px; background: linear-gradient(90deg, transparent, rgba(192,132,252,.6), transparent); opacity: 0; transition: .3s; }
    .skill-node:hover { transform: translateY(-5px); border-color: rgba(192,132,252,.25); box-shadow: 0 20px 45px rgba(0,0,0,.35); }
    .skill-node:hover::before { opacity: 1; }
    .node-header { display: flex; justify-content: space-between; align-items: center; }
    .cat-pill { min-width: 0; max-width: 72%; display: flex; align-items: center; gap: .4rem; overflow: hidden; padding: .28rem .55rem; color: #667080; background: #0d0d0d; border: 1px solid #1d1d1d; border-radius: 20px; font-size: .54rem; font-weight: 900; letter-spacing: .8px; text-overflow: ellipsis; white-space: nowrap; }
    .cat-pill i { width: 5px; height: 5px; flex-shrink: 0; background: var(--primary); border-radius: 50%; box-shadow: 0 0 7px var(--primary); }
    .cat-pill[data-cat="Backend"] i { background: #22d3ee; box-shadow: 0 0 7px #22d3ee; }
    .cat-pill[data-cat="DevOps"] i { background: #f59e0b; box-shadow: 0 0 7px #f59e0b; }
    .cat-pill[data-cat="Cloud"] i { background: #60a5fa; box-shadow: 0 0 7px #60a5fa; }
    .order-badge { color: #303640; font: .6rem monospace; }
    .node-main { flex: 1; display: flex; align-items: center; gap: 1rem; min-width: 0; padding: 1.7rem 0 1.4rem; }
    .node-main > div:last-child { min-width: 0; }
    .node-icon { width: 58px; height: 58px; display: grid; place-items: center; flex-shrink: 0; overflow: hidden; font-size: 2rem; background: #0e0e0e; border: 1px solid #1c1c1c; border-radius: 14px; filter: drop-shadow(0 8px 15px rgba(0,0,0,.3)); }
    .node-kicker { color: #353c47; font-size: .5rem; font-weight: 900; letter-spacing: 1.6px; }
    .node-name { overflow-wrap: anywhere; margin: .2rem 0 0; color: #f1f5f9; font-size: 1.35rem; font-weight: 850; letter-spacing: -.4px; }
    .node-level { padding-bottom: 1.2rem; }
    .level-head { display: flex; justify-content: space-between; margin-bottom: .5rem; color: #363d48; font-size: .54rem; font-weight: 850; letter-spacing: 1px; }
    .level-head b { color: #6c7480; font-size: .56rem; }
    .level-segments { display: grid; grid-template-columns: repeat(5, 1fr); gap: 4px; }
    .level-segments span { height: 5px; background: #191919; border-radius: 5px; }
    .level-segments span.active { background: linear-gradient(90deg, #8b5cf6, #c084fc); box-shadow: 0 0 8px rgba(192,132,252,.25); }
    .node-footer { display: flex; justify-content: space-between; align-items: center; padding-top: .9rem; border-top: 1px solid #171717; }
    .node-footer > span { color: #3f4651; font: .65rem monospace; }
    .node-actions { display: flex; gap: .4rem; }
    .node-actions button { height: 31px; padding: 0 .7rem; border-radius: 7px; cursor: pointer; font-size: .57rem; font-weight: 900; transition: .2s; }
    .node-actions .edit { color: #d8b4fe; background: rgba(192,132,252,.08); border: 1px solid rgba(192,132,252,.2); }
    .node-actions .edit:hover { color: #080808; background: var(--primary); }
    .node-actions .del { width: 31px; padding: 0; color: #f87171; background: rgba(239,68,68,.05); border: 1px solid rgba(239,68,68,.15); }
    .node-actions .del:hover { color: #fff; background: #dc2626; }

    .modal-root { position: fixed; inset: 0; z-index: 1000; display: grid; place-items: center; padding: 1rem; background: rgba(0,0,0,.82); backdrop-filter: blur(8px); }
    .skill-modal { width: min(760px, 100%); max-height: 92vh; display: flex; flex-direction: column; overflow: hidden; background: radial-gradient(circle at 90% 0, rgba(192,132,252,.07), transparent 30%), #080808; border: 1px solid #1d1d1d; border-radius: 18px; box-shadow: 0 35px 90px rgba(0,0,0,.8); }
    .sm-header { display: flex; align-items: center; justify-content: space-between; padding: 1.15rem 1.5rem; border-bottom: 1px solid #151515; }
    .sm-header > div { display: flex; align-items: center; gap: .8rem; }
    .sm-header div > span { padding: .25rem .5rem; color: var(--primary); background: rgba(192,132,252,.08); border: 1px solid rgba(192,132,252,.18); border-radius: 5px; font: 900 .54rem monospace; letter-spacing: 1.4px; }
    .sm-header h2 { margin: 0; color: #e5e7eb; font-size: .95rem; }
    .sm-header > button { width: 32px; height: 32px; color: #4b5360; background: transparent; border: 0; border-radius: 7px; cursor: pointer; }
    .sm-header > button:hover { color: #fff; background: #141414; }
    .sm-tabs { display: grid; grid-template-columns: repeat(2, 1fr); padding: 0 1.5rem; border-bottom: 1px solid #151515; }
    .sm-tabs button { display: flex; align-items: center; gap: .7rem; padding: .85rem 1rem; color: #414853; background: transparent; border: 0; border-bottom: 2px solid transparent; text-align: left; cursor: pointer; }
    .sm-tabs button.active { color: #dfe4ec; border-bottom-color: var(--primary); }
    .sm-tabs i { font: normal 800 .55rem monospace; opacity: .6; }
    .sm-tabs button > span { flex: 1; display: flex; flex-direction: column; gap: .12rem; font-size: .7rem; font-weight: 800; }
    .sm-tabs small { color: #303640; font-size: .56rem; }
    .sm-tabs b { width: 16px; height: 16px; display: grid; place-items: center; color: #252525; border: 1px solid #222; border-radius: 50%; font-size: .5rem; }
    .sm-tabs b.done { color: #061109; background: #4ade80; border-color: #4ade80; }
    .sm-form { min-height: 0; display: flex; flex-direction: column; }
    .sm-body { overflow-y: auto; padding: 1.8rem; }
    .sm-pane { display: flex; flex-direction: column; gap: 1.5rem; animation: sm-in .25s ease; }
    @keyframes sm-in { from { opacity: 0; transform: translateY(5px); } }
    .pane-title > span { color: var(--primary); font: 900 .55rem monospace; letter-spacing: 1.5px; }
    .pane-title h3 { margin: .5rem 0 .25rem; color: #f1f5f9; font-size: 1.35rem; }
    .pane-title p { margin: 0; color: #4b5360; font-size: .7rem; }
    .identity-layout { display: grid; grid-template-columns: 130px 1fr; gap: 1.4rem; align-items: start; }
    .icon-preview { aspect-ratio: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: .7rem; font-size: 3.2rem; background: radial-gradient(circle, rgba(192,132,252,.1), transparent 65%), #0b0b0b; border: 1px solid #1c1c1c; border-radius: 14px; }
    .icon-preview small { color: #353c46; font: .5rem monospace; letter-spacing: 1.3px; }
    .fields, .field-grid { display: grid; gap: 1rem; }
    .field-grid { grid-template-columns: 1fr 1fr; }
    .fields label, .order-field { display: flex; flex-direction: column; gap: .4rem; color: #6d7581; font-size: .64rem; font-weight: 800; text-transform: uppercase; letter-spacing: .6px; }
    .label-text { display: inline-flex; align-items: baseline; gap: .22rem; }
    label em { color: var(--primary); font-style: normal; }
    .fields input, .fields select, .order-field input { width: 100%; box-sizing: border-box; padding: .78rem .85rem; color: #dce2eb; background: #0b0b0b; border: 1px solid #1d1d1d; border-radius: 8px; outline: 0; font-size: .82rem; }
    .fields input:focus, .fields select:focus, .order-field input:focus { border-color: rgba(192,132,252,.5); }
    .level-studio { display: grid; grid-template-columns: 150px 1fr; gap: 1.5rem; align-items: center; padding: 1.3rem; background: #0b0b0b; border: 1px solid #1a1a1a; border-radius: 13px; }
    .level-score { display: grid; grid-template-columns: auto 1fr; align-items: end; border-right: 1px solid #1b1b1b; }
    .level-score strong { color: var(--primary); font-size: 3.2rem; line-height: .9; }
    .level-score > span { color: #3e4550; font-size: .8rem; }
    .level-score small { grid-column: 1/-1; margin-top: .55rem; color: #747d89; font-size: .62rem; font-weight: 800; }
    .range-wrap input { width: 100%; accent-color: var(--primary); cursor: pointer; }
    .range-labels { display: flex; justify-content: space-between; margin-top: .55rem; color: #343b46; font-size: .52rem; font-weight: 800; }
    .order-field { max-width: 240px; }
    .order-field small { color: #343a43; font-size: .55rem; font-weight: 500; text-transform: none; }
    .sm-footer { display: flex; justify-content: space-between; align-items: center; padding: .9rem 1.5rem; background: #070707; border-top: 1px solid #151515; }
    .sm-footer > div { display: flex; gap: .5rem; }
    .sm-footer button { padding: .58rem 1rem; border-radius: 8px; cursor: pointer; font-size: .68rem; font-weight: 800; }
    .sm-footer .cancel { color: #4d5561; background: transparent; border: 1px solid #1c1c1c; }
    .sm-footer .previous { color: #707986; background: #0d0d0d; border: 1px solid #202020; }
    .sm-footer .next { color: #e2e8f0; background: #151515; border: 1px solid #292929; }
    .sm-footer .save { color: #080808; background: var(--primary); border: 0; }
    .sm-footer .save:disabled { opacity: .3; cursor: not-allowed; }
    @media(max-width:600px) {
      .skills-matrix { grid-template-columns: 1fr; }
      .skill-modal { height: 100dvh; max-height: none; border: 0; border-radius: 0; }
      .sm-tabs { padding: 0 .5rem; }
      .sm-tabs small { display: none; }
      .sm-body { padding: 1.3rem 1rem; }
      .identity-layout, .level-studio { grid-template-columns: 1fr; }
      .icon-preview { width: 100px; }
      .field-grid { grid-template-columns: 1fr; }
      .level-score { border-right: 0; border-bottom: 1px solid #1b1b1b; padding-bottom: 1rem; }
    }
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
  readonly levelPoints = [1, 2, 3, 4, 5];

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
  levelLabel(level: number) {
    return ['Découverte', 'Pratique', 'Autonome', 'Avancé', 'Expertise'][Math.max(0, Math.min(4, level - 1))];
  }
  
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
