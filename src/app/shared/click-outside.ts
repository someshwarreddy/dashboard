
import {
  Directive,
  ElementRef,
  output,
  HostListener,
  inject
} from '@angular/core';

@Directive({
  selector: '[appClickOutside]',
  standalone: true
})
export class ClickOutside {
  private elementRef = inject(ElementRef<HTMLElement>);

  appClickOutside = output<void>();

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target;

    if (
      target instanceof Node &&
      !this.elementRef.nativeElement.contains(target)
    ) {
      this.appClickOutside.emit();
    }
  }
  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    this.appClickOutside.emit();
  }
}
