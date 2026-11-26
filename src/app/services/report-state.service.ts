
import { Service, inject, signal } from '@angular/core';

import { ReportService } from './report.service';
import { UserReport } from '../models/user-report';

@Service()
export class ReportState {

  private readonly reportService = inject(ReportService);

  readonly userReport = signal<UserReport | null>(null);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  loadUserReports(): void {
    this.loading.set(true);
    this.error.set(null);

    this.reportService.getUserReports().subscribe({
      next: (report) => {
        this.userReport.set(report);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load user reports');
        this.loading.set(false);
      }
    });
  }
}
