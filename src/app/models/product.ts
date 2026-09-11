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
