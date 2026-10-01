import { Routes } from '@angular/router';
import { ProductPage } from './pages/product-page/product-page';
import { ProductDetailsPage } from './pages/product-details-page/product-details-page';
import { ProductFormPage } from './pages/product-form-page/product-form-page';
import { authGuard } from './store/auth.guard';
import { LoginPage } from './pages/login-page/login-page';
import { RegisterPage } from './pages/register-page/register-page';
import { ProductSpecifications } from './components/product-specifications/product-specifications';
import { ProductReviews } from './components/product-reviews/product-reviews';
import { NotFoundPage } from './pages/not-found-page/not-found-page';
import { unsavedChangesGuard } from './guards/unsaved-changes-guard';
import { authChildGuard } from './guards/auth-child-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'products',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginPage
  },
  {
    path: 'register',
    component: RegisterPage
  },
  {
    path: 'products',
    component: ProductPage,
    canActivate: [authGuard],
    data: {
      title: 'Products',
      section: 'Product Management'
    }
  },
  {
    path: 'products/new',
    component: ProductFormPage,
    canActivate: [authGuard],
    canDeactivate: [unsavedChangesGuard]
  },
  {
    path: 'products/:id/edit',
    component: ProductFormPage,
    canActivate: [authGuard],
    canDeactivate: [unsavedChangesGuard]
  },
  {
    path: 'products/:id',
    component: ProductDetailsPage,
    canActivate: [authGuard],
    canActivateChild: [authChildGuard],
    data: {
      title: 'Product Details'
    },
    children: [
      {
        path: 'reviews',
        component: ProductReviews
      },
      {
        path: 'specifications',
        component: ProductSpecifications
      }
    ],

  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin.routes')
        .then(m => m.ADMIN_ROUTES)
  },
  {
    path: 'reports',
    loadComponent: () =>
      import('./pages/reports-page/reports-page')
        .then(m => m.ReportsPage)
  },

  {
    path: '**',
    component: NotFoundPage
  }
];