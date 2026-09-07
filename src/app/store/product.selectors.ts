import {createFeatureSelector, createSelector} from '@ngrx/store';
import {ProductState} from './product.reducer';

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