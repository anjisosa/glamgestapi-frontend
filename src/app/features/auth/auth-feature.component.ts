import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthErrorMapper } from '../../core/application/auth/auth-error-mapper';
import { AuthFacade } from '../../core/application/auth/auth.facade';
import { ApiError, RegisterRequest, UserProfile } from '../../core/domain/auth/auth.model';

type AuthView = 'login' | 'register' | 'forgot' | 'dashboard';

@Component({
  selector: 'app-auth-feature',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './auth-feature.component.html',
  styles: []
})
export class AuthFeatureComponent {
  private readonly authFacade = inject(AuthFacade);
  private readonly authErrorMapper = inject(AuthErrorMapper);

  title = 'Glamgest';
  activeView: AuthView = 'login';
  showPassword = false;
  submitted = false;
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
    this.submitted = false;
    this.feedback = '';
    this.errorMessage = '';
    this.registerErrors = {};
    this.showPassword = false;
  }

  submit(form: NgForm): void {
    this.submitted = true;
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
          this.activeView = 'dashboard';
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

  private finishLogout(): void {
    this.loading = false;
    this.currentUser = null;
    this.activeView = 'login';
    this.feedback = 'Sesión cerrada correctamente.';
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
