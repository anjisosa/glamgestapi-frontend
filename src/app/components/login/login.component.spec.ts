import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginComponent } from './login.component';
import { AuthFacade } from '../../core/application/auth/auth.facade';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    router = jasmine.createSpyObj('Router', ['navigateByUrl']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent, FormsModule],
      providers: [
        { provide: AuthFacade, useValue: jasmine.createSpyObj('AuthFacade', ['login', 'register', 'forgotPassword', 'logout']) },
        { provide: Router, useValue: router }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
  });

  it('should send admin users to the admin dashboard', () => {
    expect(component.getDashboardRoute('ADMIN')).toBe('/admin');
    expect(component.getDashboardRoute('ROLE_ADMIN')).toBe('/admin');
  });

  it('should send client users to the client dashboard', () => {
    expect(component.getDashboardRoute('CLIENT')).toBe('/cliente');
    expect(component.getDashboardRoute('ROLE_CLIENT')).toBe('/cliente');
    expect(component.getDashboardRoute('cliente')).toBe('/cliente');
  });
});
