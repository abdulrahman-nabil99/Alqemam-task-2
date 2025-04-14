import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ResponseModel, SelectOption } from "../_models/shared";
import { MARITAL_STATUSES_END_POINT } from "../_models/Constants";

@Injectable({
    providedIn: 'root'
})

export class MaritalStatusService{
    constructor(private client:HttpClient){

    }

    getMaritalStatusesDDL(){
        return this.client.get<ResponseModel<SelectOption[]>>(
            MARITAL_STATUSES_END_POINT + "/GetDDL"
        )
    }
}