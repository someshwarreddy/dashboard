import { createAction, props } from '@ngrx/store';
import { User } from '../models/product';


export const login = createAction(
  '[Auth] Login',
  props<{
    email: string;
    password: string;
    returnUrl: string | null;
  }>()
);

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{
    token: string;
    returnUrl: string | null;
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

export const register = createAction(
  '[Auth] Register',
  props<{
    name: string;
    email: string;
    password: string;
  }>()
);

export const registerSuccess = createAction(
  '[Auth] Register Success'
);

export const registerFailure = createAction(
  '[Auth] Register Failure',
  props<{ error: string }>()
);
export const loadCurrentUser = createAction(
  '[Auth] Load Current User',
    props<{ returnUrl: string | null }>()
);

export const loadCurrentUserSuccess = createAction(
  '[Auth] Load Current User Success',
  props<{
    user: User;
    returnUrl: string | null;
  }>()
);

export const loadCurrentUserFailure = createAction(
  '[Auth] Load Current User Failure',
  props<{ error: string }>()
);
