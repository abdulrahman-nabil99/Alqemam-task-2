import { CommonModule } from '@angular/common';
import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from '@angular/forms';
import { SelectOption } from '../../_models/shared';
import { TranslateModule } from '@ngx-translate/core';
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
export class CustomSelectComponent implements ControlValueAccessor,Validator {

  @Input() options: SelectOption[] = [];
  @Input() placeholder:string = 'Select';
  @Input() required:boolean = false;


  isOpen = false;
  @Input() disabled:boolean = false
  @Input() selectedOption:number = 0
  @Output() onSelectionChange = new EventEmitter<SelectOption>()
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
    const found = this.options.find(opt => opt.id === this.selectedOption);
    return found ? found.label : this.placeholder;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  validate(control: AbstractControl): ValidationErrors | null {
    const mode = control.value;
    if (this.required && mode <= 0) {
      return {
        required: {
          mode
        }
      };
    }
    return null
  }
  registerOnValidatorChange?(fn: () => void): void {
    
  }
}
