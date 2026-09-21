import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, exhaustMap, of, switchMap, debounceTime, distinctUntilChanged } from 'rxjs';

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
      switchMap(query =>
        this.productService.searchProducts(query).pipe(
          map(products =>
            ProductActions.searchProductsSuccess({ products })
          )
        )
      ),
      catchError(error =>
        of(
          ProductActions.searchProductsFailure({
            error: error.message
          })
        )
      )
    )
  )
  deleteProduct$ = createEffect(() =>
  this.actions$.pipe(
    ofType(ProductActions.deleteProduct),
    exhaustMap(({ id }) =>
      this.productService.deleteProduct(id).pipe(
        map(() =>
          ProductActions.deleteProductSuccess({ id })
        ),
        catchError(error =>
          of(
            ProductActions.deleteProductFailure({
              error: error.message
            })
          )
        )
      )
    )
  )
);
updateProduct$ = createEffect(() =>
  this.actions$.pipe(
    ofType(ProductActions.updateProduct),
    switchMap(({ product }) =>
      this.productService.updateProduct(product).pipe(
        map(updatedProduct =>
          ProductActions.updateProductSuccess({
            product: updatedProduct
          })
        ),
        catchError(error =>
          of(
            ProductActions.updateProductFailure({
              error: error.message
            })
          )
        )
      )
    )
  )
);
putProduct$ = createEffect(() =>
  this.actions$.pipe(
    ofType(ProductActions.putProduct),

    switchMap(({ product }) =>
      this.productService.putProduct(product).pipe(

        map(updatedProduct =>
          ProductActions.putProductSuccess({
            product: updatedProduct
          })
        ),

        catchError(error =>
          of(
            ProductActions.putProductFailure({
              error: error.message
            })
          )
        )
      )
    )
  )
);
createProduct$ = createEffect(() =>
  this.actions$.pipe(
    ofType(ProductActions.createProduct),

    switchMap(({ product }) =>
      this.productService.createProduct(product).pipe(

        map(createdProduct =>
          ProductActions.createProductSuccess({
            product: createdProduct
          })
        ),

        catchError(error =>
          of(
            ProductActions.createProductFailure({
              error: error.message
            })
          )
        )

      )
    )
  )
);
loadProduct$ = createEffect(() =>
  this.actions$.pipe(
    ofType(ProductActions.loadProduct),

    switchMap(({ id }) =>
      this.productService.getProductById(id).pipe(

        map(product =>
          ProductActions.loadProductSuccess({ product })
        ),

        catchError(error =>
          of(
            ProductActions.loadProductFailure({
              error: error.message
            })
          )
        )

      )
    )
  )
);
}