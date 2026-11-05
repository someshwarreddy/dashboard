import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ProductDetailsPage } from './product-details-page';
import { provideRouter, Router } from '@angular/router';
import { initialState as initialState } from '../../store/product.reducer';
import { Product } from '../../models/product';
import { By } from '@angular/platform-browser';
import { ProductDetails } from '../../components/product-details/product-details';
describe('ProductDetailsPage', () => {
  let component: ProductDetailsPage;
  let fixture: ComponentFixture<ProductDetailsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductDetailsPage],
      providers: [provideMockStore({
        initialState: {
          product: initialState,
        }
        
      }), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductDetailsPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should convert id input to a number', () => {
  fixture.componentRef.setInput('id', '10');

  expect(component.productId()).toBe(10);
});
it('should set overview as the default active tab', () => {
  expect(component.activeTab()).toBe('overview');
});
it('should navigate back to products page', () => {
  const router = TestBed.inject(Router);
  const navigateSpy = vi.spyOn(router, 'navigate');

  component.goBack();

  expect(navigateSpy).toHaveBeenCalledWith(['/products']);
});
it('should navigate to the edit page of the selected product', () => {
  const router = TestBed.inject(Router);
  const navigateSpy = vi.spyOn(router, 'navigate');
  const product = {
    id: 5,
    title: 'Phone',
    price: 500,
    image: 'phone.jpg'
  } as Product;

  component.editProduct(product);

  expect(navigateSpy).toHaveBeenCalledWith([
    '/products',
    5,
    'edit'
  ]);
});
it('should navigate with the selected tab query parameter', () => {
  const router = TestBed.inject(Router);
  const navigateSpy = vi.spyOn(router, 'navigate');

  component.changeTab('reviews');

  expect(navigateSpy).toHaveBeenCalledWith([], {
    queryParams: {
      tab: 'reviews'
    },
    queryParamsHandling: 'merge'
  });
});
it('should receive the resolved product from the router', () => {
  const product: Product = {
    id: 5,
    title: 'Phone',
    price: 500,
    image: 'phone.jpg'
  };

  fixture.componentRef.setInput('product', product);

  expect(component.product()).toEqual(product);
});
it('should get product details from the store', () => {
  const product: Product = {
    id: 5,
    title: 'Phone',
    price: 500,
    image: 'phone.jpg'
  };

  const store = TestBed.inject(MockStore);
  store.setState({
    product: {
      ...initialState,
      productDetails: product
    }
  });

  expect(component.storedProduct()).toEqual(product);
});
it('should not render product details when product is null', () => {
  const store = TestBed.inject(MockStore);

  store.setState({
    product: {
      ...initialState,
      productDetails: null
    }
  });

  fixture.detectChanges();

  const productDetails = fixture.nativeElement.querySelector('app-product-details');

  expect(productDetails).toBeNull();
});
it('should render product details when product exists', () => {
  const product: Product = {
    id: 5,
    title: 'Phone',
    price: 500,
    image: 'phone.jpg'
  };

  const store = TestBed.inject(MockStore);

  store.setState({
    product: {
      ...initialState,
      productDetails: product
    }
  });

  fixture.detectChanges();

  const productDetails = fixture.nativeElement.querySelector('app-product-details');

  expect(productDetails).not.toBeNull();
});
it('should pass product data to ProductDetails component', () => {
  const product: Product = {
    id: 5,
    title: 'Phone',
    price: 500,
    image: 'phone.jpg'
  };

  const store = TestBed.inject(MockStore);

  store.setState({
    product: {
      ...initialState,
      productDetails: product
    }
  });

  fixture.detectChanges();

  const child = fixture.debugElement.query(By.directive(ProductDetails));

  expect(child.componentInstance.product()).toEqual(product);
});
it('should navigate to edit page when child emits edit event', () => {
  const product: Product = {
    id: 5,
    title: 'Phone',
    price: 500,
    image: 'phone.jpg'
  };

  const store = TestBed.inject(MockStore);
  store.setState({
    product: {
      ...initialState,
      productDetails: product
    }
  });

  const router = TestBed.inject(Router);
  const navigateSpy = vi.spyOn(router, 'navigate');

  fixture.detectChanges();

  const child = fixture.debugElement.query(By.directive(ProductDetails));

  child.componentInstance.edit.emit(product);

  expect(navigateSpy).toHaveBeenCalledWith([
    '/products', 5, 'edit'
  ]);
});
it('should return the selected tab from input', () => {
  fixture.componentRef.setInput('tab', 'reviews');

  expect(component.activeTab()).toBe('reviews');
});
});
