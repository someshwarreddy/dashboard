import { Service, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  CreateUserRequest,
  CreateUserResponse,
  ResendActivationResponse,
  UserDetailsResponse,
  UsersApiResponse
} from '../models/managed-user';

@Service()
export class User {

  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:5000/api/users';

  getUsers(
    page: number,
    limit: number,
    search: string
  ): Observable<UsersApiResponse> {
     const params = new HttpParams()
    .set('page', page)
    .set('limit', limit)
    .set('search', search.trim());

    return this.http.get<UsersApiResponse>(
    `${this.apiUrl}/users-all`,
    { params }
  );

  }

getUserById(id: string): Observable<UserDetailsResponse> {
  return this.http.get<UserDetailsResponse>(
    `${this.apiUrl}/${id}`
  );
}
uploadProfileImage(file: File): Observable<UserDetailsResponse> {
  const formData = new FormData();

  formData.append('image', file);

  return this.http.post<UserDetailsResponse>(
    `${this.apiUrl}/upload-profile-image`,
    formData
  );
}
createUser(user: CreateUserRequest): Observable<CreateUserResponse> {
  return this.http.post<CreateUserResponse>(
    this.apiUrl,
    user
  );
}
resendActivation(userId: string): Observable<ResendActivationResponse> {
  return this.http.post<ResendActivationResponse>(
    `${this.apiUrl}/${userId}/resend-activation`,
    {}
  );
}
}
