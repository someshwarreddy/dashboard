import { Routes } from '@angular/router';
import { ProductPage } from './pages/product-page/product-page';
import { ProductDetailsPage } from './pages/product-details-page/product-details-page';
import { ProductFormPage } from './pages/product-form-page/product-form-page';
import { authGuard } from './store/auth.guard';
import { LoginPage } from './pages/login-page/login-page';

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
    path: 'products',
    component: ProductPage,
     canActivate: [authGuard]
  },
  {
    path: 'products/new',
    component: ProductFormPage,
    canActivate: [authGuard]
  },
  {
    path: 'products/:id/edit',
    component: ProductFormPage,
    canActivate: [authGuard]
  },
  {
    path: 'products/:id',
    component: ProductDetailsPage,
    canActivate: [authGuard]
  }
];