import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDetails } from './product-details';
import { Product } from '../../models/product';
import { provideMockStore } from '@ngrx/store/testing';
import { provideRouter, ActivatedRoute, convertToParamMap  } from '@angular/router';
describe('ProductDetails', () => {
  let component: ProductDetails;
  let fixture: ComponentFixture<ProductDetails>;
  const mockProduct: Product = {
    id: 1,
    title: 'Test Phone',
    price: 499,
    image: 'https://example.com/phone.jpg',
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductDetails],
      providers: [provideMockStore(), provideRouter([])],
    }).compileComponents();
    fixture = TestBed.createComponent(ProductDetails);
    fixture.componentRef.setInput('product', mockProduct);

    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
