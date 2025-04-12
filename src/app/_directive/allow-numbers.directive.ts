import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appAllowNumbers]'
})
export class AllowNumbersDirective {
  constructor(private el: ElementRef) {}
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      return;
    }
    if (event.key === 'Backspace' || event.key === 'Delete') {
      return;
    }
    if (event.key >= '0' && event.key <= '9') {
      return;
    }
    event.preventDefault();
  }
  @HostListener('input', ['$event'])
  onInput(event: Event) {
    const input = this.el.nativeElement;
    const value = input.value;
    if (value.length > 1 && value.startsWith('0')) {
      input.value = value.substring(1);
    }
  }
}
