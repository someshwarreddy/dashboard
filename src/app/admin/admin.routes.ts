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
    path: 'users/:id',
    loadComponent: () =>
      import('../pages/user-details-page/user-details-page')
        .then(m => m.UserDetailsPage)
  },
  {
    path: 'reports',
    canMatch: [newReportsMatchGuard],
    loadComponent: () =>
      import('../pages/reports-page/reports-page')
        .then(m => m.ReportsPage)
  },
  {
    path: 'oldreports',
    loadComponent: () =>
      import('../pages/old-reports-page/old-reports-page')
        .then(m => m.OldReportsPage)
  },
  {
    path: 'user-registration',
    loadComponent: () =>
      import('../pages/user-registration/user-registration')
        .then(m => m.UserRegistration)
  }
];