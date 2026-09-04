import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, finalize, map, throwError } from 'rxjs';

export interface UserProfile {
  userId: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt?: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: UserProfile;
}

export interface ApiError {
  status: number;
  message: string;
  error?: string;
  validationErrors?: Record<string, string> | null;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/auth';
  private readonly storageKey = 'glamgest.auth';

  login(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { username, password }).pipe(
      map(response => this.saveSession(response)),
      catchError(error => this.handleError(error))
    );
  }

  register(data: { firstName: string; lastName: string; username: string; email: string; password: string }): Observable<UserProfile> {
    return this.http.post<UserProfile>(`${this.apiUrl}/register`, data).pipe(
      catchError(error => this.handleError(error))
    );
  }

  profile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/profile`).pipe(
      catchError(error => this.handleError(error))
    );
  }

  refresh(): Observable<AuthResponse> {
    const session = this.readSession();
    if (!session?.refreshToken) {
      return throwError(() => this.toApiError('No hay refresh token disponible', 401));
    }
    return this.http.post<AuthResponse>(`${this.apiUrl}/refresh`, { refreshToken: session.refreshToken }).pipe(
      map(response => this.saveSession(response)),
      catchError(error => this.handleError(error))
    );
  }

  forgotPassword(email: string): Observable<{ message: string; success: boolean }> {
    return this.http.post<{ message: string; success: boolean }>(`${this.apiUrl}/forgot-password`, { email }).pipe(
      catchError(error => this.handleError(error))
    );
  }

  logout(): Observable<unknown> {
    return this.http.post(`${this.apiUrl}/logout`, {}).pipe(
      catchError(error => this.handleError(error)),
      finalize(() => this.clearSession())
    );
  }

  getAccessToken(): string | null {
    return this.readSession()?.token ?? null;
  }

  clearSession(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(this.storageKey);
    }
  }

  private saveSession(response: AuthResponse): AuthResponse {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.storageKey, JSON.stringify({ token: response.token, refreshToken: response.refreshToken }));
    }
    return response;
  }

  private readSession(): { token: string; refreshToken: string } | null {
    if (typeof localStorage === 'undefined') {
      return null;
    }
    const rawSession = localStorage.getItem(this.storageKey);
    if (!rawSession) {
      return null;
    }
    try {
      return JSON.parse(rawSession) as { token: string; refreshToken: string };
    } catch {
      this.clearSession();
      return null;
    }
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    const apiError = error.error && typeof error.error === 'object'
      ? error.error as ApiError
      : this.toApiError('No se pudo conectar con el servidor', error.status);
    return throwError(() => apiError);
  }

  private toApiError(message: string, status: number): ApiError {
    return { status, message };
  }
}
