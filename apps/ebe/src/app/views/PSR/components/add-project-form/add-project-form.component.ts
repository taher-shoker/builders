import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { AddProjectForm } from '../../../../models/psr.model';
import { CalendarModule } from 'primeng/calendar';

@Component({
  selector: 'stc-apps-add-project-form',
  standalone: true,
  imports: [CommonModule , ReactiveFormsModule , CalendarModule],
  templateUrl: './add-project-form.component.html',
  styleUrl: './add-project-form.component.scss',
  providers: [DatePipe]
})
export class AddProjectFormComponent implements OnInit , OnChanges{
  @Input({required : true}) id!:number;
  @Output() closePopupEmit:EventEmitter<boolean> = new EventEmitter(false);
  @Output() getValues:EventEmitter<AddProjectForm> = new EventEmitter();
  fb = inject(FormBuilder);
  private datePipe = inject(DatePipe);
  addProjectForm!:FormGroup;
  ngOnInit() {
    this.addProjectForm = this.fb.group({
      major : ['' , [Validators.required , Validators.maxLength(100)]],
      startDate : ['' , Validators.required],
      // endDate : ['' , Validators.required],
      endDate : new FormControl({value:"" , disabled:true} , Validators.required),
      completion_level : ['' , Validators.required],
      weight : ['' , Validators.required]
    } , { validators: this.startDateEndDateValidator('startDate', 'endDate') })
  }
  selectStartDate(date:Date | null)
  {
    if(date)
    {
      this.endDate?.enable();
    } else {
      this.endDate?.disable();
      this.endDate?.reset();
    }
  }
  get major()
  {
    return this.addProjectForm.get("major");
  }
  get startDate()
  {
    return this.addProjectForm.get("startDate");
  }
  get endDate()
  {
    return this.addProjectForm.get("endDate");
  }
  get completionLevel()
  {
    return this.addProjectForm.get("completion_level");
  }
  get weight()
  {
    return this.addProjectForm.get("weight");
  }
  keyPress(e:KeyboardEvent)
  {
    if (e.key === 'e' || e.key === '-') {
      e.preventDefault();
    }
  }
  closePopup()
  {
    this.closePopupEmit.emit(true);
    this.addProjectForm.reset();
  }
  count = 0;
  ngOnChanges(): void {
    this.count = this.id;
  }
  addRecord()
  {
    ++this.count;
    if(this.addProjectForm.valid)
    {
      let count2 = this.count;
      const data:AddProjectForm = {
        id : count2,
        major : this.major?.value,
        startDate : this.datePipe.transform(this.startDate?.value , "dd/MM/yyyy"),
        endDate : this.datePipe.transform(this.endDate?.value , "dd/MM/yyyy"),
        completionLevel : this.completionLevel?.value,
        weight : this.weight?.value
      }
      this.getValues.emit(data);
      this.addProjectForm.reset();
      count2++;
    }
  }
  startDateEndDateValidator(startDateControl: string, endDateControl: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const startDate = control.get(startDateControl)?.value;
      const endDate = control.get(endDateControl)?.value;
  
      if (startDate && endDate && startDate > endDate) {
        return { startDateGreaterThanEndDate: true };
      }
  
      return null;
    };
  }
}
