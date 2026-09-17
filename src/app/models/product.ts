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
}
export type CreateProduct =
  Omit<Product, 'id' | 'image'> & {
    image: File;
  };

  interface ProductApi {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
}