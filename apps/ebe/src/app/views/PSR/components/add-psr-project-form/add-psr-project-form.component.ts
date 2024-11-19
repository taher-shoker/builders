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
  ngOnInit(): void {
    this.addProgramForm = this.formBuilder.group({
      programs: this.formBuilder.array([]),
    });
    this.sectorName = localStorage.getItem("sector") || "";
    this.activatedRoute.params.subscribe({
      next: (param: Params) => {
        if(Object.keys(param).length !== 0)
        {
          this.isEditMode = true;
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
        // "abbrev": [null, [Validators.required , this.noSpacesValidator]],
        "details": [null, [Validators.required , this.noSpacesValidator]],
      });
    } else {
      this.inPSRForm = false;
      return this.formBuilder.group({
        "project": [null,[Validators.required , this.noSpacesValidator]],
        "owner": [null, [this.noSpacesValidator]],
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
  changeStartDate(startDate:Date)
  {
    console.log(startDate);
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
    // if(program.get("startDate")?.hasError("required"))
    // {

    // }
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
  save()
  {
    if(this.programsList.valid)
    {
      console.log(this.programsList.value);
      console.log(this.sectorName);
      // console.log(this.programsList.value[0].startDate);
      // const date = new Date(this.programsList.value[0].startDate);
      // const month = date.getMonth() + 1; // Months are zero-indexed
      // const day = date.getDate();
      // const year = date.getFullYear();
      // const formattedDate = `${day}/${month}/${year}`;
      // console.log(formattedDate);
      if(this.isEditMode)
      {
        this.confirmationService.confirm({
          key: 'edit-program'
        });
      } else {
        // call add api here
      }
    }
  }
  editProgram()
  {
    // call edit api here
    console.log(this.programsList.value);
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
