import { createReducer, on } from '@ngrx/store';
import * as ProductActions from './product.actions';
import { Product, ProductState } from '../models/product';



export const initialState: ProductState = {
  products: [],
  loading: false,
  error: null,
   localProducts: [],
  selectedProductId: null,
  deletingId: null,
  creating: false,
  productDetails: null,
  // sort: '',
  search: '',
  page: 1,
  limit: 10,
  total: 0
};

export const productReducer = createReducer(
  initialState,

  // on(ProductActions.loadProducts, state => ({
  //   ...state,
  //   loading: true,
  //   error: null,

  // })),
  on(ProductActions.loadProducts, (state, { page, limit }) => ({
    ...state,
    loading: true,
    error: null,
    page,
    limit
  })),

  // on(ProductActions.loadProductsSuccess, (state, { products }) => ({
  //   ...state,
  //   products,
  //   loading: false
  // })),
  on(
    ProductActions.loadProductsSuccess,
    (state, { products, total }) => ({
      ...state,
      products,
      total,
      loading: false
    })
  ),

  on(ProductActions.loadProductsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // on(ProductActions.searchProducts, state => ({
  //   ...state,
  //   loading: true,
  //   error: null
  // })),
  on(
    ProductActions.searchProducts,
    (state, { page, limit, query, sort }) => ({
      ...state,
      loading: true,
      error: null,
      search: query,
      page,
      limit,
      // sort
    })
  ),

  // on(ProductActions.searchProductsSuccess, (state, { products }) => ({
  //   ...state,
  //   products
  // })),
  on(ProductActions.searchProductsSuccess, (state, { products, total }) => ({
    ...state,
    products,
    total,
    loading: false
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
  // on(ProductActions.createProductSuccess, (state, { product }) => ({
  //   ...state,
  //   products: [...state.products, product],
  //   creating: false,
  //   error: null,
    
  // })),
  on(ProductActions.createProductSuccess, (state, { product }) => {
  const nextState = {
    ...state,
    // products: [...state.products, product],
     localProducts: [...state.localProducts, product],
    creating: false,
    error: null
  };

  console.log(
    'Reducer received created product:',
    product,
    'Total products:',
    nextState.products.length
  );

  return nextState;
}),

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
  // on(ProductActions.setSort, (state, { sort }) => ({
  //   ...state,
  //   sort,
  //   page: 1 // Reset to first page when sort changes
  // })),
);