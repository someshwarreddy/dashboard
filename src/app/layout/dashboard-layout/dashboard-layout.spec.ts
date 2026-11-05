import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { DashboardLayout } from './dashboard-layout';
import { provideRouter } from '@angular/router';
import { initialState as authInitialState } from '../../store/auth.reducer';
import { MockStore } from '@ngrx/store/testing';
import * as AuthSelectors from '../../store/auth.selectors';
import { User } from '../../models/product';
import * as AuthActions from '../../store/auth.actions';
import { Router } from '@angular/router';
import { Component } from '@angular/core';
@Component({
  standalone: true,
  template: ''
})
class TestRoute {}
describe('DashboardLayout', () => {
  let component: DashboardLayout;
  let fixture: ComponentFixture<DashboardLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardLayout],
      providers: [provideMockStore({
        initialState: {
          auth: authInitialState,
        },
      }), provideRouter([
  { path: 'test', component: TestRoute }
])],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should open profile menu when profile trigger is clicked', () => {
  fixture.detectChanges();

  const profileTrigger: HTMLButtonElement =
    fixture.nativeElement.querySelector('.profile-trigger');

  profileTrigger.click();
  fixture.detectChanges();

  expect(component.profileMenuOpen()).toBe(true);

  const dropdown =
    fixture.nativeElement.querySelector('.profile-dropdown');

  expect(dropdown).toBeTruthy();
});
it('should close profile menu when profile trigger is clicked again', () => {
  fixture.detectChanges();

  const profileTrigger: HTMLButtonElement =
    fixture.nativeElement.querySelector('.profile-trigger');

  profileTrigger.click();
  fixture.detectChanges();

  profileTrigger.click();
  fixture.detectChanges();

  expect(component.profileMenuOpen()).toBe(false);

  const dropdown =
    fixture.nativeElement.querySelector('.profile-dropdown');

  expect(dropdown).toBeNull();
});
it('should close profile menu when closeProfileMenu is called', () => {
  component.profileMenuOpen.set(true);

  component.closeProfileMenu();

  expect(component.profileMenuOpen()).toBe(false);
});
it('should close profile menu when clicking outside', () => {
  fixture.detectChanges();

  component.profileMenuOpen.set(true);
  fixture.detectChanges();

  document.body.dispatchEvent(
    new MouseEvent('click', { bubbles: true })
  );

  fixture.detectChanges();

  expect(component.profileMenuOpen()).toBe(false);
});
it('should display user name, role and avatar initial', () => {
  const store = TestBed.inject(MockStore);

  store.overrideSelector(AuthSelectors.selectUser, {
    id: '1',
    name: 'Someshwar Reddy',
    email: 'test@example.com',
    role: 'Admin',
  } as unknown as User);

  store.refreshState();
  fixture.detectChanges();

  expect(component.userName()).toBe('Someshwar Reddy');
  expect(component.userRole()).toBe('Admin');
  expect(component.userInitial()).toBe('S');

  expect(
    fixture.nativeElement.querySelector('.avatar').textContent.trim()
  ).toBe('S');
});
it('should display default user details when user is null', () => {
  const store = TestBed.inject(MockStore);

  store.overrideSelector(AuthSelectors.selectUser, null);
  store.refreshState();
  fixture.detectChanges();

  expect(component.userName()).toBe('User');
  expect(component.userRole()).toBe('User');
  expect(component.userInitial()).toBe('U');
});
it('should dispatch logout and navigate to login', () => {
  const store = TestBed.inject(MockStore);
  const router = TestBed.inject(Router);

  const dispatchSpy = vi.spyOn(store, 'dispatch');
  const navigateSpy = vi.spyOn(router, 'navigate')
    .mockResolvedValue(true);

  component.logout();

  expect(dispatchSpy).toHaveBeenCalledWith(AuthActions.logout());
  expect(navigateSpy).toHaveBeenCalledWith(['/login']);
});
it('should update aria-expanded when profile menu opens', () => {
  fixture.detectChanges();

  const profileTrigger: HTMLButtonElement =
    fixture.nativeElement.querySelector('.profile-trigger');

  expect(profileTrigger.getAttribute('aria-expanded')).toBe('false');

  profileTrigger.click();
  fixture.detectChanges();

  expect(profileTrigger.getAttribute('aria-expanded')).toBe('true');
});
it('should update aria-expanded when profile menu closes', () => {
  fixture.detectChanges();

  const profileTrigger: HTMLButtonElement =
    fixture.nativeElement.querySelector('.profile-trigger');

  profileTrigger.click();
  fixture.detectChanges();

  profileTrigger.click();
  fixture.detectChanges();

  expect(profileTrigger.getAttribute('aria-expanded')).toBe('false');
});
it('should display user details inside the profile dropdown', () => {
  const user = {
    id: 1,
    name: 'Someshwar Reddy',
    email: 'test@example.com',
    role: 'Admin'
  } as unknown as User;
 const store = TestBed.inject(MockStore);
  store.overrideSelector(AuthSelectors.selectUser, user);
  store.refreshState();

  fixture.detectChanges();

  const profileTrigger: HTMLButtonElement =
    fixture.nativeElement.querySelector('.profile-trigger');

  profileTrigger.click();
  fixture.detectChanges();

  const dropdown: HTMLElement =
    fixture.nativeElement.querySelector('.profile-dropdown');

  expect(dropdown.textContent).toContain('Someshwar Reddy');
  // expect(dropdown.textContent).toContain('test@example.com');
  expect(dropdown.textContent).toContain('Admin');
});
it('should logout when the dropdown logout button is clicked', () => {
  const store = TestBed.inject(MockStore);
  const dispatchSpy = vi.spyOn(store, 'dispatch');
  const router = TestBed.inject(Router);
  const navigateSpy = vi.spyOn(router, 'navigate')
    .mockResolvedValue(true);

  fixture.detectChanges();

  const profileTrigger: HTMLButtonElement =
    fixture.nativeElement.querySelector('.profile-trigger');

  profileTrigger.click();
  fixture.detectChanges();

  const logoutButton: HTMLButtonElement =
    fixture.nativeElement.querySelector('.profile-dropdown button');

  logoutButton.click();

  expect(dispatchSpy).toHaveBeenCalledWith(AuthActions.logout());
  expect(navigateSpy).toHaveBeenCalledWith(['/login']);
});
it('should log router navigation events', async () => {
  const router = TestBed.inject(Router);
  const consoleSpy = vi.spyOn(console, 'log');

  await router.navigateByUrl('/test');

  expect(consoleSpy).toHaveBeenCalledWith(
    'ROUTER EVENT:',
    expect.objectContaining({ type: 0 })
  );

  expect(consoleSpy).toHaveBeenCalledWith(
    'ROUTER EVENT:',
    expect.objectContaining({ type: 1 })
  );

  consoleSpy.mockRestore();
});
});
