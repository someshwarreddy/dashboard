import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { provideMockStore } from '@ngrx/store/testing';
import { Store } from '@ngrx/store';
import * as AuthActions from './store/auth.actions';
import { Component } from '@angular/core';
import { provideRouter, Router } from '@angular/router';

@Component({
  standalone: true,
  template: '<p>Test route works</p>'
})
class TestRoute {}
@Component({
  standalone: true,
  template: '<p>Another route</p>'
})
class AnotherRoute {}
@Component({
  standalone: true,
  template: '<p>Notifications sidebar</p>'
})
class TestSidebar {}
describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideMockStore({}),
         provideRouter([
    { path: 'test', component: TestRoute },
    { path: 'another', component: AnotherRoute },
    {
  path: 'notifications',
  component: TestSidebar,
  outlet: 'sidebar'
}
  ])
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
it('should dispatch restoreAuth on initialization', () => {
  const fixture = TestBed.createComponent(App);
  const store = TestBed.inject(Store);

  const dispatchSpy = vi.spyOn(store, 'dispatch');

  fixture.detectChanges();

  expect(dispatchSpy).toHaveBeenCalledWith(
    AuthActions.restoreAuth()
  );
});
it('should log when a route component is activated', () => {
  const fixture = TestBed.createComponent(App);
  const app = fixture.componentInstance;
  const consoleSpy = vi.spyOn(console, 'log');

  const component = { name: 'TestComponent' };

  app.onActivate(component);

  expect(consoleSpy).toHaveBeenCalledWith(
    '🟢 ROUTE ACTIVATED:',
    component
  );

  consoleSpy.mockRestore();
});
it('should log when a route component is deactivated', () => {
  const fixture = TestBed.createComponent(App);
  const app = fixture.componentInstance;
  const consoleSpy = vi.spyOn(console, 'log');

  const component = { name: 'TestComponent' };

  app.onDeactivate(component);

  expect(consoleSpy).toHaveBeenCalledWith(
    '🔴 ROUTE DEACTIVATED:',
    component
  );

  consoleSpy.mockRestore();
});
it('should render primary and sidebar router outlets', () => {
  const fixture = TestBed.createComponent(App);
  fixture.detectChanges();

  const outlets: HTMLElement[] =
    Array.from(
      fixture.nativeElement.querySelectorAll('router-outlet')
    );

  expect(outlets.length).toBe(2);
  expect(outlets[0].getAttribute('name')).toBeNull();
  expect(outlets[1].getAttribute('name')).toBe('sidebar');
});
it('should call onActivate when a route is activated', async () => {
  const fixture = TestBed.createComponent(App);
  const app = fixture.componentInstance;
  const router = TestBed.inject(Router);
  const activateSpy = vi.spyOn(app, 'onActivate');

  await router.navigateByUrl('/test');
  fixture.detectChanges();

  expect(activateSpy).toHaveBeenCalledWith(
    expect.any(TestRoute)
  );
});
it('should call onDeactivate when a route is deactivated', async () => {
  const fixture = TestBed.createComponent(App);
  const app = fixture.componentInstance;
  const router = TestBed.inject(Router);

  const deactivateSpy = vi.spyOn(app, 'onDeactivate');

  await router.navigateByUrl('/test');
  fixture.detectChanges();

  await router.navigateByUrl('/another');
  fixture.detectChanges();

  expect(deactivateSpy).toHaveBeenCalledWith(
    expect.any(TestRoute)
  );
});
it('should activate the sidebar outlet independently', async () => {
  const fixture = TestBed.createComponent(App);
  const router = TestBed.inject(Router);

  await router.navigateByUrl('/test(sidebar:notifications)');
  fixture.detectChanges();

  expect(fixture.nativeElement.textContent).toContain(
    'Test route works'
  );

  expect(fixture.nativeElement.textContent).toContain(
    'Notifications sidebar'
  );
});
});
