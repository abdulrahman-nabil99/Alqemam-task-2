import { WorkingMode } from "../enum/mode";

export interface ResponseModel<T>{
    data?:T,
    rowCounts:number,
    success:boolean,
    statusCode:number,
    message:string,
}

export interface RequestModlel{
    mode:WorkingMode,
    pageSize:number,
    pageNumber:number,
    sortColumn:string,
    sortDirection:string,
}

export interface DeleteModel{
    isAllSelected:boolean,
    ids:number[],
    excludedIds?:number[]
}

export interface SelectOption{
    labelAr:string,
    labelEn:string,
    id:number,
    value:any
}
