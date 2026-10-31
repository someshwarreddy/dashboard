import { inject, Service } from '@angular/core';
import { map, Observable, of, throwError } from 'rxjs';
import { CreateProduct, Product, ProductApiResponse, ProductApi, ProductListResponse } from '../models/product';
import { HttpClient } from '@angular/common/http';
@Service()
export class ProductService {

  private http = inject(HttpClient);


  getProducts(
    page: number,
    limit: number,
    sort: string
  ): Observable<{ products: Product[]; total: number }> {

    const skip = (page - 1) * limit;

    const sortParams =
      sort === 'price-asc'
        ? '&sortBy=price&order=asc'
        : sort === 'price-desc'
          ? '&sortBy=price&order=desc'
          : '';

    return this.http
      .get<ProductApiResponse>(
        `https://dummyjson.com/products?limit=${limit}&skip=${skip}${sortParams}`
      )
      .pipe(
        map(response => ({
          products: response.products.map(product => ({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.thumbnail
          })),
          total: response.total
        }))
      );
  }

  searchProducts(
    query: string,
    page: number,
    limit: number,
    sort: string
  ): Observable<{ products: Product[]; total: number }> {
    const skip = (page - 1) * limit;

    const sortParams =
      sort === 'price-asc'
        ? '&sortBy=price&order=asc'
        : sort === 'price-desc'
          ? '&sortBy=price&order=desc'
          : '';

    return this.http
      .get<ProductApiResponse>(
        `https://dummyjson.com/products/search?q=${encodeURIComponent(query)}&limit=${limit}&skip=${skip}${sortParams}`
      )
      .pipe(
        map(response => ({
          products: response.products.map(product => ({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.thumbnail
          })),
          total: response.total
        }))
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
