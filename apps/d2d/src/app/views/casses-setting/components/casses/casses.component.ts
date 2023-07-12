import { Component, AfterViewInit, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { BannerDataService, DialogService } from '@stc-apps/shared-ui';
import {
  CaseStatus,
  CassesService,
  Task,
  TaskCicle,
} from '../../casses.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
    key: 'customerName',
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
    key: 'existingPhoneNumber',
    type: 'text',
    label: 'Existing Phone Number',
  },
  {
    key: 'caseStatus',
    type: 'text',
    label: 'Case Status',
  },
  {
    key: 'actions',
    type: 'actions',
    label: '',
  },
];

@Component({
  selector: 'stc-apps-casses',
  templateUrl: './casses.component.html',
  styleUrls: ['./casses.component.scss'],
})
export class CassesComponent implements OnInit, AfterViewInit {
  form!: FormGroup;
  isLoading = true;
  totalRegisted = 0;
  totalInProgress = 0;
  totalPending = 0;
  totalClosed = 0;
  readonly CaseStatus = CaseStatus;
  readonly TaskCicle = TaskCicle;
  constructor(
    private formBuilder: FormBuilder,
    public router: Router,
    public route: ActivatedRoute,
    private bannerDataService: BannerDataService,
    public cassesService: CassesService,
    protected dialogService: DialogService
  ) {}

  allItems!: Task[];
  addCasseNavigate(): void {
    this.router.navigate(['./add-casse'], { relativeTo: this.route });
  }
  displayedColumns: string[] = COLUMNS_SCHEMA.map((col) => col.key);
  columnsSchema: any[] = COLUMNS_SCHEMA;

  dataSource = new MatTableDataSource<PeriodicElement>();

  @ViewChild(MatSort)
  sort!: MatSort;
  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;
  disabled = false;

  detailsNavigate(id: string) {
    this.router.navigate(['./casse-details', id], { relativeTo: this.route });
  }
  getCassesListing() {
    this.cassesService.getCasses().subscribe((res: any) => {
      this.isLoading = false;
      this.dataSource.data = res;
      this.totalRegisted = res.filter(
        (d: any) => d.caseStatus === CaseStatus.registered
      ).length;
      this.totalInProgress = res.filter(
        (d: any) => d.caseStatus === CaseStatus.inprogress
      ).length;
      this.totalPending = res.filter(
        (d: any) => d.caseStatus === CaseStatus.pending
      ).length;
      this.totalClosed = res.filter(
        (d: any) => d.caseStatus === CaseStatus.closed
      ).length;
    });
  }
  getAssigneeTasks() {
    this.cassesService.getAssigneeTasks().subscribe((res: any) => {
      this.allItems = res.data;
    });
  }

  navigateToTask(caseId: number) {
    this.router.navigate(['./casse-details', caseId], {
      relativeTo: this.route,
    });
  }
  toggleFilter() {
    this.dialogService.open('filter-Modal');
  }
  serchForm() {
    this.form = this.formBuilder.group({
      customerName: [''],
      city: [''],
      existingServiceOrder: [''],
      serviceType: [''],
      existingPlate: [''],
      existingPhoneNumber: [''],
      activationDate: [''],
      wfmOrder: [''],
      newPlate: [''],
      newServiceOrder: [''],
      newPhoneNumber: [''],
      contactNumber: [''],
      caseLabel: [''],
      description: [''],
    });
  }
  ngOnInit() {
    this.getCassesListing();
    this.getAssigneeTasks();
    this.bannerDataService.updateData({ title: 'home', text: '' });
    this.dataSource.paginator = this.paginator;
    this.serchForm();
  }
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  OnChangesForm() {
    this.form.valueChanges.subscribe((val) => {
      this.disabled = true;
    });
  }

  searchFilter(event: Event) {
    const searchVal = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();
    this.dataSource.filter = searchVal;
  }
  onSubmit() {
    console.log('jkjh');
  }
  clearFormFilter() {
    this.form.reset();
  }
}
