import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { ProductForm } from './product-form';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
describe('ProductForm', () => {
  let component: ProductForm;
  let fixture: ComponentFixture<ProductForm>;
let actions$: Observable<Action>;
actions$ = of();
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductForm],
      providers: [provideMockStore(),
        provideMockActions(() => actions$)
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
