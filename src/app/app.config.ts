import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { AuthRepository } from './core/domain/auth/auth.repository';
import { AuthApiRepository } from './core/infrastructure/auth/auth-api.repository';
import { authHttpInterceptor } from './core/infrastructure/auth/auth-http.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(withInterceptors([authHttpInterceptor])),
    { provide: AuthRepository, useClass: AuthApiRepository }
  ]
};
