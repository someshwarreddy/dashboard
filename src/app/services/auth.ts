import { Service } from '@angular/core';
import { inject, } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/product';

interface CheckEmailResponse {
  exists: boolean;
}
interface LoginResponse {
  token: string;
}
interface ActivateAccountResponse {
  message: string;
}
@Service()
export class AuthService {
  private http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:5000/api';
  checkEmail(email: string): Observable<CheckEmailResponse> {
    const params = new HttpParams().set('email', email);

    return this.http.get<CheckEmailResponse>(
      `${this.apiUrl}/auth/checkmail`,
      { params }
    );
  }

  register(user: {
    name: string;
    email: string;
    password: string;
  }) {
    return this.http.post(
      `${this.apiUrl}/auth/register`,
      user
    );
  }

  login(credentials: {
    email: string;
    password: string;
  }) {
    return this.http.post<LoginResponse>(
      `${this.apiUrl}/auth/login`,
      credentials
    );
  }

  getLoggedInUser() {
    return this.http.get<{ user: User }>(
      `${this.apiUrl}/users/loggedin-user`
    );
  }
  activateAccount(data: {
  token: string;
  password: string;
}): Observable<ActivateAccountResponse> {
  return this.http.post<ActivateAccountResponse>(
    `${this.apiUrl}/auth/activate`,
    data
  );
}
}

