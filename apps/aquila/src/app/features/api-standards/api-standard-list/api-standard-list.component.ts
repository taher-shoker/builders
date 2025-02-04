import { Component, computed, ElementRef, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUiModule } from '@stc-apps/shared-ui';
import { ActivatedRoute, Router } from '@angular/router';
import { Standard } from '../../../shared/models/standards.models';
import { TableListComponent } from '../../../shared/components/table-list/table-list.component';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { ColumnsSchema } from 'libs/shared-ui/src/lib/custom-table/custom-table.component';
import { ApiStandardFiltersComponent } from '../api-standard-filters/api-standard-filters.component';
import { StandardsService } from '../../../shared/services/standards.service';

@Component({
  selector: 'stc-apps-api-standard-list',
  standalone: true,
  imports: [
    CommonModule,
    SharedUiModule,
    TableListComponent,
    ApiStandardFiltersComponent,
  ],
  templateUrl: './api-standard-list.component.html',
  styleUrls: ['./api-standard-list.component.scss'],
})
export class ApiStandardListComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private standardsService = inject(StandardsService);

  el = inject(ElementRef<HTMLElement>);
  standards: Standard[] = [];
  isLoading = false;

  displayedColumns: string[] = [
    'name',
    'version',
    'businessArea',
    'publishUpdate',
    'lastUpdate',
  ];

  columnsSchema: ColumnsSchema[] = [
    { key: 'name', type: 'text', label: 'Name' },
    { key: 'version', type: 'text', label: 'Version' },
    { key: 'businessArea', type: 'text', label: 'Business Area' },
    { key: 'publishUpdate', type: 'text', label: 'Publish Date' },
    { key: 'lastUpdate', type: 'text', label: 'Latest Update Date' },
  ];

  tableActions = computed(() => [
    { action: 'pi pi-eye', title: 'View Details' },
    { action: 'pi pi-pen-to-square', title: 'Edit' },
  ]);
  businessAreaOptions: { label: string; value: string }[] = [];
  originalStandards: Standard[] = [];

  ngOnInit(): void {
    this.loadStandards();
  }

  onAddStandard(): void {
    this.router.navigate(['add-standard'], {
      relativeTo: this.route,
    });
  }

  private loadStandards(): void {
    this.standardsService.getStandards().subscribe({
      next: (response) => {
        this.originalStandards = response.standardDtoList;
        this.standards = this.originalStandards;
        const uniqueBusinessAreas = new Set(
          response.standardDtoList.map((area) => area.businessArea)
        );

        this.businessAreaOptions = Array.from(uniqueBusinessAreas).map(
          (area) => ({
            label: area,
            value: area,
          })
        );
      },
      error: (error) => {
        console.error('Error loading standards:', error);
      },
    });
  }

  private applyFilters(
    standards: Standard[],
    filters?: Record<string, unknown>
  ): Standard[] {
    if (!filters) return standards;
    return standards.filter((standard) => {
      const nameMatch =
        !filters['name'] ||
        standard.name
          .toLowerCase()
          .includes(String(filters['name']).toLowerCase());

      const publishUpdateMatch =
        !filters['publishUpdate'] ||
        standard.publishUpdate === filters['publishUpdate'];

      const lastUpdateMatch =
        !filters['lastUpdate'] || standard.lastUpdate === filters['lastUpdate'];

      const businessAreaMatch =
        !filters['businessArea'] ||
        standard.businessArea === filters['businessArea'];

      return (
        nameMatch && publishUpdateMatch && lastUpdateMatch && businessAreaMatch
      );
    });
  }

  private formatDate(date: Date | string): string {
    if (typeof date === 'string') {
      return date;
    }

    return (
      [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, '0'),
        String(date.getDate()).padStart(2, '0'),
      ].join('-') +
      'T' +
      [
        String(date.getHours()).padStart(2, '0'),
        String(date.getMinutes()).padStart(2, '0'),
        String(date.getSeconds()).padStart(2, '0'),
      ].join(':')
    );
  }

  onActionHandler(event: { actionType: string; rowData: Standard }): void {
    const { actionType, rowData } = event;

    switch (actionType) {
      case 'pi pi-eye':
        this.router.navigate(['view-standard'], {
          relativeTo: this.route,
          state: { standard: rowData },
        });
        break;
      case 'pi pi-pen-to-square':
        this.router.navigate(['edit-standard'], {
          relativeTo: this.route,
          state: {
            standard: rowData,
            isEditMode: true,
          },
        });
        break;
      default:
        console.warn('Unknown action type:', actionType);
    }
  }

  onFiltersChanged(filters: Record<string, unknown>): void {
    const processedFilters = { ...filters };

    if (processedFilters['publishUpdate']) {
      processedFilters['publishUpdate'] = this.formatDate(
        processedFilters['publishUpdate'] as Date
      );
    }

    if (processedFilters['lastUpdate'] instanceof Date) {
      processedFilters['lastUpdate'] = this.formatDate(
        processedFilters['lastUpdate'] as Date
      );
    }

    this.standards = this.applyFilters(
      this.originalStandards,
      processedFilters
    );
  }

  onSortChanged(direction: { label: string; value: 'asc' | 'desc' }): void {
    if (!direction || !direction.value) {
      return;
    }

    const sortedStandards = [...this.standards].sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();

      return direction.value === 'asc'
        ? nameA.localeCompare(nameB, 'en', { sensitivity: 'base' })
        : nameB.localeCompare(nameA, 'en', { sensitivity: 'base' });
    });

    this.standards = sortedStandards;
  }
}
