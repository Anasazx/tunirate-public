import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { emailVerificationGuard } from './email-verification.guard';

describe('emailVerificationGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => emailVerificationGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
