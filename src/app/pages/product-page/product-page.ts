import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Product } from '../../models/product';
import * as ProductActions from '../../store/product.actions';
import * as ProductSelectors from '../../store/product.selectors';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ProductCard } from '../../components/product-card/product-card';
import { ProductList } from '../../components/product-list/product-list';
@Component({
  selector: 'app-product-page',
  imports: [ReactiveFormsModule, ProductCard, ProductList],
  templateUrl: './product-page.html',
  styleUrl: './product-page.scss',
})
export class ProductPage implements OnInit {
  private store = inject(Store);
  editingProduct: Product | null = null;
  private fb = inject(FormBuilder);
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  ngOnInit() {
    this.loadProducts();
  }

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

  selectProduct(id: number) {
    this.store.dispatch(
      ProductActions.selectProduct({ id })
    );
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
  createProduct() {
    const formValue = this.productForm.value;

    if (!this.selectedFile) {
      console.log('Please select an image');
      return;
    }

    const product = {
      title: formValue.title ?? '',
      price: formValue.price ?? 0,
      image: this.selectedFile
    };

    this.store.dispatch(
      ProductActions.createProduct({ product })
    );
  }
    onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    const file = input.files?.[0];

    if (!file) {
      return;
    }

    this.selectedFile = file;
    this.imagePreview = URL.createObjectURL(file);
    console.log(this.selectedFile);
    
  }
}
