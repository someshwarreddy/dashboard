import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationCreatePage } from './notification-create-page';

describe('NotificationCreatePage', () => {
  let component: NotificationCreatePage;
  let fixture: ComponentFixture<NotificationCreatePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationCreatePage],
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationCreatePage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
