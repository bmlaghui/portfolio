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

type BlogTab = 'content' | 'translation' | 'cover' | 'publish';

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
          <article class="blog-item glass-card" *ngFor="let p of posts(); let i = index" [style.animation-delay]="i * 0.08 + 's'">
            <div class="post-cover">
              <img *ngIf="p.imageUrl" [src]="p.imageUrl" [alt]="p.title">
              <div class="generated-cover" *ngIf="!p.imageUrl">
                <span>&lt;/&gt;</span>
                <strong>{{ p.tags[0] || 'JOURNAL' }}</strong>
              </div>
              <span class="category-pill">{{ p.tags[0] || 'ENGINEERING' }}</span>
              <span class="status-overlay" [class.live]="p.published">
                <i></i>{{ p.published ? 'LIVE' : 'BROUILLON' }}
              </span>
            </div>
            <div class="post-body">
              <div class="meta-row">
                <span>{{ p.createdAt | date:'dd MMM yyyy' }}</span>
                <span>{{ p.readTime || 5 }} MIN DE LECTURE</span>
              </div>
              <h3 class="post-title">{{ p.title }}</h3>
              <p class="post-summary">{{ p.summary }}</p>
              <div class="post-tags" *ngIf="p.tags.length > 1">
                <span *ngFor="let tag of p.tags.slice(1, 4)">#{{ tag }}</span>
              </div>
              <div class="actions-footer">
                <span class="post-path">/blog/{{ p.slug || 'article' }}</span>
                <div class="card-actions">
                  <button type="button" class="action-mini edit" (click)="openModal(p)">ÉDITER</button>
                  <button type="button" class="action-mini del" (click)="deletePost(p.id!)" aria-label="Effacer l’article">✕</button>
                </div>
              </div>
            </div>
          </article>
        </div>
        <ng-template #emptyState>
          <app-empty-data icon="📭" title="Archives Vides" (action)="openModal()"></app-empty-data>
        </ng-template>
        <div class="pagination-container" *ngIf="posts().length > 0">
           <app-pagination [page]="query.page!" [totalPages]="totalPages()" [total]="total()" (pageChange)="onPageChange($event)"></app-pagination>
        </div>
      </div>

      <div class="modal-root" *ngIf="showModal()" (click)="closeModal()">
        <div class="article-modal" (click)="$event.stopPropagation()">
          <header class="article-header">
            <div class="article-heading">
              <span class="article-mark">BLOG.STUDIO</span>
              <div>
                <h2>{{ editingId() ? 'Modifier l’article' : 'Créer un article' }}</h2>
                <p>{{ editingId() ? 'Affinez votre publication' : 'Transformez une idée en récit mémorable' }}</p>
              </div>
            </div>
            <div class="header-status">
              <span class="draft-status" [class.is-live]="formPost.published">
                <span class="status-pulse"></span>{{ formPost.published ? 'En ligne' : 'Brouillon' }}
              </span>
              <button type="button" class="article-close" (click)="closeModal()" aria-label="Fermer">✕</button>
            </div>
          </header>

          <nav class="article-steps" aria-label="Étapes de création">
            <button type="button" class="article-step" [class.active]="activeTab() === 'content'" (click)="goTab('content')">
              <span class="step-index">01</span>
              <span class="step-copy"><b>Contenu</b><small>Version française</small></span>
              <span class="step-check" [class.done]="contentComplete()">✓</span>
            </button>
            <button type="button" class="article-step" [class.active]="activeTab() === 'translation'" (click)="goTab('translation')">
              <span class="step-index">02</span>
              <span class="step-copy"><b>Traduction</b><small>Version anglaise</small></span>
              <span class="step-check" [class.done]="translationComplete()">✓</span>
            </button>
            <button type="button" class="article-step" [class.active]="activeTab() === 'cover'" (click)="goTab('cover')">
              <span class="step-index">03</span>
              <span class="step-copy"><b>Couverture</b><small>Identité visuelle</small></span>
              <span class="step-check" [class.done]="!!formPost.imageUrl">✓</span>
            </button>
            <button type="button" class="article-step" [class.active]="activeTab() === 'publish'" (click)="goTab('publish')">
              <span class="step-index">04</span>
              <span class="step-copy"><b>Publication</b><small>SEO & visibilité</small></span>
              <span class="step-check" [class.done]="publicationComplete()">✓</span>
            </button>
          </nav>

          <form (ngSubmit)="save()" class="article-form" #blogForm="ngForm">
            <div class="article-body">

              <section class="article-pane" *ngIf="activeTab() === 'content'">
                <div class="pane-intro">
                  <span class="pane-kicker">ÉTAPE 01 · FRANÇAIS</span>
                  <h3>Racontez l’essentiel.</h3>
                  <p>Un titre net, une promesse claire, puis un contenu rythmé par blocs.</p>
                </div>

                <div class="field-group">
                  <div class="field-head">
                    <label for="post-title">Titre de l’article <span>*</span></label>
                    <small [class.limit]="formPost.title.length > 70">{{ formPost.title.length }}/80</small>
                  </div>
                  <input id="post-title" type="text" maxlength="80" [(ngModel)]="formPost.title" name="title" required
                    class="studio-input studio-input--hero" placeholder="Ex. Concevoir une API qui tient la charge">
                </div>

                <div class="field-group">
                  <div class="field-head">
                    <label for="post-summary">Résumé <span>*</span></label>
                    <small [class.limit]="formPost.summary.length > 180">{{ formPost.summary.length }}/200</small>
                  </div>
                  <textarea id="post-summary" maxlength="200" rows="3" [(ngModel)]="formPost.summary" name="summary" required
                    class="studio-input studio-textarea" placeholder="La promesse de lecture en deux phrases maximum…"></textarea>
                  <p class="field-hint">Ce texte apparaît sur la carte de l’article et dans les résultats de recherche.</p>
                </div>

                <div class="editor-section">
                  <div class="editor-heading">
                    <div><span>Corps de l’article</span><small>{{ blocksFR.length }} bloc{{ blocksFR.length > 1 ? 's' : '' }}</small></div>
                    <span class="editor-tip">Texte · Code · Image · Vidéo · Citation</span>
                  </div>
                  <app-block-editor [value]="blocksFR" (valueChange)="blocksFF($event)"></app-block-editor>
                </div>
              </section>

              <section class="article-pane" *ngIf="activeTab() === 'translation'">
                <div class="pane-intro pane-intro--split">
                  <div>
                    <span class="pane-kicker">ÉTAPE 02 · ENGLISH</span>
                    <h3>Open the story to a wider audience.</h3>
                    <p>La traduction reste optionnelle. Elle améliore néanmoins la portée du portfolio.</p>
                  </div>
                  <span class="optional-pill">OPTIONNEL</span>
                </div>

                <div class="translation-source" *ngIf="formPost.title">
                  <span>SOURCE FR</span>
                  <p>{{ formPost.title }}</p>
                </div>

                <div class="field-group">
                  <div class="field-head">
                    <label for="post-title-en">English title</label>
                    <small>{{ formPost.titleEn?.length || 0 }}/80</small>
                  </div>
                  <input id="post-title-en" type="text" maxlength="80" [(ngModel)]="formPost.titleEn" name="titleEn"
                    class="studio-input studio-input--hero" placeholder="Ex. Designing an API that scales">
                </div>

                <div class="field-group">
                  <div class="field-head">
                    <label for="post-summary-en">English summary</label>
                    <small>{{ formPost.summaryEn?.length || 0 }}/200</small>
                  </div>
                  <textarea id="post-summary-en" maxlength="200" rows="3" [(ngModel)]="formPost.summaryEn" name="summaryEn"
                    class="studio-input studio-textarea" placeholder="Summarize the promise of the article…"></textarea>
                </div>

                <div class="editor-section">
                  <div class="editor-heading">
                    <div><span>English content</span><small>{{ blocksEN.length }} block{{ blocksEN.length === 1 ? '' : 's' }}</small></div>
                    <span class="editor-tip">Independent from the French version</span>
                  </div>
                  <app-block-editor [value]="blocksEN" (valueChange)="blocksEE($event)"></app-block-editor>
                </div>
              </section>

              <section class="article-pane" *ngIf="activeTab() === 'cover'">
                <div class="pane-intro">
                  <span class="pane-kicker">ÉTAPE 03 · DIRECTION ARTISTIQUE</span>
                  <h3>Donnez envie avant le premier mot.</h3>
                  <p>Choisissez une image lisible, contrastée et cohérente avec le sujet.</p>
                </div>

                <div class="cover-layout">
                  <div class="cover-upload">
                    <span class="section-label">IMAGE DE COUVERTURE</span>
                    <app-file-uploader
                      [currentUrl]="formPost.imageUrl"
                      (uploaded)="formPost.imageUrl = $event"
                      (removed)="formPost.imageUrl = ''">
                    </app-file-uploader>
                    <div class="cover-specs">
                      <span>Format conseillé <b>1600 × 900 px</b></span>
                      <span>Poids idéal <b>&lt; 800 Ko</b></span>
                      <span>Ratio <b>16:9</b></span>
                    </div>
                  </div>

                  <div class="cover-preview">
                    <span class="section-label">APERÇU DANS LE BLOG</span>
                    <article class="preview-card">
                      <div class="preview-image" [class.empty]="!formPost.imageUrl">
                        <img *ngIf="formPost.imageUrl" [src]="formPost.imageUrl" alt="Aperçu de la couverture">
                        <div class="preview-placeholder" *ngIf="!formPost.imageUrl">
                          <span>◇</span><small>Votre couverture apparaîtra ici</small>
                        </div>
                        <span class="preview-read">{{ formPost.readTime || 5 }} MIN</span>
                      </div>
                      <div class="preview-content">
                        <div class="preview-tags"><span *ngFor="let tag of formPost.tags.slice(0, 3)">#{{ tag }}</span><span *ngIf="!formPost.tags.length">#article</span></div>
                        <h4>{{ formPost.title || 'Le titre de votre prochain article' }}</h4>
                        <p>{{ formPost.summary || 'Votre résumé donnera ici un avant-goût de la lecture.' }}</p>
                      </div>
                    </article>
                  </div>
                </div>
              </section>

              <section class="article-pane" *ngIf="activeTab() === 'publish'">
                <div class="pane-intro">
                  <span class="pane-kicker">ÉTAPE 04 · DIFFUSION</span>
                  <h3>Préparez le lancement.</h3>
                  <p>Finalisez l’adresse, la taxonomie et la visibilité de l’article.</p>
                </div>

                <div class="publish-layout">
                  <div class="publish-main">
                    <div class="field-grid">
                      <div class="field-group">
                        <label for="post-slug">Slug URL</label>
                        <div class="slug-field">
                          <span>/blog/</span>
                          <input id="post-slug" [(ngModel)]="formPost.slug" name="slug" placeholder="généré-automatiquement">
                        </div>
                      </div>
                      <div class="field-group">
                        <label for="post-read-time">Temps de lecture</label>
                        <div class="number-field">
                          <input id="post-read-time" type="number" min="1" max="99" [(ngModel)]="formPost.readTime" name="readTime">
                          <span>minutes</span>
                        </div>
                      </div>
                    </div>

                    <div class="field-group">
                      <label>Thématiques</label>
                      <div class="chips-box">
                        <span class="tag-chip" *ngFor="let tag of formPost.tags; let i = index">
                          #{{ tag }}<button type="button" (click)="removeTag(i)" [attr.aria-label]="'Supprimer ' + tag">×</button>
                        </span>
                        <input type="text" [(ngModel)]="tagInput" name="tagInput" placeholder="Ajouter un tag puis Entrée"
                          (keydown.enter)="addTag($event)">
                      </div>
                      <p class="field-hint">Trois à cinq tags précis facilitent la découverte de l’article.</p>
                    </div>

                    <div class="visibility-list">
                      <label class="visibility-item">
                        <span class="toggle-track" [class.on]="formPost.featured">
                          <input type="checkbox" [(ngModel)]="formPost.featured" name="featured"><span></span>
                        </span>
                        <span class="visibility-copy"><b>Mettre à la une</b><small>Présente cet article en priorité sur le portfolio.</small></span>
                        <span class="visibility-icon">✦</span>
                      </label>
                      <label class="visibility-item">
                        <span class="toggle-track" [class.on]="formPost.published">
                          <input type="checkbox" [(ngModel)]="formPost.published" name="published"><span></span>
                        </span>
                        <span class="visibility-copy"><b>Publier maintenant</b><small>L’article devient immédiatement visible par les visiteurs.</small></span>
                        <span class="visibility-icon">↗</span>
                      </label>
                    </div>
                  </div>

                  <aside class="readiness-card">
                    <div class="readiness-head">
                      <span>PRÊT À PUBLIER ?</span>
                      <b>{{ readinessScore() }}%</b>
                    </div>
                    <div class="readiness-bar"><span [style.width.%]="readinessScore()"></span></div>
                    <ul>
                      <li [class.done]="!!formPost.title"><span>{{ formPost.title ? '✓' : '○' }}</span> Titre renseigné</li>
                      <li [class.done]="!!formPost.summary"><span>{{ formPost.summary ? '✓' : '○' }}</span> Résumé renseigné</li>
                      <li [class.done]="blocksFR.length > 0"><span>{{ blocksFR.length ? '✓' : '○' }}</span> Contenu ajouté</li>
                      <li [class.done]="!!formPost.imageUrl"><span>{{ formPost.imageUrl ? '✓' : '○' }}</span> Couverture ajoutée</li>
                      <li [class.done]="formPost.tags.length > 0"><span>{{ formPost.tags.length ? '✓' : '○' }}</span> Tags définis</li>
                    </ul>
                    <p *ngIf="readinessScore() < 100">Vous pouvez enregistrer un brouillon à tout moment.</p>
                    <p class="ready-message" *ngIf="readinessScore() === 100">Tout est prêt. Beau travail.</p>
                  </aside>
                </div>
              </section>
            </div>

            <footer class="article-footer">
              <button type="button" class="btn-cancel" (click)="closeModal()">Annuler</button>
              <span class="footer-progress">Étape {{ currentStep() }} sur 4</span>
              <div class="footer-actions">
                <button type="button" class="btn-prev" *ngIf="prevTab()" (click)="goTab(prevTab()!)">← Précédent</button>
                <button type="button" class="btn-next" *ngIf="nextTab()" (click)="goTab(nextTab()!)">Continuer <span>→</span></button>
                <button type="submit" class="btn-save" *ngIf="!nextTab()" [disabled]="!formPost.title || !formPost.summary">
                  <span>{{ formPost.published ? 'Publier l’article' : 'Enregistrer le brouillon' }}</span>
                  <b>{{ formPost.published ? '↗' : '✓' }}</b>
                </button>
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
    .blog-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 1.6rem; }
    .blog-item { min-width: 0; overflow: hidden; display: flex; flex-direction: column; padding: 0; border-radius: 18px; transition: transform .3s, border-color .3s, box-shadow .3s; }
    .blog-item:hover { transform: translateY(-6px); border-color: rgba(192,132,252,.28); box-shadow: 0 24px 55px rgba(0,0,0,.42), 0 0 0 1px rgba(192,132,252,.05); }
    .post-cover { position: relative; height: 220px; overflow: hidden; background: rgba(255,255,255,.02); border-bottom: 1px solid rgba(255,255,255,.06); }
    .post-cover::after { content: ''; position: absolute; inset: auto 0 0; height: 45%; pointer-events: none; background: linear-gradient(transparent, rgba(0,0,0,.42)); }
    .post-cover img { width: 100%; height: 100%; object-fit: cover; opacity: .82; transition: transform .55s, opacity .55s; }
    .blog-item:hover .post-cover img { transform: scale(1.045); opacity: 1; }
    .generated-cover { width: 100%; height: 100%; display: grid; place-content: center; gap: .35rem; text-align: center; background: radial-gradient(circle at 50% 30%, rgba(192,132,252,.24), transparent 38%), linear-gradient(145deg, #161627, #08080e); }
    .generated-cover span { color: var(--primary); font: 800 3.4rem var(--font-title); }
    .generated-cover strong { color: #596273; font-size: .58rem; letter-spacing: 4px; }
    .category-pill { position: absolute; z-index: 2; top: 1rem; left: 1rem; max-width: 50%; overflow: hidden; padding: .36rem .8rem; color: #fff; background: var(--primary); border-radius: 50px; box-shadow: 0 4px 15px rgba(0,0,0,.4); font-size: .54rem; font-weight: 900; letter-spacing: .9px; text-overflow: ellipsis; white-space: nowrap; }
    .status-overlay { position: absolute; z-index: 2; top: 1rem; right: 1rem; display: flex; align-items: center; gap: .38rem; padding: .36rem .65rem; color: #7c8593; background: rgba(5,5,5,.75); border: 1px solid rgba(255,255,255,.1); border-radius: 50px; backdrop-filter: blur(8px); font-size: .52rem; font-weight: 900; letter-spacing: .6px; }
    .status-overlay i { width: 5px; height: 5px; background: currentColor; border-radius: 50%; }
    .status-overlay.live { color: #4ade80; border-color: rgba(74,222,128,.22); }
    .status-overlay.live i { box-shadow: 0 0 7px #4ade80; }
    .post-body { padding: 1.5rem 1.6rem 1.35rem; flex: 1; display: flex; flex-direction: column; }
    .meta-row { display: flex; justify-content: space-between; gap: 1rem; margin-bottom: .9rem; color: #4b5360; font-size: .57rem; font-weight: 800; letter-spacing: .65px; }
    .post-title { margin: 0 0 .7rem; color: #f1f5f9; font-size: 1.3rem; font-weight: 850; line-height: 1.25; letter-spacing: -.35px; }
    .post-summary { display: -webkit-box; overflow: hidden; margin: 0 0 1rem; color: #596170; font-size: .78rem; line-height: 1.65; -webkit-box-orient: vertical; -webkit-line-clamp: 3; }
    .post-tags { display: flex; flex-wrap: wrap; gap: .45rem; margin-bottom: 1rem; }
    .post-tags span { color: #78618e; font-size: .58rem; font-weight: 750; }
    .actions-footer { display: flex; align-items: center; justify-content: space-between; gap: .8rem; margin-top: auto; padding-top: 1rem; border-top: 1px solid rgba(255,255,255,.06); }
    .post-path { min-width: 0; overflow: hidden; color: #343a44; font: .58rem monospace; text-overflow: ellipsis; white-space: nowrap; }
    .card-actions { flex-shrink: 0; display: flex; gap: .45rem; }
    .action-mini { min-height: 34px; padding: .5rem .8rem; border-radius: 7px; font-size: .62rem; font-weight: 900; letter-spacing: .6px; cursor: pointer; transition: .2s; }
    .action-mini.edit { color: #d8b4fe; background: rgba(192,132,252,.1); border: 1px solid rgba(192,132,252,.25); }
    .action-mini.edit:hover { color: #080808; background: var(--primary); border-color: var(--primary); transform: translateY(-1px); }
    .action-mini.del { width: 34px; padding: 0; color: #f87171; background: rgba(239,68,68,.07); border: 1px solid rgba(239,68,68,.2); }
    .action-mini.del:hover { color: #fff; background: #dc2626; border-color: #dc2626; transform: translateY(-1px); }

    /* Article studio */
    .modal-root { position: fixed; inset: 0; z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 1rem; background: rgba(0,0,0,.82); backdrop-filter: blur(10px); }
    .article-modal { width: min(1120px, 100%); max-height: 94vh; display: flex; flex-direction: column; overflow: hidden; color: #e5e7eb; background: radial-gradient(circle at 90% 0, rgba(192,132,252,.07), transparent 28%), #080808; border: 1px solid #1c1c1c; border-radius: 20px; box-shadow: 0 40px 100px rgba(0,0,0,.85), 0 0 0 1px rgba(255,255,255,.02); }
    .article-header { min-height: 78px; display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: 1rem 1.6rem; border-bottom: 1px solid #151515; }
    .article-heading, .header-status { display: flex; align-items: center; gap: 1rem; }
    .article-mark { padding: .3rem .55rem; color: var(--primary); background: rgba(192,132,252,.08); border: 1px solid rgba(192,132,252,.2); border-radius: 5px; font: 900 .57rem monospace; letter-spacing: 1.5px; }
    .article-heading h2 { margin: 0; color: #f8fafc; font-size: 1.05rem; font-weight: 850; }
    .article-heading p { margin: .18rem 0 0; color: #404754; font-size: .7rem; }
    .draft-status { display: flex; align-items: center; gap: .45rem; padding: .38rem .7rem; color: #697180; border: 1px solid #1c1c1c; border-radius: 30px; font-size: .65rem; font-weight: 800; }
    .draft-status.is-live { color: #4ade80; border-color: rgba(74,222,128,.2); background: rgba(74,222,128,.04); }
    .status-pulse { width: 6px; height: 6px; border-radius: 50%; background: currentColor; box-shadow: 0 0 8px currentColor; }
    .article-close { width: 34px; height: 34px; display: grid; place-items: center; color: #4b5563; background: transparent; border: 1px solid transparent; border-radius: 8px; cursor: pointer; transition: .2s; }
    .article-close:hover { color: #fff; background: #121212; border-color: #222; }

    .article-steps { display: grid; grid-template-columns: repeat(4, 1fr); padding: 0 1.6rem; border-bottom: 1px solid #151515; }
    .article-step { position: relative; display: flex; align-items: center; gap: .65rem; min-width: 0; padding: .9rem .8rem; color: #3f4652; background: transparent; border: 0; border-bottom: 2px solid transparent; cursor: pointer; text-align: left; transition: .2s; }
    .article-step::after { content: ''; position: absolute; right: 0; width: 1px; height: 25px; background: #141414; }
    .article-step:last-child::after { display: none; }
    .article-step:hover { color: #7c8594; }
    .article-step.active { color: #e5e7eb; border-bottom-color: var(--primary); background: linear-gradient(to top, rgba(192,132,252,.05), transparent); }
    .step-index { color: inherit; opacity: .55; font: 800 .57rem monospace; }
    .step-copy { min-width: 0; display: flex; flex-direction: column; gap: .12rem; }
    .step-copy b { font-size: .72rem; letter-spacing: .3px; }
    .step-copy small { overflow: hidden; color: #303641; font-size: .59rem; font-weight: 600; text-overflow: ellipsis; white-space: nowrap; }
    .article-step.active .step-copy small { color: #525a68; }
    .step-check { margin-left: auto; width: 17px; height: 17px; display: grid; place-items: center; color: #262626; border: 1px solid #242424; border-radius: 50%; font-size: .55rem; }
    .step-check.done { color: #07120b; background: #4ade80; border-color: #4ade80; font-weight: 950; }

    .article-form { min-height: 0; flex: 1; display: flex; flex-direction: column; overflow: hidden; }
    .article-body { min-height: 0; flex: 1; overflow-y: auto; padding: 2rem 2.2rem 2.5rem; scrollbar-width: thin; scrollbar-color: #252525 transparent; }
    .article-pane { display: flex; flex-direction: column; gap: 1.5rem; animation: pane-in .28s ease both; }
    @keyframes pane-in { from { opacity: 0; transform: translateY(7px); } to { opacity: 1; transform: none; } }
    .pane-intro { padding-bottom: .3rem; }
    .pane-intro--split { display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; }
    .pane-kicker, .section-label { display: block; margin-bottom: .55rem; color: var(--primary); font: 900 .58rem monospace; letter-spacing: 1.7px; }
    .pane-intro h3 { margin: 0 0 .35rem; color: #f8fafc; font-size: clamp(1.35rem, 2.5vw, 1.9rem); letter-spacing: -.04em; }
    .pane-intro p { max-width: 650px; margin: 0; color: #515967; font-size: .78rem; line-height: 1.6; }
    .optional-pill { padding: .3rem .65rem; color: #545d6a; border: 1px solid #1c1c1c; border-radius: 20px; font: 800 .55rem monospace; letter-spacing: 1px; }

    .field-group { display: flex; flex-direction: column; gap: .45rem; min-width: 0; }
    .field-group > label, .field-head label { color: #7d8592; font-size: .67rem; font-weight: 800; letter-spacing: .7px; text-transform: uppercase; }
    .field-group label span, .field-head label span { color: var(--primary); }
    .field-head { display: flex; align-items: center; justify-content: space-between; }
    .field-head small { color: #343a44; font: .62rem monospace; }
    .field-head small.limit { color: #fb923c; }
    .studio-input { width: 100%; box-sizing: border-box; padding: .82rem 1rem; color: #dce3ed; background: #0b0b0b; border: 1px solid #1c1c1c; border-radius: 9px; outline: none; font-size: .88rem; transition: .2s; }
    .studio-input--hero { padding: .95rem 1rem; font-size: 1.05rem; font-weight: 750; }
    .studio-textarea { resize: vertical; min-height: 88px; font-family: inherit; line-height: 1.55; }
    .studio-input:focus { border-color: rgba(192,132,252,.5); box-shadow: 0 0 0 3px rgba(192,132,252,.06); background: #0e0d10; }
    .studio-input::placeholder { color: #292d34; }
    .field-hint { margin: 0; color: #343a43; font-size: .65rem; line-height: 1.5; }
    .field-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 1rem; }
    .translation-source { padding: .8rem 1rem; background: rgba(192,132,252,.035); border: 1px solid rgba(192,132,252,.12); border-left: 2px solid var(--primary); border-radius: 0 8px 8px 0; }
    .translation-source span { color: #555d69; font: 900 .52rem monospace; letter-spacing: 1.3px; }
    .translation-source p { margin: .25rem 0 0; color: #89919e; font-size: .78rem; }
    .editor-section { display: flex; flex-direction: column; gap: .8rem; padding-top: .25rem; }
    .editor-heading { display: flex; justify-content: space-between; align-items: flex-end; gap: 1rem; }
    .editor-heading > div { display: flex; align-items: baseline; gap: .65rem; }
    .editor-heading span { color: #7d8592; font-size: .68rem; font-weight: 800; text-transform: uppercase; letter-spacing: .7px; }
    .editor-heading small { color: #353b45; font-size: .62rem; }
    .editor-heading .editor-tip { color: #303640; font-size: .58rem; font-weight: 600; text-transform: none; }

    .cover-layout { display: grid; grid-template-columns: minmax(0, 1fr) minmax(320px, .9fr); gap: 2rem; align-items: start; }
    .cover-upload, .cover-preview { min-width: 0; }
    .cover-specs { display: flex; flex-wrap: wrap; gap: .45rem; margin-top: .75rem; }
    .cover-specs span { padding: .35rem .55rem; color: #3e4651; background: #0b0b0b; border: 1px solid #171717; border-radius: 5px; font-size: .57rem; }
    .cover-specs b { color: #67707d; }
    .preview-card { overflow: hidden; background: #0b0b0b; border: 1px solid #1b1b1b; border-radius: 13px; box-shadow: 0 20px 50px rgba(0,0,0,.35); }
    .preview-image { position: relative; aspect-ratio: 16/9; overflow: hidden; background: #0e0e0e; }
    .preview-image img { width: 100%; height: 100%; object-fit: cover; }
    .preview-image.empty { background: radial-gradient(circle at 50% 50%, rgba(192,132,252,.08), transparent 55%), #0c0c0c; }
    .preview-placeholder { height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: .5rem; color: #292d35; }
    .preview-placeholder span { color: #3d3448; font-size: 2rem; }
    .preview-placeholder small { font-size: .65rem; }
    .preview-read { position: absolute; right: .7rem; top: .7rem; padding: .28rem .48rem; color: #fff; background: rgba(0,0,0,.72); backdrop-filter: blur(6px); border-radius: 4px; font: 800 .52rem monospace; }
    .preview-content { padding: 1rem 1.1rem 1.2rem; }
    .preview-tags { display: flex; gap: .45rem; min-height: 14px; color: var(--primary); font-size: .56rem; font-weight: 800; }
    .preview-content h4 { margin: .55rem 0 .35rem; color: #e5e7eb; font-size: 1rem; line-height: 1.3; }
    .preview-content p { display: -webkit-box; overflow: hidden; margin: 0; color: #4b5360; font-size: .67rem; line-height: 1.5; -webkit-box-orient: vertical; -webkit-line-clamp: 2; }

    .publish-layout { display: grid; grid-template-columns: minmax(0, 1fr) 270px; gap: 2rem; align-items: start; }
    .publish-main { display: flex; flex-direction: column; gap: 1.4rem; }
    .slug-field, .number-field { height: 46px; display: flex; align-items: center; overflow: hidden; background: #0b0b0b; border: 1px solid #1c1c1c; border-radius: 9px; transition: .2s; }
    .slug-field:focus-within, .number-field:focus-within { border-color: rgba(192,132,252,.5); }
    .slug-field span { padding-left: .85rem; color: #3d444f; font: .72rem monospace; }
    .slug-field input, .number-field input { min-width: 0; flex: 1; padding: .75rem .25rem; color: #abb3bf; background: transparent; border: 0; outline: 0; font: .76rem monospace; }
    .number-field input { padding-left: .85rem; }
    .number-field span { padding-right: .85rem; color: #414852; font-size: .65rem; }
    .chips-box { min-height: 48px; display: flex; flex-wrap: wrap; align-items: center; gap: .4rem; padding: .55rem .65rem; background: #0b0b0b; border: 1px solid #1c1c1c; border-radius: 9px; }
    .chips-box:focus-within { border-color: rgba(192,132,252,.5); }
    .chips-box > input { min-width: 150px; flex: 1; padding: .2rem; color: #dbe2ec; background: transparent; border: 0; outline: 0; font-size: .78rem; }
    .chips-box > input::placeholder { color: #2d323a; }
    .tag-chip { display: inline-flex; align-items: center; gap: .35rem; padding: .25rem .35rem .25rem .55rem; color: #c084fc; background: rgba(192,132,252,.09); border: 1px solid rgba(192,132,252,.18); border-radius: 20px; font-size: .67rem; font-weight: 750; }
    .tag-chip button { color: inherit; background: transparent; border: 0; cursor: pointer; opacity: .55; font-size: .9rem; line-height: 1; }
    .visibility-list { overflow: hidden; border: 1px solid #191919; border-radius: 11px; }
    .visibility-item { display: flex; align-items: center; gap: .9rem; padding: .9rem 1rem; background: #0a0a0a; border-bottom: 1px solid #171717; cursor: pointer; transition: .2s; }
    .visibility-item:last-child { border-bottom: 0; }
    .visibility-item:hover { background: #0d0d0d; }
    .toggle-track { position: relative; width: 38px; height: 21px; flex: 0 0 auto; background: #191919; border: 1px solid #252525; border-radius: 20px; transition: .2s; }
    .toggle-track input { position: absolute; opacity: 0; pointer-events: none; }
    .toggle-track > span { position: absolute; left: 3px; top: 3px; width: 13px; height: 13px; background: #454545; border-radius: 50%; transition: .2s; }
    .toggle-track.on { background: var(--primary); border-color: var(--primary); }
    .toggle-track.on > span { background: #080808; transform: translateX(17px); }
    .visibility-copy { min-width: 0; flex: 1; display: flex; flex-direction: column; gap: .15rem; }
    .visibility-copy b { color: #b7bec8; font-size: .77rem; }
    .visibility-copy small { color: #3e4550; font-size: .61rem; }
    .visibility-icon { color: #303640; font-size: 1rem; }
    .readiness-card { padding: 1rem; background: linear-gradient(145deg, rgba(192,132,252,.055), transparent 55%), #0a0a0a; border: 1px solid #1b1b1b; border-radius: 12px; }
    .readiness-head { display: flex; align-items: center; justify-content: space-between; color: #5b6370; font: 850 .58rem monospace; letter-spacing: 1px; }
    .readiness-head b { color: var(--primary); font-size: .9rem; }
    .readiness-bar { height: 3px; margin: .7rem 0 1rem; overflow: hidden; background: #191919; border-radius: 3px; }
    .readiness-bar span { display: block; height: 100%; background: linear-gradient(90deg, #8b5cf6, #c084fc); transition: width .3s; box-shadow: 0 0 10px rgba(192,132,252,.5); }
    .readiness-card ul { display: flex; flex-direction: column; gap: .65rem; margin: 0; padding: 0; list-style: none; }
    .readiness-card li { display: flex; align-items: center; gap: .55rem; color: #424954; font-size: .65rem; }
    .readiness-card li span { width: 15px; color: #343a43; font-size: .72rem; }
    .readiness-card li.done { color: #7c8591; }
    .readiness-card li.done span { color: #4ade80; }
    .readiness-card p { margin: 1rem 0 0; padding-top: .8rem; color: #363d47; border-top: 1px solid #171717; font-size: .6rem; line-height: 1.5; }
    .readiness-card p.ready-message { color: #4ade80; }

    .article-footer { min-height: 68px; display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: .8rem 1.6rem; background: #070707; border-top: 1px solid #151515; }
    .footer-actions { display: flex; align-items: center; gap: .55rem; }
    .footer-progress { color: #303640; font: .6rem monospace; }
    .btn-cancel, .btn-prev, .btn-next, .btn-save { border-radius: 8px; cursor: pointer; font-size: .72rem; font-weight: 800; transition: .2s; }
    .btn-cancel { padding: .55rem .9rem; color: #454c56; background: transparent; border: 1px solid #1a1a1a; }
    .btn-prev { padding: .58rem .9rem; color: #68717e; background: #0d0d0d; border: 1px solid #202020; }
    .btn-next { padding: .6rem 1.1rem; color: #d7dde6; background: #141414; border: 1px solid #282828; }
    .btn-next span { margin-left: .4rem; color: var(--primary); }
    .btn-save { display: flex; align-items: center; gap: .7rem; padding: .6rem .65rem .6rem 1.1rem; color: #070707; background: var(--primary); border: 0; }
    .btn-save b { width: 24px; height: 24px; display: grid; place-items: center; background: rgba(0,0,0,.13); border-radius: 6px; }
    .btn-cancel:hover, .btn-prev:hover { color: #b4bbc5; border-color: #303030; }
    .btn-next:hover { color: #fff; border-color: rgba(192,132,252,.45); }
    .btn-save:hover:not(:disabled) { filter: brightness(1.1); transform: translateY(-1px); }
    .btn-save:disabled { opacity: .3; cursor: not-allowed; }

    @media (max-width: 760px) {
      .blog-grid { grid-template-columns: 1fr; }
      .post-cover { height: 200px; }
      .modal-root { padding: 0; }
      .article-modal { height: 100dvh; max-height: none; border: 0; border-radius: 0; }
      .article-header { min-height: 66px; padding: .8rem 1rem; }
      .article-heading p, .draft-status, .step-copy small, .step-check { display: none; }
      .article-mark { font-size: .5rem; }
      .article-heading { gap: .65rem; }
      .article-heading h2 { font-size: .9rem; }
      .article-steps { padding: 0 .5rem; overflow-x: auto; }
      .article-step { min-width: 105px; justify-content: center; padding: .75rem .45rem; }
      .article-step::after { display: none; }
      .article-body { padding: 1.4rem 1rem 2rem; }
      .cover-layout, .publish-layout, .field-grid { grid-template-columns: 1fr; gap: 1.4rem; }
      .cover-preview { order: -1; }
      .preview-card { max-width: 460px; }
      .editor-heading .editor-tip { display: none; }
      .article-footer { min-height: 62px; padding: .65rem .8rem; }
      .footer-progress { display: none; }
      .footer-actions { margin-left: auto; }
      .btn-cancel { padding-inline: .7rem; }
      .btn-save span { max-width: 140px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    }

    @media (max-width: 430px) {
      .post-body { padding: 1.25rem; }
      .post-path { display: none; }
      .card-actions { width: 100%; }
      .action-mini.edit { flex: 1; }
      .article-heading div { display: none; }
      .article-step { min-width: 84px; gap: .35rem; }
      .step-copy b { font-size: .65rem; }
      .pane-intro h3 { font-size: 1.35rem; }
      .pane-intro--split { display: block; }
      .optional-pill { display: inline-block; margin-top: .7rem; }
      .btn-prev { font-size: 0; padding: .55rem .65rem; }
      .btn-prev::after { content: '←'; font-size: .8rem; }
    }
  `]
})
export class AdminBlogComponent implements OnInit {
  posts = signal<BlogPost[]>([]);
  total = signal(0);
  totalPages = signal(0);
  activeTab = signal<BlogTab>('content');
  query: QueryOptions = { page: 1, limit: 12, search: '', sortBy: 'createdAt', sortOrder: 'desc' };
  showModal = signal(false);
  editingId = signal<number | null>(null);
  formPost: BlogPost = this.resetForm();
  blocksFR: ContentBlock[] = [];
  blocksEN: ContentBlock[] = [];
  tagInput = '';
  api = inject(BlogApiService);
  toast = inject(ToastService);

  private readonly tabs: BlogTab[] = ['content', 'translation', 'cover', 'publish'];

  ngOnInit() { this.load(); }
  load() { this.api.getAll(this.query).subscribe(res => { this.posts.set(res.items); this.total.set(res.meta.total); this.totalPages.set(res.meta.totalPages); }); }
  onPageChange(page: number) { this.query.page = page; this.load(); }
  onSearch() { this.query.page = 1; this.load(); }
  toggleSort() { this.query.sortOrder = this.query.sortOrder === 'asc' ? 'desc' : 'asc'; this.load(); }

  prevTab(): BlogTab | null {
    const index = this.tabs.indexOf(this.activeTab());
    return index > 0 ? this.tabs[index - 1] : null;
  }

  nextTab(): BlogTab | null {
    const index = this.tabs.indexOf(this.activeTab());
    return index < this.tabs.length - 1 ? this.tabs[index + 1] : null;
  }

  goTab(tab: BlogTab) { this.activeTab.set(tab); }
  currentStep() { return this.tabs.indexOf(this.activeTab()) + 1; }
  contentComplete() { return !!(this.formPost.title && this.formPost.summary && this.blocksFR.length); }
  translationComplete() { return !!(this.formPost.titleEn && this.formPost.summaryEn && this.blocksEN.length); }
  publicationComplete() { return !!(this.formPost.readTime && this.formPost.tags?.length); }

  readinessScore() {
    const checks = [
      !!this.formPost.title,
      !!this.formPost.summary,
      this.blocksFR.length > 0,
      !!this.formPost.imageUrl,
      (this.formPost.tags?.length || 0) > 0,
    ];
    return checks.filter(Boolean).length * 20;
  }

  openModal(p?: BlogPost) {
    this.activeTab.set('content');
    this.tagInput = '';
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

  addTag(event: Event) {
    event.preventDefault();
    const tag = this.tagInput.trim().replace(/^#/, '');
    if (tag && !this.formPost.tags?.includes(tag)) {
      this.formPost.tags = [...(this.formPost.tags || []), tag];
    }
    this.tagInput = '';
  }

  removeTag(index: number) {
    this.formPost.tags = this.formPost.tags.filter((_, current) => current !== index);
  }

  blocksFF(blocks: ContentBlock[]) { this.blocksFR = blocks; }
  blocksEE(blocks: ContentBlock[]) {
    this.blocksEN = blocks.map(b => ({ ...b, id: b.id.startsWith('en_') ? b.id : 'en_' + b.id }));
  }

  save() {
    if (!this.formPost.slug) {
      this.formPost.slug = this.formPost.title
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }
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
