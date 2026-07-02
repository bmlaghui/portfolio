import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslationService } from '../../services/translation.service';
import { HttpClient } from '@angular/common/http';
import { AnalyticsService } from '../../core/services/analytics.service';

interface ContactForm { name: string; email: string; subject: string; message: string; }

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="contact-section" id="contact">
      <div class="container">

        <!-- Section label -->
        <div class="sec-label reveal">
          <span class="dash"></span>
          <span class="num">06</span>
          <span class="word">{{ t.translate('contact.label') }}</span>
        </div>

        <div class="contact-grid">

          <!-- Left: info -->
          <div class="info-col reveal-left">
            <h2 class="sec-title">
              {{ t.translate('contact.title') }}<br>
              <span class="gradient-text">{{ t.translate('contact.titleSub') }}</span>
            </h2>
            <p class="tagline">{{ t.translate('contact.tagline') }}</p>

            <div class="contact-details">
              <a href="mailto:bmlaghui@gmail.com" class="detail-row stagger-1">
                <div class="detail-icon">✉</div>
                <div>
                  <span class="detail-label">EMAIL</span>
                  <span class="detail-val">bmlaghui&#64;gmail.com</span>
                </div>
              </a>
              <div class="detail-row stagger-2">
                <div class="detail-icon">📍</div>
                <div>
                  <span class="detail-label">LOCATION</span>
                  <span class="detail-val">{{ t.currentLang() === 'fr' ? 'France / Télétravail' : 'France / Remote' }}</span>
                </div>
              </div>
              <div class="detail-row stagger-3">
                <div class="detail-icon">⚡</div>
                <div>
                  <span class="detail-label">DISPO</span>
                  <span class="detail-val avail">{{ t.currentLang() === 'fr' ? 'Ouvert aux opportunités' : 'Open to opportunities' }}</span>
                </div>
              </div>
            </div>

            <!-- Social Links -->
            <div class="socials">
              <a href="https://github.com/bmlaghui" target="_blank" rel="noopener noreferrer" class="soc-btn stagger-4">
                <span>GH</span>
                <span class="soc-label">GitHub</span>
              </a>
              <a href="https://www.linkedin.com/in/brahimlaghui" target="_blank" rel="noopener noreferrer" class="soc-btn stagger-5">
                <span>LN</span>
                <span class="soc-label">LinkedIn</span>
              </a>
            </div>
          </div>

          <!-- Right: form -->
          <div class="form-col reveal-scale" style="transition-delay: 0.3s">
            <form class="contact-form glass-card" (ngSubmit)="submit()" #contactForm="ngForm">

              <div class="success-msg" *ngIf="sent()">
                <span class="check">✓</span>
                {{ t.translate('contact.success') }}
              </div>
              <div class="error-msg" *ngIf="error()">
                <span>!</span>
                {{ t.translate('contact.error') }}
              </div>

              <div class="form-row">
                <div class="field">
                  <label>{{ t.translate('contact.name') }}</label>
                  <input type="text" [(ngModel)]="form.name" name="name" required #nameModel="ngModel"
                         [attr.aria-invalid]="nameModel.invalid && nameModel.touched"
                         [placeholder]="t.translate('contact.namePh')">
                  <small class="field-error" *ngIf="nameModel.invalid && nameModel.touched">
                    {{ t.currentLang() === 'fr' ? 'Votre nom est requis.' : 'Your name is required.' }}
                  </small>
                </div>
                <div class="field">
                  <label>{{ t.translate('contact.email') }}</label>
                  <input type="email" [(ngModel)]="form.email" name="email" required email #emailModel="ngModel"
                         [attr.aria-invalid]="emailModel.invalid && emailModel.touched"
                         placeholder="you@example.com">
                  <small class="field-error" *ngIf="emailModel.invalid && emailModel.touched">
                    {{ t.currentLang() === 'fr' ? 'Saisissez une adresse email valide.' : 'Enter a valid email address.' }}
                  </small>
                </div>
              </div>

              <div class="field">
                <label>{{ t.translate('contact.subject') }}</label>
                <input type="text" [(ngModel)]="form.subject" name="subject"
                       [placeholder]="t.translate('contact.subjectPh')">
              </div>

              <div class="field">
                <label>{{ t.translate('contact.message') }}</label>
                <textarea rows="5" [(ngModel)]="form.message" name="message" required minlength="10" #messageModel="ngModel"
                          [attr.aria-invalid]="messageModel.invalid && messageModel.touched"
                          [placeholder]="t.translate('contact.messagePh')"></textarea>
                <small class="field-error" *ngIf="messageModel.invalid && messageModel.touched">
                  {{ t.currentLang() === 'fr' ? 'Décrivez votre demande en 10 caractères minimum.' : 'Describe your request using at least 10 characters.' }}
                </small>
              </div>

              <button type="submit" class="btn-cyber submit-btn" [disabled]="sending() || contactForm.invalid">
                <span *ngIf="!sending()">{{ t.translate('contact.send') }} →</span>
                <span *ngIf="sending()" class="loader"></span>
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  `,
  styles: [`
    .contact-section { padding: 8rem 0; }

    /* Label */
    .sec-label {
      display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem;
    }
    .dash { display: block; width: 40px; height: 1px; background: var(--primary); }
    .num  { font-size: 0.65rem; font-weight: 900; color: var(--secondary); letter-spacing: 3px; }
    .word { font-size: 0.65rem; font-weight: 900; letter-spacing: 4px; color: var(--text-muted); text-transform: uppercase; }

    /* Grid */
    .contact-grid {
      display: grid;
      grid-template-columns: 1fr 1.2fr;
      gap: 6rem;
      align-items: start;
    }

    /* Info */
    .sec-title {
      font-size: clamp(2.5rem, 4.5vw, 4.5rem);
      line-height: 1;
      letter-spacing: -2px;
      font-weight: 800;
      margin-bottom: 1.5rem;
    }
    .tagline {
      color: var(--text-muted);
      font-size: 1rem;
      line-height: 1.7;
      margin-bottom: 3rem;
    }
    .contact-details { display: flex; flex-direction: column; gap: 1.5rem; margin-bottom: 3rem; }
    .detail-row {
      display: flex;
      align-items: center;
      gap: 1.2rem;
      text-decoration: none;
      color: inherit;
      transition: opacity 0.3s;
    }
    .detail-row:hover { opacity: 0.8; }
    .detail-icon {
      width: 44px; height: 44px;
      display: flex; align-items: center; justify-content: center;
      background: var(--surface);
      border: 1px solid var(--glass-border);
      border-radius: 12px;
      font-size: 1rem;
      flex-shrink: 0;
    }
    .detail-label { display: block; font-size: 0.55rem; font-weight: 900; letter-spacing: 2px; color: var(--text-muted); margin-bottom: 4px; }
    .detail-val { display: block; font-size: 0.95rem; font-weight: 700; }
    .avail { color: #4ade80; }

    /* Socials */
    .socials { display: flex; gap: 1rem; }
    .soc-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.4rem;
      padding: 0.8rem 1.2rem;
      background: var(--surface);
      border: 1px solid var(--glass-border);
      border-radius: 12px;
      color: var(--text-muted);
      text-decoration: none;
      font-size: 0.8rem;
      font-weight: 900;
      transition: all 0.3s;
    }
    .soc-btn:hover {
      border-color: var(--primary);
      color: var(--primary);
      box-shadow: 0 0 18px rgba(192,132,252,0.15);
      transform: translateY(-2px);
    }
    .soc-label { font-size: 0.55rem; letter-spacing: 1px; }

    /* Form */
    .contact-form {
      padding: 2.5rem;
      border-radius: 20px;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
    .field { display: flex; flex-direction: column; gap: 0.6rem; }
    label {
      font-size: 0.6rem;
      font-weight: 900;
      letter-spacing: 2px;
      color: var(--text-muted);
    }
    input, textarea {
      background: rgba(255,255,255,0.04);
      border: 1px solid var(--glass-border);
      border-radius: 10px;
      padding: 0.9rem 1.1rem;
      color: var(--text);
      font-family: inherit;
      font-size: 0.9rem;
      outline: none;
      transition: border-color 0.3s, box-shadow 0.3s;
      resize: vertical;
    }
    input::placeholder, textarea::placeholder { color: var(--text-muted); opacity: 0.5; }
    input:focus, textarea:focus {
      border-color: var(--primary);
      box-shadow: 0 0 20px rgba(192,132,252,0.1);
    }
    [aria-invalid="true"] { border-color: #f87171; }
    .field-error { color: #f87171; font-size: 0.72rem; }
    .submit-btn { align-self: flex-start; position: relative; }
    .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

    .success-msg {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem 1.5rem;
      background: rgba(74,222,128,0.08);
      border: 1px solid rgba(74,222,128,0.2);
      border-radius: 10px;
      color: #4ade80;
      font-weight: 700;
      font-size: 0.9rem;
    }
    .error-msg {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem 1.5rem;
      background: rgba(248,113,113,0.08);
      border: 1px solid rgba(248,113,113,0.25);
      border-radius: 10px;
      color: #f87171;
      font-weight: 700;
      font-size: 0.9rem;
    }
    .check { font-size: 1.2rem; }

    .loader {
      display: inline-block;
      width: 16px; height: 16px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    @media (max-width: 1000px) {
      .contact-grid { grid-template-columns: 1fr; gap: 4rem; }
      .form-row { grid-template-columns: 1fr; }
    }
    @media (max-width: 600px) {
      .contact-form { padding: 1.5rem; }
      .sec-title { font-size: 2.2rem; }
    }
  `]
})
export class ContactComponent {
  t = inject(TranslationService);
  private http = inject(HttpClient);
  private analytics = inject(AnalyticsService);
  sending = signal(false);
  sent = signal(false);
  error = signal(false);

  form: ContactForm = { name: '', email: '', subject: '', message: '' };

  submit() {
    if (!this.form.name || !this.form.email || !this.form.message) return;
    this.sending.set(true);
    this.error.set(false);
    this.http.post('/api/contact', this.form).subscribe({
      next: () => {
        this.sending.set(false);
        this.sent.set(true);
        this.analytics.track('contact_sent', { resource: 'contact', path: '/' });
        this.form = { name: '', email: '', subject: '', message: '' };
        setTimeout(() => this.sent.set(false), 5000);
      },
      error: () => {
        this.sending.set(false);
        this.error.set(true);
      },
    });
  }
}
