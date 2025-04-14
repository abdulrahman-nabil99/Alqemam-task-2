import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EmployeeModel, EmployeeView} from '../_models/employee';
import { DeleteModel, RequestModlel, ResponseModel } from '../_models/shared';
import { IAPIService } from './iapi.service';
import { EMPLOYEES_END_POINT } from '../_models/Constants';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService implements IAPIService<EmployeeView> {

    constructor(private readonly client:HttpClient) { }
    
  getData(model:RequestModlel){
    return this.client.get<ResponseModel<EmployeeView[]>>(
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

  getById(id:number){
    return this.client.get<ResponseModel<EmployeeModel>>(
      EMPLOYEES_END_POINT + "/GetById" + `?Id=${id}`
    )
  }

  addEdit(employee:EmployeeModel){
    if (employee.id > 0){
      return this.client.put<ResponseModel<number>>(
        EMPLOYEES_END_POINT +"/UpdateEmployee" , employee
      )
    }else{
      return this.client.post<ResponseModel<number>>(
        EMPLOYEES_END_POINT +"/AddEmployee" , employee
      )
    }
  }

  emailExists(email:string,id?:number){
    return this.client.get<boolean>(
      EMPLOYEES_END_POINT + "/emailExists" + `?value=${email}&id=${id ?? ''}`
    )
  }

  mobileExists(mobile:string,id?:number){
    return this.client.get<boolean>(
      EMPLOYEES_END_POINT + "/mobileExists" + `?value=${mobile}&id=${id ?? ''}`
    )
  }
}
