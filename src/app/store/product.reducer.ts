import { createReducer, on } from '@ngrx/store';
import * as ProductActions from './product.actions';
import { Product, ProductState } from '../models/product';



export const initialState: ProductState = {
  products: [],
  loading: false,
  error: null,
  selectedProductId: null,
  deletingId: null,
  creating: false,
  productDetails: null,
  sort: ''
};

export const productReducer = createReducer(
  initialState,

  on(ProductActions.loadProducts, state => ({
    ...state,
    loading: true,
    error: null
  })),

  on(ProductActions.loadProductsSuccess, (state, { products }) => ({
    ...state,
    products,
    loading: false
  })),

  on(ProductActions.loadProductsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  on(ProductActions.searchProducts, state => ({
    ...state,
    loading: true,
    error: null
  })),

  on(ProductActions.searchProductsSuccess, (state, { products }) => ({
    ...state,
    products
  })),

  on(ProductActions.searchProductsFailure, (state, { error }) => ({
    ...state,
    error
  })),

  // select product reducer
  on(ProductActions.selectProduct, (state, { id }) => ({
    ...state,
    selectedProductId: id
  })),
  on(ProductActions.clearSelectedProduct, state => ({
    ...state,
    selectedProductId: null
  })),

  on(ProductActions.deleteProductSuccess, (state, { id }) => ({
    ...state,
    products: state.products.filter(product => product.id !== id),
    selectedProductId:
      state.selectedProductId === id
        ? null
        : state.selectedProductId,
    deletingId: null
  })),
  on(ProductActions.deleteProductFailure, (state, { error }) => ({
    ...state,
    error,
    deletingId: null
  })),
  on(ProductActions.deleteProduct, (state, { id }) => ({
    ...state,
    deletingId: id,
    error: null
  })),
  on(ProductActions.updateProductSuccess, (state, { product }) => ({
    ...state,
    products: state.products.map(existingProduct =>
      existingProduct.id === product.id
        ? product
        : existingProduct
    ),
    error: null
  })),
  on(ProductActions.updateProductFailure, (state, { error }) => ({
    ...state,
    error
  })),

  on(ProductActions.putProductSuccess, (state, { product }) => ({
    ...state,

    products: state.products.map(existingProduct =>
      existingProduct.id === product.id
        ? product
        : existingProduct
    ),

    error: null
  })),

  on(ProductActions.putProductFailure, (state, { error }) => ({
    ...state,
    error
  })),
  on(ProductActions.createProduct, state => ({
  ...state,
  creating: true,
  error: null
})),
  on(ProductActions.createProductSuccess, (state, { product }) => ({
  ...state,
  products: [...state.products, product],
  creating: false,
  error: null
})),

on(ProductActions.createProductFailure, (state, { error }) => ({
  ...state,
  creating: false,
  error
})),
on(ProductActions.loadProduct, state => ({
  ...state,
  loading: true,
  error: null
})),
on(ProductActions.loadProductSuccess, (state, { product }) => ({
  ...state,
  productDetails: product,
  loading: false,
  error: null
})),
on(ProductActions.loadProductFailure, (state, { error }) => ({
  ...state,
  loading: false,
  error
})),
on(ProductActions.setSort, (state, { sort }) => ({
  ...state,
  sort
})),
);