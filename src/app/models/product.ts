export interface Product {
  id: number;
  title: string;
  price: number;
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
  products: [];
  total: number;
  skip: number;
  limit: number;
}
export interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
   selectedProductId: number | null;
}