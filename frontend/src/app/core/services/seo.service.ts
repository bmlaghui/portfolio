import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

export interface SeoPage {
  title: string;
  description: string;
  image?: string;
  type?: 'website' | 'article';
  path?: string;
}

@Injectable({ providedIn: 'root' })
export class SeoService {
  private title = inject(Title);
  private meta = inject(Meta);
  private document = inject(DOCUMENT);

  setPage(page: SeoPage) {
    const origin = this.document.location?.origin || 'https://mlaghuibrahim.com';
    const url = `${origin}${page.path || this.document.location?.pathname || '/'}`;
    const image = page.image ? new URL(page.image, origin).toString() : `${origin}/bm-mark.svg`;

    this.title.setTitle(page.title);
    [
      ['name', 'description', page.description],
      ['property', 'og:title', page.title],
      ['property', 'og:description', page.description],
      ['property', 'og:type', page.type || 'website'],
      ['property', 'og:url', url],
      ['property', 'og:image', image],
      ['name', 'twitter:card', 'summary_large_image'],
      ['name', 'twitter:title', page.title],
      ['name', 'twitter:description', page.description],
      ['name', 'twitter:image', image],
    ].forEach(([kind, key, content]) =>
      this.meta.updateTag({ [kind]: key, content }, `${kind}="${key}"`)
    );

    let canonical = this.document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = this.document.createElement('link');
      canonical.rel = 'canonical';
      this.document.head.appendChild(canonical);
    }
    canonical.href = url;
  }
}
