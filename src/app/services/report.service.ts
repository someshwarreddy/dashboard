
import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { UserReport } from '../models/user-report';

@Service()
export class ReportService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'http://localhost:5000/api/reports';

  getUserReports(): Observable<UserReport> {
    return this.http.get<UserReport>(
      `${this.apiUrl}/users`
    );
  }
}
