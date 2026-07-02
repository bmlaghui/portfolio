import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class NewsletterService {
  private http = inject(HttpClient);
  subscribe(email: string, language: string) {
    return this.http.post('/api/newsletter', { email, language });
  }
}
