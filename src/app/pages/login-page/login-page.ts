import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import * as AuthActions from '../../store/auth.actions';
import * as AuthSelectors from '../../store/auth.selectors';
@Component({
  selector: 'app-login-page',
  imports: [
    ReactiveFormsModule, RouterLink
  ],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss',
})
export class LoginPage {
  private store = inject(Store);
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  isLoading = this.store.selectSignal(
    AuthSelectors.selectLoading
  );

  error = this.store.selectSignal(
    AuthSelectors.selectError
  );

  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });
  returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
  // login(email: string, password: string) {
  //   this.store.dispatch(
  //     AuthActions.login({
  //       email,
  //       password
  //     })
  //   );
  // }
  login() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.loginForm.getRawValue();

    this.store.dispatch(
      AuthActions.login({
        email,
        password,
        returnUrl: this.returnUrl
      })
    );
  }
}
