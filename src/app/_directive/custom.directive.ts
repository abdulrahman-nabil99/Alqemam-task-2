import { Directive, ElementRef, HostListener,  Input } from '@angular/core';
import { Patterns } from '../enum/patterns';


@Directive({
  selector: '[appCustom]'
})
export class CustomDirective {
  @Input({required:true}) patternKey!:Patterns

  private specialKeys:string[] = ["Backspace","Tab","Enter","Shift","Control","Alt","CapsLock","Delete","ArrowLeft","ArrowUp","ArrowRight","ArrowDown"]

  private patterns:{key:number,pattern:RegExp,cleanPttern:RegExp}[] = 
  [
    {key:Patterns.ONLY_ENGLISH, pattern:/^[a-zA-Z ]$/, cleanPttern:/[^a-zA-Z ]/g},
    {key:Patterns.ONLY_DIGITS, pattern:/^[\d]$/, cleanPttern:/[^\d]/g},
    {key:Patterns.ONLY_ARABIC, pattern:/^[أ-ي ]$/, cleanPttern:/[^أ-ي ]/g},
    {key: Patterns.EMAIL, pattern: /^[^أ-ي]+$/, cleanPttern: /[أ-ي]/g}
    ]

  constructor(private el:ElementRef) { }
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    const key = event.key;
    if (event.ctrlKey && event.key === 'a') {
      return;
    }
    if (this.specialKeys.includes(key))
      return;
    const pattern = this.patterns.find(p=>p.key == this.patternKey)!
    if (!pattern.pattern.test(key) /*|| (key ==="." && this.el.nativeElement.value.includes("."))*/) {
      event.preventDefault(); 
    }
  }
  // For Pasting Cleans Data
  @HostListener('input') onInput(){
    const pattern = this.patterns.find(p=>p.key == this.patternKey)!
    this.el.nativeElement.value = this.el.nativeElement.value.replace(pattern.cleanPttern,"")
  }
}
