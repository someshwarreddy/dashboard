import { createAction, props } from '@ngrx/store';
import { Product, CreateProduct  } from '../models/product';


// load product actions
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

// search product actions
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

// select product action
export const selectProduct = createAction(
  '[Product] Select Product',
  props<{ id: number }>()
);
export const clearSelectedProduct = createAction(
  '[Product] Clear Selected Product'
);

export const deleteProduct = createAction(
  '[Product] Delete Product',
  props<{ id: number }>()
);

export const deleteProductSuccess = createAction(
  '[Product] Delete Product Success',
  props<{ id: number }>()
);

export const deleteProductFailure = createAction(
  '[Product] Delete Product Failure',
  props<{ error: string }>()
);

export const updateProduct = createAction(
  '[Product] Update Product',
  props<{ product: Product }>()
);

export const updateProductSuccess = createAction(
  '[Product] Update Product Success',
  props<{ product: Product }>()
);

export const updateProductFailure = createAction(
  '[Product] Update Product Failure',
  props<{ error: string }>()
);

export const putProduct = createAction(
  '[Product] Put Product',
  props<{ product: Product }>()
);

export const putProductSuccess = createAction(
  '[Product] Put Product Success',
  props<{ product: Product }>()
);

export const putProductFailure = createAction(
  '[Product] Put Product Failure',
  props<{ error: string }>()
);

export const createProduct = createAction(
  '[Product] Create Product',
  props<{ product: CreateProduct }>()
);
export const createProductSuccess = createAction(
  '[Product] Create Product Success',
  props<{ product: Product }>()
);
export const createProductFailure = createAction(
  '[Product] Create Product Failure',
  props<{ error: string }>()
);

// single load product actions
export const loadProduct = createAction(
  '[Product] Load Product',
  props<{ id: number }>()
);
export const loadProductSuccess = createAction(
  '[Product] Load Product Success',
  props<{ product: Product }>()
);

export const loadProductFailure = createAction(
  '[Product] Load Product Failure',
  props<{ error: string }>()
);
export const setSort = createAction(
  '[Product] Set Sort',
  props<{ sort: string }>()
);