import { IAPIService } from "../_services/iapi.service"

export interface GridConfig<T> {
    columns:GridColumn[],
    actions?:GridAction[],
    apiService:IAPIService<T>,
    defaultSortingDirection?:string,
    defaultSortingColumn?:string
}

export interface GridColumn{
    defination:string,
    header:string,
    getKey:(lang: string) => string,
    isSortable:boolean
}
export interface GridAction{
    actionName:string,
    isConditional:boolean,
    condition?:(element: any) => boolean
}
export interface ActionEvent{
    actionName:string,
    element:any
}