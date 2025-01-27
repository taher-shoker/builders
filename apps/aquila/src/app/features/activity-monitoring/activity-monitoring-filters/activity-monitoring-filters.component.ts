import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupModule } from 'primeng/inputgroup';
import { SharedUiModule } from '@stc-apps/shared-ui';

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
  fb = inject(FormBuilder);

  userRoleOptions = [
    { label: 'User', value: 'User' },
    { label: 'Admin', value: 'Admin' },
  ];
  statusOptions = [
    { label: 'Success', value: 'SUCCESS' },
    { label: 'Failed', value: 'FAILED' },
  ];
  actionOptions = [
    { label: 'Login', value: 'Login' },
    { label: 'Add standard', value: 'Add standard' },
    { label: 'Update standard', value: 'Update standard' },
  ];

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      createdBy: [''],
      userRole: [''],
      status: [''],
      actionName: [''],
      startedAt: [null],
    });

    this.filterForm.valueChanges.subscribe((values) => {
      this.filtersChanged.emit(values);
    });
  }

  resetFilterControl(controlName: string) {
    this.filterForm.get(controlName)?.reset(null);
    this.filtersChanged.emit(this.filterForm.value);
  }

  resetAllFilters() {
    this.filterForm.reset();
    this.filtersChanged.emit(this.filterForm.value);
  }
}
