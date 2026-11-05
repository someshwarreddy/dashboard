import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { Action } from '@ngrx/store';
import { OrderEffects } from './order.effects';
import { OrderService } from '../services/order.service';
import {
  loadOrders,
  loadOrdersFailure,
  loadOrdersSuccess,
  refreshOrders,
  loadOrderDashboardSummary,
  loadOrderDashboardSummarySuccess,
  loadOrderDashboardSummaryFailure,
  loadMultipleCarts,
  loadMultipleCartsSequentially,
  testOrderRetry
} from './order.actions';
import { firstValueFrom, of, Subject, throwError, defer, finalize } from 'rxjs';
import { selectOrderLimit, selectOrderPage } from './order.selectors';

describe('OrderEffects', () => {
  let effects: OrderEffects;
  let actions$: Subject<Action>;

  const orderServiceMock = {
    getOrders: vi.fn(),
    getOrderById: vi.fn()
  };
  const mockOrdersResponse = {
    orders: [],
    total: 0
  };

  const mockCart = {
    id: 1,
    products: [],
    total: 100,
    totalProducts: 0,
    totalQuantity: 0,
    userId: 1
  };
  beforeEach(() => {
    actions$ = new Subject<Action>();

    TestBed.configureTestingModule({
      providers: [
        OrderEffects,
        provideMockActions(() => actions$),
        provideMockStore({
          selectors: [
            {
              selector: selectOrderPage,
              value: 2
            },
            {
              selector: selectOrderLimit,
              value: 10
            }
          ]
        }),
        {
          provide: OrderService,
          useValue: orderServiceMock
        },

      ]
    });

    effects = TestBed.inject(OrderEffects);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });
  it('should load orders successfully', async () => {
    const mockResponse = {
      orders: [],
      total: 0
    };

    orderServiceMock.getOrders.mockReturnValue(
      of(mockResponse)
    );

    const resultPromise = firstValueFrom(
      effects.loadOrders$
    );

    actions$.next(
      loadOrders({ page: 1, limit: 10 })
    );

    await expect(resultPromise).resolves.toEqual(
      loadOrdersSuccess({
        response: mockResponse
      })
    );

    expect(orderServiceMock.getOrders)
      .toHaveBeenCalledWith(1, 10);
  });
  it('should handle load orders failure', async () => {
    orderServiceMock.getOrders.mockReturnValue(
      throwError(() => new Error('server error kjggjdflg'))
    );
    const resultPromise = firstValueFrom(
      effects.loadOrders$
    );

    actions$.next(
      loadOrders({ page: 1, limit: 10 })
    );
    await expect(resultPromise).resolves.toEqual(
      loadOrdersFailure({
        error: 'Failed to load orders. Please try again.'
      })
    );

    expect(orderServiceMock.getOrders)
      .toHaveBeenCalledWith(1, 10);
  });

  it('should refresh orders using the latest page and limit', async () => {
    const resultPromise = firstValueFrom(
      effects.refreshOrders$
    );

    actions$.next(refreshOrders());

    await expect(resultPromise).resolves.toEqual(
      loadOrders({ page: 2, limit: 10 })
    );
  });
  it('should load order dashboard summary successfully', async () => {
    orderServiceMock.getOrders.mockReturnValue(
      of(mockOrdersResponse)
    );
    orderServiceMock.getOrderById.mockReturnValue(
      of(mockCart)
    );

    const resultPromise = firstValueFrom(
      effects.loadOrderDashboardSummary$
    );
    actions$.next(loadOrderDashboardSummary());

    await expect(resultPromise).resolves.toEqual(
      loadOrderDashboardSummarySuccess({
        ordersResponse: mockOrdersResponse,
        cart: mockCart
      })

    );
    expect(orderServiceMock.getOrders)
      .toHaveBeenCalledWith(1, 10);
    expect(orderServiceMock.getOrderById)
      .toHaveBeenCalledWith(1);
  });
  it('should handle load order dashboard summary failure', async () => {
    orderServiceMock.getOrders.mockReturnValue(
      of(mockOrdersResponse)
    );

    orderServiceMock.getOrderById.mockReturnValue(
      throwError(() => new Error('Server error'))
    );
    const resultPromise = firstValueFrom(
      effects.loadOrderDashboardSummary$
    );
    actions$.next(loadOrderDashboardSummary());

    await expect(resultPromise).resolves.toEqual(
      loadOrderDashboardSummaryFailure({
        error: 'Failed to load order dashboard summary.'
      })
    );
    expect(orderServiceMock.getOrders)
      .toHaveBeenCalledWith(1, 10);
    expect(orderServiceMock.getOrderById)
      .toHaveBeenCalledWith(1);
  });
  it('should load multiple carts concurrently', async () => {
    const mockIds = [1, 2, 3];

    orderServiceMock.getOrderById.mockImplementation(
      (id: number) => of({
        ...mockCart,
        id
      })
    );
    const resultPromise = firstValueFrom(
      effects.loadMultipleCarts$
    );
    actions$.next(loadMultipleCarts({ ids: mockIds }));

    await expect(resultPromise).resolves.toEqual({
      type: '[Orders Learning] Multiple Carts Loaded'
    });

    expect(orderServiceMock.getOrderById).toHaveBeenCalledTimes(mockIds.length);
    mockIds.forEach(id => {
      expect(orderServiceMock.getOrderById).toHaveBeenCalledWith(id);
    });
  });
  it('should handle load multiple carts failure', async () => {
    const mockIds = [1];
    orderServiceMock.getOrderById.mockImplementation(() =>
      throwError(() => new Error('Server error'))
    );
    const resultPromise = firstValueFrom(
      effects.loadMultipleCarts$
    );
    actions$.next(loadMultipleCarts({ ids: mockIds }));
    await expect(resultPromise).resolves.toEqual({
      type: '[Orders Learning] Multiple Carts Failed'
    });
    expect(orderServiceMock.getOrderById).toHaveBeenCalledTimes(1);
    mockIds.forEach(id => {
      expect(orderServiceMock.getOrderById).toHaveBeenCalledWith(id);
    });
  });
  it('should load multiple carts sequentially', async () => {
    const mockIds = [1, 2, 3];

    orderServiceMock.getOrderById.mockImplementation(
      (id: number) => of({
        ...mockCart,
        id
      })
    );
    const resultPromise = firstValueFrom(
      effects.loadMultipleCartsSequentially$
    );
    actions$.next(loadMultipleCartsSequentially({ ids: mockIds }));

    await expect(resultPromise).resolves.toEqual({
      type: '[Orders Learning] Sequential Carts Loaded'
    });

    expect(orderServiceMock.getOrderById).toHaveBeenCalledTimes(mockIds.length);
    mockIds.forEach(id => {
      expect(orderServiceMock.getOrderById).toHaveBeenCalledWith(id);
    });
  });
  it('should handle load multiple carts sequentially failure', async () => {
    const mockIds = [1];
    orderServiceMock.getOrderById.mockImplementation(() =>
      throwError(() => new Error('Server error'))
    );
    const resultPromise = firstValueFrom(
      effects.loadMultipleCartsSequentially$
    );
    actions$.next(loadMultipleCartsSequentially({ ids: mockIds }));
    await expect(resultPromise).resolves.toEqual({
      type: '[Orders Learning] Sequential Carts Failed'
    });
    expect(orderServiceMock.getOrderById).toHaveBeenCalledTimes(1);
    mockIds.forEach(id => {
      expect(orderServiceMock.getOrderById).toHaveBeenCalledWith(id);
    });
  });
  it('should load orders successfully using retry effect', () => {
    orderServiceMock.getOrders.mockReturnValue(
      of(mockOrdersResponse)
    );

    const subscription = effects.testOrderRetry$.subscribe();

    actions$.next(testOrderRetry());

    expect(orderServiceMock.getOrders).toHaveBeenCalledTimes(1);

    expect(orderServiceMock.getOrders).toHaveBeenCalledWith(1, 10);
    subscription.unsubscribe();
  });
  it('should succeed when the request succeeds on retry', () => {
    let attempts = 0;

    orderServiceMock.getOrders.mockReturnValue(
      defer(() => {
        attempts++;

        return attempts === 1
          ? throwError(() => new Error('Server error'))
          : of(mockOrdersResponse);
      })
    );

    const subscription = effects.testOrderRetry$.subscribe();

    actions$.next(testOrderRetry());

    expect(orderServiceMock.getOrders).toHaveBeenCalledTimes(1);
    expect(attempts).toBe(2);

    subscription.unsubscribe();
  });
  it('should execute finalize after successful request', () => {
    const finalizeSpy = vi.fn();

    orderServiceMock.getOrders.mockReturnValue(
      of(mockOrdersResponse).pipe(
        finalize(finalizeSpy)
      )
    );

    const subscription = effects.testOrderRetry$.subscribe();

    actions$.next(testOrderRetry());

    expect(finalizeSpy).toHaveBeenCalledTimes(1);

    subscription.unsubscribe();
  });
  it('should handle the error after all retry attempts fail', () => {
  const finalizeSpy = vi.fn();

  orderServiceMock.getOrders.mockReturnValue(
    throwError(() => new Error('Server error')).pipe(
      finalize(finalizeSpy)
    )
  );

  const subscription = effects.testOrderRetry$.subscribe();

  actions$.next(testOrderRetry());

  expect(orderServiceMock.getOrders).toHaveBeenCalledTimes(1);
 expect(finalizeSpy).toHaveBeenCalledTimes(3);

  subscription.unsubscribe();
});
});
