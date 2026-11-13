import { Service, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  ManagedUser,
  UsersApiResponse
} from '../models/managed-user';

@Service()
export class User {
     private http = inject(HttpClient);

  private readonly apiUrl = 'https://dummyjson.com/users';

  getUsers(
    page: number,
    limit: number,
    search: string
  ): Observable<UsersApiResponse> {

    const skip = (page - 1) * limit;

    let params = new HttpParams()
      .set('limit', limit)
      .set('skip', skip);

    const url = search.trim()
      ? `${this.apiUrl}/search`
      : this.apiUrl;

    if (search.trim()) {
      params = params.set('q', search.trim());
    }

    return this.http.get<UsersApiResponse>(url, { params });
  }

  getUserById(id: number): Observable<ManagedUser> {
    return this.http.get<ManagedUser>(`${this.apiUrl}/${id}`);
  }
}
