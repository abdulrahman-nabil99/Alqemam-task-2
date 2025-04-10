import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { GridColumn, GridConfig } from '../../_models/grid-config';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {MatCheckboxChange, MatCheckboxModule} from '@angular/material/checkbox';
import {MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import { SelectMode, WorkingMode} from '../../enum/mode';
import { Subscription } from 'rxjs';
import { DeleteModel, RequestModlel, ResponseModel } from '../../_models/shared';


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
  @Input() pageSize:number =10;
  
  selection:T[] = []
  dataSource:T[] = []
  response!:ResponseModel<T>
  pageNumber:number =1;
  rowCounts:number =0;
  sortDirection:string = 'asc'
  sortColumn:string = ''
  langCode!:string
  isAllSelectedChecked:boolean = false
  excludedRows:T[] = []

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
      if (changes['workingMode'].previousValue && 
          changes['workingMode'].previousValue !== changes['workingMode'].currentValue)
        this.getItems()
      this.resetSelections()
    }
    if (changes['selectMode']) {
      this.resetSelections()
    }
    this.cdr.detectChanges()
  }

  private resetSelections(){
    this.selection = []
    this.excludedRows = []
    this.isAllSelectedChecked = false
  }

  handleAction(action:string,element:any){
    if (action ==='edit')
      alert("No Logic for Editing")
    else if (action ==='delete'){
      const res = confirm("Deleting 1 Item")
      if (!res) return;
      this.subs.add(
        this.gridConfig.apiService.delete({isAllSelected:false,ids:[element["id"]]}).subscribe({
          next: res=>{
            this.resetSelections()
            this.pageNumber = 1
            this.getItems()
          },
          error: err=>{

          }
        })
      )

    }
  }

  boxChange(event:MatCheckboxChange,element:any){
    if (event.checked && !this.selection.includes(element))
    {
      if(this.selectMode === SelectMode.ALL_DATA){
        const exIndex = this.excludedRows.findIndex(row=>row===element)
        this.excludedRows.splice(exIndex,1)
      }
      this.selection.push(element)
    }
    else {
      if(this.selectMode === SelectMode.ALL_DATA){
        this.excludedRows.push(element)
        if (this.excludedRows.length === this.rowCounts){
          this.resetSelections()
        }
      }
      const index = this.selection.indexOf(element)
      this.selection.splice(index,1)
    }
  }

  elementSelected(element:any){
    if(this.workingMode === WorkingMode.SERVER && this.selectMode === SelectMode.ALL_DATA)
      return(this.isAllSelectedChecked && !this.excludedRows.some(el=>el["id"]===element["id"]))
    return this.selection.some(el=>el["id"]===element["id"])
  }

  masterBoxChange(event:MatCheckboxChange){
    if(event.checked){
      if(this.selectMode == SelectMode.CURRENT_PAGE)
        this.selection = [...this.dataSource]
      else if(this.response.data) {
        this.isAllSelectedChecked = true
        this.excludedRows = []
        this.selection = [...this.response.data]
      }
    }else{
      this.isAllSelectedChecked = false
      this.excludedRows = []
      this.selection = []
    }  
  }

  isAllSelected(){
    if (this.selectMode === SelectMode.ALL_DATA && this.workingMode === WorkingMode.CLIENT)
      return this.selection.length == this.rowCounts
    else if (this.selectMode === SelectMode.ALL_DATA && this.workingMode === WorkingMode.SERVER)
      return this.isAllSelectedChecked && this.excludedRows.length <=0

    // if (!this.selection.every(el=>this.dataSource.includes(el)))
    //   return false
    for (let i = 0; i <this.dataSource.length;i++){
      if (!this.selection.includes(this.dataSource[i]))
        return false
    }
    return true
  }

  handleSort(col:GridColumn){
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
    if (this.workingMode === WorkingMode.CLIENT){
      this.pageNumber = page.pageIndex+1 || this.pageNumber
      this.applyPagination()
    }
    else
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
      this.subs.add(
        this.gridConfig.apiService.getData(model).subscribe({
          next: res=> {
            this.response = res;
            this.applySorting()
            this.applyPagination()
          }
        })
      )
    } else{
      this.subs.add(
        this.gridConfig.apiService.getData(model).subscribe({
          next:res=>{
            this.response = res;
            this.dataSource = this.response.data ?? []
            this.rowCounts = this.response.rowCounts ?? 0
          },
          error:err=>{

          }
        })
      )
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
      if (this.selection.length <= 0 && !this.isAllSelectedChecked) return;
      const result = 
      confirm(`Deleting ${this.selectMode === SelectMode.ALL_DATA && this.workingMode === WorkingMode.SERVER? this.rowCounts - this.excludedRows.length :this.selection.length} Item`);
  
      if (!result) return;
      const deleteModel:DeleteModel = {
        isAllSelected: this.isAllSelectedChecked,
        ids: this.selection.map(el => el["id"]),
        excludedIds: this.excludedRows.map(el=>el["id"])
      }
      this.subs.add(
        this.gridConfig.apiService.delete(deleteModel).subscribe({
          next:res=>{
            this.resetSelections()
            this.pageNumber = 1;
            this.getItems();
          },
          error:err=>{
            
          }
        })
      )

    } finally {
      this.deleting = false;
    }
  }

  getSortIcon(col:GridColumn):string{
    if (this.sortColumn=== col.arKey || this.sortColumn === col.enKey)
      return this.sortDirection ==="desc"? "arrow_downward":"arrow_upward"
    return "swap_vert"
  }
  
  ngOnDestroy(): void {
    this.subs.unsubscribe()
  }
}
