import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupModule } from 'primeng/inputgroup';
import { SharedUiModule } from '@stc-apps/shared-ui';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  Subject,
  takeUntil,
} from 'rxjs';

@Component({
  selector: 'stc-apps-activity-monitoring-filters',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CalendarModule,
    InputTextModule,
    InputIconModule,
    IconFieldModule,
    InputGroupModule,
    SharedUiModule,
  ],
  templateUrl: './activity-monitoring-filters.component.html',
  styleUrls: ['./activity-monitoring-filters.component.scss'],
})
export class ActivityMonitoringFiltersComponent implements OnInit {
  @Output() filtersChanged = new EventEmitter<any>();
  filterForm: FormGroup = new FormGroup({});
  private destroy$ = new Subject<void>();
  private fb = inject(FormBuilder);

  userRoleOptions = [
    { label: 'User', value: 'User' },
    { label: 'Admin', value: 'Admin' },
  ];
  statusOptions = [
    { label: 'Success', value: 'SUCCESS' },
    { label: 'Failed', value: 'FAILED' },
  ];
  actionOptions = [
    { label: 'getAllStandards', value: 'getAllStandards' },
    { label: 'runMultipleComplianceTest', value: 'runMultipleComplianceTest' },
    { label: 'uploadStandardFiles', value: 'uploadStandardFiles' },
    { label: 'getErrorCode', value: 'getErrorCode' },
    { label: 'createStandard', value: 'createStandard' },
  ];

  ngOnInit(): void {
    this.initializeForm();
    this.setupFormSubscription();
  }

  private initializeForm(): void {
    this.filterForm = this.fb.group({
      createdBy: [''],
      userRole: [''],
      status: [''],
      actionName: [''],
      startedAt: [null],
    });
  }

  private setupFormSubscription(): void {
    this.filterForm.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(
          (prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)
        ),
        map((values) => this.processFormValues(values)),
        takeUntil(this.destroy$)
      )
      .subscribe((values) => this.filtersChanged.emit(values));
  }

  resetFilterControl(controlName: string) {
    this.filterForm.get(controlName)?.reset(null);
    this.filtersChanged.emit(this.filterForm.value);
  }

  resetAllFilters() {
    this.filterForm.reset();
    this.filtersChanged.emit(this.filterForm.value);
  }

  private processFormValues(values: any): any {
    return {
      createdBy: values.createdBy,
      userRole: values.userRole?.value || '',
      status: values.status?.value || '',
      actionName: values.actionName?.value || '',
      startedAt: values.startedAt,
    };
  }
}
