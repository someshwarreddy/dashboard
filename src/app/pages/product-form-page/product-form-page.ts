import { Component, effect, HostListener, inject, ViewChild } from '@angular/core';
import { ProductForm } from '../../components/product-form/product-form';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import * as ProductActions from '../../store/product.actions';
import * as ProductSelectors from '../../store/product.selectors';
import { CreateProduct, Product } from '../../models/product';
@Component({
  selector: 'app-product-form-page',
  imports: [ProductForm],
  templateUrl: './product-form-page.html',
  styleUrl: './product-form-page.scss',
})
export class ProductFormPage {
  private route = inject(ActivatedRoute);
  private store = inject(Store);
  @ViewChild(ProductForm)
productFormComponent!: ProductForm;
  productId = toSignal(
    this.route.paramMap.pipe(
      map(params => {
        const id = params.get('id');
        return id ? Number(id) : null;
      })
    ),
    { initialValue: null }
  );
  constructor() {
    effect(() => {
      const id = this.productId();

      if (id) {
        this.store.dispatch(
          ProductActions.loadProduct({ id })
        );
      }
    });
  }

  product = this.store.selectSignal(
    ProductSelectors.selectProductDetails
  );
  saveProduct(product: CreateProduct) {
     console.log('STEP 1: Parent received product:', product);
    const id = this.productId();
 
    if (id === null) {
         console.log('STEP 2: Dispatching createProduct');
      // CREATE
      this.store.dispatch(
        ProductActions.createProduct({ product })
      );

      return;
    }
    // UPDATE


    const existingProduct = this.product();
    if (!existingProduct) {
      console.error('Product not found for update');
      return;
    }
    const updatedProduct: Product = {
      ...existingProduct,
      title: product.title,
      price: product.price
    };

    this.store.dispatch(
      ProductActions.updateProduct({
        product: updatedProduct
      })
    );
  }
  canDeactivate():  boolean | Promise<boolean> {
    console.log('🔥 ProductFormPage canDeactivate CALLED');

  const result = this.productFormComponent.canDeactivate();

  console.log('🔥 ProductFormPage result:', result);

  return result;
}
@HostListener('window:beforeunload', ['$event'])
onBeforeUnload(event: BeforeUnloadEvent) {
  if (this.productFormComponent?.productForm.dirty) {
    event.preventDefault();
    event.returnValue = '';
  }
}
}
