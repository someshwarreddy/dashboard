import { createAction, props } from '@ngrx/store';
import { Order, OrderListResponse, OrderStatus } from '../models/order';

export const loadOrders = createAction(
  '[Orders] Load Orders',
  props<{ page: number; limit: number }>()
);

export const loadOrdersSuccess = createAction(
  '[Orders] Load Orders Success',
  props<{ response: OrderListResponse }>()
);

export const loadOrdersFailure = createAction(
  '[Orders] Load Orders Failure',
  props<{ error: string }>()
);
export const updateOrderStatus = createAction(
  '[Orders] Update Order Status',
  props<{ orderId: number; status: OrderStatus }>()
);

export const restoreOrderStatuses = createAction(
  '[Orders] Restore Order Statuses',
  props<{ statuses: Record<number, OrderStatus> }>()
);
export const updateMultipleOrderStatuses = createAction(
  '[Orders] Update Multiple Order Statuses',
  props<{
    updates: {
      orderId: number;
      status: OrderStatus;
    }[];
  }>()
);

export const updateMultipleOrderStatusesSuccess = createAction(
  '[Orders] Update Multiple Order Statuses Success',
  props<{
    updatedOrderIds: number[];
  }>()
);

export const updateMultipleOrderStatusesFailure = createAction(
  '[Orders] Update Multiple Order Statuses Failure',
  props<{ error: string }>()
);
export const loadMultipleCarts = createAction(
  '[Orders Learning] Load Multiple Carts',
  props<{ ids: number[] }>()
);
export const loadMultipleCartsSequentially = createAction(
  '[Orders Learning] Load Multiple Carts Sequentially',
  props<{ ids: number[] }>()
);
export const loadOrderDashboardSummary = createAction(
  '[Orders Learning] Load Dashboard Summary'
);

export const loadOrderDashboardSummarySuccess = createAction(
  '[Orders Learning] Load Dashboard Summary Success',
  props<{
    ordersResponse: OrderListResponse;
    cart: Order;
  }>()
);

export const loadOrderDashboardSummaryFailure = createAction(
  '[Orders Learning] Load Dashboard Summary Failure',
  props<{ error: string }>()
);
export const refreshOrders = createAction(
  '[Orders] Refresh Orders'
);