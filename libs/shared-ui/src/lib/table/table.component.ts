import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';

export interface PeriodicElement {
  name: string;
  email: string;
  privilege: string;
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
    key: 'privilege',
    type: 'text',
    label: 'privilege',
  },
  {
    key: 'team',
    type: 'text',
    label: 'team',
  },
  {
    key: 'jobeTitle',
    type: 'text',
    label: 'Job Title',
  },
  {
    key: 'actions',
    type: 'actions',
    label: '',
  },
];

const ELEMENT_DATA: PeriodicElement[] = [
  {
    name: '',
    email: 'tshoker.stc@.com',
    privilege: 'creator',
    team: 'digital team',
    jobeTitle: 'front end developer',
    profileIcon:
      'https://img.freepik.com/premium-vector/arab-man-avatar-face-icon-keffiyeh_768258-36.jpg?w=740',
  },
];

@Component({
  selector: 'stc-apps-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  standalone : false
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
