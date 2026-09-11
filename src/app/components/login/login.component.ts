import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthErrorMapper } from '../../core/application/auth/auth-error-mapper';
import { AuthFacade } from '../../core/application/auth/auth.facade';
import { ApiError, RegisterRequest, UserProfile } from '../../core/domain/auth/auth.model';

type AuthView = 'login' | 'register' | 'forgot' | 'dashboard';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  private readonly authFacade = inject(AuthFacade);
  private readonly authErrorMapper = inject(AuthErrorMapper);
  private readonly router = inject(Router);

  activeView: AuthView = 'login';
  showPassword = false;
  loading = false;
  feedback = '';
  errorMessage = '';
  currentUser: UserProfile | null = null;
  registerErrors: Record<string, string> = {};

  login = { username: '', password: '', remember: false };
  register = { firstName: '', lastName: '', username: '', email: '', password: '' };
  email = '';

  setView(view: AuthView): void {
    this.activeView = view;
    this.feedback = '';
    this.errorMessage = '';
    this.registerErrors = {};
    this.showPassword = false;
  }

  submit(form: NgForm): void {
    this.feedback = '';
    this.errorMessage = '';

    if (form.invalid) {
      this.errorMessage = 'Revisa los campos obligatorios antes de continuar.';
      if (this.activeView === 'register') {
        for (const field of ['firstName', 'lastName', 'registerUsername', 'registerEmail', 'registerPassword']) {
          if (form.controls[field]?.invalid) {
            const fieldName = field.replace('register', '').replace(/^./, character => character.toLowerCase());
            this.registerErrors[fieldName] = this.authErrorMapper.registerFieldMessage(fieldName);
          }
        }
      }
      return;
    }

    this.loading = true;

    if (this.activeView === 'login') {
      this.authFacade.login(this.login.username, this.login.password).subscribe({
        next: response => {
          this.loading = false;
          this.currentUser = response.user;
          const route = this.getDashboardRoute(response.user.role);
          this.router.navigateByUrl(route);
        },
        error: error => this.showError(error)
      });
      return;
    }

    if (this.activeView === 'register') {
      const registerRequest: RegisterRequest = { ...this.register };
      this.authFacade.register(registerRequest).subscribe({
        next: () => {
          this.loading = false;
          this.setView('login');
          this.feedback = 'Cuenta creada. Ya puedes iniciar sesión.';
        },
        error: error => this.showError(error)
      });
      return;
    }

    this.authFacade.forgotPassword(this.email).subscribe({
      next: response => {
        this.loading = false;
        this.feedback = response.message;
      },
      error: error => this.showError(error)
    });
  }

  logout(): void {
    this.loading = true;
    this.authFacade.logout().subscribe({
      next: () => this.finishLogout(),
      error: () => this.finishLogout()
    });
  }

  getDashboardRoute(role: string | null | undefined): string {
    const normalizedRole = (role ?? '').trim().toUpperCase();

    if (normalizedRole.includes('ADMIN')) {
      return '/admin';
    }

    if (normalizedRole.includes('CLIENT') || normalizedRole.includes('CLIENTE')) {
      return '/cliente';
    }

    return '/cliente';
  }

  private finishLogout(): void {
    this.loading = false;
    this.currentUser = null;
    this.activeView = 'login';
    this.feedback = 'Sesión cerrada correctamente.';
    this.router.navigateByUrl('/login');
  }

  private showError(error: ApiError): void {
    this.loading = false;

    if (this.activeView === 'register' && error.status === 409) {
      const message = error.message || '';
      if (message.toLowerCase().includes('correo') || message.toLowerCase().includes('email')) {
        this.registerErrors['email'] = message;
      } else {
        this.registerErrors['username'] = message;
      }
      return;
    }

    if (this.activeView === 'register' && error.validationErrors) {
      this.registerErrors = Object.fromEntries(
        Object.entries(error.validationErrors).map(([field, message]) => [field, this.authErrorMapper.translateError(message)])
      );
      return;
    }

    this.errorMessage = this.authErrorMapper.mapError(error, this.activeView);
  }
}
