
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, Subject, throwError } from 'rxjs';
import * as ProductActions from './product.actions';
import { ProductEffects } from './product.effects';
import { ProductService } from '../services/product.service';
import { firstValueFrom } from 'rxjs';
describe('ProductEffects', () => {
    let effects: ProductEffects;
    let actions$: Observable<unknown>;

    const productServiceMock = {
        getProducts: vi.fn(),
        searchProducts: vi.fn(),
        deleteProduct: vi.fn(),
        updateProduct: vi.fn(),
        putProduct: vi.fn(),
        createProduct: vi.fn(),
        getProductById: vi.fn()
    };

    beforeEach(() => {
        actions$ = of();

        vi.clearAllMocks();

        TestBed.configureTestingModule({
            providers: [
                ProductEffects,
                provideMockActions(() => actions$),
                {
                    provide: ProductService,
                    useValue: productServiceMock
                }
            ]
        });

        effects = TestBed.inject(ProductEffects);
    });

    it('should be created', () => {
        expect(effects).toBeTruthy();
    });
    it('should dispatch loadProductsSuccess when products load successfully', () => {
        const products = [
            {
                id: 1,
                title: 'Test Phone',
                price: 500,
                image: 'phone.jpg'
            }
        ];

        const total = 1;

        productServiceMock.getProducts.mockReturnValue(
            of({ products, total })
        );

        actions$ = of(
            ProductActions.loadProducts({
                page: 1,
                limit: 10,
                sort: ''
            })
        );

        effects.loadProducts$.subscribe(action => {
            expect(action).toEqual(
                ProductActions.loadProductsSuccess({ products, total })
            );
        });
    });
    it('should dispatch loadProductsFailure when loading products fails', () => {
        const error = { message: 'Failed to load products' };

        productServiceMock.getProducts.mockReturnValue(
            throwError(() => error)
        );

        actions$ = of(
            ProductActions.loadProducts({
                page: 1,
                limit: 10,
                sort: ''
            })
        );

        effects.loadProducts$.subscribe(action => {
            expect(action).toEqual(
                ProductActions.loadProductsFailure({
                    error: 'Failed to load products'
                })
            );
        });
    });
    it('should dispatch searchProductsSuccess when products search successfully', async () => {
        vi.useFakeTimers();

        const products = [
            {
                id: 1,
                title: 'Test Phone',
                price: 500,
                image: 'phone.jpg'
            },
            {
                id: 2,
                title: 'Test Laptop',
                price: 1000,
                image: 'laptop.jpg'
            }
        ];

        productServiceMock.searchProducts.mockReturnValue(
            of({ products, total: 2 })
        );

        actions$ = of(
            ProductActions.searchProducts({
                query: 'Test',
                page: 1,
                limit: 10,
                sort: ''
            })

        );

        const emittedPromise = new Promise<void>((resolve, reject) => {
            effects.searchProducts$.subscribe({
                next: action => {
                    try {
                        expect(action).toEqual(
                            ProductActions.searchProductsSuccess({
                                products,
                                total: 2
                            })
                        );
                        resolve();
                    } catch (error) {
                        reject(error);
                    }
                },
                error: reject
            });
        });

        await vi.advanceTimersByTimeAsync(500);
        await emittedPromise;

        vi.useRealTimers();

        // without using firstValueFrom, you can use a Promise to wait for the effect to emit the action. The test will wait for the effect to emit the action and then check if it matches the expected action.
        //    

        // const resultPromise = firstValueFrom(effects.searchProducts$);

        // await vi.advanceTimersByTimeAsync(500);

        // const action = await resultPromise;

        // expect(action).toEqual(
        //   ProductActions.searchProductsSuccess({
        //     products,
        //     total: 2
        //   })
        // );
    });
    it('should dispatch searchProductsFailure when search fails', async () => {
        vi.useFakeTimers();

        const error = new Error('Failed to search products');

        productServiceMock.searchProducts.mockReturnValue(
            throwError(() => error)
        );

        actions$ = of(
            ProductActions.searchProducts({
                query: 'phone',
                page: 1,
                limit: 10,
                sort: ''
            })
        );
        const resultPromise = firstValueFrom(effects.searchProducts$);

        await vi.advanceTimersByTimeAsync(500);

        const action = await resultPromise;

        // TODO: Subscribe to the effect, advance the 500ms debounce,
        // await the emitted action, and assert the failure action.
        expect(action).toEqual(
            ProductActions.searchProductsFailure({
                error: 'Failed to search products'
            })
        );

        vi.useRealTimers();
    });
    it('should dispatch deleteProductSuccess when product is deleted successfully', async () => {
        const productId = 1;

        productServiceMock.deleteProduct.mockReturnValue(of(productId));

        // 1. Provide the action first
        actions$ = of(
            ProductActions.deleteProduct({ id: productId })
        );

        // 2. Subscribe to the effect
        const resultPromise = firstValueFrom(effects.deleteProduct$);

        // 3. Wait for the emitted action
        const action = await resultPromise;

        // 4. Verify the result
        expect(action).toEqual(
            ProductActions.deleteProductSuccess({ id: productId })
        );
    });
    it('should dispatch deleteProductFailure when product deletion fails', () => {
        const productId = 1;
        const error = { message: 'Failed to delete products' };

        productServiceMock.deleteProduct.mockReturnValue(
            throwError(() => error)
        );

        actions$ = of(
            ProductActions.deleteProduct({ id: productId })
        );

        effects.deleteProduct$.subscribe(action => {
            expect(action).toEqual(
                ProductActions.deleteProductFailure({
                    error: 'Failed to delete products'
                })
            );
        });
    });
    it('should dispatch updateProductSuccess when product is updated successfully', () => {
        const product = {
            id: 1,
            title: 'Updated Phone',
            price: 700,
            image: 'phone.jpg'
        };

        productServiceMock.updateProduct.mockReturnValue(
            of(product)
        );

        actions$ = of(
            ProductActions.updateProduct({ product })
        );

        effects.updateProduct$.subscribe(action => {
            expect(action).toEqual(
                ProductActions.updateProductSuccess({
                    product
                })
            );
        });
    });
    it('should dispatch updateProductFailure when product update fails', () => {
        const product = {
            id: 1,
            title: 'Updated Phone',
            price: 700,
            image: 'phone.jpg'
        };

        const error = {
            message: 'Failed to update product'
        };

        productServiceMock.updateProduct.mockReturnValue(
            throwError(() => error)
        );

        actions$ = of(
            ProductActions.updateProduct({ product })
        );

        effects.updateProduct$.subscribe(action => {
            expect(action).toEqual(
                ProductActions.updateProductFailure({
                    error: 'Failed to update product'
                })
            );
        });
    });
    it('should dispatch putProductSuccess when product is updated successfully', async () => {
        const product = {
            id: 1,
            title: 'Updated Phone',
            price: 700,
            image: 'phone.jpg'
        };

        productServiceMock.putProduct.mockReturnValue(of(product));

        actions$ = of(
            ProductActions.putProduct({ product })
        );

        const resultPromise = firstValueFrom(effects.putProduct$);
        const action = await resultPromise;

        expect(action).toEqual(
            ProductActions.putProductSuccess({ product })
        );
    });
    it('should dispatch putProductFailure when product update fails', async () => {
        const product = {
            id: 1,
            title: 'Updated Phone',
            price: 700,
            image: 'phone.jpg'
        };

        const error = { message: 'Failed to replace product' };

        productServiceMock.putProduct.mockReturnValue(
            throwError(() => error)
        );

        actions$ = of(
            ProductActions.putProduct({ product })
        );

        const resultPromise = firstValueFrom(effects.putProduct$);
        const action = await resultPromise;

        expect(action).toEqual(
            ProductActions.putProductFailure({
                error: 'Failed to replace product'
            })
        );
    });
    it('should dispatch createProductSuccess when product is created successfully', async () => {
        // Input sent to the service: image is a File
        const createProduct = {
            title: 'New Phone',
            price: 500,
            image: new File(['test image'], 'phone.jpg', {
                type: 'image/jpeg'
            })
        };

        // Output returned by the service: image is a URL string
        const createdProduct = {
            id: 1,
            title: 'New Phone',
            price: 500,
            image: 'https://example.com/phone.jpg'
        };

        productServiceMock.createProduct.mockReturnValue(
            of(createdProduct)
        );

        actions$ = of(
            ProductActions.createProduct({ product: createProduct })
        );

        const resultPromise = firstValueFrom(effects.createProduct$);
        const action = await resultPromise;

        expect(action).toEqual(
            ProductActions.createProductSuccess({
                product: createdProduct
            })
        );
    });
    it('should dispatch createProductFailure when product creation fails', async () => {
        const createProduct = {
            title: 'New Phone',
            price: 500,
            image: new File(['test image'], 'phone.jpg', {
                type: 'image/jpeg'
            })
        };

        const error = {
            message: 'Failed to create product'
        };

        productServiceMock.createProduct.mockReturnValue(
            throwError(() => error)
        );

        actions$ = of(
            ProductActions.createProduct({ product: createProduct })
        );

        const resultPromise = firstValueFrom(effects.createProduct$);
        const action = await resultPromise;

        expect(action).toEqual(
            ProductActions.createProductFailure({
                error: 'Failed to create product'
            })
        );
    });
    it('should dispatch loadProductSuccess when product loads successfully', async () => {
        const productId = 1;

        const product = {
            id: productId,
            title: 'Test Phone',
            price: 500,
            image: 'phone.jpg'
        };

        productServiceMock.getProductById.mockReturnValue(of(product));

        actions$ = of(
            ProductActions.loadProduct({ id: productId })
        );

        const resultPromise = firstValueFrom(effects.loadProduct$);
        const action = await resultPromise;

        expect(action).toEqual(
            ProductActions.loadProductSuccess({ product })
        );
    });
    it('should dispatch loadProductFailure when product loading fails', async () => {
        const productId = 1;
        const error = { message: 'Failed to load product' };

        productServiceMock.getProductById.mockReturnValue(
            throwError(() => error)
        );

        actions$ = of(
            ProductActions.loadProduct({ id: productId })
        );

        const resultPromise = firstValueFrom(effects.loadProduct$);
        const action = await resultPromise;

        expect(action).toEqual(
            ProductActions.loadProductFailure({
                error: 'Failed to load product'
            })
        );
    });
  it('should ignore identical consecutive search actions', async () => {
  vi.useFakeTimers();

  try {
    const product = {
      id: 1,
      title: 'Test Phone',
      price: 500,
      image: 'phone.jpg'
    };

    productServiceMock.searchProducts.mockReturnValue(
      of({ products: [product], total: 1 })
    );

    const searchAction = ProductActions.searchProducts({
      query: 'phone',
      page: 1,
      limit: 10,
      sort: ''
    });

    actions$ = new Subject();

    const resultPromise = firstValueFrom(effects.searchProducts$);

    // Emit the first action and let it pass debounceTime.
    (actions$ as Subject<unknown>).next(searchAction);
    await vi.advanceTimersByTimeAsync(500);

    // Emit the identical action and let it pass debounceTime.
    (actions$ as Subject<unknown>).next(searchAction);
    await vi.advanceTimersByTimeAsync(500);

    await resultPromise;

    expect(productServiceMock.searchProducts).toHaveBeenCalledTimes(1);
  } finally {
    vi.useRealTimers();
  }
});
});
