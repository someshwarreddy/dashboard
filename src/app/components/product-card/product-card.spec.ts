import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductCard } from './product-card';
import { Product } from '../../models/product';

describe('ProductCard', () => {
  let component: ProductCard;
  let fixture: ComponentFixture<ProductCard>;

  const mockProduct: Product = {
    id: 1,
    title: 'Test Phone',
    price: 499,
    image: 'https://example.com/phone.jpg',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCard],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductCard);

    fixture.componentRef.setInput('product', mockProduct);

    component = fixture.componentInstance;
    fixture.detectChanges();

    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should display the product title', () => {
  fixture.detectChanges();

  const title = fixture.nativeElement.querySelector('.product-title');

  expect(title.textContent).toContain('Test Phone');
});
it('should emit product id when title is clicked', () => {
  const selectSpy = vi.spyOn(component.selectProduct, 'emit');

  fixture.detectChanges();

  const button: HTMLButtonElement =
    fixture.nativeElement.querySelector('.product-title');

  button.click();

  expect(selectSpy).toHaveBeenCalledWith(1);
});
});