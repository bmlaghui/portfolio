import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseCrudService } from './base-crud.service';

export interface Skill {
  id: number;
  name: string;
  category: string;
  icon?: string;
  level: number;
  order: number;
}

@Injectable({
  providedIn: 'root'
})
export class SkillsService extends BaseCrudService<Skill> {
  protected override endpoint = 'skills';

  constructor(http: HttpClient) {
    super(http);
  }

  override getAll(): Observable<Skill[]> {
    return this.http
      .get<{ items: Skill[]; meta: any }>(`${this.baseUrl}/${this.endpoint}?limit=100`)
      .pipe(map(res => res.items));
  }
}
