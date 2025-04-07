import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { GridComponent } from "./_shared/grid/grid.component";
import { MatIconModule } from '@angular/material/icon';
import { ActionEvent, GridConfig } from './_models/grid-config';
import { CommonModule } from '@angular/common';
import { subscribeOn, Subscription } from 'rxjs';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet,CommonModule, TranslateModule, GridComponent,MatIconModule,MatCheckboxModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit,OnDestroy {
  title = 'alqemam-task-2';
  subs:Subscription = new Subscription()
  userServer:boolean=false
  lang:string = "en"
  pageSize:number = 10
  pageNumber:number = 1
  rowCounts:number = 0;
  sortDirection:string = 'asc'
  sortColumn:string = ''

  data = [
    {name:"Ahmed",age:22,},
    {name:"Aly",age:23,},
    {name:"Mohamed",age:21,},
    {name:"Khalid",age:22,},
  ]
  selection:any[] = []
  config:GridConfig= {
    columns :[
      {defination:"name",header:"name",key:"name",isSortable:true},
      {defination:"age",header:"age",key:"age",isSortable:false},
    ],

    actions:[
      {actionName:"edit",isConditional:false},
      {actionName:"delete",isConditional:true, condition:(element:any)=> element["age"]>21}
    ]
  }
  constructor(private translateService:TranslateService){
    const lang = localStorage.getItem('lang') ?? 'en'
    this.translateService.use(lang)
    this.translateService.onLangChange.subscribe(res=>{
      this.lang = res.lang
    })
  }
  ngOnInit(): void {
    this.rowCounts = this.data.length
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe()
  }

  changeUsedMethod(event:MatCheckboxChange){
    if (event.checked)
      this.userServer = true
    else
    this.userServer = false
  }
  changeLang(langCode:string){
    this.translateService.use(langCode)
  }
  actionHandlers(action:ActionEvent){
    console.log(action);
  }
  updateSelectedElement(event:any[]){
    this.selection = event
    console.log(this.selection);
  }
  handleSorting(def:string){
    console.log(def);
  }
  getItems(pageNo?:number){
    console.log(pageNo);

  }
}
