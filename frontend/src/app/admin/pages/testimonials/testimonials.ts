import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface Testimonial { id?: number; name: string; role: string; company?: string; quote: string; quoteEn?: string; published: boolean; order: number; }

@Component({
  selector: 'app-admin-testimonials',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <header><div><span>CONTENU</span><h1>Témoignages</h1></div><button (click)="edit()">+ NOUVEAU</button></header>
    @if (form()) { <form (ngSubmit)="save()">
      <div class="row"><label>Nom<input name="name" [(ngModel)]="form()!.name" required></label><label>Rôle<input name="role" [(ngModel)]="form()!.role" required></label><label>Entreprise<input name="company" [(ngModel)]="form()!.company"></label></div>
      <label>Citation française<textarea name="quote" [(ngModel)]="form()!.quote" required></textarea></label>
      <label>Citation anglaise<textarea name="quoteEn" [(ngModel)]="form()!.quoteEn"></textarea></label>
      <div class="actions"><label class="check"><input type="checkbox" name="published" [(ngModel)]="form()!.published"> Publié</label><button type="button" class="muted" (click)="form.set(null)">ANNULER</button><button>ENREGISTRER</button></div>
    </form> }
    <div class="list">@for (item of items(); track item.id) {
      <article><div><span [class.off]="!item.published">{{ item.published ? 'PUBLIÉ' : 'BROUILLON' }}</span><h2>{{ item.name }}</h2><small>{{ item.role }} {{ item.company ? '· ' + item.company : '' }}</small><blockquote>“{{ item.quote }}”</blockquote></div><div><button class="muted" (click)="edit(item)">MODIFIER</button><button class="danger" (click)="remove(item.id!)">SUPPRIMER</button></div></article>
    }</div>
  `,
  styles: [`
    header{display:flex;justify-content:space-between;align-items:end;margin-bottom:2rem}header span{color:#c084fc;font-size:.65rem;font-weight:900;letter-spacing:3px}h1{font-size:2.4rem;margin:.4rem 0}button{border:0;border-radius:8px;background:#c084fc;color:#08050c;padding:.7rem 1rem;font-size:.62rem;font-weight:900;cursor:pointer}
    form,.list article{background:#0e0e16;border:1px solid rgba(255,255,255,.07);border-radius:15px;padding:1.5rem;margin-bottom:1rem}.row{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem}label{display:block;color:#94a3b8;font-size:.65rem;margin-bottom:1rem}input,textarea{display:block;width:100%;margin-top:.4rem;background:#080810;border:1px solid rgba(255,255,255,.1);border-radius:8px;padding:.8rem;color:#fff;box-sizing:border-box}textarea{min-height:90px}.actions{display:flex;justify-content:flex-end;gap:.6rem;align-items:center}.check{margin:0 auto 0 0}.check input{display:inline;width:auto}
    .list article{display:flex;justify-content:space-between;gap:2rem}.list h2{margin:.4rem 0}.list span{font-size:.55rem;color:#4ade80}.list span.off{color:#fbbf24}.list small{color:#64748b}.list blockquote{margin:1rem 0;color:#94a3b8}.muted{background:#272735;color:#ddd}.danger{background:transparent;color:#fb7185}
    @media(max-width:700px){.row{grid-template-columns:1fr}.list article{display:block}}
  `]
})
export class AdminTestimonialsComponent implements OnInit {
  private http = inject(HttpClient);
  items = signal<Testimonial[]>([]);
  form = signal<Testimonial | null>(null);
  ngOnInit() { this.load(); }
  load() { this.http.get<Testimonial[]>('/api/testimonials/admin/all').subscribe(value => this.items.set(value)); }
  edit(item?: Testimonial) { this.form.set(item ? { ...item } : { name: '', role: '', company: '', quote: '', quoteEn: '', published: true, order: this.items().length + 1 }); }
  save() {
    const value = this.form()!;
    const request = value.id ? this.http.patch(`/api/testimonials/${value.id}`, value) : this.http.post('/api/testimonials', value);
    request.subscribe(() => { this.form.set(null); this.load(); });
  }
  remove(id: number) { if (confirm('Supprimer ce témoignage ?')) this.http.delete(`/api/testimonials/${id}`).subscribe(() => this.load()); }
}
