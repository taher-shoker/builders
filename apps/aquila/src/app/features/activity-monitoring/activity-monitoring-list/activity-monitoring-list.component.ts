import {
  AfterViewInit,
  Component,
  inject,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableListComponent } from '../../../shared/components/table-list/table-list.component';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { ColumnsSchema } from 'libs/shared-ui/src/lib/custom-table/custom-table.component';
import { SharedUiModule } from '@stc-apps/shared-ui';
import { ActivityMonitoringFiltersComponent } from '../activity-monitoring-filters/activity-monitoring-filters.component';
import { ActivityMonitoringService } from '../services/activity-monitoring.service';
import { ChipModule } from 'primeng/chip';

@Component({
  selector: 'stc-apps-activity-monitoring',
  standalone: true,
  imports: [
    CommonModule,
    TableListComponent,
    SharedUiModule,
    ActivityMonitoringFiltersComponent,
    ChipModule,
  ],
  templateUrl: './activity-monitoring-list.component.html',
  styleUrls: ['./activity-monitoring-list.component.scss'],
})
export class ActivityMonitoringListComponent implements OnInit, AfterViewInit {
  @ViewChild('statusCustomTemplate') statusCustomTemplate!: TemplateRef<any>;
  activityMonitoringService = inject(ActivityMonitoringService);
  columnsSchema: ColumnsSchema[] = [];
  appliedFilters: { key: string; label: string; value: any }[] = [];

  exportItems = [
    {
      icon: 'pi pi-download',
      label: 'PDF',
      command: () =>
        this.downloadFile('path/to/summaryFileJson', 'Activity Monitoring.pdf'),
    },
    {
      icon: 'pi pi-download',
      label: 'HTML',
      command: () =>
        this.downloadFile(
          'path/to/summaryFileHtml',
          'Activity Monitoring.html'
        ),
    },
  ];
  dataSource = [
    {
      email: 'john.doe@example.com',
      userRole: 'User',
      action: 'Login',
      dateTime: '2023-10-01 10:30 AM',
      status: 'Success',
    },
    {
      email: 'jane.smith@example.com',
      userRole: 'Admin',
      action: 'Add standard',
      dateTime: '2023-10-01 11:15 AM',
      status: 'Success',
    },
    {
      email: 'alice.johnson@example.com',
      userRole: 'Admin',
      action: 'Update standard',
      dateTime: '2023-10-01 12:00 PM',
      status: 'Failed',
    },
    {
      email: 'bob.brown@example.com',
      userRole: 'Admin',
      action: 'Add standard',
      dateTime: '2023-10-01 01:45 PM',
      status: 'Success',
    },
    {
      email: 'charlie.davis@example.com',
      userRole: 'User',
      action: 'Login',
      dateTime: '2023-10-01 02:30 PM',
      status: 'Failed',
    },
  ];
  filteredDataSource = this.dataSource;
  activities: any[] = [];

  ngOnInit(): void {
    this.loadActivities();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.columnsSchema = [
        { key: 'email', type: 'text', label: 'Email' },
        { key: 'userRole', type: 'text', label: 'User Role' },
        { key: 'action', type: 'text', label: 'Action' },
        { key: 'dateTime', type: 'text', label: 'Date & Time' },
        {
          key: 'status',
          type: 'custom',
          label: 'Status',
          complexViewTemp: this.statusCustomTemplate,
        },
      ];
    });
  }

  loadActivities(start?: number, end?: number): void {
    this.activityMonitoringService.getActivities(start, end).subscribe(
      (data: any) => {
        this.activities = data;
      },
      (error) => {
        console.error('Error fetching activities:', error);
      }
    );
  }

  onFiltersChanged(filters: any) {
    this.appliedFilters = [];

    Object.keys(filters).forEach((key) => {
      if (filters[key]) {
        this.appliedFilters.push({
          key,
          label: this.getFilterLabel(key),
          value: filters[key].value || filters[key],
        });
      }
    });

    this.filteredDataSource = this.dataSource.filter((item) => {
      return (
        (!filters.email ||
          item.email.toLowerCase().includes(filters.email.toLowerCase())) &&
        (!filters.userRole?.value ||
          item.userRole === filters.userRole.value) &&
        (!filters.status?.value || item.status === filters.status.value) &&
        (!filters.action?.value || item.action === filters.action.value) &&
        (!filters.date ||
          new Date(item.dateTime).toDateString() ===
            new Date(filters.date).toDateString())
      );
    });
  }

  removeFilter(
    filter: { key: string; label: string; value: any },
    filtersComponent: ActivityMonitoringFiltersComponent
  ) {
    this.appliedFilters = this.appliedFilters.filter(
      (f) => f.key !== filter.key
    );
    filtersComponent.resetFilterControl(filter.key);

    this.onFiltersChanged(filtersComponent.filterForm.value);
  }

  clearFilters(filtersComponent: ActivityMonitoringFiltersComponent) {
    this.appliedFilters = [];
    filtersComponent.resetAllFilters();
    this.onFiltersChanged(filtersComponent.filterForm.value);
  }

  getFilterLabel(key: string): string {
    switch (key) {
      case 'email':
        return 'Email';
      case 'userRole':
        return 'User Role';
      case 'status':
        return 'Status';
      case 'action':
        return 'Action';
      case 'date':
        return 'Date';
      default:
        return key;
    }
  }

  downloadFile(path: string, fileName: string) {
    const fileExtension = path.slice(path.lastIndexOf('.')).toLowerCase();
    const mimeTypes: Record<string, string> = {
      '.pdf': 'application/pdf',
      '.html': 'text/html',
    };
    const mimeType = mimeTypes[fileExtension] || 'application/octet-stream';

    const blob = new Blob([path], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
}
