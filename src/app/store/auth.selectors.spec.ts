import { describe, it, expect } from 'vitest';
import { AuthState } from '../models/product';
import {
  selectUser,
  selectIsAuthenticated,
  selectLoading,
  selectError,
  selectAuthInitialized
} from './auth.selectors';

describe('Auth Selectors', () => {
it('should return authenticated user', () => {
  const user = {
    _id: '1',
    name: 'Admin User',
    role: 'admin',
    email: 'admin@example.com'
  };

  const result = selectUser.projector({
    user
  } as AuthState);

  expect(result).toEqual(user);
});
it('should return authentication status', () => {
  const result = selectIsAuthenticated.projector({
    isAuthenticated: true
  } as AuthState);

  expect(result).toBe(true);
});
it('should return loading state', () => {
  const result = selectLoading.projector({
    loading: true
  } as AuthState);

  expect(result).toBe(true);
});
it('should return error state', () => {
  const error = 'Invalid credentials';

  const result = selectError.projector({
    error
  } as AuthState);

  expect(result).toBe(error);
});
it('should return auth initialized state', () => {
  const result = selectAuthInitialized.projector({
    authInitialized: true
  } as AuthState);

  expect(result).toBe(true);
});
});