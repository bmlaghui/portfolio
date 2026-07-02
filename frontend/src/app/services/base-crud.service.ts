import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface ICrudService<T> {
  getAll(): Observable<T[]>;
  getById(id: number): Observable<T>;
  create(item: Partial<T>): Observable<T>;
  update(id: number, item: Partial<T>): Observable<T>;
  delete(id: number): Observable<void>;
}

@Injectable()
export abstract class BaseCrudService<T> implements ICrudService<T> {

  protected abstract endpoint: string;
  protected baseUrl = '/api';

  constructor(protected http: HttpClient) {}

  getAll(): Observable<T[]> {
    return this.http.get<T[]>(`${this.baseUrl}/${this.endpoint}`);
  }

  getById(id: number): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${this.endpoint}/${id}`);
  }

  create(item: Partial<T>): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/${this.endpoint}`, item);
  }

  update(id: number, item: Partial<T>): Observable<T> {
    return this.http.patch<T>(`${this.baseUrl}/${this.endpoint}/${id}`, item);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${this.endpoint}/${id}`);
  }
}
