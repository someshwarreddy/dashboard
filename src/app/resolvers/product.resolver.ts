import { inject } from '@angular/core';
import {
    RedirectCommand,
    ResolveFn,
    Router
} from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { filter, map, of, switchMap, take } from 'rxjs';

import { Product } from '../models/product';
import * as ProductActions from '../store/product.actions';
import * as ProductSelectors from '../store/product.selectors';
export const productResolver: ResolveFn<Product> = (route) => {
    const actions$ = inject(Actions);
    const store = inject(Store);
    const router = inject(Router);

    const id = Number(route.paramMap.get('id'));

    console.log('🔥 PRODUCT RESOLVER CALLED', id);
    return store.select(ProductSelectors.selectProductDetails).pipe(
        //     take(1),
        //     switchMap(product => {
        //         if (product?.id === id) {
        //             return of(product);
        //         }

        //         store.dispatch(ProductActions.loadProduct({ id }));

        //         return store.select(ProductSelectors.selectProductDetails).pipe(
        //             filter((product): product is Product => product?.id === id),
        //             take(1)
        //         );
        //     })
        take(1),

        switchMap(product => {

            // 1. Product already exists in the store
            if (product?.id === id) {
                return of(product);
            }

            // 2. Product is not available → load it
            store.dispatch(
                ProductActions.loadProduct({ id })
            );

            // 3. Wait for success OR failure
            return actions$.pipe(
                ofType(
                    ProductActions.loadProductSuccess,
                    ProductActions.loadProductFailure
                ),
                take(1),

                map(action => {

                    // 4. API success
                    if ('product' in action) {
                        return action.product;
                    }

                    // 5. API failure
                    console.log('🔥 PRODUCT LOAD FAILED:', action.error);

                    return new RedirectCommand(
                        router.parseUrl('/not-found')
                    );
                })
            );
        })
    );
};