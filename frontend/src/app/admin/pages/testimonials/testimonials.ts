import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { EmptyDataComponent } from '../../components/empty-data/empty-data';
import { ToastService } from '../../../core/services/toast.service';

interface Testimonial { id?: number; name: string; role: string; company?: string; quote: string; quoteEn?: string; published: boolean; order: number; }
type TestimonialTab = 'content' | 'settings';

@Component({
  selector: 'app-admin-testimonials',
  standalone: true,
  imports: [CommonModule, FormsModule, EmptyDataComponent],
  template: `
    <div class="admin-page">
      <div class="header-section">
        <div class="titles">
          <div class="cyber-badge">Social Proof</div>
          <h1>Témoignages</h1>
          <p>Valorisez les voix qui racontent le mieux votre collaboration.</p>
        </div>
        <button class="btn-cyber-primary" (click)="edit()"><span>Nouveau témoignage</span><b>＋</b></button>
      </div>

      <div class="testimonial-console">
        <label><span>RECHERCHER</span><div>⌕<input type="search" [(ngModel)]="search" placeholder="Nom, entreprise, citation…"></div></label>
        <div class="console-stat"><b>{{ items().length }}</b><span>TOTAL</span></div>
        <div class="console-stat live"><b>{{ publishedCount() }}</b><span>EN LIGNE</span></div>
      </div>

      <div class="testimonials-grid" *ngIf="filteredItems().length; else emptyState">
        <article class="testimonial-card" *ngFor="let item of filteredItems(); let i = index" [class.draft]="!item.published" [style.animation-delay]="i * 0.05 + 's'">
          <header>
            <span class="publish-state"><i></i>{{ item.published ? 'PUBLIÉ' : 'BROUILLON' }}</span>
            <span class="card-order">#{{ item.order.toString().padStart(2, '0') }}</span>
          </header>
          <div class="quote-mark">“</div>
          <blockquote>{{ item.quote }}</blockquote>
          <div class="author">
            <div class="author-avatar">{{ item.name.charAt(0).toUpperCase() }}</div>
            <div><h3>{{ item.name }}</h3><p>{{ item.role }}<span *ngIf="item.company"> · {{ item.company }}</span></p></div>
          </div>
          <footer>
            <span>{{ item.quoteEn ? 'FR · EN' : 'FR uniquement' }}</span>
            <div><button type="button" class="edit" (click)="edit(item)">ÉDITER</button><button type="button" class="delete" (click)="remove(item.id!)" aria-label="Supprimer">✕</button></div>
          </footer>
        </article>
      </div>
      <ng-template #emptyState><app-empty-data icon="❝" title="Aucune voix pour le moment" text="Ajoutez votre premier témoignage client." (action)="edit()"></app-empty-data></ng-template>

      <div class="modal-root" *ngIf="form()" (click)="closeForm()">
        <div class="testimonial-modal" (click)="$event.stopPropagation()">
          <header class="tm-header">
            <div><span>VOICE.STUDIO</span><h2>{{ form()!.id ? 'Modifier le témoignage' : 'Nouveau témoignage' }}</h2></div>
            <button type="button" (click)="closeForm()" aria-label="Fermer">✕</button>
          </header>
          <nav class="tm-tabs">
            <button type="button" [class.active]="activeTab() === 'content'" (click)="activeTab.set('content')"><i>01</i><span>Identité & citation<small>La voix et son auteur</small></span><b [class.done]="form()!.name && form()!.quote">✓</b></button>
            <button type="button" [class.active]="activeTab() === 'settings'" (click)="activeTab.set('settings')"><i>02</i><span>Publication<small>Ordre et visibilité</small></span><b class="done">✓</b></button>
          </nav>
          <form (ngSubmit)="save()" class="tm-form" #testimonialForm="ngForm">
            <div class="tm-body">
              <section class="tm-pane" *ngIf="activeTab() === 'content'">
                <div class="pane-heading"><span>ÉTAPE 01 · TÉMOIGNAGE</span><h3>Faites entendre une voix authentique.</h3><p>Identifiez clairement l’auteur et préservez le naturel de ses mots.</p></div>
                <div class="author-fields">
                  <div class="author-preview">{{ form()!.name.charAt(0).toUpperCase() || '?' }}</div>
                  <div class="fields">
                    <label><span class="label-text">Nom complet <em>*</em></span><input name="name" [(ngModel)]="form()!.name" required placeholder="Prénom Nom"></label>
                    <div class="field-grid">
                      <label><span class="label-text">Fonction <em>*</em></span><input name="role" [(ngModel)]="form()!.role" required placeholder="CTO, Product Manager…"></label>
                      <label>Entreprise<input name="company" [(ngModel)]="form()!.company" placeholder="Nom de l’entreprise"></label>
                    </div>
                  </div>
                </div>
                <div class="quotes-grid">
                  <label><span class="label-text">Citation française <em>*</em></span><small>{{ form()!.quote.length }}/500</small><textarea maxlength="500" name="quote" [(ngModel)]="form()!.quote" required rows="6" placeholder="Une collaboration marquante parce que…"></textarea></label>
                  <label>English quote <span>OPTIONNEL</span><small>{{ form()!.quoteEn?.length || 0 }}/500</small><textarea maxlength="500" name="quoteEn" [(ngModel)]="form()!.quoteEn" rows="6" placeholder="A remarkable collaboration because…"></textarea></label>
                </div>
              </section>
              <section class="tm-pane" *ngIf="activeTab() === 'settings'">
                <div class="pane-heading"><span>ÉTAPE 02 · DIFFUSION</span><h3>Préparez sa mise en lumière.</h3><p>Visualisez la carte puis choisissez sa position et sa visibilité.</p></div>
                <div class="settings-layout">
                  <div class="mini-preview">
                    <span>APERÇU</span><blockquote>“{{ form()!.quote || 'Le témoignage apparaîtra ici.' }}”</blockquote>
                    <div><b>{{ form()!.name || 'Nom du client' }}</b><small>{{ form()!.role || 'Fonction' }}{{ form()!.company ? ' · ' + form()!.company : '' }}</small></div>
                  </div>
                  <div class="settings-fields">
                    <label>Ordre d’affichage<input type="number" min="0" name="order" [(ngModel)]="form()!.order"><small>Les valeurs basses apparaissent en premier.</small></label>
                    <label class="publish-toggle">
                      <span class="toggle" [class.on]="form()!.published"><input type="checkbox" name="published" [(ngModel)]="form()!.published"><i></i></span>
                      <span><b>Publier ce témoignage</b><small>Il sera visible immédiatement sur le portfolio.</small></span>
                    </label>
                  </div>
                </div>
              </section>
            </div>
            <footer class="tm-footer">
              <button type="button" class="cancel" (click)="closeForm()">Annuler</button>
              <div>
                <button type="button" class="previous" *ngIf="activeTab() === 'settings'" (click)="activeTab.set('content')">← Précédent</button>
                <button type="button" class="next" *ngIf="activeTab() === 'content'" (click)="activeTab.set('settings')">Continuer →</button>
                <button type="submit" class="save" *ngIf="activeTab() === 'settings'" [disabled]="testimonialForm.invalid">Enregistrer</button>
              </div>
            </footer>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .btn-cyber-primary { display:flex; align-items:center; gap:.8rem; padding:.8rem .8rem .8rem 1.2rem; color:#080808; background:#fff; border:0; border-radius:9px; cursor:pointer; font-size:.67rem; font-weight:900; text-transform:uppercase; }
    .btn-cyber-primary b { width:28px; height:28px; display:grid; place-items:center; background:#e8e8e8; border-radius:7px; font-size:1rem; }
    .btn-cyber-primary:hover { background:var(--primary); }
    .testimonial-console { display:grid; grid-template-columns:minmax(250px,1fr) 110px 110px; gap:1px; overflow:hidden; margin-bottom:1.5rem; background:#171717; border:1px solid #171717; border-radius:13px; }
    .testimonial-console > label { padding:.7rem 1rem; background:#0a0a0a; }
    .testimonial-console label > span,.console-stat span { display:block; margin-bottom:.35rem; color:#353c47; font:.51rem monospace; letter-spacing:1.2px; }
    .testimonial-console label > div { display:flex; align-items:center; gap:.6rem; color:var(--primary); }
    .testimonial-console input { width:100%; color:#dce2eb; background:transparent; border:0; outline:0; font-size:.75rem; }
    .console-stat { display:flex; flex-direction:column; align-items:center; justify-content:center; background:#0a0a0a; }
    .console-stat b { color:#dce2eb; font-size:1.05rem; }
    .console-stat.live b { color:#4ade80; }
    .testimonials-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(320px,1fr)); gap:1.25rem; }
    .testimonial-card { position:relative; overflow:hidden; display:flex; flex-direction:column; min-height:340px; padding:1.35rem; background:radial-gradient(circle at 90% 0,rgba(192,132,252,.07),transparent 36%),#0a0a0a; border:1px solid #191919; border-radius:16px; transition:.3s; }
    .testimonial-card:hover { transform:translateY(-5px); border-color:rgba(192,132,252,.25); box-shadow:0 20px 45px rgba(0,0,0,.35); }
    .testimonial-card > header { display:flex; justify-content:space-between; align-items:center; }
    .publish-state { display:flex; align-items:center; gap:.4rem; color:#4ade80; font-size:.52rem; font-weight:900; letter-spacing:.8px; }
    .publish-state i { width:5px; height:5px; background:currentColor; border-radius:50%; box-shadow:0 0 7px currentColor; }
    .testimonial-card.draft .publish-state { color:#fbbf24; }
    .card-order { color:#343b46; font:.58rem monospace; }
    .quote-mark { height:48px; margin-top:1rem; color:var(--primary); font:800 4rem/1 Georgia,serif; opacity:.75; }
    .testimonial-card blockquote { display:-webkit-box; overflow:hidden; flex:1; margin:.3rem 0 1.4rem; color:#8d96a4; font-size:.88rem; font-style:italic; line-height:1.7; -webkit-box-orient:vertical; -webkit-line-clamp:5; }
    .author { display:flex; align-items:center; gap:.75rem; }
    .author-avatar { width:40px; height:40px; display:grid; place-items:center; flex-shrink:0; color:var(--primary); background:rgba(192,132,252,.08); border:1px solid rgba(192,132,252,.17); border-radius:50%; font-size:.8rem; font-weight:900; }
    .author h3 { margin:0; color:#e3e8ef; font-size:.78rem; }
    .author p { margin:.18rem 0 0; color:#48505c; font-size:.59rem; }
    .testimonial-card > footer { display:flex; align-items:center; justify-content:space-between; margin-top:1.1rem; padding-top:.9rem; border-top:1px solid #171717; }
    .testimonial-card footer > span { color:#363d47; font:.53rem monospace; }
    .testimonial-card footer > div { display:flex; gap:.4rem; }
    .testimonial-card footer button { height:31px; padding:0 .7rem; border-radius:7px; cursor:pointer; font-size:.56rem; font-weight:900; }
    .testimonial-card .edit { color:#d8b4fe; background:rgba(192,132,252,.08); border:1px solid rgba(192,132,252,.2); }
    .testimonial-card .edit:hover { color:#080808; background:var(--primary); }
    .testimonial-card .delete { width:31px; padding:0; color:#f87171; background:rgba(239,68,68,.05); border:1px solid rgba(239,68,68,.15); }
    .testimonial-card .delete:hover { color:#fff; background:#dc2626; }

    .modal-root { position:fixed; inset:0; z-index:1000; display:grid; place-items:center; padding:1rem; background:rgba(0,0,0,.82); backdrop-filter:blur(8px); }
    .testimonial-modal { width:min(850px,100%); max-height:93vh; display:flex; flex-direction:column; overflow:hidden; background:radial-gradient(circle at 90% 0,rgba(192,132,252,.07),transparent 30%),#080808; border:1px solid #1d1d1d; border-radius:18px; box-shadow:0 35px 90px rgba(0,0,0,.8); }
    .tm-header { display:flex; align-items:center; justify-content:space-between; padding:1.15rem 1.5rem; border-bottom:1px solid #151515; }
    .tm-header > div { display:flex; align-items:center; gap:.8rem; }
    .tm-header div > span { padding:.25rem .5rem; color:var(--primary); background:rgba(192,132,252,.08); border:1px solid rgba(192,132,252,.18); border-radius:5px; font:900 .54rem monospace; letter-spacing:1.3px; }
    .tm-header h2 { margin:0; color:#e5e7eb; font-size:.95rem; }
    .tm-header > button { width:32px; height:32px; color:#4b5360; background:transparent; border:0; border-radius:7px; cursor:pointer; }
    .tm-tabs { display:grid; grid-template-columns:1fr 1fr; padding:0 1.5rem; border-bottom:1px solid #151515; }
    .tm-tabs button { display:flex; align-items:center; gap:.7rem; padding:.85rem 1rem; color:#414853; background:transparent; border:0; border-bottom:2px solid transparent; text-align:left; cursor:pointer; }
    .tm-tabs button.active { color:#dfe4ec; border-bottom-color:var(--primary); }
    .tm-tabs i { font:normal 800 .54rem monospace; opacity:.6; }
    .tm-tabs button > span { flex:1; display:flex; flex-direction:column; gap:.1rem; font-size:.69rem; font-weight:800; }
    .tm-tabs small { color:#303640; font-size:.55rem; }
    .tm-tabs button > b { width:16px; height:16px; display:grid; place-items:center; color:#252525; border:1px solid #222; border-radius:50%; font-size:.5rem; }
    .tm-tabs button > b.done { color:#071109; background:#4ade80; border-color:#4ade80; }
    .tm-form { min-height:0; display:flex; flex-direction:column; }
    .tm-body { overflow-y:auto; padding:1.8rem; }
    .tm-pane { display:flex; flex-direction:column; gap:1.4rem; animation:tm-in .25s ease; }
    @keyframes tm-in { from { opacity:0; transform:translateY(5px); } }
    .pane-heading > span { color:var(--primary); font:900 .55rem monospace; letter-spacing:1.5px; }
    .pane-heading h3 { margin:.5rem 0 .25rem; color:#f1f5f9; font-size:1.35rem; }
    .pane-heading p { margin:0; color:#4b5360; font-size:.7rem; }
    .author-fields { display:grid; grid-template-columns:100px 1fr; gap:1.2rem; }
    .author-preview { aspect-ratio:1; display:grid; place-items:center; color:var(--primary); background:radial-gradient(circle,rgba(192,132,252,.12),transparent 70%),#0b0b0b; border:1px solid #1c1c1c; border-radius:50%; font-size:2rem; font-weight:900; }
    .fields,.field-grid,.quotes-grid { display:grid; gap:1rem; }
    .field-grid,.quotes-grid { grid-template-columns:1fr 1fr; }
    .fields label,.quotes-grid label,.settings-fields > label:not(.publish-toggle) { position:relative; display:flex; flex-direction:column; gap:.4rem; color:#68717e; font-size:.61rem; font-weight:800; letter-spacing:.6px; text-transform:uppercase; }
    .label-text { display:inline-flex; align-items:baseline; gap:.22rem; }
    label em { color:var(--primary); font-style:normal; }
    .quotes-grid label > span:not(.label-text) { color:#343b46; font-size:.5rem; }
    .quotes-grid label > small { position:absolute; top:0; right:0; color:#343b46; font-size:.52rem; }
    .fields input,.quotes-grid textarea,.settings-fields input { width:100%; box-sizing:border-box; padding:.78rem .9rem; color:#dce2eb; background:#0b0b0b; border:1px solid #1d1d1d; border-radius:8px; outline:0; font:inherit; font-size:.8rem; text-transform:none; }
    .quotes-grid textarea { resize:vertical; line-height:1.6; }
    .fields input:focus,.quotes-grid textarea:focus,.settings-fields input:focus { border-color:rgba(192,132,252,.5); }
    .settings-layout { display:grid; grid-template-columns:1.15fr .85fr; gap:1.4rem; }
    .mini-preview { display:flex; flex-direction:column; min-height:230px; padding:1.2rem; background:linear-gradient(145deg,rgba(192,132,252,.055),transparent),#0b0b0b; border:1px solid #1b1b1b; border-radius:13px; }
    .mini-preview > span { color:var(--primary); font:.53rem monospace; letter-spacing:1.3px; }
    .mini-preview blockquote { flex:1; margin:1.2rem 0; color:#8a93a0; font-size:.86rem; font-style:italic; line-height:1.6; }
    .mini-preview > div { display:flex; flex-direction:column; gap:.2rem; padding-top:.8rem; border-top:1px solid #191919; }
    .mini-preview b { color:#d9dee6; font-size:.7rem; }
    .mini-preview small { color:#444c57; font-size:.58rem; }
    .settings-fields { display:flex; flex-direction:column; gap:1rem; }
    .settings-fields label > small { color:#343b46; font-size:.54rem; text-transform:none; }
    .publish-toggle { display:flex; align-items:center; gap:.8rem; padding:.9rem; background:#0b0b0b; border:1px solid #1b1b1b; border-radius:9px; cursor:pointer; }
    .publish-toggle > span:last-child { display:flex; flex-direction:column; gap:.15rem; }
    .publish-toggle b { color:#abb3bf; font-size:.68rem; }
    .publish-toggle small { color:#3f4651; font-size:.56rem; }
    .toggle { position:relative; width:38px; height:21px; flex-shrink:0; background:#191919; border:1px solid #252525; border-radius:20px; }
    .toggle input { position:absolute; opacity:0; }
    .toggle i { position:absolute; top:3px; left:3px; width:13px; height:13px; background:#454545; border-radius:50%; transition:.2s; }
    .toggle.on { background:var(--primary); border-color:var(--primary); }
    .toggle.on i { background:#080808; transform:translateX(17px); }
    .tm-footer { display:flex; justify-content:space-between; align-items:center; padding:.9rem 1.5rem; background:#070707; border-top:1px solid #151515; }
    .tm-footer > div { display:flex; gap:.5rem; }
    .tm-footer button { padding:.58rem 1rem; border-radius:8px; cursor:pointer; font-size:.67rem; font-weight:800; }
    .tm-footer .cancel { color:#4d5561; background:transparent; border:1px solid #1c1c1c; }
    .tm-footer .previous { color:#707986; background:#0d0d0d; border:1px solid #202020; }
    .tm-footer .next { color:#e2e8f0; background:#151515; border:1px solid #292929; }
    .tm-footer .save { color:#080808; background:var(--primary); border:0; }
    .tm-footer .save:disabled { opacity:.3; cursor:not-allowed; }
    @media(max-width:650px) {
      .testimonial-console { grid-template-columns:1fr 70px 70px; }
      .testimonials-grid { grid-template-columns:1fr; }
      .testimonial-modal { height:100dvh; max-height:none; border:0; border-radius:0; }
      .tm-tabs { padding:0 .5rem; }
      .tm-tabs small,.tm-tabs button > b { display:none; }
      .tm-body { padding:1.3rem 1rem; }
      .author-fields,.field-grid,.quotes-grid,.settings-layout { grid-template-columns:1fr; }
      .author-preview { width:80px; }
    }
  `]
})
export class AdminTestimonialsComponent implements OnInit {
  private http = inject(HttpClient);
  private toast = inject(ToastService);
  items = signal<Testimonial[]>([]);
  form = signal<Testimonial | null>(null);
  activeTab = signal<TestimonialTab>('content');
  search = '';
  ngOnInit() { this.load(); }
  load() { this.http.get<Testimonial[]>('/api/testimonials/admin/all').subscribe(value => this.items.set(value)); }
  publishedCount() { return this.items().filter(item => item.published).length; }
  filteredItems() {
    const query = this.search.trim().toLocaleLowerCase();
    if (!query) return this.items();
    return this.items().filter(item => [item.name, item.role, item.company, item.quote].filter(Boolean).join(' ').toLocaleLowerCase().includes(query));
  }
  edit(item?: Testimonial) {
    this.activeTab.set('content');
    this.form.set(item ? { ...item } : { name: '', role: '', company: '', quote: '', quoteEn: '', published: true, order: this.items().length + 1 });
  }
  closeForm() { this.form.set(null); }
  save() {
    const value = this.form()!;
    const request = value.id ? this.http.patch(`/api/testimonials/${value.id}`, value) : this.http.post('/api/testimonials', value);
    request.subscribe(() => {
      this.toast.success(value.id ? 'Témoignage mis à jour' : 'Nouveau témoignage ajouté');
      this.form.set(null);
      this.load();
    });
  }
  remove(id: number) {
    if (confirm('Supprimer ce témoignage ?')) {
      this.http.delete(`/api/testimonials/${id}`).subscribe(() => {
        this.toast.warning('Témoignage supprimé');
        this.load();
      });
    }
  }
}
