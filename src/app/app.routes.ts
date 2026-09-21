import { Routes } from '@angular/router';
import { ProductPage } from './pages/product-page/product-page';
import { ProductDetailsPage } from './pages/product-details-page/product-details-page';
import { ProductFormPage } from './pages/product-form-page/product-form-page';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'products',
    pathMatch: 'full'
  },
  {
    path: 'products',
    component: ProductPage
  },
  {
    path: 'products/new',
    component: ProductFormPage
  },
  {
    path: 'products/:id/edit',
    component: ProductFormPage
  },
  {
    path: 'products/:id',
    component: ProductDetailsPage
  }
];