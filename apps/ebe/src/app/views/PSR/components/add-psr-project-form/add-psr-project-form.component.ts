import {
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule , Location} from '@angular/common';
import { PageHeaderComponent } from '../../../../components/pageHeader/page-header.component';
import { SharedUiModule } from '@stc-apps/shared-ui';
import { ConfirmationService } from 'primeng/api';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { PSRService } from '../../../../services/psr.service';
import { CalendarModule } from 'primeng/calendar';
import { FormInputComponent } from '../form-input/form-input.component';
import { AddProgramModel, AddProjectModel, PSRDataModel, PSRProjectDetailsModel } from '../../../../models/psr.model';
@Component({
  selector: 'stc-apps-add-project-form',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent , SharedUiModule , ReactiveFormsModule , DropdownModule , CalendarModule , FormInputComponent],
  templateUrl: './add-psr-project-form.component.html',
  styleUrl: './add-psr-project-form.component.scss',
  providers : [ConfirmationService]
})
export class AddPsrProjectFormComponent implements OnInit {
  private location = inject(Location);
  activatedRoute = inject(ActivatedRoute);
  private confirmationService = inject(ConfirmationService);
  psrService = inject(PSRService)
  formBuilder = inject(FormBuilder);
  router = inject(Router);
  addProgramForm!: FormGroup;
  isEditMode = false;
  inPSRForm = false;
  sectorName = "";
  programId = 0;
  gdName = "";
  projectId = ""
  ngOnInit(): void {
    if(this.router.url.startsWith("/psr/add-program") || this.router.url.startsWith("/psr/edit-program"))
    {
      this.inPSRForm = true;
    } else {
      this.inPSRForm = false;
    }
    this.addProgramForm = this.formBuilder.group({
      programs: this.formBuilder.array([]),
    });
    // this.sectorName = localStorage.getItem("sector") || "";
    // this.gdName = localStorage.getItem("gd") || "";
    
    const url = this.router.url;
    this.activatedRoute.params.subscribe({
      next: (param: Params) => {
        if(param['sector'] && param['group'])
        {
          this.sectorName = param['sector'];
          this.gdName = param['group'];
        }
        if(!url.startsWith("/psr/add"))
        {
          this.isEditMode = true;
          if(param['id'] && this.inPSRForm)
          {
            this.programId = +param['id'];
            this.getValuesById(+param['id']);
          } else {
            console.log(param);
            if(param['sector'] && param['projId'])
            {
              this.projectId = param['projId']
              this.getProjectValuesById(param['sector'] , +param['projId']);
            }
          }
        } else {
          this.isEditMode = false;
        }
      },
    });
    this.programsList.push(this.createProjectFormGroup());
  }
  noSpacesValidator(control: AbstractControl): ValidationErrors | null {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { noSpaces: true };
  }
  numericValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return null;
      }
      const isNumeric = /^[0-9]*$/.test(value);
      return isNumeric ? null : { numeric: true };
    };
  }
  colors = [
    { name: 'green', code: 'G' },
    { name: 'red', code: 'R' },
    { name: 'yellow', code: 'Y' },
    { name: 'grey', code: 'E' }
  ];
  indicators = [
    { name: 'A', code: 'A' },
    { name: 'G', code: 'G' },
    { name: 'R', code: 'R' }
  ];
  selectedBackground!:{name:string , code:string};
  selectBackground(e:{name:string , code:string}){
    this.selectedBackground = e;
  }
  dateValidator(formGroup: FormGroup): { [key: string]: boolean } | null {
    const startDate = formGroup.get('startDate')?.value;
    const endDate = formGroup.get('endDate')?.value;
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      return { startDateAfterEndDate: true };
    }
    return null;
  }
  createProjectFormGroup(): FormGroup {
    if(this.router.url.startsWith("/psr/add-program") || this.router.url.startsWith("/psr/edit-program"))
    {
      this.inPSRForm = true;
      return this.formBuilder.group({
        "sector": [null,[Validators.required , this.noSpacesValidator]],
        "details": [null, [Validators.required , this.noSpacesValidator]],
      });
    } else {
      this.inPSRForm = false;
      return this.formBuilder.group({
        "project": [null,[Validators.required , this.noSpacesValidator]],
        "owner": [null , [Validators.required , this.noSpacesValidator]],
        "vendor": [null],
        "stage": [null, [Validators.required , this.noSpacesValidator]],
        // "health": [null, [Validators.required , this.noSpacesValidator]],
        "indicator": [null, [Validators.required]],
        "background": [null, [Validators.required]],
        "domain": [null, [Validators.required , this.noSpacesValidator]],
        "startDate": [null, [Validators.required]],
        "endDate": [null, [Validators.required]],
        "POAmount": [null, [Validators.required]],
        "actualSpending": [null, [Validators.required]],
        // "plannedPercentage": [null, [Validators.max(100)]],
        // "actualPercentage": [null, [Validators.max(100)]],
      } , { validators: [this.dateValidator] });
    }
  }
  private getProjectValuesById(gd:string , id:number)
  {
    this.psrService.getProjectById(gd , id).subscribe({
      next : (res:PSRProjectDetailsModel) => {
        console.log(res);
        console.log(res.backgroundColor);
        let selectedBackgroundColor = this.colors.filter(c => c.code === res.backgroundColor);
        if(selectedBackgroundColor.length === 0)
        {
          selectedBackgroundColor = [{ name: 'grey', code: 'E' }]
        }
        this.programsList.controls[0].get("project")?.setValue(res.projectName);
        this.programsList.controls[0].get("owner")?.setValue(res.projectOwner);
        this.programsList.controls[0].get("vendor")?.setValue(res.vendor);
        this.programsList.controls[0].get("stage")?.setValue(res.projectStage);
        // this.programsList.controls[0].get("health")?.setValue(res.domain);
        this.programsList.controls[0].get("indicator")?.setValue(res.indicator);
        this.programsList.controls[0].get("background")?.setValue(selectedBackgroundColor[0]);
        this.programsList.controls[0].get("domain")?.setValue(res.domain);
        this.programsList.controls[0].get("startDate")?.setValue(new Date(res.startDate));
        this.programsList.controls[0].get("endDate")?.setValue(new Date(res.endDate));
        this.programsList.controls[0].get("POAmount")?.setValue(res.poAmount);
        this.programsList.controls[0].get("actualSpending")?.setValue(res.actualSpending);
        // this.programsList.controls[0].get("details")?.setValue(res.details);
      }
    })
  }
  getErrorMessage(program:AbstractControl , controlName: string): string {
    const control = program.get(controlName);
    let errorMag = ''
    if (control?.touched && (control?.hasError('required') || control?.hasError('noSpaces'))) {
      errorMag = 'This field is required.';
    }
    else if (control?.hasError('max'))
    {
      errorMag = `This field has max value ${control.errors ? control.errors['max'].max : 100}`;
    }
    return errorMag;
  }
  changeStartDate(program:AbstractControl , startDate:Date)
  {
    // console.log(startDate);
    // program.get('startDate')?.value;
    // console.log(program.get('startDate'));
    if(startDate)
    {
      this.messageHint = "";
    }
  }
  messageHint = "";
  currentFormIndex = 0;
  changeEndDate(endDate:Date , index:number)
  {
    this.currentFormIndex = index;
    console.log(this.programsList.controls[index]);
    if(this.programsList.controls[index].get("startDate")?.hasError("required"))
    {
      this.messageHint = "Please select the Start Date First"
    } else {
      this.messageHint = "";
    }
  }
  preventInvalidInput(event: KeyboardEvent): void {
    const invalidKeys = ['e', 'E', '+', '-'];
    if (invalidKeys.includes(event.key)) {
      event.preventDefault();
    }
  }
  get programsList(): FormArray {
    return this.addProgramForm.get('programs') as FormArray;
  }
  goBack()
  {
    this.location.back();
  }
  deleteProgram(index:number){
    this.programsList.removeAt(index);
  }
  addNewProgramForm()
  {
    this.programsList.push(this.createProjectFormGroup());
  }
  formatDate(date:Date):string
  {
    const startDate = new Date(date);
    const startMonth = startDate.getMonth() + 1;
    const startDay = startDate.getDate();
    const startYear = startDate.getFullYear();
    return `${startYear}-${startMonth < 10 ? '0' + startMonth : startMonth}-${startDay < 10 ? '0' + startDay : startDay}`;
  }
  save()
  {
    const addedProjects:AddProjectModel[] = [];
    if(this.programsList.valid)
    {
      if(this.isEditMode)
      {
        this.confirmationService.confirm({
          key: 'edit-program'
        });
      } else {
        // call add api here
        if(!this.inPSRForm)
        {
          this.programsList.value.forEach((data:any) => {
            const formattedStartDate = this.formatDate(data.startDate);
            const formattedEndDate = this.formatDate(data.endDate);
            addedProjects.push({
              sector : this.sectorName,
              gd : this.gdName,
              projectName : data.project,
              projectOwner : data.owner,
              vendor : data.vendor,
              projectStage : data.stage,
              indicator : data.indicator.value,
              backgroundColor : data.background.code,
              domain : data.domain,
              startDate : formattedStartDate,
              endDate : formattedEndDate,
              poAmount : data.POAmount,
              actualSpending : data.actualSpending
            })
          })
          // console.log("addedProjects => " , addedProjects);
          this.psrService.addNewProject(addedProjects).subscribe({
            next : () => {
              this.confirmationService.confirm({
                key: 'added-sector-success'
              });
            }
          })  
        } else {
          // console.log(this.programsList.value);
          this.psrService.addNewProgram(this.programsList.value).subscribe({
            next : () => {
              this.confirmationService.confirm({
                key: 'added-sector-success'
              });
            }
          })   
        }
      }
    }
  }
  private getValuesById(id:number)
  {
    this.psrService.getProgramById(id).subscribe({
      next : (res:PSRDataModel) => {
        this.programsList.controls[0].get("sector")?.setValue(res.sector);
        this.programsList.controls[0].get("details")?.setValue(res.details);
      }
    })
  }
  private editProgramData(data:AddProgramModel)
  {
    this.psrService.editProgram(data , this.programId).subscribe({
      next:() => {
        this.confirmationService.confirm({
          key: 'added-sector-success'
        });
      }
    })
  }
  editProgram()
  {
    // call edit api here
    if(this.inPSRForm)
    {
      this.editProgramData(this.programsList.value[0]);
    } else {
      const updatedObj = this.programsList.value[0];
      const formattedStartDate = this.formatDate(updatedObj.startDate);
      const formattedEndDate = this.formatDate(updatedObj.endDate);
      const addedProjects:AddProjectModel = {
        sector : this.sectorName,
        gd : this.gdName,
        projectName : updatedObj.project,
        projectOwner : updatedObj.owner,
        vendor : updatedObj.vendor,
        projectStage : updatedObj.stage,
        indicator : updatedObj.indicator,
        backgroundColor : updatedObj.background.code,
        domain : updatedObj.domain,
        startDate : formattedStartDate,
        endDate : formattedEndDate,
        poAmount : updatedObj.POAmount,
        actualSpending : updatedObj.actualSpending
      };
      this.psrService.updateProject(+this.projectId , addedProjects).subscribe({
        next:() => {
          this.confirmationService.confirm({
            key: 'added-sector-success'
          });
        }
      })
    }
    this.close();
  }
  close()
  {
    this.confirmationService.close()
  }
  formControlLabel()
  {
    return Object.keys(this.createProjectFormGroup().controls)
  }
}
