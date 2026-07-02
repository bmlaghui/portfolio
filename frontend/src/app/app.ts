import { Component, inject } from '@angular/core';
import { Router, RouterOutlet, ChildrenOutletContexts, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { pageTransitions } from './animations';

import { ToastContainerComponent } from './core/components/toast-container/toast-container.component';
import { GlobalSearchComponent } from './core/components/global-search/global-search';
import { AnalyticsService } from './core/services/analytics.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastContainerComponent, GlobalSearchComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  animations: [pageTransitions]
})
export class App {
  private contexts = inject(ChildrenOutletContexts);
  private router = inject(Router);
  private analytics = inject(AnalyticsService);
  prepareRoute() {
    const ctx: any = this.contexts.getContext('primary');
    return ctx?.route?.snapshot?.data?.['animation'];
  }

  constructor() {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(event => {
      this.analytics.track('page_view', { path: event.urlAfterRedirects });
    });
    if (typeof window !== 'undefined') {
      const observer = typeof IntersectionObserver !== 'undefined' ? new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 }) : null;

      const observeCards = () => {
        document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
          if (!el.classList.contains('active')) {
            if (observer) observer.observe(el);
            else el.classList.add('active');
          }
        });
      };

      observeCards();
      if (typeof MutationObserver !== 'undefined') {
        new MutationObserver(observeCards).observe(document.body, {
          childList: true,
          subtree: true,
        });
      }

      // Custom Cursor Logic
      const cursor = document.getElementById('custom-cursor');
      const follower = document.getElementById('custom-cursor-follower');

      let mouseX = 0, mouseY = 0, followerX = 0, followerY = 0;

      document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (cursor) {
          cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
        }
      });

      const loop = () => {
        followerX += (mouseX - followerX) * 0.15;
        followerY += (mouseY - followerY) * 0.15;
        if (follower) {
          follower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0)`;
        }
        requestAnimationFrame(loop);
      };
      loop();
    }
  }
}
