import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as AuthSelectors from '../store/auth.selectors';
import { filter, map, switchMap, take } from 'rxjs';

// export const authGuard: CanActivateFn = () => {

//   const store = inject(Store);
//   const router = inject(Router);

//   const isAuthenticated = store.selectSignal(
//     AuthSelectors.selectIsAuthenticated
//   );
//   console.log('Guard:', isAuthenticated());
//   if (isAuthenticated()) {
//     return true;
//   }

//   return router.createUrlTree(['/login']);
// };
export const authGuard: CanActivateFn = () => {
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
            : router.createUrlTree(['/login'])
        )
      )
    )
  );
};