import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, concatMap, forkJoin, from, map, mergeMap, of, switchMap, toArray, withLatestFrom } from 'rxjs';
import { OrderService } from '../services/order.service';
import {
  loadOrders,
  loadOrdersFailure,
  loadOrdersSuccess,
  loadMultipleCarts,
  loadMultipleCartsSequentially,
  loadOrderDashboardSummaryFailure,
  loadOrderDashboardSummarySuccess,
  loadOrderDashboardSummary,
  refreshOrders
} from './order.actions';
import { selectOrderLimit, selectOrderPage } from './order.selectors';
import { Store } from '@ngrx/store';
@Injectable()
export class OrderEffects {
  private actions$ = inject(Actions);
  private orderService = inject(OrderService);
  private store = inject(Store);

  loadOrders$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadOrders),
      switchMap(({ page, limit }) =>
        this.orderService.getOrders(page, limit).pipe(
          map(response => loadOrdersSuccess({ response })),
          catchError(() =>
            of(
              loadOrdersFailure({
                error: 'Failed to load orders. Please try again.'
              })
            )
          )
        )
      )
    )
  );
  loadMultipleCarts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadMultipleCarts),
      mergeMap(({ ids }) =>
        from(ids).pipe(
          mergeMap(id => this.orderService.getOrderById(id)),
          toArray(),
          map(orders => {
            console.log('Carts loaded concurrently:', orders);
            return { type: '[Orders Learning] Multiple Carts Loaded' };
          }),
          catchError(() =>
            of({ type: '[Orders Learning] Multiple Carts Failed' })
          )
        )
      )
    )
  );
  loadMultipleCartsSequentially$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadMultipleCartsSequentially),
      mergeMap(({ ids }) =>
        from(ids).pipe(
          concatMap(id => this.orderService.getOrderById(id)),
          toArray(),
          map(orders => {
            console.log('Carts loaded sequentially:', orders);

            return {
              type: '[Orders Learning] Sequential Carts Loaded'
            };
          }),
          catchError(() =>
            of({
              type: '[Orders Learning] Sequential Carts Failed'
            })
          )
        )
      )
    )
  );
  loadOrderDashboardSummary$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadOrderDashboardSummary),
      switchMap(() =>
        forkJoin({
          ordersResponse: this.orderService.getOrders(1, 10),
          cart: this.orderService.getOrderById(1)
        }).pipe(
          map(({ ordersResponse, cart }) => {
            console.log('forkJoin - Orders:', ordersResponse);
            console.log('forkJoin - Cart:', cart);

            return loadOrderDashboardSummarySuccess({
              ordersResponse,
              cart
            });
          }),
          catchError(() =>
            of(
              loadOrderDashboardSummaryFailure({
                error: 'Failed to load order dashboard summary.'
              })
            )
          )
        )
      )
    )
  );
  refreshOrders$ = createEffect(() =>
  this.actions$.pipe(
    ofType(refreshOrders),
    withLatestFrom(
      this.store.select(selectOrderPage),
      this.store.select(selectOrderLimit)
    ),
    map(([_, page, limit]) =>
      loadOrders({ page, limit })
    )
  )
);
}


