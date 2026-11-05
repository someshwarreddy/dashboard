import { TestBed } from '@angular/core/testing';
import { CanMatchFn, PartialMatchRouteSnapshot, Route, UrlSegment } from '@angular/router';

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
   it('1. should return true when new reports are enabled', () => {
    const result = newReportsMatchGuard(
      {} as Route,
      [] as UrlSegment[],
      {} as PartialMatchRouteSnapshot
    );

    expect(result).toBe(true);
  });
});
