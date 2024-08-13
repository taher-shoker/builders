import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';

@Component({
  selector: 'stc-apps-add-project-form',
  standalone: true,
  imports: [CommonModule , ReactiveFormsModule],
  templateUrl: './add-project-form.component.html',
  styleUrl: './add-project-form.component.scss',
})
export class AddProjectFormComponent implements OnInit {
  formBuilder = inject(FormBuilder);
  addProjectForm!:FormGroup;
  textLength = 0;
  ngOnInit(): void {
    this.addProjectForm = this.formBuilder.group({
      programName : [null , [Validators.required , Validators.maxLength(50)]],
      progress : [null , [Validators.required , this.rangeValidator]],
      totalWeight : [null , [Validators.required , this.rangeValidator]],
      totalInvestment : [null , [Validators.required , this.rangeValidator]],
      description : [null , Validators.maxLength(200)]
    })
  }
  rangeValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if(isNaN(value))
    {
      return { isNumber : true };
    }
    if (value !== null && (isNaN(value) || value < 0 || value > 100)) {
      return { rangeError : true };
    }
    return null;
  }
  save()
  {
    console.log(this.addProjectForm);
  }
  getValue(e:string)
  {
    this.textLength = e.length;
  }
  get programNameValue()
  {
    return this.addProjectForm.get("programName")
  }
}
