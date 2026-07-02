import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseCrudService } from './base-crud.service';

export interface Experience {
  id: number;
  company: string;
  position: string;
  positionEn?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  descriptionEn?: string;
  skills: string[];
  order: number;
}

@Injectable({
  providedIn: 'root'
})
export class ExperienceService extends BaseCrudService<Experience> {
  protected override endpoint = 'experience';

  constructor(http: HttpClient) {
    super(http);
  }

  override getAll(): Observable<Experience[]> {
    return this.http
      .get<{ items: Experience[]; meta: any }>(`${this.baseUrl}/${this.endpoint}?limit=100&sortBy=startDate&sortOrder=desc`)
      .pipe(map(res => res.items));
  }
}
