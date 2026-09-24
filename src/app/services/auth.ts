import { Service } from '@angular/core';
import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/product';

interface CheckEmailResponse {
  exists: boolean;
}
interface LoginResponse {
  token: string;
}
@Service()
export class AuthService {
     private http = inject(HttpClient);

  checkEmail(email: string): Observable<CheckEmailResponse> {

    const params = new HttpParams()
      .set('email', email);

    return this.http.get<CheckEmailResponse>(
      'http://localhost:5000/api/auth/checkmail',
      { params }
    );
  }
  register(user: {
  name: string;
  email: string;
  password: string;
}) {
  return this.http.post(
    'http://localhost:5000/api/auth/register',
    user
  );
}
login(credentials: {
  email: string;
  password: string;
}) {
  return this.http.post<LoginResponse>(
    'http://localhost:5000/api/auth/login',
    credentials
  );
}
getLoggedInUser() {
  return this.http.get<{ user: User }>(
    'http://localhost:5000/api/users/loggedin-user'
  );
}
}

