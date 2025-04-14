import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ResponseModel, SelectOption } from "../_models/shared";
import { DEPARTMENTS_END_POINT } from "../_models/Constants";

@Injectable({
    providedIn: 'root'
})

export class DepartmentService{
    constructor(private client:HttpClient){

    }

    getDepartmentsDDL(){
        return this.client.get<ResponseModel<SelectOption[]>>(
            DEPARTMENTS_END_POINT + "/GetDDL"
        )
    }
}