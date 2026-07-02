import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export type AnalyticsEventType =
  | 'page_view' | 'project_view' | 'cv_view' | 'outbound_click'
  | 'contact_sent' | 'newsletter_signup';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private http = inject(HttpClient);

  track(type: AnalyticsEventType, data: { resource?: string; resourceId?: string; path?: string } = {}) {
    this.http.post('/api/analytics', { type, ...data }).subscribe({ error: () => undefined });
  }
}
