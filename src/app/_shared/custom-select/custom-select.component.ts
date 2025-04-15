import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, forwardRef, HostListener, Input, OnDestroy, OnInit, Output} from '@angular/core';
import { AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from '@angular/forms';
import { SelectOption } from '../../_models/shared';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-custom-select',
  imports: [CommonModule, TranslateModule],
  providers:[
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomSelectComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: CustomSelectComponent
    }
  ],
  templateUrl: './custom-select.component.html',
  styleUrl: './custom-select.component.css'
})
export class CustomSelectComponent implements ControlValueAccessor,Validator,OnInit,OnDestroy {

  @Input() options: SelectOption[] = [];
  @Input() placeholder:string = 'Select';
  @Input() required:boolean = false;
  @Input() disabled:boolean = false
  @Input() selectedOption:number = 0
  @Output() onSelectionChange = new EventEmitter<SelectOption>()
  isOpen = false;
  langCode!:string
  private subs = new Subscription()

  constructor(
    private translateServise:TranslateService,
    private elRef: ElementRef
  ){
  }

  ngOnInit(): void {
    this.langCode = this.translateServise.currentLang;
    this.subs.add(
      this.translateServise.onLangChange.subscribe(res=>{
        this.langCode = res.lang
      })
    )
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.elRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }
  onChange = (value: any) => {};
  onTouched = () => {};

  selectOption(option: SelectOption) {
    this.selectedOption = option.id;
    this.onSelectionChange.emit(option);
    this.onChange(this.selectedOption);
    this.onTouched();
    this.isOpen = false;
  }

  writeValue(obj: any): void {
    this.selectedOption = obj;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  toggleDropdown() {
    if (this.disabled)
      return
    this.isOpen = !this.isOpen;
  }

  get selectedLabel(): string {
    const found = this.options?.find(opt => opt.id === this.selectedOption);
    return found ? (this.langCode =="ar"?found.labelAr:found.labelEn) : this.placeholder;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  validate(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (this.required && value <= 0) {
      return {
        required: {
          value
        }
      };
    }
    return null
  }
  registerOnValidatorChange?(fn: () => void): void {
    
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe()
  }
}
