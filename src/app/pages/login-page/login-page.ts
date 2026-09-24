import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import * as AuthActions from '../../store/auth.actions';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
@Component({
  selector: 'app-login-page',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss',
})
export class LoginPage {
  private store = inject(Store);
  private fb = inject(FormBuilder);
  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });
  login(email: string, password: string) {
    this.store.dispatch(
      AuthActions.login({
        email,
        password
      })
    );
  }
}
