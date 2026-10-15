import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Order, OrderApiResponse, OrderListResponse } from '../models/order';

@Service()
export class OrderService {
  private http = inject(HttpClient);

  getOrders(
    page: number,
    limit: number
  ): Observable<OrderListResponse> {
    const skip = (page - 1) * limit;

    return this.http
      .get<OrderApiResponse>(
        `https://dummyjson.com/carts?limit=${limit}&skip=${skip}`
      )
      .pipe(
        map(response => ({
          orders: response.carts,
          total: response.total
        }))
      );
  }

  getOrderById(id: number): Observable<Order> {
    return this.http.get<Order>(
      `https://dummyjson.com/carts/${id}`
    );
  }
}