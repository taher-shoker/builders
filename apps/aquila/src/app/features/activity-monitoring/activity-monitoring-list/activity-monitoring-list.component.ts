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
  @ViewChild('startedAtTemplate') startedAtTemplate!: TemplateRef<any>;
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

  dataSource: any[] = [];
  filteredDataSource = this.dataSource;

  ngOnInit(): void {
    this.loadActivities();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.columnsSchema = [
        { key: 'createdBy', type: 'text', label: 'Email' },
        { key: 'userRole', type: 'text', label: 'User Role' },
        { key: 'actionName', type: 'text', label: 'Action' },
        {
          key: 'startedAt',
          type: 'custom',
          label: 'Date & Time',
          complexViewTemp: this.startedAtTemplate,
        },
        {
          key: 'status',
          type: 'custom',
          label: 'Status',
          complexViewTemp: this.statusCustomTemplate,
        },
      ];
    });
  }

  loadActivities(start = 0, end = 50): void {
    this.activityMonitoringService.getActivities(start, end).subscribe(
      (response: any) => {
        this.dataSource = response.userActivities || [];
        this.filteredDataSource = response.userActivities || [];
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
      const itemDate = new Date(item.startedAt);
      console.log(item);

      return (
        (!filters.createdBy ||
          item.createdBy
            .toLowerCase()
            .includes(filters.createdBy.toLowerCase())) &&
        (!filters.userRole?.value ||
          item.userRole === filters.userRole.value) &&
        (!filters.status?.value || item.status === filters.status.value) &&
        (!filters.actionName?.value ||
          item.actionName === filters.actionName.value) &&
        (!filters.startedAt ||
          (itemDate.getFullYear() === filters.startedAt.getFullYear() &&
            itemDate.getMonth() === filters.startedAt.getMonth() &&
            itemDate.getDate() === filters.startedAt.getDate() &&
            itemDate.getHours() === filters.startedAt.getHours() &&
            itemDate.getMinutes() === filters.startedAt.getMinutes()))
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
