import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  Project, Experience, Skill, Profile, ContactMessage, 
  DashboardStats, BlogPost, PaginatedResponse, QueryOptions, Education 
} from '../interfaces/admin.interfaces';

@Injectable({ providedIn: 'root' })
export class AdminApiService {
  protected http = inject(HttpClient);
  protected baseUrl = '/api';

  protected getParams(options?: QueryOptions): HttpParams {
    let params = new HttpParams();
    if (options) {
      if (options.page !== undefined && options.page !== null) params = params.set('page', options.page.toString());
      if (options.limit !== undefined && options.limit !== null) params = params.set('limit', options.limit.toString());
      if (options.search) params = params.set('search', options.search);
      if (options.sortBy) params = params.set('sortBy', options.sortBy);
      if (options.sortOrder) params = params.set('sortOrder', options.sortOrder);
    }
    return params;
  }
}

@Injectable({ providedIn: 'root' })
export class ProjectsApiService extends AdminApiService {
  getAll(options?: QueryOptions): Observable<PaginatedResponse<Project>> {
    return this.http.get<PaginatedResponse<Project>>(`${this.baseUrl}/projects/admin/all`, { params: this.getParams(options) });
  }
  getOne(id: number): Observable<Project> { return this.http.get<Project>(`${this.baseUrl}/projects/${id}`); }
  create(data: Project): Observable<Project> { return this.http.post<Project>(`${this.baseUrl}/projects`, data); }
  update(id: number, data: Partial<Project>): Observable<Project> { return this.http.patch<Project>(`${this.baseUrl}/projects/${id}`, data); }
  delete(id: number): Observable<any> { return this.http.delete(`${this.baseUrl}/projects/${id}`); }
  reorder(ids: number[]) { return this.http.patch(`${this.baseUrl}/projects/reorder`, { ids }); }
}

@Injectable({ providedIn: 'root' })
export class ExperienceApiService extends AdminApiService {
  getAll(options?: QueryOptions): Observable<PaginatedResponse<Experience>> {
    return this.http.get<PaginatedResponse<Experience>>(`${this.baseUrl}/experience`, { params: this.getParams(options) });
  }
  create(data: Experience): Observable<Experience> { return this.http.post<Experience>(`${this.baseUrl}/experience`, data); }
  update(id: number, data: Partial<Experience>): Observable<Experience> { return this.http.patch<Experience>(`${this.baseUrl}/experience/${id}`, data); }
  delete(id: number): Observable<any> { return this.http.delete(`${this.baseUrl}/experience/${id}`); }
}

@Injectable({ providedIn: 'root' })
export class SkillsApiService extends AdminApiService {
  getAll(options?: QueryOptions): Observable<PaginatedResponse<Skill>> {
    return this.http.get<PaginatedResponse<Skill>>(`${this.baseUrl}/skills`, { params: this.getParams(options) });
  }
  create(data: Skill): Observable<Skill> { return this.http.post<Skill>(`${this.baseUrl}/skills`, data); }
  update(id: number, data: Partial<Skill>): Observable<Skill> { return this.http.patch<Skill>(`${this.baseUrl}/skills/${id}`, data); }
  delete(id: number): Observable<any> { return this.http.delete(`${this.baseUrl}/skills/${id}`); }
}

@Injectable({ providedIn: 'root' })
export class ContactApiService extends AdminApiService {
  getAll(options?: QueryOptions): Observable<PaginatedResponse<ContactMessage>> {
    return this.http.get<PaginatedResponse<ContactMessage>>(`${this.baseUrl}/contact`, { params: this.getParams(options) });
  }
  markRead(id: number): Observable<ContactMessage> { return this.http.patch<ContactMessage>(`${this.baseUrl}/contact/${id}/read`, {}); }
  delete(id: number): Observable<any> { return this.http.delete(`${this.baseUrl}/contact/${id}`); }
}

@Injectable({ providedIn: 'root' })
export class ProfileApiService extends AdminApiService {
  get(): Observable<Profile> { return this.http.get<Profile>(`${this.baseUrl}/profile`); }
  update(data: Profile): Observable<Profile> { return this.http.patch<Profile>(`${this.baseUrl}/profile`, data); }
}

@Injectable({ providedIn: 'root' })
export class BlogApiService extends AdminApiService {
  getAll(options?: QueryOptions): Observable<PaginatedResponse<BlogPost>> {
    return this.http.get<PaginatedResponse<BlogPost>>(`${this.baseUrl}/blog/admin/all`, { params: this.getParams(options) });
  }
  getOne(id: number): Observable<BlogPost> { return this.http.get<BlogPost>(`${this.baseUrl}/blog/${id}`); }
  create(data: BlogPost): Observable<BlogPost> { return this.http.post<BlogPost>(`${this.baseUrl}/blog`, data); }
  update(id: number, data: Partial<BlogPost>): Observable<BlogPost> { return this.http.patch<BlogPost>(`${this.baseUrl}/blog/${id}`, data); }
  delete(id: number): Observable<any> { return this.http.delete(`${this.baseUrl}/blog/${id}`); }
}

@Injectable({ providedIn: 'root' })
export class EducationApiService extends AdminApiService {
  getAll(options?: QueryOptions): Observable<Education[]> {
    return this.http.get<Education[]>(`${this.baseUrl}/education`, { params: this.getParams(options) });
  }
  create(data: Education): Observable<Education> { return this.http.post<Education>(`${this.baseUrl}/education`, data); }
  update(id: number, data: Partial<Education>): Observable<Education> { return this.http.patch<Education>(`${this.baseUrl}/education/${id}`, data); }
  delete(id: number): Observable<any> { return this.http.delete(`${this.baseUrl}/education/${id}`); }
}

@Injectable({ providedIn: 'root' })
export class StatsApiService extends AdminApiService {
  getStats(): Observable<DashboardStats> { return this.http.get<DashboardStats>(`${this.baseUrl}/admin/stats`); }
}
