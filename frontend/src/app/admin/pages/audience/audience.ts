import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Summary { total: number; byType: Record<string, number>; recent: Array<{ id: number; type: string; path?: string; createdAt: string }>; }
interface Subscriber { id: number; email: string; language: string; createdAt: string; }

@Component({
  selector: 'app-admin-audience',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header><div><span>AUDIENCE / 30 JOURS</span><h1>Mesure & newsletter</h1></div><button (click)="load()">ACTUALISER</button></header>
    <div class="metrics">
      <article><small>ÉVÉNEMENTS</small><strong>{{ summary()?.total || 0 }}</strong></article>
      @for (entry of eventEntries(); track entry[0]) { <article><small>{{ label(entry[0]) }}</small><strong>{{ entry[1] }}</strong></article> }
    </div>
    <div class="grids">
      <section><h2>Dernière activité</h2>
        <div class="table">@for (item of summary()?.recent || []; track item.id) {
          <div><b>{{ label(item.type) }}</b><span>{{ item.path || '—' }}</span><time>{{ item.createdAt | date:'dd/MM HH:mm' }}</time></div>
        } @empty { <p>Aucune activité pour le moment.</p> }</div>
      </section>
      <section><h2>Abonnés newsletter <em>{{ subscribers().length }}</em></h2>
        <div class="table">@for (item of subscribers(); track item.id) {
          <div><b>{{ item.email }}</b><span>{{ item.language | uppercase }}</span><button class="delete" (click)="remove(item.id)">SUPPRIMER</button></div>
        } @empty { <p>Aucun abonné pour le moment.</p> }</div>
      </section>
    </div>
  `,
  styles: [`
    header{display:flex;justify-content:space-between;align-items:end;margin-bottom:3rem}header span{color:#c084fc;font-size:.65rem;font-weight:900;letter-spacing:3px}h1{font-size:2.4rem;margin:.5rem 0 0}button{background:#c084fc;color:#08050c;border:0;border-radius:8px;padding:.7rem 1rem;font-size:.62rem;font-weight:900;cursor:pointer}
    .metrics{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:1rem;margin-bottom:2rem}.metrics article,section{background:#0e0e16;border:1px solid rgba(255,255,255,.07);border-radius:15px;padding:1.5rem}.metrics small,.metrics strong{display:block}.metrics small{color:#64748b;font-size:.55rem;letter-spacing:1px}.metrics strong{font-size:2rem;margin-top:.6rem}
    .grids{display:grid;grid-template-columns:1fr 1fr;gap:1.5rem}h2{font-size:1rem;margin:0 0 1.5rem}h2 em{color:#c084fc;font-style:normal}.table>div{display:grid;grid-template-columns:1fr 1fr auto;align-items:center;gap:1rem;border-top:1px solid rgba(255,255,255,.05);padding:.9rem 0;font-size:.7rem}.table span,.table time{color:#64748b}.delete{background:transparent;color:#fb7185;padding:.3rem}
    @media(max-width:900px){.grids{grid-template-columns:1fr}}
  `]
})
export class AdminAudienceComponent implements OnInit {
  private http = inject(HttpClient);
  summary = signal<Summary | null>(null);
  subscribers = signal<Subscriber[]>([]);
  eventEntries = signal<[string, number][]>([]);
  ngOnInit() { this.load(); }
  load() {
    this.http.get<Summary>('/api/analytics/summary').subscribe(value => { this.summary.set(value); this.eventEntries.set(Object.entries(value.byType)); });
    this.http.get<Subscriber[]>('/api/newsletter').subscribe(value => this.subscribers.set(value));
  }
  remove(id: number) { this.http.delete(`/api/newsletter/${id}`).subscribe(() => this.load()); }
  label(type: string) { return ({ page_view: 'Pages vues', project_view: 'Projets vus', cv_view: 'CV consulté', contact_sent: 'Contacts', newsletter_signup: 'Inscriptions', outbound_click: 'Liens sortants' } as Record<string, string>)[type] || type; }
}
