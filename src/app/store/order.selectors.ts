import { createFeatureSelector, createSelector } from '@ngrx/store';
import { OrderState } from './order.reducer';

export const selectOrderState =
  createFeatureSelector<OrderState>('orders');

export const selectOrders = createSelector(
  selectOrderState,
  state => state.orders
);

export const selectOrdersTotal = createSelector(
  selectOrderState,
  state => state.total
);

export const selectOrdersLoading = createSelector(
  selectOrderState,
  state => state.loading
);

export const selectOrdersError = createSelector(
  selectOrderState,
  state => state.error
);

export const selectOrdersPage = createSelector(
  selectOrderState,
  state => state.page
);

export const selectOrdersLimit = createSelector(
  selectOrderState,
  state => state.limit
);
export const selectOrderStatuses = createSelector(
  selectOrderState,
  state => state.statuses
);
export const selectOrderPage = createSelector(
  selectOrderState,
  (state) => state.page
);

export const selectOrderLimit = createSelector(
  selectOrderState,
  (state) => state.limit
);