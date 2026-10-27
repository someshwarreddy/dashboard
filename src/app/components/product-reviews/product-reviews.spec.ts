import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { provideRouter } from '@angular/router';
import { ProductReviews } from './product-reviews';

describe('ProductReviews', () => {
  let component: ProductReviews;
  let fixture: ComponentFixture<ProductReviews>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductReviews],
      providers: [provideMockStore(), provideRouter([])], 
    }).compileComponents();

    fixture = TestBed.createComponent(ProductReviews);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
