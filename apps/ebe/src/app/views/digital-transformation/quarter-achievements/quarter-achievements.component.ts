import { Component, inject, input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  DigitalTransformationTapModel,
  QuarterAchievementModel,
} from '../../../models/digital-transformation';
import { AccordionModule } from 'primeng/accordion';
import { DigitalTransformationService } from '../../../services/digital-transformation.service';
import { SidebarModule } from 'primeng/sidebar';
import { DropdownModule } from 'primeng/dropdown';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
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
export class QuarterAchievementsComponent implements OnInit {
  currentTab = input.required<DigitalTransformationTapModel>();
  activeAccordionIndex = 0;
  showFormSidebar = false;
  addWorkAchievementForm!: FormGroup;
  isEditMode = false;
  quarters: Quarter[] = [
    { name: 'Q1', value: 'q1' },
    { name: 'Q2', value: 'q2' },
    { name: 'Q3', value: 'q3' },
    { name: 'Q4', value: 'q4' },
  ];
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
  ngOnInit(): void {
    this.getQuarterAchievementsData();
    this.addWorkAchievementForm = this.fb.group({
      quarter: ['', [Validators.required]],
      workstream: ['', [Validators.required]],
      achievements: this.fb.array([this.createAchievementFormGroup()]),
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
  createAchievementFormGroup(): FormGroup {
    return this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
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
      while (this.achievements.length !== 1) {
        this.achievements.removeAt(0);
      }
    }
  }
  addNewAchievement() {
    if (this.addWorkAchievementForm.valid) {
      console.log(this.addWorkAchievementForm.value);
    }
  }
  private getQuarterAchievementsData() {
    this.digitalTransformationService.getQuarterAchievementsData().subscribe({
      next: (quarters: QuarterAchievementModel[]) => {
        quarters.forEach((q) => {
          q.businessUnits.forEach((bu) => {
            bu.achievements.forEach((achievement) => {
              if (achievement.description) {
                achievement.descriptionLines = achievement.description
                  .split('\\n')
                  .map((line) => line.trim())
                  .filter((line) => line.length > 0);
              } else {
                achievement.descriptionLines = [];
              }
            });
          });
        });
        console.log(quarters);
        this.quarterAchievements = quarters;
      },
    });
  }
  showEditSidebar(data: QuarterAchievementModel) {
    console.log(data);
    this.deletedItem = data;
    this.addWorkAchievementForm.get('quarter')?.setValue(data.quarterName);
    this.addWorkAchievementForm.get('workstream')?.setValue(data.quarterName);
    this.achievements.clear();
    data.businessUnits[0].achievements.forEach((achievement) => {
      const group = this.fb.group({
        title: [achievement.title, Validators.required],
        description: [achievement.descriptionLines, Validators.required],
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
    console.log(this.deletedItem);
  }
}
