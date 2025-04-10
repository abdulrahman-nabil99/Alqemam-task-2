import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Employee} from '../_models/employee';
import { DeleteModel, RequestModlel, ResponseModel } from '../_models/shared';
import { IAPIService } from './iapi.service';
import { EMPLOYEES_END_POINT } from '../_models/Constants';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService implements IAPIService<Employee> {

    constructor(private readonly client:HttpClient) { }
    
  getData(model:RequestModlel){
    return this.client.get<ResponseModel<Employee>>(
      EMPLOYEES_END_POINT + "/GetEmployees" +
      `?Mode=${model.mode}&PageSize=${model.pageSize}&PageNumber=${model.pageNumber}&SortColumn=${model.sortColumn}&SortDirection=${model.sortDirection}`
    )
  }

  delete(model:DeleteModel){
    return this.client.delete<ResponseModel<number>>(
      EMPLOYEES_END_POINT + "/DeleteEmployee",
      {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        body : model
      }
    )
  }

  addEdit(employee:Employee){

  }
}
