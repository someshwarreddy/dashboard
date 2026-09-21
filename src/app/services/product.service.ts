import { inject, Service } from '@angular/core';
import { map, Observable, of, throwError } from 'rxjs';
import { CreateProduct, Product, ProductApiResponse, ProductApi } from '../models/product';
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
// getProducts(): Observable<Product[]> {
//   return this.http.get<ProductApiResponse>(
//     'https://dummyjson.com/products'
//     //  'https://dummyjson.com/products-invalid'
//   ).pipe(
//     map(response => response.products)
//   );
// }
getProducts(): Observable<Product[]> {
  return this.http
    .get<ProductApiResponse>('https://dummyjson.com/products')
    .pipe(
      map(response =>
        response.products.map(product => ({
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.thumbnail
        }))
      )
    );
}

// searchProducts(query: string): Observable<Product[]> {
//   return this.http
//     .get<ProductApiResponse>(
//       `https://dummyjson.com/products/search?q=${query}`
//       // `https://dummyjson.com/products-invalid/search?q=${query}`
//     )
//     .pipe(
//       map(response => response.products)
//     );
// }
searchProducts(query: string): Observable<Product[]> {
  return this.http
    .get<ProductApiResponse>(
      `https://dummyjson.com/products/search?q=${query}`
    )
    .pipe(
      map(response =>
        response.products.map(product => ({
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.thumbnail
        }))
      )
    );
}

deleteProduct(id: number): Observable<void> {
  return this.http.delete<void>(
    `https://dummyjson.com/products/${id}`
  );
}

updateProduct(product: Product): Observable<Product> {
  return this.http.patch<Product>(
    `https://dummyjson.com/products/${product.id}`,
    {
      title: product.title,
      price: product.price
    }
  );
}
putProduct(product: Product): Observable<Product> {
  return this.http.put<Product>(
    `https://dummyjson.com/products/${product.id}`,
    product
  );
}
createProduct(product: CreateProduct): Observable<Product> {
  const formData = new FormData();

  formData.append('title', product.title);
  formData.append('price', String(product.price));
  formData.append('image', product.image);

  return this.http.post<Product>(
    'https://dummyjson.com/products/add',
    formData
  );
}
getProductById(id: number): Observable<Product> {
  return this.http.get<ProductApi>(
    `https://dummyjson.com/products/${id}`
  ).pipe(
    map(product => ({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.thumbnail
    }))
  );
}
}
