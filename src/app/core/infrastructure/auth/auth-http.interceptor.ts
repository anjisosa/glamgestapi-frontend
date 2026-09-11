import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthFacade } from '../../application/auth/auth.facade';

export const authHttpInterceptor: HttpInterceptorFn = (request, next) => {
  const authFacade = inject(AuthFacade);
  const isPublicEndpoint = request.url.endsWith('/login')
    || request.url.endsWith('/register')
    || request.url.endsWith('/refresh')
    || request.url.endsWith('/forgot-password');

  const token = authFacade.getAccessToken();
  if (!token || isPublicEndpoint) {
    return next(request);
  }

  return next(request.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })).pipe(
    catchError(error => {
      if (error.status !== 401) {
        return throwError(() => error);
      }

      return authFacade.refresh().pipe(
        switchMap(response => next(request.clone({
          setHeaders: {
            Authorization: `Bearer ${response.token}`,
            'Content-Type': 'application/json'
          }
        }))),
        catchError(refreshError => {
          authFacade.clearSession();
          return throwError(() => refreshError);
        })
      );
    })
  );
};
