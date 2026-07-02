import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap, catchError, of } from 'rxjs';
import { AuthResponse, User } from '../interfaces/auth.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = '/api/auth';
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';

  // Angular 17+ Signals for reactive state
  private _user = signal<User | null>(null);
  private _token = signal<string | null>(null);

  currentUser = computed(() => this._user());
  isAuthenticated = computed(() => !!this._token());

  constructor(private http: HttpClient, private router: Router) {
    this.loadStorage();
  }

  login(email: string, pass: string) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password: pass }).pipe(
      tap(res => this.setSession(res)),
      catchError(err => {
        console.error('Login failed', err);
        throw err;
      })
    );
  }

  logout() {
    this.clearSession();
    this.router.navigate(['/login']);
  }

  private setSession(authRes: AuthResponse) {
    localStorage.setItem(this.TOKEN_KEY, authRes.access_token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(authRes.user));
    this._token.set(authRes.access_token);
    this._user.set(authRes.user);
  }

  private clearSession() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this._token.set(null);
    this._user.set(null);
  }

  private loadStorage() {
    const token = localStorage.getItem(this.TOKEN_KEY);
    const userJson = localStorage.getItem(this.USER_KEY);
    
    if (token && userJson) {
      this._token.set(token);
      this._user.set(JSON.parse(userJson));
    }
  }

  getToken() {
    return this._token();
  }
}
