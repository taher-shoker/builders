import {
  AfterViewInit,
  Component,
  inject,
  OnInit,
  TemplateRef,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableListComponent } from '../../../shared/components/table-list/table-list.component';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { ColumnsSchema } from 'libs/shared-ui/src/lib/custom-table/custom-table.component';
import { SharedUiModule } from '@stc-apps/shared-ui';
import { ActivityMonitoringFiltersComponent } from '../activity-monitoring-filters/activity-monitoring-filters.component';
import { ActivityMonitoringService } from '../services/activity-monitoring.service';
import { ChipModule } from 'primeng/chip';
import { Subject, takeUntil } from 'rxjs';
import { Activity } from '../models/activity.model';

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
export class ActivityMonitoringListComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild('statusCustomTemplate')
  statusCustomTemplate!: TemplateRef<unknown>;
  @ViewChild('startedAtTemplate') startedAtTemplate!: TemplateRef<unknown>;

  private readonly destroy$ = new Subject<void>();
  private readonly activityMonitoringService = inject(
    ActivityMonitoringService
  );
  columnsSchema: ColumnsSchema[] = [];
  appliedFilters: Array<{ key: string; label: string; value: unknown }> = [];

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

  dataSource: Activity[] = [];
  filteredDataSource: Activity[] = this.dataSource;

  ngOnInit(): void {
    this.setupDataSubscription();
  }

  private setupDataSubscription(): void {
    this.activityMonitoringService.activities$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.dataSource = response.userActivities ?? [];
          this.filteredDataSource = response.userActivities ?? [];
        },
        error: (error) => console.error('Error fetching activities:', error),
      });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initializeColumnsSchema();
    });
  }

  private initializeColumnsSchema(): void {
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
  }

  onFiltersChanged(filters: Record<string, unknown>): void {
    this.processAppliedFilters(filters);
    this.activityMonitoringService.updateFilters(filters);
  }

  private processAppliedFilters(filters: Record<string, unknown>): void {
    this.appliedFilters = Object.entries(filters)
      .filter(([_, value]) => value !== null && value !== '')
      .map(([key, value]) => ({
        key,
        label: this.getFilterLabel(key),
        value:
          key === 'startedAt' && typeof value === 'string'
            ? new Date(value)
            : value,
      }));
  }

  removeFilter(
    filter: { key: string; label: string; value: unknown },
    filtersComponent: ActivityMonitoringFiltersComponent
  ): void {
    this.appliedFilters = this.appliedFilters.filter(
      (f) => f.key !== filter.key
    );
    filtersComponent.resetFilterControl(filter.key);
    this.activityMonitoringService.updateFilters(
      filtersComponent.filterForm.value
    );
  }

  clearFilters(filtersComponent: ActivityMonitoringFiltersComponent): void {
    this.appliedFilters = [];
    filtersComponent.resetAllFilters();
    this.activityMonitoringService.updateFilters(
      filtersComponent.filterForm.value
    );
  }

  getFilterLabel(key: string): string {
    const filterLabels: Record<string, string> = {
      createdBy: 'Email',
      userRole: 'User Role',
      status: 'Status',
      actionName: 'Action',
      startedAt: 'Date',
    };
    return filterLabels[key] ?? key;
  }

  downloadFile(path: string, fileName: string): void {
    const fileExtension = path.slice(path.lastIndexOf('.')).toLowerCase();
    const mimeTypes: Record<string, string> = {
      '.pdf': 'application/pdf',
      '.html': 'text/html',
    };
    const mimeType = mimeTypes[fileExtension] ?? 'application/octet-stream';

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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
