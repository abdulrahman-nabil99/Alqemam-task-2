import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CustomSelectComponent } from "../../../_shared/custom-select/custom-select.component";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmployeeService } from '../../../_services/employee.service';
import { DepartmentService } from '../../../_services/department.service';
import { firstValueFrom, Subscription } from 'rxjs';
import { EmployeeModel, EmployeeView } from '../../../_models/employee';
import { SelectOption } from '../../../_models/shared';
import { Patterns } from '../../../enum/patterns';
import { CustomDirective } from '../../../_directive/custom.directive';
import { CommonModule } from '@angular/common';
import { MaritalStatusService } from '../../../_services/marital.status.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EmployeeValidatorService } from '../../../_services/employee.validator.service';

@Component({
  selector: 'app-add-edit-form',
  standalone:true,
  imports: [TranslateModule, CustomSelectComponent,ReactiveFormsModule,CustomDirective,CommonModule,RouterLink],
  templateUrl: './add-edit-form.component.html',
  styleUrl: './add-edit-form.component.css'
})
export class AddEditFormComponent implements OnInit,OnDestroy {

  form!:FormGroup
  patterns = Patterns
  private subs:Subscription = new Subscription();
  private submitted:boolean = false;
  private model!:EmployeeModel
  id!:number

  maritalStatuses!:SelectOption[]
  departmentDDL!:SelectOption[]
  constructor(
    private employeeService:EmployeeService,
    private departmentService:DepartmentService,
    private maritalStatusService:MaritalStatusService,
    private router:Router,
    private activatedRoute:ActivatedRoute,
    private employeeValidator: EmployeeValidatorService
  ){  }

  async ngOnInit(): Promise<void> {
    this.subs.add(
      this.activatedRoute.queryParams.subscribe(p=>{
        const id = p["id"]
        if (id){
          this.id = id
        }
      })
    )
    await this.initializeComponent()
  }


  private async initializeComponent(): Promise<void> {
    this.initForm();
    if (this.id && this.id > 0) {
      await this.loadEmployee();  
    }
    this.getRequiredDDLs(); 
  }

  invalidField(controlName:string,error?:string):boolean{
    const control = this.form?.get(controlName)
    if (!control)
      return false
    if (control.invalid && (control.touched || this.submitted))
    {
      if (error){
        return control.hasError(error)
      }else{
        return true
      }
    }
    return false;
  }

  getRequiredDDLs(){
    this.getDepartmentsDDL()
    this.getMaritalStatusesDDL()
  }

  private getDepartmentsDDL(){
    this.subs.add(
      this.departmentService.getDepartmentsDDL().subscribe(res=>{
        this.departmentDDL = res.data ?? []
      })
    )
  }

  private getMaritalStatusesDDL(){
    this.subs.add(
      this.maritalStatusService.getMaritalStatusesDDL().subscribe(res=>{
        this.maritalStatuses = res.data ?? []
      })
    )
  }

  private initForm(){
    this.form = new FormGroup({
      fNameAr: new FormControl<string>("",[Validators.required]),
      lNameAr: new FormControl<string>("",[Validators.required]),
      fNameEn: new FormControl<string>("",[Validators.required]),
      lNameEn: new FormControl<string>("",[Validators.required]),
      email: new FormControl<string>("",
        [Validators.required,Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)],
        [this.employeeValidator.emailExists(this.id)]
      ),
      mobile: new FormControl<string>("",
        [Validators.required,Validators.pattern(/^05\d{7,13}$/)],
        [this.employeeValidator.mobileExists(this.id)]
      ),
      address: new FormControl<string>("",[Validators.required]),
      department:new FormControl<number>(undefined!,[Validators.required]),
      maritalStatus:new FormControl<number>(undefined!,[Validators.required]),
      age:new FormControl<number>(undefined!,[Validators.required])
    })
  }

  private async loadEmployee(){
    const res = await firstValueFrom(
      this.employeeService.getById(this.id)
    )
    this.model = res.data ?? undefined!
    this.setFieldValues()
  }

  private setFieldValues(){
    if (!this.model)
      return
    this.form.patchValue({
      fNameAr: this.model.fNameAr ?? "",
      lNameAr: this.model.lNameAr ?? "",
      fNameEn: this.model.fNameEn ?? "",
      lNameEn: this.model.lNameEn ?? "",
      email: this.model.email ?? "",
      mobile: this.model.mobile ?? "",
      address: this.model.address ?? "",
      department: this.model.departmentId ?? undefined,
      maritalStatus: this.model.maritalStatusId ?? undefined,
      age: this.model.age ?? undefined
    });
  }

  onSubmit(){
    this.submitted = true
    if (this.form.invalid)
      return
    const model:EmployeeModel = {
      id: this.model?.id,
      fNameAr: this.formData.fNameAr,
      lNameAr: this.formData.lNameAr,
      fNameEn: this.formData.fNameEn,
      lNameEn: this.formData.lNameEn,
      email: this.formData.email,
      mobile: this.formData.mobile,
      address: this.formData.address,
      departmentId: this.formData.departmentId,
      maritalStatusId: this.formData.maritalStatusId,
      age: this.formData.age
    }
    this.subs.add(
      this.employeeService.addEdit(model).subscribe(res=>{
        if (res.data && res.data>0){
          this.router.navigateByUrl("employees")
        }
      })
    )
  }

  get formData() {
    return {
      fNameAr: this.form.get("fNameAr")?.value,
      lNameAr: this.form.get("lNameAr")?.value,
      fNameEn: this.form.get("fNameEn")?.value,
      lNameEn: this.form.get("lNameEn")?.value,
      email: this.form.get("email")?.value,
      mobile: this.form.get("mobile")?.value,
      address: this.form.get("address")?.value,
      departmentId: this.form.get("department")?.value,
      maritalStatusId: this.form.get("maritalStatus")?.value,
      age: this.form.get("age")?.value
    };
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe()
  }
}
