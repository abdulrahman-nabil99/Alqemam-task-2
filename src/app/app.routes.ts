import { Routes } from '@angular/router';
import { EmployeesListComponent } from './_features/employee/employees-list/employees-list.component';
import { AddEditFormComponent } from './_features/employee/add-edit-form/add-edit-form.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'employees',
        pathMatch: 'full'
    },
    {
        path: 'employees',
        component: EmployeesListComponent
    },
    {
        path: 'employees/add',
        component: AddEditFormComponent
    },
    {
        path: 'employees/edit',
        component: AddEditFormComponent
    },
    {
        path: '**',
        redirectTo: 'employees'
    }
];
