import {
  Component,
  EventEmitter,
  inject,
  input,
  OnChanges,
  OnInit,
  Output,
  SimpleChange,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
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
  currentTabId = input<number>();
  isAddProject = input<boolean>(false);
  isEditWorkStream = input<boolean>(false);
  type = input<string>('');
  isPMO = input<boolean | undefined>();
  editedCompilanceData = input<pageDetailsModel | null>(null);
  editFormData = input<KeyChallengesDataModel>({} as KeyChallengesDataModel);
  editWorkstreamFormData = input<pageDetailsModel | null>(null);
  editProjectData = input<pageDetailsProjectModel | null>(null);
  editProjectDataStatus = input<string | null>(null);
  isProject = input();
  @Output() delete = new EventEmitter();
  @Output() addWorkStream: EventEmitter<AddWorkstreamFormModel> =
    new EventEmitter<AddWorkstreamFormModel>();
  statuses: Status[] = [
    { name: 'At Risk', value: 'at risk' },
    { name: 'On Track', value: 'on track' },
    { name: 'Completed', value: 'completed' },
    { name: 'Delayed', value: 'delayed' },
    // { name: 'Not Started / On hold', value: 'not started / on hold' },
  ];
  selectedStatus: Status | null = null;
  addWorkstream() {
    if (this.addWorkstreamForm.valid) {
      this.addWorkStream.emit(
        this.addWorkstreamForm.value as AddWorkstreamFormModel
      );
    }
  }
  requiredTrimmed(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toString().trim();
      return value !== '' ? null : { requiredTrimmed: true };
    };
  }
  maxLengthTrimmed(maxLength: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toString().trim() || '';
      return value.length > maxLength
        ? {
            maxLengthTrimmed: {
              requiredLength: maxLength,
              actualLength: value.length,
            },
          }
        : null;
    };
  }
  objArr: any[] = [];
  ngOnChanges(): void {
    if (!this.isWorkstreamSidebarVisible()) {
      if (this.addWorkstreamForm) {
        this.addWorkstreamForm.reset();
      }
    }
    if (this.isAddProject() || this.isEditProject()) {
      if (!this.isPMO()) {
        this.addWorkstreamForm = this.formBuilder.group({
          title: ['', [this.requiredTrimmed()]],
          status: ['', [this.requiredTrimmed()]],
          actual: [
            '',
            [this.requiredTrimmed(), Validators.min(0), Validators.max(100)],
          ],
          planned: [
            '',
            [this.requiredTrimmed(), Validators.min(0), Validators.max(100)],
          ],
        });
      } else {
        this.addWorkstreamForm = this.formBuilder.group({
          title: ['', [this.requiredTrimmed()]],
          actual: [
            '',
            [this.requiredTrimmed(), Validators.min(0), Validators.max(100)],
          ],
          planned: [
            '',
            [this.requiredTrimmed(), Validators.min(0), Validators.max(100)],
          ],
        });
      }
      if (this.editProjectData()) {
        console.log(this.editProjectData());
        this.addWorkstreamForm
          .get('title')
          ?.setValue(this.editProjectData()?.projectName);
        if (!this.isPMO()) {
          this.addWorkstreamForm
            .get('status')
            ?.setValue(this.editProjectData()?.projectStatus.toLowerCase());
        }
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
        if (!this.isPMO()) {
          this.addWorkstreamForm = this.formBuilder.group({
            title: ['', [this.requiredTrimmed(), this.maxLengthTrimmed(10)]],
            status: ['', [this.requiredTrimmed()]],
            heighlights: ['', [this.maxLengthTrimmed(1500)]],
            requestedArtifact: [
              '',
              // [this.requiredTrimmed(), Validators.min(0), Validators.max(100)],
              [this.requiredTrimmed()],
            ],
            completed: [
              '',
              // [this.requiredTrimmed(), Validators.min(0), Validators.max(100)],
              [this.requiredTrimmed()],
            ],
            missingArtifacts: [
              '',
              // [this.requiredTrimmed(), Validators.min(0), Validators.max(100)],
              [this.requiredTrimmed()],
            ],
          });
        } else {
          this.addWorkstreamForm = this.formBuilder.group({
            title: ['', [this.requiredTrimmed(), this.maxLengthTrimmed(10)]],
            heighlights: ['', [this.maxLengthTrimmed(1500)]],
            requestedArtifact: [
              '',
              // [this.requiredTrimmed(), Validators.min(0), Validators.max(100)],
              [this.requiredTrimmed()],
            ],
            completed: [
              '',
              // [this.requiredTrimmed(), Validators.min(0), Validators.max(100)],
              [this.requiredTrimmed()],
            ],
            missingArtifacts: [
              '',
              // [this.requiredTrimmed(), Validators.min(0), Validators.max(100)],
              [this.requiredTrimmed()],
            ],
          });
        }
        if (this.editedCompilanceData()) {
          let textareaValue = '';
          console.log(this.editedCompilanceData());
          this.addWorkstreamForm
            .get('title')
            ?.setValue(this.editedCompilanceData()?.businessUnit);
          if (this.editedCompilanceData()?.projects[0].projectHighlights) {
            const highlights =
              this.editedCompilanceData()?.projects[0].projectHighlights;
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
                      .map((item: any) => {
                        if (item.title) {
                          return `${item.title}: ${item.value}`;
                        }
                        return `${item.value}`;
                      })
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
              this.addWorkstreamForm
                .get('heighlights')
                ?.setValue(textareaValue);
            }
          }
          if (!this.isPMO()) {
            this.addWorkstreamForm
              .get('status')
              ?.setValue(
                this.editedCompilanceData()?.projects[0].projectStatus.toLowerCase()
              );
          }
          this.addWorkstreamForm
            .get('requestedArtifact')
            ?.setValue(
              this.editedCompilanceData()?.projects[0].metrics.filter(
                (val) => val.name.toLowerCase() === 'requested artifacts'
              )[0]?.value
            );
          this.addWorkstreamForm
            .get('completed')
            ?.setValue(
              this.editedCompilanceData()?.projects[0].metrics.filter(
                (val) => val.name.toLowerCase() === 'completed'
              )[0]?.value
            );
          this.addWorkstreamForm
            .get('missingArtifacts')
            ?.setValue(
              this.editedCompilanceData()?.projects[0].metrics.filter(
                (val) => val.name.toLowerCase() === 'missing artifacts'
              )[0]?.value
            );
        }
      } else if (this.type() === 'challenges') {
        this.addWorkstreamForm = this.formBuilder.group({
          description: [
            '',
            [this.requiredTrimmed(), this.maxLengthTrimmed(1500)],
          ],
          raisedBy: ['', [this.maxLengthTrimmed(1500)]],
          owner: ['', [this.maxLengthTrimmed(1500)]],
          dateRaised: ['', [this.maxLengthTrimmed(1500)]],
          impact: ['', [this.maxLengthTrimmed(1500)]],
          supportNeeded: ['', [this.maxLengthTrimmed(1500)]],
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
      } else if (this.currentTabId() === 4) {
        if (!this.isEditWorkStream()) {
          this.addWorkstreamForm = this.formBuilder.group({
            title: ['', [this.requiredTrimmed(), this.maxLengthTrimmed(10)]],
            status: ['', [this.requiredTrimmed()]],
            heighlights: ['', [this.maxLengthTrimmed(1500)]],
            actual: [
              '',
              [this.requiredTrimmed(), Validators.min(0), Validators.max(100)],
            ],
            planned: [
              '',
              [this.requiredTrimmed(), Validators.min(0), Validators.max(100)],
            ],
          });
        } else {
          this.addWorkstreamForm = this.formBuilder.group({
            status: ['', [this.requiredTrimmed()]],
            heighlights: ['', [this.maxLengthTrimmed(1500)]],
            actual: [
              '',
              [this.requiredTrimmed(), Validators.min(0), Validators.max(100)],
            ],
            planned: [
              '',
              [this.requiredTrimmed(), Validators.min(0), Validators.max(100)],
            ],
          });
        }
        if (this.editedCompilanceData()) {
          let textareaValue = '';
          console.log(this.editedCompilanceData());
          this.addWorkstreamForm
            .get('title')
            ?.setValue(this.editedCompilanceData()?.businessUnit);
          if (this.editedCompilanceData()?.projects[0].projectHighlights) {
            const highlights =
              this.editedCompilanceData()?.projects[0].projectHighlights;
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
                      .map((item: any) => {
                        if (item.title && !item.value) {
                          return `${item.title}`;
                        } else if (!item.title && item.value) {
                          return `${item.value}`;
                        } else if (item.title && item.value) {
                          return `${item.title}:${item.value}`;
                        }
                        return '';
                      })
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
              this.addWorkstreamForm
                .get('heighlights')
                ?.setValue(textareaValue);
            }
          }
          this.addWorkstreamForm
            .get('status')
            ?.setValue(
              this.editedCompilanceData()?.projects[0].projectStatus.toLowerCase()
            );
          this.addWorkstreamForm
            .get('actual')
            ?.setValue(
              this.editedCompilanceData()?.projects[0].metrics.filter(
                (val) => val.name.toLowerCase() === 'actual'
              )[0]?.value
            );
          this.addWorkstreamForm
            .get('planned')
            ?.setValue(
              this.editedCompilanceData()?.projects[0].metrics.filter(
                (val) => val.name.toLowerCase() === 'planned'
              )[0]?.value
            );
        }
      } else if (
        this.currentTabId() === 5 ||
        this.currentTabId() === 6 ||
        this.currentTabId() === 7
      ) {
        if (this.currentTabId() === 5) {
          if (this.isEditWorkStream()) {
            this.addWorkstreamForm = this.formBuilder.group({
              status: ['', [this.requiredTrimmed()]],
              highlights: ['', [this.maxLengthTrimmed(1500)]],
              technicalDebt: this.formBuilder.group({
                closed: ['', [this.requiredTrimmed()]],
                open: ['', [this.requiredTrimmed()]],
                delayed: ['', [this.requiredTrimmed()]],
                underVerification: ['', [this.requiredTrimmed()]],
                totalTD: ['', [this.requiredTrimmed()]],
              }),
              architecturalBacklog: this.formBuilder.group({
                closed: ['', [this.requiredTrimmed()]],
                open: ['', [this.requiredTrimmed()]],
                delayed: ['', [this.requiredTrimmed()]],
                underVerification: ['', [this.requiredTrimmed()]],
                totalTD: ['', [this.requiredTrimmed()]],
              }),
            });
          } else {
            this.addWorkstreamForm = this.formBuilder.group({
              title: ['', [this.requiredTrimmed(), this.maxLengthTrimmed(10)]],
              status: ['', [this.requiredTrimmed()]],
              highlights: ['', [this.maxLengthTrimmed(1500)]],
              technicalDebt: this.formBuilder.group({
                closed: ['', [this.requiredTrimmed()]],
                open: ['', [this.requiredTrimmed()]],
                delayed: ['', [this.requiredTrimmed()]],
                underVerification: ['', [this.requiredTrimmed()]],
                totalTD: ['', [this.requiredTrimmed()]],
              }),
              architecturalBacklog: this.formBuilder.group({
                closed: ['', [this.requiredTrimmed()]],
                open: ['', [this.requiredTrimmed()]],
                delayed: ['', [this.requiredTrimmed()]],
                underVerification: ['', [this.requiredTrimmed()]],
                totalTD: ['', [this.requiredTrimmed()]],
              }),
            });
          }
        } else {
          if (this.isEditWorkStream()) {
            this.addWorkstreamForm = this.formBuilder.group({
              status: ['', [this.requiredTrimmed()]],
              highlights: ['', [this.maxLengthTrimmed(1500)]],
              technicalDebt: this.formBuilder.group({
                closed: ['', [this.requiredTrimmed()]],
                open: ['', [this.requiredTrimmed()]],
                delayed: ['', [this.requiredTrimmed()]],
                underVerification: ['', [this.requiredTrimmed()]],
                totalTD: ['', [this.requiredTrimmed()]],
              }),
            });
          } else {
            this.addWorkstreamForm = this.formBuilder.group({
              title: ['', [this.requiredTrimmed(), this.maxLengthTrimmed(10)]],
              status: ['', [this.requiredTrimmed()]],
              highlights: ['', [this.maxLengthTrimmed(1500)]],
              technicalDebt: this.formBuilder.group({
                closed: ['', [this.requiredTrimmed()]],
                open: ['', [this.requiredTrimmed()]],
                delayed: ['', [this.requiredTrimmed()]],
                underVerification: ['', [this.requiredTrimmed()]],
                totalTD: ['', [this.requiredTrimmed()]],
              }),
            });
          }
        }
        if (this.editedCompilanceData()) {
          console.log(this.editedCompilanceData());
          let textareaValue = '';
          if (
            this.editedCompilanceData()?.businessUnitHighlights ||
            this.editedCompilanceData()?.projects[0].projectHighlights
          ) {
            const highlights =
              this.editedCompilanceData()?.businessUnitHighlights ??
              this.editedCompilanceData()?.projects[0].projectHighlights;
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
                      .map((item: any) => {
                        if (item.title) {
                          return `${item.title}: ${item.value}`;
                        }
                        return `${item.value}`;
                      })
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
              this.addWorkstreamForm.get('highlights')?.setValue(textareaValue);
            }
          }
          this.addWorkstreamForm
            .get('title')
            ?.setValue(this.editedCompilanceData()?.businessUnit);
          if (this.editedCompilanceData()?.projects[0].totalCapabilities) {
            this.addWorkstreamForm
              .get('technicalDebt.totalTD')
              ?.setValue(
                this.editedCompilanceData()?.projects[0].totalCapabilities
              );
          }
          if (this.editedCompilanceData()?.projects[0].totalTD) {
            this.addWorkstreamForm
              .get('technicalDebt.totalTD')
              ?.setValue(
                this.editedCompilanceData()?.projects.filter(
                  (val) => val.projectName.toLowerCase() === 'technical dept'
                )[0].totalTD
              );
          }
          this.addWorkstreamForm
            .get('status')
            ?.setValue(
              this.editedCompilanceData()?.projects[0].projectStatus.toLowerCase()
            );
          if (this.editedCompilanceData()?.projects[0].projectName) {
            this.addWorkstreamForm.get('technicalDebt.closed')?.setValue(
              this.editedCompilanceData()
                ?.projects.filter(
                  (val) => val.projectName.toLowerCase() === 'technical dept'
                )[0]
                .metrics.filter((val2) => val2.name.trim() === 'closed')[0]
                .value
            );
            this.addWorkstreamForm.get('technicalDebt.open')?.setValue(
              this.editedCompilanceData()
                ?.projects.filter(
                  (val) => val.projectName.toLowerCase() === 'technical dept'
                )[0]
                .metrics.filter((val2) => val2.name.trim() === 'open')[0].value
            );
            this.addWorkstreamForm.get('technicalDebt.delayed')?.setValue(
              this.editedCompilanceData()
                ?.projects.filter(
                  (val) => val.projectName.toLowerCase() === 'technical dept'
                )[0]
                .metrics.filter((val2) => val2.name.trim() === 'delayed')[0]
                .value
            );
            this.addWorkstreamForm
              .get('technicalDebt.underVerification')
              ?.setValue(
                this.editedCompilanceData()
                  ?.projects.filter(
                    (val) => val.projectName.toLowerCase() === 'technical dept'
                  )[0]
                  .metrics.filter(
                    (val2) => val2.name.trim() === 'under verfication'
                  )[0].value
              );
            this.addWorkstreamForm.get('architecturalBacklog.closed')?.setValue(
              this.editedCompilanceData()
                ?.projects.filter(
                  (val) =>
                    val.projectName.toLowerCase() === 'architectual backlog'
                )[0]
                .metrics.filter((val2) => val2.name.trim() === 'closed')[0]
                .value
            );
            if (this.editedCompilanceData()?.projects[0].totalTD) {
              this.addWorkstreamForm
                .get('architecturalBacklog.totalTD')
                ?.setValue(
                  this.editedCompilanceData()?.projects.filter(
                    (val) =>
                      val.projectName.toLowerCase() === 'architectual backlog'
                  )[0].totalTD
                );
            }
            this.addWorkstreamForm.get('architecturalBacklog.open')?.setValue(
              this.editedCompilanceData()
                ?.projects.filter(
                  (val) =>
                    val.projectName.toLowerCase() === 'architectual backlog'
                )[0]
                .metrics.filter((val2) => val2.name.trim() === 'open')[0].value
            );
            this.addWorkstreamForm
              .get('architecturalBacklog.delayed')
              ?.setValue(
                this.editedCompilanceData()
                  ?.projects.filter(
                    (val) =>
                      val.projectName.toLowerCase() === 'architectual backlog'
                  )[0]
                  .metrics.filter((val2) => val2.name.trim() === 'delayed')[0]
                  .value
              );
            this.addWorkstreamForm
              .get('architecturalBacklog.underVerification')
              ?.setValue(
                this.editedCompilanceData()
                  ?.projects.filter(
                    (val) =>
                      val.projectName.toLowerCase() === 'architectual backlog'
                  )[0]
                  .metrics.filter(
                    (val2) => val2.name.trim() === 'under verfication'
                  )[0].value
              );
            if (this.editedCompilanceData()?.projects[1].totalABL) {
              this.addWorkstreamForm
                .get('architecturalBacklog.totalTD')
                ?.setValue(
                  this.editedCompilanceData()?.projects.filter(
                    (val) =>
                      val.projectName.toLowerCase() === 'architectual backlog'
                  )[0].totalABL
                );
            }
          } else {
            this.addWorkstreamForm
              .get('technicalDebt.closed')
              ?.setValue(
                this.editedCompilanceData()?.projects[0].metrics.filter(
                  (val2) => val2.name.trim().toLowerCase() === 'completed'
                )[0]?.value
              );
            this.addWorkstreamForm
              .get('technicalDebt.open')
              ?.setValue(
                this.editedCompilanceData()?.projects[0].metrics.filter(
                  (val2) =>
                    val2.name.trim().toLowerCase() === 'open' ||
                    val2.name.trim().toLowerCase() === 'on track'
                )[0]?.value
              );
            this.addWorkstreamForm
              .get('technicalDebt.delayed')
              ?.setValue(
                this.editedCompilanceData()?.projects[0].metrics.filter(
                  (val2) => val2.name.trim().toLowerCase() === 'delayed'
                )[0]?.value
              );
            this.addWorkstreamForm
              .get('technicalDebt.underVerification')
              ?.setValue(
                this.editedCompilanceData()?.projects[0].metrics.filter(
                  (val2) => val2.name.trim().toLowerCase() === 'on hold'
                )[0]?.value
              );
          }
        }
      } else {
        if (!this.isEditWorkStream()) {
          this.addWorkstreamForm = this.formBuilder.group({
            title: ['', [this.requiredTrimmed(), this.maxLengthTrimmed(10)]],
            // title: ['', [this.requiredTrimmed()]],
            status: ['', [this.requiredTrimmed()]],
            weight: [
              '',
              [this.requiredTrimmed(), Validators.min(0), Validators.max(100)],
            ],
            actual: [
              '',
              [this.requiredTrimmed(), Validators.min(0), Validators.max(100)],
            ],
            planned: [
              '',
              [this.requiredTrimmed(), Validators.min(0), Validators.max(100)],
            ],
            heighlights: ['', [this.maxLengthTrimmed(1500)]],
            challenges: ['', [this.maxLengthTrimmed(1500)]],
          });
        } else {
          this.addWorkstreamForm = this.formBuilder.group({
            status: ['', [this.requiredTrimmed()]],
            weight: [
              '',
              [this.requiredTrimmed(), Validators.min(0), Validators.max(100)],
            ],
            actual: [
              '',
              [this.requiredTrimmed(), Validators.min(0), Validators.max(100)],
            ],
            planned: [
              '',
              [this.requiredTrimmed(), Validators.min(0), Validators.max(100)],
            ],
            heighlights: ['', [this.maxLengthTrimmed(1500)]],
            challenges: ['', [this.maxLengthTrimmed(1500)]],
          });
        }
        if (this.editWorkstreamFormData()) {
          let textareaValue = '';
          let textareaValue2 = '';
          console.log(this.editWorkstreamFormData());
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
                if (cleanedString.trim().startsWith('[')) {
                  const parsed = JSON.parse(cleanedString);
                  if (Array.isArray(parsed)) {
                    textareaValue = parsed
                      .map((item: any) => {
                        if (item.title && !item.value) {
                          return `${item.title}`;
                        } else if (!item.title && item.value) {
                          return `${item.value}`;
                        } else if (item.title && item.value) {
                          return `${item.title}:${item.value}`;
                        }
                        return '';
                      })
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
                if (cleanedString.trim().startsWith('[')) {
                  const parsed = JSON.parse(cleanedString);
                  if (Array.isArray(parsed) && parsed.length !== 0) {
                    textareaValue2 = parsed
                      .map((item: any) => {
                        if (item.title && !item.value) {
                          return `${item.title}`;
                        } else if (!item.title && item.value) {
                          return `${item.value}`;
                        } else if (item.title && item.value) {
                          return `${item.title}:${item.value}`;
                        }
                        return '';
                      })
                      .join('\n');
                  }
                  console.log(textareaValue2);
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
          // this.addWorkstreamForm
          //   .get('title')
          //   ?.setValue(this.editWorkstreamFormData()?.businessUnit);
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
        title: ['', [this.requiredTrimmed(), this.maxLengthTrimmed(10)]],
        status: ['', [this.requiredTrimmed()]],
        actual: [
          '',
          [this.requiredTrimmed(), Validators.min(0), Validators.max(100)],
        ],
        planned: [
          '',
          [this.requiredTrimmed(), Validators.min(0), Validators.max(100)],
        ],
      });
    } else {
      if (this.type() === 'compilance') {
        this.addWorkstreamForm = this.formBuilder.group({
          title: ['', [this.requiredTrimmed(), this.maxLengthTrimmed(10)]],
          status: ['', [this.requiredTrimmed()]],
          heighlights: ['', [this.maxLengthTrimmed(1500)]],
          requestedArtifact: [
            '',
            [this.requiredTrimmed(), Validators.min(0), Validators.max(100)],
          ],
          completed: [
            '',
            [this.requiredTrimmed(), Validators.min(0), Validators.max(100)],
          ],
          missingArtifacts: [
            '',
            [this.requiredTrimmed(), Validators.min(0), Validators.max(100)],
          ],
        });
      } else if (this.type() === 'challenges') {
        this.addWorkstreamForm = this.formBuilder.group({
          description: [
            '',
            [this.requiredTrimmed(), this.maxLengthTrimmed(1500)],
          ],
          raisedBy: ['', [this.maxLengthTrimmed(1500)]],
          owner: ['', [this.maxLengthTrimmed(1500)]],
          dateRaised: ['', [this.maxLengthTrimmed(1500)]],
          impact: ['', [this.maxLengthTrimmed(1500)]],
          supportNeeded: ['', [this.maxLengthTrimmed(1500)]],
        });
      } else if (this.currentTabId() === 4) {
        this.addWorkstreamForm = this.formBuilder.group({
          title: ['', [this.requiredTrimmed(), this.maxLengthTrimmed(10)]],
          status: ['', [this.requiredTrimmed()]],
          heighlights: ['', [this.maxLengthTrimmed(1500)]],
          actual: [
            '',
            [this.requiredTrimmed(), Validators.min(0), Validators.max(100)],
          ],
          planned: [
            '',
            [this.requiredTrimmed(), Validators.min(0), Validators.max(100)],
          ],
        });
      } else if (this.currentTabId() === 5 || this.currentTabId() === 6) {
        if (this.currentTabId() === 5) {
          this.addWorkstreamForm = this.formBuilder.group({
            title: ['', [this.requiredTrimmed(), this.maxLengthTrimmed(10)]],
            status: ['', [this.requiredTrimmed()]],
            highlights: ['', [this.maxLengthTrimmed(1500)]],
            technicalDebt: this.formBuilder.group({
              closed: ['', [this.requiredTrimmed()]],
              open: ['', [this.requiredTrimmed()]],
              delayed: ['', [this.requiredTrimmed()]],
              underVerification: ['', [this.requiredTrimmed()]],
              totalTD: ['', [this.requiredTrimmed()]],
            }),

            architecturalBacklog: this.formBuilder.group({
              closed: ['', [this.requiredTrimmed()]],
              open: ['', [this.requiredTrimmed()]],
              delayed: ['', [this.requiredTrimmed()]],
              underVerification: ['', [this.requiredTrimmed()]],
              totalTD: ['', [this.requiredTrimmed()]],
            }),
          });
        } else {
          this.addWorkstreamForm = this.formBuilder.group({
            title: ['', [this.requiredTrimmed(), this.maxLengthTrimmed(10)]],
            status: ['', [this.requiredTrimmed()]],
            highlights: ['', [this.maxLengthTrimmed(1500)]],
            technicalDebt: this.formBuilder.group({
              closed: ['', [this.requiredTrimmed()]],
              open: ['', [this.requiredTrimmed()]],
              delayed: ['', [this.requiredTrimmed()]],
              underVerification: ['', [this.requiredTrimmed()]],
              totalTD: ['', [this.requiredTrimmed()]],
            }),
          });
        }
      } else {
        if (!this.isEditWorkStream()) {
          this.addWorkstreamForm = this.formBuilder.group({
            title: ['', [this.requiredTrimmed(), this.maxLengthTrimmed(10)]],
            status: ['', [this.requiredTrimmed()]],
            weight: [
              '',
              [this.requiredTrimmed(), Validators.min(0), Validators.max(100)],
            ],
            actual: [
              '',
              [this.requiredTrimmed(), Validators.min(0), Validators.max(100)],
            ],
            planned: [
              '',
              [this.requiredTrimmed(), Validators.min(0), Validators.max(100)],
            ],
            heighlights: ['', [this.maxLengthTrimmed(1500)]],
            challenges: ['', [this.maxLengthTrimmed(1500)]],
          });
        } else {
          this.addWorkstreamForm = this.formBuilder.group({
            status: ['', [this.requiredTrimmed()]],
            weight: [
              '',
              [this.requiredTrimmed(), Validators.min(0), Validators.max(100)],
            ],
            actual: [
              '',
              [this.requiredTrimmed(), Validators.min(0), Validators.max(100)],
            ],
            planned: [
              '',
              [this.requiredTrimmed(), Validators.min(0), Validators.max(100)],
            ],
            heighlights: ['', [this.maxLengthTrimmed(1500)]],
            challenges: ['', [this.maxLengthTrimmed(1500)]],
          });
        }
      }
    }
  }
  preventInvalidKeys(event: KeyboardEvent) {
    const invalidChars = ['e', 'E', '+', '-', 'ArrowUp', 'ArrowDown'];
    if (invalidChars.includes(event.key)) {
      event.preventDefault();
    }
  }
  preventMouseWheelChange(event: WheelEvent) {
    (event.target as HTMLElement).blur(); // Optional: remove focus
    event.preventDefault(); // Prevent scroll changing the input value
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
    } else if (this.editedCompilanceData()) {
      this.delete.emit(this.editedCompilanceData());
    } else {
      this.delete.emit(this.editWorkstreamFormData());
    }
  }
}
