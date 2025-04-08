import { WorkingMode } from "../enum/mode";

export interface Employee{
    id:number,
    fullNameAr:string,
    fullNameEn:string,
    departmentAr:string,
    departmentEn:string,
    [key: string]: any
}

export interface RequestModlel{
    mode:WorkingMode,
    pageSize:number,
    pageNumber:number,
    sortColumn:string,
    sortDirection:string,
}