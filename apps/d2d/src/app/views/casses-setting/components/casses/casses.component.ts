import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';

export interface PeriodicElement {
  id: string;
  name: string;
  city: string;
  existingServiceOrder: string;
  serviceType: string;
  serviceNumber: string;
  existingPhoneNumber: string;
}
const COLUMNS_SCHEMA = [
  {
    key: 'name',
    type: 'text',
    label: 'Name',
  },

  {
    key: 'city',
    type: 'text',
    label: 'city',
  },
  {
    key: 'existingServiceOrder',
    type: 'text',
    label: 'Existing Service Order',
  },
  {
    key: 'serviceType',
    type: 'text',
    label: 'Service Type',
  },
  {
    key: 'serviceNumber',
    type: 'text',
    label: 'Service Number',
  },
  {
    key: 'existingPhoneNumber',
    type: 'text',
    label: 'Existing Phone Number',
  },
  {
    key: 'actions',
    type: 'actions',
    label: '',
  },
];

const ELEMENT_DATA: PeriodicElement[] = [
  {
    id: '012343434',
    name: 'taher shoker',
    city: 'Jadah',
    existingServiceOrder: '123456',
    serviceType: 'Mobile data',
    serviceNumber: '0123456789',
    existingPhoneNumber: '0123456789',
  },
];

@Component({
  selector: 'stc-apps-casses',
  templateUrl: './casses.component.html',
  styleUrls: ['./casses.component.scss'],
})
export class CassesComponent implements OnInit {
  constructor(public router: Router, public route: ActivatedRoute) {}

  addNewCasseLabel = 'Add New Casse';

  addCasseNavigate(): void {
    this.router.navigate(['./add-casse'], { relativeTo: this.route });
  }
  displayedColumns: string[] = COLUMNS_SCHEMA.map((col) => col.key);
  columnsSchema: any[] = COLUMNS_SCHEMA;

  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  @ViewChild(MatSort, { static: true })
  sort!: MatSort;
  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;

  detailsNavigate(id: string) {
    this.router.navigate(['./casse-details', id], { relativeTo: this.route });
  }

  ngOnInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
}
