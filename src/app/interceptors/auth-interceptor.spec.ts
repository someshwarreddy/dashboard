import { TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpInterceptorFn, HttpRequest } from '@angular/common/http';

import { authInterceptor } from './auth-interceptor';

describe('authInterceptor', () => {
  const interceptor: HttpInterceptorFn = (req, next) =>
    TestBed.runInInjectionContext(() => authInterceptor(req, next));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });
   it('1. should attach token to outgoing request', () => {
    vi.spyOn(Storage.prototype, 'getItem')
      .mockReturnValue('test-token');

    const request = new HttpRequest(
      'GET',
      '/api/products'
    );

    const next = vi.fn((req: HttpRequest<unknown>) => {
      expect(req.headers.get('Authorization'))
        .toBe('Bearer test-token');

      return undefined as any;
    });

    authInterceptor(request, next);

    expect(next).toHaveBeenCalled();
  });
  it('2. should not add Authorization header when token is missing', () => {
  vi.spyOn(Storage.prototype, 'getItem')
    .mockReturnValue(null);

  const request = new HttpRequest(
    'GET',
    '/api/products'
  );

  const next = vi.fn((req: HttpRequest<unknown>) => {
    expect(req.headers.has('Authorization')).toBe(false);
    return undefined as any;
  });

  authInterceptor(request, next);

  expect(next).toHaveBeenCalled();
});
it('3. should skip Authorization header for authentication endpoints', () => {
  vi.spyOn(Storage.prototype, 'getItem')
    .mockReturnValue('test-token');

  const request = new HttpRequest(
    'POST',
    '/api/auth/login',
    {}
  );

  const next = vi.fn((req: HttpRequest<unknown>) => {
    expect(req.headers.has('Authorization')).toBe(false);
    return undefined as any;
  });

  authInterceptor(request, next);

  expect(next).toHaveBeenCalled();
});
it('4. should not modify the original request', () => {
  vi.spyOn(Storage.prototype, 'getItem')
    .mockReturnValue('test-token');

  const request = new HttpRequest(
    'GET',
    '/api/products'
  );

 const next = vi.fn((req: HttpRequest<unknown>) => undefined as any);

  authInterceptor(request, next);

  expect(request.headers.has('Authorization')).toBe(false);
  expect(next.mock.calls[0][0]).not.toBe(request);
});
it('5. should preserve existing headers when adding token', () => {
  vi.spyOn(Storage.prototype, 'getItem')
    .mockReturnValue('test-token');

  const request = new HttpRequest(
    'GET',
    '/api/products',
    {
      headers: new HttpHeaders({
        'X-Custom-Header': 'custom-value'
      })
    }
  );

  const next = vi.fn((req: HttpRequest<unknown>) => {
    expect(req.headers.get('Authorization'))
      .toBe('Bearer test-token');

    expect(req.headers.get('X-Custom-Header'))
      .toBe('custom-value');

    return undefined as any;
  });

  authInterceptor(request, next);
});
});
