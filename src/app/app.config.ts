import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { routes } from './app.routes';
import { productReducer } from './store/product.reducer';
import { provideEffects } from '@ngrx/effects';
import { ProductEffects } from './store/product.effects';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './interceptors/auth-interceptor';
import { authReducer } from './store/auth.reducer';
import { AuthEffects } from './store/auth.effects';
import { orderReducer } from './store/order.reducer';
import { OrderEffects } from './store/order.effects';
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideStore({ product: productReducer, auth: authReducer,  orders: orderReducer }),
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),
    provideEffects([ProductEffects, AuthEffects, OrderEffects])
  ]
};


