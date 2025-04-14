import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Injectable } from '@angular/core';
import { map, catchError, delay } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { EmployeeService } from './employee.service';

@Injectable({ providedIn: 'root' })
export class EmployeeValidatorService {
  constructor(private employeeService: EmployeeService) {}

  emailExists(id?:number): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) return of(null); 

      return this.employeeService.emailExists(control.value,id).pipe(
        delay(500), 
        map((exists: boolean) => (exists ? { emailUsed: true } : null)),
        catchError(() => of(null)) 
      );
    };
  }

  mobileExists(id?:number): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) return of(null); 

      return this.employeeService.mobileExists(control.value,id).pipe(
        delay(500), 
        map((exists: boolean) => (exists ? { mobileUsed: true } : null)),
        catchError(() => of(null)) 
      );
    };
  }
}