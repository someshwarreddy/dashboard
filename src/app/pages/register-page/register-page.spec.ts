
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { RegisterPage } from './register-page';
import { provideRouter } from '@angular/router';
import { initialState as authInitialState } from '../../store/auth.reducer';
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
});
