import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseCrudService } from './base-crud.service';
import { Observable } from 'rxjs';

export interface BlogPost {
  id: number;
  title: string;
  titleEn?: string;
  slug: string;
  summary: string;
  summaryEn?: string;
  content: string;
  contentEn?: string;
  imageUrl?: string;
  tags: string[];
  featured: boolean;
  readTime?: number;
  published: boolean;
  blocks?: any[];
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class BlogService extends BaseCrudService<BlogPost> {
  protected override endpoint = 'blog';

  constructor(http: HttpClient) {
    super(http);
  }

  getBySlug(slug: string): Observable<BlogPost> {
    return this.http.get<BlogPost>(`${this.baseUrl}/${this.endpoint}/${slug}`);
  }
}
