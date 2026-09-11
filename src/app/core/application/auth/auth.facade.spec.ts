import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
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
