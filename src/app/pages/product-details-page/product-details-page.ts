import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Component, effect, inject, signal } from '@angular/core';
import * as ProductActions from '../../store/product.actions';
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
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private store = inject(Store);
  title = inject(Title)
  productId = toSignal(
    this.route.paramMap.pipe(
      map(params => Number(params.get('id')))
    )
  );
  activeTab = toSignal(
    this.route.queryParamMap.pipe(
      map(params => params.get('tab') || 'overview')
    ),
    { initialValue: 'overview' }
  );
  constructor() {
    // effect(() => {
    //   const id = this.productId();
    //   // console.log('Product ID:', id);
    //   if (id) {
    //     this.store.dispatch(
    //       ProductActions.loadProduct({ id })
    //     );
    //   }
    // });
    this.route.data.subscribe(data => {
    console.log('🔥 RESOLVED DATA:', data);
  });
    const title = this.route.snapshot.data['title'];
    this.title.setTitle(title);
  }

  //   ngOnInit() {


  //    this.route.queryParamMap.subscribe(params => {
  //   const tab = params.get('tab') || 'overview';
  //   this.activeTab.set(tab);
  // });
  // }
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
  changeTab(tab: string) {
    this.router.navigate([], {
      queryParams: {
        tab
      },
      queryParamsHandling: 'merge'
    });
  }

}
