import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseCrudService } from './base-crud.service';
import { Observable } from 'rxjs';

export interface Education {
  id: number;
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  description?: string;
  certificateUrl?: string;
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
    return this.http.get<Education[]>(`${this.baseUrl}/${this.endpoint}?limit=100&sortBy=order&sortOrder=asc`);
  }
}
