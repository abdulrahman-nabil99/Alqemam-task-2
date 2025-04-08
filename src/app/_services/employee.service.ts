import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Employee, RequestModlel } from '../_models/employee';
import { ResponseModel } from '../_models/shared';
import { WorkingMode } from '../enum/mode';
import { IAPIService } from './iapi.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService implements IAPIService<Employee> {
  //#region Data
  private dummyData:Employee[] = [
    { id: 1, fullNameAr: "أحمد محمد", fullNameEn: "Ahmed Mohamed", departmentAr: "قسم 1", departmentEn: "Department 1" },
    { id: 2, fullNameAr: "أحمد علي", fullNameEn: "Ahmed Aly", departmentAr: "قسم 2", departmentEn: "Department 2" },
    { id: 3, fullNameAr: "عمر إبراهيم", fullNameEn: "Omar Ibrahim", departmentAr: "قسم 3", departmentEn: "Department 3" },
    { id: 4, fullNameAr: "موظف 4", fullNameEn: "Employee 4", departmentAr: "قسم 4", departmentEn: "Department 4" },
    { id: 5, fullNameAr: "موظف 5", fullNameEn: "Employee 5", departmentAr: "قسم 5", departmentEn: "Department 5" },
    { id: 6, fullNameAr: "موظف 6", fullNameEn: "Employee 6", departmentAr: "قسم 1", departmentEn: "Department 1" },
    { id: 7, fullNameAr: "موظف 7", fullNameEn: "Employee 7", departmentAr: "قسم 2", departmentEn: "Department 2" },
    { id: 8, fullNameAr: "موظف 8", fullNameEn: "Employee 8", departmentAr: "قسم 3", departmentEn: "Department 3" },
    { id: 9, fullNameAr: "موظف 9", fullNameEn: "Employee 9", departmentAr: "قسم 4", departmentEn: "Department 4" },
    { id: 10, fullNameAr: "موظف 10", fullNameEn: "Employee 10", departmentAr: "قسم 5", departmentEn: "Department 5" },
    { id: 11, fullNameAr: "موظف 11", fullNameEn: "Employee 11", departmentAr: "قسم 1", departmentEn: "Department 1" },
    { id: 12, fullNameAr: "موظف 12", fullNameEn: "Employee 12", departmentAr: "قسم 2", departmentEn: "Department 2" },
    { id: 13, fullNameAr: "موظف 13", fullNameEn: "Employee 13", departmentAr: "قسم 3", departmentEn: "Department 3" },
    { id: 14, fullNameAr: "موظف 14", fullNameEn: "Employee 14", departmentAr: "قسم 4", departmentEn: "Department 4" },
    { id: 15, fullNameAr: "موظف 15", fullNameEn: "Employee 15", departmentAr: "قسم 5", departmentEn: "Department 5" },
    { id: 16, fullNameAr: "موظف 16", fullNameEn: "Employee 16", departmentAr: "قسم 1", departmentEn: "Department 1" },
    { id: 17, fullNameAr: "موظف 17", fullNameEn: "Employee 17", departmentAr: "قسم 2", departmentEn: "Department 2" },
    { id: 18, fullNameAr: "موظف 18", fullNameEn: "Employee 18", departmentAr: "قسم 3", departmentEn: "Department 3" },
    { id: 19, fullNameAr: "موظف 19", fullNameEn: "Employee 19", departmentAr: "قسم 4", departmentEn: "Department 4" },
    { id: 20, fullNameAr: "موظف 20", fullNameEn: "Employee 20", departmentAr: "قسم 5", departmentEn: "Department 5" },
    { id: 21, fullNameAr: "موظف 21", fullNameEn: "Employee 21", departmentAr: "قسم 1", departmentEn: "Department 1" },
    { id: 22, fullNameAr: "موظف 22", fullNameEn: "Employee 22", departmentAr: "قسم 2", departmentEn: "Department 2" },
    { id: 23, fullNameAr: "موظف 23", fullNameEn: "Employee 23", departmentAr: "قسم 3", departmentEn: "Department 3" },
    { id: 24, fullNameAr: "موظف 24", fullNameEn: "Employee 24", departmentAr: "قسم 4", departmentEn: "Department 4" },
    { id: 25, fullNameAr: "موظف 25", fullNameEn: "Employee 25", departmentAr: "قسم 5", departmentEn: "Department 5" },
    { id: 26, fullNameAr: "موظف 26", fullNameEn: "Employee 26", departmentAr: "قسم 1", departmentEn: "Department 1" },
    { id: 27, fullNameAr: "موظف 27", fullNameEn: "Employee 27", departmentAr: "قسم 2", departmentEn: "Department 2" },
    { id: 28, fullNameAr: "موظف 28", fullNameEn: "Employee 28", departmentAr: "قسم 3", departmentEn: "Department 3" },
    { id: 29, fullNameAr: "موظف 29", fullNameEn: "Employee 29", departmentAr: "قسم 4", departmentEn: "Department 4" },
    { id: 30, fullNameAr: "موظف 30", fullNameEn: "Employee 30", departmentAr: "قسم 5", departmentEn: "Department 5" },  
    { id: 31, fullNameAr: "موظف 31", fullNameEn: "Employee 31", departmentAr: "قسم 5", departmentEn: "Department 5" },  
  ]
  //#endregion
  constructor(private readonly client:HttpClient) { }

  getData(model:RequestModlel):ResponseModel<Employee>{
    const response:ResponseModel<Employee> = {
      success:true,
      rowCounts:this.dummyData.length,
      data:[]
    }
    if (model.mode === WorkingMode.CLIENT)
    {
      response.data = this.dummyData
      return response
    } else{
      this.applySorting(model)
      let data = this.applyPagination(model)
      response.data = data
      return response
    }
  }
  delete(ids:number[]){
    ids.forEach(id=>{
      const index = this.dummyData.findIndex(el=>el.id ===id)
      this.dummyData.splice(index,1)
    })
  }
  addEdit(employee:Employee){

  }


  private applyPagination(model:RequestModlel){
    const startIndex = (model.pageNumber - 1) * model.pageSize;
    const endIndex = startIndex + model.pageSize;
    const data = this.dummyData.slice(startIndex, endIndex) ?? [];
    return data
  }
  private applySorting(model:RequestModlel) {
    if (!this.dummyData || this.dummyData.length <= 0 || model.sortColumn.length <= 0) return;
  
    this.dummyData.sort((a, b) => {
      let x = a[model.sortColumn];
      let y = b[model.sortColumn];
  
      // string comparison
      if (typeof x === 'string' && typeof y === 'string') {
        x = x.toLowerCase();
        y = y.toLowerCase();
        return x < y ? -1 : x > y ? 1 : 0;
      }
  
      // number comparison
      if (typeof x === 'number' && typeof y === 'number') {
        return x - y;
      }
  
      // date comparison
      if (x instanceof Date && y instanceof Date) {
        return x.getTime() - y.getTime();
      }
  
      // others
      return 0;
    });
  
    // Reverse data if descending order
    if (model.sortDirection === 'desc') {
      this.dummyData.reverse();
    }
  }
}
