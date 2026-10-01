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

      switchMap(({ email, password, returnUrl }) =>
        this.authService.login({
          email,
          password,
        
        }).pipe(

          map(response =>
            AuthActions.loginSuccess({
              token: response.token,
              returnUrl
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
register$ = createEffect(() =>
  this.actions$.pipe(
    ofType(AuthActions.register),

    switchMap(({ name, email, password }) =>
      this.authService.register({
        name,
        email,
        password
      }).pipe(

        map(() =>
          AuthActions.registerSuccess()
        ),

        catchError(error =>
          of(
            AuthActions.registerFailure({
              error: error.error?.message ?? 'Registration failed'
            })
          )
        )

      )
    )
  )
);
registerSuccess$ = createEffect(
  () =>
    this.actions$.pipe(
      ofType(AuthActions.registerSuccess),
      tap(() => {
        this.router.navigate(['/login']);
      })
    ),
  { dispatch: false }
);
// loginSuccess$ = createEffect(
//   () =>
//     this.actions$.pipe(
//       ofType(AuthActions.loginSuccess),
//       tap(() => {
//         this.router.navigate(['/products']);
//       })
//     ),
//   { dispatch: false }
// );
// loginSuccess$ = createEffect(
//   () =>
//     this.actions$.pipe(
//       ofType(AuthActions.loginSuccess),
//       tap(({ returnUrl }) => {
//         this.router.navigateByUrl(
//           returnUrl || '/products'
//         );
//       })
//     ),
//   { dispatch: false }
// );
// loginSuccess$ = createEffect(
//   () =>
//     this.actions$.pipe(
//       ofType(AuthActions.loginSuccess),
//       tap(({ returnUrl }) => {


//         const destination =
//           returnUrl &&
//           returnUrl.startsWith('/') &&
//           !returnUrl.startsWith('//')
//             ? returnUrl
//             : '/products';

//         this.router.navigateByUrl(destination);
//       })
//     ),
//   { dispatch: false }
// );
loadCurrentUser$ = createEffect(() =>
  this.actions$.pipe(
    ofType(AuthActions.loadCurrentUser),

    switchMap(({ returnUrl }) =>
      this.authService.getLoggedInUser().pipe(

        map(response =>
          AuthActions.loadCurrentUserSuccess({
            user: response.user,
            returnUrl
          })
        ),

        catchError(error =>
          of(
            AuthActions.loadCurrentUserFailure({
              error:
                error.error?.message ??
                'Failed to load user'
            })
          )
        )

      )
    )
  )
);
loadCurrentUserSuccess$ = createEffect(
  () =>
    this.actions$.pipe(
      ofType(AuthActions.loadCurrentUserSuccess),

      tap(({ returnUrl }) => {
        const destination =
          returnUrl &&
          returnUrl.startsWith('/') &&
          !returnUrl.startsWith('//')
            ? returnUrl
            : '/products';

        this.router.navigateByUrl(destination);
      })
    ),
  { dispatch: false }
);
loadCurrentUserAfterLogin$ = createEffect(() =>
  this.actions$.pipe(
    ofType(AuthActions.loginSuccess),

    map(({ returnUrl }) =>
      AuthActions.loadCurrentUser({
        returnUrl
      })
    )
  )
);
}