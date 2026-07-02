import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseCrudService } from './base-crud.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

export interface Education {
  id: number;
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  description?: string;
  order: number;
}

@Injectable({
  providedIn: 'root'
})
export class EducationService extends BaseCrudService<Education> {
  protected override endpoint = 'education';

  constructor(http: HttpClient) {
    super(http);
  }

  override getAll(): Observable<Education[]> {
    return this.http
      .get<{ items: Education[] }>(`${this.baseUrl}/${this.endpoint}?limit=100&sortBy=order&sortOrder=asc`)
      .pipe(map(response => response.items));
  }
}
