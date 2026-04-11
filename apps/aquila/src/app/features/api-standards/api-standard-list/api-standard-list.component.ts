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
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { StandardFiltersFormValue } from '../api-standard-filters/api-standard-filters.component';

@Component({
  selector: 'stc-apps-api-standard-list',
  standalone: true,
  imports: [
    CommonModule,
    SharedUiModule,
    TableListComponent,
    ApiStandardFiltersComponent,
    ConfirmDialogModule,
    ToastModule,
    TooltipModule,
  ],
  templateUrl: './api-standard-list.component.html',
  styleUrls: ['./api-standard-list.component.scss'],
  providers: [ConfirmationService, MessageService],
})
export class ApiStandardListComponent implements OnInit, AfterViewInit {
  @ViewChild('publishUpdateTemplate')
  publishUpdateTemplate!: TemplateRef<unknown>;
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly standardsService = inject(StandardsService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);

  readonly el = inject(ElementRef<HTMLElement>);
  standards: Standard[] = [];
  isLoading = false;

  readonly displayedColumns: string[] = [
    'name',
    'domain',
    'version',
    'businessArea',
    'publishUpdate',
  ];

  columnsSchema: ColumnsSchema[] = [];

  readonly tableActions = computed(() => [
    { action: 'pi pi-eye', title: 'View Details' },
    { action: 'pi pi-trash', title: 'Delete' },
  ]);
  businessAreaOptions: { label: string; value: string }[] = [];
  originalStandards: Standard[] = [];

  ngOnInit(): void {
    this.loadStandards();
  }

  ngAfterViewInit(): void {
    this.initializeColumnsSchema();
  }

  private initializeColumnsSchema(): void {
    this.columnsSchema = [
      { key: 'name', type: 'text', label: 'Name' },
      { key: 'domain', type: 'text', label: 'Domain' },
      { key: 'version', type: 'text', label: 'Version' },
      { key: 'businessArea', type: 'text', label: 'Business Area' },
      {
        key: 'publishUpdate',
        type: 'custom',
        label: 'Publish Date',
        complexViewTemp: this.publishUpdateTemplate,
      },
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
        this.businessAreaOptions = Array.from(
          new Set(response.standardDtoList.map((area) => area.businessArea))
        ).map((area) => ({
          label: area,
          value: area,
        }));
      },
      error: (error) => {
        console.error('Error loading standards:', error);
      },
    });
  }

  private applyFilters(
    standards: Standard[],
    filters?: StandardFiltersFormValue
  ): Standard[] {
    if (!filters || Object.values(filters).every((value) => !value)) {
      return standards;
    }

    return standards.filter((standard) => {
      const matches = {
        name:
          !filters.name ||
          standard.name
            .toLowerCase()
            .includes(String(filters.name).toLowerCase()),
        publishUpdate:
          !filters.publishUpdate ||
          this.formatDate(standard.publishUpdate as Date).slice(0, -3) ===
            this.formatDate(filters.publishUpdate),
        lastUpdate:
          !filters.lastUpdate ||
          this.formatDate(standard.lastUpdate as Date).slice(0, -3) ===
            this.formatDate(filters.lastUpdate).slice(0, -3),
        businessArea:
          !filters.businessArea ||
          standard.businessArea === filters.businessArea,
      };

      return Object.values(matches).every(Boolean);
    });
  }

  private formatDate(date: Date | string): string {
    if (typeof date === 'string') {
      return date;
    }

    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      '0'
    )}-${String(date.getDate()).padStart(2, '0')}T${String(
      date.getHours()
    ).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  }

  onActionHandler(event: { actionType: string; rowData: Standard }): void {
    const { actionType, rowData } = event;

    const actions: Record<string, () => void> = {
      'pi pi-eye': () =>
        this.router.navigate(['view-standard'], {
          relativeTo: this.route,
          state: { standard: rowData },
        }),
      'pi pi-trash': () => this.confirmDelete(rowData),
    };

    const action = actions[actionType as keyof typeof actions];
    if (action) {
      action();
    } else {
      console.warn('Unknown action type:', actionType);
    }
  }

  private confirmDelete(standard: Standard): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${standard.name}?`,
      header: 'Delete Standard',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text p-button-text',
      acceptIcon: 'none',
      rejectIcon: 'none',
      accept: () => {
        this.standardsService.deleteStandard(standard.id).subscribe({
          next: () => {
            this.loadStandards();
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: `${standard.name} has been deleted successfully`,
            });
          },
          error: (error) => {
            console.error('Error deleting standard:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to delete the standard',
            });
          },
        });
      },
    });
  }

  onFiltersChanged(filters: StandardFiltersFormValue): void {
    const processedFilters: StandardFiltersFormValue = {
      ...filters,
      publishUpdate: filters.publishUpdate
        ? this.formatDate(filters.publishUpdate)
        : null,
      lastUpdate: filters.lastUpdate
        ? this.formatDate(filters.lastUpdate)
        : null,
    };

    this.standards = this.applyFilters(
      this.originalStandards,
      processedFilters
    );
  }

  onSortChanged(direction: { label: string; value: 'asc' | 'desc' }): void {
    if (!direction?.value) {
      return;
    }

    this.standards = [...this.standards].sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      return direction.value === 'asc'
        ? nameA.localeCompare(nameB, 'en', { sensitivity: 'base' })
        : nameB.localeCompare(nameA, 'en', { sensitivity: 'base' });
    });
  }
}
