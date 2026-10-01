import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import * as AuthActions from '../../store/auth.actions';
import * as AuthSelectors from '../../store/auth.selectors';
@Component({
  selector: 'app-register-page',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register-page.html',
  styleUrl: './register-page.scss'
})
export class RegisterPage {

  private fb = inject(FormBuilder);
  private store = inject(Store);
  isLoading = this.store.selectSignal(
    AuthSelectors.selectLoading
  );

  error = this.store.selectSignal(
    AuthSelectors.selectError
  );
  registerForm = this.fb.nonNullable.group({
    name: ['', Validators.required],

    email: ['', [
      Validators.required,
      Validators.email
    ]],

    password: ['', [
      Validators.required,
      Validators.minLength(6)
    ]]
  });

  register() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const { name, email, password } =
      this.registerForm.getRawValue();

    this.store.dispatch(
      AuthActions.register({
        name,
        email,
        password
      })
    );
  }
}