import { ComponentFixture, TestBed } from '@angular/core/testing';
import{ provideMockStore } from '@ngrx/store/testing';
import { provideRouter } from '@angular/router';
import { initialState as authInitialState } from '../../store/auth.reducer';

import { LoginPage } from './login-page';
import { initialOrderState } from '../../store/order.reducer';

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
});
