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
import {
  AddWorkstreamFormModel,
  KeyChallengesDataModel,
  pageDetailsModel,
  pageDetailsProjectModel,
} from '../../../models/digital-transformation';
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
  editFormData = input<KeyChallengesDataModel>({} as KeyChallengesDataModel);
  editWorkstreamFormData = input<pageDetailsModel | null>(null);
  editProjectData = input<pageDetailsProjectModel | null>(null);
  editProjectDataStatus = input<string | null>(null);
  isProject = input(false);
  @Output() delete = new EventEmitter();
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
  objArr: any[] = [];
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
      if (this.editProjectData()) {
        // console.log(this.editProjectData());
        this.addWorkstreamForm
          .get('title')
          ?.setValue(this.editProjectData()?.projectName);
        this.addWorkstreamForm
          .get('status')
          ?.setValue(this.editProjectData()?.projectStatus.toLowerCase());
        this.addWorkstreamForm
          .get('actual')
          ?.setValue(
            this.editProjectData()?.metrics.filter(
              (v) => v.name === 'actual'
            )[0].value
          );
        this.addWorkstreamForm
          .get('planned')
          ?.setValue(
            this.editProjectData()?.metrics.filter(
              (v) => v.name === 'planned'
            )[0].value
          );
        // this.addWorkstreamForm
        //   .get('title')
        //   ?.setValue(this.editProjectData()?.projectName);
      }
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
        if (
          this.editFormData() &&
          Object.keys(this.editFormData()).length !== 0
        ) {
          this.objArr = Object.keys(this.editFormData());
          this.addWorkstreamForm
            .get('description')
            ?.setValue(this.editFormData().description);
          this.addWorkstreamForm
            .get('raisedBy')
            ?.setValue(this.editFormData().raisedBy);
          this.addWorkstreamForm
            .get('owner')
            ?.setValue(this.editFormData().owner);
          this.addWorkstreamForm
            .get('dateRaised')
            ?.setValue(new Date(this.editFormData().dateRaised));
          this.addWorkstreamForm
            .get('impact')
            ?.setValue(this.editFormData().impact);
          this.addWorkstreamForm
            .get('supportNeeded')
            ?.setValue(this.editFormData().supportNeeded);
          // this.addWorkstreamForm.setValue(this.editFormData());
        }
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
        if (this.editWorkstreamFormData()) {
          let textareaValue = '';
          let textareaValue2 = '';
          if (this.editWorkstreamFormData()?.businessUnitHighlights) {
            const highlights =
              this.editWorkstreamFormData()?.businessUnitHighlights;
            if (highlights && typeof highlights === 'string') {
              try {
                const cleanedString = highlights
                  .replace(/�/g, ' ') // Replace � with space
                  .replace(/\\"/g, '"') // Replace \" with "
                  .replace(/"([^"]*)"/g, (match) => {
                    // Handle cases where quotes might be malformed
                    return match.replace(/\\(?=")/g, '');
                  });
                if (typeof cleanedString === 'string') {
                  const parsed = JSON.parse(cleanedString);
                  if (Array.isArray(parsed)) {
                    textareaValue = parsed
                      .map((item: any) => `${item.title}: ${item.value}`)
                      .join('\n');
                  }
                }
              } catch (error) {
                console.warn(
                  'businessUnitHighlights is not valid JSON:',
                  error
                );
                textareaValue = highlights.replace(/�/g, ' ');
              }
            }
          }
          if (this.editWorkstreamFormData()?.businessUnitChallenges) {
            const challenges =
              this.editWorkstreamFormData()?.businessUnitChallenges;
            if (challenges && typeof challenges === 'string') {
              try {
                const cleanedString = challenges
                  .replace(/�/g, ' ') // Replace � with space
                  .replace(/\\"/g, '"') // Replace \" with "
                  .replace(/"([^"]*)"/g, (match) => {
                    // Handle cases where quotes might be malformed
                    return match.replace(/\\(?=")/g, '');
                  });
                if (typeof cleanedString === 'string') {
                  const parsed = JSON.parse(cleanedString);
                  if (Array.isArray(parsed)) {
                    textareaValue2 = parsed
                      .map((item: any) => `${item.title}: ${item.value}`)
                      .join('\n');
                  }
                }
              } catch (error) {
                console.warn(
                  'businessUnitHighlights is not valid JSON:',
                  error
                );
                textareaValue2 = challenges.replace(/�/g, ' ');
              }
            }
          }
          // if (this.editWorkstreamFormData().businessUnitChallenges) {
          //   arr2 = JSON.parse(
          //     this.editWorkstreamFormData().businessUnitChallenges!
          //   );
          //   console.log(arr2);
          //   textareaValue2 = arr2
          //     .map((item: any) => `${item.value.replace(/�/g, ' ')}`)
          //     .join('\n');
          // }
          this.editWorkstreamFormData()!.businessUnitHighlights = textareaValue;
          this.editWorkstreamFormData()!.businessUnitChallenges =
            textareaValue2;
          this.addWorkstreamForm
            .get('title')
            ?.setValue(this.editWorkstreamFormData()?.businessUnit);
          this.addWorkstreamForm
            .get('status')
            ?.setValue(
              this.editWorkstreamFormData()?.businessUnitStatus?.toLowerCase()
            );
          this.addWorkstreamForm
            .get('weight')
            ?.setValue(this.editWorkstreamFormData()?.weight);
          this.addWorkstreamForm
            .get('actual')
            ?.setValue(this.editWorkstreamFormData()?.actual);
          this.addWorkstreamForm
            .get('planned')
            ?.setValue(this.editWorkstreamFormData()?.planned);
          this.addWorkstreamForm
            .get('heighlights')
            ?.setValue(this.editWorkstreamFormData()?.businessUnitHighlights);
          this.addWorkstreamForm
            .get('challenges')
            ?.setValue(this.editWorkstreamFormData()?.businessUnitChallenges);
        }
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
  deleteWorkstream() {
    if (this.editProjectData()) {
      this.delete.emit(this.editProjectData());
    } else {
      this.delete.emit(this.editWorkstreamFormData());
    }
  }
}
