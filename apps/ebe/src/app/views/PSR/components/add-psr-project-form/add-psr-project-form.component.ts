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
import { AddProgramModel, AddProjectModel, PSRDataModel } from '../../../../models/psr.model';
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
    this.sectorName = localStorage.getItem("sector") || "";
    this.gdName = localStorage.getItem("gd") || "";
    this.activatedRoute.params.subscribe({
      next: (param: Params) => {
        if(Object.keys(param).length !== 0)
        {
          this.isEditMode = true;
          if(this.inPSRForm)
          {
            if(param['id'])
            {
              this.programId = +param['id'];

              this.getValuesById(+param['id']);
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
    { name: 'Green', code: 'green' },
    { name: 'Red', code: 'red' },
    { name: 'Yellow', code: 'yellow' },
    { name: 'Grey', code: 'grey' }
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
        "owner": [null],
        "vendor": [null, [Validators.required , this.noSpacesValidator]],
        "stage": [null, [Validators.required , this.noSpacesValidator]],
        "health": [null, [Validators.required , this.noSpacesValidator]],
        "indicator": [null, [Validators.required]],
        "background": [null, [Validators.required]],
        "domain": [null, [Validators.required , this.noSpacesValidator]],
        "startDate": [null, [Validators.required]],
        "endDate": [null, [Validators.required]],
        "POAmount": [null, [Validators.required]],
        "actualSpending": [null, [Validators.required]],
        "plannedPercentage": [null, [Validators.max(100)]],
        "actualPercentage": [null, [Validators.max(100)]],
      } , { validators: [this.dateValidator] });
    }
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
        this.programsList.value.forEach((data:any) => {
          if(!this.inPSRForm)
          {
            const formattedStartDate = this.formatDate(data.startDate);
            const formattedEndDate = this.formatDate(data.endDate);
            addedProjects.push({
              sector : this.sectorName,
              gd : this.gdName,
              projectName : data.project,
              projectOwner : data.owner,
              vendor : data.vendor,
              projectStage : data.stage,
              indicator : data.indicator.value.name,
              backgroundColor : data.background.name,
              domain : data.domain,
              startDate : formattedStartDate,
              endDate : formattedEndDate,
              poAmount : data.POAmount,
              actualSpending : data.actualSpending
            })
            console.log("addedProjects => " , addedProjects);
          } else {
            console.log(this.programsList.value);
            this.psrService.addNewProject(this.programsList.value).subscribe({
              next : () => {
                this.confirmationService.confirm({
                  key: 'added-sector-success'
                });
              }
            })
          }
        })
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
