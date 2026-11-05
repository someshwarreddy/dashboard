import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as AuthSelectors from '../store/auth.selectors';
import { filter, map, switchMap, take } from 'rxjs';


export const authGuard: CanActivateFn = (route, state) => {

  const store = inject(Store);

  const router = inject(Router);

  return store.select(AuthSelectors.selectAuthInitialized).pipe(

    filter(initialized => initialized),

    take(1),

    switchMap(() =>
      store.select(AuthSelectors.selectIsAuthenticated).pipe(

        take(1),

        map(isAuthenticated =>
          isAuthenticated
            ? true
            : router.createUrlTree(['/login'], {
                queryParams: {
                  returnUrl: state.url
                }
              })
        )

      )
    )

  );

};