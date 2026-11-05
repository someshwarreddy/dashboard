
import { Store } from '@ngrx/store';
import {  Router, RouterLink,  RouterOutlet } from '@angular/router';
import { Component, computed, inject, input, } from '@angular/core';
import * as ProductSelectors from '../../store/product.selectors';
import { ProductDetails } from '../../components/product-details/product-details';
import { Product } from '../../models/product';
import { Title } from '@angular/platform-browser';
@Component({
  selector: 'app-product-details-page',
  imports: [ProductDetails, RouterLink, RouterOutlet],
  templateUrl: './product-details-page.html',
  styleUrl: './product-details-page.scss',
})
export class ProductDetailsPage {
  // private route = inject(ActivatedRoute);
  private router = inject(Router);
  private store = inject(Store);
  title = inject(Title)
  id  = input<string>();
  tab = input<string>();

  // Derived signals
  productId = computed(() => {
    const id = this.id();
    return id ? Number(id) : null;
  });

  activeTab = computed(() => this.tab() || 'overview');
  // Product details maintained in NgRx
  storedProduct = this.store.selectSignal(
    ProductSelectors.selectProductDetails
  );
  // Data resolved by Angular Router
  product = input<Product | undefined>();
  goBack() {
    this.router.navigate(['/products']);
  }

  editProduct(product: Product) {
    this.router.navigate([
      '/products',
      product.id,
      'edit'
    ]);
  }
  changeTab(tab: string) {
    this.router.navigate([], {
      queryParams: {
        tab
      },
      queryParamsHandling: 'merge'
    });
  }

}
