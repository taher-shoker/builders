import {
  AfterViewInit,
  Component,
  computed,
  ElementRef,
  inject,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
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
export class ApiStandardListComponent implements OnInit, AfterViewInit {
  @ViewChild('publishUpdateTemplate')
  publishUpdateTemplate!: TemplateRef<unknown>;
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

  columnsSchema: ColumnsSchema[] = [];

  tableActions = computed(() => [
    { action: 'pi pi-eye', title: 'View Details' },
    { action: 'pi pi-pen-to-square', title: 'Edit' },
  ]);
  businessAreaOptions: { label: string; value: string }[] = [];
  originalStandards: Standard[] = [];

  ngOnInit(): void {
    this.loadStandards();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initializeColumnsSchema();
    });
  }

  private initializeColumnsSchema(): void {
    this.columnsSchema = [
      { key: 'name', type: 'text', label: 'Name' },
      { key: 'version', type: 'text', label: 'Version' },
      { key: 'businessArea', type: 'text', label: 'Business Area' },
      {
        key: 'publishUpdate',
        type: 'custom',
        label: 'Publish Date',
        complexViewTemp: this.publishUpdateTemplate,
      },
      { key: 'lastUpdate', type: 'text', label: 'Latest Update Date' },
    ];
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
    if (!filters || Object.values(filters).every((value) => !value)) {
      return standards;
    }

    return standards.filter((standard) => {
      let matches = true;

      if (filters['name']) {
        matches =
          matches &&
          standard.name
            .toLowerCase()
            .includes(String(filters['name']).toLowerCase());
      }

      if (filters['publishUpdate']) {
        const filterDate = this.formatDate(filters['publishUpdate'] as Date);
        const standardDate = this.formatDate(
          standard.publishUpdate as Date
        ).slice(0, -3);
        matches = matches && standardDate === filterDate;
      }

      if (filters['lastUpdate']) {
        const filterDate = this.formatDate(filters['lastUpdate'] as Date).slice(
          0,
          -3
        );
        const standardDate = this.formatDate(standard.lastUpdate as Date).slice(
          0,
          -3
        );
        matches = matches && standardDate === filterDate;
      }

      if (filters['businessArea']) {
        matches = matches && standard.businessArea === filters['businessArea'];
      }

      return matches;
    });
  }

  private formatDate(date: Date | string): string {
    if (typeof date === 'string') {
      return date;
    }

    const hours = date.getHours();
    const minutes = date.getMinutes();

    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      '0'
    )}-${String(date.getDate()).padStart(2, '0')}T${String(hours).padStart(
      2,
      '0'
    )}:${String(minutes).padStart(2, '0')}`;
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

    if (processedFilters['lastUpdate']) {
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
