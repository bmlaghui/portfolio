import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { AdminUser, LoginResponse, MfaSetup } from '../interfaces/admin.interfaces';

const API = '/api';

@Injectable({ providedIn: 'root' })
export class AdminAuthService {
  private expiryTimer?: ReturnType<typeof setTimeout>;
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

  constructor(private http: HttpClient, private router: Router) {
    this.scheduleExpiry();
  }

  login(email: string, password: string, mfaCode?: string) {
    return this.http.post<LoginResponse>(`${API}/auth/login`, { email, password, mfaCode }).pipe(
      tap(res => {
        if (!('accessToken' in res)) return;
        localStorage.setItem('admin_token', res.accessToken);
        localStorage.setItem('admin_refresh', res.refreshToken);
        localStorage.setItem('admin_user', JSON.stringify(res.user));
        this._token.set(res.accessToken);
        this._user.set(res.user);
        this.scheduleExpiry();
      })
    );
  }

  logout() {
    if (!this.hasValidSession()) {
      this.clearSession();
      return;
    }
    this.http.post(`${API}/auth/logout`, {}).subscribe({
      complete: () => this.clearSession(),
      error: () => this.clearSession(),
    });
  }

  hasValidSession() {
    const token = this._token();
    return !!token && !this.isExpired(token);
  }

  expireSession() {
    this.clearSession(true);
  }

  getMe() {
    return this.http.get<AdminUser>(`${API}/auth/me`).pipe(
      tap(user => this.updateStoredUser(user)),
    );
  }

  updateAccount(data: { name: string; email: string; currentPassword?: string }) {
    return this.http.patch<AdminUser>(`${API}/auth/account`, data).pipe(
      tap(user => this.updateStoredUser(user)),
    );
  }

  changePassword(data: { currentPassword: string; newPassword: string }) {
    return this.http.patch<{ message: string }>(`${API}/auth/password`, data);
  }

  setupMfa(currentPassword: string) {
    return this.http.post<MfaSetup>(`${API}/auth/mfa/setup`, { currentPassword });
  }

  enableMfa(data: { currentPassword: string; secret: string; code: string }) {
    return this.http.post<{ enabled: true; recoveryCodes: string[] }>(`${API}/auth/mfa/enable`, data).pipe(
      tap(() => this.patchUser({ mfaEnabled: true })),
    );
  }

  disableMfa(data: { currentPassword: string; code: string }) {
    return this.http.post<{ enabled: false }>(`${API}/auth/mfa/disable`, data).pipe(
      tap(() => this.patchUser({ mfaEnabled: false })),
    );
  }

  private scheduleExpiry() {
    if (this.expiryTimer) clearTimeout(this.expiryTimer);
    const token = this._token();
    if (!token) return;
    const expiresAt = this.tokenExpiry(token);
    if (!expiresAt || expiresAt <= Date.now()) {
      queueMicrotask(() => this.expireSession());
      return;
    }
    this.expiryTimer = setTimeout(() => this.expireSession(), expiresAt - Date.now());
  }

  private tokenExpiry(token: string) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
      return typeof payload.exp === 'number' ? payload.exp * 1000 : 0;
    } catch {
      return 0;
    }
  }

  private isExpired(token: string) {
    const expiry = this.tokenExpiry(token);
    return !expiry || expiry <= Date.now();
  }

  private patchUser(patch: Partial<AdminUser>) {
    const current = this._user();
    if (current) this.updateStoredUser({ ...current, ...patch });
  }

  private updateStoredUser(user: AdminUser) {
    localStorage.setItem('admin_user', JSON.stringify(user));
    this._user.set(user);
  }

  private clearSession(expired = false) {
    if (this.expiryTimer) clearTimeout(this.expiryTimer);
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_refresh');
    localStorage.removeItem('admin_user');
    this._token.set(null);
    this._user.set(null);
    this.router.navigate(['/admin/login'], expired ? { queryParams: { session: 'expired' } } : undefined);
  }
}
