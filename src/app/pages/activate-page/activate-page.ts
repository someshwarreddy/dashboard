import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { inject, signal } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
  ValidatorFn
} from '@angular/forms';

import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { HttpErrorResponse } from '@angular/common/http';


export const passwordMatchValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;

  return password === confirmPassword
    ? null
    : { passwordMismatch: true };
};


@Component({
  selector: 'app-activate-page',
  imports: [ReactiveFormsModule],
  templateUrl: './activate-page.html',
  styleUrl: './activate-page.scss',
})
export class ActivatePage {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
private readonly authService = inject(AuthService);
private readonly router = inject(Router);

submitting = signal(false);
errorMessage = signal('');
successMessage = signal('');
  token = signal(
    this.route.snapshot.queryParamMap.get('token') ?? ''
  );

 activateForm = this.fb.nonNullable.group(
  {
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required]
  },
  {
    validators: [passwordMatchValidator]
  }
);
onSubmit(): void {
  if (this.activateForm.invalid || !this.token()) {
    this.activateForm.markAllAsTouched();
    return;
  }

  this.submitting.set(true);
  this.errorMessage.set('');
  this.successMessage.set('');

  const { password } = this.activateForm.getRawValue();

  this.authService.activateAccount({
    token: this.token(),
    password
  }).subscribe({
    next: (response) => {
  this.successMessage.set(response.message);

  // Reset password fields and validation states
  this.activateForm.reset();

  this.submitting.set(false);
},
    error: (error: HttpErrorResponse) => {
      this.errorMessage.set(
        error.error?.message || 'Account activation failed. Please try again.'
      );
      this.submitting.set(false);
    }
  });
}
}
