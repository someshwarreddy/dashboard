import { Routes } from '@angular/router';
import { newReportsMatchGuard } from '../guards/new-reports-match-guard';

export const ADMIN_ROUTES: Routes = [
  {
    path: 'users',
    loadComponent: () =>
      import('../pages/users-page/users-page')
        .then(m => m.UsersPage)
  },
  {
    path: 'reports',
    canMatch: [newReportsMatchGuard],
    loadComponent: () =>
      import('../pages/reports-page/reports-page')
        .then(m => m.ReportsPage)
  },
  {
    path: 'reports',
    loadComponent: () =>
      import('../pages/old-reports-page/old-reports-page')
        .then(m => m.OldReportsPage)
  }
];