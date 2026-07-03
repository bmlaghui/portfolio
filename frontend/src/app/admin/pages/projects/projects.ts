import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectsApiService } from '../../services/admin-api.services';
import { Project, QueryOptions } from '../../interfaces/admin.interfaces';
import { PaginationComponent } from '../../components/pagination/pagination';
import { EmptyDataComponent } from '../../components/empty-data/empty-data';
import { FileUploaderComponent } from '../../components/file-uploader/file-uploader';
import { RichEditorComponent } from '../../components/rich-editor/rich-editor';
import { ConfirmModalComponent } from '../../components/confirm-modal/confirm-modal';
import { ToastService } from '../../../core/services/toast.service';

type FormTab = 'content' | 'media' | 'settings';
type ContentLang = 'fr' | 'en';

@Component({
  selector: 'app-admin-projects',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationComponent, EmptyDataComponent, FileUploaderComponent, RichEditorComponent, ConfirmModalComponent],
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
                <th>GALERIE</th>
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
                    <div class="p-info"><span class="p-title">{{ p.title }}</span><span class="p-path">/projects/{{ p.slug || p.id }}</span></div>
                  </div>
                </td>
                <td><div class="tech-row"><span *ngFor="let t of p.tags" class="tech-pill">{{ t }}</span></div></td>
                <td><div class="gallery-count">📷 {{ p.gallery?.length || 0 }}</div></td>
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

      <!-- ── CONFIRM DELETE MODAL ── -->
      <app-confirm-modal
        [visible]="confirmVisible()"
        title="Supprimer le projet"
        message="Cette action est irréversible. Le projet sera définitivement supprimé."
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
              <span class="pf-tag">PROJ.EXE</span>
              <h2 class="pf-title">{{ editingId() ? 'Modifier le projet' : 'Nouveau projet' }}</h2>
            </div>
            <button class="pf-close" (click)="closeModal()">✕</button>
          </header>

          <!-- Tabs -->
          <nav class="pf-tabs">
            <button type="button" class="pf-tab" [class.active]="activeTab() === 'content'" (click)="activeTab.set('content')">
              <span class="pf-tab-num">01</span>
              <span class="pf-tab-label">Contenu</span>
              <span class="pf-tab-dot" [class.ok]="!!(formProject.title && formProject.description)"></span>
            </button>
            <button type="button" class="pf-tab" [class.active]="activeTab() === 'media'" (click)="activeTab.set('media')">
              <span class="pf-tab-num">02</span>
              <span class="pf-tab-label">Médias</span>
              <span class="pf-tab-dot" [class.ok]="!!formProject.imageUrl"></span>
            </button>
            <button type="button" class="pf-tab" [class.active]="activeTab() === 'settings'" (click)="activeTab.set('settings')">
              <span class="pf-tab-num">03</span>
              <span class="pf-tab-label">Paramètres</span>
              <span class="pf-tab-dot" [class.ok]="!!(formProject.github || formProject.link || formProject.tags.length)"></span>
            </button>
          </nav>

          <form (ngSubmit)="save()" class="pf-form" #projForm="ngForm">
            <div class="pf-body">

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
                    <label class="pf-label">Titre <span class="req">*</span></label>
                    <input type="text" [(ngModel)]="formProject.title" name="title" required class="pf-input" placeholder="Ex : Dashboard SaaS Analytics">
                  </div>
                  <div class="pf-group">
                    <label class="pf-label">Description</label>
                    <app-rich-editor [value]="formProject.description" placeholder="Décrivez ce projet…" (valueChange)="formProject.description = $event"></app-rich-editor>
                  </div>
                </ng-container>

                <ng-container *ngIf="contentLang() === 'en'">
                  <div class="pf-group">
                    <label class="pf-label">Title (EN)</label>
                    <input type="text" [(ngModel)]="formProject.titleEn" name="titleEn" class="pf-input" placeholder="Ex : SaaS Analytics Dashboard">
                  </div>
                  <div class="pf-group">
                    <label class="pf-label">Description (EN)</label>
                    <app-rich-editor [value]="formProject.descriptionEn ?? ''" placeholder="Describe this project…" (valueChange)="formProject.descriptionEn = $event"></app-rich-editor>
                  </div>
                </ng-container>
              </div>

              <!-- ── TAB MÉDIAS ── -->
              <div class="pf-pane" *ngIf="activeTab() === 'media'">

                <!-- Counter + upload trigger -->
                <div class="media-header">
                  <div class="media-counter">
                    <span class="media-count-val">{{ formProject.gallery?.length || 0 }}</span>
                    <span class="media-count-max">&nbsp;/ 10 photos</span>
                  </div>
                  <div class="media-uploader" [class.media-full]="(formProject.gallery?.length || 0) >= 10">
                    <app-file-uploader
                      *ngIf="(formProject.gallery?.length || 0) < 10"
                      [currentUrl]="undefined"
                      (uploaded)="addGalleryImage($event)"
                      (removed)="noop()">
                    </app-file-uploader>
                    <div class="media-limit-msg" *ngIf="(formProject.gallery?.length || 0) >= 10">
                      Limite de 10 photos atteinte
                    </div>
                  </div>
                </div>

                <!-- Slot grid: thumbnail (large) + up to 9 gallery -->
                <div class="media-grid">

                  <!-- Thumbnail slot (always first, larger) -->
                  <div class="media-slot media-slot--thumb" [class.has-img]="!!formProject.imageUrl">
                    <ng-container *ngIf="formProject.imageUrl; else thumbEmpty">
                      <img [src]="formProject.imageUrl" alt="Thumbnail" class="media-slot-img">
                      <div class="media-slot-overlay">
                        <span class="media-slot-badge">THUMBNAIL</span>
                        <button type="button" class="media-slot-del" (click)="clearThumbnail()" title="Retirer">✕</button>
                      </div>
                    </ng-container>
                    <ng-template #thumbEmpty>
                      <div class="media-slot-empty">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                        <span>Thumbnail</span>
                      </div>
                    </ng-template>
                  </div>

                  <!-- Gallery slots (indices 0..8 = up to 9 extra photos) -->
                  <ng-container *ngFor="let slot of gallerySlots; let si = index">
                    <div class="media-slot" [class.has-img]="!!slot">
                      <ng-container *ngIf="slot; else slotEmpty">
                        <img [src]="slot" [alt]="'Photo ' + (si + 1)" class="media-slot-img">
                        <div class="media-slot-overlay">
                          <button type="button" class="media-slot-action" [class.starred]="formProject.imageUrl === slot"
                            (click)="setAsThumbnail(slot)" title="Définir comme thumbnail">
                            {{ formProject.imageUrl === slot ? '⭐' : '☆' }}
                          </button>
                          <button type="button" class="media-slot-del" (click)="removeGalleryImage(si)" title="Supprimer">✕</button>
                        </div>
                        <div class="media-slot-badge media-slot-badge--thumb" *ngIf="formProject.imageUrl === slot">THUMB</div>
                      </ng-container>
                      <ng-template #slotEmpty>
                        <div class="media-slot-empty media-slot-empty--disabled">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.2"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                        </div>
                      </ng-template>
                    </div>
                  </ng-container>

                </div>

                <p class="pf-hint">⭐ = définir comme thumbnail principal affiché dans les listes.</p>
              </div>

              <!-- ── TAB PARAMÈTRES ── -->
              <div class="pf-pane" *ngIf="activeTab() === 'settings'">
                <div class="pf-grid">
                  <div class="pf-group">
                    <label class="pf-label">Slug URL</label>
                    <input [(ngModel)]="formProject.slug" name="slug" class="pf-input" placeholder="auto-généré si vide">
                  </div>
                  <div class="pf-group">
                    <label class="pf-label">Ordre d'affichage</label>
                    <input type="number" [(ngModel)]="formProject.order" name="order" class="pf-input">
                  </div>
                  <div class="pf-group">
                    <label class="pf-label">Lien GitHub</label>
                    <input type="url" [(ngModel)]="formProject.github" name="github" class="pf-input" placeholder="https://github.com/…">
                  </div>
                  <div class="pf-group">
                    <label class="pf-label">Démo / Live</label>
                    <input type="url" [(ngModel)]="formProject.link" name="link" class="pf-input" placeholder="https://…">
                  </div>
                  <div class="pf-group pf-group--color">
                    <label class="pf-label">Couleur Accent</label>
                    <div class="color-row">
                      <input type="color" [(ngModel)]="formProject.accent" name="accent" class="pf-color-pick">
                      <span class="color-hex">{{ formProject.accent }}</span>
                      <div class="color-swatch" [style.background]="formProject.accent"></div>
                    </div>
                  </div>
                </div>

                <!-- Tags chips -->
                <div class="pf-group">
                  <label class="pf-label">Stack technique</label>
                  <div class="chips-box">
                    <span class="chip" *ngFor="let tag of formProject.tags; let i = index">
                      {{ tag }}<button type="button" class="chip-del" (click)="removeTag(i)">×</button>
                    </span>
                    <input
                      type="text"
                      [(ngModel)]="tagInput"
                      name="tagInput"
                      class="chips-text"
                      placeholder="Ajouter un tag, puis Entrée ↵"
                      (keydown.enter)="addTag($event)">
                  </div>
                  <p class="pf-hint">Appuyez sur Entrée pour valider chaque technologie.</p>
                </div>

                <!-- Toggles -->
                <div class="pf-toggles">
                  <label class="pf-toggle-item">
                    <div class="pf-toggle-track" [class.on]="formProject.featured">
                      <input type="checkbox" [(ngModel)]="formProject.featured" name="featured">
                      <div class="pf-toggle-thumb"></div>
                    </div>
                    <div class="pf-toggle-text">
                      <span class="pf-toggle-label">Mis en avant</span>
                      <span class="pf-toggle-desc">Affiché en priorité sur la page d'accueil</span>
                    </div>
                  </label>
                  <label class="pf-toggle-item">
                    <div class="pf-toggle-track" [class.on]="formProject.published">
                      <input type="checkbox" [(ngModel)]="formProject.published" name="published">
                      <div class="pf-toggle-thumb"></div>
                    </div>
                    <div class="pf-toggle-text">
                      <span class="pf-toggle-label">Publié</span>
                      <span class="pf-toggle-desc">Visible par les visiteurs du portfolio</span>
                    </div>
                  </label>
                </div>
              </div>

            </div>

            <!-- Footer -->
            <footer class="pf-footer">
              <button type="button" class="pf-btn-cancel" (click)="closeModal()">Annuler</button>
              <div class="pf-footer-nav">
                <button type="button" class="pf-btn-prev" *ngIf="prevTab()" (click)="goTab(prevTab()!)">← Précédent</button>
                <button type="button" class="pf-btn-next" *ngIf="nextTab()" (click)="goTab(nextTab()!)">Suivant →</button>
                <button type="submit" class="pf-btn-save" *ngIf="!nextTab()" [disabled]="!formProject.title">Enregistrer</button>
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
    /* ── Table ── */
    .cyber-list-table { width: 100%; border-collapse: collapse; }
    .cyber-list-table th { background: rgba(255,255,255,0.01); padding: 1.5rem; text-align: left; font-size: 0.65rem; font-weight: 950; color: #444; letter-spacing: 2px; }
    .cyber-list-table td { padding: 1.5rem; border-top: 1px solid rgba(255,255,255,0.02); }
    .project-cell { display: flex; align-items: center; gap: 1.5rem; }
    .p-img-box { width: 80px; height: 50px; border-radius: 8px; overflow: hidden; position: relative; border: 1px solid #111; }
    .p-img-box img { width: 100%; height: 100%; object-fit: cover; }
    .p-title { display: block; font-size: 1.1rem; font-weight: 950; color: #fff; }
    .p-path { font-size: 0.65rem; color: #333; font-family: monospace; }
    .tech-pill { font-size: 0.6rem; padding: 0.2rem 0.5rem; background: #111; border-radius: 4px; color: #475569; margin-right: 0.4rem; border: 1px solid #222; }
    .gallery-count { font-size: 0.75rem; color: #667; }
    .status-box { font-size: 0.65rem; font-weight: 950; color: #334155; display: flex; align-items: center; gap: 0.5rem; }
    .status-box.online { color: #4ade80; }
    .pulse-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
    .action-btn-neo { width: 38px; height: 38px; background: #000; border: 1px solid #111; border-radius: 6px; cursor: pointer; transition: 0.3s; }
    .action-btn-neo:hover { border-color: var(--primary); transform: translateY(-3px); }
    .actions-group { display: flex; gap: 0.5rem; }

    /* ── Modal overlay ── */
    .modal-root { position: fixed; inset: 0; background: rgba(0,0,0,0.8); backdrop-filter: blur(6px); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 1rem; }

    /* ── Modal frame ── */
    .pf-modal { background: #0a0a0a; border: 1px solid #1a1a1a; border-radius: 16px; width: 100%; max-width: 920px; max-height: 92vh; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 40px 80px rgba(0,0,0,0.8); }

    /* ── Header ── */
    .pf-header { display: flex; align-items: center; justify-content: space-between; padding: 1.25rem 1.75rem; border-bottom: 1px solid #111; flex-shrink: 0; }
    .pf-header-left { display: flex; align-items: center; gap: 0.875rem; }
    .pf-tag { font-size: 0.6rem; font-weight: 950; letter-spacing: 2px; color: var(--primary); background: rgba(192,132,252,0.08); border: 1px solid rgba(192,132,252,0.2); padding: 0.2rem 0.55rem; border-radius: 4px; }
    .pf-title { font-size: 1rem; font-weight: 800; color: #e2e8f0; margin: 0; }
    .pf-close { background: none; border: none; font-size: 1rem; color: #444; cursor: pointer; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: 6px; transition: 0.2s; flex-shrink: 0; }
    .pf-close:hover { background: #111; color: #fff; }

    /* ── Tabs ── */
    .pf-tabs { display: flex; padding: 0 1.75rem; gap: 0; border-bottom: 1px solid #111; flex-shrink: 0; }
    .pf-tab { display: flex; align-items: center; gap: 0.5rem; padding: 0.875rem 1.25rem; background: none; border: none; border-bottom: 2px solid transparent; color: #444; font-size: 0.75rem; font-weight: 700; cursor: pointer; transition: 0.2s; margin-bottom: -1px; letter-spacing: 0.5px; text-transform: uppercase; }
    .pf-tab:hover { color: #777; }
    .pf-tab.active { color: #e2e8f0; border-bottom-color: var(--primary); }
    .pf-tab-num { font-size: 0.58rem; font-weight: 950; opacity: 0.4; font-family: monospace; }
    .pf-tab-label { }
    .pf-tab-dot { width: 5px; height: 5px; border-radius: 50%; background: #222; transition: background 0.3s; flex-shrink: 0; }
    .pf-tab-dot.ok { background: #4ade80; box-shadow: 0 0 6px #4ade80; }

    /* ── Form shell ── */
    .pf-form { display: flex; flex-direction: column; flex: 1; overflow: hidden; min-height: 0; }
    .pf-body { flex: 1; overflow-y: auto; padding: 1.75rem; display: flex; flex-direction: column; gap: 0; }
    .pf-body::-webkit-scrollbar { width: 3px; }
    .pf-body::-webkit-scrollbar-thumb { background: #1f1f1f; border-radius: 10px; }

    /* ── Pane ── */
    .pf-pane { display: flex; flex-direction: column; gap: 1.25rem; }

    /* ── Lang bar ── */
    .lang-bar { display: inline-flex; gap: 0.25rem; padding: 0.2rem; background: #111; border-radius: 8px; border: 1px solid #1a1a1a; }
    .lang-btn { display: flex; align-items: center; gap: 0.35rem; padding: 0.4rem 0.875rem; border: none; background: none; border-radius: 6px; color: #444; font-size: 0.78rem; font-weight: 700; cursor: pointer; transition: 0.15s; }
    .lang-btn.active { background: #1d1d1d; color: #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.5); }

    /* ── Form groups ── */
    .pf-group { display: flex; flex-direction: column; gap: 0.4rem; }
    .pf-label { font-size: 0.68rem; font-weight: 800; color: #4a5568; letter-spacing: 1px; text-transform: uppercase; }
    .req { color: var(--primary); }
    .pf-input { background: #0d0d0d; border: 1px solid #1a1a1a; border-radius: 8px; padding: 0.7rem 0.875rem; color: #e2e8f0; font-size: 0.9rem; width: 100%; transition: border-color 0.2s; box-sizing: border-box; }
    .pf-input:focus { outline: none; border-color: rgba(192,132,252,0.4); }
    .pf-hint { font-size: 0.68rem; color: #333; margin: 0; }

    /* ── 2-col grid ── */
    .pf-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }

    /* ── Color picker ── */
    .color-row { display: flex; align-items: center; gap: 0.75rem; }
    .pf-color-pick { width: 42px; height: 42px; border: 1px solid #1a1a1a; border-radius: 8px; cursor: pointer; padding: 0.15rem; background: #0d0d0d; flex-shrink: 0; }
    .color-hex { font-family: monospace; font-size: 0.8rem; color: #555; }
    .color-swatch { width: 20px; height: 20px; border-radius: 50%; border: 1px solid #2a2a2a; flex-shrink: 0; }

    /* ── Upload zone ── */
    /* ── Media tab ── */
    .media-header { display: flex; align-items: center; justify-content: space-between; gap: 1rem; margin-bottom: 1rem; }
    .media-counter { display: flex; align-items: baseline; }
    .media-count-val { font-size: 1.5rem; font-weight: 900; color: var(--primary); }
    .media-count-max { font-size: 0.72rem; color: #444; font-weight: 700; }
    .media-uploader { flex: 1; max-width: 340px; }
    .media-limit-msg { font-size: 0.75rem; color: #555; padding: 0.6rem 1rem; border: 1px dashed #1d1d1d; border-radius: 8px; text-align: center; }

    /* ── Slot grid: 1 big thumb + 9 small ── */
    .media-grid {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr;
      grid-template-rows: auto auto auto;
      gap: 0.625rem;
    }
    /* Thumbnail slot spans 2 rows */
    .media-slot--thumb { grid-row: span 2; }

    .media-slot {
      position: relative;
      border-radius: 10px;
      overflow: hidden;
      border: 1.5px solid #181818;
      aspect-ratio: 16/10;
      background: #0a0a0a;
      transition: border-color 0.2s;
    }
    .media-slot--thumb { aspect-ratio: auto; min-height: 200px; }
    .media-slot.has-img { border-color: #222; }
    .media-slot.has-img:hover { border-color: rgba(192,132,252,0.4); }

    .media-slot-img { width: 100%; height: 100%; object-fit: cover; display: block; }

    .media-slot-empty {
      width: 100%; height: 100%;
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      gap: 0.4rem;
      color: #282828;
      font-size: 0.62rem;
      font-weight: 700;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      min-height: 70px;
    }
    .media-slot-empty--disabled { pointer-events: none; }

    .media-slot-overlay {
      position: absolute; inset: 0;
      background: rgba(0,0,0,0.6);
      display: flex; align-items: center; justify-content: center;
      gap: 0.5rem;
      opacity: 0; transition: opacity 0.2s;
    }
    .media-slot:hover .media-slot-overlay { opacity: 1; }

    .media-slot-action {
      background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.15);
      color: #fff; width: 30px; height: 30px; border-radius: 50%;
      cursor: pointer; font-size: 0.9rem;
      display: flex; align-items: center; justify-content: center; transition: 0.2s;
    }
    .media-slot-action.starred { background: var(--primary); border-color: var(--primary); color: #000; }

    .media-slot-del {
      background: rgba(239,68,68,0.15); border: 1px solid rgba(239,68,68,0.3);
      color: #f87171; width: 30px; height: 30px; border-radius: 50%;
      cursor: pointer; font-size: 0.75rem;
      display: flex; align-items: center; justify-content: center; transition: 0.2s;
    }
    .media-slot-del:hover { background: #ef4444; border-color: #ef4444; color: #fff; }

    .media-slot-badge {
      position: absolute; bottom: 0; left: 0; right: 0;
      background: var(--primary); color: #000;
      font-size: 0.5rem; font-weight: 950; text-align: center;
      padding: 2px 0; letter-spacing: 1.5px;
    }
    .media-slot-badge--thumb { }

    /* ── Tag chips ── */
    .chips-box { display: flex; flex-wrap: wrap; gap: 0.4rem; align-items: center; padding: 0.625rem 0.75rem; background: #0d0d0d; border: 1px solid #1a1a1a; border-radius: 8px; min-height: 48px; cursor: text; transition: border-color 0.2s; }
    .chips-box:focus-within { border-color: rgba(192,132,252,0.4); }
    .chip { display: inline-flex; align-items: center; gap: 0.3rem; padding: 0.2rem 0.5rem 0.2rem 0.65rem; background: rgba(192,132,252,0.1); border: 1px solid rgba(192,132,252,0.2); border-radius: 20px; font-size: 0.72rem; color: #c084fc; font-weight: 700; }
    .chip-del { background: none; border: none; color: inherit; cursor: pointer; font-size: 1rem; line-height: 1; opacity: 0.5; padding: 0; display: flex; align-items: center; }
    .chip-del:hover { opacity: 1; }
    .chips-text { background: none; border: none; outline: none; color: #e2e8f0; font-size: 0.85rem; flex: 1; min-width: 130px; padding: 0.1rem 0; }
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
    .pf-btn-save { background: var(--primary); border: none; color: #000; padding: 0.55rem 1.5rem; border-radius: 8px; cursor: pointer; font-size: 0.82rem; font-weight: 900; transition: filter 0.2s; letter-spacing: 0.3px; }
    .pf-btn-save:hover:not(:disabled) { filter: brightness(1.12); }
    .pf-btn-save:disabled { opacity: 0.3; cursor: not-allowed; }
  `]
})
export class AdminProjectsComponent implements OnInit {
  projects = signal<Project[]>([]);
  total = signal(0);
  totalPages = signal(0);
  activeTab = signal<FormTab>('content');
  contentLang = signal<ContentLang>('fr');
  query: QueryOptions = { page: 1, limit: 12, search: '', sortBy: 'order', sortOrder: 'asc' };
  showModal = signal(false);
  editingId = signal<number | null>(null);
  formProject: Project = this.resetForm();
  tagInput = '';
  confirmVisible = signal(false);
  pendingDeleteId = signal<number | null>(null);
  api = inject(ProjectsApiService);
  toast = inject(ToastService);

  private readonly tabs: FormTab[] = ['content', 'media', 'settings'];

  ngOnInit() { this.load(); }
  load() { this.api.getAll(this.query).subscribe(res => { this.projects.set(res.items); this.total.set(res.meta.total); this.totalPages.set(res.meta.totalPages); }); }
  onPageChange(page: number) { this.query.page = page; this.load(); }
  onSearch() { this.query.page = 1; this.load(); }
  toggleSort() { this.query.sortOrder = this.query.sortOrder === 'asc' ? 'desc' : 'asc'; this.load(); }

  prevTab(): FormTab | null { const i = this.tabs.indexOf(this.activeTab()); return i > 0 ? this.tabs[i - 1] : null; }
  nextTab(): FormTab | null { const i = this.tabs.indexOf(this.activeTab()); return i < this.tabs.length - 1 ? this.tabs[i + 1] : null; }
  goTab(tab: FormTab) { this.activeTab.set(tab); }

  openModal(p?: Project) {
    this.activeTab.set('content');
    this.contentLang.set('fr');
    this.tagInput = '';
    if (p) {
      this.formProject = { ...p, tags: [...(p.tags || [])], gallery: [...(p.gallery || [])] };
      this.editingId.set(p.id!);
    } else {
      this.formProject = this.resetForm();
      this.editingId.set(null);
    }
    this.showModal.set(true);
  }
  closeModal() { this.showModal.set(false); }
  resetForm(): Project { return { title: '', description: '', titleEn: '', descriptionEn: '', tags: [], published: true, order: 0, github: '', link: '', imageUrl: '', gallery: [], accent: '#c084fc' }; }

  addTag(event: Event) {
    event.preventDefault();
    const val = this.tagInput.trim();
    if (val && !this.formProject.tags?.includes(val)) {
      this.formProject.tags = [...(this.formProject.tags || []), val];
    }
    this.tagInput = '';
  }

  removeTag(i: number) {
    this.formProject.tags = this.formProject.tags?.filter((_, idx) => idx !== i);
  }

  /** 9 gallery slots (indices 0-8), padded with nulls for empty slots */
  get gallerySlots(): (string | null)[] {
    const gallery = this.formProject.gallery ?? [];
    const slots: (string | null)[] = [...gallery];
    while (slots.length < 9) slots.push(null);
    return slots.slice(0, 9);
  }

  noop() {}

  addGalleryImage(url: string) {
    if (!url) return;
    const current = this.formProject.gallery ?? [];
    if (current.length >= 10) return;
    this.formProject = { ...this.formProject, gallery: [...current, url] };
    if (!this.formProject.imageUrl) this.formProject.imageUrl = url;
  }

  removeGalleryImage(i: number) {
    const removed = this.formProject.gallery![i];
    const newGallery = this.formProject.gallery!.filter((_, idx) => idx !== i);
    this.formProject = { ...this.formProject, gallery: newGallery, imageUrl: this.formProject.imageUrl === removed ? (newGallery[0] || '') : this.formProject.imageUrl };
  }

  setAsThumbnail(url: string) { this.formProject = { ...this.formProject, imageUrl: url }; }
  clearThumbnail() { this.formProject = { ...this.formProject, imageUrl: '' }; }

  save() {
    if (!this.formProject.slug) {
      this.formProject.slug = this.formProject.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    }
    const obs = this.editingId() ? this.api.update(this.editingId()!, this.formProject) : this.api.create(this.formProject);
    obs.subscribe(() => {
      this.toast.success(this.editingId() ? 'Projet mis à jour' : 'Nouveau projet créé');
      this.load();
      this.closeModal();
    });
  }

  deleteProject(id: number) {
    this.pendingDeleteId.set(id);
    this.confirmVisible.set(true);
  }

  onDeleteConfirmed() {
    const id = this.pendingDeleteId();
    if (!id) return;
    this.confirmVisible.set(false);
    this.pendingDeleteId.set(null);
    this.api.delete(id).subscribe(() => {
      this.toast.warning('Projet supprimé');
      this.load();
    });
  }
}
