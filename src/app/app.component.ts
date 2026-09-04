import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { AuthService, ApiError, UserProfile } from './auth.service';

type AuthView = 'login' | 'register' | 'forgot' | 'dashboard';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  private readonly authService = inject(AuthService);
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
            this.registerErrors[fieldName] = this.localRegisterError(fieldName);
          }
        }
      }
      return;
    }

    this.loading = true;
    if (this.activeView === 'login') {
      this.authService.login(this.login.username, this.login.password).subscribe({
        next: response => {
          this.loading = false;
          this.currentUser = response.user;
          this.activeView = 'dashboard';
        },
        error: error => this.showError(error)
      });
    } else if (this.activeView === 'register') {
      this.authService.register(this.register).subscribe({
        next: () => {
          this.loading = false;
          this.setView('login');
          this.feedback = 'Cuenta creada. Ya puedes iniciar sesión.';
        },
        error: error => this.showError(error)
      });
    } else {
      this.authService.forgotPassword(this.email).subscribe({
        next: response => { this.loading = false; this.feedback = response.message; },
        error: error => this.showError(error)
      });
    }
  }

  logout(): void {
    this.loading = true;
    this.authService.logout().subscribe({
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
      this.registerErrors = { ...error.validationErrors };
      return;
    }
    this.errorMessage = error.validationErrors
      ? Object.values(error.validationErrors).join(' ')
      : error.message || 'Ha ocurrido un error inesperado.';
  }

  private localRegisterError(field: string): string {
    if (field === 'password') return 'Usa entre 8 y 72 caracteres, con mayúscula, minúscula, número y carácter especial.';
    if (field === 'username') return 'Usa entre 3 y 50 caracteres: letras, números, punto, guion o guion bajo.';
    if (field === 'email') return 'Introduce un correo electrónico válido.';
    return 'Este campo es obligatorio.';
  }
}
