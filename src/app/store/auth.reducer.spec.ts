
import { describe, it, expect } from 'vitest';
import { initialState, authReducer } from './auth.reducer';
import * as AuthActions from './auth.actions';

describe('authReducer', () => {
  it('should return the initial state for an unknown action', () => {
    const action = { type: 'UNKNOWN_ACTION' };

    const state = authReducer(initialState, action);

    expect(state).toEqual(initialState);
  });
  it('should handle login action', () => {
    const action = AuthActions.login({
        email: 'test@example.com',
        password: 'password',
        returnUrl: null
    });
    const state = authReducer(initialState, action);
    expect(state.authInitialized).toBe(false);
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
   
  });
  it('should handle loginSuccess action', () => {
    const action = AuthActions.loginSuccess({
      token: 'dummy-token',
      returnUrl: null
    });
    const state = authReducer(initialState, action);
    expect(state.authInitialized).toBe(false);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.isAuthenticated).toBe(true);
    expect(state.user).toBeNull();
  });
  it('should handle loginFailure action', () => {
    const action = AuthActions.loginFailure({
      error: 'Invalid credentials'
    });
    const state = authReducer(initialState, action);
    expect(state.authInitialized).toBe(false);
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Invalid credentials');
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
  });
    it('should handle restoreAuthSuccess action', () => {   
        const user = { _id: '1', name: 'John Doe', email: 'john.doe@example.com', role: 'admin' as const, token: 'dummy-token' };
        const action = AuthActions.restoreAuthSuccess({ user });
        const state = authReducer(initialState, action);
        expect(state.authInitialized).toBe(true);
        expect(state.loading).toBe(false);
        expect(state.error).toBeNull();
        expect(state.isAuthenticated).toBe(true);
        expect(state.user).toEqual(user);
    });
    it('should handle restoreAuthFailure action', () => {
        const action = AuthActions.restoreAuthFailure({ error: 'Failed to restore auth' });
        const state = authReducer(initialState, action);
        expect(state.authInitialized).toBe(true);
        expect(state.loading).toBe(false);
        expect(state.error).toBe('Failed to restore auth');
        expect(state.isAuthenticated).toBe(false);
        expect(state.user).toBeNull();
    });
    it('should handle logout action', () => {
        const action = AuthActions.logout();
        const state = authReducer(initialState, action);
        expect(state.authInitialized).toBe(false);
        expect(state.loading).toBe(false);
        expect(state.error).toBeNull();
        expect(state.isAuthenticated).toBe(false);
        expect(state.user).toBeNull();
    });
    it('should handle register action', () => {
        const action = AuthActions.register({
            name: 'John Doe',
            email: 'john.doe@example.com',
            password: 'password'
        });
        const state = authReducer(initialState, action);
        expect(state.authInitialized).toBe(false);
        expect(state.loading).toBe(true);
        expect(state.error).toBeNull();
        expect(state.isAuthenticated).toBe(false);
        expect(state.user).toBeNull();
    });
    it('should handle registerSuccess action', () => {
        const action = AuthActions.registerSuccess();
        const state = authReducer(initialState, action);
        expect(state.authInitialized).toBe(false);
        expect(state.loading).toBe(false);
        expect(state.error).toBeNull();
        expect(state.isAuthenticated).toBe(false);
        expect(state.user).toBeNull();
    });
    it('should handle registerFailure action', () => {
        const action = AuthActions.registerFailure({ error: 'Registration failed' });
        const state = authReducer(initialState, action);
        expect(state.authInitialized).toBe(false);
        expect(state.loading).toBe(false);
        expect(state.error).toBe('Registration failed');
        expect(state.isAuthenticated).toBe(false);
        expect(state.user).toBeNull();
    });
    it('should handle loadCurrentUserSuccess action', () => {
        const user = { _id: '1', name: 'John Doe', email: 'john.doe@example.com', role: 'admin' as const, token: 'dummy-token' };
        const action = AuthActions.loadCurrentUserSuccess({
            user,
            returnUrl: null
        });
        const state = authReducer(initialState, action);
     
        expect(state.error).toBeNull();
      
        expect(state.user).toEqual(user);
    });
    it('loadCurrentUserFailure should handle loadCurrentUserFailure action', () => {
        const action = AuthActions.loadCurrentUserFailure({ error: 'Failed to load current user' });
        const state = authReducer(initialState, action);
        expect(state.error).toBe('Failed to load current user');
        expect(state.user).toBeNull();
    });
});
