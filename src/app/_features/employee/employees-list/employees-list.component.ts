import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CustomSelectComponent } from '../../../_shared/custom-select/custom-select.component';
import { GridComponent } from '../../../_shared/grid/grid.component';
import { Subscription } from 'rxjs';
import { EmployeeView } from '../../../_models/employee';
import { GridConfig, ActionEvent } from '../../../_models/grid-config';
import { SelectOption } from '../../../_models/shared';
import { EmployeeService } from '../../../_services/employee.service';
import { WorkingMode, SelectMode } from '../../../enum/mode';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-employees-list',
  imports: [CommonModule, FormsModule, TranslateModule, GridComponent, CustomSelectComponent,RouterLink],
  standalone:true,
  templateUrl: './employees-list.component.html',
  styleUrl: './employees-list.component.css'
})
export class EmployeesListComponent implements OnInit,OnDestroy{
  subs:Subscription = new Subscription()
  selectedMode:WorkingMode = WorkingMode.CLIENT
  workingMods!:SelectOption[] 

  selectMode :SelectMode = SelectMode.ALL_DATA;
  selectModes:SelectOption[] = []

  selectedId!:number

  config:GridConfig<EmployeeView>= {
    apiService:inject(EmployeeService),
    uniqueKey:"id",
    columns :[
      {
        defination:"name",
        header:"employee.name",
        getKey:(lang:string)=> lang==="ar"?"fullNameAr":"fullNameEn",
        isSortable:true
      },
      {
        defination:"email",
        header:"employee.email",
        getKey:(lang:string)=> "email",
        isSortable:true
      },
      {
        defination:"age",
        header:"employee.age",
        getKey:(lang:string)=> "age",
        isSortable:true
      },
      {
        defination:"department",
        header:"employee.department",
        getKey:(lang:string)=> lang==="ar"?"departmentAr":"departmentEn",
        isSortable:true
      },
      // {
      //   defination:"mobile",
      //   header:"employee.mobile",
      //   getKey:(lang:string)=> "mobile",
      //   isSortable:true
      // },
      {
        defination:"maritalStatus",
        header:"employee.maritalStatus",
        getKey:(lang:string)=> lang==="ar"?"maritalStatusAr":"maritalStatusEn",
        isSortable:true
      },
      // {
      //   defination:"address",
      //   header:"employee.address",
      //   getKey:(lang:string)=> "address",
      //   isSortable:true
      // },
    ],
    actions:[
      {
        actionName:"edit",
        isConditional:false
      },
      {
        actionName:"delete",
        isConditional:false,
        // condition:(element:any)=> element["id"]>3 && element["id"]<15
      }
    ],
    defaultSortingColumn : "",
    defaultSortingDirection: "asc"
  }

  constructor(
    private employeeService:EmployeeService,
    private router:Router
  ){
  }

  ngOnInit(): void {
    this.workingMods=[
      { id:1, labelEn: 'Server',labelAr: 'سيرفر', value: WorkingMode.SERVER },
      { id:2, labelEn: 'Client',labelAr: 'كلاينت', value: WorkingMode.CLIENT },
    ]
    this.selectModes=[
      { id:1, labelEn: 'Current Page',labelAr: 'الصفحة الحالية', value: SelectMode.CURRENT_PAGE },
      { id:2, labelEn: 'All Data',labelAr: 'جميع البيانات', value: SelectMode.ALL_DATA },
    ]
  }

  actionHandler(action:ActionEvent){
    if (action.actionName ==='edit'){
      const id = action.element["id"]
      if(id && id>0)
        this.router.navigateByUrl(`/employees/edit?id=${id}`)
    }
    else if (action.actionName ==='delete'){
      const res = confirm("Deleting 1 Item")
      if (!res) return;
      this.subs.add(
        this.employeeService.delete({isAllSelected:false,ids:[action.element["id"]]}).subscribe({
          next: res=>{
          },
          error: err=>{
          }
        })
      )
    }
  }

  reload(){
    this.selectedId = undefined!
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe()
  }

}
