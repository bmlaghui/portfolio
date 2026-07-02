import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Testimonial, TestimonialService } from '../../services/testimonial.service';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="testimonials" aria-labelledby="testimonials-title">
      <div class="container">
        <span class="eyebrow">04 / {{ t.currentLang() === 'fr' ? 'COLLABORATIONS' : 'COLLABORATIONS' }}</span>
        <div class="heading">
          <h2 id="testimonials-title">{{ t.currentLang() === 'fr' ? 'Ce que le travail' : 'What the work' }}<br><span class="gradient-text">{{ t.currentLang() === 'fr' ? 'laisse derrière lui.' : 'leaves behind.' }}</span></h2>
          <p>{{ t.currentLang() === 'fr' ? 'De la clarté, de la confiance et des produits qui avancent.' : 'Clarity, trust and products that keep moving.' }}</p>
        </div>
        <div class="quotes">
          @for (item of items(); track item.id; let i = $index) {
            <article class="glass-card reveal" [style.--delay]="i * 100 + 'ms'">
              <span class="quote-mark">“</span>
              <blockquote>{{ t.currentLang() === 'en' && item.quoteEn ? item.quoteEn : item.quote }}</blockquote>
              <footer><span class="avatar">{{ initials(item.name) }}</span><span><strong>{{ item.name }}</strong><small>{{ item.role }}{{ item.company ? ' · ' + item.company : '' }}</small></span></footer>
            </article>
          }
        </div>
      </div>
    </section>
  `,
  styles: [`
    .testimonials{padding:8rem 0}.eyebrow{display:block;color:var(--secondary);font:900 .62rem var(--font-title);letter-spacing:4px;margin-bottom:2rem}
    .heading{display:grid;grid-template-columns:1.5fr 1fr;align-items:end;gap:3rem;margin-bottom:3.5rem}.heading h2{font-size:clamp(2.6rem,5vw,5rem);line-height:1;margin:0}.heading p{color:var(--text-muted);font-size:1.15rem;line-height:1.7}
    .quotes{display:grid;grid-template-columns:repeat(3,1fr);gap:1.2rem}.quotes article{padding:2rem;min-height:290px;display:flex;flex-direction:column;animation-delay:var(--delay)}
    .quote-mark{font:800 4rem Georgia;color:var(--primary);line-height:.7}blockquote{margin:1.5rem 0 2rem;color:var(--text);font-size:1rem;line-height:1.8;flex:1}
    article footer{display:flex;gap:.8rem;align-items:center}.avatar{display:grid;place-items:center;width:42px;height:42px;border-radius:13px;background:linear-gradient(135deg,var(--primary),var(--secondary));color:#fff;font-weight:900}
    strong,small{display:block}strong{font-size:.8rem}small{color:var(--text-muted);font-size:.67rem;margin-top:.2rem}
    @media(max-width:900px){.quotes{grid-template-columns:1fr}.heading{grid-template-columns:1fr}.quotes article{min-height:220px}}
  `]
})
export class TestimonialsComponent implements OnInit {
  t = inject(TranslationService);
  private service = inject(TestimonialService);
  items = signal<Testimonial[]>([]);
  ngOnInit() { this.service.getAll().subscribe({ next: value => this.items.set(value) }); }
  initials(name: string) { return name.split(' ').map(word => word[0]).join('').slice(0, 2).toUpperCase(); }
}
