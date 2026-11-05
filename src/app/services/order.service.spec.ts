import { TestBed } from '@angular/core/testing';
import {
    HttpErrorResponse,
  provideHttpClient
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing';

import { OrderService } from './order.service';
import { Order, OrderListResponse } from '../models/order';

describe('OrderService', () => {
  let service: OrderService;
  let httpMock: HttpTestingController;
  const mockCart = {
    id: 5,
    userId: 1,
    totalProducts: 0,
    totalQuantity: 0,
    total: 0,
    discountedTotal: 0,
    products: []
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        OrderService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(OrderService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });
  it('should fetch orders with correct pagination parameters', () => {
  service.getOrders(2, 10).subscribe();

  const req = httpMock.expectOne(
    'https://dummyjson.com/carts?limit=10&skip=10'
  );

  expect(req.request.method).toBe('GET');

  req.flush({
    carts: [],
    total: 0
  });
});
it('should fetch and map orders correctly', () => {
  let actualResponse: OrderListResponse | undefined;

  service.getOrders(2, 10).subscribe(response => {
    actualResponse = response;
  });

  const req = httpMock.expectOne(
    'https://dummyjson.com/carts?limit=10&skip=10'
  );

  expect(req.request.method).toBe('GET');

  req.flush({
    carts: [],
    total: 25
  });

  expect(actualResponse).toEqual({
    orders: [],
    total: 25
  });
});
it('should fetch an order by ID', () => {
  let actualOrder: Order | undefined;


  service.getOrderById(5).subscribe(order => {
    actualOrder = order;
  });

  const req = httpMock.expectOne(
    'https://dummyjson.com/carts/5'
  );

  expect(req.request.method).toBe('GET');

  req.flush(mockCart);

  expect(actualOrder).toEqual(mockCart);
});
it('should propagate an error when fetching orders fails', () => {
  let actualError: HttpErrorResponse | undefined;

  service.getOrders(1, 10).subscribe({
    error: error => {
      actualError = error;
    }
  });

  const req = httpMock.expectOne(
    'https://dummyjson.com/carts?limit=10&skip=0'
  );

  req.flush('Server error', {
    status: 500,
    statusText: 'Internal Server Error'
  });

  expect(actualError?.status).toBe(500);
});
});