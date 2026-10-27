import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore, } from '@ngrx/store/testing';
import {provideRouter} from '@angular/router';
import { ProductPage } from './product-page';
import {provideMockActions} from '@ngrx/effects/testing';
import {Observable, of} from 'rxjs';
import {initialState as initialState} from '../../store/product.reducer';
describe('ProductPage', () => {
  let component: ProductPage;
  let fixture: ComponentFixture<ProductPage>;
  let actions$: Observable<any>;
  actions$ = of();
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductPage],
      providers: [
        provideMockStore({
          initialState: {
            product: initialState,
          }
        }),
        provideMockActions(() => actions$),
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
