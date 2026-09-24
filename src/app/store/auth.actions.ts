import { createAction, props } from '@ngrx/store';
import { User } from '../models/product';


export const login = createAction(
  '[Auth] Login',
  props<{
    email: string;
    password: string;
  }>()
);

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{
    token: string;
  }>()
);

export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{
    error: string;
  }>()
);
export const restoreAuth = createAction(
  '[Auth] Restore Auth'
);
export const restoreAuthSuccess = createAction(
  '[Auth] Restore Auth Success',
  props<{ user: User }>()
);

export const restoreAuthFailure = createAction(
  '[Auth] Restore Auth Failure',
  props<{ error: string }>()
);
export const logout = createAction(
  '[Auth] Logout'
);