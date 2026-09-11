import { Injectable } from '@angular/core';
import { ApiError } from '../../domain/auth/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthErrorMapper {
  mapError(error: ApiError, activeView: 'login' | 'register' | 'forgot' | 'dashboard', defaultMessage = ''): string {
    const message = error.validationErrors
      ? Object.values(error.validationErrors).map(value => this.translateError(value)).join(' ')
      : this.translateError(error.message, error.error, error.status, defaultMessage);

    if (activeView === 'register' && error.validationErrors) {
      return Object.values(error.validationErrors)
        .map(value => this.translateError(value))
        .join(' ');
    }

    return message;
  }

  registerFieldMessage(field: string): string {
    if (field === 'password') return 'Usa entre 8 y 72 caracteres, con mayúscula, minúscula, número y carácter especial.';
    if (field === 'username') return 'Usa entre 3 y 50 caracteres: letras, números, punto, guion o guion bajo.';
    if (field === 'email') return 'Introduce un correo electrónico válido.';
    return 'Este campo es obligatorio.';
  }

  translateError(message = '', code = '', status = 0, fallback = 'Ha ocurrido un error inesperado. Inténtalo de nuevo.'): string {
    const normalized = `${code} ${message}`.toLowerCase();

    if (normalized.includes('invalid_credentials') || normalized.includes('invalid credentials') || status === 401) {
      return 'El usuario o la contraseña no son correctos.';
    }
    if (normalized.includes('user_already_exists') || normalized.includes('already exists')) {
      return 'El usuario o el correo electrónico ya están registrados.';
    }
    if (normalized.includes('validation_error') || normalized.includes('validation failed')) {
      return 'Revisa los datos introducidos e inténtalo de nuevo.';
    }
    if (status === 0) {
      return 'No se pudo conectar con el servidor. Comprueba que la API esté activa.';
    }

    return message || fallback;
  }
}
