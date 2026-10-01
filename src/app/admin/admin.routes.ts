import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: 'users',
    loadComponent: () =>
      import('../pages/users-page/users-page')
        .then(m => m.UsersPage)
  },
  {
    path: 'reports',
    loadComponent: () =>
      import('../pages/reports-page/reports-page')
        .then(m => m.ReportsPage)
  }
];