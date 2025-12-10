import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environment.stage';
import { LoginRequest, LoginResponse } from '../models/login.model';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/api/v1/auth/login`;
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  login(params: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}`, params).pipe(
      tap({
        next: (response) => {
          this.handleLoginSuccess(response);
        },
        error: (error) => {
          this.handleLoginError(error);
          throw error;
        },
      })
    );
  }

  private handleLoginSuccess(response: LoginResponse): void {
    localStorage.setItem('accessToken', response.accessToken);
    localStorage.setItem('userEmail', response.email);
    localStorage.setItem('userType', response.type);

    this.router.navigate(['/']);
  }

  private handleLoginError(error: any): void {
    console.error('Login failed:', error);
    this.clearAuthData();
  }

  logout(): void {
    this.clearAuthData();
    this.router.navigate(['/login']);
  }

  private clearAuthData(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userType');
  }

  getToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token; // Returns true if token exists
  }
}
