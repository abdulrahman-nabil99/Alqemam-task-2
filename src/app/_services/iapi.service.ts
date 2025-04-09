import { RequestModlel } from "../_models/employee";
import { ResponseModel } from "../_models/shared";

export interface IAPIService<T>{
    getData(model:RequestModlel):ResponseModel<T>;
    delete(isAllSelected:boolean,ids:number[],excludedId?:number[]):void
}