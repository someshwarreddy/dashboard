import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserReportsPage } from './user-reports-page';

describe('UserReportsPage', () => {
  let component: UserReportsPage;
  let fixture: ComponentFixture<UserReportsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserReportsPage],
    }).compileComponents();

    fixture = TestBed.createComponent(UserReportsPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
