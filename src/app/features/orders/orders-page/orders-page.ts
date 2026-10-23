import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { loadMultipleCarts, loadMultipleCartsSequentially, loadOrderDashboardSummary, loadOrders, refreshOrders } from '../../../store/order.actions';
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
import { BehaviorSubject, combineLatest, Subject, take, withLatestFrom } from 'rxjs';

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
test(){
 // mergemap
//   this.store.dispatch(
//   loadMultipleCarts({ ids: [1, 2, 3] })
// );
//concatmap
//  this.store.dispatch(
//    loadMultipleCartsSequentially({ ids: [1, 2, 3] })
//  );
// forkjoin
// this.store.dispatch(loadOrderDashboardSummary());
// combineLatest
//  const search$ = new BehaviorSubject('phone');
//   const category$ = new BehaviorSubject('beauty');

//   combineLatest([search$, category$])
//     .pipe(take(4))
//     .subscribe(([search, category]) => {
//       console.log('Combined filters:', { search, category });
//     });

//   search$.next('laptop');
//   category$.next('electronics');
//   search$.next('tablet');
// withlatestfrom
const refresh$ = new Subject<void>();
const filter$ = new BehaviorSubject('Pending');

refresh$
  .pipe(withLatestFrom(filter$))
  .subscribe(([_, filter]) => {
    console.log('Loading orders with filter:', filter);
  });

filter$.next('Delivered'); // No output yet
  console.log('Filter changed; no request yet');
refresh$.next();    
}
refresh(): void {
  this.store.dispatch(refreshOrders());
}
}