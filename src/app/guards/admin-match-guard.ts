import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter, map, take } from 'rxjs';
import {
  selectAuthInitialized,
  selectUser
} from '../store/auth.selectors';

export const adminMatchGuard: CanMatchFn = () => {
  const store = inject(Store);
  const router = inject(Router);

  return store.select(selectAuthInitialized).pipe(
    filter(initialized => initialized),
    take(1),
    map(() => {
      const user = store.selectSignal(selectUser)();

      console.log('CAN MATCH - USER:', user);

      if (!user) {
        return router.createUrlTree(['/login']);
      }

      return user.role === 'admin';
    })
  );
};