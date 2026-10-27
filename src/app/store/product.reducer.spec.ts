import { describe, it, expect } from 'vitest';
import { initialState, productReducer } from './product.reducer';
import * as ProductActions from './product.actions';

describe('productReducer', () => {
    it('should return the initial state for an unknown action', () => {
        const action = { type: 'UNKNOWN_ACTION' };

        const state = productReducer(initialState, action);

        expect(state).toEqual(initialState);
    });

    it('should set loading to true when loadProducts is dispatched', () => {
        const action = ProductActions.loadProducts({
            page: 2,
            limit: 10,
            sort: ''
        });

        const state = productReducer(initialState, action);

        expect(state.loading).toBe(true);
        expect(state.error).toBeNull();
        expect(state.page).toBe(2);
        expect(state.limit).toBe(10);
    });

    it('should store products and total when loadProductsSuccess is dispatched', () => {
        const products = [
            {
                id: 1,
                title: 'Test Product',
                price: 100,
                image: 'test.jpg'
            }
        ];

        const action = ProductActions.loadProductsSuccess({
            products,
            total: 1
        });

        const state = productReducer(
            { ...initialState, loading: true },
            action
        );

        expect(state.products).toEqual(products);
        expect(state.total).toBe(1);
        expect(state.loading).toBe(false);
    });
    it('should store the error and stop loading when loadProductsFailure is dispatched', () => {
        // Arrange: create an error message
        const error = 'Failed to load products';

        // Create the failure action
        const action = ProductActions.loadProductsFailure({ error });

        // Act: start with loading = true, then run the reducer
        const state = productReducer(
            { ...initialState, loading: true },
            action
        );

        // Assert: complete these two expectations
        expect(state.loading).toBe(false);
        expect(state.error).toBe(error);
    });
    it('should update search and pagination state', () => {
        const action = ProductActions.searchProducts({
            page: 2,
            limit: 10,
            query: 'phone',
            sort: ''
        });

        const state = productReducer(initialState, action);

        // Write four expectations:
        // 1. loading
        // 2. search
        // 3. page
        // 4. limit
        expect(state.loading).toBe(true);
        expect(state.search).toBe('phone');
        expect(state.page).toBe(2);
        expect(state.limit).toBe(10);
    });
    it('searchProductsSuccess should update products and total', () => {
        const products = [
            {
                id: 1,
                title: 'Test Product',
                price: 100,
                image: 'test.jpg'
            }
        ];
        const action = ProductActions.searchProductsSuccess({
            products,
            total: 1
        });

        const state = productReducer(
            { ...initialState, loading: true },
            action
        );

        expect(state.products).toEqual(products);
        expect(state.total).toBe(1);
        expect(state.loading).toBe(false);
    })
    it('searchProductsFailure should update error and stop loading', () => {
        // Arrange: create an error message
        const error = 'Search failed';
        //  Act: create the action and run the reducer
        const action = ProductActions.searchProductsFailure({ error });
        //  Assert: check that the error is stored and loading is stopped
        const state = productReducer(
            { ...initialState, loading: true },
            action
        );
        // 
        //   expectations: check that the error is stored and loading is stopped
        expect(state.loading).toBe(false);
        expect(state.error).toBe(error);
    });
    it('selectProduct should update selectedProductId', () => {
        const action = ProductActions.selectProduct({ id: 1 });
        const state = productReducer(initialState, action);
        expect(state.selectedProductId).toBe(1);
    });
    it('clearSelectedProduct should reset selectedProductId to null', () => {
        const action = ProductActions.clearSelectedProduct();
        const state = productReducer(
            { ...initialState, selectedProductId: 1 },
            action
        );
        expect(state.selectedProductId).toBeNull();
    });
    it('deleteProductSuccess should remove the product from the products array', () => {
        const initialStateWithProducts = {
            ...initialState,
            products: [
                { id: 1, title: 'Product 1', price: 100, image: 'image1.jpg' },
                { id: 2, title: 'Product 2', price: 200, image: 'image2.jpg' }
            ]
        };
        const action = ProductActions.deleteProductSuccess({ id: 1 });
        const state = productReducer(initialStateWithProducts, action);
        expect(state.products).toEqual([
            { id: 2, title: 'Product 2', price: 200, image: 'image2.jpg' }
        ]);
        expect(state.deletingId).toBeNull();
        expect(state.selectedProductId).toBeNull();
    });
    it('deleteProductFailure should update error and stop deleting', () => {
        const error = 'Delete failed';
        const action = ProductActions.deleteProductFailure({ error });
        const state = productReducer(
            { ...initialState, deletingId: 1 },
            action
        );
        expect(state.deletingId).toBeNull();
        expect(state.error).toBe(error);
    });
    it('deleteProduct should set deletingId to the product id', () => {
        const action = ProductActions.deleteProduct({ id: 1 });
        const state = productReducer(initialState, action);
        expect(state.deletingId).toBe(1);
    });
    it('updateProductSuccess should update the product in the products array', () => {
        const initialStateWithProducts = {
            ...initialState,
            products: [
                { id: 1, title: 'Product 1', price: 100, image: 'image1.jpg' },
                { id: 2, title: 'Product 2', price: 200, image: 'image2.jpg' }
            ]
        };
        const updatedProduct = {
            id: 1,
            title: 'Updated Product 1',
            price: 150,
            image: 'updated_image1.jpg'
        };
        const action = ProductActions.updateProductSuccess({ product: updatedProduct });
        const state = productReducer(initialStateWithProducts, action);
        expect(state.products).toEqual([
            updatedProduct,
            { id: 2, title: 'Product 2', price: 200, image: 'image2.jpg' }
        ]);
    });
    it('updateProductFailure should update error', () => {
        const error = 'Update failed';
        const action = ProductActions.updateProductFailure({ error });
        const state = productReducer(initialState, action);
        expect(state.error).toBe(error);
    });
    it('putProductSuccess should update the product in the products array', () => {
        const initialStateWithProducts = {
            ...initialState,
            products: [
                { id: 1, title: 'Product 1', price: 100, image: 'image1.jpg' },
                { id: 2, title: 'Product 2', price: 200, image: 'image2.jpg' }
            ]
        };
        const updatedProduct = {
            id: 1,
            title: 'Updated Product 1',
            price: 150,
            image: 'updated_image1.jpg'
        };
        const action = ProductActions.putProductSuccess({ product: updatedProduct });
        const state = productReducer(initialStateWithProducts, action);
        expect(state.products).toEqual([
            updatedProduct,
            { id: 2, title: 'Product 2', price: 200, image: 'image2.jpg' }
        ]);
    });
    it('putProductFailure should update error', () => {
        const error = 'Put failed';
        const action = ProductActions.putProductFailure({ error });
        const state = productReducer(initialState, action);
        expect(state.error).toBe(error);
    });
    it('createProduct should not change the state', () => {
        const action = ProductActions.createProduct({
            product: {
                title: 'New Product',
                price: 100,
                image: new File(['new-product'], 'new-product.jpg', { type: 'image/jpeg' })
            }
        });
        const state = productReducer(initialState, action);
        expect(state.creating).toBe(true);
        expect(state.error).toBeNull();
        // expect(state).toEqual(initialState);

    });
    it('createProductSuccess should add the new product to the products array', () => {
        const newProduct = {
            id: 3,
            title: 'New Product',
            price: 100,
            image: 'new-product.jpg'
        };
        const action = ProductActions.createProductSuccess({ product: newProduct });
        const state = productReducer(initialState, action);
        expect(state.localProducts).toContainEqual(newProduct);
    });
    it('createProductFailure should update error and stop creating', () => {
        const error = 'Create failed';
        const action = ProductActions.createProductFailure({ error });
        const state = productReducer(
            { ...initialState, creating: true },
            action
        );
        expect(state.creating).toBe(false);
        expect(state.error).toBe(error);
    });
    it('loadProduct$ should set loading to true and clear error', () => {
        const action = ProductActions.loadProduct({ id: 1 });
        const state = productReducer(initialState, action);
        expect(state.loading).toBe(true);
        expect(state.error).toBeNull();
    });
    it('loadProductSuccess should set productDetails and stop loading', () => {
        const product = {
            id: 1,
            title: 'Product 1',
            price: 100,
            image: 'image1.jpg'
        };
        const action = ProductActions.loadProductSuccess({ product });
        const state = productReducer(initialState, action);
        expect(state.productDetails).toBe(product);
        expect(state.loading).toBe(false);
    });
    it('loadProductFailure should update error and stop loading', () => {
        const error = 'Load product failed';
        const action = ProductActions.loadProductFailure({ error });
        const state = productReducer(
            { ...initialState, loading: true },
            action
        );
        expect(state.loading).toBe(false);
        expect(state.error).toBe(error);
    });
    it('should clear selectedProductId when the deleted product is selected', () => {
        const stateBeforeDelete = {
            ...initialState,
            products: [
                { id: 1, title: 'Product 1', price: 100, image: 'image1.jpg' },
                { id: 2, title: 'Product 2', price: 200, image: 'image2.jpg' }
            ],
            selectedProductId: 1,
            deletingId: 1
        };

        const action = ProductActions.deleteProductSuccess({ id: 1 });
        const state = productReducer(stateBeforeDelete, action);

        expect(state.selectedProductId).toBeNull();
        expect(state.products).toHaveLength(1);
        expect(state.deletingId).toBeNull();
    });
    it('should preserve selectedProductId when a different product is deleted', () => {
        const stateBeforeDelete = {
            ...initialState,
            products: [
                { id: 1, title: 'Product 1', price: 100, image: 'image1.jpg' },
                { id: 2, title: 'Product 2', price: 200, image: 'image2.jpg' }
            ],
            selectedProductId: 2,
            deletingId: 1
        };

        const action = ProductActions.deleteProductSuccess({ id: 1 });
        const state = productReducer(stateBeforeDelete, action);

        expect(state.selectedProductId).toBe(2);
        expect(state.products).toHaveLength(1);
        expect(state.products[0].id).toBe(2);
        expect(state.deletingId).toBeNull();
    });
});