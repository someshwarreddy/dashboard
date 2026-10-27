import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Product } from '../../models/product';
import { ProductList } from './product-list';

describe('ProductList', () => {
  let component: ProductList;
  let fixture: ComponentFixture<ProductList>;
  const mockProducts: Product[] = [
    {
      id: 1,
      title: 'Test Phone',
      price: 499,
      image: 'https://example.com/phone.jpg',
    },
    {
      id: 2,
      title: 'Test Laptop',
      price: 999,
      image: 'https://example.com/laptop.jpg',
    },
  ];
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductList],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductList);
    fixture.componentRef.setInput('products', mockProducts);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
