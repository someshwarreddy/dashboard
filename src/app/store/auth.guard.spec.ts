import { TestBed } from '@angular/core/testing';
import { Router, UrlTree, provideRouter } from '@angular/router';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { authGuard } from './auth.guard';
import * as AuthSelectors from '../store/auth.selectors';
import { BehaviorSubject, firstValueFrom, Observable, timeout, TimeoutError } from 'rxjs';

describe('authGuard', () => {
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
  it('1. should allow navigation when the user is authenticated', async () => {
  store.overrideSelector(AuthSelectors.selectAuthInitialized, true);
  store.overrideSelector(AuthSelectors.selectIsAuthenticated, true);

  store.refreshState();

  const result = await firstValueFrom(
    TestBed.runInInjectionContext(() =>
      authGuard(
        {} as any,
        { url: '/products' } as any
      ) as Observable<boolean>
    )
  );

  expect(result).toBe(true);
});
it('2. should redirect unauthenticated users to login', async () => {
  store.overrideSelector(AuthSelectors.selectAuthInitialized, true);
  store.overrideSelector(AuthSelectors.selectIsAuthenticated, false);

  store.refreshState();

  const result = await firstValueFrom(
    TestBed.runInInjectionContext(() =>
      authGuard(
        {} as any,
        { url: '/products' } as any
      ) as Observable<boolean | UrlTree>
    )
  );

  expect(result).toBeInstanceOf(UrlTree);

  expect(router.serializeUrl(result as UrlTree))
    .toBe('/login?returnUrl=%2Fproducts');
});
it('3. should wait until authentication is initialized', async () => {
  store.overrideSelector(AuthSelectors.selectAuthInitialized, false);
  store.overrideSelector(AuthSelectors.selectIsAuthenticated, true);

  store.refreshState();

  const resultPromise = firstValueFrom(
    TestBed.runInInjectionContext(() =>
      authGuard(
        {} as any,
        { url: '/products' } as any
      ) as Observable<boolean | UrlTree>
    )
  );

  store.overrideSelector(AuthSelectors.selectAuthInitialized, true);
  store.refreshState();

  const result = await resultPromise;

  expect(result).toBe(true);
});
it('4. should not check authentication before initialization completes', async () => {
  store.overrideSelector(AuthSelectors.selectAuthInitialized, false);
  store.overrideSelector(AuthSelectors.selectIsAuthenticated, true);

  store.refreshState();

  const selectAuthSpy = vi.spyOn(store, 'select');

  const resultPromise = firstValueFrom(
    TestBed.runInInjectionContext(() =>
      authGuard(
        {} as any,
        { url: '/products' } as any
      ) as Observable<boolean | UrlTree>
    )
  );

  expect(selectAuthSpy)
    .toHaveBeenCalledWith(AuthSelectors.selectAuthInitialized);

  expect(selectAuthSpy)
    .not.toHaveBeenCalledWith(AuthSelectors.selectIsAuthenticated);

  store.overrideSelector(AuthSelectors.selectAuthInitialized, true);
  store.refreshState();

  const result = await resultPromise;

  expect(result).toBe(true);
});
it('5. should not emit a result if authentication is never initialized', async () => {
  store.overrideSelector(AuthSelectors.selectAuthInitialized, false);
  store.overrideSelector(AuthSelectors.selectIsAuthenticated, true);

  store.refreshState();

  const resultPromise = firstValueFrom(
    TestBed.runInInjectionContext(() =>
      authGuard(
        {} as any,
        { url: '/products' } as any
      ) as Observable<boolean | UrlTree>
    ).pipe(
      timeout({ first: 100 })
    )
  );

  await expect(resultPromise).rejects.toBeInstanceOf(TimeoutError);
});
it('6. should preserve the complete requested URL in returnUrl', async () => {
  store.overrideSelector(AuthSelectors.selectAuthInitialized, true);
  store.overrideSelector(AuthSelectors.selectIsAuthenticated, false);

  store.refreshState();

  const requestedUrl = '/products/25/edit?tab=reviews';

  const result = await firstValueFrom(
    TestBed.runInInjectionContext(() =>
      authGuard(
        {} as any,
        { url: requestedUrl } as any
      ) as Observable<boolean | UrlTree>
    )
  );

  expect(result).toBeInstanceOf(UrlTree);

  expect(router.serializeUrl(result as UrlTree)).toBe(
    '/login?returnUrl=%2Fproducts%2F25%2Fedit%3Ftab%3Dreviews'
  );
});
it('7. should return a UrlTree without navigating directly', async () => {
  store.overrideSelector(AuthSelectors.selectAuthInitialized, true);
  store.overrideSelector(AuthSelectors.selectIsAuthenticated, false);

  store.refreshState();

  const navigateSpy = vi.spyOn(router, 'navigate');

  const result = await firstValueFrom(
    TestBed.runInInjectionContext(() =>
      authGuard(
        {} as any,
        { url: '/products' } as any
      ) as Observable<boolean | UrlTree>
    )
  );

  expect(result).toBeInstanceOf(UrlTree);
  expect(navigateSpy).not.toHaveBeenCalled();
});
});