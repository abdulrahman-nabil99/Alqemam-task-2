import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { GridComponent } from "./_shared/grid/grid.component";
import { ActionEvent, GridConfig } from './_models/grid-config';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { SelectOption } from './_models/shared';
import { Employee} from './_models/employee';
import { EmployeeService } from './_services/employee.service';
import { CustomSelectComponent } from './_shared/custom-select/custom-select.component';
import { SelectMode, WorkingMode } from './enum/mode';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule, TranslateModule, GridComponent, CustomSelectComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit,OnDestroy {
  title = 'alqemam-task-2';
  subs:Subscription = new Subscription()
  selectedMode:WorkingMode = WorkingMode.CLIENT
  workingMods!:SelectOption[] 

  selectMode :SelectMode = SelectMode.ALL_DATA;
  selectModes:SelectOption[] = []
  lang:string = "en"

  config:GridConfig<Employee>= {
    apiService:inject(EmployeeService),
    columns :[
      {
        defination:"name",
        header:"employee.name",
        getKey:(lang:string)=> lang==="ar"?"fullNameAr":"fullNameEn",
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
    ],
    actions:[
      {
        actionName:"edit",
        isConditional:false
      },
      {
        actionName:"delete",
        isConditional:true,
        condition:(element:any)=> element["id"]>3 && element["id"]<15
      }
    ],
    defaultSortingColumn : "",
    defaultSortingDirection: "asc"
  }

  constructor(
    private translateService:TranslateService,
    private employeeService:EmployeeService
  ){
    const lang = localStorage.getItem('lang') ?? 'en'
    this.translateService.use(lang)
    this.translateService.onLangChange.subscribe(res=>{
      this.lang = res.lang
    })
  }

  ngOnInit(): void {
    this.workingMods=[
      { id:1, label: 'Server', value: WorkingMode.SERVER },
      { id:2, label: 'Client', value: WorkingMode.CLIENT },
    ]
    this.selectModes=[
      { id:1, label: 'Current Page', value: SelectMode.CURRENT_PAGE },
      { id:2, label: 'All Data', value: SelectMode.ALL_DATA },
    ]
  }

  changeLang(langCode:string){
    this.translateService.use(langCode)
    localStorage.setItem('lang',langCode)
  }

  actionHandler(action:ActionEvent){
    if (action.actionName ==='edit')
      alert("No Logic for Editing")
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

  ngOnDestroy(): void {
    this.subs.unsubscribe()
  }

}