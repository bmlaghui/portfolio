import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { AuthTokens, AdminUser } from '../interfaces/admin.interfaces';

const API = '/api';

@Injectable({ providedIn: 'root' })
export class AdminAuthService {
  private _token = signal<string | null>(
    typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null
  );
  private _user = signal<AdminUser | null>(
    typeof window !== 'undefined' 
      ? JSON.parse(localStorage.getItem('admin_user') || 'null')
      : null
  );

  isAuthenticated = computed(() => !!this._token());
  currentUser = computed(() => this._user());
  token = computed(() => this._token());

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string) {
    return this.http.post<AuthTokens>(`${API}/auth/login`, { email, password }).pipe(
      tap(res => {
        localStorage.setItem('admin_token', res.accessToken);
        localStorage.setItem('admin_refresh', res.refreshToken);
        localStorage.setItem('admin_user', JSON.stringify(res.user));
        this._token.set(res.accessToken);
        this._user.set(res.user);
      })
    );
  }

  logout() {
    this.http.post(`${API}/auth/logout`, {}).subscribe({
      complete: () => this.clearSession(),
      error: () => this.clearSession(),
    });
  }

  private clearSession() {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_refresh');
    localStorage.removeItem('admin_user');
    this._token.set(null);
    this._user.set(null);
    this.router.navigate(['/admin/login']);
  }
}
