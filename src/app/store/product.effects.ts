import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, exhaustMap, of, switchMap , debounceTime, distinctUntilChanged} from 'rxjs';

import * as ProductActions from './product.actions';
import { ProductService } from '../services/product.service';

@Injectable()
export class ProductEffects {

  private actions$ = inject(Actions);
  private productService = inject(ProductService);

  loadProducts$ = createEffect(() =>
    this.actions$.pipe(

      ofType(ProductActions.loadProducts),

      exhaustMap(() =>
        this.productService.getProducts().pipe(

          map(products =>
            ProductActions.loadProductsSuccess({
              products
            })
          ),

          catchError(error =>
            of(
              ProductActions.loadProductsFailure({
                error: error.message
              })
            )
          )

        )
      )
    )
  );
  
searchProducts$ = createEffect(() =>
  this.actions$.pipe(
    ofType(ProductActions.searchProducts),
    map(({ query }) => query),
    debounceTime(500),
        distinctUntilChanged(),
    switchMap( query  =>
      this.productService.searchProducts(query).pipe(
        map(products =>
          ProductActions.searchProductsSuccess({ products })
        )
      )
    )
  )
);

}