import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminAuthService } from '../../services/admin-auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-page">
      <div class="blob"></div>
      
      <div class="login-card glass-card">
        <div class="card-header">
           <div class="security-icon" *ngIf="mfaRequired()">◈</div>
           <h1>{{ mfaRequired() ? 'DOUBLE VÉRIFICATION' : 'ACCÈS ADMIN' }}</h1>
           <p>{{ mfaRequired() ? 'Saisissez le code de votre application Authenticator' : 'Identifiez-vous pour gérer le portfolio' }}</p>
        </div>

        <form (ngSubmit)="onSubmit()" #loginForm="ngForm">
          <ng-container *ngIf="!mfaRequired()">
          <div class="form-group">
            <label>Email</label>
            <input 
              type="email" 
              name="email" 
              [(ngModel)]="email" 
              required 
              email
              placeholder="votre@email.com"
              class="cyber-input">
          </div>

          <div class="form-group">
            <label>Mot de passe</label>
            <div class="password-input-wrapper">
              <input 
                [type]="showPassword() ? 'text' : 'password'" 
                name="password" 
                [(ngModel)]="password" 
                required 
                placeholder="••••••••"
                class="cyber-input">
              <button type="button" class="toggle-password" (click)="showPassword.set(!showPassword())" tabindex="-1">
                {{ showPassword() ? '👁️' : '👁️‍🗨️' }}
              </button>
            </div>
          </div>
          </ng-container>

          <div class="form-group mfa-group" *ngIf="mfaRequired()">
            <label>Code de sécurité</label>
            <input type="text" name="mfaCode" [(ngModel)]="mfaCode" required minlength="6" maxlength="20"
              inputmode="numeric" autocomplete="one-time-code" placeholder="000 000" class="cyber-input mfa-input">
            <small>Un code à 6 chiffres ou un code de récupération.</small>
          </div>

          <div *ngIf="error()" class="error-msg">
            {{ error() }}
          </div>

          <button type="submit" [disabled]="loading() || !loginForm.valid" class="btn-primary">
            {{ loading() ? 'Vérification...' : (mfaRequired() ? 'Vérifier le code' : 'Entrer dans le système') }}
          </button>
          <button type="button" class="back-login" *ngIf="mfaRequired()" (click)="resetMfa()">← Utiliser un autre compte</button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .login-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #080912;
      position: relative;
      overflow: hidden;
    }

    .blob {
      position: absolute;
      width: 500px;
      height: 500px;
      background: radial-gradient(circle, rgba(192, 132, 252, 0.15) 0%, rgba(0,0,0,0) 70%);
      filter: blur(50px);
      animation: drift 10s infinite alternate linear;
    }
    @keyframes drift {
      from { transform: translate(-20%, -20%) rotate(0deg); }
      to { transform: translate(20%, 20%) rotate(360deg); }
    }

    .login-card {
      width: 100%;
      max-width: 420px;
      padding: 3rem;
      position: relative;
      z-index: 10;
    }

    .card-header { text-align: center; margin-bottom: 2.5rem; }
    .security-icon { width:48px; height:48px; display:grid; place-items:center; margin:0 auto 1rem; color:#c084fc; background:rgba(192,132,252,.08); border:1px solid rgba(192,132,252,.22); border-radius:14px; font-size:1.4rem; }
    h1 { font-weight: 900; letter-spacing: 2px; font-size: 1.8rem; margin-bottom: 0.5rem; }
    p { color: #94a3b8; font-size: 0.9rem; }

    .form-group { margin-bottom: 1.5rem; }
    label { display: block; margin-bottom: 0.5rem; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; }
    
    .cyber-input {
      width: 100%;
      padding: 1rem;
      background: rgba(15, 17, 28, 0.6);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 8px;
      color: white;
      transition: all 0.3s;
    }
    .cyber-input:focus {
      outline: none;
      border-color: #c084fc;
      box-shadow: 0 0 15px rgba(192, 132, 252, 0.2);
    }

    .password-input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }
    .toggle-password {
      position: absolute;
      right: 12px;
      background: none;
      border: none;
      color: #94a3b8;
      cursor: pointer;
      font-size: 1.2rem;
      padding: 0.5rem;
      transition: color 0.3s;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .toggle-password:hover {
      color: #c084fc;
    }

    .btn-primary {
      width: 100%;
      padding: 1rem;
      background: #c084fc;
      color: #000;
      border: none;
      border-radius: 8px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      cursor: pointer;
      margin-top: 1rem;
      transition: all 0.3s;
    }
    .btn-primary:not(:disabled):hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 20px rgba(192, 132, 252, 0.4);
    }
    .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

    .error-msg {
      background: rgba(239, 68, 68, 0.1);
      color: #ef4444;
      padding: 0.8rem;
      border-radius: 6px;
      font-size: 0.85rem;
      margin-bottom: 1.5rem;
      border-left: 3px solid #ef4444;
    }
    .mfa-input { text-align:center; font:800 1.35rem monospace; letter-spacing:.35rem; }
    .mfa-group small { display:block; margin-top:.55rem; color:#475569; font-size:.67rem; text-align:center; }
    .back-login { width:100%; margin-top:1rem; color:#64748b; background:transparent; border:0; cursor:pointer; font-size:.7rem; }
    .back-login:hover { color:#c084fc; }
  `]
})
export class AdminLoginComponent {
  email = '';
  password = '';
  mfaCode = '';
  showPassword = signal(false);
  mfaRequired = signal(false);
  loading = signal(false);
  error = signal<string | null>(null);

  auth = inject(AdminAuthService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  toast = inject(ToastService);

  constructor() {
    if (this.route.snapshot.queryParamMap.get('session') === 'expired') {
      this.error.set('Votre session a expiré. Veuillez vous reconnecter.');
    }
  }

  onSubmit() {
    this.loading.set(true);
    this.error.set(null);

    this.auth.login(this.email, this.password, this.mfaRequired() ? this.mfaCode : undefined).subscribe({
      next: response => {
        if ('mfaRequired' in response) {
          this.mfaRequired.set(true);
          this.mfaCode = '';
          this.loading.set(false);
          return;
        }
        this.toast.success('Connexion établie. Bienvenue, Administrateur.');
        this.loading.set(false);
        this.router.navigate(['/admin/dashboard']);
      },
      error: (err: any) => {
        const msg = err.error?.message || 'Identifiants invalides';
        this.error.set(msg);
        this.toast.error(msg);
        this.loading.set(false);
      }
    });
  }

  resetMfa() {
    this.mfaRequired.set(false);
    this.mfaCode = '';
    this.password = '';
    this.error.set(null);
  }
}
