import { TestBed } from '@angular/core/testing';
import { PartialMatchRouteSnapshot, Route, Router, UrlSegment, UrlTree, provideRouter } from '@angular/router';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { firstValueFrom, isObservable, Observable, timeout, TimeoutError } from 'rxjs';

import { adminMatchGuard } from './admin-match-guard';
import {
  selectAuthInitialized,
  selectUser
} from '../store/auth.selectors';
import { User } from '../models/product';


describe('adminMatchGuard', () => {
  let store: MockStore;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore(),
        provideRouter([])
      ]
    });

    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);
  });

  it('1. should allow navigation for an admin user', async () => {
    store.overrideSelector(selectAuthInitialized, true);

    store.overrideSelector(selectUser, {
      _id: '1',
      id: 1,
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'admin'
    } as User);

    store.refreshState();

    const result = await firstValueFrom(
      TestBed.runInInjectionContext(() =>
        adminMatchGuard(
           {} as Route,
      [] as UrlSegment[],
      {} as PartialMatchRouteSnapshot
        ) as Observable<boolean | UrlTree>
      )
    );

    expect(result).toBe(true);
  });
  it('2. should redirect non-admin users to unauthorized page', async () => {
    store.overrideSelector(selectAuthInitialized, true);

    store.overrideSelector(selectUser, {
      _id: '2',
      id: 2,
      name: 'Normal User',
      email: 'user@example.com',
      role: 'user'
    } as User);

    store.refreshState();

    const guardResult = TestBed.runInInjectionContext(() =>
      adminMatchGuard(
        {} as Route,
        [] as UrlSegment[],
        {} as PartialMatchRouteSnapshot
      )
    );

    const result = isObservable(guardResult)
      ? await firstValueFrom(guardResult)
      : await guardResult;
    expect(result).toBeInstanceOf(UrlTree);

    expect(router.serializeUrl(result as UrlTree))
      .toBe('/unauthorized');
  });
  it('3. should redirect unauthenticated users to login', async () => {
  store.overrideSelector(selectAuthInitialized, true);
  store.overrideSelector(selectUser, null);
  store.refreshState();

  const guardResult = TestBed.runInInjectionContext(() =>
    adminMatchGuard(
      {} as Route,
      [] as UrlSegment[],
      {} as PartialMatchRouteSnapshot
    ) 
  );

  const result = isObservable(guardResult)
    ? await firstValueFrom(guardResult)
    : await guardResult;

  expect(result).toBeInstanceOf(UrlTree);

  expect(router.serializeUrl(result as UrlTree))
    .toBe('/login');
});
it('4. should wait until authentication is initialized', async () => {
  store.overrideSelector(selectAuthInitialized, false);

  store.overrideSelector(selectUser, {
    _id: '1',
    id: 1,
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin'
  } as User);

  store.refreshState();

  const guardResult = TestBed.runInInjectionContext(() =>
    adminMatchGuard(
      {} as Route,
      [] as UrlSegment[],
      {} as PartialMatchRouteSnapshot
    ) as Observable<boolean | UrlTree>
  );

  const resultPromise = firstValueFrom(
    guardResult 
  );

  store.overrideSelector(selectAuthInitialized, true);
  store.refreshState();

  const result = await resultPromise;

  expect(result).toBe(true);
});
it('5. should not emit a result if authentication is never initialized', async () => {
  store.overrideSelector(selectAuthInitialized, false);
  store.overrideSelector(selectUser, null);
  store.refreshState();

  const guardResult = TestBed.runInInjectionContext(() =>
    adminMatchGuard(
      {} as Route,
      [] as UrlSegment[],
      {} as PartialMatchRouteSnapshot
    )
  );

  const resultPromise = firstValueFrom(
    (guardResult as Observable<boolean | UrlTree>).pipe(
      timeout({ first: 100 })
    )
  );

  await expect(resultPromise).rejects.toBeInstanceOf(TimeoutError);
});
it('6. should not redirect an admin user', async () => {
  store.overrideSelector(selectAuthInitialized, true);

  store.overrideSelector(selectUser, {
    _id: '1',
   
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin'
  } as User);

  store.refreshState();

  const guardResult = TestBed.runInInjectionContext(() =>
    adminMatchGuard(
      {} as Route,
      [] as UrlSegment[],
      {} as PartialMatchRouteSnapshot
    )
  );

  const result = isObservable(guardResult)
    ? await firstValueFrom(guardResult)
    : await guardResult;

  expect(result).toBe(true);
  expect(result).not.toBeInstanceOf(UrlTree);
});
});