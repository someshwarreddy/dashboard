import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { ProductForm } from './product-form';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import * as ProductActions from '../../store/product.actions';
describe('ProductForm', () => {
  let component: ProductForm;
  let fixture: ComponentFixture<ProductForm>;
  let router: { navigate: ReturnType<typeof vi.fn> };
  let actions$: Subject<Action>;
  beforeEach(async () => {
    actions$ = new Subject<Action>();
    await TestBed.configureTestingModule({
      imports: [ProductForm],
      providers: [
        provideMockStore(),
        provideMockActions(() => actions$),
        {
          provide: Router,
          useValue: {
            navigate: vi.fn()
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductForm);
    router = TestBed.inject(Router) as unknown as {
      navigate: ReturnType<typeof vi.fn>;
    };
    component = fixture.componentInstance;

    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should mark all fields as touched when form is invalid', () => {
    const saveSpy = vi.spyOn(component.save, 'emit');

    component.createProduct();

    expect(component.productForm.invalid).toBe(true);
    expect(component.productForm.controls.title.touched).toBe(true);
    expect(component.productForm.controls.price.touched).toBe(true);
    expect(saveSpy).not.toHaveBeenCalled();
  });
  it('should show an error when image is missing', () => {
    const saveSpy = vi.spyOn(component.save, 'emit');

    component.productForm.setValue({
      title: 'Test Product',
      price: 100
    });

    component.createProduct();

    expect(component.imageError).toBe('Product image is required');
    expect(saveSpy).not.toHaveBeenCalled();
  });
  it('should emit product data when the form is valid', () => {
    const saveSpy = vi.spyOn(component.save, 'emit');
    const image = new File(['test image'], 'product.png', {
      type: 'image/png'
    });

    component.productForm.setValue({
      title: 'Test Product',
      price: 100
    });

    component.imageFile = image;

    component.createProduct();

    expect(saveSpy).toHaveBeenCalledWith({
      title: 'Test Product',
      price: 100,
      image
    });
  });
  it('should populate form fields and image preview when editing a product', async () => {
    const existingProduct = {
      id: 1,
      title: 'Laptop',
      price: 50000,
      image: 'https://example.com/laptop.png'
    };

    fixture.componentRef.setInput('product', existingProduct);

    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.productForm.value).toEqual({
      title: 'Laptop',
      price: 50000
    });

    expect(component.imagePreview).toBe(existingProduct.image);

    const imageElement: HTMLImageElement =
      fixture.nativeElement.querySelector('img');

    expect(imageElement).toBeTruthy();
    expect(imageElement.src).toBe(existingProduct.image);
  });
  it('should store selected image and generate preview URL', () => {
    const image = new File(['test image'], 'product.png', {
      type: 'image/png'
    });

    const previewUrl = 'blob:test-preview';

    const createObjectURLSpy = vi
      .spyOn(URL, 'createObjectURL')
      .mockReturnValue(previewUrl);

    const event = {
      target: {
        files: [image]
      }
    } as unknown as Event;

    component.onImageSelected(event);

    expect(component.imageFile).toBe(image);
    expect(component.imagePreview).toBe(previewUrl);

    createObjectURLSpy.mockRestore();
  });
  it('should reset form and image fields', () => {
    component.productForm.setValue({
      title: 'Test Product',
      price: 100
    });

    component.imageFile = new File(['image'], 'product.png');
    component.imagePreview = 'blob:test-preview';
    component.imageError = 'Some error';

    fixture.detectChanges();

    component.reset();

    expect(component.productForm.value).toEqual({
      title: null,
      price: null
    });
    expect(component.imageFile).toBeNull();
    expect(component.imagePreview).toBeNull();
    expect(component.imageError).toBe('');
    expect(component.fileInput.nativeElement.value).toBe('');
  });
  it('should apply maximum length validator when enabled', () => {
    const title = component.productForm.controls.title;

    component.addTitleMaxLengthValidator();

    title.setValue('A'.repeat(51));

    expect(title.hasError('maxlength')).toBe(true);
    expect(title.valid).toBe(false);
  });
  it('should allow navigation when form is pristine', () => {
    const result = component.canDeactivate();

    expect(result).toBe(true);
    expect(component.showUnsavedDialog()).toBe(false);
  });
  it('should show confirmation dialog when form is dirty', () => {
    component.productForm.controls.title.setValue('Laptop');
    component.productForm.controls.title.markAsDirty();

    const result = component.canDeactivate();

    expect(result).toBeInstanceOf(Promise);
    expect(component.showUnsavedDialog()).toBe(true);

    // Resolve the pending navigation decision.
    component.onStay();
  });
  it('should cancel navigation when user chooses Stay', async () => {
    component.productForm.controls.title.setValue('Laptop');
    component.productForm.controls.title.markAsDirty();

    const navigation = component.canDeactivate();

    component.onStay();

    await expect(navigation).resolves.toBe(false);
    expect(component.showUnsavedDialog()).toBe(false);
  });
  it('should allow navigation when user chooses Leave', async () => {
    component.productForm.controls.title.setValue('Laptop');
    component.productForm.controls.title.markAsDirty();

    const navigation = component.canDeactivate();

    component.onLeave();

    await expect(navigation).resolves.toBe(true);
    expect(component.showUnsavedDialog()).toBe(false);
  }); it('should allow navigation when saving is in progress', () => {
    component.productForm.setValue({
      title: 'Laptop',
      price: 100
    });

    component.productForm.controls.title.markAsDirty();

    component.imageFile = new File(['image'], 'laptop.png', {
      type: 'image/png'
    });

    component.createProduct();

    const result = component.canDeactivate();

    expect(result).toBe(true);
    expect(component.showUnsavedDialog()).toBe(false);
  });
  it('should navigate to products when create succeeds', () => {
  actions$.next(ProductActions.createProductSuccess({
    product: {
      id: 1,
      title: 'Laptop',
      price: 100,
      image: 'laptop.png'
    }
  }));

  expect(router.navigate).toHaveBeenCalledWith(['/products']);
});
it('should navigate to products when update succeeds', () => {
  actions$.next(ProductActions.updateProductSuccess({
    product: {
      id: 1,
      title: 'Updated Laptop',
      price: 200,
      image: 'laptop.png'
    }
  }));

  expect(router.navigate).toHaveBeenCalledWith(['/products']);
});
it('should not navigate for unrelated actions', () => {
  actions$.next({ type: '[Product] Load Products' });

  expect(router.navigate).not.toHaveBeenCalled();
});
it('should not navigate after component is destroyed', () => {
  fixture.destroy();

  actions$.next(ProductActions.createProductSuccess({
    product: {
      id: 1,
      title: 'Laptop',
      price: 100,
      image: 'laptop.png'
    }
  }));

  expect(router.navigate).not.toHaveBeenCalled();
});
it('should display title required message when title is touched and empty', () => {
  const titleControl = component.productForm.controls.title;

  titleControl.markAsTouched();
  fixture.detectChanges();

  expect(fixture.nativeElement.textContent)
    .toContain('Title is required');
});
it('should display whitespace error when title contains only spaces', () => {
  const titleControl = component.productForm.controls.title;

  titleControl.setValue('   ');
  titleControl.markAsTouched();

  fixture.detectChanges();

  expect(fixture.nativeElement.textContent)
    .toContain('Title cannot contain only spaces');
});
it('should display minimum length error when title has fewer than 3 characters', () => {
  const titleControl = component.productForm.controls.title;

  titleControl.setValue('AB');
  titleControl.markAsTouched();

  fixture.detectChanges();

  expect(fixture.nativeElement.textContent)
    .toContain('Title must contain at least 3 characters');
});
it('should display maximum length error when title exceeds 50 characters', () => {
  component.addTitleMaxLengthValidator();

  const titleControl = component.productForm.controls.title;
  titleControl.setValue('A'.repeat(51));
  titleControl.markAsTouched();

  fixture.detectChanges();

  expect(fixture.nativeElement.textContent)
    .toContain('Title cannot exceed 50 characters');
});
it('should display price required message when price is empty', () => {
  const priceControl = component.productForm.controls.price;

  priceControl.setValue(null);
  priceControl.markAsTouched();

  fixture.detectChanges();

  expect(fixture.nativeElement.textContent)
    .toContain('Price is required');
});
it('should display minimum price error when price is zero', () => {
  const priceControl = component.productForm.controls.price;

  priceControl.setValue(0);
  priceControl.markAsTouched();

  fixture.detectChanges();

  expect(fixture.nativeElement.textContent)
    .toContain('Price must be greater than 0');
});

it('should not display image when imagePreview is null', () => {
  fixture.componentRef.setInput('product', null);
  fixture.detectChanges();

  expect(component.imagePreview).toBeNull();

  const image = fixture.nativeElement.querySelector('img');

  expect(image).toBeNull();
});
it('should enable maximum length validator when button is clicked', () => {
  fixture.detectChanges();

  const buttons = fixture.nativeElement.querySelectorAll('button');
  const maxLengthButton = Array.from(buttons).find(
    (button: unknown) =>
      (button as HTMLButtonElement).textContent?.includes('Enable 50-character limit')
  ) as HTMLButtonElement;

  maxLengthButton.click();
const titleControl = component.productForm.controls.title;

titleControl.setValue('A'.repeat(51));

expect(titleControl.hasError('maxlength')).toBe(true);
});
it('should allow saving an existing product without selecting a new image', () => {
  fixture.componentRef.setInput('product', {
    id: 1,
    title: 'Laptop',
    price: 50000,
    image: 'laptop.png'
  });

  fixture.detectChanges();

  const saveSpy = vi.spyOn(component.save, 'emit');

  component.productForm.setValue({
    title: 'Updated Laptop',
    price: 60000
  });

  component.createProduct();

  expect(saveSpy).toHaveBeenCalledWith({
    title: 'Updated Laptop',
    price: 60000,
    image: null
  });
});
it('should not update image when no file is selected', () => {
  const existingImage = new File(['image'], 'old.png');
  component.imageFile = existingImage;
  component.imagePreview = 'old-preview';

  const event = {
    target: {
      files: []
    }
  } as unknown as Event;

  component.onImageSelected(event);

  expect(component.imageFile).toBe(existingImage);
  expect(component.imagePreview).toBe('old-preview');
});
it('should reset form and clear image when switching to create mode', async () => {
  fixture.componentRef.setInput('product', {
    id: 1,
    title: 'Laptop',
    price: 50000,
    image: 'laptop.png'
  });

  fixture.detectChanges();
  await fixture.whenStable();

  component.imageFile = new File(['image'], 'laptop.png');

  fixture.componentRef.setInput('product', null);

  fixture.detectChanges();
  await fixture.whenStable();

  expect(component.productForm.value).toEqual({
    title: '',
    price: 0
  });
  expect(component.imageFile).toBeNull();
  expect(component.imagePreview).toBeNull();
});
it('should not update image when files property is null', () => {
  const event = {
    target: {
      files: null
    }
  } as unknown as Event;

  component.onImageSelected(event);

  expect(component.imageFile).toBeNull();
  expect(component.imagePreview).toBeNull();
});

});
