import { Component, inject, input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  DigitalTransformationTapModel,
  IWorkstream,
  QuarterAchievementBusinessUnitModel,
  QuarterAchievementModel,
} from '../../../models/digital-transformation';
import { AccordionModule } from 'primeng/accordion';
import { DigitalTransformationService } from '../../../services/digital-transformation.service';
import { SidebarModule } from 'primeng/sidebar';
import { DropdownModule } from 'primeng/dropdown';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
interface Quarter {
  name: string;
  value: string;
}
@Component({
  selector: 'stc-apps-quarter-achievements',
  standalone: true,
  imports: [
    CommonModule,
    AccordionModule,
    SidebarModule,
    DropdownModule,
    ReactiveFormsModule,
    ConfirmDialogModule,
  ],
  templateUrl: './quarter-achievements.component.html',
  styleUrl: './quarter-achievements.component.scss',
  providers: [ConfirmationService],
})
export class QuarterAchievementsComponent implements OnInit, OnDestroy {
  currentTab = input.required<DigitalTransformationTapModel>();
  activeAccordionIndex = 0;
  showFormSidebar = false;
  toastr = inject(ToastrService);
  isPMO = input<boolean>();
  isMobile = input<boolean>();
  isViewer = input<boolean>();
  addWorkAchievementForm!: FormGroup;
  isEditMode = false;
  workstreams: IWorkstream[] = [];
  endSubs$: Subject<any> = new Subject();
  quarters: Quarter[] = [
    { name: 'Q1', value: 'q1' },
    { name: 'Q2', value: 'q2' },
    { name: 'Q3', value: 'q3' },
    { name: 'Q4', value: 'q4' },
  ];
  showSidebar() {
    document.body.classList.add('sidebar-open');
  }
  hideSidebar() {
    document.body.classList.remove('sidebar-open');
  }
  digitalTransformationService = inject(DigitalTransformationService);
  confirmationService = inject(ConfirmationService);
  quarterAchievements: QuarterAchievementModel[] = [];
  fb = inject(FormBuilder);
  toggleAccordion(index: number, event: Event) {
    event.stopPropagation();
    this.activeAccordionIndex =
      this.activeAccordionIndex === index ? -1 : index;
  }
  readonly MAX_ACHIEVEMENTS = 5;
  ngOnDestroy(): void {
    this.endSubs$.complete();
  }
  ngOnInit(): void {
    this.getQuarterAchievementsData();
    this.getAllAchievementsWorkstream();
    this.addWorkAchievementForm = this.fb.group({
      quarter: ['', [Validators.required]],
      workstream: ['', [Validators.required]],
      achievements: this.fb.array([this.createAchievementFormGroup()]),
    });
  }
  private getAllAchievementsWorkstream() {
    this.digitalTransformationService.getAllWorkstreams().subscribe({
      next: (res: IWorkstream[]) => {
        this.workstreams = res;
      },
    });
  }
  get achievements(): FormArray {
    return this.addWorkAchievementForm.get('achievements') as FormArray;
  }
  // Add a new achievement
  addAchievement(): void {
    if (this.achievements.length < this.MAX_ACHIEVEMENTS) {
      this.achievements.push(this.createAchievementFormGroup());
    }
  }
  canAddMoreAchievements(): boolean {
    return this.achievements.length < this.MAX_ACHIEVEMENTS;
  }
  // Remove an achievement at the specified index
  removeAchievement(index: number): void {
    this.achievements.removeAt(index);
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
  createAchievementFormGroup(): FormGroup {
    return this.fb.group({
      title: ['', [Validators.required, this.maxLengthTrimmed(1500)]],
      description: ['', [Validators.required, this.maxLengthTrimmed(1500)]],
    });
  }
  get quarter() {
    return this.addWorkAchievementForm.get('quarter');
  }
  get workstream() {
    return this.addWorkAchievementForm.get('workstream');
  }
  hideAddWorkstreamSidebar() {
    if (this.addWorkAchievementForm) {
      this.addWorkAchievementForm.reset();
      // Clear the FormArray properly
      // while (this.achievements.length !== 1) {
      this.achievements.removeAt(0);
      // }
    }
  }
  currQuarterAchievementId = 0;
  addNewAchievement() {
    if (this.addWorkAchievementForm.valid) {
      const formVal = { ...this.addWorkAchievementForm.getRawValue() };
      formVal.achievements.map((val: any) => {
        if (Array.isArray(val.description)) {
          val.description = val.description.join('\n');
        }
      });
      // const addedData;
      // if (formVal.achievements.length !== 0) {
      const addedData = {
        quarterName: formVal.quarter,
        businessUnitId: formVal.workstream,
        achievements: JSON.stringify(formVal.achievements),
        // achievements: formVal.achievements,
      };
      if (!this.isEditMode) {
        this.digitalTransformationService
          .addNewAchievement(addedData)
          .subscribe({
            next: () => {
              this.getQuarterAchievementsData();
              this.showFormSidebar = false;
              this.hideAddWorkstreamSidebar();
              this.toastr.success('The Achievement is added successfully');
            },
            error: () => {
              this.showFormSidebar = false;
              this.hideAddWorkstreamSidebar();
            },
          });
      } else {
        this.digitalTransformationService
          .editAchievement(this.currQuarterAchievementId, addedData)
          .subscribe({
            next: () => {
              this.getQuarterAchievementsData();
              this.showFormSidebar = false;
              this.hideAddWorkstreamSidebar();
              this.toastr.success('The Achievement is updated successfully');
            },
            error: () => {
              this.showFormSidebar = false;
              this.hideAddWorkstreamSidebar();
            },
          });
      }
    }
  }
  private getQuarterAchievementsData() {
    this.digitalTransformationService
      .getQuarterAchievementsData()
      .pipe(takeUntil(this.endSubs$))
      .subscribe({
        next: (quarters: QuarterAchievementModel[]) => {
          if (quarters && quarters.length !== 0) {
            quarters.forEach((q) => {
              if (q.businessUnits && q.businessUnits.length !== 0) {
                q.businessUnits.forEach((bu) => {
                  if (bu.achievements && bu.achievements.length !== 0) {
                    bu.achievements.forEach((achievement) => {
                      if (achievement.description) {
                        achievement.descriptionLines = achievement.description
                          .split(/\\n|\n/)
                          .map((line) => line.trim())
                          .filter((line) => line.length > 0);
                      } else {
                        achievement.descriptionLines = [];
                      }
                    });
                  }
                });
              }
            });
            this.quarterAchievements = quarters;
          } else {
            this.quarterAchievements = [];
          }
        },
      });
  }
  showAddSidebar() {
    this.addWorkAchievementForm.get('quarter')?.enable();
    this.addWorkAchievementForm.get('workstream')?.enable();
    this.achievements.clear();
    // this.achievements.reset();
    // this.addWorkAchievementForm.get('achievements')?.setValue(null);
    if (this.achievements && this.achievements.length < 1) {
      this.addAchievement();
    }
  }
  showEditSidebar(
    data: QuarterAchievementModel,
    bu: QuarterAchievementBusinessUnitModel
  ) {
    this.addWorkAchievementForm.get('quarter')?.disable();
    this.addWorkAchievementForm.get('workstream')?.disable();
    this.currQuarterAchievementId = bu.quarterAchievementId;
    this.deletedItem = data;
    const currBu = this.workstreams.filter(
      (val) => val.name.toLowerCase() === bu.name.toLowerCase()
    )[0];
    this.addWorkAchievementForm.get('quarter')?.setValue(data?.quarterName);
    this.addWorkAchievementForm.get('workstream')?.setValue(currBu?.id);
    this.achievements.clear();
    bu.achievements.forEach((achievement) => {
      const group = this.fb.group({
        title: [achievement.title, Validators.required],
        description: [
          achievement.description?.replace(/\\n/g, '\n'),
          Validators.required,
        ],
      });
      this.achievements.push(group);
    });
  }
  closeDialog() {
    this.confirmationService.close();
  }
  deletedItem!: QuarterAchievementModel;
  showDeleteDialog() {
    this.confirmationService.confirm({});
  }
  deleteChallenge() {
    this.digitalTransformationService
      .deleteAchievement(this.currQuarterAchievementId)
      .subscribe({
        next: () => {
          this.getQuarterAchievementsData();
          this.showFormSidebar = false;
          this.hideAddWorkstreamSidebar();
          this.closeDialog();
          this.toastr.success('The Workstream is deleted successfully');
        },
        error: () => {
          this.showFormSidebar = false;
          this.closeDialog();
          this.hideAddWorkstreamSidebar();
        },
      });
  }
}
