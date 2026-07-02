import { Injectable, signal, inject } from '@angular/core';
import { StatsApiService } from './admin-api.services';

@Injectable({ providedIn: 'root' })
export class MessagingStateService {
  private statsApi = inject(StatsApiService);
  unreadCount = signal(0);

  refresh() {
    this.statsApi.getStats().subscribe(stats => {
      this.unreadCount.set(stats.unreadMessages);
    });
  }
}
