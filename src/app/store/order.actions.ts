import { createAction, props } from '@ngrx/store';
import { OrderListResponse, OrderStatus  } from '../models/order';

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