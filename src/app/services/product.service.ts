import { Service } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Product } from '../models/product';
@Service()
export class ProductService {
     getProducts(): Observable<Product[]> {
    return of([
      { id: 1, name: 'Laptop', price: 50000 },
      { id: 2, name: 'Phone', price: 30000 },
      { id: 3, name: 'Headphones', price: 5000 }
    ]);
  }
}
