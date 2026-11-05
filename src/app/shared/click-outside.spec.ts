
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClickOutside } from './click-outside';
import { By } from '@angular/platform-browser';

@Component({
  standalone: true,
  imports: [ClickOutside],
  template: `<div appClickOutside></div>`,
})
class TestHostComponent {}

describe('ClickOutside', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('should create the directive', () => {
    const directiveElement =
      fixture.nativeElement.querySelector('[appClickOutside]');

    expect(directiveElement).toBeTruthy();
  });
  it('should not emit when clicking inside the element', () => {
  const directive = fixture.debugElement
    .query(By.directive(ClickOutside))
    .injector.get(ClickOutside);

  const emitSpy = vi.spyOn(directive.appClickOutside, 'emit');

  const element = fixture.nativeElement.querySelector('[appClickOutside]');

  element.dispatchEvent(
    new MouseEvent('click', { bubbles: true })
  );

  expect(emitSpy).not.toHaveBeenCalled();
});
it('should emit when clicking outside the element', () => {
  const directive = fixture.debugElement
    .query(By.directive(ClickOutside))
    .injector.get(ClickOutside);

  const emitSpy = vi.spyOn(directive.appClickOutside, 'emit');

  document.body.dispatchEvent(
    new MouseEvent('click', { bubbles: true })
  );

  expect(emitSpy).toHaveBeenCalledTimes(1);
});
it('should emit when Escape key is pressed', () => {
  const directive = fixture.debugElement
    .query(By.directive(ClickOutside))
    .injector.get(ClickOutside);

  const emitSpy = vi.spyOn(directive.appClickOutside, 'emit');

  document.dispatchEvent(
    new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })
  );

  expect(emitSpy).toHaveBeenCalledTimes(1);
});
});
