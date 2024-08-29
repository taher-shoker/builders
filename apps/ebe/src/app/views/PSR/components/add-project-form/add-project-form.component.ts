import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AddProjectForm } from '../../../../models/psr.model';

@Component({
  selector: 'stc-apps-add-project-form',
  standalone: true,
  imports: [CommonModule , ReactiveFormsModule],
  templateUrl: './add-project-form.component.html',
  styleUrl: './add-project-form.component.scss',
})
export class AddProjectFormComponent implements OnInit , OnChanges{
  @Input({required : true}) id!:number;
  @Output() closePopupEmit:EventEmitter<boolean> = new EventEmitter(false);
  @Output() getValues:EventEmitter<AddProjectForm> = new EventEmitter();
  fb = inject(FormBuilder);
  addProjectForm!:FormGroup;
  ngOnInit() {
    this.addProjectForm = this.fb.group({
      major : ['' , [Validators.required , Validators.maxLength(100)]],
      start : ['' , Validators.required],
      duration : ['' , Validators.required],
      completion_level : ['' , Validators.required]
    })
  }
  get major()
  {
    return this.addProjectForm.get("major");
  }
  get start()
  {
    return this.addProjectForm.get("start");
  }
  get duration()
  {
    return this.addProjectForm.get("duration");
  }
  get completionLevel()
  {
    return this.addProjectForm.get("completion_level");
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
        start : this.start?.value,
        duration : this.duration?.value,
        completion_level : this.completionLevel?.value
      }
      this.getValues.emit(data);
      this.addProjectForm.reset();
      count2++;
    }
  }
}
