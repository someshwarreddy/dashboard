import { Service, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  ManagedUser,
  UsersApiResponse
} from '../models/managed-user';

@Service()
export class User {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'https://dummyjson.com/users';

  getUsers(
    page: number,
    limit: number,
    search: string
  ): Observable<UsersApiResponse> {
    const skip = (page - 1) * limit;
    const query = search.trim();

    let params = new HttpParams()
      .set('limit', limit)
      .set('skip', skip);

    const url = query
      ? `${this.apiUrl}/search`
      : this.apiUrl;

    if (query) {
      params = params.set('q', query);
    }

    return this.http.get<UsersApiResponse>(url, { params });
  }

  getUserById(id: number): Observable<ManagedUser> {
    return this.http.get<ManagedUser>(`${this.apiUrl}/${id}`);
  }
}
