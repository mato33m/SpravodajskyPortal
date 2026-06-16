import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { User } from '../models/models';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private baseUrl = 'http://localhost:8080/api/auth';

  private _currentUser = signal<User | null>(null);
  currentUser = this._currentUser.asReadonly();

  constructor(private http: HttpClient) {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      try {
        this._currentUser.set(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }

  login(username: string, password: string) {
    return this.http.post<{ token: string; user: User }>(`${this.baseUrl}/login`, { username, password })
      .pipe(
        tap(response => {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
          this._currentUser.set(response.user);
        })
      );
  }

  register(username: string, password: string, firstName: string, lastName: string, email: string) {
    return this.http.post<{ token: string; user: User }>(`${this.baseUrl}/register`, {
      username, password, firstName, lastName, email
    }).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        this._currentUser.set(response.user);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this._currentUser.set(null);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    return this._currentUser()?.role === 'ADMIN';
  }

  isEditorOrAdmin(): boolean {
    const role = this._currentUser()?.role;
    return role === 'ADMIN' || role === 'EDITOR';
  }
}
