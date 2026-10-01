import { Component, inject, effect, output, ElementRef, ViewChild, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, Validators } from '@angular/forms';
import { CreateProduct, Product } from '../../models/product';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Actions, ofType } from '@ngrx/effects';
import * as ProductActions from '../../store/product.actions';
import { Router } from '@angular/router';
@Component({
  selector: 'app-product-form',
  imports: [ReactiveFormsModule],
  templateUrl: './product-form.html',
  styleUrl: './product-form.scss',
})
export class ProductForm {
  // create = output<CreateProduct>();
  save = output<CreateProduct>();
  private fb = inject(FormBuilder);
  product = input<Product | null>(null);
  imageError = '';

  private actions$ = inject(Actions);
  private router = inject(Router);
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
          price: 0
        });

        this.imageFile = null;
        this.imagePreview = null;
      }


    });

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

  }
  productForm = this.fb.group({
    title: ['', [Validators.required]],
    price: [0, [Validators.required, Validators.min(1)]]
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

    // this.create.emit(product);
    this.save.emit(product);
  }
  reset() {

    this.productForm.reset();
    this.imageFile = null;
    this.imagePreview = null;
    this.imageError = '';
    this.fileInput.nativeElement.value = '';

  }
canDeactivate(): boolean {
  console.log('ProductForm canDeactivate called');
  console.log('dirty:', this.productForm.dirty);
  return !this.productForm.dirty;
}
}
