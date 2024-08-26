import { Component, EventEmitter, inject, input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AddProjectForm } from 'apps/ebe/src/app/models/psr.model';

@Component({
  selector: 'stc-apps-add-project-form',
  standalone: true,
  imports: [CommonModule , ReactiveFormsModule],
  templateUrl: './add-project-form.component.html',
  styleUrl: './add-project-form.component.scss',
})
export class AddProjectFormComponent implements OnInit {
  id = input.required<number>();
  @Output() closePopupEmit:EventEmitter<boolean> = new EventEmitter(false);
  @Output() getValues:EventEmitter<AddProjectForm> = new EventEmitter();
  fb = inject(FormBuilder);
  addProjectForm!:FormGroup;
  ngOnInit() {
    this.addProjectForm = this.fb.group({
      major : ['' , Validators.required],
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
    if (e.key === 'e') {
      e.preventDefault();
    }
  }
  closePopup()
  {
    this.closePopupEmit.emit(true);
    this.addProjectForm.reset();
  }
  addRecord()
  {
    if(this.addProjectForm.valid)
    {
      const data:AddProjectForm = {
        id : this.id(),
        major : this.major?.value,
        start : this.start?.value,
        duration : this.duration?.value,
        completion_level : this.completionLevel?.value
      }
      this.getValues.emit(data);
      this.addProjectForm.reset();
    }
  }
}
