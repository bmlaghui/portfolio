import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Profile {
  id: number;
  name: string;
  title: string;
  titleEn?: string;
  bio: string;
  bioEn?: string;
  email?: string;
  phone?: string;
  location?: string;
  website?: string;
  github?: string;
  linkedin?: string;
  avatarUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private readonly baseUrl = '/api';

  constructor(private http: HttpClient) {}

  get(): Observable<Profile> {
    return this.http.get<Profile>(`${this.baseUrl}/profile`);
  }
}
