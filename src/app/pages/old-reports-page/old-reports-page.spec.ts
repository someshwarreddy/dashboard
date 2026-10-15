import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OldReportsPage } from './old-reports-page';

describe('OldReportsPage', () => {
  let component: OldReportsPage;
  let fixture: ComponentFixture<OldReportsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OldReportsPage],
    }).compileComponents();

    fixture = TestBed.createComponent(OldReportsPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
