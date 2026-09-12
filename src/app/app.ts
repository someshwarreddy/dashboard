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

  failerror = this.store.selectSignal(
    ProductSelectors.selectError
  );
  selectedProduct = this.store.selectSignal(
    ProductSelectors.selectSelectedProduct
  );
  loadProducts() {
    this.store.dispatch(ProductActions.loadProducts());
  }

  searchProducts(query: string) {
    if (!query.trim()) {
      this.loadProducts();
      return;
    }

    this.store.dispatch(
      ProductActions.searchProducts({ query })
    );
  }

  selectProduct(id: number) {
  this.store.dispatch(
    ProductActions.selectProduct({ id })
  );
}
}
