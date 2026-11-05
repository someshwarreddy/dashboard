import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Navbar } from './navbar';
import { provideRouter } from '@angular/router';
import { initialState as authInitialState } from '../../store/auth.reducer';
import * as AuthSelectors from '../../store/auth.selectors';
import { User } from '../../models/product';
import * as AuthActions from '../../store/auth.actions';
describe('Navbar', () => {
  let component: Navbar;
  let fixture: ComponentFixture<Navbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Navbar],
      providers: [provideMockStore({
        initialState: {
          auth: authInitialState,
        },
      }), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Navbar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should render Product Dashboard link', () => {
  fixture.detectChanges();

  const link: HTMLAnchorElement =
    fixture.nativeElement.querySelector('a.logo');

  expect(link).toBeTruthy();
  expect(link.textContent.trim()).toBe('Product Dashboard');
  expect(link.getAttribute('href')).toBe('/products');
});
it('should not display user information when unauthenticated', () => {
  fixture.detectChanges();

  const userName = fixture.nativeElement.querySelector('.user-name');
  const logoutButton = fixture.nativeElement.querySelector('button');

  expect(userName).toBeNull();
  expect(logoutButton).toBeNull();
});
it('should render Product Dashboard link', () => {
  fixture.detectChanges();

  const link: HTMLAnchorElement =
    fixture.nativeElement.querySelector('a.logo');

  expect(link).toBeTruthy();
  expect(link.textContent.trim()).toBe('Product Dashboard');
  expect(link.getAttribute('href')).toBe('/products');
});
it('should display user information when authenticated', () => {
  const user: User = {
     _id: '1',
    name: 'Test User',
    email: 'test@example.com',
    role: 'admin'
  };

  const store = TestBed.inject(MockStore);

  store.overrideSelector(AuthSelectors.selectIsAuthenticated, true);
  store.overrideSelector(AuthSelectors.selectUser, user);

  store.refreshState(); // Add this

  fixture.detectChanges();

  const userName = fixture.nativeElement.querySelector('.user-name');
  const logoutButton = fixture.nativeElement.querySelector('button');

  expect(userName).toBeTruthy();
  expect(userName.textContent).toContain('Welcome, Test User');
  expect(logoutButton.textContent.trim()).toBe('Logout');
});
it('should dispatch logout action when logout button is clicked', () => {
  const store = TestBed.inject(MockStore);
  const dispatchSpy = vi.spyOn(store, 'dispatch');

  component.logout();

  expect(dispatchSpy).toHaveBeenCalledWith(AuthActions.logout());
});
it('should display the selected user name', () => {
  const store = TestBed.inject(MockStore);

  store.overrideSelector(AuthSelectors.selectIsAuthenticated, true);
  store.overrideSelector(AuthSelectors.selectUser, {
    id: 2,
    name: 'Angular Developer',
    email: 'angular@example.com',
    role: 'user'
  } as unknown as User);

  store.refreshState();
  fixture.detectChanges();

  const userName: HTMLElement =
    fixture.nativeElement.querySelector('.user-name');

  expect(userName.textContent).toContain('Angular Developer');
});
});
