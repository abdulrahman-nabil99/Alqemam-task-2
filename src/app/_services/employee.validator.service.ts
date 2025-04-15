import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Injectable } from '@angular/core';
import { map, catchError, delay, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { EmployeeService } from './employee.service';

@Injectable({ providedIn: 'root' })
export class EmployeeValidatorService {
  constructor(private employeeService: EmployeeService) {}

  emailExists(id?: number): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return of(control.value).pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap(value => {
          if (!value) return of(null);
          return this.employeeService.emailExists(value, id).pipe(
            map((exists: boolean) => (exists ? { emailUsed: true } : null)),
            catchError(() => of(null))
          );
        })
      );
    };
  }

  mobileExists(id?: number): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return of(control.value).pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap(value => {
          if (!value) return of(null);
          return this.employeeService.mobileExists(value, id).pipe(
            map((exists: boolean) => (exists ? { mobileUsed: true } : null)),
            catchError(() => of(null))
          );
        })
      );
    };
  }
}