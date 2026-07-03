import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseCrudService } from './base-crud.service';

export interface Project {
  id: number;
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  imageUrl?: string;
  link?: string;
  github?: string;
  tags: string[];
  featured: boolean;
  published: boolean;
  order: number;
  accent?: string;
  slug?: string;
  gallery?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class ProjectService extends BaseCrudService<Project> {
  protected override endpoint = 'projects';

  constructor(http: HttpClient) {
    super(http);
  }

  getBySlug(slug: string) {
    return this.http.get<Project>(`${this.baseUrl}/${this.endpoint}/slug/${slug}`);
  }
}
