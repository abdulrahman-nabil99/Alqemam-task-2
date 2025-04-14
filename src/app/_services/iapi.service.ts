import { Observable } from "rxjs";
import { DeleteModel, RequestModlel, ResponseModel } from "../_models/shared";

export interface IAPIService<T>{
    getData(model:RequestModlel):Observable<ResponseModel<T[]>>;
    delete(model:DeleteModel):Observable<ResponseModel<number>>;
}