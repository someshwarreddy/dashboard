import { createReducer, on } from '@ngrx/store';
import * as ProductActions from './product.actions';
import { Product, ProductState } from '../models/product';



export const initialState: ProductState = {
  products: [],
  loading: false,
  error: null,
   selectedProductId: null
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
  })),

  on(ProductActions.searchProducts, state => ({
    ...state,
    loading: true,
    error: null
  })),

  on(ProductActions.searchProductsSuccess, (state, { products }) => ({
    ...state,
    products
  })),

  on(ProductActions.searchProductsFailure, (state, { error }) => ({
    ...state,
    error
  })),

  // select product reducer
  on(ProductActions.selectProduct, (state, { id }) => ({
    ...state,
    selectedProductId: id
  }))
);