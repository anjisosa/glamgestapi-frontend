import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const authService = inject(AuthService);
  const isPublicEndpoint = request.url.endsWith('/login') || request.url.endsWith('/register') || request.url.endsWith('/refresh') || request.url.endsWith('/forgot-password');
  const token = authService.getAccessToken();
  if (!token || isPublicEndpoint) {
    return next(request);
  }
  return next(request.clone({ setHeaders: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } })).pipe(
    catchError(error => {
      if (error.status !== 401) {
        return throwError(() => error);
      }
      return authService.refresh().pipe(
        switchMap(response => next(request.clone({ setHeaders: { Authorization: `Bearer ${response.token}`, 'Content-Type': 'application/json' } }))),
        catchError(refreshError => {
          authService.clearSession();
          return throwError(() => refreshError);
        })
      );
    })
  );
};
