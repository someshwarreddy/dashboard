import { Component, inject, OnInit, computed } from '@angular/core';
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
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { Title } from '@angular/platform-browser';
@Component({
  selector: 'app-product-page',
  imports: [ReactiveFormsModule, ProductList, ProductSearch,],
  templateUrl: './product-page.html',
  styleUrl: './product-page.scss',
})
export class ProductPage implements OnInit {
  private actions$ = inject(Actions);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private store = inject(Store);
  editingProduct: Product | null = null;
  private fb = inject(FormBuilder);
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  private title = inject(Title);
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
    const title = this.route.snapshot.data['title'];
    this.title.setTitle(title);
    this.route.queryParamMap.subscribe(params => {
      const search = params.get('search') ?? '';
      const sort = params.get('sort') ?? '';
      const page = Number(params.get('page') ?? 1);
      const limit = this.limit();
      if (search.trim()) {
        this.store.dispatch(
          ProductActions.searchProducts({
            query: search,
            page,
            limit,
            sort
          })
        );
      } else {
        this.store.dispatch(
          ProductActions.loadProducts({
            page,
            limit,
            sort
          })
        );
      }
    });
  }
  @ViewChild(ProductForm)
  productFormComponent!: ProductForm;

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
  page = this.store.selectSignal(
    ProductSelectors.selectPage
  );
  limit = this.store.selectSignal(
    ProductSelectors.selectLimit
  );
  totalPages = this.store.selectSignal(
    ProductSelectors.selectTotalPages
  );
  changePage(page: number) {
    this.router.navigate([], {
      queryParams: { page },
      queryParamsHandling: 'merge'
    });
  }
  selectProduct(id: number) {
    this.router.navigate(['/products', id]);

  }
  updateSearchUrl(query: string) {
    this.router.navigate([], {
      queryParams: {
        search: query || null,
        page: 1
      },
      queryParamsHandling: 'merge'
    });
  }
  changeSort(sort: string) {
    console.log('SORT VALUE:', sort);

    this.router.navigate([], {
      queryParams: {
        sort: sort || null,
        page: 1
      },
      queryParamsHandling: 'merge'
    });

  }
  clearSelectedProduct() {
    this.store.dispatch(
      ProductActions.clearSelectedProduct()
    );
  }

  deleteProduct(id: number) {
   if (confirm(`Are you sure you want to delete product with ID ${id}?`)) {
    this.store.dispatch(
      ProductActions.deleteProduct({ id })
    );
  }
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
    this.router.navigate(['/products/new']);
  }
  pages = computed(() =>
    Array.from(
      { length: this.totalPages() },
      (_, index) => index + 1
    )
  );
}
