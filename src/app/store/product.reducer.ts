import { createReducer, on } from '@ngrx/store';
import * as ProductActions from './product.actions';
import { Product } from '../models/product';

export interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
}

export const initialState: ProductState = {
  products: [],
  loading: false,
  error: null
};

export const productReducer = createReducer(
  initialState,

  on(ProductActions.loadProducts, state => ({
    ...state,
    loading: true,
    error: null
  })),

  on(ProductActions.loadProductsSuccess, (state, { products }) => ({
    ...state,
    products,
    loading: false
  })),

  on(ProductActions.loadProductsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
,
  on(ProductActions.searchProductsSuccess, (state, { products }) => ({
  ...state,
  products
})),
);