import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import * as ProductActions from './store/product.actions';
import * as ProductSelectors from './store/product.selectors';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('enterprise-dashboard');
  private store = inject(Store);
  loading = this.store.selectSignal(
    ProductSelectors.selectLoading
  );

  products = this.store.selectSignal(
  ProductSelectors.selectProducts
); 

  loadProducts() {
    this.store.dispatch(ProductActions.loadProducts());
  }
}
