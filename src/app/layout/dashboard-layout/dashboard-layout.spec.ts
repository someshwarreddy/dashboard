import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { DashboardLayout } from './dashboard-layout';
import { provideRouter } from '@angular/router';
import { initialState as authInitialState } from '../../store/auth.reducer';
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
      }), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
