import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { CreateProduct, Product } from '../../models/product';
import * as ProductActions from '../../store/product.actions';
import * as ProductSelectors from '../../store/product.selectors';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ProductCard } from '../../components/product-card/product-card';
import { ProductList } from '../../components/product-list/product-list';
import { ProductSearch } from '../../components/product-search/product-search';
import { ProductDetails } from '../../components/product-details/product-details';
import { ProductForm } from '../../components/product-form/product-form';
import { ViewChild } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
@Component({
  selector: 'app-product-page',
  imports: [ReactiveFormsModule, ProductList , ProductSearch, ProductDetails, ProductForm, ],
  templateUrl: './product-page.html',
  styleUrl: './product-page.scss',
})
export class ProductPage implements OnInit {
  private actions$ = inject(Actions);
  private router = inject(Router);
  private store = inject(Store);
  editingProduct: Product | null = null;
  private fb = inject(FormBuilder);
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  constructor() {
  this.actions$
    .pipe(
      ofType(ProductActions.createProductSuccess),
      takeUntilDestroyed()
    )
    .subscribe(() => {
      this.productFormComponent.reset();
    });
}
  ngOnInit() {
    if (this.products().length === 0) {
    this.loadProducts();
  }
  }
@ViewChild(ProductForm)
productFormComponent!: ProductForm;
  productForm = this.fb.group({
    title: [''],
    price: [0]
  });
  loading = this.store.selectSignal(
    ProductSelectors.selectLoading
  );

  products = this.store.selectSignal(
    ProductSelectors.selectProducts
  );

  error = this.store.selectSignal(
    ProductSelectors.selectError
  );
  selectedProduct = this.store.selectSignal(
    ProductSelectors.selectSelectedProduct
  );
  deletingId = this.store.selectSignal(
    ProductSelectors.selectDeletingId
  );
  creating = this.store.selectSignal(
    ProductSelectors.selectCreating
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
// this is the from the store technique to select product and navigate to product details page
  // selectProduct(id: number) {
  //   alert(`You selected product with ID ${id}`);
  //   this.store.dispatch(
  //     ProductActions.selectProduct({ id })
  //   );
  // }

  // routing technique to navigate to product details page
  selectProduct(id: number) {
  this.router.navigate(['/products', id]);
}
  clearSelectedProduct() {
    this.store.dispatch(
      ProductActions.clearSelectedProduct()
    );
  }
  deleteProduct(id: number) {
    alert(`Are you sure you want to delete product with ID ${id}?`);
    this.store.dispatch(
      ProductActions.deleteProduct({ id })
    );
  }
  startEdit(product: Product) {
    this.editingProduct = { ...product };
  }
  updateProduct(product: Product) {
    this.store.dispatch(
      ProductActions.updateProduct({ product })
    );
  }
  putProduct(product: Product) {
    this.store.dispatch(
      ProductActions.putProduct({ product })
    );
  }
  // createProduct() {
  //   const formValue = this.productForm.value;

  //   if (!this.selectedFile) {
  //     console.log('Please select an image');
  //     return;
  //   }

  //   const product = {
  //     title: formValue.title ?? '',
  //     price: formValue.price ?? 0,
  //     image: this.selectedFile
  //   };

  //   this.store.dispatch(
  //     ProductActions.createProduct({ product })
  //   );
  // }
  //   onImageSelected(event: Event) {
  //   const input = event.target as HTMLInputElement;

  //   const file = input.files?.[0];

  //   if (!file) {
  //     return;
  //   }

  //   this.selectedFile = file;
  //   this.imagePreview = URL.createObjectURL(file);
  //   console.log(this.selectedFile);
    
  // }
  // createProduct(product: CreateProduct) {
  //   this.store.dispatch(
  //     ProductActions.createProduct({ product })
  //   );
  // }
  // private router = inject(Router);

createProduct() {
  this.router.navigate(['/products/new']);
}
}
