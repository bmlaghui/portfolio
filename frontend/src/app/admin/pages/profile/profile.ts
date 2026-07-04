import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfileApiService } from '../../services/admin-api.services';
import { ToastService } from '../../../core/services/toast.service';
import { Profile } from '../../interfaces/admin.interfaces';
import { FileUploaderComponent } from '../../components/file-uploader/file-uploader';

type ProfileTab = 'identity' | 'bio' | 'links';

@Component({
  selector: 'app-admin-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, FileUploaderComponent],
  template: `
    <div class="admin-page">
      <div class="header-section">
        <div class="titles">
          <div class="cyber-badge">Core Identity</div>
          <h1>Configuration Profil</h1>
          <p>Pilotez votre identité publique, votre récit et vos points de contact.</p>
        </div>
      </div>

      <div class="profile-studio">
        <header class="profile-summary">
          <div class="avatar-preview">
            <img *ngIf="profile().avatarUrl" [src]="profile().avatarUrl" [alt]="profile().name">
            <span *ngIf="!profile().avatarUrl">{{ profile().name.charAt(0) || 'P' }}</span>
            <i [class.available]="profile().available"></i>
          </div>
          <div class="summary-copy">
            <span>APERÇU DU PROFIL</span>
            <h2>{{ profile().name || 'Votre identité' }}</h2>
            <p>{{ profile().title || 'Votre titre professionnel apparaîtra ici' }}</p>
          </div>
          <div class="completion">
            <div><span>COMPLÉTUDE</span><b>{{ completionScore() }}%</b></div>
            <div class="completion-bar"><i [style.width.%]="completionScore()"></i></div>
          </div>
        </header>

        <nav class="profile-tabs">
          <button type="button" [class.active]="activeTab() === 'identity'" (click)="activeTab.set('identity')"><i>01</i><span>Identité<small>Présentation principale</small></span><b [class.done]="profile().name && profile().title">✓</b></button>
          <button type="button" [class.active]="activeTab() === 'bio'" (click)="activeTab.set('bio')"><i>02</i><span>Récit & contact<small>Biographie bilingue</small></span><b [class.done]="profile().email && profile().bio">✓</b></button>
          <button type="button" [class.active]="activeTab() === 'links'" (click)="activeTab.set('links')"><i>03</i><span>Présence en ligne<small>Réseaux et CV</small></span><b [class.done]="socials.github || socials.linkedin">✓</b></button>
        </nav>

        <form (ngSubmit)="save()" class="profile-form" #profForm="ngForm">
          <div class="profile-body">
            <section class="profile-pane" *ngIf="activeTab() === 'identity'">
              <div class="pane-heading"><span>ÉTAPE 01 · IDENTITÉ</span><h3>Votre signature professionnelle.</h3><p>Ces informations structurent le hero et les aperçus de votre portfolio.</p></div>
              <div class="identity-grid">
                <div class="avatar-field">
                  <label>Photo de profil</label>
                  <div class="large-avatar">
                    <img *ngIf="profile().avatarUrl" [src]="profile().avatarUrl" [alt]="profile().name">
                    <span *ngIf="!profile().avatarUrl">{{ profile().name.charAt(0) || 'P' }}</span>
                  </div>
                  <app-file-uploader [currentUrl]="profile().avatarUrl" (uploaded)="profile().avatarUrl = $event" (removed)="profile().avatarUrl = ''"></app-file-uploader>
                </div>
                <div class="fields">
                  <label><span class="label-text">Nom complet <em>*</em></span><input type="text" [(ngModel)]="profile().name" name="name" required placeholder="Prénom Nom"></label>
                  <div class="field-grid">
                    <label><span class="label-text">Titre professionnel (FR) <em>*</em></span><input type="text" [(ngModel)]="profile().title" name="title" required placeholder="Développeur Full Stack"></label>
                    <label>Professional title (EN)<input type="text" [(ngModel)]="profile().titleEn" name="titleEn" placeholder="Full Stack Developer"></label>
                  </div>
                  <label>Localisation<input type="text" [(ngModel)]="profile().location" name="location" placeholder="Paris, France"></label>
                  <label class="availability-row">
                    <span class="toggle" [class.on]="profile().available"><input type="checkbox" [(ngModel)]="profile().available" name="available"><i></i></span>
                    <span><b>Disponible pour de nouvelles opportunités</b><small>Affiche le statut de disponibilité sur le portfolio.</small></span>
                  </label>
                </div>
              </div>
            </section>

            <section class="profile-pane" *ngIf="activeTab() === 'bio'">
              <div class="pane-heading"><span>ÉTAPE 02 · RÉCIT</span><h3>Présentez la personne derrière le code.</h3><p>Un récit concis, humain et adapté à chaque langue.</p></div>
              <div class="field-grid">
                <label><span class="label-text">Email professionnel <em>*</em></span><input type="email" [(ngModel)]="profile().email" name="email" required placeholder="vous@domaine.fr"></label>
                <label>Téléphone<input type="tel" [(ngModel)]="profile().phone" name="phone" placeholder="+33 6…"></label>
              </div>
              <div class="bio-grid">
                <label><span class="label-text">Biographie française <em>*</em></span><small>{{ profile().bio.length || 0 }} caractères</small><textarea [(ngModel)]="profile().bio" name="bio" required rows="8" placeholder="Votre parcours, votre approche, ce qui vous anime…"></textarea></label>
                <label>English biography<small>{{ profile().bioEn?.length || 0 }} characters</small><textarea [(ngModel)]="profile().bioEn" name="bioEn" rows="8" placeholder="Your journey, approach and motivations…"></textarea></label>
              </div>
            </section>

            <section class="profile-pane" *ngIf="activeTab() === 'links'">
              <div class="pane-heading"><span>ÉTAPE 03 · PRÉSENCE</span><h3>Reliez tous les chemins vers vous.</h3><p>Utilisez des URL complètes pour garantir des liens fiables.</p></div>
              <div class="social-grid">
                <label><span class="social-icon">GH</span><div>GitHub<input type="url" [(ngModel)]="socials.github" name="github" placeholder="https://github.com/…"></div></label>
                <label><span class="social-icon linkedin">in</span><div>LinkedIn<input type="url" [(ngModel)]="socials.linkedin" name="linkedin" placeholder="https://linkedin.com/in/…"></div></label>
                <label><span class="social-icon">𝕏</span><div>X / Twitter<input type="url" [(ngModel)]="socials.twitter" name="twitter" placeholder="https://x.com/…"></div></label>
                <label><span class="social-icon">↗</span><div>Site externe<input type="url" [(ngModel)]="socials.website" name="website" placeholder="https://…"></div></label>
              </div>
              <div class="cv-field">
                <div><span>CURRICULUM VITÆ</span><h4>Votre CV téléchargeable</h4><p>Ajoutez la dernière version PDF mise à disposition des visiteurs.</p></div>
                <app-file-uploader [currentUrl]="profile().cvUrl" (uploaded)="profile().cvUrl = $event" (removed)="profile().cvUrl = ''"></app-file-uploader>
              </div>
            </section>
          </div>

          <footer class="profile-footer">
            <span>Dernière mise à jour {{ profile().updatedAt ? (profile().updatedAt | date:'dd/MM/yyyy à HH:mm') : 'non enregistrée' }}</span>
            <div>
              <button type="button" class="previous" *ngIf="prevTab()" (click)="activeTab.set(prevTab()!)">← Précédent</button>
              <button type="button" class="next" *ngIf="nextTab()" (click)="activeTab.set(nextTab()!)">Continuer →</button>
              <button type="submit" class="save" *ngIf="!nextTab()" [disabled]="profForm.invalid">Enregistrer le profil</button>
            </div>
          </footer>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .profile-studio { overflow: hidden; background: radial-gradient(circle at 90% 0,rgba(192,132,252,.06),transparent 28%),#090909; border:1px solid #191919; border-radius:18px; box-shadow:0 25px 70px rgba(0,0,0,.28); }
    .profile-summary { display:flex; align-items:center; gap:1rem; padding:1.3rem 1.6rem; border-bottom:1px solid #171717; }
    .avatar-preview { position:relative; width:58px; height:58px; flex-shrink:0; display:grid; place-items:center; overflow:visible; color:var(--primary); background:#111; border:1px solid #242424; border-radius:15px; font-size:1.3rem; font-weight:900; }
    .avatar-preview img { width:100%; height:100%; object-fit:cover; border-radius:14px; }
    .avatar-preview i { position:absolute; right:-2px; bottom:-2px; width:11px; height:11px; background:#64748b; border:3px solid #090909; border-radius:50%; }
    .avatar-preview i.available { background:#4ade80; box-shadow:0 0 8px #4ade80; }
    .summary-copy { min-width:0; flex:1; }
    .summary-copy > span { color:#3d444f; font:.52rem monospace; letter-spacing:1.3px; }
    .summary-copy h2 { margin:.22rem 0 .1rem; color:#f1f5f9; font-size:1.05rem; }
    .summary-copy p { margin:0; color:#505865; font-size:.68rem; }
    .completion { width:190px; }
    .completion > div:first-child { display:flex; justify-content:space-between; color:#4a525e; font:.55rem monospace; letter-spacing:1px; }
    .completion b { color:var(--primary); font-size:.75rem; }
    .completion-bar { height:3px; margin-top:.5rem; overflow:hidden; background:#1a1a1a; border-radius:4px; }
    .completion-bar i { display:block; height:100%; background:linear-gradient(90deg,#8b5cf6,#c084fc); box-shadow:0 0 8px rgba(192,132,252,.4); }
    .profile-tabs { display:grid; grid-template-columns:repeat(3,1fr); padding:0 1.6rem; border-bottom:1px solid #171717; }
    .profile-tabs button { display:flex; align-items:center; gap:.65rem; padding:.9rem .8rem; color:#404753; background:transparent; border:0; border-bottom:2px solid transparent; text-align:left; cursor:pointer; }
    .profile-tabs button.active { color:#dce2eb; border-bottom-color:var(--primary); background:linear-gradient(to top,rgba(192,132,252,.04),transparent); }
    .profile-tabs i { font:normal 800 .54rem monospace; opacity:.6; }
    .profile-tabs button > span { flex:1; display:flex; flex-direction:column; gap:.1rem; font-size:.7rem; font-weight:800; }
    .profile-tabs small { color:#303640; font-size:.55rem; }
    .profile-tabs button > b { width:16px; height:16px; display:grid; place-items:center; color:#252525; border:1px solid #222; border-radius:50%; font-size:.5rem; }
    .profile-tabs button > b.done { color:#071109; background:#4ade80; border-color:#4ade80; }
    .profile-form { min-height:0; }
    .profile-body { min-height:470px; padding:2rem; }
    .profile-pane { display:flex; flex-direction:column; gap:1.5rem; animation:pane-in .25s ease; }
    @keyframes pane-in { from { opacity:0; transform:translateY(6px); } }
    .pane-heading > span { color:var(--primary); font:900 .55rem monospace; letter-spacing:1.5px; }
    .pane-heading h3 { margin:.5rem 0 .3rem; color:#f1f5f9; font-size:1.45rem; letter-spacing:-.4px; }
    .pane-heading p { margin:0; color:#4c5461; font-size:.7rem; }
    .identity-grid { display:grid; grid-template-columns:250px 1fr; gap:2rem; align-items:start; }
    .avatar-field { display:flex; flex-direction:column; gap:.65rem; }
    .avatar-field > label,.fields label,.bio-grid label,.field-grid label { color:#68717e; font-size:.62rem; font-weight:800; letter-spacing:.6px; text-transform:uppercase; }
    .large-avatar { width:130px; height:130px; display:grid; place-items:center; overflow:hidden; color:var(--primary); background:radial-gradient(circle,rgba(192,132,252,.12),transparent 60%),#0c0c0c; border:1px solid #1e1e1e; border-radius:22px; font-size:3rem; font-weight:900; }
    .large-avatar img { width:100%; height:100%; object-fit:cover; }
    .fields { display:flex; flex-direction:column; gap:1rem; }
    .fields label,.bio-grid label,.field-grid label { display:flex; flex-direction:column; gap:.4rem; }
    .label-text { display:inline-flex; align-items:baseline; gap:.22rem; }
    label em { color:var(--primary); font-style:normal; }
    .fields input,.field-grid input,.bio-grid textarea,.social-grid input { width:100%; box-sizing:border-box; padding:.78rem .9rem; color:#dce2eb; background:#0b0b0b; border:1px solid #1d1d1d; border-radius:8px; outline:0; font:inherit; font-size:.8rem; text-transform:none; }
    .fields input:focus,.field-grid input:focus,.bio-grid textarea:focus,.social-grid input:focus { border-color:rgba(192,132,252,.5); box-shadow:0 0 0 3px rgba(192,132,252,.04); }
    .field-grid,.bio-grid,.social-grid { display:grid; grid-template-columns:1fr 1fr; gap:1rem; }
    .availability-row { flex-direction:row!important; align-items:center; gap:.8rem!important; padding:.8rem 1rem; background:#0b0b0b; border:1px solid #1b1b1b; border-radius:9px; cursor:pointer; text-transform:none!important; }
    .availability-row > span:last-child { display:flex; flex-direction:column; gap:.12rem; }
    .availability-row b { color:#aab2bd; font-size:.7rem; }
    .availability-row small { color:#3e4550; font-size:.58rem; font-weight:500; }
    .toggle { position:relative; width:38px; height:21px; flex-shrink:0; background:#191919; border:1px solid #252525; border-radius:20px; }
    .toggle input { position:absolute; opacity:0; }
    .toggle i { position:absolute; top:3px; left:3px; width:13px; height:13px; background:#454545; border-radius:50%; transition:.2s; }
    .toggle.on { background:var(--primary); border-color:var(--primary); }
    .toggle.on i { background:#080808; transform:translateX(17px); }
    .bio-grid label { position:relative; }
    .bio-grid label > small { position:absolute; right:0; top:0; color:#343b45; font-size:.54rem; text-transform:none; }
    .bio-grid textarea { min-height:210px; resize:vertical; line-height:1.65; }
    .social-grid label { display:flex; align-items:center; gap:.8rem; padding:.8rem; background:#0b0b0b; border:1px solid #1b1b1b; border-radius:10px; color:#6c7480; font-size:.63rem; font-weight:800; }
    .social-grid label > div { min-width:0; flex:1; }
    .social-grid input { display:block; margin-top:.35rem; }
    .social-icon { width:37px; height:37px; display:grid; place-items:center; flex-shrink:0; color:#d5d9df; background:#151515; border:1px solid #242424; border-radius:9px; font-weight:900; }
    .social-icon.linkedin { color:#fff; background:#0a66c2; border-color:#0a66c2; }
    .cv-field { display:grid; grid-template-columns:1fr 1fr; align-items:center; gap:1.5rem; padding:1.2rem; background:linear-gradient(120deg,rgba(192,132,252,.045),transparent),#0b0b0b; border:1px solid #1b1b1b; border-radius:12px; }
    .cv-field span { color:var(--primary); font:.53rem monospace; letter-spacing:1.4px; }
    .cv-field h4 { margin:.4rem 0 .25rem; color:#dfe4eb; font-size:.9rem; }
    .cv-field p { margin:0; color:#414954; font-size:.63rem; }
    .profile-footer { display:flex; justify-content:space-between; align-items:center; padding:.9rem 1.6rem; background:#070707; border-top:1px solid #171717; }
    .profile-footer > span { color:#323944; font:.56rem monospace; }
    .profile-footer > div { display:flex; gap:.5rem; }
    .profile-footer button { padding:.6rem 1rem; border-radius:8px; cursor:pointer; font-size:.67rem; font-weight:800; }
    .profile-footer .previous { color:#69727f; background:#0d0d0d; border:1px solid #202020; }
    .profile-footer .next { color:#e2e8f0; background:#151515; border:1px solid #292929; }
    .profile-footer .save { color:#080808; background:var(--primary); border:0; }
    .profile-footer .save:disabled { opacity:.3; cursor:not-allowed; }
    @media(max-width:780px) {
      .completion { display:none; }
      .profile-tabs { padding:0 .5rem; }
      .profile-tabs small,.profile-tabs button > b { display:none; }
      .profile-body { padding:1.4rem 1rem; }
      .identity-grid { grid-template-columns:1fr; }
      .avatar-field { max-width:280px; }
      .field-grid,.bio-grid,.social-grid,.cv-field { grid-template-columns:1fr; }
      .profile-footer > span { display:none; }
      .profile-footer > div { margin-left:auto; }
    }
    @media(max-width:460px) {
      .summary-copy p { display:none; }
      .profile-summary { padding:1rem; }
      .profile-tabs button { justify-content:center; padding:.8rem .3rem; }
      .profile-tabs i { display:none; }
      .profile-tabs button > span { flex:0; }
    }
  `]
})
export class AdminProfileComponent implements OnInit {
  profile = signal<Profile>({ name: '', title: '', bio: '', avatarUrl: '' } as Profile);
  activeTab = signal<ProfileTab>('identity');
  socials: any = { github: '', linkedin: '', twitter: '', website: '' };
  api = inject(ProfileApiService);
  toast = inject(ToastService);
  private readonly tabs: ProfileTab[] = ['identity', 'bio', 'links'];
  ngOnInit() { this.load(); }
  load() { this.api.get().subscribe(p => { this.profile.set(p); if (p.socials) this.socials = { ...this.socials, ...(p.socials as any) }; }); }
  prevTab(): ProfileTab | null {
    const index = this.tabs.indexOf(this.activeTab());
    return index > 0 ? this.tabs[index - 1] : null;
  }
  nextTab(): ProfileTab | null {
    const index = this.tabs.indexOf(this.activeTab());
    return index < this.tabs.length - 1 ? this.tabs[index + 1] : null;
  }
  completionScore() {
    const values = [
      this.profile().name,
      this.profile().title,
      this.profile().bio,
      this.profile().email,
      this.profile().avatarUrl,
      this.socials.github || this.socials.linkedin,
    ];
    return Math.round((values.filter(Boolean).length / values.length) * 100);
  }
  save() { 
    const data = { ...this.profile(), socials: this.socials }; 
    this.api.update(data).subscribe({
      next: () => {
        this.toast.success('Identité scellée avec succès');
        this.load();
      },
      error: () => {
        this.toast.error('Erreur lors de la mise à jour');
      }
    });
  }
}
