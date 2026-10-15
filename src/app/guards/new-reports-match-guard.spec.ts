import { TestBed } from '@angular/core/testing';
import { CanMatchFn } from '@angular/router';

import { newReportsMatchGuard } from './new-reports-match-guard';

describe('newReportsMatchGuard', () => {
  const executeGuard: CanMatchFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => newReportsMatchGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
