import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthErrorMapper } from './auth-error-mapper';
import { AuthFacade } from './auth.facade';

describe('AuthFacade', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthFacade]
    });
  });

  it('should be created', () => {
    const service = TestBed.inject(AuthFacade);
    expect(service).toBeTruthy();
  });
});

describe('AuthErrorMapper', () => {
  it('should return a specific invalid user message', () => {
    const mapper = new AuthErrorMapper();

    expect(mapper.translateError('Usuario no encontrado', 'USER_NOT_FOUND', 401)).toBe('Usuario incorrecto.');
  });

  it('should return a specific invalid password message', () => {
    const mapper = new AuthErrorMapper();

    expect(mapper.translateError('Contraseña incorrecta', 'INVALID_PASSWORD', 401)).toBe('Contraseña incorrecta.');
  });

  it('should return invalid password when backend sends an invalid password code', () => {
    const mapper = new AuthErrorMapper();

    expect(mapper.translateError('Contraseña incorrecta', 'INVALID_PASSWORD', 401)).toBe('Contraseña incorrecta.');
  });
});
