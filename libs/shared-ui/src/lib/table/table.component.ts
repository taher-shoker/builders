import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { TableDataSource, TableItem } from './table-datasource';
import { SelectionModel } from '@angular/cdk/collections';
import { ResizeEvent } from 'angular-resizable-element';
import { ToastrService } from 'ngx-toastr';

export interface PeriodicElement {
  name: string;
  email: string;
  privilage: string;
  team: string;
  jobeTitle: string;
  profileIcon: string;
}
const COLUMNS_SCHEMA = [
  {
    key: 'name',
    type: 'text',
    label: 'Name',
  },

  {
    key: 'privilage',
    type: 'text',
    label: 'privilage',
  },
  {
    key: 'team',
    type: 'text',
    label: 'team',
  },
  {
    key: 'jobeTitle',
    type: 'text',
    label: 'jobe Title',
  },
  {
    key: 'actions',
    type: 'actions',
    label: '',
  },
];

const ELEMENT_DATA: PeriodicElement[] = [
  // {
  //   name: 'taher shoker',
  //   email: 'tshoker.stc@.com',
  //   privilage: 'creator',
  //   team: 'digital team',
  //   jobeTitle: 'front end developer',
  //   profileIcon:
  //     'https://img.freepik.com/premium-vector/arab-man-avatar-face-icon-keffiyeh_768258-36.jpg?w=740',
  // },
];

@Component({
  selector: 'stc-apps-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit {
  displayedColumns: string[] = COLUMNS_SCHEMA.map((col) => col.key);
  columnsSchema: any[] = COLUMNS_SCHEMA;

  constructor(private toastr: ToastrService) {}

  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  selection = new SelectionModel<PeriodicElement>(true, []);

  @ViewChild(MatSort, { static: true })
  sort!: MatSort;
  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;

  showSuccess() {
    this.toastr.success('Hello world!', 'Toastr fun!');
  }

  ngOnInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
}
