import { describe, it, expect } from 'vitest';
import { initialOrderState, orderReducer } from './order.reducer';
import * as OrderActions from './order.actions';
describe('orderReducer', () => {
    it('should return the initial state for an unknown action', () => {
        const action = { type: 'UNKNOWN_ACTION' };
        const state = orderReducer(initialOrderState, action);
        expect(state).toBe(initialOrderState);
    });
    it('should handle loadOrders action', () => {
        const action = OrderActions.loadOrders({ page: 2, limit: 5 });
        const state = orderReducer(initialOrderState, action);
        expect(state.loading).toBe(true);
        expect(state.error).toBeNull();
        expect(state.page).toBe(2);
        expect(state.limit).toBe(5);
    });
    it('should handle loadOrdersSuccess action', () => {
        const response = {
            orders: [
                { _id: '1', id: 1, userId: 1, customer: 'John Doe', products: [], totalProducts: 1, totalQuantity: 1, total: 100 },
                { _id: '2', id: 2, userId: 2, customer: 'Jane Smith', products: [], totalProducts: 1, totalQuantity: 1, total: 200 }
            ],
            total: 2
        };
        const action = OrderActions.loadOrdersSuccess({ response });
        const state = orderReducer(initialOrderState, action);
        expect(state.loading).toBe(false);
        expect(state.error).toBeNull();
        expect(state.orders).toEqual(response.orders);
        expect(state.total).toBe(response.total);
    });
    it('should handle loadOrdersFailure action', () => {
        const error = 'Failed to load orders';
        const action = OrderActions.loadOrdersFailure({ error });
        const state = orderReducer(initialOrderState, action);
        expect(state.loading).toBe(false);
        expect(state.error).toBe(error);
    });
    it('should handle updateOrderStatus action', () => {
        const orderId = 1;
        const status = 'Delivered';
        const action = OrderActions.updateOrderStatus({ orderId, status });
        const state = orderReducer(initialOrderState, action);
        expect(state.statuses[orderId]).toBe(status);
    });
    it('should handle restoreOrderStatuses action', () => {
        // const statuses = {
        //     1: 'Pending',
        //     2: 'Processing',
        //     3: 'Delivered'
        // } as const;
        const statuses: Record<number, 'Pending' | 'Processing' | 'Delivered'> = {
            1: 'Pending',
            2: 'Processing',
            3: 'Delivered'
        };
        const action = OrderActions.restoreOrderStatuses({ statuses });
        const state = orderReducer(initialOrderState, action);
        expect(state.statuses).toEqual(statuses);
    });
});
