import { describe, it, expect } from 'vitest';
import { OrderState } from './order.reducer';
import { Order } from '../models/order';
import {
  selectOrders,
  selectOrdersTotal,
  selectOrdersLoading,
  selectOrdersError,
  selectOrdersPage,
  selectOrdersLimit,
  selectOrderStatuses,
  selectOrderPage,
  selectOrderLimit
} from './order.selectors';

describe('Order Selectors', () => {
     const orders: Order[] = [
    { id: 1, userId: 1, products: [], total: 100, totalProducts: 2, totalQuantity: 2 },
    { id: 2, userId: 2, products: [], total: 200, totalProducts: 3, totalQuantity: 3 }
  ];
it('should select orders', () => {
 

  const result = selectOrders.projector({
    orders,
    total: 2,
    loading: false,
    error: null,
    page: 1,
    limit: 10,
    statuses: {}
  });

  expect(result).toEqual(orders);
});
it('should select orders total', () => {
  const result = selectOrdersTotal.projector({
    total: 25
  } as OrderState);

  expect(result).toBe(25);
});
it('should select orders loading status', () => {
  const result = selectOrdersLoading.projector({
    loading: true
  } as OrderState);

  expect(result).toBe(true);
});
it('should select orders error', () => {
  const error = 'Failed to load orders';

  const result = selectOrdersError.projector({
    error
  } as OrderState);

  expect(result).toBe(error);
});
it('should select orders page', () => {
  const result = selectOrdersPage.projector({
    page: 2
  } as OrderState);

  expect(result).toBe(2);
});
it('should select orders limit', () => {
  const result = selectOrdersLimit.projector({
    limit: 10
  } as OrderState);

  expect(result).toBe(10);
});
it('should select order statuses', () => {
  const statuses = {
    1: 'Processing',
    2: 'Delivered'
  };

  const result = selectOrderStatuses.projector({
     orders,
    total: 2,
    loading: false,
    error: null,
    page: 1,
    limit: 10,
    statuses
  } as OrderState);

  expect(result).toEqual(statuses);
});
it('should select order page', () => {
  const result = selectOrderPage.projector({
    page: 3
  } as OrderState);

  expect(result).toBe(3);
});
it('should select order limit', () => {
  const result = selectOrderLimit.projector({
    limit: 20
  } as OrderState);

  expect(result).toBe(20);
});
});