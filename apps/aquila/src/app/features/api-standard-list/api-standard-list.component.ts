import { Component, computed, ElementRef, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUiModule } from '@stc-apps/shared-ui';
import { ActivatedRoute, Router } from '@angular/router';
import { Standard } from '../../shared/models/standards.models';
import { TableListComponent } from '../../shared/components/table-list/table-list.component';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { ColumnsSchema } from 'libs/shared-ui/src/lib/custom-table/custom-table.component';
import { ApiStandardFiltersComponent } from '../api-standard-filters/api-standard-filters.component';
import { StandardsService } from '../../shared/services/standards.service';

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

  tableActions = computed(() => ['pi pi-eye', 'pi pi-pen-to-square']);
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
    this.standardsService
      .getStandards()
      .then((response) => {
        this.originalStandards = response.standardDtoList;
        this.standards = this.originalStandards;
        this.businessAreaOptions = response.standardDtoList.map((area) => ({
          label: area.businessArea,
          value: area.businessArea,
        }));
      })
      .catch((error) => {});
  }

  private applyFilters(
    standards: Standard[],
    filters?: Record<string, unknown>
  ): Standard[] {
    if (!filters) {
      return standards;
    }

    return standards.filter((standard) => {
      const nameMatch =
        !filters['name'] ||
        standard.name
          .toLowerCase()
          .includes((filters['name'] as string).toLowerCase());
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
          state: { standard: rowData, isEditMode: true },
        });
        break;
      default:
        console.warn('Unknown action type:', actionType);
    }
  }

  onFiltersChanged(filters: Record<string, unknown>): void {
    this.standards = this.applyFilters(this.originalStandards, filters);
  }

  onSortChanged(direction: { label: string; value: 'asc' | 'desc' }): void {
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
