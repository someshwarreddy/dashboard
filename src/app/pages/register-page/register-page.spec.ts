
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { RegisterPage } from './register-page';
import { provideRouter } from '@angular/router';
import { initialState as authInitialState } from '../../store/auth.reducer';
import { Store } from '@ngrx/store';
import * as AuthActions from '../../store/auth.actions';
import { MockStore } from '@ngrx/store/testing';
import * as AuthSelectors from '../../store/auth.selectors';
describe('RegisterPage', () => {
  let component: RegisterPage;
  let fixture: ComponentFixture<RegisterPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterPage],
      providers: [ provideMockStore({
    initialState: {
      auth: authInitialState,
    },
  }) ,
        provideRouter([])
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should have an invalid form when all fields are empty', () => {
  expect(component.registerForm.invalid).toBe(true);
});
it('should invalidate the form when name is empty', () => {
  component.registerForm.controls.email.setValue('test@example.com');
  component.registerForm.controls.password.setValue('password123');

  expect(component.registerForm.controls.name.invalid).toBe(true);
  expect(component.registerForm.invalid).toBe(true);
});
it('should invalidate the form when email format is incorrect', () => {
  component.registerForm.controls.name.setValue('Somesh');
  component.registerForm.controls.email.setValue('invalid-email');
  component.registerForm.controls.password.setValue('password123');

  expect(component.registerForm.controls.email.invalid).toBe(true);
  expect(component.registerForm.invalid).toBe(true);
});
it('should invalidate the form when password is empty', () => {
  component.registerForm.controls.name.setValue('Somesh');
  component.registerForm.controls.email.setValue('test@example.com');

  expect(component.registerForm.controls.password.invalid).toBe(true);
  expect(component.registerForm.invalid).toBe(true);
});
it('should invalidate the form when password has fewer than 6 characters', () => {
  component.registerForm.controls.name.setValue('Somesh');
  component.registerForm.controls.email.setValue('test@example.com');
  component.registerForm.controls.password.setValue('12345');

  expect(component.registerForm.controls.password.invalid).toBe(true);
  expect(component.registerForm.invalid).toBe(true);
});
it('should have a valid form when all fields contain valid values', () => {
  component.registerForm.setValue({
    name: 'Somesh',
    email: 'test@example.com',
    password: 'password123'
  });

  expect(component.registerForm.valid).toBe(true);
});
it('should mark all fields as touched and not dispatch when form is invalid', () => {
  const store = TestBed.inject(Store);
  const dispatchSpy = vi.spyOn(store, 'dispatch');

  component.register();

  expect(component.registerForm.controls.name.touched).toBe(true);
  expect(component.registerForm.controls.email.touched).toBe(true);
  expect(component.registerForm.controls.password.touched).toBe(true);

  expect(dispatchSpy).not.toHaveBeenCalled();
});
it('should dispatch register action when form is valid', () => {
  const store = TestBed.inject(Store);
  const dispatchSpy = vi.spyOn(store, 'dispatch');

  const user = {
    name: 'Somesh',
    email: 'test@example.com',
    password: 'password123'
  };

  component.registerForm.setValue(user);
  component.register();

  expect(dispatchSpy).toHaveBeenCalledWith(
    AuthActions.register(user)
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
  const errorMessage = 'Email already exists';

  store.overrideSelector(AuthSelectors.selectError, errorMessage);
  store.refreshState();
  fixture.detectChanges();

  expect(component.error()).toBe(errorMessage);
});
it('should display name validation message when name is touched and empty', () => {
  component.registerForm.controls.name.markAsTouched();

  fixture.detectChanges();

  const errors = fixture.nativeElement.querySelectorAll('.form-group .error');

  expect(errors.length).toBe(1);
  expect(errors[0].textContent).toContain('Name is required.');
});
it('should display email validation message when email is touched and invalid', () => {
  component.registerForm.controls.name.setValue('Somesh');
  component.registerForm.controls.email.setValue('invalid-email');
  component.registerForm.controls.email.markAsTouched();

  fixture.detectChanges();

  const errors = fixture.nativeElement.querySelectorAll('.form-group .error');

  expect(errors.length).toBe(1);
  expect(errors[0].textContent).toContain('Enter a valid email address.');
});
it('should display password validation message when password is touched and invalid', () => {
  component.registerForm.controls.name.setValue('Somesh');
  component.registerForm.controls.email.setValue('test@example.com');
  component.registerForm.controls.password.setValue('12345');
  component.registerForm.controls.password.markAsTouched();

  fixture.detectChanges();

  const errors = fixture.nativeElement.querySelectorAll('.form-group .error');

  expect(errors.length).toBe(1);
  expect(errors[0].textContent).toContain('Password must be at least 6 characters.');
});
it('should disable register button when form is invalid', () => {
  const store = TestBed.inject(MockStore);

  store.overrideSelector(AuthSelectors.selectLoading, false);
  store.refreshState();

  fixture.detectChanges();

  const button: HTMLButtonElement =
    fixture.nativeElement.querySelector('.register-button');

  expect(button.disabled).toBe(true);
});
it('should display loading text when registration is in progress', () => {
  const store = TestBed.inject(MockStore);

  store.overrideSelector(AuthSelectors.selectLoading, true);
  store.refreshState();

  fixture.detectChanges();

  const button: HTMLButtonElement =
    fixture.nativeElement.querySelector('.register-button');

  expect(button.textContent).toContain('Creating account...');
  expect(button.disabled).toBe(true);
});
it('should display error message when registration fails', () => {
  const store = TestBed.inject(MockStore);
  const errorMessage = 'Email already exists';

  store.overrideSelector(AuthSelectors.selectError, errorMessage);
  store.refreshState();

  fixture.detectChanges();

  const error = fixture.nativeElement.querySelector('.error-message');

  expect(error).toBeTruthy();
  expect(error.textContent).toContain(errorMessage);
});
it('should display login link with correct route', () => {
  fixture.detectChanges();

  const link: HTMLAnchorElement =
    fixture.nativeElement.querySelector('.login-link a');

  expect(link).toBeTruthy();
  expect(link.textContent.trim()).toBe('Login');
  expect(link.getAttribute('href')).toBe('/login');
});
it('should enable register button when form is valid and not loading', () => {
  const store = TestBed.inject(MockStore);

  store.overrideSelector(AuthSelectors.selectLoading, false);
  store.refreshState();

  component.registerForm.setValue({
    name: 'Somesh',
    email: 'test@example.com',
    password: 'password123'
  });

  fixture.detectChanges();

  const button: HTMLButtonElement =
    fixture.nativeElement.querySelector('.register-button');

  expect(component.registerForm.valid).toBe(true);
  expect(component.isLoading()).toBe(false);
  expect(button.disabled).toBe(false);
});
it('should call register when the form is submitted', () => {
  const registerSpy = vi.spyOn(component, 'register');

  component.registerForm.setValue({
    name: 'Somesh',
    email: 'test@example.com',
    password: 'password123'
  });

  fixture.detectChanges();

  const form: HTMLFormElement =
    fixture.nativeElement.querySelector('form');

  form.dispatchEvent(new Event('submit'));

  expect(registerSpy).toHaveBeenCalled();
});
});
