import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnsavedChangesDialog } from './unsaved-changes-dialog';

describe('UnsavedChangesDialog', () => {
  let component: UnsavedChangesDialog;
  let fixture: ComponentFixture<UnsavedChangesDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnsavedChangesDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(UnsavedChangesDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
