import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { UsersService } from '../users-settings/users.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BannerDataService, DialogService } from '@stc-apps/shared-ui';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import * as _ from 'lodash';
import { DataUploadService } from './data-upload.service';
import { UploadedFile } from '../../shared/models/data-upload.model';

export interface ColumnsSchema {
  key: string;
  type: string;
  label: string;
}

const COLUMNS_SCHEMA = [
  {
    key: 'jobId',
    type: 'text',
    label: 'Job Id',
  },

  {
    key: 'executedBy',
    type: 'text',
    label: 'Executed By',
  },
  {
    key: 'jobCategory',
    type: 'text',
    label: 'Job Category',
  },
  {
    key: 'parameters',
    type: 'text',
    label: 'Parameters',
  },
  {
    key: 'startTime',
    type: 'date',
    label: 'Start Time',
  },
  {
    key: 'endTime',
    type: 'date',
    label: 'End Time',
  },
  {
    key: 'sourceSubsidiaryName',
    type: 'text',
    label: 'Source Subsidary Name',
  },
  {
    key: 'status',
    type: '',
    label: 'Status',
  },
];

@Component({
  selector: 'stc-apps-data-upload',
  templateUrl: './data-upload.component.html',
  styleUrls: ['./data-upload.component.scss'],
})
export class DataUploadComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = COLUMNS_SCHEMA.map((col) => col.key);
  columnsSchema: ColumnsSchema[] = COLUMNS_SCHEMA;
  dataSource = new MatTableDataSource<UploadedFile>();
  dataSourceFilters = new MatTableDataSource<UploadedFile>();

  filterDictionary = new Map<string, string>();
  isLoading = false;
  uploadedFiles: File[] = [];
  @ViewChild(MatSort, { static: true })
  sort!: MatSort;
  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public _dataUploadService: DataUploadService,
    public userService: UsersService,
    private bannerDataService: BannerDataService,
    protected dialogService: DialogService
  ) {}

  getDataListing() {
    this._dataUploadService.getDataUpload().subscribe((res) => {
      this.dataSource.data = res;
    });
  }
  searchFilter(event: Event) {
    const searchVal = (event.target as HTMLInputElement).value;
    this.dataSource.filter = searchVal.trim().toLowerCase();
  }

  /** filters functions for dropDown  **/

  ngOnInit() {
    this.bannerDataService.updateData({ title: 'Data Upload', text: '' });
    this.getDataListing();

    this.dataSource.paginator = this.paginator;
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }
}
