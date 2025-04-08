import { IAPIService } from "../_services/iapi.service"

export interface GridConfig<T> {
    columns:GridColumn[],
    actions?:GridAction[],
    apiService:IAPIService<T>
}

export interface GridColumn{
    defination:string,
    header:string,
    arKey:string,
    enKey:string,
    isSortable:boolean

}
export interface GridAction{
    actionName:string,
    isConditional:boolean,
    condition?:Function
}
export interface ActionEvent{
    actionName:string,
    element:any
}