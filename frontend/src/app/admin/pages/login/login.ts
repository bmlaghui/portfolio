import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
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
           <h1>ACCÈS ADMIN</h1>
           <p>Identifiez-vous pour gérer le portfolio</p>
        </div>

        <form (ngSubmit)="onSubmit()" #loginForm="ngForm">
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

          <div *ngIf="error()" class="error-msg">
            {{ error() }}
          </div>

          <button type="submit" [disabled]="loading() || !loginForm.valid" class="btn-primary">
            {{ loading() ? 'Connexion...' : 'Entrer dans le système' }}
          </button>
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
  `]
})
export class AdminLoginComponent {
  email = '';
  password = '';
  showPassword = signal(false);
  loading = signal(false);
  error = signal<string | null>(null);

  auth = inject(AdminAuthService);
  router = inject(Router);
  toast = inject(ToastService);

  onSubmit() {
    this.loading.set(true);
    this.error.set(null);

    this.auth.login(this.email, this.password).subscribe({
      next: () => {
        this.toast.success('Connexion établie. Bienvenue, Administrateur.');
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
}
