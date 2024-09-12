import { Component, EventEmitter, inject, input, InputSignal, OnChanges, OnInit, Output } from '@angular/core';
import { CommonModule , Location } from '@angular/common';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { PageHeaderComponent } from '../../../../components/pageHeader/page-header.component';
import { Router } from '@angular/router';
@Component({
  selector: 'stc-apps-add-project-form',
  standalone: true,
  imports: [CommonModule , ReactiveFormsModule , PageHeaderComponent],
  templateUrl: './add-project-form.component.html',
  styleUrl: './add-project-form.component.scss',
})
export class AddProjectFormComponent implements OnInit , OnChanges{
  formBuilder = inject(FormBuilder);
  addProjectForm!:FormGroup;
  textLength = 0;
  private router = inject(Router);
  private location = inject(Location);
  modalVisible:InputSignal<boolean> = input.required<boolean>()
  @Output() closeModal:EventEmitter<boolean> = new EventEmitter<boolean>()
  ngOnInit(): void {
    this.addProjectForm = this.formBuilder.group({
      projects : this.formBuilder.array([])
    })
    
    this.projectsList.push(this.createProjectFormGroup());
  }
  createProjectFormGroup(): FormGroup {
    return this.formBuilder.group({
      projectName : [null , [Validators.required , this.noSpacesValidator , Validators.maxLength(50)]],
      actualValue : [null , [Validators.required , this.noSpacesValidator , this.rangeValidator]],
      plannedValue : [null , [Validators.required , this.noSpacesValidator , this.rangeValidator]],
    });
  }
  get projectsList():FormArray
  {
    return this.addProjectForm.get("projects") as FormArray;
  }
  hasErrors(): boolean {
    return this.projectsList.controls.some(control => control.invalid);
  }
  ngOnChanges(): void {
    if(!this.modalVisible())
    {
      this.addProjectForm.reset();
      // this.progectNameValue?.reset()
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
      const projectArr = this.addProjectForm.value.projects;
      console.log(projectArr);
    }
  }
  getValue(e:string)
  {
    if(e)
    {
      this.textLength = e.length;
    }
  }
  closeForm()
  {
    this.router.navigateByUrl("/strategy-program")
  }
  addNewProjectForm()
  {
    this.projectsList.push(this.createProjectFormGroup());
  }
  deleteForm(index:number)
  {
    this.projectsList.removeAt(index);
  }
  goback()
  {
    this.location.back();
  }
}
