import { Component, inject, effect, output, ElementRef, ViewChild, input, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { CreateProduct, Product } from '../../models/product';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Actions, ofType } from '@ngrx/effects';
import * as ProductActions from '../../store/product.actions';
import { Router } from '@angular/router';
import { UnsavedChangesDialog } from '../unsaved-changes-dialog/unsaved-changes-dialog';
import { ProductValidators } from
  '../../shared/validators/product.validators';
@Component({
  selector: 'app-product-form',
  imports: [ReactiveFormsModule, UnsavedChangesDialog],
  templateUrl: './product-form.html',
  styleUrl: './product-form.scss',
})
export class ProductForm {
  // create = output<CreateProduct>();
  save = output<CreateProduct>();
  private fb = inject(FormBuilder);
  product = input<Product | null>(null);
  imageError = '';
  isSaving = signal(false);
  showUnsavedDialog = signal(false);
  private actions$ = inject(Actions);
  private router = inject(Router);
  private navigationDecision?: (value: boolean) => void;
  constructor() {
    effect(() => {
      const product = this.product();

      if (product) {
        this.productForm.patchValue({
          title: product.title,
          price: product.price
        });

        this.imagePreview = product.image;
      } else {
        this.productForm.reset({
          title: '',
          price: null
        });

        this.imageFile = null;
        this.imagePreview = null;
      }


    });
    // Success
    this.actions$
      .pipe(
        ofType(
          ProductActions.createProductSuccess,
          ProductActions.updateProductSuccess
        ),
        takeUntilDestroyed()
      )
      .subscribe(() => {
        this.router.navigate(['/products']);
      });

    // Failure
    this.actions$
      .pipe(
        ofType(
          ProductActions.createProductFailure,
          ProductActions.updateProductFailure
        ),
        takeUntilDestroyed()
      )
      .subscribe(() => {
        this.isSaving.set(false);
      });

  }
  productForm = this.fb.group({
    title: this.fb.control<string | null>('', [
      ProductValidators.titleRequired,
      ProductValidators.titleMinLength,
      ProductValidators.titleNoWhitespace
    ]),
    price: this.fb.control<number | null>(null, [
      ProductValidators.priceRequired,
      ProductValidators.priceMin
    ])
  });

  @ViewChild('fileInput')
  fileInput!: ElementRef<HTMLInputElement>;
  imageFile: File | null = null;
  imagePreview: string | null = null;

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      this.imageFile = input.files[0];
      this.imagePreview = URL.createObjectURL(this.imageFile);
    }
  }
  createProduct() {

    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      //   
      return;
    }
    if (!this.imageFile && !this.product()) {
      this.imageError = 'Product image is required';
      return;
    }

    const product: CreateProduct = {
      title: this.productForm.value.title ?? '',
      price: Number(this.productForm.value.price ?? 0),
      image: this.imageFile!
    };
    this.isSaving.set(true);
    this.save.emit(product);
  }

  reset() {
    const product = this.product();

    if (product) {
      // Edit mode: restore original product values
      this.productForm.reset({
        title: product.title,
        price: product.price
      });

      this.imagePreview = product.image;
    } else {
      // Create mode: clear the form
      this.productForm.reset();
      this.imagePreview = null;
    }

    this.imageFile = null;
    this.imageError = '';
    this.fileInput.nativeElement.value = '';
  }

  onStay() {
    this.showUnsavedDialog.set(false);
    this.navigationDecision?.(false);
    this.navigationDecision = undefined;
  }

  onLeave() {
    this.showUnsavedDialog.set(false);
    this.navigationDecision?.(true);
    this.navigationDecision = undefined;
  }

  canDeactivate(): boolean | Promise<boolean> {
    if (this.isSaving()) {
      return true;
    }

    if (!this.productForm.dirty) {
      return true;
    }

    this.showUnsavedDialog.set(true);

    return new Promise<boolean>(resolve => {
      this.navigationDecision = resolve;
    });
  }
  addTitleMaxLengthValidator(): void {
    const title = this.productForm.controls.title;

    title.addValidators(ProductValidators.titleMaxLength);
    title.updateValueAndValidity();
  }
}
