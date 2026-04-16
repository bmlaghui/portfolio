import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="contact">
      <div class="glass-card contact-container">
        <h2 class="title">Let's <span class="gradient-text">Connect</span></h2>
        <p>I'm always open to discussing new projects, creative ideas or opportunities to be part of your visions.</p>
        <form (submit)="$event.preventDefault()">
          <div class="form-group">
            <input type="text" placeholder="Name" />
          </div>
          <div class="form-group">
            <input type="email" placeholder="Email" />
          </div>
          <div class="form-group">
            <textarea placeholder="Message" rows="5"></textarea>
          </div>
          <button class="btn-premium">Send Message</button>
        </form>
      </div>
    </section>
  `,
  styles: [`
    .contact {
      padding: 100px 10%;
      display: flex;
      justify-content: center;
    }
    .contact-container {
      max-width: 800px;
      padding: 4rem;
      text-align: center;
    }
    .title {
      font-size: 3rem;
      margin-bottom: 1.5rem;
    }
    p {
      color: var(--text-muted);
      margin-bottom: 3rem;
      font-size: 1.1rem;
    }
    form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      text-align: left;
    }
    input, textarea {
      width: 100%;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid var(--glass-border);
      border-radius: 12px;
      padding: 1rem 1.5rem;
      color: white;
      font-family: inherit;
      outline: none;
      transition: all 0.3s ease;
      
      &:focus {
        border-color: var(--primary);
        background: rgba(255, 255, 255, 0.05);
      }
    }
    button {
      align-self: flex-start;
      margin-top: 1rem;
    }
  `]
})
export class ContactComponent {}
