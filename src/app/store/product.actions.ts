import { createAction, props } from '@ngrx/store';
import { Product } from '../models/product';

export const loadProducts = createAction(
  '[Product] Load Products'
);

export const loadProductsSuccess = createAction(
  '[Product] Load Products Success',
  props<{ products: Product[] }>()
);

export const loadProductsFailure = createAction(
  '[Product] Load Products Failure',
  props<{ error: string }>()
);

export const searchProducts = createAction(
  '[Product] Search Products',
  props<{ query: string }>()
);

export const searchProductsSuccess = createAction(
  '[Product] Search Products Success',
  props<{ products: Product[] }>()
);

export const searchProductsFailure = createAction(
  '[Product] Search Products Failure',
  props<{ error: string }>()
);