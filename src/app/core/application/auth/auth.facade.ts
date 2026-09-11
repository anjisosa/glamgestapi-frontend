import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthResponse, RegisterRequest, UserProfile } from '../../domain/auth/auth.model';
import { AuthRepository } from '../../domain/auth/auth.repository';

@Injectable({ providedIn: 'root' })
export class AuthFacade {
  constructor(private readonly authRepository: AuthRepository) {}

  login(username: string, password: string): Observable<AuthResponse> {
    return this.authRepository.login(username, password);
  }

  register(data: RegisterRequest): Observable<UserProfile> {
    return this.authRepository.register(data);
  }

  profile(): Observable<UserProfile> {
    return this.authRepository.profile();
  }

  refresh(): Observable<AuthResponse> {
    return this.authRepository.refresh();
  }

  forgotPassword(email: string): Observable<{ message: string; success: boolean }> {
    return this.authRepository.forgotPassword(email);
  }

  logout(): Observable<unknown> {
    return this.authRepository.logout();
  }

  getAccessToken(): string | null {
    return this.authRepository.getAccessToken();
  }

  clearSession(): void {
    this.authRepository.clearSession();
  }
}
