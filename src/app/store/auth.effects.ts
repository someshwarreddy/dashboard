import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { Router } from '@angular/router';
import * as AuthActions from './auth.actions';
import { AuthService } from './../services/auth';

@Injectable()
export class AuthEffects {
private router = inject(Router);
  private actions$ = inject(Actions);
  private authService = inject(AuthService);

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),

      switchMap(({ email, password }) =>
        this.authService.login({
          email,
          password
        }).pipe(

          map(response =>
            AuthActions.loginSuccess({
              token: response.token
            })
          ),

          catchError(error =>
            of(
              AuthActions.loginFailure({
                error: error.message
              })
            )
          )

        )
      )
    )
  );
  saveToken$ = createEffect(
  () =>
    this.actions$.pipe(
      ofType(AuthActions.loginSuccess),
      tap(({ token }) => {
        localStorage.setItem('token', token);
      })
    ),
  { dispatch: false }
);

// restoreAuth$ = createEffect(() =>
//   this.actions$.pipe(
//     ofType(AuthActions.restoreAuth),

//     switchMap(() =>
//       this.authService.getLoggedInUser().pipe(
//         map(response =>
//           AuthActions.restoreAuthSuccess({
//             user: response.user
//           })
//         ),

//         catchError(error =>
//           of(
//             AuthActions.restoreAuthFailure({
//               error: error.error?.message ?? 'Session expired'
//             })
//           )
//         )
//       )
//     )
//   )
// );
restoreAuth$ = createEffect(() =>
  this.actions$.pipe(
    ofType(AuthActions.restoreAuth),

    switchMap(() => {
      const token = localStorage.getItem('token');

      if (!token) {
        return of(
          AuthActions.restoreAuthFailure({
            error: 'No token'
          })
        );
      }

      return this.authService.getLoggedInUser().pipe(
        map(response =>
          AuthActions.restoreAuthSuccess({
            user: response.user
          })
        ),
        catchError(error =>
          of(
            AuthActions.restoreAuthFailure({
              error: error.error?.message ?? 'Session expired'
            })
          )
        )
      );
    })
  )
);
logout$ = createEffect(
  () =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      tap(() => {
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
      })
    ),
  { dispatch: false }
);
}