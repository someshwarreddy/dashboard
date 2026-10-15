import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationSidebar } from './notification-sidebar';

describe('NotificationSidebar', () => {
  let component: NotificationSidebar;
  let fixture: ComponentFixture<NotificationSidebar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationSidebar],
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationSidebar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
