import {
  Component,
  EventEmitter,
  inject,
  input,
  InputSignal,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { PageHeaderComponent } from '../../../../components/pageHeader/page-header.component';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { StrategyProgramService } from '../../../../services/strategy-program.service';
import {
  StrategyProgramKpiDetailsModel,
  StrategyProgramKpiProjectsDetailsModel,
} from '../../../../models/strategy-program.model';
import { take } from 'rxjs';
import { SharedUiModule } from '@stc-apps/shared-ui';
import { ConfirmationService } from 'primeng/api';
@Component({
  selector: 'stc-apps-add-project-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PageHeaderComponent , SharedUiModule],
  templateUrl: './add-project-form.component.html',
  styleUrl: './add-project-form.component.scss',
  providers : [ConfirmationService]
})
export class AddProjectFormComponent implements OnInit, OnChanges {
  formBuilder = inject(FormBuilder);
  addProjectForm!: FormGroup;
  textLength = 0;
  private router = inject(Router);
  private location = inject(Location);
  modalVisible: InputSignal<boolean> = input.required<boolean>();
  strategyService = inject(StrategyProgramService);
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  activatedRoute = inject(ActivatedRoute);
  objectiveNumber!: number;
  title!: string;
  prevProjects: StrategyProgramKpiProjectsDetailsModel[] = [];
  ngOnInit(): void {
    this.addProjectForm = this.formBuilder.group({
      projects: this.formBuilder.array([]),
    });
    this.activatedRoute.params.subscribe({
      next: (param: Params) => {
        this.title = param['title'];
        this.objectiveNumber = +param['objective'];
        // this.isEmpty = true;
      },
    });
    this.strategyService.clickedProjects.pipe(take(1)).subscribe({
      next: (res: StrategyProgramKpiProjectsDetailsModel[]) => {
        if (res.length !== 0) {
          this.prevProjects = res;
          if (this.prevProjects.length !== 0) {
            this.prevProjects.forEach((proj) => {
              this.projectsList.push(this.createProjectFormGroup(proj));
            });
          } else {
            this.projectsList.push(this.createProjectFormGroup());
          }
        } else {
          this.strategyService.getStrategyProgramDetails(this.title).subscribe({
            next: (res: StrategyProgramKpiDetailsModel[]) => {
              this.prevProjects = res.filter(
                (val) => val.objective === this.objectiveNumber
              )[0].projects;
              if (this.prevProjects.length !== 0) {
                this.prevProjects.forEach((proj) => {
                  this.projectsList.push(this.createProjectFormGroup(proj));
                });
              } else {
                this.projectsList.push(this.createProjectFormGroup());
              }
            },
          });
        }
      },
    });
  }
  createProjectFormGroup(data?:StrategyProgramKpiProjectsDetailsModel): FormGroup {
    return this.formBuilder.group({
      project: [
        data && data.project ? data.project : null,
        [Validators.required, this.noSpacesValidator, Validators.maxLength(50)],
      ],
      actual: [data && (data.actual || data.actual === 0) ? data.actual : null, [Validators.required, this.rangeValidator]],
      planned: [data && (data.planned || data.planned === 0) ? data.planned : null, [Validators.required, this.rangeValidator]],
    });
  }
  get projectsList(): FormArray {
    return this.addProjectForm.get('projects') as FormArray;
  }
  hasErrors(): boolean {
    return this.projectsList.controls.some((control) => control.invalid);
  }
  ngOnChanges(): void {
    if (!this.modalVisible()) {
      this.addProjectForm.reset();
      // this.progectNameValue?.reset()
      this.textLength = 0;
    }
  }
  rangeValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (isNaN(value)) {
      return { isNumber: true };
    }
    if (value !== null && (isNaN(value) || value < 0 || value > 100)) {
      return { rangeError: true };
    }
    return null;
  }
  noSpacesValidator(control: AbstractControl): ValidationErrors | null {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { noSpaces: true };
  }
  closeModalFun() {
    this.closeModal.emit(true);
  }
  private confirmationService = inject(ConfirmationService);
  save() {
    if (this.addProjectForm.valid) {
      const projectArr = this.addProjectForm.value.projects;
      this.strategyService
        .updateProjects(this.title, this.objectiveNumber, projectArr)
        .subscribe({
          next: () => {
            this.confirmationService.confirm({
              key: 'added-project-success'
            });
          },
        });
    }
  }
  getValue(e: string) {
    if (e) {
      this.textLength = e.length;
    }
  }
  closeForm() {
    this.router.navigateByUrl('/strategy-program');
  }
  addNewProjectForm() {
    this.projectsList.push(this.createProjectFormGroup());
  }
  deleteForm(index: number) {
    this.projectsList.removeAt(index);
  }
  goback() {
    this.location.back();
  }
  keyPress(e: KeyboardEvent) {
    if (e.key === 'e' || e.key === '-') {
      e.preventDefault();
    }
  }
  showDeleteDialog()
  {
    this.confirmationService.confirm({
      key: 'delete-project'
    });
  }
  visible!:boolean;
  close()
  {
    this.confirmationService.close()
  }
}
