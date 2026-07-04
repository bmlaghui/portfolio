import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminAuthService } from '../../services/admin-auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { AdminUser, MfaSetup } from '../../interfaces/admin.interfaces';

type AccountTab = 'identity' | 'password' | 'mfa';

@Component({
  selector: 'app-admin-account',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-page">
      <div class="header-section">
        <div class="titles">
          <div class="cyber-badge">Admin Security</div>
          <h1>Mon compte</h1>
          <p>Gérez votre identité de connexion et la sécurité de l’administration.</p>
        </div>
        <div class="security-score"><span>SÉCURITÉ</span><b>{{ user()?.mfaEnabled ? 'RENFORCÉE' : 'STANDARD' }}</b><i [class.strong]="user()?.mfaEnabled"></i></div>
      </div>

      <div class="account-studio">
        <header class="account-summary">
          <div class="admin-avatar">{{ (user()?.name || user()?.email || 'A').charAt(0).toUpperCase() }}</div>
          <div><span>COMPTE {{ user()?.role }}</span><h2>{{ user()?.name || 'Administrateur' }}</h2><p>{{ user()?.email }}</p></div>
          <div class="mfa-badge" [class.enabled]="user()?.mfaEnabled"><i></i>{{ user()?.mfaEnabled ? 'MFA ACTIF' : 'MFA INACTIF' }}</div>
        </header>

        <nav class="account-tabs">
          <button type="button" [class.active]="activeTab() === 'identity'" (click)="activeTab.set('identity')"><i>01</i><span>Informations<small>Nom et email</small></span></button>
          <button type="button" [class.active]="activeTab() === 'password'" (click)="activeTab.set('password')"><i>02</i><span>Mot de passe<small>Identifiants d’accès</small></span></button>
          <button type="button" [class.active]="activeTab() === 'mfa'" (click)="activeTab.set('mfa')"><i>03</i><span>Double authentification<small>Authenticator & récupération</small></span></button>
        </nav>

        <div class="account-body">
          <section class="account-pane" *ngIf="activeTab() === 'identity'">
            <div class="pane-heading"><span>IDENTITÉ ADMINISTRATEUR</span><h3>Vos informations de connexion.</h3><p>Le mot de passe n’est demandé que si vous modifiez votre adresse email.</p></div>
            <form (ngSubmit)="saveAccount()" #accountForm="ngForm" class="form-card">
              <div class="field-grid">
                <label><span>Nom affiché <em>*</em></span><input name="name" [(ngModel)]="account.name" required minlength="2" autocomplete="name"></label>
                <label><span>Adresse email <em>*</em></span><input type="email" name="email" [(ngModel)]="account.email" required email autocomplete="email"></label>
              </div>
              <label *ngIf="emailChanged()"><span>Mot de passe actuel <em>*</em></span><input type="password" name="accountPassword" [(ngModel)]="account.currentPassword" required autocomplete="current-password" placeholder="Requis pour changer l’email"></label>
              <footer><span>Les changements seront appliqués immédiatement.</span><button [disabled]="accountForm.invalid || saving()">Enregistrer les informations</button></footer>
            </form>
          </section>

          <section class="account-pane" *ngIf="activeTab() === 'password'">
            <div class="pane-heading"><span>SÉCURITÉ DU MOT DE PASSE</span><h3>Renouvelez votre clé d’accès.</h3><p>Après modification, toutes les sessions persistantes seront révoquées.</p></div>
            <form (ngSubmit)="changePassword()" #passwordForm="ngForm" class="form-card password-card">
              <label><span>Mot de passe actuel <em>*</em></span><input type="password" name="currentPassword" [(ngModel)]="password.current" required autocomplete="current-password"></label>
              <div class="field-grid">
                <label><span>Nouveau mot de passe <em>*</em></span><input type="password" name="newPassword" [(ngModel)]="password.next" required minlength="10" autocomplete="new-password"></label>
                <label><span>Confirmation <em>*</em></span><input type="password" name="confirmPassword" [(ngModel)]="password.confirm" required autocomplete="new-password"></label>
              </div>
              <div class="strength">
                <div><i *ngFor="let point of [1,2,3,4]" [class.active]="point <= passwordStrength()"></i></div>
                <span>{{ strengthLabel() }}</span>
              </div>
              <ul><li [class.ok]="password.next.length >= 10">10 caractères minimum</li><li [class.ok]="hasMixedCase()">Majuscule et minuscule</li><li [class.ok]="hasNumberOrSymbol()">Chiffre ou caractère spécial</li><li [class.ok]="password.next === password.confirm && !!password.next">Confirmation identique</li></ul>
              <footer><span>Vous devrez vous reconnecter après cette action.</span><button [disabled]="passwordForm.invalid || password.next !== password.confirm || saving()">Modifier le mot de passe</button></footer>
            </form>
          </section>

          <section class="account-pane" *ngIf="activeTab() === 'mfa'">
            <div class="pane-heading"><span>DOUBLE AUTHENTIFICATION</span><h3>Une seconde preuve, au-delà du mot de passe.</h3><p>Compatible avec Google Authenticator, Microsoft Authenticator, 1Password et Authy.</p></div>

            <div class="mfa-overview" *ngIf="!user()?.mfaEnabled && !mfaSetup()">
              <div class="shield">◈</div>
              <div><h4>Protégez l’accès administrateur</h4><p>Un code temporaire de 6 chiffres sera demandé à chaque connexion.</p><ul><li>Codes renouvelés toutes les 30 secondes</li><li>Secret chiffré côté serveur</li><li>8 codes de récupération à usage unique</li></ul></div>
              <form (ngSubmit)="startMfa()" #setupForm="ngForm"><label>Mot de passe actuel<input type="password" name="setupPassword" [(ngModel)]="mfaPassword" required autocomplete="current-password"></label><button [disabled]="setupForm.invalid || saving()">Configurer le MFA →</button></form>
            </div>

            <div class="mfa-setup" *ngIf="mfaSetup() && !recoveryCodes().length">
              <div class="qr-panel"><span>1 · SCANNEZ CE QR CODE</span><img [src]="mfaSetup()!.qrCode" alt="QR code MFA"><code>{{ mfaSetup()!.secret }}</code></div>
              <form (ngSubmit)="enableMfa()" #enableForm="ngForm">
                <span>2 · CONFIRMEZ LE CODE</span><h4>Vérifiez la configuration</h4><p>Saisissez le code affiché par votre application pour terminer l’activation.</p>
                <input name="mfaCode" [(ngModel)]="mfaCode" required minlength="6" maxlength="6" inputmode="numeric" autocomplete="one-time-code" placeholder="000 000">
                <button [disabled]="enableForm.invalid || saving()">Activer la double authentification</button>
                <button type="button" class="text-button" (click)="cancelMfa()">Annuler</button>
              </form>
            </div>

            <div class="recovery-panel" *ngIf="recoveryCodes().length">
              <span>ACTIVATION RÉUSSIE</span><h4>Conservez vos codes de récupération</h4><p>Chaque code ne fonctionne qu’une fois. Stockez-les dans un gestionnaire de mots de passe.</p>
              <div class="recovery-grid"><code *ngFor="let code of recoveryCodes()">{{ code }}</code></div>
              <button type="button" (click)="copyRecoveryCodes()">Copier tous les codes</button>
              <button type="button" class="done" (click)="finishMfa()">J’ai sauvegardé mes codes</button>
            </div>

            <div class="mfa-enabled" *ngIf="user()?.mfaEnabled && !recoveryCodes().length">
              <div class="enabled-icon">✓</div><div><span>PROTECTION ACTIVE</span><h4>Votre compte est protégé par MFA</h4><p>Un code Authenticator est requis à chaque nouvelle connexion.</p></div>
              <form (ngSubmit)="disableMfa()" #disableForm="ngForm">
                <label>Mot de passe actuel<input type="password" name="disablePassword" [(ngModel)]="disable.password" required></label>
                <label>Code MFA<input name="disableCode" [(ngModel)]="disable.code" required minlength="6" maxlength="20" placeholder="000 000"></label>
                <button [disabled]="disableForm.invalid || saving()">Désactiver le MFA</button>
              </form>
            </div>
          </section>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .security-score{display:flex;flex-direction:column;align-items:flex-end;gap:.2rem}.security-score span{color:#3c4450;font:.52rem monospace;letter-spacing:1.3px}.security-score b{color:#fbbf24;font-size:.7rem}.security-score i{width:80px;height:3px;background:#fbbf24;border-radius:3px}.security-score i.strong{background:#4ade80;box-shadow:0 0 8px rgba(74,222,128,.4)}
    .account-studio{overflow:hidden;background:radial-gradient(circle at 90% 0,rgba(192,132,252,.06),transparent 30%),#090909;border:1px solid #191919;border-radius:18px}.account-summary{display:flex;align-items:center;gap:1rem;padding:1.25rem 1.5rem;border-bottom:1px solid #171717}.admin-avatar{width:54px;height:54px;display:grid;place-items:center;color:var(--primary);background:rgba(192,132,252,.08);border:1px solid rgba(192,132,252,.18);border-radius:14px;font-size:1.2rem;font-weight:900}.account-summary>div:nth-child(2){flex:1}.account-summary span{color:#3d4550;font:.5rem monospace;letter-spacing:1.2px}.account-summary h2{margin:.2rem 0;color:#eef2f7;font-size:1rem}.account-summary p{margin:0;color:#505966;font-size:.65rem}.mfa-badge{display:flex;align-items:center;gap:.4rem;padding:.4rem .65rem;color:#fbbf24;border:1px solid rgba(251,191,36,.18);border-radius:30px;font-size:.53rem!important;font-weight:900!important}.mfa-badge i{width:5px;height:5px;background:currentColor;border-radius:50%;box-shadow:0 0 7px currentColor}.mfa-badge.enabled{color:#4ade80;border-color:rgba(74,222,128,.18)}
    .account-tabs{display:grid;grid-template-columns:repeat(3,1fr);padding:0 1.5rem;border-bottom:1px solid #171717}.account-tabs button{display:flex;align-items:center;gap:.65rem;padding:.9rem;color:#414853;background:transparent;border:0;border-bottom:2px solid transparent;text-align:left;cursor:pointer}.account-tabs button.active{color:#e2e8f0;border-bottom-color:var(--primary)}.account-tabs i{font:normal 800 .54rem monospace}.account-tabs button>span{display:flex;flex-direction:column;gap:.1rem;font-size:.7rem;font-weight:800}.account-tabs small{color:#303640;font-size:.55rem}.account-body{min-height:490px;padding:2rem}.account-pane{display:flex;flex-direction:column;gap:1.4rem;animation:pane .25s ease}@keyframes pane{from{opacity:0;transform:translateY(5px)}}.pane-heading>span,.mfa-setup form>span,.qr-panel>span,.recovery-panel>span,.mfa-enabled>div span{color:var(--primary);font:900 .54rem monospace;letter-spacing:1.4px}.pane-heading h3{margin:.5rem 0 .25rem;color:#f1f5f9;font-size:1.4rem}.pane-heading p{margin:0;color:#4b5360;font-size:.7rem}
    .form-card{display:flex;flex-direction:column;gap:1rem;padding:1.25rem;background:#0b0b0b;border:1px solid #1a1a1a;border-radius:13px}.field-grid{display:grid;grid-template-columns:1fr 1fr;gap:1rem}.form-card label,.mfa-overview label,.mfa-enabled label{display:flex;flex-direction:column;gap:.4rem;color:#68717e;font-size:.61rem;font-weight:800;text-transform:uppercase;letter-spacing:.5px}.form-card label>span{display:inline-flex;gap:.2rem}.form-card em{color:var(--primary);font-style:normal}.form-card input,.mfa-overview input,.mfa-enabled input,.mfa-setup input{width:100%;box-sizing:border-box;padding:.8rem .9rem;color:#dce2eb;background:#080808;border:1px solid #1e1e1e;border-radius:8px;outline:0}.form-card input:focus,.mfa-overview input:focus,.mfa-enabled input:focus,.mfa-setup input:focus{border-color:rgba(192,132,252,.5)}.form-card footer{display:flex;justify-content:space-between;align-items:center;padding-top:1rem;border-top:1px solid #191919}.form-card footer span{color:#363d47;font-size:.58rem}.form-card button,.mfa-overview button,.mfa-setup button,.recovery-panel button,.mfa-enabled button{padding:.65rem 1rem;color:#080808;background:var(--primary);border:0;border-radius:8px;cursor:pointer;font-size:.66rem;font-weight:850}.form-card button:disabled,.mfa-overview button:disabled,.mfa-setup button:disabled,.mfa-enabled button:disabled{opacity:.3;cursor:not-allowed}
    .strength{display:flex;align-items:center;justify-content:space-between}.strength>div{display:grid;grid-template-columns:repeat(4,1fr);gap:4px;width:180px}.strength i{height:4px;background:#202020;border-radius:4px}.strength i.active{background:var(--primary)}.strength span{color:#555e6a;font-size:.58rem}.password-card ul{display:grid;grid-template-columns:1fr 1fr;gap:.5rem;margin:0;padding:0;list-style:none}.password-card li{color:#414954;font-size:.6rem}.password-card li::before{content:'○';margin-right:.4rem}.password-card li.ok{color:#6f7a87}.password-card li.ok::before{content:'✓';color:#4ade80}
    .mfa-overview,.mfa-enabled{display:grid;grid-template-columns:80px 1fr minmax(230px,.65fr);gap:1.4rem;align-items:center;padding:1.3rem;background:#0b0b0b;border:1px solid #1b1b1b;border-radius:13px}.shield,.enabled-icon{width:70px;height:70px;display:grid;place-items:center;color:var(--primary);background:rgba(192,132,252,.07);border:1px solid rgba(192,132,252,.17);border-radius:18px;font-size:2rem}.mfa-overview h4,.mfa-enabled h4,.mfa-setup h4,.recovery-panel h4{margin:0 0 .35rem;color:#dfe4eb;font-size:.9rem}.mfa-overview p,.mfa-enabled p,.mfa-setup p,.recovery-panel p{margin:0;color:#4b5360;font-size:.65rem;line-height:1.6}.mfa-overview ul{margin:.65rem 0 0;padding-left:1rem;color:#626c79;font-size:.6rem;line-height:1.8}.mfa-overview form,.mfa-enabled form{display:flex;flex-direction:column;gap:.65rem}.mfa-setup{display:grid;grid-template-columns:300px 1fr;gap:2rem;align-items:center}.qr-panel{display:flex;flex-direction:column;align-items:center;gap:.7rem;padding:1rem;background:#fff;border-radius:14px}.qr-panel>span{align-self:flex-start;color:#6b7280}.qr-panel img{width:220px;height:220px}.qr-panel code{max-width:100%;overflow-wrap:anywhere;color:#111;font-size:.62rem}.mfa-setup form{display:flex;flex-direction:column;gap:.8rem}.mfa-setup input{text-align:center;font:800 1.3rem monospace;letter-spacing:.35rem}.mfa-setup .text-button{color:#596270;background:transparent}.recovery-panel{padding:1.5rem;background:linear-gradient(145deg,rgba(74,222,128,.04),transparent),#0b0b0b;border:1px solid rgba(74,222,128,.14);border-radius:13px}.recovery-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:.5rem;margin:1rem 0}.recovery-grid code{padding:.65rem;color:#b6c0cc;background:#080808;border:1px solid #1d1d1d;border-radius:7px;text-align:center;font-size:.7rem}.recovery-panel button{margin-right:.5rem}.recovery-panel button.done{color:#dce2eb;background:#151515;border:1px solid #292929}.enabled-icon{color:#4ade80;background:rgba(74,222,128,.06);border-color:rgba(74,222,128,.16)}
    @media(max-width:780px){.security-score{display:none}.account-tabs{padding:0 .5rem}.account-tabs small{display:none}.account-body{padding:1.3rem 1rem}.field-grid,.mfa-overview,.mfa-enabled,.mfa-setup{grid-template-columns:1fr}.mfa-overview .shield,.enabled-icon{width:55px;height:55px}.recovery-grid{grid-template-columns:1fr 1fr}.form-card footer{align-items:flex-start;flex-direction:column;gap:.7rem}.account-summary{padding:1rem}.mfa-badge{display:none}}
  `],
})
export class AdminAccountComponent implements OnInit {
  auth = inject(AdminAuthService);
  toast = inject(ToastService);
  activeTab = signal<AccountTab>('identity');
  user = signal<AdminUser | null>(null);
  saving = signal(false);
  mfaSetup = signal<MfaSetup | null>(null);
  recoveryCodes = signal<string[]>([]);
  account = { name: '', email: '', currentPassword: '' };
  private originalEmail = '';
  password = { current: '', next: '', confirm: '' };
  mfaPassword = '';
  mfaCode = '';
  disable = { password: '', code: '' };

  ngOnInit() {
    this.auth.getMe().subscribe(user => {
      this.user.set(user);
      this.account.name = user.name || '';
      this.account.email = user.email;
      this.originalEmail = user.email;
    });
  }

  saveAccount() {
    this.saving.set(true);
    const payload = {
      name: this.account.name,
      email: this.account.email,
      ...(this.emailChanged() ? { currentPassword: this.account.currentPassword } : {}),
    };
    this.auth.updateAccount(payload).subscribe({
      next: user => {
        this.user.set(user);
        this.originalEmail = user.email;
        this.account.currentPassword = '';
        this.saving.set(false);
        this.toast.success('Informations administrateur mises à jour');
      },
      error: error => this.handleError(error),
    });
  }

  changePassword() {
    this.saving.set(true);
    this.auth.changePassword({ currentPassword: this.password.current, newPassword: this.password.next }).subscribe({
      next: () => {
        this.toast.success('Mot de passe modifié. Reconnexion requise.');
        this.saving.set(false);
        this.auth.logout();
      },
      error: error => this.handleError(error),
    });
  }

  startMfa() {
    this.saving.set(true);
    this.auth.setupMfa(this.mfaPassword).subscribe({
      next: setup => {
        this.mfaSetup.set(setup);
        this.saving.set(false);
      },
      error: error => this.handleError(error),
    });
  }

  enableMfa() {
    const setup = this.mfaSetup();
    if (!setup) return;
    this.saving.set(true);
    this.auth.enableMfa({ currentPassword: this.mfaPassword, secret: setup.secret, code: this.mfaCode }).subscribe({
      next: result => {
        this.user.update(user => user ? { ...user, mfaEnabled: true } : user);
        this.recoveryCodes.set(result.recoveryCodes);
        this.saving.set(false);
        this.toast.success('Double authentification activée');
      },
      error: error => this.handleError(error),
    });
  }

  disableMfa() {
    this.saving.set(true);
    this.auth.disableMfa({ currentPassword: this.disable.password, code: this.disable.code }).subscribe({
      next: () => {
        this.user.update(user => user ? { ...user, mfaEnabled: false } : user);
        this.disable = { password: '', code: '' };
        this.saving.set(false);
        this.toast.warning('Double authentification désactivée');
      },
      error: error => this.handleError(error),
    });
  }

  cancelMfa() {
    this.mfaSetup.set(null);
    this.mfaCode = '';
    this.mfaPassword = '';
  }

  finishMfa() {
    this.recoveryCodes.set([]);
    this.mfaSetup.set(null);
    this.mfaCode = '';
    this.mfaPassword = '';
  }

  copyRecoveryCodes() {
    navigator.clipboard.writeText(this.recoveryCodes().join('\n'));
    this.toast.info('Codes de récupération copiés');
  }

  hasMixedCase() { return /[a-z]/.test(this.password.next) && /[A-Z]/.test(this.password.next); }
  emailChanged() { return this.account.email.trim().toLowerCase() !== this.originalEmail.trim().toLowerCase(); }
  hasNumberOrSymbol() { return /[\d\W]/.test(this.password.next); }
  passwordStrength() {
    return [this.password.next.length >= 10, this.hasMixedCase(), this.hasNumberOrSymbol(), this.password.next.length >= 14].filter(Boolean).length;
  }
  strengthLabel() { return ['Très faible', 'Faible', 'Correct', 'Fort', 'Excellent'][this.passwordStrength()]; }

  private handleError(error: any) {
    this.saving.set(false);
    this.toast.error(error.error?.message || 'Une erreur est survenue');
  }
}
