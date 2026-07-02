import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  company?: string;
  quote: string;
  quoteEn?: string;
  avatarUrl?: string;
}

@Injectable({ providedIn: 'root' })
export class TestimonialService {
  private http = inject(HttpClient);
  getAll() { return this.http.get<Testimonial[]>('/api/testimonials'); }
}
