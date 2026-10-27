import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { ProductDetailsPage } from './product-details-page';
import { provideRouter } from '@angular/router';
import { initialState as initialState } from '../../store/product.reducer';
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
});
