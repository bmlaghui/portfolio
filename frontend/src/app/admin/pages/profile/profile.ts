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
        </div>
      </div>

      <div class="profile-workflow-container">
        <div class="modal-frame no-pos glass-neo-deep">
           <aside class="modal-sidebar">
              <div class="avatar-edit-preview">
                 <img [src]="profile().avatarUrl || '/assets/avatar-placeholder.jpg'" alt="">
                 <div class="pulse-ring"></div>
              </div>
              <nav class="nav-steps">
                 <button [class.active]="activeTab() === 'identity'" (click)="activeTab.set('identity')"><span>01 IDENTITÉ</span><span class="dot-status" [class.valid]="profile().name"></span></button>
                 <button [class.active]="activeTab() === 'bio'" (click)="activeTab.set('bio')"><span>02 RÉCIT</span><span class="dot-status" [class.valid]="profile().email && profile().bio"></span></button>
                 <button [class.active]="activeTab() === 'links'" (click)="activeTab.set('links')"><span>03 RÉSEAUX</span><span class="dot-status" [class.valid]="true"></span></button>
              </nav>
           </aside>

           <main class="modal-main">
              <header class="main-header">
                 <div class="titles"><h2>PARAMÈTRES CORE</h2><span class="breadcrumb">identity // core // {{ activeTab() }}</span></div>
              </header>
              <form (ngSubmit)="save()" class="liquid-form" #profForm="ngForm">
                 <div class="tab-pane reveal" *ngIf="activeTab() === 'identity'">
                    <div class="form-group"><label>Nom complet</label><input type="text" [(ngModel)]="profile().name" name="name" required class="cyber-input"></div>
                    <div class="form-grid-2">
                       <div class="form-group"><label>Titre (FR)</label><input type="text" [(ngModel)]="profile().title" name="title" required class="cyber-input"></div>
                       <div class="form-group"><label>Title (EN)</label><input type="text" [(ngModel)]="profile().titleEn" name="titleEn" required class="cyber-input"></div>
                    </div>
                    <div class="form-group"><label>Avatar</label><app-file-uploader [currentUrl]="profile().avatarUrl" (uploaded)="profile().avatarUrl = $event" (removed)="profile().avatarUrl = ''"></app-file-uploader></div>
                    <div class="next-step-hint"><button type="button" class="btn-next-tab" (click)="activeTab.set('bio')">RÉCIT & CONTACT →</button></div>
                 </div>

                 <div class="tab-pane reveal" *ngIf="activeTab() === 'bio'">
                    <div class="form-grid-2">
                       <div class="form-group"><label>Email</label><input type="email" [(ngModel)]="profile().email" name="email" required class="cyber-input"></div>
                       <div class="form-group"><label>Téléphone</label><input type="text" [(ngModel)]="profile().phone" name="phone" class="cyber-input"></div>
                    </div>
                    <div class="form-group"><label>Bio (FR)</label><textarea [(ngModel)]="profile().bio" name="bio" required class="cyber-input area" rows="6"></textarea></div>
                    <div class="form-group"><label>Bio (EN)</label><textarea [(ngModel)]="profile().bioEn" name="bioEn" required class="cyber-input area" rows="6"></textarea></div>
                    <div class="next-step-hint"><button type="button" class="btn-next-tab" (click)="activeTab.set('links')">SOCIALS & CV →</button></div>
                 </div>

                 <div class="tab-pane reveal" *ngIf="activeTab() === 'links'">
                    <div class="form-grid-2">
                       <div class="form-group"><label>GitHub</label><input type="text" [(ngModel)]="socials.github" name="gh" class="cyber-input"></div>
                       <div class="form-group"><label>LinkedIn</label><input type="text" [(ngModel)]="socials.linkedin" name="li" class="cyber-input"></div>
                    </div>
                    <div class="form-group"><label>CV (PDF)</label><app-file-uploader [currentUrl]="profile().cvUrl" (uploaded)="profile().cvUrl = $event" (removed)="profile().cvUrl = ''"></app-file-uploader></div>
                    <footer class="modal-footer-final"><div class="spacer"></div><button type="submit" class="btn-submit-cyber" [disabled]="profForm.invalid">SCELLER MODIFICATIONS</button></footer>
                 </div>
              </form>
           </main>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-frame.no-pos { position: relative; height: 75vh; }
    .avatar-edit-preview { width: 100px; height: 100px; border-radius: 50%; border: 2px solid var(--primary); margin: 0 auto 3rem auto; position: relative; padding: 4px; }
    .avatar-edit-preview img { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; }
    .pulse-ring { position: absolute; inset: -4px; border-radius: 50%; border: 1px solid var(--primary); animation: pulse-glow 2s infinite; }
    .form-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
  `]
})
export class AdminProfileComponent implements OnInit {
  profile = signal<Profile>({ name: '', title: '', bio: '', avatarUrl: '' } as Profile);
  activeTab = signal<ProfileTab>('identity');
  socials: any = { github: '', linkedin: '', twitter: '', website: '' };
  api = inject(ProfileApiService);
  toast = inject(ToastService);
  ngOnInit() { this.load(); }
  load() { this.api.get().subscribe(p => { this.profile.set(p); if (p.socials) this.socials = { ...this.socials, ...(p.socials as any) }; }); }
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
