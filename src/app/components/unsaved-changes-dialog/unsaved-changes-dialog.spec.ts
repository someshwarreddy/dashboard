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
  it('should display dialog content', () => {
  fixture.detectChanges();

  const element: HTMLElement = fixture.nativeElement;

  expect(element.textContent).toContain('Unsaved Changes');
  expect(element.textContent).toContain('You have unsaved changes.');
  expect(element.textContent).toContain(
    'Are you sure you want to leave this page?'
  );

  expect(element.querySelector('button')?.textContent?.trim())
    .toBe('Stay');
});
it('should emit stay event when Stay button is clicked', () => {
  fixture.detectChanges();

  const staySpy = vi.spyOn(component.stay, 'emit');

  const buttons: NodeListOf<HTMLButtonElement> =
    fixture.nativeElement.querySelectorAll('button');

  buttons[0].click();

  expect(staySpy).toHaveBeenCalled();
});
it('should emit leave event when Leave button is clicked', () => {
  fixture.detectChanges();

  const leaveSpy = vi.spyOn(component.leave, 'emit');

  const buttons: NodeListOf<HTMLButtonElement> =
    fixture.nativeElement.querySelectorAll('button');

  buttons[1].click();

  expect(leaveSpy).toHaveBeenCalled();
});
});
