import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { ProductFormPage } from './product-form-page';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of,BehaviorSubject } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import { initialState as initialState } from '../../store/product.reducer';
import * as ProductActions from '../../store/product.actions';
import * as ProductSelectors from '../../store/product.selectors';
import { ActivatedRoute, convertToParamMap ,provideRouter, ParamMap,} from '@angular/router';


describe('ProductFormPage', () => {
  let component: ProductFormPage;
  let fixture: ComponentFixture<ProductFormPage>;
  let actions$: Observable<Action>;
  let paramMap$: BehaviorSubject<ParamMap>;
  actions$ = of();

  beforeEach(async () => {
    paramMap$ = new BehaviorSubject(
  convertToParamMap({})
);
    await TestBed.configureTestingModule({
      imports: [ProductFormPage],
      providers: [
        provideMockStore({
          initialState: {
            product: initialState,
          }
        }),

        provideMockActions(() => actions$),
        provideRouter([
          {
            path: 'products/:id/edit',
            component: ProductFormPage
          }

        ]),
      
        {
  provide: ActivatedRoute,
  useValue: {
    paramMap: paramMap$.asObservable()
  }
},
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductFormPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should not dispatch loadProduct when product id is missing', () => {
    const store = TestBed.inject(Store);
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    fixture.detectChanges();

    expect(component.productId()).toBeNull();
    expect(dispatchSpy).not.toHaveBeenCalled();
  });
 it('should dispatch loadProduct when product id is available', () => {
  const store = TestBed.inject(Store);
  const dispatchSpy = vi.spyOn(store, 'dispatch');

  paramMap$.next(convertToParamMap({ id: '25' }));

  fixture.detectChanges();

  expect(component.productId()).toBe(25);

  expect(dispatchSpy).toHaveBeenCalledWith(
    ProductActions.loadProduct({ id: 25 })
  );
});
it('should dispatch createProduct when saving a new product', () => {
  const store = TestBed.inject(Store);
  const dispatchSpy = vi.spyOn(store, 'dispatch');

  const product = {
    title: 'Laptop',
    price: 50000,
    image: new File(['image'], 'laptop.png', {
      type: 'image/png'
    })
  };

  component.saveProduct(product);

  expect(dispatchSpy).toHaveBeenCalledWith(
    ProductActions.createProduct({ product })
  );
});
it('should dispatch updateProduct when saving an existing product', () => {
  const store = TestBed.inject(MockStore);

  const existingProduct = {
    id: 25,
    title: 'Old Laptop',
    price: 40000,
    image: 'old-laptop.png'
  };

  store.overrideSelector(
    ProductSelectors.selectProductDetails,
    existingProduct
  );

  store.refreshState();

  paramMap$.next(convertToParamMap({ id: '25' }));
  fixture.detectChanges();

  const dispatchSpy = vi.spyOn(store, 'dispatch');

  const product = {
    title: 'New Laptop',
    price: 50000,
    image: new File(['image'], 'new-laptop.png', {
      type: 'image/png'
    })
  };

  component.saveProduct(product);

  expect(dispatchSpy).toHaveBeenCalledWith(
    ProductActions.updateProduct({
      product: {
        id: 25,
        title: 'New Laptop',
        price: 50000,
        image: 'old-laptop.png'
      }
    })
  );
});
it('should not dispatch updateProduct when existing product is not found', () => {
  const store = TestBed.inject(MockStore);

  store.overrideSelector(
    ProductSelectors.selectProductDetails,
    null
  );

  store.refreshState();

  paramMap$.next(convertToParamMap({ id: '25' }));
  fixture.detectChanges();

  const dispatchSpy = vi.spyOn(store, 'dispatch');

  const product = {
    title: 'New Laptop',
    price: 50000,
    image: new File(['image'], 'new-laptop.png', {
      type: 'image/png'
    })
  };

  component.saveProduct(product);

  expect(dispatchSpy).not.toHaveBeenCalledWith(
    expect.objectContaining({
      type: ProductActions.updateProduct.type
    })
  );
});
it('should delegate canDeactivate to ProductForm', () => {
  const canDeactivateSpy = vi.fn().mockReturnValue(true);

  component.productFormComponent = {
    canDeactivate: canDeactivateSpy
  } as any;

  const result = component.canDeactivate();

  expect(canDeactivateSpy).toHaveBeenCalled();
  expect(result).toBe(true);
});
it('should return false when ProductForm prevents navigation', () => {
  const canDeactivateSpy = vi.fn().mockReturnValue(false);

  component.productFormComponent = {
    canDeactivate: canDeactivateSpy
  } as any;

  const result = component.canDeactivate();

  expect(canDeactivateSpy).toHaveBeenCalled();
  expect(result).toBe(false);
});
it('should prevent browser unload when form is dirty', () => {
  component.productFormComponent = {
    productForm: {
      dirty: true
    }
  } as any;

  const event = {
    preventDefault: vi.fn(),
    returnValue: undefined
  } as unknown as BeforeUnloadEvent;

  component.onBeforeUnload(event);

  expect(event.preventDefault).toHaveBeenCalled();
  expect(event.returnValue).toBe('');
});
it('should not prevent browser unload when form is clean', () => {
  component.productFormComponent = {
    productForm: {
      dirty: false
    }
  } as any;

  const event = {
    preventDefault: vi.fn(),
    returnValue: undefined
  } as unknown as BeforeUnloadEvent;

  component.onBeforeUnload(event);

  expect(event.preventDefault).not.toHaveBeenCalled();
  expect(event.returnValue).toBeUndefined();
});
it('should not throw when ProductForm is not initialized', () => {
  component.productFormComponent = undefined as any;

  const event = {
    preventDefault: vi.fn(),
    returnValue: undefined
  } as unknown as BeforeUnloadEvent;

  expect(() => component.onBeforeUnload(event)).not.toThrow();

  expect(event.preventDefault).not.toHaveBeenCalled();
});
});
