import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { ActivatedRoute, provideRouter, convertToParamMap, Router } from '@angular/router';
import { ProductPage } from './product-page';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of } from 'rxjs';
import { initialState } from '../../store/product.reducer';
import * as ProductActions from '../../store/product.actions';
import * as ProductSelectors from '../../store/product.selectors';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { By } from '@angular/platform-browser';
import { ProductSearch } from '../../components/product-search/product-search';
import { ProductList } from '../../components/product-list/product-list';
describe('ProductPage', () => {
  let component: ProductPage;
  let fixture: ComponentFixture<ProductPage>;
  let actions$: Observable<any>;
  let store: MockStore;

  beforeEach(async () => {
    actions$ = of();

    await TestBed.configureTestingModule({
      imports: [ProductPage],
      providers: [
        provideMockStore({
          initialState: {
            product: initialState
          }
        }),
        provideMockActions(() => actions$),
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: { title: 'Products' }
            },
            queryParamMap: of(convertToParamMap({}))
          }
        }
      ]
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(ProductPage);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch loadProducts on initialization', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    fixture.detectChanges();

    expect(dispatchSpy).toHaveBeenCalledWith(
      ProductActions.loadProducts({
        page: 1,
        limit: 10,
        sort: ''
      })
    );
  });
  it('should dispatch searchProducts when search query exists', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    const route = TestBed.inject(ActivatedRoute);

    vi.spyOn(route, 'queryParamMap', 'get').mockReturnValue(
      of(convertToParamMap({ search: 'phone' }))
    );

    fixture.detectChanges();

    expect(dispatchSpy).toHaveBeenCalledWith(
      ProductActions.searchProducts({
        query: 'phone',
        page: 1,
        limit: 10,
        sort: ''
      })
    );
  });
  it('should dispatch searchProducts with pagination and sorting', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    // Arrange: provide the URL parameters for this test.
    const route = TestBed.inject(ActivatedRoute);

    vi.spyOn(route, 'queryParamMap', 'get').mockReturnValue(
      of(convertToParamMap({
        search: 'phone',
        page: '2',
        sort: 'price-asc'
      }))
    );

    // Act: initialize the component.
    fixture.detectChanges();

    // Assert: verify the dispatched action.
    expect(dispatchSpy).toHaveBeenCalledWith(
      ProductActions.searchProducts({
        query: 'phone',
        page: 2,
        limit: 10,
        sort: 'price-asc'
      })
    );
  });
  it('should update the URL when page changes', () => {
    const router = TestBed.inject(Router);

    const navigateSpy = vi.spyOn(router, 'navigate');

    component.changePage(2);

    expect(navigateSpy).toHaveBeenCalledWith([], {
      queryParams: { page: 2 },
      queryParamsHandling: 'merge'
    });
  });
  it('should update search query params and reset page to 1', () => {
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate');

    component.updateSearchUrl('phone');

    expect(navigateSpy).toHaveBeenCalledWith([], {
      queryParams: {
        search: 'phone',
        page: 1
      },
      queryParamsHandling: 'merge'
    });
  });
  it('should clear search query and reset page to 1', () => {
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate');

    component.updateSearchUrl('');

    expect(navigateSpy).toHaveBeenCalledWith([], {
      queryParams: {
        search: null,
        page: 1
      },
      queryParamsHandling: 'merge'
    });
  });

  it('should update sort query param and reset page to 1', () => {
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate');

    component.changeSort('price-asc');

    expect(navigateSpy).toHaveBeenCalledWith([], {
      queryParams: {
        sort: 'price-asc',
        page: 1
      },
      queryParamsHandling: 'merge'
    });
  });

  it('should clear sort query param and reset page to 1', () => {
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate');

    component.changeSort('');

    expect(navigateSpy).toHaveBeenCalledWith([], {
      queryParams: {
        sort: null,
        page: 1
      },
      queryParamsHandling: 'merge'
    });
  });
  it('should navigate to product details when a product is selected', () => {
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate');

    component.selectProduct(5);

    expect(navigateSpy).toHaveBeenCalledWith(['/products', 5]);
  });
  it('should navigate to create product page', () => {
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate');

    component.createProduct();

    expect(navigateSpy).toHaveBeenCalledWith(['/products/new']);
  });
  it('should dispatch clearSelectedProduct action', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    component.clearSelectedProduct();

    expect(dispatchSpy).toHaveBeenCalledWith(
      ProductActions.clearSelectedProduct()
    );
  });
  it('should dispatch updateProduct action', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    const product = {
      id: 5,
      title: 'Updated Phone',
      price: 500,
      image: 'phone.jpg'
    };

    component.updateProduct(product);

    expect(dispatchSpy).toHaveBeenCalledWith(
      ProductActions.updateProduct({ product })
    );
  });
  it('should dispatch putProduct action', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    const product = {
      id: 5,
      title: 'Updated Phone',
      price: 500,
      image: 'phone.jpg'
    };

    component.putProduct(product);

    expect(dispatchSpy).toHaveBeenCalledWith(
      ProductActions.putProduct({ product })
    );
  });
  it('should set the product being edited', () => {
    const product = {
      id: 5,
      title: 'Phone',
      price: 500,
      image: 'phone.jpg'
    };

    component.startEdit(product);

    expect(component.editingProduct).toEqual(product);
  });

  it('should dispatch deleteProduct action when confirmed', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    component.deleteProduct(5);

    expect(window.confirm).toHaveBeenCalled();

    expect(dispatchSpy).toHaveBeenCalledWith(
      ProductActions.deleteProduct({ id: 5 })
    );
  });

  it('should not dispatch deleteProduct action when cancelled', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    vi.spyOn(window, 'confirm').mockReturnValue(false);

    component.deleteProduct(5);

    expect(dispatchSpy).not.toHaveBeenCalledWith(
      ProductActions.deleteProduct({ id: 5 })
    );
  });

  it('should generate page numbers based on totalPages', () => {
    store.overrideSelector(ProductSelectors.selectTotalPages, 3);
    store.refreshState();
    fixture.detectChanges();

    expect(component.pages()).toEqual([1, 2, 3]);
  });
  it('should return an empty array when totalPages is zero', () => {
    store.overrideSelector(ProductSelectors.selectTotalPages, 0);
    store.refreshState();

    expect(component.pages()).toEqual([]);
  });
  it('should update page numbers when totalPages changes', () => {
    store.overrideSelector(ProductSelectors.selectTotalPages, 3);
    store.refreshState();

    expect(component.pages()).toEqual([1, 2, 3]);

    store.overrideSelector(ProductSelectors.selectTotalPages, 5);
    store.refreshState();

    expect(component.pages()).toEqual([1, 2, 3, 4, 5]);
  }); it('should reflect the loading state from the store', () => {
    store.overrideSelector(ProductSelectors.selectLoading, true);
    store.refreshState();

    expect(component.loading()).toBe(true);
  });
  it('should reflect the products from the store', () => {
    const mockProducts = [
      { id: 1, title: 'Phone', price: 500, image: 'phone.jpg' },
      { id: 2, title: 'Laptop', price: 1000, image: 'laptop.jpg' }
    ];

    store.overrideSelector(
      ProductSelectors.selectProducts,
      mockProducts
    );
    store.refreshState();

    expect(component.products()).toEqual(mockProducts);
  });
  it('should reflect the error state from the store', () => {
    const errorMessage = 'Failed to load products';

    store.overrideSelector(
      ProductSelectors.selectError,
      errorMessage
    );
    store.refreshState();

    expect(component.error()).toBe(errorMessage);
  });
  it('should reflect the selected product from the store', () => {
    const mockProduct = {
      id: 5,
      title: 'Phone',
      price: 500,
      image: 'phone.jpg'
    };

    store.overrideSelector(
      ProductSelectors.selectSelectedProduct,
      mockProduct
    );
    store.refreshState();

    expect(component.selectedProduct()).toEqual(mockProduct);
  });
  it('should reflect the deleting product ID from the store', () => {
    store.overrideSelector(ProductSelectors.selectDeletingId, 5);
    store.refreshState();

    expect(component.deletingId()).toBe(5);
  });
  it('should reflect the creating state from the store', () => {
    store.overrideSelector(ProductSelectors.selectCreating, true);
    store.refreshState();

    expect(component.creating()).toBe(true);
  });
  it('should reflect the current page from the store', () => {
    store.overrideSelector(ProductSelectors.selectPage, 2);
    store.refreshState();

    expect(component.page()).toBe(2);
  }); it('should reflect the page limit from the store', () => {
    store.overrideSelector(ProductSelectors.selectLimit, 10);
    store.refreshState();

    expect(component.limit()).toBe(10);
  });
  it('should reflect the total pages from the store', () => {
  store.overrideSelector(ProductSelectors.selectTotalPages, 5);
  store.refreshState();

  expect(component.totalPages()).toBe(5);
});
it('should dispatch clearSelectedProduct when clearing the selection', () => {
  const dispatchSpy = vi.spyOn(store, 'dispatch');

  component.clearSelectedProduct();

  expect(dispatchSpy).toHaveBeenCalledWith(
    ProductActions.clearSelectedProduct()
  );
});
it('should return null when there is no error', () => {
  store.overrideSelector(ProductSelectors.selectError, null);
  store.refreshState();

  expect(component.error()).toBeNull();
});
it('should return null when no product is selected', () => {
  store.overrideSelector(
    ProductSelectors.selectSelectedProduct,
    null
  );
  store.refreshState();

  expect(component.selectedProduct()).toBeNull();
});
it('should return null when no product is being deleted', () => {
  store.overrideSelector(ProductSelectors.selectDeletingId, null);
  store.refreshState();

  expect(component.deletingId()).toBeNull();
});
it('should return false when no product is being created', () => {
  store.overrideSelector(ProductSelectors.selectCreating, false);
  store.refreshState();

  expect(component.creating()).toBe(false);
});
it('should reflect page 1 when the current page is the first page', () => {
  store.overrideSelector(ProductSelectors.selectPage, 1);
  store.refreshState();

  expect(component.page()).toBe(1);
});
it('should display loading message when loading is true', () => {
  store.overrideSelector(ProductSelectors.selectLoading, true);
  store.refreshState();

  fixture.detectChanges();

  const loadingElement: HTMLElement | null =
    fixture.nativeElement.querySelector('.loading');

  expect(loadingElement).not.toBeNull();
  expect(loadingElement?.textContent).toContain('Loading products...');
});
it('should display error message when an error exists', () => {
  const errorMessage = 'Failed to load products';

  store.overrideSelector(ProductSelectors.selectLoading, false);
  store.overrideSelector(ProductSelectors.selectError, errorMessage);
  store.refreshState();

  fixture.detectChanges();

  const errorElement: HTMLElement | null =
    fixture.nativeElement.querySelector('.error');

  expect(errorElement).not.toBeNull();
  expect(errorElement?.textContent).toContain(errorMessage);
});
it('should display product list when loading is false and no error exists', () => {
  store.overrideSelector(ProductSelectors.selectLoading, false);
  store.overrideSelector(ProductSelectors.selectError, null);
  store.refreshState();

  fixture.detectChanges();

  const productList: HTMLElement | null =
    fixture.nativeElement.querySelector('app-product-list');

  expect(productList).not.toBeNull();
});
it('should display the number of products in the summary', () => {
  const mockProducts = [
    { id: 1, title: 'Phone', price: 500, image: 'phone.jpg' },
    { id: 2, title: 'Laptop', price: 1000, image: 'laptop.jpg' }
  ];

  store.overrideSelector(ProductSelectors.selectProducts, mockProducts);
  store.overrideSelector(ProductSelectors.selectLoading, false);
  store.overrideSelector(ProductSelectors.selectError, null);
  store.refreshState();

  fixture.detectChanges();

  const summary: HTMLElement | null =
    fixture.nativeElement.querySelector('.product-summary');

  expect(summary?.textContent).toContain('Showing 2 products');
});
it('should display pagination when there is more than one page', () => {
  store.overrideSelector(ProductSelectors.selectLoading, false);
  store.overrideSelector(ProductSelectors.selectError, null);
  store.overrideSelector(ProductSelectors.selectTotalPages, 3);
  store.refreshState();

  fixture.detectChanges();

  const pagination: HTMLElement | null =
    fixture.nativeElement.querySelector('.pagination');

  expect(pagination).not.toBeNull();
});
it('should hide pagination when there is only one page', () => {
  store.overrideSelector(ProductSelectors.selectLoading, false);
  store.overrideSelector(ProductSelectors.selectError, null);
  store.overrideSelector(ProductSelectors.selectTotalPages, 1);
  store.refreshState();

  fixture.detectChanges();

  const pagination: HTMLElement | null =
    fixture.nativeElement.querySelector('.pagination');

  expect(pagination).toBeNull();
});
it('should navigate to the selected page when a page button is clicked', () => {
  store.overrideSelector(ProductSelectors.selectLoading, false);
  store.overrideSelector(ProductSelectors.selectError, null);
  store.overrideSelector(ProductSelectors.selectTotalPages, 3);
  store.overrideSelector(ProductSelectors.selectPage, 1);
  store.refreshState();

  const changePageSpy = vi.spyOn(component, 'changePage');

  fixture.detectChanges();

  const pageButtons: HTMLButtonElement[] = Array.from(
    fixture.nativeElement.querySelectorAll('.pagination button')
  );

  const pageTwoButton = pageButtons.find(
    button => button.textContent?.trim() === '2'
  );

  expect(pageTwoButton).toBeDefined();
  pageTwoButton?.click();

  expect(changePageSpy).toHaveBeenCalledWith(2);
});
it('should navigate to the previous page when Previous is clicked', () => {
  store.overrideSelector(ProductSelectors.selectLoading, false);
  store.overrideSelector(ProductSelectors.selectError, null);
  store.overrideSelector(ProductSelectors.selectTotalPages, 3);
  store.overrideSelector(ProductSelectors.selectPage, 2);
  store.refreshState();

  const changePageSpy = vi.spyOn(component, 'changePage');

  fixture.detectChanges();

  const buttons: HTMLButtonElement[] = Array.from(
    fixture.nativeElement.querySelectorAll('.pagination button')
  );

  const previousButton = buttons.find(
    button => button.textContent?.trim() === 'Previous'
  );

  expect(previousButton).toBeDefined();
  expect(previousButton?.disabled).toBe(false);

  previousButton?.click();

  expect(changePageSpy).toHaveBeenCalledWith(1);
});
it('should disable Previous button on the first page', () => {
  store.overrideSelector(ProductSelectors.selectLoading, false);
  store.overrideSelector(ProductSelectors.selectError, null);
  store.overrideSelector(ProductSelectors.selectTotalPages, 3);
  store.overrideSelector(ProductSelectors.selectPage, 1);
  store.refreshState();

  fixture.detectChanges();

  const buttons: HTMLButtonElement[] = Array.from(
    fixture.nativeElement.querySelectorAll('.pagination button')
  );

  const previousButton = buttons.find(
    button => button.textContent?.trim() === 'Previous'
  );

  expect(previousButton).toBeDefined();
  expect(previousButton?.disabled).toBe(true);
});
it('should disable Next button on the last page', () => {
  store.overrideSelector(ProductSelectors.selectLoading, false);
  store.overrideSelector(ProductSelectors.selectError, null);
  store.overrideSelector(ProductSelectors.selectTotalPages, 3);
  store.overrideSelector(ProductSelectors.selectPage, 3);
  store.refreshState();

  fixture.detectChanges();

  const buttons: HTMLButtonElement[] = Array.from(
    fixture.nativeElement.querySelectorAll('.pagination button')
  );

  const nextButton = buttons.find(
    button => button.textContent?.trim() === 'Next'
  );

  expect(nextButton).toBeDefined();
  expect(nextButton?.disabled).toBe(true);
});
it('should call createProduct when the Create Product button is clicked', () => {
  const createProductSpy = vi.spyOn(component, 'createProduct');

  fixture.detectChanges();

  const createButton: HTMLButtonElement | null =
    fixture.nativeElement.querySelector('.create-button');

  expect(createButton).not.toBeNull();

  createProductSpy.mockImplementation(() => {});

  createButton?.click();

  expect(createProductSpy).toHaveBeenCalledOnce();
});
it('should call changeSort when the sort option changes', () => {
  const changeSortSpy = vi.spyOn(component, 'changeSort');

  fixture.detectChanges();

  const sortSelect: HTMLSelectElement | null =
    fixture.nativeElement.querySelector('.sort-select');

  expect(sortSelect).not.toBeNull();

  sortSelect!.value = 'price-desc';
  sortSelect!.dispatchEvent(new Event('change'));

  expect(changeSortSpy).toHaveBeenCalledWith('price-desc');
});
it('should call updateSearchUrl when the search component emits a search term', () => {
  const updateSearchSpy = vi.spyOn(component, 'updateSearchUrl');

  fixture.detectChanges();

  const searchDebugElement = fixture.debugElement.query(
    By.directive(ProductSearch)
  );

  searchDebugElement.triggerEventHandler('search', 'phone');

  expect(updateSearchSpy).toHaveBeenCalledWith('phone');
});

