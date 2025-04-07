export interface GridConfig {
    columns:GridColumn[],
    actions?:GridAction[]
}

export interface GridColumn{
    defination:string,
    header:string,
    key:string,
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