export interface EmployeeView{
    id:number,
    age:number,
    fullNameAr:string,
    fullNameEn:string,
    departmentAr:string,
    departmentEn:string,
    email:string,
    mobile:string,
    maritalStatus:string,
    address:string
    [key: string]: any
}

export interface EmployeeModel{
    id:number
    fNameAr:string
    lNameAr:string
    fNameEn:string
    lNameEn:string
    email:string
    mobile:string
    address:string
    age:number
    maritalStatusId:number
    departmentId:number
}