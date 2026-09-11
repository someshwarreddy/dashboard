import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { routes } from './app.routes';
import { productReducer } from './store/product.reducer';
import { provideEffects } from '@ngrx/effects';
import { ProductEffects } from './store/product.effects';
import { provideHttpClient } from '@angular/common/http';
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideStore({ product: productReducer }),
    provideHttpClient(),
    provideEffects([ProductEffects])
  ]
};


