import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AllowNumbersDirective } from '../../_directive/allow-numbers.directive';

@Component({
  selector: 'app-paginator',
  imports: [CommonModule,AllowNumbersDirective,FormsModule,TranslateModule],
  templateUrl: './paginator.component.html',
  standalone:true,
  styleUrl: './paginator.component.css'
})
export class PaginatorComponent {
  @Input() pageNumber:number = 1
  @Input() pageSize:number = 10
  @Input() pageSizeOptions:number[] = [3,5,10,20,50]
  @Input({required:true}) rowCount:number = 0;
  @Output() onPageChange = new EventEmitter<number>()
  @Output() onPageSizeChange = new EventEmitter<number>()
  get totalPages(): number {
    return Math.ceil(this.rowCount / this.pageSize) || 1;
  }

  moveTo(page:number=1){
    this.pageNumber = page>this.totalPages? this.totalPages:page<=0? 1 : page;
    this.onPageChange.emit(this.pageNumber)
  }
  
  checkPageNumber(event: Event) {
    this.checkValueAndEmit(event);
  }
  
  changePageSize(event: Event) {
    this.checkValueAndEmit(event, true);
  }
  
  checkValueAndEmit(event: Event, isPageSize: boolean = false) {
    const element = event.target as HTMLInputElement;
    const value: number = parseInt(element.value, 10);
    if (isNaN(value)) {
      event.preventDefault();
      return;
    }
    if (isPageSize) {
      this.pageSize = value;
      this.onPageSizeChange.emit(this.pageSize);
    } else {
      this.pageNumber = value>this.totalPages? this.totalPages:value<=0? 1 : value;
      element.value = this.pageNumber.toString()
      this.moveTo(this.pageNumber);
    }
  }

  getRangeString():string{
    const start = (this.pageNumber - 1) * this.pageSize + 1; 
    const end = Math.min(this.pageNumber * this.pageSize,this.rowCount)
    return `${start}-${end}`;
  }
}
