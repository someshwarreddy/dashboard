import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersPage } from './orders-page';
import { provideMockStore } from '@ngrx/store/testing';
import { provideRouter } from '@angular/router';
import { initialOrderState as initialOrderState } from '../../../store/order.reducer';
describe('OrdersPage', () => {
  let component: OrdersPage;
  let fixture: ComponentFixture<OrdersPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrdersPage],
      providers: [provideMockStore({
        initialState: {
          orders: initialOrderState,
        }
      },), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(OrdersPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
