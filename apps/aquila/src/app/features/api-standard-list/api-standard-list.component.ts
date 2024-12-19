import { Component, computed, ElementRef, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUiModule } from '@stc-apps/shared-ui';
import { Router } from '@angular/router';
import { ApiStandard } from '../../shared/models/standards.models';
import { TableListComponent } from '../../shared/components/table-list/table-list.component';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { ColumnsSchema } from 'libs/shared-ui/src/lib/custom-table/custom-table.component';
import { ApiStandardFiltersComponent } from '../api-standard-filters/api-standard-filters.component';

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
  router = inject(Router);
  el = inject(ElementRef<HTMLElement>);
  dataSource: ApiStandard[];
  newStandard!: ApiStandard;
  ELEMENT_DATA: ApiStandard[] = [
    {
      apiName: 'Standard 1',
      version: 'v1.0',
      businessArea: 'Business Area',
      lastUpdate: new Date(),
      publishDate: new Date(),
    },
    {
      apiName: 'Standard 2',
      version: 'v2.1',
      businessArea: 'Business Area',
      lastUpdate: new Date(),
      publishDate: new Date(),
    },
  ];

  displayedColumns: string[] = [
    'apiName',
    'version',
    'businessArea',
    'publishDate',
    'lastUpdate',
  ];

  columnsSchema: ColumnsSchema[] = [
    { key: 'apiName', type: 'text', label: 'Name' },
    { key: 'version', type: 'text', label: 'Version' },
    { key: 'businessArea', type: 'text', label: 'Business Area' },
    { key: 'publishDate', type: 'text', label: 'Publish Date' },
    { key: 'lastUpdate', type: 'text', label: 'Latest Update Date' },
  ];

  tableActions = computed(() => {
    const actions = ['pi pi-eye', 'pi pi-pen-to-square'];
    return actions;
  });

  constructor() {
    this.dataSource = this.ELEMENT_DATA;
  }
  ngOnInit(): void {
    const newStandard = history.state.newStandard;
    if (newStandard) {
      this.newStandard = newStandard;
      this.dataSource.push(this.newStandard);
    }
  }

  onAddStandard(): void {
    this.router.navigate(['api-standard-form']);
  }

  onEditStandard(standard: ApiStandard) {
    this.router.navigate(['api-standard-form'], { state: { standard } });
  }

  onFiltersChanged(filters: any) {}

  onSortChanged(direction: 'asc' | 'desc') {}
}
