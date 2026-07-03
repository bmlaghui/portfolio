import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExperienceApiService } from '../../services/admin-api.services';
import { Experience, QueryOptions } from '../../interfaces/admin.interfaces';
import { PaginationComponent } from '../../components/pagination/pagination';
import { EmptyDataComponent } from '../../components/empty-data/empty-data';
import { FileUploaderComponent } from '../../components/file-uploader/file-uploader';
import { RichEditorComponent } from '../../components/rich-editor/rich-editor';
import { ConfirmModalComponent } from '../../components/confirm-modal/confirm-modal';
import { ToastService } from '../../../core/services/toast.service';

type ExpTab = 'company' | 'content' | 'settings';
type ContentLang = 'fr' | 'en';

@Component({
  selector: 'app-admin-experience',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationComponent, EmptyDataComponent, FileUploaderComponent, RichEditorComponent, ConfirmModalComponent],
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
            <div class="input-wrap">
              <span class="pulse-icon">🔍</span>
              <input type="text" [(ngModel)]="query.search" (ngModelChange)="onSearch()" placeholder="ENTREPRISE, POSTE..." class="console-input">
            </div>
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
          <div class="console-meta">
            <div class="stat-node"><span class="val">{{ total() }}</span><span class="lab">NODES</span></div>
          </div>
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
              <div class="exp-header">
                <div>
                  <h3 class="pos">{{ exp.position }}</h3>
                  <span class="comp">{{ exp.company | uppercase }}</span>
                </div>
                <div class="period">
                  <span class="tag-date">{{ exp.startDate | date:'MMM yyyy' }}</span>
                  <span class="to">→</span>
                  <span class="tag-date" [class.current]="exp.current">{{ exp.current ? 'PRÉSENT' : (exp.endDate | date:'MMM yyyy') }}</span>
                </div>
              </div>
              <div class="skills-row">
                <span *ngFor="let s of exp.skills" class="skill-tag">{{ s }}</span>
              </div>
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

      <!-- ── CONFIRM DELETE ── -->
      <app-confirm-modal
        [visible]="confirmVisible()"
        title="Supprimer l'expérience"
        message="Cette action est irréversible. L'expérience sera définitivement supprimée."
        icon="🗑️"
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
        [danger]="true"
        (confirmed)="onDeleteConfirmed()"
        (cancelled)="confirmVisible.set(false)">
      </app-confirm-modal>

      <!-- ── MODAL ── -->
      <div class="modal-root" *ngIf="showModal()" (click)="closeModal()">
        <div class="pf-modal" (click)="$event.stopPropagation()">

          <!-- Header -->
          <header class="pf-header">
            <div class="pf-header-left">
              <span class="pf-tag">EXP.LOG</span>
              <h2 class="pf-title">{{ editingId() ? 'Modifier l\'expérience' : 'Nouvelle expérience' }}</h2>
            </div>
            <button class="pf-close" (click)="closeModal()">✕</button>
          </header>

          <!-- Tabs -->
          <nav class="pf-tabs">
            <button type="button" class="pf-tab" [class.active]="activeTab() === 'company'" (click)="activeTab.set('company')">
              <span class="pf-tab-num">01</span>
              <span class="pf-tab-label">Entreprise</span>
              <span class="pf-tab-dot" [class.ok]="!!(formExp.company && formExp.startDate)"></span>
            </button>
            <button type="button" class="pf-tab" [class.active]="activeTab() === 'content'" (click)="activeTab.set('content')">
              <span class="pf-tab-num">02</span>
              <span class="pf-tab-label">Contenu</span>
              <span class="pf-tab-dot" [class.ok]="!!(formExp.position && formExp.description)"></span>
            </button>
            <button type="button" class="pf-tab" [class.active]="activeTab() === 'settings'" (click)="activeTab.set('settings')">
              <span class="pf-tab-num">03</span>
              <span class="pf-tab-label">Paramètres</span>
              <span class="pf-tab-dot" [class.ok]="formExp.skills.length > 0"></span>
            </button>
          </nav>

          <form (ngSubmit)="save()" class="pf-form" #expForm="ngForm">
            <div class="pf-body">

              <!-- ── TAB ENTREPRISE ── -->
              <div class="pf-pane" *ngIf="activeTab() === 'company'">
                <div class="pf-group">
                  <label class="pf-label">Entreprise / Organisation <span class="req">*</span></label>
                  <input type="text" [(ngModel)]="formExp.company" name="company" required class="pf-input" placeholder="Ex : Acme Corp, Freelance…">
                </div>

                <div class="pf-group">
                  <label class="pf-label">Logo de l'entreprise</label>
                  <div class="pf-logo-row">
                    <div class="pf-logo-preview" *ngIf="formExp.logoUrl; else noLogo">
                      <img [src]="formExp.logoUrl" alt="Logo">
                      <button type="button" class="pf-logo-del" (click)="formExp.logoUrl = ''">✕</button>
                    </div>
                    <ng-template #noLogo>
                      <div class="pf-logo-placeholder">{{ formExp.company ? formExp.company.charAt(0).toUpperCase() : '?' }}</div>
                    </ng-template>
                    <div class="pf-logo-uploader">
                      <app-file-uploader [currentUrl]="formExp.logoUrl || undefined" (uploaded)="formExp.logoUrl = $event" (removed)="formExp.logoUrl = ''"></app-file-uploader>
                    </div>
                  </div>
                </div>

                <div class="pf-group">
                  <label class="pf-label">LinkedIn de l'entreprise</label>
                  <input type="url" [(ngModel)]="formExp.linkedinUrl" name="linkedin" class="pf-input" placeholder="https://www.linkedin.com/company/…">
                </div>

                <div class="pf-grid">
                  <div class="pf-group">
                    <label class="pf-label">Date de début <span class="req">*</span></label>
                    <input type="date" [(ngModel)]="formExp.startDate" name="startDate" required class="pf-input">
                  </div>
                  <div class="pf-group">
                    <label class="pf-label">Date de fin</label>
                    <input type="date" [(ngModel)]="formExp.endDate" name="endDate" [disabled]="formExp.current" class="pf-input">
                  </div>
                </div>

                <div class="pf-toggles">
                  <label class="pf-toggle-item">
                    <div class="pf-toggle-track" [class.on]="formExp.current">
                      <input type="checkbox" [(ngModel)]="formExp.current" name="current">
                      <div class="pf-toggle-thumb"></div>
                    </div>
                    <div class="pf-toggle-text">
                      <span class="pf-toggle-label">Mission en cours</span>
                      <span class="pf-toggle-desc">Affiché comme poste actuel</span>
                    </div>
                  </label>
                </div>
              </div>

              <!-- ── TAB CONTENU ── -->
              <div class="pf-pane" *ngIf="activeTab() === 'content'">
                <div class="lang-bar">
                  <button type="button" class="lang-btn" [class.active]="contentLang() === 'fr'" (click)="contentLang.set('fr')">
                    🇫🇷 Français
                  </button>
                  <button type="button" class="lang-btn" [class.active]="contentLang() === 'en'" (click)="contentLang.set('en')">
                    🇬🇧 English
                  </button>
                </div>

                <ng-container *ngIf="contentLang() === 'fr'">
                  <div class="pf-group">
                    <label class="pf-label">Intitulé du poste (FR) <span class="req">*</span></label>
                    <input type="text" [(ngModel)]="formExp.position" name="position" required class="pf-input" placeholder="Ex : Tech Lead, Développeur Full-Stack…">
                  </div>
                  <div class="pf-group">
                    <label class="pf-label">Missions & Réalisations (FR)</label>
                    <app-rich-editor [value]="formExp.description" placeholder="Décrivez vos missions et réalisations…" (valueChange)="formExp.description = $event"></app-rich-editor>
                  </div>
                </ng-container>

                <ng-container *ngIf="contentLang() === 'en'">
                  <div class="pf-group">
                    <label class="pf-label">Job Title (EN)</label>
                    <input type="text" [(ngModel)]="formExp.positionEn" name="positionEn" class="pf-input" placeholder="Ex : Tech Lead, Full-Stack Developer…">
                  </div>
                  <div class="pf-group">
                    <label class="pf-label">Missions & Impact (EN)</label>
                    <app-rich-editor [value]="formExp.descriptionEn ?? ''" placeholder="Describe your missions and achievements…" (valueChange)="formExp.descriptionEn = $event"></app-rich-editor>
                  </div>
                </ng-container>
              </div>

              <!-- ── TAB PARAMÈTRES ── -->
              <div class="pf-pane" *ngIf="activeTab() === 'settings'">
                <div class="pf-group">
                  <label class="pf-label">Stack technique</label>
                  <div class="chips-box">
                    <span class="chip" *ngFor="let skill of formExp.skills; let i = index">
                      {{ skill }}<button type="button" class="chip-del" (click)="removeSkill(i)">×</button>
                    </span>
                    <input
                      type="text"
                      [(ngModel)]="skillInput"
                      name="skillInput"
                      class="chips-text"
                      placeholder="Ajouter une technologie, puis Entrée ↵"
                      (keydown.enter)="addSkill($event)">
                  </div>
                  <p class="pf-hint">Appuyez sur Entrée pour valider chaque technologie.</p>
                </div>

                <div class="pf-group">
                  <label class="pf-label">Ordre d'affichage</label>
                  <input type="number" [(ngModel)]="formExp.order" name="order" class="pf-input" placeholder="0">
                </div>
              </div>

            </div>

            <!-- Footer -->
            <footer class="pf-footer">
              <button type="button" class="pf-btn-cancel" (click)="closeModal()">Annuler</button>
              <div class="pf-footer-nav">
                <button type="button" class="pf-btn-prev" *ngIf="prevTab()" (click)="goTab(prevTab()!)">← Précédent</button>
                <button type="button" class="pf-btn-next" *ngIf="nextTab()" (click)="goTab(nextTab()!)">Suivant →</button>
                <button type="submit" class="pf-btn-save" *ngIf="!nextTab()" [disabled]="!formExp.company || !formExp.startDate || !formExp.position">Enregistrer</button>
              </div>
            </footer>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* ── Page ── */
    .btn-cyber-primary { background: #fff; color: #000; border: none; padding: 1rem 3rem; font-weight: 950; text-transform: uppercase; cursor: pointer; transition: 0.3s; clip-path: polygon(10% 0, 100% 0, 90% 100%, 0 100%); }
    .btn-cyber-primary:hover { background: var(--primary); color: #fff; }

    /* ── List ── */
    .exp-list { display: flex; flex-direction: column; gap: 1.5rem; }
    .exp-item { display: grid; grid-template-columns: 80px 1fr 120px; align-items: stretch; padding: 2rem; border-radius: 20px; border: 1px solid rgba(255,255,255,0.03); transition: 0.3s; }
    .exp-item:hover { border-color: var(--primary); background: rgba(192,132,252,0.03); }
    .exp-visual { display: flex; flex-direction: column; align-items: center; gap: 1rem; }
    .badge { width: 44px; height: 44px; border-radius: 12px; background: #000; border: 1px solid #111; color: var(--primary); display: flex; align-items: center; justify-content: center; font-weight: 950; font-size: 1.2rem; }
    .line { flex: 1; width: 1px; background: rgba(192,132,252,0.1); }
    .exp-content { display: flex; flex-direction: column; gap: 1rem; }
    .exp-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; flex-wrap: wrap; }
    .pos { font-size: 1.4rem; color: #fff; margin: 0; font-weight: 950; letter-spacing: -0.5px; }
    .comp { font-weight: 950; color: var(--primary); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 2px; }
    .period { display: flex; gap: 0.75rem; align-items: center; font-size: 0.7rem; font-weight: 950; color: #444; flex-shrink: 0; }
    .tag-date { font-family: monospace; color: #1e293b; background: rgba(255,255,255,0.03); padding: 0.2rem 0.5rem; border-radius: 4px; }
    .current { color: #4ade80 !important; }
    .skill-tag { padding: 0.25rem 0.7rem; background: #000; border: 1px solid #111; border-radius: 6px; font-size: 0.65rem; font-weight: 950; color: #475569; margin-right: 0.5rem; margin-bottom: 0.25rem; }
    .exp-actions { display: flex; flex-direction: column; align-items: flex-end; gap: 0.5rem; }
    .btn-neo-round { width: 38px; height: 38px; border-radius: 50%; background: #000; border: 1px solid #111; cursor: pointer; transition: 0.3s; }
    .btn-neo-round:hover { border-color: var(--primary); transform: translateY(-3px); }

    /* ── Modal overlay ── */
    .modal-root { position: fixed; inset: 0; background: rgba(0,0,0,0.8); backdrop-filter: blur(6px); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 1rem; }

    /* ── Modal frame ── */
    .pf-modal { background: #0a0a0a; border: 1px solid #1a1a1a; border-radius: 16px; width: 100%; max-width: 920px; max-height: 92vh; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 40px 80px rgba(0,0,0,0.8); }

    /* ── Header ── */
    .pf-header { display: flex; align-items: center; justify-content: space-between; padding: 1.25rem 1.75rem; border-bottom: 1px solid #111; flex-shrink: 0; }
    .pf-header-left { display: flex; align-items: center; gap: 0.875rem; }
    .pf-tag { font-size: 0.6rem; font-weight: 950; letter-spacing: 2px; color: var(--primary); background: rgba(192,132,252,0.08); border: 1px solid rgba(192,132,252,0.2); padding: 0.2rem 0.55rem; border-radius: 4px; }
    .pf-title { font-size: 1rem; font-weight: 800; color: #e2e8f0; margin: 0; }
    .pf-close { background: none; border: none; font-size: 1rem; color: #444; cursor: pointer; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: 6px; transition: 0.2s; }
    .pf-close:hover { background: #111; color: #fff; }

    /* ── Tabs ── */
    .pf-tabs { display: flex; padding: 0 1.75rem; border-bottom: 1px solid #111; flex-shrink: 0; }
    .pf-tab { display: flex; align-items: center; gap: 0.5rem; padding: 0.875rem 1.25rem; background: none; border: none; border-bottom: 2px solid transparent; color: #444; font-size: 0.75rem; font-weight: 700; cursor: pointer; transition: 0.2s; margin-bottom: -1px; letter-spacing: 0.5px; text-transform: uppercase; }
    .pf-tab:hover { color: #777; }
    .pf-tab.active { color: #e2e8f0; border-bottom-color: var(--primary); }
    .pf-tab-num { font-size: 0.58rem; font-weight: 950; opacity: 0.4; font-family: monospace; }
    .pf-tab-dot { width: 5px; height: 5px; border-radius: 50%; background: #222; transition: background 0.3s; flex-shrink: 0; }
    .pf-tab-dot.ok { background: #4ade80; box-shadow: 0 0 6px #4ade80; }

    /* ── Form shell ── */
    .pf-form { display: flex; flex-direction: column; flex: 1; overflow: hidden; min-height: 0; }
    .pf-body { flex: 1; overflow-y: auto; padding: 1.75rem; display: flex; flex-direction: column; gap: 0; }
    .pf-body::-webkit-scrollbar { width: 3px; }
    .pf-body::-webkit-scrollbar-thumb { background: #1f1f1f; border-radius: 10px; }
    .pf-pane { display: flex; flex-direction: column; gap: 1.25rem; }

    /* ── Form groups ── */
    .pf-group { display: flex; flex-direction: column; gap: 0.4rem; }
    .pf-label { font-size: 0.68rem; font-weight: 800; color: #4a5568; letter-spacing: 1px; text-transform: uppercase; }
    .req { color: var(--primary); }
    .pf-input { background: #0d0d0d; border: 1px solid #1a1a1a; border-radius: 8px; padding: 0.7rem 0.875rem; color: #e2e8f0; font-size: 0.9rem; width: 100%; transition: border-color 0.2s; box-sizing: border-box; }
    .pf-input:focus { outline: none; border-color: rgba(192,132,252,0.4); }
    .pf-input:disabled { opacity: 0.35; }
    .pf-hint { font-size: 0.68rem; color: #333; margin: 0; }
    .pf-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }

    /* ── Logo row ── */
    .pf-logo-row { display: grid; grid-template-columns: 80px 1fr; gap: 1rem; align-items: center; }
    .pf-logo-preview { position: relative; width: 72px; height: 72px; border-radius: 12px; overflow: hidden; border: 1px solid #1a1a1a; background: #0d0d0d; flex-shrink: 0; }
    .pf-logo-preview img { width: 100%; height: 100%; object-fit: contain; padding: 4px; }
    .pf-logo-del { position: absolute; top: 2px; right: 2px; background: rgba(239,68,68,0.8); border: none; color: #fff; width: 18px; height: 18px; border-radius: 50%; cursor: pointer; font-size: 0.6rem; display: flex; align-items: center; justify-content: center; }
    .pf-logo-placeholder { width: 72px; height: 72px; border-radius: 12px; background: #0d0d0d; border: 1px dashed #1a1a1a; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: 900; color: var(--primary); flex-shrink: 0; }
    .pf-logo-uploader { flex: 1; }

    /* ── Lang bar ── */
    .lang-bar { display: inline-flex; gap: 0.25rem; padding: 0.2rem; background: #111; border-radius: 8px; border: 1px solid #1a1a1a; }
    .lang-btn { display: flex; align-items: center; gap: 0.35rem; padding: 0.4rem 0.875rem; border: none; background: none; border-radius: 6px; color: #444; font-size: 0.78rem; font-weight: 700; cursor: pointer; transition: 0.15s; }
    .lang-btn.active { background: #1d1d1d; color: #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.5); }

    /* ── Chips ── */
    .chips-box { display: flex; flex-wrap: wrap; gap: 0.4rem; align-items: center; padding: 0.625rem 0.75rem; background: #0d0d0d; border: 1px solid #1a1a1a; border-radius: 8px; min-height: 48px; transition: border-color 0.2s; }
    .chips-box:focus-within { border-color: rgba(192,132,252,0.4); }
    .chip { display: inline-flex; align-items: center; gap: 0.3rem; padding: 0.2rem 0.5rem 0.2rem 0.65rem; background: rgba(192,132,252,0.1); border: 1px solid rgba(192,132,252,0.2); border-radius: 20px; font-size: 0.72rem; color: #c084fc; font-weight: 700; }
    .chip-del { background: none; border: none; color: inherit; cursor: pointer; font-size: 1rem; line-height: 1; opacity: 0.5; padding: 0; display: flex; align-items: center; }
    .chip-del:hover { opacity: 1; }
    .chips-text { background: none; border: none; outline: none; color: #e2e8f0; font-size: 0.85rem; flex: 1; min-width: 180px; padding: 0.1rem 0; }
    .chips-text::placeholder { color: #2a2a2a; }

    /* ── Toggles ── */
    .pf-toggles { display: flex; flex-direction: column; border: 1px solid #111; border-radius: 10px; overflow: hidden; }
    .pf-toggle-item { display: flex; align-items: center; gap: 1rem; padding: 0.875rem 1.125rem; cursor: pointer; background: #0a0a0a; border-bottom: 1px solid #111; transition: background 0.15s; }
    .pf-toggle-item:last-child { border-bottom: none; }
    .pf-toggle-item:hover { background: #0e0e0e; }
    .pf-toggle-track { position: relative; width: 38px; height: 20px; border-radius: 10px; background: #1a1a1a; transition: background 0.2s; flex-shrink: 0; cursor: pointer; border: 1px solid #222; }
    .pf-toggle-track.on { background: var(--primary); border-color: var(--primary); }
    .pf-toggle-track input { position: absolute; opacity: 0; width: 0; height: 0; }
    .pf-toggle-thumb { position: absolute; top: 2px; left: 2px; width: 14px; height: 14px; border-radius: 50%; background: #3a3a3a; transition: transform 0.2s, background 0.2s; }
    .pf-toggle-track.on .pf-toggle-thumb { transform: translateX(18px); background: #000; }
    .pf-toggle-text { display: flex; flex-direction: column; gap: 0.1rem; }
    .pf-toggle-label { font-size: 0.82rem; font-weight: 700; color: #ccc; }
    .pf-toggle-desc { font-size: 0.67rem; color: #3a3a3a; }

    /* ── Footer ── */
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
export class AdminExperienceComponent implements OnInit {
  experience = signal<Experience[]>([]);
  total = signal(0);
  totalPages = signal(0);
  activeTab = signal<ExpTab>('company');
  contentLang = signal<ContentLang>('fr');
  query: QueryOptions = { page: 1, limit: 12, search: '', sortBy: 'startDate', sortOrder: 'desc' };
  showModal = signal(false);
  editingId = signal<number | null>(null);
  formExp: Experience = this.resetForm();
  skillInput = '';
  confirmVisible = signal(false);
  pendingDeleteId = signal<number | null>(null);
  api = inject(ExperienceApiService);
  toast = inject(ToastService);

  private readonly tabs: ExpTab[] = ['company', 'content', 'settings'];

  ngOnInit() { this.load(); }
  load() { this.api.getAll(this.query).subscribe(res => { this.experience.set(res.items); this.total.set(res.meta.total); this.totalPages.set(res.meta.totalPages); }); }
  onPageChange(page: number) { this.query.page = page; this.load(); }
  onSearch() { this.query.page = 1; this.load(); }
  toggleSort() { this.query.sortOrder = this.query.sortOrder === 'asc' ? 'desc' : 'asc'; this.load(); }

  prevTab(): ExpTab | null { const i = this.tabs.indexOf(this.activeTab()); return i > 0 ? this.tabs[i - 1] : null; }
  nextTab(): ExpTab | null { const i = this.tabs.indexOf(this.activeTab()); return i < this.tabs.length - 1 ? this.tabs[i + 1] : null; }
  goTab(tab: ExpTab) { this.activeTab.set(tab); }

  openModal(exp?: Experience) {
    this.activeTab.set('company');
    this.contentLang.set('fr');
    this.skillInput = '';
    if (exp) {
      this.formExp = { ...exp, skills: [...(exp.skills || [])] };
      if (exp.startDate) this.formExp.startDate = new Date(exp.startDate).toISOString().split('T')[0];
      if (exp.endDate) this.formExp.endDate = new Date(exp.endDate).toISOString().split('T')[0];
      this.editingId.set(exp.id!);
    } else {
      this.formExp = this.resetForm();
      this.editingId.set(null);
    }
    this.showModal.set(true);
  }
  closeModal() { this.showModal.set(false); }
  resetForm(): Experience { return { company: '', position: '', positionEn: '', startDate: '', current: false, description: '', descriptionEn: '', skills: [], logoUrl: '', linkedinUrl: '', order: 0 }; }

  addSkill(event: Event) {
    event.preventDefault();
    const val = this.skillInput.trim();
    if (val && !this.formExp.skills?.includes(val)) {
      this.formExp.skills = [...(this.formExp.skills || []), val];
    }
    this.skillInput = '';
  }

  removeSkill(i: number) {
    this.formExp.skills = this.formExp.skills?.filter((_, idx) => idx !== i);
  }

  save() {
    const obs = this.editingId() ? this.api.update(this.editingId()!, this.formExp) : this.api.create(this.formExp);
    obs.subscribe(() => {
      this.toast.success(this.editingId() ? 'Expérience mise à jour' : 'Nouvelle expérience ajoutée');
      this.load();
      this.closeModal();
    });
  }

  deleteExp(id: number) {
    this.pendingDeleteId.set(id);
    this.confirmVisible.set(true);
  }

  onDeleteConfirmed() {
    const id = this.pendingDeleteId();
    if (!id) return;
    this.confirmVisible.set(false);
    this.pendingDeleteId.set(null);
    this.api.delete(id).subscribe(() => {
      this.toast.warning('Expérience supprimée');
      this.load();
    });
  }
}
