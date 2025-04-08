export interface ResponseModel<T>{
    data?:T[],
    rowCounts:number,
    success:boolean
}

export interface SelectOption{
    label:string,
    id:number,
    value:any
}
