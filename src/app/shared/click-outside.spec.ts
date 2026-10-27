
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClickOutside } from './click-outside';

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
});
