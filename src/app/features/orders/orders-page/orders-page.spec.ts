import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersPage } from './orders-page';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { provideRouter } from '@angular/router';
import { initialOrderState as initialOrderState } from '../../../store/order.reducer';
import { loadOrders, refreshOrders, restoreOrderStatuses, updateOrderStatus } from '../../../store/order.actions';
import { Order } from '../../../models/order';
describe('OrdersPage', () => {
  let component: OrdersPage;
  let fixture: ComponentFixture<OrdersPage>;
  const mockOrders: Order[] = [
    {
      id: 1,
      userId: 101,
      products: [
        {
          id: 10,
          title: 'iPhone',
          price: 500,
          quantity: 2,
          total: 1000,
          thumbnail: 'iphone.jpg'
        }
      ],
      total: 1000,
      totalProducts: 1,
      totalQuantity: 2
    }
  ];
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
  it('should dispatch loadOrders when component initializes', () => {
    const store = TestBed.inject(MockStore);
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    component.ngOnInit();

    expect(dispatchSpy).toHaveBeenCalledWith(
      loadOrders({ page: 1, limit: 10 })
    );
  });
  it('should restore saved order statuses from localStorage', () => {
    const savedStatuses = {
      1: 'Processing' as const,
      5: 'Delivered' as const
    };

    localStorage.setItem(
      'orderStatuses',
      JSON.stringify(savedStatuses)
    );

    const store = TestBed.inject(MockStore);
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    component.ngOnInit();

    expect(dispatchSpy).toHaveBeenCalledWith(
      restoreOrderStatuses({ statuses: savedStatuses })
    );
  });
  it('should remove invalid saved statuses from localStorage', () => {
    localStorage.setItem('orderStatuses', 'invalid-json');

    component.ngOnInit();

    expect(localStorage.getItem('orderStatuses')).toBeNull();
  });
  it('should save updated order status to localStorage', () => {
    component.changeOrderStatus(1, 'Processing');

    const savedStatuses = JSON.parse(
      localStorage.getItem('orderStatuses')!
    );

    expect(savedStatuses).toEqual({
      1: 'Processing'
    });
  });
  it('should dispatch updateOrderStatus when status changes', () => {
    const store = TestBed.inject(MockStore);
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    component.changeOrderStatus(1, 'Processing');

    expect(dispatchSpy).toHaveBeenCalledWith(
      updateOrderStatus({
        orderId: 1,
        status: 'Processing'
      })
    );
  });
  it('should dispatch loadOrders when page changes', () => {
    const store = TestBed.inject(MockStore);
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    component.changePage(2);

    expect(dispatchSpy).toHaveBeenCalledWith(
      loadOrders({
        page: 2,
        limit: component.limit()
      })
    );
  });
  it('should dispatch refreshOrders when refresh is called', () => {
    const store = TestBed.inject(MockStore);
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    component.refresh();

    expect(dispatchSpy).toHaveBeenCalledWith(
      refreshOrders()
    );
  });
  it('should display loading message when orders are loading', () => {
    const store = TestBed.inject(MockStore);

    store.setState({
      orders: {
        ...initialOrderState,
        loading: true
      }
    });

    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelector('.loading-state')
        .textContent
    ).toContain('Loading orders...');
  });
  it('should display error message when orders loading fails', () => {
    const store = TestBed.inject(MockStore);

    store.setState({
      orders: {
        ...initialOrderState,
        loading: false,
        error: 'Failed to load orders'
      }
    });

    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelector('.error-state').textContent
    ).toContain('Failed to load orders');
  });
  it('should display empty message when no orders are available', () => {
    const store = TestBed.inject(MockStore);

    store.setState({
      orders: {
        ...initialOrderState,
        loading: false,
        error: null,
        orders: []
      }
    });

    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelector('.empty-state').textContent
    ).toContain('No orders found.');
  });
  it('should display orders in the table when orders are available', () => {
  

    const store = TestBed.inject(MockStore);

    store.setState({
      orders: {
        ...initialOrderState,
        orders: mockOrders,
        total: 1,
        loading: false,
        error: null
      }
    });

    fixture.detectChanges();

    const table = fixture.nativeElement.querySelector('.orders-table');

    expect(table).toBeTruthy();
    expect(table.textContent).toContain('1');     // Products
    expect(table.textContent).toContain('2');     // Quantity
    expect(table.textContent).toContain('1,000'); // Total (formatted)
  });
  it('should display the correct orders count', () => {
    const store = TestBed.inject(MockStore);
  
    store.setState({
      orders: {
        ...initialOrderState,
        orders: mockOrders,
        total: 25,
        loading: false,
        error: null
      }
    });

    fixture.detectChanges();

    const count = fixture.nativeElement.querySelector('.orders-count');

    expect(count.textContent).toContain('Showing 1 of 25 orders');
  });
  it('should display the correct pagination information', () => {
  const store = TestBed.inject(MockStore);

  store.setState({
    orders: {
      ...initialOrderState,
      orders: mockOrders,
      total: 25,
      page: 2,
      limit: 10,
      loading: false,
      error: null
    }
  });

  fixture.detectChanges();

  const pagination = fixture.nativeElement.querySelector('.orders-pagination');

  expect(pagination.textContent).toContain('Page 2 of 3');
});
it('should disable Previous button on the first page', () => {
  const store = TestBed.inject(MockStore);
 

  store.setState({
    orders: {
      ...initialOrderState,
      orders: mockOrders,
      total: 25,
      page: 1,
      limit: 10,
      loading: false,
      error: null
    }
  });

  fixture.detectChanges();

  const buttons = fixture.nativeElement.querySelectorAll(
    '.orders-pagination button'
  );

  expect(buttons[0].disabled).toBe(true);
});
it('should disable Next button on the last page', () => {
  const store = TestBed.inject(MockStore);

  store.setState({
    orders: {
      ...initialOrderState,
      orders: mockOrders,
      total: 25,
      page: 3,
      limit: 10,
      loading: false,
      error: null
    }
  });

  fixture.detectChanges();

  const buttons = fixture.nativeElement.querySelectorAll(
    '.orders-pagination button'
  );

  expect(buttons[1].disabled).toBe(true);
});
it('should disable pagination buttons while loading', () => {
  const store = TestBed.inject(MockStore);
 
  store.setState({
    orders: {
      ...initialOrderState,
      orders: mockOrders,
      total: 25,
      page: 2,
      limit: 10,
      loading: true,
      error: null
    }
  });

  fixture.detectChanges();

  const buttons = fixture.nativeElement.querySelectorAll(
    '.orders-pagination button'
  );

  expect(buttons[0].disabled).toBe(true);
  expect(buttons[1].disabled).toBe(true);
});
it('should disable refresh button while loading', () => {
  const store = TestBed.inject(MockStore);

  store.setState({
    orders: {
      ...initialOrderState,
      orders: mockOrders,
      loading: true
    }
  });

  fixture.detectChanges();

  const refreshButton = fixture.nativeElement.querySelector(
    '.refresh-button'
  );

  expect(refreshButton.disabled).toBe(true);
});
it('should call refresh when refresh button is clicked', () => {
  const store = TestBed.inject(MockStore);
  const dispatchSpy = vi.spyOn(store, 'dispatch');

  fixture.detectChanges();

  const refreshButton = fixture.nativeElement.querySelector(
    '.refresh-button'
  );

  refreshButton.click();

  expect(dispatchSpy).toHaveBeenCalledWith(refreshOrders());
});
it('should load the next page when Next button is clicked', () => {
  const store = TestBed.inject(MockStore);
  const dispatchSpy = vi.spyOn(store, 'dispatch');

  store.setState({
    orders: {
      ...initialOrderState,
      orders: mockOrders,
      total: 25,
      page: 1,
      limit: 10,
      loading: false,
      error: null
    }
  });

  fixture.detectChanges();

  const buttons = fixture.nativeElement.querySelectorAll(
    '.orders-pagination button'
  );

  buttons[1].click();

  expect(dispatchSpy).toHaveBeenCalledWith(
    loadOrders({
      page: 2,
      limit: 10
    })
  );
});
it('should load the previous page when Previous button is clicked', () => {
  const store = TestBed.inject(MockStore);
  const dispatchSpy = vi.spyOn(store, 'dispatch');

  store.setState({
    orders: {
      ...initialOrderState,
      orders: mockOrders,
      total: 25,
      page: 2,
      limit: 10,
      loading: false,
      error: null
    }
  });

  fixture.detectChanges();

  const buttons = fixture.nativeElement.querySelectorAll(
    '.orders-pagination button'
  );

  buttons[0].click();

  expect(dispatchSpy).toHaveBeenCalledWith(
    loadOrders({
      page: 1,
      limit: 10
    })
  );
});
it('should update order status when dropdown value changes', () => {
  const store = TestBed.inject(MockStore);
  const dispatchSpy = vi.spyOn(store, 'dispatch');

  store.setState({
    orders: {
      ...initialOrderState,
      orders: mockOrders,
      total: 1,
      loading: false,
      error: null
    }
  });

  fixture.detectChanges();

  const dropdown = fixture.nativeElement.querySelector(
    '.orders-table tbody select'
  ) as HTMLSelectElement;

  dropdown.value = 'Processing';
  dropdown.dispatchEvent(new Event('change'));

  fixture.detectChanges();

  expect(dispatchSpy).toHaveBeenCalledWith(
    updateOrderStatus({
      orderId: 1,
      status: 'Processing'
    })
  );

  expect(
    JSON.parse(localStorage.getItem('orderStatuses')!)
  ).toEqual({
    1: 'Processing'
  });
});
});
