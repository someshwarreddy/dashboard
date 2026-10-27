import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { provideRouter } from '@angular/router';
import { ProductFormPage } from './product-form-page';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import {initialState as initialState} from '../../store/product.reducer';
describe('ProductFormPage', () => {
  let component: ProductFormPage;
  let fixture: ComponentFixture<ProductFormPage>;
  let actions$: Observable<Action>;
  actions$ = of();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductFormPage],
      providers: [provideMockStore({
        initialState: {
          product: initialState,
        }
      }),
        provideMockActions(() => actions$),
        provideRouter([])
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductFormPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
