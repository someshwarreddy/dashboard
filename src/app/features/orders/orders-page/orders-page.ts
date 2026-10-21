import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { loadOrders } from '../../../store/order.actions';
import { OrderStatus } from '../../../models/order';
import { updateOrderStatus, restoreOrderStatuses } from '../../../store/order.actions';
import { selectOrderStatuses } from '../../../store/order.selectors';
import {
  selectOrders,
  selectOrdersError,
  selectOrdersLoading,
  selectOrdersTotal,
  selectOrdersPage,
  selectOrdersLimit
} from '../../../store/order.selectors';
import { CurrencyPipe } from '@angular/common';
import { effect } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-orders-page',
  standalone: true,
  imports: [CurrencyPipe, FormsModule],
  templateUrl: './orders-page.html',
  styleUrl: './orders-page.scss'
})
export class OrdersPage implements OnInit {
  private store = inject(Store);
  statuses = this.store.selectSignal(selectOrderStatuses);

  statusOptions: OrderStatus[] = [
    'Pending',
    'Processing',
    'Delivered'
  ];
  orders = this.store.selectSignal(selectOrders);
  loading = this.store.selectSignal(selectOrdersLoading);
  error = this.store.selectSignal(selectOrdersError);
  total = this.store.selectSignal(selectOrdersTotal);
  page = this.store.selectSignal(selectOrdersPage);
  limit = this.store.selectSignal(selectOrdersLimit);
  Math = Math;


  ngOnInit(): void {
    const savedStatuses = localStorage.getItem('orderStatuses');

    if (savedStatuses) {
      try {
        this.store.dispatch(
          restoreOrderStatuses({
            statuses: JSON.parse(savedStatuses)
          })
        );
     
      } catch {
        localStorage.removeItem('orderStatuses');
      }
    }

    this.store.dispatch(
      loadOrders({ page: 1, limit: 10 })

    );

  }
  changePage(page: number): void {
    this.store.dispatch(
      loadOrders({
        page,
        limit: this.limit()
      })
    );
  }
  changeOrderStatus(
    orderId: number,
    status: OrderStatus
  ): void {
    this.store.dispatch(
      updateOrderStatus({ orderId, status })
    );

    const updatedStatuses = {
      ...this.statuses(),
      [orderId]: status
    };

    localStorage.setItem(
      'orderStatuses',
      JSON.stringify(updatedStatuses)
    );
  }
  debugOrderStatus(orderId: number): string {
  const status = this.statuses()[orderId] ?? 'Pending';

  console.log('Order:', orderId, 'Status:', status);

  return status;
}
}