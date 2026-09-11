import { Observable } from 'rxjs';
import { ApiError, AuthResponse, RegisterRequest, UserProfile } from './auth.model';

export abstract class AuthRepository {
  abstract login(username: string, password: string): Observable<AuthResponse>;
  abstract register(data: RegisterRequest): Observable<UserProfile>;
  abstract profile(): Observable<UserProfile>;
  abstract refresh(): Observable<AuthResponse>;
  abstract forgotPassword(email: string): Observable<{ message: string; success: boolean }>;
  abstract logout(): Observable<unknown>;
  abstract getAccessToken(): string | null;
  abstract clearSession(): void;
  abstract toApiError(message: string, status: number): ApiError;
}
