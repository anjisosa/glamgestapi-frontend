import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, finalize, map, throwError } from 'rxjs';
import { ApiError, AuthResponse, AuthSession, RegisterRequest, UserProfile } from '../../domain/auth/auth.model';
import { AuthRepository } from '../../domain/auth/auth.repository';

@Injectable({ providedIn: 'root' })
export class AuthApiRepository extends AuthRepository {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/auth';
  private readonly storageKey = 'glamgest.auth';

  login(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { username, password }).pipe(
      map(response => this.saveSession(response)),
      catchError(error => this.handleError(error))
    );
  }

  register(data: RegisterRequest): Observable<UserProfile> {
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

  toApiError(message: string, status: number): ApiError {
    return { status, message };
  }

  private saveSession(response: AuthResponse): AuthResponse {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.storageKey, JSON.stringify({ token: response.token, refreshToken: response.refreshToken }));
    }
    return response;
  }

  private readSession(): AuthSession | null {
    if (typeof localStorage === 'undefined') {
      return null;
    }

    const rawSession = localStorage.getItem(this.storageKey);
    if (!rawSession) {
      return null;
    }

    try {
      return JSON.parse(rawSession) as AuthSession;
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
}
