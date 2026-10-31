import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing';

import { AuthService } from './auth';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should check whether an email exists', () => {
    const email = 'test@example.com';

    service.checkEmail(email).subscribe(response => {
      expect(response).toEqual({ exists: true });
    });

    const req = httpMock.expectOne(request =>
      request.url === 'http://localhost:5000/api/auth/checkmail'
    );

    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('email')).toBe(email);

    req.flush({ exists: true });
  });
  it('should handle checkEmail API errors', () => {
    const email = 'test@example.com';

    service.checkEmail(email).subscribe({
      next: () => {
        throw new Error('Expected an HTTP error, but received a success response');
      },
      error: error => {
        expect(error.status).toBe(500);
      }
    });

    const req = httpMock.expectOne(request =>
      request.url === 'http://localhost:5000/api/auth/checkmail'
    );

    req.flush(
      { message: 'Internal Server Error' },
      { status: 500, statusText: 'Server Error' }
    );
  });
  it('should register a new user', () => {
    const user = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'test123'
    };

    service.register(user).subscribe(response => {
      expect(response).toEqual({
        message: 'User registered successfully'
      });
    });

    const req = httpMock.expectOne(
      'http://localhost:5000/api/auth/register'
    );

    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(user);

    req.flush({
      message: 'User registered successfully'
    });
  });
  it('should handle register API errors', () => {
    const user = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'test123'
    };

    service.register(user).subscribe({
      error: error => {
        expect(error.status).toBe(409);
      }
    });

    const req = httpMock.expectOne(
      'http://localhost:5000/api/auth/register'
    );

    req.flush(
      { message: 'Email already exists' },
      { status: 409, statusText: 'Conflict' }
    );
  });
  it('should login user successfully', () => {
    const credentials = {
      email: 'test@example.com',
      password: 'test123'
    };

    service.login(credentials).subscribe(response => {
      expect(response).toEqual({
        token: 'mock-jwt-token'
      });
    });

    const req = httpMock.expectOne(
      'http://localhost:5000/api/auth/login'
    );

    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(credentials);

    req.flush({ token: 'mock-jwt-token' });
  });
  it('should handle login API errors', () => {
    const credentials = {
      email: 'test@example.com',
      password: 'wrong-password'
    };

    service.login(credentials).subscribe({
      error: error => {
        expect(error.status).toBe(400);
      }
    });

    const req = httpMock.expectOne(
      'http://localhost:5000/api/auth/login'
    );

    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(credentials);

    req.flush(
      { message: 'Invalid credentials' },
      { status: 400, statusText: 'Bad Request' }
    );
  });
  it('should get the currently logged-in user', () => {
    const mockUser = {
      _id: 'user123',
      name: 'Test User',
      email: 'test@example.com',
      role: 'user' as const
    };

    service.getLoggedInUser().subscribe(response => {
      expect(response).toEqual({
        user: mockUser
      });
    });

    const req = httpMock.expectOne(
      'http://localhost:5000/api/users/loggedin-user'
    );

    expect(req.request.method).toBe('GET');

    req.flush({
      user: mockUser
    });

  });
  it('should handle getLoggedInUser API errors', () => {
    service.getLoggedInUser().subscribe({
      error: error => {
        expect(error.status).toBe(401);
      }
    });

    const req = httpMock.expectOne(
      'http://localhost:5000/api/users/loggedin-user'
    );

    expect(req.request.method).toBe('GET');

    req.flush(
      { message: 'Unauthorized' },
      { status: 401, statusText: 'Unauthorized' }
    );
  });
});