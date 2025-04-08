import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ActionEvent, GridColumn, GridConfig } from '../../_models/grid-config';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {MatCheckboxChange, MatCheckboxModule} from '@angular/material/checkbox';
import {MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import { SelectMode, WorkingMode} from '../../enum/mode';
import { RequestModlel } from '../../_models/employee';
import { Subscription } from 'rxjs';
import { ResponseModel } from '../../_models/shared';


@Component({
  selector: 'app-grid',
  imports: [MatIconModule,CommonModule,TranslateModule,MatCheckboxModule,MatPaginatorModule],
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.css'
})
export class GridComponent<T extends Record<string, any>> implements OnInit, OnChanges {
  @Input() canSelect:boolean = true;
  @Input() gridConfig!:GridConfig<T>
  @Input() selectMode:SelectMode = SelectMode.CURRENT_PAGE
  @Input() workingMode:WorkingMode = WorkingMode.SERVER
  
  selection:any[] = []
  dataSource:any[] = []
  response!:ResponseModel<T>
  pageSize:number =10;
  pageNumber:number =1;
  rowCounts:number =0;
  sortDirection:string = 'asc'
  sortColumn:string = ''
  langCode!:string

  private subs:Subscription= new Subscription()
  deleting:boolean = false

  constructor(
    private translateService:TranslateService,
    private cdr:ChangeDetectorRef
  ){

  }
  ngOnInit(): void {
    this.translateService.onLangChange.subscribe(res=>{
      this.langCode = res.lang
      this.getItems()
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['workingMode']) {
      this.getItems()
    }
    this.cdr.detectChanges()
  }
  handleAction(action:string,element:any){
    if (action ==='edit')
      alert("No Logic for Editing")
    else if (action ==='delete'){
      const res = confirm("Deleting 1 Item")
      if (!res) return;
      this.gridConfig.apiService.delete([element["id"]])
      this.selection = []
      this.pageNumber = 1
      this.getItems()
    }
  }

  boxChange(event:MatCheckboxChange,element:any){
    if (event.checked && !this.selection.includes(element))
      this.selection.push(element)
    else {
      const index = this.selection.indexOf(element)
      this.selection.splice(index,1)
    }
  }

  elementSelected(element:any){
    return this.selection.includes(element)
  }

  masterBoxChange(event:MatCheckboxChange){
    if(event.checked){
      if(this.selectMode == SelectMode.CURRENT_PAGE)
        this.selection = [...this.dataSource]
      else if(this.response.data) 
        this.selection = [...this.response.data]
    }else{
      this.selection = []
    }  
  }

  isAllSelected(){
    if (this.selectMode === SelectMode.ALL_DATA)
      return this.selection.length == this.rowCounts
    for (let i = 0; i <this.dataSource.length;i++){
      if (!this.selection.includes(this.dataSource[i]))
        return false
    }
    return true
  }

  handleSort(col:GridColumn){
    if (!col.isSortable) return
    if (!col.isSortable)
      return
    this.sortDirection = this.sortDirection==='desc'?'asc':'desc'
    this.sortColumn = this.langCode == 'ar'? col.arKey:col.enKey
    if (this.workingMode == WorkingMode.CLIENT){
      this.applySorting()
      this.applyPagination()
    }else {
      this.getItems()
    }
  }

  pageChange(page:PageEvent){
    if (this.selectMode === SelectMode.CURRENT_PAGE){
      this.selection = []
    }
    this.getItems(page.pageIndex+1) // index-zero
  }

  private getItems(pageNo?:number){
    this.pageNumber = pageNo || this.pageNumber
    const model:RequestModlel = {
      mode:this.workingMode,
      pageNumber:this.pageNumber,
      pageSize:this.pageSize,
      sortColumn:this.sortColumn,
      sortDirection:this.sortDirection
    }
    if (this.workingMode == WorkingMode.CLIENT){
      this.response = this.gridConfig.apiService.getData(model) // check if there is already data use it and dod not do another request
      this.applySorting()
      this.applyPagination()
    } else{
      this.response = this.gridConfig.apiService.getData(model)
      this.dataSource = this.response.data ?? []
      this.rowCounts = this.response.rowCounts
    }
  }

  private applyPagination(){
    const startIndex = (this.pageNumber - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.dataSource = this.response.data?.slice(startIndex, endIndex) ?? [];
    this.rowCounts = this.response.rowCounts ?? 0
  }

  private applySorting() {
    if (!this.response.data || this.response.data.length <= 0 || this.sortColumn.length <= 0) return;
  
    this.response.data.sort((a, b) => {
      let x = a[this.sortColumn];
      let y = b[this.sortColumn];

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
    if (this.sortDirection === 'desc') {
      this.response.data.reverse();
    }
  }

  deleteSelected() {
    this.deleting = true;
    try {
      if (this.selection.length <= 0) return;
      const result = confirm(`Deleting ${this.selection.length} Item`);
  
      if (!result) return;
    
      this.gridConfig.apiService.delete(this.selection.map(el => el["id"]));
      this.selection = [];
      this.pageNumber = 1;
      this.getItems();
    } finally {
      this.deleting = false;
    }
  }
  
  ngOnDestroy(): void {
    this.subs.unsubscribe()
  }
}
