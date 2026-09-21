import {createFeatureSelector, createSelector} from '@ngrx/store';
import {ProductState} from '../models/product';

const selectProductState = createFeatureSelector<ProductState>('product');

export const selectProducts = createSelector(
  selectProductState,
  (productState) => productState.products
);
 export const selectLoading = createSelector(
  selectProductState,
  (productState) => productState.loading
);  
export const selectError = createSelector(
  selectProductState,
  (productState) => productState.error
);

export const selectSelectedProduct = createSelector(
  selectProducts,
  selectProductState,
  (products, state) =>
    products.find(product => product.id === state.selectedProductId) ?? null
);

export const selectDeletingId = createSelector(
  selectProductState,
  state => state.deletingId
);
export const selectCreating = createSelector(
  selectProductState,
  state => state.creating
);
export const selectProductDetails = createSelector(
  selectProductState,
  state => state.productDetails
);