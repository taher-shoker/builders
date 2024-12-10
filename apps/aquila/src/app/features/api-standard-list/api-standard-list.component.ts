import { AfterViewInit, Component, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { SharedUiModule } from '@stc-apps/shared-ui';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { Router } from '@angular/router';
import { ApiStandard } from '../../core/models/standards.models';

@Component({
  selector: 'stc-apps-api-standard-list',
  standalone: true,
  imports: [
    CommonModule,
    MatPaginatorModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatDatepickerModule,
    SharedUiModule,
  ],
  templateUrl: './api-standard-list.component.html',
  styleUrls: ['./api-standard-list.component.scss'],
})
export class ApiStandardListComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  router = inject(Router);
  dataSource: MatTableDataSource<ApiStandard>;
  ELEMENT_DATA: ApiStandard[] = [
    {
      standardName: 'Standard 1',
      version: 'v1.0',
      lastUpdate: new Date(),
      publishDate: new Date(),
    },
    {
      standardName: 'Standard 2',
      version: 'v2.1',
      lastUpdate: new Date(),
      publishDate: new Date(),
    },
  ];
  displayedColumns: string[] = [
    'standardName',
    'version',
    'lastUpdate',
    'publishDate',
    'actions',
  ];

  constructor() {
    this.dataSource = new MatTableDataSource<ApiStandard>(this.ELEMENT_DATA);
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  onAddStandard(): void {
    this.router.navigate(['api-standard-form']);
  }

  onEditStandard(standard: ApiStandard) {
    this.router.navigate(['api-standard-form'], { state: { standard } });
  }
}
