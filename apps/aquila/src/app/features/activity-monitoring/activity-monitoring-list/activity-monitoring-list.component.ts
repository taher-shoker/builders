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
import { PaginatorModule } from 'primeng/paginator';

@Component({
  selector: 'stc-apps-activity-monitoring',
  standalone: true,
  imports: [
    CommonModule,
    TableListComponent,
    SharedUiModule,
    ActivityMonitoringFiltersComponent,
    ChipModule,
    PaginatorModule,
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
  private readonly STORAGE_KEYS = {
    CURRENT_PAGE: 'currentPage',
    ROWS_PER_PAGE: 'rowsPerPage',
  };

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
  totalRecords = 0;
  rows = this.getStoredValue(this.STORAGE_KEYS.ROWS_PER_PAGE, 10);
  first = 0;

  private readonly filterLabels: Record<string, string> = {
    createdBy: 'Email',
    userRole: 'User Role',
    status: 'Status',
    actionName: 'Action',
    startedAt: 'Date',
  };

  ngOnInit(): void {
    this.initializePagination();
    this.setupDataSubscription();
  }

  private initializePagination(): void {
    const savedPage = this.getStoredValue(this.STORAGE_KEYS.CURRENT_PAGE, 1);
    const savedRows = this.getStoredValue(this.STORAGE_KEYS.ROWS_PER_PAGE, 10);
    this.first = (savedPage - 1) * savedRows;
    this.rows = savedRows;
    this.activityMonitoringService.updatePagination(savedPage, savedRows);
  }

  private getStoredValue(key: string, defaultValue: number): number {
    return Number(localStorage.getItem(key)) || defaultValue;
  }

  private setupDataSubscription(): void {
    this.activityMonitoringService.activities$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.dataSource = response.userActivities ?? [];
          this.filteredDataSource = response.userActivities ?? [];
          this.totalRecords = response.count;
        },
        error: (error) => console.error('Error fetching activities:', error),
      });
  }

  onPageChange(event: any): void {
    const pageNumber = event.page + 1;
    const pageSize = event.rows;

    this.first = event.first;
    this.rows = pageSize;

    this.updateStorageValues(pageNumber, pageSize);
    this.activityMonitoringService.updatePagination(pageNumber, pageSize);
  }

  private updateStorageValues(pageNumber: number, rows: number): void {
    localStorage.setItem(this.STORAGE_KEYS.CURRENT_PAGE, pageNumber.toString());
    localStorage.setItem(this.STORAGE_KEYS.ROWS_PER_PAGE, rows.toString());
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
    this.first = 0;
    this.rows = 10;
    this.activityMonitoringService.updatePagination(1, this.rows);
    this.processAppliedFilters(filters);
    this.activityMonitoringService.updateFilters(filters);
  }

  private processAppliedFilters(filters: Record<string, unknown>): void {
    this.appliedFilters = Object.entries(filters)
      .filter(([_, value]) => value !== null && value !== '')
      .map(([key, value]) => ({
        key,
        label: this.getFilterLabel(key),
        value: this.formatFilterValue(key, value),
      }));
  }

  private formatFilterValue(key: string, value: unknown): unknown {
    return key === 'startedAt' && typeof value === 'string'
      ? new Date(value)
      : value;
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
    return this.filterLabels[key] ?? key;
  }

  downloadFile(path: string, fileName: string): void {
    const fileExtension = path.slice(path.lastIndexOf('.')).toLowerCase();
    const mimeTypes: Record<string, string> = {
      '.pdf': 'application/pdf',
      '.html': 'text/html',
    };
    const mimeType = mimeTypes[fileExtension] ?? 'application/octet-stream';

    try {
      const blob = new Blob([path], { type: mimeType });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  }

  ngOnDestroy(): void {
    localStorage.removeItem(this.STORAGE_KEYS.CURRENT_PAGE);
    localStorage.removeItem(this.STORAGE_KEYS.ROWS_PER_PAGE);
    this.destroy$.next();
    this.destroy$.complete();
  }
}