it('should call deleteProduct when the product list emits a product ID', () => {
  const deleteProductSpy = vi
    .spyOn(component, 'deleteProduct')
    .mockImplementation(() => {});

  fixture.detectChanges();

  const productList = fixture.debugElement.query(
    By.directive(ProductList)
  );

  productList.triggerEventHandler('productDelete', 5);

  expect(deleteProductSpy).toHaveBeenCalledWith(5);
});

it('should dispatch deleteProduct action when deletion is confirmed', () => {
  vi.spyOn(window, 'confirm').mockReturnValue(true);
  const dispatchSpy = vi.spyOn(store, 'dispatch');

  component.deleteProduct(5);

  expect(window.confirm).toHaveBeenCalledWith(
    'Are you sure you want to delete product with ID 5?'
  );

  expect(dispatchSpy).toHaveBeenCalledWith(
    ProductActions.deleteProduct({ id: 5 })
  );
});

it('should not dispatch deleteProduct action when deletion is cancelled', () => {
  vi.spyOn(window, 'confirm').mockReturnValue(false);
  const dispatchSpy = vi.spyOn(store, 'dispatch');

  component.deleteProduct(5);

  expect(window.confirm).toHaveBeenCalled();
  expect(dispatchSpy).not.toHaveBeenCalledWith(
    ProductActions.deleteProduct({ id: 5 })
  );
});

});
