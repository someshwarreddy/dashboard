export interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
}


// export interface ApiProduct {
//   id: number;
//   title: string;
//   price: number;
// }

// export interface ProductApiResponse {
//   products: ApiProduct[];
//   total: number;
//   skip: number;
//   limit: number;
// }
export interface ProductApiResponse {
  products: ProductApi[];
  total: number;
  skip: number;
  limit: number;
}
export interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
  selectedProductId: number | null;
  deletingId: number | null;
  creating: boolean;
  productDetails: Product | null;
}
export type CreateProduct =
  Omit<Product, 'id' | 'image'> & {
    image: File;
  };

  export interface ProductApi {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
}

export type UpdateProduct = {
  id: number;
  title: string;
  price: number;
  image?: File;
};

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  authInitialized: boolean;
}
export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

export const initialAuthState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  authInitialized: false
};