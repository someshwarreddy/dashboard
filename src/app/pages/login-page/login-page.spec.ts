import { ComponentFixture, TestBed } from '@angular/core/testing';
import{ MockStore, provideMockStore } from '@ngrx/store/testing';
import { provideRouter } from '@angular/router';
import { initialState as authInitialState } from '../../store/auth.reducer';
import * as AuthActions from '../../store/auth.actions';
import * as AuthSelectors from '../../store/auth.selectors';

import { LoginPage } from './login-page';
import { Store } from '@ngrx/store';

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginPage],
      providers: [
        provideMockStore({
          initialState: {
            auth: authInitialState,
          }
        }),
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
    
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should have an invalid form when fields are empty', () => {
  expect(component.loginForm.invalid).toBe(true);
});
it('should invalidate the form when email format is incorrect', () => {
  component.loginForm.controls.email.setValue('invalid-email');
  component.loginForm.controls.password.setValue('password123');

  expect(component.loginForm.controls.email.invalid).toBe(true);
  expect(component.loginForm.invalid).toBe(true);
});
it('should have a valid form when valid credentials are entered', () => {
  component.loginForm.controls.email.setValue('test@example.com');
  component.loginForm.controls.password.setValue('password123');

  expect(component.loginForm.valid).toBe(true);
});
it('should mark all fields as touched and not dispatch when form is invalid', () => {
  const store = TestBed.inject(Store);
  const dispatchSpy = vi.spyOn(store, 'dispatch');

  component.login();

  expect(component.loginForm.controls.email.touched).toBe(true);
  expect(component.loginForm.controls.password.touched).toBe(true);
  expect(dispatchSpy).not.toHaveBeenCalled();
});
it('should dispatch login action when form is valid', () => {
  const store = TestBed.inject(Store);
  const dispatchSpy = vi.spyOn(store, 'dispatch');

  const credentials = {
    email: 'test@example.com',
    password: 'password123'
  };

  component.loginForm.setValue(credentials);
  component.login();

  expect(dispatchSpy).toHaveBeenCalledWith(
    AuthActions.login({
      ...credentials,
      returnUrl: null
    })
  );
});
it('should return loading state from the store', () => {
  const store = TestBed.inject(MockStore);

  store.overrideSelector(AuthSelectors.selectLoading, true);
  store.refreshState();
  fixture.detectChanges();

  expect(component.isLoading()).toBe(true);
});
it('should return error message from the store', () => {
  const store = TestBed.inject(MockStore);
  const errorMessage = 'Invalid email or password';

  store.overrideSelector(AuthSelectors.selectError, errorMessage);
  store.refreshState();
  fixture.detectChanges();

  expect(component.error()).toBe(errorMessage);
});
it('should display email validation message when email is touched and invalid', () => {
  component.loginForm.controls.email.setValue('invalid-email');
  component.loginForm.controls.email.markAsTouched();

  fixture.detectChanges();

  const error = fixture.nativeElement.querySelector('.form-group .error');

  expect(error).toBeTruthy();
  expect(error.textContent).toContain('Enter a valid email address.');
});
it('should display password validation message when password is touched and empty', () => {
  component.loginForm.controls.password.markAsTouched();

  fixture.detectChanges();

  const errors = fixture.nativeElement.querySelectorAll('.form-group .error');

  expect(errors.length).toBe(1);
  expect(errors[0].textContent).toContain('Password is required.');
});
it('should disable login button when form is invalid', () => {
  fixture.detectChanges();

  const button: HTMLButtonElement =
    fixture.nativeElement.querySelector('.login-button');

  expect(button.disabled).toBe(true);
});
it('should display loading text when login is in progress', () => {
  const store = TestBed.inject(MockStore);

  store.overrideSelector(AuthSelectors.selectLoading, true);
  store.refreshState();

  fixture.detectChanges();

  const button: HTMLButtonElement =
    fixture.nativeElement.querySelector('.login-button');

  expect(button.textContent).toContain('Logging in...');
  expect(button.disabled).toBe(true);
});
it('should display error message when login fails', () => {
  const store = TestBed.inject(MockStore);
  const errorMessage = 'Invalid email or password';

  store.overrideSelector(AuthSelectors.selectError, errorMessage);
  store.refreshState();

  fixture.detectChanges();

  const error = fixture.nativeElement.querySelector('.error-message');

  expect(error).toBeTruthy();
  expect(error.textContent).toContain(errorMessage);
});
it('should display register link with correct route', () => {
  fixture.detectChanges();

  const link: HTMLAnchorElement =
    fixture.nativeElement.querySelector('.register-link a');

  expect(link).toBeTruthy();
  expect(link.textContent.trim()).toBe('Register');
  expect(link.getAttribute('href')).toBe('/register');
});
// it('should enable login button when form is valid and not loading', () => {
//   component.loginForm.setValue({
//     email: 'test@example.com',
//     password: 'password123'
//   });

//   fixture.detectChanges();


//   expect(component.loginForm.valid).toBe(true);
//   expect(component.isLoading()).toBe(false);

//   const button: HTMLButtonElement =
//     fixture.nativeElement.querySelector('.login-button');

//   expect(button.disabled).toBe(false);
// });
it('should enable login button when form is valid and not loading', () => {
  component.loginForm.controls.email.setValue('test@example.com');
  component.loginForm.controls.password.setValue('password123');

  console.log('Email status:', component.loginForm.controls.email.status);
  console.log('Password status:', component.loginForm.controls.password.status);
  console.log('Form errors:', component.loginForm.errors);
  console.log('Form status:', component.loginForm.status);

  expect(component.loginForm.valid).toBe(true);
});
it('should enable login button when form is valid and not loading', () => {
  const store = TestBed.inject(MockStore);

  store.overrideSelector(AuthSelectors.selectLoading, false);
  store.refreshState();

  component.loginForm.setValue({
    email: 'test@example.com',
    password: 'password123'
  });

  fixture.detectChanges();

  expect(component.loginForm.valid).toBe(true);
  expect(component.isLoading()).toBe(false);

  const button: HTMLButtonElement =
    fixture.nativeElement.querySelector('.login-button');

  expect(button.disabled).toBe(false);
});
it('should call login when form is submitted', () => {
  const loginSpy = vi.spyOn(component, 'login');

  component.loginForm.setValue({
    email: 'test@example.com',
    password: 'password123'
  });

  fixture.detectChanges();

  const form: HTMLFormElement =
    fixture.nativeElement.querySelector('form');

  form.dispatchEvent(new Event('submit'));

  expect(loginSpy).toHaveBeenCalled();
});
});
