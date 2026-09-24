import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from '../models/product';

export const selectAuthState =
  createFeatureSelector<AuthState>('auth');

export const selectUser = createSelector(
  selectAuthState,
  state => state.user
);

export const selectIsAuthenticated = createSelector(
  selectAuthState,
  state => state.isAuthenticated
);

export const selectLoading = createSelector(
  selectAuthState,
  state => state.loading
);

export const selectError = createSelector(
  selectAuthState,
  state => state.error
);
export const selectAuthInitialized = createSelector(
  selectAuthState,
  state => state.authInitialized
);