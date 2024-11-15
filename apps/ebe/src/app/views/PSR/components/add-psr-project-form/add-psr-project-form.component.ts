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
import { ActivatedRoute, Params } from '@angular/router';
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
  formBuilder = inject(FormBuilder);
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
    return this.formBuilder.group({
      program: [null,[Validators.required , this.noSpacesValidator]],
      abbrev: [null, [Validators.required , this.noSpacesValidator]],
      description: [null, [Validators.required , this.noSpacesValidator]]
    });
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
}
