import { inject, Service } from '@angular/core';
import { map, Observable, of, throwError } from 'rxjs';
import { Product, ProductApiResponse, } from '../models/product';
import { HttpClient } from '@angular/common/http';
@Service()
export class ProductService {
  //    getProducts(): Observable<Product[]> {
  //   return of([
  //     { id: 1, name: 'Laptop', price: 50000 },
  //     { id: 2, name: 'Phone', price: 30000 },
  //     { id: 3, name: 'Headphones', price: 5000 }
  //   ]);
  // }
  //  getProducts(): Observable<Product[]> {
  //   return throwError(() => new Error('Failed to load products'));
  // }
 private http = inject(HttpClient);

// getProducts(): Observable<Product[]> {
//   return this.http
//     .get<ProductApiResponse>('https://dummyjson.com/products')
//     .pipe(
//       map(response =>
//         response.products.map(product => ({
//           id: product.id,
//           name: product.title,
//           price: product.price
//         }))
//       )
//     );
// }
getProducts(): Observable<Product[]> {
  return this.http.get<ProductApiResponse>(
    'https://dummyjson.com/products'
    //  'https://dummyjson.com/products-invalid'
  ).pipe(
    map(response => response.products)
  );
}
searchProducts(query: string): Observable<Product[]> {
  return this.http
    .get<ProductApiResponse>(
      `https://dummyjson.com/products/search?q=${query}`
      // `https://dummyjson.com/products-invalid/search?q=${query}`
    )
    .pipe(
      map(response => response.products)
    );
}
}
