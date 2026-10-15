import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { OrderService } from '../services/order.service';
import {
  loadOrders,
  loadOrdersFailure,
  loadOrdersSuccess
} from './order.actions';

@Injectable()
export class OrderEffects {
  private actions$ = inject(Actions);
  private orderService = inject(OrderService);

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
}