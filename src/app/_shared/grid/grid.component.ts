import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActionEvent, GridColumn, GridConfig } from '../../_models/grid-config';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import {MatCheckboxChange, MatCheckboxModule} from '@angular/material/checkbox';
import {MatPaginatorModule, PageEvent} from '@angular/material/paginator';


@Component({
  selector: 'app-grid',
  imports: [MatIconModule,CommonModule,TranslateModule,MatCheckboxModule,MatPaginatorModule],
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.css'
})
export class GridComponent {
  @Input() canSelect:boolean = true;
  @Input() gridConfig!:GridConfig
  @Input() dataSource!:any[]
  @Input() pageSize:number =10;
  @Input() pageNumber:number =1;
  @Input() rowCounts:number =50;
  @Output() actionHandler = new EventEmitter<ActionEvent>()
  @Output() selectionChange = new EventEmitter<any[]>()
  @Output() sortHandler = new EventEmitter<string>()
  @Output() pageChangeHandler = new EventEmitter<number>()


  selection:any[] = []


  constructor(){

  }
  handleAction(action:string,element:any){
    this.actionHandler.emit({actionName:action,element})
  }
  boxChange(event:MatCheckboxChange,element:any){
    if (event.checked && !this.selection.includes(element))
      this.selection.push(element)
    else {
      const index = this.selection.indexOf(element)
      this.selection.splice(index,1)
    }
    this.selectionChange.emit(this.selection)
  }
  elementSelected(element:any){
    return this.selection.includes(element)
  }
  masterBoxChange(event:MatCheckboxChange){
    if (event.checked)
      // Two mods
    this.selection = [...this.dataSource]
    else
    this.selection = []
    this.selectionChange.emit(this.selection)

  }
  isAllSelected(){
    return this.dataSource.length == this.selection.length
  }
  handleSort(col:GridColumn){
    if (col.isSortable)
      this.sortHandler.emit(col.defination)
  }
  pageChange(page:PageEvent){
    this.pageChangeHandler.emit(page.pageIndex+1) // index-zero
  }
}
