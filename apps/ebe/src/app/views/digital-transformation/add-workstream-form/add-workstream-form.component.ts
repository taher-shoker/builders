import {
  Component,
  EventEmitter,
  inject,
  input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AddWorkstreamFormModel } from '../../../models/digital-transformation';
import { CalendarModule } from 'primeng/calendar';
interface Status {
  name: string;
  value: string;
}
@Component({
  selector: 'stc-apps-add-workstream-form',
  standalone: true,
  imports: [CommonModule, DropdownModule, ReactiveFormsModule, CalendarModule],
  templateUrl: './add-workstream-form.component.html',
  styleUrl: './add-workstream-form.component.scss',
})
export class AddWorkstreamFormComponent implements OnInit, OnChanges {
  formBuilder = inject(FormBuilder);
  addWorkstreamForm!: FormGroup;
  isWorkstreamSidebarVisible = input<boolean>(false);
  isEditProject = input<boolean>(false);
  isAddProject = input<boolean>(false);
  isEditWorkStream = input<boolean>(false);
  type = input<string>('');
  isProject = input(false);
  @Output() addWorkStream: EventEmitter<AddWorkstreamFormModel> =
    new EventEmitter<AddWorkstreamFormModel>();
  statuses: Status[] = [
    { name: 'At Risk', value: 'at risk' },
    { name: 'On Track', value: 'on track' },
    { name: 'Completed', value: 'completed' },
    { name: 'Delayed', value: 'delayed' },
    { name: 'Not Started/On Hold', value: 'not started/on hold' },
  ];
  selectedStatus: Status | null = null;
  addWorkstream() {
    if (this.addWorkstreamForm.valid) {
      this.addWorkStream.emit(
        this.addWorkstreamForm.value as AddWorkstreamFormModel
      );
    }
  }
  ngOnChanges(): void {
    if (!this.isWorkstreamSidebarVisible()) {
      if (this.addWorkstreamForm) {
        this.addWorkstreamForm.reset();
      }
    }
    if (this.isAddProject() || this.isEditProject()) {
      this.addWorkstreamForm = this.formBuilder.group({
        title: ['', [Validators.required]],
        status: ['', [Validators.required]],
        actual: [
          '',
          [Validators.required, Validators.min(0), Validators.max(100)],
        ],
        planned: [
          '',
          [Validators.required, Validators.min(0), Validators.max(100)],
        ],
      });
    } else {
      if (this.type() === 'compilance') {
        this.addWorkstreamForm = this.formBuilder.group({
          title: ['', [Validators.required]],
          status: ['', [Validators.required]],
          heighlights: [''],
          requestedArtifact: [
            '',
            [Validators.required, Validators.min(0), Validators.max(100)],
          ],
          completed: [
            '',
            [Validators.required, Validators.min(0), Validators.max(100)],
          ],
          missingArtifacts: [
            '',
            [Validators.required, Validators.min(0), Validators.max(100)],
          ],
        });
      } else if (this.type() === 'challenges') {
        this.addWorkstreamForm = this.formBuilder.group({
          description: [''],
          raisedBy: [''],
          owner: [''],
          dateRaised: [''],
          impact: [''],
          supportNeeded: [''],
        });
      } else {
        this.addWorkstreamForm = this.formBuilder.group({
          title: ['', [Validators.required]],
          status: ['', [Validators.required]],
          weight: [
            '',
            [Validators.required, Validators.min(0), Validators.max(100)],
          ],
          actual: [
            '',
            [Validators.required, Validators.min(0), Validators.max(100)],
          ],
          planned: [
            '',
            [Validators.required, Validators.min(0), Validators.max(100)],
          ],
          heighlights: [''],
          challenges: [''],
        });
      }
    }
  }
  ngOnInit(): void {
    if (this.isAddProject() || this.isEditProject()) {
      this.addWorkstreamForm = this.formBuilder.group({
        title: ['', [Validators.required]],
        status: ['', [Validators.required]],
        actual: [
          '',
          [Validators.required, Validators.min(0), Validators.max(100)],
        ],
        planned: [
          '',
          [Validators.required, Validators.min(0), Validators.max(100)],
        ],
      });
    } else {
      if (this.type() === 'compilance') {
        this.addWorkstreamForm = this.formBuilder.group({
          title: ['', [Validators.required]],
          status: ['', [Validators.required]],
          heighlights: [''],
          requestedArtifact: [
            '',
            [Validators.required, Validators.min(0), Validators.max(100)],
          ],
          completed: [
            '',
            [Validators.required, Validators.min(0), Validators.max(100)],
          ],
          missingArtifacts: [
            '',
            [Validators.required, Validators.min(0), Validators.max(100)],
          ],
        });
      } else if (this.type() === 'challenges') {
        this.addWorkstreamForm = this.formBuilder.group({
          description: ['', [Validators.required]],
          raisedBy: [''],
          owner: [''],
          dateRaised: [''],
          impact: [''],
          supportNeeded: [''],
        });
      } else {
        this.addWorkstreamForm = this.formBuilder.group({
          title: ['', [Validators.required]],
          status: ['', [Validators.required]],
          weight: [
            '',
            [Validators.required, Validators.min(0), Validators.max(100)],
          ],
          actual: [
            '',
            [Validators.required, Validators.min(0), Validators.max(100)],
          ],
          planned: [
            '',
            [Validators.required, Validators.min(0), Validators.max(100)],
          ],
          heighlights: [''],
          challenges: [''],
        });
      }
    }
  }
  preventInvalidKeys(event: KeyboardEvent) {
    const invalidChars = ['e', 'E', '+', '-'];
    if (invalidChars.includes(event.key)) {
      event.preventDefault();
    }
  }
  get description() {
    return this.addWorkstreamForm.get('description');
  }
  get title() {
    return this.addWorkstreamForm.get('title');
  }
  get status() {
    return this.addWorkstreamForm.get('status');
  }
  get weight() {
    return this.addWorkstreamForm.get('weight');
  }
  get actual() {
    return this.addWorkstreamForm.get('actual');
  }
  get planned() {
    return this.addWorkstreamForm.get('planned');
  }
  get requestedArtifact() {
    return this.addWorkstreamForm.get('requestedArtifact');
  }
  get completed() {
    return this.addWorkstreamForm.get('completed');
  }
  get missingArtifacts() {
    return this.addWorkstreamForm.get('missingArtifacts');
  }
}
