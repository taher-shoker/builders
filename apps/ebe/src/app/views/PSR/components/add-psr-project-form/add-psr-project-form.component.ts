import {
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { CommonModule , Location} from '@angular/common';
import { PageHeaderComponent } from '../../../../components/pageHeader/page-header.component';
import { SharedUiModule } from '@stc-apps/shared-ui';
import { ConfirmationService } from 'primeng/api';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { PSRService } from '../../../../services/psr.service';
@Component({
  selector: 'stc-apps-add-project-form',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent , SharedUiModule , ReactiveFormsModule],
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
  ngOnInit(): void {
    this.addProgramForm = this.formBuilder.group({
      programs: this.formBuilder.array([]),
    });
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
  createProjectFormGroup(): FormGroup {
    if(this.router.url.startsWith("/psr/edit-project"))
    {
      return this.formBuilder.group({
        "program name": [null,[Validators.required , this.noSpacesValidator]],
        "prgram abbreviation": [null, [Validators.required , this.noSpacesValidator]],
        "description": [null, [Validators.required , this.noSpacesValidator]],
      });
    } else {
      return this.formBuilder.group({
        "program name": [null,[Validators.required , this.noSpacesValidator]],
        "prgram owner": [null, [this.noSpacesValidator]],
        "vendor": [null, [Validators.required , this.noSpacesValidator]],
        "project stage": [null, [Validators.required , this.noSpacesValidator]],
        "indicator": [null, [Validators.required , this.noSpacesValidator]],
        "background color": [null, [Validators.required , this.noSpacesValidator]],
        "domain": [null, [Validators.required , this.noSpacesValidator]],
        "start date": [null, [Validators.required , this.noSpacesValidator]],
        "end date": [null, [Validators.required , this.noSpacesValidator]],
        "PO amount": [null, [Validators.required , this.noSpacesValidator]],
        "actual spending": [null, [Validators.required , this.noSpacesValidator]],
        "planned percentage": [null, [Validators.required , this.noSpacesValidator , Validators.max(100)]],
        "actual percentage": [null, [this.noSpacesValidator , Validators.max(100)]],
      });
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
    console.log(this.programsList);
    if(this.programsList.valid)
    {
      console.log(this.programsList.value);
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
