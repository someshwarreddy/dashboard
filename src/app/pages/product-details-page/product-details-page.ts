import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router  } from '@angular/router';
import { Component, effect, inject } from '@angular/core';
import * as ProductActions from '../../store/product.actions';
import * as ProductSelectors from '../../store/product.selectors';
import { ProductDetails } from '../../components/product-details/product-details';
import { Product } from '../../models/product';
@Component({
  selector: 'app-product-details-page',
  imports: [ProductDetails],
  templateUrl: './product-details-page.html',
  styleUrl: './product-details-page.scss',
})
export class ProductDetailsPage {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private store = inject(Store);
  productId = toSignal(
    this.route.paramMap.pipe(
      map(params => Number(params.get('id')))
    )
  );
  constructor() {
    effect(() => {
      const id = this.productId();
      console.log('Product ID:', id);
      if (id) {
        this.store.dispatch(
          ProductActions.loadProduct({ id })
        );
      }
    });
  }
  // productId = Number(
  //   this.route.snapshot.paramMap.get('id')
  // );
  product = this.store.selectSignal(
    ProductSelectors.selectProductDetails
  );
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
}
