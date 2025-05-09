import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EmployeeModel, EmployeeView} from '../_models/employee';
import { DeleteModel, RequestModlel, ResponseModel } from '../_models/shared';
import { IAPIService } from './iapi.service';
import { EMPLOYEES_END_POINT, EMPLOYEES_HUB } from '../_models/Constants';
import * as signalR from '@microsoft/signalr';


@Injectable({
  providedIn: 'root'
})
export class EmployeeService implements IAPIService<EmployeeView> {
  private hubConnection!: signalR.HubConnection;
  constructor(private readonly client:HttpClient) { }

  subscribeToSignals(): void {
    this.hubConnection = new signalR.HubConnectionBuilder()
    .withUrl(EMPLOYEES_HUB)
    .withAutomaticReconnect()
    .build();

  this.hubConnection
    .start()
    .then(() => console.log('Connected To Employees Hub'))
    .catch(err => console.log('SignalR Error: ', err));
  }

  oDataChange(callback: (data: any) => void): void {
    this.hubConnection.on('reload', callback);
  }
    
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
