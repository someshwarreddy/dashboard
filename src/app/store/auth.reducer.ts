import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';
import { AuthState } from '../models/product';

export const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  authInitialized: false
};

export const authReducer = createReducer(

  initialState,

  on(AuthActions.login, state => ({
    ...state,
    loading: true,
    error: null
  })),

  // on(AuthActions.loginSuccess, state => ({

  //   ...state,
  //   isAuthenticated: true,
  //   loading: false,
  //   error: null
  // })),
  on(AuthActions.loginSuccess, (state, { token }) => {
    console.log('LOGIN SUCCESS REACHED REDUCER');
    console.log('TOKEN:', token);

    return {
      ...state,
      isAuthenticated: true,
      loading: false,
      error: null,
  
    };
  }),

  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    isAuthenticated: false,
    loading: false,
    error,
  
  })),
  on(AuthActions.restoreAuthSuccess, (state, { user }) => ({
    ...state,
    user,
    isAuthenticated: true,
    loading: false,
    error: null,
    authInitialized: true
  })),
  on(AuthActions.restoreAuthFailure, (state, { error }) => ({
    ...state,
    user: null,
    isAuthenticated: false,
    loading: false,
    error,
    authInitialized: true
  })),
  on(AuthActions.logout, state => ({
  ...state,
  user: null,
  isAuthenticated: false,
  error: null
})),
on(AuthActions.register, state => ({
  ...state,
  loading: true,
  error: null
})),
on(AuthActions.registerSuccess, state => ({
  ...state,
  loading: false,
  error: null
})),
on(AuthActions.registerFailure, (state, { error }) => ({
  ...state,
  loading: false,
  error
})),
on(AuthActions.loadCurrentUserSuccess, (state, { user }) => ({
  ...state,
  user,
  error: null
})),
on(AuthActions.loadCurrentUserFailure, (state, { error }) => ({
  ...state,
  error
})),
);