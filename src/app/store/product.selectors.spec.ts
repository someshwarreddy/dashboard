import { selectCreating, selectDeletingId, selectError, selectLimit, selectPage, selectProductDetails, selectProducts, selectSelectedProduct, selectTotalPages } from './product.selectors';
import { describe, it, expect } from 'vitest';
import { ProductState } from '../models/product';
import { selectLoading } from './product.selectors';

describe('Product Selectors', () => {

  describe('selectLoading', () => {

    it('should return loading state', () => {
      const state = {
        loading: true
      } as ProductState;

      const result = selectLoading.projector(state);

      expect(result).toBe(true);
    });

  });
it('should combine localProducts and products', () => {
  const localProducts = [
    { id: 1, title: 'Local Product', price: 100, image: 'local.jpg' }
  ];

  const products = [
    { id: 2, title: 'API Product', price: 200, image: 'api.jpg' }
  ];

  const result = selectProducts.projector({
    localProducts,
    products
  } as ProductState);

  expect(result).toEqual([
    ...localProducts,
    ...products
  ]);
});
it('should return loading state', () => {
  const result = selectLoading.projector({
    loading: true
  } as ProductState);

  expect(result).toBe(true);
});
 it('should return error state', () => {
    const error = 'Failed to load products';

    const state = {
      error
    } as ProductState;

    const result = selectError.projector(state);

    expect(result).toBe(error);
  });
  it('should return the selected product', () => {
  const product = {
    id: 1,
    title: 'Phone',
    price: 100,
    image: 'phone.jpg'
  };

  const result = selectSelectedProduct.projector(
    [product],
    { selectedProductId: 1 } as ProductState
  );

  expect(result).toEqual(product);
});
it('should return null when selected product is not found', () => {
  const product = {
    id: 1,
    title: 'Phone',
    price: 100,
    image: 'phone.jpg'
  };

  const result = selectSelectedProduct.projector(
    [product],
    { selectedProductId: 2 } as ProductState
  );

  expect(result).toBeNull();
});
it('should return deleting product id', () => {
  const result = selectDeletingId.projector({
    deletingId: 5
  } as ProductState);

  expect(result).toBe(5);
});
it('should return creating state', () => {
  const result = selectCreating.projector({
    creating: true
  } as ProductState);

  expect(result).toBe(true);
});
it('should return product details', () => {
  const productDetails = {
    id: 1,
    title: 'Phone',
    price: 100,
    image: 'phone.jpg'
  };

  const result = selectProductDetails.projector({
    productDetails
  } as ProductState);

  expect(result).toEqual(productDetails);
});
it('should return current page number', () => {
  const result = selectPage.projector({
    page: 2
  } as ProductState);

  expect(result).toBe(2);
});
it('should return page limit', () => {
  const result = selectLimit.projector({
    limit: 10
  } as ProductState);

  expect(result).toBe(10);
});
it('should return total number of pages', () => {
  const result = selectTotalPages.projector({
    total: 25,
    limit: 10
  } as ProductState);

  expect(result).toBe(3);
});
});