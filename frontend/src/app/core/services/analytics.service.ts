import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export type AnalyticsEventType =
  | 'page_view' | 'project_view' | 'cv_view' | 'outbound_click'
  | 'contact_sent' | 'newsletter_signup';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private http = inject(HttpClient);
  private outboundTrackingBound = false;

  track(type: AnalyticsEventType, data: { resource?: string; resourceId?: string; path?: string } = {}) {
    if (typeof window === 'undefined' || navigator.doNotTrack === '1') return;
    const path = (data.path || window.location.pathname).split(/[?#]/)[0];
    if (path.startsWith('/admin')) return;
    this.http.post('/api/analytics', {
      type,
      ...data,
      path,
      visitorId: this.identifier(localStorage, 'portfolio_visitor_id'),
      sessionId: this.identifier(sessionStorage, 'portfolio_session_id'),
      referrer: document.referrer?.slice(0, 300) || undefined,
      device: window.innerWidth < 640 ? 'mobile' : window.innerWidth < 1024 ? 'tablet' : 'desktop',
    }).subscribe({ error: () => undefined });
  }

  bindOutboundTracking() {
    if (typeof document === 'undefined' || this.outboundTrackingBound) return;
    this.outboundTrackingBound = true;
    document.addEventListener('click', event => {
      const anchor = (event.target as HTMLElement | null)?.closest('a[href]') as HTMLAnchorElement | null;
      if (!anchor) return;
      const href = anchor.getAttribute('href') || '';
      if (href.startsWith('mailto:')) {
        this.track('outbound_click', { resource: 'email', resourceId: 'mailto', path: location.pathname });
        return;
      }
      try {
        const target = new URL(anchor.href, location.origin);
        if (target.origin !== location.origin) {
          this.track('outbound_click', { resource: 'external_link', resourceId: target.hostname.slice(0, 120), path: location.pathname });
        }
      } catch {
        return;
      }
    }, { passive: true });
  }

  private identifier(storage: Storage, key: string) {
    try {
      const existing = storage.getItem(key);
      if (existing) return existing;
      const value = crypto.randomUUID();
      storage.setItem(key, value);
      return value;
    } catch {
      return undefined;
    }
  }
}
