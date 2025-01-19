import { Component, inject } from '@angular/core';
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
export class ActivityMonitoringFiltersComponent {
  filterForm: FormGroup = new FormGroup({});
  fb = inject(FormBuilder);
}
