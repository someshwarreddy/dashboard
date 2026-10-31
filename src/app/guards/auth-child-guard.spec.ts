import { TestBed } from '@angular/core/testing';
import { CanActivateChildFn } from '@angular/router';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { authChildGuard } from './auth-child-guard';

describe('authChildGuard', () => {
  const executeGuard: CanActivateChildFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => authChildGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
   it('1. should prevent navigation to a child route', () => {

    const childRoute = {
      routeConfig: {
        path: 'reports'
      }
    } as ActivatedRouteSnapshot;

    const state = {
      url: '/dashboard/reports'
    } as RouterStateSnapshot;

    const result = TestBed.runInInjectionContext(() =>
      authChildGuard(childRoute, state)
    );

    expect(result).toBe(false);
  });
});
