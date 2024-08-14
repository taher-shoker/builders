import { Component, EventEmitter, inject, input, InputSignal, OnChanges, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
@Component({
  selector: 'stc-apps-add-project-form',
  standalone: true,
  imports: [CommonModule , ReactiveFormsModule],
  templateUrl: './add-project-form.component.html',
  styleUrl: './add-project-form.component.scss',
})
export class AddProjectFormComponent implements OnInit , OnChanges {
  formBuilder = inject(FormBuilder);
  addProjectForm!:FormGroup;
  textLength = 0;
  modalVisible:InputSignal<boolean> = input.required<boolean>()
  @Output() closeModal:EventEmitter<boolean> = new EventEmitter<boolean>()
  ngOnInit(): void {
    this.addProjectForm = this.formBuilder.group({
      projectName : [null , [Validators.required , this.noSpacesValidator , Validators.maxLength(50)]],
      actualValue : [null , [Validators.required , this.noSpacesValidator , this.rangeValidator]],
      plannedValue : [null , [Validators.required , this.noSpacesValidator , this.rangeValidator]],
      // totalInvestment : [null , [Validators.required , this.rangeValidator]],
      // description : [null , Validators.maxLength(200)]
    })
  }
  ngOnChanges(): void {
    if(!this.modalVisible())
    {
      this.addProjectForm.reset();
      this.progectNameValue?.reset()
      this.textLength = 0;
    }
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
  noSpacesValidator(control: AbstractControl): ValidationErrors | null {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { noSpaces: true };
  }
  closeModalFun()
  {
    this.closeModal.emit(true);
  }
  save()
  {
    if(this.addProjectForm.valid)
    {
      const data = {
        progectName : this.addProjectForm.value.projectName.trim(),
        actualValue : +this.addProjectForm.value.actualValue,
        plannedValue : +this.addProjectForm.value.plannedValue
      }
      console.log(data);
    }
  }
  getValue(e:string)
  {
    if(e)
    {
      this.textLength = e.length;
    }
  }
  get progectNameValue()
  {
    return this.addProjectForm.get("projectName")
  }
  get actualValue()
  {
    return this.addProjectForm.get("actualValue")
  }
  get plannedValue()
  {
    return this.addProjectForm.get("plannedValue")
  }
}
