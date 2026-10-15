import { createReducer, on } from '@ngrx/store';
import { Order, OrderStatus } from '../models/order';
import {
  loadOrders,
  loadOrdersFailure,
  loadOrdersSuccess,
  restoreOrderStatuses,
  updateOrderStatus
} from './order.actions';

export interface OrderState {
  orders: Order[];
  total: number;
  loading: boolean;
  error: string | null;
  page: number;
  limit: number;
statuses: Record<number, OrderStatus>;
}

export const initialOrderState: OrderState = {
  orders: [],
  total: 0,
  loading: false,
  error: null,
  page: 1,
  limit: 10,
    statuses: {}
};

export const orderReducer = createReducer(
  initialOrderState,

  on(loadOrders, (state, { page, limit }) => ({
    ...state,
    loading: true,
    error: null,
    page,
    limit
  })),

  on(loadOrdersSuccess, (state, { response }) => ({
    ...state,
    orders: response.orders,
    total: response.total,
    loading: false,
    error: null
  })),

  on(loadOrdersFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(updateOrderStatus, (state, { orderId, status }) => ({
  ...state,
  statuses: {
    ...state.statuses,
    [orderId]: status
  }
})),
on(restoreOrderStatuses, (state, { statuses }) => ({
  ...state,
  statuses
})),
);